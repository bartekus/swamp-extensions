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

// Auto-generated extension model for @swamp/aws/pcs/compute-node-group
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for PCS ComputeNodeGroup (AWS::PCS::ComputeNodeGroup).
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

const SlurmCustomSettingSchema = z.object({
  ParameterValue: z.string().describe(
    "The value for the configured Slurm setting.",
  ),
  ParameterName: z.string().describe(
    "AWS PCS supports configuration of the following Slurm parameters for compute node groups: Weight and RealMemory.",
  ),
});

const ScriptSourceSchema = z.object({
  Checksum: z.string().min(64).max(64).regex(new RegExp("^[a-fA-F0-9]{64}$"))
    .describe(
      "A 64-character hexadecimal SHA-256 digest used to verify script integrity.",
    ).optional(),
  S3VersionId: z.string().max(1024).describe(
    "The S3 object version ID of the script, when stored in a versioned bucket.",
  ).optional(),
  ScriptLocation: z.string().min(1).max(1024).regex(
    new RegExp("^(s3://[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]/.+|https://.+)$"),
  ).describe("The S3 URI or HTTPS URL where the script is stored."),
});

const NodeLifecycleScriptSchema = z.object({
  ExecutionPolicy: z.enum(["FIRST_BOOT_ONLY", "EVERY_BOOT"]).describe(
    "Whether the script runs only on the node's first boot (FIRST_BOOT_ONLY) or on every boot including reboots (EVERY_BOOT). Defaults to FIRST_BOOT_ONLY.",
  ).optional(),
  Arguments: z.array(z.string().max(256)).describe(
    "An ordered list of arguments passed to the script.",
  ).optional(),
  OnError: z.enum(["TERMINATE", "STOP_SEQUENCE", "CONTINUE"]).describe(
    "The behavior when the script exits with an error. Defaults to TERMINATE.",
  ).optional(),
  ScriptSource: ScriptSourceSchema.describe(
    "The external location of a lifecycle script.",
  ),
  Name: z.string().min(1).max(64).regex(
    new RegExp("^[A-Za-z0-9][A-Za-z0-9 _-]*$"),
  ).describe("A human-readable name that identifies the script."),
});

const NodeLifecycleStagesSchema = z.object({
  NodeBootstrapped: z.array(NodeLifecycleScriptSchema).describe(
    "Scripts to run after the node is bootstrapped, once the PCS configuration phase completes and before slurmd starts.",
  ).optional(),
  NodeReady: z.array(NodeLifecycleScriptSchema).describe(
    "Scripts to execute when the node becomes ready (every boot).",
  ).optional(),
});

