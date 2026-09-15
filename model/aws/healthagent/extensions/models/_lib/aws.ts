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

// Auto-generated shared helper for AWS CloudControl extension models.
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

import {
  CloudControlClient,
  CreateResourceCommand,
  DeleteResourceCommand,
  GetResourceCommand,
  GetResourceRequestStatusCommand,
  ListResourcesCommand,
  UpdateResourceCommand,
} from "npm:@aws-sdk/client-cloudcontrol@3.1127.0";
import jsonpatch from "npm:fast-json-patch@3.1.1";

export interface AwsCredentials {
  accessKeyId?: string;
  secretAccessKey?: string;
  sessionToken?: string;
  region?: string;
}

type AwsCredentialErrorKind =
  | "session-expired"
  | "credentials-rejected"
  | "other";

function classifyAwsCredentialError(
  code: string | undefined,
  status: number | undefined,
): AwsCredentialErrorKind {
  if (code === "CredentialsProviderError" || code === "ExpiredTokenException") {
    return "session-expired";
  }
  if (
    code === "InvalidAccessKeyId" ||
    code === "SignatureDoesNotMatch" ||
    (status === 403 && code === "AccessDenied")
  ) {
    return "credentials-rejected";
  }
  return "other";
}

function deriveAwsErrorCode(e: {
  Code?: string;
  name?: string;
  cause?: unknown;
}): string | undefined {
  if (e.Code) return e.Code;
  if (e.name && e.name !== "Error") return e.name;
  if (e.cause instanceof Error && e.cause.name && e.cause.name !== "Error") {
    return e.cause.name.replace(/^_+/, "");
  }
  return undefined;
}

function formatAwsCredentialHint(
  kind: AwsCredentialErrorKind,
  awsProfile: string | undefined,
  context: string,
): string | undefined {
  if (kind === "session-expired") {
    const cmd = awsProfile
      ? 'aws sso login --profile "' + awsProfile + '"'
      : "aws sso login";
    return (
      context +
      " session expired: your AWS profile's SSO session is no longer valid. Run '" +
      cmd +
      "' to refresh, then retry."
    );
  }
  if (kind === "credentials-rejected") {
    const who = awsProfile ? "'" + awsProfile + "'" : "your AWS profile";
    return (
      context +
      " credentials rejected by AWS: verify " +
      who +
      ", environment variables, or credential provider, then retry."
    );
  }
  return undefined;
}

function parseAwsConfigSections(
  text: string,
): Map<string, Map<string, string>> {
  const sections = new Map<string, Map<string, string>>();
  let current: Map<string, string> | undefined;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const header = trimmed.slice(1, -1).trim();
      current = new Map();
      sections.set(header, current);
      continue;
    }
    if (current && trimmed && !trimmed.startsWith("#")) {
      const eq = trimmed.indexOf("=");
      if (eq > 0) {
        current.set(trimmed.slice(0, eq).trim(), trimmed.slice(eq + 1).trim());
      }
    }
  }
  return sections;
}

function resolveRegion(credentials?: AwsCredentials): string {
  if (credentials?.region) return credentials.region;

  const envRegion = Deno.env.get("AWS_REGION") ??
    Deno.env.get("AWS_DEFAULT_REGION");
  if (envRegion) return envRegion;

  try {
    const profile = Deno.env.get("AWS_PROFILE") ?? "default";
    const home = Deno.env.get("HOME");
    if (!home && !Deno.env.get("AWS_CONFIG_FILE")) return "us-east-1";
    const configPath = Deno.env.get("AWS_CONFIG_FILE") ??
      `${home}/.aws/config`;
    const configText = Deno.readTextFileSync(configPath);
    const sections = parseAwsConfigSections(configText);

    const visited = new Set<string>();
    let current = profile;
    while (current && !visited.has(current)) {
      visited.add(current);
      const key = current === "default" ? "default" : `profile ${current}`;
      const section = sections.get(key);
      if (!section) break;

      const region = section.get("region");
      if (region) return region;

      const ssoSession = section.get("sso_session");
      if (ssoSession) {
        const sessionSection = sections.get(`sso-session ${ssoSession}`);
        const ssoRegion = sessionSection?.get("sso_region");
        if (ssoRegion) return ssoRegion;
      }

      current = section.get("source_profile") ?? "";
    }
  } catch {
    // Config file not found or unreadable — fall through to default
  }

  return "us-east-1";
}

