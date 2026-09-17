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

// Auto-generated extension model for @swamp/gcp/securitycenter/sources-findings
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Security Command Center Sources.Findings.
 *
 * GCP securitycenter Sources.Findings resource
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  listResources,
  readViaList,
  request,
  updateResource,
} from "./_lib/gcp.ts";

const BASE_URL = "https://securitycenter.googleapis.com/";

const PATCH_CONFIG = {
  "id": "securitycenter.folders.sources.findings.patch",
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

const LIST_CONFIG = {
  "id": "securitycenter.folders.sources.findings.list",
  "path": "v1/{+parent}/findings",
  "httpMethod": "GET",
  "parameterOrder": [
    "parent",
  ],
  "parameters": {
    "compareDuration": {
      "location": "query",
    },
    "fieldMask": {
      "location": "query",
    },
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
    "readTime": {
      "location": "query",
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
  access: z.object({
    callerIp: z.string().optional(),
    callerIpGeo: z.object({
      regionCode: z.string().optional(),
    }).optional(),
    methodName: z.string().optional(),
    principalEmail: z.string().optional(),
    principalSubject: z.string().optional(),
    serviceAccountDelegationInfo: z.array(z.object({
      principalEmail: z.string().optional(),
      principalSubject: z.string().optional(),
    })).optional(),
    serviceAccountKeyName: z.string().optional(),
    serviceName: z.string().optional(),
    userAgent: z.string().optional(),
    userAgentFamily: z.string().optional(),
    userName: z.string().optional(),
  }).optional(),
  affectedResources: z.object({
    count: z.string().optional(),
  }).optional(),
  agent: z.object({
    displayName: z.string().optional(),
    id: z.string().optional(),
  }).optional(),
  agentAnomaly: z.object({
    confidenceScore: z.number().optional(),
    detectorReferences: z.array(z.object({
      detectorId: z.string().optional(),
      displayName: z.string().optional(),
      explanation: z.string().optional(),
      recommendation: z.string().optional(),
      severity: z.enum([
        "SEVERITY_UNSPECIFIED",
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW",
      ]).optional(),
    })).optional(),
    invocationReferences: z.array(z.object({
      invocationId: z.string().optional(),
    })).optional(),
  }).optional(),
  agentDataAccessEvents: z.array(z.object({
    eventId: z.string().optional(),
    eventTime: z.string().optional(),
    operation: z.enum(["OPERATION_UNSPECIFIED", "READ", "MOVE", "COPY"])
      .optional(),
    principalSubject: z.string().optional(),
  })).optional(),
  agentSessions: z.array(z.object({
    sessionId: z.string().optional(),
  })).optional(),
  aiModel: z.object({
    deploymentPlatform: z.enum([
      "DEPLOYMENT_PLATFORM_UNSPECIFIED",
      "VERTEX_AI",
      "GKE",
      "GCE",
      "FINE_TUNED_MODEL",
    ]).optional(),
    displayName: z.string().optional(),
    domain: z.string().optional(),
    library: z.string().optional(),
    location: z.string().optional(),
    name: z.string().optional(),
    publisher: z.string().optional(),
    usageCategory: z.string().optional(),
  }).optional(),
  application: z.object({
    baseUri: z.string().optional(),
    fullUri: z.string().optional(),
  }).optional(),
  artifactGuardPolicies: z.object({
    failingPolicies: z.array(z.object({
      failureReason: z.string().optional(),
      policyId: z.string().optional(),
      type: z.enum(["ARTIFACT_GUARD_POLICY_TYPE_UNSPECIFIED", "VULNERABILITY"])
        .optional(),
    })).optional(),
    resourceId: z.string().optional(),
  }).optional(),
  attackExposure: z.object({
    attackExposureResult: z.string().optional(),
    exposedHighValueResourcesCount: z.number().int().optional(),
    exposedLowValueResourcesCount: z.number().int().optional(),
    exposedMediumValueResourcesCount: z.number().int().optional(),
    latestCalculationTime: z.string().optional(),
    score: z.number().optional(),
    state: z.enum(["STATE_UNSPECIFIED", "CALCULATED", "NOT_CALCULATED"])
      .optional(),
  }).optional(),
  backupDisasterRecovery: z.object({
    appliance: z.string().optional(),
    applications: z.array(z.string()).optional(),
    backupCreateTime: z.string().optional(),
    backupTemplate: z.string().optional(),
    backupType: z.string().optional(),
    host: z.string().optional(),
    policies: z.array(z.string()).optional(),
    policyOptions: z.array(z.string()).optional(),
    profile: z.string().optional(),
    storagePool: z.string().optional(),
  }).optional(),
  canonicalName: z.string().optional(),
  category: z.string().optional(),
  chokepoint: z.object({
    relatedFindings: z.array(z.string()).optional(),
  }).optional(),
  cloudArmor: z.object({
    adaptiveProtection: z.object({
      confidence: z.number().optional(),
    }).optional(),
    attack: z.object({
      classification: z.string().optional(),
      volumeBps: z.number().int().optional(),
      volumeBpsLong: z.string().optional(),
      volumePps: z.number().int().optional(),
      volumePpsLong: z.string().optional(),
    }).optional(),
    duration: z.string().optional(),
    requests: z.object({
      longTermAllowed: z.number().int().optional(),
      longTermDenied: z.number().int().optional(),
      ratio: z.number().optional(),
      shortTermAllowed: z.number().int().optional(),
    }).optional(),
    securityPolicy: z.object({
      name: z.string().optional(),
      preview: z.boolean().optional(),
      type: z.string().optional(),
    }).optional(),
    threatVector: z.string().optional(),
  }).optional(),
  cloudDlpDataProfile: z.object({
    dataProfile: z.string().optional(),
    infoTypes: z.array(z.object({
      name: z.string().optional(),
      sensitivityScore: z.object({
        score: z.enum([
          "SENSITIVITY_SCORE_LEVEL_UNSPECIFIED",
          "SENSITIVITY_LOW",
          "SENSITIVITY_UNKNOWN",
          "SENSITIVITY_MODERATE",
          "SENSITIVITY_HIGH",
        ]).optional(),
      }).optional(),
      version: z.string().optional(),
    })).optional(),
    parentType: z.enum(["PARENT_TYPE_UNSPECIFIED", "ORGANIZATION", "PROJECT"])
      .optional(),
  }).optional(),
  cloudDlpInspection: z.object({
    fullScan: z.boolean().optional(),
    infoType: z.string().optional(),
    infoTypeCount: z.string().optional(),
    inspectJob: z.string().optional(),
  }).optional(),
  complianceDetails: z.object({
    cloudControl: z.object({
      cloudControlName: z.string().optional(),
      policyType: z.string().optional(),
      type: z.enum(["CLOUD_CONTROL_TYPE_UNSPECIFIED", "BUILT_IN", "CUSTOM"])
        .optional(),
      version: z.number().int().optional(),
    }).optional(),
    cloudControlDeploymentNames: z.array(z.string()).optional(),
    frameworks: z.array(z.object({
      category: z.array(
        z.enum([
          "FRAMEWORK_CATEGORY_UNSPECIFIED",
          "SECURITY_BENCHMARKS",
          "ASSURED_WORKLOADS",
          "DATA_SECURITY",
          "GOOGLE_BEST_PRACTICES",
          "CUSTOM_FRAMEWORK",
        ]),
      ).optional(),
      controls: z.array(z.object({
        controlName: z.unknown().optional(),
        displayName: z.unknown().optional(),
      })).optional(),
      displayName: z.string().optional(),
      name: z.string().optional(),
      type: z.enum([
        "FRAMEWORK_TYPE_UNSPECIFIED",
        "FRAMEWORK_TYPE_BUILT_IN",
        "FRAMEWORK_TYPE_CUSTOM",
      ]).optional(),
    })).optional(),
  }).optional(),
  compliances: z.array(z.object({
    ids: z.array(z.string()).optional(),
    standard: z.string().optional(),
    version: z.string().optional(),
  })).optional(),
  connections: z.array(z.object({
    destinationIp: z.string().optional(),
    destinationPort: z.number().int().optional(),
    protocol: z.enum([
      "PROTOCOL_UNSPECIFIED",
      "ICMP",
      "TCP",
      "UDP",
      "GRE",
      "ESP",
    ]).optional(),
    sourceIp: z.string().optional(),
    sourcePort: z.number().int().optional(),
  })).optional(),
  contacts: z.record(
    z.string(),
    z.object({
      contacts: z.array(z.object({
        email: z.string().optional(),
      })).optional(),
    }),
  ).optional(),
  containers: z.array(z.object({
    createTime: z.string().optional(),
    imageId: z.string().optional(),
    labels: z.array(z.object({
      name: z.string().optional(),
      value: z.string().optional(),
    })).optional(),
    name: z.string().optional(),
    uri: z.string().optional(),
  })).optional(),
  createTime: z.string().optional(),
  dataAccessEvents: z.array(z.object({
    eventId: z.string().optional(),
    eventTime: z.string().optional(),
    operation: z.enum(["OPERATION_UNSPECIFIED", "READ", "MOVE", "COPY"])
      .optional(),
    principalEmail: z.string().optional(),
  })).optional(),
  dataFlowEvents: z.array(z.object({
    eventId: z.string().optional(),
    eventTime: z.string().optional(),
    operation: z.enum(["OPERATION_UNSPECIFIED", "READ", "MOVE", "COPY"])
      .optional(),
    principalEmail: z.string().optional(),
    violatedLocation: z.string().optional(),
  })).optional(),
  dataRetentionDeletionEvents: z.array(z.object({
    dataObjectCount: z.string().optional(),
    eventDetectionTime: z.string().optional(),
    eventType: z.enum([
      "EVENT_TYPE_UNSPECIFIED",
      "EVENT_TYPE_MAX_TTL_EXCEEDED",
      "EVENT_TYPE_MAX_TTL_FROM_CREATION",
      "EVENT_TYPE_MAX_TTL_FROM_LAST_MODIFICATION",
      "EVENT_TYPE_MIN_TTL_FROM_CREATION",
    ]).optional(),
    maxRetentionAllowed: z.string().optional(),
    minRetentionAllowed: z.string().optional(),
  })).optional(),
  database: z.object({
    displayName: z.string().optional(),
    grantees: z.array(z.string()).optional(),
    name: z.string().optional(),
    query: z.string().optional(),
    userName: z.string().optional(),
    version: z.string().optional(),
  }).optional(),
  description: z.string().optional(),
  discoveredWorkload: z.object({
    confidence: z.enum(["CONFIDENCE_UNSPECIFIED", "CONFIDENCE_HIGH"])
      .optional(),
    detectedRelevantHardware: z.boolean().optional(),
    detectedRelevantKeywords: z.boolean().optional(),
    detectedRelevantPackages: z.boolean().optional(),
    workloadType: z.enum([
      "WORKLOAD_TYPE_UNSPECIFIED",
      "MCP_SERVER",
      "AI_INFERENCE",
      "AGENT",
    ]).optional(),
  }).optional(),
  disk: z.object({
    name: z.string().optional(),
  }).optional(),
  eventTime: z.string().optional(),
  exfiltration: z.object({
    sources: z.array(z.object({
      components: z.array(z.string()).optional(),
      name: z.string().optional(),
    })).optional(),
    targets: z.array(z.object({
      components: z.array(z.string()).optional(),
      name: z.string().optional(),
    })).optional(),
    totalExfiltratedBytes: z.string().optional(),
  }).optional(),
  externalExposure: z.object({
    backendBucket: z.string().optional(),
    backendService: z.string().optional(),
    exposedApplication: z.string().optional(),
    exposedEndpoint: z.string().optional(),
    exposedService: z.string().optional(),
    forwardingRule: z.string().optional(),
    hostnameUri: z.string().optional(),
    httpResponse: z.array(z.object({
      path: z.string().optional(),
      statusCode: z.string().optional(),
    })).optional(),
    instanceGroup: z.string().optional(),
    internalBackendService: z.string().optional(),
    loadBalancerFirewallPolicy: z.string().optional(),
    networkEndpointGroup: z.string().optional(),
    networkIngressFirewallPolicy: z.string().optional(),
    networkPathInsightsGenerationTime: z.string().optional(),
    privateIpAddress: z.string().optional(),
    privatePort: z.string().optional(),
    pscNetworkAttachment: z.string().optional(),
    pscServiceAttachment: z.string().optional(),
    publicIpAddress: z.string().optional(),
    publicPort: z.string().optional(),
    serviceFirewallPolicy: z.string().optional(),
  }).optional(),
  externalSystems: z.record(
    z.string(),
    z.object({
      assignees: z.array(z.string()).optional(),
      caseCloseTime: z.string().optional(),
      caseCreateTime: z.string().optional(),
      casePriority: z.string().optional(),
      caseSla: z.string().optional(),
      caseUri: z.string().optional(),
      externalSystemUpdateTime: z.string().optional(),
      externalUid: z.string().optional(),
      name: z.string().optional(),
      status: z.string().optional(),
      ticketInfo: z.object({
        assignee: z.string().optional(),
        description: z.string().optional(),
        id: z.string().optional(),
        status: z.string().optional(),
        updateTime: z.string().optional(),
        uri: z.string().optional(),
      }).optional(),
    }),
  ).optional(),
  externalUri: z.string().optional(),
  files: z.array(z.object({
    contents: z.string().optional(),
    diskPath: z.object({
      partitionUuid: z.string().optional(),
      relativePath: z.string().optional(),
    }).optional(),
    fileLoadState: z.enum([
      "FILE_LOAD_STATE_UNSPECIFIED",
      "LOADED_BY_PROCESS",
      "NOT_LOADED_BY_PROCESS",
    ]).optional(),
    hashedSize: z.string().optional(),
    operations: z.array(z.object({
      type: z.enum([
        "OPERATION_TYPE_UNSPECIFIED",
        "OPEN",
        "READ",
        "RENAME",
        "WRITE",
        "EXECUTE",
      ]).optional(),
    })).optional(),
    partiallyHashed: z.boolean().optional(),
    path: z.string().optional(),
    sha256: z.string().optional(),
    size: z.string().optional(),
  })).optional(),
  findingClass: z.enum([
    "FINDING_CLASS_UNSPECIFIED",
    "THREAT",
    "VULNERABILITY",
    "MISCONFIGURATION",
    "OBSERVATION",
    "SCC_ERROR",
    "POSTURE_VIOLATION",
    "TOXIC_COMBINATION",
    "SENSITIVE_DATA_RISK",
    "CHOKEPOINT",
    "EXTERNAL_EXPOSURE",
    "SECRET",
  ]).optional(),
  groupMemberships: z.array(z.object({
    groupId: z.string().optional(),
    groupType: z.enum([
      "GROUP_TYPE_UNSPECIFIED",
      "GROUP_TYPE_TOXIC_COMBINATION",
      "GROUP_TYPE_CHOKEPOINT",
    ]).optional(),
  })).optional(),
  iamBindings: z.array(z.object({
    action: z.enum(["ACTION_UNSPECIFIED", "ADD", "REMOVE"]).optional(),
    member: z.string().optional(),
    role: z.string().optional(),
  })).optional(),
  iamDetails: z.object({
    iamRolePermissions: z.array(z.object({
      name: z.string().optional(),
      role: z.string().optional(),
    })).optional(),
  }).optional(),
  indicator: z.object({
    domains: z.array(z.string()).optional(),
    ipAddresses: z.array(z.string()).optional(),
    signatures: z.array(z.object({
      memoryHashSignature: z.object({
        binaryFamily: z.string().optional(),
        detections: z.array(z.unknown()).optional(),
      }).optional(),
      signatureType: z.enum([
        "SIGNATURE_TYPE_UNSPECIFIED",
        "SIGNATURE_TYPE_PROCESS",
        "SIGNATURE_TYPE_FILE",
      ]).optional(),
      yaraRuleSignature: z.object({
        yaraRule: z.string().optional(),
      }).optional(),
    })).optional(),
    uris: z.array(z.string()).optional(),
  }).optional(),
  ipRules: z.object({
    allowed: z.object({
      ipRules: z.array(z.object({
        portRanges: z.array(z.unknown()).optional(),
        protocol: z.string().optional(),
      })).optional(),
    }).optional(),
    denied: z.object({
      ipRules: z.array(z.object({
        portRanges: z.array(z.unknown()).optional(),
        protocol: z.string().optional(),
      })).optional(),
    }).optional(),
    destinationIpRanges: z.array(z.string()).optional(),
    direction: z.enum(["DIRECTION_UNSPECIFIED", "INGRESS", "EGRESS"])
      .optional(),
    exposedServices: z.array(z.string()).optional(),
    sourceIpRanges: z.array(z.string()).optional(),
  }).optional(),
  job: z.object({
    errorCode: z.number().int().optional(),
    location: z.string().optional(),
    name: z.string().optional(),
    state: z.enum([
      "JOB_STATE_UNSPECIFIED",
      "PENDING",
      "RUNNING",
      "SUCCEEDED",
      "FAILED",
    ]).optional(),
  }).optional(),
  kernelRootkit: z.object({
    name: z.string().optional(),
    unexpectedCodeModification: z.boolean().optional(),
    unexpectedFtraceHandler: z.boolean().optional(),
    unexpectedInterruptHandler: z.boolean().optional(),
    unexpectedKernelCodePages: z.boolean().optional(),
    unexpectedKprobeHandler: z.boolean().optional(),
    unexpectedProcessesInRunqueue: z.boolean().optional(),
    unexpectedReadOnlyDataModification: z.boolean().optional(),
    unexpectedSystemCallHandler: z.boolean().optional(),
  }).optional(),
  kubernetes: z.object({
    accessReviews: z.array(z.object({
      group: z.string().optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
      resource: z.string().optional(),
      subresource: z.string().optional(),
      verb: z.string().optional(),
      version: z.string().optional(),
    })).optional(),
    bindings: z.array(z.object({
      name: z.string().optional(),
      ns: z.string().optional(),
      role: z.object({
        kind: z.enum(["KIND_UNSPECIFIED", "ROLE", "CLUSTER_ROLE"]).optional(),
        name: z.string().optional(),
        ns: z.string().optional(),
      }).optional(),
      subjects: z.array(z.object({
        kind: z.unknown().optional(),
        name: z.unknown().optional(),
        ns: z.unknown().optional(),
      })).optional(),
    })).optional(),
    nodePools: z.array(z.object({
      name: z.string().optional(),
      nodes: z.array(z.object({
        name: z.unknown().optional(),
      })).optional(),
    })).optional(),
    nodes: z.array(z.object({
      name: z.string().optional(),
    })).optional(),
    objects: z.array(z.object({
      containers: z.array(z.object({
        createTime: z.unknown().optional(),
        imageId: z.unknown().optional(),
        labels: z.unknown().optional(),
        name: z.unknown().optional(),
        uri: z.unknown().optional(),
      })).optional(),
      group: z.string().optional(),
      kind: z.string().optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
    })).optional(),
    pods: z.array(z.object({
      containers: z.array(z.object({
        createTime: z.unknown().optional(),
        imageId: z.unknown().optional(),
        labels: z.unknown().optional(),
        name: z.unknown().optional(),
        uri: z.unknown().optional(),
      })).optional(),
      labels: z.array(z.object({
        name: z.unknown().optional(),
        value: z.unknown().optional(),
      })).optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
    })).optional(),
    roles: z.array(z.object({
      kind: z.enum(["KIND_UNSPECIFIED", "ROLE", "CLUSTER_ROLE"]).optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
    })).optional(),
  }).optional(),
  loadBalancers: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  logEntries: z.array(z.object({
    cloudLoggingEntry: z.object({
      insertId: z.string().optional(),
      logId: z.string().optional(),
      resourceContainer: z.string().optional(),
      timestamp: z.string().optional(),
    }).optional(),
  })).optional(),
  mitreAttack: z.object({
    additionalTactics: z.array(
      z.enum([
        "TACTIC_UNSPECIFIED",
        "RECONNAISSANCE",
        "RESOURCE_DEVELOPMENT",
        "INITIAL_ACCESS",
        "EXECUTION",
        "PERSISTENCE",
        "PRIVILEGE_ESCALATION",
        "DEFENSE_EVASION",
        "CREDENTIAL_ACCESS",
        "DISCOVERY",
        "LATERAL_MOVEMENT",
        "COLLECTION",
        "COMMAND_AND_CONTROL",
        "EXFILTRATION",
        "IMPACT",
      ]),
    ).optional(),
    additionalTechniques: z.array(
      z.enum([
        "TECHNIQUE_UNSPECIFIED",
        "DATA_OBFUSCATION",
        "DATA_OBFUSCATION_STEGANOGRAPHY",
        "OS_CREDENTIAL_DUMPING",
        "OS_CREDENTIAL_DUMPING_PROC_FILESYSTEM",
        "OS_CREDENTIAL_DUMPING_ETC_PASSWORD_AND_ETC_SHADOW",
        "DATA_FROM_LOCAL_SYSTEM",
        "AUTOMATED_EXFILTRATION",
        "OBFUSCATED_FILES_OR_INFO",
        "STEGANOGRAPHY",
        "COMPILE_AFTER_DELIVERY",
        "COMMAND_OBFUSCATION",
        "SCHEDULED_TRANSFER",
        "SYSTEM_OWNER_USER_DISCOVERY",
        "MASQUERADING",
        "MATCH_LEGITIMATE_NAME_OR_LOCATION",
        "BOOT_OR_LOGON_INITIALIZATION_SCRIPTS",
        "STARTUP_ITEMS",
        "NETWORK_SERVICE_DISCOVERY",
        "SCHEDULED_TASK_JOB",
        "SCHEDULED_TASK_JOB_CRON",
        "CONTAINER_ORCHESTRATION_JOB",
        "PROCESS_INJECTION",
        "INPUT_CAPTURE",
        "INPUT_CAPTURE_KEYLOGGING",
        "PROCESS_DISCOVERY",
        "COMMAND_AND_SCRIPTING_INTERPRETER",
        "UNIX_SHELL",
        "PYTHON",
        "EXPLOITATION_FOR_PRIVILEGE_ESCALATION",
        "PERMISSION_GROUPS_DISCOVERY",
        "CLOUD_GROUPS",
        "INDICATOR_REMOVAL",
        "INDICATOR_REMOVAL_CLEAR_LINUX_OR_MAC_SYSTEM_LOGS",
        "INDICATOR_REMOVAL_CLEAR_COMMAND_HISTORY",
        "INDICATOR_REMOVAL_FILE_DELETION",
        "INDICATOR_REMOVAL_TIMESTOMP",
        "INDICATOR_REMOVAL_CLEAR_MAILBOX_DATA",
        "APPLICATION_LAYER_PROTOCOL",
        "DNS",
        "SOFTWARE_DEPLOYMENT_TOOLS",
        "VALID_ACCOUNTS",
        "DEFAULT_ACCOUNTS",
        "LOCAL_ACCOUNTS",
        "CLOUD_ACCOUNTS",
        "FILE_AND_DIRECTORY_DISCOVERY",
        "ACCOUNT_DISCOVERY_LOCAL_ACCOUNT",
        "PROXY",
        "EXTERNAL_PROXY",
        "MULTI_HOP_PROXY",
        "ACCOUNT_MANIPULATION",
        "ADDITIONAL_CLOUD_CREDENTIALS",
        "ADDITIONAL_CLOUD_ROLES",
        "SSH_AUTHORIZED_KEYS",
        "ADDITIONAL_CONTAINER_CLUSTER_ROLES",
        "MULTI_STAGE_CHANNELS",
        "INGRESS_TOOL_TRANSFER",
        "NATIVE_API",
        "BRUTE_FORCE",
        "AUTOMATED_COLLECTION",
        "SHARED_MODULES",
        "DATA_ENCODING",
        "STANDARD_ENCODING",
        "ACCESS_TOKEN_MANIPULATION",
        "TOKEN_IMPERSONATION_OR_THEFT",
        "CREATE_ACCOUNT",
        "LOCAL_ACCOUNT",
        "DEOBFUSCATE_DECODE_FILES_OR_INFO",
        "EXPLOIT_PUBLIC_FACING_APPLICATION",
        "SUPPLY_CHAIN_COMPROMISE",
        "COMPROMISE_SOFTWARE_DEPENDENCIES_AND_DEVELOPMENT_TOOLS",
        "EXPLOITATION_FOR_CLIENT_EXECUTION",
        "USER_EXECUTION",
        "EXPLOITATION_FOR_CREDENTIAL_ACCESS",
        "LINUX_AND_MAC_FILE_AND_DIRECTORY_PERMISSIONS_MODIFICATION",
        "DOMAIN_POLICY_MODIFICATION",
        "DATA_DESTRUCTION",
        "DATA_ENCRYPTED_FOR_IMPACT",
        "SERVICE_STOP",
        "INHIBIT_SYSTEM_RECOVERY",
        "FIRMWARE_CORRUPTION",
        "RESOURCE_HIJACKING",
        "NETWORK_DENIAL_OF_SERVICE",
        "CLOUD_SERVICE_DISCOVERY",
        "STEAL_APPLICATION_ACCESS_TOKEN",
        "ACCOUNT_ACCESS_REMOVAL",
        "TRANSFER_DATA_TO_CLOUD_ACCOUNT",
        "STEAL_WEB_SESSION_COOKIE",
        "CREATE_OR_MODIFY_SYSTEM_PROCESS",
        "EVENT_TRIGGERED_EXECUTION",
        "BOOT_OR_LOGON_AUTOSTART_EXECUTION",
        "KERNEL_MODULES_AND_EXTENSIONS",
        "SHORTCUT_MODIFICATION",
        "ABUSE_ELEVATION_CONTROL_MECHANISM",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SETUID_AND_SETGID",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SUDO_AND_SUDO_CACHING",
        "UNSECURED_CREDENTIALS",
        "CREDENTIALS_IN_FILES",
        "BASH_HISTORY",
        "PRIVATE_KEYS",
        "SUBVERT_TRUST_CONTROL",
        "INSTALL_ROOT_CERTIFICATE",
        "COMPROMISE_HOST_SOFTWARE_BINARY",
        "CREDENTIALS_FROM_PASSWORD_STORES",
        "MODIFY_AUTHENTICATION_PROCESS",
        "PLUGGABLE_AUTHENTICATION_MODULES",
        "MULTI_FACTOR_AUTHENTICATION",
        "IMPAIR_DEFENSES",
        "DISABLE_OR_MODIFY_TOOLS",
        "INDICATOR_BLOCKING",
        "DISABLE_OR_MODIFY_LINUX_AUDIT_SYSTEM",
        "HIDE_ARTIFACTS",
        "HIDDEN_FILES_AND_DIRECTORIES",
        "HIDDEN_USERS",
        "EXFILTRATION_OVER_WEB_SERVICE",
        "EXFILTRATION_TO_CLOUD_STORAGE",
        "DYNAMIC_RESOLUTION",
        "LATERAL_TOOL_TRANSFER",
        "HIJACK_EXECUTION_FLOW",
        "HIJACK_EXECUTION_FLOW_DYNAMIC_LINKER_HIJACKING",
        "MODIFY_CLOUD_COMPUTE_INFRASTRUCTURE",
        "CREATE_SNAPSHOT",
        "CLOUD_INFRASTRUCTURE_DISCOVERY",
        "DEVELOP_CAPABILITIES",
        "DEVELOP_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES",
        "OBTAIN_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES_VULNERABILITIES",
        "ACTIVE_SCANNING",
        "SCANNING_IP_BLOCKS",
        "STAGE_CAPABILITIES",
        "UPLOAD_MALWARE",
        "CONTAINER_ADMINISTRATION_COMMAND",
        "DEPLOY_CONTAINER",
        "ESCAPE_TO_HOST",
        "CONTAINER_AND_RESOURCE_DISCOVERY",
        "REFLECTIVE_CODE_LOADING",
        "STEAL_OR_FORGE_AUTHENTICATION_CERTIFICATES",
        "FINANCIAL_THEFT",
      ]),
    ).optional(),
    primaryTactic: z.enum([
      "TACTIC_UNSPECIFIED",
      "RECONNAISSANCE",
      "RESOURCE_DEVELOPMENT",
      "INITIAL_ACCESS",
      "EXECUTION",
      "PERSISTENCE",
      "PRIVILEGE_ESCALATION",
      "DEFENSE_EVASION",
      "CREDENTIAL_ACCESS",
      "DISCOVERY",
      "LATERAL_MOVEMENT",
      "COLLECTION",
      "COMMAND_AND_CONTROL",
      "EXFILTRATION",
      "IMPACT",
    ]).optional(),
    primaryTechniques: z.array(
      z.enum([
        "TECHNIQUE_UNSPECIFIED",
        "DATA_OBFUSCATION",
        "DATA_OBFUSCATION_STEGANOGRAPHY",
        "OS_CREDENTIAL_DUMPING",
        "OS_CREDENTIAL_DUMPING_PROC_FILESYSTEM",
        "OS_CREDENTIAL_DUMPING_ETC_PASSWORD_AND_ETC_SHADOW",
        "DATA_FROM_LOCAL_SYSTEM",
        "AUTOMATED_EXFILTRATION",
        "OBFUSCATED_FILES_OR_INFO",
        "STEGANOGRAPHY",
        "COMPILE_AFTER_DELIVERY",
        "COMMAND_OBFUSCATION",
        "SCHEDULED_TRANSFER",
        "SYSTEM_OWNER_USER_DISCOVERY",
        "MASQUERADING",
        "MATCH_LEGITIMATE_NAME_OR_LOCATION",
        "BOOT_OR_LOGON_INITIALIZATION_SCRIPTS",
        "STARTUP_ITEMS",
        "NETWORK_SERVICE_DISCOVERY",
        "SCHEDULED_TASK_JOB",
        "SCHEDULED_TASK_JOB_CRON",
        "CONTAINER_ORCHESTRATION_JOB",
        "PROCESS_INJECTION",
        "INPUT_CAPTURE",
        "INPUT_CAPTURE_KEYLOGGING",
        "PROCESS_DISCOVERY",
        "COMMAND_AND_SCRIPTING_INTERPRETER",
        "UNIX_SHELL",
        "PYTHON",
        "EXPLOITATION_FOR_PRIVILEGE_ESCALATION",
        "PERMISSION_GROUPS_DISCOVERY",
        "CLOUD_GROUPS",
        "INDICATOR_REMOVAL",
        "INDICATOR_REMOVAL_CLEAR_LINUX_OR_MAC_SYSTEM_LOGS",
        "INDICATOR_REMOVAL_CLEAR_COMMAND_HISTORY",
        "INDICATOR_REMOVAL_FILE_DELETION",
        "INDICATOR_REMOVAL_TIMESTOMP",
        "INDICATOR_REMOVAL_CLEAR_MAILBOX_DATA",
        "APPLICATION_LAYER_PROTOCOL",
        "DNS",
        "SOFTWARE_DEPLOYMENT_TOOLS",
        "VALID_ACCOUNTS",
        "DEFAULT_ACCOUNTS",
        "LOCAL_ACCOUNTS",
        "CLOUD_ACCOUNTS",
        "FILE_AND_DIRECTORY_DISCOVERY",
        "ACCOUNT_DISCOVERY_LOCAL_ACCOUNT",
        "PROXY",
        "EXTERNAL_PROXY",
        "MULTI_HOP_PROXY",
        "ACCOUNT_MANIPULATION",
        "ADDITIONAL_CLOUD_CREDENTIALS",
        "ADDITIONAL_CLOUD_ROLES",
        "SSH_AUTHORIZED_KEYS",
        "ADDITIONAL_CONTAINER_CLUSTER_ROLES",
        "MULTI_STAGE_CHANNELS",
        "INGRESS_TOOL_TRANSFER",
        "NATIVE_API",
        "BRUTE_FORCE",
        "AUTOMATED_COLLECTION",
        "SHARED_MODULES",
        "DATA_ENCODING",
        "STANDARD_ENCODING",
        "ACCESS_TOKEN_MANIPULATION",
        "TOKEN_IMPERSONATION_OR_THEFT",
        "CREATE_ACCOUNT",
        "LOCAL_ACCOUNT",
        "DEOBFUSCATE_DECODE_FILES_OR_INFO",
        "EXPLOIT_PUBLIC_FACING_APPLICATION",
        "SUPPLY_CHAIN_COMPROMISE",
        "COMPROMISE_SOFTWARE_DEPENDENCIES_AND_DEVELOPMENT_TOOLS",
        "EXPLOITATION_FOR_CLIENT_EXECUTION",
        "USER_EXECUTION",
        "EXPLOITATION_FOR_CREDENTIAL_ACCESS",
        "LINUX_AND_MAC_FILE_AND_DIRECTORY_PERMISSIONS_MODIFICATION",
        "DOMAIN_POLICY_MODIFICATION",
        "DATA_DESTRUCTION",
        "DATA_ENCRYPTED_FOR_IMPACT",
        "SERVICE_STOP",
        "INHIBIT_SYSTEM_RECOVERY",
        "FIRMWARE_CORRUPTION",
        "RESOURCE_HIJACKING",
        "NETWORK_DENIAL_OF_SERVICE",
        "CLOUD_SERVICE_DISCOVERY",
        "STEAL_APPLICATION_ACCESS_TOKEN",
        "ACCOUNT_ACCESS_REMOVAL",
        "TRANSFER_DATA_TO_CLOUD_ACCOUNT",
        "STEAL_WEB_SESSION_COOKIE",
        "CREATE_OR_MODIFY_SYSTEM_PROCESS",
        "EVENT_TRIGGERED_EXECUTION",
        "BOOT_OR_LOGON_AUTOSTART_EXECUTION",
        "KERNEL_MODULES_AND_EXTENSIONS",
        "SHORTCUT_MODIFICATION",
        "ABUSE_ELEVATION_CONTROL_MECHANISM",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SETUID_AND_SETGID",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SUDO_AND_SUDO_CACHING",
        "UNSECURED_CREDENTIALS",
        "CREDENTIALS_IN_FILES",
        "BASH_HISTORY",
        "PRIVATE_KEYS",
        "SUBVERT_TRUST_CONTROL",
        "INSTALL_ROOT_CERTIFICATE",
        "COMPROMISE_HOST_SOFTWARE_BINARY",
        "CREDENTIALS_FROM_PASSWORD_STORES",
        "MODIFY_AUTHENTICATION_PROCESS",
        "PLUGGABLE_AUTHENTICATION_MODULES",
        "MULTI_FACTOR_AUTHENTICATION",
        "IMPAIR_DEFENSES",
        "DISABLE_OR_MODIFY_TOOLS",
        "INDICATOR_BLOCKING",
        "DISABLE_OR_MODIFY_LINUX_AUDIT_SYSTEM",
        "HIDE_ARTIFACTS",
        "HIDDEN_FILES_AND_DIRECTORIES",
        "HIDDEN_USERS",
        "EXFILTRATION_OVER_WEB_SERVICE",
        "EXFILTRATION_TO_CLOUD_STORAGE",
        "DYNAMIC_RESOLUTION",
        "LATERAL_TOOL_TRANSFER",
        "HIJACK_EXECUTION_FLOW",
        "HIJACK_EXECUTION_FLOW_DYNAMIC_LINKER_HIJACKING",
        "MODIFY_CLOUD_COMPUTE_INFRASTRUCTURE",
        "CREATE_SNAPSHOT",
        "CLOUD_INFRASTRUCTURE_DISCOVERY",
        "DEVELOP_CAPABILITIES",
        "DEVELOP_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES",
        "OBTAIN_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES_VULNERABILITIES",
        "ACTIVE_SCANNING",
        "SCANNING_IP_BLOCKS",
        "STAGE_CAPABILITIES",
        "UPLOAD_MALWARE",
        "CONTAINER_ADMINISTRATION_COMMAND",
        "DEPLOY_CONTAINER",
        "ESCAPE_TO_HOST",
        "CONTAINER_AND_RESOURCE_DISCOVERY",
        "REFLECTIVE_CODE_LOADING",
        "STEAL_OR_FORGE_AUTHENTICATION_CERTIFICATES",
        "FINANCIAL_THEFT",
      ]),
    ).optional(),
    version: z.string().optional(),
  }).optional(),
  moduleName: z.string().optional(),
  mute: z.enum(["MUTE_UNSPECIFIED", "MUTED", "UNMUTED", "UNDEFINED"])
    .optional(),
  muteInfo: z.object({
    dynamicMuteRecords: z.array(z.object({
      matchTime: z.string().optional(),
      muteConfig: z.string().optional(),
    })).optional(),
    staticMute: z.object({
      applyTime: z.string().optional(),
      state: z.enum(["MUTE_UNSPECIFIED", "MUTED", "UNMUTED", "UNDEFINED"])
        .optional(),
    }).optional(),
  }).optional(),
  muteInitiator: z.string().optional(),
  muteUpdateTime: z.string().optional(),
  name: z.string().optional(),
  networks: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  nextSteps: z.string().optional(),
  notebook: z.object({
    lastAuthor: z.string().optional(),
    name: z.string().optional(),
    notebookUpdateTime: z.string().optional(),
    service: z.string().optional(),
  }).optional(),
  orgPolicies: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  parent: z.string().optional(),
  parentDisplayName: z.string().optional(),
  policyViolationSummary: z.object({
    conformantResourcesCount: z.string().optional(),
    evaluationErrorsCount: z.string().optional(),
    outOfScopeResourcesCount: z.string().optional(),
    policyViolationsCount: z.string().optional(),
  }).optional(),
  processes: z.array(z.object({
    args: z.array(z.string()).optional(),
    argumentsTruncated: z.boolean().optional(),
    binary: z.object({
      contents: z.string().optional(),
      diskPath: z.object({
        partitionUuid: z.string().optional(),
        relativePath: z.string().optional(),
      }).optional(),
      fileLoadState: z.enum([
        "FILE_LOAD_STATE_UNSPECIFIED",
        "LOADED_BY_PROCESS",
        "NOT_LOADED_BY_PROCESS",
      ]).optional(),
      hashedSize: z.string().optional(),
      operations: z.array(z.object({
        type: z.unknown().optional(),
      })).optional(),
      partiallyHashed: z.boolean().optional(),
      path: z.string().optional(),
      sha256: z.string().optional(),
      size: z.string().optional(),
    }).optional(),
    envVariables: z.array(z.object({
      name: z.string().optional(),
      val: z.string().optional(),
    })).optional(),
    envVariablesTruncated: z.boolean().optional(),
    libraries: z.array(z.object({
      contents: z.string().optional(),
      diskPath: z.object({
        partitionUuid: z.unknown().optional(),
        relativePath: z.unknown().optional(),
      }).optional(),
      fileLoadState: z.enum([
        "FILE_LOAD_STATE_UNSPECIFIED",
        "LOADED_BY_PROCESS",
        "NOT_LOADED_BY_PROCESS",
      ]).optional(),
      hashedSize: z.string().optional(),
      operations: z.array(z.unknown()).optional(),
      partiallyHashed: z.boolean().optional(),
      path: z.string().optional(),
      sha256: z.string().optional(),
      size: z.string().optional(),
    })).optional(),
    name: z.string().optional(),
    parentPid: z.string().optional(),
    pid: z.string().optional(),
    script: z.object({
      contents: z.string().optional(),
      diskPath: z.object({
        partitionUuid: z.string().optional(),
        relativePath: z.string().optional(),
      }).optional(),
      fileLoadState: z.enum([
        "FILE_LOAD_STATE_UNSPECIFIED",
        "LOADED_BY_PROCESS",
        "NOT_LOADED_BY_PROCESS",
      ]).optional(),
      hashedSize: z.string().optional(),
      operations: z.array(z.object({
        type: z.unknown().optional(),
      })).optional(),
      partiallyHashed: z.boolean().optional(),
      path: z.string().optional(),
      sha256: z.string().optional(),
      size: z.string().optional(),
    }).optional(),
    userId: z.string().optional(),
  })).optional(),
  resourceName: z.string().optional(),
  secret: z.object({
    environmentVariable: z.object({
      key: z.string().optional(),
    }).optional(),
    filePath: z.object({
      path: z.string().optional(),
    }).optional(),
    status: z.object({
      lastUpdatedTime: z.string().optional(),
      validity: z.enum([
        "SECRET_VALIDITY_UNSPECIFIED",
        "SECRET_VALIDITY_UNSUPPORTED",
        "SECRET_VALIDITY_FAILED",
        "SECRET_VALIDITY_INVALID",
        "SECRET_VALIDITY_VALID",
      ]).optional(),
    }).optional(),
    type: z.string().optional(),
  }).optional(),
  securityMarks: z.object({
    canonicalName: z.string().optional(),
    marks: z.record(z.string(), z.string()).optional(),
    name: z.string().optional(),
  }).optional(),
  securityPosture: z.object({
    changedPolicy: z.string().optional(),
    name: z.string().optional(),
    policy: z.string().optional(),
    policyDriftDetails: z.array(z.object({
      detectedValue: z.string().optional(),
      expectedValue: z.string().optional(),
      field: z.string().optional(),
    })).optional(),
    policySet: z.string().optional(),
    postureDeployment: z.string().optional(),
    postureDeploymentResource: z.string().optional(),
    revisionId: z.string().optional(),
  }).optional(),
  severity: z.enum([
    "SEVERITY_UNSPECIFIED",
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW",
  ]).optional(),
  sourceProperties: z.record(z.string(), z.string()).optional(),
  state: z.enum(["STATE_UNSPECIFIED", "ACTIVE", "INACTIVE"]).optional(),
  toxicCombination: z.object({
    attackExposureScore: z.number().optional(),
    relatedFindings: z.array(z.string()).optional(),
  }).optional(),
  vertexAi: z.object({
    datasets: z.array(z.object({
      displayName: z.string().optional(),
      name: z.string().optional(),
      source: z.string().optional(),
    })).optional(),
    pipelines: z.array(z.object({
      displayName: z.string().optional(),
      name: z.string().optional(),
    })).optional(),
  }).optional(),
  vulnerability: z.object({
    cve: z.object({
      cvssv3: z.object({
        attackComplexity: z.enum([
          "ATTACK_COMPLEXITY_UNSPECIFIED",
          "ATTACK_COMPLEXITY_LOW",
          "ATTACK_COMPLEXITY_HIGH",
        ]).optional(),
        attackVector: z.enum([
          "ATTACK_VECTOR_UNSPECIFIED",
          "ATTACK_VECTOR_NETWORK",
          "ATTACK_VECTOR_ADJACENT",
          "ATTACK_VECTOR_LOCAL",
          "ATTACK_VECTOR_PHYSICAL",
        ]).optional(),
        availabilityImpact: z.enum([
          "IMPACT_UNSPECIFIED",
          "IMPACT_HIGH",
          "IMPACT_LOW",
          "IMPACT_NONE",
        ]).optional(),
        baseScore: z.number().optional(),
        confidentialityImpact: z.enum([
          "IMPACT_UNSPECIFIED",
          "IMPACT_HIGH",
          "IMPACT_LOW",
          "IMPACT_NONE",
        ]).optional(),
        integrityImpact: z.enum([
          "IMPACT_UNSPECIFIED",
          "IMPACT_HIGH",
          "IMPACT_LOW",
          "IMPACT_NONE",
        ]).optional(),
        privilegesRequired: z.enum([
          "PRIVILEGES_REQUIRED_UNSPECIFIED",
          "PRIVILEGES_REQUIRED_NONE",
          "PRIVILEGES_REQUIRED_LOW",
          "PRIVILEGES_REQUIRED_HIGH",
        ]).optional(),
        scope: z.enum(["SCOPE_UNSPECIFIED", "SCOPE_UNCHANGED", "SCOPE_CHANGED"])
          .optional(),
        userInteraction: z.enum([
          "USER_INTERACTION_UNSPECIFIED",
          "USER_INTERACTION_NONE",
          "USER_INTERACTION_REQUIRED",
        ]).optional(),
      }).optional(),
      exploitReleaseDate: z.string().optional(),
      exploitationActivity: z.enum([
        "EXPLOITATION_ACTIVITY_UNSPECIFIED",
        "WIDE",
        "CONFIRMED",
        "AVAILABLE",
        "ANTICIPATED",
        "NO_KNOWN",
      ]).optional(),
      firstExploitationDate: z.string().optional(),
      id: z.string().optional(),
      impact: z.enum([
        "RISK_RATING_UNSPECIFIED",
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ]).optional(),
      observedInTheWild: z.boolean().optional(),
      references: z.array(z.object({
        source: z.string().optional(),
        uri: z.string().optional(),
      })).optional(),
      upstreamFixAvailable: z.boolean().optional(),
      zeroDay: z.boolean().optional(),
    }).optional(),
    cwes: z.array(z.object({
      id: z.string().optional(),
      references: z.array(z.object({
        source: z.unknown().optional(),
        uri: z.unknown().optional(),
      })).optional(),
    })).optional(),
    fixedPackage: z.object({
      cpeUri: z.string().optional(),
      packageName: z.string().optional(),
      packageType: z.string().optional(),
      packageVersion: z.string().optional(),
    }).optional(),
    offendingPackage: z.object({
      cpeUri: z.string().optional(),
      packageName: z.string().optional(),
      packageType: z.string().optional(),
      packageVersion: z.string().optional(),
    }).optional(),
    providerRiskScore: z.string().optional(),
    reachable: z.boolean().optional(),
    securityBulletin: z.object({
      bulletinId: z.string().optional(),
      submissionTime: z.string().optional(),
      suggestedUpgradeVersion: z.string().optional(),
    }).optional(),
  }).optional(),
});

interface CuratedFinding {
  name: string;
  category: string;
  severity: string;
  state: string;
  mute: string;
  findingClass: string;
  eventTime: string;
  createTime: string;
  canonicalName: string;
  resourceName: string;
  resourceType: string;
  resourceProject: string;
  resourceLocation: string;
  resourceCloudProvider: string;
}

interface FindingsSnapshot {
  findings: CuratedFinding[];
  totalFetched: number;
  truncated: boolean;
  snapshotTimestamp: string;
}

// Curates a raw SCC finding into selected metadata fields.
// Explicitly excludes sourceProperties, secret, and other raw payload fields.
// Keep in sync with securitycenter-sources-findings.helpers.ts
function _curateSccFinding(raw: any): CuratedFinding {
  const resource = raw.resource ?? {};
  return {
    name: raw.name ?? "",
    category: raw.category ?? "",
    severity: raw.severity ?? "",
    state: raw.state ?? "",
    mute: raw.mute ?? "",
    findingClass: raw.findingClass ?? "",
    eventTime: raw.eventTime ?? "",
    createTime: raw.createTime ?? "",
    canonicalName: raw.canonicalName ?? "",
    resourceName: resource.name ?? "",
    resourceType: resource.type ?? "",
    resourceProject: resource.projectDisplayName ?? "",
    resourceLocation: resource.location ?? "",
    resourceCloudProvider: resource.cloudProvider ?? "",
  };
}

// Fetches one page of findings from the SCC v2 location-scoped endpoint.
// Rejects 403 immediately as a permission error.
// Keep in sync with securitycenter-sources-findings.helpers.ts
async function _fetchSccFindingsPage(
  baseUrl: string,
  parent: string,
  filter: string | undefined,
  pageSize: number,
  pageToken: string | undefined,
  requestFn: (
    method: string,
    url: string,
    body?: Record<string, unknown>,
    creds?: any,
  ) => Promise<Response>,
  credentials?: any,
): Promise<{ findings: any[]; nextPageToken: string | undefined }> {
  const params: string[] = [`pageSize=${pageSize}`];
  if (filter) params.push(`filter=${encodeURIComponent(filter)}`);
  if (pageToken) params.push(`pageToken=${encodeURIComponent(pageToken)}`);
  const qs = `?${params.join("&")}`;

  // SCC v2 uses location-scoped endpoints: v2/{parent}/findings
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const url = `${base}v2/${parent}/findings${qs}`;
  const resp = await requestFn("GET", url, undefined, credentials);

  if (resp.status === 403) {
    const body = await resp.text();
    throw new Error(
      `Permission denied listing findings for ${parent}: ${resp.status} ${body}. ` +
        `Check that the caller has securitycenter.findings.list permission.`,
    );
  }
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`List findings failed (${resp.status}): ${body}`);
  }

  const data = await resp.json();
  const findings = data.listFindingsResults ?? [];
  const rawFindings = findings.map((r: any) => r.finding ?? r);
  return {
    findings: rawFindings,
    nextPageToken: data.nextPageToken ?? undefined,
  };
}

