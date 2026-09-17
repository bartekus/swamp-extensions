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

// Auto-generated extension model for @swamp/aws/datasync/location-object-storage
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for DataSync LocationObjectStorage (AWS::DataSync::LocationObjectStorage).
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
  Key: z.string().min(1).max(256).regex(new RegExp("^[a-zA-Z0-9\\s+=._:/-]+$"))
    .describe("The key for an AWS resource tag."),
  Value: z.string().min(1).max(256).regex(
    new RegExp("^[a-zA-Z0-9\\s+=._:@/-]+$"),
  ).describe("The value for an AWS resource tag."),
});

const GoogleOidcConfigSchema = z.object({
  ProjectName: z.string().min(6).max(30).regex(
    new RegExp("^[a-z][a-z0-9-]{4,28}[a-z0-9]$"),
  ).describe("The human-readable Google Cloud project name."),
  ProjectNumber: z.string().min(1).max(20).regex(new RegExp("^[0-9]+$"))
    .describe("The numeric Google Cloud project ID, as a string."),
  IdentityPoolName: z.string().min(4).max(32).regex(
    new RegExp("^(?!gcp-)[a-z][a-z0-9-]{2,30}[a-z0-9]$"),
  ).describe(
    "The name of the Google Cloud workload identity pool that DataSync federates with.",
  ),
  IdentityProviderName: z.string().min(4).max(32).regex(
    new RegExp("^(?!gcp-)[a-z][a-z0-9-]{2,30}[a-z0-9]$"),
  ).describe(
    "The name of the OIDC identity provider configured in the Google Cloud workload identity pool.",
  ),
});

