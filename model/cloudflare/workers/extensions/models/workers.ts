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

// Auto-generated extension model for @swamp/cloudflare/workers/workers
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Workers.
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
  created_on: z.string().describe("When the Worker was created."),
  deployed_on: z.string().describe(
    "When the Worker's most recent deployment was created. `null` if the Worker has never been deployed.",
  ).optional(),
  id: z.string().describe("Immutable ID of the Worker."),
  logpush: z.boolean().describe("Whether logpush is enabled for the Worker."),
  name: z.string().regex(new RegExp("^[a-z0-9_][a-z0-9-_]*$")).describe(
    "Name of the Worker.",
  ),
  observability: z.object({
    enabled: z.boolean().optional(),
    head_sampling_rate: z.number().optional(),
    issues: z.object({
      enabled: z.boolean().optional(),
    }).optional(),
    logs: z.object({
      destinations: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
      head_sampling_rate: z.number().optional(),
      invocation_logs: z.boolean().optional(),
      persist: z.boolean().optional(),
    }).optional(),
    redact_query_string: z.boolean().optional(),
    traces: z.object({
      destinations: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
      head_sampling_rate: z.number().optional(),
      persist: z.boolean().optional(),
      propagation_policy: z.enum(["authenticated", "accept"]).optional(),
    }).optional(),
  }).describe("Observability settings for the Worker."),
  references: z.object({
    dispatch_namespace_outbounds: z.array(z.object({
      namespace_id: z.string(),
      namespace_name: z.string(),
      worker_id: z.string(),
      worker_name: z.string(),
    })),
    domains: z.array(z.object({
      certificate_id: z.string(),
      hostname: z.string(),
      id: z.string(),
      zone_id: z.string(),
      zone_name: z.string(),
    })),
    durable_objects: z.array(z.object({
      namespace_id: z.string(),
      namespace_name: z.string(),
      worker_id: z.string(),
      worker_name: z.string(),
    })),
    queues: z.array(z.object({
      queue_consumer_id: z.string(),
      queue_id: z.string(),
      queue_name: z.string(),
    })),
    workers: z.array(z.object({
      id: z.string(),
      name: z.string(),
    })),
  }).describe(
    "Other resources that reference the Worker and depend on it existing.",
  ),
  subdomain: z.object({
    enabled: z.boolean().optional(),
    preview_url_suffix: z.string().optional(),
    previews_enabled: z.boolean().optional(),
    url: z.string().optional(),
  }).describe("Subdomain settings for the Worker."),
  tags: z.array(z.string().max(1024).regex(new RegExp("^[^,&]*$"))).describe(
    "Tags associated with the Worker.",
  ),
  tail_consumers: z.array(z.object({
    name: z.string(),
  })).describe("Other Workers that should consume logs from the Worker."),
  updated_on: z.string().describe("When the Worker was most recently updated."),
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
  created_on: z.string().optional(),
  deployed_on: z.string().optional(),
  id: z.string(),
  logpush: z.boolean().optional(),
  name: z.string().optional(),
  observability: z.object({
    enabled: z.boolean().optional(),
    head_sampling_rate: z.number().optional(),
    issues: z.object({
      enabled: z.boolean().optional(),
    }).optional(),
    logs: z.object({
      destinations: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
      head_sampling_rate: z.number().optional(),
      invocation_logs: z.boolean().optional(),
      persist: z.boolean().optional(),
    }).optional(),
    redact_query_string: z.boolean().optional(),
    traces: z.object({
      destinations: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
      head_sampling_rate: z.number().optional(),
      persist: z.boolean().optional(),
      propagation_policy: z.string().optional(),
    }).optional(),
  }).optional(),
  references: z.object({
    dispatch_namespace_outbounds: z.array(z.object({
      namespace_id: z.string().optional(),
      namespace_name: z.string().optional(),
      worker_id: z.string().optional(),
      worker_name: z.string().optional(),
    })).optional(),
    domains: z.array(z.object({
      certificate_id: z.string().optional(),
      hostname: z.string().optional(),
      id: z.string().optional(),
      zone_id: z.string().optional(),
      zone_name: z.string().optional(),
    })).optional(),
    durable_objects: z.array(z.object({
      namespace_id: z.string().optional(),
      namespace_name: z.string().optional(),
      worker_id: z.string().optional(),
      worker_name: z.string().optional(),
    })).optional(),
    queues: z.array(z.object({
      queue_consumer_id: z.string().optional(),
      queue_id: z.string().optional(),
      queue_name: z.string().optional(),
    })).optional(),
    workers: z.array(z.object({
      id: z.string().optional(),
      name: z.string().optional(),
    })).optional(),
  }).optional(),
  subdomain: z.object({
    enabled: z.boolean().optional(),
    preview_url_suffix: z.string().optional(),
    previews_enabled: z.boolean().optional(),
    url: z.string().optional(),
  }).optional(),
  tags: z.array(z.string()).optional(),
  tail_consumers: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  updated_on: z.string().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  created_on: z.string().optional(),
  deployed_on: z.string().optional(),
  id: z.string().optional(),
  logpush: z.boolean().optional(),
  name: z.string().regex(new RegExp("^[a-z0-9_][a-z0-9-_]*$")).optional(),
  observability: z.object({
    enabled: z.boolean().optional(),
    head_sampling_rate: z.number().optional(),
    issues: z.object({
      enabled: z.boolean().optional(),
    }).optional(),
    logs: z.object({
      destinations: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
      head_sampling_rate: z.number().optional(),
      invocation_logs: z.boolean().optional(),
      persist: z.boolean().optional(),
    }).optional(),
    redact_query_string: z.boolean().optional(),
    traces: z.object({
      destinations: z.array(z.string()).optional(),
      enabled: z.boolean().optional(),
      head_sampling_rate: z.number().optional(),
      persist: z.boolean().optional(),
      propagation_policy: z.enum(["authenticated", "accept"]).optional(),
    }).optional(),
  }).optional(),
  references: z.object({
    dispatch_namespace_outbounds: z.array(z.object({
      namespace_id: z.string(),
      namespace_name: z.string(),
      worker_id: z.string(),
      worker_name: z.string(),
    })),
    domains: z.array(z.object({
      certificate_id: z.string(),
      hostname: z.string(),
      id: z.string(),
      zone_id: z.string(),
      zone_name: z.string(),
    })),
    durable_objects: z.array(z.object({
      namespace_id: z.string(),
      namespace_name: z.string(),
      worker_id: z.string(),
      worker_name: z.string(),
    })),
    queues: z.array(z.object({
      queue_consumer_id: z.string(),
      queue_id: z.string(),
      queue_name: z.string(),
    })),
    workers: z.array(z.object({
      id: z.string(),
      name: z.string(),
    })),
  }).optional(),
  subdomain: z.object({
    enabled: z.boolean().optional(),
    preview_url_suffix: z.string().optional(),
    previews_enabled: z.boolean().optional(),
    url: z.string().optional(),
  }).optional(),
  tags: z.array(z.string().max(1024).regex(new RegExp("^[^,&]*$"))).optional(),
  tail_consumers: z.array(z.object({
    name: z.string(),
  })).optional(),
  updated_on: z.string().optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Workers. Registered at `@swamp/cloudflare/workers/workers`. */
