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

// Auto-generated shared helper for GCP extension models.
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

interface GcpMethodConfig {
  id: string;
  path: string;
  httpMethod: string;
  parameterOrder: readonly string[];
  parameters: Record<string, { location: string; required?: boolean }>;
}

interface GcpCredentials {
  projectId: string;
  accessToken: string;
  quotaProjectId?: string;
}

export interface ExplicitGcpCredentials {
  accessToken?: string;
  credentialsJson?: string;
  project?: string;
  quotaProject?: string;
  scopes?: string[];
}

let cachedCredentials: GcpCredentials | undefined;
let cachedAt = 0;
const TOKEN_TTL_MS = 50 * 60 * 1000; // 50 minutes (tokens expire at 60)
let gcloudChecked = false;

/**
 * Verify that the gcloud CLI is installed and on PATH.
 * Called once on first credential request.
 */
async function ensureGcloudInstalled(): Promise<void> {
  if (gcloudChecked) return;
  try {
    const cmd = new Deno.Command("gcloud", {
      args: ["--version"],
      stdout: "piped",
      stderr: "piped",
    });
    const result = await cmd.output();
    if (!result.success) {
      throw new Error("gcloud exited with non-zero status");
    }
    gcloudChecked = true;
  } catch {
    throw new Error(
      "The gcloud CLI is not installed or not on PATH. " +
        "Install it from: https://cloud.google.com/sdk/docs/install",
    );
  }
}

/**
 * Gets GCP credentials using the standard credential chain:
 *
 * 1. GCP_ACCESS_TOKEN — pre-obtained OAuth2 access token
 *    (convenient for vault-stored tokens; does not require gcloud CLI)
 * 2. GOOGLE_APPLICATION_CREDENTIALS_JSON — inline service account JSON
 *    (convenient for swamp vaults)
 * 3. GOOGLE_APPLICATION_CREDENTIALS — path to a service account JSON file
 *    (standard Google SDK env var)
 * 4. Application Default Credentials — gcloud auth application-default login
 *    or metadata server (developer / CI workflow)
 *
 * For option 1, the token is used directly as a Bearer token.
 * For service account credentials (options 2 & 3), the account is activated
 * via gcloud CLI and an access token is obtained. For ADC (option 4), gcloud
 * prints the token from the currently authenticated user or service account.
 *
 * The GCP_PROJECT environment variable overrides the project ID from
 * credentials when set.
 */
async function getCredentials(
  explicit?: ExplicitGcpCredentials,
): Promise<GcpCredentials> {
  const quotaProjectId = explicit?.quotaProject ||
    Deno.env.get("GOOGLE_CLOUD_QUOTA_PROJECT")?.trim() || undefined;

  // Explicit credentials from global args take highest precedence (vault expressions).
  if (explicit?.accessToken) {
    const projectId = explicit.project ?? Deno.env.get("GCP_PROJECT")?.trim() ??
      Deno.env.get("GOOGLE_CLOUD_PROJECT")?.trim() ?? "";
    return { projectId, accessToken: explicit.accessToken, quotaProjectId };
  }
  if (explicit?.credentialsJson) {
    const creds = await activateServiceAccountFromJson(
      explicit.credentialsJson,
      explicit.scopes,
    );
    if (explicit.project) {
      return {
        projectId: explicit.project,
        accessToken: creds.accessToken,
        quotaProjectId,
      };
    }
    return { ...creds, quotaProjectId };
  }

  // Direct access token is always read fresh from the env (no caching).
  // Env reads are free, and we don't know when the token was minted so
  // a TTL-based cache would be wrong.
  const directToken = Deno.env.get("GCP_ACCESS_TOKEN")?.trim();
  if (directToken) {
    const projectId = explicit?.project ??
      Deno.env.get("GCP_PROJECT")?.trim() ??
      Deno.env.get("GOOGLE_CLOUD_PROJECT")?.trim();
    return {
      projectId: projectId ?? "",
      accessToken: directToken,
      quotaProjectId,
    };
  }

  if (cachedCredentials && (Date.now() - cachedAt) < TOKEN_TTL_MS) {
    if (explicit?.project) {
      return {
        projectId: explicit.project,
        accessToken: cachedCredentials.accessToken,
        quotaProjectId,
      };
    }
    return { ...cachedCredentials, quotaProjectId };
  }
  cachedCredentials = undefined;

  await ensureGcloudInstalled();

  // Try inline service account JSON
  const credJson = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS_JSON");
  if (credJson) {
    cachedCredentials = await activateServiceAccountFromJson(
      credJson,
      explicit?.scopes,
    );
    cachedAt = Date.now();
    if (explicit?.project) {
      return {
        projectId: explicit.project,
        accessToken: cachedCredentials.accessToken,
        quotaProjectId,
      };
    }
    return { ...cachedCredentials, quotaProjectId };
  }

  // Try file path to service account JSON
  const credFile = Deno.env.get("GOOGLE_APPLICATION_CREDENTIALS");
  if (credFile) {
    let fileContent: string;
    try {
      fileContent = await Deno.readTextFile(credFile);
    } catch (e) {
      throw new Error(
        `Cannot read GOOGLE_APPLICATION_CREDENTIALS file at ${credFile}: ${
          e instanceof Error ? e.message : e
        }`,
      );
    }
    cachedCredentials = await activateServiceAccountFromJson(
      fileContent,
      explicit?.scopes,
    );
    cachedAt = Date.now();
    if (explicit?.project) {
      return {
        projectId: explicit.project,
        accessToken: cachedCredentials.accessToken,
        quotaProjectId,
      };
    }
    return { ...cachedCredentials, quotaProjectId };
  }

  // Fall back to Application Default Credentials (gcloud auth)
  cachedCredentials = await getApplicationDefaultCredentials(explicit?.scopes);
  cachedAt = Date.now();
  if (explicit?.project) {
    return {
      projectId: explicit.project,
      accessToken: cachedCredentials.accessToken,
      quotaProjectId,
    };
  }
  return { ...cachedCredentials, quotaProjectId };
}

