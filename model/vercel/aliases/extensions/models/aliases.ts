// Swamp, an Automation Framework
// Copyright (C) 2026 Elder Swamp Club, Inc.
//
// This file is part of Swamp.
//
// Swamp is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License version 3
// as published by the Free Software Foundation, with the Swamp
// Extension and Definition Exception (found in the "COPYING-EXCEPTION"
// file).
//
// Swamp is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Swamp.  If not, see <https://www.gnu.org/licenses/>.

// Auto-generated extension model for @swamp/vercel/aliases/aliases
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Aliases.
 *
 * Wraps the Vercel API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, listAll, read, remove, tryRead } from "./_lib/vercel.ts";

const GlobalArgsSchema = z.object({
  teamId: z.string().optional().describe("Vercel team ID"),
  slug: z.string().optional().describe(
    "Vercel team slug (alternative to teamId)",
  ),
  id: z.string().describe("Deployment ID to create the alias for"),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  alias: z.string().describe(
    "The alias we want to assign to the deployment defined in the URL",
  ).optional(),
  redirect: z.string().describe(
    "The redirect property will take precedence over the deployment id from the URL and consists of a hostname (like test.com) to which the alias should redirect using status code 307",
  ).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  alias: z.string().nullable().optional(),
  created: z.string().nullable().optional(),
  createdAt: z.number().nullable().optional(),
  creator: z.object({
    email: z.string().optional(),
    uid: z.string().optional(),
    username: z.string().optional(),
  }).nullable().optional(),
  deletedAt: z.number().nullable().optional(),
  deployment: z.object({
    id: z.string().optional(),
    meta: z.string().optional(),
    url: z.string().optional(),
  }).nullable().optional(),
  deploymentId: z.string().nullable().optional(),
  microfrontends: z.object({
    applications: z.array(z.object({
      fallbackHost: z.string().optional(),
      projectId: z.string().optional(),
    })).optional(),
    defaultApp: z.object({
      projectId: z.string().optional(),
    }).optional(),
  }).nullable().optional(),
  projectId: z.string().nullable().optional(),
  protectionBypass: z.record(z.string(), z.unknown()).nullable().optional(),
  redirect: z.string().nullable().optional(),
  redirectStatusCode: z.number().nullable().optional(),
  uid: z.string(),
  updatedAt: z.number().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  id: z.string().optional(),
  name: z.string().optional(),
  alias: z.string().optional(),
  redirect: z.string().optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Aliases. Registered at `@swamp/vercel/aliases/aliases`. */
export const model = {
  type: "@swamp/vercel/aliases/aliases",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.08.02.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Aliases resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Aliases",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/deployments/" + encodeURIComponent(g.id) +
          "/aliases";
        const body: Record<string, unknown> = {};
        if (g.alias !== undefined) body.alias = g.alias;
        if (g.redirect !== undefined) body.redirect = g.redirect;
        const raw = await create(endpoint, body, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        });
        const result = raw as ResourceData;
        const instanceName = (g.name?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    get: {
      description: "Get a Aliases",
      arguments: z.object({ id: z.string().describe("The ID of the Aliases") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v4/aliases";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName = (g.name?.toString() ?? args.id).replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    lookup: {
      description:
        "Look up an existing Aliases by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v4/aliases";
        const filters: [string, string][] = [];
        if (g.alias !== undefined) filters.push(["alias", String(g.alias)]);
        if (g.redirect !== undefined) {
          filters.push(["redirect", String(g.redirect)]);
        }
        if (g.created !== undefined) {
          filters.push(["created", String(g.created)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.deletedAt !== undefined) {
          filters.push(["deletedAt", String(g.deletedAt)]);
        }
        if (g.deploymentId !== undefined) {
          filters.push(["deploymentId", String(g.deploymentId)]);
        }
        if (g.projectId !== undefined) {
          filters.push(["projectId", String(g.projectId)]);
        }
        if (g.redirectStatusCode !== undefined) {
          filters.push(["redirectStatusCode", String(g.redirectStatusCode)]);
        }
        if (g.uid !== undefined) filters.push(["uid", String(g.uid)]);
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(
          endpoint,
          "cursor",
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
          undefined,
          "until",
        );
        const matches = items.filter((item) => {
          for (const [key, val] of filters) {
            if (String((item as Record<string, unknown>)[key]) !== val) {
              return false;
            }
          }
          return true;
        });
        if (matches.length === 0) {
          const filterDesc = filters.map(([k, v]) =>
            `${k}=${JSON.stringify(v)}`
          ).join(", ");
          throw new Error(`No aliases found matching filters: ${filterDesc}`);
        }
        if (matches.length > 1) {
          const filterDesc = filters.map(([k, v]) =>
            `${k}=${JSON.stringify(v)}`
          ).join(", ");
          throw new Error(
            `Expected exactly 1 match, found ${matches.length} for filters: ${filterDesc}`,
          );
        }
        const result = matches[0] as ResourceData;
        const instanceName =
          (g.name?.toString() ?? result.uid?.toString() ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    adopt: {
      description: "Import an existing Aliases by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Aliases to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v4/aliases";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName =
          (result.name?.toString() ?? g.name?.toString() ?? args.id).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the Aliases",
      arguments: z.object({ id: z.string().describe("The ID of the Aliases") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/aliases";
        const { existed } = await remove(
          endpoint,
          args.id,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        );
        const instanceName = (context.globalArgs.name?.toString() ?? args.id)
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource("state", instanceName, {
          id: args.id,
          existed,
          status: existed ? "deleted" : "not_found",
          deletedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
    sync: {
      description: "Sync Aliases state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Aliases by uid (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v4/aliases";
        const instanceName =
          (g.name?.toString() ?? args.identifier ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No data found - run create, get, or list first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        if (!existing.uid) {
          throw new Error("Stored state has no uid - cannot sync");
        }
        const result = await tryRead(
          endpoint,
          existing.uid,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        ) as ResourceData | null;
        if (result) {
          const handle = await context.writeResource(
            "state",
            instanceName,
            result,
          );
          return { dataHandles: [handle] };
        }
        const handle = await context.writeResource("state", instanceName, {
          id: existing.uid,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
