// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const orgPolicyAuditMethods = {
  audit_effective_policies: {
    description:
      "typed batch effective-policy snapshots for baseline reports — fails on access errors rather than inventing an unset/default policy",
    arguments: z.object({
      checks: z.array(
        z.object({
          resource: z.string().describe(
            "Resource to check, e.g. projects/123, folders/456, organizations/789",
          ),
          constraint: z.string().describe(
            "Constraint name, e.g. constraints/compute.disableSerialPortAccess",
          ),
        }),
      ).describe("Explicit resource/constraint pairs to audit"),
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

      const checks = args.checks as Array<{
        resource: string;
        constraint: string;
      }>;

      const results: Record<string, unknown>[] = [];

      for (const check of checks) {
        const url =
          `${baseUrl}v2/${check.resource}/policies/${check.constraint}:getEffectivePolicy`;
        const resp = await request("GET", url, undefined, credentials);

        if (resp.status === 403 || resp.status === 401) {
          const body = await resp.text();
          throw new Error(
            `Permission denied reading effective policy for ${check.constraint} on ${check.resource} (${resp.status}): ${body}. ` +
              "This is a permission error, not an absent policy.",
          );
        }

        if (resp.status === 404) {
          await resp.text();
          results.push({
            resource: check.resource,
            constraint: check.constraint,
            status: "no_policy",
          });
          continue;
        }

        if (!resp.ok) {
          const body = await resp.text();
          throw new Error(
            `Failed to get effective policy for ${check.constraint} on ${check.resource} (${resp.status}): ${body}`,
          );
        }

        const policy = await resp.json();
        results.push({
          resource: check.resource,
          constraint: check.constraint,
          status: "ok",
          policy,
        });
      }

      const snapshot = {
        results,
        count: results.length,
        fetchedAt: new Date().toISOString(),
      };

      const checksKey = checks.map((
        c: { resource: string; constraint: string },
      ) => `${c.resource}:${c.constraint}`).sort().join(",");
      const hashBytes = new Uint8Array(
        await crypto.subtle.digest(
          "SHA-256",
          new TextEncoder().encode(checksKey),
        ),
      );
      const hashHex = [...hashBytes.slice(0, 8)].map((b) =>
        b.toString(16).padStart(2, "0")
      ).join("");
      const handle = await context.writeResource(
        "state",
        `effective_policies_snapshot_${hashHex}`,
        snapshot,
      );
      return { dataHandles: [handle] };
    },
  },
};
