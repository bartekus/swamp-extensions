// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const orgHierarchyMethods = {
  inventory_hierarchy: {
    description:
      "recursive caller-visible organisation hierarchy inventory with full pagination — enumerates nested folders and projects, preserves parent links and labels, fails on maxNodes or permissions rather than marking partial data complete",
    arguments: z.object({
      parent: z.string().describe(
        "Root resource name to traverse, e.g. organizations/123456 or folders/789",
      ),
      maxNodes: z.number().describe(
        "Maximum total folders + projects before failing with an explicit limit error (default 10000)",
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

      const parent = args.parent as string;
      const maxNodes = (args.maxNodes as number | undefined) ?? 10000;

      const folders: Record<string, unknown>[] = [];
      const projects: Record<string, unknown>[] = [];
      let nodeCount = 0;

      const queue: string[] = [parent];

      while (queue.length > 0) {
        const current = queue.shift()!;

        let folderPageToken: string | undefined;
        let prevFolderPageToken: string | undefined;
        do {
          let url = `${baseUrl}v3/folders?parent=${
            encodeURIComponent(current)
          }&pageSize=100`;
          if (folderPageToken) {
            url += `&pageToken=${encodeURIComponent(folderPageToken)}`;
          }

          const resp = await request("GET", url, undefined, credentials);
          if (!resp.ok) {
            const body = await resp.text();
            throw new Error(
              `Failed to list folders under ${current} (${resp.status}): ${body}`,
            );
          }

          const data = await resp.json() as {
            folders?: Record<string, unknown>[];
            nextPageToken?: string;
          };

          if (data.folders) {
            for (const folder of data.folders) {
              nodeCount++;
              if (nodeCount > maxNodes) {
                throw new Error(
                  `Node count (${nodeCount}) exceeds maxNodes (${maxNodes}) while traversing ${current}. ` +
                    "Increase maxNodes or narrow the parent scope. The snapshot was NOT persisted.",
                );
              }
              folders.push(folder);
              if (folder.name) {
                queue.push(folder.name as string);
              }
            }
          }

          prevFolderPageToken = folderPageToken;
          folderPageToken = data.nextPageToken;
          if (
            folderPageToken && folderPageToken === prevFolderPageToken
          ) {
            throw new Error(
              `Repeated pagination token listing folders under ${current}. ` +
                "This indicates an API pagination loop — aborting to prevent infinite traversal.",
            );
          }
        } while (folderPageToken);

        let projectPageToken: string | undefined;
        let prevProjectPageToken: string | undefined;
        do {
          let url = `${baseUrl}v3/projects?parent=${
            encodeURIComponent(current)
          }&pageSize=100`;
          if (projectPageToken) {
            url += `&pageToken=${encodeURIComponent(projectPageToken)}`;
          }

          const resp = await request("GET", url, undefined, credentials);
          if (!resp.ok) {
            const body = await resp.text();
            throw new Error(
              `Failed to list projects under ${current} (${resp.status}): ${body}`,
            );
          }

          const data = await resp.json() as {
            projects?: Record<string, unknown>[];
            nextPageToken?: string;
          };

          if (data.projects) {
            for (const project of data.projects) {
              nodeCount++;
              if (nodeCount > maxNodes) {
                throw new Error(
                  `Node count (${nodeCount}) exceeds maxNodes (${maxNodes}) while traversing ${current}. ` +
                    "Increase maxNodes or narrow the parent scope. The snapshot was NOT persisted.",
                );
              }
              projects.push(project);
            }
          }

          prevProjectPageToken = projectPageToken;
          projectPageToken = data.nextPageToken;
          if (
            projectPageToken && projectPageToken === prevProjectPageToken
          ) {
            throw new Error(
              `Repeated pagination token listing projects under ${current}. ` +
                "This indicates an API pagination loop — aborting to prevent infinite traversal.",
            );
          }
        } while (projectPageToken);
      }

      const snapshot = {
        parent,
        folders,
        projects,
        totalNodes: nodeCount,
        coverage: "caller-visible",
        fetchedAt: new Date().toISOString(),
      };

      const instanceName = `hierarchy_snapshot_${
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
