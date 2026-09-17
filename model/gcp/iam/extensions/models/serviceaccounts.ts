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

// Auto-generated extension model for @swamp/gcp/iam/serviceaccounts
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Identity and Access Management (IAM) ServiceAccounts.
 *
 * An IAM service account. A service account is an account for an application or a virtual machine (VM) instance, not a person. You can use a service account to call Google APIs. To learn more, read the [overview of service accounts](https://cloud.google.com/iam/help/service-accounts/overview). When you create a service account, you specify the project ID that owns the service account, as well as a name that must be unique within the project. IAM uses these values to create an email address that identifies the service account. //
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
  request,
  updateResource,
} from "./_lib/gcp.ts";

const BASE_URL = "https://iam.googleapis.com/";

const GET_CONFIG = {
  "id": "iam.projects.serviceAccounts.get",
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
  "id": "iam.projects.serviceAccounts.create",
  "path": "v1/{+name}/serviceAccounts",
  "httpMethod": "POST",
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

const UPDATE_CONFIG = {
  "id": "iam.projects.serviceAccounts.update",
  "path": "v1/{+name}",
  "httpMethod": "PUT",
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

const DELETE_CONFIG = {
  "id": "iam.projects.serviceAccounts.delete",
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
  "id": "iam.projects.serviceAccounts.list",
  "path": "v1/{+name}/serviceAccounts",
  "httpMethod": "GET",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "name": {
      "location": "path",
      "required": true,
    },
    "pageSize": {
      "location": "query",
    },
    "pageToken": {
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
  accountId: z.string().describe(
    "Required. The account id that is used to generate the service account email address and a stable unique id. It is unique within a project, must be 6-30 characters long, and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])` to comply with RFC1035.",
  ).optional(),
  serviceAccount: z.object({
    description: z.string().describe(
      "Optional. A user-specified, human-readable description of the service account. The maximum length is 256 UTF-8 bytes.",
    ).optional(),
    disabled: z.boolean().describe(
      "Output only. Whether the service account is disabled.",
    ).optional(),
    displayName: z.string().describe(
      "Optional. A user-specified, human-readable name for the service account. The maximum length is 100 UTF-8 bytes.",
    ).optional(),
    email: z.string().describe(
      "Output only. The email address of the service account.",
    ).optional(),
    etag: z.string().describe("Deprecated. Do not use.").optional(),
    name: z.string().describe(
      "The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID}/serviceAccounts/{EMAIL_ADDRESS}` * `projects/{PROJECT_ID}/serviceAccounts/{UNIQUE_ID}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS}` * `projects/-/serviceAccounts/{UNIQUE_ID}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.",
    ).optional(),
    oauth2ClientId: z.string().describe(
      "Output only. The OAuth 2.0 client ID for the service account.",
    ).optional(),
    projectId: z.string().describe(
      "Output only. The ID of the project that owns the service account.",
    ).optional(),
    uniqueId: z.string().describe(
      "Output only. The unique, stable numeric ID for the service account. Each service account retains its unique ID even if you delete the service account. For example, if you delete a service account, then create a new service account with the same name, the new service account has a different unique ID than the deleted service account.",
    ).optional(),
  }).describe(
    "An IAM service account. A service account is an account for an application or a virtual machine (VM) instance, not a person. You can use a service account to call Google APIs. To learn more, read the [overview of service accounts](https://cloud.google.com/iam/help/service-accounts/overview). When you create a service account, you specify the project ID that owns the service account, as well as a name that must be unique within the project. IAM uses these values to create an email address that identifies the service account. //",
  ).optional(),
  description: z.string().describe(
    "Optional. A user-specified, human-readable description of the service account. The maximum length is 256 UTF-8 bytes.",
  ).optional(),
  disabled: z.boolean().describe(
    "Output only. Whether the service account is disabled.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. A user-specified, human-readable name for the service account. The maximum length is 100 UTF-8 bytes.",
  ).optional(),
  email: z.string().describe(
    "Output only. The email address of the service account.",
  ).optional(),
  name: z.string().describe(
    "The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID}/serviceAccounts/{EMAIL_ADDRESS}` * `projects/{PROJECT_ID}/serviceAccounts/{UNIQUE_ID}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS}` * `projects/-/serviceAccounts/{UNIQUE_ID}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.",
  ).optional(),
  oauth2ClientId: z.string().describe(
    "Output only. The OAuth 2.0 client ID for the service account.",
  ).optional(),
  projectId: z.string().describe(
    "Output only. The ID of the project that owns the service account.",
  ).optional(),
  uniqueId: z.string().describe(
    "Output only. The unique, stable numeric ID for the service account. Each service account retains its unique ID even if you delete the service account. For example, if you delete a service account, then create a new service account with the same name, the new service account has a different unique ID than the deleted service account.",
  ).optional(),
  updateMask: z.string().optional(),
});

const iamBindingMethods = {
  add_iam_binding: {
    description:
      "add an IAM binding to the service account (read-modify-write with etag)",
    arguments: z.object({
      role: z.string().describe(
        "IAM role to grant, e.g. roles/iam.workloadIdentityUser",
      ),
      members: z.array(z.string()).describe(
        "Members to bind, e.g. ['principalSet://iam.googleapis.com/projects/123/locations/global/workloadIdentityPools/my-pool/attribute.repository/my-org/my-repo']",
      ),
      condition: z.object({
        title: z.string(),
        description: z.string().optional(),
        expression: z.string(),
      }).optional().describe("Optional IAM condition for conditional bindings"),
    }),
    execute: async (
      args: Record<string, unknown>,
      context: { globalArgs: Record<string, unknown> },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const resource = g["name"]?.toString() ?? "";

      const getResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:getIamPolicy`,
        { options: { requestedPolicyVersion: 3 } },
        credentials,
      );
      if (!getResp.ok) {
        const body = await getResp.text();
        throw new Error(`Failed to get IAM policy: ${getResp.status} ${body}`);
      }
      const policy = await getResp.json() as {
        bindings?: Array<{
          role: string;
          members: string[];
          condition?: {
            title: string;
            description?: string;
            expression: string;
          };
        }>;
        etag: string;
        version?: number;
      };

      const role = args["role"] as string;
      const members = args["members"] as string[];
      const condition = args["condition"] as
        | { title: string; description?: string; expression: string }
        | undefined;

      const bindings = policy.bindings ?? [];
      const existing = bindings.find((b) => {
        if (b.role !== role) return false;
        if (condition && b.condition) {
          return b.condition.title === condition.title &&
            b.condition.expression === condition.expression;
        }
        return !condition && !b.condition;
      });

      if (existing) {
        const memberSet = new Set(existing.members);
        for (const m of members) memberSet.add(m);
        existing.members = [...memberSet];
      } else {
        const newBinding: {
          role: string;
          members: string[];
          condition?: {
            title: string;
            description?: string;
            expression: string;
          };
        } = { role, members: [...new Set(members)] };
        if (condition) newBinding.condition = condition;
        bindings.push(newBinding);
      }

      const setResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:setIamPolicy`,
        {
          policy: {
            bindings,
            etag: policy.etag,
            version: 3,
          },
        },
        credentials,
      );
      if (!setResp.ok) {
        const body = await setResp.text();
        throw new Error(`Failed to set IAM policy: ${setResp.status} ${body}`);
      }
      const result = await setResp.json();
      return { result };
    },
  },
  remove_iam_binding: {
    description:
      "remove an IAM binding or specific members from a service account (read-modify-write with etag)",
    arguments: z.object({
      role: z.string().describe(
        "IAM role to revoke, e.g. roles/iam.workloadIdentityUser",
      ),
      members: z.array(z.string()).optional().describe(
        "Specific members to remove. If omitted, removes the entire binding for this role.",
      ),
      condition: z.object({
        title: z.string(),
        description: z.string().optional(),
        expression: z.string(),
      }).optional().describe(
        "Match condition when removing a conditional binding",
      ),
    }),
    execute: async (
      args: Record<string, unknown>,
      context: { globalArgs: Record<string, unknown> },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const resource = g["name"]?.toString() ?? "";

      const getResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:getIamPolicy`,
        { options: { requestedPolicyVersion: 3 } },
        credentials,
      );
      if (!getResp.ok) {
        const body = await getResp.text();
        throw new Error(`Failed to get IAM policy: ${getResp.status} ${body}`);
      }
      const policy = await getResp.json() as {
        bindings?: Array<{
          role: string;
          members: string[];
          condition?: {
            title: string;
            description?: string;
            expression: string;
          };
        }>;
        etag: string;
        version?: number;
      };

      const role = args["role"] as string;
      const members = args["members"] as string[] | undefined;
      const condition = args["condition"] as
        | { title: string; description?: string; expression: string }
        | undefined;

      let bindings = policy.bindings ?? [];
      const idx = bindings.findIndex((b) => {
        if (b.role !== role) return false;
        if (condition && b.condition) {
          return b.condition.title === condition.title &&
            b.condition.expression === condition.expression;
        }
        return !condition && !b.condition;
      });

      if (idx === -1) {
        return { result: { bindings, message: "No matching binding found" } };
      }

      if (members) {
        const removeSet = new Set(members);
        bindings[idx].members = bindings[idx].members.filter((m) =>
          !removeSet.has(m)
        );
        if (bindings[idx].members.length === 0) {
          bindings = bindings.filter((_, i) => i !== idx);
        }
      } else {
        bindings = bindings.filter((_, i) => i !== idx);
      }

      const setResp = await request(
        "POST",
        `${baseUrl}v1/${resource}:setIamPolicy`,
        {
          policy: {
            bindings,
            etag: policy.etag,
            version: 3,
          },
        },
        credentials,
      );
      if (!setResp.ok) {
        const body = await setResp.text();
        throw new Error(`Failed to set IAM policy: ${setResp.status} ${body}`);
      }
      const result = await setResp.json();
      return { result };
    },
  },
  manage_account: {
    description:
      "create or adopt a service account by deterministic email, returning state with immutable uniqueId — no key creation or IAM grants",
    arguments: z.object({}),
    execute: async (
      _args: Record<string, never>,
      context: {
        globalArgs: Record<string, unknown>;
        writeResource: (
          type: string,
          name: string,
          data: unknown,
        ) => Promise<unknown>;
      },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const projectId = await getProjectId(credentials);

      const accountId = g["accountId"]?.toString();
      if (!accountId) {
        throw new Error(
          "accountId is required: 6-30 character identifier used to derive the service account email",
        );
      }

      const email = `${accountId}@${projectId}.iam.gserviceaccount.com`;
      const resourceName = `projects/${projectId}/serviceAccounts/${email}`;

      const getResp = await request(
        "GET",
        `${baseUrl}v1/${resourceName}`,
        undefined,
        credentials,
      );

      let result: Record<string, unknown>;

      if (getResp.ok) {
        result = await getResp.json();
      } else if (getResp.status === 404) {
        await getResp.text();

        const createBody: Record<string, unknown> = { accountId };
        const sa: Record<string, unknown> = {};
        if (g["displayName"] !== undefined) {
          sa["displayName"] = g["displayName"];
        }
        if (g["description"] !== undefined) {
          sa["description"] = g["description"];
        }
        if (Object.keys(sa).length > 0) {
          createBody["serviceAccount"] = sa;
        }

        const createResp = await request(
          "POST",
          `${baseUrl}v1/projects/${projectId}/serviceAccounts`,
          createBody,
          credentials,
        );

        if (createResp.status === 409) {
          await createResp.text();
          const reReadResp = await request(
            "GET",
            `${baseUrl}v1/${resourceName}`,
            undefined,
            credentials,
          );
          if (!reReadResp.ok) {
            const body = await reReadResp.text();
            throw new Error(
              `Re-read after 409 failed (${reReadResp.status}): ${body}`,
            );
          }
          result = await reReadResp.json();
        } else if (!createResp.ok) {
          const body = await createResp.text();
          throw new Error(`Create failed (${createResp.status}): ${body}`);
        } else {
          result = await createResp.json();
        }
      } else if (getResp.status === 403) {
        let body: string;
        try {
          body = await getResp.text();
        } catch {
          body = "(could not read response body)";
        }
        throw new Error(
          `Permission denied reading service account ${email} (403): ${body}. ` +
            "This is NOT a 'not found' — check IAM permissions on the project.",
        );
      } else {
        const body = await getResp.text();
        throw new Error(
          `Unexpected error reading service account ${email} (${getResp.status}): ${body}`,
        );
      }

      const instanceName = resourceName
        .replace(/[\/\\]/g, "_")
        .replace(/\.\./g, "_")
        .replace(/\0/g, "");
      const handle = await context.writeResource(
        "state",
        instanceName,
        result,
      );
      return { dataHandles: [handle] };
    },
  },
};

const StateSchema = z.object({
  description: z.string().optional(),
  disabled: z.boolean().optional(),
  displayName: z.string().optional(),
  email: z.string().optional(),
  etag: z.string().optional(),
  name: z.string(),
  oauth2ClientId: z.string().optional(),
  projectId: z.string().optional(),
  uniqueId: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  accountId: z.string().describe(
    "Required. The account id that is used to generate the service account email address and a stable unique id. It is unique within a project, must be 6-30 characters long, and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])` to comply with RFC1035.",
  ).optional(),
  serviceAccount: z.object({
    description: z.string().describe(
      "Optional. A user-specified, human-readable description of the service account. The maximum length is 256 UTF-8 bytes.",
    ).optional(),
    disabled: z.boolean().describe(
      "Output only. Whether the service account is disabled.",
    ).optional(),
    displayName: z.string().describe(
      "Optional. A user-specified, human-readable name for the service account. The maximum length is 100 UTF-8 bytes.",
    ).optional(),
    email: z.string().describe(
      "Output only. The email address of the service account.",
    ).optional(),
    etag: z.string().describe("Deprecated. Do not use.").optional(),
    name: z.string().describe(
      "The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID}/serviceAccounts/{EMAIL_ADDRESS}` * `projects/{PROJECT_ID}/serviceAccounts/{UNIQUE_ID}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS}` * `projects/-/serviceAccounts/{UNIQUE_ID}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.",
    ).optional(),
    oauth2ClientId: z.string().describe(
      "Output only. The OAuth 2.0 client ID for the service account.",
    ).optional(),
    projectId: z.string().describe(
      "Output only. The ID of the project that owns the service account.",
    ).optional(),
    uniqueId: z.string().describe(
      "Output only. The unique, stable numeric ID for the service account. Each service account retains its unique ID even if you delete the service account. For example, if you delete a service account, then create a new service account with the same name, the new service account has a different unique ID than the deleted service account.",
    ).optional(),
  }).describe(
    "An IAM service account. A service account is an account for an application or a virtual machine (VM) instance, not a person. You can use a service account to call Google APIs. To learn more, read the [overview of service accounts](https://cloud.google.com/iam/help/service-accounts/overview). When you create a service account, you specify the project ID that owns the service account, as well as a name that must be unique within the project. IAM uses these values to create an email address that identifies the service account. //",
  ).optional(),
  description: z.string().describe(
    "Optional. A user-specified, human-readable description of the service account. The maximum length is 256 UTF-8 bytes.",
  ).optional(),
  disabled: z.boolean().describe(
    "Output only. Whether the service account is disabled.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. A user-specified, human-readable name for the service account. The maximum length is 100 UTF-8 bytes.",
  ).optional(),
  email: z.string().describe(
    "Output only. The email address of the service account.",
  ).optional(),
  name: z.string().describe(
    "The resource name of the service account. Use one of the following formats: * `projects/{PROJECT_ID}/serviceAccounts/{EMAIL_ADDRESS}` * `projects/{PROJECT_ID}/serviceAccounts/{UNIQUE_ID}` As an alternative, you can use the `-` wildcard character instead of the project ID: * `projects/-/serviceAccounts/{EMAIL_ADDRESS}` * `projects/-/serviceAccounts/{UNIQUE_ID}` When possible, avoid using the `-` wildcard character, because it can cause response messages to contain misleading error codes. For example, if you try to access the service account `projects/-/serviceAccounts/fake@example.com`, which does not exist, the response contains an HTTP `403 Forbidden` error instead of a `404 Not Found` error.",
  ).optional(),
  oauth2ClientId: z.string().describe(
    "Output only. The OAuth 2.0 client ID for the service account.",
  ).optional(),
  projectId: z.string().describe(
    "Output only. The ID of the project that owns the service account.",
  ).optional(),
  uniqueId: z.string().describe(
    "Output only. The unique, stable numeric ID for the service account. Each service account retains its unique ID even if you delete the service account. For example, if you delete a service account, then create a new service account with the same name, the new service account has a different unique ID than the deleted service account.",
  ).optional(),
  updateMask: z.string().optional(),
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

/** Swamp extension model for Google Cloud Identity and Access Management (IAM) ServiceAccounts. Registered at `@swamp/gcp/iam/serviceaccounts`. */
export const model = {
  type: "@swamp/gcp/iam/serviceaccounts",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.07.28.1",
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
      toVersion: "2026.08.12.3",
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
      description: "Removed: etag",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { etag: _etag, ...rest } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "An IAM service account. A service account is an account for an application or...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a serviceAccounts",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const body: Record<string, unknown> = {};
        if (g["accountId"] !== undefined) body["accountId"] = g["accountId"];
        if (g["serviceAccount"] !== undefined) {
          body["serviceAccount"] = g["serviceAccount"];
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
            listParams: { "name": String(g["name"] ?? "") },
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
      description: "Get a serviceAccounts",
      arguments: z.object({
        identifier: z.string().describe("The name of the serviceAccounts"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = args.identifier;
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
      description: "Update serviceAccounts attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific serviceAccounts by name (e.g. one discovered by list)",
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
        params["name"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["serviceAccount"] !== undefined) {
          body["serviceAccount"] = g["serviceAccount"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["disabled"] !== undefined) body["disabled"] = g["disabled"];
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["email"] !== undefined) body["email"] = g["email"];
        if (g["oauth2ClientId"] !== undefined) {
          body["oauth2ClientId"] = g["oauth2ClientId"];
        }
        if (g["projectId"] !== undefined) body["projectId"] = g["projectId"];
        if (g["uniqueId"] !== undefined) body["uniqueId"] = g["uniqueId"];
        if (g["updateMask"] !== undefined) body["updateMask"] = g["updateMask"];
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
      description: "Delete the serviceAccounts",
      arguments: z.object({
        identifier: z.string().describe("The name of the serviceAccounts"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["name"] = args.identifier;
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
      description: "Sync serviceAccounts state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific serviceAccounts by name (e.g. one discovered by list)",
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
          params["name"] = identifier;
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
      description: "List serviceAccounts resources",
      arguments: z.object({
        pageSize: z.number().describe(
          "Optional limit on the number of service accounts to include in the response. Further accounts can subsequently be obtained by including the ListServiceAccountsResponse.next_page_token in a subsequent request. The default is 20, and the maximum is 100.",
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
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "accounts",
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
    disable: {
      description: "disable",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "iam.projects.serviceAccounts.disable",
            "path": "v1/{+name}:disable",
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
    enable: {
      description: "enable",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "iam.projects.serviceAccounts.enable",
            "path": "v1/{+name}:enable",
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
            "id": "iam.projects.serviceAccounts.getIamPolicy",
            "path": "v1/{+resource}:getIamPolicy",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "options.requestedPolicyVersion": { "location": "query" },
              "resource": { "location": "path", "required": true },
            },
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
            "id": "iam.projects.serviceAccounts.setIamPolicy",
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
    sign_blob: {
      description: "sign blob",
      arguments: z.object({
        bytesToSign: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const body: Record<string, unknown> = {};
        if (args["bytesToSign"] !== undefined) {
          body["bytesToSign"] = args["bytesToSign"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "iam.projects.serviceAccounts.signBlob",
            "path": "v1/{+name}:signBlob",
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
    sign_jwt: {
      description: "sign jwt",
      arguments: z.object({
        payload: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const body: Record<string, unknown> = {};
        if (args["payload"] !== undefined) body["payload"] = args["payload"];
        const result = await createResource(
          baseUrl,
          {
            "id": "iam.projects.serviceAccounts.signJwt",
            "path": "v1/{+name}:signJwt",
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
            "id": "iam.projects.serviceAccounts.testIamPermissions",
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
    undelete: {
      description: "undelete",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "iam.projects.serviceAccounts.undelete",
            "path": "v1/{+name}:undelete",
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
    ...iamBindingMethods,
  },
};
