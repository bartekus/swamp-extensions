// Swamp, an Automation Framework
// Copyright (C) 2026 System Initiative, Inc.
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

/**
 * Thin wrapper around AWS S3 SDK for datastore operations.
 */

// NOTE: The version pin here is load-bearing. Swamp's bundler pulls extension
// sources without the repo's deno.json, so bare specifiers like
// "@aws-sdk/client-s3" don't resolve at bundle time (rule 7 in CLAUDE.md).
// Keep this pin in sync with the version declared in this extension's
// deno.json for consistent type-checking during local dev.
import {
  CopyObjectCommand,
  type CopyObjectCommandOutput,
  DeleteObjectCommand,
  type DeleteObjectCommandOutput,
  GetObjectCommand,
  type GetObjectCommandOutput,
  HeadBucketCommand,
  type HeadBucketCommandOutput,
  HeadObjectCommand,
  type HeadObjectCommandOutput,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
  PutObjectCommand,
  type PutObjectCommandOutput,
  S3Client as AwsS3Client,
} from "npm:@aws-sdk/client-s3@3.1127.0";
import { Readable } from "node:stream";
import { SpanStatusCode } from "npm:@opentelemetry/api@1.9.0";
import { Attr, getTracer } from "./tracing.ts";

export interface S3ClientConfig {
  bucket: string;
  prefix?: string;
  region?: string;
  /** Custom S3-compatible endpoint URL (e.g., https://nyc3.digitaloceanspaces.com) */
  endpoint?: string;
  /** Use path-style addressing (bucket in path, not subdomain). Default: false. */
  forcePathStyle?: boolean;
  /**
   * Per-request timeout in milliseconds. Defaults to 30s. Every SDK call
   * is guarded by `AbortSignal.timeout(defaultRequestTimeoutMs)`, composed
   * with any caller-supplied signal. Prevents individual operations from
   * hanging indefinitely on network stalls.
   */
  defaultRequestTimeoutMs?: number;
}

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000;

export interface S3ListEntry {
  key: string;
  size: number;
  etag?: string;
  lastModified?: Date;
}

export interface S3ListResult {
  entries: S3ListEntry[];
  truncated: boolean;
  continuationToken?: string;
}

/** Max bytes of response body displayed in the error preview string. */
const ERROR_BODY_PREVIEW_BYTES = 256;

/**
 * Hard cap on how many bytes we read from an error response body before
 * abandoning the stream. Real S3-compatible error bodies are <10KB; this
 * protects against a buggy/adversarial server returning a huge body on 4xx.
 * If the cap is hit, the SDK deserializer will see a truncated body and
 * fail — we still surface status/requestId/preview, which is enough.
 */
const MAX_ERROR_BODY_BYTES = 64 * 1024;

/**
 * Error thrown by `S3Client` operations. Preserves the original SDK error's
 * `name` (so existing checks like `error.name === "NotFound"` keep working),
 * sets `cause` to the original, and exposes HTTP-level detail that the SDK's
 * XML deserializer normally hides behind a generic "UnknownError".
 */
export class S3OperationError extends Error {
  override readonly name: string;
  readonly httpStatusCode: number | undefined;
  readonly code: string | undefined;
  readonly requestId: string | undefined;
  readonly bodyPreview: string | undefined;

  constructor(
    message: string,
    opts: {
      name: string;
      cause: unknown;
      httpStatusCode: number | undefined;
      code: string | undefined;
      requestId: string | undefined;
      bodyPreview: string | undefined;
    },
  ) {
    super(message, { cause: opts.cause });
    this.name = opts.name;
    this.httpStatusCode = opts.httpStatusCode;
    this.code = opts.code;
    this.requestId = opts.requestId;
    this.bodyPreview = opts.bodyPreview;
  }
}

import {
  classifyAwsCredentialError,
  deriveAwsErrorCode,
  formatAwsCredentialHint,
  preflightCredentials as runPreflightCredentials,
} from "./aws_credentials.ts";
export {
  type AwsCredentialErrorKind,
  classifyAwsCredentialError,
  deriveAwsErrorCode,
  formatAwsCredentialHint,
  PREFLIGHT_TIMEOUT_MS,
} from "./aws_credentials.ts";

