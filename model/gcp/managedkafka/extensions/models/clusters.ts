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

// Auto-generated extension model for @swamp/gcp/managedkafka/clusters
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Managed Service for Apache Kafka Clusters.
 *
 * An Apache Kafka cluster deployed in a location.
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  deleteResource,
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/gcp.ts";

/** Construct the fully-qualified resource name from parent and short name. */
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/clusters/${shortName}`;
}

const BASE_URL = "https://managedkafka.googleapis.com/";

const GET_CONFIG = {
  "id": "managedkafka.projects.locations.clusters.get",
  "path": "v1/{+name}",
  "httpMethod": "GET",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "name": {
      "location": "path",
      "required": true,
    },
    "view": {
      "location": "query",
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "managedkafka.projects.locations.clusters.create",
  "path": "v1/{+parent}/clusters",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "clusterId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "managedkafka.projects.locations.clusters.patch",
  "path": "v1/{+name}",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "name": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
    "updateMask": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "managedkafka.projects.locations.clusters.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "name": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "managedkafka.projects.locations.clusters.list",
  "path": "v1/{+parent}/clusters",
  "httpMethod": "GET",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "orderBy": {
      "location": "query",
    },
    "pageSize": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const GlobalArgsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).describe(
    "GCP OAuth2 access token; overrides GCP_ACCESS_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).describe(
    "GCP service account JSON credentials; overrides GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  project: z.string().describe(
    "GCP project ID; overrides GCP_PROJECT / GOOGLE_CLOUD_PROJECT environment variables.",
  ).optional(),
  scopes: z.string().describe(
    "Comma-separated OAuth scopes to request when minting access tokens via gcloud. Defaults to the API's Discovery Document scopes.",
  ).optional(),
  quotaProject: z.string().describe(
    "GCP project ID for quota and billing attribution; sets the x-goog-user-project header. Overrides GOOGLE_CLOUD_QUOTA_PROJECT environment variable. Required for APIs like Cloud Identity when using user credentials.",
  ).optional(),
  apiEndpoint: z.string().describe(
    "Custom API endpoint for emulators; overrides GCP_API_ENDPOINT environment variable. Defaults to the service's production URL.",
  ).optional(),
  brokerCapacityConfig: z.object({
    diskSizeGib: z.string().describe(
      "Optional. The disk to provision for each broker in Gibibytes. Minimum: 100 GiB.",
    ).optional(),
  }).describe(
    "Optional. Capacity configuration at a per-broker level within the Kafka cluster. The config will be appled to each broker in the cluster.",
  ).optional(),
  capacityConfig: z.object({
    memoryBytes: z.string().describe(
      "Required. The memory to provision for the cluster in bytes. The CPU:memory ratio (vCPU:GiB) must be between 1:1 and 1:8. Minimum: 3221225472 (3 GiB).",
    ).optional(),
    vcpuCount: z.string().describe(
      "Required. The number of vCPUs to provision for the cluster. Minimum: 3.",
    ).optional(),
  }).describe("Required. Capacity configuration for the Kafka cluster.")
    .optional(),
  gcpConfig: z.object({
    accessConfig: z.object({
      networkConfigs: z.array(z.object({
        subnet: z.string().describe(
          "Required. Name of the VPC subnet in which to create Private Service Connect (PSC) endpoints for the Kafka brokers and bootstrap address. Structured like: projects/{project}/regions/{region}/subnetworks/{subnet_id} The subnet must be located in the same region as the Kafka cluster. The project may differ. Multiple subnets from the same parent network must not be specified.",
        ).optional(),
      })).describe(
        "Required. Virtual Private Cloud (VPC) networks that must be granted direct access to the Kafka cluster. Minimum of 1 network is required. Maximum 10 networks can be specified.",
      ).optional(),
      publicClusterConfig: z.object({
        allowedSourceIpRanges: z.array(z.string()).describe(
          "Required. The list of IPv4 ranges in CIDR notation that are allowed to connect to the public Kafka broker endpoints. The Kafka cluster should only be exposed to trusted external ranges. A maximum of 500 IP ranges can be specified and no single range can be larger than a `/16`. This field is required if PublicClusterConfig is specified.",
        ).optional(),
      }).describe(
        "Optional. The configuration for public connectivity to the Kafka cluster.",
      ).optional(),
    }).describe("Required. Access configuration for the Kafka cluster.")
      .optional(),
    kmsKey: z.string().describe(
      "Optional. Immutable. The Cloud KMS Key name to use for encryption. The key must be located in the same region as the cluster and cannot be changed. Structured like: projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}.",
    ).optional(),
  }).describe(
    "Required. Configuration properties for a Kafka cluster deployed to Google Cloud Platform.",
  ).optional(),
  kafkaVersion: z.string().describe(
    "Optional. The Apache Kafka version of the cluster (for example, `3.7.x`, `4.3.x`). If not specified during cluster creation, defaults to `3.7.x`.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Labels as key value pairs.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The name of the cluster. Structured like: projects/{project_number}/locations/{location}/clusters/{cluster_id}",
  ).optional(),
  rebalanceConfig: z.object({
    mode: z.enum([
      "MODE_UNSPECIFIED",
      "NO_REBALANCE",
      "AUTO_REBALANCE_ON_SCALE_UP",
    ]).describe(
      "Optional. The rebalance behavior for the cluster. When not specified, defaults to `NO_REBALANCE`.",
    ).optional(),
  }).describe("Optional. Rebalance configuration for the Kafka cluster.")
    .optional(),
  tlsConfig: z.object({
    sslPrincipalMappingRules: z.string().describe(
      'Optional. A list of rules for mapping from SSL principal names to short names. These are applied in order by Kafka. Refer to the Apache Kafka documentation for `ssl.principal.mapping.rules` for the precise formatting details and syntax. Example: "RULE:^CN=(.*?),OU=ServiceUsers.*$/$1@example.com/,DEFAULT" This is a static Kafka broker configuration. Setting or modifying this field will trigger a rolling restart of the Kafka brokers to apply the change. An empty string means no rules are applied (Kafka default).',
    ).optional(),
    trustConfig: z.object({
      casConfigs: z.array(z.object({
        caPool: z.string().describe(
          "Required. The name of the CA pool to pull CA certificates from. Structured like: projects/{project}/locations/{location}/caPools/{ca_pool}. The CA pool does not need to be in the same project or location as the Kafka cluster.",
        ).optional(),
      })).describe(
        "Optional. Configuration for the Google Certificate Authority Service. Maximum 10.",
      ).optional(),
    }).describe(
      "Optional. The configuration of the broker truststore. If specified, clients can use mTLS for authentication.",
    ).optional(),
  }).describe("Optional. TLS configuration for the Kafka cluster.").optional(),
  updateOptions: z.object({
    allowBrokerDownscaleOnClusterUpscale: z.boolean().describe(
      "Optional. If true, allows an update operation that increases the total vCPU and/or memory allocation of the cluster to significantly decrease the per-broker vCPU and/or memory allocation. This can result in reduced performance and availability. By default, the update operation will fail if an upscale request results in a vCPU or memory allocation for the brokers that is smaller than 90% of the current broker size.",
    ).optional(),
  }).describe(
    "Optional. UpdateOptions represents options that control how updates to the cluster are applied.",
  ).optional(),
  clusterId: z.string().describe(
    "Required. The ID to use for the cluster, which will become the final component of the cluster's name. The ID must be 1-63 characters long, and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` to comply with RFC 1035. This value is structured like: `my-cluster-id`.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. An optional request ID to identify requests. Specify a unique request ID to avoid duplication of requests. If a request times out or fails, retrying with the same ID allows the server to recognize the previous attempt. For at least 60 minutes, the server ignores duplicate requests bearing the same ID. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID within 60 minutes of the last request, the server checks if an original operation with the same request ID was received. If so, the server ignores the second request. The request ID must be a valid UUID. A zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  bootstrapAddress: z.string().optional(),
  brokerCapacityConfig: z.object({
    diskSizeGib: z.string(),
  }).optional(),
  brokerDetails: z.array(z.object({
    brokerIndex: z.string(),
    nodeId: z.string(),
    rack: z.string(),
  })).optional(),
  capacityConfig: z.object({
    memoryBytes: z.string(),
    vcpuCount: z.string(),
  }).optional(),
  createTime: z.string().optional(),
  effectiveCapacityConfig: z.object({
    brokerCount: z.string(),
    brokerDiskSizeGib: z.string(),
  }).optional(),
  gcpConfig: z.object({
    accessConfig: z.object({
      networkConfigs: z.array(z.object({
        subnet: z.string(),
      })),
      publicClusterConfig: z.object({
        allowedSourceIpRanges: z.array(z.string()),
      }),
    }),
    kmsKey: z.string(),
  }).optional(),
  kafkaVersion: z.string().optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  name: z.string(),
  publicClusterDetails: z.object({
    discoveryDnsRecords: z.array(z.string()),
    externalIpAddresses: z.array(z.string()),
  }).optional(),
  rebalanceConfig: z.object({
    mode: z.string(),
  }).optional(),
  satisfiesPzi: z.boolean().optional(),
  satisfiesPzs: z.boolean().optional(),
  state: z.string().optional(),
  tlsConfig: z.object({
    sslPrincipalMappingRules: z.string(),
    trustConfig: z.object({
      casConfigs: z.array(z.object({
        caPool: z.string(),
      })),
    }),
  }).optional(),
  updateOptions: z.object({
    allowBrokerDownscaleOnClusterUpscale: z.boolean(),
  }).optional(),
  updateTime: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  brokerCapacityConfig: z.object({
    diskSizeGib: z.string().describe(
      "Optional. The disk to provision for each broker in Gibibytes. Minimum: 100 GiB.",
    ).optional(),
  }).describe(
    "Optional. Capacity configuration at a per-broker level within the Kafka cluster. The config will be appled to each broker in the cluster.",
  ).optional(),
  capacityConfig: z.object({
    memoryBytes: z.string().describe(
      "Required. The memory to provision for the cluster in bytes. The CPU:memory ratio (vCPU:GiB) must be between 1:1 and 1:8. Minimum: 3221225472 (3 GiB).",
    ).optional(),
    vcpuCount: z.string().describe(
      "Required. The number of vCPUs to provision for the cluster. Minimum: 3.",
    ).optional(),
  }).describe("Required. Capacity configuration for the Kafka cluster.")
    .optional(),
  gcpConfig: z.object({
    accessConfig: z.object({
      networkConfigs: z.array(z.object({
        subnet: z.string().describe(
          "Required. Name of the VPC subnet in which to create Private Service Connect (PSC) endpoints for the Kafka brokers and bootstrap address. Structured like: projects/{project}/regions/{region}/subnetworks/{subnet_id} The subnet must be located in the same region as the Kafka cluster. The project may differ. Multiple subnets from the same parent network must not be specified.",
        ).optional(),
      })).describe(
        "Required. Virtual Private Cloud (VPC) networks that must be granted direct access to the Kafka cluster. Minimum of 1 network is required. Maximum 10 networks can be specified.",
      ).optional(),
      publicClusterConfig: z.object({
        allowedSourceIpRanges: z.array(z.string()).describe(
          "Required. The list of IPv4 ranges in CIDR notation that are allowed to connect to the public Kafka broker endpoints. The Kafka cluster should only be exposed to trusted external ranges. A maximum of 500 IP ranges can be specified and no single range can be larger than a `/16`. This field is required if PublicClusterConfig is specified.",
        ).optional(),
      }).describe(
        "Optional. The configuration for public connectivity to the Kafka cluster.",
      ).optional(),
    }).describe("Required. Access configuration for the Kafka cluster.")
      .optional(),
    kmsKey: z.string().describe(
      "Optional. Immutable. The Cloud KMS Key name to use for encryption. The key must be located in the same region as the cluster and cannot be changed. Structured like: projects/{project}/locations/{location}/keyRings/{key_ring}/cryptoKeys/{crypto_key}.",
    ).optional(),
  }).describe(
    "Required. Configuration properties for a Kafka cluster deployed to Google Cloud Platform.",
  ).optional(),
  kafkaVersion: z.string().describe(
    "Optional. The Apache Kafka version of the cluster (for example, `3.7.x`, `4.3.x`). If not specified during cluster creation, defaults to `3.7.x`.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Labels as key value pairs.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The name of the cluster. Structured like: projects/{project_number}/locations/{location}/clusters/{cluster_id}",
  ).optional(),
  rebalanceConfig: z.object({
    mode: z.enum([
      "MODE_UNSPECIFIED",
      "NO_REBALANCE",
      "AUTO_REBALANCE_ON_SCALE_UP",
    ]).describe(
      "Optional. The rebalance behavior for the cluster. When not specified, defaults to `NO_REBALANCE`.",
    ).optional(),
  }).describe("Optional. Rebalance configuration for the Kafka cluster.")
    .optional(),
  tlsConfig: z.object({
    sslPrincipalMappingRules: z.string().describe(
      'Optional. A list of rules for mapping from SSL principal names to short names. These are applied in order by Kafka. Refer to the Apache Kafka documentation for `ssl.principal.mapping.rules` for the precise formatting details and syntax. Example: "RULE:^CN=(.*?),OU=ServiceUsers.*$/$1@example.com/,DEFAULT" This is a static Kafka broker configuration. Setting or modifying this field will trigger a rolling restart of the Kafka brokers to apply the change. An empty string means no rules are applied (Kafka default).',
    ).optional(),
    trustConfig: z.object({
      casConfigs: z.array(z.object({
        caPool: z.string().describe(
          "Required. The name of the CA pool to pull CA certificates from. Structured like: projects/{project}/locations/{location}/caPools/{ca_pool}. The CA pool does not need to be in the same project or location as the Kafka cluster.",
        ).optional(),
      })).describe(
        "Optional. Configuration for the Google Certificate Authority Service. Maximum 10.",
      ).optional(),
    }).describe(
      "Optional. The configuration of the broker truststore. If specified, clients can use mTLS for authentication.",
    ).optional(),
  }).describe("Optional. TLS configuration for the Kafka cluster.").optional(),
  updateOptions: z.object({
    allowBrokerDownscaleOnClusterUpscale: z.boolean().describe(
      "Optional. If true, allows an update operation that increases the total vCPU and/or memory allocation of the cluster to significantly decrease the per-broker vCPU and/or memory allocation. This can result in reduced performance and availability. By default, the update operation will fail if an upscale request results in a vCPU or memory allocation for the brokers that is smaller than 90% of the current broker size.",
    ).optional(),
  }).describe(
    "Optional. UpdateOptions represents options that control how updates to the cluster are applied.",
  ).optional(),
  clusterId: z.string().describe(
    "Required. The ID to use for the cluster, which will become the final component of the cluster's name. The ID must be 1-63 characters long, and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` to comply with RFC 1035. This value is structured like: `my-cluster-id`.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. An optional request ID to identify requests. Specify a unique request ID to avoid duplication of requests. If a request times out or fails, retrying with the same ID allows the server to recognize the previous attempt. For at least 60 minutes, the server ignores duplicate requests bearing the same ID. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID within 60 minutes of the last request, the server checks if an original operation with the same request ID was received. If so, the server ignores the second request. The request ID must be a valid UUID. A zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const _credentialKeys = new Set([
  "accessToken",
  "credentialsJson",
  "project",
  "scopes",
  "quotaProject",
  "apiEndpoint",
]);

