// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const serviceInventoryMethods = {
  inventory_enabled: {
    description:
      "persist a complete paginated enabled-services snapshot for drift reports — fails on maxItems breach rather than silently truncating",
    arguments: z.object({
      parent: z.string().describe(
        "Resource parent, e.g. projects/{project} or projects/{project_number}",
      ).optional(),
      maxItems: z.number().describe(
        "Maximum number of enabled services to collect before failing with an explicit truncation error (default 5000)",
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
      const parent = (args.parent as string | undefined) ??
        g["name"]?.toString() ?? `projects/${projectId}`;
      const maxItems = (args.maxItems as number | undefined) ?? 5000;

      const services: Record<string, unknown>[] = [];
      let pageToken: string | undefined;
      const pageSize = 200;

      do {
        let url =
          `${baseUrl}v1/${parent}/services?filter=state:ENABLED&pageSize=${pageSize}`;
        if (pageToken) {
          url += `&pageToken=${encodeURIComponent(pageToken)}`;
        }

        const resp = await request("GET", url, undefined, credentials);
        if (!resp.ok) {
          const body = await resp.text();
          throw new Error(
            `Failed to list enabled services for ${parent} (${resp.status}): ${body}`,
          );
        }

        const data = await resp.json() as {
          services?: Record<string, unknown>[];
          nextPageToken?: string;
        };

        if (data.services) {
          services.push(...data.services);
        }

        if (services.length > maxItems) {
          throw new Error(
            `Enabled services count (${services.length}) exceeds maxItems limit (${maxItems}) for ${parent}. ` +
              "Increase maxItems or narrow the parent scope. The snapshot was NOT persisted.",
          );
        }

        pageToken = data.nextPageToken;
      } while (pageToken);

      const snapshot = {
        parent,
        services,
        count: services.length,
        fetchedAt: new Date().toISOString(),
      };

      const instanceName = `enabled_services_snapshot_${
        parent.replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "")
      }`;
      const handle = await context.writeResource(
        "state",
        instanceName,
        snapshot,
      );
      return { dataHandles: [handle] };
    },
  },
};