/**
 * Activates a service account from JSON credentials and returns a token.
 */
async function activateServiceAccountFromJson(
  json: string,
  scopes?: string[],
): Promise<GcpCredentials> {
  let creds: { client_email?: string; project_id?: string; type?: string };
  try {
    creds = JSON.parse(json);
  } catch {
    throw new Error("Service account JSON is not valid JSON");
  }

  if (!creds.client_email || !creds.project_id) {
    throw new Error(
      "Service account JSON must contain client_email and project_id",
    );
  }

  const projectOverride = Deno.env.get("GCP_PROJECT")?.trim() ||
    Deno.env.get("GOOGLE_CLOUD_PROJECT")?.trim();
  const projectId = projectOverride || creds.project_id;

  // Write credentials to a temp file for gcloud
  const tmpFile = await Deno.makeTempFile({ suffix: ".json" });
  try {
    await Deno.writeTextFile(tmpFile, json);

    // Activate service account
    const activateCmd = new Deno.Command("gcloud", {
      args: [
        "auth",
        "activate-service-account",
        creds.client_email,
        "--key-file",
        tmpFile,
        "--quiet",
      ],
      stdout: "piped",
      stderr: "piped",
    });
    const activateResult = await activateCmd.output();
    if (!activateResult.success) {
      const stderr = new TextDecoder().decode(activateResult.stderr);
      throw new Error(`Failed to activate service account: ${stderr}`);
    }

    // Get access token
    const tokenArgs = ["auth", "print-access-token", creds.client_email];
    if (scopes && scopes.length > 0) {
      tokenArgs.push(`--scopes=${scopes.join(",")}`);
    }
    const tokenCmd = new Deno.Command("gcloud", {
      args: tokenArgs,
      stdout: "piped",
      stderr: "piped",
    });
    const tokenResult = await tokenCmd.output();
    if (!tokenResult.success) {
      const stderr = new TextDecoder().decode(tokenResult.stderr);
      throw new Error(`Failed to get access token: ${stderr}`);
    }

    const accessToken = new TextDecoder().decode(tokenResult.stdout).trim();
    if (!accessToken) {
      throw new Error("gcloud returned empty access token");
    }

    return { projectId, accessToken };
  } finally {
    try {
      await Deno.remove(tmpFile);
    } catch { /* ignore cleanup errors */ }
  }
}

/**
 * Gets credentials from Application Default Credentials (ADC).
 * Uses whatever account is currently authenticated via gcloud.
 * Works with: gcloud auth application-default login, compute metadata, etc.
 */
