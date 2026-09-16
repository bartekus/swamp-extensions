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

// Auto-generated extension model for @swamp/aws/batch/compute-environment
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Batch ComputeEnvironment (AWS::Batch::ComputeEnvironment).
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

const Ec2ConfigurationObjectSchema = z.object({
  ImageIdOverride: z.string().optional(),
  ImageType: z.string(),
  ImageKubernetesVersion: z.string().optional(),
  BatchImageStatus: z.string().optional(),
});

const LaunchTemplateSpecificationOverrideSchema = z.object({
  LaunchTemplateId: z.string().optional(),
  LaunchTemplateName: z.string().optional(),
  Version: z.string().optional(),
  UserdataType: z.enum(["EKS_BOOTSTRAP_SH", "EKS_NODEADM"]).optional(),
  TargetInstanceTypes: z.array(z.string()).optional(),
});

const LaunchTemplateSpecificationSchema = z.object({
  LaunchTemplateId: z.string().optional(),
  LaunchTemplateName: z.string().optional(),
  Version: z.string().optional(),
  UserdataType: z.enum(["EKS_BOOTSTRAP_SH", "EKS_NODEADM"]).optional(),
  Overrides: z.array(LaunchTemplateSpecificationOverrideSchema).optional(),
});

const ComputeScalingPolicySchema = z.object({
  MinScaleDownDelayMinutes: z.number().int().optional(),
});

const ManagedInstancesNetworkConfigurationSchema = z.object({
  Subnets: z.array(z.string()),
  SecurityGroups: z.array(z.string()),
});

const InstanceRequirementsSchema = z.object({
  AllowedInstanceTypes: z.array(z.string()).optional(),
});

const ManagedInstancesStorageConfigurationSchema = z.object({
  StorageSizeGiB: z.number().int().optional(),
});

const CapacityReservationsSchema = z.object({
  ReservationGroupArn: z.string().optional(),
  ReservationPreference: z.string().optional(),
});

const ManagedInstancesLocalStorageConfigurationSchema = z.object({
  UseLocalStorage: z.boolean().optional(),
});

const InstanceLaunchTemplateSchema = z.object({
  Ec2InstanceProfileArn: z.string(),
  NetworkConfiguration: ManagedInstancesNetworkConfigurationSchema,
  InstanceRequirements: InstanceRequirementsSchema.optional(),
  CapacityOptionType: z.enum(["ON_DEMAND", "SPOT", "RESERVED"]).optional(),
  StorageConfiguration: ManagedInstancesStorageConfigurationSchema.optional(),
  Monitoring: z.string().optional(),
  FipsEnabled: z.boolean().optional(),
  CapacityReservations: CapacityReservationsSchema.optional(),
  InstanceMetadataTagsPropagation: z.boolean().optional(),
  LocalStorageConfiguration: ManagedInstancesLocalStorageConfigurationSchema
    .optional(),
});

const InfrastructureOptimizationSchema = z.object({
  ScaleInAfter: z.number().int().optional(),
});

