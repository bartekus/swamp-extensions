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

// Auto-generated extension model for @swamp/gcp/dns/resourcerecordsets
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud DNS ResourceRecordSets.
 *
 * A unit of data that is returned by the DNS servers.
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

const BASE_URL = "https://dns.googleapis.com/";

const GET_CONFIG = {
  "id": "dns.resourceRecordSets.get",
  "path":
    "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets/{name}/{type}",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "managedZone",
    "name",
    "type",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "managedZone": {
      "location": "path",
      "required": true,
    },
    "name": {
      "location": "path",
      "required": true,
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "type": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "dns.resourceRecordSets.create",
  "path": "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets",
  "httpMethod": "POST",
  "parameterOrder": [
    "project",
    "managedZone",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "managedZone": {
      "location": "path",
      "required": true,
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "dns.resourceRecordSets.patch",
  "path":
    "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets/{name}/{type}",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "project",
    "managedZone",
    "name",
    "type",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "managedZone": {
      "location": "path",
      "required": true,
    },
    "name": {
      "location": "path",
      "required": true,
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "type": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "dns.resourceRecordSets.delete",
  "path":
    "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets/{name}/{type}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "project",
    "managedZone",
    "name",
    "type",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "managedZone": {
      "location": "path",
      "required": true,
    },
    "name": {
      "location": "path",
      "required": true,
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "type": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "dns.resourceRecordSets.list",
  "path": "dns/v1/projects/{project}/managedZones/{managedZone}/rrsets",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "managedZone",
  ],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "managedZone": {
      "location": "path",
      "required": true,
    },
    "maxResults": {
      "location": "query",
    },
    "name": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "type": {
      "location": "query",
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
  name: z.string().describe("For example, www.example.com.").optional(),
  routingPolicy: z.object({
    geo: z.object({
      enableFencing: z.boolean().describe(
        "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
      ).optional(),
      items: z.array(z.object({
        healthCheckedTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
            "Configuration for internal load balancers to be health checked.",
          ).optional(),
        }).describe(
          "For A and AAAA types only. Endpoints to return in the query result only if they are healthy. These can be specified along with `rrdata` within this item.",
        ).optional(),
        kind: z.string().optional(),
        location: z.string().describe(
          'The geo-location granularity is a GCP region. This location string should correspond to a GCP region. e.g. "us-east1", "southamerica-east1", "asia-east1", etc.',
        ).optional(),
        rrdatas: z.array(z.unknown()).optional(),
        signatureRrdatas: z.array(z.unknown()).describe(
          "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
        ).optional(),
      })).describe(
        "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
      ).optional(),
      kind: z.string().optional(),
    }).describe(
      "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
    ).optional(),
    healthCheck: z.string().describe(
      "The fully qualified URL of the HealthCheck to use for this RRSetRoutingPolicy. Format this URL like `https://www.googleapis.com/compute/v1/projects/{project}/global/healthChecks/{healthCheck}`. https://cloud.google.com/compute/docs/reference/rest/v1/healthChecks",
    ).optional(),
    kind: z.string().optional(),
    primaryBackup: z.object({
      backupGeoTargets: z.object({
        enableFencing: z.boolean().describe(
          "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
        ).optional(),
        items: z.array(z.object({
          healthCheckedTargets: z.unknown().describe(
            "For A and AAAA types only. Endpoints to return in the query result only if they are healthy. These can be specified along with `rrdata` within this item.",
          ).optional(),
          kind: z.unknown().optional(),
          location: z.unknown().describe(
            'The geo-location granularity is a GCP region. This location string should correspond to a GCP region. e.g. "us-east1", "southamerica-east1", "asia-east1", etc.',
          ).optional(),
          rrdatas: z.unknown().optional(),
          signatureRrdatas: z.unknown().describe(
            "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
          ).optional(),
        })).describe(
          "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
        ).optional(),
        kind: z.string().optional(),
      }).describe(
        "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
      ).optional(),
      kind: z.string().optional(),
      primaryTargets: z.object({
        externalEndpoints: z.array(z.string()).describe(
          "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
        ).optional(),
        internalLoadBalancers: z.array(z.object({
          ipAddress: z.unknown().describe(
            "The frontend IP address of the load balancer to health check.",
          ).optional(),
          ipProtocol: z.unknown().describe(
            "The protocol of the load balancer to health check.",
          ).optional(),
          kind: z.unknown().optional(),
          loadBalancerType: z.unknown().describe(
            "The type of load balancer specified by this target. This value must match the configuration of the load balancer located at the LoadBalancerTarget's IP address, port, and region. Use the following: - *regionalL4ilb*: for a regional internal passthrough Network Load Balancer. - *regionalL7ilb*: for a regional internal Application Load Balancer. - *globalL7ilb*: for a global internal Application Load Balancer.",
          ).optional(),
          networkUrl: z.unknown().describe(
            "The fully qualified URL of the network that the load balancer is attached to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`.",
          ).optional(),
          port: z.unknown().describe(
            "The configured port of the load balancer.",
          ).optional(),
          project: z.unknown().describe(
            "The project ID in which the load balancer is located.",
          ).optional(),
          region: z.unknown().describe(
            "The region in which the load balancer is located.",
          ).optional(),
        })).describe(
          "Configuration for internal load balancers to be health checked.",
        ).optional(),
      }).describe(
        "Endpoints that are health checked before making the routing decision. Unhealthy endpoints are omitted from the results. If all endpoints are unhealthy, we serve a response based on the `backup_geo_targets`.",
      ).optional(),
      trickleTraffic: z.number().describe(
        "When serving state is `PRIMARY`, this field provides the option of sending a small percentage of the traffic to the backup targets.",
      ).optional(),
    }).describe(
      "Configures a RRSetRoutingPolicy such that all queries are responded with the primary_targets if they are healthy. And if all of them are unhealthy, then we fallback to a geo localized policy.",
    ).optional(),
    wrr: z.object({
      items: z.array(z.object({
        healthCheckedTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
            "Configuration for internal load balancers to be health checked.",
          ).optional(),
        }).describe(
          "Endpoints that are health checked before making the routing decision. The unhealthy endpoints are omitted from the result. If all endpoints within a bucket are unhealthy, we choose a different bucket (sampled with respect to its weight) for responding. If DNSSEC is enabled for this zone, only one of `rrdata` or `health_checked_targets` can be set.",
        ).optional(),
        kind: z.string().optional(),
        rrdatas: z.array(z.unknown()).optional(),
        signatureRrdatas: z.array(z.unknown()).describe(
          "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
        ).optional(),
        weight: z.number().describe(
          "The weight corresponding to this `WrrPolicyItem` object. When multiple `WrrPolicyItem` objects are configured, the probability of returning an `WrrPolicyItem` object's data is proportional to its weight relative to the sum of weights configured for all items. This weight must be non-negative.",
        ).optional(),
      })).optional(),
      kind: z.string().optional(),
    }).describe(
      "Configures a RRSetRoutingPolicy that routes in a weighted round robin fashion.",
    ).optional(),
  }).describe(
    "Configures dynamic query responses based on either the geo location of the querying user or a weighted round robin based routing policy. A valid `ResourceRecordSet` contains only `rrdata` (for static resolution) or a `routing_policy` (for dynamic resolution).",
  ).optional(),
  rrdatas: z.array(z.string()).describe(
    "As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see examples.",
  ).optional(),
  signatureRrdatas: z.array(z.string()).optional(),
  ttl: z.number().int().describe(
    "Number of seconds that this `ResourceRecordSet` can be cached by resolvers.",
  ).optional(),
  type: z.string().describe(
    "The identifier of a supported record type. See the list of Supported DNS record types.",
  ).optional(),
  managedZone: z.string().describe(
    "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
  ),
  clientOperationId: z.string().describe(
    "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
  ).optional(),
});

