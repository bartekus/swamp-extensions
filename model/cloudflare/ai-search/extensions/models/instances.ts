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

// Auto-generated extension model for @swamp/cloudflare/ai-search/instances
// Do not edit manually. Re-generate with: deno task generate:cloudflare

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for a Cloudflare Instances.
 *
 * Wraps the Cloudflare API as a swamp model so create, get, lookup,
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
} from "./_lib/cloudflare.ts";

const GlobalArgsSchema = z.object({
  account_id: z.string().describe("Cloudflare account ID"),
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
  ai_gateway_id: z.string().optional(),
  ai_search_model: z.string().describe(
    "A Workers AI model ID or an AI Gateway model ID compatible with the OpenAI Chat Completions API. An empty string uses the configured or default model.",
  ).optional(),
  cache: z.boolean().optional(),
  cache_threshold: z.enum([
    "super_strict_match",
    "close_enough",
    "flexible_friend",
    "anything_goes",
  ]).optional(),
  cache_ttl: z.union([z.literal(600)]).optional(),
  chunk: z.boolean().optional(),
  chunk_overlap: z.number().int().min(0).max(30).optional(),
  chunk_size: z.number().int().min(64).optional(),
  custom_metadata: z.array(z.object({
    data_type: z.enum(["text", "number", "boolean", "datetime"]),
    field_name: z.string().min(1).max(64),
  })).optional(),
  embedding_model: z.string().optional(),
  fusion_method: z.enum(["max", "rrf"]).optional(),
  index_method: z.object({
    keyword: z.boolean(),
    vector: z.boolean(),
  }).describe(
    "Controls which storage backends are used during indexing. Defaults to vector-only.",
  ).optional(),
  indexing_options: z.object({
    keyword_tokenizer: z.enum(["porter", "trigram"]).optional(),
    use_ocr: z.boolean().optional(),
  }).optional(),
  max_num_results: z.number().int().min(1).max(50).optional(),
  metadata: z.object({
    created_from_aisearch_wizard: z.boolean().optional(),
    worker_domain: z.string().optional(),
  }).optional(),
  paused: z.boolean().optional(),
  public_endpoint_params: z.object({
    authorized_hosts: z.array(z.string()).optional(),
    chat_completions_endpoint: z.object({
      disabled: z.boolean().optional(),
    }).optional(),
    custom_domains: z.array(z.string().min(1).max(253)).optional(),
    default_domain_enabled: z.boolean().optional(),
    enabled: z.boolean().optional(),
    mcp: z.object({
      description: z.string().optional(),
      disabled: z.boolean().optional(),
    }).optional(),
    rate_limit: z.object({
      period_ms: z.number().int().min(60000).max(3600000).optional(),
      requests: z.number().int().min(1).optional(),
      technique: z.enum(["fixed", "sliding"]).optional(),
    }).optional(),
    search_endpoint: z.object({
      disabled: z.boolean().optional(),
    }).optional(),
  }).optional(),
  reranking: z.boolean().optional(),
  reranking_model: z.string().optional(),
  retrieval_options: z.object({
    boost_by: z.array(z.object({
      direction: z.enum(["asc", "desc", "exists", "not_exists"]).optional(),
      field: z.string().min(1).max(64),
    })).optional(),
    keyword_match_mode: z.enum(["and", "or"]).optional(),
  }).optional(),
  rewrite_model: z.string().describe(
    "A Workers AI model ID or an AI Gateway model ID compatible with the OpenAI Chat Completions API. An empty string uses the configured or default model.",
  ).optional(),
  rewrite_query: z.boolean().optional(),
  score_threshold: z.number().min(0).max(1).optional(),
  source: z.string().optional(),
  source_params: z.object({
    exclude_items: z.array(
      z.string().max(500).regex(new RegExp("^[*/\\\\]?[\\w\\-/.\\\\?*:=&%]+$")),
    ).optional(),
    include_items: z.array(
      z.string().max(500).regex(new RegExp("^[*/\\\\]?[\\w\\-/.\\\\?*:=&%]+$")),
    ).optional(),
    prefix: z.string().optional(),
    r2_jurisdiction: z.string().optional(),
    web_crawler: z.object({
      discover_options: z.object({
        depth: z.number().min(1).max(100000).optional(),
        include_external_links: z.boolean().optional(),
        include_subdomains: z.boolean().optional(),
        limit: z.number().min(1).max(100000).optional(),
        max_age: z.number().min(0).max(604800).optional(),
        source: z.enum(["all", "sitemaps", "links"]).optional(),
      }).optional(),
      parse_options: z.object({
        content_selector: z.array(z.object({
          path: z.string().min(1).max(200),
          selector: z.string().min(1).max(200),
        })).optional(),
        include_headers: z.record(z.string(), z.unknown()).optional(),
        include_images: z.boolean().optional(),
        specific_sitemaps: z.array(z.string()).optional(),
        use_browser_rendering: z.boolean().optional(),
      }).optional(),
      parse_type: z.enum(["sitemap", "discover"]).optional(),
    }).optional(),
  }).optional(),
  summarization: z.boolean().optional(),
  summarization_model: z.string().optional(),
  sync_interval: z.union([z.literal(900)]).optional(),
  system_prompt_ai_search: z.string().optional(),
  system_prompt_index_summarization: z.string().optional(),
  system_prompt_rewrite_query: z.string().optional(),
  token_id: z.string().optional(),
  hybrid_search_enabled: z.boolean().describe(
    "Deprecated — use index_method instead.",
  ).optional(),
  id: z.string().min(1).max(64).regex(
    new RegExp("^[a-z0-9_]+(?:-[a-z0-9_]+)*$"),
  ).describe(
    "AI Search instance ID. Lowercase alphanumeric, hyphens, and underscores.",
  ),
  type: z.enum(["r2", "web-crawler"]).optional(),
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
  ai_gateway_id: z.string().optional(),
  ai_search_model: z.string().optional(),
  cache: z.boolean().optional(),
  cache_threshold: z.string().optional(),
  cache_ttl: z.number().optional(),
  chunk_overlap: z.number().optional(),
  chunk_size: z.number().optional(),
  created_at: z.string().optional(),
  created_by: z.string().optional(),
  custom_metadata: z.array(z.object({
    data_type: z.string().optional(),
    field_name: z.string().optional(),
  })).optional(),
  embedding_model: z.string().optional(),
  enable: z.boolean().optional(),
  engine_version: z.number().optional(),
  fusion_method: z.string().optional(),
  hybrid_search_enabled: z.boolean().optional(),
  id: z.string(),
  index_method: z.object({
    keyword: z.boolean().optional(),
    vector: z.boolean().optional(),
  }).optional(),
  indexing_options: z.object({
    keyword_tokenizer: z.string().optional(),
    use_ocr: z.boolean().optional(),
  }).optional(),
  last_activity: z.string().optional(),
  max_num_results: z.number().optional(),
  metadata: z.object({
    created_from_aisearch_wizard: z.boolean().optional(),
    worker_domain: z.string().optional(),
  }).optional(),
  modified_at: z.string().optional(),
  modified_by: z.string().optional(),
  namespace: z.string().optional(),
  paused: z.boolean().optional(),
  public_endpoint_id: z.string().optional(),
  public_endpoint_params: z.object({
    authorized_hosts: z.array(z.string()).optional(),
    chat_completions_endpoint: z.object({
      disabled: z.boolean().optional(),
    }).optional(),
    custom_domains: z.array(z.string()).optional(),
    default_domain_enabled: z.boolean().optional(),
    enabled: z.boolean().optional(),
    mcp: z.object({
      description: z.string().optional(),
      disabled: z.boolean().optional(),
    }).optional(),
    rate_limit: z.object({
      period_ms: z.number().optional(),
      requests: z.number().optional(),
      technique: z.string().optional(),
    }).optional(),
    search_endpoint: z.object({
      disabled: z.boolean().optional(),
    }).optional(),
  }).optional(),
  reranking: z.boolean().optional(),
  reranking_model: z.string().optional(),
  retrieval_options: z.object({
    boost_by: z.array(z.object({
      direction: z.string().optional(),
      field: z.string().optional(),
    })).optional(),
    keyword_match_mode: z.string().optional(),
  }).optional(),
  rewrite_model: z.string().optional(),
  rewrite_query: z.boolean().optional(),
  score_threshold: z.number().optional(),
  source: z.string().optional(),
  source_params: z.object({
    exclude_items: z.array(z.string()).optional(),
    include_items: z.array(z.string()).optional(),
    prefix: z.string().optional(),
    r2_jurisdiction: z.string().optional(),
    web_crawler: z.object({
      discover_options: z.object({
        depth: z.number().optional(),
        include_external_links: z.boolean().optional(),
        include_subdomains: z.boolean().optional(),
        limit: z.number().optional(),
        max_age: z.number().optional(),
        source: z.string().optional(),
      }).optional(),
      parse_options: z.object({
        content_selector: z.array(z.object({
          path: z.string().optional(),
          selector: z.string().optional(),
        })).optional(),
        include_headers: z.record(z.string(), z.unknown()).optional(),
        include_images: z.boolean().optional(),
        specific_sitemaps: z.array(z.string()).optional(),
        use_browser_rendering: z.boolean().optional(),
      }).optional(),
      parse_type: z.string().optional(),
    }).optional(),
  }).optional(),
  status: z.string().optional(),
  sync_interval: z.number().optional(),
  token_id: z.string().optional(),
  type: z.string().optional(),
}).passthrough();

