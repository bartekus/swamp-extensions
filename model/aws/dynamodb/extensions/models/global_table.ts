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

// Auto-generated extension model for @swamp/aws/dynamodb/global-table
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for DynamoDB GlobalTable (AWS::DynamoDB::GlobalTable).
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

const VectorAttributeSchema = z.object({
  AttributeName: z.string(),
});

const ProjectionSchema = z.object({
  NonKeyAttributes: z.array(z.string()).optional(),
  ProjectionType: z.string().optional(),
});

const SearchSchemaElementSchema = z.object({
  AttributeName: z.string(),
  SearchSchemaElementType: z.enum(["HASH", "INLINE_FILTER"]),
});

const VectorIndexSchema = z.object({
  IndexName: z.string(),
  VectorAttribute: VectorAttributeSchema,
  Projection: ProjectionSchema,
  Dimensions: z.number().int().min(1).max(4096),
  SearchSchema: z.array(SearchSchemaElementSchema).optional(),
  DistanceFunction: z.enum(["COSINE", "DOT_PRODUCT", "EUCLIDEAN"]),
});

const ReplicaSSESpecificationSchema = z.object({
  KMSMasterKeyId: z.string(),
});

const KinesisStreamSpecificationSchema = z.object({
  ApproximateCreationDateTimePrecision: z.enum(["MICROSECOND", "MILLISECOND"])
    .optional(),
  StreamArn: z.string(),
});

const ContributorInsightsSpecificationSchema = z.object({
  Mode: z.enum(["ACCESSED_AND_THROTTLED_KEYS", "THROTTLED_KEYS"]).optional(),
  Enabled: z.boolean(),
});

const PointInTimeRecoverySpecificationSchema = z.object({
  PointInTimeRecoveryEnabled: z.boolean().optional(),
  RecoveryPeriodInDays: z.number().int().min(1).max(35).optional(),
});

const ResourcePolicySchema = z.object({
  PolicyDocument: z.record(z.string(), z.unknown()),
});

const TagSchema = z.object({
  Value: z.string(),
  Key: z.string(),
});

const ReplicaStreamSpecificationSchema = z.object({
  ResourcePolicy: ResourcePolicySchema.optional(),
  Tags: z.array(TagSchema).optional(),
});

const TargetTrackingScalingPolicyConfigurationSchema = z.object({
  ScaleOutCooldown: z.number().int().min(0).optional(),
  TargetValue: z.number(),
  DisableScaleIn: z.boolean().optional(),
  ScaleInCooldown: z.number().int().min(0).optional(),
});

const CapacityAutoScalingSettingsSchema = z.object({
  MinCapacity: z.number().int().min(1),
  SeedCapacity: z.number().int().min(1).optional(),
  TargetTrackingScalingPolicyConfiguration:
    TargetTrackingScalingPolicyConfigurationSchema,
  MaxCapacity: z.number().int().min(1),
});

const ReadProvisionedThroughputSettingsSchema = z.object({
  ReadCapacityUnits: z.number().int().min(1).optional(),
  ReadCapacityAutoScalingSettings: CapacityAutoScalingSettingsSchema.optional(),
});

const ReadOnDemandThroughputSettingsSchema = z.object({
  MaxReadRequestUnits: z.number().int().min(1).optional(),
});

const ReplicaGlobalSecondaryIndexSpecificationSchema = z.object({
  IndexName: z.string().min(3).max(255),
  ContributorInsightsSpecification: ContributorInsightsSpecificationSchema
    .optional(),
  ReadProvisionedThroughputSettings: ReadProvisionedThroughputSettingsSchema
    .optional(),
  ReadOnDemandThroughputSettings: ReadOnDemandThroughputSettingsSchema
    .optional(),
});

const ReplicaSpecificationSchema = z.object({
  SSESpecification: ReplicaSSESpecificationSchema.optional(),
  KinesisStreamSpecification: KinesisStreamSpecificationSchema.optional(),
  ContributorInsightsSpecification: ContributorInsightsSpecificationSchema
    .optional(),
  GlobalTableSettingsReplicationMode: z.enum(["ENABLED", "DISABLED"])
    .optional(),
  PointInTimeRecoverySpecification: PointInTimeRecoverySpecificationSchema
    .optional(),
  ReplicaStreamSpecification: ReplicaStreamSpecificationSchema.optional(),
  GlobalSecondaryIndexes: z.array(
    ReplicaGlobalSecondaryIndexSpecificationSchema,
  ).optional(),
  Region: z.string(),
  ResourcePolicy: ResourcePolicySchema.optional(),
  ReadProvisionedThroughputSettings: ReadProvisionedThroughputSettingsSchema
    .optional(),
  TableClass: z.string().optional(),
  DeletionProtectionEnabled: z.boolean().optional(),
  Tags: z.array(TagSchema).optional(),
  ReadOnDemandThroughputSettings: ReadOnDemandThroughputSettingsSchema
    .optional(),
});

