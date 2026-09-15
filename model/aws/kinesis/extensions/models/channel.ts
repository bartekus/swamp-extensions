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

// Auto-generated extension model for @swamp/aws/kinesis/channel
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Kinesis Channel (AWS::Kinesis::Channel).
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

const DeadLetterQueueS3ConfigurationSchema = z.object({
  ErrorOutputPrefix: z.string().min(1).max(512).regex(
    new RegExp("^[0-9A-Za-z!\\-_'.*()\\/]+$"),
  ).describe(
    "Optional S3 key prefix under which error records are organized. When omitted, the service uses the default 'kinesis-channel/errors///'.",
  ).optional(),
  BucketARN: z.string().min(1).max(2048).regex(
    new RegExp("^arn:aws[-a-z0-9]*:s3:::[a-z0-9._-]{3,63}$"),
  ).describe("The ARN of the S3 bucket for storing failed records."),
  ExpectedBucketOwner: z.string().min(12).max(12).regex(new RegExp("^\\d{12}$"))
    .describe(
      "The AWS account ID of the expected owner of the dead-letter queue S3 bucket. Used to verify bucket ownership before delivery.",
    ),
});

const S3StorageConfigurationSchema = z.object({
  BucketARN: z.string().min(1).max(2048).regex(
    new RegExp("^arn:aws[-a-z0-9]*:s3:::[a-z0-9._-]{3,63}$"),
  ).describe(
    "The ARN of the S3 bucket for record delivery. Different channels can deliver to the same bucket. Buckets can be cross-account but must be in the same region as the channel.",
  ),
  StorageClass: z.enum(["STANDARD", "INTELLIGENT_TIERING", "GLACIER_IR"])
    .describe("The S3 storage class for delivered objects.").optional(),
  OutputKeyTemplate: z.string().min(1).max(1024).regex(
    new RegExp("^[0-9A-Za-z!\\-_'.*()\\/=:{}]+$"),
  ).describe(
    "Optional template for the S3 object key path. Supports placeholders in the form!{name}:!{channel-name},!{channel-id},!{stream-name},!{yyyy},!{yy},!{MM},!{dd},!{HH},!{mm}, and!{extension} (a literal file extension can be supplied as!{extension:.json.gz}). When omitted, the service uses the default 'kinesis-channel/!{channel-name}/!{channel-id}/!{yyyy}/!{MM}/!{dd}/!{HH}/!{channel-name}-!{channel-id}-!{yyyy}-!{MM}-!{dd}-!{HH}-!{mm}!{extension}'.",
  ).optional(),
  CompressionType: z.enum(["NONE", "GZIP", "ZSTD"]).describe(
    "The compression algorithm applied to delivered objects.",
  ),
  ExpectedBucketOwner: z.string().min(12).max(12).regex(new RegExp("^\\d{12}$"))
    .describe(
      "The AWS account ID of the expected owner of the destination S3 bucket. Used to verify bucket ownership before delivery.",
    ),
});

const CloudWatchLogsConfigurationSchema = z.object({
  LogStreamName: z.string().min(1).max(512).regex(new RegExp("^[^:*]+$"))
    .describe(
      "The CloudWatch log stream name. Defaults to the literal string 'DestinationDelivery' when omitted.",
    ).optional(),
  Enabled: z.boolean().describe("Whether CloudWatch Logs delivery is enabled."),
  LogGroupName: z.string().min(1).max(512).regex(
    new RegExp("^[\\.\\-_/#A-Za-z0-9]+$"),
  ).describe(
    "The CloudWatch log group name. When Enabled is true and LogGroupName is omitted, the service uses the default '/aws/kinesis//'.",
  ).optional(),
});

const RecordConfigurationSchema = z.object({
  GSRSchemaARN: z.string().min(1).max(512).regex(
    new RegExp(
      "^arn:aws[-a-z0-9]*:glue:[-a-z0-9]+:\\d{12}:schema/[-a-zA-Z0-9_$#.]+/[-a-zA-Z0-9_$#.]+$",
    ),
  ).describe(
    "The ARN of the AWS Glue Schema Registry (GSR) schema. Required for the S3 Tables destination, where it is used to create the S3 Table and to validate that the record format matches the table schema. Also used when RecordFormatType is GSR_JSON to interpret records read from the source stream. Vanilla S3 delivery writes records as S3 objects and does not need a schema. The schema must be in the same account and region as the channel.",
  ).optional(),
  RecordFormatType: z.enum(["GSR_JSON", "JSON", "STRING", "BYTE_ARRAY"])
    .describe(
      "The format used to interpret records read from the source stream.",
    ),
});