type ResourceData = z.infer<typeof ResourceSchema>;

const InputsSchema = z.object({
  account_id: z.string().optional(),
  name: z.string().optional(),
  ai_gateway_id: z.string().optional(),
  ai_search_model: z.string().optional(),
  cache: z.boolean().optional(),
  cache_threshold: z.enum([
    "super_strict_match",
    "close_enough",
    "flexible_friend",
    "anything_goes",
  ]).optional(),
  cache_ttl: z.union([z.literal(600)]).optional(),
  chunk: z.boolean().optional(),
  chunk_overlap: z.number().int().min(0).max(30).optional(),
  chunk_size: z.number().int().min(64).optional(),
  custom_metadata: z.array(z.object({
    data_type: z.enum(["text", "number", "boolean", "datetime"]),
    field_name: z.string().min(1).max(64),
  })).optional(),
  embedding_model: z.string().optional(),
  fusion_method: z.enum(["max", "rrf"]).optional(),
  index_method: z.object({
    keyword: z.boolean(),
    vector: z.boolean(),
  }).optional(),
  indexing_options: z.object({
    keyword_tokenizer: z.enum(["porter", "trigram"]).optional(),
    use_ocr: z.boolean().optional(),
  }).optional(),
  max_num_results: z.number().int().min(1).max(50).optional(),
  metadata: z.object({
    created_from_aisearch_wizard: z.boolean().optional(),
    worker_domain: z.string().optional(),
  }).optional(),
  paused: z.boolean().optional(),
  public_endpoint_params: z.object({
    authorized_hosts: z.array(z.string()).optional(),
    chat_completions_endpoint: z.object({
      disabled: z.boolean().optional(),
    }).optional(),
    custom_domains: z.array(z.string().min(1).max(253)).optional(),
    default_domain_enabled: z.boolean().optional(),
    enabled: z.boolean().optional(),
    mcp: z.object({
      description: z.string().optional(),
      disabled: z.boolean().optional(),
    }).optional(),
    rate_limit: z.object({
      period_ms: z.number().int().min(60000).max(3600000).optional(),
      requests: z.number().int().min(1).optional(),
      technique: z.enum(["fixed", "sliding"]).optional(),
    }).optional(),
    search_endpoint: z.object({
      disabled: z.boolean().optional(),
    }).optional(),
  }).optional(),
  reranking: z.boolean().optional(),
  reranking_model: z.string().optional(),
  retrieval_options: z.object({
    boost_by: z.array(z.object({
      direction: z.enum(["asc", "desc", "exists", "not_exists"]).optional(),
      field: z.string().min(1).max(64),
    })).optional(),
    keyword_match_mode: z.enum(["and", "or"]).optional(),
  }).optional(),
  rewrite_model: z.string().optional(),
  rewrite_query: z.boolean().optional(),
  score_threshold: z.number().min(0).max(1).optional(),
  source: z.string().optional(),
  source_params: z.object({
    exclude_items: z.array(
      z.string().max(500).regex(new RegExp("^[*/\\\\]?[\\w\\-/.\\\\?*:=&%]+$")),
    ).optional(),
    include_items: z.array(
      z.string().max(500).regex(new RegExp("^[*/\\\\]?[\\w\\-/.\\\\?*:=&%]+$")),
    ).optional(),
    prefix: z.string().optional(),
    r2_jurisdiction: z.string().optional(),
    web_crawler: z.object({
      discover_options: z.object({
        depth: z.number().min(1).max(100000).optional(),
        include_external_links: z.boolean().optional(),
        include_subdomains: z.boolean().optional(),
        limit: z.number().min(1).max(100000).optional(),
        max_age: z.number().min(0).max(604800).optional(),
        source: z.enum(["all", "sitemaps", "links"]).optional(),
      }).optional(),
      parse_options: z.object({
        content_selector: z.array(z.object({
          path: z.string().min(1).max(200),
          selector: z.string().min(1).max(200),
        })).optional(),
        include_headers: z.record(z.string(), z.unknown()).optional(),
        include_images: z.boolean().optional(),
        specific_sitemaps: z.array(z.string()).optional(),
        use_browser_rendering: z.boolean().optional(),
      }).optional(),
      parse_type: z.enum(["sitemap", "discover"]).optional(),
    }).optional(),
  }).optional(),
  summarization: z.boolean().optional(),
  summarization_model: z.string().optional(),
  sync_interval: z.union([z.literal(900)]).optional(),
  system_prompt_ai_search: z.string().optional(),
  system_prompt_index_summarization: z.string().optional(),
  system_prompt_rewrite_query: z.string().optional(),
  token_id: z.string().optional(),
  hybrid_search_enabled: z.boolean().optional(),
  id: z.string().min(1).max(64).regex(
    new RegExp("^[a-z0-9_]+(?:-[a-z0-9_]+)*$"),
  ).optional(),
  type: z.enum(["r2", "web-crawler"]).optional(),
  apiToken: z.string().meta({ sensitive: true }).optional(),
  apiKey: z.string().meta({ sensitive: true }).optional(),
  email: z.string().meta({ sensitive: true }).optional(),
});

