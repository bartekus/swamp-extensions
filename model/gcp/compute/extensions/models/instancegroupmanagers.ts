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

// Auto-generated extension model for @swamp/gcp/compute/instancegroupmanagers
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Compute Engine InstanceGroupManagers.
 *
 * Represents a Managed Instance Group resource. An instance group is a collection of VM instances that you can manage as a single entity. For more information, readInstance groups. For zonal Managed Instance Group, use the instanceGroupManagers resource. For regional Managed Instance Group, use theregionInstanceGroupManagers resource.
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

const BASE_URL = "https://compute.googleapis.com/compute/v1/";

const GET_CONFIG = {
  "id": "compute.instanceGroupManagers.get",
  "path":
    "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "zone",
    "instanceGroupManager",
  ],
  "parameters": {
    "instanceGroupManager": {
      "location": "path",
      "required": true,
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "zone": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "compute.instanceGroupManagers.insert",
  "path": "projects/{project}/zones/{zone}/instanceGroupManagers",
  "httpMethod": "POST",
  "parameterOrder": [
    "project",
    "zone",
  ],
  "parameters": {
    "project": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
    "zone": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "compute.instanceGroupManagers.patch",
  "path":
    "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "project",
    "zone",
    "instanceGroupManager",
  ],
  "parameters": {
    "instanceGroupManager": {
      "location": "path",
      "required": true,
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
    "zone": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "compute.instanceGroupManagers.delete",
  "path":
    "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "project",
    "zone",
    "instanceGroupManager",
  ],
  "parameters": {
    "instanceGroupManager": {
      "location": "path",
      "required": true,
    },
    "noGracefulShutdown": {
      "location": "query",
    },
    "project": {
      "location": "path",
      "required": true,
    },
    "requestId": {
      "location": "query",
    },
    "zone": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "compute.instanceGroupManagers.list",
  "path": "projects/{project}/zones/{zone}/instanceGroupManagers",
  "httpMethod": "GET",
  "parameterOrder": [
    "project",
    "zone",
  ],
  "parameters": {
    "filter": {
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
    "project": {
      "location": "path",
      "required": true,
    },
    "returnPartialSuccess": {
      "location": "query",
    },
    "zone": {
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
  allInstancesConfig: z.object({
    properties: z.object({
      exposeHostTopology: z.boolean().describe(
        "This optional flag exposes the hashed physical host ID.",
      ).optional(),
      labels: z.record(z.string(), z.string()).describe(
        "The label key-value pairs that you want to patch onto the instance.",
      ).optional(),
      metadata: z.record(z.string(), z.string()).describe(
        "The metadata key-value pairs that you want to patch onto the instance. For more information, see Project and instance metadata.",
      ).optional(),
    }).describe(
      "Properties to set on all instances in the group. You can add or modify properties using theinstanceGroupManagers.patch orregionInstanceGroupManagers.patch. After settingallInstancesConfig on the group, you must update the group's instances to apply the configuration. To apply the configuration, set the group's updatePolicy.type field to use proactive updates or use the applyUpdatesToInstances method.",
    ).optional(),
  }).describe(
    "Specifies configuration that overrides the instance template configuration for the group.",
  ).optional(),
  autoHealingPolicies: z.array(z.object({
    healthCheck: z.string().describe(
      "The URL for the health check that signals autohealing.",
    ).optional(),
    initialDelaySec: z.number().int().describe(
      "The initial delay is the number of seconds that a new VM takes to initialize and run its startup script. During a VM's initial delay period, the MIG ignores unsuccessful health checks because the VM might be in the startup process. This prevents the MIG from prematurely recreating a VM. If the health check receives a healthy response during the initial delay, it indicates that the startup process is complete and the VM is ready. The value of initial delay must be between 0 and 3600 seconds. The default value is 0.",
    ).optional(),
  })).describe(
    "The autohealing policy for this managed instance group. You can specify only one value.",
  ).optional(),
  baseInstanceName: z.string().describe(
    'The base instance name is a prefix that you want to attach to the names of all VMs in a MIG. The maximum character length is 58 and the name must comply with RFC1035 format. When a VM is created in the group, the MIG appends a hyphen and a random four-character string to the base instance name. If you want the MIG to assign sequential numbers instead of a random string, then end the base instance name with a hyphen followed by one or more hash symbols. The hash symbols indicate the number of digits. For example, a base instance name of "vm-###" results in "vm-001" as a VM name. @pattern [a-z](([-a-z0-9]{0,57})|([-a-z0-9]{0,51}-#{1,10}(\\\\[[0-9]{1,10}\\\\])?))',
  ).optional(),
  description: z.string().describe("An optional description of this resource.")
    .optional(),
  distributionPolicy: z.object({
    targetShape: z.enum(["ANY", "ANY_SINGLE_ZONE", "BALANCED", "EVEN"])
      .describe(
        "The distribution shape to which the group converges either proactively or on resize events (depending on the value set inupdatePolicy.instanceRedistributionType).",
      ).optional(),
    zones: z.array(z.object({
      zone: z.string().describe(
        "The URL of thezone. The zone must exist in the region where the managed instance group is located.",
      ).optional(),
    })).describe(
      "Zones where the regional managed instance group will create and manage its instances. By default, a regional MIG doesn't automatically select an AI zone to create instances, even if an AI zone is available in the specified region. To create instances in an AI zone in the selected region, you must explicitly specify it in the distribution policy together with the other preferred zones.",
    ).optional(),
  }).describe(
    "Policy specifying the intended distribution of managed instances across zones in a regional managed instance group.",
  ).optional(),
  fingerprint: z.string().describe(
    "Fingerprint of this resource. This field may be used in optimistic locking. It will be ignored when inserting an InstanceGroupManager. An up-to-date fingerprint must be provided in order to update the InstanceGroupManager, otherwise the request will fail with error412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve an InstanceGroupManager.",
  ).optional(),
  instanceFlexibilityPolicy: z.object({
    instanceSelections: z.record(
      z.string(),
      z.object({
        disks: z.array(z.object({
          architecture: z.unknown().describe(
            "Output only. [Output Only] The architecture of the attached disk. Valid values are ARM64 or X86_64.",
          ).optional(),
          autoDelete: z.unknown().describe(
            "Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).",
          ).optional(),
          boot: z.unknown().describe(
            "Indicates that this is a boot disk. The virtual machine will use the first partition of the disk for its root filesystem.",
          ).optional(),
          deviceName: z.unknown().describe(
            "Specifies a unique device name of your choice that is reflected into the/dev/disk/by-id/google-* tree of a Linux operating system running within the instance. This name can be used to reference the device for mounting, resizing, and so on, from within the instance. If not specified, the server chooses a default device name to apply to this disk, in the form persistent-disk-x, where x is a number assigned by Google Compute Engine. This field is only applicable for persistent disks.",
          ).optional(),
          diskEncryptionKey: z.unknown().describe(
            "Encrypts or decrypts a disk using acustomer-supplied encryption key. If you are creating a new disk, this field encrypts the new disk using an encryption key that you provide. If you are attaching an existing disk that is already encrypted, this field decrypts the disk using the customer-supplied encryption key. If you encrypt a disk using a customer-supplied key, you must provide the same key again when you attempt to use this resource at a later time. For example, you must provide the key when you create a snapshot or an image from the disk or when you attach the disk to a virtual machine instance. If you do not provide an encryption key, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the disk later. Note: Instance templates do not storecustomer-supplied encryption keys, so you cannot use your own keys to encrypt disks in amanaged instance group. You cannot create VMs that have disks with customer-supplied keys using the bulk insert method.",
          ).optional(),
          diskSizeGb: z.unknown().describe("The size of the disk in GB.")
            .optional(),
          forceAttach: z.unknown().describe(
            "[Input Only] Whether to force attach the regional disk even if it's currently attached to another instance. If you try to force attach a zonal disk to an instance, you will receive an error.",
          ).optional(),
          guestOsFeatures: z.unknown().describe(
            "A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
          ).optional(),
          index: z.unknown().describe(
            "Output only. [Output Only] A zero-based index to this disk, where 0 is reserved for the boot disk. If you have many disks attached to an instance, each disk would have a unique index number.",
          ).optional(),
          initializeParams: z.unknown().describe(
            "[Input Only] Specifies the parameters for a new disk that will be created alongside the new instance. Use initialization parameters to create boot disks or local SSDs attached to the new instance. This property is mutually exclusive with the source property; you can only define one or the other, but not both.",
          ).optional(),
          interface: z.unknown().describe(
            "Specifies the disk interface to use for attaching this disk, which is either SCSI or NVME. For most machine types, the default is SCSI. Local SSDs can use either NVME or SCSI. In certain configurations, persistent disks can use NVMe. For more information, seeAbout persistent disks.",
          ).optional(),
          kind: z.unknown().describe(
            "Output only. [Output Only] Type of the resource. Alwayscompute#attachedDisk for attached disks.",
          ).optional(),
          licenses: z.unknown().describe(
            "Output only. [Output Only] Any valid publicly visible licenses.",
          ).optional(),
          mode: z.unknown().describe(
            "The mode in which to attach this disk, either READ_WRITE orREAD_ONLY. If not specified, the default is to attach the disk in READ_WRITE mode.",
          ).optional(),
          savedState: z.unknown().describe(
            "Output only. For LocalSSD disks on VM Instances in STOPPED or SUSPENDED state, this field is set to PRESERVED if the LocalSSD data has been saved to a persistent location by customer request. (see the discard_local_ssd option on Stop/Suspend). Read-only in the api.",
          ).optional(),
          shieldedInstanceInitialState: z.unknown().describe(
            "Output only. [Output Only] shielded vm initial state stored on disk",
          ).optional(),
          source: z.unknown().describe(
            "Specifies a valid partial or full URL to an existing Persistent Disk resource. When creating a new instance boot disk, one ofinitializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source is required. If desired, you can also attach existing non-root persistent disks using this property. This field is only applicable for persistent disks. Note that for InstanceTemplate, specify the disk name for zonal disk, and the URL for regional disk.",
          ).optional(),
          type: z.unknown().describe(
            "Specifies the type of the disk, either SCRATCH orPERSISTENT. If not specified, the default isPERSISTENT.",
          ).optional(),
        })).describe(
          "List of disks to be attached to the instances created from this selection.",
        ).optional(),
        machineTypes: z.array(z.string()).describe(
          'Full machine-type names, e.g. "n1-standard-16".',
        ).optional(),
        minCpuPlatform: z.string().describe(
          "Name of the minimum CPU platform to be used by this instance selection. e.g. 'Intel Ice Lake'.",
        ).optional(),
        rank: z.number().int().describe(
          "Preference of this instance selection. Lower number means higher preference. MIG will first try to create a VM based on the machine-type with lowest rank and fallback to next rank based on availability. Machine types and instance selections with the same rank have the same preference.",
        ).optional(),
      }),
    ).describe(
      "Named instance selections configuring properties that the group will use when creating new VMs.",
    ).optional(),
  }).describe(
    "Instance flexibility allowing MIG to create VMs from multiple types of machines. Instance flexibility configuration on MIG overrides instance template configuration.",
  ).optional(),
  instanceLifecyclePolicy: z.object({
    defaultActionOnFailure: z.enum(["DO_NOTHING", "REPAIR"]).describe(
      "The action that a MIG performs on a failed VM. If the value of the onFailedHealthCheck field is `DEFAULT_ACTION`, then the same action also applies to the VMs on which your application fails a health check. Valid values are - REPAIR (default): MIG automatically repairs a failed VM by recreating it. For more information, see About repairing VMs in a MIG. - DO_NOTHING: MIG does not repair a failed VM.",
    ).optional(),
    forceUpdateOnRepair: z.enum(["NO", "YES"]).describe(
      "A bit indicating whether to forcefully apply the group's latest configuration when repairing a VM. Valid options are: - NO (default): If configuration updates are available, they are not forcefully applied during repair. Instead, configuration updates are applied according to the group's update policy. - YES: If configuration updates are available, they are applied during repair.",
    ).optional(),
    onFailedHealthCheck: z.enum(["DEFAULT_ACTION", "DO_NOTHING", "REPAIR"])
      .describe(
        "The action that a MIG performs on an unhealthy VM. A VM is marked as unhealthy when the application running on that VM fails a health check. Valid values are: - DEFAULT_ACTION (default): MIG uses the same action configured for instanceLifecyclePolicy.defaultActionOnFailure field. - REPAIR: MIG automatically repairs an unhealthy VM by recreating it. - DO_NOTHING: MIG doesn't repair an unhealthy VM. For more information, see About repairing VMs in a MIG.",
      ).optional(),
    onRepair: z.object({
      allowChangingZone: z.enum(["NO", "YES"]).describe(
        "Specifies whether the MIG can change a VM's zone during a repair. Valid values are: - NO (default): MIG cannot change a VM's zone during a repair. - YES: MIG can select a different zone for the VM during a repair.",
      ).optional(),
    }).describe("Configuration for VM repairs in the MIG.").optional(),
  }).describe("The repair policy for this managed instance group.").optional(),
  instanceTemplate: z.string().describe(
    "The URL of the instance template that is specified for this managed instance group. The group uses this template to create all new instances in the managed instance group. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE.",
  ).optional(),
  listManagedInstancesResults: z.enum(["PAGELESS", "PAGINATED"]).describe(
    "Pagination behavior of the listManagedInstances API method for this managed instance group.",
  ).optional(),
  name: z.string().regex(new RegExp("[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?"))
    .describe(
      "The name of the managed instance group. The name must be 1-63 characters long, and comply withRFC1035.",
    ),
  resourcePolicies: z.object({
    workloadPolicy: z.string().describe(
      "The URL of the workload policy that is specified for this managed instance group. It can be a full or partial URL. For example, the following are all valid URLs to a workload policy: - https://www.googleapis.com/compute/v1/projects/project/regions/region/resourcePolicies/resourcePolicy - projects/project/regions/region/resourcePolicies/resourcePolicy - regions/region/resourcePolicies/resourcePolicy",
    ).optional(),
  }).describe("Resource policies for this managed instance group.").optional(),
  standbyPolicy: z.object({
    initialDelaySec: z.number().int().describe(
      "Specifies the number of seconds that the MIG should wait to suspend or stop a VM after that VM was created. The initial delay gives the initialization script the time to prepare your VM for a quick scale out. The value of initial delay must be between 0 and 3600 seconds. The default value is 0.",
    ).optional(),
    mode: z.enum(["MANUAL", "SCALE_OUT_POOL"]).describe(
      "Defines how a MIG resumes or starts VMs from a standby pool when the group scales out. The default mode is `MANUAL`.",
    ).optional(),
  }).describe("Standby policy for stopped and suspended instances.").optional(),
  statefulPolicy: z.object({
    preservedState: z.object({
      disks: z.record(
        z.string(),
        z.object({
          autoDelete: z.enum(["NEVER", "ON_PERMANENT_INSTANCE_DELETION"])
            .describe(
              "These stateful disks will never be deleted during autohealing, update or VM instance recreate operations. This flag is used to configure if the disk should be deleted after it is no longer used by the group, e.g. when the given instance or the whole group is deleted. Note: disks attached inREAD_ONLY mode cannot be auto-deleted.",
            ).optional(),
        }),
      ).describe(
        "Disks created on the instances that will be preserved on instance delete, update, etc. This map is keyed with the device names of the disks.",
      ).optional(),
      externalIPs: z.record(
        z.string(),
        z.object({
          autoDelete: z.enum(["NEVER", "ON_PERMANENT_INSTANCE_DELETION"])
            .describe(
              "These stateful IPs will never be released during autohealing, update or VM instance recreate operations. This flag is used to configure if the IP reservation should be deleted after it is no longer used by the group, e.g. when the given instance or the whole group is deleted.",
            ).optional(),
        }),
      ).describe(
        "External network IPs assigned to the instances that will be preserved on instance delete, update, etc. This map is keyed with the network interface name.",
      ).optional(),
      internalIPs: z.record(
        z.string(),
        z.object({
          autoDelete: z.enum(["NEVER", "ON_PERMANENT_INSTANCE_DELETION"])
            .describe(
              "These stateful IPs will never be released during autohealing, update or VM instance recreate operations. This flag is used to configure if the IP reservation should be deleted after it is no longer used by the group, e.g. when the given instance or the whole group is deleted.",
            ).optional(),
        }),
      ).describe(
        "Internal network IPs assigned to the instances that will be preserved on instance delete, update, etc. This map is keyed with the network interface name.",
      ).optional(),
    }).describe("Configuration of preserved resources.").optional(),
  }).describe("Stateful configuration for this Instanced Group Manager")
    .optional(),
  targetPools: z.array(z.string()).describe(
    "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added. The target pools automatically apply to all of the instances in the managed instance group.",
  ).optional(),
  targetSize: z.number().int().describe(
    "The target number of running instances for this managed instance group. You can reduce this number by using the instanceGroupManager deleteInstances or abandonInstances methods. Resizing the group also changes this number.",
  ),
  targetSizePolicy: z.object({
    mode: z.enum(["BULK", "INDIVIDUAL", "UNSPECIFIED_MODE"]).describe(
      "The mode of target size policy based on which the MIG creates its VMs individually or all at once.",
    ).optional(),
  }).describe(
    "The policy that specifies how the MIG creates its VMs to achieve the target size.",
  ).optional(),
  targetStoppedSize: z.number().int().describe(
    "The target number of stopped instances for this managed instance group. This number changes when you: - Stop instance using the stopInstances method or start instances using the startInstances method. - Manually change the targetStoppedSize using the update method.",
  ).optional(),
  targetSuspendedSize: z.number().int().describe(
    "The target number of suspended instances for this managed instance group. This number changes when you: - Suspend instance using the suspendInstances method or resume instances using the resumeInstances method. - Manually change the targetSuspendedSize using the update method.",
  ).optional(),
  updatePolicy: z.object({
    instanceRedistributionType: z.enum(["NONE", "PROACTIVE"]).describe(
      "The instance redistribution policy for regional managed instance groups. Valid values are: - PROACTIVE (default): The group attempts to maintain an even distribution of VM instances across zones in the region. - NONE: For non-autoscaled groups, proactive redistribution is disabled.",
    ).optional(),
    maxSurge: z.object({
      calculated: z.number().int().describe(
        "Output only. Absolute value of VM instances calculated based on the specific mode. - If the value is fixed, then the calculated value is equal to the fixed value. - If the value is a percent, then the calculated value is percent/100 * targetSize. For example, the calculated value of a 80% of a managed instance group with 150 instances would be (80/100 * 150) = 120 VM instances. If there is a remainder, the number is rounded.",
      ).optional(),
      fixed: z.number().int().describe(
        "Specifies a fixed number of VM instances. This must be a positive integer.",
      ).optional(),
      percent: z.number().int().describe(
        "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
      ).optional(),
    }).describe(
      "The maximum number of instances that can be created above the specifiedtargetSize during the update process. This value can be either a fixed number or, if the group has 10 or more instances, a percentage. If you set a percentage, the number of instances is rounded if necessary. The default value for maxSurge is a fixed value equal to the number of zones in which the managed instance group operates. At least one of either maxSurge ormaxUnavailable must be greater than 0. Learn more about maxSurge.",
    ).optional(),
    maxUnavailable: z.object({
      calculated: z.number().int().describe(
        "Output only. Absolute value of VM instances calculated based on the specific mode. - If the value is fixed, then the calculated value is equal to the fixed value. - If the value is a percent, then the calculated value is percent/100 * targetSize. For example, the calculated value of a 80% of a managed instance group with 150 instances would be (80/100 * 150) = 120 VM instances. If there is a remainder, the number is rounded.",
      ).optional(),
      fixed: z.number().int().describe(
        "Specifies a fixed number of VM instances. This must be a positive integer.",
      ).optional(),
      percent: z.number().int().describe(
        "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
      ).optional(),
    }).describe(
      "The maximum number of instances that can be unavailable during the update process. An instance is considered available if all of the following conditions are satisfied: - The instance's status is RUNNING. - If there is a health check on the instance group, the instance's health check status must be HEALTHY at least once. If there is no health check on the group, then the instance only needs to have a status of RUNNING to be considered available. This value can be either a fixed number or, if the group has 10 or more instances, a percentage. If you set a percentage, the number of instances is rounded if necessary. The default value formaxUnavailable is a fixed value equal to the number of zones in which the managed instance group operates. At least one of either maxSurge ormaxUnavailable must be greater than 0. Learn more about maxUnavailable.",
    ).optional(),
    minimalAction: z.enum(["NONE", "REFRESH", "REPLACE", "RESTART"]).describe(
      "Minimal action to be taken on an instance. Use this option to minimize disruption as much as possible or to apply a more disruptive action than is necessary. - To limit disruption as much as possible, set the minimal action toREFRESH. If your update requires a more disruptive action, Compute Engine performs the necessary action to execute the update. - To apply a more disruptive action than is strictly necessary, set the minimal action to RESTART or REPLACE. For example, Compute Engine does not need to restart a VM to change its metadata. But if your application reads instance metadata only when a VM is restarted, you can set the minimal action to RESTART in order to pick up metadata changes.",
    ).optional(),
    mostDisruptiveAllowedAction: z.enum([
      "NONE",
      "REFRESH",
      "REPLACE",
      "RESTART",
    ]).describe(
      "Most disruptive action that is allowed to be taken on an instance. You can specify either NONE to forbid any actions,REFRESH to avoid restarting the VM and to limit disruption as much as possible. RESTART to allow actions that can be applied without instance replacing or REPLACE to allow all possible actions. If the Updater determines that the minimal update action needed is more disruptive than most disruptive allowed action you specify it will not perform the update at all.",
    ).optional(),
    replacementMethod: z.enum(["RECREATE", "SUBSTITUTE"]).describe(
      "What action should be used to replace instances. See minimal_action.REPLACE",
    ).optional(),
    type: z.enum(["OPPORTUNISTIC", "PROACTIVE"]).describe(
      "The type of update process. You can specify either PROACTIVE so that the MIG automatically updates VMs to the latest configurations orOPPORTUNISTIC so that you can select the VMs that you want to update.",
    ).optional(),
  }).describe("The update policy for this managed instance group.").optional(),
  versions: z.array(z.object({
    instanceTemplate: z.string().describe(
      "The URL of the instance template that is specified for this managed instance group. The group uses this template to create new instances in the managed instance group until the `targetSize` for this version is reached. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE; in those cases, existing instances are updated until the `targetSize` for this version is reached.",
    ).optional(),
    name: z.string().describe(
      "Name of the version. Unique among all versions in the scope of this managed instance group.",
    ).optional(),
    targetSize: z.object({
      calculated: z.number().int().describe(
        "Output only. Absolute value of VM instances calculated based on the specific mode. - If the value is fixed, then the calculated value is equal to the fixed value. - If the value is a percent, then the calculated value is percent/100 * targetSize. For example, the calculated value of a 80% of a managed instance group with 150 instances would be (80/100 * 150) = 120 VM instances. If there is a remainder, the number is rounded.",
      ).optional(),
      fixed: z.number().int().describe(
        "Specifies a fixed number of VM instances. This must be a positive integer.",
      ).optional(),
      percent: z.number().int().describe(
        "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
      ).optional(),
    }).describe(
      "Specifies the intended number of instances to be created from theinstanceTemplate. The final number of instances created from the template will be equal to: - If expressed as a fixed number, the minimum of either targetSize.fixed or instanceGroupManager.targetSize is used. - if expressed as a percent, the targetSize would be (targetSize.percent/100 * InstanceGroupManager.targetSize) If there is a remainder, the number is rounded. If unset, this version will update any remaining instances not updated by another version. ReadStarting a canary update for more information.",
    ).optional(),
  })).describe(
    "Specifies the instance templates used by this managed instance group to create instances. Each version is defined by an instanceTemplate and aname. Every version can appear at most once per instance group. This field overrides the top-level instanceTemplate field. Read more about therelationships between these fields. Exactly one version must leave thetargetSize field unset. That version will be applied to all remaining instances. For more information, read aboutcanary updates.",
  ).optional(),
  zone: z.string().describe(
    "Output only. The URL of azone where the managed instance group is located (for zonal resources).",
  ).optional(),
  requestId: z.string().describe(
    "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
  ).optional(),
});

const StateSchema = z.object({
  allInstancesConfig: z.object({
    properties: z.object({
      exposeHostTopology: z.boolean(),
      labels: z.record(z.string(), z.unknown()),
      metadata: z.record(z.string(), z.unknown()),
    }),
  }).optional(),
  autoHealingPolicies: z.array(z.object({
    healthCheck: z.string(),
    initialDelaySec: z.number(),
  })).optional(),
  baseInstanceName: z.string().optional(),
  creationTimestamp: z.string().optional(),
  currentActions: z.object({
    abandoning: z.number(),
    creating: z.number(),
    creatingWithoutRetries: z.number(),
    deleting: z.number(),
    none: z.number(),
    recreating: z.number(),
    refreshing: z.number(),
    restarting: z.number(),
    resuming: z.number(),
    starting: z.number(),
    stopping: z.number(),
    suspending: z.number(),
    verifying: z.number(),
  }).optional(),
  description: z.string().optional(),
  distributionPolicy: z.object({
    targetShape: z.string(),
    zones: z.array(z.object({
      zone: z.string(),
    })),
  }).optional(),
  fingerprint: z.string().optional(),
  id: z.string().optional(),
  instanceFlexibilityPolicy: z.object({
    instanceSelections: z.record(z.string(), z.unknown()),
  }).optional(),
  instanceGroup: z.string().optional(),
  instanceLifecyclePolicy: z.object({
    defaultActionOnFailure: z.string(),
    forceUpdateOnRepair: z.string(),
    onFailedHealthCheck: z.string(),
    onRepair: z.object({
      allowChangingZone: z.string(),
    }),
  }).optional(),
  instanceTemplate: z.string().optional(),
  kind: z.string().optional(),
  listManagedInstancesResults: z.string().optional(),
  name: z.string(),
  namedPorts: z.array(z.object({
    name: z.string(),
    port: z.number(),
  })).optional(),
  region: z.string().optional(),
  resourcePolicies: z.object({
    workloadPolicy: z.string(),
  }).optional(),
  satisfiesPzi: z.boolean().optional(),
  satisfiesPzs: z.boolean().optional(),
  selfLink: z.string().optional(),
  standbyPolicy: z.object({
    initialDelaySec: z.number(),
    mode: z.string(),
  }).optional(),
  statefulPolicy: z.object({
    preservedState: z.object({
      disks: z.record(z.string(), z.unknown()),
      externalIPs: z.record(z.string(), z.unknown()),
      internalIPs: z.record(z.string(), z.unknown()),
    }),
  }).optional(),
  status: z.object({
    allInstancesConfig: z.object({
      currentRevision: z.string(),
      effective: z.boolean(),
    }),
    appliedAcceleratorTopologies: z.array(z.object({
      acceleratorTopology: z.string(),
      state: z.string(),
      stateDetails: z.object({
        error: z.object({
          errors: z.unknown(),
        }),
        timestamp: z.string(),
      }),
    })),
    autoscaler: z.string(),
    bulkInstanceOperation: z.object({
      inProgress: z.boolean(),
      lastProgressCheck: z.object({
        error: z.object({
          errors: z.array(z.unknown()),
        }),
        timestamp: z.string(),
      }),
    }),
    currentInstanceStatuses: z.object({
      deprovisioning: z.number(),
      nonExistent: z.number(),
      pending: z.number(),
      pendingStop: z.number(),
      provisioning: z.number(),
      repairing: z.number(),
      running: z.number(),
      staging: z.number(),
      stopped: z.number(),
      stopping: z.number(),
      suspended: z.number(),
      suspending: z.number(),
      terminated: z.number(),
    }),
    isStable: z.boolean(),
    stateful: z.object({
      hasStatefulConfig: z.boolean(),
      perInstanceConfigs: z.object({
        allEffective: z.boolean(),
      }),
    }),
    versionTarget: z.object({
      isReached: z.boolean(),
    }),
  }).optional(),
  targetPools: z.array(z.string()).optional(),
  targetSize: z.number().optional(),
  targetSizePolicy: z.object({
    mode: z.string(),
  }).optional(),
  targetStoppedSize: z.number().optional(),
  targetSuspendedSize: z.number().optional(),
  updatePolicy: z.object({
    instanceRedistributionType: z.string(),
    maxSurge: z.object({
      calculated: z.number(),
      fixed: z.number(),
      percent: z.number(),
    }),
    maxUnavailable: z.object({
      calculated: z.number(),
      fixed: z.number(),
      percent: z.number(),
    }),
    minimalAction: z.string(),
    mostDisruptiveAllowedAction: z.string(),
    replacementMethod: z.string(),
    type: z.string(),
  }).optional(),
  versions: z.array(z.object({
    instanceTemplate: z.string(),
    name: z.string(),
    targetSize: z.object({
      calculated: z.number(),
      fixed: z.number(),
      percent: z.number(),
    }),
  })).optional(),
  zone: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  allInstancesConfig: z.object({
    properties: z.object({
      exposeHostTopology: z.boolean().describe(
        "This optional flag exposes the hashed physical host ID.",
      ).optional(),
      labels: z.record(z.string(), z.string()).describe(
        "The label key-value pairs that you want to patch onto the instance.",
      ).optional(),
      metadata: z.record(z.string(), z.string()).describe(
        "The metadata key-value pairs that you want to patch onto the instance. For more information, see Project and instance metadata.",
      ).optional(),
    }).describe(
      "Properties to set on all instances in the group. You can add or modify properties using theinstanceGroupManagers.patch orregionInstanceGroupManagers.patch. After settingallInstancesConfig on the group, you must update the group's instances to apply the configuration. To apply the configuration, set the group's updatePolicy.type field to use proactive updates or use the applyUpdatesToInstances method.",
    ).optional(),
  }).describe(
    "Specifies configuration that overrides the instance template configuration for the group.",
  ).optional(),
  autoHealingPolicies: z.array(z.object({
    healthCheck: z.string().describe(
      "The URL for the health check that signals autohealing.",
    ).optional(),
    initialDelaySec: z.number().int().describe(
      "The initial delay is the number of seconds that a new VM takes to initialize and run its startup script. During a VM's initial delay period, the MIG ignores unsuccessful health checks because the VM might be in the startup process. This prevents the MIG from prematurely recreating a VM. If the health check receives a healthy response during the initial delay, it indicates that the startup process is complete and the VM is ready. The value of initial delay must be between 0 and 3600 seconds. The default value is 0.",
    ).optional(),
  })).describe(
    "The autohealing policy for this managed instance group. You can specify only one value.",
  ).optional(),
  baseInstanceName: z.string().describe(
    'The base instance name is a prefix that you want to attach to the names of all VMs in a MIG. The maximum character length is 58 and the name must comply with RFC1035 format. When a VM is created in the group, the MIG appends a hyphen and a random four-character string to the base instance name. If you want the MIG to assign sequential numbers instead of a random string, then end the base instance name with a hyphen followed by one or more hash symbols. The hash symbols indicate the number of digits. For example, a base instance name of "vm-###" results in "vm-001" as a VM name. @pattern [a-z](([-a-z0-9]{0,57})|([-a-z0-9]{0,51}-#{1,10}(\\\\[[0-9]{1,10}\\\\])?))',
  ).optional(),
  description: z.string().describe("An optional description of this resource.")
    .optional(),
  distributionPolicy: z.object({
    targetShape: z.enum(["ANY", "ANY_SINGLE_ZONE", "BALANCED", "EVEN"])
      .describe(
        "The distribution shape to which the group converges either proactively or on resize events (depending on the value set inupdatePolicy.instanceRedistributionType).",
      ).optional(),
    zones: z.array(z.object({
      zone: z.string().describe(
        "The URL of thezone. The zone must exist in the region where the managed instance group is located.",
      ).optional(),
    })).describe(
      "Zones where the regional managed instance group will create and manage its instances. By default, a regional MIG doesn't automatically select an AI zone to create instances, even if an AI zone is available in the specified region. To create instances in an AI zone in the selected region, you must explicitly specify it in the distribution policy together with the other preferred zones.",
    ).optional(),
  }).describe(
    "Policy specifying the intended distribution of managed instances across zones in a regional managed instance group.",
  ).optional(),
  fingerprint: z.string().describe(
    "Fingerprint of this resource. This field may be used in optimistic locking. It will be ignored when inserting an InstanceGroupManager. An up-to-date fingerprint must be provided in order to update the InstanceGroupManager, otherwise the request will fail with error412 conditionNotMet. To see the latest fingerprint, make a get() request to retrieve an InstanceGroupManager.",
  ).optional(),
  instanceFlexibilityPolicy: z.object({
    instanceSelections: z.record(
      z.string(),
      z.object({
        disks: z.array(z.object({
          architecture: z.unknown().describe(
            "Output only. [Output Only] The architecture of the attached disk. Valid values are ARM64 or X86_64.",
          ).optional(),
          autoDelete: z.unknown().describe(
            "Specifies whether the disk will be auto-deleted when the instance is deleted (but not when the disk is detached from the instance).",
          ).optional(),
          boot: z.unknown().describe(
            "Indicates that this is a boot disk. The virtual machine will use the first partition of the disk for its root filesystem.",
          ).optional(),
          deviceName: z.unknown().describe(
            "Specifies a unique device name of your choice that is reflected into the/dev/disk/by-id/google-* tree of a Linux operating system running within the instance. This name can be used to reference the device for mounting, resizing, and so on, from within the instance. If not specified, the server chooses a default device name to apply to this disk, in the form persistent-disk-x, where x is a number assigned by Google Compute Engine. This field is only applicable for persistent disks.",
          ).optional(),
          diskEncryptionKey: z.unknown().describe(
            "Encrypts or decrypts a disk using acustomer-supplied encryption key. If you are creating a new disk, this field encrypts the new disk using an encryption key that you provide. If you are attaching an existing disk that is already encrypted, this field decrypts the disk using the customer-supplied encryption key. If you encrypt a disk using a customer-supplied key, you must provide the same key again when you attempt to use this resource at a later time. For example, you must provide the key when you create a snapshot or an image from the disk or when you attach the disk to a virtual machine instance. If you do not provide an encryption key, then the disk will be encrypted using an automatically generated key and you do not need to provide a key to use the disk later. Note: Instance templates do not storecustomer-supplied encryption keys, so you cannot use your own keys to encrypt disks in amanaged instance group. You cannot create VMs that have disks with customer-supplied keys using the bulk insert method.",
          ).optional(),
          diskSizeGb: z.unknown().describe("The size of the disk in GB.")
            .optional(),
          forceAttach: z.unknown().describe(
            "[Input Only] Whether to force attach the regional disk even if it's currently attached to another instance. If you try to force attach a zonal disk to an instance, you will receive an error.",
          ).optional(),
          guestOsFeatures: z.unknown().describe(
            "A list of features to enable on the guest operating system. Applicable only for bootable images. Read Enabling guest operating system features to see a list of available options.",
          ).optional(),
          index: z.unknown().describe(
            "Output only. [Output Only] A zero-based index to this disk, where 0 is reserved for the boot disk. If you have many disks attached to an instance, each disk would have a unique index number.",
          ).optional(),
          initializeParams: z.unknown().describe(
            "[Input Only] Specifies the parameters for a new disk that will be created alongside the new instance. Use initialization parameters to create boot disks or local SSDs attached to the new instance. This property is mutually exclusive with the source property; you can only define one or the other, but not both.",
          ).optional(),
          interface: z.unknown().describe(
            "Specifies the disk interface to use for attaching this disk, which is either SCSI or NVME. For most machine types, the default is SCSI. Local SSDs can use either NVME or SCSI. In certain configurations, persistent disks can use NVMe. For more information, seeAbout persistent disks.",
          ).optional(),
          kind: z.unknown().describe(
            "Output only. [Output Only] Type of the resource. Alwayscompute#attachedDisk for attached disks.",
          ).optional(),
          licenses: z.unknown().describe(
            "Output only. [Output Only] Any valid publicly visible licenses.",
          ).optional(),
          mode: z.unknown().describe(
            "The mode in which to attach this disk, either READ_WRITE orREAD_ONLY. If not specified, the default is to attach the disk in READ_WRITE mode.",
          ).optional(),
          savedState: z.unknown().describe(
            "Output only. For LocalSSD disks on VM Instances in STOPPED or SUSPENDED state, this field is set to PRESERVED if the LocalSSD data has been saved to a persistent location by customer request. (see the discard_local_ssd option on Stop/Suspend). Read-only in the api.",
          ).optional(),
          shieldedInstanceInitialState: z.unknown().describe(
            "Output only. [Output Only] shielded vm initial state stored on disk",
          ).optional(),
          source: z.unknown().describe(
            "Specifies a valid partial or full URL to an existing Persistent Disk resource. When creating a new instance boot disk, one ofinitializeParams.sourceImage orinitializeParams.sourceSnapshot or disks.source is required. If desired, you can also attach existing non-root persistent disks using this property. This field is only applicable for persistent disks. Note that for InstanceTemplate, specify the disk name for zonal disk, and the URL for regional disk.",
          ).optional(),
          type: z.unknown().describe(
            "Specifies the type of the disk, either SCRATCH orPERSISTENT. If not specified, the default isPERSISTENT.",
          ).optional(),
        })).describe(
          "List of disks to be attached to the instances created from this selection.",
        ).optional(),
        machineTypes: z.array(z.string()).describe(
          'Full machine-type names, e.g. "n1-standard-16".',
        ).optional(),
        minCpuPlatform: z.string().describe(
          "Name of the minimum CPU platform to be used by this instance selection. e.g. 'Intel Ice Lake'.",
        ).optional(),
        rank: z.number().int().describe(
          "Preference of this instance selection. Lower number means higher preference. MIG will first try to create a VM based on the machine-type with lowest rank and fallback to next rank based on availability. Machine types and instance selections with the same rank have the same preference.",
        ).optional(),
      }),
    ).describe(
      "Named instance selections configuring properties that the group will use when creating new VMs.",
    ).optional(),
  }).describe(
    "Instance flexibility allowing MIG to create VMs from multiple types of machines. Instance flexibility configuration on MIG overrides instance template configuration.",
  ).optional(),
  instanceLifecyclePolicy: z.object({
    defaultActionOnFailure: z.enum(["DO_NOTHING", "REPAIR"]).describe(
      "The action that a MIG performs on a failed VM. If the value of the onFailedHealthCheck field is `DEFAULT_ACTION`, then the same action also applies to the VMs on which your application fails a health check. Valid values are - REPAIR (default): MIG automatically repairs a failed VM by recreating it. For more information, see About repairing VMs in a MIG. - DO_NOTHING: MIG does not repair a failed VM.",
    ).optional(),
    forceUpdateOnRepair: z.enum(["NO", "YES"]).describe(
      "A bit indicating whether to forcefully apply the group's latest configuration when repairing a VM. Valid options are: - NO (default): If configuration updates are available, they are not forcefully applied during repair. Instead, configuration updates are applied according to the group's update policy. - YES: If configuration updates are available, they are applied during repair.",
    ).optional(),
    onFailedHealthCheck: z.enum(["DEFAULT_ACTION", "DO_NOTHING", "REPAIR"])
      .describe(
        "The action that a MIG performs on an unhealthy VM. A VM is marked as unhealthy when the application running on that VM fails a health check. Valid values are: - DEFAULT_ACTION (default): MIG uses the same action configured for instanceLifecyclePolicy.defaultActionOnFailure field. - REPAIR: MIG automatically repairs an unhealthy VM by recreating it. - DO_NOTHING: MIG doesn't repair an unhealthy VM. For more information, see About repairing VMs in a MIG.",
      ).optional(),
    onRepair: z.object({
      allowChangingZone: z.enum(["NO", "YES"]).describe(
        "Specifies whether the MIG can change a VM's zone during a repair. Valid values are: - NO (default): MIG cannot change a VM's zone during a repair. - YES: MIG can select a different zone for the VM during a repair.",
      ).optional(),
    }).describe("Configuration for VM repairs in the MIG.").optional(),
  }).describe("The repair policy for this managed instance group.").optional(),
  instanceTemplate: z.string().describe(
    "The URL of the instance template that is specified for this managed instance group. The group uses this template to create all new instances in the managed instance group. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE.",
  ).optional(),
  listManagedInstancesResults: z.enum(["PAGELESS", "PAGINATED"]).describe(
    "Pagination behavior of the listManagedInstances API method for this managed instance group.",
  ).optional(),
  name: z.string().regex(new RegExp("[a-z](?:[-a-z0-9]{0,61}[a-z0-9])?"))
    .describe(
      "The name of the managed instance group. The name must be 1-63 characters long, and comply withRFC1035.",
    ).optional(),
  resourcePolicies: z.object({
    workloadPolicy: z.string().describe(
      "The URL of the workload policy that is specified for this managed instance group. It can be a full or partial URL. For example, the following are all valid URLs to a workload policy: - https://www.googleapis.com/compute/v1/projects/project/regions/region/resourcePolicies/resourcePolicy - projects/project/regions/region/resourcePolicies/resourcePolicy - regions/region/resourcePolicies/resourcePolicy",
    ).optional(),
  }).describe("Resource policies for this managed instance group.").optional(),
  standbyPolicy: z.object({
    initialDelaySec: z.number().int().describe(
      "Specifies the number of seconds that the MIG should wait to suspend or stop a VM after that VM was created. The initial delay gives the initialization script the time to prepare your VM for a quick scale out. The value of initial delay must be between 0 and 3600 seconds. The default value is 0.",
    ).optional(),
    mode: z.enum(["MANUAL", "SCALE_OUT_POOL"]).describe(
      "Defines how a MIG resumes or starts VMs from a standby pool when the group scales out. The default mode is `MANUAL`.",
    ).optional(),
  }).describe("Standby policy for stopped and suspended instances.").optional(),
  statefulPolicy: z.object({
    preservedState: z.object({
      disks: z.record(
        z.string(),
        z.object({
          autoDelete: z.enum(["NEVER", "ON_PERMANENT_INSTANCE_DELETION"])
            .describe(
              "These stateful disks will never be deleted during autohealing, update or VM instance recreate operations. This flag is used to configure if the disk should be deleted after it is no longer used by the group, e.g. when the given instance or the whole group is deleted. Note: disks attached inREAD_ONLY mode cannot be auto-deleted.",
            ).optional(),
        }),
      ).describe(
        "Disks created on the instances that will be preserved on instance delete, update, etc. This map is keyed with the device names of the disks.",
      ).optional(),
      externalIPs: z.record(
        z.string(),
        z.object({
          autoDelete: z.enum(["NEVER", "ON_PERMANENT_INSTANCE_DELETION"])
            .describe(
              "These stateful IPs will never be released during autohealing, update or VM instance recreate operations. This flag is used to configure if the IP reservation should be deleted after it is no longer used by the group, e.g. when the given instance or the whole group is deleted.",
            ).optional(),
        }),
      ).describe(
        "External network IPs assigned to the instances that will be preserved on instance delete, update, etc. This map is keyed with the network interface name.",
      ).optional(),
      internalIPs: z.record(
        z.string(),
        z.object({
          autoDelete: z.enum(["NEVER", "ON_PERMANENT_INSTANCE_DELETION"])
            .describe(
              "These stateful IPs will never be released during autohealing, update or VM instance recreate operations. This flag is used to configure if the IP reservation should be deleted after it is no longer used by the group, e.g. when the given instance or the whole group is deleted.",
            ).optional(),
        }),
      ).describe(
        "Internal network IPs assigned to the instances that will be preserved on instance delete, update, etc. This map is keyed with the network interface name.",
      ).optional(),
    }).describe("Configuration of preserved resources.").optional(),
  }).describe("Stateful configuration for this Instanced Group Manager")
    .optional(),
  targetPools: z.array(z.string()).describe(
    "The URLs for all TargetPool resources to which instances in theinstanceGroup field are added. The target pools automatically apply to all of the instances in the managed instance group.",
  ).optional(),
  targetSize: z.number().int().describe(
    "The target number of running instances for this managed instance group. You can reduce this number by using the instanceGroupManager deleteInstances or abandonInstances methods. Resizing the group also changes this number.",
  ).optional(),
  targetSizePolicy: z.object({
    mode: z.enum(["BULK", "INDIVIDUAL", "UNSPECIFIED_MODE"]).describe(
      "The mode of target size policy based on which the MIG creates its VMs individually or all at once.",
    ).optional(),
  }).describe(
    "The policy that specifies how the MIG creates its VMs to achieve the target size.",
  ).optional(),
  targetStoppedSize: z.number().int().describe(
    "The target number of stopped instances for this managed instance group. This number changes when you: - Stop instance using the stopInstances method or start instances using the startInstances method. - Manually change the targetStoppedSize using the update method.",
  ).optional(),
  targetSuspendedSize: z.number().int().describe(
    "The target number of suspended instances for this managed instance group. This number changes when you: - Suspend instance using the suspendInstances method or resume instances using the resumeInstances method. - Manually change the targetSuspendedSize using the update method.",
  ).optional(),
  updatePolicy: z.object({
    instanceRedistributionType: z.enum(["NONE", "PROACTIVE"]).describe(
      "The instance redistribution policy for regional managed instance groups. Valid values are: - PROACTIVE (default): The group attempts to maintain an even distribution of VM instances across zones in the region. - NONE: For non-autoscaled groups, proactive redistribution is disabled.",
    ).optional(),
    maxSurge: z.object({
      calculated: z.number().int().describe(
        "Output only. Absolute value of VM instances calculated based on the specific mode. - If the value is fixed, then the calculated value is equal to the fixed value. - If the value is a percent, then the calculated value is percent/100 * targetSize. For example, the calculated value of a 80% of a managed instance group with 150 instances would be (80/100 * 150) = 120 VM instances. If there is a remainder, the number is rounded.",
      ).optional(),
      fixed: z.number().int().describe(
        "Specifies a fixed number of VM instances. This must be a positive integer.",
      ).optional(),
      percent: z.number().int().describe(
        "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
      ).optional(),
    }).describe(
      "The maximum number of instances that can be created above the specifiedtargetSize during the update process. This value can be either a fixed number or, if the group has 10 or more instances, a percentage. If you set a percentage, the number of instances is rounded if necessary. The default value for maxSurge is a fixed value equal to the number of zones in which the managed instance group operates. At least one of either maxSurge ormaxUnavailable must be greater than 0. Learn more about maxSurge.",
    ).optional(),
    maxUnavailable: z.object({
      calculated: z.number().int().describe(
        "Output only. Absolute value of VM instances calculated based on the specific mode. - If the value is fixed, then the calculated value is equal to the fixed value. - If the value is a percent, then the calculated value is percent/100 * targetSize. For example, the calculated value of a 80% of a managed instance group with 150 instances would be (80/100 * 150) = 120 VM instances. If there is a remainder, the number is rounded.",
      ).optional(),
      fixed: z.number().int().describe(
        "Specifies a fixed number of VM instances. This must be a positive integer.",
      ).optional(),
      percent: z.number().int().describe(
        "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
      ).optional(),
    }).describe(
      "The maximum number of instances that can be unavailable during the update process. An instance is considered available if all of the following conditions are satisfied: - The instance's status is RUNNING. - If there is a health check on the instance group, the instance's health check status must be HEALTHY at least once. If there is no health check on the group, then the instance only needs to have a status of RUNNING to be considered available. This value can be either a fixed number or, if the group has 10 or more instances, a percentage. If you set a percentage, the number of instances is rounded if necessary. The default value formaxUnavailable is a fixed value equal to the number of zones in which the managed instance group operates. At least one of either maxSurge ormaxUnavailable must be greater than 0. Learn more about maxUnavailable.",
    ).optional(),
    minimalAction: z.enum(["NONE", "REFRESH", "REPLACE", "RESTART"]).describe(
      "Minimal action to be taken on an instance. Use this option to minimize disruption as much as possible or to apply a more disruptive action than is necessary. - To limit disruption as much as possible, set the minimal action toREFRESH. If your update requires a more disruptive action, Compute Engine performs the necessary action to execute the update. - To apply a more disruptive action than is strictly necessary, set the minimal action to RESTART or REPLACE. For example, Compute Engine does not need to restart a VM to change its metadata. But if your application reads instance metadata only when a VM is restarted, you can set the minimal action to RESTART in order to pick up metadata changes.",
    ).optional(),
    mostDisruptiveAllowedAction: z.enum([
      "NONE",
      "REFRESH",
      "REPLACE",
      "RESTART",
    ]).describe(
      "Most disruptive action that is allowed to be taken on an instance. You can specify either NONE to forbid any actions,REFRESH to avoid restarting the VM and to limit disruption as much as possible. RESTART to allow actions that can be applied without instance replacing or REPLACE to allow all possible actions. If the Updater determines that the minimal update action needed is more disruptive than most disruptive allowed action you specify it will not perform the update at all.",
    ).optional(),
    replacementMethod: z.enum(["RECREATE", "SUBSTITUTE"]).describe(
      "What action should be used to replace instances. See minimal_action.REPLACE",
    ).optional(),
    type: z.enum(["OPPORTUNISTIC", "PROACTIVE"]).describe(
      "The type of update process. You can specify either PROACTIVE so that the MIG automatically updates VMs to the latest configurations orOPPORTUNISTIC so that you can select the VMs that you want to update.",
    ).optional(),
  }).describe("The update policy for this managed instance group.").optional(),
  versions: z.array(z.object({
    instanceTemplate: z.string().describe(
      "The URL of the instance template that is specified for this managed instance group. The group uses this template to create new instances in the managed instance group until the `targetSize` for this version is reached. The templates for existing instances in the group do not change unless you run recreateInstances, runapplyUpdatesToInstances, or set the group'supdatePolicy.type to PROACTIVE; in those cases, existing instances are updated until the `targetSize` for this version is reached.",
    ).optional(),
    name: z.string().describe(
      "Name of the version. Unique among all versions in the scope of this managed instance group.",
    ).optional(),
    targetSize: z.object({
      calculated: z.number().int().describe(
        "Output only. Absolute value of VM instances calculated based on the specific mode. - If the value is fixed, then the calculated value is equal to the fixed value. - If the value is a percent, then the calculated value is percent/100 * targetSize. For example, the calculated value of a 80% of a managed instance group with 150 instances would be (80/100 * 150) = 120 VM instances. If there is a remainder, the number is rounded.",
      ).optional(),
      fixed: z.number().int().describe(
        "Specifies a fixed number of VM instances. This must be a positive integer.",
      ).optional(),
      percent: z.number().int().describe(
        "Specifies a percentage of instances between 0 to 100%, inclusive. For example, specify 80 for 80%.",
      ).optional(),
    }).describe(
      "Specifies the intended number of instances to be created from theinstanceTemplate. The final number of instances created from the template will be equal to: - If expressed as a fixed number, the minimum of either targetSize.fixed or instanceGroupManager.targetSize is used. - if expressed as a percent, the targetSize would be (targetSize.percent/100 * InstanceGroupManager.targetSize) If there is a remainder, the number is rounded. If unset, this version will update any remaining instances not updated by another version. ReadStarting a canary update for more information.",
    ).optional(),
  })).describe(
    "Specifies the instance templates used by this managed instance group to create instances. Each version is defined by an instanceTemplate and aname. Every version can appear at most once per instance group. This field overrides the top-level instanceTemplate field. Read more about therelationships between these fields. Exactly one version must leave thetargetSize field unset. That version will be applied to all remaining instances. For more information, read aboutcanary updates.",
  ).optional(),
  zone: z.string().describe(
    "Output only. The URL of azone where the managed instance group is located (for zonal resources).",
  ).optional(),
  requestId: z.string().describe(
    "An optional request ID to identify requests. Specify a unique request ID so that if you must retry your request, the server will know to ignore the request if it has already been completed. For example, consider a situation where you make an initial request and the request times out. If you make the request again with the same request ID, the server can check if original operation with the same request ID was received, and if so, will ignore the second request. This prevents clients from accidentally creating duplicate commitments. The request ID must be a valid UUID with the exception that zero UUID is not supported (00000000-0000-0000-0000-000000000000).",
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

/** Swamp extension model for Google Cloud Compute Engine InstanceGroupManagers. Registered at `@swamp/gcp/compute/instancegroupmanagers`. */
export const model = {
  type: "@swamp/gcp/compute/instancegroupmanagers",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.03.31.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
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
      toVersion: "2026.04.04.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.04.1",
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
      toVersion: "2026.06.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.04.1",
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
      description: "Removed: currentActions, status",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { currentActions: _currentActions, status: _status, ...rest } =
          old;
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
      toVersion: "2026.09.06.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.09.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "Represents a Managed Instance Group resource. An instance group is a collecti...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a instanceGroupManagers",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
        const body: Record<string, unknown> = {};
        if (g["allInstancesConfig"] !== undefined) {
          body["allInstancesConfig"] = g["allInstancesConfig"];
        }
        if (g["autoHealingPolicies"] !== undefined) {
          body["autoHealingPolicies"] = g["autoHealingPolicies"];
        }
        if (g["baseInstanceName"] !== undefined) {
          body["baseInstanceName"] = g["baseInstanceName"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["distributionPolicy"] !== undefined) {
          body["distributionPolicy"] = g["distributionPolicy"];
        }
        if (g["fingerprint"] !== undefined) {
          body["fingerprint"] = g["fingerprint"];
        }
        if (g["instanceFlexibilityPolicy"] !== undefined) {
          body["instanceFlexibilityPolicy"] = g["instanceFlexibilityPolicy"];
        }
        if (g["instanceLifecyclePolicy"] !== undefined) {
          body["instanceLifecyclePolicy"] = g["instanceLifecyclePolicy"];
        }
        if (g["instanceTemplate"] !== undefined) {
          body["instanceTemplate"] = g["instanceTemplate"];
        }
        if (g["listManagedInstancesResults"] !== undefined) {
          body["listManagedInstancesResults"] =
            g["listManagedInstancesResults"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["resourcePolicies"] !== undefined) {
          body["resourcePolicies"] = g["resourcePolicies"];
        }
        if (g["standbyPolicy"] !== undefined) {
          body["standbyPolicy"] = g["standbyPolicy"];
        }
        if (g["statefulPolicy"] !== undefined) {
          body["statefulPolicy"] = g["statefulPolicy"];
        }
        if (g["targetPools"] !== undefined) {
          body["targetPools"] = g["targetPools"];
        }
        if (g["targetSize"] !== undefined) body["targetSize"] = g["targetSize"];
        if (g["targetSizePolicy"] !== undefined) {
          body["targetSizePolicy"] = g["targetSizePolicy"];
        }
        if (g["targetStoppedSize"] !== undefined) {
          body["targetStoppedSize"] = g["targetStoppedSize"];
        }
        if (g["targetSuspendedSize"] !== undefined) {
          body["targetSuspendedSize"] = g["targetSuspendedSize"];
        }
        if (g["updatePolicy"] !== undefined) {
          body["updatePolicy"] = g["updatePolicy"];
        }
        if (g["versions"] !== undefined) body["versions"] = g["versions"];
        if (g["requestId"] !== undefined) {
          params["requestId"] = String(g["requestId"]);
        }
        if (g["name"] !== undefined) {
          params["instanceGroupManager"] = String(g["name"]);
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
              "project": projectId,
              "zone": String(g["zone"] ?? ""),
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
      description: "Get a instanceGroupManagers",
      arguments: z.object({
        identifier: z.string().describe(
          "The name of the instanceGroupManagers",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
        params["instanceGroupManager"] = args.identifier;
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
      description: "Update instanceGroupManagers attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific instanceGroupManagers by name (e.g. one discovered by list)",
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
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
        else if (existing["zone"]) params["zone"] = String(existing["zone"]);
        params["instanceGroupManager"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["allInstancesConfig"] !== undefined) {
          body["allInstancesConfig"] = g["allInstancesConfig"];
        }
        if (g["autoHealingPolicies"] !== undefined) {
          body["autoHealingPolicies"] = g["autoHealingPolicies"];
        }
        if (g["baseInstanceName"] !== undefined) {
          body["baseInstanceName"] = g["baseInstanceName"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["distributionPolicy"] !== undefined) {
          body["distributionPolicy"] = g["distributionPolicy"];
        }
        if (g["fingerprint"] !== undefined) {
          body["fingerprint"] = g["fingerprint"];
        }
        if (g["instanceFlexibilityPolicy"] !== undefined) {
          body["instanceFlexibilityPolicy"] = g["instanceFlexibilityPolicy"];
        }
        if (g["instanceLifecyclePolicy"] !== undefined) {
          body["instanceLifecyclePolicy"] = g["instanceLifecyclePolicy"];
        }
        if (g["instanceTemplate"] !== undefined) {
          body["instanceTemplate"] = g["instanceTemplate"];
        }
        if (g["listManagedInstancesResults"] !== undefined) {
          body["listManagedInstancesResults"] =
            g["listManagedInstancesResults"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["resourcePolicies"] !== undefined) {
          body["resourcePolicies"] = g["resourcePolicies"];
        }
        if (g["standbyPolicy"] !== undefined) {
          body["standbyPolicy"] = g["standbyPolicy"];
        }
        if (g["statefulPolicy"] !== undefined) {
          body["statefulPolicy"] = g["statefulPolicy"];
        }
        if (g["targetPools"] !== undefined) {
          body["targetPools"] = g["targetPools"];
        }
        if (g["targetSize"] !== undefined) body["targetSize"] = g["targetSize"];
        if (g["targetSizePolicy"] !== undefined) {
          body["targetSizePolicy"] = g["targetSizePolicy"];
        }
        if (g["targetStoppedSize"] !== undefined) {
          body["targetStoppedSize"] = g["targetStoppedSize"];
        }
        if (g["targetSuspendedSize"] !== undefined) {
          body["targetSuspendedSize"] = g["targetSuspendedSize"];
        }
        if (g["updatePolicy"] !== undefined) {
          body["updatePolicy"] = g["updatePolicy"];
        }
        if (g["versions"] !== undefined) body["versions"] = g["versions"];
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
      description: "Delete the instanceGroupManagers",
      arguments: z.object({
        identifier: z.string().describe(
          "The name of the instanceGroupManagers",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
        params["instanceGroupManager"] = args.identifier;
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
      description: "Sync instanceGroupManagers state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific instanceGroupManagers by name (e.g. one discovered by list)",
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
          if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
          else if (existing["zone"]) params["zone"] = String(existing["zone"]);
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["instanceGroupManager"] = identifier;
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
      description: "List instanceGroupManagers resources",
      arguments: z.object({
        filter: z.string().describe(
          "A filter expression that filters resources listed in the response. Most",
        ).optional(),
        maxResults: z.number().describe(
          "The maximum number of results per page that should be returned.",
        ).optional(),
        orderBy: z.string().describe(
          "Sorts list results by a certain order. By default, results",
        ).optional(),
        returnPartialSuccess: z.boolean().describe(
          "Opt-in for partial success behavior which provides partial results in case",
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
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["returnPartialSuccess"] !== undefined) {
          params["returnPartialSuccess"] = String(args["returnPartialSuccess"]);
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
    abandon_instances: {
      description: "abandon instances",
      arguments: z.object({
        instances: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.abandonInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/abandonInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    apply_updates_to_instances: {
      description: "apply updates to instances",
      arguments: z.object({
        allInstances: z.any().optional(),
        instances: z.any().optional(),
        minimalAction: z.any().optional(),
        mostDisruptiveAllowedAction: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["allInstances"] !== undefined) {
          body["allInstances"] = args["allInstances"];
        }
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        if (args["minimalAction"] !== undefined) {
          body["minimalAction"] = args["minimalAction"];
        }
        if (args["mostDisruptiveAllowedAction"] !== undefined) {
          body["mostDisruptiveAllowedAction"] =
            args["mostDisruptiveAllowedAction"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.applyUpdatesToInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/applyUpdatesToInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "zone": { "location": "path", "required": true },
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
    create_instances: {
      description: "create instances",
      arguments: z.object({
        instances: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.createInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/createInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    list_errors: {
      description: "list errors",
      arguments: z.object({
        filter: z.any().optional(),
        maxResults: z.any().optional(),
        orderBy: z.any().optional(),
        pageToken: z.any().optional(),
        returnPartialSuccess: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
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
        if (args["returnPartialSuccess"] !== undefined) {
          params["returnPartialSuccess"] = String(args["returnPartialSuccess"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.listErrors",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/listErrors",
            "httpMethod": "GET",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "filter": { "location": "query" },
              "instanceGroupManager": { "location": "path", "required": true },
              "maxResults": { "location": "query" },
              "orderBy": { "location": "query" },
              "pageToken": { "location": "query" },
              "project": { "location": "path", "required": true },
              "returnPartialSuccess": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    list_managed_instances: {
      description: "list managed instances",
      arguments: z.object({
        filter: z.any().optional(),
        maxResults: z.any().optional(),
        orderBy: z.any().optional(),
        pageToken: z.any().optional(),
        returnPartialSuccess: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
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
        if (args["returnPartialSuccess"] !== undefined) {
          params["returnPartialSuccess"] = String(args["returnPartialSuccess"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.listManagedInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/listManagedInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "filter": { "location": "query" },
              "instanceGroupManager": { "location": "path", "required": true },
              "maxResults": { "location": "query" },
              "orderBy": { "location": "query" },
              "pageToken": { "location": "query" },
              "project": { "location": "path", "required": true },
              "returnPartialSuccess": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    list_per_instance_configs: {
      description: "list per instance configs",
      arguments: z.object({
        filter: z.any().optional(),
        maxResults: z.any().optional(),
        orderBy: z.any().optional(),
        pageToken: z.any().optional(),
        returnPartialSuccess: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
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
        if (args["returnPartialSuccess"] !== undefined) {
          params["returnPartialSuccess"] = String(args["returnPartialSuccess"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.listPerInstanceConfigs",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/listPerInstanceConfigs",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "filter": { "location": "query" },
              "instanceGroupManager": { "location": "path", "required": true },
              "maxResults": { "location": "query" },
              "orderBy": { "location": "query" },
              "pageToken": { "location": "query" },
              "project": { "location": "path", "required": true },
              "returnPartialSuccess": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    patch_per_instance_configs: {
      description: "patch per instance configs",
      arguments: z.object({
        perInstanceConfigs: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["perInstanceConfigs"] !== undefined) {
          body["perInstanceConfigs"] = args["perInstanceConfigs"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.patchPerInstanceConfigs",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/patchPerInstanceConfigs",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    recreate_instances: {
      description: "recreate instances",
      arguments: z.object({
        instances: z.any().optional(),
        noGracefulShutdown: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["noGracefulShutdown"] !== undefined) {
          params["noGracefulShutdown"] = String(args["noGracefulShutdown"]);
        }
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.recreateInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/recreateInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "noGracefulShutdown": { "location": "query" },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    resize: {
      description: "resize",
      arguments: z.object({
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] =
          existing["instanceGroupManager"]?.toString() ??
            g["instanceGroupManager"]?.toString() ?? "";
        params["size"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.resize",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/resize",
            "httpMethod": "POST",
            "parameterOrder": [
              "project",
              "zone",
              "instanceGroupManager",
              "size",
            ],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "size": { "location": "query", "required": true },
              "zone": { "location": "path", "required": true },
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
    resume_instances: {
      description: "resume instances",
      arguments: z.object({
        instances: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.resumeInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/resumeInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    set_instance_template: {
      description: "set instance template",
      arguments: z.object({
        instanceTemplate: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["instanceTemplate"] !== undefined) {
          body["instanceTemplate"] = args["instanceTemplate"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.setInstanceTemplate",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/setInstanceTemplate",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    set_target_pools: {
      description: "set target pools",
      arguments: z.object({
        fingerprint: z.any().optional(),
        targetPools: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["fingerprint"] !== undefined) {
          body["fingerprint"] = args["fingerprint"];
        }
        if (args["targetPools"] !== undefined) {
          body["targetPools"] = args["targetPools"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.setTargetPools",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/setTargetPools",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    start_instances: {
      description: "start instances",
      arguments: z.object({
        instances: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.startInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/startInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    stop_instances: {
      description: "stop instances",
      arguments: z.object({
        forceStop: z.any().optional(),
        instances: z.any().optional(),
        noGracefulShutdown: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["noGracefulShutdown"] !== undefined) {
          params["noGracefulShutdown"] = String(args["noGracefulShutdown"]);
        }
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["forceStop"] !== undefined) {
          body["forceStop"] = args["forceStop"];
        }
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.stopInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/stopInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "noGracefulShutdown": { "location": "query" },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    suspend_instances: {
      description: "suspend instances",
      arguments: z.object({
        forceSuspend: z.any().optional(),
        instances: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["forceSuspend"] !== undefined) {
          body["forceSuspend"] = args["forceSuspend"];
        }
        if (args["instances"] !== undefined) {
          body["instances"] = args["instances"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.suspendInstances",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/suspendInstances",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
    update_per_instance_configs: {
      description: "update per instance configs",
      arguments: z.object({
        perInstanceConfigs: z.any().optional(),
        requestId: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["zone"] !== undefined) params["zone"] = String(g["zone"]);
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
        params["instanceGroupManager"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["requestId"] !== undefined) {
          params["requestId"] = String(args["requestId"]);
        }
        const body: Record<string, unknown> = {};
        if (args["perInstanceConfigs"] !== undefined) {
          body["perInstanceConfigs"] = args["perInstanceConfigs"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "compute.instanceGroupManagers.updatePerInstanceConfigs",
            "path":
              "projects/{project}/zones/{zone}/instanceGroupManagers/{instanceGroupManager}/updatePerInstanceConfigs",
            "httpMethod": "POST",
            "parameterOrder": ["project", "zone", "instanceGroupManager"],
            "parameters": {
              "instanceGroupManager": { "location": "path", "required": true },
              "project": { "location": "path", "required": true },
              "requestId": { "location": "query" },
              "zone": { "location": "path", "required": true },
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
