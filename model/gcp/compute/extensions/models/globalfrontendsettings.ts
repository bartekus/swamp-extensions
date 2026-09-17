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

// Auto-generated extension model for @swamp/gcp/compute/globalfrontendsettings
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Compute Engine GlobalFrontendSettings.
 *
 * Represents the Global Frontend Bundle settings for a single project.
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  readResource,
  updateResource,
} from "./_lib/gcp.ts";

const BASE_URL = "https://compute.googleapis.com/compute/v1/";

const GET_CONFIG = {
  "id": "compute.globalFrontendSettings.get",
  "path": "projects/{project}/global/globalFrontendSettings",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
  ],
  "parameters": {
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "compute.globalFrontendSettings.patch",
  "path": "projects/{project}/global/globalFrontendSettings",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "project",
  ],
  "parameters": {
    "project": {
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
  bundleType: z.enum([
    "BUNDLE_TYPE_UNSPECIFIED",
    "GLOBAL_FRONT_END",
    "INDIVIDUAL",
  ]).describe("Customer-settable bundle type.").optional(),
  creationTimestamp: z.string().describe(
    "Output only. [Output Only] Creation timestamp in RFC3339 text format.",
  ).optional(),
  description: z.string().describe(
    "Output only. [Output Only] An optional description of this resource.",
  ).optional(),
  etag: z.string().describe("Output only. For optimistic locking.").optional(),
  id: z.string().describe(
    "Output only. [Output Only] The unique identifier for the resource. This identifier is defined by the server.",
  ).optional(),
  name: z.string().describe(
    "Output only. OUTPUT_ONLY fields [Output Only] Name of the resource. Must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
  ).optional(),
  selfLink: z.string().describe(
    "Output only. [Output Only] Server-defined URL for the resource.",
  ).optional(),
  requestId: z.string().describe("An optional request ID to identify requests.")
    .optional(),
});

const StateSchema = z.object({
  bundleType: z.string().optional(),
  creationTimestamp: z.string().optional(),
  description: z.string().optional(),
  etag: z.string().optional(),
  id: z.string().optional(),
  name: z.string(),
  selfLink: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  bundleType: z.enum([
    "BUNDLE_TYPE_UNSPECIFIED",
    "GLOBAL_FRONT_END",
    "INDIVIDUAL",
  ]).describe("Customer-settable bundle type.").optional(),
  creationTimestamp: z.string().describe(
    "Output only. [Output Only] Creation timestamp in RFC3339 text format.",
  ).optional(),
  description: z.string().describe(
    "Output only. [Output Only] An optional description of this resource.",
  ).optional(),
  etag: z.string().describe("Output only. For optimistic locking.").optional(),
  id: z.string().describe(
    "Output only. [Output Only] The unique identifier for the resource. This identifier is defined by the server.",
  ).optional(),
  name: z.string().describe(
    "Output only. OUTPUT_ONLY fields [Output Only] Name of the resource. Must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?` which means the first character must be a lowercase letter, and all following characters must be a dash, lowercase letter, or digit, except the last character, which cannot be a dash.",
  ).optional(),
  selfLink: z.string().describe(
    "Output only. [Output Only] Server-defined URL for the resource.",
  ).optional(),
  requestId: z.string().describe("An optional request ID to identify requests.")
    .optional(),
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

/** Swamp extension model for Google Cloud Compute Engine GlobalFrontendSettings. Registered at `@swamp/gcp/compute/globalfrontendsettings`. */
export const model = {
  type: "@swamp/gcp/compute/globalfrontendsettings",
  version: "2026.09.17.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "Represents the Global Frontend Bundle settings for a single project.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    get: {
      description: "Get a globalFrontendSettings",
      arguments: z.object({
        identifier: z.string().describe(
          "The name of the globalFrontendSettings",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
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
      description: "Update globalFrontendSettings attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific globalFrontendSettings by name (e.g. one discovered by list)",
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
        const params: Record<string, string> = { project: projectId };
        const body: Record<string, unknown> = {};
        if (g["bundleType"] !== undefined) body["bundleType"] = g["bundleType"];
        if (g["creationTimestamp"] !== undefined) {
          body["creationTimestamp"] = g["creationTimestamp"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["etag"] !== undefined) body["etag"] = g["etag"];
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["selfLink"] !== undefined) body["selfLink"] = g["selfLink"];
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
        const updateMaskKeys = Object.keys(body);
        if (updateMaskKeys.length > 0) {
          params["updateMask"] = updateMaskKeys.join(",");
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
    sync: {
      description: "Sync globalFrontendSettings state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific globalFrontendSettings by name (e.g. one discovered by list)",
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
        try {
          const params: Record<string, string> = { project: projectId };
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
  },
};