/** Swamp extension model for Cloudflare Instances. Registered at `@swamp/cloudflare/ai-search/instances`. */
export const model = {
  type: "@swamp/cloudflare/ai-search/instances",
  version: "2026.09.11.1",
  upgrades: [
    {
      toVersion: "2026.05.29.1",
      description: "Added: apiToken, apiKey, email",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.14.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.28.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
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
      description: "Instances resource state",
      schema: ResourceSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Instances",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-search/instances";
        const body: Record<string, unknown> = {};
        if (g.ai_gateway_id !== undefined) body.ai_gateway_id = g.ai_gateway_id;
        if (g.ai_search_model !== undefined) {
          body.ai_search_model = g.ai_search_model;
        }
        if (g.cache !== undefined) body.cache = g.cache;
        if (g.cache_threshold !== undefined) {
          body.cache_threshold = g.cache_threshold;
        }
        if (g.cache_ttl !== undefined) body.cache_ttl = g.cache_ttl;
        if (g.chunk !== undefined) body.chunk = g.chunk;
        if (g.chunk_overlap !== undefined) body.chunk_overlap = g.chunk_overlap;
        if (g.chunk_size !== undefined) body.chunk_size = g.chunk_size;
        if (g.custom_metadata !== undefined) {
          body.custom_metadata = g.custom_metadata;
        }
        if (g.embedding_model !== undefined) {
          body.embedding_model = g.embedding_model;
        }
        if (g.fusion_method !== undefined) body.fusion_method = g.fusion_method;
        if (g.hybrid_search_enabled !== undefined) {
          body.hybrid_search_enabled = g.hybrid_search_enabled;
        }
        if (g.id !== undefined) body.id = g.id;
        if (g.index_method !== undefined) body.index_method = g.index_method;
        if (g.indexing_options !== undefined) {
          body.indexing_options = g.indexing_options;
        }
        if (g.max_num_results !== undefined) {
          body.max_num_results = g.max_num_results;
        }
        if (g.metadata !== undefined) body.metadata = g.metadata;
        if (g.public_endpoint_params !== undefined) {
          body.public_endpoint_params = g.public_endpoint_params;
        }
        if (g.reranking !== undefined) body.reranking = g.reranking;
        if (g.reranking_model !== undefined) {
          body.reranking_model = g.reranking_model;
        }
        if (g.retrieval_options !== undefined) {
          body.retrieval_options = g.retrieval_options;
        }
        if (g.rewrite_model !== undefined) body.rewrite_model = g.rewrite_model;
        if (g.rewrite_query !== undefined) body.rewrite_query = g.rewrite_query;
        if (g.score_threshold !== undefined) {
          body.score_threshold = g.score_threshold;
        }
        if (g.source !== undefined) body.source = g.source;
        if (g.source_params !== undefined) body.source_params = g.source_params;
        if (g.sync_interval !== undefined) body.sync_interval = g.sync_interval;
        if (g.token_id !== undefined) body.token_id = g.token_id;
        if (g.type !== undefined) body.type = g.type;
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
      description: "Get a Instances",
      arguments: z.object({
        id: z.string().describe("The ID of the Instances"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-search/instances";
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
        "Look up an existing Instances by matching global argument values and import it into state",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-search/instances";
        const filters: [string, string][] = [];
        if (g.ai_gateway_id !== undefined) {
          filters.push(["ai_gateway_id", String(g.ai_gateway_id)]);
        }
        if (g.ai_search_model !== undefined) {
          filters.push(["ai_search_model", String(g.ai_search_model)]);
        }
        if (g.cache !== undefined) filters.push(["cache", String(g.cache)]);
        if (g.cache_threshold !== undefined) {
          filters.push(["cache_threshold", String(g.cache_threshold)]);
        }
        if (g.cache_ttl !== undefined) {
          filters.push(["cache_ttl", String(g.cache_ttl)]);
        }
        if (g.chunk !== undefined) filters.push(["chunk", String(g.chunk)]);
        if (g.chunk_overlap !== undefined) {
          filters.push(["chunk_overlap", String(g.chunk_overlap)]);
        }
        if (g.chunk_size !== undefined) {
          filters.push(["chunk_size", String(g.chunk_size)]);
        }
        if (g.embedding_model !== undefined) {
          filters.push(["embedding_model", String(g.embedding_model)]);
        }
        if (g.fusion_method !== undefined) {
          filters.push(["fusion_method", String(g.fusion_method)]);
        }
        if (g.max_num_results !== undefined) {
          filters.push(["max_num_results", String(g.max_num_results)]);
        }
        if (g.paused !== undefined) filters.push(["paused", String(g.paused)]);
        if (g.reranking !== undefined) {
          filters.push(["reranking", String(g.reranking)]);
        }
        if (g.reranking_model !== undefined) {
          filters.push(["reranking_model", String(g.reranking_model)]);
        }
        if (g.rewrite_model !== undefined) {
          filters.push(["rewrite_model", String(g.rewrite_model)]);
        }
        if (g.rewrite_query !== undefined) {
          filters.push(["rewrite_query", String(g.rewrite_query)]);
        }
        if (g.score_threshold !== undefined) {
          filters.push(["score_threshold", String(g.score_threshold)]);
        }
        if (g.source !== undefined) filters.push(["source", String(g.source)]);
        if (g.summarization !== undefined) {
          filters.push(["summarization", String(g.summarization)]);
        }
        if (g.summarization_model !== undefined) {
          filters.push(["summarization_model", String(g.summarization_model)]);
        }
        if (g.sync_interval !== undefined) {
          filters.push(["sync_interval", String(g.sync_interval)]);
        }
        if (g.system_prompt_ai_search !== undefined) {
          filters.push([
            "system_prompt_ai_search",
            String(g.system_prompt_ai_search),
          ]);
        }
        if (g.system_prompt_index_summarization !== undefined) {
          filters.push([
            "system_prompt_index_summarization",
            String(g.system_prompt_index_summarization),
          ]);
        }
        if (g.system_prompt_rewrite_query !== undefined) {
          filters.push([
            "system_prompt_rewrite_query",
            String(g.system_prompt_rewrite_query),
          ]);
        }
        if (g.token_id !== undefined) {
          filters.push(["token_id", String(g.token_id)]);
        }
        if (g.hybrid_search_enabled !== undefined) {
          filters.push([
            "hybrid_search_enabled",
            String(g.hybrid_search_enabled),
          ]);
        }
        if (g.id !== undefined) filters.push(["id", String(g.id)]);
        if (g.type !== undefined) filters.push(["type", String(g.type)]);
        if (filters.length === 0) {
          throw new Error(
            "At least one global argument must be set to filter by",
          );
        }
        const items = await listAll(endpoint, "page", undefined, {
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
          throw new Error(`No instances found matching filters: ${filterDesc}`);
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
        "Import an existing Instances by ID into state for management",
      arguments: z.object({
        id: z.string().describe("The ID of the Instances to import"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-search/instances";
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
    update: {
      description: "Update Instances attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Instances by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-search/instances";
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
        if (g.ai_gateway_id !== undefined) body.ai_gateway_id = g.ai_gateway_id;
        if (g.ai_search_model !== undefined) {
          body.ai_search_model = g.ai_search_model;
        }
        if (g.cache !== undefined) body.cache = g.cache;
        if (g.cache_threshold !== undefined) {
          body.cache_threshold = g.cache_threshold;
        }
        if (g.cache_ttl !== undefined) body.cache_ttl = g.cache_ttl;
        if (g.chunk !== undefined) body.chunk = g.chunk;
        if (g.chunk_overlap !== undefined) body.chunk_overlap = g.chunk_overlap;
        if (g.chunk_size !== undefined) body.chunk_size = g.chunk_size;
        if (g.custom_metadata !== undefined) {
          body.custom_metadata = g.custom_metadata;
        }
        if (g.embedding_model !== undefined) {
          body.embedding_model = g.embedding_model;
        }
        if (g.fusion_method !== undefined) body.fusion_method = g.fusion_method;
        if (g.index_method !== undefined) body.index_method = g.index_method;
        if (g.indexing_options !== undefined) {
          body.indexing_options = g.indexing_options;
        }
        if (g.max_num_results !== undefined) {
          body.max_num_results = g.max_num_results;
        }
        if (g.metadata !== undefined) body.metadata = g.metadata;
        if (g.paused !== undefined) body.paused = g.paused;
        if (g.public_endpoint_params !== undefined) {
          body.public_endpoint_params = g.public_endpoint_params;
        }
        if (g.reranking !== undefined) body.reranking = g.reranking;
        if (g.reranking_model !== undefined) {
          body.reranking_model = g.reranking_model;
        }
        if (g.retrieval_options !== undefined) {
          body.retrieval_options = g.retrieval_options;
        }
        if (g.rewrite_model !== undefined) body.rewrite_model = g.rewrite_model;
        if (g.rewrite_query !== undefined) body.rewrite_query = g.rewrite_query;
        if (g.score_threshold !== undefined) {
          body.score_threshold = g.score_threshold;
        }
        if (g.source !== undefined) body.source = g.source;
        if (g.source_params !== undefined) body.source_params = g.source_params;
        if (g.summarization !== undefined) body.summarization = g.summarization;
        if (g.summarization_model !== undefined) {
          body.summarization_model = g.summarization_model;
        }
        if (g.sync_interval !== undefined) body.sync_interval = g.sync_interval;
        if (g.system_prompt_ai_search !== undefined) {
          body.system_prompt_ai_search = g.system_prompt_ai_search;
        }
        if (g.system_prompt_index_summarization !== undefined) {
          body.system_prompt_index_summarization =
            g.system_prompt_index_summarization;
        }
        if (g.system_prompt_rewrite_query !== undefined) {
          body.system_prompt_rewrite_query = g.system_prompt_rewrite_query;
        }
        if (g.token_id !== undefined) body.token_id = g.token_id;
        const result = await update(endpoint, existing.id, body, "PUT", {
          apiToken: g.apiToken,
          apiKey: g.apiKey,
          email: g.email,
        }) as ResourceData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the Instances",
      arguments: z.object({
        id: z.string().describe("The ID of the Instances"),
      }),
      execute: async (args: { id: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-search/instances";
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
      description: "Sync Instances state from Cloudflare",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific Instances by id (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const endpoint = "/accounts/" + g.account_id + "/ai-search/instances";
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
