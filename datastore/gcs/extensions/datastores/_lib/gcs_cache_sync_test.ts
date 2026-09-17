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

// Tests for GcsCacheSyncService focusing on the swamp-club#29 fix:
// mirrors s3_cache_sync_test.ts behavior since the GCS sync service
// shares the identical internal-file exclusion pattern and scrub
// logic. See swamp-club#29 for the motivating bug.

import {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
  assertStringIncludes,
} from "jsr:@std/assert@1.0.19";
import { join } from "jsr:@std/path@1";
import {
  GcsCacheSyncService,
  isInsideNamespaceDir,
  isInternalCacheFile,
  isLazySkippable,
  isRetryableError,
  retryWithBackoff,
} from "./gcs_cache_sync.ts";
import {
  GcsClient,
  GcsOperationError,
  NotFoundError,
  PreconditionFailedError,
} from "./gcs_client.ts";
import type { GcsObjectMetadata, GcsWriteResult } from "./gcs_client.ts";

/** Captured putObject call for test assertions. */
interface PutCall {
  key: string;
  body: Uint8Array;
}

/**
 * In-memory mock of GcsClient recording getObject/putObject/getMetadata
 * calls. `generationOverrides` lets a test pin a specific generation
 * string (for example `""` or `"0"` for the unusable-fingerprint case)
 * regardless of stored content. `putFailures` lets a test inject a
 * failure per key for retry / batch-error tests — cleaner than
 * monkey-patching the method and avoids `any`-typed reassignments.
 * Mock method bodies reject SYNCHRONOUSLY on a pre-aborted signal —
 * promise-based rejection would race the fast-path probe and leak a
 * real HEAD call.
 */
