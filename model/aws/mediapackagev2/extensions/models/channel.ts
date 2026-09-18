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

// Auto-generated extension model for @swamp/aws/mediapackagev2/channel
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for MediaPackageV2 Channel (AWS::MediaPackageV2::Channel).
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

const TagSchema = z.object({
  Key: z.string().optional(),
  Value: z.string().optional(),
});

const GlobalArgsSchema = z.object({
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
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
  ChannelGroupName: z.string().min(1).max(256).regex(
    new RegExp("^[a-zA-Z0-9_-]+$"),
  ),
  ChannelName: z.string().min(1).max(256).regex(new RegExp("^[a-zA-Z0-9_-]+$")),
  Description: z.string().min(0).max(1024).describe(
    "Enter any descriptive text that helps you to identify the channel.",
  ).optional(),
  InputSwitchConfiguration: z.object({
    MQCSInputSwitching: z.boolean().describe(
      "When true, AWS Elemental MediaPackage performs input switching based on the MQCS. Default is false. This setting is valid only when InputType is CMAF.",
    ).optional(),
    PreferredInput: z.number().int().min(1).max(2).describe(
      "For CMAF inputs, indicates which input MediaPackage should prefer when both inputs have equal MQCS scores. Select 1 to prefer the first ingest endpoint, or 2 to prefer the second ingest endpoint. If you don't specify a preferred input, MediaPackage uses its default switching behavior when MQCS scores are equal.",
    ).optional(),
  }).describe(
    "The configuration for input switching based on the media quality confidence score (MQCS) as provided from AWS Elemental MediaLive.",
  ).optional(),
  InputType: z.enum(["HLS", "CMAF", "MULTIVIEW"]).optional(),
  MultiviewConfiguration: z.object({
    AvailableSources: z.array(
      z.string().min(1).max(256).regex(new RegExp("^[a-zA-Z0-9_-]+$")),
    ).describe(
      "The channels that players can use as tiles in this multiview channel's output. Each source channel must be in the same channel group as the multiview channel, and must have an InputType of CMAF. Only the channels that you list here are available as tiles.",
    ),
    AvailableLayouts: z.array(
      z.enum([
        "LAYOUT_2EH",
        "LAYOUT_2PL",
        "LAYOUT_3EL",
        "LAYOUT_3PL",
        "LAYOUT_4E",
        "LAYOUT_4PL",
      ]),
    ).describe(
      "The tile layouts that players can request from this multiview channel's origin endpoints. Only the layouts that you list here are available. Each layout must appear at most once.",
    ),
  }).describe(
    "The multiview configuration for a channel. A multiview channel composites video from several source channels into a single tiled output stream. Players receive one standard HLS or DASH stream instead of several separate streams. This setting is required when InputType is MULTIVIEW, and can't be set for any other input type.",
  ).optional(),
  OutputHeaderConfiguration: z.object({
    PublishMQCS: z.boolean().describe(
      "When true, AWS Elemental MediaPackage includes the MQCS in responses to the CDN. This setting is valid only when InputType is CMAF.",
    ).optional(),
  }).describe(
    "The settings for what common media server data (CMSD) headers AWS Elemental MediaPackage includes in responses to the CDN.",
  ).optional(),
  OutputLockingMode: z.enum(["EPOCH_LOCKED", "NON_EPOCH_LOCKED"]).optional(),
  Tags: z.array(TagSchema).optional(),
});

