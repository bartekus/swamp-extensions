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
 * GCS cache sync service.
 *
 * Maintains a local cache directory and syncs with GCS:
 * - pullChanged(): pulls only new/modified files from GCS
 * - pushChanged(): pushes only new/modified files to GCS
 *
 * Tracks metadata in `.datastore-index.json` to avoid unnecessary transfers.
 * A `.datastore-sync-state.json` sidecar records the remote index's GCS
 * `generation` at the last verified-clean sync so zero-diff syncs can
 * short-circuit to a single HEAD on the next call.
 */

import { dirname, join, normalize, relative } from "jsr:@std/path@1";
import { ensureDir, walk } from "jsr:@std/fs@1";
import { SpanStatusCode, trace } from "npm:@opentelemetry/api@1.9.0";
import { Attr, getTracer } from "./tracing.ts";
import type {
  CatalogExportEntry,
  CatalogExportRow,
  ControlPlaneStore,
  DatastoreSyncOptions,
  DatastoreSyncService,
  NamespaceContaminationSummary,
  PushManifest,
  RepairNamespaceContaminationOptions,
  SyncCapabilities,
} from "./interfaces.ts";
import { GcsOperationError, NotFoundError } from "./gcs_client.ts";
import type { GcsClient } from "./gcs_client.ts";
import { atomicWriteTextFile } from "./atomic_write.ts";

/**
 * Validates that a relative path resolves within the cache directory.
 * Prevents path traversal attacks from malicious GCS object names.
 */
function assertSafePath(cachePath: string, relativePath: string): string {
  const resolved = normalize(join(cachePath, relativePath));
  const normalizedCache = normalize(cachePath);
  if (
    !resolved.startsWith(normalizedCache + "/") && resolved !== normalizedCache
  ) {
    throw new Error(`Path traversal detected: ${relativePath}`);
  }
  return resolved;
}

/**
 * Filename of the sync-state sidecar used by the fast-path short-circuit
 * in `pullChanged` / `pushChanged`. Lives inside the cache directory and
 * is listed in `isInternalCacheFile` so the walker never uploads it.
 */
const SYNC_STATE_FILE = ".datastore-sync-state.json";

/**
 * Returns true for files that live inside the cache directory but must
 * NOT cross the sync boundary in either direction (push or pull).
 *
 * Excluded patterns:
 * - `.datastore-index.json` — the remote index manifest itself; pulled
 *   and pushed via dedicated code paths, never as a walked payload.
 * - `.push-queue.json` — local push-queue scratch file.
 * - `.datastore.lock` — distributed lock file; managed by the lock
 *   subsystem, must never be uploaded as data.
 * - `.datastore-sync-state.json` — fast-path sidecar recording the
 *   last-verified remote index generation and the local-dirty flag.
 *   Never uploaded: its contents are per-machine state.
 * - basename `_catalog.db` and anything starting with `_catalog.db-`
 *   (the SQLite WAL/SHM/journal sidecars) — the local-only data catalog
 *   store. It is deliberately colocated with the data tier so it can
 *   be rebuilt from whatever the local cache holds, but the database
 *   itself is per-machine state and must never leak to the shared
 *   bucket. See swamp-club issue #29 for the bug this exclusion fixes:
 *   without it, `swamp datastore sync --push` would walk `_catalog.db*`
 *   into `toPush`, SQLite would rewrite the WAL mid-upload, and the
 *   push would fail on `_catalog.db-wal`.
 * - basename `.lock` at any depth — per-target FileLock files written
 *   by the data tier's lock subsystem (e.g.
 *   `data/<kind>/<type>/<id>/.lock`). The lock subsystem creates and
 *   deletes these directly via GCS Insert/Delete; they must not flow
 *   through cache sync because (a) the bucket listing in
 *   `discoverIndexFromBucket` would otherwise capture transient
 *   `.lock` files into the synthesized index, leaving the index
 *   referencing objects the lock subsystem deletes on release, and
 *   (b) a fresh reader hydrating from that stale index would 404 on
 *   the missing `.lock` and abort `datastore setup`.
 *
 * Exported for unit tests; not part of the public extension API.
 */
/**
 * Returns true when the first path segment of `rel` is in `namespaceDirs`.
 * Used by pushChanged/preparePush to skip files inside nested or foreign
 * namespace directories that should never cross the sync boundary.
 *
 * Exported for unit tests; not part of the public extension API.
 */
export function isInsideNamespaceDir(
  rel: string,
  namespaceDirs: ReadonlySet<string>,
): boolean {
  if (namespaceDirs.size === 0) return false;
  const slash = rel.indexOf("/");
  const firstSeg = slash === -1 ? rel : rel.substring(0, slash);
  return namespaceDirs.has(firstSeg);
}

/**
 * Scans the cache root for immediate child directories that contain a
 * `.namespace.json` marker file. Returns a Set of directory names to
 * exclude from the push walk.
 */
async function detectNamespaceDirs(
  cachePath: string,
  boundNamespace?: string,
): Promise<Set<string>> {
  const namespaceDirs = new Set<string>();
  try {
    for await (const entry of Deno.readDir(cachePath)) {
      if (!entry.isDirectory) continue;
      if (entry.name === boundNamespace) continue;
      try {
        await Deno.stat(join(cachePath, entry.name, ".namespace.json"));
        namespaceDirs.add(entry.name);
      } catch {
        // No .namespace.json — not a namespace directory
      }
    }
  } catch {
    // Cache directory may not exist yet
  }
  return namespaceDirs;
}

export function isInternalCacheFile(rel: string): boolean {
  if (
    rel === ".datastore-index.json" || rel === ".push-queue.json" ||
    rel === ".datastore.lock" || rel === SYNC_STATE_FILE
  ) {
    return true;
  }
  if (rel === "_index" || rel.startsWith("_index/")) return true;
  if (rel === "_control" || rel.startsWith("_control/")) return true;
  const base = rel.split("/").pop() ?? "";
  if (base === ".lock" || base === ".namespace.json") return true;
  return base === "_catalog.db" || base.startsWith("_catalog.db-");
}

/**
 * Returns true for data-tier raw content files that should be skipped
 * during the first lazy hydration pull. Only files under `data/` whose
 * basename is `raw` are skipped — metadata.yaml, latest pointers, and
 * everything outside the data/ prefix are always downloaded.
 *
 * Exported for unit tests; not part of the public extension API.
 */
export function isLazySkippable(rel: string): boolean {
  const parts = rel.split("/");
  return parts.length >= 3 && parts[0] === "data" &&
    parts[parts.length - 1] === "raw";
}

/**
 * Rejects with `AbortError` if the signal is already aborted. Used at
 * phase boundaries so abort propagation doesn't have to ride on a
 * pending GCS call — the next boundary catches it first.
 */
function throwIfAborted(signal: AbortSignal | undefined): void {
  if (signal?.aborted) {
    throw new DOMException(
      signal.reason instanceof Error ? signal.reason.message : "Aborted",
      "AbortError",
    );
  }
}

/**
 * Sleep that wakes early if the signal aborts. Used inside
 * `retryWithBackoff` so an outer sync timeout unblocks the backoff
 * sleep instead of waiting out the full delay after the caller has
 * already given up.
 */
function abortableSleep(
  ms: number,
  signal: AbortSignal | undefined,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      if (signal) signal.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(
        new DOMException(
          signal?.reason instanceof Error ? signal.reason.message : "Aborted",
          "AbortError",
        ),
      );
    };
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timer);
        reject(
          new DOMException(
            signal.reason instanceof Error ? signal.reason.message : "Aborted",
            "AbortError",
          ),
        );
        return;
      }
      signal.addEventListener("abort", onAbort, { once: true });
    }
  });
}

/** Retry budget for single-object GCS operations in the sync pipeline. */
const RETRY_MAX_ATTEMPTS = 3;
/** Base delay between retry attempts (ms). Each retry multiplies by 3. */
const RETRY_BASE_DELAY_MS = 500;
/** Jitter fraction applied to each backoff delay (±25%). */
const RETRY_JITTER_FRACTION = 0.25;

/**
 * Returns true when an error is a transient condition that should be
 * retried: request timeouts, 5xx service errors, 429 throttling, and
 * transport-level failures (connection reset, DNS, TLS handshake).
 *
 * Explicitly NOT retryable: 4xx other than 429 (bad request, auth
 * failure), `PreconditionFailedError` (conditional write lost the
 * race — retrying gives the same answer), `NotFoundError` (not a
 * transient state), any `AbortError` (caller explicitly cancelled).
 *
 * The `status == null` branch matters more than it looks. The GCS
 * client surfaces transport-level failures (ECONNRESET, DNS lookup,
 * TLS close_notify) as a `GcsOperationError` with `httpStatusCode:
 * null`. Without this branch, real network blips would not be retried
 * — defeating the whole point of the retry budget. Auth and config
 * errors always carry a 4xx status, so treating a missing status as
 * transient is safe.
 *
 * Exported for unit tests; not part of the public extension API.
 */
export function isRetryableError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.name === "AbortError") return false;
  if (err.name === "NotFoundError") return false;
  if (err.name === "PreconditionFailedError") return false;
  if (err.name === "TimeoutError") return true;
  if (err instanceof GcsOperationError) {
    const status = err.httpStatusCode;
    if (status === 429) return true;
    // 409: concurrent write race — retryable after backoff (swamp-club#1747).
    if (status === 409) return true;
    if (status != null && status >= 500 && status < 600) return true;
    if (status == null) return true;
  }
  return false;
}

/**
 * Retry `op` with exponential backoff + jitter until it succeeds, a
 * non-retryable error is thrown, or `maxAttempts` is reached.
 * Re-throws the last error if all attempts fail.
 *
 * Exported for unit tests; not part of the public extension API.
 * The `config` override exists so tests can run without paying the
 * production backoff latency. `signal` unblocks the backoff sleep on
 * abort so the outer sync timeout isn't held up waiting for a delay
 * that will never resolve into useful work.
 */
export async function retryWithBackoff<T>(
  op: () => Promise<T>,
  config?: {
    maxAttempts?: number;
    baseDelayMs?: number;
    signal?: AbortSignal;
  },
): Promise<T> {
  const maxAttempts = config?.maxAttempts ?? RETRY_MAX_ATTEMPTS;
  if (maxAttempts < 1) {
    // Guard against caller misconfiguration: maxAttempts=0 would skip
    // the loop entirely and `throw lastErr` would throw undefined.
    // Fail loudly with the actual problem instead.
    throw new Error(
      `retryWithBackoff: maxAttempts must be >= 1, got ${maxAttempts}`,
    );
  }
  const baseDelayMs = config?.baseDelayMs ?? RETRY_BASE_DELAY_MS;
  const signal = config?.signal;
  let attempt = 0;
  // `while (true)` (not `for attempt < maxAttempts`) because every
  // iteration either returns (success) or throws (exhausted budget /
  // non-retryable) — there's no meaningful "loop exhausted" state.
  // Makes the control flow honest to TypeScript without a dead
  // `throw lastErr` at the bottom.
  while (true) {
    throwIfAborted(signal);
    try {
      return await op();
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts - 1;
      if (isLastAttempt || !isRetryableError(err)) throw err;
      const activeSpan = trace.getActiveSpan();
      if (activeSpan) {
        activeSpan.addEvent("retry", {
          "retry.attempt": attempt + 1,
          "error.type": err instanceof Error ? err.name : "unknown",
          "error.message": err instanceof Error ? err.message : String(err),
        });
      }
      const raw = baseDelayMs * Math.pow(3, attempt);
      const jitter = raw * RETRY_JITTER_FRACTION * (Math.random() * 2 - 1);
      const delay = Math.max(0, Math.floor(raw + jitter));
      await abortableSleep(delay, signal);
      attempt++;
    }
  }
}

/**
 * Emit a trace-level timing line when `SWAMP_GCS_SYNC_TRACE` is truthy.
 * Two timestamps per phase, never per-entry — matches the
 * instrumentation contract from the s3-datastore mirror.
 *
 * Gated on env-var presence so tests and production stay silent by
 * default; a reporter debugging a slow sync can opt in with
 * `SWAMP_GCS_SYNC_TRACE=1 swamp datastore sync`.
 */
function traceEnabled(): boolean {
  try {
    const v = Deno.env.get("SWAMP_GCS_SYNC_TRACE");
    return !!v && v !== "0" && v.toLowerCase() !== "false";
  } catch {
    // `--allow-env` may be absent; stay silent rather than throw.
    return false;
  }
}
function tracePhase(phase: string, startMs: number, detail?: string): void {
  if (!traceEnabled()) return;
  const elapsedMs = Date.now() - startMs;
  const suffix = detail ? ` ${detail}` : "";
  console.debug(`[gcs-sync] ${phase} ${elapsedMs}ms${suffix}`);
}

/**
 * Build a batch-failure message that surfaces the actual reasons things
 * failed, not just filenames. The first 3 underlying errors are
 * included verbatim so users can tell a credential issue from a
 * network blip from a bucket misconfig without having to re-run.
 */
function formatBatchFailure(
  op: "push" | "pull" | "delete",
  failures: Array<{ file: string; error: unknown }>,
): string {
  const files = failures.map((f) => f.file);
  const preview = failures.slice(0, 3).map((f) => {
    const msg = f.error instanceof Error ? f.error.message : String(f.error);
    return `  - ${f.file}: ${msg}`;
  }).join("\n");
  const more = failures.length > 3
    ? `\n  ... and ${failures.length - 3} more`
    : "";
  const preposition = op === "pull" ? "from" : op === "delete" ? "from" : "to";
  return `Failed to ${op} ${failures.length} file(s) ${preposition} GCS: ${
    files.join(", ")
  }\n${preview}${more}`;
}

/** Metadata index entry for a file in GCS. */
interface IndexEntry {
  key: string;
  size: number;
  lastModified: string;
  localMtime?: string;
  sha256?: string;
}

/** Metadata for the partitioned index directory (legacy dual-write). */
interface PartitionMetaV1 {
  version: 1;
  partitions: string[];
}

/** Metadata for the shard-first index directory. */
interface PartitionMetaV2 {
  version: 2;
  partitions: string[];
  commitSeq: number;
  lastCompacted?: string;
}

type PartitionMeta = PartitionMetaV1 | PartitionMetaV2;

/** A single partition index file containing entries for one model. */
interface PartitionIndex {
  version: 1;
  entries: Record<string, IndexEntry>;
}

/** Metadata index tracking all files in the GCS datastore. */
interface DatastoreIndex {
  version: 1;
  lastPulled: string;
  entries: Record<string, IndexEntry>;
}

/** Internal manifest for two-phase push, opaque to core. */
interface InternalPushManifest {
  newEntries: Record<string, IndexEntry>;
  deletedKeys: string[];
  pushed: number;
  deleted: number;
  dirtyPartitionKeys: string[];
}

/** TTL in ms for using the local index cache instead of fetching from GCS. */
const INDEX_CACHE_TTL_MS = 60_000;

/** Default concurrent GCS downloads. */
const DEFAULT_PULL_CONCURRENCY = 50;
/** Default concurrent GCS uploads. */
const DEFAULT_PUSH_CONCURRENCY = 25;

