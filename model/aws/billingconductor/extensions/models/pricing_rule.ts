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

// Auto-generated extension model for @swamp/aws/billingconductor/pricing-rule
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for BillingConductor PricingRule (AWS::BillingConductor::PricingRule).
 *
 * Wraps the CloudFormation resource type as a swamp model so create,
 * get, update, delete, sync, and list can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  deleteResource,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/aws.ts";
import type { AwsCredentials } from "./_lib/aws.ts";

const FreeTierSchema = z.object({
  Activated: z.boolean(),
});

const CustomTierSchema = z.object({
  BeginRangeInclusive: z.number().min(0).describe(
    "The inclusive beginning of the tier's usage range.",
  ),
  EndRangeExclusive: z.number().min(0).describe(
    "The exclusive end of the tier's usage range. Omit for the last tier (infinity).",
  ).optional(),
  RateValue: z.number().min(0).describe(
    "The custom rate applied to usage within the tier's range.",
  ),
});

const TagSchema = z.object({
  Key: z.string().min(1).max(128),
  Value: z.string().min(1).max(256),
});

const GlobalArgsSchema = z.object({
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  accessKeyId: z.string().meta({ sensitive: true }).describe(
    "AWS access key ID; overrides AWS_ACCESS_KEY_ID environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).describe(
    "AWS secret access key; overrides AWS_SECRET_ACCESS_KEY environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  sessionToken: z.string().meta({ sensitive: true }).describe(
    "AWS session token for temporary credentials; overrides AWS_SESSION_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  region: z.string().describe(
    "AWS region; overrides AWS_REGION / AWS_DEFAULT_REGION environment variables and ~/.aws/config profile region. Defaults to us-east-1.",
  ).optional(),
  Name: z.string().min(1).max(128).regex(new RegExp("[a-zA-Z0-9_\\+=\\.\\-@]+"))
    .describe("Pricing rule name"),
  Description: z.string().max(1024).describe("Pricing rule description")
    .optional(),
  Scope: z.enum(["GLOBAL", "SERVICE", "BILLING_ENTITY", "SKU"]).describe(
    "A term used to categorize the granularity of a Pricing Rule.",
  ),
  Type: z.enum(["MARKUP", "DISCOUNT", "TIERING"]).describe(
    "One of MARKUP, DISCOUNT or TIERING that describes the behaviour of the pricing rule.",
  ),
  ModifierPercentage: z.number().min(0).describe(
    "Pricing rule modifier percentage",
  ).optional(),
  Service: z.string().min(1).max(128).regex(new RegExp("[a-zA-Z0-9\\.\\-]+"))
    .describe("The service which a pricing rule is applied on").optional(),
  BillingEntity: z.enum(["AWS", "AWS Marketplace", "AISPL"]).describe(
    "The seller of services provided by AWS, their affiliates, or third-party providers selling services via AWS Marketplaces. Supported billing entities are AWS, AWS Marketplace, and AISPL.",
  ).optional(),
  Tiering: z.object({
    FreeTier: FreeTierSchema.describe(
      "The possible customizable free tier configurations.",
    ).optional(),
    CustomTiers: z.array(CustomTierSchema).describe(
      "The set of custom volume tiers for a SKU-scoped TIERING pricing rule. Tiers must start at 0, be contiguous, and the last tier must have no end range.",
    ).optional(),
  }).describe("The set of tiering configurations for the pricing rule.")
    .optional(),
  UsageType: z.string().min(1).max(256).regex(new RegExp("^\\S+$")).describe(
    "The UsageType which a SKU pricing rule is modifying",
  ).optional(),
  Operation: z.string().min(1).max(256).regex(new RegExp("^\\S+$")).describe(
    "The Operation which a SKU pricing rule is modifying",
  ).optional(),
  Tags: z.array(TagSchema).optional(),
});

