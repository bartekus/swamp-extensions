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

// Auto-generated shared helper for Cloudflare extension models.
// Do not edit manually. Re-generate with: deno task generate:cloudflare

const API_BASE = "https://api.cloudflare.com/client/v4";

type ResolvedAuth =
  | { style: "token"; token: string }
  | { style: "key"; key: string; email: string };

/**
 * Auth overrides sourced from a model's global arguments. Each field, when set,
 * takes precedence over the matching CLOUDFLARE_* environment variable and may
 * be wired with a vault.get(...) expression so the credential is sourced from a
 * vault rather than the environment.
 */
export interface AuthOverrides {
  apiToken?: string;
  apiKey?: string;
  email?: string;
}

// Credentials validated against the API are cached here so each distinct
// credential (an env var OR a per-model apiToken / apiKey+email global arg) is
// validated exactly once.
const validatedCredentials = new Set<string>();

/**
 * Resolves Cloudflare credentials. Explicit overrides (e.g. from a model's
 * apiToken / apiKey / email global arguments, which may be wired with a
 * vault.get(...) expression) take precedence over the CLOUDFLARE_API_TOKEN /
 * CLOUDFLARE_API_KEY / CLOUDFLARE_EMAIL environment variables. An API token is
 * preferred over the legacy API key + email pair. Each distinct credential is
 * validated exactly once.
 */
async function getAuth(overrides?: AuthOverrides): Promise<ResolvedAuth> {
  const apiToken = overrides?.apiToken ?? Deno.env.get("CLOUDFLARE_API_TOKEN");
  if (apiToken) {
    const auth: ResolvedAuth = { style: "token", token: apiToken };
    if (validatedCredentials.has(`token:${apiToken}`)) return auth;
    const resp = await fetch(`${API_BASE}/user/tokens/verify`, {
      headers: { "Authorization": `Bearer ${apiToken}` },
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(
        `Cloudflare API token is invalid (GET /user/tokens/verify returned ${resp.status}): ${text}`,
      );
    }
    await resp.text();
    validatedCredentials.add(`token:${apiToken}`);
    return auth;
  }

  const apiKey = overrides?.apiKey ?? Deno.env.get("CLOUDFLARE_API_KEY");
  const email = overrides?.email ?? Deno.env.get("CLOUDFLARE_EMAIL");
  if (apiKey && email) {
    const auth: ResolvedAuth = { style: "key", key: apiKey, email };
    const cacheKey = `key:${email}:${apiKey}`;
    if (validatedCredentials.has(cacheKey)) return auth;
    const resp = await fetch(`${API_BASE}/user`, {
      headers: { "X-Auth-Key": apiKey, "X-Auth-Email": email },
    });
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(
        `Cloudflare API key/email is invalid (GET /user returned ${resp.status}): ${text}`,
      );
    }
    await resp.text();
    validatedCredentials.add(cacheKey);
    return auth;
  }

  throw new Error(
    "Cloudflare credentials not set. Provide an apiToken (recommended) or " +
      "apiKey + email global argument (each wireable with a vault.get(...) " +
      "expression), or set the CLOUDFLARE_API_TOKEN environment variable " +
      "(recommended) or CLOUDFLARE_API_KEY + CLOUDFLARE_EMAIL.",
  );
}

function authHeaders(auth: ResolvedAuth): Record<string, string> {
  if (auth.style === "token") {
    return { "Authorization": `Bearer ${auth.token}` };
  }
  return { "X-Auth-Key": auth.key, "X-Auth-Email": auth.email };
}

async function request(
  method: string,
  path: string,
  body?: Record<string, unknown>,
  auth?: AuthOverrides,
): Promise<Response> {
  const resolved = await getAuth(auth);
  const url = `${API_BASE}${path}`;
  const headers: Record<string, string> = {
    ...authHeaders(resolved),
    ...(body ? { "Content-Type": "application/json" } : {}),
  };

  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const resp = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (resp.status === 429) {
      const retryAfter = resp.headers.get("Retry-After");
      const parsed = retryAfter ? Number(retryAfter) : NaN;
      const delay = Number.isFinite(parsed)
        ? parsed * 1000
        : 1000 * (attempt + 1);
      await resp.text();
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, delay));
        continue;
      }
      throw new Error(
        `Cloudflare API rate limited after ${maxRetries} retries: ${method} ${path}`,
      );
    }

    if (!resp.ok && resp.status !== 404) {
      const text = await resp.text();
      throw new Error(
        `Cloudflare API error: ${method} ${path} returned ${resp.status}: ${text}`,
      );
    }

    return resp;
  }

  throw new Error(`Unreachable: ${method} ${path}`);
}

function assertSuccess(data: Record<string, unknown>): void {
  if (data.success === false) {
    const errors = data.errors as
      | Array<{ code: number; message: string }>
      | undefined;
    const msg = errors?.map((e) => `${e.code}: ${e.message}`).join("; ") ??
      "Unknown error";
    throw new Error(`Cloudflare API error: ${msg}`);
  }
}

