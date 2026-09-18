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

// Auto-generated extension model for @swamp/gcp/sqladmin/instances
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud SQL Admin Instances.
 *
 * A Cloud SQL instance resource.
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

const BASE_URL = "https://sqladmin.googleapis.com/";

const GET_CONFIG = {
  "id": "sql.instances.get",
  "path": "v1/projects/{project}/instances/{instance}",
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
    "location": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "sql.instances.insert",
  "path": "v1/projects/{project}/instances",
  "httpMethod": "POST",
  "parameterOrder": [
    "project",
  ],
  "parameters": {
    "location": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "sql.instances.update",
  "path": "v1/projects/{project}/instances/{instance}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "project",
    "instance",
  ],
  "parameters": {
    "instance": {
      "location": "path",
      "required": true,
    },
    "location": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "sql.instances.delete",
  "path": "v1/projects/{project}/instances/{instance}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "project",
    "instance",
  ],
  "parameters": {
    "enableFinalBackup": {
      "location": "query",
    },
    "finalBackupDescription": {
      "location": "query",
    },
    "finalBackupExpiryTime": {
      "location": "query",
    },
    "finalBackupTtlDays": {
      "location": "query",
    },
    "instance": {
      "location": "path",
      "required": true,
    },
    "location": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "sql.instances.list",
  "path": "v1/projects/{project}/instances",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
  ],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "location": {
      "location": "query",
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
  scopes: z.string().describe(
    "Comma-separated OAuth scopes to request when minting access tokens via gcloud. Defaults to the API's Discovery Document scopes.",
  ).optional(),
  quotaProject: z.string().describe(
    "GCP project ID for quota and billing attribution; sets the x-goog-user-project header. Overrides GOOGLE_CLOUD_QUOTA_PROJECT environment variable. Required for APIs like Cloud Identity when using user credentials.",
  ).optional(),
  apiEndpoint: z.string().describe(
    "Custom API endpoint for emulators; overrides GCP_API_ENDPOINT environment variable. Defaults to the service's production URL.",
  ).optional(),
  backendType: z.enum([
    "SQL_BACKEND_TYPE_UNSPECIFIED",
    "FIRST_GEN",
    "SECOND_GEN",
    "EXTERNAL",
  ]).describe(
    "The backend type. `SECOND_GEN`: Cloud SQL database instance. `EXTERNAL`: A database server that is not managed by Google. This property is read-only; use the `tier` property in the `settings` object to determine the database type.",
  ).optional(),
  connectionName: z.string().describe(
    "Connection name of the Cloud SQL instance used in connection strings.",
  ).optional(),
  databaseCenterIntegrationEnabled: z.boolean().describe(
    "Optional. If true, instance metadata is sent to the Database Center. If false, instance metadata is not sent to the Database Center.",
  ).optional(),
  databaseVersion: z.enum([
    "SQL_DATABASE_VERSION_UNSPECIFIED",
    "MYSQL_5_1",
    "MYSQL_5_5",
    "MYSQL_5_6",
    "MYSQL_5_7",
    "MYSQL_8_0",
    "MYSQL_8_0_18",
    "MYSQL_8_0_26",
    "MYSQL_8_0_27",
    "MYSQL_8_0_28",
    "MYSQL_8_0_29",
    "MYSQL_8_0_30",
    "MYSQL_8_0_31",
    "MYSQL_8_0_32",
    "MYSQL_8_0_33",
    "MYSQL_8_0_34",
    "MYSQL_8_0_35",
    "MYSQL_8_0_36",
    "MYSQL_8_0_37",
    "MYSQL_8_0_39",
    "MYSQL_8_0_40",
    "MYSQL_8_0_41",
    "MYSQL_8_0_42",
    "MYSQL_8_0_43",
    "MYSQL_8_0_44",
    "MYSQL_8_0_45",
    "MYSQL_8_0_46",
    "MYSQL_8_4",
    "MYSQL_9_7",
    "SQLSERVER_2017_STANDARD",
    "SQLSERVER_2017_ENTERPRISE",
    "SQLSERVER_2017_EXPRESS",
    "SQLSERVER_2017_WEB",
    "POSTGRES_9_6",
    "POSTGRES_10",
    "POSTGRES_11",
    "POSTGRES_12",
    "POSTGRES_13",
    "POSTGRES_14",
    "POSTGRES_15",
    "POSTGRES_16",
    "POSTGRES_17",
    "POSTGRES_18",
    "POSTGRES_19",
    "POSTGRES_20",
    "SQLSERVER_2019_STANDARD",
    "SQLSERVER_2019_ENTERPRISE",
    "SQLSERVER_2019_EXPRESS",
    "SQLSERVER_2019_WEB",
    "SQLSERVER_2022_STANDARD",
    "SQLSERVER_2022_ENTERPRISE",
    "SQLSERVER_2022_EXPRESS",
    "SQLSERVER_2022_WEB",
    "SQLSERVER_2025_STANDARD",
    "SQLSERVER_2025_ENTERPRISE",
    "SQLSERVER_2025_EXPRESS",
  ]).describe(
    "The database engine type and version. The `databaseVersion` field cannot be changed after instance creation.",
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
  }).describe("Disk encryption configuration specific to an instance.")
    .optional(),
  diskEncryptionStatus: z.object({
    kind: z.string().describe("This is always `sql#diskEncryptionStatus`.")
      .optional(),
    kmsKeyVersionName: z.string().describe(
      "KMS key version used to encrypt the Cloud SQL instance resource",
    ).optional(),
  }).describe("Disk encryption status specific to an instance.").optional(),
  failoverReplica: z.object({
    available: z.boolean().describe(
      "The availability status of the failover replica. A false status indicates that the failover replica is out of sync. The primary instance can only failover to the failover replica when the status is true.",
    ).optional(),
    name: z.string().describe(
      "The name of the failover replica. If specified at instance creation, a failover replica is created for the instance. The name doesn't include the project ID.",
    ).optional(),
  }).describe("The name and status of the failover replica.").optional(),
  gceZone: z.string().describe(
    "The Compute Engine zone that the instance is currently serving from. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary zone. WARNING: Changing this might restart the instance.",
  ).optional(),
  geminiConfig: z.object({
    activeQueryEnabled: z.boolean().describe(
      "Output only. Whether the active query is enabled.",
    ).optional(),
    entitled: z.boolean().describe("Output only. Whether Gemini is enabled.")
      .optional(),
    flagRecommenderEnabled: z.boolean().describe(
      "Output only. Whether the flag recommender is enabled.",
    ).optional(),
    googleVacuumMgmtEnabled: z.boolean().describe(
      "Output only. Whether the vacuum management is enabled.",
    ).optional(),
    indexAdvisorEnabled: z.boolean().describe(
      "Output only. Whether the index advisor is enabled.",
    ).optional(),
    oomSessionCancelEnabled: z.boolean().describe(
      "Output only. Whether canceling the out-of-memory (OOM) session is enabled.",
    ).optional(),
  }).describe("Gemini instance configuration.").optional(),
  includeReplicasForMajorVersionUpgrade: z.boolean().describe(
    "Input only. Determines whether an in-place major version upgrade of replicas happens when an in-place major version upgrade of a primary instance is initiated.",
  ).optional(),
  instanceType: z.enum([
    "SQL_INSTANCE_TYPE_UNSPECIFIED",
    "CLOUD_SQL_INSTANCE",
    "ON_PREMISES_INSTANCE",
    "READ_REPLICA_INSTANCE",
    "READ_POOL_INSTANCE",
    "GREEN_INSTANCE",
  ]).describe("The instance type.").optional(),
  ipAddresses: z.array(z.object({
    ipAddress: z.string().describe("The IP address assigned.").optional(),
    timeToRetire: z.string().describe(
      "The due time for this IP to be retired in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. This field is only available when the IP is scheduled to be retired.",
    ).optional(),
    type: z.enum([
      "SQL_IP_ADDRESS_TYPE_UNSPECIFIED",
      "PRIMARY",
      "OUTGOING",
      "PRIVATE",
      "MIGRATED_1ST_GEN",
    ]).describe(
      "The type of this IP address. A `PRIMARY` address is a public address that can accept incoming connections. A `PRIVATE` address is a private address that can accept incoming connections. An `OUTGOING` address is the source address of connections originating from the instance, if supported.",
    ).optional(),
  })).describe("The assigned IP addresses for the instance.").optional(),
  maintenanceVersion: z.string().describe(
    "The current software version on the instance.",
  ).optional(),
  masterInstanceName: z.string().describe(
    "The name of the instance which will act as primary in the replication setup.",
  ).optional(),
  name: z.string().describe(
    "Name of the Cloud SQL instance. This does not include the project ID.",
  ).optional(),
  nodeCount: z.number().int().describe(
    "The number of read pool nodes in a read pool.",
  ).optional(),
  onPremisesConfiguration: z.object({
    caCertificate: z.string().describe(
      "PEM representation of the trusted CA's x509 certificate.",
    ).optional(),
    clientCertificate: z.string().describe(
      "PEM representation of the replica's x509 certificate.",
    ).optional(),
    clientKey: z.string().describe(
      "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
    ).optional(),
    dmsManaged: z.boolean().describe(
      "Output only. Indicates whether the resource is managed by Database Migration Service.",
    ).optional(),
    dumpFilePath: z.string().describe(
      "The dump file to create the Cloud SQL replica.",
    ).optional(),
    hostPort: z.string().describe(
      "The host and port of the on-premises instance in host:port format",
    ).optional(),
    kind: z.string().describe("This is always `sql#onPremisesConfiguration`.")
      .optional(),
    password: z.string().describe(
      "The password for connecting to on-premises instance.",
    ).optional(),
    selectedObjects: z.array(z.object({
      database: z.string().describe(
        "Required. The name of the database to migrate.",
      ).optional(),
    })).describe(
      "Optional. A list of objects that the user selects for replication from an external source instance.",
    ).optional(),
    sourceInstance: z.object({
      name: z.string().describe(
        "The name of the Cloud SQL instance being referenced. This does not include the project ID.",
      ).optional(),
      project: z.string().describe(
        "The project ID of the Cloud SQL instance being referenced. The default is the same project ID as the instance references it.",
      ).optional(),
      region: z.string().describe(
        "The region of the Cloud SQL instance being referenced.",
      ).optional(),
    }).describe(
      "The reference to Cloud SQL instance if the source is Cloud SQL.",
    ).optional(),
    sslOption: z.enum([
      "SSL_OPTION_UNSPECIFIED",
      "DISABLE",
      "REQUIRE",
      "VERIFY_CA",
    ]).describe(
      "Optional. SSL option for replica connection to the on-premises source.",
    ).optional(),
    username: z.string().describe(
      "The username for connecting to on-premises instance.",
    ).optional(),
  }).describe("Configuration specific to on-premises instances.").optional(),
  outOfDiskReport: z.object({
    sqlMinRecommendedIncreaseSizeGb: z.number().int().describe(
      "The minimum recommended increase size in GigaBytes This field is consumed by the frontend * Writers: * the proactive database wellness job for OOD. * Readers:",
    ).optional(),
    sqlOutOfDiskState: z.enum([
      "SQL_OUT_OF_DISK_STATE_UNSPECIFIED",
      "NORMAL",
      "SOFT_SHUTDOWN",
    ]).describe(
      "This field represents the state generated by the proactive database wellness job for OutOfDisk issues. * Writers: * the proactive database wellness job for OOD. * Readers: * the proactive database wellness job",
    ).optional(),
  }).describe(
    "This field represents the report generated by the proactive database wellness job for OutOfDisk issues. * Writers: * the proactive database wellness job for OOD. * Readers: * the proactive database wellness job",
  ).optional(),
  project: z.string().describe(
    "The project ID of the project containing the Cloud SQL instance. The Google apps domain is prefixed if applicable.",
  ).optional(),
  region: z.string().describe(
    "The geographical region of the Cloud SQL instance. It can be one of the [regions](https://cloud.google.com/sql/docs/mysql/locations#location-r) where Cloud SQL operates: For example, `asia-east1`, `europe-west1`, and `us-central1`. The default value is `us-central1`.",
  ).optional(),
  replicaConfiguration: z.object({
    cascadableReplica: z.boolean().describe(
      "Optional. Specifies if a SQL Server replica is a cascadable replica. A cascadable replica is a SQL Server cross region replica that supports replica(s) under it.",
    ).optional(),
    failoverTarget: z.boolean().describe(
      "Specifies if the replica is the failover target. If the field is set to `true`, the replica will be designated as a failover replica. In case the primary instance fails, the replica instance will be promoted as the new primary instance. Only one replica can be specified as failover target, and the replica has to be in different zone with the primary instance.",
    ).optional(),
    kind: z.string().describe("This is always `sql#replicaConfiguration`.")
      .optional(),
    mysqlReplicaConfiguration: z.object({
      caCertificate: z.string().describe(
        "PEM representation of the trusted CA's x509 certificate.",
      ).optional(),
      clientCertificate: z.string().describe(
        "PEM representation of the replica's x509 certificate.",
      ).optional(),
      clientKey: z.string().describe(
        "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
      ).optional(),
      connectRetryInterval: z.number().int().describe(
        "Seconds to wait between connect retries. MySQL's default is 60 seconds.",
      ).optional(),
      dumpFilePath: z.string().describe(
        "Path to a SQL dump file in Google Cloud Storage from which the replica instance is to be created. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported. Dumps have the binlog co-ordinates from which replication begins. This can be accomplished by setting --master-data to 1 when using mysqldump.",
      ).optional(),
      kind: z.string().describe(
        "This is always `sql#mysqlReplicaConfiguration`.",
      ).optional(),
      masterHeartbeatPeriod: z.string().describe(
        "Interval in milliseconds between replication heartbeats.",
      ).optional(),
      password: z.string().describe(
        "The password for the replication connection.",
      ).optional(),
      sslCipher: z.string().describe(
        "A list of permissible ciphers to use for SSL encryption.",
      ).optional(),
      username: z.string().describe(
        "The username for the replication connection.",
      ).optional(),
      verifyServerCertificate: z.boolean().describe(
        "Whether or not to check the primary instance's Common Name value in the certificate that it sends during the SSL handshake.",
      ).optional(),
    }).describe(
      "MySQL specific configuration when replicating from a MySQL on-premises primary instance. Replication configuration information such as the username, password, certificates, and keys are not stored in the instance metadata. The configuration information is used only to set up the replication connection and is stored by MySQL in a file named `master.info` in the data directory.",
    ).optional(),
  }).describe("Configuration specific to failover replicas and read replicas.")
    .optional(),
  replicaNames: z.array(z.string()).describe("The replicas of the instance.")
    .optional(),
  replicationCluster: z.object({
    drReplica: z.boolean().describe(
      "Output only. Read-only field that indicates whether the replica is a DR replica. This field is not set if the instance is a primary instance.",
    ).optional(),
    failoverDrReplicaName: z.string().describe(
      "Optional. If the instance is a primary instance, then this field identifies the disaster recovery (DR) replica. A DR replica is an optional configuration for Enterprise Plus edition instances. If the instance is a read replica, then the field is not set. Set this field to a replica name to designate a DR replica for a primary instance. Remove the replica name to remove the DR replica designation.",
    ).optional(),
    psaWriteEndpoint: z.string().describe(
      "Output only. If set, this field indicates this instance has a private service access (PSA) DNS endpoint that is pointing to the primary instance of the cluster. If this instance is the primary, then the DNS endpoint points to this instance. After a switchover or replica failover operation, this DNS endpoint points to the promoted instance. This is a read-only field, returned to the user as information. This field can exist even if a standalone instance doesn't have a DR replica yet or the DR replica is deleted.",
    ).optional(),
  }).describe(
    "Optional. A primary instance and disaster recovery (DR) replica pair. A DR replica is a cross-region replica that you designate for failover in the event that the primary instance experiences regional failure. Applicable to MySQL and PostgreSQL.",
  ).optional(),
  rootPassword: z.string().describe(
    "Initial root password. Use only on creation. You must set root passwords before you can connect to PostgreSQL instances.",
  ).optional(),
  satisfiesPzs: z.boolean().describe(
    "This status indicates whether the instance satisfies PZS. The status is reserved for future use.",
  ).optional(),
  scheduledMaintenance: z.object({
    canDefer: z.boolean().optional(),
    canReschedule: z.boolean().describe(
      "If the scheduled maintenance can be rescheduled.",
    ).optional(),
    scheduleDeadlineTime: z.string().describe(
      "Maintenance cannot be rescheduled to start beyond this deadline.",
    ).optional(),
    startTime: z.string().describe(
      "The start time of any upcoming scheduled maintenance for this instance.",
    ).optional(),
  }).describe(
    "The start time of any upcoming scheduled maintenance for this instance.",
  ).optional(),
  secondaryGceZone: z.string().describe(
    "The Compute Engine zone that the failover instance is currently serving from for a regional instance. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary/failover zone.",
  ).optional(),
  serverCaCert: z.object({
    cert: z.string().describe("PEM representation.").optional(),
    certSerialNumber: z.string().describe(
      "Serial number, as extracted from the certificate.",
    ).optional(),
    commonName: z.string().describe(
      "User supplied name. Constrained to [a-zA-Z.-_ ]+.",
    ).optional(),
    createTime: z.string().describe(
      "The time when the certificate was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`",
    ).optional(),
    expirationTime: z.string().describe(
      "The time when the certificate expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
    ).optional(),
    instance: z.string().describe("Name of the database instance.").optional(),
    kind: z.string().describe("This is always `sql#sslCert`.").optional(),
    selfLink: z.string().describe("The URI of this resource.").optional(),
    sha1Fingerprint: z.string().describe("Sha1 Fingerprint.").optional(),
  }).describe("SSL configuration.").optional(),
  serviceAccountEmailAddress: z.string().describe(
    "The service account email address assigned to the instance.\\This property is read-only.",
  ).optional(),
  settings: z.object({
    acceleratedReplicaMode: z.boolean().describe(
      "Optional. Whether the replica is in accelerated mode. This feature is in private preview and requires allowlisting to take effect.",
    ).optional(),
    activationPolicy: z.enum([
      "SQL_ACTIVATION_POLICY_UNSPECIFIED",
      "ALWAYS",
      "NEVER",
      "ON_DEMAND",
    ]).describe(
      "The activation policy specifies when the instance is activated; it is applicable only when the instance state is RUNNABLE. Valid values: * `ALWAYS`: The instance is on, and remains so even in the absence of connection requests. * `NEVER`: The instance is off; it is not activated, even if a connection request arrives.",
    ).optional(),
    activeDirectoryConfig: z.object({
      adminCredentialSecretName: z.string().describe(
        "Optional. The secret manager key storing the administrator credential. (e.g., projects/{project}/secrets/{secret}).",
      ).optional(),
      dnsServers: z.array(z.string()).describe(
        "Optional. Domain controller IPv4 addresses used to bootstrap Active Directory.",
      ).optional(),
      domain: z.string().describe(
        "The name of the domain (e.g., mydomain.com).",
      ).optional(),
      kind: z.string().describe("This is always sql#activeDirectoryConfig.")
        .optional(),
      mode: z.enum([
        "ACTIVE_DIRECTORY_MODE_UNSPECIFIED",
        "MANAGED_ACTIVE_DIRECTORY",
        "SELF_MANAGED_ACTIVE_DIRECTORY",
        "CUSTOMER_MANAGED_ACTIVE_DIRECTORY",
      ]).describe("Optional. The mode of the Active Directory configuration.")
        .optional(),
      organizationalUnit: z.string().describe(
        "Optional. The organizational unit distinguished name. This is the full hierarchical path to the organizational unit.",
      ).optional(),
    }).describe(
      "Active Directory configuration, relevant only for Cloud SQL for SQL Server.",
    ).optional(),
    advancedMachineFeatures: z.object({
      threadsPerCore: z.number().int().describe(
        "The number of threads per physical core.",
      ).optional(),
    }).describe(
      "Specifies advanced machine configuration for the instances relevant only for SQL Server.",
    ).optional(),
    authorizedGaeApplications: z.array(z.string()).describe(
      "The App Engine app IDs that can access this instance. (Deprecated) Applied to First Generation instances only.",
    ).optional(),
    autoUpgradeEnabled: z.boolean().describe(
      "Optional. Cloud SQL for MySQL auto-upgrade configuration. When this parameter is set to true, auto-upgrade is enabled for MySQL 8.0 minor versions. The MySQL version must be 8.0.35 or higher.",
    ).optional(),
    availabilityType: z.enum([
      "SQL_AVAILABILITY_TYPE_UNSPECIFIED",
      "ZONAL",
      "REGIONAL",
    ]).describe(
      "Availability type. Potential values: * `ZONAL`: The instance serves data from only one zone. Outages in that zone affect data accessibility. * `REGIONAL`: The instance can serve data from more than one zone in a region (it is highly available)./ For more information, see [Overview of the High Availability Configuration](https://cloud.google.com/sql/docs/mysql/high-availability).",
    ).optional(),
    backupConfiguration: z.object({
      backupRetentionSettings: z.object({
        retainedBackups: z.number().int().describe(
          "Depending on the value of retention_unit, this is used to determine if a backup needs to be deleted. If retention_unit is 'COUNT', we will retain this many backups.",
        ).optional(),
        retentionUnit: z.enum(["RETENTION_UNIT_UNSPECIFIED", "COUNT"]).describe(
          "The unit that 'retained_backups' represents.",
        ).optional(),
      }).describe("Backup retention settings.").optional(),
      backupTier: z.enum([
        "BACKUP_TIER_UNSPECIFIED",
        "STANDARD",
        "ADVANCED",
        "ENHANCED",
      ]).describe(
        "Output only. Backup tier that manages the backups for the instance.",
      ).optional(),
      binaryLogEnabled: z.boolean().describe(
        "(MySQL only) Whether binary log is enabled. If backup configuration is disabled, binarylog must be disabled as well.",
      ).optional(),
      enabled: z.boolean().describe("Whether this configuration is enabled.")
        .optional(),
      kind: z.string().describe("This is always `sql#backupConfiguration`.")
        .optional(),
      location: z.string().describe("Location of the backup").optional(),
      pointInTimeRecoveryEnabled: z.boolean().describe(
        "Whether point in time recovery is enabled.",
      ).optional(),
      replicationLogArchivingEnabled: z.boolean().describe(
        "Optional. Deprecated: replication_log_archiving_enabled is deprecated and will be removed from a future version of the API. Use point_in_time_recovery_enabled instead.",
      ).optional(),
      startTime: z.string().describe(
        "Start time for the daily backup configuration in UTC timezone in the 24 hour format - `HH:MM`.",
      ).optional(),
      transactionLogRetentionDays: z.number().int().describe(
        "The number of days of transaction logs we retain for point in time restore, from 1-7.",
      ).optional(),
      transactionalLogStorageState: z.enum([
        "TRANSACTIONAL_LOG_STORAGE_STATE_UNSPECIFIED",
        "DISK",
        "SWITCHING_TO_CLOUD_STORAGE",
        "SWITCHED_TO_CLOUD_STORAGE",
        "CLOUD_STORAGE",
      ]).describe(
        "Output only. This value contains the storage location of transactional logs used to perform point-in-time recovery (PITR) for the database.",
      ).optional(),
    }).describe("The daily backup configuration for the instance.").optional(),
    collation: z.string().describe("The name of server Instance collation.")
      .optional(),
    connectionPoolConfig: z.object({
      connectionPoolingEnabled: z.boolean().describe(
        "Whether managed connection pooling is enabled.",
      ).optional(),
      flags: z.array(z.object({
        name: z.string().describe("Required. The name of the flag.").optional(),
        value: z.string().describe(
          "Required. The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.",
        ).optional(),
      })).describe("Optional. List of connection pool configuration flags.")
        .optional(),
      poolerCount: z.number().int().describe(
        "Output only. Number of connection poolers.",
      ).optional(),
    }).describe(
      "Optional. The managed connection pooling configuration for the instance.",
    ).optional(),
    connectorEnforcement: z.enum([
      "CONNECTOR_ENFORCEMENT_UNSPECIFIED",
      "NOT_REQUIRED",
      "REQUIRED",
    ]).describe(
      "Specifies if connections must use Cloud SQL connectors. Option values include the following: `NOT_REQUIRED` (Cloud SQL instances can be connected without Cloud SQL Connectors) and `REQUIRED` (Only allow connections that use Cloud SQL Connectors). Note that using REQUIRED disables all existing authorized networks. If this field is not specified when creating a new instance, NOT_REQUIRED is used. If this field is not specified when patching or updating an existing instance, it is left unchanged in the instance.",
    ).optional(),
    crashSafeReplicationEnabled: z.boolean().describe(
      "Configuration specific to read replica instances. Indicates whether database flags for crash-safe replication are enabled. This property was only applicable to First Generation instances.",
    ).optional(),
    dataApiAccess: z.enum([
      "DATA_API_ACCESS_UNSPECIFIED",
      "DISALLOW_DATA_API",
      "ALLOW_DATA_API",
    ]).describe(
      "This parameter controls whether to allow using ExecuteSql API to connect to the instance. Not allowed by default.",
    ).optional(),
    dataCacheConfig: z.object({
      dataCacheEnabled: z.boolean().describe(
        "Whether data cache is enabled for the instance.",
      ).optional(),
    }).describe("Configuration for data cache.").optional(),
    dataDiskProvisionedIops: z.string().describe(
      "Optional. Provisioned number of I/O operations per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
    ).optional(),
    dataDiskProvisionedThroughput: z.string().describe(
      "Optional. Provisioned throughput measured in MiB per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
    ).optional(),
    dataDiskSizeGb: z.string().describe(
      "The size of data disk, in GB. The data disk size minimum is 10GB.",
    ).optional(),
    dataDiskType: z.enum([
      "SQL_DATA_DISK_TYPE_UNSPECIFIED",
      "PD_SSD",
      "PD_HDD",
      "OBSOLETE_LOCAL_SSD",
      "HYPERDISK_BALANCED",
    ]).describe(
      "The type of data disk: `PD_SSD` (default) or `PD_HDD`. Not used for First Generation instances.",
    ).optional(),
    databaseFlags: z.array(z.object({
      name: z.string().describe(
        "The name of the flag. These flags are passed at instance startup, so include both server options and system variables. Flags are specified with underscores, not hyphens. For more information, see [Configuring Database Flags](https://cloud.google.com/sql/docs/mysql/flags) in the Cloud SQL documentation.",
      ).optional(),
      value: z.string().describe(
        "The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.",
      ).optional(),
    })).describe("The database flags passed to the instance at startup.")
      .optional(),
    databaseReplicationEnabled: z.boolean().describe(
      "Configuration specific to read replica instances. Indicates whether replication is enabled or not. WARNING: Changing this restarts the instance.",
    ).optional(),
    deletionProtectionEnabled: z.boolean().describe(
      "Configuration to protect against accidental instance deletion.",
    ).optional(),
    denyMaintenancePeriods: z.array(z.object({
      endDate: z.string().describe(
        '"deny maintenance period" end date. If the year of the end date is empty, the year of the start date also must be empty. In this case, it means the no maintenance interval recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01',
      ).optional(),
      startDate: z.string().describe(
        '"deny maintenance period" start date. If the year of the start date is empty, the year of the end date also must be empty. In this case, it means the deny maintenance period recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01',
      ).optional(),
      time: z.string().describe(
        'Time in UTC when the "deny maintenance period" starts on start_date and ends on end_date. The time is in format: HH:mm:SS, i.e., 00:00:00',
      ).optional(),
    })).describe("Deny maintenance periods").optional(),
    edition: z.enum([
      "EDITION_UNSPECIFIED",
      "ENTERPRISE",
      "ENTERPRISE_PLUS",
      "DEVELOPER",
    ]).describe("Optional. The edition type of the Cloud SQL instance.")
      .optional(),
    enableDataplexIntegration: z.boolean().describe(
      "Optional. By default, Cloud SQL instances have schema extraction disabled for Dataplex. When this parameter is set to true, schema extraction for Dataplex on Cloud SQL instances is activated.",
    ).optional(),
    enableGoogleMlIntegration: z.boolean().describe(
      "Optional. When this parameter is set to true, Cloud SQL instances can connect to Vertex AI to pass requests for real-time predictions and insights to the AI. The default value is false. This applies only to Cloud SQL for MySQL and Cloud SQL for PostgreSQL instances.",
    ).optional(),
    entraidConfig: z.object({
      applicationId: z.string().describe(
        "Optional. The application ID for the Entra ID configuration.",
      ).optional(),
      kind: z.string().describe(
        "Output only. This is always sql#sqlServerEntraIdConfig",
      ).optional(),
      tenantId: z.string().describe(
        "Optional. The tenant ID for the Entra ID configuration.",
      ).optional(),
    }).describe(
      "Optional. The Microsoft Entra ID configuration for the SQL Server instance.",
    ).optional(),
    finalBackupConfig: z.object({
      enabled: z.boolean().describe(
        "Whether the final backup is enabled for the instance.",
      ).optional(),
      retentionDays: z.number().int().describe(
        "The number of days to retain the final backup after the instance deletion. The final backup will be purged at (time_of_instance_deletion + retention_days).",
      ).optional(),
    }).describe("Optional. The final backup configuration for the instance.")
      .optional(),
    insightsConfig: z.object({
      enhancedQueryInsightsEnabled: z.boolean().describe(
        "Optional. Whether enhanced query insights feature is enabled.",
      ).optional(),
      queryInsightsEnabled: z.boolean().describe(
        "Whether Query Insights feature is enabled.",
      ).optional(),
      queryPlansPerMinute: z.number().int().describe(
        "Number of query execution plans captured by Insights per minute for all queries combined. Default is 5.",
      ).optional(),
      queryStringLength: z.number().int().describe(
        "Maximum query length stored in bytes. Default value: 1024 bytes. Range: 256-4500 bytes. Query lengths greater than this field value will be truncated to this value. When unset, query length will be the default value. Changing query length will restart the database.",
      ).optional(),
      recordApplicationTags: z.boolean().describe(
        "Whether Query Insights will record application tags from query when enabled.",
      ).optional(),
      recordClientAddress: z.boolean().describe(
        "Whether Query Insights will record client address when enabled.",
      ).optional(),
    }).describe("Insights configuration, for now relevant only for Postgres.")
      .optional(),
    ipConfiguration: z.object({
      allocatedIpRange: z.string().describe(
        'The name of the allocated ip range for the private ip Cloud SQL instance. For example: "google-managed-services-default". If set, the instance ip will be created in the allocated range. The range name must comply with [RFC 1035](https://tools.ietf.org/html/rfc1035). Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?.`',
      ).optional(),
      authorizedNetworks: z.array(z.object({
        expirationTime: z.string().describe(
          "The time when this access control entry expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
        ).optional(),
        kind: z.string().describe("This is always `sql#aclEntry`.").optional(),
        name: z.string().describe("Optional. A label to identify this entry.")
          .optional(),
        value: z.string().describe(
          "The allowlisted value for the access control list.",
        ).optional(),
      })).describe(
        "The list of external networks that are allowed to connect to the instance using the IP. In 'CIDR' notation, also known as 'slash' notation (for example: `157.197.200.0/24`).",
      ).optional(),
      customSubjectAlternativeNames: z.array(z.string()).describe(
        "Optional. Custom Subject Alternative Name(SAN)s for a Cloud SQL instance.",
      ).optional(),
      enablePrivatePathForGoogleCloudServices: z.boolean().describe(
        "Controls connectivity to private IP instances from Google services, such as BigQuery.",
      ).optional(),
      ipv4Enabled: z.boolean().describe(
        "Whether the instance is assigned a public IP address or not.",
      ).optional(),
      privateNetwork: z.string().describe(
        "The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `/projects/myProject/global/networks/default`. This setting can be updated, but it cannot be removed after it is set.",
      ).optional(),
      pscConfig: z.object({
        allowedConsumerProjects: z.array(z.string()).describe(
          "Optional. The list of consumer projects that are allow-listed for PSC connections to this instance. This instance can be connected to with PSC from any network in these projects. Each consumer project in this list may be represented by a project number (numeric) or by a project id (alphanumeric).",
        ).optional(),
        networkAttachmentUri: z.string().describe(
          "Optional. The network attachment of the consumer network that the Private Service Connect enabled Cloud SQL instance is authorized to connect using the PSC interface. format: projects/PROJECT/regions/REGION/networkAttachments/ID",
        ).optional(),
        pscAutoConnectionPolicyEnabled: z.boolean().describe(
          "Optional. Whether to set up the PSC service connection policy automatically.",
        ).optional(),
        pscAutoConnections: z.array(z.object({
          consumerNetwork: z.unknown().describe(
            "Optional. The consumer network of this consumer endpoint. This must be a resource path that includes both the host project and the network name. For example, `projects/project1/global/networks/network1`. The consumer host project of this network might be different from the consumer service project.",
          ).optional(),
          consumerNetworkStatus: z.unknown().describe(
            "The connection policy status of the consumer network.",
          ).optional(),
          consumerProject: z.unknown().describe(
            "Optional. This is the project ID of consumer service project of this consumer endpoint. This is only applicable if `consumer_network` is a shared VPC network.",
          ).optional(),
          instanceAutoDnsStatus: z.unknown().describe(
            "Output only. The status of automated DNS provisioning.",
          ).optional(),
          ipAddress: z.unknown().describe(
            "The IP address of the consumer endpoint.",
          ).optional(),
          serviceConnectionPolicy: z.unknown().describe(
            "Output only. The service connection policy created automatically for the consumer network when `psc_auto_connection_policy_enabled` is true. It is in the format of: `projects/{project}/regions/{region}/serviceConnectionPolicies/{policy_id}` The `policy_id` is in format of `$NETWORK-$RANDOM`.",
          ).optional(),
          serviceConnectionPolicyCreationResult: z.unknown().describe(
            "Output only. The status of service connection policy creation.",
          ).optional(),
          status: z.unknown().describe(
            "The connection status of the consumer endpoint.",
          ).optional(),
          writeEndpointAutoDnsStatus: z.unknown().describe(
            "Output only. The status of automated DNS provisioning for the write endpoint.",
          ).optional(),
        })).describe(
          "Optional. The list of settings for requested Private Service Connect consumer endpoints that can be used to connect to this Cloud SQL instance.",
        ).optional(),
        pscAutoDnsEnabled: z.boolean().describe(
          "Optional. Indicates whether Private Service Connect DNS automation is enabled for this instance. When enabled, Cloud SQL provisions a universal DNS record across all networks configured with Private Service Connect auto-connections. This will default to true for new instances when Private Service Connect is enabled.",
        ).optional(),
        pscEnabled: z.boolean().describe(
          "Whether PSC connectivity is enabled for this instance.",
        ).optional(),
        pscWriteEndpointDnsEnabled: z.boolean().describe(
          "Optional. Indicates whether Private Service Connect write endpoint DNS automation is enabled for this instance. When enabled, Cloud SQL provisions a universal global DNS record across all networks configured with Private Service Connect auto-connections that points to the cluster primary instance. This feature is only supported for Enterprise Plus edition. This will default to true for new Enterprise Plus instances when `psc_auto_dns_enabled` is enabled.",
        ).optional(),
      }).describe("PSC settings for this instance.").optional(),
      requireSsl: z.boolean().describe(
        "Use `ssl_mode` instead. Whether SSL/TLS connections over IP are enforced. If set to false, then allow both non-SSL/non-TLS and SSL/TLS connections. For SSL/TLS connections, the client certificate won't be verified. If set to true, then only allow connections encrypted with SSL/TLS and with valid client certificates. If you want to enforce SSL/TLS without enforcing the requirement for valid client certificates, then use the `ssl_mode` flag instead of the `require_ssl` flag.",
      ).optional(),
      serverCaMode: z.enum([
        "CA_MODE_UNSPECIFIED",
        "GOOGLE_MANAGED_INTERNAL_CA",
        "GOOGLE_MANAGED_CAS_CA",
        "CUSTOMER_MANAGED_CAS_CA",
      ]).describe("Specify what type of CA is used for the server certificate.")
        .optional(),
      serverCaPool: z.string().describe(
        "Optional. The resource name of the server CA pool for an instance with `CUSTOMER_MANAGED_CAS_CA` as the `server_ca_mode`. Format: projects/{PROJECT}/locations/{REGION}/caPools/{CA_POOL_ID}",
      ).optional(),
      serverCertificateRotationMode: z.enum([
        "SERVER_CERTIFICATE_ROTATION_MODE_UNSPECIFIED",
        "NO_AUTOMATIC_ROTATION",
        "AUTOMATIC_ROTATION_DURING_MAINTENANCE",
      ]).describe(
        "Optional. Controls the automatic server certificate rotation feature. This feature is disabled by default. When enabled, the server certificate will be automatically rotated during Cloud SQL scheduled maintenance or self-service maintenance updates up to six months before it expires. This setting can only be set if server_ca_mode is either GOOGLE_MANAGED_CAS_CA or CUSTOMER_MANAGED_CAS_CA.",
      ).optional(),
      sslMode: z.enum([
        "SSL_MODE_UNSPECIFIED",
        "ALLOW_UNENCRYPTED_AND_ENCRYPTED",
        "ENCRYPTED_ONLY",
        "TRUSTED_CLIENT_CERTIFICATE_REQUIRED",
      ]).describe(
        "Specify how SSL/TLS is enforced in database connections. If you must use the `require_ssl` flag for backward compatibility, then only the following value pairs are valid: For PostgreSQL and MySQL: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false` * `ssl_mode=TRUSTED_CLIENT_CERTIFICATE_REQUIRED` and `require_ssl=true` For SQL Server: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=true` The value of `ssl_mode` has priority over the value of `require_ssl`. For example, for the pair `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false`, `ssl_mode=ENCRYPTED_ONLY` means accept only SSL connections, while `require_ssl=false` means accept both non-SSL and SSL connections. In this case, MySQL and PostgreSQL databases respect `ssl_mode` and accepts only SSL connections.",
      ).optional(),
    }).describe(
      "The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance. The IPv4 address cannot be disabled for Second Generation instances.",
    ).optional(),
    kind: z.string().describe("This is always `sql#settings`.").optional(),
    locationPreference: z.object({
      followGaeApplication: z.string().describe(
        "The App Engine application to follow, it must be in the same region as the Cloud SQL instance. WARNING: Changing this might restart the instance.",
      ).optional(),
      kind: z.string().describe("This is always `sql#locationPreference`.")
        .optional(),
      secondaryZone: z.string().describe(
        "The preferred Compute Engine zone for the secondary/failover (for example: us-central1-a, us-central1-b, etc.). To disable this field, set it to 'no_secondary_zone'.",
      ).optional(),
      zone: z.string().describe(
        "The preferred Compute Engine zone (for example: us-central1-a, us-central1-b, etc.). WARNING: Changing this might restart the instance.",
      ).optional(),
    }).describe(
      "The location preference settings. This allows the instance to be located as near as possible to either an App Engine app or Compute Engine zone for better performance. App Engine co-location was only applicable to First Generation instances.",
    ).optional(),
    maintenanceWindow: z.object({
      day: z.number().int().describe(
        "Day of week - `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, or `SUNDAY`. Specify in the UTC time zone. Returned in output as an integer, 1 to 7, where `1` equals Monday.",
      ).optional(),
      hour: z.number().int().describe(
        "Hour of day - 0 to 23. Specify in the UTC time zone.",
      ).optional(),
      kind: z.string().describe("This is always `sql#maintenanceWindow`.")
        .optional(),
      updateTrack: z.enum([
        "SQL_UPDATE_TRACK_UNSPECIFIED",
        "canary",
        "stable",
        "week5",
      ]).describe(
        "Maintenance timing settings: `canary`, `stable`, or `week5`. For more information, see [About maintenance on Cloud SQL instances](https://cloud.google.com/sql/docs/mysql/maintenance).",
      ).optional(),
    }).describe(
      "The maintenance window for this instance. This specifies when the instance can be restarted for maintenance purposes.",
    ).optional(),
    passwordValidationPolicy: z.object({
      complexity: z.enum(["COMPLEXITY_UNSPECIFIED", "COMPLEXITY_DEFAULT"])
        .describe("The complexity of the password.").optional(),
      disallowCompromisedCredentials: z.boolean().describe(
        "This field is deprecated and will be removed in a future version of the API.",
      ).optional(),
      disallowUsernameSubstring: z.boolean().describe(
        "Disallow username as a part of the password.",
      ).optional(),
      enablePasswordPolicy: z.boolean().describe(
        "Whether to enable the password policy or not. When enabled, passwords must meet complexity requirements. Keep this policy enabled to help prevent unauthorized access. Disabling this policy allows weak passwords.",
      ).optional(),
      minLength: z.number().int().describe(
        "Minimum number of characters allowed.",
      ).optional(),
      passwordChangeInterval: z.string().describe(
        "Minimum interval after which the password can be changed. This flag is only supported for PostgreSQL.",
      ).optional(),
      reuseInterval: z.number().int().describe(
        "Number of previous passwords that cannot be reused.",
      ).optional(),
    }).describe(
      "The local user password validation policy of the instance for PostgreSQL and MySQL.",
    ).optional(),
    performanceCaptureConfig: z.object({
      cpuUtilizationThresholdPercent: z.number().int().describe(
        "Optional. Specifies the minimum percentage of CPU utilization to trigger the performance capture. Valid integers range from `10` to `99`. Enter `0` to disable the check.",
      ).optional(),
      enabled: z.boolean().describe(
        "Optional. Enables or disables the performance capture feature.",
      ).optional(),
      historyListLengthThresholdCount: z.number().int().describe(
        "Optional. Specifies the minimum number of undo log entries in the history list length to trigger the performance capture. Valid integers range from `10000` to `10000000`. Enter `0` to disable the check.",
      ).optional(),
      memoryUsageThresholdPercent: z.number().int().describe(
        "Optional. Specifies the minimum percentage of memory usage to trigger the performance capture. Valid integers range from `10` to `99`. Enter `0` to disable the check.",
      ).optional(),
      probeThreshold: z.number().int().describe(
        "Optional. Specifies the minimum number of consecutive probe threshold that triggers performance capture.",
      ).optional(),
      probingIntervalSeconds: z.number().int().describe(
        "Optional. Specifies the interval in seconds between consecutive probes that check if any trigger condition thresholds have been reached.",
      ).optional(),
      runningThreadsThreshold: z.number().int().describe(
        "Optional. Specifies the minimum number of MySQL `Threads_running` to trigger the performance capture on the primary instance.",
      ).optional(),
      secondsBehindSourceThreshold: z.number().int().describe(
        "Optional. Specifies the minimum number of seconds replica must be lagging behind primary instance to trigger the performance capture on replica.",
      ).optional(),
      semaphoreWaitThresholdCount: z.number().int().describe(
        "Optional. Specifies the minimum allowed number of semaphore waits to trigger the performance capture. Valid integers range from `10` to `10000`. Enter `0` to disable the check.",
      ).optional(),
      transactionDurationThreshold: z.number().int().describe(
        "Optional. Specifies the amount of time in seconds that a transaction needs to have been open before the watcher starts recording it.",
      ).optional(),
      transactionKillExcludedUserHosts: z.array(z.string()).describe(
        "Optional. Specifies a customer-defined list of users to exclude from transaction termination. Entries can be in the format 'user@host' or just 'user'. A standalone 'user' implies 'user@%', excluding the user from any host. Wildcard '%' is allowed in the host part of the 'user@host' format. Example: `[\"app_user\", \"db_admin@10.1.2.3\", \"report_user@%\"]`",
      ).optional(),
      transactionKillThresholdSeconds: z.number().int().describe(
        "Optional. Specifies the amount of time in seconds that a transaction needs to have been open before the watcher starts terminating it. Valid integers range from `60` to `604800` (7 days). Enter `0` to disable. If enabled (i.e., > 0), this value must be greater than or equal to `transaction_duration_threshold`. Configurations where `0 < transaction_kill_threshold_seconds < transaction_duration_threshold` will be rejected.",
      ).optional(),
      transactionKillType: z.enum([
        "TRANSACTION_KILL_TYPE_UNSPECIFIED",
        "READ_ONLY_TRANSACTIONS",
        "ALL_TRANSACTIONS",
      ]).describe(
        "Optional. Determines which transactions are allowed to be terminated when they exceed `transaction_kill_threshold_seconds`. This allows protecting write-heavy transactions from auto-termination if desired. Defaults to `READ_ONLY_TRANSACTIONS` if unspecified.",
      ).optional(),
      transactionLockWaitThresholdCount: z.number().int().describe(
        "Optional. Specifies the minimum allowed number of transactions in lock wait state to trigger the performance capture. Valid integers range from `10` to `10000`. Enter `0` to disable the check.",
      ).optional(),
    }).describe(
      "Optional. Configuration for Performance Capture, provides diagnostic metrics during high load situations.",
    ).optional(),
    pricingPlan: z.enum(["SQL_PRICING_PLAN_UNSPECIFIED", "PACKAGE", "PER_USE"])
      .describe(
        "The pricing plan for this instance. This can be either `PER_USE` or `PACKAGE`. Only `PER_USE` is supported for Second Generation instances.",
      ).optional(),
    readPoolAutoScaleConfig: z.object({
      disableScaleIn: z.boolean().describe(
        "Indicates whether read pool auto scaling supports scale in operations (removing nodes).",
      ).optional(),
      enabled: z.boolean().describe(
        "Indicates whether read pool auto scaling is enabled.",
      ).optional(),
      maxNodeCount: z.number().int().describe(
        "Maximum number of read pool nodes to be maintained.",
      ).optional(),
      minNodeCount: z.number().int().describe(
        "Minimum number of read pool nodes to be maintained.",
      ).optional(),
      scaleInCooldownSeconds: z.number().int().describe(
        "The cooldown period for scale-in operations.",
      ).optional(),
      scaleOutCooldownSeconds: z.number().int().describe(
        "The cooldown period for scale-out operations.",
      ).optional(),
      targetMetrics: z.array(z.object({
        metric: z.string().describe(
          "The metric name to be used for auto scaling.",
        ).optional(),
        targetValue: z.number().describe("The target value for the metric.")
          .optional(),
      })).describe("Optional. Target metrics for read pool auto scaling.")
        .optional(),
    }).describe(
      "Optional. The read pool auto-scale configuration for the instance.",
    ).optional(),
    replicationLagMaxSeconds: z.number().int().describe(
      "Optional. Configuration value for recreation of replica after certain replication lag",
    ).optional(),
    replicationType: z.enum([
      "SQL_REPLICATION_TYPE_UNSPECIFIED",
      "SYNCHRONOUS",
      "ASYNCHRONOUS",
    ]).describe(
      "The type of replication this instance uses. This can be either `ASYNCHRONOUS` or `SYNCHRONOUS`. (Deprecated) This property was only applicable to First Generation instances.",
    ).optional(),
    retainBackupsOnDelete: z.boolean().describe(
      "Optional. When this parameter is set to true, Cloud SQL retains backups of the instance even after the instance is deleted. The ON_DEMAND backup will be retained until customer deletes the backup or the project. The AUTOMATED backup will be retained based on the backups retention setting.",
    ).optional(),
    settingsVersion: z.string().describe(
      "The version of instance settings. This is a required field for update method to make sure concurrent updates are handled properly. During update, use the most recent settingsVersion value for this instance and do not try to update this value.",
    ).optional(),
    sqlServerAuditConfig: z.object({
      bucket: z.string().describe(
        "The name of the destination bucket (e.g., gs://mybucket).",
      ).optional(),
      kind: z.string().describe("This is always sql#sqlServerAuditConfig")
        .optional(),
      retentionInterval: z.string().describe(
        "How long to keep generated audit files.",
      ).optional(),
      uploadInterval: z.string().describe(
        "How often to upload generated audit files.",
      ).optional(),
    }).describe("SQL Server specific audit configuration.").optional(),
    storageAutoResize: z.boolean().describe(
      "Configuration to increase storage size automatically. The default value is true.",
    ).optional(),
    storageAutoResizeLimit: z.string().describe(
      "The maximum size to which storage capacity can be automatically increased. The default value is 0, which specifies that there is no limit.",
    ).optional(),
    tier: z.string().describe(
      "The tier (or machine type) for this instance, for example `db-custom-1-3840`. WARNING: Changing this restarts the instance.",
    ).optional(),
    timeZone: z.string().describe(
      "Server timezone, relevant only for Cloud SQL for SQL Server.",
    ).optional(),
    userLabels: z.record(z.string(), z.string()).describe(
      "User-provided labels, represented as a dictionary where each label is a single key value pair.",
    ).optional(),
  }).describe("The user settings.").optional(),
  sqlNetworkArchitecture: z.enum([
    "SQL_NETWORK_ARCHITECTURE_UNSPECIFIED",
    "NEW_NETWORK_ARCHITECTURE",
    "OLD_NETWORK_ARCHITECTURE",
  ]).optional(),
  state: z.enum([
    "SQL_INSTANCE_STATE_UNSPECIFIED",
    "RUNNABLE",
    "SUSPENDED",
    "PENDING_DELETE",
    "PENDING_CREATE",
    "MAINTENANCE",
    "FAILED",
    "ONLINE_MAINTENANCE",
    "REPAIRING",
  ]).describe("The current serving state of the Cloud SQL instance.")
    .optional(),
  suspensionReason: z.array(
    z.enum([
      "SQL_SUSPENSION_REASON_UNSPECIFIED",
      "BILLING_ISSUE",
      "LEGAL_ISSUE",
      "OPERATIONAL_ISSUE",
      "KMS_KEY_ISSUE",
      "PROJECT_ABUSE",
    ]),
  ).describe(
    "If the instance state is SUSPENDED, the reason for the suspension.",
  ).optional(),
  switchTransactionLogsToCloudStorageEnabled: z.boolean().describe(
    "Input only. Whether Cloud SQL is enabled to switch storing point-in-time recovery log files from a data disk to Cloud Storage.",
  ).optional(),
  tags: z.record(z.string(), z.string()).describe(
    'Optional. Input only. Immutable. Tag keys and tag values that are bound to this instance. You must represent each item in the map as: `"": ""`. For example, a single resource can have the following tags: ` "123/environment": "production", "123/costCenter": "marketing", ` For more information on tag creation and management, see https://cloud.google.com/resource-manager/docs/tags/tags-overview.',
  ).optional(),
  location: z.string().describe("Optional. Region of the Cloud SQL instance.")
    .optional(),
  reconcilePscNetworking: z.string().describe(
    "Optional. Set PSC config to the same value as the existing config to reconcile the PSC networking.",
  ).optional(),
  reconcilePscNetworkingForce: z.string().describe(
    "Optional. Set PSC config to the same value as the existing config and force reconcile the PSC networking.",
  ).optional(),
});