/** When the dirty-path set exceeds this cap, fall back to a full walk. */
const DIRTY_PATHS_CAP = 2000;

/**
 * Fast-path sidecar persisted alongside the cache. Records the last
 * remote `.datastore-index.json` generation we verified our local cache
 * against, the timestamp of that verification, and whether the local
 * cache has been written to since. The next `pullChanged` /
 * `pushChanged` HEADs the remote index and short-circuits if the
 * recorded generation still matches and the local view hasn't drifted —
 * skipping the 1+ MB index GET and the multi-thousand-stat walk that
 * the pre-fast-path path performed on every sync.
 *
 * Schema is versioned so old sidecars can be ignored on upgrade
 * without a migration step (any parse failure or version mismatch
 * falls through to the slow path and rewrites the sidecar).
 *
 * GCS generation is a better fingerprint than S3 ETag: it changes on
 * every write including multipart uploads, so no multipart guard is
 * needed (compare s3_cache_sync.ts `isMultipartETag`). Generation
 * values are int64 strings — we store them verbatim and compare as
 * strings; parsing to number would overflow JS number precision.
 */
interface DatastoreSyncStateV1 {
  version: 1;
  remoteIndexGeneration: string;
  lastVerifiedAt: string;
  localDirty: boolean;
}

interface DatastoreSyncStateV2 {
  version: 2;
  remoteIndexGeneration: string;
  lastVerifiedAt: string;
  localDirty: boolean;
  dirtyPaths: string[];
  bulkInvalidated: boolean;
  lazyPullActive: boolean;
  dirtyPathsOverflowed?: boolean;
  commitSeq?: number;
  lastCatalogHash?: string;
  dataKeyMigrated?: boolean;
  controlPlaneKeysMigrated?: boolean;
}

type DatastoreSyncState = DatastoreSyncStateV1 | DatastoreSyncStateV2;

/** GCS cache sync service. */
export class GcsCacheSyncService implements DatastoreSyncService {
  private readonly gcs: GcsClient;
  private readonly cachePath: string;
  private readonly indexPath: string;
  private readonly syncStatePath: string;
  private readonly pullConcurrency: number;
  private readonly pushConcurrency: number;
  private index: DatastoreIndex | null = null;
  private indexIsPartial = false;
  private syncState: DatastoreSyncState | null = null;
  private syncStateLoaded = false;
  private indexMutated = false;
  private dirtyPaths: Set<string> = new Set();
  private bulkInvalidated = false;
  private dirtyPathsOverflowed = false;
  private lazyPullActive = false;
  private lastCatalogHash: string | null = null;
  private namespace: string | undefined = undefined;
  private namespaceBound = false;
  private preflightDone = false;
  private freshV2Initialized = false;

  constructor(
    gcs: GcsClient,
    cachePath: string,
    options?: {
      pullConcurrency?: number;
      pushConcurrency?: number;
    },
  ) {
    this.gcs = gcs;
    this.cachePath = cachePath;
    this.indexPath = join(cachePath, ".datastore-index.json");
    this.syncStatePath = join(cachePath, SYNC_STATE_FILE);
    this.pullConcurrency = options?.pullConcurrency ?? DEFAULT_PULL_CONCURRENCY;
    this.pushConcurrency = options?.pushConcurrency ?? DEFAULT_PUSH_CONCURRENCY;
  }

  private bindNamespace(ns: string | undefined): void {
    if (!this.namespaceBound) {
      this.namespace = ns;
      this.namespaceBound = true;
      return;
    }
    if (this.namespace !== ns) {
      throw new Error(
        `Namespace mismatch: bound to ${JSON.stringify(this.namespace)} ` +
          `but called with ${JSON.stringify(ns)}`,
      );
    }
  }

  private async ensurePreflight(signal?: AbortSignal): Promise<void> {
    if (this.preflightDone) return;
    await this.gcs.preflightCredentials(signal);
    this.preflightDone = true;
  }

  private indexKey(): string {
    return this.namespace
      ? `${this.namespace}/.datastore-index.json`
      : ".datastore-index.json";
  }

  private metaKey(): string {
    return this.namespace
      ? `${this.namespace}/_index/_meta.json`
      : "_index/_meta.json";
  }

  private shardKey(partitionKey: string): string {
    return this.namespace
      ? `${this.namespace}/_index/${partitionKey}.json`
      : `_index/${partitionKey}.json`;
  }

  private dataKey(rel: string): string {
    return this.namespace ? `${this.namespace}/${rel}` : rel;
  }

  private localRelPath(rel: string): string {
    return this.namespace ? `${this.namespace}/${rel}` : rel;
  }

  private controlKey(key: string): string {
    return this.namespace
      ? `${this.namespace}/_control/${key}`
      : `_control/${key}`;
  }

  private controlPrefixPath(): string {
    return this.namespace ? `${this.namespace}/_control/` : "_control/";
  }

  /**
   * Top-level subdirectories that hold user data (as opposed to internal
   * cache/sync machinery). Used by `migrateRootDataToNamespace` to
   * identify root-level objects that belong under the namespace prefix.
   */
  private static readonly DATA_SUBDIRS = new Set([
    "data",
    "outputs",
    "definitions-evaluated",
    "workflow-runs",
    "workflows-evaluated",
    "auto-definitions",
    "audit",
    "telemetry",
    "logs",
    "files",
  ]);

  /**
   * Server-side copy migration: moves root-level data objects into the
   * namespace prefix. Lists all objects (no prefix), filters to root-level
   * data (first segment in DATA_SUBDIRS, not already namespaced, not
   * internal), copies each to `dataKey(entry.key)`, rebuilds the index,
   * and deletes the originals.
   */
  private async migrateRootDataToNamespace(
    signal?: AbortSignal,
  ): Promise<{ copied: number; total: number }> {
    if (!this.namespace) return { copied: 0, total: 0 };

    let hasNamespacedIndex = false;
    try {
      const meta = await this.gcs.getMetadata(this.indexKey(), signal);
      hasNamespacedIndex = meta.exists;
    } catch (err) {
      if (!(err instanceof NotFoundError)) throw err;
    }
    if (!hasNamespacedIndex) {
      return { copied: 0, total: 0 };
    }

    let knownKeys = new Set<string>();
    try {
      const { data } = await this.gcs.getObject(
        ".datastore-index.json",
        signal,
      );
      const rootIndex = JSON.parse(
        new TextDecoder().decode(data),
      ) as DatastoreIndex;
      knownKeys = new Set(Object.keys(rootIndex.entries ?? {}));
    } catch {
      // No root index — fall through with empty set.
    }
    const listing = await this.gcs.listAllObjects(undefined, signal);
    const nsPrefix = `${this.namespace}/`;
    const foreignNamespaces = new Set<string>();
    for (const entry of listing) {
      if (entry.key.endsWith("/.namespace.json")) {
        const ns = entry.key.substring(
          0,
          entry.key.length - "/.namespace.json".length,
        );
        if (ns && ns !== this.namespace) foreignNamespaces.add(ns);
      }
    }
    const toMigrate = listing.filter((entry) => {
      if (entry.key.startsWith(nsPrefix)) return false;
      if (isInternalCacheFile(entry.key)) return false;
      if (isInsideNamespaceDir(entry.key, foreignNamespaces)) return false;
      const firstSeg = entry.key.split("/")[0];
      if (!GcsCacheSyncService.DATA_SUBDIRS.has(firstSeg)) return false;
      if (knownKeys.size > 0 && !knownKeys.has(entry.key)) return false;
      return true;
    });
    if (foreignNamespaces.size > 0) {
      console.warn(
        `[gcs-sync] Excluded ${foreignNamespaces.size} foreign namespace(s) from migration: ${
          [...foreignNamespaces].join(", ")
        }`,
      );
    }
    if (toMigrate.length === 0) return { copied: 0, total: 0 };

    console.info(
      `[gcs-sync] Migrating ${toMigrate.length} object(s) to namespace "${this.namespace}" (server-side copy, no re-upload)...`,
    );

    const copiedKeys: Set<string> = new Set();
    for (let i = 0; i < toMigrate.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = toMigrate.slice(i, i + this.pushConcurrency);
      const results = await Promise.allSettled(
        batch.map((entry) =>
          retryWithBackoff(
            () =>
              this.gcs.copyObject(entry.key, this.dataKey(entry.key), signal),
            { signal },
          ).then(() => entry.key)
        ),
      );
      for (const result of results) {
        if (result.status === "fulfilled") copiedKeys.add(result.value);
      }
      if (toMigrate.length > 50) {
        console.info(
          `[gcs-sync]   ... ${copiedKeys.size}/${toMigrate.length} copied`,
        );
      }
    }

    if (copiedKeys.size === 0) return { copied: 0, total: toMigrate.length };

    if (copiedKeys.size < toMigrate.length) {
      console.warn(
        `[gcs-sync] ${
          toMigrate.length - copiedKeys.size
        } object(s) failed to copy — originals preserved, will retry next sync`,
      );
    }

    if (this.index) {
      for (const entry of toMigrate) {
        if (!copiedKeys.has(entry.key)) continue;
        this.index.entries[entry.key] = {
          key: entry.key,
          size: entry.size,
          lastModified: (entry.updated ?? new Date()).toISOString(),
        };
      }
      this.index.lastPulled = new Date().toISOString();
      const indexData = new TextEncoder().encode(JSON.stringify(this.index));
      await retryWithBackoff(
        () => this.gcs.putObject(this.indexKey(), indexData, signal),
        { signal },
      );
      await atomicWriteTextFile(
        this.indexPath,
        JSON.stringify(this.index, null, 2),
      );
      try {
        await this.gcs.deleteObject(this.metaKey(), undefined, signal);
      } catch { /* may not exist */ }
    }

    const toDeleteBatch = toMigrate.filter((e) => copiedKeys.has(e.key));
    for (let i = 0; i < toDeleteBatch.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = toDeleteBatch.slice(i, i + this.pushConcurrency);
      await Promise.allSettled(
        batch.map((entry) =>
          retryWithBackoff(
            () => this.gcs.deleteObject(entry.key, undefined, signal),
            { signal },
          )
        ),
      );
    }

    console.info(
      `[gcs-sync] Migration complete: ${copiedKeys.size}/${toMigrate.length} object(s) moved to "${this.namespace}/"`,
    );
    return { copied: copiedKeys.size, total: toMigrate.length };
  }

  /**
   * Server-side migration: copies root-level _control/ keys to
   * {namespace}/_control/ via GCS copy. Unlike data-key migration,
   * control-plane keys are not tracked in the datastore index, so no
   * index update is needed.
   */
  private async migrateRootControlPlaneToNamespace(
    signal?: AbortSignal,
  ): Promise<{ copied: number; total: number }> {
    if (!this.namespace) return { copied: 0, total: 0 };

    let hasNamespacedIndex = false;
    try {
      const meta = await this.gcs.getMetadata(this.indexKey(), signal);
      hasNamespacedIndex = meta.exists;
    } catch {
      // Can't check — skip migration
    }
    if (!hasNamespacedIndex) return { copied: 0, total: 0 };

    const rootControlPrefix = "_control/";
    let listing: Array<{ key: string; size: number; lastModified?: Date }>;
    try {
      listing = await retryWithBackoff(
        () => this.gcs.listAllObjects(rootControlPrefix, signal),
        { signal },
      );
    } catch {
      return { copied: 0, total: 0 };
    }

    if (listing.length === 0) return { copied: 0, total: 0 };

    console.info(
      `[gcs-sync] Migrating ${listing.length} control-plane key(s) to namespace "${this.namespace}" (server-side copy)...`,
    );

    const copiedKeys: Set<string> = new Set();
    for (let i = 0; i < listing.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = listing.slice(i, i + this.pushConcurrency);
      const results = await Promise.allSettled(
        batch.map((entry) => {
          const dest = `${this.namespace}/${entry.key}`;
          return retryWithBackoff(
            () => this.gcs.copyObject(entry.key, dest, signal),
            { signal },
          ).then(() => entry.key);
        }),
      );
      for (const result of results) {
        if (result.status === "fulfilled") copiedKeys.add(result.value);
      }
    }

    if (copiedKeys.size === 0) return { copied: 0, total: listing.length };

    const toDelete = listing.filter((e) => copiedKeys.has(e.key));
    for (let i = 0; i < toDelete.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = toDelete.slice(i, i + this.pushConcurrency);
      await Promise.allSettled(
        batch.map((entry) =>
          retryWithBackoff(
            () => this.gcs.deleteObject(entry.key, undefined, signal),
            { signal },
          )
        ),
      );
    }

    console.info(
      `[gcs-sync] Control-plane migration complete: ${copiedKeys.size}/${listing.length} key(s) moved to "${this.namespace}/"`,
    );
    return { copied: copiedKeys.size, total: listing.length };
  }

  private async readPartitionMeta(
    signal?: AbortSignal,
  ): Promise<PartitionMeta | null> {
    try {
      const { data } = await retryWithBackoff(
        () => this.gcs.getObject(this.metaKey(), signal),
        { signal },
      );
      const text = new TextDecoder().decode(data);
      const parsed = JSON.parse(text) as PartitionMeta;
      if (
        (parsed.version === 1 || parsed.version === 2) &&
        Array.isArray(parsed.partitions)
      ) {
        return parsed;
      }
      return null;
    } catch (err) {
      if (err instanceof NotFoundError) {
        return null;
      }
      throw err;
    }
  }

  private async readShard(
    partitionKey: string,
    signal?: AbortSignal,
  ): Promise<Record<string, IndexEntry> | null> {
    try {
      const { data } = await retryWithBackoff(
        () => this.gcs.getObject(this.shardKey(partitionKey), signal),
        { signal },
      );
      const text = new TextDecoder().decode(data);
      const partition = JSON.parse(text) as PartitionIndex;
      if (partition.version !== 1) return null;
      return partition.entries;
    } catch (err) {
      if (err instanceof NotFoundError) {
        return null;
      }
      throw err;
    }
  }

  private async writeShard(
    partitionKey: string,
    entries: Record<string, IndexEntry>,
    signal?: AbortSignal,
  ): Promise<void> {
    const partition: PartitionIndex = { version: 1, entries };
    const data = new TextEncoder().encode(JSON.stringify(partition));
    await retryWithBackoff(
      () => this.gcs.putObject(this.shardKey(partitionKey), data, signal),
      { signal },
    );
  }

  private async writePartitionMeta(
    meta: PartitionMetaV2,
    signal?: AbortSignal,
  ): Promise<void> {
    const data = new TextEncoder().encode(JSON.stringify(meta));
    await retryWithBackoff(
      () => this.gcs.putObject(this.metaKey(), data, signal),
      { signal },
    );
  }