/**
 * Drain a Node Readable into a Uint8Array, capped at `maxBytes`. The AWS
 * SDK's default Node request handler (used under Deno-npm) returns an
 * IncomingMessage, which is an async-iterable Readable. Returns the
 * collected bytes and whether the stream exceeded the cap.
 */
async function collectBodyBytes(
  body: AsyncIterable<Uint8Array>,
  maxBytes: number,
): Promise<{ bytes: Uint8Array; truncated: boolean }> {
  const chunks: Uint8Array[] = [];
  let total = 0;
  let truncated = false;
  for await (const chunk of body) {
    const bytes = chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk);
    const remaining = maxBytes - total;
    if (bytes.length > remaining) {
      chunks.push(bytes.subarray(0, remaining));
      total = maxBytes;
      truncated = true;
      break;
    }
    chunks.push(bytes);
    total += bytes.length;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(c, offset);
    offset += c.length;
  }
  return { bytes: out, truncated };
}

/** First N bytes of a buffer, decoded as UTF-8 with a truncation suffix. */
function decodePreview(
  bytes: Uint8Array,
  max: number,
  streamTruncated: boolean,
): string {
  const overflow = bytes.length > max;
  const slice = overflow ? bytes.subarray(0, max) : bytes;
  const text = new TextDecoder("utf-8", { fatal: false }).decode(slice);
  if (overflow) return `${text}…(${bytes.length - max}+ more bytes)`;
  if (streamTruncated) return `${text}…(stream exceeded cap)`;
  return text;
}

/**
 * Install a deserialize-step middleware that captures a preview of the
 * response body on error statuses (>= 400) before the SDK's XML
 * deserializer consumes it. The preview is stashed as a non-enumerable
 * `__errorBodyPreview` property on the HttpResponse, which later becomes
 * `error.$response.__errorBodyPreview` on SDK-thrown errors.
 *
 * Uses the SDK's `middlewareStack.add` — `next` and `args` are typed via
 * contextual inference from that signature, so no explicit middleware-type
 * imports are needed.
 */
function installErrorBodyCapture(client: AwsS3Client): void {
  client.middlewareStack.add(
    (next) => async (args) => {
      const result = await next(args);
      const resp = (result as { response?: unknown }).response as {
        statusCode?: number;
        body?: AsyncIterable<Uint8Array> | Uint8Array | null;
      } | undefined;
      if (
        resp && typeof resp.statusCode === "number" &&
        resp.statusCode >= 400 && resp.body != null &&
        typeof (resp.body as { [Symbol.asyncIterator]?: unknown })[
            Symbol.asyncIterator
          ] === "function"
      ) {
        try {
          const { bytes, truncated } = await collectBodyBytes(
            resp.body as AsyncIterable<Uint8Array>,
            MAX_ERROR_BODY_BYTES,
          );
          Object.defineProperty(resp, "__errorBodyPreview", {
            value: decodePreview(bytes, ERROR_BODY_PREVIEW_BYTES, truncated),
            enumerable: false,
            configurable: true,
          });
          // Replay the bytes so the SDK deserializer still runs. If we hit
          // the cap, the replay is truncated — acceptable because we only
          // read a valid-XML error body fully when it's under 64KB.
          resp.body = Readable.from([bytes]);
        } catch {
          // Body capture is best-effort. If we can't buffer, fall through
          // and let the SDK deserializer see whatever it sees.
        }
      }
      return result;
    },
    {
      step: "deserialize",
      priority: "low",
      name: "swampS3ErrorBodyCapture",
    },
  );
}

/**
 * Thin S3 client wrapper for datastore operations.
 */
export class S3Client {
  private readonly client: AwsS3Client;
  private readonly bucket: string;
  private readonly prefix: string;
  private readonly defaultRequestTimeoutMs: number;