// Orchestrates paginated fetching and curation of SCC findings.
// Enforces maxFindings cap. Returns a snapshot with curated metadata only.
// Keep in sync with securitycenter-sources-findings.helpers.ts
async function _snapshotSccFindings(
  baseUrl: string,
  parent: string,
  filter: string | undefined,
  pageSize: number,
  maxFindings: number,
  requestFn: (
    method: string,
    url: string,
    body?: Record<string, unknown>,
    creds?: any,
  ) => Promise<Response>,
  credentials?: any,
): Promise<FindingsSnapshot> {
  const curated: CuratedFinding[] = [];
  let pageToken: string | undefined;
  let totalFetched = 0;
  let truncated = false;

  do {
    const page = await _fetchSccFindingsPage(
      baseUrl,
      parent,
      filter,
      pageSize,
      pageToken,
      requestFn,
      credentials,
    );

    for (const raw of page.findings) {
      if (curated.length >= maxFindings) {
        truncated = true;
        break;
      }
      curated.push(_curateSccFinding(raw));
      totalFetched++;
    }

    if (truncated) break;
    pageToken = page.nextPageToken;
  } while (pageToken);

  return {
    findings: curated,
    totalFetched,
    truncated,
    snapshotTimestamp: new Date().toISOString(),
  };
}