const StreamConfigurationSchema = z.object({
  RecordConfiguration: RecordConfigurationSchema.describe(
    "The configuration that describes how records on the source stream are encoded.",
  ),
  StreamARN: z.string().min(1).max(2048).regex(
    new RegExp("^arn:aws.*:kinesis:.*:\\d{12}:stream/\\S+"),
  ).describe(
    "The Amazon resource name (ARN) of the Kinesis data stream that the channel reads from.",
  ),
});

const PartitionFieldSchema = z.object({
  SourceName: z.string().min(1).max(255).regex(new RegExp("^[a-zA-Z0-9._]+$"))
    .describe(
      "The name of the source column on which the transform is applied.",
    ),
  Transform: z.enum(["TIME_HOUR"]).describe(
    "The partitioning transform applied to the SourceName column.",
  ),
});

const PartitionSpecSchema = z.object({
  PartitionFields: z.array(PartitionFieldSchema).describe(
    "List of partition fields that define how records are partitioned when written to the destination table.",
  ),
});

const S3TableConfigurationSchema = z.object({
  TableBucketARN: z.string().min(1).max(2048).regex(
    new RegExp(
      "^arn:aws[-a-z0-9]*:s3tables:[-a-z0-9]+:[0-9]{12}:bucket/[a-z0-9_-]{3,63}$",
    ),
  ).describe(
    "The ARN of the S3 Tables table bucket for record delivery. Buckets can be cross-account but must be in the same region as the channel.",
  ),
  TableName: z.string().min(1).max(255).regex(new RegExp("^[0-9a-z_]+$"))
    .describe(
      "The name of the destination S3 Tables table. The table is created for the customer if it does not yet exist.",
    ),
  CompressionType: z.enum(["NONE", "ZSTD", "SNAPPY"]).describe(
    "The compression algorithm applied to objects delivered to the S3 Tables destination.",
  ),
  PartitionSpec: PartitionSpecSchema.describe(
    "The partition specification used by the destination Iceberg table.",
  ).optional(),
  Namespace: z.string().min(1).max(255).regex(new RegExp("^[0-9a-z_]+$"))
    .describe(
      "The name of the S3 Tables namespace that contains the destination table.",
    ),
});

