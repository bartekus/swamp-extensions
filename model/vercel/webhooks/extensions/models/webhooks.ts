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

// Auto-generated extension model for @swamp/vercel/webhooks/webhooks
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Webhooks.
 *
 * Wraps the Vercel API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, listAll, read, remove, tryRead } from "./_lib/vercel.ts";

const GlobalArgsSchema = z.object({
  teamId: z.string().optional().describe("Vercel team ID"),
  slug: z.string().optional().describe(
    "Vercel team slug (alternative to teamId)",
  ),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  url: z.string().regex(new RegExp("^https?://")),
  events: z.array(
    z.enum([
      "budget.reached",
      "domain.created",
      "domain.dns.records.changed",
      "domain.transfer-in.started",
      "domain.transfer-in.completed",
      "domain.transfer-in.failed",
      "domain.certificate.add",
      "domain.certificate.add.failed",
      "domain.certificate.renew",
      "domain.certificate.renew.failed",
      "domain.certificate.deleted",
      "domain.renewal",
      "domain.renewal.failed",
      "domain.auto-renew.changed",
      "deployment.created",
      "deployment.build-requested",
      "deployment.cleanup",
      "deployment.error",
      "deployment.blocked",
      "deployment.canceled",
      "deployment.succeeded",
      "deployment.ready",
      "deployment.check-rerequested",
      "deployment.promoted",
      "deployment.rollback",
      "deployment.integration.action.start",
      "deployment.integration.action.cancel",
      "deployment.integration.action.cleanup",
      "deployment.checkrun.start",
      "deployment.checkrun.cancel",
      "edge-config.created",
      "edge-config.deleted",
      "edge-config.items.updated",
      "firewall.attack",
      "firewall.system-rule-anomaly",
      "firewall.custom-rule-anomaly",
      "function.archival-required",
      "function.removal-required",
      "alerts.triggered",
      "integration-configuration.permission-upgraded",
      "integration-configuration.removed",
      "integration-configuration.scope-change-confirmed",
      "integration-configuration.transferred",
      "integration-resource.project-connected",
      "integration-resource.project-disconnected",
      "project.created",
      "project.removed",
      "project.renamed",
      "project.env-variable.created",
      "project.env-variable.updated",
      "project.env-variable.deleted",
      "project.domain.created",
      "project.domain.updated",
      "project.domain.deleted",
      "project.domain.verified",
      "project.domain.unverified",
      "project.domain.moved",
      "project.rolling-release.started",
      "project.rolling-release.aborted",
      "project.rolling-release.completed",
      "project.rolling-release.approved",
      "deployment.checks.failed",
      "deployment.checks.succeeded",
      "deployment-checks-completed",
      "deployment-ready",
      "deployment-prepared",
      "deployment-error",
      "deployment-check-rerequested",
      "deployment-canceled",
      "project-created",
      "project-removed",
      "domain-created",
      "deployment",
      "integration-configuration-permission-updated",
      "integration-configuration-removed",
      "integration-configuration-scope-change-confirmed",
      "marketplace.member.changed",
      "marketplace.invoice.created",
      "marketplace.invoice.paid",
      "marketplace.invoice.notpaid",
      "marketplace.invoice.overdue",
      "marketplace.invoice.refunded",
      "ai-gateway.balance-depleted",
      "ai-gateway.auto-reload.limit-reached",
      "observability.anomaly",
      "observability.anomaly-error",
      "observability.usage-anomaly",
      "observability.error-anomaly",
      "botid.anomaly",
      "flag.created",
      "flag.updated",
      "flag.deleted",
      "flag.segment.created",
      "flag.segment.updated",
      "flag.segment.deleted",
      "test-webhook",
      "message.created",
      "message.updated",
      "message.deleted",
      "thread.resolved",
      "thread.unresolved",
      "message.reaction-added",
      "message.reaction-removed",
      "message.mentioned",
      "comment.created",
      "comment.updated",
      "comment.deleted",
      "comment.resolved",
      "comment.unresolved",
      "comment.reaction-added",
      "comment.reaction-removed",
      "comment.mentioned",
    ]),
  ),
  projectIds: z.array(z.string().regex(new RegExp("^[a-zA-z0-9_]+$")))
    .optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  alertRuleIds: z.array(z.string()).nullable().optional(),
  createdAt: z.number().nullable().optional(),
  events: z.array(z.string()).nullable().optional(),
  id: z.string(),
  ownerId: z.string().nullable().optional(),
  projectIds: z.array(z.string()).nullable().optional(),
  updatedAt: z.number().nullable().optional(),
  url: z.string().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  name: z.string().optional(),
  url: z.string().regex(new RegExp("^https?://")).optional(),
  events: z.array(
    z.enum([
      "budget.reached",
      "domain.created",
      "domain.dns.records.changed",
      "domain.transfer-in.started",
      "domain.transfer-in.completed",
      "domain.transfer-in.failed",
      "domain.certificate.add",
      "domain.certificate.add.failed",
      "domain.certificate.renew",
      "domain.certificate.renew.failed",
      "domain.certificate.deleted",
      "domain.renewal",
      "domain.renewal.failed",
      "domain.auto-renew.changed",
      "deployment.created",
      "deployment.build-requested",
      "deployment.cleanup",
      "deployment.error",
      "deployment.blocked",
      "deployment.canceled",
      "deployment.succeeded",
      "deployment.ready",
      "deployment.check-rerequested",
      "deployment.promoted",
      "deployment.rollback",
      "deployment.integration.action.start",
      "deployment.integration.action.cancel",
      "deployment.integration.action.cleanup",
      "deployment.checkrun.start",
      "deployment.checkrun.cancel",
      "edge-config.created",
      "edge-config.deleted",
      "edge-config.items.updated",
      "firewall.attack",
      "firewall.system-rule-anomaly",
      "firewall.custom-rule-anomaly",
      "function.archival-required",
      "function.removal-required",
      "alerts.triggered",
      "integration-configuration.permission-upgraded",
      "integration-configuration.removed",
      "integration-configuration.scope-change-confirmed",
      "integration-configuration.transferred",
      "integration-resource.project-connected",
      "integration-resource.project-disconnected",
      "project.created",
      "project.removed",
      "project.renamed",
      "project.env-variable.created",
      "project.env-variable.updated",
      "project.env-variable.deleted",
      "project.domain.created",
      "project.domain.updated",
      "project.domain.deleted",
      "project.domain.verified",
      "project.domain.unverified",
      "project.domain.moved",
      "project.rolling-release.started",
      "project.rolling-release.aborted",
      "project.rolling-release.completed",
      "project.rolling-release.approved",
      "deployment.checks.failed",
      "deployment.checks.succeeded",
      "deployment-checks-completed",
      "deployment-ready",
      "deployment-prepared",
      "deployment-error",
      "deployment-check-rerequested",
      "deployment-canceled",
      "project-created",
      "project-removed",
      "domain-created",
      "deployment",
      "integration-configuration-permission-updated",
      "integration-configuration-removed",
      "integration-configuration-scope-change-confirmed",
      "marketplace.member.changed",
      "marketplace.invoice.created",
      "marketplace.invoice.paid",
      "marketplace.invoice.notpaid",
      "marketplace.invoice.overdue",
      "marketplace.invoice.refunded",
      "ai-gateway.balance-depleted",
      "ai-gateway.auto-reload.limit-reached",
      "observability.anomaly",
      "observability.anomaly-error",
      "observability.usage-anomaly",
      "observability.error-anomaly",
      "botid.anomaly",
      "flag.created",
      "flag.updated",
      "flag.deleted",
      "flag.segment.created",
      "flag.segment.updated",
      "flag.segment.deleted",
      "test-webhook",
      "message.created",
      "message.updated",
      "message.deleted",
      "thread.resolved",
      "thread.unresolved",
      "message.reaction-added",
      "message.reaction-removed",
      "message.mentioned",
      "comment.created",
      "comment.updated",
      "comment.deleted",
      "comment.resolved",
      "comment.unresolved",
      "comment.reaction-added",
      "comment.reaction-removed",
      "comment.mentioned",
    ]),
  ).optional(),
  projectIds: z.array(z.string().regex(new RegExp("^[a-zA-z0-9_]+$")))
    .optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Webhooks. Registered at `@swamp/vercel/webhooks/webhooks`. */
export const model = {
  type: "@swamp/vercel/webhooks/webhooks",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.08.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
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
      toVersion: "2026.08.18.1",
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
      description: "Webhooks resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Webhooks",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/webhooks";
        const body: Record<string, unknown> = {};
        if (g.url !== undefined) body.url = g.url;
        if (g.events !== undefined) body.events = g.events;
        if (g.projectIds !== undefined) body.projectIds = g.projectIds;
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
      description: "Get a Webhooks",
      arguments: z.object({
        id: z.string().describe("The ID of the Webhooks"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/webhooks";
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
        "Look up an existing Webhooks by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/webhooks";
        const filters: [string, string][] = [];
        if (g.url !== undefined) filters.push(["url", String(g.url)]);
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
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
          throw new Error(`No webhooks found matching filters: ${filterDesc}`);
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
        "Import an existing Webhooks by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Webhooks to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/webhooks";
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
    delete: {
      description: "Delete the Webhooks",
      arguments: z.object({
        id: z.string().describe("The ID of the Webhooks"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/webhooks";
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
      description: "Sync Webhooks state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Webhooks by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/webhooks";
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
