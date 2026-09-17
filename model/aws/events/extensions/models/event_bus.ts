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

// Auto-generated extension model for @swamp/aws/events/event-bus
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Events EventBus (AWS::Events::EventBus).
 *
 * Wraps the CloudFormation resource type as a swamp model so create,
 * get, update, delete, sync, and list can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  deleteResource,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/aws.ts";
import type { AwsCredentials } from "./_lib/aws.ts";
import {
  EventBridgeClient,
  PutEventsCommand,
  type PutEventsRequestEntry,
} from "npm:@aws-sdk/client-eventbridge@3.1127.0";
import { NodeHttpHandler } from "npm:@smithy/node-http-handler@4.9.7";

const TagSchema = z.object({
  Key: z.string(),
  Value: z.string(),
});

const GlobalArgsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).describe(
    "AWS access key ID; overrides AWS_ACCESS_KEY_ID environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).describe(
    "AWS secret access key; overrides AWS_SECRET_ACCESS_KEY environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  sessionToken: z.string().meta({ sensitive: true }).describe(
    "AWS session token for temporary credentials; overrides AWS_SESSION_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  region: z.string().describe(
    "AWS region; overrides AWS_REGION / AWS_DEFAULT_REGION environment variables and ~/.aws/config profile region. Defaults to us-east-1.",
  ).optional(),
  EventSourceName: z.string().describe(
    "If you are creating a partner event bus, this specifies the partner event source that the new event bus will be matched with.",
  ).optional(),
  Name: z.string().describe("The name of the event bus."),
  Tags: z.array(TagSchema).describe("Any tags assigned to the event bus.")
    .optional(),
  Description: z.string().describe("The description of the event bus.")
    .optional(),
  KmsKeyIdentifier: z.string().describe(
    "Kms Key Identifier used to encrypt events at rest in the event bus.",
  ).optional(),
  Policy: z.record(z.string(), z.unknown()).describe(
    "A JSON string that describes the permission policy statement for the event bus.",
  ).optional(),
  LogConfig: z.object({
    IncludeDetail: z.enum(["FULL", "NONE"]).describe(
      "Configures whether or not to include event detail, input transformer details, target properties, and target input in the applicable log messages.",
    ).optional(),
    Level: z.enum(["INFO", "ERROR", "TRACE", "OFF"]).describe(
      "Configures the log level of the EventBus and determines which log messages are sent to Ingestion Hub for delivery.",
    ).optional(),
  }).describe("The logging configuration settings for vended logs.").optional(),
});

function createClient(
  credentials: AwsCredentials,
): EventBridgeClient {
  if (
    !Deno.env.get("AWS_EC2_METADATA_DISABLED") &&
    !Deno.env.get("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI") &&
    !Deno.env.get("AWS_CONTAINER_CREDENTIALS_FULL_URI")
  ) {
    Deno.env.set("AWS_EC2_METADATA_DISABLED", "true");
  }

  const region = credentials.region ??
    Deno.env.get("AWS_REGION") ??
    Deno.env.get("AWS_DEFAULT_REGION") ??
    "us-east-1";

  const config: Record<string, unknown> = {
    region,
    requestHandler: new NodeHttpHandler(),
  };

  if (credentials.accessKeyId && credentials.secretAccessKey) {
    config.credentials = {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      ...(credentials.sessionToken
        ? { sessionToken: credentials.sessionToken }
        : {}),
    };
  }

  return new EventBridgeClient(config);
}

async function putEvents(
  args: Record<string, unknown>,
  credentials: AwsCredentials,
): Promise<Record<string, unknown>> {
  const client = createClient(credentials);
  const entries = args.entries as Array<Record<string, unknown>>;

  const sdkEntries: PutEventsRequestEntry[] = entries.map((entry) => ({
    Source: entry.Source as string,
    DetailType: entry.DetailType as string,
    Detail: entry.Detail as string,
    ...(entry.EventBusName
      ? { EventBusName: entry.EventBusName as string }
      : {}),
    ...(entry.Resources ? { Resources: entry.Resources as string[] } : {}),
    ...(entry.Time ? { Time: new Date(entry.Time as string) } : {}),
    ...(entry.TraceHeader ? { TraceHeader: entry.TraceHeader as string } : {}),
  }));

  const command = new PutEventsCommand({
    Entries: sdkEntries,
  });

  try {
    const response = await client.send(command);

    const resultEntries: Record<string, unknown>[] = [];
    for (const entry of response.Entries ?? []) {
      resultEntries.push({
        EventId: entry.EventId,
        ...(entry.ErrorCode ? { ErrorCode: entry.ErrorCode } : {}),
        ...(entry.ErrorMessage ? { ErrorMessage: entry.ErrorMessage } : {}),
      });
    }

    return {
      FailedEntryCount: response.FailedEntryCount ?? 0,
      Entries: resultEntries,
    };
  } catch (err: unknown) {
    const error = err as Error & { name: string };
    switch (error.name) {
      case "AccessDeniedException":
        throw new Error(
          `Access denied: ensure the caller has events:PutEvents permission. ${error.message}`,
        );
      case "ValidationException":
        throw new Error(
          `Invalid request: ${error.message}`,
        );
      case "InternalException":
        throw new Error(
          `EventBridge internal error: ${error.message}`,
        );
      default:
        throw error;
    }
  }
}

