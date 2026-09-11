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

// Auto-generated extension model for @swamp/cloudflare/ai-gateway/gateways
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Gateways.
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
  authentication: z.boolean().optional(),
  byok_only: z.boolean().describe(
    "Requires customer-provided provider credentials and prevents fallback to Unified Billing.",
  ).optional(),
  cache_invalidate_on_update: z.boolean(),
  cache_ttl: z.number().int().min(0),
  collect_logs: z.boolean(),
  dlp: z.object({
    action: z.enum(["BLOCK", "FLAG"]).optional(),
    enabled: z.boolean(),
    profiles: z.array(z.string()).optional(),
    policies: z.array(z.object({
      action: z.enum(["FLAG", "BLOCK"]),
      check: z.array(z.enum(["REQUEST", "RESPONSE"])),
      enabled: z.boolean(),
      id: z.string(),
      profiles: z.array(z.string()),
    })).optional(),
  }).optional(),
  guardrails: z.object({
    prompt: z.object({
      P1: z.enum(["FLAG", "BLOCK"]).optional(),
      S1: z.enum(["FLAG", "BLOCK"]).optional(),
      S10: z.enum(["FLAG", "BLOCK"]).optional(),
      S11: z.enum(["FLAG", "BLOCK"]).optional(),
      S12: z.enum(["FLAG", "BLOCK"]).optional(),
      S13: z.enum(["FLAG", "BLOCK"]).optional(),
      S2: z.enum(["FLAG", "BLOCK"]).optional(),
      S3: z.enum(["FLAG", "BLOCK"]).optional(),
      S4: z.enum(["FLAG", "BLOCK"]).optional(),
      S5: z.enum(["FLAG", "BLOCK"]).optional(),
      S6: z.enum(["FLAG", "BLOCK"]).optional(),
      S7: z.enum(["FLAG", "BLOCK"]).optional(),
      S8: z.enum(["FLAG", "BLOCK"]).optional(),
      S9: z.enum(["FLAG", "BLOCK"]).optional(),
    }),
    response: z.object({
      P1: z.enum(["FLAG", "BLOCK"]).optional(),
      S1: z.enum(["FLAG", "BLOCK"]).optional(),
      S10: z.enum(["FLAG", "BLOCK"]).optional(),
      S11: z.enum(["FLAG", "BLOCK"]).optional(),
      S12: z.enum(["FLAG", "BLOCK"]).optional(),
      S13: z.enum(["FLAG", "BLOCK"]).optional(),
      S2: z.enum(["FLAG", "BLOCK"]).optional(),
      S3: z.enum(["FLAG", "BLOCK"]).optional(),
      S4: z.enum(["FLAG", "BLOCK"]).optional(),
      S5: z.enum(["FLAG", "BLOCK"]).optional(),
      S6: z.enum(["FLAG", "BLOCK"]).optional(),
      S7: z.enum(["FLAG", "BLOCK"]).optional(),
      S8: z.enum(["FLAG", "BLOCK"]).optional(),
      S9: z.enum(["FLAG", "BLOCK"]).optional(),
    }),
  }).optional(),
  log_classification: z.boolean().optional(),
  log_management: z.number().int().min(10000).max(10000000).optional(),
  log_management_strategy: z.enum(["STOP_INSERTING", "DELETE_OLDEST"])
    .optional(),
  logpush: z.boolean().optional(),
  logpush_public_key: z.string().min(16).max(1024).optional(),
  otel: z.array(z.object({
    authorization: z.string().max(256).optional(),
    content_type: z.enum(["json", "protobuf"]).optional(),
    headers: z.record(z.string(), z.unknown()),
    url: z.string().max(2048),
  })).optional(),
  rate_limiting_interval: z.number().int().min(0),
  rate_limiting_limit: z.number().int().min(0),
  rate_limiting_technique: z.enum(["fixed", "sliding"]).optional(),
  retry_backoff: z.enum(["constant", "linear", "exponential"]).describe(
    "Backoff strategy for retry delays",
  ).optional(),
  retry_delay: z.number().int().min(0).max(60000).describe(
    "Delay between retry attempts in milliseconds (0-60000)",
  ).optional(),
  retry_max_attempts: z.number().int().min(1).max(5).describe(
    "Maximum number of retry attempts for failed requests (1-5)",
  ).optional(),
  spend_limits: z.object({
    enabled: z.boolean().optional(),
    rules: z.array(z.object({
      enabled: z.boolean().optional(),
      id: z.string().min(1).regex(new RegExp("^[a-zA-Z0-9_-]+$")).optional(),
      limit: z.number().min(0),
      limitType: z.enum(["cost"]),
      metadata: z.record(z.string(), z.unknown()).optional(),
      model: z.object({
        mode: z.enum(["filter"]),
        values: z.array(z.string()),
      }).optional(),
      provider: z.object({
        mode: z.enum(["filter"]),
        values: z.array(z.string()),
      }).optional(),
      technique: z.enum(["fixed", "sliding"]).optional(),
      window: z.number().int().min(0),
    })).optional(),
  }).optional(),
  store_id: z.string().optional(),
  stripe: z.object({
    authorization: z.string(),
    usage_events: z.array(z.object({
      payload: z.string(),
    })),
  }).optional(),
  workers_ai_billing_mode: z.enum(["postpaid", "unified"]).describe(
    "Controls how Workers AI inference calls routed through this gateway are billed. 'postpaid' bills the account directly through Workers AI; 'unified' deducts credits via AI Gateway using neuron-based pricing and delegates billing to AI Gateway.",
  ).optional(),
  zdr: z.boolean().optional(),
  id: z.string().min(1).max(64).regex(
    new RegExp("^[a-z0-9_]+(?:-[a-z0-9_]+)*$"),
  ).describe("gateway id"),
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
  authentication: z.boolean().optional(),
  byok_only: z.boolean().optional(),
  cache_invalidate_on_update: z.boolean().optional(),
  cache_ttl: z.number().optional(),
  collect_logs: z.boolean().optional(),
  created_at: z.string().optional(),
  dlp: z.object({
    action: z.string().optional(),
    enabled: z.boolean().optional(),
    profiles: z.array(z.string()).optional(),
    policies: z.array(z.object({
      action: z.string().optional(),
      check: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
      id: z.string().optional(),
      profiles: z.array(z.string()).optional(),
    })).optional(),
  }).optional(),
  guardrails: z.object({
    prompt: z.object({
      P1: z.string().optional(),
      S1: z.string().optional(),
      S10: z.string().optional(),
      S11: z.string().optional(),
      S12: z.string().optional(),
      S13: z.string().optional(),
      S2: z.string().optional(),
      S3: z.string().optional(),
      S4: z.string().optional(),
      S5: z.string().optional(),
      S6: z.string().optional(),
      S7: z.string().optional(),
      S8: z.string().optional(),
      S9: z.string().optional(),
    }).optional(),
    response: z.object({
      P1: z.string().optional(),
      S1: z.string().optional(),
      S10: z.string().optional(),
      S11: z.string().optional(),
      S12: z.string().optional(),
      S13: z.string().optional(),
      S2: z.string().optional(),
      S3: z.string().optional(),
      S4: z.string().optional(),
      S5: z.string().optional(),
      S6: z.string().optional(),
      S7: z.string().optional(),
      S8: z.string().optional(),
      S9: z.string().optional(),
    }).optional(),
  }).optional(),
  id: z.string(),
  is_default: z.boolean().optional(),
  log_classification: z.boolean().optional(),
  log_management: z.number().optional(),
  log_management_strategy: z.string().optional(),
  logpush: z.boolean().optional(),
  logpush_public_key: z.string().optional(),
  modified_at: z.string().optional(),
  otel: z.array(z.object({
    authorization: z.string().optional(),
    content_type: z.string().optional(),
    headers: z.record(z.string(), z.unknown()).optional(),
    url: z.string().optional(),
  })).optional(),
  rate_limiting_interval: z.number().optional(),
  rate_limiting_limit: z.number().optional(),
  rate_limiting_technique: z.string().optional(),
  retry_backoff: z.string().optional(),
  retry_delay: z.number().optional(),
  retry_max_attempts: z.number().optional(),
  spend_limits: z.object({
    enabled: z.boolean().optional(),
    rules: z.array(z.object({
      enabled: z.boolean().optional(),
      id: z.string().optional(),
      limit: z.number().optional(),
      limitType: z.string().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
      model: z.object({
        mode: z.string().optional(),
        values: z.array(z.string()).optional(),
      }).optional(),
      provider: z.object({
        mode: z.string().optional(),
        values: z.array(z.string()).optional(),
      }).optional(),
      technique: z.string().optional(),
      window: z.number().optional(),
    })).optional(),
  }).optional(),
  store_id: z.string().optional(),
  stripe: z.object({
    authorization: z.string().optional(),
    usage_events: z.array(z.object({
      payload: z.string().optional(),
    })).optional(),
  }).optional(),
  workers_ai_billing_mode: z.string().optional(),
  zdr: z.boolean().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  name: z.string().optional(),
  authentication: z.boolean().optional(),
  byok_only: z.boolean().optional(),
  cache_invalidate_on_update: z.boolean().optional(),
  cache_ttl: z.number().int().min(0).optional(),
  collect_logs: z.boolean().optional(),
  dlp: z.object({
    action: z.enum(["BLOCK", "FLAG"]).optional(),
    enabled: z.boolean(),
    profiles: z.array(z.string()).optional(),
    policies: z.array(z.object({
      action: z.enum(["FLAG", "BLOCK"]),
      check: z.array(z.enum(["REQUEST", "RESPONSE"])),
      enabled: z.boolean(),
      id: z.string(),
      profiles: z.array(z.string()),
    })).optional(),
  }).optional(),
  guardrails: z.object({
    prompt: z.object({
      P1: z.enum(["FLAG", "BLOCK"]).optional(),
      S1: z.enum(["FLAG", "BLOCK"]).optional(),
      S10: z.enum(["FLAG", "BLOCK"]).optional(),
      S11: z.enum(["FLAG", "BLOCK"]).optional(),
      S12: z.enum(["FLAG", "BLOCK"]).optional(),
      S13: z.enum(["FLAG", "BLOCK"]).optional(),
      S2: z.enum(["FLAG", "BLOCK"]).optional(),
      S3: z.enum(["FLAG", "BLOCK"]).optional(),
      S4: z.enum(["FLAG", "BLOCK"]).optional(),
      S5: z.enum(["FLAG", "BLOCK"]).optional(),
      S6: z.enum(["FLAG", "BLOCK"]).optional(),
      S7: z.enum(["FLAG", "BLOCK"]).optional(),
      S8: z.enum(["FLAG", "BLOCK"]).optional(),
      S9: z.enum(["FLAG", "BLOCK"]).optional(),
    }),
    response: z.object({
      P1: z.enum(["FLAG", "BLOCK"]).optional(),
      S1: z.enum(["FLAG", "BLOCK"]).optional(),
      S10: z.enum(["FLAG", "BLOCK"]).optional(),
      S11: z.enum(["FLAG", "BLOCK"]).optional(),
      S12: z.enum(["FLAG", "BLOCK"]).optional(),
      S13: z.enum(["FLAG", "BLOCK"]).optional(),
      S2: z.enum(["FLAG", "BLOCK"]).optional(),
      S3: z.enum(["FLAG", "BLOCK"]).optional(),
      S4: z.enum(["FLAG", "BLOCK"]).optional(),
      S5: z.enum(["FLAG", "BLOCK"]).optional(),
      S6: z.enum(["FLAG", "BLOCK"]).optional(),
      S7: z.enum(["FLAG", "BLOCK"]).optional(),
      S8: z.enum(["FLAG", "BLOCK"]).optional(),
      S9: z.enum(["FLAG", "BLOCK"]).optional(),
    }),
  }).optional(),
  log_classification: z.boolean().optional(),
  log_management: z.number().int().min(10000).max(10000000).optional(),
  log_management_strategy: z.enum(["STOP_INSERTING", "DELETE_OLDEST"])
    .optional(),
  logpush: z.boolean().optional(),
  logpush_public_key: z.string().min(16).max(1024).optional(),
  otel: z.array(z.object({
    authorization: z.string().max(256).optional(),
    content_type: z.enum(["json", "protobuf"]).optional(),
    headers: z.record(z.string(), z.unknown()),
    url: z.string().max(2048),
  })).optional(),
  rate_limiting_interval: z.number().int().min(0).optional(),
  rate_limiting_limit: z.number().int().min(0).optional(),
  rate_limiting_technique: z.enum(["fixed", "sliding"]).optional(),
  retry_backoff: z.enum(["constant", "linear", "exponential"]).optional(),
  retry_delay: z.number().int().min(0).max(60000).optional(),
  retry_max_attempts: z.number().int().min(1).max(5).optional(),
  spend_limits: z.object({
    enabled: z.boolean().optional(),
    rules: z.array(z.object({
      enabled: z.boolean().optional(),
      id: z.string().min(1).regex(new RegExp("^[a-zA-Z0-9_-]+$")).optional(),
      limit: z.number().min(0),
      limitType: z.enum(["cost"]),
      metadata: z.record(z.string(), z.unknown()).optional(),
      model: z.object({
        mode: z.enum(["filter"]),
        values: z.array(z.string()),
      }).optional(),
      provider: z.object({
        mode: z.enum(["filter"]),
        values: z.array(z.string()),
      }).optional(),
      technique: z.enum(["fixed", "sliding"]).optional(),
      window: z.number().int().min(0),
    })).optional(),
  }).optional(),
  store_id: z.string().optional(),
  stripe: z.object({
    authorization: z.string(),
    usage_events: z.array(z.object({
      payload: z.string(),
    })),
  }).optional(),
  workers_ai_billing_mode: z.enum(["postpaid", "unified"]).optional(),
  zdr: z.boolean().optional(),
  id: z.string().min(1).max(64).regex(
    new RegExp("^[a-z0-9_]+(?:-[a-z0-9_]+)*$"),
  ).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Gateways. Registered at `@swamp/cloudflare/ai-gateway/gateways`. */
