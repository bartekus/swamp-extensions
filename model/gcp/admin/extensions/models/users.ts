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

// Auto-generated extension model for @swamp/gcp/admin/users
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Admin SDK Users.
 *
 * The Directory API allows you to create and manage your account's users, user aliases, and user Google profile photos. For more information about common tasks, see the [User Accounts Developer's Guide](https://developers.google.com/workspace/admin/directory/v1/guides/manage-users.html) and the [User Aliases Developer's Guide](https://developers.google.com/workspace/admin/directory/v1/guides/manage-user-aliases.html).
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

const BASE_URL = "https://admin.googleapis.com/";

const GET_CONFIG = {
  "id": "directory.users.get",
  "path": "admin/directory/v1/users/{userKey}",
  "httpMethod": "GET",
  "parameterOrder": [
    "userKey",
  ],
  "parameters": {
    "customFieldMask": {
      "location": "query",
    },
    "projection": {
      "location": "query",
    },
    "userKey": {
      "location": "path",
      "required": true,
    },
    "viewType": {
      "location": "query",
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "directory.users.insert",
  "path": "admin/directory/v1/users",
  "httpMethod": "POST",
  "parameterOrder": [],
  "parameters": {
    "resolveConflictAccount": {
      "location": "query",
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "directory.users.update",
  "path": "admin/directory/v1/users/{userKey}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "userKey",
  ],
  "parameters": {
    "userKey": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "directory.users.delete",
  "path": "admin/directory/v1/users/{userKey}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "userKey",
  ],
  "parameters": {
    "userKey": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "directory.users.list",
  "path": "admin/directory/v1/users",
  "httpMethod": "GET",
  "parameterOrder": [],
  "parameters": {
    "customFieldMask": {
      "location": "query",
    },
    "customer": {
      "location": "query",
    },
    "domain": {
      "location": "query",
    },
    "event": {
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
    "projection": {
      "location": "query",
    },
    "query": {
      "location": "query",
    },
    "showDeleted": {
      "location": "query",
    },
    "sortOrder": {
      "location": "query",
    },
    "viewType": {
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
  addresses: z.string().describe(
    "The list of the user's addresses. The maximum allowed data size for this field is 10KB.",
  ).optional(),
  archived: z.boolean().describe("Indicates if user is archived.").optional(),
  changePasswordAtNextLogin: z.boolean().describe(
    "Indicates if the user is forced to change their password at next login. This setting doesn't apply when [the user signs in via a third-party identity provider](https://support.google.com/a/answer/60224).",
  ).optional(),
  creationTime: z.string().describe(
    "User's G Suite account creation time. (Read-only)",
  ).optional(),
  customSchemas: z.record(z.string(), z.record(z.string(), z.string()))
    .describe(
      "Custom fields of the user. The key is a `schema_name` and its values are `'field_name': 'field_value'`.",
    ).optional(),
  deletionTime: z.string().optional(),
  emails: z.string().describe(
    "The list of the user's email addresses. The maximum allowed data size for this field is 10KB. This excludes `publicKeyEncryptionCertificates`.",
  ).optional(),
  externalIds: z.string().describe(
    "The list of external IDs for the user, such as an employee or network ID. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  gender: z.string().describe(
    "The user's gender. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  guestAccountInfo: z.object({
    primaryGuestEmail: z.string().describe(
      "Immutable. The guest's external email.",
    ).optional(),
  }).describe("Immutable. Additional guest-related metadata fields").optional(),
  hashFunction: z.string().describe(
    "Stores the hash format of the `password` property. The following `hashFunction` values are allowed: * `MD5` - Accepts simple hex-encoded values. * `SHA-1` - Accepts simple hex-encoded values. * `crypt` - Compliant with the [C crypt library](https://en.wikipedia.org/wiki/Crypt_%28C%29). Supports the DES, MD5 (hash prefix `$1$`), SHA-256 (hash prefix `$5$`), and SHA-512 (hash prefix `$6$`) hash algorithms. If rounds are specified as part of the prefix, they must be 10,000 or fewer.",
  ).optional(),
  id: z.string().describe(
    "The unique ID for the user. A user `id` can be used as a user request URI's `userKey`.",
  ).optional(),
  ims: z.string().describe(
    "The list of the user's Instant Messenger (IM) accounts. A user account can have multiple ims properties. But, only one of these ims properties can be the primary IM contact. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  includeInGlobalAddressList: z.boolean().describe(
    "Indicates if the user's profile is visible in the Google Workspace global address list when the contact sharing feature is enabled for the domain. For more information about excluding user profiles, see the [administration help center](https://support.google.com/a/answer/1285988).",
  ).optional(),
  ipWhitelisted: z.boolean().describe(
    "If `true`, the user's IP address is subject to a deprecated IP address [`allowlist`](https://support.google.com/a/answer/60752) configuration.",
  ).optional(),
  isGuestUser: z.boolean().describe(
    "Immutable. Indicates if the inserted user is a guest.",
  ).optional(),
  keywords: z.string().describe(
    "The list of the user's keywords. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  languages: z.string().describe(
    "The user's languages. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  lastLoginTime: z.string().describe("User's last login time. (Read-only)")
    .optional(),
  locations: z.string().describe(
    "The user's locations. The maximum allowed data size for this field is 10KB.",
  ).optional(),
  name: z.object({
    displayName: z.string().describe(
      "The user's display name. Limit: 256 characters.",
    ).optional(),
    familyName: z.string().describe(
      "The user's last name. Required when creating a user account.",
    ).optional(),
    fullName: z.string().describe(
      "The user's full name formed by concatenating the first and last name values.",
    ).optional(),
    givenName: z.string().describe(
      "The user's first name. Required when creating a user account.",
    ).optional(),
  }).describe(
    "Holds the given and family names of the user, and the read-only `fullName` value. The maximum number of characters in the `givenName` and in the `familyName` values is 60. In addition, name values support unicode/UTF-8 characters, and can contain spaces, letters (a-z), numbers (0-9), dashes (-), forward slashes (/), and periods (.). For more information about character usage rules, see the [administration help center](https://support.google.com/a/answer/9193374). Maximum allowed data size for this field is 1KB.",
  ).optional(),
  notes: z.string().describe("Notes for the user.").optional(),
  orgUnitPath: z.string().describe(
    "The full path of the parent organization associated with the user. If the parent organization is the top-level, it is represented as a forward slash (`/`).",
  ).optional(),
  organizations: z.string().describe(
    "The list of organizations the user belongs to. The maximum allowed data size for this field is 10KB.",
  ).optional(),
  password: z.string().describe("User's password"),
  phones: z.string().describe(
    "The list of the user's phone numbers. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  posixAccounts: z.string().describe(
    "The list of [POSIX](https://www.opengroup.org/austin/papers/posix_faq.html) account information for the user.",
  ).optional(),
  primaryEmail: z.string().describe(
    "The user's primary email address. This property is required in a request to create a user account. The `primaryEmail` must be unique and cannot be an alias of another user.",
  ),
  recoveryEmail: z.string().describe("Recovery email of the user.").optional(),
  recoveryPhone: z.string().describe(
    "Recovery phone of the user. The phone number must be in the E.164 format, starting with the plus sign (+). Example: *+16506661212*.",
  ).optional(),
  relations: z.string().describe(
    "The list of the user's relationships to other users. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  sshPublicKeys: z.string().describe("A list of SSH public keys.").optional(),
  suspended: z.boolean().describe("Indicates if user is suspended.").optional(),
  websites: z.string().describe(
    "The user's websites. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  resolveConflictAccount: z.string().describe(
    "Optional. Applies the option selected for [Find and add unmanaged users](https://knowledge.workspace.google.com/admin/users/find-and-add-unmanaged-users) to resolve conflicting accounts when set to `true`. Default: `false`",
  ).optional(),
});

const StateSchema = z.object({
  addresses: z.string().optional(),
  agreedToTerms: z.boolean().optional(),
  aliases: z.array(z.string()).optional(),
  archivalTime: z.string().optional(),
  archived: z.boolean().optional(),
  changePasswordAtNextLogin: z.boolean().optional(),
  creationTime: z.string().optional(),
  customSchemas: z.record(z.string(), z.unknown()).optional(),
  customerId: z.string().optional(),
  deletionTime: z.string().optional(),
  emails: z.string().optional(),
  etag: z.string().optional(),
  externalIds: z.string().optional(),
  gender: z.string().optional(),
  guestAccountInfo: z.object({
    primaryGuestEmail: z.string(),
  }).optional(),
  hashFunction: z.string().optional(),
  id: z.string().optional(),
  ims: z.string().optional(),
  includeInGlobalAddressList: z.boolean().optional(),
  ipWhitelisted: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
  isDelegatedAdmin: z.boolean().optional(),
  isEnforcedIn2Sv: z.boolean().optional(),
  isEnrolledIn2Sv: z.boolean().optional(),
  isGuestUser: z.boolean().optional(),
  isMailboxSetup: z.boolean().optional(),
  keywords: z.string().optional(),
  kind: z.string().optional(),
  languages: z.string().optional(),
  lastLoginTime: z.string().optional(),
  locations: z.string().optional(),
  name: z.object({
    displayName: z.string(),
    familyName: z.string(),
    fullName: z.string(),
    givenName: z.string(),
  }),
  nonEditableAliases: z.array(z.string()).optional(),
  notes: z.string().optional(),
  orgUnitPath: z.string().optional(),
  organizations: z.string().optional(),
  password: z.string().optional(),
  phones: z.string().optional(),
  posixAccounts: z.string().optional(),
  primaryEmail: z.string().optional(),
  recoveryEmail: z.string().optional(),
  recoveryPhone: z.string().optional(),
  relations: z.string().optional(),
  sshPublicKeys: z.string().optional(),
  suspended: z.boolean().optional(),
  suspensionReason: z.string().optional(),
  suspensionTime: z.string().optional(),
  thumbnailPhotoEtag: z.string().optional(),
  thumbnailPhotoUrl: z.string().optional(),
  websites: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  addresses: z.string().describe(
    "The list of the user's addresses. The maximum allowed data size for this field is 10KB.",
  ).optional(),
  archived: z.boolean().describe("Indicates if user is archived.").optional(),
  changePasswordAtNextLogin: z.boolean().describe(
    "Indicates if the user is forced to change their password at next login. This setting doesn't apply when [the user signs in via a third-party identity provider](https://support.google.com/a/answer/60224).",
  ).optional(),
  creationTime: z.string().describe(
    "User's G Suite account creation time. (Read-only)",
  ).optional(),
  customSchemas: z.record(z.string(), z.record(z.string(), z.string()))
    .describe(
      "Custom fields of the user. The key is a `schema_name` and its values are `'field_name': 'field_value'`.",
    ).optional(),
  deletionTime: z.string().optional(),
  emails: z.string().describe(
    "The list of the user's email addresses. The maximum allowed data size for this field is 10KB. This excludes `publicKeyEncryptionCertificates`.",
  ).optional(),
  externalIds: z.string().describe(
    "The list of external IDs for the user, such as an employee or network ID. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  gender: z.string().describe(
    "The user's gender. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  guestAccountInfo: z.object({
    primaryGuestEmail: z.string().describe(
      "Immutable. The guest's external email.",
    ).optional(),
  }).describe("Immutable. Additional guest-related metadata fields").optional(),
  hashFunction: z.string().describe(
    "Stores the hash format of the `password` property. The following `hashFunction` values are allowed: * `MD5` - Accepts simple hex-encoded values. * `SHA-1` - Accepts simple hex-encoded values. * `crypt` - Compliant with the [C crypt library](https://en.wikipedia.org/wiki/Crypt_%28C%29). Supports the DES, MD5 (hash prefix `$1$`), SHA-256 (hash prefix `$5$`), and SHA-512 (hash prefix `$6$`) hash algorithms. If rounds are specified as part of the prefix, they must be 10,000 or fewer.",
  ).optional(),
  id: z.string().describe(
    "The unique ID for the user. A user `id` can be used as a user request URI's `userKey`.",
  ).optional(),
  ims: z.string().describe(
    "The list of the user's Instant Messenger (IM) accounts. A user account can have multiple ims properties. But, only one of these ims properties can be the primary IM contact. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  includeInGlobalAddressList: z.boolean().describe(
    "Indicates if the user's profile is visible in the Google Workspace global address list when the contact sharing feature is enabled for the domain. For more information about excluding user profiles, see the [administration help center](https://support.google.com/a/answer/1285988).",
  ).optional(),
  ipWhitelisted: z.boolean().describe(
    "If `true`, the user's IP address is subject to a deprecated IP address [`allowlist`](https://support.google.com/a/answer/60752) configuration.",
  ).optional(),
  isGuestUser: z.boolean().describe(
    "Immutable. Indicates if the inserted user is a guest.",
  ).optional(),
  keywords: z.string().describe(
    "The list of the user's keywords. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  languages: z.string().describe(
    "The user's languages. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  lastLoginTime: z.string().describe("User's last login time. (Read-only)")
    .optional(),
  locations: z.string().describe(
    "The user's locations. The maximum allowed data size for this field is 10KB.",
  ).optional(),
  name: z.object({
    displayName: z.string().describe(
      "The user's display name. Limit: 256 characters.",
    ).optional(),
    familyName: z.string().describe(
      "The user's last name. Required when creating a user account.",
    ).optional(),
    fullName: z.string().describe(
      "The user's full name formed by concatenating the first and last name values.",
    ).optional(),
    givenName: z.string().describe(
      "The user's first name. Required when creating a user account.",
    ).optional(),
  }).describe(
    "Holds the given and family names of the user, and the read-only `fullName` value. The maximum number of characters in the `givenName` and in the `familyName` values is 60. In addition, name values support unicode/UTF-8 characters, and can contain spaces, letters (a-z), numbers (0-9), dashes (-), forward slashes (/), and periods (.). For more information about character usage rules, see the [administration help center](https://support.google.com/a/answer/9193374). Maximum allowed data size for this field is 1KB.",
  ).optional(),
  notes: z.string().describe("Notes for the user.").optional(),
  orgUnitPath: z.string().describe(
    "The full path of the parent organization associated with the user. If the parent organization is the top-level, it is represented as a forward slash (`/`).",
  ).optional(),
  organizations: z.string().describe(
    "The list of organizations the user belongs to. The maximum allowed data size for this field is 10KB.",
  ).optional(),
  password: z.string().describe("User's password").optional(),
  phones: z.string().describe(
    "The list of the user's phone numbers. The maximum allowed data size for this field is 1KB.",
  ).optional(),
  posixAccounts: z.string().describe(
    "The list of [POSIX](https://www.opengroup.org/austin/papers/posix_faq.html) account information for the user.",
  ).optional(),
  primaryEmail: z.string().describe(
    "The user's primary email address. This property is required in a request to create a user account. The `primaryEmail` must be unique and cannot be an alias of another user.",
  ).optional(),
  recoveryEmail: z.string().describe("Recovery email of the user.").optional(),
  recoveryPhone: z.string().describe(
    "Recovery phone of the user. The phone number must be in the E.164 format, starting with the plus sign (+). Example: *+16506661212*.",
  ).optional(),
  relations: z.string().describe(
    "The list of the user's relationships to other users. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  sshPublicKeys: z.string().describe("A list of SSH public keys.").optional(),
  suspended: z.boolean().describe("Indicates if user is suspended.").optional(),
  websites: z.string().describe(
    "The user's websites. The maximum allowed data size for this field is 2KB.",
  ).optional(),
  resolveConflictAccount: z.string().describe(
    "Optional. Applies the option selected for [Find and add unmanaged users](https://knowledge.workspace.google.com/admin/users/find-and-add-unmanaged-users) to resolve conflicting accounts when set to `true`. Default: `false`",
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

/** Swamp extension model for Google Cloud Admin SDK Users. Registered at `@swamp/gcp/admin/users`. */
export const model = {
  type: "@swamp/gcp/admin/users",
  version: "2026.09.18.1",
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
      toVersion: "2026.09.07.1",
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
        "The Directory API allows you to create and manage your account's users, user ...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a users",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const body: Record<string, unknown> = {};
        if (g["addresses"] !== undefined) body["addresses"] = g["addresses"];
        if (g["archived"] !== undefined) body["archived"] = g["archived"];
        if (g["changePasswordAtNextLogin"] !== undefined) {
          body["changePasswordAtNextLogin"] = g["changePasswordAtNextLogin"];
        }
        if (g["creationTime"] !== undefined) {
          body["creationTime"] = g["creationTime"];
        }
        if (g["customSchemas"] !== undefined) {
          body["customSchemas"] = g["customSchemas"];
        }
        if (g["deletionTime"] !== undefined) {
          body["deletionTime"] = g["deletionTime"];
        }
        if (g["emails"] !== undefined) body["emails"] = g["emails"];
        if (g["externalIds"] !== undefined) {
          body["externalIds"] = g["externalIds"];
        }
        if (g["gender"] !== undefined) body["gender"] = g["gender"];
        if (g["guestAccountInfo"] !== undefined) {
          body["guestAccountInfo"] = g["guestAccountInfo"];
        }
        if (g["hashFunction"] !== undefined) {
          body["hashFunction"] = g["hashFunction"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["ims"] !== undefined) body["ims"] = g["ims"];
        if (g["includeInGlobalAddressList"] !== undefined) {
          body["includeInGlobalAddressList"] = g["includeInGlobalAddressList"];
        }
        if (g["ipWhitelisted"] !== undefined) {
          body["ipWhitelisted"] = g["ipWhitelisted"];
        }
        if (g["isGuestUser"] !== undefined) {
          body["isGuestUser"] = g["isGuestUser"];
        }
        if (g["keywords"] !== undefined) body["keywords"] = g["keywords"];
        if (g["languages"] !== undefined) body["languages"] = g["languages"];
        if (g["lastLoginTime"] !== undefined) {
          body["lastLoginTime"] = g["lastLoginTime"];
        }
        if (g["locations"] !== undefined) body["locations"] = g["locations"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["notes"] !== undefined) body["notes"] = g["notes"];
        if (g["orgUnitPath"] !== undefined) {
          body["orgUnitPath"] = g["orgUnitPath"];
        }
        if (g["organizations"] !== undefined) {
          body["organizations"] = g["organizations"];
        }
        if (g["password"] !== undefined) body["password"] = g["password"];
        if (g["phones"] !== undefined) body["phones"] = g["phones"];
        if (g["posixAccounts"] !== undefined) {
          body["posixAccounts"] = g["posixAccounts"];
        }
        if (g["primaryEmail"] !== undefined) {
          body["primaryEmail"] = g["primaryEmail"];
        }
        if (g["recoveryEmail"] !== undefined) {
          body["recoveryEmail"] = g["recoveryEmail"];
        }
        if (g["recoveryPhone"] !== undefined) {
          body["recoveryPhone"] = g["recoveryPhone"];
        }
        if (g["relations"] !== undefined) body["relations"] = g["relations"];
        if (g["sshPublicKeys"] !== undefined) {
          body["sshPublicKeys"] = g["sshPublicKeys"];
        }
        if (g["suspended"] !== undefined) body["suspended"] = g["suspended"];
        if (g["websites"] !== undefined) body["websites"] = g["websites"];
        if (g["resolveConflictAccount"] !== undefined) {
          params["resolveConflictAccount"] = String(
            g["resolveConflictAccount"],
          );
        }
        if (g["name"] !== undefined) params["userKey"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: {},
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
      description: "Get a users",
      arguments: z.object({
        identifier: z.string().describe("The name of the users"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["userKey"] = args.identifier;
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
      description: "Update users attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific users by name (e.g. one discovered by list)",
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
        params["userKey"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["addresses"] !== undefined) body["addresses"] = g["addresses"];
        if (g["archived"] !== undefined) body["archived"] = g["archived"];
        if (g["changePasswordAtNextLogin"] !== undefined) {
          body["changePasswordAtNextLogin"] = g["changePasswordAtNextLogin"];
        }
        if (g["creationTime"] !== undefined) {
          body["creationTime"] = g["creationTime"];
        }
        if (g["customSchemas"] !== undefined) {
          body["customSchemas"] = g["customSchemas"];
        }
        if (g["deletionTime"] !== undefined) {
          body["deletionTime"] = g["deletionTime"];
        }
        if (g["emails"] !== undefined) body["emails"] = g["emails"];
        if (g["externalIds"] !== undefined) {
          body["externalIds"] = g["externalIds"];
        }
        if (g["gender"] !== undefined) body["gender"] = g["gender"];
        if (g["hashFunction"] !== undefined) {
          body["hashFunction"] = g["hashFunction"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["ims"] !== undefined) body["ims"] = g["ims"];
        if (g["includeInGlobalAddressList"] !== undefined) {
          body["includeInGlobalAddressList"] = g["includeInGlobalAddressList"];
        }
        if (g["ipWhitelisted"] !== undefined) {
          body["ipWhitelisted"] = g["ipWhitelisted"];
        }
        if (g["keywords"] !== undefined) body["keywords"] = g["keywords"];
        if (g["languages"] !== undefined) body["languages"] = g["languages"];
        if (g["lastLoginTime"] !== undefined) {
          body["lastLoginTime"] = g["lastLoginTime"];
        }
        if (g["locations"] !== undefined) body["locations"] = g["locations"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["notes"] !== undefined) body["notes"] = g["notes"];
        if (g["orgUnitPath"] !== undefined) {
          body["orgUnitPath"] = g["orgUnitPath"];
        }
        if (g["organizations"] !== undefined) {
          body["organizations"] = g["organizations"];
        }
        if (g["password"] !== undefined) body["password"] = g["password"];
        if (g["phones"] !== undefined) body["phones"] = g["phones"];
        if (g["posixAccounts"] !== undefined) {
          body["posixAccounts"] = g["posixAccounts"];
        }
        if (g["primaryEmail"] !== undefined) {
          body["primaryEmail"] = g["primaryEmail"];
        }
        if (g["recoveryEmail"] !== undefined) {
          body["recoveryEmail"] = g["recoveryEmail"];
        }
        if (g["recoveryPhone"] !== undefined) {
          body["recoveryPhone"] = g["recoveryPhone"];
        }
        if (g["relations"] !== undefined) body["relations"] = g["relations"];
        if (g["sshPublicKeys"] !== undefined) {
          body["sshPublicKeys"] = g["sshPublicKeys"];
        }
        if (g["suspended"] !== undefined) body["suspended"] = g["suspended"];
        if (g["websites"] !== undefined) body["websites"] = g["websites"];
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
      description: "Delete the users",
      arguments: z.object({
        identifier: z.string().describe("The name of the users"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["userKey"] = args.identifier;
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
      description: "Sync users state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific users by name (e.g. one discovered by list)",
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
          params["userKey"] = identifier;
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
      description: "List users resources",
      arguments: z.object({
        customFieldMask: z.string().describe(
          "A comma-separated list of schema names. All fields from these schemas are fetched. This should only be set when `projection=custom`.",
        ).optional(),
        customer: z.string().describe(
          "The unique ID for the customer's Google Workspace account. In case of a multi-domain account, to fetch all users for a customer, use this field instead of `domain`. You can also use the `my_customer` alias to represent your account's `customerId`. The `customerId` is also returned as part of the [Users](https://developers.google.com/workspace/admin/directory/v1/reference/users) resource. You must provide either the `customer` or the `domain` parameter.",
        ).optional(),
        domain: z.string().describe(
          "The domain name. Use this field to get users from only one domain. To return all domains for a customer account, use the `customer` query parameter instead. Either the `customer` or the `domain` parameter must be provided.",
        ).optional(),
        event: z.string().describe(
          "Event on which subscription is intended (if subscribing)",
        ).optional(),
        maxResults: z.number().describe("Maximum number of results to return.")
          .optional(),
        orderBy: z.string().describe("Property to use for sorting results.")
          .optional(),
        projection: z.string().describe(
          "What subset of fields to fetch for this user.",
        ).optional(),
        query: z.string().describe(
          "Query string for searching user fields. For more information on constructing user queries, see [Search for Users](https://developers.google.com/workspace/admin/directory/v1/guides/search-users).",
        ).optional(),
        showDeleted: z.string().describe(
          "If set to `true`, retrieves the list of deleted users. (Default: `false`)",
        ).optional(),
        sortOrder: z.string().describe(
          "Whether to return results in ascending or descending order, ignoring case.",
        ).optional(),
        viewType: z.string().describe(
          "Whether to fetch the administrator-only or domain-wide public view of the user. For more information, see [Retrieve a user as a non-administrator](https://developers.google.com/workspace/admin/directory/v1/guides/manage-users#retrieve_users_non_admin).",
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
        if (args["customFieldMask"] !== undefined) {
          params["customFieldMask"] = String(args["customFieldMask"]);
        }
        if (args["customer"] !== undefined) {
          params["customer"] = String(args["customer"]);
        }
        if (args["domain"] !== undefined) {
          params["domain"] = String(args["domain"]);
        }
        if (args["event"] !== undefined) {
          params["event"] = String(args["event"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["query"] !== undefined) {
          params["query"] = String(args["query"]);
        }
        if (args["showDeleted"] !== undefined) {
          params["showDeleted"] = String(args["showDeleted"]);
        }
        if (args["sortOrder"] !== undefined) {
          params["sortOrder"] = String(args["sortOrder"]);
        }
        if (args["viewType"] !== undefined) {
          params["viewType"] = String(args["viewType"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "users",
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
    create_guest: {
      description: "create guest",
      arguments: z.object({
        customer: z.any().optional(),
        primaryGuestEmail: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const body: Record<string, unknown> = {};
        if (args["customer"] !== undefined) body["customer"] = args["customer"];
        if (args["primaryGuestEmail"] !== undefined) {
          body["primaryGuestEmail"] = args["primaryGuestEmail"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "directory.users.createGuest",
            "path": "admin/directory/v1/users:createGuest",
            "httpMethod": "POST",
            "parameterOrder": [],
            "parameters": {},
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
    make_admin: {
      description: "make admin",
      arguments: z.object({
        status: z.any().optional(),
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
        params["userKey"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["status"] !== undefined) body["status"] = args["status"];
        const result = await createResource(
          baseUrl,
          {
            "id": "directory.users.makeAdmin",
            "path": "admin/directory/v1/users/{userKey}/makeAdmin",
            "httpMethod": "POST",
            "parameterOrder": ["userKey"],
            "parameters": {
              "userKey": { "location": "path", "required": true },
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
    sign_out: {
      description: "sign out",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
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
        params["userKey"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const result = await createResource(
          baseUrl,
          {
            "id": "directory.users.signOut",
            "path": "admin/directory/v1/users/{userKey}/signOut",
            "httpMethod": "POST",
            "parameterOrder": ["userKey"],
            "parameters": {
              "userKey": { "location": "path", "required": true },
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
    undelete: {
      description: "undelete",
      arguments: z.object({
        orgUnitPath: z.any().optional(),
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
        params["userKey"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["orgUnitPath"] !== undefined) {
          body["orgUnitPath"] = args["orgUnitPath"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "directory.users.undelete",
            "path": "admin/directory/v1/users/{userKey}/undelete",
            "httpMethod": "POST",
            "parameterOrder": ["userKey"],
            "parameters": {
              "userKey": { "location": "path", "required": true },
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
    watch: {
      description: "watch",
      arguments: z.object({
        address: z.any().optional(),
        expiration: z.any().optional(),
        id: z.any().optional(),
        kind: z.any().optional(),
        params: z.any().optional(),
        payload: z.any().optional(),
        resourceId: z.any().optional(),
        resourceUri: z.any().optional(),
        token: z.any().optional(),
        type: z.any().optional(),
        customFieldMask: z.any().optional(),
        customer: z.any().optional(),
        domain: z.any().optional(),
        event: z.any().optional(),
        maxResults: z.any().optional(),
        orderBy: z.any().optional(),
        pageToken: z.any().optional(),
        projection: z.any().optional(),
        query: z.any().optional(),
        showDeleted: z.any().optional(),
        sortOrder: z.any().optional(),
        viewType: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (args["customFieldMask"] !== undefined) {
          params["customFieldMask"] = String(args["customFieldMask"]);
        }
        if (args["customer"] !== undefined) {
          params["customer"] = String(args["customer"]);
        }
        if (args["domain"] !== undefined) {
          params["domain"] = String(args["domain"]);
        }
        if (args["event"] !== undefined) {
          params["event"] = String(args["event"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["pageToken"] !== undefined) {
          params["pageToken"] = String(args["pageToken"]);
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["query"] !== undefined) {
          params["query"] = String(args["query"]);
        }
        if (args["showDeleted"] !== undefined) {
          params["showDeleted"] = String(args["showDeleted"]);
        }
        if (args["sortOrder"] !== undefined) {
          params["sortOrder"] = String(args["sortOrder"]);
        }
        if (args["viewType"] !== undefined) {
          params["viewType"] = String(args["viewType"]);
        }
        const body: Record<string, unknown> = {};
        if (args["address"] !== undefined) body["address"] = args["address"];
        if (args["expiration"] !== undefined) {
          body["expiration"] = args["expiration"];
        }
        if (args["id"] !== undefined) body["id"] = args["id"];
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["params"] !== undefined) body["params"] = args["params"];
        if (args["payload"] !== undefined) body["payload"] = args["payload"];
        if (args["resourceId"] !== undefined) {
          body["resourceId"] = args["resourceId"];
        }
        if (args["resourceUri"] !== undefined) {
          body["resourceUri"] = args["resourceUri"];
        }
        if (args["token"] !== undefined) body["token"] = args["token"];
        if (args["type"] !== undefined) body["type"] = args["type"];
        const result = await createResource(
          baseUrl,
          {
            "id": "directory.users.watch",
            "path": "admin/directory/v1/users/watch",
            "httpMethod": "POST",
            "parameterOrder": [],
            "parameters": {
              "customFieldMask": { "location": "query" },
              "customer": { "location": "query" },
              "domain": { "location": "query" },
              "event": { "location": "query" },
              "maxResults": { "location": "query" },
              "orderBy": { "location": "query" },
              "pageToken": { "location": "query" },
              "projection": { "location": "query" },
              "query": { "location": "query" },
              "showDeleted": { "location": "query" },
              "sortOrder": { "location": "query" },
              "viewType": { "location": "query" },
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