const StateSchema = z.object({
  EventSourceName: z.string().optional(),
  Name: z.string(),
  Tags: z.array(TagSchema).optional(),
  Description: z.string().optional(),
  KmsKeyIdentifier: z.string().optional(),
  Policy: z.union([z.string(), z.record(z.string(), z.unknown())]).optional(),
  Arn: z.string().optional(),
  DeadLetterConfig: z.object({
    Arn: z.string(),
  }).optional(),
  LogConfig: z.object({
    IncludeDetail: z.string(),
    Level: z.string(),
  }).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  EventSourceName: z.string().describe(
    "If you are creating a partner event bus, this specifies the partner event source that the new event bus will be matched with.",
  ).optional(),
  Name: z.string().describe("The name of the event bus.").optional(),
  Tags: z.array(TagSchema).describe("Any tags assigned to the event bus.")
    .optional(),
  Description: z.string().describe("The description of the event bus.")
    .optional(),
  KmsKeyIdentifier: z.string().describe(
    "Kms Key Identifier used to encrypt events at rest in the event bus.",
  ).optional(),
  Policy: z.record(z.string(), z.unknown()).describe(
    "A JSON string that describes the permission policy statement for the event bus.",
  ).optional(),
  LogConfig: z.object({
    IncludeDetail: z.enum(["FULL", "NONE"]).describe(
      "Configures whether or not to include event detail, input transformer details, target properties, and target input in the applicable log messages.",
    ).optional(),
    Level: z.enum(["INFO", "ERROR", "TRACE", "OFF"]).describe(
      "Configures the log level of the EventBus and determines which log messages are sent to Ingestion Hub for delivery.",
    ).optional(),
  }).describe("The logging configuration settings for vended logs.").optional(),
});

const _credentialKeys = new Set([
  "accessKeyId",
  "secretAccessKey",
  "sessionToken",
  "region",
]);

function _buildCredentials(g: Record<string, unknown>): AwsCredentials {
  return {
    accessKeyId: g.accessKeyId as string | undefined,
    secretAccessKey: g.secretAccessKey as string | undefined,
    sessionToken: g.sessionToken as string | undefined,
    region: g.region as string | undefined,
  };
}

/** Swamp extension model for Events EventBus. Registered at `@swamp/aws/events/event-bus`. */
export const model = {
  type: "@swamp/aws/events/event-bus",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
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
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.06.1",
      description: "Added: accessKeyId, secretAccessKey, sessionToken, region",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.2",
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
      description: "Events EventBus resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Events EventBus",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const desiredState: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await createResource(
          "AWS::Events::EventBus",
          desiredState,
          credentials,
        ) as StateData;
        const instanceName = ((result.Name ?? g.Name)?.toString() ?? "current")
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
      description: "Get a Events EventBus",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Events EventBus",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Events::EventBus",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName =
          ((result.Name ?? context.globalArgs.Name)?.toString() ??
            args.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
            .replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update a Events EventBus",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.Name?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.Name?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::Events::EventBus",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::Events::EventBus",
          identifier,
          currentState,
          desiredState,
          ["Name"],
          credentials,
        );
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete a Events EventBus",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Events EventBus",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Events::EventBus",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.Name?.toString() ?? args.identifier).replace(
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
      description: "Sync Events EventBus state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.Name?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.Name?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::Events::EventBus",
            identifier,
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
              identifier,
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
      description: "List Events EventBus resources",
      arguments: z.object({
        maxPages: z.number().describe(
          "Maximum number of pages to fetch (default: 10)",
        ).optional(),
        resourceModel: z.string().describe(
          "JSON resource model for parent-scoped listing (e.g. parent identifier)",
        ).optional(),
      }),
      execute: async (
        args: { maxPages?: number; resourceModel?: string },
        context: any,
      ) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { items, nextToken } = await listResources(
          "AWS::Events::EventBus",
          {
            resourceModel: args.resourceModel,
            maxPages: args.maxPages,
            credentials,
          },
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const instanceName =
            (item.properties?.Name?.toString() ?? item.identifier).replace(
              /[\/\\]/g,
              "_",
            ).replace(/\.\./g, "_").replace(/\0/g, "");
          const handle = await context.writeResource("state", instanceName, {
            ...item.properties,
            _identifier: item.identifier,
          });
          dataHandles.push(handle);
        }
        return {
          dataHandles,
          result: { count: items.length, nextPageToken: nextToken },
        };
      },
    },
    put_events: {
      description:
        "Send custom events to this EventBridge event bus via the PutEvents API",
      arguments: z.object({
        entries: z.array(z.object({
          Source: z.string().describe("The source of the event"),
          DetailType: z.string().describe(
            "Free-form string used to decide what fields to expect in the event detail",
          ),
          Detail: z.string().describe(
            "A valid JSON object (as a string) containing the event payload",
          ),
          EventBusName: z.string().describe(
            "The name or ARN of the event bus to receive the event — defaults to the bus this model manages",
          ).optional(),
          Resources: z.array(z.string()).describe(
            "AWS resources involved in the event",
          ).optional(),
          Time: z.string().describe("The timestamp of the event (ISO 8601)")
            .optional(),
          TraceHeader: z.string().describe(
            "An X-Ray trace header for event tracing",
          ).optional(),
        })).describe("The event entries to send (max 10 per call)"),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const mergedArgs = { ...context.globalArgs, ...args };
        const result = await putEvents(mergedArgs, credentials);
        const argKeys = Object.keys(args).filter((k) => args[k] !== undefined);
        const suffix = argKeys.length > 0
          ? "-" + argKeys.map((k) => String(args[k])).join("-")
          : "";
        const instanceName = ("put_events" + suffix).replace(/[\/\\]/g, "_")
          .replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
  },
};