function unwrap(data: Record<string, unknown>): Record<string, unknown> {
  assertSuccess(data);
  if (
    "result" in data && data.result !== null &&
    typeof data.result === "object" && !Array.isArray(data.result)
  ) {
    return data.result as Record<string, unknown>;
  }
  return data;
}

export async function create(
  endpoint: string,
  body: Record<string, unknown>,
  auth?: AuthOverrides,
): Promise<Record<string, unknown>> {
  const resp = await request("POST", endpoint, body, auth);
  const data = await resp.json();
  return unwrap(data);
}

export async function read(
  endpoint: string,
  id: string,
  auth?: AuthOverrides,
): Promise<Record<string, unknown>> {
  const resp = await request("GET", `${endpoint}/${id}`, undefined, auth);
  if (resp.status === 404) {
    const text = await resp.text();
    throw new Error(
      `Resource not found: GET ${endpoint}/${id} returned 404: ${text}`,
    );
  }
  const data = await resp.json();
  return unwrap(data);
}

export async function tryRead(
  endpoint: string,
  id: string,
  auth?: AuthOverrides,
): Promise<Record<string, unknown> | null> {
  const resp = await request("GET", `${endpoint}/${id}`, undefined, auth);
  if (resp.status === 404) {
    await resp.text();
    return null;
  }
  const data = await resp.json();
  return unwrap(data);
}

export async function update(
  endpoint: string,
  id: string,
  body: Record<string, unknown>,
  method: "PATCH" | "PUT" = "PATCH",
  auth?: AuthOverrides,
): Promise<Record<string, unknown>> {
  const resp = await request(method, `${endpoint}/${id}`, body, auth);
  if (resp.status === 404) {
    const text = await resp.text();
    throw new Error(
      `Resource not found: ${method} ${endpoint}/${id} returned 404: ${text}`,
    );
  }
  const data = await resp.json();
  return unwrap(data);
}

export async function remove(
  endpoint: string,
  id: string,
  auth?: AuthOverrides,
): Promise<{ existed: boolean }> {
  const resp = await request("DELETE", `${endpoint}/${id}`, undefined, auth);
  if (resp.status === 404) {
    await resp.text();
    return { existed: false };
  }
  // Some DELETE responses have a body, some don't — separate JSON
  // parse errors (fine) from API errors (must surface).
  let data: Record<string, unknown> | undefined;
  try {
    data = await resp.json();
  } catch { /* non-JSON body is fine */ }
  if (data) assertSuccess(data);
  return { existed: true };
}

export async function listAll(
  endpoint: string,
  style: "page" | "cursor" | "none",
  queryParams?: Record<string, string>,
  auth?: AuthOverrides,
): Promise<Record<string, unknown>[]> {
  const results: Record<string, unknown>[] = [];
  const params = new URLSearchParams(queryParams);

  if (style === "page") {
    params.set("per_page", "100");
    let page = 1;
    while (true) {
      params.set("page", String(page));
      const resp = await request(
        "GET",
        `${endpoint}?${params.toString()}`,
        undefined,
        auth,
      );
      const data = await resp.json() as Record<string, unknown>;
      assertSuccess(data);
      const items = data.result;
      if (!Array.isArray(items) || items.length === 0) break;
      for (const item of items) {
        results.push(item as Record<string, unknown>);
      }
      const info = data.result_info as
        | { total_pages?: number; page?: number }
        | undefined;
      if (!info?.total_pages || page >= info.total_pages) break;
      page++;
    }
  } else if (style === "cursor") {
    params.set("limit", "100");
    let cursor: string | undefined;
    while (true) {
      if (cursor) params.set("cursor", cursor);
      const resp = await request(
        "GET",
        `${endpoint}?${params.toString()}`,
        undefined,
        auth,
      );
      const data = await resp.json() as Record<string, unknown>;
      assertSuccess(data);
      const items = data.result;
      if (!Array.isArray(items) || items.length === 0) break;
      for (const item of items) {
        results.push(item as Record<string, unknown>);
      }
      const info = data.result_info as { cursor?: string } | undefined;
      cursor = info?.cursor;
      if (!cursor) break;
    }
  } else {
    const resp = await request(
      "GET",
      `${endpoint}?${params.toString()}`,
      undefined,
      auth,
    );
    const data = await resp.json() as Record<string, unknown>;
    assertSuccess(data);
    const items = data.result;
    if (Array.isArray(items)) {
      for (const item of items) {
        results.push(item as Record<string, unknown>);
      }
    }
  }

  return results;
}

export async function tryFindByField(
  endpoint: string,
  field: string,
  value: string,
  style: "page" | "cursor" | "none",
  auth?: AuthOverrides,
): Promise<Record<string, unknown> | null> {
  const items = await listAll(endpoint, style, undefined, auth);
  for (const item of items) {
    if (String(item[field]) === value) return item;
  }
  return null;
}
