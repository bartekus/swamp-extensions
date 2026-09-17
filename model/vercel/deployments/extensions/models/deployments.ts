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

// Auto-generated extension model for @swamp/vercel/deployments/deployments
// Do not edit manually. Re-generate with: deno task generate:vercel

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Vercel Deployments.
 *
 * Wraps the Vercel API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, listAll, read, remove, tryRead } from "./_lib/vercel.ts";

const GlobalArgsSchema = z.object({
  teamId: z.string().optional().describe("Vercel team ID"),
  slug: z.string().optional().describe(
    "Vercel team slug (alternative to teamId)",
  ),
  buildMachine: z.enum(["turbo"]).describe(
    "Selects a custom build machine for this deployment without changing project settings.",
  ).optional(),
  customEnvironmentSlugOrId: z.string().describe(
    "The slug or ID of a custom environment to deploy to, overriding the default target environment. When omitted, the deployment targets the environment inferred from the branch (production or preview).",
  ).optional(),
  deploymentId: z.string().describe(
    "The ID of an existing deployment to redeploy. All project settings and environment variables are inherited from the original unless explicitly overridden in this request. The redeployment gets a new ID, URL, and build.",
  ).optional(),
  files: z.array(z.object({
    data: z.string(),
    encoding: z.enum(["base64", "utf-8"]).optional(),
    file: z.string(),
  })).describe(
    "The files to include in the deployment. Each entry is either an inlined file (with `data` and `encoding`) or a reference to a previously uploaded file (with `sha` and `size`). Required for non-git deployments. Cannot be used together with `gitSource`.",
  ).optional(),
  gitAccessToken: z.string().max(1024).describe(
    "Available only to Vercel platform accounts. A read-only GitHub access token scoped to the requested repository. Use a token with a lifetime of 24 hours or less that remains valid until source retrieval completes.",
  ).optional(),
  gitMetadata: z.object({
    remoteUrl: z.string().optional(),
    commitAuthorName: z.string().optional(),
    commitAuthorEmail: z.string().optional(),
    commitMessage: z.string().optional(),
    commitRef: z.string().optional(),
    commitSha: z.string().optional(),
    dirty: z.boolean().optional(),
    ci: z.boolean().optional(),
    ciType: z.string().optional(),
    ciGitProviderUsername: z.string().optional(),
    ciGitRepoVisibility: z.string().optional(),
    rootDirectory: z.string().optional(),
  }).describe("Populates initial git metadata for different git providers.")
    .optional(),
  gitSource: z.object({
    type: z.enum(["vercel"]),
    sha: z.string(),
  }).optional(),
  meta: z.record(z.string(), z.unknown()).describe(
    "An object containing the deployment's metadata. Multiple key-value pairs can be attached to a deployment. For deployments created with a Cursor Origin `gitSource`, Vercel automatically adds `cursorOriginDeployment`, `cursorOriginCommitSha`, `cursorOriginCommitRef`, `cursorOriginCommitMessage`, `cursorOriginCommitAuthorName`, `cursorOriginCommitAuthorEmail` when available, `cursorOriginOwner`, `cursorOriginRepo`, `cursorOriginRepoId`, and `cursorOriginPrId` for pull request deployments.",
  ).optional(),
  monorepoManager: z.string().describe(
    "The monorepo manager that is being used for this deployment. When `null` is used no monorepo manager is selected",
  ).optional(),
  name: z.string().describe(
    "A string with the project name used in the deployment URL",
  ),
  project: z.string().describe(
    "The target project identifier in which the deployment will be created. When defined, this parameter overrides name",
  ).optional(),
  projectSettings: z.object({
    buildCommand: z.string().max(256).optional(),
    commandForIgnoringBuildStep: z.string().max(256).optional(),
    devCommand: z.string().max(256).optional(),
    framework: z.enum([
      "services",
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
      "mastra",
    ]).optional(),
    installCommand: z.string().max(256).optional(),
    nodeVersion: z.enum([
      "24.x",
      "22.x",
      "20.x",
      "18.x",
      "16.x",
      "14.x",
      "12.x",
      "10.x",
      "8.10.x",
    ]).optional(),
    outputDirectory: z.string().max(256).optional(),
    rootDirectory: z.string().max(256).optional(),
    serverlessFunctionRegion: z.string().max(4).optional(),
    skipGitConnectDuringLink: z.boolean().optional(),
    sourceFilesOutsideRootDirectory: z.boolean().optional(),
  }).describe(
    "Project settings that will be applied to the deployment. It is required for the first deployment of a project and will be saved for any following deployments",
  ).optional(),
  target: z.string().describe(
    "Either not defined, `staging`, `production`, or a custom environment identifier. If `staging`, a staging alias in the format `<project>-<team>.vercel.app` will be assigned. If `production`, any aliases defined in `alias` will be assigned. If omitted, the target will be `preview`.",
  ).optional(),
  withLatestCommit: z.boolean().describe(
    "When `true` and `deploymentId` is passed in, the sha from the previous deployment's `gitSource` is removed forcing the latest commit to be used.",
  ).optional(),
  token: z.string().meta({ sensitive: true }).describe(
    "Vercel API token; overrides the VERCEL_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
});

const ResourceSchema = z.object({
  id: z.string(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  teamId: z.string().optional(),
  slug: z.string().optional(),
  buildMachine: z.enum(["turbo"]).optional(),
  customEnvironmentSlugOrId: z.string().optional(),
  deploymentId: z.string().optional(),
  files: z.array(z.object({
    data: z.string(),
    encoding: z.enum(["base64", "utf-8"]).optional(),
    file: z.string(),
  })).optional(),
  gitAccessToken: z.string().max(1024).optional(),
  gitMetadata: z.object({
    remoteUrl: z.string().optional(),
    commitAuthorName: z.string().optional(),
    commitAuthorEmail: z.string().optional(),
    commitMessage: z.string().optional(),
    commitRef: z.string().optional(),
    commitSha: z.string().optional(),
    dirty: z.boolean().optional(),
    ci: z.boolean().optional(),
    ciType: z.string().optional(),
    ciGitProviderUsername: z.string().optional(),
    ciGitRepoVisibility: z.string().optional(),
    rootDirectory: z.string().optional(),
  }).optional(),
  gitSource: z.object({
    type: z.enum(["vercel"]),
    sha: z.string(),
  }).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  monorepoManager: z.string().optional(),
  name: z.string().optional(),
  project: z.string().optional(),
  projectSettings: z.object({
    buildCommand: z.string().max(256).optional(),
    commandForIgnoringBuildStep: z.string().max(256).optional(),
    devCommand: z.string().max(256).optional(),
    framework: z.enum([
      "services",
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
      "mastra",
    ]).optional(),
    installCommand: z.string().max(256).optional(),
    nodeVersion: z.enum([
      "24.x",
      "22.x",
      "20.x",
      "18.x",
      "16.x",
      "14.x",
      "12.x",
      "10.x",
      "8.10.x",
    ]).optional(),
    outputDirectory: z.string().max(256).optional(),
    rootDirectory: z.string().max(256).optional(),
    serverlessFunctionRegion: z.string().max(4).optional(),
    skipGitConnectDuringLink: z.boolean().optional(),
    sourceFilesOutsideRootDirectory: z.boolean().optional(),
  }).optional(),
  target: z.string().optional(),
  withLatestCommit: z.boolean().optional(),
  token: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Vercel Deployments. Registered at `@swamp/vercel/deployments/deployments`. */
export const model = {
  type: "@swamp/vercel/deployments/deployments",
  version: "2026.09.17.1",
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
      description: "Added: gitAccessToken",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.19.1",
      description: "Added: gitAccessToken",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
      description: "Added: buildMachine",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Deployments resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Deployments",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v13/deployments";
        const body: Record<string, unknown> = {};
        if (g.buildMachine !== undefined) body.buildMachine = g.buildMachine;
        if (g.customEnvironmentSlugOrId !== undefined) {
          body.customEnvironmentSlugOrId = g.customEnvironmentSlugOrId;
        }
        if (g.deploymentId !== undefined) body.deploymentId = g.deploymentId;
        if (g.files !== undefined) body.files = g.files;
        if (g.gitAccessToken !== undefined) {
          body.gitAccessToken = g.gitAccessToken;
        }
        if (g.gitMetadata !== undefined) body.gitMetadata = g.gitMetadata;
        if (g.gitSource !== undefined) body.gitSource = g.gitSource;
        if (g.meta !== undefined) body.meta = g.meta;
        if (g.monorepoManager !== undefined) {
          body.monorepoManager = g.monorepoManager;
        }
        if (g.name !== undefined) body.name = g.name;
        if (g.project !== undefined) body.project = g.project;
        if (g.projectSettings !== undefined) {
          body.projectSettings = g.projectSettings;
        }
        if (g.target !== undefined) body.target = g.target;
        if (g.withLatestCommit !== undefined) {
          body.withLatestCommit = g.withLatestCommit;
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
      description: "Get a Deployments",
      arguments: z.object({
        id: z.string().describe("The ID of the Deployments"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v13/deployments";
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
        "Look up an existing Deployments by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v7/deployments";
        const filters: [string, string][] = [];
        if (g.buildMachine !== undefined) {
          filters.push(["buildMachine", String(g.buildMachine)]);
        }
        if (g.customEnvironmentSlugOrId !== undefined) {
          filters.push([
            "customEnvironmentSlugOrId",
            String(g.customEnvironmentSlugOrId),
          ]);
        }
        if (g.deploymentId !== undefined) {
          filters.push(["deploymentId", String(g.deploymentId)]);
        }
        if (g.gitAccessToken !== undefined) {
          filters.push(["gitAccessToken", String(g.gitAccessToken)]);
        }
        if (g.monorepoManager !== undefined) {
          filters.push(["monorepoManager", String(g.monorepoManager)]);
        }
        if (g.name !== undefined) filters.push(["name", String(g.name)]);
        if (g.project !== undefined) {
          filters.push(["project", String(g.project)]);
        }
        if (g.target !== undefined) filters.push(["target", String(g.target)]);
        if (g.withLatestCommit !== undefined) {
          filters.push(["withLatestCommit", String(g.withLatestCommit)]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
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
          throw new Error(
            `No deployments found matching filters: ${filterDesc}`,
          );
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
          (g.name?.toString() ?? result.uid?.toString() ?? "current").replace(
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
        "Import an existing Deployments by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Deployments to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v13/deployments";
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
    delete: {
      description: "Delete the Deployments",
      arguments: z.object({
        id: z.string().describe("The ID of the Deployments"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v13/deployments";
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
      description: "Sync Deployments state from Vercel",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Deployments by uid (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/v13/deployments";
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
        if (!existing.uid) {
          throw new Error("Stored state has no uid - cannot sync");
        }
        const result = await tryRead(
          endpoint,
          existing.uid,
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
          id: existing.uid,
          status: "not_found",
          syncedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