  constructor(config: S3ClientConfig) {
    const envTimeout = S3Client.parseEnvTimeout();
    this.defaultRequestTimeoutMs = envTimeout ??
      config.defaultRequestTimeoutMs ?? DEFAULT_REQUEST_TIMEOUT_MS;

    this.client = new AwsS3Client({
      region: config.region,
      // Retries live at the cache-sync layer (see s3_cache_sync.ts) where
      // backoff, jitter, and error classification are deterministic and
      // observable. SDK-level retries would obscure that and also fight
      // our per-request timeout (retrying a timed-out request 3× with
      // exponential backoff turns a 30s timeout into minutes of hang).
      maxAttempts: 1,
      // Per-request HTTP timeout: guards against stalled connections at
      // the socket layer. Primary timeout defense — works regardless of
      // whether callers pass an AbortSignal. AWS SDK accepts a plain
      // object here and wraps it into a NodeHttpHandler internally.
      // `throwOnRequestTimeout` promotes the smithy handler's default
      // warn-only behavior to a proper TimeoutError so wrapError can
      // surface it and the retry layer (DEF-2) can classify it.
      requestHandler: {
        requestTimeout: this.defaultRequestTimeoutMs,
        throwOnRequestTimeout: true,
      },
      ...(config.endpoint ? { endpoint: config.endpoint } : {}),
      ...(config.forcePathStyle != null
        ? { forcePathStyle: config.forcePathStyle }
        : {}),
    });
    installErrorBodyCapture(this.client);
    this.bucket = config.bucket;
    this.prefix = config.prefix ?? "";
  }

  private static parseEnvTimeout(): number | undefined {
    try {
      const v = Deno.env.get("SWAMP_S3_REQUEST_TIMEOUT_MS");
      if (!v) return undefined;
      const n = Number(v);
      if (!Number.isFinite(n) || n < 1000 || n > 600_000) return undefined;
      return n;
    } catch {
      return undefined;
    }
  }

  private fullKey(key: string): string {
    return this.prefix ? `${this.prefix}/${key}` : key;
  }

  /**
   * Send an SDK command and rethrow failures as `S3OperationError` with
   * status, code, requestId, body preview, and an auth hint on 401/403.
   * The original error's `name` is preserved so callers that match on
   * `error.name === "NotFound"` / `"PreconditionFailed"` keep working.
   *
   * Overloaded per-command so each call site gets a precisely-typed
   * response without casts.
   */
  private run(
    op: string,
    cmd: HeadBucketCommand,
    signal?: AbortSignal,
  ): Promise<HeadBucketCommandOutput>;
  private run(
    op: string,
    cmd: HeadObjectCommand,
    signal?: AbortSignal,
  ): Promise<HeadObjectCommandOutput>;
  private run(
    op: string,
    cmd: GetObjectCommand,
    signal?: AbortSignal,
  ): Promise<GetObjectCommandOutput>;
  private run(
    op: string,
    cmd: PutObjectCommand,
    signal?: AbortSignal,
  ): Promise<PutObjectCommandOutput>;
  private run(
    op: string,
    cmd: DeleteObjectCommand,
    signal?: AbortSignal,
  ): Promise<DeleteObjectCommandOutput>;
  private run(
    op: string,
    cmd: CopyObjectCommand,
    signal?: AbortSignal,
  ): Promise<CopyObjectCommandOutput>;
  private run(
    op: string,
    cmd: ListObjectsV2Command,
    signal?: AbortSignal,
  ): Promise<ListObjectsV2CommandOutput>;
  private async run(
    op: string,
    cmd:
      | HeadBucketCommand
      | HeadObjectCommand
      | GetObjectCommand
      | PutObjectCommand
      | CopyObjectCommand
      | DeleteObjectCommand
      | ListObjectsV2Command,
    signal?: AbortSignal,
  ): Promise<
    | HeadBucketCommandOutput
    | HeadObjectCommandOutput
    | GetObjectCommandOutput
    | PutObjectCommandOutput
    | CopyObjectCommandOutput
    | DeleteObjectCommandOutput
    | ListObjectsV2CommandOutput
  > {
    return await getTracer().startActiveSpan(`S3 ${op}`, async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "aws-api",
        [Attr.RPC_SERVICE]: "S3",
        [Attr.RPC_METHOD]: op,
        [Attr.AWS_S3_BUCKET]: this.bucket,
      });