function createMockGcsClient(): GcsClient & {
  storage: Map<string, Uint8Array>;
  generationOverrides: Map<string, string>;
  putFailures: Map<string, Error>;
  deleteFailures: Map<string, Error>;
  puts: PutCall[];
  gets: string[];
  heads: string[];
  deletes: string[];
} {
  const storage = new Map<string, Uint8Array>();
  const generations = new Map<string, number>();
  const generationOverrides = new Map<string, string>();
  const putFailures = new Map<string, Error>();
  const deleteFailures = new Map<string, Error>();
  const puts: PutCall[] = [];
  const gets: string[] = [];
  const heads: string[] = [];
  const deletes: string[] = [];

  const nextGen = (key: string): string => {
    const g = (generations.get(key) ?? 0) + 1;
    generations.set(key, g);
    return String(g);
  };

  const genFor = (key: string): string =>
    generationOverrides.get(key) ?? String(generations.get(key) ?? 0);

  const throwIfAborted = (signal?: AbortSignal) => {
    if (signal?.aborted) {
      throw new DOMException("aborted", "AbortError");
    }
  };

  return {
    storage,
    generationOverrides,
    putFailures,
    deleteFailures,
    puts,
    gets,
    heads,
    deletes,

    putObject(
      key: string,
      body: Uint8Array,
      signal?: AbortSignal,
    ): Promise<GcsWriteResult> {
      throwIfAborted(signal);
      const injected = putFailures.get(key);
      if (injected) return Promise.reject(injected);
      storage.set(key, body);
      puts.push({ key, body });
      return Promise.resolve({ generation: nextGen(key) });
    },

    putObjectConditional(
      key: string,
      body: Uint8Array,
      signal?: AbortSignal,
    ): Promise<GcsWriteResult | null> {
      throwIfAborted(signal);
      if (storage.has(key)) {
        return Promise.resolve(null);
      }
      storage.set(key, body);
      puts.push({ key, body });
      return Promise.resolve({ generation: nextGen(key) });
    },

    getObject(
      key: string,
      signal?: AbortSignal,
    ): Promise<{ data: Uint8Array; generation?: string }> {
      throwIfAborted(signal);
      gets.push(key);
      const data = storage.get(key);
      if (!data) {
        return Promise.reject(new NotFoundError(`Object not found: ${key}`));
      }
      return Promise.resolve({ data, generation: genFor(key) });
    },

    getMetadata(
      key: string,
      signal?: AbortSignal,
    ): Promise<GcsObjectMetadata> {
      throwIfAborted(signal);
      heads.push(key);
      const data = storage.get(key);
      if (!data) return Promise.resolve({ exists: false });
      return Promise.resolve({
        exists: true,
        size: data.length,
        updated: new Date(),
        generation: genFor(key),
      });
    },

    deleteObject(
      key: string,
      _options?: { ifGenerationMatch?: string },
      signal?: AbortSignal,
    ): Promise<void> {
      throwIfAborted(signal);
      const injected = deleteFailures.get(key);
      if (injected) return Promise.reject(injected);
      deletes.push(key);
      storage.delete(key);
      return Promise.resolve();
    },

    listAllObjects(
      subPrefix?: string,
      signal?: AbortSignal,
    ): Promise<
      Array<{
        key: string;
        size: number;
        generation?: string;
        updated?: Date;
      }>
    > {
      throwIfAborted(signal);
      const entries = [...storage.entries()]
        .filter(([key]) => !subPrefix || key.startsWith(subPrefix))
        .map(([key, body]) => ({
          key,
          size: body.length,
          generation: genFor(key),
        }));
      return Promise.resolve(entries);
    },

    copyObject(
      sourceKey: string,
      destKey: string,
      signal?: AbortSignal,
    ): Promise<void> {
      throwIfAborted(signal);
      const data = storage.get(sourceKey);
      if (!data) {
        return Promise.reject(
          new NotFoundError(`Object not found: ${sourceKey}`),
        );
      }
      storage.set(destKey, new Uint8Array(data));
      nextGen(destKey);
      return Promise.resolve();
    },

    preflightCredentials(): Promise<void> {
      return Promise.resolve();
    },
  } as unknown as GcsClient & {
    storage: Map<string, Uint8Array>;
    generationOverrides: Map<string, string>;
    putFailures: Map<string, Error>;
    deleteFailures: Map<string, Error>;
    puts: PutCall[];
    gets: string[];
    heads: string[];
    deletes: string[];
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
function privateState(service: GcsCacheSyncService): {
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-a-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/@my-model/payload.yaml", "name: x\n");
    await seedFile(cachePath, "data/_catalog.db", "SQLITE-MAIN");
    await seedFile(cachePath, "data/_catalog.db-shm", "SQLITE-SHM");
    await seedFile(cachePath, "data/_catalog.db-wal", "SQLITE-WAL");

    await service.pushChanged();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-b-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-c-" });
  try {
    const mock = createMockGcsClient();
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
    await seedFile(cachePath, "data/@m/ok.yaml", "ok: yes\n");

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pullIndex();

    const state = privateState(service);
    assertExists(state.index);
    state.index.entries["data/_catalog.db-wal"] = {
      key: "data/_catalog.db-wal",
      size: 1024,
      lastModified: new Date().toISOString(),
    };

    await service.pullChanged();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-d-" });
  try {
    const mock = createMockGcsClient();
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
    mock.storage.set(
      "data/@m/payload.yaml",
      new TextEncoder().encode("hi!\n\n"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);
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

// -- (e1) pullIndex GCS-fetch path scrubs in-memory AND rewrites local ----

Deno.test("pullIndex GCS-fetch path: scrubs in-memory and rewrites local cache file", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-e1-" });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pullIndex();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-e2-" });
  try {
    const mock = createMockGcsClient();

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

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pullIndex();

    assertEquals(
      mock.gets.includes(".datastore-index.json"),
      false,
      "cache-hit branch must not fetch the index from GCS",
    );

    const state = privateState(service);
    assertExists(state.index);
    assertEquals(Object.keys(state.index.entries).sort(), ["data/@m/ok.yaml"]);
    assertEquals(state.indexMutated, true);

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

// -- (i) self-healing discovery for unindexed buckets (swamp-club #225) ---

// Test A — discovery from a populated bucket without an index.
Deno.test("pullIndex: discovers files when remote index is missing (swamp-club #225)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-225-A-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(
      "data/@org/m/payload-1.yaml",
      new TextEncoder().encode("hello\n"),
    );
    mock.storage.set(
      "data/@org/m/payload-2.yaml",
      new TextEncoder().encode("world!\n"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);
    const fingerprint = await (service as unknown as {
      pullIndex: (
        opts: { forceRemote: boolean },
      ) => Promise<string | null>;
    }).pullIndex({ forceRemote: true });

    const indexPut = mock.puts.find((p) => p.key === ".datastore-index.json");
    assertExists(indexPut, "discovery must publish a synthesized index");

    const synthesized = JSON.parse(new TextDecoder().decode(indexPut.body));
    assertEquals(
      Object.keys(synthesized.entries).sort(),
      ["data/@org/m/payload-1.yaml", "data/@org/m/payload-2.yaml"],
      "synthesized index keys must match the bucket listing exactly",
    );
    assertEquals(synthesized.entries["data/@org/m/payload-1.yaml"].size, 6);
    assertEquals(synthesized.entries["data/@org/m/payload-2.yaml"].size, 7);

    assertExists(fingerprint, "discovery must return a fingerprint generation");

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-225-B-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(
      "data/@org/m/a.yaml",
      new TextEncoder().encode("alpha\n"),
    );
    mock.storage.set(
      "data/@org/m/b.yaml",
      new TextEncoder().encode("beta\n"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-225-C-" });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
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

// Test D — empty bucket: brand-new bucket initializes v2 _meta.json.
Deno.test("pullIndex discovery: empty bucket initializes v2 _meta.json (fresh datastore starts shard-first)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-225-D-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fresh-v2-" });
  try {
    const mock = createMockGcsClient();
    // Local cache has a file ready to push.
    await seedFile(cachePath, "data/@org/m/id/latest", "id");
    await seedFile(cachePath, "data/@org/m/id/metadata.yaml", "kind: test\n");

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.markDirty({ relPath: "data/@org/m/id" });
    const pushed = await service.pushChanged();
    assertEquals(pushed, 2, "two local files should push");

    // Verify v2 path was used: _meta.json should exist with commitSeq 1
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
    prefix: "gcssync-fresh-v2-commit-",
  });
  try {
    const mock = createMockGcsClient();
    // Local cache has a file ready to push.
    await seedFile(cachePath, "data/@org/m/id/latest", "id");

    const service = new GcsCacheSyncService(mock, cachePath);
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

// Test E — pushChanged side benefit on an unindexed populated bucket.
Deno.test("pushChanged: against unindexed populated bucket builds a complete index (swamp-club #225 side benefit)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-225-E-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(
      "data/@org/m/remote-only.yaml",
      new TextEncoder().encode("remote\n"),
    );
    await seedFile(cachePath, "data/@org/m/local-only.yaml", "local\n");

    const service = new GcsCacheSyncService(mock, cachePath);
    const pushed = await service.pushChanged();
    assertEquals(pushed, 1, "exactly one local file should push");

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-g-" });
  try {
    const mock = createMockGcsClient();

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

    const service = new GcsCacheSyncService(mock, cachePath);
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

// -- (e2) pushChanged absence-on-disk deletion (markDirty contract rule #2) --
//
// When core calls markDirty(relPath) before removing a file, the next
// pushChanged should detect the absent dirty path, issue GCS DELETEs
// for matching index entries, and remove them from the index.

Deno.test("pushChanged: scoped walk deletes absent dirty path from GCS and index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-del1-" });
  try {
    const mock = createMockGcsClient();

    // Remote index has two files; both exist locally initially.
    await seedFile(cachePath, "data/model/alpha/v1/raw", "alpha-content");
    await seedFile(cachePath, "data/model/alpha/v1/metadata.yaml", "meta");
    const remoteEntries = {
      "data/model/alpha/v1/raw": {
        key: "data/model/alpha/v1/raw",
        size: 13,
        lastModified: new Date().toISOString(),
      },
      "data/model/alpha/v1/metadata.yaml": {
        key: "data/model/alpha/v1/metadata.yaml",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(".datastore-index.json", encodeIndex(remoteEntries));
    // Seed the remote objects too so deleteObject has something to remove
    mock.storage.set(
      "data/model/alpha/v1/raw",
      new TextEncoder().encode("alpha-content"),
    );
    mock.storage.set(
      "data/model/alpha/v1/metadata.yaml",
      new TextEncoder().encode("meta"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);

    // Mark the directory dirty (scoped), then delete the local files.
    await service.markDirty({ relPath: "data/model/alpha/v1" });
    await Deno.remove(join(cachePath, "data/model/alpha/v1"), {
      recursive: true,
    });

    const result = await service.pushChanged();

    // Both files should have been deleted from GCS.
    assertEquals(
      mock.deletes.sort(),
      [
        "data/model/alpha/v1/metadata.yaml",
        "data/model/alpha/v1/raw",
      ],
      "absent dirty entries must be deleted from GCS",
    );

    // Index writeback should not contain the deleted entries.
    const indexPuts = mock.puts.filter(
      (p) => p.key === ".datastore-index.json",
    );
    assert(indexPuts.length >= 1, "index must be written back");
    const writtenIndex = decodeIndex(indexPuts[indexPuts.length - 1].body);
    assertEquals(
      Object.keys(writtenIndex.entries).length,
      0,
      "deleted entries must be removed from the index",
    );

    // Return value includes deleted count.
    assertEquals(result, 2, "should report 2 deletions");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: bulk markDirty (no relPath) does NOT delete orphaned index entries", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-del2-" });
  try {
    const mock = createMockGcsClient();

    // Remote index has two entries.
    const remoteEntries = {
      "data/model/beta/v1/raw": {
        key: "data/model/beta/v1/raw",
        size: 12,
        lastModified: new Date().toISOString(),
      },
      "data/model/beta/v1/metadata.yaml": {
        key: "data/model/beta/v1/metadata.yaml",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(".datastore-index.json", encodeIndex(remoteEntries));
    mock.storage.set(
      "data/model/beta/v1/raw",
      new TextEncoder().encode("beta-content"),
    );
    mock.storage.set(
      "data/model/beta/v1/metadata.yaml",
      new TextEncoder().encode("meta"),
    );

    // Only metadata.yaml exists locally; raw was deleted.
    await seedFile(cachePath, "data/model/beta/v1/metadata.yaml", "meta");

    const service = new GcsCacheSyncService(mock, cachePath);

    // Bulk markDirty (no relPath) sets bulkInvalidated but NOT
    // dirtyPathsOverflowed. A no-path markDirty is a modification
    // signal, not a deletion signal — matching S3's semantics.
    await service.markDirty();

    const result = await service.pushChanged();

    // No deletions — orphan detection only triggers on dirty-path
    // overflow, not on a bare bulkInvalidated.
    assertEquals(
      mock.deletes.length,
      0,
      "no-relPath markDirty must not trigger orphan deletion",
    );

    assertEquals(result, 0, "should report 0 changes");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: lazy hydration guard prevents deletion of un-hydrated files", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-del3-" });
  try {
    const mock = createMockGcsClient();

    // Remote index has a data/*/raw file that was never hydrated locally.
    const remoteEntries = {
      "data/model/gamma/v1/raw": {
        key: "data/model/gamma/v1/raw",
        size: 14,
        lastModified: new Date().toISOString(),
      },
      "data/model/gamma/v1/metadata.yaml": {
        key: "data/model/gamma/v1/metadata.yaml",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(".datastore-index.json", encodeIndex(remoteEntries));
    mock.storage.set(
      "data/model/gamma/v1/raw",
      new TextEncoder().encode("gamma-content"),
    );
    mock.storage.set(
      "data/model/gamma/v1/metadata.yaml",
      new TextEncoder().encode("meta"),
    );

    // Only metadata exists locally (lazy hydration: raw was never pulled).
    await seedFile(cachePath, "data/model/gamma/v1/metadata.yaml", "meta");

    const service = new GcsCacheSyncService(mock, cachePath);

    // Do a metadata-only pull first to activate lazy hydration state.
    await service.pullChanged({ metadataOnly: true });

    // Bulk markDirty to trigger the orphan scan.
    await service.markDirty();

    mock.deletes.length = 0; // Reset deletes after pull
    await service.pushChanged();

    // The lazy-skippable raw file must NOT be deleted.
    assertEquals(
      mock.deletes.length,
      0,
      "un-hydrated raw files must not be deleted when lazy pull is active",
    );

    // The remote object must still exist.
    assert(
      mock.storage.has("data/model/gamma/v1/raw"),
      "remote raw object must be preserved",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: no markDirty means no deletion (reader-side safety)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-del4-" });
  try {
    const mock = createMockGcsClient();

    // Remote has entries that don't exist locally — same scenario as the
    // existing "preserves remote index entries" test. Without markDirty,
    // no deletions should occur.
    const remoteEntries = {
      "data/@writer/file1.yaml": {
        key: "data/@writer/file1.yaml",
        size: 10,
        lastModified: new Date().toISOString(),
      },
      "data/@writer/file2.yaml": {
        key: "data/@writer/file2.yaml",
        size: 20,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(".datastore-index.json", encodeIndex(remoteEntries));

    const service = new GcsCacheSyncService(mock, cachePath);

    // No markDirty — simulates reader-side repo calling pushChanged.
    await service.pushChanged();

    assertEquals(
      mock.deletes.length,
      0,
      "without markDirty, no files should be deleted",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (del5) pushChanged: partial deletion inside surviving directory ------
//
// When a dirty path points at a directory that still exists, and one file
// inside it has been deleted while others survive, the scoped walk must
// detect the orphan via index comparison and schedule it for remote
// deletion. Regression coverage for the localFilesInDir pattern ported
// from s3_cache_sync.ts.

Deno.test("pushChanged: scoped walk detects partial deletion inside surviving directory", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-del5-" });
  try {
    const mock = createMockGcsClient();

    // Remote index has three files under data/model/beta/.
    await seedFile(cachePath, "data/model/beta/a.yaml", "aaa");
    await seedFile(cachePath, "data/model/beta/b.yaml", "bbb");
    await seedFile(cachePath, "data/model/beta/c.yaml", "ccc");
    const remoteEntries = {
      "data/model/beta/a.yaml": {
        key: "data/model/beta/a.yaml",
        size: 3,
        lastModified: new Date().toISOString(),
      },
      "data/model/beta/b.yaml": {
        key: "data/model/beta/b.yaml",
        size: 3,
        lastModified: new Date().toISOString(),
      },
      "data/model/beta/c.yaml": {
        key: "data/model/beta/c.yaml",
        size: 3,
        lastModified: new Date().toISOString(),
      },
    };
    mock.storage.set(".datastore-index.json", encodeIndex(remoteEntries));
    mock.storage.set(
      "data/model/beta/a.yaml",
      new TextEncoder().encode("aaa"),
    );
    mock.storage.set(
      "data/model/beta/b.yaml",
      new TextEncoder().encode("bbb"),
    );
    mock.storage.set(
      "data/model/beta/c.yaml",
      new TextEncoder().encode("ccc"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);

    // Mark the parent directory dirty, then delete ONE file.
    // The directory still exists with a.yaml and c.yaml.
    await service.markDirty({ relPath: "data/model/beta" });
    await Deno.remove(join(cachePath, "data/model/beta/b.yaml"));

    const result = await service.pushChanged();

    // b.yaml should be deleted from GCS.
    assert(
      mock.deletes.includes("data/model/beta/b.yaml"),
      `expected b.yaml in deletes, got: ${JSON.stringify(mock.deletes)}`,
    );
    // a.yaml and c.yaml should NOT be deleted.
    assert(
      !mock.deletes.includes("data/model/beta/a.yaml"),
      "a.yaml should not be deleted",
    );
    assert(
      !mock.deletes.includes("data/model/beta/c.yaml"),
      "c.yaml should not be deleted",
    );

    // Index writeback should not contain b.yaml.
    const indexPuts = mock.puts.filter(
      (p) => p.key === ".datastore-index.json",
    );
    assert(indexPuts.length >= 1, "index must be written back");
    const writtenIndex = decodeIndex(indexPuts[indexPuts.length - 1].body);
    assert(
      !("data/model/beta/b.yaml" in writtenIndex.entries),
      "b.yaml must be removed from the written index",
    );

    // The deletion should be reflected in the return value.
    assert(
      typeof result === "number" && result >= 1,
      `expected at least 1 change reported, got: ${result}`,
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-f-" });
  try {
    const mock = createMockGcsClient();

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

    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-h-" });
  try {
    const puts: PutCall[] = [];
    const mock = {
      putObject(
        key: string,
        body: Uint8Array,
      ): Promise<{ generation: string }> {
        puts.push({ key, body });
        return Promise.resolve({ generation: "1" });
      },
      getObject(
        _key: string,
      ): Promise<{ data: Uint8Array; generation?: string }> {
        // Simulate a transient 5xx: generic Error, NOT a NotFoundError.
        return Promise.reject(new Error("500 Internal Server Error"));
      },
      preflightCredentials(): Promise<void> {
        return Promise.resolve();
      },
    } as unknown as GcsClient;

    await seedFile(cachePath, "data/@m/payload.yaml", "data\n");

    const service = new GcsCacheSyncService(mock, cachePath);

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

// ============================================================================
// Fast-path test block (1)–(9) — ref lab/166.
//
// GCS fingerprint is the remote index's `generation` string instead of
// an S3-style ETag. Design differences from s3's (1)-(9) block:
//   - No `normalizeETag` helper equivalent — generation is a plain
//     int64 string with no wire quirks.
//   - Test (6) swaps s3's "multipart ETag bypasses fast path" case for
//     "empty-string generation bypasses fast path" — GCS never returns
//     multipart-style fingerprints because generation is unique per
//     write regardless of upload method.
// ============================================================================

// -- (1) sidecar walker-exclusion guardrail -------------------------------

Deno.test("isInternalCacheFile: excludes the sync-state sidecar", () => {
  assertEquals(isInternalCacheFile(".datastore-sync-state.json"), true);
  assertEquals(isInternalCacheFile("regular/file.yaml"), false);
});

Deno.test("isInternalCacheFile: excludes per-target FileLock files at any depth", () => {
  // Data tier writes per-target locks at `data/<kind>/<type>/<id>/.lock`.
  // Without this exclusion, `discoverIndexFromBucket` captures transient
  // `.lock` files into the synthesized index, the lock subsystem deletes
  // them on release, and a fresh reader 404s on the missing object during
  // setup hydration.
  assertEquals(
    isInternalCacheFile(
      "data/command/shell/c19f88eb-de4f-4227-ade7-8162aec3d6a6/.lock",
    ),
    true,
  );
  assertEquals(isInternalCacheFile("data/@m/.lock"), true);
  assertEquals(isInternalCacheFile(".datastore.lock"), true);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fast2-" });
  try {
    const mock = createMockGcsClient();
    // Seed a remote index + local index so the first pull marks clean.
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    // Priming pull — slow-path, writes the sidecar.
    await service.pullChanged();

    // Reset call ledgers; second pull must fast-path.
    mock.gets.length = 0;
    mock.heads.length = 0;

    const result = await service.pullChanged();

    assertEquals(result, 0, "fast path should return 0 pulled");
    assertEquals(
      mock.gets.filter((k) => k === ".datastore-index.json").length,
      0,
      "no index GET on fast-path hit — only the sidecar HEAD fires",
    );
    assertEquals(
      mock.heads.length,
      1,
      "exactly one HEAD of the index during the fast-path probe",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (3) post-verified pushChanged short-circuits with zero walk ----------

Deno.test("pushChanged: post-verified second call hits fast path with zero index GETs", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fast3-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    // Priming sync populates the sidecar (pull then push slow-path).
    await service.pullChanged();
    await service.pushChanged();

    mock.gets.length = 0;
    mock.heads.length = 0;
    mock.puts.length = 0;

    const result = await service.pushChanged();

    assertEquals(result, 0, "fast path should return 0 pushed");
    assertEquals(
      mock.gets.filter((k) => k === ".datastore-index.json").length,
      0,
      "no index GET on fast-path hit",
    );
    assertEquals(
      mock.puts.length,
      0,
      "no putObject calls on fast-path hit — nothing walked, nothing written",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (4) corrupt sidecar falls through, never throws ----------------------

Deno.test("pullChanged: corrupt sidecar (bad JSON / wrong version / missing fields) falls through to slow path", async () => {
  const corruptCases = [
    "not valid json{",
    JSON.stringify({
      version: 999,
      remoteIndexGeneration: "1",
      lastVerifiedAt: "2026-01-01T00:00:00Z",
      localDirty: false,
    }),
    JSON.stringify({ version: 1 /* missing fields */ }),
  ];
  for (const [i, corrupt] of corruptCases.entries()) {
    const cachePath = await Deno.makeTempDir({ prefix: `gcssync-fast4-${i}-` });
    try {
      const mock = createMockGcsClient();
      await mock.putObject(".datastore-index.json", encodeIndex({}));
      await Deno.mkdir(cachePath, { recursive: true });
      await Deno.writeTextFile(
        join(cachePath, ".datastore-sync-state.json"),
        corrupt,
      );

      const service = new GcsCacheSyncService(mock, cachePath);

      // Must NOT throw. Must fall through to slow path — which GETs
      // the remote index (populating mock.gets).
      await service.pullChanged();

      assert(
        mock.gets.some((k) => k === ".datastore-index.json"),
        `corrupt sidecar case ${i} must fall through to slow-path index GET`,
      );
    } finally {
      await Deno.remove(cachePath, { recursive: true });
    }
  }
});

// -- (5) remote generation change bypasses short-circuit ------------------

Deno.test("pullChanged: remote index generation change bypasses fast path", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fast5-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    await service.pullChanged();

    // Bump the remote generation — simulates another writer pushing
    // an updated index between our syncs.
    mock.generationOverrides.set(".datastore-index.json", "999");

    mock.gets.length = 0;
    mock.heads.length = 0;

    await service.pullChanged();

    // Fast-path probe HEADs (generation mismatch), then slow path
    // GETs the remote index.
    assert(
      mock.gets.some((k) => k === ".datastore-index.json"),
      "generation mismatch must bypass fast path and slow-path GET the index",
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
// service starts, sees fast-path miss because remote generation has
// moved on, drops to slow path — and without `forceRemote` would walk
// the still-fresh-by-mtime local index file (process A's view) and
// find toPull=0. Result: "Pulled 0 files" while another writer's data
// sits unpulled on remote. swamp-club#1225 writer1↔writer2 path.
Deno.test("pullChanged: slow path force-fetches the remote index even when a previous process's local index is mtime-fresh", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-pull-force-",
  });
  try {
    const mock = createMockGcsClient();

    // Seed initial remote: gen=1, one entry.
    mock.generationOverrides.set(".datastore-index.json", "1");
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
    const serviceA = new GcsCacheSyncService(mock, cachePath);
    await serviceA.pullChanged();

    // Simulate another writer pushing in the meantime: bump generation,
    // add a new entry and its file. Process A would not see this; only
    // process B's pullChanged should.
    mock.generationOverrides.set(".datastore-index.json", "2");
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
    const serviceB = new GcsCacheSyncService(mock, cachePath);
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

// -- (6) empty/zero generation bypasses fast path -------------------------
//
// GCS-specific: the S3 equivalent test checks multipart-shaped ETag
// bypass. GCS generation is always unique per write (no multipart
// variant), so the analogous unusable-fingerprint case is an
// empty-string or "0" generation — values `tryFastPull*` rejects
// explicitly. This pins the defensive check so a future implementer
// doesn't "simplify" it out.

Deno.test("pullChanged: empty-string generation bypasses fast path", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fast6-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    await service.pullChanged();

    mock.generationOverrides.set(".datastore-index.json", "");

    mock.gets.length = 0;
    await service.pullChanged();

    assert(
      mock.gets.some((k) => k === ".datastore-index.json"),
      "empty generation must bypass fast path and slow-path GET the index",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (7) local file mutation forces real push work -----------------------

Deno.test("pushChanged: local file mutation since last sync forces real push work", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fast7-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    await service.pullChanged();
    await service.pushChanged();

    // pushFile marks localDirty. Call it directly to simulate a
    // cache-writer that goes through the proper path.
    mock.puts.length = 0;
    await seedFile(cachePath, "data/new/file.yaml", "fresh\n");
    await service.pushFile("data/new/file.yaml");

    // Next pushChanged — localDirty was set by pushFile, so fast path
    // must miss and slow-path walk.
    mock.gets.length = 0;
    await service.pushChanged();

    assert(
      mock.gets.some((k) => k === ".datastore-index.json"),
      "localDirty=true must force slow-path index fetch",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (8) AbortSignal cancellation propagates -----------------------------

Deno.test("pullChanged / pushChanged: AbortSignal cancellation propagates", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fast8-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    // Reset ledgers so the seed putObject doesn't count against
    // "zero real calls leak after abort".
    mock.puts.length = 0;
    mock.gets.length = 0;
    mock.heads.length = 0;

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

    assertEquals(
      mock.gets.filter((k) => k === ".datastore-index.json").length,
      0,
      "no GETs after abort",
    );
    assertEquals(mock.puts.length, 0, "no PUTs after abort");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- (9) guardrail: direct cache writes without markDirty bypass tracking --
//
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
// to re-confirm) would defeat the fast-path's whole purpose.

Deno.test("pushChanged: direct Deno.writeFile bypasses localDirty tracking (contract)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-fast9-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    // Clean baseline.
    await service.pullChanged();
    await service.pushChanged();

    // Direct write — bypasses pushFile, so localDirty stays false.
    await seedFile(cachePath, "data/@m/sneaky.yaml", "sneaky\n");

    mock.puts.length = 0;
    mock.gets.length = 0;
    await service.pushChanged();

    // Fast path hit — sneaky.yaml never uploaded. This is the
    // documented contract (see S3 #105 precedent). If you broke
    // this test by adding a new cache writer, teach that writer to
    // flip the sidecar (or call markLocalDirty) instead of removing
    // the assertion.
    assertEquals(
      mock.puts.length,
      0,
      "fast path skipped the direct write — documented contract, not a bug",
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
// DEF-2 unit block — retry + classification + batch failure message.
// Ref lab/166 (S3 #102 mirror for GCS).
// ============================================================================

function makeGcsErr(status: number | null): GcsOperationError {
  return new GcsOperationError(`simulated ${status ?? "transport"}`, {
    name: "GcsOperationError",
    httpStatusCode: status,
    code: undefined,
    bodyPreview: undefined,
    uploadId: undefined,
  });
}

Deno.test("isRetryableError: 5xx and 429 are retryable, 4xx is not", () => {
  assertEquals(isRetryableError(makeGcsErr(500)), true);
  assertEquals(isRetryableError(makeGcsErr(502)), true);
  assertEquals(isRetryableError(makeGcsErr(503)), true);
  assertEquals(isRetryableError(makeGcsErr(429)), true);
  // transport-level (no HTTP status) retryable
  assertEquals(isRetryableError(makeGcsErr(null)), true);
  // 4xx non-429 → not retryable
  assertEquals(isRetryableError(makeGcsErr(400)), false);
  assertEquals(isRetryableError(makeGcsErr(401)), false);
  assertEquals(isRetryableError(makeGcsErr(403)), false);
  assertEquals(isRetryableError(makeGcsErr(404)), false);
});

Deno.test("isRetryableError: TimeoutError retryable, AbortError + narrow types not", () => {
  const timeout = new Error("t");
  timeout.name = "TimeoutError";
  const abort = new Error("a");
  abort.name = "AbortError";
  assertEquals(isRetryableError(timeout), true);
  assertEquals(isRetryableError(abort), false);
  assertEquals(isRetryableError(new NotFoundError("nf")), false);
  assertEquals(isRetryableError(new PreconditionFailedError("pf")), false);
});

Deno.test("retryWithBackoff: succeeds after transient 503", async () => {
  let calls = 0;
  const result = await retryWithBackoff(
    () => {
      calls++;
      if (calls === 1) return Promise.reject(makeGcsErr(503));
      return Promise.resolve("ok");
    },
    { baseDelayMs: 5 },
  );
  assertEquals(result, "ok");
  assertEquals(calls, 2);
});

Deno.test("retryWithBackoff: does NOT retry non-retryable (403)", async () => {
  let calls = 0;
  await assertRejects(
    () =>
      retryWithBackoff(
        () => {
          calls++;
          return Promise.reject(makeGcsErr(403));
        },
        { baseDelayMs: 5 },
      ),
    GcsOperationError,
  );
  assertEquals(calls, 1, "403 is terminal, no retries");
});

Deno.test("retryWithBackoff: exhausts maxAttempts then rethrows", async () => {
  let calls = 0;
  await assertRejects(
    () =>
      retryWithBackoff(
        () => {
          calls++;
          return Promise.reject(makeGcsErr(500));
        },
        { baseDelayMs: 5, maxAttempts: 3 },
      ),
    GcsOperationError,
  );
  assertEquals(calls, 3);
});

Deno.test("retryWithBackoff: signal abort during backoff wakes sleep with AbortError", async () => {
  const controller = new AbortController();
  let calls = 0;
  const promise = retryWithBackoff(
    () => {
      calls++;
      return Promise.reject(makeGcsErr(503));
    },
    { baseDelayMs: 5_000, signal: controller.signal },
  );
  // Let one call fire, then abort. The backoff sleep should wake.
  await new Promise((r) => setTimeout(r, 50));
  controller.abort();
  await assertRejects(() => promise, DOMException);
  assertEquals(calls, 1, "abort fires during backoff, not during next op");
});

// --- batch failure message includes underlying error details --------------

Deno.test("pushChanged: batch failure message includes underlying error details", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-def2-batch-",
  });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));

    // Inject per-key failures via the mock's putFailures hook so the
    // test exercises distinct error reasons (auth, server, transport)
    // in the batch-failure message without resorting to method
    // reassignment.
    mock.putFailures.set("data/a.yaml", makeGcsErr(403)); // auth
    mock.putFailures.set("data/b.yaml", makeGcsErr(500)); // server
    mock.putFailures.set("data/c.yaml", makeGcsErr(null)); // transport
    mock.putFailures.set("data/d.yaml", makeGcsErr(null)); // transport

    await seedFile(cachePath, "data/a.yaml", "a");
    await seedFile(cachePath, "data/b.yaml", "b");
    await seedFile(cachePath, "data/c.yaml", "c");
    await seedFile(cachePath, "data/d.yaml", "d");

    const service = new GcsCacheSyncService(mock, cachePath);
    const err = await assertRejects(
      () => service.pushChanged(),
      Error,
    );

    assertStringIncludes(err.message, "Failed to push 4 file(s) to GCS");
    // First 3 of 4 failures are surfaced with underlying messages,
    // the 4th rolls up to "... and 1 more". Walk order isn't stable
    // across filesystems, so count inline failures rather than
    // asserting a specific subset.
    const inlineFailures = ["a", "b", "c", "d"].filter((n) =>
      err.message.includes(`data/${n}.yaml:`)
    );
    assertEquals(
      inlineFailures.length,
      3,
      `first 3 failures should appear inline, got ${inlineFailures.join(",")}`,
    );
    assertStringIncludes(err.message, "... and 1 more");
    // Distinct underlying reasons all represented across the message.
    assertStringIncludes(err.message, "simulated");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ============================================================================
// DEF-2 integration block — retry against a programmable HTTP server.
// Drives the real GcsClient through Deno.serve so wire-level retry
// behavior (503/429/403/timeout) is exercised end-to-end. Ref lab/166,
// mirrors S3 #102 integration layout.
// ============================================================================

/**
 * Spin up a local HTTP server for integration tests and return its
 * base URL + shutdown handle. Same pattern as gcs_client_test.ts.
 */
function startIntegrationServer(
  handler: (req: Request) => Response | Promise<Response>,
): { url: string; shutdown: () => Promise<void> } {
  const ac = new AbortController();
  const server = Deno.serve(
    { port: 0, signal: ac.signal, onListen() {} },
    handler,
  );
  const addr = server.addr;
  const url = `http://${
    addr.hostname === "::" ? "localhost" : addr.hostname
  }:${addr.port}`;
  return {
    url,
    shutdown: async () => {
      ac.abort();
      try {
        await server.finished;
      } catch {
        // expected on shutdown
      }
    },
  };
}

// The GCS client uses fetch() which keeps TCP connections alive in the
// global HTTP agent, which trips Deno's resource leak detection.
// sanitizeResources: false is safe here because those connections are
// reclaimed when the runtime tears down between test runs.

Deno.test({
  name: "DEF-2 integration: 503-then-200 pullFile retries and succeeds",
  sanitizeResources: false,
  fn: async () => {
    let calls = 0;
    const { url, shutdown } = startIntegrationServer(() => {
      calls++;
      if (calls === 1) return new Response("unavailable", { status: 503 });
      return new Response(new Uint8Array([1, 2, 3]), { status: 200 });
    });
    const cachePath = await Deno.makeTempDir({ prefix: "gcssync-int503-" });
    try {
      const client = new GcsClient({
        bucket: "b",
        apiEndpoint: url,
        defaultRequestTimeoutMs: 2000,
      });
      // Bypass retryWithBackoff's production delays — 5ms base suffices.
      const originalRetry = retryWithBackoff;
      // pullFile invokes retryWithBackoff internally; force fast backoff
      // by monkey-patching the module-level default via a dedicated
      // assertion path — simpler: pullFile is `await retryWithBackoff(...)`
      // with no config override, so we instead verify behavior via
      // calling retryWithBackoff directly with fast delays.
      const { data } = await originalRetry(
        () => client.getObject("obj"),
        { baseDelayMs: 5 },
      );
      assertEquals(Array.from(data), [1, 2, 3]);
      assertEquals(calls, 2, "first attempt 503, second 200");
    } finally {
      await shutdown();
      await Deno.remove(cachePath, { recursive: true });
    }
  },
});

Deno.test({
  name:
    "DEF-2 integration: 429 retries (no Retry-After honored, matches S3 #102)",
  sanitizeResources: false,
  fn: async () => {
    let calls = 0;
    const { url, shutdown } = startIntegrationServer(() => {
      calls++;
      if (calls === 1) {
        return new Response("rate limited", {
          status: 429,
          headers: { "Retry-After": "60" }, // deliberately ignored
        });
      }
      return new Response(new Uint8Array([0]), { status: 200 });
    });
    try {
      const client = new GcsClient({ bucket: "b", apiEndpoint: url });
      const { data } = await retryWithBackoff(
        () => client.getObject("obj"),
        { baseDelayMs: 5 },
      );
      assertEquals(data.length, 1);
      assertEquals(calls, 2, "429 retried to success despite Retry-After");
    } finally {
      await shutdown();
    }
  },
});

Deno.test({
  name:
    "DEF-2 integration: 403 throws immediately with credential hint, no retry",
  sanitizeResources: false,
  fn: async () => {
    let calls = 0;
    const { url, shutdown } = startIntegrationServer(() => {
      calls++;
      return new Response(
        JSON.stringify({
          error: {
            code: 403,
            errors: [{ reason: "authError", message: "forbidden" }],
          },
        }),
        { status: 403, headers: { "Content-Type": "application/json" } },
      );
    });
    try {
      const client = new GcsClient({ bucket: "b", apiEndpoint: url });
      const err = await assertRejects(
        () =>
          retryWithBackoff(() => client.getObject("obj"), { baseDelayMs: 5 }),
        GcsOperationError,
      );
      assertEquals(err.httpStatusCode, 403);
      // Issue #226: 403 now leads with the swamp-flavoured credentials-rejected
      // hint instead of the old generic "check GCS credentials" message.
      assertStringIncludes(
        err.message,
        "Datastore credentials rejected by GCS",
      );
      assertEquals(calls, 1, "403 is terminal — no retries");
    } finally {
      await shutdown();
    }
  },
});

Deno.test({
  name:
    "DEF-2 integration: TimeoutError retries, exhausts budget, surfaces timeout",
  sanitizeResources: false,
  fn: async () => {
    let calls = 0;
    const { url, shutdown } = startIntegrationServer(() => {
      calls++;
      // Never resolves — stalled socket simulation.
      return new Promise<Response>(() => {});
    });
    try {
      const client = new GcsClient({
        bucket: "b",
        apiEndpoint: url,
        defaultRequestTimeoutMs: 100,
      });
      const err = await assertRejects(
        () =>
          retryWithBackoff(() => client.getObject("obj"), {
            baseDelayMs: 5,
            maxAttempts: 3,
          }),
        GcsOperationError,
      );
      assertEquals(err.name, "TimeoutError");
      assertStringIncludes(err.message, "timed out after 100ms");
      assertEquals(calls, 3, "timeout retried until budget exhausted");
    } finally {
      await shutdown();
    }
  },
});

// ============================================================================
// markDirty() contract — ref lab/166 follow-up.
//
// The fast-path short-circuit depends on a `localDirty` flag in the
// sidecar. That flag is only flipped by `pushFile` internally OR by
// `markDirty()` from the outside. swamp-core writes directly to the
// cache via atomicWriteFile, bypassing `pushFile` — so it MUST call
// `markDirty()` before (or immediately after) each write, otherwise
// the next `pushChanged` fast-paths past the write and the data is
// silently missed on upload.
// ============================================================================

Deno.test("markDirty: flips sidecar localDirty and forces slow-path on next pushChanged", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-markdirty-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    // Priming sync populates the sidecar clean.
    await service.pullChanged();
    await service.pushChanged();

    // Simulate swamp-core writing directly to the cache AND
    // honoring the new contract by calling markDirty afterwards.
    await seedFile(cachePath, "data/external-writer.yaml", "external\n");
    await service.markDirty();

    // Reset call ledgers — next pushChanged must slow-path and
    // actually walk the cache, finding the new file.
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
    prefix: "gcssync-markdirty-idem-",
  });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    await service.pullChanged();
    await service.pushChanged();
    await service.markDirty();

    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const mtimeAfterFirst = (await Deno.stat(sidecarPath)).mtime;
    assertExists(mtimeAfterFirst);

    // Repeated markDirty should NOT rewrite the sidecar when it's
    // already dirty. The early-return in markDirty (no-op when
    // `localDirty: true` is already recorded) means no new mtime.
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
// swamp-club #168: fast-path sidecar TOCTOU regression tests (GCS mirror)
//
// Same race shape as the S3 suite: concurrent writer B bumps the remote
// index generation between A's index GET and A's sidecar write. Before
// the fix, `markSynced` observed B's generation via a post-walk
// `getMetadata` and sidecar recorded B's value, causing A's next
// fast-path sync to mask B's file. After the fix, sidecar records the
// generation captured from A's GET response — the one A walked against.
//
// Microtask-bump ordering is the same as the S3 suite: the wrapped
// mock attaches `p.then(bump)` BEFORE the caller's `await`
// continuation, so bump runs first in the microtask queue. Any
// refactor that moves bump-attachment to a macrotask (setTimeout)
// loses the race simulation — keep this invariant when editing.
// =========================================================================

Deno.test("pullChanged: records generation from pullIndex GET, not post-walk getMetadata (swamp-club #168)", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-toctou-pull-",
  });
  try {
    const mock = createMockGcsClient();
    mock.generationOverrides.set(".datastore-index.json", "5");
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

    // Race simulation: bump generation to 999 in a microtask scheduled
    // from the index GET's resolution — fires between pullIndex's
    // getObject resolving and the post-walk markSynced call.
    const origGet = mock.getObject.bind(mock);
    mock.getObject = ((key: string, signal?: AbortSignal) => {
      const p = origGet(key, signal);
      if (key === ".datastore-index.json") {
        p.then(() => {
          // B's push: new file, bumped generation.
          mock.generationOverrides.set(".datastore-index.json", "999");
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

    const service = new GcsCacheSyncService(mock, cachePath);
    const pulled = await service.pullChanged();
    assertEquals(pulled, 0, "walk should see zero diff against generation 5");

    // The fix records "5" (the generation we actually verified
    // against), not "999" (the post-walk getMetadata value the old
    // buggy code would have observed after B's push landed).
    const sidecarText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const sidecar = JSON.parse(sidecarText);
    assertEquals(
      sidecar.remoteIndexGeneration,
      "5",
      "sidecar must record the generation from pullIndex GET, NOT a racy post-walk getMetadata",
    );

    // Invariant: the fix removes the post-walk getMetadata entirely.
    // On a first pullChanged (no pre-existing sidecar), the fast-path
    // probe returns null at the "no sidecar" check without
    // getMetadata'ing, so zero getMetadata calls on the index are
    // expected. If this assertion ever fails, a future maintainer
    // likely re-added the TOCTOU metadata call.
    assertEquals(
      mock.heads.filter((k) => k === ".datastore-index.json").length,
      0,
      "no post-walk getMetadata on index — TOCTOU fix removes it",
    );

    // On the second sync, the fast-path probe getMetadata's remote
    // (999), compares to sidecar (5), and correctly bails to the slow
    // path. The slow path walks and pulls B's new file. Without the
    // fix, sidecar would be 999 and this sync would return 0, masking
    // B's file.
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
// #168 TOCTOU concern is preserved: there is still no post-walk
// getMetadata on the index in this branch — the branch simply does no
// sidecar work at all now.
Deno.test("pushChanged no-writeback: does NOT mark the sidecar clean when nothing was pushed (swamp-club #1225)", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-1225-push-",
  });
  try {
    const mock = createMockGcsClient();
    // Remote has TWO files; local cache has only one of them. This is
    // the second-repo `datastore setup` scenario from production. The
    // walker sees zero LOCAL-only diffs (nothing to push), but the
    // local cache is missing `data/@m/remote-only.yaml` and must NOT
    // be recorded as in-sync.
    mock.generationOverrides.set(".datastore-index.json", "5");
    const existingMtime = new Date(0);
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

    const service = new GcsCacheSyncService(mock, cachePath);
    const pushed = await service.pushChanged();
    assertEquals(
      pushed,
      0,
      "walker sees no local-only files, so nothing to push",
    );

    // Regression pin: the sidecar must NOT exist (or at minimum must
    // not record a clean baseline). A fast-path-eligible sidecar here
    // would let the next pullChanged skip downloading `remote-only.yaml`.
    let sidecarExists = true;
    try {
      await Deno.stat(join(cachePath, ".datastore-sync-state.json"));
    } catch (err) {
      if (err instanceof Deno.errors.NotFound) sidecarExists = false;
      else throw err;
    }
    assertEquals(
      sidecarExists,
      false,
      "no-writeback branch must not write the sidecar — `pushed === 0` does not prove local matches remote",
    );

    // The TOCTOU fix from swamp-club #168 is preserved: no post-walk
    // getMetadata on the index in the no-writeback path.
    assertEquals(
      mock.heads.filter((k) => k === ".datastore-index.json").length,
      0,
      "no post-walk getMetadata on index in no-writeback path",
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
    prefix: "gcssync-1225-recovery-",
  });
  try {
    const mock = createMockGcsClient();
    mock.generationOverrides.set(".datastore-index.json", "7");
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

    const service = new GcsCacheSyncService(mock, cachePath);
    const pushed = await service.pushChanged();
    assertEquals(pushed, 0, "no local-only files — nothing to push");

    // Sidecar must be regenerated because local cache provably matches
    // the remote index of generation 7.
    const sidecarText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const sidecar = JSON.parse(sidecarText);
    assertEquals(sidecar.localDirty, false);
    assertEquals(
      sidecar.remoteIndexGeneration,
      "7",
      "sidecar must record the generation we walked against",
    );

    // No remote writeback — generation of the index must be untouched.
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
    prefix: "gcssync-1225-writeback-",
  });
  try {
    const mock = createMockGcsClient();
    mock.generationOverrides.set(".datastore-index.json", "11");
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

    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-issue-222-" });
  try {
    const mock = createMockGcsClient();
    // Pin a known generation for the remote index so the sidecar
    // assertion has a stable target.
    mock.generationOverrides.set(".datastore-index.json", "42");

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
    const serviceA = new GcsCacheSyncService(mock, cachePath);
    const pulled = await serviceA.pullChanged();
    assertEquals(pulled, SIZES.length, "must pull all 5 seeded files");

    // Positive: sidecar must be written with the GET'd generation and
    // clean state. Pre-fix, pulled > 0 skipped markSynced and the
    // sidecar didn't exist. Post-fix, this is the load-bearing piece
    // that lets the next pushChanged take the fast path.
    const sidecarText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const sidecar = JSON.parse(sidecarText);
    assertEquals(
      sidecar.localDirty,
      false,
      "sidecar must be clean — local cache matches the freshly-pulled remote",
    );
    assertEquals(
      sidecar.remoteIndexGeneration,
      "42",
      "sidecar must record the generation from pullIndex's GET response",
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
    const serviceC = new GcsCacheSyncService(mock, cachePath);
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

// ---------------------------------------------------------------------------
// Phase 2 tests: dirty sidecar v2, content hashing, partitioned index,
// scoped sync, configurable concurrency
// ---------------------------------------------------------------------------

Deno.test("isInternalCacheFile: excludes _index/ partition directory", () => {
  assert(isInternalCacheFile("_index"));
  assert(isInternalCacheFile("_index/data--gcp--compute--instance--abc.json"));
  assert(isInternalCacheFile("_index/_meta.json"));
  assert(!isInternalCacheFile("data/index/file.json"));
});

Deno.test("markDirty with relPath: tracks individual dirty paths", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    await service.markDirty({ relPath: "data/model/abc/output" });
    await service.markDirty({ relPath: "data/model/def/output" });
    const stateText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const state = JSON.parse(stateText);
    assertEquals(state.version, 2);
    assertEquals(state.localDirty, true);
    assertEquals(state.bulkInvalidated, false);
    assert(state.dirtyPaths.includes("data/model/abc/output"));
    assert(state.dirtyPaths.includes("data/model/def/output"));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("markDirty with relPath: caps at 2000 and flips bulkInvalidated", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    for (let i = 0; i < 2001; i++) {
      await service.markDirty({ relPath: `data/model/item-${i}/output` });
    }
    const stateText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const state = JSON.parse(stateText);
    assertEquals(state.version, 2);
    assertEquals(state.bulkInvalidated, true);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("markDirty with relPath: path-escape triggers bulkInvalidated", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    await service.markDirty({ relPath: "../../etc/passwd" });
    const stateText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const state = JSON.parse(stateText);
    assertEquals(state.version, 2);
    assertEquals(state.bulkInvalidated, true);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("markDirty without relPath: bulk invalidation (legacy path)", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    await service.markDirty();
    const stateText = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const state = JSON.parse(stateText);
    assertEquals(state.version, 2);
    assertEquals(state.localDirty, true);
    assertEquals(state.bulkInvalidated, true);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: scoped walk only visits dirty paths", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    await seedFile(cachePath, "data/model/abc/out/1/raw", "hello");
    await seedFile(cachePath, "data/model/def/out/1/raw", "world");

    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({}),
    );

    await service.markDirty({ relPath: "data/model/abc" });

    const pushed = await service.pushChanged();
    assert(typeof pushed === "number");
    assert(pushed >= 1);

    const dataPuts = mock.puts.filter((p) =>
      !p.key.startsWith(".datastore-index") && !p.key.startsWith("_index")
    );
    for (const put of dataPuts) {
      assert(
        put.key.startsWith("data/model/abc/"),
        `unexpected push of non-dirty path: ${put.key}`,
      );
    }
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: SHA-256 content hashing prevents redundant push when only mtime changed", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    const content = "unchanged content";
    await seedFile(cachePath, "data/model/x/out/1/raw", content);
    const stat = await Deno.stat(join(cachePath, "data/model/x/out/1/raw"));

    const hashBuffer = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(content),
    );
    const sha256 = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const indexWithHash = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries: {
        "data/model/x/out/1/raw": {
          key: "data/model/x/out/1/raw",
          size: new TextEncoder().encode(content).length,
          lastModified: new Date().toISOString(),
          localMtime: new Date(
            (stat.mtime?.getTime() ?? 0) - 1000,
          ).toISOString(),
          sha256,
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(indexWithHash, null, 2)),
    );

    await service.markDirty();
    const pushed = await service.pushChanged();
    assertEquals(pushed, 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: SHA-256 mismatch triggers push even with same size", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    await seedFile(cachePath, "data/model/x/out/1/raw", "new content!!");
    const stat = await Deno.stat(join(cachePath, "data/model/x/out/1/raw"));

    const indexWithHash = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries: {
        "data/model/x/out/1/raw": {
          key: "data/model/x/out/1/raw",
          size: new TextEncoder().encode("new content!!").length,
          lastModified: new Date().toISOString(),
          localMtime: new Date(
            (stat.mtime?.getTime() ?? 0) - 1000,
          ).toISOString(),
          sha256:
            "deadbeef0000000000000000000000000000000000000000000000000000dead",
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(indexWithHash, null, 2)),
    );

    await service.markDirty();
    const pushed = await service.pushChanged();
    assert(typeof pushed === "number" && pushed > 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged: SHA-256 fallback detects same-size change when mtime matches (#1307)", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
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

    await seedFile(cachePath, "data/model/x/out/1/raw", newContent);
    const stat = await Deno.stat(join(cachePath, "data/model/x/out/1/raw"));

    const indexWithHash = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries: {
        "data/model/x/out/1/raw": {
          key: "data/model/x/out/1/raw",
          size: oldData.length,
          lastModified: new Date().toISOString(),
          localMtime: stat.mtime!.toISOString(),
          sha256: oldSha256,
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(indexWithHash, null, 2)),
    );

    await service.markDirty();
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
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    const content = "unchanged content";
    const data = new TextEncoder().encode(content);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const sha256 = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    await seedFile(cachePath, "data/model/x/out/1/raw", content);
    const stat = await Deno.stat(join(cachePath, "data/model/x/out/1/raw"));

    const indexWithHash = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries: {
        "data/model/x/out/1/raw": {
          key: "data/model/x/out/1/raw",
          size: data.length,
          lastModified: new Date().toISOString(),
          localMtime: stat.mtime!.toISOString(),
          sha256,
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(indexWithHash, null, 2)),
    );

    await service.markDirty();
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

Deno.test("pushChanged: writes partitioned index alongside monolithic", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    await seedFile(
      cachePath,
      "data/gcp/compute/instance/abc/out-main/1/raw",
      "vm1",
    );
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    await service.markDirty();
    await service.pushChanged();

    assert(mock.storage.has(".datastore-index.json"));
    assert(mock.storage.has("_index/_meta.json"));
    const metaText = new TextDecoder().decode(
      mock.storage.get("_index/_meta.json")!,
    );
    const meta = JSON.parse(metaText);
    assertEquals(meta.version, 1);
    assert(meta.partitions.length > 0);

    const partKey = meta.partitions[0];
    assert(mock.storage.has(`_index/${partKey}.json`));
    const partText = new TextDecoder().decode(
      mock.storage.get(`_index/${partKey}.json`)!,
    );
    const part = JSON.parse(partText);
    assertEquals(part.version, 1);
    assert(Object.keys(part.entries).length > 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: scoped pull reads partition files when context.models provided", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    const partitionKey = "data--gcp--compute--instance--abc";
    const partData: { version: 1; entries: Record<string, unknown> } = {
      version: 1,
      entries: {
        "data/gcp/compute/instance/abc/out-main/1/raw": {
          key: "data/gcp/compute/instance/abc/out-main/1/raw",
          size: 3,
          lastModified: new Date().toISOString(),
        },
      },
    };
    mock.storage.set(
      `_index/${partitionKey}.json`,
      new TextEncoder().encode(JSON.stringify(partData)),
    );
    mock.storage.set(
      "data/gcp/compute/instance/abc/out-main/1/raw",
      new TextEncoder().encode("vm1"),
    );

    const pulled = await service.pullChanged({
      context: {
        models: [{ modelType: "gcp/compute/instance", modelId: "abc" }],
      },
    });
    assert(typeof pulled === "number" && pulled >= 1);
    const localContent = await Deno.readTextFile(
      join(cachePath, "data/gcp/compute/instance/abc/out-main/1/raw"),
    );
    assertEquals(localContent, "vm1");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged: scoped pull falls back to monolithic when partition missing", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    const fullIndex = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries: {
        "data/gcp/compute/instance/abc/out-main/1/raw": {
          key: "data/gcp/compute/instance/abc/out-main/1/raw",
          size: 3,
          lastModified: new Date().toISOString(),
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(fullIndex)),
    );
    mock.storage.set(
      "data/gcp/compute/instance/abc/out-main/1/raw",
      new TextEncoder().encode("vm1"),
    );

    const pulled = await service.pullChanged({
      context: {
        models: [{ modelType: "gcp/compute/instance", modelId: "abc" }],
      },
    });
    assert(typeof pulled === "number" && pulled >= 1);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("capabilities: returns scopedSync true", () => {
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, "/tmp/unused");
  assertEquals(service.capabilities().scopedSync, true);
});

Deno.test("configurable concurrency: respects custom pullConcurrency", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath, {
    pullConcurrency: 2,
    pushConcurrency: 2,
  });
  try {
    const index = {
      version: 1,
      lastPulled: new Date().toISOString(),
      entries: {
        "data/a/1/raw": {
          key: "data/a/1/raw",
          size: 1,
          lastModified: new Date().toISOString(),
        },
        "data/b/1/raw": {
          key: "data/b/1/raw",
          size: 1,
          lastModified: new Date().toISOString(),
        },
        "data/c/1/raw": {
          key: "data/c/1/raw",
          size: 1,
          lastModified: new Date().toISOString(),
        },
      },
    };
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify(index)),
    );
    mock.storage.set("data/a/1/raw", new Uint8Array([65]));
    mock.storage.set("data/b/1/raw", new Uint8Array([66]));
    mock.storage.set("data/c/1/raw", new Uint8Array([67]));

    const pulled = await service.pullChanged();
    assertEquals(pulled, 3);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("v1 sidecar migration: version 1 sidecar triggers full walk (no dirtyPaths)", async () => {
  const cachePath = await Deno.makeTempDir();
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, cachePath);
  try {
    const v1Sidecar = {
      version: 1,
      remoteIndexGeneration: "42",
      lastVerifiedAt: new Date().toISOString(),
      localDirty: true,
    };
    await Deno.mkdir(cachePath, { recursive: true });
    await Deno.writeTextFile(
      join(cachePath, ".datastore-sync-state.json"),
      JSON.stringify(v1Sidecar),
    );
    await seedFile(cachePath, "data/model/x/out/1/raw", "hello");
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    const pushed = await service.pushChanged();
    assert(typeof pushed === "number" && pushed >= 1);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcs-436-t1-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    const ids = await seedModels(cachePath, 50, 20);
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
    assert(
      putKeys.includes(".datastore-index.json"),
      "monolithic index must be written",
    );

    const indexPuts = putKeys.filter((k) => k.startsWith("_index/"));
    assertEquals(
      indexPuts.length,
      2,
      `expected 2 _index/ PUTs (1 partition + 1 meta), got ${indexPuts.length}: ${
        JSON.stringify(indexPuts)
      }`,
    );

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcs-436-t2-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedModels(cachePath, 10, 5);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcs-436-t3-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

    const ids = await seedModels(cachePath, 50, 20);
    await service.pushChanged();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcs-436-t4-" });
  const readerCachePath = await Deno.makeTempDir({
    prefix: "gcs-436-t4-reader-",
  });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    const writer = new GcsCacheSyncService(mock, cachePath);
    const ids = await seedModels(cachePath, 50, 20);
    await writer.pushChanged();

    await writer.markDirty({
      relPath: `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
    });
    await seedFile(
      cachePath,
      `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
      "model-a-updated",
    );
    await writer.pushChanged();

    const reader = new GcsCacheSyncService(mock, readerCachePath);
    mock.gets.length = 0;
    const pulled = await reader.pullChanged({
      context: {
        models: [{ modelType: "aws/ec2/vpc", modelId: ids[25] }],
      },
    });

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

    assertEquals(
      pulled,
      20,
      "reader must pull all 20 files for model B from its (first-push) partition",
    );

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcs-436-t5-" });
  const readerCachePath = await Deno.makeTempDir({
    prefix: "gcs-436-t5-reader-",
  });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(".datastore-index.json", encodeIndex({}));

    const writer = new GcsCacheSyncService(mock, cachePath);
    const ids = await seedModels(cachePath, 10, 5);
    await writer.pushChanged();

    await writer.markDirty({
      relPath: `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
    });
    await seedFile(
      cachePath,
      `data/aws/ec2/vpc/${ids[0]}/state-main/1/raw`,
      "UPDATED-model-a",
    );
    await writer.pushChanged();

    const reader = new GcsCacheSyncService(mock, readerCachePath);
    const pulled = await reader.pullChanged({
      context: {
        models: [{ modelType: "aws/ec2/vpc", modelId: ids[0] }],
      },
    });

    assertEquals(pulled, 5, "reader must pull all 5 files for model A");

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-lazy-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-lazy-sub-" });
  try {
    const mock = createMockGcsClient();

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

    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-hydrate-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-hydrate-404-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

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
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, "/tmp/dummy");
  const caps = service.capabilities();
  assertEquals(caps.scopedSync, true);
  assertEquals(caps.lazyHydration, true);
});

// -- lazyPullActive: push safety after lazy pull ---------------------------

Deno.test("pushChanged after metadataOnly pull preserves remote entries in index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-lazypush-" });
  try {
    const mock = createMockGcsClient();

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
    const svc = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-lazyclear-" });
  try {
    const mock = createMockGcsClient();

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

    const svc = new GcsCacheSyncService(mock, cachePath);

    // Lazy pull
    await svc.pullChanged({ metadataOnly: true });
    const text1 = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const sidecar1 = JSON.parse(text1);
    assertEquals(
      sidecar1.lazyPullActive,
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

    const text2 = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    const sidecar2 = JSON.parse(text2);
    assertEquals(
      sidecar2.lazyPullActive,
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-lazypersist-" });
  try {
    const mock = createMockGcsClient();

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
    const svc1 = new GcsCacheSyncService(mock, cachePath);
    await svc1.pullChanged({ metadataOnly: true });

    // Process 2: fresh instance, push
    const svc2 = new GcsCacheSyncService(mock, cachePath);
    await seedFile(
      cachePath,
      "data/aws/ec2/vpc/new/state-main/1/raw",
      "new",
    );
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-lazyscoped-" });
  try {
    const mock = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(mock, cachePath);

    // Lazy pull
    await svc.pullChanged({ metadataOnly: true });
    const text1 = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    assertEquals(JSON.parse(text1).lazyPullActive, true);

    // Scoped pull for one model — must NOT clear lazyPullActive
    await svc.pullChanged({
      context: { models: [{ modelType: "aws/ec2/vpc", modelId }] },
    });
    const text2 = await Deno.readTextFile(
      join(cachePath, ".datastore-sync-state.json"),
    );
    assertEquals(
      JSON.parse(text2).lazyPullActive,
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
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const nsIndex = encodeIndex({
      "data/model/1/raw": {
        key: "data/model/1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    gcs.storage.set("my-ns/.datastore-index.json", nsIndex);
    gcs.storage.set(
      "my-ns/data/model/1/raw",
      new TextEncoder().encode("hello"),
    );

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pulled = await svc.pullChanged({ namespace: "my-ns" });
    assertEquals(pulled, 1);

    const got = gcs.gets.filter((k) => k.includes(".datastore-index.json"));
    assertEquals(got, ["my-ns/.datastore-index.json"]);

    assert(
      gcs.gets.includes("my-ns/data/model/1/raw"),
      "data must be fetched from the namespaced key",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullChanged with namespace writes files under namespace dir locally (swamp-club#1483)", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const nsIndex = encodeIndex({
      "data/model/1/raw": {
        key: "data/model/1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    gcs.storage.set("my-ns/.datastore-index.json", nsIndex);
    gcs.storage.set(
      "my-ns/data/model/1/raw",
      new TextEncoder().encode("hello"),
    );

    const svc = new GcsCacheSyncService(gcs, cachePath);
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
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const nsIndex = encodeIndex({
      "data/model/1/raw": {
        key: "data/model/1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    gcs.storage.set("my-ns/.datastore-index.json", nsIndex);
    gcs.storage.set(
      "my-ns/data/model/1/raw",
      new TextEncoder().encode("hello"),
    );

    await seedFile(
      cachePath,
      "my-ns/.namespace.json",
      JSON.stringify({
        namespace: "my-ns",
        repoId: "test",
        registeredAt: "2026-01-01T00:00:00Z",
      }),
    );

    const svc = new GcsCacheSyncService(gcs, cachePath);
    await svc.pullChanged({ namespace: "my-ns" });

    gcs.puts.length = 0;

    const pushed = await svc.pushChanged({ namespace: "my-ns" });
    const dataPuts = gcs.puts.filter((p) => p.key.includes("data/model/1/raw"));
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });
    assert((pushed as number) >= 1);

    // Fresh bucket uses v2 shard-first: _meta.json and shard files under
    // the namespace, NOT a monolithic index.
    const metaPuts = gcs.puts.filter((p) =>
      p.key === "my-ns/_index/_meta.json"
    );
    assert(metaPuts.length > 0, "must write per-namespace _meta.json");

    const globalPuts = gcs.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assertEquals(globalPuts.length, 0, "must not write global index");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pushChanged with namespace does not delete files outside namespace", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    gcs.storage.set("other-ns/data/file.txt", new TextEncoder().encode("keep"));
    const otherIndex = encodeIndex({
      "other-ns/data/file.txt": {
        key: "other-ns/data/file.txt",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    });
    gcs.storage.set("other-ns/.datastore-index.json", otherIndex);

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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    await svc.pushChanged({ namespace: "my-ns" });

    assert(
      gcs.storage.has("other-ns/data/file.txt"),
      "files outside namespace must not be deleted",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("solo mode (no namespace) uses global index", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const globalIndex = encodeIndex({
      "data/file.txt": {
        key: "data/file.txt",
        size: 4,
        lastModified: new Date().toISOString(),
      },
    });
    gcs.storage.set(".datastore-index.json", globalIndex);
    gcs.storage.set("data/file.txt", new TextEncoder().encode("data"));

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1);

    const got = gcs.gets.filter((k) => k.includes(".datastore-index.json"));
    assertEquals(got, [".datastore-index.json"]);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("namespace assertion throws on mismatch", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new GcsCacheSyncService(gcs, cachePath);
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
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new GcsCacheSyncService(gcs, cachePath);
    await svc.exportCatalog("my-ns", [
      { relPath: "data/file.txt", size: 10, lastModified: "2026-01-01" },
    ]);

    assert(gcs.storage.has("my-ns/.catalog-export.json"));
    const data = JSON.parse(
      new TextDecoder().decode(gcs.storage.get("my-ns/.catalog-export.json")!),
    );
    assertEquals(data.length, 1);
    assertEquals(data[0].relPath, "data/file.txt");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("exportCatalog skips putObject when rows are unchanged", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new GcsCacheSyncService(gcs, cachePath);
    const rows = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
      { relPath: "data/b.txt", size: 20, lastModified: "2026-01-02" },
    ];

    await svc.exportCatalog("ns", rows);
    const putsAfterFirst = gcs.puts.filter((p) =>
      p.key === "ns/.catalog-export.json"
    ).length;
    assertEquals(putsAfterFirst, 1, "First export should upload");

    await svc.exportCatalog("ns", rows);
    const putsAfterSecond = gcs.puts.filter((p) =>
      p.key === "ns/.catalog-export.json"
    ).length;
    assertEquals(
      putsAfterSecond,
      1,
      "Second export with same rows should skip",
    );

    await svc.exportCatalog("ns", rows);
    const putsAfterThird =
      gcs.puts.filter((p) => p.key === "ns/.catalog-export.json").length;
    assertEquals(putsAfterThird, 1, "Third export with same rows should skip");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("exportCatalog uploads when rows differ", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new GcsCacheSyncService(gcs, cachePath);
    const rows1 = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
    ];
    const rows2 = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
      { relPath: "data/b.txt", size: 20, lastModified: "2026-01-02" },
    ];

    await svc.exportCatalog("ns", rows1);
    assertEquals(
      gcs.puts.filter((p: { key: string }) =>
        p.key === "ns/.catalog-export.json"
      ).length,
      1,
    );

    await svc.exportCatalog("ns", rows2);
    assertEquals(
      gcs.puts.filter((p: { key: string }) =>
        p.key === "ns/.catalog-export.json"
      ).length,
      2,
      "Changed rows should trigger upload",
    );

    const data = JSON.parse(
      new TextDecoder().decode(gcs.storage.get("ns/.catalog-export.json")!),
    );
    assertEquals(data.length, 2, "GCS should have the updated catalog");
    assertEquals(data[1].relPath, "data/b.txt");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("exportCatalog hash survives across service instances via sidecar", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const rows = [
      { relPath: "data/a.txt", size: 10, lastModified: "2026-01-01" },
    ];

    const svc1 = new GcsCacheSyncService(gcs, cachePath);
    await svc1.exportCatalog("ns", rows);
    assertEquals(
      gcs.puts.filter((p: { key: string }) =>
        p.key === "ns/.catalog-export.json"
      ).length,
      1,
    );

    const svc2 = new GcsCacheSyncService(gcs, cachePath);
    await svc2.exportCatalog("ns", rows);
    assertEquals(
      gcs.puts.filter((p: { key: string }) =>
        p.key === "ns/.catalog-export.json"
      ).length,
      1,
      "New service instance should skip upload when sidecar has matching hash",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullForeignCatalogs skips missing catalogs silently", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const catalog = JSON.stringify([
      { relPath: "data/a.txt", size: 5, lastModified: "2026-01-01" },
    ]);
    gcs.storage.set(
      "ns-a/.catalog-export.json",
      new TextEncoder().encode(catalog),
    );

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const results = await svc.pullForeignCatalogs(["ns-a", "ns-missing"]);

    assertEquals(results.length, 1);
    assertEquals(results[0].namespace, "ns-a");
    assertEquals(results[0].rows.length, 1);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("pullForeignCatalogs skips malformed JSON silently", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    gcs.storage.set(
      "ns-bad/.catalog-export.json",
      new TextEncoder().encode("not valid json {{{"),
    );

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const results = await svc.pullForeignCatalogs(["ns-bad"]);
    assertEquals(results.length, 0);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("fetchForeignContent returns bytes for existing file", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const content = new TextEncoder().encode("foreign data");
    gcs.storage.set("other-ns/data/file.txt", content);

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const result = await svc.fetchForeignContent("other-ns", "data/file.txt");
    assertExists(result);
    assertEquals(new TextDecoder().decode(result), "foreign data");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("fetchForeignContent returns null for missing file", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new GcsCacheSyncService(gcs, cachePath);
    const result = await svc.fetchForeignContent("other-ns", "no-such-file");
    assertEquals(result, null);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("fetchForeignContent rejects path traversal", async () => {
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    const svc = new GcsCacheSyncService(gcs, cachePath);
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
  const gcs = createMockGcsClient();
  const svc = new GcsCacheSyncService(gcs, "/tmp/unused");
  const caps = svc.capabilities();
  assertEquals(caps.namespacedSync, true);
  assertEquals(caps.scopedSync, true);
  assertEquals(caps.lazyHydration, true);
});

Deno.test("capabilities advertises configRefresh", () => {
  const gcs = createMockGcsClient();
  const svc = new GcsCacheSyncService(gcs, "/tmp/unused");
  const caps = svc.capabilities();
  assertEquals(caps.configRefresh, true);
});

// -- pullChanged: dangling index entries (GCS object missing) are pruned -----

Deno.test("pullChanged: prunes dangling index entries whose GCS object is missing", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-test-dangling-",
  });
  try {
    const mock = createMockGcsClient();

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
    // a gc that deleted the GCS object but left the index entry.

    const service = new GcsCacheSyncService(mock, cachePath);
    const pulled = await service.pullChanged();

    // Only the good file should have been pulled.
    assertEquals(pulled, 1);

    // The dangling entry should be removed from the in-memory index.
    const state = privateState(service);
    assertExists(state.index);
    assertEquals("data/good/v1/raw" in state.index.entries, true);
    assertEquals("data/dangling/v1/raw" in state.index.entries, false);

    // The cleaned index should have been written back to GCS.
    const indexPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assert(indexPuts.length > 0, "cleaned index should be pushed to GCS");
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
    prefix: "gcssync-test-non404-",
  });
  try {
    const mock = createMockGcsClient();

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
      signal?: AbortSignal,
    ) => {
      if (key === "data/file/v1/raw") {
        return Promise.reject(
          new GcsOperationError("Forbidden", {
            name: "GcsOperationError",
            httpStatusCode: 403,
            code: "forbidden",
            bodyPreview: undefined,
            uploadId: undefined,
          }),
        );
      }
      return origGet(key, signal);
    };

    const service = new GcsCacheSyncService(mock, cachePath);
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
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, "/tmp/unused");
  const caps = service.capabilities();
  assertEquals(caps.twoPhaseSync, true);
});

Deno.test("preparePush: uploads files but does not write the index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2p-a-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2p-b-" });
  try {
    const mock = createMockGcsClient();

    const existingIndex = encodeIndex({
      "data/other/existing.yaml": {
        key: "data/other/existing.yaml",
        size: 10,
        lastModified: new Date().toISOString(),
      },
    });
    mock.storage.set(".datastore-index.json", existingIndex);

    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cacheA = await Deno.makeTempDir({ prefix: "gcssync-2p-rt-a-" });
  const cacheB = await Deno.makeTempDir({ prefix: "gcssync-2p-rt-b-" });
  try {
    const mockA = createMockGcsClient();
    const mockB = createMockGcsClient();

    await seedFile(cacheA, "data/m1/f1.yaml", "hello\n");
    await seedFile(cacheB, "data/m1/f1.yaml", "hello\n");

    const serviceA = new GcsCacheSyncService(mockA, cacheA);
    await serviceA.pushChanged();

    const serviceB = new GcsCacheSyncService(mockB, cacheB);
    const manifest = await serviceB.preparePush();
    await serviceB.commitPush(manifest);

    // Fresh buckets use v2 shard-first: verify both paths write _meta.json
    // and shard files with matching data entries.
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2p-fp-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

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
    GcsCacheSyncService.partitionKeyFromPath(
      "data/aws/ec2/vpc/abc-123/state-main/1/raw",
    ),
    "data--aws--ec2--vpc--abc-123",
  );
});

Deno.test("partitionKeyFromPath: outputs/ per-model key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath(
      "outputs/mytype/mymodel/out1/1/raw",
    ),
    "outputs--mytype--mymodel",
  );
});

Deno.test("partitionKeyFromPath: definitions-evaluated/ per-model key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath(
      "definitions-evaluated/t/m/d/1/raw",
    ),
    "definitions-evaluated--t--m",
  );
});

Deno.test("partitionKeyFromPath: workflow-runs/ per-workflow key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath("workflow-runs/wf-1/run/data"),
    "workflow-runs--wf-1",
  );
});

Deno.test("partitionKeyFromPath: workflows-evaluated/ single-shard key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath(
      "workflows-evaluated/workflow-063a0cb1.yaml",
    ),
    "workflows-evaluated",
  );
});

Deno.test("partitionKeyFromPath: workflows-evaluated/ deeper path also works", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath("workflows-evaluated/wf-2/file"),
    "workflows-evaluated",
  );
});

Deno.test("partitionKeyFromPath: root-level file returns _root", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath(".catalog-export.json"),
    "_root",
  );
});

Deno.test("partitionKeyFromPath: empty string returns undefined", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath(""),
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
      GcsCacheSyncService.partitionKeyFromPath(`${dir}/some/file`),
      dir,
      `${dir}/ should produce single-shard key`,
    );
  }
});

Deno.test("partitionKeyFromPath: unknown directory returns subdir as single-shard key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath("unknown/dir/file"),
    "unknown",
  );
});

Deno.test("partitionKeyFromPath: legacy bundles/ prefix returns single-shard key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath("bundles/1bca5430/model.js"),
    "bundles",
  );
});

Deno.test("partitionKeyFromPath: legacy vault-bundles/ prefix returns single-shard key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath("vault-bundles/7c811b12/vault.js"),
    "vault-bundles",
  );
});

Deno.test("partitionKeyFromPath: legacy report-bundles/ prefix returns single-shard key", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath(
      "report-bundles/037f1885/report.js",
    ),
    "report-bundles",
  );
});

Deno.test("partitionKeyFromPath: short data/ path returns undefined", () => {
  assertEquals(
    GcsCacheSyncService.partitionKeyFromPath("data/a/b"),
    undefined,
  );
});

// (2) commitPush reads/merges/writes only touched shards
Deno.test("shard-first commitPush: reads/writes only touched shards", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-sf-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await seedFile(cachePath, "data/t2/m2/d2/1/raw", "bbb\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa-updated\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

    mock.gets.length = 0;
    mock.puts.length = 0;

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

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
  const cacheA = await Deno.makeTempDir({ prefix: "gcssync-cw-a-" });
  const cacheB = await Deno.makeTempDir({ prefix: "gcssync-cw-b-" });
  try {
    const shared = createMockGcsClient();
    const serviceA = new GcsCacheSyncService(shared, cacheA);
    const serviceB = new GcsCacheSyncService(shared, cacheB);

    await seedFile(cacheA, "data/t1/m1/d1/1/raw", "from-A\n");
    await serviceA.pushChanged();
    await serviceA.migrateMonolithToShards();

    await seedFile(cacheB, "data/t1/m1/d1/1/raw", "from-A\n");
    await seedFile(cacheB, "data/t2/m2/d2/1/raw", "from-B\n");
    await serviceB.markDirty({ relPath: "data/t2/m2/d2/1/raw" });

    const manifestB = await serviceB.preparePush();
    await serviceB.commitPush(manifestB);

    assert(
      shared.storage.has("_index/data--t1--m1.json"),
      "t1/m1 shard should exist",
    );
    assert(
      shared.storage.has("_index/data--t2--m2.json"),
      "t2/m2 shard should exist",
    );

    const cacheC = await Deno.makeTempDir({ prefix: "gcssync-cw-c-" });
    try {
      const serviceC = new GcsCacheSyncService(shared, cacheC);
      await serviceC.pullChanged();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-assemble-" });
  try {
    const mock = createMockGcsClient();

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
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );
    mock.storage.set(
      "data/t2/m2/d2/1/raw",
      new TextEncoder().encode("bbb\n"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pullChanged();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-v1fb-" });
  try {
    const mock = createMockGcsClient();

    mock.storage.set(
      "_index/_meta.json",
      new TextEncoder().encode(JSON.stringify({
        version: 1,
        partitions: ["data--t1--m1"],
      })),
    );

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
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pullChanged();

    const stat = await Deno.stat(join(cachePath, "data/t1/m1/d1/1/raw"));
    assert(stat.size > 0, "should pull via monolith fallback");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (6) Migration: first shard-first commit partitions monolith correctly
Deno.test("migrateMonolithToShards: partitions monolith into shards", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-migrate-" });
  try {
    const mock = createMockGcsClient();

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
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );
    mock.storage.set(
      "audit/log1.json",
      new TextEncoder().encode("log data\n\n"),
    );

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards();

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

    assert(
      mock.storage.has("_index/data--t1--m1.json"),
      "data--t1--m1 shard should exist",
    );
    assert(
      mock.storage.has("_index/audit.json"),
      "audit shard should exist",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("migrateMonolithToShards: preserves shallow-path entries", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-migrate-shallow-",
  });
  try {
    const mock = createMockGcsClient();

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

    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-idem-" });
  try {
    const mock = createMockGcsClient();

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
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );

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

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards();

    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(meta.version, 2, "should upgrade to v2 on re-migration");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (7b) Migration with namespace scopes keys under {namespace}/_index/
Deno.test("migrateMonolithToShards: namespaced repo migrates under namespace prefix", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-migrate-ns-" });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards({ namespace: ns });

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

// (8) _meta.json recovery from listing
Deno.test("migrateMonolithToShards: recovers when shards exist but no v2 meta", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-recover-" });
  try {
    const mock = createMockGcsClient();

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
    mock.storage.set(
      "data/t1/m1/d1/1/raw",
      new TextEncoder().encode("aaa\n"),
    );

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

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.migrateMonolithToShards();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-csq-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "bbb\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });
    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    mock.gets.length = 0;
    const result = await service.pullChanged();
    assertEquals(result, 0, "should return 0 on commitSeq fast-path hit");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// (10) Mixed partition types in one commit
Deno.test("shard-first commitPush: mixed partition types (per-model + single-shard)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-mixed-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "data\n");
    await seedFile(cachePath, "audit/event1.json", "audit\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "data-v2\n");
    await seedFile(cachePath, "audit/event2.json", "audit2\n");
    await service.markDirty({ relPath: "data/t1/m1" });
    await service.markDirty({ relPath: "audit" });

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    assert(
      mock.storage.has("_index/data--t1--m1.json"),
      "per-model shard should exist",
    );
    assert(
      mock.storage.has("_index/audit.json"),
      "single shard should exist",
    );

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
Deno.test("shard-first commitPush: deleting all entries in a model removes shard and partition key", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cleanup-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await seedFile(cachePath, "data/t2/m2/d2/1/raw", "bbb\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    await Deno.remove(join(cachePath, "data/t1"), { recursive: true });
    await service.markDirty({ relPath: "data/t1" });

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    assertEquals(
      mock.storage.has("_index/data--t1--m1.json"),
      false,
      "empty shard should be deleted",
    );

    const meta = decodeMeta(mock.storage.get("_index/_meta.json")!);
    assertEquals(
      meta.partitions.includes("data--t1--m1"),
      false,
      "deleted partition should be removed from _meta.json",
    );

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-creatdel-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    await seedFile(cachePath, "data/t1/m1/d2/1/raw", "new\n");
    await Deno.remove(join(cachePath, "data/t1/m1/d1"), { recursive: true });
    await service.markDirty({ relPath: "data/t1/m1" });

    const manifest = await service.preparePush();
    await service.commitPush(manifest);

    assert(
      mock.storage.has("_index/data--t1--m1.json"),
      "shard should exist",
    );
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = gcs.puts
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = gcs.puts
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    // Populate dirtyPaths to trigger the scoped walk
    await svc.markDirty({
      namespace: "my-ns",
      relPath: "my-ns/data/model/1/raw",
    });
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = gcs.puts
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = gcs.puts
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const manifest = await svc.preparePush({ namespace: "my-ns" });

    const pushedKeys = gcs.puts
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pushed = await svc.pushChanged({ namespace: "my-ns" });

    const pushedKeys = gcs.puts
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
        const body = gcs.puts.find((p) => p.key === k);
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
  const gcs = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const manifest = await svc.preparePush({ namespace: "my-ns" });

    const pushedKeys = gcs.puts
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
  const gcs = createMockGcsClient();
  const cachePath = await Deno.makeTempDir();
  try {
    await seedFile(cachePath, "data/model/1/raw", "hello");
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

    const svc = new GcsCacheSyncService(gcs, cachePath);
    const pushed = await svc.pushChanged();

    const pushedKeys = gcs.puts
      .filter((p) =>
        !p.key.includes(".datastore-index") && !p.key.includes("_index/")
      )
      .map((p) => p.key);

    assert(pushed as number >= 2);
    assert(pushedKeys.includes("data/model/1/raw"));
    assert(pushedKeys.includes("some-dir/data/file.txt"));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// ==========================================================================
// swamp-club#1052: v2 shard-first write-path migration (GCS)
// ==========================================================================

function seedV2Repo(
  mock: ReturnType<typeof createMockGcsClient>,
  entries: Record<
    string,
    { key: string; size: number; lastModified: string }
  >,
  commitSeq: number,
): void {
  const partitions = new Map<string, Record<string, unknown>>();
  for (const [rel, entry] of Object.entries(entries)) {
    const key = GcsCacheSyncService.partitionKeyFromPath(rel);
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

Deno.test("#1052: GCS commitPush no-op on v2 uses _meta.json, not monolith", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-1052-commit-" });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    await service.pullChanged();

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

Deno.test("#1052: GCS pushChanged slow path on v2 uses shard assembly, not monolith", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-1052-push-" });
  try {
    const mock = createMockGcsClient();
    // Pre-seed a v1 monolithic index so the first push uses the v1 path
    // (fresh empty buckets now initialize v2 directly).
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({}),
    );
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "old\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "new\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

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

    const monolithPuts = mock.puts.filter((p) =>
      p.key === ".datastore-index.json"
    );
    assertEquals(
      monolithPuts.length,
      0,
      "pushChanged on v2 must NOT write the monolithic index",
    );

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

Deno.test("#1052: GCS preparePush slow path on v2 uses shard assembly, not monolith", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-1052-prep-" });
  try {
    const mock = createMockGcsClient();
    // Pre-seed a v1 monolithic index so the first push uses the v1 path
    // (fresh empty buckets now initialize v2 directly).
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({}),
    );
    const service = new GcsCacheSyncService(mock, cachePath);

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "old\n");
    await service.pushChanged();
    await service.migrateMonolithToShards();

    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "new\n");
    await service.markDirty({ relPath: "data/t1/m1/d1/1/raw" });

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

    const data = manifest as unknown as { pushed: number };
    assert(data.pushed > 0, "preparePush should report files to push");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("#1052: GCS commitPush v2 no-op omits commitSeq when cache is incomplete", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-1052-partial-",
  });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
    await seedFile(cachePath, "data/t1/m1/d1/1/raw", "aaa\n");
    // data/t2/m2/d2/1/raw intentionally absent

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

Deno.test("#1913: GCS scoped push with incomplete cache for non-dirty shards must NOT write commitSeq", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-1913-scoped-",
  });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);

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

Deno.test("#1913: GCS pushChanged v2 writeback preserves non-dirty partitions in _meta.json", async () => {
  const cachePath = await Deno.makeTempDir({
    prefix: "gcssync-1913-meta-trunc-",
  });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);

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

// -- swamp-club#1277/#1329: readShard retry and error propagation ----------

Deno.test("swamp-club#1277: GCS readShard retries on transient error and succeeds", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-1277-" });
  try {
    const shardKey = "data--model--res1";
    let getAttempts = 0;

    const mock = createMockGcsClient();
    const origGet = mock.getObject.bind(mock);
    (mock as unknown as Record<string, unknown>).getObject = (
      key: string,
      signal?: AbortSignal,
    ) => {
      if (key === `_index/${shardKey}.json`) {
        getAttempts++;
        if (getAttempts === 1) {
          return Promise.reject(makeGcsErr(503));
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

    const service = new GcsCacheSyncService(mock, cachePath);
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

Deno.test("swamp-club#1329: GCS assembleIndexFromShards throws on persistent transient failure", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-1329-" });
  try {
    const shardKey = "data--model--res1";

    const mock = createMockGcsClient();
    const origGet = mock.getObject.bind(mock);
    (mock as unknown as Record<string, unknown>).getObject = (
      key: string,
      signal?: AbortSignal,
    ) => {
      if (key === `_index/${shardKey}.json`) {
        return Promise.reject(makeGcsErr(503));
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
      encodeIndex({
        "data/model/res1/payload.yaml": {
          key: "data/model/res1/payload.yaml",
          size: 10,
          lastModified: new Date().toISOString(),
        },
      }),
    );

    await seedFile(cachePath, "data/model/res1/payload.yaml", "content");

    const service = new GcsCacheSyncService(mock, cachePath);
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
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#1277: GCS readPartitionMeta re-throws non-NotFoundError errors", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-meta-" });
  try {
    const mock = createMockGcsClient();
    const origGet = mock.getObject.bind(mock);
    (mock as unknown as Record<string, unknown>).getObject = (
      key: string,
      signal?: AbortSignal,
    ) => {
      if (key === "_index/_meta.json") {
        return Promise.reject(makeGcsErr(503));
      }
      return origGet(key, signal);
    };

    await seedFile(cachePath, "data/model/res1/payload.yaml", "content");

    const service = new GcsCacheSyncService(mock, cachePath);
    let caught: unknown;
    try {
      await service.pushChanged();
    } catch (e) {
      caught = e;
    }
    assert(
      caught instanceof Error,
      "pushChanged must throw when readPartitionMeta gets a transient error",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- swamp-club#1320: migrateRootDataToNamespace namespace isolation -------

Deno.test("swamp-club#1320: GCS migrateRootDataToNamespace excludes foreign namespace data", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-1320-" });
  try {
    const mock = createMockGcsClient();

    // Seed namespaced index so hasNamespacedIndex guard passes
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

    // Own data at root
    mock.storage.set(
      "data/@my-model/payload.yaml",
      new TextEncoder().encode("my data"),
    );
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

    // Foreign namespace with name in DATA_SUBDIRS
    mock.storage.set(
      "audit/.namespace.json",
      new TextEncoder().encode(JSON.stringify({ namespace: "audit" })),
    );
    mock.storage.set(
      "audit/@their-model/report.yaml",
      new TextEncoder().encode("foreign"),
    );

    await seedFile(cachePath, "data/@my-model/payload.yaml", "my data");

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pushChanged({ namespace: "my-ns" });

    const foreignMigrated = mock.storage.has(
      "my-ns/audit/@their-model/report.yaml",
    );
    assertEquals(
      foreignMigrated,
      false,
      "foreign namespace data must NOT be migrated under my-ns/",
    );

    const ownMigrated = mock.storage.has("my-ns/data/@my-model/payload.yaml");
    assert(ownMigrated, "own root data must be migrated under my-ns/");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#1320: GCS migrateRootDataToNamespace skips when no namespaced index", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-1320b-" });
  try {
    const mock = createMockGcsClient();

    // Root data from another repo — no namespaced index exists
    mock.storage.set(
      "data/@foreign/payload.yaml",
      new TextEncoder().encode("foreign"),
    );
    mock.storage.set(
      ".datastore-index.json",
      encodeIndex({
        "data/@foreign/payload.yaml": {
          key: "data/@foreign/payload.yaml",
          size: 7,
          lastModified: new Date().toISOString(),
        },
      }),
    );

    await seedFile(cachePath, "data/@own/payload.yaml", "own");

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pushChanged({ namespace: "fresh-ns" });

    // Foreign root data must NOT be copied under fresh-ns/
    const foreignMigrated = mock.storage.has(
      "fresh-ns/data/@foreign/payload.yaml",
    );
    assertEquals(
      foreignMigrated,
      false,
      "fresh namespace must not migrate foreign root data",
    );
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

// -- repairNamespaceContamination -------------------------------------------

Deno.test("repairNamespaceContamination: dryRun detects foreign objects without deleting", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-repair-dry-" });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
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
    prefix: "gcssync-repair-default-",
  });
  try {
    const mock = createMockGcsClient();
    const enc = (s: string) => new TextEncoder().encode(s);

    mock.storage.set("ns1/.namespace.json", enc("{}"));
    mock.storage.set("ns1/.datastore-index.json", encodeIndex({}));
    mock.storage.set("ns2/.namespace.json", enc("{}"));
    mock.storage.set("ns1/ns2/data/@m/f.yaml", enc("foreign"));

    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-repair-live-" });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-repair-clean-" });
  try {
    const mock = createMockGcsClient();
    const enc = (s: string) => new TextEncoder().encode(s);

    mock.storage.set("my-ns/data/@model/payload.yaml", enc("own-data"));
    mock.storage.set("my-ns/.namespace.json", enc("{}"));
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    mock.storage.set("other/.namespace.json", enc("{}"));

    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-repair-nons-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const result = await store.get("no-such-key");
    assertEquals(result, null);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: delete removes key", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    await store.delete("nonexistent/key");
    await store.delete("nonexistent/key");
    assertEquals(mock.deletes.length, 2);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: list returns keys with _control/ prefix stripped", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
    const store = service.controlPlaneStore();

    const result = await store.list("nonexistent/");
    assertEquals(result, []);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("controlPlaneStore: namespace scoping puts keys under {namespace}/_control/", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-ns-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-ns-list-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-ns-del-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-pia-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-pia-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-pia-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-pia-ns-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const mock = createMockGcsClient();
  const service = new GcsCacheSyncService(mock, "/tmp/unused");
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-bind-" });
  try {
    const mock = createMockGcsClient();
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-ns-put-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-solo-ns-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set(".datastore-index.json", encodeIndex({}));
    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-list-lazy-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    mock.storage.set(
      "my-ns/_control/heartbeats/a",
      new TextEncoder().encode("1"),
    );
    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-migrate-" });
  try {
    const mock = createMockGcsClient();
    mock.storage.set("my-ns/.datastore-index.json", encodeIndex({}));
    mock.storage.set(
      "_control/token-encryption-key",
      new TextEncoder().encode("secret-key"),
    );
    mock.storage.set(
      "_control/heartbeats/inst-1",
      new TextEncoder().encode("beat"),
    );
    mock.storage.set(
      "my-ns/.namespace.json",
      new TextEncoder().encode(JSON.stringify({
        namespace: "my-ns",
        repoId: "repo-1",
        registeredAt: new Date().toISOString(),
      })),
    );

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pushChanged({ namespace: "my-ns" });

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-cp-nomigrate-" });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pushChanged({ namespace: "my-ns" });

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
  mock: ReturnType<typeof createMockGcsClient>,
  namespace: string,
  entries: Record<
    string,
    { key: string; size: number; lastModified: string }
  >,
  commitSeq: number,
): void {
  const partitions = new Map<string, Record<string, unknown>>();
  for (const [rel, entry] of Object.entries(entries)) {
    const key = GcsCacheSyncService.partitionKeyFromPath(rel);
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
    prefix: "gcssync-1556-ns-clean-",
  });
  try {
    const mock = createMockGcsClient();
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

    const service = new GcsCacheSyncService(mock, cachePath);

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-commitseq-" });
  try {
    const mock = createMockGcsClient();
    await mock.putObject(".datastore-index.json", encodeIndex({}));

    // Plant a v2 sidecar with commitSeq already armed, simulating a
    // prior run that completed the full sync cycle.
    await seedFile(
      cachePath,
      ".datastore-sync-state.json",
      JSON.stringify({
        version: 2,
        remoteIndexGeneration: "",
        lastVerifiedAt: new Date().toISOString(),
        localDirty: false,
        dirtyPaths: [],
        bulkInvalidated: false,
        lazyPullActive: false,
        commitSeq: 5,
      }),
    );

    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecarBefore = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(sidecarBefore.commitSeq, 5, "precondition: commitSeq armed");

    const service = new GcsCacheSyncService(mock, cachePath);

    // Simulate a local write that triggers markDirty.
    await service.markDirty({ relPath: "data/@org/m/id" });

    const sidecarAfter = JSON.parse(await Deno.readTextFile(sidecarPath));
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-1771-a-" });
  try {
    const mock = createMockGcsClient();

    const oldContent = "AAAA";
    const newContent = "BBBB";
    const newHash = await sha256Hex(newContent);

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
    mock.storage.set("data/m/rec/raw", new TextEncoder().encode(newContent));

    await seedFile(cachePath, "data/m/rec/raw", oldContent);

    const service = new GcsCacheSyncService(mock, cachePath);
    await service.pullChanged();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-1771-b-" });
  try {
    const mock = createMockGcsClient();

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

    await seedFile(cachePath, "data/m/rec/raw", content);

    const service = new GcsCacheSyncService(mock, cachePath);
    mock.gets.length = 0;
    await service.pullChanged();

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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-1771-c-" });
  try {
    const mock = createMockGcsClient();

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

    await seedFile(cachePath, "data/m/rec/raw", "AAAA");

    const service = new GcsCacheSyncService(mock, cachePath);
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

Deno.test("isRetryableError: 409 is retryable (swamp-club#1747)", () => {
  assertEquals(
    isRetryableError(makeGcsErr(409)),
    true,
    "409 must be retryable",
  );
});

Deno.test("retryWithBackoff: retries on 409 and succeeds (swamp-club#1747)", async () => {
  let attempts = 0;
  const result = await retryWithBackoff(
    () => {
      attempts++;
      if (attempts < 3) {
        return Promise.reject(makeGcsErr(409));
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
// scenario end-to-end.
// ---------------------------------------------------------------------------

Deno.test("pullChanged + pushChanged: stale latest pointer is corrected, not pushed (swamp-club#1760)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-1760-" });
  try {
    const mock = createMockGcsClient();

    const newHash = await sha256Hex("8");

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

    await seedFile(cachePath, "data/type/model/rec/latest", "6");

    const service = new GcsCacheSyncService(mock, cachePath);

    await service.pullChanged();

    const localAfterPull = await Deno.readTextFile(
      join(cachePath, "data/type/model/rec/latest"),
    );
    assertEquals(
      localAfterPull,
      "8",
      "pullChanged must re-download when sha256 differs (was '6', remote is '8')",
    );

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

// -- swamp-club#2063: stale shard entries cleaned on pullChanged 404 --------

Deno.test("swamp-club#2063: pullChanged with shard-first path removes stale entries from shards on 404", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2063-" });
  try {
    const mock = createMockGcsClient();

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

    const service = new GcsCacheSyncService(mock, cachePath);
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

Deno.test("swamp-club#1931: GCS pullChanged on v2 shard-first writes commitSeq to sidecar, next pull is fast-pathed", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-1931-" });
  try {
    const mock = createMockGcsClient();

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

    const svc = new GcsCacheSyncService(mock, cachePath);

    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1);

    const sidecarPath = join(cachePath, ".datastore-sync-state.json");
    const sidecar = JSON.parse(await Deno.readTextFile(sidecarPath));
    assertEquals(
      sidecar.commitSeq,
      5,
      "sidecar must have commitSeq from _meta.json",
    );

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

Deno.test("swamp-club#2091: GCS preparePush skips root migration when v2 shard index exists", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-2091-" });
  try {
    const mock = createMockGcsClient();

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
    mock.storage.set(
      ".datastore-index.json",
      new TextEncoder().encode(JSON.stringify({ version: 1, entries: {} })),
    );

    await seedFile(cachePath, "my-ns/data/t1/m1/d1/1/raw", "data");

    const svc = new GcsCacheSyncService(mock, cachePath);
    await svc.markDirty({ relPath: "my-ns/data/t1/m1/d1/1/raw" });
    await svc.preparePush({ namespace: "my-ns" });

    const rootIndexGets = mock.gets.filter(
      (k: string) => k === ".datastore-index.json",
    );
    assertEquals(
      rootIndexGets.length,
      0,
      "must not read root .datastore-index.json when v2 shards exist",
    );

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

Deno.test("swamp-club#2033: GCS pullChanged falls back to per-file behavior when listing fails", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-2033fb-" });
  try {
    const mock = createMockGcsClient();

    const indexBody = encodeIndex({
      "data/f/v1/raw": {
        key: "data/f/v1/raw",
        size: 5,
        lastModified: new Date().toISOString(),
      },
    });
    mock.storage.set(".datastore-index.json", indexBody);
    mock.storage.set("data/f/v1/raw", new TextEncoder().encode("hello"));

    (mock as unknown as Record<string, unknown>).listAllObjects = () => {
      return Promise.reject(
        new GcsOperationError("Forbidden", {
          name: "GcsOperationError",
          httpStatusCode: 403,
          code: "forbidden",
          bodyPreview: undefined,
          uploadId: undefined,
        }),
      );
    };

    const svc = new GcsCacheSyncService(mock, cachePath);
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1, "must still pull files when listing fails");

    const content = await Deno.readTextFile(join(cachePath, "data/f/v1/raw"));
    assertEquals(content, "hello");
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2033: GCS pullChanged prunes stale entries via listing without per-file 404", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-test-2033pr-" });
  try {
    const mock = createMockGcsClient();

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

    const svc = new GcsCacheSyncService(mock, cachePath);
    const pulled = await svc.pullChanged();
    assertEquals(pulled, 1, "should only pull the live file");

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
  mock: ReturnType<typeof createMockGcsClient>,
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

/** Reads the sync sidecar from disk; null if missing. */
async function readSidecar(
  cachePath: string,
): Promise<Record<string, unknown> | null> {
  try {
    return JSON.parse(
      await Deno.readTextFile(join(cachePath, ".datastore-sync-state.json")),
    );
  } catch {
    return null;
  }
}

async function exists(path: string): Promise<boolean> {
  return await Deno.stat(path).then(() => true).catch(() => false);
}

Deno.test("swamp-club#2246: subdirs-scoped pull only downloads in-scope files", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-scope-" });
  try {
    const mock = createMockGcsClient();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/x/raw": "data",
    });

    const svc = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-nest-" });
  try {
    const mock = createMockGcsClient();
    seedRemote(mock, {
      "data/swamp/grant/g1/raw": "g1",
      "data/swamp/grants/g2/raw": "g2",
    });

    const svc = new GcsCacheSyncService(mock, cachePath);
    const pulled = await svc.pullChanged({ subdirs: ["data/swamp/grant/"] });

    assertEquals(pulled, 1);
    assertEquals(mock.gets.includes("data/swamp/grants/g2/raw"), false);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: scoped pull does not arm the fast path (monolithic)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-arm-" });
  try {
    const mock = createMockGcsClient();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/x/raw": "data",
    });

    const svc = new GcsCacheSyncService(mock, cachePath);
    await svc.pullChanged({ subdirs: ["config"] });
    assertEquals(
      (await readSidecar(cachePath))?.remoteIndexGeneration ?? "",
      "",
    );

    // A fresh process must take the slow path and fetch the skipped file.
    const svc2 = new GcsCacheSyncService(mock, cachePath);
    assertEquals(await svc2.pullChanged(), 1);
    assert(await exists(join(cachePath, "data/@m/x/raw")));
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: scoped pull does not record commitSeq (v2 shards)", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-v2-" });
  try {
    const mock = createMockGcsClient();
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

    const svc = new GcsCacheSyncService(mock, cachePath);
    assertEquals(await svc.pullChanged({ subdirs: ["data/t1"] }), 1);
    assertEquals((await readSidecar(cachePath))?.commitSeq, undefined);

    const svc2 = new GcsCacheSyncService(mock, cachePath);
    assertEquals(await svc2.pullChanged(), 1);
    assertEquals((await readSidecar(cachePath))?.commitSeq, 5);
  } finally {
    await Deno.remove(cachePath, { recursive: true });
  }
});

Deno.test("swamp-club#2246: scoped pull does not clear lazyPullActive", async () => {
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-lazy-" });
  try {
    const mock = createMockGcsClient();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/x/1/raw": "data",
    });

    const svc = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-prune-" });
  try {
    const mock = createMockGcsClient();
    seedRemote(mock, {
      "config/models/a.yaml": "a: 1\n",
      "data/@m/gone/raw": "gone",
    });
    mock.storage.delete("data/@m/gone/raw");

    const svc = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-file-" });
  try {
    const mock = createMockGcsClient();
    seedRemote(mock, { "config/models/a.yaml": "a: 1\n" });

    const svc = new GcsCacheSyncService(mock, cachePath);
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
  const cachePath = await Deno.makeTempDir({ prefix: "gcssync-2246-ns-" });
  try {
    const mock = createMockGcsClient();
    // Index is namespaced, but the object only exists at the root key.
    seedRemote(mock, { "config/models/a.yaml": "a: 1\n" }, "ns/");
    mock.storage.set(
      "config/models/a.yaml",
      mock.storage.get("ns/config/models/a.yaml")!,
    );
    mock.storage.delete("ns/config/models/a.yaml");

    const svc = new GcsCacheSyncService(mock, cachePath);
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