const InstanceConfigSchema = z.object({
  InstanceType: z.string().describe(
    "The EC2 instance type that AWS PCS can provision in the compute node group.",
  ).optional(),
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
  ClusterId: z.string().describe(
    "The ID of the cluster of the compute node group.",
  ),
  SpotOptions: z.object({
    AllocationStrategy: z.enum([
      "lowest-price",
      "capacity-optimized",
      "price-capacity-optimized",
    ]).describe(
      "The Amazon EC2 allocation strategy AWS PCS uses to provision EC2 instances. AWS PCS supports lowest price, capacity optimized, and price capacity optimized. If you don't provide this option, it defaults to price capacity optimized.",
    ).optional(),
  }).describe(
    "Additional configuration when you specify SPOT as the purchase option.",
  ).optional(),
  SlurmConfiguration: z.object({
    GresCustomSettings: z.array(z.record(z.string(), z.string())).describe(
      "Additional Slurm gres.conf records for the compute node group. Each item is a map of gres.conf attribute names to values describing one gres.conf record (for example a GPU topology, MIG, MPS, or custom GRES entry). AWS PCS adds the NodeName= prefix and merges these records with the GPU record it derives from the instance type.",
    ).optional(),
    ScaleDownIdleTimeInSeconds: z.number().int().min(1).max(10000000).describe(
      "The time before an idle node is scaled down.",
    ).optional(),
    SlurmCustomSettings: z.array(SlurmCustomSettingSchema).describe(
      "Additional Slurm-specific configuration that directly maps to Slurm settings.",
    ).optional(),
  }).describe("Additional options related to the Slurm scheduler.").optional(),
  SubnetIds: z.array(z.string()).describe(
    "The list of subnet IDs where instances are provisioned by the compute node group. The subnets must be in the same VPC as the cluster.",
  ),
  Name: z.string().describe("The name that identifies the compute node group.")
    .optional(),
  NodeLifecycleActions: z.object({
    ScriptCachingPolicy: z.enum(["CACHE_ONCE", "REFRESH_ON_REBOOT"]).describe(
      "Controls whether lifecycle scripts are downloaded once at first boot (CACHE_ONCE) or re-downloaded on every reboot (REFRESH_ON_REBOOT). Defaults to CACHE_ONCE.",
    ).optional(),
    Stages: NodeLifecycleStagesSchema.describe(
      "The ordered scripts to run at each compute node lifecycle stage.",
    ),
  }).describe(
    "Custom scripts that run at defined points in a compute node's lifecycle.",
  ).optional(),
  ScalingConfiguration: z.object({
    MaxInstanceCount: z.number().int().min(0).describe(
      "The upper bound of the number of instances allowed in the compute fleet.",
    ),
    MinInstanceCount: z.number().int().min(0).describe(
      "The lower bound of the number of instances allowed in the compute fleet.",
    ),
  }).describe(
    "Specifies the boundaries of the compute node group auto scaling.",
  ),
  InstanceConfigs: z.array(InstanceConfigSchema).describe(
    "A list of EC2 instance configurations that AWS PCS can provision in the compute node group.",
  ),
  PurchaseOption: z.enum([
    "ONDEMAND",
    "SPOT",
    "CAPACITY_BLOCK",
    "INTERRUPTIBLE_CAPACITY_RESERVATION",
  ]).describe(
    "Specifies how EC2 instances are purchased on your behalf. AWS PCS supports On-Demand, Spot, Capacity Block, and Interruptible Capacity Reservation instances. For more information, see Instance purchasing options in the Amazon Elastic Compute Cloud User Guide. If you don't provide this option, it defaults to On-Demand.",
  ).optional(),
  CustomLaunchTemplate: z.object({
    Version: z.string().describe(
      "The version of the EC2 launch template to use to provision instances.",
    ),
    TemplateId: z.string().describe(
      "The ID of the EC2 launch template to use to provision instances.",
    ).optional(),
  }).describe(
    "An Amazon EC2 launch template AWS PCS uses to launch compute nodes.",
  ),
  AmiId: z.string().regex(new RegExp("^ami-[a-z0-9]+$")).describe(
    "The ID of the Amazon Machine Image (AMI) that AWS PCS uses to launch instances. If not provided, AWS PCS uses the AMI ID specified in the custom launch template.",
  ).optional(),
  IamInstanceProfileArn: z.string().regex(
    new RegExp(
      "^arn:aws([a-zA-Z-]{0,10})?:iam::[0-9]{12}:instance-profile/.{1,128}$",
    ),
  ).describe(
    "The Amazon Resource Name (ARN) of the IAM instance profile used to pass an IAM role when launching EC2 instances. The role contained in your instance profile must have pcs:RegisterComputeNodeGroupInstance permissions attached to provision instances correctly.",
  ),
});