const StateSchema = z.object({
  availableMaintenanceVersions: z.array(z.string()).optional(),
  backendType: z.string().optional(),
  connectionName: z.string().optional(),
  createTime: z.string().optional(),
  currentDiskSize: z.string().optional(),
  databaseCenterIntegrationEnabled: z.boolean().optional(),
  databaseInstalledVersion: z.string().optional(),
  databaseVersion: z.string().optional(),
  deploymentInfo: z.object({
    deploymentId: z.string(),
    source: z.object({
      targetId: z.object({
        name: z.string(),
        project: z.string(),
        region: z.string(),
      }),
    }),
    state: z.string(),
    target: z.object({
      sourceId: z.object({
        name: z.string(),
        project: z.string(),
        region: z.string(),
      }),
    }),
  }).optional(),
  diskEncryptionConfiguration: z.object({
    confidentialMode: z.boolean(),
    kind: z.string(),
    kmsKeyName: z.string(),
  }).optional(),
  diskEncryptionStatus: z.object({
    kind: z.string(),
    kmsKeyVersionName: z.string(),
  }).optional(),
  dnsName: z.string().optional(),
  dnsNames: z.array(z.object({
    connectionType: z.string(),
    dnsScope: z.string(),
    name: z.string(),
    recordManager: z.string(),
  })).optional(),
  etag: z.string().optional(),
  failoverReplica: z.object({
    available: z.boolean(),
    name: z.string(),
  }).optional(),
  gceZone: z.string().optional(),
  geminiConfig: z.object({
    activeQueryEnabled: z.boolean(),
    entitled: z.boolean(),
    flagRecommenderEnabled: z.boolean(),
    googleVacuumMgmtEnabled: z.boolean(),
    indexAdvisorEnabled: z.boolean(),
    oomSessionCancelEnabled: z.boolean(),
  }).optional(),
  includeReplicasForMajorVersionUpgrade: z.boolean().optional(),
  instanceType: z.string().optional(),
  ipAddresses: z.array(z.object({
    ipAddress: z.string(),
    timeToRetire: z.string(),
    type: z.string(),
  })).optional(),
  ipv6Address: z.string().optional(),
  kind: z.string().optional(),
  maintenanceVersion: z.string().optional(),
  masterInstanceName: z.string().optional(),
  maxDiskSize: z.string().optional(),
  name: z.string(),
  nodeCount: z.number().optional(),
  nodes: z.array(z.object({
    dnsName: z.string(),
    dnsNames: z.array(z.object({
      connectionType: z.string(),
      dnsScope: z.string(),
      name: z.string(),
      recordManager: z.string(),
    })),
    gceZone: z.string(),
    ipAddresses: z.array(z.object({
      ipAddress: z.string(),
      timeToRetire: z.string(),
      type: z.string(),
    })),
    name: z.string(),
    pscAutoConnections: z.array(z.object({
      consumerNetwork: z.string(),
      consumerNetworkStatus: z.string(),
      consumerProject: z.string(),
      instanceAutoDnsStatus: z.string(),
      ipAddress: z.string(),
      serviceConnectionPolicy: z.string(),
      serviceConnectionPolicyCreationResult: z.string(),
      status: z.string(),
      writeEndpointAutoDnsStatus: z.string(),
    })),
    pscServiceAttachmentLink: z.string(),
    state: z.string(),
  })).optional(),
  onPremisesConfiguration: z.object({
    caCertificate: z.string(),
    clientCertificate: z.string(),
    clientKey: z.string(),
    dmsManaged: z.boolean(),
    dumpFilePath: z.string(),
    hostPort: z.string(),
    kind: z.string(),
    password: z.string(),
    selectedObjects: z.array(z.object({
      database: z.string(),
    })),
    sourceInstance: z.object({
      name: z.string(),
      project: z.string(),
      region: z.string(),
    }),
    sslOption: z.string(),
    username: z.string(),
  }).optional(),
  outOfDiskReport: z.object({
    sqlMinRecommendedIncreaseSizeGb: z.number(),
    sqlOutOfDiskState: z.string(),
  }).optional(),
  primaryDnsName: z.string().optional(),
  project: z.string().optional(),
  pscServiceAttachmentLink: z.string().optional(),
  region: z.string().optional(),
  replicaConfiguration: z.object({
    cascadableReplica: z.boolean(),
    failoverTarget: z.boolean(),
    kind: z.string(),
    mysqlReplicaConfiguration: z.object({
      caCertificate: z.string(),
      clientCertificate: z.string(),
      clientKey: z.string(),
      connectRetryInterval: z.number(),
      dumpFilePath: z.string(),
      kind: z.string(),
      masterHeartbeatPeriod: z.string(),
      password: z.string(),
      sslCipher: z.string(),
      username: z.string(),
      verifyServerCertificate: z.boolean(),
    }),
  }).optional(),
  replicaNames: z.array(z.string()).optional(),
  replicationCluster: z.object({
    drReplica: z.boolean(),
    failoverDrReplicaName: z.string(),
    psaWriteEndpoint: z.string(),
  }).optional(),
  rootPassword: z.string().optional(),
  satisfiesPzi: z.boolean().optional(),
  satisfiesPzs: z.boolean().optional(),
  scheduledMaintenance: z.object({
    canDefer: z.boolean(),
    canReschedule: z.boolean(),
    scheduleDeadlineTime: z.string(),
    startTime: z.string(),
  }).optional(),
  secondaryGceZone: z.string().optional(),
  selfLink: z.string().optional(),
  serverCaCert: z.object({
    cert: z.string(),
    certSerialNumber: z.string(),
    commonName: z.string(),
    createTime: z.string(),
    expirationTime: z.string(),
    instance: z.string(),
    kind: z.string(),
    selfLink: z.string(),
    sha1Fingerprint: z.string(),
  }).optional(),
  serviceAccountEmailAddress: z.string().optional(),
  settings: z.object({
    acceleratedReplicaMode: z.boolean(),
    activationPolicy: z.string(),
    activeDirectoryConfig: z.object({
      adminCredentialSecretName: z.string(),
      dnsServers: z.array(z.string()),
      domain: z.string(),
      kind: z.string(),
      mode: z.string(),
      organizationalUnit: z.string(),
    }),
    advancedMachineFeatures: z.object({
      threadsPerCore: z.number(),
    }),
    authorizedGaeApplications: z.array(z.string()),
    autoUpgradeEnabled: z.boolean(),
    availabilityType: z.string(),
    backupConfiguration: z.object({
      backupRetentionSettings: z.object({
        retainedBackups: z.number(),
        retentionUnit: z.string(),
      }),
      backupTier: z.string(),
      binaryLogEnabled: z.boolean(),
      enabled: z.boolean(),
      kind: z.string(),
      location: z.string(),
      pointInTimeRecoveryEnabled: z.boolean(),
      replicationLogArchivingEnabled: z.boolean(),
      startTime: z.string(),
      transactionLogRetentionDays: z.number(),
      transactionalLogStorageState: z.string(),
    }),
    collation: z.string(),
    connectionPoolConfig: z.object({
      connectionPoolingEnabled: z.boolean(),
      flags: z.array(z.object({
        name: z.string(),
        value: z.string(),
      })),
      poolerCount: z.number(),
    }),
    connectorEnforcement: z.string(),
    crashSafeReplicationEnabled: z.boolean(),
    dataApiAccess: z.string(),
    dataCacheConfig: z.object({
      dataCacheEnabled: z.boolean(),
    }),
    dataDiskProvisionedIops: z.string(),
    dataDiskProvisionedThroughput: z.string(),
    dataDiskSizeGb: z.string(),
    dataDiskType: z.string(),
    databaseFlags: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })),
    databaseReplicationEnabled: z.boolean(),
    deletionProtectionEnabled: z.boolean(),
    denyMaintenancePeriods: z.array(z.object({
      endDate: z.string(),
      startDate: z.string(),
      time: z.string(),
    })),
    edition: z.string(),
    enableDataplexIntegration: z.boolean(),
    enableGoogleMlIntegration: z.boolean(),
    entraidConfig: z.object({
      applicationId: z.string(),
      kind: z.string(),
      tenantId: z.string(),
    }),
    finalBackupConfig: z.object({
      enabled: z.boolean(),
      retentionDays: z.number(),
    }),
    insightsConfig: z.object({
      enhancedQueryInsightsEnabled: z.boolean(),
      queryInsightsEnabled: z.boolean(),
      queryPlansPerMinute: z.number(),
      queryStringLength: z.number(),
      recordApplicationTags: z.boolean(),
      recordClientAddress: z.boolean(),
    }),
    ipConfiguration: z.object({
      allocatedIpRange: z.string(),
      authorizedNetworks: z.array(z.object({
        expirationTime: z.string(),
        kind: z.string(),
        name: z.string(),
        value: z.string(),
      })),
      customSubjectAlternativeNames: z.array(z.string()),
      enablePrivatePathForGoogleCloudServices: z.boolean(),
      ipv4Enabled: z.boolean(),
      privateNetwork: z.string(),
      pscConfig: z.object({
        allowedConsumerProjects: z.array(z.string()),
        networkAttachmentUri: z.string(),
        pscAutoConnectionPolicyEnabled: z.boolean(),
        pscAutoConnections: z.array(z.object({
          consumerNetwork: z.unknown(),
          consumerNetworkStatus: z.unknown(),
          consumerProject: z.unknown(),
          instanceAutoDnsStatus: z.unknown(),
          ipAddress: z.unknown(),
          serviceConnectionPolicy: z.unknown(),
          serviceConnectionPolicyCreationResult: z.unknown(),
          status: z.unknown(),
          writeEndpointAutoDnsStatus: z.unknown(),
        })),
        pscAutoDnsEnabled: z.boolean(),
        pscEnabled: z.boolean(),
        pscWriteEndpointDnsEnabled: z.boolean(),
      }),
      requireSsl: z.boolean(),
      serverCaMode: z.string(),
      serverCaPool: z.string(),
      serverCertificateRotationMode: z.string(),
      sslMode: z.string(),
    }),
    kind: z.string(),
    locationPreference: z.object({
      followGaeApplication: z.string(),
      kind: z.string(),
      secondaryZone: z.string(),
      zone: z.string(),
    }),
    maintenanceWindow: z.object({
      day: z.number(),
      hour: z.number(),
      kind: z.string(),
      updateTrack: z.string(),
    }),
    passwordValidationPolicy: z.object({
      complexity: z.string(),
      disallowCompromisedCredentials: z.boolean(),
      disallowUsernameSubstring: z.boolean(),
      enablePasswordPolicy: z.boolean(),
      minLength: z.number(),
      passwordChangeInterval: z.string(),
      reuseInterval: z.number(),
    }),
    performanceCaptureConfig: z.object({
      cpuUtilizationThresholdPercent: z.number(),
      enabled: z.boolean(),
      historyListLengthThresholdCount: z.number(),
      memoryUsageThresholdPercent: z.number(),
      probeThreshold: z.number(),
      probingIntervalSeconds: z.number(),
      runningThreadsThreshold: z.number(),
      secondsBehindSourceThreshold: z.number(),
      semaphoreWaitThresholdCount: z.number(),
      transactionDurationThreshold: z.number(),
      transactionKillExcludedUserHosts: z.array(z.string()),
      transactionKillThresholdSeconds: z.number(),
      transactionKillType: z.string(),
      transactionLockWaitThresholdCount: z.number(),
    }),
    pricingPlan: z.string(),
    readPoolAutoScaleConfig: z.object({
      disableScaleIn: z.boolean(),
      enabled: z.boolean(),
      maxNodeCount: z.number(),
      minNodeCount: z.number(),
      scaleInCooldownSeconds: z.number(),
      scaleOutCooldownSeconds: z.number(),
      targetMetrics: z.array(z.object({
        metric: z.string(),
        targetValue: z.number(),
      })),
    }),
    replicationLagMaxSeconds: z.number(),
    replicationType: z.string(),
    retainBackupsOnDelete: z.boolean(),
    settingsVersion: z.string(),
    sqlServerAuditConfig: z.object({
      bucket: z.string(),
      kind: z.string(),
      retentionInterval: z.string(),
      uploadInterval: z.string(),
    }),
    storageAutoResize: z.boolean(),
    storageAutoResizeLimit: z.string(),
    tier: z.string(),
    timeZone: z.string(),
    userLabels: z.record(z.string(), z.unknown()),
  }).optional(),
  sqlNetworkArchitecture: z.string().optional(),
  state: z.string().optional(),
  suspensionReason: z.array(z.string()).optional(),
  switchTransactionLogsToCloudStorageEnabled: z.boolean().optional(),
  tags: z.record(z.string(), z.unknown()).optional(),
  upgradableDatabaseVersions: z.array(z.object({
    displayName: z.string(),
    majorVersion: z.string(),
    name: z.string(),
  })).optional(),
  writeEndpoint: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  backendType: z.enum([
    "SQL_BACKEND_TYPE_UNSPECIFIED",
    "FIRST_GEN",
    "SECOND_GEN",
    "EXTERNAL",
  ]).describe(
    "The backend type. `SECOND_GEN`: Cloud SQL database instance. `EXTERNAL`: A database server that is not managed by Google. This property is read-only; use the `tier` property in the `settings` object to determine the database type.",
  ).optional(),
  connectionName: z.string().describe(
    "Connection name of the Cloud SQL instance used in connection strings.",
  ).optional(),
  databaseCenterIntegrationEnabled: z.boolean().describe(
    "Optional. If true, instance metadata is sent to the Database Center. If false, instance metadata is not sent to the Database Center.",
  ).optional(),
  databaseVersion: z.enum([
    "SQL_DATABASE_VERSION_UNSPECIFIED",
    "MYSQL_5_1",
    "MYSQL_5_5",
    "MYSQL_5_6",
    "MYSQL_5_7",
    "MYSQL_8_0",
    "MYSQL_8_0_18",
    "MYSQL_8_0_26",
    "MYSQL_8_0_27",
    "MYSQL_8_0_28",
    "MYSQL_8_0_29",
    "MYSQL_8_0_30",
    "MYSQL_8_0_31",
    "MYSQL_8_0_32",
    "MYSQL_8_0_33",
    "MYSQL_8_0_34",
    "MYSQL_8_0_35",
    "MYSQL_8_0_36",
    "MYSQL_8_0_37",
    "MYSQL_8_0_39",
    "MYSQL_8_0_40",
    "MYSQL_8_0_41",
    "MYSQL_8_0_42",
    "MYSQL_8_0_43",
    "MYSQL_8_0_44",
    "MYSQL_8_0_45",
    "MYSQL_8_0_46",
    "MYSQL_8_4",
    "MYSQL_9_7",
    "SQLSERVER_2017_STANDARD",
    "SQLSERVER_2017_ENTERPRISE",
    "SQLSERVER_2017_EXPRESS",
    "SQLSERVER_2017_WEB",
    "POSTGRES_9_6",
    "POSTGRES_10",
    "POSTGRES_11",
    "POSTGRES_12",
    "POSTGRES_13",
    "POSTGRES_14",
    "POSTGRES_15",
    "POSTGRES_16",
    "POSTGRES_17",
    "POSTGRES_18",
    "POSTGRES_19",
    "POSTGRES_20",
    "SQLSERVER_2019_STANDARD",
    "SQLSERVER_2019_ENTERPRISE",
    "SQLSERVER_2019_EXPRESS",
    "SQLSERVER_2019_WEB",
    "SQLSERVER_2022_STANDARD",
    "SQLSERVER_2022_ENTERPRISE",
    "SQLSERVER_2022_EXPRESS",
    "SQLSERVER_2022_WEB",
    "SQLSERVER_2025_STANDARD",
    "SQLSERVER_2025_ENTERPRISE",
    "SQLSERVER_2025_EXPRESS",
  ]).describe(
    "The database engine type and version. The `databaseVersion` field cannot be changed after instance creation.",
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
  }).describe("Disk encryption configuration specific to an instance.")
    .optional(),
  diskEncryptionStatus: z.object({
    kind: z.string().describe("This is always `sql#diskEncryptionStatus`.")
      .optional(),
    kmsKeyVersionName: z.string().describe(
      "KMS key version used to encrypt the Cloud SQL instance resource",
    ).optional(),
  }).describe("Disk encryption status specific to an instance.").optional(),
  failoverReplica: z.object({
    available: z.boolean().describe(
      "The availability status of the failover replica. A false status indicates that the failover replica is out of sync. The primary instance can only failover to the failover replica when the status is true.",
    ).optional(),
    name: z.string().describe(
      "The name of the failover replica. If specified at instance creation, a failover replica is created for the instance. The name doesn't include the project ID.",
    ).optional(),
  }).describe("The name and status of the failover replica.").optional(),
  gceZone: z.string().describe(
    "The Compute Engine zone that the instance is currently serving from. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary zone. WARNING: Changing this might restart the instance.",
  ).optional(),
  geminiConfig: z.object({
    activeQueryEnabled: z.boolean().describe(
      "Output only. Whether the active query is enabled.",
    ).optional(),
    entitled: z.boolean().describe("Output only. Whether Gemini is enabled.")
      .optional(),
    flagRecommenderEnabled: z.boolean().describe(
      "Output only. Whether the flag recommender is enabled.",
    ).optional(),
    googleVacuumMgmtEnabled: z.boolean().describe(
      "Output only. Whether the vacuum management is enabled.",
    ).optional(),
    indexAdvisorEnabled: z.boolean().describe(
      "Output only. Whether the index advisor is enabled.",
    ).optional(),
    oomSessionCancelEnabled: z.boolean().describe(
      "Output only. Whether canceling the out-of-memory (OOM) session is enabled.",
    ).optional(),
  }).describe("Gemini instance configuration.").optional(),
  includeReplicasForMajorVersionUpgrade: z.boolean().describe(
    "Input only. Determines whether an in-place major version upgrade of replicas happens when an in-place major version upgrade of a primary instance is initiated.",
  ).optional(),
  instanceType: z.enum([
    "SQL_INSTANCE_TYPE_UNSPECIFIED",
    "CLOUD_SQL_INSTANCE",
    "ON_PREMISES_INSTANCE",
    "READ_REPLICA_INSTANCE",
    "READ_POOL_INSTANCE",
    "GREEN_INSTANCE",
  ]).describe("The instance type.").optional(),
  ipAddresses: z.array(z.object({
    ipAddress: z.string().describe("The IP address assigned.").optional(),
    timeToRetire: z.string().describe(
      "The due time for this IP to be retired in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`. This field is only available when the IP is scheduled to be retired.",
    ).optional(),
    type: z.enum([
      "SQL_IP_ADDRESS_TYPE_UNSPECIFIED",
      "PRIMARY",
      "OUTGOING",
      "PRIVATE",
      "MIGRATED_1ST_GEN",
    ]).describe(
      "The type of this IP address. A `PRIMARY` address is a public address that can accept incoming connections. A `PRIVATE` address is a private address that can accept incoming connections. An `OUTGOING` address is the source address of connections originating from the instance, if supported.",
    ).optional(),
  })).describe("The assigned IP addresses for the instance.").optional(),
  maintenanceVersion: z.string().describe(
    "The current software version on the instance.",
  ).optional(),
  masterInstanceName: z.string().describe(
    "The name of the instance which will act as primary in the replication setup.",
  ).optional(),
  name: z.string().describe(
    "Name of the Cloud SQL instance. This does not include the project ID.",
  ).optional(),
  nodeCount: z.number().int().describe(
    "The number of read pool nodes in a read pool.",
  ).optional(),
  onPremisesConfiguration: z.object({
    caCertificate: z.string().describe(
      "PEM representation of the trusted CA's x509 certificate.",
    ).optional(),
    clientCertificate: z.string().describe(
      "PEM representation of the replica's x509 certificate.",
    ).optional(),
    clientKey: z.string().describe(
      "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
    ).optional(),
    dmsManaged: z.boolean().describe(
      "Output only. Indicates whether the resource is managed by Database Migration Service.",
    ).optional(),
    dumpFilePath: z.string().describe(
      "The dump file to create the Cloud SQL replica.",
    ).optional(),
    hostPort: z.string().describe(
      "The host and port of the on-premises instance in host:port format",
    ).optional(),
    kind: z.string().describe("This is always `sql#onPremisesConfiguration`.")
      .optional(),
    password: z.string().describe(
      "The password for connecting to on-premises instance.",
    ).optional(),
    selectedObjects: z.array(z.object({
      database: z.string().describe(
        "Required. The name of the database to migrate.",
      ).optional(),
    })).describe(
      "Optional. A list of objects that the user selects for replication from an external source instance.",
    ).optional(),
    sourceInstance: z.object({
      name: z.string().describe(
        "The name of the Cloud SQL instance being referenced. This does not include the project ID.",
      ).optional(),
      project: z.string().describe(
        "The project ID of the Cloud SQL instance being referenced. The default is the same project ID as the instance references it.",
      ).optional(),
      region: z.string().describe(
        "The region of the Cloud SQL instance being referenced.",
      ).optional(),
    }).describe(
      "The reference to Cloud SQL instance if the source is Cloud SQL.",
    ).optional(),
    sslOption: z.enum([
      "SSL_OPTION_UNSPECIFIED",
      "DISABLE",
      "REQUIRE",
      "VERIFY_CA",
    ]).describe(
      "Optional. SSL option for replica connection to the on-premises source.",
    ).optional(),
    username: z.string().describe(
      "The username for connecting to on-premises instance.",
    ).optional(),
  }).describe("Configuration specific to on-premises instances.").optional(),
  outOfDiskReport: z.object({
    sqlMinRecommendedIncreaseSizeGb: z.number().int().describe(
      "The minimum recommended increase size in GigaBytes This field is consumed by the frontend * Writers: * the proactive database wellness job for OOD. * Readers:",
    ).optional(),
    sqlOutOfDiskState: z.enum([
      "SQL_OUT_OF_DISK_STATE_UNSPECIFIED",
      "NORMAL",
      "SOFT_SHUTDOWN",
    ]).describe(
      "This field represents the state generated by the proactive database wellness job for OutOfDisk issues. * Writers: * the proactive database wellness job for OOD. * Readers: * the proactive database wellness job",
    ).optional(),
  }).describe(
    "This field represents the report generated by the proactive database wellness job for OutOfDisk issues. * Writers: * the proactive database wellness job for OOD. * Readers: * the proactive database wellness job",
  ).optional(),
  project: z.string().describe(
    "The project ID of the project containing the Cloud SQL instance. The Google apps domain is prefixed if applicable.",
  ).optional(),
  region: z.string().describe(
    "The geographical region of the Cloud SQL instance. It can be one of the [regions](https://cloud.google.com/sql/docs/mysql/locations#location-r) where Cloud SQL operates: For example, `asia-east1`, `europe-west1`, and `us-central1`. The default value is `us-central1`.",
  ).optional(),
  replicaConfiguration: z.object({
    cascadableReplica: z.boolean().describe(
      "Optional. Specifies if a SQL Server replica is a cascadable replica. A cascadable replica is a SQL Server cross region replica that supports replica(s) under it.",
    ).optional(),
    failoverTarget: z.boolean().describe(
      "Specifies if the replica is the failover target. If the field is set to `true`, the replica will be designated as a failover replica. In case the primary instance fails, the replica instance will be promoted as the new primary instance. Only one replica can be specified as failover target, and the replica has to be in different zone with the primary instance.",
    ).optional(),
    kind: z.string().describe("This is always `sql#replicaConfiguration`.")
      .optional(),
    mysqlReplicaConfiguration: z.object({
      caCertificate: z.string().describe(
        "PEM representation of the trusted CA's x509 certificate.",
      ).optional(),
      clientCertificate: z.string().describe(
        "PEM representation of the replica's x509 certificate.",
      ).optional(),
      clientKey: z.string().describe(
        "PEM representation of the replica's private key. The corresponding public key is encoded in the client's certificate.",
      ).optional(),
      connectRetryInterval: z.number().int().describe(
        "Seconds to wait between connect retries. MySQL's default is 60 seconds.",
      ).optional(),
      dumpFilePath: z.string().describe(
        "Path to a SQL dump file in Google Cloud Storage from which the replica instance is to be created. The URI is in the form gs://bucketName/fileName. Compressed gzip files (.gz) are also supported. Dumps have the binlog co-ordinates from which replication begins. This can be accomplished by setting --master-data to 1 when using mysqldump.",
      ).optional(),
      kind: z.string().describe(
        "This is always `sql#mysqlReplicaConfiguration`.",
      ).optional(),
      masterHeartbeatPeriod: z.string().describe(
        "Interval in milliseconds between replication heartbeats.",
      ).optional(),
      password: z.string().describe(
        "The password for the replication connection.",
      ).optional(),
      sslCipher: z.string().describe(
        "A list of permissible ciphers to use for SSL encryption.",
      ).optional(),
      username: z.string().describe(
        "The username for the replication connection.",
      ).optional(),
      verifyServerCertificate: z.boolean().describe(
        "Whether or not to check the primary instance's Common Name value in the certificate that it sends during the SSL handshake.",
      ).optional(),
    }).describe(
      "MySQL specific configuration when replicating from a MySQL on-premises primary instance. Replication configuration information such as the username, password, certificates, and keys are not stored in the instance metadata. The configuration information is used only to set up the replication connection and is stored by MySQL in a file named `master.info` in the data directory.",
    ).optional(),
  }).describe("Configuration specific to failover replicas and read replicas.")
    .optional(),
  replicaNames: z.array(z.string()).describe("The replicas of the instance.")
    .optional(),
  replicationCluster: z.object({
    drReplica: z.boolean().describe(
      "Output only. Read-only field that indicates whether the replica is a DR replica. This field is not set if the instance is a primary instance.",
    ).optional(),
    failoverDrReplicaName: z.string().describe(
      "Optional. If the instance is a primary instance, then this field identifies the disaster recovery (DR) replica. A DR replica is an optional configuration for Enterprise Plus edition instances. If the instance is a read replica, then the field is not set. Set this field to a replica name to designate a DR replica for a primary instance. Remove the replica name to remove the DR replica designation.",
    ).optional(),
    psaWriteEndpoint: z.string().describe(
      "Output only. If set, this field indicates this instance has a private service access (PSA) DNS endpoint that is pointing to the primary instance of the cluster. If this instance is the primary, then the DNS endpoint points to this instance. After a switchover or replica failover operation, this DNS endpoint points to the promoted instance. This is a read-only field, returned to the user as information. This field can exist even if a standalone instance doesn't have a DR replica yet or the DR replica is deleted.",
    ).optional(),
  }).describe(
    "Optional. A primary instance and disaster recovery (DR) replica pair. A DR replica is a cross-region replica that you designate for failover in the event that the primary instance experiences regional failure. Applicable to MySQL and PostgreSQL.",
  ).optional(),
  rootPassword: z.string().describe(
    "Initial root password. Use only on creation. You must set root passwords before you can connect to PostgreSQL instances.",
  ).optional(),
  satisfiesPzs: z.boolean().describe(
    "This status indicates whether the instance satisfies PZS. The status is reserved for future use.",
  ).optional(),
  scheduledMaintenance: z.object({
    canDefer: z.boolean().optional(),
    canReschedule: z.boolean().describe(
      "If the scheduled maintenance can be rescheduled.",
    ).optional(),
    scheduleDeadlineTime: z.string().describe(
      "Maintenance cannot be rescheduled to start beyond this deadline.",
    ).optional(),
    startTime: z.string().describe(
      "The start time of any upcoming scheduled maintenance for this instance.",
    ).optional(),
  }).describe(
    "The start time of any upcoming scheduled maintenance for this instance.",
  ).optional(),
  secondaryGceZone: z.string().describe(
    "The Compute Engine zone that the failover instance is currently serving from for a regional instance. This value could be different from the zone that was specified when the instance was created if the instance has failed over to its secondary/failover zone.",
  ).optional(),
  serverCaCert: z.object({
    cert: z.string().describe("PEM representation.").optional(),
    certSerialNumber: z.string().describe(
      "Serial number, as extracted from the certificate.",
    ).optional(),
    commonName: z.string().describe(
      "User supplied name. Constrained to [a-zA-Z.-_ ]+.",
    ).optional(),
    createTime: z.string().describe(
      "The time when the certificate was created in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`",
    ).optional(),
    expirationTime: z.string().describe(
      "The time when the certificate expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
    ).optional(),
    instance: z.string().describe("Name of the database instance.").optional(),
    kind: z.string().describe("This is always `sql#sslCert`.").optional(),
    selfLink: z.string().describe("The URI of this resource.").optional(),
    sha1Fingerprint: z.string().describe("Sha1 Fingerprint.").optional(),
  }).describe("SSL configuration.").optional(),
  serviceAccountEmailAddress: z.string().describe(
    "The service account email address assigned to the instance.\\This property is read-only.",
  ).optional(),
  settings: z.object({
    acceleratedReplicaMode: z.boolean().describe(
      "Optional. Whether the replica is in accelerated mode. This feature is in private preview and requires allowlisting to take effect.",
    ).optional(),
    activationPolicy: z.enum([
      "SQL_ACTIVATION_POLICY_UNSPECIFIED",
      "ALWAYS",
      "NEVER",
      "ON_DEMAND",
    ]).describe(
      "The activation policy specifies when the instance is activated; it is applicable only when the instance state is RUNNABLE. Valid values: * `ALWAYS`: The instance is on, and remains so even in the absence of connection requests. * `NEVER`: The instance is off; it is not activated, even if a connection request arrives.",
    ).optional(),
    activeDirectoryConfig: z.object({
      adminCredentialSecretName: z.string().describe(
        "Optional. The secret manager key storing the administrator credential. (e.g., projects/{project}/secrets/{secret}).",
      ).optional(),
      dnsServers: z.array(z.string()).describe(
        "Optional. Domain controller IPv4 addresses used to bootstrap Active Directory.",
      ).optional(),
      domain: z.string().describe(
        "The name of the domain (e.g., mydomain.com).",
      ).optional(),
      kind: z.string().describe("This is always sql#activeDirectoryConfig.")
        .optional(),
      mode: z.enum([
        "ACTIVE_DIRECTORY_MODE_UNSPECIFIED",
        "MANAGED_ACTIVE_DIRECTORY",
        "SELF_MANAGED_ACTIVE_DIRECTORY",
        "CUSTOMER_MANAGED_ACTIVE_DIRECTORY",
      ]).describe("Optional. The mode of the Active Directory configuration.")
        .optional(),
      organizationalUnit: z.string().describe(
        "Optional. The organizational unit distinguished name. This is the full hierarchical path to the organizational unit.",
      ).optional(),
    }).describe(
      "Active Directory configuration, relevant only for Cloud SQL for SQL Server.",
    ).optional(),
    advancedMachineFeatures: z.object({
      threadsPerCore: z.number().int().describe(
        "The number of threads per physical core.",
      ).optional(),
    }).describe(
      "Specifies advanced machine configuration for the instances relevant only for SQL Server.",
    ).optional(),
    authorizedGaeApplications: z.array(z.string()).describe(
      "The App Engine app IDs that can access this instance. (Deprecated) Applied to First Generation instances only.",
    ).optional(),
    autoUpgradeEnabled: z.boolean().describe(
      "Optional. Cloud SQL for MySQL auto-upgrade configuration. When this parameter is set to true, auto-upgrade is enabled for MySQL 8.0 minor versions. The MySQL version must be 8.0.35 or higher.",
    ).optional(),
    availabilityType: z.enum([
      "SQL_AVAILABILITY_TYPE_UNSPECIFIED",
      "ZONAL",
      "REGIONAL",
    ]).describe(
      "Availability type. Potential values: * `ZONAL`: The instance serves data from only one zone. Outages in that zone affect data accessibility. * `REGIONAL`: The instance can serve data from more than one zone in a region (it is highly available)./ For more information, see [Overview of the High Availability Configuration](https://cloud.google.com/sql/docs/mysql/high-availability).",
    ).optional(),
    backupConfiguration: z.object({
      backupRetentionSettings: z.object({
        retainedBackups: z.number().int().describe(
          "Depending on the value of retention_unit, this is used to determine if a backup needs to be deleted. If retention_unit is 'COUNT', we will retain this many backups.",
        ).optional(),
        retentionUnit: z.enum(["RETENTION_UNIT_UNSPECIFIED", "COUNT"]).describe(
          "The unit that 'retained_backups' represents.",
        ).optional(),
      }).describe("Backup retention settings.").optional(),
      backupTier: z.enum([
        "BACKUP_TIER_UNSPECIFIED",
        "STANDARD",
        "ADVANCED",
        "ENHANCED",
      ]).describe(
        "Output only. Backup tier that manages the backups for the instance.",
      ).optional(),
      binaryLogEnabled: z.boolean().describe(
        "(MySQL only) Whether binary log is enabled. If backup configuration is disabled, binarylog must be disabled as well.",
      ).optional(),
      enabled: z.boolean().describe("Whether this configuration is enabled.")
        .optional(),
      kind: z.string().describe("This is always `sql#backupConfiguration`.")
        .optional(),
      location: z.string().describe("Location of the backup").optional(),
      pointInTimeRecoveryEnabled: z.boolean().describe(
        "Whether point in time recovery is enabled.",
      ).optional(),
      replicationLogArchivingEnabled: z.boolean().describe(
        "Optional. Deprecated: replication_log_archiving_enabled is deprecated and will be removed from a future version of the API. Use point_in_time_recovery_enabled instead.",
      ).optional(),
      startTime: z.string().describe(
        "Start time for the daily backup configuration in UTC timezone in the 24 hour format - `HH:MM`.",
      ).optional(),
      transactionLogRetentionDays: z.number().int().describe(
        "The number of days of transaction logs we retain for point in time restore, from 1-7.",
      ).optional(),
      transactionalLogStorageState: z.enum([
        "TRANSACTIONAL_LOG_STORAGE_STATE_UNSPECIFIED",
        "DISK",
        "SWITCHING_TO_CLOUD_STORAGE",
        "SWITCHED_TO_CLOUD_STORAGE",
        "CLOUD_STORAGE",
      ]).describe(
        "Output only. This value contains the storage location of transactional logs used to perform point-in-time recovery (PITR) for the database.",
      ).optional(),
    }).describe("The daily backup configuration for the instance.").optional(),
    collation: z.string().describe("The name of server Instance collation.")
      .optional(),
    connectionPoolConfig: z.object({
      connectionPoolingEnabled: z.boolean().describe(
        "Whether managed connection pooling is enabled.",
      ).optional(),
      flags: z.array(z.object({
        name: z.string().describe("Required. The name of the flag.").optional(),
        value: z.string().describe(
          "Required. The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.",
        ).optional(),
      })).describe("Optional. List of connection pool configuration flags.")
        .optional(),
      poolerCount: z.number().int().describe(
        "Output only. Number of connection poolers.",
      ).optional(),
    }).describe(
      "Optional. The managed connection pooling configuration for the instance.",
    ).optional(),
    connectorEnforcement: z.enum([
      "CONNECTOR_ENFORCEMENT_UNSPECIFIED",
      "NOT_REQUIRED",
      "REQUIRED",
    ]).describe(
      "Specifies if connections must use Cloud SQL connectors. Option values include the following: `NOT_REQUIRED` (Cloud SQL instances can be connected without Cloud SQL Connectors) and `REQUIRED` (Only allow connections that use Cloud SQL Connectors). Note that using REQUIRED disables all existing authorized networks. If this field is not specified when creating a new instance, NOT_REQUIRED is used. If this field is not specified when patching or updating an existing instance, it is left unchanged in the instance.",
    ).optional(),
    crashSafeReplicationEnabled: z.boolean().describe(
      "Configuration specific to read replica instances. Indicates whether database flags for crash-safe replication are enabled. This property was only applicable to First Generation instances.",
    ).optional(),
    dataApiAccess: z.enum([
      "DATA_API_ACCESS_UNSPECIFIED",
      "DISALLOW_DATA_API",
      "ALLOW_DATA_API",
    ]).describe(
      "This parameter controls whether to allow using ExecuteSql API to connect to the instance. Not allowed by default.",
    ).optional(),
    dataCacheConfig: z.object({
      dataCacheEnabled: z.boolean().describe(
        "Whether data cache is enabled for the instance.",
      ).optional(),
    }).describe("Configuration for data cache.").optional(),
    dataDiskProvisionedIops: z.string().describe(
      "Optional. Provisioned number of I/O operations per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
    ).optional(),
    dataDiskProvisionedThroughput: z.string().describe(
      "Optional. Provisioned throughput measured in MiB per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
    ).optional(),
    dataDiskSizeGb: z.string().describe(
      "The size of data disk, in GB. The data disk size minimum is 10GB.",
    ).optional(),
    dataDiskType: z.enum([
      "SQL_DATA_DISK_TYPE_UNSPECIFIED",
      "PD_SSD",
      "PD_HDD",
      "OBSOLETE_LOCAL_SSD",
      "HYPERDISK_BALANCED",
    ]).describe(
      "The type of data disk: `PD_SSD` (default) or `PD_HDD`. Not used for First Generation instances.",
    ).optional(),
    databaseFlags: z.array(z.object({
      name: z.string().describe(
        "The name of the flag. These flags are passed at instance startup, so include both server options and system variables. Flags are specified with underscores, not hyphens. For more information, see [Configuring Database Flags](https://cloud.google.com/sql/docs/mysql/flags) in the Cloud SQL documentation.",
      ).optional(),
      value: z.string().describe(
        "The value of the flag. Boolean flags are set to `on` for true and `off` for false. This field must be omitted if the flag doesn't take a value.",
      ).optional(),
    })).describe("The database flags passed to the instance at startup.")
      .optional(),
    databaseReplicationEnabled: z.boolean().describe(
      "Configuration specific to read replica instances. Indicates whether replication is enabled or not. WARNING: Changing this restarts the instance.",
    ).optional(),
    deletionProtectionEnabled: z.boolean().describe(
      "Configuration to protect against accidental instance deletion.",
    ).optional(),
    denyMaintenancePeriods: z.array(z.object({
      endDate: z.string().describe(
        '"deny maintenance period" end date. If the year of the end date is empty, the year of the start date also must be empty. In this case, it means the no maintenance interval recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01',
      ).optional(),
      startDate: z.string().describe(
        '"deny maintenance period" start date. If the year of the start date is empty, the year of the end date also must be empty. In this case, it means the deny maintenance period recurs every year. The date is in format yyyy-mm-dd i.e., 2020-11-01, or mm-dd, i.e., 11-01',
      ).optional(),
      time: z.string().describe(
        'Time in UTC when the "deny maintenance period" starts on start_date and ends on end_date. The time is in format: HH:mm:SS, i.e., 00:00:00',
      ).optional(),
    })).describe("Deny maintenance periods").optional(),
    edition: z.enum([
      "EDITION_UNSPECIFIED",
      "ENTERPRISE",
      "ENTERPRISE_PLUS",
      "DEVELOPER",
    ]).describe("Optional. The edition type of the Cloud SQL instance.")
      .optional(),
    enableDataplexIntegration: z.boolean().describe(
      "Optional. By default, Cloud SQL instances have schema extraction disabled for Dataplex. When this parameter is set to true, schema extraction for Dataplex on Cloud SQL instances is activated.",
    ).optional(),
    enableGoogleMlIntegration: z.boolean().describe(
      "Optional. When this parameter is set to true, Cloud SQL instances can connect to Vertex AI to pass requests for real-time predictions and insights to the AI. The default value is false. This applies only to Cloud SQL for MySQL and Cloud SQL for PostgreSQL instances.",
    ).optional(),
    entraidConfig: z.object({
      applicationId: z.string().describe(
        "Optional. The application ID for the Entra ID configuration.",
      ).optional(),
      kind: z.string().describe(
        "Output only. This is always sql#sqlServerEntraIdConfig",
      ).optional(),
      tenantId: z.string().describe(
        "Optional. The tenant ID for the Entra ID configuration.",
      ).optional(),
    }).describe(
      "Optional. The Microsoft Entra ID configuration for the SQL Server instance.",
    ).optional(),
    finalBackupConfig: z.object({
      enabled: z.boolean().describe(
        "Whether the final backup is enabled for the instance.",
      ).optional(),
      retentionDays: z.number().int().describe(
        "The number of days to retain the final backup after the instance deletion. The final backup will be purged at (time_of_instance_deletion + retention_days).",
      ).optional(),
    }).describe("Optional. The final backup configuration for the instance.")
      .optional(),
    insightsConfig: z.object({
      enhancedQueryInsightsEnabled: z.boolean().describe(
        "Optional. Whether enhanced query insights feature is enabled.",
      ).optional(),
      queryInsightsEnabled: z.boolean().describe(
        "Whether Query Insights feature is enabled.",
      ).optional(),
      queryPlansPerMinute: z.number().int().describe(
        "Number of query execution plans captured by Insights per minute for all queries combined. Default is 5.",
      ).optional(),
      queryStringLength: z.number().int().describe(
        "Maximum query length stored in bytes. Default value: 1024 bytes. Range: 256-4500 bytes. Query lengths greater than this field value will be truncated to this value. When unset, query length will be the default value. Changing query length will restart the database.",
      ).optional(),
      recordApplicationTags: z.boolean().describe(
        "Whether Query Insights will record application tags from query when enabled.",
      ).optional(),
      recordClientAddress: z.boolean().describe(
        "Whether Query Insights will record client address when enabled.",
      ).optional(),
    }).describe("Insights configuration, for now relevant only for Postgres.")
      .optional(),
    ipConfiguration: z.object({
      allocatedIpRange: z.string().describe(
        'The name of the allocated ip range for the private ip Cloud SQL instance. For example: "google-managed-services-default". If set, the instance ip will be created in the allocated range. The range name must comply with [RFC 1035](https://tools.ietf.org/html/rfc1035). Specifically, the name must be 1-63 characters long and match the regular expression `[a-z]([-a-z0-9]*[a-z0-9])?.`',
      ).optional(),
      authorizedNetworks: z.array(z.object({
        expirationTime: z.string().describe(
          "The time when this access control entry expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example `2012-11-15T16:19:00.094Z`.",
        ).optional(),
        kind: z.string().describe("This is always `sql#aclEntry`.").optional(),
        name: z.string().describe("Optional. A label to identify this entry.")
          .optional(),
        value: z.string().describe(
          "The allowlisted value for the access control list.",
        ).optional(),
      })).describe(
        "The list of external networks that are allowed to connect to the instance using the IP. In 'CIDR' notation, also known as 'slash' notation (for example: `157.197.200.0/24`).",
      ).optional(),
      customSubjectAlternativeNames: z.array(z.string()).describe(
        "Optional. Custom Subject Alternative Name(SAN)s for a Cloud SQL instance.",
      ).optional(),
      enablePrivatePathForGoogleCloudServices: z.boolean().describe(
        "Controls connectivity to private IP instances from Google services, such as BigQuery.",
      ).optional(),
      ipv4Enabled: z.boolean().describe(
        "Whether the instance is assigned a public IP address or not.",
      ).optional(),
      privateNetwork: z.string().describe(
        "The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `/projects/myProject/global/networks/default`. This setting can be updated, but it cannot be removed after it is set.",
      ).optional(),
      pscConfig: z.object({
        allowedConsumerProjects: z.array(z.string()).describe(
          "Optional. The list of consumer projects that are allow-listed for PSC connections to this instance. This instance can be connected to with PSC from any network in these projects. Each consumer project in this list may be represented by a project number (numeric) or by a project id (alphanumeric).",
        ).optional(),
        networkAttachmentUri: z.string().describe(
          "Optional. The network attachment of the consumer network that the Private Service Connect enabled Cloud SQL instance is authorized to connect using the PSC interface. format: projects/PROJECT/regions/REGION/networkAttachments/ID",
        ).optional(),
        pscAutoConnectionPolicyEnabled: z.boolean().describe(
          "Optional. Whether to set up the PSC service connection policy automatically.",
        ).optional(),
        pscAutoConnections: z.array(z.object({
          consumerNetwork: z.unknown().describe(
            "Optional. The consumer network of this consumer endpoint. This must be a resource path that includes both the host project and the network name. For example, `projects/project1/global/networks/network1`. The consumer host project of this network might be different from the consumer service project.",
          ).optional(),
          consumerNetworkStatus: z.unknown().describe(
            "The connection policy status of the consumer network.",
          ).optional(),
          consumerProject: z.unknown().describe(
            "Optional. This is the project ID of consumer service project of this consumer endpoint. This is only applicable if `consumer_network` is a shared VPC network.",
          ).optional(),
          instanceAutoDnsStatus: z.unknown().describe(
            "Output only. The status of automated DNS provisioning.",
          ).optional(),
          ipAddress: z.unknown().describe(
            "The IP address of the consumer endpoint.",
          ).optional(),
          serviceConnectionPolicy: z.unknown().describe(
            "Output only. The service connection policy created automatically for the consumer network when `psc_auto_connection_policy_enabled` is true. It is in the format of: `projects/{project}/regions/{region}/serviceConnectionPolicies/{policy_id}` The `policy_id` is in format of `$NETWORK-$RANDOM`.",
          ).optional(),
          serviceConnectionPolicyCreationResult: z.unknown().describe(
            "Output only. The status of service connection policy creation.",
          ).optional(),
          status: z.unknown().describe(
            "The connection status of the consumer endpoint.",
          ).optional(),
          writeEndpointAutoDnsStatus: z.unknown().describe(
            "Output only. The status of automated DNS provisioning for the write endpoint.",
          ).optional(),
        })).describe(
          "Optional. The list of settings for requested Private Service Connect consumer endpoints that can be used to connect to this Cloud SQL instance.",
        ).optional(),
        pscAutoDnsEnabled: z.boolean().describe(
          "Optional. Indicates whether Private Service Connect DNS automation is enabled for this instance. When enabled, Cloud SQL provisions a universal DNS record across all networks configured with Private Service Connect auto-connections. This will default to true for new instances when Private Service Connect is enabled.",
        ).optional(),
        pscEnabled: z.boolean().describe(
          "Whether PSC connectivity is enabled for this instance.",
        ).optional(),
        pscWriteEndpointDnsEnabled: z.boolean().describe(
          "Optional. Indicates whether Private Service Connect write endpoint DNS automation is enabled for this instance. When enabled, Cloud SQL provisions a universal global DNS record across all networks configured with Private Service Connect auto-connections that points to the cluster primary instance. This feature is only supported for Enterprise Plus edition. This will default to true for new Enterprise Plus instances when `psc_auto_dns_enabled` is enabled.",
        ).optional(),
      }).describe("PSC settings for this instance.").optional(),
      requireSsl: z.boolean().describe(
        "Use `ssl_mode` instead. Whether SSL/TLS connections over IP are enforced. If set to false, then allow both non-SSL/non-TLS and SSL/TLS connections. For SSL/TLS connections, the client certificate won't be verified. If set to true, then only allow connections encrypted with SSL/TLS and with valid client certificates. If you want to enforce SSL/TLS without enforcing the requirement for valid client certificates, then use the `ssl_mode` flag instead of the `require_ssl` flag.",
      ).optional(),
      serverCaMode: z.enum([
        "CA_MODE_UNSPECIFIED",
        "GOOGLE_MANAGED_INTERNAL_CA",
        "GOOGLE_MANAGED_CAS_CA",
        "CUSTOMER_MANAGED_CAS_CA",
      ]).describe("Specify what type of CA is used for the server certificate.")
        .optional(),
      serverCaPool: z.string().describe(
        "Optional. The resource name of the server CA pool for an instance with `CUSTOMER_MANAGED_CAS_CA` as the `server_ca_mode`. Format: projects/{PROJECT}/locations/{REGION}/caPools/{CA_POOL_ID}",
      ).optional(),
      serverCertificateRotationMode: z.enum([
        "SERVER_CERTIFICATE_ROTATION_MODE_UNSPECIFIED",
        "NO_AUTOMATIC_ROTATION",
        "AUTOMATIC_ROTATION_DURING_MAINTENANCE",
      ]).describe(
        "Optional. Controls the automatic server certificate rotation feature. This feature is disabled by default. When enabled, the server certificate will be automatically rotated during Cloud SQL scheduled maintenance or self-service maintenance updates up to six months before it expires. This setting can only be set if server_ca_mode is either GOOGLE_MANAGED_CAS_CA or CUSTOMER_MANAGED_CAS_CA.",
      ).optional(),
      sslMode: z.enum([
        "SSL_MODE_UNSPECIFIED",
        "ALLOW_UNENCRYPTED_AND_ENCRYPTED",
        "ENCRYPTED_ONLY",
        "TRUSTED_CLIENT_CERTIFICATE_REQUIRED",
      ]).describe(
        "Specify how SSL/TLS is enforced in database connections. If you must use the `require_ssl` flag for backward compatibility, then only the following value pairs are valid: For PostgreSQL and MySQL: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false` * `ssl_mode=TRUSTED_CLIENT_CERTIFICATE_REQUIRED` and `require_ssl=true` For SQL Server: * `ssl_mode=ALLOW_UNENCRYPTED_AND_ENCRYPTED` and `require_ssl=false` * `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=true` The value of `ssl_mode` has priority over the value of `require_ssl`. For example, for the pair `ssl_mode=ENCRYPTED_ONLY` and `require_ssl=false`, `ssl_mode=ENCRYPTED_ONLY` means accept only SSL connections, while `require_ssl=false` means accept both non-SSL and SSL connections. In this case, MySQL and PostgreSQL databases respect `ssl_mode` and accepts only SSL connections.",
      ).optional(),
    }).describe(
      "The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance. The IPv4 address cannot be disabled for Second Generation instances.",
    ).optional(),
    kind: z.string().describe("This is always `sql#settings`.").optional(),
    locationPreference: z.object({
      followGaeApplication: z.string().describe(
        "The App Engine application to follow, it must be in the same region as the Cloud SQL instance. WARNING: Changing this might restart the instance.",
      ).optional(),
      kind: z.string().describe("This is always `sql#locationPreference`.")
        .optional(),
      secondaryZone: z.string().describe(
        "The preferred Compute Engine zone for the secondary/failover (for example: us-central1-a, us-central1-b, etc.). To disable this field, set it to 'no_secondary_zone'.",
      ).optional(),
      zone: z.string().describe(
        "The preferred Compute Engine zone (for example: us-central1-a, us-central1-b, etc.). WARNING: Changing this might restart the instance.",
      ).optional(),
    }).describe(
      "The location preference settings. This allows the instance to be located as near as possible to either an App Engine app or Compute Engine zone for better performance. App Engine co-location was only applicable to First Generation instances.",
    ).optional(),
    maintenanceWindow: z.object({
      day: z.number().int().describe(
        "Day of week - `MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, or `SUNDAY`. Specify in the UTC time zone. Returned in output as an integer, 1 to 7, where `1` equals Monday.",
      ).optional(),
      hour: z.number().int().describe(
        "Hour of day - 0 to 23. Specify in the UTC time zone.",
      ).optional(),
      kind: z.string().describe("This is always `sql#maintenanceWindow`.")
        .optional(),
      updateTrack: z.enum([
        "SQL_UPDATE_TRACK_UNSPECIFIED",
        "canary",
        "stable",
        "week5",
      ]).describe(
        "Maintenance timing settings: `canary`, `stable`, or `week5`. For more information, see [About maintenance on Cloud SQL instances](https://cloud.google.com/sql/docs/mysql/maintenance).",
      ).optional(),
    }).describe(
      "The maintenance window for this instance. This specifies when the instance can be restarted for maintenance purposes.",
    ).optional(),
    passwordValidationPolicy: z.object({
      complexity: z.enum(["COMPLEXITY_UNSPECIFIED", "COMPLEXITY_DEFAULT"])
        .describe("The complexity of the password.").optional(),
      disallowCompromisedCredentials: z.boolean().describe(
        "This field is deprecated and will be removed in a future version of the API.",
      ).optional(),
      disallowUsernameSubstring: z.boolean().describe(
        "Disallow username as a part of the password.",
      ).optional(),
      enablePasswordPolicy: z.boolean().describe(
        "Whether to enable the password policy or not. When enabled, passwords must meet complexity requirements. Keep this policy enabled to help prevent unauthorized access. Disabling this policy allows weak passwords.",
      ).optional(),
      minLength: z.number().int().describe(
        "Minimum number of characters allowed.",
      ).optional(),
      passwordChangeInterval: z.string().describe(
        "Minimum interval after which the password can be changed. This flag is only supported for PostgreSQL.",
      ).optional(),
      reuseInterval: z.number().int().describe(
        "Number of previous passwords that cannot be reused.",
      ).optional(),
    }).describe(
      "The local user password validation policy of the instance for PostgreSQL and MySQL.",
    ).optional(),
    performanceCaptureConfig: z.object({
      cpuUtilizationThresholdPercent: z.number().int().describe(
        "Optional. Specifies the minimum percentage of CPU utilization to trigger the performance capture. Valid integers range from `10` to `99`. Enter `0` to disable the check.",
      ).optional(),
      enabled: z.boolean().describe(
        "Optional. Enables or disables the performance capture feature.",
      ).optional(),
      historyListLengthThresholdCount: z.number().int().describe(
        "Optional. Specifies the minimum number of undo log entries in the history list length to trigger the performance capture. Valid integers range from `10000` to `10000000`. Enter `0` to disable the check.",
      ).optional(),
      memoryUsageThresholdPercent: z.number().int().describe(
        "Optional. Specifies the minimum percentage of memory usage to trigger the performance capture. Valid integers range from `10` to `99`. Enter `0` to disable the check.",
      ).optional(),
      probeThreshold: z.number().int().describe(
        "Optional. Specifies the minimum number of consecutive probe threshold that triggers performance capture.",
      ).optional(),
      probingIntervalSeconds: z.number().int().describe(
        "Optional. Specifies the interval in seconds between consecutive probes that check if any trigger condition thresholds have been reached.",
      ).optional(),
      runningThreadsThreshold: z.number().int().describe(
        "Optional. Specifies the minimum number of MySQL `Threads_running` to trigger the performance capture on the primary instance.",
      ).optional(),
      secondsBehindSourceThreshold: z.number().int().describe(
        "Optional. Specifies the minimum number of seconds replica must be lagging behind primary instance to trigger the performance capture on replica.",
      ).optional(),
      semaphoreWaitThresholdCount: z.number().int().describe(
        "Optional. Specifies the minimum allowed number of semaphore waits to trigger the performance capture. Valid integers range from `10` to `10000`. Enter `0` to disable the check.",
      ).optional(),
      transactionDurationThreshold: z.number().int().describe(
        "Optional. Specifies the amount of time in seconds that a transaction needs to have been open before the watcher starts recording it.",
      ).optional(),
      transactionKillExcludedUserHosts: z.array(z.string()).describe(
        "Optional. Specifies a customer-defined list of users to exclude from transaction termination. Entries can be in the format 'user@host' or just 'user'. A standalone 'user' implies 'user@%', excluding the user from any host. Wildcard '%' is allowed in the host part of the 'user@host' format. Example: `[\"app_user\", \"db_admin@10.1.2.3\", \"report_user@%\"]`",
      ).optional(),
      transactionKillThresholdSeconds: z.number().int().describe(
        "Optional. Specifies the amount of time in seconds that a transaction needs to have been open before the watcher starts terminating it. Valid integers range from `60` to `604800` (7 days). Enter `0` to disable. If enabled (i.e., > 0), this value must be greater than or equal to `transaction_duration_threshold`. Configurations where `0 < transaction_kill_threshold_seconds < transaction_duration_threshold` will be rejected.",
      ).optional(),
      transactionKillType: z.enum([
        "TRANSACTION_KILL_TYPE_UNSPECIFIED",
        "READ_ONLY_TRANSACTIONS",
        "ALL_TRANSACTIONS",
      ]).describe(
        "Optional. Determines which transactions are allowed to be terminated when they exceed `transaction_kill_threshold_seconds`. This allows protecting write-heavy transactions from auto-termination if desired. Defaults to `READ_ONLY_TRANSACTIONS` if unspecified.",
      ).optional(),
      transactionLockWaitThresholdCount: z.number().int().describe(
        "Optional. Specifies the minimum allowed number of transactions in lock wait state to trigger the performance capture. Valid integers range from `10` to `10000`. Enter `0` to disable the check.",
      ).optional(),
    }).describe(
      "Optional. Configuration for Performance Capture, provides diagnostic metrics during high load situations.",
    ).optional(),
    pricingPlan: z.enum(["SQL_PRICING_PLAN_UNSPECIFIED", "PACKAGE", "PER_USE"])
      .describe(
        "The pricing plan for this instance. This can be either `PER_USE` or `PACKAGE`. Only `PER_USE` is supported for Second Generation instances.",
      ).optional(),
    readPoolAutoScaleConfig: z.object({
      disableScaleIn: z.boolean().describe(
        "Indicates whether read pool auto scaling supports scale in operations (removing nodes).",
      ).optional(),
      enabled: z.boolean().describe(
        "Indicates whether read pool auto scaling is enabled.",
      ).optional(),
      maxNodeCount: z.number().int().describe(
        "Maximum number of read pool nodes to be maintained.",
      ).optional(),
      minNodeCount: z.number().int().describe(
        "Minimum number of read pool nodes to be maintained.",
      ).optional(),
      scaleInCooldownSeconds: z.number().int().describe(
        "The cooldown period for scale-in operations.",
      ).optional(),
      scaleOutCooldownSeconds: z.number().int().describe(
        "The cooldown period for scale-out operations.",
      ).optional(),
      targetMetrics: z.array(z.object({
        metric: z.string().describe(
          "The metric name to be used for auto scaling.",
        ).optional(),
        targetValue: z.number().describe("The target value for the metric.")
          .optional(),
      })).describe("Optional. Target metrics for read pool auto scaling.")
        .optional(),
    }).describe(
      "Optional. The read pool auto-scale configuration for the instance.",
    ).optional(),
    replicationLagMaxSeconds: z.number().int().describe(
      "Optional. Configuration value for recreation of replica after certain replication lag",
    ).optional(),
    replicationType: z.enum([
      "SQL_REPLICATION_TYPE_UNSPECIFIED",
      "SYNCHRONOUS",
      "ASYNCHRONOUS",
    ]).describe(
      "The type of replication this instance uses. This can be either `ASYNCHRONOUS` or `SYNCHRONOUS`. (Deprecated) This property was only applicable to First Generation instances.",
    ).optional(),
    retainBackupsOnDelete: z.boolean().describe(
      "Optional. When this parameter is set to true, Cloud SQL retains backups of the instance even after the instance is deleted. The ON_DEMAND backup will be retained until customer deletes the backup or the project. The AUTOMATED backup will be retained based on the backups retention setting.",
    ).optional(),
    settingsVersion: z.string().describe(
      "The version of instance settings. This is a required field for update method to make sure concurrent updates are handled properly. During update, use the most recent settingsVersion value for this instance and do not try to update this value.",
    ).optional(),
    sqlServerAuditConfig: z.object({
      bucket: z.string().describe(
        "The name of the destination bucket (e.g., gs://mybucket).",
      ).optional(),
      kind: z.string().describe("This is always sql#sqlServerAuditConfig")
        .optional(),
      retentionInterval: z.string().describe(
        "How long to keep generated audit files.",
      ).optional(),
      uploadInterval: z.string().describe(
        "How often to upload generated audit files.",
      ).optional(),
    }).describe("SQL Server specific audit configuration.").optional(),
    storageAutoResize: z.boolean().describe(
      "Configuration to increase storage size automatically. The default value is true.",
    ).optional(),
    storageAutoResizeLimit: z.string().describe(
      "The maximum size to which storage capacity can be automatically increased. The default value is 0, which specifies that there is no limit.",
    ).optional(),
    tier: z.string().describe(
      "The tier (or machine type) for this instance, for example `db-custom-1-3840`. WARNING: Changing this restarts the instance.",
    ).optional(),
    timeZone: z.string().describe(
      "Server timezone, relevant only for Cloud SQL for SQL Server.",
    ).optional(),
    userLabels: z.record(z.string(), z.string()).describe(
      "User-provided labels, represented as a dictionary where each label is a single key value pair.",
    ).optional(),
  }).describe("The user settings.").optional(),
  sqlNetworkArchitecture: z.enum([
    "SQL_NETWORK_ARCHITECTURE_UNSPECIFIED",
    "NEW_NETWORK_ARCHITECTURE",
    "OLD_NETWORK_ARCHITECTURE",
  ]).optional(),
  state: z.enum([
    "SQL_INSTANCE_STATE_UNSPECIFIED",
    "RUNNABLE",
    "SUSPENDED",
    "PENDING_DELETE",
    "PENDING_CREATE",
    "MAINTENANCE",
    "FAILED",
    "ONLINE_MAINTENANCE",
    "REPAIRING",
  ]).describe("The current serving state of the Cloud SQL instance.")
    .optional(),
  suspensionReason: z.array(
    z.enum([
      "SQL_SUSPENSION_REASON_UNSPECIFIED",
      "BILLING_ISSUE",
      "LEGAL_ISSUE",
      "OPERATIONAL_ISSUE",
      "KMS_KEY_ISSUE",
      "PROJECT_ABUSE",
    ]),
  ).describe(
    "If the instance state is SUSPENDED, the reason for the suspension.",
  ).optional(),
  switchTransactionLogsToCloudStorageEnabled: z.boolean().describe(
    "Input only. Whether Cloud SQL is enabled to switch storing point-in-time recovery log files from a data disk to Cloud Storage.",
  ).optional(),
  tags: z.record(z.string(), z.string()).describe(
    'Optional. Input only. Immutable. Tag keys and tag values that are bound to this instance. You must represent each item in the map as: `"": ""`. For example, a single resource can have the following tags: ` "123/environment": "production", "123/costCenter": "marketing", ` For more information on tag creation and management, see https://cloud.google.com/resource-manager/docs/tags/tags-overview.',
  ).optional(),
  location: z.string().describe("Optional. Region of the Cloud SQL instance.")
    .optional(),
  reconcilePscNetworking: z.string().describe(
    "Optional. Set PSC config to the same value as the existing config to reconcile the PSC networking.",
  ).optional(),
  reconcilePscNetworkingForce: z.string().describe(
    "Optional. Set PSC config to the same value as the existing config and force reconcile the PSC networking.",
  ).optional(),
});

