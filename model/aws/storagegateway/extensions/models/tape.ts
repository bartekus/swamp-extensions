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

// Auto-generated extension model for @swamp/aws/storagegateway/tape
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for StorageGateway Tape (AWS::StorageGateway::Tape).
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
  Key: z.string().min(1).max(128).regex(
    new RegExp("^([\\p{L}\\p{Z}\\p{N}_.:/=+\\-@]*)$", "u"),
  ).describe("The tag key. Cannot be prefixed with aws:."),
  Value: z.string().min(0).max(256).describe("The tag value."),
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
  GatewayARN: z.string().min(50).max(500).describe(
    "The Amazon Resource Name (ARN) of the Tape Gateway that hosts the virtual tape.",
  ),
  TapeBarcode: z.string().min(5).max(16).regex(new RegExp("^[A-Z0-9]*$"))
    .describe(
      "The barcode that you want to assign to the virtual tape. Barcodes cannot be reused, even after a tape is deleted.",
    ).optional(),
  TapeSizeInBytes: z.number().min(1).describe(
    "The size, in bytes, of the virtual tape that you want to create.",
  ),
  KMSEncrypted: z.boolean().describe(
    "Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional.",
  ).optional(),
  KMSKey: z.string().min(7).max(2048).regex(
    new RegExp(
      "^(^arn:(aws(|-cn|-us-gov|-iso[A-Za-z0-9_-]*|-eusc)):kms:([a-zA-Z0-9-]+):([0-9]+):(key|alias)/(\\S+)$)|(^alias/(\\S+)$)$",
    ),
  ).describe(
    "The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. This value must be set if KMSEncrypted is true.",
  ).optional(),
  PoolId: z.string().min(1).max(100).describe(
    "The ID of the pool that you want to add your tape to for archiving. Tapes in this pool are archived in the S3 storage class that is associated with the pool.",
  ).optional(),
  Worm: z.boolean().describe(
    "Set to true to create a write-once-read-many (WORM) virtual tape.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "A list of up to 50 tags to assign to the virtual tape.",
  ).optional(),
});

const StateSchema = z.object({
  TapeARN: z.string(),
  GatewayARN: z.string().optional(),
  TapeBarcode: z.string().optional(),
  TapeSizeInBytes: z.number().optional(),
  KMSEncrypted: z.boolean().optional(),
  KMSKey: z.string().optional(),
  PoolId: z.string().optional(),
  Worm: z.boolean().optional(),
  TapeStatus: z.string().optional(),
  TapeCreatedDate: z.string().optional(),
  TapeUsedInBytes: z.number().optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  GatewayARN: z.string().min(50).max(500).describe(
    "The Amazon Resource Name (ARN) of the Tape Gateway that hosts the virtual tape.",
  ).optional(),
  TapeBarcode: z.string().min(5).max(16).regex(new RegExp("^[A-Z0-9]*$"))
    .describe(
      "The barcode that you want to assign to the virtual tape. Barcodes cannot be reused, even after a tape is deleted.",
    ).optional(),
  TapeSizeInBytes: z.number().min(1).describe(
    "The size, in bytes, of the virtual tape that you want to create.",
  ).optional(),
  KMSEncrypted: z.boolean().describe(
    "Set to true to use Amazon S3 server-side encryption with your own KMS key, or false to use a key managed by Amazon S3. Optional.",
  ).optional(),
  KMSKey: z.string().min(7).max(2048).regex(
    new RegExp(
      "^(^arn:(aws(|-cn|-us-gov|-iso[A-Za-z0-9_-]*|-eusc)):kms:([a-zA-Z0-9-]+):([0-9]+):(key|alias)/(\\S+)$)|(^alias/(\\S+)$)$",
    ),
  ).describe(
    "The Amazon Resource Name (ARN) of a symmetric customer master key (CMK) used for Amazon S3 server-side encryption. This value must be set if KMSEncrypted is true.",
  ).optional(),
  PoolId: z.string().min(1).max(100).describe(
    "The ID of the pool that you want to add your tape to for archiving. Tapes in this pool are archived in the S3 storage class that is associated with the pool.",
  ).optional(),
  Worm: z.boolean().describe(
    "Set to true to create a write-once-read-many (WORM) virtual tape.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "A list of up to 50 tags to assign to the virtual tape.",
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

/** Swamp extension model for StorageGateway Tape. Registered at `@swamp/aws/storagegateway/tape`. */
export const model = {
  type: "@swamp/aws/storagegateway/tape",
  version: "2026.09.16.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "StorageGateway Tape resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a StorageGateway Tape",
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
          "AWS::StorageGateway::Tape",
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
      description: "Get a StorageGateway Tape",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the StorageGateway Tape",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::StorageGateway::Tape",
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
      description: "Update a StorageGateway Tape",
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
        const identifier = existing.TapeARN?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::StorageGateway::Tape",
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
          "AWS::StorageGateway::Tape",
          identifier,
          currentState,
          desiredState,
          [
            "GatewayARN",
            "TapeBarcode",
            "TapeSizeInBytes",
            "KMSEncrypted",
            "KMSKey",
            "PoolId",
            "Worm",
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
      description: "Delete a StorageGateway Tape",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the StorageGateway Tape",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::StorageGateway::Tape",
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
      description: "Sync StorageGateway Tape state from AWS",
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
        const identifier = existing.TapeARN?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::StorageGateway::Tape",
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
      description: "List StorageGateway Tape resources",
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
          "AWS::StorageGateway::Tape",
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
            (item.properties?.TapeARN?.toString() ?? item.identifier).replace(
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
