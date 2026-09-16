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

// Auto-generated extension model for @swamp/vercel/networking/endpoints
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Endpoints.
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
  name: z.string().max(255).describe(
    "The name of the PrivateLink endpoint, used as its label in the Vercel dashboard.",
  ),
  enablePrivateDns: z.boolean().describe(
    "Whether to resolve the endpoint service through its private DNS names, which are then returned in `privateDnsNames`. Defaults to `false`, in which case the endpoint is reachable through the DNS names in `awsDnsEntries`.",
  ).optional(),
  projectId: z.string().describe(
    "The project ID to create the PrivateLink endpoint for.",
  ),
  vercelRegion: z.string().describe(
    "The Vercel region to provision the endpoint in. Advanced Networking must be enabled for the project in that region. The endpoint service itself may live in another AWS region.",
  ),
  awsServiceName: z.string().describe(
    "The name of the AWS VPC endpoint service to connect to. Its AWS region is read from the name; when that region differs from the one behind `vercelRegion`, the service must allow cross-region access.",
  ),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  awsDnsEntries: z.array(z.string()).nullable().optional(),
  awsServiceName: z.string().nullable().optional(),
  createdAt: z.number().nullable().optional(),
  endpointId: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  privateDnsNames: z.array(z.string()).nullable().optional(),
  projectId: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  statusMessage: z.string().nullable().optional(),
  teamId: z.string().nullable().optional(),
  updatedAt: z.number().nullable().optional(),
  vercelRegion: z.string().nullable().optional(),
  vpcEndpointId: z.string().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().max(255).optional(),
  enablePrivateDns: z.boolean().optional(),
  projectId: z.string().optional(),
  vercelRegion: z.string().optional(),
  awsServiceName: z.string().optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Endpoints. Registered at `@swamp/vercel/networking/endpoints`. */
export const model = {
  type: "@swamp/vercel/networking/endpoints",
  version: "2026.09.16.1",
  upgrades: [
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
      description: "Endpoints resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Endpoints",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/networking/privatelink/endpoints";
        const body: Record<string, unknown> = {};
        if (g.projectId !== undefined) body.projectId = g.projectId;
        if (g.name !== undefined) body.name = g.name;
        if (g.vercelRegion !== undefined) body.vercelRegion = g.vercelRegion;
        if (g.awsServiceName !== undefined) {
          body.awsServiceName = g.awsServiceName;
        }
        if (g.enablePrivateDns !== undefined) {
          body.enablePrivateDns = g.enablePrivateDns;
        }
        const raw = await create(endpoint, body, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        });
        const result = raw as ResourceData;
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
      description: "Get a Endpoints",
      arguments: z.object({
        id: z.string().describe("The ID of the Endpoints"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/networking/privatelink/endpoints";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
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
        "Look up an existing Endpoints by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/networking/privatelink/endpoints";
        const filters: [string, string][] = [];
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.enablePrivateDns !== undefined) {
          filters.push(["enablePrivateDns", String(g.enablePrivateDns)]);
        }
        if (g.projectId !== undefined) {
          filters.push(["projectId", String(g.projectId)]);
        }
        if (g.vercelRegion !== undefined) {
          filters.push(["vercelRegion", String(g.vercelRegion)]);
        }
        if (g.awsServiceName !== undefined) {
          filters.push(["awsServiceName", String(g.awsServiceName)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.endpointId !== undefined) {
          filters.push(["endpointId", String(g.endpointId)]);
        }
        if (g.status !== undefined) filters.push(["status", String(g.status)]);
        if (g.statusMessage !== undefined) {
          filters.push(["statusMessage", String(g.statusMessage)]);
        }
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (g.vpcEndpointId !== undefined) {
          filters.push(["vpcEndpointId", String(g.vpcEndpointId)]);
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
          throw new Error(`No endpoints found matching filters: ${filterDesc}`);
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
          (g.name?.toString() ?? result.endpointId?.toString() ?? "current")
            .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
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
        "Import an existing Endpoints by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Endpoints to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/networking/privatelink/endpoints";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
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
      description: "Update Endpoints attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Endpoints by endpointId (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/networking/privatelink/endpoints";
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
        if (g.name !== undefined) body.name = g.name;
        if (g.enablePrivateDns !== undefined) {
          body.enablePrivateDns = g.enablePrivateDns;
        }
        const result = await update(
          endpoint,
          existing.endpointId,
          body,
          "PATCH",
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
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
      description: "Delete the Endpoints",
      arguments: z.object({
        id: z.string().describe("The ID of the Endpoints"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/networking/privatelink/endpoints";
        const { existed } = await remove(
          endpoint,
          args.id,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        );
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
      description: "Sync Endpoints state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Endpoints by endpointId (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/networking/privatelink/endpoints";
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
        if (!existing.endpointId) {
          throw new Error("Stored state has no endpointId - cannot sync");
        }
        const result = await tryRead(endpoint, existing.endpointId, {
          token: g.token,
        }, { teamId: g.teamId, slug: g.slug }) as ResourceData | null;
        if (result) {
          const handle = await context.writeResource(
            "state",
            instanceName,
            result,
          );
          return { dataHandles: [handle] };
        }
        const handle = await context.writeResource("state", instanceName, {
          id: existing.endpointId,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
