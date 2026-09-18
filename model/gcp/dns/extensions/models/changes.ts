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

// Auto-generated extension model for @swamp/gcp/dns/changes
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud DNS Changes.
 *
 * A Change represents a set of `ResourceRecordSet` additions and deletions applied atomically to a ManagedZone. ResourceRecordSets within a ManagedZone are modified by creating a new Change element in the Changes collection. In turn the Changes collection also records the past modifications to the `ResourceRecordSets` in a `ManagedZone`. The current state of the `ManagedZone` is the sum effect of applying all `Change` elements in the `Changes` collection in sequence.
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  listResources,
  readResource,
} from "./_lib/gcp.ts";

const BASE_URL = "https://dns.googleapis.com/";

const GET_CONFIG = {
  "id": "dns.changes.get",
  "path":
    "dns/v1/projects/{project}/managedZones/{managedZone}/changes/{changeId}",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "managedZone",
    "changeId",
  ],
  "parameters": {
    "changeId": {
      "location": "path",
      "required": true,
    },
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

const INSERT_CONFIG = {
  "id": "dns.changes.create",
  "path": "dns/v1/projects/{project}/managedZones/{managedZone}/changes",
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

const LIST_CONFIG = {
  "id": "dns.changes.list",
  "path": "dns/v1/projects/{project}/managedZones/{managedZone}/changes",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "managedZone",
  ],
  "parameters": {
    "managedZone": {
      "location": "path",
      "required": true,
    },
    "maxResults": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "sortBy": {
      "location": "query",
    },
    "sortOrder": {
      "location": "query",
    },
  },
} as const;

const GlobalArgsSchema = z.object({
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
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
  additions: z.array(z.object({
    kind: z.string().optional(),
    name: z.string().describe("For example, www.example.com.").optional(),
    routingPolicy: z.object({
      geo: z.object({
        enableFencing: z.boolean().describe(
          "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
        ).optional(),
        items: z.array(z.unknown()).describe(
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
          enableFencing: z.unknown().describe(
            "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
          ).optional(),
          items: z.unknown().describe(
            "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
          ).optional(),
          kind: z.unknown().optional(),
        }).describe(
          "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
        ).optional(),
        kind: z.string().optional(),
        primaryTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
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
        items: z.array(z.unknown()).optional(),
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
  })).describe("Which ResourceRecordSets to add?").optional(),
  deletions: z.array(z.object({
    kind: z.string().optional(),
    name: z.string().describe("For example, www.example.com.").optional(),
    routingPolicy: z.object({
      geo: z.object({
        enableFencing: z.boolean().describe(
          "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
        ).optional(),
        items: z.array(z.unknown()).describe(
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
          enableFencing: z.unknown().describe(
            "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
          ).optional(),
          items: z.unknown().describe(
            "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
          ).optional(),
          kind: z.unknown().optional(),
        }).describe(
          "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
        ).optional(),
        kind: z.string().optional(),
        primaryTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
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
        items: z.array(z.unknown()).optional(),
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
  })).describe(
    "Which ResourceRecordSets to remove? Must match existing data exactly.",
  ).optional(),
  isServing: z.boolean().describe(
    "If the DNS queries for the zone will be served.",
  ).optional(),
  managedZone: z.string().describe(
    "Identifies the managed zone addressed by this request. Can be the managed zone name or ID.",
  ),
  clientOperationId: z.string().describe(
    "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
  ).optional(),
});

const StateSchema = z.object({
  additions: z.array(z.object({
    kind: z.string(),
    name: z.string(),
    routingPolicy: z.object({
      geo: z.object({
        enableFencing: z.boolean(),
        items: z.array(z.unknown()),
        kind: z.string(),
      }),
      healthCheck: z.string(),
      kind: z.string(),
      primaryBackup: z.object({
        backupGeoTargets: z.object({
          enableFencing: z.unknown(),
          items: z.unknown(),
          kind: z.unknown(),
        }),
        kind: z.string(),
        primaryTargets: z.object({
          externalEndpoints: z.unknown(),
          internalLoadBalancers: z.unknown(),
        }),
        trickleTraffic: z.number(),
      }),
      wrr: z.object({
        items: z.array(z.unknown()),
        kind: z.string(),
      }),
    }),
    rrdatas: z.array(z.string()),
    signatureRrdatas: z.array(z.string()),
    ttl: z.number(),
    type: z.string(),
  })).optional(),
  deletions: z.array(z.object({
    kind: z.string(),
    name: z.string(),
    routingPolicy: z.object({
      geo: z.object({
        enableFencing: z.boolean(),
        items: z.array(z.unknown()),
        kind: z.string(),
      }),
      healthCheck: z.string(),
      kind: z.string(),
      primaryBackup: z.object({
        backupGeoTargets: z.object({
          enableFencing: z.unknown(),
          items: z.unknown(),
          kind: z.unknown(),
        }),
        kind: z.string(),
        primaryTargets: z.object({
          externalEndpoints: z.unknown(),
          internalLoadBalancers: z.unknown(),
        }),
        trickleTraffic: z.number(),
      }),
      wrr: z.object({
        items: z.array(z.unknown()),
        kind: z.string(),
      }),
    }),
    rrdatas: z.array(z.string()),
    signatureRrdatas: z.array(z.string()),
    ttl: z.number(),
    type: z.string(),
  })).optional(),
  id: z.string().optional(),
  isServing: z.boolean().optional(),
  kind: z.string().optional(),
  startTime: z.string().optional(),
  status: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  additions: z.array(z.object({
    kind: z.string().optional(),
    name: z.string().describe("For example, www.example.com.").optional(),
    routingPolicy: z.object({
      geo: z.object({
        enableFencing: z.boolean().describe(
          "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
        ).optional(),
        items: z.array(z.unknown()).describe(
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
          enableFencing: z.unknown().describe(
            "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
          ).optional(),
          items: z.unknown().describe(
            "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
          ).optional(),
          kind: z.unknown().optional(),
        }).describe(
          "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
        ).optional(),
        kind: z.string().optional(),
        primaryTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
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
        items: z.array(z.unknown()).optional(),
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
  })).describe("Which ResourceRecordSets to add?").optional(),
  deletions: z.array(z.object({
    kind: z.string().optional(),
    name: z.string().describe("For example, www.example.com.").optional(),
    routingPolicy: z.object({
      geo: z.object({
        enableFencing: z.boolean().describe(
          "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
        ).optional(),
        items: z.array(z.unknown()).describe(
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
          enableFencing: z.unknown().describe(
            "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
          ).optional(),
          items: z.unknown().describe(
            "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
          ).optional(),
          kind: z.unknown().optional(),
        }).describe(
          "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
        ).optional(),
        kind: z.string().optional(),
        primaryTargets: z.object({
          externalEndpoints: z.unknown().describe(
            "The Internet IP addresses to be health checked. The format matches the format of ResourceRecordSet.rrdata as defined in RFC 1035 (section 5) and RFC 1034 (section 3.6.1)",
          ).optional(),
          internalLoadBalancers: z.unknown().describe(
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
        items: z.array(z.unknown()).optional(),
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
  })).describe(
    "Which ResourceRecordSets to remove? Must match existing data exactly.",
  ).optional(),
  isServing: z.boolean().describe(
    "If the DNS queries for the zone will be served.",
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

/** Swamp extension model for Google Cloud DNS Changes. Registered at `@swamp/gcp/dns/changes`. */
export const model = {
  type: "@swamp/gcp/dns/changes",
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
      toVersion: "2026.09.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "A Change represents a set of `ResourceRecordSet` additions and deletions appl...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a changes",
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
        if (g["additions"] !== undefined) body["additions"] = g["additions"];
        if (g["deletions"] !== undefined) body["deletions"] = g["deletions"];
        if (g["isServing"] !== undefined) body["isServing"] = g["isServing"];
        if (g["clientOperationId"] !== undefined) {
          params["clientOperationId"] = String(g["clientOperationId"]);
        }
        if (g["name"] !== undefined) params["changeId"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          undefined,
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
      description: "Get a changes",
      arguments: z.object({
        identifier: z.string().describe("The name of the changes"),
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
        params["changeId"] = args.identifier;
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName = (g.name?.toString() ?? args.identifier).replace(
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
    sync: {
      description: "Sync changes state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific changes by name (e.g. one discovered by list)",
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
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["changeId"] = identifier;
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
      description: "List changes resources",
      arguments: z.object({
        maxResults: z.number().describe(
          "Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.",
        ).optional(),
        sortBy: z.string().describe(
          "Sorting criterion. The only supported value is change sequence.",
        ).optional(),
        sortOrder: z.string().describe(
          "Sorting order direction: 'ascending' or 'descending'.",
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
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["sortBy"] !== undefined) {
          params["sortBy"] = String(args["sortBy"]);
        }
        if (args["sortOrder"] !== undefined) {
          params["sortOrder"] = String(args["sortOrder"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "changes",
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
