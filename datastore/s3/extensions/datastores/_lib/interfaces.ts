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
 * Domain interfaces mirrored from swamp core.
 * Extensions must be self-contained — they cannot import from swamp internals.
 */

/** Metadata describing the current holder of a distributed lock. */
export interface LockInfo {
  /** Opaque identifier of the process currently holding the lock. */
  holder: string;
  /** Hostname of the machine holding the lock. */
  hostname: string;
  /** OS-level process ID of the holder. */
  pid: number;
  /** ISO-8601 timestamp when the lock was acquired. */
  acquiredAt: string;
  /** Lock lease duration in milliseconds. */
  ttlMs: number;
  /** Random per-acquisition nonce used by `forceRelease`. */
  nonce?: string;
  /** Caller-supplied key-value context embedded in the lock body. */
  context?: Record<string, string>;
}

/** Tuning knobs for a single lock acquisition attempt. */
export interface LockOptions {
  /** Override the default lock key; lets different workflows partition locks. */
  lockKey?: string;
  /** Namespace prefix for the lock key. When set, the lock key is scoped
   *  under {namespace}/ so IAM policies scoped to the namespace prefix
   *  can reach it. */
  namespace?: string;
  /** Lease duration in milliseconds before the lock auto-expires. */
  ttlMs?: number;
  /** Base delay between retries (exponential backoff starting point). */
  retryIntervalMs?: number;
  /** Upper bound on the total time spent waiting to acquire. */
  maxWaitMs?: number;
  /** Cap on the backoff interval between retries. Default: 8000ms. */
  maxRetryIntervalMs?: number;
  /** Caller-supplied context embedded in the lock body for diagnostics. */
  holderContext?: Record<string, string>;
}

/** Distributed mutex backing the datastore's write path. */
export interface DistributedLock {
  /** Blocks until the lock is held by the caller or `maxWaitMs` elapses. */
  acquire(): Promise<void>;
  /** Releases the lock if still held by this process; no-op otherwise. */
  release(): Promise<void>;
  /** Acquires the lock, runs `fn`, and releases regardless of the outcome. */
  withLock<T>(fn: () => Promise<T>): Promise<T>;
  /** Returns metadata about the current holder, or `null` if unlocked. */
  inspect(): Promise<LockInfo | null>;
  /** Force-releases the lock when the caller presents the holder's nonce. */
  forceRelease(expectedNonce: string): Promise<boolean>;
}

/** Result of a datastore health probe. */
export interface DatastoreHealthResult {
  /** `true` when the datastore is reachable and writable. */
  readonly healthy: boolean;
  /** Human-readable summary of the probe outcome. */
  readonly message: string;
  /** Round-trip latency for the probe, in milliseconds. */
  readonly latencyMs: number;
  /** Short identifier for the datastore implementation (e.g. `"s3"`, `"gcs"`). */
  readonly datastoreType: string;
  /** Free-form implementation-specific details surfaced by the probe. */
  readonly details?: Record<string, string>;
}

/** Runs a lightweight connectivity/credential probe against the datastore. */
export interface DatastoreVerifier {
  /** Executes the probe and returns a health snapshot. */
  verify(): Promise<DatastoreHealthResult>;
}

/** Model identity passed by core when scoped sync is active. */
export interface SyncModelRef {
  modelType: string;
  modelId: string;
}

/** Context provided by core to scoped sync operations. */
export interface SyncContext {
  models: SyncModelRef[];
}

/** Capabilities advertised by a sync service implementation. */
export interface SyncCapabilities {
  scopedSync: boolean;
  lazyHydration?: boolean;
  namespacedSync?: boolean;
  twoPhaseSync?: boolean;
  controlPlane?: boolean;
  configRefresh?: boolean;
}

/** Direct key-value store for small control-plane records. */
export interface ControlPlaneStore {
  put(key: string, data: Uint8Array): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  delete(key: string): Promise<void>;
  list(prefix: string): Promise<string[]>;
  putIfAbsent(key: string, data: Uint8Array): Promise<boolean>;
}

/**
 * Opaque manifest returned by {@link DatastoreSyncService.preparePush}
 * and consumed by {@link DatastoreSyncService.commitPush}.
 *
 * Core treats this as passthrough — it never inspects or validates the
 * contents. The extension defines what goes inside; core only
 * orchestrates when each phase runs.
 */
export type PushManifest = { readonly __brand: unique symbol };

