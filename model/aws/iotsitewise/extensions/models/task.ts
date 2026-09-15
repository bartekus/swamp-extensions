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

// Auto-generated extension model for @swamp/aws/iotsitewise/task
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for IoTSiteWise Task (AWS::IoTSiteWise::Task).
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

const EphemeralStorageConfigurationSchema = z.object({
  StorageClass: z.enum([
    "STANDARD_1",
    "STANDARD_2",
    "THROUGHPUT_1",
    "THROUGHPUT_2",
  ]).describe(
    "The storage type that determines I/O performance characteristics. Family name indicates workload pattern, level number indicates performance within that family.",
  ),
  StorageSizeInGiB: z.number().int().min(1).max(16384).describe(
    "Storage volume size in GiB.",
  ),
});

const S3AccessPointSourceSchema = z.object({
  AccessPointArn: z.string().min(4).max(128).regex(
    new RegExp(
      "^arn:aws(-cn|-us-gov)?:s3:[a-z0-9-]*:\\d{12}:accesspoint[/:][a-zA-Z0-9._-]+$",
    ),
  ).describe(
    "The Amazon Resource Name (ARN) of the Amazon S3 access point. The mount reads objects from the bucket associated with this access point. Access is governed by the access point policy and the task execution role's IAM permissions.",
  ),
  Prefix: z.string().min(1).max(1024).describe(
    "An object key name prefix. If specified, the mount includes only objects whose keys begin with this prefix. To include all objects at the access point, omit this field.",
  ).optional(),
});

const MountSourceSchema = z.object({
  S3AccessPoint: S3AccessPointSourceSchema.describe(
    "Configures a mount that reads from an Amazon S3 access point.",
  ),
});

const MountSchema = z.object({
  Name: z.string().min(1).max(64).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .describe("A unique name for the mount within the task."),
  RelativePath: z.string().min(1).max(1024).regex(
    new RegExp(
      "^((?!.*(^|/)\\.\\.?(/|$))(?!.*//)[a-zA-Z0-9._-][a-zA-Z0-9._/-]*[a-zA-Z0-9._-]|[a-zA-Z0-9_-])$",
    ),
  ).describe(
    "The relative path under the service-owned mount root where this mount is attached inside the container.",
  ),
  Source: MountSourceSchema.describe(
    "The data source configuration for a mount.",
  ),
  StorageType: z.enum(["SHARED_STORAGE"]).describe(
    "The type of storage used for the mount inside the container.",
  ),
});

const ContainerTaskConfigurationSchema = z.object({
  EcrUri: z.string().min(1).max(1024).regex(
    new RegExp(
      "^((\\d{12}\\.dkr\\.ecr\\.[a-z0-9-]+\\.[a-z.]+)|public\\.ecr\\.aws/[a-z][a-z0-9]+([._-][a-z0-9]+)*)/[a-z0-9]+((\\.||__|__|-+)[a-z0-9]+)*(/[a-z0-9]+((\\.||__|__|-+)[a-z0-9]+)*)*(:[a-zA-Z0-9._-]+|@sha256:[a-f0-9]{64})?$",
    ),
  ).describe("The Amazon ECR image URI for the task container."),
  TaskExecutionRole: z.string().min(20).max(2048).regex(
    new RegExp("^arn:[\\w+=\\/,.@-]+:iam::[0-9]+:role/[\\w+=,.@/-]+$"),
  ).describe(
    "The ARN of the IAM role that grants the containerized workload permissions to access AWS resources.",
  ),
  ProcessingType: z.enum([
    "GENERIC_COMPUTE_PROCESSING",
    "HARDWARE_ACCELERATED_PROCESSING",
  ]).describe("The processing type for compute resources."),
  ProcessingUnit: z.enum([
    "UNITS_2",
    "UNITS_4",
    "UNITS_8",
    "UNITS_12",
    "UNITS_16",
    "UNITS_24",
    "UNITS_32",
    "UNITS_36",
    "UNITS_48",
    "UNITS_60",
    "UNITS_64",
    "UNITS_72",
    "UNITS_84",
    "UNITS_96",
  ]).describe(
    "The processing unit allocation that determines vCPU, memory, and GPU resources.",
  ),
  Command: z.array(z.string()).describe(
    "The command to execute in the container.",
  ).optional(),
  TimeoutSeconds: z.number().int().min(60).max(86400).describe(
    "The timeout in seconds for task execution. Default: 3600 (1 hour).",
  ).optional(),
  EnvironmentVariables: z.record(z.string(), z.string().max(2048)).describe(
    "A map of environment variable key-value pairs.",
  ).optional(),
  EphemeralStorageConfiguration: EphemeralStorageConfigurationSchema.describe(
    "Configuration for ephemeral storage attached to the container task.",
  ).optional(),
  Mounts: z.array(MountSchema).describe(
    "Mounts attached to the container filesystem. Each mount exposes an external data source as a local directory inside the container.",
  ).optional(),
});

