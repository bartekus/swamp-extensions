// deno-lint-ignore-file no-import-prefix

import { z } from "npm:zod@4.3.6";

export const budgetEnsureMethods = {
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
