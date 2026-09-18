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

// Auto-generated extension model for @swamp/aws/elasticbeanstalk/application-version
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for ElasticBeanstalk ApplicationVersion (AWS::ElasticBeanstalk::ApplicationVersion).
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

const ImageSourceSchema = z.object({
  Uri: z.string().describe(
    "The URI of the container image, e.g. an ECR image URI.",
  ).optional(),
});

const ImageBuildConfigurationSchema = z.object({
  Type: z.enum(["docker", "buildpack"]).describe(
    "The type of image build: docker or buildpack.",
  ),
  DockerfileLocation: z.string().describe(
    "The path to the Dockerfile, relative to the source root.",
  ).optional(),
  Buildpack: z.string().describe("The buildpack to use for building the image.")
    .optional(),
  Architecture: z.enum(["amd64", "arm64"]).describe(
    "The target architecture for the built container image.",
  ).optional(),
  CodeBuildServiceRole: z.string().describe(
    "The ARN of the IAM role that AWS CodeBuild assumes to build the application version.",
  ),
  ComputeType: z.enum([
    "BUILD_GENERAL1_SMALL",
    "BUILD_GENERAL1_MEDIUM",
    "BUILD_GENERAL1_LARGE",
  ]).describe("The compute type for the CodeBuild build environment.")
    .optional(),
  TimeoutInMinutes: z.number().int().describe(
    "The timeout for the CodeBuild build, in minutes.",
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
  ApplicationName: z.string().describe(
    "The name of the Elastic Beanstalk application that is associated with this application version.",
  ),
  Description: z.string().describe("A description of this application version.")
    .optional(),
  Process: z.boolean().describe(
    "Pre-process and validate the environment manifest (`env.yaml`) and configuration files in the source bundle. Leave unset for the service default.",
  ).optional(),
  SourceBundle: z.object({
    S3Bucket: z.string().describe(
      "The Amazon S3 bucket where the data is located.",
    ),
    S3Key: z.string().describe("The Amazon S3 key where the data is located."),
  }).describe(
    "The Amazon S3 bucket and key that identify the location of the source bundle for this version.",
  ).optional(),
  BuildConfiguration: z.object({
    CodeBuildServiceRole: z.string().describe(
      "The ARN of the IAM role that AWS CodeBuild assumes to build the application version.",
    ),
    Image: z.string().describe(
      "The CodeBuild image used for the build environment.",
    ),
    ComputeType: z.enum([
      "BUILD_GENERAL1_SMALL",
      "BUILD_GENERAL1_MEDIUM",
      "BUILD_GENERAL1_LARGE",
    ]).describe("The compute type for the CodeBuild build environment.")
      .optional(),
    TimeoutInMinutes: z.number().int().describe(
      "The timeout for the CodeBuild build, in minutes.",
    ).optional(),
    ArtifactName: z.string().describe("The name of the build artifact.")
      .optional(),
  }).describe(
    "Settings for an AWS CodeBuild build that packages and builds an application version from source code.",
  ).optional(),
  ImageConfiguration: z.object({
    Source: ImageSourceSchema.describe(
      "The container image source for this version, as an ECR image URI.",
    ).optional(),
    Build: ImageBuildConfigurationSchema.describe(
      "Configuration for building a container image from source code.",
    ).optional(),
  }).describe("Configuration for image-based application versions.").optional(),
});

const StateSchema = z.object({
  Id: z.string(),
  ApplicationName: z.string(),
  Description: z.string().optional(),
  Process: z.boolean().optional(),
  SourceBundle: z.object({
    S3Bucket: z.string(),
    S3Key: z.string(),
  }).optional(),
  BuildConfiguration: z.object({
    CodeBuildServiceRole: z.string(),
    Image: z.string(),
    ComputeType: z.string(),
    TimeoutInMinutes: z.number(),
    ArtifactName: z.string(),
  }).optional(),
  ImageConfiguration: z.object({
    Source: ImageSourceSchema,
    Build: ImageBuildConfigurationSchema,
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  ApplicationName: z.string().describe(
    "The name of the Elastic Beanstalk application that is associated with this application version.",
  ).optional(),
  Description: z.string().describe("A description of this application version.")
    .optional(),
  Process: z.boolean().describe(
    "Pre-process and validate the environment manifest (`env.yaml`) and configuration files in the source bundle. Leave unset for the service default.",
  ).optional(),
  SourceBundle: z.object({
    S3Bucket: z.string().describe(
      "The Amazon S3 bucket where the data is located.",
    ).optional(),
    S3Key: z.string().describe("The Amazon S3 key where the data is located.")
      .optional(),
  }).describe(
    "The Amazon S3 bucket and key that identify the location of the source bundle for this version.",
  ).optional(),
  BuildConfiguration: z.object({
    CodeBuildServiceRole: z.string().describe(
      "The ARN of the IAM role that AWS CodeBuild assumes to build the application version.",
    ).optional(),
    Image: z.string().describe(
      "The CodeBuild image used for the build environment.",
    ).optional(),
    ComputeType: z.enum([
      "BUILD_GENERAL1_SMALL",
      "BUILD_GENERAL1_MEDIUM",
      "BUILD_GENERAL1_LARGE",
    ]).describe("The compute type for the CodeBuild build environment.")
      .optional(),
    TimeoutInMinutes: z.number().int().describe(
      "The timeout for the CodeBuild build, in minutes.",
    ).optional(),
    ArtifactName: z.string().describe("The name of the build artifact.")
      .optional(),
  }).describe(
    "Settings for an AWS CodeBuild build that packages and builds an application version from source code.",
  ).optional(),
  ImageConfiguration: z.object({
    Source: ImageSourceSchema.describe(
      "The container image source for this version, as an ECR image URI.",
    ).optional(),
    Build: ImageBuildConfigurationSchema.describe(
      "Configuration for building a container image from source code.",
    ).optional(),
  }).describe("Configuration for image-based application versions.").optional(),
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

/** Swamp extension model for ElasticBeanstalk ApplicationVersion. Registered at `@swamp/aws/elasticbeanstalk/application-version`. */
export const model = {
  type: "@swamp/aws/elasticbeanstalk/application-version",
  version: "2026.09.18.1",
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
      toVersion: "2026.09.18.1",
      description: "Added: Process, BuildConfiguration, ImageConfiguration",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "ElasticBeanstalk ApplicationVersion resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a ElasticBeanstalk ApplicationVersion",
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
          "AWS::ElasticBeanstalk::ApplicationVersion",
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
      description: "Get a ElasticBeanstalk ApplicationVersion",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the ElasticBeanstalk ApplicationVersion",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::ElasticBeanstalk::ApplicationVersion",
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
      description: "Update a ElasticBeanstalk ApplicationVersion",
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
        const idParts = [
          existing.ApplicationName?.toString(),
          existing.Id?.toString(),
        ];
        if (idParts.some((p) => !p)) {
          throw new Error(
            "Missing primary identifier fields in existing state",
          );
        }
        const identifier = idParts.join("|");
        const currentState = await readResource(
          "AWS::ElasticBeanstalk::ApplicationVersion",
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
          "AWS::ElasticBeanstalk::ApplicationVersion",
          identifier,
          currentState,
          desiredState,
          [
            "SourceBundle",
            "ApplicationName",
            "ImageConfiguration",
            "BuildConfiguration",
            "Process",
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
      description: "Delete a ElasticBeanstalk ApplicationVersion",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the ElasticBeanstalk ApplicationVersion",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::ElasticBeanstalk::ApplicationVersion",
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
      description: "Sync ElasticBeanstalk ApplicationVersion state from AWS",
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
        const idParts = [
          existing.ApplicationName?.toString(),
          existing.Id?.toString(),
        ];
        if (idParts.some((p) => !p)) {
          throw new Error(
            "Missing primary identifier fields in existing state",
          );
        }
        const identifier = idParts.join("|");
        try {
          const result = await readResource(
            "AWS::ElasticBeanstalk::ApplicationVersion",
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
      description: "List ElasticBeanstalk ApplicationVersion resources",
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
          "AWS::ElasticBeanstalk::ApplicationVersion",
          {
            resourceModel: args.resourceModel,
            maxPages: args.maxPages,
            credentials,
          },
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const instanceName = item.identifier.replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, "");
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
