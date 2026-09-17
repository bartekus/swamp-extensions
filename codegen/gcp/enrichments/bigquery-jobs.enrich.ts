// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const bigqueryQueryMethods = {
  run_query: {
    description:
      "submit a query job, poll until completion, paginate and persist all result rows with job provenance — fails on maxResults breach rather than silently truncating",
    arguments: z.object({
      query: z.string().describe("Standard SQL query string"),
      location: z.string().describe(
        "BigQuery location for the job, e.g. US, EU, us-central1",
      ).optional(),
      maximumBytesBilled: z.string().describe(
        "Limit on bytes billed — query fails if exceeded (string to avoid precision loss)",
      ).optional(),
      useLegacySql: z.boolean().describe(
        "Use legacy SQL dialect (default false)",
      ).optional(),
      queryParameters: z.array(z.record(z.string(), z.unknown())).describe(
        "Named or positional query parameters",
      ).optional(),
      maxResults: z.number().describe(
        "Maximum total rows to retrieve before failing with an explicit truncation error (default 100000)",
      ).optional(),
    }),
    execute: async (
      args: Record<string, unknown>,
      context: {
        globalArgs: Record<string, unknown>;
        writeResource: (
          type: string,
          name: string,
          data: unknown,
        ) => Promise<unknown>;
      },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const projectId = await getProjectId(credentials);

      const queryText = args.query as string;
      const location = args.location as string | undefined;
      const maximumBytesBilled = args.maximumBytesBilled as string | undefined;
      const useLegacySql = (args.useLegacySql as boolean | undefined) ?? false;
      const queryParameters = args.queryParameters as
        | Record<string, unknown>[]
        | undefined;
      const maxResults = (args.maxResults as number | undefined) ?? 100000;

      const queryConfig: Record<string, unknown> = {
        query: queryText,
        useLegacySql,
      };
      if (maximumBytesBilled !== undefined) {
        queryConfig.maximumBytesBilled = maximumBytesBilled;
      }
      if (queryParameters !== undefined) {
        queryConfig.queryParameters = queryParameters;
      }

      const jobBody: Record<string, unknown> = {
        configuration: { query: queryConfig },
      };
      if (location) {
        jobBody.jobReference = { projectId, location };
      }

      const createResp = await request(
        "POST",
        `${baseUrl}projects/${projectId}/jobs`,
        jobBody,
        credentials,
      );
      if (!createResp.ok) {
        const body = await createResp.text();
        throw new Error(
          `Failed to create query job (${createResp.status}): ${body}`,
        );
      }

      let job = await createResp.json() as {
        jobReference: { projectId: string; jobId: string; location?: string };
        status: {
          state: string;
          errorResult?: { reason: string; message: string };
        };
      };

      const jobId = job.jobReference.jobId;
      const jobLocation = job.jobReference.location ?? location;

      let pollCount = 0;
      const maxPolls = 60;
      while (job.status.state !== "DONE") {
        pollCount++;
        if (pollCount > maxPolls) {
          throw new Error(
            `Query job ${jobId} did not complete after ${maxPolls} polls`,
          );
        }
        await new Promise((r) => setTimeout(r, 2000));

        let pollUrl = `${baseUrl}projects/${projectId}/jobs/${jobId}`;
        if (jobLocation) {
          pollUrl += `?location=${encodeURIComponent(jobLocation)}`;
        }

        const pollResp = await request("GET", pollUrl, undefined, credentials);
        if (!pollResp.ok) {
          const body = await pollResp.text();
          throw new Error(
            `Failed to poll query job ${jobId} (${pollResp.status}): ${body}`,
          );
        }
        job = await pollResp.json();
      }

      if (job.status.errorResult) {
        throw new Error(
          `Query job ${jobId} failed: ${job.status.errorResult.reason} — ${job.status.errorResult.message}`,
        );
      }

      const allRows: unknown[] = [];
      let pageToken: string | undefined;
      let schema: unknown = undefined;
      let totalRows: string | undefined;
      const resultsPageSize = 10000;

      do {
        let resultsUrl =
          `${baseUrl}projects/${projectId}/queries/${jobId}?maxResults=${resultsPageSize}`;
        if (jobLocation) {
          resultsUrl += `&location=${encodeURIComponent(jobLocation)}`;
        }
        if (pageToken) {
          resultsUrl += `&pageToken=${encodeURIComponent(pageToken)}`;
        }

        const resultsResp = await request(
          "GET",
          resultsUrl,
          undefined,
          credentials,
        );
        if (!resultsResp.ok) {
          const body = await resultsResp.text();
          throw new Error(
            `Failed to get query results for ${jobId} (${resultsResp.status}): ${body}`,
          );
        }

        const data = await resultsResp.json() as {
          schema?: unknown;
          rows?: unknown[];
          totalRows?: string;
          pageToken?: string;
        };

        if (data.schema && !schema) {
          schema = data.schema;
        }
        if (data.totalRows) {
          totalRows = data.totalRows;
        }
        if (data.rows) {
          allRows.push(...data.rows);
        }

        if (allRows.length > maxResults) {
          throw new Error(
            `Query result row count (${allRows.length}) exceeds maxResults limit (${maxResults}) for job ${jobId}. ` +
              `Total rows reported: ${totalRows ?? "unknown"}. ` +
              "Increase maxResults or add a LIMIT clause. The snapshot was NOT persisted.",
          );
        }

        pageToken = data.pageToken;
      } while (pageToken);

      const snapshot = {
        jobId,
        location: jobLocation,
        query: queryText,
        totalRows: totalRows ? Number(totalRows) : allRows.length,
        schema,
        rows: allRows,
        fetchedAt: new Date().toISOString(),
      };

      const instanceName = `query_result_${jobId}`
        .replace(/[\/\\]/g, "_")
        .replace(/\.\./g, "_")
        .replace(/\0/g, "");
      const handle = await context.writeResource(
        "state",
        instanceName,
        snapshot,
      );
      return { dataHandles: [handle] };
    },
  },
};
