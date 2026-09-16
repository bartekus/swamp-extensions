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

// Auto-generated extension model for @swamp/vercel/projects/projects
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Projects.
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
  autoExposeSystemEnvs: z.boolean().optional(),
  autoAssignCustomDomains: z.boolean().optional(),
  autoAssignCustomDomainsUpdatedBy: z.string().optional(),
  buildCommand: z.string().max(256).describe(
    "The build command for this project. When `null` is used this value will be automatically detected",
  ).optional(),
  commandForIgnoringBuildStep: z.string().max(256).optional(),
  customerSupportCodeVisibility: z.boolean().describe(
    "Specifies whether customer support can see git source for a deployment",
  ).optional(),
  devCommand: z.string().max(256).describe(
    "The dev command for this project. When `null` is used this value will be automatically detected",
  ).optional(),
  directoryListing: z.boolean().optional(),
  framework: z.enum([
    "container",
    "blitzjs",
    "nextjs",
    "gatsby",
    "remix",
    "react-router",
    "astro",
    "hexo",
    "eleventy",
    "docusaurus-2",
    "docusaurus",
    "preact",
    "solidstart-1",
    "solidstart",
    "dojo",
    "ember",
    "vue",
    "scully",
    "ionic-angular",
    "angular",
    "polymer",
    "svelte",
    "sveltekit",
    "sveltekit-1",
    "ionic-react",
    "create-react-app",
    "gridsome",
    "umijs",
    "sapper",
    "saber",
    "stencil",
    "nuxtjs",
    "redwoodjs",
    "hugo",
    "jekyll",
    "brunch",
    "middleman",
    "zola",
    "hydrogen",
    "vite",
    "tanstack-start",
    "tanstack-start-lovable",
    "vitepress",
    "vuepress",
    "parcel",
    "fastapi",
    "flask",
    "fasthtml",
    "django",
    "ash",
    "factory-eve",
    "eve",
    "sanity",
    "sanity-v2",
    "storybook",
    "nitro",
    "hono",
    "express",
    "h3",
    "koa",
    "nestjs",
    "elysia",
    "fastify",
    "xmcp",
    "python",
    "ruby",
    "rust",
    "axum",
    "actix-web",
    "bun",
    "node",
    "go",
    "services",
    "mastra",
  ]).describe(
    "The framework that is being used for this project. When `null` is used no framework is selected",
  ).optional(),
  gitForkProtection: z.boolean().describe(
    "Specifies whether PRs from Git forks should require a team member's authorization before it can be deployed",
  ).optional(),
  gitLFS: z.boolean().describe(
    "Specifies whether Git LFS is enabled for this project.",
  ).optional(),
  protectedSourcemaps: z.boolean().describe(
    "Specifies whether sourcemaps are protected and require authentication to access.",
  ).optional(),
  installCommand: z.string().max(256).describe(
    "The install command for this project. When `null` is used this value will be automatically detected",
  ).optional(),
  name: z.string().max(100).describe("The desired name for the project"),
  nodeVersion: z.enum([
    "24.x",
    "22.x",
    "20.x",
    "18.x",
    "16.x",
    "14.x",
    "12.x",
    "10.x",
  ]).optional(),
  outputDirectory: z.string().max(256).describe(
    "The output directory of the project. When `null` is used this value will be automatically detected",
  ).optional(),
  previewDeploymentsDisabled: z.boolean().describe(
    "Specifies whether preview deployments are disabled for this project.",
  ).optional(),
  previewDeploymentSuffix: z.string().max(253).describe(
    "Custom domain suffix for preview deployments. Takes precedence over team-level suffix. Must be a domain owned by the team.",
  ).optional(),
  resourceConfig: z.object({
    buildMachineType: z.enum([
      "basic",
      "enhanced",
      "turbo",
      "standard",
      "elastic",
    ]).optional(),
    fluid: z.boolean().optional(),
    functionDefaultRegions: z.array(z.string().max(4)).optional(),
    functionDefaultTimeout: z.number().min(1).max(900).optional(),
    functionDefaultMemoryType: z.enum([
      "standard_legacy",
      "standard",
      "performance",
      "performance_xl",
    ]).optional(),
    functionZeroConfigFailover: z.boolean().optional(),
    elasticConcurrencyEnabled: z.boolean().optional(),
    buildMachineSelection: z.enum(["elastic", "fixed"]).optional(),
    buildMachineElasticLastUpdated: z.number().optional(),
    buildMachineElasticReason: z.enum([
      "oom-failure",
      "enospc-failure",
      "build-timeout-failure",
      "basic-floor",
      "high-peak-memory",
      "sustained-high-cpu",
      "high-peak-disk",
      "long-build-duration",
      "short-build-duration",
      "enterprise-floor",
    ]).optional(),
    isNSNBDisabled: z.boolean().optional(),
    buildQueue: z.object({
      configuration: z.enum([
        "SKIP_NAMESPACE_QUEUE",
        "WAIT_FOR_NAMESPACE_QUEUE",
      ]).optional(),
    }).optional(),
    enableFunctionsBeta: z.boolean().optional(),
  }).describe("Specifies resource override configuration for the project")
    .optional(),
  publicSource: z.boolean().describe(
    "Deprecated. Accepted for backwards compatibility but ignored.",
  ).optional(),
  rootDirectory: z.string().max(256).describe(
    "The name of a directory or relative path to the source code of your project. When `null` is used it will default to the project root",
  ).optional(),
  serverlessFunctionRegion: z.string().max(4).describe(
    "The region to deploy Serverless Functions in this project",
  ).optional(),
  serverlessFunctionZeroConfigFailover: z.boolean().optional(),
  skewProtectionBoundaryAt: z.number().int().min(0).describe(
    'Deployments created before this absolute datetime have Skew Protection disabled. Value is in milliseconds since epoch to match \\"createdAt\\" fields.',
  ).optional(),
  skewProtectionMaxAge: z.number().int().min(0).describe(
    'Deployments created before this rolling window have Skew Protection disabled. Value is in seconds to match \\"revalidate\\" fields.',
  ).optional(),
  skewProtectionAllowedDomains: z.array(z.string().max(254)).describe(
    "Cross-site domains allowed to fetch skew-protected assets (hostnames, optionally with leading wildcard like *.example.com).",
  ).optional(),
  skipGitConnectDuringLink: z.boolean().describe(
    "Opts-out of the message prompting a CLI user to connect a Git repository in `vercel link`.",
  ).optional(),
  sourceFilesOutsideRootDirectory: z.boolean().describe(
    "Indicates if there are source files outside of the root directory",
  ).optional(),
  enablePreviewFeedback: z.boolean().describe(
    "Opt-in to preview toolbar on the project level",
  ).optional(),
  enableProductionFeedback: z.boolean().describe(
    "Opt-in to production toolbar on the project level",
  ).optional(),
  enableAffectedProjectsDeployments: z.boolean().describe(
    "Opt-in to skip deployments when there are no changes to the root directory and its dependencies",
  ).optional(),
  enableExternalRewriteCaching: z.boolean().describe(
    "Specifies whether external rewrite caching is enabled for this project.",
  ).optional(),
  staticIps: z.object({
    enabled: z.boolean(),
  }).describe("Manage Static IPs for this project").optional(),
  tracing: z.object({
    domains: z.string().optional(),
    ignorePaths: z.array(z.string()).optional(),
    samplingRules: z.array(z.object({
      rate: z.number().min(0).max(1),
      env: z.enum(["production", "preview"]).optional(),
      requestPath: z.string().optional(),
      destination: z.enum(["internal", "external"]).optional(),
    })).optional(),
  }).describe("Tracing configuration for this project").optional(),
  oidcTokenConfig: z.object({
    enabled: z.boolean().optional(),
    issuerMode: z.enum(["team", "global"]).optional(),
  }).describe("OpenID Connect JSON Web Token generation configuration.")
    .optional(),
  passwordProtection: z.object({
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]),
    password: z.string().max(72).optional(),
  }).describe("Allows to protect project deployments with a password")
    .optional(),
  passport: z.object({
    connectorId: z.string(),
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]).optional(),
  }).describe("Passport configuration for the project.").optional(),
  sandbox: z.object({
    region: z.enum([
      "iad1",
      "sfo1",
      "cle1",
      "cdg1",
      "fra1",
      "arn1",
      "sin1",
      "pdx1",
      "lhr1",
      "icn1",
      "bom1",
      "cpt1",
      "dub1",
      "gru1",
      "hkg1",
      "syd1",
      "yul1",
      "hnd1",
      "kix1",
    ]).optional(),
    failoverRegions: z.array(
      z.enum([
        "iad1",
        "sfo1",
        "cle1",
        "cdg1",
        "fra1",
        "arn1",
        "sin1",
        "pdx1",
        "lhr1",
        "icn1",
        "bom1",
        "cpt1",
        "dub1",
        "gru1",
        "hkg1",
        "syd1",
        "yul1",
        "hnd1",
        "kix1",
      ]),
    ).optional(),
  }).describe(
    "Specifies the default region and failover regions for sandboxes created in the project",
  ).optional(),
  ssoProtection: z.object({
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]),
  }).describe(
    'The Vercel Auth setting for the project (historically named \\"SSO Protection\\")',
  ).optional(),
  trustedIps: z.object({
    deploymentType: z.enum([
      "all",
      "preview",
      "production",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]),
    addresses: z.array(z.object({
      value: z.string(),
      note: z.string().max(20).optional(),
    })),
    protectionMode: z.enum(["exclusive", "additional"]),
  }).describe(
    "Restricts access to deployments based on the incoming request IP address",
  ).optional(),
  trustedSources: z.object({
    enableVercelCiSameRepository: z.boolean().optional(),
    projects: z.record(z.string(), z.unknown()).optional(),
    oidcProviders: z.record(z.string(), z.unknown()).optional(),
  }).describe("Deployment Protection Trusted Sources").optional(),
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
  optionsAllowlist: z.object({
    paths: z.array(z.object({
      value: z.string().regex(new RegExp("^/.*")),
    })),
  }).describe(
    "Specify a list of paths that should not be protected by Deployment Protection to enable Cors preflight requests",
  ).optional(),
  connectConfigurations: z.array(z.record(z.string(), z.unknown())).describe(
    "The list of connections from project environment to Secure Compute network",
  ).optional(),
  dismissedToasts: z.array(z.object({
    key: z.string(),
    dismissedAt: z.number(),
    action: z.enum(["cancel", "accept", "delete"]),
    value: z.string(),
  })).describe(
    "An array of objects representing a Dismissed Toast in regards to a Project. Objects are either merged with existing toasts (on key match), or added to the `dimissedToasts` array.`",
  ).optional(),
  environmentVariables: z.array(z.object({
    key: z.string(),
    target: z.array(z.enum(["production", "preview", "development"])),
    gitBranch: z.string().max(250).optional(),
    type: z.enum(["system", "encrypted", "plain", "sensitive"]).optional(),
    value: z.string(),
  })).describe("Collection of ENV Variables the Project will use").optional(),
  gitRepository: z.object({
    repo: z.string(),
    type: z.enum([
      "github",
      "github-limited",
      "gitlab",
      "bitbucket",
      "vercel",
      "cursor-origin",
    ]),
  }).describe(
    "The Git Repository that will be connected to the project. When this is defined, any pushes to the specified connected Git Repository will be automatically deployed",
  ).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  abuse: z.object({
    block: z.object({
      action: z.string().optional(),
      actor: z.string().optional(),
      caseId: z.string().optional(),
      comment: z.string().optional(),
      createdAt: z.number().optional(),
      ineligibleForAppeal: z.boolean().optional(),
      isCascading: z.boolean().optional(),
      reason: z.string().optional(),
      statusCode: z.number().optional(),
    }).optional(),
    blockHistory: z.array(z.object({
      action: z.string().optional(),
      actor: z.string().optional(),
      caseId: z.string().optional(),
      comment: z.string().optional(),
      createdAt: z.number().optional(),
      ineligibleForAppeal: z.boolean().optional(),
      isCascading: z.boolean().optional(),
      reason: z.string().optional(),
      statusCode: z.number().optional(),
    })).optional(),
    history: z.array(z.object({
      at: z.number().optional(),
      by: z.string().optional(),
      byId: z.string().optional(),
      reason: z.string().optional(),
      scanner: z.string().optional(),
    })).optional(),
    interstitial: z.boolean().optional(),
    interstitialHistory: z.array(z.object({
      action: z.string().optional(),
      actor: z.string().optional(),
      caseId: z.string().optional(),
      comment: z.string().optional(),
      createdAt: z.number().optional(),
      reason: z.string().optional(),
    })).optional(),
    scanner: z.string().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  accountId: z.string().nullable().optional(),
  alias: z.array(z.object({
    configuredBy: z.string().optional(),
    configuredChangedAt: z.number().optional(),
    createdAt: z.number().optional(),
    deployment: z.object({
      alias: z.array(z.string()).optional(),
      aliasAssigned: z.number().optional(),
      aliasError: z.object({
        code: z.string().optional(),
        message: z.string().optional(),
      }).optional(),
      aliasFinal: z.string().optional(),
      automaticAliases: z.array(z.string()).optional(),
      branchMatcher: z.object({
        pattern: z.string().optional(),
        type: z.string().optional(),
      }).optional(),
      buildingAt: z.number().optional(),
      builds: z.array(z.object({
        dest: z.string().optional(),
        src: z.string().optional(),
        use: z.string().optional(),
      })).optional(),
      checksConclusion: z.string().optional(),
      checksState: z.string().optional(),
      connectBuildsEnabled: z.boolean().optional(),
      connectConfigurationId: z.string().optional(),
      createdAt: z.number().optional(),
      createdIn: z.string().optional(),
      creator: z.object({
        email: z.string().optional(),
        githubLogin: z.string().optional(),
        gitlabLogin: z.string().optional(),
        uid: z.string().optional(),
        username: z.string().optional(),
      }).optional(),
      deletedAt: z.number().optional(),
      deploymentHostname: z.string().optional(),
      forced: z.boolean().optional(),
      id: z.string().optional(),
      meta: z.record(z.string(), z.unknown()).optional(),
      monorepoManager: z.string().optional(),
      name: z.string().optional(),
      oidcTokenClaims: z.object({
        aud: z.string().optional(),
        custom_environment_id: z.string().optional(),
        environment: z.string().optional(),
        iss: z.string().optional(),
        mfe_group_ids: z.array(z.string()).optional(),
        owner: z.string().optional(),
        owner_id: z.string().optional(),
        plan: z.string().optional(),
        project: z.string().optional(),
        project_id: z.string().optional(),
        scope: z.string().optional(),
        sub: z.string().optional(),
      }).optional(),
      plan: z.string().optional(),
      previewCommentsEnabled: z.boolean().optional(),
      private: z.boolean().optional(),
      readyAt: z.number().optional(),
      readyState: z.string().optional(),
      readySubstate: z.string().optional(),
      requestedAt: z.number().optional(),
      target: z.string().optional(),
      teamId: z.string().optional(),
      type: z.string().optional(),
      url: z.string().optional(),
      userId: z.string().optional(),
      withCache: z.boolean().optional(),
    }).optional(),
    domain: z.string().optional(),
    environment: z.string().optional(),
    gitBranch: z.string().optional(),
    redirect: z.string().optional(),
    redirectStatusCode: z.number().optional(),
    target: z.string().optional(),
  })).nullable().optional(),
  analytics: z.object({
    canceledAt: z.number().optional(),
    disabledAt: z.number().optional(),
    enabledAt: z.number().optional(),
    id: z.string().optional(),
    paidAt: z.number().optional(),
    sampleRatePercent: z.number().optional(),
    spendLimitInDollars: z.number().optional(),
  }).nullable().optional(),
  appliedCve55182Migration: z.boolean().nullable().optional(),
  autoAssignCustomDomains: z.boolean().nullable().optional(),
  autoAssignCustomDomainsUpdatedBy: z.string().nullable().optional(),
  autoExposeSystemEnvs: z.boolean().nullable().optional(),
  avatar: z.string().nullable().optional(),
  blobs: z.object({
    isDefaultApp: z.boolean().optional(),
  }).nullable().optional(),
  buildCommand: z.string().nullable().optional(),
  commandForIgnoringBuildStep: z.string().nullable().optional(),
  concurrencyBucketName: z.string().nullable().optional(),
  connectBuildsEnabled: z.boolean().nullable().optional(),
  connectConfigurationId: z.string().nullable().optional(),
  connectConfigurations: z.array(z.object({
    aws: z.object({
      securityGroupId: z.string().optional(),
      subnetIds: z.array(z.string()).optional(),
    }).optional(),
    buildsEnabled: z.boolean().optional(),
    connectConfigurationId: z.string().optional(),
    createdAt: z.number().optional(),
    dc: z.string().optional(),
    envId: z.string().optional(),
    passive: z.boolean().optional(),
    updatedAt: z.number().optional(),
  })).nullable().optional(),
  createdAt: z.number().nullable().optional(),
  creator: z.object({
    type: z.string().optional(),
    via: z.object({
      app: z.object({
        clientId: z.string().optional(),
        id: z.string().optional(),
      }).optional(),
      type: z.string().optional(),
    }).optional(),
    user: z.object({
      id: z.string().optional(),
    }).optional(),
  }).nullable().optional(),
  crons: z.object({
    definitions: z.array(z.object({
      description: z.string().optional(),
      host: z.string().optional(),
      hostInferred: z.boolean().optional(),
      path: z.string().optional(),
      schedule: z.string().optional(),
      source: z.string().optional(),
    })).optional(),
    deploymentId: z.string().optional(),
    disabledAt: z.number().optional(),
    enabledAt: z.number().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  customEnvironments: z.array(z.object({
    branchMatcher: z.object({
      pattern: z.string().optional(),
      type: z.string().optional(),
    }).optional(),
    createdAt: z.number().optional(),
    currentDeploymentAliases: z.array(z.string()).optional(),
    description: z.string().optional(),
    domains: z.array(z.object({
      apexName: z.string().optional(),
      createdAt: z.number().optional(),
      customEnvironmentId: z.string().optional(),
      gitBranch: z.string().optional(),
      name: z.string().optional(),
      projectId: z.string().optional(),
      redirect: z.string().optional(),
      redirectStatusCode: z.number().optional(),
      updatedAt: z.number().optional(),
      verification: z.array(z.object({
        domain: z.string().optional(),
        reason: z.string().optional(),
        type: z.string().optional(),
        value: z.string().optional(),
      })).optional(),
      verified: z.boolean().optional(),
    })).optional(),
    id: z.string().optional(),
    slug: z.string().optional(),
    type: z.string().optional(),
    updatedAt: z.number().optional(),
  })).nullable().optional(),
  customerSupportCodeVisibility: z.boolean().nullable().optional(),
  dataCache: z.object({
    storageSizeBytes: z.number().optional(),
    unlimited: z.boolean().optional(),
    userDisabled: z.boolean().optional(),
  }).nullable().optional(),
  defaultResourceConfig: z.object({
    buildMachineElasticLastUpdated: z.number().optional(),
    buildMachineElasticReason: z.string().optional(),
    buildMachineSelection: z.string().optional(),
    buildMachineType: z.string().optional(),
    buildQueue: z.object({
      configuration: z.string().optional(),
    }).optional(),
    elasticConcurrencyEnabled: z.boolean().optional(),
    enableFunctionsBeta: z.boolean().optional(),
    fluid: z.boolean().optional(),
    functionDefaultMemoryType: z.string().optional(),
    functionDefaultRegions: z.array(z.string()).optional(),
    functionDefaultTimeout: z.number().optional(),
    functionZeroConfigFailover: z.boolean().optional(),
    isNSNBDisabled: z.boolean().optional(),
  }).nullable().optional(),
  deploymentExpiration: z.object({
    deploymentsToKeep: z.number().optional(),
    expirationDays: z.number().optional(),
    expirationDaysCanceled: z.number().optional(),
    expirationDaysErrored: z.number().optional(),
    expirationDaysProduction: z.number().optional(),
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
  devCommand: z.string().nullable().optional(),
  directoryListing: z.boolean().nullable().optional(),
  dismissedToasts: z.array(z.object({
    action: z.string().optional(),
    dismissedAt: z.number().optional(),
    key: z.string().optional(),
    value: z.string().optional(),
  })).nullable().optional(),
  enableAffectedProjectsDeployments: z.boolean().nullable().optional(),
  enableExternalRewriteCaching: z.boolean().nullable().optional(),
  enablePreviewFeedback: z.boolean().nullable().optional(),
  enableProductionFeedback: z.boolean().nullable().optional(),
  env: z.array(z.object({
    comment: z.string().optional(),
    configurationId: z.string().optional(),
    contentHint: z.object({
      storeId: z.string().optional(),
      type: z.string().optional(),
    }).optional(),
    createdAt: z.number().optional(),
    createdBy: z.string().optional(),
    customEnvironmentIds: z.array(z.string()).optional(),
    decrypted: z.boolean().optional(),
    edgeConfigId: z.string().optional(),
    edgeConfigTokenId: z.string().optional(),
    gitBranch: z.string().optional(),
    id: z.string().optional(),
    internalContentHint: z.object({
      encryptedValue: z.string().optional(),
      type: z.string().optional(),
    }).optional(),
    key: z.string().optional(),
    legacyValue: z.string().optional(),
    sunsetSecretId: z.string().optional(),
    target: z.array(z.string()).optional(),
    type: z.string().optional(),
    updatedAt: z.number().optional(),
    updatedBy: z.string().optional(),
    value: z.string().optional(),
    visibility: z.string().optional(),
    vsmValue: z.string().optional(),
  })).nullable().optional(),
  expiration: z.object({
    expiresAt: z.number().optional(),
  }).nullable().optional(),
  features: z.object({
    webAnalytics: z.boolean().optional(),
  }).nullable().optional(),
  framework: z.string().nullable().optional(),
  gitComments: z.object({
    onCommit: z.boolean().optional(),
    onPullRequest: z.boolean().optional(),
  }).nullable().optional(),
  gitForkProtection: z.boolean().nullable().optional(),
  gitLFS: z.boolean().nullable().optional(),
  gitProviderOptions: z.object({
    consolidatedGitCommitStatus: z.object({
      enabled: z.boolean().optional(),
      propagateFailures: z.boolean().optional(),
    }).optional(),
    createDeployments: z.string().optional(),
    disableRepositoryDispatchEvents: z.boolean().optional(),
    gitCommitStatus: z.boolean().optional(),
    requireVerifiedCommits: z.boolean().optional(),
  }).nullable().optional(),
  hasActiveBranches: z.boolean().nullable().optional(),
  hasDeployments: z.boolean().nullable().optional(),
  id: z.string(),
  installCommand: z.string().nullable().optional(),
  integrations: z.array(z.object({
    installationId: z.string().optional(),
    resources: z.array(z.object({
      externalResourceId: z.string().optional(),
    })).optional(),
  })).nullable().optional(),
  internalRoutes: z.array(z.object({
    expiry: z.number().optional(),
    src: z.string().optional(),
    status: z.number().optional(),
  })).nullable().optional(),
  ipBuckets: z.array(z.object({
    bucket: z.string().optional(),
    default: z.boolean().optional(),
    supportUntil: z.number().optional(),
  })).nullable().optional(),
  jobs: z.object({
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
  lastAliasRequest: z.object({
    fromDeploymentId: z.string().optional(),
    fromRollingReleaseId: z.string().optional(),
    jobStatus: z.string().optional(),
    requestedAt: z.number().optional(),
    toDeploymentId: z.string().optional(),
    type: z.string().optional(),
  }).nullable().optional(),
  lastRollbackTarget: z.record(z.string(), z.unknown()).nullable().optional(),
  latestDeployments: z.array(z.object({
    alias: z.array(z.string()).optional(),
    aliasAssigned: z.number().optional(),
    aliasError: z.object({
      code: z.string().optional(),
      message: z.string().optional(),
    }).optional(),
    aliasFinal: z.string().optional(),
    automaticAliases: z.array(z.string()).optional(),
    branchMatcher: z.object({
      pattern: z.string().optional(),
      type: z.string().optional(),
    }).optional(),
    buildingAt: z.number().optional(),
    builds: z.array(z.object({
      dest: z.string().optional(),
      src: z.string().optional(),
      use: z.string().optional(),
    })).optional(),
    checksConclusion: z.string().optional(),
    checksState: z.string().optional(),
    connectBuildsEnabled: z.boolean().optional(),
    connectConfigurationId: z.string().optional(),
    createdAt: z.number().optional(),
    createdIn: z.string().optional(),
    creator: z.object({
      email: z.string().optional(),
      githubLogin: z.string().optional(),
      gitlabLogin: z.string().optional(),
      uid: z.string().optional(),
      username: z.string().optional(),
    }).optional(),
    deletedAt: z.number().optional(),
    deploymentHostname: z.string().optional(),
    forced: z.boolean().optional(),
    id: z.string().optional(),
    meta: z.record(z.string(), z.unknown()).optional(),
    monorepoManager: z.string().optional(),
    name: z.string().optional(),
    oidcTokenClaims: z.object({
      aud: z.string().optional(),
      custom_environment_id: z.string().optional(),
      environment: z.string().optional(),
      iss: z.string().optional(),
      mfe_group_ids: z.array(z.string()).optional(),
      owner: z.string().optional(),
      owner_id: z.string().optional(),
      plan: z.string().optional(),
      project: z.string().optional(),
      project_id: z.string().optional(),
      scope: z.string().optional(),
      sub: z.string().optional(),
    }).optional(),
    plan: z.string().optional(),
    previewCommentsEnabled: z.boolean().optional(),
    private: z.boolean().optional(),
    readyAt: z.number().optional(),
    readyState: z.string().optional(),
    readySubstate: z.string().optional(),
    requestedAt: z.number().optional(),
    target: z.string().optional(),
    teamId: z.string().optional(),
    type: z.string().optional(),
    url: z.string().optional(),
    userId: z.string().optional(),
    withCache: z.boolean().optional(),
  })).nullable().optional(),
  link: z.object({
    createdAt: z.number().optional(),
    deployHooks: z.array(z.object({
      createdAt: z.number().optional(),
      id: z.string().optional(),
      name: z.string().optional(),
      ref: z.string().optional(),
      url: z.string().optional(),
    })).optional(),
    gitCredentialId: z.string().optional(),
    org: z.string().optional(),
    productionBranch: z.string().optional(),
    repo: z.string().optional(),
    repoId: z.number().optional(),
    repoOwnerId: z.number().optional(),
    sourceless: z.boolean().optional(),
    type: z.string().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  live: z.boolean().nullable().optional(),
  microfrontends: z.object({
    defaultRoute: z.string().optional(),
    enabled: z.boolean().optional(),
    freeProjectForLegacyLimits: z.boolean().optional(),
    groupIds: z.array(z.string()).optional(),
    isDefaultApp: z.boolean().optional(),
    updatedAt: z.number().optional(),
  }).nullable().optional(),
  name: z.string().nullable().optional(),
  nodeVersion: z.string().nullable().optional(),
  oidcTokenConfig: z.object({
    enabled: z.boolean().optional(),
    issuerMode: z.string().optional(),
  }).nullable().optional(),
  optionsAllowlist: z.object({
    paths: z.array(z.object({
      value: z.string().optional(),
    })).optional(),
  }).nullable().optional(),
  outputDirectory: z.string().nullable().optional(),
  passiveConnectConfigurationId: z.string().nullable().optional(),
  passport: z.object({
    connectorId: z.string().optional(),
    deploymentType: z.string().optional(),
  }).nullable().optional(),
  passwordProtection: z.record(z.string(), z.unknown()).nullable().optional(),
  paused: z.boolean().nullable().optional(),
  permissions: z.object({
    accessGroup: z.array(z.string()).optional(),
    agent: z.array(z.string()).optional(),
    aiGatewayApiKey: z.array(z.string()).optional(),
    aiGatewayApiKeyBypassAll: z.array(z.string()).optional(),
    aiGatewayApiKeyOwnedBySelf: z.array(z.string()).optional(),
    aiGatewayApiKeySpendAttribution: z.array(z.string()).optional(),
    aiGatewayApiKeyZdrExemption: z.array(z.string()).optional(),
    aiGatewayBudget: z.array(z.string()).optional(),
    aiGatewayCredits: z.array(z.string()).optional(),
    aiGatewayGuardrails: z.array(z.string()).optional(),
    aiGatewayPrivateModels: z.array(z.string()).optional(),
    aiGatewayRules: z.array(z.string()).optional(),
    aiGatewaySettings: z.array(z.string()).optional(),
    aiGatewayTranscripts: z.array(z.string()).optional(),
    aiGatewayTranscriptsSettings: z.array(z.string()).optional(),
    aiGatewayUsage: z.array(z.string()).optional(),
    aiGatewayVirtualModelConfigs: z.array(z.string()).optional(),
    alertRules: z.array(z.string()).optional(),
    alerts: z.array(z.string()).optional(),
    aliasGlobal: z.array(z.string()).optional(),
    aliasProject: z.array(z.string()).optional(),
    aliasProtectionBypass: z.array(z.string()).optional(),
    analytics: z.array(z.string()).optional(),
    analyticsSampling: z.array(z.string()).optional(),
    analyticsUsage: z.array(z.string()).optional(),
    apiKey: z.array(z.string()).optional(),
    apiKeyAiGateway: z.array(z.string()).optional(),
    apiKeyOwnedBySelf: z.array(z.string()).optional(),
    auditLog: z.array(z.string()).optional(),
    automation: z.array(z.string()).optional(),
    billingAddress: z.array(z.string()).optional(),
    billingInformation: z.array(z.string()).optional(),
    billingInvoice: z.array(z.string()).optional(),
    billingInvoiceEmailRecipient: z.array(z.string()).optional(),
    billingInvoiceLanguage: z.array(z.string()).optional(),
    billingPlan: z.array(z.string()).optional(),
    billingPurchaseOrder: z.array(z.string()).optional(),
    billingRefund: z.array(z.string()).optional(),
    billingTaxId: z.array(z.string()).optional(),
    blob: z.array(z.string()).optional(),
    blobStoreTokenSet: z.array(z.string()).optional(),
    budget: z.array(z.string()).optional(),
    buildMachine: z.array(z.string()).optional(),
    buildMachineDefault: z.array(z.string()).optional(),
    bulkRedirects: z.array(z.string()).optional(),
    cacheArtifact: z.array(z.string()).optional(),
    cacheArtifactUsageEvent: z.array(z.string()).optional(),
    ciInvocations: z.array(z.string()).optional(),
    ciLogs: z.array(z.string()).optional(),
    codeChecks: z.array(z.string()).optional(),
    codeOwners: z.array(z.string()).optional(),
    concurrentBuilds: z.array(z.string()).optional(),
    connect: z.array(z.string()).optional(),
    connectConfiguration: z.array(z.string()).optional(),
    connectConfigurationLink: z.array(z.string()).optional(),
    connectLogs: z.array(z.string()).optional(),
    connexClient: z.array(z.string()).optional(),
    connexClientProject: z.array(z.string()).optional(),
    connexContact: z.array(z.string()).optional(),
    connexInstallation: z.array(z.string()).optional(),
    connexToken: z.array(z.string()).optional(),
    cursorOriginInstallation: z.array(z.string()).optional(),
    dataCacheBillingSettings: z.array(z.string()).optional(),
    dataCacheNamespace: z.array(z.string()).optional(),
    defaultDeploymentProtection: z.array(z.string()).optional(),
    deployment: z.array(z.string()).optional(),
    deploymentBuildLogs: z.array(z.string()).optional(),
    deploymentCheck: z.array(z.string()).optional(),
    deploymentCheckPreview: z.array(z.string()).optional(),
    deploymentCheckReRunFromProductionBranch: z.array(z.string()).optional(),
    deploymentPolicy: z.array(z.string()).optional(),
    deploymentPreview: z.array(z.string()).optional(),
    deploymentPrivate: z.array(z.string()).optional(),
    deploymentProductionGit: z.array(z.string()).optional(),
    deploymentPromote: z.array(z.string()).optional(),
    deploymentRollback: z.array(z.string()).optional(),
    deploymentV0: z.array(z.string()).optional(),
    domain: z.array(z.string()).optional(),
    domainAcceptDelegation: z.array(z.string()).optional(),
    domainAuthCodes: z.array(z.string()).optional(),
    domainCertificate: z.array(z.string()).optional(),
    domainCheckConfig: z.array(z.string()).optional(),
    domainMove: z.array(z.string()).optional(),
    domainPurchase: z.array(z.string()).optional(),
    domainRecord: z.array(z.string()).optional(),
    domainTransferIn: z.array(z.string()).optional(),
    drain: z.array(z.string()).optional(),
    edgeCacheNamespace: z.array(z.string()).optional(),
    edgeConfig: z.array(z.string()).optional(),
    edgeConfigItem: z.array(z.string()).optional(),
    edgeConfigSchema: z.array(z.string()).optional(),
    edgeConfigToken: z.array(z.string()).optional(),
    endpointVerification: z.array(z.string()).optional(),
    environments: z.array(z.string()).optional(),
    event: z.array(z.string()).optional(),
    fileUpload: z.array(z.string()).optional(),
    flagsExplorerSubscription: z.array(z.string()).optional(),
    gitRepository: z.array(z.string()).optional(),
    imageOptimizationNewPrice: z.array(z.string()).optional(),
    integration: z.array(z.string()).optional(),
    integrationAccount: z.array(z.string()).optional(),
    integrationConfiguration: z.array(z.string()).optional(),
    integrationConfigurationProjects: z.array(z.string()).optional(),
    integrationConfigurationRole: z.array(z.string()).optional(),
    integrationConfigurationTransfer: z.array(z.string()).optional(),
    integrationDeploymentAction: z.array(z.string()).optional(),
    integrationEvent: z.array(z.string()).optional(),
    integrationLog: z.array(z.string()).optional(),
    integrationPullRequest: z.array(z.string()).optional(),
    integrationResource: z.array(z.string()).optional(),
    integrationResourceData: z.array(z.string()).optional(),
    integrationResourceReplCommand: z.array(z.string()).optional(),
    integrationResourceSecrets: z.array(z.string()).optional(),
    integrationSSOSession: z.array(z.string()).optional(),
    integrationStoreTokenSet: z.array(z.string()).optional(),
    integrationStrict: z.array(z.string()).optional(),
    integrationVercelConfigurationOverride: z.array(z.string()).optional(),
    ipBlocking: z.array(z.string()).optional(),
    job: z.array(z.string()).optional(),
    jobGlobal: z.array(z.string()).optional(),
    kmsIssuer: z.array(z.string()).optional(),
    kmsProjectGrant: z.array(z.string()).optional(),
    logDrain: z.array(z.string()).optional(),
    logs: z.array(z.string()).optional(),
    logsPreset: z.array(z.string()).optional(),
    marketplaceBillingData: z.array(z.string()).optional(),
    marketplaceExperimentationEdgeConfigData: z.array(z.string()).optional(),
    marketplaceExperimentationItem: z.array(z.string()).optional(),
    marketplaceFlexCommit: z.array(z.string()).optional(),
    marketplaceInstallationMember: z.array(z.string()).optional(),
    marketplaceInvoice: z.array(z.string()).optional(),
    marketplaceSettings: z.array(z.string()).optional(),
    Monitoring: z.array(z.string()).optional(),
    monitoringAlert: z.array(z.string()).optional(),
    monitoringChart: z.array(z.string()).optional(),
    monitoringQuery: z.array(z.string()).optional(),
    monitoringSettings: z.array(z.string()).optional(),
    notificationCustomerBudget: z.array(z.string()).optional(),
    notificationDeploymentFailed: z.array(z.string()).optional(),
    notificationDomainConfiguration: z.array(z.string()).optional(),
    notificationDomainExpire: z.array(z.string()).optional(),
    notificationDomainMoved: z.array(z.string()).optional(),
    notificationDomainPurchase: z.array(z.string()).optional(),
    notificationDomainRenewal: z.array(z.string()).optional(),
    notificationDomainTransfer: z.array(z.string()).optional(),
    notificationDomainUnverified: z.array(z.string()).optional(),
    NotificationMonitoringAlert: z.array(z.string()).optional(),
    notificationPaymentFailed: z.array(z.string()).optional(),
    notificationPreferences: z.array(z.string()).optional(),
    notificationStatementOfReasons: z.array(z.string()).optional(),
    notificationUsageAlert: z.array(z.string()).optional(),
    oauth2Application: z.array(z.string()).optional(),
    oauth2Connection: z.array(z.string()).optional(),
    observabilityConfiguration: z.array(z.string()).optional(),
    observabilityData: z.array(z.string()).optional(),
    observabilityFunnel: z.array(z.string()).optional(),
    observabilityNotebook: z.array(z.string()).optional(),
    oidcFederationPolicy: z.array(z.string()).optional(),
    onDemandBuild: z.array(z.string()).optional(),
    onDemandConcurrency: z.array(z.string()).optional(),
    openTelemetryEndpoint: z.array(z.string()).optional(),
    optionsAllowlist: z.array(z.string()).optional(),
    organization: z.array(z.string()).optional(),
    organizationDomain: z.array(z.string()).optional(),
    organizationTeam: z.array(z.string()).optional(),
    ownEvent: z.array(z.string()).optional(),
    pageIntegrity: z.array(z.string()).optional(),
    passwordProtection: z.array(z.string()).optional(),
    passwordProtectionInvoiceItem: z.array(z.string()).optional(),
    paymentMethod: z.array(z.string()).optional(),
    permissions: z.array(z.string()).optional(),
    postgres: z.array(z.string()).optional(),
    postgresStoreTokenSet: z.array(z.string()).optional(),
    previewDeploymentSuffix: z.array(z.string()).optional(),
    privateCloudAccount: z.array(z.string()).optional(),
    privateLinkEndpoint: z.array(z.string()).optional(),
    productionAliasProtectionBypass: z.array(z.string()).optional(),
    productionShareableLink: z.array(z.string()).optional(),
    project: z.array(z.string()).optional(),
    projectAccessGroup: z.array(z.string()).optional(),
    projectAnalyticsSampling: z.array(z.string()).optional(),
    projectAnalyticsUsage: z.array(z.string()).optional(),
    projectCheck: z.array(z.string()).optional(),
    projectCheckRun: z.array(z.string()).optional(),
    projectDeploymentExpiration: z.array(z.string()).optional(),
    projectDeploymentHook: z.array(z.string()).optional(),
    projectDeploymentProtectionStrict: z.array(z.string()).optional(),
    projectDomain: z.array(z.string()).optional(),
    projectDomainCheckConfig: z.array(z.string()).optional(),
    projectDomainMove: z.array(z.string()).optional(),
    projectDomainVerify: z.array(z.string()).optional(),
    projectEnvVars: z.array(z.string()).optional(),
    projectEnvVarsProduction: z.array(z.string()).optional(),
    projectEnvVarsUnownedByIntegration: z.array(z.string()).optional(),
    projectEvent: z.array(z.string()).optional(),
    projectFlags: z.array(z.string()).optional(),
    projectFlagsProduction: z.array(z.string()).optional(),
    projectFlagsSdkKey: z.array(z.string()).optional(),
    projectFromV0: z.array(z.string()).optional(),
    projectId: z.array(z.string()).optional(),
    projectIntegrationConfiguration: z.array(z.string()).optional(),
    projectLink: z.array(z.string()).optional(),
    projectMember: z.array(z.string()).optional(),
    projectMonitoring: z.array(z.string()).optional(),
    projectOIDCToken: z.array(z.string()).optional(),
    projectPermissions: z.array(z.string()).optional(),
    projectProductionBranch: z.array(z.string()).optional(),
    projectProtectionBypass: z.array(z.string()).optional(),
    projectRollingRelease: z.array(z.string()).optional(),
    projectRoutes: z.array(z.string()).optional(),
    projectSetting: z.array(z.string()).optional(),
    projectSupportCase: z.array(z.string()).optional(),
    projectSupportCaseComment: z.array(z.string()).optional(),
    projectTier: z.array(z.string()).optional(),
    projectTransfer: z.array(z.string()).optional(),
    projectTransferIn: z.array(z.string()).optional(),
    projectTransferOut: z.array(z.string()).optional(),
    projectTransferRequest: z.array(z.string()).optional(),
    projectUsage: z.array(z.string()).optional(),
    proTrialOnboarding: z.array(z.string()).optional(),
    rateLimit: z.array(z.string()).optional(),
    redis: z.array(z.string()).optional(),
    redisStoreTokenSet: z.array(z.string()).optional(),
    remoteCaching: z.array(z.string()).optional(),
    repository: z.array(z.string()).optional(),
    samlConfig: z.array(z.string()).optional(),
    seawallConfig: z.array(z.string()).optional(),
    secret: z.array(z.string()).optional(),
    securityConfig: z.array(z.string()).optional(),
    securityPlusConfiguration: z.array(z.string()).optional(),
    sensitiveEnvironmentVariablePolicy: z.array(z.string()).optional(),
    setting: z.array(z.string()).optional(),
    shareableLink: z.array(z.string()).optional(),
    shareableLinkStrict: z.array(z.string()).optional(),
    sharedEnvVarConnection: z.array(z.string()).optional(),
    sharedEnvVars: z.array(z.string()).optional(),
    sharedEnvVarsProduction: z.array(z.string()).optional(),
    skewProtection: z.array(z.string()).optional(),
    space: z.array(z.string()).optional(),
    spaceRun: z.array(z.string()).optional(),
    storeIsLocked: z.array(z.string()).optional(),
    storeTokenSetSensitive: z.array(z.string()).optional(),
    storeTransfer: z.array(z.string()).optional(),
    supportCase: z.array(z.string()).optional(),
    supportCaseComment: z.array(z.string()).optional(),
    team: z.array(z.string()).optional(),
    teamAccessRequest: z.array(z.string()).optional(),
    teamFellowMembership: z.array(z.string()).optional(),
    teamGitExclusivity: z.array(z.string()).optional(),
    teamInvite: z.array(z.string()).optional(),
    teamInviteCode: z.array(z.string()).optional(),
    teamInviteLink: z.array(z.string()).optional(),
    teamJoin: z.array(z.string()).optional(),
    teamMemberMfaStatus: z.array(z.string()).optional(),
    teamMicrofrontends: z.array(z.string()).optional(),
    teamOwnMembership: z.array(z.string()).optional(),
    teamOwnMembershipDisconnectSAML: z.array(z.string()).optional(),
    teamSudo: z.array(z.string()).optional(),
    teamTokenInvalidation: z.array(z.string()).optional(),
    token: z.array(z.string()).optional(),
    toolbarComment: z.array(z.string()).optional(),
    trustedIps: z.array(z.string()).optional(),
    trustedSources: z.array(z.string()).optional(),
    usage: z.array(z.string()).optional(),
    usageCycle: z.array(z.string()).optional(),
    user: z.array(z.string()).optional(),
    userConnection: z.array(z.string()).optional(),
    userMfaConfiguration: z.array(z.string()).optional(),
    userPreference: z.array(z.string()).optional(),
    userSudo: z.array(z.string()).optional(),
    v0Chat: z.array(z.string()).optional(),
    vcrRepository: z.array(z.string()).optional(),
    vercelAppInstallation: z.array(z.string()).optional(),
    vercelAppInstallationRequest: z.array(z.string()).optional(),
    vercelAuth: z.array(z.string()).optional(),
    vercelRun: z.array(z.string()).optional(),
    vpcPeeringConnection: z.array(z.string()).optional(),
    webAnalytics: z.array(z.string()).optional(),
    webAnalyticsPlan: z.array(z.string()).optional(),
    webAuthn: z.array(z.string()).optional(),
    webhook: z.array(z.string()).optional(),
    "webhook-event": z.array(z.string()).optional(),
    workflowRunData: z.array(z.string()).optional(),
  }).nullable().optional(),
  productionDeploymentsFastLane: z.boolean().nullable().optional(),
  protectedSourcemaps: z.boolean().nullable().optional(),
  protectionBypass: z.record(z.string(), z.unknown()).nullable().optional(),
  protectionConfig: z.object({
    sandboxUrls: z.object({
      inheritDeploymentProtection: z.boolean().optional(),
    }).optional(),
  }).nullable().optional(),
  resourceConfig: z.object({
    buildMachineElasticLastUpdated: z.number().optional(),
    buildMachineElasticReason: z.string().optional(),
    buildMachineSelection: z.string().optional(),
    buildMachineType: z.string().optional(),
    buildQueue: z.object({
      configuration: z.string().optional(),
    }).optional(),
    elasticConcurrencyEnabled: z.boolean().optional(),
    enableFunctionsBeta: z.boolean().optional(),
    fluid: z.boolean().optional(),
    functionDefaultMemoryType: z.string().optional(),
    functionDefaultRegions: z.array(z.string()).optional(),
    functionDefaultTimeout: z.number().optional(),
    functionZeroConfigFailover: z.boolean().optional(),
    isNSNBDisabled: z.boolean().optional(),
  }).nullable().optional(),
  rollbackDescription: z.object({
    createdAt: z.number().optional(),
    description: z.string().optional(),
    userId: z.string().optional(),
    username: z.string().optional(),
  }).nullable().optional(),
  rollingRelease: z.object({
    canaryResponseHeader: z.boolean().optional(),
    gate: z.object({
      action: z.string().optional(),
      checks: z.array(z.object({
        excludePaths: z.array(z.string()).optional(),
        excludeStatusCodes: z.array(z.number()).optional(),
        ingestWatermarkSeconds: z.number().optional(),
        minSampleSize: z.number().optional(),
        type: z.string().optional(),
      })).optional(),
      dryRun: z.boolean().optional(),
      enabled: z.boolean().optional(),
      failureThreshold: z.number().optional(),
      windowSize: z.number().optional(),
    }).optional(),
    stages: z.array(z.object({
      duration: z.number().optional(),
      linearShift: z.boolean().optional(),
      requireApproval: z.boolean().optional(),
      targetPercentage: z.number().optional(),
    })).optional(),
    target: z.string().optional(),
  }).nullable().optional(),
  rootDirectory: z.string().nullable().optional(),
  sandbox: z.object({
    failoverRegions: z.array(z.string()).optional(),
    region: z.string().optional(),
  }).nullable().optional(),
  security: z.object({
    attackModeActiveUntil: z.number().optional(),
    attackModeEnabled: z.boolean().optional(),
    attackModeUpdatedAt: z.number().optional(),
    botIdEnabled: z.boolean().optional(),
    firewallBypassIps: z.array(z.string()).optional(),
    firewallConfigVersion: z.number().optional(),
    firewallEnabled: z.boolean().optional(),
    firewallSeawallEnabled: z.boolean().optional(),
    firewallUpdatedAt: z.number().optional(),
    ja3Enabled: z.boolean().optional(),
    ja4Enabled: z.boolean().optional(),
    log_headers: z.array(z.string()).optional(),
    managedRules: z.object({
      ai_bots: z.object({
        action: z.string().optional(),
        active: z.boolean().optional(),
      }).optional(),
      bot_filter: z.object({
        action: z.string().optional(),
        active: z.boolean().optional(),
      }).optional(),
      owasp: z.object({
        action: z.string().optional(),
        active: z.boolean().optional(),
      }).optional(),
      traffic_sources: z.object({
        action: z.string().optional(),
        active: z.boolean().optional(),
      }).optional(),
      vercel_ruleset: z.object({
        action: z.string().optional(),
        active: z.boolean().optional(),
      }).optional(),
    }).optional(),
    pageIntegrityEnabled: z.boolean().optional(),
    rulesets: z.record(z.string(), z.unknown()).optional(),
    securityPlus: z.boolean().optional(),
    securityPlusMetadata: z.object({
      firstEnabledAt: z.number().optional(),
      updatedAt: z.number().optional(),
    }).optional(),
  }).nullable().optional(),
  serverlessFunctionZeroConfigFailover: z.boolean().nullable().optional(),
  services: z.array(z.object({
    framework: z.string().optional(),
    runtime: z.string().optional(),
    serviceName: z.string().optional(),
    serviceType: z.string().optional(),
  })).nullable().optional(),
  skewProtectionAllowedDomains: z.array(z.string()).nullable().optional(),
  skewProtectionBoundaryAt: z.number().nullable().optional(),
  skewProtectionMaxAge: z.number().nullable().optional(),
  skipGitConnectDuringLink: z.boolean().nullable().optional(),
  sourceFilesOutsideRootDirectory: z.boolean().nullable().optional(),
  speedInsights: z.object({
    canceledAt: z.number().optional(),
    dataReceivedAt: z.number().optional(),
    disabledAt: z.number().optional(),
    enabledAt: z.number().optional(),
    hasData: z.boolean().optional(),
    id: z.string().optional(),
    paidAt: z.number().optional(),
  }).nullable().optional(),
  ssoProtection: z.object({
    april2026SecurityIncidentMigrationAppliedFrom: z.string().optional(),
    cve55182MigrationAppliedFrom: z.string().optional(),
    deploymentType: z.string().optional(),
  }).nullable().optional(),
  staticIps: z.object({
    builds: z.boolean().optional(),
    enabled: z.boolean().optional(),
    regions: z.array(z.string()).optional(),
  }).nullable().optional(),
  targets: z.record(z.string(), z.unknown()).nullable().optional(),
  tier: z.string().nullable().optional(),
  tracing: z.object({
    domains: z.string().optional(),
    ignorePaths: z.array(z.string()).optional(),
    samplingRules: z.array(z.object({
      destination: z.string().optional(),
      env: z.string().optional(),
      rate: z.number().optional(),
      requestPath: z.string().optional(),
    })).optional(),
  }).nullable().optional(),
  transferCompletedAt: z.number().nullable().optional(),
  transferredFromAccountId: z.string().nullable().optional(),
  transferStartedAt: z.number().nullable().optional(),
  transferToAccountId: z.string().nullable().optional(),
  trustedIps: z.object({
    addresses: z.array(z.object({
      note: z.string().optional(),
      value: z.string().optional(),
    })).optional(),
    deploymentType: z.string().optional(),
    protectionMode: z.string().optional(),
  }).nullable().optional(),
  trustedSources: z.object({
    enableVercelCiSameRepository: z.boolean().optional(),
    oidcProviders: z.record(z.string(), z.unknown()).optional(),
    projects: z.record(z.string(), z.unknown()).optional(),
  }).nullable().optional(),
  updatedAt: z.number().nullable().optional(),
  usageStatus: z.object({
    bypassThrottleUntil: z.number().optional(),
    exceededAllowanceUntil: z.number().optional(),
    kind: z.string().optional(),
    teamThrottled: z.boolean().optional(),
    throttled: z.boolean().optional(),
  }).nullable().optional(),
  v0: z.boolean().nullable().optional(),
  v0Created: z.boolean().nullable().optional(),
  webAnalytics: z.object({
    canceledAt: z.number().optional(),
    disabledAt: z.number().optional(),
    enabledAt: z.number().optional(),
    hasData: z.boolean().optional(),
    id: z.string().optional(),
  }).nullable().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  autoExposeSystemEnvs: z.boolean().optional(),
  autoAssignCustomDomains: z.boolean().optional(),
  autoAssignCustomDomainsUpdatedBy: z.string().optional(),
  buildCommand: z.string().max(256).optional(),
  commandForIgnoringBuildStep: z.string().max(256).optional(),
  customerSupportCodeVisibility: z.boolean().optional(),
  devCommand: z.string().max(256).optional(),
  directoryListing: z.boolean().optional(),
  framework: z.enum([
    "container",
    "blitzjs",
    "nextjs",
    "gatsby",
    "remix",
    "react-router",
    "astro",
    "hexo",
    "eleventy",
    "docusaurus-2",
    "docusaurus",
    "preact",
    "solidstart-1",
    "solidstart",
    "dojo",
    "ember",
    "vue",
    "scully",
    "ionic-angular",
    "angular",
    "polymer",
    "svelte",
    "sveltekit",
    "sveltekit-1",
    "ionic-react",
    "create-react-app",
    "gridsome",
    "umijs",
    "sapper",
    "saber",
    "stencil",
    "nuxtjs",
    "redwoodjs",
    "hugo",
    "jekyll",
    "brunch",
    "middleman",
    "zola",
    "hydrogen",
    "vite",
    "tanstack-start",
    "tanstack-start-lovable",
    "vitepress",
    "vuepress",
    "parcel",
    "fastapi",
    "flask",
    "fasthtml",
    "django",
    "ash",
    "factory-eve",
    "eve",
    "sanity",
    "sanity-v2",
    "storybook",
    "nitro",
    "hono",
    "express",
    "h3",
    "koa",
    "nestjs",
    "elysia",
    "fastify",
    "xmcp",
    "python",
    "ruby",
    "rust",
    "axum",
    "actix-web",
    "bun",
    "node",
    "go",
    "services",
    "mastra",
  ]).optional(),
  gitForkProtection: z.boolean().optional(),
  gitLFS: z.boolean().optional(),
  protectedSourcemaps: z.boolean().optional(),
  installCommand: z.string().max(256).optional(),
  name: z.string().max(100).optional(),
  nodeVersion: z.enum([
    "24.x",
    "22.x",
    "20.x",
    "18.x",
    "16.x",
    "14.x",
    "12.x",
    "10.x",
  ]).optional(),
  outputDirectory: z.string().max(256).optional(),
  previewDeploymentsDisabled: z.boolean().optional(),
  previewDeploymentSuffix: z.string().max(253).optional(),
  resourceConfig: z.object({
    buildMachineType: z.enum([
      "basic",
      "enhanced",
      "turbo",
      "standard",
      "elastic",
    ]).optional(),
    fluid: z.boolean().optional(),
    functionDefaultRegions: z.array(z.string().max(4)).optional(),
    functionDefaultTimeout: z.number().min(1).max(900).optional(),
    functionDefaultMemoryType: z.enum([
      "standard_legacy",
      "standard",
      "performance",
      "performance_xl",
    ]).optional(),
    functionZeroConfigFailover: z.boolean().optional(),
    elasticConcurrencyEnabled: z.boolean().optional(),
    buildMachineSelection: z.enum(["elastic", "fixed"]).optional(),
    buildMachineElasticLastUpdated: z.number().optional(),
    buildMachineElasticReason: z.enum([
      "oom-failure",
      "enospc-failure",
      "build-timeout-failure",
      "basic-floor",
      "high-peak-memory",
      "sustained-high-cpu",
      "high-peak-disk",
      "long-build-duration",
      "short-build-duration",
      "enterprise-floor",
    ]).optional(),
    isNSNBDisabled: z.boolean().optional(),
    buildQueue: z.object({
      configuration: z.enum([
        "SKIP_NAMESPACE_QUEUE",
        "WAIT_FOR_NAMESPACE_QUEUE",
      ]).optional(),
    }).optional(),
    enableFunctionsBeta: z.boolean().optional(),
  }).optional(),
  publicSource: z.boolean().optional(),
  rootDirectory: z.string().max(256).optional(),
  serverlessFunctionRegion: z.string().max(4).optional(),
  serverlessFunctionZeroConfigFailover: z.boolean().optional(),
  skewProtectionBoundaryAt: z.number().int().min(0).optional(),
  skewProtectionMaxAge: z.number().int().min(0).optional(),
  skewProtectionAllowedDomains: z.array(z.string().max(254)).optional(),
  skipGitConnectDuringLink: z.boolean().optional(),
  sourceFilesOutsideRootDirectory: z.boolean().optional(),
  enablePreviewFeedback: z.boolean().optional(),
  enableProductionFeedback: z.boolean().optional(),
  enableAffectedProjectsDeployments: z.boolean().optional(),
  enableExternalRewriteCaching: z.boolean().optional(),
  staticIps: z.object({
    enabled: z.boolean(),
  }).optional(),
  tracing: z.object({
    domains: z.string().optional(),
    ignorePaths: z.array(z.string()).optional(),
    samplingRules: z.array(z.object({
      rate: z.number().min(0).max(1),
      env: z.enum(["production", "preview"]).optional(),
      requestPath: z.string().optional(),
      destination: z.enum(["internal", "external"]).optional(),
    })).optional(),
  }).optional(),
  oidcTokenConfig: z.object({
    enabled: z.boolean().optional(),
    issuerMode: z.enum(["team", "global"]).optional(),
  }).optional(),
  passwordProtection: z.object({
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]),
    password: z.string().max(72).optional(),
  }).optional(),
  passport: z.object({
    connectorId: z.string(),
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]).optional(),
  }).optional(),
  sandbox: z.object({
    region: z.enum([
      "iad1",
      "sfo1",
      "cle1",
      "cdg1",
      "fra1",
      "arn1",
      "sin1",
      "pdx1",
      "lhr1",
      "icn1",
      "bom1",
      "cpt1",
      "dub1",
      "gru1",
      "hkg1",
      "syd1",
      "yul1",
      "hnd1",
      "kix1",
    ]).optional(),
    failoverRegions: z.array(
      z.enum([
        "iad1",
        "sfo1",
        "cle1",
        "cdg1",
        "fra1",
        "arn1",
        "sin1",
        "pdx1",
        "lhr1",
        "icn1",
        "bom1",
        "cpt1",
        "dub1",
        "gru1",
        "hkg1",
        "syd1",
        "yul1",
        "hnd1",
        "kix1",
      ]),
    ).optional(),
  }).optional(),
  ssoProtection: z.object({
    deploymentType: z.enum([
      "all",
      "preview",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]),
  }).optional(),
  trustedIps: z.object({
    deploymentType: z.enum([
      "all",
      "preview",
      "production",
      "prod_deployment_urls_and_all_previews",
      "all_except_custom_domains",
    ]),
    addresses: z.array(z.object({
      value: z.string(),
      note: z.string().max(20).optional(),
    })),
    protectionMode: z.enum(["exclusive", "additional"]),
  }).optional(),
  trustedSources: z.object({
    enableVercelCiSameRepository: z.boolean().optional(),
    projects: z.record(z.string(), z.unknown()).optional(),
    oidcProviders: z.record(z.string(), z.unknown()).optional(),
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
  optionsAllowlist: z.object({
    paths: z.array(z.object({
      value: z.string().regex(new RegExp("^/.*")),
    })),
  }).optional(),
  connectConfigurations: z.array(z.record(z.string(), z.unknown())).optional(),
  dismissedToasts: z.array(z.object({
    key: z.string(),
    dismissedAt: z.number(),
    action: z.enum(["cancel", "accept", "delete"]),
    value: z.string(),
  })).optional(),
  environmentVariables: z.array(z.object({
    key: z.string(),
    target: z.array(z.enum(["production", "preview", "development"])),
    gitBranch: z.string().max(250).optional(),
    type: z.enum(["system", "encrypted", "plain", "sensitive"]).optional(),
    value: z.string(),
  })).optional(),
  gitRepository: z.object({
    repo: z.string(),
    type: z.enum([
      "github",
      "github-limited",
      "gitlab",
      "bitbucket",
      "vercel",
      "cursor-origin",
    ]),
  }).optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Projects. Registered at `@swamp/vercel/projects/projects`. */
export const model = {
  type: "@swamp/vercel/projects/projects",
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
      toVersion: "2026.08.04.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.06.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.13.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.20.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.22.1",
      description: "Added: sandbox",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.29.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.31.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.10.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.12.1",
      description: "No schema changes",
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
      description: "Projects resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Projects",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v11/projects";
        const body: Record<string, unknown> = {};
        if (g.enablePreviewFeedback !== undefined) {
          body.enablePreviewFeedback = g.enablePreviewFeedback;
        }
        if (g.enableProductionFeedback !== undefined) {
          body.enableProductionFeedback = g.enableProductionFeedback;
        }
        if (g.previewDeploymentsDisabled !== undefined) {
          body.previewDeploymentsDisabled = g.previewDeploymentsDisabled;
        }
        if (g.previewDeploymentSuffix !== undefined) {
          body.previewDeploymentSuffix = g.previewDeploymentSuffix;
        }
        if (g.buildCommand !== undefined) body.buildCommand = g.buildCommand;
        if (g.commandForIgnoringBuildStep !== undefined) {
          body.commandForIgnoringBuildStep = g.commandForIgnoringBuildStep;
        }
        if (g.devCommand !== undefined) body.devCommand = g.devCommand;
        if (g.environmentVariables !== undefined) {
          body.environmentVariables = g.environmentVariables;
        }
        if (g.framework !== undefined) body.framework = g.framework;
        if (g.gitRepository !== undefined) body.gitRepository = g.gitRepository;
        if (g.installCommand !== undefined) {
          body.installCommand = g.installCommand;
        }
        if (g.name !== undefined) body.name = g.name;
        if (g.skipGitConnectDuringLink !== undefined) {
          body.skipGitConnectDuringLink = g.skipGitConnectDuringLink;
        }
        if (g.ssoProtection !== undefined) body.ssoProtection = g.ssoProtection;
        if (g.sandbox !== undefined) body.sandbox = g.sandbox;
        if (g.outputDirectory !== undefined) {
          body.outputDirectory = g.outputDirectory;
        }
        if (g.publicSource !== undefined) body.publicSource = g.publicSource;
        if (g.rootDirectory !== undefined) body.rootDirectory = g.rootDirectory;
        if (g.serverlessFunctionRegion !== undefined) {
          body.serverlessFunctionRegion = g.serverlessFunctionRegion;
        }
        if (g.serverlessFunctionZeroConfigFailover !== undefined) {
          body.serverlessFunctionZeroConfigFailover =
            g.serverlessFunctionZeroConfigFailover;
        }
        if (g.oidcTokenConfig !== undefined) {
          body.oidcTokenConfig = g.oidcTokenConfig;
        }
        if (g.enableAffectedProjectsDeployments !== undefined) {
          body.enableAffectedProjectsDeployments =
            g.enableAffectedProjectsDeployments;
        }
        if (g.resourceConfig !== undefined) {
          body.resourceConfig = g.resourceConfig;
        }
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
      description: "Get a Projects",
      arguments: z.object({
        id: z.string().describe("The ID of the Projects"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects";
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
        "Look up an existing Projects by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v10/projects";
        const filters: [string, string][] = [];
        if (g.autoExposeSystemEnvs !== undefined) {
          filters.push([
            "autoExposeSystemEnvs",
            String(g.autoExposeSystemEnvs),
          ]);
        }
        if (g.autoAssignCustomDomains !== undefined) {
          filters.push([
            "autoAssignCustomDomains",
            String(g.autoAssignCustomDomains),
          ]);
        }
        if (g.autoAssignCustomDomainsUpdatedBy !== undefined) {
          filters.push([
            "autoAssignCustomDomainsUpdatedBy",
            String(g.autoAssignCustomDomainsUpdatedBy),
          ]);
        }
        if (g.buildCommand !== undefined) {
          filters.push(["buildCommand", String(g.buildCommand)]);
        }
        if (g.commandForIgnoringBuildStep !== undefined) {
          filters.push([
            "commandForIgnoringBuildStep",
            String(g.commandForIgnoringBuildStep),
          ]);
        }
        if (g.customerSupportCodeVisibility !== undefined) {
          filters.push([
            "customerSupportCodeVisibility",
            String(g.customerSupportCodeVisibility),
          ]);
        }
        if (g.devCommand !== undefined) {
          filters.push(["devCommand", String(g.devCommand)]);
        }
        if (g.directoryListing !== undefined) {
          filters.push(["directoryListing", String(g.directoryListing)]);
        }
        if (g.framework !== undefined) {
          filters.push(["framework", String(g.framework)]);
        }
        if (g.gitForkProtection !== undefined) {
          filters.push(["gitForkProtection", String(g.gitForkProtection)]);
        }
        if (g.gitLFS !== undefined) filters.push(["gitLFS", String(g.gitLFS)]);
        if (g.protectedSourcemaps !== undefined) {
          filters.push(["protectedSourcemaps", String(g.protectedSourcemaps)]);
        }
        if (g.installCommand !== undefined) {
          filters.push(["installCommand", String(g.installCommand)]);
        }
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.nodeVersion !== undefined) {
          filters.push(["nodeVersion", String(g.nodeVersion)]);
        }
        if (g.outputDirectory !== undefined) {
          filters.push(["outputDirectory", String(g.outputDirectory)]);
        }
        if (g.previewDeploymentsDisabled !== undefined) {
          filters.push([
            "previewDeploymentsDisabled",
            String(g.previewDeploymentsDisabled),
          ]);
        }
        if (g.previewDeploymentSuffix !== undefined) {
          filters.push([
            "previewDeploymentSuffix",
            String(g.previewDeploymentSuffix),
          ]);
        }
        if (g.publicSource !== undefined) {
          filters.push(["publicSource", String(g.publicSource)]);
        }
        if (g.rootDirectory !== undefined) {
          filters.push(["rootDirectory", String(g.rootDirectory)]);
        }
        if (g.serverlessFunctionRegion !== undefined) {
          filters.push([
            "serverlessFunctionRegion",
            String(g.serverlessFunctionRegion),
          ]);
        }
        if (g.serverlessFunctionZeroConfigFailover !== undefined) {
          filters.push([
            "serverlessFunctionZeroConfigFailover",
            String(g.serverlessFunctionZeroConfigFailover),
          ]);
        }
        if (g.skewProtectionBoundaryAt !== undefined) {
          filters.push([
            "skewProtectionBoundaryAt",
            String(g.skewProtectionBoundaryAt),
          ]);
        }
        if (g.skewProtectionMaxAge !== undefined) {
          filters.push([
            "skewProtectionMaxAge",
            String(g.skewProtectionMaxAge),
          ]);
        }
        if (g.skipGitConnectDuringLink !== undefined) {
          filters.push([
            "skipGitConnectDuringLink",
            String(g.skipGitConnectDuringLink),
          ]);
        }
        if (g.sourceFilesOutsideRootDirectory !== undefined) {
          filters.push([
            "sourceFilesOutsideRootDirectory",
            String(g.sourceFilesOutsideRootDirectory),
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
        if (g.enableAffectedProjectsDeployments !== undefined) {
          filters.push([
            "enableAffectedProjectsDeployments",
            String(g.enableAffectedProjectsDeployments),
          ]);
        }
        if (g.enableExternalRewriteCaching !== undefined) {
          filters.push([
            "enableExternalRewriteCaching",
            String(g.enableExternalRewriteCaching),
          ]);
        }
        if (g.accountId !== undefined) {
          filters.push(["accountId", String(g.accountId)]);
        }
        if (g.appliedCve55182Migration !== undefined) {
          filters.push([
            "appliedCve55182Migration",
            String(g.appliedCve55182Migration),
          ]);
        }
        if (g.avatar !== undefined) filters.push(["avatar", String(g.avatar)]);
        if (g.concurrencyBucketName !== undefined) {
          filters.push([
            "concurrencyBucketName",
            String(g.concurrencyBucketName),
          ]);
        }
        if (g.connectBuildsEnabled !== undefined) {
          filters.push([
            "connectBuildsEnabled",
            String(g.connectBuildsEnabled),
          ]);
        }
        if (g.connectConfigurationId !== undefined) {
          filters.push([
            "connectConfigurationId",
            String(g.connectConfigurationId),
          ]);
        }
        if (g.createdAt !== undefined) {
          filters.push(["createdAt", String(g.createdAt)]);
        }
        if (g.hasActiveBranches !== undefined) {
          filters.push(["hasActiveBranches", String(g.hasActiveBranches)]);
        }
        if (g.hasDeployments !== undefined) {
          filters.push(["hasDeployments", String(g.hasDeployments)]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.live !== undefined) filters.push(["live", String(g.live)]);
        if (g.passiveConnectConfigurationId !== undefined) {
          filters.push([
            "passiveConnectConfigurationId",
            String(g.passiveConnectConfigurationId),
          ]);
        }
        if (g.paused !== undefined) filters.push(["paused", String(g.paused)]);
        if (g.productionDeploymentsFastLane !== undefined) {
          filters.push([
            "productionDeploymentsFastLane",
            String(g.productionDeploymentsFastLane),
          ]);
        }
        if (g.tier !== undefined) filters.push(["tier", String(g.tier)]);
        if (g.transferCompletedAt !== undefined) {
          filters.push(["transferCompletedAt", String(g.transferCompletedAt)]);
        }
        if (g.transferredFromAccountId !== undefined) {
          filters.push([
            "transferredFromAccountId",
            String(g.transferredFromAccountId),
          ]);
        }
        if (g.transferStartedAt !== undefined) {
          filters.push(["transferStartedAt", String(g.transferStartedAt)]);
        }
        if (g.transferToAccountId !== undefined) {
          filters.push(["transferToAccountId", String(g.transferToAccountId)]);
        }
        if (g.updatedAt !== undefined) {
          filters.push(["updatedAt", String(g.updatedAt)]);
        }
        if (g.v0 !== undefined) filters.push(["v0", String(g.v0)]);
        if (g.v0Created !== undefined) {
          filters.push(["v0Created", String(g.v0Created)]);
        }
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(endpoint, "none", { token: g.token }, {
          teamId: g.teamId,
          slug: g.slug,
        }, undefined);
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
          throw new Error(`No projects found matching filters: ${filterDesc}`);
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
      description:
        "Import an existing Projects by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Projects to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects";
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
      description: "Update Projects attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Projects by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects";
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
        if (g.autoExposeSystemEnvs !== undefined) {
          body.autoExposeSystemEnvs = g.autoExposeSystemEnvs;
        }
        if (g.autoAssignCustomDomains !== undefined) {
          body.autoAssignCustomDomains = g.autoAssignCustomDomains;
        }
        if (g.autoAssignCustomDomainsUpdatedBy !== undefined) {
          body.autoAssignCustomDomainsUpdatedBy =
            g.autoAssignCustomDomainsUpdatedBy;
        }
        if (g.buildCommand !== undefined) body.buildCommand = g.buildCommand;
        if (g.commandForIgnoringBuildStep !== undefined) {
          body.commandForIgnoringBuildStep = g.commandForIgnoringBuildStep;
        }
        if (g.customerSupportCodeVisibility !== undefined) {
          body.customerSupportCodeVisibility = g.customerSupportCodeVisibility;
        }
        if (g.devCommand !== undefined) body.devCommand = g.devCommand;
        if (g.directoryListing !== undefined) {
          body.directoryListing = g.directoryListing;
        }
        if (g.framework !== undefined) body.framework = g.framework;
        if (g.gitForkProtection !== undefined) {
          body.gitForkProtection = g.gitForkProtection;
        }
        if (g.gitLFS !== undefined) body.gitLFS = g.gitLFS;
        if (g.protectedSourcemaps !== undefined) {
          body.protectedSourcemaps = g.protectedSourcemaps;
        }
        if (g.installCommand !== undefined) {
          body.installCommand = g.installCommand;
        }
        if (g.name !== undefined) body.name = g.name;
        if (g.nodeVersion !== undefined) body.nodeVersion = g.nodeVersion;
        if (g.outputDirectory !== undefined) {
          body.outputDirectory = g.outputDirectory;
        }
        if (g.previewDeploymentsDisabled !== undefined) {
          body.previewDeploymentsDisabled = g.previewDeploymentsDisabled;
        }
        if (g.previewDeploymentSuffix !== undefined) {
          body.previewDeploymentSuffix = g.previewDeploymentSuffix;
        }
        if (g.resourceConfig !== undefined) {
          body.resourceConfig = g.resourceConfig;
        }
        if (g.publicSource !== undefined) body.publicSource = g.publicSource;
        if (g.rootDirectory !== undefined) body.rootDirectory = g.rootDirectory;
        if (g.serverlessFunctionRegion !== undefined) {
          body.serverlessFunctionRegion = g.serverlessFunctionRegion;
        }
        if (g.serverlessFunctionZeroConfigFailover !== undefined) {
          body.serverlessFunctionZeroConfigFailover =
            g.serverlessFunctionZeroConfigFailover;
        }
        if (g.skewProtectionBoundaryAt !== undefined) {
          body.skewProtectionBoundaryAt = g.skewProtectionBoundaryAt;
        }
        if (g.skewProtectionMaxAge !== undefined) {
          body.skewProtectionMaxAge = g.skewProtectionMaxAge;
        }
        if (g.skewProtectionAllowedDomains !== undefined) {
          body.skewProtectionAllowedDomains = g.skewProtectionAllowedDomains;
        }
        if (g.skipGitConnectDuringLink !== undefined) {
          body.skipGitConnectDuringLink = g.skipGitConnectDuringLink;
        }
        if (g.sourceFilesOutsideRootDirectory !== undefined) {
          body.sourceFilesOutsideRootDirectory =
            g.sourceFilesOutsideRootDirectory;
        }
        if (g.enablePreviewFeedback !== undefined) {
          body.enablePreviewFeedback = g.enablePreviewFeedback;
        }
        if (g.enableProductionFeedback !== undefined) {
          body.enableProductionFeedback = g.enableProductionFeedback;
        }
        if (g.enableAffectedProjectsDeployments !== undefined) {
          body.enableAffectedProjectsDeployments =
            g.enableAffectedProjectsDeployments;
        }
        if (g.enableExternalRewriteCaching !== undefined) {
          body.enableExternalRewriteCaching = g.enableExternalRewriteCaching;
        }
        if (g.staticIps !== undefined) body.staticIps = g.staticIps;
        if (g.tracing !== undefined) body.tracing = g.tracing;
        if (g.oidcTokenConfig !== undefined) {
          body.oidcTokenConfig = g.oidcTokenConfig;
        }
        if (g.passwordProtection !== undefined) {
          body.passwordProtection = g.passwordProtection;
        }
        if (g.passport !== undefined) body.passport = g.passport;
        if (g.sandbox !== undefined) body.sandbox = g.sandbox;
        if (g.ssoProtection !== undefined) body.ssoProtection = g.ssoProtection;
        if (g.trustedIps !== undefined) body.trustedIps = g.trustedIps;
        if (g.trustedSources !== undefined) {
          body.trustedSources = g.trustedSources;
        }
        if (g.deploymentPolicy !== undefined) {
          body.deploymentPolicy = g.deploymentPolicy;
        }
        if (g.optionsAllowlist !== undefined) {
          body.optionsAllowlist = g.optionsAllowlist;
        }
        if (g.connectConfigurations !== undefined) {
          body.connectConfigurations = g.connectConfigurations;
        }
        if (g.dismissedToasts !== undefined) {
          body.dismissedToasts = g.dismissedToasts;
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
      description: "Delete the Projects",
      arguments: z.object({
        id: z.string().describe("The ID of the Projects"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects";
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
      description: "Sync Projects state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Projects by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v9/projects";
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
