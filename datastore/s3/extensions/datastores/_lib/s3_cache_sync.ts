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
 * S3 cache sync service for the S3 datastore.
 *
 * Maintains a local cache directory and syncs with S3:
 * - On startup: pulls metadata index (lightweight manifest)
 * - On read (cache miss): fetches specific file from S3
 * - On write: writes locally first, then pushes to S3 async
 * - `sync()`: full bidirectional sync
 */

import { dirname, join, normalize, relative } from "jsr:@std/path@1";
import { ensureDir, walk } from "jsr:@std/fs@1";
import { SpanStatusCode, trace } from "npm:@opentelemetry/api@1.9.0";
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
import { type S3Client, S3OperationError } from "./s3_client.ts";
import { atomicWriteTextFile } from "./atomic_write.ts";
import { Attr, getTracer } from "./tracing.ts";

/**
 * Validates that a relative path resolves within the cache directory.
 * Prevents path traversal attacks from malicious S3 keys.
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
 *   last-verified remote index ETag and the local-dirty flag. Never
 *   uploaded: its contents are per-machine state.
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
 *   deletes these directly via S3 PutObject/DeleteObject; they must
 *   not flow through cache sync because (a) the bucket listing in
 *   `discoverIndexFromBucket` would otherwise capture transient
 *   `.lock` files into the synthesized index, leaving the index
 *   referencing objects the lock subsystem deletes on release, and
 *   (b) a fresh reader hydrating from that stale index would 404 on
 *   the missing `.lock` and abort `datastore setup`. Manifests in CI
 *   as the reader's `datastore sync --pull` reporting "Current
 *   datastore type: filesystem" because setup fails to persist the
 *   datastore config to `.swamp.yaml`.
 *
 * Uses basename matching for the catalog and `.lock` patterns so the
 * filter is robust to any future change in the data tier subdirectory
 * name.
 *
 * Exported for unit tests; not part of the public extension API.
 */
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
 * Whether a bare index-relative path falls under one of the `subdirs`
 * requested by a scoped `pullChanged`. Matches on a `/` boundary so
 * `data/swamp/grant` does not match `data/swamp/grants/...`.
 */
function isInSubdirs(rel: string, subdirs: readonly string[]): boolean {
  return subdirs.some((d) => rel.startsWith(d + "/"));
}

/**
 * Strips S3's surrounding double-quotes from an ETag so two ETags from
 * different SDK paths (HeadObject vs. PutObject) can be compared byte-
 * for-byte. `undefined` passes through.
 */
function normalizeETag(etag: string | undefined): string | undefined {
  if (!etag) return undefined;
  const m = etag.match(/^"(.*)"$/);
  return m ? m[1] : etag;
}

/**
 * Returns true when an ETag looks like a multipart-upload ETag (ends
 * with `-<partCount>`). Multipart ETags are a hash of the per-part
 * hashes, NOT the content hash, so they cannot be used as a content
 * fingerprint — any fast-path comparison must bail out and fall
 * through to a full walk. The current index payload is well under the
 * 5 MB multipart threshold, but this guard future-proofs against the
 * index outgrowing the single-part path.
 */
function isMultipartETag(etag: string | undefined): boolean {
  const n = normalizeETag(etag);
  if (!n) return true;
  return /-\d+$/.test(n);
}

/**
 * Rejects with `AbortError` if the signal is already aborted. Used at
 * phase boundaries so abort propagation doesn't have to ride on a
 * pending S3 call — the next boundary catches it first.
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

/**
 * Emit a trace-level timing line when `SWAMP_S3_SYNC_TRACE` is truthy.
 * Two timestamps per phase, never per-entry — matches the instrumentation
 * contract in the DEF-2 plan.
 *
 * Gated on env-var presence so tests and production stay silent by
 * default; a reporter debugging a slow sync can opt in with
 * `SWAMP_S3_SYNC_TRACE=1 swamp datastore sync`.
 */
