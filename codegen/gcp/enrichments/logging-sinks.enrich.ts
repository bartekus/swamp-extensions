// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const loggingSinkMethods = {
  ensure_audit_sink: {
    description:
      "convergent audit-log sink setup targeting an existing ACTIVE Logging bucket — creates, adopts, or updates by sink ID with typed writerIdentity and destination verification",
    arguments: z.object({
      sinkId: z.string().describe(
        "Unique sink identifier within the parent",
      ),
      parent: z.string().describe(
        "Resource parent, e.g. organizations/{orgId}, folders/{folderId}, projects/{projectId}",
      ).optional(),
      destination: z.string().describe(
        "Logging bucket destination, e.g. logging.googleapis.com/projects/my-project/locations/global/buckets/my-bucket",
      ),
      filter: z.string().describe(
        "Log filter expression (empty string means all logs)",
      ).optional(),
      includeChildren: z.boolean().describe(
        "Whether to include logs from child resources (default true)",
      ).optional(),
      exclusions: z.array(z.object({
        name: z.string().describe("Unique exclusion name"),
        filter: z.string().describe("Log exclusion filter expression"),
        description: z.string().describe("Human-readable description")
          .optional(),
      })).describe("Log exclusions to apply").optional(),
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

      const sinkId = args.sinkId as string;
      const parent = (args.parent as string | undefined) ??
        g["name"]?.toString() ?? `projects/${projectId}`;
      const destination = args.destination as string;
      const filter = (args.filter as string | undefined) ?? "";
      const includeChildren = (args.includeChildren as boolean | undefined) ??
        true;
      const exclusions = (args.exclusions as
        | Array<{ name: string; filter: string; description?: string }>
        | undefined) ?? [];

      const bucketPrefix = "logging.googleapis.com/";
      const bucketIdx = destination.indexOf(bucketPrefix);
      if (bucketIdx === -1) {
        throw new Error(
          `Invalid destination: must start with '${bucketPrefix}', got '${destination}'`,
        );
      }
      const bucketPath = destination.slice(bucketIdx + bucketPrefix.length);

      const bucketResp = await request(
        "GET",
        `${baseUrl}v2/${bucketPath}`,
        undefined,
        credentials,
      );
      if (!bucketResp.ok) {
        const body = await bucketResp.text();
        throw new Error(
          `Destination bucket ${bucketPath} not found or inaccessible (${bucketResp.status}): ${body}`,
        );
      }
      const bucket = await bucketResp.json() as {
        lifecycleState?: string;
      };
      if (bucket.lifecycleState && bucket.lifecycleState !== "ACTIVE") {
        throw new Error(
          `Destination bucket ${bucketPath} is not ACTIVE (state: ${bucket.lifecycleState}). ` +
            "Only ACTIVE buckets can be used as sink destinations.",
        );
      }

      const sinkResp = await request(
        "GET",
        `${baseUrl}v2/${parent}/sinks/${sinkId}`,
        undefined,
        credentials,
      );

      const sinkBody: Record<string, unknown> = {
        name: sinkId,
        destination,
        filter,
        includeChildren,
      };
      if (exclusions.length > 0) {
        sinkBody.exclusions = exclusions;
      }

      let resultSink: Record<string, unknown>;

      if (sinkResp.ok) {
        const existing = await sinkResp.json() as Record<string, unknown>;

        const needsUpdate = existing.destination !== destination ||
          (existing.filter ?? "") !== filter ||
          existing.includeChildren !== includeChildren ||
          JSON.stringify(
              [...(existing.exclusions as Array<Record<string, unknown>> ?? [])]
                .sort(
                  (a, b) =>
                    String(a.name ?? "").localeCompare(String(b.name ?? "")),
                ),
            ) !==
            JSON.stringify(
              [...exclusions].sort(
                (a, b) =>
                  String(a.name ?? "").localeCompare(String(b.name ?? "")),
              ),
            );

        if (needsUpdate) {
          const updateResp = await request(
            "PUT",
            `${baseUrl}v2/${parent}/sinks/${sinkId}?uniqueWriterIdentity=true`,
            sinkBody,
            credentials,
          );
          if (!updateResp.ok) {
            const body = await updateResp.text();
            throw new Error(
              `Failed to update sink ${sinkId} (${updateResp.status}): ${body}`,
            );
          }
          resultSink = await updateResp.json() as Record<string, unknown>;
        } else {
          resultSink = existing;
        }
      } else if (sinkResp.status === 404) {
        await sinkResp.text();
        const createResp = await request(
          "POST",
          `${baseUrl}v2/${parent}/sinks?uniqueWriterIdentity=true`,
          sinkBody,
          credentials,
        );
        if (!createResp.ok) {
          const body = await createResp.text();
          throw new Error(
            `Failed to create sink ${sinkId} (${createResp.status}): ${body}`,
          );
        }
        resultSink = await createResp.json() as Record<string, unknown>;
      } else if (sinkResp.status === 403) {
        let body: string;
        try {
          body = await sinkResp.text();
        } catch {
          body = "(could not read response body)";
        }
        throw new Error(
          `Permission denied reading sink ${sinkId} under ${parent} (403): ${body}`,
        );
      } else {
        const body = await sinkResp.text();
        throw new Error(
          `Unexpected error reading sink ${sinkId} (${sinkResp.status}): ${body}`,
        );
      }

      const instanceName = `${parent}_sinks_${sinkId}`.replace(/[\/\\]/g, "_")
        .replace(
          /\.\./g,
          "_",
        ).replace(/\0/g, "");
      const handle = await context.writeResource("state", instanceName, {
        name: resultSink.name,
        destination: resultSink.destination,
        filter: resultSink.filter,
        includeChildren: resultSink.includeChildren,
        exclusions: resultSink.exclusions,
        writerIdentity: resultSink.writerIdentity,
        createTime: resultSink.createTime,
        updateTime: resultSink.updateTime,
      });
      return { dataHandles: [handle] };
    },
  },
};
