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

import {
  assertEquals,
  assertRejects,
  assertStringIncludes,
} from "jsr:@std/assert@1.0.19";
import {
  type ClientConfig,
  listModels,
  parseRetryAfter,
  previewBody,
  requestJson,
  retryDelayMs,
  systemOne,
  TypeSafeApiError,
} from "./client.ts";

function config(
  fetchImpl: typeof fetch,
  overrides: Partial<ClientConfig> = {},
): ClientConfig {
  return {
    apiKey: "test-key",
    baseUrl: "https://api.example.com/",
    timeoutMs: 1_000,
    maxRetries: 2,
    fetch: fetchImpl,
    sleep: () => Promise.resolve(),
    ...overrides,
  };
}

Deno.test("systemOne posts the request and parses answers", async () => {
  const seen: { url?: string; init?: RequestInit } = {};
  const fetchImpl: typeof fetch = (input, init) => {
    seen.url = String(input);
    seen.init = init;
    return Promise.resolve(Response.json({
      model: "jev-latest",
      answers: { urgent: { type: "noul", noul: 0.91 } },
      usage: { input_tokens: 10, output_tokens: 2 },
    }));
  };
  const result = await systemOne(config(fetchImpl), {
    state: "Help!",
    model: "jev-latest",
    questions: { urgent: { type: "noul", instructions: "Is it urgent?" } },
  });
  assertEquals(seen.url, "https://api.example.com/v1/systemone");
  assertEquals(seen.init?.method, "POST");
  const headers = seen.init?.headers as Record<string, string>;
  assertEquals(headers.Authorization, "Bearer test-key");
  assertEquals(headers["Content-Type"], "application/json");
  assertEquals(JSON.parse(seen.init?.body as string).state, "Help!");
  assertEquals(result.answers.urgent, { type: "noul", noul: 0.91 });
});

Deno.test("systemOne rejects a response missing an answer", async () => {
  const fetchImpl: typeof fetch = () =>
    Promise.resolve(Response.json({
      model: "jev-latest",
      answers: {},
      usage: { input_tokens: 1, output_tokens: 1 },
    }));
  await assertRejects(
    () =>
      systemOne(config(fetchImpl), {
        state: "x",
        model: "jev-latest",
        questions: { a: { type: "noul", instructions: "?" } },
      }),
    Error,
    "missing answers for: a",
  );
});

Deno.test("systemOne rejects a malformed response body", async () => {
  const fetchImpl: typeof fetch = () =>
    Promise.resolve(Response.json({ answers: "nope" }));
  await assertRejects(
    () =>
      systemOne(config(fetchImpl), {
        state: "x",
        model: "jev-latest",
        questions: { a: { type: "noul", instructions: "?" } },
      }),
    Error,
    "unexpected response shape",
  );
});

Deno.test("requestJson surfaces 4xx errors with status and body", async () => {
  const fetchImpl: typeof fetch = () =>
    Promise.resolve(
      new Response(JSON.stringify({ detail: "bad key" }), { status: 401 }),
    );
  const err = await assertRejects(
    () => requestJson(config(fetchImpl), "GET", "/v1/models", "model listing"),
    TypeSafeApiError,
    "HTTP 401",
  );
  assertEquals(err.status, 401);
  assertStringIncludes(err.message, "bad key");
});

Deno.test("requestJson retries 429 then succeeds", async () => {
  let calls = 0;
  const fetchImpl: typeof fetch = () => {
    calls++;
    if (calls === 1) {
      return Promise.resolve(
        new Response("slow down", {
          status: 429,
          headers: { "retry-after": "0" },
        }),
      );
    }
    return Promise.resolve(Response.json({ ok: true }));
  };
  const result = await requestJson(
    config(fetchImpl),
    "GET",
    "/v1/models",
    "model listing",
  );
  assertEquals(result, { ok: true });
  assertEquals(calls, 2);
});

Deno.test("requestJson stops retrying after maxRetries", async () => {
  let calls = 0;
  const fetchImpl: typeof fetch = () => {
    calls++;
    return Promise.resolve(new Response("overloaded", { status: 529 }));
  };
  await assertRejects(
    () =>
      requestJson(
        config(fetchImpl, { maxRetries: 1 }),
        "GET",
        "/v1/models",
        "model listing",
      ),
    TypeSafeApiError,
    "HTTP 529",
  );
  assertEquals(calls, 2);
});

Deno.test("requestJson retries connection failures", async () => {
  let calls = 0;
  const fetchImpl: typeof fetch = () => {
    calls++;
    if (calls === 1) return Promise.reject(new TypeError("connection refused"));
    return Promise.resolve(Response.json({ models: [] }));
  };
  const models = await listModels(config(fetchImpl));
  assertEquals(models, []);
  assertEquals(calls, 2);
});

Deno.test("requestJson does not retry after a user abort", async () => {
  const controller = new AbortController();
  let calls = 0;
  const fetchImpl: typeof fetch = () => {
    calls++;
    controller.abort(new Error("user cancelled"));
    return Promise.reject(new TypeError("aborted"));
  };
  await assertRejects(
    () =>
      requestJson(
        config(fetchImpl, { signal: controller.signal }),
        "GET",
        "/v1/models",
        "model listing",
      ),
    Error,
    "user cancelled",
  );
  assertEquals(calls, 1);
});

Deno.test("parseRetryAfter handles ms, seconds, and dates", () => {
  assertEquals(parseRetryAfter(new Headers({ "retry-after-ms": "250" })), 250);
  assertEquals(parseRetryAfter(new Headers({ "retry-after": "2" })), 2000);
  const now = Date.parse("2026-01-01T00:00:00Z");
  assertEquals(
    parseRetryAfter(
      new Headers({ "retry-after": "Thu, 01 Jan 2026 00:00:05 GMT" }),
      now,
    ),
    5000,
  );
  assertEquals(parseRetryAfter(new Headers()), undefined);
});

Deno.test("retryDelayMs prefers Retry-After and caps backoff", () => {
  assertEquals(retryDelayMs(0, new Headers({ "retry-after": "1" })), 1000);
  assertEquals(retryDelayMs(0, undefined, () => 0), 500);
  assertEquals(retryDelayMs(10, undefined, () => 0), 5000);
  // A huge Retry-After falls back to backoff.
  assertEquals(
    retryDelayMs(0, new Headers({ "retry-after": "3600" }), () => 0),
    500,
  );
});

Deno.test("previewBody flattens and truncates", () => {
  assertEquals(previewBody(""), "(empty body)");
  assertEquals(previewBody({ a: 1 }), '{"a":1}');
  assertEquals(previewBody("x".repeat(600)).length, 501);
});
