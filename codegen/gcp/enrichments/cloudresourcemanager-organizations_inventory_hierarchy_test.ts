import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/cloudresourcemanager/extensions/models/organizations.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const FOLDER_A = {
  name: "folders/111",
  parent: "organizations/123456",
  displayName: "Engineering",
  state: "ACTIVE",
};

const FOLDER_B = {
  name: "folders/222",
  parent: "folders/111",
  displayName: "Backend",
  state: "ACTIVE",
};

const PROJECT_A = {
  name: "projects/proj-a",
  projectId: "proj-a",
  parent: "folders/111",
  state: "ACTIVE",
  labels: { team: "eng" },
};

const PROJECT_B = {
  name: "projects/proj-b",
  projectId: "proj-b",
  parent: "folders/222",
  state: "ACTIVE",
  labels: { team: "backend" },
};

const PROJECT_C = {
  name: "projects/proj-c",
  projectId: "proj-c",
  parent: "organizations/123456",
  state: "ACTIVE",
  labels: {},
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
      modelType: "@swamp/gcp/cloudresourcemanager/organizations",
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

// sanitizeResources: false because the gcp.ts module caches credentials
// and Deno.serve keeps a connection pool.
Deno.test({
  name: "inventory_hierarchy: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name: "inventory_hierarchy: simple org — 1 folder + 2 projects",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      const parentParam = url.searchParams.get("parent");

      if (url.pathname === "/v3/folders") {
        if (parentParam === "organizations/123456") {
          return new Response(
            JSON.stringify({ folders: [FOLDER_A] }),
            { status: 200 },
          );
        }
        return new Response(JSON.stringify({}), { status: 200 });
      }

      if (url.pathname === "/v3/projects") {
        if (parentParam === "organizations/123456") {
          return new Response(
            JSON.stringify({ projects: [PROJECT_C] }),
            { status: 200 },
          );
        }
        if (parentParam === "folders/111") {
          return new Response(
            JSON.stringify({ projects: [PROJECT_A] }),
            { status: 200 },
          );
        }
        return new Response(JSON.stringify({}), { status: 200 });
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

      const result = await model.methods.inventory_hierarchy.execute(
        { parent: "organizations/123456" },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get("hierarchy_snapshot_organizations_123456")!,
        ),
      );
      assertEquals(stored.totalNodes, 3);
      assertEquals(stored.folders.length, 1);
      assertEquals(stored.projects.length, 2);
      assertEquals(stored.coverage, "caller-visible");
      assertEquals(stored.folders[0].name, "folders/111");
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
  name: "inventory_hierarchy: deep nesting — org→folder→subfolder→project",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      const parentParam = url.searchParams.get("parent");

      if (url.pathname === "/v3/folders") {
        if (parentParam === "organizations/123456") {
          return new Response(
            JSON.stringify({ folders: [FOLDER_A] }),
            { status: 200 },
          );
        }
        if (parentParam === "folders/111") {
          return new Response(
            JSON.stringify({ folders: [FOLDER_B] }),
            { status: 200 },
          );
        }
        return new Response(JSON.stringify({}), { status: 200 });
      }

      if (url.pathname === "/v3/projects") {
        if (parentParam === "folders/222") {
          return new Response(
            JSON.stringify({ projects: [PROJECT_B] }),
            { status: 200 },
          );
        }
        return new Response(JSON.stringify({}), { status: 200 });
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

      const result = await model.methods.inventory_hierarchy.execute(
        { parent: "organizations/123456" },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get("hierarchy_snapshot_organizations_123456")!,
        ),
      );
      assertEquals(stored.totalNodes, 3);
      assertEquals(stored.folders.length, 2);
      assertEquals(stored.projects.length, 1);
      assertEquals(stored.folders[0].name, "folders/111");
      assertEquals(stored.folders[1].name, "folders/222");
      assertEquals(stored.projects[0].parent, "folders/222");
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
  name: "inventory_hierarchy: maxNodes exceeded — throws explicit error",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (url.pathname === "/v3/folders") {
        return new Response(
          JSON.stringify({ folders: [FOLDER_A, FOLDER_B] }),
          { status: 200 },
        );
      }
      if (url.pathname === "/v3/projects") {
        return new Response(JSON.stringify({}), { status: 200 });
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
          model.methods.inventory_hierarchy.execute(
            { parent: "organizations/123456", maxNodes: 1 },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("exceeds maxNodes"), true);
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
  name: "inventory_hierarchy: repeated token detection — throws",
  sanitizeResources: false,
  async fn() {
    let callCount = 0;
    const server = createMockServer((req) => {
      const url = new URL(req.url);

      if (url.pathname === "/v3/folders") {
        callCount++;
        return new Response(
          JSON.stringify({
            folders: callCount <= 2 ? [FOLDER_A] : [],
            nextPageToken: "stuck-token",
          }),
          { status: 200 },
        );
      }
      if (url.pathname === "/v3/projects") {
        return new Response(JSON.stringify({}), { status: 200 });
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
          model.methods.inventory_hierarchy.execute(
            { parent: "organizations/123456" },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("Repeated pagination token"), true);
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
  name: "inventory_hierarchy: permission error on folder listing — throws",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer(() => {
      return new Response(
        JSON.stringify({
          error: { code: 403, message: "Permission denied on resource" },
        }),
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
          model.methods.inventory_hierarchy.execute(
            { parent: "organizations/123456" },
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
