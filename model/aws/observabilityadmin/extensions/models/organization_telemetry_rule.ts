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

// Auto-generated extension model for @swamp/aws/observabilityadmin/organization-telemetry-rule
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for ObservabilityAdmin OrganizationTelemetryRule (AWS::ObservabilityAdmin::OrganizationTelemetryRule).
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

const VPCFlowLogParametersSchema = z.object({
  LogFormat: z.string().describe(
    "The fields to include in the flow log record. If you omit this parameter, the flow log is created using the default format.",
  ).optional(),
  TrafficType: z.string().describe(
    "The type of traffic captured for the flow log. Default is ALL",
  ).optional(),
  MaxAggregationInterval: z.number().int().describe(
    "The maximum interval of time, in seconds, during which a flow of packets is captured and aggregated into a flow log record. Default is 600s.",
  ).optional(),
});

const AdvancedFieldSelectorSchema = z.object({
  Field: z.string().min(1).max(1000).describe(
    "A field in a CloudTrail event record on which to filter events to be logged",
  ).optional(),
  EndsWith: z.array(z.string()).describe(
    "An operator that includes events that match the last few characters of the event record field specified as the value of Field.",
  ).optional(),
  Equals: z.array(z.string()).describe(
    "An operator that includes events that match the exact value of the event record field specified as the value of Field.",
  ).optional(),
  NotEndsWith: z.array(z.string()).describe(
    "An operator that excludes events that match the last few characters of the event record field specified as the value of Field.",
  ).optional(),
  NotEquals: z.array(z.string()).describe(
    "An operator that excludes events that match the exact value of the event record field specified as the value of Field.",
  ).optional(),
  NotStartsWith: z.array(z.string()).describe(
    "An operator that excludes events that match the first few characters of the event record field specified as the value of Field.",
  ).optional(),
  StartsWith: z.array(z.string()).describe(
    "An operator that includes events that match the first few characters of the event record field specified as the value of Field.",
  ).optional(),
});

const AdvancedEventSelectorSchema = z.object({
  Name: z.string().describe(
    "An optional descriptive name for the advanced event selector",
  ).optional(),
  FieldSelectors: z.array(AdvancedFieldSelectorSchema).describe(
    "Contains all selector statements in an advanced event selector.",
  ),
});

const CloudtrailParametersSchema = z.object({
  AdvancedEventSelectors: z.array(AdvancedEventSelectorSchema).describe(
    "Create fine-grained selectors for AWS CloudTrail management and data.",
  ),
});

const ELBLoadBalancerLoggingParametersSchema = z.object({
  OutputFormat: z.enum(["plain", "json"]).optional(),
  FieldDelimiter: z.string().describe("A delimiter to delineate log fields")
    .optional(),
});

const SingleHeaderSchema = z.object({
  Name: z.string().min(1).max(64).describe("The name of the header"),
});

const FieldToMatchSchema = z.object({
  SingleHeader: SingleHeaderSchema.describe("Header for the field to match.")
    .optional(),
  UriPath: z.string().describe("This is the URI path to match this rule to.")
    .optional(),
  QueryString: z.string().describe(
    "The query string to find the resource to match this field to.",
  ).optional(),
  Method: z.string().describe("The method with which to match this rule.")
    .optional(),
});

const ActionConditionSchema = z.object({
  Action: z.enum([
    "ALLOW",
    "BLOCK",
    "COUNT",
    "CAPTCHA",
    "CHALLENGE",
    "EXCLUDED_AS_COUNT",
  ]).describe("The enumerated action to take.").optional(),
});

const LabelNameConditionSchema = z.object({
  LabelName: z.string().min(1).max(1024).regex(
    new RegExp("^[0-9A-Za-z_\\-:]+$"),
  ).describe("The label name of the condition.").optional(),
});

const ConditionSchema = z.object({
  ActionCondition: ActionConditionSchema.describe(
    "The condition of the action desired in the filter.",
  ).optional(),
  LabelNameCondition: LabelNameConditionSchema.describe(
    "The label name of the condition.",
  ).optional(),
});

const FilterSchema = z.object({
  Behavior: z.enum(["KEEP", "DROP"]).describe(
    "The behavior required of the filter.",
  ).optional(),
  Requirement: z.enum(["MEETS_ALL", "MEETS_ANY"]).describe(
    "The requirement portion of the filter.",
  ).optional(),
  Conditions: z.array(ConditionSchema).describe(
    "A list of conditions for a filter.",
  ).optional(),
});

const LoggingFilterSchema = z.object({
  Filters: z.array(FilterSchema).describe("A list of filters to be applied.")
    .optional(),
  DefaultBehavior: z.enum(["KEEP", "DROP"]).describe(
    "The behavior required of the filter.",
  ).optional(),
});

