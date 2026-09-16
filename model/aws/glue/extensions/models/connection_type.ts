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

// Auto-generated extension model for @swamp/aws/glue/connection-type
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Glue ConnectionType (AWS::Glue::ConnectionType).
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

const ConnectorPropertySchema = z.object({
  Name: z.string().min(1).max(128).describe("The name of the property."),
  KeyOverride: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .describe("A key name to use when sending this property in API requests.")
    .optional(),
  Required: z.boolean().describe("Indicates whether the property is required."),
  DefaultValue: z.string().describe("The default value for the property.")
    .optional(),
  AllowedValues: z.array(z.string()).describe(
    "A list of allowed values for the property.",
  ).optional(),
  PropertyLocation: z.enum(["HEADER", "BODY", "QUERY_PARAM", "PATH"]).describe(
    "Specifies where this property should be included in REST requests.",
  ).optional(),
  PropertyType: z.enum([
    "USER_INPUT",
    "SECRET",
    "READ_ONLY",
    "UNUSED",
    "SECRET_OR_USER_INPUT",
  ]).describe("The data type of this property."),
});

const SecretConnectorPropertySchema = z.object({
  Name: z.string().min(1).max(128).describe("The name of the property."),
  KeyOverride: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .describe("A key name to use when sending this property in API requests.")
    .optional(),
  Required: z.boolean().describe("Indicates whether the property is required."),
  PropertyLocation: z.enum(["HEADER", "BODY", "QUERY_PARAM", "PATH"]).describe(
    "Specifies where this property should be included in REST requests.",
  ).optional(),
  PropertyType: z.enum(["SECRET"]).describe(
    "The data type of this property. Must be SECRET for secret properties.",
  ),
});

const ClientCredentialsPropertiesSchema = z.object({
  TokenUrl: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  RequestMethod: z.enum(["GET", "POST"]).optional(),
  ContentType: z.enum(["APPLICATION_JSON", "URL_ENCODED"]).optional(),
  ClientId: SecretConnectorPropertySchema.describe(
    "Defines a secret property configuration. SECRET-type properties cannot have DefaultValue or AllowedValues.",
  ).optional(),
  ClientSecret: SecretConnectorPropertySchema.describe(
    "Defines a secret property configuration. SECRET-type properties cannot have DefaultValue or AllowedValues.",
  ).optional(),
  Scope: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  TokenUrlParameters: z.array(ConnectorPropertySchema).optional(),
});

const JWTBearerPropertiesSchema = z.object({
  TokenUrl: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  RequestMethod: z.enum(["GET", "POST"]).optional(),
  ContentType: z.enum(["APPLICATION_JSON", "URL_ENCODED"]).optional(),
  JwtToken: SecretConnectorPropertySchema.describe(
    "Defines a secret property configuration. SECRET-type properties cannot have DefaultValue or AllowedValues.",
  ).optional(),
  TokenUrlParameters: z.array(ConnectorPropertySchema).optional(),
});

const ConnectorAuthorizationCodePropertiesSchema = z.object({
  AuthorizationCodeUrl: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  AuthorizationCode: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  RedirectUri: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  TokenUrl: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  RequestMethod: z.enum(["GET", "POST"]).optional(),
  ContentType: z.enum(["APPLICATION_JSON", "URL_ENCODED"]).optional(),
  ClientId: SecretConnectorPropertySchema.describe(
    "Defines a secret property configuration. SECRET-type properties cannot have DefaultValue or AllowedValues.",
  ).optional(),
  ClientSecret: SecretConnectorPropertySchema.describe(
    "Defines a secret property configuration. SECRET-type properties cannot have DefaultValue or AllowedValues.",
  ).optional(),
  Scope: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  Prompt: ConnectorPropertySchema.describe(
    "Defines a property configuration for connection types.",
  ).optional(),
  TokenUrlParameters: z.array(ConnectorPropertySchema).optional(),
});