const inventoryFindingsMethods = {
  // This method uses SCC v2 (location-scoped) while the generated model's
  // other methods use SCC v1. The v2 endpoint adds location scoping:
  //   v2/organizations/{org}/sources/{source}/locations/{location}/findings
  // vs v1's unscoped parent path. Both share the same base URL and auth.
  inventory_findings: {
    description:
      "Snapshot SCC v2 findings for a location-scoped source, returning curated metadata without raw payloads",
    arguments: z.object({
      organisation: z.string().describe(
        "GCP organisation ID (numeric), e.g. '123456789'",
      ),
      source: z.string().describe(
        "SCC source ID (numeric) or '-' for all sources",
      ),
      location: z.string().describe(
        "GCP location, e.g. 'global', 'us-central1'",
      ),
      filter: z.string().describe(
        'SCC filter expression, e.g. \'state="ACTIVE" AND severity="HIGH"\'',
      ).optional(),
      pageSize: z.number().int().min(1).max(1000).describe(
        "Findings per API page (default 1000)",
      ).optional(),
      maxFindings: z.number().int().min(1).describe(
        "Maximum findings to persist in the snapshot (default 10000)",
      ).optional(),
    }),
    execute: async (args: Record<string, unknown>, context: any) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);

      const organisation = args["organisation"] as string;
      const source = args["source"] as string;
      const location = args["location"] as string;
      const filter = args["filter"] as string | undefined;
      const pageSize = (args["pageSize"] as number | undefined) ?? 1000;
      const maxFindings = (args["maxFindings"] as number | undefined) ?? 10000;

      const parent =
        `organizations/${organisation}/sources/${source}/locations/${location}`;

      const snapshot = await _snapshotSccFindings(
        baseUrl,
        parent,
        filter,
        pageSize,
        maxFindings,
        request,
        credentials,
      );

      return { result: snapshot };
    },
  },
};

