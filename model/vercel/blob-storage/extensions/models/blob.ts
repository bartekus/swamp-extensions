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

// Auto-generated extension model for @swamp/vercel/blob-storage/blob
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Blob.
 *
 * Wraps the Vercel API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, read, remove, tryRead } from "./_lib/vercel.ts";

const GlobalArgsSchema = z.object({
  teamId: z.string().optional().describe("Vercel team ID"),
  slug: z.string().optional().describe(
    "Vercel team slug (alternative to teamId)",
  ),
  name: z.string().max(70),
  region: z.enum([
    "arn1",
    "bom1",
    "cdg1",
    "cle1",
    "cpt1",
    "dub1",
    "dxb1",
    "fra1",
    "gru1",
    "hkg1",
    "hnd1",
    "iad1",
    "icn1",
    "kix1",
    "lhr1",
    "pdx1",
    "sfo1",
    "sin1",
    "syd1",
    "yul1",
  ]).optional(),
  access: z.enum(["public", "private"]).optional(),
  projectId: z.string().max(50).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  store: z.object({
    projectFilter: z.object({
      git: z.object({
        owners: z.array(z.string()).optional(),
        providers: z.array(z.string()).optional(),
        repos: z.array(z.string()).optional(),
      }).optional(),
    }).optional(),
    projectsMetadata: z.array(z.object({
      deployments: z.object({
        actions: z.array(z.object({
          environments: z.array(z.string()).optional(),
          slug: z.string().optional(),
        })).optional(),
        required: z.boolean().optional(),
      }).optional(),
      environments: z.array(z.string()).optional(),
      environmentVariables: z.array(z.string()).optional(),
      envVarPrefix: z.string().optional(),
      framework: z.string().optional(),
      id: z.string().optional(),
      latestDeployment: z.string().optional(),
      makeEnvVarsSensitive: z.boolean().optional(),
      name: z.string().optional(),
      projectId: z.string().optional(),
    })).optional(),
    status: z.string().optional(),
    totalConnectedProjects: z.number().optional(),
    usageQuotaExceeded: z.boolean().optional(),
  }).nullable().optional(),
  id: z.string(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().max(70).optional(),
  region: z.enum([
    "arn1",
    "bom1",
    "cdg1",
    "cle1",
    "cpt1",
    "dub1",
    "dxb1",
    "fra1",
    "gru1",
    "hkg1",
    "hnd1",
    "iad1",
    "icn1",
    "kix1",
    "lhr1",
    "pdx1",
    "sfo1",
    "sin1",
    "syd1",
    "yul1",
  ]).optional(),
  access: z.enum(["public", "private"]).optional(),
  projectId: z.string().max(50).optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

function unwrapResponse(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const inner = data["store"];
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return data;
}

/** Swamp extension model for Vercel Blob. Registered at `@swamp/vercel/blob-storage/blob`. */
export const model = {
  type: "@swamp/vercel/blob-storage/blob",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.08.02.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.2",
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
      description: "Blob resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Blob",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/storage/stores/blob";
        const body: Record<string, unknown> = {};
        if (g.name !== undefined) body.name = g.name;
        if (g.region !== undefined) body.region = g.region;
        if (g.access !== undefined) body.access = g.access;
        if (g.projectId !== undefined) body.projectId = g.projectId;
        const raw = await create(endpoint, body, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        });
        const result =
          (raw as Record<string, unknown>)["store"] as ResourceData;
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
      description: "Get a Blob",
      arguments: z.object({ id: z.string().describe("The ID of the Blob") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/storage/stores";
        const rawResult = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const result = unwrapResponse(
          rawResult as Record<string, unknown>,
        ) as ResourceData;
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
    adopt: {
      description: "Import an existing Blob by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Blob to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/storage/stores";
        const rawResult = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const result = unwrapResponse(
          rawResult as Record<string, unknown>,
        ) as ResourceData;
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
    delete: {
      description: "Delete the Blob",
      arguments: z.object({ id: z.string().describe("The ID of the Blob") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/storage/stores/blob";
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
      description: "Sync Blob state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Blob by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/storage/stores";
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
        const rawSyncResult = await tryRead(endpoint, existing.id, {
          token: g.token,
        }, { teamId: g.teamId, slug: g.slug }) as ResourceData | null;
        const result = rawSyncResult
          ? unwrapResponse(
            rawSyncResult as Record<string, unknown>,
          ) as ResourceData
          : null;
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