export const model = {
  type: "@swamp/cloudflare/workers/workers",
  version: "2026.09.16.1",
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
      toVersion: "2026.08.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.26.1",
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
      description: "Workers resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Workers",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/workers/workers";
        const body: Record<string, unknown> = {};
        if (g.created_on !== undefined) body.created_on = g.created_on;
        if (g.deployed_on !== undefined) body.deployed_on = g.deployed_on;
        if (g.id !== undefined) body.id = g.id;
        if (g.logpush !== undefined) body.logpush = g.logpush;
        if (g.name !== undefined) body.name = g.name;
        if (g.observability !== undefined) body.observability = g.observability;
        if (g.references !== undefined) body.references = g.references;
        if (g.subdomain !== undefined) body.subdomain = g.subdomain;
        if (g.tags !== undefined) body.tags = g.tags;
        if (g.tail_consumers !== undefined) {
          body.tail_consumers = g.tail_consumers;
        }
        if (g.updated_on !== undefined) body.updated_on = g.updated_on;
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
      description: "Get a Workers",
      arguments: z.object({ id: z.string().describe("The ID of the Workers") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/workers/workers";
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
        "Look up an existing Workers by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/workers/workers";
        const filters: [string, string][] = [];
        if (g.created_on !== undefined) {
          filters.push(["created_on", String(g.created_on)]);
        }
        if (g.deployed_on !== undefined) {
          filters.push(["deployed_on", String(g.deployed_on)]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.logpush !== undefined) {
          filters.push(["logpush", String(g.logpush)]);
        }
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.updated_on !== undefined) {
          filters.push(["updated_on", String(g.updated_on)]);
        }
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
          throw new Error(`No workers found matching filters: ${filterDesc}`);
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
      description: "Import an existing Workers by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Workers to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/workers/workers";
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
      description: "Update Workers attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Workers by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/workers/workers";
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
        if (g.created_on !== undefined) body.created_on = g.created_on;
        if (g.deployed_on !== undefined) body.deployed_on = g.deployed_on;
        if (g.id !== undefined) body.id = g.id;
        if (g.logpush !== undefined) body.logpush = g.logpush;
        if (g.name !== undefined) body.name = g.name;
        if (g.observability !== undefined) body.observability = g.observability;
        if (g.references !== undefined) body.references = g.references;
        if (g.subdomain !== undefined) body.subdomain = g.subdomain;
        if (g.tags !== undefined) body.tags = g.tags;
        if (g.tail_consumers !== undefined) {
          body.tail_consumers = g.tail_consumers;
        }
        if (g.updated_on !== undefined) body.updated_on = g.updated_on;
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
      description: "Delete the Workers",
      arguments: z.object({ id: z.string().describe("The ID of the Workers") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/workers/workers";
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
      description: "Sync Workers state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Workers by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/workers/workers";
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
