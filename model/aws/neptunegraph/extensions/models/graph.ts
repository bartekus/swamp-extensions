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

// Auto-generated extension model for @swamp/aws/neptunegraph/graph
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for NeptuneGraph Graph (AWS::NeptuneGraph::Graph).
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

const NeptuneImportOptionsSchema = z.object({
  PreserveDefaultVertexLabels: z.boolean().describe(
    "Neptune Analytics supports label-less vertices and no labels are assigned unless one is explicitly provided. Neptune assigns default labels when none is explicitly provided. When importing the data into Neptune Analytics, the default vertex labels can be omitted by setting preserveDefaultVertexLabels to false. Note that if the vertex only has default labels, and has no other properties or edges, then the vertex will effectively not get imported into Neptune Analytics when preserveDefaultVertexLabels is set to false.",
  ).optional(),
  S3ExportKmsKeyId: z.string().min(1).max(1024).describe(
    "The KMS key to use to encrypt data in the S3 bucket where the graph data is exported.",
  ),
  S3ExportPath: z.string().min(1).max(1024).describe(
    "The path to an S3 bucket from which to import data.",
  ),
  PreserveEdgeIds: z.boolean().describe(
    "Neptune Analytics currently does not support user defined edge ids. The edge ids are not imported by default. They are imported if preserveEdgeIds is set to true, and ids are stored as properties on the relationships with the property name neptuneEdgeId.",
  ).optional(),
});

const ImportOptionsSchema = z.object({
  Neptune: NeptuneImportOptionsSchema.describe(
    "Options for importing data from a Neptune database.",
  ).optional(),
});

