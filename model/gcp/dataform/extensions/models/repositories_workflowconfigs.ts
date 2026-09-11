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

// Auto-generated extension model for @swamp/gcp/dataform/repositories-workflowconfigs
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Dataform Repositories.WorkflowConfigs.
 *
 * Represents a Dataform workflow configuration.
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
  return `${parent}/workflowConfigs/${shortName}`;
}

const BASE_URL = "https://dataform.googleapis.com/";

const GET_CONFIG = {
  "id": "dataform.projects.locations.repositories.workflowConfigs.get",
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
  "id": "dataform.projects.locations.repositories.workflowConfigs.create",
  "path": "v1/{+parent}/workflowConfigs",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "parent": {
      "location": "path",
      "required": true,
    },
    "workflowConfigId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "dataform.projects.locations.repositories.workflowConfigs.patch",
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
  "id": "dataform.projects.locations.repositories.workflowConfigs.delete",
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
  "id": "dataform.projects.locations.repositories.workflowConfigs.list",
  "path": "v1/{+parent}/workflowConfigs",
  "httpMethod": "GET",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
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
  cronSchedule: z.string().describe(
    "Optional. Optional schedule (in cron format) for automatic execution of this workflow config.",
  ).optional(),
  disabled: z.boolean().describe(
    "Optional. Disables automatic creation of workflow invocations.",
  ).optional(),
  invocationConfig: z.object({
    endUserAuthConfig: z.object({
      oauthConfig: z.object({
        additionalOauthScopes: z.array(z.string()).describe(
          "Optional. Additional OAuth scopes to use for BigQuery executions. Scopes always in use: `https://www.googleapis.com/auth/bigquery`",
        ).optional(),
      }).describe("Optional. OAuth configuration for end user authentication.")
        .optional(),
      userEmail: z.string().describe(
        "Output only. Email address of the user to run workflow invocations under.",
      ).optional(),
    }).describe(
      "Optional. Configuration for end user authentication. Note that this should not be set when `service_account` is used.",
    ).optional(),
    executionMode: z.enum([
      "EXECUTION_MODE_UNSPECIFIED",
      "DEFAULT",
      "ALL_EXCEPT_UNIT_TESTS",
      "UNIT_TESTS_ONLY",
    ]).describe(
      "Optional. Specifies the execution mode for the workflow invocation.",
    ).optional(),
    fullyRefreshIncrementalTablesEnabled: z.boolean().describe(
      "Optional. When set to true, any incremental tables will be fully refreshed.",
    ).optional(),
    includedTags: z.array(z.string()).describe(
      "Optional. The set of tags to include.",
    ).optional(),
    includedTargets: z.array(z.object({
      database: z.string().describe(
        "Optional. The action's database (Google Cloud project ID).",
      ).optional(),
      name: z.string().describe(
        "Optional. The action's name, within `database` and `schema`.",
      ).optional(),
      schema: z.string().describe(
        "Optional. The action's schema (BigQuery dataset ID), within `database`.",
      ).optional(),
    })).describe("Optional. The set of action identifiers to include.")
      .optional(),
    queryPriority: z.enum([
      "QUERY_PRIORITY_UNSPECIFIED",
      "INTERACTIVE",
      "BATCH",
    ]).describe(
      "Optional. Specifies the priority for query execution in BigQuery. More information can be found at https://cloud.google.com/bigquery/docs/running-queries#queries.",
    ).optional(),
    serviceAccount: z.string().describe(
      "Optional. The service account to run workflow invocations under.",
    ).optional(),
    transitiveDependenciesIncluded: z.boolean().describe(
      "Optional. When set to true, transitive dependencies of included actions will be executed.",
    ).optional(),
    transitiveDependentsIncluded: z.boolean().describe(
      "Optional. When set to true, transitive dependents of included actions will be executed.",
    ).optional(),
  }).describe(
    "Optional. If left unset, a default InvocationConfig will be used.",
  ).optional(),
  name: z.string().describe("Identifier. The workflow config's name.")
    .optional(),
  releaseConfig: z.string().describe(
    "Required. The name of the release config whose release_compilation_result should be executed. Must be in the format `projects/*/locations/*/repositories/*/releaseConfigs/*`.",
  ).optional(),
  timeZone: z.string().describe(
    "Optional. Specifies the time zone to be used when interpreting cron_schedule. Must be a time zone name from the [time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). If left unspecified, the default is `UTC`.",
  ).optional(),
  workflowConfigId: z.string().describe(
    "Required. The ID to use for the workflow config, which will become the final component of the workflow config's resource name.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  createTime: z.string().optional(),
  cronSchedule: z.string().optional(),
  disabled: z.boolean().optional(),
  internalMetadata: z.string().optional(),
  invocationConfig: z.object({
    endUserAuthConfig: z.object({
      oauthConfig: z.object({
        additionalOauthScopes: z.array(z.string()),
      }),
      userEmail: z.string(),
    }),
    executionMode: z.string(),
    fullyRefreshIncrementalTablesEnabled: z.boolean(),
    includedTags: z.array(z.string()),
    includedTargets: z.array(z.object({
      database: z.string(),
      name: z.string(),
      schema: z.string(),
    })),
    queryPriority: z.string(),
    serviceAccount: z.string(),
    transitiveDependenciesIncluded: z.boolean(),
    transitiveDependentsIncluded: z.boolean(),
  }).optional(),
  name: z.string(),
  recentScheduledExecutionRecords: z.array(z.object({
    errorStatus: z.object({
      code: z.number(),
      details: z.array(z.record(z.string(), z.unknown())),
      message: z.string(),
    }),
    executionTime: z.string(),
    workflowInvocation: z.string(),
  })).optional(),
  releaseConfig: z.string().optional(),
  timeZone: z.string().optional(),
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
  cronSchedule: z.string().describe(
    "Optional. Optional schedule (in cron format) for automatic execution of this workflow config.",
  ).optional(),
  disabled: z.boolean().describe(
    "Optional. Disables automatic creation of workflow invocations.",
  ).optional(),
  invocationConfig: z.object({
    endUserAuthConfig: z.object({
      oauthConfig: z.object({
        additionalOauthScopes: z.array(z.string()).describe(
          "Optional. Additional OAuth scopes to use for BigQuery executions. Scopes always in use: `https://www.googleapis.com/auth/bigquery`",
        ).optional(),
      }).describe("Optional. OAuth configuration for end user authentication.")
        .optional(),
      userEmail: z.string().describe(
        "Output only. Email address of the user to run workflow invocations under.",
      ).optional(),
    }).describe(
      "Optional. Configuration for end user authentication. Note that this should not be set when `service_account` is used.",
    ).optional(),
    executionMode: z.enum([
      "EXECUTION_MODE_UNSPECIFIED",
      "DEFAULT",
      "ALL_EXCEPT_UNIT_TESTS",
      "UNIT_TESTS_ONLY",
    ]).describe(
      "Optional. Specifies the execution mode for the workflow invocation.",
    ).optional(),
    fullyRefreshIncrementalTablesEnabled: z.boolean().describe(
      "Optional. When set to true, any incremental tables will be fully refreshed.",
    ).optional(),
    includedTags: z.array(z.string()).describe(
      "Optional. The set of tags to include.",
    ).optional(),
    includedTargets: z.array(z.object({
      database: z.string().describe(
        "Optional. The action's database (Google Cloud project ID).",
      ).optional(),
      name: z.string().describe(
        "Optional. The action's name, within `database` and `schema`.",
      ).optional(),
      schema: z.string().describe(
        "Optional. The action's schema (BigQuery dataset ID), within `database`.",
      ).optional(),
    })).describe("Optional. The set of action identifiers to include.")
      .optional(),
    queryPriority: z.enum([
      "QUERY_PRIORITY_UNSPECIFIED",
      "INTERACTIVE",
      "BATCH",
    ]).describe(
      "Optional. Specifies the priority for query execution in BigQuery. More information can be found at https://cloud.google.com/bigquery/docs/running-queries#queries.",
    ).optional(),
    serviceAccount: z.string().describe(
      "Optional. The service account to run workflow invocations under.",
    ).optional(),
    transitiveDependenciesIncluded: z.boolean().describe(
      "Optional. When set to true, transitive dependencies of included actions will be executed.",
    ).optional(),
    transitiveDependentsIncluded: z.boolean().describe(
      "Optional. When set to true, transitive dependents of included actions will be executed.",
    ).optional(),
  }).describe(
    "Optional. If left unset, a default InvocationConfig will be used.",
  ).optional(),
  name: z.string().describe("Identifier. The workflow config's name.")
    .optional(),
  releaseConfig: z.string().describe(
    "Required. The name of the release config whose release_compilation_result should be executed. Must be in the format `projects/*/locations/*/repositories/*/releaseConfigs/*`.",
  ).optional(),
  timeZone: z.string().describe(
    "Optional. Specifies the time zone to be used when interpreting cron_schedule. Must be a time zone name from the [time zone database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones). If left unspecified, the default is `UTC`.",
  ).optional(),
  workflowConfigId: z.string().describe(
    "Required. The ID to use for the workflow config, which will become the final component of the workflow config's resource name.",
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

/** Swamp extension model for Google Cloud Dataform Repositories.WorkflowConfigs. Registered at `@swamp/gcp/dataform/repositories-workflowconfigs`. */
export const model = {
  type: "@swamp/gcp/dataform/repositories-workflowconfigs",
  version: "2026.09.11.1",
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
      toVersion: "2026.09.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Represents a Dataform workflow configuration.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a workflowConfigs",
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
        if (g["cronSchedule"] !== undefined) {
          body["cronSchedule"] = g["cronSchedule"];
        }
        if (g["disabled"] !== undefined) body["disabled"] = g["disabled"];
        if (g["invocationConfig"] !== undefined) {
          body["invocationConfig"] = g["invocationConfig"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["releaseConfig"] !== undefined) {
          body["releaseConfig"] = g["releaseConfig"];
        }
        if (g["timeZone"] !== undefined) body["timeZone"] = g["timeZone"];
        if (g["workflowConfigId"] !== undefined) {
          params["workflowConfigId"] = String(g["workflowConfigId"]);
        }
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
      description: "Get a workflowConfigs",
      arguments: z.object({
        identifier: z.string().describe("The name of the workflowConfigs"),
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
      description: "Update workflowConfigs attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific workflowConfigs by name (e.g. one discovered by list)",
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
        if (g["cronSchedule"] !== undefined) {
          body["cronSchedule"] = g["cronSchedule"];
        }
        if (g["disabled"] !== undefined) body["disabled"] = g["disabled"];
        if (g["invocationConfig"] !== undefined) {
          body["invocationConfig"] = g["invocationConfig"];
        }
        if (g["releaseConfig"] !== undefined) {
          body["releaseConfig"] = g["releaseConfig"];
        }
        if (g["timeZone"] !== undefined) body["timeZone"] = g["timeZone"];
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
      description: "Delete the workflowConfigs",
      arguments: z.object({
        identifier: z.string().describe("The name of the workflowConfigs"),
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
      description: "Sync workflowConfigs state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific workflowConfigs by name (e.g. one discovered by list)",
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
      description: "List workflowConfigs resources",
      arguments: z.object({
        pageSize: z.number().describe(
          "Optional. Maximum number of workflow configs to return. The server may return fewer items than requested. If unspecified, the server will pick an appropriate default.",
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
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "workflowConfigs",
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
