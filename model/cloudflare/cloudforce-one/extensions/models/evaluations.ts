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

// Auto-generated extension model for @swamp/cloudflare/cloudforce-one/evaluations
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Evaluations.
 *
 * Wraps the Cloudflare API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, listAll, read, tryRead } from "./_lib/cloudflare.ts";

const GlobalArgsSchema = z.object({
  account_id: z.string().describe("Cloudflare account ID"),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  as_of: z.string().optional(),
  candidate_limit: z.number().int().min(1).max(100).optional(),
  dataset_ids: z.array(z.string().min(1)).optional(),
  emerging_min_current_count: z.number().int().min(1).max(100000).optional(),
  established_min_absolute_delta: z.number().int().min(1).max(100000)
    .optional(),
  established_min_prior_count: z.number().int().min(1).max(100000).optional(),
  established_min_relative_delta: z.number().min(0).max(100).optional(),
  window_days: z.number().int().min(1).max(30).optional(),
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
  id: z.string(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  name: z.string().optional(),
  as_of: z.string().optional(),
  candidate_limit: z.number().int().min(1).max(100).optional(),
  dataset_ids: z.array(z.string().min(1)).optional(),
  emerging_min_current_count: z.number().int().min(1).max(100000).optional(),
  established_min_absolute_delta: z.number().int().min(1).max(100000)
    .optional(),
  established_min_prior_count: z.number().int().min(1).max(100000).optional(),
  established_min_relative_delta: z.number().min(0).max(100).optional(),
  window_days: z.number().int().min(1).max(30).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Evaluations. Registered at `@swamp/cloudflare/cloudforce-one/evaluations`. */
export const model = {
  type: "@swamp/cloudflare/cloudforce-one/evaluations",
  version: "2026.09.15.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Evaluations resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Evaluations",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/v2/priority-intelligence/interests/evaluations";
        const body: Record<string, unknown> = {};
        if (g.as_of !== undefined) body.as_of = g.as_of;
        if (g.candidate_limit !== undefined) {
          body.candidate_limit = g.candidate_limit;
        }
        if (g.dataset_ids !== undefined) body.dataset_ids = g.dataset_ids;
        if (g.emerging_min_current_count !== undefined) {
          body.emerging_min_current_count = g.emerging_min_current_count;
        }
        if (g.established_min_absolute_delta !== undefined) {
          body.established_min_absolute_delta =
            g.established_min_absolute_delta;
        }
        if (g.established_min_prior_count !== undefined) {
          body.established_min_prior_count = g.established_min_prior_count;
        }
        if (g.established_min_relative_delta !== undefined) {
          body.established_min_relative_delta =
            g.established_min_relative_delta;
        }
        if (g.window_days !== undefined) body.window_days = g.window_days;
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
      description: "Get a Evaluations",
      arguments: z.object({
        id: z.string().describe("The ID of the Evaluations"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/v2/priority-intelligence/interests/evaluations";
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
        "Look up an existing Evaluations by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/v2/priority-intelligence/interests/evaluations";
        const filters: [string, string][] = [];
        if (g.as_of !== undefined) filters.push(["as_of", String(g.as_of)]);
        if (g.candidate_limit !== undefined) {
          filters.push(["candidate_limit", String(g.candidate_limit)]);
        }
        if (g.emerging_min_current_count !== undefined) {
          filters.push([
            "emerging_min_current_count",
            String(g.emerging_min_current_count),
          ]);
        }
        if (g.established_min_absolute_delta !== undefined) {
          filters.push([
            "established_min_absolute_delta",
            String(g.established_min_absolute_delta),
          ]);
        }
        if (g.established_min_prior_count !== undefined) {
          filters.push([
            "established_min_prior_count",
            String(g.established_min_prior_count),
          ]);
        }
        if (g.established_min_relative_delta !== undefined) {
          filters.push([
            "established_min_relative_delta",
            String(g.established_min_relative_delta),
          ]);
        }
        if (g.window_days !== undefined) {
          filters.push(["window_days", String(g.window_days)]);
        }
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
            `No evaluations found matching filters: ${filterDesc}`,
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
        "Import an existing Evaluations by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Evaluations to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/v2/priority-intelligence/interests/evaluations";
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
    sync: {
      description: "Sync Evaluations state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Evaluations by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/cloudforce-one/v2/priority-intelligence/interests/evaluations";
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
