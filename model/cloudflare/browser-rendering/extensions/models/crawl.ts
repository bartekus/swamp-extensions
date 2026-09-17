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

// Auto-generated extension model for @swamp/cloudflare/browser-rendering/crawl
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Crawl.
 *
 * Wraps the Cloudflare API as a swamp model so create, get, lookup,
 * adopt, update, delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import { create, listAll, read, remove, tryRead } from "./_lib/cloudflare.ts";

const GlobalArgsSchema = z.object({
  account_id: z.string().describe("Cloudflare account ID"),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  actionTimeout: z.number().max(120000).describe(
    "The maximum duration allowed for the browser action to complete after the page has loaded (such as taking screenshots, extracting content, or generating PDFs). If this time limit is exceeded, the action stops and returns a timeout error.",
  ).optional(),
  addScriptTag: z.array(z.object({
    content: z.string().optional(),
    id: z.string().optional(),
    type: z.string().optional(),
    url: z.string().optional(),
  })).describe(
    "Adds a script element into the page with the desired URL or content.",
  ).optional(),
  addStyleTag: z.array(z.object({
    content: z.string().optional(),
    url: z.string().optional(),
  })).describe(
    'Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a `<style type="text/css">` tag with the content.',
  ).optional(),
  allowRequestPattern: z.array(z.string()).describe(
    "Only allow requests that match the provided regex patterns, eg. '/^.*\\.(css)'. Reject rules are applied first.",
  ).optional(),
  allowResourceTypes: z.array(z.enum(["document"])).describe(
    "Only allow requests that match the provided resource types, eg. 'image' or 'script'. Reject rules are applied first.",
  ).optional(),
  authenticate: z.object({
    password: z.string().min(1),
    username: z.string().min(1),
  }).describe("Provide credentials for HTTP authentication.").optional(),
  bestAttempt: z.boolean().describe(
    "Attempt to proceed when 'awaited' events fail or timeout.",
  ).optional(),
  contentUse: z.enum(["reference"]).optional(),
  cookies: z.array(z.object({
    domain: z.string().optional(),
    expires: z.number().optional(),
    httpOnly: z.boolean().optional(),
    name: z.string(),
    partitionKey: z.string().optional(),
    path: z.string().optional(),
    priority: z.enum(["Low"]).optional(),
    sameParty: z.boolean().optional(),
    sameSite: z.enum(["Strict"]).optional(),
    secure: z.boolean().optional(),
    sourcePort: z.number().optional(),
    sourceScheme: z.enum(["Unset"]).optional(),
    url: z.string().optional(),
    value: z.string(),
  })).describe(
    "Check [options](https://pptr.dev/api/puppeteer.page.setcookie).",
  ).optional(),
  crawlPurposes: z.array(z.enum(["search"])).describe(
    "List of crawl purposes to respect Content-Signal directives in robots.txt. Allowed values: 'search', 'ai-input', 'ai-train'. Learn more: https://contentsignals.org/. Default: ['search', 'ai-input', 'ai-train'].",
  ).optional(),
  depth: z.number().min(1).max(100000).describe(
    "Maximum number of levels deep the crawler will traverse from the starting URL.",
  ).optional(),
  emulateMediaType: z.string().optional(),
  formats: z.array(z.enum(["html"])).describe(
    "Formats to return. Default is `html`.",
  ).optional(),
  gotoOptions: z.object({
    referer: z.string().optional(),
    referrerPolicy: z.string().optional(),
    timeout: z.number().max(60000).optional(),
    waitUntil: z.enum(["load"]).optional(),
  }).describe("Check [options](https://pptr.dev/api/puppeteer.gotooptions).")
    .optional(),
  jsonOptions: z.object({
    custom_ai: z.array(z.object({
      authorization: z.string().optional(),
      model: z.string(),
    })).optional(),
    prompt: z.string().optional(),
    response_format: z.object({
      json_schema: z.record(z.string(), z.unknown()).optional(),
      type: z.string(),
    }).optional(),
  }).describe("Options for JSON extraction.").optional(),
  limit: z.number().min(1).max(100000).describe(
    "Maximum number of URLs to crawl.",
  ).optional(),
  maxAge: z.number().min(0).max(604800).describe(
    "Maximum age of a resource that can be returned from cache in seconds. Default is 1 day.",
  ).optional(),
  modifiedSince: z.number().int().min(0).describe(
    "Unix timestamp (seconds since epoch) indicating to only crawl pages that were modified since this time. For sitemap URLs with a lastmod field, this is compared directly. For other URLs, the crawler will use If-Modified-Since header when fetching. URLs without modification information (no lastmod in sitemap and no Last-Modified header support) will be crawled. Note: This works in conjunction with maxAge - both filters must pass for a cached resource to be used. Must be within the last year and not in the future.",
  ).optional(),
  options: z.object({
    excludePatterns: z.array(z.string().min(1).max(500)).optional(),
    includeExternalLinks: z.boolean().optional(),
    includePatterns: z.array(z.string().min(1).max(500)).optional(),
    includeSubdomains: z.boolean().optional(),
  }).describe("Additional options for the crawler.").optional(),
  rejectRequestPattern: z.array(z.string()).describe(
    "Block undesired requests that match the provided regex patterns, eg. '/^.*\\.(css)'.",
  ).optional(),
  rejectResourceTypes: z.array(z.enum(["document"])).describe(
    "Block undesired requests that match the provided resource types, eg. 'image' or 'script'.",
  ).optional(),
  render: z.boolean().describe(
    "Whether to render the page or fetch static content. True by default.",
  ).optional(),
  setExtraHTTPHeaders: z.record(z.string(), z.unknown()).optional(),
  setJavaScriptEnabled: z.boolean().optional(),
  source: z.enum(["sitemaps"]).optional(),
  url: z.string().describe("URL to navigate to, eg. `https://example.com`."),
  viewport: z.object({
    deviceScaleFactor: z.number().optional(),
    hasTouch: z.boolean().optional(),
    height: z.number(),
    isLandscape: z.boolean().optional(),
    isMobile: z.boolean().optional(),
    width: z.number(),
  }).describe(
    "Check [options](https://pptr.dev/api/puppeteer.page.setviewport).",
  ).optional(),
  waitForSelector: z.object({
    hidden: z.boolean().optional(),
    selector: z.string(),
    timeout: z.number().max(120000).optional(),
    visible: z.boolean().optional(),
  }).describe(
    "Wait for the selector to appear in page. Check [options](https://pptr.dev/api/puppeteer.page.waitforselector).",
  ).optional(),
  waitForTimeout: z.number().max(120000).describe(
    "Waits for a specified timeout before continuing.",
  ).optional(),
  apiToken: z.string().meta({ sensitive: true }).describe(
    "Cloudflare API token; overrides the CLOUDFLARE_API_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  apiKey: z.string().meta({ sensitive: true }).describe(
    "Cloudflare API key for the legacy key+email auth path; overrides the CLOUDFLARE_API_KEY environment variable. Wire with a vault.get(...) expression. Requires email.",
  ).optional(),
  email: z.string().meta({ sensitive: true }).describe(
    "Cloudflare account email for the legacy key+email auth path; overrides the CLOUDFLARE_EMAIL environment variable. Requires apiKey.",
  ).optional(),
});