const StateSchema = z.object({
  kind: z.string().optional(),
  name: z.string(),
  routingPolicy: z.object({
    geo: z.object({
      enableFencing: z.boolean(),
      items: z.array(z.object({
        healthCheckedTargets: z.object({
          externalEndpoints: z.unknown(),
          internalLoadBalancers: z.unknown(),
        }),
        kind: z.string(),
        location: z.string(),
        rrdatas: z.array(z.unknown()),
        signatureRrdatas: z.array(z.unknown()),
      })),
      kind: z.string(),
    }),
    healthCheck: z.string(),
    kind: z.string(),
    primaryBackup: z.object({
      backupGeoTargets: z.object({
        enableFencing: z.boolean(),
        items: z.array(z.object({
          healthCheckedTargets: z.unknown(),
          kind: z.unknown(),
          location: z.unknown(),
          rrdatas: z.unknown(),
          signatureRrdatas: z.unknown(),
        })),
        kind: z.string(),
      }),
      kind: z.string(),
      primaryTargets: z.object({
        externalEndpoints: z.array(z.string()),
        internalLoadBalancers: z.array(z.object({
          ipAddress: z.unknown(),
          ipProtocol: z.unknown(),
          kind: z.unknown(),
          loadBalancerType: z.unknown(),
          networkUrl: z.unknown(),
          port: z.unknown(),
          project: z.unknown(),
          region: z.unknown(),
        })),
      }),
      trickleTraffic: z.number(),
    }),
    wrr: z.object({
      items: z.array(z.object({
        healthCheckedTargets: z.object({
          externalEndpoints: z.unknown(),
          internalLoadBalancers: z.unknown(),
        }),
        kind: z.string(),
        rrdatas: z.array(z.unknown()),
        signatureRrdatas: z.array(z.unknown()),
        weight: z.number(),
      })),
      kind: z.string(),
    }),
  }).optional(),
  rrdatas: z.array(z.string()).optional(),
  signatureRrdatas: z.array(z.string()).optional(),
  ttl: z.number().optional(),
  type: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  name: z.string().describe("For example, www.example.com.").optional(),
  routingPolicy: z.object({
    geo: z.object({
      enableFencing: z.boolean().describe(
        "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
      ).optional(),
      items: z.array(z.object({
        healthCheckedTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
            "Configuration for internal load balancers to be health checked.",
          ).optional(),
        }).describe(
          "For A and AAAA types only. Endpoints to return in the query result only if they are healthy. These can be specified along with `rrdata` within this item.",
        ).optional(),
        kind: z.string().optional(),
        location: z.string().describe(
          'The geo-location granularity is a GCP region. This location string should correspond to a GCP region. e.g. "us-east1", "southamerica-east1", "asia-east1", etc.',
        ).optional(),
        rrdatas: z.array(z.unknown()).optional(),
        signatureRrdatas: z.array(z.unknown()).describe(
          "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
        ).optional(),
      })).describe(
        "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
      ).optional(),
      kind: z.string().optional(),
    }).describe(
      "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
    ).optional(),
    healthCheck: z.string().describe(
      "The fully qualified URL of the HealthCheck to use for this RRSetRoutingPolicy. Format this URL like `https://www.googleapis.com/compute/v1/projects/{project}/global/healthChecks/{healthCheck}`. https://cloud.google.com/compute/docs/reference/rest/v1/healthChecks",
    ).optional(),
    kind: z.string().optional(),
    primaryBackup: z.object({
      backupGeoTargets: z.object({
        enableFencing: z.boolean().describe(
          "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
        ).optional(),
        items: z.array(z.object({
          healthCheckedTargets: z.unknown().describe(
            "For A and AAAA types only. Endpoints to return in the query result only if they are healthy. These can be specified along with `rrdata` within this item.",
          ).optional(),
          kind: z.unknown().optional(),
          location: z.unknown().describe(
            'The geo-location granularity is a GCP region. This location string should correspond to a GCP region. e.g. "us-east1", "southamerica-east1", "asia-east1", etc.',
          ).optional(),
          rrdatas: z.unknown().optional(),
          signatureRrdatas: z.unknown().describe(
            "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
          ).optional(),
        })).describe(
          "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
        ).optional(),
        kind: z.string().optional(),
      }).describe(
        "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
      ).optional(),
      kind: z.string().optional(),
      primaryTargets: z.object({
        externalEndpoints: z.array(z.string()).describe(
          "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
        ).optional(),
        internalLoadBalancers: z.array(z.object({
          ipAddress: z.unknown().describe(
            "The frontend IP address of the load balancer to health check.",
          ).optional(),
          ipProtocol: z.unknown().describe(
            "The protocol of the load balancer to health check.",
          ).optional(),
          kind: z.unknown().optional(),
          loadBalancerType: z.unknown().describe(
            "The type of load balancer specified by this target. This value must match the configuration of the load balancer located at the LoadBalancerTarget's IP address, port, and region. Use the following: - *regionalL4ilb*: for a regional internal passthrough Network Load Balancer. - *regionalL7ilb*: for a regional internal Application Load Balancer. - *globalL7ilb*: for a global internal Application Load Balancer.",
          ).optional(),
          networkUrl: z.unknown().describe(
            "The fully qualified URL of the network that the load balancer is attached to. This should be formatted like `https://www.googleapis.com/compute/v1/projects/{project}/global/networks/{network}`.",
          ).optional(),
          port: z.unknown().describe(
            "The configured port of the load balancer.",
          ).optional(),
          project: z.unknown().describe(
            "The project ID in which the load balancer is located.",
          ).optional(),
          region: z.unknown().describe(
            "The region in which the load balancer is located.",
          ).optional(),
        })).describe(
          "Configuration for internal load balancers to be health checked.",
        ).optional(),
      }).describe(
        "Endpoints that are health checked before making the routing decision. Unhealthy endpoints are omitted from the results. If all endpoints are unhealthy, we serve a response based on the `backup_geo_targets`.",
      ).optional(),
      trickleTraffic: z.number().describe(
        "When serving state is `PRIMARY`, this field provides the option of sending a small percentage of the traffic to the backup targets.",
      ).optional(),
    }).describe(
      "Configures a RRSetRoutingPolicy such that all queries are responded with the primary_targets if they are healthy. And if all of them are unhealthy, then we fallback to a geo localized policy.",
    ).optional(),
    wrr: z.object({
      items: z.array(z.object({
        healthCheckedTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
            "Configuration for internal load balancers to be health checked.",
          ).optional(),
        }).describe(
          "Endpoints that are health checked before making the routing decision. The unhealthy endpoints are omitted from the result. If all endpoints within a bucket are unhealthy, we choose a different bucket (sampled with respect to its weight) for responding. If DNSSEC is enabled for this zone, only one of `rrdata` or `health_checked_targets` can be set.",
        ).optional(),
        kind: z.string().optional(),
        rrdatas: z.array(z.unknown()).optional(),
        signatureRrdatas: z.array(z.unknown()).describe(
          "DNSSEC generated signatures for all the `rrdata` within this item. When using health-checked targets for DNSSEC-enabled zones, you can only use at most one health-checked IP address per item.",
        ).optional(),
        weight: z.number().describe(
          "The weight corresponding to this `WrrPolicyItem` object. When multiple `WrrPolicyItem` objects are configured, the probability of returning an `WrrPolicyItem` object's data is proportional to its weight relative to the sum of weights configured for all items. This weight must be non-negative.",
        ).optional(),
      })).optional(),
      kind: z.string().optional(),
    }).describe(
      "Configures a RRSetRoutingPolicy that routes in a weighted round robin fashion.",
    ).optional(),
  }).describe(
    "Configures dynamic query responses based on either the geo location of the querying user or a weighted round robin based routing policy. A valid `ResourceRecordSet` contains only `rrdata` (for static resolution) or a `routing_policy` (for dynamic resolution).",
  ).optional(),
  rrdatas: z.array(z.string()).describe(
    "As defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1) -- see examples.",
  ).optional(),
  signatureRrdatas: z.array(z.string()).optional(),
  ttl: z.number().int().describe(
    "Number of seconds that this `ResourceRecordSet` can be cached by resolvers.",
  ).optional(),
  type: z.string().describe(
    "The identifier of a supported record type. See the list of Supported DNS record types.",
  ).optional(),
  managedZone: z.string().describe(
    "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
  ).optional(),
  clientOperationId: z.string().describe(
    "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
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

/** Swamp extension model for Google Cloud DNS ResourceRecordSets. Registered at `@swamp/gcp/dns/resourcerecordsets`. */
export const model = {
  type: "@swamp/gcp/dns/resourcerecordsets",
  version: "2026.09.18.1",
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
      toVersion: "2026.05.26.1",
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
      toVersion: "2026.07.20.2",
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
      toVersion: "2026.08.13.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "A unit of data that is returned by the DNS servers.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a resourceRecordSets",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["managedZone"] !== undefined) {
          params["managedZone"] = String(g["managedZone"]);
        }
        const body: Record<string, unknown> = {};
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["routingPolicy"] !== undefined) {
          body["routingPolicy"] = g["routingPolicy"];
        }
        if (g["rrdatas"] !== undefined) body["rrdatas"] = g["rrdatas"];
        if (g["signatureRrdatas"] !== undefined) {
          body["signatureRrdatas"] = g["signatureRrdatas"];
        }
        if (g["ttl"] !== undefined) body["ttl"] = g["ttl"];
        if (g["type"] !== undefined) body["type"] = g["type"];
        if (g["clientOperationId"] !== undefined) {
          params["clientOperationId"] = String(g["clientOperationId"]);
        }
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        if (g["name"] !== undefined) params["type"] = String(g["name"]);
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
              "project": projectId,
              "managedZone": String(g["managedZone"] ?? ""),
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
      description: "Get a resourceRecordSets",
      arguments: z.object({
        identifier: z.string().describe("The name of the resourceRecordSets"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["managedZone"] !== undefined) {
          params["managedZone"] = String(g["managedZone"]);
        }
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        params["type"] = args.identifier;
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
      description: "Update resourceRecordSets attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific resourceRecordSets by name (e.g. one discovered by list)",
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
        if (g["managedZone"] !== undefined) {
          params["managedZone"] = String(g["managedZone"]);
        } else if (existing["managedZone"]) {
          params["managedZone"] = String(existing["managedZone"]);
        }
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        else if (existing["name"]) params["name"] = String(existing["name"]);
        params["type"] = existing["type"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["routingPolicy"] !== undefined) {
          body["routingPolicy"] = g["routingPolicy"];
        }
        if (g["rrdatas"] !== undefined) body["rrdatas"] = g["rrdatas"];
        if (g["signatureRrdatas"] !== undefined) {
          body["signatureRrdatas"] = g["signatureRrdatas"];
        }
        if (g["ttl"] !== undefined) body["ttl"] = g["ttl"];
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
      description: "Delete the resourceRecordSets",
      arguments: z.object({
        identifier: z.string().describe("The name of the resourceRecordSets"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["managedZone"] !== undefined) {
          params["managedZone"] = String(g["managedZone"]);
        }
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        params["type"] = args.identifier;
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
      description: "Sync resourceRecordSets state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific resourceRecordSets by name (e.g. one discovered by list)",
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
          if (g["managedZone"] !== undefined) {
            params["managedZone"] = String(g["managedZone"]);
          } else if (existing["managedZone"]) {
            params["managedZone"] = String(existing["managedZone"]);
          }
          if (g["name"] !== undefined) params["name"] = String(g["name"]);
          else if (existing["name"]) params["name"] = String(existing["name"]);
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["type"] = identifier;
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
      description: "List resourceRecordSets resources",
      arguments: z.object({
        filter: z.string().describe(
          'Specify a filter expression to view records that exactly match the specified domain. Both the `name` and `type` parameters are not supported and must be omitted when you use `filter`. Your `filter` expression must conform to AIP-160 and you must specify a domain in the `name` field. Optionally, you can include the `type` field to filter records by type. You can also include the `has_suffix` function to view records that match by domain suffix. Examples: * `name`="example.com." * `name`="example.com." AND type="A" * `name`=`has_suffix`("example.com.") * `name`=`has_suffix`("example.com.") AND type="A"',
        ).optional(),
        maxResults: z.number().describe(
          "Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.",
        ).optional(),
        name: z.string().describe(
          "Specify a fully qualified domain name to view only those records. The `name` parameter is not supported and must be omitted when you use `filter`.",
        ).optional(),
        type: z.string().describe(
          "Specify a record type to view only those records. You must also specify the `name` parameter. The `type` parameter is not supported and must be omitted when you use `filter`.",
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
        if (g["managedZone"] !== undefined) {
          params["managedZone"] = String(g["managedZone"]);
        }
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["name"] !== undefined) params["name"] = String(args["name"]);
        if (args["type"] !== undefined) params["type"] = String(args["type"]);
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "rrsets",
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