function createClient(credentials?: AwsCredentials): CloudControlClient {
  const region = resolveRegion(credentials);
  const config: Record<string, unknown> = { region };

  if (credentials?.accessKeyId && credentials?.secretAccessKey) {
    config.credentials = {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      ...(credentials.sessionToken
        ? { sessionToken: credentials.sessionToken }
        : {}),
    };
  } else if (credentials?.accessKeyId || credentials?.secretAccessKey) {
    console.warn(
      "[AWS] Partial credentials: both accessKeyId and secretAccessKey must be provided. " +
        "Falling back to the default credential chain.",
    );
  }

  return new CloudControlClient(config);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isThrottlingError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const name = error instanceof Error ? error.name : "";
  return (
    msg.includes("Throttling") ||
    msg.includes("TooManyRequests") ||
    msg.includes("RequestLimitExceeded") ||
    msg.includes("Rate exceeded") ||
    name === "ThrottlingException"
  );
}

export function isResourceNotFoundError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error);
  const name = error instanceof Error ? error.name : "";
  return (
    msg.includes("was not found") ||
    msg.includes("does not exist") ||
    name === "ResourceNotFoundException"
  );
}

async function withRetry<T>(
  operation: () => Promise<T>,
  operationName: string,
  maxAttempts = 20,
): Promise<T> {
  const baseDelay = 1000;
  const maxDelay = 90000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (isThrottlingError(error) && attempt < maxAttempts - 1) {
        const exponentialDelay = Math.min(
          baseDelay * Math.pow(2, attempt),
          maxDelay,
        );
        const jitter = Math.random() * 0.3 * exponentialDelay;
        console.log(
          `[${operationName}] Throttled on attempt ${attempt + 1}, waiting ${
            Math.round(exponentialDelay + jitter)
          }ms`,
        );
        await delay(exponentialDelay + jitter);
        continue;
      }
      if (error instanceof Error) {
        const sdkErr = error as Error & {
          $metadata?: { httpStatusCode?: number };
          Code?: string;
        };
        const code = deriveAwsErrorCode(sdkErr);
        const kind = classifyAwsCredentialError(
          code,
          sdkErr.$metadata?.httpStatusCode,
        );
        if (kind !== "other") {
          const hint = formatAwsCredentialHint(
            kind,
            Deno.env.get("AWS_PROFILE"),
            "Model",
          );
          if (hint) {
            throw new Error(hint + " " + error.message, { cause: error });
          }
        }
      }
      throw error;
    }
  }
  throw new Error(`${operationName} failed after ${maxAttempts} attempts`);
}

async function pollOperationStatus(
  client: CloudControlClient,
  requestToken: string,
  operationName: string,
): Promise<{ status: string; identifier?: string; message?: string }> {
  const baseDelay = 1000;
  const maxDelay = 90000;

  for (let attempt = 0; attempt < 60; attempt++) {
    const response = await withRetry(
      () =>
        client.send(
          new GetResourceRequestStatusCommand({
            RequestToken: requestToken,
          }),
        ),
      `${operationName} status poll`,
    );

    const status = response.ProgressEvent?.OperationStatus;
    if (status === "SUCCESS") {
      return {
        status: "SUCCESS",
        identifier: response.ProgressEvent?.Identifier,
      };
    }
    if (status === "FAILED") {
      return {
        status: "FAILED",
        message: response.ProgressEvent?.StatusMessage ||
          response.ProgressEvent?.ErrorCode,
      };
    }
    if (status === "CANCEL_COMPLETE") {
      return {
        status: "CANCEL_COMPLETE",
        message: "Operation cancelled by API or AWS",
      };
    }

    const exponentialDelay = Math.min(
      baseDelay * Math.pow(2, attempt),
      maxDelay,
    );
    const jitter = Math.random() * 0.3 * exponentialDelay;
    console.log(
      `[${operationName}] IN_PROGRESS, waiting ${
        Math.round(exponentialDelay + jitter)
      }ms (poll ${attempt + 1})`,
    );
    await delay(exponentialDelay + jitter);
  }

  throw new Error(`${operationName} timed out after polling`);
}

/**
 * Create an AWS resource via CloudControl API.
 * Sends CreateResourceCommand, polls until complete, then reads the resource.
 * Returns the resource properties.
 */
