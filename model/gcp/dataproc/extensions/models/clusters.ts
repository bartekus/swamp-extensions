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

// Auto-generated extension model for @swamp/gcp/dataproc/clusters
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Dataproc Clusters.
 *
 * Describes the identifying information, config, and status of a cluster
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

const BASE_URL = "https://dataproc.googleapis.com/";

const GET_CONFIG = {
  "id": "dataproc.projects.regions.clusters.get",
  "path": "v1/projects/{projectId}/regions/{region}/clusters/{clusterName}",
  "httpMethod": "GET",
  "parameterOrder": [
    "projectId",
    "region",
    "clusterName",
  ],
  "parameters": {
    "clusterName": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "region": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "dataproc.projects.regions.clusters.create",
  "path": "v1/projects/{projectId}/regions/{region}/clusters",
  "httpMethod": "POST",
  "parameterOrder": [
    "projectId",
    "region",
  ],
  "parameters": {
    "actionOnFailedPrimaryWorkers": {
      "location": "query",
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "region": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "dataproc.projects.regions.clusters.patch",
  "path": "v1/projects/{projectId}/regions/{region}/clusters/{clusterName}",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "projectId",
    "region",
    "clusterName",
  ],
  "parameters": {
    "clusterName": {
      "location": "path",
      "required": true,
    },
    "gracefulDecommissionTimeout": {
      "location": "query",
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "region": {
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
  "id": "dataproc.projects.regions.clusters.delete",
  "path": "v1/projects/{projectId}/regions/{region}/clusters/{clusterName}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "projectId",
    "region",
    "clusterName",
  ],
  "parameters": {
    "clusterName": {
      "location": "path",
      "required": true,
    },
    "clusterUuid": {
      "location": "query",
    },
    "gracefulTerminationTimeout": {
      "location": "query",
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "region": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "dataproc.projects.regions.clusters.list",
  "path": "v1/projects/{projectId}/regions/{region}/clusters",
  "httpMethod": "GET",
  "parameterOrder": [
    "projectId",
    "region",
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
    "projectId": {
      "location": "path",
      "required": true,
    },
    "region": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const GlobalArgsSchema = z.object({
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
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
  clusterName: z.string().describe(
    "Required. The cluster name, which must be unique within a project. The name must start with a lowercase letter, and can contain up to 51 lowercase letters, numbers, and hyphens. It cannot end with a hyphen. The name of a deleted cluster can be reused.",
  ).optional(),
  config: z.object({
    autoscalingConfig: z.object({
      policyUri: z.string().describe(
        "Optional. The autoscaling policy used by the cluster.Only resource names including projectid and location (region) are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/locations/[dataproc_region]/autoscalingPolicies/[policy_id] projects/[project_id]/locations/[dataproc_region]/autoscalingPolicies/[policy_id]Note that the policy must be in the same project and region.",
      ).optional(),
    }).describe(
      "Optional. Autoscaling config for the policy associated with the cluster. Cluster does not autoscale if this field is unset.",
    ).optional(),
    auxiliaryNodeGroups: z.array(z.object({
      nodeGroup: z.object({
        labels: z.record(z.string(), z.unknown()).describe(
          "Optional. Node group labels. Label keys must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values can be empty. If specified, they must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). The node group must have no more than 32 labels.",
        ).optional(),
        name: z.string().describe(
          "The Node group resource name (https://aip.dev/122).",
        ).optional(),
        nodeGroupConfig: z.object({
          accelerators: z.unknown().describe(
            "Optional. The Compute Engine accelerator configuration for these instances.",
          ).optional(),
          diskConfig: z.unknown().describe(
            "Optional. Disk option config settings.",
          ).optional(),
          imageUri: z.unknown().describe(
            "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
          ).optional(),
          instanceFlexibilityPolicy: z.unknown().describe(
            "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
          ).optional(),
          instanceNames: z.unknown().describe(
            "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
          ).optional(),
          instanceReferences: z.unknown().describe(
            "Output only. List of references to Compute Engine instances.",
          ).optional(),
          isPreemptible: z.unknown().describe(
            "Output only. Specifies that this instance group contains preemptible instances.",
          ).optional(),
          machineTypeUri: z.unknown().describe(
            "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
          ).optional(),
          managedGroupConfig: z.unknown().describe(
            "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
          ).optional(),
          minCpuPlatform: z.unknown().describe(
            "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
          ).optional(),
          minNumInstances: z.unknown().describe(
            "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
          ).optional(),
          numInstances: z.unknown().describe(
            "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
          ).optional(),
          preemptibility: z.unknown().describe(
            "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
          ).optional(),
          startupConfig: z.unknown().describe(
            "Optional. Configuration to handle the startup of instances during cluster create and update process.",
          ).optional(),
        }).describe("Optional. The node group instance group configuration.")
          .optional(),
        roles: z.array(z.unknown()).describe("Required. Node group roles.")
          .optional(),
      }).describe("Required. Node group configuration.").optional(),
      nodeGroupId: z.string().describe(
        "Optional. A node group ID. Generated if not specified.The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of from 3 to 33 characters.",
      ).optional(),
    })).describe("Optional. The node group settings.").optional(),
    clusterTier: z.enum([
      "CLUSTER_TIER_UNSPECIFIED",
      "CLUSTER_TIER_STANDARD",
      "CLUSTER_TIER_PREMIUM",
    ]).describe("Optional. The cluster tier.").optional(),
    clusterType: z.enum([
      "CLUSTER_TYPE_UNSPECIFIED",
      "STANDARD",
      "SINGLE_NODE",
      "ZERO_SCALE",
    ]).describe("Optional. The type of the cluster.").optional(),
    configBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to stage job dependencies, config files, and job driver console output. If you do not specify a staging bucket, the service will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's staging bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket (see staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
    dataprocMetricConfig: z.object({
      metrics: z.array(z.object({
        metricOverrides: z.array(z.unknown()).describe(
          "Optional. Specify one or more Custom metrics (https://cloud.google.com/dataproc/docs/guides/dataproc-metrics#custom_metrics) to collect for the metric course (for the SPARK metric source (any Spark metric (https://spark.apache.org/docs/latest/monitoring.html#metrics) can be specified).Provide metrics in the following format:METRIC_SOURCE:INSTANCE:GROUP:METRIC Use camelcase as appropriate.Examples: yarn:ResourceManager:QueueMetrics:AppsCompleted spark:driver:DAGScheduler:job.allJobs sparkHistoryServer:JVM:Memory:NonHeapMemoryUsage.committed hiveserver2:JVM:Memory:NonHeapMemoryUsage.used Notes: Only the specified overridden metrics are collected for the metric source. For example, if one or more spark:executive metrics are listed as metric overrides, other SPARK metrics are not collected. The collection of the metrics for other enabled custom metric sources is unaffected. For example, if both SPARK and YARN metric sources are enabled, and overrides are provided for Spark metrics only, all YARN metrics are collected.",
        ).optional(),
        metricSource: z.enum([
          "METRIC_SOURCE_UNSPECIFIED",
          "MONITORING_AGENT_DEFAULTS",
          "HDFS",
          "SPARK",
          "YARN",
          "SPARK_HISTORY_SERVER",
          "HIVESERVER2",
          "HIVEMETASTORE",
          "FLINK",
        ]).describe(
          "Required. A standard set of metrics is collected unless metricOverrides are specified for the metric source (see Custom metrics (https://cloud.google.com/dataproc/docs/guides/dataproc-metrics#custom_metrics) for more information).",
        ).optional(),
      })).describe("Required. Metrics sources to enable.").optional(),
    }).describe("Optional. The config for metrics.").optional(),
    diagnosticBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to collect checkpoint diagnostic data (https://cloud.google.com/dataproc/docs/support/diagnose-clusters#checkpoint_diagnostic_data). If you do not specify a diagnostic bucket, The service will use the temp bucket to collect the checkpoint diagnostic data. This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
    encryptionConfig: z.object({
      gcePdKmsKeyName: z.string().describe(
        "Optional. The Cloud KMS key resource name to use for persistent disk encryption for all instances in the cluster. See Use CMEK with cluster data (https://cloud.google.com//dataproc/docs/concepts/configuring-clusters/customer-managed-encryption#use_cmek_with_cluster_data) for more information.",
      ).optional(),
      kmsKey: z.string().describe(
        "Optional. The Cloud KMS key resource name to use for cluster persistent disk and job argument encryption. See Use CMEK with cluster data (https://cloud.google.com//dataproc/docs/concepts/configuring-clusters/customer-managed-encryption#use_cmek_with_cluster_data) for more information.When this key resource name is provided, the following job arguments of the following job types submitted to the cluster are encrypted using CMEK: FlinkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/FlinkJob) HadoopJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/HadoopJob) SparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkJob) SparkRJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkRJob) PySparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/PySparkJob) SparkSqlJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkSqlJob) scriptVariables and queryList.queries HiveJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/HiveJob) scriptVariables and queryList.queries PigJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PigJob) scriptVariables and queryList.queries PrestoJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PrestoJob) scriptVariables and queryList.queries",
      ).optional(),
    }).describe("Optional. Encryption settings for the cluster.").optional(),
    endpointConfig: z.object({
      enableHttpPortAccess: z.boolean().describe(
        "Optional. If true, enable http access to specific ports on the cluster from external sources. Defaults to false.",
      ).optional(),
      httpPorts: z.record(z.string(), z.string()).describe(
        "Output only. The map of port descriptions to URLs. Will only be populated if enable_http_port_access is true.",
      ).optional(),
    }).describe("Optional. Port/endpoint configuration for this cluster")
      .optional(),
    engine: z.enum(["ENGINE_UNSPECIFIED", "DEFAULT", "LIGHTNING"]).describe(
      "Optional. The cluster engine.",
    ).optional(),
    gceClusterConfig: z.object({
      autoZoneExcludeZoneUris: z.array(z.string()).describe(
        "Optional. An optional list of Compute Engine zones where the cluster will not be located when Auto Zone is enabled. Only one of zone_uri or auto_zone_exclude_zone_uris can be set. If both are omitted, the service will pick a zone in the cluster Compute Engine region. If auto_zone_exclude_zone_uris is set and there is more than one non-excluded zone, the service will pick one of the non-excluded zones. Otherwise, cluster creation will fail with INVALID_ARGUMENT error.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone] projects/[project_id]/zones/[zone] [zone]",
      ).optional(),
      confidentialInstanceConfig: z.object({
        confidentialInstanceType: z.enum([
          "CONFIDENTIAL_INSTANCE_TYPE_UNSPECIFIED",
          "SEV",
          "SEV_SNP",
          "TDX",
        ]).describe(
          "Optional. Defines the type of Confidential Compute technology to use.",
        ).optional(),
        enableConfidentialCompute: z.boolean().describe(
          "Optional. Deprecated: Use 'confidential_instance_type' instead. Defines whether the instance should have confidential compute enabled.",
        ).optional(),
      }).describe(
        "Optional. Confidential Instance Config for clusters using Confidential VMs (https://cloud.google.com/confidential-computing/confidential-vm/docs).",
      ).optional(),
      internalIpOnly: z.boolean().describe(
        "Optional. This setting applies to subnetwork-enabled networks. It is set to true by default in clusters created with image versions 2.2.x.When set to true: All cluster VMs have internal IP addresses. Google Private Access (https://cloud.google.com/vpc/docs/private-google-access) must be enabled to access the Dataproc API and other Google Cloud APIs. Off-cluster dependencies must be configured to be accessible without external IP addresses.When set to false: Cluster VMs are not restricted to internal IP addresses. Ephemeral external IP addresses are assigned to each cluster VM.",
      ).optional(),
      metadata: z.record(z.string(), z.string()).describe(
        "Optional. The Compute Engine metadata entries to add to all instances (see Project and instance metadata (https://cloud.google.com/compute/docs/storing-retrieving-metadata#project_and_instance_metadata)).",
      ).optional(),
      networkUri: z.string().describe(
        'Optional. The Compute Engine network to be used for machine communications. Cannot be specified with subnetwork_uri. If neither network_uri nor subnetwork_uri is specified, the "default" network of the project is used, if it exists. Cannot be a Custom Subnet Network (see Using Subnetworks (https://cloud.google.com/compute/docs/subnetworks) for more information).A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/networks/default projects/[project_id]/global/networks/default default',
      ).optional(),
      nodeGroupAffinity: z.object({
        nodeGroupUri: z.string().describe(
          "Required. The URI of a sole-tenant node group resource (https://cloud.google.com/compute/docs/reference/rest/v1/nodeGroups) that the cluster will be created on.A full URL, partial URI, or node group name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/nodeGroups/node-group-1 projects/[project_id]/zones/[zone]/nodeGroups/node-group-1 node-group-1",
        ).optional(),
      }).describe("Optional. Node Group Affinity for sole-tenant clusters.")
        .optional(),
      privateIpv6GoogleAccess: z.enum([
        "PRIVATE_IPV6_GOOGLE_ACCESS_UNSPECIFIED",
        "INHERIT_FROM_SUBNETWORK",
        "OUTBOUND",
        "BIDIRECTIONAL",
      ]).describe("Optional. The type of IPv6 access for a cluster.")
        .optional(),
      reservationAffinity: z.object({
        consumeReservationType: z.enum([
          "TYPE_UNSPECIFIED",
          "NO_RESERVATION",
          "ANY_RESERVATION",
          "SPECIFIC_RESERVATION",
        ]).describe("Optional. Type of reservation to consume").optional(),
        key: z.string().describe(
          "Optional. Corresponds to the label key of reservation resource.",
        ).optional(),
        values: z.array(z.string()).describe(
          "Optional. Corresponds to the label values of reservation resource.",
        ).optional(),
      }).describe(
        "Optional. Reservation Affinity for consuming Zonal reservation.",
      ).optional(),
      resourceManagerTags: z.record(z.string(), z.string()).describe(
        "Optional. Resource manager tags (https://cloud.google.com/resource-manager/docs/tags/tags-creating-and-managing) to add to all instances (see Use secure tags (https://cloud.google.com/dataproc/docs/guides/use-secure-tags)).",
      ).optional(),
      serviceAccount: z.string().describe(
        "Optional. The VM service account (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/service-accounts#service_accounts_in_dataproc) (also see VM Data Plane identity (https://cloud.google.com/dataproc/docs/concepts/iam/dataproc-principals#vm_service_account_data_plane_identity)) used by cluster VM instances to access Google Cloud Platform services.If not specified, the Compute Engine default service account (https://cloud.google.com/compute/docs/access/service-accounts#default_service_account) is used.",
      ).optional(),
      serviceAccountScopes: z.array(z.string()).describe(
        "Optional. The URIs of service account scopes to be included in Compute Engine instances. The following base set of scopes is always included: https://www.googleapis.com/auth/cloud.useraccounts.readonly https://www.googleapis.com/auth/devstorage.read_write https://www.googleapis.com/auth/logging.writeIf no scopes are specified, the following defaults are also provided: https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/bigtable.admin.table https://www.googleapis.com/auth/bigtable.data https://www.googleapis.com/auth/devstorage.full_control",
      ).optional(),
      shieldedInstanceConfig: z.object({
        enableIntegrityMonitoring: z.boolean().describe(
          "Optional. Defines whether instances have integrity monitoring enabled.",
        ).optional(),
        enableSecureBoot: z.boolean().describe(
          "Optional. Defines whether instances have Secure Boot enabled.",
        ).optional(),
        enableVtpm: z.boolean().describe(
          "Optional. Defines whether instances have the vTPM enabled.",
        ).optional(),
      }).describe(
        "Optional. Shielded Instance Config for clusters using Compute Engine Shielded VMs (https://cloud.google.com/security/shielded-cloud/shielded-vm).",
      ).optional(),
      subnetworkUri: z.string().describe(
        "Optional. The Compute Engine subnetwork to be used for machine communications. Cannot be specified with network_uri.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/regions/[region]/subnetworks/sub0 projects/[project_id]/regions/[region]/subnetworks/sub0 sub0",
      ).optional(),
      tags: z.array(z.string()).describe(
        "The Compute Engine network tags to add to all instances (see Tagging instances (https://cloud.google.com/vpc/docs/add-remove-network-tags)).",
      ).optional(),
      zoneUri: z.string().describe(
        "Optional. The Compute Engine zone where the cluster will be located. If omitted, the service will pick a zone in the cluster's Compute Engine region. On a get request, zone will always be present.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone] projects/[project_id]/zones/[zone] [zone]",
      ).optional(),
    }).describe(
      "Optional. The shared Compute Engine config settings for all instances in a cluster.",
    ).optional(),
    gkeClusterConfig: z.object({
      gkeClusterTarget: z.string().describe(
        "Optional. A target GKE cluster to deploy to. It must be in the same project and region as the Dataproc cluster (the GKE cluster can be zonal or regional). Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
      ).optional(),
      namespacedGkeDeploymentTarget: z.object({
        clusterNamespace: z.string().describe(
          "Optional. A namespace within the GKE cluster to deploy into.",
        ).optional(),
        targetGkeCluster: z.string().describe(
          "Optional. The target GKE cluster to deploy to. Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
        ).optional(),
      }).describe(
        "Optional. Deprecated. Use gkeClusterTarget. Used only for the deprecated beta. A target for the deployment.",
      ).optional(),
      nodePoolTarget: z.array(z.object({
        nodePool: z.string().describe(
          "Required. The target GKE node pool. Format: 'projects/{project}/locations/{location}/clusters/{cluster}/nodePools/{node_pool}'",
        ).optional(),
        nodePoolConfig: z.object({
          autoscaling: z.unknown().describe(
            "Optional. The autoscaler configuration for this node pool. The autoscaler is enabled only when a valid configuration is present.",
          ).optional(),
          config: z.unknown().describe("Optional. The node pool configuration.")
            .optional(),
          locations: z.unknown().describe(
            "Optional. The list of Compute Engine zones (https://cloud.google.com/compute/docs/zones#available) where node pool nodes associated with a Dataproc on GKE virtual cluster will be located.Note: All node pools associated with a virtual cluster must be located in the same region as the virtual cluster, and they must be located in the same zone within that region.If a location is not specified during node pool creation, Dataproc on GKE will choose the zone.",
          ).optional(),
        }).describe(
          "Input only. The configuration for the GKE node pool.If specified, Dataproc attempts to create a node pool with the specified shape. If one with the same name already exists, it is verified against all specified fields. If a field differs, the virtual cluster creation will fail.If omitted, any node pool with the specified name is used. If a node pool with the specified name does not exist, Dataproc create a node pool with default values.This is an input only field. It will not be returned by the API.",
        ).optional(),
        roles: z.array(z.unknown()).describe(
          "Required. The roles associated with the GKE node pool.",
        ).optional(),
      })).describe(
        "Optional. GKE node pools where workloads will be scheduled. At least one node pool must be assigned the DEFAULT GkeNodePoolTarget.Role. If a GkeNodePoolTarget is not specified, Dataproc constructs a DEFAULT GkeNodePoolTarget. Each role can be given to only one GkeNodePoolTarget. All node pools must have the same location settings.",
      ).optional(),
    }).describe(
      "Optional. BETA. The Kubernetes Engine config for clusters deployed to Kubernetes. These config settings are mutually exclusive with Compute Engine-based options, such as gce_cluster_config, master_config, worker_config, secondary_worker_config, and autoscaling_config.",
    ).optional(),
    initializationActions: z.array(z.object({
      executableFile: z.string().describe(
        "Required. Cloud Storage URI of executable file.",
      ).optional(),
      executionTimeout: z.string().describe(
        "Optional. Amount of time executable has to complete. Default is 10 minutes (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).Cluster creation fails with an explanatory error message (the name of the executable that caused the error and the exceeded timeout period) if the executable is not completed at end of the timeout period.",
      ).optional(),
    })).describe(
      "Optional. Commands to execute on each node after config is completed. By default, executables are run on master and all worker nodes. You can test a node's role metadata to run an executable on a master or worker node, as shown below using curl (you can also use wget): ROLE=$(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/attributes/dataproc-role) if [[ \"${ROLE}\" == 'Master' ]]; then... master specific actions... else... worker specific actions... fi",
    ).optional(),
    lifecycleConfig: z.object({
      autoDeleteTime: z.string().describe(
        "Optional. The time when cluster will be auto-deleted (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      autoDeleteTtl: z.string().describe(
        "Optional. The lifetime duration of cluster. The cluster will be auto-deleted at the end of this period. Minimum value is 10 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      autoStopTime: z.string().describe(
        "Optional. The time when cluster will be auto-stopped (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      autoStopTtl: z.string().describe(
        "Optional. The lifetime duration of the cluster. The cluster will be auto-stopped at the end of this period, calculated from the time of submission of the create or update cluster request. Minimum value is 10 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      idleDeleteTtl: z.string().describe(
        "Optional. The duration to keep the cluster alive while idling (when no jobs are running). Passing this threshold will cause the cluster to be deleted. Minimum value is 5 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      idleStartTime: z.string().describe(
        "Output only. The time when cluster became idle (most recent job finished) and became eligible for deletion due to idleness (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      idleStopTtl: z.string().describe(
        "Optional. The duration to keep the cluster started while idling (when no jobs are running). Passing this threshold will cause the cluster to be stopped. Minimum value is 5 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
    }).describe("Optional. Lifecycle setting for the cluster.").optional(),
    masterConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number().int().describe(
          "The number of the accelerator cards of this type exposed to this instance.",
        ).optional(),
        acceleratorTypeUri: z.string().describe(
          "Full URL, partial URI, or short name of the accelerator type resource to expose to this instance. See Compute Engine AcceleratorTypes (https://cloud.google.com/compute/docs/reference/v1/acceleratorTypes).Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 nvidia-tesla-t4Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the accelerator type resource, for example, nvidia-tesla-t4.",
        ).optional(),
      })).describe(
        "Optional. The Compute Engine accelerator configuration for these instances.",
      ).optional(),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown().describe("Optional. Disk size in GB.")
            .optional(),
          diskType: z.unknown().describe("Optional. Disk type.").optional(),
          provisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
          provisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
        })).describe(
          "Optional. A list of attached disk configs for a group of VM instances.",
        ).optional(),
        bootDiskProvisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskProvisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskSizeGb: z.number().int().describe(
          "Optional. Size in GB of the boot disk (default is 500GB).",
        ).optional(),
        bootDiskType: z.string().describe(
          "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
        ).optional(),
        localSsdInterface: z.string().describe(
          "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
        ).optional(),
        numLocalSsds: z.number().int().describe(
          "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
        ).optional(),
      }).describe("Optional. Disk option config settings.").optional(),
      imageUri: z.string().describe(
        "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
      ).optional(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.string()).describe(
          "Output only. A map of instance short name to machine type. The key is the short name of the Compute Engine instance, and the value is the full machine-type name (e.g., 'n1-standard-16'). See Machine types for more information on valid machine type strings.",
        ).optional(),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown().describe(
            "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
          ).optional(),
          machineTypes: z.unknown().describe(
            'Optional. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          rank: z.unknown().describe(
            "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
          ).optional(),
        })).describe(
          "Optional. List of instance selection options that the group will use when creating new VMs.",
        ).optional(),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown().describe(
            'Output only. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          vmCount: z.unknown().describe(
            "Output only. Number of VM provisioned with the machine_type.",
          ).optional(),
        })).describe(
          "Output only. A list of instance selection results in the group.",
        ).optional(),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number().int().describe(
            "Optional. The base capacity that will always use Standard VMs to avoid risk of more preemption than the minimum capacity you need. The service will create only standard VMs until it reaches standard_capacity_base, then it will start using standard_capacity_percent_above_base to mix Spot with Standard VMs. eg. If 15 instances are requested and standard_capacity_base is 5, the service will create 5 standard VMs and thenstart mixing spot and standard VMs for remaining 10 instances.",
          ).optional(),
          standardCapacityPercentAboveBase: z.number().int().describe(
            "Optional. The percentage of target capacity that should use Standard VM. The remaining percentage will use Spot VMs. The percentage applies only to the capacity above standard_capacity_base. eg. If 15 instances are requested and standard_capacity_base is 5 and standard_capacity_percent_above_base is 30, the service will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances. The mix will be 30% standard and 70% spot.",
          ).optional(),
        }).describe(
          "Optional. Defines how the Group selects the provisioning model to ensure required reliability.",
        ).optional(),
      }).describe(
        "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
      ).optional(),
      instanceNames: z.array(z.string()).describe(
        "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
      ).optional(),
      instanceReferences: z.array(z.object({
        instanceId: z.string().describe(
          "The unique identifier of the Compute Engine instance.",
        ).optional(),
        instanceName: z.string().describe(
          "The user-friendly name of the Compute Engine instance.",
        ).optional(),
        publicEciesKey: z.string().describe(
          "The public ECIES key used for sharing data with this instance.",
        ).optional(),
        publicKey: z.string().describe(
          "The public RSA key used for sharing data with this instance.",
        ).optional(),
      })).describe(
        "Output only. List of references to Compute Engine instances.",
      ).optional(),
      isPreemptible: z.boolean().describe(
        "Output only. Specifies that this instance group contains preemptible instances.",
      ).optional(),
      machineTypeUri: z.string().describe(
        "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
      ).optional(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string().describe(
          "Output only. The name of the Instance Group Manager for this group.",
        ).optional(),
        instanceGroupManagerUri: z.string().describe(
          "Output only. The partial URI to the instance group manager for this group. E.g. projects/my-project/regions/us-central1/instanceGroupManagers/my-igm.",
        ).optional(),
        instanceTemplateName: z.string().describe(
          "Output only. The name of the Instance Template used for the Managed Instance Group.",
        ).optional(),
      }).describe(
        "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
      ).optional(),
      minCpuPlatform: z.string().describe(
        "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
      ).optional(),
      minNumInstances: z.number().int().describe(
        "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
      ).optional(),
      numInstances: z.number().int().describe(
        "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
      ).optional(),
      preemptibility: z.enum([
        "PREEMPTIBILITY_UNSPECIFIED",
        "NON_PREEMPTIBLE",
        "PREEMPTIBLE",
        "SPOT",
      ]).describe(
        "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
      ).optional(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number().describe(
          "Optional. The config setting to enable cluster creation/ updation to be successful only after required_registration_fraction of instances are up and running. This configuration is applicable to only secondary workers for now. The cluster will fail if required_registration_fraction of instances are not available. This will include instance creation, agent registration, and service registration (if enabled).",
        ).optional(),
      }).describe(
        "Optional. Configuration to handle the startup of instances during cluster create and update process.",
      ).optional(),
    }).describe(
      "Optional. The Compute Engine config settings for the cluster's master instance.",
    ).optional(),
    metastoreConfig: z.object({
      dataprocMetastoreService: z.string().describe(
        "Required. Resource name of an existing Metastore service.Example: projects/[project_id]/locations/[dataproc_region]/services/[service-name]",
      ).optional(),
    }).describe("Optional. Metastore configuration.").optional(),
    secondaryWorkerConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number().int().describe(
          "The number of the accelerator cards of this type exposed to this instance.",
        ).optional(),
        acceleratorTypeUri: z.string().describe(
          "Full URL, partial URI, or short name of the accelerator type resource to expose to this instance. See Compute Engine AcceleratorTypes (https://cloud.google.com/compute/docs/reference/v1/acceleratorTypes).Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 nvidia-tesla-t4Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the accelerator type resource, for example, nvidia-tesla-t4.",
        ).optional(),
      })).describe(
        "Optional. The Compute Engine accelerator configuration for these instances.",
      ).optional(),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown().describe("Optional. Disk size in GB.")
            .optional(),
          diskType: z.unknown().describe("Optional. Disk type.").optional(),
          provisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
          provisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
        })).describe(
          "Optional. A list of attached disk configs for a group of VM instances.",
        ).optional(),
        bootDiskProvisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskProvisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskSizeGb: z.number().int().describe(
          "Optional. Size in GB of the boot disk (default is 500GB).",
        ).optional(),
        bootDiskType: z.string().describe(
          "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
        ).optional(),
        localSsdInterface: z.string().describe(
          "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
        ).optional(),
        numLocalSsds: z.number().int().describe(
          "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
        ).optional(),
      }).describe("Optional. Disk option config settings.").optional(),
      imageUri: z.string().describe(
        "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
      ).optional(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.string()).describe(
          "Output only. A map of instance short name to machine type. The key is the short name of the Compute Engine instance, and the value is the full machine-type name (e.g., 'n1-standard-16'). See Machine types for more information on valid machine type strings.",
        ).optional(),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown().describe(
            "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
          ).optional(),
          machineTypes: z.unknown().describe(
            'Optional. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          rank: z.unknown().describe(
            "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
          ).optional(),
        })).describe(
          "Optional. List of instance selection options that the group will use when creating new VMs.",
        ).optional(),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown().describe(
            'Output only. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          vmCount: z.unknown().describe(
            "Output only. Number of VM provisioned with the machine_type.",
          ).optional(),
        })).describe(
          "Output only. A list of instance selection results in the group.",
        ).optional(),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number().int().describe(
            "Optional. The base capacity that will always use Standard VMs to avoid risk of more preemption than the minimum capacity you need. The service will create only standard VMs until it reaches standard_capacity_base, then it will start using standard_capacity_percent_above_base to mix Spot with Standard VMs. eg. If 15 instances are requested and standard_capacity_base is 5, the service will create 5 standard VMs and thenstart mixing spot and standard VMs for remaining 10 instances.",
          ).optional(),
          standardCapacityPercentAboveBase: z.number().int().describe(
            "Optional. The percentage of target capacity that should use Standard VM. The remaining percentage will use Spot VMs. The percentage applies only to the capacity above standard_capacity_base. eg. If 15 instances are requested and standard_capacity_base is 5 and standard_capacity_percent_above_base is 30, the service will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances. The mix will be 30% standard and 70% spot.",
          ).optional(),
        }).describe(
          "Optional. Defines how the Group selects the provisioning model to ensure required reliability.",
        ).optional(),
      }).describe(
        "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
      ).optional(),
      instanceNames: z.array(z.string()).describe(
        "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
      ).optional(),
      instanceReferences: z.array(z.object({
        instanceId: z.string().describe(
          "The unique identifier of the Compute Engine instance.",
        ).optional(),
        instanceName: z.string().describe(
          "The user-friendly name of the Compute Engine instance.",
        ).optional(),
        publicEciesKey: z.string().describe(
          "The public ECIES key used for sharing data with this instance.",
        ).optional(),
        publicKey: z.string().describe(
          "The public RSA key used for sharing data with this instance.",
        ).optional(),
      })).describe(
        "Output only. List of references to Compute Engine instances.",
      ).optional(),
      isPreemptible: z.boolean().describe(
        "Output only. Specifies that this instance group contains preemptible instances.",
      ).optional(),
      machineTypeUri: z.string().describe(
        "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
      ).optional(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string().describe(
          "Output only. The name of the Instance Group Manager for this group.",
        ).optional(),
        instanceGroupManagerUri: z.string().describe(
          "Output only. The partial URI to the instance group manager for this group. E.g. projects/my-project/regions/us-central1/instanceGroupManagers/my-igm.",
        ).optional(),
        instanceTemplateName: z.string().describe(
          "Output only. The name of the Instance Template used for the Managed Instance Group.",
        ).optional(),
      }).describe(
        "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
      ).optional(),
      minCpuPlatform: z.string().describe(
        "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
      ).optional(),
      minNumInstances: z.number().int().describe(
        "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
      ).optional(),
      numInstances: z.number().int().describe(
        "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
      ).optional(),
      preemptibility: z.enum([
        "PREEMPTIBILITY_UNSPECIFIED",
        "NON_PREEMPTIBLE",
        "PREEMPTIBLE",
        "SPOT",
      ]).describe(
        "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
      ).optional(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number().describe(
          "Optional. The config setting to enable cluster creation/ updation to be successful only after required_registration_fraction of instances are up and running. This configuration is applicable to only secondary workers for now. The cluster will fail if required_registration_fraction of instances are not available. This will include instance creation, agent registration, and service registration (if enabled).",
        ).optional(),
      }).describe(
        "Optional. Configuration to handle the startup of instances during cluster create and update process.",
      ).optional(),
    }).describe(
      "Optional. The Compute Engine config settings for a cluster's secondary worker instances",
    ).optional(),
    securityConfig: z.object({
      identityConfig: z.object({
        enableSsh: z.boolean().describe(
          "Optional. Whether to enable SSH access for the cluster. The default is true for image versions prior to 3.1 and false for image versions 3.1 and later. The default behavior can be changed when creating clusters using image versions 2.3.30 and later.",
        ).optional(),
        userServiceAccountMapping: z.record(z.string(), z.string()).describe(
          "Required. Map of user to service account.",
        ).optional(),
      }).describe(
        "Optional. Identity related configuration, including service account based secure multi-tenancy user mappings.",
      ).optional(),
      kerberosConfig: z.object({
        crossRealmTrustAdminServer: z.string().describe(
          "Optional. The admin server (IP or hostname) for the remote trusted realm in a cross realm trust relationship.",
        ).optional(),
        crossRealmTrustKdc: z.string().describe(
          "Optional. The KDC (IP or hostname) for the remote trusted realm in a cross realm trust relationship.",
        ).optional(),
        crossRealmTrustRealm: z.string().describe(
          "Optional. The remote realm the on-cluster KDC will trust, should the user enable cross realm trust.",
        ).optional(),
        crossRealmTrustSharedPasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the shared password between the on-cluster Kerberos realm and the remote trusted realm, in a cross realm trust relationship.",
        ).optional(),
        enableKerberos: z.boolean().describe(
          "Optional. Flag to indicate whether to Kerberize the cluster (default: false). Set this field to true to enable Kerberos on a cluster.",
        ).optional(),
        kdcDbKeyUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the master key of the KDC database.",
        ).optional(),
        keyPasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided key. For the self-signed certificate, this password is generated by the service.",
        ).optional(),
        keystorePasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided keystore. For the self-signed certificate, this password is generated by the service.",
        ).optional(),
        keystoreUri: z.string().describe(
          "Optional. The Cloud Storage URI of the keystore file used for SSL encryption. If not provided, the service will provide a self-signed certificate.",
        ).optional(),
        kmsKeyUri: z.string().describe(
          "Optional. The URI of the KMS key used to encrypt sensitive files.",
        ).optional(),
        realm: z.string().describe(
          "Optional. The name of the on-cluster Kerberos realm. If not specified, the uppercased domain of hostnames will be the realm.",
        ).optional(),
        rootPrincipalPasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the root principal password.",
        ).optional(),
        tgtLifetimeHours: z.number().int().describe(
          "Optional. The lifetime of the ticket granting ticket, in hours. If not specified, or user specifies 0, then default value 10 will be used.",
        ).optional(),
        truststorePasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided truststore. For the self-signed certificate, this password is generated by the service.",
        ).optional(),
        truststoreUri: z.string().describe(
          "Optional. The Cloud Storage URI of the truststore file used for SSL encryption. If not provided, the service will provide a self-signed certificate.",
        ).optional(),
      }).describe("Optional. Kerberos related configuration.").optional(),
    }).describe("Optional. Security settings for the cluster.").optional(),
    softwareConfig: z.object({
      imageVersion: z.string().describe(
        'Optional. The version of software inside the cluster. It must be one of the supported Image Versions (https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-versions#supported-dataproc-image-versions), such as "1.2" (including a subminor version, such as "1.2.29"), or the "preview" version (https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-versions#other_versions). If unspecified, it defaults to the latest Debian version.',
      ).optional(),
      optionalComponents: z.array(
        z.enum([
          "COMPONENT_UNSPECIFIED",
          "ANACONDA",
          "DELTA",
          "DOCKER",
          "DRUID",
          "FLINK",
          "HBASE",
          "HIVE_WEBHCAT",
          "HUDI",
          "ICEBERG",
          "JUPYTER",
          "PIG",
          "PRESTO",
          "TRINO",
          "RANGER",
          "SOLR",
          "ZEPPELIN",
          "ZOOKEEPER",
          "JUPYTER_KERNEL_GATEWAY",
        ]),
      ).describe("Optional. The set of components to activate on the cluster.")
        .optional(),
      properties: z.record(z.string(), z.string()).describe(
        "Optional. The properties to set on daemon config files.Property keys are specified in prefix:property format, for example core:hadoop.tmp.dir. The following are supported prefixes and their mappings: capacity-scheduler: capacity-scheduler.xml core: core-site.xml distcp: distcp-default.xml hdfs: hdfs-site.xml hive: hive-site.xml mapred: mapred-site.xml pig: pig.properties spark: spark-defaults.conf yarn: yarn-site.xmlFor more information, see Cluster properties (https://cloud.google.com/dataproc/docs/concepts/cluster-properties).",
      ).optional(),
    }).describe("Optional. The config settings for cluster software.")
      .optional(),
    tempBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to store ephemeral cluster and jobs data, such as Spark and MapReduce history files. If you do not specify a temp bucket, the service will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's temp bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket. The default bucket has a TTL of 90 days, but you can use any TTL (or none) if you specify a bucket (see staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
    workerConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number().int().describe(
          "The number of the accelerator cards of this type exposed to this instance.",
        ).optional(),
        acceleratorTypeUri: z.string().describe(
          "Full URL, partial URI, or short name of the accelerator type resource to expose to this instance. See Compute Engine AcceleratorTypes (https://cloud.google.com/compute/docs/reference/v1/acceleratorTypes).Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 nvidia-tesla-t4Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the accelerator type resource, for example, nvidia-tesla-t4.",
        ).optional(),
      })).describe(
        "Optional. The Compute Engine accelerator configuration for these instances.",
      ).optional(),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown().describe("Optional. Disk size in GB.")
            .optional(),
          diskType: z.unknown().describe("Optional. Disk type.").optional(),
          provisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
          provisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
        })).describe(
          "Optional. A list of attached disk configs for a group of VM instances.",
        ).optional(),
        bootDiskProvisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskProvisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskSizeGb: z.number().int().describe(
          "Optional. Size in GB of the boot disk (default is 500GB).",
        ).optional(),
        bootDiskType: z.string().describe(
          "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
        ).optional(),
        localSsdInterface: z.string().describe(
          "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
        ).optional(),
        numLocalSsds: z.number().int().describe(
          "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
        ).optional(),
      }).describe("Optional. Disk option config settings.").optional(),
      imageUri: z.string().describe(
        "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
      ).optional(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.string()).describe(
          "Output only. A map of instance short name to machine type. The key is the short name of the Compute Engine instance, and the value is the full machine-type name (e.g., 'n1-standard-16'). See Machine types for more information on valid machine type strings.",
        ).optional(),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown().describe(
            "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
          ).optional(),
          machineTypes: z.unknown().describe(
            'Optional. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          rank: z.unknown().describe(
            "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
          ).optional(),
        })).describe(
          "Optional. List of instance selection options that the group will use when creating new VMs.",
        ).optional(),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown().describe(
            'Output only. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          vmCount: z.unknown().describe(
            "Output only. Number of VM provisioned with the machine_type.",
          ).optional(),
        })).describe(
          "Output only. A list of instance selection results in the group.",
        ).optional(),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number().int().describe(
            "Optional. The base capacity that will always use Standard VMs to avoid risk of more preemption than the minimum capacity you need. The service will create only standard VMs until it reaches standard_capacity_base, then it will start using standard_capacity_percent_above_base to mix Spot with Standard VMs. eg. If 15 instances are requested and standard_capacity_base is 5, the service will create 5 standard VMs and thenstart mixing spot and standard VMs for remaining 10 instances.",
          ).optional(),
          standardCapacityPercentAboveBase: z.number().int().describe(
            "Optional. The percentage of target capacity that should use Standard VM. The remaining percentage will use Spot VMs. The percentage applies only to the capacity above standard_capacity_base. eg. If 15 instances are requested and standard_capacity_base is 5 and standard_capacity_percent_above_base is 30, the service will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances. The mix will be 30% standard and 70% spot.",
          ).optional(),
        }).describe(
          "Optional. Defines how the Group selects the provisioning model to ensure required reliability.",
        ).optional(),
      }).describe(
        "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
      ).optional(),
      instanceNames: z.array(z.string()).describe(
        "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
      ).optional(),
      instanceReferences: z.array(z.object({
        instanceId: z.string().describe(
          "The unique identifier of the Compute Engine instance.",
        ).optional(),
        instanceName: z.string().describe(
          "The user-friendly name of the Compute Engine instance.",
        ).optional(),
        publicEciesKey: z.string().describe(
          "The public ECIES key used for sharing data with this instance.",
        ).optional(),
        publicKey: z.string().describe(
          "The public RSA key used for sharing data with this instance.",
        ).optional(),
      })).describe(
        "Output only. List of references to Compute Engine instances.",
      ).optional(),
      isPreemptible: z.boolean().describe(
        "Output only. Specifies that this instance group contains preemptible instances.",
      ).optional(),
      machineTypeUri: z.string().describe(
        "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
      ).optional(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string().describe(
          "Output only. The name of the Instance Group Manager for this group.",
        ).optional(),
        instanceGroupManagerUri: z.string().describe(
          "Output only. The partial URI to the instance group manager for this group. E.g. projects/my-project/regions/us-central1/instanceGroupManagers/my-igm.",
        ).optional(),
        instanceTemplateName: z.string().describe(
          "Output only. The name of the Instance Template used for the Managed Instance Group.",
        ).optional(),
      }).describe(
        "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
      ).optional(),
      minCpuPlatform: z.string().describe(
        "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
      ).optional(),
      minNumInstances: z.number().int().describe(
        "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
      ).optional(),
      numInstances: z.number().int().describe(
        "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
      ).optional(),
      preemptibility: z.enum([
        "PREEMPTIBILITY_UNSPECIFIED",
        "NON_PREEMPTIBLE",
        "PREEMPTIBLE",
        "SPOT",
      ]).describe(
        "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
      ).optional(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number().describe(
          "Optional. The config setting to enable cluster creation/ updation to be successful only after required_registration_fraction of instances are up and running. This configuration is applicable to only secondary workers for now. The cluster will fail if required_registration_fraction of instances are not available. This will include instance creation, agent registration, and service registration (if enabled).",
        ).optional(),
      }).describe(
        "Optional. Configuration to handle the startup of instances during cluster create and update process.",
      ).optional(),
    }).describe(
      "Optional. The Compute Engine config settings for the cluster's worker instances.",
    ).optional(),
  }).describe(
    "Optional. The cluster config for a cluster of Compute Engine Instances. Note that the service may set default values, and values may change when clusters are updated.Exactly one of ClusterConfig or VirtualClusterConfig must be specified.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. The labels to associate with this cluster. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values may be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a cluster.",
  ).optional(),
  projectId: z.string().describe(
    "Required. The Google Cloud Platform project ID that the cluster belongs to.",
  ).optional(),
  virtualClusterConfig: z.object({
    auxiliaryServicesConfig: z.object({
      metastoreConfig: z.object({
        dataprocMetastoreService: z.string().describe(
          "Required. Resource name of an existing Metastore service.Example: projects/[project_id]/locations/[dataproc_region]/services/[service-name]",
        ).optional(),
      }).describe(
        "Optional. The Hive Metastore configuration for this workload.",
      ).optional(),
      sparkHistoryServerConfig: z.object({
        dataprocCluster: z.string().describe(
          "Optional. Resource name of an existing Dataproc Cluster to act as a Spark History Server for the workload.Example: projects/[project_id]/regions/[region]/clusters/[cluster_name]",
        ).optional(),
      }).describe(
        "Optional. The Spark History Server configuration for the workload.",
      ).optional(),
    }).describe(
      "Optional. Configuration of auxiliary services used by this cluster.",
    ).optional(),
    kubernetesClusterConfig: z.object({
      gkeClusterConfig: z.object({
        gkeClusterTarget: z.string().describe(
          "Optional. A target GKE cluster to deploy to. It must be in the same project and region as the Dataproc cluster (the GKE cluster can be zonal or regional). Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
        ).optional(),
        namespacedGkeDeploymentTarget: z.object({
          clusterNamespace: z.string().describe(
            "Optional. A namespace within the GKE cluster to deploy into.",
          ).optional(),
          targetGkeCluster: z.string().describe(
            "Optional. The target GKE cluster to deploy to. Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
          ).optional(),
        }).describe(
          "Optional. Deprecated. Use gkeClusterTarget. Used only for the deprecated beta. A target for the deployment.",
        ).optional(),
        nodePoolTarget: z.array(z.object({
          nodePool: z.unknown().describe(
            "Required. The target GKE node pool. Format: 'projects/{project}/locations/{location}/clusters/{cluster}/nodePools/{node_pool}'",
          ).optional(),
          nodePoolConfig: z.unknown().describe(
            "Input only. The configuration for the GKE node pool.If specified, Dataproc attempts to create a node pool with the specified shape. If one with the same name already exists, it is verified against all specified fields. If a field differs, the virtual cluster creation will fail.If omitted, any node pool with the specified name is used. If a node pool with the specified name does not exist, Dataproc create a node pool with default values.This is an input only field. It will not be returned by the API.",
          ).optional(),
          roles: z.unknown().describe(
            "Required. The roles associated with the GKE node pool.",
          ).optional(),
        })).describe(
          "Optional. GKE node pools where workloads will be scheduled. At least one node pool must be assigned the DEFAULT GkeNodePoolTarget.Role. If a GkeNodePoolTarget is not specified, Dataproc constructs a DEFAULT GkeNodePoolTarget. Each role can be given to only one GkeNodePoolTarget. All node pools must have the same location settings.",
        ).optional(),
      }).describe(
        "Required. The configuration for running the Dataproc cluster on GKE.",
      ).optional(),
      kubernetesNamespace: z.string().describe(
        "Optional. A namespace within the Kubernetes cluster to deploy into. If this namespace does not exist, it is created. If it exists, Dataproc verifies that another Dataproc VirtualCluster is not installed into it. If not specified, the name of the Dataproc Cluster is used.",
      ).optional(),
      kubernetesSoftwareConfig: z.object({
        componentVersion: z.record(z.string(), z.string()).describe(
          "The components that should be installed in this Dataproc cluster. The key must be a string from the KubernetesComponent enumeration. The value is the version of the software to be installed. At least one entry must be specified.",
        ).optional(),
        properties: z.record(z.string(), z.string()).describe(
          "The properties to set on daemon config files.Property keys are specified in prefix:property format, for example spark:spark.kubernetes.container.image. The following are supported prefixes and their mappings: spark: spark-defaults.confFor more information, see Cluster properties (https://cloud.google.com/dataproc/docs/concepts/cluster-properties).",
        ).optional(),
      }).describe(
        "Optional. The software configuration for this Dataproc cluster running on Kubernetes.",
      ).optional(),
    }).describe(
      "Required. The configuration for running the cluster on Kubernetes.",
    ).optional(),
    stagingBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to stage job dependencies, config files, and job driver console output. If you do not specify a staging bucket, the service will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's staging bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket (see staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
  }).describe(
    "Optional. The virtual cluster config is used when creating a cluster that does not directly control the underlying compute resources, for example, when creating a GKE cluster (https://cloud.google.com/dataproc/docs/guides/dpgke/dataproc-gke-overview). the service may set default values, and values may change when clusters are updated. Exactly one of config or virtual_cluster_config must be specified.",
  ).optional(),
  region: z.string().describe(
    "Required. The region in which to handle the request.",
  ),
  actionOnFailedPrimaryWorkers: z.string().describe(
    "Optional. Failure action when primary worker creation fails.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two CreateClusterRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateClusterRequest)s with the same id, then the second request will be ignored and the first google.longrunning.Operation created and stored in the backend is returned.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
  ).optional(),
  gracefulDecommissionTimeout: z.string().describe(
    "Optional. Timeout for graceful YARN decommissioning. Graceful decommissioning allows removing nodes from the cluster without interrupting jobs in progress. Timeout specifies how long to wait for jobs in progress to finish before forcefully removing nodes (and potentially interrupting jobs). Default timeout is 0 (for forceful decommission), and the maximum allowed timeout is 1 day. (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).Supported in image versions 1.2 and higher.",
  ).optional(),
});

