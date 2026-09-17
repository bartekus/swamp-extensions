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

// Auto-generated extension model for @swamp/aws/bedrockagentcore/gateway
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for BedrockAgentCore Gateway (AWS::BedrockAgentCore::Gateway).
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

const AuthorizingClaimMatchValueTypeSchema = z.object({
  ClaimMatchValue: z.object({
    MatchValueString: z.string().min(1).max(255).regex(
      new RegExp("^[A-Za-z0-9_.:/-]+$"),
    ).optional(),
    MatchValueStringList: z.array(
      z.string().min(1).max(255).regex(new RegExp("^[A-Za-z0-9_.:/-]+$")),
    ).optional(),
  }),
  ClaimMatchOperator: z.enum(["EQUALS", "CONTAINS", "CONTAINS_ANY"]),
});

const CustomClaimValidationTypeSchema = z.object({
  InboundTokenClaimName: z.string().min(1).max(255).regex(
    new RegExp("^[A-Za-z0-9_.-:]+$"),
  ),
  InboundTokenClaimValueType: z.enum(["STRING", "STRING_ARRAY"]),
  AuthorizingClaimMatchValue: AuthorizingClaimMatchValueTypeSchema,
});

const ManagedVpcResourceSchema = z.object({
  VpcIdentifier: z.string().regex(
    new RegExp("^vpc-(([0-9a-z]{8})|([0-9a-z]{17}))$"),
  ),
  SubnetIds: z.array(
    z.string().regex(new RegExp("^subnet-[0-9a-zA-Z]{8,17}$")),
  ),
  EndpointIpAddressType: z.enum(["IPV4", "IPV6"]),
  SecurityGroupIds: z.array(
    z.string().regex(new RegExp("^sg-(([0-9a-z]{8})|([0-9a-z]{17}))$")),
  ).optional(),
  RoutingDomain: z.string().min(3).max(255).optional(),
  Tags: z.record(
    z.string(),
    z.string().min(0).max(256).regex(new RegExp("^[a-zA-Z0-9\\s._:/=+@-]*$")),
  ).optional(),
});

const CustomJWTAuthorizerConfigurationSchema = z.object({
  DiscoveryUrl: z.string().regex(
    new RegExp("^.+/\\.well-known/openid-configuration$"),
  ),
  AllowedAudience: z.array(z.string()).optional(),
  AllowedClients: z.array(z.string()).optional(),
  AllowedScopes: z.array(
    z.string().min(1).max(255).regex(
      new RegExp("^[\\x21\\x23-\\x5B\\x5D-\\x7E]+$"),
    ),
  ).optional(),
  AdvertisedScopeMapping: z.record(
    z.string(),
    z.string().min(1).max(255).regex(
      new RegExp("^[\\x21\\x23-\\x5B\\x5D-\\x7E]+$"),
    ),
  ).describe(
    "Maps an originalScope (from allowedScopes) to an advertisedScope exposed in WWW-Authenticate / Protected Resource Metadata.",
  ).optional(),
  CustomClaims: z.array(CustomClaimValidationTypeSchema).optional(),
  PrivateEndpoint: z.object({
    SelfManagedLatticeResource: z.object({
      ResourceConfigurationIdentifier: z.string().min(20).max(2048).regex(
        new RegExp(
          "^((rcfg-[0-9a-z]{17})|(arn:[a-z0-9\\-]+:vpc-lattice:[a-zA-Z0-9\\-]+:\\d{12}:resourceconfiguration/rcfg-[0-9a-z]{17}))$",
        ),
      ).optional(),
    }).optional(),
    ManagedVpcResource: ManagedVpcResourceSchema.optional(),
  }).optional(),
});

const LambdaInterceptorConfigurationSchema = z.object({
  Arn: z.string().min(1).max(170).regex(
    new RegExp(
      "^arn:(aws[a-zA-Z-]*)?:lambda:([a-z]{2}(-gov)?-[a-z]+-\\d{1}):(\\d{12}):function:([a-zA-Z0-9-_.]+)(:(\\$LATEST|[a-zA-Z0-9-_]+))?$",
    ),
  ),
});

const InterceptorPayloadFilterSchema = z.object({
  Exclude: z.array(z.object({
    Field: z.enum(["RESPONSE_BODY"]).optional(),
  })),
});