const WAFLoggingParametersSchema = z.object({
  RedactedFields: z.array(FieldToMatchSchema).describe(
    "Fields not to be included in the logs.",
  ).optional(),
  LoggingFilter: LoggingFilterSchema.describe(
    "Default handling for logs that don't match any of the specified filtering conditions.",
  ).optional(),
  LogType: z.enum(["WAF_LOGS"]).describe(
    "The type of logs to generate for WAF.",
  ).optional(),
});

const TelemetryDestinationConfigurationSchema = z.object({
  DestinationType: z.enum(["cloud-watch-logs"]).describe(
    "Type of telemetry destination",
  ).optional(),
  DestinationPattern: z.string().describe(
    "Pattern for telemetry data destination",
  ).optional(),
  RetentionInDays: z.number().int().describe(
    "Number of days to retain the telemetry data in the specified destination",
  ).optional(),
  KmsKeyArn: z.string().min(1).max(2048).regex(
    new RegExp(
      "^arn:aws[a-zA-Z-]*:kms:[a-z0-9-]+:\\d{12}:key/(mrk-)?[a-f0-9-]+$",
    ),
  ).describe(
    "The Amazon Resource Name (ARN) of the customer-managed AWS KMS key used to encrypt the destination log groups specified in the Telemetry Rule.",
  ).optional(),
  VPCFlowLogParameters: VPCFlowLogParametersSchema.describe(
    "Telemetry parameters for VPC Flow logs",
  ).optional(),
  CloudtrailParameters: CloudtrailParametersSchema.describe(
    "Telemetry parameters for Cloudtrail",
  ).optional(),
  ELBLoadBalancerLoggingParameters: ELBLoadBalancerLoggingParametersSchema
    .describe("Telemetry parameters for ELB/NLB Load Balancer Logs").optional(),
  WAFLoggingParameters: WAFLoggingParametersSchema.describe(
    "Telemetry parameters for WAF v2 Web ACL",
  ).optional(),
  LogDeliveryParameters: z.object({
    LogTypes: z.array(
      z.enum([
        "SECURITY_FINDING_LOGS",
        "ALB_ACCESS_LOGS",
        "ALB_CONNECTION_LOGS",
        "ALB_HEALTH_CHECK_LOGS",
      ]),
    ).describe("Types of logs to deliver").optional(),
  }).describe("Parameters for log delivery configuration").optional(),
});

const TagSchema = z.object({
  Key: z.string().min(1).max(128).describe(
    "The key name of the tag. You can specify a value that is 1 to 128 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ),
  Value: z.string().min(0).max(256).describe(
    "The value for the tag. You can specify a value that is 0 to 256 Unicode characters in length and cannot be prefixed with aws:. You can use any of the following characters: the set of Unicode letters, digits, whitespace, _,., /, =, +, and -.",
  ),
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
  RuleName: z.string().min(1).max(100).regex(new RegExp("^[0-9A-Za-z-]+$"))
    .describe("The name of the organization telemetry rule"),
  Rule: z.object({
    ResourceType: z.enum([
      "AWS::EC2::VPC",
      "AWS::WAFv2::WebACL",
      "AWS::CloudTrail",
      "AWS::EKS::Cluster",
      "AWS::ElasticLoadBalancingV2::LoadBalancer",
      "AWS::EC2::Instance",
      "AWS::SecurityHub::Hub",
    ]).describe(
      "Resource Type associated with the Organization Telemetry Rule",
    ),
    TelemetryType: z.enum(["Logs", "Metrics"]).describe(
      "Telemetry Type associated with the Organization Telemetry Rule",
    ),
    TelemetrySourceTypes: z.array(
      z.enum([
        "VPC_FLOW_LOGS",
        "ROUTE53_RESOLVER_QUERY_LOGS",
        "EKS_AUDIT_LOGS",
        "EKS_AUTHENTICATOR_LOGS",
        "EKS_CONTROLLER_MANAGER_LOGS",
        "EKS_SCHEDULER_LOGS",
        "EKS_API_LOGS",
      ]),
    ).describe("The telemetry source types for a telemetry rule.").optional(),
    DestinationConfiguration: TelemetryDestinationConfigurationSchema.describe(
      "The destination configuration for telemetry data",
    ).optional(),
    Scope: z.string().describe(
      "Selection Criteria on scope level for rule application",
    ).optional(),
    SelectionCriteria: z.string().describe(
      "Selection Criteria on resource level for rule application",
    ).optional(),
    AllowFieldUpdates: z.boolean().describe(
      "When true, configuration drift in managed telemetry resources will be detected and remediated for resource-level fields.",
    ).optional(),
    Regions: z.array(z.string()).describe(
      "List of AWS region codes where the rule should be replicated",
    ).optional(),
    AllRegions: z.boolean().describe(
      "When true, the rule is replicated to all supported regions",
    ).optional(),
  }).describe("The telemetry rule"),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this resource",
  ).optional(),
});