const StateSchema = z.object({
  Status: z.string().optional(),
  ClusterId: z.string().optional(),
  ErrorInfo: z.array(z.object({
    Message: z.string(),
    Code: z.string(),
  })).optional(),
  SpotOptions: z.object({
    AllocationStrategy: z.string(),
  }).optional(),
  SlurmConfiguration: z.object({
    GresCustomSettings: z.array(z.record(z.string(), z.unknown())),
    ScaleDownIdleTimeInSeconds: z.number(),
    SlurmCustomSettings: z.array(SlurmCustomSettingSchema),
  }).optional(),
  SubnetIds: z.array(z.string()).optional(),
  Name: z.string().optional(),
  NodeLifecycleActions: z.object({
    ScriptCachingPolicy: z.string(),
    Stages: NodeLifecycleStagesSchema,
  }).optional(),
  ScalingConfiguration: z.object({
    MaxInstanceCount: z.number(),
    MinInstanceCount: z.number(),
  }).optional(),
  InstanceConfigs: z.array(InstanceConfigSchema).optional(),
  Id: z.string().optional(),
  PurchaseOption: z.string().optional(),
  Arn: z.string(),
  CustomLaunchTemplate: z.object({
    Version: z.string(),
    TemplateId: z.string(),
  }).optional(),
  AmiId: z.string().optional(),
  IamInstanceProfileArn: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  ClusterId: z.string().describe(
    "The ID of the cluster of the compute node group.",
  ).optional(),
  SpotOptions: z.object({
    AllocationStrategy: z.enum([
      "lowest-price",
      "capacity-optimized",
      "price-capacity-optimized",
    ]).describe(
      "The Amazon EC2 allocation strategy AWS PCS uses to provision EC2 instances. AWS PCS supports lowest price, capacity optimized, and price capacity optimized. If you don't provide this option, it defaults to price capacity optimized.",
    ).optional(),
  }).describe(
    "Additional configuration when you specify SPOT as the purchase option.",
  ).optional(),
  SlurmConfiguration: z.object({
    GresCustomSettings: z.array(z.record(z.string(), z.string())).describe(
      "Additional Slurm gres.conf records for the compute node group. Each item is a map of gres.conf attribute names to values describing one gres.conf record (for example a GPU topology, MIG, MPS, or custom GRES entry). AWS PCS adds the NodeName= prefix and merges these records with the GPU record it derives from the instance type.",
    ).optional(),
    ScaleDownIdleTimeInSeconds: z.number().int().min(1).max(10000000).describe(
      "The time before an idle node is scaled down.",
    ).optional(),
    SlurmCustomSettings: z.array(SlurmCustomSettingSchema).describe(
      "Additional Slurm-specific configuration that directly maps to Slurm settings.",
    ).optional(),
  }).describe("Additional options related to the Slurm scheduler.").optional(),
  SubnetIds: z.array(z.string()).describe(
    "The list of subnet IDs where instances are provisioned by the compute node group. The subnets must be in the same VPC as the cluster.",
  ).optional(),
  Name: z.string().describe("The name that identifies the compute node group.")
    .optional(),
  NodeLifecycleActions: z.object({
    ScriptCachingPolicy: z.enum(["CACHE_ONCE", "REFRESH_ON_REBOOT"]).describe(
      "Controls whether lifecycle scripts are downloaded once at first boot (CACHE_ONCE) or re-downloaded on every reboot (REFRESH_ON_REBOOT). Defaults to CACHE_ONCE.",
    ).optional(),
    Stages: NodeLifecycleStagesSchema.describe(
      "The ordered scripts to run at each compute node lifecycle stage.",
    ).optional(),
  }).describe(
    "Custom scripts that run at defined points in a compute node's lifecycle.",
  ).optional(),
  ScalingConfiguration: z.object({
    MaxInstanceCount: z.number().int().min(0).describe(
      "The upper bound of the number of instances allowed in the compute fleet.",
    ).optional(),
    MinInstanceCount: z.number().int().min(0).describe(
      "The lower bound of the number of instances allowed in the compute fleet.",
    ).optional(),
  }).describe(
    "Specifies the boundaries of the compute node group auto scaling.",
  ).optional(),
  InstanceConfigs: z.array(InstanceConfigSchema).describe(
    "A list of EC2 instance configurations that AWS PCS can provision in the compute node group.",
  ).optional(),
  PurchaseOption: z.enum([
    "ONDEMAND",
    "SPOT",
    "CAPACITY_BLOCK",
    "INTERRUPTIBLE_CAPACITY_RESERVATION",
  ]).describe(
    "Specifies how EC2 instances are purchased on your behalf. AWS PCS supports On-Demand, Spot, Capacity Block, and Interruptible Capacity Reservation instances. For more information, see Instance purchasing options in the Amazon Elastic Compute Cloud User Guide. If you don't provide this option, it defaults to On-Demand.",
  ).optional(),
  CustomLaunchTemplate: z.object({
    Version: z.string().describe(
      "The version of the EC2 launch template to use to provision instances.",
    ).optional(),
    TemplateId: z.string().describe(
      "The ID of the EC2 launch template to use to provision instances.",
    ).optional(),
  }).describe(
    "An Amazon EC2 launch template AWS PCS uses to launch compute nodes.",
  ).optional(),
  AmiId: z.string().regex(new RegExp("^ami-[a-z0-9]+$")).describe(
    "The ID of the Amazon Machine Image (AMI) that AWS PCS uses to launch instances. If not provided, AWS PCS uses the AMI ID specified in the custom launch template.",
  ).optional(),
  IamInstanceProfileArn: z.string().regex(
    new RegExp(
      "^arn:aws([a-zA-Z-]{0,10})?:iam::[0-9]{12}:instance-profile/.{1,128}$",
    ),
  ).describe(
    "The Amazon Resource Name (ARN) of the IAM instance profile used to pass an IAM role when launching EC2 instances. The role contained in your instance profile must have pcs:RegisterComputeNodeGroupInstance permissions attached to provision instances correctly.",
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

/** Swamp extension model for PCS ComputeNodeGroup. Registered at `@swamp/aws/pcs/compute-node-group`. */
export const model = {
  type: "@swamp/aws/pcs/compute-node-group",
  version: "2026.09.11.1",
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
      toVersion: "2026.05.15.1",
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
      toVersion: "2026.07.24.1",
      description: "Added: NodeLifecycleActions",
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
      toVersion: "2026.09.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "PCS ComputeNodeGroup resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a PCS ComputeNodeGroup",
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
          "AWS::PCS::ComputeNodeGroup",
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
      description: "Get a PCS ComputeNodeGroup",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the PCS ComputeNodeGroup",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::PCS::ComputeNodeGroup",
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
      description: "Update a PCS ComputeNodeGroup",
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
          "AWS::PCS::ComputeNodeGroup",
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
          "AWS::PCS::ComputeNodeGroup",
          identifier,
          currentState,
          desiredState,
          ["Name", "ClusterId", "InstanceConfigs"],
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
      description: "Delete a PCS ComputeNodeGroup",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the PCS ComputeNodeGroup",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::PCS::ComputeNodeGroup",
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
      description: "Sync PCS ComputeNodeGroup state from AWS",
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
            "AWS::PCS::ComputeNodeGroup",
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
      description: "List PCS ComputeNodeGroup resources",
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
          "AWS::PCS::ComputeNodeGroup",
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