const TagSchema = z.object({
  Key: z.string().min(1).max(128).describe("The key name of the tag."),
  Value: z.string().min(0).max(256).describe("The value for the tag."),
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
  WorkspaceName: z.string().min(1).max(128).regex(
    new RegExp("^[a-zA-Z0-9_-]+$"),
  ).describe("The name of the workspace."),
  TaskName: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .describe("The name of the task. Must be unique within the workspace."),
  Description: z.string().min(0).max(2048).describe(
    "A description of the task.",
  ).optional(),
  TaskConfiguration: z.object({
    ContainerTaskConfiguration: ContainerTaskConfigurationSchema.describe(
      "Configuration for running a custom container image on managed compute.",
    ),
  }).describe("The task execution configuration."),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this resource.",
  ).optional(),
});

const StateSchema = z.object({
  WorkspaceName: z.string().optional(),
  TaskName: z.string().optional(),
  TaskArn: z.string(),
  Description: z.string().optional(),
  TaskConfiguration: z.object({
    ContainerTaskConfiguration: ContainerTaskConfigurationSchema,
  }).optional(),
  Status: z.string().optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  WorkspaceName: z.string().min(1).max(128).regex(
    new RegExp("^[a-zA-Z0-9_-]+$"),
  ).describe("The name of the workspace.").optional(),
  TaskName: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .describe("The name of the task. Must be unique within the workspace.")
    .optional(),
  Description: z.string().min(0).max(2048).describe(
    "A description of the task.",
  ).optional(),
  TaskConfiguration: z.object({
    ContainerTaskConfiguration: ContainerTaskConfigurationSchema.describe(
      "Configuration for running a custom container image on managed compute.",
    ).optional(),
  }).describe("The task execution configuration.").optional(),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this resource.",
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

/** Swamp extension model for IoTSiteWise Task. Registered at `@swamp/aws/iotsitewise/task`. */
export const model = {
  type: "@swamp/aws/iotsitewise/task",
  version: "2026.09.15.1",
  upgrades: [
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
      description: "IoTSiteWise Task resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a IoTSiteWise Task",
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
          "AWS::IoTSiteWise::Task",
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
      description: "Get a IoTSiteWise Task",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the IoTSiteWise Task",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::IoTSiteWise::Task",
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
      description: "Update a IoTSiteWise Task",
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
        const identifier = existing.TaskArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::IoTSiteWise::Task",
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
          "AWS::IoTSiteWise::Task",
          identifier,
          currentState,
          desiredState,
          ["WorkspaceName", "TaskName"],
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
      description: "Delete a IoTSiteWise Task",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the IoTSiteWise Task",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::IoTSiteWise::Task",
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
      description: "Sync IoTSiteWise Task state from AWS",
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
        const identifier = existing.TaskArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::IoTSiteWise::Task",
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
      description: "List IoTSiteWise Task resources",
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
          "AWS::IoTSiteWise::Task",
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
            (item.properties?.TaskArn?.toString() ?? item.identifier).replace(
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