export const model = {
  type: "@swamp/cloudflare/ai-gateway/gateways",
  version: "2026.09.11.1",
  upgrades: [
    {
      toVersion: "2026.05.29.1",
      description: "Added: apiToken, apiKey, email",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "Added: spend_limits",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.2",
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
      toVersion: "2026.08.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.15.1",
      description: "Added: log_classification",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.2",
      description: "Added: log_classification, spend_limits",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.11.1",
      description: "Added: byok_only",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Gateways resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Gateways",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-gateway/gateways";
        const body: Record<string, unknown> = {};
        if (g.authentication !== undefined) {
          body.authentication = g.authentication;
        }
        if (g.byok_only !== undefined) body.byok_only = g.byok_only;
        if (g.cache_invalidate_on_update !== undefined) {
          body.cache_invalidate_on_update = g.cache_invalidate_on_update;
        }
        if (g.cache_ttl !== undefined) body.cache_ttl = g.cache_ttl;
        if (g.collect_logs !== undefined) body.collect_logs = g.collect_logs;
        if (g.id !== undefined) body.id = g.id;
        if (g.log_management !== undefined) {
          body.log_management = g.log_management;
        }
        if (g.log_management_strategy !== undefined) {
          body.log_management_strategy = g.log_management_strategy;
        }
        if (g.logpush !== undefined) body.logpush = g.logpush;
        if (g.logpush_public_key !== undefined) {
          body.logpush_public_key = g.logpush_public_key;
        }
        if (g.rate_limiting_interval !== undefined) {
          body.rate_limiting_interval = g.rate_limiting_interval;
        }
        if (g.rate_limiting_limit !== undefined) {
          body.rate_limiting_limit = g.rate_limiting_limit;
        }
        if (g.rate_limiting_technique !== undefined) {
          body.rate_limiting_technique = g.rate_limiting_technique;
        }
        if (g.retry_backoff !== undefined) body.retry_backoff = g.retry_backoff;
        if (g.retry_delay !== undefined) body.retry_delay = g.retry_delay;
        if (g.retry_max_attempts !== undefined) {
          body.retry_max_attempts = g.retry_max_attempts;
        }
        if (g.store_id !== undefined) body.store_id = g.store_id;
        if (g.workers_ai_billing_mode !== undefined) {
          body.workers_ai_billing_mode = g.workers_ai_billing_mode;
        }
        if (g.zdr !== undefined) body.zdr = g.zdr;
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
      description: "Get a Gateways",
      arguments: z.object({
        id: z.string().describe("The ID of the Gateways"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-gateway/gateways";
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
        "Look up an existing Gateways by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-gateway/gateways";
        const filters: [string, string][] = [];
        if (g.authentication !== undefined) {
          filters.push(["authentication", String(g.authentication)]);
        }
        if (g.byok_only !== undefined) {
          filters.push(["byok_only", String(g.byok_only)]);
        }
        if (g.cache_invalidate_on_update !== undefined) {
          filters.push([
            "cache_invalidate_on_update",
            String(g.cache_invalidate_on_update),
          ]);
        }
        if (g.cache_ttl !== undefined) {
          filters.push(["cache_ttl", String(g.cache_ttl)]);
        }
        if (g.collect_logs !== undefined) {
          filters.push(["collect_logs", String(g.collect_logs)]);
        }
        if (g.log_classification !== undefined) {
          filters.push(["log_classification", String(g.log_classification)]);
        }
        if (g.log_management !== undefined) {
          filters.push(["log_management", String(g.log_management)]);
        }
        if (g.log_management_strategy !== undefined) {
          filters.push([
            "log_management_strategy",
            String(g.log_management_strategy),
          ]);
        }
        if (g.logpush !== undefined) {
          filters.push(["logpush", String(g.logpush)]);
        }
        if (g.logpush_public_key !== undefined) {
          filters.push(["logpush_public_key", String(g.logpush_public_key)]);
        }
        if (g.rate_limiting_interval !== undefined) {
          filters.push([
            "rate_limiting_interval",
            String(g.rate_limiting_interval),
          ]);
        }
        if (g.rate_limiting_limit !== undefined) {
          filters.push(["rate_limiting_limit", String(g.rate_limiting_limit)]);
        }
        if (g.rate_limiting_technique !== undefined) {
          filters.push([
            "rate_limiting_technique",
            String(g.rate_limiting_technique),
          ]);
        }
        if (g.retry_backoff !== undefined) {
          filters.push(["retry_backoff", String(g.retry_backoff)]);
        }
        if (g.retry_delay !== undefined) {
          filters.push(["retry_delay", String(g.retry_delay)]);
        }
        if (g.retry_max_attempts !== undefined) {
          filters.push(["retry_max_attempts", String(g.retry_max_attempts)]);
        }
        if (g.store_id !== undefined) {
          filters.push(["store_id", String(g.store_id)]);
        }
        if (g.workers_ai_billing_mode !== undefined) {
          filters.push([
            "workers_ai_billing_mode",
            String(g.workers_ai_billing_mode),
          ]);
        }
        if (g.zdr !== undefined) filters.push(["zdr", String(g.zdr)]);
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(endpoint, "page", undefined, {
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
          throw new Error(`No gateways found matching filters: ${filterDesc}`);
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
        "Import an existing Gateways by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Gateways to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-gateway/gateways";
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
      description: "Update Gateways attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Gateways by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-gateway/gateways";
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
        if (g.authentication !== undefined) {
          body.authentication = g.authentication;
        }
        if (g.byok_only !== undefined) body.byok_only = g.byok_only;
        if (g.cache_invalidate_on_update !== undefined) {
          body.cache_invalidate_on_update = g.cache_invalidate_on_update;
        }
        if (g.cache_ttl !== undefined) body.cache_ttl = g.cache_ttl;
        if (g.collect_logs !== undefined) body.collect_logs = g.collect_logs;
        if (g.dlp !== undefined) body.dlp = g.dlp;
        if (g.guardrails !== undefined) body.guardrails = g.guardrails;
        if (g.log_classification !== undefined) {
          body.log_classification = g.log_classification;
        }
        if (g.log_management !== undefined) {
          body.log_management = g.log_management;
        }
        if (g.log_management_strategy !== undefined) {
          body.log_management_strategy = g.log_management_strategy;
        }
        if (g.logpush !== undefined) body.logpush = g.logpush;
        if (g.logpush_public_key !== undefined) {
          body.logpush_public_key = g.logpush_public_key;
        }
        if (g.otel !== undefined) body.otel = g.otel;
        if (g.rate_limiting_interval !== undefined) {
          body.rate_limiting_interval = g.rate_limiting_interval;
        }
        if (g.rate_limiting_limit !== undefined) {
          body.rate_limiting_limit = g.rate_limiting_limit;
        }
        if (g.rate_limiting_technique !== undefined) {
          body.rate_limiting_technique = g.rate_limiting_technique;
        }
        if (g.retry_backoff !== undefined) body.retry_backoff = g.retry_backoff;
        if (g.retry_delay !== undefined) body.retry_delay = g.retry_delay;
        if (g.retry_max_attempts !== undefined) {
          body.retry_max_attempts = g.retry_max_attempts;
        }
        if (g.spend_limits !== undefined) body.spend_limits = g.spend_limits;
        if (g.store_id !== undefined) body.store_id = g.store_id;
        if (g.stripe !== undefined) body.stripe = g.stripe;
        if (g.workers_ai_billing_mode !== undefined) {
          body.workers_ai_billing_mode = g.workers_ai_billing_mode;
        }
        if (g.zdr !== undefined) body.zdr = g.zdr;
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
      description: "Delete the Gateways",
      arguments: z.object({
        id: z.string().describe("The ID of the Gateways"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-gateway/gateways";
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
      description: "Sync Gateways state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Gateways by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-gateway/gateways";
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
