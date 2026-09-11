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

// Auto-generated extension model for @swamp/cloudflare/containers/applications
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Applications.
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
  configuration: z.object({
    authorized_keys: z.array(z.object({
      name: z.string().optional(),
      public_key: z.string(),
    })).optional(),
    command: z.array(z.string()).optional(),
    entrypoint: z.array(z.string()).optional(),
    environment_variables: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).optional(),
    image: z.string(),
    instance_type: z.enum([
      "lite",
      "basic",
      "standard-1",
      "standard-2",
      "standard-3",
      "standard-4",
    ]).optional(),
    observability: z.object({
      logs: z.object({
        enabled: z.boolean().optional(),
      }).optional(),
    }).optional(),
  }).describe("User-specified container configuration.").optional(),
  constraints: z.object({
    jurisdiction: z.string().optional(),
    regions: z.array(z.string()).optional(),
  }).optional(),
  max_instances: z.number().int().min(0).describe(
    "Sets the maximum number of instances that the application can run.",
  ).optional(),
  observability: z.object({
    logs: z.object({
      enabled: z.boolean().optional(),
    }).optional(),
  }).describe(
    "Settings for application observability such as logging. Supported fields depend\non the application's scheduling policy. Durable Object-managed applications\naccept only `logs.enabled`.\n",
  ).optional(),
  rollout_active_grace_period: z.number().int().min(0).max(604800).describe(
    "Grace period for active instances to stay alive before becoming eligible for shutdown signal due to a rollout, in seconds.\nDefaults to 0.\n",
  ).optional(),
  durable_objects: z.string().describe(
    "Set of properties to configure a Durable Object-backed application.",
  ).optional(),
  instances: z.number().int().min(0).describe(
    "The initial number of deployments to create.",
  ).optional(),
  name: z.string().describe("The name for this application."),
  scheduling_policy: z.enum(["default", "durable_object"]).describe(
    "Selects a scheduler-backed application. Use `default` when the Containers\nscheduler should maintain the requested number of instances and manage deployment\nconfiguration, placement, scaling, versions, and rollouts.\n",
  ),
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
  errors: z.array(z.object({
    code: z.number().optional(),
    documentation_url: z.string().optional(),
    message: z.string().optional(),
    source: z.object({
      pointer: z.string().optional(),
    }).optional(),
  })).optional(),
  messages: z.array(z.object({
    code: z.number().optional(),
    documentation_url: z.string().optional(),
    message: z.string().optional(),
    source: z.object({
      pointer: z.string().optional(),
    }).optional(),
  })).optional(),
  success: z.boolean().optional(),
  result: z.object({
    account_id: z.string().optional(),
    active_rollout_id: z.string().optional(),
    configuration: z.object({
      authorized_keys: z.array(z.object({
        name: z.string().optional(),
        public_key: z.string().optional(),
      })).optional(),
      command: z.array(z.string()).optional(),
      entrypoint: z.array(z.string()).optional(),
      environment_variables: z.array(z.object({
        name: z.string().optional(),
        value: z.string().optional(),
      })).optional(),
      image: z.string().optional(),
      instance_type: z.string().optional(),
      observability: z.object({
        logs: z.object({
          enabled: z.boolean().optional(),
        }).optional(),
      }).optional(),
    }).optional(),
    constraints: z.object({
      jurisdiction: z.string().optional(),
      regions: z.array(z.string()).optional(),
    }).optional(),
    created_at: z.string().optional(),
    durable_objects: z.object({
      namespace_id: z.string().optional(),
    }).optional(),
    health: z.object({
      errors: z.array(z.object({
        event: z.object({
          details: z.record(z.string(), z.unknown()).optional(),
          id: z.string().optional(),
          message: z.string().optional(),
          name: z.string().optional(),
          statusChange: z.record(z.string(), z.unknown()).optional(),
          time: z.string().optional(),
          type: z.string().optional(),
        }).optional(),
        instance_id: z.string().optional(),
      })).optional(),
      instances: z.object({
        active: z.number().optional(),
        assigned: z.number().optional(),
      }).optional(),
      summary: z.string().optional(),
    }).optional(),
    id: z.string().optional(),
    instances: z.number().optional(),
    max_instances: z.number().optional(),
    name: z.string().optional(),
    observability: z.object({
      logs: z.object({
        enabled: z.boolean().optional(),
      }).optional(),
    }).optional(),
    rollout_active_grace_period: z.number().optional(),
    scheduling_policy: z.string().optional(),
    updated_at: z.string().optional(),
    version: z.number().optional(),
  }).optional(),
  id: z.string(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  configuration: z.object({
    authorized_keys: z.array(z.object({
      name: z.string().optional(),
      public_key: z.string(),
    })).optional(),
    command: z.array(z.string()).optional(),
    entrypoint: z.array(z.string()).optional(),
    environment_variables: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })).optional(),
    image: z.string(),
    instance_type: z.enum([
      "lite",
      "basic",
      "standard-1",
      "standard-2",
      "standard-3",
      "standard-4",
    ]).optional(),
    observability: z.object({
      logs: z.object({
        enabled: z.boolean().optional(),
      }).optional(),
    }).optional(),
  }).optional(),
  constraints: z.object({
    jurisdiction: z.string().optional(),
    regions: z.array(z.string()).optional(),
  }).optional(),
  max_instances: z.number().int().min(0).optional(),
  observability: z.object({
    logs: z.object({
      enabled: z.boolean().optional(),
    }).optional(),
  }).optional(),
  rollout_active_grace_period: z.number().int().min(0).max(604800).optional(),
  durable_objects: z.string().optional(),
  instances: z.number().int().min(0).optional(),
  name: z.string().optional(),
  scheduling_policy: z.enum(["default", "durable_object"]).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Applications. Registered at `@swamp/cloudflare/containers/applications`. */
