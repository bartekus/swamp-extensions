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

// Auto-generated extension model for @swamp/aws/appsync/graph-qlapi
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for AppSync GraphQLApi (AWS::AppSync::GraphQLApi).
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

const LambdaAuthorizerConfigSchema = z.object({
  IdentityValidationExpression: z.string().describe(
    "A regular expression for validation of tokens before the Lambda function is called.",
  ).optional(),
  AuthorizerUri: z.string().describe(
    "The ARN of the Lambda function to be called for authorization.",
  ).optional(),
  AuthorizerResultTtlInSeconds: z.number().int().describe(
    "The number of seconds a response should be cached for.",
  ).optional(),
});

const OpenIDConnectConfigSchema = z.object({
  ClientId: z.string().describe(
    "The client identifier of the Relying party at the OpenID identity provider.",
  ).optional(),
  AuthTTL: z.number().describe(
    "The number of milliseconds that a token is valid after being authenticated.",
  ).optional(),
  Issuer: z.string().describe("The issuer for the OIDC configuration.")
    .optional(),
  IatTTL: z.number().describe(
    "The number of milliseconds that a token is valid after it's issued to a user.",
  ).optional(),
});

const CognitoUserPoolConfigSchema = z.object({
  AppIdClientRegex: z.string().describe(
    "A regular expression for validating the incoming Amazon Cognito user pool app client ID.",
  ).optional(),
  UserPoolId: z.string().describe("The user pool ID").optional(),
  AwsRegion: z.string().describe(
    "The AWS Region in which the user pool was created.",
  ).optional(),
});

const AdditionalAuthenticationProviderSchema = z.object({
  LambdaAuthorizerConfig: LambdaAuthorizerConfigSchema.optional(),
  OpenIDConnectConfig: OpenIDConnectConfigSchema.optional(),
  UserPoolConfig: CognitoUserPoolConfigSchema.optional(),
  AuthenticationType: z.string().describe(
    "The authentication type for API key, AWS Identity and Access Management, OIDC, Amazon Cognito user pools, or AWS Lambda.",
  ),
});

