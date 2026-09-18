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

// Auto-generated extension model for @swamp/aws/codebuild/fleet
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for CodeBuild Fleet (AWS::CodeBuild::Fleet).
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

const FleetProxyRuleSchema = z.object({
  Type: z.enum(["DOMAIN", "IP"]).optional(),
  Effect: z.enum(["ALLOW", "DENY"]).optional(),
  Entities: z.array(z.string()).optional(),
});

const TagSchema = z.object({
  Key: z.string().min(1).max(128).regex(
    new RegExp("^(?!aws:)[a-zA-Z+-=._:/]+$"),
  ).describe(
    "The key name of the tag. You can specify a value that is 1 to 127 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ),
  Value: z.string().min(0).max(256).regex(new RegExp("[a-zA-Z+-=._:/]+$"))
    .describe(
      "The value for the tag. You can specify a value that is 0 to 255 Unicode characters in length. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
    ),
});

const TargetTrackingScalingConfigurationSchema = z.object({
  MetricType: z.enum(["FLEET_UTILIZATION_RATE"]).optional(),
  TargetValue: z.number().optional(),
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
  Name: z.string().min(2).max(128).optional(),
  BaseCapacity: z.number().int().min(0).optional(),
  EnvironmentType: z.enum([
    "WINDOWS_SERVER_2019_CONTAINER",
    "WINDOWS_SERVER_2022_CONTAINER",
    "LINUX_CONTAINER",
    "LINUX_GPU_CONTAINER",
    "ARM_CONTAINER",
    "MAC_ARM",
    "LINUX_EC2",
    "ARM_EC2",
    "WINDOWS_EC2",
  ]).optional(),
  ComputeType: z.enum([
    "BUILD_GENERAL1_SMALL",
    "BUILD_GENERAL1_MEDIUM",
    "BUILD_GENERAL1_LARGE",
    "BUILD_GENERAL1_XLARGE",
    "BUILD_GENERAL1_2XLARGE",
    "ATTRIBUTE_BASED_COMPUTE",
    "CUSTOM_INSTANCE_TYPE",
  ]).optional(),
  OverflowBehavior: z.enum(["QUEUE", "ON_DEMAND"]).optional(),
  FleetServiceRole: z.string().regex(new RegExp("^(?:arn:)[a-zA-Z+-=,._:/@]+$"))
    .optional(),
  FleetVpcConfig: z.object({
    VpcId: z.string().optional(),
    Subnets: z.array(z.string()).optional(),
    SecurityGroupIds: z.array(z.string()).optional(),
  }).optional(),
  FleetProxyConfiguration: z.object({
    DefaultBehavior: z.enum(["ALLOW_ALL", "DENY_ALL"]).optional(),
    OrderedProxyRules: z.array(FleetProxyRuleSchema).optional(),
  }).optional(),
  Tags: z.array(TagSchema).optional(),
  ImageId: z.string().regex(
    new RegExp(
      "^((aws/codebuild/([A-Za-z0-9._-]+|ami/[A-Za-z0-9._-]+):[A-Za-z0-9._-]+)|ami-[a-z0-9]{1,1020})$",
    ),
  ).optional(),
  ScalingConfiguration: z.object({
    MaxCapacity: z.number().int().min(1).optional(),
    ScalingType: z.enum(["TARGET_TRACKING_SCALING"]).optional(),
    TargetTrackingScalingConfigs: z.array(
      TargetTrackingScalingConfigurationSchema,
    ).optional(),
  }).optional(),
  ComputeConfiguration: z.object({
    vCpu: z.number().int().optional(),
    memory: z.number().int().optional(),
    disk: z.number().int().optional(),
    machineType: z.enum(["GENERAL", "NVME"]).optional(),
    instanceType: z.string().optional(),
  }).optional(),
});

const StateSchema = z.object({
  Name: z.string().optional(),
  BaseCapacity: z.number().optional(),
  EnvironmentType: z.string().optional(),
  ComputeType: z.string().optional(),
  OverflowBehavior: z.string().optional(),
  FleetServiceRole: z.string().optional(),
  FleetVpcConfig: z.object({
    VpcId: z.string(),
    Subnets: z.array(z.string()),
    SecurityGroupIds: z.array(z.string()),
  }).optional(),
  FleetProxyConfiguration: z.object({
    DefaultBehavior: z.string(),
    OrderedProxyRules: z.array(FleetProxyRuleSchema),
  }).optional(),
  Tags: z.array(TagSchema).optional(),
  Arn: z.string(),
  ImageId: z.string().optional(),
  ScalingConfiguration: z.object({
    MaxCapacity: z.number(),
    ScalingType: z.string(),
    TargetTrackingScalingConfigs: z.array(
      TargetTrackingScalingConfigurationSchema,
    ),
  }).optional(),
  ComputeConfiguration: z.object({
    vCpu: z.number(),
    memory: z.number(),
    disk: z.number(),
    machineType: z.string(),
    instanceType: z.string(),
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  Name: z.string().min(2).max(128).optional(),
  BaseCapacity: z.number().int().min(0).optional(),
  EnvironmentType: z.enum([
    "WINDOWS_SERVER_2019_CONTAINER",
    "WINDOWS_SERVER_2022_CONTAINER",
    "LINUX_CONTAINER",
    "LINUX_GPU_CONTAINER",
    "ARM_CONTAINER",
    "MAC_ARM",
    "LINUX_EC2",
    "ARM_EC2",
    "WINDOWS_EC2",
  ]).optional(),
  ComputeType: z.enum([
    "BUILD_GENERAL1_SMALL",
    "BUILD_GENERAL1_MEDIUM",
    "BUILD_GENERAL1_LARGE",
    "BUILD_GENERAL1_XLARGE",
    "BUILD_GENERAL1_2XLARGE",
    "ATTRIBUTE_BASED_COMPUTE",
    "CUSTOM_INSTANCE_TYPE",
  ]).optional(),
  OverflowBehavior: z.enum(["QUEUE", "ON_DEMAND"]).optional(),
  FleetServiceRole: z.string().regex(new RegExp("^(?:arn:)[a-zA-Z+-=,._:/@]+$"))
    .optional(),
  FleetVpcConfig: z.object({
    VpcId: z.string().optional(),
    Subnets: z.array(z.string()).optional(),
    SecurityGroupIds: z.array(z.string()).optional(),
  }).optional(),
  FleetProxyConfiguration: z.object({
    DefaultBehavior: z.enum(["ALLOW_ALL", "DENY_ALL"]).optional(),
    OrderedProxyRules: z.array(FleetProxyRuleSchema).optional(),
  }).optional(),
  Tags: z.array(TagSchema).optional(),
  ImageId: z.string().regex(
    new RegExp(
      "^((aws/codebuild/([A-Za-z0-9._-]+|ami/[A-Za-z0-9._-]+):[A-Za-z0-9._-]+)|ami-[a-z0-9]{1,1020})$",
    ),
  ).optional(),
  ScalingConfiguration: z.object({
    MaxCapacity: z.number().int().min(1).optional(),
    ScalingType: z.enum(["TARGET_TRACKING_SCALING"]).optional(),
    TargetTrackingScalingConfigs: z.array(
      TargetTrackingScalingConfigurationSchema,
    ).optional(),
  }).optional(),
  ComputeConfiguration: z.object({
    vCpu: z.number().int().optional(),
    memory: z.number().int().optional(),
    disk: z.number().int().optional(),
    machineType: z.enum(["GENERAL", "NVME"]).optional(),
    instanceType: z.string().optional(),
  }).optional(),
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

/** Swamp extension model for CodeBuild Fleet. Registered at `@swamp/aws/codebuild/fleet`. */
export const model = {
  type: "@swamp/aws/codebuild/fleet",
  version: "2026.09.18.1",
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
      toVersion: "2026.09.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "CodeBuild Fleet resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a CodeBuild Fleet",
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
          "AWS::CodeBuild::Fleet",
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
      description: "Get a CodeBuild Fleet",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the CodeBuild Fleet",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::CodeBuild::Fleet",
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
      description: "Update a CodeBuild Fleet",
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
          "AWS::CodeBuild::Fleet",
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
          "AWS::CodeBuild::Fleet",
          identifier,
          currentState,
          desiredState,
          ["Name"],
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
      description: "Delete a CodeBuild Fleet",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the CodeBuild Fleet",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::CodeBuild::Fleet",
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
      description: "Sync CodeBuild Fleet state from AWS",
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
            "AWS::CodeBuild::Fleet",
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
      description: "List CodeBuild Fleet resources",
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
          "AWS::CodeBuild::Fleet",
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
