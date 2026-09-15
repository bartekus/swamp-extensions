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

// Auto-generated extension model for @swamp/cloudflare/cloudforce-one/events
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Events.
 *
 * Wraps the Cloudflare API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, listAll, read, tryRead, update } from "./_lib/cloudflare.ts";

const GlobalArgsSchema = z.object({
  account_id: z.string().describe("Cloudflare account ID"),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  attacker: z.string().optional(),
  attackerCountry: z.string().optional(),
  category: z.string().optional(),
  createdAt: z.string().optional(),
  datasetId: z.array(z.string()).describe(
    "Dataset UUIDs to query, or one standalone scope value: 'all'/'*' for the legacy all-datasets behavior, 'analytics' for isAnalytics=true datasets, or 'operational' for isAnalytics=false datasets. If not provided, uses the default dataset.",
  ).optional(),
  date: z.string().optional(),
  event: z.string().optional(),
  indicator: z.string().optional(),
  indicatorType: z.string().optional(),
  insight: z.string().optional(),
  raw: z.object({
    data: z.record(z.string(), z.unknown()).optional(),
    source: z.string().optional(),
    tlp: z.string().optional(),
  }).optional(),
  targetCountry: z.string().optional(),
  targetIndustry: z.string().optional(),
  tlp: z.string().optional(),
  cursor: z.string().describe(
    "Cursor for pagination. When provided, filters are embedded in the cursor so you only need to pass cursor and pageSize.",
  ).optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.array(z.object({
    field: z.enum([
      "attacker",
      "attackerCountry",
      "category",
      "createdAt",
      "date",
      "event",
      "indicator",
      "indicatorType",
      "mitreAttack",
      "mitreCapec",
      "tags",
      "targetCountry",
      "targetIndustry",
      "tlp",
      "uuid",
      "killChain",
      "hasChildren",
    ]),
    op: z.enum([
      "equals",
      "not",
      "gt",
      "gte",
      "lt",
      "lte",
      "like",
      "contains",
      "startsWith",
      "endsWith",
      "find",
      "in",
    ]),
    value: z.string().min(1).max(512),
  })).describe(
    "Structured search as a JSON array of {field, op, value} objects. Use the 'in' operator with an array value to bulk-check up to 100 values. Multiple conditions are AND'd together. Max 10 conditions per request.",
  ).optional(),
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
  attacker: z.string().optional(),
  attackerCountry: z.string().optional(),
  attackerCountryAlpha3: z.string().optional(),
  category: z.string().optional(),
  datasetId: z.string().optional(),
  date: z.string().optional(),
  event: z.string().optional(),
  hasChildren: z.boolean().optional(),
  indicator: z.string().optional(),
  indicatorType: z.string().optional(),
  indicatorTypeId: z.number().optional(),
  insight: z.string().optional(),
  killChain: z.number().optional(),
  mitreAttack: z.array(z.string()).optional(),
  mitreCapec: z.array(z.string()).optional(),
  numReferenced: z.number().optional(),
  numReferences: z.number().optional(),
  rawId: z.string().optional(),
  referenced: z.array(z.string()).optional(),
  referencedIds: z.array(z.number()).optional(),
  references: z.array(z.string()).optional(),
  referencesIds: z.array(z.number()).optional(),
  releasabilityId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  targetCountry: z.string().optional(),
  targetCountryAlpha3: z.string().optional(),
  targetIndustry: z.string().optional(),
  tlp: z.string().optional(),
  uuid: z.string().optional(),
  id: z.string(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  name: z.string().optional(),
  attacker: z.string().optional(),
  attackerCountry: z.string().optional(),
  category: z.string().optional(),
  createdAt: z.string().optional(),
  datasetId: z.array(z.string()).optional(),
  date: z.string().optional(),
  event: z.string().optional(),
  indicator: z.string().optional(),
  indicatorType: z.string().optional(),
  insight: z.string().optional(),
  raw: z.object({
    data: z.record(z.string(), z.unknown()).optional(),
    source: z.string().optional(),
    tlp: z.string().optional(),
  }).optional(),
  targetCountry: z.string().optional(),
  targetIndustry: z.string().optional(),
  tlp: z.string().optional(),
  cursor: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  orderBy: z.string().optional(),
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.array(z.object({
    field: z.enum([
      "attacker",
      "attackerCountry",
      "category",
      "createdAt",
      "date",
      "event",
      "indicator",
      "indicatorType",
      "mitreAttack",
      "mitreCapec",
      "tags",
      "targetCountry",
      "targetIndustry",
      "tlp",
      "uuid",
      "killChain",
      "hasChildren",
    ]),
    op: z.enum([
      "equals",
      "not",
      "gt",
      "gte",
      "lt",
      "lte",
      "like",
      "contains",
      "startsWith",
      "endsWith",
      "find",
      "in",
    ]),
    value: z.string().min(1).max(512),
  })).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Events. Registered at `@swamp/cloudflare/cloudforce-one/events`. */
export const model = {
  type: "@swamp/cloudflare/cloudforce-one/events",
  version: "2026.09.15.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Events resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Events",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/cloudforce-one/events";
        const body: Record<string, unknown> = {};
        if (g.cursor !== undefined) body.cursor = g.cursor;
        if (g.datasetId !== undefined) body.datasetId = g.datasetId;
        if (g.order !== undefined) body.order = g.order;
        if (g.orderBy !== undefined) body.orderBy = g.orderBy;
        if (g.page !== undefined) body.page = g.page;
        if (g.pageSize !== undefined) body.pageSize = g.pageSize;
        if (g.search !== undefined) body.search = g.search;
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
      description: "Get a Events",
      arguments: z.object({ id: z.string().describe("The ID of the Events") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/cloudforce-one/events";
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
        "Look up an existing Events by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/cloudforce-one/events";
        const filters: [string, string][] = [];
        if (g.attacker !== undefined) {
          filters.push(["attacker", String(g.attacker)]);
        }
        if (g.attackerCountry !== undefined) {
          filters.push(["attackerCountry", String(g.attackerCountry)]);
        }
        if (g.category !== undefined) {
          filters.push(["category", String(g.category)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.date !== undefined) filters.push(["date", String(g.date)]);
        if (g.event !== undefined) filters.push(["event", String(g.event)]);
        if (g.indicator !== undefined) {
          filters.push(["indicator", String(g.indicator)]);
        }
        if (g.indicatorType !== undefined) {
          filters.push(["indicatorType", String(g.indicatorType)]);
        }
        if (g.insight !== undefined) {
          filters.push(["insight", String(g.insight)]);
        }
        if (g.targetCountry !== undefined) {
          filters.push(["targetCountry", String(g.targetCountry)]);
        }
        if (g.targetIndustry !== undefined) {
          filters.push(["targetIndustry", String(g.targetIndustry)]);
        }
        if (g.tlp !== undefined) filters.push(["tlp", String(g.tlp)]);
        if (g.cursor !== undefined) filters.push(["cursor", String(g.cursor)]);
        if (g.order !== undefined) filters.push(["order", String(g.order)]);
        if (g.orderBy !== undefined) {
          filters.push(["orderBy", String(g.orderBy)]);
        }
        if (g.page !== undefined) filters.push(["page", String(g.page)]);
        if (g.pageSize !== undefined) {
          filters.push(["pageSize", String(g.pageSize)]);
        }
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(endpoint, "cursor", undefined, {
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
          throw new Error(`No events found matching filters: ${filterDesc}`);
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
      description: "Import an existing Events by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Events to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/cloudforce-one/events";
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
      description: "Update Events attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Events by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/cloudforce-one/events";
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
        if (g.attacker !== undefined) body.attacker = g.attacker;
        if (g.attackerCountry !== undefined) {
          body.attackerCountry = g.attackerCountry;
        }
        if (g.category !== undefined) body.category = g.category;
        if (g.createdAt !== undefined) body.createdAt = g.createdAt;
        if (g.datasetId !== undefined) body.datasetId = g.datasetId;
        if (g.date !== undefined) body.date = g.date;
        if (g.event !== undefined) body.event = g.event;
        if (g.indicator !== undefined) body.indicator = g.indicator;
        if (g.indicatorType !== undefined) body.indicatorType = g.indicatorType;
        if (g.insight !== undefined) body.insight = g.insight;
        if (g.raw !== undefined) body.raw = g.raw;
        if (g.targetCountry !== undefined) body.targetCountry = g.targetCountry;
        if (g.targetIndustry !== undefined) {
          body.targetIndustry = g.targetIndustry;
        }
        if (g.tlp !== undefined) body.tlp = g.tlp;
        const result = await update(endpoint, existing.id, body, "PATCH", {
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
    sync: {
      description: "Sync Events state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Events by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/cloudforce-one/events";
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
