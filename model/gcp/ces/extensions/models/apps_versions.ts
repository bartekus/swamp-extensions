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

// Auto-generated extension model for @swamp/gcp/ces/apps-versions
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Gemini Enterprise for Customer Experience Apps.Versions.
 *
 * In Customer Engagement Suite (CES), an app version is a snapshot of the app at a specific point in time. It is immutable and cannot be modified once created.
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
  return `${parent}/versions/${shortName}`;
}

const BASE_URL = "https://ces.googleapis.com/";

const GET_CONFIG = {
  "id": "ces.projects.locations.apps.versions.get",
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
  "id": "ces.projects.locations.apps.versions.create",
  "path": "v1/{+parent}/versions",
  "httpMethod": "POST",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "appVersionId": {
      "location": "query",
    },
    "parent": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "ces.projects.locations.apps.versions.patch",
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
  "id": "ces.projects.locations.apps.versions.delete",
  "path": "v1/{+name}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "name",
  ],
  "parameters": {
    "etag": {
      "location": "query",
    },
    "name": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "ces.projects.locations.apps.versions.list",
  "path": "v1/{+parent}/versions",
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
  description: z.string().describe(
    "Optional. The description of the app version.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. The display name of the app version.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The unique identifier of the app version. Format: `projects/{project}/locations/{location}/apps/{app}/versions/{version}`",
  ).optional(),
  appVersionId: z.string().describe(
    "Optional. The ID to use for the app version, which will become the final component of the app version's resource name. If not provided, a unique ID will be automatically assigned for the app version.",
  ).optional(),
  parent: z.string().describe(
    "The parent resource name (e.g., projects/my-project/locations/us-central1, organizations/123, folders/456)",
  ).optional(),
  location: z.string().describe(
    "The location for this resource (e.g., 'us', 'us-central1', 'europe-west1')",
  ).optional(),
});

