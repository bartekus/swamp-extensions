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

// Auto-generated extension model for @swamp/vercel/teams/members
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Members.
 *
 * Wraps the Vercel API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, listAll, remove, update } from "./_lib/vercel.ts";

const GlobalArgsSchema = z.object({
  teamId: z.string().optional().describe("Vercel team ID"),
  slug: z.string().optional().describe(
    "Vercel team slug (alternative to teamId)",
  ),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  confirmed: z.boolean().describe(
    "Accept a user who requested access to the team.",
  ).optional(),
  role: z.enum([
    "OWNER",
    "MEMBER",
    "DEVELOPER",
    "SECURITY",
    "BILLING",
    "VIEWER",
    "VIEWER_FOR_PLUS",
    "CONTRIBUTOR",
  ]).describe("The role of the user to invite").optional(),
  teamPermissions: z.array(
    z.enum([
      "ConnectorManager",
      "IntegrationManager",
      "CreateProject",
      "FullProductionDeployment",
      "UsageViewer",
      "EnvVariableManager",
      "EnvironmentManager",
      "WorkflowDecryptor",
      "OrgAdmin",
      "OrgViewer",
      "AiGatewaySettings",
      "AiGatewayCredits",
      "AiGatewayApiKeyOwnedBySelf",
      "AiGatewayBudgetManager",
      "AiGatewayTranscriptsManager",
      "AiGatewayTranscriptsViewer",
      "V0Builder",
      "V0Chatter",
      "V0Viewer",
    ]),
  ).describe(
    "The team permissions to set for the member. Permissions must be compatible with the team roles assigned to the member.",
  ).optional(),
  projects: z.array(z.object({
    projectId: z.string().max(64),
    role: z.enum([
      "ADMIN",
      "PROJECT_VIEWER",
      "PROJECT_DEVELOPER",
      "PROJECT_GUEST",
    ]),
  })).optional(),
  joinedFrom: z.object({
    ssoUserId: z.string().optional(),
  }).optional(),
  email: z.string().describe("The email address of the user to invite"),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  email: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  teamPermissions: z.array(z.string()).nullable().optional(),
  teamRoles: z.array(z.string()).nullable().optional(),
  uid: z.string(),
  username: z.string().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().optional(),
  confirmed: z.boolean().optional(),
  role: z.enum([
    "OWNER",
    "MEMBER",
    "DEVELOPER",
    "SECURITY",
    "BILLING",
    "VIEWER",
    "VIEWER_FOR_PLUS",
    "CONTRIBUTOR",
  ]).optional(),
  teamPermissions: z.array(
    z.enum([
      "ConnectorManager",
      "IntegrationManager",
      "CreateProject",
      "FullProductionDeployment",
      "UsageViewer",
      "EnvVariableManager",
      "EnvironmentManager",
      "WorkflowDecryptor",
      "OrgAdmin",
      "OrgViewer",
      "AiGatewaySettings",
      "AiGatewayCredits",
      "AiGatewayApiKeyOwnedBySelf",
      "AiGatewayBudgetManager",
      "AiGatewayTranscriptsManager",
      "AiGatewayTranscriptsViewer",
      "V0Builder",
      "V0Chatter",
      "V0Viewer",
    ]),
  ).optional(),
  projects: z.array(z.object({
    projectId: z.string().max(64),
    role: z.enum([
      "ADMIN",
      "PROJECT_VIEWER",
      "PROJECT_DEVELOPER",
      "PROJECT_GUEST",
    ]),
  })).optional(),
  joinedFrom: z.object({
    ssoUserId: z.string().optional(),
  }).optional(),
  email: z.string().optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Members. Registered at `@swamp/vercel/teams/members`. */
export const model = {
  type: "@swamp/vercel/teams/members",
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
      toVersion: "2026.08.02.5",
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
      toVersion: "2026.08.03.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.05.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.13.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.31.1",
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
      description: "Members resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Members",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/teams/" + encodeURIComponent(g.teamId) +
          "/members";
        const body: Record<string, unknown> = {};
        if (g.email !== undefined) body.email = g.email;
        if (g.role !== undefined) body.role = g.role;
        if (g.projects !== undefined) body.projects = g.projects;
        const raw = await create(
          endpoint,
          [body] as unknown as Record<string, unknown>,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        );
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
    lookup: {
      description:
        "Look up an existing Members by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v3/teams/" + encodeURIComponent(g.teamId) +
          "/members";
        const filters: [string, string][] = [];
        if (g.confirmed !== undefined) {
          filters.push(["confirmed", String(g.confirmed)]);
        }
        if (g.role !== undefined) filters.push(["role", String(g.role)]);
        if (g.email !== undefined) filters.push(["email", String(g.email)]);
        if (g.uid !== undefined) filters.push(["uid", String(g.uid)]);
        if (g.username !== undefined) {
          filters.push(["username", String(g.username)]);
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
          "until",
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
          throw new Error(`No members found matching filters: ${filterDesc}`);
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
          (g.name?.toString() ?? result.uid?.toString() ?? "current").replace(
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
      description: "Update Members attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Members by uid (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/teams/" + encodeURIComponent(g.teamId) +
          "/members";
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
        if (g.confirmed !== undefined) body.confirmed = g.confirmed;
        if (g.role !== undefined) body.role = g.role;
        if (g.teamPermissions !== undefined) {
          body.teamPermissions = g.teamPermissions;
        }
        if (g.projects !== undefined) body.projects = g.projects;
        if (g.joinedFrom !== undefined) body.joinedFrom = g.joinedFrom;
        const result = await update(endpoint, existing.uid, body, "PATCH", {
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
      description: "Delete the Members",
      arguments: z.object({ id: z.string().describe("The ID of the Members") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/teams/" + encodeURIComponent(g.teamId) +
          "/members";
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
  },
};
