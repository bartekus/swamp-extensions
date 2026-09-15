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

// Auto-generated extension model for @swamp/aws/fsx/file-cache
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for FSx FileCache (AWS::FSx::FileCache).
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

const TagSchema = z.object({
  Key: z.string().min(1).max(128),
  Value: z.string().min(0).max(256),
});

const MetadataConfigurationSchema = z.object({
  StorageCapacity: z.number().int().min(0).max(2147483647),
});

const LogConfigurationSchema = z.object({
  Level: z.enum(["DISABLED", "WARN_ONLY", "ERROR_ONLY", "WARN_ERROR"]),
  Destination: z.string().min(8).max(1024).optional(),
});

const DataRepositoryAssociationSchema = z.object({
  FileCachePath: z.string().min(1).max(4096),
  DataRepositoryPath: z.string().min(3).max(4357),
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
  FileCacheType: z.enum(["LUSTRE"]).describe(
    "The type of cache, which must be LUSTRE",
  ),
  FileCacheTypeVersion: z.string().min(1).max(20).regex(
    new RegExp("^[0-9](\\.[0-9]*)*$"),
  ).describe("The Lustre version of the cache, which must be 2.12"),
  StorageCapacity: z.number().int().min(0).max(2147483647).describe(
    "The storage capacity of the cache in gibibytes (GiB)",
  ),
  SubnetIds: z.array(
    z.string().min(15).max(24).regex(new RegExp("^(subnet-[0-9a-f]{8,})$")),
  ).describe("A list of subnet IDs for the cache"),
  SecurityGroupIds: z.array(
    z.string().min(11).max(20).regex(new RegExp("^(sg-[0-9a-f]{8,})$")),
  ).describe("A list of security group IDs for the cache").optional(),
  Tags: z.array(TagSchema).describe("Tags to associate with the file cache")
    .optional(),
  CopyTagsToDataRepositoryAssociations: z.boolean().describe(
    "Whether tags should be copied to data repository associations",
  ).optional(),
  KmsKeyId: z.string().min(1).max(2048).describe(
    "The KMS key ID for encrypting data",
  ).optional(),
  LustreConfiguration: z.object({
    PerUnitStorageThroughput: z.number().int().min(12).max(1000),
    DeploymentType: z.enum(["CACHE_1"]),
    WeeklyMaintenanceStartTime: z.string().min(7).max(7).regex(
      new RegExp("^[1-7]:([01]\\d|2[0-3]):?([0-5]\\d)$"),
    ).optional(),
    MetadataConfiguration: MetadataConfigurationSchema,
    LogConfiguration: LogConfigurationSchema.optional(),
  }).describe("The Lustre configuration for the file cache").optional(),
  DataRepositoryAssociations: z.array(DataRepositoryAssociationSchema).describe(
    "Data repository associations for the cache",
  ).optional(),
});

const StateSchema = z.object({
  ResourceARN: z.string(),
  FileCacheId: z.string().optional(),
  FileCacheType: z.string().optional(),
  FileCacheTypeVersion: z.string().optional(),
  StorageCapacity: z.number().optional(),
  SubnetIds: z.array(z.string()).optional(),
  SecurityGroupIds: z.array(z.string()).optional(),
  Tags: z.array(TagSchema).optional(),
  CopyTagsToDataRepositoryAssociations: z.boolean().optional(),
  KmsKeyId: z.string().optional(),
  LustreConfiguration: z.object({
    PerUnitStorageThroughput: z.number(),
    DeploymentType: z.string(),
    WeeklyMaintenanceStartTime: z.string(),
    MetadataConfiguration: MetadataConfigurationSchema,
    MountName: z.string(),
    LogConfiguration: LogConfigurationSchema,
  }).optional(),
  DataRepositoryAssociations: z.array(DataRepositoryAssociationSchema)
    .optional(),
  DNSName: z.string().optional(),
  VpcId: z.string().optional(),
  NetworkInterfaceIds: z.array(z.string()).optional(),
  DataRepositoryAssociationIds: z.array(z.string()).optional(),
  OwnerId: z.string().optional(),
  CreationTime: z.string().optional(),
  Lifecycle: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  FileCacheType: z.enum(["LUSTRE"]).describe(
    "The type of cache, which must be LUSTRE",
  ).optional(),
  FileCacheTypeVersion: z.string().min(1).max(20).regex(
    new RegExp("^[0-9](\\.[0-9]*)*$"),
  ).describe("The Lustre version of the cache, which must be 2.12").optional(),
  StorageCapacity: z.number().int().min(0).max(2147483647).describe(
    "The storage capacity of the cache in gibibytes (GiB)",
  ).optional(),
  SubnetIds: z.array(
    z.string().min(15).max(24).regex(new RegExp("^(subnet-[0-9a-f]{8,})$")),
  ).describe("A list of subnet IDs for the cache").optional(),
  SecurityGroupIds: z.array(
    z.string().min(11).max(20).regex(new RegExp("^(sg-[0-9a-f]{8,})$")),
  ).describe("A list of security group IDs for the cache").optional(),
  Tags: z.array(TagSchema).describe("Tags to associate with the file cache")
    .optional(),
  CopyTagsToDataRepositoryAssociations: z.boolean().describe(
    "Whether tags should be copied to data repository associations",
  ).optional(),
  KmsKeyId: z.string().min(1).max(2048).describe(
    "The KMS key ID for encrypting data",
  ).optional(),
  LustreConfiguration: z.object({
    PerUnitStorageThroughput: z.number().int().min(12).max(1000).optional(),
    DeploymentType: z.enum(["CACHE_1"]).optional(),
    WeeklyMaintenanceStartTime: z.string().min(7).max(7).regex(
      new RegExp("^[1-7]:([01]\\d|2[0-3]):?([0-5]\\d)$"),
    ).optional(),
    MetadataConfiguration: MetadataConfigurationSchema.optional(),
    LogConfiguration: LogConfigurationSchema.optional(),
  }).describe("The Lustre configuration for the file cache").optional(),
  DataRepositoryAssociations: z.array(DataRepositoryAssociationSchema).describe(
    "Data repository associations for the cache",
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

/** Swamp extension model for FSx FileCache. Registered at `@swamp/aws/fsx/file-cache`. */
export const model = {
  type: "@swamp/aws/fsx/file-cache",
  version: "2026.09.15.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "FSx FileCache resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a FSx FileCache",
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
          "AWS::FSx::FileCache",
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
      description: "Get a FSx FileCache",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the FSx FileCache",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::FSx::FileCache",
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
      description: "Update a FSx FileCache",
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
        const identifier = existing.ResourceARN?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::FSx::FileCache",
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
          "AWS::FSx::FileCache",
          identifier,
          currentState,
          desiredState,
          [
            "FileCacheType",
            "FileCacheTypeVersion",
            "StorageCapacity",
            "SubnetIds",
            "SecurityGroupIds",
            "KmsKeyId",
            "CopyTagsToDataRepositoryAssociations",
            "DataRepositoryAssociations",
            "PerUnitStorageThroughput",
            "DeploymentType",
            "MetadataConfiguration",
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
      description: "Delete a FSx FileCache",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the FSx FileCache",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::FSx::FileCache",
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
      description: "Sync FSx FileCache state from AWS",
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
        const identifier = existing.ResourceARN?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::FSx::FileCache",
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
      description: "List FSx FileCache resources",
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
          "AWS::FSx::FileCache",
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
            (item.properties?.ResourceARN?.toString() ?? item.identifier)
              .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
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