const ObjectStorageExternalIdentityConfigSchema = z.object({
  GoogleOidc: GoogleOidcConfigSchema.describe(
    "Specifies the Google Cloud workload identity federation configuration that DataSync uses to obtain an access token for your Google Cloud Storage bucket.",
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
  AccessKey: z.string().min(1).max(200).regex(new RegExp("^.+$")).describe(
    "Optional. The access key is used if credentials are required to access the self-managed object storage server.",
  ).optional(),
  AgentArns: z.array(
    z.string().max(128).regex(
      new RegExp(
        "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):datasync:[a-z\\-0-9]+:[0-9]{12}:agent/agent-[0-9a-z]{17}$",
      ),
    ),
  ).describe(
    "Specifies the Amazon Resource Names (ARNs) of the DataSync agents that can connect with your object storage system. If you are setting up an agentless cross-cloud transfer, you do not need to specify a value for this parameter.",
  ).optional(),
  BucketName: z.string().min(3).max(63).regex(
    new RegExp("^[a-zA-Z0-9_\\-\\+\\./\\(\\)\\$\\p{Zs}]+$", "u"),
  ).describe(
    "The name of the bucket on the self-managed object storage server.",
  ).optional(),
  SecretKey: z.string().min(8).max(200).regex(new RegExp("^.+$")).describe(
    "Optional. The secret key is used if credentials are required to access the self-managed object storage server.",
  ).optional(),
  ServerCertificate: z.string().max(32768).describe(
    "X.509 PEM content containing a certificate authority or chain to trust.",
  ).optional(),
  ServerHostname: z.string().max(255).regex(
    new RegExp(
      "^(([a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9\\-]*[A-Za-z0-9])$",
    ),
  ).describe(
    "The name of the self-managed object storage server. This value is the IP address or Domain Name Service (DNS) name of the object storage server.",
  ).optional(),
  ServerPort: z.number().int().min(1).max(65536).describe(
    "The port that your self-managed server accepts inbound network traffic on.",
  ).optional(),
  ServerProtocol: z.enum(["HTTPS", "HTTP"]).describe(
    "The protocol that the object storage server uses to communicate.",
  ).optional(),
  Subdirectory: z.string().max(4096).regex(
    new RegExp("^[a-zA-Z0-9_\\-\\+\\./\\(\\)\\p{Zs}]*$", "u"),
  ).describe(
    "The subdirectory in the self-managed object storage server that is used to read data from.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this resource.",
  ).optional(),
  CmkSecretConfig: z.object({
    KmsKeyArn: z.string().max(2048).regex(
      new RegExp(
        "^(arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):kms:[a-z-0-9]+:[0-9]{12}:key/.*|)$",
      ),
    ).describe(
      "Specifies the ARN for the customer-managed AWS KMS key used to encrypt the secret specified for SecretArn. DataSync provides this key to AWS Secrets Manager.",
    ).optional(),
  }).describe(
    "Specifies configuration information for a DataSync-managed secret, such as an authentication token or set of credentials that DataSync uses to access a specific transfer location, and a customer-managed AWS KMS key.",
  ).optional(),
  CustomSecretConfig: z.object({
    SecretAccessRoleArn: z.string().max(2048).regex(
      new RegExp(
        "^(arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):iam::[0-9]{12}:role/.*|)$",
      ),
    ).describe(
      "Specifies the ARN for the AWS Identity and Access Management role that DataSync uses to access the secret specified for SecretArn.",
    ),
  }).describe(
    "Specifies configuration information for a customer-managed secret, such as an authentication token or set of credentials that DataSync uses to access a specific transfer location, and an IAM role that DataSync can assume and access the customer-managed secret.",
  ).optional(),
  FederatedIdentity: z.object({
    AwsIamRole: z.string().max(2048).regex(
      new RegExp(
        "^(arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):iam::[0-9]{12}:role/.*|)$",
      ),
    ).describe(
      "Specifies the ARN of the AWS Identity and Access Management (IAM) role that DataSync assumes to mint the OIDC token used to authenticate with the identity provider.",
    ).optional(),
    ExternalIdentity: ObjectStorageExternalIdentityConfigSchema.describe(
      "Specifies the external (non-AWS) identity provider that DataSync federates with to access your object storage location.",
    ).optional(),
  }).describe(
    "Specifies the identity federation configuration that DataSync uses to access your object storage location using an OpenID Connect (OIDC) token.",
  ).optional(),
});

const StateSchema = z.object({
  AccessKey: z.string().optional(),
  AgentArns: z.array(z.string()).optional(),
  BucketName: z.string().optional(),
  SecretKey: z.string().optional(),
  ServerCertificate: z.string().optional(),
  ServerHostname: z.string().optional(),
  ServerPort: z.number().optional(),
  ServerProtocol: z.string().optional(),
  Subdirectory: z.string().optional(),
  Tags: z.array(TagSchema).optional(),
  LocationArn: z.string(),
  LocationUri: z.string().optional(),
  CmkSecretConfig: z.object({
    SecretArn: z.string(),
    KmsKeyArn: z.string(),
  }).optional(),
  CustomSecretConfig: z.object({
    SecretArn: z.string(),
    SecretAccessRoleArn: z.string(),
  }).optional(),
  ManagedSecretConfig: z.object({
    SecretArn: z.string(),
  }).optional(),
  FederatedIdentity: z.object({
    AwsIamRole: z.string(),
    ExternalIdentity: ObjectStorageExternalIdentityConfigSchema,
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  AccessKey: z.string().min(1).max(200).regex(new RegExp("^.+$")).describe(
    "Optional. The access key is used if credentials are required to access the self-managed object storage server.",
  ).optional(),
  AgentArns: z.array(
    z.string().max(128).regex(
      new RegExp(
        "^arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):datasync:[a-z\\-0-9]+:[0-9]{12}:agent/agent-[0-9a-z]{17}$",
      ),
    ),
  ).describe(
    "Specifies the Amazon Resource Names (ARNs) of the DataSync agents that can connect with your object storage system. If you are setting up an agentless cross-cloud transfer, you do not need to specify a value for this parameter.",
  ).optional(),
  BucketName: z.string().min(3).max(63).regex(
    new RegExp("^[a-zA-Z0-9_\\-\\+\\./\\(\\)\\$\\p{Zs}]+$", "u"),
  ).describe(
    "The name of the bucket on the self-managed object storage server.",
  ).optional(),
  SecretKey: z.string().min(8).max(200).regex(new RegExp("^.+$")).describe(
    "Optional. The secret key is used if credentials are required to access the self-managed object storage server.",
  ).optional(),
  ServerCertificate: z.string().max(32768).describe(
    "X.509 PEM content containing a certificate authority or chain to trust.",
  ).optional(),
  ServerHostname: z.string().max(255).regex(
    new RegExp(
      "^(([a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9\\-]*[A-Za-z0-9])$",
    ),
  ).describe(
    "The name of the self-managed object storage server. This value is the IP address or Domain Name Service (DNS) name of the object storage server.",
  ).optional(),
  ServerPort: z.number().int().min(1).max(65536).describe(
    "The port that your self-managed server accepts inbound network traffic on.",
  ).optional(),
  ServerProtocol: z.enum(["HTTPS", "HTTP"]).describe(
    "The protocol that the object storage server uses to communicate.",
  ).optional(),
  Subdirectory: z.string().max(4096).regex(
    new RegExp("^[a-zA-Z0-9_\\-\\+\\./\\(\\)\\p{Zs}]*$", "u"),
  ).describe(
    "The subdirectory in the self-managed object storage server that is used to read data from.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this resource.",
  ).optional(),
  CmkSecretConfig: z.object({
    KmsKeyArn: z.string().max(2048).regex(
      new RegExp(
        "^(arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):kms:[a-z-0-9]+:[0-9]{12}:key/.*|)$",
      ),
    ).describe(
      "Specifies the ARN for the customer-managed AWS KMS key used to encrypt the secret specified for SecretArn. DataSync provides this key to AWS Secrets Manager.",
    ).optional(),
  }).describe(
    "Specifies configuration information for a DataSync-managed secret, such as an authentication token or set of credentials that DataSync uses to access a specific transfer location, and a customer-managed AWS KMS key.",
  ).optional(),
  CustomSecretConfig: z.object({
    SecretAccessRoleArn: z.string().max(2048).regex(
      new RegExp(
        "^(arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):iam::[0-9]{12}:role/.*|)$",
      ),
    ).describe(
      "Specifies the ARN for the AWS Identity and Access Management role that DataSync uses to access the secret specified for SecretArn.",
    ).optional(),
  }).describe(
    "Specifies configuration information for a customer-managed secret, such as an authentication token or set of credentials that DataSync uses to access a specific transfer location, and an IAM role that DataSync can assume and access the customer-managed secret.",
  ).optional(),
  FederatedIdentity: z.object({
    AwsIamRole: z.string().max(2048).regex(
      new RegExp(
        "^(arn:(aws|aws-cn|aws-us-gov|aws-eusc|aws-iso|aws-iso-b):iam::[0-9]{12}:role/.*|)$",
      ),
    ).describe(
      "Specifies the ARN of the AWS Identity and Access Management (IAM) role that DataSync assumes to mint the OIDC token used to authenticate with the identity provider.",
    ).optional(),
    ExternalIdentity: ObjectStorageExternalIdentityConfigSchema.describe(
      "Specifies the external (non-AWS) identity provider that DataSync federates with to access your object storage location.",
    ).optional(),
  }).describe(
    "Specifies the identity federation configuration that DataSync uses to access your object storage location using an OpenID Connect (OIDC) token.",
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

/** Swamp extension model for DataSync LocationObjectStorage. Registered at `@swamp/aws/datasync/location-object-storage`. */
export const model = {
  type: "@swamp/aws/datasync/location-object-storage",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.09.17.1",
      description: "Added: FederatedIdentity",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "DataSync LocationObjectStorage resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a DataSync LocationObjectStorage",
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
          "AWS::DataSync::LocationObjectStorage",
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
      description: "Get a DataSync LocationObjectStorage",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the DataSync LocationObjectStorage",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::DataSync::LocationObjectStorage",
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
      description: "Update a DataSync LocationObjectStorage",
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
        const identifier = existing.LocationArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::DataSync::LocationObjectStorage",
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
          "AWS::DataSync::LocationObjectStorage",
          identifier,
          currentState,
          desiredState,
          ["BucketName"],
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
      description: "Delete a DataSync LocationObjectStorage",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the DataSync LocationObjectStorage",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::DataSync::LocationObjectStorage",
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
      description: "Sync DataSync LocationObjectStorage state from AWS",
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
        const identifier = existing.LocationArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::DataSync::LocationObjectStorage",
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
      description: "List DataSync LocationObjectStorage resources",
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
          "AWS::DataSync::LocationObjectStorage",
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
            (item.properties?.LocationArn?.toString() ?? item.identifier)
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