async function getApplicationDefaultCredentials(
  scopes?: string[],
): Promise<GcpCredentials> {
  // Get access token from current gcloud auth
  const adcArgs = ["auth", "application-default", "print-access-token"];
  if (scopes && scopes.length > 0) {
    adcArgs.push(`--scopes=${scopes.join(",")}`);
  }
  const tokenCmd = new Deno.Command("gcloud", {
    args: adcArgs,
    stdout: "piped",
    stderr: "piped",
  });
  const tokenResult = await tokenCmd.output();
  if (!tokenResult.success) {
    const stderr = new TextDecoder().decode(tokenResult.stderr);
    throw new Error(
      "No GCP credentials found. Set one of:\n" +
        "  - GCP_ACCESS_TOKEN (pre-obtained OAuth2 access token; also set GCP_PROJECT)\n" +
        "  - GOOGLE_APPLICATION_CREDENTIALS_JSON (inline service account JSON)\n" +
        "  - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON file)\n" +
        "  - Run: gcloud auth application-default login\n" +
        `gcloud error: ${stderr}`,
    );
  }

  const accessToken = new TextDecoder().decode(tokenResult.stdout).trim();
  if (!accessToken) {
    throw new Error("gcloud returned empty access token");
  }

  // Get project ID
  const projectOverride = Deno.env.get("GCP_PROJECT")?.trim() ||
    Deno.env.get("GOOGLE_CLOUD_PROJECT")?.trim();
  if (projectOverride) {
    return { projectId: projectOverride, accessToken };
  }

  // Try to get project from gcloud config
  const projectCmd = new Deno.Command("gcloud", {
    args: ["config", "get-value", "project"],
    stdout: "piped",
    stderr: "piped",
  });
  const projectResult = await projectCmd.output();
  if (projectResult.success) {
    const projectId = new TextDecoder().decode(projectResult.stdout).trim();
    if (projectId && projectId !== "(unset)") {
      return { projectId, accessToken };
    }
  }

  // No project configured — return empty. Org-scoped resources (folders,
  // projects, tagKeys) don't need a project; project-scoped resources will
  // fail later with "Missing required path parameter: project" from buildUrl.
  return { projectId: "", accessToken };
}

/**
 * Builds a URL from a GCP Discovery path template and parameters.
 * Handles {param} (URL-encoded) and {+param} (raw) expansion.
 */
function buildUrl(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
): string {
  let url = config.path;

  // Replace path template parameters
  url = url.replace(/\{\+([^}]+)\}/g, (_match: string, paramName: string) => {
    // {+param} — raw expansion (no URL encoding)
    if (params[paramName] === undefined || params[paramName] === "") {
      throw new Error(`Missing required path parameter: ${paramName}`);
    }
    return params[paramName];
  });
  url = url.replace(/\{([^}]+)\}/g, (_match: string, paramName: string) => {
    // {param} — URL-encoded expansion
    if (params[paramName] === undefined || params[paramName] === "") {
      throw new Error(`Missing required path parameter: ${paramName}`);
    }
    return encodeURIComponent(params[paramName]);
  });

  // Build the full URL
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  // Add query parameters
  const queryParams: string[] = [];
  if (config.parameters) {
    for (const [name, paramDef] of Object.entries(config.parameters)) {
      if (paramDef.location === "query" && params[name] !== undefined) {
        queryParams.push(
          `${encodeURIComponent(name)}=${encodeURIComponent(params[name])}`,
        );
      }
    }
  }

  if (queryParams.length > 0) {
    const separator = fullUrl.includes("?") ? "&" : "?";
    return `${fullUrl}${separator}${queryParams.join("&")}`;
  }

  return fullUrl;
}

/**
 * Appends fields=* to a URL if it doesn't already have a fields= parameter.
 * GCP Discovery APIs define "fields" as a global query parameter that controls
 * partial responses. Without it, many APIs (Drive, Gmail, Calendar, Sheets, etc.)
 * return only a minimal set of fields. Sending fields=* ensures the response
 * matches the full StateSchema declared by the generated model.
 */
