import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/logging/extensions/models/sinks.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const SINK_RESPONSE = {
  name: "audit-sink",
  destination:
    "logging.googleapis.com/projects/my-project/locations/global/buckets/audit-bucket",
  filter: 'logName:"cloudaudit.googleapis.com"',
  includeChildren: true,
  writerIdentity:
    "serviceAccount:p123-456@gcp-sa-logging.iam.gserviceaccount.com",
  createTime: "2026-01-01T00:00:00Z",
  updateTime: "2026-01-01T00:00:00Z",
};

const ACTIVE_BUCKET = {
  name: "projects/my-project/locations/global/buckets/audit-bucket",
  lifecycleState: "ACTIVE",
  retentionDays: 30,
};

interface MockServerState {
  requests: Array<{
    method: string;
    path: string;
    query: string;
    body?: unknown;
  }>;
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
      modelType: "@swamp/gcp/logging/sinks",
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
  name: "ensure_audit_sink: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name: "ensure_audit_sink: create-new — bucket OK, sink 404, POST creates",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      // GET bucket — ACTIVE
      if (
        req.method === "GET" &&
        url.pathname.includes("/buckets/audit-bucket")
      ) {
        return new Response(JSON.stringify(ACTIVE_BUCKET), { status: 200 });
      }

      // GET sink — 404
      if (
        req.method === "GET" &&
        url.pathname.includes("/sinks/audit-sink")
      ) {
        return new Response(
          JSON.stringify({ error: { code: 404 } }),
          { status: 404 },
        );
      }

      // POST create sink
      if (req.method === "POST" && url.pathname.includes("/sinks")) {
        return new Response(JSON.stringify(SINK_RESPONSE), { status: 200 });
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

      const result = await model.methods.ensure_audit_sink.execute(
        {
          sinkId: "audit-sink",
          parent: "organizations/123",
          destination:
            "logging.googleapis.com/projects/my-project/locations/global/buckets/audit-bucket",
          filter: 'logName:"cloudaudit.googleapis.com"',
        },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get("organizations_123_sinks_audit-sink")!,
        ),
      );
      assertEquals(stored.name, "audit-sink");
      assertEquals(
        stored.writerIdentity,
        "serviceAccount:p123-456@gcp-sa-logging.iam.gserviceaccount.com",
      );

      // Bucket check, sink check, sink create
      assertEquals(server.state.requests.length, 3);
      assertEquals(server.state.requests[0].method, "GET"); // bucket
      assertEquals(server.state.requests[1].method, "GET"); // sink
      assertEquals(server.state.requests[2].method, "POST"); // create
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
  name: "ensure_audit_sink: adopt-existing — sink matches, no update needed",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (
        req.method === "GET" &&
        url.pathname.includes("/buckets/audit-bucket")
      ) {
        return new Response(JSON.stringify(ACTIVE_BUCKET), { status: 200 });
      }

      if (
        req.method === "GET" &&
        url.pathname.includes("/sinks/audit-sink")
      ) {
        return new Response(JSON.stringify(SINK_RESPONSE), { status: 200 });
      }

      // Should NOT reach here — no PUT expected
      return new Response("unexpected update or create", { status: 500 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const result = await model.methods.ensure_audit_sink.execute(
        {
          sinkId: "audit-sink",
          parent: "organizations/123",
          destination: SINK_RESPONSE.destination,
          filter: SINK_RESPONSE.filter,
          includeChildren: true,
        },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get("organizations_123_sinks_audit-sink")!,
        ),
      );
      assertEquals(stored.writerIdentity, SINK_RESPONSE.writerIdentity);

      // Only bucket check + sink read, no update
      assertEquals(server.state.requests.length, 2);
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
  name:
    "ensure_audit_sink: update-changed — sink exists with different filter, PUT updates",
  sanitizeResources: false,
  async fn() {
    const updatedSink = {
      ...SINK_RESPONSE,
      filter: 'logName:"new-filter"',
      updateTime: "2026-09-17T00:00:00Z",
    };

    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (
        req.method === "GET" &&
        url.pathname.includes("/buckets/audit-bucket")
      ) {
        return new Response(JSON.stringify(ACTIVE_BUCKET), { status: 200 });
      }

      if (
        req.method === "GET" &&
        url.pathname.includes("/sinks/audit-sink")
      ) {
        return new Response(JSON.stringify(SINK_RESPONSE), { status: 200 });
      }

      if (req.method === "PUT" && url.pathname.includes("/sinks/audit-sink")) {
        return new Response(JSON.stringify(updatedSink), { status: 200 });
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

      const result = await model.methods.ensure_audit_sink.execute(
        {
          sinkId: "audit-sink",
          parent: "organizations/123",
          destination: SINK_RESPONSE.destination,
          filter: 'logName:"new-filter"',
          includeChildren: true,
        },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get("organizations_123_sinks_audit-sink")!,
        ),
      );
      assertEquals(stored.filter, 'logName:"new-filter"');

      // Bucket check + sink read + PUT update
      assertEquals(server.state.requests.length, 3);
      assertEquals(server.state.requests[2].method, "PUT");
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
  name: "ensure_audit_sink: missing destination bucket — throws",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (
        req.method === "GET" &&
        url.pathname.includes("/buckets/")
      ) {
        return new Response(
          JSON.stringify({ error: { code: 404 } }),
          { status: 404 },
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
          model.methods.ensure_audit_sink.execute(
            {
              sinkId: "audit-sink",
              parent: "organizations/123",
              destination:
                "logging.googleapis.com/projects/my-project/locations/global/buckets/missing-bucket",
            },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("not found"), true);
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
  name: "ensure_audit_sink: non-ACTIVE destination — throws",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (
        req.method === "GET" &&
        url.pathname.includes("/buckets/")
      ) {
        return new Response(
          JSON.stringify({
            ...ACTIVE_BUCKET,
            lifecycleState: "DELETE_REQUESTED",
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
          model.methods.ensure_audit_sink.execute(
            {
              sinkId: "audit-sink",
              parent: "organizations/123",
              destination:
                "logging.googleapis.com/projects/my-project/locations/global/buckets/audit-bucket",
            },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("not ACTIVE"), true);
      assertEquals(err.message.includes("DELETE_REQUESTED"), true);
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
  name: "ensure_audit_sink: permission error on sink — throws 403",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (
        req.method === "GET" &&
        url.pathname.includes("/buckets/")
      ) {
        return new Response(JSON.stringify(ACTIVE_BUCKET), { status: 200 });
      }

      if (
        req.method === "GET" &&
        url.pathname.includes("/sinks/")
      ) {
        return new Response("Forbidden", { status: 403 });
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
          model.methods.ensure_audit_sink.execute(
            {
              sinkId: "audit-sink",
              parent: "organizations/123",
              destination:
                "logging.googleapis.com/projects/my-project/locations/global/buckets/audit-bucket",
            },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("Permission denied"), true);
      assertEquals(err.message.includes("403"), true);
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
      await server.close();
    }
  },
});
