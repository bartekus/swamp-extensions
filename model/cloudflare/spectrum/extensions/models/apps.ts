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

// Auto-generated extension model for @swamp/cloudflare/spectrum/apps
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Apps.
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
  zone_id: z.string().describe("Cloudflare zone ID"),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  created_on: z.string(),
  id: z.string().describe("Identifier."),
  modified_on: z.string(),
  argo_smart_routing: z.boolean().describe(
    'Enables Argo Smart Routing for this application.\nNotes: Only available for TCP or UDP applications with traffic_type set to "direct".',
  ).optional(),
  dns: z.object({
    name: z.string().optional(),
    type: z.enum(["CNAME", "ADDRESS"]).optional(),
  }).describe("The name and type of DNS record for the Spectrum application."),
  edge_ips: z.object({
    connectivity: z.enum(["all", "ipv4", "ipv6"]).optional(),
    type: z.enum(["dynamic", "static"]).optional(),
    ips: z.array(z.string()).optional(),
  }).optional(),
  ip_firewall: z.boolean().describe(
    "Enables IP Access Rules for this application.\nNotes: Only available for TCP applications.",
  ).optional(),
  origin_direct: z.array(z.string()).describe(
    "List of origin IP addresses. Array may contain multiple IP addresses for load balancing.",
  ).optional(),
  origin_dns: z.object({
    name: z.string().optional(),
    ttl: z.number().int().min(600).optional(),
    type: z.enum(["", "A", "AAAA", "SRV"]).optional(),
  }).describe("The name and type of DNS record for the Spectrum application.")
    .optional(),
  origin_port: z.number().int().optional(),
  protocol: z.string().describe(
    'The port configuration at Cloudflare\'s edge. May specify a single port, for example `"tcp/1000"`, or a range of ports, for example `"tcp/1000-2000"`.',
  ),
  proxy_protocol: z.enum(["off", "v1", "v2", "simple"]).describe(
    "Enables Proxy Protocol to the origin. Refer to [Enable Proxy protocol](https://developers.cloudflare.com/spectrum/getting-started/proxy-protocol/) for implementation details on PROXY Protocol V1, PROXY Protocol V2, and Simple Proxy Protocol.",
  ).optional(),
  tls: z.enum(["off", "flexible", "full", "strict"]).describe(
    "The type of TLS termination associated with the application.",
  ).optional(),
  traffic_type: z.enum(["direct", "http", "https"]).describe(
    'Determines how data travels from the edge to your origin. When set to "direct", Spectrum will send traffic directly to your origin, and the application\'s type is derived from the `protocol`. When set to "http" or "https", Spectrum will apply Cloudflare\'s HTTP/HTTPS features as it sends traffic to your origin, and the application type matches this property exactly.',
  ).optional(),
  virtual_network_id: z.string().describe(
    "Optional UUID of a virtual network for routing origin traffic through tunnel virtual networks.",
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
    created_on: z.string().optional(),
    id: z.string().optional(),
    modified_on: z.string().optional(),
    argo_smart_routing: z.boolean().optional(),
    dns: z.object({
      name: z.string().optional(),
      type: z.string().optional(),
    }).optional(),
    edge_ips: z.object({
      connectivity: z.string().optional(),
      type: z.string().optional(),
      ips: z.array(z.string()).optional(),
    }).optional(),
    ip_firewall: z.boolean().optional(),
    origin_direct: z.array(z.string()).optional(),
    origin_dns: z.object({
      name: z.string().optional(),
      ttl: z.number().optional(),
      type: z.string().optional(),
    }).optional(),
    origin_port: z.number().optional(),
    protocol: z.string().optional(),
    proxy_protocol: z.string().optional(),
    tls: z.string().optional(),
    traffic_type: z.string().optional(),
    virtual_network_id: z.string().optional(),
  }).optional(),
  id: z.string(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  zone_id: z.string().optional(),
  name: z.string().optional(),
  created_on: z.string().optional(),
  id: z.string().optional(),
  modified_on: z.string().optional(),
  argo_smart_routing: z.boolean().optional(),
  dns: z.object({
    name: z.string().optional(),
    type: z.enum(["CNAME", "ADDRESS"]).optional(),
  }).optional(),
  edge_ips: z.object({
    connectivity: z.enum(["all", "ipv4", "ipv6"]).optional(),
    type: z.enum(["dynamic", "static"]).optional(),
    ips: z.array(z.string()).optional(),
  }).optional(),
  ip_firewall: z.boolean().optional(),
  origin_direct: z.array(z.string()).optional(),
  origin_dns: z.object({
    name: z.string().optional(),
    ttl: z.number().int().min(600).optional(),
    type: z.enum(["", "A", "AAAA", "SRV"]).optional(),
  }).optional(),
  origin_port: z.number().int().optional(),
  protocol: z.string().optional(),
  proxy_protocol: z.enum(["off", "v1", "v2", "simple"]).optional(),
  tls: z.enum(["off", "flexible", "full", "strict"]).optional(),
  traffic_type: z.enum(["direct", "http", "https"]).optional(),
  virtual_network_id: z.string().optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Apps. Registered at `@swamp/cloudflare/spectrum/apps`. */
export const model = {
  type: "@swamp/cloudflare/spectrum/apps",
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
      toVersion: "2026.07.14.1",
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
      toVersion: "2026.09.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Apps resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Apps",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/zones/" + g.zone_id + "/spectrum/apps";
        const body: Record<string, unknown> = {};
        if (g.created_on !== undefined) body.created_on = g.created_on;
        if (g.id !== undefined) body.id = g.id;
        if (g.modified_on !== undefined) body.modified_on = g.modified_on;
        if (g.argo_smart_routing !== undefined) {
          body.argo_smart_routing = g.argo_smart_routing;
        }
        if (g.dns !== undefined) body.dns = g.dns;
        if (g.edge_ips !== undefined) body.edge_ips = g.edge_ips;
        if (g.ip_firewall !== undefined) body.ip_firewall = g.ip_firewall;
        if (g.origin_direct !== undefined) body.origin_direct = g.origin_direct;
        if (g.origin_dns !== undefined) body.origin_dns = g.origin_dns;
        if (g.origin_port !== undefined) body.origin_port = g.origin_port;
        if (g.protocol !== undefined) body.protocol = g.protocol;
        if (g.proxy_protocol !== undefined) {
          body.proxy_protocol = g.proxy_protocol;
        }
        if (g.tls !== undefined) body.tls = g.tls;
        if (g.traffic_type !== undefined) body.traffic_type = g.traffic_type;
        if (g.virtual_network_id !== undefined) {
          body.virtual_network_id = g.virtual_network_id;
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
      description: "Get a Apps",
      arguments: z.object({ id: z.string().describe("The ID of the Apps") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/zones/" + g.zone_id + "/spectrum/apps";
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
        "Look up an existing Apps by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/zones/" + g.zone_id + "/spectrum/apps";
        const filters: [string, string][] = [];
        if (g.created_on !== undefined) {
          filters.push(["created_on", String(g.created_on)]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.modified_on !== undefined) {
          filters.push(["modified_on", String(g.modified_on)]);
        }
        if (g.argo_smart_routing !== undefined) {
          filters.push(["argo_smart_routing", String(g.argo_smart_routing)]);
        }
        if (g.ip_firewall !== undefined) {
          filters.push(["ip_firewall", String(g.ip_firewall)]);
        }
        if (g.origin_port !== undefined) {
          filters.push(["origin_port", String(g.origin_port)]);
        }
        if (g.protocol !== undefined) {
          filters.push(["protocol", String(g.protocol)]);
        }
        if (g.proxy_protocol !== undefined) {
          filters.push(["proxy_protocol", String(g.proxy_protocol)]);
        }
        if (g.tls !== undefined) filters.push(["tls", String(g.tls)]);
        if (g.traffic_type !== undefined) {
          filters.push(["traffic_type", String(g.traffic_type)]);
        }
        if (g.virtual_network_id !== undefined) {
          filters.push(["virtual_network_id", String(g.virtual_network_id)]);
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
          throw new Error(`No apps found matching filters: ${filterDesc}`);
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
      description: "Import an existing Apps by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Apps to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/zones/" + g.zone_id + "/spectrum/apps";
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
      description: "Update Apps attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Apps by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/zones/" + g.zone_id + "/spectrum/apps";
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
        if (g.id !== undefined) body.id = g.id;
        if (g.modified_on !== undefined) body.modified_on = g.modified_on;
        if (g.argo_smart_routing !== undefined) {
          body.argo_smart_routing = g.argo_smart_routing;
        }
        if (g.dns !== undefined) body.dns = g.dns;
        if (g.edge_ips !== undefined) body.edge_ips = g.edge_ips;
        if (g.ip_firewall !== undefined) body.ip_firewall = g.ip_firewall;
        if (g.origin_direct !== undefined) body.origin_direct = g.origin_direct;
        if (g.origin_dns !== undefined) body.origin_dns = g.origin_dns;
        if (g.origin_port !== undefined) body.origin_port = g.origin_port;
        if (g.protocol !== undefined) body.protocol = g.protocol;
        if (g.proxy_protocol !== undefined) {
          body.proxy_protocol = g.proxy_protocol;
        }
        if (g.tls !== undefined) body.tls = g.tls;
        if (g.traffic_type !== undefined) body.traffic_type = g.traffic_type;
        if (g.virtual_network_id !== undefined) {
          body.virtual_network_id = g.virtual_network_id;
        }
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
      description: "Delete the Apps",
      arguments: z.object({ id: z.string().describe("The ID of the Apps") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/zones/" + g.zone_id + "/spectrum/apps";
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
      description: "Sync Apps state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Apps by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/zones/" + g.zone_id + "/spectrum/apps";
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