function appendFieldsParam(url: string): string {
  if (url.includes("fields=")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}fields=*`;
}

/**
 * Makes an authenticated HTTP request to the GCP API.
 */
export async function request(
  method: string,
  url: string,
  body?: Record<string, unknown>,
  credentials?: ExplicitGcpCredentials,
): Promise<Response> {
  const upperMethod = method.toUpperCase();
  const safeBody = (upperMethod === "GET" || upperMethod === "HEAD")
    ? undefined
    : body;
  const creds = await getCredentials(credentials);
  const headers: Record<string, string> = {
    "Authorization": `Bearer ${creds.accessToken}`,
    "Content-Type": "application/json",
  };
  if (creds.quotaProjectId) {
    headers["x-goog-user-project"] = creds.quotaProjectId;
  }

  const resp = await fetch(url, {
    method,
    headers,
    body: safeBody ? JSON.stringify(safeBody) : undefined,
  });

  // Retry once on 401 — token may have expired
  if (resp.status === 401) {
    await resp.text(); // drain body
    cachedCredentials = undefined;
    const freshCreds = await getCredentials(credentials);
    const retryHeaders: Record<string, string> = {
      "Authorization": `Bearer ${freshCreds.accessToken}`,
      "Content-Type": "application/json",
    };
    if (freshCreds.quotaProjectId) {
      retryHeaders["x-goog-user-project"] = freshCreds.quotaProjectId;
    }
    return await fetch(url, {
      method,
      headers: retryHeaders,
      body: safeBody ? JSON.stringify(safeBody) : undefined,
    });
  }

  return resp;
}

/**
 * Polls a GCP Long Running Operation until completion.
 * Returns the final operation response.
 */
async function pollOperation(
  operationUrl: string,
  credentials?: ExplicitGcpCredentials,
): Promise<any> {
  const maxAttempts = 20;
  const baseDelay = 2000; // 2 seconds
  const maxDelay = 30000; // 30 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const resp = await request("GET", operationUrl, undefined, credentials);
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`Failed to poll operation: ${resp.status} ${text}`);
    }

    const operation = await resp.json();

    // Compute API uses status === "DONE", other services use done === true
    if (operation.status === "DONE" || operation.done === true) {
      // Check for errors
      if (operation.error) {
        const errors = operation.error.errors || [operation.error];
        const messages = errors.map((e: any) => e.message || JSON.stringify(e));
        throw new Error(`Operation failed: ${messages.join(", ")}`);
      }
      return operation;
    }

    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error(
    `Operation timed out after ${maxAttempts} attempts: ${operationUrl}`,
  );
}

/**
 * Checks if an operation response indicates an LRO.
 */
function isLongRunningOperation(response: any): boolean {
  if (!response || typeof response !== "object") return false;
  // Compute API pattern: kind contains "#operation"
  if (
    response.kind && typeof response.kind === "string" &&
    response.kind.includes("#operation")
  ) return true;
  // Generic LRO pattern: name contains "operations/" (v3 APIs may omit "done" initially)
  if (
    "name" in response && typeof response.name === "string" &&
    response.name.includes("operations/")
  ) return true;
  // GKE / Container API pattern: has operationType + status + name starting with "operation-"
  if (
    response.operationType && typeof response.operationType === "string" &&
    response.status && typeof response.name === "string" &&
    response.name.startsWith("operation")
  ) return true;
  return false;
}

/**
 * Checks if an LRO is already complete (no polling needed).
 */
function isOperationDone(response: any): boolean {
  return response.status === "DONE" || response.done === true;
}

/**
 * Checks an LRO for errors and throws if any are found.
 */
function checkOperationError(operation: any): void {
  if (operation.error) {
    const errors = operation.error.errors || [operation.error];
    const messages = errors.map((e: any) => e.message || JSON.stringify(e));
    throw new Error(`Operation failed: ${messages.join(", ")}`);
  }
}

/**
 * Gets the operation URL for polling.
 * Extracts the API version prefix from the request path to ensure the
 * poll URL includes it (e.g., v1/operations/... not just operations/...).
 */
function getOperationUrl(
  baseUrl: string,
  response: any,
  requestPath?: string,
): string {
  // If the response has a selfLink, use it directly
  if (response.selfLink) return response.selfLink;

  if (response.name && typeof response.name === "string") {
    // Already a full URL
    if (response.name.startsWith("http")) return response.name;

    // Extract the API version prefix from the request path (e.g., "v1" from "v1/{+name}:enable")
    let versionPrefix = "";
    if (requestPath) {
      const versionMatch = requestPath.match(
        /^(v[0-9]+(?:p[0-9]+)?(?:(?:alpha|beta)[0-9]*)?)\//,
      );
      if (versionMatch) {
        versionPrefix = versionMatch[1] + "/";
      }
    }

    // If the operation name already starts with the version prefix, don't double it
    if (versionPrefix && response.name.startsWith(versionPrefix)) {
      return `${baseUrl}${response.name}`;
    }

    return `${baseUrl}${versionPrefix}${response.name}`;
  }
  throw new Error("Cannot determine operation URL from response");
}

/**
 * Creates a GCP resource.
 * Handles LRO polling if the creation returns an operation.
 */
interface ReadinessConfig {
  statusField: string;
  readyValues: string[];
  failedValues?: string[];
}

interface IdempotencyConfig {
  listConfig: GcpMethodConfig;
  listParams: Record<string, string>;
  matchField: string;
  matchValue: string;
}

export async function createResource(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  body: Record<string, unknown> | undefined,
  readConfig?: GcpMethodConfig,
  readiness?: ReadinessConfig,
  idempotency?: IdempotencyConfig,
  credentials?: ExplicitGcpCredentials,
): Promise<any> {
  const url = buildUrl(baseUrl, config, params);
  const resp = await request(config.httpMethod, url, body, credentials);

  if (resp.status === 409 && idempotency) {
    const conflictBody = await resp.text();
    const existing = await tryReadViaList(
      baseUrl,
      idempotency.listConfig,
      idempotency.listParams,
      idempotency.matchField,
      idempotency.matchValue,
      credentials,
    );
    if (existing) return existing;
    throw new Error(
      `Create failed (409): ${conflictBody}. Idempotency fallback also found no match via list.`,
    );
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Create failed (${resp.status}): ${text}`);
  }

  let result = await resp.json();

  // Handle LRO
  if (isLongRunningOperation(result)) {
    let operation = result;

    if (!isOperationDone(result)) {
      // Operation is still in progress — poll until done
      const opUrl = getOperationUrl(baseUrl, result, config.path);
      operation = await pollOperation(opUrl, credentials);
    }

    // Check for errors in the completed operation
    try {
      checkOperationError(operation);
    } catch (opErr) {
      if (isAlreadyExistsError(opErr) && idempotency) {
        const existing = await tryReadViaList(
          baseUrl,
          idempotency.listConfig,
          idempotency.listParams,
          idempotency.matchField,
          idempotency.matchValue,
          credentials,
        );
        if (existing) return existing;
      }
      throw opErr;
    }

    // After operation completes, read the resource for final state.
    // v3 LROs include the resource in operation.response — extract its
    // name so the read-back URL can be constructed.
    if (
      operation.response && typeof operation.response === "object" &&
      operation.response.name && !params["name"]
    ) {
      params["name"] = String(operation.response.name);
    }
    if (readConfig) {
      try {
        const readUrl = appendFieldsParam(
          buildUrl(baseUrl, readConfig, params),
        );
        const readResp = await request("GET", readUrl, undefined, credentials);
        if (readResp.ok) {
          result = await readResp.json();
        } else if (
          operation.response && typeof operation.response === "object"
        ) {
          result = operation.response;
        } else if (operation.targetLink) {
          const targetResp = await request(
            "GET",
            appendFieldsParam(operation.targetLink),
            undefined,
            credentials,
          );
          if (targetResp.ok) {
            result = await targetResp.json();
          }
        }
      } catch {
        // buildUrl may throw if required params are still missing — fall back
        if (operation.response && typeof operation.response === "object") {
          result = operation.response;
        } else if (operation.targetLink) {
          const targetResp = await request(
            "GET",
            appendFieldsParam(operation.targetLink),
            undefined,
            credentials,
          );
          if (targetResp.ok) {
            result = await targetResp.json();
          }
        }
      }
    } else {
      result = operation;
    }
  }

  // Poll for resource readiness after create (some services report LRO done
  // while the resource is still in an intermediate state like PROVISIONING)
  if (readiness && readConfig) {
    const maxAttempts = 60;
    const pollDelay = 10000; // 10 seconds
    for (let i = 0; i < maxAttempts; i++) {
      const currentStatus = result?.[readiness.statusField];
      if (currentStatus && readiness.readyValues.includes(currentStatus)) {
        break; // Resource is ready
      }
      if (currentStatus && readiness.failedValues?.includes(currentStatus)) {
        throw new Error(`Resource entered failed state: ${currentStatus}`);
      }
      await new Promise((resolve) => setTimeout(resolve, pollDelay));
      // Re-read the resource to check status
      const readUrl = appendFieldsParam(buildUrl(baseUrl, readConfig, params));
      const readResp = await request("GET", readUrl, undefined, credentials);
      if (readResp.ok) {
        result = await readResp.json();
      } else {
        await readResp.text(); // drain body to release connection
      }
    }
  }

  return result;
}