const TagSchema = z.object({
  Value: z.string(),
  Key: z.string(),
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
  AdditionalAuthenticationProviders: z.array(
    AdditionalAuthenticationProviderSchema,
  ).describe(
    "A list of additional authentication providers for the GraphqlApi API.",
  ).optional(),
  ApiType: z.string().describe(
    "The value that indicates whether the GraphQL API is a standard API (GRAPHQL) or merged API (MERGED).",
  ).optional(),
  AuthenticationType: z.string().describe(
    "Security configuration for your GraphQL API",
  ),
  EnhancedMetricsConfig: z.object({
    OperationLevelMetricsConfig: z.string().describe(
      "Controls how operation metrics will be emitted to CloudWatch. Operation metrics include:",
    ),
    ResolverLevelMetricsBehavior: z.string().describe(
      "Controls how resolver metrics will be emitted to CloudWatch. Resolver metrics include:",
    ),
    DataSourceLevelMetricsBehavior: z.string().describe(
      "Controls how data source metrics will be emitted to CloudWatch. Data source metrics include:",
    ),
  }).describe(
    "Enables and controls the enhanced metrics feature. Enhanced metrics emit granular data on API usage and performance such as AppSync request and error counts, latency, and cache hits/misses. All enhanced metric data is sent to your CloudWatch account, and you can configure the types of data that will be sent.",
  ).optional(),
  EnvironmentVariables: z.record(z.string(), z.string()).describe(
    "A map containing the list of resources with their properties and environment variables.",
  ).optional(),
  IntrospectionConfig: z.string().describe(
    "Sets the value of the GraphQL API to enable (ENABLED) or disable (DISABLED) introspection. If no value is provided, the introspection configuration will be set to ENABLED by default. This field will produce an error if the operation attempts to use the introspection feature while this field is disabled.",
  ).optional(),
  LambdaAuthorizerConfig: z.object({
    IdentityValidationExpression: z.string().describe(
      "A regular expression for validation of tokens before the Lambda function is called.",
    ).optional(),
    AuthorizerUri: z.string().describe(
      "The ARN of the Lambda function to be called for authorization.",
    ).optional(),
    AuthorizerResultTtlInSeconds: z.number().int().describe(
      "The number of seconds a response should be cached for.",
    ).optional(),
  }).describe(
    "A LambdaAuthorizerConfig holds configuration on how to authorize AWS AppSync API access when using the AWS_LAMBDA authorizer mode. Be aware that an AWS AppSync API may have only one Lambda authorizer configured at a time.",
  ).optional(),
  LogConfig: z.object({
    ExcludeVerboseContent: z.boolean().describe(
      "Set to TRUE to exclude sections that contain information such as headers, context, and evaluated mapping templates, regardless of logging level.",
    ).optional(),
    FieldLogLevel: z.string().describe(
      "The field logging level. Values can be NONE, ERROR, INFO, DEBUG, or ALL.",
    ),
    CloudWatchLogsRoleArn: z.string().describe(
      "The service role that AWS AppSync will assume to publish to Amazon CloudWatch Logs in your account.",
    ),
  }).describe("The Amazon CloudWatch Logs configuration.").optional(),
  MergedApiExecutionRoleArn: z.string().describe(
    "The AWS Identity and Access Management service role ARN for a merged API.",
  ).optional(),
  Name: z.string().describe("The API name"),
  OpenIDConnectConfig: z.object({
    ClientId: z.string().describe(
      "The client identifier of the Relying party at the OpenID identity provider.",
    ).optional(),
    AuthTTL: z.number().describe(
      "The number of milliseconds that a token is valid after being authenticated.",
    ).optional(),
    Issuer: z.string().describe("The issuer for the OIDC configuration.")
      .optional(),
    IatTTL: z.number().describe(
      "The number of milliseconds that a token is valid after it's issued to a user.",
    ).optional(),
  }).describe("The OpenID Connect configuration.").optional(),
  OwnerContact: z.string().describe(
    "The owner contact information for an API resource.",
  ).optional(),
  QueryDepthLimit: z.number().int().describe(
    "The maximum depth a query can have in a single request. Depth refers to the amount of nested levels allowed in the body of query.",
  ).optional(),
  ResolverCountLimit: z.number().int().describe(
    "The maximum number of resolvers that can be invoked in a single request.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An arbitrary set of tags (key-value pairs) for this GraphQL API.",
  ).optional(),
  UserPoolConfig: z.object({
    AppIdClientRegex: z.string().describe(
      "A regular expression for validating the incoming Amazon Cognito user pool app client ID.",
    ).optional(),
    UserPoolId: z.string().describe("The user pool ID.").optional(),
    AwsRegion: z.string().describe(
      "The AWS Region in which the user pool was created.",
    ).optional(),
    DefaultAction: z.string().describe(
      "The action that you want your GraphQL API to take when a request that uses Amazon Cognito user pool authentication doesn't match the Amazon Cognito user pool configuration.",
    ).optional(),
  }).describe(
    "Optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint.",
  ).optional(),
  Visibility: z.string().describe(
    "Sets the scope of the GraphQL API to public (GLOBAL) or private (PRIVATE). By default, the scope is set to Global if no value is provided.",
  ).optional(),
  XrayEnabled: z.boolean().describe(
    "A flag indicating whether to use AWS X-Ray tracing for this GraphqlApi.",
  ).optional(),
});