const StateSchema = z.object({
  RuleName: z.string().optional(),
  Rule: z.object({
    ResourceType: z.string(),
    TelemetryType: z.string(),
    TelemetrySourceTypes: z.array(z.string()),
    DestinationConfiguration: TelemetryDestinationConfigurationSchema,
    Scope: z.string(),
    SelectionCriteria: z.string(),
    AllowFieldUpdates: z.boolean(),
    Regions: z.array(z.string()),
    AllRegions: z.boolean(),
  }).optional(),
  RuleArn: z.string(),
  Tags: z.array(TagSchema).optional(),
  RegionStatuses: z.array(z.object({
    Region: z.string(),
    Status: z.string(),
    RuleArn: z.string(),
  })).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  RuleName: z.string().min(1).max(100).regex(new RegExp("^[0-9A-Za-z-]+$"))
    .describe("The name of the organization telemetry rule").optional(),
  Rule: z.object({
    ResourceType: z.enum([
      "AWS::EC2::VPC",
      "AWS::WAFv2::WebACL",
      "AWS::CloudTrail",
      "AWS::EKS::Cluster",
      "AWS::ElasticLoadBalancingV2::LoadBalancer",
      "AWS::EC2::Instance",
      "AWS::SecurityHub::Hub",
    ]).describe("Resource Type associated with the Organization Telemetry Rule")
      .optional(),
    TelemetryType: z.enum(["Logs", "Metrics"]).describe(
      "Telemetry Type associated with the Organization Telemetry Rule",
    ).optional(),
    TelemetrySourceTypes: z.array(
      z.enum([
        "VPC_FLOW_LOGS",
        "ROUTE53_RESOLVER_QUERY_LOGS",
        "EKS_AUDIT_LOGS",
        "EKS_AUTHENTICATOR_LOGS",
        "EKS_CONTROLLER_MANAGER_LOGS",
        "EKS_SCHEDULER_LOGS",
        "EKS_API_LOGS",
      ]),
    ).describe("The telemetry source types for a telemetry rule.").optional(),
    DestinationConfiguration: TelemetryDestinationConfigurationSchema.describe(
      "The destination configuration for telemetry data",
    ).optional(),
    Scope: z.string().describe(
      "Selection Criteria on scope level for rule application",
    ).optional(),
    SelectionCriteria: z.string().describe(
      "Selection Criteria on resource level for rule application",
    ).optional(),
    AllowFieldUpdates: z.boolean().describe(
      "When true, configuration drift in managed telemetry resources will be detected and remediated for resource-level fields.",
    ).optional(),
    Regions: z.array(z.string()).describe(
      "List of AWS region codes where the rule should be replicated",
    ).optional(),
    AllRegions: z.boolean().describe(
      "When true, the rule is replicated to all supported regions",
    ).optional(),
  }).describe("The telemetry rule").optional(),
  Tags: z.array(TagSchema).describe(
    "An array of key-value pairs to apply to this resource",
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

/** Swamp extension model for ObservabilityAdmin OrganizationTelemetryRule. Registered at `@swamp/aws/observabilityadmin/organization-telemetry-rule`. */
export const model = {
  type: "@swamp/aws/observabilityadmin/organization-telemetry-rule",
  version: "2026.09.11.1",
  upgrades: [
    {
      toVersion: "2026.09.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "ObservabilityAdmin OrganizationTelemetryRule resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a ObservabilityAdmin OrganizationTelemetryRule",
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
          "AWS::ObservabilityAdmin::OrganizationTelemetryRule",
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
      description: "Get a ObservabilityAdmin OrganizationTelemetryRule",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the ObservabilityAdmin OrganizationTelemetryRule",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::ObservabilityAdmin::OrganizationTelemetryRule",
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
      description: "Update a ObservabilityAdmin OrganizationTelemetryRule",
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
        const identifier = existing.RuleArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::ObservabilityAdmin::OrganizationTelemetryRule",
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
          "AWS::ObservabilityAdmin::OrganizationTelemetryRule",
          identifier,
          currentState,
          desiredState,
          ["RuleName", "AllRegions"],
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
      description: "Delete a ObservabilityAdmin OrganizationTelemetryRule",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the ObservabilityAdmin OrganizationTelemetryRule",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::ObservabilityAdmin::OrganizationTelemetryRule",
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
      description:
        "Sync ObservabilityAdmin OrganizationTelemetryRule state from AWS",
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
        const identifier = existing.RuleArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::ObservabilityAdmin::OrganizationTelemetryRule",
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
      description:
        "List ObservabilityAdmin OrganizationTelemetryRule resources",
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
          "AWS::ObservabilityAdmin::OrganizationTelemetryRule",
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
            (item.properties?.RuleArn?.toString() ?? item.identifier).replace(
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