const ManagedInstancesProviderSchema = z.object({
  PropagateTags: z.enum(["CAPACITY_PROVIDER", "NONE"]).optional(),
  InfrastructureRoleArn: z.string(),
  InstanceLaunchTemplate: InstanceLaunchTemplateSchema,
  InfrastructureOptimization: InfrastructureOptimizationSchema.optional(),
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
  ComputeEnvironmentName: z.string().optional(),
  ComputeResources: z.object({
    AllocationStrategy: z.string().optional(),
    BidPercentage: z.number().int().optional(),
    DesiredvCpus: z.number().int().optional(),
    Ec2Configuration: z.array(Ec2ConfigurationObjectSchema).optional(),
    Ec2KeyPair: z.string().optional(),
    ImageId: z.string().optional(),
    InstanceRole: z.string().optional(),
    InstanceTypes: z.array(z.string()).optional(),
    LaunchTemplate: LaunchTemplateSpecificationSchema.optional(),
    MaxvCpus: z.number().int(),
    MinvCpus: z.number().int().optional(),
    PlacementGroup: z.string().optional(),
    ScalingPolicy: ComputeScalingPolicySchema.optional(),
    SecurityGroupIds: z.array(z.string()).optional(),
    SpotIamFleetRole: z.string().optional(),
    Subnets: z.array(z.string()).optional(),
    Tags: z.record(z.string(), z.string()).describe(
      "A key-value pair to associate with a resource.",
    ).optional(),
    Type: z.string(),
    UpdateToLatestImageVersion: z.boolean().optional(),
    ManagedInstancesProvider: ManagedInstancesProviderSchema.optional(),
    CapacityTags: z.record(z.string(), z.string()).describe(
      "Capacity-level tags for compute environments.",
    ).optional(),
  }).optional(),
  ReplaceComputeEnvironment: z.boolean().optional(),
  ServiceRole: z.string().optional(),
  State: z.string().optional(),
  Tags: z.record(z.string(), z.string()).describe(
    "A key-value pair to associate with a resource.",
  ).optional(),
  Type: z.string(),
  UpdatePolicy: z.object({
    TerminateJobsOnUpdate: z.boolean().optional(),
    JobExecutionTimeoutMinutes: z.number().int().optional(),
  }).optional(),
  UnmanagedvCpus: z.number().int().optional(),
  EksConfiguration: z.object({
    EksClusterArn: z.string(),
    KubernetesNamespace: z.string(),
  }).optional(),
  EcsSettings: z.object({
    ContainerInsights: z.enum(["ENABLED", "ENHANCED", "DISABLED"]).describe(
      "The CloudWatch Container Insights setting applied to the Amazon ECS cluster that backs this compute environment. After you set this property, you can't revert it to the default (unset) state in which the setting is managed outside of AWS Batch. If you remove this property after previously setting it, AWS Batch treats the omission as DISABLED, because the underlying API has no way to unset the value. Because of this, if a stack rollback would return this property to its previous unset state, AWS Batch sets it to DISABLED instead.",
    ).optional(),
  }).optional(),
  Context: z.string().optional(),
});

