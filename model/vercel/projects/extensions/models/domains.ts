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

// Auto-generated extension model for @swamp/vercel/projects/domains
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Domains.
 *
 * Wraps the Vercel API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  create,
  listAll,
  read,
  remove,
  tryRead,
  update,
} from "./_lib/vercel.ts";

const GlobalArgsSchema = z.object({
  teamId: z.string().optional().describe("Vercel team ID"),
  slug: z.string().optional().describe(
    "Vercel team slug (alternative to teamId)",
  ),
  idOrName: z.string().describe(
    "The unique project identifier or the project name",
  ),
  gitBranch: z.string().max(250).describe(
    "Git branch to link the project domain",
  ).optional(),
  redirect: z.string().describe("Target destination domain for redirect")
    .optional(),
  redirectStatusCode: z.union([
    z.literal(null),
    z.literal(301),
    z.literal(302),
    z.literal(307),
    z.literal(308),
  ]).describe("Status code for domain redirect").optional(),
  name: z.string().describe("The project domain name"),
  customEnvironmentId: z.string().describe(
    "The unique custom environment identifier within the project",
  ).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  apexName: z.string().nullable().optional(),
  createdAt: z.number().nullable().optional(),
  customEnvironmentId: z.string().nullable().optional(),
  gitBranch: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  redirect: z.string().nullable().optional(),
  redirectStatusCode: z.number().nullable().optional(),
  updatedAt: z.number().nullable().optional(),
  verification: z.array(z.object({
    domain: z.string().optional(),
    reason: z.string().optional(),
    type: z.string().optional(),
    value: z.string().optional(),
  })).nullable().optional(),
  verified: z.boolean().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  idOrName: z.string().optional(),
  gitBranch: z.string().max(250).optional(),
  redirect: z.string().optional(),
  redirectStatusCode: z.union([
    z.literal(null),
    z.literal(301),
    z.literal(302),
    z.literal(307),
    z.literal(308),
  ]).optional(),
  name: z.string().optional(),
  customEnvironmentId: z.string().optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Domains. Registered at `@swamp/vercel/projects/domains`. */
export const model = {
  type: "@swamp/vercel/projects/domains",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.08.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
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
      description: "Domains resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Domains",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v10/projects/" + encodeURIComponent(g.idOrName) +
          "/domains";
        const body: Record<string, unknown> = {};
        if (g.name !== undefined) body.name = g.name;
        if (g.gitBranch !== undefined) body.gitBranch = g.gitBranch;
        if (g.customEnvironmentId !== undefined) {
          body.customEnvironmentId = g.customEnvironmentId;
        }
        if (g.redirect !== undefined) body.redirect = g.redirect;
        if (g.redirectStatusCode !== undefined) {
          body.redirectStatusCode = g.redirectStatusCode;
        }
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
      description: "Get a Domains",
      arguments: z.object({ id: z.string().describe("The ID of the Domains") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects/" + encodeURIComponent(g.idOrName) +
          "/domains";
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
        "Look up an existing Domains by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects/" + encodeURIComponent(g.idOrName) +
          "/domains";
        const filters: [string, string][] = [];
        if (g.gitBranch !== undefined) {
          filters.push(["gitBranch", String(g.gitBranch)]);
        }
        if (g.redirect !== undefined) {
          filters.push(["redirect", String(g.redirect)]);
        }
        if (g.redirectStatusCode !== undefined) {
          filters.push(["redirectStatusCode", String(g.redirectStatusCode)]);
        }
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.customEnvironmentId !== undefined) {
          filters.push(["customEnvironmentId", String(g.customEnvironmentId)]);
        }
        if (g.apexName !== undefined) {
          filters.push(["apexName", String(g.apexName)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.projectId !== undefined) {
          filters.push(["projectId", String(g.projectId)]);
        }
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (g.verified !== undefined) {
          filters.push(["verified", String(g.verified)]);
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
          throw new Error(`No domains found matching filters: ${filterDesc}`);
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
          (g.name?.toString() ?? result.name?.toString() ?? "current").replace(
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
      description: "Import an existing Domains by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Domains to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects/" + encodeURIComponent(g.idOrName) +
          "/domains";
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
    update: {
      description: "Update Domains attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Domains by name (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects/" + encodeURIComponent(g.idOrName) +
          "/domains";
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
        const body: Record<string, unknown> = {};
        if (g.gitBranch !== undefined) body.gitBranch = g.gitBranch;
        if (g.redirect !== undefined) body.redirect = g.redirect;
        if (g.redirectStatusCode !== undefined) {
          body.redirectStatusCode = g.redirectStatusCode;
        }
        const result = await update(endpoint, existing.name, body, "PATCH", {
          token: g.token,
        }, { teamId: g.teamId, slug: g.slug }) as ResourceData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the Domains",
      arguments: z.object({ id: z.string().describe("The ID of the Domains") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects/" + encodeURIComponent(g.idOrName) +
          "/domains";
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
      description: "Sync Domains state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Domains by name (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects/" + encodeURIComponent(g.idOrName) +
          "/domains";
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
        if (!existing.name) {
          throw new Error("Stored state has no name - cannot sync");
        }
        const result = await tryRead(endpoint, existing.name, {
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
          id: existing.name,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
