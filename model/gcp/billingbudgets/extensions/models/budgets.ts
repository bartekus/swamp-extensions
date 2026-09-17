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

// Auto-generated extension model for @swamp/gcp/billingbudgets/budgets
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Billing Budget Budgets.
 *
 * A budget is a plan that describes what you expect to spend on Cloud projects, plus the rules to execute as spend is tracked against that plan, (for example, send an alert when 90% of the target spend is met). The budget time period is configurable, with options such as month (default), quarter, year, or custom time period.
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

/** Construct the fully-qualified resource name from parent and short name. */
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/budgets/${shortName}`;
}

const BASE_URL = "https://billingbudgets.googleapis.com/";

const GET_CONFIG = {
  "id": "billingbudgets.billingAccounts.budgets.get",
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
  "id": "billingbudgets.billingAccounts.budgets.create",
  "path": "v1/{+parent}/budgets",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "billingbudgets.billingAccounts.budgets.patch",
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
  "id": "billingbudgets.billingAccounts.budgets.delete",
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
  "id": "billingbudgets.billingAccounts.budgets.list",
  "path": "v1/{+parent}/budgets",
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
    "scope": {
      "location": "query",
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
  amount: z.object({
    lastPeriodAmount: z.object({}).describe(
      "Use the last period's actual spend as the budget for the present period. LastPeriodAmount can only be set when the budget's time period is a Filter.calendar_period. It cannot be set in combination with Filter.custom_period.",
    ).optional(),
    specifiedAmount: z.object({
      currencyCode: z.string().describe(
        "The three-letter currency code defined in ISO 4217.",
      ).optional(),
      nanos: z.number().int().describe(
        "Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.",
      ).optional(),
      units: z.string().describe(
        'The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.',
      ).optional(),
    }).describe(
      "A specified amount to use as the budget. `currency_code` is optional. If specified when creating a budget, it must match the currency of the billing account. If specified when updating a budget, it must match the currency_code of the existing budget. The `currency_code` is provided on output.",
    ).optional(),
  }).describe("Required. Budgeted amount.").optional(),
  budgetFilter: z.object({
    calendarPeriod: z.enum([
      "CALENDAR_PERIOD_UNSPECIFIED",
      "MONTH",
      "QUARTER",
      "YEAR",
    ]).describe(
      "Optional. Specifies to track usage for recurring calendar period. For example, assume that CalendarPeriod.QUARTER is set. The budget tracks usage from April 1 to June 30, when the current calendar month is April, May, June. After that, it tracks usage from July 1 to September 30 when the current calendar month is July, August, September, so on.",
    ).optional(),
    creditTypes: z.array(z.string()).describe(
      "Optional. If Filter.credit_types_treatment is INCLUDE_SPECIFIED_CREDITS, this is a list of credit types to be subtracted from gross cost to determine the spend for threshold calculations. See [a list of acceptable credit type values](https://cloud.google.com/billing/docs/how-to/export-data-bigquery-tables#credits-type). If Filter.credit_types_treatment is **not** INCLUDE_SPECIFIED_CREDITS, this field must be empty.",
    ).optional(),
    creditTypesTreatment: z.enum([
      "CREDIT_TYPES_TREATMENT_UNSPECIFIED",
      "INCLUDE_ALL_CREDITS",
      "EXCLUDE_ALL_CREDITS",
      "INCLUDE_SPECIFIED_CREDITS",
    ]).describe(
      "Optional. If not set, default behavior is `INCLUDE_ALL_CREDITS`.",
    ).optional(),
    customPeriod: z.object({
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
        "Optional. The end date of the time period. Budgets with elapsed end date won't be processed. If unset, specifies to track all usage incurred since the start_date.",
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
      }).describe("Required. The start date must be after January 1, 2017.")
        .optional(),
    }).describe(
      "Optional. Specifies to track usage from any start date (required) to any end date (optional). This time period is static, it does not recur.",
    ).optional(),
    labels: z.record(z.string(), z.array(z.string())).describe(
      'Optional. A single label and value pair specifying that usage from only this set of labeled resources should be included in the budget. If omitted, the report includes all labeled and unlabeled usage. An object containing a single `"key": value` pair. Example: `{ "name": "wrench" }`. _Currently, multiple entries or multiple values per entry are not allowed._',
    ).optional(),
    projects: z.array(z.string()).describe(
      "Optional. A set of projects of the form `projects/{project}`, specifying that usage from only this set of projects should be included in the budget. If omitted, the report includes all usage for the billing account, regardless of which project the usage occurred on.",
    ).optional(),
    resourceAncestors: z.array(z.string()).describe(
      "Optional. A set of folder and organization names of the form `folders/{folderId}` or `organizations/{organizationId}`, specifying that usage from only this set of folders and organizations should be included in the budget. If omitted, the budget includes all usage that the billing account pays for. If the folder or organization contains projects that are paid for by a different Cloud Billing account, the budget *doesn't* apply to those projects.",
    ).optional(),
    services: z.array(z.string()).describe(
      "Optional. A set of services of the form `services/{service_id}`, specifying that usage from only this set of services should be included in the budget. If omitted, the report includes usage for all the services. The service names are available through the Catalog API: https://cloud.google.com/billing/v1/how-tos/catalog-api.",
    ).optional(),
    subaccounts: z.array(z.string()).describe(
      "Optional. A set of subaccounts of the form `billingAccounts/{account_id}`, specifying that usage from only this set of subaccounts should be included in the budget. If a subaccount is set to the name of the parent account, usage from the parent account is included. If the field is omitted, the report includes usage from the parent account and all subaccounts, if they exist.",
    ).optional(),
  }).describe(
    "Optional. Filters that define which resources are used to compute the actual spend against the budget amount, such as projects, services, and the budget's time period, as well as other filters.",
  ).optional(),
  displayName: z.string().describe(
    "User data for display name in UI. The name must be less than or equal to 60 characters.",
  ).optional(),
  notificationsRule: z.object({
    disableDefaultIamRecipients: z.boolean().describe(
      "Optional. When set to true, disables default notifications sent when a threshold is exceeded. Default notifications are sent to those with Billing Account Administrator and Billing Account User IAM roles for the target account.",
    ).optional(),
    enableProjectLevelRecipients: z.boolean().describe(
      "Optional. When set to true, and when the budget has a single project configured, notifications will be sent to project level recipients of that project. This field will be ignored if the budget has multiple or no project configured. Currently, project level recipients are the users with `Owner` role on a cloud project.",
    ).optional(),
    monitoringNotificationChannels: z.array(z.string()).describe(
      "Optional. Email targets to send notifications to when a threshold is exceeded. This is in addition to the `DefaultIamRecipients` who receive alert emails based on their billing account IAM role. The value is the full REST resource name of a Cloud Monitoring email notification channel with the form `projects/{project_id}/notificationChannels/{channel_id}`. A maximum of 5 email notifications are allowed. To customize budget alert email recipients with monitoring notification channels, you _must create the monitoring notification channels before you link them to a budget_. For guidance on setting up notification channels to use with budgets, see [Customize budget alert email recipients](https://cloud.google.com/billing/docs/how-to/budgets-notification-recipients). For Cloud Billing budget alerts, you _must use email notification channels_. The other types of notification channels are _not_ supported, such as Slack, SMS, or PagerDuty. If you want to [send budget notifications to Slack](https://cloud.google.com/billing/docs/how-to/notify#send_notifications_to_slack), use a pubsubTopic and configure [programmatic notifications](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications).",
    ).optional(),
    pubsubTopic: z.string().describe(
      "Optional. The name of the Pub/Sub topic where budget-related messages are published, in the form `projects/{project_id}/topics/{topic_id}`. Updates are sent to the topic at regular intervals; the timing of the updates is not dependent on the [threshold rules](#thresholdrule) you've set. Note that if you want your [Pub/Sub JSON object](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#notification_format) to contain data for `alertThresholdExceeded`, you need at least one [alert threshold rule](#thresholdrule). When you set threshold rules, you must also enable at least one of the email notification options, either using the default IAM recipients or Cloud Monitoring email notification channels. To use Pub/Sub topics with budgets, you must do the following: 1. Create the Pub/Sub topic before connecting it to your budget. For guidance, see [Manage programmatic budget alert notifications](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications). 2. Grant the API caller the `pubsub.topics.setIamPolicy` permission on the Pub/Sub topic. If not set, the API call fails with PERMISSION_DENIED. For additional details on Pub/Sub roles and permissions, see [Permissions required for this task](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#permissions_required_for_this_task).",
    ).optional(),
    schemaVersion: z.string().describe(
      'Optional. Required when NotificationsRule.pubsub_topic is set. The schema version of the notification sent to NotificationsRule.pubsub_topic. Only "1.0" is accepted. It represents the JSON schema as defined in https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#notification_format.',
    ).optional(),
  }).describe(
    "Optional. Rules to apply to notifications sent based on budget spend and thresholds.",
  ).optional(),
  ownershipScope: z.enum([
    "OWNERSHIP_SCOPE_UNSPECIFIED",
    "ALL_USERS",
    "BILLING_ACCOUNT",
  ]).optional(),
  thresholdRules: z.array(z.object({
    spendBasis: z.enum([
      "BASIS_UNSPECIFIED",
      "CURRENT_SPEND",
      "FORECASTED_SPEND",
    ]).describe(
      "Optional. The type of basis used to determine if spend has passed the threshold. Behavior defaults to CURRENT_SPEND if not set.",
    ).optional(),
    thresholdPercent: z.number().describe(
      "Required. Send an alert when this threshold is exceeded. This is a 1.0-based percentage, so 0.5 = 50%. Validation: non-negative number.",
    ).optional(),
  })).describe(
    "Optional. Rules that trigger alerts (notifications of thresholds being crossed) when spend exceeds the specified percentages of the budget. Optional for `pubsubTopic` notifications. Required if using email notifications.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
});

const budgetEnsureMethods = {
  ensure_budget: {
    description:
      "create or adopt/update a recurring specified-amount budget by ID or unique displayName with etag-protected updates, notification verification, and complete read-back",
    arguments: z.object({
      billingAccount: z.string().describe(
        "Billing account resource name, e.g. billingAccounts/012345-6789AB-CDEF01",
      ),
      budgetId: z.string().describe(
        "Existing budget ID to target directly; if omitted, looks up by displayName",
      ).optional(),
      displayName: z.string().describe("Human-readable budget name"),
      amount: z.object({
        units: z.string().describe("Whole units of the amount, e.g. '1000'"),
        nanos: z.number().describe("Nano units (10^-9)").optional(),
        currencyCode: z.string().describe("ISO 4217 currency code, e.g. USD"),
      }).describe("Specified budget amount as exact decimal Money"),
      thresholdRules: z.array(z.object({
        thresholdPercent: z.number().describe(
          "Threshold as a fraction of the budget, e.g. 0.5 for 50%",
        ),
        spendBasis: z.string().describe(
          "CURRENT_SPEND or FORECASTED_SPEND (default CURRENT_SPEND)",
        ).optional(),
      })).describe("Alert threshold rules"),
      filter: z.object({
        projects: z.array(z.string()).describe(
          "Project resource names to scope the budget to",
        ).optional(),
        services: z.array(z.string()).describe(
          "Service resource names to scope the budget to",
        ).optional(),
      }).describe("Optional budget scope filter").optional(),
      calendarPeriod: z.string().describe(
        "Calendar period: MONTH, QUARTER, or YEAR (default MONTH)",
      ).optional(),
      notificationsRule: z.object({
        pubsubTopic: z.string().describe("Pub/Sub topic for notifications")
          .optional(),
        schemaVersion: z.string().describe("Schema version, e.g. 1.0")
          .optional(),
        monitoringNotificationChannels: z.array(z.string()).describe(
          "Cloud Monitoring notification channel resource names",
        ).optional(),
        disableDefaultIamRecipients: z.boolean().describe(
          "Disable email notifications to default IAM recipients",
        ).optional(),
      }).describe("Notification configuration").optional(),
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

      const billingAccount = args.billingAccount as string;
      const budgetId = args.budgetId as string | undefined;
      const displayName = args.displayName as string;
      const amount = args.amount as {
        units: string;
        nanos?: number;
        currencyCode: string;
      };
      const thresholdRules = args.thresholdRules as Array<{
        thresholdPercent: number;
        spendBasis?: string;
      }>;
      const filter = args.filter as
        | { projects?: string[]; services?: string[] }
        | undefined;
      const calendarPeriod = (args.calendarPeriod as string | undefined) ??
        "MONTH";
      const notificationsRule = args.notificationsRule as
        | Record<string, unknown>
        | undefined;

      const budgetBody: Record<string, unknown> = {
        displayName,
        amount: {
          specifiedAmount: {
            units: amount.units,
            ...(amount.nanos !== undefined ? { nanos: amount.nanos } : {}),
            currencyCode: amount.currencyCode,
          },
        },
        thresholdRules,
        budgetFilter: filter
          ? {
            ...(filter.projects ? { projects: filter.projects } : {}),
            ...(filter.services ? { services: filter.services } : {}),
          }
          : undefined,
        calendarPeriod,
        ...(notificationsRule ? { notificationsRule } : {}),
      };

      let existing: Record<string, unknown> | null = null;

      if (budgetId) {
        const getResp = await request(
          "GET",
          `${baseUrl}v1/${billingAccount}/budgets/${budgetId}`,
          undefined,
          credentials,
        );
        if (getResp.ok) {
          existing = await getResp.json();
        } else if (getResp.status === 404) {
          await getResp.text();
        } else {
          const body = await getResp.text();
          throw new Error(
            `Failed to get budget ${budgetId} (${getResp.status}): ${body}`,
          );
        }
      } else {
        const matches: Record<string, unknown>[] = [];
        let pageToken: string | undefined;
        do {
          let url = `${baseUrl}v1/${billingAccount}/budgets?pageSize=100`;
          if (pageToken) {
            url += `&pageToken=${encodeURIComponent(pageToken)}`;
          }
          const listResp = await request("GET", url, undefined, credentials);
          if (!listResp.ok) {
            const body = await listResp.text();
            throw new Error(
              `Failed to list budgets (${listResp.status}): ${body}`,
            );
          }
          const data = await listResp.json() as {
            budgets?: Record<string, unknown>[];
            nextPageToken?: string;
          };
          if (data.budgets) {
            for (const b of data.budgets) {
              if (b.displayName === displayName) {
                matches.push(b);
              }
            }
          }
          pageToken = data.nextPageToken;
        } while (pageToken);

        if (matches.length > 1) {
          throw new Error(
            `Ambiguous: ${matches.length} budgets with displayName '${displayName}' under ${billingAccount}. ` +
              "Provide an explicit budgetId or ensure the displayName is unique.",
          );
        }
        if (matches.length === 1) {
          existing = matches[0];
        }
      }

      let result: Record<string, unknown>;

      if (existing) {
        const patchBody = { ...budgetBody, etag: existing.etag };
        const patchResp = await request(
          "PATCH",
          `${baseUrl}v1/${existing.name as string}`,
          patchBody,
          credentials,
        );
        if (patchResp.status === 409) {
          const body = await patchResp.text();
          throw new Error(
            `Etag conflict updating budget ${existing
              .name as string}: ${body}. ` +
              "The budget was modified concurrently — retry with fresh state.",
          );
        }
        if (!patchResp.ok) {
          const body = await patchResp.text();
          throw new Error(
            `Failed to update budget ${existing
              .name as string} (${patchResp.status}): ${body}`,
          );
        }
        result = await patchResp.json();
      } else {
        const createResp = await request(
          "POST",
          `${baseUrl}v1/${billingAccount}/budgets`,
          budgetBody,
          credentials,
        );
        if (!createResp.ok) {
          const body = await createResp.text();
          throw new Error(
            `Failed to create budget (${createResp.status}): ${body}`,
          );
        }
        result = await createResp.json();
      }

      const readBackResp = await request(
        "GET",
        `${baseUrl}v1/${result.name as string}`,
        undefined,
        credentials,
      );
      if (!readBackResp.ok) {
        const body = await readBackResp.text();
        throw new Error(
          `Read-back verification failed for ${result
            .name as string} (${readBackResp.status}): ${body}`,
        );
      }
      const verified = await readBackResp.json() as Record<string, unknown>;

      const instanceName = (verified.name as string)
        .replace(/[\/\\]/g, "_")
        .replace(/\.\./g, "_")
        .replace(/\0/g, "");
      const handle = await context.writeResource(
        "state",
        instanceName,
        verified,
      );
      return { dataHandles: [handle] };
    },
  },
};

const StateSchema = z.object({
  amount: z.object({
    lastPeriodAmount: z.object({}),
    specifiedAmount: z.object({
      currencyCode: z.string(),
      nanos: z.number(),
      units: z.string(),
    }),
  }).optional(),
  budgetFilter: z.object({
    calendarPeriod: z.string(),
    creditTypes: z.array(z.string()),
    creditTypesTreatment: z.string(),
    customPeriod: z.object({
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
    }),
    labels: z.record(z.string(), z.unknown()),
    projects: z.array(z.string()),
    resourceAncestors: z.array(z.string()),
    services: z.array(z.string()),
    subaccounts: z.array(z.string()),
  }).optional(),
  displayName: z.string().optional(),
  etag: z.string().optional(),
  name: z.string(),
  notificationsRule: z.object({
    disableDefaultIamRecipients: z.boolean(),
    enableProjectLevelRecipients: z.boolean(),
    monitoringNotificationChannels: z.array(z.string()),
    pubsubTopic: z.string(),
    schemaVersion: z.string(),
  }).optional(),
  ownershipScope: z.string().optional(),
  thresholdRules: z.array(z.object({
    spendBasis: z.string(),
    thresholdPercent: z.number(),
  })).optional(),
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
  amount: z.object({
    lastPeriodAmount: z.object({}).describe(
      "Use the last period's actual spend as the budget for the present period. LastPeriodAmount can only be set when the budget's time period is a Filter.calendar_period. It cannot be set in combination with Filter.custom_period.",
    ).optional(),
    specifiedAmount: z.object({
      currencyCode: z.string().describe(
        "The three-letter currency code defined in ISO 4217.",
      ).optional(),
      nanos: z.number().int().describe(
        "Number of nano (10^-9) units of the amount. The value must be between -999,999,999 and +999,999,999 inclusive. If `units` is positive, `nanos` must be positive or zero. If `units` is zero, `nanos` can be positive, zero, or negative. If `units` is negative, `nanos` must be negative or zero. For example $-1.75 is represented as `units`=-1 and `nanos`=-750,000,000.",
      ).optional(),
      units: z.string().describe(
        'The whole units of the amount. For example if `currencyCode` is `"USD"`, then 1 unit is one US dollar.',
      ).optional(),
    }).describe(
      "A specified amount to use as the budget. `currency_code` is optional. If specified when creating a budget, it must match the currency of the billing account. If specified when updating a budget, it must match the currency_code of the existing budget. The `currency_code` is provided on output.",
    ).optional(),
  }).describe("Required. Budgeted amount.").optional(),
  budgetFilter: z.object({
    calendarPeriod: z.enum([
      "CALENDAR_PERIOD_UNSPECIFIED",
      "MONTH",
      "QUARTER",
      "YEAR",
    ]).describe(
      "Optional. Specifies to track usage for recurring calendar period. For example, assume that CalendarPeriod.QUARTER is set. The budget tracks usage from April 1 to June 30, when the current calendar month is April, May, June. After that, it tracks usage from July 1 to September 30 when the current calendar month is July, August, September, so on.",
    ).optional(),
    creditTypes: z.array(z.string()).describe(
      "Optional. If Filter.credit_types_treatment is INCLUDE_SPECIFIED_CREDITS, this is a list of credit types to be subtracted from gross cost to determine the spend for threshold calculations. See [a list of acceptable credit type values](https://cloud.google.com/billing/docs/how-to/export-data-bigquery-tables#credits-type). If Filter.credit_types_treatment is **not** INCLUDE_SPECIFIED_CREDITS, this field must be empty.",
    ).optional(),
    creditTypesTreatment: z.enum([
      "CREDIT_TYPES_TREATMENT_UNSPECIFIED",
      "INCLUDE_ALL_CREDITS",
      "EXCLUDE_ALL_CREDITS",
      "INCLUDE_SPECIFIED_CREDITS",
    ]).describe(
      "Optional. If not set, default behavior is `INCLUDE_ALL_CREDITS`.",
    ).optional(),
    customPeriod: z.object({
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
        "Optional. The end date of the time period. Budgets with elapsed end date won't be processed. If unset, specifies to track all usage incurred since the start_date.",
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
      }).describe("Required. The start date must be after January 1, 2017.")
        .optional(),
    }).describe(
      "Optional. Specifies to track usage from any start date (required) to any end date (optional). This time period is static, it does not recur.",
    ).optional(),
    labels: z.record(z.string(), z.array(z.string())).describe(
      'Optional. A single label and value pair specifying that usage from only this set of labeled resources should be included in the budget. If omitted, the report includes all labeled and unlabeled usage. An object containing a single `"key": value` pair. Example: `{ "name": "wrench" }`. _Currently, multiple entries or multiple values per entry are not allowed._',
    ).optional(),
    projects: z.array(z.string()).describe(
      "Optional. A set of projects of the form `projects/{project}`, specifying that usage from only this set of projects should be included in the budget. If omitted, the report includes all usage for the billing account, regardless of which project the usage occurred on.",
    ).optional(),
    resourceAncestors: z.array(z.string()).describe(
      "Optional. A set of folder and organization names of the form `folders/{folderId}` or `organizations/{organizationId}`, specifying that usage from only this set of folders and organizations should be included in the budget. If omitted, the budget includes all usage that the billing account pays for. If the folder or organization contains projects that are paid for by a different Cloud Billing account, the budget *doesn't* apply to those projects.",
    ).optional(),
    services: z.array(z.string()).describe(
      "Optional. A set of services of the form `services/{service_id}`, specifying that usage from only this set of services should be included in the budget. If omitted, the report includes usage for all the services. The service names are available through the Catalog API: https://cloud.google.com/billing/v1/how-tos/catalog-api.",
    ).optional(),
    subaccounts: z.array(z.string()).describe(
      "Optional. A set of subaccounts of the form `billingAccounts/{account_id}`, specifying that usage from only this set of subaccounts should be included in the budget. If a subaccount is set to the name of the parent account, usage from the parent account is included. If the field is omitted, the report includes usage from the parent account and all subaccounts, if they exist.",
    ).optional(),
  }).describe(
    "Optional. Filters that define which resources are used to compute the actual spend against the budget amount, such as projects, services, and the budget's time period, as well as other filters.",
  ).optional(),
  displayName: z.string().describe(
    "User data for display name in UI. The name must be less than or equal to 60 characters.",
  ).optional(),
  notificationsRule: z.object({
    disableDefaultIamRecipients: z.boolean().describe(
      "Optional. When set to true, disables default notifications sent when a threshold is exceeded. Default notifications are sent to those with Billing Account Administrator and Billing Account User IAM roles for the target account.",
    ).optional(),
    enableProjectLevelRecipients: z.boolean().describe(
      "Optional. When set to true, and when the budget has a single project configured, notifications will be sent to project level recipients of that project. This field will be ignored if the budget has multiple or no project configured. Currently, project level recipients are the users with `Owner` role on a cloud project.",
    ).optional(),
    monitoringNotificationChannels: z.array(z.string()).describe(
      "Optional. Email targets to send notifications to when a threshold is exceeded. This is in addition to the `DefaultIamRecipients` who receive alert emails based on their billing account IAM role. The value is the full REST resource name of a Cloud Monitoring email notification channel with the form `projects/{project_id}/notificationChannels/{channel_id}`. A maximum of 5 email notifications are allowed. To customize budget alert email recipients with monitoring notification channels, you _must create the monitoring notification channels before you link them to a budget_. For guidance on setting up notification channels to use with budgets, see [Customize budget alert email recipients](https://cloud.google.com/billing/docs/how-to/budgets-notification-recipients). For Cloud Billing budget alerts, you _must use email notification channels_. The other types of notification channels are _not_ supported, such as Slack, SMS, or PagerDuty. If you want to [send budget notifications to Slack](https://cloud.google.com/billing/docs/how-to/notify#send_notifications_to_slack), use a pubsubTopic and configure [programmatic notifications](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications).",
    ).optional(),
    pubsubTopic: z.string().describe(
      "Optional. The name of the Pub/Sub topic where budget-related messages are published, in the form `projects/{project_id}/topics/{topic_id}`. Updates are sent to the topic at regular intervals; the timing of the updates is not dependent on the [threshold rules](#thresholdrule) you've set. Note that if you want your [Pub/Sub JSON object](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#notification_format) to contain data for `alertThresholdExceeded`, you need at least one [alert threshold rule](#thresholdrule). When you set threshold rules, you must also enable at least one of the email notification options, either using the default IAM recipients or Cloud Monitoring email notification channels. To use Pub/Sub topics with budgets, you must do the following: 1. Create the Pub/Sub topic before connecting it to your budget. For guidance, see [Manage programmatic budget alert notifications](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications). 2. Grant the API caller the `pubsub.topics.setIamPolicy` permission on the Pub/Sub topic. If not set, the API call fails with PERMISSION_DENIED. For additional details on Pub/Sub roles and permissions, see [Permissions required for this task](https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#permissions_required_for_this_task).",
    ).optional(),
    schemaVersion: z.string().describe(
      'Optional. Required when NotificationsRule.pubsub_topic is set. The schema version of the notification sent to NotificationsRule.pubsub_topic. Only "1.0" is accepted. It represents the JSON schema as defined in https://cloud.google.com/billing/docs/how-to/budgets-programmatic-notifications#notification_format.',
    ).optional(),
  }).describe(
    "Optional. Rules to apply to notifications sent based on budget spend and thresholds.",
  ).optional(),
  ownershipScope: z.enum([
    "OWNERSHIP_SCOPE_UNSPECIFIED",
    "ALL_USERS",
    "BILLING_ACCOUNT",
  ]).optional(),
  thresholdRules: z.array(z.object({
    spendBasis: z.enum([
      "BASIS_UNSPECIFIED",
      "CURRENT_SPEND",
      "FORECASTED_SPEND",
    ]).describe(
      "Optional. The type of basis used to determine if spend has passed the threshold. Behavior defaults to CURRENT_SPEND if not set.",
    ).optional(),
    thresholdPercent: z.number().describe(
      "Required. Send an alert when this threshold is exceeded. This is a 1.0-based percentage, so 0.5 = 50%. Validation: non-negative number.",
    ).optional(),
  })).describe(
    "Optional. Rules that trigger alerts (notifications of thresholds being crossed) when spend exceeds the specified percentages of the budget. Optional for `pubsubTopic` notifications. Required if using email notifications.",
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

/** Swamp extension model for Google Cloud Billing Budget Budgets. Registered at `@swamp/gcp/billingbudgets/budgets`. */
export const model = {
  type: "@swamp/gcp/billingbudgets/budgets",
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
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "A budget is a plan that describes what you expect to spend on Cloud projects,...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a budgets",
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
        if (g["amount"] !== undefined) body["amount"] = g["amount"];
        if (g["budgetFilter"] !== undefined) {
          body["budgetFilter"] = g["budgetFilter"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["notificationsRule"] !== undefined) {
          body["notificationsRule"] = g["notificationsRule"];
        }
        if (g["ownershipScope"] !== undefined) {
          body["ownershipScope"] = g["ownershipScope"];
        }
        if (g["thresholdRules"] !== undefined) {
          body["thresholdRules"] = g["thresholdRules"];
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
      description: "Get a budgets",
      arguments: z.object({
        identifier: z.string().describe("The name of the budgets"),
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
      description: "Update budgets attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific budgets by name (e.g. one discovered by list)",
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
        if (g["amount"] !== undefined) body["amount"] = g["amount"];
        if (g["budgetFilter"] !== undefined) {
          body["budgetFilter"] = g["budgetFilter"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["notificationsRule"] !== undefined) {
          body["notificationsRule"] = g["notificationsRule"];
        }
        if (g["ownershipScope"] !== undefined) {
          body["ownershipScope"] = g["ownershipScope"];
        }
        if (g["thresholdRules"] !== undefined) {
          body["thresholdRules"] = g["thresholdRules"];
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
      description: "Delete the budgets",
      arguments: z.object({
        identifier: z.string().describe("The name of the budgets"),
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
      description: "Sync budgets state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific budgets by name (e.g. one discovered by list)",
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
      description: "List budgets resources",
      arguments: z.object({
        pageSize: z.number().describe(
          "Optional. The maximum number of budgets to return per page. The default and maximum value are 100.",
        ).optional(),
        scope: z.string().describe(
          'Optional. Set the scope of the budgets to be returned, in the format of the resource name. The scope of a budget is the cost that it tracks, such as costs for a single project, or the costs for all projects in a folder. Only project scope (in the format of "projects/project-id" or "projects/123") is supported in this field. When this field is set to a project\'s resource name, the budgets returned are tracking the costs for that project.',
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
        if (args["scope"] !== undefined) {
          params["scope"] = String(args["scope"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "budgets",
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
    ...budgetEnsureMethods,
  },
};
