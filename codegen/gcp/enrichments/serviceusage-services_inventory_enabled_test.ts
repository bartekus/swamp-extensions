import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/serviceusage/extensions/models/services.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const SERVICE_A = {
  name: "projects/123/services/compute.googleapis.com",
  config: { name: "compute.googleapis.com", title: "Compute Engine API" },
  state: "ENABLED",
  parent: "projects/123",
};

const SERVICE_B = {
  name: "projects/123/services/storage.googleapis.com",
  config: { name: "storage.googleapis.com", title: "Cloud Storage API" },
  state: "ENABLED",
  parent: "projects/123",
};

const SERVICE_C = {
  name: "projects/123/services/bigquery.googleapis.com",
  config: { name: "bigquery.googleapis.com", title: "BigQuery API" },
  state: "ENABLED",
  parent: "projects/123",
};

interface MockServerState {
  requests: Array<{ method: string; path: string; query: string }>;
}

function createMockServer(
  handler: (
    req: Request,
    state: MockServerState,
  ) => Response | Promise<Response>,
): { port: number; close: () => Promise<void>; state: MockServerState } {
  const state: MockServerState = { requests: [] };
  const server = Deno.serve({ port: 0, onListen() {} }, (req) => {
    const url = new URL(req.url);
    state.requests.push({
      method: req.method,
      path: url.pathname,
      query: url.search,
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
      modelType: "@swamp/gcp/serviceusage/services",
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
  name: "inventory_enabled: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name: "inventory_enabled: full pagination — 2 pages",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      const pageToken = url.searchParams.get("pageToken");

      if (!pageToken) {
        return new Response(
          JSON.stringify({
            services: [SERVICE_A, SERVICE_B],
            nextPageToken: "page2",
          }),
          { status: 200 },
        );
      }
      return new Response(
        JSON.stringify({ services: [SERVICE_C] }),
        { status: 200 },
      );
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const result = await model.methods.inventory_enabled.execute(
        { parent: "projects/123" },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get("enabled_services_snapshot_projects_123")!,
        ),
      );
      assertEquals(stored.count, 3);
      assertEquals(stored.services.length, 3);
      assertEquals(stored.parent, "projects/123");
      assertEquals(typeof stored.fetchedAt, "string");

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
  name: "inventory_enabled: maxItems exceeded — throws explicit error",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer(() => {
      return new Response(
        JSON.stringify({
          services: [SERVICE_A, SERVICE_B, SERVICE_C],
        }),
        { status: 200 },
      );
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
          model.methods.inventory_enabled.execute(
            { parent: "projects/123", maxItems: 2 },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("exceeds maxItems"), true);
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

Deno.test({
  name: "inventory_enabled: empty result — persists zero-count snapshot",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer(() => {
      return new Response(JSON.stringify({}), { status: 200 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const result = await model.methods.inventory_enabled.execute(
        { parent: "projects/123" },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get("enabled_services_snapshot_projects_123")!,
        ),
      );
      assertEquals(stored.count, 0);
      assertEquals(stored.services.length, 0);
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
  name: "inventory_enabled: permission error — throws",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer(() => {
      return new Response(
        JSON.stringify({ error: { code: 403, message: "Permission denied" } }),
        { status: 403 },
      );
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      await assertRejects(
        () =>
          model.methods.inventory_enabled.execute(
            { parent: "projects/123" },
            context,
          ),
        Error,
        "403",
      );
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
      await server.close();
    }
  },
});