const StateSchema = z.object({
  ComputeEnvironmentArn: z.string(),
  ComputeEnvironmentName: z.string().optional(),
  ComputeResources: z.object({
    AllocationStrategy: z.string(),
    BidPercentage: z.number(),
    DesiredvCpus: z.number(),
    Ec2Configuration: z.array(Ec2ConfigurationObjectSchema),
    Ec2KeyPair: z.string(),
    ImageId: z.string(),
    InstanceRole: z.string(),
    InstanceTypes: z.array(z.string()),
    LaunchTemplate: LaunchTemplateSpecificationSchema,
    MaxvCpus: z.number(),
    MinvCpus: z.number(),
    PlacementGroup: z.string(),
    ScalingPolicy: ComputeScalingPolicySchema,
    SecurityGroupIds: z.array(z.string()),
    SpotIamFleetRole: z.string(),
    Subnets: z.array(z.string()),
    Tags: z.record(z.string(), z.unknown()),
    Type: z.string(),
    UpdateToLatestImageVersion: z.boolean(),
    ManagedInstancesProvider: ManagedInstancesProviderSchema,
    CapacityTags: z.record(z.string(), z.unknown()),
  }).optional(),
  ReplaceComputeEnvironment: z.boolean().optional(),
  ServiceRole: z.string().optional(),
  State: z.string().optional(),
  Tags: z.record(z.string(), z.unknown()).optional(),
  Type: z.string().optional(),
  UpdatePolicy: z.object({
    TerminateJobsOnUpdate: z.boolean(),
    JobExecutionTimeoutMinutes: z.number(),
  }).optional(),
  UnmanagedvCpus: z.number().optional(),
  EksConfiguration: z.object({
    EksClusterArn: z.string(),
    KubernetesNamespace: z.string(),
  }).optional(),
  EcsSettings: z.object({
    ContainerInsights: z.string(),
  }).optional(),
  Context: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  ComputeEnvironmentName: z.string().optional(),
  ComputeResources: z.object({
    AllocationStrategy: z.string().optional(),
    BidPercentage: z.number().int().optional(),
    DesiredvCpus: z.number().int().optional(),
    Ec2Configuration: z.array(Ec2ConfigurationObjectSchema).optional(),
    Ec2KeyPair: z.string().optional(),
    ImageId: z.string().optional(),
    InstanceRole: z.string().optional(),
    InstanceTypes: z.array(z.string()).optional(),
    LaunchTemplate: LaunchTemplateSpecificationSchema.optional(),
    MaxvCpus: z.number().int().optional(),
    MinvCpus: z.number().int().optional(),
    PlacementGroup: z.string().optional(),
    ScalingPolicy: ComputeScalingPolicySchema.optional(),
    SecurityGroupIds: z.array(z.string()).optional(),
    SpotIamFleetRole: z.string().optional(),
    Subnets: z.array(z.string()).optional(),
    Tags: z.record(z.string(), z.string()).describe(
      "A key-value pair to associate with a resource.",
    ).optional(),
    Type: z.string().optional(),
    UpdateToLatestImageVersion: z.boolean().optional(),
    ManagedInstancesProvider: ManagedInstancesProviderSchema.optional(),
    CapacityTags: z.record(z.string(), z.string()).describe(
      "Capacity-level tags for compute environments.",
    ).optional(),
  }).optional(),
  ReplaceComputeEnvironment: z.boolean().optional(),
  ServiceRole: z.string().optional(),
  State: z.string().optional(),
  Tags: z.record(z.string(), z.string()).describe(
    "A key-value pair to associate with a resource.",
  ).optional(),
  Type: z.string().optional(),
  UpdatePolicy: z.object({
    TerminateJobsOnUpdate: z.boolean().optional(),
    JobExecutionTimeoutMinutes: z.number().int().optional(),
  }).optional(),
  UnmanagedvCpus: z.number().int().optional(),
  EksConfiguration: z.object({
    EksClusterArn: z.string().optional(),
    KubernetesNamespace: z.string().optional(),
  }).optional(),
  EcsSettings: z.object({
    ContainerInsights: z.enum(["ENABLED", "ENHANCED", "DISABLED"]).describe(
      "The CloudWatch Container Insights setting applied to the Amazon ECS cluster that backs this compute environment. After you set this property, you can't revert it to the default (unset) state in which the setting is managed outside of AWS Batch. If you remove this property after previously setting it, AWS Batch treats the omission as DISABLED, because the underlying API has no way to unset the value. Because of this, if a stack rollback would return this property to its previous unset state, AWS Batch sets it to DISABLED instead.",
    ).optional(),
  }).optional(),
  Context: z.string().optional(),
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

/** Swamp extension model for Batch ComputeEnvironment. Registered at `@swamp/aws/batch/compute-environment`. */
export const model = {
  type: "@swamp/aws/batch/compute-environment",
  version: "2026.09.16.1",
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
      toVersion: "2026.08.13.1",
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
      toVersion: "2026.08.24.1",
      description: "Added: EcsSettings",
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
      description: "Batch ComputeEnvironment resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Batch ComputeEnvironment",
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
          "AWS::Batch::ComputeEnvironment",
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
      description: "Get a Batch ComputeEnvironment",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Batch ComputeEnvironment",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Batch::ComputeEnvironment",
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
      description: "Update a Batch ComputeEnvironment",
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
        const identifier = existing.ComputeEnvironmentArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::Batch::ComputeEnvironment",
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
          "AWS::Batch::ComputeEnvironment",
          identifier,
          currentState,
          desiredState,
          [
            "SpotIamFleetRole",
            "ComputeEnvironmentName",
            "Tags",
            "Type",
            "EksConfiguration",
            "CapacityOptionType",
            "FipsEnabled",
          ],
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
      description: "Delete a Batch ComputeEnvironment",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Batch ComputeEnvironment",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Batch::ComputeEnvironment",
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
      description: "Sync Batch ComputeEnvironment state from AWS",
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
        const identifier = existing.ComputeEnvironmentArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::Batch::ComputeEnvironment",
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
      description: "List Batch ComputeEnvironment resources",
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
          "AWS::Batch::ComputeEnvironment",
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
            (item.properties?.ComputeEnvironmentArn?.toString() ??
              item.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
              .replace(/\0/g, "");
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
