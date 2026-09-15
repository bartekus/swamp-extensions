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

// Auto-generated extension model for @swamp/aws/memorydb/snapshot
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for MemoryDB Snapshot (AWS::MemoryDB::Snapshot).
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
  Key: z.string().min(1).max(128).regex(new RegExp("^(?!aws:).+")).describe(
    "The key of the tag.",
  ),
  Value: z.string().min(0).max(256).describe("The value of the tag."),
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
  SnapshotName: z.string().describe("The name of the snapshot."),
  ClusterName: z.string().describe(
    "The name of the cluster from which the snapshot was taken.",
  ),
  KmsKeyId: z.string().describe(
    "The ID of the KMS key used to encrypt the snapshot.",
  ).optional(),
  ClusterConfiguration: z.object({
    Name: z.string().describe("The name of the cluster.").optional(),
    Description: z.string().describe(
      "The description of the cluster configuration.",
    ).optional(),
    NodeType: z.string().describe("The node type used for the cluster.")
      .optional(),
    Engine: z.string().describe(
      "The name of the engine used by the cluster configuration.",
    ).optional(),
    EngineVersion: z.string().describe(
      "The Redis OSS engine version used by the cluster.",
    ).optional(),
    MaintenanceWindow: z.string().describe(
      "The specified maintenance window for the cluster.",
    ).optional(),
    TopicArn: z.string().describe(
      "The Amazon Resource Name (ARN) of the SNS notification topic for the cluster.",
    ).optional(),
    Port: z.number().int().describe("The port used by the cluster.").optional(),
    ParameterGroupName: z.string().describe(
      "The name of parameter group used by the cluster.",
    ).optional(),
    SubnetGroupName: z.string().describe(
      "The name of the subnet group used by the cluster.",
    ).optional(),
    VpcId: z.string().describe("The ID of the VPC the cluster belongs to.")
      .optional(),
    SnapshotRetentionLimit: z.number().int().describe(
      "The snapshot retention limit set by the cluster.",
    ).optional(),
    SnapshotWindow: z.string().describe(
      "The snapshot window set by the cluster.",
    ).optional(),
    NumShards: z.number().int().describe("The number of shards in the cluster.")
      .optional(),
  }).describe(
    "The configuration of the cluster from which the snapshot was taken.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "A list of tags to be added to this resource.",
  ).optional(),
});

const StateSchema = z.object({
  SnapshotName: z.string().optional(),
  ClusterName: z.string().optional(),
  Status: z.string().optional(),
  Source: z.string().optional(),
  KmsKeyId: z.string().optional(),
  Arn: z.string(),
  ClusterConfiguration: z.object({
    Name: z.string(),
    Description: z.string(),
    NodeType: z.string(),
    Engine: z.string(),
    EngineVersion: z.string(),
    MaintenanceWindow: z.string(),
    TopicArn: z.string(),
    Port: z.number(),
    ParameterGroupName: z.string(),
    SubnetGroupName: z.string(),
    VpcId: z.string(),
    SnapshotRetentionLimit: z.number(),
    SnapshotWindow: z.string(),
    NumShards: z.number(),
  }).optional(),
  DataTiering: z.string().optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  SnapshotName: z.string().describe("The name of the snapshot.").optional(),
  ClusterName: z.string().describe(
    "The name of the cluster from which the snapshot was taken.",
  ).optional(),
  KmsKeyId: z.string().describe(
    "The ID of the KMS key used to encrypt the snapshot.",
  ).optional(),
  ClusterConfiguration: z.object({
    Name: z.string().describe("The name of the cluster.").optional(),
    Description: z.string().describe(
      "The description of the cluster configuration.",
    ).optional(),
    NodeType: z.string().describe("The node type used for the cluster.")
      .optional(),
    Engine: z.string().describe(
      "The name of the engine used by the cluster configuration.",
    ).optional(),
    EngineVersion: z.string().describe(
      "The Redis OSS engine version used by the cluster.",
    ).optional(),
    MaintenanceWindow: z.string().describe(
      "The specified maintenance window for the cluster.",
    ).optional(),
    TopicArn: z.string().describe(
      "The Amazon Resource Name (ARN) of the SNS notification topic for the cluster.",
    ).optional(),
    Port: z.number().int().describe("The port used by the cluster.").optional(),
    ParameterGroupName: z.string().describe(
      "The name of parameter group used by the cluster.",
    ).optional(),
    SubnetGroupName: z.string().describe(
      "The name of the subnet group used by the cluster.",
    ).optional(),
    VpcId: z.string().describe("The ID of the VPC the cluster belongs to.")
      .optional(),
    SnapshotRetentionLimit: z.number().int().describe(
      "The snapshot retention limit set by the cluster.",
    ).optional(),
    SnapshotWindow: z.string().describe(
      "The snapshot window set by the cluster.",
    ).optional(),
    NumShards: z.number().int().describe("The number of shards in the cluster.")
      .optional(),
  }).describe(
    "The configuration of the cluster from which the snapshot was taken.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "A list of tags to be added to this resource.",
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

/** Swamp extension model for MemoryDB Snapshot. Registered at `@swamp/aws/memorydb/snapshot`. */
export const model = {
  type: "@swamp/aws/memorydb/snapshot",
  version: "2026.09.15.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "MemoryDB Snapshot resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a MemoryDB Snapshot",
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
          "AWS::MemoryDB::Snapshot",
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
      description: "Get a MemoryDB Snapshot",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the MemoryDB Snapshot",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::MemoryDB::Snapshot",
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
      description: "Update a MemoryDB Snapshot",
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
          "AWS::MemoryDB::Snapshot",
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
          "AWS::MemoryDB::Snapshot",
          identifier,
          currentState,
          desiredState,
          ["SnapshotName", "ClusterName", "KmsKeyId"],
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
      description: "Delete a MemoryDB Snapshot",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the MemoryDB Snapshot",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::MemoryDB::Snapshot",
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
      description: "Sync MemoryDB Snapshot state from AWS",
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
            "AWS::MemoryDB::Snapshot",
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
      description: "List MemoryDB Snapshot resources",
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
          "AWS::MemoryDB::Snapshot",
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