const ConnectorOAuth2PropertiesSchema = z.object({
  OAuth2GrantType: z.enum([
    "CLIENT_CREDENTIALS",
    "JWT_BEARER",
    "AUTHORIZATION_CODE",
  ]).describe("The OAuth2 grant type to use."),
  ClientCredentialsProperties: ClientCredentialsPropertiesSchema.describe(
    "OAuth2 client credentials configuration.",
  ).optional(),
  JWTBearerProperties: JWTBearerPropertiesSchema.describe(
    "JWT bearer token configuration.",
  ).optional(),
  AuthorizationCodeProperties: ConnectorAuthorizationCodePropertiesSchema
    .describe("OAuth2 authorization code configuration.").optional(),
});

const BasicAuthenticationPropertiesSchema = z.object({
  Username: SecretConnectorPropertySchema.describe(
    "Defines a secret property configuration. SECRET-type properties cannot have DefaultValue or AllowedValues.",
  ).optional(),
  Password: SecretConnectorPropertySchema.describe(
    "Defines a secret property configuration. SECRET-type properties cannot have DefaultValue or AllowedValues.",
  ).optional(),
});

const CustomAuthenticationPropertiesSchema = z.object({
  AuthenticationParameters: z.array(SecretConnectorPropertySchema),
});

const ResponseConfigurationSchema = z.object({
  ResultPath: z.string().min(1).max(512).regex(
    new RegExp("^\\$(\\.[a-zA-Z0-9_.@\\[\\]\\(\\)-]+)*$"),
  ).describe("JSON path expression for result data location."),
  ErrorPath: z.string().min(1).max(512).regex(
    new RegExp("^\\$(\\.[a-zA-Z0-9_.@\\[\\]\\(\\)-]+)*$"),
  ).describe("JSON path expression for error information location.").optional(),
});

const ResponseExtractionMappingSchema = z.object({
  ContentPath: z.string().min(1).max(512).regex(
    new RegExp("^\\$(\\.[a-zA-Z0-9_.@\\[\\]\\(\\)-]+)*$"),
  ).describe("A JSON path expression to extract a value from response body.")
    .optional(),
  HeaderKey: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .describe(
      "The name of an HTTP response header from which to extract the value.",
    ).optional(),
});

const ExtractedParameterSchema = z.object({
  Key: z.string().min(1).max(128).regex(new RegExp("^[a-zA-Z0-9_-]+$"))
    .describe("The parameter key name.").optional(),
  DefaultValue: z.string().min(1).max(1024).describe("The default value.")
    .optional(),
  PropertyLocation: z.enum(["HEADER", "BODY", "QUERY_PARAM", "PATH"]).describe(
    "Specifies where to place the parameter in requests.",
  ).optional(),
  Value: ResponseExtractionMappingSchema.describe(
    "Defines how to extract values from HTTP responses.",
  ).optional(),
});

const CursorConfigurationSchema = z.object({
  NextPage: ExtractedParameterSchema.describe(
    "Parameter extraction configuration.",
  ),
  LimitParameter: ExtractedParameterSchema.describe(
    "Parameter extraction configuration.",
  ).optional(),
});

const OffsetConfigurationSchema = z.object({
  OffsetParameter: ExtractedParameterSchema.describe(
    "Parameter extraction configuration.",
  ),
  LimitParameter: ExtractedParameterSchema.describe(
    "Parameter extraction configuration.",
  ),
});

const PaginationConfigurationSchema = z.object({
  CursorConfiguration: CursorConfigurationSchema.describe(
    "Cursor-based pagination configuration.",
  ).optional(),
  OffsetConfiguration: OffsetConfigurationSchema.describe(
    "Offset-based pagination configuration.",
  ).optional(),
});

const BetweenConfigurationSchema = z.object({
  LowBoundKey: z.string().describe(
    "The parameter name used for the lower bound value in a BETWEEN filter operation.",
  ).optional(),
  HighBoundKey: z.string().describe(
    "The parameter name used for the upper bound value in a BETWEEN filter operation.",
  ).optional(),
  Template: z.string().describe(
    "A template string for constructing the BETWEEN filter expression.",
  ).optional(),
});