const StateSchema = z.object({
  Arn: z.string(),
  AttachedMultiviewChannels: z.array(z.string()).optional(),
  ChannelGroupName: z.string().optional(),
  ChannelName: z.string().optional(),
  CreatedAt: z.string().optional(),
  Description: z.string().optional(),
  IngestEndpoints: z.array(z.object({
    Id: z.string(),
    Url: z.string(),
  })).optional(),
  InputSwitchConfiguration: z.object({
    MQCSInputSwitching: z.boolean(),
    PreferredInput: z.number(),
  }).optional(),
  InputType: z.string().optional(),
  ModifiedAt: z.string().optional(),
  MultiviewConfiguration: z.object({
    AvailableSources: z.array(z.string()),
    AvailableLayouts: z.array(z.string()),
  }).optional(),
  OutputHeaderConfiguration: z.object({
    PublishMQCS: z.boolean(),
  }).optional(),
  OutputLockingMode: z.string().optional(),
  IngestEndpointUrls: z.array(z.string()).optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  ChannelGroupName: z.string().min(1).max(256).regex(
    new RegExp("^[a-zA-Z0-9_-]+$"),
  ).optional(),
  ChannelName: z.string().min(1).max(256).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .optional(),
  Description: z.string().min(0).max(1024).describe(
    "Enter any descriptive text that helps you to identify the channel.",
  ).optional(),
  InputSwitchConfiguration: z.object({
    MQCSInputSwitching: z.boolean().describe(
      "When true, AWS Elemental MediaPackage performs input switching based on the MQCS. Default is false. This setting is valid only when InputType is CMAF.",
    ).optional(),
    PreferredInput: z.number().int().min(1).max(2).describe(
      "For CMAF inputs, indicates which input MediaPackage should prefer when both inputs have equal MQCS scores. Select 1 to prefer the first ingest endpoint, or 2 to prefer the second ingest endpoint. If you don't specify a preferred input, MediaPackage uses its default switching behavior when MQCS scores are equal.",
    ).optional(),
  }).describe(
    "The configuration for input switching based on the media quality confidence score (MQCS) as provided from AWS Elemental MediaLive.",
  ).optional(),
  InputType: z.enum(["HLS", "CMAF", "MULTIVIEW"]).optional(),
  MultiviewConfiguration: z.object({
    AvailableSources: z.array(
      z.string().min(1).max(256).regex(new RegExp("^[a-zA-Z0-9_-]+$")),
    ).describe(
      "The channels that players can use as tiles in this multiview channel's output. Each source channel must be in the same channel group as the multiview channel, and must have an InputType of CMAF. Only the channels that you list here are available as tiles.",
    ).optional(),
    AvailableLayouts: z.array(
      z.enum([
        "LAYOUT_2EH",
        "LAYOUT_2PL",
        "LAYOUT_3EL",
        "LAYOUT_3PL",
        "LAYOUT_4E",
        "LAYOUT_4PL",
      ]),
    ).describe(
      "The tile layouts that players can request from this multiview channel's origin endpoints. Only the layouts that you list here are available. Each layout must appear at most once.",
    ).optional(),
  }).describe(
    "The multiview configuration for a channel. A multiview channel composites video from several source channels into a single tiled output stream. Players receive one standard HLS or DASH stream instead of several separate streams. This setting is required when InputType is MULTIVIEW, and can't be set for any other input type.",
  ).optional(),
  OutputHeaderConfiguration: z.object({
    PublishMQCS: z.boolean().describe(
      "When true, AWS Elemental MediaPackage includes the MQCS in responses to the CDN. This setting is valid only when InputType is CMAF.",
    ).optional(),
  }).describe(
    "The settings for what common media server data (CMSD) headers AWS Elemental MediaPackage includes in responses to the CDN.",
  ).optional(),
  OutputLockingMode: z.enum(["EPOCH_LOCKED", "NON_EPOCH_LOCKED"]).optional(),
  Tags: z.array(TagSchema).optional(),
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

/** Swamp extension model for MediaPackageV2 Channel. Registered at `@swamp/aws/mediapackagev2/channel`. */
export const model = {
  type: "@swamp/aws/mediapackagev2/channel",
  version: "2026.09.18.1",
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
      toVersion: "2026.05.29.1",
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
      toVersion: "2026.08.04.1",
      description: "Added: OutputLockingMode",
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
      toVersion: "2026.09.18.1",
      description: "Added: MultiviewConfiguration",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "MediaPackageV2 Channel resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a MediaPackageV2 Channel",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const desiredState: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(g)) {
          if (key === "name") continue;
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await createResource(
          "AWS::MediaPackageV2::Channel",
          desiredState,
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
      description: "Get a MediaPackageV2 Channel",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the MediaPackageV2 Channel",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::MediaPackageV2::Channel",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName =
          (context.globalArgs.name?.toString() ?? args.identifier).replace(
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
      description: "Update a MediaPackageV2 Channel",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.name?.toString() ?? "current").replace(
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
        const identifier = existing.Arn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::MediaPackageV2::Channel",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (key === "name") continue;
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::MediaPackageV2::Channel",
          identifier,
          currentState,
          desiredState,
          ["ChannelGroupName", "ChannelName", "InputType", "OutputLockingMode"],
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
      description: "Delete a MediaPackageV2 Channel",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the MediaPackageV2 Channel",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::MediaPackageV2::Channel",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.name?.toString() ?? args.identifier).replace(
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
      description: "Sync MediaPackageV2 Channel state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.name?.toString() ?? "current").replace(
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
        const identifier = existing.Arn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::MediaPackageV2::Channel",
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
      description: "List MediaPackageV2 Channel resources",
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
          "AWS::MediaPackageV2::Channel",
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
            (item.properties?.Arn?.toString() ?? item.identifier).replace(
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
  },
};
