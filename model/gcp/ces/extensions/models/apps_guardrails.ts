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

// Auto-generated extension model for @swamp/gcp/ces/apps-guardrails
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Gemini Enterprise for Customer Experience Apps.Guardrails.
 *
 * Guardrail contains a list of checks and balances to keep the agents safe and secure.
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
  return `${parent}/guardrails/${shortName}`;
}

const BASE_URL = "https://ces.googleapis.com/";

const GET_CONFIG = {
  "id": "ces.projects.locations.apps.guardrails.get",
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
  "id": "ces.projects.locations.apps.guardrails.create",
  "path": "v1/{+parent}/guardrails",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "guardrailId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "ces.projects.locations.apps.guardrails.patch",
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
  "id": "ces.projects.locations.apps.guardrails.delete",
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
  "id": "ces.projects.locations.apps.guardrails.list",
  "path": "v1/{+parent}/guardrails",
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
  action: z.object({
    generativeAnswer: z.object({
      prompt: z.string().describe(
        "Required. The prompt to use for the generative answer.",
      ).optional(),
    }).describe("Optional. Respond with a generative answer.").optional(),
    respondImmediately: z.object({
      responses: z.array(z.object({
        disabled: z.boolean().describe(
          "Optional. Whether the response is disabled. Disabled responses are not used by the agent.",
        ).optional(),
        text: z.string().describe(
          "Required. Text for the agent to respond with.",
        ).optional(),
      })).describe(
        "Required. The canned responses for the agent to choose from. The response is chosen randomly.",
      ).optional(),
    }).describe("Optional. Immediately respond with a preconfigured response.")
      .optional(),
    transferAgent: z.object({
      agent: z.string().describe(
        "Required. The name of the agent to transfer the conversation to. The agent must be in the same app as the current agent. Format: `projects/{project}/locations/{location}/apps/{app}/agents/{agent}`",
      ).optional(),
    }).describe("Optional. Transfer the conversation to a different agent.")
      .optional(),
  }).describe("Optional. Action to take when the guardrail is triggered.")
    .optional(),
  codeCallback: z.object({
    afterAgentCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute after the agent is called. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
    afterModelCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute after the model is called. If there are multiple calls to the model, the callback will be executed multiple times. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
    beforeAgentCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute before the agent is called. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
    beforeModelCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute before the model is called. If there are multiple calls to the model, the callback will be executed multiple times. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
  }).describe(
    "Optional. Guardrail that potentially blocks the conversation based on the result of the callback execution.",
  ).optional(),
  contentFilter: z.object({
    bannedContents: z.array(z.string()).describe(
      "Optional. List of banned phrases. Applies to both user inputs and agent responses.",
    ).optional(),
    bannedContentsInAgentResponse: z.array(z.string()).describe(
      "Optional. List of banned phrases. Applies only to agent responses.",
    ).optional(),
    bannedContentsInUserInput: z.array(z.string()).describe(
      "Optional. List of banned phrases. Applies only to user inputs.",
    ).optional(),
    disregardDiacritics: z.boolean().describe(
      "Optional. If true, diacritics are ignored during matching.",
    ).optional(),
    matchType: z.enum([
      "MATCH_TYPE_UNSPECIFIED",
      "SIMPLE_STRING_MATCH",
      "WORD_BOUNDARY_STRING_MATCH",
      "REGEXP_MATCH",
    ]).describe("Required. Match type for the content filter.").optional(),
  }).describe(
    "Optional. Guardrail that bans certain content from being used in the conversation.",
  ).optional(),
  description: z.string().describe("Optional. Description of the guardrail.")
    .optional(),
  displayName: z.string().describe("Required. Display name of the guardrail.")
    .optional(),
  enabled: z.boolean().describe("Optional. Whether the guardrail is enabled.")
    .optional(),
  llmPolicy: z.object({
    allowShortUtterance: z.boolean().describe(
      "Optional. By default, the LLM policy check is bypassed for short utterances. Enabling this setting applies the policy check to all utterances, including those that would normally be skipped.",
    ).optional(),
    failOpen: z.boolean().describe(
      "Optional. If an error occurs during the policy check, fail open and do not trigger the guardrail.",
    ).optional(),
    maxConversationMessages: z.number().int().describe(
      "Optional. When checking this policy, consider the last 'n' messages in the conversation. When not set a default value of 10 will be used.",
    ).optional(),
    modelSettings: z.object({
      model: z.string().describe(
        "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
      ).optional(),
      temperature: z.number().describe(
        "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
      ).optional(),
    }).describe("Optional. Model settings.").optional(),
    policyScope: z.enum([
      "POLICY_SCOPE_UNSPECIFIED",
      "USER_QUERY",
      "AGENT_RESPONSE",
      "USER_QUERY_AND_AGENT_RESPONSE",
    ]).describe(
      "Required. Defines when to apply the policy check during the conversation. If set to `POLICY_SCOPE_UNSPECIFIED`, the policy will be applied to the user input. When applying the policy to the agent response, additional latency will be introduced before the agent can respond.",
    ).optional(),
    prompt: z.string().describe("Required. Policy prompt.").optional(),
  }).describe(
    "Optional. Guardrail that blocks the conversation if the LLM response is considered violating the policy based on the LLM classification.",
  ).optional(),
  llmPromptSecurity: z.object({
    customPolicy: z.object({
      allowShortUtterance: z.boolean().describe(
        "Optional. By default, the LLM policy check is bypassed for short utterances. Enabling this setting applies the policy check to all utterances, including those that would normally be skipped.",
      ).optional(),
      failOpen: z.boolean().describe(
        "Optional. If an error occurs during the policy check, fail open and do not trigger the guardrail.",
      ).optional(),
      maxConversationMessages: z.number().int().describe(
        "Optional. When checking this policy, consider the last 'n' messages in the conversation. When not set a default value of 10 will be used.",
      ).optional(),
      modelSettings: z.object({
        model: z.string().describe(
          "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
        ).optional(),
        temperature: z.number().describe(
          "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
        ).optional(),
      }).describe("Optional. Model settings.").optional(),
      policyScope: z.enum([
        "POLICY_SCOPE_UNSPECIFIED",
        "USER_QUERY",
        "AGENT_RESPONSE",
        "USER_QUERY_AND_AGENT_RESPONSE",
      ]).describe(
        "Required. Defines when to apply the policy check during the conversation. If set to `POLICY_SCOPE_UNSPECIFIED`, the policy will be applied to the user input. When applying the policy to the agent response, additional latency will be introduced before the agent can respond.",
      ).optional(),
      prompt: z.string().describe("Required. Policy prompt.").optional(),
    }).describe(
      "Optional. Use a user-defined LlmPolicy to configure the security guardrail.",
    ).optional(),
    defaultSettings: z.object({
      defaultPromptTemplate: z.string().describe(
        "Output only. The default prompt template used by the system. This field is for display purposes to show the user what prompt the system uses by default. It is OUTPUT_ONLY.",
      ).optional(),
    }).describe(
      "Optional. Use the system's predefined default security settings. To select this mode, include an empty 'default_settings' message in the request. The 'default_prompt_template' field within will be populated by the server in the response.",
    ).optional(),
    failOpen: z.boolean().describe(
      "Optional. Determines the behavior when the guardrail encounters an LLM error. - If true: the guardrail is bypassed. - If false (default): the guardrail triggers/blocks. Note: If a custom policy is provided, this field is ignored in favor of the policy's 'fail_open' configuration.",
    ).optional(),
  }).describe(
    "Optional. Guardrail that blocks the conversation if the prompt is considered unsafe based on the LLM classification.",
  ).optional(),
  modelSafety: z.object({
    safetySettings: z.array(z.object({
      category: z.enum([
        "HARM_CATEGORY_UNSPECIFIED",
        "HARM_CATEGORY_HATE_SPEECH",
        "HARM_CATEGORY_DANGEROUS_CONTENT",
        "HARM_CATEGORY_HARASSMENT",
        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "HARM_CATEGORY_PROFANITY",
        "HARM_CATEGORY_TOXIC",
      ]).describe("Required. The harm category.").optional(),
      threshold: z.enum([
        "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
        "BLOCK_LOW_AND_ABOVE",
        "BLOCK_MEDIUM_AND_ABOVE",
        "BLOCK_ONLY_HIGH",
        "BLOCK_NONE",
        "OFF",
      ]).describe("Required. The harm block threshold.").optional(),
    })).describe("Required. List of safety settings.").optional(),
  }).describe(
    "Optional. Guardrail that blocks the conversation if the LLM response is considered unsafe based on the model safety settings.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The unique identifier of the guardrail. Format: `projects/{project}/locations/{location}/apps/{app}/guardrails/{guardrail}`",
  ).optional(),
  supervisor: z.object({
    detectionMode: z.enum([
      "DETECTION_MODE_UNSPECIFIED",
      "NON_BLOCKING",
      "BLOCKING",
    ]).describe("Optional. The detection mode of the supervisor.").optional(),
    type: z.enum([
      "TYPE_UNSPECIFIED",
      "INVALID_TEXT",
      "LANGUAGE_SHIFT",
      "SPEAKER_SHIFT",
      "AUDIO_MISMATCH",
      "MISSING_TOOL_CALL",
      "CUSTOM",
      "CHOPPY_AUDIO",
    ]).describe("Optional. The type of the supervisor.").optional(),
  }).describe("Optional. Guardrail that runs supervisor intervention.")
    .optional(),
  guardrailId: z.string().describe(
    "Optional. The ID to use for the guardrail, which will become the final component of the guardrail's resource name. If not provided, a unique ID will be automatically assigned for the guardrail.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  action: z.object({
    generativeAnswer: z.object({
      prompt: z.string(),
    }),
    respondImmediately: z.object({
      responses: z.array(z.object({
        disabled: z.boolean(),
        text: z.string(),
      })),
    }),
    transferAgent: z.object({
      agent: z.string(),
    }),
  }).optional(),
  codeCallback: z.object({
    afterAgentCallback: z.object({
      description: z.string(),
      disabled: z.boolean(),
      proactiveExecutionEnabled: z.boolean(),
      pythonCode: z.string(),
    }),
    afterModelCallback: z.object({
      description: z.string(),
      disabled: z.boolean(),
      proactiveExecutionEnabled: z.boolean(),
      pythonCode: z.string(),
    }),
    beforeAgentCallback: z.object({
      description: z.string(),
      disabled: z.boolean(),
      proactiveExecutionEnabled: z.boolean(),
      pythonCode: z.string(),
    }),
    beforeModelCallback: z.object({
      description: z.string(),
      disabled: z.boolean(),
      proactiveExecutionEnabled: z.boolean(),
      pythonCode: z.string(),
    }),
  }).optional(),
  contentFilter: z.object({
    bannedContents: z.array(z.string()),
    bannedContentsInAgentResponse: z.array(z.string()),
    bannedContentsInUserInput: z.array(z.string()),
    disregardDiacritics: z.boolean(),
    matchType: z.string(),
  }).optional(),
  createTime: z.string().optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  enabled: z.boolean().optional(),
  etag: z.string().optional(),
  llmPolicy: z.object({
    allowShortUtterance: z.boolean(),
    failOpen: z.boolean(),
    maxConversationMessages: z.number(),
    modelSettings: z.object({
      model: z.string(),
      temperature: z.number(),
    }),
    policyScope: z.string(),
    prompt: z.string(),
  }).optional(),
  llmPromptSecurity: z.object({
    customPolicy: z.object({
      allowShortUtterance: z.boolean(),
      failOpen: z.boolean(),
      maxConversationMessages: z.number(),
      modelSettings: z.object({
        model: z.string(),
        temperature: z.number(),
      }),
      policyScope: z.string(),
      prompt: z.string(),
    }),
    defaultSettings: z.object({
      defaultPromptTemplate: z.string(),
    }),
    failOpen: z.boolean(),
  }).optional(),
  modelSafety: z.object({
    safetySettings: z.array(z.object({
      category: z.string(),
      threshold: z.string(),
    })),
  }).optional(),
  name: z.string(),
  supervisor: z.object({
    detectionMode: z.string(),
    type: z.string(),
  }).optional(),
  updateTime: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  action: z.object({
    generativeAnswer: z.object({
      prompt: z.string().describe(
        "Required. The prompt to use for the generative answer.",
      ).optional(),
    }).describe("Optional. Respond with a generative answer.").optional(),
    respondImmediately: z.object({
      responses: z.array(z.object({
        disabled: z.boolean().describe(
          "Optional. Whether the response is disabled. Disabled responses are not used by the agent.",
        ).optional(),
        text: z.string().describe(
          "Required. Text for the agent to respond with.",
        ).optional(),
      })).describe(
        "Required. The canned responses for the agent to choose from. The response is chosen randomly.",
      ).optional(),
    }).describe("Optional. Immediately respond with a preconfigured response.")
      .optional(),
    transferAgent: z.object({
      agent: z.string().describe(
        "Required. The name of the agent to transfer the conversation to. The agent must be in the same app as the current agent. Format: `projects/{project}/locations/{location}/apps/{app}/agents/{agent}`",
      ).optional(),
    }).describe("Optional. Transfer the conversation to a different agent.")
      .optional(),
  }).describe("Optional. Action to take when the guardrail is triggered.")
    .optional(),
  codeCallback: z.object({
    afterAgentCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute after the agent is called. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
    afterModelCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute after the model is called. If there are multiple calls to the model, the callback will be executed multiple times. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
    beforeAgentCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute before the agent is called. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
    beforeModelCallback: z.object({
      description: z.string().describe(
        "Optional. Human-readable description of the callback.",
      ).optional(),
      disabled: z.boolean().describe(
        "Optional. Whether the callback is disabled. Disabled callbacks are ignored by the agent.",
      ).optional(),
      proactiveExecutionEnabled: z.boolean().describe(
        "Optional. If enabled, the callback will also be executed on intermediate model outputs. This setting only affects after model callback. **ENABLE WITH CAUTION**. Typically after model callback only needs to be executed after receiving all model responses. Enabling proactive execution may have negative implication on the execution cost and latency, and should only be enabled in rare situations.",
      ).optional(),
      pythonCode: z.string().describe(
        "Required. The python code to execute for the callback.",
      ).optional(),
    }).describe(
      "Optional. The callback to execute before the model is called. If there are multiple calls to the model, the callback will be executed multiple times. Each callback function is expected to return a structure (e.g., a dict or object) containing at least: - 'decision': Either 'OK' or 'TRIGGER'. - 'reason': A string explaining the decision. A 'TRIGGER' decision may halt further processing.",
    ).optional(),
  }).describe(
    "Optional. Guardrail that potentially blocks the conversation based on the result of the callback execution.",
  ).optional(),
  contentFilter: z.object({
    bannedContents: z.array(z.string()).describe(
      "Optional. List of banned phrases. Applies to both user inputs and agent responses.",
    ).optional(),
    bannedContentsInAgentResponse: z.array(z.string()).describe(
      "Optional. List of banned phrases. Applies only to agent responses.",
    ).optional(),
    bannedContentsInUserInput: z.array(z.string()).describe(
      "Optional. List of banned phrases. Applies only to user inputs.",
    ).optional(),
    disregardDiacritics: z.boolean().describe(
      "Optional. If true, diacritics are ignored during matching.",
    ).optional(),
    matchType: z.enum([
      "MATCH_TYPE_UNSPECIFIED",
      "SIMPLE_STRING_MATCH",
      "WORD_BOUNDARY_STRING_MATCH",
      "REGEXP_MATCH",
    ]).describe("Required. Match type for the content filter.").optional(),
  }).describe(
    "Optional. Guardrail that bans certain content from being used in the conversation.",
  ).optional(),
  description: z.string().describe("Optional. Description of the guardrail.")
    .optional(),
  displayName: z.string().describe("Required. Display name of the guardrail.")
    .optional(),
  enabled: z.boolean().describe("Optional. Whether the guardrail is enabled.")
    .optional(),
  llmPolicy: z.object({
    allowShortUtterance: z.boolean().describe(
      "Optional. By default, the LLM policy check is bypassed for short utterances. Enabling this setting applies the policy check to all utterances, including those that would normally be skipped.",
    ).optional(),
    failOpen: z.boolean().describe(
      "Optional. If an error occurs during the policy check, fail open and do not trigger the guardrail.",
    ).optional(),
    maxConversationMessages: z.number().int().describe(
      "Optional. When checking this policy, consider the last 'n' messages in the conversation. When not set a default value of 10 will be used.",
    ).optional(),
    modelSettings: z.object({
      model: z.string().describe(
        "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
      ).optional(),
      temperature: z.number().describe(
        "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
      ).optional(),
    }).describe("Optional. Model settings.").optional(),
    policyScope: z.enum([
      "POLICY_SCOPE_UNSPECIFIED",
      "USER_QUERY",
      "AGENT_RESPONSE",
      "USER_QUERY_AND_AGENT_RESPONSE",
    ]).describe(
      "Required. Defines when to apply the policy check during the conversation. If set to `POLICY_SCOPE_UNSPECIFIED`, the policy will be applied to the user input. When applying the policy to the agent response, additional latency will be introduced before the agent can respond.",
    ).optional(),
    prompt: z.string().describe("Required. Policy prompt.").optional(),
  }).describe(
    "Optional. Guardrail that blocks the conversation if the LLM response is considered violating the policy based on the LLM classification.",
  ).optional(),
  llmPromptSecurity: z.object({
    customPolicy: z.object({
      allowShortUtterance: z.boolean().describe(
        "Optional. By default, the LLM policy check is bypassed for short utterances. Enabling this setting applies the policy check to all utterances, including those that would normally be skipped.",
      ).optional(),
      failOpen: z.boolean().describe(
        "Optional. If an error occurs during the policy check, fail open and do not trigger the guardrail.",
      ).optional(),
      maxConversationMessages: z.number().int().describe(
        "Optional. When checking this policy, consider the last 'n' messages in the conversation. When not set a default value of 10 will be used.",
      ).optional(),
      modelSettings: z.object({
        model: z.string().describe(
          "Optional. The LLM model that the agent should use. If not set, the agent will inherit the model from its parent agent.",
        ).optional(),
        temperature: z.number().describe(
          "Optional. If set, this temperature will be used for the LLM model. Temperature controls the randomness of the model's responses. Lower temperatures produce responses that are more predictable. Higher temperatures produce responses that are more creative.",
        ).optional(),
      }).describe("Optional. Model settings.").optional(),
      policyScope: z.enum([
        "POLICY_SCOPE_UNSPECIFIED",
        "USER_QUERY",
        "AGENT_RESPONSE",
        "USER_QUERY_AND_AGENT_RESPONSE",
      ]).describe(
        "Required. Defines when to apply the policy check during the conversation. If set to `POLICY_SCOPE_UNSPECIFIED`, the policy will be applied to the user input. When applying the policy to the agent response, additional latency will be introduced before the agent can respond.",
      ).optional(),
      prompt: z.string().describe("Required. Policy prompt.").optional(),
    }).describe(
      "Optional. Use a user-defined LlmPolicy to configure the security guardrail.",
    ).optional(),
    defaultSettings: z.object({
      defaultPromptTemplate: z.string().describe(
        "Output only. The default prompt template used by the system. This field is for display purposes to show the user what prompt the system uses by default. It is OUTPUT_ONLY.",
      ).optional(),
    }).describe(
      "Optional. Use the system's predefined default security settings. To select this mode, include an empty 'default_settings' message in the request. The 'default_prompt_template' field within will be populated by the server in the response.",
    ).optional(),
    failOpen: z.boolean().describe(
      "Optional. Determines the behavior when the guardrail encounters an LLM error. - If true: the guardrail is bypassed. - If false (default): the guardrail triggers/blocks. Note: If a custom policy is provided, this field is ignored in favor of the policy's 'fail_open' configuration.",
    ).optional(),
  }).describe(
    "Optional. Guardrail that blocks the conversation if the prompt is considered unsafe based on the LLM classification.",
  ).optional(),
  modelSafety: z.object({
    safetySettings: z.array(z.object({
      category: z.enum([
        "HARM_CATEGORY_UNSPECIFIED",
        "HARM_CATEGORY_HATE_SPEECH",
        "HARM_CATEGORY_DANGEROUS_CONTENT",
        "HARM_CATEGORY_HARASSMENT",
        "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "HARM_CATEGORY_PROFANITY",
        "HARM_CATEGORY_TOXIC",
      ]).describe("Required. The harm category.").optional(),
      threshold: z.enum([
        "HARM_BLOCK_THRESHOLD_UNSPECIFIED",
        "BLOCK_LOW_AND_ABOVE",
        "BLOCK_MEDIUM_AND_ABOVE",
        "BLOCK_ONLY_HIGH",
        "BLOCK_NONE",
        "OFF",
      ]).describe("Required. The harm block threshold.").optional(),
    })).describe("Required. List of safety settings.").optional(),
  }).describe(
    "Optional. Guardrail that blocks the conversation if the LLM response is considered unsafe based on the model safety settings.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The unique identifier of the guardrail. Format: `projects/{project}/locations/{location}/apps/{app}/guardrails/{guardrail}`",
  ).optional(),
  supervisor: z.object({
    detectionMode: z.enum([
      "DETECTION_MODE_UNSPECIFIED",
      "NON_BLOCKING",
      "BLOCKING",
    ]).describe("Optional. The detection mode of the supervisor.").optional(),
    type: z.enum([
      "TYPE_UNSPECIFIED",
      "INVALID_TEXT",
      "LANGUAGE_SHIFT",
      "SPEAKER_SHIFT",
      "AUDIO_MISMATCH",
      "MISSING_TOOL_CALL",
      "CUSTOM",
      "CHOPPY_AUDIO",
    ]).describe("Optional. The type of the supervisor.").optional(),
  }).describe("Optional. Guardrail that runs supervisor intervention.")
    .optional(),
  guardrailId: z.string().describe(
    "Optional. The ID to use for the guardrail, which will become the final component of the guardrail's resource name. If not provided, a unique ID will be automatically assigned for the guardrail.",
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

/** Swamp extension model for Google Cloud Gemini Enterprise for Customer Experience Apps.Guardrails. Registered at `@swamp/gcp/ces/apps-guardrails`. */
export const model = {
  type: "@swamp/gcp/ces/apps-guardrails",
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
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.1",
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
      toVersion: "2026.08.28.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.15.1",
      description: "Added: supervisor",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "Guardrail contains a list of checks and balances to keep the agents safe and ...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a guardrails",
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
        if (g["action"] !== undefined) body["action"] = g["action"];
        if (g["codeCallback"] !== undefined) {
          body["codeCallback"] = g["codeCallback"];
        }
        if (g["contentFilter"] !== undefined) {
          body["contentFilter"] = g["contentFilter"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["enabled"] !== undefined) body["enabled"] = g["enabled"];
        if (g["llmPolicy"] !== undefined) body["llmPolicy"] = g["llmPolicy"];
        if (g["llmPromptSecurity"] !== undefined) {
          body["llmPromptSecurity"] = g["llmPromptSecurity"];
        }
        if (g["modelSafety"] !== undefined) {
          body["modelSafety"] = g["modelSafety"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["supervisor"] !== undefined) body["supervisor"] = g["supervisor"];
        if (g["guardrailId"] !== undefined) {
          params["guardrailId"] = String(g["guardrailId"]);
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
      description: "Get a guardrails",
      arguments: z.object({
        identifier: z.string().describe("The name of the guardrails"),
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
      description: "Update guardrails attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific guardrails by name (e.g. one discovered by list)",
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
        if (g["action"] !== undefined) body["action"] = g["action"];
        if (g["codeCallback"] !== undefined) {
          body["codeCallback"] = g["codeCallback"];
        }
        if (g["contentFilter"] !== undefined) {
          body["contentFilter"] = g["contentFilter"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["enabled"] !== undefined) body["enabled"] = g["enabled"];
        if (g["llmPolicy"] !== undefined) body["llmPolicy"] = g["llmPolicy"];
        if (g["llmPromptSecurity"] !== undefined) {
          body["llmPromptSecurity"] = g["llmPromptSecurity"];
        }
        if (g["modelSafety"] !== undefined) {
          body["modelSafety"] = g["modelSafety"];
        }
        if (g["supervisor"] !== undefined) body["supervisor"] = g["supervisor"];
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
      description: "Delete the guardrails",
      arguments: z.object({
        identifier: z.string().describe("The name of the guardrails"),
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
      description: "Sync guardrails state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific guardrails by name (e.g. one discovered by list)",
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
      description: "List guardrails resources",
      arguments: z.object({
        filter: z.string().describe(
          "Optional. Filter to be applied when listing the guardrails. See https://google.aip.dev/160 for more details.",
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
          "guardrails",
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
