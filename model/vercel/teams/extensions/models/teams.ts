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

// Auto-generated extension model for @swamp/vercel/teams/teams
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Teams.
 *
 * Wraps the Vercel API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  create,
  listAll,
  read,
  remove,
  tryRead,
  update,
} from "./_lib/vercel.ts";

const GlobalArgsSchema = z.object({
  teamId: z.string().optional().describe("Vercel team ID"),
  slug: z.string().optional().describe(
    "Vercel team slug (alternative to teamId)",
  ),
  avatar: z.string().max(40).regex(new RegExp("^[0-9a-f]+$")).describe(
    "The hash value of an uploaded image, or `null` to clear the avatar.",
  ).optional(),
  description: z.string().max(140).describe(
    "A short text that describes the team.",
  ).optional(),
  emailDomain: z.string().optional(),
  name: z.string().max(256).describe(
    "The desired name for the Team. It will be generated from the provided slug if nothing is provided",
  ).optional(),
  previewDeploymentSuffix: z.string().describe(
    "Suffix that will be used for all preview deployments.",
  ).optional(),
  regenerateInviteCode: z.boolean().describe(
    "Create a new invite code and replace the current one.",
  ).optional(),
  saml: z.object({
    enforced: z.boolean().optional(),
    roles: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  enablePreviewFeedback: z.string().describe(
    "Enable preview toolbar: one of on, off or default.",
  ).optional(),
  enableProductionFeedback: z.string().describe(
    "Enable production toolbar: one of on, off or default.",
  ).optional(),
  sensitiveEnvironmentVariablePolicy: z.string().describe(
    "Sensitive environment variable policy: one of on, off or default.",
  ).optional(),
  disjunctiveProductionSecretPolicy: z.string().describe(
    "Require production secrets to be in their own environment group: one of on, off or default.",
  ).optional(),
  remoteCaching: z.object({
    enabled: z.boolean().optional(),
  }).describe("Whether or not remote caching is enabled for the team")
    .optional(),
  hideIpAddresses: z.boolean().describe(
    "Display or hide IP addresses in Monitoring queries.",
  ).optional(),
  hideIpAddressesInLogDrains: z.boolean().describe(
    "Display or hide IP addresses in Log Drains.",
  ).optional(),
  dpAccessRequestsMode: z.enum(["all", "none", "email-domain"]).describe(
    "Controls who can request access to protected deployments.",
  ).optional(),
  requireVerifiedCommits: z.boolean().describe(
    "When enabled, all projects in the team require commits to be signed and verified by the git provider before deployments will be created.",
  ).optional(),
  disableRepositoryDispatchEvents: z.boolean().describe(
    "Default for projects in the team. When `true`, projects in this team will not emit GitHub repository-dispatch events on deployment events unless the project explicitly overrides this setting.",
  ).optional(),
  defaultDeploymentProtection: z.object({
    passwordProtection: z.object({
      deploymentType: z.enum([
        "all",
        "preview",
        "prod_deployment_urls_and_all_previews",
        "all_except_custom_domains",
      ]),
      password: z.string().max(72).optional(),
    }).optional(),
    ssoProtection: z.object({
      deploymentType: z.enum([
        "all",
        "preview",
        "prod_deployment_urls_and_all_previews",
        "all_except_custom_domains",
      ]),
    }).optional(),
  }).describe("Default deployment protection settings for new projects.")
    .optional(),
  defaultPassport: z.object({
    connectorId: z.string(),
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]).optional(),
  }).describe("Default Passport configuration for new projects.").optional(),
  defaultExpirationSettings: z.object({
    expiration: z.enum([
      "3y",
      "2y",
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
    expirationProduction: z.enum([
      "3y",
      "2y",
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
    expirationCanceled: z.enum([
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
    expirationErrored: z.enum([
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
  }).optional(),
  deploymentPolicy: z.object({
    gitSources: z.array(z.object({
      enabled: z.boolean(),
      environments: z.array(z.object({
        type: z.enum(["system"]),
        target: z.enum(["production", "preview"]),
      })),
      sources: z.array(z.object({
        provider: z.enum(["github", "bitbucket"]),
        org: z.string(),
        repo: z.string().optional(),
      })),
    })).optional(),
    deploymentSources: z.array(z.object({
      enabled: z.boolean(),
      environments: z.array(z.object({
        type: z.enum(["system"]),
        target: z.enum(["production", "preview"]),
      })),
      sources: z.array(
        z.enum(["git", "cli", "rest-api", "deploy-hook", "integration", "v0"]),
      ),
    })).optional(),
  }).describe(
    "Composable deployment-time policy. Each rule type holds a list of rules, one per environment scope.",
  ).optional(),
  strictDeploymentProtectionSettings: z.object({
    enabled: z.boolean(),
  }).describe(
    "When enabled, deployment protection settings require stricter permissions (owner-only).",
  ).optional(),
  strictShareableLinks: z.object({
    enabled: z.boolean(),
  }).describe("When enabled, creating shareable links requires Owner role.")
    .optional(),
  strictPasswordProtectionSettings: z.object({
    enabled: z.boolean(),
  }).describe(
    "When enabled, adding, changing, or removing project password protection requires Owner role.",
  ).optional(),
  strictConnectors: z.object({
    enabled: z.boolean(),
  }).describe(
    "When enabled, creating and managing connectors requires Owner role.",
  ).optional(),
  nsnbConfig: z.object({
    preference: z.enum(["auto-approval", "manual-approval", "block"]),
  }).describe("NSNB configuration for the team.").optional(),
  defaultProjectJobs: z.object({
    lint: z.object({
      targets: z.array(z.string()),
    }).optional(),
    typecheck: z.object({
      targets: z.array(z.string()),
    }).optional(),
  }).describe(
    "Default job configuration applied to new projects created in this team.",
  ).optional(),
  resourceConfig: z.object({
    buildMachine: z.object({
      default: z.enum(["basic", "enhanced", "turbo", "standard", "elastic"])
        .optional(),
    }).optional(),
  }).describe("Resource configuration for the team.").optional(),
  attribution: z.object({
    sessionReferrer: z.string().optional(),
    landingPage: z.string().optional(),
    pageBeforeConversionPage: z.string().optional(),
    utm: z.object({
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmTerm: z.string().optional(),
    }).optional(),
  }).describe("Attribution information for the session or current page")
    .optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  apiKeysInvalidatedAt: z.number().nullable().optional(),
  appTokensInvalidatedAt: z.number().nullable().optional(),
  avatar: z.string().nullable().optional(),
  billing: z.object({
    plan: z.string().optional(),
  }).nullable().optional(),
  connect: z.object({
    enabled: z.boolean().optional(),
  }).nullable().optional(),
  createdAt: z.number().nullable().optional(),
  creatorId: z.string().nullable().optional(),
  defaultDeploymentProtection: z.object({
    passwordProtection: z.object({
      deploymentType: z.string().optional(),
    }).optional(),
    ssoProtection: z.object({
      deploymentType: z.string().optional(),
    }).optional(),
  }).nullable().optional(),
  defaultExpirationSettings: z.object({
    deploymentsToKeep: z.number().optional(),
    expirationDays: z.number().optional(),
    expirationDaysCanceled: z.number().optional(),
    expirationDaysErrored: z.number().optional(),
    expirationDaysProduction: z.number().optional(),
  }).nullable().optional(),
  defaultPassport: z.object({
    connectorId: z.string().optional(),
    deploymentType: z.string().optional(),
  }).nullable().optional(),
  defaultProjectJobs: z.object({
    lint: z.object({
      targets: z.array(z.string()).optional(),
    }).optional(),
    "mfe-config-present": z.object({
      targets: z.array(z.string()).optional(),
    }).optional(),
    typecheck: z.object({
      targets: z.array(z.string()).optional(),
    }).optional(),
  }).nullable().optional(),
  defaultRoles: z.object({
    teamPermissions: z.array(z.string()).optional(),
    teamRoles: z.array(z.string()).optional(),
  }).nullable().optional(),
  deploymentPolicy: z.object({
    deploymentSources: z.array(z.object({
      enabled: z.boolean().optional(),
      environments: z.array(z.object({
        target: z.string().optional(),
        type: z.string().optional(),
      })).optional(),
      sources: z.array(z.string()).optional(),
    })).optional(),
    gitSources: z.array(z.object({
      enabled: z.boolean().optional(),
      environments: z.array(z.object({
        target: z.string().optional(),
        type: z.string().optional(),
      })).optional(),
      sources: z.array(z.object({
        org: z.string().optional(),
        provider: z.string().optional(),
        repo: z.string().optional(),
      })).optional(),
    })).optional(),
  }).nullable().optional(),
  description: z.string().nullable().optional(),
  disableHardAutoBlocks: z.number().nullable().optional(),
  disableRepositoryDispatchEvents: z.boolean().nullable().optional(),
  disjunctiveProductionSecretPolicy: z.string().nullable().optional(),
  dpAccessRequestsMode: z.string().nullable().optional(),
  emailDomain: z.string().nullable().optional(),
  enablePreviewFeedback: z.string().nullable().optional(),
  enableProductionFeedback: z.string().nullable().optional(),
  hideIpAddresses: z.boolean().nullable().optional(),
  hideIpAddressesInLogDrains: z.boolean().nullable().optional(),
  id: z.string(),
  integrationTokensInvalidatedAt: z.number().nullable().optional(),
  inviteCode: z.string().nullable().optional(),
  ipBuckets: z.array(z.object({
    bucket: z.string().optional(),
    default: z.boolean().optional(),
    supportUntil: z.number().optional(),
  })).nullable().optional(),
  membership: z.object({
    accessRequestedAt: z.number().optional(),
    confirmed: z.boolean().optional(),
    created: z.number().optional(),
    createdAt: z.number().optional(),
    entitlements: z.array(z.object({
      entitlement: z.string().optional(),
    })).optional(),
    joinedFrom: z.object({
      commitId: z.string().optional(),
      dsyncConnectedAt: z.number().optional(),
      dsyncUserId: z.string().optional(),
      gitUserId: z.string().optional(),
      gitUserLogin: z.string().optional(),
      idpUserId: z.string().optional(),
      origin: z.string().optional(),
      repoId: z.string().optional(),
      repoPath: z.string().optional(),
      ssoConnectedAt: z.number().optional(),
      ssoUserId: z.string().optional(),
    }).optional(),
    role: z.string().optional(),
    teamId: z.string().optional(),
    teamPermissions: z.array(z.string()).optional(),
    teamRoles: z.array(z.string()).optional(),
    uid: z.string().optional(),
  }).nullable().optional(),
  name: z.string().nullable().optional(),
  nsnbConfig: z.object({
    preference: z.string().optional(),
  }).nullable().optional(),
  orgRootTeamId: z.string().nullable().optional(),
  parentId: z.string().nullable().optional(),
  personalAccessTokensInvalidatedAt: z.number().nullable().optional(),
  platform: z.boolean().nullable().optional(),
  previewDeploymentSuffix: z.string().nullable().optional(),
  remoteCaching: z.object({
    enabled: z.boolean().optional(),
  }).nullable().optional(),
  requireVerifiedCommits: z.boolean().nullable().optional(),
  resourceConfig: z.object({
    blobStores: z.number().optional(),
    buildEntitlements: z.object({
      enhancedBuilds: z.boolean().optional(),
    }).optional(),
    buildMachine: z.object({
      default: z.string().optional(),
    }).optional(),
    concurrentBuilds: z.number().optional(),
    customEnvironmentsPerProject: z.number().optional(),
    edgeConfigs: z.number().optional(),
    edgeConfigSize: z.number().optional(),
    elasticConcurrencyEnabled: z.boolean().optional(),
    kvDatabases: z.number().optional(),
    postgresDatabases: z.number().optional(),
    serverlessFunctionMaxMemorySize: z.number().optional(),
  }).nullable().optional(),
  saml: z.object({
    connection: z.object({
      connectedAt: z.number().optional(),
      lastReceivedWebhookEvent: z.number().optional(),
      lastSyncedAt: z.number().optional(),
      state: z.string().optional(),
      syncState: z.string().optional(),
      type: z.string().optional(),
      status: z.string().optional(),
    }).optional(),
    defaultRedirectUri: z.string().optional(),
    directory: z.object({
      connectedAt: z.number().optional(),
      lastReceivedWebhookEvent: z.number().optional(),
      lastSyncedAt: z.number().optional(),
      state: z.string().optional(),
      syncState: z.string().optional(),
      type: z.string().optional(),
    }).optional(),
    enforced: z.boolean().optional(),
    roles: z.record(z.string(), z.unknown()).optional(),
  }).nullable().optional(),
  sensitiveEnvironmentVariablePolicy: z.string().nullable().optional(),
  slug: z.string().nullable().optional(),
  stagingPrefix: z.string().nullable().optional(),
  strictConnectors: z.object({
    enabled: z.boolean().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  strictDeploymentProtectionSettings: z.object({
    enabled: z.boolean().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  strictPasswordProtectionSettings: z.object({
    enabled: z.boolean().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  strictShareableLinks: z.object({
    enabled: z.boolean().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  updatedAt: z.number().nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  avatar: z.string().max(40).regex(new RegExp("^[0-9a-f]+$")).optional(),
  description: z.string().max(140).optional(),
  emailDomain: z.string().optional(),
  name: z.string().max(256).optional(),
  previewDeploymentSuffix: z.string().optional(),
  regenerateInviteCode: z.boolean().optional(),
  saml: z.object({
    enforced: z.boolean().optional(),
    roles: z.record(z.string(), z.unknown()).optional(),
  }).optional(),
  enablePreviewFeedback: z.string().optional(),
  enableProductionFeedback: z.string().optional(),
  sensitiveEnvironmentVariablePolicy: z.string().optional(),
  disjunctiveProductionSecretPolicy: z.string().optional(),
  remoteCaching: z.object({
    enabled: z.boolean().optional(),
  }).optional(),
  hideIpAddresses: z.boolean().optional(),
  hideIpAddressesInLogDrains: z.boolean().optional(),
  dpAccessRequestsMode: z.enum(["all", "none", "email-domain"]).optional(),
  requireVerifiedCommits: z.boolean().optional(),
  disableRepositoryDispatchEvents: z.boolean().optional(),
  defaultDeploymentProtection: z.object({
    passwordProtection: z.object({
      deploymentType: z.enum([
        "all",
        "preview",
        "prod_deployment_urls_and_all_previews",
        "all_except_custom_domains",
      ]),
      password: z.string().max(72).optional(),
    }).optional(),
    ssoProtection: z.object({
      deploymentType: z.enum([
        "all",
        "preview",
        "prod_deployment_urls_and_all_previews",
        "all_except_custom_domains",
      ]),
    }).optional(),
  }).optional(),
  defaultPassport: z.object({
    connectorId: z.string(),
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]).optional(),
  }).optional(),
  defaultExpirationSettings: z.object({
    expiration: z.enum([
      "3y",
      "2y",
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
    expirationProduction: z.enum([
      "3y",
      "2y",
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
    expirationCanceled: z.enum([
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
    expirationErrored: z.enum([
      "1y",
      "6m",
      "3m",
      "2m",
      "1m",
      "2w",
      "1w",
      "1d",
      "unlimited",
    ]).optional(),
  }).optional(),
  deploymentPolicy: z.object({
    gitSources: z.array(z.object({
      enabled: z.boolean(),
      environments: z.array(z.object({
        type: z.enum(["system"]),
        target: z.enum(["production", "preview"]),
      })),
      sources: z.array(z.object({
        provider: z.enum(["github", "bitbucket"]),
        org: z.string(),
        repo: z.string().optional(),
      })),
    })).optional(),
    deploymentSources: z.array(z.object({
      enabled: z.boolean(),
      environments: z.array(z.object({
        type: z.enum(["system"]),
        target: z.enum(["production", "preview"]),
      })),
      sources: z.array(
        z.enum(["git", "cli", "rest-api", "deploy-hook", "integration", "v0"]),
      ),
    })).optional(),
  }).optional(),
  strictDeploymentProtectionSettings: z.object({
    enabled: z.boolean(),
  }).optional(),
  strictShareableLinks: z.object({
    enabled: z.boolean(),
  }).optional(),
  strictPasswordProtectionSettings: z.object({
    enabled: z.boolean(),
  }).optional(),
  strictConnectors: z.object({
    enabled: z.boolean(),
  }).optional(),
  nsnbConfig: z.object({
    preference: z.enum(["auto-approval", "manual-approval", "block"]),
  }).optional(),
  defaultProjectJobs: z.object({
    lint: z.object({
      targets: z.array(z.string()),
    }).optional(),
    typecheck: z.object({
      targets: z.array(z.string()),
    }).optional(),
  }).optional(),
  resourceConfig: z.object({
    buildMachine: z.object({
      default: z.enum(["basic", "enhanced", "turbo", "standard", "elastic"])
        .optional(),
    }).optional(),
  }).optional(),
  attribution: z.object({
    sessionReferrer: z.string().optional(),
    landingPage: z.string().optional(),
    pageBeforeConversionPage: z.string().optional(),
    utm: z.object({
      utmSource: z.string().optional(),
      utmMedium: z.string().optional(),
      utmCampaign: z.string().optional(),
      utmTerm: z.string().optional(),
    }).optional(),
  }).optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Teams. Registered at `@swamp/vercel/teams/teams`. */
export const model = {
  type: "@swamp/vercel/teams/teams",
  version: "2026.09.16.1",
  upgrades: [
    {
      toVersion: "2026.08.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.02.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.03.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.05.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.11.1",
      description: "Added: disjunctiveProductionSecretPolicy",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.03.1",
      description: "Added: strictConnectors",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Teams resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Teams",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/teams";
        const body: Record<string, unknown> = {};
        if (g.name !== undefined) body.name = g.name;
        if (g.attribution !== undefined) body.attribution = g.attribution;
        const raw = await create(endpoint, body, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        });
        const result = raw as ResourceData;
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
      description: "Get a Teams",
      arguments: z.object({ id: z.string().describe("The ID of the Teams") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/teams";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName = (g.name?.toString() ?? args.id).replace(
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
    lookup: {
      description:
        "Look up an existing Teams by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/teams";
        const filters: [string, string][] = [];
        if (g.avatar !== undefined) filters.push(["avatar", String(g.avatar)]);
        if (g.description !== undefined) {
          filters.push(["description", String(g.description)]);
        }
        if (g.emailDomain !== undefined) {
          filters.push(["emailDomain", String(g.emailDomain)]);
        }
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.previewDeploymentSuffix !== undefined) {
          filters.push([
            "previewDeploymentSuffix",
            String(g.previewDeploymentSuffix),
          ]);
        }
        if (g.regenerateInviteCode !== undefined) {
          filters.push([
            "regenerateInviteCode",
            String(g.regenerateInviteCode),
          ]);
        }
        if (g.enablePreviewFeedback !== undefined) {
          filters.push([
            "enablePreviewFeedback",
            String(g.enablePreviewFeedback),
          ]);
        }
        if (g.enableProductionFeedback !== undefined) {
          filters.push([
            "enableProductionFeedback",
            String(g.enableProductionFeedback),
          ]);
        }
        if (g.sensitiveEnvironmentVariablePolicy !== undefined) {
          filters.push([
            "sensitiveEnvironmentVariablePolicy",
            String(g.sensitiveEnvironmentVariablePolicy),
          ]);
        }
        if (g.disjunctiveProductionSecretPolicy !== undefined) {
          filters.push([
            "disjunctiveProductionSecretPolicy",
            String(g.disjunctiveProductionSecretPolicy),
          ]);
        }
        if (g.hideIpAddresses !== undefined) {
          filters.push(["hideIpAddresses", String(g.hideIpAddresses)]);
        }
        if (g.hideIpAddressesInLogDrains !== undefined) {
          filters.push([
            "hideIpAddressesInLogDrains",
            String(g.hideIpAddressesInLogDrains),
          ]);
        }
        if (g.dpAccessRequestsMode !== undefined) {
          filters.push([
            "dpAccessRequestsMode",
            String(g.dpAccessRequestsMode),
          ]);
        }
        if (g.requireVerifiedCommits !== undefined) {
          filters.push([
            "requireVerifiedCommits",
            String(g.requireVerifiedCommits),
          ]);
        }
        if (g.disableRepositoryDispatchEvents !== undefined) {
          filters.push([
            "disableRepositoryDispatchEvents",
            String(g.disableRepositoryDispatchEvents),
          ]);
        }
        if (g.apiKeysInvalidatedAt !== undefined) {
          filters.push([
            "apiKeysInvalidatedAt",
            String(g.apiKeysInvalidatedAt),
          ]);
        }
        if (g.appTokensInvalidatedAt !== undefined) {
          filters.push([
            "appTokensInvalidatedAt",
            String(g.appTokensInvalidatedAt),
          ]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.creatorId !== undefined) {
          filters.push(["creatorId", String(g.creatorId)]);
        }
        if (g.disableHardAutoBlocks !== undefined) {
          filters.push([
            "disableHardAutoBlocks",
            String(g.disableHardAutoBlocks),
          ]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.integrationTokensInvalidatedAt !== undefined) {
          filters.push([
            "integrationTokensInvalidatedAt",
            String(g.integrationTokensInvalidatedAt),
          ]);
        }
        if (g.inviteCode !== undefined) {
          filters.push(["inviteCode", String(g.inviteCode)]);
        }
        if (g.orgRootTeamId !== undefined) {
          filters.push(["orgRootTeamId", String(g.orgRootTeamId)]);
        }
        if (g.parentId !== undefined) {
          filters.push(["parentId", String(g.parentId)]);
        }
        if (g.personalAccessTokensInvalidatedAt !== undefined) {
          filters.push([
            "personalAccessTokensInvalidatedAt",
            String(g.personalAccessTokensInvalidatedAt),
          ]);
        }
        if (g.platform !== undefined) {
          filters.push(["platform", String(g.platform)]);
        }
        if (g.stagingPrefix !== undefined) {
          filters.push(["stagingPrefix", String(g.stagingPrefix)]);
        }
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(
          endpoint,
          "cursor",
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
          undefined,
          "until",
        );
        const matches = items.filter((item) => {
          for (const [key, val] of filters) {
            if (String((item as Record<string, unknown>)[key]) !== val) {
              return false;
            }
          }
          return true;
        });
        if (matches.length === 0) {
          const filterDesc = filters.map(([k, v]) =>
            `${k}=${JSON.stringify(v)}`
          ).join(", ");
          throw new Error(`No teams found matching filters: ${filterDesc}`);
        }
        if (matches.length > 1) {
          const filterDesc = filters.map(([k, v]) =>
            `${k}=${JSON.stringify(v)}`
          ).join(", ");
          throw new Error(
            `Expected exactly 1 match, found ${matches.length} for filters: ${filterDesc}`,
          );
        }
        const result = matches[0] as ResourceData;
        const instanceName =
          (g.name?.toString() ?? result.id?.toString() ?? "current").replace(
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
    adopt: {
      description: "Import an existing Teams by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Teams to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/teams";
        const result = await read(endpoint, args.id, { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }) as ResourceData;
        const instanceName =
          (result.name?.toString() ?? g.name?.toString() ?? args.id).replace(
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
      description: "Update Teams attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Teams by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/teams";
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
          throw new Error("No data found - run create, get, or list first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const body: Record<string, unknown> = {};
        if (g.avatar !== undefined) body.avatar = g.avatar;
        if (g.description !== undefined) body.description = g.description;
        if (g.emailDomain !== undefined) body.emailDomain = g.emailDomain;
        if (g.name !== undefined) body.name = g.name;
        if (g.previewDeploymentSuffix !== undefined) {
          body.previewDeploymentSuffix = g.previewDeploymentSuffix;
        }
        if (g.regenerateInviteCode !== undefined) {
          body.regenerateInviteCode = g.regenerateInviteCode;
        }
        if (g.saml !== undefined) body.saml = g.saml;
        if (g.enablePreviewFeedback !== undefined) {
          body.enablePreviewFeedback = g.enablePreviewFeedback;
        }
        if (g.enableProductionFeedback !== undefined) {
          body.enableProductionFeedback = g.enableProductionFeedback;
        }
        if (g.sensitiveEnvironmentVariablePolicy !== undefined) {
          body.sensitiveEnvironmentVariablePolicy =
            g.sensitiveEnvironmentVariablePolicy;
        }
        if (g.disjunctiveProductionSecretPolicy !== undefined) {
          body.disjunctiveProductionSecretPolicy =
            g.disjunctiveProductionSecretPolicy;
        }
        if (g.remoteCaching !== undefined) body.remoteCaching = g.remoteCaching;
        if (g.hideIpAddresses !== undefined) {
          body.hideIpAddresses = g.hideIpAddresses;
        }
        if (g.hideIpAddressesInLogDrains !== undefined) {
          body.hideIpAddressesInLogDrains = g.hideIpAddressesInLogDrains;
        }
        if (g.dpAccessRequestsMode !== undefined) {
          body.dpAccessRequestsMode = g.dpAccessRequestsMode;
        }
        if (g.requireVerifiedCommits !== undefined) {
          body.requireVerifiedCommits = g.requireVerifiedCommits;
        }
        if (g.disableRepositoryDispatchEvents !== undefined) {
          body.disableRepositoryDispatchEvents =
            g.disableRepositoryDispatchEvents;
        }
        if (g.defaultDeploymentProtection !== undefined) {
          body.defaultDeploymentProtection = g.defaultDeploymentProtection;
        }
        if (g.defaultPassport !== undefined) {
          body.defaultPassport = g.defaultPassport;
        }
        if (g.defaultExpirationSettings !== undefined) {
          body.defaultExpirationSettings = g.defaultExpirationSettings;
        }
        if (g.deploymentPolicy !== undefined) {
          body.deploymentPolicy = g.deploymentPolicy;
        }
        if (g.strictDeploymentProtectionSettings !== undefined) {
          body.strictDeploymentProtectionSettings =
            g.strictDeploymentProtectionSettings;
        }
        if (g.strictShareableLinks !== undefined) {
          body.strictShareableLinks = g.strictShareableLinks;
        }
        if (g.strictPasswordProtectionSettings !== undefined) {
          body.strictPasswordProtectionSettings =
            g.strictPasswordProtectionSettings;
        }
        if (g.strictConnectors !== undefined) {
          body.strictConnectors = g.strictConnectors;
        }
        if (g.nsnbConfig !== undefined) body.nsnbConfig = g.nsnbConfig;
        if (g.defaultProjectJobs !== undefined) {
          body.defaultProjectJobs = g.defaultProjectJobs;
        }
        if (g.resourceConfig !== undefined) {
          body.resourceConfig = g.resourceConfig;
        }
        const result = await update(endpoint, existing.id, body, "PATCH", {
          token: g.token,
        }, { teamId: g.teamId, slug: g.slug }) as ResourceData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the Teams",
      arguments: z.object({ id: z.string().describe("The ID of the Teams") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v1/teams";
        const { existed } = await remove(
          endpoint,
          args.id,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        );
        const instanceName = (context.globalArgs.name?.toString() ?? args.id)
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource("state", instanceName, {
          id: args.id,
          existed,
          status: existed ? "deleted" : "not_found",
          deletedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
    sync: {
      description: "Sync Teams state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Teams by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v2/teams";
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
          throw new Error("No data found - run create, get, or list first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        if (!existing.id) {
          throw new Error("Stored state has no id - cannot sync");
        }
        const result = await tryRead(
          endpoint,
          existing.id,
          { token: g.token },
          { teamId: g.teamId, slug: g.slug },
        ) as ResourceData | null;
        if (result) {
          const handle = await context.writeResource(
            "state",
            instanceName,
            result,
          );
          return { dataHandles: [handle] };
        }
        const handle = await context.writeResource("state", instanceName, {
          id: existing.id,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