const FilterStringConfigurationSchema = z.object({
  QueryParameterName: z.string().describe(
    "The query parameter name used to send the constructed filter expression string in API requests.",
  ),
  QuoteStringValues: z.boolean().describe(
    "Indicates whether string and date values should be wrapped with a quote character in the filter expression.",
  ).optional(),
  QuoteCharacter: z.string().describe(
    "The character used to quote values when QuoteStringValues is true. Defaults to double quotes if not specified.",
  ).optional(),
});

const FilterConfigurationSchema = z.object({
  FilterMode: z.enum(["QUERY_PARAMS", "FILTER_STRING"]).describe(
    "The strategy for applying filters to requests.",
  ),
  OperatorMappings: z.record(z.string(), z.string()).describe(
    "A map of logical filter operators to their API-specific string representations.",
  ).optional(),
  DateTimeFormat: z.string().describe(
    "The global date and time format for filter expressions.",
  ).optional(),
  StripQuotes: z.boolean().describe(
    "Indicates whether surrounding double quotes should be stripped from filter values before processing.",
  ).optional(),
  BetweenConfiguration: BetweenConfigurationSchema.describe(
    "Configuration that defines how BETWEEN range filter operations are translated into REST API request parameters.",
  ).optional(),
  FilterStringConfiguration: FilterStringConfigurationSchema.describe(
    "Configuration for constructing filter expression strings when using the FILTER_STRING filter mode.",
  ).optional(),
});

const SourceConfigurationSchema = z.object({
  RequestMethod: z.enum(["GET", "POST"]).describe("The HTTP method to use.")
    .optional(),
  RequestPath: z.string().min(1).max(512).regex(
    new RegExp("^/[a-zA-Z0-9._~:/?#\\[\\]@!$&'()*+,;={}-]*$"),
  ).describe("The URL path for the REST endpoint.").optional(),
  RequestParameters: z.array(ConnectorPropertySchema).describe(
    "Request parameters configuration.",
  ).optional(),
  ResponseConfiguration: ResponseConfigurationSchema.describe(
    "Configuration for parsing JSON responses from REST API calls.",
  ).optional(),
  PaginationConfiguration: PaginationConfigurationSchema.describe(
    "Configuration for handling paginated responses.",
  ).optional(),
  FilterConfiguration: FilterConfigurationSchema.describe(
    "Configuration that defines how filter predicates are applied to REST API requests, supporting both query parameter and filter string strategies.",
  ).optional(),
});

const FilterOverridesSchema = z.object({
  FieldName: z.string().describe(
    "An override for the field name to use in filter expressions, if different from the schema field name.",
  ).optional(),
  OperatorMappings: z.record(z.string(), z.string()).describe(
    "A map of logical filter operators to their field-specific API representations, overriding the global operator mappings.",
  ).optional(),
  BetweenConfiguration: BetweenConfigurationSchema.describe(
    "Configuration that defines how BETWEEN range filter operations are translated into REST API request parameters.",
  ).optional(),
  DateTimeFormat: z.string().describe(
    "The date and time format for filter expressions on this field, overriding the global DateTimeFormat.",
  ).optional(),
});

const FieldDefinitionSchema = z.object({
  Name: z.string().describe("The name of the field."),
  FieldDataType: z.enum([
    "INT",
    "SMALLINT",
    "BIGINT",
    "FLOAT",
    "LONG",
    "DATE",
    "BOOLEAN",
    "MAP",
    "ARRAY",
    "STRING",
    "TIMESTAMP",
    "DECIMAL",
    "BYTE",
    "SHORT",
    "DOUBLE",
    "STRUCT",
    "BINARY",
    "UNION",
  ]).describe("The data type of the field."),
  ResponseDateFormat: z.string().describe(
    "The format pattern for parsing date values from API responses. Accepts Java DateTimeFormatter patterns, EPOCH_SECONDS, or EPOCH_MILLIS.",
  ).optional(),
  IsPartitionable: z.boolean().describe(
    "Indicates whether this field can be used for partitioning queries to the data source.",
  ).optional(),
  IsNullable: z.boolean().describe(
    "Indicates whether this field can contain null values.",
  ).optional(),
  IsQueryable: z.boolean().describe(
    "Indicates whether this field can be used in filter predicates when querying data.",
  ).optional(),
  IsOrderable: z.boolean().describe(
    "Indicates whether this field can be used for ordering results.",
  ).optional(),
  FilterOverrides: FilterOverridesSchema.describe(
    "Configuration that defines per-field overrides for filter behavior, allowing individual fields to customize how filter operations are applied.",
  ).optional(),
});

