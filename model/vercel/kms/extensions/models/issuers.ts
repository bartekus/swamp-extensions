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

// Auto-generated extension model for @swamp/vercel/kms/issuers
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Issuers.
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
  name: z.string().describe("The name of the issuer."),
  claimsSchema: z.record(z.string(), z.unknown()).describe(
    "A JSON Schema used to validate the resolved token claims when signing tokens for this issuer.",
  ).optional(),
  algorithm: z.enum([
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES384",
    "ES512",
  ]).describe("The signing algorithm to use for the issuer.").optional(),
  policy: z.object({
    kind: z.enum(["project-grant"]),
    teamId: z.string(),
    projectId: z.string(),
    environments: z.array(
      z.string().regex(
        new RegExp("^(?:production|preview|development|env_.+)$"),
      ),
    ),
    tokenClaims: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  importKey: z.string().describe(
    "The PEM-encoded private key to use for the issuer.",
  ).optional(),
  importKeyId: z.string().max(128).regex(new RegExp("^[A-Za-z0-9._-]+$"))
    .describe(
      "The key id to use as the imported key's JWT/JWKS `kid`. Only allowed when `importKey` is provided. Not required to be unique; the addressable key id is the server-minted `keyId` returned in the response.",
    ).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  algorithm: z.string().nullable().optional(),
  claimsSchema: z.record(z.string(), z.unknown()).nullable().optional(),
  createdAt: z.string().nullable().optional(),
  id: z.string(),
  managedBy: z.string().nullable().optional(),
  name: z.string().nullable().optional(),
  origin: z.string().nullable().optional(),
  ownerId: z.string().nullable().optional(),
  policies: z.array(z.object({
    createdAt: z.string().optional(),
    environments: z.array(z.string()).optional(),
    kind: z.string().optional(),
    projectId: z.string().optional(),
    teamId: z.string().optional(),
    tokenClaims: z.record(z.string(), z.unknown()).optional(),
    updatedAt: z.string().optional(),
  })).nullable().optional(),
  signingKeys: z.array(z.object({
    activateAt: z.string().optional(),
    activatedAt: z.string().optional(),
    algorithm: z.string().optional(),
    certificatePem: z.string().optional(),
    createdAt: z.string().optional(),
    importKeyId: z.string().optional(),
    issuerId: z.string().optional(),
    keyId: z.string().optional(),
    publicKey: z.object({
      alg: z.string().optional(),
      key_ops: z.array(z.string()).optional(),
      kid: z.string().optional(),
      kty: z.string().optional(),
      use: z.string().optional(),
      x5c: z.array(z.string()).optional(),
      "x5t#S256": z.string().optional(),
    }).optional(),
    publicKeyFingerprint: z.string().optional(),
    publicKeyPem: z.string().optional(),
    revokeAt: z.string().optional(),
    status: z.string().optional(),
    updatedAt: z.string().optional(),
  })).nullable().optional(),
  updatedAt: z.string().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().optional(),
  claimsSchema: z.record(z.string(), z.unknown()).optional(),
  algorithm: z.enum([
    "RS256",
    "RS384",
    "RS512",
    "PS256",
    "PS384",
    "PS512",
    "ES256",
    "ES384",
    "ES512",
  ]).optional(),
  policy: z.object({
    kind: z.enum(["project-grant"]),
    teamId: z.string(),
    projectId: z.string(),
    environments: z.array(
      z.string().regex(
        new RegExp("^(?:production|preview|development|env_.+)$"),
      ),
    ),
    tokenClaims: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  importKey: z.string().optional(),
  importKeyId: z.string().max(128).regex(new RegExp("^[A-Za-z0-9._-]+$"))
    .optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Issuers. Registered at `@swamp/vercel/kms/issuers`. */
export const model = {
  type: "@swamp/vercel/kms/issuers",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.09.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Issuers resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Issuers",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/kms/issuers";
        const body: Record<string, unknown> = {};
        if (g.name !== undefined) body.name = g.name;
        if (g.algorithm !== undefined) body.algorithm = g.algorithm;
        if (g.claimsSchema !== undefined) body.claimsSchema = g.claimsSchema;
        if (g.policy !== undefined) body.policy = g.policy;
        if (g.importKey !== undefined) body.importKey = g.importKey;
        if (g.importKeyId !== undefined) body.importKeyId = g.importKeyId;
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
      description: "Get a Issuers",
      arguments: z.object({ id: z.string().describe("The ID of the Issuers") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/kms/issuers";
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
        "Look up an existing Issuers by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/kms/issuers";
        const filters: [string, string][] = [];
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.algorithm !== undefined) {
          filters.push(["algorithm", String(g.algorithm)]);
        }
        if (g.importKey !== undefined) {
          filters.push(["importKey", String(g.importKey)]);
        }
        if (g.importKeyId !== undefined) {
          filters.push(["importKeyId", String(g.importKeyId)]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.managedBy !== undefined) {
          filters.push(["managedBy", String(g.managedBy)]);
        }
        if (g.origin !== undefined) filters.push(["origin", String(g.origin)]);
        if (g.ownerId !== undefined) {
          filters.push(["ownerId", String(g.ownerId)]);
        }
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(
          endpoint,
          "cursor",
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
          undefined,
          "next",
        );
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
          throw new Error(`No issuers found matching filters: ${filterDesc}`);
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
      description: "Import an existing Issuers by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Issuers to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/kms/issuers";
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
      description: "Update Issuers attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Issuers by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/kms/issuers";
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
        if (g.claimsSchema !== undefined) body.claimsSchema = g.claimsSchema;
        const result = await update(endpoint, existing.id, body, "PATCH", {
          token: g.token,
        }, { teamId: g.teamId, slug: g.slug }) as ResourceData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the Issuers",
      arguments: z.object({ id: z.string().describe("The ID of the Issuers") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/kms/issuers";
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
      description: "Sync Issuers state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Issuers by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/kms/issuers";
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
        const result = await tryRead(
          endpoint,
          existing.id,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
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
          id: existing.id,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