/**
 * Reads a GCP resource by GET.
 */
export async function readResource(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  credentials?: ExplicitGcpCredentials,
): Promise<any> {
  const url = appendFieldsParam(buildUrl(baseUrl, config, params));
  const resp = await request("GET", url, undefined, credentials);

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Read failed (${resp.status}): ${text}`);
  }

  return await resp.json();
}

/**
 * Reads a GCP resource by listing and filtering (for listOnly resources).
 */
export async function readViaList(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  filterField: string,
  filterValue: string,
  credentials?: ExplicitGcpCredentials,
): Promise<any> {
  const baseUrlBuilt = appendFieldsParam(buildUrl(baseUrl, config, params));
  const maxPages = 100;
  let url = baseUrlBuilt;

  for (let page = 0; page < maxPages; page++) {
    const resp = await request("GET", url, undefined, credentials);

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`List failed (${resp.status}): ${text}`);
    }

    const data = await resp.json();

    // Find the array property containing resources
    for (const value of Object.values(data)) {
      if (Array.isArray(value)) {
        const match = value.find((item: any) =>
          item && item[filterField] === filterValue
        );
        if (match) return match;
      }
    }

    // Follow pagination
    if (!data.nextPageToken) break;
    const separator = baseUrlBuilt.includes("?") ? "&" : "?";
    url = `${baseUrlBuilt}${separator}pageToken=${
      encodeURIComponent(data.nextPageToken)
    }`;
  }

  throw new Error(`Resource not found: ${filterField}=${filterValue}`);
}

/**
 * Lists GCP resources by paginating through a list endpoint.
 * Returns all items collected across pages.
 */
export async function listResources(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  arrayField: string,
  maxPages: number = 10,
  credentials?: ExplicitGcpCredentials,
): Promise<{ items: any[]; nextPageToken?: string }> {
  const allItems: any[] = [];
  let baseUrlBuilt = buildUrl(baseUrl, config, params);
  if (!baseUrlBuilt.includes("fields=")) {
    baseUrlBuilt += (baseUrlBuilt.includes("?") ? "&" : "?") + "fields=*";
  }
  let url = baseUrlBuilt;
  let lastNextPageToken: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const resp = await request("GET", url, undefined, credentials);

    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`List failed (${resp.status}): ${text}`);
    }

    const data = await resp.json();
    const items = data[arrayField];
    if (Array.isArray(items)) {
      allItems.push(...items);
    }

    if (!data.nextPageToken) {
      lastNextPageToken = undefined;
      break;
    }
    lastNextPageToken = data.nextPageToken;
    const separator = baseUrlBuilt.includes("?") ? "&" : "?";
    url = `${baseUrlBuilt}${separator}pageToken=${
      encodeURIComponent(data.nextPageToken)
    }`;
  }

  return { items: allItems, nextPageToken: lastNextPageToken };
}

/**
 * Tries to read a resource, returning null if not found (404).
 */
export async function tryReadResource(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  credentials?: ExplicitGcpCredentials,
): Promise<any | null> {
  const url = appendFieldsParam(buildUrl(baseUrl, config, params));
  const resp = await request("GET", url, undefined, credentials);

  if (resp.status === 404) {
    await resp.text(); // drain body
    return null;
  }

  if (resp.status === 403) {
    const text = await resp.text();
    throw new Error(
      `Access denied (${resp.status}): ${text}. Check IAM permissions.`,
    );
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Read failed (${resp.status}): ${text}`);
  }

  return await resp.json();
}

