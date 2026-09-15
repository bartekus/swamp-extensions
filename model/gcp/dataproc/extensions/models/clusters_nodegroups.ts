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

// Auto-generated extension model for @swamp/gcp/dataproc/clusters-nodegroups
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Dataproc Clusters.NodeGroups.
 *
 * Node Group. The NodeGroup resource is not related to the NodeGroupAffinity resource.
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
  readResource,
} from "./_lib/gcp.ts";

/** Construct the fully-qualified resource name from parent and short name. */
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/nodeGroups/${shortName}`;
}

const BASE_URL = "https://dataproc.googleapis.com/";

const GET_CONFIG = {
  "id": "dataproc.projects.regions.clusters.nodeGroups.get",
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
  "id": "dataproc.projects.regions.clusters.nodeGroups.create",
  "path": "v1/{+parent}/nodeGroups",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "nodeGroupId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
    "parentOperationId": {
      "location": "query",
    },
    "requestId": {
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
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Node group labels. Label keys must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values can be empty. If specified, they must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). The node group must have no more than 32 labels.",
  ).optional(),
  name: z.string().describe(
    "The Node group resource name (https://aip.dev/122).",
  ).optional(),
  nodeGroupConfig: z.object({
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
        diskSizeGb: z.number().int().describe("Optional. Disk size in GB.")
          .optional(),
        diskType: z.enum([
          "DISK_TYPE_UNSPECIFIED",
          "HYPERDISK_BALANCED",
          "HYPERDISK_EXTREME",
          "HYPERDISK_ML",
          "HYPERDISK_THROUGHPUT",
        ]).describe("Optional. Deprecated: Use type instead.").optional(),
        provisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
        ).optional(),
        provisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
        ).optional(),
        type: z.string().describe(
          "Optional. Attached disk type. Currently only supports Hyperdisks. See https://cloud.google.com/compute/docs/disks/hyperdisks. Note: Hyperdisk Balanced High Availability is not supported.Allowed values are: hyperdisk-balanced hyperdisk-extreme hyperdisk-ml hyperdisk-throughput",
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
        diskConfig: z.object({
          attachedDiskConfigs: z.unknown().describe(
            "Optional. A list of attached disk configs for a group of VM instances.",
          ).optional(),
          bootDiskProvisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
          ).optional(),
          bootDiskProvisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
          ).optional(),
          bootDiskSizeGb: z.unknown().describe(
            "Optional. Size in GB of the boot disk (default is 500GB).",
          ).optional(),
          bootDiskType: z.unknown().describe(
            "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
          ).optional(),
          localSsdInterface: z.unknown().describe(
            "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
          ).optional(),
          numLocalSsds: z.unknown().describe(
            "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
          ).optional(),
        }).describe(
          "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
        ).optional(),
        machineTypes: z.array(z.unknown()).describe(
          'Optional. Full machine-type names, e.g. "n1-standard-16".',
        ).optional(),
        rank: z.number().int().describe(
          "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
        ).optional(),
      })).describe(
        "Optional. List of instance selection options that the group will use when creating new VMs.",
      ).optional(),
      instanceSelectionResults: z.array(z.object({
        machineType: z.string().describe(
          'Output only. Full machine-type names, e.g. "n1-standard-16".',
        ).optional(),
        vmCount: z.number().int().describe(
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
    })).describe("Output only. List of references to Compute Engine instances.")
      .optional(),
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
  }).describe("Optional. The node group instance group configuration.")
    .optional(),
  roles: z.array(z.enum(["ROLE_UNSPECIFIED", "DRIVER"])).describe(
    "Required. Node group roles.",
  ).optional(),
  nodeGroupId: z.string().describe(
    "Optional. An optional node group ID. Generated if not specified.The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of from 3 to 33 characters.",
  ).optional(),
  parentOperationId: z.string().describe(
    "Optional. operation id of the parent operation sending the create request",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two CreateNodeGroupRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateNodeGroupRequest) with the same ID, the second request is ignored and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  labels: z.record(z.string(), z.unknown()).optional(),
  name: z.string(),
  nodeGroupConfig: z.object({
    accelerators: z.array(z.object({
      acceleratorCount: z.number(),
      acceleratorTypeUri: z.string(),
    })),
    diskConfig: z.object({
      attachedDiskConfigs: z.array(z.object({
        diskSizeGb: z.number(),
        diskType: z.string(),
        provisionedIops: z.string(),
        provisionedThroughput: z.string(),
        type: z.string(),
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
        diskConfig: z.object({
          attachedDiskConfigs: z.unknown(),
          bootDiskProvisionedIops: z.unknown(),
          bootDiskProvisionedThroughput: z.unknown(),
          bootDiskSizeGb: z.unknown(),
          bootDiskType: z.unknown(),
          localSsdInterface: z.unknown(),
          numLocalSsds: z.unknown(),
        }),
        machineTypes: z.array(z.unknown()),
        rank: z.number(),
      })),
      instanceSelectionResults: z.array(z.object({
        machineType: z.string(),
        vmCount: z.number(),
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
  }).optional(),
  roles: z.array(z.string()).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Node group labels. Label keys must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). Label values can be empty. If specified, they must consist of from 1 to 63 characters and conform to RFC 1035 (https://www.ietf.org/rfc/rfc1035.txt). The node group must have no more than 32 labels.",
  ).optional(),
  name: z.string().describe(
    "The Node group resource name (https://aip.dev/122).",
  ).optional(),
  nodeGroupConfig: z.object({
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
        diskSizeGb: z.number().int().describe("Optional. Disk size in GB.")
          .optional(),
        diskType: z.enum([
          "DISK_TYPE_UNSPECIFIED",
          "HYPERDISK_BALANCED",
          "HYPERDISK_EXTREME",
          "HYPERDISK_ML",
          "HYPERDISK_THROUGHPUT",
        ]).describe("Optional. Deprecated: Use type instead.").optional(),
        provisionedIops: z.string().describe(
          "Optional. Indicates how many IOPS to provision for the attached disk. This sets the number of I/O operations per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
        ).optional(),
        provisionedThroughput: z.string().describe(
          "Optional. Indicates how much throughput to provision for the attached disk. This sets the number of throughput mb per second that the disk can handle. See https://cloud.google.com/compute/docs/disks/hyperdisks#hyperdisk-features",
        ).optional(),
        type: z.string().describe(
          "Optional. Attached disk type. Currently only supports Hyperdisks. See https://cloud.google.com/compute/docs/disks/hyperdisks. Note: Hyperdisk Balanced High Availability is not supported.Allowed values are: hyperdisk-balanced hyperdisk-extreme hyperdisk-ml hyperdisk-throughput",
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
        diskConfig: z.object({
          attachedDiskConfigs: z.unknown().describe(
            "Optional. A list of attached disk configs for a group of VM instances.",
          ).optional(),
          bootDiskProvisionedIops: z.unknown().describe(
            "Optional. Indicates how many IOPS to provision for the disk. This sets the number of I/O operations per second that the disk can handle. This field is supported only if boot_disk_type is hyperdisk-balanced.",
          ).optional(),
          bootDiskProvisionedThroughput: z.unknown().describe(
            "Optional. Indicates how much throughput to provision for the disk. This sets the number of throughput mb per second that the disk can handle. Values must be greater than or equal to 1. This field is supported only if boot_disk_type is hyperdisk-balanced.",
          ).optional(),
          bootDiskSizeGb: z.unknown().describe(
            "Optional. Size in GB of the boot disk (default is 500GB).",
          ).optional(),
          bootDiskType: z.unknown().describe(
            "Optional. Type of the boot disk (default is pd-standard). Valid values: pd-balanced (Persistent Disk Balanced Solid State Drive), pd-ssd (Persistent Disk Solid State Drive), or pd-standard (Persistent Disk Hard Disk Drive). See Disk types (https://cloud.google.com/compute/docs/disks#disk-types).",
          ).optional(),
          localSsdInterface: z.unknown().describe(
            "Optional. Interface type of local SSDs (default is scsi). Valid values: scsi (Small Computer System Interface), nvme (Non-Volatile Memory Express). See local SSD performance (https://cloud.google.com/compute/docs/disks/local-ssd#performance).",
          ).optional(),
          numLocalSsds: z.unknown().describe(
            "Optional. Number of attached SSDs, from 0 to 8 (default is 0). If SSDs are not attached, the boot disk is used to store runtime logs and HDFS (https://hadoop.apache.org/docs/r1.2.1/hdfs_user_guide.html) data. If one or more SSDs are attached, this runtime bulk data is spread across them, and the boot disk contains only basic config and installed binaries.Note: Local SSD options may vary by machine type and number of vCPUs selected.",
          ).optional(),
        }).describe(
          "Optional. Disk configuration to apply to the instances in this instance selection. If specified on any entry in instanceSelectionList, then it must be specified on every entry in instanceSelectionList and the instanceGroupConfig must not specify any diskConfig.",
        ).optional(),
        machineTypes: z.array(z.unknown()).describe(
          'Optional. Full machine-type names, e.g. "n1-standard-16".',
        ).optional(),
        rank: z.number().int().describe(
          "Optional. Preference of this instance selection. Lower number means higher preference. The service will first try to create a VM based on the machine-type with priority rank and fallback to next rank based on availability. Machine types and instance selections with the same priority have the same preference.",
        ).optional(),
      })).describe(
        "Optional. List of instance selection options that the group will use when creating new VMs.",
      ).optional(),
      instanceSelectionResults: z.array(z.object({
        machineType: z.string().describe(
          'Output only. Full machine-type names, e.g. "n1-standard-16".',
        ).optional(),
        vmCount: z.number().int().describe(
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
    })).describe("Output only. List of references to Compute Engine instances.")
      .optional(),
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
  }).describe("Optional. The node group instance group configuration.")
    .optional(),
  roles: z.array(z.enum(["ROLE_UNSPECIFIED", "DRIVER"])).describe(
    "Required. Node group roles.",
  ).optional(),
  nodeGroupId: z.string().describe(
    "Optional. An optional node group ID. Generated if not specified.The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). Cannot begin or end with underscore or hyphen. Must consist of from 3 to 33 characters.",
  ).optional(),
  parentOperationId: z.string().describe(
    "Optional. operation id of the parent operation sending the create request",
  ).optional(),
  requestId: z.string().describe(
    "Optional. A unique ID used to identify the request. If the server receives two CreateNodeGroupRequest (https://cloud.google.com/dataproc/docs/reference/rpc/google.cloud.dataproc.v1#google.cloud.dataproc.v1.CreateNodeGroupRequest) with the same ID, the second request is ignored and the first google.longrunning.Operation created and stored in the backend is returned.Recommendation: Set this value to a UUID (https://en.wikipedia.org/wiki/Universally_unique_identifier).The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), and hyphens (-). The maximum length is 40 characters.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
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

/** Swamp extension model for Google Cloud Dataproc Clusters.NodeGroups. Registered at `@swamp/gcp/dataproc/clusters-nodegroups`. */
export const model = {
  type: "@swamp/gcp/dataproc/clusters-nodegroups",
  version: "2026.09.15.1",
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
      toVersion: "2026.07.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
      description: "Added: parent",
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
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "Node Group. The NodeGroup resource is not related to the NodeGroupAffinity re...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a nodeGroups",
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
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["nodeGroupConfig"] !== undefined) {
          body["nodeGroupConfig"] = g["nodeGroupConfig"];
        }
        if (g["roles"] !== undefined) body["roles"] = g["roles"];
        if (g["nodeGroupId"] !== undefined) {
          params["nodeGroupId"] = String(g["nodeGroupId"]);
        }
        if (g["parentOperationId"] !== undefined) {
          params["parentOperationId"] = String(g["parentOperationId"]);
        }
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
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
          undefined,
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
      description: "Get a nodeGroups",
      arguments: z.object({
        identifier: z.string().describe("The name of the nodeGroups"),
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
    sync: {
      description: "Sync nodeGroups state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific nodeGroups by name (e.g. one discovered by list)",
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
    repair: {
      description: "repair",
      arguments: z.object({
        instanceNames: z.any().optional(),
        repairAction: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined && g["name"] !== undefined) {
          params["name"] = buildResourceName(
            String(g["parent"]),
            String(g["name"]),
          );
        }
        const body: Record<string, unknown> = {};
        if (args["instanceNames"] !== undefined) {
          body["instanceNames"] = args["instanceNames"];
        }
        if (args["repairAction"] !== undefined) {
          body["repairAction"] = args["repairAction"];
        }
        if (args["requestId"] !== undefined) {
          body["requestId"] = args["requestId"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.nodeGroups.repair",
            "path": "v1/{+name}:repair",
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
    resize: {
      description: "resize",
      arguments: z.object({
        gracefulDecommissionTimeout: z.any().optional(),
        parentOperationId: z.any().optional(),
        requestId: z.any().optional(),
        size: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined && g["name"] !== undefined) {
          params["name"] = buildResourceName(
            String(g["parent"]),
            String(g["name"]),
          );
        }
        const body: Record<string, unknown> = {};
        if (args["gracefulDecommissionTimeout"] !== undefined) {
          body["gracefulDecommissionTimeout"] =
            args["gracefulDecommissionTimeout"];
        }
        if (args["parentOperationId"] !== undefined) {
          body["parentOperationId"] = args["parentOperationId"];
        }
        if (args["requestId"] !== undefined) {
          body["requestId"] = args["requestId"];
        }
        if (args["size"] !== undefined) body["size"] = args["size"];
        const result = await createResource(
          baseUrl,
          {
            "id": "dataproc.projects.regions.clusters.nodeGroups.resize",
            "path": "v1/{+name}:resize",
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