const StateSchema = z.object({
  Arn: z.string(),
  Name: z.string().optional(),
  Description: z.string().optional(),
  Scope: z.string().optional(),
  Type: z.string().optional(),
  ModifierPercentage: z.number().optional(),
  Service: z.string().optional(),
  BillingEntity: z.string().optional(),
  Tiering: z.object({
    FreeTier: FreeTierSchema,
    CustomTiers: z.array(CustomTierSchema),
  }).optional(),
  UsageType: z.string().optional(),
  Operation: z.string().optional(),
  AssociatedPricingPlanCount: z.number().optional(),
  CreationTime: z.number().optional(),
  LastModifiedTime: z.number().optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  Name: z.string().min(1).max(128).regex(new RegExp("[a-zA-Z0-9_\\+=\\.\\-@]+"))
    .describe("Pricing rule name").optional(),
  Description: z.string().max(1024).describe("Pricing rule description")
    .optional(),
  Scope: z.enum(["GLOBAL", "SERVICE", "BILLING_ENTITY", "SKU"]).describe(
    "A term used to categorize the granularity of a Pricing Rule.",
  ).optional(),
  Type: z.enum(["MARKUP", "DISCOUNT", "TIERING"]).describe(
    "One of MARKUP, DISCOUNT or TIERING that describes the behaviour of the pricing rule.",
  ).optional(),
  ModifierPercentage: z.number().min(0).describe(
    "Pricing rule modifier percentage",
  ).optional(),
  Service: z.string().min(1).max(128).regex(new RegExp("[a-zA-Z0-9\\.\\-]+"))
    .describe("The service which a pricing rule is applied on").optional(),
  BillingEntity: z.enum(["AWS", "AWS Marketplace", "AISPL"]).describe(
    "The seller of services provided by AWS, their affiliates, or third-party providers selling services via AWS Marketplaces. Supported billing entities are AWS, AWS Marketplace, and AISPL.",
  ).optional(),
  Tiering: z.object({
    FreeTier: FreeTierSchema.describe(
      "The possible customizable free tier configurations.",
    ).optional(),
    CustomTiers: z.array(CustomTierSchema).describe(
      "The set of custom volume tiers for a SKU-scoped TIERING pricing rule. Tiers must start at 0, be contiguous, and the last tier must have no end range.",
    ).optional(),
  }).describe("The set of tiering configurations for the pricing rule.")
    .optional(),
  UsageType: z.string().min(1).max(256).regex(new RegExp("^\\S+$")).describe(
    "The UsageType which a SKU pricing rule is modifying",
  ).optional(),
  Operation: z.string().min(1).max(256).regex(new RegExp("^\\S+$")).describe(
    "The Operation which a SKU pricing rule is modifying",
  ).optional(),
  Tags: z.array(TagSchema).optional(),
});

const _credentialKeys = new Set([
  "accessKeyId",
  "secretAccessKey",
  "sessionToken",
  "region",
]);

function _buildCredentials(g: Record<string, unknown>): AwsCredentials {
  return {
    accessKeyId: g.accessKeyId as string | undefined,
    secretAccessKey: g.secretAccessKey as string | undefined,
    sessionToken: g.sessionToken as string | undefined,
    region: g.region as string | undefined,
  };
}

/** Swamp extension model for BillingConductor PricingRule. Registered at `@swamp/aws/billingconductor/pricing-rule`. */
export const model = {
  type: "@swamp/aws/billingconductor/pricing-rule",
  version: "2026.09.15.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
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
      toVersion: "2026.06.06.1",
      description: "Added: accessKeyId, secretAccessKey, sessionToken, region",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "BillingConductor PricingRule resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a BillingConductor PricingRule",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const desiredState: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(g)) {
          if (key === "name") continue;
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await createResource(
          "AWS::BillingConductor::PricingRule",
          desiredState,
          credentials,
        ) as StateData;
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
      description: "Get a BillingConductor PricingRule",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the BillingConductor PricingRule",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::BillingConductor::PricingRule",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName =
          (context.globalArgs.name?.toString() ?? args.identifier).replace(
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
      description: "Update a BillingConductor PricingRule",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
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
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.Arn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::BillingConductor::PricingRule",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (key === "name") continue;
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::BillingConductor::PricingRule",
          identifier,
          currentState,
          desiredState,
          ["Scope", "Service", "BillingEntity", "UsageType", "Operation"],
          credentials,
        );
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete a BillingConductor PricingRule",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the BillingConductor PricingRule",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::BillingConductor::PricingRule",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.name?.toString() ?? args.identifier).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource("state", instanceName, {
          identifier: args.identifier,
          existed,
          status: existed ? "deleted" : "not_found",
          deletedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
    sync: {
      description: "Sync BillingConductor PricingRule state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
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
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.Arn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::BillingConductor::PricingRule",
            identifier,
            credentials,
          ) as StateData;
          const handle = await context.writeResource(
            "state",
            instanceName,
            result,
          );
          return { dataHandles: [handle] };
        } catch (error: unknown) {
          if (isResourceNotFoundError(error)) {
            const handle = await context.writeResource("state", instanceName, {
              identifier,
              status: "not_found",
              syncedAt: new Date().toISOString(),
            });
            return { dataHandles: [handle] };
          }
          throw error;
        }
      },
    },
    list: {
      description: "List BillingConductor PricingRule resources",
      arguments: z.object({
        maxPages: z.number().describe(
          "Maximum number of pages to fetch (default: 10)",
        ).optional(),
        resourceModel: z.string().describe(
          "JSON resource model for parent-scoped listing (e.g. parent identifier)",
        ).optional(),
      }),
      execute: async (
        args: { maxPages?: number; resourceModel?: string },
        context: any,
      ) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { items, nextToken } = await listResources(
          "AWS::BillingConductor::PricingRule",
          {
            resourceModel: args.resourceModel,
            maxPages: args.maxPages,
            credentials,
          },
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const instanceName =
            (item.properties?.Arn?.toString() ?? item.identifier).replace(
              /[\/\\]/g,
              "_",
            ).replace(/\.\./g, "_").replace(/\0/g, "");
          const handle = await context.writeResource("state", instanceName, {
            ...item.properties,
            _identifier: item.identifier,
          });
          dataHandles.push(handle);
        }
        return {
          dataHandles,
          result: { count: items.length, nextPageToken: nextToken },
        };
      },
    },
  },
};
