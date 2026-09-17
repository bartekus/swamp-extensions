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

// Auto-generated extension model for @swamp/aws/elasticache/serverless-cache
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for ElastiCache ServerlessCache (AWS::ElastiCache::ServerlessCache).
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

const DataStorageSchema = z.object({
  Minimum: z.number().int().describe(
    "The minimum cached data capacity of the Serverless Cache.",
  ).optional(),
  Maximum: z.number().int().describe(
    "The maximum cached data capacity of the Serverless Cache.",
  ).optional(),
  Unit: z.enum(["GB"]).describe(
    "The unit of cached data capacity of the Serverless Cache.",
  ),
});

const ECPUPerSecondSchema = z.object({
  Minimum: z.number().int().describe(
    "The minimum ECPU per second of the Serverless Cache.",
  ).optional(),
  Maximum: z.number().int().describe(
    "The maximum ECPU per second of the Serverless Cache.",
  ).optional(),
});

const TagSchema = z.object({
  Value: z.string().min(0).max(256).regex(
    new RegExp("^[a-zA-Z0-9 _\\.\\/=+:\\-@]*$"),
  ).describe(
    "The value for the tag. You can specify a value that is 0 to 256 Unicode characters in length. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ).optional(),
  Key: z.string().min(1).max(128).regex(
    new RegExp("^(?!aws:)[a-zA-Z0-9 _\\.\\/=+:\\-@]*$"),
  ).describe(
    "The key name of the tag. You can specify a value that is 1 to 128 Unicode characters in length and cannot be prefixed with 'aws:'. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ),
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
  Description: z.string().describe("The description of the Serverless Cache.")
    .optional(),
  KmsKeyId: z.string().describe(
    "The ID of the KMS key used to encrypt the cluster.",
  ).optional(),
  FinalSnapshotName: z.string().describe(
    "The final snapshot name which is taken before Serverless Cache is deleted.",
  ).optional(),
  UserGroupId: z.string().describe("The ID of the user group.").optional(),
  CacheUsageLimits: z.object({
    DataStorage: DataStorageSchema.describe(
      "The cached data capacity of the Serverless Cache.",
    ).optional(),
    ECPUPerSecond: ECPUPerSecondSchema.describe(
      "The ECPU per second of the Serverless Cache.",
    ).optional(),
  }).describe("The cache capacity limit of the Serverless Cache.").optional(),
  SecurityGroupIds: z.array(z.string()).describe(
    "One or more Amazon VPC security groups associated with this Serverless Cache.",
  ).optional(),
  SnapshotArnsToRestore: z.array(z.string()).describe(
    "The ARN's of snapshot to restore Serverless Cache.",
  ).optional(),
  SubnetIds: z.array(z.string()).describe(
    "The subnet id's of the Serverless Cache.",
  ).optional(),
  DailySnapshotTime: z.string().describe(
    "The daily time range (in UTC) during which the service takes automatic snapshot of the Serverless Cache.",
  ).optional(),
  SnapshotRetentionLimit: z.number().int().describe(
    "The snapshot retention limit of the Serverless Cache.",
  ).optional(),
  NetworkType: z.enum(["ipv4", "ipv6", "dual_stack"]).describe(
    "The network type for the serverless cache. Valid values are ipv4, ipv6, or dual_stack.",
  ).optional(),
  ServerlessCacheName: z.string().describe(
    "The name of the Serverless Cache. This value must be unique.",
  ),
  MajorEngineVersion: z.string().describe(
    "The major engine version of the Serverless Cache.",
  ).optional(),
  Engine: z.string().describe("The engine name of the Serverless Cache."),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this Serverless Cache.",
  ).optional(),
});

const StateSchema = z.object({
  Status: z.string().optional(),
  Description: z.string().optional(),
  KmsKeyId: z.string().optional(),
  FinalSnapshotName: z.string().optional(),
  UserGroupId: z.string().optional(),
  CreateTime: z.string().optional(),
  CacheUsageLimits: z.object({
    DataStorage: DataStorageSchema,
    ECPUPerSecond: ECPUPerSecondSchema,
  }).optional(),
  SecurityGroupIds: z.array(z.string()).optional(),
  SnapshotArnsToRestore: z.array(z.string()).optional(),
  SubnetIds: z.array(z.string()).optional(),
  DailySnapshotTime: z.string().optional(),
  ReaderEndpoint: z.object({
    Address: z.string(),
    Port: z.string(),
  }).optional(),
  SnapshotRetentionLimit: z.number().optional(),
  FullEngineVersion: z.string().optional(),
  Endpoint: z.object({
    Address: z.string(),
    Port: z.string(),
  }).optional(),
  NetworkType: z.string().optional(),
  ServerlessCacheName: z.string(),
  MajorEngineVersion: z.string().optional(),
  ARN: z.string().optional(),
  Engine: z.string().optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  Description: z.string().describe("The description of the Serverless Cache.")
    .optional(),
  KmsKeyId: z.string().describe(
    "The ID of the KMS key used to encrypt the cluster.",
  ).optional(),
  FinalSnapshotName: z.string().describe(
    "The final snapshot name which is taken before Serverless Cache is deleted.",
  ).optional(),
  UserGroupId: z.string().describe("The ID of the user group.").optional(),
  CacheUsageLimits: z.object({
    DataStorage: DataStorageSchema.describe(
      "The cached data capacity of the Serverless Cache.",
    ).optional(),
    ECPUPerSecond: ECPUPerSecondSchema.describe(
      "The ECPU per second of the Serverless Cache.",
    ).optional(),
  }).describe("The cache capacity limit of the Serverless Cache.").optional(),
  SecurityGroupIds: z.array(z.string()).describe(
    "One or more Amazon VPC security groups associated with this Serverless Cache.",
  ).optional(),
  SnapshotArnsToRestore: z.array(z.string()).describe(
    "The ARN's of snapshot to restore Serverless Cache.",
  ).optional(),
  SubnetIds: z.array(z.string()).describe(
    "The subnet id's of the Serverless Cache.",
  ).optional(),
  DailySnapshotTime: z.string().describe(
    "The daily time range (in UTC) during which the service takes automatic snapshot of the Serverless Cache.",
  ).optional(),
  SnapshotRetentionLimit: z.number().int().describe(
    "The snapshot retention limit of the Serverless Cache.",
  ).optional(),
  NetworkType: z.enum(["ipv4", "ipv6", "dual_stack"]).describe(
    "The network type for the serverless cache. Valid values are ipv4, ipv6, or dual_stack.",
  ).optional(),
  ServerlessCacheName: z.string().describe(
    "The name of the Serverless Cache. This value must be unique.",
  ).optional(),
  MajorEngineVersion: z.string().describe(
    "The major engine version of the Serverless Cache.",
  ).optional(),
  Engine: z.string().describe("The engine name of the Serverless Cache.")
    .optional(),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this Serverless Cache.",
  ).optional(),
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

/** Swamp extension model for ElastiCache ServerlessCache. Registered at `@swamp/aws/elasticache/serverless-cache`. */
export const model = {
  type: "@swamp/aws/elasticache/serverless-cache",
  version: "2026.09.17.1",
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
      toVersion: "2026.09.17.1",
      description: "Added: NetworkType",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "ElastiCache ServerlessCache resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a ElastiCache ServerlessCache",
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
          "AWS::ElastiCache::ServerlessCache",
          desiredState,
          credentials,
        ) as StateData;
        const instanceName =
          ((result.ServerlessCacheName ?? g.ServerlessCacheName)?.toString() ??
            "current").replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(
              /\0/g,
              "",
            );
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    get: {
      description: "Get a ElastiCache ServerlessCache",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the ElastiCache ServerlessCache",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::ElastiCache::ServerlessCache",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName = ((result.ServerlessCacheName ??
          context.globalArgs.ServerlessCacheName)?.toString() ??
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
      description: "Update a ElastiCache ServerlessCache",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.ServerlessCacheName?.toString() ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.ServerlessCacheName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::ElastiCache::ServerlessCache",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::ElastiCache::ServerlessCache",
          identifier,
          currentState,
          desiredState,
          [
            "ServerlessCacheName",
            "KmsKeyId",
            "SnapshotArnsToRestore",
            "SubnetIds",
            "NetworkType",
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
      description: "Delete a ElastiCache ServerlessCache",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the ElastiCache ServerlessCache",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::ElastiCache::ServerlessCache",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.ServerlessCacheName?.toString() ??
            args.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
            .replace(/\0/g, "");
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
      description: "Sync ElastiCache ServerlessCache state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.ServerlessCacheName?.toString() ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.ServerlessCacheName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::ElastiCache::ServerlessCache",
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
      description: "List ElastiCache ServerlessCache resources",
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
          "AWS::ElastiCache::ServerlessCache",
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
            (item.properties?.ServerlessCacheName?.toString() ??
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
