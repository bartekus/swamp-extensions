// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const recommenderInventoryMethods = {
  inventory_recommendations: {
    description:
      "complete multi-scope recommendation snapshot for cost reports — fans out across explicit parent paths, fails on maxItems breach rather than silently truncating",
    arguments: z.object({
      parents: z.array(z.string()).describe(
        "Recommender parent paths, e.g. projects/123/locations/us-central1/recommenders/google.compute.instance.MachineTypeRecommender",
      ),
      maxItems: z.number().describe(
        "Maximum total recommendations to collect before failing with an explicit truncation error (default 10000)",
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

      const parents = args.parents as string[];
      const maxItems = (args.maxItems as number | undefined) ?? 10000;

      const recommendations: Record<string, unknown>[] = [];
      const perParentCounts: Record<string, number> = {};

      for (const parent of parents) {
        let pageToken: string | undefined;
        let parentCount = 0;
        const pageSize = 100;

        do {
          let url =
            `${baseUrl}v1/${parent}/recommendations?pageSize=${pageSize}`;
          if (pageToken) {
            url += `&pageToken=${encodeURIComponent(pageToken)}`;
          }

          const resp = await request("GET", url, undefined, credentials);
          if (!resp.ok) {
            const body = await resp.text();
            throw new Error(
              `Failed to list recommendations for ${parent} (${resp.status}): ${body}`,
            );
          }

          const data = await resp.json() as {
            recommendations?: Record<string, unknown>[];
            nextPageToken?: string;
          };

          if (data.recommendations) {
            recommendations.push(...data.recommendations);
            parentCount += data.recommendations.length;
          }

          if (recommendations.length > maxItems) {
            throw new Error(
              `Recommendation count (${recommendations.length}) exceeds maxItems limit (${maxItems}). ` +
                "Increase maxItems or narrow the parent scopes. The snapshot was NOT persisted.",
            );
          }

          pageToken = data.nextPageToken;
        } while (pageToken);

        perParentCounts[parent] = parentCount;
      }

      const snapshot = {
        parents,
        recommendations,
        count: recommendations.length,
        perParentCounts,
        fetchedAt: new Date().toISOString(),
      };

      const parentsKey = [...parents].sort().join(",");
      const hashBytes = new Uint8Array(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(parentsKey),
        ),
      );
      const hashHex = [...hashBytes.slice(0, 8)].map((b) =>
        b.toString(16).padStart(2, "0")
      ).join("");
      const handle = await context.writeResource(
        "state",
        `recommendations_snapshot_${hashHex}`,
        snapshot,
      );
      return { dataHandles: [handle] };
    },
  },
};