function _buildGcpCredentials(
  g: Record<string, unknown>,
): ExplicitGcpCredentials {
  return {
    accessToken: g.accessToken as string | undefined,
    credentialsJson: g.credentialsJson as string | undefined,
    project: g.project as string | undefined,
    scopes: typeof g.scopes === "string"
      ? g.scopes.split(",").map((s: string) => s.trim())
      : undefined,
    quotaProject: g.quotaProject as string | undefined,
  };
}

/** Swamp extension model for Google Cloud Managed Service for Apache Kafka Clusters. Registered at `@swamp/gcp/managedkafka/clusters`. */
export const model = {
  type: "@swamp/gcp/managedkafka/clusters",
  version: "2026.09.15.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.02.2",
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
      toVersion: "2026.05.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.21.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.07.1",
      description: "Added: accessToken, credentialsJson, project",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.1",
      description: "Added: scopes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.29.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.30.1",
      description: "Added: brokerCapacityConfig",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "Added: kafkaVersion",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.08.1",
      description: "Removed: kafkaVersion",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { kafkaVersion: _kafkaVersion, ...rest } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.09.15.1",
      description: "Added: kafkaVersion",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "An Apache Kafka cluster deployed in a location.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a clusters",
      arguments: z.object({
        waitForReady: z.boolean().describe(
          "Wait for the resource to reach a ready state after creation (default: true)",
        ).optional(),
      }),
      execute: async (args: { waitForReady?: boolean }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["parent"] = `projects/${projectId}/locations/${
          String(g["location"] ?? "")
        }`;
        const body: Record<string, unknown> = {};
        if (g["brokerCapacityConfig"] !== undefined) {
          body["brokerCapacityConfig"] = g["brokerCapacityConfig"];
        }
        if (g["capacityConfig"] !== undefined) {
          body["capacityConfig"] = g["capacityConfig"];
        }
        if (g["gcpConfig"] !== undefined) body["gcpConfig"] = g["gcpConfig"];
        if (g["kafkaVersion"] !== undefined) {
          body["kafkaVersion"] = g["kafkaVersion"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["rebalanceConfig"] !== undefined) {
          body["rebalanceConfig"] = g["rebalanceConfig"];
        }
        if (g["tlsConfig"] !== undefined) body["tlsConfig"] = g["tlsConfig"];
        if (g["updateOptions"] !== undefined) {
          body["updateOptions"] = g["updateOptions"];
        }
        if (g["clusterId"] !== undefined) {
          params["clusterId"] = String(g["clusterId"]);
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          (args.waitForReady ?? true)
            ? {
              "statusField": "state",
              "readyValues": ["ACTIVE"],
              "failedValues": [],
            }
            : undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: {
              "parent": `projects/${projectId}/locations/${
                String(g["location"] ?? "")
              }`,
            },
            matchField: "name",
            matchValue: String(g["name"] ?? ""),
          },
          credentials,
        ) as StateData;
        const instanceName = ((g.name ?? result.name)?.toString() ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    get: {
      description: "Get a clusters",
      arguments: z.object({
        identifier: z.string().describe("The name of the clusters"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = buildResourceName(
          `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
          args.identifier,
        );
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName =
          ((g.name ?? result.name)?.toString() ?? args.identifier).replace(
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
      description: "Update clusters attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific clusters by name (e.g. one discovered by list)",
        ).optional(),
        waitForReady: z.boolean().describe(
          "Wait for the resource to reach a ready state after update (default: true)",
        ).optional(),
      }),
      execute: async (
        args: { identifier?: string; waitForReady?: boolean },
        context: any,
      ) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const instanceName =
          (g.name?.toString() ?? args.identifier ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error(
            "No existing state found - run create, get, or list first",
          );
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const params: Record<string, string> = { project: projectId };
        const existingName = existing["name"]?.toString();
        if (existingName && existingName.includes("/")) {
          params["name"] = existingName;
        } else {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            existingName ?? g["name"]?.toString() ?? "",
          );
        }
        const body: Record<string, unknown> = {};
        if (g["brokerCapacityConfig"] !== undefined) {
          body["brokerCapacityConfig"] = g["brokerCapacityConfig"];
        }
        if (g["capacityConfig"] !== undefined) {
          body["capacityConfig"] = g["capacityConfig"];
        }
        if (g["gcpConfig"] !== undefined) body["gcpConfig"] = g["gcpConfig"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["rebalanceConfig"] !== undefined) {
          body["rebalanceConfig"] = g["rebalanceConfig"];
        }
        if (g["tlsConfig"] !== undefined) body["tlsConfig"] = g["tlsConfig"];
        if (g["updateOptions"] !== undefined) {
          body["updateOptions"] = g["updateOptions"];
        }
        const updateMaskKeys = Object.keys(body);
        if (updateMaskKeys.length > 0) {
          params["updateMask"] = updateMaskKeys.join(",");
        }
        for (const key of Object.keys(existing)) {
          if (
            key === "fingerprint" || key === "labelFingerprint" ||
            key === "etag" || key.endsWith("Fingerprint")
          ) {
            body[key] = existing[key];
          }
        }
        const result = await updateResource(
          baseUrl,
          PATCH_CONFIG,
          params,
          body,
          GET_CONFIG,
          (args.waitForReady ?? true)
            ? {
              "statusField": "state",
              "readyValues": ["ACTIVE"],
              "failedValues": [],
            }
            : undefined,
          credentials,
        ) as StateData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the clusters",
      arguments: z.object({
        identifier: z.string().describe("The name of the clusters"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = buildResourceName(
          `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
          args.identifier,
        );
        const { existed } = await deleteResource(
          baseUrl,
          DELETE_CONFIG,
          params,
          credentials,
        );
        const instanceName = (g.name?.toString() ?? args.identifier).replace(
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
      description: "Sync clusters state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific clusters by name (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const instanceName =
          (g.name?.toString() ?? args.identifier ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error(
            "No existing state found - run create, get, or list first",
          );
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        try {
          const params: Record<string, string> = { project: projectId };
          const existingName = existing.name?.toString();
          if (existingName && existingName.includes("/")) {
            params["name"] = existingName;
          } else {
            const shortName = existingName ?? g["name"]?.toString();
            if (!shortName) throw new Error("No identifier found");
            params["name"] = buildResourceName(
              `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
              shortName,
            );
          }
          const result = await readResource(
            baseUrl,
            GET_CONFIG,
            params,
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
      description: "List clusters resources",
      arguments: z.object({
        filter: z.string().describe(
          "Optional. Filter expression for the result.",
        ).optional(),
        orderBy: z.string().describe(
          "Optional. Order by fields for the result.",
        ).optional(),
        pageSize: z.number().describe(
          "Optional. The maximum number of clusters to return. The service may return fewer than this value. If unspecified, server will pick an appropriate default.",
        ).optional(),
        maxPages: z.number().describe(
          "Maximum number of pages to fetch (default: 10)",
        ).optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["parent"] = `projects/${projectId}/locations/${
          String(g["location"] ?? "")
        }`;
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "clusters",
          (args.maxPages as number | undefined) ?? 10,
          credentials,
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as StateData;
          const instanceName = (item.name?.toString() ?? String(i)).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
          const handle = await context.writeResource(
            "state",
            instanceName,
            item,
          );
          dataHandles.push(handle);
        }
        return { dataHandles, result: { count: items.length, nextPageToken } };
      },
    },
  },
};
