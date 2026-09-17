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

// Auto-generated extension model for @swamp/gcp/chromemanagement/customers-connectorconfigs
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Chrome Management Customers.ConnectorConfigs.
 *
 * A representation of a connector config.
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
  return `${parent}/connectorConfigs/${shortName}`;
}

const BASE_URL = "https://chromemanagement.googleapis.com/";

const GET_CONFIG = {
  "id": "chromemanagement.customers.connectorConfigs.get",
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
  "id": "chromemanagement.customers.connectorConfigs.create",
  "path": "v1/{+parent}/connectorConfigs",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "connectorConfigId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "chromemanagement.customers.connectorConfigs.patch",
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
  "id": "chromemanagement.customers.connectorConfigs.delete",
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
  "id": "chromemanagement.customers.connectorConfigs.list",
  "path": "v1/{+parent}/connectorConfigs",
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
  "https://www.googleapis.com/auth/chrome.management.appdetails.readonly",
  "https://www.googleapis.com/auth/chrome.management.profiles",
  "https://www.googleapis.com/auth/chrome.management.profiles.readonly",
  "https://www.googleapis.com/auth/chrome.management.reports.readonly",
  "https://www.googleapis.com/auth/chrome.management.securityinsights",
  "https://www.googleapis.com/auth/chrome.management.securityinsights.readonly",
  "https://www.googleapis.com/auth/chrome.management.telemetry.readonly",
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
  details: z.object({
    crowdStrikeConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the CrowdStrike config.",
      ).optional(),
    }).describe("CrowdStrike connector config.").optional(),
    crowdStrikeFalconNextGenConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the CrowdStrike Falcon Next Gen config.",
      ).optional(),
    }).describe("CrowdStrike Falcon Next Gen connector config.").optional(),
    crowdStrikeXdrConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      xdrSettings: z.object({
        enableAllXdrEvents: z.boolean().describe(
          "Required. Whether to enable all XDR events.",
        ).optional(),
      }).describe("Required. The XDR settings for the CrowdStrike XDR config.")
        .optional(),
    }).describe("CrowdStrike XDR connector config.").optional(),
    deviceTrustConfig: z.object({
      scope: z.enum([
        "BROWSER_ENFORCEMENT_SCOPE_UNSPECIFIED",
        "BROWSERS_ONLY",
        "PROFILES_ONLY",
        "BROWSERS_AND_PROFILES",
      ]).describe(
        "Required. The scope at which this configuration will be applied. Note that this only applies to Chrome browser, as in ChromeOS it's always applied.",
      ).optional(),
      serviceAccounts: z.array(z.string()).describe(
        "Required. A list of email addresses of the service accounts which are allowed to call the Verified Access API with full access.",
      ).optional(),
      serviceProvider: z.enum([
        "SERVICE_PROVIDER_UNSPECIFIED",
        "UNIVERSAL_DEVICE_TRUST",
        "OKTA",
        "PING_IDENTITY",
        "ONELOGIN",
        "DUO",
        "ZSCALER",
        "OMNISSA",
        "JUMPCLOUD",
      ]).describe(
        "Optional. The service provider for the device trust connector.",
      ).optional(),
      urlMatchers: z.array(z.string()).describe(
        'Required. List of URLs allowed to be part of the attestation flow to get the set of signals from the machine. URLs must have HTTPS scheme, e.g. "https://example.com". Wildcards, *, are allowed. For detailed information on valid URL patterns, please see https://cloud.google.com/docs/chrome-enterprise/policies/url-patterns.',
      ).optional(),
    }).describe("Device trust connector config.").optional(),
    googleSecOpsConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host of ingestion API endpoint. Allows customer to upload events to servers in specific geographical regions. Existing configs that don't have this setting default to US.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the Google SecOps config.",
      ).optional(),
    }).describe("Google SecOps connector config.").optional(),
    mipLabelConfig: z.object({
      domains: z.array(z.string()).describe(
        "Optional. Domain can be used optionally for the corner case where one Dasher customer ID maps to multiple Microsoft tenant ID. Each domain can be verified with at most one Microsoft tenant.",
      ).optional(),
      microsoftTenantId: z.string().describe("Required. Microsoft tenant ID.")
        .optional(),
    }).describe("MIP label connector config.").optional(),
    paloAltoNetworksConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the Palo Alto Networks config.",
      ).optional(),
    }).describe("Palo Alto Networks connector config.").optional(),
    pubSubConfig: z.object({
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe("Required. The reporting settings for the Pub/Sub config.")
        .optional(),
      topicFullPath: z.string().describe(
        "Required. The full path to the topic to send the event to.",
      ).optional(),
    }).describe("Pub/Sub connector config.").optional(),
    pubSubXdrConfig: z.object({
      topicFullPath: z.string().describe(
        "Required. The full path to the topic to send the event to.",
      ).optional(),
      xdrSettings: z.object({
        enableAllXdrEvents: z.boolean().describe(
          "Required. Whether to enable all XDR events.",
        ).optional(),
      }).describe("Required. The XDR settings for the Pub/Sub XDR config.")
        .optional(),
    }).describe("Pub/Sub XDR connector config.").optional(),
    secureGatewayConfig: z.object({
      enabledPlatforms: z.array(
        z.enum(["PLATFORM_UNSPECIFIED", "ANDROID", "IOS"]),
      ).describe(
        "Optional. The enabled platforms for the secure gateway connector config.",
      ).optional(),
      resourceId: z.string().describe(
        "Required. The resource ID of the secure gateway connector config.",
      ).optional(),
    }).describe("Secure gateway connector config.").optional(),
    splunkConfig: z.object({
      hecToken: z.string().describe(
        "Required. Input only. The data input's HTTP Event Collector token to use as an Authorization header.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      portNumber: z.number().int().describe(
        "Optional. The port number to use. If not set, the default Splunk port is used.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe("Required. The reporting settings for the Splunk config.")
        .optional(),
      source: z.string().describe(
        "Optional. Optional source name to override the default one set in the Splunk admin console.",
      ).optional(),
      unsecureScheme: z.boolean().describe(
        "Optional. Whether to use an unsecure HTTP scheme. Defaults to false (HTTPS).",
      ).optional(),
    }).describe("Splunk connector config.").optional(),
  }).describe("Required. The details of the connector config.").optional(),
  displayName: z.string().describe("Required. The display name of the config.")
    .optional(),
  name: z.string().describe(
    "Identifier. Format: customers/{customer}/connectorConfigs/{connector_config}",
  ).optional(),
  type: z.enum([
    "CONNECTOR_TYPE_UNSPECIFIED",
    "REPORTING",
    "DEVICE_TRUST",
    "XDR",
    "IDENTITY_BASED_ENROLLMENT",
    "CERTIFICATE_AUTHORITY",
    "ROOT_STORE",
    "CONTENT_ANALYSIS",
    "ENTERPRISE_PROXY",
  ]).describe("Required. The type of the connector.").optional(),
  connectorConfigId: z.string().describe(
    "Optional. ID to use for the connector config, which becomes the final component of the connector config's resource name. If provided, the ID must be 1-36 characters long, and contain only lowercase letters, digits, and hyphens. It must start with a letter, and end with a letter or number. If not provided, the connector config will be assigned a random UUID.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const StateSchema = z.object({
  details: z.object({
    crowdStrikeConfig: z.object({
      apiKey: z.string(),
      host: z.string(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(z.string()),
        enabledDeviceEvents: z.array(z.string()),
        enabledOptInEvents: z.array(z.string()),
      }),
    }),
    crowdStrikeFalconNextGenConfig: z.object({
      apiKey: z.string(),
      host: z.string(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(z.string()),
        enabledDeviceEvents: z.array(z.string()),
        enabledOptInEvents: z.array(z.string()),
      }),
    }),
    crowdStrikeXdrConfig: z.object({
      apiKey: z.string(),
      host: z.string(),
      xdrSettings: z.object({
        enableAllXdrEvents: z.boolean(),
      }),
    }),
    deviceTrustConfig: z.object({
      scope: z.string(),
      serviceAccounts: z.array(z.string()),
      serviceProvider: z.string(),
      urlMatchers: z.array(z.string()),
    }),
    googleSecOpsConfig: z.object({
      apiKey: z.string(),
      host: z.string(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(z.string()),
        enabledDeviceEvents: z.array(z.string()),
        enabledOptInEvents: z.array(z.string()),
      }),
    }),
    mipLabelConfig: z.object({
      domains: z.array(z.string()),
      microsoftTenantId: z.string(),
    }),
    paloAltoNetworksConfig: z.object({
      apiKey: z.string(),
      host: z.string(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(z.string()),
        enabledDeviceEvents: z.array(z.string()),
        enabledOptInEvents: z.array(z.string()),
      }),
    }),
    pubSubConfig: z.object({
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(z.string()),
        enabledDeviceEvents: z.array(z.string()),
        enabledOptInEvents: z.array(z.string()),
      }),
      topicFullPath: z.string(),
    }),
    pubSubXdrConfig: z.object({
      topicFullPath: z.string(),
      xdrSettings: z.object({
        enableAllXdrEvents: z.boolean(),
      }),
    }),
    secureGatewayConfig: z.object({
      enabledPlatforms: z.array(z.string()),
      resourceId: z.string(),
    }),
    splunkConfig: z.object({
      hecToken: z.string(),
      host: z.string(),
      portNumber: z.number(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(z.string()),
        enabledDeviceEvents: z.array(z.string()),
        enabledOptInEvents: z.array(z.string()),
      }),
      source: z.string(),
      unsecureScheme: z.boolean(),
    }),
  }).optional(),
  displayName: z.string().optional(),
  name: z.string(),
  status: z.object({
    failureStartTime: z.string(),
    state: z.string(),
    updateTime: z.string(),
  }).optional(),
  type: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  details: z.object({
    crowdStrikeConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the CrowdStrike config.",
      ).optional(),
    }).describe("CrowdStrike connector config.").optional(),
    crowdStrikeFalconNextGenConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the CrowdStrike Falcon Next Gen config.",
      ).optional(),
    }).describe("CrowdStrike Falcon Next Gen connector config.").optional(),
    crowdStrikeXdrConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      xdrSettings: z.object({
        enableAllXdrEvents: z.boolean().describe(
          "Required. Whether to enable all XDR events.",
        ).optional(),
      }).describe("Required. The XDR settings for the CrowdStrike XDR config.")
        .optional(),
    }).describe("CrowdStrike XDR connector config.").optional(),
    deviceTrustConfig: z.object({
      scope: z.enum([
        "BROWSER_ENFORCEMENT_SCOPE_UNSPECIFIED",
        "BROWSERS_ONLY",
        "PROFILES_ONLY",
        "BROWSERS_AND_PROFILES",
      ]).describe(
        "Required. The scope at which this configuration will be applied. Note that this only applies to Chrome browser, as in ChromeOS it's always applied.",
      ).optional(),
      serviceAccounts: z.array(z.string()).describe(
        "Required. A list of email addresses of the service accounts which are allowed to call the Verified Access API with full access.",
      ).optional(),
      serviceProvider: z.enum([
        "SERVICE_PROVIDER_UNSPECIFIED",
        "UNIVERSAL_DEVICE_TRUST",
        "OKTA",
        "PING_IDENTITY",
        "ONELOGIN",
        "DUO",
        "ZSCALER",
        "OMNISSA",
        "JUMPCLOUD",
      ]).describe(
        "Optional. The service provider for the device trust connector.",
      ).optional(),
      urlMatchers: z.array(z.string()).describe(
        'Required. List of URLs allowed to be part of the attestation flow to get the set of signals from the machine. URLs must have HTTPS scheme, e.g. "https://example.com". Wildcards, *, are allowed. For detailed information on valid URL patterns, please see https://cloud.google.com/docs/chrome-enterprise/policies/url-patterns.',
      ).optional(),
    }).describe("Device trust connector config.").optional(),
    googleSecOpsConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host of ingestion API endpoint. Allows customer to upload events to servers in specific geographical regions. Existing configs that don't have this setting default to US.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the Google SecOps config.",
      ).optional(),
    }).describe("Google SecOps connector config.").optional(),
    mipLabelConfig: z.object({
      domains: z.array(z.string()).describe(
        "Optional. Domain can be used optionally for the corner case where one Dasher customer ID maps to multiple Microsoft tenant ID. Each domain can be verified with at most one Microsoft tenant.",
      ).optional(),
      microsoftTenantId: z.string().describe("Required. Microsoft tenant ID.")
        .optional(),
    }).describe("MIP label connector config.").optional(),
    paloAltoNetworksConfig: z.object({
      apiKey: z.string().describe(
        "Required. Input only. API key to use on the ingestion API.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe(
        "Required. The reporting settings for the Palo Alto Networks config.",
      ).optional(),
    }).describe("Palo Alto Networks connector config.").optional(),
    pubSubConfig: z.object({
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe("Required. The reporting settings for the Pub/Sub config.")
        .optional(),
      topicFullPath: z.string().describe(
        "Required. The full path to the topic to send the event to.",
      ).optional(),
    }).describe("Pub/Sub connector config.").optional(),
    pubSubXdrConfig: z.object({
      topicFullPath: z.string().describe(
        "Required. The full path to the topic to send the event to.",
      ).optional(),
      xdrSettings: z.object({
        enableAllXdrEvents: z.boolean().describe(
          "Required. Whether to enable all XDR events.",
        ).optional(),
      }).describe("Required. The XDR settings for the Pub/Sub XDR config.")
        .optional(),
    }).describe("Pub/Sub XDR connector config.").optional(),
    secureGatewayConfig: z.object({
      enabledPlatforms: z.array(
        z.enum(["PLATFORM_UNSPECIFIED", "ANDROID", "IOS"]),
      ).describe(
        "Optional. The enabled platforms for the secure gateway connector config.",
      ).optional(),
      resourceId: z.string().describe(
        "Required. The resource ID of the secure gateway connector config.",
      ).optional(),
    }).describe("Secure gateway connector config.").optional(),
    splunkConfig: z.object({
      hecToken: z.string().describe(
        "Required. Input only. The data input's HTTP Event Collector token to use as an Authorization header.",
      ).optional(),
      host: z.string().describe(
        "Required. Host to identify the customer specific server to receive the events.",
      ).optional(),
      portNumber: z.number().int().describe(
        "Optional. The port number to use. If not set, the default Splunk port is used.",
      ).optional(),
      reportingSettings: z.object({
        enabledDefaultEvents: z.array(
          z.enum([
            "DEFAULT_EVENT_UNSPECIFIED",
            "ALL_DEFAULT_EVENTS",
            "BROWSER_CRASH_EVENT",
            "BROWSER_EXTENSION_INSTALL_EVENT",
            "CONTENT_TRANSFER_EVENT",
            "CONTENT_UNSCANNED_EVENT",
            "DATA_ACCESS_CONTROL_EVENT",
            "MALWARE_TRANSFER_EVENT",
            "PASSWORD_CHANGED_EVENT",
            "PASSWORD_REUSE_EVENT",
            "SENSITIVE_DATA_TRANSFER_EVENT",
            "SUSPICIOUS_URL_EVENT",
            "UNSAFE_SITE_VISIT_EVENT",
            "URL_FILTERING_INTERSTITIAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of user and browser events that are enabled for this connector. An empty list disables all default events, and using `ALL_DEFAULT_EVENTS` will enable all default events.",
        ).optional(),
        enabledDeviceEvents: z.array(
          z.enum([
            "DEVICE_EVENT_UNSPECIFIED",
            "ALL_DEVICE_EVENTS",
            "ADD_REMOVE_USER_EVENT",
            "LOGIN_LOGOUT_EVENT",
            "CRD_EVENT",
            "PERIPHERAL_EVENT",
          ]),
        ).describe(
          "Optional. The list of device events that are enabled for this config. An empty list disables all device events, and using `ALL_DEVICE_EVENTS` will enable all device events.",
        ).optional(),
        enabledOptInEvents: z.array(
          z.enum([
            "OPT_IN_EVENT_UNSPECIFIED",
            "ALL_OPT_IN_EVENTS",
            "LOGIN_EVENT",
            "PASSWORD_BREACH_EVENT",
            "URL_NAVIGATION_EVENT",
            "EXTENSION_TELEMETRY_EVENT",
          ]),
        ).describe(
          "Optional. The list of opt-in events that are enabled for this config. An empty list disables all opt-in events, and using `ALL_OPT_IN_EVENTS` will enable all opt-in events.",
        ).optional(),
      }).describe("Required. The reporting settings for the Splunk config.")
        .optional(),
      source: z.string().describe(
        "Optional. Optional source name to override the default one set in the Splunk admin console.",
      ).optional(),
      unsecureScheme: z.boolean().describe(
        "Optional. Whether to use an unsecure HTTP scheme. Defaults to false (HTTPS).",
      ).optional(),
    }).describe("Splunk connector config.").optional(),
  }).describe("Required. The details of the connector config.").optional(),
  displayName: z.string().describe("Required. The display name of the config.")
    .optional(),
  name: z.string().describe(
    "Identifier. Format: customers/{customer}/connectorConfigs/{connector_config}",
  ).optional(),
  type: z.enum([
    "CONNECTOR_TYPE_UNSPECIFIED",
    "REPORTING",
    "DEVICE_TRUST",
    "XDR",
    "IDENTITY_BASED_ENROLLMENT",
    "CERTIFICATE_AUTHORITY",
    "ROOT_STORE",
    "CONTENT_ANALYSIS",
    "ENTERPRISE_PROXY",
  ]).describe("Required. The type of the connector.").optional(),
  connectorConfigId: z.string().describe(
    "Optional. ID to use for the connector config, which becomes the final component of the connector config's resource name. If provided, the ID must be 1-36 characters long, and contain only lowercase letters, digits, and hyphens. It must start with a letter, and end with a letter or number. If not provided, the connector config will be assigned a random UUID.",
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

/** Swamp extension model for Google Cloud Chrome Management Customers.ConnectorConfigs. Registered at `@swamp/gcp/chromemanagement/customers-connectorconfigs`. */
export const model = {
  type: "@swamp/gcp/chromemanagement/customers-connectorconfigs",
  version: "2026.09.17.1",
  upgrades: [
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
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "A representation of a connector config.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a connectorConfigs",
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
        if (g["details"] !== undefined) body["details"] = g["details"];
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["type"] !== undefined) body["type"] = g["type"];
        if (g["connectorConfigId"] !== undefined) {
          params["connectorConfigId"] = String(g["connectorConfigId"]);
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
      description: "Get a connectorConfigs",
      arguments: z.object({
        identifier: z.string().describe("The name of the connectorConfigs"),
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
      description: "Update connectorConfigs attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific connectorConfigs by name (e.g. one discovered by list)",
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
        if (g["details"] !== undefined) body["details"] = g["details"];
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["type"] !== undefined) body["type"] = g["type"];
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
      description: "Delete the connectorConfigs",
      arguments: z.object({
        identifier: z.string().describe("The name of the connectorConfigs"),
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
      description: "Sync connectorConfigs state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific connectorConfigs by name (e.g. one discovered by list)",
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
      description: "List connectorConfigs resources",
      arguments: z.object({
        pageSize: z.number().describe(
          "Optional. The maximum number of connector configs to return. The default page size is 50 if page_size is unspecified, and the maximum page size allowed is 100. Values above 100 will be capped at 100.",
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
          "connectorConfigs",
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