/**
 * Updates a GCP resource.
 * Handles LRO polling if the update returns an operation.
 */
export async function updateResource(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  body: Record<string, unknown>,
  readConfig?: GcpMethodConfig,
  readiness?: ReadinessConfig,
  credentials?: ExplicitGcpCredentials,
): Promise<any> {
  const url = buildUrl(baseUrl, config, params);
  const resp = await request(config.httpMethod, url, body, credentials);

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Update failed (${resp.status}): ${text}`);
  }

  let result = await resp.json();

  if (isLongRunningOperation(result)) {
    let operation = result;

    if (!isOperationDone(result)) {
      const opUrl = getOperationUrl(baseUrl, result, config.path);
      operation = await pollOperation(opUrl, credentials);
    }

    checkOperationError(operation);

    // Read the resource for final state
    if (readConfig) {
      const readUrl = appendFieldsParam(buildUrl(baseUrl, readConfig, params));
      const readResp = await request("GET", readUrl, undefined, credentials);
      if (readResp.ok) {
        result = await readResp.json();
      }
    } else {
      result = operation;
    }
  }

  // Poll for resource readiness after update
  if (readiness && readConfig) {
    const maxAttempts = 60;
    const pollDelay = 10000;
    for (let i = 0; i < maxAttempts; i++) {
      const currentStatus = result?.[readiness.statusField];
      if (currentStatus && readiness.readyValues.includes(currentStatus)) {
        break;
      }
      if (currentStatus && readiness.failedValues?.includes(currentStatus)) {
        throw new Error(`Resource entered failed state: ${currentStatus}`);
      }
      await new Promise((resolve) => setTimeout(resolve, pollDelay));
      const readUrl = appendFieldsParam(buildUrl(baseUrl, readConfig, params));
      const readResp = await request("GET", readUrl, undefined, credentials);
      if (readResp.ok) {
        result = await readResp.json();
      } else {
        await readResp.text(); // drain body to release connection
      }
    }
  }

  return result;
}

/**
 * Deletes a GCP resource.
 * Returns { existed: boolean }.
 */
export async function deleteResource(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  credentials?: ExplicitGcpCredentials,
): Promise<{ existed: boolean }> {
  const url = buildUrl(baseUrl, config, params);
  const resp = await request(config.httpMethod, url, undefined, credentials);

  if (resp.status === 404) {
    await resp.text(); // drain body
    return { existed: false };
  }

  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Delete failed (${resp.status}): ${text}`);
  }

  // Some GCP delete endpoints return 204 No Content (empty body)
  if (resp.status === 204 || resp.headers.get("content-length") === "0") {
    return { existed: true };
  }

  const result = await resp.json();

  // Handle LRO
  if (isLongRunningOperation(result)) {
    let operation = result;
    if (!isOperationDone(result)) {
      const opUrl = getOperationUrl(baseUrl, result, config.path);
      operation = await pollOperation(opUrl, credentials);
    }
    checkOperationError(operation);
  }

  return { existed: true };
}

