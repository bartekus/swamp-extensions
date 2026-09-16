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

// Auto-generated extension model for @swamp/gcp/auditmanager/auditschedules
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Audit Manager AuditSchedules.
 *
 * An audit schedule, in one of the following formats: * `projects/{project}/locations/{location}/auditSchedules/{audit_schedule}` * `folders/{folder}/locations/{location}/auditSchedules/{audit_schedule}`
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/gcp.ts";

/** Construct the fully-qualified resource name from parent and short name. */
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/auditSchedules/${shortName}`;
}

const BASE_URL = "https://auditmanager.googleapis.com/";

const GET_CONFIG = {
  "id": "auditmanager.folders.locations.auditSchedules.get",
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
  "id": "auditmanager.folders.locations.auditSchedules.create",
  "path": "v1/{+parent}/auditSchedules",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "auditScheduleId": {
      "location": "query",
    },
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
  "id": "auditmanager.folders.locations.auditSchedules.patch",
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

const LIST_CONFIG = {
  "id": "auditmanager.folders.locations.auditSchedules.list",
  "path": "v1/{+parent}/auditSchedules",
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
  complianceFramework: z.string().describe(
    "Required. Framework (set of controls) that the audit scope report is generated against. For example, `NIST_800_53`.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. Display name for the audit schedule.",
  ).optional(),
  gcsUri: z.string().describe(
    "Required. Cloud Storage bucket where Audit Manager can upload the audit report and evidence. The format is `gs://{bucket_name}`.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Unique identifier for the audit schedule. Format: projects/{project}/locations/{location}/auditSchedules/{audit_schedule} folders/{folder}/locations/{location}/auditSchedules/{audit_schedule} organizations/{organization}/locations/{location}/auditSchedules/{audit_schedule}",
  ).optional(),
  reportFormat: z.enum([
    "AUDIT_REPORT_FORMAT_UNSPECIFIED",
    "AUDIT_REPORT_FORMAT_ODF",
  ]).describe("Required. Format for the audit report.").optional(),
  scheduleConfig: z.object({
    endTime: z.string().describe(
      "Optional. Date that the schedule stops. If not specified, the schedule runs indefinitely.",
    ).optional(),
    frequency: z.enum([
      "FREQUENCY_UNSPECIFIED",
      "DAILY",
      "WEEKLY",
      "MONTHLY",
      "QUARTERLY",
      "ANNUALLY",
    ]).describe("Required. Frequency of audit runs.").optional(),
    startTime: z.string().describe(
      "Required. Date and time when the first audit run is triggered. Subsequent runs are based on this time and the chosen frequency.",
    ).optional(),
    timeZone: z.string().describe(
      "Optional. Time zone for the audit schedule in IANA format (for example, `America/New_York`). The time zone is used to interpret the `start_time` and the `end_time`, and to calculate subsequent run dates. If not specified, the time zone default is UTC.",
    ).optional(),
  }).describe(
    "Required. Configuration that defines when and how often audit runs are automatically triggered for this schedule.",
  ).optional(),
  state: z.enum([
    "SCHEDULE_STATE_UNSPECIFIED",
    "SCHEDULE_STATE_ACTIVE",
    "SCHEDULE_STATE_PAUSED",
    "SCHEDULE_STATE_COMPLETED",
    "SCHEDULE_STATE_FAILED_SETUP",
    "SCHEDULE_STATE_ERROR",
    "SCHEDULE_STATE_DELETED",
  ]).describe(
    "Optional. State of the audit schedule. While most states are managed by the system, you can use UpdateAuditSchedule to start, pause, or delete the schedule.",
  ).optional(),
  auditScheduleId: z.string().describe(
    "Required. ID to use for the audit schedule, which becomes the final component of the audit schedule's resource name.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  complianceFramework: z.string().optional(),
  createTime: z.string().optional(),
  displayName: z.string().optional(),
  errorMessage: z.string().optional(),
  gcsUri: z.string().optional(),
  lastTriggerTime: z.string().optional(),
  name: z.string(),
  nextRunTime: z.string().optional(),
  reportFormat: z.string().optional(),
  scheduleConfig: z.object({
    endTime: z.string(),
    frequency: z.string(),
    startTime: z.string(),
    timeZone: z.string(),
  }).optional(),
  state: z.string().optional(),
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
  complianceFramework: z.string().describe(
    "Required. Framework (set of controls) that the audit scope report is generated against. For example, `NIST_800_53`.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. Display name for the audit schedule.",
  ).optional(),
  gcsUri: z.string().describe(
    "Required. Cloud Storage bucket where Audit Manager can upload the audit report and evidence. The format is `gs://{bucket_name}`.",
  ).optional(),
  name: z.string().describe(
    "Identifier. Unique identifier for the audit schedule. Format: projects/{project}/locations/{location}/auditSchedules/{audit_schedule} folders/{folder}/locations/{location}/auditSchedules/{audit_schedule} organizations/{organization}/locations/{location}/auditSchedules/{audit_schedule}",
  ).optional(),
  reportFormat: z.enum([
    "AUDIT_REPORT_FORMAT_UNSPECIFIED",
    "AUDIT_REPORT_FORMAT_ODF",
  ]).describe("Required. Format for the audit report.").optional(),
  scheduleConfig: z.object({
    endTime: z.string().describe(
      "Optional. Date that the schedule stops. If not specified, the schedule runs indefinitely.",
    ).optional(),
    frequency: z.enum([
      "FREQUENCY_UNSPECIFIED",
      "DAILY",
      "WEEKLY",
      "MONTHLY",
      "QUARTERLY",
      "ANNUALLY",
    ]).describe("Required. Frequency of audit runs.").optional(),
    startTime: z.string().describe(
      "Required. Date and time when the first audit run is triggered. Subsequent runs are based on this time and the chosen frequency.",
    ).optional(),
    timeZone: z.string().describe(
      "Optional. Time zone for the audit schedule in IANA format (for example, `America/New_York`). The time zone is used to interpret the `start_time` and the `end_time`, and to calculate subsequent run dates. If not specified, the time zone default is UTC.",
    ).optional(),
  }).describe(
    "Required. Configuration that defines when and how often audit runs are automatically triggered for this schedule.",
  ).optional(),
  state: z.enum([
    "SCHEDULE_STATE_UNSPECIFIED",
    "SCHEDULE_STATE_ACTIVE",
    "SCHEDULE_STATE_PAUSED",
    "SCHEDULE_STATE_COMPLETED",
    "SCHEDULE_STATE_FAILED_SETUP",
    "SCHEDULE_STATE_ERROR",
    "SCHEDULE_STATE_DELETED",
  ]).describe(
    "Optional. State of the audit schedule. While most states are managed by the system, you can use UpdateAuditSchedule to start, pause, or delete the schedule.",
  ).optional(),
  auditScheduleId: z.string().describe(
    "Required. ID to use for the audit schedule, which becomes the final component of the audit schedule's resource name.",
  ).optional(),
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
      : undefined,
    quotaProject: g.quotaProject as string | undefined,
  };
}

