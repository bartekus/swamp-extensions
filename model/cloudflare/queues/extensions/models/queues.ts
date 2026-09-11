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

// Auto-generated extension model for @swamp/cloudflare/queues/queues
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Queues.
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
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  consumers: z.array(z.object({
    consumer_id: z.string().max(32).optional(),
    created_on: z.string().optional(),
    dead_letter_queue: z.string().optional(),
    queue_name: z.string().optional(),
    script_name: z.string().optional(),
    settings: z.object({
      batch_size: z.number().optional(),
      max_concurrency: z.number().optional(),
      max_retries: z.number().optional(),
      max_wait_time_ms: z.number().optional(),
      retry_delay: z.number().optional(),
    }).optional(),
    type: z.enum(["worker", "http_pull"]).optional(),
  })).optional(),
  consumers_total_count: z.number().optional(),
  created_on: z.string().optional(),
  jurisdiction: z.enum(["eu", "us", "fedramp"]).optional(),
  modified_on: z.string().optional(),
  producers: z.array(z.object({
    script: z.string().optional(),
    type: z.enum(["worker", "r2_bucket"]).optional(),
    bucket_name: z.string().optional(),
  })).optional(),
  producers_total_count: z.number().optional(),
  queue_id: z.string().optional(),
  queue_name: z.string(),
  settings: z.object({
    delivery_delay: z.number().optional(),
    delivery_paused: z.boolean().optional(),
    message_retention_period: z.number().optional(),
  }).optional(),
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
  consumers: z.array(z.object({
    consumer_id: z.string().optional(),
    created_on: z.string().optional(),
    dead_letter_queue: z.string().optional(),
    queue_name: z.string().optional(),
    script_name: z.string().optional(),
    settings: z.object({
      batch_size: z.number().optional(),
      max_concurrency: z.number().optional(),
      max_retries: z.number().optional(),
      max_wait_time_ms: z.number().optional(),
      retry_delay: z.number().optional(),
    }).optional(),
    type: z.string().optional(),
  })).optional(),
  consumers_total_count: z.number().optional(),
  created_on: z.string().optional(),
  jurisdiction: z.string().optional(),
  modified_on: z.string().optional(),
  producers: z.array(z.object({
    script: z.string().optional(),
    type: z.string().optional(),
    bucket_name: z.string().optional(),
  })).optional(),
  producers_total_count: z.number().optional(),
  queue_id: z.string().optional(),
  queue_name: z.string().optional(),
  settings: z.object({
    delivery_delay: z.number().optional(),
    delivery_paused: z.boolean().optional(),
    message_retention_period: z.number().optional(),
  }).optional(),
  id: z.string(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  name: z.string().optional(),
  consumers: z.array(z.object({
    consumer_id: z.string().max(32).optional(),
    created_on: z.string().optional(),
    dead_letter_queue: z.string().optional(),
    queue_name: z.string().optional(),
    script_name: z.string().optional(),
    settings: z.object({
      batch_size: z.number().optional(),
      max_concurrency: z.number().optional(),
      max_retries: z.number().optional(),
      max_wait_time_ms: z.number().optional(),
      retry_delay: z.number().optional(),
    }).optional(),
    type: z.enum(["worker", "http_pull"]).optional(),
  })).optional(),
  consumers_total_count: z.number().optional(),
  created_on: z.string().optional(),
  jurisdiction: z.enum(["eu", "us", "fedramp"]).optional(),
  modified_on: z.string().optional(),
  producers: z.array(z.object({
    script: z.string().optional(),
    type: z.enum(["worker", "r2_bucket"]).optional(),
    bucket_name: z.string().optional(),
  })).optional(),
  producers_total_count: z.number().optional(),
  queue_id: z.string().optional(),
  queue_name: z.string().optional(),
  settings: z.object({
    delivery_delay: z.number().optional(),
    delivery_paused: z.boolean().optional(),
    message_retention_period: z.number().optional(),
  }).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Queues. Registered at `@swamp/cloudflare/queues/queues`. */
export const model = {
  type: "@swamp/cloudflare/queues/queues",
  version: "2026.09.11.1",
  upgrades: [
    {
      toVersion: "2026.05.29.1",
      description: "Added: apiToken, apiKey, email",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.11.1",
      description: "Added: jurisdiction",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Queues resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Queues",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/queues";
        const body: Record<string, unknown> = {};
        if (g.jurisdiction !== undefined) body.jurisdiction = g.jurisdiction;
        if (g.queue_name !== undefined) body.queue_name = g.queue_name;
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
      description: "Get a Queues",
      arguments: z.object({ id: z.string().describe("The ID of the Queues") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/queues";
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
        "Look up an existing Queues by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/queues";
        const filters: [string, string][] = [];
        if (g.consumers_total_count !== undefined) {
          filters.push([
            "consumers_total_count",
            String(g.consumers_total_count),
          ]);
        }
        if (g.created_on !== undefined) {
          filters.push(["created_on", String(g.created_on)]);
        }
        if (g.jurisdiction !== undefined) {
          filters.push(["jurisdiction", String(g.jurisdiction)]);
        }
        if (g.modified_on !== undefined) {
          filters.push(["modified_on", String(g.modified_on)]);
        }
        if (g.producers_total_count !== undefined) {
          filters.push([
            "producers_total_count",
            String(g.producers_total_count),
          ]);
        }
        if (g.queue_id !== undefined) {
          filters.push(["queue_id", String(g.queue_id)]);
        }
        if (g.queue_name !== undefined) {
          filters.push(["queue_name", String(g.queue_name)]);
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
          throw new Error(`No queues found matching filters: ${filterDesc}`);
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
      description: "Import an existing Queues by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Queues to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/queues";
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
      description: "Update Queues attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Queues by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/queues";
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
        if (g.consumers !== undefined) body.consumers = g.consumers;
        if (g.consumers_total_count !== undefined) {
          body.consumers_total_count = g.consumers_total_count;
        }
        if (g.created_on !== undefined) body.created_on = g.created_on;
        if (g.jurisdiction !== undefined) body.jurisdiction = g.jurisdiction;
        if (g.modified_on !== undefined) body.modified_on = g.modified_on;
        if (g.producers !== undefined) body.producers = g.producers;
        if (g.producers_total_count !== undefined) {
          body.producers_total_count = g.producers_total_count;
        }
        if (g.queue_id !== undefined) body.queue_id = g.queue_id;
        if (g.queue_name !== undefined) body.queue_name = g.queue_name;
        if (g.settings !== undefined) body.settings = g.settings;
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
    delete: {
      description: "Delete the Queues",
      arguments: z.object({ id: z.string().describe("The ID of the Queues") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/queues";
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
      description: "Sync Queues state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Queues by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/queues";
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
