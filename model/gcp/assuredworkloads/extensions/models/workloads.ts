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

// Auto-generated extension model for @swamp/gcp/assuredworkloads/workloads
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Assured Workloads Workloads.
 *
 * A Workload object for managing highly regulated workloads of cloud customers.
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
  return `${parent}/workloads/${shortName}`;
}

const BASE_URL = "https://assuredworkloads.googleapis.com/";

const GET_CONFIG = {
  "id": "assuredworkloads.organizations.locations.workloads.get",
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
  "id": "assuredworkloads.organizations.locations.workloads.create",
  "path": "v1/{+parent}/workloads",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "externalId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "assuredworkloads.organizations.locations.workloads.patch",
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
  },
} as const;

const DELETE_CONFIG = {
  "id": "assuredworkloads.organizations.locations.workloads.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "etag": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "assuredworkloads.organizations.locations.workloads.list",
  "path": "v1/{+parent}/workloads",
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
  billingAccount: z.string().describe(
    "Optional. The billing account used for the resources which are direct children of workload. This billing account is initially associated with the resources created as part of Workload creation. After the initial creation of these resources, the customer can change the assigned billing account. The resource name has the form `billingAccounts/{billing_account_id}`. For example, `billingAccounts/012345-567890-ABCDEF`.",
  ).optional(),
  complianceRegime: z.enum([
    "COMPLIANCE_REGIME_UNSPECIFIED",
    "ASSURED_WORKLOADS_FOR_PARTNERS",
    "AUSTRALIA_DATA_BOUNDARY_AND_SUPPORT",
    "CANADA_DATA_BOUNDARY_AND_SUPPORT",
    "DATA_BOUNDARY_FOR_CANADA_CONTROLLED_GOODS",
    "DATA_BOUNDARY_FOR_CANADA_PROTECTED_B",
    "DATA_BOUNDARY_FOR_CJIS",
    "DATA_BOUNDARY_FOR_FEDRAMP_HIGH",
    "DATA_BOUNDARY_FOR_FEDRAMP_MODERATE",
    "DATA_BOUNDARY_FOR_IL2",
    "DATA_BOUNDARY_FOR_IL4",
    "DATA_BOUNDARY_FOR_IL5",
    "DATA_BOUNDARY_FOR_IRS_PUBLICATION_1075",
    "DATA_BOUNDARY_FOR_ITAR",
    "EU_DATA_BOUNDARY_AND_SUPPORT",
    "ISRAEL_DATA_BOUNDARY_AND_SUPPORT",
    "JAPAN_DATA_BOUNDARY",
    "SWITZERLAND_DATA_BOUNDARY_WITH_ACCESS_JUSTIFICATIONS",
    "KSA_DATA_BOUNDARY_WITH_ACCESS_JUSTIFICATIONS",
    "REGIONAL_DATA_BOUNDARY",
    "US_DATA_BOUNDARY_AND_SUPPORT",
    "US_DATA_BOUNDARY_FOR_HEALTHCARE_AND_LIFE_SCIENCES",
    "US_DATA_BOUNDARY_FOR_HEALTHCARE_AND_LIFE_SCIENCES_WITH_SUPPORT",
    "AU_REGIONS_AND_US_SUPPORT",
    "CA_PROTECTED_B",
    "CA_REGIONS_AND_SUPPORT",
    "CANADA_CONTROLLED_GOODS",
    "CJIS",
    "EU_REGIONS_AND_SUPPORT",
    "FEDRAMP_HIGH",
    "FEDRAMP_MODERATE",
    "HEALTHCARE_AND_LIFE_SCIENCES_CONTROLS",
    "HEALTHCARE_AND_LIFE_SCIENCES_CONTROLS_US_SUPPORT",
    "HIPAA",
    "HITRUST",
    "IL2",
    "IL4",
    "IL5",
    "IRS_1075",
    "ISR_REGIONS",
    "ISR_REGIONS_AND_SUPPORT",
    "ITAR",
    "JP_REGIONS_AND_SUPPORT",
    "KSA_REGIONS_AND_SUPPORT_WITH_SOVEREIGNTY_CONTROLS",
    "REGIONAL_CONTROLS",
    "US_REGIONAL_ACCESS",
  ]).describe(
    "Required. Immutable. Compliance Regime associated with this workload.",
  ).optional(),
  displayName: z.string().describe(
    "Required. The user-assigned display name of the Workload. When present it must be between 4 to 30 characters. Allowed characters are: lowercase and uppercase letters, numbers, hyphen, and spaces. Example: My Workload",
  ).optional(),
  enableSovereignControls: z.boolean().describe(
    "Optional. Indicates the sovereignty status of the given workload. Currently meant to be used by Europe/Canada customers.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Labels applied to the workload.",
  ).optional(),
  name: z.string().describe(
    "Optional. The resource name of the workload. Format: organizations/{organization}/locations/{location}/workloads/{workload} Read-only.",
  ).optional(),
  partner: z.enum([
    "PARTNER_UNSPECIFIED",
    "LOCAL_CONTROLS_BY_S3NS",
    "SOVEREIGN_CONTROLS_BY_T_SYSTEMS",
    "SOVEREIGN_CONTROLS_BY_SIA_MINSAIT",
    "SOVEREIGN_CONTROLS_BY_PSN",
    "SOVEREIGN_CONTROLS_BY_CNTXT",
    "SOVEREIGN_CONTROLS_BY_CNTXT_NO_EKM",
    "SPAIN_DATA_BOUNDARY_BY_TELEFONICA",
  ]).describe("Optional. Partner regime associated with this workload.")
    .optional(),
  partnerPermissions: z.object({
    accessTransparencyLogsSupportCaseViewer: z.boolean().describe(
      "Optional. Allow partner to view support case details for an AXT log",
    ).optional(),
    assuredWorkloadsMonitoring: z.boolean().describe(
      "Optional. Allow partner to view violation alerts.",
    ).optional(),
    dataLogsViewer: z.boolean().describe(
      "Optional. Allow the partner to view inspectability logs and monitoring violations.",
    ).optional(),
    serviceAccessApprover: z.boolean().describe(
      "Optional. Allow partner to view access approval logs.",
    ).optional(),
  }).describe(
    "Optional. Permissions granted to the AW Partner SA account for the customer workload",
  ).optional(),
  partnerServicesBillingAccount: z.string().describe(
    "Optional. Billing account necessary for purchasing services from Sovereign Partners. This field is required for creating SIA/PSN/CNTXT/Telefonica partner workloads. The caller should have 'billing.resourceAssociations.create' IAM permission on this billing-account. The format of this string is billingAccounts/AAAAAA-BBBBBB-CCCCCC",
  ).optional(),
  provisionedResourcesParent: z.string().describe(
    "Input only. The parent resource for the resources managed by this Assured Workload. May be either empty or a folder resource which is a child of the Workload parent. If not specified all resources are created under the parent organization. Format: folders/{folder_id}",
  ).optional(),
  resourceSettings: z.array(z.object({
    displayName: z.string().describe(
      "User-assigned resource display name. If not empty it will be used to create a resource with the specified name.",
    ).optional(),
    resourceId: z.string().describe(
      "Resource identifier. For a project this represents project_id. If the project is already taken, the workload creation will fail. For KeyRing, this represents the keyring_id. For a folder, don't set this value as folder_id is assigned by Google.",
    ).optional(),
    resourceType: z.enum([
      "RESOURCE_TYPE_UNSPECIFIED",
      "CONSUMER_PROJECT",
      "CONSUMER_FOLDER",
      "ENCRYPTION_KEYS_PROJECT",
      "KEYRING",
    ]).describe(
      "Indicates the type of resource. This field should be specified to correspond the id to the right project type (CONSUMER_PROJECT or ENCRYPTION_KEYS_PROJECT)",
    ).optional(),
  })).describe(
    "Input only. Resource properties that are used to customize workload resources. These properties (such as custom project id) will be used to create workload resources if possible. This field is optional.",
  ).optional(),
  violationNotificationsEnabled: z.boolean().describe(
    "Optional. Indicates whether the e-mail notification for a violation is enabled for a workload. This value will be by default True, and if not present will be considered as true. This should only be updated via updateWorkload call. Any Changes to this field during the createWorkload call will not be honored. This will always be true while creating the workload.",
  ).optional(),
  workloadOptions: z.object({
    kajEnrollmentType: z.enum([
      "KAJ_ENROLLMENT_TYPE_UNSPECIFIED",
      "KEY_ACCESS_TRANSPARENCY_OFF",
    ]).describe("Optional. Specifies type of KAJ Enrollment if provided.")
      .optional(),
  }).describe("Optional. Options to be set for the given created workload.")
    .optional(),
  externalId: z.string().describe(
    "Optional. A identifier associated with the workload and underlying projects which allows for the break down of billing costs for a workload. The value provided for the identifier will add a label to the workload and contained projects with the identifier as the value.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  billingAccount: z.string().optional(),
  complianceRegime: z.string().optional(),
  complianceStatus: z.object({
    acknowledgedResourceViolationCount: z.number(),
    acknowledgedViolationCount: z.number(),
    activeResourceViolationCount: z.number(),
    activeViolationCount: z.number(),
  }).optional(),
  compliantButDisallowedServices: z.array(z.string()).optional(),
  createTime: z.string().optional(),
  displayName: z.string().optional(),
  ekmProvisioningResponse: z.object({
    ekmProvisioningErrorDomain: z.string(),
    ekmProvisioningErrorMapping: z.string(),
    ekmProvisioningState: z.string(),
  }).optional(),
  enableSovereignControls: z.boolean().optional(),
  etag: z.string().optional(),
  kajEnrollmentState: z.string().optional(),
  kmsSettings: z.object({
    nextRotationTime: z.string(),
    rotationPeriod: z.string(),
  }).optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  name: z.string(),
  partner: z.string().optional(),
  partnerPermissions: z.object({
    accessTransparencyLogsSupportCaseViewer: z.boolean(),
    assuredWorkloadsMonitoring: z.boolean(),
    dataLogsViewer: z.boolean(),
    serviceAccessApprover: z.boolean(),
  }).optional(),
  partnerServicesBillingAccount: z.string().optional(),
  provisionedResourcesParent: z.string().optional(),
  resourceMonitoringEnabled: z.boolean().optional(),
  resourceSettings: z.array(z.object({
    displayName: z.string(),
    resourceId: z.string(),
    resourceType: z.string(),
  })).optional(),
  resources: z.array(z.object({
    resourceId: z.string(),
    resourceType: z.string(),
  })).optional(),
  saaEnrollmentResponse: z.object({
    setupErrors: z.array(z.string()),
    setupStatus: z.string(),
  }).optional(),
  violationNotificationsEnabled: z.boolean().optional(),
  workloadOptions: z.object({
    kajEnrollmentType: z.string(),
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
  billingAccount: z.string().describe(
    "Optional. The billing account used for the resources which are direct children of workload. This billing account is initially associated with the resources created as part of Workload creation. After the initial creation of these resources, the customer can change the assigned billing account. The resource name has the form `billingAccounts/{billing_account_id}`. For example, `billingAccounts/012345-567890-ABCDEF`.",
  ).optional(),
  complianceRegime: z.enum([
    "COMPLIANCE_REGIME_UNSPECIFIED",
    "ASSURED_WORKLOADS_FOR_PARTNERS",
    "AUSTRALIA_DATA_BOUNDARY_AND_SUPPORT",
    "CANADA_DATA_BOUNDARY_AND_SUPPORT",
    "DATA_BOUNDARY_FOR_CANADA_CONTROLLED_GOODS",
    "DATA_BOUNDARY_FOR_CANADA_PROTECTED_B",
    "DATA_BOUNDARY_FOR_CJIS",
    "DATA_BOUNDARY_FOR_FEDRAMP_HIGH",
    "DATA_BOUNDARY_FOR_FEDRAMP_MODERATE",
    "DATA_BOUNDARY_FOR_IL2",
    "DATA_BOUNDARY_FOR_IL4",
    "DATA_BOUNDARY_FOR_IL5",
    "DATA_BOUNDARY_FOR_IRS_PUBLICATION_1075",
    "DATA_BOUNDARY_FOR_ITAR",
    "EU_DATA_BOUNDARY_AND_SUPPORT",
    "ISRAEL_DATA_BOUNDARY_AND_SUPPORT",
    "JAPAN_DATA_BOUNDARY",
    "SWITZERLAND_DATA_BOUNDARY_WITH_ACCESS_JUSTIFICATIONS",
    "KSA_DATA_BOUNDARY_WITH_ACCESS_JUSTIFICATIONS",
    "REGIONAL_DATA_BOUNDARY",
    "US_DATA_BOUNDARY_AND_SUPPORT",
    "US_DATA_BOUNDARY_FOR_HEALTHCARE_AND_LIFE_SCIENCES",
    "US_DATA_BOUNDARY_FOR_HEALTHCARE_AND_LIFE_SCIENCES_WITH_SUPPORT",
    "AU_REGIONS_AND_US_SUPPORT",
    "CA_PROTECTED_B",
    "CA_REGIONS_AND_SUPPORT",
    "CANADA_CONTROLLED_GOODS",
    "CJIS",
    "EU_REGIONS_AND_SUPPORT",
    "FEDRAMP_HIGH",
    "FEDRAMP_MODERATE",
    "HEALTHCARE_AND_LIFE_SCIENCES_CONTROLS",
    "HEALTHCARE_AND_LIFE_SCIENCES_CONTROLS_US_SUPPORT",
    "HIPAA",
    "HITRUST",
    "IL2",
    "IL4",
    "IL5",
    "IRS_1075",
    "ISR_REGIONS",
    "ISR_REGIONS_AND_SUPPORT",
    "ITAR",
    "JP_REGIONS_AND_SUPPORT",
    "KSA_REGIONS_AND_SUPPORT_WITH_SOVEREIGNTY_CONTROLS",
    "REGIONAL_CONTROLS",
    "US_REGIONAL_ACCESS",
  ]).describe(
    "Required. Immutable. Compliance Regime associated with this workload.",
  ).optional(),
  displayName: z.string().describe(
    "Required. The user-assigned display name of the Workload. When present it must be between 4 to 30 characters. Allowed characters are: lowercase and uppercase letters, numbers, hyphen, and spaces. Example: My Workload",
  ).optional(),
  enableSovereignControls: z.boolean().describe(
    "Optional. Indicates the sovereignty status of the given workload. Currently meant to be used by Europe/Canada customers.",
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "Optional. Labels applied to the workload.",
  ).optional(),
  name: z.string().describe(
    "Optional. The resource name of the workload. Format: organizations/{organization}/locations/{location}/workloads/{workload} Read-only.",
  ).optional(),
  partner: z.enum([
    "PARTNER_UNSPECIFIED",
    "LOCAL_CONTROLS_BY_S3NS",
    "SOVEREIGN_CONTROLS_BY_T_SYSTEMS",
    "SOVEREIGN_CONTROLS_BY_SIA_MINSAIT",
    "SOVEREIGN_CONTROLS_BY_PSN",
    "SOVEREIGN_CONTROLS_BY_CNTXT",
    "SOVEREIGN_CONTROLS_BY_CNTXT_NO_EKM",
    "SPAIN_DATA_BOUNDARY_BY_TELEFONICA",
  ]).describe("Optional. Partner regime associated with this workload.")
    .optional(),
  partnerPermissions: z.object({
    accessTransparencyLogsSupportCaseViewer: z.boolean().describe(
      "Optional. Allow partner to view support case details for an AXT log",
    ).optional(),
    assuredWorkloadsMonitoring: z.boolean().describe(
      "Optional. Allow partner to view violation alerts.",
    ).optional(),
    dataLogsViewer: z.boolean().describe(
      "Optional. Allow the partner to view inspectability logs and monitoring violations.",
    ).optional(),
    serviceAccessApprover: z.boolean().describe(
      "Optional. Allow partner to view access approval logs.",
    ).optional(),
  }).describe(
    "Optional. Permissions granted to the AW Partner SA account for the customer workload",
  ).optional(),
  partnerServicesBillingAccount: z.string().describe(
    "Optional. Billing account necessary for purchasing services from Sovereign Partners. This field is required for creating SIA/PSN/CNTXT/Telefonica partner workloads. The caller should have 'billing.resourceAssociations.create' IAM permission on this billing-account. The format of this string is billingAccounts/AAAAAA-BBBBBB-CCCCCC",
  ).optional(),
  provisionedResourcesParent: z.string().describe(
    "Input only. The parent resource for the resources managed by this Assured Workload. May be either empty or a folder resource which is a child of the Workload parent. If not specified all resources are created under the parent organization. Format: folders/{folder_id}",
  ).optional(),
  resourceSettings: z.array(z.object({
    displayName: z.string().describe(
      "User-assigned resource display name. If not empty it will be used to create a resource with the specified name.",
    ).optional(),
    resourceId: z.string().describe(
      "Resource identifier. For a project this represents project_id. If the project is already taken, the workload creation will fail. For KeyRing, this represents the keyring_id. For a folder, don't set this value as folder_id is assigned by Google.",
    ).optional(),
    resourceType: z.enum([
      "RESOURCE_TYPE_UNSPECIFIED",
      "CONSUMER_PROJECT",
      "CONSUMER_FOLDER",
      "ENCRYPTION_KEYS_PROJECT",
      "KEYRING",
    ]).describe(
      "Indicates the type of resource. This field should be specified to correspond the id to the right project type (CONSUMER_PROJECT or ENCRYPTION_KEYS_PROJECT)",
    ).optional(),
  })).describe(
    "Input only. Resource properties that are used to customize workload resources. These properties (such as custom project id) will be used to create workload resources if possible. This field is optional.",
  ).optional(),
  violationNotificationsEnabled: z.boolean().describe(
    "Optional. Indicates whether the e-mail notification for a violation is enabled for a workload. This value will be by default True, and if not present will be considered as true. This should only be updated via updateWorkload call. Any Changes to this field during the createWorkload call will not be honored. This will always be true while creating the workload.",
  ).optional(),
  workloadOptions: z.object({
    kajEnrollmentType: z.enum([
      "KAJ_ENROLLMENT_TYPE_UNSPECIFIED",
      "KEY_ACCESS_TRANSPARENCY_OFF",
    ]).describe("Optional. Specifies type of KAJ Enrollment if provided.")
      .optional(),
  }).describe("Optional. Options to be set for the given created workload.")
    .optional(),
  externalId: z.string().describe(
    "Optional. A identifier associated with the workload and underlying projects which allows for the break down of billing costs for a workload. The value provided for the identifier will add a label to the workload and contained projects with the identifier as the value.",
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

/** Swamp extension model for Google Cloud Assured Workloads Workloads. Registered at `@swamp/gcp/assuredworkloads/workloads`. */
export const model = {
  type: "@swamp/gcp/assuredworkloads/workloads",
  version: "2026.09.17.1",
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
      toVersion: "2026.06.24.1",
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
      description:
        "Removed: complianceStatus, ekmProvisioningResponse, saaEnrollmentResponse",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          complianceStatus: _complianceStatus,
          ekmProvisioningResponse: _ekmProvisioningResponse,
          saaEnrollmentResponse: _saaEnrollmentResponse,
          ...rest
        } = old;
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
        "A Workload object for managing highly regulated workloads of cloud customers.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a workloads",
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
        if (g["billingAccount"] !== undefined) {
          body["billingAccount"] = g["billingAccount"];
        }
        if (g["complianceRegime"] !== undefined) {
          body["complianceRegime"] = g["complianceRegime"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["enableSovereignControls"] !== undefined) {
          body["enableSovereignControls"] = g["enableSovereignControls"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["partner"] !== undefined) body["partner"] = g["partner"];
        if (g["partnerPermissions"] !== undefined) {
          body["partnerPermissions"] = g["partnerPermissions"];
        }
        if (g["partnerServicesBillingAccount"] !== undefined) {
          body["partnerServicesBillingAccount"] =
            g["partnerServicesBillingAccount"];
        }
        if (g["provisionedResourcesParent"] !== undefined) {
          body["provisionedResourcesParent"] = g["provisionedResourcesParent"];
        }
        if (g["resourceSettings"] !== undefined) {
          body["resourceSettings"] = g["resourceSettings"];
        }
        if (g["violationNotificationsEnabled"] !== undefined) {
          body["violationNotificationsEnabled"] =
            g["violationNotificationsEnabled"];
        }
        if (g["workloadOptions"] !== undefined) {
          body["workloadOptions"] = g["workloadOptions"];
        }
        if (g["externalId"] !== undefined) {
          params["externalId"] = String(g["externalId"]);
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
      description: "Get a workloads",
      arguments: z.object({
        identifier: z.string().describe("The name of the workloads"),
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
      description: "Update workloads attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific workloads by name (e.g. one discovered by list)",
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
        if (g["billingAccount"] !== undefined) {
          body["billingAccount"] = g["billingAccount"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["enableSovereignControls"] !== undefined) {
          body["enableSovereignControls"] = g["enableSovereignControls"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["partner"] !== undefined) body["partner"] = g["partner"];
        if (g["partnerPermissions"] !== undefined) {
          body["partnerPermissions"] = g["partnerPermissions"];
        }
        if (g["partnerServicesBillingAccount"] !== undefined) {
          body["partnerServicesBillingAccount"] =
            g["partnerServicesBillingAccount"];
        }
        if (g["provisionedResourcesParent"] !== undefined) {
          body["provisionedResourcesParent"] = g["provisionedResourcesParent"];
        }
        if (g["resourceSettings"] !== undefined) {
          body["resourceSettings"] = g["resourceSettings"];
        }
        if (g["violationNotificationsEnabled"] !== undefined) {
          body["violationNotificationsEnabled"] =
            g["violationNotificationsEnabled"];
        }
        if (g["workloadOptions"] !== undefined) {
          body["workloadOptions"] = g["workloadOptions"];
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
      description: "Delete the workloads",
      arguments: z.object({
        identifier: z.string().describe("The name of the workloads"),
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
      description: "Sync workloads state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific workloads by name (e.g. one discovered by list)",
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
      description: "List workloads resources",
      arguments: z.object({
        filter: z.string().describe(
          "Optional. A custom filter for filtering by properties of a workload. At this time, only filtering by labels is supported.",
        ).optional(),
        pageSize: z.number().describe("Optional. Page size.").optional(),
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
          "workloads",
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
    analyze_workload_move: {
      description: "analyze workload move",
      arguments: z.object({
        assetTypes: z.any().optional(),
        pageSize: z.any().optional(),
        pageToken: z.any().optional(),
        project: z.any().optional(),
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
        params["target"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["assetTypes"] !== undefined) {
          params["assetTypes"] = String(args["assetTypes"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        if (args["pageToken"] !== undefined) {
          params["pageToken"] = String(args["pageToken"]);
        }
        if (args["project"] !== undefined) {
          params["project"] = String(args["project"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "assuredworkloads.organizations.locations.workloads.analyzeWorkloadMove",
            "path": "v1/{+target}:analyzeWorkloadMove",
            "httpMethod": "GET",
            "parameterOrder": ["target"],
            "parameters": {
              "assetTypes": { "location": "query" },
              "pageSize": { "location": "query" },
              "pageToken": { "location": "query" },
              "project": { "location": "query" },
              "target": { "location": "path", "required": true },
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
    enable_compliance_updates: {
      description: "enable compliance updates",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
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
        const result = await createResource(
          baseUrl,
          {
            "id":
              "assuredworkloads.organizations.locations.workloads.enableComplianceUpdates",
            "path": "v1/{+name}:enableComplianceUpdates",
            "httpMethod": "PUT",
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
    enable_resource_monitoring: {
      description: "enable resource monitoring",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
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
        const result = await createResource(
          baseUrl,
          {
            "id":
              "assuredworkloads.organizations.locations.workloads.enableResourceMonitoring",
            "path": "v1/{+name}:enableResourceMonitoring",
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
    mutate_partner_permissions: {
      description: "mutate partner permissions",
      arguments: z.object({
        etag: z.any().optional(),
        partnerPermissions: z.any().optional(),
        updateMask: z.any().optional(),
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
        if (args["etag"] !== undefined) body["etag"] = args["etag"];
        if (args["partnerPermissions"] !== undefined) {
          body["partnerPermissions"] = args["partnerPermissions"];
        }
        if (args["updateMask"] !== undefined) {
          body["updateMask"] = args["updateMask"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "assuredworkloads.organizations.locations.workloads.mutatePartnerPermissions",
            "path": "v1/{+name}:mutatePartnerPermissions",
            "httpMethod": "PATCH",
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
    restrict_allowed_resources: {
      description: "restrict allowed resources",
      arguments: z.object({
        restrictionType: z.any().optional(),
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
        if (args["restrictionType"] !== undefined) {
          body["restrictionType"] = args["restrictionType"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id":
              "assuredworkloads.organizations.locations.workloads.restrictAllowedResources",
            "path": "v1/{+name}:restrictAllowedResources",
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
