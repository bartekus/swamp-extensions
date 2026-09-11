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

// Auto-generated extension model for @swamp/gcp/datamigration/migrationjobs
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Database Migration MigrationJobs.
 *
 * Represents a Database Migration Service migration job object.
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
  return `${parent}/migrationJobs/${shortName}`;
}

const BASE_URL = "https://datamigration.googleapis.com/";

const GET_CONFIG = {
  "id": "datamigration.projects.locations.migrationJobs.get",
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
  "id": "datamigration.projects.locations.migrationJobs.create",
  "path": "v1/{+parent}/migrationJobs",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "migrationJobId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "datamigration.projects.locations.migrationJobs.patch",
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
    "requestId": {
      "location": "query",
    },
    "updateMask": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "datamigration.projects.locations.migrationJobs.delete",
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
    "requestId": {
      "location": "query",
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "datamigration.projects.locations.migrationJobs.list",
  "path": "v1/{+parent}/migrationJobs",
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
  cmekKeyName: z.string().describe(
    "The CMEK (customer-managed encryption key) fully qualified key name used for the migration job. This field supports all migration jobs types except for: * Mysql to Mysql (use the cmek field in the cloudsql connection profile instead). * PostrgeSQL to PostgreSQL (use the cmek field in the cloudsql connection profile instead). * PostgreSQL to AlloyDB (use the kms_key_name field in the alloydb connection profile instead). Each Cloud CMEK key has the following format: projects/[PROJECT]/locations/[REGION]/keyRings/[RING]/cryptoKeys/[KEY_NAME]",
  ).optional(),
  conversionWorkspace: z.object({
    commitId: z.string().describe("The commit ID of the conversion workspace.")
      .optional(),
    name: z.string().describe(
      "The resource name (URI) of the conversion workspace.",
    ).optional(),
  }).describe("The conversion workspace used by the migration.").optional(),
  destination: z.string().describe(
    "Required. The resource name (URI) of the destination connection profile.",
  ).optional(),
  destinationDatabase: z.object({
    engine: z.enum([
      "DATABASE_ENGINE_UNSPECIFIED",
      "MYSQL",
      "POSTGRESQL",
      "SQLSERVER",
      "ORACLE",
    ]).describe("The database engine.").optional(),
    provider: z.enum([
      "DATABASE_PROVIDER_UNSPECIFIED",
      "CLOUDSQL",
      "RDS",
      "AURORA",
      "ALLOYDB",
      "AZURE_DATABASE",
    ]).describe("The database provider.").optional(),
  }).describe("The database engine type and provider of the destination.")
    .optional(),
  displayName: z.string().describe("The migration job display name.")
    .optional(),
  dumpFlags: z.object({
    dumpFlags: z.array(z.object({
      name: z.string().describe("The name of the flag").optional(),
      value: z.string().describe("The value of the flag.").optional(),
    })).describe("The flags for the initial dump.").optional(),
  }).describe(
    'The initial dump flags. This field and the "dump_path" field are mutually exclusive.',
  ).optional(),
  dumpPath: z.string().describe(
    'The path to the dump file in Google Cloud Storage, in the format: (gs://[BUCKET_NAME]/[OBJECT_NAME]). This field and the "dump_flags" field are mutually exclusive.',
  ).optional(),
  dumpType: z.enum(["DUMP_TYPE_UNSPECIFIED", "LOGICAL", "PHYSICAL"]).describe(
    "Optional. The type of the data dump. Supported for MySQL to CloudSQL for MySQL migrations only.",
  ).optional(),
  filter: z.string().describe(
    "This field can be used to select the entities to migrate as part of the migration job. It uses AIP-160 notation to select a subset of the entities configured on the associated conversion-workspace. This field should not be set on migration-jobs that are not associated with a conversion workspace.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    'The resource labels for migration job to use to annotate any related underlying resources such as Compute Engine VMs. An object containing a list of "key": "value" pairs. Example: `{ "name": "wrench", "mass": "1.3kg", "count": "3" }`.',
  ).optional(),
  mysqlHomogeneousConfig: z.object({
    isPrimaryDestination: z.boolean().describe(
      "Optional. Whether the destination for the migration job is a primary instance.",
    ).optional(),
  }).describe("Optional. Configuration for MySQL homogeneous migration.")
    .optional(),
  name: z.string().describe(
    "The name (URI) of this migration job resource, in the form of: projects/{project}/locations/{location}/migrationJobs/{migrationJob}.",
  ).optional(),
  objectsConfig: z.object({
    sourceObjectsConfig: z.object({
      objectConfigs: z.array(z.object({
        objectIdentifier: z.object({
          database: z.unknown().describe(
            "Optional. The database name. This will be required only if the object uses a database name as part of its unique identifier.",
          ).optional(),
          schema: z.unknown().describe(
            "Optional. The schema name. This will be required only if the object uses a schema name as part of its unique identifier.",
          ).optional(),
          table: z.unknown().describe(
            "Optional. The table name. This will be required only if the object is a level below database or schema.",
          ).optional(),
          type: z.unknown().describe(
            "Required. The type of the migration job object.",
          ).optional(),
        }).describe("Optional. The object identifier.").optional(),
      })).describe("Optional. The list of the objects to be migrated.")
        .optional(),
      objectsSelectionType: z.enum([
        "OBJECTS_SELECTION_TYPE_UNSPECIFIED",
        "ALL_OBJECTS",
        "SPECIFIED_OBJECTS",
      ]).describe("Optional. The objects selection type of the migration job.")
        .optional(),
    }).describe("The list of the migration job objects.").optional(),
  }).describe("Optional. The objects that need to be migrated.").optional(),
  oracleToPostgresConfig: z.object({
    oracleSourceConfig: z.object({
      binaryLogParser: z.object({
        logFileDirectories: z.object({
          archivedLogDirectory: z.string().describe(
            "Required. Oracle directory for archived logs.",
          ).optional(),
          onlineLogDirectory: z.string().describe(
            "Required. Oracle directory for online logs.",
          ).optional(),
        }).describe("Use Oracle directories.").optional(),
        oracleAsmLogFileAccess: z.object({}).describe("Use Oracle ASM.")
          .optional(),
      }).describe("Use Binary Log Parser.").optional(),
      cdcStartPosition: z.string().describe(
        "Optional. The schema change number (SCN) to start CDC data migration from.",
      ).optional(),
      logMiner: z.object({}).describe("Use LogMiner.").optional(),
      maxConcurrentCdcConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for CDC phase.",
      ).optional(),
      maxConcurrentFullDumpConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for full dump phase.",
      ).optional(),
      skipFullDump: z.boolean().describe(
        "Optional. Whether to skip full dump or not.",
      ).optional(),
    }).describe("Optional. Configuration for Oracle source.").optional(),
    postgresDestinationConfig: z.object({
      maxConcurrentConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the destination for data migration.",
      ).optional(),
      transactionTimeout: z.string().describe(
        "Optional. Timeout for data migration transactions.",
      ).optional(),
    }).describe("Optional. Configuration for Postgres destination.").optional(),
  }).describe(
    "Configuration for heterogeneous **Oracle to Cloud SQL for PostgreSQL** and **Oracle to AlloyDB for PostgreSQL** migrations.",
  ).optional(),
  originalMigrationName: z.string().describe(
    "Optional. A failback replication pointer to the resource name (URI) of the original migration job.",
  ).optional(),
  performanceConfig: z.object({
    dumpParallelLevel: z.enum([
      "DUMP_PARALLEL_LEVEL_UNSPECIFIED",
      "MIN",
      "OPTIMAL",
      "MAX",
    ]).describe("Initial dump parallelism level.").optional(),
    loadParallelLevel: z.enum([
      "LOAD_PARALLEL_LEVEL_UNSPECIFIED",
      "LOAD_MIN",
      "LOAD_OPTIMAL",
      "LOAD_MAX",
    ]).describe("Optional. Initial load parallelism level.").optional(),
  }).describe(
    "Optional. Data dump and load parallelism settings used by the migration.",
  ).optional(),
  postgresHomogeneousConfig: z.object({
    isNativeLogical: z.boolean().describe(
      "Required. Whether the migration is native logical.",
    ).optional(),
    maxAdditionalSubscriptions: z.number().int().describe(
      "Optional. Maximum number of additional subscriptions to use for the migration job.",
    ).optional(),
  }).describe("Optional. Configuration for PostgreSQL homogeneous migration.")
    .optional(),
  postgresToSqlserverConfig: z.object({
    postgresSourceConfig: z.object({
      skipFullDump: z.boolean().describe(
        "Optional. Whether to skip full dump or not.",
      ).optional(),
    }).describe("Optional. Configuration for PostgreSQL source.").optional(),
    sqlserverDestinationConfig: z.object({
      maxConcurrentConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the destination for data migration.",
      ).optional(),
      transactionTimeout: z.string().describe(
        "Optional. Timeout for data migration transactions.",
      ).optional(),
    }).describe("Optional. Configuration for SQL Server destination.")
      .optional(),
  }).describe(
    "Configuration for heterogeneous failback migrations from **PostgreSQL to SQL Server**.",
  ).optional(),
  reverseSshConnectivity: z.object({
    vm: z.string().describe(
      "The name of the virtual machine (Compute Engine) used as the bastion server for the SSH tunnel.",
    ).optional(),
    vmIp: z.string().describe(
      "Required. The IP of the virtual machine (Compute Engine) used as the bastion server for the SSH tunnel.",
    ).optional(),
    vmPort: z.number().int().describe(
      "Required. The forwarding port of the virtual machine (Compute Engine) used as the bastion server for the SSH tunnel.",
    ).optional(),
    vpc: z.string().describe(
      "The name of the VPC to peer with the Cloud SQL private network.",
    ).optional(),
  }).describe(
    "The details needed to communicate to the source over Reverse SSH tunnel connectivity.",
  ).optional(),
  source: z.string().describe(
    "Required. The resource name (URI) of the source connection profile.",
  ).optional(),
  sourceDatabase: z.object({
    engine: z.enum([
      "DATABASE_ENGINE_UNSPECIFIED",
      "MYSQL",
      "POSTGRESQL",
      "SQLSERVER",
      "ORACLE",
    ]).describe("The database engine.").optional(),
    provider: z.enum([
      "DATABASE_PROVIDER_UNSPECIFIED",
      "CLOUDSQL",
      "RDS",
      "AURORA",
      "ALLOYDB",
      "AZURE_DATABASE",
    ]).describe("The database provider.").optional(),
  }).describe("The database engine type and provider of the source.")
    .optional(),
  sqlserverHomogeneousMigrationJobConfig: z.object({
    backupFilePattern: z.string().describe(
      "Required. Pattern that describes the default backup naming strategy. The specified pattern should ensure lexicographical order of backups. The pattern must define one of the following capture group sets: Capture group set #1 yy/yyyy - year, 2 or 4 digits mm - month number, 1-12 dd - day of month, 1-31 hh - hour of day, 00-23 mi - minutes, 00-59 ss - seconds, 00-59 Example: For backup file TestDB_20230802_155400.trn, use pattern: (?.*)_backup_(?\\d{4})(?\\d{2})(?\\d{2})_(?\\d{2})(?\\d{2})(?\\d{2}).trn Capture group set #2 timestamp - unix timestamp Example: For backup file TestDB.1691448254.trn, use pattern: (?.*)\\.(?\\d*).trn or (?.*)\\.(?\\d*).trn",
    ).optional(),
    dagConfig: z.object({
      linkedServer: z.string().describe(
        "Required. The name of the linked server that points to the source SQL Server instance. Only used by DAG migrations.",
      ).optional(),
      sourceAg: z.string().describe(
        "Required. The name of the source availability group. Only used by DAG migrations.",
      ).optional(),
    }).describe(
      "Optional. Configuration for distributed availability group (DAG) for the SQL Server homogeneous migration.",
    ).optional(),
    databaseBackups: z.array(z.object({
      database: z.string().describe(
        "Required. Name of a SQL Server database for which to define backup configuration.",
      ).optional(),
      encryptionOptions: z.object({
        certPath: z.string().describe(
          "Required. Path to the Certificate (.cer) in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
        ).optional(),
        pvkPassword: z.string().describe(
          "Required. Input only. Password that encrypts the private key.",
        ).optional(),
        pvkPath: z.string().describe(
          "Required. Path to the Certificate Private Key (.pvk) in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
        ).optional(),
      }).describe(
        "Optional. Encryption settings for the database. Required if provided database backups are encrypted. Encryption settings include path to certificate, path to certificate private key, and key password.",
      ).optional(),
    })).describe("Required. Backup details per database in Cloud Storage.")
      .optional(),
    promoteWhenReady: z.boolean().describe(
      "Optional. Promote databases when ready.",
    ).optional(),
    useDiffBackup: z.boolean().describe(
      "Optional. Enable differential backups.",
    ).optional(),
  }).describe("Optional. Configuration for SQL Server homogeneous migration.")
    .optional(),
  sqlserverToPostgresConfig: z.object({
    postgresDestinationConfig: z.object({
      maxConcurrentConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the destination for data migration.",
      ).optional(),
      transactionTimeout: z.string().describe(
        "Optional. Timeout for data migration transactions.",
      ).optional(),
    }).describe("Optional. Configuration for Postgres destination.").optional(),
    sqlserverSourceConfig: z.object({
      cdcStartPosition: z.string().describe(
        "Optional. The log sequence number (LSN) to start CDC data migration from.",
      ).optional(),
      maxConcurrentCdcConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for CDC phase.",
      ).optional(),
      maxConcurrentFullDumpConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for full dump phase.",
      ).optional(),
      skipFullDump: z.boolean().describe(
        "Optional. Whether to skip full dump or not.",
      ).optional(),
    }).describe("Optional. Configuration for SQL Server source.").optional(),
  }).describe(
    "Configuration for heterogeneous **SQL Server to Cloud SQL for PostgreSQL** migrations.",
  ).optional(),
  state: z.enum([
    "STATE_UNSPECIFIED",
    "MAINTENANCE",
    "DRAFT",
    "CREATING",
    "NOT_STARTED",
    "RUNNING",
    "FAILED",
    "COMPLETED",
    "DELETING",
    "STOPPING",
    "STOPPED",
    "DELETED",
    "UPDATING",
    "STARTING",
    "RESTARTING",
    "RESUMING",
  ]).describe("The current migration job state.").optional(),
  staticIpConnectivity: z.object({}).describe(
    "static ip connectivity data (default, no additional details needed).",
  ).optional(),
  type: z.enum(["TYPE_UNSPECIFIED", "ONE_TIME", "CONTINUOUS"]).describe(
    "Required. The migration job type.",
  ).optional(),
  vpcPeeringConnectivity: z.object({
    vpc: z.string().describe(
      "The name of the VPC network to peer with the Cloud SQL private network.",
    ).optional(),
  }).describe(
    "The details of the VPC network that the source database is located in.",
  ).optional(),
  migrationJobId: z.string().describe(
    "Required. The ID of the instance to create.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two requests with the same ID, then the second request is ignored. It is recommended to always set this value to a UUID. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  cmekKeyName: z.string().optional(),
  conversionWorkspace: z.object({
    commitId: z.string(),
    name: z.string(),
  }).optional(),
  createTime: z.string().optional(),
  destination: z.string().optional(),
  destinationDatabase: z.object({
    engine: z.string(),
    provider: z.string(),
  }).optional(),
  displayName: z.string().optional(),
  dumpFlags: z.object({
    dumpFlags: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })),
  }).optional(),
  dumpPath: z.string().optional(),
  dumpType: z.string().optional(),
  duration: z.string().optional(),
  endTime: z.string().optional(),
  error: z.object({
    code: z.number(),
    details: z.array(z.record(z.string(), z.unknown())),
    message: z.string(),
  }).optional(),
  filter: z.string().optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  mysqlHomogeneousConfig: z.object({
    isPrimaryDestination: z.boolean(),
  }).optional(),
  name: z.string(),
  objectsConfig: z.object({
    sourceObjectsConfig: z.object({
      objectConfigs: z.array(z.object({
        objectIdentifier: z.object({
          database: z.unknown(),
          schema: z.unknown(),
          table: z.unknown(),
          type: z.unknown(),
        }),
      })),
      objectsSelectionType: z.string(),
    }),
  }).optional(),
  oracleToPostgresConfig: z.object({
    oracleSourceConfig: z.object({
      binaryLogParser: z.object({
        logFileDirectories: z.object({
          archivedLogDirectory: z.string(),
          onlineLogDirectory: z.string(),
        }),
        oracleAsmLogFileAccess: z.object({}),
      }),
      cdcStartPosition: z.string(),
      logMiner: z.object({}),
      maxConcurrentCdcConnections: z.number(),
      maxConcurrentFullDumpConnections: z.number(),
      skipFullDump: z.boolean(),
    }),
    postgresDestinationConfig: z.object({
      maxConcurrentConnections: z.number(),
      transactionTimeout: z.string(),
    }),
  }).optional(),
  originalMigrationName: z.string().optional(),
  performanceConfig: z.object({
    dumpParallelLevel: z.string(),
    loadParallelLevel: z.string(),
  }).optional(),
  phase: z.string().optional(),
  postgresHomogeneousConfig: z.object({
    isNativeLogical: z.boolean(),
    maxAdditionalSubscriptions: z.number(),
  }).optional(),
  postgresToSqlserverConfig: z.object({
    postgresSourceConfig: z.object({
      skipFullDump: z.boolean(),
    }),
    sqlserverDestinationConfig: z.object({
      maxConcurrentConnections: z.number(),
      transactionTimeout: z.string(),
    }),
  }).optional(),
  purpose: z.string().optional(),
  reverseSshConnectivity: z.object({
    vm: z.string(),
    vmIp: z.string(),
    vmPort: z.number(),
    vpc: z.string(),
  }).optional(),
  satisfiesPzi: z.boolean().optional(),
  satisfiesPzs: z.boolean().optional(),
  source: z.string().optional(),
  sourceDatabase: z.object({
    engine: z.string(),
    provider: z.string(),
  }).optional(),
  sqlserverHomogeneousMigrationJobConfig: z.object({
    backupFilePattern: z.string(),
    dagConfig: z.object({
      linkedServer: z.string(),
      sourceAg: z.string(),
    }),
    databaseBackups: z.array(z.object({
      database: z.string(),
      encryptionOptions: z.object({
        certPath: z.string(),
        pvkPassword: z.string(),
        pvkPath: z.string(),
      }),
    })),
    promoteWhenReady: z.boolean(),
    useDiffBackup: z.boolean(),
  }).optional(),
  sqlserverToPostgresConfig: z.object({
    postgresDestinationConfig: z.object({
      maxConcurrentConnections: z.number(),
      transactionTimeout: z.string(),
    }),
    sqlserverSourceConfig: z.object({
      cdcStartPosition: z.string(),
      maxConcurrentCdcConnections: z.number(),
      maxConcurrentFullDumpConnections: z.number(),
      skipFullDump: z.boolean(),
    }),
  }).optional(),
  state: z.string().optional(),
  staticIpConnectivity: z.object({}).optional(),
  type: z.string().optional(),
  updateTime: z.string().optional(),
  vpcPeeringConnectivity: z.object({
    vpc: z.string(),
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
  cmekKeyName: z.string().describe(
    "The CMEK (customer-managed encryption key) fully qualified key name used for the migration job. This field supports all migration jobs types except for: * Mysql to Mysql (use the cmek field in the cloudsql connection profile instead). * PostrgeSQL to PostgreSQL (use the cmek field in the cloudsql connection profile instead). * PostgreSQL to AlloyDB (use the kms_key_name field in the alloydb connection profile instead). Each Cloud CMEK key has the following format: projects/[PROJECT]/locations/[REGION]/keyRings/[RING]/cryptoKeys/[KEY_NAME]",
  ).optional(),
  conversionWorkspace: z.object({
    commitId: z.string().describe("The commit ID of the conversion workspace.")
      .optional(),
    name: z.string().describe(
      "The resource name (URI) of the conversion workspace.",
    ).optional(),
  }).describe("The conversion workspace used by the migration.").optional(),
  destination: z.string().describe(
    "Required. The resource name (URI) of the destination connection profile.",
  ).optional(),
  destinationDatabase: z.object({
    engine: z.enum([
      "DATABASE_ENGINE_UNSPECIFIED",
      "MYSQL",
      "POSTGRESQL",
      "SQLSERVER",
      "ORACLE",
    ]).describe("The database engine.").optional(),
    provider: z.enum([
      "DATABASE_PROVIDER_UNSPECIFIED",
      "CLOUDSQL",
      "RDS",
      "AURORA",
      "ALLOYDB",
      "AZURE_DATABASE",
    ]).describe("The database provider.").optional(),
  }).describe("The database engine type and provider of the destination.")
    .optional(),
  displayName: z.string().describe("The migration job display name.")
    .optional(),
  dumpFlags: z.object({
    dumpFlags: z.array(z.object({
      name: z.string().describe("The name of the flag").optional(),
      value: z.string().describe("The value of the flag.").optional(),
    })).describe("The flags for the initial dump.").optional(),
  }).describe(
    'The initial dump flags. This field and the "dump_path" field are mutually exclusive.',
  ).optional(),
  dumpPath: z.string().describe(
    'The path to the dump file in Google Cloud Storage, in the format: (gs://[BUCKET_NAME]/[OBJECT_NAME]). This field and the "dump_flags" field are mutually exclusive.',
  ).optional(),
  dumpType: z.enum(["DUMP_TYPE_UNSPECIFIED", "LOGICAL", "PHYSICAL"]).describe(
    "Optional. The type of the data dump. Supported for MySQL to CloudSQL for MySQL migrations only.",
  ).optional(),
  filter: z.string().describe(
    "This field can be used to select the entities to migrate as part of the migration job. It uses AIP-160 notation to select a subset of the entities configured on the associated conversion-workspace. This field should not be set on migration-jobs that are not associated with a conversion workspace.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    'The resource labels for migration job to use to annotate any related underlying resources such as Compute Engine VMs. An object containing a list of "key": "value" pairs. Example: `{ "name": "wrench", "mass": "1.3kg", "count": "3" }`.',
  ).optional(),
  mysqlHomogeneousConfig: z.object({
    isPrimaryDestination: z.boolean().describe(
      "Optional. Whether the destination for the migration job is a primary instance.",
    ).optional(),
  }).describe("Optional. Configuration for MySQL homogeneous migration.")
    .optional(),
  name: z.string().describe(
    "The name (URI) of this migration job resource, in the form of: projects/{project}/locations/{location}/migrationJobs/{migrationJob}.",
  ).optional(),
  objectsConfig: z.object({
    sourceObjectsConfig: z.object({
      objectConfigs: z.array(z.object({
        objectIdentifier: z.object({
          database: z.unknown().describe(
            "Optional. The database name. This will be required only if the object uses a database name as part of its unique identifier.",
          ).optional(),
          schema: z.unknown().describe(
            "Optional. The schema name. This will be required only if the object uses a schema name as part of its unique identifier.",
          ).optional(),
          table: z.unknown().describe(
            "Optional. The table name. This will be required only if the object is a level below database or schema.",
          ).optional(),
          type: z.unknown().describe(
            "Required. The type of the migration job object.",
          ).optional(),
        }).describe("Optional. The object identifier.").optional(),
      })).describe("Optional. The list of the objects to be migrated.")
        .optional(),
      objectsSelectionType: z.enum([
        "OBJECTS_SELECTION_TYPE_UNSPECIFIED",
        "ALL_OBJECTS",
        "SPECIFIED_OBJECTS",
      ]).describe("Optional. The objects selection type of the migration job.")
        .optional(),
    }).describe("The list of the migration job objects.").optional(),
  }).describe("Optional. The objects that need to be migrated.").optional(),
  oracleToPostgresConfig: z.object({
    oracleSourceConfig: z.object({
      binaryLogParser: z.object({
        logFileDirectories: z.object({
          archivedLogDirectory: z.string().describe(
            "Required. Oracle directory for archived logs.",
          ).optional(),
          onlineLogDirectory: z.string().describe(
            "Required. Oracle directory for online logs.",
          ).optional(),
        }).describe("Use Oracle directories.").optional(),
        oracleAsmLogFileAccess: z.object({}).describe("Use Oracle ASM.")
          .optional(),
      }).describe("Use Binary Log Parser.").optional(),
      cdcStartPosition: z.string().describe(
        "Optional. The schema change number (SCN) to start CDC data migration from.",
      ).optional(),
      logMiner: z.object({}).describe("Use LogMiner.").optional(),
      maxConcurrentCdcConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for CDC phase.",
      ).optional(),
      maxConcurrentFullDumpConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for full dump phase.",
      ).optional(),
      skipFullDump: z.boolean().describe(
        "Optional. Whether to skip full dump or not.",
      ).optional(),
    }).describe("Optional. Configuration for Oracle source.").optional(),
    postgresDestinationConfig: z.object({
      maxConcurrentConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the destination for data migration.",
      ).optional(),
      transactionTimeout: z.string().describe(
        "Optional. Timeout for data migration transactions.",
      ).optional(),
    }).describe("Optional. Configuration for Postgres destination.").optional(),
  }).describe(
    "Configuration for heterogeneous **Oracle to Cloud SQL for PostgreSQL** and **Oracle to AlloyDB for PostgreSQL** migrations.",
  ).optional(),
  originalMigrationName: z.string().describe(
    "Optional. A failback replication pointer to the resource name (URI) of the original migration job.",
  ).optional(),
  performanceConfig: z.object({
    dumpParallelLevel: z.enum([
      "DUMP_PARALLEL_LEVEL_UNSPECIFIED",
      "MIN",
      "OPTIMAL",
      "MAX",
    ]).describe("Initial dump parallelism level.").optional(),
    loadParallelLevel: z.enum([
      "LOAD_PARALLEL_LEVEL_UNSPECIFIED",
      "LOAD_MIN",
      "LOAD_OPTIMAL",
      "LOAD_MAX",
    ]).describe("Optional. Initial load parallelism level.").optional(),
  }).describe(
    "Optional. Data dump and load parallelism settings used by the migration.",
  ).optional(),
  postgresHomogeneousConfig: z.object({
    isNativeLogical: z.boolean().describe(
      "Required. Whether the migration is native logical.",
    ).optional(),
    maxAdditionalSubscriptions: z.number().int().describe(
      "Optional. Maximum number of additional subscriptions to use for the migration job.",
    ).optional(),
  }).describe("Optional. Configuration for PostgreSQL homogeneous migration.")
    .optional(),
  postgresToSqlserverConfig: z.object({
    postgresSourceConfig: z.object({
      skipFullDump: z.boolean().describe(
        "Optional. Whether to skip full dump or not.",
      ).optional(),
    }).describe("Optional. Configuration for PostgreSQL source.").optional(),
    sqlserverDestinationConfig: z.object({
      maxConcurrentConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the destination for data migration.",
      ).optional(),
      transactionTimeout: z.string().describe(
        "Optional. Timeout for data migration transactions.",
      ).optional(),
    }).describe("Optional. Configuration for SQL Server destination.")
      .optional(),
  }).describe(
    "Configuration for heterogeneous failback migrations from **PostgreSQL to SQL Server**.",
  ).optional(),
  reverseSshConnectivity: z.object({
    vm: z.string().describe(
      "The name of the virtual machine (Compute Engine) used as the bastion server for the SSH tunnel.",
    ).optional(),
    vmIp: z.string().describe(
      "Required. The IP of the virtual machine (Compute Engine) used as the bastion server for the SSH tunnel.",
    ).optional(),
    vmPort: z.number().int().describe(
      "Required. The forwarding port of the virtual machine (Compute Engine) used as the bastion server for the SSH tunnel.",
    ).optional(),
    vpc: z.string().describe(
      "The name of the VPC to peer with the Cloud SQL private network.",
    ).optional(),
  }).describe(
    "The details needed to communicate to the source over Reverse SSH tunnel connectivity.",
  ).optional(),
  source: z.string().describe(
    "Required. The resource name (URI) of the source connection profile.",
  ).optional(),
  sourceDatabase: z.object({
    engine: z.enum([
      "DATABASE_ENGINE_UNSPECIFIED",
      "MYSQL",
      "POSTGRESQL",
      "SQLSERVER",
      "ORACLE",
    ]).describe("The database engine.").optional(),
    provider: z.enum([
      "DATABASE_PROVIDER_UNSPECIFIED",
      "CLOUDSQL",
      "RDS",
      "AURORA",
      "ALLOYDB",
      "AZURE_DATABASE",
    ]).describe("The database provider.").optional(),
  }).describe("The database engine type and provider of the source.")
    .optional(),
  sqlserverHomogeneousMigrationJobConfig: z.object({
    backupFilePattern: z.string().describe(
      "Required. Pattern that describes the default backup naming strategy. The specified pattern should ensure lexicographical order of backups. The pattern must define one of the following capture group sets: Capture group set #1 yy/yyyy - year, 2 or 4 digits mm - month number, 1-12 dd - day of month, 1-31 hh - hour of day, 00-23 mi - minutes, 00-59 ss - seconds, 00-59 Example: For backup file TestDB_20230802_155400.trn, use pattern: (?.*)_backup_(?\\d{4})(?\\d{2})(?\\d{2})_(?\\d{2})(?\\d{2})(?\\d{2}).trn Capture group set #2 timestamp - unix timestamp Example: For backup file TestDB.1691448254.trn, use pattern: (?.*)\\.(?\\d*).trn or (?.*)\\.(?\\d*).trn",
    ).optional(),
    dagConfig: z.object({
      linkedServer: z.string().describe(
        "Required. The name of the linked server that points to the source SQL Server instance. Only used by DAG migrations.",
      ).optional(),
      sourceAg: z.string().describe(
        "Required. The name of the source availability group. Only used by DAG migrations.",
      ).optional(),
    }).describe(
      "Optional. Configuration for distributed availability group (DAG) for the SQL Server homogeneous migration.",
    ).optional(),
    databaseBackups: z.array(z.object({
      database: z.string().describe(
        "Required. Name of a SQL Server database for which to define backup configuration.",
      ).optional(),
      encryptionOptions: z.object({
        certPath: z.string().describe(
          "Required. Path to the Certificate (.cer) in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
        ).optional(),
        pvkPassword: z.string().describe(
          "Required. Input only. Password that encrypts the private key.",
        ).optional(),
        pvkPath: z.string().describe(
          "Required. Path to the Certificate Private Key (.pvk) in Cloud Storage, in the form `gs://bucketName/fileName`. The instance must have write permissions to the bucket and read access to the file.",
        ).optional(),
      }).describe(
        "Optional. Encryption settings for the database. Required if provided database backups are encrypted. Encryption settings include path to certificate, path to certificate private key, and key password.",
      ).optional(),
    })).describe("Required. Backup details per database in Cloud Storage.")
      .optional(),
    promoteWhenReady: z.boolean().describe(
      "Optional. Promote databases when ready.",
    ).optional(),
    useDiffBackup: z.boolean().describe(
      "Optional. Enable differential backups.",
    ).optional(),
  }).describe("Optional. Configuration for SQL Server homogeneous migration.")
    .optional(),
  sqlserverToPostgresConfig: z.object({
    postgresDestinationConfig: z.object({
      maxConcurrentConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the destination for data migration.",
      ).optional(),
      transactionTimeout: z.string().describe(
        "Optional. Timeout for data migration transactions.",
      ).optional(),
    }).describe("Optional. Configuration for Postgres destination.").optional(),
    sqlserverSourceConfig: z.object({
      cdcStartPosition: z.string().describe(
        "Optional. The log sequence number (LSN) to start CDC data migration from.",
      ).optional(),
      maxConcurrentCdcConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for CDC phase.",
      ).optional(),
      maxConcurrentFullDumpConnections: z.number().int().describe(
        "Optional. Maximum number of connections Database Migration Service will open to the source for full dump phase.",
      ).optional(),
      skipFullDump: z.boolean().describe(
        "Optional. Whether to skip full dump or not.",
      ).optional(),
    }).describe("Optional. Configuration for SQL Server source.").optional(),
  }).describe(
    "Configuration for heterogeneous **SQL Server to Cloud SQL for PostgreSQL** migrations.",
  ).optional(),
  state: z.enum([
    "STATE_UNSPECIFIED",
    "MAINTENANCE",
    "DRAFT",
    "CREATING",
    "NOT_STARTED",
    "RUNNING",
    "FAILED",
    "COMPLETED",
    "DELETING",
    "STOPPING",
    "STOPPED",
    "DELETED",
    "UPDATING",
    "STARTING",
    "RESTARTING",
    "RESUMING",
  ]).describe("The current migration job state.").optional(),
  staticIpConnectivity: z.object({}).describe(
    "static ip connectivity data (default, no additional details needed).",
  ).optional(),
  type: z.enum(["TYPE_UNSPECIFIED", "ONE_TIME", "CONTINUOUS"]).describe(
    "Required. The migration job type.",
  ).optional(),
  vpcPeeringConnectivity: z.object({
    vpc: z.string().describe(
      "The name of the VPC network to peer with the Cloud SQL private network.",
    ).optional(),
  }).describe(
    "The details of the VPC network that the source database is located in.",
  ).optional(),
  migrationJobId: z.string().describe(
    "Required. The ID of the instance to create.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two requests with the same ID, then the second request is ignored. It is recommended to always set this value to a UUID. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
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

/** Swamp extension model for Google Cloud Database Migration MigrationJobs. Registered at `@swamp/gcp/datamigration/migrationjobs`. */
export const model = {
  type: "@swamp/gcp/datamigration/migrationjobs",
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
      toVersion: "2026.05.06.1",
      description: "Added: postgresHomogeneousConfig",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
      description: "Added: postgresHomogeneousConfig",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.20.1",
      description: "Added: postgresHomogeneousConfig",
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
      toVersion: "2026.05.26.1",
      description: "Added: postgresHomogeneousConfig",
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
      description: "Added: mysqlHomogeneousConfig",
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
      toVersion: "2026.07.20.2",
      description: "Added: mysqlHomogeneousConfig, postgresHomogeneousConfig",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "Removed: error",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { error: _error, ...rest } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.07.21.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.4",
      description: "Added: mysqlHomogeneousConfig, postgresHomogeneousConfig",
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
        "Removed: commitId, engine, provider, value, isPrimaryDestination, sourceObjectsConfig, objectConfigs, objectIdentifier, database, schema, table, objectsSelectionType, oracleSourceConfig, binaryLogParser, logFileDirectories, archivedLogDirectory, onlineLogDirectory, oracleAsmLogFileAccess, cdcStartPosition, logMiner, maxConcurrentCdcConnections, maxConcurrentFullDumpConnections, skipFullDump, postgresDestinationConfig, maxConcurrentConnections, transactionTimeout, dumpParallelLevel, isNativeLogical, maxAdditionalSubscriptions, postgresSourceConfig, skipFullDump, sqlserverDestinationConfig, maxConcurrentConnections, transactionTimeout, vm, vmIp, vmPort, vpc, engine, provider, backupFilePattern, dagConfig, linkedServer, sourceAg, databaseBackups, database, encryptionOptions, certPath, pvkPassword, pvkPath, promoteWhenReady, useDiffBackup, postgresDestinationConfig, maxConcurrentConnections, transactionTimeout, sqlserverSourceConfig, cdcStartPosition, maxConcurrentCdcConnections, maxConcurrentFullDumpConnections, skipFullDump, vpc",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          commitId: _commitId,
          engine: _engine,
          provider: _provider,
          value: _value,
          isPrimaryDestination: _isPrimaryDestination,
          sourceObjectsConfig: _sourceObjectsConfig,
          objectConfigs: _objectConfigs,
          objectIdentifier: _objectIdentifier,
          database: _database,
          schema: _schema,
          table: _table,
          objectsSelectionType: _objectsSelectionType,
          oracleSourceConfig: _oracleSourceConfig,
          binaryLogParser: _binaryLogParser,
          logFileDirectories: _logFileDirectories,
          archivedLogDirectory: _archivedLogDirectory,
          onlineLogDirectory: _onlineLogDirectory,
          oracleAsmLogFileAccess: _oracleAsmLogFileAccess,
          cdcStartPosition: _cdcStartPosition,
          logMiner: _logMiner,
          maxConcurrentCdcConnections: _maxConcurrentCdcConnections,
          maxConcurrentFullDumpConnections: _maxConcurrentFullDumpConnections,
          skipFullDump: _skipFullDump,
          postgresDestinationConfig: _postgresDestinationConfig,
          maxConcurrentConnections: _maxConcurrentConnections,
          transactionTimeout: _transactionTimeout,
          dumpParallelLevel: _dumpParallelLevel,
          isNativeLogical: _isNativeLogical,
          maxAdditionalSubscriptions: _maxAdditionalSubscriptions,
          postgresSourceConfig: _postgresSourceConfig,
          sqlserverDestinationConfig: _sqlserverDestinationConfig,
          vm: _vm,
          vmIp: _vmIp,
          vmPort: _vmPort,
          vpc: _vpc,
          backupFilePattern: _backupFilePattern,
          dagConfig: _dagConfig,
          linkedServer: _linkedServer,
          sourceAg: _sourceAg,
          databaseBackups: _databaseBackups,
          encryptionOptions: _encryptionOptions,
          certPath: _certPath,
          pvkPassword: _pvkPassword,
          pvkPath: _pvkPath,
          promoteWhenReady: _promoteWhenReady,
          useDiffBackup: _useDiffBackup,
          sqlserverSourceConfig: _sqlserverSourceConfig,
          ...rest
        } = old;
        return rest;
      },
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
      description:
        "Represents a Database Migration Service migration job object.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a migrationJobs",
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
        params["parent"] = `projects/${projectId}/locations/${
          String(g["location"] ?? "")
        }`;
        const body: Record<string, unknown> = {};
        if (g["cmekKeyName"] !== undefined) {
          body["cmekKeyName"] = g["cmekKeyName"];
        }
        if (g["conversionWorkspace"] !== undefined) {
          body["conversionWorkspace"] = g["conversionWorkspace"];
        }
        if (g["destination"] !== undefined) {
          body["destination"] = g["destination"];
        }
        if (g["destinationDatabase"] !== undefined) {
          body["destinationDatabase"] = g["destinationDatabase"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["dumpFlags"] !== undefined) body["dumpFlags"] = g["dumpFlags"];
        if (g["dumpPath"] !== undefined) body["dumpPath"] = g["dumpPath"];
        if (g["dumpType"] !== undefined) body["dumpType"] = g["dumpType"];
        if (g["filter"] !== undefined) body["filter"] = g["filter"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["mysqlHomogeneousConfig"] !== undefined) {
          body["mysqlHomogeneousConfig"] = g["mysqlHomogeneousConfig"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["objectsConfig"] !== undefined) {
          body["objectsConfig"] = g["objectsConfig"];
        }
        if (g["oracleToPostgresConfig"] !== undefined) {
          body["oracleToPostgresConfig"] = g["oracleToPostgresConfig"];
        }
        if (g["originalMigrationName"] !== undefined) {
          body["originalMigrationName"] = g["originalMigrationName"];
        }
        if (g["performanceConfig"] !== undefined) {
          body["performanceConfig"] = g["performanceConfig"];
        }
        if (g["postgresHomogeneousConfig"] !== undefined) {
          body["postgresHomogeneousConfig"] = g["postgresHomogeneousConfig"];
        }
        if (g["postgresToSqlserverConfig"] !== undefined) {
          body["postgresToSqlserverConfig"] = g["postgresToSqlserverConfig"];
        }
        if (g["reverseSshConnectivity"] !== undefined) {
          body["reverseSshConnectivity"] = g["reverseSshConnectivity"];
        }
        if (g["source"] !== undefined) body["source"] = g["source"];
        if (g["sourceDatabase"] !== undefined) {
          body["sourceDatabase"] = g["sourceDatabase"];
        }
        if (g["sqlserverHomogeneousMigrationJobConfig"] !== undefined) {
          body["sqlserverHomogeneousMigrationJobConfig"] =
            g["sqlserverHomogeneousMigrationJobConfig"];
        }
        if (g["sqlserverToPostgresConfig"] !== undefined) {
          body["sqlserverToPostgresConfig"] = g["sqlserverToPostgresConfig"];
        }
        if (g["state"] !== undefined) body["state"] = g["state"];
        if (g["staticIpConnectivity"] !== undefined) {
          body["staticIpConnectivity"] = g["staticIpConnectivity"];
        }
        if (g["type"] !== undefined) body["type"] = g["type"];
        if (g["vpcPeeringConnectivity"] !== undefined) {
          body["vpcPeeringConnectivity"] = g["vpcPeeringConnectivity"];
        }
        if (g["migrationJobId"] !== undefined) {
          params["migrationJobId"] = String(g["migrationJobId"]);
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
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
          (args.waitForReady ?? true)
            ? {
              "statusField": "state",
              "readyValues": ["RUNNING", "COMPLETED"],
              "failedValues": ["FAILED", "STOPPED"],
            }
            : undefined,
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
      description: "Get a migrationJobs",
      arguments: z.object({
        identifier: z.string().describe("The name of the migrationJobs"),
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
      description: "Update migrationJobs attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific migrationJobs by name (e.g. one discovered by list)",
        ).optional(),
        waitForReady: z.boolean().describe(
          "Wait for the resource to reach a ready state after update (default: true)",
        ).optional(),
      }),
      execute: async (
        args: { identifier?: string; waitForReady?: boolean },
        context: any,
      ) => {
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
        if (g["cmekKeyName"] !== undefined) {
          body["cmekKeyName"] = g["cmekKeyName"];
        }
        if (g["conversionWorkspace"] !== undefined) {
          body["conversionWorkspace"] = g["conversionWorkspace"];
        }
        if (g["destination"] !== undefined) {
          body["destination"] = g["destination"];
        }
        if (g["destinationDatabase"] !== undefined) {
          body["destinationDatabase"] = g["destinationDatabase"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["dumpFlags"] !== undefined) body["dumpFlags"] = g["dumpFlags"];
        if (g["dumpPath"] !== undefined) body["dumpPath"] = g["dumpPath"];
        if (g["dumpType"] !== undefined) body["dumpType"] = g["dumpType"];
        if (g["filter"] !== undefined) body["filter"] = g["filter"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["mysqlHomogeneousConfig"] !== undefined) {
          body["mysqlHomogeneousConfig"] = g["mysqlHomogeneousConfig"];
        }
        if (g["objectsConfig"] !== undefined) {
          body["objectsConfig"] = g["objectsConfig"];
        }
        if (g["oracleToPostgresConfig"] !== undefined) {
          body["oracleToPostgresConfig"] = g["oracleToPostgresConfig"];
        }
        if (g["originalMigrationName"] !== undefined) {
          body["originalMigrationName"] = g["originalMigrationName"];
        }
        if (g["performanceConfig"] !== undefined) {
          body["performanceConfig"] = g["performanceConfig"];
        }
        if (g["postgresHomogeneousConfig"] !== undefined) {
          body["postgresHomogeneousConfig"] = g["postgresHomogeneousConfig"];
        }
        if (g["postgresToSqlserverConfig"] !== undefined) {
          body["postgresToSqlserverConfig"] = g["postgresToSqlserverConfig"];
        }
        if (g["reverseSshConnectivity"] !== undefined) {
          body["reverseSshConnectivity"] = g["reverseSshConnectivity"];
        }
        if (g["source"] !== undefined) body["source"] = g["source"];
        if (g["sourceDatabase"] !== undefined) {
          body["sourceDatabase"] = g["sourceDatabase"];
        }
        if (g["sqlserverHomogeneousMigrationJobConfig"] !== undefined) {
          body["sqlserverHomogeneousMigrationJobConfig"] =
            g["sqlserverHomogeneousMigrationJobConfig"];
        }
        if (g["sqlserverToPostgresConfig"] !== undefined) {
          body["sqlserverToPostgresConfig"] = g["sqlserverToPostgresConfig"];
        }
        if (g["state"] !== undefined) body["state"] = g["state"];
        if (g["staticIpConnectivity"] !== undefined) {
          body["staticIpConnectivity"] = g["staticIpConnectivity"];
        }
        if (g["type"] !== undefined) body["type"] = g["type"];
        if (g["vpcPeeringConnectivity"] !== undefined) {
          body["vpcPeeringConnectivity"] = g["vpcPeeringConnectivity"];
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
          (args.waitForReady ?? true)
            ? {
              "statusField": "state",
              "readyValues": ["RUNNING", "COMPLETED"],
              "failedValues": ["FAILED", "STOPPED"],
            }
            : undefined,
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
      description: "Delete the migrationJobs",
      arguments: z.object({
        identifier: z.string().describe("The name of the migrationJobs"),
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
      description: "Sync migrationJobs state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific migrationJobs by name (e.g. one discovered by list)",
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
      description: "List migrationJobs resources",
      arguments: z.object({
        filter: z.string().describe(
          'Optional. A filter expression that filters migration jobs listed in the response. The expression must specify the field name, a comparison operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The comparison operator must be either =, !=, >, or <. For example, list migration jobs created this year by specifying **createTime %gt; 2020-01-01T00:00:00.000000000Z.** You can also filter nested fields. For example, you could specify **reverseSshConnectivity.vmIp = "1.2.3.4"** to select all migration jobs connecting through the specific SSH tunnel bastion.',
        ).optional(),
        orderBy: z.string().describe(
          'Optional. Sort the results based on the migration job name. Valid values are: "name", "name asc", and "name desc".',
        ).optional(),
        pageSize: z.number().describe(
          "Optional. The maximum number of migration jobs to return. The service may return fewer than this value. If unspecified, at most 50 migration jobs will be returned. The maximum value is 1000; values above 1000 are coerced to 1000.",
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
          "migrationJobs",
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
    demote_destination: {
      description: "demote destination",
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
              "datamigration.projects.locations.migrationJobs.demoteDestination",
            "path": "v1/{+name}:demoteDestination",
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
    fetch_source_objects: {
      description: "fetch source objects",
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
              "datamigration.projects.locations.migrationJobs.fetchSourceObjects",
            "path": "v1/{+name}:fetchSourceObjects",
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
    generate_ssh_script: {
      description: "generate ssh script",
      arguments: z.object({
        vm: z.any().optional(),
        vmCreationConfig: z.any().optional(),
        vmPort: z.any().optional(),
        vmSelectionConfig: z.any().optional(),
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
        params["migrationJob"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["vm"] !== undefined) body["vm"] = args["vm"];
        if (args["vmCreationConfig"] !== undefined) {
          body["vmCreationConfig"] = args["vmCreationConfig"];
        }
        if (args["vmPort"] !== undefined) body["vmPort"] = args["vmPort"];
        if (args["vmSelectionConfig"] !== undefined) {
          body["vmSelectionConfig"] = args["vmSelectionConfig"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "datamigration.projects.locations.migrationJobs.generateSshScript",
            "path": "v1/{+migrationJob}:generateSshScript",
            "httpMethod": "POST",
            "parameterOrder": ["migrationJob"],
            "parameters": {
              "migrationJob": { "location": "path", "required": true },
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
    generate_tcp_proxy_script: {
      description: "generate tcp proxy script",
      arguments: z.object({
        vmMachineType: z.any().optional(),
        vmName: z.any().optional(),
        vmSubnet: z.any().optional(),
        vmZone: z.any().optional(),
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
        params["migrationJob"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["vmMachineType"] !== undefined) {
          body["vmMachineType"] = args["vmMachineType"];
        }
        if (args["vmName"] !== undefined) body["vmName"] = args["vmName"];
        if (args["vmSubnet"] !== undefined) body["vmSubnet"] = args["vmSubnet"];
        if (args["vmZone"] !== undefined) body["vmZone"] = args["vmZone"];
        const result = await createResource(
          baseUrl,
          {
            "id":
              "datamigration.projects.locations.migrationJobs.generateTcpProxyScript",
            "path": "v1/{+migrationJob}:generateTcpProxyScript",
            "httpMethod": "POST",
            "parameterOrder": ["migrationJob"],
            "parameters": {
              "migrationJob": { "location": "path", "required": true },
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
            "id": "datamigration.projects.locations.migrationJobs.getIamPolicy",
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
    promote: {
      description: "promote",
      arguments: z.object({
        objectsFilter: z.any().optional(),
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
        if (args["objectsFilter"] !== undefined) {
          body["objectsFilter"] = args["objectsFilter"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "datamigration.projects.locations.migrationJobs.promote",
            "path": "v1/{+name}:promote",
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
    restart: {
      description: "restart",
      arguments: z.object({
        objectsFilter: z.any().optional(),
        restartFailedObjects: z.any().optional(),
        skipValidation: z.any().optional(),
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
        if (args["objectsFilter"] !== undefined) {
          body["objectsFilter"] = args["objectsFilter"];
        }
        if (args["restartFailedObjects"] !== undefined) {
          body["restartFailedObjects"] = args["restartFailedObjects"];
        }
        if (args["skipValidation"] !== undefined) {
          body["skipValidation"] = args["skipValidation"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "datamigration.projects.locations.migrationJobs.restart",
            "path": "v1/{+name}:restart",
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
    resume: {
      description: "resume",
      arguments: z.object({
        skipValidation: z.any().optional(),
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
        if (args["skipValidation"] !== undefined) {
          body["skipValidation"] = args["skipValidation"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "datamigration.projects.locations.migrationJobs.resume",
            "path": "v1/{+name}:resume",
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
            "id": "datamigration.projects.locations.migrationJobs.setIamPolicy",
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
    start: {
      description: "start",
      arguments: z.object({
        skipValidation: z.any().optional(),
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
        if (args["skipValidation"] !== undefined) {
          body["skipValidation"] = args["skipValidation"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "datamigration.projects.locations.migrationJobs.start",
            "path": "v1/{+name}:start",
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
    stop: {
      description: "stop",
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
            "id": "datamigration.projects.locations.migrationJobs.stop",
            "path": "v1/{+name}:stop",
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
            "id":
              "datamigration.projects.locations.migrationJobs.testIamPermissions",
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
    verify: {
      description: "verify",
      arguments: z.object({
        migrationJob: z.any().optional(),
        updateMask: z.any().optional(),
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
        if (args["migrationJob"] !== undefined) {
          body["migrationJob"] = args["migrationJob"];
        }
        if (args["updateMask"] !== undefined) {
          body["updateMask"] = args["updateMask"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "datamigration.projects.locations.migrationJobs.verify",
            "path": "v1/{+name}:verify",
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
  },
};