const ResourceSchema = z.object({
  browserSecondsUsed: z.number().optional(),
  cursor: z.string().optional(),
  finished: z.number().optional(),
  id: z.string(),
  records: z.array(z.object({
    html: z.string().optional(),
    json: z.record(z.string(), z.unknown()).optional(),
    markdown: z.string().optional(),
    metadata: z.object({
      status: z.number().optional(),
      title: z.string().optional(),
      url: z.string().optional(),
    }).optional(),
    status: z.string().optional(),
    url: z.string().optional(),
  })).optional(),
  skipped: z.number().optional(),
  status: z.string().optional(),
  total: z.number().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  name: z.string().optional(),
  actionTimeout: z.number().max(120000).optional(),
  addScriptTag: z.array(z.object({
    content: z.string().optional(),
    id: z.string().optional(),
    type: z.string().optional(),
    url: z.string().optional(),
  })).optional(),
  addStyleTag: z.array(z.object({
    content: z.string().optional(),
    url: z.string().optional(),
  })).optional(),
  allowRequestPattern: z.array(z.string()).optional(),
  allowResourceTypes: z.array(z.enum(["document"])).optional(),
  authenticate: z.object({
    password: z.string().min(1),
    username: z.string().min(1),
  }).optional(),
  bestAttempt: z.boolean().optional(),
  contentUse: z.enum(["reference"]).optional(),
  cookies: z.array(z.object({
    domain: z.string().optional(),
    expires: z.number().optional(),
    httpOnly: z.boolean().optional(),
    name: z.string(),
    partitionKey: z.string().optional(),
    path: z.string().optional(),
    priority: z.enum(["Low"]).optional(),
    sameParty: z.boolean().optional(),
    sameSite: z.enum(["Strict"]).optional(),
    secure: z.boolean().optional(),
    sourcePort: z.number().optional(),
    sourceScheme: z.enum(["Unset"]).optional(),
    url: z.string().optional(),
    value: z.string(),
  })).optional(),
  crawlPurposes: z.array(z.enum(["search"])).optional(),
  depth: z.number().min(1).max(100000).optional(),
  emulateMediaType: z.string().optional(),
  formats: z.array(z.enum(["html"])).optional(),
  gotoOptions: z.object({
    referer: z.string().optional(),
    referrerPolicy: z.string().optional(),
    timeout: z.number().max(60000).optional(),
    waitUntil: z.enum(["load"]).optional(),
  }).optional(),
  jsonOptions: z.object({
    custom_ai: z.array(z.object({
      authorization: z.string().optional(),
      model: z.string(),
    })).optional(),
    prompt: z.string().optional(),
    response_format: z.object({
      json_schema: z.record(z.string(), z.unknown()).optional(),
      type: z.string(),
    }).optional(),
  }).optional(),
  limit: z.number().min(1).max(100000).optional(),
  maxAge: z.number().min(0).max(604800).optional(),
  modifiedSince: z.number().int().min(0).optional(),
  options: z.object({
    excludePatterns: z.array(z.string().min(1).max(500)).optional(),
    includeExternalLinks: z.boolean().optional(),
    includePatterns: z.array(z.string().min(1).max(500)).optional(),
    includeSubdomains: z.boolean().optional(),
  }).optional(),
  rejectRequestPattern: z.array(z.string()).optional(),
  rejectResourceTypes: z.array(z.enum(["document"])).optional(),
  render: z.boolean().optional(),
  setExtraHTTPHeaders: z.record(z.string(), z.unknown()).optional(),
  setJavaScriptEnabled: z.boolean().optional(),
  source: z.enum(["sitemaps"]).optional(),
  url: z.string().optional(),
  viewport: z.object({
    deviceScaleFactor: z.number().optional(),
    hasTouch: z.boolean().optional(),
    height: z.number(),
    isLandscape: z.boolean().optional(),
    isMobile: z.boolean().optional(),
    width: z.number(),
  }).optional(),
  waitForSelector: z.object({
    hidden: z.boolean().optional(),
    selector: z.string(),
    timeout: z.number().max(120000).optional(),
    visible: z.boolean().optional(),
  }).optional(),
  waitForTimeout: z.number().max(120000).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Crawl. Registered at `@swamp/cloudflare/browser-rendering/crawl`. */
export const model = {
  type: "@swamp/cloudflare/browser-rendering/crawl",
  version: "2026.09.17.1",
  upgrades: [
    {
      toVersion: "2026.08.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.27.1",
      description: "Added: contentUse",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Crawl resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Crawl",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/browser-rendering/crawl";
        const body: Record<string, unknown> = {};
        if (g.actionTimeout !== undefined) body.actionTimeout = g.actionTimeout;
        if (g.addScriptTag !== undefined) body.addScriptTag = g.addScriptTag;
        if (g.addStyleTag !== undefined) body.addStyleTag = g.addStyleTag;
        if (g.allowRequestPattern !== undefined) {
          body.allowRequestPattern = g.allowRequestPattern;
        }
        if (g.allowResourceTypes !== undefined) {
          body.allowResourceTypes = g.allowResourceTypes;
        }
        if (g.authenticate !== undefined) body.authenticate = g.authenticate;
        if (g.bestAttempt !== undefined) body.bestAttempt = g.bestAttempt;
        if (g.contentUse !== undefined) body.contentUse = g.contentUse;
        if (g.cookies !== undefined) body.cookies = g.cookies;
        if (g.crawlPurposes !== undefined) body.crawlPurposes = g.crawlPurposes;
        if (g.depth !== undefined) body.depth = g.depth;
        if (g.emulateMediaType !== undefined) {
          body.emulateMediaType = g.emulateMediaType;
        }
        if (g.formats !== undefined) body.formats = g.formats;
        if (g.gotoOptions !== undefined) body.gotoOptions = g.gotoOptions;
        if (g.jsonOptions !== undefined) body.jsonOptions = g.jsonOptions;
        if (g.limit !== undefined) body.limit = g.limit;
        if (g.maxAge !== undefined) body.maxAge = g.maxAge;
        if (g.modifiedSince !== undefined) body.modifiedSince = g.modifiedSince;
        if (g.options !== undefined) body.options = g.options;
        if (g.rejectRequestPattern !== undefined) {
          body.rejectRequestPattern = g.rejectRequestPattern;
        }
        if (g.rejectResourceTypes !== undefined) {
          body.rejectResourceTypes = g.rejectResourceTypes;
        }
        if (g.render !== undefined) body.render = g.render;
        if (g.setExtraHTTPHeaders !== undefined) {
          body.setExtraHTTPHeaders = g.setExtraHTTPHeaders;
        }
        if (g.setJavaScriptEnabled !== undefined) {
          body.setJavaScriptEnabled = g.setJavaScriptEnabled;
        }
        if (g.source !== undefined) body.source = g.source;
        if (g.url !== undefined) body.url = g.url;
        if (g.viewport !== undefined) body.viewport = g.viewport;
        if (g.waitForSelector !== undefined) {
          body.waitForSelector = g.waitForSelector;
        }
        if (g.waitForTimeout !== undefined) {
          body.waitForTimeout = g.waitForTimeout;
        }
        const result = await create(endpoint, body, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        }) as ResourceData;
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
      description: "Get a Crawl",
      arguments: z.object({ id: z.string().describe("The ID of the Crawl") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/browser-rendering/crawl";
        const result = await read(endpoint, args.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
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
        "Look up an existing Crawl by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/browser-rendering/crawl";
        const filters: [string, string][] = [];
        if (g.actionTimeout !== undefined) {
          filters.push(["actionTimeout", String(g.actionTimeout)]);
        }
        if (g.bestAttempt !== undefined) {
          filters.push(["bestAttempt", String(g.bestAttempt)]);
        }
        if (g.contentUse !== undefined) {
          filters.push(["contentUse", String(g.contentUse)]);
        }
        if (g.depth !== undefined) filters.push(["depth", String(g.depth)]);
        if (g.emulateMediaType !== undefined) {
          filters.push(["emulateMediaType", String(g.emulateMediaType)]);
        }
        if (g.limit !== undefined) filters.push(["limit", String(g.limit)]);
        if (g.maxAge !== undefined) filters.push(["maxAge", String(g.maxAge)]);
        if (g.modifiedSince !== undefined) {
          filters.push(["modifiedSince", String(g.modifiedSince)]);
        }
        if (g.render !== undefined) filters.push(["render", String(g.render)]);
        if (g.setJavaScriptEnabled !== undefined) {
          filters.push([
            "setJavaScriptEnabled",
            String(g.setJavaScriptEnabled),
          ]);
        }
        if (g.source !== undefined) filters.push(["source", String(g.source)]);
        if (g.url !== undefined) filters.push(["url", String(g.url)]);
        if (g.waitForTimeout !== undefined) {
          filters.push(["waitForTimeout", String(g.waitForTimeout)]);
        }
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(endpoint, "none", undefined, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        });
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
          throw new Error(`No crawl found matching filters: ${filterDesc}`);
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
      description: "Import an existing Crawl by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Crawl to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/browser-rendering/crawl";
        const result = await read(endpoint, args.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
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
      description: "Delete the Crawl",
      arguments: z.object({ id: z.string().describe("The ID of the Crawl") }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/browser-rendering/crawl";
        const { existed } = await remove(endpoint, args.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        });
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
      description: "Sync Crawl state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Crawl by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id +
          "/browser-rendering/crawl";
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
        const result = await tryRead(endpoint, existing.id, {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        }) as ResourceData | null;
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