/** Swamp extension model for Google Cloud Audit Manager AuditSchedules. Registered at `@swamp/gcp/auditmanager/auditschedules`. */
export const model = {
  type: "@swamp/gcp/auditmanager/auditschedules",
  version: "2026.09.16.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "An audit schedule, in one of the following formats: * `projects/{project}/loc...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a auditSchedules",
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
        if (g["complianceFramework"] !== undefined) {
          body["complianceFramework"] = g["complianceFramework"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["gcsUri"] !== undefined) body["gcsUri"] = g["gcsUri"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["reportFormat"] !== undefined) {
          body["reportFormat"] = g["reportFormat"];
        }
        if (g["scheduleConfig"] !== undefined) {
          body["scheduleConfig"] = g["scheduleConfig"];
        }
        if (g["state"] !== undefined) body["state"] = g["state"];
        if (g["auditScheduleId"] !== undefined) {
          params["auditScheduleId"] = String(g["auditScheduleId"]);
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
      description: "Get a auditSchedules",
      arguments: z.object({
        identifier: z.string().describe("The name of the auditSchedules"),
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
      description: "Update auditSchedules attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific auditSchedules by name (e.g. one discovered by list)",
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
        if (g["complianceFramework"] !== undefined) {
          body["complianceFramework"] = g["complianceFramework"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["gcsUri"] !== undefined) body["gcsUri"] = g["gcsUri"];
        if (g["reportFormat"] !== undefined) {
          body["reportFormat"] = g["reportFormat"];
        }
        if (g["scheduleConfig"] !== undefined) {
          body["scheduleConfig"] = g["scheduleConfig"];
        }
        if (g["state"] !== undefined) body["state"] = g["state"];
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
    sync: {
      description: "Sync auditSchedules state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific auditSchedules by name (e.g. one discovered by list)",
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
      description: "List auditSchedules resources",
      arguments: z.object({
        pageSize: z.number().describe(
          "Optional. Maximum number of items to return in a single page. The service might return fewer items than this value. If unspecified, the service picks an appropriate default. The maximum value is 100; values above 100 are reduced to 100.",
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
          "auditSchedules",
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