const _credentialKeys = new Set([
  "accessToken",
  "credentialsJson",
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

/** Swamp extension model for Google Cloud SQL Admin Instances. Registered at `@swamp/gcp/sqladmin/instances`. */
export const model = {
  type: "@swamp/gcp/sqladmin/instances",
  version: "2026.09.18.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.01.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.02.1",
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
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.09.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.15.1",
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
      toVersion: "2026.05.19.3",
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
      toVersion: "2026.05.25.2",
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
      description: "Added: accessToken, credentialsJson",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.10.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.09.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.13.1",
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
      toVersion: "2026.08.29.1",
      description: "Added: location",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "Added: reconcilePscNetworking, reconcilePscNetworkingForce",
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
      description: "A Cloud SQL instance resource.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a instances",
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
        const body: Record<string, unknown> = {};
        if (g["backendType"] !== undefined) {
          body["backendType"] = g["backendType"];
        }
        if (g["connectionName"] !== undefined) {
          body["connectionName"] = g["connectionName"];
        }
        if (g["databaseCenterIntegrationEnabled"] !== undefined) {
          body["databaseCenterIntegrationEnabled"] =
            g["databaseCenterIntegrationEnabled"];
        }
        if (g["databaseVersion"] !== undefined) {
          body["databaseVersion"] = g["databaseVersion"];
        }
        if (g["diskEncryptionConfiguration"] !== undefined) {
          body["diskEncryptionConfiguration"] =
            g["diskEncryptionConfiguration"];
        }
        if (g["diskEncryptionStatus"] !== undefined) {
          body["diskEncryptionStatus"] = g["diskEncryptionStatus"];
        }
        if (g["failoverReplica"] !== undefined) {
          body["failoverReplica"] = g["failoverReplica"];
        }
        if (g["gceZone"] !== undefined) body["gceZone"] = g["gceZone"];
        if (g["geminiConfig"] !== undefined) {
          body["geminiConfig"] = g["geminiConfig"];
        }
        if (g["includeReplicasForMajorVersionUpgrade"] !== undefined) {
          body["includeReplicasForMajorVersionUpgrade"] =
            g["includeReplicasForMajorVersionUpgrade"];
        }
        if (g["instanceType"] !== undefined) {
          body["instanceType"] = g["instanceType"];
        }
        if (g["ipAddresses"] !== undefined) {
          body["ipAddresses"] = g["ipAddresses"];
        }
        if (g["maintenanceVersion"] !== undefined) {
          body["maintenanceVersion"] = g["maintenanceVersion"];
        }
        if (g["masterInstanceName"] !== undefined) {
          body["masterInstanceName"] = g["masterInstanceName"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["nodeCount"] !== undefined) body["nodeCount"] = g["nodeCount"];
        if (g["onPremisesConfiguration"] !== undefined) {
          body["onPremisesConfiguration"] = g["onPremisesConfiguration"];
        }
        if (g["outOfDiskReport"] !== undefined) {
          body["outOfDiskReport"] = g["outOfDiskReport"];
        }
        if (g["region"] !== undefined) body["region"] = g["region"];
        if (g["replicaConfiguration"] !== undefined) {
          body["replicaConfiguration"] = g["replicaConfiguration"];
        }
        if (g["replicaNames"] !== undefined) {
          body["replicaNames"] = g["replicaNames"];
        }
        if (g["replicationCluster"] !== undefined) {
          body["replicationCluster"] = g["replicationCluster"];
        }
        if (g["rootPassword"] !== undefined) {
          body["rootPassword"] = g["rootPassword"];
        }
        if (g["satisfiesPzs"] !== undefined) {
          body["satisfiesPzs"] = g["satisfiesPzs"];
        }
        if (g["scheduledMaintenance"] !== undefined) {
          body["scheduledMaintenance"] = g["scheduledMaintenance"];
        }
        if (g["secondaryGceZone"] !== undefined) {
          body["secondaryGceZone"] = g["secondaryGceZone"];
        }
        if (g["serverCaCert"] !== undefined) {
          body["serverCaCert"] = g["serverCaCert"];
        }
        if (g["serviceAccountEmailAddress"] !== undefined) {
          body["serviceAccountEmailAddress"] = g["serviceAccountEmailAddress"];
        }
        if (g["settings"] !== undefined) body["settings"] = g["settings"];
        if (g["sqlNetworkArchitecture"] !== undefined) {
          body["sqlNetworkArchitecture"] = g["sqlNetworkArchitecture"];
        }
        if (g["state"] !== undefined) body["state"] = g["state"];
        if (g["suspensionReason"] !== undefined) {
          body["suspensionReason"] = g["suspensionReason"];
        }
        if (g["switchTransactionLogsToCloudStorageEnabled"] !== undefined) {
          body["switchTransactionLogsToCloudStorageEnabled"] =
            g["switchTransactionLogsToCloudStorageEnabled"];
        }
        if (g["tags"] !== undefined) body["tags"] = g["tags"];
        if (g["location"] !== undefined) {
          params["location"] = String(g["location"]);
        }
        if (g["name"] !== undefined) params["instance"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          (args.waitForReady ?? true)
            ? {
              "statusField": "state",
              "readyValues": ["RUNNABLE"],
              "failedValues": ["FAILED"],
            }
            : undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: { "project": projectId },
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
      description: "Get a instances",
      arguments: z.object({
        identifier: z.string().describe("The name of the instances"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["instance"] = args.identifier;
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
      description: "Update instances attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific instances by name (e.g. one discovered by list)",
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
        params["instance"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["backendType"] !== undefined) {
          body["backendType"] = g["backendType"];
        }
        if (g["connectionName"] !== undefined) {
          body["connectionName"] = g["connectionName"];
        }
        if (g["databaseCenterIntegrationEnabled"] !== undefined) {
          body["databaseCenterIntegrationEnabled"] =
            g["databaseCenterIntegrationEnabled"];
        }
        if (g["diskEncryptionConfiguration"] !== undefined) {
          body["diskEncryptionConfiguration"] =
            g["diskEncryptionConfiguration"];
        }
        if (g["diskEncryptionStatus"] !== undefined) {
          body["diskEncryptionStatus"] = g["diskEncryptionStatus"];
        }
        if (g["failoverReplica"] !== undefined) {
          body["failoverReplica"] = g["failoverReplica"];
        }
        if (g["gceZone"] !== undefined) body["gceZone"] = g["gceZone"];
        if (g["geminiConfig"] !== undefined) {
          body["geminiConfig"] = g["geminiConfig"];
        }
        if (g["includeReplicasForMajorVersionUpgrade"] !== undefined) {
          body["includeReplicasForMajorVersionUpgrade"] =
            g["includeReplicasForMajorVersionUpgrade"];
        }
        if (g["instanceType"] !== undefined) {
          body["instanceType"] = g["instanceType"];
        }
        if (g["ipAddresses"] !== undefined) {
          body["ipAddresses"] = g["ipAddresses"];
        }
        if (g["maintenanceVersion"] !== undefined) {
          body["maintenanceVersion"] = g["maintenanceVersion"];
        }
        if (g["masterInstanceName"] !== undefined) {
          body["masterInstanceName"] = g["masterInstanceName"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["nodeCount"] !== undefined) body["nodeCount"] = g["nodeCount"];
        if (g["onPremisesConfiguration"] !== undefined) {
          body["onPremisesConfiguration"] = g["onPremisesConfiguration"];
        }
        if (g["outOfDiskReport"] !== undefined) {
          body["outOfDiskReport"] = g["outOfDiskReport"];
        }
        if (g["region"] !== undefined) body["region"] = g["region"];
        if (g["replicaConfiguration"] !== undefined) {
          body["replicaConfiguration"] = g["replicaConfiguration"];
        }
        if (g["replicaNames"] !== undefined) {
          body["replicaNames"] = g["replicaNames"];
        }
        if (g["replicationCluster"] !== undefined) {
          body["replicationCluster"] = g["replicationCluster"];
        }
        if (g["rootPassword"] !== undefined) {
          body["rootPassword"] = g["rootPassword"];
        }
        if (g["satisfiesPzs"] !== undefined) {
          body["satisfiesPzs"] = g["satisfiesPzs"];
        }
        if (g["scheduledMaintenance"] !== undefined) {
          body["scheduledMaintenance"] = g["scheduledMaintenance"];
        }
        if (g["secondaryGceZone"] !== undefined) {
          body["secondaryGceZone"] = g["secondaryGceZone"];
        }
        if (g["serverCaCert"] !== undefined) {
          body["serverCaCert"] = g["serverCaCert"];
        }
        if (g["serviceAccountEmailAddress"] !== undefined) {
          body["serviceAccountEmailAddress"] = g["serviceAccountEmailAddress"];
        }
        if (g["settings"] !== undefined) body["settings"] = g["settings"];
        if (g["sqlNetworkArchitecture"] !== undefined) {
          body["sqlNetworkArchitecture"] = g["sqlNetworkArchitecture"];
        }
        if (g["state"] !== undefined) body["state"] = g["state"];
        if (g["suspensionReason"] !== undefined) {
          body["suspensionReason"] = g["suspensionReason"];
        }
        if (g["switchTransactionLogsToCloudStorageEnabled"] !== undefined) {
          body["switchTransactionLogsToCloudStorageEnabled"] =
            g["switchTransactionLogsToCloudStorageEnabled"];
        }
        if (g["reconcilePscNetworking"] !== undefined) {
          body["reconcilePscNetworking"] = g["reconcilePscNetworking"];
        }
        if (g["reconcilePscNetworkingForce"] !== undefined) {
          body["reconcilePscNetworkingForce"] =
            g["reconcilePscNetworkingForce"];
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
          (args.waitForReady ?? true)
            ? {
              "statusField": "state",
              "readyValues": ["RUNNABLE"],
              "failedValues": ["FAILED"],
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
      description: "Delete the instances",
      arguments: z.object({
        identifier: z.string().describe("The name of the instances"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        params["instance"] = args.identifier;
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
      description: "Sync instances state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific instances by name (e.g. one discovered by list)",
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
          params["instance"] = identifier;
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
      description: "List instances resources",
      arguments: z.object({
        filter: z.string().describe(
          "A filter expression that filters resources listed in the response. The expression is in the form of field:value. For example, 'instanceType:CLOUD_SQL_INSTANCE'. Fields can be nested as needed as per their JSON representation, such as 'settings.userLabels.auto_start:true'. Multiple filter queries are space-separated. For example. 'state:RUNNABLE instanceType:CLOUD_SQL_INSTANCE'. By default, each expression is an AND expression. However, you can include AND and OR expressions explicitly.",
        ).optional(),
        location: z.string().describe(
          "Optional. Region of the Cloud SQL instance.",
        ).optional(),
        maxResults: z.number().describe(
          "The maximum number of instances to return. The service may return fewer than this value. If unspecified, at most 500 instances are returned. The maximum value is 1000; values above 1000 are coerced to 1000.",
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
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
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
    acquire_ssrs_lease: {
      description: "acquire ssrs lease",
      arguments: z.object({
        acquireSsrsLeaseContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["acquireSsrsLeaseContext"] !== undefined) {
          body["acquireSsrsLeaseContext"] = args["acquireSsrsLeaseContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.acquireSsrsLease",
            "path":
              "v1/projects/{project}/instances/{instance}/acquireSsrsLease",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    add_entra_id_certificate: {
      description: "add entra id certificate",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.addEntraIdCertificate",
            "path":
              "v1/projects/{project}/instances/{instance}/addEntraIdCertificate",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    add_server_ca: {
      description: "add server ca",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.addServerCa",
            "path": "v1/projects/{project}/instances/{instance}/addServerCa",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    add_server_certificate: {
      description: "add server certificate",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.addServerCertificate",
            "path":
              "v1/projects/{project}/instances/{instance}/addServerCertificate",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    clone: {
      description: "clone",
      arguments: z.object({
        cloneContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["cloneContext"] !== undefined) {
          body["cloneContext"] = args["cloneContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.clone",
            "path": "v1/projects/{project}/instances/{instance}/clone",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    demote: {
      description: "demote",
      arguments: z.object({
        demoteContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["demoteContext"] !== undefined) {
          body["demoteContext"] = args["demoteContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.demote",
            "path": "v1/projects/{project}/instances/{instance}/demote",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    demote_master: {
      description: "demote master",
      arguments: z.object({
        demoteMasterContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["demoteMasterContext"] !== undefined) {
          body["demoteMasterContext"] = args["demoteMasterContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.demoteMaster",
            "path": "v1/projects/{project}/instances/{instance}/demoteMaster",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    execute_sql: {
      description: "execute sql",
      arguments: z.object({
        application: z.any().optional(),
        autoIamAuthn: z.any().optional(),
        database: z.any().optional(),
        partialResultMode: z.any().optional(),
        passwordSecretVersion: z.any().optional(),
        rowLimit: z.any().optional(),
        sqlStatement: z.any().optional(),
        user: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["application"] !== undefined) {
          body["application"] = args["application"];
        }
        if (args["autoIamAuthn"] !== undefined) {
          body["autoIamAuthn"] = args["autoIamAuthn"];
        }
        if (args["database"] !== undefined) body["database"] = args["database"];
        if (args["partialResultMode"] !== undefined) {
          body["partialResultMode"] = args["partialResultMode"];
        }
        if (args["passwordSecretVersion"] !== undefined) {
          body["passwordSecretVersion"] = args["passwordSecretVersion"];
        }
        if (args["rowLimit"] !== undefined) body["rowLimit"] = args["rowLimit"];
        if (args["sqlStatement"] !== undefined) {
          body["sqlStatement"] = args["sqlStatement"];
        }
        if (args["user"] !== undefined) body["user"] = args["user"];
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.executeSql",
            "path": "v1/projects/{project}/instances/{instance}/executeSql",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    export: {
      description: "export",
      arguments: z.object({
        exportContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["exportContext"] !== undefined) {
          body["exportContext"] = args["exportContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.export",
            "path": "v1/projects/{project}/instances/{instance}/export",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    failover: {
      description: "failover",
      arguments: z.object({
        failoverContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["failoverContext"] !== undefined) {
          body["failoverContext"] = args["failoverContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.failover",
            "path": "v1/projects/{project}/instances/{instance}/failover",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    import: {
      description: "import",
      arguments: z.object({
        importContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["importContext"] !== undefined) {
          body["importContext"] = args["importContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.import",
            "path": "v1/projects/{project}/instances/{instance}/import",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    list_entra_id_certificates: {
      description: "list entra id certificates",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.ListEntraIdCertificates",
            "path":
              "v1/projects/{project}/instances/{instance}/listEntraIdCertificates",
            "httpMethod": "GET",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    list_server_cas: {
      description: "list server cas",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.listServerCas",
            "path": "v1/projects/{project}/instances/{instance}/listServerCas",
            "httpMethod": "GET",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    list_server_certificates: {
      description: "list server certificates",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.ListServerCertificates",
            "path":
              "v1/projects/{project}/instances/{instance}/listServerCertificates",
            "httpMethod": "GET",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    point_in_time_restore: {
      description: "point in time restore",
      arguments: z.object({
        allocatedIpRange: z.any().optional(),
        datasource: z.any().optional(),
        pointInTime: z.any().optional(),
        preferredSecondaryZone: z.any().optional(),
        preferredZone: z.any().optional(),
        privateNetwork: z.any().optional(),
        region: z.any().optional(),
        targetInstance: z.any().optional(),
        targetInstanceClearSettingsFieldNames: z.any().optional(),
        targetInstanceSettings: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
        const body: Record<string, unknown> = {};
        if (args["allocatedIpRange"] !== undefined) {
          body["allocatedIpRange"] = args["allocatedIpRange"];
        }
        if (args["datasource"] !== undefined) {
          body["datasource"] = args["datasource"];
        }
        if (args["pointInTime"] !== undefined) {
          body["pointInTime"] = args["pointInTime"];
        }
        if (args["preferredSecondaryZone"] !== undefined) {
          body["preferredSecondaryZone"] = args["preferredSecondaryZone"];
        }
        if (args["preferredZone"] !== undefined) {
          body["preferredZone"] = args["preferredZone"];
        }
        if (args["privateNetwork"] !== undefined) {
          body["privateNetwork"] = args["privateNetwork"];
        }
        if (args["region"] !== undefined) body["region"] = args["region"];
        if (args["targetInstance"] !== undefined) {
          body["targetInstance"] = args["targetInstance"];
        }
        if (args["targetInstanceClearSettingsFieldNames"] !== undefined) {
          body["targetInstanceClearSettingsFieldNames"] =
            args["targetInstanceClearSettingsFieldNames"];
        }
        if (args["targetInstanceSettings"] !== undefined) {
          body["targetInstanceSettings"] = args["targetInstanceSettings"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.pointInTimeRestore",
            "path": "v1/{+parent}:pointInTimeRestore",
            "httpMethod": "POST",
            "parameterOrder": ["parent"],
            "parameters": {
              "parent": { "location": "path", "required": true },
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
    pre_check_major_version_upgrade: {
      description: "pre check major version upgrade",
      arguments: z.object({
        preCheckMajorVersionUpgradeContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["preCheckMajorVersionUpgradeContext"] !== undefined) {
          body["preCheckMajorVersionUpgradeContext"] =
            args["preCheckMajorVersionUpgradeContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.preCheckMajorVersionUpgrade",
            "path":
              "v1/projects/{project}/instances/{instance}/preCheckMajorVersionUpgrade",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    promote_replica: {
      description: "promote replica",
      arguments: z.object({
        failover: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["failover"] !== undefined) {
          params["failover"] = String(args["failover"]);
        }
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.promoteReplica",
            "path": "v1/projects/{project}/instances/{instance}/promoteReplica",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "failover": { "location": "query" },
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    reencrypt: {
      description: "reencrypt",
      arguments: z.object({
        backupReencryptionConfig: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["backupReencryptionConfig"] !== undefined) {
          body["backupReencryptionConfig"] = args["backupReencryptionConfig"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.reencrypt",
            "path": "v1/projects/{project}/instances/{instance}/reencrypt",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    release_ssrs_lease: {
      description: "release ssrs lease",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.releaseSsrsLease",
            "path":
              "v1/projects/{project}/instances/{instance}/releaseSsrsLease",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    reset_ssl_config: {
      description: "reset ssl config",
      arguments: z.object({
        location: z.any().optional(),
        mode: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        if (args["mode"] !== undefined) params["mode"] = String(args["mode"]);
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.resetSslConfig",
            "path": "v1/projects/{project}/instances/{instance}/resetSslConfig",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "mode": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    restart: {
      description: "restart",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.restart",
            "path": "v1/projects/{project}/instances/{instance}/restart",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    restore_backup: {
      description: "restore backup",
      arguments: z.object({
        backup: z.any().optional(),
        backupdrBackup: z.any().optional(),
        ignoreMaintenanceVersion: z.any().optional(),
        restoreBackupContext: z.any().optional(),
        restoreInstanceClearOverridesFieldNames: z.any().optional(),
        restoreInstanceSettings: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["backup"] !== undefined) body["backup"] = args["backup"];
        if (args["backupdrBackup"] !== undefined) {
          body["backupdrBackup"] = args["backupdrBackup"];
        }
        if (args["ignoreMaintenanceVersion"] !== undefined) {
          body["ignoreMaintenanceVersion"] = args["ignoreMaintenanceVersion"];
        }
        if (args["restoreBackupContext"] !== undefined) {
          body["restoreBackupContext"] = args["restoreBackupContext"];
        }
        if (args["restoreInstanceClearOverridesFieldNames"] !== undefined) {
          body["restoreInstanceClearOverridesFieldNames"] =
            args["restoreInstanceClearOverridesFieldNames"];
        }
        if (args["restoreInstanceSettings"] !== undefined) {
          body["restoreInstanceSettings"] = args["restoreInstanceSettings"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.restoreBackup",
            "path": "v1/projects/{project}/instances/{instance}/restoreBackup",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    rotate_entra_id_certificate: {
      description: "rotate entra id certificate",
      arguments: z.object({
        rotateEntraIdCertificateContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["rotateEntraIdCertificateContext"] !== undefined) {
          body["rotateEntraIdCertificateContext"] =
            args["rotateEntraIdCertificateContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.RotateEntraIdCertificate",
            "path":
              "v1/projects/{project}/instances/{instance}/rotateEntraIdCertificate",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    rotate_server_ca: {
      description: "rotate server ca",
      arguments: z.object({
        rotateServerCaContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["rotateServerCaContext"] !== undefined) {
          body["rotateServerCaContext"] = args["rotateServerCaContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.rotateServerCa",
            "path": "v1/projects/{project}/instances/{instance}/rotateServerCa",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    rotate_server_certificate: {
      description: "rotate server certificate",
      arguments: z.object({
        rotateServerCertificateContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["rotateServerCertificateContext"] !== undefined) {
          body["rotateServerCertificateContext"] =
            args["rotateServerCertificateContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.RotateServerCertificate",
            "path":
              "v1/projects/{project}/instances/{instance}/rotateServerCertificate",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    start_replica: {
      description: "start replica",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.startReplica",
            "path": "v1/projects/{project}/instances/{instance}/startReplica",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    stop_replica: {
      description: "stop replica",
      arguments: z.object({
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.stopReplica",
            "path": "v1/projects/{project}/instances/{instance}/stopReplica",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    switchover: {
      description: "switchover",
      arguments: z.object({
        dbTimeout: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["dbTimeout"] !== undefined) {
          params["dbTimeout"] = String(args["dbTimeout"]);
        }
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.switchover",
            "path": "v1/projects/{project}/instances/{instance}/switchover",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "dbTimeout": { "location": "query" },
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
    truncate_log: {
      description: "truncate log",
      arguments: z.object({
        truncateLogContext: z.any().optional(),
        location: z.any().optional(),
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
        params["instance"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const body: Record<string, unknown> = {};
        if (args["truncateLogContext"] !== undefined) {
          body["truncateLogContext"] = args["truncateLogContext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "sql.instances.truncateLog",
            "path": "v1/projects/{project}/instances/{instance}/truncateLog",
            "httpMethod": "POST",
            "parameterOrder": ["project", "instance"],
            "parameters": {
              "instance": { "location": "path", "required": true },
              "location": { "location": "query" },
              "project": { "location": "path", "required": true },
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