const InterceptorInputConfigurationSchema = z.object({
  PassRequestHeaders: z.boolean(),
  PayloadFilter: InterceptorPayloadFilterSchema.optional(),
});

const GatewayInterceptorConfigurationSchema = z.object({
  Interceptor: z.object({
    Lambda: LambdaInterceptorConfigurationSchema.optional(),
  }),
  InterceptionPoints: z.array(z.enum(["REQUEST", "RESPONSE"])),
  InputConfiguration: InterceptorInputConfigurationSchema.optional(),
});

const SessionConfigurationSchema = z.object({
  SessionTimeoutInSeconds: z.number().min(900).max(28800).optional(),
});

const StreamingConfigurationSchema = z.object({
  EnableResponseStreaming: z.boolean().optional(),
});

const MCPGatewayConfigurationSchema = z.object({
  SupportedVersions: z.array(z.string()).optional(),
  Instructions: z.string().min(1).max(2048).optional(),
  SearchType: z.enum(["SEMANTIC"]).optional(),
  SessionConfiguration: SessionConfigurationSchema.optional(),
  StreamingConfiguration: StreamingConfigurationSchema.optional(),
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
  AuthorizerConfiguration: z.object({
    CustomJWTAuthorizer: CustomJWTAuthorizerConfigurationSchema.optional(),
  }).optional(),
  AuthorizerType: z.enum([
    "CUSTOM_JWT",
    "AWS_IAM",
    "NONE",
    "AUTHENTICATE_ONLY",
  ]),
  Description: z.string().min(1).max(200).optional(),
  ExceptionLevel: z.enum(["DEBUG"]).optional(),
  InterceptorConfigurations: z.array(GatewayInterceptorConfigurationSchema)
    .optional(),
  KmsKeyArn: z.string().min(1).max(2048).regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):kms:[a-zA-Z0-9-]*:[0-9]{12}:key/[a-zA-Z0-9-]{36}$",
    ),
  ).optional(),
  Name: z.string().regex(new RegExp("^([0-9a-zA-Z][-]?){1,48}$")),
  PolicyEngineConfiguration: z.object({
    Arn: z.string().min(1).max(170).regex(
      new RegExp(
        "^arn:aws:bedrock-agentcore:[a-z0-9-]+:[0-9]{12}:policy-engine\\/[a-zA-Z][a-zA-Z0-9-_]{0,99}-[a-zA-Z0-9_]{10}$",
      ),
    ),
    Mode: z.enum(["LOG_ONLY", "ENFORCE"]),
  }).optional(),
  ProtocolConfiguration: z.object({
    Mcp: MCPGatewayConfigurationSchema.optional(),
  }).optional(),
  RoleArn: z.string().min(1).max(2048).regex(
    new RegExp("^arn:aws(-[^:]+)?:iam::([0-9]{12})?:role/.+$"),
  ),
  Tags: z.record(
    z.string(),
    z.string().min(0).max(256).regex(new RegExp("^[a-zA-Z0-9\\s._:/=+@-]*$")),
  ).optional(),
  WafConfiguration: z.object({
    FailureMode: z.enum(["FAIL_CLOSE", "FAIL_OPEN"]).optional(),
  }).optional(),
  WorkloadIdentityDetails: z.object({
    WorkloadIdentityArn: z.string().min(1).max(1024),
  }).optional(),
});

