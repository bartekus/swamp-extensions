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

// Auto-generated extension model for @swamp/gcp/dns/responsepolicyrules
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud DNS ResponsePolicyRules.
 *
 * A Response Policy Rule is a selector that applies its behavior to queries that match the selector. Selectors are DNS names, which may be wildcards or exact matches. Each DNS query subject to a Response Policy matches at most one ResponsePolicyRule, as identified by the dns_name field with the longest matching suffix.
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
  "id": "dns.responsePolicyRules.get",
  "path":
    "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules/{responsePolicyRule}",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "responsePolicy",
    "responsePolicyRule",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "responsePolicy": {
      "location": "path",
      "required": true,
    },
    "responsePolicyRule": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "dns.responsePolicyRules.create",
  "path": "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules",
  "httpMethod": "POST",
  "parameterOrder": [
    "project",
    "responsePolicy",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "responsePolicy": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "dns.responsePolicyRules.update",
  "path":
    "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules/{responsePolicyRule}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "project",
    "responsePolicy",
    "responsePolicyRule",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "responsePolicy": {
      "location": "path",
      "required": true,
    },
    "responsePolicyRule": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "dns.responsePolicyRules.delete",
  "path":
    "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules/{responsePolicyRule}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "project",
    "responsePolicy",
    "responsePolicyRule",
  ],
  "parameters": {
    "clientOperationId": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "responsePolicy": {
      "location": "path",
      "required": true,
    },
    "responsePolicyRule": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "dns.responsePolicyRules.list",
  "path": "dns/v1/projects/{project}/responsePolicies/{responsePolicy}/rules",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "responsePolicy",
  ],
  "parameters": {
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
    "responsePolicy": {
      "location": "path",
      "required": true,
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
  behavior: z.enum(["behaviorUnspecified", "bypassResponsePolicy"]).describe(
    "Answer this query with a behavior rather than DNS data.",
  ).optional(),
  dnsName: z.string().describe(
    "The DNS name (wildcard or exact) to apply this rule to. Must be unique within the Response Policy Rule.",
  ).optional(),
  localData: z.object({
    localDatas: z.array(z.object({
      kind: z.string().optional(),
      name: z.string().describe("For example, www.example.com.").optional(),
      routingPolicy: z.object({
        geo: z.object({
          enableFencing: z.unknown().describe(
            "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
          ).optional(),
          items: z.unknown().describe(
            "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
          ).optional(),
          kind: z.unknown().optional(),
        }).describe(
          "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
        ).optional(),
        healthCheck: z.string().describe(
          "The fully qualified URL of the HealthCheck to use for this RRSetRoutingPolicy. Format this URL like `https://www.googleapis.com/compute/v1/projects/{project}/global/healthChecks/{healthCheck}`. https://cloud.google.com/compute/docs/reference/rest/v1/healthChecks",
        ).optional(),
        kind: z.string().optional(),
        primaryBackup: z.object({
          backupGeoTargets: z.unknown().describe(
            "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
          ).optional(),
          kind: z.unknown().optional(),
          primaryTargets: z.unknown().describe(
            "Endpoints that are health checked before making the routing decision. Unhealthy endpoints are omitted from the results. If all endpoints are unhealthy, we serve a response based on the `backup_geo_targets`.",
          ).optional(),
          trickleTraffic: z.unknown().describe(
            "When serving state is `PRIMARY`, this field provides the option of sending a small percentage of the traffic to the backup targets.",
          ).optional(),
        }).describe(
          "Configures a RRSetRoutingPolicy such that all queries are responded with the primary_targets if they are healthy. And if all of them are unhealthy, then we fallback to a geo localized policy.",
        ).optional(),
        wrr: z.object({
          items: z.unknown().optional(),
          kind: z.unknown().optional(),
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
      "All resource record sets for this selector, one per resource record type. The name must match the dns_name.",
    ).optional(),
  }).describe(
    "Answer this query directly with DNS data. These ResourceRecordSets override any other DNS behavior for the matched name; in particular they override private zones, the public internet, and GCP internal DNS. No SOA nor NS types are allowed.",
  ).optional(),
  ruleName: z.string().describe(
    "An identifier for this rule. Must be unique with the ResponsePolicy.",
  ).optional(),
  responsePolicy: z.string().describe(
    "User assigned name of the Response Policy containing the Response Policy Rule.",
  ),
  clientOperationId: z.string().describe(
    "For mutating operation requests only. An optional identifier specified by the client. Must be unique for operation resources in the Operations collection.",
  ).optional(),
});

const StateSchema = z.object({
  behavior: z.string().optional(),
  dnsName: z.string().optional(),
  kind: z.string().optional(),
  localData: z.object({
    localDatas: z.array(z.object({
      kind: z.string(),
      name: z.string(),
      routingPolicy: z.object({
        geo: z.object({
          enableFencing: z.unknown(),
          items: z.unknown(),
          kind: z.unknown(),
        }),
        healthCheck: z.string(),
        kind: z.string(),
        primaryBackup: z.object({
          backupGeoTargets: z.unknown(),
          kind: z.unknown(),
          primaryTargets: z.unknown(),
          trickleTraffic: z.unknown(),
        }),
        wrr: z.object({
          items: z.unknown(),
          kind: z.unknown(),
        }),
      }),
      rrdatas: z.array(z.string()),
      signatureRrdatas: z.array(z.string()),
      ttl: z.number(),
      type: z.string(),
    })),
  }).optional(),
  ruleName: z.string().optional(),
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
  behavior: z.enum(["behaviorUnspecified", "bypassResponsePolicy"]).describe(
    "Answer this query with a behavior rather than DNS data.",
  ).optional(),
  dnsName: z.string().describe(
    "The DNS name (wildcard or exact) to apply this rule to. Must be unique within the Response Policy Rule.",
  ).optional(),
  localData: z.object({
    localDatas: z.array(z.object({
      kind: z.string().optional(),
      name: z.string().describe("For example, www.example.com.").optional(),
      routingPolicy: z.object({
        geo: z.object({
          enableFencing: z.unknown().describe(
            "Without fencing, if health check fails for all configured items in the current geo bucket, we failover to the next nearest geo bucket. With fencing, if health checking is enabled, as long as some targets in the current geo bucket are healthy, we return only the healthy targets. However, if all targets are unhealthy, we don't failover to the next nearest bucket; instead, we return all the items in the current bucket even when all targets are unhealthy.",
          ).optional(),
          items: z.unknown().describe(
            "The primary geo routing configuration. If there are multiple items with the same location, an error is returned instead.",
          ).optional(),
          kind: z.unknown().optional(),
        }).describe(
          "Configures a `RRSetRoutingPolicy` that routes based on the geo location of the querying user.",
        ).optional(),
        healthCheck: z.string().describe(
          "The fully qualified URL of the HealthCheck to use for this RRSetRoutingPolicy. Format this URL like `https://www.googleapis.com/compute/v1/projects/{project}/global/healthChecks/{healthCheck}`. https://cloud.google.com/compute/docs/reference/rest/v1/healthChecks",
        ).optional(),
        kind: z.string().optional(),
        primaryBackup: z.object({
          backupGeoTargets: z.unknown().describe(
            "Backup targets provide a regional failover policy for the otherwise global primary targets. If serving state is set to `BACKUP`, this policy essentially becomes a geo routing policy.",
          ).optional(),
          kind: z.unknown().optional(),
          primaryTargets: z.unknown().describe(
            "Endpoints that are health checked before making the routing decision. Unhealthy endpoints are omitted from the results. If all endpoints are unhealthy, we serve a response based on the `backup_geo_targets`.",
          ).optional(),
          trickleTraffic: z.unknown().describe(
            "When serving state is `PRIMARY`, this field provides the option of sending a small percentage of the traffic to the backup targets.",
          ).optional(),
        }).describe(
          "Configures a RRSetRoutingPolicy such that all queries are responded with the primary_targets if they are healthy. And if all of them are unhealthy, then we fallback to a geo localized policy.",
        ).optional(),
        wrr: z.object({
          items: z.unknown().optional(),
          kind: z.unknown().optional(),
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
      "All resource record sets for this selector, one per resource record type. The name must match the dns_name.",
    ).optional(),
  }).describe(
    "Answer this query directly with DNS data. These ResourceRecordSets override any other DNS behavior for the matched name; in particular they override private zones, the public internet, and GCP internal DNS. No SOA nor NS types are allowed.",
  ).optional(),
  ruleName: z.string().describe(
    "An identifier for this rule. Must be unique with the ResponsePolicy.",
  ).optional(),
  responsePolicy: z.string().describe(
    "User assigned name of the Response Policy containing the Response Policy Rule.",
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

/** Swamp extension model for Google Cloud DNS ResponsePolicyRules. Registered at `@swamp/gcp/dns/responsepolicyrules`. */
export const model = {
  type: "@swamp/gcp/dns/responsepolicyrules",
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
        "A Response Policy Rule is a selector that applies its behavior to queries tha...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a responsePolicyRules",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["responsePolicy"] !== undefined) {
          params["responsePolicy"] = String(g["responsePolicy"]);
        }
        const body: Record<string, unknown> = {};
        if (g["behavior"] !== undefined) body["behavior"] = g["behavior"];
        if (g["dnsName"] !== undefined) body["dnsName"] = g["dnsName"];
        if (g["localData"] !== undefined) body["localData"] = g["localData"];
        if (g["ruleName"] !== undefined) body["ruleName"] = g["ruleName"];
        if (g["clientOperationId"] !== undefined) {
          params["clientOperationId"] = String(g["clientOperationId"]);
        }
        if (g["name"] !== undefined) {
          params["responsePolicyRule"] = String(g["name"]);
        }
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
      description: "Get a responsePolicyRules",
      arguments: z.object({
        identifier: z.string().describe("The name of the responsePolicyRules"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["responsePolicy"] !== undefined) {
          params["responsePolicy"] = String(g["responsePolicy"]);
        }
        params["responsePolicyRule"] = args.identifier;
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
    update: {
      description: "Update responsePolicyRules attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific responsePolicyRules by name (e.g. one discovered by list)",
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
        if (g["responsePolicy"] !== undefined) {
          params["responsePolicy"] = String(g["responsePolicy"]);
        } else if (existing["responsePolicy"]) {
          params["responsePolicy"] = String(existing["responsePolicy"]);
        }
        params["responsePolicyRule"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["behavior"] !== undefined) body["behavior"] = g["behavior"];
        if (g["dnsName"] !== undefined) body["dnsName"] = g["dnsName"];
        if (g["localData"] !== undefined) body["localData"] = g["localData"];
        if (g["ruleName"] !== undefined) body["ruleName"] = g["ruleName"];
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
          UPDATE_CONFIG,
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
      description: "Delete the responsePolicyRules",
      arguments: z.object({
        identifier: z.string().describe("The name of the responsePolicyRules"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["responsePolicy"] !== undefined) {
          params["responsePolicy"] = String(g["responsePolicy"]);
        }
        params["responsePolicyRule"] = args.identifier;
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
      description: "Sync responsePolicyRules state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific responsePolicyRules by name (e.g. one discovered by list)",
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
          if (g["responsePolicy"] !== undefined) {
            params["responsePolicy"] = String(g["responsePolicy"]);
          } else if (existing["responsePolicy"]) {
            params["responsePolicy"] = String(existing["responsePolicy"]);
          }
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["responsePolicyRule"] = identifier;
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
      description: "List responsePolicyRules resources",
      arguments: z.object({
        maxResults: z.number().describe(
          "Optional. Maximum number of results to be returned. If unspecified, the server decides how many results to return.",
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
        if (g["responsePolicy"] !== undefined) {
          params["responsePolicy"] = String(g["responsePolicy"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "responsePolicyRules",
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
