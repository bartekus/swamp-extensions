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

// Auto-generated extension model for @swamp/gcp/androidmanagement/enterprises-policies
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Android Management Enterprises.Policies.
 *
 * A policy resource represents a group of settings that govern the behavior of a managed device and the apps installed on it.
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
  return `${parent}/policies/${shortName}`;
}

const BASE_URL = "https://androidmanagement.googleapis.com/";

const GET_CONFIG = {
  "id": "androidmanagement.enterprises.policies.get",
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

const PATCH_CONFIG = {
  "id": "androidmanagement.enterprises.policies.patch",
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
  "id": "androidmanagement.enterprises.policies.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
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

const LIST_CONFIG = {
  "id": "androidmanagement.enterprises.policies.list",
  "path": "v1/{+parent}/policies",
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

const _defaultOAuthScopes: string[] = [
  "https://www.googleapis.com/auth/androidmanagement",
];

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
  accountTypesWithManagementDisabled: z.array(z.string()).describe(
    "Account types that can't be managed by the user.",
  ).optional(),
  addUserDisabled: z.boolean().describe(
    "Whether adding new users and profiles is disabled. For devices where managementMode is DEVICE_OWNER this field is ignored and the user is never allowed to add or remove users.",
  ).optional(),
  adjustVolumeDisabled: z.boolean().describe(
    "Whether adjusting the master volume is disabled. Also mutes the device. The setting has effect only on fully managed devices.",
  ).optional(),
  advancedSecurityOverrides: z.object({
    commonCriteriaMode: z.enum([
      "COMMON_CRITERIA_MODE_UNSPECIFIED",
      "COMMON_CRITERIA_MODE_DISABLED",
      "COMMON_CRITERIA_MODE_ENABLED",
    ]).describe(
      "Controls Common Criteria Mode—security standards defined in the Common Criteria for Information Technology Security Evaluation (https://www.commoncriteriaportal.org/) (CC). Enabling Common Criteria Mode increases certain security components on a device, see CommonCriteriaMode for details.Warning: Common Criteria Mode enforces a strict security model typically only required for IT products used in national security systems and other highly sensitive organizations. Standard device use may be affected. Only enabled if required. If Common Criteria Mode is turned off after being enabled previously, all user-configured Wi-Fi networks may be lost and any enterprise-configured Wi-Fi networks that require user input may need to be reconfigured.",
    ).optional(),
    contentProtectionPolicy: z.enum([
      "CONTENT_PROTECTION_POLICY_UNSPECIFIED",
      "CONTENT_PROTECTION_DISABLED",
      "CONTENT_PROTECTION_ENFORCED",
      "CONTENT_PROTECTION_USER_CHOICE",
    ]).describe(
      "Optional. Controls whether content protection, which scans for deceptive apps, is enabled. This is supported on Android 15 and above.",
    ).optional(),
    developerSettings: z.enum([
      "DEVELOPER_SETTINGS_UNSPECIFIED",
      "DEVELOPER_SETTINGS_DISABLED",
      "DEVELOPER_SETTINGS_ALLOWED",
    ]).describe(
      "Controls access to developer settings: developer options and safe boot. Replaces safeBootDisabled (deprecated) and debuggingFeaturesAllowed (deprecated). On personally-owned devices with a work profile, setting this policy will not disable safe boot. In this case, a NonComplianceDetail with MANAGEMENT_MODE is reported.",
    ).optional(),
    googlePlayProtectVerifyApps: z.enum([
      "GOOGLE_PLAY_PROTECT_VERIFY_APPS_UNSPECIFIED",
      "VERIFY_APPS_ENFORCED",
      "VERIFY_APPS_USER_CHOICE",
    ]).describe(
      "Whether Google Play Protect verification (https://support.google.com/accounts/answer/2812853) is enforced. Replaces ensureVerifyAppsEnabled (deprecated).",
    ).optional(),
    mtePolicy: z.enum([
      "MTE_POLICY_UNSPECIFIED",
      "MTE_USER_CHOICE",
      "MTE_ENFORCED",
      "MTE_DISABLED",
    ]).describe(
      "Optional. Controls Memory Tagging Extension (MTE) (https://source.android.com/docs/security/test/memory-safety/arm-mte) on the device. The device needs to be rebooted to apply changes to the MTE policy. On Android 15 and above, a NonComplianceDetail with PENDING is reported if the policy change is pending a device reboot.",
    ).optional(),
    personalAppsThatCanReadWorkNotifications: z.array(z.string()).describe(
      "Personal apps that can read work profile notifications using a NotificationListenerService (https://developer.android.com/reference/android/service/notification/NotificationListenerService). By default, no personal apps (aside from system apps) can read work notifications. Each value in the list must be a package name.",
    ).optional(),
    untrustedAppsPolicy: z.enum([
      "UNTRUSTED_APPS_POLICY_UNSPECIFIED",
      "DISALLOW_INSTALL",
      "ALLOW_INSTALL_IN_PERSONAL_PROFILE_ONLY",
      "ALLOW_INSTALL_DEVICE_WIDE",
    ]).describe(
      "The policy for untrusted apps (apps from unknown sources) enforced on the device. Replaces install_unknown_sources_allowed (deprecated).",
    ).optional(),
  }).describe(
    "Advanced security settings. In most cases, setting these is not needed.",
  ).optional(),
  alwaysOnVpnPackage: z.object({
    lockdownEnabled: z.boolean().describe(
      "Disallows networking when the VPN is not connected.",
    ).optional(),
    packageName: z.string().describe("The package name of the VPN app.")
      .optional(),
  }).describe(
    "Configuration for an always-on VPN connection. Use with vpn_config_disabled to prevent modification of this setting.",
  ).optional(),
  appAutoUpdatePolicy: z.enum([
    "APP_AUTO_UPDATE_POLICY_UNSPECIFIED",
    "CHOICE_TO_THE_USER",
    "NEVER",
    "WIFI_ONLY",
    "ALWAYS",
  ]).describe(
    "Recommended alternative: autoUpdateMode which is set per app, provides greater flexibility around update frequency.When autoUpdateMode is set to AUTO_UPDATE_POSTPONED or AUTO_UPDATE_HIGH_PRIORITY, this field has no effect.The app auto update policy, which controls when automatic app updates can be applied.",
  ).optional(),
  appFunctions: z.enum([
    "APP_FUNCTIONS_UNSPECIFIED",
    "APP_FUNCTIONS_DISALLOWED",
    "APP_FUNCTIONS_ALLOWED",
  ]).describe(
    "Optional. Controls whether apps on the device for fully managed devices or in the work profile for devices with work profiles are allowed to expose app functions.",
  ).optional(),
  applications: z.array(z.object({
    accessibleTrackIds: z.array(z.string()).describe(
      "List of the app’s track IDs that a device belonging to the enterprise can access. If the list contains multiple track IDs, devices receive the latest version among all accessible tracks. If the list contains no track IDs, devices only have access to the app’s production track. More details about each track are available in AppTrackInfo.",
    ).optional(),
    alwaysOnVpnLockdownExemption: z.enum([
      "ALWAYS_ON_VPN_LOCKDOWN_EXEMPTION_UNSPECIFIED",
      "VPN_LOCKDOWN_ENFORCED",
      "VPN_LOCKDOWN_EXEMPTION",
    ]).describe(
      "Specifies whether the app is allowed networking when the VPN is not connected and alwaysOnVpnPackage.lockdownEnabled is enabled. If set to VPN_LOCKDOWN_ENFORCED, the app is not allowed networking, and if set to VPN_LOCKDOWN_EXEMPTION, the app is allowed networking. Only supported on devices running Android 10 and above. If this is not supported by the device, the device will contain a NonComplianceDetail with non_compliance_reason set to API_LEVEL and a fieldPath. If this is not applicable to the app, the device will contain a NonComplianceDetail with non_compliance_reason set to UNSUPPORTED and a fieldPath. The fieldPath is set to applications[i].alwaysOnVpnLockdownExemption, where i is the index of the package in the applications policy.",
    ).optional(),
    autoUpdateMode: z.enum([
      "AUTO_UPDATE_MODE_UNSPECIFIED",
      "AUTO_UPDATE_DEFAULT",
      "AUTO_UPDATE_POSTPONED",
      "AUTO_UPDATE_HIGH_PRIORITY",
    ]).describe("Controls the auto-update mode for the app.").optional(),
    connectedWorkAndPersonalApp: z.enum([
      "CONNECTED_WORK_AND_PERSONAL_APP_UNSPECIFIED",
      "CONNECTED_WORK_AND_PERSONAL_APP_DISALLOWED",
      "CONNECTED_WORK_AND_PERSONAL_APP_ALLOWED",
    ]).describe(
      "Controls whether the app can communicate with itself across a device’s work and personal profiles, subject to user consent.",
    ).optional(),
    credentialProviderPolicy: z.enum([
      "CREDENTIAL_PROVIDER_POLICY_UNSPECIFIED",
      "CREDENTIAL_PROVIDER_ALLOWED",
      "CREDENTIAL_PROVIDER_DISALLOWED",
    ]).describe(
      "Optional. Whether the app is allowed to act as a credential provider on Android 14 and above.",
    ).optional(),
    customAppConfig: z.object({
      userUninstallSettings: z.enum([
        "USER_UNINSTALL_SETTINGS_UNSPECIFIED",
        "DISALLOW_UNINSTALL_BY_USER",
        "ALLOW_UNINSTALL_BY_USER",
      ]).describe("Optional. User uninstall settings of the custom app.")
        .optional(),
    }).describe(
      "Optional. Configuration for this custom app.install_type must be set to CUSTOM for this to be set.",
    ).optional(),
    defaultPermissionPolicy: z.enum([
      "PERMISSION_POLICY_UNSPECIFIED",
      "PROMPT",
      "GRANT",
      "DENY",
    ]).describe(
      "The default policy for all permissions requested by the app. If specified, this overrides the policy-level default_permission_policy which applies to all apps. It does not override the permission_grants which applies to all apps.",
    ).optional(),
    delegatedScopes: z.array(
      z.enum([
        "DELEGATED_SCOPE_UNSPECIFIED",
        "CERT_INSTALL",
        "MANAGED_CONFIGURATIONS",
        "BLOCK_UNINSTALL",
        "PERMISSION_GRANT",
        "PACKAGE_ACCESS",
        "ENABLE_SYSTEM_APP",
        "NETWORK_ACTIVITY_LOGS",
        "SECURITY_LOGS",
        "CERT_SELECTION",
      ]),
    ).describe(
      "The scopes delegated to the app from Android Device Policy. These provide additional privileges for the applications they are applied to.",
    ).optional(),
    disabled: z.boolean().describe(
      "Whether the app is disabled. When disabled, the app data is still preserved.",
    ).optional(),
    extensionConfig: z.object({
      notificationReceiver: z.string().describe(
        "Fully qualified class name of the receiver service class for Android Device Policy to notify the extension app of any local command status updates. The service must be exported in the extension app's AndroidManifest.xml and extend NotificationReceiverService (https://developers.google.com/android/management/reference/amapi/com/google/android/managementapi/notification/NotificationReceiverService) (see Integrate with the AMAPI SDK (https://developers.google.com/android/management/sdk-integration) guide for more details).",
      ).optional(),
      signingKeyFingerprintsSha256: z.array(z.string()).describe(
        "Hex-encoded SHA-256 hashes of the signing key certificates of the extension app. Only hexadecimal string representations of 64 characters are valid.The signing key certificate fingerprints are always obtained from the Play Store and this field is used to provide additional signing key certificate fingerprints. However, if the application is not available on the Play Store, this field needs to be set. A NonComplianceDetail with INVALID_VALUE is reported if this field is not set when the application is not available on the Play Store.The signing key certificate fingerprint of the extension app on the device must match one of the signing key certificate fingerprints obtained from the Play Store or the ones provided in this field for the app to be able to communicate with Android Device Policy.In production use cases, it is recommended to leave this empty.",
      ).optional(),
    }).describe(
      "Configuration to enable this app as an extension app, with the capability of interacting with Android Device Policy offline.This field can be set for at most one app. If there is any app with COMPANION_APP role, this field cannot be set.The signing key certificate fingerprint of the app on the device must match one of the entries in ApplicationPolicy.signingKeyCerts or ExtensionConfig.signingKeyFingerprintsSha256 (deprecated) or the signing key certificate fingerprints obtained from Play Store for the app to be able to communicate with Android Device Policy. If the app is not on Play Store and if ApplicationPolicy.signingKeyCerts and ExtensionConfig.signingKeyFingerprintsSha256 (deprecated) are not set, a NonComplianceDetail with INVALID_VALUE is reported.",
    ).optional(),
    installConstraint: z.array(z.object({
      chargingConstraint: z.enum([
        "CHARGING_CONSTRAINT_UNSPECIFIED",
        "CHARGING_NOT_REQUIRED",
        "INSTALL_ONLY_WHEN_CHARGING",
      ]).describe("Optional. Charging constraint.").optional(),
      deviceIdleConstraint: z.enum([
        "DEVICE_IDLE_CONSTRAINT_UNSPECIFIED",
        "DEVICE_IDLE_NOT_REQUIRED",
        "INSTALL_ONLY_WHEN_DEVICE_IDLE",
      ]).describe("Optional. Device idle constraint.").optional(),
      networkTypeConstraint: z.enum([
        "NETWORK_TYPE_CONSTRAINT_UNSPECIFIED",
        "INSTALL_ON_ANY_NETWORK",
        "INSTALL_ONLY_ON_UNMETERED_NETWORK",
      ]).describe("Optional. Network type constraint.").optional(),
    })).describe(
      "Optional. The constraints for installing the app. You can specify a maximum of one InstallConstraint. Multiple constraints are rejected.",
    ).optional(),
    installPriority: z.number().int().describe(
      "Optional. Amongst apps with installType set to: FORCE_INSTALLED PREINSTALLEDthis controls the relative priority of installation. A value of 0 (default) means this app has no priority over other apps. For values between 1 and 10,000, a lower value means a higher priority. Values outside of the range 0 to 10,000 inclusive are rejected.",
    ).optional(),
    installType: z.enum([
      "INSTALL_TYPE_UNSPECIFIED",
      "PREINSTALLED",
      "FORCE_INSTALLED",
      "BLOCKED",
      "AVAILABLE",
      "REQUIRED_FOR_SETUP",
      "KIOSK",
      "CUSTOM",
    ]).describe("The type of installation to perform.").optional(),
    lockTaskAllowed: z.boolean().describe(
      "Whether the app is allowed to lock itself in full-screen mode. DEPRECATED. Use InstallType KIOSK or kioskCustomLauncherEnabled to configure a dedicated device.",
    ).optional(),
    managedConfiguration: z.record(z.string(), z.string()).describe(
      "Managed configuration applied to the app. The format for the configuration is dictated by the ManagedProperty values supported by the app. Each field name in the managed configuration must match the key field of the ManagedProperty. The field value must be compatible with the type of the ManagedProperty: *type* *JSON value* BOOL true or false STRING string INTEGER number CHOICE string MULTISELECT array of strings HIDDEN string BUNDLE_ARRAY array of objects Note: string values cannot be longer than 65535 characters.",
    ).optional(),
    managedConfigurationTemplate: z.object({
      configurationVariables: z.record(z.string(), z.string()).describe(
        "Optional, a map containing configuration variables defined for the configuration.",
      ).optional(),
      templateId: z.string().describe(
        'The ID of the managed configurations template. This value must be a numeric string containing exactly one or more digits (for example, "123456").',
      ).optional(),
    }).describe(
      "The managed configurations template for the app, saved from the managed configurations iframe. This field is ignored if managed_configuration is set.",
    ).optional(),
    minimumVersionCode: z.number().int().describe(
      "The minimum version of the app that runs on the device. If set, the device attempts to update the app to at least this version code. If the app is not up-to-date, the device will contain a NonComplianceDetail with non_compliance_reason set to APP_NOT_UPDATED. The app must already be published to Google Play with a version code greater than or equal to this value. At most 20 apps may specify a minimum version code per policy.",
    ).optional(),
    packageName: z.string().describe(
      "The package name of the app. For example, com.google.android.youtube for the YouTube app.",
    ).optional(),
    permissionGrants: z.array(z.object({
      permission: z.string().describe(
        "The Android permission or group, e.g. android.permission.READ_CALENDAR or android.permission_group.CALENDAR.",
      ).optional(),
      policy: z.enum([
        "PERMISSION_POLICY_UNSPECIFIED",
        "PROMPT",
        "GRANT",
        "DENY",
      ]).describe("The policy for granting the permission.").optional(),
    })).describe(
      "Explicit permission grants or denials for the app. These values override the default_permission_policy and permission_grants which apply to all apps.",
    ).optional(),
    preferentialNetworkId: z.enum([
      "PREFERENTIAL_NETWORK_ID_UNSPECIFIED",
      "NO_PREFERENTIAL_NETWORK",
      "PREFERENTIAL_NETWORK_ID_ONE",
      "PREFERENTIAL_NETWORK_ID_TWO",
      "PREFERENTIAL_NETWORK_ID_THREE",
      "PREFERENTIAL_NETWORK_ID_FOUR",
      "PREFERENTIAL_NETWORK_ID_FIVE",
    ]).describe(
      "Optional. ID of the preferential network the application uses. There must be a configuration for the specified network ID in preferentialNetworkServiceConfigs. If set to PREFERENTIAL_NETWORK_ID_UNSPECIFIED, the application will use the default network ID specified in defaultPreferentialNetworkId. See the documentation of defaultPreferentialNetworkId for the list of apps excluded from this defaulting. This applies on both work profiles and fully managed devices on Android 13 and above.",
    ).optional(),
    roles: z.array(z.object({
      roleType: z.enum([
        "ROLE_TYPE_UNSPECIFIED",
        "COMPANION_APP",
        "KIOSK",
        "MOBILE_THREAT_DEFENSE_ENDPOINT_DETECTION_RESPONSE",
        "SYSTEM_HEALTH_MONITORING",
      ]).describe("Required. The type of the role an app can have.").optional(),
    })).describe(
      "Optional. Roles the app has.Apps having certain roles can be exempted from power and background execution restrictions, suspension and hibernation on Android 14 and above. The user control can also be disallowed for apps with certain roles on Android 11 and above. Refer to the documentation of each RoleType for more details.The app is notified about the roles that are set for it if the app has a notification receiver service with. The app is notified whenever its roles are updated or after the app is installed when it has nonempty list of roles. The app can use this notification to bootstrap itself after the installation. See Integrate with the AMAPI SDK (https://developers.google.com/android/management/sdk-integration) and Manage app roles (https://developers.google.com/android/management/app-roles) guides for more details on the requirements for the service.For the exemptions to be applied and the app to be notified about the roles, the signing key certificate fingerprint of the app on the device must match one of the signing key certificate fingerprints obtained from Play Store or one of the entries in ApplicationPolicy.signingKeyCerts. Otherwise, a NonComplianceDetail with APP_SIGNING_CERT_MISMATCH is reported.There must not be duplicate roles with the same roleType. Multiple apps cannot hold a role with the same roleType. A role with type ROLE_TYPE_UNSPECIFIED is not allowed.",
    ).optional(),
    signingKeyCerts: z.array(z.object({
      signingKeyCertFingerprintSha256: z.string().describe(
        "Required. The SHA-256 hash value of the signing key certificate of the app. This must be a valid SHA-256 hash value, i.e. 32 bytes.",
      ).optional(),
    })).describe(
      "Optional. Signing key certificates of the app.This field is required in the following cases: The app has installType set to CUSTOM (i.e. a custom app). The app has roles set to a nonempty list and the app does not exist on the Play Store. The app has extensionConfig set (i.e. an extension app) but ExtensionConfig.signingKeyFingerprintsSha256 (deprecated) is not set and the app does not exist on the Play Store.If this field is not set for a custom app, the policy is rejected. If it is not set when required for a non-custom app, a NonComplianceDetail with INVALID_VALUE is reported.For other cases, this field is optional and the signing key certificates obtained from Play Store are used.See following policy settings to see how this field is used: choosePrivateKeyRules ApplicationPolicy.InstallType.CUSTOM ApplicationPolicy.extensionConfig ApplicationPolicy.roles",
    ).optional(),
    userControlSettings: z.enum([
      "USER_CONTROL_SETTINGS_UNSPECIFIED",
      "USER_CONTROL_ALLOWED",
      "USER_CONTROL_DISALLOWED",
    ]).describe(
      "Optional. Specifies whether user control is permitted for the app. User control includes user actions like force-stopping and clearing app data. Certain types of apps have special treatment, see USER_CONTROL_SETTINGS_UNSPECIFIED and USER_CONTROL_ALLOWED for more details.",
    ).optional(),
    workProfileWidgets: z.enum([
      "WORK_PROFILE_WIDGETS_UNSPECIFIED",
      "WORK_PROFILE_WIDGETS_ALLOWED",
      "WORK_PROFILE_WIDGETS_DISALLOWED",
    ]).describe(
      "Specifies whether the app installed in the work profile is allowed to add widgets to the home screen.",
    ).optional(),
  })).describe("Policy applied to apps. This can have at most 3,000 elements.")
    .optional(),
  assistContentPolicy: z.enum([
    "ASSIST_CONTENT_POLICY_UNSPECIFIED",
    "ASSIST_CONTENT_DISALLOWED",
    "ASSIST_CONTENT_ALLOWED",
  ]).describe(
    "Optional. Controls whether AssistContent (https://developer.android.com/reference/android/app/assist/AssistContent) is allowed to be sent to a privileged app such as an assistant app. AssistContent includes screenshots and information about an app, such as package name. This is supported on Android 15 and above.",
  ).optional(),
  autoDateAndTimeZone: z.enum([
    "AUTO_DATE_AND_TIME_ZONE_UNSPECIFIED",
    "AUTO_DATE_AND_TIME_ZONE_USER_CHOICE",
    "AUTO_DATE_AND_TIME_ZONE_ENFORCED",
  ]).describe(
    "Whether auto date, time, and time zone are enabled on a company-owned device. If this is set, then autoTimeRequired is ignored.",
  ).optional(),
  autofillPolicy: z.enum([
    "AUTOFILL_POLICY_UNSPECIFIED",
    "AUTOFILL_USER_CHOICE",
    "AUTOFILL_DISABLED",
  ]).describe("Optional. The policy for the autofill service.").optional(),
  backupService: z.enum([
    "BACKUP_SERVICE_UNSPECIFIED",
    "BACKUP_SERVICE_DISABLED",
    "BACKUP_SERVICE_USER_CHOICE",
  ]).describe(
    "Optional. Controls whether the backup service is disabled. Supported only on fully managed devices running Android 8 and above.",
  ).optional(),
  bluetoothConfigDisabled: z.boolean().describe(
    "Whether configuring bluetooth is disabled.",
  ).optional(),
  bluetoothContactSharingDisabled: z.boolean().describe(
    "Whether bluetooth contact sharing is disabled.",
  ).optional(),
  bluetoothDisabled: z.boolean().describe(
    "Whether bluetooth is disabled. Prefer this setting over bluetooth_config_disabled because bluetooth_config_disabled can be bypassed by the user.",
  ).optional(),
  cameraAccess: z.enum([
    "CAMERA_ACCESS_UNSPECIFIED",
    "CAMERA_ACCESS_USER_CHOICE",
    "CAMERA_ACCESS_DISABLED",
    "CAMERA_ACCESS_ENFORCED",
  ]).describe(
    "Controls the use of the camera and whether the user has access to the camera access toggle.",
  ).optional(),
  cellBroadcastsConfigDisabled: z.boolean().describe(
    "Whether configuring cell broadcast is disabled.",
  ).optional(),
  choosePrivateKeyRules: z.array(z.object({
    packageNames: z.array(z.string()).describe(
      "The package names to which this rule applies. The signing key certificate fingerprint of the app is verified against the signing key certificate fingerprints provided by Play Store and ApplicationPolicy.signingKeyCerts. If no package names are specified, then the alias is provided to all apps that call KeyChain.choosePrivateKeyAlias (https://developer.android.com/reference/android/security/KeyChain#choosePrivateKeyAlias%28android.app.Activity,%20android.security.KeyChainAliasCallback,%20java.lang.String[],%20java.security.Principal[],%20java.lang.String,%20int,%20java.lang.String%29) or any overloads (but not without calling KeyChain.choosePrivateKeyAlias, even on Android 11 and above). Any app with the same Android UID as a package specified here will have access when they call KeyChain.choosePrivateKeyAlias.",
    ).optional(),
    privateKeyAlias: z.string().describe(
      "The alias of the private key to be used.",
    ).optional(),
    urlPattern: z.string().describe(
      "The URL pattern to match against the URL of the request. If not set or empty, it matches all URLs. This uses the regular expression syntax of java.util.regex.Pattern.",
    ).optional(),
  })).describe(
    "Rules for determining apps' access to private keys. See ChoosePrivateKeyRule for details. This must be empty if any application has CERT_SELECTION delegation scope.",
  ).optional(),
  createWindowsDisabled: z.boolean().describe(
    "Whether creating windows besides app windows is disabled.",
  ).optional(),
  credentialProviderPolicyDefault: z.enum([
    "CREDENTIAL_PROVIDER_POLICY_DEFAULT_UNSPECIFIED",
    "CREDENTIAL_PROVIDER_DEFAULT_DISALLOWED",
    "CREDENTIAL_PROVIDER_DEFAULT_DISALLOWED_EXCEPT_SYSTEM",
    "CREDENTIAL_PROVIDER_DEFAULT_ALLOWED",
  ]).describe(
    "Optional. Controls which apps are allowed to act as credential providers on Android 14 and above. These apps store credentials, see this (https://developer.android.com/training/sign-in/passkeys) and this (https://developer.android.com/reference/androidx/credentials/CredentialManager) for details. See also credentialProviderPolicy.",
  ).optional(),
  credentialsConfigDisabled: z.boolean().describe(
    "Whether configuring user credentials is disabled.",
  ).optional(),
  crossDevicePolicies: z.object({
    nearbyAppStreaming: z.enum([
      "NEARBY_APP_STREAMING_UNSPECIFIED",
      "NEARBY_APP_STREAMING_USER_CHOICE",
      "NEARBY_APP_STREAMING_DISABLED",
      "NEARBY_APP_STREAMING_USER_CHOICE_SAME_MANAGED_ACCOUNT",
    ]).describe(
      "Optional. Manages video streaming of apps on the device for fully managed devices or in the work profile for devices with work profiles to nearby devices. This is supported on Android 13 and above.",
    ).optional(),
    nearbyNotificationStreaming: z.enum([
      "NEARBY_NOTIFICATION_STREAMING_UNSPECIFIED",
      "NEARBY_NOTIFICATION_STREAMING_USER_CHOICE",
      "NEARBY_NOTIFICATION_STREAMING_DISABLED",
      "NEARBY_NOTIFICATION_STREAMING_USER_CHOICE_SAME_MANAGED_ACCOUNT",
    ]).describe(
      "Optional. Manages streaming of notifications from apps on the device for fully managed devices or in the work profile for devices with work profiles to nearby devices. This is supported on Android 13 and above.",
    ).optional(),
  }).describe("Optional. Policies controlling cross-device communication.")
    .optional(),
  crossProfilePolicies: z.object({
    crossProfileAppFunctions: z.enum([
      "CROSS_PROFILE_APP_FUNCTIONS_UNSPECIFIED",
      "CROSS_PROFILE_APP_FUNCTIONS_DISALLOWED",
      "CROSS_PROFILE_APP_FUNCTIONS_ALLOWED",
    ]).describe(
      "Optional. Controls whether personal profile apps can invoke app functions exposed by apps in the work profile.",
    ).optional(),
    crossProfileCopyPaste: z.enum([
      "CROSS_PROFILE_COPY_PASTE_UNSPECIFIED",
      "COPY_FROM_WORK_TO_PERSONAL_DISALLOWED",
      "CROSS_PROFILE_COPY_PASTE_ALLOWED",
    ]).describe(
      "Whether text copied from one profile (personal or work) can be pasted in the other profile.",
    ).optional(),
    crossProfileDataSharing: z.enum([
      "CROSS_PROFILE_DATA_SHARING_UNSPECIFIED",
      "CROSS_PROFILE_DATA_SHARING_DISALLOWED",
      "DATA_SHARING_FROM_WORK_TO_PERSONAL_DISALLOWED",
      "CROSS_PROFILE_DATA_SHARING_ALLOWED",
    ]).describe(
      "Whether data from one profile (personal or work) can be shared with apps in the other profile. Specifically controls simple data sharing via intents. Management of other cross-profile communication channels, such as contact search, copy/paste, or connected work & personal apps, are configured separately.",
    ).optional(),
    exemptionsToShowWorkContactsInPersonalProfile: z.object({
      packageNames: z.array(z.string()).describe("A list of package names.")
        .optional(),
    }).describe(
      "List of apps which are excluded from the ShowWorkContactsInPersonalProfile setting. For this to be set, ShowWorkContactsInPersonalProfile must be set to one of the following values: SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_ALLOWED. In this case, these exemptions act as a blocklist. SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED. In this case, these exemptions act as an allowlist. SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED_EXCEPT_SYSTEM. In this case, these exemptions act as an allowlist, in addition to the already allowlisted system apps.Supported on Android 14 and above. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 14.",
    ).optional(),
    showWorkContactsInPersonalProfile: z.enum([
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_UNSPECIFIED",
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED",
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_ALLOWED",
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED_EXCEPT_SYSTEM",
    ]).describe(
      "Whether personal apps can access contacts stored in the work profile.See also exemptions_to_show_work_contacts_in_personal_profile.",
    ).optional(),
    workProfileWidgetsDefault: z.enum([
      "WORK_PROFILE_WIDGETS_DEFAULT_UNSPECIFIED",
      "WORK_PROFILE_WIDGETS_DEFAULT_ALLOWED",
      "WORK_PROFILE_WIDGETS_DEFAULT_DISALLOWED",
    ]).describe(
      "Specifies the default behaviour for work profile widgets. If the policy does not specify work_profile_widgets for a specific application, it will behave according to the value specified here.",
    ).optional(),
  }).describe("Cross-profile policies applied on the device.").optional(),
  dataRoamingDisabled: z.boolean().describe(
    "Whether roaming data services are disabled.",
  ).optional(),
  defaultApplicationSettings: z.array(z.object({
    defaultApplicationScopes: z.array(
      z.enum([
        "DEFAULT_APPLICATION_SCOPE_UNSPECIFIED",
        "SCOPE_FULLY_MANAGED",
        "SCOPE_WORK_PROFILE",
        "SCOPE_PERSONAL_PROFILE",
      ]),
    ).describe(
      "Required. The scopes to which the policy should be applied. This list must not be empty or contain duplicates.A NonComplianceDetail with MANAGEMENT_MODE reason and DEFAULT_APPLICATION_SETTING_UNSUPPORTED_SCOPES specific reason is reported if none of the specified scopes can be applied to the management mode (e.g. a fully managed device receives a policy with only SCOPE_PERSONAL_PROFILE in the list).",
    ).optional(),
    defaultApplicationType: z.enum([
      "DEFAULT_APPLICATION_TYPE_UNSPECIFIED",
      "DEFAULT_ASSISTANT",
      "DEFAULT_BROWSER",
      "DEFAULT_CALL_REDIRECTION",
      "DEFAULT_CALL_SCREENING",
      "DEFAULT_DIALER",
      "DEFAULT_HOME",
      "DEFAULT_SMS",
      "DEFAULT_WALLET",
    ]).describe("Required. The app type to set the default application.")
      .optional(),
    defaultApplications: z.array(z.object({
      packageName: z.string().describe(
        "Required. The package name that should be set as the default application. The policy is rejected if the package name is invalid.",
      ).optional(),
    })).describe(
      "Required. The list of applications that can be set as the default app for a given type. This list must not be empty or contain duplicates. The first app in the list that is installed and qualified for the defaultApplicationType (e.g. SMS app for DEFAULT_SMS) is set as the default app. The signing key certificate fingerprint of the app on the device must also match one of the signing key certificate fingerprints obtained from Play Store or one of the entries in ApplicationPolicy.signingKeyCerts in order to be set as the default.If the defaultApplicationScopes contains SCOPE_FULLY_MANAGED or SCOPE_WORK_PROFILE, the app must have an entry in applications with installType set to a value other than BLOCKED.A NonComplianceDetail with APP_NOT_INSTALLED reason and DEFAULT_APPLICATION_SETTING_FAILED_FOR_SCOPE specific reason is reported if none of the apps in the list are installed. A NonComplianceDetail with INVALID_VALUE reason and DEFAULT_APPLICATION_SETTING_FAILED_FOR_SCOPE specific reason is reported if at least one app is installed but the policy fails to apply due to other reasons (e.g. the app is not of the right type).When applying to SCOPE_PERSONAL_PROFILE on a company-owned device with a work profile, only pre-installed system apps can be set as the default. A NonComplianceDetail with INVALID_VALUE reason and DEFAULT_APPLICATION_SETTING_FAILED_FOR_SCOPE specific reason is reported if the policy fails to apply to the personal profile.",
    ).optional(),
  })).describe(
    "Optional. The default application setting for supported types. If the default application is successfully set for at least one app type on a profile, users are prevented from changing any default applications on that profile.Only one DefaultApplicationSetting is allowed for each DefaultApplicationType.Warning: Do not configure this and persistent_preferred_activities for the same intent domain, such as web browsing. Setting both for the same intent domain can lead to unpredictable behavior.See Default application settings (https://developers.google.com/android/management/default-application-settings) guide for more details.",
  ).optional(),
  defaultPermissionPolicy: z.enum([
    "PERMISSION_POLICY_UNSPECIFIED",
    "PROMPT",
    "GRANT",
    "DENY",
  ]).describe("The default permission policy for runtime permission requests.")
    .optional(),
  deviceConnectivityManagement: z.object({
    apnPolicy: z.object({
      apnSettings: z.array(z.object({
        alwaysOnSetting: z.enum([
          "ALWAYS_ON_SETTING_UNSPECIFIED",
          "NOT_ALWAYS_ON",
          "ALWAYS_ON",
        ]).describe(
          "Optional. Whether User Plane resources have to be activated during every transition from CM-IDLE mode to CM-CONNECTED state for this APN. See 3GPP TS 23.501 section 5.6.13.",
        ).optional(),
        apn: z.string().describe(
          "Required. Name of the APN. Policy will be rejected if this field is empty.",
        ).optional(),
        apnTypes: z.array(z.unknown()).describe(
          "Required. Usage categories for the APN. Policy will be rejected if this field is empty or contains APN_TYPE_UNSPECIFIED or duplicates. Multiple APN types can be set on fully managed devices. ENTERPRISE is the only allowed APN type on work profiles. A NonComplianceDetail with MANAGEMENT_MODE is reported for any other value on work profiles. APN types that are not supported on the device or management mode will be ignored. If this results in the empty list, the APN setting will be ignored, because apnTypes is a required field. A NonComplianceDetail with INVALID_VALUE is reported if none of the APN types are supported on the device or management mode.",
        ).optional(),
        authType: z.enum([
          "AUTH_TYPE_UNSPECIFIED",
          "NONE",
          "PAP",
          "CHAP",
          "PAP_OR_CHAP",
        ]).describe("Optional. Authentication type of the APN.").optional(),
        carrierId: z.number().int().describe(
          "Optional. Carrier ID for the APN. A value of 0 (default) means not set and negative values are rejected.",
        ).optional(),
        displayName: z.string().describe(
          "Required. Human-readable name that describes the APN. Policy will be rejected if this field is empty.",
        ).optional(),
        mmsProxyAddress: z.string().describe(
          "Optional. MMS (Multimedia Messaging Service) proxy address of the APN which can be an IP address or hostname (not a URL).",
        ).optional(),
        mmsProxyPort: z.number().int().describe(
          "Optional. MMS (Multimedia Messaging Service) proxy port of the APN. A value of 0 (default) means not set and negative values are rejected.",
        ).optional(),
        mmsc: z.string().describe(
          "Optional. MMSC (Multimedia Messaging Service Center) URI of the APN.",
        ).optional(),
        mtuV4: z.number().int().describe(
          "Optional. The default MTU (Maximum Transmission Unit) size in bytes of the IPv4 routes brought up by this APN setting. A value of 0 (default) means not set and negative values are rejected. Supported on Android 13 and above. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 13.",
        ).optional(),
        mtuV6: z.number().int().describe(
          "Optional. The MTU (Maximum Transmission Unit) size of the IPv6 mobile interface to which the APN connected. A value of 0 (default) means not set and negative values are rejected. Supported on Android 13 and above. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 13.",
        ).optional(),
        mvnoType: z.enum([
          "MVNO_TYPE_UNSPECIFIED",
          "GID",
          "ICCID",
          "IMSI",
          "SPN",
        ]).describe("Optional. MVNO match type for the APN.").optional(),
        networkTypes: z.array(z.unknown()).describe(
          "Optional. Radio technologies (network types) the APN may use. Policy will be rejected if this field contains NETWORK_TYPE_UNSPECIFIED or duplicates.",
        ).optional(),
        numericOperatorId: z.string().describe(
          "Optional. The numeric operator ID of the APN. Numeric operator ID is defined as MCC (Mobile Country Code) + MNC (Mobile Network Code).",
        ).optional(),
        password: z.string().describe("Optional. APN password of the APN.")
          .optional(),
        protocol: z.enum([
          "PROTOCOL_UNSPECIFIED",
          "IP",
          "IPV4V6",
          "IPV6",
          "NON_IP",
          "PPP",
          "UNSTRUCTURED",
        ]).describe("Optional. The protocol to use to connect to this APN.")
          .optional(),
        proxyAddress: z.string().describe(
          "Optional. The proxy address of the APN.",
        ).optional(),
        proxyPort: z.number().int().describe(
          "Optional. The proxy port of the APN. A value of 0 (default) means not set and negative values are rejected.",
        ).optional(),
        roamingProtocol: z.enum([
          "PROTOCOL_UNSPECIFIED",
          "IP",
          "IPV4V6",
          "IPV6",
          "NON_IP",
          "PPP",
          "UNSTRUCTURED",
        ]).describe(
          "Optional. The protocol to use to connect to this APN while the device is roaming.",
        ).optional(),
        username: z.string().describe("Optional. APN username of the APN.")
          .optional(),
      })).describe(
        "Optional. APN settings for override APNs. There must not be any conflict between any of APN settings provided, otherwise the policy will be rejected. Two ApnSettings are considered to conflict when all of the following fields match on both: numericOperatorId, apn, proxyAddress, proxyPort, mmsProxyAddress, mmsProxyPort, mmsc, mvnoType, protocol, roamingProtocol. If some of the APN settings result in non-compliance of INVALID_VALUE, they will be ignored. This can be set on fully managed devices on Android 10 and above. This can also be set on work profiles on Android 13 and above and only with ApnSetting's with ENTERPRISE APN type. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 10. A NonComplianceDetail with MANAGEMENT_MODE is reported for work profiles on Android versions less than 13.",
      ).optional(),
      overrideApns: z.enum([
        "OVERRIDE_APNS_UNSPECIFIED",
        "OVERRIDE_APNS_DISABLED",
        "OVERRIDE_APNS_ENABLED",
      ]).describe(
        "Optional. Whether override APNs are disabled or enabled. See DevicePolicyManager.setOverrideApnsEnabled (https://developer.android.com/reference/android/app/admin/DevicePolicyManager#setOverrideApnsEnabled) for more details.",
      ).optional(),
    }).describe(
      "Optional. Access Point Name (APN) policy. Configuration for Access Point Names (APNs) which may override any other APNs on the device. See OVERRIDE_APNS_ENABLED and overrideApns for details.",
    ).optional(),
    bluetoothSharing: z.enum([
      "BLUETOOTH_SHARING_UNSPECIFIED",
      "BLUETOOTH_SHARING_ALLOWED",
      "BLUETOOTH_SHARING_DISALLOWED",
    ]).describe("Optional. Controls whether Bluetooth sharing is allowed.")
      .optional(),
    configureWifi: z.enum([
      "CONFIGURE_WIFI_UNSPECIFIED",
      "ALLOW_CONFIGURING_WIFI",
      "DISALLOW_ADD_WIFI_CONFIG",
      "DISALLOW_CONFIGURING_WIFI",
    ]).describe(
      "Controls Wi-Fi configuring privileges. Based on the option set, user will have either full or limited or no control in configuring Wi-Fi networks.",
    ).optional(),
    preferentialNetworkServiceSettings: z.object({
      defaultPreferentialNetworkId: z.enum([
        "PREFERENTIAL_NETWORK_ID_UNSPECIFIED",
        "NO_PREFERENTIAL_NETWORK",
        "PREFERENTIAL_NETWORK_ID_ONE",
        "PREFERENTIAL_NETWORK_ID_TWO",
        "PREFERENTIAL_NETWORK_ID_THREE",
        "PREFERENTIAL_NETWORK_ID_FOUR",
        "PREFERENTIAL_NETWORK_ID_FIVE",
      ]).describe(
        "Required. Default preferential network ID for the applications that are not in applications or if ApplicationPolicy.preferentialNetworkId is set to PREFERENTIAL_NETWORK_ID_UNSPECIFIED. There must be a configuration for the specified network ID in preferentialNetworkServiceConfigs, unless this is set to NO_PREFERENTIAL_NETWORK. If set to PREFERENTIAL_NETWORK_ID_UNSPECIFIED or unset, this defaults to NO_PREFERENTIAL_NETWORK. Note: If the default preferential network is misconfigured, applications with no ApplicationPolicy.preferentialNetworkId set are not able to access the internet. This setting does not apply to the following critical apps: com.google.android.apps.work.clouddpc com.google.android.gmsApplicationPolicy.preferentialNetworkId can still be used to configure the preferential network for them.",
      ).optional(),
      preferentialNetworkServiceConfigs: z.array(z.object({
        fallbackToDefaultConnection: z.enum([
          "FALLBACK_TO_DEFAULT_CONNECTION_UNSPECIFIED",
          "FALLBACK_TO_DEFAULT_CONNECTION_ALLOWED",
          "FALLBACK_TO_DEFAULT_CONNECTION_DISALLOWED",
        ]).describe(
          "Optional. Whether fallback to the device-wide default network is allowed. If this is set to FALLBACK_TO_DEFAULT_CONNECTION_ALLOWED, then nonMatchingNetworks must not be set to NON_MATCHING_NETWORKS_DISALLOWED, the policy will be rejected otherwise. Note: If this is set to FALLBACK_TO_DEFAULT_CONNECTION_DISALLOWED, applications are not able to access the internet if the 5G slice is not available.",
        ).optional(),
        nonMatchingNetworks: z.enum([
          "NON_MATCHING_NETWORKS_UNSPECIFIED",
          "NON_MATCHING_NETWORKS_ALLOWED",
          "NON_MATCHING_NETWORKS_DISALLOWED",
        ]).describe(
          "Optional. Whether apps this configuration applies to are blocked from using networks other than the preferential service. If this is set to NON_MATCHING_NETWORKS_DISALLOWED, then fallbackToDefaultConnection must be set to FALLBACK_TO_DEFAULT_CONNECTION_DISALLOWED.",
        ).optional(),
        preferentialNetworkId: z.enum([
          "PREFERENTIAL_NETWORK_ID_UNSPECIFIED",
          "NO_PREFERENTIAL_NETWORK",
          "PREFERENTIAL_NETWORK_ID_ONE",
          "PREFERENTIAL_NETWORK_ID_TWO",
          "PREFERENTIAL_NETWORK_ID_THREE",
          "PREFERENTIAL_NETWORK_ID_FOUR",
          "PREFERENTIAL_NETWORK_ID_FIVE",
        ]).describe(
          "Required. Preferential network identifier. This must not be set to NO_PREFERENTIAL_NETWORK or PREFERENTIAL_NETWORK_ID_UNSPECIFIED, the policy will be rejected otherwise.",
        ).optional(),
      })).describe(
        "Required. Preferential network service configurations which enables having multiple enterprise slices. There must not be multiple configurations with the same preferentialNetworkId. If a configuration is not referenced by any application by setting ApplicationPolicy.preferentialNetworkId or by setting defaultPreferentialNetworkId, it will be ignored. For devices on 4G networks, enterprise APN needs to be configured additionally to set up data call for preferential network service. These APNs can be added using apnPolicy.",
      ).optional(),
    }).describe(
      "Optional. Preferential network service configuration. Setting this field will override preferentialNetworkService. This can be set on both work profiles and fully managed devices on Android 13 and above. See 5G network slicing (https://developers.google.com/android/management/5g-network-slicing) guide for more details.",
    ).optional(),
    privateDnsSettings: z.object({
      privateDnsHost: z.string().describe(
        "Optional. The hostname of the DNS server. This must be set if and only if private_dns_mode is set to PRIVATE_DNS_SPECIFIED_HOST. Supported on Android 10 and above on fully managed devices. A NonComplianceDetail with MANAGEMENT_MODE is reported on other management modes. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 10. A NonComplianceDetail with PENDING is reported if the device is not connected to a network. A NonComplianceDetail with nonComplianceReason INVALID_VALUE and specificNonComplianceReason PRIVATE_DNS_HOST_NOT_SERVING is reported if the specified host is not a DNS server or not supported on Android. A NonComplianceDetail with INVALID_VALUE is reported if applying this setting fails for any other reason.",
      ).optional(),
      privateDnsMode: z.enum([
        "PRIVATE_DNS_MODE_UNSPECIFIED",
        "PRIVATE_DNS_USER_CHOICE",
        "PRIVATE_DNS_AUTOMATIC",
        "PRIVATE_DNS_SPECIFIED_HOST",
      ]).describe(
        "Optional. The configuration mode for device's global private DNS settings. If this is set to PRIVATE_DNS_SPECIFIED_HOST, then private_dns_host must be set.",
      ).optional(),
    }).describe("Optional. The global private DNS settings.").optional(),
    tetheringSettings: z.enum([
      "TETHERING_SETTINGS_UNSPECIFIED",
      "ALLOW_ALL_TETHERING",
      "DISALLOW_WIFI_TETHERING",
      "DISALLOW_ALL_TETHERING",
    ]).describe(
      "Controls tethering settings. Based on the value set, the user is partially or fully disallowed from using different forms of tethering.",
    ).optional(),
    usbDataAccess: z.enum([
      "USB_DATA_ACCESS_UNSPECIFIED",
      "ALLOW_USB_DATA_TRANSFER",
      "DISALLOW_USB_FILE_TRANSFER",
      "DISALLOW_USB_DATA_TRANSFER",
    ]).describe(
      "Controls what files and/or data can be transferred via USB. Supported only on company-owned devices.",
    ).optional(),
    wifiDirectSettings: z.enum([
      "WIFI_DIRECT_SETTINGS_UNSPECIFIED",
      "ALLOW_WIFI_DIRECT",
      "DISALLOW_WIFI_DIRECT",
    ]).describe(
      "Controls configuring and using Wi-Fi direct settings. Supported on company-owned devices running Android 13 and above.",
    ).optional(),
    wifiRoamingPolicy: z.object({
      wifiRoamingSettings: z.array(z.object({
        wifiRoamingMode: z.enum([
          "WIFI_ROAMING_MODE_UNSPECIFIED",
          "WIFI_ROAMING_DISABLED",
          "WIFI_ROAMING_DEFAULT",
          "WIFI_ROAMING_AGGRESSIVE",
        ]).describe("Required. Wi-Fi roaming mode for the specified SSID.")
          .optional(),
        wifiSsid: z.string().describe("Required. SSID of the Wi-Fi network.")
          .optional(),
      })).describe(
        "Optional. Wi-Fi roaming settings. SSIDs provided in this list must be unique, the policy will be rejected otherwise.",
      ).optional(),
    }).describe("Optional. Wi-Fi roaming policy.").optional(),
    wifiSsidPolicy: z.object({
      wifiSsidPolicyType: z.enum([
        "WIFI_SSID_POLICY_TYPE_UNSPECIFIED",
        "WIFI_SSID_DENYLIST",
        "WIFI_SSID_ALLOWLIST",
      ]).describe("Type of the Wi-Fi SSID policy to be applied.").optional(),
      wifiSsids: z.array(z.object({
        wifiSsid: z.string().describe(
          "Required. Wi-Fi SSID represented as a string.",
        ).optional(),
      })).describe(
        "Optional. List of Wi-Fi SSIDs that should be applied in the policy. This field must be non-empty when WifiSsidPolicyType is set to WIFI_SSID_ALLOWLIST. If this is set to a non-empty list, then a NonComplianceDetail detail with API_LEVEL is reported if the Android version is less than 13 and a NonComplianceDetail with MANAGEMENT_MODE is reported for non-company-owned devices.",
      ).optional(),
    }).describe(
      "Restrictions on which Wi-Fi SSIDs the device can connect to. Note that this does not affect which networks can be configured on the device. Supported on company-owned devices running Android 13 and above.",
    ).optional(),
  }).describe(
    "Covers controls for device connectivity such as Wi-Fi, USB data access, keyboard/mouse connections, and more.",
  ).optional(),
  deviceOwnerLockScreenInfo: z.object({
    defaultMessage: z.string().describe(
      "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
    ).optional(),
    localizedMessages: z.record(z.string(), z.string()).describe(
      "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
    ).optional(),
  }).describe("The device owner information to be shown on the lock screen.")
    .optional(),
  deviceRadioState: z.object({
    airplaneModeState: z.enum([
      "AIRPLANE_MODE_STATE_UNSPECIFIED",
      "AIRPLANE_MODE_USER_CHOICE",
      "AIRPLANE_MODE_DISABLED",
    ]).describe(
      "Optional. Controls whether airplane mode can be toggled by the user or not.",
    ).optional(),
    cellularTwoGState: z.enum([
      "CELLULAR_TWO_G_STATE_UNSPECIFIED",
      "CELLULAR_TWO_G_USER_CHOICE",
      "CELLULAR_TWO_G_DISABLED",
    ]).describe(
      "Optional. Controls whether cellular 2G setting can be toggled by the user or not.",
    ).optional(),
    minimumWifiSecurityLevel: z.enum([
      "MINIMUM_WIFI_SECURITY_LEVEL_UNSPECIFIED",
      "OPEN_NETWORK_SECURITY",
      "PERSONAL_NETWORK_SECURITY",
      "ENTERPRISE_NETWORK_SECURITY",
      "ENTERPRISE_BIT192_NETWORK_SECURITY",
    ]).describe(
      "Optional. The minimum required security level of Wi-Fi networks that the device can connect to.",
    ).optional(),
    ultraWidebandState: z.enum([
      "ULTRA_WIDEBAND_STATE_UNSPECIFIED",
      "ULTRA_WIDEBAND_USER_CHOICE",
      "ULTRA_WIDEBAND_DISABLED",
    ]).describe(
      "Optional. Controls the state of the ultra wideband setting and whether the user can toggle it on or off.",
    ).optional(),
    userInitiatedAddEsimSettings: z.enum([
      "USER_INITIATED_ADD_ESIM_SETTINGS_UNSPECIFIED",
      "USER_INITIATED_ADD_ESIM_ALLOWED",
      "USER_INITIATED_ADD_ESIM_DISALLOWED",
    ]).describe(
      "Optional. Controls whether the user is allowed to add eSIM profiles.",
    ).optional(),
    wifiState: z.enum([
      "WIFI_STATE_UNSPECIFIED",
      "WIFI_STATE_USER_CHOICE",
      "WIFI_ENABLED",
      "WIFI_DISABLED",
    ]).describe(
      "Optional. Controls current state of Wi-Fi and if user can change its state.",
    ).optional(),
  }).describe(
    "Optional. Covers controls for radio state such as Wi-Fi, bluetooth, and more.",
  ).optional(),
  displaySettings: z.object({
    screenBrightnessSettings: z.object({
      screenBrightness: z.number().int().describe(
        "Optional. The screen brightness between 1 and 255 where 1 is the lowest and 255 is the highest brightness. A value of 0 (default) means no screen brightness set. Any other value is rejected. screenBrightnessMode must be either BRIGHTNESS_AUTOMATIC or BRIGHTNESS_FIXED to set this. Supported on Android 9 and above on fully managed devices. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 9. Supported on work profiles on company-owned devices on Android 15 and above.",
      ).optional(),
      screenBrightnessMode: z.enum([
        "SCREEN_BRIGHTNESS_MODE_UNSPECIFIED",
        "BRIGHTNESS_USER_CHOICE",
        "BRIGHTNESS_AUTOMATIC",
        "BRIGHTNESS_FIXED",
      ]).describe("Optional. Controls the screen brightness mode.").optional(),
    }).describe("Optional. Controls the screen brightness settings.")
      .optional(),
    screenTimeoutSettings: z.object({
      screenTimeout: z.string().describe(
        "Optional. Controls the screen timeout duration. The screen timeout duration must be greater than 0, otherwise it is rejected. Additionally, it should not be greater than maximumTimeToLock, otherwise the screen timeout is set to maximumTimeToLock and a NonComplianceDetail with INVALID_VALUE reason and SCREEN_TIMEOUT_GREATER_THAN_MAXIMUM_TIME_TO_LOCK specific reason is reported. If the screen timeout is less than a certain lower bound, it is set to the lower bound. The lower bound may vary across devices. If this is set, screenTimeoutMode must be SCREEN_TIMEOUT_ENFORCED. Supported on Android 9 and above on fully managed devices. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 9. Supported on work profiles on company-owned devices on Android 15 and above.",
      ).optional(),
      screenTimeoutMode: z.enum([
        "SCREEN_TIMEOUT_MODE_UNSPECIFIED",
        "SCREEN_TIMEOUT_USER_CHOICE",
        "SCREEN_TIMEOUT_ENFORCED",
      ]).describe(
        "Optional. Controls whether the user is allowed to configure the screen timeout.",
      ).optional(),
    }).describe("Optional. Controls the screen timeout settings.").optional(),
  }).describe("Optional. Controls for the display settings.").optional(),
  encryptionPolicy: z.enum([
    "ENCRYPTION_POLICY_UNSPECIFIED",
    "ENABLED_WITHOUT_PASSWORD",
    "ENABLED_WITH_PASSWORD",
  ]).describe("Whether encryption is enabled").optional(),
  enterpriseDisplayNameVisibility: z.enum([
    "ENTERPRISE_DISPLAY_NAME_VISIBILITY_UNSPECIFIED",
    "ENTERPRISE_DISPLAY_NAME_VISIBLE",
    "ENTERPRISE_DISPLAY_NAME_HIDDEN",
  ]).describe(
    "Optional. Controls whether the enterpriseDisplayName is visible on the device (e.g. lock screen message on company-owned devices).",
  ).optional(),
  factoryResetDisabled: z.boolean().describe(
    "Whether factory resetting from settings is disabled.",
  ).optional(),
  frpAdminEmails: z.array(z.string()).describe(
    "Email addresses of device administrators for factory reset protection. When the device is factory reset, it will require one of these admins to log in with the Google account email and password to unlock the device. If no admins are specified, the device won't provide factory reset protection.",
  ).optional(),
  funDisabled: z.boolean().describe(
    "Whether the user is allowed to have fun. Controls whether the Easter egg game in Settings is disabled.",
  ).optional(),
  installAppsDisabled: z.boolean().describe(
    "Whether user installation of apps is disabled.",
  ).optional(),
  keyguardDisabled: z.boolean().describe(
    "If true, this disables the Lock Screen (https://source.android.com/docs/core/display/multi_display/lock-screen) for primary and/or secondary displays. This policy is supported only in dedicated device management mode.",
  ).optional(),
  keyguardDisabledFeatures: z.array(
    z.enum([
      "KEYGUARD_DISABLED_FEATURE_UNSPECIFIED",
      "CAMERA",
      "NOTIFICATIONS",
      "UNREDACTED_NOTIFICATIONS",
      "TRUST_AGENTS",
      "DISABLE_FINGERPRINT",
      "DISABLE_REMOTE_INPUT",
      "FACE",
      "IRIS",
      "BIOMETRICS",
      "SHORTCUTS",
      "ALL_FEATURES",
    ]),
  ).describe("Disabled keyguard customizations, such as widgets.").optional(),
  kioskCustomLauncherEnabled: z.boolean().describe(
    "Whether the kiosk custom launcher is enabled. This replaces the home screen with a launcher that locks down the device to the apps installed via the applications setting. Apps appear on a single page in alphabetical order. Use kioskCustomization to further configure the kiosk device behavior.",
  ).optional(),
  kioskCustomization: z.object({
    deviceSettings: z.enum([
      "DEVICE_SETTINGS_UNSPECIFIED",
      "SETTINGS_ACCESS_ALLOWED",
      "SETTINGS_ACCESS_BLOCKED",
    ]).describe("Specifies whether the Settings app is allowed in kiosk mode.")
      .optional(),
    powerButtonActions: z.enum([
      "POWER_BUTTON_ACTIONS_UNSPECIFIED",
      "POWER_BUTTON_AVAILABLE",
      "POWER_BUTTON_BLOCKED",
    ]).describe(
      "Sets the behavior of a device in kiosk mode when a user presses and holds (long-presses) the Power button.",
    ).optional(),
    statusBar: z.enum([
      "STATUS_BAR_UNSPECIFIED",
      "NOTIFICATIONS_AND_SYSTEM_INFO_ENABLED",
      "NOTIFICATIONS_AND_SYSTEM_INFO_DISABLED",
      "SYSTEM_INFO_ONLY",
    ]).describe(
      "Specifies whether system info and notifications are disabled in kiosk mode.",
    ).optional(),
    systemErrorWarnings: z.enum([
      "SYSTEM_ERROR_WARNINGS_UNSPECIFIED",
      "ERROR_AND_WARNINGS_ENABLED",
      "ERROR_AND_WARNINGS_MUTED",
    ]).describe(
      'Specifies whether system error dialogs for crashed or unresponsive apps are blocked in kiosk mode. When blocked, the system will force-stop the app as if the user chooses the "close app" option on the UI.',
    ).optional(),
    systemNavigation: z.enum([
      "SYSTEM_NAVIGATION_UNSPECIFIED",
      "NAVIGATION_ENABLED",
      "NAVIGATION_DISABLED",
      "HOME_BUTTON_ONLY",
    ]).describe(
      "Specifies which navigation features are enabled (e.g. Home, Overview buttons) in kiosk mode.",
    ).optional(),
  }).describe(
    "Settings controlling the behavior of a device in kiosk mode. To enable kiosk mode, set kioskCustomLauncherEnabled to true or specify an app in the policy with installType KIOSK.",
  ).optional(),
  locationMode: z.enum([
    "LOCATION_MODE_UNSPECIFIED",
    "HIGH_ACCURACY",
    "SENSORS_ONLY",
    "BATTERY_SAVING",
    "OFF",
    "LOCATION_USER_CHOICE",
    "LOCATION_ENFORCED",
    "LOCATION_DISABLED",
  ]).describe("The degree of location detection enabled.").optional(),
  longSupportMessage: z.object({
    defaultMessage: z.string().describe(
      "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
    ).optional(),
    localizedMessages: z.record(z.string(), z.string()).describe(
      "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
    ).optional(),
  }).describe(
    "A message displayed to the user in the device administators settings screen.",
  ).optional(),
  maximumTimeToLock: z.string().describe(
    "Maximum time in milliseconds for user activity until the device locks. A value of 0 means there is no restriction.",
  ).optional(),
  microphoneAccess: z.enum([
    "MICROPHONE_ACCESS_UNSPECIFIED",
    "MICROPHONE_ACCESS_USER_CHOICE",
    "MICROPHONE_ACCESS_DISABLED",
    "MICROPHONE_ACCESS_ENFORCED",
  ]).describe(
    "Controls the use of the microphone and whether the user has access to the microphone access toggle. This applies only on fully managed devices.",
  ).optional(),
  minimumApiLevel: z.number().int().describe(
    "The minimum allowed Android API level.",
  ).optional(),
  mobileNetworksConfigDisabled: z.boolean().describe(
    "Whether configuring mobile networks is disabled.",
  ).optional(),
  modifyAccountsDisabled: z.boolean().describe(
    "Whether adding or removing accounts is disabled.",
  ).optional(),
  mountPhysicalMediaDisabled: z.boolean().describe(
    "Whether the user mounting physical external media is disabled.",
  ).optional(),
  name: z.string().describe(
    "The name of the policy in the form enterprises/{enterpriseId}/policies/{policyId}.",
  ).optional(),
  networkEscapeHatchEnabled: z.boolean().describe(
    "Whether the network escape hatch is enabled. If a network connection can't be made at boot time, the escape hatch prompts the user to temporarily connect to a network in order to refresh the device policy. After applying policy, the temporary network will be forgotten and the device will continue booting. This prevents being unable to connect to a network if there is no suitable network in the last policy and the device boots into an app in lock task mode, or the user is otherwise unable to reach device settings.Note: Setting wifiConfigDisabled to true will override this setting under specific circumstances. Please see wifiConfigDisabled for further details. Setting configureWifi to DISALLOW_CONFIGURING_WIFI will override this setting under specific circumstances. Please see DISALLOW_CONFIGURING_WIFI for further details.",
  ).optional(),
  networkResetDisabled: z.boolean().describe(
    "Whether resetting network settings is disabled. This applies only on fully managed devices. A NonComplianceDetail with MANAGEMENT_MODE is reported for other management modes.",
  ).optional(),
  oncCertificateProviders: z.array(z.object({
    certificateReferences: z.array(z.string()).describe(
      "This feature is not generally available.",
    ).optional(),
    contentProviderEndpoint: z.object({
      packageName: z.string().describe(
        "This feature is not generally available.",
      ).optional(),
      signingCertsSha256: z.array(z.string()).describe(
        "Required. This feature is not generally available.",
      ).optional(),
      uri: z.string().describe("This feature is not generally available.")
        .optional(),
    }).describe("This feature is not generally available.").optional(),
  })).describe("This feature is not generally available.").optional(),
  openNetworkConfiguration: z.record(z.string(), z.string()).describe(
    "Network configuration for the device. See configure networks for more information.",
  ).optional(),
  outgoingBeamDisabled: z.boolean().describe(
    "Whether using NFC to beam data from apps is disabled.",
  ).optional(),
  outgoingCallsDisabled: z.boolean().describe(
    "Whether outgoing calls are disabled.",
  ).optional(),
  passwordPolicies: z.array(z.object({
    maximumFailedPasswordsForWipe: z.number().int().describe(
      "Number of incorrect device-unlock passwords that can be entered before a device is wiped. A value of 0 means there is no restriction.",
    ).optional(),
    passwordExpirationTimeout: z.string().describe(
      "Password expiration timeout.",
    ).optional(),
    passwordHistoryLength: z.number().int().describe(
      "The length of the password history. After setting this field, the user won't be able to enter a new password that is the same as any password in the history. A value of 0 means there is no restriction.",
    ).optional(),
    passwordMinimumLength: z.number().int().describe(
      "The minimum allowed password length. A value of 0 means there is no restriction. Only enforced when password_quality is NUMERIC, NUMERIC_COMPLEX, ALPHABETIC, ALPHANUMERIC, or COMPLEX.",
    ).optional(),
    passwordMinimumLetters: z.number().int().describe(
      "Minimum number of letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumLowerCase: z.number().int().describe(
      "Minimum number of lower case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNonLetter: z.number().int().describe(
      "Minimum number of non-letter characters (numerical digits or symbols) required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNumeric: z.number().int().describe(
      "Minimum number of numerical digits required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumSymbols: z.number().int().describe(
      "Minimum number of symbols required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumUpperCase: z.number().int().describe(
      "Minimum number of upper case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordQuality: z.enum([
      "PASSWORD_QUALITY_UNSPECIFIED",
      "BIOMETRIC_WEAK",
      "SOMETHING",
      "NUMERIC",
      "NUMERIC_COMPLEX",
      "ALPHABETIC",
      "ALPHANUMERIC",
      "COMPLEX",
      "COMPLEXITY_LOW",
      "COMPLEXITY_MEDIUM",
      "COMPLEXITY_HIGH",
    ]).describe("The required password quality.").optional(),
    passwordScope: z.enum([
      "SCOPE_UNSPECIFIED",
      "SCOPE_DEVICE",
      "SCOPE_PROFILE",
    ]).describe("The scope that the password requirement applies to.")
      .optional(),
    requirePasswordUnlock: z.enum([
      "REQUIRE_PASSWORD_UNLOCK_UNSPECIFIED",
      "USE_DEFAULT_DEVICE_TIMEOUT",
      "REQUIRE_EVERY_DAY",
    ]).describe(
      "The length of time after a device or work profile is unlocked using a strong form of authentication (password, PIN, pattern) that it can be unlocked using any other authentication method (e.g. fingerprint, trust agents, face). After the specified time period elapses, only strong forms of authentication can be used to unlock the device or work profile.",
    ).optional(),
    unifiedLockSettings: z.enum([
      "UNIFIED_LOCK_SETTINGS_UNSPECIFIED",
      "ALLOW_UNIFIED_WORK_AND_PERSONAL_LOCK",
      "REQUIRE_SEPARATE_WORK_LOCK",
    ]).describe(
      "Controls whether a unified lock is allowed for the device and the work profile, on devices running Android 9 and above with a work profile. This can be set only if password_scope is set to SCOPE_PROFILE, the policy will be rejected otherwise. If user has not set a separate work lock and this field is set to REQUIRE_SEPARATE_WORK_LOCK, a NonComplianceDetail is reported with nonComplianceReason set to USER_ACTION.",
    ).optional(),
  })).describe(
    "Password requirement policies. Different policies can be set for work profile or fully managed devices by setting the password_scope field in the policy.",
  ).optional(),
  passwordRequirements: z.object({
    maximumFailedPasswordsForWipe: z.number().int().describe(
      "Number of incorrect device-unlock passwords that can be entered before a device is wiped. A value of 0 means there is no restriction.",
    ).optional(),
    passwordExpirationTimeout: z.string().describe(
      "Password expiration timeout.",
    ).optional(),
    passwordHistoryLength: z.number().int().describe(
      "The length of the password history. After setting this field, the user won't be able to enter a new password that is the same as any password in the history. A value of 0 means there is no restriction.",
    ).optional(),
    passwordMinimumLength: z.number().int().describe(
      "The minimum allowed password length. A value of 0 means there is no restriction. Only enforced when password_quality is NUMERIC, NUMERIC_COMPLEX, ALPHABETIC, ALPHANUMERIC, or COMPLEX.",
    ).optional(),
    passwordMinimumLetters: z.number().int().describe(
      "Minimum number of letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumLowerCase: z.number().int().describe(
      "Minimum number of lower case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNonLetter: z.number().int().describe(
      "Minimum number of non-letter characters (numerical digits or symbols) required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNumeric: z.number().int().describe(
      "Minimum number of numerical digits required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumSymbols: z.number().int().describe(
      "Minimum number of symbols required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumUpperCase: z.number().int().describe(
      "Minimum number of upper case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordQuality: z.enum([
      "PASSWORD_QUALITY_UNSPECIFIED",
      "BIOMETRIC_WEAK",
      "SOMETHING",
      "NUMERIC",
      "NUMERIC_COMPLEX",
      "ALPHABETIC",
      "ALPHANUMERIC",
      "COMPLEX",
      "COMPLEXITY_LOW",
      "COMPLEXITY_MEDIUM",
      "COMPLEXITY_HIGH",
    ]).describe("The required password quality.").optional(),
    passwordScope: z.enum([
      "SCOPE_UNSPECIFIED",
      "SCOPE_DEVICE",
      "SCOPE_PROFILE",
    ]).describe("The scope that the password requirement applies to.")
      .optional(),
    requirePasswordUnlock: z.enum([
      "REQUIRE_PASSWORD_UNLOCK_UNSPECIFIED",
      "USE_DEFAULT_DEVICE_TIMEOUT",
      "REQUIRE_EVERY_DAY",
    ]).describe(
      "The length of time after a device or work profile is unlocked using a strong form of authentication (password, PIN, pattern) that it can be unlocked using any other authentication method (e.g. fingerprint, trust agents, face). After the specified time period elapses, only strong forms of authentication can be used to unlock the device or work profile.",
    ).optional(),
    unifiedLockSettings: z.enum([
      "UNIFIED_LOCK_SETTINGS_UNSPECIFIED",
      "ALLOW_UNIFIED_WORK_AND_PERSONAL_LOCK",
      "REQUIRE_SEPARATE_WORK_LOCK",
    ]).describe(
      "Controls whether a unified lock is allowed for the device and the work profile, on devices running Android 9 and above with a work profile. This can be set only if password_scope is set to SCOPE_PROFILE, the policy will be rejected otherwise. If user has not set a separate work lock and this field is set to REQUIRE_SEPARATE_WORK_LOCK, a NonComplianceDetail is reported with nonComplianceReason set to USER_ACTION.",
    ).optional(),
  }).describe(
    "Password requirements. The field password_requirements.require_password_unlock must not be set. DEPRECATED - Use passwordPolicies.Note:Complexity-based values of PasswordQuality, that is, COMPLEXITY_LOW, COMPLEXITY_MEDIUM, and COMPLEXITY_HIGH, cannot be used here. unified_lock_settings cannot be used here.",
  ).optional(),
  permissionGrants: z.array(z.object({
    permission: z.string().describe(
      "The Android permission or group, e.g. android.permission.READ_CALENDAR or android.permission_group.CALENDAR.",
    ).optional(),
    policy: z.enum(["PERMISSION_POLICY_UNSPECIFIED", "PROMPT", "GRANT", "DENY"])
      .describe("The policy for granting the permission.").optional(),
  })).describe(
    "Explicit permission or group grants or denials for all apps. These values override the default_permission_policy.",
  ).optional(),
  permittedAccessibilityServices: z.object({
    packageNames: z.array(z.string()).describe("A list of package names.")
      .optional(),
  }).describe(
    "Specifies permitted accessibility services. If the field is not set, any accessibility service can be used. If the field is set, only the accessibility services in this list and the system's built-in accessibility service can be used. In particular, if the field is set to empty, only the system's built-in accessibility servicess can be used. This can be set on fully managed devices and on work profiles. When applied to a work profile, this affects both the personal profile and the work profile.",
  ).optional(),
  permittedInputMethods: z.object({
    packageNames: z.array(z.string()).describe("A list of package names.")
      .optional(),
  }).describe(
    "If present, only the input methods provided by packages in this list are permitted. If this field is present, but the list is empty, then only system input methods are permitted.",
  ).optional(),
  persistentPreferredActivities: z.array(z.object({
    actions: z.array(z.string()).describe(
      "The intent actions to match in the filter. If any actions are included in the filter, then an intent's action must be one of those values for it to match. If no actions are included, the intent action is ignored.",
    ).optional(),
    categories: z.array(z.string()).describe(
      "The intent categories to match in the filter. An intent includes the categories that it requires, all of which must be included in the filter in order to match. In other words, adding a category to the filter has no impact on matching unless that category is specified in the intent.",
    ).optional(),
    receiverActivity: z.string().describe(
      "The activity that should be the default intent handler. This should be an Android component name, e.g. com.android.enterprise.app/.MainActivity. Alternatively, the value may be the package name of an app, which causes Android Device Policy to choose an appropriate activity from the app to handle the intent.",
    ).optional(),
  })).describe(
    "Default intent handler activities.Warning: Do not configure this and default_application_settings for the same intent domain, such as web browsing. Setting both for the same intent domain can lead to unpredictable behavior.",
  ).optional(),
  personalUsagePolicies: z.object({
    accountTypesWithManagementDisabled: z.array(z.string()).describe(
      "Account types that can't be managed by the user.",
    ).optional(),
    bluetoothSharing: z.enum([
      "BLUETOOTH_SHARING_UNSPECIFIED",
      "BLUETOOTH_SHARING_ALLOWED",
      "BLUETOOTH_SHARING_DISALLOWED",
    ]).describe("Optional. Whether bluetooth sharing is allowed.").optional(),
    cameraDisabled: z.boolean().describe(
      "If true, the camera is disabled on the personal profile.",
    ).optional(),
    maxDaysWithWorkOff: z.number().int().describe(
      "Controls how long the work profile can stay off. The minimum duration must be at least 3 days. Other details are as follows: - If the duration is set to 0, the feature is turned off. - If the duration is set to a value smaller than the minimum duration, the feature returns an error. *Note:* If you want to avoid personal profiles being suspended during long periods of off-time, you can temporarily set a large value for this parameter.",
    ).optional(),
    personalApplications: z.array(z.object({
      installType: z.enum(["INSTALL_TYPE_UNSPECIFIED", "BLOCKED", "AVAILABLE"])
        .describe("The type of installation to perform.").optional(),
      packageName: z.string().describe("The package name of the application.")
        .optional(),
    })).describe("Policy applied to applications in the personal profile.")
      .optional(),
    personalPlayStoreMode: z.enum([
      "PLAY_STORE_MODE_UNSPECIFIED",
      "BLACKLIST",
      "BLOCKLIST",
      "ALLOWLIST",
    ]).describe(
      "Used together with personalApplications to control how apps in the personal profile are allowed or blocked.",
    ).optional(),
    privateSpacePolicy: z.enum([
      "PRIVATE_SPACE_POLICY_UNSPECIFIED",
      "PRIVATE_SPACE_ALLOWED",
      "PRIVATE_SPACE_DISALLOWED",
    ]).describe(
      "Optional. Controls whether a private space is allowed on the device.",
    ).optional(),
    screenCaptureDisabled: z.boolean().describe(
      "If true, screen capture is disabled for all users. This also blocks Circle to Search (https://support.google.com/android/answer/14508957).",
    ).optional(),
  }).describe("Policies managing personal usage on a company-owned device.")
    .optional(),
  playStoreMode: z.enum([
    "PLAY_STORE_MODE_UNSPECIFIED",
    "WHITELIST",
    "BLACKLIST",
  ]).describe(
    "This mode controls which apps are available to the user in the Play Store and the behavior on the device when apps are removed from the policy.",
  ).optional(),
  policyEnforcementRules: z.array(z.object({
    blockAction: z.object({
      blockAfterDays: z.number().int().describe(
        "Number of days the policy is non-compliant before the device or work profile is blocked. To block access immediately, set to 0. blockAfterDays must be less than wipeAfterDays.",
      ).optional(),
      blockScope: z.enum([
        "BLOCK_SCOPE_UNSPECIFIED",
        "BLOCK_SCOPE_WORK_PROFILE",
        "BLOCK_SCOPE_DEVICE",
      ]).describe(
        "Specifies the scope of this BlockAction. Only applicable to devices that are company-owned.",
      ).optional(),
    }).describe(
      "An action to block access to apps and data on a company owned device or in a work profile. This action also triggers a user-facing notification with information (where possible) on how to correct the compliance issue. Note: wipeAction must also be specified.",
    ).optional(),
    settingName: z.string().describe(
      "The top-level policy to enforce. For example, applications or passwordPolicies.",
    ).optional(),
    wipeAction: z.object({
      preserveFrp: z.boolean().describe(
        "Whether the factory-reset protection data is preserved on the device. This setting applies to fully managed devices and work profiles on company-owned devices.",
      ).optional(),
      wipeAfterDays: z.number().int().describe(
        "Number of days the policy is non-compliant before the device or work profile is wiped. wipeAfterDays must be greater than blockAfterDays.",
      ).optional(),
    }).describe(
      "An action to reset a company owned device or delete a work profile. Note: blockAction must also be specified.",
    ).optional(),
  })).describe(
    "Rules that define the behavior when a particular policy can not be applied on device",
  ).optional(),
  preferentialNetworkService: z.enum([
    "PREFERENTIAL_NETWORK_SERVICE_UNSPECIFIED",
    "PREFERENTIAL_NETWORK_SERVICE_DISABLED",
    "PREFERENTIAL_NETWORK_SERVICE_ENABLED",
  ]).describe(
    "Controls whether preferential network service is enabled on the work profile or on fully managed devices. For example, an organization may have an agreement with a carrier that all of the work data from its employees' devices will be sent via a network service dedicated for enterprise use. An example of a supported preferential network service is the enterprise slice on 5G networks. This policy has no effect if preferentialNetworkServiceSettings or ApplicationPolicy.preferentialNetworkId is set on devices running Android 13 or above.",
  ).optional(),
  printingPolicy: z.enum([
    "PRINTING_POLICY_UNSPECIFIED",
    "PRINTING_DISALLOWED",
    "PRINTING_ALLOWED",
  ]).describe(
    "Optional. Controls whether printing is allowed. This is supported on devices running Android 9 and above..",
  ).optional(),
  privateKeySelectionEnabled: z.boolean().describe(
    "Allows showing UI on a device for a user to choose a private key alias if there are no matching rules in ChoosePrivateKeyRules. For devices below Android P, setting this may leave enterprise keys vulnerable. This value will have no effect if any application has CERT_SELECTION delegation scope.",
  ).optional(),
  recommendedGlobalProxy: z.object({
    excludedHosts: z.array(z.string()).describe(
      "For a direct proxy, the hosts for which the proxy is bypassed. The host names may contain wildcards such as *.example.com.",
    ).optional(),
    host: z.string().describe("The host of the direct proxy.").optional(),
    pacUri: z.string().describe(
      "The URI of the PAC script used to configure the proxy.",
    ).optional(),
    port: z.number().int().describe("The port of the direct proxy.").optional(),
  }).describe(
    "The network-independent global HTTP proxy. Typically proxies should be configured per-network in open_network_configuration. However for unusual configurations like general internal filtering a global HTTP proxy may be useful. If the proxy is not accessible, network access may break. The global proxy is only a recommendation and some apps may ignore it.",
  ).optional(),
  removeUserDisabled: z.boolean().describe(
    "Whether removing other users is disabled.",
  ).optional(),
  screenCaptureDisabled: z.boolean().describe(
    "Whether screen capture is disabled. This also blocks Circle to Search (https://support.google.com/android/answer/14508957).",
  ).optional(),
  setUserIconDisabled: z.boolean().describe(
    "Whether changing the user icon is disabled. This applies only on devices running Android 7 and above.",
  ).optional(),
  setWallpaperDisabled: z.boolean().describe(
    "Whether changing the wallpaper is disabled.",
  ).optional(),
  setupActions: z.array(z.object({
    description: z.object({
      defaultMessage: z.string().describe(
        "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
      ).optional(),
      localizedMessages: z.record(z.string(), z.string()).describe(
        "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
      ).optional(),
    }).describe("Description of this action.").optional(),
    launchApp: z.object({
      packageName: z.string().describe("Package name of app to be launched")
        .optional(),
    }).describe(
      "An action to launch an app. The app will be launched with an intent containing an extra with key com.google.android.apps.work.clouddpc.EXTRA_LAUNCHED_AS_SETUP_ACTION set to the boolean value true to indicate that this is a setup action flow. If SetupAction references an app, the corresponding installType in the application policy must be set as REQUIRED_FOR_SETUP or said setup will fail.",
    ).optional(),
    title: z.object({
      defaultMessage: z.string().describe(
        "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
      ).optional(),
      localizedMessages: z.record(z.string(), z.string()).describe(
        "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
      ).optional(),
    }).describe("Title of this action.").optional(),
  })).describe(
    "Action to take during the setup process. At most one action may be specified.",
  ).optional(),
  shareLocationDisabled: z.boolean().describe(
    "Whether location sharing is disabled.",
  ).optional(),
  shortSupportMessage: z.object({
    defaultMessage: z.string().describe(
      "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
    ).optional(),
    localizedMessages: z.record(z.string(), z.string()).describe(
      "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
    ).optional(),
  }).describe(
    "A message displayed to the user in the settings screen wherever functionality has been disabled by the admin. If the message is longer than 200 characters it may be truncated.",
  ).optional(),
  skipFirstUseHintsEnabled: z.boolean().describe(
    "Flag to skip hints on the first use. Enterprise admin can enable the system recommendation for apps to skip their user tutorial and other introductory hints on first start-up.",
  ).optional(),
  smsDisabled: z.boolean().describe(
    "Whether sending and receiving SMS messages is disabled.",
  ).optional(),
  statusReportingSettings: z.object({
    applicationReportingSettings: z.object({
      includeRemovedApps: z.boolean().describe(
        "Whether removed apps are included in application reports.",
      ).optional(),
    }).describe(
      "Application reporting settings. Only applicable if application_reports_enabled is true.",
    ).optional(),
    applicationReportsEnabled: z.boolean().describe(
      "Whether app reports are enabled.",
    ).optional(),
    commonCriteriaModeEnabled: z.boolean().describe(
      "Whether Common Criteria Mode reporting is enabled. This is supported only on company-owned devices.",
    ).optional(),
    defaultApplicationInfoReportingEnabled: z.boolean().describe(
      "Optional. Whether defaultApplicationInfo reporting is enabled.",
    ).optional(),
    deviceSettingsEnabled: z.boolean().describe(
      "Whether device settings reporting is enabled.",
    ).optional(),
    displayInfoEnabled: z.boolean().describe(
      "Whether displays reporting is enabled. Report data is not available for personally owned devices with work profiles.",
    ).optional(),
    hardwareStatusEnabled: z.boolean().describe(
      "Whether hardware status reporting is enabled. Report data is not available for personally owned devices with work profiles.",
    ).optional(),
    memoryInfoEnabled: z.boolean().describe(
      "Whether memory event reporting is enabled.",
    ).optional(),
    networkInfoEnabled: z.boolean().describe(
      "Whether network info reporting is enabled.",
    ).optional(),
    powerManagementEventsEnabled: z.boolean().describe(
      "Whether power management event reporting is enabled. Report data is not available for personally owned devices with work profiles.",
    ).optional(),
    softwareInfoEnabled: z.boolean().describe(
      "Whether software info reporting is enabled.",
    ).optional(),
    systemPropertiesEnabled: z.boolean().describe(
      "Whether system properties reporting is enabled.",
    ).optional(),
  }).describe("Status reporting settings").optional(),
  stayOnPluggedModes: z.array(
    z.enum(["BATTERY_PLUGGED_MODE_UNSPECIFIED", "AC", "USB", "WIRELESS"]),
  ).describe(
    "The battery plugged in modes for which the device stays on. When using this setting, it is recommended to clear maximum_time_to_lock so that the device doesn't lock itself while it stays on.",
  ).optional(),
  systemUpdate: z.object({
    endMinutes: z.number().int().describe(
      "If the type is WINDOWED, the end of the maintenance window, measured as the number of minutes after midnight in device's local time. This value must be between 0 and 1439, inclusive. If this value is less than start_minutes, then the maintenance window spans midnight. If the maintenance window specified is smaller than 30 minutes, the actual window is extended to 30 minutes beyond the start time.",
    ).optional(),
    freezePeriods: z.array(z.object({
      endDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        'The end date (inclusive) of the freeze period. Must be no later than 90 days from the start date. If the end date is earlier than the start date, the freeze period is considered wrapping year-end. Note: day and month must be set. year should not be set as it is not used. For example, {"month": 1,"date": 30}.',
      ).optional(),
      startDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        'The start date (inclusive) of the freeze period. Note: day and month must be set. year should not be set as it is not used. For example, {"month": 1,"date": 30}.',
      ).optional(),
    })).describe(
      "An annually repeating time period in which over-the-air (OTA) system updates are postponed to freeze the OS version running on a device. To prevent freezing the device indefinitely, each freeze period must be separated by at least 60 days.",
    ).optional(),
    startMinutes: z.number().int().describe(
      "If the type is WINDOWED, the start of the maintenance window, measured as the number of minutes after midnight in the device's local time. This value must be between 0 and 1439, inclusive.",
    ).optional(),
    type: z.enum([
      "SYSTEM_UPDATE_TYPE_UNSPECIFIED",
      "AUTOMATIC",
      "WINDOWED",
      "POSTPONE",
    ]).describe("The type of system update to configure.").optional(),
  }).describe(
    "The system update policy, which controls how OS updates are applied. If the update type is WINDOWED, the update window will automatically apply to Play app updates as well.Note: Google Play system updates (https://source.android.com/docs/core/ota/modular-system) (also called Mainline updates) are automatically downloaded and require a device reboot to be installed. Refer to the mainline section in Manage system updates (https://developer.android.com/work/dpc/system-updates#mainline) for further details.",
  ).optional(),
  uninstallAppsDisabled: z.boolean().describe(
    "Whether user uninstallation of applications is disabled. This prevents apps from being uninstalled, even those removed using applications",
  ).optional(),
  usageLog: z.object({
    enabledLogTypes: z.array(
      z.enum([
        "LOG_TYPE_UNSPECIFIED",
        "SECURITY_LOGS",
        "NETWORK_ACTIVITY_LOGS",
      ]),
    ).describe(
      "Specifies which log types are enabled. Note that users will receive on-device messaging when usage logging is enabled.",
    ).optional(),
    uploadOnCellularAllowed: z.array(
      z.enum([
        "LOG_TYPE_UNSPECIFIED",
        "SECURITY_LOGS",
        "NETWORK_ACTIVITY_LOGS",
      ]),
    ).describe(
      "Specifies which of the enabled log types can be uploaded over mobile data. By default logs are queued for upload when the device connects to WiFi.",
    ).optional(),
  }).describe("Configuration of device activity logging.").optional(),
  version: z.string().describe(
    "The version of the policy. This is a read-only field. The version is incremented each time the policy is updated.",
  ).optional(),
  vpnConfigDisabled: z.boolean().describe(
    "Whether configuring VPN is disabled.",
  ).optional(),
  wipeDataFlags: z.array(z.enum(["WIPE_DATA_FLAG_UNSPECIFIED", "WIPE_ESIMS"]))
    .describe(
      "Optional. Wipe flags to indicate what data is wiped when a device or profile wipe is triggered due to any reason (for example, non-compliance). This does not apply to the enterprises.devices.delete method.. This list must not have duplicates.",
    ).optional(),
  workAccountSetupConfig: z.object({
    authenticationType: z.enum([
      "AUTHENTICATION_TYPE_UNSPECIFIED",
      "AUTHENTICATION_TYPE_NOT_ENFORCED",
      "GOOGLE_AUTHENTICATED",
    ]).describe("Optional. The authentication type of the user on the device.")
      .optional(),
    requiredAccountEmail: z.string().describe(
      "Optional. The specific google work account email address to be added. This field is only relevant if authenticationType is GOOGLE_AUTHENTICATED. This must be an enterprise account and not a consumer account. Once set and a Google authenticated account is added to the device, changing this field will have no effect, and thus recommended to be set only once. The email address must be all lowercase.",
    ).optional(),
  }).describe(
    "Optional. Controls the work account setup configuration, such as details of whether a Google authenticated account is required.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  accountTypesWithManagementDisabled: z.array(z.string()).optional(),
  addUserDisabled: z.boolean().optional(),
  adjustVolumeDisabled: z.boolean().optional(),
  advancedSecurityOverrides: z.object({
    commonCriteriaMode: z.string(),
    contentProtectionPolicy: z.string(),
    developerSettings: z.string(),
    googlePlayProtectVerifyApps: z.string(),
    mtePolicy: z.string(),
    personalAppsThatCanReadWorkNotifications: z.array(z.string()),
    untrustedAppsPolicy: z.string(),
  }).optional(),
  alwaysOnVpnPackage: z.object({
    lockdownEnabled: z.boolean(),
    packageName: z.string(),
  }).optional(),
  androidDevicePolicyTracks: z.array(z.string()).optional(),
  appAutoUpdatePolicy: z.string().optional(),
  appFunctions: z.string().optional(),
  applications: z.array(z.object({
    accessibleTrackIds: z.array(z.string()),
    alwaysOnVpnLockdownExemption: z.string(),
    autoUpdateMode: z.string(),
    connectedWorkAndPersonalApp: z.string(),
    credentialProviderPolicy: z.string(),
    customAppConfig: z.object({
      userUninstallSettings: z.string(),
    }),
    defaultPermissionPolicy: z.string(),
    delegatedScopes: z.array(z.string()),
    disabled: z.boolean(),
    extensionConfig: z.object({
      notificationReceiver: z.string(),
      signingKeyFingerprintsSha256: z.array(z.string()),
    }),
    installConstraint: z.array(z.object({
      chargingConstraint: z.string(),
      deviceIdleConstraint: z.string(),
      networkTypeConstraint: z.string(),
    })),
    installPriority: z.number(),
    installType: z.string(),
    lockTaskAllowed: z.boolean(),
    managedConfiguration: z.record(z.string(), z.unknown()),
    managedConfigurationTemplate: z.object({
      configurationVariables: z.record(z.string(), z.unknown()),
      templateId: z.string(),
    }),
    minimumVersionCode: z.number(),
    packageName: z.string(),
    permissionGrants: z.array(z.object({
      permission: z.string(),
      policy: z.string(),
    })),
    preferentialNetworkId: z.string(),
    roles: z.array(z.object({
      roleType: z.string(),
    })),
    signingKeyCerts: z.array(z.object({
      signingKeyCertFingerprintSha256: z.string(),
    })),
    userControlSettings: z.string(),
    workProfileWidgets: z.string(),
  })).optional(),
  assistContentPolicy: z.string().optional(),
  autoDateAndTimeZone: z.string().optional(),
  autoTimeRequired: z.boolean().optional(),
  autofillPolicy: z.string().optional(),
  backupService: z.string().optional(),
  blockApplicationsEnabled: z.boolean().optional(),
  bluetoothConfigDisabled: z.boolean().optional(),
  bluetoothContactSharingDisabled: z.boolean().optional(),
  bluetoothDisabled: z.boolean().optional(),
  cameraAccess: z.string().optional(),
  cameraDisabled: z.boolean().optional(),
  cellBroadcastsConfigDisabled: z.boolean().optional(),
  choosePrivateKeyRules: z.array(z.object({
    packageNames: z.array(z.string()),
    privateKeyAlias: z.string(),
    urlPattern: z.string(),
  })).optional(),
  complianceRules: z.array(z.object({
    apiLevelCondition: z.object({
      minApiLevel: z.number(),
    }),
    disableApps: z.boolean(),
    nonComplianceDetailCondition: z.object({
      nonComplianceReason: z.string(),
      packageName: z.string(),
      settingName: z.string(),
    }),
    packageNamesToDisable: z.array(z.string()),
  })).optional(),
  createWindowsDisabled: z.boolean().optional(),
  credentialProviderPolicyDefault: z.string().optional(),
  credentialsConfigDisabled: z.boolean().optional(),
  crossDevicePolicies: z.object({
    nearbyAppStreaming: z.string(),
    nearbyNotificationStreaming: z.string(),
  }).optional(),
  crossProfilePolicies: z.object({
    crossProfileAppFunctions: z.string(),
    crossProfileCopyPaste: z.string(),
    crossProfileDataSharing: z.string(),
    exemptionsToShowWorkContactsInPersonalProfile: z.object({
      packageNames: z.array(z.string()),
    }),
    showWorkContactsInPersonalProfile: z.string(),
    workProfileWidgetsDefault: z.string(),
  }).optional(),
  dataRoamingDisabled: z.boolean().optional(),
  debuggingFeaturesAllowed: z.boolean().optional(),
  defaultApplicationSettings: z.array(z.object({
    defaultApplicationScopes: z.array(z.string()),
    defaultApplicationType: z.string(),
    defaultApplications: z.array(z.object({
      packageName: z.string(),
    })),
  })).optional(),
  defaultPermissionPolicy: z.string().optional(),
  deviceConnectivityManagement: z.object({
    apnPolicy: z.object({
      apnSettings: z.array(z.object({
        alwaysOnSetting: z.string(),
        apn: z.string(),
        apnTypes: z.array(z.unknown()),
        authType: z.string(),
        carrierId: z.number(),
        displayName: z.string(),
        mmsProxyAddress: z.string(),
        mmsProxyPort: z.number(),
        mmsc: z.string(),
        mtuV4: z.number(),
        mtuV6: z.number(),
        mvnoType: z.string(),
        networkTypes: z.array(z.unknown()),
        numericOperatorId: z.string(),
        password: z.string(),
        protocol: z.string(),
        proxyAddress: z.string(),
        proxyPort: z.number(),
        roamingProtocol: z.string(),
        username: z.string(),
      })),
      overrideApns: z.string(),
    }),
    bluetoothSharing: z.string(),
    configureWifi: z.string(),
    preferentialNetworkServiceSettings: z.object({
      defaultPreferentialNetworkId: z.string(),
      preferentialNetworkServiceConfigs: z.array(z.object({
        fallbackToDefaultConnection: z.string(),
        nonMatchingNetworks: z.string(),
        preferentialNetworkId: z.string(),
      })),
    }),
    privateDnsSettings: z.object({
      privateDnsHost: z.string(),
      privateDnsMode: z.string(),
    }),
    tetheringSettings: z.string(),
    usbDataAccess: z.string(),
    wifiDirectSettings: z.string(),
    wifiRoamingPolicy: z.object({
      wifiRoamingSettings: z.array(z.object({
        wifiRoamingMode: z.string(),
        wifiSsid: z.string(),
      })),
    }),
    wifiSsidPolicy: z.object({
      wifiSsidPolicyType: z.string(),
      wifiSsids: z.array(z.object({
        wifiSsid: z.string(),
      })),
    }),
  }).optional(),
  deviceOwnerLockScreenInfo: z.object({
    defaultMessage: z.string(),
    localizedMessages: z.record(z.string(), z.unknown()),
  }).optional(),
  deviceRadioState: z.object({
    airplaneModeState: z.string(),
    cellularTwoGState: z.string(),
    minimumWifiSecurityLevel: z.string(),
    ultraWidebandState: z.string(),
    userInitiatedAddEsimSettings: z.string(),
    wifiState: z.string(),
  }).optional(),
  displaySettings: z.object({
    screenBrightnessSettings: z.object({
      screenBrightness: z.number(),
      screenBrightnessMode: z.string(),
    }),
    screenTimeoutSettings: z.object({
      screenTimeout: z.string(),
      screenTimeoutMode: z.string(),
    }),
  }).optional(),
  encryptionPolicy: z.string().optional(),
  ensureVerifyAppsEnabled: z.boolean().optional(),
  enterpriseDisplayNameVisibility: z.string().optional(),
  factoryResetDisabled: z.boolean().optional(),
  frpAdminEmails: z.array(z.string()).optional(),
  funDisabled: z.boolean().optional(),
  installAppsDisabled: z.boolean().optional(),
  installUnknownSourcesAllowed: z.boolean().optional(),
  keyguardDisabled: z.boolean().optional(),
  keyguardDisabledFeatures: z.array(z.string()).optional(),
  kioskCustomLauncherEnabled: z.boolean().optional(),
  kioskCustomization: z.object({
    deviceSettings: z.string(),
    powerButtonActions: z.string(),
    statusBar: z.string(),
    systemErrorWarnings: z.string(),
    systemNavigation: z.string(),
  }).optional(),
  locationMode: z.string().optional(),
  longSupportMessage: z.object({
    defaultMessage: z.string(),
    localizedMessages: z.record(z.string(), z.unknown()),
  }).optional(),
  maximumTimeToLock: z.string().optional(),
  microphoneAccess: z.string().optional(),
  minimumApiLevel: z.number().optional(),
  mobileNetworksConfigDisabled: z.boolean().optional(),
  modifyAccountsDisabled: z.boolean().optional(),
  mountPhysicalMediaDisabled: z.boolean().optional(),
  name: z.string(),
  networkEscapeHatchEnabled: z.boolean().optional(),
  networkResetDisabled: z.boolean().optional(),
  oncCertificateProviders: z.array(z.object({
    certificateReferences: z.array(z.string()),
    contentProviderEndpoint: z.object({
      packageName: z.string(),
      signingCertsSha256: z.array(z.string()),
      uri: z.string(),
    }),
  })).optional(),
  openNetworkConfiguration: z.record(z.string(), z.unknown()).optional(),
  outgoingBeamDisabled: z.boolean().optional(),
  outgoingCallsDisabled: z.boolean().optional(),
  passwordPolicies: z.array(z.object({
    maximumFailedPasswordsForWipe: z.number(),
    passwordExpirationTimeout: z.string(),
    passwordHistoryLength: z.number(),
    passwordMinimumLength: z.number(),
    passwordMinimumLetters: z.number(),
    passwordMinimumLowerCase: z.number(),
    passwordMinimumNonLetter: z.number(),
    passwordMinimumNumeric: z.number(),
    passwordMinimumSymbols: z.number(),
    passwordMinimumUpperCase: z.number(),
    passwordQuality: z.string(),
    passwordScope: z.string(),
    requirePasswordUnlock: z.string(),
    unifiedLockSettings: z.string(),
  })).optional(),
  passwordRequirements: z.object({
    maximumFailedPasswordsForWipe: z.number(),
    passwordExpirationTimeout: z.string(),
    passwordHistoryLength: z.number(),
    passwordMinimumLength: z.number(),
    passwordMinimumLetters: z.number(),
    passwordMinimumLowerCase: z.number(),
    passwordMinimumNonLetter: z.number(),
    passwordMinimumNumeric: z.number(),
    passwordMinimumSymbols: z.number(),
    passwordMinimumUpperCase: z.number(),
    passwordQuality: z.string(),
    passwordScope: z.string(),
    requirePasswordUnlock: z.string(),
    unifiedLockSettings: z.string(),
  }).optional(),
  permissionGrants: z.array(z.object({
    permission: z.string(),
    policy: z.string(),
  })).optional(),
  permittedAccessibilityServices: z.object({
    packageNames: z.array(z.string()),
  }).optional(),
  permittedInputMethods: z.object({
    packageNames: z.array(z.string()),
  }).optional(),
  persistentPreferredActivities: z.array(z.object({
    actions: z.array(z.string()),
    categories: z.array(z.string()),
    receiverActivity: z.string(),
  })).optional(),
  personalUsagePolicies: z.object({
    accountTypesWithManagementDisabled: z.array(z.string()),
    bluetoothSharing: z.string(),
    cameraDisabled: z.boolean(),
    maxDaysWithWorkOff: z.number(),
    personalApplications: z.array(z.object({
      installType: z.string(),
      packageName: z.string(),
    })),
    personalPlayStoreMode: z.string(),
    privateSpacePolicy: z.string(),
    screenCaptureDisabled: z.boolean(),
  }).optional(),
  playStoreMode: z.string().optional(),
  policyEnforcementRules: z.array(z.object({
    blockAction: z.object({
      blockAfterDays: z.number(),
      blockScope: z.string(),
    }),
    settingName: z.string(),
    wipeAction: z.object({
      preserveFrp: z.boolean(),
      wipeAfterDays: z.number(),
    }),
  })).optional(),
  preferentialNetworkService: z.string().optional(),
  printingPolicy: z.string().optional(),
  privateKeySelectionEnabled: z.boolean().optional(),
  recommendedGlobalProxy: z.object({
    excludedHosts: z.array(z.string()),
    host: z.string(),
    pacUri: z.string(),
    port: z.number(),
  }).optional(),
  removeUserDisabled: z.boolean().optional(),
  safeBootDisabled: z.boolean().optional(),
  screenCaptureDisabled: z.boolean().optional(),
  setUserIconDisabled: z.boolean().optional(),
  setWallpaperDisabled: z.boolean().optional(),
  setupActions: z.array(z.object({
    description: z.object({
      defaultMessage: z.string(),
      localizedMessages: z.record(z.string(), z.unknown()),
    }),
    launchApp: z.object({
      packageName: z.string(),
    }),
    title: z.object({
      defaultMessage: z.string(),
      localizedMessages: z.record(z.string(), z.unknown()),
    }),
  })).optional(),
  shareLocationDisabled: z.boolean().optional(),
  shortSupportMessage: z.object({
    defaultMessage: z.string(),
    localizedMessages: z.record(z.string(), z.unknown()),
  }).optional(),
  skipFirstUseHintsEnabled: z.boolean().optional(),
  smsDisabled: z.boolean().optional(),
  statusBarDisabled: z.boolean().optional(),
  statusReportingSettings: z.object({
    applicationReportingSettings: z.object({
      includeRemovedApps: z.boolean(),
    }),
    applicationReportsEnabled: z.boolean(),
    commonCriteriaModeEnabled: z.boolean(),
    defaultApplicationInfoReportingEnabled: z.boolean(),
    deviceSettingsEnabled: z.boolean(),
    displayInfoEnabled: z.boolean(),
    hardwareStatusEnabled: z.boolean(),
    memoryInfoEnabled: z.boolean(),
    networkInfoEnabled: z.boolean(),
    powerManagementEventsEnabled: z.boolean(),
    softwareInfoEnabled: z.boolean(),
    systemPropertiesEnabled: z.boolean(),
  }).optional(),
  stayOnPluggedModes: z.array(z.string()).optional(),
  systemUpdate: z.object({
    endMinutes: z.number(),
    freezePeriods: z.array(z.object({
      endDate: z.object({
        day: z.number(),
        month: z.number(),
        year: z.number(),
      }),
      startDate: z.object({
        day: z.number(),
        month: z.number(),
        year: z.number(),
      }),
    })),
    startMinutes: z.number(),
    type: z.string(),
  }).optional(),
  tetheringConfigDisabled: z.boolean().optional(),
  uninstallAppsDisabled: z.boolean().optional(),
  unmuteMicrophoneDisabled: z.boolean().optional(),
  usageLog: z.object({
    enabledLogTypes: z.array(z.string()),
    uploadOnCellularAllowed: z.array(z.string()),
  }).optional(),
  usbFileTransferDisabled: z.boolean().optional(),
  usbMassStorageEnabled: z.boolean().optional(),
  version: z.string().optional(),
  vpnConfigDisabled: z.boolean().optional(),
  wifiConfigDisabled: z.boolean().optional(),
  wifiConfigsLockdownEnabled: z.boolean().optional(),
  wipeDataFlags: z.array(z.string()).optional(),
  workAccountSetupConfig: z.object({
    authenticationType: z.string(),
    requiredAccountEmail: z.string(),
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
  accountTypesWithManagementDisabled: z.array(z.string()).describe(
    "Account types that can't be managed by the user.",
  ).optional(),
  addUserDisabled: z.boolean().describe(
    "Whether adding new users and profiles is disabled. For devices where managementMode is DEVICE_OWNER this field is ignored and the user is never allowed to add or remove users.",
  ).optional(),
  adjustVolumeDisabled: z.boolean().describe(
    "Whether adjusting the master volume is disabled. Also mutes the device. The setting has effect only on fully managed devices.",
  ).optional(),
  advancedSecurityOverrides: z.object({
    commonCriteriaMode: z.enum([
      "COMMON_CRITERIA_MODE_UNSPECIFIED",
      "COMMON_CRITERIA_MODE_DISABLED",
      "COMMON_CRITERIA_MODE_ENABLED",
    ]).describe(
      "Controls Common Criteria Mode—security standards defined in the Common Criteria for Information Technology Security Evaluation (https://www.commoncriteriaportal.org/) (CC). Enabling Common Criteria Mode increases certain security components on a device, see CommonCriteriaMode for details.Warning: Common Criteria Mode enforces a strict security model typically only required for IT products used in national security systems and other highly sensitive organizations. Standard device use may be affected. Only enabled if required. If Common Criteria Mode is turned off after being enabled previously, all user-configured Wi-Fi networks may be lost and any enterprise-configured Wi-Fi networks that require user input may need to be reconfigured.",
    ).optional(),
    contentProtectionPolicy: z.enum([
      "CONTENT_PROTECTION_POLICY_UNSPECIFIED",
      "CONTENT_PROTECTION_DISABLED",
      "CONTENT_PROTECTION_ENFORCED",
      "CONTENT_PROTECTION_USER_CHOICE",
    ]).describe(
      "Optional. Controls whether content protection, which scans for deceptive apps, is enabled. This is supported on Android 15 and above.",
    ).optional(),
    developerSettings: z.enum([
      "DEVELOPER_SETTINGS_UNSPECIFIED",
      "DEVELOPER_SETTINGS_DISABLED",
      "DEVELOPER_SETTINGS_ALLOWED",
    ]).describe(
      "Controls access to developer settings: developer options and safe boot. Replaces safeBootDisabled (deprecated) and debuggingFeaturesAllowed (deprecated). On personally-owned devices with a work profile, setting this policy will not disable safe boot. In this case, a NonComplianceDetail with MANAGEMENT_MODE is reported.",
    ).optional(),
    googlePlayProtectVerifyApps: z.enum([
      "GOOGLE_PLAY_PROTECT_VERIFY_APPS_UNSPECIFIED",
      "VERIFY_APPS_ENFORCED",
      "VERIFY_APPS_USER_CHOICE",
    ]).describe(
      "Whether Google Play Protect verification (https://support.google.com/accounts/answer/2812853) is enforced. Replaces ensureVerifyAppsEnabled (deprecated).",
    ).optional(),
    mtePolicy: z.enum([
      "MTE_POLICY_UNSPECIFIED",
      "MTE_USER_CHOICE",
      "MTE_ENFORCED",
      "MTE_DISABLED",
    ]).describe(
      "Optional. Controls Memory Tagging Extension (MTE) (https://source.android.com/docs/security/test/memory-safety/arm-mte) on the device. The device needs to be rebooted to apply changes to the MTE policy. On Android 15 and above, a NonComplianceDetail with PENDING is reported if the policy change is pending a device reboot.",
    ).optional(),
    personalAppsThatCanReadWorkNotifications: z.array(z.string()).describe(
      "Personal apps that can read work profile notifications using a NotificationListenerService (https://developer.android.com/reference/android/service/notification/NotificationListenerService). By default, no personal apps (aside from system apps) can read work notifications. Each value in the list must be a package name.",
    ).optional(),
    untrustedAppsPolicy: z.enum([
      "UNTRUSTED_APPS_POLICY_UNSPECIFIED",
      "DISALLOW_INSTALL",
      "ALLOW_INSTALL_IN_PERSONAL_PROFILE_ONLY",
      "ALLOW_INSTALL_DEVICE_WIDE",
    ]).describe(
      "The policy for untrusted apps (apps from unknown sources) enforced on the device. Replaces install_unknown_sources_allowed (deprecated).",
    ).optional(),
  }).describe(
    "Advanced security settings. In most cases, setting these is not needed.",
  ).optional(),
  alwaysOnVpnPackage: z.object({
    lockdownEnabled: z.boolean().describe(
      "Disallows networking when the VPN is not connected.",
    ).optional(),
    packageName: z.string().describe("The package name of the VPN app.")
      .optional(),
  }).describe(
    "Configuration for an always-on VPN connection. Use with vpn_config_disabled to prevent modification of this setting.",
  ).optional(),
  appAutoUpdatePolicy: z.enum([
    "APP_AUTO_UPDATE_POLICY_UNSPECIFIED",
    "CHOICE_TO_THE_USER",
    "NEVER",
    "WIFI_ONLY",
    "ALWAYS",
  ]).describe(
    "Recommended alternative: autoUpdateMode which is set per app, provides greater flexibility around update frequency.When autoUpdateMode is set to AUTO_UPDATE_POSTPONED or AUTO_UPDATE_HIGH_PRIORITY, this field has no effect.The app auto update policy, which controls when automatic app updates can be applied.",
  ).optional(),
  appFunctions: z.enum([
    "APP_FUNCTIONS_UNSPECIFIED",
    "APP_FUNCTIONS_DISALLOWED",
    "APP_FUNCTIONS_ALLOWED",
  ]).describe(
    "Optional. Controls whether apps on the device for fully managed devices or in the work profile for devices with work profiles are allowed to expose app functions.",
  ).optional(),
  applications: z.array(z.object({
    accessibleTrackIds: z.array(z.string()).describe(
      "List of the app’s track IDs that a device belonging to the enterprise can access. If the list contains multiple track IDs, devices receive the latest version among all accessible tracks. If the list contains no track IDs, devices only have access to the app’s production track. More details about each track are available in AppTrackInfo.",
    ).optional(),
    alwaysOnVpnLockdownExemption: z.enum([
      "ALWAYS_ON_VPN_LOCKDOWN_EXEMPTION_UNSPECIFIED",
      "VPN_LOCKDOWN_ENFORCED",
      "VPN_LOCKDOWN_EXEMPTION",
    ]).describe(
      "Specifies whether the app is allowed networking when the VPN is not connected and alwaysOnVpnPackage.lockdownEnabled is enabled. If set to VPN_LOCKDOWN_ENFORCED, the app is not allowed networking, and if set to VPN_LOCKDOWN_EXEMPTION, the app is allowed networking. Only supported on devices running Android 10 and above. If this is not supported by the device, the device will contain a NonComplianceDetail with non_compliance_reason set to API_LEVEL and a fieldPath. If this is not applicable to the app, the device will contain a NonComplianceDetail with non_compliance_reason set to UNSUPPORTED and a fieldPath. The fieldPath is set to applications[i].alwaysOnVpnLockdownExemption, where i is the index of the package in the applications policy.",
    ).optional(),
    autoUpdateMode: z.enum([
      "AUTO_UPDATE_MODE_UNSPECIFIED",
      "AUTO_UPDATE_DEFAULT",
      "AUTO_UPDATE_POSTPONED",
      "AUTO_UPDATE_HIGH_PRIORITY",
    ]).describe("Controls the auto-update mode for the app.").optional(),
    connectedWorkAndPersonalApp: z.enum([
      "CONNECTED_WORK_AND_PERSONAL_APP_UNSPECIFIED",
      "CONNECTED_WORK_AND_PERSONAL_APP_DISALLOWED",
      "CONNECTED_WORK_AND_PERSONAL_APP_ALLOWED",
    ]).describe(
      "Controls whether the app can communicate with itself across a device’s work and personal profiles, subject to user consent.",
    ).optional(),
    credentialProviderPolicy: z.enum([
      "CREDENTIAL_PROVIDER_POLICY_UNSPECIFIED",
      "CREDENTIAL_PROVIDER_ALLOWED",
      "CREDENTIAL_PROVIDER_DISALLOWED",
    ]).describe(
      "Optional. Whether the app is allowed to act as a credential provider on Android 14 and above.",
    ).optional(),
    customAppConfig: z.object({
      userUninstallSettings: z.enum([
        "USER_UNINSTALL_SETTINGS_UNSPECIFIED",
        "DISALLOW_UNINSTALL_BY_USER",
        "ALLOW_UNINSTALL_BY_USER",
      ]).describe("Optional. User uninstall settings of the custom app.")
        .optional(),
    }).describe(
      "Optional. Configuration for this custom app.install_type must be set to CUSTOM for this to be set.",
    ).optional(),
    defaultPermissionPolicy: z.enum([
      "PERMISSION_POLICY_UNSPECIFIED",
      "PROMPT",
      "GRANT",
      "DENY",
    ]).describe(
      "The default policy for all permissions requested by the app. If specified, this overrides the policy-level default_permission_policy which applies to all apps. It does not override the permission_grants which applies to all apps.",
    ).optional(),
    delegatedScopes: z.array(
      z.enum([
        "DELEGATED_SCOPE_UNSPECIFIED",
        "CERT_INSTALL",
        "MANAGED_CONFIGURATIONS",
        "BLOCK_UNINSTALL",
        "PERMISSION_GRANT",
        "PACKAGE_ACCESS",
        "ENABLE_SYSTEM_APP",
        "NETWORK_ACTIVITY_LOGS",
        "SECURITY_LOGS",
        "CERT_SELECTION",
      ]),
    ).describe(
      "The scopes delegated to the app from Android Device Policy. These provide additional privileges for the applications they are applied to.",
    ).optional(),
    disabled: z.boolean().describe(
      "Whether the app is disabled. When disabled, the app data is still preserved.",
    ).optional(),
    extensionConfig: z.object({
      notificationReceiver: z.string().describe(
        "Fully qualified class name of the receiver service class for Android Device Policy to notify the extension app of any local command status updates. The service must be exported in the extension app's AndroidManifest.xml and extend NotificationReceiverService (https://developers.google.com/android/management/reference/amapi/com/google/android/managementapi/notification/NotificationReceiverService) (see Integrate with the AMAPI SDK (https://developers.google.com/android/management/sdk-integration) guide for more details).",
      ).optional(),
      signingKeyFingerprintsSha256: z.array(z.string()).describe(
        "Hex-encoded SHA-256 hashes of the signing key certificates of the extension app. Only hexadecimal string representations of 64 characters are valid.The signing key certificate fingerprints are always obtained from the Play Store and this field is used to provide additional signing key certificate fingerprints. However, if the application is not available on the Play Store, this field needs to be set. A NonComplianceDetail with INVALID_VALUE is reported if this field is not set when the application is not available on the Play Store.The signing key certificate fingerprint of the extension app on the device must match one of the signing key certificate fingerprints obtained from the Play Store or the ones provided in this field for the app to be able to communicate with Android Device Policy.In production use cases, it is recommended to leave this empty.",
      ).optional(),
    }).describe(
      "Configuration to enable this app as an extension app, with the capability of interacting with Android Device Policy offline.This field can be set for at most one app. If there is any app with COMPANION_APP role, this field cannot be set.The signing key certificate fingerprint of the app on the device must match one of the entries in ApplicationPolicy.signingKeyCerts or ExtensionConfig.signingKeyFingerprintsSha256 (deprecated) or the signing key certificate fingerprints obtained from Play Store for the app to be able to communicate with Android Device Policy. If the app is not on Play Store and if ApplicationPolicy.signingKeyCerts and ExtensionConfig.signingKeyFingerprintsSha256 (deprecated) are not set, a NonComplianceDetail with INVALID_VALUE is reported.",
    ).optional(),
    installConstraint: z.array(z.object({
      chargingConstraint: z.enum([
        "CHARGING_CONSTRAINT_UNSPECIFIED",
        "CHARGING_NOT_REQUIRED",
        "INSTALL_ONLY_WHEN_CHARGING",
      ]).describe("Optional. Charging constraint.").optional(),
      deviceIdleConstraint: z.enum([
        "DEVICE_IDLE_CONSTRAINT_UNSPECIFIED",
        "DEVICE_IDLE_NOT_REQUIRED",
        "INSTALL_ONLY_WHEN_DEVICE_IDLE",
      ]).describe("Optional. Device idle constraint.").optional(),
      networkTypeConstraint: z.enum([
        "NETWORK_TYPE_CONSTRAINT_UNSPECIFIED",
        "INSTALL_ON_ANY_NETWORK",
        "INSTALL_ONLY_ON_UNMETERED_NETWORK",
      ]).describe("Optional. Network type constraint.").optional(),
    })).describe(
      "Optional. The constraints for installing the app. You can specify a maximum of one InstallConstraint. Multiple constraints are rejected.",
    ).optional(),
    installPriority: z.number().int().describe(
      "Optional. Amongst apps with installType set to: FORCE_INSTALLED PREINSTALLEDthis controls the relative priority of installation. A value of 0 (default) means this app has no priority over other apps. For values between 1 and 10,000, a lower value means a higher priority. Values outside of the range 0 to 10,000 inclusive are rejected.",
    ).optional(),
    installType: z.enum([
      "INSTALL_TYPE_UNSPECIFIED",
      "PREINSTALLED",
      "FORCE_INSTALLED",
      "BLOCKED",
      "AVAILABLE",
      "REQUIRED_FOR_SETUP",
      "KIOSK",
      "CUSTOM",
    ]).describe("The type of installation to perform.").optional(),
    lockTaskAllowed: z.boolean().describe(
      "Whether the app is allowed to lock itself in full-screen mode. DEPRECATED. Use InstallType KIOSK or kioskCustomLauncherEnabled to configure a dedicated device.",
    ).optional(),
    managedConfiguration: z.record(z.string(), z.string()).describe(
      "Managed configuration applied to the app. The format for the configuration is dictated by the ManagedProperty values supported by the app. Each field name in the managed configuration must match the key field of the ManagedProperty. The field value must be compatible with the type of the ManagedProperty: *type* *JSON value* BOOL true or false STRING string INTEGER number CHOICE string MULTISELECT array of strings HIDDEN string BUNDLE_ARRAY array of objects Note: string values cannot be longer than 65535 characters.",
    ).optional(),
    managedConfigurationTemplate: z.object({
      configurationVariables: z.record(z.string(), z.string()).describe(
        "Optional, a map containing configuration variables defined for the configuration.",
      ).optional(),
      templateId: z.string().describe(
        'The ID of the managed configurations template. This value must be a numeric string containing exactly one or more digits (for example, "123456").',
      ).optional(),
    }).describe(
      "The managed configurations template for the app, saved from the managed configurations iframe. This field is ignored if managed_configuration is set.",
    ).optional(),
    minimumVersionCode: z.number().int().describe(
      "The minimum version of the app that runs on the device. If set, the device attempts to update the app to at least this version code. If the app is not up-to-date, the device will contain a NonComplianceDetail with non_compliance_reason set to APP_NOT_UPDATED. The app must already be published to Google Play with a version code greater than or equal to this value. At most 20 apps may specify a minimum version code per policy.",
    ).optional(),
    packageName: z.string().describe(
      "The package name of the app. For example, com.google.android.youtube for the YouTube app.",
    ).optional(),
    permissionGrants: z.array(z.object({
      permission: z.string().describe(
        "The Android permission or group, e.g. android.permission.READ_CALENDAR or android.permission_group.CALENDAR.",
      ).optional(),
      policy: z.enum([
        "PERMISSION_POLICY_UNSPECIFIED",
        "PROMPT",
        "GRANT",
        "DENY",
      ]).describe("The policy for granting the permission.").optional(),
    })).describe(
      "Explicit permission grants or denials for the app. These values override the default_permission_policy and permission_grants which apply to all apps.",
    ).optional(),
    preferentialNetworkId: z.enum([
      "PREFERENTIAL_NETWORK_ID_UNSPECIFIED",
      "NO_PREFERENTIAL_NETWORK",
      "PREFERENTIAL_NETWORK_ID_ONE",
      "PREFERENTIAL_NETWORK_ID_TWO",
      "PREFERENTIAL_NETWORK_ID_THREE",
      "PREFERENTIAL_NETWORK_ID_FOUR",
      "PREFERENTIAL_NETWORK_ID_FIVE",
    ]).describe(
      "Optional. ID of the preferential network the application uses. There must be a configuration for the specified network ID in preferentialNetworkServiceConfigs. If set to PREFERENTIAL_NETWORK_ID_UNSPECIFIED, the application will use the default network ID specified in defaultPreferentialNetworkId. See the documentation of defaultPreferentialNetworkId for the list of apps excluded from this defaulting. This applies on both work profiles and fully managed devices on Android 13 and above.",
    ).optional(),
    roles: z.array(z.object({
      roleType: z.enum([
        "ROLE_TYPE_UNSPECIFIED",
        "COMPANION_APP",
        "KIOSK",
        "MOBILE_THREAT_DEFENSE_ENDPOINT_DETECTION_RESPONSE",
        "SYSTEM_HEALTH_MONITORING",
      ]).describe("Required. The type of the role an app can have.").optional(),
    })).describe(
      "Optional. Roles the app has.Apps having certain roles can be exempted from power and background execution restrictions, suspension and hibernation on Android 14 and above. The user control can also be disallowed for apps with certain roles on Android 11 and above. Refer to the documentation of each RoleType for more details.The app is notified about the roles that are set for it if the app has a notification receiver service with. The app is notified whenever its roles are updated or after the app is installed when it has nonempty list of roles. The app can use this notification to bootstrap itself after the installation. See Integrate with the AMAPI SDK (https://developers.google.com/android/management/sdk-integration) and Manage app roles (https://developers.google.com/android/management/app-roles) guides for more details on the requirements for the service.For the exemptions to be applied and the app to be notified about the roles, the signing key certificate fingerprint of the app on the device must match one of the signing key certificate fingerprints obtained from Play Store or one of the entries in ApplicationPolicy.signingKeyCerts. Otherwise, a NonComplianceDetail with APP_SIGNING_CERT_MISMATCH is reported.There must not be duplicate roles with the same roleType. Multiple apps cannot hold a role with the same roleType. A role with type ROLE_TYPE_UNSPECIFIED is not allowed.",
    ).optional(),
    signingKeyCerts: z.array(z.object({
      signingKeyCertFingerprintSha256: z.string().describe(
        "Required. The SHA-256 hash value of the signing key certificate of the app. This must be a valid SHA-256 hash value, i.e. 32 bytes.",
      ).optional(),
    })).describe(
      "Optional. Signing key certificates of the app.This field is required in the following cases: The app has installType set to CUSTOM (i.e. a custom app). The app has roles set to a nonempty list and the app does not exist on the Play Store. The app has extensionConfig set (i.e. an extension app) but ExtensionConfig.signingKeyFingerprintsSha256 (deprecated) is not set and the app does not exist on the Play Store.If this field is not set for a custom app, the policy is rejected. If it is not set when required for a non-custom app, a NonComplianceDetail with INVALID_VALUE is reported.For other cases, this field is optional and the signing key certificates obtained from Play Store are used.See following policy settings to see how this field is used: choosePrivateKeyRules ApplicationPolicy.InstallType.CUSTOM ApplicationPolicy.extensionConfig ApplicationPolicy.roles",
    ).optional(),
    userControlSettings: z.enum([
      "USER_CONTROL_SETTINGS_UNSPECIFIED",
      "USER_CONTROL_ALLOWED",
      "USER_CONTROL_DISALLOWED",
    ]).describe(
      "Optional. Specifies whether user control is permitted for the app. User control includes user actions like force-stopping and clearing app data. Certain types of apps have special treatment, see USER_CONTROL_SETTINGS_UNSPECIFIED and USER_CONTROL_ALLOWED for more details.",
    ).optional(),
    workProfileWidgets: z.enum([
      "WORK_PROFILE_WIDGETS_UNSPECIFIED",
      "WORK_PROFILE_WIDGETS_ALLOWED",
      "WORK_PROFILE_WIDGETS_DISALLOWED",
    ]).describe(
      "Specifies whether the app installed in the work profile is allowed to add widgets to the home screen.",
    ).optional(),
  })).describe("Policy applied to apps. This can have at most 3,000 elements.")
    .optional(),
  assistContentPolicy: z.enum([
    "ASSIST_CONTENT_POLICY_UNSPECIFIED",
    "ASSIST_CONTENT_DISALLOWED",
    "ASSIST_CONTENT_ALLOWED",
  ]).describe(
    "Optional. Controls whether AssistContent (https://developer.android.com/reference/android/app/assist/AssistContent) is allowed to be sent to a privileged app such as an assistant app. AssistContent includes screenshots and information about an app, such as package name. This is supported on Android 15 and above.",
  ).optional(),
  autoDateAndTimeZone: z.enum([
    "AUTO_DATE_AND_TIME_ZONE_UNSPECIFIED",
    "AUTO_DATE_AND_TIME_ZONE_USER_CHOICE",
    "AUTO_DATE_AND_TIME_ZONE_ENFORCED",
  ]).describe(
    "Whether auto date, time, and time zone are enabled on a company-owned device. If this is set, then autoTimeRequired is ignored.",
  ).optional(),
  autofillPolicy: z.enum([
    "AUTOFILL_POLICY_UNSPECIFIED",
    "AUTOFILL_USER_CHOICE",
    "AUTOFILL_DISABLED",
  ]).describe("Optional. The policy for the autofill service.").optional(),
  backupService: z.enum([
    "BACKUP_SERVICE_UNSPECIFIED",
    "BACKUP_SERVICE_DISABLED",
    "BACKUP_SERVICE_USER_CHOICE",
  ]).describe(
    "Optional. Controls whether the backup service is disabled. Supported only on fully managed devices running Android 8 and above.",
  ).optional(),
  bluetoothConfigDisabled: z.boolean().describe(
    "Whether configuring bluetooth is disabled.",
  ).optional(),
  bluetoothContactSharingDisabled: z.boolean().describe(
    "Whether bluetooth contact sharing is disabled.",
  ).optional(),
  bluetoothDisabled: z.boolean().describe(
    "Whether bluetooth is disabled. Prefer this setting over bluetooth_config_disabled because bluetooth_config_disabled can be bypassed by the user.",
  ).optional(),
  cameraAccess: z.enum([
    "CAMERA_ACCESS_UNSPECIFIED",
    "CAMERA_ACCESS_USER_CHOICE",
    "CAMERA_ACCESS_DISABLED",
    "CAMERA_ACCESS_ENFORCED",
  ]).describe(
    "Controls the use of the camera and whether the user has access to the camera access toggle.",
  ).optional(),
  cellBroadcastsConfigDisabled: z.boolean().describe(
    "Whether configuring cell broadcast is disabled.",
  ).optional(),
  choosePrivateKeyRules: z.array(z.object({
    packageNames: z.array(z.string()).describe(
      "The package names to which this rule applies. The signing key certificate fingerprint of the app is verified against the signing key certificate fingerprints provided by Play Store and ApplicationPolicy.signingKeyCerts. If no package names are specified, then the alias is provided to all apps that call KeyChain.choosePrivateKeyAlias (https://developer.android.com/reference/android/security/KeyChain#choosePrivateKeyAlias%28android.app.Activity,%20android.security.KeyChainAliasCallback,%20java.lang.String[],%20java.security.Principal[],%20java.lang.String,%20int,%20java.lang.String%29) or any overloads (but not without calling KeyChain.choosePrivateKeyAlias, even on Android 11 and above). Any app with the same Android UID as a package specified here will have access when they call KeyChain.choosePrivateKeyAlias.",
    ).optional(),
    privateKeyAlias: z.string().describe(
      "The alias of the private key to be used.",
    ).optional(),
    urlPattern: z.string().describe(
      "The URL pattern to match against the URL of the request. If not set or empty, it matches all URLs. This uses the regular expression syntax of java.util.regex.Pattern.",
    ).optional(),
  })).describe(
    "Rules for determining apps' access to private keys. See ChoosePrivateKeyRule for details. This must be empty if any application has CERT_SELECTION delegation scope.",
  ).optional(),
  createWindowsDisabled: z.boolean().describe(
    "Whether creating windows besides app windows is disabled.",
  ).optional(),
  credentialProviderPolicyDefault: z.enum([
    "CREDENTIAL_PROVIDER_POLICY_DEFAULT_UNSPECIFIED",
    "CREDENTIAL_PROVIDER_DEFAULT_DISALLOWED",
    "CREDENTIAL_PROVIDER_DEFAULT_DISALLOWED_EXCEPT_SYSTEM",
    "CREDENTIAL_PROVIDER_DEFAULT_ALLOWED",
  ]).describe(
    "Optional. Controls which apps are allowed to act as credential providers on Android 14 and above. These apps store credentials, see this (https://developer.android.com/training/sign-in/passkeys) and this (https://developer.android.com/reference/androidx/credentials/CredentialManager) for details. See also credentialProviderPolicy.",
  ).optional(),
  credentialsConfigDisabled: z.boolean().describe(
    "Whether configuring user credentials is disabled.",
  ).optional(),
  crossDevicePolicies: z.object({
    nearbyAppStreaming: z.enum([
      "NEARBY_APP_STREAMING_UNSPECIFIED",
      "NEARBY_APP_STREAMING_USER_CHOICE",
      "NEARBY_APP_STREAMING_DISABLED",
      "NEARBY_APP_STREAMING_USER_CHOICE_SAME_MANAGED_ACCOUNT",
    ]).describe(
      "Optional. Manages video streaming of apps on the device for fully managed devices or in the work profile for devices with work profiles to nearby devices. This is supported on Android 13 and above.",
    ).optional(),
    nearbyNotificationStreaming: z.enum([
      "NEARBY_NOTIFICATION_STREAMING_UNSPECIFIED",
      "NEARBY_NOTIFICATION_STREAMING_USER_CHOICE",
      "NEARBY_NOTIFICATION_STREAMING_DISABLED",
      "NEARBY_NOTIFICATION_STREAMING_USER_CHOICE_SAME_MANAGED_ACCOUNT",
    ]).describe(
      "Optional. Manages streaming of notifications from apps on the device for fully managed devices or in the work profile for devices with work profiles to nearby devices. This is supported on Android 13 and above.",
    ).optional(),
  }).describe("Optional. Policies controlling cross-device communication.")
    .optional(),
  crossProfilePolicies: z.object({
    crossProfileAppFunctions: z.enum([
      "CROSS_PROFILE_APP_FUNCTIONS_UNSPECIFIED",
      "CROSS_PROFILE_APP_FUNCTIONS_DISALLOWED",
      "CROSS_PROFILE_APP_FUNCTIONS_ALLOWED",
    ]).describe(
      "Optional. Controls whether personal profile apps can invoke app functions exposed by apps in the work profile.",
    ).optional(),
    crossProfileCopyPaste: z.enum([
      "CROSS_PROFILE_COPY_PASTE_UNSPECIFIED",
      "COPY_FROM_WORK_TO_PERSONAL_DISALLOWED",
      "CROSS_PROFILE_COPY_PASTE_ALLOWED",
    ]).describe(
      "Whether text copied from one profile (personal or work) can be pasted in the other profile.",
    ).optional(),
    crossProfileDataSharing: z.enum([
      "CROSS_PROFILE_DATA_SHARING_UNSPECIFIED",
      "CROSS_PROFILE_DATA_SHARING_DISALLOWED",
      "DATA_SHARING_FROM_WORK_TO_PERSONAL_DISALLOWED",
      "CROSS_PROFILE_DATA_SHARING_ALLOWED",
    ]).describe(
      "Whether data from one profile (personal or work) can be shared with apps in the other profile. Specifically controls simple data sharing via intents. Management of other cross-profile communication channels, such as contact search, copy/paste, or connected work & personal apps, are configured separately.",
    ).optional(),
    exemptionsToShowWorkContactsInPersonalProfile: z.object({
      packageNames: z.array(z.string()).describe("A list of package names.")
        .optional(),
    }).describe(
      "List of apps which are excluded from the ShowWorkContactsInPersonalProfile setting. For this to be set, ShowWorkContactsInPersonalProfile must be set to one of the following values: SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_ALLOWED. In this case, these exemptions act as a blocklist. SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED. In this case, these exemptions act as an allowlist. SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED_EXCEPT_SYSTEM. In this case, these exemptions act as an allowlist, in addition to the already allowlisted system apps.Supported on Android 14 and above. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 14.",
    ).optional(),
    showWorkContactsInPersonalProfile: z.enum([
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_UNSPECIFIED",
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED",
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_ALLOWED",
      "SHOW_WORK_CONTACTS_IN_PERSONAL_PROFILE_DISALLOWED_EXCEPT_SYSTEM",
    ]).describe(
      "Whether personal apps can access contacts stored in the work profile.See also exemptions_to_show_work_contacts_in_personal_profile.",
    ).optional(),
    workProfileWidgetsDefault: z.enum([
      "WORK_PROFILE_WIDGETS_DEFAULT_UNSPECIFIED",
      "WORK_PROFILE_WIDGETS_DEFAULT_ALLOWED",
      "WORK_PROFILE_WIDGETS_DEFAULT_DISALLOWED",
    ]).describe(
      "Specifies the default behaviour for work profile widgets. If the policy does not specify work_profile_widgets for a specific application, it will behave according to the value specified here.",
    ).optional(),
  }).describe("Cross-profile policies applied on the device.").optional(),
  dataRoamingDisabled: z.boolean().describe(
    "Whether roaming data services are disabled.",
  ).optional(),
  defaultApplicationSettings: z.array(z.object({
    defaultApplicationScopes: z.array(
      z.enum([
        "DEFAULT_APPLICATION_SCOPE_UNSPECIFIED",
        "SCOPE_FULLY_MANAGED",
        "SCOPE_WORK_PROFILE",
        "SCOPE_PERSONAL_PROFILE",
      ]),
    ).describe(
      "Required. The scopes to which the policy should be applied. This list must not be empty or contain duplicates.A NonComplianceDetail with MANAGEMENT_MODE reason and DEFAULT_APPLICATION_SETTING_UNSUPPORTED_SCOPES specific reason is reported if none of the specified scopes can be applied to the management mode (e.g. a fully managed device receives a policy with only SCOPE_PERSONAL_PROFILE in the list).",
    ).optional(),
    defaultApplicationType: z.enum([
      "DEFAULT_APPLICATION_TYPE_UNSPECIFIED",
      "DEFAULT_ASSISTANT",
      "DEFAULT_BROWSER",
      "DEFAULT_CALL_REDIRECTION",
      "DEFAULT_CALL_SCREENING",
      "DEFAULT_DIALER",
      "DEFAULT_HOME",
      "DEFAULT_SMS",
      "DEFAULT_WALLET",
    ]).describe("Required. The app type to set the default application.")
      .optional(),
    defaultApplications: z.array(z.object({
      packageName: z.string().describe(
        "Required. The package name that should be set as the default application. The policy is rejected if the package name is invalid.",
      ).optional(),
    })).describe(
      "Required. The list of applications that can be set as the default app for a given type. This list must not be empty or contain duplicates. The first app in the list that is installed and qualified for the defaultApplicationType (e.g. SMS app for DEFAULT_SMS) is set as the default app. The signing key certificate fingerprint of the app on the device must also match one of the signing key certificate fingerprints obtained from Play Store or one of the entries in ApplicationPolicy.signingKeyCerts in order to be set as the default.If the defaultApplicationScopes contains SCOPE_FULLY_MANAGED or SCOPE_WORK_PROFILE, the app must have an entry in applications with installType set to a value other than BLOCKED.A NonComplianceDetail with APP_NOT_INSTALLED reason and DEFAULT_APPLICATION_SETTING_FAILED_FOR_SCOPE specific reason is reported if none of the apps in the list are installed. A NonComplianceDetail with INVALID_VALUE reason and DEFAULT_APPLICATION_SETTING_FAILED_FOR_SCOPE specific reason is reported if at least one app is installed but the policy fails to apply due to other reasons (e.g. the app is not of the right type).When applying to SCOPE_PERSONAL_PROFILE on a company-owned device with a work profile, only pre-installed system apps can be set as the default. A NonComplianceDetail with INVALID_VALUE reason and DEFAULT_APPLICATION_SETTING_FAILED_FOR_SCOPE specific reason is reported if the policy fails to apply to the personal profile.",
    ).optional(),
  })).describe(
    "Optional. The default application setting for supported types. If the default application is successfully set for at least one app type on a profile, users are prevented from changing any default applications on that profile.Only one DefaultApplicationSetting is allowed for each DefaultApplicationType.Warning: Do not configure this and persistent_preferred_activities for the same intent domain, such as web browsing. Setting both for the same intent domain can lead to unpredictable behavior.See Default application settings (https://developers.google.com/android/management/default-application-settings) guide for more details.",
  ).optional(),
  defaultPermissionPolicy: z.enum([
    "PERMISSION_POLICY_UNSPECIFIED",
    "PROMPT",
    "GRANT",
    "DENY",
  ]).describe("The default permission policy for runtime permission requests.")
    .optional(),
  deviceConnectivityManagement: z.object({
    apnPolicy: z.object({
      apnSettings: z.array(z.object({
        alwaysOnSetting: z.enum([
          "ALWAYS_ON_SETTING_UNSPECIFIED",
          "NOT_ALWAYS_ON",
          "ALWAYS_ON",
        ]).describe(
          "Optional. Whether User Plane resources have to be activated during every transition from CM-IDLE mode to CM-CONNECTED state for this APN. See 3GPP TS 23.501 section 5.6.13.",
        ).optional(),
        apn: z.string().describe(
          "Required. Name of the APN. Policy will be rejected if this field is empty.",
        ).optional(),
        apnTypes: z.array(z.unknown()).describe(
          "Required. Usage categories for the APN. Policy will be rejected if this field is empty or contains APN_TYPE_UNSPECIFIED or duplicates. Multiple APN types can be set on fully managed devices. ENTERPRISE is the only allowed APN type on work profiles. A NonComplianceDetail with MANAGEMENT_MODE is reported for any other value on work profiles. APN types that are not supported on the device or management mode will be ignored. If this results in the empty list, the APN setting will be ignored, because apnTypes is a required field. A NonComplianceDetail with INVALID_VALUE is reported if none of the APN types are supported on the device or management mode.",
        ).optional(),
        authType: z.enum([
          "AUTH_TYPE_UNSPECIFIED",
          "NONE",
          "PAP",
          "CHAP",
          "PAP_OR_CHAP",
        ]).describe("Optional. Authentication type of the APN.").optional(),
        carrierId: z.number().int().describe(
          "Optional. Carrier ID for the APN. A value of 0 (default) means not set and negative values are rejected.",
        ).optional(),
        displayName: z.string().describe(
          "Required. Human-readable name that describes the APN. Policy will be rejected if this field is empty.",
        ).optional(),
        mmsProxyAddress: z.string().describe(
          "Optional. MMS (Multimedia Messaging Service) proxy address of the APN which can be an IP address or hostname (not a URL).",
        ).optional(),
        mmsProxyPort: z.number().int().describe(
          "Optional. MMS (Multimedia Messaging Service) proxy port of the APN. A value of 0 (default) means not set and negative values are rejected.",
        ).optional(),
        mmsc: z.string().describe(
          "Optional. MMSC (Multimedia Messaging Service Center) URI of the APN.",
        ).optional(),
        mtuV4: z.number().int().describe(
          "Optional. The default MTU (Maximum Transmission Unit) size in bytes of the IPv4 routes brought up by this APN setting. A value of 0 (default) means not set and negative values are rejected. Supported on Android 13 and above. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 13.",
        ).optional(),
        mtuV6: z.number().int().describe(
          "Optional. The MTU (Maximum Transmission Unit) size of the IPv6 mobile interface to which the APN connected. A value of 0 (default) means not set and negative values are rejected. Supported on Android 13 and above. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 13.",
        ).optional(),
        mvnoType: z.enum([
          "MVNO_TYPE_UNSPECIFIED",
          "GID",
          "ICCID",
          "IMSI",
          "SPN",
        ]).describe("Optional. MVNO match type for the APN.").optional(),
        networkTypes: z.array(z.unknown()).describe(
          "Optional. Radio technologies (network types) the APN may use. Policy will be rejected if this field contains NETWORK_TYPE_UNSPECIFIED or duplicates.",
        ).optional(),
        numericOperatorId: z.string().describe(
          "Optional. The numeric operator ID of the APN. Numeric operator ID is defined as MCC (Mobile Country Code) + MNC (Mobile Network Code).",
        ).optional(),
        password: z.string().describe("Optional. APN password of the APN.")
          .optional(),
        protocol: z.enum([
          "PROTOCOL_UNSPECIFIED",
          "IP",
          "IPV4V6",
          "IPV6",
          "NON_IP",
          "PPP",
          "UNSTRUCTURED",
        ]).describe("Optional. The protocol to use to connect to this APN.")
          .optional(),
        proxyAddress: z.string().describe(
          "Optional. The proxy address of the APN.",
        ).optional(),
        proxyPort: z.number().int().describe(
          "Optional. The proxy port of the APN. A value of 0 (default) means not set and negative values are rejected.",
        ).optional(),
        roamingProtocol: z.enum([
          "PROTOCOL_UNSPECIFIED",
          "IP",
          "IPV4V6",
          "IPV6",
          "NON_IP",
          "PPP",
          "UNSTRUCTURED",
        ]).describe(
          "Optional. The protocol to use to connect to this APN while the device is roaming.",
        ).optional(),
        username: z.string().describe("Optional. APN username of the APN.")
          .optional(),
      })).describe(
        "Optional. APN settings for override APNs. There must not be any conflict between any of APN settings provided, otherwise the policy will be rejected. Two ApnSettings are considered to conflict when all of the following fields match on both: numericOperatorId, apn, proxyAddress, proxyPort, mmsProxyAddress, mmsProxyPort, mmsc, mvnoType, protocol, roamingProtocol. If some of the APN settings result in non-compliance of INVALID_VALUE, they will be ignored. This can be set on fully managed devices on Android 10 and above. This can also be set on work profiles on Android 13 and above and only with ApnSetting's with ENTERPRISE APN type. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 10. A NonComplianceDetail with MANAGEMENT_MODE is reported for work profiles on Android versions less than 13.",
      ).optional(),
      overrideApns: z.enum([
        "OVERRIDE_APNS_UNSPECIFIED",
        "OVERRIDE_APNS_DISABLED",
        "OVERRIDE_APNS_ENABLED",
      ]).describe(
        "Optional. Whether override APNs are disabled or enabled. See DevicePolicyManager.setOverrideApnsEnabled (https://developer.android.com/reference/android/app/admin/DevicePolicyManager#setOverrideApnsEnabled) for more details.",
      ).optional(),
    }).describe(
      "Optional. Access Point Name (APN) policy. Configuration for Access Point Names (APNs) which may override any other APNs on the device. See OVERRIDE_APNS_ENABLED and overrideApns for details.",
    ).optional(),
    bluetoothSharing: z.enum([
      "BLUETOOTH_SHARING_UNSPECIFIED",
      "BLUETOOTH_SHARING_ALLOWED",
      "BLUETOOTH_SHARING_DISALLOWED",
    ]).describe("Optional. Controls whether Bluetooth sharing is allowed.")
      .optional(),
    configureWifi: z.enum([
      "CONFIGURE_WIFI_UNSPECIFIED",
      "ALLOW_CONFIGURING_WIFI",
      "DISALLOW_ADD_WIFI_CONFIG",
      "DISALLOW_CONFIGURING_WIFI",
    ]).describe(
      "Controls Wi-Fi configuring privileges. Based on the option set, user will have either full or limited or no control in configuring Wi-Fi networks.",
    ).optional(),
    preferentialNetworkServiceSettings: z.object({
      defaultPreferentialNetworkId: z.enum([
        "PREFERENTIAL_NETWORK_ID_UNSPECIFIED",
        "NO_PREFERENTIAL_NETWORK",
        "PREFERENTIAL_NETWORK_ID_ONE",
        "PREFERENTIAL_NETWORK_ID_TWO",
        "PREFERENTIAL_NETWORK_ID_THREE",
        "PREFERENTIAL_NETWORK_ID_FOUR",
        "PREFERENTIAL_NETWORK_ID_FIVE",
      ]).describe(
        "Required. Default preferential network ID for the applications that are not in applications or if ApplicationPolicy.preferentialNetworkId is set to PREFERENTIAL_NETWORK_ID_UNSPECIFIED. There must be a configuration for the specified network ID in preferentialNetworkServiceConfigs, unless this is set to NO_PREFERENTIAL_NETWORK. If set to PREFERENTIAL_NETWORK_ID_UNSPECIFIED or unset, this defaults to NO_PREFERENTIAL_NETWORK. Note: If the default preferential network is misconfigured, applications with no ApplicationPolicy.preferentialNetworkId set are not able to access the internet. This setting does not apply to the following critical apps: com.google.android.apps.work.clouddpc com.google.android.gmsApplicationPolicy.preferentialNetworkId can still be used to configure the preferential network for them.",
      ).optional(),
      preferentialNetworkServiceConfigs: z.array(z.object({
        fallbackToDefaultConnection: z.enum([
          "FALLBACK_TO_DEFAULT_CONNECTION_UNSPECIFIED",
          "FALLBACK_TO_DEFAULT_CONNECTION_ALLOWED",
          "FALLBACK_TO_DEFAULT_CONNECTION_DISALLOWED",
        ]).describe(
          "Optional. Whether fallback to the device-wide default network is allowed. If this is set to FALLBACK_TO_DEFAULT_CONNECTION_ALLOWED, then nonMatchingNetworks must not be set to NON_MATCHING_NETWORKS_DISALLOWED, the policy will be rejected otherwise. Note: If this is set to FALLBACK_TO_DEFAULT_CONNECTION_DISALLOWED, applications are not able to access the internet if the 5G slice is not available.",
        ).optional(),
        nonMatchingNetworks: z.enum([
          "NON_MATCHING_NETWORKS_UNSPECIFIED",
          "NON_MATCHING_NETWORKS_ALLOWED",
          "NON_MATCHING_NETWORKS_DISALLOWED",
        ]).describe(
          "Optional. Whether apps this configuration applies to are blocked from using networks other than the preferential service. If this is set to NON_MATCHING_NETWORKS_DISALLOWED, then fallbackToDefaultConnection must be set to FALLBACK_TO_DEFAULT_CONNECTION_DISALLOWED.",
        ).optional(),
        preferentialNetworkId: z.enum([
          "PREFERENTIAL_NETWORK_ID_UNSPECIFIED",
          "NO_PREFERENTIAL_NETWORK",
          "PREFERENTIAL_NETWORK_ID_ONE",
          "PREFERENTIAL_NETWORK_ID_TWO",
          "PREFERENTIAL_NETWORK_ID_THREE",
          "PREFERENTIAL_NETWORK_ID_FOUR",
          "PREFERENTIAL_NETWORK_ID_FIVE",
        ]).describe(
          "Required. Preferential network identifier. This must not be set to NO_PREFERENTIAL_NETWORK or PREFERENTIAL_NETWORK_ID_UNSPECIFIED, the policy will be rejected otherwise.",
        ).optional(),
      })).describe(
        "Required. Preferential network service configurations which enables having multiple enterprise slices. There must not be multiple configurations with the same preferentialNetworkId. If a configuration is not referenced by any application by setting ApplicationPolicy.preferentialNetworkId or by setting defaultPreferentialNetworkId, it will be ignored. For devices on 4G networks, enterprise APN needs to be configured additionally to set up data call for preferential network service. These APNs can be added using apnPolicy.",
      ).optional(),
    }).describe(
      "Optional. Preferential network service configuration. Setting this field will override preferentialNetworkService. This can be set on both work profiles and fully managed devices on Android 13 and above. See 5G network slicing (https://developers.google.com/android/management/5g-network-slicing) guide for more details.",
    ).optional(),
    privateDnsSettings: z.object({
      privateDnsHost: z.string().describe(
        "Optional. The hostname of the DNS server. This must be set if and only if private_dns_mode is set to PRIVATE_DNS_SPECIFIED_HOST. Supported on Android 10 and above on fully managed devices. A NonComplianceDetail with MANAGEMENT_MODE is reported on other management modes. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 10. A NonComplianceDetail with PENDING is reported if the device is not connected to a network. A NonComplianceDetail with nonComplianceReason INVALID_VALUE and specificNonComplianceReason PRIVATE_DNS_HOST_NOT_SERVING is reported if the specified host is not a DNS server or not supported on Android. A NonComplianceDetail with INVALID_VALUE is reported if applying this setting fails for any other reason.",
      ).optional(),
      privateDnsMode: z.enum([
        "PRIVATE_DNS_MODE_UNSPECIFIED",
        "PRIVATE_DNS_USER_CHOICE",
        "PRIVATE_DNS_AUTOMATIC",
        "PRIVATE_DNS_SPECIFIED_HOST",
      ]).describe(
        "Optional. The configuration mode for device's global private DNS settings. If this is set to PRIVATE_DNS_SPECIFIED_HOST, then private_dns_host must be set.",
      ).optional(),
    }).describe("Optional. The global private DNS settings.").optional(),
    tetheringSettings: z.enum([
      "TETHERING_SETTINGS_UNSPECIFIED",
      "ALLOW_ALL_TETHERING",
      "DISALLOW_WIFI_TETHERING",
      "DISALLOW_ALL_TETHERING",
    ]).describe(
      "Controls tethering settings. Based on the value set, the user is partially or fully disallowed from using different forms of tethering.",
    ).optional(),
    usbDataAccess: z.enum([
      "USB_DATA_ACCESS_UNSPECIFIED",
      "ALLOW_USB_DATA_TRANSFER",
      "DISALLOW_USB_FILE_TRANSFER",
      "DISALLOW_USB_DATA_TRANSFER",
    ]).describe(
      "Controls what files and/or data can be transferred via USB. Supported only on company-owned devices.",
    ).optional(),
    wifiDirectSettings: z.enum([
      "WIFI_DIRECT_SETTINGS_UNSPECIFIED",
      "ALLOW_WIFI_DIRECT",
      "DISALLOW_WIFI_DIRECT",
    ]).describe(
      "Controls configuring and using Wi-Fi direct settings. Supported on company-owned devices running Android 13 and above.",
    ).optional(),
    wifiRoamingPolicy: z.object({
      wifiRoamingSettings: z.array(z.object({
        wifiRoamingMode: z.enum([
          "WIFI_ROAMING_MODE_UNSPECIFIED",
          "WIFI_ROAMING_DISABLED",
          "WIFI_ROAMING_DEFAULT",
          "WIFI_ROAMING_AGGRESSIVE",
        ]).describe("Required. Wi-Fi roaming mode for the specified SSID.")
          .optional(),
        wifiSsid: z.string().describe("Required. SSID of the Wi-Fi network.")
          .optional(),
      })).describe(
        "Optional. Wi-Fi roaming settings. SSIDs provided in this list must be unique, the policy will be rejected otherwise.",
      ).optional(),
    }).describe("Optional. Wi-Fi roaming policy.").optional(),
    wifiSsidPolicy: z.object({
      wifiSsidPolicyType: z.enum([
        "WIFI_SSID_POLICY_TYPE_UNSPECIFIED",
        "WIFI_SSID_DENYLIST",
        "WIFI_SSID_ALLOWLIST",
      ]).describe("Type of the Wi-Fi SSID policy to be applied.").optional(),
      wifiSsids: z.array(z.object({
        wifiSsid: z.string().describe(
          "Required. Wi-Fi SSID represented as a string.",
        ).optional(),
      })).describe(
        "Optional. List of Wi-Fi SSIDs that should be applied in the policy. This field must be non-empty when WifiSsidPolicyType is set to WIFI_SSID_ALLOWLIST. If this is set to a non-empty list, then a NonComplianceDetail detail with API_LEVEL is reported if the Android version is less than 13 and a NonComplianceDetail with MANAGEMENT_MODE is reported for non-company-owned devices.",
      ).optional(),
    }).describe(
      "Restrictions on which Wi-Fi SSIDs the device can connect to. Note that this does not affect which networks can be configured on the device. Supported on company-owned devices running Android 13 and above.",
    ).optional(),
  }).describe(
    "Covers controls for device connectivity such as Wi-Fi, USB data access, keyboard/mouse connections, and more.",
  ).optional(),
  deviceOwnerLockScreenInfo: z.object({
    defaultMessage: z.string().describe(
      "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
    ).optional(),
    localizedMessages: z.record(z.string(), z.string()).describe(
      "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
    ).optional(),
  }).describe("The device owner information to be shown on the lock screen.")
    .optional(),
  deviceRadioState: z.object({
    airplaneModeState: z.enum([
      "AIRPLANE_MODE_STATE_UNSPECIFIED",
      "AIRPLANE_MODE_USER_CHOICE",
      "AIRPLANE_MODE_DISABLED",
    ]).describe(
      "Optional. Controls whether airplane mode can be toggled by the user or not.",
    ).optional(),
    cellularTwoGState: z.enum([
      "CELLULAR_TWO_G_STATE_UNSPECIFIED",
      "CELLULAR_TWO_G_USER_CHOICE",
      "CELLULAR_TWO_G_DISABLED",
    ]).describe(
      "Optional. Controls whether cellular 2G setting can be toggled by the user or not.",
    ).optional(),
    minimumWifiSecurityLevel: z.enum([
      "MINIMUM_WIFI_SECURITY_LEVEL_UNSPECIFIED",
      "OPEN_NETWORK_SECURITY",
      "PERSONAL_NETWORK_SECURITY",
      "ENTERPRISE_NETWORK_SECURITY",
      "ENTERPRISE_BIT192_NETWORK_SECURITY",
    ]).describe(
      "Optional. The minimum required security level of Wi-Fi networks that the device can connect to.",
    ).optional(),
    ultraWidebandState: z.enum([
      "ULTRA_WIDEBAND_STATE_UNSPECIFIED",
      "ULTRA_WIDEBAND_USER_CHOICE",
      "ULTRA_WIDEBAND_DISABLED",
    ]).describe(
      "Optional. Controls the state of the ultra wideband setting and whether the user can toggle it on or off.",
    ).optional(),
    userInitiatedAddEsimSettings: z.enum([
      "USER_INITIATED_ADD_ESIM_SETTINGS_UNSPECIFIED",
      "USER_INITIATED_ADD_ESIM_ALLOWED",
      "USER_INITIATED_ADD_ESIM_DISALLOWED",
    ]).describe(
      "Optional. Controls whether the user is allowed to add eSIM profiles.",
    ).optional(),
    wifiState: z.enum([
      "WIFI_STATE_UNSPECIFIED",
      "WIFI_STATE_USER_CHOICE",
      "WIFI_ENABLED",
      "WIFI_DISABLED",
    ]).describe(
      "Optional. Controls current state of Wi-Fi and if user can change its state.",
    ).optional(),
  }).describe(
    "Optional. Covers controls for radio state such as Wi-Fi, bluetooth, and more.",
  ).optional(),
  displaySettings: z.object({
    screenBrightnessSettings: z.object({
      screenBrightness: z.number().int().describe(
        "Optional. The screen brightness between 1 and 255 where 1 is the lowest and 255 is the highest brightness. A value of 0 (default) means no screen brightness set. Any other value is rejected. screenBrightnessMode must be either BRIGHTNESS_AUTOMATIC or BRIGHTNESS_FIXED to set this. Supported on Android 9 and above on fully managed devices. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 9. Supported on work profiles on company-owned devices on Android 15 and above.",
      ).optional(),
      screenBrightnessMode: z.enum([
        "SCREEN_BRIGHTNESS_MODE_UNSPECIFIED",
        "BRIGHTNESS_USER_CHOICE",
        "BRIGHTNESS_AUTOMATIC",
        "BRIGHTNESS_FIXED",
      ]).describe("Optional. Controls the screen brightness mode.").optional(),
    }).describe("Optional. Controls the screen brightness settings.")
      .optional(),
    screenTimeoutSettings: z.object({
      screenTimeout: z.string().describe(
        "Optional. Controls the screen timeout duration. The screen timeout duration must be greater than 0, otherwise it is rejected. Additionally, it should not be greater than maximumTimeToLock, otherwise the screen timeout is set to maximumTimeToLock and a NonComplianceDetail with INVALID_VALUE reason and SCREEN_TIMEOUT_GREATER_THAN_MAXIMUM_TIME_TO_LOCK specific reason is reported. If the screen timeout is less than a certain lower bound, it is set to the lower bound. The lower bound may vary across devices. If this is set, screenTimeoutMode must be SCREEN_TIMEOUT_ENFORCED. Supported on Android 9 and above on fully managed devices. A NonComplianceDetail with API_LEVEL is reported if the Android version is less than 9. Supported on work profiles on company-owned devices on Android 15 and above.",
      ).optional(),
      screenTimeoutMode: z.enum([
        "SCREEN_TIMEOUT_MODE_UNSPECIFIED",
        "SCREEN_TIMEOUT_USER_CHOICE",
        "SCREEN_TIMEOUT_ENFORCED",
      ]).describe(
        "Optional. Controls whether the user is allowed to configure the screen timeout.",
      ).optional(),
    }).describe("Optional. Controls the screen timeout settings.").optional(),
  }).describe("Optional. Controls for the display settings.").optional(),
  encryptionPolicy: z.enum([
    "ENCRYPTION_POLICY_UNSPECIFIED",
    "ENABLED_WITHOUT_PASSWORD",
    "ENABLED_WITH_PASSWORD",
  ]).describe("Whether encryption is enabled").optional(),
  enterpriseDisplayNameVisibility: z.enum([
    "ENTERPRISE_DISPLAY_NAME_VISIBILITY_UNSPECIFIED",
    "ENTERPRISE_DISPLAY_NAME_VISIBLE",
    "ENTERPRISE_DISPLAY_NAME_HIDDEN",
  ]).describe(
    "Optional. Controls whether the enterpriseDisplayName is visible on the device (e.g. lock screen message on company-owned devices).",
  ).optional(),
  factoryResetDisabled: z.boolean().describe(
    "Whether factory resetting from settings is disabled.",
  ).optional(),
  frpAdminEmails: z.array(z.string()).describe(
    "Email addresses of device administrators for factory reset protection. When the device is factory reset, it will require one of these admins to log in with the Google account email and password to unlock the device. If no admins are specified, the device won't provide factory reset protection.",
  ).optional(),
  funDisabled: z.boolean().describe(
    "Whether the user is allowed to have fun. Controls whether the Easter egg game in Settings is disabled.",
  ).optional(),
  installAppsDisabled: z.boolean().describe(
    "Whether user installation of apps is disabled.",
  ).optional(),
  keyguardDisabled: z.boolean().describe(
    "If true, this disables the Lock Screen (https://source.android.com/docs/core/display/multi_display/lock-screen) for primary and/or secondary displays. This policy is supported only in dedicated device management mode.",
  ).optional(),
  keyguardDisabledFeatures: z.array(
    z.enum([
      "KEYGUARD_DISABLED_FEATURE_UNSPECIFIED",
      "CAMERA",
      "NOTIFICATIONS",
      "UNREDACTED_NOTIFICATIONS",
      "TRUST_AGENTS",
      "DISABLE_FINGERPRINT",
      "DISABLE_REMOTE_INPUT",
      "FACE",
      "IRIS",
      "BIOMETRICS",
      "SHORTCUTS",
      "ALL_FEATURES",
    ]),
  ).describe("Disabled keyguard customizations, such as widgets.").optional(),
  kioskCustomLauncherEnabled: z.boolean().describe(
    "Whether the kiosk custom launcher is enabled. This replaces the home screen with a launcher that locks down the device to the apps installed via the applications setting. Apps appear on a single page in alphabetical order. Use kioskCustomization to further configure the kiosk device behavior.",
  ).optional(),
  kioskCustomization: z.object({
    deviceSettings: z.enum([
      "DEVICE_SETTINGS_UNSPECIFIED",
      "SETTINGS_ACCESS_ALLOWED",
      "SETTINGS_ACCESS_BLOCKED",
    ]).describe("Specifies whether the Settings app is allowed in kiosk mode.")
      .optional(),
    powerButtonActions: z.enum([
      "POWER_BUTTON_ACTIONS_UNSPECIFIED",
      "POWER_BUTTON_AVAILABLE",
      "POWER_BUTTON_BLOCKED",
    ]).describe(
      "Sets the behavior of a device in kiosk mode when a user presses and holds (long-presses) the Power button.",
    ).optional(),
    statusBar: z.enum([
      "STATUS_BAR_UNSPECIFIED",
      "NOTIFICATIONS_AND_SYSTEM_INFO_ENABLED",
      "NOTIFICATIONS_AND_SYSTEM_INFO_DISABLED",
      "SYSTEM_INFO_ONLY",
    ]).describe(
      "Specifies whether system info and notifications are disabled in kiosk mode.",
    ).optional(),
    systemErrorWarnings: z.enum([
      "SYSTEM_ERROR_WARNINGS_UNSPECIFIED",
      "ERROR_AND_WARNINGS_ENABLED",
      "ERROR_AND_WARNINGS_MUTED",
    ]).describe(
      'Specifies whether system error dialogs for crashed or unresponsive apps are blocked in kiosk mode. When blocked, the system will force-stop the app as if the user chooses the "close app" option on the UI.',
    ).optional(),
    systemNavigation: z.enum([
      "SYSTEM_NAVIGATION_UNSPECIFIED",
      "NAVIGATION_ENABLED",
      "NAVIGATION_DISABLED",
      "HOME_BUTTON_ONLY",
    ]).describe(
      "Specifies which navigation features are enabled (e.g. Home, Overview buttons) in kiosk mode.",
    ).optional(),
  }).describe(
    "Settings controlling the behavior of a device in kiosk mode. To enable kiosk mode, set kioskCustomLauncherEnabled to true or specify an app in the policy with installType KIOSK.",
  ).optional(),
  locationMode: z.enum([
    "LOCATION_MODE_UNSPECIFIED",
    "HIGH_ACCURACY",
    "SENSORS_ONLY",
    "BATTERY_SAVING",
    "OFF",
    "LOCATION_USER_CHOICE",
    "LOCATION_ENFORCED",
    "LOCATION_DISABLED",
  ]).describe("The degree of location detection enabled.").optional(),
  longSupportMessage: z.object({
    defaultMessage: z.string().describe(
      "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
    ).optional(),
    localizedMessages: z.record(z.string(), z.string()).describe(
      "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
    ).optional(),
  }).describe(
    "A message displayed to the user in the device administators settings screen.",
  ).optional(),
  maximumTimeToLock: z.string().describe(
    "Maximum time in milliseconds for user activity until the device locks. A value of 0 means there is no restriction.",
  ).optional(),
  microphoneAccess: z.enum([
    "MICROPHONE_ACCESS_UNSPECIFIED",
    "MICROPHONE_ACCESS_USER_CHOICE",
    "MICROPHONE_ACCESS_DISABLED",
    "MICROPHONE_ACCESS_ENFORCED",
  ]).describe(
    "Controls the use of the microphone and whether the user has access to the microphone access toggle. This applies only on fully managed devices.",
  ).optional(),
  minimumApiLevel: z.number().int().describe(
    "The minimum allowed Android API level.",
  ).optional(),
  mobileNetworksConfigDisabled: z.boolean().describe(
    "Whether configuring mobile networks is disabled.",
  ).optional(),
  modifyAccountsDisabled: z.boolean().describe(
    "Whether adding or removing accounts is disabled.",
  ).optional(),
  mountPhysicalMediaDisabled: z.boolean().describe(
    "Whether the user mounting physical external media is disabled.",
  ).optional(),
  name: z.string().describe(
    "The name of the policy in the form enterprises/{enterpriseId}/policies/{policyId}.",
  ).optional(),
  networkEscapeHatchEnabled: z.boolean().describe(
    "Whether the network escape hatch is enabled. If a network connection can't be made at boot time, the escape hatch prompts the user to temporarily connect to a network in order to refresh the device policy. After applying policy, the temporary network will be forgotten and the device will continue booting. This prevents being unable to connect to a network if there is no suitable network in the last policy and the device boots into an app in lock task mode, or the user is otherwise unable to reach device settings.Note: Setting wifiConfigDisabled to true will override this setting under specific circumstances. Please see wifiConfigDisabled for further details. Setting configureWifi to DISALLOW_CONFIGURING_WIFI will override this setting under specific circumstances. Please see DISALLOW_CONFIGURING_WIFI for further details.",
  ).optional(),
  networkResetDisabled: z.boolean().describe(
    "Whether resetting network settings is disabled. This applies only on fully managed devices. A NonComplianceDetail with MANAGEMENT_MODE is reported for other management modes.",
  ).optional(),
  oncCertificateProviders: z.array(z.object({
    certificateReferences: z.array(z.string()).describe(
      "This feature is not generally available.",
    ).optional(),
    contentProviderEndpoint: z.object({
      packageName: z.string().describe(
        "This feature is not generally available.",
      ).optional(),
      signingCertsSha256: z.array(z.string()).describe(
        "Required. This feature is not generally available.",
      ).optional(),
      uri: z.string().describe("This feature is not generally available.")
        .optional(),
    }).describe("This feature is not generally available.").optional(),
  })).describe("This feature is not generally available.").optional(),
  openNetworkConfiguration: z.record(z.string(), z.string()).describe(
    "Network configuration for the device. See configure networks for more information.",
  ).optional(),
  outgoingBeamDisabled: z.boolean().describe(
    "Whether using NFC to beam data from apps is disabled.",
  ).optional(),
  outgoingCallsDisabled: z.boolean().describe(
    "Whether outgoing calls are disabled.",
  ).optional(),
  passwordPolicies: z.array(z.object({
    maximumFailedPasswordsForWipe: z.number().int().describe(
      "Number of incorrect device-unlock passwords that can be entered before a device is wiped. A value of 0 means there is no restriction.",
    ).optional(),
    passwordExpirationTimeout: z.string().describe(
      "Password expiration timeout.",
    ).optional(),
    passwordHistoryLength: z.number().int().describe(
      "The length of the password history. After setting this field, the user won't be able to enter a new password that is the same as any password in the history. A value of 0 means there is no restriction.",
    ).optional(),
    passwordMinimumLength: z.number().int().describe(
      "The minimum allowed password length. A value of 0 means there is no restriction. Only enforced when password_quality is NUMERIC, NUMERIC_COMPLEX, ALPHABETIC, ALPHANUMERIC, or COMPLEX.",
    ).optional(),
    passwordMinimumLetters: z.number().int().describe(
      "Minimum number of letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumLowerCase: z.number().int().describe(
      "Minimum number of lower case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNonLetter: z.number().int().describe(
      "Minimum number of non-letter characters (numerical digits or symbols) required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNumeric: z.number().int().describe(
      "Minimum number of numerical digits required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumSymbols: z.number().int().describe(
      "Minimum number of symbols required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumUpperCase: z.number().int().describe(
      "Minimum number of upper case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordQuality: z.enum([
      "PASSWORD_QUALITY_UNSPECIFIED",
      "BIOMETRIC_WEAK",
      "SOMETHING",
      "NUMERIC",
      "NUMERIC_COMPLEX",
      "ALPHABETIC",
      "ALPHANUMERIC",
      "COMPLEX",
      "COMPLEXITY_LOW",
      "COMPLEXITY_MEDIUM",
      "COMPLEXITY_HIGH",
    ]).describe("The required password quality.").optional(),
    passwordScope: z.enum([
      "SCOPE_UNSPECIFIED",
      "SCOPE_DEVICE",
      "SCOPE_PROFILE",
    ]).describe("The scope that the password requirement applies to.")
      .optional(),
    requirePasswordUnlock: z.enum([
      "REQUIRE_PASSWORD_UNLOCK_UNSPECIFIED",
      "USE_DEFAULT_DEVICE_TIMEOUT",
      "REQUIRE_EVERY_DAY",
    ]).describe(
      "The length of time after a device or work profile is unlocked using a strong form of authentication (password, PIN, pattern) that it can be unlocked using any other authentication method (e.g. fingerprint, trust agents, face). After the specified time period elapses, only strong forms of authentication can be used to unlock the device or work profile.",
    ).optional(),
    unifiedLockSettings: z.enum([
      "UNIFIED_LOCK_SETTINGS_UNSPECIFIED",
      "ALLOW_UNIFIED_WORK_AND_PERSONAL_LOCK",
      "REQUIRE_SEPARATE_WORK_LOCK",
    ]).describe(
      "Controls whether a unified lock is allowed for the device and the work profile, on devices running Android 9 and above with a work profile. This can be set only if password_scope is set to SCOPE_PROFILE, the policy will be rejected otherwise. If user has not set a separate work lock and this field is set to REQUIRE_SEPARATE_WORK_LOCK, a NonComplianceDetail is reported with nonComplianceReason set to USER_ACTION.",
    ).optional(),
  })).describe(
    "Password requirement policies. Different policies can be set for work profile or fully managed devices by setting the password_scope field in the policy.",
  ).optional(),
  passwordRequirements: z.object({
    maximumFailedPasswordsForWipe: z.number().int().describe(
      "Number of incorrect device-unlock passwords that can be entered before a device is wiped. A value of 0 means there is no restriction.",
    ).optional(),
    passwordExpirationTimeout: z.string().describe(
      "Password expiration timeout.",
    ).optional(),
    passwordHistoryLength: z.number().int().describe(
      "The length of the password history. After setting this field, the user won't be able to enter a new password that is the same as any password in the history. A value of 0 means there is no restriction.",
    ).optional(),
    passwordMinimumLength: z.number().int().describe(
      "The minimum allowed password length. A value of 0 means there is no restriction. Only enforced when password_quality is NUMERIC, NUMERIC_COMPLEX, ALPHABETIC, ALPHANUMERIC, or COMPLEX.",
    ).optional(),
    passwordMinimumLetters: z.number().int().describe(
      "Minimum number of letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumLowerCase: z.number().int().describe(
      "Minimum number of lower case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNonLetter: z.number().int().describe(
      "Minimum number of non-letter characters (numerical digits or symbols) required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumNumeric: z.number().int().describe(
      "Minimum number of numerical digits required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumSymbols: z.number().int().describe(
      "Minimum number of symbols required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordMinimumUpperCase: z.number().int().describe(
      "Minimum number of upper case letters required in the password. Only enforced when password_quality is COMPLEX.",
    ).optional(),
    passwordQuality: z.enum([
      "PASSWORD_QUALITY_UNSPECIFIED",
      "BIOMETRIC_WEAK",
      "SOMETHING",
      "NUMERIC",
      "NUMERIC_COMPLEX",
      "ALPHABETIC",
      "ALPHANUMERIC",
      "COMPLEX",
      "COMPLEXITY_LOW",
      "COMPLEXITY_MEDIUM",
      "COMPLEXITY_HIGH",
    ]).describe("The required password quality.").optional(),
    passwordScope: z.enum([
      "SCOPE_UNSPECIFIED",
      "SCOPE_DEVICE",
      "SCOPE_PROFILE",
    ]).describe("The scope that the password requirement applies to.")
      .optional(),
    requirePasswordUnlock: z.enum([
      "REQUIRE_PASSWORD_UNLOCK_UNSPECIFIED",
      "USE_DEFAULT_DEVICE_TIMEOUT",
      "REQUIRE_EVERY_DAY",
    ]).describe(
      "The length of time after a device or work profile is unlocked using a strong form of authentication (password, PIN, pattern) that it can be unlocked using any other authentication method (e.g. fingerprint, trust agents, face). After the specified time period elapses, only strong forms of authentication can be used to unlock the device or work profile.",
    ).optional(),
    unifiedLockSettings: z.enum([
      "UNIFIED_LOCK_SETTINGS_UNSPECIFIED",
      "ALLOW_UNIFIED_WORK_AND_PERSONAL_LOCK",
      "REQUIRE_SEPARATE_WORK_LOCK",
    ]).describe(
      "Controls whether a unified lock is allowed for the device and the work profile, on devices running Android 9 and above with a work profile. This can be set only if password_scope is set to SCOPE_PROFILE, the policy will be rejected otherwise. If user has not set a separate work lock and this field is set to REQUIRE_SEPARATE_WORK_LOCK, a NonComplianceDetail is reported with nonComplianceReason set to USER_ACTION.",
    ).optional(),
  }).describe(
    "Password requirements. The field password_requirements.require_password_unlock must not be set. DEPRECATED - Use passwordPolicies.Note:Complexity-based values of PasswordQuality, that is, COMPLEXITY_LOW, COMPLEXITY_MEDIUM, and COMPLEXITY_HIGH, cannot be used here. unified_lock_settings cannot be used here.",
  ).optional(),
  permissionGrants: z.array(z.object({
    permission: z.string().describe(
      "The Android permission or group, e.g. android.permission.READ_CALENDAR or android.permission_group.CALENDAR.",
    ).optional(),
    policy: z.enum(["PERMISSION_POLICY_UNSPECIFIED", "PROMPT", "GRANT", "DENY"])
      .describe("The policy for granting the permission.").optional(),
  })).describe(
    "Explicit permission or group grants or denials for all apps. These values override the default_permission_policy.",
  ).optional(),
  permittedAccessibilityServices: z.object({
    packageNames: z.array(z.string()).describe("A list of package names.")
      .optional(),
  }).describe(
    "Specifies permitted accessibility services. If the field is not set, any accessibility service can be used. If the field is set, only the accessibility services in this list and the system's built-in accessibility service can be used. In particular, if the field is set to empty, only the system's built-in accessibility servicess can be used. This can be set on fully managed devices and on work profiles. When applied to a work profile, this affects both the personal profile and the work profile.",
  ).optional(),
  permittedInputMethods: z.object({
    packageNames: z.array(z.string()).describe("A list of package names.")
      .optional(),
  }).describe(
    "If present, only the input methods provided by packages in this list are permitted. If this field is present, but the list is empty, then only system input methods are permitted.",
  ).optional(),
  persistentPreferredActivities: z.array(z.object({
    actions: z.array(z.string()).describe(
      "The intent actions to match in the filter. If any actions are included in the filter, then an intent's action must be one of those values for it to match. If no actions are included, the intent action is ignored.",
    ).optional(),
    categories: z.array(z.string()).describe(
      "The intent categories to match in the filter. An intent includes the categories that it requires, all of which must be included in the filter in order to match. In other words, adding a category to the filter has no impact on matching unless that category is specified in the intent.",
    ).optional(),
    receiverActivity: z.string().describe(
      "The activity that should be the default intent handler. This should be an Android component name, e.g. com.android.enterprise.app/.MainActivity. Alternatively, the value may be the package name of an app, which causes Android Device Policy to choose an appropriate activity from the app to handle the intent.",
    ).optional(),
  })).describe(
    "Default intent handler activities.Warning: Do not configure this and default_application_settings for the same intent domain, such as web browsing. Setting both for the same intent domain can lead to unpredictable behavior.",
  ).optional(),
  personalUsagePolicies: z.object({
    accountTypesWithManagementDisabled: z.array(z.string()).describe(
      "Account types that can't be managed by the user.",
    ).optional(),
    bluetoothSharing: z.enum([
      "BLUETOOTH_SHARING_UNSPECIFIED",
      "BLUETOOTH_SHARING_ALLOWED",
      "BLUETOOTH_SHARING_DISALLOWED",
    ]).describe("Optional. Whether bluetooth sharing is allowed.").optional(),
    cameraDisabled: z.boolean().describe(
      "If true, the camera is disabled on the personal profile.",
    ).optional(),
    maxDaysWithWorkOff: z.number().int().describe(
      "Controls how long the work profile can stay off. The minimum duration must be at least 3 days. Other details are as follows: - If the duration is set to 0, the feature is turned off. - If the duration is set to a value smaller than the minimum duration, the feature returns an error. *Note:* If you want to avoid personal profiles being suspended during long periods of off-time, you can temporarily set a large value for this parameter.",
    ).optional(),
    personalApplications: z.array(z.object({
      installType: z.enum(["INSTALL_TYPE_UNSPECIFIED", "BLOCKED", "AVAILABLE"])
        .describe("The type of installation to perform.").optional(),
      packageName: z.string().describe("The package name of the application.")
        .optional(),
    })).describe("Policy applied to applications in the personal profile.")
      .optional(),
    personalPlayStoreMode: z.enum([
      "PLAY_STORE_MODE_UNSPECIFIED",
      "BLACKLIST",
      "BLOCKLIST",
      "ALLOWLIST",
    ]).describe(
      "Used together with personalApplications to control how apps in the personal profile are allowed or blocked.",
    ).optional(),
    privateSpacePolicy: z.enum([
      "PRIVATE_SPACE_POLICY_UNSPECIFIED",
      "PRIVATE_SPACE_ALLOWED",
      "PRIVATE_SPACE_DISALLOWED",
    ]).describe(
      "Optional. Controls whether a private space is allowed on the device.",
    ).optional(),
    screenCaptureDisabled: z.boolean().describe(
      "If true, screen capture is disabled for all users. This also blocks Circle to Search (https://support.google.com/android/answer/14508957).",
    ).optional(),
  }).describe("Policies managing personal usage on a company-owned device.")
    .optional(),
  playStoreMode: z.enum([
    "PLAY_STORE_MODE_UNSPECIFIED",
    "WHITELIST",
    "BLACKLIST",
  ]).describe(
    "This mode controls which apps are available to the user in the Play Store and the behavior on the device when apps are removed from the policy.",
  ).optional(),
  policyEnforcementRules: z.array(z.object({
    blockAction: z.object({
      blockAfterDays: z.number().int().describe(
        "Number of days the policy is non-compliant before the device or work profile is blocked. To block access immediately, set to 0. blockAfterDays must be less than wipeAfterDays.",
      ).optional(),
      blockScope: z.enum([
        "BLOCK_SCOPE_UNSPECIFIED",
        "BLOCK_SCOPE_WORK_PROFILE",
        "BLOCK_SCOPE_DEVICE",
      ]).describe(
        "Specifies the scope of this BlockAction. Only applicable to devices that are company-owned.",
      ).optional(),
    }).describe(
      "An action to block access to apps and data on a company owned device or in a work profile. This action also triggers a user-facing notification with information (where possible) on how to correct the compliance issue. Note: wipeAction must also be specified.",
    ).optional(),
    settingName: z.string().describe(
      "The top-level policy to enforce. For example, applications or passwordPolicies.",
    ).optional(),
    wipeAction: z.object({
      preserveFrp: z.boolean().describe(
        "Whether the factory-reset protection data is preserved on the device. This setting applies to fully managed devices and work profiles on company-owned devices.",
      ).optional(),
      wipeAfterDays: z.number().int().describe(
        "Number of days the policy is non-compliant before the device or work profile is wiped. wipeAfterDays must be greater than blockAfterDays.",
      ).optional(),
    }).describe(
      "An action to reset a company owned device or delete a work profile. Note: blockAction must also be specified.",
    ).optional(),
  })).describe(
    "Rules that define the behavior when a particular policy can not be applied on device",
  ).optional(),
  preferentialNetworkService: z.enum([
    "PREFERENTIAL_NETWORK_SERVICE_UNSPECIFIED",
    "PREFERENTIAL_NETWORK_SERVICE_DISABLED",
    "PREFERENTIAL_NETWORK_SERVICE_ENABLED",
  ]).describe(
    "Controls whether preferential network service is enabled on the work profile or on fully managed devices. For example, an organization may have an agreement with a carrier that all of the work data from its employees' devices will be sent via a network service dedicated for enterprise use. An example of a supported preferential network service is the enterprise slice on 5G networks. This policy has no effect if preferentialNetworkServiceSettings or ApplicationPolicy.preferentialNetworkId is set on devices running Android 13 or above.",
  ).optional(),
  printingPolicy: z.enum([
    "PRINTING_POLICY_UNSPECIFIED",
    "PRINTING_DISALLOWED",
    "PRINTING_ALLOWED",
  ]).describe(
    "Optional. Controls whether printing is allowed. This is supported on devices running Android 9 and above..",
  ).optional(),
  privateKeySelectionEnabled: z.boolean().describe(
    "Allows showing UI on a device for a user to choose a private key alias if there are no matching rules in ChoosePrivateKeyRules. For devices below Android P, setting this may leave enterprise keys vulnerable. This value will have no effect if any application has CERT_SELECTION delegation scope.",
  ).optional(),
  recommendedGlobalProxy: z.object({
    excludedHosts: z.array(z.string()).describe(
      "For a direct proxy, the hosts for which the proxy is bypassed. The host names may contain wildcards such as *.example.com.",
    ).optional(),
    host: z.string().describe("The host of the direct proxy.").optional(),
    pacUri: z.string().describe(
      "The URI of the PAC script used to configure the proxy.",
    ).optional(),
    port: z.number().int().describe("The port of the direct proxy.").optional(),
  }).describe(
    "The network-independent global HTTP proxy. Typically proxies should be configured per-network in open_network_configuration. However for unusual configurations like general internal filtering a global HTTP proxy may be useful. If the proxy is not accessible, network access may break. The global proxy is only a recommendation and some apps may ignore it.",
  ).optional(),
  removeUserDisabled: z.boolean().describe(
    "Whether removing other users is disabled.",
  ).optional(),
  screenCaptureDisabled: z.boolean().describe(
    "Whether screen capture is disabled. This also blocks Circle to Search (https://support.google.com/android/answer/14508957).",
  ).optional(),
  setUserIconDisabled: z.boolean().describe(
    "Whether changing the user icon is disabled. This applies only on devices running Android 7 and above.",
  ).optional(),
  setWallpaperDisabled: z.boolean().describe(
    "Whether changing the wallpaper is disabled.",
  ).optional(),
  setupActions: z.array(z.object({
    description: z.object({
      defaultMessage: z.string().describe(
        "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
      ).optional(),
      localizedMessages: z.record(z.string(), z.string()).describe(
        "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
      ).optional(),
    }).describe("Description of this action.").optional(),
    launchApp: z.object({
      packageName: z.string().describe("Package name of app to be launched")
        .optional(),
    }).describe(
      "An action to launch an app. The app will be launched with an intent containing an extra with key com.google.android.apps.work.clouddpc.EXTRA_LAUNCHED_AS_SETUP_ACTION set to the boolean value true to indicate that this is a setup action flow. If SetupAction references an app, the corresponding installType in the application policy must be set as REQUIRED_FOR_SETUP or said setup will fail.",
    ).optional(),
    title: z.object({
      defaultMessage: z.string().describe(
        "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
      ).optional(),
      localizedMessages: z.record(z.string(), z.string()).describe(
        "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
      ).optional(),
    }).describe("Title of this action.").optional(),
  })).describe(
    "Action to take during the setup process. At most one action may be specified.",
  ).optional(),
  shareLocationDisabled: z.boolean().describe(
    "Whether location sharing is disabled.",
  ).optional(),
  shortSupportMessage: z.object({
    defaultMessage: z.string().describe(
      "The default message displayed if no localized message is specified or the user's locale doesn't match with any of the localized messages. A default message must be provided if any localized messages are provided.",
    ).optional(),
    localizedMessages: z.record(z.string(), z.string()).describe(
      "A map containing pairs, where locale is a well-formed BCP 47 language (https://www.w3.org/International/articles/language-tags/) code, such as en-US, es-ES, or fr.",
    ).optional(),
  }).describe(
    "A message displayed to the user in the settings screen wherever functionality has been disabled by the admin. If the message is longer than 200 characters it may be truncated.",
  ).optional(),
  skipFirstUseHintsEnabled: z.boolean().describe(
    "Flag to skip hints on the first use. Enterprise admin can enable the system recommendation for apps to skip their user tutorial and other introductory hints on first start-up.",
  ).optional(),
  smsDisabled: z.boolean().describe(
    "Whether sending and receiving SMS messages is disabled.",
  ).optional(),
  statusReportingSettings: z.object({
    applicationReportingSettings: z.object({
      includeRemovedApps: z.boolean().describe(
        "Whether removed apps are included in application reports.",
      ).optional(),
    }).describe(
      "Application reporting settings. Only applicable if application_reports_enabled is true.",
    ).optional(),
    applicationReportsEnabled: z.boolean().describe(
      "Whether app reports are enabled.",
    ).optional(),
    commonCriteriaModeEnabled: z.boolean().describe(
      "Whether Common Criteria Mode reporting is enabled. This is supported only on company-owned devices.",
    ).optional(),
    defaultApplicationInfoReportingEnabled: z.boolean().describe(
      "Optional. Whether defaultApplicationInfo reporting is enabled.",
    ).optional(),
    deviceSettingsEnabled: z.boolean().describe(
      "Whether device settings reporting is enabled.",
    ).optional(),
    displayInfoEnabled: z.boolean().describe(
      "Whether displays reporting is enabled. Report data is not available for personally owned devices with work profiles.",
    ).optional(),
    hardwareStatusEnabled: z.boolean().describe(
      "Whether hardware status reporting is enabled. Report data is not available for personally owned devices with work profiles.",
    ).optional(),
    memoryInfoEnabled: z.boolean().describe(
      "Whether memory event reporting is enabled.",
    ).optional(),
    networkInfoEnabled: z.boolean().describe(
      "Whether network info reporting is enabled.",
    ).optional(),
    powerManagementEventsEnabled: z.boolean().describe(
      "Whether power management event reporting is enabled. Report data is not available for personally owned devices with work profiles.",
    ).optional(),
    softwareInfoEnabled: z.boolean().describe(
      "Whether software info reporting is enabled.",
    ).optional(),
    systemPropertiesEnabled: z.boolean().describe(
      "Whether system properties reporting is enabled.",
    ).optional(),
  }).describe("Status reporting settings").optional(),
  stayOnPluggedModes: z.array(
    z.enum(["BATTERY_PLUGGED_MODE_UNSPECIFIED", "AC", "USB", "WIRELESS"]),
  ).describe(
    "The battery plugged in modes for which the device stays on. When using this setting, it is recommended to clear maximum_time_to_lock so that the device doesn't lock itself while it stays on.",
  ).optional(),
  systemUpdate: z.object({
    endMinutes: z.number().int().describe(
      "If the type is WINDOWED, the end of the maintenance window, measured as the number of minutes after midnight in device's local time. This value must be between 0 and 1439, inclusive. If this value is less than start_minutes, then the maintenance window spans midnight. If the maintenance window specified is smaller than 30 minutes, the actual window is extended to 30 minutes beyond the start time.",
    ).optional(),
    freezePeriods: z.array(z.object({
      endDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        'The end date (inclusive) of the freeze period. Must be no later than 90 days from the start date. If the end date is earlier than the start date, the freeze period is considered wrapping year-end. Note: day and month must be set. year should not be set as it is not used. For example, {"month": 1,"date": 30}.',
      ).optional(),
      startDate: z.object({
        day: z.number().int().describe(
          "Day of a month. Must be from 1 to 31 and valid for the year and month, or 0 to specify a year by itself or a year and month where the day isn't significant.",
        ).optional(),
        month: z.number().int().describe(
          "Month of a year. Must be from 1 to 12, or 0 to specify a year without a month and day.",
        ).optional(),
        year: z.number().int().describe(
          "Year of the date. Must be from 1 to 9999, or 0 to specify a date without a year.",
        ).optional(),
      }).describe(
        'The start date (inclusive) of the freeze period. Note: day and month must be set. year should not be set as it is not used. For example, {"month": 1,"date": 30}.',
      ).optional(),
    })).describe(
      "An annually repeating time period in which over-the-air (OTA) system updates are postponed to freeze the OS version running on a device. To prevent freezing the device indefinitely, each freeze period must be separated by at least 60 days.",
    ).optional(),
    startMinutes: z.number().int().describe(
      "If the type is WINDOWED, the start of the maintenance window, measured as the number of minutes after midnight in the device's local time. This value must be between 0 and 1439, inclusive.",
    ).optional(),
    type: z.enum([
      "SYSTEM_UPDATE_TYPE_UNSPECIFIED",
      "AUTOMATIC",
      "WINDOWED",
      "POSTPONE",
    ]).describe("The type of system update to configure.").optional(),
  }).describe(
    "The system update policy, which controls how OS updates are applied. If the update type is WINDOWED, the update window will automatically apply to Play app updates as well.Note: Google Play system updates (https://source.android.com/docs/core/ota/modular-system) (also called Mainline updates) are automatically downloaded and require a device reboot to be installed. Refer to the mainline section in Manage system updates (https://developer.android.com/work/dpc/system-updates#mainline) for further details.",
  ).optional(),
  uninstallAppsDisabled: z.boolean().describe(
    "Whether user uninstallation of applications is disabled. This prevents apps from being uninstalled, even those removed using applications",
  ).optional(),
  usageLog: z.object({
    enabledLogTypes: z.array(
      z.enum([
        "LOG_TYPE_UNSPECIFIED",
        "SECURITY_LOGS",
        "NETWORK_ACTIVITY_LOGS",
      ]),
    ).describe(
      "Specifies which log types are enabled. Note that users will receive on-device messaging when usage logging is enabled.",
    ).optional(),
    uploadOnCellularAllowed: z.array(
      z.enum([
        "LOG_TYPE_UNSPECIFIED",
        "SECURITY_LOGS",
        "NETWORK_ACTIVITY_LOGS",
      ]),
    ).describe(
      "Specifies which of the enabled log types can be uploaded over mobile data. By default logs are queued for upload when the device connects to WiFi.",
    ).optional(),
  }).describe("Configuration of device activity logging.").optional(),
  version: z.string().describe(
    "The version of the policy. This is a read-only field. The version is incremented each time the policy is updated.",
  ).optional(),
  vpnConfigDisabled: z.boolean().describe(
    "Whether configuring VPN is disabled.",
  ).optional(),
  wipeDataFlags: z.array(z.enum(["WIPE_DATA_FLAG_UNSPECIFIED", "WIPE_ESIMS"]))
    .describe(
      "Optional. Wipe flags to indicate what data is wiped when a device or profile wipe is triggered due to any reason (for example, non-compliance). This does not apply to the enterprises.devices.delete method.. This list must not have duplicates.",
    ).optional(),
  workAccountSetupConfig: z.object({
    authenticationType: z.enum([
      "AUTHENTICATION_TYPE_UNSPECIFIED",
      "AUTHENTICATION_TYPE_NOT_ENFORCED",
      "GOOGLE_AUTHENTICATED",
    ]).describe("Optional. The authentication type of the user on the device.")
      .optional(),
    requiredAccountEmail: z.string().describe(
      "Optional. The specific google work account email address to be added. This field is only relevant if authenticationType is GOOGLE_AUTHENTICATED. This must be an enterprise account and not a consumer account. Once set and a Google authenticated account is added to the device, changing this field will have no effect, and thus recommended to be set only once. The email address must be all lowercase.",
    ).optional(),
  }).describe(
    "Optional. Controls the work account setup configuration, such as details of whether a Google authenticated account is required.",
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
      : _defaultOAuthScopes,
    quotaProject: g.quotaProject as string | undefined,
  };
}