      const inputKey = (cmd as { input?: { Key?: string } }).input?.Key;
      if (inputKey) {
        const logicalKey = this.prefix && inputKey.startsWith(this.prefix + "/")
          ? inputKey.slice(this.prefix.length + 1)
          : inputKey;
        span.setAttribute(Attr.AWS_S3_KEY, logicalKey);
      }

      const opts = signal ? { abortSignal: signal } : undefined;
      try {
        let result:
          | HeadBucketCommandOutput
          | HeadObjectCommandOutput
          | GetObjectCommandOutput
          | PutObjectCommandOutput
          | CopyObjectCommandOutput
          | DeleteObjectCommandOutput
          | ListObjectsV2CommandOutput;

        if (cmd instanceof HeadBucketCommand) {
          result = await this.client.send(cmd, opts);
        } else if (cmd instanceof HeadObjectCommand) {
          result = await this.client.send(cmd, opts);
        } else if (cmd instanceof GetObjectCommand) {
          result = await this.client.send(cmd, opts);
        } else if (cmd instanceof PutObjectCommand) {
          result = await this.client.send(cmd, opts);
        } else if (cmd instanceof CopyObjectCommand) {
          result = await this.client.send(cmd, opts);
        } else if (cmd instanceof DeleteObjectCommand) {
          result = await this.client.send(cmd, opts);
        } else {
          result = await this.client.send(cmd, opts);
        }

        const meta = (result as {
          $metadata?: { httpStatusCode?: number; requestId?: string };
        })
          .$metadata;
        if (meta?.httpStatusCode != null) {
          span.setAttribute(
            Attr.HTTP_RESPONSE_STATUS_CODE,
            meta.httpStatusCode,
          );
        }
        if (meta?.requestId) {
          span.setAttribute(Attr.AWS_REQUEST_ID, meta.requestId);
        }

        return result;
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
        }
        throw this.wrapError(op, err, inputKey);
      } finally {
        span.end();
      }
    });
  }

  private wrapError(op: string, err: unknown, key?: string): Error {
    if (!(err instanceof Error)) return new Error(String(err));
    const e = err as Error & {
      $metadata?: { httpStatusCode?: number; requestId?: string };
      $response?: { __errorBodyPreview?: string };
      Code?: string;
    };
    const status = e.$metadata?.httpStatusCode;
    const requestId = e.$metadata?.requestId;
    const code = deriveAwsErrorCode(e);
    const preview = e.$response?.__errorBodyPreview;

    const credentialKind = classifyAwsCredentialError(code, status);
    const credentialHint = formatAwsCredentialHint(
      credentialKind,
      Deno.env.get("AWS_PROFILE"),
      "Datastore",
    );

    const parts: string[] = [];
    // Front-load the swamp-flavoured hint so the user sees the cause and
    // remediation before the SDK's framing of the failure.
    if (credentialHint) parts.push(credentialHint);
    parts.push(`S3 ${op} failed`);
    if (key) parts.push(`key=${key}`);
    // Signal-triggered aborts carry no HTTP status; surface the timeout
    // context so callers can distinguish "timed out" from "service 5xx".
    // `AbortSignal.timeout()` triggers a DOMException with name
    // "TimeoutError"; an external AbortSignal triggers "AbortError".
    if (e.name === "TimeoutError") {
      parts.push(`timed out after ${this.defaultRequestTimeoutMs}ms`);
    } else if (e.name === "AbortError") {
      parts.push("aborted");
    }
    if (status != null) parts.push(`HTTP ${status}`);
    if (code && code !== "Unknown") parts.push(code);
    const rawMsg = e.message && e.message !== "UnknownError" ? e.message : "";
    if (rawMsg) parts.push(`— ${rawMsg}`);
    // The generic 401/403 hint stays as a fallback for non-credential auth
    // failures (e.g. BucketRegionMismatch surfaced as 403). Skip it when the
    // credential classifier already produced a more specific hint.
    if ((status === 401 || status === 403) && credentialKind === "other") {
      parts.push(
        "(check AWS credentials — profile, env vars, or credential provider — and endpoint configuration)",
      );
    }
    if (requestId) parts.push(`[requestId=${requestId}]`);
    if (preview) parts.push(`bodyPreview=${JSON.stringify(preview)}`);

    return new S3OperationError(parts.join(" "), {
      name: e.name,
      cause: e,
      httpStatusCode: status,
      code,
      requestId,
      bodyPreview: preview,
    });
  }

  /** Checks if the bucket exists and is accessible. */
  async headBucket(signal?: AbortSignal): Promise<void> {
    await this.run(
      "headBucket",
      new HeadBucketCommand({ Bucket: this.bucket }),
      signal,
    );
  }

  async preflightCredentials(signal?: AbortSignal): Promise<void> {
    return await getTracer().startActiveSpan(
      "S3 preflightCredentials",
      async (span) => {
        try {
          await runPreflightCredentials(() => this.headBucket(signal));
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          const isTimeout = msg.includes("Credential preflight timed out");
          const wrapped = err instanceof S3OperationError
            ? err
            : new S3OperationError(msg, {
              name: isTimeout
                ? "TimeoutError"
                : (err instanceof Error ? err.name : "Error"),
              cause: err,
              httpStatusCode: undefined,
              code: undefined,
              requestId: undefined,
              bodyPreview: undefined,
            });
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: wrapped.message,
          });
          span.recordException(wrapped);
          span.setAttribute(Attr.ERROR_TYPE, wrapped.name);
          throw wrapped;
        } finally {
          span.end();
        }
      },
    );
  }

  /**
   * Uploads an object to S3. Returns the resulting object's `ETag` when the
   * service surfaces one so callers can fingerprint the write without an
   * extra HEAD roundtrip — used by the sync-state sidecar fast path.
   */
  async putObject(
    key: string,
    body: Uint8Array,
    signal?: AbortSignal,
  ): Promise<{ etag?: string }> {
    const response = await this.run(
      "putObject",
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.fullKey(key),
        Body: body,
      }),
      signal,
    );
    return { etag: response.ETag };
  }

  /** Copies an object within the same bucket (server-side, no download). */
  async copyObject(
    sourceKey: string,
    destKey: string,
    signal?: AbortSignal,
  ): Promise<void> {
    await this.run(
      "copyObject",
      new CopyObjectCommand({
        Bucket: this.bucket,
        CopySource: `${this.bucket}/${this.fullKey(sourceKey)}`,
        Key: this.fullKey(destKey),
      }),
      signal,
    );
  }

  /**
   * Downloads an object from S3. Returns the body bytes alongside the
   * `ETag` from the same GetObject response so callers can fingerprint
   * the exact version they read without a follow-up HEAD. The ETag
   * binding is what closes the fast-path sidecar TOCTOU in cache sync:
   * `markSynced` must record the fingerprint of the bytes we verified
   * against, not a post-facto HEAD that could observe a concurrent
   * writer's push.
   */
  async getObject(
    key: string,
    signal?: AbortSignal,
  ): Promise<{ data: Uint8Array; etag?: string }> {
    const response = await this.run(
      "getObject",
      new GetObjectCommand({
        Bucket: this.bucket,
        Key: this.fullKey(key),
      }),
      signal,
    );
    if (!response.Body) {
      throw new Error(`S3 GetObject returned empty body for key: ${key}`);
    }
    return {
      data: new Uint8Array(await response.Body.transformToByteArray()),
      etag: response.ETag,
    };
  }

  /** Deletes an object from S3. */
  async deleteObject(key: string, signal?: AbortSignal): Promise<void> {
    await this.run(
      "deleteObject",
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: this.fullKey(key),
      }),
      signal,
    );
  }

  /**
   * Checks if an object exists in S3. Includes the object's `ETag` when
   * present — callers use it as a content fingerprint for the fast-path
   * short-circuit in the cache sync.
   */
  async headObject(
    key: string,
    signal?: AbortSignal,
  ): Promise<
    { exists: boolean; size?: number; lastModified?: Date; etag?: string }
  > {
    try {
      const response = await this.run(
        "headObject",
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: this.fullKey(key),
        }),
        signal,
      );
      return {
        exists: true,
        size: response.ContentLength,
        lastModified: response.LastModified,
        etag: response.ETag,
      };
    } catch (error) {
      if (
        error instanceof Error && "name" in error &&
        (error.name === "NotFound" || error.name === "NoSuchKey")
      ) {
        return { exists: false };
      }
      throw error;
    }
  }

  /**
   * Uploads an object only if it does not already exist (conditional write).
   * Uses S3 conditional writes (If-None-Match: *) to atomically check-and-create.
   * Returns true if the write succeeded, false if the object already exists.
   */
  async putObjectConditional(
    key: string,
    body: Uint8Array,
    signal?: AbortSignal,
  ): Promise<boolean> {
    return await getTracer().startActiveSpan(
      "S3 putObjectConditional",
      async (span) => {
        try {
          await this.run(
            "putObjectConditional",
            new PutObjectCommand({
              Bucket: this.bucket,
              Key: this.fullKey(key),
              Body: body,
              IfNoneMatch: "*",
            }),
            signal,
          );
          return true;
        } catch (error) {
          if (
            error instanceof Error &&
            (error.name === "PreconditionFailed" ||
              error.name === "ConditionalCheckFailed" ||
              error.name === "ConditionalRequestConflict")
          ) {
            return false;
          }
          throw error;
        } finally {
          span.end();
        }
      },
    );
  }

  /**
   * Compare-and-swap upload. Writes only if the object's current ETag equals
   * `etag` (If-Match), or only if the object is absent when `etag` is null
   * (If-None-Match: *). Returns the new ETag on success and null when the
   * precondition failed. Other errors, including NotImplemented from stores
   * without conditional-write support, propagate.
   */
  async putObjectIfMatch(
    key: string,
    body: Uint8Array,
    etag: string | null,
    signal?: AbortSignal,
  ): Promise<{ etag?: string } | null> {
    try {
      const response = await this.run(
        "putObjectIfMatch",
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: this.fullKey(key),
          Body: body,
          ...(etag === null ? { IfNoneMatch: "*" } : { IfMatch: etag }),
        }),
        signal,
      );
      return { etag: response.ETag };
    } catch (error) {
      // Match on status too: a non-XML 412 body leaves the SDK unable to
      // parse the error code, so the name alone isn't reliable.
      if (
        error instanceof S3OperationError &&
        (error.name === "PreconditionFailed" ||
          error.name === "ConditionalRequestConflict" ||
          error.httpStatusCode === 412 || error.httpStatusCode === 409)
      ) {
        return null;
      }
      throw error;
    }
  }

  /** Lists objects in S3 with the configured prefix. */
  async listObjects(
    subPrefix?: string,
    continuationToken?: string,
    signal?: AbortSignal,
  ): Promise<S3ListResult> {
    const prefix = subPrefix
      ? this.fullKey(subPrefix)
      : this.prefix
      ? this.prefix + "/"
      : undefined;

    const response = await this.run(
      "listObjects",
      new ListObjectsV2Command({
        Bucket: this.bucket,
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
      signal,
    );

    const prefixLen = this.prefix ? this.prefix.length + 1 : 0;
    const entries: S3ListEntry[] = (response.Contents ?? []).map((obj) => ({
      key: obj.Key!.slice(prefixLen),
      size: obj.Size ?? 0,
      etag: obj.ETag,
      lastModified: obj.LastModified,
    }));

    return {
      entries,
      truncated: response.IsTruncated ?? false,
      continuationToken: response.NextContinuationToken,
    };
  }

  /** Lists all objects (handling pagination). */
  async listAllObjects(
    subPrefix?: string,
    signal?: AbortSignal,
  ): Promise<S3ListEntry[]> {
    return await getTracer().startActiveSpan(
      "S3 listAllObjects",
      async (span) => {
        try {
          const all: S3ListEntry[] = [];
          let continuationToken: string | undefined;

          do {
            const result = await this.listObjects(
              subPrefix,
              continuationToken,
              signal,
            );
            all.push(...result.entries);
            continuationToken = result.truncated
              ? result.continuationToken
              : undefined;
          } while (continuationToken);

          return all;
        } catch (err) {
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: err instanceof Error ? err.message : String(err),
          });
          span.recordException(
            err instanceof Error ? err : new Error(String(err)),
          );
          throw err;
        } finally {
          span.end();
        }
      },
    );
  }
}
