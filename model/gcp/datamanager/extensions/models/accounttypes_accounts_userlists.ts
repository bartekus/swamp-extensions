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

// Auto-generated extension model for @swamp/gcp/datamanager/accounttypes-accounts-userlists
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Data Manager AccountTypes.Accounts.UserLists.
 *
 * GCP datamanager AccountTypes.Accounts.UserLists resource
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
  return `${parent}/userLists/${shortName}`;
}

const BASE_URL = "https://datamanager.googleapis.com/";

const GET_CONFIG = {
  "id": "datamanager.accountTypes.accounts.userLists.get",
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
  "id": "datamanager.accountTypes.accounts.userLists.create",
  "path": "v1/{+parent}/userLists",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "parent": {
      "location": "path",
      "required": true,
    },
    "validateOnly": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "datamanager.accountTypes.accounts.userLists.patch",
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
    "validateOnly": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "datamanager.accountTypes.accounts.userLists.delete",
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
    "validateOnly": {
      "location": "query",
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "datamanager.accountTypes.accounts.userLists.list",
  "path": "v1/{+parent}/userLists",
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
  },
} as const;

const _defaultOAuthScopes: string[] = [
  "https://www.googleapis.com/auth/datamanager",
  "https://www.googleapis.com/auth/datamanager.partnerlink",
];

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
  accessReason: z.enum([
    "ACCESS_REASON_UNSPECIFIED",
    "OWNED",
    "SHARED",
    "LICENSED",
    "SUBSCRIBED",
    "AFFILIATED",
  ]).optional(),
  accountAccessStatus: z.enum([
    "ACCESS_STATUS_UNSPECIFIED",
    "ENABLED",
    "DISABLED",
  ]).optional(),
  closingReason: z.enum(["CLOSING_REASON_UNSPECIFIED", "UNUSED"]).optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  id: z.string().optional(),
  ingestedUserListInfo: z.object({
    contactIdInfo: z.object({
      dataSourceType: z.enum([
        "DATA_SOURCE_TYPE_UNSPECIFIED",
        "DATA_SOURCE_TYPE_FIRST_PARTY",
        "DATA_SOURCE_TYPE_THIRD_PARTY_CREDIT_BUREAU",
        "DATA_SOURCE_TYPE_THIRD_PARTY_VOTER_FILE",
        "DATA_SOURCE_TYPE_THIRD_PARTY_PARTNER_DATA",
      ]).optional(),
      matchRatePercentage: z.number().int().optional(),
    }).optional(),
    mobileIdInfo: z.object({
      appId: z.string().optional(),
      dataSourceType: z.enum([
        "DATA_SOURCE_TYPE_UNSPECIFIED",
        "DATA_SOURCE_TYPE_FIRST_PARTY",
        "DATA_SOURCE_TYPE_THIRD_PARTY_CREDIT_BUREAU",
        "DATA_SOURCE_TYPE_THIRD_PARTY_VOTER_FILE",
        "DATA_SOURCE_TYPE_THIRD_PARTY_PARTNER_DATA",
      ]).optional(),
      keySpace: z.enum(["KEY_SPACE_UNSPECIFIED", "IOS", "ANDROID"]).optional(),
    }).optional(),
    pairIdInfo: z.object({
      advertiserIdentifierCount: z.string().optional(),
      cleanRoomIdentifier: z.string().optional(),
      matchRatePercentage: z.number().int().optional(),
      publisherId: z.string().optional(),
      publisherName: z.string().optional(),
    }).optional(),
    partnerAudienceInfo: z.object({
      commercePartner: z.string().optional(),
      partnerAudienceSource: z.enum([
        "PARTNER_AUDIENCE_SOURCE_UNSPECIFIED",
        "COMMERCE_AUDIENCE",
        "LINEAR_TV_AUDIENCE",
        "AGENCY_PROVIDER_AUDIENCE",
      ]).optional(),
    }).optional(),
    pseudonymousIdInfo: z.object({
      billableRecordCount: z.string().optional(),
      syncStatus: z.enum([
        "SYNC_STATUS_UNSPECIFIED",
        "CREATED",
        "READY_FOR_USE",
        "FAILED",
      ]).optional(),
    }).optional(),
    uploadKeyTypes: z.array(
      z.enum([
        "UPLOAD_KEY_TYPE_UNSPECIFIED",
        "CONTACT_ID",
        "MOBILE_ID",
        "USER_ID",
        "PAIR_ID",
        "PSEUDONYMOUS_ID",
      ]),
    ).optional(),
    userIdInfo: z.object({
      dataSourceType: z.enum([
        "DATA_SOURCE_TYPE_UNSPECIFIED",
        "DATA_SOURCE_TYPE_FIRST_PARTY",
        "DATA_SOURCE_TYPE_THIRD_PARTY_CREDIT_BUREAU",
        "DATA_SOURCE_TYPE_THIRD_PARTY_VOTER_FILE",
        "DATA_SOURCE_TYPE_THIRD_PARTY_PARTNER_DATA",
      ]).optional(),
    }).optional(),
  }).optional(),
  integrationCode: z.string().optional(),
  membershipDuration: z.string().optional(),
  membershipStatus: z.enum(["MEMBERSHIP_STATUS_UNSPECIFIED", "OPEN", "CLOSED"])
    .optional(),
  name: z.string().optional(),
  readOnly: z.boolean().optional(),
  sizeInfo: z.object({
    displayNetworkMembersCount: z.string().optional(),
    gmailMembersCount: z.string().optional(),
    searchNetworkMembersCount: z.string().optional(),
    youtubeMembersCount: z.string().optional(),
  }).optional(),
  targetNetworkInfo: z.object({
    eligibleForDisplay: z.boolean().optional(),
    eligibleForSearch: z.boolean().optional(),
  }).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  accessReason: z.string().optional(),
  accountAccessStatus: z.string().optional(),
  closingReason: z.string().optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  id: z.string().optional(),
  ingestedUserListInfo: z.object({
    contactIdInfo: z.object({
      dataSourceType: z.string(),
      matchRatePercentage: z.number(),
    }),
    mobileIdInfo: z.object({
      appId: z.string(),
      dataSourceType: z.string(),
      keySpace: z.string(),
    }),
    pairIdInfo: z.object({
      advertiserIdentifierCount: z.string(),
      cleanRoomIdentifier: z.string(),
      matchRatePercentage: z.number(),
      publisherId: z.string(),
      publisherName: z.string(),
    }),
    partnerAudienceInfo: z.object({
      commercePartner: z.string(),
      partnerAudienceSource: z.string(),
    }),
    pseudonymousIdInfo: z.object({
      billableRecordCount: z.string(),
      syncStatus: z.string(),
    }),
    uploadKeyTypes: z.array(z.string()),
    userIdInfo: z.object({
      dataSourceType: z.string(),
    }),
  }).optional(),
  integrationCode: z.string().optional(),
  membershipDuration: z.string().optional(),
  membershipStatus: z.string().optional(),
  name: z.string(),
  readOnly: z.boolean().optional(),
  sizeInfo: z.object({
    displayNetworkMembersCount: z.string(),
    gmailMembersCount: z.string(),
    searchNetworkMembersCount: z.string(),
    youtubeMembersCount: z.string(),
  }).optional(),
  targetNetworkInfo: z.object({
    eligibleForDisplay: z.boolean(),
    eligibleForSearch: z.boolean(),
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
  accessReason: z.enum([
    "ACCESS_REASON_UNSPECIFIED",
    "OWNED",
    "SHARED",
    "LICENSED",
    "SUBSCRIBED",
    "AFFILIATED",
  ]).optional(),
  accountAccessStatus: z.enum([
    "ACCESS_STATUS_UNSPECIFIED",
    "ENABLED",
    "DISABLED",
  ]).optional(),
  closingReason: z.enum(["CLOSING_REASON_UNSPECIFIED", "UNUSED"]).optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  id: z.string().optional(),
  ingestedUserListInfo: z.object({
    contactIdInfo: z.object({
      dataSourceType: z.enum([
        "DATA_SOURCE_TYPE_UNSPECIFIED",
        "DATA_SOURCE_TYPE_FIRST_PARTY",
        "DATA_SOURCE_TYPE_THIRD_PARTY_CREDIT_BUREAU",
        "DATA_SOURCE_TYPE_THIRD_PARTY_VOTER_FILE",
        "DATA_SOURCE_TYPE_THIRD_PARTY_PARTNER_DATA",
      ]).optional(),
      matchRatePercentage: z.number().int().optional(),
    }).optional(),
    mobileIdInfo: z.object({
      appId: z.string().optional(),
      dataSourceType: z.enum([
        "DATA_SOURCE_TYPE_UNSPECIFIED",
        "DATA_SOURCE_TYPE_FIRST_PARTY",
        "DATA_SOURCE_TYPE_THIRD_PARTY_CREDIT_BUREAU",
        "DATA_SOURCE_TYPE_THIRD_PARTY_VOTER_FILE",
        "DATA_SOURCE_TYPE_THIRD_PARTY_PARTNER_DATA",
      ]).optional(),
      keySpace: z.enum(["KEY_SPACE_UNSPECIFIED", "IOS", "ANDROID"]).optional(),
    }).optional(),
    pairIdInfo: z.object({
      advertiserIdentifierCount: z.string().optional(),
      cleanRoomIdentifier: z.string().optional(),
      matchRatePercentage: z.number().int().optional(),
      publisherId: z.string().optional(),
      publisherName: z.string().optional(),
    }).optional(),
    partnerAudienceInfo: z.object({
      commercePartner: z.string().optional(),
      partnerAudienceSource: z.enum([
        "PARTNER_AUDIENCE_SOURCE_UNSPECIFIED",
        "COMMERCE_AUDIENCE",
        "LINEAR_TV_AUDIENCE",
        "AGENCY_PROVIDER_AUDIENCE",
      ]).optional(),
    }).optional(),
    pseudonymousIdInfo: z.object({
      billableRecordCount: z.string().optional(),
      syncStatus: z.enum([
        "SYNC_STATUS_UNSPECIFIED",
        "CREATED",
        "READY_FOR_USE",
        "FAILED",
      ]).optional(),
    }).optional(),
    uploadKeyTypes: z.array(
      z.enum([
        "UPLOAD_KEY_TYPE_UNSPECIFIED",
        "CONTACT_ID",
        "MOBILE_ID",
        "USER_ID",
        "PAIR_ID",
        "PSEUDONYMOUS_ID",
      ]),
    ).optional(),
    userIdInfo: z.object({
      dataSourceType: z.enum([
        "DATA_SOURCE_TYPE_UNSPECIFIED",
        "DATA_SOURCE_TYPE_FIRST_PARTY",
        "DATA_SOURCE_TYPE_THIRD_PARTY_CREDIT_BUREAU",
        "DATA_SOURCE_TYPE_THIRD_PARTY_VOTER_FILE",
        "DATA_SOURCE_TYPE_THIRD_PARTY_PARTNER_DATA",
      ]).optional(),
    }).optional(),
  }).optional(),
  integrationCode: z.string().optional(),
  membershipDuration: z.string().optional(),
  membershipStatus: z.enum(["MEMBERSHIP_STATUS_UNSPECIFIED", "OPEN", "CLOSED"])
    .optional(),
  name: z.string().optional(),
  readOnly: z.boolean().optional(),
  sizeInfo: z.object({
    displayNetworkMembersCount: z.string().optional(),
    gmailMembersCount: z.string().optional(),
    searchNetworkMembersCount: z.string().optional(),
    youtubeMembersCount: z.string().optional(),
  }).optional(),
  targetNetworkInfo: z.object({
    eligibleForDisplay: z.boolean().optional(),
    eligibleForSearch: z.boolean().optional(),
  }).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
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
      : _defaultOAuthScopes,
    quotaProject: g.quotaProject as string | undefined,
  };
}