/** Optional flags passed to a sync operation. */
export interface DatastoreSyncOptions {
  /**
   * Cancellation signal forwarded to every in-flight S3 request. When the
   * signal fires, pending requests abort, retry backoff sleeps wake, and
   * the top-level promise rejects with `AbortError` — no further work is
   * scheduled. Added so swamp core's outer sync timeout can actually stop
   * in-flight work instead of leaking it past the deadline.
   */
  signal?: AbortSignal;
  /** Cache-relative path of the directory that was dirtied. */
  relPath?: string;
  /** Scoped sync context provided by core when capabilities().scopedSync is true. */
  context?: SyncContext;
  /** When true, skip downloading raw content files under data/ — pull only metadata.yaml, latest pointers, and non-data files. */
  metadataOnly?: boolean;
  /** Namespace for multi-repo shared datastores. When set, scopes index and data operations to {namespace}/ prefix. */
  namespace?: string;
  /**
   * Restricts `pullChanged` to the listed datastore subdirectories.
   * When set, the extension SHOULD only pull paths under these prefixes
   * instead of walking the entire datastore. Extensions that advertise
   * `configRefresh` in their capabilities SHOULD honor this option;
   * extensions that don't can safely ignore it and pull everything.
   *
   * Used by the ConfigPoller to efficiently refresh only the `config/`
   * prefix without pulling runtime data.
   */
  subdirs?: readonly string[];
}

/** A single row in a namespace catalog export. */
export interface CatalogExportRow {
  relPath: string;
  size: number;
  lastModified: string;
  sha256?: string;
}

/** A catalog export entry returned by pullForeignCatalogs. */
export interface CatalogExportEntry {
  namespace: string;
  rows: CatalogExportRow[];
}

/** Moves data between the local cache directory and the remote datastore. */
export interface DatastoreSyncService {
  /** Downloads new or changed objects; returns the count synced where known. */
  pullChanged(options?: DatastoreSyncOptions): Promise<number | void>;
  /** Uploads new or changed local objects; returns the count synced where known. */
  pushChanged(options?: DatastoreSyncOptions): Promise<number | void>;
  /**
   * Signal that the local cache has uncommitted work. Must be called
   * by swamp-core before (or immediately after) any write into the
   * cache directory that does not route through a sync-service
   * method. Invalidates the fast-path short-circuit so the next
   * `pushChanged` performs a full walk + upload. No-op on
   * implementations without a fast-path optimization.
   */
  markDirty(options?: DatastoreSyncOptions): Promise<void>;
  /** Advertises sync capabilities to the framework. */
  capabilities?(): SyncCapabilities;
  /** Downloads a single file by its cache-relative path on demand. */
  hydrateFile?(
    relPath: string,
    options?: DatastoreSyncOptions,
  ): Promise<boolean>;
  /** Writes a catalog export JSON to {namespace}/.catalog-export.json. */
  exportCatalog?(
    namespace: string,
    rows: CatalogExportRow[],
    signal?: AbortSignal,
  ): Promise<void>;
  /** Fetches catalog exports from foreign namespaces. Skips missing/malformed silently. */
  pullForeignCatalogs?(
    namespaces: string[],
    signal?: AbortSignal,
  ): Promise<CatalogExportEntry[]>;
  /** Downloads a single file from a foreign namespace. Returns bytes or null if missing. */
  fetchForeignContent?(
    namespace: string,
    relPath: string,
    signal?: AbortSignal,
  ): Promise<Uint8Array | null>;
  /** Phase 1 of two-phase push: upload changed files to the remote. */
  preparePush?(options?: DatastoreSyncOptions): Promise<PushManifest>;
  /** Phase 2 of two-phase push: merge the manifest into the remote index. */
  commitPush?(
    manifest: PushManifest,
    options?: DatastoreSyncOptions,
  ): Promise<number | void>;
  /** Returns a direct key-value store for small control-plane records. */
  controlPlaneStore?(): ControlPlaneStore;
}

/** Options for the namespace contamination repair operation. */
export interface RepairNamespaceContaminationOptions {
  signal?: AbortSignal;
  namespace?: string;
  /** true = detect only, false = delete + rebuild index. Defaults to true. */
  dryRun?: boolean;
}

/** Summary of foreign namespace objects found (and optionally deleted). */
export interface NamespaceContaminationSummary {
  foreignNamespaces: ReadonlyArray<{
    namespace: string;
    objectCount: number;
  }>;
  totalForeignObjects: number;
  /** Number of foreign objects deleted. Zero when dryRun is true. */
  deleted: number;
}

/** Factory that produces the datastore's lock, verifier, and sync service. */
export interface DatastoreProvider {
  /** Constructs a distributed lock scoped to `datastorePath`. */
  createLock(datastorePath: string, options?: LockOptions): DistributedLock;
  /** Constructs a health-probe verifier for this datastore. */
  createVerifier(): DatastoreVerifier;
  /** Optional factory for a cache-sync service, when the datastore supports it. */
  createSyncService?(repoDir: string, cachePath: string): DatastoreSyncService;
  /** Resolves the logical datastore path rooted at `repoDir`. */
  resolveDatastorePath(repoDir: string): string;
  /** Optional hook to override the local cache path, keyed by `repoDir`. */
  resolveCachePath?(repoDir: string): string | undefined;
  /** Registers a namespace manifest in the remote datastore for conflict detection. */
  registerNamespace?(
    datastorePath: string,
    namespace: string,
    repoId: string,
  ): Promise<void>;
  /** Lists all registered namespaces in the remote datastore. */
  listNamespaces?(datastorePath: string): Promise<string[]>;
}