const StateSchema = z.object({
  AdditionalAuthenticationProviders: z.array(
    AdditionalAuthenticationProviderSchema,
  ).optional(),
  ApiId: z.string().optional(),
  ApiType: z.string().optional(),
  Arn: z.string(),
  AuthenticationType: z.string().optional(),
  EnhancedMetricsConfig: z.object({
    OperationLevelMetricsConfig: z.string(),
    ResolverLevelMetricsBehavior: z.string(),
    DataSourceLevelMetricsBehavior: z.string(),
  }).optional(),
  EnvironmentVariables: z.record(z.string(), z.unknown()).optional(),
  GraphQLDns: z.string().optional(),
  GraphQLEndpointArn: z.string().optional(),
  GraphQLUrl: z.string().optional(),
  IntrospectionConfig: z.string().optional(),
  LambdaAuthorizerConfig: LambdaAuthorizerConfigSchema.optional(),
  LogConfig: z.object({
    ExcludeVerboseContent: z.boolean(),
    FieldLogLevel: z.string(),
    CloudWatchLogsRoleArn: z.string(),
  }).optional(),
  MergedApiExecutionRoleArn: z.string().optional(),
  Name: z.string().optional(),
  OpenIDConnectConfig: OpenIDConnectConfigSchema.optional(),
  OwnerContact: z.string().optional(),
  QueryDepthLimit: z.number().optional(),
  RealtimeDns: z.string().optional(),
  RealtimeUrl: z.string().optional(),
  ResolverCountLimit: z.number().optional(),
  Tags: z.array(TagSchema).optional(),
  UserPoolConfig: z.object({
    AppIdClientRegex: z.string(),
    UserPoolId: z.string(),
    AwsRegion: z.string(),
    DefaultAction: z.string(),
  }).optional(),
  Visibility: z.string().optional(),
  XrayEnabled: z.boolean().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  AdditionalAuthenticationProviders: z.array(
    AdditionalAuthenticationProviderSchema,
  ).describe(
    "A list of additional authentication providers for the GraphqlApi API.",
  ).optional(),
  ApiType: z.string().describe(
    "The value that indicates whether the GraphQL API is a standard API (GRAPHQL) or merged API (MERGED).",
  ).optional(),
  AuthenticationType: z.string().describe(
    "Security configuration for your GraphQL API",
  ).optional(),
  EnhancedMetricsConfig: z.object({
    OperationLevelMetricsConfig: z.string().describe(
      "Controls how operation metrics will be emitted to CloudWatch. Operation metrics include:",
    ).optional(),
    ResolverLevelMetricsBehavior: z.string().describe(
      "Controls how resolver metrics will be emitted to CloudWatch. Resolver metrics include:",
    ).optional(),
    DataSourceLevelMetricsBehavior: z.string().describe(
      "Controls how data source metrics will be emitted to CloudWatch. Data source metrics include:",
    ).optional(),
  }).describe(
    "Enables and controls the enhanced metrics feature. Enhanced metrics emit granular data on API usage and performance such as AppSync request and error counts, latency, and cache hits/misses. All enhanced metric data is sent to your CloudWatch account, and you can configure the types of data that will be sent.",
  ).optional(),
  EnvironmentVariables: z.record(z.string(), z.string()).describe(
    "A map containing the list of resources with their properties and environment variables.",
  ).optional(),
  IntrospectionConfig: z.string().describe(
    "Sets the value of the GraphQL API to enable (ENABLED) or disable (DISABLED) introspection. If no value is provided, the introspection configuration will be set to ENABLED by default. This field will produce an error if the operation attempts to use the introspection feature while this field is disabled.",
  ).optional(),
  LambdaAuthorizerConfig: z.object({
    IdentityValidationExpression: z.string().describe(
      "A regular expression for validation of tokens before the Lambda function is called.",
    ).optional(),
    AuthorizerUri: z.string().describe(
      "The ARN of the Lambda function to be called for authorization.",
    ).optional(),
    AuthorizerResultTtlInSeconds: z.number().int().describe(
      "The number of seconds a response should be cached for.",
    ).optional(),
  }).describe(
    "A LambdaAuthorizerConfig holds configuration on how to authorize AWS AppSync API access when using the AWS_LAMBDA authorizer mode. Be aware that an AWS AppSync API may have only one Lambda authorizer configured at a time.",
  ).optional(),
  LogConfig: z.object({
    ExcludeVerboseContent: z.boolean().describe(
      "Set to TRUE to exclude sections that contain information such as headers, context, and evaluated mapping templates, regardless of logging level.",
    ).optional(),
    FieldLogLevel: z.string().describe(
      "The field logging level. Values can be NONE, ERROR, INFO, DEBUG, or ALL.",
    ).optional(),
    CloudWatchLogsRoleArn: z.string().describe(
      "The service role that AWS AppSync will assume to publish to Amazon CloudWatch Logs in your account.",
    ).optional(),
  }).describe("The Amazon CloudWatch Logs configuration.").optional(),
  MergedApiExecutionRoleArn: z.string().describe(
    "The AWS Identity and Access Management service role ARN for a merged API.",
  ).optional(),
  Name: z.string().describe("The API name").optional(),
  OpenIDConnectConfig: z.object({
    ClientId: z.string().describe(
      "The client identifier of the Relying party at the OpenID identity provider.",
    ).optional(),
    AuthTTL: z.number().describe(
      "The number of milliseconds that a token is valid after being authenticated.",
    ).optional(),
    Issuer: z.string().describe("The issuer for the OIDC configuration.")
      .optional(),
    IatTTL: z.number().describe(
      "The number of milliseconds that a token is valid after it's issued to a user.",
    ).optional(),
  }).describe("The OpenID Connect configuration.").optional(),
  OwnerContact: z.string().describe(
    "The owner contact information for an API resource.",
  ).optional(),
  QueryDepthLimit: z.number().int().describe(
    "The maximum depth a query can have in a single request. Depth refers to the amount of nested levels allowed in the body of query.",
  ).optional(),
  ResolverCountLimit: z.number().int().describe(
    "The maximum number of resolvers that can be invoked in a single request.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An arbitrary set of tags (key-value pairs) for this GraphQL API.",
  ).optional(),
  UserPoolConfig: z.object({
    AppIdClientRegex: z.string().describe(
      "A regular expression for validating the incoming Amazon Cognito user pool app client ID.",
    ).optional(),
    UserPoolId: z.string().describe("The user pool ID.").optional(),
    AwsRegion: z.string().describe(
      "The AWS Region in which the user pool was created.",
    ).optional(),
    DefaultAction: z.string().describe(
      "The action that you want your GraphQL API to take when a request that uses Amazon Cognito user pool authentication doesn't match the Amazon Cognito user pool configuration.",
    ).optional(),
  }).describe(
    "Optional authorization configuration for using Amazon Cognito user pools with your GraphQL endpoint.",
  ).optional(),
  Visibility: z.string().describe(
    "Sets the scope of the GraphQL API to public (GLOBAL) or private (PRIVATE). By default, the scope is set to Global if no value is provided.",
  ).optional(),
  XrayEnabled: z.boolean().describe(
    "A flag indicating whether to use AWS X-Ray tracing for this GraphqlApi.",
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

/** Swamp extension model for AppSync GraphQLApi. Registered at `@swamp/aws/appsync/graph-qlapi`. */
export const model = {
  type: "@swamp/aws/appsync/graph-qlapi",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.01.2",
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
      toVersion: "2026.04.03.3",
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
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "AppSync GraphQLApi resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a AppSync GraphQLApi",
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
          "AWS::AppSync::GraphQLApi",
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
      description: "Get a AppSync GraphQLApi",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the AppSync GraphQLApi",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::AppSync::GraphQLApi",
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
      description: "Update a AppSync GraphQLApi",
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
          "AWS::AppSync::GraphQLApi",
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
          "AWS::AppSync::GraphQLApi",
          identifier,
          currentState,
          desiredState,
          undefined,
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
      description: "Delete a AppSync GraphQLApi",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the AppSync GraphQLApi",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::AppSync::GraphQLApi",
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
      description: "Sync AppSync GraphQLApi state from AWS",
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
            "AWS::AppSync::GraphQLApi",
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
      description: "List AppSync GraphQLApi resources",
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
          "AWS::AppSync::GraphQLApi",
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
