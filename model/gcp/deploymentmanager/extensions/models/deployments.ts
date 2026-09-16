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

// Auto-generated extension model for @swamp/gcp/deploymentmanager/deployments
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Deployment Manager Deployments.
 *
 * Gets information about a specific deployment.
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

const BASE_URL = "https://deploymentmanager.googleapis.com/";

const GET_CONFIG = {
  "id": "deploymentmanager.deployments.get",
  "path":
    "deploymentmanager/v2/projects/{project}/global/deployments/{deployment}",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "deployment",
  ],
  "parameters": {
    "deployment": {
      "location": "path",
      "required": true,
    },
    "header.bypassBillingFilter": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "deploymentmanager.deployments.insert",
  "path": "deploymentmanager/v2/projects/{project}/global/deployments",
  "httpMethod": "POST",
  "parameterOrder": [
    "project",
  ],
  "parameters": {
    "createPolicy": {
      "location": "query",
    },
    "header.bypassBillingFilter": {
      "location": "query",
    },
    "preview": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "deploymentmanager.deployments.update",
  "path":
    "deploymentmanager/v2/projects/{project}/global/deployments/{deployment}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "project",
    "deployment",
  ],
  "parameters": {
    "createPolicy": {
      "location": "query",
    },
    "deletePolicy": {
      "location": "query",
    },
    "deployment": {
      "location": "path",
      "required": true,
    },
    "header.bypassBillingFilter": {
      "location": "query",
    },
    "preview": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "deploymentmanager.deployments.delete",
  "path":
    "deploymentmanager/v2/projects/{project}/global/deployments/{deployment}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "project",
    "deployment",
  ],
  "parameters": {
    "deletePolicy": {
      "location": "query",
    },
    "deployment": {
      "location": "path",
      "required": true,
    },
    "header.bypassBillingFilter": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "deploymentmanager.deployments.list",
  "path": "deploymentmanager/v2/projects/{project}/global/deployments",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
  ],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "maxResults": {
      "location": "query",
    },
    "orderBy": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "project": {
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
  description: z.string().describe(
    "An optional user-provided description of the deployment.",
  ).optional(),
  fingerprint: z.string().describe(
    "Provides a fingerprint to use in requests to modify a deployment, such as `update()`, `stop()`, and `cancelPreview()` requests. A fingerprint is a randomly generated value that must be provided with `update()`, `stop()`, and `cancelPreview()` requests to perform optimistic locking. This ensures optimistic concurrency so that only one request happens at a time. The fingerprint is initially generated by Deployment Manager and changes after every request to modify data. To get the latest fingerprint value, perform a `get()` request to a deployment.",
  ).optional(),
  id: z.string().optional(),
  labels: z.array(z.object({
    key: z.string().describe("Key of the label").optional(),
    value: z.string().describe("Value of the label").optional(),
  })).describe(
    "Map of One Platform labels; provided by the client when the resource is created or updated. Specifically: Label keys must be between 1 and 63 characters long and must conform to the following regular expression: `[a-z]([-a-z0-9]*[a-z0-9])?` Label values must be between 0 and 63 characters long and must conform to the regular expression `([a-z]([-a-z0-9]*[a-z0-9])?)?`.",
  ).optional(),
  name: z.string().describe(
    "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
  ).optional(),
  target: z.object({
    config: z.object({
      content: z.string().describe("The contents of the file.").optional(),
    }).describe("The configuration to use for this deployment.").optional(),
    imports: z.array(z.object({
      content: z.string().describe("The contents of the file.").optional(),
      name: z.string().describe("The name of the file.").optional(),
    })).describe(
      "Specifies any files to import for this configuration. This can be used to import templates or other files. For example, you might import a text file in order to use the file in a template.",
    ).optional(),
  }).describe(
    "[Input Only] The parameters that define your deployment, including the deployment configuration and relevant templates.",
  ).optional(),
  createPolicy: z.string().describe(
    "Sets the policy to use for creating new resources.",
  ).optional(),
  header_bypassBillingFilter: z.string().describe(
    "The header.bypassBillingFilter for this resource",
  ).optional(),
  preview: z.string().describe(
    'If set to true, creates a deployment and creates "shell" resources but does not actually instantiate these resources. This allows you to preview what your deployment looks like. After previewing a deployment, you can deploy your resources by making a request with the `update()` method or you can use the `cancelPreview()` method to cancel the preview altogether. Note that the deployment will still exist after you cancel the preview and you must separately delete this deployment if you want to remove it.',
  ).optional(),
  deletePolicy: z.string().describe(
    "Sets the policy to use for deleting resources.",
  ).optional(),
});