const StateSchema = z.object({
  createTime: z.string().optional(),
  creator: z.string().optional(),
  description: z.string().optional(),
  displayName: z.string().optional(),
  etag: z.string().optional(),
  name: z.string(),
  snapshot: z.object({
    agents: z.array(z.object({
      afterAgentCallbacks: z.array(z.object({
        description: z.unknown(),
        disabled: z.unknown(),
        proactiveExecutionEnabled: z.unknown(),
        pythonCode: z.unknown(),
      })),
      afterModelCallbacks: z.array(z.object({
        description: z.unknown(),
        disabled: z.unknown(),
        proactiveExecutionEnabled: z.unknown(),
        pythonCode: z.unknown(),
      })),
      afterToolCallbacks: z.array(z.object({
        description: z.unknown(),
        disabled: z.unknown(),
        proactiveExecutionEnabled: z.unknown(),
        pythonCode: z.unknown(),
      })),
      beforeAgentCallbacks: z.array(z.object({
        description: z.unknown(),
        disabled: z.unknown(),
        proactiveExecutionEnabled: z.unknown(),
        pythonCode: z.unknown(),
      })),
      beforeModelCallbacks: z.array(z.object({
        description: z.unknown(),
        disabled: z.unknown(),
        proactiveExecutionEnabled: z.unknown(),
        pythonCode: z.unknown(),
      })),
      beforeToolCallbacks: z.array(z.object({
        description: z.unknown(),
        disabled: z.unknown(),
        proactiveExecutionEnabled: z.unknown(),
        pythonCode: z.unknown(),
      })),
      childAgents: z.array(z.string()),
      createTime: z.string(),
      description: z.string(),
      displayName: z.string(),
      etag: z.string(),
      generatedSummary: z.string(),
      guardrails: z.array(z.string()),
      instruction: z.string(),
      llmAgent: z.object({}),
      modelSettings: z.object({
        model: z.string(),
        temperature: z.number(),
      }),
      name: z.string(),
      remoteA2aAgent: z.object({
        a2aConfig: z.object({
          agentCard: z.unknown(),
          agentRegistry: z.unknown(),
          apiAuthentication: z.unknown(),
          contextId: z.unknown(),
          inputVariableMapping: z.unknown(),
          outputVariableMapping: z.unknown(),
          streamingEnabled: z.unknown(),
        }),
      }),
      remoteDialogflowAgent: z.object({
        agent: z.string(),
        environmentId: z.string(),
        flowId: z.string(),
        inputVariableMapping: z.record(z.string(), z.unknown()),
        languageCodeVariable: z.string(),
        outputVariableMapping: z.record(z.string(), z.unknown()),
        respectResponseInterruptionSettings: z.boolean(),
      }),
      tools: z.array(z.string()),
      toolsets: z.array(z.object({
        toolIds: z.unknown(),
        toolset: z.unknown(),
      })),
      transferRules: z.array(z.object({
        childAgent: z.unknown(),
        deterministicTransfer: z.unknown(),
        direction: z.unknown(),
        disablePlannerTransfer: z.unknown(),
      })),
      updateTime: z.string(),
      validationErrors: z.array(z.string()),
    })),
    app: z.object({
      audioProcessingConfig: z.object({
        ambientSoundConfig: z.object({
          gcsUri: z.string(),
          prebuiltAmbientNoise: z.string(),
          prebuiltAmbientSound: z.string(),
          volumeGainDb: z.number(),
        }),
        bargeInConfig: z.object({
          bargeInAwareness: z.boolean(),
          disableBargeIn: z.boolean(),
        }),
        customVoiceSamples: z.array(z.object({
          consentAudioGcsUri: z.unknown(),
          name: z.unknown(),
          previewAudioContent: z.unknown(),
          previewText: z.unknown(),
          voiceInstruction: z.unknown(),
          voiceSampleGcsUri: z.unknown(),
        })),
        inactivityTimeout: z.string(),
        synthesizeSpeechConfigs: z.record(z.string(), z.unknown()),
      }),
      clientCertificateSettings: z.object({
        passphrase: z.string(),
        privateKey: z.string(),
        tlsCertificate: z.string(),
      }),
      createTime: z.string(),
      dashboardSettings: z.object({
        defaultDashboard: z.string(),
      }),
      dataStoreSettings: z.object({
        engines: z.array(z.object({
          name: z.unknown(),
          type: z.unknown(),
        })),
      }),
      defaultChannelProfile: z.object({
        channelType: z.string(),
        disableBargeInControl: z.boolean(),
        disableDtmf: z.boolean(),
        instagramConfig: z.object({
          description: z.string(),
          displayName: z.string(),
          instagramAccountId: z.string(),
          thumbnailUrl: z.string(),
        }),
        noiseSuppressionLevel: z.string(),
        personaProperty: z.object({
          persona: z.string(),
        }),
        profileId: z.string(),
        webWidgetConfig: z.object({
          modality: z.string(),
          securitySettings: z.object({
            allowedOrigins: z.unknown(),
            enableOriginCheck: z.unknown(),
            enablePublicAccess: z.unknown(),
            enableRecaptcha: z.unknown(),
          }),
          theme: z.string(),
          webWidgetTitle: z.string(),
        }),
        whatsappConfig: z.object({
          description: z.string(),
          displayName: z.string(),
          phoneNumber: z.string(),
          phoneNumberId: z.string(),
          thumbnailUrl: z.string(),
          wabaId: z.string(),
        }),
      }),
      deploymentCount: z.number(),
      description: z.string(),
      displayName: z.string(),
      errorHandlingSettings: z.object({
        endSessionConfig: z.object({
          escalateSession: z.boolean(),
        }),
        errorHandlingStrategy: z.string(),
        fallbackResponseConfig: z.object({
          customFallbackMessages: z.record(z.string(), z.unknown()),
          maxFallbackAttempts: z.number(),
        }),
      }),
      etag: z.string(),
      evaluationMetricsThresholds: z.object({
        goldenEvaluationMetricsThresholds: z.object({
          expectationLevelMetricsThresholds: z.object({
            toolInvocationParameterCorrectnessThreshold: z.unknown(),
          }),
          toolMatchingSettings: z.object({
            extraToolCallBehavior: z.unknown(),
          }),
          turnLevelMetricsThresholds: z.object({
            overallToolInvocationCorrectnessThreshold: z.unknown(),
            semanticSimilarityChannel: z.unknown(),
            semanticSimilaritySuccessThreshold: z.unknown(),
          }),
        }),
        goldenHallucinationMetricBehavior: z.string(),
        hallucinationMetricBehavior: z.string(),
        scenarioHallucinationMetricBehavior: z.string(),
      }),
      globalInstruction: z.string(),
      guardrails: z.array(z.string()),
      languageSettings: z.object({
        defaultLanguageCode: z.string(),
        enableMultilingualSupport: z.boolean(),
        fallbackAction: z.string(),
        supportedLanguageCodes: z.array(z.string()),
      }),
      locked: z.boolean(),
      loggingSettings: z.object({
        audioRecordingConfig: z.object({
          gcsBucket: z.string(),
          gcsPathPrefix: z.string(),
        }),
        bigqueryExportSettings: z.object({
          dataset: z.string(),
          enabled: z.boolean(),
          project: z.string(),
        }),
        cloudLoggingSettings: z.object({
          enableCloudLogging: z.boolean(),
        }),
        conversationLoggingSettings: z.object({
          disableConversationLogging: z.boolean(),
          retentionWindow: z.string(),
        }),
        evaluationAudioRecordingConfig: z.object({
          gcsBucket: z.string(),
          gcsPathPrefix: z.string(),
        }),
        metricAnalysisSettings: z.object({
          llmMetricsOptedOut: z.boolean(),
        }),
        redactionConfig: z.object({
          deidentifyTemplate: z.string(),
          enableRedaction: z.boolean(),
          inspectTemplate: z.string(),
        }),
        unredactedAudioRecordingConfig: z.object({
          gcsBucket: z.string(),
          gcsPathPrefix: z.string(),
        }),
        unredactedBigqueryExportSettings: z.object({
          dataset: z.string(),
          enabled: z.boolean(),
          project: z.string(),
        }),
      }),
      metadata: z.record(z.string(), z.unknown()),
      modelSettings: z.object({
        model: z.string(),
        temperature: z.number(),
      }),
      name: z.string(),
      pinned: z.boolean(),
      predefinedVariableDeclarations: z.array(z.object({
        description: z.string(),
        name: z.string(),
        schema: z.object({
          additionalProperties: z.unknown(),
          anyOf: z.unknown(),
          default: z.unknown(),
          defs: z.unknown(),
          description: z.unknown(),
          enum: z.unknown(),
          items: z.unknown(),
          maxItems: z.unknown(),
          maximum: z.unknown(),
          minItems: z.unknown(),
          minimum: z.unknown(),
          nullable: z.unknown(),
          prefixItems: z.unknown(),
          properties: z.unknown(),
          ref: z.unknown(),
          required: z.unknown(),
          title: z.unknown(),
          type: z.unknown(),
          uniqueItems: z.unknown(),
        }),
      })),
      rootAgent: z.string(),
      timeZoneSettings: z.object({
        timeZone: z.string(),
      }),
      toolExecutionMode: z.string(),
      updateTime: z.string(),
      validationErrors: z.array(z.string()),
      variableDeclarations: z.array(z.object({
        description: z.string(),
        name: z.string(),
        schema: z.object({
          additionalProperties: z.unknown(),
          anyOf: z.unknown(),
          default: z.unknown(),
          defs: z.unknown(),
          description: z.unknown(),
          enum: z.unknown(),
          items: z.unknown(),
          maxItems: z.unknown(),
          maximum: z.unknown(),
          minItems: z.unknown(),
          minimum: z.unknown(),
          nullable: z.unknown(),
          prefixItems: z.unknown(),
          properties: z.unknown(),
          ref: z.unknown(),
          required: z.unknown(),
          title: z.unknown(),
          type: z.unknown(),
          uniqueItems: z.unknown(),
        }),
      })),
      vpcScSettings: z.object({
        allowedOrigins: z.array(z.string()),
      }),
    }),
    examples: z.array(z.object({
      createTime: z.string(),
      description: z.string(),
      displayName: z.string(),
      entryAgent: z.string(),
      etag: z.string(),
      invalid: z.boolean(),
      messages: z.array(z.object({
        chunks: z.unknown(),
        eventTime: z.unknown(),
        role: z.unknown(),
      })),
      name: z.string(),
      updateTime: z.string(),
    })),
    guardrails: z.array(z.object({
      action: z.object({
        generativeAnswer: z.object({
          prompt: z.unknown(),
        }),
        respondImmediately: z.object({
          responses: z.unknown(),
        }),
        transferAgent: z.object({
          agent: z.unknown(),
        }),
      }),
      codeCallback: z.object({
        afterAgentCallback: z.object({
          description: z.unknown(),
          disabled: z.unknown(),
          proactiveExecutionEnabled: z.unknown(),
          pythonCode: z.unknown(),
        }),
        afterModelCallback: z.object({
          description: z.unknown(),
          disabled: z.unknown(),
          proactiveExecutionEnabled: z.unknown(),
          pythonCode: z.unknown(),
        }),
        beforeAgentCallback: z.object({
          description: z.unknown(),
          disabled: z.unknown(),
          proactiveExecutionEnabled: z.unknown(),
          pythonCode: z.unknown(),
        }),
        beforeModelCallback: z.object({
          description: z.unknown(),
          disabled: z.unknown(),
          proactiveExecutionEnabled: z.unknown(),
          pythonCode: z.unknown(),
        }),
      }),
      contentFilter: z.object({
        bannedContents: z.array(z.unknown()),
        bannedContentsInAgentResponse: z.array(z.unknown()),
        bannedContentsInUserInput: z.array(z.unknown()),
        disregardDiacritics: z.boolean(),
        matchType: z.string(),
      }),
      createTime: z.string(),
      description: z.string(),
      displayName: z.string(),
      enabled: z.boolean(),
      etag: z.string(),
      llmPolicy: z.object({
        allowShortUtterance: z.boolean(),
        failOpen: z.boolean(),
        maxConversationMessages: z.number(),
        modelSettings: z.object({
          model: z.unknown(),
          temperature: z.unknown(),
        }),
        policyScope: z.string(),
        prompt: z.string(),
      }),
      llmPromptSecurity: z.object({
        customPolicy: z.object({
          allowShortUtterance: z.unknown(),
          failOpen: z.unknown(),
          maxConversationMessages: z.unknown(),
          modelSettings: z.unknown(),
          policyScope: z.unknown(),
          prompt: z.unknown(),
        }),
        defaultSettings: z.object({
          defaultPromptTemplate: z.unknown(),
        }),
        failOpen: z.boolean(),
      }),
      modelSafety: z.object({
        safetySettings: z.array(z.unknown()),
      }),
      name: z.string(),
      supervisor: z.object({
        detectionMode: z.string(),
        type: z.string(),
      }),
      updateTime: z.string(),
    })),
    tools: z.array(z.object({
      agentTool: z.object({
        agent: z.string(),
        description: z.string(),
        name: z.string(),
      }),
      clientFunction: z.object({
        description: z.string(),
        name: z.string(),
        parameters: z.object({
          additionalProperties: z.unknown(),
          anyOf: z.unknown(),
          default: z.unknown(),
          defs: z.unknown(),
          description: z.unknown(),
          enum: z.unknown(),
          items: z.unknown(),
          maxItems: z.unknown(),
          maximum: z.unknown(),
          minItems: z.unknown(),
          minimum: z.unknown(),
          nullable: z.unknown(),
          prefixItems: z.unknown(),
          properties: z.unknown(),
          ref: z.unknown(),
          required: z.unknown(),
          title: z.unknown(),
          type: z.unknown(),
          uniqueItems: z.unknown(),
        }),
        response: z.object({
          additionalProperties: z.unknown(),
          anyOf: z.unknown(),
          default: z.unknown(),
          defs: z.unknown(),
          description: z.unknown(),
          enum: z.unknown(),
          items: z.unknown(),
          maxItems: z.unknown(),
          maximum: z.unknown(),
          minItems: z.unknown(),
          minimum: z.unknown(),
          nullable: z.unknown(),
          prefixItems: z.unknown(),
          properties: z.unknown(),
          ref: z.unknown(),
          required: z.unknown(),
          title: z.unknown(),
          type: z.unknown(),
          uniqueItems: z.unknown(),
        }),
      }),
      connectorTool: z.object({
        action: z.object({
          connectionActionId: z.unknown(),
          entityOperation: z.unknown(),
          inputFields: z.unknown(),
          outputFields: z.unknown(),
        }),
        authConfig: z.object({
          oauth2AuthCodeConfig: z.unknown(),
          oauth2JwtBearerConfig: z.unknown(),
        }),
        connection: z.string(),
        description: z.string(),
        name: z.string(),
      }),
      createTime: z.string(),
      dataStoreTool: z.object({
        boostSpecs: z.array(z.unknown()),
        dataStoreSource: z.object({
          dataStore: z.unknown(),
          filter: z.unknown(),
        }),
        description: z.string(),
        engineSource: z.object({
          dataStoreSources: z.unknown(),
          engine: z.unknown(),
          filter: z.unknown(),
        }),
        filterParameterBehavior: z.string(),
        modalityConfigs: z.array(z.unknown()),
        name: z.string(),
      }),
      displayName: z.string(),
      etag: z.string(),
      executionType: z.string(),
      fileSearchTool: z.object({
        corpusType: z.string(),
        description: z.string(),
        fileCorpus: z.string(),
        name: z.string(),
      }),
      generatedSummary: z.string(),
      googleSearchTool: z.object({
        contextUrls: z.array(z.unknown()),
        description: z.string(),
        excludeDomains: z.array(z.unknown()),
        name: z.string(),
        preferredDomains: z.array(z.unknown()),
        promptConfig: z.object({
          textPrompt: z.unknown(),
          voicePrompt: z.unknown(),
        }),
      }),
      mcpTool: z.object({
        apiAuthentication: z.object({
          apiKeyConfig: z.unknown(),
          bearerTokenConfig: z.unknown(),
          oauthConfig: z.unknown(),
          serviceAccountAuthConfig: z.unknown(),
          serviceAgentIdTokenAuthConfig: z.unknown(),
        }),
        customHeaders: z.record(z.string(), z.unknown()),
        description: z.string(),
        inputSchema: z.object({
          additionalProperties: z.unknown(),
          anyOf: z.unknown(),
          default: z.unknown(),
          defs: z.unknown(),
          description: z.unknown(),
          enum: z.unknown(),
          items: z.unknown(),
          maxItems: z.unknown(),
          maximum: z.unknown(),
          minItems: z.unknown(),
          minimum: z.unknown(),
          nullable: z.unknown(),
          prefixItems: z.unknown(),
          properties: z.unknown(),
          ref: z.unknown(),
          required: z.unknown(),
          title: z.unknown(),
          type: z.unknown(),
          uniqueItems: z.unknown(),
        }),
        name: z.string(),
        nameOverride: z.string(),
        outputSchema: z.object({
          additionalProperties: z.unknown(),
          anyOf: z.unknown(),
          default: z.unknown(),
          defs: z.unknown(),
          description: z.unknown(),
          enum: z.unknown(),
          items: z.unknown(),
          maxItems: z.unknown(),
          maximum: z.unknown(),
          minItems: z.unknown(),
          minimum: z.unknown(),
          nullable: z.unknown(),
          prefixItems: z.unknown(),
          properties: z.unknown(),
          ref: z.unknown(),
          required: z.unknown(),
          title: z.unknown(),
          type: z.unknown(),
          uniqueItems: z.unknown(),
        }),
        serverAddress: z.string(),
        serviceDirectoryConfig: z.object({
          service: z.unknown(),
        }),
        state: z.string(),
        tlsConfig: z.object({
          caCerts: z.unknown(),
        }),
      }),
      name: z.string(),
      openApiTool: z.object({
        apiAuthentication: z.object({
          apiKeyConfig: z.unknown(),
          bearerTokenConfig: z.unknown(),
          oauthConfig: z.unknown(),
          serviceAccountAuthConfig: z.unknown(),
          serviceAgentIdTokenAuthConfig: z.unknown(),
        }),
        description: z.string(),
        ignoreUnknownFields: z.boolean(),
        name: z.string(),
        openApiSchema: z.string(),
        serviceDirectoryConfig: z.object({
          service: z.unknown(),
        }),
        tlsConfig: z.object({
          caCerts: z.unknown(),
        }),
        url: z.string(),
      }),
      pythonFunction: z.object({
        description: z.string(),
        name: z.string(),
        pythonCode: z.string(),
        serviceDirectoryConfig: z.object({
          service: z.unknown(),
        }),
      }),
      remoteAgentTool: z.object({
        agentCard: z.object({
          description: z.unknown(),
          name: z.unknown(),
          skills: z.unknown(),
          supportedInterfaces: z.unknown(),
          version: z.unknown(),
        }),
        apiAuthentication: z.object({
          apiKeyConfig: z.unknown(),
          bearerTokenConfig: z.unknown(),
          oauthConfig: z.unknown(),
          serviceAccountAuthConfig: z.unknown(),
          serviceAgentIdTokenAuthConfig: z.unknown(),
        }),
        description: z.string(),
        inputVariableMapping: z.record(z.string(), z.unknown()),
        name: z.string(),
        outputVariableMapping: z.record(z.string(), z.unknown()),
        statefulAgent: z.boolean(),
      }),
      systemTool: z.object({
        description: z.string(),
        name: z.string(),
      }),
      timeout: z.string(),
      toolFakeConfig: z.object({
        codeBlock: z.object({
          pythonCode: z.unknown(),
        }),
        enableFakeMode: z.boolean(),
      }),
      updateTime: z.string(),
      widgetTool: z.object({
        dataMapping: z.object({
          fieldMappings: z.unknown(),
          mode: z.unknown(),
          pythonFunction: z.unknown(),
          pythonScript: z.unknown(),
          sourceToolName: z.unknown(),
        }),
        description: z.string(),
        name: z.string(),
        parameters: z.object({
          additionalProperties: z.unknown(),
          anyOf: z.unknown(),
          default: z.unknown(),
          defs: z.unknown(),
          description: z.unknown(),
          enum: z.unknown(),
          items: z.unknown(),
          maxItems: z.unknown(),
          maximum: z.unknown(),
          minItems: z.unknown(),
          minimum: z.unknown(),
          nullable: z.unknown(),
          prefixItems: z.unknown(),
          properties: z.unknown(),
          ref: z.unknown(),
          required: z.unknown(),
          title: z.unknown(),
          type: z.unknown(),
          uniqueItems: z.unknown(),
        }),
        textResponseConfig: z.object({
          staticText: z.unknown(),
          textResponseInstruction: z.unknown(),
          type: z.unknown(),
        }),
        uiConfig: z.record(z.string(), z.unknown()),
        widgetType: z.string(),
      }),
    })),
    toolsets: z.array(z.object({
      connectorToolset: z.object({
        authConfig: z.object({
          oauth2AuthCodeConfig: z.unknown(),
          oauth2JwtBearerConfig: z.unknown(),
        }),
        connection: z.string(),
        connectorActions: z.array(z.unknown()),
      }),
      createTime: z.string(),
      description: z.string(),
      displayName: z.string(),
      etag: z.string(),
      executionType: z.string(),
      mcpToolset: z.object({
        apiAuthentication: z.object({
          apiKeyConfig: z.unknown(),
          bearerTokenConfig: z.unknown(),
          oauthConfig: z.unknown(),
          serviceAccountAuthConfig: z.unknown(),
          serviceAgentIdTokenAuthConfig: z.unknown(),
        }),
        customHeaders: z.record(z.string(), z.unknown()),
        serverAddress: z.string(),
        serviceDirectoryConfig: z.object({
          service: z.unknown(),
        }),
        tlsConfig: z.object({
          caCerts: z.unknown(),
        }),
        toolOverrides: z.array(z.unknown()),
      }),
      name: z.string(),
      openApiToolset: z.object({
        apiAuthentication: z.object({
          apiKeyConfig: z.unknown(),
          bearerTokenConfig: z.unknown(),
          oauthConfig: z.unknown(),
          serviceAccountAuthConfig: z.unknown(),
          serviceAgentIdTokenAuthConfig: z.unknown(),
        }),
        ignoreUnknownFields: z.boolean(),
        openApiSchema: z.string(),
        serviceDirectoryConfig: z.object({
          service: z.unknown(),
        }),
        tlsConfig: z.object({
          caCerts: z.unknown(),
        }),
        url: z.string(),
      }),
      timeout: z.string(),
      toolFakeConfig: z.object({
        codeBlock: z.object({
          pythonCode: z.unknown(),
        }),
        enableFakeMode: z.boolean(),
      }),
      updateTime: z.string(),
    })),
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
  description: z.string().describe(
    "Optional. The description of the app version.",
  ).optional(),
  displayName: z.string().describe(
    "Optional. The display name of the app version.",
  ).optional(),
  name: z.string().describe(
    "Identifier. The unique identifier of the app version. Format: `projects/{project}/locations/{location}/apps/{app}/versions/{version}`",
  ).optional(),
  appVersionId: z.string().describe(
    "Optional. The ID to use for the app version, which will become the final component of the app version's resource name. If not provided, a unique ID will be automatically assigned for the app version.",
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

/** Swamp extension model for Google Cloud Gemini Enterprise for Customer Experience Apps.Versions. Registered at `@swamp/gcp/ces/apps-versions`. */
export const model = {
  type: "@swamp/gcp/ces/apps-versions",
  version: "2026.09.15.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.01.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.02.1",
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
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.18.2",
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
      toVersion: "2026.05.20.1",
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
      toVersion: "2026.05.25.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.26.1",
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
      toVersion: "2026.07.13.1",
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
      toVersion: "2026.07.20.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "Removed: snapshot",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { snapshot: _snapshot, ...rest } = old;
        return rest;
      },
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
      toVersion: "2026.09.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
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
        "In Customer Engagement Suite (CES), an app version is a snapshot of the app a...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a versions",
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
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["appVersionId"] !== undefined) {
          params["appVersionId"] = String(g["appVersionId"]);
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
      description: "Get a versions",
      arguments: z.object({
        identifier: z.string().describe("The name of the versions"),
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
      description: "Update versions attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific versions by name (e.g. one discovered by list)",
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
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["displayName"] !== undefined) {
          body["displayName"] = g["displayName"];
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
      description: "Delete the versions",
      arguments: z.object({
        identifier: z.string().describe("The name of the versions"),
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
      description: "Sync versions state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific versions by name (e.g. one discovered by list)",
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
      description: "List versions resources",
      arguments: z.object({
        filter: z.string().describe(
          "Optional. Filter to be applied when listing the app versions. See https://google.aip.dev/160 for more details.",
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
          "appVersions",
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
    get_extended_agent_card: {
      description: "get extended agent card",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["tenant"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const result = await createResource(
          baseUrl,
          {
            "id": "ces.projects.locations.apps.versions.getExtendedAgentCard",
            "path": "v1/{+tenant}/extendedAgentCard",
            "httpMethod": "GET",
            "parameterOrder": ["tenant"],
            "parameters": {
              "tenant": { "location": "path", "required": true },
            },
          },
          params,
          undefined,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    restore: {
      description: "restore",
      arguments: z.object({}),
      execute: async (_args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined && g["name"] !== undefined) {
          params["name"] = buildResourceName(
            String(g["parent"]),
            String(g["name"]),
          );
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "ces.projects.locations.apps.versions.restore",
            "path": "v1/{+name}:restore",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
          },
          params,
          {},
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
  },
};