const EntityConfigurationSchema = z.object({
  SourceConfiguration: SourceConfigurationSchema.describe(
    "Configuration that defines how to make requests to endpoints.",
  ).optional(),
  Schema: z.record(z.string(), FieldDefinitionSchema).describe(
    "The schema definition for this entity.",
  ).optional(),
});

const TagSchema = z.object({
  Key: z.string().min(1).max(128),
  Value: z.string().min(0).max(256),
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
  ConnectionType: z.string().min(1).max(255).describe(
    "The name of the connection type. Must be prefixed with REST-.",
  ),
  IntegrationType: z.enum(["REST"]).describe(
    "The integration type for the connection. Currently only REST is supported.",
  ).optional(),
  Description: z.string().min(0).max(1024).describe(
    "A description of the connection type.",
  ).optional(),
  ConnectionProperties: z.object({
    Url: ConnectorPropertySchema.describe(
      "Defines a property configuration for connection types.",
    ).optional(),
    AdditionalRequestParameters: z.array(ConnectorPropertySchema).describe(
      "Key-value pairs of additional request parameters.",
    ).optional(),
  }).describe(
    "Configuration that defines the base URL and additional request parameters needed during connection creation.",
  ).optional(),
  ConnectorAuthenticationConfiguration: z.object({
    AuthenticationTypes: z.array(z.enum(["BASIC", "OAUTH2", "CUSTOM", "IAM"]))
      .describe("A list of authentication types supported."),
    OAuth2Properties: ConnectorOAuth2PropertiesSchema.describe(
      "OAuth2 configuration container.",
    ).optional(),
    BasicAuthenticationProperties: BasicAuthenticationPropertiesSchema.describe(
      "Basic authentication configuration.",
    ).optional(),
    CustomAuthenticationProperties: CustomAuthenticationPropertiesSchema
      .describe("Custom authentication configuration.").optional(),
  }).describe(
    "Configuration that defines supported authentication types and required properties.",
  ).optional(),
  RestConfiguration: z.object({
    GlobalSourceConfiguration: SourceConfigurationSchema.describe(
      "Configuration that defines how to make requests to endpoints.",
    ).optional(),
    ValidationEndpointConfiguration: z.object({
      RequestMethod: z.enum(["GET", "POST"]).describe("The HTTP method to use.")
        .optional(),
      RequestPath: z.string().min(1).max(512).regex(
        new RegExp("^/[a-zA-Z0-9._~:/?#\\[\\]@!$&'()*+,;={}-]*$"),
      ).describe("The URL path for the REST endpoint.").optional(),
    }).describe(
      "Configuration for the validation endpoint. Only supports RequestMethod and RequestPath.",
    ).optional(),
    EntityConfigurations: z.record(z.string(), EntityConfigurationSchema)
      .describe("A map of entity configurations.").optional(),
  }).describe("Configuration for HTTP request and response handling."),
  Tags: z.array(TagSchema).describe("Tags to assign to the connection type.")
    .optional(),
});