const StateSchema = z.object({
  description: z.string().optional(),
  fingerprint: z.string().optional(),
  id: z.string().optional(),
  insertTime: z.string().optional(),
  labels: z.array(z.object({
    key: z.string(),
    value: z.string(),
  })).optional(),
  manifest: z.string().optional(),
  name: z.string(),
  operation: z.object({
    clientOperationId: z.string(),
    creationTimestamp: z.string(),
    description: z.string(),
    details: z.object({
      data: z.record(z.string(), z.unknown()),
      message: z.string(),
    }),
    endTime: z.string(),
    error: z.object({
      errors: z.array(z.object({
        arguments: z.array(z.unknown()),
        code: z.string(),
        debugInfo: z.object({
          detail: z.unknown(),
          stackEntries: z.unknown(),
        }),
        errorDetails: z.array(z.unknown()),
        location: z.string(),
        message: z.string(),
      })),
    }),
    firewallPolicyRuleOperationMetadata: z.object({
      allocatedPriority: z.number(),
    }),
    getHealthOperationMetadata: z.object({
      healthInfo: z.object({
        availabilitySloStatus: z.string(),
        healthStatus: z.string(),
        repairCategory: z.string(),
        unhealthyReason: z.string(),
        updateTime: z.string(),
      }),
    }),
    getVersionOperationMetadata: z.object({
      inlineSbomInfo: z.object({
        currentComponentVersions: z.record(z.string(), z.unknown()),
        targetComponentVersions: z.record(z.string(), z.unknown()),
      }),
    }),
    httpErrorMessage: z.string(),
    httpErrorStatusCode: z.number(),
    id: z.string(),
    insertTime: z.string(),
    instancesBulkInsertOperationMetadata: z.object({
      machineType: z.string(),
      perLocationStatus: z.record(z.string(), z.unknown()),
    }),
    instancesTroubleshootOperationMetadata: z.object({
      troubleshootOutput: z.string(),
    }),
    kind: z.string(),
    name: z.string(),
    operationGroupId: z.string(),
    operationType: z.string(),
    progress: z.number(),
    region: z.string(),
    selfLink: z.string(),
    selfLinkWithId: z.string(),
    setAutoscalerLinkOperationMetadata: z.object({
      zonalIgmIds: z.array(z.string()),
      zoneToIgmIds: z.record(z.string(), z.unknown()),
    }),
    setCommonInstanceMetadataOperationMetadata: z.object({
      clientOperationId: z.string(),
      perLocationOperations: z.record(z.string(), z.unknown()),
    }),
    startTime: z.string(),
    status: z.string(),
    statusMessage: z.string(),
    targetId: z.string(),
    targetLink: z.string(),
    user: z.string(),
    warnings: z.array(z.object({
      code: z.string(),
      data: z.array(z.object({
        key: z.unknown(),
        value: z.unknown(),
      })),
      message: z.string(),
    })),
    zone: z.string(),
  }).optional(),
  selfLink: z.string().optional(),
  target: z.object({
    config: z.object({
      content: z.string(),
    }),
    imports: z.array(z.object({
      content: z.string(),
      name: z.string(),
    })),
  }).optional(),
  update: z.object({
    description: z.string(),
    labels: z.array(z.object({
      key: z.string(),
      value: z.string(),
    })),
    manifest: z.string(),
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
  description: z.string().describe(
    "An optional user-provided description of the deployment.",
  ).optional(),
  fingerprint: z.string().describe(
    "Provides a fingerprint to use in requests to modify a deployment, such as `update()`, `stop()`, and `cancelPreview()` requests. A fingerprint is a randomly generated value that must be provided with `update()`, `stop()`, and `cancelPreview()` requests to perform optimistic locking. This ensures optimistic concurrency so that only one request happens at a time. The fingerprint is initially generated by Deployment Manager and changes after every request to modify data. To get the latest fingerprint value, perform a `get()` request to a deployment.",
  ).optional(),
  id: z.string().optional(),
  labels: z.array(z.object({
    key: z.string().describe("Key of the label").optional(),
    value: z.string().describe("Value of the label").optional(),
  })).describe(
    "Map of One Platform labels; provided by the client when the resource is created or updated. Specifically: Label keys must be between 1 and 63 characters long and must conform to the following regular expression: `[a-z]([-a-z0-9]*[a-z0-9])?` Label values must be between 0 and 63 characters long and must conform to the regular expression `([a-z]([-a-z0-9]*[a-z0-9])?)?`.",
  ).optional(),
  name: z.string().describe(
    "Name of the resource; provided by the client when the resource is created. The name must be 1-63 characters long, and comply with RFC1035. Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
  ).optional(),
  target: z.object({
    config: z.object({
      content: z.string().describe("The contents of the file.").optional(),
    }).describe("The configuration to use for this deployment.").optional(),
    imports: z.array(z.object({
      content: z.string().describe("The contents of the file.").optional(),
      name: z.string().describe("The name of the file.").optional(),
    })).describe(
      "Specifies any files to import for this configuration. This can be used to import templates or other files. For example, you might import a text file in order to use the file in a template.",
    ).optional(),
  }).describe(
    "[Input Only] The parameters that define your deployment, including the deployment configuration and relevant templates.",
  ).optional(),
  createPolicy: z.string().describe(
    "Sets the policy to use for creating new resources.",
  ).optional(),
  header_bypassBillingFilter: z.string().describe(
    "The header.bypassBillingFilter for this resource",
  ).optional(),
  preview: z.string().describe(
    'If set to true, creates a deployment and creates "shell" resources but does not actually instantiate these resources. This allows you to preview what your deployment looks like. After previewing a deployment, you can deploy your resources by making a request with the `update()` method or you can use the `cancelPreview()` method to cancel the preview altogether. Note that the deployment will still exist after you cancel the preview and you must separately delete this deployment if you want to remove it.',
  ).optional(),
  deletePolicy: z.string().describe(
    "Sets the policy to use for deleting resources.",
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

/** Swamp extension model for Google Cloud Deployment Manager Deployments. Registered at `@swamp/gcp/deploymentmanager/deployments`. */
export const model = {
  type: "@swamp/gcp/deploymentmanager/deployments",
  version: "2026.09.16.1",
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
      toVersion: "2026.05.25.2",
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
      description: "Removed: operation, update",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { operation: _operation, update: _update, ...rest } = old;
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
      toVersion: "2026.09.07.1",
      description: "Added: deletePolicy",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.2",
      description: "Removed: key, value, config, content, imports, content",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          key: _key,
          value: _value,
          config: _config,
          content: _content,
          imports: _imports,
          ...rest
        } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.09.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Gets information about a specific deployment.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a deployments",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const body: Record<string, unknown> = {};
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["fingerprint"] !== undefined) {
          body["fingerprint"] = g["fingerprint"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["target"] !== undefined) body["target"] = g["target"];
        if (g["createPolicy"] !== undefined) {
          params["createPolicy"] = String(g["createPolicy"]);
        }
        if (g["header_bypassBillingFilter"] !== undefined) {
          body["header_bypassBillingFilter"] = g["header_bypassBillingFilter"];
        }
        if (g["preview"] !== undefined) {
          params["preview"] = String(g["preview"]);
        }
        if (g["name"] !== undefined) params["deployment"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: { "project": projectId },
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
      description: "Get a deployments",
      arguments: z.object({
        identifier: z.string().describe("The name of the deployments"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["deployment"] = args.identifier;
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
      description: "Update deployments attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific deployments by name (e.g. one discovered by list)",
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
        params["deployment"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["fingerprint"] !== undefined) {
          body["fingerprint"] = g["fingerprint"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["target"] !== undefined) body["target"] = g["target"];
        if (g["deletePolicy"] !== undefined) {
          params["deletePolicy"] = String(g["deletePolicy"]);
        } else if (existing["deletePolicy"] !== undefined) {
          params["deletePolicy"] = String(existing["deletePolicy"]);
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
      description: "Delete the deployments",
      arguments: z.object({
        identifier: z.string().describe("The name of the deployments"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["deployment"] = args.identifier;
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
      description: "Sync deployments state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific deployments by name (e.g. one discovered by list)",
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
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["deployment"] = identifier;
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
      description: "List deployments resources",
      arguments: z.object({
        filter: z.string().describe(
          'A filter expression that filters resources listed in the response. Most Compute resources support two types of filter expressions: expressions that support regular expressions and expressions that follow API improvement proposal AIP-160. These two types of filter expressions cannot be mixed in one request. If you want to use AIP-160, your expression must specify the field name, an operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The operator must be either `=`, `!=`, `>`, `<`, `<=`, `>=` or `:`. For example, if you are filtering Compute Engine instances, you can exclude instances named `example-instance` by specifying `name != example-instance`. The `:*` comparison can be used to test whether a key has been defined. For example, to find all objects with `owner` label use: ``` labels.owner:* ``` You can also filter nested fields. For example, you could specify `scheduling.automaticRestart = false` to include instances only if they are not scheduled for automatic restarts. You can use filtering on nested fields to filter based on resource labels. To filter on multiple expressions, provide each separate expression within parentheses. For example: ``` (scheduling.automaticRestart = true) (cpuPlatform = "Intel Skylake") ``` By default, each expression is an `AND` expression. However, you can include `AND` and `OR` expressions explicitly. For example: ``` (cpuPlatform = "Intel Skylake") OR (cpuPlatform = "Intel Broadwell") AND (scheduling.automaticRestart = true) ``` If you want to use a regular expression, use the `eq` (equal) or `ne` (not equal) operator against a single un-parenthesized expression with or without quotes or against multiple parenthesized expressions. Examples: `fieldname eq unquoted literal` `fieldname eq \'single quoted literal\'` `fieldname eq "double quoted literal"` `(fieldname1 eq literal) (fieldname2 ne "literal")` The literal value is interpreted as a regular expression using Google RE2 library syntax. The literal value must match the entire field. For example, to filter for instances that do not end with name "instance", you would use `name ne .*instance`. You cannot combine constraints on multiple fields using regular expressions.',
        ).optional(),
        maxResults: z.number().describe(
          "The maximum number of results per page that should be returned. If the number of available results is larger than `maxResults`, Compute Engine returns a `nextPageToken` that can be used to get the next page of results in subsequent list requests. Acceptable values are `0` to `500`, inclusive. (Default: `500`)",
        ).optional(),
        orderBy: z.string().describe(
          'Sorts list results by a certain order. By default, results are returned in alphanumerical order based on the resource name. You can also sort results in descending order based on the creation timestamp using `orderBy="creationTimestamp desc"`. This sorts results based on the `creationTimestamp` field in reverse chronological order (newest result first). Use this to sort resources like operations so that the newest operation is returned first. Currently, only sorting by `name` or `creationTimestamp desc` is supported.',
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
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "deployments",
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
    cancel_preview: {
      description: "cancel preview",
      arguments: z.object({
        fingerprint: z.any().optional(),
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
        params["deployment"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["fingerprint"] !== undefined) {
          body["fingerprint"] = args["fingerprint"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "deploymentmanager.deployments.cancelPreview",
            "path":
              "deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/cancelPreview",
            "httpMethod": "POST",
            "parameterOrder": ["project", "deployment"],
            "parameters": {
              "deployment": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
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
    get_iam_policy: {
      description: "get iam policy",
      arguments: z.object({
        header_bypassBillingFilter: z.any().optional(),
        optionsRequestedPolicyVersion: z.any().optional(),
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
        if (args["header_bypassBillingFilter"] !== undefined) {
          params["header.bypassBillingFilter"] = String(
            args["header_bypassBillingFilter"],
          );
        }
        if (args["optionsRequestedPolicyVersion"] !== undefined) {
          params["optionsRequestedPolicyVersion"] = String(
            args["optionsRequestedPolicyVersion"],
          );
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "deploymentmanager.deployments.getIamPolicy",
            "path":
              "deploymentmanager/v2/projects/{project}/global/deployments/{resource}/getIamPolicy",
            "httpMethod": "GET",
            "parameterOrder": ["project", "resource"],
            "parameters": {
              "header.bypassBillingFilter": { "location": "query" },
              "optionsRequestedPolicyVersion": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    set_iam_policy: {
      description: "set iam policy",
      arguments: z.object({
        bindings: z.any().optional(),
        etag: z.any().optional(),
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
        if (args["bindings"] !== undefined) body["bindings"] = args["bindings"];
        if (args["etag"] !== undefined) body["etag"] = args["etag"];
        if (args["policy"] !== undefined) body["policy"] = args["policy"];
        if (args["updateMask"] !== undefined) {
          body["updateMask"] = args["updateMask"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "deploymentmanager.deployments.setIamPolicy",
            "path":
              "deploymentmanager/v2/projects/{project}/global/deployments/{resource}/setIamPolicy",
            "httpMethod": "POST",
            "parameterOrder": ["project", "resource"],
            "parameters": {
              "project": { "location": "path", "required": true },
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
    stop: {
      description: "stop",
      arguments: z.object({
        fingerprint: z.any().optional(),
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
        params["deployment"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["fingerprint"] !== undefined) {
          body["fingerprint"] = args["fingerprint"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "deploymentmanager.deployments.stop",
            "path":
              "deploymentmanager/v2/projects/{project}/global/deployments/{deployment}/stop",
            "httpMethod": "POST",
            "parameterOrder": ["project", "deployment"],
            "parameters": {
              "deployment": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
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
        header_bypassBillingFilter: z.any().optional(),
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
        if (args["header_bypassBillingFilter"] !== undefined) {
          params["header.bypassBillingFilter"] = String(
            args["header_bypassBillingFilter"],
          );
        }
        const body: Record<string, unknown> = {};
        if (args["permissions"] !== undefined) {
          body["permissions"] = args["permissions"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "deploymentmanager.deployments.testIamPermissions",
            "path":
              "deploymentmanager/v2/projects/{project}/global/deployments/{resource}/testIamPermissions",
            "httpMethod": "POST",
            "parameterOrder": ["project", "resource"],
            "parameters": {
              "header.bypassBillingFilter": { "location": "query" },
              "project": { "location": "path", "required": true },
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
