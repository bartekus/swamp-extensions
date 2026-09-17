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

// Tests for S3CacheSyncService focusing on the swamp-club#29 fix:
// the sync walker and index scrub must keep internal files
// (including the SQLite catalog at `_catalog.db*`) from crossing the
// sync boundary in either direction, and zombie entries from pre-fix
// remote indexes must self-heal via the `indexMutated` flag.

import {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
} from "jsr:@std/assert@1.0.19";
import { join } from "jsr:@std/path@1";
import { ensureDir } from "jsr:@std/fs@1";
import {
  isInsideNamespaceDir,
  isInternalCacheFile,
  isLazySkippable,
  isRetryableError,
  retryWithBackoff,
  S3CacheSyncService,
} from "./s3_cache_sync.ts";
import { S3Client, S3OperationError } from "./s3_client.ts";

/** Creates an error that matches the SDK's "object not found" shape. */
function makeNoSuchKeyError(key: string): Error {
  const err = new Error(`NoSuchKey: ${key}`);
  err.name = "NoSuchKey";
  return err;
}

/** Captured putObject call for test assertions. */
interface PutCall {
  key: string;
  body: Uint8Array;
}

/**
 * Deterministic content-derived ETag, surrounded by quotes to mirror
 * the real S3 wire format. Different bodies produce different ETags;
 * identical bodies produce identical ETags.
 */
function fakeETag(body: Uint8Array): string {
  let h = 0xdeadbeef >>> 0;
  for (const b of body) {
    h = ((h ^ b) * 16777619) >>> 0;
  }
  return `"${h.toString(16).padStart(8, "0")}"`;
}

/**
 * In-memory mock of S3Client recording getObject/putObject/headObject/
 * listAllObjects calls. `etagOverrides` lets a test pin a specific
 * ETag (for example a multipart-shaped one) regardless of stored
 * content.
 */
function createMockS3Client(): S3Client & {
  storage: Map<string, Uint8Array>;
  etagOverrides: Map<string, string>;
  puts: PutCall[];
  gets: string[];
  heads: string[];
  deletes: string[];
  lists: number;
} {
  const storage = new Map<string, Uint8Array>();
  const etagOverrides = new Map<string, string>();
  const puts: PutCall[] = [];
  const gets: string[] = [];
  const heads: string[] = [];
  const deletes: string[] = [];
  const counters = { lists: 0 };

  const etagFor = (key: string, body: Uint8Array): string =>
    etagOverrides.get(key) ?? fakeETag(body);

  return {
    storage,
    etagOverrides,
    puts,
    gets,
    heads,
    deletes,
    get lists() {
      return counters.lists;
    },

    deleteObject(key: string, _signal?: AbortSignal): Promise<void> {
      deletes.push(key);
      storage.delete(key);
      return Promise.resolve();
    },

    copyObject(
      sourceKey: string,
      destKey: string,
    ): Promise<void> {
      const data = storage.get(sourceKey);
      if (!data) return Promise.reject(makeNoSuchKeyError(sourceKey));
      storage.set(destKey, data);
      return Promise.resolve();
    },

    putObject(key: string, body: Uint8Array): Promise<{ etag: string }> {
      storage.set(key, body);
      puts.push({ key, body });
      return Promise.resolve({ etag: etagFor(key, body) });
    },

    putObjectConditional(key: string, body: Uint8Array): Promise<boolean> {
      if (storage.has(key)) {
        return Promise.resolve(false);
      }
      storage.set(key, body);
      puts.push({ key, body });
      return Promise.resolve(true);
    },

    putObjectIfMatch(
      key: string,
      body: Uint8Array,
      etag: string | null,
    ): Promise<{ etag: string } | null> {
      const current = storage.get(key);
      const currentETag = current ? etagFor(key, current) : null;
      if (currentETag !== etag) return Promise.resolve(null);
      storage.set(key, body);
      puts.push({ key, body });
      return Promise.resolve({ etag: etagFor(key, body) });
    },

    getObject(
      key: string,
    ): Promise<{ data: Uint8Array; etag?: string }> {
      gets.push(key);
      const data = storage.get(key);
      if (!data) return Promise.reject(makeNoSuchKeyError(key));
      return Promise.resolve({ data, etag: etagFor(key, data) });
    },

    headObject(
      key: string,
    ): Promise<
      { exists: boolean; size?: number; lastModified?: Date; etag?: string }
    > {
      heads.push(key);
      const data = storage.get(key);
      if (!data) return Promise.resolve({ exists: false });
      return Promise.resolve({
        exists: true,
        size: data.length,
        etag: etagFor(key, data),
      });
    },

    listAllObjects(subPrefix?: string): Promise<
      Array<{
        key: string;
        size: number;
        etag?: string;
        lastModified?: Date;
      }>
    > {
      counters.lists++;
      const entries = [...storage.entries()]
        .filter(([key]) => !subPrefix || key.startsWith(subPrefix))
        .map(([key, body]) => ({
          key,
          size: body.length,
          etag: etagFor(key, body),
        }));
      return Promise.resolve(entries);
    },

    preflightCredentials(): Promise<void> {
      return Promise.resolve();
    },
  } as unknown as S3Client & {
    storage: Map<string, Uint8Array>;
    etagOverrides: Map<string, string>;
    puts: PutCall[];
    gets: string[];
    heads: string[];
    deletes: string[];
    lists: number;
  };
}

/** Seeds a file inside the cache directory, creating parent dirs. */
async function seedFile(
  cachePath: string,
  relPath: string,
  contents: string,
): Promise<void> {
  const full = join(cachePath, relPath);
  const parent = full.substring(0, full.lastIndexOf("/"));
  if (parent && parent !== cachePath) {
    await Deno.mkdir(parent, { recursive: true });
  } else {
    await Deno.mkdir(cachePath, { recursive: true });
  }
  await Deno.writeTextFile(full, contents);
}

/** Encodes an index object as a remote .datastore-index.json body. */
function encodeIndex(
  entries: Record<string, {
    key: string;
    size: number;
    lastModified: string;
    localMtime?: string;
    sha256?: string;
  }>,
): Uint8Array {
  return new TextEncoder().encode(
    JSON.stringify({
      version: 1,
      lastPulled: new Date().toISOString(),
      entries,
    }),
  );
}

/** Decodes a recorded putObject body as a parsed index object. */
function decodeIndex(body: Uint8Array): {
  entries: Record<string, unknown>;
} {
  return JSON.parse(new TextDecoder().decode(body));
}

/** Type assertion helper for reaching private instance state in tests. */
function privateState(service: S3CacheSyncService): {
  index: { entries: Record<string, unknown> } | null;
  indexMutated: boolean;
} {
  return service as unknown as {
    index: { entries: Record<string, unknown> } | null;
    indexMutated: boolean;
  };
}

// -- (a) push skips _catalog.db, _catalog.db-shm, _catalog.db-wal ----------