const TagSchema = z.object({
  Value: z.string().min(0).max(255).describe(
    "The value for the tag. You can specify a value that is 0 to 255 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ),
  Key: z.string().min(1).max(128).describe(
    "The key name of the tag. You can specify a value that is 1 to 128 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
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
  ChannelName: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_.-]+$"))
    .describe(
      "The name of the channel. The name's uniqueness is scoped per AWS account and region.",
    ),
  EncryptionConfiguration: z.object({
    EncryptionType: z.enum(["KMS"]).describe(
      "The encryption type. KMS is the only supported value.",
    ),
    KeyId: z.string().min(1).max(2048).describe(
      "The customer-managed AWS KMS key. Accepts a key GUID, key ARN, alias ARN, or alias name prefixed by 'alias/'. The Kinesis Data Streams managed alias 'aws/kinesis' is not accepted - the key must be customer-owned so it can also be used by readers of the destination.",
    ),
  }).describe("Server-side encryption configuration for data at rest.")
    .optional(),
  S3DestinationConfiguration: z.object({
    DeadLetterQueueS3Configuration: DeadLetterQueueS3ConfigurationSchema
      .describe(
        "Optional dead-letter queue (DLQ) configuration for records that cannot be delivered to the destination. When omitted, the service auto-fills using the storage BucketARN with an error prefix.",
      ).optional(),
    DataFreshnessInSeconds: z.number().int().describe(
      "The maximum time in seconds the channel buffers records before delivery if the minimum target file size is not reached.",
    ).optional(),
    StorageConfiguration: S3StorageConfigurationSchema.describe(
      "S3 storage configuration including the destination bucket, output key template, storage class, and compression type.",
    ),
  }).describe(
    "Configuration for delivery to a vanilla S3 bucket destination. Exactly one of S3DestinationConfiguration and S3TablesDestinationConfiguration must be specified.",
  ).optional(),
  LoggingConfiguration: z.object({
    CloudWatchLogs: CloudWatchLogsConfigurationSchema.describe(
      "CloudWatch Logs configuration block. When provided, controls whether and where the channel writes operational logs.",
    ),
  }).describe(
    "Configuration for delivering channel operational logs. Defaults to CloudWatch Logs disabled.",
  ).optional(),
  StreamConfigurationList: z.array(StreamConfigurationSchema).describe(
    "List of stream configurations associated with the channel. v1 supports a single element; the list shape allows future extensibility to fan in from multiple streams.",
  ),
  ServiceExecutionRoleARN: z.string().min(1).max(512).regex(
    new RegExp("^arn:aws[-a-z0-9]*:iam::\\d{12}:role/[a-zA-Z_0-9+=,.@\\-_/]+$"),
  ).describe(
    "The ARN of the IAM role that the channel assumes to read from the source stream, deliver records to the destination, and (when enabled) write CloudWatch Logs.",
  ),
  S3TablesDestinationConfiguration: z.object({
    S3TablesConfigurationList: z.array(S3TableConfigurationSchema).describe(
      "The list of S3 Tables destinations. v1 supports a single element; the list shape allows future extensibility to fan out to multiple tables.",
    ),
    DeadLetterQueueS3Configuration: DeadLetterQueueS3ConfigurationSchema
      .describe(
        "The dead-letter queue (DLQ) configuration for records that cannot be delivered to the S3 Tables destination. Required for S3 Tables: there is no safe fallback because S3 Tables metadata writes are critical-path.",
      ),
    DataFreshnessInSeconds: z.number().int().describe(
      "The maximum time in seconds the channel buffers records before delivery if the minimum target file size is not reached.",
    ).optional(),
  }).describe(
    "Configuration for delivery to S3 Tables destinations. Exactly one of S3DestinationConfiguration and S3TablesDestinationConfiguration must be specified.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An arbitrary set of tags (key-value pairs) to associate with the Kinesis channel.",
  ).optional(),
});

const StateSchema = z.object({
  ChannelARN: z.string(),
  ChannelCreationTimestamp: z.string().optional(),
  ChannelName: z.string().optional(),
  EncryptionConfiguration: z.object({
    EncryptionType: z.string(),
    KeyId: z.string(),
  }).optional(),
  S3DestinationConfiguration: z.object({
    DeadLetterQueueS3Configuration: DeadLetterQueueS3ConfigurationSchema,
    DataFreshnessInSeconds: z.number(),
    StorageConfiguration: S3StorageConfigurationSchema,
  }).optional(),
  LoggingConfiguration: z.object({
    CloudWatchLogs: CloudWatchLogsConfigurationSchema,
  }).optional(),
  StreamConfigurationList: z.array(StreamConfigurationSchema).optional(),
  ServiceExecutionRoleARN: z.string().optional(),
  S3TablesDestinationConfiguration: z.object({
    S3TablesConfigurationList: z.array(S3TableConfigurationSchema),
    DeadLetterQueueS3Configuration: DeadLetterQueueS3ConfigurationSchema,
    DataFreshnessInSeconds: z.number(),
  }).optional(),
  ChannelStatus: z.string().optional(),
  ChannelId: z.string().optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  ChannelName: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_.-]+$"))
    .describe(
      "The name of the channel. The name's uniqueness is scoped per AWS account and region.",
    ).optional(),
  EncryptionConfiguration: z.object({
    EncryptionType: z.enum(["KMS"]).describe(
      "The encryption type. KMS is the only supported value.",
    ).optional(),
    KeyId: z.string().min(1).max(2048).describe(
      "The customer-managed AWS KMS key. Accepts a key GUID, key ARN, alias ARN, or alias name prefixed by 'alias/'. The Kinesis Data Streams managed alias 'aws/kinesis' is not accepted - the key must be customer-owned so it can also be used by readers of the destination.",
    ).optional(),
  }).describe("Server-side encryption configuration for data at rest.")
    .optional(),
  S3DestinationConfiguration: z.object({
    DeadLetterQueueS3Configuration: DeadLetterQueueS3ConfigurationSchema
      .describe(
        "Optional dead-letter queue (DLQ) configuration for records that cannot be delivered to the destination. When omitted, the service auto-fills using the storage BucketARN with an error prefix.",
      ).optional(),
    DataFreshnessInSeconds: z.number().int().describe(
      "The maximum time in seconds the channel buffers records before delivery if the minimum target file size is not reached.",
    ).optional(),
    StorageConfiguration: S3StorageConfigurationSchema.describe(
      "S3 storage configuration including the destination bucket, output key template, storage class, and compression type.",
    ).optional(),
  }).describe(
    "Configuration for delivery to a vanilla S3 bucket destination. Exactly one of S3DestinationConfiguration and S3TablesDestinationConfiguration must be specified.",
  ).optional(),
  LoggingConfiguration: z.object({
    CloudWatchLogs: CloudWatchLogsConfigurationSchema.describe(
      "CloudWatch Logs configuration block. When provided, controls whether and where the channel writes operational logs.",
    ).optional(),
  }).describe(
    "Configuration for delivering channel operational logs. Defaults to CloudWatch Logs disabled.",
  ).optional(),
  StreamConfigurationList: z.array(StreamConfigurationSchema).describe(
    "List of stream configurations associated with the channel. v1 supports a single element; the list shape allows future extensibility to fan in from multiple streams.",
  ).optional(),
  ServiceExecutionRoleARN: z.string().min(1).max(512).regex(
    new RegExp("^arn:aws[-a-z0-9]*:iam::\\d{12}:role/[a-zA-Z_0-9+=,.@\\-_/]+$"),
  ).describe(
    "The ARN of the IAM role that the channel assumes to read from the source stream, deliver records to the destination, and (when enabled) write CloudWatch Logs.",
  ).optional(),
  S3TablesDestinationConfiguration: z.object({
    S3TablesConfigurationList: z.array(S3TableConfigurationSchema).describe(
      "The list of S3 Tables destinations. v1 supports a single element; the list shape allows future extensibility to fan out to multiple tables.",
    ).optional(),
    DeadLetterQueueS3Configuration: DeadLetterQueueS3ConfigurationSchema
      .describe(
        "The dead-letter queue (DLQ) configuration for records that cannot be delivered to the S3 Tables destination. Required for S3 Tables: there is no safe fallback because S3 Tables metadata writes are critical-path.",
      ).optional(),
    DataFreshnessInSeconds: z.number().int().describe(
      "The maximum time in seconds the channel buffers records before delivery if the minimum target file size is not reached.",
    ).optional(),
  }).describe(
    "Configuration for delivery to S3 Tables destinations. Exactly one of S3DestinationConfiguration and S3TablesDestinationConfiguration must be specified.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An arbitrary set of tags (key-value pairs) to associate with the Kinesis channel.",
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

/** Swamp extension model for Kinesis Channel. Registered at `@swamp/aws/kinesis/channel`. */
export const model = {
  type: "@swamp/aws/kinesis/channel",
  version: "2026.09.15.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Kinesis Channel resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Kinesis Channel",
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
          "AWS::Kinesis::Channel",
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
      description: "Get a Kinesis Channel",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Kinesis Channel",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Kinesis::Channel",
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
      description: "Update a Kinesis Channel",
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
        const identifier = existing.ChannelARN?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::Kinesis::Channel",
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
          "AWS::Kinesis::Channel",
          identifier,
          currentState,
          desiredState,
          [
            "ChannelName",
            "ServiceExecutionRoleARN",
            "StreamConfigurationList",
            "EncryptionConfiguration",
            "StorageConfiguration",
            "DeadLetterQueueS3Configuration",
            "S3TablesConfigurationList",
            "DeadLetterQueueS3Configuration",
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
      description: "Delete a Kinesis Channel",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Kinesis Channel",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Kinesis::Channel",
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
      description: "Sync Kinesis Channel state from AWS",
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
        const identifier = existing.ChannelARN?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::Kinesis::Channel",
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
      description: "List Kinesis Channel resources",
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
          "AWS::Kinesis::Channel",
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
            (item.properties?.ChannelARN?.toString() ?? item.identifier)
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
