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

// Auto-generated extension model for @swamp/gcp/dataform/repositories
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Dataform Repositories.
 *
 * Represents a Dataform Git repository.
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
  return `${parent}/repositories/${shortName}`;
}

const BASE_URL = "https://dataform.googleapis.com/";

const GET_CONFIG = {
  "id": "dataform.projects.locations.repositories.get",
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
  "id": "dataform.projects.locations.repositories.create",
  "path": "v1/{+parent}/repositories",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "parent": {
      "location": "path",
      "required": true,
    },
    "repositoryId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "dataform.projects.locations.repositories.patch",
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
  "id": "dataform.projects.locations.repositories.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "force": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "dataform.projects.locations.repositories.list",
  "path": "v1/{+parent}/repositories",
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
  containingFolder: z.string().describe(
    "Optional. The name of the containing folder of the repository. The field is immutable and it can be modified via a MoveRepository operation. Format: `projects/*/locations/*/folders/*`. or `projects/*/locations/*/teamFolders/*`.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. The repository's user-friendly name.",
  ).optional(),
  endUserAuthConfig: z.object({
    oauthConfig: z.object({
      additionalOauthScopes: z.array(z.string()).describe(
        "Optional. Additional OAuth scopes to use for BigQuery executions. Scopes always in use: `https://www.googleapis.com/auth/bigquery`",
      ).optional(),
    }).describe(
      "Optional. OAuth configuration for repository end user authentication.",
    ).optional(),
  }).describe(
    "Optional. Includes configuration options for end user authentication.",
  ).optional(),
  gitRemoteSettings: z.object({
    authenticationTokenSecretVersion: z.string().describe(
      "Optional. The name of the Secret Manager secret version to use as an authentication token for Git operations. Must be in the format `projects/*/secrets/*/versions/*`.",
    ).optional(),
    defaultBranch: z.string().describe(
      "Optional. The Git remote's default branch name. If not set, `main` will be used.",
    ).optional(),
    effectiveDefaultBranch: z.string().describe(
      "Output only. The Git remote's effective default branch name. This is the default branch name of the Git remote if it is set, otherwise it is `main`.",
    ).optional(),
    gitRepositoryLink: z.string().describe(
      "Optional. Resource name for the `GitRepositoryLink` used for machine credentials. Must be in the format `projects/*/locations/*/connections/*/gitRepositoryLinks/*`",
    ).optional(),
    sshAuthenticationConfig: z.object({
      hostPublicKey: z.string().describe(
        "Required. Content of a public SSH key to verify an identity of a remote Git host.",
      ).optional(),
      userPrivateKeySecretVersion: z.string().describe(
        "Required. The name of the Secret Manager secret version to use as a ssh private key for Git operations. Must be in the format `projects/*/secrets/*/versions/*`.",
      ).optional(),
    }).describe(
      "Optional. Authentication fields for remote uris using SSH protocol.",
    ).optional(),
    tokenStatus: z.enum([
      "TOKEN_STATUS_UNSPECIFIED",
      "NOT_FOUND",
      "INVALID",
      "VALID",
    ]).describe(
      "Output only. Deprecated: The field does not contain any token status information.",
    ).optional(),
    url: z.string().describe("Required. The Git remote's URL.").optional(),
  }).describe(
    "Optional. If set, configures this repository to be linked to a Git remote.",
  ).optional(),
  kmsKeyName: z.string().describe(
    "Optional. The reference to a KMS encryption key. If provided, it will be used to encrypt user data in the repository and all child resources. It is not possible to add or update the encryption key after the repository is created. Example: `projects/{kms_project}/locations/{location}/keyRings/{key_location}/cryptoKeys/{key}`",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Repository user labels.",
  ).optional(),
  name: z.string().describe("Identifier. The repository's name.").optional(),
  npmrcEnvironmentVariablesSecretVersion: z.string().describe(
    "Optional. The name of the Secret Manager secret version to be used to interpolate variables into the.npmrc file for package installation operations. Must be in the format `projects/*/secrets/*/versions/*`. The file itself must be in a JSON format.",
  ).optional(),
  serviceAccount: z.string().describe(
    "Optional. The service account to run workflow invocations under.",
  ).optional(),
  setAuthenticatedUserAdmin: z.boolean().describe(
    "Optional. Input only. If set to true, the authenticated user will be granted the roles/dataform.admin role on the created repository.",
  ).optional(),
  workspaceCompilationOverrides: z.object({
    defaultDatabase: z.string().describe(
      "Optional. The default database (Google Cloud project ID).",
    ).optional(),
    schemaSuffix: z.string().describe(
      "Optional. The suffix that should be appended to all schema (BigQuery dataset ID) names.",
    ).optional(),
    tablePrefix: z.string().describe(
      "Optional. The prefix that should be prepended to all table names.",
    ).optional(),
  }).describe(
    "Optional. If set, fields of `workspace_compilation_overrides` override the default compilation settings that are specified in dataform.json when creating workspace-scoped compilation results. See documentation for `WorkspaceCompilationOverrides` for more information.",
  ).optional(),
  repositoryId: z.string().describe(
    "Required. The ID to use for the repository, which will become the final component of the repository's resource name.",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  containingFolder: z.string().optional(),
  createTime: z.string().optional(),
  dataEncryptionState: z.object({
    kmsKeyVersionName: z.string(),
  }).optional(),
  displayName: z.string().optional(),
  endUserAuthConfig: z.object({
    oauthConfig: z.object({
      additionalOauthScopes: z.array(z.string()),
    }),
  }).optional(),
  gitRemoteSettings: z.object({
    authenticationTokenSecretVersion: z.string(),
    defaultBranch: z.string(),
    effectiveDefaultBranch: z.string(),
    gitRepositoryLink: z.string(),
    sshAuthenticationConfig: z.object({
      hostPublicKey: z.string(),
      userPrivateKeySecretVersion: z.string(),
    }),
    tokenStatus: z.string(),
    url: z.string(),
  }).optional(),
  internalMetadata: z.string().optional(),
  kmsKeyName: z.string().optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  name: z.string(),
  npmrcEnvironmentVariablesSecretVersion: z.string().optional(),
  serviceAccount: z.string().optional(),
  setAuthenticatedUserAdmin: z.boolean().optional(),
  teamFolderName: z.string().optional(),
  workspaceCompilationOverrides: z.object({
    defaultDatabase: z.string(),
    schemaSuffix: z.string(),
    tablePrefix: z.string(),
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  containingFolder: z.string().describe(
    "Optional. The name of the containing folder of the repository. The field is immutable and it can be modified via a MoveRepository operation. Format: `projects/*/locations/*/folders/*`. or `projects/*/locations/*/teamFolders/*`.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. The repository's user-friendly name.",
  ).optional(),
  endUserAuthConfig: z.object({
    oauthConfig: z.object({
      additionalOauthScopes: z.array(z.string()).describe(
        "Optional. Additional OAuth scopes to use for BigQuery executions. Scopes always in use: `https://www.googleapis.com/auth/bigquery`",
      ).optional(),
    }).describe(
      "Optional. OAuth configuration for repository end user authentication.",
    ).optional(),
  }).describe(
    "Optional. Includes configuration options for end user authentication.",
  ).optional(),
  gitRemoteSettings: z.object({
    authenticationTokenSecretVersion: z.string().describe(
      "Optional. The name of the Secret Manager secret version to use as an authentication token for Git operations. Must be in the format `projects/*/secrets/*/versions/*`.",
    ).optional(),
    defaultBranch: z.string().describe(
      "Optional. The Git remote's default branch name. If not set, `main` will be used.",
    ).optional(),
    effectiveDefaultBranch: z.string().describe(
      "Output only. The Git remote's effective default branch name. This is the default branch name of the Git remote if it is set, otherwise it is `main`.",
    ).optional(),
    gitRepositoryLink: z.string().describe(
      "Optional. Resource name for the `GitRepositoryLink` used for machine credentials. Must be in the format `projects/*/locations/*/connections/*/gitRepositoryLinks/*`",
    ).optional(),
    sshAuthenticationConfig: z.object({
      hostPublicKey: z.string().describe(
        "Required. Content of a public SSH key to verify an identity of a remote Git host.",
      ).optional(),
      userPrivateKeySecretVersion: z.string().describe(
        "Required. The name of the Secret Manager secret version to use as a ssh private key for Git operations. Must be in the format `projects/*/secrets/*/versions/*`.",
      ).optional(),
    }).describe(
      "Optional. Authentication fields for remote uris using SSH protocol.",
    ).optional(),
    tokenStatus: z.enum([
      "TOKEN_STATUS_UNSPECIFIED",
      "NOT_FOUND",
      "INVALID",
      "VALID",
    ]).describe(
      "Output only. Deprecated: The field does not contain any token status information.",
    ).optional(),
    url: z.string().describe("Required. The Git remote's URL.").optional(),
  }).describe(
    "Optional. If set, configures this repository to be linked to a Git remote.",
  ).optional(),
  kmsKeyName: z.string().describe(
    "Optional. The reference to a KMS encryption key. If provided, it will be used to encrypt user data in the repository and all child resources. It is not possible to add or update the encryption key after the repository is created. Example: `projects/{kms_project}/locations/{location}/keyRings/{key_location}/cryptoKeys/{key}`",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Repository user labels.",
  ).optional(),
  name: z.string().describe("Identifier. The repository's name.").optional(),
  npmrcEnvironmentVariablesSecretVersion: z.string().describe(
    "Optional. The name of the Secret Manager secret version to be used to interpolate variables into the.npmrc file for package installation operations. Must be in the format `projects/*/secrets/*/versions/*`. The file itself must be in a JSON format.",
  ).optional(),
  serviceAccount: z.string().describe(
    "Optional. The service account to run workflow invocations under.",
  ).optional(),
  setAuthenticatedUserAdmin: z.boolean().describe(
    "Optional. Input only. If set to true, the authenticated user will be granted the roles/dataform.admin role on the created repository.",
  ).optional(),
  workspaceCompilationOverrides: z.object({
    defaultDatabase: z.string().describe(
      "Optional. The default database (Google Cloud project ID).",
    ).optional(),
    schemaSuffix: z.string().describe(
      "Optional. The suffix that should be appended to all schema (BigQuery dataset ID) names.",
    ).optional(),
    tablePrefix: z.string().describe(
      "Optional. The prefix that should be prepended to all table names.",
    ).optional(),
  }).describe(
    "Optional. If set, fields of `workspace_compilation_overrides` override the default compilation settings that are specified in dataform.json when creating workspace-scoped compilation results. See documentation for `WorkspaceCompilationOverrides` for more information.",
  ).optional(),
  repositoryId: z.string().describe(
    "Required. The ID to use for the repository, which will become the final component of the repository's resource name.",
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

/** Swamp extension model for Google Cloud Dataform Repositories. Registered at `@swamp/gcp/dataform/repositories`. */
export const model = {
  type: "@swamp/gcp/dataform/repositories",
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
      toVersion: "2026.04.19.1",
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
      toVersion: "2026.06.04.1",
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
      toVersion: "2026.06.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.26.1",
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
      description: "Removed: dataEncryptionState",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { dataEncryptionState: _dataEncryptionState, ...rest } = old;
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
      toVersion: "2026.09.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.2",
      description:
        "Removed: authenticationTokenSecretVersion, defaultBranch, effectiveDefaultBranch, gitRepositoryLink, sshAuthenticationConfig, hostPublicKey, userPrivateKeySecretVersion, tokenStatus, url, defaultDatabase, schemaSuffix, tablePrefix",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          authenticationTokenSecretVersion: _authenticationTokenSecretVersion,
          defaultBranch: _defaultBranch,
          effectiveDefaultBranch: _effectiveDefaultBranch,
          gitRepositoryLink: _gitRepositoryLink,
          sshAuthenticationConfig: _sshAuthenticationConfig,
          hostPublicKey: _hostPublicKey,
          userPrivateKeySecretVersion: _userPrivateKeySecretVersion,
          tokenStatus: _tokenStatus,
          url: _url,
          defaultDatabase: _defaultDatabase,
          schemaSuffix: _schemaSuffix,
          tablePrefix: _tablePrefix,
          ...rest
        } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.09.11.1",
      description: "Added: endUserAuthConfig",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Represents a Dataform Git repository.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a repositories",
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
        if (g["containingFolder"] !== undefined) {
          body["containingFolder"] = g["containingFolder"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["endUserAuthConfig"] !== undefined) {
          body["endUserAuthConfig"] = g["endUserAuthConfig"];
        }
        if (g["gitRemoteSettings"] !== undefined) {
          body["gitRemoteSettings"] = g["gitRemoteSettings"];
        }
        if (g["kmsKeyName"] !== undefined) body["kmsKeyName"] = g["kmsKeyName"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["npmrcEnvironmentVariablesSecretVersion"] !== undefined) {
          body["npmrcEnvironmentVariablesSecretVersion"] =
            g["npmrcEnvironmentVariablesSecretVersion"];
        }
        if (g["serviceAccount"] !== undefined) {
          body["serviceAccount"] = g["serviceAccount"];
        }
        if (g["setAuthenticatedUserAdmin"] !== undefined) {
          body["setAuthenticatedUserAdmin"] = g["setAuthenticatedUserAdmin"];
        }
        if (g["workspaceCompilationOverrides"] !== undefined) {
          body["workspaceCompilationOverrides"] =
            g["workspaceCompilationOverrides"];
        }
        if (g["repositoryId"] !== undefined) {
          params["repositoryId"] = String(g["repositoryId"]);
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
            matchField: "displayName",
            matchValue: String(g["displayName"] ?? ""),
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
      description: "Get a repositories",
      arguments: z.object({
        identifier: z.string().describe("The name of the repositories"),
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
      description: "Update repositories attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific repositories by name (e.g. one discovered by list)",
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
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["endUserAuthConfig"] !== undefined) {
          body["endUserAuthConfig"] = g["endUserAuthConfig"];
        }
        if (g["gitRemoteSettings"] !== undefined) {
          body["gitRemoteSettings"] = g["gitRemoteSettings"];
        }
        if (g["kmsKeyName"] !== undefined) body["kmsKeyName"] = g["kmsKeyName"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["npmrcEnvironmentVariablesSecretVersion"] !== undefined) {
          body["npmrcEnvironmentVariablesSecretVersion"] =
            g["npmrcEnvironmentVariablesSecretVersion"];
        }
        if (g["serviceAccount"] !== undefined) {
          body["serviceAccount"] = g["serviceAccount"];
        }
        if (g["setAuthenticatedUserAdmin"] !== undefined) {
          body["setAuthenticatedUserAdmin"] = g["setAuthenticatedUserAdmin"];
        }
        if (g["workspaceCompilationOverrides"] !== undefined) {
          body["workspaceCompilationOverrides"] =
            g["workspaceCompilationOverrides"];
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
      description: "Delete the repositories",
      arguments: z.object({
        identifier: z.string().describe("The name of the repositories"),
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
      description: "Sync repositories state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific repositories by name (e.g. one discovered by list)",
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
      description: "List repositories resources",
      arguments: z.object({
        filter: z.string().describe("Optional. Filter for the returned list.")
          .optional(),
        orderBy: z.string().describe(
          "Optional. This field only supports ordering by `name`. If unspecified, the server will choose the ordering. If specified, the default order is ascending for the `name` field.",
        ).optional(),
        pageSize: z.number().describe(
          "Optional. Maximum number of repositories to return. The server may return fewer items than requested. If unspecified, the server will pick an appropriate default.",
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
          "repositories",
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
    commit: {
      description: "commit",
      arguments: z.object({
        commitMetadata: z.any().optional(),
        fileOperations: z.any().optional(),
        requiredHeadCommitSha: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        const body: Record<string, unknown> = {};
        if (args["commitMetadata"] !== undefined) {
          body["commitMetadata"] = args["commitMetadata"];
        }
        if (args["fileOperations"] !== undefined) {
          body["fileOperations"] = args["fileOperations"];
        }
        if (args["requiredHeadCommitSha"] !== undefined) {
          body["requiredHeadCommitSha"] = args["requiredHeadCommitSha"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataform.projects.locations.repositories.commit",
            "path": "v1/{+name}:commit",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
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
    compute_access_token_status: {
      description: "compute access token status",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "dataform.projects.locations.repositories.computeAccessTokenStatus",
            "path": "v1/{+name}:computeAccessTokenStatus",
            "httpMethod": "GET",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
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
    fetch_history: {
      description: "fetch history",
      arguments: z.object({
        pageSize: z.any().optional(),
        pageToken: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["pageToken"] !== undefined) {
          params["pageToken"] = String(args["pageToken"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataform.projects.locations.repositories.fetchHistory",
            "path": "v1/{+name}:fetchHistory",
            "httpMethod": "GET",
            "parameterOrder": ["name"],
            "parameters": {
              "name": { "location": "path", "required": true },
              "pageSize": { "location": "query" },
              "pageToken": { "location": "query" },
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
    fetch_remote_branches: {
      description: "fetch remote branches",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "dataform.projects.locations.repositories.fetchRemoteBranches",
            "path": "v1/{+name}:fetchRemoteBranches",
            "httpMethod": "GET",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
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
            "id": "dataform.projects.locations.repositories.getIamPolicy",
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
    move: {
      description: "move",
      arguments: z.object({
        destinationContainingFolder: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        const body: Record<string, unknown> = {};
        if (args["destinationContainingFolder"] !== undefined) {
          body["destinationContainingFolder"] =
            args["destinationContainingFolder"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataform.projects.locations.repositories.move",
            "path": "v1/{+name}:move",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
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
    query_directory_contents: {
      description: "query directory contents",
      arguments: z.object({
        commitSha: z.any().optional(),
        pageSize: z.any().optional(),
        pageToken: z.any().optional(),
        path: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        if (args["commitSha"] !== undefined) {
          params["commitSha"] = String(args["commitSha"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["pageToken"] !== undefined) {
          params["pageToken"] = String(args["pageToken"]);
        }
        if (args["path"] !== undefined) params["path"] = String(args["path"]);
        const result = await createResource(
          baseUrl,
          {
            "id":
              "dataform.projects.locations.repositories.queryDirectoryContents",
            "path": "v1/{+name}:queryDirectoryContents",
            "httpMethod": "GET",
            "parameterOrder": ["name"],
            "parameters": {
              "commitSha": { "location": "query" },
              "name": { "location": "path", "required": true },
              "pageSize": { "location": "query" },
              "pageToken": { "location": "query" },
              "path": { "location": "query" },
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
    read_file: {
      description: "read file",
      arguments: z.object({
        commitSha: z.any().optional(),
        path: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) {
          params["name"] = buildResourceName(
            `projects/${projectId}/locations/${String(g["location"] ?? "")}`,
            String(g["name"]),
          );
        }
        if (args["commitSha"] !== undefined) {
          params["commitSha"] = String(args["commitSha"]);
        }
        if (args["path"] !== undefined) params["path"] = String(args["path"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "dataform.projects.locations.repositories.readFile",
            "path": "v1/{+name}:readFile",
            "httpMethod": "GET",
            "parameterOrder": ["name"],
            "parameters": {
              "commitSha": { "location": "query" },
              "name": { "location": "path", "required": true },
              "path": { "location": "query" },
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
        policy: z.any().optional(),
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
        const result = await createResource(
          baseUrl,
          {
            "id": "dataform.projects.locations.repositories.setIamPolicy",
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
            "id": "dataform.projects.locations.repositories.testIamPermissions",
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
