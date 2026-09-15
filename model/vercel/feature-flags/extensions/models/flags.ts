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

// Auto-generated extension model for @swamp/vercel/feature-flags/flags
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Flags.
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
  projectIdOrName: z.string().describe("The project id or name"),
  createdBy: z.string().describe("The user who created this patch").optional(),
  message: z.string().describe("Additional message for this version")
    .optional(),
  variants: z.array(z.object({
    id: z.string(),
    label: z.string().optional(),
    description: z.string().optional(),
    value: z.string(),
  })).describe("The variants of the flag").optional(),
  environments: z.record(z.string(), z.unknown()).describe(
    "The configuration for the flag in different environments",
  ),
  seed: z.number().min(0).max(100000).describe(
    "A random seed to prevent split points in different flags from having the same targets",
  ).optional(),
  description: z.string().describe("A description of the flag").optional(),
  state: z.enum(["active", "archived"]).optional(),
  maintainerIds: z.array(z.string().max(24)).describe(
    "The user ids of the maintainers of the flag",
  ).optional(),
  permanent: z.boolean().describe(
    "Whether this flag is marked as permanent, indicating it should not be removed",
  ).optional(),
  tags: z.array(z.string().max(64)).describe("Tags for categorizing the flag")
    .optional(),
  kind: z.enum(["boolean", "string", "number", "json"]).describe(
    "The kind of flag",
  ),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  description: z.string().nullable().optional(),
  variants: z.array(z.object({
    description: z.string().optional(),
    label: z.string().optional(),
    value: z.string().optional(),
    id: z.string().optional(),
  })).nullable().optional(),
  id: z.string(),
  environments: z.record(z.string(), z.unknown()).nullable().optional(),
  kind: z.string().nullable().optional(),
  revision: z.number().nullable().optional(),
  seed: z.number().nullable().optional(),
  state: z.string().nullable().optional(),
  maintainerIds: z.array(z.string()).nullable().optional(),
  permanent: z.boolean().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  slug: z.string().nullable().optional(),
  createdAt: z.number().nullable().optional(),
  updatedAt: z.number().nullable().optional(),
  updatedBy: z.string().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  ownerId: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  typeName: z.string().nullable().optional(),
  metadata: z.object({
    creator: z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    }).optional(),
  }).nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  projectIdOrName: z.string().optional(),
  createdBy: z.string().optional(),
  message: z.string().optional(),
  variants: z.array(z.object({
    id: z.string(),
    label: z.string().optional(),
    description: z.string().optional(),
    value: z.string(),
  })).optional(),
  environments: z.record(z.string(), z.unknown()).optional(),
  seed: z.number().min(0).max(100000).optional(),
  description: z.string().optional(),
  state: z.enum(["active", "archived"]).optional(),
  maintainerIds: z.array(z.string().max(24)).optional(),
  permanent: z.boolean().optional(),
  tags: z.array(z.string().max(64)).optional(),
  kind: z.enum(["boolean", "string", "number", "json"]).optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Flags. Registered at `@swamp/vercel/feature-flags/flags`. */
export const model = {
  type: "@swamp/vercel/feature-flags/flags",
  version: "2026.09.15.1",
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
      toVersion: "2026.08.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Flags resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Flags",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/flags";
        const body: Record<string, unknown> = {};
        if (g.kind !== undefined) body.kind = g.kind;
        if (g.variants !== undefined) body.variants = g.variants;
        if (g.environments !== undefined) body.environments = g.environments;
        if (g.seed !== undefined) body.seed = g.seed;
        if (g.description !== undefined) body.description = g.description;
        if (g.state !== undefined) body.state = g.state;
        if (g.maintainerIds !== undefined) body.maintainerIds = g.maintainerIds;
        if (g.permanent !== undefined) body.permanent = g.permanent;
        if (g.tags !== undefined) body.tags = g.tags;
        const raw = await create(endpoint, body, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }, "PUT");
        const result = raw as ResourceData;
        const instanceName = (g.description?.toString() ?? "current").replace(
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
      description: "Get a Flags",
      arguments: z.object({ id: z.string().describe("The ID of the Flags") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/flags";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName = (g.description?.toString() ?? args.id).replace(
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
        "Look up an existing Flags by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/flags";
        const filters: [string, string][] = [];
        if (g.createdBy !== undefined) {
          filters.push(["createdBy", String(g.createdBy)]);
        }
        if (g.message !== undefined) {
          filters.push(["message", String(g.message)]);
        }
        if (g.seed !== undefined) filters.push(["seed", String(g.seed)]);
        if (g.description !== undefined) {
          filters.push(["description", String(g.description)]);
        }
        if (g.state !== undefined) filters.push(["state", String(g.state)]);
        if (g.permanent !== undefined) {
          filters.push(["permanent", String(g.permanent)]);
        }
        if (g.kind !== undefined) filters.push(["kind", String(g.kind)]);
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.revision !== undefined) {
          filters.push(["revision", String(g.revision)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (g.updatedBy !== undefined) {
          filters.push(["updatedBy", String(g.updatedBy)]);
        }
        if (g.ownerId !== undefined) {
          filters.push(["ownerId", String(g.ownerId)]);
        }
        if (g.projectId !== undefined) {
          filters.push(["projectId", String(g.projectId)]);
        }
        if (g.typeName !== undefined) {
          filters.push(["typeName", String(g.typeName)]);
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
          throw new Error(`No flags found matching filters: ${filterDesc}`);
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
          (g.description?.toString() ?? result.id?.toString() ?? "current")
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
      description: "Import an existing Flags by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Flags to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/flags";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName =
          (result.description?.toString() ?? g.description?.toString() ??
            args.id).replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(
              /\0/g,
              "",
            );
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update Flags attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Flags by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/flags";
        const instanceName =
          (g.description?.toString() ?? args.identifier ?? "current").replace(
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
        if (g.createdBy !== undefined) body.createdBy = g.createdBy;
        if (g.message !== undefined) body.message = g.message;
        if (g.variants !== undefined) body.variants = g.variants;
        if (g.environments !== undefined) body.environments = g.environments;
        if (g.seed !== undefined) body.seed = g.seed;
        if (g.description !== undefined) body.description = g.description;
        if (g.state !== undefined) body.state = g.state;
        if (g.maintainerIds !== undefined) body.maintainerIds = g.maintainerIds;
        if (g.permanent !== undefined) body.permanent = g.permanent;
        if (g.tags !== undefined) body.tags = g.tags;
        const result = await update(endpoint, existing.id, body, "PATCH", {
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
      description: "Delete the Flags",
      arguments: z.object({ id: z.string().describe("The ID of the Flags") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/flags";
        const { existed } = await remove(
          endpoint,
          args.id,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        );
        const instanceName =
          (context.globalArgs.description?.toString() ?? args.id).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
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
      description: "Sync Flags state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Flags by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/flags";
        const instanceName =
          (g.description?.toString() ?? args.identifier ?? "current").replace(
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
        if (!existing.id) {
          throw new Error("Stored state has no id - cannot sync");
        }
        const result = await tryRead(
          endpoint,
          existing.id,
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
          id: existing.id,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
