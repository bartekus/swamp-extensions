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

// Auto-generated extension model for @swamp/vercel/access-groups/access-groups
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Access Groups.
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
  name: z.string().max(50).regex(new RegExp("^[A-z0-9_ -]+$")).describe(
    "The name of the access group",
  ),
  projects: z.array(z.object({
    projectId: z.string().max(256),
    role: z.enum(["ADMIN", "PROJECT_VIEWER", "PROJECT_DEVELOPER"]),
  })).optional(),
  membersToAdd: z.array(z.string()).describe(
    "List of members to add to the access group.",
  ).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  accessGroupId: z.string().nullable().optional(),
  createdAt: z.string().nullable().optional(),
  entitlements: z.array(z.string()).nullable().optional(),
  isDsyncManaged: z.boolean().nullable().optional(),
  membersCount: z.number().nullable().optional(),
  name: z.string().nullable().optional(),
  projectsCount: z.number().nullable().optional(),
  teamId: z.string().nullable().optional(),
  teamPermissions: z.array(z.string()).nullable().optional(),
  teamRoles: z.array(z.string()).nullable().optional(),
  updatedAt: z.string().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().max(50).regex(new RegExp("^[A-z0-9_ -]+$")).optional(),
  projects: z.array(z.object({
    projectId: z.string().max(256),
    role: z.enum(["ADMIN", "PROJECT_VIEWER", "PROJECT_DEVELOPER"]),
  })).optional(),
  membersToAdd: z.array(z.string()).optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Access Groups. Registered at `@swamp/vercel/access-groups/access-groups`. */
export const model = {
  type: "@swamp/vercel/access-groups/access-groups",
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
      toVersion: "2026.08.02.5",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.6",
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
      toVersion: "2026.09.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Access Groups resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Access Groups",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/access-groups";
        const body: Record<string, unknown> = {};
        if (g.name !== undefined) body.name = g.name;
        if (g.projects !== undefined) body.projects = g.projects;
        if (g.membersToAdd !== undefined) body.membersToAdd = g.membersToAdd;
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
      description: "Get a Access Groups",
      arguments: z.object({
        id: z.string().describe("The ID of the Access Groups"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/access-groups";
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
        "Look up an existing Access Groups by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/access-groups";
        const filters: [string, string][] = [];
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.accessGroupId !== undefined) {
          filters.push(["accessGroupId", String(g.accessGroupId)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.isDsyncManaged !== undefined) {
          filters.push(["isDsyncManaged", String(g.isDsyncManaged)]);
        }
        if (g.membersCount !== undefined) {
          filters.push(["membersCount", String(g.membersCount)]);
        }
        if (g.projectsCount !== undefined) {
          filters.push(["projectsCount", String(g.projectsCount)]);
        }
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
          "next",
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
          throw new Error(
            `No access groups found matching filters: ${filterDesc}`,
          );
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
          (g.name?.toString() ?? result.accessGroupId?.toString() ?? "current")
            .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    adopt: {
      description:
        "Import an existing Access Groups by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Access Groups to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/access-groups";
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
      description: "Delete the Access Groups",
      arguments: z.object({
        id: z.string().describe("The ID of the Access Groups"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/access-groups";
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
      description: "Sync Access Groups state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Access Groups by accessGroupId (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/access-groups";
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
        if (!existing.accessGroupId) {
          throw new Error("Stored state has no accessGroupId - cannot sync");
        }
        const result = await tryRead(endpoint, existing.accessGroupId, {
          token: g.token,
        }, { teamId: g.teamId, slug: g.slug }) as ResourceData | null;
        if (result) {
          const handle = await context.writeResource(
            "state",
            instanceName,
            result,
          );
          return { dataHandles: [handle] };
        }
        const handle = await context.writeResource("state", instanceName, {
          id: existing.accessGroupId,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