export async function createResource(
  typeName: string,
  desiredState: Record<string, unknown>,
  credentials?: AwsCredentials,
): Promise<Record<string, unknown>> {
  const client = createClient(credentials);

  console.log(`[CREATE] Starting create for ${typeName}`);

  const response = await withRetry(
    () =>
      client.send(
        new CreateResourceCommand({
          TypeName: typeName,
          DesiredState: JSON.stringify(desiredState),
        }),
      ),
    `${typeName} create`,
  );

  if (!response.ProgressEvent?.RequestToken) {
    throw new Error(`${typeName} creation failed: no request token returned`);
  }

  const requestToken = response.ProgressEvent.RequestToken;
  console.log(`[CREATE] Got request token: ${requestToken}`);

  const pollResult = await pollOperationStatus(
    client,
    requestToken,
    `${typeName} create`,
  );

  if (pollResult.status === "FAILED") {
    throw new Error(
      `${typeName} creation failed: ${pollResult.message || "Unknown error"}`,
    );
  }
  if (pollResult.status === "CANCEL_COMPLETE") {
    throw new Error(
      `${typeName} creation cancelled: ${pollResult.message}`,
    );
  }

  const identifier = pollResult.identifier;
  if (!identifier) {
    throw new Error(
      `${typeName} creation succeeded but no identifier returned`,
    );
  }

  console.log(`[CREATE] Success, fetching resource ${identifier}`);

  const getResponse = await withRetry(
    () =>
      client.send(
        new GetResourceCommand({
          TypeName: typeName,
          Identifier: identifier,
        }),
      ),
    `${typeName} create get-resource`,
  );

  if (!getResponse.ResourceDescription?.Properties) {
    throw new Error(`Failed to get ${typeName} details after creation`);
  }

  return JSON.parse(getResponse.ResourceDescription.Properties);
}

/**
 * Read an AWS resource via CloudControl API.
 * Returns the resource properties, or throws if not found.
 */
export async function readResource(
  typeName: string,
  identifier: string,
  credentials?: AwsCredentials,
): Promise<Record<string, unknown>> {
  const client = createClient(credentials);

  console.log(`[READ] Fetching ${typeName} identifier: ${identifier}`);

  const response = await withRetry(
    () =>
      client.send(
        new GetResourceCommand({
          TypeName: typeName,
          Identifier: identifier,
        }),
      ),
    `${typeName} read`,
  );

  if (!response.ResourceDescription?.Properties) {
    throw new Error(`Failed to get ${typeName} details`);
  }

  return JSON.parse(response.ResourceDescription.Properties);
}

/**
 * Update an AWS resource via CloudControl API.
 * Reads current state, computes JSON patch (filtering createOnlyProperties),
 * sends UpdateResourceCommand, polls, then reads the updated resource.
 */
export async function updateResource(
  typeName: string,
  identifier: string,
  currentState: Record<string, unknown>,
  desiredState: Record<string, unknown>,
  createOnlyProperties?: string[],
  credentials?: AwsCredentials,
): Promise<Record<string, unknown>> {
  const client = createClient(credentials);
  const createOnlySet = new Set(createOnlyProperties ?? []);

  console.log(
    `[UPDATE] Starting update for ${typeName} identifier: ${identifier}`,
  );

  // Compute JSON patch, filtering out create-only properties
  const rawPatch = jsonpatch.compare(currentState, desiredState);
  const patch = rawPatch.filter((op: { path: string }) => {
    const topLevelProp = op.path.split("/")[1];
    if (topLevelProp && createOnlySet.has(topLevelProp)) {
      console.log(`[UPDATE] Skipping create-only property: ${topLevelProp}`);
      return false;
    }
    return true;
  });

  if (patch.length === 0) {
    console.log(`[UPDATE] No changes detected, returning current state`);
    return currentState;
  }

  console.log(`[UPDATE] Applying ${patch.length} patch operations`);

  const response = await withRetry(
    () =>
      client.send(
        new UpdateResourceCommand({
          TypeName: typeName,
          Identifier: identifier,
          PatchDocument: JSON.stringify(patch),
        }),
      ),
    `${typeName} update`,
  );

  if (!response.ProgressEvent?.RequestToken) {
    throw new Error(`${typeName} update failed: no request token returned`);
  }

  const requestToken = response.ProgressEvent.RequestToken;
  console.log(`[UPDATE] Got request token: ${requestToken}`);

  const pollResult = await pollOperationStatus(
    client,
    requestToken,
    `${typeName} update`,
  );

  if (pollResult.status === "FAILED") {
    throw new Error(
      `${typeName} update failed: ${pollResult.message || "Unknown error"}`,
    );
  }
  if (pollResult.status === "CANCEL_COMPLETE") {
    throw new Error(`${typeName} update cancelled: ${pollResult.message}`);
  }

  const resultIdentifier = pollResult.identifier || identifier;
  console.log(`[UPDATE] Success, fetching resource ${resultIdentifier}`);

  const getResponse = await withRetry(
    () =>
      client.send(
        new GetResourceCommand({
          TypeName: typeName,
          Identifier: resultIdentifier,
        }),
      ),
    `${typeName} update get-resource`,
  );

  if (!getResponse.ResourceDescription?.Properties) {
    throw new Error(`Failed to get ${typeName} details after update`);
  }

  return JSON.parse(getResponse.ResourceDescription.Properties);
}

