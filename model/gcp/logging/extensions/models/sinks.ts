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

// Auto-generated extension model for @swamp/gcp/logging/sinks
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Logging Sinks.
 *
 * Describes a sink used to export log entries to one of the following destinations: a Cloud Logging log bucket, a Cloud Storage bucket, a BigQuery dataset, a Pub/Sub topic, a Cloud project.A logs filter controls which log entries are exported. The sink must be created within a project, organization, billing account, or folder.
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

const BASE_URL = "https://logging.googleapis.com/";

const GET_CONFIG = {
  "id": "logging.billingAccounts.sinks.get",
  "path": "v2/{+sinkName}",
  "httpMethod": "GET",
  "parameterOrder": [
    "sinkName",
  ],
  "parameters": {
    "sinkName": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "logging.billingAccounts.sinks.create",
  "path": "v2/{+parent}/sinks",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "customWriterIdentity": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
    "uniqueWriterIdentity": {
      "location": "query",
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "logging.billingAccounts.sinks.update",
  "path": "v2/{+sinkName}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "sinkName",
  ],
  "parameters": {
    "customWriterIdentity": {
      "location": "query",
    },
    "sinkName": {
      "location": "path",
      "required": true,
    },
    "uniqueWriterIdentity": {
      "location": "query",
    },
    "updateMask": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "logging.billingAccounts.sinks.delete",
  "path": "v2/{+sinkName}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "sinkName",
  ],
  "parameters": {
    "sinkName": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "logging.billingAccounts.sinks.list",
  "path": "v2/{+parent}/sinks",
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
  bigqueryOptions: z.object({
    usePartitionedTables: z.boolean().describe(
      "Optional. Whether to use BigQuery's partition tables (https://docs.cloud.google.com/bigquery/docs/partitioned-tables). By default, Cloud Logging creates dated tables based on the log entries' timestamps, e.g. syslog_20170523. With partitioned tables the date suffix is no longer present and special query syntax (https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables) has to be used instead. In both cases, tables are sharded based on UTC timezone.",
    ).optional(),
    usesTimestampColumnPartitioning: z.boolean().describe(
      "Output only. True if new timestamp column based partitioning is in use, false if legacy ingress-time partitioning is in use.All new sinks will have this field set true and will use timestamp column based partitioning. If use_partitioned_tables is false, this value has no meaning and will be false. Legacy sinks using partitioned tables will have this field set to false.",
    ).optional(),
  }).describe("Optional. Options that affect sinks exporting data to BigQuery.")
    .optional(),
  description: z.string().describe(
    "Optional. A description of this sink.The maximum length of the description is 8000 characters.",
  ).optional(),
  destination: z.string().describe(
    'Required. The export destination: "storage.googleapis.com/[GCS_BUCKET]" "bigquery.googleapis.com/projects/[PROJECT_ID]/datasets/[DATASET]" "pubsub.googleapis.com/projects/[PROJECT_ID]/topics/[TOPIC_ID]" "logging.googleapis.com/projects/[PROJECT_ID]" "logging.googleapis.com/projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" The sink\'s writer_identity, set when the sink is created, must have permission to write to the destination or else the log entries are not exported. For more information, see Route logs to supported destinations (https://docs.cloud.google.com/logging/docs/export/configure_export_v2).',
  ).optional(),
  disabled: z.boolean().describe(
    "Optional. If set to true, then this sink is disabled and it does not export any log entries.",
  ).optional(),
  exclusions: z.array(z.object({
    createTime: z.string().describe(
      "Output only. The creation timestamp of the exclusion.This field may not be present for older exclusions.",
    ).optional(),
    description: z.string().describe(
      "Optional. A description of this exclusion.",
    ).optional(),
    disabled: z.boolean().describe(
      "Optional. If set to True, then this exclusion is disabled and it does not exclude any log entries. You can update an exclusion to change the value of this field.",
    ).optional(),
    filter: z.string().describe(
      "Required. An advanced logs filter (https://docs.cloud.google.com/logging/docs/view/building-queries#queries-by-expression) that matches the log entries to be excluded. By using the sample function (https://docs.cloud.google.com/logging/docs/view/logging-query-language#sample), you can exclude less than 100% of the matching log entries.For example, the following query matches 99% of low-severity log entries from Google Cloud Storage buckets:resource.type=gcs_bucket severity<ERROR sample(insertId, 0.99)",
    ).optional(),
    name: z.string().describe(
      'Optional. A client-assigned identifier, such as "load-balancer-exclusion". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. First character has to be alphanumeric.',
    ).optional(),
    updateTime: z.string().describe(
      "Output only. The last update timestamp of the exclusion.This field may not be present for older exclusions.",
    ).optional(),
  })).describe(
    "Optional. Log entries that match any of these exclusion filters will not be exported.If a log entry is matched by both filter and one of exclusions it will not be exported.",
  ).optional(),
  filter: z.string().describe(
    'Optional. An advanced logs filter (https://docs.cloud.google.com/logging/docs/view/building-queries#queries-by-expression). The only exported log entries are those that are in the resource owning the sink and that match the filter.For example:logName="projects/[PROJECT_ID]/logs/[LOG_ID]" AND severity>=ERROR',
  ).optional(),
  includeChildren: z.boolean().describe(
    "Optional. This field applies only to sinks owned by organizations and folders. If the field is false, the default, only the logs owned by the sink's parent resource are available for export. If the field is true, then log entries from all the projects, folders, and billing accounts contained in the sink's parent resource are also available for export. Whether a particular log entry from the children is exported depends on the sink's filter expression.For example, if this field is true, then the filter resource.type=gce_instance would export all Compute Engine VM instance log entries from all projects in the sink's parent.To only export entries from certain child projects, filter on the project part of the log name:logName:(\"projects/test-project1/\" OR \"projects/test-project2/\") AND resource.type=gce_instance",
  ).optional(),
  interceptChildren: z.boolean().describe(
    "Optional. This field applies only to sinks owned by organizations and folders.When the value of 'intercept_children' is true, the following restrictions apply: The sink must have the include_children flag set to true. The sink destination must be a Cloud project.Also, the following behaviors apply: Any logs matched by the sink won't be included by non-_Required sinks owned by child resources. The sink appears in the results of a ListSinks call from a child resource if the value of the filter field in its request is either 'in_scope(\"ALL\")' or 'in_scope(\"ANCESTOR\")'.",
  ).optional(),
  name: z.string().describe(
    'Optional. The client-assigned sink identifier, unique within the project.For example: "my-syslog-errors-to-pubsub".Sink identifiers are limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, periods.First character has to be alphanumeric.',
  ).optional(),
  customWriterIdentity: z.string().describe(
    "Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.",
  ).optional(),
  uniqueWriterIdentity: z.string().describe(
    "Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is the same group or service account used by Cloud Logging before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a service agent (https://docs.cloud.google.com/iam/docs/service-account-types#service-agents) used by the sinks with the same parent. For more information, see writer_identity in LogSink.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const loggingSinkMethods = {
  ensure_audit_sink: {
    description:
      "convergent audit-log sink setup targeting an existing ACTIVE Logging bucket — creates, adopts, or updates by sink ID with typed writerIdentity and destination verification",
    arguments: z.object({
      sinkId: z.string().describe(
        "Unique sink identifier within the parent",
      ),
      parent: z.string().describe(
        "Resource parent, e.g. organizations/{orgId}, folders/{folderId}, projects/{projectId}",
      ).optional(),
      destination: z.string().describe(
        "Logging bucket destination, e.g. logging.googleapis.com/projects/my-project/locations/global/buckets/my-bucket",
      ),
      filter: z.string().describe(
        "Log filter expression (empty string means all logs)",
      ).optional(),
      includeChildren: z.boolean().describe(
        "Whether to include logs from child resources (default true)",
      ).optional(),
      exclusions: z.array(z.object({
        name: z.string().describe("Unique exclusion name"),
        filter: z.string().describe("Log exclusion filter expression"),
        description: z.string().describe("Human-readable description")
          .optional(),
      })).describe("Log exclusions to apply").optional(),
    }),
    execute: async (
      args: Record<string, unknown>,
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

      const sinkId = args.sinkId as string;
      const parent = (args.parent as string | undefined) ??
        g["name"]?.toString() ?? `projects/${projectId}`;
      const destination = args.destination as string;
      const filter = (args.filter as string | undefined) ?? "";
      const includeChildren = (args.includeChildren as boolean | undefined) ??
        true;
      const exclusions = (args.exclusions as
        | Array<{ name: string; filter: string; description?: string }>
        | undefined) ?? [];

      const bucketPrefix = "logging.googleapis.com/";
      const bucketIdx = destination.indexOf(bucketPrefix);
      if (bucketIdx === -1) {
        throw new Error(
          `Invalid destination: must start with '${bucketPrefix}', got '${destination}'`,
        );
      }
      const bucketPath = destination.slice(bucketIdx + bucketPrefix.length);

      const bucketResp = await request(
        "GET",
        `${baseUrl}v2/${bucketPath}`,
        undefined,
        credentials,
      );
      if (!bucketResp.ok) {
        const body = await bucketResp.text();
        throw new Error(
          `Destination bucket ${bucketPath} not found or inaccessible (${bucketResp.status}): ${body}`,
        );
      }
      const bucket = await bucketResp.json() as {
        lifecycleState?: string;
      };
      if (bucket.lifecycleState && bucket.lifecycleState !== "ACTIVE") {
        throw new Error(
          `Destination bucket ${bucketPath} is not ACTIVE (state: ${bucket.lifecycleState}). ` +
            "Only ACTIVE buckets can be used as sink destinations.",
        );
      }

      const sinkResp = await request(
        "GET",
        `${baseUrl}v2/${parent}/sinks/${sinkId}`,
        undefined,
        credentials,
      );

      const sinkBody: Record<string, unknown> = {
        name: sinkId,
        destination,
        filter,
        includeChildren,
      };
      if (exclusions.length > 0) {
        sinkBody.exclusions = exclusions;
      }

      let resultSink: Record<string, unknown>;

      if (sinkResp.ok) {
        const existing = await sinkResp.json() as Record<string, unknown>;

        const needsUpdate = existing.destination !== destination ||
          (existing.filter ?? "") !== filter ||
          existing.includeChildren !== includeChildren ||
          JSON.stringify(
              [...(existing.exclusions as Array<Record<string, unknown>> ?? [])]
                .sort(
                  (a, b) =>
                    String(a.name ?? "").localeCompare(String(b.name ?? "")),
                ),
            ) !==
            JSON.stringify(
              [...exclusions].sort(
                (a, b) =>
                  String(a.name ?? "").localeCompare(String(b.name ?? "")),
              ),
            );

        if (needsUpdate) {
          const updateResp = await request(
            "PUT",
            `${baseUrl}v2/${parent}/sinks/${sinkId}?uniqueWriterIdentity=true`,
            sinkBody,
            credentials,
          );
          if (!updateResp.ok) {
            const body = await updateResp.text();
            throw new Error(
              `Failed to update sink ${sinkId} (${updateResp.status}): ${body}`,
            );
          }
          resultSink = await updateResp.json() as Record<string, unknown>;
        } else {
          resultSink = existing;
        }
      } else if (sinkResp.status === 404) {
        await sinkResp.text();
        const createResp = await request(
          "POST",
          `${baseUrl}v2/${parent}/sinks?uniqueWriterIdentity=true`,
          sinkBody,
          credentials,
        );
        if (!createResp.ok) {
          const body = await createResp.text();
          throw new Error(
            `Failed to create sink ${sinkId} (${createResp.status}): ${body}`,
          );
        }
        resultSink = await createResp.json() as Record<string, unknown>;
      } else if (sinkResp.status === 403) {
        let body: string;
        try {
          body = await sinkResp.text();
        } catch {
          body = "(could not read response body)";
        }
        throw new Error(
          `Permission denied reading sink ${sinkId} under ${parent} (403): ${body}`,
        );
      } else {
        const body = await sinkResp.text();
        throw new Error(
          `Unexpected error reading sink ${sinkId} (${sinkResp.status}): ${body}`,
        );
      }

      const instanceName = `${parent}_sinks_${sinkId}`.replace(/[\/\\]/g, "_")
        .replace(
          /\.\./g,
          "_",
        ).replace(/\0/g, "");
      const handle = await context.writeResource("state", instanceName, {
        name: resultSink.name,
        destination: resultSink.destination,
        filter: resultSink.filter,
        includeChildren: resultSink.includeChildren,
        exclusions: resultSink.exclusions,
        writerIdentity: resultSink.writerIdentity,
        createTime: resultSink.createTime,
        updateTime: resultSink.updateTime,
      });
      return { dataHandles: [handle] };
    },
  },
};

const StateSchema = z.object({
  bigqueryOptions: z.object({
    usePartitionedTables: z.boolean(),
    usesTimestampColumnPartitioning: z.boolean(),
  }).optional(),
  createTime: z.string().optional(),
  description: z.string().optional(),
  destination: z.string().optional(),
  disabled: z.boolean().optional(),
  exclusions: z.array(z.object({
    createTime: z.string(),
    description: z.string(),
    disabled: z.boolean(),
    filter: z.string(),
    name: z.string(),
    updateTime: z.string(),
  })).optional(),
  filter: z.string().optional(),
  includeChildren: z.boolean().optional(),
  interceptChildren: z.boolean().optional(),
  name: z.string(),
  outputVersionFormat: z.string().optional(),
  resourceName: z.string().optional(),
  updateTime: z.string().optional(),
  writerIdentity: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  bigqueryOptions: z.object({
    usePartitionedTables: z.boolean().describe(
      "Optional. Whether to use BigQuery's partition tables (https://docs.cloud.google.com/bigquery/docs/partitioned-tables). By default, Cloud Logging creates dated tables based on the log entries' timestamps, e.g. syslog_20170523. With partitioned tables the date suffix is no longer present and special query syntax (https://docs.cloud.google.com/bigquery/docs/querying-partitioned-tables) has to be used instead. In both cases, tables are sharded based on UTC timezone.",
    ).optional(),
    usesTimestampColumnPartitioning: z.boolean().describe(
      "Output only. True if new timestamp column based partitioning is in use, false if legacy ingress-time partitioning is in use.All new sinks will have this field set true and will use timestamp column based partitioning. If use_partitioned_tables is false, this value has no meaning and will be false. Legacy sinks using partitioned tables will have this field set to false.",
    ).optional(),
  }).describe("Optional. Options that affect sinks exporting data to BigQuery.")
    .optional(),
  description: z.string().describe(
    "Optional. A description of this sink.The maximum length of the description is 8000 characters.",
  ).optional(),
  destination: z.string().describe(
    'Required. The export destination: "storage.googleapis.com/[GCS_BUCKET]" "bigquery.googleapis.com/projects/[PROJECT_ID]/datasets/[DATASET]" "pubsub.googleapis.com/projects/[PROJECT_ID]/topics/[TOPIC_ID]" "logging.googleapis.com/projects/[PROJECT_ID]" "logging.googleapis.com/projects/[PROJECT_ID]/locations/[LOCATION_ID]/buckets/[BUCKET_ID]" The sink\'s writer_identity, set when the sink is created, must have permission to write to the destination or else the log entries are not exported. For more information, see Route logs to supported destinations (https://docs.cloud.google.com/logging/docs/export/configure_export_v2).',
  ).optional(),
  disabled: z.boolean().describe(
    "Optional. If set to true, then this sink is disabled and it does not export any log entries.",
  ).optional(),
  exclusions: z.array(z.object({
    createTime: z.string().describe(
      "Output only. The creation timestamp of the exclusion.This field may not be present for older exclusions.",
    ).optional(),
    description: z.string().describe(
      "Optional. A description of this exclusion.",
    ).optional(),
    disabled: z.boolean().describe(
      "Optional. If set to True, then this exclusion is disabled and it does not exclude any log entries. You can update an exclusion to change the value of this field.",
    ).optional(),
    filter: z.string().describe(
      "Required. An advanced logs filter (https://docs.cloud.google.com/logging/docs/view/building-queries#queries-by-expression) that matches the log entries to be excluded. By using the sample function (https://docs.cloud.google.com/logging/docs/view/logging-query-language#sample), you can exclude less than 100% of the matching log entries.For example, the following query matches 99% of low-severity log entries from Google Cloud Storage buckets:resource.type=gcs_bucket severity<ERROR sample(insertId, 0.99)",
    ).optional(),
    name: z.string().describe(
      'Optional. A client-assigned identifier, such as "load-balancer-exclusion". Identifiers are limited to 100 characters and can include only letters, digits, underscores, hyphens, and periods. First character has to be alphanumeric.',
    ).optional(),
    updateTime: z.string().describe(
      "Output only. The last update timestamp of the exclusion.This field may not be present for older exclusions.",
    ).optional(),
  })).describe(
    "Optional. Log entries that match any of these exclusion filters will not be exported.If a log entry is matched by both filter and one of exclusions it will not be exported.",
  ).optional(),
  filter: z.string().describe(
    'Optional. An advanced logs filter (https://docs.cloud.google.com/logging/docs/view/building-queries#queries-by-expression). The only exported log entries are those that are in the resource owning the sink and that match the filter.For example:logName="projects/[PROJECT_ID]/logs/[LOG_ID]" AND severity>=ERROR',
  ).optional(),
  includeChildren: z.boolean().describe(
    "Optional. This field applies only to sinks owned by organizations and folders. If the field is false, the default, only the logs owned by the sink's parent resource are available for export. If the field is true, then log entries from all the projects, folders, and billing accounts contained in the sink's parent resource are also available for export. Whether a particular log entry from the children is exported depends on the sink's filter expression.For example, if this field is true, then the filter resource.type=gce_instance would export all Compute Engine VM instance log entries from all projects in the sink's parent.To only export entries from certain child projects, filter on the project part of the log name:logName:(\"projects/test-project1/\" OR \"projects/test-project2/\") AND resource.type=gce_instance",
  ).optional(),
  interceptChildren: z.boolean().describe(
    "Optional. This field applies only to sinks owned by organizations and folders.When the value of 'intercept_children' is true, the following restrictions apply: The sink must have the include_children flag set to true. The sink destination must be a Cloud project.Also, the following behaviors apply: Any logs matched by the sink won't be included by non-_Required sinks owned by child resources. The sink appears in the results of a ListSinks call from a child resource if the value of the filter field in its request is either 'in_scope(\"ALL\")' or 'in_scope(\"ANCESTOR\")'.",
  ).optional(),
  name: z.string().describe(
    'Optional. The client-assigned sink identifier, unique within the project.For example: "my-syslog-errors-to-pubsub".Sink identifiers are limited to 100 characters and can include only the following characters: upper and lower-case alphanumeric characters, underscores, hyphens, periods.First character has to be alphanumeric.',
  ).optional(),
  customWriterIdentity: z.string().describe(
    "Optional. The service account provided by the caller that will be used to write the log entries. The format must be serviceAccount:some@email. This field can only be specified when you are routing logs to a log bucket that is in a different project than the sink. When not specified, a Logging service account will automatically be generated.",
  ).optional(),
  uniqueWriterIdentity: z.string().describe(
    "Optional. Determines the kind of IAM identity returned as writer_identity in the new sink. If this value is omitted or set to false, and if the sink's parent is a project, then the value returned as writer_identity is the same group or service account used by Cloud Logging before the addition of writer identities to this API. The sink's destination must be in the same project as the sink itself.If this field is set to true, or if the sink is owned by a non-project resource such as an organization, then the value of writer_identity will be a service agent (https://docs.cloud.google.com/iam/docs/service-account-types#service-agents) used by the sinks with the same parent. For more information, see writer_identity in LogSink.",
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

/** Swamp extension model for Google Cloud Logging Sinks. Registered at `@swamp/gcp/logging/sinks`. */
export const model = {
  type: "@swamp/gcp/logging/sinks",
  version: "2026.09.17.2",
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
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "Describes a sink used to export log entries to one of the following destinati...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a sinks",
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
        if (g["bigqueryOptions"] !== undefined) {
          body["bigqueryOptions"] = g["bigqueryOptions"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["destination"] !== undefined) {
          body["destination"] = g["destination"];
        }
        if (g["disabled"] !== undefined) body["disabled"] = g["disabled"];
        if (g["exclusions"] !== undefined) body["exclusions"] = g["exclusions"];
        if (g["filter"] !== undefined) body["filter"] = g["filter"];
        if (g["includeChildren"] !== undefined) {
          body["includeChildren"] = g["includeChildren"];
        }
        if (g["interceptChildren"] !== undefined) {
          body["interceptChildren"] = g["interceptChildren"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["customWriterIdentity"] !== undefined) {
          params["customWriterIdentity"] = String(g["customWriterIdentity"]);
        }
        if (g["uniqueWriterIdentity"] !== undefined) {
          params["uniqueWriterIdentity"] = String(g["uniqueWriterIdentity"]);
        }
        if (g["name"] !== undefined) params["sinkName"] = String(g["name"]);
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
      description: "Get a sinks",
      arguments: z.object({
        identifier: z.string().describe("The name of the sinks"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["sinkName"] = args.identifier;
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
      description: "Update sinks attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific sinks by name (e.g. one discovered by list)",
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
        params["sinkName"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["bigqueryOptions"] !== undefined) {
          body["bigqueryOptions"] = g["bigqueryOptions"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["destination"] !== undefined) {
          body["destination"] = g["destination"];
        }
        if (g["disabled"] !== undefined) body["disabled"] = g["disabled"];
        if (g["exclusions"] !== undefined) body["exclusions"] = g["exclusions"];
        if (g["filter"] !== undefined) body["filter"] = g["filter"];
        if (g["includeChildren"] !== undefined) {
          body["includeChildren"] = g["includeChildren"];
        }
        if (g["interceptChildren"] !== undefined) {
          body["interceptChildren"] = g["interceptChildren"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
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
      description: "Delete the sinks",
      arguments: z.object({
        identifier: z.string().describe("The name of the sinks"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["sinkName"] = args.identifier;
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
      description: "Sync sinks state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific sinks by name (e.g. one discovered by list)",
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
          params["sinkName"] = identifier;
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
      description: "List sinks resources",
      arguments: z.object({
        filter: z.string().describe(
          "Optional. A filter expression to constrain the sinks returned. Today, this only supports the following strings: '' 'in_scope(\"ALL\")', 'in_scope(\"ANCESTOR\")', 'in_scope(\"DEFAULT\")'.Description of scopes below. ALL: Includes all of the sinks which can be returned in any other scope. ANCESTOR: Includes intercepting sinks owned by ancestor resources. DEFAULT: Includes sinks owned by parent.When the empty string is provided, then the filter 'in_scope(\"DEFAULT\")' is applied.",
        ).optional(),
        pageSize: z.number().describe(
          "Optional. The maximum number of results to return from this request. Non-positive values are ignored. The presence of nextPageToken in the response indicates that more results might be available.",
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
          "sinks",
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
    ...loggingSinkMethods,
  },
};
