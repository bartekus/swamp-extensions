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

// Auto-generated extension model for @swamp/aws/route53/traffic-policy-instance
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Route53 TrafficPolicyInstance (AWS::Route53::TrafficPolicyInstance).
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
  HostedZoneId: z.string().max(32).regex(new RegExp("^[A-Z0-9]{1,32}$"))
    .describe(
      "The ID of the hosted zone that Amazon Route 53 creates the resource record sets in. The bare ID as Route 53 returns it, without a /hostedzone/ prefix.",
    ),
  Name: z.string().max(1024).regex(new RegExp("^[^A-Z\\s]+\\.$")).describe(
    "The domain name, or subdomain name, for which Amazon Route 53 answers DNS queries by using the resource record sets it creates for this traffic policy instance. Must be lower-case and end with a trailing dot, which is the form Route 53 returns: Route 53 normalizes DNS names, so admitting another form would neither round-trip through Read nor guarantee that a change to this property changes the resource's identity.",
  ),
  TTL: z.number().int().min(0).max(2147483647).describe(
    "The TTL that Amazon Route 53 assigns to all of the resource record sets that it creates in the specified hosted zone.",
  ),
  TrafficPolicyId: z.string().min(1).max(36).regex(
    new RegExp("^[0-9a-f-]{1,36}$"),
  ).describe(
    "The ID of the traffic policy that Amazon Route 53 uses to create resource record sets in the specified hosted zone. Lower-case, as Route 53 returns it.",
  ),
  TrafficPolicyVersion: z.number().int().min(1).max(1000).describe(
    "The version of the traffic policy that Amazon Route 53 uses to create resource record sets in the specified hosted zone.",
  ),
});

const StateSchema = z.object({
  Arn: z.string(),
  Id: z.string().optional(),
  HostedZoneId: z.string().optional(),
  Name: z.string().optional(),
  TTL: z.number().optional(),
  TrafficPolicyId: z.string().optional(),
  TrafficPolicyVersion: z.number().optional(),
  State: z.string().optional(),
  TrafficPolicyType: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  HostedZoneId: z.string().max(32).regex(new RegExp("^[A-Z0-9]{1,32}$"))
    .describe(
      "The ID of the hosted zone that Amazon Route 53 creates the resource record sets in. The bare ID as Route 53 returns it, without a /hostedzone/ prefix.",
    ).optional(),
  Name: z.string().max(1024).regex(new RegExp("^[^A-Z\\s]+\\.$")).describe(
    "The domain name, or subdomain name, for which Amazon Route 53 answers DNS queries by using the resource record sets it creates for this traffic policy instance. Must be lower-case and end with a trailing dot, which is the form Route 53 returns: Route 53 normalizes DNS names, so admitting another form would neither round-trip through Read nor guarantee that a change to this property changes the resource's identity.",
  ).optional(),
  TTL: z.number().int().min(0).max(2147483647).describe(
    "The TTL that Amazon Route 53 assigns to all of the resource record sets that it creates in the specified hosted zone.",
  ).optional(),
  TrafficPolicyId: z.string().min(1).max(36).regex(
    new RegExp("^[0-9a-f-]{1,36}$"),
  ).describe(
    "The ID of the traffic policy that Amazon Route 53 uses to create resource record sets in the specified hosted zone. Lower-case, as Route 53 returns it.",
  ).optional(),
  TrafficPolicyVersion: z.number().int().min(1).max(1000).describe(
    "The version of the traffic policy that Amazon Route 53 uses to create resource record sets in the specified hosted zone.",
  ).optional(),
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

/** Swamp extension model for Route53 TrafficPolicyInstance. Registered at `@swamp/aws/route53/traffic-policy-instance`. */
export const model = {
  type: "@swamp/aws/route53/traffic-policy-instance",
  version: "2026.09.16.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Route53 TrafficPolicyInstance resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Route53 TrafficPolicyInstance",
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
          "AWS::Route53::TrafficPolicyInstance",
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
      description: "Get a Route53 TrafficPolicyInstance",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Route53 TrafficPolicyInstance",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Route53::TrafficPolicyInstance",
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
      description: "Update a Route53 TrafficPolicyInstance",
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
          "AWS::Route53::TrafficPolicyInstance",
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
          "AWS::Route53::TrafficPolicyInstance",
          identifier,
          currentState,
          desiredState,
          ["HostedZoneId", "Name"],
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
      description: "Delete a Route53 TrafficPolicyInstance",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Route53 TrafficPolicyInstance",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Route53::TrafficPolicyInstance",
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
      description: "Sync Route53 TrafficPolicyInstance state from AWS",
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
            "AWS::Route53::TrafficPolicyInstance",
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
      description: "List Route53 TrafficPolicyInstance resources",
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
          "AWS::Route53::TrafficPolicyInstance",
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