/** Swamp extension model for Google Cloud Data Manager AccountTypes.Accounts.UserLists. Registered at `@swamp/gcp/datamanager/accounttypes-accounts-userlists`. */
export const model = {
  type: "@swamp/gcp/datamanager/accounttypes-accounts-userlists",
  version: "2026.09.10.1",
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
      toVersion: "2026.05.09.1",
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
      toVersion: "2026.07.10.1",
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
      toVersion: "2026.09.10.1",
      description: "Added: accessReason, closingReason, id, readOnly, sizeInfo",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "GCP datamanager AccountTypes.Accounts.UserLists resource",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a userLists",
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
        if (g["accessReason"] !== undefined) {
          body["accessReason"] = g["accessReason"];
        }
        if (g["accountAccessStatus"] !== undefined) {
          body["accountAccessStatus"] = g["accountAccessStatus"];
        }
        if (g["closingReason"] !== undefined) {
          body["closingReason"] = g["closingReason"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["ingestedUserListInfo"] !== undefined) {
          body["ingestedUserListInfo"] = g["ingestedUserListInfo"];
        }
        if (g["integrationCode"] !== undefined) {
          body["integrationCode"] = g["integrationCode"];
        }
        if (g["membershipDuration"] !== undefined) {
          body["membershipDuration"] = g["membershipDuration"];
        }
        if (g["membershipStatus"] !== undefined) {
          body["membershipStatus"] = g["membershipStatus"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["readOnly"] !== undefined) body["readOnly"] = g["readOnly"];
        if (g["sizeInfo"] !== undefined) body["sizeInfo"] = g["sizeInfo"];
        if (g["targetNetworkInfo"] !== undefined) {
          body["targetNetworkInfo"] = g["targetNetworkInfo"];
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
      description: "Get a userLists",
      arguments: z.object({
        identifier: z.string().describe("The name of the userLists"),
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
      description: "Update userLists attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific userLists by name (e.g. one discovered by list)",
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
        if (g["accessReason"] !== undefined) {
          body["accessReason"] = g["accessReason"];
        }
        if (g["accountAccessStatus"] !== undefined) {
          body["accountAccessStatus"] = g["accountAccessStatus"];
        }
        if (g["closingReason"] !== undefined) {
          body["closingReason"] = g["closingReason"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["ingestedUserListInfo"] !== undefined) {
          body["ingestedUserListInfo"] = g["ingestedUserListInfo"];
        }
        if (g["integrationCode"] !== undefined) {
          body["integrationCode"] = g["integrationCode"];
        }
        if (g["membershipDuration"] !== undefined) {
          body["membershipDuration"] = g["membershipDuration"];
        }
        if (g["membershipStatus"] !== undefined) {
          body["membershipStatus"] = g["membershipStatus"];
        }
        if (g["readOnly"] !== undefined) body["readOnly"] = g["readOnly"];
        if (g["sizeInfo"] !== undefined) body["sizeInfo"] = g["sizeInfo"];
        if (g["targetNetworkInfo"] !== undefined) {
          body["targetNetworkInfo"] = g["targetNetworkInfo"];
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
      description: "Delete the userLists",
      arguments: z.object({
        identifier: z.string().describe("The name of the userLists"),
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
      description: "Sync userLists state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific userLists by name (e.g. one discovered by list)",
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
      description: "List userLists resources",
      arguments: z.object({
        filter: z.string().optional(),
        pageSize: z.number().optional(),
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
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "userLists",
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
