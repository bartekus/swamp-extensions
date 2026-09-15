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

// Auto-generated extension model for @swamp/gcp/networkmanagement/global-connectivitytests
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Network Management Global.ConnectivityTests.
 *
 * A Connectivity Test for a network reachability analysis.
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
  return `${parent}/connectivityTests/${shortName}`;
}

const BASE_URL = "https://networkmanagement.googleapis.com/";

const GET_CONFIG = {
  "id": "networkmanagement.projects.locations.global.connectivityTests.get",
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
  },
} as const;

const INSERT_CONFIG = {
  "id": "networkmanagement.projects.locations.global.connectivityTests.create",
  "path": "v1/{+parent}/connectivityTests",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "parent": {
      "location": "path",
      "required": true,
    },
    "testId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "networkmanagement.projects.locations.global.connectivityTests.patch",
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
    "updateMask": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "networkmanagement.projects.locations.global.connectivityTests.delete",
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
  },
} as const;

const LIST_CONFIG = {
  "id": "networkmanagement.projects.locations.global.connectivityTests.list",
  "path": "v1/{+parent}/connectivityTests",
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
  bypassFirewallChecks: z.boolean().describe(
    "Whether the analysis should skip firewall checking. Default value is false.",
  ).optional(),
  description: z.string().describe(
    "The user-supplied description of the Connectivity Test. Maximum of 512 characters.",
  ).optional(),
  destination: z.object({
    appEngineVersion: z.object({
      uri: z.string().describe(
        "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions) name.",
      ).optional(),
    }).describe(
      "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions). Applicable only to source endpoint.",
    ).optional(),
    cloudFunction: z.object({
      uri: z.string().describe(
        "A [Cloud Function](https://cloud.google.com/functions) name.",
      ).optional(),
    }).describe(
      "A [Cloud Function](https://cloud.google.com/functions). Applicable only to source endpoint.",
    ).optional(),
    cloudRunJob: z.string().describe(
      "A [Cloud Run](https://cloud.google.com/run) [job](https://docs.cloud.google.com/run/docs/reference/rest/v2/projects.locations.jobs#Job) URI. Applicable only to source endpoint. The format is: projects/{project}/locations/{location}/jobs/{job}",
    ).optional(),
    cloudRunRevision: z.object({
      serviceUri: z.string().describe(
        "Output only. The URI of the Cloud Run service that the revision belongs to. The format is: projects/{project}/locations/{location}/services/{service}. Mutually exclusive with worker_pool_uri.",
      ).optional(),
      uri: z.string().describe(
        "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) URI. The format is: projects/{project}/locations/{location}/revisions/{revision}",
      ).optional(),
      workerPoolUri: z.string().describe(
        "Output only. The URI of the worker pool that the revision belongs to. The format is: projects/{project}/locations/{location}/workerPools/{workerPool}. Mutually exclusive with service_uri.",
      ).optional(),
    }).describe(
      "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) Applicable only to source endpoint.",
    ).optional(),
    cloudSqlInstance: z.string().describe(
      "A [Cloud SQL](https://cloud.google.com/sql) instance URI.",
    ).optional(),
    dmsPrivateConnection: z.string().describe(
      "A [DMS Private Connection](https://docs.cloud.google.com/database-migration/docs/reference/rest/v1/projects.locations.privateConnections) name format: projects/{project}/locations/{location}/privateConnections/{privateConnection}.",
    ).optional(),
    forwardingRule: z.string().describe(
      "A forwarding rule and its corresponding IP address represent the frontend configuration of a Google Cloud load balancer. Forwarding rules are also used for protocol forwarding, Private Service Connect and other network services to provide forwarding information in the control plane. Applicable only to destination endpoint. Format: `projects/{project}/global/forwardingRules/{id}` or `projects/{project}/regions/{region}/forwardingRules/{id}`",
    ).optional(),
    forwardingRuleTarget: z.enum([
      "FORWARDING_RULE_TARGET_UNSPECIFIED",
      "INSTANCE",
      "LOAD_BALANCER",
      "VPN_GATEWAY",
      "PSC",
    ]).describe(
      "Output only. Specifies the type of the target of the forwarding rule.",
    ).optional(),
    fqdn: z.string().describe(
      "DNS endpoint of [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture). Requires gke_master_cluster to be set, can't be used simultaneoulsly with ip_address or network. Applicable only to destination endpoint.",
    ).optional(),
    gkeMasterCluster: z.string().describe(
      "A cluster URI for [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture).",
    ).optional(),
    gkePod: z.string().describe(
      "A [GKE Pod](https://cloud.google.com/kubernetes-engine/docs/concepts/pod) URI.",
    ).optional(),
    instance: z.string().describe("A Compute Engine instance URI.").optional(),
    ipAddress: z.string().describe(
      "The IP address of the endpoint, which can be an external or internal IP.",
    ).optional(),
    loadBalancerId: z.string().describe(
      "Output only. ID of the load balancer the forwarding rule points to. Empty for forwarding rules not related to load balancers.",
    ).optional(),
    loadBalancerType: z.enum([
      "LOAD_BALANCER_TYPE_UNSPECIFIED",
      "HTTPS_ADVANCED_LOAD_BALANCER",
      "HTTPS_LOAD_BALANCER",
      "REGIONAL_HTTPS_LOAD_BALANCER",
      "INTERNAL_HTTPS_LOAD_BALANCER",
      "SSL_PROXY_LOAD_BALANCER",
      "TCP_PROXY_LOAD_BALANCER",
      "INTERNAL_TCP_PROXY_LOAD_BALANCER",
      "NETWORK_LOAD_BALANCER",
      "LEGACY_NETWORK_LOAD_BALANCER",
      "TCP_UDP_INTERNAL_LOAD_BALANCER",
    ]).describe(
      "Output only. Type of the load balancer the forwarding rule points to.",
    ).optional(),
    network: z.string().describe(
      "A VPC network URI. For source endpoints, used according to the `network_type`. For destination endpoints, used only when the source is an external IP address endpoint, and the destination is an internal IP address endpoint.",
    ).optional(),
    networkType: z.enum([
      "NETWORK_TYPE_UNSPECIFIED",
      "GCP_NETWORK",
      "NON_GCP_NETWORK",
      "INTERNET",
    ]).describe(
      "For source endpoints, type of the network where the endpoint is located. Not relevant for destination endpoints.",
    ).optional(),
    port: z.number().int().describe(
      "The IP protocol port of the endpoint. Only applicable when protocol is TCP or UDP.",
    ).optional(),
    projectId: z.string().describe(
      "For source endpoints, endpoint project ID. Used according to the `network_type`. Not relevant for destination endpoints.",
    ).optional(),
    redisCluster: z.string().describe(
      "A [Redis Cluster](https://cloud.google.com/memorystore/docs/cluster) URI. Applicable only to destination endpoint.",
    ).optional(),
    redisInstance: z.string().describe(
      "A [Redis Instance](https://cloud.google.com/memorystore/docs/redis) URI. Applicable only to destination endpoint.",
    ).optional(),
  }).describe(
    "Required. Destination specification of the Connectivity Test. You can use a combination of destination IP address, URI of a supported endpoint, project ID, or VPC network to identify the destination location. Reachability analysis proceeds even if the destination location is ambiguous. However, the test result might include endpoints or use a destination that you don't intend to test.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Resource labels to represent user-provided metadata.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Unique name of the resource using the form: `projects/{project_id}/locations/global/connectivityTests/{test_id}`",
  ).optional(),
  protocol: z.string().describe(
    'IP Protocol of the test. When not provided, "TCP" is assumed.',
  ).optional(),
  relatedProjects: z.array(z.string()).describe(
    "Other projects that may be relevant for reachability analysis. This is applicable to scenarios where a test can cross project boundaries.",
  ).optional(),
  roundTrip: z.boolean().describe(
    "Whether run analysis for the return path from destination to source. Default value is false.",
  ).optional(),
  source: z.object({
    appEngineVersion: z.object({
      uri: z.string().describe(
        "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions) name.",
      ).optional(),
    }).describe(
      "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions). Applicable only to source endpoint.",
    ).optional(),
    cloudFunction: z.object({
      uri: z.string().describe(
        "A [Cloud Function](https://cloud.google.com/functions) name.",
      ).optional(),
    }).describe(
      "A [Cloud Function](https://cloud.google.com/functions). Applicable only to source endpoint.",
    ).optional(),
    cloudRunJob: z.string().describe(
      "A [Cloud Run](https://cloud.google.com/run) [job](https://docs.cloud.google.com/run/docs/reference/rest/v2/projects.locations.jobs#Job) URI. Applicable only to source endpoint. The format is: projects/{project}/locations/{location}/jobs/{job}",
    ).optional(),
    cloudRunRevision: z.object({
      serviceUri: z.string().describe(
        "Output only. The URI of the Cloud Run service that the revision belongs to. The format is: projects/{project}/locations/{location}/services/{service}. Mutually exclusive with worker_pool_uri.",
      ).optional(),
      uri: z.string().describe(
        "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) URI. The format is: projects/{project}/locations/{location}/revisions/{revision}",
      ).optional(),
      workerPoolUri: z.string().describe(
        "Output only. The URI of the worker pool that the revision belongs to. The format is: projects/{project}/locations/{location}/workerPools/{workerPool}. Mutually exclusive with service_uri.",
      ).optional(),
    }).describe(
      "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) Applicable only to source endpoint.",
    ).optional(),
    cloudSqlInstance: z.string().describe(
      "A [Cloud SQL](https://cloud.google.com/sql) instance URI.",
    ).optional(),
    dmsPrivateConnection: z.string().describe(
      "A [DMS Private Connection](https://docs.cloud.google.com/database-migration/docs/reference/rest/v1/projects.locations.privateConnections) name format: projects/{project}/locations/{location}/privateConnections/{privateConnection}.",
    ).optional(),
    forwardingRule: z.string().describe(
      "A forwarding rule and its corresponding IP address represent the frontend configuration of a Google Cloud load balancer. Forwarding rules are also used for protocol forwarding, Private Service Connect and other network services to provide forwarding information in the control plane. Applicable only to destination endpoint. Format: `projects/{project}/global/forwardingRules/{id}` or `projects/{project}/regions/{region}/forwardingRules/{id}`",
    ).optional(),
    forwardingRuleTarget: z.enum([
      "FORWARDING_RULE_TARGET_UNSPECIFIED",
      "INSTANCE",
      "LOAD_BALANCER",
      "VPN_GATEWAY",
      "PSC",
    ]).describe(
      "Output only. Specifies the type of the target of the forwarding rule.",
    ).optional(),
    fqdn: z.string().describe(
      "DNS endpoint of [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture). Requires gke_master_cluster to be set, can't be used simultaneoulsly with ip_address or network. Applicable only to destination endpoint.",
    ).optional(),
    gkeMasterCluster: z.string().describe(
      "A cluster URI for [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture).",
    ).optional(),
    gkePod: z.string().describe(
      "A [GKE Pod](https://cloud.google.com/kubernetes-engine/docs/concepts/pod) URI.",
    ).optional(),
    instance: z.string().describe("A Compute Engine instance URI.").optional(),
    ipAddress: z.string().describe(
      "The IP address of the endpoint, which can be an external or internal IP.",
    ).optional(),
    loadBalancerId: z.string().describe(
      "Output only. ID of the load balancer the forwarding rule points to. Empty for forwarding rules not related to load balancers.",
    ).optional(),
    loadBalancerType: z.enum([
      "LOAD_BALANCER_TYPE_UNSPECIFIED",
      "HTTPS_ADVANCED_LOAD_BALANCER",
      "HTTPS_LOAD_BALANCER",
      "REGIONAL_HTTPS_LOAD_BALANCER",
      "INTERNAL_HTTPS_LOAD_BALANCER",
      "SSL_PROXY_LOAD_BALANCER",
      "TCP_PROXY_LOAD_BALANCER",
      "INTERNAL_TCP_PROXY_LOAD_BALANCER",
      "NETWORK_LOAD_BALANCER",
      "LEGACY_NETWORK_LOAD_BALANCER",
      "TCP_UDP_INTERNAL_LOAD_BALANCER",
    ]).describe(
      "Output only. Type of the load balancer the forwarding rule points to.",
    ).optional(),
    network: z.string().describe(
      "A VPC network URI. For source endpoints, used according to the `network_type`. For destination endpoints, used only when the source is an external IP address endpoint, and the destination is an internal IP address endpoint.",
    ).optional(),
    networkType: z.enum([
      "NETWORK_TYPE_UNSPECIFIED",
      "GCP_NETWORK",
      "NON_GCP_NETWORK",
      "INTERNET",
    ]).describe(
      "For source endpoints, type of the network where the endpoint is located. Not relevant for destination endpoints.",
    ).optional(),
    port: z.number().int().describe(
      "The IP protocol port of the endpoint. Only applicable when protocol is TCP or UDP.",
    ).optional(),
    projectId: z.string().describe(
      "For source endpoints, endpoint project ID. Used according to the `network_type`. Not relevant for destination endpoints.",
    ).optional(),
    redisCluster: z.string().describe(
      "A [Redis Cluster](https://cloud.google.com/memorystore/docs/cluster) URI. Applicable only to destination endpoint.",
    ).optional(),
    redisInstance: z.string().describe(
      "A [Redis Instance](https://cloud.google.com/memorystore/docs/redis) URI. Applicable only to destination endpoint.",
    ).optional(),
  }).describe(
    "Required. Source specification of the Connectivity Test. You can use a combination of source IP address, URI of a supported endpoint, project ID, or VPC network to identify the source location. Reachability analysis might proceed even if the source location is ambiguous. However, the test result might include endpoints or use a source that you don't intend to test.",
  ).optional(),
  testId: z.string().describe(
    "Required. The logical name of the Connectivity Test in your project with the following restrictions: * Must contain only lowercase letters, numbers, and hyphens. * Must start with a letter. * Must be between 1-40 characters. * Must end with a number or a letter. * Must be unique within the customer project",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  bypassFirewallChecks: z.boolean().optional(),
  createTime: z.string().optional(),
  description: z.string().optional(),
  destination: z.object({
    appEngineVersion: z.object({
      uri: z.string(),
    }),
    cloudFunction: z.object({
      uri: z.string(),
    }),
    cloudRunJob: z.string(),
    cloudRunRevision: z.object({
      serviceUri: z.string(),
      uri: z.string(),
      workerPoolUri: z.string(),
    }),
    cloudSqlInstance: z.string(),
    dmsPrivateConnection: z.string(),
    forwardingRule: z.string(),
    forwardingRuleTarget: z.string(),
    fqdn: z.string(),
    gkeMasterCluster: z.string(),
    gkePod: z.string(),
    instance: z.string(),
    ipAddress: z.string(),
    loadBalancerId: z.string(),
    loadBalancerType: z.string(),
    network: z.string(),
    networkType: z.string(),
    port: z.number(),
    projectId: z.string(),
    redisCluster: z.string(),
    redisInstance: z.string(),
  }).optional(),
  displayName: z.string().optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  name: z.string(),
  probingDetails: z.object({
    abortCause: z.string(),
    destinationEgressLocation: z.object({
      metropolitanArea: z.string(),
    }),
    edgeResponses: z.array(z.object({
      destinationEgressLocation: z.object({
        metropolitanArea: z.string(),
      }),
      destinationRouter: z.string(),
      probingLatency: z.object({
        latencyPercentiles: z.array(z.unknown()),
      }),
      result: z.string(),
      sentProbeCount: z.number(),
      successfulProbeCount: z.number(),
    })),
    endpointInfo: z.object({
      destinationIp: z.string(),
      destinationNetworkUri: z.string(),
      destinationPort: z.number(),
      protocol: z.string(),
      sourceAgentUri: z.string(),
      sourceIp: z.string(),
      sourceNetworkUri: z.string(),
      sourcePort: z.number(),
    }),
    error: z.object({
      code: z.number(),
      details: z.array(z.record(z.string(), z.unknown())),
      message: z.string(),
    }),
    probedAllDevices: z.boolean(),
    probingLatency: z.object({
      latencyPercentiles: z.array(z.object({
        latencyMicros: z.string(),
        percent: z.number(),
      })),
    }),
    result: z.string(),
    sentProbeCount: z.number(),
    successfulProbeCount: z.number(),
    verifyTime: z.string(),
  }).optional(),
  protocol: z.string().optional(),
  reachabilityDetails: z.object({
    error: z.object({
      code: z.number(),
      details: z.array(z.record(z.string(), z.unknown())),
      message: z.string(),
    }),
    result: z.string(),
    traces: z.array(z.object({
      endpointInfo: z.object({
        destinationIp: z.string(),
        destinationNetworkUri: z.string(),
        destinationPort: z.number(),
        protocol: z.string(),
        sourceAgentUri: z.string(),
        sourceIp: z.string(),
        sourceNetworkUri: z.string(),
        sourcePort: z.number(),
      }),
      forwardTraceId: z.number(),
      steps: z.array(z.object({
        abort: z.unknown(),
        appEngineVersion: z.unknown(),
        causesDrop: z.unknown(),
        cloudFunction: z.unknown(),
        cloudRunJob: z.unknown(),
        cloudRunRevision: z.unknown(),
        cloudSqlInstance: z.unknown(),
        datastreamPrivateConnection: z.unknown(),
        deliver: z.unknown(),
        description: z.unknown(),
        directVpcEgressConnection: z.unknown(),
        directVpcIngressConnection: z.unknown(),
        dmsPrivateConnection: z.unknown(),
        drop: z.unknown(),
        endpoint: z.unknown(),
        firewall: z.unknown(),
        forward: z.unknown(),
        forwardingRule: z.unknown(),
        gkeMaster: z.unknown(),
        gkeNetworkPolicy: z.unknown(),
        gkeNetworkPolicySkipped: z.unknown(),
        gkePod: z.unknown(),
        googleService: z.unknown(),
        hybridSubnet: z.unknown(),
        instance: z.unknown(),
        interconnectAttachment: z.unknown(),
        ipMasqueradingSkipped: z.unknown(),
        loadBalancer: z.unknown(),
        loadBalancerBackendInfo: z.unknown(),
        nat: z.unknown(),
        network: z.unknown(),
        ngfwPacketInspection: z.unknown(),
        projectId: z.unknown(),
        proxyConnection: z.unknown(),
        redisCluster: z.unknown(),
        redisInstance: z.unknown(),
        route: z.unknown(),
        serverlessExternalConnection: z.unknown(),
        serverlessNeg: z.unknown(),
        state: z.unknown(),
        storageBucket: z.unknown(),
        viewerPermissionMissingInfo: z.unknown(),
        vpcConnector: z.unknown(),
        vpnGateway: z.unknown(),
        vpnTunnel: z.unknown(),
      })),
    })),
    verifyTime: z.string(),
  }).optional(),
  relatedProjects: z.array(z.string()).optional(),
  returnReachabilityDetails: z.object({
    error: z.object({
      code: z.number(),
      details: z.array(z.record(z.string(), z.unknown())),
      message: z.string(),
    }),
    result: z.string(),
    traces: z.array(z.object({
      endpointInfo: z.object({
        destinationIp: z.string(),
        destinationNetworkUri: z.string(),
        destinationPort: z.number(),
        protocol: z.string(),
        sourceAgentUri: z.string(),
        sourceIp: z.string(),
        sourceNetworkUri: z.string(),
        sourcePort: z.number(),
      }),
      forwardTraceId: z.number(),
      steps: z.array(z.object({
        abort: z.unknown(),
        appEngineVersion: z.unknown(),
        causesDrop: z.unknown(),
        cloudFunction: z.unknown(),
        cloudRunJob: z.unknown(),
        cloudRunRevision: z.unknown(),
        cloudSqlInstance: z.unknown(),
        datastreamPrivateConnection: z.unknown(),
        deliver: z.unknown(),
        description: z.unknown(),
        directVpcEgressConnection: z.unknown(),
        directVpcIngressConnection: z.unknown(),
        dmsPrivateConnection: z.unknown(),
        drop: z.unknown(),
        endpoint: z.unknown(),
        firewall: z.unknown(),
        forward: z.unknown(),
        forwardingRule: z.unknown(),
        gkeMaster: z.unknown(),
        gkeNetworkPolicy: z.unknown(),
        gkeNetworkPolicySkipped: z.unknown(),
        gkePod: z.unknown(),
        googleService: z.unknown(),
        hybridSubnet: z.unknown(),
        instance: z.unknown(),
        interconnectAttachment: z.unknown(),
        ipMasqueradingSkipped: z.unknown(),
        loadBalancer: z.unknown(),
        loadBalancerBackendInfo: z.unknown(),
        nat: z.unknown(),
        network: z.unknown(),
        ngfwPacketInspection: z.unknown(),
        projectId: z.unknown(),
        proxyConnection: z.unknown(),
        redisCluster: z.unknown(),
        redisInstance: z.unknown(),
        route: z.unknown(),
        serverlessExternalConnection: z.unknown(),
        serverlessNeg: z.unknown(),
        state: z.unknown(),
        storageBucket: z.unknown(),
        viewerPermissionMissingInfo: z.unknown(),
        vpcConnector: z.unknown(),
        vpnGateway: z.unknown(),
        vpnTunnel: z.unknown(),
      })),
    })),
    verifyTime: z.string(),
  }).optional(),
  roundTrip: z.boolean().optional(),
  source: z.object({
    appEngineVersion: z.object({
      uri: z.string(),
    }),
    cloudFunction: z.object({
      uri: z.string(),
    }),
    cloudRunJob: z.string(),
    cloudRunRevision: z.object({
      serviceUri: z.string(),
      uri: z.string(),
      workerPoolUri: z.string(),
    }),
    cloudSqlInstance: z.string(),
    dmsPrivateConnection: z.string(),
    forwardingRule: z.string(),
    forwardingRuleTarget: z.string(),
    fqdn: z.string(),
    gkeMasterCluster: z.string(),
    gkePod: z.string(),
    instance: z.string(),
    ipAddress: z.string(),
    loadBalancerId: z.string(),
    loadBalancerType: z.string(),
    network: z.string(),
    networkType: z.string(),
    port: z.number(),
    projectId: z.string(),
    redisCluster: z.string(),
    redisInstance: z.string(),
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
  bypassFirewallChecks: z.boolean().describe(
    "Whether the analysis should skip firewall checking. Default value is false.",
  ).optional(),
  description: z.string().describe(
    "The user-supplied description of the Connectivity Test. Maximum of 512 characters.",
  ).optional(),
  destination: z.object({
    appEngineVersion: z.object({
      uri: z.string().describe(
        "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions) name.",
      ).optional(),
    }).describe(
      "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions). Applicable only to source endpoint.",
    ).optional(),
    cloudFunction: z.object({
      uri: z.string().describe(
        "A [Cloud Function](https://cloud.google.com/functions) name.",
      ).optional(),
    }).describe(
      "A [Cloud Function](https://cloud.google.com/functions). Applicable only to source endpoint.",
    ).optional(),
    cloudRunJob: z.string().describe(
      "A [Cloud Run](https://cloud.google.com/run) [job](https://docs.cloud.google.com/run/docs/reference/rest/v2/projects.locations.jobs#Job) URI. Applicable only to source endpoint. The format is: projects/{project}/locations/{location}/jobs/{job}",
    ).optional(),
    cloudRunRevision: z.object({
      serviceUri: z.string().describe(
        "Output only. The URI of the Cloud Run service that the revision belongs to. The format is: projects/{project}/locations/{location}/services/{service}. Mutually exclusive with worker_pool_uri.",
      ).optional(),
      uri: z.string().describe(
        "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) URI. The format is: projects/{project}/locations/{location}/revisions/{revision}",
      ).optional(),
      workerPoolUri: z.string().describe(
        "Output only. The URI of the worker pool that the revision belongs to. The format is: projects/{project}/locations/{location}/workerPools/{workerPool}. Mutually exclusive with service_uri.",
      ).optional(),
    }).describe(
      "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) Applicable only to source endpoint.",
    ).optional(),
    cloudSqlInstance: z.string().describe(
      "A [Cloud SQL](https://cloud.google.com/sql) instance URI.",
    ).optional(),
    dmsPrivateConnection: z.string().describe(
      "A [DMS Private Connection](https://docs.cloud.google.com/database-migration/docs/reference/rest/v1/projects.locations.privateConnections) name format: projects/{project}/locations/{location}/privateConnections/{privateConnection}.",
    ).optional(),
    forwardingRule: z.string().describe(
      "A forwarding rule and its corresponding IP address represent the frontend configuration of a Google Cloud load balancer. Forwarding rules are also used for protocol forwarding, Private Service Connect and other network services to provide forwarding information in the control plane. Applicable only to destination endpoint. Format: `projects/{project}/global/forwardingRules/{id}` or `projects/{project}/regions/{region}/forwardingRules/{id}`",
    ).optional(),
    forwardingRuleTarget: z.enum([
      "FORWARDING_RULE_TARGET_UNSPECIFIED",
      "INSTANCE",
      "LOAD_BALANCER",
      "VPN_GATEWAY",
      "PSC",
    ]).describe(
      "Output only. Specifies the type of the target of the forwarding rule.",
    ).optional(),
    fqdn: z.string().describe(
      "DNS endpoint of [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture). Requires gke_master_cluster to be set, can't be used simultaneoulsly with ip_address or network. Applicable only to destination endpoint.",
    ).optional(),
    gkeMasterCluster: z.string().describe(
      "A cluster URI for [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture).",
    ).optional(),
    gkePod: z.string().describe(
      "A [GKE Pod](https://cloud.google.com/kubernetes-engine/docs/concepts/pod) URI.",
    ).optional(),
    instance: z.string().describe("A Compute Engine instance URI.").optional(),
    ipAddress: z.string().describe(
      "The IP address of the endpoint, which can be an external or internal IP.",
    ).optional(),
    loadBalancerId: z.string().describe(
      "Output only. ID of the load balancer the forwarding rule points to. Empty for forwarding rules not related to load balancers.",
    ).optional(),
    loadBalancerType: z.enum([
      "LOAD_BALANCER_TYPE_UNSPECIFIED",
      "HTTPS_ADVANCED_LOAD_BALANCER",
      "HTTPS_LOAD_BALANCER",
      "REGIONAL_HTTPS_LOAD_BALANCER",
      "INTERNAL_HTTPS_LOAD_BALANCER",
      "SSL_PROXY_LOAD_BALANCER",
      "TCP_PROXY_LOAD_BALANCER",
      "INTERNAL_TCP_PROXY_LOAD_BALANCER",
      "NETWORK_LOAD_BALANCER",
      "LEGACY_NETWORK_LOAD_BALANCER",
      "TCP_UDP_INTERNAL_LOAD_BALANCER",
    ]).describe(
      "Output only. Type of the load balancer the forwarding rule points to.",
    ).optional(),
    network: z.string().describe(
      "A VPC network URI. For source endpoints, used according to the `network_type`. For destination endpoints, used only when the source is an external IP address endpoint, and the destination is an internal IP address endpoint.",
    ).optional(),
    networkType: z.enum([
      "NETWORK_TYPE_UNSPECIFIED",
      "GCP_NETWORK",
      "NON_GCP_NETWORK",
      "INTERNET",
    ]).describe(
      "For source endpoints, type of the network where the endpoint is located. Not relevant for destination endpoints.",
    ).optional(),
    port: z.number().int().describe(
      "The IP protocol port of the endpoint. Only applicable when protocol is TCP or UDP.",
    ).optional(),
    projectId: z.string().describe(
      "For source endpoints, endpoint project ID. Used according to the `network_type`. Not relevant for destination endpoints.",
    ).optional(),
    redisCluster: z.string().describe(
      "A [Redis Cluster](https://cloud.google.com/memorystore/docs/cluster) URI. Applicable only to destination endpoint.",
    ).optional(),
    redisInstance: z.string().describe(
      "A [Redis Instance](https://cloud.google.com/memorystore/docs/redis) URI. Applicable only to destination endpoint.",
    ).optional(),
  }).describe(
    "Required. Destination specification of the Connectivity Test. You can use a combination of destination IP address, URI of a supported endpoint, project ID, or VPC network to identify the destination location. Reachability analysis proceeds even if the destination location is ambiguous. However, the test result might include endpoints or use a destination that you don't intend to test.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Resource labels to represent user-provided metadata.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Unique name of the resource using the form: `projects/{project_id}/locations/global/connectivityTests/{test_id}`",
  ).optional(),
  protocol: z.string().describe(
    'IP Protocol of the test. When not provided, "TCP" is assumed.',
  ).optional(),
  relatedProjects: z.array(z.string()).describe(
    "Other projects that may be relevant for reachability analysis. This is applicable to scenarios where a test can cross project boundaries.",
  ).optional(),
  roundTrip: z.boolean().describe(
    "Whether run analysis for the return path from destination to source. Default value is false.",
  ).optional(),
  source: z.object({
    appEngineVersion: z.object({
      uri: z.string().describe(
        "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions) name.",
      ).optional(),
    }).describe(
      "An [App Engine](https://cloud.google.com/appengine) [service version](https://cloud.google.com/appengine/docs/admin-api/reference/rest/v1/apps.services.versions). Applicable only to source endpoint.",
    ).optional(),
    cloudFunction: z.object({
      uri: z.string().describe(
        "A [Cloud Function](https://cloud.google.com/functions) name.",
      ).optional(),
    }).describe(
      "A [Cloud Function](https://cloud.google.com/functions). Applicable only to source endpoint.",
    ).optional(),
    cloudRunJob: z.string().describe(
      "A [Cloud Run](https://cloud.google.com/run) [job](https://docs.cloud.google.com/run/docs/reference/rest/v2/projects.locations.jobs#Job) URI. Applicable only to source endpoint. The format is: projects/{project}/locations/{location}/jobs/{job}",
    ).optional(),
    cloudRunRevision: z.object({
      serviceUri: z.string().describe(
        "Output only. The URI of the Cloud Run service that the revision belongs to. The format is: projects/{project}/locations/{location}/services/{service}. Mutually exclusive with worker_pool_uri.",
      ).optional(),
      uri: z.string().describe(
        "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) URI. The format is: projects/{project}/locations/{location}/revisions/{revision}",
      ).optional(),
      workerPoolUri: z.string().describe(
        "Output only. The URI of the worker pool that the revision belongs to. The format is: projects/{project}/locations/{location}/workerPools/{workerPool}. Mutually exclusive with service_uri.",
      ).optional(),
    }).describe(
      "A [Cloud Run](https://cloud.google.com/run) [revision](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.revisions/get) Applicable only to source endpoint.",
    ).optional(),
    cloudSqlInstance: z.string().describe(
      "A [Cloud SQL](https://cloud.google.com/sql) instance URI.",
    ).optional(),
    dmsPrivateConnection: z.string().describe(
      "A [DMS Private Connection](https://docs.cloud.google.com/database-migration/docs/reference/rest/v1/projects.locations.privateConnections) name format: projects/{project}/locations/{location}/privateConnections/{privateConnection}.",
    ).optional(),
    forwardingRule: z.string().describe(
      "A forwarding rule and its corresponding IP address represent the frontend configuration of a Google Cloud load balancer. Forwarding rules are also used for protocol forwarding, Private Service Connect and other network services to provide forwarding information in the control plane. Applicable only to destination endpoint. Format: `projects/{project}/global/forwardingRules/{id}` or `projects/{project}/regions/{region}/forwardingRules/{id}`",
    ).optional(),
    forwardingRuleTarget: z.enum([
      "FORWARDING_RULE_TARGET_UNSPECIFIED",
      "INSTANCE",
      "LOAD_BALANCER",
      "VPN_GATEWAY",
      "PSC",
    ]).describe(
      "Output only. Specifies the type of the target of the forwarding rule.",
    ).optional(),
    fqdn: z.string().describe(
      "DNS endpoint of [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture). Requires gke_master_cluster to be set, can't be used simultaneoulsly with ip_address or network. Applicable only to destination endpoint.",
    ).optional(),
    gkeMasterCluster: z.string().describe(
      "A cluster URI for [Google Kubernetes Engine cluster control plane](https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture).",
    ).optional(),
    gkePod: z.string().describe(
      "A [GKE Pod](https://cloud.google.com/kubernetes-engine/docs/concepts/pod) URI.",
    ).optional(),
    instance: z.string().describe("A Compute Engine instance URI.").optional(),
    ipAddress: z.string().describe(
      "The IP address of the endpoint, which can be an external or internal IP.",
    ).optional(),
    loadBalancerId: z.string().describe(
      "Output only. ID of the load balancer the forwarding rule points to. Empty for forwarding rules not related to load balancers.",
    ).optional(),
    loadBalancerType: z.enum([
      "LOAD_BALANCER_TYPE_UNSPECIFIED",
      "HTTPS_ADVANCED_LOAD_BALANCER",
      "HTTPS_LOAD_BALANCER",
      "REGIONAL_HTTPS_LOAD_BALANCER",
      "INTERNAL_HTTPS_LOAD_BALANCER",
      "SSL_PROXY_LOAD_BALANCER",
      "TCP_PROXY_LOAD_BALANCER",
      "INTERNAL_TCP_PROXY_LOAD_BALANCER",
      "NETWORK_LOAD_BALANCER",
      "LEGACY_NETWORK_LOAD_BALANCER",
      "TCP_UDP_INTERNAL_LOAD_BALANCER",
    ]).describe(
      "Output only. Type of the load balancer the forwarding rule points to.",
    ).optional(),
    network: z.string().describe(
      "A VPC network URI. For source endpoints, used according to the `network_type`. For destination endpoints, used only when the source is an external IP address endpoint, and the destination is an internal IP address endpoint.",
    ).optional(),
    networkType: z.enum([
      "NETWORK_TYPE_UNSPECIFIED",
      "GCP_NETWORK",
      "NON_GCP_NETWORK",
      "INTERNET",
    ]).describe(
      "For source endpoints, type of the network where the endpoint is located. Not relevant for destination endpoints.",
    ).optional(),
    port: z.number().int().describe(
      "The IP protocol port of the endpoint. Only applicable when protocol is TCP or UDP.",
    ).optional(),
    projectId: z.string().describe(
      "For source endpoints, endpoint project ID. Used according to the `network_type`. Not relevant for destination endpoints.",
    ).optional(),
    redisCluster: z.string().describe(
      "A [Redis Cluster](https://cloud.google.com/memorystore/docs/cluster) URI. Applicable only to destination endpoint.",
    ).optional(),
    redisInstance: z.string().describe(
      "A [Redis Instance](https://cloud.google.com/memorystore/docs/redis) URI. Applicable only to destination endpoint.",
    ).optional(),
  }).describe(
    "Required. Source specification of the Connectivity Test. You can use a combination of source IP address, URI of a supported endpoint, project ID, or VPC network to identify the source location. Reachability analysis might proceed even if the source location is ambiguous. However, the test result might include endpoints or use a source that you don't intend to test.",
  ).optional(),
  testId: z.string().describe(
    "Required. The logical name of the Connectivity Test in your project with the following restrictions: * Must contain only lowercase letters, numbers, and hyphens. * Must start with a letter. * Must be between 1-40 characters. * Must end with a number or a letter. * Must be unique within the customer project",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
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

/** Swamp extension model for Google Cloud Network Management Global.ConnectivityTests. Registered at `@swamp/gcp/networkmanagement/global-connectivitytests`. */
export const model = {
  type: "@swamp/gcp/networkmanagement/global-connectivitytests",
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
      toVersion: "2026.04.04.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
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
      toVersion: "2026.05.20.1",
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
      toVersion: "2026.05.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.03.1",
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
      toVersion: "2026.06.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
      description: "Added: parent",
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
      toVersion: "2026.07.20.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description:
        "Removed: probingDetails, reachabilityDetails, returnReachabilityDetails",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          probingDetails: _probingDetails,
          reachabilityDetails: _reachabilityDetails,
          returnReachabilityDetails: _returnReachabilityDetails,
          ...rest
        } = old;
        return rest;
      },
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
      toVersion: "2026.07.21.4",
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
      toVersion: "2026.08.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.2",
      description:
        "Removed: appEngineVersion, uri, cloudFunction, uri, cloudRunJob, cloudRunRevision, serviceUri, uri, workerPoolUri, cloudSqlInstance, dmsPrivateConnection, forwardingRule, forwardingRuleTarget, fqdn, gkeMasterCluster, gkePod, instance, ipAddress, loadBalancerId, loadBalancerType, network, networkType, port, projectId, redisCluster, redisInstance, appEngineVersion, uri, cloudFunction, uri, cloudRunJob, cloudRunRevision, serviceUri, uri, workerPoolUri, cloudSqlInstance, dmsPrivateConnection, forwardingRule, forwardingRuleTarget, fqdn, gkeMasterCluster, gkePod, instance, ipAddress, loadBalancerId, loadBalancerType, network, networkType, port, projectId, redisCluster, redisInstance",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          appEngineVersion: _appEngineVersion,
          uri: _uri,
          cloudFunction: _cloudFunction,
          cloudRunJob: _cloudRunJob,
          cloudRunRevision: _cloudRunRevision,
          serviceUri: _serviceUri,
          workerPoolUri: _workerPoolUri,
          cloudSqlInstance: _cloudSqlInstance,
          dmsPrivateConnection: _dmsPrivateConnection,
          forwardingRule: _forwardingRule,
          forwardingRuleTarget: _forwardingRuleTarget,
          fqdn: _fqdn,
          gkeMasterCluster: _gkeMasterCluster,
          gkePod: _gkePod,
          instance: _instance,
          ipAddress: _ipAddress,
          loadBalancerId: _loadBalancerId,
          loadBalancerType: _loadBalancerType,
          network: _network,
          networkType: _networkType,
          port: _port,
          projectId: _projectId,
          redisCluster: _redisCluster,
          redisInstance: _redisInstance,
          ...rest
        } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "A Connectivity Test for a network reachability analysis.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a connectivityTests",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
        const body: Record<string, unknown> = {};
        if (g["bypassFirewallChecks"] !== undefined) {
          body["bypassFirewallChecks"] = g["bypassFirewallChecks"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["destination"] !== undefined) {
          body["destination"] = g["destination"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["protocol"] !== undefined) body["protocol"] = g["protocol"];
        if (g["relatedProjects"] !== undefined) {
          body["relatedProjects"] = g["relatedProjects"];
        }
        if (g["roundTrip"] !== undefined) body["roundTrip"] = g["roundTrip"];
        if (g["source"] !== undefined) body["source"] = g["source"];
        if (g["testId"] !== undefined) params["testId"] = String(g["testId"]);
        if (g["parent"] !== undefined && g["name"] !== undefined) {
          params["name"] = buildResourceName(
            String(g["parent"]),
            String(g["name"]),
          );
        }
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: {
              "parent": String(body["parent"] ?? g["parent"] ?? ""),
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
      description: "Get a connectivityTests",
      arguments: z.object({
        identifier: z.string().describe("The name of the connectivityTests"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = buildResourceName(
          String(g["parent"] ?? ""),
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
      description: "Update connectivityTests attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific connectivityTests by name (e.g. one discovered by list)",
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
        const params: Record<string, string> = { project: projectId };
        const existingName = existing["name"]?.toString();
        if (existingName && existingName.includes("/")) {
          params["name"] = existingName;
        } else {
          params["name"] = buildResourceName(
            String(g["parent"] ?? ""),
            existingName ?? g["name"]?.toString() ?? "",
          );
        }
        const body: Record<string, unknown> = {};
        if (g["bypassFirewallChecks"] !== undefined) {
          body["bypassFirewallChecks"] = g["bypassFirewallChecks"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["destination"] !== undefined) {
          body["destination"] = g["destination"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["protocol"] !== undefined) body["protocol"] = g["protocol"];
        if (g["relatedProjects"] !== undefined) {
          body["relatedProjects"] = g["relatedProjects"];
        }
        if (g["roundTrip"] !== undefined) body["roundTrip"] = g["roundTrip"];
        if (g["source"] !== undefined) body["source"] = g["source"];
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
          undefined,
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
      description: "Delete the connectivityTests",
      arguments: z.object({
        identifier: z.string().describe("The name of the connectivityTests"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = buildResourceName(
          String(g["parent"] ?? ""),
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
      description: "Sync connectivityTests state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific connectivityTests by name (e.g. one discovered by list)",
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
              String(g["parent"] ?? ""),
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
      description: "List connectivityTests resources",
      arguments: z.object({
        filter: z.string().describe(
          'Lists the `ConnectivityTests` that match the filter expression. A filter expression filters the resources listed in the response. The expression must be of the form ` ` where operators: `<`, `>`, `<=`, `>=`, `!=`, `=`, `:` are supported (colon `:` represents a HAS operator which is roughly synonymous with equality). can refer to a proto or JSON field, or a synthetic field. Field names can be camelCase or snake_case. Examples: - Filter by name: name = "projects/proj-1/locations/global/connectivityTests/test-1 - Filter by labels: - Resources that have a key called `foo` labels.foo:* - Resources that have a key called `foo` whose value is `bar` labels.foo = bar',
        ).optional(),
        orderBy: z.string().describe("Field to use to sort the list.")
          .optional(),
        pageSize: z.number().describe(
          "Number of `ConnectivityTests` to return.",
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
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
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
          "resources",
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
    get_iam_policy: {
      description: "get iam policy",
      arguments: z.object({
        options_requestedPolicyVersion: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["options_requestedPolicyVersion"] !== undefined) {
          params["options.requestedPolicyVersion"] = String(
            args["options_requestedPolicyVersion"],
          );
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "networkmanagement.projects.locations.global.connectivityTests.getIamPolicy",
            "path": "v1/{+resource}:getIamPolicy",
            "httpMethod": "GET",
            "parameterOrder": ["resource"],
            "parameters": {
              "options.requestedPolicyVersion": { "location": "query" },
              "resource": { "location": "path", "required": true },
            },
          },
          params,
          undefined,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    rerun: {
      description: "rerun",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined && g["name"] !== undefined) {
          params["name"] = buildResourceName(
            String(g["parent"]),
            String(g["name"]),
          );
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "networkmanagement.projects.locations.global.connectivityTests.rerun",
            "path": "v1/{+name}:rerun",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
          },
          params,
          {},
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    set_iam_policy: {
      description: "set iam policy",
      arguments: z.object({
        policy: z.any().optional(),
        updateMask: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["policy"] !== undefined) body["policy"] = args["policy"];
        if (args["updateMask"] !== undefined) {
          body["updateMask"] = args["updateMask"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "networkmanagement.projects.locations.global.connectivityTests.setIamPolicy",
            "path": "v1/{+resource}:setIamPolicy",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "resource": { "location": "path", "required": true },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    test_iam_permissions: {
      description: "test iam permissions",
      arguments: z.object({
        permissions: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["permissions"] !== undefined) {
          body["permissions"] = args["permissions"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "networkmanagement.projects.locations.global.connectivityTests.testIamPermissions",
            "path": "v1/{+resource}:testIamPermissions",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "resource": { "location": "path", "required": true },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
  },
};
