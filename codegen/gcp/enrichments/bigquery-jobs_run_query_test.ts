import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/bigquery/extensions/models/jobs.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const JOB_ID = "job_test_abc123";

const JOB_RUNNING = {
  jobReference: { projectId: "test-project", jobId: JOB_ID, location: "US" },
  status: { state: "RUNNING" },
};

const JOB_DONE = {
  jobReference: { projectId: "test-project", jobId: JOB_ID, location: "US" },
  status: { state: "DONE" },
};

const JOB_DONE_ERROR = {
  jobReference: { projectId: "test-project", jobId: JOB_ID, location: "US" },
  status: {
    state: "DONE",
    errorResult: {
      reason: "invalidQuery",
      message: "Syntax error in SQL query",
    },
  },
};

const RESULTS_PAGE_1 = {
  schema: {
    fields: [
      { name: "id", type: "INTEGER" },
      { name: "name", type: "STRING" },
    ],
  },
  rows: [
    { f: [{ v: "1" }, { v: "alice" }] },
    { f: [{ v: "2" }, { v: "bob" }] },
  ],
  totalRows: "3",
  pageToken: "page2",
};

const RESULTS_PAGE_2 = {
  rows: [{ f: [{ v: "3" }, { v: "charlie" }] }],
  totalRows: "3",
};

interface MockServerState {
  requests: Array<
    { method: string; path: string; query: string; body?: unknown }
  >;
}

function createMockServer(
  handler: (
    req: Request,
    state: MockServerState,
  ) => Response | Promise<Response>,
): { port: number; close: () => Promise<void>; state: MockServerState } {
  const state: MockServerState = { requests: [] };
  const server = Deno.serve({ port: 0, onListen() {} }, async (req) => {
    const url = new URL(req.url);
    let body: unknown = undefined;
    if (req.method === "POST" || req.method === "PUT") {
      try {
        body = await req.json();
      } catch { /* empty body is fine */ }
    }
    state.requests.push({
      method: req.method,
      path: url.pathname,
      query: url.search,
      body,
    });
    return handler(req, state);
  });
  const addr = server.addr as Deno.NetAddr;
  return {
    port: addr.port,
    close: () => server.shutdown(),
    state,
  };
}

function createMockContext(globalArgs: Record<string, unknown>) {
  const artifacts = new Map<string, Uint8Array>();
  return {
    context: {
      globalArgs,
      modelType: "@swamp/gcp/bigquery/jobs",
      modelId: "test-model",
      dataRepository: {
        getContent(
          _modelType: string,
          _modelId: string,
          instanceName: string,
        ): Uint8Array | null {
          return artifacts.get(instanceName) ?? null;
        },
      },
      writeResource(
        _type: string,
        instanceName: string,
        data: unknown,
      ): { type: string; name: string } {
        artifacts.set(
          instanceName,
          new TextEncoder().encode(JSON.stringify(data)),
        );
        return { type: "state", name: instanceName };
      },
    },
    artifacts,
  };
}

// Dynamic import so _lib/gcp.ts relative imports resolve correctly.
// sanitizeResources: false because the gcp.ts module caches credentials
// and Deno.serve keeps a connection pool.
Deno.test({
  name: "run_query: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name: "run_query: immediate completion — DONE on first response",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      // POST jobs — create and return DONE immediately
      if (req.method === "POST" && url.pathname.includes("/jobs")) {
        return new Response(JSON.stringify(JOB_DONE), { status: 200 });
      }

      // GET queries — return results (single page)
      if (req.method === "GET" && url.pathname.includes("/queries/")) {
        return new Response(
          JSON.stringify({
            schema: RESULTS_PAGE_1.schema,
            rows: RESULTS_PAGE_1.rows,
            totalRows: "2",
          }),
          { status: 200 },
        );
      }

      return new Response("unexpected", { status: 500 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const result = await model.methods.run_query.execute(
        { query: "SELECT 1", location: "US" },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get(`query_result_${JOB_ID}`)!,
        ),
      );
      assertEquals(stored.jobId, JOB_ID);
      assertEquals(stored.location, "US");
      assertEquals(stored.query, "SELECT 1");
      assertEquals(stored.rows.length, 2);
      assertEquals(typeof stored.fetchedAt, "string");
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
      await server.close();
    }
  },
});