function traceEnabled(): boolean {
  try {
    const v = Deno.env.get("SWAMP_S3_SYNC_TRACE");
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
  console.debug(`[s3-sync] ${phase} ${elapsedMs}ms${suffix}`);
}

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
 *
 * Only meaningful when a namespace is bound — solo mode (no namespace)
 * returns an empty set because there is no risk of cross-namespace
 * pollution.
 *
 * The cost is one readDir on the cache root plus one stat per child
 * directory, which is negligible compared to the full walk that follows.
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

/** Metadata index entry for a file in S3. */
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

/** Metadata index tracking all files in the S3 datastore. */
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

/** Push queue entry for files pending upload to S3. */
interface PushQueueEntry {
  relativePath: string;
  addedAt: string;
}

/** Push queue tracking files pending upload. */
interface PushQueue {
  entries: PushQueueEntry[];
}

/** TTL in ms for using the local index cache instead of fetching from S3. */
const INDEX_CACHE_TTL_MS = 60_000;

/** Default concurrent S3 downloads. */
const DEFAULT_PULL_CONCURRENCY = 50;
/** Default concurrent S3 uploads. */
const DEFAULT_PUSH_CONCURRENCY = 25;

/** When the dirty-path set exceeds this cap, fall back to a full walk. */
const DIRTY_PATHS_CAP = 2000;

/** Retry budget for single-object S3 operations in the sync pipeline. */
const RETRY_MAX_ATTEMPTS = 3;
/** Base delay between retry attempts (ms). Each retry multiplies by 3. */
const RETRY_BASE_DELAY_MS = 500;
/** Jitter fraction applied to each backoff delay (±25%). */
const RETRY_JITTER_FRACTION = 0.25;

/**
 * Jittered backoff between compare-and-swap attempts on index objects.
 * Short on purpose: a lost race only means another writer just committed,
 * so re-reading right away usually wins.
 */
function casBackoffMs(attempt: number): number {
  return Math.floor(Math.random() * Math.min(1000, 25 * 2 ** attempt));
}

/**
 * Returns true when an error is a transient condition that should be
 * retried: request timeouts, 5xx service errors, 429 throttling, and
 * transport-level failures (connection reset, DNS, TLS handshake).
 *
 * Explicitly NOT retryable: 4xx other than 429 (bad request, auth
 * failure), PreconditionFailed (conditional write lost the race —
 * retrying would give the same answer), NoSuchBucket (config error),
 * any AbortError (caller explicitly cancelled).
 *
 * The `status == null` branch matters more than it looks. The AWS SDK
 * surfaces connection-level failures (e.g., ECONNRESET, DNS lookup
 * failure, TLS close_notify) with `name: "Http"` and no
 * `$metadata.httpStatusCode` — verified against @aws-sdk/client-s3
 * 3.1024.0. Without this branch, real network blips would not be
 * retried, defeating the whole DEF-2 premise. Auth and config errors
 * always carry a 4xx status, so treating a missing status as transient
 * is safe.
 *
 * Exported for unit tests; not part of the public extension API.
 */
export function isRetryableError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  if (err.name === "AbortError") return false;
  if (err.name === "TimeoutError") return true;
  if (err instanceof S3OperationError) {
    const status = err.httpStatusCode;
    if (status === 429) return true;
    // 409 ConditionalRequestConflict: concurrent conditional PUT race —
    // retryable after re-reading current state (swamp-club#1747).
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
 * Build a batch-failure message that surfaces the actual reasons
 * things failed, not just filenames. The first 3 underlying errors are
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
  const preposition = op === "push" ? "to" : "from";
  return `Failed to ${op} ${failures.length} file(s) ${preposition} S3: ${
    files.join(", ")
  }\n${preview}${more}`;
}

/**
 * Fast-path sidecar persisted alongside the cache. Records the last
 * remote `.datastore-index.json` ETag we verified our local cache
 * against, the timestamp of that verification, and whether the local
 * cache has been written to since. The next `pullChanged` /
 * `pushChanged` HEADs the remote index and short-circuits if the
 * recorded ETag still matches and the local view hasn't drifted —
 * skipping the 1.37 MB index GET and the multi-thousand-stat walk
 * that DEF-2 traced as the bottleneck on a zero-diff sync.
 *
 * Schema is versioned so old sidecars can be ignored on upgrade
 * without a migration step (any parse failure or version mismatch
 * falls through to the slow path and rewrites the sidecar).
 */
interface DatastoreSyncStateV1 {
  version: 1;
  remoteIndexETag: string;
  lastVerifiedAt: string;
  localDirty: boolean;
}

interface DatastoreSyncStateV2 {
  version: 2;
  remoteIndexETag: string;
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

/** S3 cache sync service. */
export class S3CacheSyncService implements DatastoreSyncService {
  private readonly s3: S3Client;
  private readonly cachePath: string;
  private readonly indexPath: string;
  private readonly pushQueuePath: string;
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
  private casUnsupported = false;
  private static readonly SHARD_CAS_ATTEMPTS = 8;
  // Generous: meta is tiny, and exhausting it after shards committed
  // leaves a new partition unlisted until the next push.
  private static readonly META_CAS_ATTEMPTS = 20;

  constructor(
    s3: S3Client,
    cachePath: string,
    options?: {
      pullConcurrency?: number;
      pushConcurrency?: number;
    },
  ) {
    this.s3 = s3;
    this.cachePath = cachePath;
    this.indexPath = join(cachePath, ".datastore-index.json");
    this.pushQueuePath = join(cachePath, ".push-queue.json");
    this.syncStatePath = join(cachePath, SYNC_STATE_FILE);
    this.pullConcurrency = options?.pullConcurrency ?? DEFAULT_PULL_CONCURRENCY;
    this.pushConcurrency = options?.pushConcurrency ?? DEFAULT_PUSH_CONCURRENCY;
  }

  /**
   * Bind the namespace from the first pullChanged/pushChanged call.
   * Asserts immutability: a sync service instance operates on one
   * namespace for its entire lifetime (core creates one instance per
   * command lifecycle). Foreign methods bypass this entirely.
   */
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
    await this.s3.preflightCredentials(signal);
    this.preflightDone = true;
  }

  /**
   * Returns the remote index key scoped to the bound namespace.
   * Solo mode (no namespace): `.datastore-index.json`
   * Namespaced: `{namespace}/.datastore-index.json`
   */
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
   * Server-side migration: copies objects from root-level keys to
   * {namespace}/ keys using S3 CopyObject (no download/upload). Lists
   * all root-level data objects, copies each to the namespaced key,
   * rebuilds the index, and deletes the originals.
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

  private async migrateRootDataToNamespace(
    signal?: AbortSignal,
  ): Promise<{ copied: number; total: number }> {
    if (!this.namespace) return { copied: 0, total: 0 };

    // Check whether this repo ever had un-namespaced data by looking
    // at the namespaced index. If it already exists, this is a solo→ns
    // transition and root data may belong to us. If it doesn't exist
    // (fresh namespace setup via --namespace), root data belongs to
    // another tenant — skip migration entirely.
    let hasNamespacedIndex = false;
    try {
      const head = await this.s3.headObject(this.indexKey(), signal);
      hasNamespacedIndex = head.exists;
    } catch {
      // Can't check — fall through to safe path
    }
    if (!hasNamespacedIndex) {
      // No namespaced index → this repo was set up with a namespace
      // from the start. Any root-level data belongs to another repo.
      return { copied: 0, total: 0 };
    }

    // Read the ROOT index (pre-namespace) to know which objects belong
    // to this repo. Without this, a shared bucket without client-level
    // prefix would migrate another repo's data.
    let knownKeys = new Set<string>();
    try {
      const { data } = await this.s3.getObject(".datastore-index.json", signal);
      const rootIndex = JSON.parse(
        new TextDecoder().decode(data),
      ) as DatastoreIndex;
      knownKeys = new Set(Object.keys(rootIndex.entries ?? {}));
    } catch {
      // No root index — first-time namespace setup or bucket was always
      // namespaced. Fall through with empty set (knownKeys.size === 0
      // skips the filter, allowing all root objects to migrate).
    }
    const listing = await this.s3.listAllObjects(undefined, signal);
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
      if (!S3CacheSyncService.DATA_SUBDIRS.has(firstSeg)) return false;
      if (knownKeys.size > 0 && !knownKeys.has(entry.key)) return false;
      return true;
    });
    if (foreignNamespaces.size > 0) {
      console.warn(
        `[s3-sync] Excluded ${foreignNamespaces.size} foreign namespace(s) from migration: ${
          [...foreignNamespaces].join(", ")
        }`,
      );
    }
    if (toMigrate.length === 0) return { copied: 0, total: 0 };

    console.info(
      `[s3-sync] Migrating ${toMigrate.length} object(s) to namespace "${this.namespace}" (server-side copy, no re-upload)...`,
    );

    const copiedKeys: Set<string> = new Set();
    for (let i = 0; i < toMigrate.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = toMigrate.slice(i, i + this.pushConcurrency);
      const results = await Promise.allSettled(
        batch.map((entry) =>
          retryWithBackoff(
            () =>
              this.s3.copyObject(entry.key, this.dataKey(entry.key), signal),
            { signal },
          ).then(() => entry.key)
        ),
      );
      for (const result of results) {
        if (result.status === "fulfilled") copiedKeys.add(result.value);
      }
      if (toMigrate.length > 50) {
        console.info(
          `[s3-sync]   ... ${copiedKeys.size}/${toMigrate.length} copied`,
        );
      }
    }

    if (copiedKeys.size === 0) return { copied: 0, total: toMigrate.length };

    if (copiedKeys.size < toMigrate.length) {
      console.warn(
        `[s3-sync] ${
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
          lastModified: (entry.lastModified ?? new Date()).toISOString(),
        };
      }
      this.index.lastPulled = new Date().toISOString();
      const indexData = new TextEncoder().encode(JSON.stringify(this.index));
      await retryWithBackoff(
        () => this.s3.putObject(this.indexKey(), indexData, signal),
        { signal },
      );
      await atomicWriteTextFile(
        this.indexPath,
        JSON.stringify(this.index, null, 2),
      );
      try {
        await this.s3.deleteObject(this.metaKey(), signal);
      } catch { /* may not exist */ }
    }

    const toDeleteBatch = toMigrate.filter((e) => copiedKeys.has(e.key));
    for (let i = 0; i < toDeleteBatch.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = toDeleteBatch.slice(i, i + this.pushConcurrency);
      await Promise.allSettled(
        batch.map((entry) =>
          retryWithBackoff(
            () => this.s3.deleteObject(entry.key, signal),
            { signal },
          )
        ),
      );
    }

    console.info(
      `[s3-sync] Migration complete: ${copiedKeys.size}/${toMigrate.length} object(s) moved to "${this.namespace}/"`,
    );
    return { copied: copiedKeys.size, total: toMigrate.length };
  }

  /**
   * Server-side migration: copies root-level _control/ keys to
   * {namespace}/_control/ via S3 CopyObject. Unlike data-key migration,
   * control-plane keys are not tracked in the datastore index, so no
   * index update is needed.
   */
  private async migrateRootControlPlaneToNamespace(
    signal?: AbortSignal,
  ): Promise<{ copied: number; total: number }> {
    if (!this.namespace) return { copied: 0, total: 0 };

    // Only migrate when a namespaced index already exists — this proves
    // the repo was previously solo-mode. Without this guard, root-level
    // _control/ keys on a shared bucket could belong to another tenant.
    let hasNamespacedIndex = false;
    try {
      const head = await this.s3.headObject(this.indexKey(), signal);
      hasNamespacedIndex = head.exists;
    } catch {
      // Can't check — skip migration
    }
    if (!hasNamespacedIndex) return { copied: 0, total: 0 };

    const rootControlPrefix = "_control/";
    let listing: Array<{ key: string; size: number; lastModified?: Date }>;
    try {
      listing = await retryWithBackoff(
        () => this.s3.listAllObjects(rootControlPrefix, signal),
        { signal },
      );
    } catch {
      return { copied: 0, total: 0 };
    }

    if (listing.length === 0) return { copied: 0, total: 0 };

    console.info(
      `[s3-sync] Migrating ${listing.length} control-plane key(s) to namespace "${this.namespace}" (server-side copy)...`,
    );

    const copiedKeys: Set<string> = new Set();
    for (let i = 0; i < listing.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = listing.slice(i, i + this.pushConcurrency);
      const results = await Promise.allSettled(
        batch.map((entry) => {
          const dest = `${this.namespace}/${entry.key}`;
          return retryWithBackoff(
            () => this.s3.copyObject(entry.key, dest, signal),
            { signal },
          ).then(() => entry.key);
        }),
      );
      for (const result of results) {
        if (result.status === "fulfilled") copiedKeys.add(result.value);
      }
    }

    if (copiedKeys.size === 0) return { copied: 0, total: listing.length };

    // Delete originals that were successfully copied
    const toDelete = listing.filter((e) => copiedKeys.has(e.key));
    for (let i = 0; i < toDelete.length; i += this.pushConcurrency) {
      throwIfAborted(signal);
      const batch = toDelete.slice(i, i + this.pushConcurrency);
      await Promise.allSettled(
        batch.map((entry) =>
          retryWithBackoff(
            () => this.s3.deleteObject(entry.key, signal),
            { signal },
          )
        ),
      );
    }

    console.info(
      `[s3-sync] Control-plane migration complete: ${copiedKeys.size}/${listing.length} key(s) moved to "${this.namespace}/"`,
    );
    return { copied: copiedKeys.size, total: listing.length };
  }

  /**
   * Reads `_meta.json`, or null when it is absent. Callers read that null
   * as "no v2 index" and respond by migrating, rebuilding from a partial
   * view, or demoting the bucket back to v1 — all of which overwrite
   * `_meta.json` and drop the partitions it listed. A meta that is
   * present but unreadable must stop them instead, so it throws.
   */
  private async readPartitionMeta(
    signal?: AbortSignal,
  ): Promise<PartitionMeta | null> {
    const { meta, invalid } = await this.readPartitionMetaVersioned(signal);
    if (invalid) {
      throw new Error(
        "[s3-sync] _meta.json is present but is not a recognized v1/v2 index meta. Refusing to rebuild the index from a partial view; repair or remove _meta.json, then retry.",
      );
    }
    return meta;
  }

  /**
   * Reads `_meta.json` along with the ETag of the bytes read. `etag` is
   * null when the object is absent, so it can feed `putObjectIfMatch`
   * directly as a create-only precondition. `invalid` separates "absent"
   * from "present but not a recognized v1/v2 meta" — both yield
   * `meta: null`, and a merge-on-write caller must not treat the second
   * as an empty partition list.
   */
  private async readPartitionMetaVersioned(
    signal?: AbortSignal,
  ): Promise<
    { meta: PartitionMeta | null; invalid: boolean; etag: string | null }
  > {
    try {
      const { data, etag } = await retryWithBackoff(
        () => this.s3.getObject(this.metaKey(), signal),
        { signal },
      );
      const text = new TextDecoder().decode(data);
      const parsed = JSON.parse(text) as PartitionMeta;
      const valid = (parsed.version === 1 || parsed.version === 2) &&
        Array.isArray(parsed.partitions);
      return {
        meta: valid ? parsed : null,
        invalid: !valid,
        etag: etag ?? null,
      };
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "NotFound" || err.name === "NoSuchKey")
      ) {
        return { meta: null, invalid: false, etag: null };
      }
      throw err;
    }
  }

  /**
   * Reads a shard, or null when it is absent. Callers read that null as
   * "partition missing" and either fall back to the monolithic index or
   * skip the partition's entries, so a shard that is present but
   * unreadable throws rather than silently reading as empty.
   */
  private async readShard(
    partitionKey: string,
    signal?: AbortSignal,
  ): Promise<Record<string, IndexEntry> | null> {
    const { entries, invalid } = await this.readShardVersioned(
      partitionKey,
      signal,
    );
    if (invalid) {
      throw new Error(
        `[s3-sync] Index shard "${partitionKey}" is present but is not a recognized v1 shard. Repair or remove it, then retry.`,
      );
    }
    return entries;
  }

  /**
   * Like `readShard`, plus the ETag read (null when the shard is absent).
   * `invalid` separates "shard absent" from "shard present but not a
   * recognized v1 shard" — both yield `entries: null`, and a merge-on-write
   * caller must not treat the second as an empty starting point.
   */
  private async readShardVersioned(
    partitionKey: string,
    signal?: AbortSignal,
  ): Promise<
    {
      entries: Record<string, IndexEntry> | null;
      invalid: boolean;
      etag: string | null;
    }
  > {
    try {
      const { data, etag } = await retryWithBackoff(
        () => this.s3.getObject(this.shardKey(partitionKey), signal),
        { signal },
      );
      const text = new TextDecoder().decode(data);
      const partition = JSON.parse(text) as PartitionIndex;
      const valid = partition.version === 1 && partition.entries != null &&
        typeof partition.entries === "object";
      return {
        entries: valid ? partition.entries : null,
        invalid: !valid,
        etag: etag ?? null,
      };
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "NotFound" || err.name === "NoSuchKey")
      ) {
        return { entries: null, invalid: false, etag: null };
      }
      throw err;
    }
  }

  /**
   * Conditional PUT with a one-way fallback: when the store answers
   * NotImplemented, warn once and use unconditional puts from then on
   * (still merge-on-write, just without the lost-update guard).
   */
  private async putIfMatch(
    key: string,
    body: Uint8Array,
    etag: string | null,
    signal?: AbortSignal,
  ): Promise<{ etag?: string } | null> {
    if (!this.casUnsupported) {
      try {
        return await retryWithBackoff(
          () => this.s3.putObjectIfMatch(key, body, etag, signal),
          { signal },
        );
      } catch (err) {
        // Match on status too, for the same reason `putObjectIfMatch`
        // does: a non-XML 501 body leaves the SDK unable to parse the
        // error code, so the name alone isn't reliable.
        const unsupported = err instanceof Error &&
          (err.name === "NotImplemented" ||
            (err instanceof S3OperationError && err.httpStatusCode === 501));
        if (!unsupported) throw err;
        // Shards commit in parallel, so several callers can land here
        // before the flag is set; warn for the first one only.
        if (!this.casUnsupported) {
          this.casUnsupported = true;
          console.warn(
            "[s3-sync] The S3 endpoint does not support conditional PutObject (If-Match). Index writes fall back to merge-on-write without compare-and-swap, so concurrent writers can still lose index entries.",
          );
        }
      }
    }
    return await retryWithBackoff(
      () => this.s3.putObject(key, body, signal),
      { signal },
    );
  }

  /**
   * Commits one writer's index changes as compare-and-swap merges
   * (swamp-club#2245). Each dirty shard is re-read, gets only these
   * upserts/removals, and is written with If-Match; a lost race re-reads
   * and re-merges. Then `_meta.json` gets the same treatment: partitions
   * with entries are added, and a partition this call emptied is unlisted
   * only while its shard still carries the ETag written here. Empty
   * shards are left in place because S3-compatible stores ignore If-Match
   * on DELETE. Serialization never depends on the global lock.
   *
   * Returns the committed commitSeq and whether the remote index matched
   * what this writer already knew (no entries merged in from other
   * writers, and no commits since `baseCommitSeq`). Callers must only arm
   * the sidecar commitSeq fast path when `upToDate` is true.
   */
  private async commitShardChanges(
    upserts: Record<string, IndexEntry>,
    removals: Iterable<string>,
    baseCommitSeq: number,
    signal?: AbortSignal,
  ): Promise<{ commitSeq: number; upToDate: boolean }> {
    const changes = new Map<
      string,
      { upserts: Record<string, IndexEntry>; removals: string[] }
    >();
    const changeFor = (rel: string) => {
      const key = S3CacheSyncService.partitionKeyFromPath(rel);
      if (!key) return undefined;
      let change = changes.get(key);
      if (!change) {
        change = { upserts: {}, removals: [] };
        changes.set(key, change);
      }
      return change;
    };
    for (const [rel, entry] of Object.entries(upserts)) {
      const change = changeFor(rel);
      if (change) change.upserts[rel] = entry;
    }
    for (const rel of removals) changeFor(rel)?.removals.push(rel);

    let retries = 0;
    let upToDate = true;
    const known = this.index?.entries ?? {};
    // Written shard ETag per partition; null when nothing was written
    // because the shard was absent and stayed empty.
    const written = new Map<
      string,
      { etag: string | null | undefined; empty: boolean }
    >();

    const commitShard = async (partKey: string) => {
      const change = changes.get(partKey)!;
      for (let attempt = 1;; attempt++) {
        throwIfAborted(signal);
        const { entries, invalid, etag } = await this.readShardVersioned(
          partKey,
          signal,
        );
        // Merging onto `{}` here would CAS-overwrite a shard we can't
        // read with just this push's upserts, destroying the rest of the
        // partition. `assembleIndexFromShards` already refuses to read
        // such a shard; refuse to write it too.
        if (invalid) {
          throw new Error(
            `[s3-sync] Index shard "${partKey}" is not a recognized v1 shard; refusing to overwrite it. The push stays dirty; repair or remove the shard, then retry.`,
          );
        }
        if (entries !== null && etag === null) {
          throw new Error(
            `[s3-sync] S3 returned no ETag for index shard "${partKey}"; compare-and-swap needs one to avoid clobbering concurrent writers. The push stays dirty; retry it.`,
          );
        }
        const merged: Record<string, IndexEntry> = {
          ...(entries ?? {}),
          ...change.upserts,
        };
        for (const rel of change.removals) delete merged[rel];
        for (const rel of Object.keys(merged)) {
          if (isInternalCacheFile(rel)) delete merged[rel];
        }
        const empty = Object.keys(merged).length === 0;
        if (empty && etag === null) {
          written.set(partKey, { etag: null, empty });
          return;
        }
        const body = new TextEncoder().encode(
          JSON.stringify({ version: 1, entries: merged } as PartitionIndex),
        );
        const result = await this.putIfMatch(
          this.shardKey(partKey),
          body,
          etag,
          signal,
        );
        if (result) {
          written.set(partKey, { etag: result.etag, empty });
          for (const [rel, entry] of Object.entries(merged)) {
            const mine = change.upserts[rel] ?? known[rel];
            if (
              !mine || mine.size !== entry.size || mine.sha256 !== entry.sha256
            ) {
              upToDate = false;
            }
          }
          return;
        }
        if (attempt >= S3CacheSyncService.SHARD_CAS_ATTEMPTS) {
          throw new Error(
            `[s3-sync] Index shard "${partKey}" kept changing under concurrent writers (${attempt} compare-and-swap attempts). The push stays dirty; retry it.`,
          );
        }
        retries++;
        await abortableSleep(casBackoffMs(attempt), signal);
      }
    };

    // A failed shard doesn't un-commit its successful siblings, so stop
    // scheduling new work but still run the meta commit below — otherwise
    // a brand-new partition keeps a committed shard that no reader can
    // see. The failure is rethrown once its partitions are listed.
    const partKeys = [...changes.keys()];
    let shardFailure: unknown;
    for (
      let i = 0;
      i < partKeys.length && shardFailure === undefined;
      i += this.pushConcurrency
    ) {
      const results = await Promise.allSettled(
        partKeys.slice(i, i + this.pushConcurrency).map(commitShard),
      );
      shardFailure = results.find((r) => r.status === "rejected")?.reason;
    }

    for (let attempt = 1;; attempt++) {
      throwIfAborted(signal);
      const { meta, invalid, etag } = await this.readPartitionMetaVersioned(
        signal,
      );
      // Seeding from an empty set here would CAS-overwrite the partition
      // list with only the partitions this call touched, silently
      // unlisting every other one.
      if (invalid) {
        throw new Error(
          `[s3-sync] _meta.json is not a recognized v1/v2 index meta; refusing to overwrite it. Shards are committed but may be unlisted; repair _meta.json, then retry the push.`,
        );
      }
      if (meta !== null && etag === null) {
        throw new Error(
          `[s3-sync] S3 returned no ETag for _meta.json; compare-and-swap needs one to avoid clobbering concurrent writers. Shards are committed but may be unlisted; the push stays dirty, retry it.`,
        );
      }
      const v2 = meta?.version === 2 ? meta : null;
      const partitions = new Set(meta?.partitions ?? []);
      for (const [partKey, w] of written) {
        if (!w.empty) {
          partitions.add(partKey);
        } else if (partitions.has(partKey) && w.etag !== undefined) {
          const head = await retryWithBackoff(
            () => this.s3.headObject(this.shardKey(partKey), signal),
            { signal },
          );
          const current = head.exists ? head.etag : null;
          if (current === w.etag) partitions.delete(partKey);
        }
      }
      const readSeq = v2?.commitSeq ?? 0;
      const newMeta: PartitionMetaV2 = {
        version: 2,
        partitions: [...partitions].sort(),
        commitSeq: readSeq + 1,
      };
      const result = await this.putIfMatch(
        this.metaKey(),
        new TextEncoder().encode(JSON.stringify(newMeta)),
        etag,
        signal,
      );
      if (result) {
        if (readSeq !== baseCommitSeq) upToDate = false;
        trace.getActiveSpan()?.setAttribute(
          Attr.DATASTORE_CAS_RETRIES,
          retries,
        );
        // Shards that did commit are now listed; surface the one that
        // didn't so the push stays dirty and gets retried.
        if (shardFailure !== undefined) throw shardFailure;
        return { commitSeq: newMeta.commitSeq, upToDate };
      }
      if (attempt >= S3CacheSyncService.META_CAS_ATTEMPTS) {
        throw new Error(
          `[s3-sync] _meta.json kept changing under concurrent writers (${attempt} compare-and-swap attempts). Shards are committed but may be unlisted; the push stays dirty, retry it.`,
        );
      }
      retries++;
      await abortableSleep(casBackoffMs(attempt), signal);
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
      () => this.s3.putObject(this.shardKey(partitionKey), data, signal),
      { signal },
    );
  }

  private async writePartitionMeta(
    meta: PartitionMetaV2,
    signal?: AbortSignal,
  ): Promise<void> {
    const data = new TextEncoder().encode(JSON.stringify(meta));
    await retryWithBackoff(
      () => this.s3.putObject(this.metaKey(), data, signal),
      { signal },
    );
  }

  async migrateMonolithToShards(
    options?: DatastoreSyncOptions,
  ): Promise<PartitionMetaV2> {
    return await getTracer().startActiveSpan(
      "s3-datastore migrateIndex",
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

          const partitions = S3CacheSyncService.groupEntriesByPartition(
            allEntries,
          );

          let partitionedCount = 0;
          for (const bucket of partitions.values()) {
            partitionedCount += Object.keys(bucket).length;
          }
          if (partitionedCount !== entryCount) {
            const missing = Object.keys(allEntries).filter(
              (rel) => !S3CacheSyncService.partitionKeyFromPath(rel),
            );
            throw new Error(
              `[s3-sync] Migration aborted: ${entryCount} index entries but only ${partitionedCount} could be partitioned. ` +
                `${entryCount - partitionedCount} entry/entries dropped: ${
                  missing.slice(0, 10).join(", ")
                }`,
            );
          }

          console.info(
            `[s3-sync] Migrating monolithic index to shard-first: ${entryCount} entries → ${partitions.size} shard(s)`,
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
            `[s3-sync] Migration complete: ${partitions.size} shard(s) written, _meta.json v2 with commitSeq=1 (${
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
            `[s3-sync] Failed to read shard ${batch[j]} after retries: ${
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason)
            }`,
          );
        }
        if (result.value === null) {
          throw new Error(
            `[s3-sync] Shard ${
              batch[j]
            } listed in _meta.json v2 but missing from S3 — index is corrupt. ` +
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
      const key = S3CacheSyncService.partitionKeyFromPath(bare);
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
            `[s3-sync] Failed to read shard ${batch[j]} after retries: ${
              result.reason instanceof Error
                ? result.reason.message
                : String(result.reason)
            }`,
          );
        }
        if (result.value === null) {
          throw new Error(
            `[s3-sync] Shard ${
              batch[j]
            } listed in _meta.json v2 but missing from S3 — index is corrupt. ` +
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
    const listing = await this.s3.listAllObjects(prefix, signal);
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
      `[s3-sync] Rebuilt _meta.json from _index/ listing: ${partitionKeys.length} shard(s)`,
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
        typeof parsed.remoteIndexETag === "string" &&
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
      remoteIndexETag: current?.remoteIndexETag ?? "",
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
      // Normalize the path relative to cachePath. Core may pass absolute
      // or ../‑relative paths for repos that resolve outside the cache
      // dir (e.g. definitions-evaluated, outputs). Resolve and re-derive
      // the cache-relative form so the scoped walker can find the files.
      const resolved = normalize(join(this.cachePath, relPath));
      const normalizedCache = normalize(this.cachePath);
      let normalizedRel: string;
      if (
        resolved.startsWith(normalizedCache + "/") ||
        resolved === normalizedCache
      ) {
        normalizedRel = relative(this.cachePath, resolved);
      } else {
        // Path escapes cache dir — can't scope the walk to it, so
        // fall back to bulk invalidation.
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

    // No relPath — bulk invalidation (legacy path or pushFile)
    if (current?.localDirty === true && this.bulkInvalidated) return;
    this.bulkInvalidated = true;
    await this.writeSyncState(
      this.buildV2State({ localDirty: true, bulkInvalidated: true }),
    );
  }

  /**
   * Record a verified-clean state: the local cache matches the remote
   * index whose ETag is `remoteIndexETag`. Multipart ETags are
   * rejected — they aren't a content fingerprint, so saving one would
   * make every subsequent fast-path comparison succeed spuriously.
   *
   * Correctness invariant (swamp-club #168): `remoteIndexETag` MUST
   * come from the same GetObject response that delivered the bytes we
   * verified the local cache against, OR from our own PutObject
   * response for the bytes we just wrote. A standalone post-walk
   * HeadObject is TOCTOU-racy: a concurrent writer can bump the
   * remote index between our GET and our HEAD, and recording their
   * ETag as ours would mask their data on the next fast-path sync
   * until any future mutation invalidates. Callers must thread the
   * fingerprint through `pullIndex`'s return value (or use
   * `putResult.etag` in the writeback path) — never re-HEAD for it.
   *
   * `lastVerifiedAt` is forced strictly past the local index file's
   * mtime (by 1 ms when the wall clock would otherwise tie). The
   * fast-path probe uses `>=` to bail on any local edit, so a tied
   * timestamp would spuriously bail out of the happy path on fast
   * machines — paying the slow path on every second sync.
   */
  private async markSynced(remoteIndexETag: string): Promise<void> {
    const normalized = normalizeETag(remoteIndexETag);
    if (!normalized || isMultipartETag(remoteIndexETag)) return;
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
      remoteIndexETag: normalized,
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
   * remotes), then falls back to ETag comparison (pre-shard remotes).
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
      !sidecar.remoteIndexETag || isMultipartETag(sidecar.remoteIndexETag)
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
    let head;
    try {
      head = await this.s3.headObject(this.indexKey(), signal);
    } catch {
      return null;
    }
    if (!head.exists || !head.etag || isMultipartETag(head.etag)) return null;
    if (normalizeETag(head.etag) !== sidecar.remoteIndexETag) return null;
    return 0;
  }

  /**
   * Fast-path probe for `pushChanged`. Tries commitSeq first, then falls
   * back to ETag. Also checks localDirty — a dirty cache must always
   * take the slow path.
   */
  private async tryFastPushChanged(
    _signal: AbortSignal | undefined,
  ): Promise<number | null> {
    const sidecar = await this.loadSyncState();
    if (!sidecar) return null;
    // localDirty is the authority on whether local changes need pushing.
    // No need to verify commitSeq/ETag — those track remote state, which
    // is irrelevant to whether WE have something to push.
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
   * Pulls the metadata index from S3 (lightweight, single GET).
   * Uses a local cache with a 60-second TTL to avoid redundant fetches
   * during rapid command sequences.
   *
   * Pass `forceRemote: true` to bypass the local TTL cache and always
   * fetch from S3. `pushChanged()` uses this to guarantee the
   * writeback merges onto the current remote state — without it, a
   * stale local cache (< 60 s old) could silently clobber updates
   * pushed by another writer in the intervening window.
   *
   * Both entry paths (cache-hit and S3-fetch) scrub the in-memory
   * index after parsing so zombie internal-file entries never reach
   * the rest of the sync pipeline (see swamp-club#29). On the
   * S3-fetch path the local cache file is rewritten with the scrubbed
   * JSON when scrub mutated — keeping the on-disk and in-memory views
   * consistent. The cache-hit path does NOT rewrite the local file;
   * its on-disk view self-heals on the next S3 fetch.
   */
  async pullIndex(
    options?: { forceRemote?: boolean; signal?: AbortSignal },
  ): Promise<string | null> {
    const signal = options?.signal;
    // Check local cache freshness (skipped when forceRemote is set).
    // Cache-hit returns null: no remote fetch happened, so we have no
    // fingerprint the caller can safely record. The alternative —
    // HEAD'ing remote to synthesize a fingerprint — reintroduces the
    // TOCTOU race this refactor exists to close.
    if (!options?.forceRemote) {
      try {
        const stat = await Deno.stat(this.indexPath);
        const ageMs = Date.now() - (stat.mtime?.getTime() ?? 0);
        if (ageMs < INDEX_CACHE_TTL_MS && this.index === null) {
          const content = await Deno.readTextFile(this.indexPath);
          this.index = JSON.parse(content) as DatastoreIndex;
          // Scrub zombies from the in-memory view before returning.
          this.indexMutated ||= this.scrubIndex();
          return null; // Fresh enough — skip S3
        }
      } catch {
        // No local index — fetch from S3
      }
    }

    // Fetch the remote index. Only "object not found" errors (S3
    // 404 — bucket exists but no index object yet; SDK surfaces this
    // as `name === "NotFound"` or `"NoSuchKey"`) are treated as the
    // brand-new-bucket case and fall back to an empty in-memory
    // index. Any other error (auth failure, 5xx, network timeout,
    // JSON parse failure, local write failure) propagates so callers
    // abort rather than treating a transient failure as "no data" —
    // critical for `pushChanged`, which would otherwise write an
    // empty index back to the remote and wipe the real one.
    let data: Uint8Array;
    let etag: string | undefined;
    try {
      const response = await this.s3.getObject(this.indexKey(), signal);
      data = response.data;
      etag = response.etag;
    } catch (err) {
      if (
        err instanceof Error && "name" in err &&
        (err.name === "NotFound" || err.name === "NoSuchKey")
      ) {
        // Bucket has no index file. Two sub-cases:
        //   (1) Brand-new empty bucket — fall back to an empty
        //       in-memory index, return null. Existing behaviour.
        //   (2) Bucket pre-dates the indexed-sync model and holds data
        //       under standard prefixes (data/, workflow-runs/, …) but
        //       was never written by a swamp version that publishes
        //       `.datastore-index.json`. Without discovery, hydrate
        //       reports `Hydrated: 0 pulled` and silently leaves the
        //       cache empty (swamp-club#225, residual from #220).
        // Discovery: list the bucket, filter via isInternalCacheFile,
        // build an index from the listing, publish it, and continue.
        // Functionally idempotent across racing peers (entry keys and
        // sizes match; only metadata timestamps like `lastPulled` and
        // the `lastModified` fallback differ), so the unconditional
        // PutObject is benign — see inline notes i, ii, iii below.
        return await this.discoverIndexFromBucket(signal);
      }
      throw err;
    }

    const text = new TextDecoder().decode(data);
    this.index = JSON.parse(text) as DatastoreIndex;
    await ensureDir(this.cachePath);
    // Scrub zombies, then write the local cache file. If scrub
    // mutated, write the cleaned JSON so on-disk matches in-memory.
    // Otherwise write the raw remote text to preserve the fast path
    // (no re-serialization cost).
    if (this.scrubIndex()) {
      this.indexMutated = true;
      await atomicWriteTextFile(
        this.indexPath,
        JSON.stringify(this.index, null, 2),
      );
    } else {
      await atomicWriteTextFile(this.indexPath, text);
    }
    return etag ?? null;
  }

  /**
   * Self-healing fallback for `pullIndex` when the remote
   * `.datastore-index.json` is absent. Lists the bucket, filters
   * internal cache files, builds an index from the listing, publishes
   * it, and writes the local copy — leaving the caller's slow-path
   * bookkeeping behaving identically to a normal index fetch.
   *
   * Inline-comment requirements (a future reader must not "fix" any of
   * these without understanding the trade-off):
   *
   *   i. The PutObject is unconditional. Discovery is functionally
   *      idempotent across racing peers — entry keys and sizes match
   *      (same listing in, same fields populated out), but metadata
   *      timestamps (`lastPulled`, and the `lastModified` fallback
   *      when the SDK didn't surface one) are evaluated per peer so
   *      the JSON bodies are NOT byte-identical. That's still safe:
   *      sync behaviour depends on keys + sizes, not timestamps. Do
   *      NOT add a content-fingerprint optimization here on the
   *      assumption of byte-equality. Matches the existing
   *      pushChanged writeback (see line ~1029); `If-None-Match: *`
   *      is not portable across all S3-compatible backends this
   *      extension supports (older MinIO/Spaces/R2 implement it
   *      inconsistently).
   *
   *  ii. `this.index` is set in-memory BEFORE the PutObject attempt,
   *      mirroring the existing post-fetch path's order. If PutObject
   *      throws, this.index reflects an unpublished state but no local
   *      file is written (atomicWriteTextFile happens after put), and
   *      the next forceRemote call re-triggers discovery — idempotent
   *      with no orphaned state. Do not reorder this — flipping it
   *      would diverge from the post-fetch path and complicate the
   *      mental model.
   *
   * iii. All callers of pullIndex (both pullChanged and pushChanged)
   *      inherit this fallback automatically — no separate change to
   *      pushChanged is needed. Side benefit: previously, pushChanged
   *      against an unindexed populated bucket would write an index
   *      reflecting only LOCAL files, dropping the existing remote
   *      entries from the index even though the storage still held
   *      them. With discovery here, push first builds a complete
   *      merged view, then walks local against it.
   */
  private async discoverIndexFromBucket(
    signal?: AbortSignal,
  ): Promise<string | null> {
    const discoverStart = Date.now();
    const subPrefix = this.namespace ? `${this.namespace}/` : undefined;
    const listing = await this.s3.listAllObjects(subPrefix, signal);
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

    // Sub-case (2): bucket holds data but no index. Build entries from
    // the listing — no localMtime since nothing has been pulled yet;
    // pullChanged will reconcile mtimes as it downloads each file.
    const entries: Record<string, IndexEntry> = {};
    for (const entry of filtered) {
      const rel = nsPrefix && entry.key.startsWith(nsPrefix)
        ? entry.key.slice(nsPrefix.length)
        : entry.key;
      entries[rel] = {
        key: rel,
        size: entry.size,
        lastModified: (entry.lastModified ?? new Date()).toISOString(),
      };
    }
    this.index = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries,
    };
    const indexData = new TextEncoder().encode(JSON.stringify(this.index));
    const putResult = await retryWithBackoff(
      () => this.s3.putObject(this.indexKey(), indexData, signal),
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
    // The returned ETag is the raw form from the PUT response, with
    // S3's surrounding double-quotes intact (e.g. `"abc123"`). This
    // matches the post-fetch path's contract — `normalizeETag()` is
    // what callers apply for byte-level comparison against sidecar
    // values. Don't strip them here; doing so would diverge from the
    // existing fingerprint convention.
    return putResult?.etag ?? null;
  }

  /** Fetches a single file from S3 to the local cache. */
  async pullFile(
    relativePath: string,
    signal?: AbortSignal,
  ): Promise<void> {
    return await getTracer().startActiveSpan(
      "s3-datastore pullFile",
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
              () => this.s3.getObject(this.dataKey(relativePath), signal),
              { signal },
            ));
          } catch (err) {
            if (
              this.namespace && err instanceof Error &&
              (err.name === "NotFound" || err.name === "NoSuchKey")
            ) {
              ({ data } = await retryWithBackoff(
                () => this.s3.getObject(relativePath, signal),
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
   * Pulls only new or modified files from S3 to the local cache.
   * Fetches the remote index, compares against local files, and only
   * downloads files that are missing locally or have a different size.
   *
   * Fast path (DEF-2): before doing any of that, HEAD the remote index
   * and compare its ETag to the sidecar; if nothing has changed since
   * the last verified-clean walk, return `0` immediately without the
   * 1.37 MB index GET or the multi-thousand-stat walk. Any fall-through
   * condition (no sidecar, ETag mismatch, multipart ETag, local index
   * mtime newer than `lastVerifiedAt`) drops into the slow path below.
   */
  async pullChanged(
    options?: DatastoreSyncOptions,
  ): Promise<number | void> {
    return await getTracer().startActiveSpan(
      "s3-datastore pull",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");
          const signal = options?.signal;
          this.bindNamespace(options?.namespace);
          throwIfAborted(signal);
          await this.ensurePreflight(signal);

          // Subdir-scoped pull (configRefresh): only list, walk, prune and
          // download entries under these prefixes. A scoped pull never
          // claims the whole cache is in sync — it must not advance the
          // fast-path sidecar or clear lazy hydration, or a later unscoped
          // pull would skip the out-of-scope changes (swamp-club #2246).
          const subdirs = (options?.subdirs ?? [])
            .map((d) => d.replace(/\/+$/, ""))
            .filter((d) => d.length > 0);
          const scoped = subdirs.length > 0;

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

          const indexStart = Date.now();
          const models = options?.context?.models;
          let indexETag: string | null;
          let v2CommitSeq: number | null = null;

          if (models && models.length > 0) {
            // Scoped pull: try partition files first, fall back to monolithic.
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
              indexETag = null;
            } else {
              indexETag = await this.pullIndex({ forceRemote: true, signal });
            }
          } else {
            // Unscoped pull: try shard assembly when _meta.json is v2.
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
              indexETag = null;
              v2CommitSeq = assembled.commitSeq;
            } else {
              indexETag = await this.pullIndex({ forceRemote: true, signal });
            }
          }
          tracePhase("pullChanged.pullIndex", indexStart);

          // Metadata-only pull: skip raw content files under data/ — download
          // only metadata.yaml, latest pointers, and everything outside data/.
          // Create parent dirs for skipped files so readdir works for the
          // catalog walker.
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
          //
          // Scoped pulls list each subdir at both root and namespace so the
          // same pre-namespace root-key fallback still holds.
          const listStart = Date.now();
          const listNsPrefix = this.namespace ? `${this.namespace}/` : "";
          let remoteKeys: Set<string> | null = null;
          try {
            const remoteListing = scoped
              ? (await Promise.all(
                subdirs.flatMap((d) =>
                  [`${d}/`, ...(listNsPrefix ? [`${listNsPrefix}${d}/`] : [])]
                    .map((p) => this.s3.listAllObjects(p, signal))
                ),
              )).flat()
              : await this.s3.listAllObjects(undefined, signal);
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

          // Build list of files that need pulling
          const walkStart = Date.now();
          const toPull: string[] = [];
          const lazyDirsToCreate: Set<string> = new Set();
          const pull404Rels = new Set<string>();
          for (
            const [rel, entry] of Object.entries(this.index?.entries ?? {})
          ) {
            // Belt-and-suspenders: `scrubIndex` already removed internal
            // entries in `pullIndex`, but if anything re-adds a zombie
            // between the scrub and the walk, this guard still catches it.
            if (isInternalCacheFile(rel)) {
              continue;
            }
            // Out of scope: not listed, so must not be pruned or pulled.
            if (scoped && !isInSubdirs(rel, subdirs)) {
              continue;
            }
            // Prune entries whose remote object no longer exists — the
            // listing already told us, no per-file getObject needed.
            // Skipped when the listing failed (remoteKeys is null).
            if (remoteKeys && !remoteKeys.has(rel)) {
              if (this.index) {
                pull404Rels.add(rel);
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
                // Reconcile localMtime so pushChanged() doesn't treat it as
                // changed due to mtime drift (e.g. file was placed by migration
                // or a different machine pushed the index).
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

          // Download concurrently in batches
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
                if (
                  err instanceof Error &&
                  (err.name === "NotFound" || err.name === "NoSuchKey") &&
                  this.index
                ) {
                  pull404Rels.add(batch[j]);
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

          // Local cache matches the remote index whose ETag we captured from
          // the `pullIndex` GET response — either the walk found zero diff
          // (`pulled === 0`) or we just downloaded the missing files
          // (`pulled > 0`). Persist THAT ETag — the one we walked against —
          // so the next `pullChanged` / `pushChanged` can take the fast path.
          // We deliberately do NOT re-HEAD: a post-walk HEAD could observe an
          // ETag from a concurrent writer's push landing during our walk,
          // and recording that ETag would mask their data on the next
          // fast-path sync (swamp-club #168). If the ETag is null (cache-hit
          // pullIndex or NotFound brand-new bucket), the sidecar is skipped —
          // next sync self-heals on the slow path.
          //
          // When `pulled > 0`, also rewrite the on-disk index with the
          // in-memory state so it carries the localMtime values we just
          // recorded for each downloaded file. Pre-fix, the on-disk file was
          // last written by `pullIndex` from the raw remote payload (carrying
          // the original pusher's local mtimes), so a subsequent fresh-process
          // `pushChanged` slow-path walk saw `existing.localMtime` (pusher's)
          // ≠ `stat.mtime` (local mtime from `Deno.writeFile`) and pushed
          // every file with byte-identical content (swamp-club #222).
          //
          // Ordering invariant — DO NOT REVERSE: `atomicWriteTextFile` MUST
          // run before `markSynced`. `markSynced` derives `lastVerifiedAt`
          // from `Deno.stat(this.indexPath).mtime + 1ms`. Reversing the order
          // captures `lastVerifiedAt` against the pre-write mtime; the
          // subsequent rewrite then bumps the index mtime forward, and the
          // next `tryFastPullChanged` probe spuriously bails on
          // `indexMtime >= verifiedAt`.
          if (indexETag) {
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
                    () => this.s3.putObject(this.indexKey(), indexData, signal),
                    { signal },
                  );
                  this.indexMutated = false;
                  indexETag = putResult?.etag ?? indexETag;
                }
              }
              if (!scoped) await this.markSynced(indexETag);
            } catch {
              // Non-fatal: sidecar update is opportunistic. Disk-full /
              // permissions / unmount must not turn a successful sync into
              // a failure — the sidecar is a fast-path optimization, and a
              // missed update only costs one slow-path sync next time.
            }
          } else if (
            v2CommitSeq !== null && this.indexMutated &&
            pull404Rels.size > 0 && this.index
          ) {
            // Shard-first path: 404 cleanup removed stale entries from
            // the in-memory index. CAS-remove only those entries from the
            // affected shards so they don't reappear on the next boot
            // (swamp-club #2063) and concurrent additions survive
            // (swamp-club#2245).
            try {
              const committed = await this.commitShardChanges(
                {},
                pull404Rels,
                v2CommitSeq,
                signal,
              );

              await atomicWriteTextFile(
                this.indexPath,
                JSON.stringify(this.index, null, 2),
              );
              this.indexMutated = false;

              if (!scoped) {
                const sidecar = this.buildV2State({ localDirty: false });
                if (committed.upToDate) {
                  sidecar.commitSeq = committed.commitSeq;
                }
                sidecar.remoteIndexETag = "";
                await this.writeSyncState(sidecar);
              }
            } catch {
              // Non-fatal: shard writeback is opportunistic. A missed
              // cleanup only costs repeated 404s on the next boot —
              // the same behavior as before this fix.
            }
          } else if (v2CommitSeq !== null && !scoped) {
            // Shard-first path, clean pull (no 404 cleanup, no monolithic
            // index ETag). Record commitSeq in the sidecar so the fast
            // path can arm on the next pull (swamp-club #1931).
            try {
              const sidecar = this.buildV2State({ localDirty: false });
              sidecar.commitSeq = v2CommitSeq;
              sidecar.remoteIndexETag = "";
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
            this.lazyPullActive && !options?.context?.models?.length &&
            !scoped
          ) {
            this.lazyPullActive = false;
            await this.writeSyncState(
              this.buildV2State({ lazyPullActive: false }),
            );
          }

          span.setAttribute(Attr.DATASTORE_FAST_PATH_HIT, false);
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
   * Pushes a single file from the local cache to S3.
   *
   * Pessimistically marks the sidecar `localDirty: true` BEFORE the
   * upload so a crash mid-batch never strands an unpushed local
   * change behind a clean fast-path flag — the next `pushChanged`
   * will see `localDirty: true` and do the full walk. The flag is
   * cleared only by `pushChanged` after a successful index writeback.
   */
  async pushFile(
    relativePath: string,
    signal?: AbortSignal,
    overrideLocalPath?: string,
  ): Promise<void> {
    return await getTracer().startActiveSpan(
      "s3-datastore pushFile",
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
            () => this.s3.putObject(this.dataKey(relativePath), data, signal),
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
   * Pushes only new or modified files from the local cache to S3.
   * Compares each file's size against the index to detect changes.
   *
   * Always fetches the current remote index (bypassing the local
   * TTL cache) so that the writeback at the end of this method
   * merges new/modified entries onto remote state instead of
   * clobbering it. Without this, any client with a smaller or
   * stale local cache (e.g. a fresh reader running `datastore setup`,
   * or a writer whose cached index is < 60 s old but another writer
   * has since pushed) would overwrite the remote
   * `.datastore-index.json` with a subset of entries, leaving the
   * other writer's data orphaned. See swamp-club#30.
   */
  async pushChanged(
    options?: DatastoreSyncOptions,
  ): Promise<number | void> {
    return await getTracer().startActiveSpan(
      "s3-datastore push",
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
            needsDataKeyMigration || needsControlPlaneMigration
              ? "skip(migration)"
              : fastResult === 0
              ? "hit"
              : "miss",
          );
          if (fastResult !== null) {
            span.setAttribute(Attr.DATASTORE_FAST_PATH_HIT, true);
            span.setAttribute(Attr.DATASTORE_FILES_PUSHED, 0);
            span.setAttribute(Attr.DATASTORE_FILES_DELETED, 0);
            return fastResult;
          }

          const indexStart = Date.now();
          let indexETag: string | null = null;
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
            indexETag = await this.pullIndex({ forceRemote: true, signal });
            this.indexIsPartial = false;
            if (this.freshV2Initialized) {
              v2CommitSeq = 0;
              indexETag = null;
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
              try {
                const sidecar = this.buildV2State({ localDirty: false });
                if (allMigrated) sidecar.dataKeyMigrated = true;
                await this.writeSyncState(sidecar);
              } catch { /* non-fatal */ }
              if (copied > 0) return copied;
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
                  // Check for index entries under this directory that no
                  // longer have local files (file deleted but dir remains).
                  if (!this.lazyPullActive && this.index) {
                    const prefix = bareDirtyPath.endsWith("/")
                      ? bareDirtyPath
                      : bareDirtyPath + "/";
                    for (const rel of Object.keys(this.index.entries)) {
                      if (isInternalCacheFile(rel)) continue;
                      if (rel.startsWith(prefix) && !localFilesInDir.has(rel)) {
                        toDelete.push(rel);
                      }
                    }
                  }
                }
              } catch (err) {
                if (!(err instanceof Deno.errors.NotFound)) {
                  // Non-absence error (permission, I/O, NFS timeout) — do not
                  // assume deletion intent. Skip this dirty path silently;
                  // the next pushChanged will retry.
                  continue;
                }
                // Path is genuinely absent — collect matching index entries
                // for S3 deletion (markDirty contract rule #2). Skip when
                // lazy pull is active: absent files are un-hydrated, not
                // deleted.
                if (!this.lazyPullActive && this.index) {
                  const prefix = bareDirtyPath.endsWith("/")
                    ? bareDirtyPath
                    : bareDirtyPath + "/";
                  for (const rel of Object.keys(this.index.entries)) {
                    if (isInternalCacheFile(rel)) continue;
                    if (rel === bareDirtyPath || rel.startsWith(prefix)) {
                      toDelete.push(rel);
                    }
                  }
                }
              }
            }
          } else {
            // Detect foreign namespace directories to exclude from the walk.
            // The bound namespace is exempt — its files are pushed with the
            // namespace prefix stripped from rel so dataKey() produces the
            // correct remote key (swamp-club#1280).
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
                `[s3-sync] Skipped ${soloLayoutSkips} solo-layout file(s) outside the bound ` +
                  `namespace "${this.namespace}". These are stale leftovers — ` +
                  `investigate and remove them.`,
              );
            }
            if (namespaceDirSkips > 0) {
              console.warn(
                `[s3-sync] Skipped ${namespaceDirSkips} file(s) inside namespace directories ` +
                  `found under the cache root (${
                    [...namespaceDirs].join(", ")
                  }). ` +
                  `These directories should not be inside this cache — investigate and remove them.`,
              );
            }
            // Compare index against local files to find deletions (rule #2).
            // Only when per-path dirty tracking overflowed — a no-path
            // markDirty() is a modification signal, not a deletion signal.
            // Also skip when lazy pull is active to avoid deleting un-hydrated
            // content.
            if (
              this.dirtyPathsOverflowed && !this.lazyPullActive && this.index
            ) {
              for (const rel of Object.keys(this.index.entries)) {
                if (isInternalCacheFile(rel)) continue;
                if (isInsideNamespaceDir(rel, namespaceDirs)) continue;
                if (!localFiles.has(rel)) {
                  toDelete.push(rel);
                }
              }
            }
          }
          tracePhase(
            "pushChanged.walk",
            walkStart,
            `toPush=${toPush.length} toDelete=${toDelete.length}`,
          );

          // Upload concurrently in batches
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

          // Delete remote objects for locally-absent files (swamp-club#797).
          const deleteStart = Date.now();
          let deleted = 0;
          const deleteFailures: Array<{ file: string; error: unknown }> = [];
          for (let i = 0; i < toDelete.length; i += this.pushConcurrency) {
            throwIfAborted(signal);
            const batch = toDelete.slice(i, i + this.pushConcurrency);
            const results = await Promise.allSettled(
              batch.map((rel) =>
                retryWithBackoff(
                  () => this.s3.deleteObject(this.dataKey(rel), signal),
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
                  this.indexMutated = true;
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

          // Push updated index if anything changed — either new files were
          // pushed, files were deleted, or scrubIndex removed zombie entries
          // that need to propagate to the remote (swamp-club#29 migration path).
          if ((pushed > 0 || deleted > 0 || this.indexMutated) && this.index) {
            const writebackStart = Date.now();
            if (pushed > 0 || deleted > 0) {
              this.index.lastPulled = new Date().toISOString();
            }

            const dirtyPartitionKeys = new Set<string>();
            for (const { rel } of toPush) {
              const key = S3CacheSyncService.partitionKeyFromPath(rel);
              if (key) dirtyPartitionKeys.add(key);
            }
            for (const rel of toDelete) {
              const key = S3CacheSyncService.partitionKeyFromPath(rel);
              if (key) dirtyPartitionKeys.add(key);
            }

            if (v2CommitSeq !== null) {
              // v2: CAS-merge only this push's upserts and deletes into
              // the dirty shards and _meta.json (swamp-club#2245). Skip
              // monolith PUT — shards are the source of truth. Failures
              // propagate so the push stays dirty.
              const upserts: Record<string, IndexEntry> = {};
              for (const { rel } of toPush) {
                const entry = this.index.entries[rel];
                if (entry) upserts[rel] = entry;
              }
              const committed = await this.commitShardChanges(
                upserts,
                toDelete,
                v2CommitSeq,
                signal,
              );

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
                  committed.upToDate && !this.indexIsPartial &&
                  await this.localHasAllRemoteEntries()
                ) {
                  sidecar.commitSeq = committed.commitSeq;
                }
                sidecar.remoteIndexETag = "";
                await this.writeSyncState(sidecar);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
              tracePhase("pushChanged.v2writeback", writebackStart);
            } else {
              // v1: write monolith + dual-write partitions.
              const indexData = new TextEncoder().encode(
                JSON.stringify(this.index),
              );
              const putResult = await retryWithBackoff(
                () => this.s3.putObject(this.indexKey(), indexData, signal),
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
              // Record the new index ETag as the verified-clean baseline
              // (swamp-club #168, swamp-club#1225).
              const etag = putResult?.etag;
              if (
                etag && !isMultipartETag(etag) &&
                await this.localHasAllRemoteEntries()
              ) {
                try {
                  await this.markSynced(etag);
                } catch {
                  // Non-fatal: sidecar update is opportunistic.
                }
              }
              tracePhase("pushChanged.writeback", writebackStart);
            }
          } else if (v2CommitSeq !== null && this.index) {
            // v2 no-writeback: update sidecar with current commitSeq.
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
              sidecar.remoteIndexETag = "";
              await this.writeSyncState(sidecar);
            } catch {
              // Non-fatal: sidecar update is opportunistic.
            }
          } else if (indexETag && this.index) {
            // v1 no-writeback: verify local matches remote before marking
            // clean (swamp-club#1225 data-loss scenario).
            if (
              !isMultipartETag(indexETag) &&
              await this.localHasAllRemoteEntries()
            ) {
              try {
                await this.markSynced(indexETag);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
            }
          }

          span.setAttribute(Attr.DATASTORE_FAST_PATH_HIT, false);
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
      "s3-datastore preparePush",
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
            needsDataKeyMigration || needsControlPlaneMigration
              ? "skip(migration)"
              : fastResult !== null
              ? "hit"
              : "miss",
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
                    for (const rel of Object.keys(this.index.entries)) {
                      if (isInternalCacheFile(rel)) continue;
                      if (rel.startsWith(prefix) && !localFilesInDir.has(rel)) {
                        toDelete.push(rel);
                      }
                    }
                  }
                }
              } catch (err) {
                if (!(err instanceof Deno.errors.NotFound)) {
                  continue;
                }
                if (!this.lazyPullActive && this.index) {
                  const prefix = bareDirtyPath.endsWith("/")
                    ? bareDirtyPath
                    : bareDirtyPath + "/";
                  for (const rel of Object.keys(this.index.entries)) {
                    if (isInternalCacheFile(rel)) continue;
                    if (rel === bareDirtyPath || rel.startsWith(prefix)) {
                      toDelete.push(rel);
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
              for (const rel of Object.keys(this.index.entries)) {
                if (isInternalCacheFile(rel)) continue;
                if (isInsideNamespaceDir(rel, namespaceDirs)) continue;
                if (!localFiles.has(rel)) {
                  toDelete.push(rel);
                }
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
                  () => this.s3.putObject(this.dataKey(rel), data, signal),
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
              batch.map((rel) =>
                retryWithBackoff(
                  () => this.s3.deleteObject(this.dataKey(rel), signal),
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
            const key = S3CacheSyncService.partitionKeyFromPath(rel);
            if (key && !dirtyPartitionKeys.includes(key)) {
              dirtyPartitionKeys.push(key);
            }
          }
          for (const rel of toDelete) {
            const key = S3CacheSyncService.partitionKeyFromPath(rel);
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
      "s3-datastore commitPush",
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
                sidecar.remoteIndexETag = "";
                await this.writeSyncState(sidecar);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
              tracePhase("commitPush", commitStart, "v2noop");
              return 0;
            }

            // v1: fall back to monolith verification.
            const indexFingerprint = await this.pullIndex({
              forceRemote: true,
              signal,
            });
            if (
              indexFingerprint && this.index &&
              !isMultipartETag(indexFingerprint) &&
              await this.localHasAllRemoteEntries()
            ) {
              try {
                await this.markSynced(indexFingerprint);
              } catch {
                // Non-fatal: sidecar update is opportunistic.
              }
            }
            tracePhase("commitPush", commitStart, "noop");
            return 0;
          }

          // Check if shard-first mode is active (v2 meta exists).
          // Migration is an explicit one-time operation — commitPush never
          // migrates. If v2 meta isn't present, fall back to the legacy
          // monolith path.
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
            "[s3-sync] Index is using monolithic format. Run 'swamp datastore migrate-index' to enable shard-first commits for improved concurrency.",
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
    const committed = await this.commitShardChanges(
      data.newEntries,
      data.deletedKeys,
      v2Meta.commitSeq,
      signal,
    );
    tracePhase(
      "commitPush.shards",
      shardStart,
      `dirty=${data.dirtyPartitionKeys.length}`,
    );

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
        committed.upToDate && !this.indexIsPartial &&
        await this.localHasAllRemoteEntries()
      ) {
        sidecar.commitSeq = committed.commitSeq;
      }
      sidecar.remoteIndexETag = "";
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
        () => this.s3.putObject(this.indexKey(), indexData, signal),
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

      const etag = putResult?.etag;
      if (
        etag && !isMultipartETag(etag) &&
        await this.localHasAllRemoteEntries()
      ) {
        try {
          await this.markSynced(etag);
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
      try {
        const localPath = assertSafePath(
          this.cachePath,
          this.localRelPath(rel),
        );
        const stat = await Deno.stat(localPath);
        if (stat.size !== entry.size) {
          if (traceEnabled()) {
            console.debug(
              `[s3-sync] localHasAllRemoteEntries: size mismatch for ${rel} (local=${stat.size}, index=${entry.size})`,
            );
          }
          return false;
        }
      } catch {
        if (traceEnabled()) {
          console.debug(
            `[s3-sync] localHasAllRemoteEntries: missing locally: ${rel}`,
          );
        }
        return false;
      }
    }
    return true;
  }

  /**
   * Change detection for a single file during push walk:
   * 1. Size differs → needs push
   * 2. Same size + same mtime + sha256 in index → hash comparison
   * 3. Same size + same mtime + no sha256 → skip (stat-only fast path)
   * 4. Same size + different mtime → SHA-256 comparison when available
   */
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

    // No mtime available or not recorded — hash if available, otherwise
    // size-only skip for old index entries without sha256
    if (!stat.mtime || existing.localMtime === undefined) {
      if (!existing.sha256) return false;
    }

    // Same size, mtime differs (or unavailable) — hash if index has sha256
    if (existing.sha256) {
      const data = await Deno.readFile(absPath);
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const localHash = Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      return localHash !== existing.sha256;
    }

    // No sha256 in index, mtime differs → push
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

  /**
   * Groups index entries into partition buckets by partition key.
   * See `partitionKeyFromPath` for the key derivation rules.
   */
  private static groupEntriesByPartition(
    entries: Record<string, IndexEntry>,
  ): Map<string, Record<string, IndexEntry>> {
    const partitions = new Map<string, Record<string, IndexEntry>>();
    const dropped: string[] = [];

    for (const [rel, entry] of Object.entries(entries)) {
      const key = S3CacheSyncService.partitionKeyFromPath(rel);
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
        `[s3-sync] ${dropped.length} index entry/entries could not be partitioned and were skipped: ${
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
   * Writes partitioned index files to S3 alongside the monolithic index.
   * Used by the legacy pushChanged path. Non-fatal — errors are swallowed
   * because the monolith is still the source of truth in this code path.
   */
  private async writePartitionedIndex(
    index: DatastoreIndex,
    signal?: AbortSignal,
    dirtyKeys?: Set<string>,
  ): Promise<void> {
    const partitions = S3CacheSyncService.groupEntriesByPartition(
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
          () => this.s3.putObject(this.shardKey(key), data, signal),
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
            () => this.s3.putObject(this.metaKey(), metaData, signal),
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
   * definitions-evaluated/ are tolerated — only the data/ shard is
   * required for fallback decisions.
   */
  private async pullPartitionedIndex(
    models: ReadonlyArray<{ modelType: string; modelId: string }>,
    signal?: AbortSignal,
  ): Promise<Record<string, IndexEntry> | null> {
    const merged: Record<string, IndexEntry> = {};

    for (const model of models) {
      const keys = S3CacheSyncService.partitionKeysFromModel(
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
          () => this.s3.putObject(this.controlKey(key), data),
        );
      },
      get: async (key: string): Promise<Uint8Array | null> => {
        ensureBound();
        await this.ensurePreflight();
        try {
          const { data } = await retryWithBackoff(
            () => this.s3.getObject(this.controlKey(key)),
          );
          return data;
        } catch (error) {
          if (
            error instanceof Error &&
            (error.name === "NotFound" || error.name === "NoSuchKey")
          ) {
            return null;
          }
          throw error;
        }
      },
      delete: async (key: string): Promise<void> => {
        ensureBound();
        await this.ensurePreflight();
        await retryWithBackoff(
          () => this.s3.deleteObject(this.controlKey(key)),
        );
      },
      list: async (prefix: string): Promise<string[]> => {
        ensureBound();
        await this.ensurePreflight();
        const cpPrefix = this.controlPrefixPath();
        const entries = await retryWithBackoff(
          () => this.s3.listAllObjects(cpPrefix + prefix),
        );
        return entries.map((e) => e.key.slice(cpPrefix.length));
      },
      putIfAbsent: async (
        key: string,
        data: Uint8Array,
      ): Promise<boolean> => {
        ensureBound();
        await this.ensurePreflight();
        return await retryWithBackoff(
          () => this.s3.putObjectConditional(this.controlKey(key), data),
        );
      },
    };
  }

  async hydrateFile(
    relPath: string,
    options?: DatastoreSyncOptions,
  ): Promise<boolean> {
    return await getTracer().startActiveSpan(
      "s3-datastore hydrateFile",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_FILE, relPath);
          try {
            await this.pullFile(relPath, options?.signal);
            return true;
          } catch (error) {
            if (
              error instanceof Error &&
              (error.name === "NotFound" || error.name === "NoSuchKey")
            ) {
              return false;
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

  async exportCatalog(
    namespace: string,
    rows: CatalogExportRow[],
    signal?: AbortSignal,
  ): Promise<void> {
    return await getTracer().startActiveSpan(
      "s3-datastore exportCatalog",
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
            () => this.s3.putObject(key, data, signal),
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
      "s3-datastore pullForeignCatalogs",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_NAMESPACES, namespaces.length);
          const results: CatalogExportEntry[] = [];
          for (const ns of namespaces) {
            const key = `${ns}/.catalog-export.json`;
            try {
              const { data } = await this.s3.getObject(key, signal);
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
      "s3-datastore repairContamination",
      async (span) => {
        try {
          span.setAttribute(Attr.DATASTORE_DRY_RUN, !!options?.dryRun);
          span.setAttribute(Attr.DATASTORE_NAMESPACE, options?.namespace ?? "");
          const signal = options?.signal;
          const dryRun = options?.dryRun ?? true;

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
              () => this.s3.listAllObjects(nsPrefix, signal),
              { signal },
            ),
            retryWithBackoff(
              () => this.s3.listAllObjects(undefined, signal),
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
                  () => this.s3.deleteObject(key, signal),
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
              () => this.s3.deleteObject(this.indexKey(), signal),
              { signal },
            );
          } catch { /* may not exist */ }
          try {
            await retryWithBackoff(
              () => this.s3.deleteObject(this.metaKey(), signal),
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
      "s3-datastore fetchForeignContent",
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
            const { data } = await this.s3.getObject(key, signal);
            return data;
          } catch (error) {
            if (
              error instanceof Error &&
              (error.name === "NotFound" || error.name === "NoSuchKey")
            ) {
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
