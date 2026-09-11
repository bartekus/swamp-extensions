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

// Auto-generated extension model for @swamp/gcp/datamigration/connectionprofiles
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Database Migration ConnectionProfiles.
 *
 * A connection profile definition.
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
  return `${parent}/connectionProfiles/${shortName}`;
}

const BASE_URL = "https://datamigration.googleapis.com/";

const GET_CONFIG = {
  "id": "datamigration.projects.locations.connectionProfiles.get",
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
  "id": "datamigration.projects.locations.connectionProfiles.create",
  "path": "v1/{+parent}/connectionProfiles",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "connectionProfileId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
    "skipValidation": {
      "location": "query",
    },
    "validateOnly": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "datamigration.projects.locations.connectionProfiles.patch",
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
    "skipValidation": {
      "location": "query",
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
  "id": "datamigration.projects.locations.connectionProfiles.delete",
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
  "id": "datamigration.projects.locations.connectionProfiles.list",
  "path": "v1/{+parent}/connectionProfiles",
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
  alloydb: z.object({
    clusterId: z.string().describe(
      "Required. The AlloyDB cluster ID that this connection profile is associated with.",
    ).optional(),
    settings: z.object({
      databaseVersion: z.enum([
        "DATABASE_VERSION_UNSPECIFIED",
        "POSTGRES_14",
        "POSTGRES_15",
        "POSTGRES_16",
        "POSTGRES_17",
        "POSTGRES_18",
      ]).describe(
        "Optional. The database engine major version. This is an optional field. If a database version is not supplied at cluster creation time, then a default database version will be used.",
      ).optional(),
      encryptionConfig: z.object({
        kmsKeyName: z.string().describe(
          "The fully-qualified resource name of the KMS key. Each Cloud KMS key is regionalized and has the following format: projects/[PROJECT]/locations/[REGION]/keyRings/[RING]/cryptoKeys/[KEY_NAME]",
        ).optional(),
      }).describe(
        "Optional. The encryption config can be specified to encrypt the data disks and other persistent data resources of a cluster with a customer-managed encryption key (CMEK). When this field is not specified, the cluster will then use default encryption scheme to protect the user data.",
      ).optional(),
      initialUser: z.object({
        password: z.string().describe("The initial password for the user.")
          .optional(),
        passwordSet: z.boolean().describe(
          "Output only. Indicates if the initial_user.password field has been set.",
        ).optional(),
        user: z.string().describe("The database username.").optional(),
      }).describe(
        "Required. Input only. Initial user to setup during cluster creation. Required.",
      ).optional(),
      labels: z.record(z.string(), z.string()).describe(
        "Labels for the AlloyDB cluster created by DMS. An object containing a list of 'key', 'value' pairs.",
      ).optional(),
      primaryInstanceSettings: z.object({
        databaseFlags: z.record(z.string(), z.string()).describe(
          "Database flags to pass to AlloyDB when DMS is creating the AlloyDB cluster and instances. See the AlloyDB documentation for how these can be used.",
        ).optional(),
        id: z.string().describe(
          'Required. The ID of the AlloyDB primary instance. The ID must satisfy the regex expression "[a-z0-9-]+".',
        ).optional(),
        instanceNetworkConfig: z.object({
          authorizedExternalNetworks: z.array(z.unknown()).describe(
            "Optional. A list of external network authorized to access this instance.",
          ).optional(),
          enableOutboundPublicIp: z.boolean().describe(
            "Optional. Enabling an outbound public IP address to support a database server sending requests out into the internet.",
          ).optional(),
          enablePublicIp: z.boolean().describe(
            "Optional. Enabling public ip for the instance.",
          ).optional(),
        }).describe(
          "Optional. Metadata related to instance level network configuration.",
        ).optional(),
        labels: z.record(z.string(), z.string()).describe(
          "Labels for the AlloyDB primary instance created by DMS. An object containing a list of 'key', 'value' pairs.",
        ).optional(),
        machineConfig: z.object({
          cpuCount: z.number().int().describe(
            "The number of CPU's in the VM instance.",
          ).optional(),
          machineType: z.string().describe(
            'Optional. Machine type of the VM instance. E.g. "n2-highmem-4", "n2-highmem-8", "c4a-highmem-4-lssd". cpu_count must match the number of vCPUs in the machine type.',
          ).optional(),
        }).describe(
          "Configuration for the machines that host the underlying database engine.",
        ).optional(),
        outboundPublicIpAddresses: z.array(z.string()).describe(
          "Output only. All outbound public IP addresses configured for the instance.",
        ).optional(),
        privateIp: z.string().describe(
          "Output only. The private IP address for the Instance. This is the connection endpoint for an end-user application.",
        ).optional(),
      }).describe("Settings for the cluster's primary instance").optional(),
      vpcNetwork: z.string().describe(
        'Required. The resource link for the VPC network in which cluster resources are created and from which they are accessible via Private IP. The network must belong to the same project as the cluster. It is specified in the form: "projects/{project_number}/global/networks/{network_id}". This is required to create a cluster.',
      ).optional(),
    }).describe(
      "Immutable. Metadata used to create the destination AlloyDB cluster.",
    ).optional(),
  }).describe("An AlloyDB cluster connection profile.").optional(),
  cloudsql: z.object({
    additionalPublicIp: z.string().describe(
      "Output only. The Cloud SQL database instance's additional (outgoing) public IP. Used when the Cloud SQL database availability type is REGIONAL (i.e. multiple zones / highly available).",
    ).optional(),
    cloudSqlId: z.string().describe(
      "Output only. The Cloud SQL instance ID that this connection profile is associated with.",
    ).optional(),
    privateIp: z.string().describe(
      "Output only. The Cloud SQL database instance's private IP.",
    ).optional(),
    publicIp: z.string().describe(
      "Output only. The Cloud SQL database instance's public IP.",
    ).optional(),
    settings: z.object({
      activationPolicy: z.enum([
        "SQL_ACTIVATION_POLICY_UNSPECIFIED",
        "ALWAYS",
        "NEVER",
      ]).describe(
        "The activation policy specifies when the instance is activated; it is applicable only when the instance state is 'RUNNABLE'. Valid values: 'ALWAYS': The instance is on, and remains so even in the absence of connection requests. `NEVER`: The instance is off; it is not activated, even if a connection request arrives.",
      ).optional(),
      autoStorageIncrease: z.boolean().describe(
        "[default: ON] If you enable this setting, Cloud SQL checks your available storage every 30 seconds. If the available storage falls below a threshold size, Cloud SQL automatically adds additional storage capacity. If the available storage repeatedly falls below the threshold size, Cloud SQL continues to add storage until it reaches the maximum of 30 TB.",
      ).optional(),
      availabilityType: z.enum([
        "SQL_AVAILABILITY_TYPE_UNSPECIFIED",
        "ZONAL",
        "REGIONAL",
      ]).describe(
        "Optional. Availability type. Potential values: * `ZONAL`: The instance serves data from only one zone. Outages in that zone affect data availability. * `REGIONAL`: The instance can serve data from more than one zone in a region (it is highly available).",
      ).optional(),
      cmekKeyName: z.string().describe(
        "The KMS key name used for the csql instance.",
      ).optional(),
      collation: z.string().describe(
        "The Cloud SQL default instance level collation.",
      ).optional(),
      dataCacheConfig: z.object({
        dataCacheEnabled: z.boolean().describe(
          "Optional. Whether data cache is enabled for the instance.",
        ).optional(),
      }).describe(
        "Optional. Data cache is an optional feature available for Cloud SQL for MySQL Enterprise Plus edition only. For more information on data cache, see [Data cache overview](https://cloud.google.com/sql/help/mysql-data-cache) in Cloud SQL documentation.",
      ).optional(),
      dataDiskProvisionedIops: z.string().describe(
        "Optional. Provisioned number of I/O operations per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
      ).optional(),
      dataDiskProvisionedThroughput: z.string().describe(
        "Optional. Provisioned throughput measured in MiB per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
      ).optional(),
      dataDiskSizeGb: z.string().describe(
        "The storage capacity available to the database, in GB. The minimum (and default) size is 10GB.",
      ).optional(),
      dataDiskType: z.enum([
        "SQL_DATA_DISK_TYPE_UNSPECIFIED",
        "PD_SSD",
        "PD_HDD",
        "HYPERDISK_BALANCED",
      ]).describe(
        "The type of storage: `PD_SSD` (default) or `PD_HDD` or `HYPERDISK_BALANCED`.",
      ).optional(),
      databaseFlags: z.record(z.string(), z.string()).describe(
        'The database flags passed to the Cloud SQL instance at startup. An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1.3kg", "count": "3" }.',
      ).optional(),
      databaseVersion: z.enum([
        "SQL_DATABASE_VERSION_UNSPECIFIED",
        "MYSQL_5_6",
        "MYSQL_5_7",
        "MYSQL_8_0",
        "MYSQL_8_0_18",
        "MYSQL_8_0_26",
        "MYSQL_8_0_27",
        "MYSQL_8_0_28",
        "MYSQL_8_0_30",
        "MYSQL_8_0_31",
        "MYSQL_8_0_32",
        "MYSQL_8_0_33",
        "MYSQL_8_0_34",
        "MYSQL_8_0_35",
        "MYSQL_8_0_36",
        "MYSQL_8_0_37",
        "MYSQL_8_4",
        "POSTGRES_9_6",
        "POSTGRES_11",
        "POSTGRES_10",
        "POSTGRES_12",
        "POSTGRES_13",
        "POSTGRES_14",
        "POSTGRES_15",
        "POSTGRES_16",
      ]).describe(
        "The database engine type and version. Deprecated. Use database_version_name instead.",
      ).optional(),
      databaseVersionName: z.string().describe(
        "Optional. The database engine type and version name.",
      ).optional(),
      edition: z.enum(["EDITION_UNSPECIFIED", "ENTERPRISE", "ENTERPRISE_PLUS"])
        .describe("Optional. The edition of the given Cloud SQL instance.")
        .optional(),
      ipConfig: z.object({
        allocatedIpRange: z.string().describe(
          "Optional. The name of the allocated IP address range for the private IP Cloud SQL instance. This name refers to an already allocated IP range address. If set, the instance IP address will be created in the allocated range. Note that this IP address range can't be modified after the instance is created. If you change the VPC when configuring connectivity settings for the migration job, this field is not relevant.",
        ).optional(),
        authorizedNetworks: z.array(z.object({
          expireTime: z.unknown().describe(
            "The time when this access control entry expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example: `2012-11-15T16:19:00.094Z`.",
          ).optional(),
          label: z.unknown().describe("A label to identify this entry.")
            .optional(),
          ttl: z.unknown().describe(
            "Input only. The time-to-leave of this access control entry.",
          ).optional(),
          value: z.unknown().describe(
            "The allowlisted value for the access control list.",
          ).optional(),
        })).describe(
          "The list of external networks that are allowed to connect to the instance using the IP. See https://en.wikipedia.org/wiki/CIDR_notation#CIDR_notation, also known as 'slash' notation (e.g. `192.168.100.0/24`).",
        ).optional(),
        enableIpv4: z.boolean().describe(
          "Whether the instance should be assigned an IPv4 address or not.",
        ).optional(),
        privateNetwork: z.string().describe(
          "The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `projects/myProject/global/networks/default`. This setting can be updated, but it cannot be removed after it is set.",
        ).optional(),
        requireSsl: z.boolean().describe(
          "Whether SSL connections over IP should be enforced or not.",
        ).optional(),
      }).describe(
        "The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance. The IPv4 address cannot be disabled.",
      ).optional(),
      rootPassword: z.string().describe("Input only. Initial root password.")
        .optional(),
      rootPasswordSet: z.boolean().describe(
        "Output only. Indicates If this connection profile root password is stored.",
      ).optional(),
      secondaryZone: z.string().describe(
        "Optional. The Google Cloud Platform zone where the failover Cloud SQL database instance is located. Used when the Cloud SQL database availability type is REGIONAL (i.e. multiple zones / highly available).",
      ).optional(),
      sourceId: z.string().describe(
        "The Database Migration Service source connection profile ID, in the format: `projects/my_project_name/locations/us-central1/connectionProfiles/connection_profile_ID`",
      ).optional(),
      storageAutoResizeLimit: z.string().describe(
        "The maximum size to which storage capacity can be automatically increased. The default value is 0, which specifies that there is no limit.",
      ).optional(),
      tier: z.string().describe(
        "The tier (or machine type) for this instance, for example: `db-n1-standard-1` (MySQL instances) or `db-custom-1-3840` (PostgreSQL instances). For more information, see [Cloud SQL Instance Settings](https://cloud.google.com/sql/docs/mysql/instance-settings).",
      ).optional(),
      userLabels: z.record(z.string(), z.string()).describe(
        'The resource labels for a Cloud SQL instance to use to annotate any related underlying resources such as Compute Engine VMs. An object containing a list of "key": "value" pairs. Example: `{ "name": "wrench", "mass": "18kg", "count": "3" }`.',
      ).optional(),
      zone: z.string().describe(
        "The Google Cloud Platform zone where your Cloud SQL database instance is located.",
      ).optional(),
    }).describe(
      "Immutable. Metadata used to create the destination Cloud SQL database.",
    ).optional(),
  }).describe("A CloudSQL database connection profile.").optional(),
  displayName: z.string().describe("The connection profile display name.")
    .optional(),
  labels: z.record(z.string(), z.string()).describe(
    'The resource labels for connection profile to use to annotate any related underlying resources such as Compute Engine VMs. An object containing a list of "key": "value" pairs. Example: `{ "name": "wrench", "mass": "1.3kg", "count": "3" }`.',
  ).optional(),
  mysql: z.object({
    cloudSqlId: z.string().describe(
      "If the source is a Cloud SQL database, use this field to provide the Cloud SQL instance ID of the source.",
    ).optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source MySQL database.",
    ).optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates If this connection profile password is stored.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source MySQL database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string().describe(
        "Required. A service attachment that exposes a database, and has the following format: projects/{project}/regions/{region}/serviceAttachments/{service_attachment_name}",
      ).optional(),
    }).describe("Private Service Connect connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the destination to connect to the source database.",
    ).optional(),
    staticServiceIpConnectivity: z.object({}).describe(
      "Static Service IP connectivity.",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("A MySQL database connection profile.").optional(),
  name: z.string().describe(
    "The name of this connection profile resource in the form of projects/{project}/locations/{location}/connectionProfiles/{connectionProfile}.",
  ).optional(),
  oracle: z.object({
    databaseService: z.string().describe(
      "Required. Database service for the Oracle connection.",
    ).optional(),
    forwardSshConnectivity: z.object({
      hostname: z.string().describe("Required. Hostname for the SSH tunnel.")
        .optional(),
      password: z.string().describe("Input only. SSH password.").optional(),
      port: z.number().int().describe(
        "Port for the SSH tunnel, default value is 22.",
      ).optional(),
      privateKey: z.string().describe("Input only. SSH private key.")
        .optional(),
      username: z.string().describe("Required. Username for the SSH tunnel.")
        .optional(),
    }).describe("Forward SSH tunnel connectivity.").optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source Oracle database.",
    ).optional(),
    oracleAsmConfig: z.object({
      asmService: z.string().describe(
        "Required. ASM service name for the Oracle ASM connection.",
      ).optional(),
      hostname: z.string().describe(
        "Required. Hostname for the Oracle ASM connection.",
      ).optional(),
      password: z.string().describe(
        "Required. Input only. Password for the Oracle ASM connection.",
      ).optional(),
      passwordSet: z.boolean().describe(
        "Output only. Indicates whether a new password is included in the request.",
      ).optional(),
      port: z.number().int().describe(
        "Required. Port for the Oracle ASM connection.",
      ).optional(),
      ssl: z.object({
        caCertificate: z.string().describe(
          "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
        ).optional(),
        clientCertificate: z.string().describe(
          "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
        ).optional(),
        clientKey: z.string().describe(
          "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
        ).optional(),
        sslFlags: z.record(z.string(), z.string()).describe(
          'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
        ).optional(),
        type: z.enum([
          "SSL_TYPE_UNSPECIFIED",
          "SERVER_ONLY",
          "SERVER_CLIENT",
          "REQUIRED",
          "NONE",
        ]).describe(
          "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
        ).optional(),
      }).describe("Optional. SSL configuration for the Oracle connection.")
        .optional(),
      username: z.string().describe(
        "Required. Username for the Oracle ASM connection.",
      ).optional(),
    }).describe("Optional. Configuration for Oracle ASM connection.")
      .optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates whether a new password is included in the request.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source Oracle database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the connection to the source Oracle database. * Only `SERVER_ONLY` configuration is supported for Oracle SSL. * SSL is supported for Oracle versions 12 and above.",
    ).optional(),
    staticServiceIpConnectivity: z.object({}).describe(
      "Static Service IP connectivity.",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("An Oracle database connection profile.").optional(),
  postgresql: z.object({
    alloydbClusterId: z.string().describe(
      "Optional. If the destination is an AlloyDB database, use this field to provide the AlloyDB cluster ID.",
    ).optional(),
    cloudSqlId: z.string().describe(
      "If the source is a Cloud SQL database, use this field to provide the Cloud SQL instance ID of the source.",
    ).optional(),
    database: z.string().describe(
      "Optional. The name of the specific database within the host.",
    ).optional(),
    enableIamAuthentication: z.boolean().describe(
      "Optional. If true, Database Migration Service will use IAM database authentication to connect to the database.",
    ).optional(),
    forwardSshConnectivity: z.object({
      hostname: z.string().describe("Required. Hostname for the SSH tunnel.")
        .optional(),
      password: z.string().describe("Input only. SSH password.").optional(),
      port: z.number().int().describe(
        "Port for the SSH tunnel, default value is 22.",
      ).optional(),
      privateKey: z.string().describe("Input only. SSH private key.")
        .optional(),
      username: z.string().describe("Required. Username for the SSH tunnel.")
        .optional(),
    }).describe("Forward SSH tunnel connectivity.").optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source PostgreSQL database.",
    ).optional(),
    networkArchitecture: z.enum([
      "NETWORK_ARCHITECTURE_UNSPECIFIED",
      "NETWORK_ARCHITECTURE_OLD_CSQL_PRODUCER",
      "NETWORK_ARCHITECTURE_NEW_CSQL_PRODUCER",
    ]).describe(
      "Output only. If the source is a Cloud SQL database, this field indicates the network architecture it's associated with.",
    ).optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates If this connection profile password is stored.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source PostgreSQL database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string().describe(
        "Required. A service attachment that exposes a database, and has the following format: projects/{project}/regions/{region}/serviceAttachments/{service_attachment_name}",
      ).optional(),
    }).describe("Private Service Connect connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the destination to connect to the source database.",
    ).optional(),
    staticIpConnectivity: z.object({}).describe(
      "Static ip connectivity data (default, no additional details needed).",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("A PostgreSQL database connection profile.").optional(),
  provider: z.enum([
    "DATABASE_PROVIDER_UNSPECIFIED",
    "CLOUDSQL",
    "RDS",
    "AURORA",
    "ALLOYDB",
    "AZURE_DATABASE",
  ]).describe("The database provider.").optional(),
  role: z.enum(["ROLE_UNSPECIFIED", "SOURCE", "DESTINATION"]).describe(
    "Optional. The connection profile role.",
  ).optional(),
  sqlserver: z.object({
    backups: z.object({
      gcsBucket: z.string().describe(
        "Required. The Cloud Storage bucket that stores backups for all replicated databases.",
      ).optional(),
      gcsPrefix: z.string().describe(
        "Optional. Cloud Storage path inside the bucket that stores backups.",
      ).optional(),
    }).describe(
      "The backup details in Cloud Storage for homogeneous migration to Cloud SQL for SQL Server.",
    ).optional(),
    cloudSqlId: z.string().describe(
      "If the source is a Cloud SQL database, use this field to provide the Cloud SQL instance ID of the source.",
    ).optional(),
    cloudSqlProjectId: z.string().describe(
      "Optional. The project id of the Cloud SQL instance. If not provided, the project id of the connection profile will be used.",
    ).optional(),
    database: z.string().describe(
      "Required. The name of the specific database within the host.",
    ).optional(),
    dbmPort: z.number().int().describe(
      "Optional. The Database Mirroring (DBM) port of the source SQL Server instance.",
    ).optional(),
    forwardSshConnectivity: z.object({
      hostname: z.string().describe("Required. Hostname for the SSH tunnel.")
        .optional(),
      password: z.string().describe("Input only. SSH password.").optional(),
      port: z.number().int().describe(
        "Port for the SSH tunnel, default value is 22.",
      ).optional(),
      privateKey: z.string().describe("Input only. SSH private key.")
        .optional(),
      username: z.string().describe("Required. Username for the SSH tunnel.")
        .optional(),
    }).describe("Forward SSH tunnel connectivity.").optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source SQL Server database.",
    ).optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates whether a new password is included in the request.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source SQL Server database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string().describe(
        "Required. A service attachment that exposes a database, and has the following format: projects/{project}/regions/{region}/serviceAttachments/{service_attachment_name}",
      ).optional(),
    }).describe("Private Service Connect connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the destination to connect to the source database.",
    ).optional(),
    staticIpConnectivity: z.object({}).describe(
      "Static IP connectivity data (default, no additional details needed).",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("Connection profile for a SQL Server data source.").optional(),
  state: z.enum([
    "STATE_UNSPECIFIED",
    "DRAFT",
    "CREATING",
    "READY",
    "UPDATING",
    "DELETING",
    "DELETED",
    "FAILED",
  ]).describe(
    "The current connection profile state (e.g. DRAFT, READY, or FAILED).",
  ).optional(),
  connectionProfileId: z.string().describe(
    "Required. The connection profile identifier.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two requests with the same ID, then the second request is ignored. It is recommended to always set this value to a UUID. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
  ).optional(),
  skipValidation: z.string().describe(
    "Optional. Create the connection profile without validating it. The default is false. Only supported for Oracle connection profiles.",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  alloydb: z.object({
    clusterId: z.string(),
    settings: z.object({
      databaseVersion: z.string(),
      encryptionConfig: z.object({
        kmsKeyName: z.string(),
      }),
      initialUser: z.object({
        password: z.string(),
        passwordSet: z.boolean(),
        user: z.string(),
      }),
      labels: z.record(z.string(), z.unknown()),
      primaryInstanceSettings: z.object({
        databaseFlags: z.record(z.string(), z.unknown()),
        id: z.string(),
        instanceNetworkConfig: z.object({
          authorizedExternalNetworks: z.array(z.unknown()),
          enableOutboundPublicIp: z.boolean(),
          enablePublicIp: z.boolean(),
        }),
        labels: z.record(z.string(), z.unknown()),
        machineConfig: z.object({
          cpuCount: z.number(),
          machineType: z.string(),
        }),
        outboundPublicIpAddresses: z.array(z.string()),
        privateIp: z.string(),
      }),
      vpcNetwork: z.string(),
    }),
  }).optional(),
  cloudsql: z.object({
    additionalPublicIp: z.string(),
    cloudSqlId: z.string(),
    privateIp: z.string(),
    publicIp: z.string(),
    settings: z.object({
      activationPolicy: z.string(),
      autoStorageIncrease: z.boolean(),
      availabilityType: z.string(),
      cmekKeyName: z.string(),
      collation: z.string(),
      dataCacheConfig: z.object({
        dataCacheEnabled: z.boolean(),
      }),
      dataDiskProvisionedIops: z.string(),
      dataDiskProvisionedThroughput: z.string(),
      dataDiskSizeGb: z.string(),
      dataDiskType: z.string(),
      databaseFlags: z.record(z.string(), z.unknown()),
      databaseVersion: z.string(),
      databaseVersionName: z.string(),
      edition: z.string(),
      ipConfig: z.object({
        allocatedIpRange: z.string(),
        authorizedNetworks: z.array(z.object({
          expireTime: z.unknown(),
          label: z.unknown(),
          ttl: z.unknown(),
          value: z.unknown(),
        })),
        enableIpv4: z.boolean(),
        privateNetwork: z.string(),
        requireSsl: z.boolean(),
      }),
      rootPassword: z.string(),
      rootPasswordSet: z.boolean(),
      secondaryZone: z.string(),
      sourceId: z.string(),
      storageAutoResizeLimit: z.string(),
      tier: z.string(),
      userLabels: z.record(z.string(), z.unknown()),
      zone: z.string(),
    }),
  }).optional(),
  createTime: z.string().optional(),
  displayName: z.string().optional(),
  error: z.object({
    code: z.number(),
    details: z.array(z.record(z.string(), z.unknown())),
    message: z.string(),
  }).optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  mysql: z.object({
    cloudSqlId: z.string(),
    host: z.string(),
    password: z.string(),
    passwordSet: z.boolean(),
    port: z.number(),
    privateConnectivity: z.object({
      privateConnection: z.string(),
    }),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string(),
    }),
    ssl: z.object({
      caCertificate: z.string(),
      clientCertificate: z.string(),
      clientKey: z.string(),
      sslFlags: z.record(z.string(), z.unknown()),
      type: z.string(),
    }),
    staticServiceIpConnectivity: z.object({}),
    username: z.string(),
  }).optional(),
  name: z.string(),
  oracle: z.object({
    databaseService: z.string(),
    forwardSshConnectivity: z.object({
      hostname: z.string(),
      password: z.string(),
      port: z.number(),
      privateKey: z.string(),
      username: z.string(),
    }),
    host: z.string(),
    oracleAsmConfig: z.object({
      asmService: z.string(),
      hostname: z.string(),
      password: z.string(),
      passwordSet: z.boolean(),
      port: z.number(),
      ssl: z.object({
        caCertificate: z.string(),
        clientCertificate: z.string(),
        clientKey: z.string(),
        sslFlags: z.record(z.string(), z.unknown()),
        type: z.string(),
      }),
      username: z.string(),
    }),
    password: z.string(),
    passwordSet: z.boolean(),
    port: z.number(),
    privateConnectivity: z.object({
      privateConnection: z.string(),
    }),
    ssl: z.object({
      caCertificate: z.string(),
      clientCertificate: z.string(),
      clientKey: z.string(),
      sslFlags: z.record(z.string(), z.unknown()),
      type: z.string(),
    }),
    staticServiceIpConnectivity: z.object({}),
    username: z.string(),
  }).optional(),
  postgresql: z.object({
    alloydbClusterId: z.string(),
    cloudSqlId: z.string(),
    database: z.string(),
    enableIamAuthentication: z.boolean(),
    forwardSshConnectivity: z.object({
      hostname: z.string(),
      password: z.string(),
      port: z.number(),
      privateKey: z.string(),
      username: z.string(),
    }),
    host: z.string(),
    networkArchitecture: z.string(),
    password: z.string(),
    passwordSet: z.boolean(),
    port: z.number(),
    privateConnectivity: z.object({
      privateConnection: z.string(),
    }),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string(),
    }),
    ssl: z.object({
      caCertificate: z.string(),
      clientCertificate: z.string(),
      clientKey: z.string(),
      sslFlags: z.record(z.string(), z.unknown()),
      type: z.string(),
    }),
    staticIpConnectivity: z.object({}),
    username: z.string(),
  }).optional(),
  provider: z.string().optional(),
  role: z.string().optional(),
  satisfiesPzi: z.boolean().optional(),
  satisfiesPzs: z.boolean().optional(),
  sqlserver: z.object({
    backups: z.object({
      gcsBucket: z.string(),
      gcsPrefix: z.string(),
    }),
    cloudSqlId: z.string(),
    cloudSqlProjectId: z.string(),
    database: z.string(),
    dbmPort: z.number(),
    forwardSshConnectivity: z.object({
      hostname: z.string(),
      password: z.string(),
      port: z.number(),
      privateKey: z.string(),
      username: z.string(),
    }),
    host: z.string(),
    password: z.string(),
    passwordSet: z.boolean(),
    port: z.number(),
    privateConnectivity: z.object({
      privateConnection: z.string(),
    }),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string(),
    }),
    ssl: z.object({
      caCertificate: z.string(),
      clientCertificate: z.string(),
      clientKey: z.string(),
      sslFlags: z.record(z.string(), z.unknown()),
      type: z.string(),
    }),
    staticIpConnectivity: z.object({}),
    username: z.string(),
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
  alloydb: z.object({
    clusterId: z.string().describe(
      "Required. The AlloyDB cluster ID that this connection profile is associated with.",
    ).optional(),
    settings: z.object({
      databaseVersion: z.enum([
        "DATABASE_VERSION_UNSPECIFIED",
        "POSTGRES_14",
        "POSTGRES_15",
        "POSTGRES_16",
        "POSTGRES_17",
        "POSTGRES_18",
      ]).describe(
        "Optional. The database engine major version. This is an optional field. If a database version is not supplied at cluster creation time, then a default database version will be used.",
      ).optional(),
      encryptionConfig: z.object({
        kmsKeyName: z.string().describe(
          "The fully-qualified resource name of the KMS key. Each Cloud KMS key is regionalized and has the following format: projects/[PROJECT]/locations/[REGION]/keyRings/[RING]/cryptoKeys/[KEY_NAME]",
        ).optional(),
      }).describe(
        "Optional. The encryption config can be specified to encrypt the data disks and other persistent data resources of a cluster with a customer-managed encryption key (CMEK). When this field is not specified, the cluster will then use default encryption scheme to protect the user data.",
      ).optional(),
      initialUser: z.object({
        password: z.string().describe("The initial password for the user.")
          .optional(),
        passwordSet: z.boolean().describe(
          "Output only. Indicates if the initial_user.password field has been set.",
        ).optional(),
        user: z.string().describe("The database username.").optional(),
      }).describe(
        "Required. Input only. Initial user to setup during cluster creation. Required.",
      ).optional(),
      labels: z.record(z.string(), z.string()).describe(
        "Labels for the AlloyDB cluster created by DMS. An object containing a list of 'key', 'value' pairs.",
      ).optional(),
      primaryInstanceSettings: z.object({
        databaseFlags: z.record(z.string(), z.string()).describe(
          "Database flags to pass to AlloyDB when DMS is creating the AlloyDB cluster and instances. See the AlloyDB documentation for how these can be used.",
        ).optional(),
        id: z.string().describe(
          'Required. The ID of the AlloyDB primary instance. The ID must satisfy the regex expression "[a-z0-9-]+".',
        ).optional(),
        instanceNetworkConfig: z.object({
          authorizedExternalNetworks: z.array(z.unknown()).describe(
            "Optional. A list of external network authorized to access this instance.",
          ).optional(),
          enableOutboundPublicIp: z.boolean().describe(
            "Optional. Enabling an outbound public IP address to support a database server sending requests out into the internet.",
          ).optional(),
          enablePublicIp: z.boolean().describe(
            "Optional. Enabling public ip for the instance.",
          ).optional(),
        }).describe(
          "Optional. Metadata related to instance level network configuration.",
        ).optional(),
        labels: z.record(z.string(), z.string()).describe(
          "Labels for the AlloyDB primary instance created by DMS. An object containing a list of 'key', 'value' pairs.",
        ).optional(),
        machineConfig: z.object({
          cpuCount: z.number().int().describe(
            "The number of CPU's in the VM instance.",
          ).optional(),
          machineType: z.string().describe(
            'Optional. Machine type of the VM instance. E.g. "n2-highmem-4", "n2-highmem-8", "c4a-highmem-4-lssd". cpu_count must match the number of vCPUs in the machine type.',
          ).optional(),
        }).describe(
          "Configuration for the machines that host the underlying database engine.",
        ).optional(),
        outboundPublicIpAddresses: z.array(z.string()).describe(
          "Output only. All outbound public IP addresses configured for the instance.",
        ).optional(),
        privateIp: z.string().describe(
          "Output only. The private IP address for the Instance. This is the connection endpoint for an end-user application.",
        ).optional(),
      }).describe("Settings for the cluster's primary instance").optional(),
      vpcNetwork: z.string().describe(
        'Required. The resource link for the VPC network in which cluster resources are created and from which they are accessible via Private IP. The network must belong to the same project as the cluster. It is specified in the form: "projects/{project_number}/global/networks/{network_id}". This is required to create a cluster.',
      ).optional(),
    }).describe(
      "Immutable. Metadata used to create the destination AlloyDB cluster.",
    ).optional(),
  }).describe("An AlloyDB cluster connection profile.").optional(),
  cloudsql: z.object({
    additionalPublicIp: z.string().describe(
      "Output only. The Cloud SQL database instance's additional (outgoing) public IP. Used when the Cloud SQL database availability type is REGIONAL (i.e. multiple zones / highly available).",
    ).optional(),
    cloudSqlId: z.string().describe(
      "Output only. The Cloud SQL instance ID that this connection profile is associated with.",
    ).optional(),
    privateIp: z.string().describe(
      "Output only. The Cloud SQL database instance's private IP.",
    ).optional(),
    publicIp: z.string().describe(
      "Output only. The Cloud SQL database instance's public IP.",
    ).optional(),
    settings: z.object({
      activationPolicy: z.enum([
        "SQL_ACTIVATION_POLICY_UNSPECIFIED",
        "ALWAYS",
        "NEVER",
      ]).describe(
        "The activation policy specifies when the instance is activated; it is applicable only when the instance state is 'RUNNABLE'. Valid values: 'ALWAYS': The instance is on, and remains so even in the absence of connection requests. `NEVER`: The instance is off; it is not activated, even if a connection request arrives.",
      ).optional(),
      autoStorageIncrease: z.boolean().describe(
        "[default: ON] If you enable this setting, Cloud SQL checks your available storage every 30 seconds. If the available storage falls below a threshold size, Cloud SQL automatically adds additional storage capacity. If the available storage repeatedly falls below the threshold size, Cloud SQL continues to add storage until it reaches the maximum of 30 TB.",
      ).optional(),
      availabilityType: z.enum([
        "SQL_AVAILABILITY_TYPE_UNSPECIFIED",
        "ZONAL",
        "REGIONAL",
      ]).describe(
        "Optional. Availability type. Potential values: * `ZONAL`: The instance serves data from only one zone. Outages in that zone affect data availability. * `REGIONAL`: The instance can serve data from more than one zone in a region (it is highly available).",
      ).optional(),
      cmekKeyName: z.string().describe(
        "The KMS key name used for the csql instance.",
      ).optional(),
      collation: z.string().describe(
        "The Cloud SQL default instance level collation.",
      ).optional(),
      dataCacheConfig: z.object({
        dataCacheEnabled: z.boolean().describe(
          "Optional. Whether data cache is enabled for the instance.",
        ).optional(),
      }).describe(
        "Optional. Data cache is an optional feature available for Cloud SQL for MySQL Enterprise Plus edition only. For more information on data cache, see [Data cache overview](https://cloud.google.com/sql/help/mysql-data-cache) in Cloud SQL documentation.",
      ).optional(),
      dataDiskProvisionedIops: z.string().describe(
        "Optional. Provisioned number of I/O operations per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
      ).optional(),
      dataDiskProvisionedThroughput: z.string().describe(
        "Optional. Provisioned throughput measured in MiB per second for the data disk. This field is only used for hyperdisk-balanced disk types.",
      ).optional(),
      dataDiskSizeGb: z.string().describe(
        "The storage capacity available to the database, in GB. The minimum (and default) size is 10GB.",
      ).optional(),
      dataDiskType: z.enum([
        "SQL_DATA_DISK_TYPE_UNSPECIFIED",
        "PD_SSD",
        "PD_HDD",
        "HYPERDISK_BALANCED",
      ]).describe(
        "The type of storage: `PD_SSD` (default) or `PD_HDD` or `HYPERDISK_BALANCED`.",
      ).optional(),
      databaseFlags: z.record(z.string(), z.string()).describe(
        'The database flags passed to the Cloud SQL instance at startup. An object containing a list of "key": value pairs. Example: { "name": "wrench", "mass": "1.3kg", "count": "3" }.',
      ).optional(),
      databaseVersion: z.enum([
        "SQL_DATABASE_VERSION_UNSPECIFIED",
        "MYSQL_5_6",
        "MYSQL_5_7",
        "MYSQL_8_0",
        "MYSQL_8_0_18",
        "MYSQL_8_0_26",
        "MYSQL_8_0_27",
        "MYSQL_8_0_28",
        "MYSQL_8_0_30",
        "MYSQL_8_0_31",
        "MYSQL_8_0_32",
        "MYSQL_8_0_33",
        "MYSQL_8_0_34",
        "MYSQL_8_0_35",
        "MYSQL_8_0_36",
        "MYSQL_8_0_37",
        "MYSQL_8_4",
        "POSTGRES_9_6",
        "POSTGRES_11",
        "POSTGRES_10",
        "POSTGRES_12",
        "POSTGRES_13",
        "POSTGRES_14",
        "POSTGRES_15",
        "POSTGRES_16",
      ]).describe(
        "The database engine type and version. Deprecated. Use database_version_name instead.",
      ).optional(),
      databaseVersionName: z.string().describe(
        "Optional. The database engine type and version name.",
      ).optional(),
      edition: z.enum(["EDITION_UNSPECIFIED", "ENTERPRISE", "ENTERPRISE_PLUS"])
        .describe("Optional. The edition of the given Cloud SQL instance.")
        .optional(),
      ipConfig: z.object({
        allocatedIpRange: z.string().describe(
          "Optional. The name of the allocated IP address range for the private IP Cloud SQL instance. This name refers to an already allocated IP range address. If set, the instance IP address will be created in the allocated range. Note that this IP address range can't be modified after the instance is created. If you change the VPC when configuring connectivity settings for the migration job, this field is not relevant.",
        ).optional(),
        authorizedNetworks: z.array(z.object({
          expireTime: z.unknown().describe(
            "The time when this access control entry expires in [RFC 3339](https://tools.ietf.org/html/rfc3339) format, for example: `2012-11-15T16:19:00.094Z`.",
          ).optional(),
          label: z.unknown().describe("A label to identify this entry.")
            .optional(),
          ttl: z.unknown().describe(
            "Input only. The time-to-leave of this access control entry.",
          ).optional(),
          value: z.unknown().describe(
            "The allowlisted value for the access control list.",
          ).optional(),
        })).describe(
          "The list of external networks that are allowed to connect to the instance using the IP. See https://en.wikipedia.org/wiki/CIDR_notation#CIDR_notation, also known as 'slash' notation (e.g. `192.168.100.0/24`).",
        ).optional(),
        enableIpv4: z.boolean().describe(
          "Whether the instance should be assigned an IPv4 address or not.",
        ).optional(),
        privateNetwork: z.string().describe(
          "The resource link for the VPC network from which the Cloud SQL instance is accessible for private IP. For example, `projects/myProject/global/networks/default`. This setting can be updated, but it cannot be removed after it is set.",
        ).optional(),
        requireSsl: z.boolean().describe(
          "Whether SSL connections over IP should be enforced or not.",
        ).optional(),
      }).describe(
        "The settings for IP Management. This allows to enable or disable the instance IP and manage which external networks can connect to the instance. The IPv4 address cannot be disabled.",
      ).optional(),
      rootPassword: z.string().describe("Input only. Initial root password.")
        .optional(),
      rootPasswordSet: z.boolean().describe(
        "Output only. Indicates If this connection profile root password is stored.",
      ).optional(),
      secondaryZone: z.string().describe(
        "Optional. The Google Cloud Platform zone where the failover Cloud SQL database instance is located. Used when the Cloud SQL database availability type is REGIONAL (i.e. multiple zones / highly available).",
      ).optional(),
      sourceId: z.string().describe(
        "The Database Migration Service source connection profile ID, in the format: `projects/my_project_name/locations/us-central1/connectionProfiles/connection_profile_ID`",
      ).optional(),
      storageAutoResizeLimit: z.string().describe(
        "The maximum size to which storage capacity can be automatically increased. The default value is 0, which specifies that there is no limit.",
      ).optional(),
      tier: z.string().describe(
        "The tier (or machine type) for this instance, for example: `db-n1-standard-1` (MySQL instances) or `db-custom-1-3840` (PostgreSQL instances). For more information, see [Cloud SQL Instance Settings](https://cloud.google.com/sql/docs/mysql/instance-settings).",
      ).optional(),
      userLabels: z.record(z.string(), z.string()).describe(
        'The resource labels for a Cloud SQL instance to use to annotate any related underlying resources such as Compute Engine VMs. An object containing a list of "key": "value" pairs. Example: `{ "name": "wrench", "mass": "18kg", "count": "3" }`.',
      ).optional(),
      zone: z.string().describe(
        "The Google Cloud Platform zone where your Cloud SQL database instance is located.",
      ).optional(),
    }).describe(
      "Immutable. Metadata used to create the destination Cloud SQL database.",
    ).optional(),
  }).describe("A CloudSQL database connection profile.").optional(),
  displayName: z.string().describe("The connection profile display name.")
    .optional(),
  labels: z.record(z.string(), z.string()).describe(
    'The resource labels for connection profile to use to annotate any related underlying resources such as Compute Engine VMs. An object containing a list of "key": "value" pairs. Example: `{ "name": "wrench", "mass": "1.3kg", "count": "3" }`.',
  ).optional(),
  mysql: z.object({
    cloudSqlId: z.string().describe(
      "If the source is a Cloud SQL database, use this field to provide the Cloud SQL instance ID of the source.",
    ).optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source MySQL database.",
    ).optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates If this connection profile password is stored.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source MySQL database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string().describe(
        "Required. A service attachment that exposes a database, and has the following format: projects/{project}/regions/{region}/serviceAttachments/{service_attachment_name}",
      ).optional(),
    }).describe("Private Service Connect connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the destination to connect to the source database.",
    ).optional(),
    staticServiceIpConnectivity: z.object({}).describe(
      "Static Service IP connectivity.",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("A MySQL database connection profile.").optional(),
  name: z.string().describe(
    "The name of this connection profile resource in the form of projects/{project}/locations/{location}/connectionProfiles/{connectionProfile}.",
  ).optional(),
  oracle: z.object({
    databaseService: z.string().describe(
      "Required. Database service for the Oracle connection.",
    ).optional(),
    forwardSshConnectivity: z.object({
      hostname: z.string().describe("Required. Hostname for the SSH tunnel.")
        .optional(),
      password: z.string().describe("Input only. SSH password.").optional(),
      port: z.number().int().describe(
        "Port for the SSH tunnel, default value is 22.",
      ).optional(),
      privateKey: z.string().describe("Input only. SSH private key.")
        .optional(),
      username: z.string().describe("Required. Username for the SSH tunnel.")
        .optional(),
    }).describe("Forward SSH tunnel connectivity.").optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source Oracle database.",
    ).optional(),
    oracleAsmConfig: z.object({
      asmService: z.string().describe(
        "Required. ASM service name for the Oracle ASM connection.",
      ).optional(),
      hostname: z.string().describe(
        "Required. Hostname for the Oracle ASM connection.",
      ).optional(),
      password: z.string().describe(
        "Required. Input only. Password for the Oracle ASM connection.",
      ).optional(),
      passwordSet: z.boolean().describe(
        "Output only. Indicates whether a new password is included in the request.",
      ).optional(),
      port: z.number().int().describe(
        "Required. Port for the Oracle ASM connection.",
      ).optional(),
      ssl: z.object({
        caCertificate: z.string().describe(
          "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
        ).optional(),
        clientCertificate: z.string().describe(
          "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
        ).optional(),
        clientKey: z.string().describe(
          "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
        ).optional(),
        sslFlags: z.record(z.string(), z.string()).describe(
          'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
        ).optional(),
        type: z.enum([
          "SSL_TYPE_UNSPECIFIED",
          "SERVER_ONLY",
          "SERVER_CLIENT",
          "REQUIRED",
          "NONE",
        ]).describe(
          "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
        ).optional(),
      }).describe("Optional. SSL configuration for the Oracle connection.")
        .optional(),
      username: z.string().describe(
        "Required. Username for the Oracle ASM connection.",
      ).optional(),
    }).describe("Optional. Configuration for Oracle ASM connection.")
      .optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates whether a new password is included in the request.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source Oracle database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the connection to the source Oracle database. * Only `SERVER_ONLY` configuration is supported for Oracle SSL. * SSL is supported for Oracle versions 12 and above.",
    ).optional(),
    staticServiceIpConnectivity: z.object({}).describe(
      "Static Service IP connectivity.",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("An Oracle database connection profile.").optional(),
  postgresql: z.object({
    alloydbClusterId: z.string().describe(
      "Optional. If the destination is an AlloyDB database, use this field to provide the AlloyDB cluster ID.",
    ).optional(),
    cloudSqlId: z.string().describe(
      "If the source is a Cloud SQL database, use this field to provide the Cloud SQL instance ID of the source.",
    ).optional(),
    database: z.string().describe(
      "Optional. The name of the specific database within the host.",
    ).optional(),
    enableIamAuthentication: z.boolean().describe(
      "Optional. If true, Database Migration Service will use IAM database authentication to connect to the database.",
    ).optional(),
    forwardSshConnectivity: z.object({
      hostname: z.string().describe("Required. Hostname for the SSH tunnel.")
        .optional(),
      password: z.string().describe("Input only. SSH password.").optional(),
      port: z.number().int().describe(
        "Port for the SSH tunnel, default value is 22.",
      ).optional(),
      privateKey: z.string().describe("Input only. SSH private key.")
        .optional(),
      username: z.string().describe("Required. Username for the SSH tunnel.")
        .optional(),
    }).describe("Forward SSH tunnel connectivity.").optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source PostgreSQL database.",
    ).optional(),
    networkArchitecture: z.enum([
      "NETWORK_ARCHITECTURE_UNSPECIFIED",
      "NETWORK_ARCHITECTURE_OLD_CSQL_PRODUCER",
      "NETWORK_ARCHITECTURE_NEW_CSQL_PRODUCER",
    ]).describe(
      "Output only. If the source is a Cloud SQL database, this field indicates the network architecture it's associated with.",
    ).optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates If this connection profile password is stored.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source PostgreSQL database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string().describe(
        "Required. A service attachment that exposes a database, and has the following format: projects/{project}/regions/{region}/serviceAttachments/{service_attachment_name}",
      ).optional(),
    }).describe("Private Service Connect connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the destination to connect to the source database.",
    ).optional(),
    staticIpConnectivity: z.object({}).describe(
      "Static ip connectivity data (default, no additional details needed).",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("A PostgreSQL database connection profile.").optional(),
  provider: z.enum([
    "DATABASE_PROVIDER_UNSPECIFIED",
    "CLOUDSQL",
    "RDS",
    "AURORA",
    "ALLOYDB",
    "AZURE_DATABASE",
  ]).describe("The database provider.").optional(),
  role: z.enum(["ROLE_UNSPECIFIED", "SOURCE", "DESTINATION"]).describe(
    "Optional. The connection profile role.",
  ).optional(),
  sqlserver: z.object({
    backups: z.object({
      gcsBucket: z.string().describe(
        "Required. The Cloud Storage bucket that stores backups for all replicated databases.",
      ).optional(),
      gcsPrefix: z.string().describe(
        "Optional. Cloud Storage path inside the bucket that stores backups.",
      ).optional(),
    }).describe(
      "The backup details in Cloud Storage for homogeneous migration to Cloud SQL for SQL Server.",
    ).optional(),
    cloudSqlId: z.string().describe(
      "If the source is a Cloud SQL database, use this field to provide the Cloud SQL instance ID of the source.",
    ).optional(),
    cloudSqlProjectId: z.string().describe(
      "Optional. The project id of the Cloud SQL instance. If not provided, the project id of the connection profile will be used.",
    ).optional(),
    database: z.string().describe(
      "Required. The name of the specific database within the host.",
    ).optional(),
    dbmPort: z.number().int().describe(
      "Optional. The Database Mirroring (DBM) port of the source SQL Server instance.",
    ).optional(),
    forwardSshConnectivity: z.object({
      hostname: z.string().describe("Required. Hostname for the SSH tunnel.")
        .optional(),
      password: z.string().describe("Input only. SSH password.").optional(),
      port: z.number().int().describe(
        "Port for the SSH tunnel, default value is 22.",
      ).optional(),
      privateKey: z.string().describe("Input only. SSH private key.")
        .optional(),
      username: z.string().describe("Required. Username for the SSH tunnel.")
        .optional(),
    }).describe("Forward SSH tunnel connectivity.").optional(),
    host: z.string().describe(
      "Required. The IP or hostname of the source SQL Server database.",
    ).optional(),
    password: z.string().describe(
      "Required. Input only. The password for the user that Database Migration Service will be using to connect to the database. This field is not returned on request, and the value is encrypted when stored in Database Migration Service.",
    ).optional(),
    passwordSet: z.boolean().describe(
      "Output only. Indicates whether a new password is included in the request.",
    ).optional(),
    port: z.number().int().describe(
      "Required. The network port of the source SQL Server database.",
    ).optional(),
    privateConnectivity: z.object({
      privateConnection: z.string().describe(
        "Required. The resource name (URI) of the private connection.",
      ).optional(),
    }).describe("Private connectivity.").optional(),
    privateServiceConnectConnectivity: z.object({
      serviceAttachment: z.string().describe(
        "Required. A service attachment that exposes a database, and has the following format: projects/{project}/regions/{region}/serviceAttachments/{service_attachment_name}",
      ).optional(),
    }).describe("Private Service Connect connectivity.").optional(),
    ssl: z.object({
      caCertificate: z.string().describe(
        "Required. Input only. The x509 PEM-encoded certificate of the CA that signed the source database server's certificate. The replica will use this certificate to verify it's connecting to the right host.",
      ).optional(),
      clientCertificate: z.string().describe(
        "Input only. The x509 PEM-encoded certificate that will be used by the replica to authenticate against the source database server.If this field is used then the 'client_key' field is mandatory.",
      ).optional(),
      clientKey: z.string().describe(
        "Input only. The unencrypted PKCS#1 or PKCS#8 PEM-encoded private key associated with the Client Certificate. If this field is used then the 'client_certificate' field is mandatory.",
      ).optional(),
      sslFlags: z.record(z.string(), z.string()).describe(
        'Optional. SSL flags used for establishing SSL connection to the source database. Only source specific flags are supported. An object containing a list of "key": "value" pairs. Example: { "server_certificate_hostname": "server.com"}.',
      ).optional(),
      type: z.enum([
        "SSL_TYPE_UNSPECIFIED",
        "SERVER_ONLY",
        "SERVER_CLIENT",
        "REQUIRED",
        "NONE",
      ]).describe(
        "Optional. The ssl config type according to 'client_key', 'client_certificate' and 'ca_certificate'.",
      ).optional(),
    }).describe(
      "SSL configuration for the destination to connect to the source database.",
    ).optional(),
    staticIpConnectivity: z.object({}).describe(
      "Static IP connectivity data (default, no additional details needed).",
    ).optional(),
    username: z.string().describe(
      "Required. The username that Database Migration Service will use to connect to the database. The value is encrypted when stored in Database Migration Service.",
    ).optional(),
  }).describe("Connection profile for a SQL Server data source.").optional(),
  state: z.enum([
    "STATE_UNSPECIFIED",
    "DRAFT",
    "CREATING",
    "READY",
    "UPDATING",
    "DELETING",
    "DELETED",
    "FAILED",
  ]).describe(
    "The current connection profile state (e.g. DRAFT, READY, or FAILED).",
  ).optional(),
  connectionProfileId: z.string().describe(
    "Required. The connection profile identifier.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two requests with the same ID, then the second request is ignored. It is recommended to always set this value to a UUID. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
  ).optional(),
  skipValidation: z.string().describe(
    "Optional. Create the connection profile without validating it. The default is false. Only supported for Oracle connection profiles.",
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

/** Swamp extension model for Google Cloud Database Migration ConnectionProfiles. Registered at `@swamp/gcp/datamigration/connectionprofiles`. */
export const model = {
  type: "@swamp/gcp/datamigration/connectionprofiles",
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
      toVersion: "2026.05.18.1",
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
      description: "Removed: error",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { error: _error, ...rest } = old;
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
        "Removed: clusterId, settings, databaseVersion, encryptionConfig, kmsKeyName, initialUser, password, passwordSet, user, primaryInstanceSettings, databaseFlags, id, instanceNetworkConfig, authorizedExternalNetworks, enableOutboundPublicIp, enablePublicIp, machineConfig, cpuCount, machineType, outboundPublicIpAddresses, privateIp, vpcNetwork, additionalPublicIp, cloudSqlId, privateIp, publicIp, settings, activationPolicy, autoStorageIncrease, availabilityType, cmekKeyName, collation, dataCacheConfig, dataCacheEnabled, dataDiskProvisionedIops, dataDiskProvisionedThroughput, dataDiskSizeGb, dataDiskType, databaseFlags, databaseVersion, databaseVersionName, edition, ipConfig, allocatedIpRange, authorizedNetworks, expireTime, label, ttl, value, enableIpv4, privateNetwork, requireSsl, rootPassword, rootPasswordSet, secondaryZone, sourceId, storageAutoResizeLimit, tier, userLabels, zone, cloudSqlId, host, password, passwordSet, port, ssl, caCertificate, clientCertificate, clientKey, sslFlags, type, username, databaseService, forwardSshConnectivity, hostname, password, port, privateKey, username, host, oracleAsmConfig, asmService, hostname, password, passwordSet, port, ssl, caCertificate, clientCertificate, clientKey, sslFlags, type, username, password, passwordSet, port, privateConnectivity, privateConnection, ssl, caCertificate, clientCertificate, clientKey, sslFlags, type, staticServiceIpConnectivity, username, alloydbClusterId, cloudSqlId, database, enableIamAuthentication, forwardSshConnectivity, hostname, password, port, privateKey, username, host, networkArchitecture, password, passwordSet, port, privateConnectivity, privateConnection, privateServiceConnectConnectivity, serviceAttachment, ssl, caCertificate, clientCertificate, clientKey, sslFlags, type, staticIpConnectivity, username, backups, gcsBucket, gcsPrefix, cloudSqlId, cloudSqlProjectId, database, dbmPort, forwardSshConnectivity, hostname, password, port, privateKey, username, host, password, passwordSet, port, privateConnectivity, privateConnection, privateServiceConnectConnectivity, serviceAttachment, ssl, caCertificate, clientCertificate, clientKey, sslFlags, type, staticIpConnectivity, username",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          clusterId: _clusterId,
          settings: _settings,
          databaseVersion: _databaseVersion,
          encryptionConfig: _encryptionConfig,
          kmsKeyName: _kmsKeyName,
          initialUser: _initialUser,
          password: _password,
          passwordSet: _passwordSet,
          user: _user,
          primaryInstanceSettings: _primaryInstanceSettings,
          databaseFlags: _databaseFlags,
          id: _id,
          instanceNetworkConfig: _instanceNetworkConfig,
          authorizedExternalNetworks: _authorizedExternalNetworks,
          enableOutboundPublicIp: _enableOutboundPublicIp,
          enablePublicIp: _enablePublicIp,
          machineConfig: _machineConfig,
          cpuCount: _cpuCount,
          machineType: _machineType,
          outboundPublicIpAddresses: _outboundPublicIpAddresses,
          privateIp: _privateIp,
          vpcNetwork: _vpcNetwork,
          additionalPublicIp: _additionalPublicIp,
          cloudSqlId: _cloudSqlId,
          publicIp: _publicIp,
          activationPolicy: _activationPolicy,
          autoStorageIncrease: _autoStorageIncrease,
          availabilityType: _availabilityType,
          cmekKeyName: _cmekKeyName,
          collation: _collation,
          dataCacheConfig: _dataCacheConfig,
          dataCacheEnabled: _dataCacheEnabled,
          dataDiskProvisionedIops: _dataDiskProvisionedIops,
          dataDiskProvisionedThroughput: _dataDiskProvisionedThroughput,
          dataDiskSizeGb: _dataDiskSizeGb,
          dataDiskType: _dataDiskType,
          databaseVersionName: _databaseVersionName,
          edition: _edition,
          ipConfig: _ipConfig,
          allocatedIpRange: _allocatedIpRange,
          authorizedNetworks: _authorizedNetworks,
          expireTime: _expireTime,
          label: _label,
          ttl: _ttl,
          value: _value,
          enableIpv4: _enableIpv4,
          privateNetwork: _privateNetwork,
          requireSsl: _requireSsl,
          rootPassword: _rootPassword,
          rootPasswordSet: _rootPasswordSet,
          secondaryZone: _secondaryZone,
          sourceId: _sourceId,
          storageAutoResizeLimit: _storageAutoResizeLimit,
          tier: _tier,
          userLabels: _userLabels,
          zone: _zone,
          host: _host,
          port: _port,
          ssl: _ssl,
          caCertificate: _caCertificate,
          clientCertificate: _clientCertificate,
          clientKey: _clientKey,
          sslFlags: _sslFlags,
          type: _type,
          username: _username,
          databaseService: _databaseService,
          forwardSshConnectivity: _forwardSshConnectivity,
          hostname: _hostname,
          privateKey: _privateKey,
          oracleAsmConfig: _oracleAsmConfig,
          asmService: _asmService,
          privateConnectivity: _privateConnectivity,
          privateConnection: _privateConnection,
          staticServiceIpConnectivity: _staticServiceIpConnectivity,
          alloydbClusterId: _alloydbClusterId,
          database: _database,
          enableIamAuthentication: _enableIamAuthentication,
          networkArchitecture: _networkArchitecture,
          privateServiceConnectConnectivity: _privateServiceConnectConnectivity,
          serviceAttachment: _serviceAttachment,
          staticIpConnectivity: _staticIpConnectivity,
          backups: _backups,
          gcsBucket: _gcsBucket,
          gcsPrefix: _gcsPrefix,
          cloudSqlProjectId: _cloudSqlProjectId,
          dbmPort: _dbmPort,
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
      description: "A connection profile definition.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a connectionProfiles",
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
        if (g["alloydb"] !== undefined) body["alloydb"] = g["alloydb"];
        if (g["cloudsql"] !== undefined) body["cloudsql"] = g["cloudsql"];
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["mysql"] !== undefined) body["mysql"] = g["mysql"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["oracle"] !== undefined) body["oracle"] = g["oracle"];
        if (g["postgresql"] !== undefined) body["postgresql"] = g["postgresql"];
        if (g["provider"] !== undefined) body["provider"] = g["provider"];
        if (g["role"] !== undefined) body["role"] = g["role"];
        if (g["sqlserver"] !== undefined) body["sqlserver"] = g["sqlserver"];
        if (g["state"] !== undefined) body["state"] = g["state"];
        if (g["connectionProfileId"] !== undefined) {
          params["connectionProfileId"] = String(g["connectionProfileId"]);
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
        if (g["skipValidation"] !== undefined) {
          params["skipValidation"] = String(g["skipValidation"]);
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
              "readyValues": ["READY"],
              "failedValues": ["FAILED"],
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
      description: "Get a connectionProfiles",
      arguments: z.object({
        identifier: z.string().describe("The name of the connectionProfiles"),
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
      description: "Update connectionProfiles attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific connectionProfiles by name (e.g. one discovered by list)",
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
        if (g["alloydb"] !== undefined) body["alloydb"] = g["alloydb"];
        if (g["cloudsql"] !== undefined) body["cloudsql"] = g["cloudsql"];
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["mysql"] !== undefined) body["mysql"] = g["mysql"];
        if (g["oracle"] !== undefined) body["oracle"] = g["oracle"];
        if (g["postgresql"] !== undefined) body["postgresql"] = g["postgresql"];
        if (g["provider"] !== undefined) body["provider"] = g["provider"];
        if (g["role"] !== undefined) body["role"] = g["role"];
        if (g["sqlserver"] !== undefined) body["sqlserver"] = g["sqlserver"];
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
          (args.waitForReady ?? true)
            ? {
              "statusField": "state",
              "readyValues": ["READY"],
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
      description: "Delete the connectionProfiles",
      arguments: z.object({
        identifier: z.string().describe("The name of the connectionProfiles"),
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
      description: "Sync connectionProfiles state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific connectionProfiles by name (e.g. one discovered by list)",
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
      description: "List connectionProfiles resources",
      arguments: z.object({
        filter: z.string().describe(
          "Optional. A filter expression that filters connection profiles listed in the response. The expression must specify the field name, a comparison operator, and the value that you want to use for filtering. The value must be a string, a number, or a boolean. The comparison operator must be either =, !=, >, or <. For example, list connection profiles created this year by specifying **createTime %gt; 2020-01-01T00:00:00.000000000Z**. You can also filter nested fields. For example, you could specify **mySql.username = %lt;my_username%gt;** to list all connection profiles configured to connect with a specific username.",
        ).optional(),
        orderBy: z.string().describe(
          "Optional. A comma-separated list of fields to order results according to.",
        ).optional(),
        pageSize: z.number().describe(
          "The maximum number of connection profiles to return. The service may return fewer than this value. If unspecified, at most 50 connection profiles will be returned. The maximum value is 1000; values above 1000 are coerced to 1000.",
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
          "connectionProfiles",
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
            "id":
              "datamigration.projects.locations.connectionProfiles.getIamPolicy",
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
            "id":
              "datamigration.projects.locations.connectionProfiles.setIamPolicy",
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
            "id":
              "datamigration.projects.locations.connectionProfiles.testIamPermissions",
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