Deno.test({
  name: "run_query: poll-then-complete — RUNNING then DONE",
  sanitizeResources: false,
  async fn() {
    let pollCount = 0;
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      // POST jobs — create, return RUNNING
      if (req.method === "POST" && url.pathname.includes("/jobs")) {
        return new Response(JSON.stringify(JOB_RUNNING), { status: 200 });
      }

      // GET jobs/{id} — poll status
      if (
        req.method === "GET" &&
        url.pathname.includes("/jobs/") &&
        !url.pathname.includes("/queries/")
      ) {
        pollCount++;
        if (pollCount < 2) {
          return new Response(JSON.stringify(JOB_RUNNING), { status: 200 });
        }
        return new Response(JSON.stringify(JOB_DONE), { status: 200 });
      }

      // GET queries — return results
      if (req.method === "GET" && url.pathname.includes("/queries/")) {
        return new Response(
          JSON.stringify({
            schema: RESULTS_PAGE_1.schema,
            rows: [RESULTS_PAGE_1.rows[0]],
            totalRows: "1",
          }),
          { status: 200 },
        );
      }

      return new Response("unexpected", { status: 500 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const result = await model.methods.run_query.execute(
        { query: "SELECT * FROM t" },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get(`query_result_${JOB_ID}`)!,
        ),
      );
      assertEquals(stored.totalRows, 1);
      assertEquals(stored.rows.length, 1);
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
      await server.close();
    }
  },
});

Deno.test({
  name: "run_query: query error — throws with reason and message",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      if (req.method === "POST") {
        return new Response(JSON.stringify(JOB_DONE_ERROR), { status: 200 });
      }
      return new Response("unexpected", { status: 500 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const err = await assertRejects(
        () =>
          model.methods.run_query.execute(
            { query: "SELECT BAD SYNTAX" },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("invalidQuery"), true);
      assertEquals(err.message.includes("Syntax error"), true);
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
      await server.close();
    }
  },
});

Deno.test({
  name: "run_query: result pagination — 2 pages of results",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (req.method === "POST" && url.pathname.includes("/jobs")) {
        return new Response(JSON.stringify(JOB_DONE), { status: 200 });
      }

      if (req.method === "GET" && url.pathname.includes("/queries/")) {
        const pageToken = url.searchParams.get("pageToken");
        if (!pageToken) {
          return new Response(JSON.stringify(RESULTS_PAGE_1), { status: 200 });
        }
        return new Response(JSON.stringify(RESULTS_PAGE_2), { status: 200 });
      }

      return new Response("unexpected", { status: 500 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const result = await model.methods.run_query.execute(
        { query: "SELECT * FROM users" },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get(`query_result_${JOB_ID}`)!,
        ),
      );
      assertEquals(stored.totalRows, 3);
      assertEquals(stored.rows.length, 3);
      assertEquals(stored.schema, RESULTS_PAGE_1.schema);
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
      await server.close();
    }
  },
});

Deno.test({
  name: "run_query: maxResults exceeded — throws explicit error",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (req.method === "POST" && url.pathname.includes("/jobs")) {
        return new Response(JSON.stringify(JOB_DONE), { status: 200 });
      }

      if (req.method === "GET" && url.pathname.includes("/queries/")) {
        return new Response(
          JSON.stringify({
            schema: RESULTS_PAGE_1.schema,
            rows: RESULTS_PAGE_1.rows,
            totalRows: "1000000",
          }),
          { status: 200 },
        );
      }

      return new Response("unexpected", { status: 500 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const err = await assertRejects(
        () =>
          model.methods.run_query.execute(
            { query: "SELECT * FROM huge_table", maxResults: 1 },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("exceeds maxResults"), true);
      assertEquals(err.message.includes("NOT persisted"), true);
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
      await server.close();
    }
  },
});
