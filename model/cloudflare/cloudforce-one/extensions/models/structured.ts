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

// Auto-generated extension model for @swamp/cloudflare/cloudforce-one/structured
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Structured.
 *
 * Wraps the Cloudflare API as a swamp model so create, get, lookup,
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
} from "./_lib/cloudflare.ts";

const GlobalArgsSchema = z.object({
  account_id: z.string().describe("Cloudflare account ID"),
  condition: z.object({
    conditions: z.array(z.object({
      field: z.string().min(1).max(256).optional(),
      operator: z.enum([
        "==",
        "!=",
        ">",
        ">=",
        "<",
        "<=",
        "contains",
        "matches",
      ]).optional(),
      type: z.enum(["scalar", "array", "header"]),
      value: z.string().optional(),
      conditions: z.array(z.object({
        operator: z.enum([
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "contains",
          "matches",
        ]),
        subfield: z.string().min(1).max(128),
        value: z.string(),
      })).optional(),
      quantifier: z.enum(["any", "all"]).optional(),
      header_name: z.string().min(1).max(256).optional(),
      match_type: z.enum(["any", "all", "first", "last", "count"]).optional(),
    })),
    operator: z.enum(["and", "or"]),
    type: z.enum(["group"]),
  }).describe("Nested condition groups support up to 10 levels of depth."),
  description: z.string().max(1000).optional(),
  enabled: z.boolean().optional(),
  meta: z.array(z.object({
    key: z.string().min(1).max(128).regex(
      new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$"),
    ),
    value: z.string().max(10000),
  })).optional(),
  name: z.string().min(1).max(255),
  status: z.enum(["silent", "blocking"]).describe(
    "Disposition for matching email. This emits status metadata with the selected value.",
  ).optional(),
  strings: z.array(z.object({
    identifier: z.string().min(1).max(128).regex(
      new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$"),
    ),
    match_type: z.enum(["text", "hex", "regex"]).optional(),
    modifiers: z.array(z.enum(["nocase", "wide", "ascii", "fullword"]))
      .optional(),
    type: z.enum(["string_match"]),
    value: z.string().min(1).max(10000),
  })).optional(),
  apiToken: z.string().meta({ sensitive: true }).describe(
    "Cloudflare API token; overrides the CLOUDFLARE_API_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  apiKey: z.string().meta({ sensitive: true }).describe(
    "Cloudflare API key for the legacy key+email auth path; overrides the CLOUDFLARE_API_KEY environment variable. Wire with a vault.get(...) expression. Requires email.",
  ).optional(),
  email: z.string().meta({ sensitive: true }).describe(
    "Cloudflare account email for the legacy key+email auth path; overrides the CLOUDFLARE_EMAIL environment variable. Requires apiKey.",
  ).optional(),
});