const StateSchema = z.object({
  ConnectionType: z.string().optional(),
  ConnectionTypeArn: z.string(),
  IntegrationType: z.string().optional(),
  Description: z.string().optional(),
  ConnectionProperties: z.object({
    Url: ConnectorPropertySchema,
    AdditionalRequestParameters: z.array(ConnectorPropertySchema),
  }).optional(),
  ConnectorAuthenticationConfiguration: z.object({
    AuthenticationTypes: z.array(z.string()),
    OAuth2Properties: ConnectorOAuth2PropertiesSchema,
    BasicAuthenticationProperties: BasicAuthenticationPropertiesSchema,
    CustomAuthenticationProperties: CustomAuthenticationPropertiesSchema,
  }).optional(),
  RestConfiguration: z.object({
    GlobalSourceConfiguration: SourceConfigurationSchema,
    ValidationEndpointConfiguration: z.object({
      RequestMethod: z.string(),
      RequestPath: z.string(),
    }),
    EntityConfigurations: z.record(z.string(), z.unknown()),
  }).optional(),
  Tags: z.array(TagSchema).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  ConnectionType: z.string().min(1).max(255).describe(
    "The name of the connection type. Must be prefixed with REST-.",
  ).optional(),
  IntegrationType: z.enum(["REST"]).describe(
    "The integration type for the connection. Currently only REST is supported.",
  ).optional(),
  Description: z.string().min(0).max(1024).describe(
    "A description of the connection type.",
  ).optional(),
  ConnectionProperties: z.object({
    Url: ConnectorPropertySchema.describe(
      "Defines a property configuration for connection types.",
    ).optional(),
    AdditionalRequestParameters: z.array(ConnectorPropertySchema).describe(
      "Key-value pairs of additional request parameters.",
    ).optional(),
  }).describe(
    "Configuration that defines the base URL and additional request parameters needed during connection creation.",
  ).optional(),
  ConnectorAuthenticationConfiguration: z.object({
    AuthenticationTypes: z.array(z.enum(["BASIC", "OAUTH2", "CUSTOM", "IAM"]))
      .describe("A list of authentication types supported.").optional(),
    OAuth2Properties: ConnectorOAuth2PropertiesSchema.describe(
      "OAuth2 configuration container.",
    ).optional(),
    BasicAuthenticationProperties: BasicAuthenticationPropertiesSchema.describe(
      "Basic authentication configuration.",
    ).optional(),
    CustomAuthenticationProperties: CustomAuthenticationPropertiesSchema
      .describe("Custom authentication configuration.").optional(),
  }).describe(
    "Configuration that defines supported authentication types and required properties.",
  ).optional(),
  RestConfiguration: z.object({
    GlobalSourceConfiguration: SourceConfigurationSchema.describe(
      "Configuration that defines how to make requests to endpoints.",
    ).optional(),
    ValidationEndpointConfiguration: z.object({
      RequestMethod: z.enum(["GET", "POST"]).describe("The HTTP method to use.")
        .optional(),
      RequestPath: z.string().min(1).max(512).regex(
        new RegExp("^/[a-zA-Z0-9._~:/?#\\[\\]@!$&'()*+,;={}-]*$"),
      ).describe("The URL path for the REST endpoint.").optional(),
    }).describe(
      "Configuration for the validation endpoint. Only supports RequestMethod and RequestPath.",
    ).optional(),
    EntityConfigurations: z.record(z.string(), EntityConfigurationSchema)
      .describe("A map of entity configurations.").optional(),
  }).describe("Configuration for HTTP request and response handling.")
    .optional(),
  Tags: z.array(TagSchema).describe("Tags to assign to the connection type.")
    .optional(),
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

/** Swamp extension model for Glue ConnectionType. Registered at `@swamp/aws/glue/connection-type`. */
export const model = {
  type: "@swamp/aws/glue/connection-type",
  version: "2026.09.16.1",
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Glue ConnectionType resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Glue ConnectionType",
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
          "AWS::Glue::ConnectionType",
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
      description: "Get a Glue ConnectionType",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Glue ConnectionType",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Glue::ConnectionType",
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
      description: "Update a Glue ConnectionType",
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
        const identifier = existing.ConnectionTypeArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::Glue::ConnectionType",
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
          "AWS::Glue::ConnectionType",
          identifier,
          currentState,
          desiredState,
          [
            "ConnectionType",
            "IntegrationType",
            "Description",
            "RestConfiguration",
            "ConnectionProperties",
            "ConnectorAuthenticationConfiguration",
          ],
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
      description: "Delete a Glue ConnectionType",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Glue ConnectionType",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Glue::ConnectionType",
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
      description: "Sync Glue ConnectionType state from AWS",
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
        const identifier = existing.ConnectionTypeArn?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::Glue::ConnectionType",
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
      description: "List Glue ConnectionType resources",
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
          "AWS::Glue::ConnectionType",
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
            (item.properties?.ConnectionTypeArn?.toString() ?? item.identifier)
              .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
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
