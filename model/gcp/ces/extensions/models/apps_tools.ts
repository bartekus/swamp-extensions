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

// Auto-generated extension model for @swamp/gcp/ces/apps-tools
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Gemini Enterprise for Customer Experience Apps.Tools.
 *
 * A tool represents an action that the CES agent can take to achieve certain goals.
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
  return `${parent}/tools/${shortName}`;
}

const BASE_URL = "https://ces.googleapis.com/";

const GET_CONFIG = {
  "id": "ces.projects.locations.apps.tools.get",
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
  "id": "ces.projects.locations.apps.tools.create",
  "path": "v1/{+parent}/tools",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "parent": {
      "location": "path",
      "required": true,
    },
    "toolId": {
      "location": "query",
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "ces.projects.locations.apps.tools.patch",
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
  "id": "ces.projects.locations.apps.tools.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "etag": {
      "location": "query",
    },
    "force": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "ces.projects.locations.apps.tools.list",
  "path": "v1/{+parent}/tools",
  "httpMethod": "GET",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "filter": {
      "location": "query",
    },
    "orderBy": {
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
  agentTool: z.object({
    agent: z.string().describe(
      "Optional. The resource name of the agent that is the entry point of the tool. Format: `projects/{project}/locations/{location}/agents/{agent}`",
    ).optional(),
    description: z.string().describe(
      "Optional. Description of the tool's purpose.",
    ).optional(),
    name: z.string().describe("Required. The name of the agent tool.")
      .optional(),
  }).describe("Optional. The agent tool.").optional(),
  clientFunction: z.object({
    description: z.string().describe("Optional. The function description.")
      .optional(),
    name: z.string().describe("Required. The function name.").optional(),
    parameters: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the function parameters.").optional(),
    response: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the function response.").optional(),
  }).describe("Optional. The client function.").optional(),
  connectorTool: z.object({
    action: z.object({
      connectionActionId: z.string().describe(
        "ID of a Connection action for the tool to use.",
      ).optional(),
      entityOperation: z.object({
        entityId: z.string().describe("Required. ID of the entity.").optional(),
        operation: z.enum([
          "OPERATION_TYPE_UNSPECIFIED",
          "LIST",
          "GET",
          "CREATE",
          "UPDATE",
          "DELETE",
        ]).describe("Required. Operation to perform on the entity.").optional(),
      }).describe("Entity operation configuration for the tool to use.")
        .optional(),
      inputFields: z.array(z.string()).describe(
        "Optional. Entity fields to use as inputs for the operation. If no fields are specified, all fields of the Entity will be used.",
      ).optional(),
      outputFields: z.array(z.string()).describe(
        "Optional. Entity fields to return from the operation. If no fields are specified, all fields of the Entity will be returned.",
      ).optional(),
    }).describe("Required. Action for the tool to use.").optional(),
    authConfig: z.object({
      oauth2AuthCodeConfig: z.object({
        oauthToken: z.string().describe(
          "Required. Oauth token parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Oauth 2.0 Authorization Code authentication.").optional(),
      oauth2JwtBearerConfig: z.object({
        clientKey: z.string().describe(
          "Required. Client parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
        issuer: z.string().describe(
          "Required. Issuer parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
        subject: z.string().describe(
          "Required. Subject parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("JWT Profile Oauth 2.0 Authorization Grant authentication.")
        .optional(),
    }).describe(
      "Optional. Configures how authentication is handled in Integration Connectors. By default, an admin authentication is passed in the Integration Connectors API requests. You can override it with a different end-user authentication config. **Note**: The Connection must have authentication override enabled in order to specify an EUC configuration here - otherwise, the ConnectorTool creation will fail. See https://cloud.google.com/application-integration/docs/configure-connectors-task#configure-authentication-override for details.",
    ).optional(),
    connection: z.string().describe(
      "Required. The full resource name of the referenced Integration Connectors Connection. Format: `projects/{project}/locations/{location}/connections/{connection}`",
    ).optional(),
    description: z.string().describe(
      "Optional. The description of the tool that can be used by the Agent to decide whether to call this ConnectorTool.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of the tool that can be used by the Agent to decide whether to call this ConnectorTool.",
    ).optional(),
  }).describe("Optional. The Integration Connector tool.").optional(),
  dataStoreTool: z.object({
    boostSpecs: z.array(z.object({
      dataStores: z.array(z.string()).describe(
        "Required. The Data Store where the boosting configuration is applied. Full resource name of DataStore, such as projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}.",
      ).optional(),
      spec: z.array(z.object({
        conditionBoostSpecs: z.unknown().describe(
          "Required. A list of boosting specifications.",
        ).optional(),
      })).describe("Required. A list of boosting specifications.").optional(),
    })).describe("Optional. Boost specification to boost certain documents.")
      .optional(),
    dataStoreSource: z.object({
      dataStore: z.object({
        connectorConfig: z.object({
          collection: z.string().describe(
            "Resource name of the collection the data store belongs to.",
          ).optional(),
          collectionDisplayName: z.string().describe(
            "Display name of the collection the data store belongs to.",
          ).optional(),
          dataSource: z.string().describe(
            "The name of the data source. Example: `salesforce`, `jira`, `confluence`, `bigquery`.",
          ).optional(),
        }).describe(
          "Output only. The connector config for the data store connection.",
        ).optional(),
        createTime: z.string().describe(
          "Output only. Timestamp when the data store was created.",
        ).optional(),
        displayName: z.string().describe(
          "Output only. The display name of the data store.",
        ).optional(),
        documentProcessingMode: z.enum([
          "DOCUMENT_PROCESSING_MODE_UNSPECIFIED",
          "DOCUMENTS",
          "CHUNKS",
        ]).describe(
          "Output only. The document processing mode for the data store connection. Only set for PUBLIC_WEB and UNSTRUCTURED data stores.",
        ).optional(),
        name: z.string().describe(
          "Required. Full resource name of the DataStore. Format: `projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}`",
        ).optional(),
        type: z.enum([
          "DATA_STORE_TYPE_UNSPECIFIED",
          "PUBLIC_WEB",
          "UNSTRUCTURED",
          "FAQ",
          "CONNECTOR",
        ]).describe(
          "Output only. The type of the data store. This field is readonly and populated by the server.",
        ).optional(),
      }).describe("Optional. The data store.").optional(),
      filter: z.string().describe(
        "Optional. Filter specification for the DataStore. See: https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata",
      ).optional(),
    }).describe("Optional. Search within a single specific DataStore.")
      .optional(),
    description: z.string().describe("Optional. The tool description.")
      .optional(),
    engineSource: z.object({
      dataStoreSources: z.array(z.object({
        dataStore: z.object({
          connectorConfig: z.unknown().describe(
            "Output only. The connector config for the data store connection.",
          ).optional(),
          createTime: z.unknown().describe(
            "Output only. Timestamp when the data store was created.",
          ).optional(),
          displayName: z.unknown().describe(
            "Output only. The display name of the data store.",
          ).optional(),
          documentProcessingMode: z.unknown().describe(
            "Output only. The document processing mode for the data store connection. Only set for PUBLIC_WEB and UNSTRUCTURED data stores.",
          ).optional(),
          name: z.unknown().describe(
            "Required. Full resource name of the DataStore. Format: `projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}`",
          ).optional(),
          type: z.unknown().describe(
            "Output only. The type of the data store. This field is readonly and populated by the server.",
          ).optional(),
        }).describe("Optional. The data store.").optional(),
        filter: z.string().describe(
          "Optional. Filter specification for the DataStore. See: https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata",
        ).optional(),
      })).describe(
        "Optional. Use to target specific DataStores within the Engine. If empty, the search applies to all DataStores associated with the Engine.",
      ).optional(),
      engine: z.string().describe(
        "Required. Full resource name of the Engine. Format: `projects/{project}/locations/{location}/collections/{collection}/engines/{engine}`",
      ).optional(),
      filter: z.string().describe(
        "Optional. A filter applied to the search across the Engine. Not relevant and not used if 'data_store_sources' is provided. See: https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata",
      ).optional(),
    }).describe(
      "Optional. Search within an Engine (potentially across multiple DataStores).",
    ).optional(),
    filterParameterBehavior: z.enum([
      "FILTER_PARAMETER_BEHAVIOR_UNSPECIFIED",
      "ALWAYS_INCLUDE",
      "NEVER_INCLUDE",
    ]).describe("Optional. The filter parameter behavior.").optional(),
    modalityConfigs: z.array(z.object({
      groundingConfig: z.object({
        disabled: z.boolean().describe(
          "Optional. Whether grounding is disabled.",
        ).optional(),
        groundingLevel: z.number().describe(
          "Optional. The groundedness threshold of the answer based on the retrieved sources. The value has a configurable range of [1, 5]. The level is used to threshold the groundedness of the answer, meaning that all responses with a groundedness score below the threshold will fall back to returning relevant snippets only. For example, a level of 3 means that the groundedness score must be 3 or higher for the response to be returned.",
        ).optional(),
      }).describe("Optional. The grounding configuration.").optional(),
      modalityType: z.enum(["MODALITY_TYPE_UNSPECIFIED", "TEXT", "AUDIO"])
        .describe("Required. The modality type.").optional(),
      rewriterConfig: z.object({
        disabled: z.boolean().describe(
          "Optional. Whether the rewriter is disabled.",
        ).optional(),
        modelSettings: z.object({
          model: z.unknown().describe(
            "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
          ).optional(),
          temperature: z.unknown().describe(
            "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
          ).optional(),
        }).describe("Required. Configurations for the LLM model.").optional(),
        prompt: z.string().describe(
          "Optional. The prompt definition. If not set, default prompt will be used.",
        ).optional(),
      }).describe("Optional. The rewriter config.").optional(),
      snippetsConfig: z.object({
        enableSnippets: z.boolean().describe(
          "Optional. Whether snippets are enabled.",
        ).optional(),
        maxSnippets: z.number().int().describe(
          "Optional. Number of snippets to return per query. If unset, returns all snippets from the service by default.",
        ).optional(),
      }).describe("Optional. The snippets configuration.").optional(),
      summarizationConfig: z.object({
        disabled: z.boolean().describe(
          "Optional. Whether summarization is disabled.",
        ).optional(),
        modelSettings: z.object({
          model: z.unknown().describe(
            "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
          ).optional(),
          temperature: z.unknown().describe(
            "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
          ).optional(),
        }).describe("Optional. Configurations for the LLM model.").optional(),
        prompt: z.string().describe(
          "Optional. The prompt definition. If not set, default prompt will be used.",
        ).optional(),
      }).describe("Optional. The summarization config.").optional(),
    })).describe("Optional. The modality configs for the data store.")
      .optional(),
    name: z.string().describe("Required. The data store tool name.").optional(),
  }).describe("Optional. The data store tool.").optional(),
  executionType: z.enum([
    "EXECUTION_TYPE_UNSPECIFIED",
    "SYNCHRONOUS",
    "ASYNCHRONOUS",
  ]).describe("Optional. The execution type of the tool.").optional(),
  fileSearchTool: z.object({
    corpusType: z.enum([
      "CORPUS_TYPE_UNSPECIFIED",
      "USER_OWNED",
      "FULLY_MANAGED",
    ]).describe("Optional. The type of the corpus. Default is FULLY_MANAGED.")
      .optional(),
    description: z.string().describe("Optional. The tool description.")
      .optional(),
    fileCorpus: z.string().describe(
      "Optional. The corpus where files are stored. Format: projects/{project}/locations/{location}/ragCorpora/{rag_corpus}",
    ).optional(),
    name: z.string().describe("Required. The tool name.").optional(),
  }).describe("Optional. The file search tool.").optional(),
  googleSearchTool: z.object({
    contextUrls: z.array(z.string()).describe(
      'Optional. Content will be fetched directly from these URLs for context and grounding. Example: "https://example.com/path.html". A maximum of 20 URLs are allowed.',
    ).optional(),
    description: z.string().describe(
      "Optional. Description of the tool's purpose.",
    ).optional(),
    excludeDomains: z.array(z.string()).describe(
      'Optional. List of domains to be excluded from the search results. Example: "example.com". A maximum of 2000 domains can be excluded.',
    ).optional(),
    name: z.string().describe("Required. The name of the tool.").optional(),
    preferredDomains: z.array(z.string()).describe(
      'Optional. Specifies domains to restrict search results to. Example: "example.com", "another.site". A maximum of 20 domains can be specified.',
    ).optional(),
    promptConfig: z.object({
      textPrompt: z.string().describe(
        "Optional. Defines the prompt used for the system instructions when interacting with the agent in chat conversations. If not set, default prompt will be used.",
      ).optional(),
      voicePrompt: z.string().describe(
        "Optional. Defines the prompt used for the system instructions when interacting with the agent in voice conversations. If not set, default prompt will be used.",
      ).optional(),
    }).describe(
      "Optional. Prompt instructions passed to planner on how the search results should be processed for text and voice.",
    ).optional(),
  }).describe("Optional. The google search tool.").optional(),
  mcpTool: z.object({
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        keyName: z.string().describe(
          'Required. The parameter name or the header name of the API key. E.g., If the API request is "https://example.com/act?X-Api-Key=", "X-Api-Key" would be the parameter name.',
        ).optional(),
        requestLocation: z.enum([
          "REQUEST_LOCATION_UNSPECIFIED",
          "HEADER",
          "QUERY_STRING",
        ]).describe("Required. Key location in the request.").optional(),
      }).describe("Optional. Config for API key auth.").optional(),
      bearerTokenConfig: z.object({
        token: z.string().describe(
          "Required. The bearer token. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Optional. Config for bearer token auth.").optional(),
      oauthConfig: z.object({
        clientId: z.string().describe(
          "Required. The client ID from the OAuth provider.",
        ).optional(),
        clientSecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the client secret. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        oauthGrantType: z.enum([
          "OAUTH_GRANT_TYPE_UNSPECIFIED",
          "CLIENT_CREDENTIAL",
        ]).describe("Required. OAuth grant types.").optional(),
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant.",
        ).optional(),
        tokenEndpoint: z.string().describe(
          "Required. The token endpoint in the OAuth provider to exchange for an access token.",
        ).optional(),
      }).describe("Optional. Config for OAuth.").optional(),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant. If not specified, the default scope `https://www.googleapis.com/auth/cloud-platform` is used.",
        ).optional(),
        serviceAccount: z.string().describe(
          "Required. The email address of the service account used for authentication. CES uses this service account to exchange an access token and the access token is then sent in the `Authorization` header of the request. The service account must have the `roles/iam.serviceAccountTokenCreator` role granted to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
      }).describe("Optional. Config for service account authentication.")
        .optional(),
      serviceAgentIdTokenAuthConfig: z.object({}).describe(
        "Optional. Config for ID token auth generated from CES service agent.",
      ).optional(),
    }).describe(
      "Optional. Authentication information required to execute the tool against the MCP server. For bearer token authentication, the token applies only to tool execution, not to listing tools. This requires that tools can be listed without authentication.",
    ).optional(),
    customHeaders: z.record(z.string(), z.string()).describe(
      "Optional. The custom headers to send in the request to the MCP server. The values must be in the format `$context.variables.` and can be set in the session variables. See https://docs.cloud.google.com/customer-engagement-ai/conversational-agents/ps/tool/open-api#openapi-injection for more details.",
    ).optional(),
    description: z.string().describe(
      "Optional. The description of the MCP tool.",
    ).optional(),
    inputSchema: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the input arguments of the MCP tool.")
      .optional(),
    name: z.string().describe("Required. The name of the MCP tool.").optional(),
    nameOverride: z.string().describe(
      "Optional. The name override of the MCP tool. This is populated if the name was overridden by a Toolset override.",
    ).optional(),
    outputSchema: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the output arguments of the MCP tool.")
      .optional(),
    serverAddress: z.string().describe(
      'Required. The server address of the MCP server, e.g., "https://example.com/mcp/". If the server is built with the MCP SDK, the url should be suffixed with "/mcp/". Only Streamable HTTP transport based servers are supported. This is the same as the server_address in the McpToolset. See https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http for more details.',
    ).optional(),
    serviceDirectoryConfig: z.object({
      service: z.string().describe(
        "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
      ).optional(),
    }).describe(
      "Optional. Service Directory configuration for VPC-SC, used to resolve service names within a perimeter.",
    ).optional(),
    state: z.enum(["STATE_UNSPECIFIED", "ACTIVE", "INACTIVE", "STALE"])
      .describe(
        "Output only. The dynamic availability state of the tool on the external server.",
      ).optional(),
    tlsConfig: z.object({
      caCerts: z.array(z.object({
        cert: z.string().describe(
          'Required. The allowed custom CA certificates (in DER format) for HTTPS verification. This overrides the default SSL trust store. If this is empty or unspecified, CES will use Google\'s default trust store to verify certificates. N.B. Make sure the HTTPS server certificates are signed with "subject alt name". For instance a certificate can be self-signed using the following command: ` openssl x509 -req -days 200 -in example.com.csr \\ -signkey example.com.key \\ -out example.com.crt \\ -extfile <(printf "\\nsubjectAltName=\'DNS:www.example.com\'") `',
        ).optional(),
        displayName: z.string().describe(
          "Required. The name of the allowed custom CA certificates. This can be used to disambiguate the custom CA certificates.",
        ).optional(),
      })).describe(
        "Required. Specifies a list of allowed custom CA certificates for HTTPS verification.",
      ).optional(),
    }).describe(
      "Optional. The TLS configuration. Includes the custom server certificates that the client should trust.",
    ).optional(),
  }).describe(
    "Optional. The MCP tool. An MCP tool cannot be created or updated directly and is managed by the MCP toolset.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The resource name of the tool. Format: * `projects/{project}/locations/{location}/apps/{app}/tools/{tool}` for standalone tools. * `projects/{project}/locations/{location}/apps/{app}/toolsets/{toolset}/tools/{tool}` for tools retrieved from a toolset. These tools are dynamic and output-only; they cannot be referenced directly where a tool is expected.",
  ).optional(),
  openApiTool: z.object({
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        keyName: z.string().describe(
          'Required. The parameter name or the header name of the API key. E.g., If the API request is "https://example.com/act?X-Api-Key=", "X-Api-Key" would be the parameter name.',
        ).optional(),
        requestLocation: z.enum([
          "REQUEST_LOCATION_UNSPECIFIED",
          "HEADER",
          "QUERY_STRING",
        ]).describe("Required. Key location in the request.").optional(),
      }).describe("Optional. Config for API key auth.").optional(),
      bearerTokenConfig: z.object({
        token: z.string().describe(
          "Required. The bearer token. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Optional. Config for bearer token auth.").optional(),
      oauthConfig: z.object({
        clientId: z.string().describe(
          "Required. The client ID from the OAuth provider.",
        ).optional(),
        clientSecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the client secret. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        oauthGrantType: z.enum([
          "OAUTH_GRANT_TYPE_UNSPECIFIED",
          "CLIENT_CREDENTIAL",
        ]).describe("Required. OAuth grant types.").optional(),
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant.",
        ).optional(),
        tokenEndpoint: z.string().describe(
          "Required. The token endpoint in the OAuth provider to exchange for an access token.",
        ).optional(),
      }).describe("Optional. Config for OAuth.").optional(),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant. If not specified, the default scope `https://www.googleapis.com/auth/cloud-platform` is used.",
        ).optional(),
        serviceAccount: z.string().describe(
          "Required. The email address of the service account used for authentication. CES uses this service account to exchange an access token and the access token is then sent in the `Authorization` header of the request. The service account must have the `roles/iam.serviceAccountTokenCreator` role granted to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
      }).describe("Optional. Config for service account authentication.")
        .optional(),
      serviceAgentIdTokenAuthConfig: z.object({}).describe(
        "Optional. Config for ID token auth generated from CES service agent.",
      ).optional(),
    }).describe("Optional. Authentication information required by the API.")
      .optional(),
    description: z.string().describe(
      "Optional. The description of the tool. If not provided, the description of the tool will be derived from the OpenAPI schema, from `operation.description` or `operation.summary`.",
    ).optional(),
    ignoreUnknownFields: z.boolean().describe(
      "Optional. If true, the agent will ignore unknown fields in the API response.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of the tool. If not provided, the name of the tool will be derived from the OpenAPI schema, from `operation.operationId`.",
    ).optional(),
    openApiSchema: z.string().describe(
      "Required. The OpenAPI schema in JSON or YAML format.",
    ).optional(),
    serviceDirectoryConfig: z.object({
      service: z.string().describe(
        "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
      ).optional(),
    }).describe("Optional. Service Directory configuration.").optional(),
    tlsConfig: z.object({
      caCerts: z.array(z.object({
        cert: z.string().describe(
          'Required. The allowed custom CA certificates (in DER format) for HTTPS verification. This overrides the default SSL trust store. If this is empty or unspecified, CES will use Google\'s default trust store to verify certificates. N.B. Make sure the HTTPS server certificates are signed with "subject alt name". For instance a certificate can be self-signed using the following command: ` openssl x509 -req -days 200 -in example.com.csr \\ -signkey example.com.key \\ -out example.com.crt \\ -extfile <(printf "\\nsubjectAltName=\'DNS:www.example.com\'") `',
        ).optional(),
        displayName: z.string().describe(
          "Required. The name of the allowed custom CA certificates. This can be used to disambiguate the custom CA certificates.",
        ).optional(),
      })).describe(
        "Required. Specifies a list of allowed custom CA certificates for HTTPS verification.",
      ).optional(),
    }).describe(
      "Optional. The TLS configuration. Includes the custom server certificates that the client will trust.",
    ).optional(),
    url: z.string().describe(
      "Optional. The server URL of the Open API schema. This field is only set in tools in the environment dependencies during the export process if the schema contains a server url. During the import process, if this url is present in the environment dependencies and the schema has the $env_var placeholder, it will replace the placeholder in the schema.",
    ).optional(),
  }).describe("Optional. The open API tool.").optional(),
  pythonFunction: z.object({
    description: z.string().describe(
      "Output only. The description of the Python function, parsed from the python code's docstring.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of the Python function to execute. Must match a Python function name defined in the python code. Case sensitive. If the name is not provided, the first function defined in the python code will be used.",
    ).optional(),
    pythonCode: z.string().describe(
      "Optional. The Python code to execute for the tool.",
    ).optional(),
    serviceDirectoryConfig: z.object({
      service: z.string().describe(
        "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
      ).optional(),
    }).describe("Optional. Service Directory configuration for the tool.")
      .optional(),
  }).describe("Optional. The python function tool.").optional(),
  remoteAgentTool: z.object({
    agentCard: z.object({
      description: z.string().describe(
        "Required. A description of the agent's domain of action/solution space.",
      ).optional(),
      name: z.string().describe(
        "Required. A human-readable name for the agent.",
      ).optional(),
      skills: z.array(z.object({
        description: z.string().describe(
          "Required. A detailed description of the skill.",
        ).optional(),
        examples: z.array(z.unknown()).describe(
          "Example prompts or scenarios that this skill can handle.",
        ).optional(),
        id: z.string().describe(
          "Required. A unique identifier for the agent's skill.",
        ).optional(),
        inputModes: z.array(z.unknown()).describe(
          "The set of supported input media types for this skill, overriding the agent's defaults.",
        ).optional(),
        name: z.string().describe(
          "Required. A human-readable name for the skill.",
        ).optional(),
        outputModes: z.array(z.unknown()).describe(
          "The set of supported output media types for this skill, overriding the agent's defaults.",
        ).optional(),
        tags: z.array(z.unknown()).describe(
          "Required. A set of keywords describing the skill's capabilities.",
        ).optional(),
      })).describe(
        "Required. Skills represent a unit of ability an agent can perform. This may somewhat abstract but represents a more focused set of actions that the agent is highly likely to succeed at.",
      ).optional(),
      supportedInterfaces: z.array(z.object({
        protocolBinding: z.string().describe(
          "Required. The protocol binding supported at this URL. This is an open form string, to be easily extended for other protocol bindings. The core ones officially supported are `JSONRPC`, `GRPC` and `HTTP+JSON`.",
        ).optional(),
        protocolVersion: z.string().describe(
          'Required. The version of the A2A protocol this interface exposes. Use the latest supported minor version per major version. Examples: "0.3", "1.0"',
        ).optional(),
        tenant: z.string().describe(
          "Tenant ID to be used in the request when calling the agent.",
        ).optional(),
        url: z.string().describe(
          'Required. The URL where this interface is available. Must be a valid absolute HTTPS URL in production. Example: "https://api.example.com/a2a/v1", "https://grpc.example.com/a2a"',
        ).optional(),
      })).describe(
        "Required. Ordered list of supported interfaces. The first entry is preferred.",
      ).optional(),
      version: z.string().describe("Required. The version of the agent.")
        .optional(),
    }).describe(
      "Required. The agent card of the remote agent that this tool invokes.",
    ).optional(),
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        keyName: z.string().describe(
          'Required. The parameter name or the header name of the API key. E.g., If the API request is "https://example.com/act?X-Api-Key=", "X-Api-Key" would be the parameter name.',
        ).optional(),
        requestLocation: z.enum([
          "REQUEST_LOCATION_UNSPECIFIED",
          "HEADER",
          "QUERY_STRING",
        ]).describe("Required. Key location in the request.").optional(),
      }).describe("Optional. Config for API key auth.").optional(),
      bearerTokenConfig: z.object({
        token: z.string().describe(
          "Required. The bearer token. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Optional. Config for bearer token auth.").optional(),
      oauthConfig: z.object({
        clientId: z.string().describe(
          "Required. The client ID from the OAuth provider.",
        ).optional(),
        clientSecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the client secret. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        oauthGrantType: z.enum([
          "OAUTH_GRANT_TYPE_UNSPECIFIED",
          "CLIENT_CREDENTIAL",
        ]).describe("Required. OAuth grant types.").optional(),
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant.",
        ).optional(),
        tokenEndpoint: z.string().describe(
          "Required. The token endpoint in the OAuth provider to exchange for an access token.",
        ).optional(),
      }).describe("Optional. Config for OAuth.").optional(),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant. If not specified, the default scope `https://www.googleapis.com/auth/cloud-platform` is used.",
        ).optional(),
        serviceAccount: z.string().describe(
          "Required. The email address of the service account used for authentication. CES uses this service account to exchange an access token and the access token is then sent in the `Authorization` header of the request. The service account must have the `roles/iam.serviceAccountTokenCreator` role granted to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
      }).describe("Optional. Config for service account authentication.")
        .optional(),
      serviceAgentIdTokenAuthConfig: z.object({}).describe(
        "Optional. Config for ID token auth generated from CES service agent.",
      ).optional(),
    }).describe(
      "Optional. Authentication configuration for calling the remote agent.",
    ).optional(),
    description: z.string().describe("Required. The description of the tool.")
      .optional(),
    inputVariableMapping: z.record(z.string(), z.string()).describe(
      "Optional. Mapping of input variable names of remote agent to GECX variable names.",
    ).optional(),
    name: z.string().describe("Required. The name of the tool.").optional(),
    outputVariableMapping: z.record(z.string(), z.string()).describe(
      "Optional. Mapping of output variable names of remote agent to GECX variable names.",
    ).optional(),
    statefulAgent: z.boolean().describe(
      "Optional. When enabled, the interaction between the CXAS app and the remote agent will share the same context. If the remote agent returns a context_id, it will be persisted for the entirety of the session for this remote agent tool.",
    ).optional(),
  }).describe("Optional. The remote agent tool.").optional(),
  systemTool: z.object({
    description: z.string().describe(
      "Output only. The description of the system tool.",
    ).optional(),
    name: z.string().describe("Required. The name of the system tool.")
      .optional(),
  }).describe("Optional. The system tool.").optional(),
  timeout: z.string().describe(
    "Optional. The timeout for the tool execution. If not set, the default timeout is 30 seconds for `SYNCHRONOUS` tools and 60 seconds for `ASYNCHRONOUS` tools.",
  ).optional(),
  toolFakeConfig: z.object({
    codeBlock: z.object({
      pythonCode: z.string().describe(
        "Required. Python code which will be invoked in tool fake mode. Expected Python function signature - To catch all tool calls: def fake_tool_call(tool: Tool, input: dict[str, Any], callback_context: CallbackContext) -> Optional[dict[str, Any]]: To catch a specific tool call: def fake_{tool_id}(tool: Tool, input: dict[str, Any], callback_context: CallbackContext) -> Optional[dict[str, Any]]: If the function returns None, the real tool will be invoked instead.",
      ).optional(),
    }).describe(
      "Optional. Code block which will be executed instead of a real tool call.",
    ).optional(),
    enableFakeMode: z.boolean().describe(
      "Optional. Whether the tool is using fake mode.",
    ).optional(),
  }).describe("Optional. Configuration for tool behavior in fake mode.")
    .optional(),
  widgetTool: z.object({
    dataMapping: z.object({
      fieldMappings: z.record(z.string(), z.string()).describe(
        "Optional. A map of widget input parameter fields to the corresponding output fields of the source tool.",
      ).optional(),
      mode: z.enum(["MODE_UNSPECIFIED", "FIELD_MAPPING", "PYTHON_SCRIPT"])
        .describe("Optional. The mode of the data mapping.").optional(),
      pythonFunction: z.object({
        description: z.string().describe(
          "Output only. The description of the Python function, parsed from the python code's docstring.",
        ).optional(),
        name: z.string().describe(
          "Optional. The name of the Python function to execute. Must match a Python function name defined in the python code. Case sensitive. If the name is not provided, the first function defined in the python code will be used.",
        ).optional(),
        pythonCode: z.string().describe(
          "Optional. The Python code to execute for the tool.",
        ).optional(),
        serviceDirectoryConfig: z.object({
          service: z.string().describe(
            "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
          ).optional(),
        }).describe("Optional. Service Directory configuration for the tool.")
          .optional(),
      }).describe(
        "Optional. Configuration for a Python function used to transform the source tool's output into the widget's input format.",
      ).optional(),
      pythonScript: z.string().describe(
        "Deprecated: Use `python_function` instead.",
      ).optional(),
      sourceToolName: z.string().describe(
        "Optional. The resource name of the tool that provides the data for the widget (e.g., a search tool or a custom function). Format: `projects/{project}/locations/{location}/agents/{agent}/tools/{tool}`",
      ).optional(),
    }).describe(
      "Optional. The mapping that defines how data from a source tool is mapped to the widget's input parameters.",
    ).optional(),
    description: z.string().describe(
      "Optional. The description of the widget tool.",
    ).optional(),
    name: z.string().describe("Required. The display name of the widget tool.")
      .optional(),
    parameters: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The input parameters of the widget tool.")
      .optional(),
    textResponseConfig: z.object({
      staticText: z.string().describe(
        "Optional. The static text response to return when type is STATIC.",
      ).optional(),
      textResponseInstruction: z.string().describe(
        "Optional. Instruction for the LLM on how to generate the text response. Used as the description for the text response parameter if type is LLM_GENERATED.",
      ).optional(),
      type: z.enum(["TYPE_UNSPECIFIED", "NONE", "LLM_GENERATED", "STATIC"])
        .describe("Optional. The strategy for providing the text response.")
        .optional(),
    }).describe("Optional. Configuration for always-included text responses.")
      .optional(),
    uiConfig: z.record(z.string(), z.string()).describe(
      "Optional. Configuration for rendering the widget.",
    ).optional(),
    widgetType: z.enum([
      "WIDGET_TYPE_UNSPECIFIED",
      "CUSTOM",
      "PRODUCT_CAROUSEL",
      "PRODUCT_DETAILS",
      "QUICK_ACTIONS",
      "PRODUCT_COMPARISON",
      "ADVANCED_PRODUCT_DETAILS",
      "SHORT_FORM",
      "OVERALL_SATISFACTION",
      "ORDER_SUMMARY",
      "APPOINTMENT_DETAILS",
      "APPOINTMENT_SCHEDULER",
      "CONTACT_FORM",
    ]).describe(
      "Optional. The type of the widget tool. If not specified, the default type will be CUSTOMIZED.",
    ).optional(),
  }).describe("Optional. The widget tool.").optional(),
  toolId: z.string().describe(
    "Optional. The ID to use for the tool, which will become the final component of the tool's resource name. If not provided, a unique ID will be automatically assigned for the tool.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  agentTool: z.object({
    agent: z.string(),
    description: z.string(),
    name: z.string(),
  }).optional(),
  clientFunction: z.object({
    description: z.string(),
    name: z.string(),
    parameters: z.object({
      additionalProperties: z.record(z.string(), z.unknown()),
      anyOf: z.array(z.record(z.string(), z.unknown())),
      default: z.string(),
      defs: z.record(z.string(), z.unknown()),
      description: z.string(),
      enum: z.array(z.string()),
      items: z.record(z.string(), z.unknown()),
      maxItems: z.string(),
      maximum: z.number(),
      minItems: z.string(),
      minimum: z.number(),
      nullable: z.boolean(),
      prefixItems: z.array(z.record(z.string(), z.unknown())),
      properties: z.record(z.string(), z.unknown()),
      ref: z.string(),
      required: z.array(z.string()),
      title: z.string(),
      type: z.string(),
      uniqueItems: z.boolean(),
    }),
    response: z.object({
      additionalProperties: z.record(z.string(), z.unknown()),
      anyOf: z.array(z.record(z.string(), z.unknown())),
      default: z.string(),
      defs: z.record(z.string(), z.unknown()),
      description: z.string(),
      enum: z.array(z.string()),
      items: z.record(z.string(), z.unknown()),
      maxItems: z.string(),
      maximum: z.number(),
      minItems: z.string(),
      minimum: z.number(),
      nullable: z.boolean(),
      prefixItems: z.array(z.record(z.string(), z.unknown())),
      properties: z.record(z.string(), z.unknown()),
      ref: z.string(),
      required: z.array(z.string()),
      title: z.string(),
      type: z.string(),
      uniqueItems: z.boolean(),
    }),
  }).optional(),
  connectorTool: z.object({
    action: z.object({
      connectionActionId: z.string(),
      entityOperation: z.object({
        entityId: z.string(),
        operation: z.string(),
      }),
      inputFields: z.array(z.string()),
      outputFields: z.array(z.string()),
    }),
    authConfig: z.object({
      oauth2AuthCodeConfig: z.object({
        oauthToken: z.string(),
      }),
      oauth2JwtBearerConfig: z.object({
        clientKey: z.string(),
        issuer: z.string(),
        subject: z.string(),
      }),
    }),
    connection: z.string(),
    description: z.string(),
    name: z.string(),
  }).optional(),
  createTime: z.string().optional(),
  dataStoreTool: z.object({
    boostSpecs: z.array(z.object({
      dataStores: z.array(z.string()),
      spec: z.array(z.object({
        conditionBoostSpecs: z.unknown(),
      })),
    })),
    dataStoreSource: z.object({
      dataStore: z.object({
        connectorConfig: z.object({
          collection: z.string(),
          collectionDisplayName: z.string(),
          dataSource: z.string(),
        }),
        createTime: z.string(),
        displayName: z.string(),
        documentProcessingMode: z.string(),
        name: z.string(),
        type: z.string(),
      }),
      filter: z.string(),
    }),
    description: z.string(),
    engineSource: z.object({
      dataStoreSources: z.array(z.object({
        dataStore: z.object({
          connectorConfig: z.unknown(),
          createTime: z.unknown(),
          displayName: z.unknown(),
          documentProcessingMode: z.unknown(),
          name: z.unknown(),
          type: z.unknown(),
        }),
        filter: z.string(),
      })),
      engine: z.string(),
      filter: z.string(),
    }),
    filterParameterBehavior: z.string(),
    modalityConfigs: z.array(z.object({
      groundingConfig: z.object({
        disabled: z.boolean(),
        groundingLevel: z.number(),
      }),
      modalityType: z.string(),
      rewriterConfig: z.object({
        disabled: z.boolean(),
        modelSettings: z.object({
          model: z.unknown(),
          temperature: z.unknown(),
        }),
        prompt: z.string(),
      }),
      snippetsConfig: z.object({
        enableSnippets: z.boolean(),
        maxSnippets: z.number(),
      }),
      summarizationConfig: z.object({
        disabled: z.boolean(),
        modelSettings: z.object({
          model: z.unknown(),
          temperature: z.unknown(),
        }),
        prompt: z.string(),
      }),
    })),
    name: z.string(),
  }).optional(),
  displayName: z.string().optional(),
  etag: z.string().optional(),
  executionType: z.string().optional(),
  fileSearchTool: z.object({
    corpusType: z.string(),
    description: z.string(),
    fileCorpus: z.string(),
    name: z.string(),
  }).optional(),
  generatedSummary: z.string().optional(),
  googleSearchTool: z.object({
    contextUrls: z.array(z.string()),
    description: z.string(),
    excludeDomains: z.array(z.string()),
    name: z.string(),
    preferredDomains: z.array(z.string()),
    promptConfig: z.object({
      textPrompt: z.string(),
      voicePrompt: z.string(),
    }),
  }).optional(),
  mcpTool: z.object({
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string(),
        keyName: z.string(),
        requestLocation: z.string(),
      }),
      bearerTokenConfig: z.object({
        token: z.string(),
      }),
      oauthConfig: z.object({
        clientId: z.string(),
        clientSecretVersion: z.string(),
        oauthGrantType: z.string(),
        scopes: z.array(z.string()),
        tokenEndpoint: z.string(),
      }),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()),
        serviceAccount: z.string(),
      }),
      serviceAgentIdTokenAuthConfig: z.object({}),
    }),
    customHeaders: z.record(z.string(), z.unknown()),
    description: z.string(),
    inputSchema: z.object({
      additionalProperties: z.record(z.string(), z.unknown()),
      anyOf: z.array(z.record(z.string(), z.unknown())),
      default: z.string(),
      defs: z.record(z.string(), z.unknown()),
      description: z.string(),
      enum: z.array(z.string()),
      items: z.record(z.string(), z.unknown()),
      maxItems: z.string(),
      maximum: z.number(),
      minItems: z.string(),
      minimum: z.number(),
      nullable: z.boolean(),
      prefixItems: z.array(z.record(z.string(), z.unknown())),
      properties: z.record(z.string(), z.unknown()),
      ref: z.string(),
      required: z.array(z.string()),
      title: z.string(),
      type: z.string(),
      uniqueItems: z.boolean(),
    }),
    name: z.string(),
    nameOverride: z.string(),
    outputSchema: z.object({
      additionalProperties: z.record(z.string(), z.unknown()),
      anyOf: z.array(z.record(z.string(), z.unknown())),
      default: z.string(),
      defs: z.record(z.string(), z.unknown()),
      description: z.string(),
      enum: z.array(z.string()),
      items: z.record(z.string(), z.unknown()),
      maxItems: z.string(),
      maximum: z.number(),
      minItems: z.string(),
      minimum: z.number(),
      nullable: z.boolean(),
      prefixItems: z.array(z.record(z.string(), z.unknown())),
      properties: z.record(z.string(), z.unknown()),
      ref: z.string(),
      required: z.array(z.string()),
      title: z.string(),
      type: z.string(),
      uniqueItems: z.boolean(),
    }),
    serverAddress: z.string(),
    serviceDirectoryConfig: z.object({
      service: z.string(),
    }),
    state: z.string(),
    tlsConfig: z.object({
      caCerts: z.array(z.object({
        cert: z.string(),
        displayName: z.string(),
      })),
    }),
  }).optional(),
  name: z.string(),
  openApiTool: z.object({
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string(),
        keyName: z.string(),
        requestLocation: z.string(),
      }),
      bearerTokenConfig: z.object({
        token: z.string(),
      }),
      oauthConfig: z.object({
        clientId: z.string(),
        clientSecretVersion: z.string(),
        oauthGrantType: z.string(),
        scopes: z.array(z.string()),
        tokenEndpoint: z.string(),
      }),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()),
        serviceAccount: z.string(),
      }),
      serviceAgentIdTokenAuthConfig: z.object({}),
    }),
    description: z.string(),
    ignoreUnknownFields: z.boolean(),
    name: z.string(),
    openApiSchema: z.string(),
    serviceDirectoryConfig: z.object({
      service: z.string(),
    }),
    tlsConfig: z.object({
      caCerts: z.array(z.object({
        cert: z.string(),
        displayName: z.string(),
      })),
    }),
    url: z.string(),
  }).optional(),
  pythonFunction: z.object({
    description: z.string(),
    name: z.string(),
    pythonCode: z.string(),
    serviceDirectoryConfig: z.object({
      service: z.string(),
    }),
  }).optional(),
  remoteAgentTool: z.object({
    agentCard: z.object({
      description: z.string(),
      name: z.string(),
      skills: z.array(z.object({
        description: z.string(),
        examples: z.array(z.unknown()),
        id: z.string(),
        inputModes: z.array(z.unknown()),
        name: z.string(),
        outputModes: z.array(z.unknown()),
        tags: z.array(z.unknown()),
      })),
      supportedInterfaces: z.array(z.object({
        protocolBinding: z.string(),
        protocolVersion: z.string(),
        tenant: z.string(),
        url: z.string(),
      })),
      version: z.string(),
    }),
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string(),
        keyName: z.string(),
        requestLocation: z.string(),
      }),
      bearerTokenConfig: z.object({
        token: z.string(),
      }),
      oauthConfig: z.object({
        clientId: z.string(),
        clientSecretVersion: z.string(),
        oauthGrantType: z.string(),
        scopes: z.array(z.string()),
        tokenEndpoint: z.string(),
      }),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()),
        serviceAccount: z.string(),
      }),
      serviceAgentIdTokenAuthConfig: z.object({}),
    }),
    description: z.string(),
    inputVariableMapping: z.record(z.string(), z.unknown()),
    name: z.string(),
    outputVariableMapping: z.record(z.string(), z.unknown()),
    statefulAgent: z.boolean(),
  }).optional(),
  systemTool: z.object({
    description: z.string(),
    name: z.string(),
  }).optional(),
  timeout: z.string().optional(),
  toolFakeConfig: z.object({
    codeBlock: z.object({
      pythonCode: z.string(),
    }),
    enableFakeMode: z.boolean(),
  }).optional(),
  updateTime: z.string().optional(),
  widgetTool: z.object({
    dataMapping: z.object({
      fieldMappings: z.record(z.string(), z.unknown()),
      mode: z.string(),
      pythonFunction: z.object({
        description: z.string(),
        name: z.string(),
        pythonCode: z.string(),
        serviceDirectoryConfig: z.object({
          service: z.string(),
        }),
      }),
      pythonScript: z.string(),
      sourceToolName: z.string(),
    }),
    description: z.string(),
    name: z.string(),
    parameters: z.object({
      additionalProperties: z.record(z.string(), z.unknown()),
      anyOf: z.array(z.record(z.string(), z.unknown())),
      default: z.string(),
      defs: z.record(z.string(), z.unknown()),
      description: z.string(),
      enum: z.array(z.string()),
      items: z.record(z.string(), z.unknown()),
      maxItems: z.string(),
      maximum: z.number(),
      minItems: z.string(),
      minimum: z.number(),
      nullable: z.boolean(),
      prefixItems: z.array(z.record(z.string(), z.unknown())),
      properties: z.record(z.string(), z.unknown()),
      ref: z.string(),
      required: z.array(z.string()),
      title: z.string(),
      type: z.string(),
      uniqueItems: z.boolean(),
    }),
    textResponseConfig: z.object({
      staticText: z.string(),
      textResponseInstruction: z.string(),
      type: z.string(),
    }),
    uiConfig: z.record(z.string(), z.unknown()),
    widgetType: z.string(),
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
  agentTool: z.object({
    agent: z.string().describe(
      "Optional. The resource name of the agent that is the entry point of the tool. Format: `projects/{project}/locations/{location}/agents/{agent}`",
    ).optional(),
    description: z.string().describe(
      "Optional. Description of the tool's purpose.",
    ).optional(),
    name: z.string().describe("Required. The name of the agent tool.")
      .optional(),
  }).describe("Optional. The agent tool.").optional(),
  clientFunction: z.object({
    description: z.string().describe("Optional. The function description.")
      .optional(),
    name: z.string().describe("Required. The function name.").optional(),
    parameters: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the function parameters.").optional(),
    response: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the function response.").optional(),
  }).describe("Optional. The client function.").optional(),
  connectorTool: z.object({
    action: z.object({
      connectionActionId: z.string().describe(
        "ID of a Connection action for the tool to use.",
      ).optional(),
      entityOperation: z.object({
        entityId: z.string().describe("Required. ID of the entity.").optional(),
        operation: z.enum([
          "OPERATION_TYPE_UNSPECIFIED",
          "LIST",
          "GET",
          "CREATE",
          "UPDATE",
          "DELETE",
        ]).describe("Required. Operation to perform on the entity.").optional(),
      }).describe("Entity operation configuration for the tool to use.")
        .optional(),
      inputFields: z.array(z.string()).describe(
        "Optional. Entity fields to use as inputs for the operation. If no fields are specified, all fields of the Entity will be used.",
      ).optional(),
      outputFields: z.array(z.string()).describe(
        "Optional. Entity fields to return from the operation. If no fields are specified, all fields of the Entity will be returned.",
      ).optional(),
    }).describe("Required. Action for the tool to use.").optional(),
    authConfig: z.object({
      oauth2AuthCodeConfig: z.object({
        oauthToken: z.string().describe(
          "Required. Oauth token parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Oauth 2.0 Authorization Code authentication.").optional(),
      oauth2JwtBearerConfig: z.object({
        clientKey: z.string().describe(
          "Required. Client parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
        issuer: z.string().describe(
          "Required. Issuer parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
        subject: z.string().describe(
          "Required. Subject parameter name to pass through. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("JWT Profile Oauth 2.0 Authorization Grant authentication.")
        .optional(),
    }).describe(
      "Optional. Configures how authentication is handled in Integration Connectors. By default, an admin authentication is passed in the Integration Connectors API requests. You can override it with a different end-user authentication config. **Note**: The Connection must have authentication override enabled in order to specify an EUC configuration here - otherwise, the ConnectorTool creation will fail. See https://cloud.google.com/application-integration/docs/configure-connectors-task#configure-authentication-override for details.",
    ).optional(),
    connection: z.string().describe(
      "Required. The full resource name of the referenced Integration Connectors Connection. Format: `projects/{project}/locations/{location}/connections/{connection}`",
    ).optional(),
    description: z.string().describe(
      "Optional. The description of the tool that can be used by the Agent to decide whether to call this ConnectorTool.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of the tool that can be used by the Agent to decide whether to call this ConnectorTool.",
    ).optional(),
  }).describe("Optional. The Integration Connector tool.").optional(),
  dataStoreTool: z.object({
    boostSpecs: z.array(z.object({
      dataStores: z.array(z.string()).describe(
        "Required. The Data Store where the boosting configuration is applied. Full resource name of DataStore, such as projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}.",
      ).optional(),
      spec: z.array(z.object({
        conditionBoostSpecs: z.unknown().describe(
          "Required. A list of boosting specifications.",
        ).optional(),
      })).describe("Required. A list of boosting specifications.").optional(),
    })).describe("Optional. Boost specification to boost certain documents.")
      .optional(),
    dataStoreSource: z.object({
      dataStore: z.object({
        connectorConfig: z.object({
          collection: z.string().describe(
            "Resource name of the collection the data store belongs to.",
          ).optional(),
          collectionDisplayName: z.string().describe(
            "Display name of the collection the data store belongs to.",
          ).optional(),
          dataSource: z.string().describe(
            "The name of the data source. Example: `salesforce`, `jira`, `confluence`, `bigquery`.",
          ).optional(),
        }).describe(
          "Output only. The connector config for the data store connection.",
        ).optional(),
        createTime: z.string().describe(
          "Output only. Timestamp when the data store was created.",
        ).optional(),
        displayName: z.string().describe(
          "Output only. The display name of the data store.",
        ).optional(),
        documentProcessingMode: z.enum([
          "DOCUMENT_PROCESSING_MODE_UNSPECIFIED",
          "DOCUMENTS",
          "CHUNKS",
        ]).describe(
          "Output only. The document processing mode for the data store connection. Only set for PUBLIC_WEB and UNSTRUCTURED data stores.",
        ).optional(),
        name: z.string().describe(
          "Required. Full resource name of the DataStore. Format: `projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}`",
        ).optional(),
        type: z.enum([
          "DATA_STORE_TYPE_UNSPECIFIED",
          "PUBLIC_WEB",
          "UNSTRUCTURED",
          "FAQ",
          "CONNECTOR",
        ]).describe(
          "Output only. The type of the data store. This field is readonly and populated by the server.",
        ).optional(),
      }).describe("Optional. The data store.").optional(),
      filter: z.string().describe(
        "Optional. Filter specification for the DataStore. See: https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata",
      ).optional(),
    }).describe("Optional. Search within a single specific DataStore.")
      .optional(),
    description: z.string().describe("Optional. The tool description.")
      .optional(),
    engineSource: z.object({
      dataStoreSources: z.array(z.object({
        dataStore: z.object({
          connectorConfig: z.unknown().describe(
            "Output only. The connector config for the data store connection.",
          ).optional(),
          createTime: z.unknown().describe(
            "Output only. Timestamp when the data store was created.",
          ).optional(),
          displayName: z.unknown().describe(
            "Output only. The display name of the data store.",
          ).optional(),
          documentProcessingMode: z.unknown().describe(
            "Output only. The document processing mode for the data store connection. Only set for PUBLIC_WEB and UNSTRUCTURED data stores.",
          ).optional(),
          name: z.unknown().describe(
            "Required. Full resource name of the DataStore. Format: `projects/{project}/locations/{location}/collections/{collection}/dataStores/{dataStore}`",
          ).optional(),
          type: z.unknown().describe(
            "Output only. The type of the data store. This field is readonly and populated by the server.",
          ).optional(),
        }).describe("Optional. The data store.").optional(),
        filter: z.string().describe(
          "Optional. Filter specification for the DataStore. See: https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata",
        ).optional(),
      })).describe(
        "Optional. Use to target specific DataStores within the Engine. If empty, the search applies to all DataStores associated with the Engine.",
      ).optional(),
      engine: z.string().describe(
        "Required. Full resource name of the Engine. Format: `projects/{project}/locations/{location}/collections/{collection}/engines/{engine}`",
      ).optional(),
      filter: z.string().describe(
        "Optional. A filter applied to the search across the Engine. Not relevant and not used if 'data_store_sources' is provided. See: https://cloud.google.com/generative-ai-app-builder/docs/filter-search-metadata",
      ).optional(),
    }).describe(
      "Optional. Search within an Engine (potentially across multiple DataStores).",
    ).optional(),
    filterParameterBehavior: z.enum([
      "FILTER_PARAMETER_BEHAVIOR_UNSPECIFIED",
      "ALWAYS_INCLUDE",
      "NEVER_INCLUDE",
    ]).describe("Optional. The filter parameter behavior.").optional(),
    modalityConfigs: z.array(z.object({
      groundingConfig: z.object({
        disabled: z.boolean().describe(
          "Optional. Whether grounding is disabled.",
        ).optional(),
        groundingLevel: z.number().describe(
          "Optional. The groundedness threshold of the answer based on the retrieved sources. The value has a configurable range of [1, 5]. The level is used to threshold the groundedness of the answer, meaning that all responses with a groundedness score below the threshold will fall back to returning relevant snippets only. For example, a level of 3 means that the groundedness score must be 3 or higher for the response to be returned.",
        ).optional(),
      }).describe("Optional. The grounding configuration.").optional(),
      modalityType: z.enum(["MODALITY_TYPE_UNSPECIFIED", "TEXT", "AUDIO"])
        .describe("Required. The modality type.").optional(),
      rewriterConfig: z.object({
        disabled: z.boolean().describe(
          "Optional. Whether the rewriter is disabled.",
        ).optional(),
        modelSettings: z.object({
          model: z.unknown().describe(
            "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
          ).optional(),
          temperature: z.unknown().describe(
            "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
          ).optional(),
        }).describe("Required. Configurations for the LLM model.").optional(),
        prompt: z.string().describe(
          "Optional. The prompt definition. If not set, default prompt will be used.",
        ).optional(),
      }).describe("Optional. The rewriter config.").optional(),
      snippetsConfig: z.object({
        enableSnippets: z.boolean().describe(
          "Optional. Whether snippets are enabled.",
        ).optional(),
        maxSnippets: z.number().int().describe(
          "Optional. Number of snippets to return per query. If unset, returns all snippets from the service by default.",
        ).optional(),
      }).describe("Optional. The snippets configuration.").optional(),
      summarizationConfig: z.object({
        disabled: z.boolean().describe(
          "Optional. Whether summarization is disabled.",
        ).optional(),
        modelSettings: z.object({
          model: z.unknown().describe(
            "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
          ).optional(),
          temperature: z.unknown().describe(
            "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
          ).optional(),
        }).describe("Optional. Configurations for the LLM model.").optional(),
        prompt: z.string().describe(
          "Optional. The prompt definition. If not set, default prompt will be used.",
        ).optional(),
      }).describe("Optional. The summarization config.").optional(),
    })).describe("Optional. The modality configs for the data store.")
      .optional(),
    name: z.string().describe("Required. The data store tool name.").optional(),
  }).describe("Optional. The data store tool.").optional(),
  executionType: z.enum([
    "EXECUTION_TYPE_UNSPECIFIED",
    "SYNCHRONOUS",
    "ASYNCHRONOUS",
  ]).describe("Optional. The execution type of the tool.").optional(),
  fileSearchTool: z.object({
    corpusType: z.enum([
      "CORPUS_TYPE_UNSPECIFIED",
      "USER_OWNED",
      "FULLY_MANAGED",
    ]).describe("Optional. The type of the corpus. Default is FULLY_MANAGED.")
      .optional(),
    description: z.string().describe("Optional. The tool description.")
      .optional(),
    fileCorpus: z.string().describe(
      "Optional. The corpus where files are stored. Format: projects/{project}/locations/{location}/ragCorpora/{rag_corpus}",
    ).optional(),
    name: z.string().describe("Required. The tool name.").optional(),
  }).describe("Optional. The file search tool.").optional(),
  googleSearchTool: z.object({
    contextUrls: z.array(z.string()).describe(
      'Optional. Content will be fetched directly from these URLs for context and grounding. Example: "https://example.com/path.html". A maximum of 20 URLs are allowed.',
    ).optional(),
    description: z.string().describe(
      "Optional. Description of the tool's purpose.",
    ).optional(),
    excludeDomains: z.array(z.string()).describe(
      'Optional. List of domains to be excluded from the search results. Example: "example.com". A maximum of 2000 domains can be excluded.',
    ).optional(),
    name: z.string().describe("Required. The name of the tool.").optional(),
    preferredDomains: z.array(z.string()).describe(
      'Optional. Specifies domains to restrict search results to. Example: "example.com", "another.site". A maximum of 20 domains can be specified.',
    ).optional(),
    promptConfig: z.object({
      textPrompt: z.string().describe(
        "Optional. Defines the prompt used for the system instructions when interacting with the agent in chat conversations. If not set, default prompt will be used.",
      ).optional(),
      voicePrompt: z.string().describe(
        "Optional. Defines the prompt used for the system instructions when interacting with the agent in voice conversations. If not set, default prompt will be used.",
      ).optional(),
    }).describe(
      "Optional. Prompt instructions passed to planner on how the search results should be processed for text and voice.",
    ).optional(),
  }).describe("Optional. The google search tool.").optional(),
  mcpTool: z.object({
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        keyName: z.string().describe(
          'Required. The parameter name or the header name of the API key. E.g., If the API request is "https://example.com/act?X-Api-Key=", "X-Api-Key" would be the parameter name.',
        ).optional(),
        requestLocation: z.enum([
          "REQUEST_LOCATION_UNSPECIFIED",
          "HEADER",
          "QUERY_STRING",
        ]).describe("Required. Key location in the request.").optional(),
      }).describe("Optional. Config for API key auth.").optional(),
      bearerTokenConfig: z.object({
        token: z.string().describe(
          "Required. The bearer token. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Optional. Config for bearer token auth.").optional(),
      oauthConfig: z.object({
        clientId: z.string().describe(
          "Required. The client ID from the OAuth provider.",
        ).optional(),
        clientSecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the client secret. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        oauthGrantType: z.enum([
          "OAUTH_GRANT_TYPE_UNSPECIFIED",
          "CLIENT_CREDENTIAL",
        ]).describe("Required. OAuth grant types.").optional(),
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant.",
        ).optional(),
        tokenEndpoint: z.string().describe(
          "Required. The token endpoint in the OAuth provider to exchange for an access token.",
        ).optional(),
      }).describe("Optional. Config for OAuth.").optional(),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant. If not specified, the default scope `https://www.googleapis.com/auth/cloud-platform` is used.",
        ).optional(),
        serviceAccount: z.string().describe(
          "Required. The email address of the service account used for authentication. CES uses this service account to exchange an access token and the access token is then sent in the `Authorization` header of the request. The service account must have the `roles/iam.serviceAccountTokenCreator` role granted to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
      }).describe("Optional. Config for service account authentication.")
        .optional(),
      serviceAgentIdTokenAuthConfig: z.object({}).describe(
        "Optional. Config for ID token auth generated from CES service agent.",
      ).optional(),
    }).describe(
      "Optional. Authentication information required to execute the tool against the MCP server. For bearer token authentication, the token applies only to tool execution, not to listing tools. This requires that tools can be listed without authentication.",
    ).optional(),
    customHeaders: z.record(z.string(), z.string()).describe(
      "Optional. The custom headers to send in the request to the MCP server. The values must be in the format `$context.variables.` and can be set in the session variables. See https://docs.cloud.google.com/customer-engagement-ai/conversational-agents/ps/tool/open-api#openapi-injection for more details.",
    ).optional(),
    description: z.string().describe(
      "Optional. The description of the MCP tool.",
    ).optional(),
    inputSchema: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the input arguments of the MCP tool.")
      .optional(),
    name: z.string().describe("Required. The name of the MCP tool.").optional(),
    nameOverride: z.string().describe(
      "Optional. The name override of the MCP tool. This is populated if the name was overridden by a Toolset override.",
    ).optional(),
    outputSchema: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The schema of the output arguments of the MCP tool.")
      .optional(),
    serverAddress: z.string().describe(
      'Required. The server address of the MCP server, e.g., "https://example.com/mcp/". If the server is built with the MCP SDK, the url should be suffixed with "/mcp/". Only Streamable HTTP transport based servers are supported. This is the same as the server_address in the McpToolset. See https://modelcontextprotocol.io/specification/2025-03-26/basic/transports#streamable-http for more details.',
    ).optional(),
    serviceDirectoryConfig: z.object({
      service: z.string().describe(
        "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
      ).optional(),
    }).describe(
      "Optional. Service Directory configuration for VPC-SC, used to resolve service names within a perimeter.",
    ).optional(),
    state: z.enum(["STATE_UNSPECIFIED", "ACTIVE", "INACTIVE", "STALE"])
      .describe(
        "Output only. The dynamic availability state of the tool on the external server.",
      ).optional(),
    tlsConfig: z.object({
      caCerts: z.array(z.object({
        cert: z.string().describe(
          'Required. The allowed custom CA certificates (in DER format) for HTTPS verification. This overrides the default SSL trust store. If this is empty or unspecified, CES will use Google\'s default trust store to verify certificates. N.B. Make sure the HTTPS server certificates are signed with "subject alt name". For instance a certificate can be self-signed using the following command: ` openssl x509 -req -days 200 -in example.com.csr \\ -signkey example.com.key \\ -out example.com.crt \\ -extfile <(printf "\\nsubjectAltName=\'DNS:www.example.com\'") `',
        ).optional(),
        displayName: z.string().describe(
          "Required. The name of the allowed custom CA certificates. This can be used to disambiguate the custom CA certificates.",
        ).optional(),
      })).describe(
        "Required. Specifies a list of allowed custom CA certificates for HTTPS verification.",
      ).optional(),
    }).describe(
      "Optional. The TLS configuration. Includes the custom server certificates that the client should trust.",
    ).optional(),
  }).describe(
    "Optional. The MCP tool. An MCP tool cannot be created or updated directly and is managed by the MCP toolset.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The resource name of the tool. Format: * `projects/{project}/locations/{location}/apps/{app}/tools/{tool}` for standalone tools. * `projects/{project}/locations/{location}/apps/{app}/toolsets/{toolset}/tools/{tool}` for tools retrieved from a toolset. These tools are dynamic and output-only; they cannot be referenced directly where a tool is expected.",
  ).optional(),
  openApiTool: z.object({
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        keyName: z.string().describe(
          'Required. The parameter name or the header name of the API key. E.g., If the API request is "https://example.com/act?X-Api-Key=", "X-Api-Key" would be the parameter name.',
        ).optional(),
        requestLocation: z.enum([
          "REQUEST_LOCATION_UNSPECIFIED",
          "HEADER",
          "QUERY_STRING",
        ]).describe("Required. Key location in the request.").optional(),
      }).describe("Optional. Config for API key auth.").optional(),
      bearerTokenConfig: z.object({
        token: z.string().describe(
          "Required. The bearer token. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Optional. Config for bearer token auth.").optional(),
      oauthConfig: z.object({
        clientId: z.string().describe(
          "Required. The client ID from the OAuth provider.",
        ).optional(),
        clientSecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the client secret. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        oauthGrantType: z.enum([
          "OAUTH_GRANT_TYPE_UNSPECIFIED",
          "CLIENT_CREDENTIAL",
        ]).describe("Required. OAuth grant types.").optional(),
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant.",
        ).optional(),
        tokenEndpoint: z.string().describe(
          "Required. The token endpoint in the OAuth provider to exchange for an access token.",
        ).optional(),
      }).describe("Optional. Config for OAuth.").optional(),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant. If not specified, the default scope `https://www.googleapis.com/auth/cloud-platform` is used.",
        ).optional(),
        serviceAccount: z.string().describe(
          "Required. The email address of the service account used for authentication. CES uses this service account to exchange an access token and the access token is then sent in the `Authorization` header of the request. The service account must have the `roles/iam.serviceAccountTokenCreator` role granted to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
      }).describe("Optional. Config for service account authentication.")
        .optional(),
      serviceAgentIdTokenAuthConfig: z.object({}).describe(
        "Optional. Config for ID token auth generated from CES service agent.",
      ).optional(),
    }).describe("Optional. Authentication information required by the API.")
      .optional(),
    description: z.string().describe(
      "Optional. The description of the tool. If not provided, the description of the tool will be derived from the OpenAPI schema, from `operation.description` or `operation.summary`.",
    ).optional(),
    ignoreUnknownFields: z.boolean().describe(
      "Optional. If true, the agent will ignore unknown fields in the API response.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of the tool. If not provided, the name of the tool will be derived from the OpenAPI schema, from `operation.operationId`.",
    ).optional(),
    openApiSchema: z.string().describe(
      "Required. The OpenAPI schema in JSON or YAML format.",
    ).optional(),
    serviceDirectoryConfig: z.object({
      service: z.string().describe(
        "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
      ).optional(),
    }).describe("Optional. Service Directory configuration.").optional(),
    tlsConfig: z.object({
      caCerts: z.array(z.object({
        cert: z.string().describe(
          'Required. The allowed custom CA certificates (in DER format) for HTTPS verification. This overrides the default SSL trust store. If this is empty or unspecified, CES will use Google\'s default trust store to verify certificates. N.B. Make sure the HTTPS server certificates are signed with "subject alt name". For instance a certificate can be self-signed using the following command: ` openssl x509 -req -days 200 -in example.com.csr \\ -signkey example.com.key \\ -out example.com.crt \\ -extfile <(printf "\\nsubjectAltName=\'DNS:www.example.com\'") `',
        ).optional(),
        displayName: z.string().describe(
          "Required. The name of the allowed custom CA certificates. This can be used to disambiguate the custom CA certificates.",
        ).optional(),
      })).describe(
        "Required. Specifies a list of allowed custom CA certificates for HTTPS verification.",
      ).optional(),
    }).describe(
      "Optional. The TLS configuration. Includes the custom server certificates that the client will trust.",
    ).optional(),
    url: z.string().describe(
      "Optional. The server URL of the Open API schema. This field is only set in tools in the environment dependencies during the export process if the schema contains a server url. During the import process, if this url is present in the environment dependencies and the schema has the $env_var placeholder, it will replace the placeholder in the schema.",
    ).optional(),
  }).describe("Optional. The open API tool.").optional(),
  pythonFunction: z.object({
    description: z.string().describe(
      "Output only. The description of the Python function, parsed from the python code's docstring.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of the Python function to execute. Must match a Python function name defined in the python code. Case sensitive. If the name is not provided, the first function defined in the python code will be used.",
    ).optional(),
    pythonCode: z.string().describe(
      "Optional. The Python code to execute for the tool.",
    ).optional(),
    serviceDirectoryConfig: z.object({
      service: z.string().describe(
        "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
      ).optional(),
    }).describe("Optional. Service Directory configuration for the tool.")
      .optional(),
  }).describe("Optional. The python function tool.").optional(),
  remoteAgentTool: z.object({
    agentCard: z.object({
      description: z.string().describe(
        "Required. A description of the agent's domain of action/solution space.",
      ).optional(),
      name: z.string().describe(
        "Required. A human-readable name for the agent.",
      ).optional(),
      skills: z.array(z.object({
        description: z.string().describe(
          "Required. A detailed description of the skill.",
        ).optional(),
        examples: z.array(z.unknown()).describe(
          "Example prompts or scenarios that this skill can handle.",
        ).optional(),
        id: z.string().describe(
          "Required. A unique identifier for the agent's skill.",
        ).optional(),
        inputModes: z.array(z.unknown()).describe(
          "The set of supported input media types for this skill, overriding the agent's defaults.",
        ).optional(),
        name: z.string().describe(
          "Required. A human-readable name for the skill.",
        ).optional(),
        outputModes: z.array(z.unknown()).describe(
          "The set of supported output media types for this skill, overriding the agent's defaults.",
        ).optional(),
        tags: z.array(z.unknown()).describe(
          "Required. A set of keywords describing the skill's capabilities.",
        ).optional(),
      })).describe(
        "Required. Skills represent a unit of ability an agent can perform. This may somewhat abstract but represents a more focused set of actions that the agent is highly likely to succeed at.",
      ).optional(),
      supportedInterfaces: z.array(z.object({
        protocolBinding: z.string().describe(
          "Required. The protocol binding supported at this URL. This is an open form string, to be easily extended for other protocol bindings. The core ones officially supported are `JSONRPC`, `GRPC` and `HTTP+JSON`.",
        ).optional(),
        protocolVersion: z.string().describe(
          'Required. The version of the A2A protocol this interface exposes. Use the latest supported minor version per major version. Examples: "0.3", "1.0"',
        ).optional(),
        tenant: z.string().describe(
          "Tenant ID to be used in the request when calling the agent.",
        ).optional(),
        url: z.string().describe(
          'Required. The URL where this interface is available. Must be a valid absolute HTTPS URL in production. Example: "https://api.example.com/a2a/v1", "https://grpc.example.com/a2a"',
        ).optional(),
      })).describe(
        "Required. Ordered list of supported interfaces. The first entry is preferred.",
      ).optional(),
      version: z.string().describe("Required. The version of the agent.")
        .optional(),
    }).describe(
      "Required. The agent card of the remote agent that this tool invokes.",
    ).optional(),
    apiAuthentication: z.object({
      apiKeyConfig: z.object({
        apiKeySecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the API key. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        keyName: z.string().describe(
          'Required. The parameter name or the header name of the API key. E.g., If the API request is "https://example.com/act?X-Api-Key=", "X-Api-Key" would be the parameter name.',
        ).optional(),
        requestLocation: z.enum([
          "REQUEST_LOCATION_UNSPECIFIED",
          "HEADER",
          "QUERY_STRING",
        ]).describe("Required. Key location in the request.").optional(),
      }).describe("Optional. Config for API key auth.").optional(),
      bearerTokenConfig: z.object({
        token: z.string().describe(
          "Required. The bearer token. Must be in the format `$context.variables.`.",
        ).optional(),
      }).describe("Optional. Config for bearer token auth.").optional(),
      oauthConfig: z.object({
        clientId: z.string().describe(
          "Required. The client ID from the OAuth provider.",
        ).optional(),
        clientSecretVersion: z.string().describe(
          "Required. The name of the SecretManager secret version resource storing the client secret. Format: `projects/{project}/secrets/{secret}/versions/{version}` Note: You should grant `roles/secretmanager.secretAccessor` role to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
        oauthGrantType: z.enum([
          "OAUTH_GRANT_TYPE_UNSPECIFIED",
          "CLIENT_CREDENTIAL",
        ]).describe("Required. OAuth grant types.").optional(),
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant.",
        ).optional(),
        tokenEndpoint: z.string().describe(
          "Required. The token endpoint in the OAuth provider to exchange for an access token.",
        ).optional(),
      }).describe("Optional. Config for OAuth.").optional(),
      serviceAccountAuthConfig: z.object({
        scopes: z.array(z.string()).describe(
          "Optional. The OAuth scopes to grant. If not specified, the default scope `https://www.googleapis.com/auth/cloud-platform` is used.",
        ).optional(),
        serviceAccount: z.string().describe(
          "Required. The email address of the service account used for authentication. CES uses this service account to exchange an access token and the access token is then sent in the `Authorization` header of the request. The service account must have the `roles/iam.serviceAccountTokenCreator` role granted to the CES service agent `service-@gcp-sa-ces.iam.gserviceaccount.com`.",
        ).optional(),
      }).describe("Optional. Config for service account authentication.")
        .optional(),
      serviceAgentIdTokenAuthConfig: z.object({}).describe(
        "Optional. Config for ID token auth generated from CES service agent.",
      ).optional(),
    }).describe(
      "Optional. Authentication configuration for calling the remote agent.",
    ).optional(),
    description: z.string().describe("Required. The description of the tool.")
      .optional(),
    inputVariableMapping: z.record(z.string(), z.string()).describe(
      "Optional. Mapping of input variable names of remote agent to GECX variable names.",
    ).optional(),
    name: z.string().describe("Required. The name of the tool.").optional(),
    outputVariableMapping: z.record(z.string(), z.string()).describe(
      "Optional. Mapping of output variable names of remote agent to GECX variable names.",
    ).optional(),
    statefulAgent: z.boolean().describe(
      "Optional. When enabled, the interaction between the CXAS app and the remote agent will share the same context. If the remote agent returns a context_id, it will be persisted for the entirety of the session for this remote agent tool.",
    ).optional(),
  }).describe("Optional. The remote agent tool.").optional(),
  systemTool: z.object({
    description: z.string().describe(
      "Output only. The description of the system tool.",
    ).optional(),
    name: z.string().describe("Required. The name of the system tool.")
      .optional(),
  }).describe("Optional. The system tool.").optional(),
  timeout: z.string().describe(
    "Optional. The timeout for the tool execution. If not set, the default timeout is 30 seconds for `SYNCHRONOUS` tools and 60 seconds for `ASYNCHRONOUS` tools.",
  ).optional(),
  toolFakeConfig: z.object({
    codeBlock: z.object({
      pythonCode: z.string().describe(
        "Required. Python code which will be invoked in tool fake mode. Expected Python function signature - To catch all tool calls: def fake_tool_call(tool: Tool, input: dict[str, Any], callback_context: CallbackContext) -> Optional[dict[str, Any]]: To catch a specific tool call: def fake_{tool_id}(tool: Tool, input: dict[str, Any], callback_context: CallbackContext) -> Optional[dict[str, Any]]: If the function returns None, the real tool will be invoked instead.",
      ).optional(),
    }).describe(
      "Optional. Code block which will be executed instead of a real tool call.",
    ).optional(),
    enableFakeMode: z.boolean().describe(
      "Optional. Whether the tool is using fake mode.",
    ).optional(),
  }).describe("Optional. Configuration for tool behavior in fake mode.")
    .optional(),
  widgetTool: z.object({
    dataMapping: z.object({
      fieldMappings: z.record(z.string(), z.string()).describe(
        "Optional. A map of widget input parameter fields to the corresponding output fields of the source tool.",
      ).optional(),
      mode: z.enum(["MODE_UNSPECIFIED", "FIELD_MAPPING", "PYTHON_SCRIPT"])
        .describe("Optional. The mode of the data mapping.").optional(),
      pythonFunction: z.object({
        description: z.string().describe(
          "Output only. The description of the Python function, parsed from the python code's docstring.",
        ).optional(),
        name: z.string().describe(
          "Optional. The name of the Python function to execute. Must match a Python function name defined in the python code. Case sensitive. If the name is not provided, the first function defined in the python code will be used.",
        ).optional(),
        pythonCode: z.string().describe(
          "Optional. The Python code to execute for the tool.",
        ).optional(),
        serviceDirectoryConfig: z.object({
          service: z.string().describe(
            "Required. The name of [Service Directory](https://cloud.google.com/service-directory) service. Format: `projects/{project}/locations/{location}/namespaces/{namespace}/services/{service}`. Location of the service directory must be the same as the location of the app.",
          ).optional(),
        }).describe("Optional. Service Directory configuration for the tool.")
          .optional(),
      }).describe(
        "Optional. Configuration for a Python function used to transform the source tool's output into the widget's input format.",
      ).optional(),
      pythonScript: z.string().describe(
        "Deprecated: Use `python_function` instead.",
      ).optional(),
      sourceToolName: z.string().describe(
        "Optional. The resource name of the tool that provides the data for the widget (e.g., a search tool or a custom function). Format: `projects/{project}/locations/{location}/agents/{agent}/tools/{tool}`",
      ).optional(),
    }).describe(
      "Optional. The mapping that defines how data from a source tool is mapped to the widget's input parameters.",
    ).optional(),
    description: z.string().describe(
      "Optional. The description of the widget tool.",
    ).optional(),
    name: z.string().describe("Required. The display name of the widget tool.")
      .optional(),
    parameters: z.object({
      additionalProperties: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      anyOf: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. The value should be validated against any (one or more) of the subschemas in the list.",
      ).optional(),
      default: z.string().describe("Optional. Default value of the data.")
        .optional(),
      defs: z.record(z.string(), z.record(z.string(), z.unknown())).describe(
        "Optional. A map of definitions for use by `ref`. Only allowed at the root of the schema.",
      ).optional(),
      description: z.string().describe("Optional. The description of the data.")
        .optional(),
      enum: z.array(z.string()).describe(
        'Optional. Possible values of the element of primitive type with enum format. Examples: 1. We can define direction as: {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]} 2. We can define apartment number as: {type:INTEGER, format:enum, enum:["101", "201", "301"]}',
      ).optional(),
      items: z.record(z.string(), z.unknown()).describe(
        "Circular reference to Schema",
      ).optional(),
      maxItems: z.string().describe(
        "Optional. Maximum number of the elements for Type.ARRAY.",
      ).optional(),
      maximum: z.number().describe(
        "Optional. Maximum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      minItems: z.string().describe(
        "Optional. Minimum number of the elements for Type.ARRAY.",
      ).optional(),
      minimum: z.number().describe(
        "Optional. Minimum value for Type.INTEGER and Type.NUMBER.",
      ).optional(),
      nullable: z.boolean().describe(
        "Optional. Indicates if the value may be null.",
      ).optional(),
      prefixItems: z.array(z.record(z.string(), z.unknown())).describe(
        "Optional. Schemas of initial elements of Type.ARRAY.",
      ).optional(),
      properties: z.record(z.string(), z.record(z.string(), z.unknown()))
        .describe("Optional. Properties of Type.OBJECT.").optional(),
      ref: z.string().describe(
        'Optional. Allows indirect references between schema nodes. The value should be a valid reference to a child of the root `defs`. For example, the following schema defines a reference to a schema node named "Pet": ` type: object properties: pet: ref: #/defs/Pet defs: Pet: type: object properties: name: type: string ` The value of the "pet" property is a reference to the schema node named "Pet". See details in https://json-schema.org/understanding-json-schema/structuring.',
      ).optional(),
      required: z.array(z.string()).describe(
        "Optional. Required properties of Type.OBJECT.",
      ).optional(),
      title: z.string().describe("Optional. The title of the schema.")
        .optional(),
      type: z.enum([
        "TYPE_UNSPECIFIED",
        "STRING",
        "INTEGER",
        "NUMBER",
        "BOOLEAN",
        "OBJECT",
        "ARRAY",
      ]).describe("Required. The type of the data.").optional(),
      uniqueItems: z.boolean().describe(
        "Optional. Indicate the items in the array must be unique. Only applies to TYPE.ARRAY.",
      ).optional(),
    }).describe("Optional. The input parameters of the widget tool.")
      .optional(),
    textResponseConfig: z.object({
      staticText: z.string().describe(
        "Optional. The static text response to return when type is STATIC.",
      ).optional(),
      textResponseInstruction: z.string().describe(
        "Optional. Instruction for the LLM on how to generate the text response. Used as the description for the text response parameter if type is LLM_GENERATED.",
      ).optional(),
      type: z.enum(["TYPE_UNSPECIFIED", "NONE", "LLM_GENERATED", "STATIC"])
        .describe("Optional. The strategy for providing the text response.")
        .optional(),
    }).describe("Optional. Configuration for always-included text responses.")
      .optional(),
    uiConfig: z.record(z.string(), z.string()).describe(
      "Optional. Configuration for rendering the widget.",
    ).optional(),
    widgetType: z.enum([
      "WIDGET_TYPE_UNSPECIFIED",
      "CUSTOM",
      "PRODUCT_CAROUSEL",
      "PRODUCT_DETAILS",
      "QUICK_ACTIONS",
      "PRODUCT_COMPARISON",
      "ADVANCED_PRODUCT_DETAILS",
      "SHORT_FORM",
      "OVERALL_SATISFACTION",
      "ORDER_SUMMARY",
      "APPOINTMENT_DETAILS",
      "APPOINTMENT_SCHEDULER",
      "CONTACT_FORM",
    ]).describe(
      "Optional. The type of the widget tool. If not specified, the default type will be CUSTOMIZED.",
    ).optional(),
  }).describe("Optional. The widget tool.").optional(),
  toolId: z.string().describe(
    "Optional. The ID to use for the tool, which will become the final component of the tool's resource name. If not provided, a unique ID will be automatically assigned for the tool.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
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

/** Swamp extension model for Google Cloud Gemini Enterprise for Customer Experience Apps.Tools. Registered at `@swamp/gcp/ces/apps-tools`. */
export const model = {
  type: "@swamp/gcp/ces/apps-tools",
  version: "2026.09.15.1",
  upgrades: [
    {
      toVersion: "2026.04.01.2",
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
      toVersion: "2026.04.13.1",
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
      toVersion: "2026.05.09.1",
      description: "Added: remoteAgentTool, timeout",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
      description: "Added: remoteAgentTool, timeout",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.20.1",
      description: "Added: remoteAgentTool, timeout",
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
      toVersion: "2026.05.26.1",
      description: "Added: remoteAgentTool, timeout",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.04.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.05.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.05.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.06.1",
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
      toVersion: "2026.06.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.09.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
      description: "Added: parent",
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
      toVersion: "2026.07.20.2",
      description: "Added: remoteAgentTool, timeout",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.3",
      description: "Added: remoteAgentTool, timeout",
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
      toVersion: "2026.08.28.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "A tool represents an action that the CES agent can take to achieve certain go...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a tools",
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
        if (g["agentTool"] !== undefined) body["agentTool"] = g["agentTool"];
        if (g["clientFunction"] !== undefined) {
          body["clientFunction"] = g["clientFunction"];
        }
        if (g["connectorTool"] !== undefined) {
          body["connectorTool"] = g["connectorTool"];
        }
        if (g["dataStoreTool"] !== undefined) {
          body["dataStoreTool"] = g["dataStoreTool"];
        }
        if (g["executionType"] !== undefined) {
          body["executionType"] = g["executionType"];
        }
        if (g["fileSearchTool"] !== undefined) {
          body["fileSearchTool"] = g["fileSearchTool"];
        }
        if (g["googleSearchTool"] !== undefined) {
          body["googleSearchTool"] = g["googleSearchTool"];
        }
        if (g["mcpTool"] !== undefined) body["mcpTool"] = g["mcpTool"];
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["openApiTool"] !== undefined) {
          body["openApiTool"] = g["openApiTool"];
        }
        if (g["pythonFunction"] !== undefined) {
          body["pythonFunction"] = g["pythonFunction"];
        }
        if (g["remoteAgentTool"] !== undefined) {
          body["remoteAgentTool"] = g["remoteAgentTool"];
        }
        if (g["systemTool"] !== undefined) body["systemTool"] = g["systemTool"];
        if (g["timeout"] !== undefined) body["timeout"] = g["timeout"];
        if (g["toolFakeConfig"] !== undefined) {
          body["toolFakeConfig"] = g["toolFakeConfig"];
        }
        if (g["widgetTool"] !== undefined) body["widgetTool"] = g["widgetTool"];
        if (g["toolId"] !== undefined) params["toolId"] = String(g["toolId"]);
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
            matchField: "name",
            matchValue: String(g["name"] ?? ""),
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
      description: "Get a tools",
      arguments: z.object({
        identifier: z.string().describe("The name of the tools"),
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
      description: "Update tools attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific tools by name (e.g. one discovered by list)",
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
        if (g["agentTool"] !== undefined) body["agentTool"] = g["agentTool"];
        if (g["clientFunction"] !== undefined) {
          body["clientFunction"] = g["clientFunction"];
        }
        if (g["connectorTool"] !== undefined) {
          body["connectorTool"] = g["connectorTool"];
        }
        if (g["dataStoreTool"] !== undefined) {
          body["dataStoreTool"] = g["dataStoreTool"];
        }
        if (g["executionType"] !== undefined) {
          body["executionType"] = g["executionType"];
        }
        if (g["fileSearchTool"] !== undefined) {
          body["fileSearchTool"] = g["fileSearchTool"];
        }
        if (g["googleSearchTool"] !== undefined) {
          body["googleSearchTool"] = g["googleSearchTool"];
        }
        if (g["mcpTool"] !== undefined) body["mcpTool"] = g["mcpTool"];
        if (g["openApiTool"] !== undefined) {
          body["openApiTool"] = g["openApiTool"];
        }
        if (g["pythonFunction"] !== undefined) {
          body["pythonFunction"] = g["pythonFunction"];
        }
        if (g["remoteAgentTool"] !== undefined) {
          body["remoteAgentTool"] = g["remoteAgentTool"];
        }
        if (g["systemTool"] !== undefined) body["systemTool"] = g["systemTool"];
        if (g["timeout"] !== undefined) body["timeout"] = g["timeout"];
        if (g["toolFakeConfig"] !== undefined) {
          body["toolFakeConfig"] = g["toolFakeConfig"];
        }
        if (g["widgetTool"] !== undefined) body["widgetTool"] = g["widgetTool"];
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
      description: "Delete the tools",
      arguments: z.object({
        identifier: z.string().describe("The name of the tools"),
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
      description: "Sync tools state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific tools by name (e.g. one discovered by list)",
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
      description: "List tools resources",
      arguments: z.object({
        filter: z.string().describe(
          'Optional. Filter to be applied when listing the tools. Use "include_system_tools=true" to include system tools in the response. See https://google.aip.dev/160 for more details.',
        ).optional(),
        orderBy: z.string().describe(
          'Optional. Field to sort by. Only "name" and "create_time" is supported. See https://google.aip.dev/132#ordering for more details.',
        ).optional(),
        pageSize: z.number().describe(
          "Optional. Requested page size. Server may return fewer items than requested. If unspecified, server will pick an appropriate default.",
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
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["orderBy"] !== undefined) {
          params["orderBy"] = String(args["orderBy"]);
        }
        if (args["pageSize"] !== undefined) {
          params["pageSize"] = String(args["pageSize"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "tools",
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