const StateSchema = z.object({
  finding: z.object({
    access: z.object({
      callerIp: z.string(),
      callerIpGeo: z.object({
        regionCode: z.string(),
      }),
      methodName: z.string(),
      principalEmail: z.string(),
      principalSubject: z.string(),
      serviceAccountDelegationInfo: z.array(z.object({
        principalEmail: z.string(),
        principalSubject: z.string(),
      })),
      serviceAccountKeyName: z.string(),
      serviceName: z.string(),
      userAgent: z.string(),
      userAgentFamily: z.string(),
      userName: z.string(),
    }),
    affectedResources: z.object({
      count: z.string(),
    }),
    agent: z.object({
      displayName: z.string(),
      id: z.string(),
    }),
    agentAnomaly: z.object({
      confidenceScore: z.number(),
      detectorReferences: z.array(z.object({
        detectorId: z.string(),
        displayName: z.string(),
        explanation: z.string(),
        recommendation: z.string(),
        severity: z.string(),
      })),
      invocationReferences: z.array(z.object({
        invocationId: z.string(),
      })),
    }),
    agentDataAccessEvents: z.array(z.object({
      eventId: z.string(),
      eventTime: z.string(),
      operation: z.string(),
      principalSubject: z.string(),
    })),
    agentSessions: z.array(z.object({
      sessionId: z.string(),
    })),
    aiModel: z.object({
      deploymentPlatform: z.string(),
      displayName: z.string(),
      domain: z.string(),
      library: z.string(),
      location: z.string(),
      name: z.string(),
      publisher: z.string(),
      usageCategory: z.string(),
    }),
    application: z.object({
      baseUri: z.string(),
      fullUri: z.string(),
    }),
    artifactGuardPolicies: z.object({
      failingPolicies: z.array(z.object({
        failureReason: z.string(),
        policyId: z.string(),
        type: z.string(),
      })),
      resourceId: z.string(),
    }),
    attackExposure: z.object({
      attackExposureResult: z.string(),
      exposedHighValueResourcesCount: z.number(),
      exposedLowValueResourcesCount: z.number(),
      exposedMediumValueResourcesCount: z.number(),
      latestCalculationTime: z.string(),
      score: z.number(),
      state: z.string(),
    }),
    backupDisasterRecovery: z.object({
      appliance: z.string(),
      applications: z.array(z.string()),
      backupCreateTime: z.string(),
      backupTemplate: z.string(),
      backupType: z.string(),
      host: z.string(),
      policies: z.array(z.string()),
      policyOptions: z.array(z.string()),
      profile: z.string(),
      storagePool: z.string(),
    }),
    canonicalName: z.string(),
    category: z.string(),
    chokepoint: z.object({
      relatedFindings: z.array(z.string()),
    }),
    cloudArmor: z.object({
      adaptiveProtection: z.object({
        confidence: z.number(),
      }),
      attack: z.object({
        classification: z.string(),
        volumeBps: z.number(),
        volumeBpsLong: z.string(),
        volumePps: z.number(),
        volumePpsLong: z.string(),
      }),
      duration: z.string(),
      requests: z.object({
        longTermAllowed: z.number(),
        longTermDenied: z.number(),
        ratio: z.number(),
        shortTermAllowed: z.number(),
      }),
      securityPolicy: z.object({
        name: z.string(),
        preview: z.boolean(),
        type: z.string(),
      }),
      threatVector: z.string(),
    }),
    cloudDlpDataProfile: z.object({
      dataProfile: z.string(),
      infoTypes: z.array(z.object({
        name: z.string(),
        sensitivityScore: z.object({
          score: z.unknown(),
        }),
        version: z.string(),
      })),
      parentType: z.string(),
    }),
    cloudDlpInspection: z.object({
      fullScan: z.boolean(),
      infoType: z.string(),
      infoTypeCount: z.string(),
      inspectJob: z.string(),
    }),
    complianceDetails: z.object({
      cloudControl: z.object({
        cloudControlName: z.string(),
        policyType: z.string(),
        type: z.string(),
        version: z.number(),
      }),
      cloudControlDeploymentNames: z.array(z.string()),
      frameworks: z.array(z.object({
        category: z.array(z.unknown()),
        controls: z.array(z.unknown()),
        displayName: z.string(),
        name: z.string(),
        type: z.string(),
      })),
    }),
    compliances: z.array(z.object({
      ids: z.array(z.string()),
      standard: z.string(),
      version: z.string(),
    })),
    connections: z.array(z.object({
      destinationIp: z.string(),
      destinationPort: z.number(),
      protocol: z.string(),
      sourceIp: z.string(),
      sourcePort: z.number(),
    })),
    contacts: z.record(z.string(), z.unknown()),
    containers: z.array(z.object({
      createTime: z.string(),
      imageId: z.string(),
      labels: z.array(z.object({
        name: z.unknown(),
        value: z.unknown(),
      })),
      name: z.string(),
      uri: z.string(),
    })),
    createTime: z.string(),
    dataAccessEvents: z.array(z.object({
      eventId: z.string(),
      eventTime: z.string(),
      operation: z.string(),
      principalEmail: z.string(),
    })),
    dataFlowEvents: z.array(z.object({
      eventId: z.string(),
      eventTime: z.string(),
      operation: z.string(),
      principalEmail: z.string(),
      violatedLocation: z.string(),
    })),
    dataRetentionDeletionEvents: z.array(z.object({
      dataObjectCount: z.string(),
      eventDetectionTime: z.string(),
      eventType: z.string(),
      maxRetentionAllowed: z.string(),
      minRetentionAllowed: z.string(),
    })),
    database: z.object({
      displayName: z.string(),
      grantees: z.array(z.string()),
      name: z.string(),
      query: z.string(),
      userName: z.string(),
      version: z.string(),
    }),
    description: z.string(),
    discoveredWorkload: z.object({
      confidence: z.string(),
      detectedRelevantHardware: z.boolean(),
      detectedRelevantKeywords: z.boolean(),
      detectedRelevantPackages: z.boolean(),
      workloadType: z.string(),
    }),
    disk: z.object({
      name: z.string(),
    }),
    eventTime: z.string(),
    exfiltration: z.object({
      sources: z.array(z.object({
        components: z.array(z.unknown()),
        name: z.string(),
      })),
      targets: z.array(z.object({
        components: z.array(z.unknown()),
        name: z.string(),
      })),
      totalExfiltratedBytes: z.string(),
    }),
    externalExposure: z.object({
      backendBucket: z.string(),
      backendService: z.string(),
      exposedApplication: z.string(),
      exposedEndpoint: z.string(),
      exposedService: z.string(),
      forwardingRule: z.string(),
      hostnameUri: z.string(),
      httpResponse: z.array(z.object({
        path: z.string(),
        statusCode: z.string(),
      })),
      instanceGroup: z.string(),
      internalBackendService: z.string(),
      loadBalancerFirewallPolicy: z.string(),
      networkEndpointGroup: z.string(),
      networkIngressFirewallPolicy: z.string(),
      networkPathInsightsGenerationTime: z.string(),
      privateIpAddress: z.string(),
      privatePort: z.string(),
      pscNetworkAttachment: z.string(),
      pscServiceAttachment: z.string(),
      publicIpAddress: z.string(),
      publicPort: z.string(),
      serviceFirewallPolicy: z.string(),
    }),
    externalSystems: z.record(z.string(), z.unknown()),
    externalUri: z.string(),
    files: z.array(z.object({
      contents: z.string(),
      diskPath: z.object({
        partitionUuid: z.string(),
        relativePath: z.string(),
      }),
      fileLoadState: z.string(),
      hashedSize: z.string(),
      operations: z.array(z.object({
        type: z.unknown(),
      })),
      partiallyHashed: z.boolean(),
      path: z.string(),
      sha256: z.string(),
      size: z.string(),
    })),
    findingClass: z.string(),
    groupMemberships: z.array(z.object({
      groupId: z.string(),
      groupType: z.string(),
    })),
    iamBindings: z.array(z.object({
      action: z.string(),
      member: z.string(),
      role: z.string(),
    })),
    iamDetails: z.object({
      iamRolePermissions: z.array(z.object({
        name: z.string(),
        role: z.string(),
      })),
    }),
    indicator: z.object({
      domains: z.array(z.string()),
      ipAddresses: z.array(z.string()),
      signatures: z.array(z.object({
        memoryHashSignature: z.object({
          binaryFamily: z.unknown(),
          detections: z.unknown(),
        }),
        signatureType: z.string(),
        yaraRuleSignature: z.object({
          yaraRule: z.unknown(),
        }),
      })),
      uris: z.array(z.string()),
    }),
    ipRules: z.object({
      allowed: z.object({
        ipRules: z.array(z.object({
          portRanges: z.unknown(),
          protocol: z.unknown(),
        })),
      }),
      denied: z.object({
        ipRules: z.array(z.object({
          portRanges: z.unknown(),
          protocol: z.unknown(),
        })),
      }),
      destinationIpRanges: z.array(z.string()),
      direction: z.string(),
      exposedServices: z.array(z.string()),
      sourceIpRanges: z.array(z.string()),
    }),
    job: z.object({
      errorCode: z.number(),
      location: z.string(),
      name: z.string(),
      state: z.string(),
    }),
    kernelRootkit: z.object({
      name: z.string(),
      unexpectedCodeModification: z.boolean(),
      unexpectedFtraceHandler: z.boolean(),
      unexpectedInterruptHandler: z.boolean(),
      unexpectedKernelCodePages: z.boolean(),
      unexpectedKprobeHandler: z.boolean(),
      unexpectedProcessesInRunqueue: z.boolean(),
      unexpectedReadOnlyDataModification: z.boolean(),
      unexpectedSystemCallHandler: z.boolean(),
    }),
    kubernetes: z.object({
      accessReviews: z.array(z.object({
        group: z.string(),
        name: z.string(),
        ns: z.string(),
        resource: z.string(),
        subresource: z.string(),
        verb: z.string(),
        version: z.string(),
      })),
      bindings: z.array(z.object({
        name: z.string(),
        ns: z.string(),
        role: z.object({
          kind: z.unknown(),
          name: z.unknown(),
          ns: z.unknown(),
        }),
        subjects: z.array(z.unknown()),
      })),
      nodePools: z.array(z.object({
        name: z.string(),
        nodes: z.array(z.unknown()),
      })),
      nodes: z.array(z.object({
        name: z.string(),
      })),
      objects: z.array(z.object({
        containers: z.array(z.unknown()),
        group: z.string(),
        kind: z.string(),
        name: z.string(),
        ns: z.string(),
      })),
      pods: z.array(z.object({
        containers: z.array(z.unknown()),
        labels: z.array(z.unknown()),
        name: z.string(),
        ns: z.string(),
      })),
      roles: z.array(z.object({
        kind: z.string(),
        name: z.string(),
        ns: z.string(),
      })),
    }),
    loadBalancers: z.array(z.object({
      name: z.string(),
    })),
    logEntries: z.array(z.object({
      cloudLoggingEntry: z.object({
        insertId: z.string(),
        logId: z.string(),
        resourceContainer: z.string(),
        timestamp: z.string(),
      }),
    })),
    mitreAttack: z.object({
      additionalTactics: z.array(z.string()),
      additionalTechniques: z.array(z.string()),
      primaryTactic: z.string(),
      primaryTechniques: z.array(z.string()),
      version: z.string(),
    }),
    moduleName: z.string(),
    mute: z.string(),
    muteInfo: z.object({
      dynamicMuteRecords: z.array(z.object({
        matchTime: z.string(),
        muteConfig: z.string(),
      })),
      staticMute: z.object({
        applyTime: z.string(),
        state: z.string(),
      }),
    }),
    muteInitiator: z.string(),
    muteUpdateTime: z.string(),
    name: z.string(),
    networks: z.array(z.object({
      name: z.string(),
    })),
    nextSteps: z.string(),
    notebook: z.object({
      lastAuthor: z.string(),
      name: z.string(),
      notebookUpdateTime: z.string(),
      service: z.string(),
    }),
    orgPolicies: z.array(z.object({
      name: z.string(),
    })),
    parent: z.string(),
    parentDisplayName: z.string(),
    policyViolationSummary: z.object({
      conformantResourcesCount: z.string(),
      evaluationErrorsCount: z.string(),
      outOfScopeResourcesCount: z.string(),
      policyViolationsCount: z.string(),
    }),
    processes: z.array(z.object({
      args: z.array(z.string()),
      argumentsTruncated: z.boolean(),
      binary: z.object({
        contents: z.string(),
        diskPath: z.object({
          partitionUuid: z.unknown(),
          relativePath: z.unknown(),
        }),
        fileLoadState: z.string(),
        hashedSize: z.string(),
        operations: z.array(z.unknown()),
        partiallyHashed: z.boolean(),
        path: z.string(),
        sha256: z.string(),
        size: z.string(),
      }),
      envVariables: z.array(z.object({
        name: z.unknown(),
        val: z.unknown(),
      })),
      envVariablesTruncated: z.boolean(),
      libraries: z.array(z.object({
        contents: z.unknown(),
        diskPath: z.unknown(),
        fileLoadState: z.unknown(),
        hashedSize: z.unknown(),
        operations: z.unknown(),
        partiallyHashed: z.unknown(),
        path: z.unknown(),
        sha256: z.unknown(),
        size: z.unknown(),
      })),
      name: z.string(),
      parentPid: z.string(),
      pid: z.string(),
      script: z.object({
        contents: z.string(),
        diskPath: z.object({
          partitionUuid: z.unknown(),
          relativePath: z.unknown(),
        }),
        fileLoadState: z.string(),
        hashedSize: z.string(),
        operations: z.array(z.unknown()),
        partiallyHashed: z.boolean(),
        path: z.string(),
        sha256: z.string(),
        size: z.string(),
      }),
      userId: z.string(),
    })),
    resourceName: z.string(),
    secret: z.object({
      environmentVariable: z.object({
        key: z.string(),
      }),
      filePath: z.object({
        path: z.string(),
      }),
      status: z.object({
        lastUpdatedTime: z.string(),
        validity: z.string(),
      }),
      type: z.string(),
    }),
    securityMarks: z.object({
      canonicalName: z.string(),
      marks: z.record(z.string(), z.unknown()),
      name: z.string(),
    }),
    securityPosture: z.object({
      changedPolicy: z.string(),
      name: z.string(),
      policy: z.string(),
      policyDriftDetails: z.array(z.object({
        detectedValue: z.string(),
        expectedValue: z.string(),
        field: z.string(),
      })),
      policySet: z.string(),
      postureDeployment: z.string(),
      postureDeploymentResource: z.string(),
      revisionId: z.string(),
    }),
    severity: z.string(),
    sourceProperties: z.record(z.string(), z.unknown()),
    state: z.string(),
    toxicCombination: z.object({
      attackExposureScore: z.number(),
      relatedFindings: z.array(z.string()),
    }),
    vertexAi: z.object({
      datasets: z.array(z.object({
        displayName: z.string(),
        name: z.string(),
        source: z.string(),
      })),
      pipelines: z.array(z.object({
        displayName: z.string(),
        name: z.string(),
      })),
    }),
    vulnerability: z.object({
      cve: z.object({
        cvssv3: z.object({
          attackComplexity: z.string(),
          attackVector: z.string(),
          availabilityImpact: z.string(),
          baseScore: z.number(),
          confidentialityImpact: z.string(),
          integrityImpact: z.string(),
          privilegesRequired: z.string(),
          scope: z.string(),
          userInteraction: z.string(),
        }),
        exploitReleaseDate: z.string(),
        exploitationActivity: z.string(),
        firstExploitationDate: z.string(),
        id: z.string(),
        impact: z.string(),
        observedInTheWild: z.boolean(),
        references: z.array(z.object({
          source: z.unknown(),
          uri: z.unknown(),
        })),
        upstreamFixAvailable: z.boolean(),
        zeroDay: z.boolean(),
      }),
      cwes: z.array(z.object({
        id: z.string(),
        references: z.array(z.unknown()),
      })),
      fixedPackage: z.object({
        cpeUri: z.string(),
        packageName: z.string(),
        packageType: z.string(),
        packageVersion: z.string(),
      }),
      offendingPackage: z.object({
        cpeUri: z.string(),
        packageName: z.string(),
        packageType: z.string(),
        packageVersion: z.string(),
      }),
      providerRiskScore: z.string(),
      reachable: z.boolean(),
      securityBulletin: z.object({
        bulletinId: z.string(),
        submissionTime: z.string(),
        suggestedUpgradeVersion: z.string(),
      }),
    }),
  }).optional(),
  resource: z.object({
    adcApplication: z.object({
      attributes: z.object({
        businessOwners: z.array(z.object({
          email: z.unknown(),
        })),
        criticality: z.object({
          type: z.string(),
        }),
        developerOwners: z.array(z.object({
          email: z.unknown(),
        })),
        environment: z.object({
          type: z.string(),
        }),
        operatorOwners: z.array(z.object({
          email: z.unknown(),
        })),
      }),
      name: z.string(),
    }),
    adcApplicationTemplate: z.object({
      name: z.string(),
    }),
    adcSharedTemplate: z.object({
      name: z.string(),
    }),
    application: z.object({
      attributes: z.object({
        businessOwners: z.array(z.object({
          email: z.unknown(),
        })),
        criticality: z.object({
          type: z.string(),
        }),
        developerOwners: z.array(z.object({
          email: z.unknown(),
        })),
        environment: z.object({
          type: z.string(),
        }),
        operatorOwners: z.array(z.object({
          email: z.unknown(),
        })),
      }),
      name: z.string(),
    }),
    awsMetadata: z.object({
      account: z.object({
        id: z.string(),
        name: z.string(),
      }),
      organization: z.object({
        id: z.string(),
      }),
      organizationalUnits: z.array(z.object({
        id: z.string(),
        name: z.string(),
      })),
    }),
    azureMetadata: z.object({
      managementGroups: z.array(z.object({
        displayName: z.string(),
        id: z.string(),
      })),
      resourceGroup: z.object({
        id: z.string(),
        name: z.string(),
      }),
      subscription: z.object({
        displayName: z.string(),
        id: z.string(),
      }),
      tenant: z.object({
        displayName: z.string(),
        id: z.string(),
      }),
    }),
    cloudProvider: z.string(),
    displayName: z.string(),
    folders: z.array(z.object({
      resourceFolder: z.string(),
      resourceFolderDisplayName: z.string(),
    })),
    location: z.string(),
    name: z.string(),
    organization: z.string(),
    parentDisplayName: z.string(),
    parentName: z.string(),
    projectDisplayName: z.string(),
    projectName: z.string(),
    resourcePath: z.object({
      nodes: z.array(z.object({
        displayName: z.string(),
        id: z.string(),
        nodeType: z.string(),
      })),
    }),
    resourcePathString: z.string(),
    service: z.string(),
    type: z.string(),
  }).optional(),
  stateChange: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  access: z.object({
    callerIp: z.string().optional(),
    callerIpGeo: z.object({
      regionCode: z.string().optional(),
    }).optional(),
    methodName: z.string().optional(),
    principalEmail: z.string().optional(),
    principalSubject: z.string().optional(),
    serviceAccountDelegationInfo: z.array(z.object({
      principalEmail: z.string().optional(),
      principalSubject: z.string().optional(),
    })).optional(),
    serviceAccountKeyName: z.string().optional(),
    serviceName: z.string().optional(),
    userAgent: z.string().optional(),
    userAgentFamily: z.string().optional(),
    userName: z.string().optional(),
  }).optional(),
  affectedResources: z.object({
    count: z.string().optional(),
  }).optional(),
  agent: z.object({
    displayName: z.string().optional(),
    id: z.string().optional(),
  }).optional(),
  agentAnomaly: z.object({
    confidenceScore: z.number().optional(),
    detectorReferences: z.array(z.object({
      detectorId: z.string().optional(),
      displayName: z.string().optional(),
      explanation: z.string().optional(),
      recommendation: z.string().optional(),
      severity: z.enum([
        "SEVERITY_UNSPECIFIED",
        "CRITICAL",
        "HIGH",
        "MEDIUM",
        "LOW",
      ]).optional(),
    })).optional(),
    invocationReferences: z.array(z.object({
      invocationId: z.string().optional(),
    })).optional(),
  }).optional(),
  agentDataAccessEvents: z.array(z.object({
    eventId: z.string().optional(),
    eventTime: z.string().optional(),
    operation: z.enum(["OPERATION_UNSPECIFIED", "READ", "MOVE", "COPY"])
      .optional(),
    principalSubject: z.string().optional(),
  })).optional(),
  agentSessions: z.array(z.object({
    sessionId: z.string().optional(),
  })).optional(),
  aiModel: z.object({
    deploymentPlatform: z.enum([
      "DEPLOYMENT_PLATFORM_UNSPECIFIED",
      "VERTEX_AI",
      "GKE",
      "GCE",
      "FINE_TUNED_MODEL",
    ]).optional(),
    displayName: z.string().optional(),
    domain: z.string().optional(),
    library: z.string().optional(),
    location: z.string().optional(),
    name: z.string().optional(),
    publisher: z.string().optional(),
    usageCategory: z.string().optional(),
  }).optional(),
  application: z.object({
    baseUri: z.string().optional(),
    fullUri: z.string().optional(),
  }).optional(),
  artifactGuardPolicies: z.object({
    failingPolicies: z.array(z.object({
      failureReason: z.string().optional(),
      policyId: z.string().optional(),
      type: z.enum(["ARTIFACT_GUARD_POLICY_TYPE_UNSPECIFIED", "VULNERABILITY"])
        .optional(),
    })).optional(),
    resourceId: z.string().optional(),
  }).optional(),
  attackExposure: z.object({
    attackExposureResult: z.string().optional(),
    exposedHighValueResourcesCount: z.number().int().optional(),
    exposedLowValueResourcesCount: z.number().int().optional(),
    exposedMediumValueResourcesCount: z.number().int().optional(),
    latestCalculationTime: z.string().optional(),
    score: z.number().optional(),
    state: z.enum(["STATE_UNSPECIFIED", "CALCULATED", "NOT_CALCULATED"])
      .optional(),
  }).optional(),
  backupDisasterRecovery: z.object({
    appliance: z.string().optional(),
    applications: z.array(z.string()).optional(),
    backupCreateTime: z.string().optional(),
    backupTemplate: z.string().optional(),
    backupType: z.string().optional(),
    host: z.string().optional(),
    policies: z.array(z.string()).optional(),
    policyOptions: z.array(z.string()).optional(),
    profile: z.string().optional(),
    storagePool: z.string().optional(),
  }).optional(),
  canonicalName: z.string().optional(),
  category: z.string().optional(),
  chokepoint: z.object({
    relatedFindings: z.array(z.string()).optional(),
  }).optional(),
  cloudArmor: z.object({
    adaptiveProtection: z.object({
      confidence: z.number().optional(),
    }).optional(),
    attack: z.object({
      classification: z.string().optional(),
      volumeBps: z.number().int().optional(),
      volumeBpsLong: z.string().optional(),
      volumePps: z.number().int().optional(),
      volumePpsLong: z.string().optional(),
    }).optional(),
    duration: z.string().optional(),
    requests: z.object({
      longTermAllowed: z.number().int().optional(),
      longTermDenied: z.number().int().optional(),
      ratio: z.number().optional(),
      shortTermAllowed: z.number().int().optional(),
    }).optional(),
    securityPolicy: z.object({
      name: z.string().optional(),
      preview: z.boolean().optional(),
      type: z.string().optional(),
    }).optional(),
    threatVector: z.string().optional(),
  }).optional(),
  cloudDlpDataProfile: z.object({
    dataProfile: z.string().optional(),
    infoTypes: z.array(z.object({
      name: z.string().optional(),
      sensitivityScore: z.object({
        score: z.enum([
          "SENSITIVITY_SCORE_LEVEL_UNSPECIFIED",
          "SENSITIVITY_LOW",
          "SENSITIVITY_UNKNOWN",
          "SENSITIVITY_MODERATE",
          "SENSITIVITY_HIGH",
        ]).optional(),
      }).optional(),
      version: z.string().optional(),
    })).optional(),
    parentType: z.enum(["PARENT_TYPE_UNSPECIFIED", "ORGANIZATION", "PROJECT"])
      .optional(),
  }).optional(),
  cloudDlpInspection: z.object({
    fullScan: z.boolean().optional(),
    infoType: z.string().optional(),
    infoTypeCount: z.string().optional(),
    inspectJob: z.string().optional(),
  }).optional(),
  complianceDetails: z.object({
    cloudControl: z.object({
      cloudControlName: z.string().optional(),
      policyType: z.string().optional(),
      type: z.enum(["CLOUD_CONTROL_TYPE_UNSPECIFIED", "BUILT_IN", "CUSTOM"])
        .optional(),
      version: z.number().int().optional(),
    }).optional(),
    cloudControlDeploymentNames: z.array(z.string()).optional(),
    frameworks: z.array(z.object({
      category: z.array(
        z.enum([
          "FRAMEWORK_CATEGORY_UNSPECIFIED",
          "SECURITY_BENCHMARKS",
          "ASSURED_WORKLOADS",
          "DATA_SECURITY",
          "GOOGLE_BEST_PRACTICES",
          "CUSTOM_FRAMEWORK",
        ]),
      ).optional(),
      controls: z.array(z.object({
        controlName: z.unknown().optional(),
        displayName: z.unknown().optional(),
      })).optional(),
      displayName: z.string().optional(),
      name: z.string().optional(),
      type: z.enum([
        "FRAMEWORK_TYPE_UNSPECIFIED",
        "FRAMEWORK_TYPE_BUILT_IN",
        "FRAMEWORK_TYPE_CUSTOM",
      ]).optional(),
    })).optional(),
  }).optional(),
  compliances: z.array(z.object({
    ids: z.array(z.string()).optional(),
    standard: z.string().optional(),
    version: z.string().optional(),
  })).optional(),
  connections: z.array(z.object({
    destinationIp: z.string().optional(),
    destinationPort: z.number().int().optional(),
    protocol: z.enum([
      "PROTOCOL_UNSPECIFIED",
      "ICMP",
      "TCP",
      "UDP",
      "GRE",
      "ESP",
    ]).optional(),
    sourceIp: z.string().optional(),
    sourcePort: z.number().int().optional(),
  })).optional(),
  contacts: z.record(
    z.string(),
    z.object({
      contacts: z.array(z.object({
        email: z.string().optional(),
      })).optional(),
    }),
  ).optional(),
  containers: z.array(z.object({
    createTime: z.string().optional(),
    imageId: z.string().optional(),
    labels: z.array(z.object({
      name: z.string().optional(),
      value: z.string().optional(),
    })).optional(),
    name: z.string().optional(),
    uri: z.string().optional(),
  })).optional(),
  createTime: z.string().optional(),
  dataAccessEvents: z.array(z.object({
    eventId: z.string().optional(),
    eventTime: z.string().optional(),
    operation: z.enum(["OPERATION_UNSPECIFIED", "READ", "MOVE", "COPY"])
      .optional(),
    principalEmail: z.string().optional(),
  })).optional(),
  dataFlowEvents: z.array(z.object({
    eventId: z.string().optional(),
    eventTime: z.string().optional(),
    operation: z.enum(["OPERATION_UNSPECIFIED", "READ", "MOVE", "COPY"])
      .optional(),
    principalEmail: z.string().optional(),
    violatedLocation: z.string().optional(),
  })).optional(),
  dataRetentionDeletionEvents: z.array(z.object({
    dataObjectCount: z.string().optional(),
    eventDetectionTime: z.string().optional(),
    eventType: z.enum([
      "EVENT_TYPE_UNSPECIFIED",
      "EVENT_TYPE_MAX_TTL_EXCEEDED",
      "EVENT_TYPE_MAX_TTL_FROM_CREATION",
      "EVENT_TYPE_MAX_TTL_FROM_LAST_MODIFICATION",
      "EVENT_TYPE_MIN_TTL_FROM_CREATION",
    ]).optional(),
    maxRetentionAllowed: z.string().optional(),
    minRetentionAllowed: z.string().optional(),
  })).optional(),
  database: z.object({
    displayName: z.string().optional(),
    grantees: z.array(z.string()).optional(),
    name: z.string().optional(),
    query: z.string().optional(),
    userName: z.string().optional(),
    version: z.string().optional(),
  }).optional(),
  description: z.string().optional(),
  discoveredWorkload: z.object({
    confidence: z.enum(["CONFIDENCE_UNSPECIFIED", "CONFIDENCE_HIGH"])
      .optional(),
    detectedRelevantHardware: z.boolean().optional(),
    detectedRelevantKeywords: z.boolean().optional(),
    detectedRelevantPackages: z.boolean().optional(),
    workloadType: z.enum([
      "WORKLOAD_TYPE_UNSPECIFIED",
      "MCP_SERVER",
      "AI_INFERENCE",
      "AGENT",
    ]).optional(),
  }).optional(),
  disk: z.object({
    name: z.string().optional(),
  }).optional(),
  eventTime: z.string().optional(),
  exfiltration: z.object({
    sources: z.array(z.object({
      components: z.array(z.string()).optional(),
      name: z.string().optional(),
    })).optional(),
    targets: z.array(z.object({
      components: z.array(z.string()).optional(),
      name: z.string().optional(),
    })).optional(),
    totalExfiltratedBytes: z.string().optional(),
  }).optional(),
  externalExposure: z.object({
    backendBucket: z.string().optional(),
    backendService: z.string().optional(),
    exposedApplication: z.string().optional(),
    exposedEndpoint: z.string().optional(),
    exposedService: z.string().optional(),
    forwardingRule: z.string().optional(),
    hostnameUri: z.string().optional(),
    httpResponse: z.array(z.object({
      path: z.string().optional(),
      statusCode: z.string().optional(),
    })).optional(),
    instanceGroup: z.string().optional(),
    internalBackendService: z.string().optional(),
    loadBalancerFirewallPolicy: z.string().optional(),
    networkEndpointGroup: z.string().optional(),
    networkIngressFirewallPolicy: z.string().optional(),
    networkPathInsightsGenerationTime: z.string().optional(),
    privateIpAddress: z.string().optional(),
    privatePort: z.string().optional(),
    pscNetworkAttachment: z.string().optional(),
    pscServiceAttachment: z.string().optional(),
    publicIpAddress: z.string().optional(),
    publicPort: z.string().optional(),
    serviceFirewallPolicy: z.string().optional(),
  }).optional(),
  externalSystems: z.record(
    z.string(),
    z.object({
      assignees: z.array(z.string()).optional(),
      caseCloseTime: z.string().optional(),
      caseCreateTime: z.string().optional(),
      casePriority: z.string().optional(),
      caseSla: z.string().optional(),
      caseUri: z.string().optional(),
      externalSystemUpdateTime: z.string().optional(),
      externalUid: z.string().optional(),
      name: z.string().optional(),
      status: z.string().optional(),
      ticketInfo: z.object({
        assignee: z.string().optional(),
        description: z.string().optional(),
        id: z.string().optional(),
        status: z.string().optional(),
        updateTime: z.string().optional(),
        uri: z.string().optional(),
      }).optional(),
    }),
  ).optional(),
  externalUri: z.string().optional(),
  files: z.array(z.object({
    contents: z.string().optional(),
    diskPath: z.object({
      partitionUuid: z.string().optional(),
      relativePath: z.string().optional(),
    }).optional(),
    fileLoadState: z.enum([
      "FILE_LOAD_STATE_UNSPECIFIED",
      "LOADED_BY_PROCESS",
      "NOT_LOADED_BY_PROCESS",
    ]).optional(),
    hashedSize: z.string().optional(),
    operations: z.array(z.object({
      type: z.enum([
        "OPERATION_TYPE_UNSPECIFIED",
        "OPEN",
        "READ",
        "RENAME",
        "WRITE",
        "EXECUTE",
      ]).optional(),
    })).optional(),
    partiallyHashed: z.boolean().optional(),
    path: z.string().optional(),
    sha256: z.string().optional(),
    size: z.string().optional(),
  })).optional(),
  findingClass: z.enum([
    "FINDING_CLASS_UNSPECIFIED",
    "THREAT",
    "VULNERABILITY",
    "MISCONFIGURATION",
    "OBSERVATION",
    "SCC_ERROR",
    "POSTURE_VIOLATION",
    "TOXIC_COMBINATION",
    "SENSITIVE_DATA_RISK",
    "CHOKEPOINT",
    "EXTERNAL_EXPOSURE",
    "SECRET",
  ]).optional(),
  groupMemberships: z.array(z.object({
    groupId: z.string().optional(),
    groupType: z.enum([
      "GROUP_TYPE_UNSPECIFIED",
      "GROUP_TYPE_TOXIC_COMBINATION",
      "GROUP_TYPE_CHOKEPOINT",
    ]).optional(),
  })).optional(),
  iamBindings: z.array(z.object({
    action: z.enum(["ACTION_UNSPECIFIED", "ADD", "REMOVE"]).optional(),
    member: z.string().optional(),
    role: z.string().optional(),
  })).optional(),
  iamDetails: z.object({
    iamRolePermissions: z.array(z.object({
      name: z.string().optional(),
      role: z.string().optional(),
    })).optional(),
  }).optional(),
  indicator: z.object({
    domains: z.array(z.string()).optional(),
    ipAddresses: z.array(z.string()).optional(),
    signatures: z.array(z.object({
      memoryHashSignature: z.object({
        binaryFamily: z.string().optional(),
        detections: z.array(z.unknown()).optional(),
      }).optional(),
      signatureType: z.enum([
        "SIGNATURE_TYPE_UNSPECIFIED",
        "SIGNATURE_TYPE_PROCESS",
        "SIGNATURE_TYPE_FILE",
      ]).optional(),
      yaraRuleSignature: z.object({
        yaraRule: z.string().optional(),
      }).optional(),
    })).optional(),
    uris: z.array(z.string()).optional(),
  }).optional(),
  ipRules: z.object({
    allowed: z.object({
      ipRules: z.array(z.object({
        portRanges: z.array(z.unknown()).optional(),
        protocol: z.string().optional(),
      })).optional(),
    }).optional(),
    denied: z.object({
      ipRules: z.array(z.object({
        portRanges: z.array(z.unknown()).optional(),
        protocol: z.string().optional(),
      })).optional(),
    }).optional(),
    destinationIpRanges: z.array(z.string()).optional(),
    direction: z.enum(["DIRECTION_UNSPECIFIED", "INGRESS", "EGRESS"])
      .optional(),
    exposedServices: z.array(z.string()).optional(),
    sourceIpRanges: z.array(z.string()).optional(),
  }).optional(),
  job: z.object({
    errorCode: z.number().int().optional(),
    location: z.string().optional(),
    name: z.string().optional(),
    state: z.enum([
      "JOB_STATE_UNSPECIFIED",
      "PENDING",
      "RUNNING",
      "SUCCEEDED",
      "FAILED",
    ]).optional(),
  }).optional(),
  kernelRootkit: z.object({
    name: z.string().optional(),
    unexpectedCodeModification: z.boolean().optional(),
    unexpectedFtraceHandler: z.boolean().optional(),
    unexpectedInterruptHandler: z.boolean().optional(),
    unexpectedKernelCodePages: z.boolean().optional(),
    unexpectedKprobeHandler: z.boolean().optional(),
    unexpectedProcessesInRunqueue: z.boolean().optional(),
    unexpectedReadOnlyDataModification: z.boolean().optional(),
    unexpectedSystemCallHandler: z.boolean().optional(),
  }).optional(),
  kubernetes: z.object({
    accessReviews: z.array(z.object({
      group: z.string().optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
      resource: z.string().optional(),
      subresource: z.string().optional(),
      verb: z.string().optional(),
      version: z.string().optional(),
    })).optional(),
    bindings: z.array(z.object({
      name: z.string().optional(),
      ns: z.string().optional(),
      role: z.object({
        kind: z.enum(["KIND_UNSPECIFIED", "ROLE", "CLUSTER_ROLE"]).optional(),
        name: z.string().optional(),
        ns: z.string().optional(),
      }).optional(),
      subjects: z.array(z.object({
        kind: z.unknown().optional(),
        name: z.unknown().optional(),
        ns: z.unknown().optional(),
      })).optional(),
    })).optional(),
    nodePools: z.array(z.object({
      name: z.string().optional(),
      nodes: z.array(z.object({
        name: z.unknown().optional(),
      })).optional(),
    })).optional(),
    nodes: z.array(z.object({
      name: z.string().optional(),
    })).optional(),
    objects: z.array(z.object({
      containers: z.array(z.object({
        createTime: z.unknown().optional(),
        imageId: z.unknown().optional(),
        labels: z.unknown().optional(),
        name: z.unknown().optional(),
        uri: z.unknown().optional(),
      })).optional(),
      group: z.string().optional(),
      kind: z.string().optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
    })).optional(),
    pods: z.array(z.object({
      containers: z.array(z.object({
        createTime: z.unknown().optional(),
        imageId: z.unknown().optional(),
        labels: z.unknown().optional(),
        name: z.unknown().optional(),
        uri: z.unknown().optional(),
      })).optional(),
      labels: z.array(z.object({
        name: z.unknown().optional(),
        value: z.unknown().optional(),
      })).optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
    })).optional(),
    roles: z.array(z.object({
      kind: z.enum(["KIND_UNSPECIFIED", "ROLE", "CLUSTER_ROLE"]).optional(),
      name: z.string().optional(),
      ns: z.string().optional(),
    })).optional(),
  }).optional(),
  loadBalancers: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  logEntries: z.array(z.object({
    cloudLoggingEntry: z.object({
      insertId: z.string().optional(),
      logId: z.string().optional(),
      resourceContainer: z.string().optional(),
      timestamp: z.string().optional(),
    }).optional(),
  })).optional(),
  mitreAttack: z.object({
    additionalTactics: z.array(
      z.enum([
        "TACTIC_UNSPECIFIED",
        "RECONNAISSANCE",
        "RESOURCE_DEVELOPMENT",
        "INITIAL_ACCESS",
        "EXECUTION",
        "PERSISTENCE",
        "PRIVILEGE_ESCALATION",
        "DEFENSE_EVASION",
        "CREDENTIAL_ACCESS",
        "DISCOVERY",
        "LATERAL_MOVEMENT",
        "COLLECTION",
        "COMMAND_AND_CONTROL",
        "EXFILTRATION",
        "IMPACT",
      ]),
    ).optional(),
    additionalTechniques: z.array(
      z.enum([
        "TECHNIQUE_UNSPECIFIED",
        "DATA_OBFUSCATION",
        "DATA_OBFUSCATION_STEGANOGRAPHY",
        "OS_CREDENTIAL_DUMPING",
        "OS_CREDENTIAL_DUMPING_PROC_FILESYSTEM",
        "OS_CREDENTIAL_DUMPING_ETC_PASSWORD_AND_ETC_SHADOW",
        "DATA_FROM_LOCAL_SYSTEM",
        "AUTOMATED_EXFILTRATION",
        "OBFUSCATED_FILES_OR_INFO",
        "STEGANOGRAPHY",
        "COMPILE_AFTER_DELIVERY",
        "COMMAND_OBFUSCATION",
        "SCHEDULED_TRANSFER",
        "SYSTEM_OWNER_USER_DISCOVERY",
        "MASQUERADING",
        "MATCH_LEGITIMATE_NAME_OR_LOCATION",
        "BOOT_OR_LOGON_INITIALIZATION_SCRIPTS",
        "STARTUP_ITEMS",
        "NETWORK_SERVICE_DISCOVERY",
        "SCHEDULED_TASK_JOB",
        "SCHEDULED_TASK_JOB_CRON",
        "CONTAINER_ORCHESTRATION_JOB",
        "PROCESS_INJECTION",
        "INPUT_CAPTURE",
        "INPUT_CAPTURE_KEYLOGGING",
        "PROCESS_DISCOVERY",
        "COMMAND_AND_SCRIPTING_INTERPRETER",
        "UNIX_SHELL",
        "PYTHON",
        "EXPLOITATION_FOR_PRIVILEGE_ESCALATION",
        "PERMISSION_GROUPS_DISCOVERY",
        "CLOUD_GROUPS",
        "INDICATOR_REMOVAL",
        "INDICATOR_REMOVAL_CLEAR_LINUX_OR_MAC_SYSTEM_LOGS",
        "INDICATOR_REMOVAL_CLEAR_COMMAND_HISTORY",
        "INDICATOR_REMOVAL_FILE_DELETION",
        "INDICATOR_REMOVAL_TIMESTOMP",
        "INDICATOR_REMOVAL_CLEAR_MAILBOX_DATA",
        "APPLICATION_LAYER_PROTOCOL",
        "DNS",
        "SOFTWARE_DEPLOYMENT_TOOLS",
        "VALID_ACCOUNTS",
        "DEFAULT_ACCOUNTS",
        "LOCAL_ACCOUNTS",
        "CLOUD_ACCOUNTS",
        "FILE_AND_DIRECTORY_DISCOVERY",
        "ACCOUNT_DISCOVERY_LOCAL_ACCOUNT",
        "PROXY",
        "EXTERNAL_PROXY",
        "MULTI_HOP_PROXY",
        "ACCOUNT_MANIPULATION",
        "ADDITIONAL_CLOUD_CREDENTIALS",
        "ADDITIONAL_CLOUD_ROLES",
        "SSH_AUTHORIZED_KEYS",
        "ADDITIONAL_CONTAINER_CLUSTER_ROLES",
        "MULTI_STAGE_CHANNELS",
        "INGRESS_TOOL_TRANSFER",
        "NATIVE_API",
        "BRUTE_FORCE",
        "AUTOMATED_COLLECTION",
        "SHARED_MODULES",
        "DATA_ENCODING",
        "STANDARD_ENCODING",
        "ACCESS_TOKEN_MANIPULATION",
        "TOKEN_IMPERSONATION_OR_THEFT",
        "CREATE_ACCOUNT",
        "LOCAL_ACCOUNT",
        "DEOBFUSCATE_DECODE_FILES_OR_INFO",
        "EXPLOIT_PUBLIC_FACING_APPLICATION",
        "SUPPLY_CHAIN_COMPROMISE",
        "COMPROMISE_SOFTWARE_DEPENDENCIES_AND_DEVELOPMENT_TOOLS",
        "EXPLOITATION_FOR_CLIENT_EXECUTION",
        "USER_EXECUTION",
        "EXPLOITATION_FOR_CREDENTIAL_ACCESS",
        "LINUX_AND_MAC_FILE_AND_DIRECTORY_PERMISSIONS_MODIFICATION",
        "DOMAIN_POLICY_MODIFICATION",
        "DATA_DESTRUCTION",
        "DATA_ENCRYPTED_FOR_IMPACT",
        "SERVICE_STOP",
        "INHIBIT_SYSTEM_RECOVERY",
        "FIRMWARE_CORRUPTION",
        "RESOURCE_HIJACKING",
        "NETWORK_DENIAL_OF_SERVICE",
        "CLOUD_SERVICE_DISCOVERY",
        "STEAL_APPLICATION_ACCESS_TOKEN",
        "ACCOUNT_ACCESS_REMOVAL",
        "TRANSFER_DATA_TO_CLOUD_ACCOUNT",
        "STEAL_WEB_SESSION_COOKIE",
        "CREATE_OR_MODIFY_SYSTEM_PROCESS",
        "EVENT_TRIGGERED_EXECUTION",
        "BOOT_OR_LOGON_AUTOSTART_EXECUTION",
        "KERNEL_MODULES_AND_EXTENSIONS",
        "SHORTCUT_MODIFICATION",
        "ABUSE_ELEVATION_CONTROL_MECHANISM",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SETUID_AND_SETGID",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SUDO_AND_SUDO_CACHING",
        "UNSECURED_CREDENTIALS",
        "CREDENTIALS_IN_FILES",
        "BASH_HISTORY",
        "PRIVATE_KEYS",
        "SUBVERT_TRUST_CONTROL",
        "INSTALL_ROOT_CERTIFICATE",
        "COMPROMISE_HOST_SOFTWARE_BINARY",
        "CREDENTIALS_FROM_PASSWORD_STORES",
        "MODIFY_AUTHENTICATION_PROCESS",
        "PLUGGABLE_AUTHENTICATION_MODULES",
        "MULTI_FACTOR_AUTHENTICATION",
        "IMPAIR_DEFENSES",
        "DISABLE_OR_MODIFY_TOOLS",
        "INDICATOR_BLOCKING",
        "DISABLE_OR_MODIFY_LINUX_AUDIT_SYSTEM",
        "HIDE_ARTIFACTS",
        "HIDDEN_FILES_AND_DIRECTORIES",
        "HIDDEN_USERS",
        "EXFILTRATION_OVER_WEB_SERVICE",
        "EXFILTRATION_TO_CLOUD_STORAGE",
        "DYNAMIC_RESOLUTION",
        "LATERAL_TOOL_TRANSFER",
        "HIJACK_EXECUTION_FLOW",
        "HIJACK_EXECUTION_FLOW_DYNAMIC_LINKER_HIJACKING",
        "MODIFY_CLOUD_COMPUTE_INFRASTRUCTURE",
        "CREATE_SNAPSHOT",
        "CLOUD_INFRASTRUCTURE_DISCOVERY",
        "DEVELOP_CAPABILITIES",
        "DEVELOP_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES",
        "OBTAIN_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES_VULNERABILITIES",
        "ACTIVE_SCANNING",
        "SCANNING_IP_BLOCKS",
        "STAGE_CAPABILITIES",
        "UPLOAD_MALWARE",
        "CONTAINER_ADMINISTRATION_COMMAND",
        "DEPLOY_CONTAINER",
        "ESCAPE_TO_HOST",
        "CONTAINER_AND_RESOURCE_DISCOVERY",
        "REFLECTIVE_CODE_LOADING",
        "STEAL_OR_FORGE_AUTHENTICATION_CERTIFICATES",
        "FINANCIAL_THEFT",
      ]),
    ).optional(),
    primaryTactic: z.enum([
      "TACTIC_UNSPECIFIED",
      "RECONNAISSANCE",
      "RESOURCE_DEVELOPMENT",
      "INITIAL_ACCESS",
      "EXECUTION",
      "PERSISTENCE",
      "PRIVILEGE_ESCALATION",
      "DEFENSE_EVASION",
      "CREDENTIAL_ACCESS",
      "DISCOVERY",
      "LATERAL_MOVEMENT",
      "COLLECTION",
      "COMMAND_AND_CONTROL",
      "EXFILTRATION",
      "IMPACT",
    ]).optional(),
    primaryTechniques: z.array(
      z.enum([
        "TECHNIQUE_UNSPECIFIED",
        "DATA_OBFUSCATION",
        "DATA_OBFUSCATION_STEGANOGRAPHY",
        "OS_CREDENTIAL_DUMPING",
        "OS_CREDENTIAL_DUMPING_PROC_FILESYSTEM",
        "OS_CREDENTIAL_DUMPING_ETC_PASSWORD_AND_ETC_SHADOW",
        "DATA_FROM_LOCAL_SYSTEM",
        "AUTOMATED_EXFILTRATION",
        "OBFUSCATED_FILES_OR_INFO",
        "STEGANOGRAPHY",
        "COMPILE_AFTER_DELIVERY",
        "COMMAND_OBFUSCATION",
        "SCHEDULED_TRANSFER",
        "SYSTEM_OWNER_USER_DISCOVERY",
        "MASQUERADING",
        "MATCH_LEGITIMATE_NAME_OR_LOCATION",
        "BOOT_OR_LOGON_INITIALIZATION_SCRIPTS",
        "STARTUP_ITEMS",
        "NETWORK_SERVICE_DISCOVERY",
        "SCHEDULED_TASK_JOB",
        "SCHEDULED_TASK_JOB_CRON",
        "CONTAINER_ORCHESTRATION_JOB",
        "PROCESS_INJECTION",
        "INPUT_CAPTURE",
        "INPUT_CAPTURE_KEYLOGGING",
        "PROCESS_DISCOVERY",
        "COMMAND_AND_SCRIPTING_INTERPRETER",
        "UNIX_SHELL",
        "PYTHON",
        "EXPLOITATION_FOR_PRIVILEGE_ESCALATION",
        "PERMISSION_GROUPS_DISCOVERY",
        "CLOUD_GROUPS",
        "INDICATOR_REMOVAL",
        "INDICATOR_REMOVAL_CLEAR_LINUX_OR_MAC_SYSTEM_LOGS",
        "INDICATOR_REMOVAL_CLEAR_COMMAND_HISTORY",
        "INDICATOR_REMOVAL_FILE_DELETION",
        "INDICATOR_REMOVAL_TIMESTOMP",
        "INDICATOR_REMOVAL_CLEAR_MAILBOX_DATA",
        "APPLICATION_LAYER_PROTOCOL",
        "DNS",
        "SOFTWARE_DEPLOYMENT_TOOLS",
        "VALID_ACCOUNTS",
        "DEFAULT_ACCOUNTS",
        "LOCAL_ACCOUNTS",
        "CLOUD_ACCOUNTS",
        "FILE_AND_DIRECTORY_DISCOVERY",
        "ACCOUNT_DISCOVERY_LOCAL_ACCOUNT",
        "PROXY",
        "EXTERNAL_PROXY",
        "MULTI_HOP_PROXY",
        "ACCOUNT_MANIPULATION",
        "ADDITIONAL_CLOUD_CREDENTIALS",
        "ADDITIONAL_CLOUD_ROLES",
        "SSH_AUTHORIZED_KEYS",
        "ADDITIONAL_CONTAINER_CLUSTER_ROLES",
        "MULTI_STAGE_CHANNELS",
        "INGRESS_TOOL_TRANSFER",
        "NATIVE_API",
        "BRUTE_FORCE",
        "AUTOMATED_COLLECTION",
        "SHARED_MODULES",
        "DATA_ENCODING",
        "STANDARD_ENCODING",
        "ACCESS_TOKEN_MANIPULATION",
        "TOKEN_IMPERSONATION_OR_THEFT",
        "CREATE_ACCOUNT",
        "LOCAL_ACCOUNT",
        "DEOBFUSCATE_DECODE_FILES_OR_INFO",
        "EXPLOIT_PUBLIC_FACING_APPLICATION",
        "SUPPLY_CHAIN_COMPROMISE",
        "COMPROMISE_SOFTWARE_DEPENDENCIES_AND_DEVELOPMENT_TOOLS",
        "EXPLOITATION_FOR_CLIENT_EXECUTION",
        "USER_EXECUTION",
        "EXPLOITATION_FOR_CREDENTIAL_ACCESS",
        "LINUX_AND_MAC_FILE_AND_DIRECTORY_PERMISSIONS_MODIFICATION",
        "DOMAIN_POLICY_MODIFICATION",
        "DATA_DESTRUCTION",
        "DATA_ENCRYPTED_FOR_IMPACT",
        "SERVICE_STOP",
        "INHIBIT_SYSTEM_RECOVERY",
        "FIRMWARE_CORRUPTION",
        "RESOURCE_HIJACKING",
        "NETWORK_DENIAL_OF_SERVICE",
        "CLOUD_SERVICE_DISCOVERY",
        "STEAL_APPLICATION_ACCESS_TOKEN",
        "ACCOUNT_ACCESS_REMOVAL",
        "TRANSFER_DATA_TO_CLOUD_ACCOUNT",
        "STEAL_WEB_SESSION_COOKIE",
        "CREATE_OR_MODIFY_SYSTEM_PROCESS",
        "EVENT_TRIGGERED_EXECUTION",
        "BOOT_OR_LOGON_AUTOSTART_EXECUTION",
        "KERNEL_MODULES_AND_EXTENSIONS",
        "SHORTCUT_MODIFICATION",
        "ABUSE_ELEVATION_CONTROL_MECHANISM",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SETUID_AND_SETGID",
        "ABUSE_ELEVATION_CONTROL_MECHANISM_SUDO_AND_SUDO_CACHING",
        "UNSECURED_CREDENTIALS",
        "CREDENTIALS_IN_FILES",
        "BASH_HISTORY",
        "PRIVATE_KEYS",
        "SUBVERT_TRUST_CONTROL",
        "INSTALL_ROOT_CERTIFICATE",
        "COMPROMISE_HOST_SOFTWARE_BINARY",
        "CREDENTIALS_FROM_PASSWORD_STORES",
        "MODIFY_AUTHENTICATION_PROCESS",
        "PLUGGABLE_AUTHENTICATION_MODULES",
        "MULTI_FACTOR_AUTHENTICATION",
        "IMPAIR_DEFENSES",
        "DISABLE_OR_MODIFY_TOOLS",
        "INDICATOR_BLOCKING",
        "DISABLE_OR_MODIFY_LINUX_AUDIT_SYSTEM",
        "HIDE_ARTIFACTS",
        "HIDDEN_FILES_AND_DIRECTORIES",
        "HIDDEN_USERS",
        "EXFILTRATION_OVER_WEB_SERVICE",
        "EXFILTRATION_TO_CLOUD_STORAGE",
        "DYNAMIC_RESOLUTION",
        "LATERAL_TOOL_TRANSFER",
        "HIJACK_EXECUTION_FLOW",
        "HIJACK_EXECUTION_FLOW_DYNAMIC_LINKER_HIJACKING",
        "MODIFY_CLOUD_COMPUTE_INFRASTRUCTURE",
        "CREATE_SNAPSHOT",
        "CLOUD_INFRASTRUCTURE_DISCOVERY",
        "DEVELOP_CAPABILITIES",
        "DEVELOP_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES",
        "OBTAIN_CAPABILITIES_MALWARE",
        "OBTAIN_CAPABILITIES_VULNERABILITIES",
        "ACTIVE_SCANNING",
        "SCANNING_IP_BLOCKS",
        "STAGE_CAPABILITIES",
        "UPLOAD_MALWARE",
        "CONTAINER_ADMINISTRATION_COMMAND",
        "DEPLOY_CONTAINER",
        "ESCAPE_TO_HOST",
        "CONTAINER_AND_RESOURCE_DISCOVERY",
        "REFLECTIVE_CODE_LOADING",
        "STEAL_OR_FORGE_AUTHENTICATION_CERTIFICATES",
        "FINANCIAL_THEFT",
      ]),
    ).optional(),
    version: z.string().optional(),
  }).optional(),
  moduleName: z.string().optional(),
  mute: z.enum(["MUTE_UNSPECIFIED", "MUTED", "UNMUTED", "UNDEFINED"])
    .optional(),
  muteInfo: z.object({
    dynamicMuteRecords: z.array(z.object({
      matchTime: z.string().optional(),
      muteConfig: z.string().optional(),
    })).optional(),
    staticMute: z.object({
      applyTime: z.string().optional(),
      state: z.enum(["MUTE_UNSPECIFIED", "MUTED", "UNMUTED", "UNDEFINED"])
        .optional(),
    }).optional(),
  }).optional(),
  muteInitiator: z.string().optional(),
  muteUpdateTime: z.string().optional(),
  name: z.string().optional(),
  networks: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  nextSteps: z.string().optional(),
  notebook: z.object({
    lastAuthor: z.string().optional(),
    name: z.string().optional(),
    notebookUpdateTime: z.string().optional(),
    service: z.string().optional(),
  }).optional(),
  orgPolicies: z.array(z.object({
    name: z.string().optional(),
  })).optional(),
  parent: z.string().optional(),
  parentDisplayName: z.string().optional(),
  policyViolationSummary: z.object({
    conformantResourcesCount: z.string().optional(),
    evaluationErrorsCount: z.string().optional(),
    outOfScopeResourcesCount: z.string().optional(),
    policyViolationsCount: z.string().optional(),
  }).optional(),
  processes: z.array(z.object({
    args: z.array(z.string()).optional(),
    argumentsTruncated: z.boolean().optional(),
    binary: z.object({
      contents: z.string().optional(),
      diskPath: z.object({
        partitionUuid: z.string().optional(),
        relativePath: z.string().optional(),
      }).optional(),
      fileLoadState: z.enum([
        "FILE_LOAD_STATE_UNSPECIFIED",
        "LOADED_BY_PROCESS",
        "NOT_LOADED_BY_PROCESS",
      ]).optional(),
      hashedSize: z.string().optional(),
      operations: z.array(z.object({
        type: z.unknown().optional(),
      })).optional(),
      partiallyHashed: z.boolean().optional(),
      path: z.string().optional(),
      sha256: z.string().optional(),
      size: z.string().optional(),
    }).optional(),
    envVariables: z.array(z.object({
      name: z.string().optional(),
      val: z.string().optional(),
    })).optional(),
    envVariablesTruncated: z.boolean().optional(),
    libraries: z.array(z.object({
      contents: z.string().optional(),
      diskPath: z.object({
        partitionUuid: z.unknown().optional(),
        relativePath: z.unknown().optional(),
      }).optional(),
      fileLoadState: z.enum([
        "FILE_LOAD_STATE_UNSPECIFIED",
        "LOADED_BY_PROCESS",
        "NOT_LOADED_BY_PROCESS",
      ]).optional(),
      hashedSize: z.string().optional(),
      operations: z.array(z.unknown()).optional(),
      partiallyHashed: z.boolean().optional(),
      path: z.string().optional(),
      sha256: z.string().optional(),
      size: z.string().optional(),
    })).optional(),
    name: z.string().optional(),
    parentPid: z.string().optional(),
    pid: z.string().optional(),
    script: z.object({
      contents: z.string().optional(),
      diskPath: z.object({
        partitionUuid: z.string().optional(),
        relativePath: z.string().optional(),
      }).optional(),
      fileLoadState: z.enum([
        "FILE_LOAD_STATE_UNSPECIFIED",
        "LOADED_BY_PROCESS",
        "NOT_LOADED_BY_PROCESS",
      ]).optional(),
      hashedSize: z.string().optional(),
      operations: z.array(z.object({
        type: z.unknown().optional(),
      })).optional(),
      partiallyHashed: z.boolean().optional(),
      path: z.string().optional(),
      sha256: z.string().optional(),
      size: z.string().optional(),
    }).optional(),
    userId: z.string().optional(),
  })).optional(),
  resourceName: z.string().optional(),
  secret: z.object({
    environmentVariable: z.object({
      key: z.string().optional(),
    }).optional(),
    filePath: z.object({
      path: z.string().optional(),
    }).optional(),
    status: z.object({
      lastUpdatedTime: z.string().optional(),
      validity: z.enum([
        "SECRET_VALIDITY_UNSPECIFIED",
        "SECRET_VALIDITY_UNSUPPORTED",
        "SECRET_VALIDITY_FAILED",
        "SECRET_VALIDITY_INVALID",
        "SECRET_VALIDITY_VALID",
      ]).optional(),
    }).optional(),
    type: z.string().optional(),
  }).optional(),
  securityMarks: z.object({
    canonicalName: z.string().optional(),
    marks: z.record(z.string(), z.string()).optional(),
    name: z.string().optional(),
  }).optional(),
  securityPosture: z.object({
    changedPolicy: z.string().optional(),
    name: z.string().optional(),
    policy: z.string().optional(),
    policyDriftDetails: z.array(z.object({
      detectedValue: z.string().optional(),
      expectedValue: z.string().optional(),
      field: z.string().optional(),
    })).optional(),
    policySet: z.string().optional(),
    postureDeployment: z.string().optional(),
    postureDeploymentResource: z.string().optional(),
    revisionId: z.string().optional(),
  }).optional(),
  severity: z.enum([
    "SEVERITY_UNSPECIFIED",
    "CRITICAL",
    "HIGH",
    "MEDIUM",
    "LOW",
  ]).optional(),
  sourceProperties: z.record(z.string(), z.string()).optional(),
  state: z.enum(["STATE_UNSPECIFIED", "ACTIVE", "INACTIVE"]).optional(),
  toxicCombination: z.object({
    attackExposureScore: z.number().optional(),
    relatedFindings: z.array(z.string()).optional(),
  }).optional(),
  vertexAi: z.object({
    datasets: z.array(z.object({
      displayName: z.string().optional(),
      name: z.string().optional(),
      source: z.string().optional(),
    })).optional(),
    pipelines: z.array(z.object({
      displayName: z.string().optional(),
      name: z.string().optional(),
    })).optional(),
  }).optional(),
  vulnerability: z.object({
    cve: z.object({
      cvssv3: z.object({
        attackComplexity: z.enum([
          "ATTACK_COMPLEXITY_UNSPECIFIED",
          "ATTACK_COMPLEXITY_LOW",
          "ATTACK_COMPLEXITY_HIGH",
        ]).optional(),
        attackVector: z.enum([
          "ATTACK_VECTOR_UNSPECIFIED",
          "ATTACK_VECTOR_NETWORK",
          "ATTACK_VECTOR_ADJACENT",
          "ATTACK_VECTOR_LOCAL",
          "ATTACK_VECTOR_PHYSICAL",
        ]).optional(),
        availabilityImpact: z.enum([
          "IMPACT_UNSPECIFIED",
          "IMPACT_HIGH",
          "IMPACT_LOW",
          "IMPACT_NONE",
        ]).optional(),
        baseScore: z.number().optional(),
        confidentialityImpact: z.enum([
          "IMPACT_UNSPECIFIED",
          "IMPACT_HIGH",
          "IMPACT_LOW",
          "IMPACT_NONE",
        ]).optional(),
        integrityImpact: z.enum([
          "IMPACT_UNSPECIFIED",
          "IMPACT_HIGH",
          "IMPACT_LOW",
          "IMPACT_NONE",
        ]).optional(),
        privilegesRequired: z.enum([
          "PRIVILEGES_REQUIRED_UNSPECIFIED",
          "PRIVILEGES_REQUIRED_NONE",
          "PRIVILEGES_REQUIRED_LOW",
          "PRIVILEGES_REQUIRED_HIGH",
        ]).optional(),
        scope: z.enum(["SCOPE_UNSPECIFIED", "SCOPE_UNCHANGED", "SCOPE_CHANGED"])
          .optional(),
        userInteraction: z.enum([
          "USER_INTERACTION_UNSPECIFIED",
          "USER_INTERACTION_NONE",
          "USER_INTERACTION_REQUIRED",
        ]).optional(),
      }).optional(),
      exploitReleaseDate: z.string().optional(),
      exploitationActivity: z.enum([
        "EXPLOITATION_ACTIVITY_UNSPECIFIED",
        "WIDE",
        "CONFIRMED",
        "AVAILABLE",
        "ANTICIPATED",
        "NO_KNOWN",
      ]).optional(),
      firstExploitationDate: z.string().optional(),
      id: z.string().optional(),
      impact: z.enum([
        "RISK_RATING_UNSPECIFIED",
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL",
      ]).optional(),
      observedInTheWild: z.boolean().optional(),
      references: z.array(z.object({
        source: z.string().optional(),
        uri: z.string().optional(),
      })).optional(),
      upstreamFixAvailable: z.boolean().optional(),
      zeroDay: z.boolean().optional(),
    }).optional(),
    cwes: z.array(z.object({
      id: z.string().optional(),
      references: z.array(z.object({
        source: z.unknown().optional(),
        uri: z.unknown().optional(),
      })).optional(),
    })).optional(),
    fixedPackage: z.object({
      cpeUri: z.string().optional(),
      packageName: z.string().optional(),
      packageType: z.string().optional(),
      packageVersion: z.string().optional(),
    }).optional(),
    offendingPackage: z.object({
      cpeUri: z.string().optional(),
      packageName: z.string().optional(),
      packageType: z.string().optional(),
      packageVersion: z.string().optional(),
    }).optional(),
    providerRiskScore: z.string().optional(),
    reachable: z.boolean().optional(),
    securityBulletin: z.object({
      bulletinId: z.string().optional(),
      submissionTime: z.string().optional(),
      suggestedUpgradeVersion: z.string().optional(),
    }).optional(),
  }).optional(),
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

/** Swamp extension model for Google Cloud Security Command Center Sources.Findings. Registered at `@swamp/gcp/securitycenter/sources-findings`. */
export const model = {
  type: "@swamp/gcp/securitycenter/sources-findings",
  version: "2026.09.17.2",
  upgrades: [
    {
      toVersion: "2026.03.31.1",
      description: "Added: agentDataAccessEvents, policyViolationSummary",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.01.1",
      description: "Added: discoveredWorkload",
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
      toVersion: "2026.04.03.2",
      description: "Added: discoveredWorkload",
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
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.01.1",
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
      toVersion: "2026.05.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.31.1",
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
      toVersion: "2026.06.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.27.1",
      description: "Added: iamDetails",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.15.1",
      description: "Added: agent, agentAnomaly, agentSessions",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
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
      description: "Added: agent, agentAnomaly, agentSessions, iamDetails",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.3",
      description: "Added: agent, agentAnomaly, agentSessions, iamDetails",
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
      toVersion: "2026.09.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "GCP securitycenter Sources.Findings resource",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    get: {
      description: "Get a findings",
      arguments: z.object({
        identifier: z.string().describe("The name of the findings"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
        const result = await readViaList(
          baseUrl,
          LIST_CONFIG,
          params,
          "name",
          args.identifier,
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
      description: "Update findings attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific findings by name (e.g. one discovered by list)",
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
        params["name"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["access"] !== undefined) body["access"] = g["access"];
        if (g["affectedResources"] !== undefined) {
          body["affectedResources"] = g["affectedResources"];
        }
        if (g["agent"] !== undefined) body["agent"] = g["agent"];
        if (g["agentAnomaly"] !== undefined) {
          body["agentAnomaly"] = g["agentAnomaly"];
        }
        if (g["agentDataAccessEvents"] !== undefined) {
          body["agentDataAccessEvents"] = g["agentDataAccessEvents"];
        }
        if (g["agentSessions"] !== undefined) {
          body["agentSessions"] = g["agentSessions"];
        }
        if (g["aiModel"] !== undefined) body["aiModel"] = g["aiModel"];
        if (g["application"] !== undefined) {
          body["application"] = g["application"];
        }
        if (g["artifactGuardPolicies"] !== undefined) {
          body["artifactGuardPolicies"] = g["artifactGuardPolicies"];
        }
        if (g["attackExposure"] !== undefined) {
          body["attackExposure"] = g["attackExposure"];
        }
        if (g["backupDisasterRecovery"] !== undefined) {
          body["backupDisasterRecovery"] = g["backupDisasterRecovery"];
        }
        if (g["canonicalName"] !== undefined) {
          body["canonicalName"] = g["canonicalName"];
        }
        if (g["category"] !== undefined) body["category"] = g["category"];
        if (g["chokepoint"] !== undefined) body["chokepoint"] = g["chokepoint"];
        if (g["cloudArmor"] !== undefined) body["cloudArmor"] = g["cloudArmor"];
        if (g["cloudDlpDataProfile"] !== undefined) {
          body["cloudDlpDataProfile"] = g["cloudDlpDataProfile"];
        }
        if (g["cloudDlpInspection"] !== undefined) {
          body["cloudDlpInspection"] = g["cloudDlpInspection"];
        }
        if (g["complianceDetails"] !== undefined) {
          body["complianceDetails"] = g["complianceDetails"];
        }
        if (g["compliances"] !== undefined) {
          body["compliances"] = g["compliances"];
        }
        if (g["connections"] !== undefined) {
          body["connections"] = g["connections"];
        }
        if (g["contacts"] !== undefined) body["contacts"] = g["contacts"];
        if (g["containers"] !== undefined) body["containers"] = g["containers"];
        if (g["createTime"] !== undefined) body["createTime"] = g["createTime"];
        if (g["dataAccessEvents"] !== undefined) {
          body["dataAccessEvents"] = g["dataAccessEvents"];
        }
        if (g["dataFlowEvents"] !== undefined) {
          body["dataFlowEvents"] = g["dataFlowEvents"];
        }
        if (g["dataRetentionDeletionEvents"] !== undefined) {
          body["dataRetentionDeletionEvents"] =
            g["dataRetentionDeletionEvents"];
        }
        if (g["database"] !== undefined) body["database"] = g["database"];
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["discoveredWorkload"] !== undefined) {
          body["discoveredWorkload"] = g["discoveredWorkload"];
        }
        if (g["disk"] !== undefined) body["disk"] = g["disk"];
        if (g["eventTime"] !== undefined) body["eventTime"] = g["eventTime"];
        if (g["exfiltration"] !== undefined) {
          body["exfiltration"] = g["exfiltration"];
        }
        if (g["externalExposure"] !== undefined) {
          body["externalExposure"] = g["externalExposure"];
        }
        if (g["externalSystems"] !== undefined) {
          body["externalSystems"] = g["externalSystems"];
        }
        if (g["externalUri"] !== undefined) {
          body["externalUri"] = g["externalUri"];
        }
        if (g["files"] !== undefined) body["files"] = g["files"];
        if (g["findingClass"] !== undefined) {
          body["findingClass"] = g["findingClass"];
        }
        if (g["groupMemberships"] !== undefined) {
          body["groupMemberships"] = g["groupMemberships"];
        }
        if (g["iamBindings"] !== undefined) {
          body["iamBindings"] = g["iamBindings"];
        }
        if (g["iamDetails"] !== undefined) body["iamDetails"] = g["iamDetails"];
        if (g["indicator"] !== undefined) body["indicator"] = g["indicator"];
        if (g["ipRules"] !== undefined) body["ipRules"] = g["ipRules"];
        if (g["job"] !== undefined) body["job"] = g["job"];
        if (g["kernelRootkit"] !== undefined) {
          body["kernelRootkit"] = g["kernelRootkit"];
        }
        if (g["kubernetes"] !== undefined) body["kubernetes"] = g["kubernetes"];
        if (g["loadBalancers"] !== undefined) {
          body["loadBalancers"] = g["loadBalancers"];
        }
        if (g["logEntries"] !== undefined) body["logEntries"] = g["logEntries"];
        if (g["mitreAttack"] !== undefined) {
          body["mitreAttack"] = g["mitreAttack"];
        }
        if (g["moduleName"] !== undefined) body["moduleName"] = g["moduleName"];
        if (g["mute"] !== undefined) body["mute"] = g["mute"];
        if (g["muteInfo"] !== undefined) body["muteInfo"] = g["muteInfo"];
        if (g["muteInitiator"] !== undefined) {
          body["muteInitiator"] = g["muteInitiator"];
        }
        if (g["muteUpdateTime"] !== undefined) {
          body["muteUpdateTime"] = g["muteUpdateTime"];
        }
        if (g["networks"] !== undefined) body["networks"] = g["networks"];
        if (g["nextSteps"] !== undefined) body["nextSteps"] = g["nextSteps"];
        if (g["notebook"] !== undefined) body["notebook"] = g["notebook"];
        if (g["orgPolicies"] !== undefined) {
          body["orgPolicies"] = g["orgPolicies"];
        }
        if (g["parentDisplayName"] !== undefined) {
          body["parentDisplayName"] = g["parentDisplayName"];
        }
        if (g["policyViolationSummary"] !== undefined) {
          body["policyViolationSummary"] = g["policyViolationSummary"];
        }
        if (g["processes"] !== undefined) body["processes"] = g["processes"];
        if (g["resourceName"] !== undefined) {
          body["resourceName"] = g["resourceName"];
        }
        if (g["secret"] !== undefined) body["secret"] = g["secret"];
        if (g["securityMarks"] !== undefined) {
          body["securityMarks"] = g["securityMarks"];
        }
        if (g["securityPosture"] !== undefined) {
          body["securityPosture"] = g["securityPosture"];
        }
        if (g["severity"] !== undefined) body["severity"] = g["severity"];
        if (g["sourceProperties"] !== undefined) {
          body["sourceProperties"] = g["sourceProperties"];
        }
        if (g["state"] !== undefined) body["state"] = g["state"];
        if (g["toxicCombination"] !== undefined) {
          body["toxicCombination"] = g["toxicCombination"];
        }
        if (g["vertexAi"] !== undefined) body["vertexAi"] = g["vertexAi"];
        if (g["vulnerability"] !== undefined) {
          body["vulnerability"] = g["vulnerability"];
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
          undefined,
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
    sync: {
      description: "Sync findings state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific findings by name (e.g. one discovered by list)",
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
          if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
          else if (existing["parent"]) {
            params["parent"] = String(existing["parent"]);
          }
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          const result = await readViaList(
            baseUrl,
            LIST_CONFIG,
            params,
            "name",
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
      description: "List findings resources",
      arguments: z.object({
        fieldMask: z.string().optional(),
        filter: z.string().optional(),
        orderBy: z.string().optional(),
        pageSize: z.number().optional(),
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
        if (args["fieldMask"] !== undefined) {
          params["fieldMask"] = String(args["fieldMask"]);
        }
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
          "listFindingsResults",
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
    group: {
      description: "group",
      arguments: z.object({
        compareDuration: z.any().optional(),
        filter: z.any().optional(),
        groupBy: z.any().optional(),
        pageSize: z.any().optional(),
        pageToken: z.any().optional(),
        readTime: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["parent"] !== undefined) params["parent"] = String(g["parent"]);
        const body: Record<string, unknown> = {};
        if (args["compareDuration"] !== undefined) {
          body["compareDuration"] = args["compareDuration"];
        }
        if (args["filter"] !== undefined) body["filter"] = args["filter"];
        if (args["groupBy"] !== undefined) body["groupBy"] = args["groupBy"];
        if (args["pageSize"] !== undefined) body["pageSize"] = args["pageSize"];
        if (args["pageToken"] !== undefined) {
          body["pageToken"] = args["pageToken"];
        }
        if (args["readTime"] !== undefined) body["readTime"] = args["readTime"];
        const result = await createResource(
          baseUrl,
          {
            "id": "securitycenter.folders.sources.findings.group",
            "path": "v1/{+parent}/findings:group",
            "httpMethod": "POST",
            "parameterOrder": ["parent"],
            "parameters": {
              "parent": { "location": "path", "required": true },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    set_mute: {
      description: "set mute",
      arguments: z.object({
        mute: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const body: Record<string, unknown> = {};
        if (args["mute"] !== undefined) body["mute"] = args["mute"];
        const result = await createResource(
          baseUrl,
          {
            "id": "securitycenter.folders.sources.findings.setMute",
            "path": "v1/{+name}:setMute",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    set_state: {
      description: "set state",
      arguments: z.object({
        startTime: z.any().optional(),
        state: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        const body: Record<string, unknown> = {};
        if (args["startTime"] !== undefined) {
          body["startTime"] = args["startTime"];
        }
        if (args["state"] !== undefined) body["state"] = args["state"];
        const result = await createResource(
          baseUrl,
          {
            "id": "securitycenter.folders.sources.findings.setState",
            "path": "v1/{+name}:setState",
            "httpMethod": "POST",
            "parameterOrder": ["name"],
            "parameters": { "name": { "location": "path", "required": true } },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    update_security_marks: {
      description: "update security marks",
      arguments: z.object({
        canonicalName: z.any().optional(),
        marks: z.any().optional(),
        name: z.any().optional(),
        startTime: z.any().optional(),
        updateMask: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        if (args["startTime"] !== undefined) {
          params["startTime"] = String(args["startTime"]);
        }
        if (args["updateMask"] !== undefined) {
          params["updateMask"] = String(args["updateMask"]);
        }
        const body: Record<string, unknown> = {};
        if (args["canonicalName"] !== undefined) {
          body["canonicalName"] = args["canonicalName"];
        }
        if (args["marks"] !== undefined) body["marks"] = args["marks"];
        if (args["name"] !== undefined) body["name"] = args["name"];
        const result = await createResource(
          baseUrl,
          {
            "id": "securitycenter.folders.sources.findings.updateSecurityMarks",
            "path": "v1/{+name}",
            "httpMethod": "PATCH",
            "parameterOrder": ["name"],
            "parameters": {
              "name": { "location": "path", "required": true },
              "startTime": { "location": "query" },
              "updateMask": { "location": "query" },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    ...inventoryFindingsMethods,
  },
};