Deno.test("pushChanged: skips _catalog.db and its WAL/SHM sidecars", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-a-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    // Seed legitimate payload plus catalog files plus internal files.
    await seedFile(cachePath, "data/@my-model/payload.yaml", "name: x\n");
    await seedFile(cachePath, "data/_catalog.db", "SQLITE-MAIN");
    await seedFile(cachePath, "data/_catalog.db-shm", "SQLITE-SHM");
    await seedFile(cachePath, "data/_catalog.db-wal", "SQLITE-WAL");

    await service.pushChanged();

    // Expect exactly two puts: the legitimate payload plus the
    // index write-back. Nothing matching _catalog.db*.
    const uploadedKeys = mock.puts.map((p) => p.key);
    assertEquals(
      uploadedKeys.includes("data/@my-model/payload.yaml"),
      true,
      "legitimate payload should be pushed",
    );
    for (const key of uploadedKeys) {
      assertEquals(
        key.includes("_catalog.db"),
        false,
        `catalog file leaked: ${key}`,
      );
    }
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (b) push still skips the pre-existing three internal files -----------

Deno.test("pushChanged: still skips .datastore-index.json/.push-queue.json/.datastore.lock", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-b-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    // Seed a valid empty index so loadIndex succeeds, then seed the
    // other two internal files as raw walk-targets. The assertion is
    // that the walker skips them, not that loadIndex parses them.
    await seedFile(cachePath, "data/ok.yaml", "ok: true\n");
    await seedFile(
      cachePath,
      ".datastore-index.json",
      JSON.stringify({
        version: 1,
        lastPulled: new Date().toISOString(),
        entries: {},
      }),
    );
    await seedFile(cachePath, ".push-queue.json", "{}");
    await seedFile(cachePath, ".datastore.lock", "lock");

    await service.pushChanged();

    const uploadedKeys = mock.puts.map((p) => p.key);
    // Only the payload plus the index write-back. Internal files
    // must never appear as standalone put targets.
    assertEquals(
      uploadedKeys.filter((k) => k === ".push-queue.json").length,
      0,
    );
    assertEquals(
      uploadedKeys.filter((k) => k === ".datastore.lock").length,
      0,
    );
    assertEquals(uploadedKeys.includes("data/ok.yaml"), true);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (c) walker skip is a safety net beyond scrub -------------------------

Deno.test("pullChanged walker: skips zombies even if re-injected post-scrub", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-c-" });
  try {
    const mock = createMockS3Client();
    // Seed a CLEAN remote index (no zombies). pullIndex will fetch this,
    // scrub is a no-op, then we manually inject a zombie entry before
    // the walker runs to prove the walker's own skip is load-bearing.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/ok.yaml": {
          key: "data/@m/ok.yaml",
          size: 8,
          lastModified: new Date().toISOString(),
        },
      }),
    );
    // Pre-populate the legitimate local file so pullChanged doesn't
    // have to fetch it (size match → skip).
    await seedFile(cachePath, "data/@m/ok.yaml", "ok: yes\n");

    const service = new S3CacheSyncService(mock, cachePath);
    // Force pullIndex first so we can mutate the in-memory index
    // AFTER scrub has already run.
    await service.pullIndex();

    // Inject a zombie entry directly into the in-memory index, bypassing
    // scrub. The walker must still skip this via isInternalCacheFile.
    const state = privateState(service);
    assertExists(state.index);
    state.index.entries["data/_catalog.db-wal"] = {
      key: "data/_catalog.db-wal",
      size: 1024,
      lastModified: new Date().toISOString(),
    };

    await service.pullChanged();

    // The walker must not have tried to fetch the injected zombie.
    assertEquals(
      mock.gets.includes("data/_catalog.db-wal"),
      false,
      "walker must skip zombies regardless of whether scrub caught them",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (d) pull skips zombies from the remote index -------------------------

Deno.test("pullChanged: skips zombie _catalog.db* entries from remote index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-d-" });
  try {
    const mock = createMockS3Client();
    // Remote index contains both a legitimate entry and a zombie.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/payload.yaml": {
          key: "data/@m/payload.yaml",
          size: 5,
          lastModified: new Date().toISOString(),
        },
        "data/_catalog.db-wal": {
          key: "data/_catalog.db-wal",
          size: 999,
          lastModified: new Date().toISOString(),
        },
      }),
    );
    // Fake remote payload so pullChanged's fetch succeeds.
    mock.storage.set(
      "data/@m/payload.yaml",
      new TextEncoder().encode("hi!\n\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    assertEquals(
      mock.gets.includes("data/@m/payload.yaml"),
      true,
      "legitimate payload must be fetched",
    );
    assertEquals(
      mock.gets.includes("data/_catalog.db-wal"),
      false,
      "zombie must not be fetched",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (e1) pullIndex S3-fetch path scrubs in-memory AND rewrites local ----

Deno.test("pullIndex S3-fetch path: scrubs in-memory and rewrites local cache file", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-e1-" });
  try {
    const mock = createMockS3Client();
    // Remote index has zombies. No local cache file yet → forces the
    // S3-fetch branch.
    const polluted = {
      "data/@m/ok.yaml": {
        key: "data/@m/ok.yaml",
        size: 3,
        lastModified: new Date().toISOString(),
      },
      "data/_catalog.db": {
        key: "data/_catalog.db",
        size: 100,
        lastModified: new Date().toISOString(),
      },
      "data/_catalog.db-wal": {
        key: "data/_catalog.db-wal",
        size: 200,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(".datastore-index.json", encodeIndex(polluted));

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullIndex();

    // In-memory state: zombies gone.
    const state = privateState(service);
    assertExists(state.index);
    assertEquals(
      Object.keys(state.index.entries).sort(),
      ["data/@m/ok.yaml"],
      "in-memory index should contain only the legitimate entry",
    );
    assertEquals(
      state.indexMutated,
      true,
      "indexMutated must be set after scrubbing zombies",
    );

    // Local cache file at <cachePath>/.datastore-index.json must
    // have been rewritten with the scrubbed JSON, not the raw
    // polluted text.
    const localFile = await Deno.readTextFile(
      join(cachePath, ".datastore-index.json"),
    );
    const localParsed = JSON.parse(localFile) as {
      entries: Record<string, unknown>;
    };
    assertEquals(
      Object.keys(localParsed.entries).sort(),
      ["data/@m/ok.yaml"],
      "local cache file must match scrubbed in-memory view",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (e2) pullIndex cache-hit path scrubs in-memory only -----------------

// The cache-hit branch (local `.datastore-index.json` fresh under the
// TTL) must still scrub zombie entries from the in-memory view so the
// rest of the sync pipeline sees a clean index — but it must NOT
// rewrite the local file. Propagation of the scrub to the remote does
// not ride through this path anymore: since swamp-club#30 we
// force-remote on pushChanged, so remote zombies are scrubbed when
// they are actually fetched (covered by test (f)).

Deno.test("pullIndex cache-hit path: scrubs in-memory and leaves local file untouched", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-e2-" });
  try {
    const mock = createMockS3Client();

    // Pre-seed a POLLUTED local cache file so pullIndex takes the
    // cache-hit branch. Remote index is left empty — we must never
    // call getObject for it on this path.
    const pollutedJson = JSON.stringify({
      version: 1,
      lastPulled: new Date().toISOString(),
      entries: {
        "data/@m/ok.yaml": {
          key: "data/@m/ok.yaml",
          size: 3,
          lastModified: new Date().toISOString(),
        },
        "data/_catalog.db-wal": {
          key: "data/_catalog.db-wal",
          size: 42,
          lastModified: new Date().toISOString(),
        },
      },
    });
    await seedFile(cachePath, ".datastore-index.json", pollutedJson);

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullIndex();

    // Must have taken the cache-hit branch (no remote fetch).
    assertEquals(
      mock.gets.includes(".datastore-index.json"),
      false,
      "cache-hit branch must not fetch the index from S3",
    );

    // In-memory state is scrubbed.
    const state = privateState(service);
    assertExists(state.index);
    assertEquals(Object.keys(state.index.entries).sort(), ["data/@m/ok.yaml"]);
    assertEquals(state.indexMutated, true);

    // The on-disk file is NOT rewritten by the cache-hit branch.
    const diskJson = await Deno.readTextFile(
      join(cachePath, ".datastore-index.json"),
    );
    assertEquals(
      diskJson,
      pollutedJson,
      "cache-hit branch must not rewrite the local index file",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (h) self-healing discovery for unindexed buckets (swamp-club #225) ---

// Test A — discovery from a populated bucket without an index.
// pullIndex's NotFound branch must list, build, and publish a synthesized
// index whose entries match the listing exactly (no extras, no
// omissions, sizes match).
Deno.test("pullIndex: discovers files when remote index is missing (swamp-club #225)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-225-A-" });
  try {
    const mock = createMockS3Client();
    // Bucket has data files but no .datastore-index.json.
    mock.storage.set(
      "data/@org/m/payload-1.yaml",
      new TextEncoder().encode("hello\n"),
    );
    mock.storage.set(
      "data/@org/m/payload-2.yaml",
      new TextEncoder().encode("world!\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    const fingerprint = await (service as unknown as {
      pullIndex: (
        opts: { forceRemote: boolean },
      ) => Promise<string | null>;
    }).pullIndex({ forceRemote: true });

    // 1. discovery wrote the index back
    const indexPut = mock.puts.find((p) => p.key === ".datastore-index.json");
    assertExists(indexPut, "discovery must publish a synthesized index");

    // 2. synthesized index entries match the listing EXACTLY
    const synthesized = JSON.parse(new TextDecoder().decode(indexPut.body));
    assertEquals(
      Object.keys(synthesized.entries).sort(),
      ["data/@org/m/payload-1.yaml", "data/@org/m/payload-2.yaml"],
      "synthesized index keys must match the bucket listing exactly",
    );
    assertEquals(synthesized.entries["data/@org/m/payload-1.yaml"].size, 6);
    assertEquals(synthesized.entries["data/@org/m/payload-2.yaml"].size, 7);

    // 3. fingerprint returned (the put response ETag) so the caller's
    //    slow-path bookkeeping behaves like a normal index fetch
    assertExists(fingerprint, "discovery must return a fingerprint ETag");

    // 4. in-memory index reflects discovery
    const state = privateState(service);
    assertExists(state.index);
    assertEquals(
      Object.keys(state.index.entries).sort(),
      ["data/@org/m/payload-1.yaml", "data/@org/m/payload-2.yaml"],
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// Test B — pullChanged hydrates everything after discovery.
Deno.test("pullChanged: hydrates an unindexed bucket via discovery (swamp-club #225)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-225-B-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(
      "data/@org/m/a.yaml",
      new TextEncoder().encode("alpha\n"),
    );
    mock.storage.set(
      "data/@org/m/b.yaml",
      new TextEncoder().encode("beta\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    const pulled = await service.pullChanged();
    assertEquals(pulled, 2, "both files must be downloaded");

    const aOnDisk = await Deno.readTextFile(
      join(cachePath, "data/@org/m/a.yaml"),
    );
    const bOnDisk = await Deno.readTextFile(
      join(cachePath, "data/@org/m/b.yaml"),
    );
    assertEquals(aOnDisk, "alpha\n");
    assertEquals(bOnDisk, "beta\n");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// Test C — discovery filters internal cache files.
Deno.test("pullIndex discovery: skips internal cache files (swamp-club #225)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-225-C-" });
  try {
    const mock = createMockS3Client();
    // One legitimate data file, plus three classes of internal files
    // that must NEVER appear in a synthesized index: lock, push-queue,
    // and a SQLite catalog file.
    mock.storage.set(
      "data/@org/m/legit.yaml",
      new TextEncoder().encode("ok\n"),
    );
    mock.storage.set(
      ".datastore.lock",
      new TextEncoder().encode("lock-data"),
    );
    mock.storage.set(
      ".push-queue.json",
      new TextEncoder().encode("[]"),
    );
    mock.storage.set(
      "data/_catalog.db",
      new TextEncoder().encode("SQLITE-MAIN"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await (service as unknown as {
      pullIndex: (
        opts: { forceRemote: boolean },
      ) => Promise<string | null>;
    }).pullIndex({ forceRemote: true });

    const indexPut = mock.puts.find((p) => p.key === ".datastore-index.json");
    assertExists(indexPut);
    const synthesized = JSON.parse(new TextDecoder().decode(indexPut.body));
    assertEquals(
      Object.keys(synthesized.entries).sort(),
      ["data/@org/m/legit.yaml"],
      "synthesized index must contain only the legit file",
    );
    for (
      const internal of [
        ".datastore.lock",
        ".push-queue.json",
        "data/_catalog.db",
      ]
    ) {
      assertEquals(
        synthesized.entries[internal],
        undefined,
        `internal cache file must not appear in synthesized index: ${internal}`,
      );
    }
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// Test D — empty bucket regression pin: brand-new-bucket fallthrough is
// preserved. No PutObject must fire; in-memory entries must be {}.
Deno.test("pullIndex discovery: empty bucket initializes v2 _meta.json (fresh datastore starts shard-first)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-225-D-" });
  try {
    const mock = createMockS3Client();
    // Storage is intentionally empty.
    const service = new S3CacheSyncService(mock, cachePath);
    const fingerprint = await (service as unknown as {
      pullIndex: (
        opts: { forceRemote: boolean },
      ) => Promise<string | null>;
    }).pullIndex({ forceRemote: true });

    assertEquals(
      fingerprint,
      null,
      "empty-bucket fallthrough must return null fingerprint",
    );
    const indexPut = mock.puts.find((p) => p.key === ".datastore-index.json");
    assertEquals(
      indexPut,
      undefined,
      "no monolithic index PutObject must fire on a genuinely empty bucket",
    );
    const state = privateState(service);
    assertExists(state.index);
    assertEquals(
      Object.keys(state.index.entries).length,
      0,
      "in-memory entries must be empty for a brand-new bucket",
    );
    // Verify _meta.json v2 was written
    const metaPut = mock.puts.find((p) => p.key === "_index/_meta.json");
    assertExists(metaPut, "empty bucket must write _meta.json for v2 init");
    const meta = JSON.parse(new TextDecoder().decode(metaPut.body));
    assertEquals(meta.version, 2, "_meta.json must be version 2");
    assertEquals(meta.commitSeq, 0, "commitSeq must start at 0");
    assertEquals(meta.partitions, [], "partitions must be empty");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: fresh empty bucket uses shard-first v2 path (no monolithic index written)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-fresh-v2-" });
  try {
    const mock = createMockS3Client();
    // Local cache has a file ready to push.
    await seedFile(cachePath, "data/@org/m/id/latest", "id");
    await seedFile(cachePath, "data/@org/m/id/metadata.yaml", "kind: test\n");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "data/@org/m/id" });
    const pushed = await service.pushChanged();
    assertEquals(pushed, 2, "two local files should push");

    // Verify v2 path was used: _meta.json should exist with commitSeq 1
    // (0 from init + 1 from the push writeback).
    const metaData = mock.storage.get("_index/_meta.json");
    assertExists(metaData, "_meta.json must exist after push");
    const meta = JSON.parse(new TextDecoder().decode(metaData));
    assertEquals(meta.version, 2, "_meta.json must be version 2");
    assertEquals(meta.commitSeq, 1, "commitSeq must be 1 after first push");

    // Verify NO monolithic index was written — shard-first v2 skips it.
    const monolithPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assertEquals(
      monolithPuts.length,
      0,
      "fresh v2 path must NOT write monolithic .datastore-index.json",
    );

    // Verify shard files were written.
    const shardPut = mock.puts.find((p) =>
      p.key.startsWith("_index/") && p.key !== "_index/_meta.json"
    );
    assertExists(shardPut, "shard index file must be written");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("commitPush: fresh empty bucket uses shard-first v2 path", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-fresh-v2-commit-",
  });
  try {
    const mock = createMockS3Client();
    // Local cache has a file ready to push.
    await seedFile(cachePath, "data/@org/m/id/latest", "id");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "data/@org/m/id" });
    const manifest = await service.preparePush!();
    const result = await service.commitPush!(manifest);
    assertEquals(result, 1, "one file should be committed");

    // Verify v2 meta was written
    const metaData = mock.storage.get("_index/_meta.json");
    assertExists(metaData, "_meta.json must exist after commitPush");
    const meta = JSON.parse(new TextDecoder().decode(metaData));
    assertEquals(meta.version, 2, "_meta.json must be version 2");
    assert(meta.commitSeq >= 1, "commitSeq must be >= 1");

    // Verify NO monolithic index was written
    const monolithPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assertEquals(
      monolithPuts.length,
      0,
      "fresh v2 commitPush must NOT write monolithic .datastore-index.json",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// Test E — pushChanged side benefit. Previously, push against an
// unindexed populated bucket would write an index reflecting only LOCAL
// files, dropping existing remote entries from the index even though
// the storage still held them. With discovery in pullIndex, push first
// builds a complete merged view.
Deno.test("pushChanged: against unindexed populated bucket builds a complete index (swamp-club #225 side benefit)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-225-E-" });
  try {
    const mock = createMockS3Client();
    // Remote has a pre-existing data file but no index.
    mock.storage.set(
      "data/@org/m/remote-only.yaml",
      new TextEncoder().encode("remote\n"),
    );
    // Local cache has a different file ready to push.
    await seedFile(cachePath, "data/@org/m/local-only.yaml", "local\n");

    const service = new S3CacheSyncService(mock, cachePath);
    const pushed = await service.pushChanged();
    assertEquals(pushed, 1, "exactly one local file should push");

    // Final remote index must contain BOTH the remote-only and the
    // local-only entry — the pre-existing remote file is NOT lost.
    const indexPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assertExists(indexPuts.at(-1), "pushChanged must publish an index");
    const finalIndex = JSON.parse(
      new TextDecoder().decode(indexPuts.at(-1)!.body),
    );
    assertEquals(
      Object.keys(finalIndex.entries).sort(),
      [
        "data/@org/m/local-only.yaml",
        "data/@org/m/remote-only.yaml",
      ],
      "merged index must contain both the remote-discovered and local-pushed entries",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (g) push merges remote index instead of clobbering it ----------------

// Regression test for swamp-club#30: without the fix, a client whose
// local cache has fewer files than the remote index will overwrite the
// remote `.datastore-index.json` with a subset of entries on push,
// orphaning the remote data objects. Exercised in production by
// `datastore setup` on a reader-side repo, which invokes pushChanged
// against a near-empty local cache before the reader has pulled.

Deno.test("pushChanged: preserves remote index entries for files absent from local cache", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-g-" });
  try {
    const mock = createMockS3Client();

    // Remote already has 5 entries from a prior writer. None of the
    // corresponding files are present on the reader's local disk.
    const remoteEntries = {
      "data/@writer/alpha.yaml": {
        key: "data/@writer/alpha.yaml",
        size: 10,
        lastModified: new Date().toISOString(),
      },
      "data/@writer/beta.yaml": {
        key: "data/@writer/beta.yaml",
        size: 20,
        lastModified: new Date().toISOString(),
      },
      "data/@writer/gamma.yaml": {
        key: "data/@writer/gamma.yaml",
        size: 30,
        lastModified: new Date().toISOString(),
      },
      "data/@writer/delta.yaml": {
        key: "data/@writer/delta.yaml",
        size: 40,
        lastModified: new Date().toISOString(),
      },
      "data/@writer/epsilon.yaml": {
        key: "data/@writer/epsilon.yaml",
        size: 50,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(".datastore-index.json", encodeIndex(remoteEntries));

    // Reader's local cache has exactly one new file, the kind of
    // bootstrap artifact `datastore setup` produces.
    await seedFile(cachePath, "data/@reader/new.yaml", "reader: added\n");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pushChanged();

    const indexPuts = mock.puts.filter(
      (p) => p.key === ".datastore-index.json",
    );
    assertEquals(
      indexPuts.length,
      1,
      "index must be written back exactly once",
    );
    const pushedIndex = decodeIndex(indexPuts[0].body);
    const keys = Object.keys(pushedIndex.entries).sort();
    assertEquals(
      keys.length,
      6,
      `expected 6 entries (5 remote + 1 new local), got ${keys.length}: ${
        keys.join(", ")
      }`,
    );
    assertEquals(
      keys.includes("data/@reader/new.yaml"),
      true,
      "new local file must be added to the index",
    );
    for (const remoteKey of Object.keys(remoteEntries)) {
      assertEquals(
        keys.includes(remoteKey),
        true,
        `remote entry must be preserved: ${remoteKey}`,
      );
    }

    // The writer's data objects themselves must NOT be re-uploaded —
    // pushChanged only walks local files.
    const uploadedDataKeys = mock.puts
      .map((p) => p.key)
      .filter((k) => k !== ".datastore-index.json");
    assertEquals(
      uploadedDataKeys,
      ["data/@reader/new.yaml"],
      "only the new local file should be uploaded",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (f) pushChanged scrubs remote zombies and is idempotent --------------

// Migration path for swamp-club#29: when the remote `.datastore-index.json`
// contains zombie `_catalog.db*` entries from a pre-fix writer, the
// first fixed client to pushChanged must fetch, scrub, and write back
// a clean index — even on a no-op push (no local files to upload). A
// subsequent push against the now-clean remote must be a no-op with
// no redundant index writeback.

Deno.test("pushChanged: scrubs remote zombies and writes back clean, second call is quiet", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-f-" });
  try {
    const mock = createMockS3Client();

    // Seed remote with a zombie-only index (the pre-fix migration state).
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/_catalog.db-wal": {
          key: "data/_catalog.db-wal",
          size: 42,
          lastModified: new Date().toISOString(),
        },
      }),
    );

    const service = new S3CacheSyncService(mock, cachePath);

    // First push: no files to push, but remote scrub triggered the flag.
    await service.pushChanged();

    const firstIndexPuts = mock.puts.filter(
      (p) => p.key === ".datastore-index.json",
    );
    assertEquals(
      firstIndexPuts.length,
      1,
      "first pushChanged must write scrubbed index despite pushed=0",
    );
    const firstPushed = decodeIndex(firstIndexPuts[0].body);
    assertEquals(
      Object.keys(firstPushed.entries).length,
      0,
      "scrubbed index must contain no zombie entries",
    );

    // Second push on the same instance: remote is now clean, no-op.
    await service.pushChanged();

    const secondIndexPuts = mock.puts.filter(
      (p) => p.key === ".datastore-index.json",
    );
    assertEquals(
      secondIndexPuts.length,
      1,
      "second pushChanged must NOT rewrite — remote already clean, flag reset",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (h) pushChanged aborts on transient remote fetch errors --------------

// Since swamp-club#30, pushChanged force-fetches the remote index on
// every call. That means any non-NotFound error from the fetch (5xx,
// auth failure, network timeout) must propagate — otherwise a
// transient blip would leave us with an empty in-memory index, which
// the subsequent writeback would push to the remote and silently wipe
// the real index.

Deno.test("pushChanged: propagates non-NotFound remote errors and skips writeback", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-h-" });
  try {
    const puts: PutCall[] = [];
    const mock = {
      putObject(key: string, body: Uint8Array): Promise<void> {
        puts.push({ key, body });
        return Promise.resolve();
      },
      getObject(
        _key: string,
      ): Promise<{ data: Uint8Array; etag?: string }> {
        // Simulate a transient 5xx: generic Error with no matching name.
        return Promise.reject(new Error("500 Internal Server Error"));
      },
      preflightCredentials(): Promise<void> {
        return Promise.resolve();
      },
    } as unknown as S3Client;

    await seedFile(cachePath, "data/@m/payload.yaml", "data\n");

    const service = new S3CacheSyncService(mock, cachePath);

    await assertRejects(
      () => service.pushChanged(),
      Error,
      "500",
      "pushChanged must propagate non-NotFound remote errors",
    );

    assertEquals(
      puts.length,
      0,
      "no putObject calls allowed — a failed remote fetch must not trigger a writeback that could wipe the real remote index",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- DEF-2: retry + classification + batch failure message ------------------

/** Build an S3OperationError carrying a specific HTTP status. */
function opError(status: number): S3OperationError {
  return new S3OperationError(`S3 test failed HTTP ${status}`, {
    name: "TestError",
    cause: new Error("test"),
    httpStatusCode: status,
    code: "TestError",
    requestId: "r",
    bodyPreview: undefined,
  });
}

Deno.test("isRetryableError: 5xx and 429 are retryable, 4xx is not", () => {
  assertEquals(isRetryableError(opError(500)), true);
  assertEquals(isRetryableError(opError(503)), true);
  assertEquals(isRetryableError(opError(429)), true);
  assertEquals(isRetryableError(opError(403)), false);
  assertEquals(isRetryableError(opError(404)), false);
  assertEquals(isRetryableError(opError(412)), false);
});

Deno.test("isRetryableError: TimeoutError retryable, AbortError not", () => {
  const timeout = new Error("timed out");
  timeout.name = "TimeoutError";
  assertEquals(isRetryableError(timeout), true);

  const abort = new Error("aborted");
  abort.name = "AbortError";
  assertEquals(isRetryableError(abort), false);
});

Deno.test("retryWithBackoff: succeeds after transient 500", async () => {
  let attempts = 0;
  const result = await retryWithBackoff(() => {
    attempts++;
    if (attempts < 2) return Promise.reject(opError(500));
    return Promise.resolve("ok");
  }, { maxAttempts: 3, baseDelayMs: 1 });
  assertEquals(result, "ok");
  assertEquals(attempts, 2);
});

Deno.test("retryWithBackoff: does NOT retry non-retryable (403)", async () => {
  let attempts = 0;
  await assertRejects(
    () =>
      retryWithBackoff(() => {
        attempts++;
        return Promise.reject(opError(403));
      }, { maxAttempts: 3, baseDelayMs: 1 }),
    S3OperationError,
  );
  assertEquals(attempts, 1, "403 must not trigger a retry");
});

Deno.test("retryWithBackoff: exhausts maxAttempts then rethrows", async () => {
  let attempts = 0;
  await assertRejects(
    () =>
      retryWithBackoff(() => {
        attempts++;
        return Promise.reject(opError(500));
      }, { maxAttempts: 3, baseDelayMs: 1 }),
    S3OperationError,
  );
  assertEquals(attempts, 3);
});

Deno.test("pushChanged: batch failure message includes underlying error details", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-retry-" });
  try {
    // Mock whose putObject rejects with 403 (non-retryable, so fails fast)
    // for every file push. Index fetch returns empty so writeback is unused.
    // Empty listAllObjects keeps the swamp-club#225 discovery fallback on
    // its empty-bucket branch — no synthesized index, behaves like the
    // original brand-new-bucket case.
    const mock = {
      getObject(
        key: string,
      ): Promise<{ data: Uint8Array; etag?: string }> {
        if (
          key === ".datastore-index.json" ||
          key === "_index/_meta.json"
        ) {
          const err = new Error("NoSuchKey");
          err.name = "NoSuchKey";
          return Promise.reject(err);
        }
        return Promise.reject(new Error("unexpected get"));
      },
      putObject(_key: string, _body: Uint8Array): Promise<void> {
        return Promise.reject(opError(403));
      },
      listAllObjects(): Promise<
        Array<{
          key: string;
          size: number;
          etag?: string;
          lastModified?: Date;
        }>
      > {
        return Promise.resolve([]);
      },
      preflightCredentials(): Promise<void> {
        return Promise.resolve();
      },
    } as unknown as S3Client;

    await seedFile(cachePath, "data/a.yaml", "1\n");
    await seedFile(cachePath, "data/b.yaml", "2\n");

    const service = new S3CacheSyncService(mock, cachePath);
    let caught: unknown;
    try {
      await service.pushChanged();
    } catch (e) {
      caught = e;
    }
    assert(caught instanceof Error);
    const msg = (caught as Error).message;
    assert(
      msg.includes("HTTP 403"),
      `batch failure message must include underlying error text, got: ${msg}`,
    );
    assert(
      msg.includes("data/a.yaml"),
      `batch failure message must list failed files, got: ${msg}`,
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// --- DEF-2 integration: real AWS SDK → real HTTP → retry classification ---
//
// These tests exercise retryWithBackoff + pushFile against the real
// @aws-sdk/client-s3 going over a real TCP socket. The unit tests above
// use hand-built S3OperationError objects; these prove the SDK actually
// surfaces 5xx/429 in a shape isRetryableError recognizes, so a failure
// mode the mocks can't catch — "the SDK returned an error named
// 'ServiceException' instead of an S3OperationError with httpStatusCode"
// — would be caught here.
//
// `maxAttempts: 2, baseDelayMs: 10` keeps integration test wall time
// under a second while still exercising the retry path end-to-end.

/**
 * Start a local HTTP server whose response on the Nth request is
 * controlled by `responses[N-1]`; after responses run out, further
 * requests return 500. Also counts requests so tests can assert
 * retries actually fired.
 */
function withProgrammableServer(
  responses: Array<() => Response>,
  fn: (s3: S3Client, state: { requestCount: number }) => Promise<void>,
): Promise<void> {
  const state = { requestCount: 0 };
  const server = Deno.serve({ port: 0, onListen() {} }, () => {
    const i = state.requestCount++;
    const handler = responses[i] ??
      (() => new Response("overflow", { status: 500 }));
    return handler();
  });
  const addr = server.addr as Deno.NetAddr;

  const priorKey = Deno.env.get("AWS_ACCESS_KEY_ID");
  const priorSecret = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  Deno.env.set("AWS_ACCESS_KEY_ID", "test");
  Deno.env.set("AWS_SECRET_ACCESS_KEY", "test");

  const cleanup = async () => {
    if (priorKey) Deno.env.set("AWS_ACCESS_KEY_ID", priorKey);
    else Deno.env.delete("AWS_ACCESS_KEY_ID");
    if (priorSecret) Deno.env.set("AWS_SECRET_ACCESS_KEY", priorSecret);
    else Deno.env.delete("AWS_SECRET_ACCESS_KEY");
    await server.shutdown();
  };

  const s3 = new S3Client({
    bucket: "test-bucket",
    region: "us-east-1",
    endpoint: `http://127.0.0.1:${addr.port}`,
    forcePathStyle: true,
  });

  return fn(s3, state).finally(cleanup);
}

Deno.test({
  sanitizeResources: false,
  name: "integration: retryWithBackoff treats a real SDK 503 as retryable",
  fn: () =>
    withProgrammableServer(
      [
        () =>
          new Response(
            '<?xml version="1.0"?><Error><Code>ServiceUnavailable</Code><Message>try later</Message><RequestId>r503</RequestId></Error>',
            {
              status: 503,
              headers: { "Content-Type": "application/xml" },
            },
          ),
        () => new Response(null, { status: 200 }),
      ],
      async (s3, state) => {
        await retryWithBackoff(
          () => s3.putObject("k", new Uint8Array([1, 2, 3])),
          { maxAttempts: 3, baseDelayMs: 10 },
        );
        assertEquals(
          state.requestCount,
          2,
          "503 must trigger a retry that succeeds on attempt 2",
        );
      },
    ),
});

Deno.test({
  sanitizeResources: false,
  name: "integration: retryWithBackoff treats a real SDK 429 as retryable",
  fn: () =>
    withProgrammableServer(
      [
        () =>
          new Response(
            '<?xml version="1.0"?><Error><Code>SlowDown</Code><Message>throttled</Message><RequestId>r429</RequestId></Error>',
            {
              status: 429,
              headers: { "Content-Type": "application/xml" },
            },
          ),
        () => new Response(null, { status: 200 }),
      ],
      async (s3, state) => {
        await retryWithBackoff(
          () => s3.putObject("k", new Uint8Array([1, 2, 3])),
          { maxAttempts: 3, baseDelayMs: 10 },
        );
        assertEquals(
          state.requestCount,
          2,
          "429 must trigger a retry that succeeds on attempt 2",
        );
      },
    ),
});

Deno.test({
  sanitizeResources: false,
  name: "integration: retryWithBackoff does NOT retry a real SDK 403",
  fn: () =>
    withProgrammableServer(
      [
        () =>
          new Response(
            '<?xml version="1.0"?><Error><Code>AccessDenied</Code><Message>nope</Message><RequestId>r403</RequestId></Error>',
            {
              status: 403,
              headers: { "Content-Type": "application/xml" },
            },
          ),
        // A second stub that would "succeed" — if we see it used, the
        // predicate wrongly classified 403 as retryable.
        () => new Response(null, { status: 200 }),
      ],
      async (s3, state) => {
        let caught: unknown;
        try {
          await retryWithBackoff(
            () => s3.putObject("k", new Uint8Array([1, 2, 3])),
            { maxAttempts: 3, baseDelayMs: 10 },
          );
        } catch (e) {
          caught = e;
        }
        assert(
          caught instanceof S3OperationError,
          "expected S3OperationError from 403",
        );
        assertEquals(
          state.requestCount,
          1,
          "403 must NOT trigger a retry",
        );
      },
    ),
});

Deno.test({
  sanitizeResources: false,
  sanitizeOps: false,
  name:
    "integration: retryWithBackoff treats a real SDK TimeoutError as retryable",
  fn: async () => {
    // Use a short per-request timeout (100ms) and a first-response delay
    // greater than it (600ms). Attempt 1 hits the timeout; attempt 2
    // responds immediately with 200.
    const state = { requestCount: 0 };
    const server = Deno.serve({ port: 0, onListen() {} }, () => {
      const i = state.requestCount++;
      if (i === 0) {
        return new Promise<Response>((resolve) => {
          setTimeout(() => resolve(new Response(null, { status: 200 })), 600);
        });
      }
      return new Response(null, { status: 200 });
    });
    const addr = server.addr as Deno.NetAddr;
    const priorKey = Deno.env.get("AWS_ACCESS_KEY_ID");
    const priorSecret = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    Deno.env.set("AWS_ACCESS_KEY_ID", "test");
    Deno.env.set("AWS_SECRET_ACCESS_KEY", "test");
    try {
      const s3 = new S3Client({
        bucket: "test-bucket",
        region: "us-east-1",
        endpoint: `http://127.0.0.1:${addr.port}`,
        forcePathStyle: true,
        defaultRequestTimeoutMs: 100,
      });
      await retryWithBackoff(
        () => s3.putObject("k", new Uint8Array([1, 2, 3])),
        { maxAttempts: 3, baseDelayMs: 10 },
      );
      assertEquals(
        state.requestCount,
        2,
        "TimeoutError on attempt 1 must trigger a retry that succeeds on attempt 2",
      );
    } finally {
      if (priorKey) Deno.env.set("AWS_ACCESS_KEY_ID", priorKey);
      else Deno.env.delete("AWS_ACCESS_KEY_ID");
      if (priorSecret) Deno.env.set("AWS_SECRET_ACCESS_KEY", priorSecret);
      else Deno.env.delete("AWS_SECRET_ACCESS_KEY");
      await server.shutdown();
    }
  },
});

Deno.test({
  sanitizeResources: false,
  sanitizeOps: false,
  name:
    "integration: retryWithBackoff treats a real SDK connection reset as retryable",
  fn: async () => {
    // Accept attempt 1 and slam the socket closed, accept attempt 2 and
    // return a proper HTTP 200. Verifies the AWS SDK's transport-level
    // error (name "Http", no httpStatusCode) is classified retryable.
    //
    // Uses raw Deno.listen instead of Deno.serve because Deno.serve
    // writes a basic HTTP response on handler throw, which would give us
    // an HTTP error instead of a connection-level one.
    const listener = Deno.listen({ port: 0 });
    const addr = listener.addr as Deno.NetAddr;
    let attempt = 0;

    const acceptLoop = (async () => {
      for await (const conn of listener) {
        attempt++;
        if (attempt === 1) {
          // Connection reset: close without reading, without responding.
          try {
            conn.close();
          } catch {
            // already closed
          }
        } else {
          // Attempt 2: read the request (best-effort), then write 200.
          const buf = new Uint8Array(4096);
          try {
            await conn.read(buf);
          } catch {
            // body may be larger; ignoring
          }
          const resp =
            "HTTP/1.1 200 OK\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
          try {
            await conn.write(new TextEncoder().encode(resp));
          } catch {
            // peer may have closed
          }
          try {
            conn.close();
          } catch {
            // already closed
          }
        }
      }
    })();

    const priorKey = Deno.env.get("AWS_ACCESS_KEY_ID");
    const priorSecret = Deno.env.get("AWS_SECRET_ACCESS_KEY");
    Deno.env.set("AWS_ACCESS_KEY_ID", "test");
    Deno.env.set("AWS_SECRET_ACCESS_KEY", "test");
    try {
      const s3 = new S3Client({
        bucket: "test-bucket",
        region: "us-east-1",
        endpoint: `http://127.0.0.1:${addr.port}`,
        forcePathStyle: true,
      });
      await retryWithBackoff(
        () => s3.putObject("k", new Uint8Array([1, 2, 3])),
        { maxAttempts: 3, baseDelayMs: 10 },
      );
      assertEquals(
        attempt,
        2,
        "connection reset on attempt 1 must trigger a retry that succeeds on attempt 2",
      );
    } finally {
      if (priorKey) Deno.env.set("AWS_ACCESS_KEY_ID", priorKey);
      else Deno.env.delete("AWS_ACCESS_KEY_ID");
      if (priorSecret) Deno.env.set("AWS_SECRET_ACCESS_KEY", priorSecret);
      else Deno.env.delete("AWS_SECRET_ACCESS_KEY");
      try {
        listener.close();
      } catch {
        // already closed
      }
      await acceptLoop.catch(() => {}); // listener.close races accept()
    }
  },
});

Deno.test({
  sanitizeResources: false,
  name: "integration: pushFile retries a transient 503 via the real SDK path",
  fn: async () => {
    const cachePath = await Deno.makeTempDir({
      prefix: "s3sync-integration-",
    });
    try {
      await seedFile(cachePath, "data/a.yaml", "payload\n");

      await withProgrammableServer(
        [
          () =>
            new Response(
              '<?xml version="1.0"?><Error><Code>ServiceUnavailable</Code><Message>try later</Message><RequestId>rA</RequestId></Error>',
              {
                status: 503,
                headers: { "Content-Type": "application/xml" },
              },
            ),
          () => new Response(null, { status: 200 }),
        ],
        async (s3, state) => {
          const service = new S3CacheSyncService(s3, cachePath);
          // pushFile is what's called inside pushChanged's Promise.allSettled;
          // calling it directly isolates the retry behavior from the
          // pushChanged index writeback (which would need its own fixtures).
          await service.pushFile("data/a.yaml");
          assertEquals(
            state.requestCount,
            2,
            "pushFile must retry a transient 503 via the real SDK",
          );
        },
      );
    } finally {
      await Deno.remove(cachePath, { recursive: true });
    }
  },
});

// =========================================================================
// DEF-2 fast path: zero-diff sync skips the index GET and the cache walk.
//
// The motivating bug (swamp-club lab/164): a 4k-file production repo took
// ~5 min on a no-op sync because every call fetched the 1.37 MB index and
// stat'd the entire cache. The sidecar at <cache>/.datastore-sync-state.json
// records the last verified remote ETag and a localDirty flag so the next
// pullChanged/pushChanged can short-circuit when nothing has changed.
//
// The fall-through tests below are weighted as heavily as the happy-path
// hit tests — a fast path that silently skips real work would be much
// worse than the perf bug it replaces.
// =========================================================================

const SYNC_STATE_FILE = ".datastore-sync-state.json";

/** Write a sidecar directly to disk, mimicking a prior verified-clean run. */
async function writeSidecar(
  cachePath: string,
  state: {
    version?: number;
    remoteIndexETag?: string;
    lastVerifiedAt?: string;
    localDirty?: boolean;
    commitSeq?: number;
  },
): Promise<void> {
  await Deno.mkdir(cachePath, { recursive: true });
  await Deno.writeTextFile(
    join(cachePath, SYNC_STATE_FILE),
    JSON.stringify({
      version: 1,
      remoteIndexETag: "",
      lastVerifiedAt: new Date().toISOString(),
      localDirty: false,
      ...state,
    }),
  );
}

/** Read sidecar from disk; returns parsed JSON or null if missing/bad. */
async function readSidecar(
  cachePath: string,
): Promise<
  {
    version?: number;
    remoteIndexETag: string;
    localDirty: boolean;
    dirtyPaths?: string[];
    bulkInvalidated?: boolean;
    commitSeq?: number;
  } | null
> {
  try {
    const text = await Deno.readTextFile(join(cachePath, SYNC_STATE_FILE));
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// -- (1) sidecar walker-exclusion guardrail -------------------------------

Deno.test("isInternalCacheFile: excludes the sync-state sidecar", () => {
  // The sidecar is per-machine state. If the walker ever uploads it, we
  // overwrite other writers' sidecars on push and break their fast path.
  assertEquals(isInternalCacheFile(".datastore-sync-state.json"), true);
});

Deno.test("isInternalCacheFile: excludes per-target FileLock files at any depth", () => {
  // The data tier writes per-target locks at `data/<kind>/<type>/<id>/.lock`
  // via the lock subsystem (PUT/DELETE direct to the bucket). Without this
  // exclusion, `discoverIndexFromBucket` captures transient `.lock` files
  // from the listing into the synthesized index, the lock subsystem then
  // deletes them on release, and a fresh reader hydrating from that stale
  // index 404s on the missing object — surfacing as `datastore setup`
  // failing to persist `.swamp.yaml` and the next `datastore sync --pull`
  // reporting "Current datastore type: filesystem".
  assertEquals(
    isInternalCacheFile(
      "data/command/shell/c19f88eb-de4f-4227-ade7-8162aec3d6a6/.lock",
    ),
    true,
  );
  assertEquals(isInternalCacheFile("data/@m/.lock"), true);
  // The top-level distributed lock stays excluded (already covered by the
  // exact-match branch, but the basename branch catches it too).
  assertEquals(isInternalCacheFile(".datastore.lock"), true);
  // Non-`.lock` data files are not affected.
  assertEquals(isInternalCacheFile("data/@m/.locked.yaml"), false);
  assertEquals(isInternalCacheFile("data/@m/lock"), false);
});

Deno.test("isInternalCacheFile: excludes .namespace.json at any depth", () => {
  assertEquals(isInternalCacheFile(".namespace.json"), true);
  assertEquals(isInternalCacheFile("infra/.namespace.json"), true);
  assertEquals(isInternalCacheFile("namespace.json"), false);
});

// -- (2) post-verified pullChanged short-circuits with zero index GETs ----

Deno.test("pullChanged: post-verified second call hits fast path with zero index GETs", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-fast-pull-" });
  try {
    const mock = createMockS3Client();
    // Seed a remote index + matching local file so the first pullChanged
    // ends in verified zero-diff state.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/ok.yaml": {
          key: "data/@m/ok.yaml",
          size: 5,
          lastModified: new Date().toISOString(),
        },
      }),
    );
    mock.storage.set("data/@m/ok.yaml", new TextEncoder().encode("hello"));
    await seedFile(cachePath, "data/@m/ok.yaml", "hello");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();
    // First call should have GET'd the index once.
    const firstIndexGets = mock.gets.filter((k) =>
      k === ".datastore-index.json"
    ).length;
    assertEquals(firstIndexGets, 1, "first call must fetch the index");

    // Reset call history for the second call's assertion.
    mock.gets.length = 0;
    mock.heads.length = 0;

    const result = await service.pullChanged();
    assertEquals(result, 0, "second pullChanged must report zero pulls");
    assertEquals(
      mock.gets.filter((k) => k === ".datastore-index.json").length,
      0,
      "fast path must NOT GET the index",
    );
    // The HEAD probe is the entire fast-path check — exactly one expected.
    assertEquals(
      mock.heads.filter((k) => k === ".datastore-index.json").length,
      1,
      "fast path issues exactly one HEAD on the index",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (3) post-verified pushChanged short-circuits with zero walk ----------

Deno.test("pushChanged: post-verified second call hits fast path with zero S3 calls", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-fast-push-" });
  try {
    const mock = createMockS3Client();
    // Empty remote, empty local cache. Priming via pullChanged sets the
    // sidecar via its end-of-walk markSynced (the legitimate path).
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    await Deno.mkdir(cachePath, { recursive: true });

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    mock.gets.length = 0;
    mock.heads.length = 0;
    mock.puts.length = 0;

    const result = await service.pushChanged();
    assertEquals(result, 0, "second pushChanged must report zero pushes");
    assertEquals(
      mock.gets.filter((k) => k === ".datastore-index.json").length,
      0,
      "fast path must NOT force-fetch the index",
    );
    assertEquals(
      mock.puts.length,
      0,
      "fast path must NOT trigger an index writeback",
    );
    // Push fast path now uses localDirty alone — no HEAD needed.
    assertEquals(
      mock.heads.filter((k) => k === ".datastore-index.json").length,
      0,
      "push fast path must NOT HEAD the index (localDirty suffices)",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (4) corrupt sidecar falls through, never throws ----------------------

Deno.test("pullChanged: corrupt sidecar (bad JSON / wrong version / missing fields) falls through to full walk", async () => {
  for (
    const corrupt of [
      "this is not json",
      JSON.stringify({ version: 999 }),
      JSON.stringify({
        version: 1,
        // missing remoteIndexETag, lastVerifiedAt, localDirty
      }),
      JSON.stringify({
        version: 1,
        remoteIndexETag: 42, // wrong type
        lastVerifiedAt: "2026-01-01T00:00:00Z",
        localDirty: false,
      }),
    ]
  ) {
    const cachePath = await Deno.makeTempDir({
      prefix: "s3sync-fast-corrupt-",
    });
    try {
      await Deno.mkdir(cachePath, { recursive: true });
      await Deno.writeTextFile(join(cachePath, SYNC_STATE_FILE), corrupt);

      const mock = createMockS3Client();
      mock.storage.set(".datastore-index.json", encodeIndex({}));

      const service = new S3CacheSyncService(mock, cachePath);
      // Must not throw on any of the corrupt-sidecar shapes.
      const result = await service.pullChanged();
      assertEquals(result, 0);
      // And must have fallen through to the full walk: index was GET'd.
      assert(
        mock.gets.includes(".datastore-index.json"),
        `corrupt sidecar (${
          corrupt.slice(0, 30)
        }…) must fall through, not fast-path`,
      );
    } finally {
      await Deno.remove(cachePath, { recursive: true });
    }
  }
});

// -- (5) remote ETag change bypasses short-circuit ------------------------

Deno.test("pullChanged: remote index ETag change bypasses fast path", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-fast-etag-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();
    const sidecarBefore = await readSidecar(cachePath);
    assertExists(sidecarBefore);

    // Remote-side mutation: write a new index payload. The mock derives
    // ETag from content, so this changes the ETag.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/new.yaml": {
          key: "data/@m/new.yaml",
          size: 3,
          lastModified: new Date().toISOString(),
        },
      }),
    );
    mock.storage.set("data/@m/new.yaml", new TextEncoder().encode("new"));

    mock.gets.length = 0;
    mock.heads.length = 0;

    const result = await service.pullChanged();
    // Fast path must have bailed; the new file gets pulled.
    assertEquals(result, 1, "must pull the newly-added remote file");
    assert(
      mock.gets.includes(".datastore-index.json"),
      "ETag mismatch must force a real index fetch",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// pullChanged's slow path must force a remote pullIndex, not trust the
// 60-second TTL local-mtime cache. The cache check only fires when the
// in-memory `this.index` is null (i.e. a fresh process), so the bug
// only manifests across process boundaries: process A pulls + writes
// the local index file (fresh mtime), exits; process B's fresh
// service starts, sees fast-path miss because remote ETag has moved
// on, drops to slow path — and without `forceRemote` would walk the
// still-fresh-by-mtime local index file (process A's view) and find
// toPull=0. Result: "Pulled 0 files" while another writer's data sits
// unpulled on remote. swamp-club#1225 writer1↔writer2 path.
Deno.test("pullChanged: slow path force-fetches the remote index even when a previous process's local index is mtime-fresh", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-pull-force-",
  });
  try {
    const mock = createMockS3Client();

    // Seed initial remote: one entry.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/a.yaml": {
          key: "data/@m/a.yaml",
          size: 5,
          lastModified: new Date().toISOString(),
          localMtime: new Date(0).toISOString(),
        },
      }),
    );
    mock.storage.set("data/@m/a.yaml", new TextEncoder().encode("hello"));

    // Process A: pull and exit. Writes the local index file.
    const serviceA = new S3CacheSyncService(mock, cachePath);
    await serviceA.pullChanged();

    // Simulate another writer pushing in the meantime: replace the
    // remote index payload (ETag shifts since the mock derives it from
    // content) and add the file behind the new entry.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/a.yaml": {
          key: "data/@m/a.yaml",
          size: 5,
          lastModified: new Date().toISOString(),
          localMtime: new Date(0).toISOString(),
        },
        "data/@m/b.yaml": {
          key: "data/@m/b.yaml",
          size: 7,
          lastModified: new Date().toISOString(),
          localMtime: new Date(0).toISOString(),
        },
      }),
    );
    mock.storage.set("data/@m/b.yaml", new TextEncoder().encode("goodbye"));

    mock.gets.length = 0;
    mock.heads.length = 0;

    // Process B: fresh service instance, same cache dir. `this.index`
    // is null, the local index file is mtime-fresh — without
    // `forceRemote`, this would cache-hit and walk the stale view.
    const serviceB = new S3CacheSyncService(mock, cachePath);
    const pulled = await serviceB.pullChanged();
    assertEquals(
      pulled,
      1,
      "must download the new remote-only entry — pre-fix this returned 0 because slow path used a stale TTL-cached local index",
    );
    assert(
      mock.gets.includes(".datastore-index.json"),
      "slow path must force-fetch the remote index, not trust local TTL cache",
    );
    assert(
      mock.gets.includes("data/@m/b.yaml"),
      "the previously-missing remote file must be fetched",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (6) multipart-shaped ETag bypasses short-circuit --------------------

Deno.test("pullChanged: multipart-shaped ETag ('abc-2') bypasses fast path", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-fast-multipart-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    // Pin a multipart-shaped ETag for the remote index. The mock's HEAD
    // returns this regardless of body content.
    mock.etagOverrides.set(".datastore-index.json", `"abc-2"`);

    // Plant a sidecar with the matching multipart ETag — the fast path
    // must STILL bail because multipart ETags aren't a content
    // fingerprint and any equality check would be spuriously true.
    // No local index file is seeded so pullIndex's TTL cache also
    // misses and falls through to a real S3 GET, which is what the
    // assertion below proves.
    await writeSidecar(cachePath, {
      remoteIndexETag: "abc-2",
      lastVerifiedAt: new Date().toISOString(),
    });

    const service = new S3CacheSyncService(mock, cachePath);
    const result = await service.pullChanged();
    assertEquals(result, 0);
    // Multipart guard must have forced fall-through to the GET path.
    assert(
      mock.gets.includes(".datastore-index.json"),
      "multipart ETag must force fall-through to a real index GET",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (7) local file mutation forces real push work -----------------------

Deno.test("pushChanged: local file mutation since last sync forces real push work", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-fast-mutate-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    // Establish a clean baseline.
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pushChanged();

    // Now simulate the user side: a local cache write through pushFile
    // (the contracted write path), then sync.
    await seedFile(cachePath, "data/@m/added.yaml", "added\n");

    mock.puts.length = 0;
    mock.gets.length = 0;

    // Going through pushFile flips localDirty=true, so the next
    // pushChanged must take the slow path.
    await service.pushFile("data/@m/added.yaml");
    const sidecarAfterDirty = await readSidecar(cachePath);
    assertEquals(
      sidecarAfterDirty?.localDirty,
      true,
      "pushFile must flip localDirty before its work",
    );

    // Reset mock counters and run pushChanged: it must do the real walk
    // and writeback, not short-circuit.
    mock.puts.length = 0;
    mock.gets.length = 0;
    await service.pushChanged();
    assert(
      mock.gets.includes(".datastore-index.json"),
      "localDirty=true must force a real index force-fetch",
    );
    assert(
      mock.puts.some((p) => p.key === ".datastore-index.json"),
      "localDirty=true must lead to an index writeback",
    );

    const sidecarAfterPush = await readSidecar(cachePath);
    assertEquals(
      sidecarAfterPush?.localDirty,
      false,
      "successful writeback must clear localDirty",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (8) AbortSignal cancellation propagates -----------------------------

Deno.test("pullChanged / pushChanged: AbortSignal cancellation propagates", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-fast-abort-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    const service = new S3CacheSyncService(mock, cachePath);
    const controller = new AbortController();
    controller.abort();

    await assertRejects(
      () => service.pullChanged({ signal: controller.signal }),
      DOMException,
      undefined,
      "pullChanged must reject with AbortError when signal is pre-aborted",
    );
    await assertRejects(
      () => service.pushChanged({ signal: controller.signal }),
      DOMException,
      undefined,
      "pushChanged must reject with AbortError when signal is pre-aborted",
    );

    // Pre-aborted call must not have issued any S3 calls beyond — at
    // most — the sidecar HEAD probe (which itself respects the signal).
    // Confirm no GETs/PUTs leaked through.
    assertEquals(
      mock.gets.filter((k) => k === ".datastore-index.json").length,
      0,
      "no GETs after abort",
    );
    assertEquals(
      mock.puts.length,
      0,
      "no PUTs after abort",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (9) guardrail: direct cache writes without markDirty bypass tracking --

// CONTRACT: external writers into the cache directory (e.g.
// swamp-core's repository layer using atomicWriteFile) MUST call
// `markDirty()` on the sync service. Internal writes through
// `pushFile` flip `localDirty: true` automatically. A direct
// `Deno.writeFile` into the cache WITHOUT `markDirty` is a contract
// violation: the sidecar won't see it, and the next `pushChanged`
// fast-paths past the change. See the companion
// "markDirty: flips sidecar localDirty..." test for the recovery
// path.
//
// This test pins the failure mode when `markDirty` is forgotten so
// the footgun is explicit. Loosening it (e.g. walking on every push
// to re-confirm) would defeat the fast-path's purpose.

Deno.test("pushChanged: direct Deno.writeFile bypasses localDirty tracking (contract)", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-fast-guardrail-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    const service = new S3CacheSyncService(mock, cachePath);
    // Establish a clean baseline via pullChanged's end-of-walk
    // markSynced — the legitimate way to set the sidecar. (pushChanged
    // on an empty cache no longer marks clean from the no-op
    // no-writeback branch; swamp-club #1225.)
    await service.pullChanged();

    // Reach around the contract: write directly to the cache without
    // going through pushFile. localDirty stays false because nothing
    // told the sidecar otherwise.
    await seedFile(cachePath, "data/@m/sneaky.yaml", "sneaky\n");

    mock.puts.length = 0;
    mock.gets.length = 0;
    await service.pushChanged();

    // Fast-path hit: sneaky.yaml is NEVER uploaded. This is the
    // documented limitation — the cost of walking on every push would
    // erase DEF-2's gains, so the contract is "writes go through
    // pushFile". If you broke this test by adding a new cache writer,
    // teach that writer to flip the sidecar (or call markLocalDirty
    // itself) instead of removing this assertion.
    assertEquals(
      mock.puts.length,
      0,
      "fast path skipped the direct write — this is the documented contract, not a bug",
    );
    assertEquals(
      mock.gets.filter((k) => k === ".datastore-index.json").length,
      0,
      "fast path also skipped the index force-fetch",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ============================================================================
// markDirty() contract — hotfix for fast-path/core-writes data-loss.
//
// The fast-path added in #105 depends on a `localDirty` flag in the
// sidecar. That flag is flipped by `pushFile` internally OR by the
// new public `markDirty()`. swamp-core writes directly to the cache
// via atomicWriteFile, bypassing `pushFile` — so it MUST call
// `markDirty()` before (or immediately after) each write, otherwise
// the next `pushChanged` fast-paths past the write and the data is
// silently missed on upload. Test (9) above pins the
// "without markDirty" failure mode; these tests pin the
// "with markDirty" recovery path.
// ============================================================================

Deno.test("markDirty: flips sidecar localDirty and forces slow-path on next pushChanged", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-markdirty-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    // Priming sync populates the sidecar clean.
    await service.pullChanged();
    await service.pushChanged();

    // Simulate swamp-core writing directly to the cache AND honoring
    // the new contract by calling markDirty afterwards.
    await seedFile(cachePath, "data/external-writer.yaml", "external\n");
    await service.markDirty();

    // Reset ledgers — next pushChanged must slow-path and walk.
    mock.puts.length = 0;
    mock.gets.length = 0;

    await service.pushChanged();

    assert(
      mock.puts.some((p) => p.key === "data/external-writer.yaml"),
      "markDirty must force the next pushChanged to walk and upload the externally-written file",
    );
    assert(
      mock.gets.some((k) => k === ".datastore-index.json"),
      "fast-path must not hit after markDirty — forceRemote index fetch expected",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("markDirty: is idempotent — repeated calls don't thrash the sidecar", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-markdirty-idem-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    await service.pullChanged();
    await service.pushChanged();
    await service.markDirty();

    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const mtimeAfterFirst = (await Deno.stat(sidecarPath)).mtime;
    assertExists(mtimeAfterFirst);

    await new Promise((r) => setTimeout(r, 20));
    await service.markDirty();
    await service.markDirty();

    const mtimeAfterRepeats = (await Deno.stat(sidecarPath)).mtime;
    assertExists(mtimeAfterRepeats);
    assertEquals(
      mtimeAfterRepeats.getTime(),
      mtimeAfterFirst.getTime(),
      "idempotent markDirty must not rewrite the sidecar",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// =========================================================================
// swamp-club #168: fast-path sidecar TOCTOU regression tests
//
// Scenario: operator A runs a `pullChanged`/`pushChanged` that ends in
// verified zero-diff state. Concurrently, operator B pushes a new file
// that bumps the remote index's ETag between A's index GET and A's
// sidecar write. Before the fix, `markSynced` would record B's ETag
// (observed via a post-walk HEAD), and A's next fast-path sync would
// see sidecar == remote and skip B's file. After the fix, `markSynced`
// records the ETag captured from A's index GET response — the one A
// actually walked against — so B's push correctly invalidates the
// fast path on the next sync.
//
// The race window is simulated by wrapping `mock.getObject` so that a
// microtask scheduled from the returned Promise's `.then()` bumps
// `etagOverrides` and adds B's file to storage after the body has
// been delivered to `pullIndex`. Microtask ordering: the wrapped
// mock attaches `p.then(bump)` BEFORE the caller's `await`
// continuation, so bump runs first in the microtask queue — which is
// the race window (between index GET resolving and markSynced being
// called). Any refactor that moves the bump-attachment to a macrotask
// (setTimeout) would lose the race simulation; document the ordering
// invariant so the test's correctness doesn't silently rot.
// =========================================================================

Deno.test("pullChanged: records ETag from pullIndex GET, not post-walk HEAD (swamp-club #168)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-toctou-pull-" });
  try {
    const mock = createMockS3Client();
    // Seed remote index at G1 with matching local cache file so the
    // walk sees zero toPull.
    mock.etagOverrides.set(".datastore-index.json", '"etag-G1"');
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/ok.yaml": {
          key: "data/@m/ok.yaml",
          size: 5,
          lastModified: new Date().toISOString(),
        },
      }),
    );
    mock.storage.set("data/@m/ok.yaml", new TextEncoder().encode("hello"));
    await seedFile(cachePath, "data/@m/ok.yaml", "hello");

    // Race simulation: bump the mock to G2 in a microtask scheduled
    // from the index GET's resolution. Fires between pullIndex's
    // getObject resolving and the post-walk markSynced call.
    const origGet = mock.getObject.bind(mock);
    mock.getObject = ((key: string, signal?: AbortSignal) => {
      const p = origGet(key, signal);
      if (key === ".datastore-index.json") {
        p.then(() => {
          // B's push: new file, bumped ETag.
          mock.etagOverrides.set(".datastore-index.json", '"etag-G2"');
          mock.storage.set(
            ".datastore-index.json",
            encodeIndex({
              "data/@m/ok.yaml": {
                key: "data/@m/ok.yaml",
                size: 5,
                lastModified: new Date().toISOString(),
              },
              "data/@m/new.yaml": {
                key: "data/@m/new.yaml",
                size: 3,
                lastModified: new Date().toISOString(),
              },
            }),
          );
          mock.storage.set("data/@m/new.yaml", new TextEncoder().encode("new"));
        });
      }
      return p;
    }) as typeof mock.getObject;

    const service = new S3CacheSyncService(mock, cachePath);
    const pulled = await service.pullChanged();
    assertEquals(pulled, 0, "walk should see zero diff against G1 index");

    // The fix records G1 (the ETag we actually verified against), not
    // G2 (the post-walk HEAD value the old buggy code would have
    // observed after B's push landed).
    const sidecar = await readSidecar(cachePath);
    assertExists(sidecar);
    assertEquals(
      sidecar!.remoteIndexETag,
      "etag-G1",
      "sidecar must record the ETag from pullIndex GET, NOT a racy post-walk HEAD",
    );

    // Invariant: the fix removes the post-walk HEAD entirely. On a
    // first pullChanged (no pre-existing sidecar), the fast-path
    // probe returns null at the "no sidecar" check without HEAD'ing,
    // so zero HEADs on the index are expected. If this assertion
    // ever fails, a future maintainer likely re-added the TOCTOU HEAD.
    assertEquals(
      mock.heads.filter((k) => k === ".datastore-index.json").length,
      0,
      "no post-walk HEAD on index — TOCTOU fix removes it",
    );

    // On the second sync, the fast-path probe HEADs remote (G2),
    // compares to sidecar (G1), and correctly bails to the slow
    // path. The slow path walks and pulls B's new file. Without the
    // fix, sidecar would be G2 and this sync would return 0, masking
    // B's file until any future remote mutation invalidates.
    mock.gets.length = 0;
    mock.heads.length = 0;
    const secondResult = await service.pullChanged();
    assertEquals(
      secondResult,
      1,
      "second pullChanged must slow-path and pull B's file, not mask it",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// swamp-club #1225: pushChanged's no-writeback branch must not mark the
// sidecar clean. The slow walk only checks each LOCAL file against the
// remote index — remote-only entries are never visited, so `pushed === 0`
// is consistent with "local is missing N files that remote has." Marking
// the sidecar clean here lets the next pullChanged fast-path past
// unfetched files (silent data loss for any reader running
// `datastore setup` against a non-empty bucket). The earlier swamp-club
// #168 TOCTOU concern is preserved: there is still no post-walk HEAD on
// the index in this branch — the branch simply does no sidecar work at
// all now.
Deno.test("pushChanged no-writeback: does NOT mark the sidecar clean when nothing was pushed (swamp-club #1225)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1225-push-" });
  try {
    const mock = createMockS3Client();
    // Remote has TWO files; local cache has only one of them. This is
    // the second-repo `datastore setup` scenario from production. The
    // walker sees zero LOCAL-only diffs (nothing to push), but the
    // local cache is missing `data/@m/remote-only.yaml` and must NOT
    // be recorded as in-sync.
    const existingMtime = new Date(0);
    mock.etagOverrides.set(".datastore-index.json", '"etag-G1"');
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/ok.yaml": {
          key: "data/@m/ok.yaml",
          size: 5,
          lastModified: new Date().toISOString(),
          localMtime: existingMtime.toISOString(),
        },
        "data/@m/remote-only.yaml": {
          key: "data/@m/remote-only.yaml",
          size: 11,
          lastModified: new Date().toISOString(),
          localMtime: existingMtime.toISOString(),
        },
      }),
    );
    mock.storage.set("data/@m/ok.yaml", new TextEncoder().encode("hello"));
    mock.storage.set(
      "data/@m/remote-only.yaml",
      new TextEncoder().encode("remote-only"),
    );
    await seedFile(cachePath, "data/@m/ok.yaml", "hello");
    await Deno.utime(
      join(cachePath, "data/@m/ok.yaml"),
      existingMtime,
      existingMtime,
    );

    const service = new S3CacheSyncService(mock, cachePath);
    const pushed = await service.pushChanged();
    assertEquals(
      pushed,
      0,
      "walker sees no local-only files, so nothing to push",
    );

    // Regression pin: the sidecar must NOT exist (or at minimum must
    // not record a clean baseline). A fast-path-eligible sidecar here
    // would let the next pullChanged skip downloading `remote-only.yaml`.
    const sidecar = await readSidecar(cachePath);
    assertEquals(
      sidecar,
      null,
      "no-writeback branch must not write the sidecar — `pushed === 0` does not prove local matches remote",
    );

    // The TOCTOU fix from swamp-club #168 is preserved: no post-walk
    // HEAD on the index in the no-writeback path.
    assertEquals(
      mock.heads.filter((k) => k === ".datastore-index.json").length,
      0,
      "no post-walk HEAD on index in no-writeback path",
    );

    // Symmetric positive: a subsequent pullChanged must do real work
    // and download the missing remote file rather than fast-pathing.
    const pulled = await service.pullChanged();
    assertEquals(
      pulled,
      1,
      "pullChanged must download remote-only.yaml — the sidecar wasn't falsely marked clean",
    );
    assert(
      mock.gets.includes("data/@m/remote-only.yaml"),
      "the previously-missing remote file must be fetched",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// swamp-club #1225 recovery counterpart: when local cache fully matches
// the remote index and the sidecar was wiped (e.g. an upgrade migration
// removed it), the next pushChanged must re-establish the clean baseline
// so subsequent fast-path syncs work. The verify-and-mark gate in the
// no-writeback branch makes this safe — local-matches-remote is positive
// evidence, distinct from the data-loss case above where local was
// missing a remote entry.
Deno.test("pushChanged no-writeback: regenerates sidecar when local fully matches remote (swamp-club #1225 recovery)", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-1225-recovery-",
  });
  try {
    const mock = createMockS3Client();
    mock.etagOverrides.set(".datastore-index.json", '"abc123"');
    const existingMtime = new Date(0);
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/a.yaml": {
          key: "data/@m/a.yaml",
          size: 5,
          lastModified: new Date().toISOString(),
          localMtime: existingMtime.toISOString(),
        },
        "data/@m/b.yaml": {
          key: "data/@m/b.yaml",
          size: 7,
          lastModified: new Date().toISOString(),
          localMtime: existingMtime.toISOString(),
        },
      }),
    );
    mock.storage.set("data/@m/a.yaml", new TextEncoder().encode("hello"));
    mock.storage.set("data/@m/b.yaml", new TextEncoder().encode("goodbye"));
    // Local has BOTH files at matching size — the legitimate recovery
    // case. A prior pull populated the cache; the sidecar was wiped.
    await seedFile(cachePath, "data/@m/a.yaml", "hello");
    await seedFile(cachePath, "data/@m/b.yaml", "goodbye");
    await Deno.utime(
      join(cachePath, "data/@m/a.yaml"),
      existingMtime,
      existingMtime,
    );
    await Deno.utime(
      join(cachePath, "data/@m/b.yaml"),
      existingMtime,
      existingMtime,
    );

    const service = new S3CacheSyncService(mock, cachePath);
    const pushed = await service.pushChanged();
    assertEquals(pushed, 0, "no local-only files — nothing to push");

    // Sidecar must be regenerated because local cache provably matches
    // the remote index at the captured ETag.
    const sidecarText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const sidecar = JSON.parse(sidecarText);
    assertEquals(sidecar.localDirty, false);
    assertEquals(
      sidecar.remoteIndexETag,
      "abc123",
      "sidecar must record the ETag we walked against",
    );

    // No remote writeback — ETag of the index must be untouched.
    assertEquals(
      mock.puts.filter((p) => p.key === ".datastore-index.json").length,
      0,
      "recovery push must not rewrite the remote index",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// swamp-club #1225 writeback variant: when pushChanged uploads at least
// one file (writeback branch fires) but the remote index already contains
// entries the local cache doesn't have, the merged index we write back
// describes "everything remote had + everything we just pushed" — local
// only has "what we just pushed". Marking the sidecar clean against that
// merged index lies the same way the no-writeback bug did. Verify-and-
// mark must apply in this branch too.
//
// This is the production fresh-reader path: `swamp datastore setup`
// migrates 1 local file, that file is NOT yet in the remote index (e.g.
// different bundle hash), so toPush=1 and writeback fires. Without this
// gate, the next `pullChanged` fast-paths past the 19+ remote-only files
// that the reader actually needs.
Deno.test("pushChanged writeback: does NOT mark sidecar clean when local is missing remote-only entries (swamp-club #1225)", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-1225-writeback-",
  });
  try {
    const mock = createMockS3Client();
    mock.etagOverrides.set(".datastore-index.json", '"abc123"');
    // Remote index already has an entry the reader does NOT have locally.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@m/remote-only.yaml": {
          key: "data/@m/remote-only.yaml",
          size: 11,
          lastModified: new Date().toISOString(),
          localMtime: new Date(0).toISOString(),
        },
      }),
    );
    mock.storage.set(
      "data/@m/remote-only.yaml",
      new TextEncoder().encode("remote-only"),
    );
    // Local has a different file that's NOT in the remote index — the
    // walker will route this through toPush, which means writeback fires.
    await seedFile(cachePath, "bundles/h/migrated.js", "console.log(1);");

    const service = new S3CacheSyncService(mock, cachePath);
    const pushed = await service.pushChanged();
    assertEquals(pushed, 1, "the local-only file must be uploaded");

    // The writeback DID fire — confirm by checking the index was rewritten.
    assertEquals(
      mock.puts.filter((p) => p.key === ".datastore-index.json").length,
      1,
      "writeback must rewrite the remote index with the new entry",
    );

    // Regression pin: the sidecar must remain dirty. `pushFile` writes a
    // dirty sidecar (via `markDirty()`) before each upload, so the file
    // does exist — but the writeback branch must NOT flip it to clean
    // because local is missing `data/@m/remote-only.yaml`. Marking clean
    // here would let the next pullChanged fast-path past that file.
    const sidecarText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const sidecar = JSON.parse(sidecarText);
    assertEquals(
      sidecar.localDirty,
      true,
      "writeback must not flip localDirty to false when local is missing remote-only entries",
    );

    // Symmetric positive: a subsequent pullChanged must do real work
    // and download the missing remote file rather than fast-pathing.
    const pulled = await service.pullChanged();
    assertEquals(
      pulled,
      1,
      "pullChanged must download remote-only.yaml — sidecar wasn't falsely marked clean",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// swamp-club #222: pushChanged in a fresh process after a fresh-cache
// pullChanged must not redundantly re-upload the just-downloaded files.
// Pre-fix, pullChanged left the on-disk index carrying the original
// pusher's localMtime values (the remote payload), and skipped markSynced
// because pulled > 0. The next process's pushChanged then took the slow
// path (no sidecar), pullIndex(forceRemote) reloaded the pusher's mtimes
// into this.index, and the walk pushed every file — size matched but
// mtime didn't. The fix persists the in-memory index (with the puller's
// stat-derived localMtimes) AND marksSynced so the next pushChanged hits
// the fast path. Two positive assertions pin the persistence machinery
// (sidecar contents + on-disk index mtimes) so a future refactor can't
// silently drop them while still satisfying the symptom assertion.
Deno.test("pullChanged + pushChanged: fresh-process push after pull against populated remote does not redundantly upload (swamp-club #222)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-issue-222-" });
  try {
    const mock = createMockS3Client();
    // Pin a known ETag for the remote index so the sidecar assertion
    // doesn't have to recompute fakeETag from byte stitching.
    mock.etagOverrides.set(".datastore-index.json", '"index-pre-pull"');

    // Seed 5 files with varied sizes (5, 11, 27, 64, 128 bytes), each
    // index entry carrying machine-A's localMtime (epoch — guaranteed
    // distinct from any local stat.mtime that Deno.writeFile will set
    // on this machine during pullChanged's downloads).
    const aMtime = new Date(0).toISOString();
    const SIZES = [5, 11, 27, 64, 128];
    const seeded = SIZES.map((size, i) => ({
      rel: `data/@m/file-${i}.yaml`,
      body: "x".repeat(size),
    }));
    const indexEntries: Record<string, {
      key: string;
      size: number;
      lastModified: string;
      localMtime: string;
    }> = {};
    for (const { rel, body } of seeded) {
      mock.storage.set(rel, new TextEncoder().encode(body));
      indexEntries[rel] = {
        key: rel,
        size: body.length,
        lastModified: aMtime,
        localMtime: aMtime,
      };
    }
    mock.storage.set(".datastore-index.json", encodeIndex(indexEntries));

    // Process A: fresh service, fresh cache. Pulls all 5 files.
    const serviceA = new S3CacheSyncService(mock, cachePath);
    const pulled = await serviceA.pullChanged();
    assertEquals(pulled, SIZES.length, "must pull all 5 seeded files");

    // Positive: sidecar must be written with the GET'd ETag and clean
    // state. Pre-fix, pulled > 0 skipped markSynced and this returned
    // null. Post-fix, this is the load-bearing piece that lets the next
    // pushChanged take the fast path.
    const sidecar = await readSidecar(cachePath);
    assertExists(sidecar, "pullChanged with pulled > 0 must write the sidecar");
    assertEquals(
      sidecar!.localDirty,
      false,
      "sidecar must be clean — local cache matches the freshly-pulled remote",
    );
    assertEquals(
      sidecar!.remoteIndexETag,
      "index-pre-pull",
      "sidecar must record the ETag from pullIndex's GET response",
    );

    // Positive: on-disk index must reflect the local mtimes pullChanged
    // recorded for each downloaded file — NOT the seeded epoch value.
    // Pre-fix, the on-disk file was last written by pullIndex from the
    // raw remote payload and still carried machine-A's epoch mtimes.
    const indexText = await Deno.readTextFile(
      join(cachePath, ".datastore-index.json"),
    );
    const onDiskIndex = JSON.parse(indexText) as {
      entries: Record<string, { size: number; localMtime?: string }>;
    };
    for (const { rel } of seeded) {
      const entry = onDiskIndex.entries[rel];
      assertExists(entry, `entry ${rel} must persist on disk`);
      assertExists(
        entry.localMtime,
        `entry ${rel} must carry a localMtime on disk`,
      );
      assert(
        entry.localMtime !== aMtime,
        `entry ${rel} on-disk localMtime must NOT be the seeded machine-A epoch — pre-fix the on-disk index still carried it`,
      );
      const parsed = Date.parse(entry.localMtime!);
      assert(
        !Number.isNaN(parsed),
        `entry ${rel} localMtime must be a parseable ISO timestamp`,
      );
    }

    // Symptom: fresh service C against the same cache dir simulates the
    // cross-process scenario from the issue (`swamp datastore sync
    // --push` run as a separate command). Snapshot mock.puts BEFORE so
    // any writeback PUT from pullChanged doesn't pollute the count.
    const putsBefore = mock.puts.length;
    const serviceC = new S3CacheSyncService(mock, cachePath);
    const pushed = await serviceC.pushChanged();
    assertEquals(
      pushed,
      0,
      `pushChanged after a fresh-process pullChanged must not redundantly upload — saw ${pushed} pushes against ${SIZES.length} unchanged files`,
    );
    const dataPuts = mock.puts.slice(putsBefore).filter((p) =>
      p.key !== ".datastore-index.json"
    );
    assertEquals(
      dataPuts.length,
      0,
      `expected zero data PUTs against an unchanged cache, saw ${dataPuts.length}: ${
        dataPuts.map((p) => p.key).join(", ")
      }`,
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// swamp-club #225: prove the AWS SDK actually surfaces a missing-index
// 404 with the error name our pullIndex catch branch matches against.
// The unit tests above use a hand-built mock that throws Error{name:
// "NoSuchKey"} — this proves the real SDK produces the same shape going
// over real HTTP. Without this, an SDK upgrade could rename or
// reclassify the error and silently break the discovery fallback.
//
// `sanitizeResources: false` is the same setting used by every test in
// the DEF-2 integration block above (see line 1076): the AWS SDK keeps
// TCP connections alive in its keep-alive agent, which trips Deno's
// resource-leak detector. The connections are reclaimed when the
// runtime tears down between test runs, so this is safe.
Deno.test({
  sanitizeResources: false,
  name:
    "integration: pullIndex discovery handles real SDK 404 on missing index (swamp-club #225)",
  fn: async () => {
    const cachePath = await Deno.makeTempDir({
      prefix: "s3sync-225-integration-",
    });
    try {
      await withProgrammableServer(
        [
          // 1. GET .datastore-index.json → 404 NoSuchKey
          //    (the catch branch our discovery hangs off)
          () =>
            new Response(
              '<?xml version="1.0"?><Error><Code>NoSuchKey</Code><Message>The specified key does not exist.</Message><Key>.datastore-index.json</Key><RequestId>r1</RequestId></Error>',
              {
                status: 404,
                headers: { "Content-Type": "application/xml" },
              },
            ),
          // 2. ListObjectsV2 → one Contents entry
          //    (proves the real SDK parses Size + ETag from the listing)
          () =>
            new Response(
              '<?xml version="1.0"?><ListBucketResult xmlns="http://s3.amazonaws.com/doc/2006-03-01/"><Name>test-bucket</Name><KeyCount>1</KeyCount><MaxKeys>1000</MaxKeys><IsTruncated>false</IsTruncated><Contents><Key>data/discovered.yaml</Key><Size>6</Size><ETag>&quot;abc123&quot;</ETag><LastModified>2026-05-04T12:00:00.000Z</LastModified></Contents></ListBucketResult>',
              {
                status: 200,
                headers: { "Content-Type": "application/xml" },
              },
            ),
          // 3. PUT .datastore-index.json (synthesized index writeback)
          () =>
            new Response(null, {
              status: 200,
              headers: { ETag: '"index-etag"' },
            }),
        ],
        async (s3, state) => {
          const service = new S3CacheSyncService(s3, cachePath);
          // Call pullIndex directly to scope the test to the discovery
          // path — pullChanged would also work but adds concurrent
          // file GETs whose ordering against the programmable server
          // is non-deterministic.
          const fingerprint = await (service as unknown as {
            pullIndex: (
              opts: { forceRemote: boolean },
            ) => Promise<string | null>;
          }).pullIndex({ forceRemote: true });
          assertEquals(
            state.requestCount,
            3,
            "discovery must produce exactly 3 SDK requests: GET index (404), ListObjectsV2, PUT index",
          );
          // The SDK surfaces the PUT response ETag with its surrounding
          // double-quotes — `normalizeETag()` is what the sidecar
          // bookkeeping uses for comparisons. The discovery path
          // returns the raw form, matching the post-fetch path's
          // contract.
          assertEquals(
            fingerprint,
            '"index-etag"',
            "discovery must return the synthesized index's ETag from the real PUT response",
          );
        },
      );
    } finally {
      await Deno.remove(cachePath, { recursive: true });
    }
  },
});

// ============================================================================
// Issue #379: Dirty sidecar per-path tracking, partitioned index,
// SHA-256 content hashing, configurable concurrency, and scopedSync.
// ============================================================================

Deno.test("isInternalCacheFile: excludes _index/ directory", () => {
  assertEquals(isInternalCacheFile("_index/_meta.json"), true);
  assertEquals(
    isInternalCacheFile("_index/data--aws--ec2--vpc--abc-123.json"),
    true,
  );
  assertEquals(isInternalCacheFile("_index"), true);
  assertEquals(isInternalCacheFile("data/_index/something"), false);
});

Deno.test("markDirty with relPath: tracks per-path dirty state", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-dirty-path-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    await service.markDirty({ relPath: "data/aws/ec2/vpc/abc-123" });

    const sidecar = await readSidecar(cachePath);
    assertEquals(
      sidecar?.version,
      2,
      "markDirty with relPath must write v2 sidecar",
    );
    assertEquals(sidecar?.localDirty, true);
    assertEquals(sidecar?.dirtyPaths, ["data/aws/ec2/vpc/abc-123"]);
    assertEquals(sidecar?.bulkInvalidated, false);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("markDirty: dirty set cap flips to bulkInvalidated at 2000 paths", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-dirty-cap-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    for (let i = 0; i < 2000; i++) {
      await service.markDirty({ relPath: `data/m/id-${i}` });
    }

    let sidecar = await readSidecar(cachePath);
    assertEquals(sidecar?.dirtyPaths?.length, 2000);
    assertEquals(sidecar?.bulkInvalidated, false);

    // The 2001st path exceeds the cap
    await service.markDirty({ relPath: "data/m/id-overflow" });

    sidecar = await readSidecar(cachePath);
    assertEquals(
      sidecar?.bulkInvalidated,
      true,
      "exceeding cap must flip bulkInvalidated",
    );
    assertEquals(sidecar?.localDirty, true);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: scoped push walks only dirty directories (in-process)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-scoped-push-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    // Seed files in two directories
    await seedFile(cachePath, "data/m/a/state-main/1/raw", "aaa");
    await seedFile(cachePath, "data/m/b/state-main/1/raw", "bbb");

    // Only mark one directory dirty via in-process markDirty call
    await service.markDirty({ relPath: "data/m/a" });

    mock.puts.length = 0;
    await service.pushChanged();

    const uploadedKeys = mock.puts.map((p) => p.key);
    assert(
      uploadedKeys.includes("data/m/a/state-main/1/raw"),
      "dirty directory file must be uploaded",
    );
    assertEquals(
      uploadedKeys.includes("data/m/b/state-main/1/raw"),
      false,
      "non-dirty directory file must NOT be uploaded in scoped push",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: scoped push handles file-level dirty paths", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-scoped-file-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/m/a/state-main/1/raw", "aaa");
    await seedFile(
      cachePath,
      "outputs/command/shell/execute/c19f88eb-2026.yaml",
      "out",
    );
    await seedFile(cachePath, "data/m/b/state-main/1/raw", "bbb");

    // Mark a directory and a file path dirty
    await service.markDirty({ relPath: "data/m/a" });
    await service.markDirty({
      relPath: "outputs/command/shell/execute/c19f88eb-2026.yaml",
    });

    mock.puts.length = 0;
    await service.pushChanged();

    const uploadedKeys = mock.puts.map((p) => p.key);
    assert(
      uploadedKeys.includes("data/m/a/state-main/1/raw"),
      "dirty directory file must be uploaded",
    );
    assert(
      uploadedKeys.includes(
        "outputs/command/shell/execute/c19f88eb-2026.yaml",
      ),
      "dirty file path must be uploaded",
    );
    assertEquals(
      uploadedKeys.includes("data/m/b/state-main/1/raw"),
      false,
      "non-dirty directory file must NOT be uploaded",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("crash recovery: fresh process loads v2 sidecar with dirtyPaths", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-crash-recovery-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    // Simulate a crash: write a v2 sidecar with dirty paths directly
    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    await ensureDir(cachePath);
    await Deno.writeTextFile(
      sidecarPath,
      JSON.stringify({
        version: 2,
        remoteIndexETag: "",
        lastVerifiedAt: "",
        localDirty: true,
        dirtyPaths: ["data/m/recovered"],
        bulkInvalidated: false,
      }),
    );

    // Seed a file in the dirty directory
    await seedFile(cachePath, "data/m/recovered/state-main/1/raw", "recovered");
    // Seed a file in a NON-dirty directory
    await seedFile(cachePath, "data/m/other/state-main/1/raw", "other");

    // Fresh service — simulates process restart
    const service = new S3CacheSyncService(mock, cachePath);
    mock.puts.length = 0;
    await service.pushChanged();

    const uploadedKeys = mock.puts.map((p) => p.key);
    assert(
      uploadedKeys.includes("data/m/recovered/state-main/1/raw"),
      "recovered dirty path must be pushed after crash recovery",
    );
    assertEquals(
      uploadedKeys.includes("data/m/other/state-main/1/raw"),
      false,
      "non-dirty path must NOT be pushed (scoped walk from sidecar)",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("markDirty: path traversal triggers bulk invalidation", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-traversal-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    // A relPath with ../ that escapes the cache dir
    await service.markDirty({
      relPath: "../../../somewhere/outside/cache.yaml",
    });

    const sidecar = await readSidecar(cachePath);
    assertEquals(
      sidecar?.bulkInvalidated,
      true,
      "path traversal must trigger bulk invalidation",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("v1 sidecar read by v2 code: falls back to full walk", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-v1-migration-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    // Write a v1 sidecar directly
    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    await ensureDir(cachePath);
    await Deno.writeTextFile(
      sidecarPath,
      JSON.stringify({
        version: 1,
        remoteIndexETag: "",
        lastVerifiedAt: "",
        localDirty: true,
      }),
    );

    await seedFile(cachePath, "data/m/a/payload.yaml", "aaa");
    await seedFile(cachePath, "data/m/b/payload.yaml", "bbb");

    const service = new S3CacheSyncService(mock, cachePath);
    mock.puts.length = 0;
    await service.pushChanged();

    const uploadedKeys = mock.puts.map((p) => p.key);
    assert(
      uploadedKeys.includes("data/m/a/payload.yaml"),
      "v1 sidecar must trigger full walk — file a",
    );
    assert(
      uploadedKeys.includes("data/m/b/payload.yaml"),
      "v1 sidecar must trigger full walk — file b",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushFile: computes and stores SHA-256 hash in index entry", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-sha256-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    // Pull to initialize index
    await service.pullChanged();

    const content = "hello world";
    await seedFile(cachePath, "data/m/test.yaml", content);
    await service.pushFile("data/m/test.yaml");

    const state = privateState(service);
    const entry = state.index?.entries["data/m/test.yaml"] as {
      sha256?: string;
    };
    assertExists(entry?.sha256, "pushFile must record sha256 in index entry");
    assertEquals(
      entry.sha256.length,
      64,
      "sha256 must be a 64-char hex string",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: SHA-256 detects unchanged content despite mtime difference", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-sha256-dedup-" });
  try {
    const mock = createMockS3Client();

    // Compute the SHA-256 of "same content" for the index entry
    const content = "same content";
    const data = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const sha256 = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Seed remote index with sha256 and a fake mtime that won't match local
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/m/dedup.yaml": {
          key: "data/m/dedup.yaml",
          size: data.length,
          lastModified: new Date().toISOString(),
          localMtime: new Date(0).toISOString(),
          sha256,
        },
      }),
    );

    // Write local file with same content but different mtime
    await seedFile(cachePath, "data/m/dedup.yaml", content);

    const service = new S3CacheSyncService(mock, cachePath);
    mock.puts.length = 0;
    const pushed = await service.pushChanged();

    assertEquals(
      pushed,
      0,
      "SHA-256 match must skip upload despite mtime difference",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: SHA-256 fallback detects same-size change when mtime matches (#1307)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-sha256-mtime-" });
  try {
    const mock = createMockS3Client();

    const oldContent = "content-v1";
    const newContent = "content-v2";
    const oldData = new TextEncoder().encode(oldContent);
    const newData = new TextEncoder().encode(newContent);
    assertEquals(
      oldData.length,
      newData.length,
      "test content must be same size",
    );

    const oldHashBuffer = await crypto.subtle.digest("SHA-256", oldData);
    const oldSha256 = Array.from(new Uint8Array(oldHashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // Write the new content locally
    await seedFile(cachePath, "data/m/samelen.yaml", newContent);
    const stat = await Deno.stat(join(cachePath, "data/m/samelen.yaml"));

    // Seed the remote index with old hash but the SAME mtime as the local file —
    // simulates coarse-grained filesystem where mtime didn't change
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/m/samelen.yaml": {
          key: "data/m/samelen.yaml",
          size: oldData.length,
          lastModified: new Date().toISOString(),
          localMtime: stat.mtime!.toISOString(),
          sha256: oldSha256,
        },
      }),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    mock.puts.length = 0;
    const pushed = await service.pushChanged();

    assert(
      typeof pushed === "number" && pushed > 0,
      "same size + same mtime but different content must trigger push via SHA-256 fallback",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: SHA-256 fallback skips push when mtime matches and content unchanged (#1307)", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-sha256-mtime-skip-",
  });
  try {
    const mock = createMockS3Client();

    const content = "unchanged content";
    const data = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const sha256 = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await seedFile(cachePath, "data/m/stable.yaml", content);
    const stat = await Deno.stat(join(cachePath, "data/m/stable.yaml"));

    // Same mtime, same size, same hash — must NOT push
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/m/stable.yaml": {
          key: "data/m/stable.yaml",
          size: data.length,
          lastModified: new Date().toISOString(),
          localMtime: stat.mtime!.toISOString(),
          sha256,
        },
      }),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    mock.puts.length = 0;
    const pushed = await service.pushChanged();

    assertEquals(
      pushed,
      0,
      "same size + same mtime + same SHA-256 must skip push",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: partitioned index dual-write creates partition files", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-partitioned-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    // Seed files for two different models
    await seedFile(
      cachePath,
      "data/aws/ec2/vpc/abc-123/state-main/1/raw",
      "vpc-data",
    );
    await seedFile(
      cachePath,
      "data/aws/s3/bucket/xyz-789/state-main/1/raw",
      "bucket-data",
    );

    mock.puts.length = 0;
    await service.pushChanged();

    const putKeys = mock.puts.map((p) => p.key);

    // Monolithic index must be written
    assert(
      putKeys.includes(".datastore-index.json"),
      "monolithic index must be written",
    );

    // Partition files must be written
    assert(
      putKeys.some((k) =>
        k.startsWith("_index/") && k.endsWith(".json") &&
        k !== "_index/_meta.json"
      ),
      "at least one partition file must be written",
    );
    assert(
      putKeys.includes("_index/_meta.json"),
      "_meta.json must be written",
    );

    // Verify monolithic is written BEFORE partitions (write order for crash safety)
    const monolithicIdx = putKeys.indexOf(".datastore-index.json");
    const firstPartitionIdx = putKeys.findIndex((k) => k.startsWith("_index/"));
    assert(
      monolithicIdx < firstPartitionIdx,
      "monolithic index must be written before partition files",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: scoped pull reads partition files instead of monolithic", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-scoped-pull-" });
  try {
    const mock = createMockS3Client();

    // Seed a partition file and the data it references
    const partitionKey = "data--aws--ec2--vpc--abc-123";
    const partitionIndex = {
      version: 1,
      entries: {
        "data/aws/ec2/vpc/abc-123/state-main/1/raw": {
          key: "data/aws/ec2/vpc/abc-123/state-main/1/raw",
          size: 8,
          lastModified: new Date().toISOString(),
        },
      },
    };
    mock.storage.set(
      `_index/${partitionKey}.json`,
      new TextEncoder().encode(JSON.stringify(partitionIndex)),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc-123/state-main/1/raw",
      new TextEncoder().encode("vpc-data"),
    );

    // Also seed monolithic index with more entries
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/aws/ec2/vpc/abc-123/state-main/1/raw": {
          key: "data/aws/ec2/vpc/abc-123/state-main/1/raw",
          size: 8,
          lastModified: new Date().toISOString(),
        },
        "data/aws/s3/bucket/xyz/state-main/1/raw": {
          key: "data/aws/s3/bucket/xyz/state-main/1/raw",
          size: 6,
          lastModified: new Date().toISOString(),
        },
      }),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    mock.gets.length = 0;
    const pulled = await service.pullChanged({
      context: {
        models: [{ modelType: "aws/ec2/vpc", modelId: "abc-123" }],
      },
    });

    assertEquals(pulled, 1, "scoped pull must download the partition's file");

    // The scoped pull should have read the partition file, NOT the monolithic
    assert(
      mock.gets.includes(`_index/${partitionKey}.json`),
      "scoped pull must read the partition file",
    );
    assertEquals(
      mock.gets.includes(".datastore-index.json"),
      false,
      "scoped pull must NOT read the monolithic index when partition exists",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: scoped pull falls back to monolithic when partition missing", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-scoped-fallback-",
  });
  try {
    const mock = createMockS3Client();
    // NO partition files — only monolithic
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/aws/ec2/vpc/abc-123/state-main/1/raw": {
          key: "data/aws/ec2/vpc/abc-123/state-main/1/raw",
          size: 8,
          lastModified: new Date().toISOString(),
        },
      }),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc-123/state-main/1/raw",
      new TextEncoder().encode("vpc-data"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    mock.gets.length = 0;
    const pulled = await service.pullChanged({
      context: {
        models: [{ modelType: "aws/ec2/vpc", modelId: "abc-123" }],
      },
    });

    assertEquals(pulled, 1, "fallback must still download the file");
    assert(
      mock.gets.includes(".datastore-index.json"),
      "must fall back to monolithic when partition file is missing",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("capabilities: returns scopedSync true", () => {
  const mock = createMockS3Client();
  const service = new S3CacheSyncService(mock, "/tmp/unused");
  assertEquals(service.capabilities().scopedSync, true);
});

Deno.test("configurable concurrency: constructor accepts custom values", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-concurrency-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    // Create service with custom concurrency
    const service = new S3CacheSyncService(mock, cachePath, {
      pullConcurrency: 5,
      pushConcurrency: 3,
    });

    // Verify it works by running a sync — concurrency values are
    // internal, so we just verify the service operates correctly
    await seedFile(cachePath, "data/m/test.yaml", "test");
    await service.pushChanged();
    assert(
      mock.puts.some((p) => p.key === "data/m/test.yaml"),
      "push must work with custom concurrency",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- Issue #436: Only write dirty partition files on push --
// Tests 1-5 prove partition writes are reduced AND nothing breaks when
// partitions are skipped.

/** Seeds N models with filesPerModel files each, returns model IDs. */
async function seedModels(
  cachePath: string,
  n: number,
  filesPerModel: number,
): Promise<string[]> {
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    const id = `model-${String(i).padStart(3, "0")}`;
    ids.push(id);
    for (let j = 0; j < filesPerModel; j++) {
      await seedFile(
        cachePath,
        `data/aws/ec2/vpc/${id}/state-main/${j + 1}/raw`,
        `${id}-data-${j}`,
      );
    }
  }
  return ids;
}

// Test 1: Scoped push writes only dirty partitions
Deno.test("#436 test 1: scoped push with 1000 files across 50 models writes only 1 dirty partition", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-436-t1-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    // Seed 1000 files across 50 models (20 files each)
    const ids = await seedModels(cachePath, 50, 20);

    // Initial push — baseline, all 50 partitions written
    await service.pushChanged();
    const baselinePuts = mock.puts.filter(
      (p) =>
        p.key.startsWith("_index/") && p.key.endsWith(".json") &&
        p.key !== "_index/_meta.json",
    );
    assertEquals(
      baselinePuts.length,
      50,
      "baseline push must write all 50 partition files",
    );

    // Modify 1 file in model-000 only
    await service.markDirty({
      relPath: `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
    });
    await seedFile(
      cachePath,
      `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
      "modified-data",
    );

    mock.puts.length = 0;
    await service.pushChanged();

    const putKeys = mock.puts.map((p) => p.key);

    // Monolithic index must be written
    assert(
      putKeys.includes(".datastore-index.json"),
      "monolithic index must be written",
    );

    // Count _index/ PUTs: should be exactly 2 (1 partition + 1 _meta.json)
    const indexPuts = putKeys.filter((k) => k.startsWith("_index/"));
    assertEquals(
      indexPuts.length,
      2,
      `expected 2 _index/ PUTs (1 partition + 1 meta), got ${indexPuts.length}: ${
        JSON.stringify(indexPuts)
      }`,
    );

    // The 1 partition must be model-000's
    const partitionPuts = indexPuts.filter((k) => k !== "_index/_meta.json");
    assertEquals(partitionPuts.length, 1);
    assertEquals(
      partitionPuts[0],
      `_index/data--aws--ec2--vpc--${ids[0]}.json`,
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// Test 2: Bulk push writes all partition files (backward compat)
Deno.test("#436 test 2: bulk push (bulkInvalidated) writes all partition files", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-436-t2-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    await seedModels(cachePath, 10, 5);

    // Bulk markDirty (no relPath) → bulkInvalidated → all partitions written
    await service.markDirty();

    mock.puts.length = 0;
    await service.pushChanged();

    const partitionPuts = mock.puts.filter(
      (p) =>
        p.key.startsWith("_index/") && p.key.endsWith(".json") &&
        p.key !== "_index/_meta.json",
    );
    assertEquals(
      partitionPuts.length,
      10,
      `bulk push must write all 10 partition files, got ${partitionPuts.length}`,
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// Test 3: _meta.json always complete after scoped push
Deno.test("#436 test 3: _meta.json lists ALL 50 partition keys after scoped push of 1", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-436-t3-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    const ids = await seedModels(cachePath, 50, 20);
    await service.pushChanged();

    // Modify 1 model only
    await service.markDirty({
      relPath: `data/aws/ec2/vpc/${ids[7]}/state-main/1/raw`,
    });
    await seedFile(
      cachePath,
      `data/aws/ec2/vpc/${ids[7]}/state-main/1/raw`,
      "changed",
    );

    mock.puts.length = 0;
    await service.pushChanged();

    const metaPut = mock.puts.find((p) => p.key === "_index/_meta.json");
    assertExists(metaPut, "_meta.json PUT must exist");
    const meta = JSON.parse(new TextDecoder().decode(metaPut!.body));
    assertEquals(meta.version, 1);
    assertEquals(
      meta.partitions.length,
      50,
      `_meta.json must list all 50 partitions, got ${meta.partitions.length}`,
    );

    // Verify every model ID appears in the partition list
    const expectedKeys = ids.map((id) => `data--aws--ec2--vpc--${id}`).sort();
    assertEquals(
      [...meta.partitions].sort(),
      expectedKeys,
      "_meta.json partition keys must match all model IDs",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// Test 4 (critical): Scoped pull for non-dirty model after dirty-only write
Deno.test("#436 test 4: scoped pull for non-dirty model B works after only model A's partition was rewritten", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-436-t4-" });
  const readerCachePath = await Deno.makeTempDir({
    prefix: "s3sync-436-t4-reader-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    // Writer: push 50 models (all partitions written)
    const writer = new S3CacheSyncService(mock, cachePath);
    const ids = await seedModels(cachePath, 50, 20);
    await writer.pushChanged();

    // Writer: modify model A (ids[0]) and push — only partition A rewritten
    await writer.markDirty({
      relPath: `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
    });
    await seedFile(
      cachePath,
      `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
      "model-a-updated",
    );
    await writer.pushChanged();

    // Reader: scoped pull for model B (ids[25]) — partition B was NOT
    // rewritten in the second push. It must still be valid from the
    // first push.
    const reader = new S3CacheSyncService(mock, readerCachePath);
    mock.gets.length = 0;
    const pulled = await reader.pullChanged({
      context: {
        models: [{ modelType: "aws/ec2/vpc", modelId: ids[25] }],
      },
    });

    // Reader must have read partition B's file, not monolithic
    const partitionKey = `data--aws--ec2--vpc--${ids[25]}`;
    assert(
      mock.gets.includes(`_index/${partitionKey}.json`),
      "reader must read model B's partition file",
    );
    assertEquals(
      mock.gets.includes(".datastore-index.json"),
      false,
      "reader must NOT fall back to monolithic for non-dirty model B",
    );

    // Reader must have received model B's files
    assertEquals(
      pulled,
      20,
      "reader must pull all 20 files for model B from its (first-push) partition",
    );

    // Verify model B's data is correct
    const localFile = await Deno.readTextFile(
      join(readerCachePath, `data/aws/ec2/vpc/${ids[25]}/state-main/1/raw`),
    );
    assertEquals(
      localFile,
      `${ids[25]}-data-0`,
      "model B's data must be intact from the first push",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
    await Deno.remove(readerCachePath, { recursive: true });
  }
});

// Test 5: Scoped pull for dirty model after dirty-only write
Deno.test("#436 test 5: scoped pull for dirty model A gets updated data after partition rewrite", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-436-t5-" });
  const readerCachePath = await Deno.makeTempDir({
    prefix: "s3sync-436-t5-reader-",
  });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    // Writer: push 10 models
    const writer = new S3CacheSyncService(mock, cachePath);
    const ids = await seedModels(cachePath, 10, 5);
    await writer.pushChanged();

    // Writer: modify model A (ids[0]) and push
    await writer.markDirty({
      relPath: `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
    });
    await seedFile(
      cachePath,
      `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
      "UPDATED-model-a",
    );
    await writer.pushChanged();

    // Reader: scoped pull for model A — partition A was rewritten
    const reader = new S3CacheSyncService(mock, readerCachePath);
    const pulled = await reader.pullChanged({
      context: {
        models: [{ modelType: "aws/ec2/vpc", modelId: ids[0] }],
      },
    });

    assertEquals(
      pulled,
      5,
      "reader must pull all 5 files for model A",
    );

    // Verify the updated content was pulled
    const localFile = await Deno.readTextFile(
      join(readerCachePath, `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`),
    );
    assertEquals(
      localFile,
      "UPDATED-model-a",
      "reader must get the updated data for model A",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
    await Deno.remove(readerCachePath, { recursive: true });
  }
});

// -- Lazy hydration (Issue #440) -------------------------------------------

// -- isLazySkippable unit tests --------------------------------------------

Deno.test("isLazySkippable: skips data/*/raw files", () => {
  assert(isLazySkippable("data/aws/ec2/vpc/abc/state-main/1/raw"));
  assert(isLazySkippable("data/gcp/compute/instance/xyz/state-main/2/raw"));
});

Deno.test("isLazySkippable: allows metadata.yaml under data/", () => {
  assertEquals(
    isLazySkippable("data/aws/ec2/vpc/abc/state-main/1/metadata.yaml"),
    false,
  );
});

Deno.test("isLazySkippable: allows latest pointer under data/", () => {
  assertEquals(
    isLazySkippable("data/aws/ec2/vpc/abc/state-main/latest"),
    false,
  );
});

Deno.test("isLazySkippable: allows non-data paths", () => {
  assertEquals(isLazySkippable("outputs/my-output/1/raw"), false);
  assertEquals(isLazySkippable("workflow-runs/run-1/result.yaml"), false);
  assertEquals(isLazySkippable("definitions-evaluated/model-a.yaml"), false);
});

Deno.test("isLazySkippable: rejects degenerate data/raw (insufficient depth)", () => {
  assertEquals(isLazySkippable("data/raw"), false);
});

// -- Lazy pullChanged tests ------------------------------------------------

Deno.test("pullChanged: metadataOnly skips raw files", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-lazy-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    const entries: Record<
      string,
      { key: string; size: number; lastModified: string }
    > = {
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml": {
        key: "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
        size: 5,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/abc/state-main/1/raw": {
        key: "data/aws/ec2/vpc/abc/state-main/1/raw",
        size: 1000,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/abc/state-main/latest": {
        key: "data/aws/ec2/vpc/abc/state-main/latest",
        size: 3,
        lastModified: new Date().toISOString(),
      },
      "outputs/my-output/1/result.yaml": {
        key: "outputs/my-output/1/result.yaml",
        size: 10,
        lastModified: new Date().toISOString(),
      },
    };

    mock.storage.set(".datastore-index.json", encodeIndex(entries));
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
      new TextEncoder().encode("meta!"),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/raw",
      new TextEncoder().encode("x".repeat(1000)),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/latest",
      new TextEncoder().encode("1\n"),
    );
    mock.storage.set(
      "outputs/my-output/1/result.yaml",
      new TextEncoder().encode("result: ok"),
    );

    const pulled = await service.pullChanged({ metadataOnly: true });
    assertEquals(
      pulled,
      3,
      "should pull metadata.yaml, latest, and output — skip raw",
    );

    // Verify raw was NOT downloaded
    const rawGets = mock.gets.filter((k) =>
      k === "data/aws/ec2/vpc/abc/state-main/1/raw"
    );
    assertEquals(rawGets.length, 0, "raw file should not be fetched");

    // Verify metadata.yaml WAS downloaded
    const metaExists = await Deno.stat(
      join(cachePath, "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml"),
    ).then(() => true).catch(() => false);
    assert(metaExists, "metadata.yaml should exist locally");

    // Verify parent dir for raw was created
    const rawParentExists = await Deno.stat(
      join(cachePath, "data/aws/ec2/vpc/abc/state-main/1"),
    ).then((s) => s.isDirectory).catch(() => false);
    assert(rawParentExists, "parent directory for raw should be created");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: without metadataOnly downloads everything including raw", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-lazy-sub-" });
  try {
    const mock = createMockS3Client();

    const entries: Record<
      string,
      { key: string; size: number; lastModified: string }
    > = {
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml": {
        key: "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
        size: 5,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/abc/state-main/1/raw": {
        key: "data/aws/ec2/vpc/abc/state-main/1/raw",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    };

    mock.storage.set(".datastore-index.json", encodeIndex(entries));
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
      new TextEncoder().encode("meta!"),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/raw",
      new TextEncoder().encode("data"),
    );

    const service = new S3CacheSyncService(mock, cachePath);

    const pulled = await service.pullChanged();
    assertEquals(
      pulled,
      2,
      "without metadataOnly should download ALL files including raw",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- hydrateFile tests -----------------------------------------------------

Deno.test("hydrateFile: downloads a single file on demand", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-hydrate-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    const rawContent = new TextEncoder().encode("file-content-here");
    mock.storage.set("data/aws/ec2/vpc/abc/state-main/1/raw", rawContent);

    const result = await service.hydrateFile(
      "data/aws/ec2/vpc/abc/state-main/1/raw",
    );
    assertEquals(result, true, "hydrateFile should return true on success");

    const content = await Deno.readTextFile(
      join(cachePath, "data/aws/ec2/vpc/abc/state-main/1/raw"),
    );
    assertEquals(content, "file-content-here");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("hydrateFile: returns false for missing file", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-hydrate-404-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    const result = await service.hydrateFile(
      "data/aws/ec2/vpc/abc/state-main/1/raw",
    );
    assertEquals(
      result,
      false,
      "hydrateFile should return false for missing file",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- capabilities test -----------------------------------------------------

Deno.test("capabilities: returns lazyHydration: true", () => {
  const mock = createMockS3Client();
  const service = new S3CacheSyncService(mock, "/tmp/dummy");
  const caps = service.capabilities();
  assertEquals(caps.scopedSync, true);
  assertEquals(caps.lazyHydration, true);
});

// -- lazyPullActive: push safety after lazy pull ---------------------------

Deno.test("pushChanged after metadataOnly pull preserves remote entries in index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-lazypush-" });
  try {
    const mock = createMockS3Client();

    const entries: Record<
      string,
      { key: string; size: number; lastModified: string }
    > = {
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml": {
        key: "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
        size: 5,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/abc/state-main/1/raw": {
        key: "data/aws/ec2/vpc/abc/state-main/1/raw",
        size: 1000,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/abc/state-main/latest": {
        key: "data/aws/ec2/vpc/abc/state-main/latest",
        size: 3,
        lastModified: new Date().toISOString(),
      },
    };

    mock.storage.set(".datastore-index.json", encodeIndex(entries));
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
      new TextEncoder().encode("meta!"),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/raw",
      new TextEncoder().encode("x".repeat(1000)),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/latest",
      new TextEncoder().encode("1\n"),
    );

    // Lazy pull — skips raw
    const svc = new S3CacheSyncService(mock, cachePath);
    await svc.pullChanged({ metadataOnly: true });

    // Write a new local file
    await seedFile(
      cachePath,
      "data/aws/ec2/vpc/new/state-main/1/raw",
      "new-data",
    );
    await svc.markDirty();

    // Push — must NOT drop the remote raw entry
    await svc.pushChanged();

    // Verify: the remote index still has ALL original entries plus the new one
    const indexPut = mock.puts.filter((p) => p.key === ".datastore-index.json")
      .pop();
    assertExists(indexPut, "index should have been written");
    const idx = decodeIndex(indexPut.body);
    assert(
      "data/aws/ec2/vpc/abc/state-main/1/raw" in idx.entries,
      "remote raw entry must be preserved after push",
    );
    assert(
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml" in idx.entries,
      "metadata entry must be preserved",
    );
    assert(
      "data/aws/ec2/vpc/new/state-main/1/raw" in idx.entries,
      "new file must appear in index",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("lazyPullActive clears after full pull, restoring normal push behavior", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-lazyclear-" });
  try {
    const mock = createMockS3Client();

    const entries: Record<
      string,
      { key: string; size: number; lastModified: string }
    > = {
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml": {
        key: "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
        size: 5,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/abc/state-main/1/raw": {
        key: "data/aws/ec2/vpc/abc/state-main/1/raw",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    };

    mock.storage.set(".datastore-index.json", encodeIndex(entries));
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
      new TextEncoder().encode("meta!"),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/raw",
      new TextEncoder().encode("data"),
    );

    const svc = new S3CacheSyncService(mock, cachePath);

    // Lazy pull
    await svc.pullChanged({ metadataOnly: true });
    const sidecar1 = await readSidecar(cachePath);
    assertEquals(
      (sidecar1 as Record<string, unknown>)?.lazyPullActive,
      true,
      "lazyPullActive should be true after metadataOnly pull",
    );

    // Verify raw is NOT on disk yet
    const rawMissing = await Deno.stat(
      join(cachePath, "data/aws/ec2/vpc/abc/state-main/1/raw"),
    ).then(() => false).catch(() => true);
    assert(rawMissing, "raw should be absent after lazy pull");

    // Full pull — must download raw and clear the flag
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1, "full pull must download the missing raw file");

    const sidecar2 = await readSidecar(cachePath);
    assertEquals(
      (sidecar2 as Record<string, unknown>)?.lazyPullActive,
      false,
      "lazyPullActive should be false after full pull",
    );

    // Verify raw IS on disk now
    const rawContent = await Deno.readTextFile(
      join(cachePath, "data/aws/ec2/vpc/abc/state-main/1/raw"),
    );
    assertEquals(
      rawContent,
      "data",
      "raw file must be downloaded by full pull",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("lazyPullActive persists across process restarts", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-lazypersist-" });
  try {
    const mock = createMockS3Client();

    const entries: Record<
      string,
      { key: string; size: number; lastModified: string }
    > = {
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml": {
        key: "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
        size: 5,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/abc/state-main/1/raw": {
        key: "data/aws/ec2/vpc/abc/state-main/1/raw",
        size: 1000,
        lastModified: new Date().toISOString(),
      },
    };

    mock.storage.set(".datastore-index.json", encodeIndex(entries));
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/metadata.yaml",
      new TextEncoder().encode("meta!"),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/abc/state-main/1/raw",
      new TextEncoder().encode("x".repeat(1000)),
    );

    // Process 1: lazy pull
    const svc1 = new S3CacheSyncService(mock, cachePath);
    await svc1.pullChanged({ metadataOnly: true });

    // Process 2: fresh instance, push
    const svc2 = new S3CacheSyncService(mock, cachePath);
    await seedFile(cachePath, "data/aws/ec2/vpc/new/state-main/1/raw", "new");
    await svc2.markDirty();
    await svc2.pushChanged();

    // Verify remote index preserves original raw entry
    const indexPut = mock.puts.filter((p) => p.key === ".datastore-index.json")
      .pop();
    assertExists(indexPut);
    const idx = decodeIndex(indexPut.body);
    assert(
      "data/aws/ec2/vpc/abc/state-main/1/raw" in idx.entries,
      "remote raw must survive push from fresh process after lazy pull",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("scoped pull does not clear lazyPullActive", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-lazyscoped-" });
  try {
    const mock = createMockS3Client();
    const modelId = "abc-model-id";

    const entries: Record<
      string,
      { key: string; size: number; lastModified: string }
    > = {
      [`data/aws/ec2/vpc/${modelId}/state-main/1/metadata.yaml`]: {
        key: `data/aws/ec2/vpc/${modelId}/state-main/1/metadata.yaml`,
        size: 5,
        lastModified: new Date().toISOString(),
      },
      [`data/aws/ec2/vpc/${modelId}/state-main/1/raw`]: {
        key: `data/aws/ec2/vpc/${modelId}/state-main/1/raw`,
        size: 4,
        lastModified: new Date().toISOString(),
      },
      "data/aws/ec2/vpc/other-model/state-main/1/raw": {
        key: "data/aws/ec2/vpc/other-model/state-main/1/raw",
        size: 100,
        lastModified: new Date().toISOString(),
      },
    };

    mock.storage.set(".datastore-index.json", encodeIndex(entries));
    mock.storage.set(
      `data/aws/ec2/vpc/${modelId}/state-main/1/metadata.yaml`,
      new TextEncoder().encode("meta!"),
    );
    mock.storage.set(
      `data/aws/ec2/vpc/${modelId}/state-main/1/raw`,
      new TextEncoder().encode("data"),
    );
    mock.storage.set(
      "data/aws/ec2/vpc/other-model/state-main/1/raw",
      new TextEncoder().encode("x".repeat(100)),
    );

    const svc = new S3CacheSyncService(mock, cachePath);

    // Lazy pull
    await svc.pullChanged({ metadataOnly: true });
    const sidecar1 = await readSidecar(cachePath);
    assertEquals(
      (sidecar1 as Record<string, unknown>)?.lazyPullActive,
      true,
    );

    // Scoped pull for one model — must NOT clear lazyPullActive
    await svc.pullChanged({
      context: { models: [{ modelType: "aws/ec2/vpc", modelId }] },
    });
    const sidecar2 = await readSidecar(cachePath);
    assertEquals(
      (sidecar2 as Record<string, unknown>)?.lazyPullActive,
      true,
      "scoped pull must not clear lazyPullActive",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ---------------------------------------------------------------------------
// Namespace-scoped sync tests (swamp-club #533)
// ---------------------------------------------------------------------------

Deno.test("pullChanged with namespace fetches per-namespace index", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const nsIndex = encodeIndex({
      "data/model/1/raw": {
        key: "data/model/1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set("my-ns/.datastore-index.json", nsIndex);
    s3.storage.set("my-ns/data/model/1/raw", new TextEncoder().encode("hello"));

    const svc = new S3CacheSyncService(s3, cachePath);
    const pulled = await svc.pullChanged({ namespace: "my-ns" });
    assertEquals(pulled, 1);

    const got = s3.gets.filter((k) => k.includes(".datastore-index.json"));
    assertEquals(got, ["my-ns/.datastore-index.json"]);

    const dataGets = s3.gets.filter((k) => k.includes("data/model/1/raw"));
    assertEquals(dataGets, ["my-ns/data/model/1/raw"]);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged with namespace writes files under namespace dir locally (swamp-club#1483)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const nsIndex = encodeIndex({
      "data/model/1/raw": {
        key: "data/model/1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set("my-ns/.datastore-index.json", nsIndex);
    s3.storage.set("my-ns/data/model/1/raw", new TextEncoder().encode("hello"));

    const svc = new S3CacheSyncService(s3, cachePath);
    const pulled = await svc.pullChanged({ namespace: "my-ns" });
    assertEquals(pulled, 1);

    const namespacedPath = join(
      cachePath,
      "my-ns",
      "data",
      "model",
      "1",
      "raw",
    );
    const stat = await Deno.stat(namespacedPath);
    assert(
      stat.isFile,
      "pulled file must exist at <cachePath>/<namespace>/data/...",
    );

    const content = await Deno.readTextFile(namespacedPath);
    assertEquals(content, "hello");

    let bareStat: Deno.FileInfo | null = null;
    try {
      bareStat = await Deno.stat(join(cachePath, "data", "model", "1", "raw"));
    } catch { /* expected */ }
    assertEquals(
      bareStat,
      null,
      "pulled file must NOT exist at bare <cachePath>/data/...",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged → pushChanged round-trip with namespace: zero re-uploads (swamp-club#1483)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const nsIndex = encodeIndex({
      "data/model/1/raw": {
        key: "data/model/1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set("my-ns/.datastore-index.json", nsIndex);
    s3.storage.set("my-ns/data/model/1/raw", new TextEncoder().encode("hello"));

    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    await svc.pullChanged({ namespace: "my-ns" });

    s3.puts.length = 0;

    const pushed = await svc.pushChanged({ namespace: "my-ns" });
    const dataPuts = s3.puts.filter((p) => p.key.includes("data/model/1/raw"));
    assertEquals(
      dataPuts.length,
      0,
      "pushChanged must not re-upload files that pullChanged just downloaded",
    );
    assertEquals(
      pushed,
      0,
      "zero net changes expected after a clean round-trip",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged with namespace writes per-namespace index", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    await seedFile(cachePath, "my-ns/data/model/1/raw", "hello");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });
    assert((pushed as number) >= 1);

    // Fresh bucket uses v2 shard-first: _meta.json and shard files under
    // the namespace, NOT a monolithic index.
    const metaPuts = s3.puts.filter((p) => p.key === "my-ns/_index/_meta.json");
    assert(metaPuts.length > 0, "must write per-namespace _meta.json");

    const globalPuts = s3.puts.filter((p) => p.key === ".datastore-index.json");
    assertEquals(globalPuts.length, 0, "must not write global index");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged with namespace does not delete files outside namespace", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    s3.storage.set("other-ns/data/file.txt", new TextEncoder().encode("keep"));
    const otherIndex = encodeIndex({
      "other-ns/data/file.txt": {
        key: "other-ns/data/file.txt",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set("other-ns/.datastore-index.json", otherIndex);

    await seedFile(cachePath, "my-ns/data/local.txt", "local");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    await svc.pushChanged({ namespace: "my-ns" });

    assert(
      s3.storage.has("other-ns/data/file.txt"),
      "files outside namespace must not be deleted",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("solo mode (no namespace) uses global index", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const globalIndex = encodeIndex({
      "data/file.txt": {
        key: "data/file.txt",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set(".datastore-index.json", globalIndex);
    s3.storage.set("data/file.txt", new TextEncoder().encode("data"));

    const svc = new S3CacheSyncService(s3, cachePath);
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1);

    const got = s3.gets.filter((k) => k.includes(".datastore-index.json"));
    assertEquals(got, [".datastore-index.json"]);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("namespace assertion throws on mismatch", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new S3CacheSyncService(s3, cachePath);
    await svc.pullChanged({ namespace: "ns-a" });

    await assertRejects(
      () => svc.pushChanged({ namespace: "ns-b" }),
      Error,
      "Namespace mismatch",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("exportCatalog writes to namespace catalog path", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new S3CacheSyncService(s3, cachePath);
    await svc.exportCatalog("my-ns", [
      { relPath: "data/file.txt", size: 10, lastModified: "2026-01-01" },
    ]);

    assert(s3.storage.has("my-ns/.catalog-export.json"));
    const data = JSON.parse(
      new TextDecoder().decode(s3.storage.get("my-ns/.catalog-export.json")!),
    );
    assertEquals(data.length, 1);
    assertEquals(data[0].relPath, "data/file.txt");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("exportCatalog skips putObject when rows are unchanged", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new S3CacheSyncService(s3, cachePath);
    const rows = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
      { relPath: "data/b.txt", size: 20, lastModified: "2026-01-02" },
    ];

    await svc.exportCatalog("ns", rows);
    const putsAfterFirst = s3.puts.filter((p) =>
      p.key === "ns/.catalog-export.json"
    ).length;
    assertEquals(putsAfterFirst, 1, "First export should upload");

    await svc.exportCatalog("ns", rows);
    const putsAfterSecond = s3.puts.filter((p) =>
      p.key === "ns/.catalog-export.json"
    ).length;
    assertEquals(
      putsAfterSecond,
      1,
      "Second export with same rows should skip",
    );

    await svc.exportCatalog("ns", rows);
    const putsAfterThird =
      s3.puts.filter((p) => p.key === "ns/.catalog-export.json").length;
    assertEquals(putsAfterThird, 1, "Third export with same rows should skip");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("exportCatalog uploads when rows differ", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new S3CacheSyncService(s3, cachePath);
    const rows1 = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
    ];
    const rows2 = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
      { relPath: "data/b.txt", size: 20, lastModified: "2026-01-02" },
    ];

    await svc.exportCatalog("ns", rows1);
    assertEquals(
      s3.puts.filter((p) => p.key === "ns/.catalog-export.json").length,
      1,
    );

    await svc.exportCatalog("ns", rows2);
    assertEquals(
      s3.puts.filter((p) => p.key === "ns/.catalog-export.json").length,
      2,
      "Changed rows should trigger upload",
    );

    const data = JSON.parse(
      new TextDecoder().decode(s3.storage.get("ns/.catalog-export.json")!),
    );
    assertEquals(data.length, 2, "S3 should have the updated catalog");
    assertEquals(data[1].relPath, "data/b.txt");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("exportCatalog hash survives across service instances via sidecar", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const rows = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
    ];

    const svc1 = new S3CacheSyncService(s3, cachePath);
    await svc1.exportCatalog("ns", rows);
    assertEquals(
      s3.puts.filter((p) => p.key === "ns/.catalog-export.json").length,
      1,
    );

    const svc2 = new S3CacheSyncService(s3, cachePath);
    await svc2.exportCatalog("ns", rows);
    assertEquals(
      s3.puts.filter((p) => p.key === "ns/.catalog-export.json").length,
      1,
      "New service instance should skip upload when sidecar has matching hash",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullForeignCatalogs skips missing catalogs silently", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const catalog = JSON.stringify([
      { relPath: "data/a.txt", size: 5, lastModified: "2026-01-01" },
    ]);
    s3.storage.set(
      "ns-a/.catalog-export.json",
      new TextEncoder().encode(catalog),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const results = await svc.pullForeignCatalogs(["ns-a", "ns-missing"]);

    assertEquals(results.length, 1);
    assertEquals(results[0].namespace, "ns-a");
    assertEquals(results[0].rows.length, 1);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullForeignCatalogs skips malformed JSON silently", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    s3.storage.set(
      "ns-bad/.catalog-export.json",
      new TextEncoder().encode("not valid json {{{"),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const results = await svc.pullForeignCatalogs(["ns-bad"]);
    assertEquals(results.length, 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("fetchForeignContent returns bytes for existing file", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const content = new TextEncoder().encode("foreign data");
    s3.storage.set("other-ns/data/file.txt", content);

    const svc = new S3CacheSyncService(s3, cachePath);
    const result = await svc.fetchForeignContent("other-ns", "data/file.txt");
    assertExists(result);
    assertEquals(new TextDecoder().decode(result), "foreign data");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("fetchForeignContent returns null for missing file", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new S3CacheSyncService(s3, cachePath);
    const result = await svc.fetchForeignContent("other-ns", "no-such-file");
    assertEquals(result, null);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("fetchForeignContent rejects path traversal", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new S3CacheSyncService(s3, cachePath);
    await assertRejects(
      () => svc.fetchForeignContent("ns", "../../../etc/passwd"),
      Error,
      "Path traversal rejected",
    );
    await assertRejects(
      () => svc.fetchForeignContent("ns", "/absolute/path"),
      Error,
      "Path traversal rejected",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("capabilities advertises namespacedSync", () => {
  const s3 = createMockS3Client();
  const svc = new S3CacheSyncService(s3, "/tmp/unused");
  const caps = svc.capabilities();
  assertEquals(caps.namespacedSync, true);
  assertEquals(caps.scopedSync, true);
  assertEquals(caps.lazyHydration, true);
});

Deno.test("capabilities advertises configRefresh", () => {
  const s3 = createMockS3Client();
  const svc = new S3CacheSyncService(s3, "/tmp/unused");
  const caps = svc.capabilities();
  assertEquals(caps.configRefresh, true);
});

// --- pushChanged absence-on-disk deletion (swamp-club#797) ---

Deno.test("pushChanged scoped walk deletes S3 objects for locally-absent files", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // Seed a file locally and push it to establish the index entry.
    await seedFile(cachePath, "data/model/id/v1/raw", "content");
    const indexBody = encodeIndex({
      "data/model/id/v1/raw": {
        key: "data/model/id/v1/raw",
        size: 7,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set(".datastore-index.json", indexBody);
    s3.storage.set(
      "data/model/id/v1/raw",
      new TextEncoder().encode("content"),
    );

    const svc = new S3CacheSyncService(s3, cachePath);

    // Mark the directory dirty, then delete the local file.
    await svc.markDirty({ relPath: "data/model/id/v1" });
    await Deno.remove(join(cachePath, "data/model/id/v1/raw"));
    await Deno.remove(join(cachePath, "data/model/id/v1"));

    const synced = await svc.pushChanged();

    assertEquals(s3.deletes.includes("data/model/id/v1/raw"), true);
    assert(!s3.storage.has("data/model/id/v1/raw"));
    assert((synced as number) >= 1);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged scoped walk deletes when file removed but directory remains", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    await seedFile(cachePath, "data/model/id/v1/raw", "content");
    const indexBody = encodeIndex({
      "data/model/id/v1/raw": {
        key: "data/model/id/v1/raw",
        size: 7,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set(".datastore-index.json", indexBody);
    s3.storage.set(
      "data/model/id/v1/raw",
      new TextEncoder().encode("content"),
    );

    const svc = new S3CacheSyncService(s3, cachePath);

    // Mark directory dirty, then delete only the file (leave dir).
    await svc.markDirty({ relPath: "data/model/id/v1" });
    await Deno.remove(join(cachePath, "data/model/id/v1/raw"));

    const synced = await svc.pushChanged();

    assertEquals(s3.deletes.includes("data/model/id/v1/raw"), true);
    assert(!s3.storage.has("data/model/id/v1/raw"));
    assert((synced as number) >= 1);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged bulk walk deletes S3 objects when dirty paths overflowed", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const indexBody = encodeIndex({
      "data/model/id/v1/raw": {
        key: "data/model/id/v1/raw",
        size: 7,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set(".datastore-index.json", indexBody);
    s3.storage.set(
      "data/model/id/v1/raw",
      new TextEncoder().encode("content"),
    );

    const svc = new S3CacheSyncService(s3, cachePath);

    // Simulate per-path dirty tracking overflow: emit enough markDirty
    // calls with relPath to exceed the 2000-path cap.
    for (let i = 0; i < 2001; i++) {
      await svc.markDirty({ relPath: `data/t/m/d/gc-path-${i}/raw` });
    }

    const synced = await svc.pushChanged();

    assertEquals(s3.deletes.includes("data/model/id/v1/raw"), true);
    assert(!s3.storage.has("data/model/id/v1/raw"));
    assert((synced as number) >= 1);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged bulk walk does NOT delete when markDirty has no relPath", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const indexBody = encodeIndex({
      "data/model/id/v1/raw": {
        key: "data/model/id/v1/raw",
        size: 7,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set(".datastore-index.json", indexBody);
    s3.storage.set(
      "data/model/id/v1/raw",
      new TextEncoder().encode("content"),
    );

    const svc = new S3CacheSyncService(s3, cachePath);

    // No-relPath markDirty — a modification signal, NOT a deletion signal.
    // Remote-only entries must be preserved (swamp-club#30 regression guard).
    await svc.markDirty();

    await svc.pushChanged();

    assertEquals(s3.deletes.length, 0);
    assert(s3.storage.has("data/model/id/v1/raw"));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged does NOT delete absent files when lazyPullActive is true", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    const indexBody = encodeIndex({
      "data/model/id/v1/raw": {
        key: "data/model/id/v1/raw",
        size: 7,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set(".datastore-index.json", indexBody);
    s3.storage.set(
      "data/model/id/v1/raw",
      new TextEncoder().encode("content"),
    );

    const svc = new S3CacheSyncService(s3, cachePath);

    // Activate lazy pull by doing a metadataOnly pull first.
    await svc.pullChanged({ metadataOnly: true });

    // Bulk invalidation — would normally trigger deletion of absent files.
    await svc.markDirty();

    const synced = await svc.pushChanged();

    assertEquals(s3.deletes.length, 0);
    assert(s3.storage.has("data/model/id/v1/raw"));
    assertEquals(synced, 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- pullChanged: dangling index entries (S3 object missing) are pruned -----

Deno.test("pullChanged: prunes dangling index entries whose S3 object is missing", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-dangling-" });
  try {
    const mock = createMockS3Client();

    const goodContent = new TextEncoder().encode("good-data");
    const danglingContent = new TextEncoder().encode("gone");

    const indexBody = encodeIndex({
      "data/good/v1/raw": {
        key: "data/good/v1/raw",
        size: goodContent.length,
        lastModified: new Date().toISOString(),
      },
      "data/dangling/v1/raw": {
        key: "data/dangling/v1/raw",
        size: danglingContent.length,
        lastModified: new Date().toISOString(),
      },
    });
    mock.storage.set(".datastore-index.json", indexBody);
    mock.storage.set("data/good/v1/raw", goodContent);
    // data/dangling/v1/raw deliberately NOT in storage — simulates
    // a gc that deleted the S3 object but left the index entry.

    const service = new S3CacheSyncService(mock, cachePath);
    const pulled = await service.pullChanged();

    // Only the good file should have been pulled.
    assertEquals(pulled, 1);

    // The dangling entry should be removed from the in-memory index.
    const state = privateState(service);
    assertExists(state.index);
    assertEquals("data/good/v1/raw" in state.index.entries, true);
    assertEquals("data/dangling/v1/raw" in state.index.entries, false);

    // The cleaned index should have been written back to S3.
    const indexPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assert(indexPuts.length > 0, "cleaned index should be pushed to S3");
    const writtenIndex = decodeIndex(indexPuts[indexPuts.length - 1].body);
    assertEquals("data/good/v1/raw" in writtenIndex.entries, true);
    assertEquals("data/dangling/v1/raw" in writtenIndex.entries, false);

    // The good file should exist locally.
    const localStat = await Deno.stat(join(cachePath, "data/good/v1/raw"));
    assertEquals(localStat.size, goodContent.length);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: still throws on non-NotFound errors", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-test-non404-",
  });
  try {
    const mock = createMockS3Client();

    const indexBody = encodeIndex({
      "data/file/v1/raw": {
        key: "data/file/v1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    mock.storage.set(".datastore-index.json", indexBody);
    mock.storage.set("data/file/v1/raw", new TextEncoder().encode("hello"));
    // Override getObject to return an auth error instead of NotFound.
    const origGet = mock.getObject.bind(mock);
    (mock as unknown as Record<string, unknown>).getObject = (
      key: string,
    ) => {
      if (key === "data/file/v1/raw") {
        const err = new S3OperationError("Access Denied", {
          name: "AccessDenied",
          cause: undefined,
          httpStatusCode: 403,
          code: "AccessDenied",
          requestId: undefined,
          bodyPreview: undefined,
        });
        return Promise.reject(err);
      }
      return origGet(key);
    };

    const service = new S3CacheSyncService(mock, cachePath);
    await assertRejects(
      () => service.pullChanged(),
      Error,
      "Failed to pull",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- Two-Phase Sync Tests ---------------------------------------------------

Deno.test("capabilities: returns twoPhaseSync true", () => {
  const mock = createMockS3Client();
  const service = new S3CacheSyncService(mock, "/tmp/unused");
  const caps = service.capabilities();
  assertEquals(caps.twoPhaseSync, true);
});

Deno.test("preparePush: uploads files but does not write the index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2p-a-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/model-a/file1.yaml", "content-a\n");
    await seedFile(cachePath, "data/model-b/file2.yaml", "content-b\n");

    const manifest = await service.preparePush();

    const uploadedKeys = mock.puts.map((p) => p.key);
    assertEquals(
      uploadedKeys.includes("data/model-a/file1.yaml"),
      true,
      "file1 should be uploaded",
    );
    assertEquals(
      uploadedKeys.includes("data/model-b/file2.yaml"),
      true,
      "file2 should be uploaded",
    );

    const indexPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assertEquals(
      indexPuts.length,
      0,
      "preparePush must NOT write the remote index",
    );

    assertExists(manifest, "manifest must be returned");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("commitPush: reads fresh index and merges manifest entries", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2p-b-" });
  try {
    const mock = createMockS3Client();

    const existingIndex = encodeIndex({
      "data/other/existing.yaml": {
        key: "data/other/existing.yaml",
        size: 10,
        lastModified: new Date().toISOString(),
      },
    });
    mock.storage.set(".datastore-index.json", existingIndex);

    const service = new S3CacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/model-a/file1.yaml", "content-a\n");
    await seedFile(cachePath, "data/other/existing.yaml", "0123456789");

    const manifest = await service.preparePush();
    const result = await service.commitPush(manifest);

    assert(
      typeof result === "number" && result > 0,
      "commitPush should return count of changed entries",
    );

    const indexPut = mock.puts.find((p) => p.key === ".datastore-index.json");
    assertExists(indexPut, "commitPush must write the remote index");

    const writtenIndex = decodeIndex(indexPut.body);
    assertExists(
      writtenIndex.entries["data/model-a/file1.yaml"],
      "new entry must be in written index",
    );
    assertExists(
      writtenIndex.entries["data/other/existing.yaml"],
      "existing entry must be preserved (merge, not replace)",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("preparePush + commitPush round-trip matches pushChanged behavior", async () => {
  const cacheA = await Deno.makeTempDir({ prefix: "s3sync-2p-rt-a-" });
  const cacheB = await Deno.makeTempDir({ prefix: "s3sync-2p-rt-b-" });
  try {
    const mockA = createMockS3Client();
    const mockB = createMockS3Client();

    await seedFile(cacheA, "data/m1/f1.yaml", "hello\n");
    await seedFile(cacheB, "data/m1/f1.yaml", "hello\n");

    const serviceA = new S3CacheSyncService(mockA, cacheA);
    await serviceA.pushChanged();

    const serviceB = new S3CacheSyncService(mockB, cacheB);
    const manifest = await serviceB.preparePush();
    await serviceB.commitPush(manifest);

    // Fresh buckets use v2 shard-first: verify both paths write _meta.json
    // and shard files with matching partition keys.
    const metaA = mockA.storage.get("_index/_meta.json");
    const metaB = mockB.storage.get("_index/_meta.json");
    assertExists(metaA, "pushChanged should write _meta.json");
    assertExists(metaB, "commitPush should write _meta.json");

    const parsedMetaA = JSON.parse(new TextDecoder().decode(metaA));
    const parsedMetaB = JSON.parse(new TextDecoder().decode(metaB));
    assertEquals(parsedMetaA.version, 2, "pushChanged _meta.json must be v2");
    assertEquals(parsedMetaB.version, 2, "commitPush _meta.json must be v2");
    assertEquals(
      parsedMetaA.partitions.sort(),
      parsedMetaB.partitions.sort(),
      "both paths should produce the same partition keys",
    );
  } finally {
    await Deno.remove(cacheA, { recursive: true });
    await Deno.remove(cacheB, { recursive: true });
  }
});

Deno.test("preparePush: fast path returns empty manifest when nothing dirty", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2p-fp-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/m1/f1.yaml", "hi\n");
    await service.pushChanged();

    mock.puts.length = 0;

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    const dataPuts = mock.puts.filter((p) => p.key === "data/m1/f1.yaml");
    assertEquals(
      dataPuts.length,
      0,
      "fast path should skip file uploads",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ==========================================================================
// Shard-first index tests (swamp-club#906)
// ==========================================================================

function decodeShard(
  body: Uint8Array,
): { version: number; entries: Record<string, unknown> } {
  return JSON.parse(new TextDecoder().decode(body));
}

function decodeMeta(
  body: Uint8Array,
): { version: number; partitions: string[]; commitSeq?: number } {
  return JSON.parse(new TextDecoder().decode(body));
}

// (1) partitionKeyFromPath covers all subdirectory patterns
Deno.test("partitionKeyFromPath: data/ per-model key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath(
      "data/aws/ec2/vpc/abc-123/state-main/1/raw",
    ),
    "data--aws--ec2--vpc--abc-123",
  );
});

Deno.test("partitionKeyFromPath: outputs/ per-model key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath(
      "outputs/mytype/mymodel/out1/1/raw",
    ),
    "outputs--mytype--mymodel",
  );
});

Deno.test("partitionKeyFromPath: definitions-evaluated/ per-model key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath(
      "definitions-evaluated/t/m/d/1/raw",
    ),
    "definitions-evaluated--t--m",
  );
});

Deno.test("partitionKeyFromPath: workflow-runs/ per-workflow key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath("workflow-runs/wf-1/run/data"),
    "workflow-runs--wf-1",
  );
});

Deno.test("partitionKeyFromPath: workflows-evaluated/ single-shard key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath(
      "workflows-evaluated/workflow-063a0cb1.yaml",
    ),
    "workflows-evaluated",
  );
});

Deno.test("partitionKeyFromPath: workflows-evaluated/ deeper path also works", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath("workflows-evaluated/wf-2/file"),
    "workflows-evaluated",
  );
});

Deno.test("partitionKeyFromPath: root-level file returns _root", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath(".catalog-export.json"),
    "_root",
  );
});

Deno.test("partitionKeyFromPath: empty string returns undefined", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath(""),
    undefined,
  );
});

Deno.test("partitionKeyFromPath: single-shard directories", () => {
  for (
    const dir of [
      "auto-definitions",
      "audit",
      "telemetry",
      "logs",
      "files",
      "config",
    ]
  ) {
    assertEquals(
      S3CacheSyncService.partitionKeyFromPath(`${dir}/some/file`),
      dir,
      `${dir}/ should produce single-shard key`,
    );
  }
});

Deno.test("partitionKeyFromPath: unknown directory returns subdir as single-shard key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath("unknown/dir/file"),
    "unknown",
  );
});

Deno.test("partitionKeyFromPath: legacy bundles/ prefix returns single-shard key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath("bundles/1bca5430/model.js"),
    "bundles",
  );
});

Deno.test("partitionKeyFromPath: legacy vault-bundles/ prefix returns single-shard key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath("vault-bundles/7c811b12/vault.js"),
    "vault-bundles",
  );
});

Deno.test("partitionKeyFromPath: legacy report-bundles/ prefix returns single-shard key", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath(
      "report-bundles/037f1885/report.js",
    ),
    "report-bundles",
  );
});

Deno.test("partitionKeyFromPath: short data/ path returns undefined", () => {
  assertEquals(
    S3CacheSyncService.partitionKeyFromPath("data/a/b"),
    undefined,
  );
});

// (2) commitPush reads/merges/writes only touched shards
Deno.test("shard-first commitPush: reads/writes only touched shards", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-sf-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    // Seed initial data and do an initial push to create monolith
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await seedFile(cachePath, "data/t2/m2/d2/1/raw", "bbb\n");
    await service.pushChanged();

    // Explicitly migrate to shard-first
    await service.migrateMonolithToShards();

    // Now use two-phase to push a change to only t1/m1
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa-updated\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

    mock.gets.length = 0;
    mock.puts.length = 0;

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    // _meta.json should be written with version 2
    const metaPuts = mock.puts.filter((p) => p.key === "_index/_meta.json");
    assert(metaPuts.length >= 1, "should write _meta.json");

    const meta = decodeMeta(metaPuts[metaPuts.length - 1].body);
    assertEquals(meta.version, 2, "_meta.json should be version 2");
    assert(
      typeof meta.commitSeq === "number" && meta.commitSeq > 0,
      "commitSeq should be positive",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (3) Concurrent-writer simulation (sequential with shared state)
Deno.test("shard-first commitPush: interleaved writers with disjoint models produce correct merged state", async () => {
  const cacheA = await Deno.makeTempDir({ prefix: "s3sync-cw-a-" });
  const cacheB = await Deno.makeTempDir({ prefix: "s3sync-cw-b-" });
  try {
    const shared = createMockS3Client();
    const serviceA = new S3CacheSyncService(shared, cacheA);
    const serviceB = new S3CacheSyncService(shared, cacheB);

    // Writer A pushes model m1
    await seedFile(cacheA, "data/t1/m1/d1/1/raw", "from-A\n");
    await serviceA.pushChanged();

    // Explicitly migrate to shard-first
    await serviceA.migrateMonolithToShards();

    // Writer B starts from the same base, pushes model m2
    await seedFile(cacheB, "data/t1/m1/d1/1/raw", "from-A\n");
    await seedFile(cacheB, "data/t2/m2/d2/1/raw", "from-B\n");
    await serviceB.markDirty({ relPath: "data/t2/m2/d2/1/raw" });

    const manifestB = await serviceB.preparePush();
    await serviceB.commitPush(manifestB);

    // Both shards should exist
    assert(
      shared.storage.has("_index/data--t1--m1.json"),
      "t1/m1 shard should exist",
    );
    assert(
      shared.storage.has("_index/data--t2--m2.json"),
      "t2/m2 shard should exist",
    );

    // Unscoped pull should see both entries
    const cacheC = await Deno.makeTempDir({ prefix: "s3sync-cw-c-" });
    try {
      const serviceC = new S3CacheSyncService(shared, cacheC);
      await serviceC.pullChanged();

      // Verify both files are accessible
      const stat1 = await Deno.stat(join(cacheC, "data/t1/m1/d1/1/raw"));
      const stat2 = await Deno.stat(join(cacheC, "data/t2/m2/d2/1/raw"));
      assert(stat1.size > 0, "m1 data should be pulled");
      assert(stat2.size > 0, "m2 data should be pulled");
    } finally {
      await Deno.remove(cacheC, { recursive: true });
    }
  } finally {
    await Deno.remove(cacheA, { recursive: true });
    await Deno.remove(cacheB, { recursive: true });
  }
});

// (4) Unscoped pullChanged assembles from shards when _meta.json v2
Deno.test("pullChanged: unscoped pull assembles from shards when _meta.json v2", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-assemble-" });
  try {
    const mock = createMockS3Client();

    // Pre-seed shard files directly (simulating a shard-first writer)
    const shard1 = {
      version: 1,
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    const shard2 = {
      version: 1,
      entries: {
        "data/t2/m2/d2/1/raw": {
          key: "data/t2/m2/d2/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      "_index/data--t1--m1.json",
      new TextEncoder().encode(JSON.stringify(shard1)),
    );
    mock.storage.set(
      "_index/data--t2--m2.json",
      new TextEncoder().encode(JSON.stringify(shard2)),
    );
    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(JSON.stringify({
        version: 2,
        partitions: ["data--t1--m1", "data--t2--m2"],
        commitSeq: 5,
      })),
    );

    // Seed actual data files
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));
    mock.storage.set("data/t2/m2/d2/1/raw", new TextEncoder().encode("bbb\n"));

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    // Both files should be pulled
    const stat1 = await Deno.stat(join(cachePath, "data/t1/m1/d1/1/raw"));
    const stat2 = await Deno.stat(join(cachePath, "data/t2/m2/d2/1/raw"));
    assert(stat1.size > 0, "m1 data should be pulled via shard assembly");
    assert(stat2.size > 0, "m2 data should be pulled via shard assembly");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (5) Backward compat: v1 _meta.json falls back to monolith
Deno.test("pullChanged: v1 _meta.json falls back to monolith", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-v1fb-" });
  try {
    const mock = createMockS3Client();

    // Set up v1 _meta.json (pre-shard-first)
    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(JSON.stringify({
        version: 1,
        partitions: ["data--t1--m1"],
      })),
    );

    // Set up monolithic index
    const index = {
      version: 1,
      lastPulled: "2026-01-01T00:00:00Z",
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(index)),
    );
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    const stat = await Deno.stat(join(cachePath, "data/t1/m1/d1/1/raw"));
    assert(stat.size > 0, "should pull via monolith fallback");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (6) Migration: explicit migrateMonolithToShards partitions correctly
Deno.test("migrateMonolithToShards: partitions monolith into shards", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-migrate-" });
  try {
    const mock = createMockS3Client();

    // Set up a monolith-only remote (no _meta.json)
    const index = {
      version: 1,
      lastPulled: "2026-01-01T00:00:00Z",
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
        "audit/log1.json": {
          key: "audit/log1.json",
          size: 10,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(index)),
    );
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));
    mock.storage.set(
      "audit/log1.json",
      new TextEncoder().encode("log data\n\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards();

    // After migration, _meta.json should be v2
    assert(
      mock.storage.has("_index/_meta.json"),
      "_meta.json should exist after migration",
    );
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.version, 2, "should be version 2 after migration");
    assert(
      meta.partitions.includes("data--t1--m1"),
      "should have t1/m1 partition from monolith",
    );
    assert(
      meta.partitions.includes("audit"),
      "should have audit partition from monolith",
    );

    // Shard files should exist
    assert(
      mock.storage.has("_index/data--t1--m1.json"),
      "data--t1--m1 shard should exist",
    );
    assert(mock.storage.has("_index/audit.json"), "audit shard should exist");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("migrateMonolithToShards: partitions legacy bundle entries into own shards", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-migrate-bundles-",
  });
  try {
    const mock = createMockS3Client();

    const index = {
      version: 1,
      lastPulled: "2026-01-01T00:00:00Z",
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
        "bundles/1bca5430/model.js": {
          key: "bundles/1bca5430/model.js",
          size: 1200,
          lastModified: "2026-01-01T00:00:00Z",
        },
        "vault-bundles/7c811b12/vault.js": {
          key: "vault-bundles/7c811b12/vault.js",
          size: 800,
          lastModified: "2026-01-01T00:00:00Z",
        },
        "report-bundles/037f1885/report.js": {
          key: "report-bundles/037f1885/report.js",
          size: 950,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(index)),
    );
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));
    mock.storage.set(
      "bundles/1bca5430/model.js",
      new TextEncoder().encode("console.log(1);"),
    );
    mock.storage.set(
      "vault-bundles/7c811b12/vault.js",
      new TextEncoder().encode("console.log(2);"),
    );
    mock.storage.set(
      "report-bundles/037f1885/report.js",
      new TextEncoder().encode("console.log(3);"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards();

    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.version, 2, "should be version 2 after migration");
    assert(
      meta.partitions.includes("data--t1--m1"),
      "should have data partition",
    );
    assert(
      meta.partitions.includes("bundles"),
      "should have bundles partition",
    );
    assert(
      meta.partitions.includes("vault-bundles"),
      "should have vault-bundles partition",
    );
    assert(
      meta.partitions.includes("report-bundles"),
      "should have report-bundles partition",
    );

    assert(
      mock.storage.has("_index/bundles.json"),
      "bundles shard should exist",
    );
    assert(
      mock.storage.has("_index/vault-bundles.json"),
      "vault-bundles shard should exist",
    );
    assert(
      mock.storage.has("_index/report-bundles.json"),
      "report-bundles shard should exist",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("migrateMonolithToShards: preserves shallow-path entries", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-migrate-shallow-",
  });
  try {
    const mock = createMockS3Client();

    const index = {
      version: 1,
      lastPulled: "2026-01-01T00:00:00Z",
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
        "workflows-evaluated/workflow-063a0cb1.yaml": {
          key: "workflows-evaluated/workflow-063a0cb1.yaml",
          size: 200,
          lastModified: "2026-01-01T00:00:00Z",
        },
        "workflows-evaluated/workflow-e14e03ef.yaml": {
          key: "workflows-evaluated/workflow-e14e03ef.yaml",
          size: 180,
          lastModified: "2026-01-01T00:00:00Z",
        },
        ".catalog-export.json": {
          key: ".catalog-export.json",
          size: 5800000,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(index)),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    const meta = await service.migrateMonolithToShards();

    assertEquals(meta.version, 2);
    assert(
      meta.partitions.includes("workflows-evaluated"),
      "should have workflows-evaluated partition",
    );
    assert(
      meta.partitions.includes("_root"),
      "should have _root partition for root-level files",
    );
    assert(
      meta.partitions.includes("data--t1--m1"),
      "should have data partition",
    );

    assert(
      mock.storage.has("_index/workflows-evaluated.json"),
      "workflows-evaluated shard should exist",
    );
    assert(
      mock.storage.has("_index/_root.json"),
      "_root shard should exist",
    );

    const weShard = JSON.parse(
      new TextDecoder().decode(
        mock.storage.get("_index/workflows-evaluated.json")!,
      ),
    );
    assertEquals(
      Object.keys(weShard.entries).length,
      2,
      "workflows-evaluated shard should contain both entries",
    );

    const rootShard = JSON.parse(
      new TextDecoder().decode(mock.storage.get("_index/_root.json")!),
    );
    assertEquals(
      Object.keys(rootShard.entries).length,
      1,
      "_root shard should contain .catalog-export.json",
    );
    assert(
      ".catalog-export.json" in rootShard.entries,
      "_root shard should have .catalog-export.json",
    );

    let totalEntries = 0;
    for (const key of meta.partitions) {
      const shardData = JSON.parse(
        new TextDecoder().decode(mock.storage.get(`_index/${key}.json`)!),
      );
      totalEntries += Object.keys(shardData.entries).length;
    }
    assertEquals(
      totalEntries,
      4,
      "sum of shard entries must equal original entry count",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (7) Migration idempotency
Deno.test("migrateMonolithToShards: idempotent on retry with v1 meta", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-idem-" });
  try {
    const mock = createMockS3Client();

    // Monolith-only state
    const index = {
      version: 1,
      lastPulled: "2026-01-01T00:00:00Z",
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(index)),
    );
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));

    // Simulate partial migration: shard exists but _meta.json is still v1
    const shard = {
      version: 1,
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      "_index/data--t1--m1.json",
      new TextEncoder().encode(JSON.stringify(shard)),
    );
    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(JSON.stringify({
        version: 1,
        partitions: ["data--t1--m1"],
      })),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards();

    // Should have re-migrated (v1 → v2)
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.version, 2, "should upgrade to v2 on re-migration");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (7b) Migration with namespace scopes keys under {namespace}/_index/
Deno.test("migrateMonolithToShards: namespaced repo migrates under namespace prefix", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-migrate-ns-" });
  try {
    const mock = createMockS3Client();
    const ns = "agentic-tooling";

    const index = {
      version: 1,
      lastPulled: "2026-01-01T00:00:00Z",
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
        "audit/log1.json": {
          key: "audit/log1.json",
          size: 10,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      `${ns}/.datastore-index.json`,
      new TextEncoder().encode(JSON.stringify(index)),
    );
    mock.storage.set(
      `${ns}/data/t1/m1/d1/1/raw`,
      new TextEncoder().encode("aaa\n"),
    );
    mock.storage.set(
      `${ns}/audit/log1.json`,
      new TextEncoder().encode("log data\n\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards({ namespace: ns });

    // Shards should be under {namespace}/_index/, NOT root _index/
    assert(
      mock.storage.has(`${ns}/_index/_meta.json`),
      "namespaced _meta.json should exist after migration",
    );
    assert(
      !mock.storage.has("_index/_meta.json"),
      "root _meta.json should NOT be created for a namespaced migration",
    );

    const meta = decodeMeta(mock.storage.get(`${ns}/_index/_meta.json`)!);
    assertEquals(meta.version, 2, "should be version 2 after migration");
    assert(
      meta.partitions.includes("data--t1--m1"),
      "should have t1/m1 partition",
    );
    assert(meta.partitions.includes("audit"), "should have audit partition");

    assert(
      mock.storage.has(`${ns}/_index/data--t1--m1.json`),
      "namespaced data--t1--m1 shard should exist",
    );
    assert(
      mock.storage.has(`${ns}/_index/audit.json`),
      "namespaced audit shard should exist",
    );
    assert(
      !mock.storage.has("_index/data--t1--m1.json"),
      "root data--t1--m1 shard should NOT exist",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (8) _meta.json recovery from ListObjectsV2
Deno.test("shard-first commitPush: recovers _meta.json from _index/ listing", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-recover-" });
  try {
    const mock = createMockS3Client();

    // Set up shard files but NO _meta.json and NO monolith
    const shard1 = {
      version: 1,
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      "_index/data--t1--m1.json",
      new TextEncoder().encode(JSON.stringify(shard1)),
    );
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));

    // Set up monolith so migration can proceed
    const index = {
      version: 1,
      lastPulled: "2026-01-01T00:00:00Z",
      entries: {
        "data/t1/m1/d1/1/raw": {
          key: "data/t1/m1/d1/1/raw",
          size: 4,
          lastModified: "2026-01-01T00:00:00Z",
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(index)),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards();

    // _meta.json should be rebuilt via migration
    assert(
      mock.storage.has("_index/_meta.json"),
      "_meta.json should be rebuilt",
    );
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.version, 2);
    assert(
      meta.partitions.includes("data--t1--m1"),
      "should discover data--t1--m1 partition",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (9) Zero-diff fast path uses commitSeq
Deno.test("shard-first: commitSeq fast path returns 0 when matching", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-csq-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    // Push initial data and migrate to shard-first
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    // Two-phase push uses shard-first path
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "bbb\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });
    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    // Fast path on second pull should work (commitSeq matches)
    mock.gets.length = 0;
    const result = await service.pullChanged();
    assertEquals(result, 0, "should return 0 on commitSeq fast-path hit");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (10) Mixed partition types in one commit
Deno.test("shard-first commitPush: mixed partition types (per-model + single-shard)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-mixed-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    // Push data/ and audit/ entries together, then migrate
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "data\n");
    await seedFile(cachePath, "audit/event1.json", "audit\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    // Use two-phase to update both
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "data-v2\n");
    await seedFile(cachePath, "audit/event2.json", "audit2\n");
    await service.markDirty({ relPath: "data/t1/m1" });
    await service.markDirty({ relPath: "audit" });

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    // Both shard types should exist
    assert(
      mock.storage.has("_index/data--t1--m1.json"),
      "per-model shard should exist",
    );
    assert(mock.storage.has("_index/audit.json"), "single shard should exist");

    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assert(
      meta.partitions.includes("data--t1--m1"),
      "partitions should include per-model key",
    );
    assert(
      meta.partitions.includes("audit"),
      "partitions should include single-shard key",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (11) Shard cleanup on deletion
Deno.test("shard-first commitPush: deleting all entries in a model unlists the partition and keeps an empty shard", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cleanup-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    // Push two models, then migrate
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await seedFile(cachePath, "data/t2/m2/d2/1/raw", "bbb\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    // Delete all m1 data locally, then push
    await Deno.remove(join(cachePath, "data/t1"), { recursive: true });
    await service.markDirty({ relPath: "data/t1" });

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    // The emptied shard is written empty, not deleted: S3-compatible
    // stores ignore If-Match on DELETE, so a delete could erase entries a
    // concurrent writer just added (swamp-club#2245).
    assertEquals(
      decodeShard(mock.storage.get("_index/data--t1--m1.json")!).entries,
      {},
      "empty shard should remain with no entries",
    );

    // _meta.json should not list the deleted partition
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(
      meta.partitions.includes("data--t1--m1"),
      false,
      "deleted partition should be removed from _meta.json",
    );

    // m2 shard should still exist
    assert(
      mock.storage.has("_index/data--t2--m2.json"),
      "surviving shard should still exist",
    );
    assert(
      meta.partitions.includes("data--t2--m2"),
      "surviving partition should remain in _meta.json",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (12) Empty shard edge case: create + delete in same manifest
Deno.test("shard-first commitPush: create and delete in same manifest produces correct shard state", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-creatdel-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);

    // Push initial data, then migrate
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    // Add a new file and delete an old one in the same model
    await seedFile(cachePath, "data/t1/m1/d2/1/raw", "new\n");
    await Deno.remove(join(cachePath, "data/t1/m1/d1"), { recursive: true });
    await service.markDirty({ relPath: "data/t1/m1" });

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    // Shard should exist with only the new entry
    assert(mock.storage.has("_index/data--t1--m1.json"), "shard should exist");
    const shard = decodeShard(mock.storage.get("_index/data--t1--m1.json")!);
    assert(
      !("data/t1/m1/d1/1/raw" in shard.entries),
      "deleted entry should be gone",
    );
    assert(
      "data/t1/m1/d2/1/raw" in shard.entries,
      "new entry should be present",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- namespace directory exclusion (swamp-club#1033) --------------------------

Deno.test("isInsideNamespaceDir: matches first segment against set", () => {
  const dirs = new Set(["my-ns", "foreign-ns"]);
  assert(isInsideNamespaceDir("my-ns/data/file.txt", dirs));
  assert(isInsideNamespaceDir("foreign-ns/other", dirs));
  assert(!isInsideNamespaceDir("data/file.txt", dirs));
  assert(!isInsideNamespaceDir("outputs/model/1/raw", dirs));
  assert(!isInsideNamespaceDir("topfile.txt", dirs));
});

Deno.test("isInsideNamespaceDir: empty set always returns false", () => {
  const dirs = new Set<string>();
  assert(!isInsideNamespaceDir("my-ns/data/file.txt", dirs));
  assert(!isInsideNamespaceDir("data/file.txt", dirs));
});

Deno.test("pushChanged: full walk pushes bound namespace files with stripped rel (swamp-club#1280)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // Bound namespace directory — files here should be pushed
    // with the namespace prefix stripped from rel (swamp-club#1280)
    await seedFile(cachePath, "my-ns/data/model/1/raw", "hello");
    await seedFile(cachePath, "my-ns/outputs/model/1/raw", "output");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    assertEquals(pushed, 2);
    assert(
      pushedKeys.includes("my-ns/data/model/1/raw"),
      "should push data with correct namespace key",
    );
    assert(
      pushedKeys.includes("my-ns/outputs/model/1/raw"),
      "should push outputs with correct namespace key",
    );
    assert(
      !pushedKeys.some((k) => k === "my-ns/my-ns/data/model/1/raw"),
      "must NOT double-prefix bound namespace files",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: bound namespace dir only — post-migration scenario (swamp-club#1280)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // After namespace migrate: data ONLY inside bound namespace dir
    await seedFile(cachePath, "my-ns/data/model/1/raw", "migrated");
    await seedFile(cachePath, "my-ns/outputs/model/1/raw", "migrated-out");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    assertEquals(pushed, 2);
    assert(
      pushedKeys.includes("my-ns/data/model/1/raw"),
      "should push data from bound namespace dir",
    );
    assert(
      pushedKeys.includes("my-ns/outputs/model/1/raw"),
      "should push outputs from bound namespace dir",
    );
    assert(
      !pushedKeys.some((k) => k.startsWith("my-ns/my-ns/")),
      "must NOT double-prefix",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: scoped walk strips namespace prefix from bound namespace files (swamp-club#1280)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // File inside the bound namespace directory
    await seedFile(cachePath, "my-ns/data/model/1/raw", "scoped-data");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    // Populate dirtyPaths to trigger the scoped walk
    await svc.markDirty({
      namespace: "my-ns",
      relPath: "my-ns/data/model/1/raw",
    });
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    assertEquals(pushed, 1);
    assert(
      pushedKeys.includes("my-ns/data/model/1/raw"),
      "should push with correct namespace key (not double-prefixed)",
    );
    assert(
      !pushedKeys.some((k) => k === "my-ns/my-ns/data/model/1/raw"),
      "must NOT double-prefix in scoped walk",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: full walk skips files inside foreign namespace directory (swamp-club#1033)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // Namespaced data files
    await seedFile(cachePath, "my-ns/data/model/1/raw", "hello");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    // Foreign namespace directory (different name than bound namespace)
    await seedFile(cachePath, "foreign-ns/data/other/1/raw", "foreign");
    await seedFile(
      cachePath,
      "foreign-ns/.namespace.json",
      JSON.stringify({
        namespace: "foreign-ns",
        repoId: "other-repo",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    assertEquals(pushed, 1);
    assert(
      pushedKeys.includes("my-ns/data/model/1/raw"),
      "should push namespaced data",
    );
    assert(
      !pushedKeys.includes("my-ns/foreign-ns/data/other/1/raw"),
      "must NOT push foreign namespace file",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("preparePush: pushes bound namespace files, skips foreign (swamp-club#1280)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // Bound namespace directory — should be pushed with stripped rel
    await seedFile(cachePath, "my-ns/data/model/1/raw", "hello");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );
    // Foreign namespace directory — should still be skipped
    await seedFile(cachePath, "foreign-ns/data/other/1/raw", "foreign");
    await seedFile(
      cachePath,
      "foreign-ns/.namespace.json",
      JSON.stringify({
        namespace: "foreign-ns",
        repoId: "other",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const manifest = await svc.preparePush({ namespace: "my-ns" });

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    assert(
      pushedKeys.includes("my-ns/data/model/1/raw"),
      "should push data with correct key",
    );
    assert(
      !pushedKeys.some((k) => k.startsWith("my-ns/my-ns/")),
      "must NOT double-prefix bound namespace files",
    );
    assert(
      !pushedKeys.includes("my-ns/foreign-ns/data/other/1/raw"),
      "must NOT push foreign namespace",
    );

    const internal = manifest as unknown as { pushed: number };
    assertEquals(internal.pushed, 1);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: full walk skips stale solo-layout files when namespace bound (swamp-club#1343)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // Stale solo-layout files (leftover from before namespace migration)
    await seedFile(cachePath, "data/@model/payload.yaml", "stale-content");
    await seedFile(cachePath, "outputs/@model/1/raw", "stale-output");

    // Live namespaced files
    await seedFile(cachePath, "my-ns/data/@model/payload.yaml", "live-content");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    assertEquals(pushed, 1);
    assert(
      pushedKeys.includes("my-ns/data/@model/payload.yaml"),
      "should push the live namespaced file",
    );
    assert(
      !pushedKeys.some((k) => {
        const body = s3.puts.find((p) => p.key === k);
        return body &&
          new TextDecoder().decode(body.body as Uint8Array) === "stale-content";
      }),
      "must NOT push stale solo-layout content",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("preparePush: skips stale solo-layout files when namespace bound (swamp-club#1343)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // Stale solo-layout file
    await seedFile(cachePath, "data/@model/payload.yaml", "stale");
    // Live namespaced file
    await seedFile(cachePath, "my-ns/data/@model/payload.yaml", "live");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const manifest = await svc.preparePush({ namespace: "my-ns" });

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    const internal = manifest as unknown as { pushed: number };
    assertEquals(internal.pushed, 1);
    assert(
      pushedKeys.includes("my-ns/data/@model/payload.yaml"),
      "should push the live namespaced file",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: solo mode (no namespace) does not filter any directories (swamp-club#1033)", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    await seedFile(cachePath, "data/model/1/raw", "hello");
    // A directory with .namespace.json should NOT be filtered in solo mode
    await seedFile(cachePath, "some-dir/data/file.txt", "data");
    await seedFile(
      cachePath,
      "some-dir/.namespace.json",
      JSON.stringify({
        namespace: "some-dir",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    // No namespace = solo mode
    const pushed = await svc.pushChanged();

    const pushedKeys = s3.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    // Solo mode should push everything including the "some-dir" content
    assert(pushed as number >= 2);
    assert(pushedKeys.includes("data/model/1/raw"));
    assert(pushedKeys.includes("some-dir/data/file.txt"));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ==========================================================================
// swamp-club#1052: v2 shard-first write-path migration
// Tests that commitPush no-op, pushChanged slow path, and preparePush
// slow path all use shard assembly on v2 repos and never fetch the
// monolithic index.
// ==========================================================================

// Helper to seed a fully v2-migrated repo state into a mock S3 client.
function seedV2Repo(
  mock: ReturnType<typeof createMockS3Client>,
  entries: Record<
    string,
    { key: string; size: number; lastModified: string }
  >,
  commitSeq: number,
): void {
  const partitions = new Map<string, Record<string, unknown>>();
  for (const [rel, entry] of Object.entries(entries)) {
    const key = S3CacheSyncService.partitionKeyFromPath(rel);
    if (!key) continue;
    let bucket = partitions.get(key);
    if (!bucket) {
      bucket = {};
      partitions.set(key, bucket);
    }
    bucket[rel] = entry;
  }
  for (const [key, shardEntries] of partitions) {
    mock.storage.set(
      `_index/${key}.json`,
      new TextEncoder().encode(
        JSON.stringify({ version: 1, entries: shardEntries }),
      ),
    );
  }
  mock.storage.set(
    "_index/_meta.json",
    new TextEncoder().encode(JSON.stringify({
      version: 2,
      partitions: [...partitions.keys()].sort(),
      commitSeq,
    })),
  );
}

Deno.test("#1052: commitPush no-op on v2 uses _meta.json, not monolith", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1052-commit-" });
  try {
    const mock = createMockS3Client();
    const ts = new Date().toISOString();
    const entries = {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 4,
        lastModified: ts,
      },
    };
    seedV2Repo(mock, entries, 3);
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");

    // Initial pull to populate the cache and sidecar
    await service.pullChanged();

    // Two-phase push with nothing dirty — should be no-op
    mock.gets.length = 0;
    mock.puts.length = 0;
    const manifest = await service.preparePush();
    const result = await service.commitPush(manifest);

    assertEquals(result, 0, "commitPush must return 0 for no-op");
    assertEquals(
      mock.gets.includes(".datastore-index.json"),
      false,
      "commitPush no-op on v2 must NOT fetch the monolithic index",
    );
    assert(
      mock.gets.includes("_index/_meta.json"),
      "commitPush no-op on v2 must read _meta.json",
    );

    // Verify sidecar has commitSeq
    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecar = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(sidecar.version, 2, "sidecar must be v2");
    assertEquals(
      sidecar.commitSeq,
      3,
      "sidecar must have commitSeq from _meta.json",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("#1052: pushChanged slow path on v2 uses shard assembly, not monolith", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1052-push-" });
  try {
    const mock = createMockS3Client();
    // Pre-seed a v1 monolithic index so the first push uses the v1 path
    // (fresh empty buckets now initialize v2 directly).
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({}),
    );
    const service = new S3CacheSyncService(mock, cachePath);

    // Bootstrap: push initial data, then migrate to v2
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "old\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    // Mutate local file to force a real push on the slow path
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "new\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

    // Delete sidecar to force the slow path (no fast-path hit)
    try {
      await Deno.remove(join(cachePath, ".datastore-sync-state.json"));
    } catch { /* may not exist */ }

    mock.gets.length = 0;
    mock.puts.length = 0;
    const pushed = await service.pushChanged();

    assert((pushed as number) > 0, "should push the changed file");
    assertEquals(
      mock.gets.includes(".datastore-index.json"),
      false,
      "pushChanged slow path on v2 must NOT fetch the monolithic index",
    );
    assert(
      mock.gets.includes("_index/_meta.json"),
      "pushChanged slow path on v2 must read _meta.json (via shard assembly)",
    );

    // Verify monolith was NOT written back
    const monolithPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assertEquals(
      monolithPuts.length,
      0,
      "pushChanged on v2 must NOT write the monolithic index",
    );

    // Verify commitSeq was bumped
    const metaBody = mock.storage.get("_index/_meta.json");
    assertExists(metaBody, "_meta.json must exist after pushChanged");
    const meta = decodeMeta(metaBody);
    assertEquals(meta.version, 2, "_meta.json must remain v2");
    assert(
      typeof meta.commitSeq === "number" && meta.commitSeq > 1,
      "commitSeq must be bumped after pushChanged writeback",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("#1052: preparePush slow path on v2 uses shard assembly, not monolith", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1052-prep-" });
  try {
    const mock = createMockS3Client();
    // Pre-seed a v1 monolithic index so the first push uses the v1 path
    // (fresh empty buckets now initialize v2 directly).
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({}),
    );
    const service = new S3CacheSyncService(mock, cachePath);

    // Bootstrap: push initial data, then migrate to v2
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "old\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    // Mutate local file to have something to prepare (different size
    // so fileNeedsPush detects the change even on filesystems with
    // second-level mtime granularity)
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "new content\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

    // Delete sidecar to force the slow path
    try {
      await Deno.remove(join(cachePath, ".datastore-sync-state.json"));
    } catch { /* may not exist */ }

    mock.gets.length = 0;
    const manifest = await service.preparePush();

    assertEquals(
      mock.gets.includes(".datastore-index.json"),
      false,
      "preparePush slow path on v2 must NOT fetch the monolithic index",
    );
    assert(
      mock.gets.includes("_index/_meta.json"),
      "preparePush slow path on v2 must read _meta.json (via shard assembly)",
    );

    // Manifest should have the changed file
    const data = manifest as unknown as { pushed: number };
    assert(data.pushed > 0, "preparePush should report files to push");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("#1052: commitPush v2 no-op omits commitSeq when cache is incomplete", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-1052-partial-",
  });
  try {
    const mock = createMockS3Client();
    const ts = new Date().toISOString();
    const entries = {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 4,
        lastModified: ts,
      },
      "data/t2/m2/d2/1/raw": {
        key: "data/t2/m2/d2/1/raw",
        size: 4,
        lastModified: ts,
      },
    };
    seedV2Repo(mock, entries, 5);
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );
    mock.storage.set(
      "data/t2/m2/d2/1/raw",
      new TextEncoder().encode("bbb\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);

    // Partial pull: only seed ONE of the two files locally
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    // data/t2/m2/d2/1/raw is intentionally absent — simulates
    // a metadataOnly or scoped pull that didn't fetch everything.

    // preparePush populates the index from shards
    const manifest = await service.preparePush();
    // commitPush no-op: sidecar is marked localDirty:false (nothing
    // to push), but commitSeq must NOT be set — pull fast path uses
    // commitSeq and must not skip unfetched shards (#1225).
    await service.commitPush(manifest);

    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecar = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(
      sidecar.localDirty,
      false,
      "sidecar must be marked localDirty:false (nothing to push)",
    );
    const sidecarHasCommitSeq = typeof sidecar.commitSeq === "number" &&
      sidecar.commitSeq > 0;
    assertEquals(
      sidecarHasCommitSeq,
      false,
      "commitPush no-op must NOT write commitSeq when local cache is incomplete",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#1913: scoped assembly must not false-positive commitSeq ---

Deno.test("#1913: scoped push with incomplete cache for non-dirty shards must NOT write commitSeq", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-1913-scoped-",
  });
  try {
    const mock = createMockS3Client();
    const ts = new Date().toISOString();
    const entries = {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 4,
        lastModified: ts,
      },
      "data/t2/m2/d2/1/raw": {
        key: "data/t2/m2/d2/1/raw",
        size: 4,
        lastModified: ts,
      },
    };
    seedV2Repo(mock, entries, 5);
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );
    mock.storage.set(
      "data/t2/m2/d2/1/raw",
      new TextEncoder().encode("bbb\n"),
    );

    const service = new S3CacheSyncService(mock, cachePath);

    // Partial pull: only seed ONE of the two models locally.
    // Simulates an interrupted full pull where t2/m2 was never fetched.
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");

    // Modify the locally-present file and mark it dirty — this triggers
    // the scoped assembly path (assembleDirtyShardsOnly), which only
    // reads the t1/m1 shard. The partial index won't contain t2/m2
    // entries, so localHasAllRemoteEntries would false-positive.
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "changed\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecar = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(
      sidecar.localDirty,
      false,
      "sidecar must be marked localDirty:false (push succeeded)",
    );
    const hasCommitSeq = typeof sidecar.commitSeq === "number" &&
      sidecar.commitSeq > 0;
    assertEquals(
      hasCommitSeq,
      false,
      "commitSeq must NOT be written when scoped assembly hides non-dirty shards",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("#1913: pushChanged v2 writeback preserves non-dirty partitions in _meta.json", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-1913-meta-trunc-",
  });
  try {
    const mock = createMockS3Client();
    const ts = new Date().toISOString();
    const entries = {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 4,
        lastModified: ts,
      },
      "data/t2/m2/d2/1/raw": {
        key: "data/t2/m2/d2/1/raw",
        size: 4,
        lastModified: ts,
      },
    };
    seedV2Repo(mock, entries, 5);
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );
    mock.storage.set(
      "data/t2/m2/d2/1/raw",
      new TextEncoder().encode("bbb\n"),
    );

    // Seed both files locally so the push walk finds them
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await seedFile(cachePath, "data/t2/m2/d2/1/raw", "bbb\n");

    const service = new S3CacheSyncService(mock, cachePath);

    // Modify only one model and mark it dirty — triggers scoped assembly
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "changed\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

    await service.pushChanged();

    // _meta.json must still list BOTH partitions
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assert(
      meta.partitions.includes("data--t1--m1"),
      "dirty partition must be in _meta.json",
    );
    assert(
      meta.partitions.includes("data--t2--m2"),
      "non-dirty partition must be preserved in _meta.json",
    );
    // Non-dirty shard must still exist in storage
    assert(
      mock.storage.has("_index/data--t2--m2.json"),
      "non-dirty shard must not be deleted",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#1250: namespaced push must prefix data keys -------

Deno.test("swamp-club#1250: pushChanged with namespace must PUT data to {namespace}/rel keys", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    await seedFile(cachePath, "my-ns/data/model/1/raw", "hello");
    await seedFile(cachePath, "my-ns/data/model/1/metadata.yaml", "meta: true");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    await svc.pushChanged({ namespace: "my-ns" });

    // Data must be stored under the namespace prefix on the remote
    const dataPuts = s3.puts.filter((p) =>
      !p.key.includes(".datastore-index.json") &&
      !p.key.includes("_index/")
    );
    for (const put of dataPuts) {
      assert(
        put.key.startsWith("my-ns/"),
        `Data PUT key "${put.key}" must start with "my-ns/" but doesn't (swamp-club#1250)`,
      );
    }

    // Verify data is accessible at the namespaced key
    assert(
      s3.storage.has("my-ns/data/model/1/raw"),
      "data/model/1/raw must be stored at my-ns/data/model/1/raw on remote",
    );
    assert(
      s3.storage.has("my-ns/data/model/1/metadata.yaml"),
      "data/model/1/metadata.yaml must be stored at my-ns/data/model/1/metadata.yaml on remote",
    );

    // Data must NOT be at the root (un-namespaced) key
    assert(
      !s3.storage.has("data/model/1/raw"),
      "data must not be stored at root-level key without namespace prefix",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#1250: preparePush+commitPush with namespace must PUT data to {namespace}/rel keys", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    await seedFile(cachePath, "my-ns/data/model/1/raw", "hello");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new S3CacheSyncService(s3, cachePath);
    const manifest = await svc.preparePush!({ namespace: "my-ns" });
    await svc.commitPush!(manifest, { namespace: "my-ns" });

    // Data must be under namespace prefix
    assert(
      s3.storage.has("my-ns/data/model/1/raw"),
      "preparePush must store data at my-ns/data/model/1/raw, not data/model/1/raw (swamp-club#1250)",
    );
    assert(
      !s3.storage.has("data/model/1/raw"),
      "data must not be stored at root-level key without namespace prefix",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#1250: round-trip push then pull with namespace produces correct local files", async () => {
  const s3 = createMockS3Client();
  const pushCachePath = await Deno.makeTempDir();
  const pullCachePath = await Deno.makeTempDir();
  try {
    // Push from one cache
    await seedFile(pushCachePath, "my-ns/data/model/1/raw", "content-A");
    await seedFile(
      pushCachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );
    const pushSvc = new S3CacheSyncService(s3, pushCachePath);
    await pushSvc.pushChanged({ namespace: "my-ns" });

    // Pull into a fresh cache
    const pullSvc = new S3CacheSyncService(s3, pullCachePath);
    const pulled = await pullSvc.pullChanged({ namespace: "my-ns" });
    assertEquals(pulled, 1, "must pull the 1 file that was pushed");

    const localContent = await Deno.readTextFile(
      join(pullCachePath, "my-ns/data/model/1/raw"),
    );
    assertEquals(
      localContent,
      "content-A",
      "pulled content must match pushed content",
    );
  } finally {
    await Deno.remove(pushCachePath, { recursive: true });
    await Deno.remove(pullCachePath, { recursive: true });
  }
});

Deno.test("swamp-club#1250: pullFile falls back to root key for data pushed by broken extension", async () => {
  const s3 = createMockS3Client();
  const cachePath = await Deno.makeTempDir();
  try {
    // Simulate data pushed by the broken extension (at root, not under namespace)
    s3.storage.set("data/model/1/raw", new TextEncoder().encode("legacy-data"));
    const nsIndex = encodeIndex({
      "data/model/1/raw": {
        key: "data/model/1/raw",
        size: 11,
        lastModified: new Date().toISOString(),
      },
    });
    s3.storage.set("my-ns/.datastore-index.json", nsIndex);

    const svc = new S3CacheSyncService(s3, cachePath);
    const pulled = await svc.pullChanged({ namespace: "my-ns" });
    assertEquals(pulled, 1);

    const content = await Deno.readTextFile(
      join(cachePath, "my-ns/data/model/1/raw"),
    );
    assertEquals(
      content,
      "legacy-data",
      "must fall back to root key for pre-fix data",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#1277/#1329: readShard retry and error propagation ----------

Deno.test("swamp-club#1277: readShard retries on transient error and succeeds", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-1277a-" });
  try {
    const shardKey = "data--model--res1";
    let getAttempts = 0;

    const mock = createMockS3Client();
    const origGet = mock.getObject.bind(mock);
    (mock as unknown as Record<string, unknown>).getObject = (
      key: string,
      signal?: AbortSignal,
    ) => {
      if (key === `_index/${shardKey}.json`) {
        getAttempts++;
        if (getAttempts === 1) {
          return Promise.reject(
            opError(503),
          );
        }
      }
      return origGet(key, signal);
    };

    const entry = {
      "data/model/res1/payload.yaml": {
        key: "data/model/res1/payload.yaml",
        size: 10,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(
        JSON.stringify({ version: 2, partitions: [shardKey], commitSeq: 1 }),
      ),
    );
    mock.storage.set(
      `_index/${shardKey}.json`,
      new TextEncoder().encode(JSON.stringify({ version: 1, entries: entry })),
    );
    mock.storage.set(
      "data/model/res1/payload.yaml",
      new TextEncoder().encode("content"),
    );

    await seedFile(cachePath, "data/model/res1/payload.yaml", "content");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pushChanged();

    assert(getAttempts >= 2, "readShard must have retried after transient 503");
    const monolithPuts = mock.puts.filter(
      (p) => p.key === ".datastore-index.json",
    );
    assertEquals(
      monolithPuts.length,
      0,
      "must NOT fall back to v1 monolith after successful retry",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#1329: assembleIndexFromShards throws on persistent transient failure instead of falling back to v1", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-1329-" });
  try {
    const shardKey = "data--model--res1";

    const mock = createMockS3Client();
    const origGet = mock.getObject.bind(mock);
    (mock as unknown as Record<string, unknown>).getObject = (
      key: string,
      signal?: AbortSignal,
    ) => {
      if (key === `_index/${shardKey}.json`) {
        return Promise.reject(
          opError(503),
        );
      }
      return origGet(key, signal);
    };

    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(
        JSON.stringify({ version: 2, partitions: [shardKey], commitSeq: 1 }),
      ),
    );
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(
        JSON.stringify({
          version: 1,
          lastPulled: new Date().toISOString(),
          entries: {},
        }),
      ),
    );

    await seedFile(cachePath, "data/model/res1/payload.yaml", "content");

    const service = new S3CacheSyncService(mock, cachePath);
    let caught: unknown;
    try {
      await service.pushChanged();
    } catch (e) {
      caught = e;
    }
    assert(
      caught instanceof Error,
      "pushChanged must throw on persistent shard failure",
    );
    assert(
      (caught as Error).message.includes("Failed to read shard"),
      `error must describe shard failure, got: ${(caught as Error).message}`,
    );

    const monolithPuts = mock.puts.filter(
      (p) => p.key === ".datastore-index.json",
    );
    assertEquals(
      monolithPuts.length,
      0,
      "must NOT write monolith on transient failure — push must fail instead",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#1320: migrateRootDataToNamespace excludes foreign namespace data", async () => {
  // Uses "audit" as the foreign namespace name because it's in
  // DATA_SUBDIRS — this ensures the test depends on the
  // isInsideNamespaceDir guard, not the DATA_SUBDIRS filter.
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-1320-" });
  try {
    const mock = createMockS3Client();

    // Seed a namespaced index so the hasNamespacedIndex guard passes
    // and execution reaches the foreign namespace filtering logic.
    mock.storage.set(
      "my-ns/.datastore-index.json",
      encodeIndex({
        "data/@my-model/payload.yaml": {
          key: "data/@my-model/payload.yaml",
          size: 7,
          lastModified: new Date().toISOString(),
        },
      }),
    );

    // Own data at root (solo layout, pre-namespace)
    mock.storage.set(
      "data/@my-model/payload.yaml",
      new TextEncoder().encode("my data"),
    );
    // Root index listing own data (knownKeys filter source)
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@my-model/payload.yaml": {
          key: "data/@my-model/payload.yaml",
          size: 7,
          lastModified: new Date().toISOString(),
        },
      }),
    );

    // Foreign namespace whose name IS in DATA_SUBDIRS — without the
    // isInsideNamespaceDir guard, "audit/@their-model/report.yaml"
    // would pass the DATA_SUBDIRS.has("audit") check and be migrated.
    mock.storage.set(
      "audit/.namespace.json",
      new TextEncoder().encode(JSON.stringify({ namespace: "audit" })),
    );
    mock.storage.set(
      "audit/@their-model/report.yaml",
      new TextEncoder().encode("foreign audit data"),
    );

    await seedFile(cachePath, "data/@my-model/payload.yaml", "my data");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pushChanged({ namespace: "my-ns" });

    // Check mock.storage (copyObject target), not mock.puts (putObject)
    const foreignMigrated = mock.storage.has(
      "my-ns/audit/@their-model/report.yaml",
    );
    assertEquals(
      foreignMigrated,
      false,
      "foreign namespace data must NOT be migrated under my-ns/",
    );

    // Verify own data WAS migrated (via copyObject)
    const ownMigrated = mock.storage.has("my-ns/data/@my-model/payload.yaml");
    assert(ownMigrated, "own root data must be migrated under my-ns/");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- repairNamespaceContamination -------------------------------------------

Deno.test("repairNamespaceContamination: dryRun detects foreign objects without deleting", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-repair-dry-" });
  try {
    const mock = createMockS3Client();
    const enc = (s: string) => new TextEncoder().encode(s);

    // Own namespace data
    mock.storage.set("dwh-infra/data/@my-model/payload.yaml", enc("own-data"));
    mock.storage.set("dwh-infra/.datastore-index.json", encodeIndex({}));
    mock.storage.set("dwh-infra/.namespace.json", enc("{}"));

    // Foreign namespace marker at top level
    mock.storage.set("asdlc/.namespace.json", enc("{}"));

    // Foreign objects nested under our namespace
    mock.storage.set("dwh-infra/asdlc/data/@model/file.yaml", enc("foreign-1"));
    mock.storage.set("dwh-infra/asdlc/data/@model/meta.yaml", enc("foreign-2"));

    const service = new S3CacheSyncService(mock, cachePath);
    const result = await service.repairNamespaceContamination({
      namespace: "dwh-infra",
      dryRun: true,
    });

    assertEquals(result.totalForeignObjects, 2);
    assertEquals(result.deleted, 0);
    assertEquals(result.foreignNamespaces.length, 1);
    assertEquals(result.foreignNamespaces[0].namespace, "asdlc");
    assertEquals(result.foreignNamespaces[0].objectCount, 2);

    // Foreign objects still exist
    assert(mock.storage.has("dwh-infra/asdlc/data/@model/file.yaml"));
    assert(mock.storage.has("dwh-infra/asdlc/data/@model/meta.yaml"));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("repairNamespaceContamination: dryRun defaults to true", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-repair-default-",
  });
  try {
    const mock = createMockS3Client();
    const enc = (s: string) => new TextEncoder().encode(s);

    mock.storage.set("ns1/.namespace.json", enc("{}"));
    mock.storage.set("ns1/.datastore-index.json", encodeIndex({}));
    mock.storage.set("ns2/.namespace.json", enc("{}"));
    mock.storage.set("ns1/ns2/data/@m/f.yaml", enc("foreign"));

    const service = new S3CacheSyncService(mock, cachePath);
    const result = await service.repairNamespaceContamination({
      namespace: "ns1",
    });

    assertEquals(result.totalForeignObjects, 1);
    assertEquals(result.deleted, 0);
    assert(mock.storage.has("ns1/ns2/data/@m/f.yaml"));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("repairNamespaceContamination: live repair deletes foreign objects and rebuilds index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-repair-live-" });
  try {
    const mock = createMockS3Client();
    const enc = (s: string) => new TextEncoder().encode(s);

    // Own data
    mock.storage.set("dwh-infra/data/@my-model/payload.yaml", enc("own-data"));
    mock.storage.set("dwh-infra/.namespace.json", enc("{}"));

    // Foreign namespace markers
    mock.storage.set("asdlc/.namespace.json", enc("{}"));
    mock.storage.set("other-ns/.namespace.json", enc("{}"));

    // Foreign objects under our namespace
    mock.storage.set("dwh-infra/asdlc/data/@model/file.yaml", enc("foreign-1"));
    mock.storage.set("dwh-infra/asdlc/data/@model/meta.yaml", enc("foreign-2"));
    mock.storage.set(
      "dwh-infra/other-ns/outputs/report.json",
      enc("foreign-3"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    const result = await service.repairNamespaceContamination({
      namespace: "dwh-infra",
      dryRun: false,
    });

    assertEquals(result.totalForeignObjects, 3);
    assertEquals(result.deleted, 3);
    assertEquals(result.foreignNamespaces.length, 2);

    // Foreign objects deleted
    assertEquals(
      mock.storage.has("dwh-infra/asdlc/data/@model/file.yaml"),
      false,
    );
    assertEquals(
      mock.storage.has("dwh-infra/asdlc/data/@model/meta.yaml"),
      false,
    );
    assertEquals(
      mock.storage.has("dwh-infra/other-ns/outputs/report.json"),
      false,
    );

    // Own data untouched
    assert(mock.storage.has("dwh-infra/data/@my-model/payload.yaml"));

    // Foreign namespace markers untouched
    assert(mock.storage.has("asdlc/.namespace.json"));
    assert(mock.storage.has("other-ns/.namespace.json"));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("repairNamespaceContamination: clean namespace returns zero counts", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-repair-clean-" });
  try {
    const mock = createMockS3Client();
    const enc = (s: string) => new TextEncoder().encode(s);

    mock.storage.set("my-ns/data/@model/payload.yaml", enc("own-data"));
    mock.storage.set("my-ns/.namespace.json", enc("{}"));
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    mock.storage.set("other/.namespace.json", enc("{}"));

    const service = new S3CacheSyncService(mock, cachePath);
    const result = await service.repairNamespaceContamination({
      namespace: "my-ns",
      dryRun: true,
    });

    assertEquals(result.totalForeignObjects, 0);
    assertEquals(result.deleted, 0);
    assertEquals(result.foreignNamespaces.length, 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("repairNamespaceContamination: no namespace returns empty summary", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-repair-nons-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const result = await service.repairNamespaceContamination();

    assertEquals(result.totalForeignObjects, 0);
    assertEquals(result.deleted, 0);
    assertEquals(result.foreignNamespaces.length, 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ---------------------------------------------------------------------------
// controlPlaneStore
// ---------------------------------------------------------------------------

Deno.test("controlPlaneStore: put and get round-trip", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const payload = new TextEncoder().encode('{"alive":true}');
    await store.put("heartbeats/inst-1", payload);

    assertEquals(mock.storage.has("_control/heartbeats/inst-1"), true);

    const result = await store.get("heartbeats/inst-1");
    assertExists(result);
    assertEquals(new TextDecoder().decode(result), '{"alive":true}');
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: get missing key returns null", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const result = await store.get("no-such-key");
    assertEquals(result, null);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: delete removes key", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const payload = new TextEncoder().encode("data");
    await store.put("pending-runs/run-1", payload);
    assertEquals(mock.storage.has("_control/pending-runs/run-1"), true);

    await store.delete("pending-runs/run-1");
    assertEquals(mock.storage.has("_control/pending-runs/run-1"), false);

    const result = await store.get("pending-runs/run-1");
    assertEquals(result, null);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: delete is idempotent", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    await store.delete("nonexistent/key");
    await store.delete("nonexistent/key");
    assertEquals(mock.deletes.length, 2);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: list returns keys with _control/ prefix stripped", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    await store.put("heartbeats/inst-1", new TextEncoder().encode("a"));
    await store.put("heartbeats/inst-2", new TextEncoder().encode("b"));
    await store.put("pending-runs/run-1", new TextEncoder().encode("c"));

    const heartbeats = await store.list("heartbeats/");
    assertEquals(heartbeats.sort(), ["heartbeats/inst-1", "heartbeats/inst-2"]);

    const pending = await store.list("pending-runs/");
    assertEquals(pending, ["pending-runs/run-1"]);

    const all = await store.list("");
    assertEquals(all.sort(), [
      "heartbeats/inst-1",
      "heartbeats/inst-2",
      "pending-runs/run-1",
    ]);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: list returns empty array when no keys match", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const result = await store.list("nonexistent/");
    assertEquals(result, []);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: namespace scoping puts keys under {namespace}/_control/", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-ns-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged({ namespace: "my-ns" });

    const store = service.controlPlaneStore();

    const payload = new TextEncoder().encode("heartbeat");
    await store.put("heartbeats/inst-1", payload);

    assertEquals(mock.storage.has("my-ns/_control/heartbeats/inst-1"), true);
    assertEquals(mock.storage.has("_control/heartbeats/inst-1"), false);

    const result = await store.get("heartbeats/inst-1");
    assertExists(result);
    assertEquals(new TextDecoder().decode(result), "heartbeat");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: namespace scoping on list strips {namespace}/_control/", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-ns-list-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged({ namespace: "my-ns" });

    const store = service.controlPlaneStore();
    await store.put("heartbeats/a", new TextEncoder().encode("1"));
    await store.put("heartbeats/b", new TextEncoder().encode("2"));

    const keys = await store.list("heartbeats/");
    assertEquals(keys.sort(), ["heartbeats/a", "heartbeats/b"]);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: namespace scoping on delete", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-ns-del-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged({ namespace: "my-ns" });

    const store = service.controlPlaneStore();
    await store.put("runs/r1", new TextEncoder().encode("x"));
    await store.delete("runs/r1");

    assertEquals(mock.storage.has("my-ns/_control/runs/r1"), false);
    assertEquals(await store.get("runs/r1"), null);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: putIfAbsent on new key returns true", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-pia-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const payload = new TextEncoder().encode("claim-data");
    const result = await store.putIfAbsent("claims/job-1", payload);
    assertEquals(result, true);

    const stored = await store.get("claims/job-1");
    assertExists(stored);
    assertEquals(new TextDecoder().decode(stored), "claim-data");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: putIfAbsent on existing key returns false and does not overwrite", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-pia-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const original = new TextEncoder().encode("original");
    await store.put("claims/job-1", original);

    const replacement = new TextEncoder().encode("replacement");
    const result = await store.putIfAbsent("claims/job-1", replacement);
    assertEquals(result, false);

    const stored = await store.get("claims/job-1");
    assertExists(stored);
    assertEquals(new TextDecoder().decode(stored), "original");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: putIfAbsent after delete returns true", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-pia-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const payload = new TextEncoder().encode("first");
    await store.put("claims/job-1", payload);
    await store.delete("claims/job-1");

    const reclaimed = new TextEncoder().encode("reclaimed");
    const result = await store.putIfAbsent("claims/job-1", reclaimed);
    assertEquals(result, true);

    const stored = await store.get("claims/job-1");
    assertExists(stored);
    assertEquals(new TextDecoder().decode(stored), "reclaimed");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: putIfAbsent namespace scoping", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-pia-ns-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged({ namespace: "my-ns" });

    const store = service.controlPlaneStore();

    const payload = new TextEncoder().encode("namespaced");
    const result = await store.putIfAbsent("claims/job-1", payload);
    assertEquals(result, true);

    assertEquals(mock.storage.has("my-ns/_control/claims/job-1"), true);
    assertEquals(mock.storage.has("_control/claims/job-1"), false);

    const second = await store.putIfAbsent(
      "claims/job-1",
      new TextEncoder().encode("x"),
    );
    assertEquals(second, false);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("capabilities includes controlPlane: true", () => {
  const mock = createMockS3Client();
  const service = new S3CacheSyncService(mock, "/tmp/unused");
  const caps = service.capabilities();
  assertEquals(caps.controlPlane, true);
});

Deno.test("isInternalCacheFile excludes _control/ paths", () => {
  assert(isInternalCacheFile("_control"));
  assert(isInternalCacheFile("_control/heartbeats/inst-1"));
  assert(isInternalCacheFile("_control/pending-runs/run-1"));
  assert(!isInternalCacheFile("data/control-panel/file.yaml"));
});

// -- swamp-club#1889: controlPlaneStore binding, stale prefix, and control-plane migration --

Deno.test("controlPlaneStore: binding protocol — solo mode binds undefined", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-bind-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const payload = new TextEncoder().encode("solo");
    await store.put("heartbeats/inst-1", payload);

    assertEquals(
      mock.storage.has("_control/heartbeats/inst-1"),
      true,
      "solo mode must write to root _control/",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: respects namespace when bound via pullChanged", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-ns-put-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged({ namespace: "my-ns" });

    const store = service.controlPlaneStore();
    await store.put("key", new TextEncoder().encode("x"));

    assertEquals(
      mock.storage.has("my-ns/_control/key"),
      true,
      "put must use the bound namespace prefix",
    );
    assertEquals(
      mock.storage.has("_control/key"),
      false,
      "put must not write to root",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: binding protocol — solo then namespace throws mismatch", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-solo-ns-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new S3CacheSyncService(mock, cachePath);

    const store = service.controlPlaneStore();
    await store.put("heartbeats/inst-1", new TextEncoder().encode("solo"));
    assertEquals(mock.storage.has("_control/heartbeats/inst-1"), true);

    await assertRejects(
      () => service.pullChanged({ namespace: "my-ns" }),
      Error,
      "Namespace mismatch",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: list uses current namespace, not stale prefix", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-list-lazy-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    mock.storage.set(
      "my-ns/_control/heartbeats/a",
      new TextEncoder().encode("1"),
    );
    const service = new S3CacheSyncService(mock, cachePath);

    await service.pullChanged({ namespace: "my-ns" });
    const nsStore = service.controlPlaneStore();

    const keys = await nsStore.list("heartbeats/");
    assertEquals(
      keys,
      ["heartbeats/a"],
      "list() must scan namespaced prefix, not root",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: migration copies root _control/ keys to namespace", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-migrate-" });
  try {
    const mock = createMockS3Client();
    // Namespaced index exists — proves repo was previously solo-mode
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    // Root-level control plane keys left from solo-mode era
    mock.storage.set(
      "_control/token-encryption-key",
      new TextEncoder().encode("secret-key"),
    );
    mock.storage.set(
      "_control/heartbeats/inst-1",
      new TextEncoder().encode("beat"),
    );
    // Namespace marker
    mock.storage.set(
      "my-ns/.namespace.json",
      new TextEncoder().encode(JSON.stringify({
        namespace: "my-ns",
        repoId: "repo-1",
        registeredAt: new Date().toISOString(),
      })),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pushChanged({ namespace: "my-ns" });

    // Root keys should be copied to namespace and originals deleted
    assertEquals(
      mock.storage.has("my-ns/_control/token-encryption-key"),
      true,
      "migration must copy root _control/ keys to {namespace}/_control/",
    );
    assertEquals(
      mock.storage.has("my-ns/_control/heartbeats/inst-1"),
      true,
      "migration must copy nested root _control/ keys",
    );
    assertEquals(
      mock.storage.has("_control/token-encryption-key"),
      false,
      "migration must delete root-level originals after copy",
    );
    assertEquals(
      mock.storage.has("_control/heartbeats/inst-1"),
      false,
      "migration must delete nested root-level originals",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: migration skips when no namespaced index (fresh namespace)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-cp-nomigrate-" });
  try {
    const mock = createMockS3Client();
    // NO namespaced index — fresh namespace setup, root keys belong to another tenant
    mock.storage.set(
      "_control/token-encryption-key",
      new TextEncoder().encode("other-tenant-secret"),
    );
    mock.storage.set(
      "my-ns/.namespace.json",
      new TextEncoder().encode(JSON.stringify({
        namespace: "my-ns",
        repoId: "repo-1",
        registeredAt: new Date().toISOString(),
      })),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pushChanged({ namespace: "my-ns" });

    // Root keys must NOT be migrated
    assertEquals(
      mock.storage.has("_control/token-encryption-key"),
      true,
      "root _control/ keys must not be migrated when no namespaced index exists",
    );
    assertEquals(
      mock.storage.has("my-ns/_control/token-encryption-key"),
      false,
      "keys must not appear under namespace when guard prevents migration",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#1556: localHasAllRemoteEntries must use localRelPath in namespaced mode --

function seedV2RepoNamespaced(
  mock: ReturnType<typeof createMockS3Client>,
  namespace: string,
  entries: Record<
    string,
    { key: string; size: number; lastModified: string }
  >,
  commitSeq: number,
): void {
  const partitions = new Map<string, Record<string, unknown>>();
  for (const [rel, entry] of Object.entries(entries)) {
    const key = S3CacheSyncService.partitionKeyFromPath(rel);
    if (!key) continue;
    let bucket = partitions.get(key);
    if (!bucket) {
      bucket = {};
      partitions.set(key, bucket);
    }
    bucket[rel] = entry;
  }
  for (const [key, shardEntries] of partitions) {
    mock.storage.set(
      `${namespace}/_index/${key}.json`,
      new TextEncoder().encode(
        JSON.stringify({ version: 1, entries: shardEntries }),
      ),
    );
  }
  mock.storage.set(
    `${namespace}/_index/_meta.json`,
    new TextEncoder().encode(JSON.stringify({
      version: 2,
      partitions: [...partitions.keys()].sort(),
      commitSeq,
    })),
  );
}

Deno.test("swamp-club#1556: commitPush marks sidecar clean in namespaced mode when all files present", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "s3sync-1556-ns-clean-",
  });
  try {
    const mock = createMockS3Client();
    const ts = new Date().toISOString();
    const entries = {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 4,
        lastModified: ts,
      },
    };
    seedV2RepoNamespaced(mock, "my-ns", entries, 5);
    mock.storage.set(
      "my-ns/data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );

    await seedFile(cachePath, "my-ns/data/t1/m1/d1/1/raw", "aaa\n");
    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );
    // Seed a sidecar with dataKeyMigrated=true so preparePush skips the
    // migration codepath (which unconditionally writes localDirty=false)
    // and instead exercises the localHasAllRemoteEntries check.
    await seedFile(
      cachePath,
      ".datastore-sync-state.json",
      JSON.stringify({
        version: 2,
        remoteIndexETag: "",
        lastVerifiedAt: "",
        localDirty: true,
        dirtyPaths: [],
        bulkInvalidated: false,
        lazyPullActive: false,
        dirtyPathsOverflowed: false,
        dataKeyMigrated: true,
      }),
    );

    const service = new S3CacheSyncService(mock, cachePath);

    const manifest = await service.preparePush({ namespace: "my-ns" });
    await service.commitPush(manifest, { namespace: "my-ns" });

    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecar = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(
      sidecar.localDirty,
      false,
      "sidecar must be marked clean when all remote entries exist locally under the namespace",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- markDirty must preserve commitSeq (swamp-club#1877) ------------------

Deno.test("markDirty: preserves commitSeq through buildV2State rebuild", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-commitseq-" });
  try {
    const mock = createMockS3Client();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    // Plant a v2 sidecar with commitSeq already armed, simulating a
    // prior run that completed the full sync cycle.
    await writeSidecar(cachePath, {
      version: 2,
      remoteIndexETag: "",
      lastVerifiedAt: new Date().toISOString(),
      localDirty: false,
      commitSeq: 5,
    });

    const sidecarBefore = await readSidecar(cachePath);
    assertExists(sidecarBefore);
    assertEquals(sidecarBefore.commitSeq, 5, "precondition: commitSeq armed");

    const service = new S3CacheSyncService(mock, cachePath);

    // Simulate a local write that triggers markDirty.
    await service.markDirty({ relPath: "data/@org/m/id" });

    const sidecarAfter = await readSidecar(cachePath);
    assertExists(sidecarAfter);
    assertEquals(
      sidecarAfter.localDirty,
      true,
      "markDirty must set localDirty",
    );
    assertEquals(
      sidecarAfter.commitSeq,
      5,
      "markDirty must preserve commitSeq (swamp-club#1877)",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ---------------------------------------------------------------------------
// Helper: compute SHA-256 hex string matching the production code's format.
// ---------------------------------------------------------------------------
async function sha256Hex(content: string): Promise<string> {
  const data = new TextEncoder().encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------------------------------------------------------------
// #1771: pullChanged must detect same-size content changes via sha256
// ---------------------------------------------------------------------------

Deno.test("pullChanged: re-downloads same-size file when sha256 differs (swamp-club#1771)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1771-a-" });
  try {
    const mock = createMockS3Client();

    const oldContent = "AAAA";
    const newContent = "BBBB";
    const newHash = await sha256Hex(newContent);

    // Remote index says the file has content "BBBB" (new sha256).
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/m/rec/raw": {
          key: "data/m/rec/raw",
          size: 4,
          lastModified: new Date().toISOString(),
          sha256: newHash,
        },
      }),
    );
    // Remote has the new content.
    mock.storage.set("data/m/rec/raw", new TextEncoder().encode(newContent));

    // Local has old content — same size, different bytes.
    await seedFile(cachePath, "data/m/rec/raw", oldContent);

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    // The local file must now contain the new content.
    const result = await Deno.readTextFile(join(cachePath, "data/m/rec/raw"));
    assertEquals(
      result,
      newContent,
      "pullChanged must re-download when sha256 differs",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: skips download when sha256 matches (swamp-club#1771)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1771-b-" });
  try {
    const mock = createMockS3Client();

    const content = "AAAA";
    const hash = await sha256Hex(content);

    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/m/rec/raw": {
          key: "data/m/rec/raw",
          size: 4,
          lastModified: new Date().toISOString(),
          sha256: hash,
        },
      }),
    );
    mock.storage.set("data/m/rec/raw", new TextEncoder().encode(content));

    // Local has identical content.
    await seedFile(cachePath, "data/m/rec/raw", content);

    const service = new S3CacheSyncService(mock, cachePath);
    mock.gets.length = 0;
    await service.pullChanged();

    // Should NOT have fetched the data file (only the index).
    const dataGets = mock.gets.filter((k) => k === "data/m/rec/raw");
    assertEquals(
      dataGets.length,
      0,
      "pullChanged must skip download when sha256 matches",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: falls back to size-only when index has no sha256 (swamp-club#1771)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1771-c-" });
  try {
    const mock = createMockS3Client();

    // Index entry without sha256 (old-style).
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/m/rec/raw": {
          key: "data/m/rec/raw",
          size: 4,
          lastModified: new Date().toISOString(),
        },
      }),
    );
    mock.storage.set("data/m/rec/raw", new TextEncoder().encode("BBBB"));

    // Local has same-size but different content. Without sha256 in the
    // index, pullChanged should skip (preserving old behavior).
    await seedFile(cachePath, "data/m/rec/raw", "AAAA");

    const service = new S3CacheSyncService(mock, cachePath);
    mock.gets.length = 0;
    await service.pullChanged();

    const dataGets = mock.gets.filter((k) => k === "data/m/rec/raw");
    assertEquals(
      dataGets.length,
      0,
      "no sha256 in index → size-only, no download",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ---------------------------------------------------------------------------
// #1747: isRetryableError must treat 409 as retryable
// ---------------------------------------------------------------------------

Deno.test("isRetryableError: 409 ConditionalRequestConflict is retryable (swamp-club#1747)", () => {
  const err = new S3OperationError("conflict", {
    name: "ConditionalRequestConflict",
    cause: new Error("conflict"),
    httpStatusCode: 409,
    code: "ConditionalRequestConflict",
    requestId: undefined,
    bodyPreview: undefined,
  });
  assertEquals(isRetryableError(err), true, "409 must be retryable");
});

Deno.test("retryWithBackoff: retries on 409 and succeeds (swamp-club#1747)", async () => {
  let attempts = 0;
  const result = await retryWithBackoff(
    () => {
      attempts++;
      if (attempts < 3) {
        throw new S3OperationError("conflict", {
          name: "ConditionalRequestConflict",
          cause: new Error("conflict"),
          httpStatusCode: 409,
          code: "ConditionalRequestConflict",
          requestId: undefined,
          bodyPreview: undefined,
        });
      }
      return Promise.resolve("ok");
    },
    { baseDelayMs: 1, maxAttempts: 5 },
  );
  assertEquals(result, "ok");
  assertEquals(attempts, 3, "should have retried twice before succeeding");
});

// ---------------------------------------------------------------------------
// #1760: pullChanged sha256 check prevents the stale-pointer rollback
// scenario end-to-end. The root cause of #1760 is that pullChanged's
// size-only check missed same-size `latest` pointer updates, leaving the
// stale value in place for pushChanged to overwrite the remote.
// With the sha256 check (#1771), pullChanged corrects the local pointer
// before pushChanged runs, eliminating the rollback.
// ---------------------------------------------------------------------------

Deno.test("pullChanged + pushChanged: stale latest pointer is corrected, not pushed (swamp-club#1760)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-1760-" });
  try {
    const mock = createMockS3Client();

    const newHash = await sha256Hex("8");

    // Remote state: Machine A pushed version 8.
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/type/model/rec/latest": {
          key: "data/type/model/rec/latest",
          size: 1,
          lastModified: new Date().toISOString(),
          sha256: newHash,
        },
      }),
    );
    mock.storage.set(
      "data/type/model/rec/latest",
      new TextEncoder().encode("8"),
    );

    // Machine B: stale local latest = "6" (same 1-byte size as "8").
    await seedFile(cachePath, "data/type/model/rec/latest", "6");

    const service = new S3CacheSyncService(mock, cachePath);

    // Sync = pullChanged then pushChanged (same as `swamp datastore sync`).
    await service.pullChanged();

    // pullChanged must have detected the sha256 mismatch and downloaded "8".
    const localAfterPull = await Deno.readTextFile(
      join(cachePath, "data/type/model/rec/latest"),
    );
    assertEquals(
      localAfterPull,
      "8",
      "pullChanged must re-download when sha256 differs (was '6', remote is '8')",
    );

    // pushChanged should now see no difference and push nothing.
    mock.puts.length = 0;
    await service.pushChanged();

    const latestPuts = mock.puts.filter((p) =>
      p.key === "data/type/model/rec/latest"
    );
    assertEquals(
      latestPuts.length,
      0,
      "pushChanged must not re-push the pointer after pullChanged corrected it",
    );

    // Remote must still be "8".
    const remoteAfterSync = new TextDecoder().decode(
      mock.storage.get("data/type/model/rec/latest"),
    );
    assertEquals(
      remoteAfterSync,
      "8",
      "remote pointer must not be rolled back",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- REPRO: push idempotency regression from PR #251 -----------------------

Deno.test("REPRO #251: namespace push — markDirty between pushes, second push must not rewrite remote index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-repro-" });
  try {
    const mock = createMockS3Client();
    const service = new S3CacheSyncService(mock, cachePath);
    const ns = "my-ns";

    // Use a path with enough segments for proper partitioning (4+).
    const relPath = `${ns}/data/my--type/my-model/payload.yaml`;
    await seedFile(cachePath, relPath, "name: x\n");
    await service.markDirty({ namespace: ns, relPath });

    // First push — should upload the file
    await service.pushChanged({ namespace: ns });

    // Record the remote _meta.json state
    const metaKey = `${ns}/_index/_meta.json`;
    const metaAfterFirstPush = mock.storage.get(metaKey);
    const metaETag1 = metaAfterFirstPush ? fakeETag(metaAfterFirstPush) : null;

    // Reset tracking
    mock.puts.length = 0;

    // Mark dirty again (simulating core behavior — no actual content change)
    await service.markDirty({ namespace: ns, relPath });

    // Second push — should be no-op
    await service.pushChanged({ namespace: ns });

    // Check that _meta.json was NOT rewritten
    const metaAfterSecondPush = mock.storage.get(metaKey);
    const metaETag2 = metaAfterSecondPush
      ? fakeETag(metaAfterSecondPush)
      : null;

    assertEquals(
      metaETag2,
      metaETag1,
      "Second push must not rewrite _meta.json — ETags should be identical",
    );

    const metaPuts = mock.puts.filter((p: PutCall) => p.key === metaKey);
    assertEquals(
      metaPuts.length,
      0,
      "Second push must not PUT _meta.json",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("REPRO #251: namespace push — fresh instance, second push must be no-op", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-repro2-" });
  try {
    const mock = createMockS3Client();
    const ns = "my-ns";

    // First push with first instance
    {
      const service = new S3CacheSyncService(mock, cachePath);
      await seedFile(
        cachePath,
        `${ns}/data/@my-model/payload.yaml`,
        "name: x\n",
      );
      await service.markDirty({
        namespace: ns,
        relPath: `${ns}/data/@my-model/payload.yaml`,
      });
      await service.pushChanged({ namespace: ns });
    }

    const metaKey = `${ns}/_index/_meta.json`;
    const metaAfterFirstPush = mock.storage.get(metaKey);
    const metaETag1 = metaAfterFirstPush ? fakeETag(metaAfterFirstPush) : null;

    // Reset tracking
    mock.puts.length = 0;
    mock.gets.length = 0;

    // Second push with fresh instance — no markDirty, no content change
    {
      const service2 = new S3CacheSyncService(mock, cachePath);
      await service2.pushChanged({ namespace: ns });
    }

    const metaAfterSecondPush = mock.storage.get(metaKey);
    const metaETag2 = metaAfterSecondPush
      ? fakeETag(metaAfterSecondPush)
      : null;

    assertEquals(
      metaETag2,
      metaETag1,
      "Fresh-instance second push must not rewrite _meta.json",
    );

    const metaPuts = mock.puts.filter((p: PutCall) => p.key === metaKey);
    assertEquals(
      metaPuts.length,
      0,
      "Fresh-instance second push must not PUT _meta.json",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#2063: stale shard entries cleaned on pullChanged 404 --------

Deno.test("swamp-club#2063: pullChanged with shard-first path removes stale entries from shards on 404", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2063-" });
  try {
    const mock = createMockS3Client();

    // Set up a v2 shard index with one valid entry and one stale entry.
    const validEntry = {
      key: "config/settings.yaml",
      size: 10,
      lastModified: new Date().toISOString(),
    };
    const staleEntry = {
      key: "config/models/_instances/gone.yaml",
      size: 20,
      lastModified: new Date().toISOString(),
    };

    const shardEntries = {
      "config/settings.yaml": validEntry,
      "config/models/_instances/gone.yaml": staleEntry,
    };
    const shardBody = new TextEncoder().encode(
      JSON.stringify({ version: 1, entries: shardEntries }),
    );
    mock.storage.set("_index/config.json", shardBody);

    const metaBody = new TextEncoder().encode(
      JSON.stringify({ version: 2, partitions: ["config"], commitSeq: 5 }),
    );
    mock.storage.set("_index/_meta.json", metaBody);

    // Seed the valid file in the remote (so pullFile succeeds for it).
    mock.storage.set(
      "config/settings.yaml",
      new TextEncoder().encode("valid: yes"),
    );
    // Do NOT seed "config/models/_instances/gone.yaml" — it will 404.

    const service = new S3CacheSyncService(mock, cachePath);
    const pulled = await service.pullChanged();

    // Only the valid file should have been pulled.
    assertEquals(pulled, 1, "only the valid file should be pulled");

    // Verify the shard was rewritten without the stale entry.
    const updatedShard = mock.storage.get("_index/config.json");
    assertExists(updatedShard, "config shard must be rewritten");
    const parsedShard = JSON.parse(new TextDecoder().decode(updatedShard));
    assertEquals(
      parsedShard.entries["config/settings.yaml"] !== undefined,
      true,
      "valid entry must survive in shard",
    );
    assertEquals(
      parsedShard.entries["config/models/_instances/gone.yaml"],
      undefined,
      "stale entry must be removed from shard",
    );

    // Verify commitSeq was bumped.
    const updatedMeta = mock.storage.get("_index/_meta.json");
    assertExists(updatedMeta, "_meta.json must be rewritten");
    const parsedMeta = JSON.parse(new TextDecoder().decode(updatedMeta));
    assertEquals(
      parsedMeta.commitSeq,
      6,
      "commitSeq must be bumped from 5 to 6",
    );

    // Second pullChanged must NOT re-request the stale key.
    mock.gets.length = 0;
    const pulled2 = await service.pullChanged();
    assertEquals(pulled2, 0, "second pull should have nothing to do");
    const staleGets = mock.gets.filter((k: string) =>
      k.includes("_instances/gone.yaml")
    );
    assertEquals(
      staleGets.length,
      0,
      "stale key must not be re-requested on second pull",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#1931: commitSeq fast path must arm after clean v2 pull -------

Deno.test("swamp-club#1931: pullChanged on v2 shard-first writes commitSeq to sidecar, next pull is fast-pathed", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-1931-" });
  try {
    const mock = createMockS3Client();

    // Seed a v2 shard-first index on the "remote" with one file.
    const shardKey = "data--t1--m1--d1";
    const entries = {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(
        JSON.stringify({ version: 2, partitions: [shardKey], commitSeq: 5 }),
      ),
    );
    mock.storage.set(
      `_index/${shardKey}.json`,
      new TextEncoder().encode(JSON.stringify({ version: 1, entries })),
    );
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("data"),
    );

    const svc = new S3CacheSyncService(mock, cachePath);

    // First pull: slow path (no sidecar yet), downloads the file.
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1);

    // Verify sidecar has commitSeq.
    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecar = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(
      sidecar.commitSeq,
      5,
      "sidecar must have commitSeq from _meta.json",
    );

    // Second pull: must hit commitSeq fast path (0 files, no remote calls).
    mock.gets.length = 0;
    const result = await svc.pullChanged();
    assertEquals(result, 0, "second pull must hit fast path");
    const metaGets = mock.gets.filter((k: string) => k === "_index/_meta.json");
    assertEquals(
      metaGets.length,
      1,
      "fast path reads _meta.json once to compare commitSeq",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#2091: skip root migration when v2 shards assembled -----------

Deno.test("swamp-club#2091: preparePush skips root migration when v2 shard index exists", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-2091-" });
  try {
    const mock = createMockS3Client();

    // Seed v2 shard-first index under namespace.
    const shardKey = "data--t1--m1--d1";
    const entries = {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(
      "my-ns/_index/_meta.json",
      new TextEncoder().encode(
        JSON.stringify({ version: 2, partitions: [shardKey], commitSeq: 1 }),
      ),
    );
    mock.storage.set(
      `my-ns/_index/${shardKey}.json`,
      new TextEncoder().encode(JSON.stringify({ version: 1, entries })),
    );
    mock.storage.set(
      "my-ns/data/t1/m1/d1/1/raw",
      new TextEncoder().encode("data"),
    );
    // Also place a root monolithic index (the "leftover" from #2091).
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify({ version: 1, entries: {} })),
    );

    await seedFile(cachePath, "my-ns/data/t1/m1/d1/1/raw", "data");

    const svc = new S3CacheSyncService(mock, cachePath);
    await svc.markDirty({ relPath: "my-ns/data/t1/m1/d1/1/raw" });
    await svc.preparePush({ namespace: "my-ns" });

    // Root monolithic index must NOT have been read (migration skipped).
    const rootIndexGets = mock.gets.filter(
      (k: string) => k === ".datastore-index.json",
    );
    assertEquals(
      rootIndexGets.length,
      0,
      "must not read root .datastore-index.json when v2 shards exist",
    );

    // Sidecar must have dataKeyMigrated set.
    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecar = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(
      sidecar.dataKeyMigrated,
      true,
      "dataKeyMigrated must be set when v2 shards are in place",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#2033: listing failure graceful fallback -----------------------

Deno.test("swamp-club#2033: pullChanged falls back to per-file behavior when listing fails", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-2033fb-" });
  try {
    const mock = createMockS3Client();

    const indexBody = encodeIndex({
      "data/f/v1/raw": {
        key: "data/f/v1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    mock.storage.set(".datastore-index.json", indexBody);
    mock.storage.set("data/f/v1/raw", new TextEncoder().encode("hello"));

    // Override listAllObjects to simulate a permissions error.
    (mock as unknown as Record<string, unknown>).listAllObjects = () => {
      return Promise.reject(
        new S3OperationError("Access Denied", {
          name: "AccessDenied",
          cause: undefined,
          httpStatusCode: 403,
          code: "AccessDenied",
          requestId: undefined,
          bodyPreview: undefined,
        }),
      );
    };

    const svc = new S3CacheSyncService(mock, cachePath);
    // Should still succeed — falls back to per-file download.
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1, "must still pull files when listing fails");

    const content = await Deno.readTextFile(join(cachePath, "data/f/v1/raw"));
    assertEquals(content, "hello");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2033: pullChanged prunes stale entries via listing without per-file 404", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-test-2033pr-" });
  try {
    const mock = createMockS3Client();

    // Index references two files, but only one exists remotely.
    const indexBody = encodeIndex({
      "data/live/v1/raw": {
        key: "data/live/v1/raw",
        size: 4,
        lastModified: new Date().toISOString(),
      },
      "data/stale/v1/raw": {
        key: "data/stale/v1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    mock.storage.set(".datastore-index.json", indexBody);
    mock.storage.set("data/live/v1/raw", new TextEncoder().encode("live"));
    // "data/stale/v1/raw" is NOT in storage — it was GC'd.

    const svc = new S3CacheSyncService(mock, cachePath);
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1, "should only pull the live file");

    // The stale key must NOT have been requested via getObject.
    const staleGets = mock.gets.filter(
      (k: string) => k === "data/stale/v1/raw",
    );
    assertEquals(
      staleGets.length,
      0,
      "stale entry must be pruned by listing, not via getObject 404",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ==========================================================================
// swamp-club#2246: pullChanged honors DatastoreSyncOptions.subdirs
// capabilities() advertises configRefresh, so serve's pollers send
// subdirs-scoped pulls. assertDatastoreExportConformance doesn't cover the
// subdirs contract, so these are direct assertions.
// ==========================================================================

/** Seeds remote objects plus a monolithic index listing them. */
function seedRemote(
  mock: ReturnType<typeof createMockS3Client>,
  files: Record<string, string>,
  prefix = "",
): void {
  const entries: Record<
    string,
    { key: string; size: number; lastModified: string }
  > = {};
  for (const [rel, body] of Object.entries(files)) {
    entries[rel] = {
      key: rel,
      size: body.length,
      lastModified: new Date().toISOString(),
    };
    mock.storage.set(`${prefix}${rel}`, new TextEncoder().encode(body));
  }
  mock.storage.set(`${prefix}.datastore-index.json`, encodeIndex(entries));
}

async function exists(path: string): Promise<boolean> {
  return await Deno.stat(path).then(() => true).catch(() => false);
}

Deno.test("swamp-club#2246: subdirs-scoped pull only downloads in-scope files", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-scope-" });
  try {
    const mock = createMockS3Client();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/x/raw": "data",
    });

    const svc = new S3CacheSyncService(mock, cachePath);
    const pulled = await svc.pullChanged({ subdirs: ["config"] });

    assertEquals(pulled, 1);
    assertEquals(mock.gets.includes("data/@m/x/raw"), false);
    assert(await exists(join(cachePath, "config/models/a.yaml")));
    assertEquals(await exists(join(cachePath, "data/@m/x/raw")), false);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: nested subdirs match on a '/' boundary", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-nest-" });
  try {
    const mock = createMockS3Client();
    seedRemote(mock, {
      "data/swamp/grant/g1/raw": "g1",
      "data/swamp/grants/g2/raw": "g2",
    });

    const svc = new S3CacheSyncService(mock, cachePath);
    const pulled = await svc.pullChanged({ subdirs: ["data/swamp/grant/"] });

    assertEquals(pulled, 1);
    assertEquals(mock.gets.includes("data/swamp/grants/g2/raw"), false);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: scoped pull does not arm the fast path (monolithic)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-arm-" });
  try {
    const mock = createMockS3Client();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/x/raw": "data",
    });

    const svc = new S3CacheSyncService(mock, cachePath);
    await svc.pullChanged({ subdirs: ["config"] });
    assertEquals((await readSidecar(cachePath))?.remoteIndexETag ?? "", "");

    // A fresh process must take the slow path and fetch the skipped file.
    const svc2 = new S3CacheSyncService(mock, cachePath);
    assertEquals(await svc2.pullChanged(), 1);
    assert(await exists(join(cachePath, "data/@m/x/raw")));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: scoped pull does not record commitSeq (v2 shards)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-v2-" });
  try {
    const mock = createMockS3Client();
    const ts = new Date().toISOString();
    seedV2Repo(mock, {
      "data/t1/m1/d1/1/raw": {
        key: "data/t1/m1/d1/1/raw",
        size: 3,
        lastModified: ts,
      },
      "data/t2/m1/d1/1/raw": {
        key: "data/t2/m1/d1/1/raw",
        size: 3,
        lastModified: ts,
      },
    }, 5);
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("t1\n"));
    mock.storage.set("data/t2/m1/d1/1/raw", new TextEncoder().encode("t2\n"));

    const svc = new S3CacheSyncService(mock, cachePath);
    assertEquals(await svc.pullChanged({ subdirs: ["data/t1"] }), 1);
    assertEquals((await readSidecar(cachePath))?.commitSeq, undefined);

    const svc2 = new S3CacheSyncService(mock, cachePath);
    assertEquals(await svc2.pullChanged(), 1);
    assertEquals((await readSidecar(cachePath))?.commitSeq, 5);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: scoped pull does not clear lazyPullActive", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-lazy-" });
  try {
    const mock = createMockS3Client();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/x/1/raw": "data",
    });

    const svc = new S3CacheSyncService(mock, cachePath);
    await svc.pullChanged({ metadataOnly: true });
    await svc.pullChanged({ subdirs: ["config"] });

    assertEquals(
      ((await readSidecar(cachePath)) as Record<string, unknown>)
        ?.lazyPullActive,
      true,
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: scoped pull does not prune out-of-scope entries", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-prune-" });
  try {
    const mock = createMockS3Client();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/gone/raw": "gone",
    });
    mock.storage.delete("data/@m/gone/raw");

    const svc = new S3CacheSyncService(mock, cachePath);
    await svc.pullChanged({ subdirs: ["config"] });

    assertExists(privateState(svc).index?.entries["data/@m/gone/raw"]);
    assertEquals(
      mock.puts.some((p) => p.key === ".datastore-index.json"),
      false,
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: file-path subdir does not prune the file's entry", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-file-" });
  try {
    const mock = createMockS3Client();
    seedRemote(mock, { "config/models/a.yaml": "a: 1\n" });

    const svc = new S3CacheSyncService(mock, cachePath);
    await svc.pullChanged({ subdirs: ["config/models/a.yaml"] });

    assertExists(privateState(svc).index?.entries["config/models/a.yaml"]);
    assertEquals(
      mock.puts.some((p) => p.key === ".datastore-index.json"),
      false,
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: namespaced scoped pull keeps pre-namespace root keys", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2246-ns-" });
  try {
    const mock = createMockS3Client();
    // Index is namespaced, but the object only exists at the root key.
    seedRemote(mock, { "config/models/a.yaml": "a: 1\n" }, "ns/");
    mock.storage.set(
      "config/models/a.yaml",
      mock.storage.get("ns/config/models/a.yaml")!,
    );
    mock.storage.delete("ns/config/models/a.yaml");

    const svc = new S3CacheSyncService(mock, cachePath);
    const pulled = await svc.pullChanged({
      subdirs: ["config"],
      namespace: "ns",
    });

    assertEquals(pulled, 1);
    assertExists(privateState(svc).index?.entries["config/models/a.yaml"]);
    assert(await exists(join(cachePath, "ns/config/models/a.yaml")));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#2245: shard and _meta.json writes are CAS merges ------------

/**
 * Reads the sync sidecar, failing if it is missing. The 2245 tests assert on
 * fields being absent, which a missing sidecar would satisfy vacuously.
 */
async function requireSidecar(cachePath: string) {
  const sidecar = await readSidecar(cachePath);
  assertExists(sidecar, "sync sidecar must exist");
  return sidecar;
}

/**
 * Runs `hook` before each conditional write to `key` whose 1-based call
 * number satisfies `when`, so a test can interleave a concurrent writer
 * between this writer's read and its write. Returns the call counter.
 */
function interleaveBefore(
  mock: ReturnType<typeof createMockS3Client>,
  key: string,
  when: (call: number) => boolean,
  hook: () => void,
): { calls: number } {
  const counter = { calls: 0 };
  const original = mock.putObjectIfMatch.bind(mock);
  mock.putObjectIfMatch = (k, body, etag, signal) => {
    if (k === key && when(++counter.calls)) hook();
    return original(k, body, etag, signal);
  };
  return counter;
}

function indexEntry(rel: string, size = 4) {
  return { key: rel, size, lastModified: new Date().toISOString() };
}

/** Adds an entry to a stored shard, as another writer's commit would. */
function addRemoteShardEntry(
  mock: ReturnType<typeof createMockS3Client>,
  partKey: string,
  rel: string,
): void {
  const key = `_index/${partKey}.json`;
  const existing = mock.storage.get(key);
  const shard = existing
    ? decodeShard(existing)
    : { version: 1, entries: {} as Record<string, unknown> };
  shard.entries[rel] = indexEntry(rel);
  mock.storage.set(key, new TextEncoder().encode(JSON.stringify(shard)));
}

/** Lists a partition and bumps commitSeq in the stored _meta.json. */
function commitRemoteMeta(
  mock: ReturnType<typeof createMockS3Client>,
  partKey: string,
  commitSeq: number,
): void {
  const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
  const partitions = new Set(meta.partitions);
  partitions.add(partKey);
  mock.storage.set(
    "_index/_meta.json",
    new TextEncoder().encode(JSON.stringify({
      version: 2,
      partitions: [...partitions].sort(),
      commitSeq,
    })),
  );
}

function storedShardKeys(
  mock: ReturnType<typeof createMockS3Client>,
  partKey: string,
): string[] {
  return Object.keys(
    decodeShard(mock.storage.get(`_index/${partKey}.json`)!).entries,
  ).sort();
}

Deno.test("swamp-club#2245: pushChanged keeps a shard entry another writer adds before the write-back", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-a-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    mock.storage.set("config/models/a.yaml", new TextEncoder().encode("aaa\n"));
    await seedFile(cachePath, "config/models/a.yaml", "aaa\n");
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");

    const shardPuts = interleaveBefore(
      mock,
      "_index/config.json",
      (n) => n === 1,
      () => addRemoteShardEntry(mock, "config", "config/models/t1.yaml"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await service.pushChanged();

    assertEquals(storedShardKeys(mock, "config"), [
      "config/models/a.yaml",
      "config/models/b.yaml",
      "config/models/t1.yaml",
    ]);
    assert(shardPuts.calls >= 2, "the lost race must be retried");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: pushChanged with _meta.json missing the config partition keeps remote entries and does not arm commitSeq", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-b-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/t1.yaml": indexEntry("config/models/t1.yaml"),
    }, 5);
    // Stale meta: the config shard exists but is not listed.
    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(
        JSON.stringify({ version: 2, partitions: [], commitSeq: 5 }),
      ),
    );
    await seedFile(cachePath, "config/models/new.yaml", "new\n");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pushChanged();

    assertEquals(storedShardKeys(mock, "config"), [
      "config/models/new.yaml",
      "config/models/t1.yaml",
    ]);
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.partitions, ["config"]);
    assertEquals(meta.commitSeq, 6);
    // t1 was merged from the remote but is not in the local cache, so the
    // pull fast path must not be armed.
    const sidecar = await requireSidecar(cachePath);
    assertEquals(sidecar.localDirty, false);
    assertEquals(sidecar.commitSeq, undefined);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: pushChanged keeps a partition and commitSeq another writer commits to _meta.json concurrently", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-c-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    mock.storage.set("config/models/a.yaml", new TextEncoder().encode("aaa\n"));
    await seedFile(cachePath, "config/models/a.yaml", "aaa\n");
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");

    interleaveBefore(mock, "_index/_meta.json", (n) => n === 1, () => {
      addRemoteShardEntry(mock, "audit", "audit/e1.json");
      commitRemoteMeta(mock, "audit", 9);
    });

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await service.pushChanged();

    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.partitions, ["audit", "config"]);
    assertEquals(meta.commitSeq, 10);
    assertEquals((await requireSidecar(cachePath)).commitSeq, undefined);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: pushChanged delete unlists an emptied partition but keeps the empty shard object", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-d-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "data/t1/m1/d1/1/raw": indexEntry("data/t1/m1/d1/1/raw"),
      "data/t2/m2/d2/1/raw": indexEntry("data/t2/m2/d2/1/raw"),
    }, 5);
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));
    mock.storage.set("data/t2/m2/d2/1/raw", new TextEncoder().encode("bbb\n"));
    await seedFile(cachePath, "data/t2/m2/d2/1/raw", "bbb\n");
    await Deno.mkdir(join(cachePath, "data/t1/m1/d1/1"), { recursive: true });

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });
    await service.pushChanged();

    assertEquals(mock.storage.has("data/t1/m1/d1/1/raw"), false);
    assertEquals(storedShardKeys(mock, "data--t1--m1"), []);
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.partitions, ["data--t2--m2"]);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: an emptied shard stays listed when another writer adds to it before the meta commit", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-e-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "data/t1/m1/d1/1/raw": indexEntry("data/t1/m1/d1/1/raw"),
      "data/t2/m2/d2/1/raw": indexEntry("data/t2/m2/d2/1/raw"),
    }, 5);
    mock.storage.set("data/t1/m1/d1/1/raw", new TextEncoder().encode("aaa\n"));
    mock.storage.set("data/t2/m2/d2/1/raw", new TextEncoder().encode("bbb\n"));
    await seedFile(cachePath, "data/t2/m2/d2/1/raw", "bbb\n");
    await Deno.mkdir(join(cachePath, "data/t1/m1/d1/1"), { recursive: true });

    // Another writer commits a new t1/m1 entry (shard, then meta) after
    // this push emptied the shard and before its meta write lands.
    interleaveBefore(mock, "_index/_meta.json", (n) => n === 1, () => {
      addRemoteShardEntry(mock, "data--t1--m1", "data/t1/m1/d1/2/raw");
      commitRemoteMeta(mock, "data--t1--m1", 6);
    });

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });
    await service.pushChanged();

    assertEquals(storedShardKeys(mock, "data--t1--m1"), [
      "data/t1/m1/d1/2/raw",
    ]);
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.partitions, ["data--t1--m1", "data--t2--m2"]);
    assertEquals(meta.commitSeq, 7);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: pull 404 cleanup removes only the 404'd entries and keeps concurrent additions", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-f-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/settings.yaml": indexEntry("config/settings.yaml", 10),
      "config/models/_instances/gone.yaml": indexEntry(
        "config/models/_instances/gone.yaml",
      ),
    }, 5);
    mock.storage.set(
      "config/settings.yaml",
      new TextEncoder().encode("valid: yes"),
    );

    interleaveBefore(
      mock,
      "_index/config.json",
      (n) => n === 1,
      () => addRemoteShardEntry(mock, "config", "config/models/t1.yaml"),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.pullChanged();

    assertEquals(storedShardKeys(mock, "config"), [
      "config/models/t1.yaml",
      "config/settings.yaml",
    ]);
    assertEquals(
      decodeMeta(mock.storage.get("_index/_meta.json")!).commitSeq,
      6,
    );
    assertEquals((await requireSidecar(cachePath)).commitSeq, undefined);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: commitPush merges with concurrent shard and _meta.json writers", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-g-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    mock.storage.set("config/models/a.yaml", new TextEncoder().encode("aaa\n"));
    await seedFile(cachePath, "config/models/a.yaml", "aaa\n");
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "config/models/b.yaml" });
    const manifest = await service.preparePush();

    const shardPuts = interleaveBefore(
      mock,
      "_index/config.json",
      (n) => n === 1,
      () => addRemoteShardEntry(mock, "config", "config/models/t1.yaml"),
    );
    interleaveBefore(mock, "_index/_meta.json", (n) => n === 1, () => {
      addRemoteShardEntry(mock, "audit", "audit/e1.json");
      commitRemoteMeta(mock, "audit", 9);
    });
    await service.commitPush(manifest);

    assertEquals(storedShardKeys(mock, "config"), [
      "config/models/a.yaml",
      "config/models/b.yaml",
      "config/models/t1.yaml",
    ]);
    assert(shardPuts.calls >= 2, "the lost shard race must be retried");
    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.partitions, ["audit", "config"]);
    assertEquals(meta.commitSeq, 10);
    assertEquals((await requireSidecar(cachePath)).commitSeq, undefined);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: exhausting shard CAS retries fails the push and the next push commits the entry", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-h-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    mock.storage.set("config/models/a.yaml", new TextEncoder().encode("aaa\n"));
    await seedFile(cachePath, "config/models/a.yaml", "aaa\n");
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");

    let contended = true;
    let n = 0;
    interleaveBefore(
      mock,
      "_index/config.json",
      () => contended,
      () => addRemoteShardEntry(mock, "config", `config/models/x${n++}.yaml`),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await assertRejects(() => service.pushChanged(), Error, "compare-and-swap");
    assertEquals((await requireSidecar(cachePath)).localDirty, true);

    contended = false;
    await service.pushChanged();
    assert(
      storedShardKeys(mock, "config").includes("config/models/b.yaml"),
      "the retried push must commit the entry",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: a store without If-Match support falls back to merge-on-write and warns once", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-i-" });
  const originalWarn = console.warn;
  const warnings: string[] = [];
  console.warn = (msg: string) => warnings.push(msg);
  try {
    const mock = createMockS3Client();
    mock.putObjectIfMatch = () => {
      const err = new Error("NotImplemented: If-Match");
      err.name = "NotImplemented";
      return Promise.reject(err);
    };
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    // Another writer's entry the local view lacks.
    addRemoteShardEntry(mock, "config", "config/models/t1.yaml");
    mock.storage.set("config/models/a.yaml", new TextEncoder().encode("aaa\n"));
    await seedFile(cachePath, "config/models/a.yaml", "aaa\n");

    const service = new S3CacheSyncService(mock, cachePath);
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await service.pushChanged();
    await seedFile(cachePath, "config/models/c.yaml", "ccc\n");
    await service.markDirty({ relPath: "config/models/c.yaml" });
    await service.pushChanged();

    assertEquals(storedShardKeys(mock, "config"), [
      "config/models/a.yaml",
      "config/models/b.yaml",
      "config/models/c.yaml",
      "config/models/t1.yaml",
    ]);
    assertEquals(
      warnings.filter((w) => w.includes("If-Match")).length,
      1,
      "the fallback warning must be emitted once",
    );
  } finally {
    console.warn = originalWarn;
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: an unrecognized _meta.json fails the push instead of unlisting every partition", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-j-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
      "logs/run.txt": indexEntry("logs/run.txt"),
    }, 5);
    // Written by a newer version this build cannot interpret.
    const future = JSON.stringify({
      version: 3,
      partitions: ["config", "logs"],
      commitSeq: 5,
    });
    mock.storage.set("_index/_meta.json", new TextEncoder().encode(future));
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await assertRejects(
      () => service.pushChanged(),
      Error,
      "not a recognized v1/v2 index meta",
    );

    assertEquals(
      new TextDecoder().decode(mock.storage.get("_index/_meta.json")!),
      future,
      "the unreadable meta must be left untouched, not rebuilt from a partial view",
    );
    assertEquals((await requireSidecar(cachePath)).localDirty, true);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: an unrecognized shard fails the push instead of truncating the partition", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-k-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    const future = JSON.stringify({
      version: 2,
      entries: { "config/models/a.yaml": indexEntry("config/models/a.yaml") },
    });
    mock.storage.set("_index/config.json", new TextEncoder().encode(future));
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await assertRejects(
      () => service.pushChanged(),
      Error,
      "not a recognized v1 shard",
    );

    assertEquals(
      new TextDecoder().decode(mock.storage.get("_index/config.json")!),
      future,
      "the unreadable shard must be left untouched, not truncated",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: a 501 with an unparseable error code still triggers the merge-on-write fallback, warning once", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-l-" });
  const originalWarn = console.warn;
  const warnings: string[] = [];
  console.warn = (msg: string) => warnings.push(msg);
  try {
    const mock = createMockS3Client();
    // A non-XML 501 body leaves the SDK unable to parse the error code,
    // so only the status identifies the store as CAS-less.
    mock.putObjectIfMatch = () =>
      Promise.reject(
        new S3OperationError("501 Not Implemented", {
          name: "UnknownError",
          cause: undefined,
          httpStatusCode: 501,
          code: undefined,
          requestId: undefined,
          bodyPreview: "<html>501 Not Implemented</html>",
        }),
      );
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    addRemoteShardEntry(mock, "config", "config/models/t1.yaml");
    mock.storage.set("config/models/a.yaml", new TextEncoder().encode("aaa\n"));
    await seedFile(cachePath, "config/models/a.yaml", "aaa\n");

    // Two partitions commit in the same batch, so both enter the
    // conditional write before the fallback flag is set.
    const service = new S3CacheSyncService(mock, cachePath);
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");
    await seedFile(cachePath, "logs/run.txt", "log\n");
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await service.markDirty({ relPath: "logs/run.txt" });
    await service.pushChanged();

    assertEquals(storedShardKeys(mock, "config"), [
      "config/models/a.yaml",
      "config/models/b.yaml",
      "config/models/t1.yaml",
    ]);
    assertEquals(storedShardKeys(mock, "logs"), ["logs/run.txt"]);
    assertEquals(
      warnings.filter((w) => w.includes("If-Match")).length,
      1,
      "the fallback warning must be emitted once, not once per partition",
    );
  } finally {
    console.warn = originalWarn;
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2245: a partition that exhausts CAS still leaves its committed siblings listed in _meta.json", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "s3sync-2245-m-" });
  try {
    const mock = createMockS3Client();
    seedV2Repo(mock, {
      "config/models/a.yaml": indexEntry("config/models/a.yaml"),
    }, 5);
    mock.storage.set("config/models/a.yaml", new TextEncoder().encode("aaa\n"));
    await seedFile(cachePath, "config/models/a.yaml", "aaa\n");
    await seedFile(cachePath, "config/models/b.yaml", "bbb\n");
    await seedFile(cachePath, "logs/run.txt", "log\n");

    // "config" never wins its CAS; "logs" (a brand-new partition) does.
    let n = 0;
    interleaveBefore(
      mock,
      "_index/config.json",
      () => true,
      () => addRemoteShardEntry(mock, "config", `config/models/x${n++}.yaml`),
    );

    const service = new S3CacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "config/models/b.yaml" });
    await service.markDirty({ relPath: "logs/run.txt" });
    await assertRejects(() => service.pushChanged(), Error, "compare-and-swap");

    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assert(
      meta.partitions.includes("logs"),
      "the sibling shard committed, so a reader must be able to find it",
    );
    assertEquals(storedShardKeys(mock, "logs"), ["logs/run.txt"]);
    assertEquals((await requireSidecar(cachePath)).localDirty, true);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});
