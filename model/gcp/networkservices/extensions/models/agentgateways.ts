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

// Auto-generated extension model for @swamp/gcp/networkservices/agentgateways
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Network Services AgentGateways.
 *
 * AgentGateway represents the agent gateway resource.
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
  return `${parent}/agentGateways/${shortName}`;
}

const BASE_URL = "https://networkservices.googleapis.com/";

const GET_CONFIG = {
  "id": "networkservices.projects.locations.agentGateways.get",
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
  "id": "networkservices.projects.locations.agentGateways.create",
  "path": "v1/{+parent}/agentGateways",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "agentGatewayId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "networkservices.projects.locations.agentGateways.patch",
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
  "id": "networkservices.projects.locations.agentGateways.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "etag": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "networkservices.projects.locations.agentGateways.list",
  "path": "v1/{+parent}/agentGateways",
  "httpMethod": "GET",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "filter": {
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
    "returnPartialSuccess": {
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
  agentConnectivityTemplate: z.string().describe(
    "Optional. The resource name of the AgentConnectivityTemplate. Format: projects/{project}/locations/{location}/agentConnectivityTemplates/{template}",
  ).optional(),
  description: z.string().describe(
    "Optional. A free-text description of the resource. Max length 1024 characters.",
  ).optional(),
  googleManaged: z.object({
    governedAccessPath: z.enum([
      "GOVERNED_ACCESS_PATH_UNSPECIFIED",
      "AGENT_TO_ANYWHERE",
      "CLIENT_TO_AGENT",
    ]).describe("Optional. Operating Mode of Agent Gateway.").optional(),
  }).describe(
    "Optional. Proxy is orchestrated and managed by GoogleCloud in a tenant project.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Set of label tags associated with the AgentGateway resource.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Name of the AgentGateway resource. It matches pattern `projects/*/locations/*/agentGateways/`.",
  ).optional(),
  networkConfig: z.object({
    dnsPeeringConfig: z.object({
      domains: z.array(z.string()).describe(
        "Required. Domain names for which DNS queries should be forwarded to the target network.",
      ).optional(),
      targetNetwork: z.string().describe(
        "Required. Target network in 'target project' to which DNS queries should be forwarded to. Must be in format of `projects/{project}/global/networks/{network}`.",
      ).optional(),
      targetProject: z.string().describe(
        "Required. Target project ID to which DNS queries should be forwarded to. This can be the same project that contains the AgentGateway or a different project.",
      ).optional(),
    }).describe(
      "Optional. Optional DNS peering configuration for connectivity to your private VPC network.",
    ).optional(),
    egress: z.object({
      networkAttachment: z.string().describe(
        "Optional. The URI of the Network Attachment resource.",
      ).optional(),
    }).describe(
      "Optional. Optional PSC-Interface network attachment for connectivity to your private VPCs network.",
    ).optional(),
  }).describe("Optional. Network configuration for the AgentGateway.")
    .optional(),
  registries: z.array(z.string()).describe(
    "Optional. A list of Agent registries containing the agents, MCP servers and tools governed by the Agent Gateway. Note: Currently limited to project-scoped registries Must be of format `//agentregistry.googleapis.com/projects/{project}/locations/{location}/`",
  ).optional(),
  selfManaged: z.object({
    resourceUri: z.string().describe(
      "Optional. A supported Google Cloud networking proxy in the Project and Location",
    ).optional(),
    resourceUris: z.array(z.string()).describe(
      "Optional. List of supported Google Cloud networking proxies in the Project and Location. resource_uris is mutually exclusive with resource_uri.",
    ).optional(),
  }).describe(
    "Optional. Attach to existing Application Load Balancers or Secure Web Proxies.",
  ).optional(),
  agentGatewayId: z.string().describe(
    "Required. Short name of the AgentGateway resource to be created.",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  agentConnectivityTemplate: z.string().optional(),
  agentGatewayCard: z.object({
    mtlsEndpoint: z.string(),
    rootCertificates: z.array(z.string()),
    serviceExtensionsServiceAccount: z.string(),
  }).optional(),
  createTime: z.string().optional(),
  description: z.string().optional(),
  etag: z.string().optional(),
  googleManaged: z.object({
    governedAccessPath: z.string(),
  }).optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  name: z.string(),
  networkConfig: z.object({
    dnsPeeringConfig: z.object({
      domains: z.array(z.string()),
      targetNetwork: z.string(),
      targetProject: z.string(),
    }),
    egress: z.object({
      networkAttachment: z.string(),
    }),
  }).optional(),
  protocols: z.array(z.string()).optional(),
  registries: z.array(z.string()).optional(),
  selfManaged: z.object({
    resourceUri: z.string(),
    resourceUris: z.array(z.string()),
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
  agentConnectivityTemplate: z.string().describe(
    "Optional. The resource name of the AgentConnectivityTemplate. Format: projects/{project}/locations/{location}/agentConnectivityTemplates/{template}",
  ).optional(),
  description: z.string().describe(
    "Optional. A free-text description of the resource. Max length 1024 characters.",
  ).optional(),
  googleManaged: z.object({
    governedAccessPath: z.enum([
      "GOVERNED_ACCESS_PATH_UNSPECIFIED",
      "AGENT_TO_ANYWHERE",
      "CLIENT_TO_AGENT",
    ]).describe("Optional. Operating Mode of Agent Gateway.").optional(),
  }).describe(
    "Optional. Proxy is orchestrated and managed by GoogleCloud in a tenant project.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Set of label tags associated with the AgentGateway resource.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Name of the AgentGateway resource. It matches pattern `projects/*/locations/*/agentGateways/`.",
  ).optional(),
  networkConfig: z.object({
    dnsPeeringConfig: z.object({
      domains: z.array(z.string()).describe(
        "Required. Domain names for which DNS queries should be forwarded to the target network.",
      ).optional(),
      targetNetwork: z.string().describe(
        "Required. Target network in 'target project' to which DNS queries should be forwarded to. Must be in format of `projects/{project}/global/networks/{network}`.",
      ).optional(),
      targetProject: z.string().describe(
        "Required. Target project ID to which DNS queries should be forwarded to. This can be the same project that contains the AgentGateway or a different project.",
      ).optional(),
    }).describe(
      "Optional. Optional DNS peering configuration for connectivity to your private VPC network.",
    ).optional(),
    egress: z.object({
      networkAttachment: z.string().describe(
        "Optional. The URI of the Network Attachment resource.",
      ).optional(),
    }).describe(
      "Optional. Optional PSC-Interface network attachment for connectivity to your private VPCs network.",
    ).optional(),
  }).describe("Optional. Network configuration for the AgentGateway.")
    .optional(),
  registries: z.array(z.string()).describe(
    "Optional. A list of Agent registries containing the agents, MCP servers and tools governed by the Agent Gateway. Note: Currently limited to project-scoped registries Must be of format `//agentregistry.googleapis.com/projects/{project}/locations/{location}/`",
  ).optional(),
  selfManaged: z.object({
    resourceUri: z.string().describe(
      "Optional. A supported Google Cloud networking proxy in the Project and Location",
    ).optional(),
    resourceUris: z.array(z.string()).describe(
      "Optional. List of supported Google Cloud networking proxies in the Project and Location. resource_uris is mutually exclusive with resource_uri.",
    ).optional(),
  }).describe(
    "Optional. Attach to existing Application Load Balancers or Secure Web Proxies.",
  ).optional(),
  agentGatewayId: z.string().describe(
    "Required. Short name of the AgentGateway resource to be created.",
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

/** Swamp extension model for Google Cloud Network Services AgentGateways. Registered at `@swamp/gcp/networkservices/agentgateways`. */
export const model = {
  type: "@swamp/gcp/networkservices/agentgateways",
  version: "2026.09.12.1",
  upgrades: [
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
      toVersion: "2026.09.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "AgentGateway represents the agent gateway resource.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a agentGateways",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
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
        if (g["agentConnectivityTemplate"] !== undefined) {
          body["agentConnectivityTemplate"] = g["agentConnectivityTemplate"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["googleManaged"] !== undefined) {
          body["googleManaged"] = g["googleManaged"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["networkConfig"] !== undefined) {
          body["networkConfig"] = g["networkConfig"];
        }
        if (g["registries"] !== undefined) body["registries"] = g["registries"];
        if (g["selfManaged"] !== undefined) {
          body["selfManaged"] = g["selfManaged"];
        }
        if (g["agentGatewayId"] !== undefined) {
          params["agentGatewayId"] = String(g["agentGatewayId"]);
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
          undefined,
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
      description: "Get a agentGateways",
      arguments: z.object({
        identifier: z.string().describe("The name of the agentGateways"),
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
      description: "Update agentGateways attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific agentGateways by name (e.g. one discovered by list)",
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
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            existingName ?? g["name"]?.toString() ?? "",
          );
        }
        const body: Record<string, unknown> = {};
        if (g["agentConnectivityTemplate"] !== undefined) {
          body["agentConnectivityTemplate"] = g["agentConnectivityTemplate"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["googleManaged"] !== undefined) {
          body["googleManaged"] = g["googleManaged"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["networkConfig"] !== undefined) {
          body["networkConfig"] = g["networkConfig"];
        }
        if (g["registries"] !== undefined) body["registries"] = g["registries"];
        if (g["selfManaged"] !== undefined) {
          body["selfManaged"] = g["selfManaged"];
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
      description: "Delete the agentGateways",
      arguments: z.object({
        identifier: z.string().describe("The name of the agentGateways"),
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
      description: "Sync agentGateways state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific agentGateways by name (e.g. one discovered by list)",
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
      description: "List agentGateways resources",
      arguments: z.object({
        filter: z.string().describe(
          "Optional. A filter expression to filter the results listed in the response. The expression must follow the syntax described in [AIP-160](https://google.aip.dev/160).",
        ).optional(),
        pageSize: z.number().describe(
          "Optional. Maximum number of AgentGateways to return per call.",
        ).optional(),
        returnPartialSuccess: z.boolean().describe(
          "Optional. If true, allow partial responses for multi-regional Aggregated List requests. Otherwise if one of the locations is down or unreachable, the Aggregated List request will fail.",
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
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["returnPartialSuccess"] !== undefined) {
          params["returnPartialSuccess"] = String(args["returnPartialSuccess"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "agentGateways",
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