const StateSchema = z.object({
  clusterName: z.string().optional(),
  clusterUuid: z.string().optional(),
  config: z.object({
    autoscalingConfig: z.object({
      policyUri: z.string(),
    }),
    auxiliaryNodeGroups: z.array(z.object({
      nodeGroup: z.object({
        labels: z.record(z.string(), z.unknown()),
        name: z.string(),
        nodeGroupConfig: z.object({
          accelerators: z.unknown(),
          diskConfig: z.unknown(),
          imageUri: z.unknown(),
          instanceFlexibilityPolicy: z.unknown(),
          instanceNames: z.unknown(),
          instanceReferences: z.unknown(),
          isPreemptible: z.unknown(),
          machineTypeUri: z.unknown(),
          managedGroupConfig: z.unknown(),
          minCpuPlatform: z.unknown(),
          minNumInstances: z.unknown(),
          numInstances: z.unknown(),
          preemptibility: z.unknown(),
          startupConfig: z.unknown(),
        }),
        roles: z.array(z.unknown()),
      }),
      nodeGroupId: z.string(),
    })),
    clusterTier: z.string(),
    clusterType: z.string(),
    configBucket: z.string(),
    dataprocMetricConfig: z.object({
      metrics: z.array(z.object({
        metricOverrides: z.array(z.unknown()),
        metricSource: z.string(),
      })),
    }),
    diagnosticBucket: z.string(),
    encryptionConfig: z.object({
      gcePdKmsKeyName: z.string(),
      kmsKey: z.string(),
    }),
    endpointConfig: z.object({
      enableHttpPortAccess: z.boolean(),
      httpPorts: z.record(z.string(), z.unknown()),
    }),
    engine: z.string(),
    gceClusterConfig: z.object({
      autoZoneExcludeZoneUris: z.array(z.string()),
      confidentialInstanceConfig: z.object({
        confidentialInstanceType: z.string(),
        enableConfidentialCompute: z.boolean(),
      }),
      internalIpOnly: z.boolean(),
      metadata: z.record(z.string(), z.unknown()),
      networkUri: z.string(),
      nodeGroupAffinity: z.object({
        nodeGroupUri: z.string(),
      }),
      privateIpv6GoogleAccess: z.string(),
      reservationAffinity: z.object({
        consumeReservationType: z.string(),
        key: z.string(),
        values: z.array(z.string()),
      }),
      resourceManagerTags: z.record(z.string(), z.unknown()),
      serviceAccount: z.string(),
      serviceAccountScopes: z.array(z.string()),
      shieldedInstanceConfig: z.object({
        enableIntegrityMonitoring: z.boolean(),
        enableSecureBoot: z.boolean(),
        enableVtpm: z.boolean(),
      }),
      subnetworkUri: z.string(),
      tags: z.array(z.string()),
      zoneUri: z.string(),
    }),
    gkeClusterConfig: z.object({
      gkeClusterTarget: z.string(),
      namespacedGkeDeploymentTarget: z.object({
        clusterNamespace: z.string(),
        targetGkeCluster: z.string(),
      }),
      nodePoolTarget: z.array(z.object({
        nodePool: z.string(),
        nodePoolConfig: z.object({
          autoscaling: z.unknown(),
          config: z.unknown(),
          locations: z.unknown(),
        }),
        roles: z.array(z.unknown()),
      })),
    }),
    initializationActions: z.array(z.object({
      executableFile: z.string(),
      executionTimeout: z.string(),
    })),
    lifecycleConfig: z.object({
      autoDeleteTime: z.string(),
      autoDeleteTtl: z.string(),
      autoStopTime: z.string(),
      autoStopTtl: z.string(),
      idleDeleteTtl: z.string(),
      idleStartTime: z.string(),
      idleStopTtl: z.string(),
    }),
    masterConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number(),
        acceleratorTypeUri: z.string(),
      })),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown(),
          diskType: z.unknown(),
          provisionedIops: z.unknown(),
          provisionedThroughput: z.unknown(),
        })),
        bootDiskProvisionedIops: z.string(),
        bootDiskProvisionedThroughput: z.string(),
        bootDiskSizeGb: z.number(),
        bootDiskType: z.string(),
        localSsdInterface: z.string(),
        numLocalSsds: z.number(),
      }),
      imageUri: z.string(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.unknown()),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown(),
          machineTypes: z.unknown(),
          rank: z.unknown(),
        })),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown(),
          vmCount: z.unknown(),
        })),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number(),
          standardCapacityPercentAboveBase: z.number(),
        }),
      }),
      instanceNames: z.array(z.string()),
      instanceReferences: z.array(z.object({
        instanceId: z.string(),
        instanceName: z.string(),
        publicEciesKey: z.string(),
        publicKey: z.string(),
      })),
      isPreemptible: z.boolean(),
      machineTypeUri: z.string(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string(),
        instanceGroupManagerUri: z.string(),
        instanceTemplateName: z.string(),
      }),
      minCpuPlatform: z.string(),
      minNumInstances: z.number(),
      numInstances: z.number(),
      preemptibility: z.string(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number(),
      }),
    }),
    metastoreConfig: z.object({
      dataprocMetastoreService: z.string(),
    }),
    secondaryWorkerConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number(),
        acceleratorTypeUri: z.string(),
      })),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown(),
          diskType: z.unknown(),
          provisionedIops: z.unknown(),
          provisionedThroughput: z.unknown(),
        })),
        bootDiskProvisionedIops: z.string(),
        bootDiskProvisionedThroughput: z.string(),
        bootDiskSizeGb: z.number(),
        bootDiskType: z.string(),
        localSsdInterface: z.string(),
        numLocalSsds: z.number(),
      }),
      imageUri: z.string(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.unknown()),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown(),
          machineTypes: z.unknown(),
          rank: z.unknown(),
        })),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown(),
          vmCount: z.unknown(),
        })),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number(),
          standardCapacityPercentAboveBase: z.number(),
        }),
      }),
      instanceNames: z.array(z.string()),
      instanceReferences: z.array(z.object({
        instanceId: z.string(),
        instanceName: z.string(),
        publicEciesKey: z.string(),
        publicKey: z.string(),
      })),
      isPreemptible: z.boolean(),
      machineTypeUri: z.string(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string(),
        instanceGroupManagerUri: z.string(),
        instanceTemplateName: z.string(),
      }),
      minCpuPlatform: z.string(),
      minNumInstances: z.number(),
      numInstances: z.number(),
      preemptibility: z.string(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number(),
      }),
    }),
    securityConfig: z.object({
      identityConfig: z.object({
        enableSsh: z.boolean(),
        userServiceAccountMapping: z.record(z.string(), z.unknown()),
      }),
      kerberosConfig: z.object({
        crossRealmTrustAdminServer: z.string(),
        crossRealmTrustKdc: z.string(),
        crossRealmTrustRealm: z.string(),
        crossRealmTrustSharedPasswordUri: z.string(),
        enableKerberos: z.boolean(),
        kdcDbKeyUri: z.string(),
        keyPasswordUri: z.string(),
        keystorePasswordUri: z.string(),
        keystoreUri: z.string(),
        kmsKeyUri: z.string(),
        realm: z.string(),
        rootPrincipalPasswordUri: z.string(),
        tgtLifetimeHours: z.number(),
        truststorePasswordUri: z.string(),
        truststoreUri: z.string(),
      }),
    }),
    softwareConfig: z.object({
      imageVersion: z.string(),
      optionalComponents: z.array(z.string()),
      properties: z.record(z.string(), z.unknown()),
    }),
    tempBucket: z.string(),
    workerConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number(),
        acceleratorTypeUri: z.string(),
      })),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown(),
          diskType: z.unknown(),
          provisionedIops: z.unknown(),
          provisionedThroughput: z.unknown(),
        })),
        bootDiskProvisionedIops: z.string(),
        bootDiskProvisionedThroughput: z.string(),
        bootDiskSizeGb: z.number(),
        bootDiskType: z.string(),
        localSsdInterface: z.string(),
        numLocalSsds: z.number(),
      }),
      imageUri: z.string(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.unknown()),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown(),
          machineTypes: z.unknown(),
          rank: z.unknown(),
        })),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown(),
          vmCount: z.unknown(),
        })),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number(),
          standardCapacityPercentAboveBase: z.number(),
        }),
      }),
      instanceNames: z.array(z.string()),
      instanceReferences: z.array(z.object({
        instanceId: z.string(),
        instanceName: z.string(),
        publicEciesKey: z.string(),
        publicKey: z.string(),
      })),
      isPreemptible: z.boolean(),
      machineTypeUri: z.string(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string(),
        instanceGroupManagerUri: z.string(),
        instanceTemplateName: z.string(),
      }),
      minCpuPlatform: z.string(),
      minNumInstances: z.number(),
      numInstances: z.number(),
      preemptibility: z.string(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number(),
      }),
    }),
  }).optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  metrics: z.object({
    hdfsMetrics: z.record(z.string(), z.unknown()),
    yarnMetrics: z.record(z.string(), z.unknown()),
  }).optional(),
  projectId: z.string().optional(),
  status: z.object({
    detail: z.string(),
    state: z.string(),
    stateStartTime: z.string(),
    substate: z.string(),
  }).optional(),
  statusHistory: z.array(z.object({
    detail: z.string(),
    state: z.string(),
    stateStartTime: z.string(),
    substate: z.string(),
  })).optional(),
  virtualClusterConfig: z.object({
    auxiliaryServicesConfig: z.object({
      metastoreConfig: z.object({
        dataprocMetastoreService: z.string(),
      }),
      sparkHistoryServerConfig: z.object({
        dataprocCluster: z.string(),
      }),
    }),
    kubernetesClusterConfig: z.object({
      gkeClusterConfig: z.object({
        gkeClusterTarget: z.string(),
        namespacedGkeDeploymentTarget: z.object({
          clusterNamespace: z.string(),
          targetGkeCluster: z.string(),
        }),
        nodePoolTarget: z.array(z.object({
          nodePool: z.unknown(),
          nodePoolConfig: z.unknown(),
          roles: z.unknown(),
        })),
      }),
      kubernetesNamespace: z.string(),
      kubernetesSoftwareConfig: z.object({
        componentVersion: z.record(z.string(), z.unknown()),
        properties: z.record(z.string(), z.unknown()),
      }),
    }),
    stagingBucket: z.string(),
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  clusterName: z.string().describe(
    "Required. The cluster name, which must be unique within a project. The name must start with a lowercase letter, and can contain up to 51 lowercase letters, numbers, and hyphens. It cannot end with a hyphen. The name of a deleted cluster can be reused.",
  ).optional(),
  config: z.object({
    autoscalingConfig: z.object({
      policyUri: z.string().describe(
        "Optional. The autoscaling policy used by the cluster.Only resource names including projectid and location (region) are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/locations/[dataproc_region]/autoscalingPolicies/[policy_id] projects/[project_id]/locations/[dataproc_region]/autoscalingPolicies/[policy_id]Note that the policy must be in the same project and region.",
      ).optional(),
    }).describe(
      "Optional. Autoscaling config for the policy associated with the cluster. Cluster does not autoscale if this field is unset.",
    ).optional(),
    auxiliaryNodeGroups: z.array(z.object({
      nodeGroup: z.object({
        labels: z.record(z.string(), z.unknown()).describe(
          "Optional. Node group labels. Label keys must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values can be empty. If specified, they must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). The node group must have no more than 32 labels.",
        ).optional(),
        name: z.string().describe(
          "The Node group resource name (https://aip.dev/122).",
        ).optional(),
        nodeGroupConfig: z.object({
          accelerators: z.unknown().describe(
            "Optional. The Compute Engine accelerator configuration for these instances.",
          ).optional(),
          diskConfig: z.unknown().describe(
            "Optional. Disk option config settings.",
          ).optional(),
          imageUri: z.unknown().describe(
            "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
          ).optional(),
          instanceFlexibilityPolicy: z.unknown().describe(
            "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
          ).optional(),
          instanceNames: z.unknown().describe(
            "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
          ).optional(),
          instanceReferences: z.unknown().describe(
            "Output only. List of references to Compute Engine instances.",
          ).optional(),
          isPreemptible: z.unknown().describe(
            "Output only. Specifies that this instance group contains preemptible instances.",
          ).optional(),
          machineTypeUri: z.unknown().describe(
            "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
          ).optional(),
          managedGroupConfig: z.unknown().describe(
            "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
          ).optional(),
          minCpuPlatform: z.unknown().describe(
            "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
          ).optional(),
          minNumInstances: z.unknown().describe(
            "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
          ).optional(),
          numInstances: z.unknown().describe(
            "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
          ).optional(),
          preemptibility: z.unknown().describe(
            "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
          ).optional(),
          startupConfig: z.unknown().describe(
            "Optional. Configuration to handle the startup of instances during cluster create and update process.",
          ).optional(),
        }).describe("Optional. The node group instance group configuration.")
          .optional(),
        roles: z.array(z.unknown()).describe("Required. Node group roles.")
          .optional(),
      }).describe("Required. Node group configuration.").optional(),
      nodeGroupId: z.string().describe(
        "Optional. A node group ID. Generated if not specified.The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of from 3 to 33 characters.",
      ).optional(),
    })).describe("Optional. The node group settings.").optional(),
    clusterTier: z.enum([
      "CLUSTER_TIER_UNSPECIFIED",
      "CLUSTER_TIER_STANDARD",
      "CLUSTER_TIER_PREMIUM",
    ]).describe("Optional. The cluster tier.").optional(),
    clusterType: z.enum([
      "CLUSTER_TYPE_UNSPECIFIED",
      "STANDARD",
      "SINGLE_NODE",
      "ZERO_SCALE",
    ]).describe("Optional. The type of the cluster.").optional(),
    configBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to stage job dependencies, config files, and job driver console output. If you do not specify a staging bucket, the service will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's staging bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket (see staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
    dataprocMetricConfig: z.object({
      metrics: z.array(z.object({
        metricOverrides: z.array(z.unknown()).describe(
          "Optional. Specify one or more Custom metrics (https://cloud.google.com/dataproc/docs/guides/dataproc-metrics#custom_metrics) to collect for the metric course (for the SPARK metric source (any Spark metric (https://spark.apache.org/docs/latest/monitoring.html#metrics) can be specified).Provide metrics in the following format:METRIC_SOURCE:INSTANCE:GROUP:METRIC Use camelcase as appropriate.Examples: yarn:ResourceManager:QueueMetrics:AppsCompleted spark:driver:DAGScheduler:job.allJobs sparkHistoryServer:JVM:Memory:NonHeapMemoryUsage.committed hiveserver2:JVM:Memory:NonHeapMemoryUsage.used Notes: Only the specified overridden metrics are collected for the metric source. For example, if one or more spark:executive metrics are listed as metric overrides, other SPARK metrics are not collected. The collection of the metrics for other enabled custom metric sources is unaffected. For example, if both SPARK and YARN metric sources are enabled, and overrides are provided for Spark metrics only, all YARN metrics are collected.",
        ).optional(),
        metricSource: z.enum([
          "METRIC_SOURCE_UNSPECIFIED",
          "MONITORING_AGENT_DEFAULTS",
          "HDFS",
          "SPARK",
          "YARN",
          "SPARK_HISTORY_SERVER",
          "HIVESERVER2",
          "HIVEMETASTORE",
          "FLINK",
        ]).describe(
          "Required. A standard set of metrics is collected unless metricOverrides are specified for the metric source (see Custom metrics (https://cloud.google.com/dataproc/docs/guides/dataproc-metrics#custom_metrics) for more information).",
        ).optional(),
      })).describe("Required. Metrics sources to enable.").optional(),
    }).describe("Optional. The config for metrics.").optional(),
    diagnosticBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to collect checkpoint diagnostic data (https://cloud.google.com/dataproc/docs/support/diagnose-clusters#checkpoint_diagnostic_data). If you do not specify a diagnostic bucket, The service will use the temp bucket to collect the checkpoint diagnostic data. This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
    encryptionConfig: z.object({
      gcePdKmsKeyName: z.string().describe(
        "Optional. The Cloud KMS key resource name to use for persistent disk encryption for all instances in the cluster. See Use CMEK with cluster data (https://cloud.google.com//dataproc/docs/concepts/configuring-clusters/customer-managed-encryption#use_cmek_with_cluster_data) for more information.",
      ).optional(),
      kmsKey: z.string().describe(
        "Optional. The Cloud KMS key resource name to use for cluster persistent disk and job argument encryption. See Use CMEK with cluster data (https://cloud.google.com//dataproc/docs/concepts/configuring-clusters/customer-managed-encryption#use_cmek_with_cluster_data) for more information.When this key resource name is provided, the following job arguments of the following job types submitted to the cluster are encrypted using CMEK: FlinkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/FlinkJob) HadoopJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/HadoopJob) SparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkJob) SparkRJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkRJob) PySparkJob args (https://cloud.google.com/dataproc/docs/reference/rest/v1/PySparkJob) SparkSqlJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/SparkSqlJob) scriptVariables and queryList.queries HiveJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/HiveJob) scriptVariables and queryList.queries PigJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PigJob) scriptVariables and queryList.queries PrestoJob (https://cloud.google.com/dataproc/docs/reference/rest/v1/PrestoJob) scriptVariables and queryList.queries",
      ).optional(),
    }).describe("Optional. Encryption settings for the cluster.").optional(),
    endpointConfig: z.object({
      enableHttpPortAccess: z.boolean().describe(
        "Optional. If true, enable http access to specific ports on the cluster from external sources. Defaults to false.",
      ).optional(),
      httpPorts: z.record(z.string(), z.string()).describe(
        "Output only. The map of port descriptions to URLs. Will only be populated if enable_http_port_access is true.",
      ).optional(),
    }).describe("Optional. Port/endpoint configuration for this cluster")
      .optional(),
    engine: z.enum(["ENGINE_UNSPECIFIED", "DEFAULT", "LIGHTNING"]).describe(
      "Optional. The cluster engine.",
    ).optional(),
    gceClusterConfig: z.object({
      autoZoneExcludeZoneUris: z.array(z.string()).describe(
        "Optional. An optional list of Compute Engine zones where the cluster will not be located when Auto Zone is enabled. Only one of zone_uri or auto_zone_exclude_zone_uris can be set. If both are omitted, the service will pick a zone in the cluster Compute Engine region. If auto_zone_exclude_zone_uris is set and there is more than one non-excluded zone, the service will pick one of the non-excluded zones. Otherwise, cluster creation will fail with INVALID_ARGUMENT error.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone] projects/[project_id]/zones/[zone] [zone]",
      ).optional(),
      confidentialInstanceConfig: z.object({
        confidentialInstanceType: z.enum([
          "CONFIDENTIAL_INSTANCE_TYPE_UNSPECIFIED",
          "SEV",
          "SEV_SNP",
          "TDX",
        ]).describe(
          "Optional. Defines the type of Confidential Compute technology to use.",
        ).optional(),
        enableConfidentialCompute: z.boolean().describe(
          "Optional. Deprecated: Use 'confidential_instance_type' instead. Defines whether the instance should have confidential compute enabled.",
        ).optional(),
      }).describe(
        "Optional. Confidential Instance Config for clusters using Confidential VMs (https://cloud.google.com/confidential-computing/confidential-vm/docs).",
      ).optional(),
      internalIpOnly: z.boolean().describe(
        "Optional. This setting applies to subnetwork-enabled networks. It is set to true by default in clusters created with image versions 2.2.x.When set to true: All cluster VMs have internal IP addresses. Google Private Access (https://cloud.google.com/vpc/docs/private-google-access) must be enabled to access the Dataproc API and other Google Cloud APIs. Off-cluster dependencies must be configured to be accessible without external IP addresses.When set to false: Cluster VMs are not restricted to internal IP addresses. Ephemeral external IP addresses are assigned to each cluster VM.",
      ).optional(),
      metadata: z.record(z.string(), z.string()).describe(
        "Optional. The Compute Engine metadata entries to add to all instances (see Project and instance metadata (https://cloud.google.com/compute/docs/storing-retrieving-metadata#project_and_instance_metadata)).",
      ).optional(),
      networkUri: z.string().describe(
        'Optional. The Compute Engine network to be used for machine communications. Cannot be specified with subnetwork_uri. If neither network_uri nor subnetwork_uri is specified, the "default" network of the project is used, if it exists. Cannot be a Custom Subnet Network (see Using Subnetworks (https://cloud.google.com/compute/docs/subnetworks) for more information).A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/networks/default projects/[project_id]/global/networks/default default',
      ).optional(),
      nodeGroupAffinity: z.object({
        nodeGroupUri: z.string().describe(
          "Required. The URI of a sole-tenant node group resource (https://cloud.google.com/compute/docs/reference/rest/v1/nodeGroups) that the cluster will be created on.A full URL, partial URI, or node group name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/nodeGroups/node-group-1 projects/[project_id]/zones/[zone]/nodeGroups/node-group-1 node-group-1",
        ).optional(),
      }).describe("Optional. Node Group Affinity for sole-tenant clusters.")
        .optional(),
      privateIpv6GoogleAccess: z.enum([
        "PRIVATE_IPV6_GOOGLE_ACCESS_UNSPECIFIED",
        "INHERIT_FROM_SUBNETWORK",
        "OUTBOUND",
        "BIDIRECTIONAL",
      ]).describe("Optional. The type of IPv6 access for a cluster.")
        .optional(),
      reservationAffinity: z.object({
        consumeReservationType: z.enum([
          "TYPE_UNSPECIFIED",
          "NO_RESERVATION",
          "ANY_RESERVATION",
          "SPECIFIC_RESERVATION",
        ]).describe("Optional. Type of reservation to consume").optional(),
        key: z.string().describe(
          "Optional. Corresponds to the label key of reservation resource.",
        ).optional(),
        values: z.array(z.string()).describe(
          "Optional. Corresponds to the label values of reservation resource.",
        ).optional(),
      }).describe(
        "Optional. Reservation Affinity for consuming Zonal reservation.",
      ).optional(),
      resourceManagerTags: z.record(z.string(), z.string()).describe(
        "Optional. Resource manager tags (https://cloud.google.com/resource-manager/docs/tags/tags-creating-and-managing) to add to all instances (see Use secure tags (https://cloud.google.com/dataproc/docs/guides/use-secure-tags)).",
      ).optional(),
      serviceAccount: z.string().describe(
        "Optional. The VM service account (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/service-accounts#service_accounts_in_dataproc) (also see VM Data Plane identity (https://cloud.google.com/dataproc/docs/concepts/iam/dataproc-principals#vm_service_account_data_plane_identity)) used by cluster VM instances to access Google Cloud Platform services.If not specified, the Compute Engine default service account (https://cloud.google.com/compute/docs/access/service-accounts#default_service_account) is used.",
      ).optional(),
      serviceAccountScopes: z.array(z.string()).describe(
        "Optional. The URIs of service account scopes to be included in Compute Engine instances. The following base set of scopes is always included: https://www.googleapis.com/auth/cloud.useraccounts.readonly https://www.googleapis.com/auth/devstorage.read_write https://www.googleapis.com/auth/logging.writeIf no scopes are specified, the following defaults are also provided: https://www.googleapis.com/auth/bigquery https://www.googleapis.com/auth/bigtable.admin.table https://www.googleapis.com/auth/bigtable.data https://www.googleapis.com/auth/devstorage.full_control",
      ).optional(),
      shieldedInstanceConfig: z.object({
        enableIntegrityMonitoring: z.boolean().describe(
          "Optional. Defines whether instances have integrity monitoring enabled.",
        ).optional(),
        enableSecureBoot: z.boolean().describe(
          "Optional. Defines whether instances have Secure Boot enabled.",
        ).optional(),
        enableVtpm: z.boolean().describe(
          "Optional. Defines whether instances have the vTPM enabled.",
        ).optional(),
      }).describe(
        "Optional. Shielded Instance Config for clusters using Compute Engine Shielded VMs (https://cloud.google.com/security/shielded-cloud/shielded-vm).",
      ).optional(),
      subnetworkUri: z.string().describe(
        "Optional. The Compute Engine subnetwork to be used for machine communications. Cannot be specified with network_uri.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/regions/[region]/subnetworks/sub0 projects/[project_id]/regions/[region]/subnetworks/sub0 sub0",
      ).optional(),
      tags: z.array(z.string()).describe(
        "The Compute Engine network tags to add to all instances (see Tagging instances (https://cloud.google.com/vpc/docs/add-remove-network-tags)).",
      ).optional(),
      zoneUri: z.string().describe(
        "Optional. The Compute Engine zone where the cluster will be located. If omitted, the service will pick a zone in the cluster's Compute Engine region. On a get request, zone will always be present.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone] projects/[project_id]/zones/[zone] [zone]",
      ).optional(),
    }).describe(
      "Optional. The shared Compute Engine config settings for all instances in a cluster.",
    ).optional(),
    gkeClusterConfig: z.object({
      gkeClusterTarget: z.string().describe(
        "Optional. A target GKE cluster to deploy to. It must be in the same project and region as the Dataproc cluster (the GKE cluster can be zonal or regional). Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
      ).optional(),
      namespacedGkeDeploymentTarget: z.object({
        clusterNamespace: z.string().describe(
          "Optional. A namespace within the GKE cluster to deploy into.",
        ).optional(),
        targetGkeCluster: z.string().describe(
          "Optional. The target GKE cluster to deploy to. Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
        ).optional(),
      }).describe(
        "Optional. Deprecated. Use gkeClusterTarget. Used only for the deprecated beta. A target for the deployment.",
      ).optional(),
      nodePoolTarget: z.array(z.object({
        nodePool: z.string().describe(
          "Required. The target GKE node pool. Format: 'projects/{project}/locations/{location}/clusters/{cluster}/nodePools/{node_pool}'",
        ).optional(),
        nodePoolConfig: z.object({
          autoscaling: z.unknown().describe(
            "Optional. The autoscaler configuration for this node pool. The autoscaler is enabled only when a valid configuration is present.",
          ).optional(),
          config: z.unknown().describe("Optional. The node pool configuration.")
            .optional(),
          locations: z.unknown().describe(
            "Optional. The list of Compute Engine zones (https://cloud.google.com/compute/docs/zones#available) where node pool nodes associated with a Dataproc on GKE virtual cluster will be located.Note: All node pools associated with a virtual cluster must be located in the same region as the virtual cluster, and they must be located in the same zone within that region.If a location is not specified during node pool creation, Dataproc on GKE will choose the zone.",
          ).optional(),
        }).describe(
          "Input only. The configuration for the GKE node pool.If specified, Dataproc attempts to create a node pool with the specified shape. If one with the same name already exists, it is verified against all specified fields. If a field differs, the virtual cluster creation will fail.If omitted, any node pool with the specified name is used. If a node pool with the specified name does not exist, Dataproc create a node pool with default values.This is an input only field. It will not be returned by the API.",
        ).optional(),
        roles: z.array(z.unknown()).describe(
          "Required. The roles associated with the GKE node pool.",
        ).optional(),
      })).describe(
        "Optional. GKE node pools where workloads will be scheduled. At least one node pool must be assigned the DEFAULT GkeNodePoolTarget.Role. If a GkeNodePoolTarget is not specified, Dataproc constructs a DEFAULT GkeNodePoolTarget. Each role can be given to only one GkeNodePoolTarget. All node pools must have the same location settings.",
      ).optional(),
    }).describe(
      "Optional. BETA. The Kubernetes Engine config for clusters deployed to Kubernetes. These config settings are mutually exclusive with Compute Engine-based options, such as gce_cluster_config, master_config, worker_config, secondary_worker_config, and autoscaling_config.",
    ).optional(),
    initializationActions: z.array(z.object({
      executableFile: z.string().describe(
        "Required. Cloud Storage URI of executable file.",
      ).optional(),
      executionTimeout: z.string().describe(
        "Optional. Amount of time executable has to complete. Default is 10 minutes (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).Cluster creation fails with an explanatory error message (the name of the executable that caused the error and the exceeded timeout period) if the executable is not completed at end of the timeout period.",
      ).optional(),
    })).describe(
      "Optional. Commands to execute on each node after config is completed. By default, executables are run on master and all worker nodes. You can test a node's role metadata to run an executable on a master or worker node, as shown below using curl (you can also use wget): ROLE=$(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/attributes/dataproc-role) if [[ \"${ROLE}\" == 'Master' ]]; then... master specific actions... else... worker specific actions... fi",
    ).optional(),
    lifecycleConfig: z.object({
      autoDeleteTime: z.string().describe(
        "Optional. The time when cluster will be auto-deleted (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      autoDeleteTtl: z.string().describe(
        "Optional. The lifetime duration of cluster. The cluster will be auto-deleted at the end of this period. Minimum value is 10 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      autoStopTime: z.string().describe(
        "Optional. The time when cluster will be auto-stopped (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      autoStopTtl: z.string().describe(
        "Optional. The lifetime duration of the cluster. The cluster will be auto-stopped at the end of this period, calculated from the time of submission of the create or update cluster request. Minimum value is 10 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      idleDeleteTtl: z.string().describe(
        "Optional. The duration to keep the cluster alive while idling (when no jobs are running). Passing this threshold will cause the cluster to be deleted. Minimum value is 5 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      idleStartTime: z.string().describe(
        "Output only. The time when cluster became idle (most recent job finished) and became eligible for deletion due to idleness (see JSON representation of Timestamp (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
      idleStopTtl: z.string().describe(
        "Optional. The duration to keep the cluster started while idling (when no jobs are running). Passing this threshold will cause the cluster to be stopped. Minimum value is 5 minutes; maximum value is 14 days (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).",
      ).optional(),
    }).describe("Optional. Lifecycle setting for the cluster.").optional(),
    masterConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number().int().describe(
          "The number of the accelerator cards of this type exposed to this instance.",
        ).optional(),
        acceleratorTypeUri: z.string().describe(
          "Full URL, partial URI, or short name of the accelerator type resource to expose to this instance. See Compute Engine AcceleratorTypes (https://cloud.google.com/compute/docs/reference/v1/acceleratorTypes).Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 nvidia-tesla-t4Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the accelerator type resource, for example, nvidia-tesla-t4.",
        ).optional(),
      })).describe(
        "Optional. The Compute Engine accelerator configuration for these instances.",
      ).optional(),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown().describe("Optional. Disk size in GB.")
            .optional(),
          diskType: z.unknown().describe("Optional. Disk type.").optional(),
          provisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
          provisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
        })).describe(
          "Optional. A list of attached disk configs for a group of VM instances.",
        ).optional(),
        bootDiskProvisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskProvisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskSizeGb: z.number().int().describe(
          "Optional. Size in GB of the boot disk (default is 500GB).",
        ).optional(),
        bootDiskType: z.string().describe(
          "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
        ).optional(),
        localSsdInterface: z.string().describe(
          "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
        ).optional(),
        numLocalSsds: z.number().int().describe(
          "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
        ).optional(),
      }).describe("Optional. Disk option config settings.").optional(),
      imageUri: z.string().describe(
        "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
      ).optional(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.string()).describe(
          "Output only. A map of instance short name to machine type. The key is the short name of the Compute Engine instance, and the value is the full machine-type name (e.g., 'n1-standard-16'). See Machine types for more information on valid machine type strings.",
        ).optional(),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown().describe(
            "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
          ).optional(),
          machineTypes: z.unknown().describe(
            'Optional. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          rank: z.unknown().describe(
            "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
          ).optional(),
        })).describe(
          "Optional. List of instance selection options that the group will use when creating new VMs.",
        ).optional(),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown().describe(
            'Output only. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          vmCount: z.unknown().describe(
            "Output only. Number of VM provisioned with the machine_type.",
          ).optional(),
        })).describe(
          "Output only. A list of instance selection results in the group.",
        ).optional(),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number().int().describe(
            "Optional. The base capacity that will always use Standard VMs to avoid risk of more preemption than the minimum capacity you need. The service will create only standard VMs until it reaches standard_capacity_base, then it will start using standard_capacity_percent_above_base to mix Spot with Standard VMs. eg. If 15 instances are requested and standard_capacity_base is 5, the service will create 5 standard VMs and thenstart mixing spot and standard VMs for remaining 10 instances.",
          ).optional(),
          standardCapacityPercentAboveBase: z.number().int().describe(
            "Optional. The percentage of target capacity that should use Standard VM. The remaining percentage will use Spot VMs. The percentage applies only to the capacity above standard_capacity_base. eg. If 15 instances are requested and standard_capacity_base is 5 and standard_capacity_percent_above_base is 30, the service will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances. The mix will be 30% standard and 70% spot.",
          ).optional(),
        }).describe(
          "Optional. Defines how the Group selects the provisioning model to ensure required reliability.",
        ).optional(),
      }).describe(
        "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
      ).optional(),
      instanceNames: z.array(z.string()).describe(
        "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
      ).optional(),
      instanceReferences: z.array(z.object({
        instanceId: z.string().describe(
          "The unique identifier of the Compute Engine instance.",
        ).optional(),
        instanceName: z.string().describe(
          "The user-friendly name of the Compute Engine instance.",
        ).optional(),
        publicEciesKey: z.string().describe(
          "The public ECIES key used for sharing data with this instance.",
        ).optional(),
        publicKey: z.string().describe(
          "The public RSA key used for sharing data with this instance.",
        ).optional(),
      })).describe(
        "Output only. List of references to Compute Engine instances.",
      ).optional(),
      isPreemptible: z.boolean().describe(
        "Output only. Specifies that this instance group contains preemptible instances.",
      ).optional(),
      machineTypeUri: z.string().describe(
        "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
      ).optional(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string().describe(
          "Output only. The name of the Instance Group Manager for this group.",
        ).optional(),
        instanceGroupManagerUri: z.string().describe(
          "Output only. The partial URI to the instance group manager for this group. E.g. projects/my-project/regions/us-central1/instanceGroupManagers/my-igm.",
        ).optional(),
        instanceTemplateName: z.string().describe(
          "Output only. The name of the Instance Template used for the Managed Instance Group.",
        ).optional(),
      }).describe(
        "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
      ).optional(),
      minCpuPlatform: z.string().describe(
        "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
      ).optional(),
      minNumInstances: z.number().int().describe(
        "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
      ).optional(),
      numInstances: z.number().int().describe(
        "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
      ).optional(),
      preemptibility: z.enum([
        "PREEMPTIBILITY_UNSPECIFIED",
        "NON_PREEMPTIBLE",
        "PREEMPTIBLE",
        "SPOT",
      ]).describe(
        "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
      ).optional(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number().describe(
          "Optional. The config setting to enable cluster creation/ updation to be successful only after required_registration_fraction of instances are up and running. This configuration is applicable to only secondary workers for now. The cluster will fail if required_registration_fraction of instances are not available. This will include instance creation, agent registration, and service registration (if enabled).",
        ).optional(),
      }).describe(
        "Optional. Configuration to handle the startup of instances during cluster create and update process.",
      ).optional(),
    }).describe(
      "Optional. The Compute Engine config settings for the cluster's master instance.",
    ).optional(),
    metastoreConfig: z.object({
      dataprocMetastoreService: z.string().describe(
        "Required. Resource name of an existing Metastore service.Example: projects/[project_id]/locations/[dataproc_region]/services/[service-name]",
      ).optional(),
    }).describe("Optional. Metastore configuration.").optional(),
    secondaryWorkerConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number().int().describe(
          "The number of the accelerator cards of this type exposed to this instance.",
        ).optional(),
        acceleratorTypeUri: z.string().describe(
          "Full URL, partial URI, or short name of the accelerator type resource to expose to this instance. See Compute Engine AcceleratorTypes (https://cloud.google.com/compute/docs/reference/v1/acceleratorTypes).Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 nvidia-tesla-t4Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the accelerator type resource, for example, nvidia-tesla-t4.",
        ).optional(),
      })).describe(
        "Optional. The Compute Engine accelerator configuration for these instances.",
      ).optional(),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown().describe("Optional. Disk size in GB.")
            .optional(),
          diskType: z.unknown().describe("Optional. Disk type.").optional(),
          provisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
          provisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
        })).describe(
          "Optional. A list of attached disk configs for a group of VM instances.",
        ).optional(),
        bootDiskProvisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskProvisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskSizeGb: z.number().int().describe(
          "Optional. Size in GB of the boot disk (default is 500GB).",
        ).optional(),
        bootDiskType: z.string().describe(
          "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
        ).optional(),
        localSsdInterface: z.string().describe(
          "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
        ).optional(),
        numLocalSsds: z.number().int().describe(
          "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
        ).optional(),
      }).describe("Optional. Disk option config settings.").optional(),
      imageUri: z.string().describe(
        "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
      ).optional(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.string()).describe(
          "Output only. A map of instance short name to machine type. The key is the short name of the Compute Engine instance, and the value is the full machine-type name (e.g., 'n1-standard-16'). See Machine types for more information on valid machine type strings.",
        ).optional(),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown().describe(
            "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
          ).optional(),
          machineTypes: z.unknown().describe(
            'Optional. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          rank: z.unknown().describe(
            "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
          ).optional(),
        })).describe(
          "Optional. List of instance selection options that the group will use when creating new VMs.",
        ).optional(),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown().describe(
            'Output only. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          vmCount: z.unknown().describe(
            "Output only. Number of VM provisioned with the machine_type.",
          ).optional(),
        })).describe(
          "Output only. A list of instance selection results in the group.",
        ).optional(),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number().int().describe(
            "Optional. The base capacity that will always use Standard VMs to avoid risk of more preemption than the minimum capacity you need. The service will create only standard VMs until it reaches standard_capacity_base, then it will start using standard_capacity_percent_above_base to mix Spot with Standard VMs. eg. If 15 instances are requested and standard_capacity_base is 5, the service will create 5 standard VMs and thenstart mixing spot and standard VMs for remaining 10 instances.",
          ).optional(),
          standardCapacityPercentAboveBase: z.number().int().describe(
            "Optional. The percentage of target capacity that should use Standard VM. The remaining percentage will use Spot VMs. The percentage applies only to the capacity above standard_capacity_base. eg. If 15 instances are requested and standard_capacity_base is 5 and standard_capacity_percent_above_base is 30, the service will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances. The mix will be 30% standard and 70% spot.",
          ).optional(),
        }).describe(
          "Optional. Defines how the Group selects the provisioning model to ensure required reliability.",
        ).optional(),
      }).describe(
        "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
      ).optional(),
      instanceNames: z.array(z.string()).describe(
        "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
      ).optional(),
      instanceReferences: z.array(z.object({
        instanceId: z.string().describe(
          "The unique identifier of the Compute Engine instance.",
        ).optional(),
        instanceName: z.string().describe(
          "The user-friendly name of the Compute Engine instance.",
        ).optional(),
        publicEciesKey: z.string().describe(
          "The public ECIES key used for sharing data with this instance.",
        ).optional(),
        publicKey: z.string().describe(
          "The public RSA key used for sharing data with this instance.",
        ).optional(),
      })).describe(
        "Output only. List of references to Compute Engine instances.",
      ).optional(),
      isPreemptible: z.boolean().describe(
        "Output only. Specifies that this instance group contains preemptible instances.",
      ).optional(),
      machineTypeUri: z.string().describe(
        "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
      ).optional(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string().describe(
          "Output only. The name of the Instance Group Manager for this group.",
        ).optional(),
        instanceGroupManagerUri: z.string().describe(
          "Output only. The partial URI to the instance group manager for this group. E.g. projects/my-project/regions/us-central1/instanceGroupManagers/my-igm.",
        ).optional(),
        instanceTemplateName: z.string().describe(
          "Output only. The name of the Instance Template used for the Managed Instance Group.",
        ).optional(),
      }).describe(
        "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
      ).optional(),
      minCpuPlatform: z.string().describe(
        "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
      ).optional(),
      minNumInstances: z.number().int().describe(
        "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
      ).optional(),
      numInstances: z.number().int().describe(
        "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
      ).optional(),
      preemptibility: z.enum([
        "PREEMPTIBILITY_UNSPECIFIED",
        "NON_PREEMPTIBLE",
        "PREEMPTIBLE",
        "SPOT",
      ]).describe(
        "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
      ).optional(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number().describe(
          "Optional. The config setting to enable cluster creation/ updation to be successful only after required_registration_fraction of instances are up and running. This configuration is applicable to only secondary workers for now. The cluster will fail if required_registration_fraction of instances are not available. This will include instance creation, agent registration, and service registration (if enabled).",
        ).optional(),
      }).describe(
        "Optional. Configuration to handle the startup of instances during cluster create and update process.",
      ).optional(),
    }).describe(
      "Optional. The Compute Engine config settings for a cluster's secondary worker instances",
    ).optional(),
    securityConfig: z.object({
      identityConfig: z.object({
        enableSsh: z.boolean().describe(
          "Optional. Whether to enable SSH access for the cluster. The default is true for image versions prior to 3.1 and false for image versions 3.1 and later. The default behavior can be changed when creating clusters using image versions 2.3.30 and later.",
        ).optional(),
        userServiceAccountMapping: z.record(z.string(), z.string()).describe(
          "Required. Map of user to service account.",
        ).optional(),
      }).describe(
        "Optional. Identity related configuration, including service account based secure multi-tenancy user mappings.",
      ).optional(),
      kerberosConfig: z.object({
        crossRealmTrustAdminServer: z.string().describe(
          "Optional. The admin server (IP or hostname) for the remote trusted realm in a cross realm trust relationship.",
        ).optional(),
        crossRealmTrustKdc: z.string().describe(
          "Optional. The KDC (IP or hostname) for the remote trusted realm in a cross realm trust relationship.",
        ).optional(),
        crossRealmTrustRealm: z.string().describe(
          "Optional. The remote realm the on-cluster KDC will trust, should the user enable cross realm trust.",
        ).optional(),
        crossRealmTrustSharedPasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the shared password between the on-cluster Kerberos realm and the remote trusted realm, in a cross realm trust relationship.",
        ).optional(),
        enableKerberos: z.boolean().describe(
          "Optional. Flag to indicate whether to Kerberize the cluster (default: false). Set this field to true to enable Kerberos on a cluster.",
        ).optional(),
        kdcDbKeyUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the master key of the KDC database.",
        ).optional(),
        keyPasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided key. For the self-signed certificate, this password is generated by the service.",
        ).optional(),
        keystorePasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided keystore. For the self-signed certificate, this password is generated by the service.",
        ).optional(),
        keystoreUri: z.string().describe(
          "Optional. The Cloud Storage URI of the keystore file used for SSL encryption. If not provided, the service will provide a self-signed certificate.",
        ).optional(),
        kmsKeyUri: z.string().describe(
          "Optional. The URI of the KMS key used to encrypt sensitive files.",
        ).optional(),
        realm: z.string().describe(
          "Optional. The name of the on-cluster Kerberos realm. If not specified, the uppercased domain of hostnames will be the realm.",
        ).optional(),
        rootPrincipalPasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the root principal password.",
        ).optional(),
        tgtLifetimeHours: z.number().int().describe(
          "Optional. The lifetime of the ticket granting ticket, in hours. If not specified, or user specifies 0, then default value 10 will be used.",
        ).optional(),
        truststorePasswordUri: z.string().describe(
          "Optional. The Cloud Storage URI of a KMS encrypted file containing the password to the user provided truststore. For the self-signed certificate, this password is generated by the service.",
        ).optional(),
        truststoreUri: z.string().describe(
          "Optional. The Cloud Storage URI of the truststore file used for SSL encryption. If not provided, the service will provide a self-signed certificate.",
        ).optional(),
      }).describe("Optional. Kerberos related configuration.").optional(),
    }).describe("Optional. Security settings for the cluster.").optional(),
    softwareConfig: z.object({
      imageVersion: z.string().describe(
        'Optional. The version of software inside the cluster. It must be one of the supported Image Versions (https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-versions#supported-dataproc-image-versions), such as "1.2" (including a subminor version, such as "1.2.29"), or the "preview" version (https://cloud.google.com/dataproc/docs/concepts/versioning/dataproc-versions#other_versions). If unspecified, it defaults to the latest Debian version.',
      ).optional(),
      optionalComponents: z.array(
        z.enum([
          "COMPONENT_UNSPECIFIED",
          "ANACONDA",
          "DELTA",
          "DOCKER",
          "DRUID",
          "FLINK",
          "HBASE",
          "HIVE_WEBHCAT",
          "HUDI",
          "ICEBERG",
          "JUPYTER",
          "PIG",
          "PRESTO",
          "TRINO",
          "RANGER",
          "SOLR",
          "ZEPPELIN",
          "ZOOKEEPER",
          "JUPYTER_KERNEL_GATEWAY",
        ]),
      ).describe("Optional. The set of components to activate on the cluster.")
        .optional(),
      properties: z.record(z.string(), z.string()).describe(
        "Optional. The properties to set on daemon config files.Property keys are specified in prefix:property format, for example core:hadoop.tmp.dir. The following are supported prefixes and their mappings: capacity-scheduler: capacity-scheduler.xml core: core-site.xml distcp: distcp-default.xml hdfs: hdfs-site.xml hive: hive-site.xml mapred: mapred-site.xml pig: pig.properties spark: spark-defaults.conf yarn: yarn-site.xmlFor more information, see Cluster properties (https://cloud.google.com/dataproc/docs/concepts/cluster-properties).",
      ).optional(),
    }).describe("Optional. The config settings for cluster software.")
      .optional(),
    tempBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to store ephemeral cluster and jobs data, such as Spark and MapReduce history files. If you do not specify a temp bucket, the service will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's temp bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket. The default bucket has a TTL of 90 days, but you can use any TTL (or none) if you specify a bucket (see staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
    workerConfig: z.object({
      accelerators: z.array(z.object({
        acceleratorCount: z.number().int().describe(
          "The number of the accelerator cards of this type exposed to this instance.",
        ).optional(),
        acceleratorTypeUri: z.string().describe(
          "Full URL, partial URI, or short name of the accelerator type resource to expose to this instance. See Compute Engine AcceleratorTypes (https://cloud.google.com/compute/docs/reference/v1/acceleratorTypes).Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 projects/[project_id]/zones/[zone]/acceleratorTypes/nvidia-tesla-t4 nvidia-tesla-t4Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the accelerator type resource, for example, nvidia-tesla-t4.",
        ).optional(),
      })).describe(
        "Optional. The Compute Engine accelerator configuration for these instances.",
      ).optional(),
      diskConfig: z.object({
        attachedDiskConfigs: z.array(z.object({
          diskSizeGb: z.unknown().describe("Optional. Disk size in GB.")
            .optional(),
          diskType: z.unknown().describe("Optional. Disk type.").optional(),
          provisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
          provisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
          ).optional(),
        })).describe(
          "Optional. A list of attached disk configs for a group of VM instances.",
        ).optional(),
        bootDiskProvisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskProvisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
        ).optional(),
        bootDiskSizeGb: z.number().int().describe(
          "Optional. Size in GB of the boot disk (default is 500GB).",
        ).optional(),
        bootDiskType: z.string().describe(
          "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
        ).optional(),
        localSsdInterface: z.string().describe(
          "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
        ).optional(),
        numLocalSsds: z.number().int().describe(
          "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
        ).optional(),
      }).describe("Optional. Disk option config settings.").optional(),
      imageUri: z.string().describe(
        "Optional. The Compute Engine image resource used for cluster instances.The URI can represent an image or image family.Image examples: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/[image-id] projects/[project_id]/global/images/[image-id] image-idImage family examples. The service will use the most recent image from the family: https://www.googleapis.com/compute/v1/projects/[project_id]/global/images/family/[custom-image-family-name] projects/[project_id]/global/images/family/[custom-image-family-name]If the URI is unspecified, it will be inferred from SoftwareConfig.image_version or the system default.",
      ).optional(),
      instanceFlexibilityPolicy: z.object({
        instanceMachineTypes: z.record(z.string(), z.string()).describe(
          "Output only. A map of instance short name to machine type. The key is the short name of the Compute Engine instance, and the value is the full machine-type name (e.g., 'n1-standard-16'). See Machine types for more information on valid machine type strings.",
        ).optional(),
        instanceSelectionList: z.array(z.object({
          diskConfig: z.unknown().describe(
            "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
          ).optional(),
          machineTypes: z.unknown().describe(
            'Optional. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          rank: z.unknown().describe(
            "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
          ).optional(),
        })).describe(
          "Optional. List of instance selection options that the group will use when creating new VMs.",
        ).optional(),
        instanceSelectionResults: z.array(z.object({
          machineType: z.unknown().describe(
            'Output only. Full machine-type names, e.g. "n1-standard-16".',
          ).optional(),
          vmCount: z.unknown().describe(
            "Output only. Number of VM provisioned with the machine_type.",
          ).optional(),
        })).describe(
          "Output only. A list of instance selection results in the group.",
        ).optional(),
        provisioningModelMix: z.object({
          standardCapacityBase: z.number().int().describe(
            "Optional. The base capacity that will always use Standard VMs to avoid risk of more preemption than the minimum capacity you need. The service will create only standard VMs until it reaches standard_capacity_base, then it will start using standard_capacity_percent_above_base to mix Spot with Standard VMs. eg. If 15 instances are requested and standard_capacity_base is 5, the service will create 5 standard VMs and thenstart mixing spot and standard VMs for remaining 10 instances.",
          ).optional(),
          standardCapacityPercentAboveBase: z.number().int().describe(
            "Optional. The percentage of target capacity that should use Standard VM. The remaining percentage will use Spot VMs. The percentage applies only to the capacity above standard_capacity_base. eg. If 15 instances are requested and standard_capacity_base is 5 and standard_capacity_percent_above_base is 30, the service will create 5 standard VMs and then start mixing spot and standard VMs for remaining 10 instances. The mix will be 30% standard and 70% spot.",
          ).optional(),
        }).describe(
          "Optional. Defines how the Group selects the provisioning model to ensure required reliability.",
        ).optional(),
      }).describe(
        "Optional. Instance flexibility Policy allowing a mixture of VM shapes and provisioning models.",
      ).optional(),
      instanceNames: z.array(z.string()).describe(
        "Output only. The list of instance names, derived from cluster_name, num_instances, and the instance group.",
      ).optional(),
      instanceReferences: z.array(z.object({
        instanceId: z.string().describe(
          "The unique identifier of the Compute Engine instance.",
        ).optional(),
        instanceName: z.string().describe(
          "The user-friendly name of the Compute Engine instance.",
        ).optional(),
        publicEciesKey: z.string().describe(
          "The public ECIES key used for sharing data with this instance.",
        ).optional(),
        publicKey: z.string().describe(
          "The public RSA key used for sharing data with this instance.",
        ).optional(),
      })).describe(
        "Output only. List of references to Compute Engine instances.",
      ).optional(),
      isPreemptible: z.boolean().describe(
        "Output only. Specifies that this instance group contains preemptible instances.",
      ).optional(),
      machineTypeUri: z.string().describe(
        "Optional. The Compute Engine machine type used for cluster instances.A full URL, partial URI, or short name are valid. Examples: https://www.googleapis.com/compute/v1/projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 projects/[project_id]/zones/[zone]/machineTypes/n1-standard-2 n1-standard-2Auto Zone Exception: If you are using Auto Zone Placement (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/auto-zone#using_auto_zone_placement), you must use the short name of the machine type resource, for example, n1-standard-2.",
      ).optional(),
      managedGroupConfig: z.object({
        instanceGroupManagerName: z.string().describe(
          "Output only. The name of the Instance Group Manager for this group.",
        ).optional(),
        instanceGroupManagerUri: z.string().describe(
          "Output only. The partial URI to the instance group manager for this group. E.g. projects/my-project/regions/us-central1/instanceGroupManagers/my-igm.",
        ).optional(),
        instanceTemplateName: z.string().describe(
          "Output only. The name of the Instance Template used for the Managed Instance Group.",
        ).optional(),
      }).describe(
        "Output only. The config for Compute Engine Instance Group Manager that manages this group. This is only used for preemptible instance groups.",
      ).optional(),
      minCpuPlatform: z.string().describe(
        "Optional. Specifies the minimum cpu platform for the Instance Group. See Minimum CPU Platform (https://cloud.google.com/dataproc/docs/concepts/compute/dataproc-min-cpu).",
      ).optional(),
      minNumInstances: z.number().int().describe(
        "Optional. The minimum number of primary worker instances to create. If min_num_instances is set, cluster creation will succeed if the number of primary workers created is at least equal to the min_num_instances number.Example: Cluster creation request with num_instances = 5 and min_num_instances = 3: If 4 VMs are created and 1 instance fails, the failed VM is deleted. The cluster is resized to 4 instances and placed in a RUNNING state. If 2 instances are created and 3 instances fail, the cluster in placed in an ERROR state. The failed VMs are not deleted.",
      ).optional(),
      numInstances: z.number().int().describe(
        "Optional. The number of VM instances in the instance group. For HA cluster master_config groups, must be set to 3. For standard cluster master_config groups, must be set to 1.",
      ).optional(),
      preemptibility: z.enum([
        "PREEMPTIBILITY_UNSPECIFIED",
        "NON_PREEMPTIBLE",
        "PREEMPTIBLE",
        "SPOT",
      ]).describe(
        "Optional. Specifies the preemptibility of the instance group.The default value for master and worker groups is NON_PREEMPTIBLE. This default cannot be changed.The default value for secondary instances is PREEMPTIBLE.",
      ).optional(),
      startupConfig: z.object({
        requiredRegistrationFraction: z.number().describe(
          "Optional. The config setting to enable cluster creation/ updation to be successful only after required_registration_fraction of instances are up and running. This configuration is applicable to only secondary workers for now. The cluster will fail if required_registration_fraction of instances are not available. This will include instance creation, agent registration, and service registration (if enabled).",
        ).optional(),
      }).describe(
        "Optional. Configuration to handle the startup of instances during cluster create and update process.",
      ).optional(),
    }).describe(
      "Optional. The Compute Engine config settings for the cluster's worker instances.",
    ).optional(),
  }).describe(
    "Optional. The cluster config for a cluster of Compute Engine Instances. Note that the service may set default values, and values may change when clusters are updated.Exactly one of ClusterConfig or VirtualClusterConfig must be specified.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. The labels to associate with this cluster. Label keys must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values may be empty, but, if present, must contain 1 to 63 characters, and must conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). No more than 32 labels can be associated with a cluster.",
  ).optional(),
  projectId: z.string().describe(
    "Required. The Google Cloud Platform project ID that the cluster belongs to.",
  ).optional(),
  virtualClusterConfig: z.object({
    auxiliaryServicesConfig: z.object({
      metastoreConfig: z.object({
        dataprocMetastoreService: z.string().describe(
          "Required. Resource name of an existing Metastore service.Example: projects/[project_id]/locations/[dataproc_region]/services/[service-name]",
        ).optional(),
      }).describe(
        "Optional. The Hive Metastore configuration for this workload.",
      ).optional(),
      sparkHistoryServerConfig: z.object({
        dataprocCluster: z.string().describe(
          "Optional. Resource name of an existing Dataproc Cluster to act as a Spark History Server for the workload.Example: projects/[project_id]/regions/[region]/clusters/[cluster_name]",
        ).optional(),
      }).describe(
        "Optional. The Spark History Server configuration for the workload.",
      ).optional(),
    }).describe(
      "Optional. Configuration of auxiliary services used by this cluster.",
    ).optional(),
    kubernetesClusterConfig: z.object({
      gkeClusterConfig: z.object({
        gkeClusterTarget: z.string().describe(
          "Optional. A target GKE cluster to deploy to. It must be in the same project and region as the Dataproc cluster (the GKE cluster can be zonal or regional). Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
        ).optional(),
        namespacedGkeDeploymentTarget: z.object({
          clusterNamespace: z.string().describe(
            "Optional. A namespace within the GKE cluster to deploy into.",
          ).optional(),
          targetGkeCluster: z.string().describe(
            "Optional. The target GKE cluster to deploy to. Format: 'projects/{project}/locations/{location}/clusters/{cluster_id}'",
          ).optional(),
        }).describe(
          "Optional. Deprecated. Use gkeClusterTarget. Used only for the deprecated beta. A target for the deployment.",
        ).optional(),
        nodePoolTarget: z.array(z.object({
          nodePool: z.unknown().describe(
            "Required. The target GKE node pool. Format: 'projects/{project}/locations/{location}/clusters/{cluster}/nodePools/{node_pool}'",
          ).optional(),
          nodePoolConfig: z.unknown().describe(
            "Input only. The configuration for the GKE node pool.If specified, Dataproc attempts to create a node pool with the specified shape. If one with the same name already exists, it is verified against all specified fields. If a field differs, the virtual cluster creation will fail.If omitted, any node pool with the specified name is used. If a node pool with the specified name does not exist, Dataproc create a node pool with default values.This is an input only field. It will not be returned by the API.",
          ).optional(),
          roles: z.unknown().describe(
            "Required. The roles associated with the GKE node pool.",
          ).optional(),
        })).describe(
          "Optional. GKE node pools where workloads will be scheduled. At least one node pool must be assigned the DEFAULT GkeNodePoolTarget.Role. If a GkeNodePoolTarget is not specified, Dataproc constructs a DEFAULT GkeNodePoolTarget. Each role can be given to only one GkeNodePoolTarget. All node pools must have the same location settings.",
        ).optional(),
      }).describe(
        "Required. The configuration for running the Dataproc cluster on GKE.",
      ).optional(),
      kubernetesNamespace: z.string().describe(
        "Optional. A namespace within the Kubernetes cluster to deploy into. If this namespace does not exist, it is created. If it exists, Dataproc verifies that another Dataproc VirtualCluster is not installed into it. If not specified, the name of the Dataproc Cluster is used.",
      ).optional(),
      kubernetesSoftwareConfig: z.object({
        componentVersion: z.record(z.string(), z.string()).describe(
          "The components that should be installed in this Dataproc cluster. The key must be a string from the KubernetesComponent enumeration. The value is the version of the software to be installed. At least one entry must be specified.",
        ).optional(),
        properties: z.record(z.string(), z.string()).describe(
          "The properties to set on daemon config files.Property keys are specified in prefix:property format, for example spark:spark.kubernetes.container.image. The following are supported prefixes and their mappings: spark: spark-defaults.confFor more information, see Cluster properties (https://cloud.google.com/dataproc/docs/concepts/cluster-properties).",
        ).optional(),
      }).describe(
        "Optional. The software configuration for this Dataproc cluster running on Kubernetes.",
      ).optional(),
    }).describe(
      "Required. The configuration for running the cluster on Kubernetes.",
    ).optional(),
    stagingBucket: z.string().describe(
      "Optional. A Cloud Storage bucket used to stage job dependencies, config files, and job driver console output. If you do not specify a staging bucket, the service will determine a Cloud Storage location (US, ASIA, or EU) for your cluster's staging bucket according to the Compute Engine zone where your cluster is deployed, and then create and manage this project-level, per-location bucket (see staging and temp buckets (https://cloud.google.com/dataproc/docs/concepts/configuring-clusters/staging-bucket)). This field requires a Cloud Storage bucket name, not a gs://... URI to a Cloud Storage bucket.",
    ).optional(),
  }).describe(
    "Optional. The virtual cluster config is used when creating a cluster that does not directly control the underlying compute resources, for example, when creating a GKE cluster (https://cloud.google.com/dataproc/docs/guides/dpgke/dataproc-gke-overview). the service may set default values, and values may change when clusters are updated. Exactly one of config or virtual_cluster_config must be specified.",
  ).optional(),
  region: z.string().describe(
    "Required. The region in which to handle the request.",
  ).optional(),
  actionOnFailedPrimaryWorkers: z.string().describe(
    "Optional. Failure action when primary worker creation fails.",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two CreateClusterRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateClusterRequest)s with the same id, then the second request will be ignored and the first google.longrunning.Operation created and stored in the backend is returned.It is recommended to always set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
  ).optional(),
  gracefulDecommissionTimeout: z.string().describe(
    "Optional. Timeout for graceful YARN decommissioning. Graceful decommissioning allows removing nodes from the cluster without interrupting jobs in progress. Timeout specifies how long to wait for jobs in progress to finish before forcefully removing nodes (and potentially interrupting jobs). Default timeout is 0 (for forceful decommission), and the maximum allowed timeout is 1 day. (see JSON representation of Duration (https://developers.google.com/protocol-buffers/docs/proto3#json)).Supported in image versions 1.2 and higher.",
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

/** Swamp extension model for Google Cloud Dataproc Clusters. Registered at `@swamp/gcp/dataproc/clusters`. */
export const model = {
  type: "@swamp/gcp/dataproc/clusters",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
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
      toVersion: "2026.06.05.1",
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
      toVersion: "2026.06.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.02.1",
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
      description: "Removed: metrics, status",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { metrics: _metrics, status: _status, ...rest } = old;
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
      toVersion: "2026.07.21.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
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
      toVersion: "2026.08.13.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.05.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "Added: gracefulDecommissionTimeout",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "Describes the identifying information, config, and status of a cluster",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a clusters",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        const body: Record<string, unknown> = {};
        if (g["clusterName"] !== undefined) {
          body["clusterName"] = g["clusterName"];
        }
        if (g["config"] !== undefined) body["config"] = g["config"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["virtualClusterConfig"] !== undefined) {
          body["virtualClusterConfig"] = g["virtualClusterConfig"];
        }
        if (g["actionOnFailedPrimaryWorkers"] !== undefined) {
          params["actionOnFailedPrimaryWorkers"] = String(
            g["actionOnFailedPrimaryWorkers"],
          );
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
        if (g["name"] !== undefined) params["clusterName"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          undefined,
          credentials,
        ) as StateData;
        const instanceName = (g.name?.toString() ?? "current").replace(
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
    get: {
      description: "Get a clusters",
      arguments: z.object({
        identifier: z.string().describe("The name of the clusters"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        params["clusterName"] = args.identifier;
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName = (g.name?.toString() ?? args.identifier).replace(
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
      description: "Update clusters attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific clusters by name (e.g. one discovered by list)",
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
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        else if (existing["region"]) {
          params["region"] = String(existing["region"]);
        }
        params["clusterName"] = existing["clusterName"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["config"] !== undefined) body["config"] = g["config"];
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["virtualClusterConfig"] !== undefined) {
          body["virtualClusterConfig"] = g["virtualClusterConfig"];
        }
        if (g["gracefulDecommissionTimeout"] !== undefined) {
          params["gracefulDecommissionTimeout"] = String(
            g["gracefulDecommissionTimeout"],
          );
        } else if (existing["gracefulDecommissionTimeout"] !== undefined) {
          params["gracefulDecommissionTimeout"] = String(
            existing["gracefulDecommissionTimeout"],
          );
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
      description: "Delete the clusters",
      arguments: z.object({
        identifier: z.string().describe("The name of the clusters"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        params["clusterName"] = args.identifier;
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
      description: "Sync clusters state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific clusters by name (e.g. one discovered by list)",
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
          const params: Record<string, string> = { projectId: projectId };
          if (g["region"] !== undefined) params["region"] = String(g["region"]);
          else if (existing["region"]) {
            params["region"] = String(existing["region"]);
          }
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["clusterName"] = identifier;
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
      description: "List clusters resources",
      arguments: z.object({
        filter: z.string().describe(
          'Optional. A filter constraining the clusters to list. Filters are case-sensitive and have the following syntax:field = value AND field = value ...where field is one of status.state, clusterName, or labels.[KEY], and [KEY] is a label key. value can be "*" to match all values. status.state can be one of the following: ACTIVE, INACTIVE, CREATING, RUNNING, ERROR, DELETING, UPDATING, STOPPING, or STOPPED. ACTIVE contains the CREATING, UPDATING, and RUNNING states. INACTIVE contains the DELETING, ERROR, STOPPING, and STOPPED states. clusterName is the name of the cluster provided at creation time. Only the logical AND operator is supported; space-separated items are treated as having an implicit AND operator.Example filter:status.state = ACTIVE AND clusterName = mycluster AND labels.env = staging AND labels.starred = *',
        ).optional(),
        pageSize: z.number().describe(
          "Optional. The maximum number of clusters to return in each response. The service may return fewer than this value. If unspecified, the default value is 200. The maximum value is 1000.",
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
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
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
          "clusters",
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
    diagnose: {
      description: "diagnose",
      arguments: z.object({
        diagnosisInterval: z.any().optional(),
        job: z.any().optional(),
        jobs: z.any().optional(),
        tarballAccess: z.any().optional(),
        tarballGcsDir: z.any().optional(),
        yarnApplicationId: z.any().optional(),
        yarnApplicationIds: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        if (g["clusterName"] !== undefined) {
          params["clusterName"] = String(g["clusterName"]);
        }
        const body: Record<string, unknown> = {};
        if (args["diagnosisInterval"] !== undefined) {
          body["diagnosisInterval"] = args["diagnosisInterval"];
        }
        if (args["job"] !== undefined) body["job"] = args["job"];
        if (args["jobs"] !== undefined) body["jobs"] = args["jobs"];
        if (args["tarballAccess"] !== undefined) {
          body["tarballAccess"] = args["tarballAccess"];
        }
        if (args["tarballGcsDir"] !== undefined) {
          body["tarballGcsDir"] = args["tarballGcsDir"];
        }
        if (args["yarnApplicationId"] !== undefined) {
          body["yarnApplicationId"] = args["yarnApplicationId"];
        }
        if (args["yarnApplicationIds"] !== undefined) {
          body["yarnApplicationIds"] = args["yarnApplicationIds"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.diagnose",
            "path":
              "v1/projects/{projectId}/regions/{region}/clusters/{clusterName}:diagnose",
            "httpMethod": "POST",
            "parameterOrder": ["projectId", "region", "clusterName"],
            "parameters": {
              "clusterName": { "location": "path", "required": true },
              "projectId": { "location": "path", "required": true },
              "region": { "location": "path", "required": true },
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
        options: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
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
        if (args["options"] !== undefined) body["options"] = args["options"];
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.getIamPolicy",
            "path": "v1/{+resource}:getIamPolicy",
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
    inject_credentials: {
      description: "inject credentials",
      arguments: z.object({
        clusterUuid: z.any().optional(),
        credentialsCiphertext: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
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
        params["cluster"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["clusterUuid"] !== undefined) {
          body["clusterUuid"] = args["clusterUuid"];
        }
        if (args["credentialsCiphertext"] !== undefined) {
          body["credentialsCiphertext"] = args["credentialsCiphertext"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.injectCredentials",
            "path": "v1/{+project}/{+region}/{+cluster}:injectCredentials",
            "httpMethod": "POST",
            "parameterOrder": ["project", "region", "cluster"],
            "parameters": {
              "cluster": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "region": { "location": "path", "required": true },
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
    repair: {
      description: "repair",
      arguments: z.object({
        cluster: z.any().optional(),
        clusterUuid: z.any().optional(),
        dataprocSuperUser: z.any().optional(),
        gracefulDecommissionTimeout: z.any().optional(),
        nodePools: z.any().optional(),
        parentOperationId: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        if (g["clusterName"] !== undefined) {
          params["clusterName"] = String(g["clusterName"]);
        }
        const body: Record<string, unknown> = {};
        if (args["cluster"] !== undefined) body["cluster"] = args["cluster"];
        if (args["clusterUuid"] !== undefined) {
          body["clusterUuid"] = args["clusterUuid"];
        }
        if (args["dataprocSuperUser"] !== undefined) {
          body["dataprocSuperUser"] = args["dataprocSuperUser"];
        }
        if (args["gracefulDecommissionTimeout"] !== undefined) {
          body["gracefulDecommissionTimeout"] =
            args["gracefulDecommissionTimeout"];
        }
        if (args["nodePools"] !== undefined) {
          body["nodePools"] = args["nodePools"];
        }
        if (args["parentOperationId"] !== undefined) {
          body["parentOperationId"] = args["parentOperationId"];
        }
        if (args["requestId"] !== undefined) {
          body["requestId"] = args["requestId"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.repair",
            "path":
              "v1/projects/{projectId}/regions/{region}/clusters/{clusterName}:repair",
            "httpMethod": "POST",
            "parameterOrder": ["projectId", "region", "clusterName"],
            "parameters": {
              "clusterName": { "location": "path", "required": true },
              "projectId": { "location": "path", "required": true },
              "region": { "location": "path", "required": true },
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
    set_iam_policy: {
      description: "set iam policy",
      arguments: z.object({
        policy: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
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
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.setIamPolicy",
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
        clusterUuid: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        if (g["clusterName"] !== undefined) {
          params["clusterName"] = String(g["clusterName"]);
        }
        const body: Record<string, unknown> = {};
        if (args["clusterUuid"] !== undefined) {
          body["clusterUuid"] = args["clusterUuid"];
        }
        if (args["requestId"] !== undefined) {
          body["requestId"] = args["requestId"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.start",
            "path":
              "v1/projects/{projectId}/regions/{region}/clusters/{clusterName}:start",
            "httpMethod": "POST",
            "parameterOrder": ["projectId", "region", "clusterName"],
            "parameters": {
              "clusterName": { "location": "path", "required": true },
              "projectId": { "location": "path", "required": true },
              "region": { "location": "path", "required": true },
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
    stop: {
      description: "stop",
      arguments: z.object({
        clusterUuid: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["region"] !== undefined) params["region"] = String(g["region"]);
        if (g["clusterName"] !== undefined) {
          params["clusterName"] = String(g["clusterName"]);
        }
        const body: Record<string, unknown> = {};
        if (args["clusterUuid"] !== undefined) {
          body["clusterUuid"] = args["clusterUuid"];
        }
        if (args["requestId"] !== undefined) {
          body["requestId"] = args["requestId"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.stop",
            "path":
              "v1/projects/{projectId}/regions/{region}/clusters/{clusterName}:stop",
            "httpMethod": "POST",
            "parameterOrder": ["projectId", "region", "clusterName"],
            "parameters": {
              "clusterName": { "location": "path", "required": true },
              "projectId": { "location": "path", "required": true },
              "region": { "location": "path", "required": true },
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
        const params: Record<string, string> = { projectId: projectId };
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
            "id": "dataproc.projects.regions.clusters.testIamPermissions",
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