const ResourceSchema = z.object({
  content: z.string().optional(),
  created_at: z.number().optional(),
  created_by: z.string().optional(),
  description: z.string().optional(),
  enabled: z.boolean().optional(),
  id: z.string(),
  is_public: z.boolean().optional(),
  meta: z.array(z.object({
    key: z.string().optional(),
    type: z.string().optional(),
    value: z.string().optional(),
  })).optional(),
  name: z.string().optional(),
  namespaces: z.array(z.string()).optional(),
  path: z.string().optional(),
  pending_approval_id: z.number().optional(),
  pending_change: z.object({
    approval_id: z.number().optional(),
    requested_at: z.number().optional(),
    requested_by: z.string().optional(),
    type: z.string().optional(),
  }).optional(),
  structured_source: z.string().optional(),
  updated_at: z.number().optional(),
  updated_by: z.string().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  condition: z.object({
    conditions: z.array(z.object({
      field: z.string().min(1).max(256).optional(),
      operator: z.enum([
        "==",
        "!=",
        ">",
        ">=",
        "<",
        "<=",
        "contains",
        "matches",
      ]).optional(),
      type: z.enum(["scalar", "array", "header"]),
      value: z.string().optional(),
      conditions: z.array(z.object({
        operator: z.enum([
          "==",
          "!=",
          ">",
          ">=",
          "<",
          "<=",
          "contains",
          "matches",
        ]),
        subfield: z.string().min(1).max(128),
        value: z.string(),
      })).optional(),
      quantifier: z.enum(["any", "all"]).optional(),
      header_name: z.string().min(1).max(256).optional(),
      match_type: z.enum(["any", "all", "first", "last", "count"]).optional(),
    })),
    operator: z.enum(["and", "or"]),
    type: z.enum(["group"]),
  }).optional(),
  description: z.string().max(1000).optional(),
  enabled: z.boolean().optional(),
  meta: z.array(z.object({
    key: z.string().min(1).max(128).regex(
      new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$"),
    ),
    value: z.string().max(10000),
  })).optional(),
  name: z.string().min(1).max(255).optional(),
  status: z.enum(["silent", "blocking"]).optional(),
  strings: z.array(z.object({
    identifier: z.string().min(1).max(128).regex(
      new RegExp("^[a-zA-Z_][a-zA-Z0-9_]*$"),
    ),
    match_type: z.enum(["text", "hex", "regex"]).optional(),
    modifiers: z.array(z.enum(["nocase", "wide", "ascii", "fullword"]))
      .optional(),
    type: z.enum(["string_match"]),
    value: z.string().min(1).max(10000),
  })).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Structured. Registered at `@swamp/cloudflare/cloudforce-one/structured`. */
export const model = {
  type: "@swamp/cloudflare/cloudforce-one/structured",
  version: "2026.09.11.1",
  upgrades: [
    {
      toVersion: "2026.08.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.11.1",
      description: "Added: status",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Structured resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Structured",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/rules/structured";
        const body: Record<string, unknown> = {};
        if (g.condition !== undefined) body.condition = g.condition;
        if (g.description !== undefined) body.description = g.description;
        if (g.enabled !== undefined) body.enabled = g.enabled;
        if (g.meta !== undefined) body.meta = g.meta;
        if (g.name !== undefined) body.name = g.name;
        if (g.status !== undefined) body.status = g.status;
        if (g.strings !== undefined) body.strings = g.strings;
        const result = await create(endpoint, body, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        }) as ResourceData;
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
      description: "Get a Structured",
      arguments: z.object({
        id: z.string().describe("The ID of the Structured"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/rules/structured";
        const result = await read(endpoint, args.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
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
        "Look up an existing Structured by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/rules/structured";
        const filters: [string, string][] = [];
        if (g.description !== undefined) {
          filters.push(["description", String(g.description)]);
        }
        if (g.enabled !== undefined) {
          filters.push(["enabled", String(g.enabled)]);
        }
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.status !== undefined) filters.push(["status", String(g.status)]);
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(endpoint, "none", undefined, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        });
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
            `No structured found matching filters: ${filterDesc}`,
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
          (g.name?.toString() ?? result.id?.toString() ?? "current").replace(
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
        "Import an existing Structured by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Structured to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/rules/structured";
        const result = await read(endpoint, args.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
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
      description: "Update Structured attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Structured by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/rules/structured";
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
        if (g.condition !== undefined) body.condition = g.condition;
        if (g.description !== undefined) body.description = g.description;
        if (g.enabled !== undefined) body.enabled = g.enabled;
        if (g.meta !== undefined) body.meta = g.meta;
        if (g.name !== undefined) body.name = g.name;
        if (g.status !== undefined) body.status = g.status;
        if (g.strings !== undefined) body.strings = g.strings;
        const result = await update(endpoint, existing.id, body, "PUT", {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        }) as ResourceData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the Structured",
      arguments: z.object({
        id: z.string().describe("The ID of the Structured"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/rules/structured";
        const { existed } = await remove(endpoint, args.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        });
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
      description: "Sync Structured state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Structured by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/rules/structured";
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
        if (!existing.id) {
          throw new Error("Stored state has no id - cannot sync");
        }
        const result = await tryRead(endpoint, existing.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        }) as ResourceData | null;
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