export const model = {
  type: "@swamp/cloudflare/containers/applications",
  version: "2026.09.11.1",
  upgrades: [
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
      toVersion: "2026.08.05.1",
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
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.1",
      description: "Added: affinities, priorities, jobs",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.2",
      description: "Removed: affinities, priorities, jobs",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          affinities: _affinities,
          priorities: _priorities,
          jobs: _jobs,
          ...rest
        } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.08.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.28.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Applications resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Applications",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/containers/applications";
        const body: Record<string, unknown> = {};
        if (g.configuration !== undefined) body.configuration = g.configuration;
        if (g.constraints !== undefined) body.constraints = g.constraints;
        if (g.durable_objects !== undefined) {
          body.durable_objects = g.durable_objects;
        }
        if (g.instances !== undefined) body.instances = g.instances;
        if (g.max_instances !== undefined) body.max_instances = g.max_instances;
        if (g.name !== undefined) body.name = g.name;
        if (g.observability !== undefined) body.observability = g.observability;
        if (g.rollout_active_grace_period !== undefined) {
          body.rollout_active_grace_period = g.rollout_active_grace_period;
        }
        if (g.scheduling_policy !== undefined) {
          body.scheduling_policy = g.scheduling_policy;
        }
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
      description: "Get a Applications",
      arguments: z.object({
        id: z.string().describe("The ID of the Applications"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/containers/applications";
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
        "Look up an existing Applications by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/containers/applications";
        const filters: [string, string][] = [];
        if (g.max_instances !== undefined) {
          filters.push(["max_instances", String(g.max_instances)]);
        }
        if (g.rollout_active_grace_period !== undefined) {
          filters.push([
            "rollout_active_grace_period",
            String(g.rollout_active_grace_period),
          ]);
        }
        if (g.durable_objects !== undefined) {
          filters.push(["durable_objects", String(g.durable_objects)]);
        }
        if (g.instances !== undefined) {
          filters.push(["instances", String(g.instances)]);
        }
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.scheduling_policy !== undefined) {
          filters.push(["scheduling_policy", String(g.scheduling_policy)]);
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
            `No applications found matching filters: ${filterDesc}`,
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
        "Import an existing Applications by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Applications to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/containers/applications";
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
      description: "Update Applications attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Applications by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/containers/applications";
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
        if (g.configuration !== undefined) body.configuration = g.configuration;
        if (g.constraints !== undefined) body.constraints = g.constraints;
        if (g.max_instances !== undefined) body.max_instances = g.max_instances;
        if (g.observability !== undefined) body.observability = g.observability;
        if (g.rollout_active_grace_period !== undefined) {
          body.rollout_active_grace_period = g.rollout_active_grace_period;
        }
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
      description: "Delete the Applications",
      arguments: z.object({
        id: z.string().describe("The ID of the Applications"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/containers/applications";
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
      description: "Sync Applications state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Applications by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/containers/applications";
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
