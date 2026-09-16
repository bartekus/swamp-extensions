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

// Auto-generated extension model for @swamp/vercel/feature-flags/segments
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Segments.
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
  operations: z.array(z.object({
    action: z.enum(["add", "remove"]),
    field: z.enum(["include", "exclude"]),
    entity: z.string(),
    attribute: z.string(),
    value: z.object({
      note: z.string().optional(),
      value: z.string(),
    }),
  })).optional(),
  label: z.string(),
  description: z.string().optional(),
  data: z.object({
    rules: z.array(z.object({
      id: z.string(),
      conditions: z.array(z.object({
        lhs: z.object({
          type: z.string(),
        }),
        cmp: z.enum([
          "eq",
          "!eq",
          "oneOf",
          "!oneOf",
          "containsAllOf",
          "containsAnyOf",
          "containsNoneOf",
          "startsWith",
          "!startsWith",
          "endsWith",
          "!endsWith",
          "contains",
          "!contains",
          "ex",
          "!ex",
          "gt",
          "gte",
          "lt",
          "lte",
          "regex",
          "!regex",
          "before",
          "after",
        ]),
        rhs: z.object({
          type: z.enum(["list/inline", "list"]),
          items: z.array(z.object({
            label: z.string().optional(),
            note: z.string().optional(),
            value: z.number(),
          })),
        }).optional(),
        cmpOptions: z.object({
          ignoreCase: z.boolean().optional(),
        }).optional(),
      })),
      outcome: z.object({
        type: z.string(),
      }),
    })).optional(),
    include: z.record(z.string(), z.unknown()).optional(),
    exclude: z.record(z.string(), z.unknown()).optional(),
  }).describe("The data of the segment"),
  hint: z.string(),
  createdBy: z.string().describe("The entity who created the segment")
    .optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  createdAt: z.number().nullable().optional(),
  createdBy: z.string().nullable().optional(),
  data: z.object({
    exclude: z.record(z.string(), z.unknown()).optional(),
    include: z.record(z.string(), z.unknown()).optional(),
    rules: z.array(z.object({
      conditions: z.array(z.object({
        cmp: z.string().optional(),
        cmpOptions: z.object({
          ignoreCase: z.boolean().optional(),
        }).optional(),
        lhs: z.object({
          type: z.string().optional(),
        }).optional(),
        rhs: z.string().optional(),
      })).optional(),
      id: z.string().optional(),
      outcome: z.object({
        type: z.string().optional(),
      }).optional(),
    })).optional(),
  }).nullable().optional(),
  description: z.string().nullable().optional(),
  hint: z.string().nullable().optional(),
  id: z.string(),
  label: z.string().nullable().optional(),
  projectId: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  typeName: z.string().nullable().optional(),
  updatedAt: z.number().nullable().optional(),
  usedByFlags: z.array(z.string()).nullable().optional(),
  usedBySegments: z.array(z.string()).nullable().optional(),
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
  operations: z.array(z.object({
    action: z.enum(["add", "remove"]),
    field: z.enum(["include", "exclude"]),
    entity: z.string(),
    attribute: z.string(),
    value: z.object({
      note: z.string().optional(),
      value: z.string(),
    }),
  })).optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  data: z.object({
    rules: z.array(z.object({
      id: z.string(),
      conditions: z.array(z.object({
        lhs: z.object({
          type: z.string(),
        }),
        cmp: z.enum([
          "eq",
          "!eq",
          "oneOf",
          "!oneOf",
          "containsAllOf",
          "containsAnyOf",
          "containsNoneOf",
          "startsWith",
          "!startsWith",
          "endsWith",
          "!endsWith",
          "contains",
          "!contains",
          "ex",
          "!ex",
          "gt",
          "gte",
          "lt",
          "lte",
          "regex",
          "!regex",
          "before",
          "after",
        ]),
        rhs: z.object({
          type: z.enum(["list/inline", "list"]),
          items: z.array(z.object({
            label: z.string().optional(),
            note: z.string().optional(),
            value: z.number(),
          })),
        }).optional(),
        cmpOptions: z.object({
          ignoreCase: z.boolean().optional(),
        }).optional(),
      })),
      outcome: z.object({
        type: z.string(),
      }),
    })).optional(),
    include: z.record(z.string(), z.unknown()).optional(),
    exclude: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  hint: z.string().optional(),
  createdBy: z.string().optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Segments. Registered at `@swamp/vercel/feature-flags/segments`. */
export const model = {
  type: "@swamp/vercel/feature-flags/segments",
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
      description: "Segments resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Segments",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/segments";
        const body: Record<string, unknown> = {};
        if (g.createdBy !== undefined) body.createdBy = g.createdBy;
        if (g.label !== undefined) body.label = g.label;
        if (g.description !== undefined) body.description = g.description;
        if (g.data !== undefined) body.data = g.data;
        if (g.hint !== undefined) body.hint = g.hint;
        const raw = await create(endpoint, body, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }, "PUT");
        const result = raw as ResourceData;
        const instanceName = (g.label?.toString() ?? "current").replace(
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
      description: "Get a Segments",
      arguments: z.object({
        id: z.string().describe("The ID of the Segments"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/segments";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName = (g.label?.toString() ?? args.id).replace(
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
        "Look up an existing Segments by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/segments";
        const filters: [string, string][] = [];
        if (g.label !== undefined) filters.push(["label", String(g.label)]);
        if (g.description !== undefined) {
          filters.push(["description", String(g.description)]);
        }
        if (g.hint !== undefined) filters.push(["hint", String(g.hint)]);
        if (g.createdBy !== undefined) {
          filters.push(["createdBy", String(g.createdBy)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.projectId !== undefined) {
          filters.push(["projectId", String(g.projectId)]);
        }
        if (g.typeName !== undefined) {
          filters.push(["typeName", String(g.typeName)]);
        }
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(endpoint, "none", { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }, undefined);
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
          throw new Error(`No segments found matching filters: ${filterDesc}`);
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
          (g.label?.toString() ?? result.id?.toString() ?? "current").replace(
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
      description:
        "Import an existing Segments by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Segments to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/segments";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName =
          (result.label?.toString() ?? g.label?.toString() ?? args.id).replace(
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
      description: "Update Segments attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Segments by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/segments";
        const instanceName =
          (g.label?.toString() ?? args.identifier ?? "current").replace(
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
        if (g.operations !== undefined) body.operations = g.operations;
        if (g.label !== undefined) body.label = g.label;
        if (g.description !== undefined) body.description = g.description;
        if (g.data !== undefined) body.data = g.data;
        if (g.hint !== undefined) body.hint = g.hint;
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
      description: "Delete the Segments",
      arguments: z.object({
        id: z.string().describe("The ID of the Segments"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/segments";
        const { existed } = await remove(
          endpoint,
          args.id,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        );
        const instanceName = (context.globalArgs.label?.toString() ?? args.id)
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
      description: "Sync Segments state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Segments by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/projects/" +
          encodeURIComponent(g.projectIdOrName) + "/feature-flags/segments";
        const instanceName =
          (g.label?.toString() ?? args.identifier ?? "current").replace(
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
