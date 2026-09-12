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

// Auto-generated extension model for @swamp/aws/connect/metric
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Connect Metric (AWS::Connect::Metric).
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

const MetricFilterNumberConditionSchema = z.object({
  Comparison: z.enum([
    "LESSER",
    "LESSER_OR_EQUAL",
    "GREATER",
    "GREATER_OR_EQUAL",
  ]),
  Values: z.array(z.number()),
});

const MetricFilterStringConditionSchema = z.object({
  Comparison: z.enum(["MATCHES_ANY", "MATCHES_NONE"]),
  Values: z.array(z.string()),
});

const MetricFilterBooleanConditionSchema = z.object({
  Comparison: z.enum(["IS_TRUE", "IS_FALSE"]),
});

const MetricFilterSchema = z.object({
  MetricFilterKey: z.string(),
  Negate: z.boolean().optional(),
  NumberCondition: MetricFilterNumberConditionSchema.optional(),
  StringCondition: MetricFilterStringConditionSchema.optional(),
  BooleanCondition: MetricFilterBooleanConditionSchema.optional(),
});

const CalculationComponentSchema = z.object({
  Alias: z.string().min(1).max(128).regex(new RegExp("[a-zA-Z_][a-zA-Z0-9_]*"))
    .describe(
      "Metric calculation component alias for use within a calculation",
    ),
  MetricName: z.string().min(1).optional(),
  MetricId: z.string().min(1).optional(),
  MetricFilters: z.array(MetricFilterSchema).optional(),
});

const TagSchema = z.object({
  Key: z.string().min(1).max(128).regex(
    new RegExp("^(?!aws:)[a-zA-Z+-=._:/]+$"),
  ).describe(
    "The key name of the tag. You can specify a value that is 1 to 128 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ),
  Value: z.string().max(256).describe(
    "The value for the tag. You can specify a value that is maximum of 256 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ),
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
  InstanceArn: z.string().regex(
    new RegExp(
      "^arn:aws[-a-z0-9]*:connect:[-a-z0-9]*:[0-9]{12}:instance/[-a-zA-Z0-9]*$",
    ),
  ).describe("The identifier of the Amazon Connect instance."),
  Name: z.string().min(1).max(128).describe("The name of the custom metric"),
  Description: z.string().min(0).max(500).describe(
    "The description of the custom metric",
  ).optional(),
  MetricCalculation: z.object({
    CalculationComponents: z.array(CalculationComponentSchema).describe(
      "The calculation components for the metric",
    ),
    Calculation: z.string().min(1).max(1024).describe(
      "The calculation formula",
    ),
  }).describe("The calculation configuration for the metric"),
  Status: z.enum(["SAVED", "PUBLISHED"]).describe(
    "The status of the custom metric",
  ),
  Unit: z.enum(["INTEGER", "DOUBLE", "PERCENT", "SECONDS"]).describe(
    "Display unit for the metric data",
  ),
  PositiveTrendIndicator: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]).describe(
    "Indicates how to classify a positive trend in metric data on the UI",
  ).optional(),
  Tags: z.array(TagSchema).describe("One or more tags.").optional(),
});

const StateSchema = z.object({
  InstanceArn: z.string().optional(),
  MetricArn: z.string(),
  Name: z.string().optional(),
  Description: z.string().optional(),
  MetricCalculation: z.object({
    CalculationComponents: z.array(CalculationComponentSchema),
    Calculation: z.string(),
  }).optional(),
  CreationMethod: z.string().optional(),
  Status: z.string().optional(),
  Unit: z.string().optional(),
  PositiveTrendIndicator: z.string().optional(),
  Groupings: z.array(z.string()).optional(),
  Filters: z.array(z.object({
    Id: z.string(),
    Type: z.string(),
  })).optional(),
  EffectiveTime: z.number().optional(),
  RefreshRate: z.number().optional(),
  Category: z.string().optional(),
  Type: z.string().optional(),
  SupportedStats: z.array(z.string()).optional(),
  SupportsPreaggregateCalculation: z.boolean().optional(),
  SupportsCustomCalculation: z.boolean().optional(),
  PrimaryEventSource: z.string().optional(),
  PrimaryEventSourceEffectiveTimestampType: z.string().optional(),
  CreatedTime: z.number().optional(),
  CreatedUser: z.record(z.string(), z.unknown()).optional(),
  LastModifiedRegion: z.string().optional(),
  LastModifiedTime: z.number().optional(),
  LastModifiedUser: z.record(z.string(), z.unknown()).optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  InstanceArn: z.string().regex(
    new RegExp(
      "^arn:aws[-a-z0-9]*:connect:[-a-z0-9]*:[0-9]{12}:instance/[-a-zA-Z0-9]*$",
    ),
  ).describe("The identifier of the Amazon Connect instance.").optional(),
  Name: z.string().min(1).max(128).describe("The name of the custom metric")
    .optional(),
  Description: z.string().min(0).max(500).describe(
    "The description of the custom metric",
  ).optional(),
  MetricCalculation: z.object({
    CalculationComponents: z.array(CalculationComponentSchema).describe(
      "The calculation components for the metric",
    ).optional(),
    Calculation: z.string().min(1).max(1024).describe("The calculation formula")
      .optional(),
  }).describe("The calculation configuration for the metric").optional(),
  Status: z.enum(["SAVED", "PUBLISHED"]).describe(
    "The status of the custom metric",
  ).optional(),
  Unit: z.enum(["INTEGER", "DOUBLE", "PERCENT", "SECONDS"]).describe(
    "Display unit for the metric data",
  ).optional(),
  PositiveTrendIndicator: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]).describe(
    "Indicates how to classify a positive trend in metric data on the UI",
  ).optional(),
  Tags: z.array(TagSchema).describe("One or more tags.").optional(),
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

/** Swamp extension model for Connect Metric. Registered at `@swamp/aws/connect/metric`. */
export const model = {
  type: "@swamp/aws/connect/metric",
  version: "2026.09.12.1",
  upgrades: [
    {
      toVersion: "2026.09.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Connect Metric resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Connect Metric",
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
          "AWS::Connect::Metric",
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
      description: "Get a Connect Metric",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Connect Metric",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Connect::Metric",
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
      description: "Update a Connect Metric",
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
        const identifier = existing.MetricArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::Connect::Metric",
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
          "AWS::Connect::Metric",
          identifier,
          currentState,
          desiredState,
          ["InstanceArn", "Status"],
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
      description: "Delete a Connect Metric",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Connect Metric",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Connect::Metric",
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
      description: "Sync Connect Metric state from AWS",
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
        const identifier = existing.MetricArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::Connect::Metric",
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
      description: "List Connect Metric resources",
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
          "AWS::Connect::Metric",
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
            (item.properties?.MetricArn?.toString() ?? item.identifier).replace(
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