  async migrateMonolithToShards(
    options?: DatastoreSyncOptions,
  ): Promise<PartitionMetaV2> {
    return await getTracer().startActiveSpan(
      "gcs-datastore migrateIndex",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");

          const signal = options?.signal;
          this.bindNamespace(options?.namespace);
          const migrateStart = Date.now();
          await this.pullIndex({ forceRemote: true, signal });
          const allEntries = this.index?.entries ?? {};
          const entryCount = Object.keys(allEntries).length;

          if (entryCount === 0) {
            return await this.recoverMetaFromListing(signal);
          }

          const partitions = GcsCacheSyncService.groupEntriesByPartition(
            allEntries,
          );

          let partitionedCount = 0;
          for (const bucket of partitions.values()) {
            partitionedCount += Object.keys(bucket).length;
          }
          if (partitionedCount !== entryCount) {
            const missing = Object.keys(allEntries).filter(
              (rel) => !GcsCacheSyncService.partitionKeyFromPath(rel),
            );
            throw new Error(
              `[gcs-sync] Migration aborted: ${entryCount} index entries but only ${partitionedCount} could be partitioned. ` +
                `${entryCount - partitionedCount} entry/entries dropped: ${
                  missing.slice(0, 10).join(", ")
                }`,
            );
          }

          console.info(
            `[gcs-sync] Migrating monolithic index to shard-first: ${entryCount} entries → ${partitions.size} shard(s)`,
          );

          const partitionKeys: string[] = [];
          for (const [key, entries] of partitions) {
            partitionKeys.push(key);
            await this.writeShard(key, entries, signal);
          }

          const meta: PartitionMetaV2 = {
            version: 2,
            partitions: partitionKeys.sort(),
            commitSeq: 1,
          };
          await this.writePartitionMeta(meta, signal);
          tracePhase("migration", migrateStart, `shards=${partitions.size}`);
          console.info(
            `[gcs-sync] Migration complete: ${partitions.size} shard(s) written, _meta.json v2 with commitSeq=1 (${
              Date.now() - migrateStart
            }ms)`,
          );
          return meta;
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

  private async assembleIndexFromShards(
    signal?: AbortSignal,
  ): Promise<
    { entries: Record<string, IndexEntry>; commitSeq: number } | null
  > {
    const meta = await this.readPartitionMeta(signal);
    if (!meta) return null;
    if (meta.version !== 2) return null;

    const v2Meta = meta as PartitionMetaV2;
    const entries: Record<string, IndexEntry> = {};
    const batchSize = 10;

    for (let i = 0; i < v2Meta.partitions.length; i += batchSize) {
      throwIfAborted(signal);
      const batch = v2Meta.partitions.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((key) => this.readShard(key, signal)),
      );
      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        if (result.status === "rejected") {
          throw new Error(
            `[gcs-sync] Failed to read shard ${batch[j]} after retries: ${
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason)
            }`,
          );
        }
        if (result.value === null) {
          throw new Error(
            `[gcs-sync] Shard ${
              batch[j]
            } listed in _meta.json v2 but missing from GCS — index is corrupt. ` +
              `Run 'swamp datastore migrate-index' to rebuild.`,
          );
        }
        for (const [rel, entry] of Object.entries(result.value)) {
          entries[rel] = entry;
        }
      }
    }

    return { entries, commitSeq: v2Meta.commitSeq };
  }

  /**
   * Like assembleIndexFromShards but only reads shards whose partition
   * key matches a path in `dirtyPaths`. Returns the partial index
   * (only entries from dirty shards) and the commitSeq. Falls back to
   * full assembly when no partition keys can be derived.
   */
  private async assembleDirtyShardsOnly(
    dirtyPaths: ReadonlySet<string>,
    signal?: AbortSignal,
  ): Promise<
    { entries: Record<string, IndexEntry>; commitSeq: number } | null
  > {
    const meta = await this.readPartitionMeta(signal);
    if (!meta) return null;
    if (meta.version !== 2) return null;

    const v2Meta = meta as PartitionMetaV2;
    const neededKeys = new Set<string>();
    const prefixes: string[] = [];
    const nsPrefix = this.namespace ? `${this.namespace}/` : "";
    for (const p of dirtyPaths) {
      // Strip the namespace prefix — partitionKeyFromPath expects bare
      // cache-relative paths (e.g. "data/type/model/file"), not
      // namespace-prefixed ones ("ns/data/type/model/file").
      const bare = nsPrefix && p.startsWith(nsPrefix)
        ? p.substring(nsPrefix.length)
        : p;
      const key = GcsCacheSyncService.partitionKeyFromPath(bare);
      if (key) {
        neededKeys.add(key);
      } else {
        // Dirty path is a directory prefix (e.g. "data/t1") that doesn't
        // resolve to a single partition key. Derive a "--"-joined prefix
        // and match all partition keys that start with it.
        const segments = bare.split("/").filter((s) => s !== "");
        if (segments.length > 0) {
          prefixes.push(segments.join("--"));
        }
      }
    }

    // Expand prefixes against the partition list
    if (prefixes.length > 0) {
      for (const partition of v2Meta.partitions) {
        for (const prefix of prefixes) {
          if (partition === prefix || partition.startsWith(prefix + "--")) {
            neededKeys.add(partition);
          }
        }
      }
    }

    if (neededKeys.size === 0) {
      return { entries: {}, commitSeq: v2Meta.commitSeq };
    }

    // Only read shards that exist in the partition list AND are needed.
    const partitionSet = new Set(v2Meta.partitions);
    const toRead = [...neededKeys].filter((k) => partitionSet.has(k));

    const entries: Record<string, IndexEntry> = {};
    const batchSize = 10;

    for (let i = 0; i < toRead.length; i += batchSize) {
      throwIfAborted(signal);
      const batch = toRead.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((key) => this.readShard(key, signal)),
      );
      for (let j = 0; j < results.length; j++) {
        const result = results[j];
        if (result.status === "rejected") {
          throw new Error(
            `[gcs-sync] Failed to read shard ${batch[j]} after retries: ${
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason)
            }`,
          );
        }
        if (result.value === null) {
          throw new Error(
            `[gcs-sync] Shard ${
              batch[j]
            } listed in _meta.json v2 but missing from GCS — index is corrupt. ` +
              `Run 'swamp datastore migrate-index' to rebuild.`,
          );
        }
        for (const [rel, entry] of Object.entries(result.value)) {
          entries[rel] = entry;
        }
      }
    }

