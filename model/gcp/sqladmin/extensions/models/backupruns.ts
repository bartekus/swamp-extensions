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

// Auto-generated extension model for @swamp/gcp/sqladmin/backupruns
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud SQL Admin BackupRuns.
 *
 * A BackupRun resource.
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
} from "./_lib/gcp.ts";

const BASE_URL = "https://sqladmin.googleapis.com/";

const GET_CONFIG = {
  "id": "sql.backupRuns.get",
  "path": "v1/projects/{project}/instances/{instance}/backupRuns/{id}",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "instance",
    "id",
  ],
  "parameters": {
    "id": {
      "location": "path",
      "required": true,
    },
    "instance": {
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
  "id": "sql.backupRuns.insert",
  "path": "v1/projects/{project}/instances/{instance}/backupRuns",
  "httpMethod": "POST",
  "parameterOrder": [
    "project",
    "instance",
  ],
  "parameters": {
    "instance": {
      "location": "path",
      "required": true,
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "sql.backupRuns.delete",
  "path": "v1/projects/{project}/instances/{instance}/backupRuns/{id}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "project",
    "instance",
    "id",
  ],
  "parameters": {
    "id": {
      "location": "path",
      "required": true,
    },
    "instance": {
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
  "id": "sql.backupRuns.list",
  "path": "v1/projects/{project}/instances/{instance}/backupRuns",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "instance",
  ],
  "parameters": {
    "instance": {
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
  backupKind: z.enum(["SQL_BACKUP_KIND_UNSPECIFIED", "SNAPSHOT", "PHYSICAL"])
    .describe("Specifies the kind of backup, PHYSICAL or DEFAULT_SNAPSHOT.")
    .optional(),
  description: z.string().describe(
    "The description of this run, only applicable to on-demand backups.",
  ).optional(),
  diskEncryptionConfiguration: z.object({
    confidentialMode: z.boolean().describe(
      "Optional. If true, enables Confidential Mode for the instance's Hyperdisk Balanced volumes. Only supported for zonal C4A instances currently.",
    ).optional(),
    kind: z.string().describe(
      "This is always `sql#diskEncryptionConfiguration`.",
    ).optional(),
    kmsKeyName: z.string().describe(
      "Resource name of KMS key for disk encryption",
    ).optional(),
  }).describe("Encryption configuration specific to a backup.").optional(),
  diskEncryptionStatus: z.object({
    kind: z.string().describe("This is always `sql#diskEncryptionStatus`.")
      .optional(),
    kmsKeyVersionName: z.string().describe(
      "KMS key version used to encrypt the Cloud SQL instance resource",
    ).optional(),
  }).describe("Encryption status specific to a backup.").optional(),
  endTime: z.string().describe(
    "The time the backup operation completed in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
  ).optional(),
  enqueuedTime: z.string().describe(
    "The time the run was enqueued in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
  ).optional(),
  error: z.object({
    code: z.string().describe("Identifies the specific error that occurred.")
      .optional(),
    kind: z.string().describe("This is always `sql#operationError`.")
      .optional(),
    message: z.string().describe(
      "Additional information about the error encountered.",
    ).optional(),
  }).describe(
    "Information about why the backup operation failed. This is only present if the run has the FAILED status.",
  ).optional(),
  id: z.string().describe(
    "The identifier for this backup run. Unique only for a specific Cloud SQL instance.",
  ).optional(),
  instance: z.string().describe("Name of the database instance.").optional(),
  location: z.string().describe("Location of the backups.").optional(),
  startTime: z.string().describe(
    "The time the backup operation actually started in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
  ).optional(),
  status: z.enum([
    "SQL_BACKUP_RUN_STATUS_UNSPECIFIED",
    "ENQUEUED",
    "OVERDUE",
    "RUNNING",
    "FAILED",
    "SUCCESSFUL",
    "SKIPPED",
    "DELETION_PENDING",
    "DELETION_FAILED",
    "DELETED",
  ]).describe("The status of this run.").optional(),
  timeZone: z.string().describe(
    "Backup time zone to prevent restores to an instance with a different time zone. Now relevant only for SQL Server.",
  ).optional(),
  type: z.enum(["SQL_BACKUP_RUN_TYPE_UNSPECIFIED", "AUTOMATED", "ON_DEMAND"])
    .describe(
      'The type of this run; can be either "AUTOMATED" or "ON_DEMAND" or "FINAL". This field defaults to "ON_DEMAND" and is ignored, when specified for insert requests.',
    ).optional(),
  windowStartTime: z.string().describe(
    "The start time of the backup window during which this the backup was attempted in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
  ).optional(),
});

const StateSchema = z.object({
  backupKind: z.string().optional(),
  databaseVersion: z.string().optional(),
  description: z.string().optional(),
  diskEncryptionConfiguration: z.object({
    confidentialMode: z.boolean(),
    kind: z.string(),
    kmsKeyName: z.string(),
  }).optional(),
  diskEncryptionStatus: z.object({
    kind: z.string(),
    kmsKeyVersionName: z.string(),
  }).optional(),
  endTime: z.string().optional(),
  enqueuedTime: z.string().optional(),
  error: z.object({
    code: z.string(),
    kind: z.string(),
    message: z.string(),
  }).optional(),
  id: z.string(),
  instance: z.string().optional(),
  kind: z.string().optional(),
  location: z.string().optional(),
  maxChargeableBytes: z.string().optional(),
  selfLink: z.string().optional(),
  startTime: z.string().optional(),
  status: z.string().optional(),
  timeZone: z.string().optional(),
  type: z.string().optional(),
  windowStartTime: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  backupKind: z.enum(["SQL_BACKUP_KIND_UNSPECIFIED", "SNAPSHOT", "PHYSICAL"])
    .describe("Specifies the kind of backup, PHYSICAL or DEFAULT_SNAPSHOT.")
    .optional(),
  description: z.string().describe(
    "The description of this run, only applicable to on-demand backups.",
  ).optional(),
  diskEncryptionConfiguration: z.object({
    confidentialMode: z.boolean().describe(
      "Optional. If true, enables Confidential Mode for the instance's Hyperdisk Balanced volumes. Only supported for zonal C4A instances currently.",
    ).optional(),
    kind: z.string().describe(
      "This is always `sql#diskEncryptionConfiguration`.",
    ).optional(),
    kmsKeyName: z.string().describe(
      "Resource name of KMS key for disk encryption",
    ).optional(),
  }).describe("Encryption configuration specific to a backup.").optional(),
  diskEncryptionStatus: z.object({
    kind: z.string().describe("This is always `sql#diskEncryptionStatus`.")
      .optional(),
    kmsKeyVersionName: z.string().describe(
      "KMS key version used to encrypt the Cloud SQL instance resource",
    ).optional(),
  }).describe("Encryption status specific to a backup.").optional(),
  endTime: z.string().describe(
    "The time the backup operation completed in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
  ).optional(),
  enqueuedTime: z.string().describe(
    "The time the run was enqueued in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
  ).optional(),
  error: z.object({
    code: z.string().describe("Identifies the specific error that occurred.")
      .optional(),
    kind: z.string().describe("This is always `sql#operationError`.")
      .optional(),
    message: z.string().describe(
      "Additional information about the error encountered.",
    ).optional(),
  }).describe(
    "Information about why the backup operation failed. This is only present if the run has the FAILED status.",
  ).optional(),
  id: z.string().describe(
    "The identifier for this backup run. Unique only for a specific Cloud SQL instance.",
  ).optional(),
  instance: z.string().describe("Name of the database instance.").optional(),
  location: z.string().describe("Location of the backups.").optional(),
  startTime: z.string().describe(
    "The time the backup operation actually started in UTC timezone in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
  ).optional(),
  status: z.enum([
    "SQL_BACKUP_RUN_STATUS_UNSPECIFIED",
    "ENQUEUED",
    "OVERDUE",
    "RUNNING",
    "FAILED",
    "SUCCESSFUL",
    "SKIPPED",
    "DELETION_PENDING",
    "DELETION_FAILED",
    "DELETED",
  ]).describe("The status of this run.").optional(),
  timeZone: z.string().describe(
    "Backup time zone to prevent restores to an instance with a different time zone. Now relevant only for SQL Server.",
  ).optional(),
  type: z.enum(["SQL_BACKUP_RUN_TYPE_UNSPECIFIED", "AUTOMATED", "ON_DEMAND"])
    .describe(
      'The type of this run; can be either "AUTOMATED" or "ON_DEMAND" or "FINAL". This field defaults to "ON_DEMAND" and is ignored, when specified for insert requests.',
    ).optional(),
  windowStartTime: z.string().describe(
    "The start time of the backup window during which this the backup was attempted in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
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

/** Swamp extension model for Google Cloud SQL Admin BackupRuns. Registered at `@swamp/gcp/sqladmin/backupruns`. */
export const model = {
  type: "@swamp/gcp/sqladmin/backupruns",
  version: "2026.09.18.1",
  upgrades: [
    {
      toVersion: "2026.04.01.2",
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
      toVersion: "2026.08.29.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
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
      description: "A BackupRun resource.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a backupRuns",
      arguments: z.object({
        waitForReady: z.boolean().describe(
          "Wait for the resource to reach a ready state after creation (default: true)",
        ).optional(),
      }),
      execute: async (args: { waitForReady?: boolean }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["instance"] !== undefined) {
          params["instance"] = String(g["instance"]);
        }
        const body: Record<string, unknown> = {};
        if (g["backupKind"] !== undefined) body["backupKind"] = g["backupKind"];
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["diskEncryptionConfiguration"] !== undefined) {
          body["diskEncryptionConfiguration"] =
            g["diskEncryptionConfiguration"];
        }
        if (g["diskEncryptionStatus"] !== undefined) {
          body["diskEncryptionStatus"] = g["diskEncryptionStatus"];
        }
        if (g["endTime"] !== undefined) body["endTime"] = g["endTime"];
        if (g["enqueuedTime"] !== undefined) {
          body["enqueuedTime"] = g["enqueuedTime"];
        }
        if (g["error"] !== undefined) body["error"] = g["error"];
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["location"] !== undefined) body["location"] = g["location"];
        if (g["startTime"] !== undefined) body["startTime"] = g["startTime"];
        if (g["status"] !== undefined) body["status"] = g["status"];
        if (g["timeZone"] !== undefined) body["timeZone"] = g["timeZone"];
        if (g["type"] !== undefined) body["type"] = g["type"];
        if (g["windowStartTime"] !== undefined) {
          body["windowStartTime"] = g["windowStartTime"];
        }
        if (g["id"] !== undefined) params["id"] = String(g["id"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          (args.waitForReady ?? true)
            ? {
              "statusField": "status",
              "readyValues": ["RUNNING"],
              "failedValues": ["FAILED"],
            }
            : undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: {
              "project": projectId,
              "instance": String(g["instance"] ?? ""),
            },
            matchField: "id",
            matchValue: String(g["id"] ?? ""),
          },
          credentials,
        ) as StateData;
        const instanceName = ((g.id ?? result.id)?.toString() ?? "current")
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
      description: "Get a backupRuns",
      arguments: z.object({
        identifier: z.string().describe("The id of the backupRuns"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["instance"] !== undefined) {
          params["instance"] = String(g["instance"]);
        }
        params["id"] = args.identifier;
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName =
          ((g.id ?? result.id)?.toString() ?? args.identifier).replace(
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
    delete: {
      description: "Delete the backupRuns",
      arguments: z.object({
        identifier: z.string().describe("The id of the backupRuns"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["instance"] !== undefined) {
          params["instance"] = String(g["instance"]);
        }
        params["id"] = args.identifier;
        const { existed } = await deleteResource(
          baseUrl,
          DELETE_CONFIG,
          params,
          credentials,
        );
        const instanceName = (g.id?.toString() ?? args.identifier).replace(
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
      description: "Sync backupRuns state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific backupRuns by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const instanceName = (g.id?.toString() ?? args.identifier ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
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
          if (g["instance"] !== undefined) {
            params["instance"] = String(g["instance"]);
          } else if (existing["instance"]) {
            params["instance"] = String(existing["instance"]);
          }
          const identifier = existing.id?.toString() ?? g["id"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["id"] = identifier;
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
      description: "List backupRuns resources",
      arguments: z.object({
        maxResults: z.number().describe(
          "Maximum number of backup runs per response.",
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
        if (g["instance"] !== undefined) {
          params["instance"] = String(g["instance"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "items",
          (args.maxPages as number | undefined) ?? 10,
          credentials,
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as StateData;
          const instanceName = (item.id?.toString() ?? String(i)).replace(
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