/**
 * Checks if an error indicates a resource was not found.
 */
export function isResourceNotFoundError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes("(404)") ||
      error.message.includes("not found") ||
      error.message.includes("Not Found");
  }
  return false;
}

/**
 * Checks if an error indicates a resource already exists.
 */
export function isAlreadyExistsError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return msg.includes("(409)") ||
      msg.includes("already exists") ||
      msg.includes("already_exists") ||
      msg.includes("uniqueness within the parent") ||
      msg.includes("duplicate");
  }
  return false;
}

/**
 * Like readViaList but returns null instead of throwing when not found.
 */
export async function tryReadViaList(
  baseUrl: string,
  config: GcpMethodConfig,
  params: Record<string, string>,
  filterField: string,
  filterValue: string,
  credentials?: ExplicitGcpCredentials,
): Promise<any | null> {
  const baseUrlBuilt = appendFieldsParam(buildUrl(baseUrl, config, params));
  const maxPages = 100;
  let url = baseUrlBuilt;

  for (let page = 0; page < maxPages; page++) {
    const resp = await request("GET", url, undefined, credentials);
    if (!resp.ok) {
      await resp.text();
      return null;
    }

    const data = await resp.json();
    for (const value of Object.values(data)) {
      if (Array.isArray(value)) {
        const match = value.find((item: any) =>
          item && item[filterField] === filterValue
        );
        if (match) return match;
      }
    }

    if (!data.nextPageToken) break;
    const separator = baseUrlBuilt.includes("?") ? "&" : "?";
    url = `${baseUrlBuilt}${separator}pageToken=${
      encodeURIComponent(data.nextPageToken)
    }`;
  }

  return null;
}

/**
 * Gets the project ID from cached credentials.
 */
export async function getProjectId(
  credentials?: ExplicitGcpCredentials,
): Promise<string> {
  const creds = await getCredentials(credentials);
  return creds.projectId;
}