/**
 * Delete an AWS resource via CloudControl API.
 * Returns { existed: true } on success, { existed: false } if already gone.
 */
export async function deleteResource(
  typeName: string,
  identifier: string,
  credentials?: AwsCredentials,
): Promise<{ existed: boolean }> {
  const client = createClient(credentials);

  console.log(
    `[DELETE] Starting delete for ${typeName} identifier: ${identifier}`,
  );

  try {
    const response = await withRetry(
      () =>
        client.send(
          new DeleteResourceCommand({
            TypeName: typeName,
            Identifier: identifier,
          }),
        ),
      `${typeName} delete`,
    );

    if (!response.ProgressEvent?.RequestToken) {
      throw new Error(`${typeName} deletion failed: no request token returned`);
    }

    const requestToken = response.ProgressEvent.RequestToken;
    console.log(`[DELETE] Got request token: ${requestToken}`);

    const pollResult = await pollOperationStatus(
      client,
      requestToken,
      `${typeName} delete`,
    );

    if (pollResult.status === "FAILED") {
      if (
        pollResult.message &&
        (pollResult.message.includes("was not found") ||
          pollResult.message.includes("does not exist"))
      ) {
        return { existed: false };
      }
      throw new Error(
        `${typeName} deletion failed: ${pollResult.message || "Unknown error"}`,
      );
    }

    if (pollResult.status === "CANCEL_COMPLETE") {
      throw new Error(
        `${typeName} deletion cancelled: ${pollResult.message}`,
      );
    }

    return { existed: true };
  } catch (error: unknown) {
    if (isResourceNotFoundError(error)) {
      return { existed: false };
    }
    throw error;
  }
}

/**
 * List AWS resources via CloudControl API.
 * Paginates via NextToken up to maxPages, deduplicates by Identifier,
 * and parses Properties when present.
 * Returns items with their identifiers and any available properties.
 */
export async function listResources(
  typeName: string,
  options?: {
    resourceModel?: string;
    maxPages?: number;
    credentials?: AwsCredentials;
  },
): Promise<
  {
    items: { identifier: string; properties?: Record<string, unknown> }[];
    nextToken?: string;
  }
> {
  const client = createClient(options?.credentials);
  const maxPages = options?.maxPages ?? 10;

  console.log(`[LIST] Listing ${typeName} (maxPages: ${maxPages})`);

  const seen = new Set<string>();
  const items: { identifier: string; properties?: Record<string, unknown> }[] =
    [];
  let nextToken: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const input: Record<string, unknown> = { TypeName: typeName };
    if (options?.resourceModel) input.ResourceModel = options.resourceModel;
    if (nextToken) input.NextToken = nextToken;

    let response;
    try {
      response = await withRetry(
        () => client.send(new ListResourcesCommand(input as any)),
        `${typeName} list (page ${page + 1})`,
      );
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      const name = error instanceof Error ? error.name : "";
      if (
        name === "UnsupportedActionException" ||
        msg.includes("UnsupportedAction") ||
        msg.includes("does not support LIST")
      ) {
        throw new Error(
          `${typeName} does not support listing via CloudControl. The resource type has no LIST handler.`,
        );
      }
      throw error;
    }

    const descriptions = response.ResourceDescriptions ?? [];
    for (const desc of descriptions) {
      const identifier = desc.Identifier;
      if (!identifier || seen.has(identifier)) continue;
      seen.add(identifier);

      let properties: Record<string, unknown> | undefined;
      if (desc.Properties) {
        try {
          properties = JSON.parse(desc.Properties);
        } catch {
          // Properties not parseable — include item with identifier only
        }
      }

      items.push({ identifier, properties });
    }

    nextToken = response.NextToken;
    if (!nextToken) break;

    console.log(
      `[LIST] Page ${
        page + 1
      }: ${descriptions.length} resources, continuing...`,
    );
  }

  if (nextToken) {
    console.log(
      `[LIST] Reached maxPages (${maxPages}), ${items.length} resources found. More available (nextToken present).`,
    );
  } else {
    console.log(`[LIST] Complete: ${items.length} resources found.`);
  }

  return { items, nextToken };
}