const GlobalTableWitnessSchema = z.object({
  Region: z.string().optional(),
});

const AttributeDefinitionSchema = z.object({
  AttributeType: z.string(),
  AttributeName: z.string().min(1).max(255),
});

const KeySchemaSchema = z.object({
  KeyType: z.string(),
  AttributeName: z.string().min(1).max(255),
});

const WarmThroughputSchema = z.object({
  ReadUnitsPerSecond: z.number().int().min(1).optional(),
  WriteUnitsPerSecond: z.number().int().min(1).optional(),
});

const GlobalReadProvisionedThroughputSettingsSchema = z.object({
  ReadCapacityUnits: z.number().int().min(1).optional(),
});

const WriteProvisionedThroughputSettingsSchema = z.object({
  WriteCapacityAutoScalingSettings: CapacityAutoScalingSettingsSchema
    .optional(),
});

const WriteOnDemandThroughputSettingsSchema = z.object({
  MaxWriteRequestUnits: z.number().int().min(1).optional(),
});

const GlobalSecondaryIndexSchema = z.object({
  IndexName: z.string().min(3).max(255),
  Projection: ProjectionSchema,
  KeySchema: z.array(KeySchemaSchema),
  WarmThroughput: WarmThroughputSchema.optional(),
  ReadProvisionedThroughputSettings:
    GlobalReadProvisionedThroughputSettingsSchema.optional(),
  WriteProvisionedThroughputSettings: WriteProvisionedThroughputSettingsSchema
    .optional(),
  ReadOnDemandThroughputSettings: ReadOnDemandThroughputSettingsSchema
    .optional(),
  WriteOnDemandThroughputSettings: WriteOnDemandThroughputSettingsSchema
    .optional(),
});

const LocalSecondaryIndexSchema = z.object({
  IndexName: z.string().min(3).max(255),
  Projection: ProjectionSchema,
  KeySchema: z.array(KeySchemaSchema),
});

const GlobalArgsSchema = z.object({
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
  MultiRegionConsistency: z.enum(["EVENTUAL", "STRONG"]).optional(),
  SSESpecification: z.object({
    SSEEnabled: z.boolean(),
    SSEType: z.string().optional(),
  }).optional(),
  StreamSpecification: z.object({
    StreamViewType: z.string(),
  }).optional(),
  WarmThroughput: z.object({
    ReadUnitsPerSecond: z.number().int().min(1).optional(),
    WriteUnitsPerSecond: z.number().int().min(1).optional(),
  }).optional(),
  VectorIndexes: z.array(VectorIndexSchema).optional(),
  Replicas: z.array(ReplicaSpecificationSchema),
  WriteProvisionedThroughputSettings: z.object({
    WriteCapacityAutoScalingSettings: CapacityAutoScalingSettingsSchema
      .optional(),
  }).optional(),
  GlobalTableSourceArn: z.string().optional(),
  WriteOnDemandThroughputSettings: z.object({
    MaxWriteRequestUnits: z.number().int().min(1).optional(),
  }).optional(),
  GlobalTableWitnesses: z.array(GlobalTableWitnessSchema).optional(),
  TableName: z.string().optional(),
  AttributeDefinitions: z.array(AttributeDefinitionSchema).optional(),
  BillingMode: z.string().optional(),
  GlobalSecondaryIndexes: z.array(GlobalSecondaryIndexSchema).optional(),
  KeySchema: z.array(KeySchemaSchema).optional(),
  LocalSecondaryIndexes: z.array(LocalSecondaryIndexSchema).optional(),
  ReadProvisionedThroughputSettings: z.object({
    ReadCapacityUnits: z.number().int().min(1).optional(),
  }).optional(),
  ReadOnDemandThroughputSettings: z.object({
    MaxReadRequestUnits: z.number().int().min(1).optional(),
  }).optional(),
  TimeToLiveSpecification: z.object({
    Enabled: z.boolean(),
    AttributeName: z.string().optional(),
  }).optional(),
});