const TagSchema = z.object({
  Value: z.string().min(0).max(256).describe(
    "The value for the tag. You can specify a value that is 0 to 256 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ).optional(),
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
  PublicConnectivity: z.boolean().describe(
    "Specifies whether the Graph can be reached over the internet. Access to all graphs requires IAM authentication. When the Graph is publicly reachable, its Domain Name System (DNS) endpoint resolves to the public IP address from the internet. When the Graph isn't publicly reachable, you need to create a PrivateGraphEndpoint in a given VPC to ensure the DNS name resolves to a private IP address that is reachable from the VPC. _Default_: If not specified, the default value is false.",
  ).optional(),
  KmsKeyIdentifier: z.string().min(1).max(1024).regex(
    new RegExp(
      "arn:aws(|-cn|-us-gov|-iso|-iso-b|-iso-e|-iso-f|-eusc):kms:[a-zA-Z0-9-]*:[0-9]{12}:key/[a-zA-Z0-9-]{36}",
    ),
  ).describe(
    "The ARN of the KMS key used to encrypt data in the Neptune Analytics graph. If not specified, the graph is encrypted with an AWS managed key.",
  ).optional(),
  GraphName: z.string().min(1).max(63).regex(
    new RegExp("^[a-zA-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$"),
  ).describe(
    "Contains a user-supplied name for the Graph. If you don't specify a name, we generate a unique Graph Name using a combination of Stack Name and a UUID comprising of 4 characters. _Important_: If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.",
  ).optional(),
  ImportTask: z.object({
    Format: z.enum(["CSV", "OPEN_CYPHER", "PARQUET", "NTRIPLES"]).describe(
      "Specifies the format of S3 data to be imported. Valid values are CSV, which identifies the Gremlin CSV format, OPEN_CYPHER, which identifies the openCypher load format, or NTRIPLES, which identifies the RDF n-triples format.",
    ).optional(),
    BlankNodeHandling: z.enum(["convertToIri"]).describe(
      "The method to handle blank nodes in the dataset. Currently, only convertToIri is supported, meaning blank nodes are converted to unique IRIs at load time. Must be provided when format is NTRIPLES",
    ).optional(),
    ParquetType: z.enum(["COLUMNAR"]).describe(
      "The parquet type of the import task. Required when Format is PARQUET.",
    ).optional(),
    FailOnError: z.boolean().describe(
      "If set to true, the task halts when an import error is encountered. If set to false, the task skips the data that caused the error and continues if possible.",
    ).optional(),
    MaxProvisionedMemory: z.number().int().min(16).max(24576).describe(
      "The maximum provisioned memory-optimized Neptune Capacity Units (m-NCUs) to use for the graph. Default: 1024, or the approved upper limit for your account. If both the minimum and maximum values are specified, the final provisioned-memory will be chosen per the actual size of your imported data. If neither value is specified, 128 m-NCUs are used.",
    ).optional(),
    Source: z.string().describe(
      "A URL identifying to the location of the data to be imported. This can be an Amazon S3 path, or can point to a Neptune database endpoint or snapshot.",
    ),
    RoleArn: z.string().min(1).max(1024).regex(
      new RegExp(
        "arn:aws[^:]*:iam::[0-9]{12}:(role|role/service-role)(/[\\w+=,.@-]+)+",
      ),
    ).describe(
      "The ARN of the IAM role that will allow access to the data that is to be imported.",
    ),
    ImportOptions: ImportOptionsSchema.describe(
      "Contains options for controlling the import process. For example, if the failOnError key is set to false, the import skips the data that caused the error and continues if possible (whereas if set to true, the default, or if omitted, the import operation halts immediately when an error is encountered).",
    ).optional(),
    MinProvisionedMemory: z.number().int().min(16).max(24576).describe(
      "The minimum provisioned memory-optimized Neptune Capacity Units (m-NCUs) to use for the graph. Default: 16",
    ).optional(),
  }).describe(
    "The details of the import task to use to create the graph. When specified, the graph is created using CreateGraphUsingImportTask and data is imported from the supplied source.",
  ).optional(),
  ReplicaCount: z.number().int().describe(
    "Specifies the number of replicas you want when finished. All replicas will be provisioned in different availability zones. Replica Count should always be less than or equal to 2. _Default_: If not specified, the default value is 1.",
  ).optional(),
  ProvisionedMemory: z.number().int().describe("Memory for the Graph."),
  DeletionProtection: z.boolean().describe(
    "Value that indicates whether the Graph has deletion protection enabled. The graph can't be deleted when deletion protection is enabled. _Default_: If not specified, the default value is true.",
  ).optional(),
  VectorSearchConfiguration: z.object({
    VectorSearchDimension: z.number().int().describe(
      "The vector search dimension",
    ),
  }).describe("Vector Search Configuration").optional(),
  Tags: z.array(TagSchema).describe("The tags associated with this graph.")
    .optional(),
});

const StateSchema = z.object({
  PublicConnectivity: z.boolean().optional(),
  KmsKeyIdentifier: z.string().optional(),
  GraphName: z.string().optional(),
  ImportTask: z.object({
    Format: z.string(),
    BlankNodeHandling: z.string(),
    ParquetType: z.string(),
    FailOnError: z.boolean(),
    MaxProvisionedMemory: z.number(),
    Source: z.string(),
    RoleArn: z.string(),
    ImportOptions: ImportOptionsSchema,
    MinProvisionedMemory: z.number(),
  }).optional(),
  Endpoint: z.string().optional(),
  GraphArn: z.string().optional(),
  ReplicaCount: z.number().optional(),
  GraphId: z.string(),
  ProvisionedMemory: z.number().optional(),
  DeletionProtection: z.boolean().optional(),
  VectorSearchConfiguration: z.object({
    VectorSearchDimension: z.number(),
  }).optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  PublicConnectivity: z.boolean().describe(
    "Specifies whether the Graph can be reached over the internet. Access to all graphs requires IAM authentication. When the Graph is publicly reachable, its Domain Name System (DNS) endpoint resolves to the public IP address from the internet. When the Graph isn't publicly reachable, you need to create a PrivateGraphEndpoint in a given VPC to ensure the DNS name resolves to a private IP address that is reachable from the VPC. _Default_: If not specified, the default value is false.",
  ).optional(),
  KmsKeyIdentifier: z.string().min(1).max(1024).regex(
    new RegExp(
      "arn:aws(|-cn|-us-gov|-iso|-iso-b|-iso-e|-iso-f|-eusc):kms:[a-zA-Z0-9-]*:[0-9]{12}:key/[a-zA-Z0-9-]{36}",
    ),
  ).describe(
    "The ARN of the KMS key used to encrypt data in the Neptune Analytics graph. If not specified, the graph is encrypted with an AWS managed key.",
  ).optional(),
  GraphName: z.string().min(1).max(63).regex(
    new RegExp("^[a-zA-z][a-zA-Z0-9]*(-[a-zA-Z0-9]+)*$"),
  ).describe(
    "Contains a user-supplied name for the Graph. If you don't specify a name, we generate a unique Graph Name using a combination of Stack Name and a UUID comprising of 4 characters. _Important_: If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.",
  ).optional(),
  ImportTask: z.object({
    Format: z.enum(["CSV", "OPEN_CYPHER", "PARQUET", "NTRIPLES"]).describe(
      "Specifies the format of S3 data to be imported. Valid values are CSV, which identifies the Gremlin CSV format, OPEN_CYPHER, which identifies the openCypher load format, or NTRIPLES, which identifies the RDF n-triples format.",
    ).optional(),
    BlankNodeHandling: z.enum(["convertToIri"]).describe(
      "The method to handle blank nodes in the dataset. Currently, only convertToIri is supported, meaning blank nodes are converted to unique IRIs at load time. Must be provided when format is NTRIPLES",
    ).optional(),
    ParquetType: z.enum(["COLUMNAR"]).describe(
      "The parquet type of the import task. Required when Format is PARQUET.",
    ).optional(),
    FailOnError: z.boolean().describe(
      "If set to true, the task halts when an import error is encountered. If set to false, the task skips the data that caused the error and continues if possible.",
    ).optional(),
    MaxProvisionedMemory: z.number().int().min(16).max(24576).describe(
      "The maximum provisioned memory-optimized Neptune Capacity Units (m-NCUs) to use for the graph. Default: 1024, or the approved upper limit for your account. If both the minimum and maximum values are specified, the final provisioned-memory will be chosen per the actual size of your imported data. If neither value is specified, 128 m-NCUs are used.",
    ).optional(),
    Source: z.string().describe(
      "A URL identifying to the location of the data to be imported. This can be an Amazon S3 path, or can point to a Neptune database endpoint or snapshot.",
    ).optional(),
    RoleArn: z.string().min(1).max(1024).regex(
      new RegExp(
        "arn:aws[^:]*:iam::[0-9]{12}:(role|role/service-role)(/[\\w+=,.@-]+)+",
      ),
    ).describe(
      "The ARN of the IAM role that will allow access to the data that is to be imported.",
    ).optional(),
    ImportOptions: ImportOptionsSchema.describe(
      "Contains options for controlling the import process. For example, if the failOnError key is set to false, the import skips the data that caused the error and continues if possible (whereas if set to true, the default, or if omitted, the import operation halts immediately when an error is encountered).",
    ).optional(),
    MinProvisionedMemory: z.number().int().min(16).max(24576).describe(
      "The minimum provisioned memory-optimized Neptune Capacity Units (m-NCUs) to use for the graph. Default: 16",
    ).optional(),
  }).describe(
    "The details of the import task to use to create the graph. When specified, the graph is created using CreateGraphUsingImportTask and data is imported from the supplied source.",
  ).optional(),
  ReplicaCount: z.number().int().describe(
    "Specifies the number of replicas you want when finished. All replicas will be provisioned in different availability zones. Replica Count should always be less than or equal to 2. _Default_: If not specified, the default value is 1.",
  ).optional(),
  ProvisionedMemory: z.number().int().describe("Memory for the Graph.")
    .optional(),
  DeletionProtection: z.boolean().describe(
    "Value that indicates whether the Graph has deletion protection enabled. The graph can't be deleted when deletion protection is enabled. _Default_: If not specified, the default value is true.",
  ).optional(),
  VectorSearchConfiguration: z.object({
    VectorSearchDimension: z.number().int().describe(
      "The vector search dimension",
    ).optional(),
  }).describe("Vector Search Configuration").optional(),
  Tags: z.array(TagSchema).describe("The tags associated with this graph.")
    .optional(),
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

/** Swamp extension model for NeptuneGraph Graph. Registered at `@swamp/aws/neptunegraph/graph`. */
export const model = {
  type: "@swamp/aws/neptunegraph/graph",
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
      toVersion: "2026.04.22.1",
      description: "Added: KmsKeyIdentifier",
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
      toVersion: "2026.09.11.1",
      description: "Added: ImportTask",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "NeptuneGraph Graph resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a NeptuneGraph Graph",
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
          "AWS::NeptuneGraph::Graph",
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
      description: "Get a NeptuneGraph Graph",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the NeptuneGraph Graph",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::NeptuneGraph::Graph",
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
      description: "Update a NeptuneGraph Graph",
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
        const identifier = existing.GraphId?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::NeptuneGraph::Graph",
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
          "AWS::NeptuneGraph::Graph",
          identifier,
          currentState,
          desiredState,
          [
            "GraphName",
            "ReplicaCount",
            "ImportTask",
            "VectorSearchConfiguration",
            "KmsKeyIdentifier",
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
      description: "Delete a NeptuneGraph Graph",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the NeptuneGraph Graph",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::NeptuneGraph::Graph",
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
      description: "Sync NeptuneGraph Graph state from AWS",
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
        const identifier = existing.GraphId?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::NeptuneGraph::Graph",
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
      description: "List NeptuneGraph Graph resources",
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
          "AWS::NeptuneGraph::Graph",
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
            (item.properties?.GraphId?.toString() ?? item.identifier).replace(
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