/** Swamp extension model for Google Cloud Android Management Enterprises.Policies. Registered at `@swamp/gcp/androidmanagement/enterprises-policies`. */
export const model = {
  type: "@swamp/gcp/androidmanagement/enterprises-policies",
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
      toVersion: "2026.05.09.1",
      description: "Added: autofillPolicy",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
      description: "Added: autofillPolicy",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.20.1",
      description: "Added: autofillPolicy",
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
      description: "Added: autofillPolicy",
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
      toVersion: "2026.07.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.15.1",
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
      toVersion: "2026.07.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.2",
      description: "Added: autofillPolicy",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.3",
      description: "Added: autofillPolicy",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.28.1",
      description: "Added: crossDevicePolicies",
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
      toVersion: "2026.08.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
      description: "Added: backupService",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "A policy resource represents a group of settings that govern the behavior of ...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    get: {
      description: "Get a policies",
      arguments: z.object({
        identifier: z.string().describe("The name of the policies"),
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
      description: "Update policies attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific policies by name (e.g. one discovered by list)",
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
        if (g["accountTypesWithManagementDisabled"] !== undefined) {
          body["accountTypesWithManagementDisabled"] =
            g["accountTypesWithManagementDisabled"];
        }
        if (g["addUserDisabled"] !== undefined) {
          body["addUserDisabled"] = g["addUserDisabled"];
        }
        if (g["adjustVolumeDisabled"] !== undefined) {
          body["adjustVolumeDisabled"] = g["adjustVolumeDisabled"];
        }
        if (g["advancedSecurityOverrides"] !== undefined) {
          body["advancedSecurityOverrides"] = g["advancedSecurityOverrides"];
        }
        if (g["alwaysOnVpnPackage"] !== undefined) {
          body["alwaysOnVpnPackage"] = g["alwaysOnVpnPackage"];
        }
        if (g["appAutoUpdatePolicy"] !== undefined) {
          body["appAutoUpdatePolicy"] = g["appAutoUpdatePolicy"];
        }
        if (g["appFunctions"] !== undefined) {
          body["appFunctions"] = g["appFunctions"];
        }
        if (g["applications"] !== undefined) {
          body["applications"] = g["applications"];
        }
        if (g["assistContentPolicy"] !== undefined) {
          body["assistContentPolicy"] = g["assistContentPolicy"];
        }
        if (g["autoDateAndTimeZone"] !== undefined) {
          body["autoDateAndTimeZone"] = g["autoDateAndTimeZone"];
        }
        if (g["autofillPolicy"] !== undefined) {
          body["autofillPolicy"] = g["autofillPolicy"];
        }
        if (g["backupService"] !== undefined) {
          body["backupService"] = g["backupService"];
        }
        if (g["bluetoothConfigDisabled"] !== undefined) {
          body["bluetoothConfigDisabled"] = g["bluetoothConfigDisabled"];
        }
        if (g["bluetoothContactSharingDisabled"] !== undefined) {
          body["bluetoothContactSharingDisabled"] =
            g["bluetoothContactSharingDisabled"];
        }
        if (g["bluetoothDisabled"] !== undefined) {
          body["bluetoothDisabled"] = g["bluetoothDisabled"];
        }
        if (g["cameraAccess"] !== undefined) {
          body["cameraAccess"] = g["cameraAccess"];
        }
        if (g["cellBroadcastsConfigDisabled"] !== undefined) {
          body["cellBroadcastsConfigDisabled"] =
            g["cellBroadcastsConfigDisabled"];
        }
        if (g["choosePrivateKeyRules"] !== undefined) {
          body["choosePrivateKeyRules"] = g["choosePrivateKeyRules"];
        }
        if (g["createWindowsDisabled"] !== undefined) {
          body["createWindowsDisabled"] = g["createWindowsDisabled"];
        }
        if (g["credentialProviderPolicyDefault"] !== undefined) {
          body["credentialProviderPolicyDefault"] =
            g["credentialProviderPolicyDefault"];
        }
        if (g["credentialsConfigDisabled"] !== undefined) {
          body["credentialsConfigDisabled"] = g["credentialsConfigDisabled"];
        }
        if (g["crossDevicePolicies"] !== undefined) {
          body["crossDevicePolicies"] = g["crossDevicePolicies"];
        }
        if (g["crossProfilePolicies"] !== undefined) {
          body["crossProfilePolicies"] = g["crossProfilePolicies"];
        }
        if (g["dataRoamingDisabled"] !== undefined) {
          body["dataRoamingDisabled"] = g["dataRoamingDisabled"];
        }
        if (g["defaultApplicationSettings"] !== undefined) {
          body["defaultApplicationSettings"] = g["defaultApplicationSettings"];
        }
        if (g["defaultPermissionPolicy"] !== undefined) {
          body["defaultPermissionPolicy"] = g["defaultPermissionPolicy"];
        }
        if (g["deviceConnectivityManagement"] !== undefined) {
          body["deviceConnectivityManagement"] =
            g["deviceConnectivityManagement"];
        }
        if (g["deviceOwnerLockScreenInfo"] !== undefined) {
          body["deviceOwnerLockScreenInfo"] = g["deviceOwnerLockScreenInfo"];
        }
        if (g["deviceRadioState"] !== undefined) {
          body["deviceRadioState"] = g["deviceRadioState"];
        }
        if (g["displaySettings"] !== undefined) {
          body["displaySettings"] = g["displaySettings"];
        }
        if (g["encryptionPolicy"] !== undefined) {
          body["encryptionPolicy"] = g["encryptionPolicy"];
        }
        if (g["enterpriseDisplayNameVisibility"] !== undefined) {
          body["enterpriseDisplayNameVisibility"] =
            g["enterpriseDisplayNameVisibility"];
        }
        if (g["factoryResetDisabled"] !== undefined) {
          body["factoryResetDisabled"] = g["factoryResetDisabled"];
        }
        if (g["frpAdminEmails"] !== undefined) {
          body["frpAdminEmails"] = g["frpAdminEmails"];
        }
        if (g["funDisabled"] !== undefined) {
          body["funDisabled"] = g["funDisabled"];
        }
        if (g["installAppsDisabled"] !== undefined) {
          body["installAppsDisabled"] = g["installAppsDisabled"];
        }
        if (g["keyguardDisabled"] !== undefined) {
          body["keyguardDisabled"] = g["keyguardDisabled"];
        }
        if (g["keyguardDisabledFeatures"] !== undefined) {
          body["keyguardDisabledFeatures"] = g["keyguardDisabledFeatures"];
        }
        if (g["kioskCustomLauncherEnabled"] !== undefined) {
          body["kioskCustomLauncherEnabled"] = g["kioskCustomLauncherEnabled"];
        }
        if (g["kioskCustomization"] !== undefined) {
          body["kioskCustomization"] = g["kioskCustomization"];
        }
        if (g["locationMode"] !== undefined) {
          body["locationMode"] = g["locationMode"];
        }
        if (g["longSupportMessage"] !== undefined) {
          body["longSupportMessage"] = g["longSupportMessage"];
        }
        if (g["maximumTimeToLock"] !== undefined) {
          body["maximumTimeToLock"] = g["maximumTimeToLock"];
        }
        if (g["microphoneAccess"] !== undefined) {
          body["microphoneAccess"] = g["microphoneAccess"];
        }
        if (g["minimumApiLevel"] !== undefined) {
          body["minimumApiLevel"] = g["minimumApiLevel"];
        }
        if (g["mobileNetworksConfigDisabled"] !== undefined) {
          body["mobileNetworksConfigDisabled"] =
            g["mobileNetworksConfigDisabled"];
        }
        if (g["modifyAccountsDisabled"] !== undefined) {
          body["modifyAccountsDisabled"] = g["modifyAccountsDisabled"];
        }
        if (g["mountPhysicalMediaDisabled"] !== undefined) {
          body["mountPhysicalMediaDisabled"] = g["mountPhysicalMediaDisabled"];
        }
        if (g["networkEscapeHatchEnabled"] !== undefined) {
          body["networkEscapeHatchEnabled"] = g["networkEscapeHatchEnabled"];
        }
        if (g["networkResetDisabled"] !== undefined) {
          body["networkResetDisabled"] = g["networkResetDisabled"];
        }
        if (g["oncCertificateProviders"] !== undefined) {
          body["oncCertificateProviders"] = g["oncCertificateProviders"];
        }
        if (g["openNetworkConfiguration"] !== undefined) {
          body["openNetworkConfiguration"] = g["openNetworkConfiguration"];
        }
        if (g["outgoingBeamDisabled"] !== undefined) {
          body["outgoingBeamDisabled"] = g["outgoingBeamDisabled"];
        }
        if (g["outgoingCallsDisabled"] !== undefined) {
          body["outgoingCallsDisabled"] = g["outgoingCallsDisabled"];
        }
        if (g["passwordPolicies"] !== undefined) {
          body["passwordPolicies"] = g["passwordPolicies"];
        }
        if (g["passwordRequirements"] !== undefined) {
          body["passwordRequirements"] = g["passwordRequirements"];
        }
        if (g["permissionGrants"] !== undefined) {
          body["permissionGrants"] = g["permissionGrants"];
        }
        if (g["permittedAccessibilityServices"] !== undefined) {
          body["permittedAccessibilityServices"] =
            g["permittedAccessibilityServices"];
        }
        if (g["permittedInputMethods"] !== undefined) {
          body["permittedInputMethods"] = g["permittedInputMethods"];
        }
        if (g["persistentPreferredActivities"] !== undefined) {
          body["persistentPreferredActivities"] =
            g["persistentPreferredActivities"];
        }
        if (g["personalUsagePolicies"] !== undefined) {
          body["personalUsagePolicies"] = g["personalUsagePolicies"];
        }
        if (g["playStoreMode"] !== undefined) {
          body["playStoreMode"] = g["playStoreMode"];
        }
        if (g["policyEnforcementRules"] !== undefined) {
          body["policyEnforcementRules"] = g["policyEnforcementRules"];
        }
        if (g["preferentialNetworkService"] !== undefined) {
          body["preferentialNetworkService"] = g["preferentialNetworkService"];
        }
        if (g["printingPolicy"] !== undefined) {
          body["printingPolicy"] = g["printingPolicy"];
        }
        if (g["privateKeySelectionEnabled"] !== undefined) {
          body["privateKeySelectionEnabled"] = g["privateKeySelectionEnabled"];
        }
        if (g["recommendedGlobalProxy"] !== undefined) {
          body["recommendedGlobalProxy"] = g["recommendedGlobalProxy"];
        }
        if (g["removeUserDisabled"] !== undefined) {
          body["removeUserDisabled"] = g["removeUserDisabled"];
        }
        if (g["screenCaptureDisabled"] !== undefined) {
          body["screenCaptureDisabled"] = g["screenCaptureDisabled"];
        }
        if (g["setUserIconDisabled"] !== undefined) {
          body["setUserIconDisabled"] = g["setUserIconDisabled"];
        }
        if (g["setWallpaperDisabled"] !== undefined) {
          body["setWallpaperDisabled"] = g["setWallpaperDisabled"];
        }
        if (g["setupActions"] !== undefined) {
          body["setupActions"] = g["setupActions"];
        }
        if (g["shareLocationDisabled"] !== undefined) {
          body["shareLocationDisabled"] = g["shareLocationDisabled"];
        }
        if (g["shortSupportMessage"] !== undefined) {
          body["shortSupportMessage"] = g["shortSupportMessage"];
        }
        if (g["skipFirstUseHintsEnabled"] !== undefined) {
          body["skipFirstUseHintsEnabled"] = g["skipFirstUseHintsEnabled"];
        }
        if (g["smsDisabled"] !== undefined) {
          body["smsDisabled"] = g["smsDisabled"];
        }
        if (g["statusReportingSettings"] !== undefined) {
          body["statusReportingSettings"] = g["statusReportingSettings"];
        }
        if (g["stayOnPluggedModes"] !== undefined) {
          body["stayOnPluggedModes"] = g["stayOnPluggedModes"];
        }
        if (g["systemUpdate"] !== undefined) {
          body["systemUpdate"] = g["systemUpdate"];
        }
        if (g["uninstallAppsDisabled"] !== undefined) {
          body["uninstallAppsDisabled"] = g["uninstallAppsDisabled"];
        }
        if (g["usageLog"] !== undefined) body["usageLog"] = g["usageLog"];
        if (g["version"] !== undefined) body["version"] = g["version"];
        if (g["vpnConfigDisabled"] !== undefined) {
          body["vpnConfigDisabled"] = g["vpnConfigDisabled"];
        }
        if (g["wipeDataFlags"] !== undefined) {
          body["wipeDataFlags"] = g["wipeDataFlags"];
        }
        if (g["workAccountSetupConfig"] !== undefined) {
          body["workAccountSetupConfig"] = g["workAccountSetupConfig"];
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
      description: "Delete the policies",
      arguments: z.object({
        identifier: z.string().describe("The name of the policies"),
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
      description: "Sync policies state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific policies by name (e.g. one discovered by list)",
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
      description: "List policies resources",
      arguments: z.object({
        pageSize: z.number().describe(
          "The requested page size. The actual page size may be fixed to a min or max value.",
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
          "policies",
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
    modify_policy_applications: {
      description: "modify policy applications",
      arguments: z.object({
        changes: z.any().optional(),
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
        if (args["changes"] !== undefined) body["changes"] = args["changes"];
        const result = await createResource(
          baseUrl,
          {
            "id":
              "androidmanagement.enterprises.policies.modifyPolicyApplications",
            "path": "v1/{+name}:modifyPolicyApplications",
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