const StateSchema = z.object({
  AuthorizerConfiguration: z.object({
    CustomJWTAuthorizer: CustomJWTAuthorizerConfigurationSchema,
  }).optional(),
  AuthorizerType: z.string().optional(),
  CreatedAt: z.string().optional(),
  Description: z.string().optional(),
  ExceptionLevel: z.string().optional(),
  GatewayArn: z.string().optional(),
  GatewayIdentifier: z.string(),
  GatewayUrl: z.string().optional(),
  InterceptorConfigurations: z.array(GatewayInterceptorConfigurationSchema)
    .optional(),
  KmsKeyArn: z.string().optional(),
  Name: z.string().optional(),
  PolicyEngineConfiguration: z.object({
    Arn: z.string(),
    Mode: z.string(),
  }).optional(),
  ProtocolConfiguration: z.object({
    Mcp: MCPGatewayConfigurationSchema,
  }).optional(),
  RoleArn: z.string().optional(),
  Status: z.string().optional(),
  StatusReasons: z.array(z.string()).optional(),
  Tags: z.record(z.string(), z.unknown()).optional(),
  UpdatedAt: z.string().optional(),
  WafConfiguration: z.object({
    FailureMode: z.string(),
  }).optional(),
  WebAclArn: z.string().optional(),
  WorkloadIdentityDetails: z.object({
    WorkloadIdentityArn: z.string(),
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  AuthorizerConfiguration: z.object({
    CustomJWTAuthorizer: CustomJWTAuthorizerConfigurationSchema.optional(),
  }).optional(),
  AuthorizerType: z.enum(["CUSTOM_JWT", "AWS_IAM", "NONE", "AUTHENTICATE_ONLY"])
    .optional(),
  Description: z.string().min(1).max(200).optional(),
  ExceptionLevel: z.enum(["DEBUG"]).optional(),
  InterceptorConfigurations: z.array(GatewayInterceptorConfigurationSchema)
    .optional(),
  KmsKeyArn: z.string().min(1).max(2048).regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):kms:[a-zA-Z0-9-]*:[0-9]{12}:key/[a-zA-Z0-9-]{36}$",
    ),
  ).optional(),
  Name: z.string().regex(new RegExp("^([0-9a-zA-Z][-]?){1,48}$")).optional(),
  PolicyEngineConfiguration: z.object({
    Arn: z.string().min(1).max(170).regex(
      new RegExp(
        "^arn:aws:bedrock-agentcore:[a-z0-9-]+:[0-9]{12}:policy-engine\\/[a-zA-Z][a-zA-Z0-9-_]{0,99}-[a-zA-Z0-9_]{10}$",
      ),
    ).optional(),
    Mode: z.enum(["LOG_ONLY", "ENFORCE"]).optional(),
  }).optional(),
  ProtocolConfiguration: z.object({
    Mcp: MCPGatewayConfigurationSchema.optional(),
  }).optional(),
  RoleArn: z.string().min(1).max(2048).regex(
    new RegExp("^arn:aws(-[^:]+)?:iam::([0-9]{12})?:role/.+$"),
  ).optional(),
  Tags: z.record(
    z.string(),
    z.string().min(0).max(256).regex(new RegExp("^[a-zA-Z0-9\\s._:/=+@-]*$")),
  ).optional(),
  WafConfiguration: z.object({
    FailureMode: z.enum(["FAIL_CLOSE", "FAIL_OPEN"]).optional(),
  }).optional(),
  WorkloadIdentityDetails: z.object({
    WorkloadIdentityArn: z.string().min(1).max(1024).optional(),
  }).optional(),
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

/** Swamp extension model for BedrockAgentCore Gateway. Registered at `@swamp/aws/bedrockagentcore/gateway`. */
export const model = {
  type: "@swamp/aws/bedrockagentcore/gateway",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.03.31.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
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
      toVersion: "2026.06.03.1",
      description: "Removed: ProtocolType",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { ProtocolType: _ProtocolType, ...rest } = old;
        return rest;
      },
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
      toVersion: "2026.06.09.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.07.1",
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
      toVersion: "2026.08.26.1",
      description: "Added: WafConfiguration",
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
      description: "BedrockAgentCore Gateway resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a BedrockAgentCore Gateway",
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
          "AWS::BedrockAgentCore::Gateway",
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
      description: "Get a BedrockAgentCore Gateway",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the BedrockAgentCore Gateway",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::BedrockAgentCore::Gateway",
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
      description: "Update a BedrockAgentCore Gateway",
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
        const identifier = existing.GatewayIdentifier?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::BedrockAgentCore::Gateway",
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
          "AWS::BedrockAgentCore::Gateway",
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
      description: "Delete a BedrockAgentCore Gateway",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the BedrockAgentCore Gateway",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::BedrockAgentCore::Gateway",
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
      description: "Sync BedrockAgentCore Gateway state from AWS",
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
        const identifier = existing.GatewayIdentifier?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::BedrockAgentCore::Gateway",
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
      description: "List BedrockAgentCore Gateway resources",
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
          "AWS::BedrockAgentCore::Gateway",
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
            (item.properties?.GatewayIdentifier?.toString() ?? item.identifier)
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
