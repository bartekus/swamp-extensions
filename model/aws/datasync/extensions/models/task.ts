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

// Auto-generated extension model for @swamp/aws/datasync/task
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any no-control-regex

/**
 * Swamp extension model for DataSync Task (AWS::DataSync::Task).
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

const TaskReportConfigDestinationS3Schema = z.object({
  Subdirectory: z.string().max(4096).regex(
    new RegExp("^[a-zA-Z0-9_\\-\\+\\./\\(\\)\\p{Zs}]*$", "u"),
  ).describe("Specifies a bucket prefix for your report.").optional(),
  S3BucketArn: z.string().max(156).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):(s3|s3-outposts):[a-z\\-0-9]*:[0-9]*:.*$",
    ),
  ).describe(
    "Specifies the ARN of the S3 bucket where Datasync uploads your report.",
  ).optional(),
  BucketAccessRoleArn: z.string().max(2048).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):iam::[0-9]{12}:role/.*$",
    ),
  ).describe(
    "Specifies the Amazon Resource Name (ARN) of the IAM policy that allows Datasync to upload a task report to your S3 bucket.",
  ).optional(),
});

const FilterRuleSchema = z.object({
  FilterType: z.enum(["SIMPLE_PATTERN"]).describe(
    "The type of filter rule to apply. AWS DataSync only supports the SIMPLE_PATTERN rule type.",
  ).optional(),
  Value: z.string().max(409600).regex(new RegExp("^[^\\x00]+$")).describe(
    'A single filter string that consists of the patterns to include or exclude. The patterns are delimited by "|".',
  ).optional(),
});

const ManifestConfigSourceS3Schema = z.object({
  S3BucketArn: z.string().max(156).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):(s3|s3-outposts):[a-z\\-0-9]*:[0-9]*:.*$",
    ),
  ).describe(
    "Specifies the Amazon Resource Name (ARN) of the S3 bucket where you're hosting your manifest.",
  ).optional(),
  BucketAccessRoleArn: z.string().max(2048).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):iam::[0-9]{12}:role/.*$",
    ),
  ).describe(
    "Specifies the AWS Identity and Access Management (IAM) role that allows DataSync to access your manifest.",
  ).optional(),
  ManifestObjectVersionId: z.string().max(100).regex(new RegExp("^.+$"))
    .describe(
      "Specifies the object version ID of the manifest that you want DataSync to use.",
    ).optional(),
  ManifestObjectPath: z.string().max(1024).regex(
    new RegExp("^[\\p{L}\\p{M}\\p{Z}\\p{S}\\p{N}\\p{P}\\p{C}]*$", "u"),
  ).describe("Specifies the Amazon S3 object key of your manifest.").optional(),
});

const TagSchema = z.object({
  Value: z.string().min(1).max(256).regex(
    new RegExp("^[a-zA-Z0-9\\s+=._:@/-]+$"),
  ).describe("The value for an AWS resource tag."),
  Key: z.string().min(1).max(256).regex(new RegExp("^[a-zA-Z0-9\\s+=._:/-]+$"))
    .describe("The key for an AWS resource tag."),
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
  DestinationLocationArn: z.string().max(128).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):datasync:[a-z\\-0-9]+:[0-9]{12}:location/loc-[0-9a-z]{17}$",
    ),
  ).describe("The ARN of an AWS storage resource's location."),
  Options: z.object({
    VerifyMode: z.enum([
      "POINT_IN_TIME_CONSISTENT",
      "ONLY_FILES_TRANSFERRED",
      "NONE",
    ]).describe(
      "A value that determines whether a data integrity verification should be performed at the end of a task execution after all data and metadata have been transferred.",
    ).optional(),
    Gid: z.enum(["NONE", "INT_VALUE", "NAME", "BOTH"]).describe(
      "The group ID (GID) of the file's owners.",
    ).optional(),
    Atime: z.enum(["NONE", "BEST_EFFORT"]).describe(
      "A file metadata value that shows the last time a file was accessed (that is, when the file was read or written to).",
    ).optional(),
    OverwriteMode: z.enum(["ALWAYS", "NEVER"]).describe(
      "A value that determines whether files at the destination should be overwritten or preserved when copying files.",
    ).optional(),
    PreserveDevices: z.enum(["NONE", "PRESERVE"]).describe(
      "A value that determines whether AWS DataSync should preserve the metadata of block and character devices in the source file system, and recreate the files with that device name and metadata on the destination.",
    ).optional(),
    Mtime: z.enum(["NONE", "PRESERVE"]).describe(
      "A value that indicates the last time that a file was modified (that is, a file was written to) before the PREPARING phase.",
    ).optional(),
    TaskQueueing: z.enum(["ENABLED", "DISABLED"]).describe(
      "A value that determines whether tasks should be queued before executing the tasks.",
    ).optional(),
    TransferMode: z.enum(["CHANGED", "ALL"]).describe(
      "A value that determines whether DataSync transfers only the data and metadata that differ between the source and the destination location, or whether DataSync transfers all the content from the source, without comparing to the destination location.",
    ).optional(),
    LogLevel: z.enum(["OFF", "BASIC", "TRANSFER"]).describe(
      "A value that determines the types of logs that DataSync publishes to a log stream in the Amazon CloudWatch log group that you provide.",
    ).optional(),
    ObjectTags: z.enum(["PRESERVE", "NONE"]).describe(
      "A value that determines whether object tags should be read from the source object store and written to the destination object store.",
    ).optional(),
    Uid: z.enum(["NONE", "INT_VALUE", "NAME", "BOTH"]).describe(
      "The user ID (UID) of the file's owner.",
    ).optional(),
    BytesPerSecond: z.number().int().min(-1).describe(
      "A value that limits the bandwidth used by AWS DataSync.",
    ).optional(),
    PosixPermissions: z.enum(["NONE", "PRESERVE"]).describe(
      "A value that determines which users or groups can access a file for a specific purpose such as reading, writing, or execution of the file.",
    ).optional(),
    PreserveDeletedFiles: z.enum(["PRESERVE", "REMOVE"]).describe(
      "A value that specifies whether files in the destination that don't exist in the source file system should be preserved.",
    ).optional(),
    SecurityDescriptorCopyFlags: z.enum([
      "NONE",
      "OWNER_DACL",
      "OWNER_DACL_SACL",
    ]).describe(
      "A value that determines which components of the SMB security descriptor are copied during transfer.",
    ).optional(),
    ObjectMetadata: z.enum(["PRESERVE", "NONE"]).describe(
      "A value that determines whether source object metadata should be copied to the destination. PRESERVE copies metadata; NONE copies only file-mtime.",
    ).optional(),
  }).describe(
    "Represents the options that are available to control the behavior of a StartTaskExecution operation.",
  ).optional(),
  TaskReportConfig: z.object({
    Destination: z.object({
      S3: TaskReportConfigDestinationS3Schema.describe(
        "Specifies the Amazon S3 bucket where DataSync uploads your task report.",
      ).optional(),
    }).describe("Specifies where DataSync uploads your task report."),
    ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
      "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
    ).optional(),
    ObjectVersionIds: z.enum(["INCLUDE", "NONE"]).describe(
      "Specifies whether your task report includes the new version of each object transferred into an S3 bucket, this only applies if you enable versioning on your bucket.",
    ).optional(),
    Overrides: z.object({
      Verified: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to verify at the end of your transfer. This only applies if you configure your task to verify data during and after the transfer (which Datasync does by default)",
      ).optional(),
      Skipped: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to skip during your transfer.",
      ).optional(),
      Transferred: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to transfer.",
      ).optional(),
      Deleted: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to delete in your destination location. This only applies if you configure your task to delete data in the destination that isn't in the source.",
      ).optional(),
    }).describe(
      "Customizes the reporting level for aspects of your task report. For example, your report might generally only include errors, but you could specify that you want a list of successes and errors just for the files that Datasync attempted to delete in your destination location.",
    ).optional(),
    OutputType: z.enum(["SUMMARY_ONLY", "STANDARD"]).describe(
      "Specifies the type of task report that you want.",
    ),
  }).describe(
    "Specifies how you want to configure a task report, which provides detailed information about for your Datasync transfer.",
  ).optional(),
  Excludes: z.array(FilterRuleSchema).optional(),
  TaskMode: z.enum(["BASIC", "ENHANCED"]).describe(
    "Specifies the task mode for the task.",
  ).optional(),
  Name: z.string().min(1).max(256).regex(
    new RegExp("^[a-zA-Z0-9\\s+=._:@/-]+$"),
  ).describe(
    "The name of a task. This value is a text reference that is used to identify the task in the console.",
  ).optional(),
  ManifestConfig: z.object({
    Action: z.enum(["TRANSFER"]).describe(
      "Specifies what DataSync uses the manifest for.",
    ).optional(),
    Format: z.enum(["CSV"]).describe(
      "Specifies the file format of your manifest.",
    ).optional(),
    Source: z.object({
      S3: ManifestConfigSourceS3Schema.describe(
        "Specifies the S3 bucket where you're hosting the manifest that you want AWS DataSync to use.",
      ).optional(),
    }).describe(
      "Specifies the manifest that you want DataSync to use and where it's hosted.",
    ),
  }).describe(
    "Configures a manifest, which is a list of files or objects that you want DataSync to transfer.",
  ).optional(),
  Includes: z.array(FilterRuleSchema).optional(),
  Schedule: z.object({
    ScheduleExpression: z.string().max(256).regex(
      new RegExp("^[a-zA-Z0-9\\ \\_\\*\\?\\,\\|\\^\\-\\/\\#\\s\\(\\)\\+]*$"),
    ).describe(
      "A cron expression that specifies when AWS DataSync initiates a scheduled transfer from a source to a destination location",
    ).optional(),
  }).describe(
    "Specifies the schedule you want your task to use for repeated executions.",
  ).optional(),
  CloudWatchLogGroupArn: z.string().max(562).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):logs:[a-z\\-0-9]*:[0-9]{12}:log-group:([^:\\*]*)(:\\*)?$",
    ),
  ).describe(
    "The ARN of the Amazon CloudWatch log group that is used to monitor and log events in the task.",
  ).optional(),
  SourceLocationArn: z.string().max(128).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):datasync:[a-z\\-0-9]+:[0-9]{12}:location/loc-[0-9a-z]{17}$",
    ),
  ).describe("The ARN of the source location for the task."),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this resource.",
  ).optional(),
});

const StateSchema = z.object({
  Status: z.string().optional(),
  SourceNetworkInterfaceArns: z.array(z.string()).optional(),
  DestinationLocationArn: z.string().optional(),
  Options: z.object({
    VerifyMode: z.string(),
    Gid: z.string(),
    Atime: z.string(),
    OverwriteMode: z.string(),
    PreserveDevices: z.string(),
    Mtime: z.string(),
    TaskQueueing: z.string(),
    TransferMode: z.string(),
    LogLevel: z.string(),
    ObjectTags: z.string(),
    Uid: z.string(),
    BytesPerSecond: z.number(),
    PosixPermissions: z.string(),
    PreserveDeletedFiles: z.string(),
    SecurityDescriptorCopyFlags: z.string(),
    ObjectMetadata: z.string(),
  }).optional(),
  TaskReportConfig: z.object({
    Destination: z.object({
      S3: TaskReportConfigDestinationS3Schema,
    }),
    ReportLevel: z.string(),
    ObjectVersionIds: z.string(),
    Overrides: z.object({
      Verified: z.object({
        ReportLevel: z.string(),
      }),
      Skipped: z.object({
        ReportLevel: z.string(),
      }),
      Transferred: z.object({
        ReportLevel: z.string(),
      }),
      Deleted: z.object({
        ReportLevel: z.string(),
      }),
    }),
    OutputType: z.string(),
  }).optional(),
  Excludes: z.array(FilterRuleSchema).optional(),
  TaskMode: z.string().optional(),
  Name: z.string().optional(),
  ManifestConfig: z.object({
    Action: z.string(),
    Format: z.string(),
    Source: z.object({
      S3: ManifestConfigSourceS3Schema,
    }),
  }).optional(),
  TaskArn: z.string(),
  Includes: z.array(FilterRuleSchema).optional(),
  DestinationNetworkInterfaceArns: z.array(z.string()).optional(),
  Schedule: z.object({
    Status: z.string(),
    ScheduleExpression: z.string(),
  }).optional(),
  CloudWatchLogGroupArn: z.string().optional(),
  SourceLocationArn: z.string().optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  DestinationLocationArn: z.string().max(128).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):datasync:[a-z\\-0-9]+:[0-9]{12}:location/loc-[0-9a-z]{17}$",
    ),
  ).describe("The ARN of an AWS storage resource's location.").optional(),
  Options: z.object({
    VerifyMode: z.enum([
      "POINT_IN_TIME_CONSISTENT",
      "ONLY_FILES_TRANSFERRED",
      "NONE",
    ]).describe(
      "A value that determines whether a data integrity verification should be performed at the end of a task execution after all data and metadata have been transferred.",
    ).optional(),
    Gid: z.enum(["NONE", "INT_VALUE", "NAME", "BOTH"]).describe(
      "The group ID (GID) of the file's owners.",
    ).optional(),
    Atime: z.enum(["NONE", "BEST_EFFORT"]).describe(
      "A file metadata value that shows the last time a file was accessed (that is, when the file was read or written to).",
    ).optional(),
    OverwriteMode: z.enum(["ALWAYS", "NEVER"]).describe(
      "A value that determines whether files at the destination should be overwritten or preserved when copying files.",
    ).optional(),
    PreserveDevices: z.enum(["NONE", "PRESERVE"]).describe(
      "A value that determines whether AWS DataSync should preserve the metadata of block and character devices in the source file system, and recreate the files with that device name and metadata on the destination.",
    ).optional(),
    Mtime: z.enum(["NONE", "PRESERVE"]).describe(
      "A value that indicates the last time that a file was modified (that is, a file was written to) before the PREPARING phase.",
    ).optional(),
    TaskQueueing: z.enum(["ENABLED", "DISABLED"]).describe(
      "A value that determines whether tasks should be queued before executing the tasks.",
    ).optional(),
    TransferMode: z.enum(["CHANGED", "ALL"]).describe(
      "A value that determines whether DataSync transfers only the data and metadata that differ between the source and the destination location, or whether DataSync transfers all the content from the source, without comparing to the destination location.",
    ).optional(),
    LogLevel: z.enum(["OFF", "BASIC", "TRANSFER"]).describe(
      "A value that determines the types of logs that DataSync publishes to a log stream in the Amazon CloudWatch log group that you provide.",
    ).optional(),
    ObjectTags: z.enum(["PRESERVE", "NONE"]).describe(
      "A value that determines whether object tags should be read from the source object store and written to the destination object store.",
    ).optional(),
    Uid: z.enum(["NONE", "INT_VALUE", "NAME", "BOTH"]).describe(
      "The user ID (UID) of the file's owner.",
    ).optional(),
    BytesPerSecond: z.number().int().min(-1).describe(
      "A value that limits the bandwidth used by AWS DataSync.",
    ).optional(),
    PosixPermissions: z.enum(["NONE", "PRESERVE"]).describe(
      "A value that determines which users or groups can access a file for a specific purpose such as reading, writing, or execution of the file.",
    ).optional(),
    PreserveDeletedFiles: z.enum(["PRESERVE", "REMOVE"]).describe(
      "A value that specifies whether files in the destination that don't exist in the source file system should be preserved.",
    ).optional(),
    SecurityDescriptorCopyFlags: z.enum([
      "NONE",
      "OWNER_DACL",
      "OWNER_DACL_SACL",
    ]).describe(
      "A value that determines which components of the SMB security descriptor are copied during transfer.",
    ).optional(),
    ObjectMetadata: z.enum(["PRESERVE", "NONE"]).describe(
      "A value that determines whether source object metadata should be copied to the destination. PRESERVE copies metadata; NONE copies only file-mtime.",
    ).optional(),
  }).describe(
    "Represents the options that are available to control the behavior of a StartTaskExecution operation.",
  ).optional(),
  TaskReportConfig: z.object({
    Destination: z.object({
      S3: TaskReportConfigDestinationS3Schema.describe(
        "Specifies the Amazon S3 bucket where DataSync uploads your task report.",
      ).optional(),
    }).describe("Specifies where DataSync uploads your task report.")
      .optional(),
    ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
      "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
    ).optional(),
    ObjectVersionIds: z.enum(["INCLUDE", "NONE"]).describe(
      "Specifies whether your task report includes the new version of each object transferred into an S3 bucket, this only applies if you enable versioning on your bucket.",
    ).optional(),
    Overrides: z.object({
      Verified: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to verify at the end of your transfer. This only applies if you configure your task to verify data during and after the transfer (which Datasync does by default)",
      ).optional(),
      Skipped: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to skip during your transfer.",
      ).optional(),
      Transferred: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to transfer.",
      ).optional(),
      Deleted: z.object({
        ReportLevel: z.enum(["ERRORS_ONLY", "SUCCESSES_AND_ERRORS"]).describe(
          "Specifies whether you want your task report to include only what went wrong with your transfer or a list of what succeeded and didn't.",
        ).optional(),
      }).describe(
        "Specifies the level of reporting for the files, objects, and directories that Datasync attempted to delete in your destination location. This only applies if you configure your task to delete data in the destination that isn't in the source.",
      ).optional(),
    }).describe(
      "Customizes the reporting level for aspects of your task report. For example, your report might generally only include errors, but you could specify that you want a list of successes and errors just for the files that Datasync attempted to delete in your destination location.",
    ).optional(),
    OutputType: z.enum(["SUMMARY_ONLY", "STANDARD"]).describe(
      "Specifies the type of task report that you want.",
    ).optional(),
  }).describe(
    "Specifies how you want to configure a task report, which provides detailed information about for your Datasync transfer.",
  ).optional(),
  Excludes: z.array(FilterRuleSchema).optional(),
  TaskMode: z.enum(["BASIC", "ENHANCED"]).describe(
    "Specifies the task mode for the task.",
  ).optional(),
  Name: z.string().min(1).max(256).regex(
    new RegExp("^[a-zA-Z0-9\\s+=._:@/-]+$"),
  ).describe(
    "The name of a task. This value is a text reference that is used to identify the task in the console.",
  ).optional(),
  ManifestConfig: z.object({
    Action: z.enum(["TRANSFER"]).describe(
      "Specifies what DataSync uses the manifest for.",
    ).optional(),
    Format: z.enum(["CSV"]).describe(
      "Specifies the file format of your manifest.",
    ).optional(),
    Source: z.object({
      S3: ManifestConfigSourceS3Schema.describe(
        "Specifies the S3 bucket where you're hosting the manifest that you want AWS DataSync to use.",
      ).optional(),
    }).describe(
      "Specifies the manifest that you want DataSync to use and where it's hosted.",
    ).optional(),
  }).describe(
    "Configures a manifest, which is a list of files or objects that you want DataSync to transfer.",
  ).optional(),
  Includes: z.array(FilterRuleSchema).optional(),
  Schedule: z.object({
    ScheduleExpression: z.string().max(256).regex(
      new RegExp("^[a-zA-Z0-9\\ \\_\\*\\?\\,\\|\\^\\-\\/\\#\\s\\(\\)\\+]*$"),
    ).describe(
      "A cron expression that specifies when AWS DataSync initiates a scheduled transfer from a source to a destination location",
    ).optional(),
  }).describe(
    "Specifies the schedule you want your task to use for repeated executions.",
  ).optional(),
  CloudWatchLogGroupArn: z.string().max(562).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):logs:[a-z\\-0-9]*:[0-9]{12}:log-group:([^:\\*]*)(:\\*)?$",
    ),
  ).describe(
    "The ARN of the Amazon CloudWatch log group that is used to monitor and log events in the task.",
  ).optional(),
  SourceLocationArn: z.string().max(128).regex(
    new RegExp(
      "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):datasync:[a-z\\-0-9]+:[0-9]{12}:location/loc-[0-9a-z]{17}$",
    ),
  ).describe("The ARN of the source location for the task.").optional(),
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

/** Swamp extension model for DataSync Task. Registered at `@swamp/aws/datasync/task`. */
export const model = {
  type: "@swamp/aws/datasync/task",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "DataSync Task resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a DataSync Task",
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
          "AWS::DataSync::Task",
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
      description: "Get a DataSync Task",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the DataSync Task",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::DataSync::Task",
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
      description: "Update a DataSync Task",
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
          "AWS::DataSync::Task",
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
          "AWS::DataSync::Task",
          identifier,
          currentState,
          desiredState,
          ["DestinationLocationArn", "SourceLocationArn", "TaskMode"],
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
      description: "Delete a DataSync Task",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the DataSync Task",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::DataSync::Task",
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
      description: "Sync DataSync Task state from AWS",
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
            "AWS::DataSync::Task",
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
      description: "List DataSync Task resources",
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
          "AWS::DataSync::Task",
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