    return { entries, commitSeq: v2Meta.commitSeq };
  }

  private async recoverMetaFromListing(
    signal?: AbortSignal,
  ): Promise<PartitionMetaV2> {
    const prefix = this.namespace ? `${this.namespace}/_index/` : "_index/";
    const listing = await this.gcs.listAllObjects(prefix, signal);
    const partitionKeys: string[] = [];
    for (const entry of listing) {
      const name = entry.key.replace(prefix, "");
      if (name === "_meta.json" || !name.endsWith(".json")) continue;
      partitionKeys.push(name.slice(0, -5));
    }

    const meta: PartitionMetaV2 = {
      version: 2,
      partitions: partitionKeys.sort(),
      commitSeq: 1,
    };
    await this.writePartitionMeta(meta, signal);
    console.warn(
      `[gcs-sync] Rebuilt _meta.json from _index/ listing: ${partitionKeys.length} shard(s)`,
    );
    return meta;
  }

  /**
   * Loads the sidecar from disk on first call and caches the result.
   * Returns null on missing file, parse failure, version mismatch, or
   * any field-shape mismatch — every fall-through case is silent and
   * leaves the slow path responsible. Bad sidecars must NEVER throw:
   * the safest fast-path failure mode is "fast path unavailable", not
   * "sync crashes on a stale sidecar".
   */
  private async loadSyncState(): Promise<DatastoreSyncState | null> {
    if (this.syncStateLoaded) return this.syncState;
    this.syncStateLoaded = true;
    try {
      const text = await Deno.readTextFile(this.syncStatePath);
      const parsed = JSON.parse(text);
      if (
        typeof parsed.remoteIndexGeneration === "string" &&
        typeof parsed.lastVerifiedAt === "string" &&
        typeof parsed.localDirty === "boolean"
      ) {
        if (parsed.version === 2) {
          const v2 = parsed as DatastoreSyncStateV2;
          this.syncState = v2;
          if (Array.isArray(v2.dirtyPaths)) {
            this.dirtyPaths = new Set(v2.dirtyPaths);
          }
          this.bulkInvalidated = !!v2.bulkInvalidated;
          this.dirtyPathsOverflowed = !!v2.dirtyPathsOverflowed;
          this.lazyPullActive = !!v2.lazyPullActive;
          this.lastCatalogHash = v2.lastCatalogHash ?? null;
        } else if (parsed.version === 1) {
          this.syncState = parsed as DatastoreSyncStateV1;
        }
      }
    } catch {
      // Missing/corrupt/unreadable — treat as no sidecar (safe default).
    }
    return this.syncState;
  }

  /** Persist the sidecar atomically. */
  private async writeSyncState(state: DatastoreSyncState): Promise<void> {
    this.syncState = state;
    this.syncStateLoaded = true;
    await ensureDir(this.cachePath);
    await atomicWriteTextFile(
      this.syncStatePath,
      JSON.stringify(state, null, 2),
    );
  }

  /** Build a v2 sidecar snapshot from current in-memory state. */
  private buildV2State(
    overrides?: Partial<
      Pick<
        DatastoreSyncStateV2,
        "localDirty" | "bulkInvalidated" | "lazyPullActive"
      >
    >,
  ): DatastoreSyncStateV2 {
    const current = this.syncState;
    const v2Current = current?.version === 2
      ? current as DatastoreSyncStateV2
      : undefined;
    return {
      version: 2,
      remoteIndexGeneration: current?.remoteIndexGeneration ?? "",
      lastVerifiedAt: current?.lastVerifiedAt ?? "",
      localDirty: overrides?.localDirty ?? current?.localDirty ?? false,
      dirtyPaths: [...this.dirtyPaths],
      bulkInvalidated: overrides?.bulkInvalidated ?? this.bulkInvalidated,
      lazyPullActive: overrides?.lazyPullActive ?? this.lazyPullActive,
      dirtyPathsOverflowed: this.dirtyPathsOverflowed,
      lastCatalogHash: this.lastCatalogHash ?? undefined,
      dataKeyMigrated: v2Current?.dataKeyMigrated,
      controlPlaneKeysMigrated: v2Current?.controlPlaneKeysMigrated,
      commitSeq: v2Current?.commitSeq,
    };
  }

  async markDirty(options?: DatastoreSyncOptions): Promise<void> {
    const current = await this.loadSyncState();
    const relPath = options?.relPath;

    if (relPath) {
      if (this.bulkInvalidated) return;
      const resolved = normalize(join(this.cachePath, relPath));
      const normalizedCache = normalize(this.cachePath);
      let normalizedRel: string;
      if (
        resolved.startsWith(normalizedCache + "/") ||
        resolved === normalizedCache
      ) {
        normalizedRel = relative(this.cachePath, resolved);
      } else {
        this.bulkInvalidated = true;
        await this.writeSyncState(
          this.buildV2State({ localDirty: true, bulkInvalidated: true }),
        );
        return;
      }
      if (this.dirtyPaths.has(normalizedRel)) return;
      if (this.dirtyPaths.size >= DIRTY_PATHS_CAP) {
        this.bulkInvalidated = true;
        this.dirtyPathsOverflowed = true;
        await this.writeSyncState(
          this.buildV2State({ localDirty: true, bulkInvalidated: true }),
        );
        return;
      }
      this.dirtyPaths.add(normalizedRel);
      await this.writeSyncState(this.buildV2State({ localDirty: true }));
      return;
    }

    if (current?.localDirty === true && this.bulkInvalidated) return;
    this.bulkInvalidated = true;
    await this.writeSyncState(
      this.buildV2State({ localDirty: true, bulkInvalidated: true }),
    );
  }

  /**
   * Record a verified-clean state: the local cache matches the remote
   * index whose generation is `remoteIndexGeneration`. Empty/zero
   * generations are rejected — they can't be fingerprints, so saving
   * one would make every subsequent fast-path comparison succeed
   * spuriously.
   *
   * Correctness invariant (swamp-club #168): `remoteIndexGeneration`
   * MUST come from the same GET response (`x-goog-generation` header
   * on the alt=media read) that delivered the bytes we verified the
   * local cache against, OR from our own putObject response for the
   * bytes we just wrote. A standalone post-walk `getMetadata` is
   * TOCTOU-racy: a concurrent writer can bump the remote index
   * between our GET and our metadata call, and recording their
   * generation as ours would mask their data on the next fast-path
   * sync until any future mutation invalidates. Callers must thread
   * the fingerprint through `pullIndex`'s return value (or use
   * `putResult.generation` in the writeback path) — never re-
   * `getMetadata` for it.
   *
   * `lastVerifiedAt` is forced strictly past the local index file's
   * mtime (by 1 ms when the wall clock would otherwise tie). The
   * fast-path probe uses `>=` to bail on any local edit, so a tied
   * timestamp would spuriously bail out of the happy path on fast
   * machines — paying the slow path on every second sync.
   */
  private async markSynced(remoteIndexGeneration: string): Promise<void> {
    if (!remoteIndexGeneration || remoteIndexGeneration === "0") return;
    let baselineMs = Date.now();
    try {
      const stat = await Deno.stat(this.indexPath);
      const mtimeMs = stat.mtime?.getTime() ?? 0;
      if (mtimeMs >= baselineMs) baselineMs = mtimeMs + 1;
    } catch {
      // No local index yet (e.g. first push against an empty cache);
      // wall-clock baseline is fine.
    }
    this.dirtyPaths.clear();
    this.bulkInvalidated = false;
    this.dirtyPathsOverflowed = false;
    await this.writeSyncState({
      version: 2,
      remoteIndexGeneration,
      lastVerifiedAt: new Date(baselineMs).toISOString(),
      localDirty: false,
      dirtyPaths: [],
      bulkInvalidated: false,
      lazyPullActive: this.lazyPullActive,
      dirtyPathsOverflowed: false,
      lastCatalogHash: this.lastCatalogHash ?? undefined,
    });
  }

  /**
   * Fast-path probe using commitSeq from _meta.json. Returns `0` if
   * the sidecar's commitSeq matches the remote _meta.json; `null` to
   * fall through to the slow path.
   */
  private async tryCommitSeqFastPath(
    signal: AbortSignal | undefined,
  ): Promise<number | null> {
    const sidecar = await this.loadSyncState();
    if (!sidecar || sidecar.version !== 2) return null;
    const v2 = sidecar as DatastoreSyncStateV2;
    if (v2.commitSeq === undefined) return null;

    const meta = await this.readPartitionMeta(signal);
    if (!meta || meta.version !== 2) return null;
    if ((meta as PartitionMetaV2).commitSeq !== v2.commitSeq) return null;
    return 0;
  }

  /**
   * Fast-path probe for `pullChanged`. Tries commitSeq first (shard-first
   * remotes), then falls back to generation comparison (pre-shard remotes).
   * Returns `0` when the sidecar proves nothing changed; `null` to fall
   * through to the slow path.
   */
  private async tryFastPullChanged(
    signal: AbortSignal | undefined,
  ): Promise<number | null> {
    const commitSeqResult = await this.tryCommitSeqFastPath(signal);
    if (commitSeqResult !== null) return commitSeqResult;

    const sidecar = await this.loadSyncState();
    if (!sidecar) return null;
    if (
      !sidecar.remoteIndexGeneration || sidecar.remoteIndexGeneration === "0"
    ) {
      return null;
    }
    let indexMtime: Date | null = null;
    try {
      const stat = await Deno.stat(this.indexPath);
      indexMtime = stat.mtime;
    } catch {
      return null;
    }
    if (!indexMtime) return null;
    const verifiedAt = Date.parse(sidecar.lastVerifiedAt);
    if (Number.isNaN(verifiedAt) || indexMtime.getTime() >= verifiedAt) {
      return null;
    }
    let meta;
    try {
      meta = await this.gcs.getMetadata(this.indexKey(), signal);
    } catch {
      return null;
    }
    if (!meta.exists || !meta.generation || meta.generation === "0") {
      return null;
    }
    if (meta.generation !== sidecar.remoteIndexGeneration) return null;
    return 0;
  }

  /**
   * Fast-path probe for `pushChanged`. Tries commitSeq first, then falls
   * back to generation. Also checks localDirty -- a dirty cache must always
   * take the slow path.
   */
  private async tryFastPushChanged(
    _signal: AbortSignal | undefined,
  ): Promise<number | null> {
    const sidecar = await this.loadSyncState();
    if (!sidecar) return null;
    // localDirty is the authority on whether local changes need pushing.
    // No need to verify commitSeq/generation — those track remote state,
    // which is irrelevant to whether WE have something to push.
    if (!sidecar.localDirty) return 0;
    return null;
  }

  /**
   * Removes zombie internal-file entries from the in-memory index.
   * Runs whenever the index is populated from disk or remote so the
   * invariant "internal files never cross the sync boundary" is
   * enforced at the persistence boundary.
   *
   * Returns true if any entries were removed. See
   * `isInternalCacheFile` for the exclusion criteria and swamp-club
   * issue #29 for the motivating bug.
   */
  private scrubIndex(): boolean {
    if (!this.index || !this.index.entries) return false;
    let mutated = false;
    for (const rel of Object.keys(this.index.entries)) {
      if (isInternalCacheFile(rel)) {
        delete this.index.entries[rel];
        mutated = true;
      }
    }
    return mutated;
  }

  /**
   * Pulls the metadata index from GCS (lightweight, single GET).
   * Uses a local cache with a 60-second TTL to avoid redundant fetches.
   *
   * Pass `forceRemote: true` to bypass the local TTL cache and always
   * fetch from GCS. `pushChanged()` uses this to guarantee the
   * writeback merges onto the current remote state — without it, a
   * stale local cache (< 60 s old) could silently clobber updates
   * pushed by another writer in the intervening window.
   *
   * Both entry paths (cache-hit and GCS-fetch) scrub the in-memory
   * index after parsing so zombie internal-file entries never reach
   * the rest of the sync pipeline (see swamp-club#29). On the
   * GCS-fetch path the local cache file is rewritten with the scrubbed
   * JSON when scrub mutated — keeping the on-disk and in-memory views
   * consistent. The cache-hit path does NOT rewrite the local file;
   * its on-disk view self-heals on the next GCS fetch.
   */
  async pullIndex(
    options?: { forceRemote?: boolean; signal?: AbortSignal },
  ): Promise<string | null> {
    const signal = options?.signal;
    // Cache-hit returns null: no remote fetch happened, so we have no
    // fingerprint the caller can safely record. The alternative —
    // `getMetadata`'ing remote to synthesize a fingerprint —
    // reintroduces the TOCTOU race this refactor exists to close.
    if (!options?.forceRemote) {
      try {
        const stat = await Deno.stat(this.indexPath);
        const ageMs = Date.now() - (stat.mtime?.getTime() ?? 0);
        if (ageMs < INDEX_CACHE_TTL_MS && this.index === null) {
          const content = await Deno.readTextFile(this.indexPath);
          this.index = JSON.parse(content) as DatastoreIndex;
          this.indexMutated ||= this.scrubIndex();
          return null;
        }
      } catch {
        // No local index — fetch from GCS
      }
    }

    // Fetch the remote index. Only `NotFoundError` (GCS 404 —
    // bucket exists but no index object yet) is treated as the
    // brand-new-bucket case and falls back to an empty in-memory
    // index. Any other error (auth failure, 5xx, network timeout,
    // JSON parse failure, local write failure) propagates so callers
    // abort rather than treating a transient failure as "no data" —
    // critical for `pushChanged`, which would otherwise write an
    // empty index back to the remote and wipe the real one.
    let data: Uint8Array;
    let generation: string | undefined;
    try {
      const response = await this.gcs.getObject(
        this.indexKey(),
        signal,
      );
      data = response.data;
      generation = response.generation;
    } catch (err) {
      if (err instanceof NotFoundError) {
        // Bucket has no index file. Two sub-cases:
        //   (1) Brand-new empty bucket — fall back to an empty
        //       in-memory index, return null. Existing behaviour.
        //   (2) Bucket pre-dates the indexed-sync model and holds data
        //       under standard prefixes but was never written by a
        //       swamp version that publishes `.datastore-index.json`.
        // Discovery: list, filter via isInternalCacheFile, build an
        // index, publish it, and continue. See discoverIndexFromBucket
        // for the full inline rationale (matches the @swamp/s3-datastore
        // sibling implementation; swamp-club#225 follow-up to #220).
        return await this.discoverIndexFromBucket(signal);
      }
      throw err;
    }

    const text = new TextDecoder().decode(data);
    this.index = JSON.parse(text) as DatastoreIndex;
    await ensureDir(this.cachePath);
    if (this.scrubIndex()) {
      this.indexMutated = true;
      await atomicWriteTextFile(
        this.indexPath,
        JSON.stringify(this.index, null, 2),
      );
    } else {
      await atomicWriteTextFile(this.indexPath, text);
    }
    return generation ?? null;
  }

  /**
   * Self-healing fallback for `pullIndex` when the remote
   * `.datastore-index.json` is absent. Lists the bucket, filters
   * internal cache files, builds an index from the listing, publishes
   * it, and writes the local copy — leaving the caller's slow-path
   * bookkeeping behaving identically to a normal index fetch.
   *
   * Inline-comment requirements (mirror of the s3-datastore sibling;
   * a future reader must not "fix" any of these without understanding
   * the trade-off):
   *
   *   i. The PutObject is unconditional. Discovery is functionally
   *      idempotent across racing peers — entry keys and sizes match,
   *      but metadata timestamps (`lastPulled`, and the `lastModified`
   *      fallback when the listing didn't surface an `updated` value)
   *      are evaluated per peer so the JSON bodies are NOT byte-
   *      identical. Sync behaviour depends on keys + sizes, not
   *      timestamps, so last-writer-wins is benign. Do NOT add a
   *      content-fingerprint optimization here on the assumption of
   *      byte-equality. Matches the existing pushChanged writeback
   *      pattern; `ifGenerationMatch=0` is available on GCS but skipped
   *      to keep symmetry with the s3-datastore sibling.
   *
   *  ii. `this.index` is set in-memory BEFORE the put, mirroring the
   *      post-fetch order. If put throws, the in-memory state reflects
   *      an unpublished snapshot, no local file is written
   *      (atomicWriteTextFile happens after put), and the next
   *      forceRemote call re-triggers discovery — idempotent with no
   *      orphaned state.
   *
   * iii. All callers of pullIndex (both pullChanged and pushChanged)
   *      inherit this fallback automatically.
   *
   * GCS list eventual consistency: generally strong since 2020, but a
   * freshly-uploaded object may briefly miss from a listing. Discovery
   * is convergent — re-running setup picks up any missed objects on
   * the next pass.
   */
  private async discoverIndexFromBucket(
    signal?: AbortSignal,
  ): Promise<string | null> {
    const discoverStart = Date.now();
    const subPrefix = this.namespace ? `${this.namespace}/` : undefined;
    const listing = await this.gcs.listAllObjects(subPrefix, signal);
    const nsPrefix = this.namespace ? `${this.namespace}/` : "";
    const remoteNamespaces = new Set<string>();
    if (!this.namespace) {
      for (const entry of listing) {
        if (entry.key.endsWith("/.namespace.json")) {
          const ns = entry.key.substring(
            0,
            entry.key.length - "/.namespace.json".length,
          );
          if (ns) remoteNamespaces.add(ns);
        }
      }
    }
    const filtered = listing.filter((entry) => {
      const rel = nsPrefix && entry.key.startsWith(nsPrefix)
        ? entry.key.slice(nsPrefix.length)
        : entry.key;
      if (isInternalCacheFile(rel)) return false;
      if (
        remoteNamespaces.size > 0 &&
        isInsideNamespaceDir(entry.key, remoteNamespaces)
      ) return false;
      return true;
    });

    // Sub-case (1): genuinely empty bucket. Initialize with shard-first
    // (v2) indexing so all subsequent writes use shards from the start —
    // no migration needed. The meta write is best-effort: if it fails
    // (permissions, transient error), the bucket falls back to v1 on
    // this run and retries v2 init on the next.
    if (filtered.length === 0) {
      this.index = {
        version: 1,
        lastPulled: new Date().toISOString(),
        entries: {},
      };
      try {
        const meta: PartitionMetaV2 = {
          version: 2,
          partitions: [],
          commitSeq: 0,
        };
        await this.writePartitionMeta(meta, signal);
        this.freshV2Initialized = true;
        tracePhase("pullIndex.discover", discoverStart, "n=0 v2-init");
      } catch {
        tracePhase("pullIndex.discover", discoverStart, "n=0 v2-init-failed");
      }
      return null;
    }

    const entries: Record<string, IndexEntry> = {};
    for (const entry of filtered) {
      const rel = nsPrefix && entry.key.startsWith(nsPrefix)
        ? entry.key.slice(nsPrefix.length)
        : entry.key;
      entries[rel] = {
        key: rel,
        size: entry.size,
        lastModified: (entry.updated ?? new Date()).toISOString(),
      };
    }
    this.index = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries,
    };
    const indexData = new TextEncoder().encode(JSON.stringify(this.index));
    const putResult = await retryWithBackoff(
      () => this.gcs.putObject(this.indexKey(), indexData, signal),
      { signal },
    );
    await ensureDir(this.cachePath);
    await atomicWriteTextFile(
      this.indexPath,
      JSON.stringify(this.index, null, 2),
    );
    tracePhase(
      "pullIndex.discover",
      discoverStart,
      `n=${filtered.length}`,
    );
    // The returned `generation` is the raw form from the PUT response
    // (a numeric string). Matches the post-fetch path's contract —
    // callers compare it byte-for-byte against the sidecar's recorded
    // generation. No normalization needed (unlike S3's quoted ETag).
    return putResult?.generation ?? null;
  }

  /** Fetches a single file from GCS to the local cache. */
  async pullFile(relativePath: string, signal?: AbortSignal): Promise<void> {
    return await getTracer().startActiveSpan(
      "gcs-datastore pullFile",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_FILE, relativePath);

          const localPath = assertSafePath(
            this.cachePath,
            this.localRelPath(relativePath),
          );
          let data: Uint8Array;
          try {
            ({ data } = await retryWithBackoff(
              () => this.gcs.getObject(this.dataKey(relativePath), signal),
              { signal },
            ));
          } catch (err) {
            if (this.namespace && err instanceof NotFoundError) {
              ({ data } = await retryWithBackoff(
                () => this.gcs.getObject(relativePath, signal),
                { signal },
              ));
            } else {
              throw err;
            }
          }
          await ensureDir(dirname(localPath));
          await Deno.writeFile(localPath, data);
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

  /**
   * Pulls only new or modified files from GCS to the local cache.
   * Fetches the remote index, compares against local files, and only
   * downloads files that are missing locally or have a different size.
   *
   * Fast path: before doing any of that, HEAD the remote index and
   * compare its generation to the sidecar; if nothing has changed since
   * the last verified-clean walk, return `0` immediately without the
   * 1+ MB index GET or the multi-thousand-stat walk. Any fall-through
   * condition (no sidecar, generation mismatch, empty/zero generation,
   * local index mtime newer than `lastVerifiedAt`, HEAD failure) drops
   * into the slow path below.
   */
  async pullChanged(
    options?: DatastoreSyncOptions,
  ): Promise<number | void> {
    return await getTracer().startActiveSpan(
      "gcs-datastore pull",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");

          const signal = options?.signal;
          this.bindNamespace(options?.namespace);
          throwIfAborted(signal);
          await this.ensurePreflight(signal);

          const skipFastPath = this.lazyPullActive && !options?.metadataOnly;
          const fastStart = Date.now();
          const fastResult = skipFastPath
            ? null
            : await this.tryFastPullChanged(signal);
          tracePhase(
            "pullChanged.fastpath",
            fastStart,
            skipFastPath
              ? "skip(lazy→full)"
              : fastResult === 0
              ? "hit"
              : "miss",
          );
          if (fastResult !== null) {
            span.setAttribute(Attr.DATASTORE_FAST_PATH_HIT, true);
            span.setAttribute(Attr.DATASTORE_FILES_PULLED, 0);
            return fastResult;
          }
          span.setAttribute(Attr.DATASTORE_FAST_PATH_HIT, false);

          const indexStart = Date.now();
          const models = options?.context?.models;
          let indexGeneration: string | null;
          let v2CommitSeq: number | null = null;

          if (models && models.length > 0) {
            const partitionEntries = await this.pullPartitionedIndex(
              models,
              signal,
            );
            if (partitionEntries) {
              if (!this.index) {
                this.index = {
                  version: 1,
                  lastPulled: new Date().toISOString(),
                  entries: {},
                };
              }
              for (const [rel, entry] of Object.entries(partitionEntries)) {
                this.index.entries[rel] = entry;
              }
              indexGeneration = null;
            } else {
              indexGeneration = await this.pullIndex({
                forceRemote: true,
                signal,
              });
            }
          } else {
            const assembled = await this.assembleIndexFromShards(signal);
            if (assembled) {
              this.index = {
                version: 1,
                lastPulled: new Date().toISOString(),
                entries: assembled.entries,
              };
              this.scrubIndex();
              await ensureDir(this.cachePath);
              await atomicWriteTextFile(
                this.indexPath,
                JSON.stringify(this.index, null, 2),
              );
              indexGeneration = null;
              v2CommitSeq = assembled.commitSeq;
            } else {
              indexGeneration = await this.pullIndex({
                forceRemote: true,
                signal,
              });
            }
          }
          tracePhase("pullChanged.pullIndex", indexStart);

          const metadataOnly = !!options?.metadataOnly;

          // Bulk-diff: fetch a remote listing to know which files
          // actually exist, pruning stale index entries without per-file
          // getObject 404s — O(files/1000) list calls instead of
          // O(files) round-trips (swamp-club #2033).
          //
          // List the full prefix (not just namespace) so root-level files
          // from pre-namespace pushes are captured — pullFile falls back
          // to root keys when the namespaced key is 404.
          //
          // On listing failure (permissions, network), fall back to the
          // pre-#2033 per-file behavior — no pruning, 404s discovered
          // during download.
          const listStart = Date.now();
          const listNsPrefix = this.namespace ? `${this.namespace}/` : "";
          let remoteKeys: Set<string> | null = null;
          try {
            const remoteListing = await this.gcs.listAllObjects(
              undefined,
              signal,
            );
            remoteKeys = new Set<string>();
            for (const listEntry of remoteListing) {
              if (listNsPrefix && listEntry.key.startsWith(listNsPrefix)) {
                remoteKeys.add(listEntry.key.slice(listNsPrefix.length));
              } else {
                remoteKeys.add(listEntry.key);
              }
            }
          } catch {
            // Non-fatal: listing failed, skip bulk pruning.
          }
          tracePhase(
            "pullChanged.remoteListing",
            listStart,
            remoteKeys ? `keys=${remoteKeys.size}` : "fallback",
          );

          const walkStart = Date.now();
          const toPull: string[] = [];
          const lazyDirsToCreate: Set<string> = new Set();
          const pull404PartitionKeys = new Set<string>();
          for (
            const [rel, entry] of Object.entries(this.index?.entries ?? {})
          ) {
            if (isInternalCacheFile(rel)) {
              continue;
            }
            // Prune entries whose remote object no longer exists — the
            // listing already told us, no per-file getObject needed.
            // Skipped when the listing failed (remoteKeys is null).
            if (remoteKeys && !remoteKeys.has(rel)) {
              if (this.index) {
                const partKey = GcsCacheSyncService.partitionKeyFromPath(rel);
                if (partKey) pull404PartitionKeys.add(partKey);
                delete this.index.entries[rel];
                this.indexMutated = true;
              }
              continue;
            }
            if (metadataOnly && isLazySkippable(rel)) {
              const localPath = assertSafePath(
                this.cachePath,
                this.localRelPath(rel),
              );
              lazyDirsToCreate.add(dirname(localPath));
              continue;
            }
            const localPath = assertSafePath(
              this.cachePath,
              this.localRelPath(rel),
            );
            try {
              const stat = await Deno.stat(localPath);
              if (stat.size === entry.size) {
                // Same size — use mtime as a fast path: if the local file
                // hasn't been touched since we last recorded its mtime AND
                // the index carries a sha256, the remote may have changed
                // underneath us (another machine pushed a same-size update).
                // Hash-compare only when mtime is missing, unrecorded, or
                // differs — that covers fresh index pulls where localMtime
                // hasn't been reconciled yet.
                const mtimeMatch = entry.localMtime && stat.mtime &&
                  entry.localMtime === stat.mtime.toISOString();
                if (!mtimeMatch && entry.sha256) {
                  const data = await Deno.readFile(localPath);
                  const hashBuffer = await crypto.subtle.digest(
                    "SHA-256",
                    data,
                  );
                  const localHash = Array.from(new Uint8Array(hashBuffer))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("");
                  if (localHash !== entry.sha256) {
                    toPull.push(rel);
                    continue;
                  }
                }
                if (
                  this.index && stat.mtime &&
                  entry.localMtime !== stat.mtime.toISOString()
                ) {
                  this.index.entries[rel].localMtime = stat.mtime.toISOString();
                }
                continue;
              }
            } catch {
              // File doesn't exist locally — needs pull
            }
            toPull.push(rel);
          }
          await Promise.all([...lazyDirsToCreate].map((d) => ensureDir(d)));
          tracePhase("pullChanged.walk", walkStart, `toPull=${toPull.length}`);

          const downloadStart = Date.now();
          let pulled = 0;
          const failures: Array<{ file: string; error: unknown }> = [];
          for (let i = 0; i < toPull.length; i += this.pullConcurrency) {
            throwIfAborted(signal);
            const batch = toPull.slice(i, i + this.pullConcurrency);
            const results = await Promise.allSettled(
              batch.map(async (rel) => {
                await this.pullFile(rel, signal);
                try {
                  const localPath = join(
                    this.cachePath,
                    this.localRelPath(rel),
                  );
                  const stat = await Deno.stat(localPath);
                  if (stat.mtime && this.index) {
                    this.index.entries[rel].localMtime = stat.mtime
                      .toISOString();
                  }
                } catch {
                  // Non-fatal: mtime recording is best-effort
                }
              }),
            );
            for (let j = 0; j < results.length; j++) {
              const result = results[j];
              if (result.status === "fulfilled") {
                pulled++;
              } else {
                const err = result.reason;
                if (err instanceof NotFoundError && this.index) {
                  const partKey = GcsCacheSyncService.partitionKeyFromPath(
                    batch[j],
                  );
                  if (partKey) pull404PartitionKeys.add(partKey);
                  delete this.index.entries[batch[j]];
                  this.indexMutated = true;
                } else {
                  failures.push({ file: batch[j], error: err });
                }
              }
            }
          }
          tracePhase("pullChanged.download", downloadStart, `pulled=${pulled}`);

          if (failures.length > 0) {
            throw new Error(formatBatchFailure("pull", failures));
          }

          if (indexGeneration) {
            try {
              if ((pulled > 0 || this.indexMutated) && this.index) {
                await atomicWriteTextFile(
                  this.indexPath,
                  JSON.stringify(this.index, null, 2),
                );
                if (this.indexMutated) {
                  const indexData = new TextEncoder().encode(
                    JSON.stringify(this.index),
                  );
                  const putResult = await retryWithBackoff(
                    () =>
                      this.gcs.putObject(this.indexKey(), indexData, signal),
                    { signal },
                  );
                  this.indexMutated = false;
                  indexGeneration = putResult?.generation ?? indexGeneration;
                }
              }
              await this.markSynced(indexGeneration);
            } catch {
              // Non-fatal: sidecar update is opportunistic.
            }
          } else if (
            v2CommitSeq !== null && this.indexMutated &&
            pull404PartitionKeys.size > 0 && this.index
          ) {
            // Shard-first path: 404 cleanup removed stale entries from
            // the in-memory index. Write back only the affected shards so
            // the stale entries don't reappear on the next boot
            // (swamp-club #2063).
            try {
              const allPartitions = GcsCacheSyncService.groupEntriesByPartition(
                this.index.entries,
              );
              const currentMeta = await this.readPartitionMeta(signal);
              const survivingPartitions = currentMeta?.version === 2
                ? new Set(
                  (currentMeta as PartitionMetaV2).partitions,
                )
                : new Set(allPartitions.keys());

              for (const partKey of pull404PartitionKeys) {
                const entries = allPartitions.get(partKey);
                if (entries && Object.keys(entries).length > 0) {
                  await this.writeShard(partKey, entries, signal);
                  survivingPartitions.add(partKey);
                } else {
                  try {
                    await retryWithBackoff(
                      () =>
                        this.gcs.deleteObject(
                          this.shardKey(partKey),
                          undefined,
                          signal,
                        ),
                      { signal },
                    );
                  } catch {
                    // Non-fatal: shard may not exist
                  }
                  survivingPartitions.delete(partKey);
                }
              }

              const newMeta: PartitionMetaV2 = {
                version: 2,
                partitions: [...survivingPartitions].sort(),
                commitSeq: v2CommitSeq + 1,
              };
              await this.writePartitionMeta(newMeta, signal);

              await atomicWriteTextFile(
                this.indexPath,
                JSON.stringify(this.index, null, 2),
              );
              this.indexMutated = false;

              const sidecar = this.buildV2State({ localDirty: false });
              sidecar.commitSeq = newMeta.commitSeq;
              sidecar.remoteIndexGeneration = "";
              await this.writeSyncState(sidecar);
            } catch {
              // Non-fatal: shard writeback is opportunistic. A missed
              // cleanup only costs repeated 404s on the next boot —
              // the same behavior as before this fix.
            }
          } else if (v2CommitSeq !== null) {
            // Shard-first path, clean pull (no 404 cleanup, no monolithic
            // index generation). Record commitSeq in the sidecar so the
            // fast path can arm on the next pull (swamp-club #1931).
            try {
              const sidecar = this.buildV2State({ localDirty: false });
              sidecar.commitSeq = v2CommitSeq;
              sidecar.remoteIndexGeneration = "";
              await this.writeSyncState(sidecar);
            } catch {
              // Non-fatal: missed sidecar update only costs one slow-path
              // sync next time.
            }
          }

          if (metadataOnly) {
            this.lazyPullActive = true;
            await this.writeSyncState(
              this.buildV2State({ lazyPullActive: true }),
            );
          } else if (
            this.lazyPullActive && !options?.context?.models?.length
          ) {
            this.lazyPullActive = false;
            await this.writeSyncState(
              this.buildV2State({ lazyPullActive: false }),
            );
          }

          span.setAttribute(Attr.DATASTORE_FILES_PULLED, pulled);
          return pulled;
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

  /**
   * Pushes a single file from the local cache to GCS.
   *
   * Pessimistically marks the sidecar `localDirty: true` BEFORE the
   * upload so a crash mid-batch never strands an unpushed local change
   * behind a clean fast-path flag — the next `pushChanged` will see
   * `localDirty: true` and do the full walk. The flag is cleared only
   * by `pushChanged` after a successful index writeback.
   */
  async pushFile(
    relativePath: string,
    signal?: AbortSignal,
    overrideLocalPath?: string,
  ): Promise<void> {
    return await getTracer().startActiveSpan(
      "gcs-datastore pushFile",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_FILE, relativePath);

          await this.markDirty();
          let localPath: string;
          if (overrideLocalPath) {
            const resolved = normalize(overrideLocalPath);
            const normalizedCache = normalize(this.cachePath);
            if (
              !resolved.startsWith(normalizedCache + "/") &&
              resolved !== normalizedCache
            ) {
              throw new Error(`Path traversal detected: ${overrideLocalPath}`);
            }
            localPath = resolved;
          } else {
            localPath = assertSafePath(this.cachePath, relativePath);
          }
          const data = await Deno.readFile(localPath);
          const hashBuffer = await crypto.subtle.digest("SHA-256", data);
          const sha256 = Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          await retryWithBackoff(
            () => this.gcs.putObject(this.dataKey(relativePath), data, signal),
            { signal },
          );

          if (this.index) {
            const stat = await Deno.stat(localPath);
            this.index.entries[relativePath] = {
              key: relativePath,
              size: data.length,
              lastModified: new Date().toISOString(),
              localMtime: stat.mtime?.toISOString(),
              sha256,
            };
          }
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

  /**
   * Pushes only new or modified files from the local cache to GCS.
   * Compares each file's size and mtime against the index to detect
   * changes.
   *
   * Fast path: before doing any of that, HEAD the remote index and
   * compare generation against the sidecar; if nothing has changed
   * (and `localDirty` is false), short-circuit. Otherwise fall through
   * to the slow walk + upload path, which always fetches the current
   * remote index (bypassing the local TTL cache) so the writeback
   * merges new/modified entries onto remote state instead of clobbering
   * it. Without forceRemote here, any client with a smaller or stale
   * local cache (e.g. a fresh reader running `datastore setup`, or a
   * writer whose cached index is < 60 s old but another writer has
   * since pushed) would overwrite the remote `.datastore-index.json`
   * with a subset of entries, leaving the other writer's data
   * orphaned. See swamp-club#30.
   */
  async pushChanged(
    options?: DatastoreSyncOptions,
  ): Promise<number | void> {
    return await getTracer().startActiveSpan(
      "gcs-datastore push",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");

          const signal = options?.signal;
          this.bindNamespace(options?.namespace);
          throwIfAborted(signal);
          await this.ensurePreflight(signal);

          const syncState = await this.loadSyncState() as
            | DatastoreSyncStateV2
            | null;
          const needsDataKeyMigration = this.namespace != null &&
            !syncState?.dataKeyMigrated;
          const needsControlPlaneMigration = this.namespace != null &&
            !syncState?.controlPlaneKeysMigrated;

          const fastStart = Date.now();
          const fastResult = needsDataKeyMigration || needsControlPlaneMigration
            ? null
            : await this.tryFastPushChanged(signal);
          tracePhase(
            "pushChanged.fastpath",
            fastStart,
            fastResult === 0 ? "hit" : "miss",
          );
          if (fastResult !== null) {
            span.setAttribute(Attr.DATASTORE_FAST_PATH_HIT, true);
            span.setAttribute(Attr.DATASTORE_FILES_PUSHED, 0);
            span.setAttribute(Attr.DATASTORE_FILES_DELETED, 0);
            return fastResult;
          }
          span.setAttribute(Attr.DATASTORE_FAST_PATH_HIT, false);

          const indexStart = Date.now();
          let indexGeneration: string | null = null;
          let v2CommitSeq: number | null = null;
          const willScopeWalk = !this.bulkInvalidated &&
            this.dirtyPaths.size > 0;
          const assembled = willScopeWalk
            ? await this.assembleDirtyShardsOnly(this.dirtyPaths, signal)
            : await this.assembleIndexFromShards(signal);
          if (assembled) {
            this.index = {
              version: 1,
              lastPulled: new Date().toISOString(),
              entries: assembled.entries,
            };
            this.indexIsPartial = willScopeWalk;
            this.scrubIndex();
            v2CommitSeq = assembled.commitSeq;
            tracePhase(
              "pushChanged.shardAssembly",
              indexStart,
              willScopeWalk ? `scoped=${this.dirtyPaths.size}` : `full`,
            );
          } else {
            indexGeneration = await this.pullIndex({
              forceRemote: true,
              signal,
            });
            this.indexIsPartial = false;
            if (this.freshV2Initialized) {
              v2CommitSeq = 0;
              indexGeneration = null;
            }
            tracePhase("pushChanged.pullIndex", indexStart);
          }

          if (needsDataKeyMigration) {
            if (assembled) {
              // v2 shard-first index is in place — data is already
              // namespaced, skip root migration (swamp-club #2091).
              try {
                const sidecar = this.buildV2State({ localDirty: false });
                sidecar.dataKeyMigrated = true;
                await this.writeSyncState(sidecar);
              } catch { /* non-fatal */ }
            } else {
              const { copied, total } = await this.migrateRootDataToNamespace(
                signal,
              );
              const allMigrated = total === 0 || copied === total;
              if (copied > 0) {
                try {
                  const sidecar = this.buildV2State({ localDirty: false });
                  if (allMigrated) sidecar.dataKeyMigrated = true;
                  await this.writeSyncState(sidecar);
                } catch { /* non-fatal */ }
                span.setAttribute(Attr.DATASTORE_FILES_PUSHED, copied);
                span.setAttribute(Attr.DATASTORE_FILES_DELETED, 0);
                return copied;
              }
              try {
                const sidecar = this.buildV2State({ localDirty: false });
                if (allMigrated) sidecar.dataKeyMigrated = true;
                await this.writeSyncState(sidecar);
              } catch { /* non-fatal */ }
            }
          }

          if (needsControlPlaneMigration) {
            const { copied, total } = await this
              .migrateRootControlPlaneToNamespace(signal);
            try {
              const sidecar = this.buildV2State({ localDirty: false });
              if (total === 0 || copied === total) {
                sidecar.controlPlaneKeysMigrated = true;
              }
              await this.writeSyncState(sidecar);
            } catch { /* non-fatal */ }
          }

          const walkStart = Date.now();
          const nsPrefix = this.namespace ? `${this.namespace}/` : "";
          const toPush: Array<{ rel: string; path: string }> = [];
          const toDelete: string[] = [];
          const useScopedWalk = !this.bulkInvalidated &&
            this.dirtyPaths.size > 0;

          if (useScopedWalk) {
            for (const dirtyPath of this.dirtyPaths) {
              const absPath = join(this.cachePath, dirtyPath);
              const bareDirtyPath = nsPrefix && dirtyPath.startsWith(nsPrefix)
                ? dirtyPath.substring(nsPrefix.length)
                : dirtyPath;
              try {
                const stat = await Deno.stat(absPath);
                if (stat.isFile) {
                  if (
                    !isInternalCacheFile(dirtyPath) &&
                    await this.fileNeedsPush(absPath, bareDirtyPath)
                  ) {
                    toPush.push({ rel: bareDirtyPath, path: absPath });
                  }
                } else if (stat.isDirectory) {
                  const localFilesInDir = new Set<string>();
                  for await (
                    const entry of walk(absPath, { includeDirs: false })
                  ) {
                    const rel = relative(this.cachePath, entry.path);
                    if (isInternalCacheFile(rel)) continue;
                    const bareRel = nsPrefix && rel.startsWith(nsPrefix)
                      ? rel.substring(nsPrefix.length)
                      : rel;
                    localFilesInDir.add(bareRel);
                    if (await this.fileNeedsPush(entry.path, bareRel)) {
                      toPush.push({ rel: bareRel, path: entry.path });
                    }
                  }
                  if (!this.lazyPullActive && this.index) {
                    const prefix = bareDirtyPath.endsWith("/")
                      ? bareDirtyPath
                      : bareDirtyPath + "/";
                    for (const key of Object.keys(this.index.entries)) {
                      if (isInternalCacheFile(key)) continue;
                      if (key.startsWith(prefix) && !localFilesInDir.has(key)) {
                        toDelete.push(key);
                      }
                    }
                  }
                }
              } catch (err) {
                if (!(err instanceof Deno.errors.NotFound)) {
                  continue;
                }
                if (!this.lazyPullActive && this.index) {
                  for (const key of Object.keys(this.index.entries)) {
                    if (isInternalCacheFile(key)) continue;
                    if (
                      key === bareDirtyPath ||
                      key.startsWith(bareDirtyPath + "/")
                    ) {
                      toDelete.push(key);
                    }
                  }
                }
              }
            }
          } else {
            const namespaceDirs = this.namespace
              ? await detectNamespaceDirs(this.cachePath, this.namespace)
              : new Set<string>();
            let namespaceDirSkips = 0;
            let soloLayoutSkips = 0;
            const localFiles = new Set<string>();
            try {
              for await (
                const entry of walk(this.cachePath, { includeDirs: false })
              ) {
                const rel = relative(this.cachePath, entry.path);
                if (isInternalCacheFile(rel)) continue;
                if (nsPrefix && !rel.startsWith(nsPrefix)) {
                  soloLayoutSkips++;
                  continue;
                }
                if (isInsideNamespaceDir(rel, namespaceDirs)) {
                  namespaceDirSkips++;
                  continue;
                }
                const bareRel = nsPrefix && rel.startsWith(nsPrefix)
                  ? rel.substring(nsPrefix.length)
                  : rel;
                localFiles.add(bareRel);
                if (await this.fileNeedsPush(entry.path, bareRel)) {
                  toPush.push({ rel: bareRel, path: entry.path });
                }
              }
            } catch {
              // Cache directory may not exist yet
            }
            if (soloLayoutSkips > 0) {
              console.warn(
                `[gcs-sync] Skipped ${soloLayoutSkips} solo-layout file(s) outside the bound ` +
                  `namespace "${this.namespace}". These are stale leftovers — ` +
                  `investigate and remove them.`,
              );
            }
            if (namespaceDirSkips > 0) {
              console.warn(
                `[gcs-sync] Skipped ${namespaceDirSkips} file(s) inside namespace directories ` +
                  `found under the cache root (${
                    [...namespaceDirs].join(", ")
                  }). ` +
                  `These directories should not be inside this cache — investigate and remove them.`,
              );
            }
            if (
              this.dirtyPathsOverflowed && !this.lazyPullActive && this.index
            ) {
              for (const key of Object.keys(this.index.entries)) {
                if (isInternalCacheFile(key)) continue;
                if (isInsideNamespaceDir(key, namespaceDirs)) continue;
                if (localFiles.has(key)) continue;
                if (this.lazyPullActive && isLazySkippable(key)) continue;
                toDelete.push(key);
              }
            }
          }
          tracePhase(
            "pushChanged.walk",
            walkStart,
            `toPush=${toPush.length} toDelete=${toDelete.length}`,
          );

          const uploadStart = Date.now();
          let pushed = 0;
          const failures: Array<{ file: string; error: unknown }> = [];
          for (let i = 0; i < toPush.length; i += this.pushConcurrency) {
            throwIfAborted(signal);
            const batch = toPush.slice(i, i + this.pushConcurrency);
            const results = await Promise.allSettled(
              batch.map(({ rel, path }) => this.pushFile(rel, signal, path)),
            );
            for (let j = 0; j < results.length; j++) {
              const result = results[j];
              if (result.status === "fulfilled") {
                pushed++;
              } else {
                failures.push({ file: batch[j].rel, error: result.reason });
              }
            }
          }
          tracePhase("pushChanged.upload", uploadStart, `pushed=${pushed}`);

          if (failures.length > 0) {
            throw new Error(formatBatchFailure("push", failures));
          }

          const deleteStart = Date.now();
          let deleted = 0;
          const deleteFailures: Array<{ file: string; error: unknown }> = [];
          for (let i = 0; i < toDelete.length; i += this.pushConcurrency) {
            throwIfAborted(signal);
            const batch = toDelete.slice(i, i + this.pushConcurrency);
            const results = await Promise.allSettled(
              batch.map((key) =>
                retryWithBackoff(
                  () =>
                    this.gcs.deleteObject(
                      this.dataKey(key),
                      undefined,
                      signal,
                    ),
                  { signal },
                )
              ),
            );
            for (let j = 0; j < results.length; j++) {
              const result = results[j];
              if (result.status === "fulfilled") {
                deleted++;
                if (this.index) {
                  delete this.index.entries[batch[j]];
                }
              } else {
                deleteFailures.push({ file: batch[j], error: result.reason });
              }
            }
          }
          tracePhase("pushChanged.delete", deleteStart, `deleted=${deleted}`);

          if (deleteFailures.length > 0) {
            throw new Error(formatBatchFailure("delete", deleteFailures));
          }
          if (deleted > 0) {
            this.indexMutated = true;
          }

          if ((pushed > 0 || deleted > 0 || this.indexMutated) && this.index) {
            const writebackStart = Date.now();
            if (pushed > 0 || deleted > 0) {
              this.index.lastPulled = new Date().toISOString();
            }

            const dirtyPartitionKeys = new Set<string>();
            for (const { rel } of toPush) {
              const key = GcsCacheSyncService.partitionKeyFromPath(rel);
              if (key) dirtyPartitionKeys.add(key);
            }
            for (const rel of toDelete) {
              const key = GcsCacheSyncService.partitionKeyFromPath(rel);
              if (key) dirtyPartitionKeys.add(key);
            }

            if (v2CommitSeq !== null) {
              const allPartitions = GcsCacheSyncService.groupEntriesByPartition(
                this.index.entries,
              );
              // Initialize from the full partition list so non-dirty
              // shards are preserved — this.index may be partial when
              // scoped assembly was used (#1913).
              const currentMeta = await this.readPartitionMeta(signal);
              const survivingPartitions = currentMeta?.version === 2
                ? new Set((currentMeta as PartitionMetaV2).partitions)
                : new Set(allPartitions.keys());
              for (const partKey of dirtyPartitionKeys) {
                const entries = allPartitions.get(partKey);
                if (entries && Object.keys(entries).length > 0) {
                  await this.writeShard(partKey, entries, signal);
                  survivingPartitions.add(partKey);
                } else {
                  try {
                    await retryWithBackoff(
                      () =>
                        this.gcs.deleteObject(
                          this.shardKey(partKey),
                          undefined,
                          signal,
                        ),
                      { signal },
                    );
                  } catch {
                    // Non-fatal: deleteObject on non-existent key is a no-op
                  }
                  survivingPartitions.delete(partKey);
                }
              }
              const newMeta: PartitionMetaV2 = {
                version: 2,
                partitions: [...survivingPartitions].sort(),
                commitSeq: v2CommitSeq + 1,
              };
              await this.writePartitionMeta(newMeta, signal);

              await atomicWriteTextFile(
                this.indexPath,
                JSON.stringify(this.index, null, 2),
              );
              this.indexMutated = false;

              try {
                this.dirtyPaths.clear();
                this.bulkInvalidated = false;
                this.dirtyPathsOverflowed = false;
                const sidecar = this.buildV2State({ localDirty: false });
                if (
                  !this.indexIsPartial &&
                  await this.localHasAllRemoteEntries()
                ) {
                  sidecar.commitSeq = newMeta.commitSeq;
                }
                sidecar.remoteIndexGeneration = "";
                await this.writeSyncState(sidecar);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
              tracePhase("pushChanged.v2writeback", writebackStart);
            } else {
              const indexData = new TextEncoder().encode(
                JSON.stringify(this.index),
              );
              const putResult = await retryWithBackoff(
                () => this.gcs.putObject(this.indexKey(), indexData, signal),
                { signal },
              );
              await atomicWriteTextFile(
                this.indexPath,
                JSON.stringify(this.index, null, 2),
              );
              this.indexMutated = false;

              await this.writePartitionedIndex(
                this.index,
                signal,
                dirtyPartitionKeys.size > 0 ? dirtyPartitionKeys : undefined,
              );

              if (
                putResult.generation && putResult.generation !== "0" &&
                await this.localHasAllRemoteEntries()
              ) {
                try {
                  await this.markSynced(putResult.generation);
                } catch {
                  // Non-fatal: sidecar update is opportunistic.
                }
              }
              tracePhase("pushChanged.writeback", writebackStart);
            }
          } else if (v2CommitSeq !== null && this.index) {
            try {
              this.dirtyPaths.clear();
              this.bulkInvalidated = false;
              this.dirtyPathsOverflowed = false;
              const sidecar = this.buildV2State({ localDirty: false });
              if (
                !this.indexIsPartial &&
                await this.localHasAllRemoteEntries()
              ) {
                sidecar.commitSeq = v2CommitSeq;
              }
              sidecar.remoteIndexGeneration = "";
              await this.writeSyncState(sidecar);
            } catch {
              // Non-fatal: sidecar update is opportunistic.
            }
          } else if (indexGeneration && this.index) {
            if (await this.localHasAllRemoteEntries()) {
              try {
                await this.markSynced(indexGeneration);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
            }
          }

          span.setAttribute(Attr.DATASTORE_FILES_PUSHED, pushed);
          span.setAttribute(Attr.DATASTORE_FILES_DELETED, deleted);
          return pushed + deleted;
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

  async preparePush(
    options?: DatastoreSyncOptions,
  ): Promise<PushManifest> {
    return await getTracer().startActiveSpan(
      "gcs-datastore preparePush",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");

          const signal = options?.signal;
          this.bindNamespace(options?.namespace);
          throwIfAborted(signal);
          await this.ensurePreflight(signal);

          const prepareStart = Date.now();

          const prepSyncState = await this.loadSyncState() as
            | DatastoreSyncStateV2
            | null;
          const needsDataKeyMigration = this.namespace != null &&
            !prepSyncState?.dataKeyMigrated;
          const needsControlPlaneMigration = this.namespace != null &&
            !prepSyncState?.controlPlaneKeysMigrated;

          const emptyManifest: InternalPushManifest = {
            newEntries: {},
            deletedKeys: [],
            pushed: 0,
            deleted: 0,
            dirtyPartitionKeys: [],
          };

          const fastStart = Date.now();
          const fastResult = needsDataKeyMigration || needsControlPlaneMigration
            ? null
            : await this.tryFastPushChanged(signal);
          tracePhase(
            "preparePush.fastpath",
            fastStart,
            fastResult !== null ? "hit" : "miss",
          );
          if (fastResult !== null) {
            return emptyManifest as unknown as PushManifest;
          }

          const indexStart = Date.now();
          const prepWillScope = !this.bulkInvalidated &&
            this.dirtyPaths.size > 0;
          const prepAssembled = prepWillScope
            ? await this.assembleDirtyShardsOnly(this.dirtyPaths, signal)
            : await this.assembleIndexFromShards(signal);
          if (prepAssembled) {
            this.index = {
              version: 1,
              lastPulled: new Date().toISOString(),
              entries: prepAssembled.entries,
            };
            this.indexIsPartial = prepWillScope;
            this.scrubIndex();
            tracePhase(
              "preparePush.shardAssembly",
              indexStart,
              prepWillScope ? `scoped=${this.dirtyPaths.size}` : `full`,
            );
          } else {
            await this.pullIndex({ forceRemote: true, signal });
            this.indexIsPartial = false;
            tracePhase("preparePush.pullIndex", indexStart);
          }

          if (needsDataKeyMigration) {
            if (prepAssembled) {
              // v2 shard-first index is in place — data is already
              // namespaced, skip root migration (swamp-club #2091).
              try {
                const sidecar = this.buildV2State({ localDirty: false });
                sidecar.dataKeyMigrated = true;
                await this.writeSyncState(sidecar);
              } catch { /* non-fatal */ }
            } else {
              const { copied, total } = await this.migrateRootDataToNamespace(
                signal,
              );
              const allMigrated = total === 0 || copied === total;
              try {
                const sidecar = this.buildV2State({ localDirty: false });
                if (allMigrated) sidecar.dataKeyMigrated = true;
                await this.writeSyncState(sidecar);
              } catch { /* non-fatal */ }
              if (total > 0) return emptyManifest as unknown as PushManifest;
            }
          }

          if (needsControlPlaneMigration) {
            const { copied, total } = await this
              .migrateRootControlPlaneToNamespace(signal);
            try {
              const sidecar = this.buildV2State({ localDirty: false });
              if (total === 0 || copied === total) {
                sidecar.controlPlaneKeysMigrated = true;
              }
              await this.writeSyncState(sidecar);
            } catch { /* non-fatal */ }
          }

          const nsPrefix = this.namespace ? `${this.namespace}/` : "";
          const toPush: Array<{ rel: string; path: string }> = [];
          const toDelete: string[] = [];
          const useScopedWalk = !this.bulkInvalidated &&
            this.dirtyPaths.size > 0;

          if (useScopedWalk) {
            for (const dirtyPath of this.dirtyPaths) {
              const absPath = join(this.cachePath, dirtyPath);
              const bareDirtyPath = nsPrefix && dirtyPath.startsWith(nsPrefix)
                ? dirtyPath.substring(nsPrefix.length)
                : dirtyPath;
              try {
                const stat = await Deno.stat(absPath);
                if (stat.isFile) {
                  if (
                    !isInternalCacheFile(dirtyPath) &&
                    await this.fileNeedsPush(absPath, bareDirtyPath)
                  ) {
                    toPush.push({ rel: bareDirtyPath, path: absPath });
                  }
                } else if (stat.isDirectory) {
                  const localFilesInDir = new Set<string>();
                  for await (
                    const entry of walk(absPath, { includeDirs: false })
                  ) {
                    const rel = relative(this.cachePath, entry.path);
                    if (isInternalCacheFile(rel)) continue;
                    const bareRel = nsPrefix && rel.startsWith(nsPrefix)
                      ? rel.substring(nsPrefix.length)
                      : rel;
                    localFilesInDir.add(bareRel);
                    if (await this.fileNeedsPush(entry.path, bareRel)) {
                      toPush.push({ rel: bareRel, path: entry.path });
                    }
                  }
                  if (!this.lazyPullActive && this.index) {
                    const prefix = bareDirtyPath.endsWith("/")
                      ? bareDirtyPath
                      : bareDirtyPath + "/";
                    for (const key of Object.keys(this.index.entries)) {
                      if (isInternalCacheFile(key)) continue;
                      if (key.startsWith(prefix) && !localFilesInDir.has(key)) {
                        toDelete.push(key);
                      }
                    }
                  }
                }
              } catch (err) {
                if (!(err instanceof Deno.errors.NotFound)) {
                  continue;
                }
                if (!this.lazyPullActive && this.index) {
                  for (const key of Object.keys(this.index.entries)) {
                    if (isInternalCacheFile(key)) continue;
                    if (
                      key === bareDirtyPath ||
                      key.startsWith(bareDirtyPath + "/")
                    ) {
                      toDelete.push(key);
                    }
                  }
                }
              }
            }
          } else {
            const namespaceDirs = this.namespace
              ? await detectNamespaceDirs(this.cachePath, this.namespace)
              : new Set<string>();
            const localFiles = new Set<string>();
            try {
              for await (
                const entry of walk(this.cachePath, { includeDirs: false })
              ) {
                const rel = relative(this.cachePath, entry.path);
                if (isInternalCacheFile(rel)) continue;
                if (nsPrefix && !rel.startsWith(nsPrefix)) continue;
                if (isInsideNamespaceDir(rel, namespaceDirs)) continue;
                const bareRel = nsPrefix && rel.startsWith(nsPrefix)
                  ? rel.substring(nsPrefix.length)
                  : rel;
                localFiles.add(bareRel);
                if (await this.fileNeedsPush(entry.path, bareRel)) {
                  toPush.push({ rel: bareRel, path: entry.path });
                }
              }
            } catch {
              // Cache directory may not exist yet
            }
            if (
              this.dirtyPathsOverflowed && !this.lazyPullActive && this.index
            ) {
              for (const key of Object.keys(this.index.entries)) {
                if (isInternalCacheFile(key)) continue;
                if (isInsideNamespaceDir(key, namespaceDirs)) continue;
                if (localFiles.has(key)) continue;
                if (this.lazyPullActive && isLazySkippable(key)) continue;
                toDelete.push(key);
              }
            }
          }
          tracePhase(
            "preparePush.walk",
            prepareStart,
            `toPush=${toPush.length} toDelete=${toDelete.length}`,
          );

          const uploadStart = Date.now();
          const newEntries: Record<string, IndexEntry> = {};
          let pushed = 0;
          const failures: Array<{ file: string; error: unknown }> = [];
          for (let i = 0; i < toPush.length; i += this.pushConcurrency) {
            throwIfAborted(signal);
            const batch = toPush.slice(i, i + this.pushConcurrency);
            const results = await Promise.allSettled(
              batch.map(async ({ rel, path: localPath }) => {
                const data = await Deno.readFile(localPath);
                const hashBuffer = await crypto.subtle.digest("SHA-256", data);
                const sha256 = Array.from(new Uint8Array(hashBuffer))
                  .map((b) => b.toString(16).padStart(2, "0"))
                  .join("");
                await retryWithBackoff(
                  () => this.gcs.putObject(this.dataKey(rel), data, signal),
                  { signal },
                );
                const stat = await Deno.stat(localPath);
                newEntries[rel] = {
                  key: rel,
                  size: data.length,
                  lastModified: new Date().toISOString(),
                  localMtime: stat.mtime?.toISOString(),
                  sha256,
                };
              }),
            );
            for (let j = 0; j < results.length; j++) {
              if (results[j].status === "fulfilled") {
                pushed++;
              } else {
                failures.push({
                  file: batch[j].rel,
                  error: (results[j] as PromiseRejectedResult).reason,
                });
              }
            }
          }

          tracePhase("preparePush.upload", uploadStart, `pushed=${pushed}`);

          if (failures.length > 0) {
            throw new Error(formatBatchFailure("push", failures));
          }

          const deleteStart = Date.now();
          const deletedKeys: string[] = [];
          let deleted = 0;
          const deleteFailures: Array<{ file: string; error: unknown }> = [];
          for (let i = 0; i < toDelete.length; i += this.pushConcurrency) {
            throwIfAborted(signal);
            const batch = toDelete.slice(i, i + this.pushConcurrency);
            const results = await Promise.allSettled(
              batch.map((key) =>
                retryWithBackoff(
                  () =>
                    this.gcs.deleteObject(this.dataKey(key), undefined, signal),
                  { signal },
                )
              ),
            );
            for (let j = 0; j < results.length; j++) {
              if (results[j].status === "fulfilled") {
                deleted++;
                deletedKeys.push(batch[j]);
              } else {
                deleteFailures.push({
                  file: batch[j],
                  error: (results[j] as PromiseRejectedResult).reason,
                });
              }
            }
          }
          tracePhase("preparePush.delete", deleteStart, `deleted=${deleted}`);

          if (deleteFailures.length > 0) {
            throw new Error(formatBatchFailure("delete", deleteFailures));
          }

          const dirtyPartitionKeys: string[] = [];
          for (const { rel } of toPush) {
            const key = GcsCacheSyncService.partitionKeyFromPath(rel);
            if (key && !dirtyPartitionKeys.includes(key)) {
              dirtyPartitionKeys.push(key);
            }
          }
          for (const rel of toDelete) {
            const key = GcsCacheSyncService.partitionKeyFromPath(rel);
            if (key && !dirtyPartitionKeys.includes(key)) {
              dirtyPartitionKeys.push(key);
            }
          }

          const manifest: InternalPushManifest = {
            newEntries,
            deletedKeys,
            pushed,
            deleted,
            dirtyPartitionKeys,
          };
          return manifest as unknown as PushManifest;
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

  async commitPush(
    manifest: PushManifest,
    options?: DatastoreSyncOptions,
  ): Promise<number | void> {
    return await getTracer().startActiveSpan(
      "gcs-datastore commitPush",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");

          const commitStart = Date.now();
          const data = manifest as unknown as InternalPushManifest;
          const signal = options?.signal;

          if (data.pushed === 0 && data.deleted === 0) {
            const noopMeta = await this.readPartitionMeta(signal);
            if (noopMeta && noopMeta.version === 2) {
              // v2: the dirty paths were walked and nothing needed pushing,
              // so mark the push as clean. commitSeq is only recorded when
              // the local cache is complete — pull fast path uses the same
              // commitSeq and must not skip unfetched shards (#1225).
              try {
                this.dirtyPaths.clear();
                this.bulkInvalidated = false;
                this.dirtyPathsOverflowed = false;
                const sidecar = this.buildV2State({ localDirty: false });
                if (
                  !this.indexIsPartial && this.index &&
                  await this.localHasAllRemoteEntries()
                ) {
                  sidecar.commitSeq = (noopMeta as PartitionMetaV2).commitSeq;
                }
                sidecar.remoteIndexGeneration = "";
                await this.writeSyncState(sidecar);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
              tracePhase("commitPush", commitStart, "v2noop");
              return 0;
            }

            const indexGeneration = await this.pullIndex({
              forceRemote: true,
              signal,
            });
            if (
              indexGeneration && this.index &&
              indexGeneration !== "0" &&
              await this.localHasAllRemoteEntries()
            ) {
              try {
                await this.markSynced(indexGeneration);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
            }
            tracePhase("commitPush", commitStart, "noop");
            return 0;
          }

          const meta = await this.readPartitionMeta(signal);

          if (meta && meta.version === 2) {
            const result = await this.commitPushShardFirst(
              data,
              meta as PartitionMetaV2,
              signal,
            );
            tracePhase(
              "commitPush",
              commitStart,
              `shard-first changes=${result}`,
            );
            return result;
          }

          console.info(
            "[gcs-sync] Index is using monolithic format. Run 'swamp datastore migrate-index' to enable shard-first commits for improved concurrency.",
          );
          const result = await this.commitPushMonolith(data, signal);
          tracePhase("commitPush", commitStart, `monolith changes=${result}`);
          return result;
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

  private async commitPushShardFirst(
    data: InternalPushManifest,
    v2Meta: PartitionMetaV2,
    signal?: AbortSignal,
  ): Promise<number> {
    const shardStart = Date.now();
    const dirtyKeys = new Set(data.dirtyPartitionKeys);

    for (const rel of Object.keys(data.newEntries)) {
      const key = GcsCacheSyncService.partitionKeyFromPath(rel);
      if (key) dirtyKeys.add(key);
    }
    for (const rel of data.deletedKeys) {
      const key = GcsCacheSyncService.partitionKeyFromPath(rel);
      if (key) dirtyKeys.add(key);
    }

    const survivingPartitions = new Set(v2Meta.partitions);
    for (const partKey of dirtyKeys) {
      const existing = await this.readShard(partKey, signal) ?? {};

      for (const [rel, entry] of Object.entries(data.newEntries)) {
        const k = GcsCacheSyncService.partitionKeyFromPath(rel);
        if (k === partKey) existing[rel] = entry;
      }

      for (const rel of data.deletedKeys) {
        const k = GcsCacheSyncService.partitionKeyFromPath(rel);
        if (k === partKey) delete existing[rel];
      }

      if (Object.keys(existing).length === 0) {
        try {
          await retryWithBackoff(
            () =>
              this.gcs.deleteObject(
                this.shardKey(partKey),
                undefined,
                signal,
              ),
            { signal },
          );
        } catch {
          // DeleteObject on non-existent key is a no-op in GCS
        }
        survivingPartitions.delete(partKey);
      } else {
        await this.writeShard(partKey, existing, signal);
        survivingPartitions.add(partKey);
      }
    }

    const newMeta: PartitionMetaV2 = {
      version: 2,
      partitions: [...survivingPartitions].sort(),
      commitSeq: v2Meta.commitSeq + 1,
    };
    await this.writePartitionMeta(newMeta, signal);
    tracePhase("commitPush.shards", shardStart, `dirty=${dirtyKeys.size}`);

    // Update the local index cache from the in-memory state so
    // pullIndex's TTL cache and the fast-path sidecar stay coherent.
    // The monolithic remote upload is intentionally skipped — shards
    // are the source of truth in v2 and the monolith re-upload was
    // pure overhead (swamp-club#1034).
    const localStart = Date.now();
    if (!this.index) {
      this.index = {
        version: 1,
        lastPulled: new Date().toISOString(),
        entries: {},
      };
    }
    for (const [rel, entry] of Object.entries(data.newEntries)) {
      this.index.entries[rel] = entry;
    }
    for (const key of data.deletedKeys) {
      delete this.index.entries[key];
    }
    this.index.lastPulled = new Date().toISOString();
    try {
      await atomicWriteTextFile(
        this.indexPath,
        JSON.stringify(this.index, null, 2),
      );
    } catch {
      // Non-fatal: local cache is rebuilt on next pull.
    }
    this.indexMutated = false;
    tracePhase("commitPush.localIndex", localStart);

    try {
      this.dirtyPaths.clear();
      this.bulkInvalidated = false;
      this.dirtyPathsOverflowed = false;
      const sidecar = this.buildV2State({ localDirty: false });
      // Only record commitSeq when the index is complete (not a scoped
      // assembly) AND local cache has all remote entries — pull fast
      // path uses commitSeq and must not skip unfetched shards (#1225).
      if (
        !this.indexIsPartial &&
        await this.localHasAllRemoteEntries()
      ) {
        sidecar.commitSeq = newMeta.commitSeq;
      }
      sidecar.remoteIndexGeneration = "";
      await this.writeSyncState(sidecar);
    } catch {
      // Non-fatal: sidecar update is opportunistic.
    }

    return data.pushed + data.deleted;
  }

  private async commitPushMonolith(
    data: InternalPushManifest,
    signal?: AbortSignal,
  ): Promise<number> {
    const monolithStart = Date.now();
    await this.pullIndex({ forceRemote: true, signal });

    if (this.index) {
      for (const [rel, entry] of Object.entries(data.newEntries)) {
        this.index.entries[rel] = entry;
      }
      for (const key of data.deletedKeys) {
        delete this.index.entries[key];
      }
      this.index.lastPulled = new Date().toISOString();

      const indexData = new TextEncoder().encode(JSON.stringify(this.index));
      const putResult = await retryWithBackoff(
        () => this.gcs.putObject(this.indexKey(), indexData, signal),
        { signal },
      );
      await atomicWriteTextFile(
        this.indexPath,
        JSON.stringify(this.index, null, 2),
      );
      this.indexMutated = false;

      const dirtyKeys = data.dirtyPartitionKeys.length > 0
        ? new Set(data.dirtyPartitionKeys)
        : undefined;
      await this.writePartitionedIndex(this.index, signal, dirtyKeys);
      tracePhase("commitPushMonolith.writeback", monolithStart);

      if (
        putResult.generation && putResult.generation !== "0" &&
        await this.localHasAllRemoteEntries()
      ) {
        try {
          await this.markSynced(putResult.generation);
        } catch {
          // Non-fatal: sidecar update is opportunistic.
        }
      }
    }

    return data.pushed + data.deleted;
  }

  /**
   * Returns true iff every entry in the in-memory remote index has a
   * local file with matching size. Used by `pushChanged`'s no-writeback
   * branch to distinguish "local matches remote" from "local is missing
   * remote files" — the per-local-file walk above can't tell them
   * apart on its own.
   */
  private async localHasAllRemoteEntries(): Promise<boolean> {
    if (!this.index) return false;
    if (this.lazyPullActive) return false;
    for (const [rel, entry] of Object.entries(this.index.entries)) {
      if (isInternalCacheFile(rel)) continue;
      const localPath = assertSafePath(this.cachePath, this.localRelPath(rel));
      try {
        const stat = await Deno.stat(localPath);
        if (stat.size !== entry.size) {
          if (traceEnabled()) {
            console.debug(
              `[gcs-sync] localHasAllRemoteEntries: size mismatch for ${rel} (local=${stat.size}, index=${entry.size})`,
            );
          }
          return false;
        }
      } catch {
        if (traceEnabled()) {
          console.debug(
            `[gcs-sync] localHasAllRemoteEntries: missing locally: ${rel}`,
          );
        }
        return false;
      }
    }
    return true;
  }

  private async fileNeedsPush(
    absPath: string,
    rel: string,
  ): Promise<boolean> {
    const stat = await Deno.stat(absPath);
    const existing = this.index?.entries[rel];
    if (!existing) return true;

    if (existing.size !== stat.size) return true;

    // Same size + exact mtime match — usually safe to skip. The
    // coarse-granularity concern (same-second writes on Linux tmpfs)
    // only applies to recently-written files; for files whose mtime
    // is >1 s old, an exact match is a reliable skip signal.
    if (
      existing.localMtime && stat.mtime &&
      existing.localMtime === stat.mtime.toISOString()
    ) {
      if (
        existing.sha256 &&
        Date.now() - stat.mtime.getTime() < 1000
      ) {
        const data = await Deno.readFile(absPath);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const localHash = Array.from(new Uint8Array(hashBuffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        return localHash !== existing.sha256;
      }
      return false;
    }

    if (!stat.mtime || existing.localMtime === undefined) {
      if (!existing.sha256) return false;
    }

    if (existing.sha256) {
      const data = await Deno.readFile(absPath);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const localHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return localHash !== existing.sha256;
    }

    return true;
  }

  /**
   * Derives a partition key from a relative path. Covers all datastore
   * subdirectories:
   *
   * Per-model (data/, outputs/, definitions-evaluated/):
   *   `{subdir}--{type segments}--{modelId}`
   *
   * Per-workflow (workflow-runs/):
   *   `{subdir}--{workflowId}`
   *
   * Single-shard (workflows-evaluated, auto-definitions, audit, telemetry, logs, files):
   *   `{subdir}`
   *
   * Unknown/legacy prefixes (bundles, vault-bundles, report-bundles, etc.):
   *   `{subdir}`
   *
   * Root-level files (single segment, no subdirectory):
   *   `_root`
   */
  static partitionKeyFromPath(rel: string): string | undefined {
    const segments = rel.split("/");
    if (segments.length < 2) {
      return segments.length === 1 && segments[0] !== "" ? "_root" : undefined;
    }
    const subdir = segments[0];

    switch (subdir) {
      case "data":
      case "outputs":
      case "definitions-evaluated": {
        if (segments.length < 4) return undefined;
        const prefixEnd = segments.length >= 6
          ? segments.length - 3
          : segments.length - 1;
        return segments.slice(0, prefixEnd).join("--");
      }
      case "workflow-runs": {
        if (segments.length < 3) return undefined;
        return `${subdir}--${segments[1]}`;
      }
      case "workflows-evaluated":
      case "auto-definitions":
      case "audit":
      case "telemetry":
      case "logs":
      case "files":
      case "config":
        return subdir;
      default:
        return subdir;
    }
  }

  private static groupEntriesByPartition(
    entries: Record<string, IndexEntry>,
  ): Map<string, Record<string, IndexEntry>> {
    const partitions = new Map<string, Record<string, IndexEntry>>();
    const dropped: string[] = [];

    for (const [rel, entry] of Object.entries(entries)) {
      const key = GcsCacheSyncService.partitionKeyFromPath(rel);
      if (!key) {
        dropped.push(rel);
        continue;
      }

      let bucket = partitions.get(key);
      if (!bucket) {
        bucket = {};
        partitions.set(key, bucket);
      }
      bucket[rel] = entry;
    }

    if (dropped.length > 0) {
      console.warn(
        `[gcs-sync] ${dropped.length} index entry/entries could not be partitioned and were skipped: ${
          dropped.slice(0, 5).join(", ")
        }${dropped.length > 5 ? ` (and ${dropped.length - 5} more)` : ""}`,
      );
    }

    return partitions;
  }

  /** Derives partition keys for all per-model subdirectories from a SyncModelRef. */
  private static partitionKeysFromModel(
    modelType: string,
    modelId: string,
  ): string[] {
    const slug = modelType.replace(/\//g, "--");
    return [
      `data--${slug}--${modelId}`,
      `outputs--${slug}--${modelId}`,
      `definitions-evaluated--${slug}--${modelId}`,
    ];
  }

  /**
   * Writes partitioned index files to GCS alongside the monolithic index.
   * Used by the legacy pushChanged path. Non-fatal -- errors are swallowed
   * because the monolith is still the source of truth in this code path.
   */
  private async writePartitionedIndex(
    index: DatastoreIndex,
    signal?: AbortSignal,
    dirtyKeys?: Set<string>,
  ): Promise<void> {
    const partitions = GcsCacheSyncService.groupEntriesByPartition(
      index.entries,
    );
    if (partitions.size === 0) return;

    const partitionKeys: string[] = [];
    const writes: Promise<void>[] = [];

    for (const [key, entries] of partitions) {
      partitionKeys.push(key);
      if (dirtyKeys && !dirtyKeys.has(key)) continue;
      const partition: PartitionIndex = { version: 1, entries };
      const data = new TextEncoder().encode(JSON.stringify(partition));
      writes.push(
        retryWithBackoff(
          () => this.gcs.putObject(this.shardKey(key), data, signal),
          { signal },
        ).then(() => {}).catch(() => {
          // Non-fatal: partition files are an optimization in this path.
        }),
      );
    }

    // Preserve v2 meta if it already exists (migration already happened).
    // Only write v1 meta when no v2 is present — avoids demoting a
    // migrated bucket back to v1 on a legacy pushChanged call.
    writes.push(
      (async () => {
        try {
          const existing = await this.readPartitionMeta(signal);
          if (existing && existing.version === 2) return;
          const meta: PartitionMetaV1 = {
            version: 1,
            partitions: partitionKeys,
          };
          const metaData = new TextEncoder().encode(
            JSON.stringify(meta),
          );
          await retryWithBackoff(
            () => this.gcs.putObject(this.metaKey(), metaData, signal),
            { signal },
          );
        } catch {
          // Non-fatal: _meta.json is advisory in this path.
        }
      })(),
    );

    await Promise.allSettled(writes);
  }

  /**
   * Reads partition files for specific models across all per-model
   * subdirectories (data/, outputs/, definitions-evaluated/). Returns
   * merged entries or null if any partition is missing (triggers
   * monolithic fallback). Missing shards for outputs/ and
   * definitions-evaluated/ are tolerated -- only the data/ shard is
   * required for fallback decisions.
   */
  private async pullPartitionedIndex(
    models: ReadonlyArray<{ modelType: string; modelId: string }>,
    signal?: AbortSignal,
  ): Promise<Record<string, IndexEntry> | null> {
    const merged: Record<string, IndexEntry> = {};

    for (const model of models) {
      const keys = GcsCacheSyncService.partitionKeysFromModel(
        model.modelType,
        model.modelId,
      );
      for (const key of keys) {
        const entries = await this.readShard(key, signal);
        if (entries === null && key.startsWith("data--")) {
          return null;
        }
        if (entries) {
          for (const [rel, entry] of Object.entries(entries)) {
            merged[rel] = entry;
          }
        }
      }
    }

    return merged;
  }

  capabilities(): SyncCapabilities {
    return {
      scopedSync: true,
      lazyHydration: true,
      namespacedSync: true,
      twoPhaseSync: true,
      controlPlane: true,
      configRefresh: true,
    };
  }

  controlPlaneStore(): ControlPlaneStore {
    const ensureBound = () => {
      if (!this.namespaceBound) this.bindNamespace(undefined);
    };
    return {
      put: async (key: string, data: Uint8Array): Promise<void> => {
        ensureBound();
        await this.ensurePreflight();
        await retryWithBackoff(
          () => this.gcs.putObject(this.controlKey(key), data),
        );
      },
      get: async (key: string): Promise<Uint8Array | null> => {
        ensureBound();
        await this.ensurePreflight();
        try {
          const { data } = await retryWithBackoff(
            () => this.gcs.getObject(this.controlKey(key)),
          );
          return data;
        } catch (error) {
          if (error instanceof NotFoundError) {
            return null;
          }
          throw error;
        }
      },
      delete: async (key: string): Promise<void> => {
        ensureBound();
        await this.ensurePreflight();
        await retryWithBackoff(
          () => this.gcs.deleteObject(this.controlKey(key)),
        );
      },
      list: async (prefix: string): Promise<string[]> => {
        ensureBound();
        await this.ensurePreflight();
        const cpPrefix = this.controlPrefixPath();
        const entries = await retryWithBackoff(
          () => this.gcs.listAllObjects(cpPrefix + prefix),
        );
        return entries.map((e) => e.key.slice(cpPrefix.length));
      },
      putIfAbsent: async (
        key: string,
        data: Uint8Array,
      ): Promise<boolean> => {
        ensureBound();
        await this.ensurePreflight();
        const result = await retryWithBackoff(
          () => this.gcs.putObjectConditional(this.controlKey(key), data),
        );
        return result !== null;
      },
    };
  }

  async hydrateFile(
    relPath: string,
    options?: DatastoreSyncOptions,
  ): Promise<boolean> {
    return await getTracer().startActiveSpan(
      "gcs-datastore hydrateFile",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_FILE, relPath);

          await this.pullFile(relPath, options?.signal);
          return true;
        } catch (error) {
          if (error instanceof NotFoundError) {
            return false;
          }
          span.setStatus({
            code: SpanStatusCode.ERROR,
            message: error instanceof Error ? error.message : String(error),
          });
          span.recordException(
            error instanceof Error ? error : new Error(String(error)),
          );
          throw error;
        } finally {
          span.end();
        }
      },
    );
  }

  async exportCatalog(
    namespace: string,
    rows: CatalogExportRow[],
    signal?: AbortSignal,
  ): Promise<void> {
    return await getTracer().startActiveSpan(
      "gcs-datastore exportCatalog",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, namespace);
          span.setAttribute(Attr.DATASTORE_ROWS, rows.length);

          const key = `${namespace}/.catalog-export.json`;
          const data = new TextEncoder().encode(JSON.stringify(rows));
          const hashBuffer = await crypto.subtle.digest("SHA-256", data);
          const hash = Array.from(new Uint8Array(hashBuffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          await this.loadSyncState();
          if (this.lastCatalogHash === hash) return;
          await retryWithBackoff(
            () => this.gcs.putObject(key, data, signal),
            { signal },
          );
          this.lastCatalogHash = hash;
          await this.writeSyncState(this.buildV2State());
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

  async pullForeignCatalogs(
    namespaces: string[],
    signal?: AbortSignal,
  ): Promise<CatalogExportEntry[]> {
    return await getTracer().startActiveSpan(
      "gcs-datastore pullForeignCatalogs",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACES, namespaces.length);

          const results: CatalogExportEntry[] = [];
          for (const ns of namespaces) {
            const key = `${ns}/.catalog-export.json`;
            try {
              const { data } = await this.gcs.getObject(key, signal);
              const text = new TextDecoder().decode(data);
              const rows = JSON.parse(text) as CatalogExportRow[];
              if (!Array.isArray(rows)) continue;
              results.push({ namespace: ns, rows });
            } catch {
              // Missing or malformed — skip silently
            }
          }
          return results;
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

  async repairNamespaceContamination(
    options?: RepairNamespaceContaminationOptions,
  ): Promise<NamespaceContaminationSummary> {
    return await getTracer().startActiveSpan(
      "gcs-datastore repairContamination",
      async (span) => {
        try {
          const dryRun = options?.dryRun ?? true;
          span.setAttribute(Attr.DATASTORE_DRY_RUN, dryRun);
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");

          const signal = options?.signal;

          this.bindNamespace(options?.namespace);
          if (!this.namespace) {
            return {
              foreignNamespaces: [],
              totalForeignObjects: 0,
              deleted: 0,
            };
          }

          const nsPrefix = `${this.namespace}/`;

          const [nsListing, fullListing] = await Promise.all([
            retryWithBackoff(
              () => this.gcs.listAllObjects(nsPrefix, signal),
              { signal },
            ),
            retryWithBackoff(
              () => this.gcs.listAllObjects(undefined, signal),
              { signal },
            ),
          ]);

          const knownNamespaces = new Set<string>();
          for (const entry of nsListing) {
            const rel = entry.key.substring(nsPrefix.length);
            if (rel.endsWith("/.namespace.json")) {
              const ns = rel.substring(
                0,
                rel.length - "/.namespace.json".length,
              );
              if (ns && !ns.includes("/")) knownNamespaces.add(ns);
            }
          }
          for (const entry of fullListing) {
            if (entry.key.endsWith("/.namespace.json")) {
              const ns = entry.key.substring(
                0,
                entry.key.length - "/.namespace.json".length,
              );
              if (ns && ns !== this.namespace) knownNamespaces.add(ns);
            }
          }

          const foreignByNs = new Map<string, string[]>();
          for (const entry of nsListing) {
            const rel = entry.key.substring(nsPrefix.length);
            const slash = rel.indexOf("/");
            if (slash === -1) continue;
            const firstSeg = rel.substring(0, slash);
            if (knownNamespaces.has(firstSeg)) {
              const existing = foreignByNs.get(firstSeg);
              if (existing) {
                existing.push(entry.key);
              } else {
                foreignByNs.set(firstSeg, [entry.key]);
              }
            }
          }

          const foreignNamespaces: Array<
            { namespace: string; objectCount: number }
          > = [];
          const allForeignKeys: string[] = [];
          for (const [ns, keys] of foreignByNs) {
            foreignNamespaces.push({ namespace: ns, objectCount: keys.length });
            allForeignKeys.push(...keys);
          }
          const totalForeignObjects = allForeignKeys.length;

          if (dryRun || totalForeignObjects === 0) {
            return { foreignNamespaces, totalForeignObjects, deleted: 0 };
          }

          let deleted = 0;
          for (
            let i = 0;
            i < allForeignKeys.length;
            i += this.pushConcurrency
          ) {
            throwIfAborted(signal);
            const batch = allForeignKeys.slice(i, i + this.pushConcurrency);
            const results = await Promise.allSettled(
              batch.map((key) =>
                retryWithBackoff(
                  () => this.gcs.deleteObject(key, undefined, signal),
                  { signal },
                )
              ),
            );
            for (const result of results) {
              if (result.status === "fulfilled") deleted++;
            }
          }

          try {
            await retryWithBackoff(
              () => this.gcs.deleteObject(this.indexKey(), undefined, signal),
              { signal },
            );
          } catch { /* may not exist */ }
          try {
            await retryWithBackoff(
              () => this.gcs.deleteObject(this.metaKey(), undefined, signal),
              { signal },
            );
          } catch { /* may not exist */ }

          this.index = null;
          await this.pullIndex({ forceRemote: true, signal });

          return { foreignNamespaces, totalForeignObjects, deleted };
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

  async fetchForeignContent(
    namespace: string,
    relPath: string,
    signal?: AbortSignal,
  ): Promise<Uint8Array | null> {
    return await getTracer().startActiveSpan(
      "gcs-datastore fetchForeignContent",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, namespace);
          span.setAttribute(Attr.DATASTORE_FILE, relPath);

          if (
            relPath.startsWith("/") || relPath.startsWith("\\") ||
            relPath.split("/").some((seg) => seg === "..")
          ) {
            throw new Error(`Path traversal rejected: ${relPath}`);
          }
          const key = `${namespace}/${relPath}`;
          try {
            const { data } = await this.gcs.getObject(key, signal);
            return data;
          } catch (error) {
            if (error instanceof NotFoundError) {
              return null;
            }
            throw error;
          }
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