const StateSchema = z.object({
  MultiRegionConsistency: z.string().optional(),
  TableId: z.string().optional(),
  SSESpecification: z.object({
    SSEEnabled: z.boolean(),
    SSEType: z.string(),
  }).optional(),
  StreamSpecification: z.object({
    StreamViewType: z.string(),
  }).optional(),
  WarmThroughput: WarmThroughputSchema.optional(),
  VectorIndexes: z.array(VectorIndexSchema).optional(),
  Replicas: z.array(ReplicaSpecificationSchema).optional(),
  WriteProvisionedThroughputSettings: WriteProvisionedThroughputSettingsSchema
    .optional(),
  GlobalTableSourceArn: z.string().optional(),
  WriteOnDemandThroughputSettings: WriteOnDemandThroughputSettingsSchema
    .optional(),
  GlobalTableWitnesses: z.array(GlobalTableWitnessSchema).optional(),
  TableName: z.string(),
  AttributeDefinitions: z.array(AttributeDefinitionSchema).optional(),
  BillingMode: z.string().optional(),
  GlobalSecondaryIndexes: z.array(GlobalSecondaryIndexSchema).optional(),
  KeySchema: z.array(KeySchemaSchema).optional(),
  LocalSecondaryIndexes: z.array(LocalSecondaryIndexSchema).optional(),
  Arn: z.string().optional(),
  StreamArn: z.string().optional(),
  ReadProvisionedThroughputSettings:
    GlobalReadProvisionedThroughputSettingsSchema.optional(),
  ReadOnDemandThroughputSettings: ReadOnDemandThroughputSettingsSchema
    .optional(),
  TimeToLiveSpecification: z.object({
    Enabled: z.boolean(),
    AttributeName: z.string(),
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  MultiRegionConsistency: z.enum(["EVENTUAL", "STRONG"]).optional(),
  SSESpecification: z.object({
    SSEEnabled: z.boolean().optional(),
    SSEType: z.string().optional(),
  }).optional(),
  StreamSpecification: z.object({
    StreamViewType: z.string().optional(),
  }).optional(),
  WarmThroughput: z.object({
    ReadUnitsPerSecond: z.number().int().min(1).optional(),
    WriteUnitsPerSecond: z.number().int().min(1).optional(),
  }).optional(),
  VectorIndexes: z.array(VectorIndexSchema).optional(),
  Replicas: z.array(ReplicaSpecificationSchema).optional(),
  WriteProvisionedThroughputSettings: z.object({
    WriteCapacityAutoScalingSettings: CapacityAutoScalingSettingsSchema
      .optional(),
  }).optional(),
  GlobalTableSourceArn: z.string().optional(),
  WriteOnDemandThroughputSettings: z.object({
    MaxWriteRequestUnits: z.number().int().min(1).optional(),
  }).optional(),
  GlobalTableWitnesses: z.array(GlobalTableWitnessSchema).optional(),
  TableName: z.string().optional(),
  AttributeDefinitions: z.array(AttributeDefinitionSchema).optional(),
  BillingMode: z.string().optional(),
  GlobalSecondaryIndexes: z.array(GlobalSecondaryIndexSchema).optional(),
  KeySchema: z.array(KeySchemaSchema).optional(),
  LocalSecondaryIndexes: z.array(LocalSecondaryIndexSchema).optional(),
  ReadProvisionedThroughputSettings: z.object({
    ReadCapacityUnits: z.number().int().min(1).optional(),
  }).optional(),
  ReadOnDemandThroughputSettings: z.object({
    MaxReadRequestUnits: z.number().int().min(1).optional(),
  }).optional(),
  TimeToLiveSpecification: z.object({
    Enabled: z.boolean().optional(),
    AttributeName: z.string().optional(),
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

/** Swamp extension model for DynamoDB GlobalTable. Registered at `@swamp/aws/dynamodb/global-table`. */
export const model = {
  type: "@swamp/aws/dynamodb/global-table",
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
      toVersion: "2026.05.27.1",
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
      toVersion: "2026.07.28.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.31.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.11.1",
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
      toVersion: "2026.08.20.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.15.1",
      description: "Added: VectorIndexes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "DynamoDB GlobalTable resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a DynamoDB GlobalTable",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const desiredState: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await createResource(
          "AWS::DynamoDB::GlobalTable",
          desiredState,
          credentials,
        ) as StateData;
        const instanceName =
          ((result.TableName ?? g.TableName)?.toString() ?? "current").replace(
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
      description: "Get a DynamoDB GlobalTable",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the DynamoDB GlobalTable",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::DynamoDB::GlobalTable",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName =
          ((result.TableName ?? context.globalArgs.TableName)?.toString() ??
            args.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
            .replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update a DynamoDB GlobalTable",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.TableName?.toString() ?? "current").replace(
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
        const identifier = existing.TableName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::DynamoDB::GlobalTable",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::DynamoDB::GlobalTable",
          identifier,
          currentState,
          desiredState,
          ["TableName"],
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
      description: "Delete a DynamoDB GlobalTable",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the DynamoDB GlobalTable",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::DynamoDB::GlobalTable",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.TableName?.toString() ?? args.identifier).replace(
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
      description: "Sync DynamoDB GlobalTable state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.TableName?.toString() ?? "current").replace(
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
        const identifier = existing.TableName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::DynamoDB::GlobalTable",
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
      description: "List DynamoDB GlobalTable resources",
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
          "AWS::DynamoDB::GlobalTable",
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
            (item.properties?.TableName?.toString() ?? item.identifier).replace(
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
