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

// Auto-generated extension model for @swamp/digitalocean/firewall
// Do not edit manually. Re-generate with: deno task generate:digitalocean

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a DigitalOcean firewall.
 *
 * Wraps the `/v2/firewalls` API as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  create,
  read,
  remove,
  tryFindByField,
  tryRead,
  update,
} from "./_lib/digitalocean.ts";

const GlobalArgsSchema = z.object({
  name: z.string().regex(new RegExp("^[a-zA-Z0-9][a-zA-Z0-9\\.-]+$")).describe(
    "A human-readable name for a firewall. The name must begin with an alphanumeric character. Subsequent characters must either be alphanumeric characters, a period (.), or a dash (-).",
  ),
  droplet_ids: z.array(z.number().int()).describe(
    "An array containing the IDs of the Droplets assigned to the firewall. <br><br>Requires `droplet:read` scope.",
  ).optional(),
  tags: z.array(z.unknown()).describe(
    "A flat array of tag names as strings to be applied to the resource. Tag names must exist in order to be referenced in a request. <br><br>Requires `tag:create` and `tag:read` scopes.",
  ).optional(),
  inbound_rules: z.array(z.object({
    protocol: z.enum(["tcp", "udp", "icmp"]),
    ports: z.string(),
    action: z.enum(["allow", "deny"]).optional(),
    sources: z.object({
      addresses: z.array(z.string()).optional(),
      droplet_ids: z.array(z.number().int()).optional(),
      load_balancer_uids: z.array(z.string()).optional(),
      kubernetes_ids: z.array(z.string()).optional(),
      tags: z.array(z.unknown()).optional(),
    }),
  })).optional(),
  outbound_rules: z.array(z.object({
    protocol: z.enum(["tcp", "udp", "icmp"]),
    ports: z.string(),
    action: z.enum(["allow", "deny"]).optional(),
    destinations: z.object({
      addresses: z.array(z.string()).optional(),
      droplet_ids: z.array(z.number().int()).optional(),
      load_balancer_uids: z.array(z.string()).optional(),
      kubernetes_ids: z.array(z.string()).optional(),
      tags: z.array(z.unknown()).optional(),
    }),
  })).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "DigitalOcean API token; overrides the DO_API_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  id: z.string(),
  status: z.string().optional(),
  created_at: z.string().optional(),
  pending_changes: z.array(z.object({
    droplet_id: z.number().optional(),
    removing: z.boolean().optional(),
    status: z.string().optional(),
  })).optional(),
  name: z.string().optional(),
  droplet_ids: z.array(z.number()).nullable().optional(),
  tags: z.array(z.unknown()).nullable().optional(),
  inbound_rules: z.array(z.object({
    protocol: z.string().optional(),
    ports: z.string().optional(),
    action: z.string().optional(),
    sources: z.object({
      addresses: z.array(z.string()).optional(),
      droplet_ids: z.array(z.number()).optional(),
      load_balancer_uids: z.array(z.string()).optional(),
      kubernetes_ids: z.array(z.string()).optional(),
      tags: z.array(z.unknown()).optional(),
    }).optional(),
  })).nullable().optional(),
  outbound_rules: z.array(z.object({
    protocol: z.string().optional(),
    ports: z.string().optional(),
    action: z.string().optional(),
    destinations: z.object({
      addresses: z.array(z.string()).optional(),
      droplet_ids: z.array(z.number()).optional(),
      load_balancer_uids: z.array(z.string()).optional(),
      kubernetes_ids: z.array(z.string()).optional(),
      tags: z.array(z.unknown()).optional(),
    }).optional(),
  })).nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  name: z.string().regex(new RegExp("^[a-zA-Z0-9][a-zA-Z0-9\\.-]+$"))
    .optional(),
  droplet_ids: z.array(z.number().int()).optional(),
  tags: z.array(z.unknown()).optional(),
  inbound_rules: z.array(z.object({
    protocol: z.enum(["tcp", "udp", "icmp"]),
    ports: z.string(),
    action: z.enum(["allow", "deny"]).optional(),
    sources: z.object({
      addresses: z.array(z.string()).optional(),
      droplet_ids: z.array(z.number().int()).optional(),
      load_balancer_uids: z.array(z.string()).optional(),
      kubernetes_ids: z.array(z.string()).optional(),
      tags: z.array(z.unknown()).optional(),
    }),
  })).optional(),
  outbound_rules: z.array(z.object({
    protocol: z.enum(["tcp", "udp", "icmp"]),
    ports: z.string(),
    action: z.enum(["allow", "deny"]).optional(),
    destinations: z.object({
      addresses: z.array(z.string()).optional(),
      droplet_ids: z.array(z.number().int()).optional(),
      load_balancer_uids: z.array(z.string()).optional(),
      kubernetes_ids: z.array(z.string()).optional(),
      tags: z.array(z.unknown()).optional(),
    }),
  })).optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for DigitalOcean firewall. Registered at `@swamp/digitalocean/firewall`. */
export const model = {
  type: "@swamp/digitalocean/firewall",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.03.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.03.27.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.22.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.29.1",
      description: "Added: token",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
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
      description: "Firewall resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a firewall",
      arguments: z.object({
        checkExists: z.boolean().describe(
          "If true, check whether a resource with this name already exists before creating and fail if it does (default: false)",
        ).optional(),
      }),
      execute: async (args: { checkExists?: boolean }, context: any) => {
        const g = context.globalArgs;
        const instanceName = (g.name?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        if (args.checkExists) {
          const existing = await tryFindByField(
            "/v2/firewalls",
            "name",
            g.name?.toString() ?? "",
            g.token,
          );
          if (existing) {
            throw new Error(`Resource already exists with name: ${g.name}`);
          }
        }
        const body: Record<string, unknown> = {};
        if (g.name !== undefined) body.name = g.name;
        if (g.droplet_ids !== undefined) body.droplet_ids = g.droplet_ids;
        if (g.tags !== undefined) body.tags = g.tags;
        if (g.inbound_rules !== undefined) body.inbound_rules = g.inbound_rules;
        if (g.outbound_rules !== undefined) {
          body.outbound_rules = g.outbound_rules;
        }
        const result = await create(
          "/v2/firewalls",
          body,
          undefined,
          g.token,
        ) as ResourceData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    get: {
      description: "Get a firewall",
      arguments: z.object({
        id: z.union([z.string(), z.number()]).describe(
          "The ID of the firewall",
        ),
      }),
      execute: async (args: { id: string | number }, context: any) => {
        const result = await read(
          "/v2/firewalls",
          args.id,
          undefined,
          context.globalArgs.token,
        ) as ResourceData;
        const instanceName = (result.name?.toString() ?? args.id.toString())
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update firewall attributes",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const instanceName = (g.name?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) throw new Error("No data found - run create first");
        const existing = JSON.parse(new TextDecoder().decode(content));
        const body: Record<string, unknown> = {};
        if (g.name !== undefined) body.name = g.name;
        if (g.droplet_ids !== undefined) body.droplet_ids = g.droplet_ids;
        if (g.tags !== undefined) body.tags = g.tags;
        if (g.inbound_rules !== undefined) body.inbound_rules = g.inbound_rules;
        if (g.outbound_rules !== undefined) {
          body.outbound_rules = g.outbound_rules;
        }
        const result = await update(
          "/v2/firewalls",
          existing.id ?? existing.id,
          body,
          "PUT",
          undefined,
          g.token,
        ) as ResourceData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the firewall",
      arguments: z.object({
        id: z.union([z.string(), z.number()]).describe(
          "The ID of the firewall",
        ),
      }),
      execute: async (args: { id: string | number }, context: any) => {
        const { existed } = await remove(
          "/v2/firewalls",
          args.id,
          undefined,
          context.globalArgs.token,
        );
        const instanceName =
          (context.globalArgs.name?.toString() ?? args.id.toString()).replace(
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
      description: "Sync firewall state from DigitalOcean",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const instanceName = (g.name?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No data found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const result = await tryRead(
          "/v2/firewalls",
          existing.id ?? existing.id,
          undefined,
          g.token,
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
          id: existing.id ?? existing.id,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
