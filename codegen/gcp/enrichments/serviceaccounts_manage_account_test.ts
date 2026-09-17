import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/iam/extensions/models/serviceaccounts.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const SA_RESPONSE = {
  name:
    "projects/test-project/serviceAccounts/my-sa@test-project.iam.gserviceaccount.com",
  projectId: "test-project",
  uniqueId: "112233445566778899",
  email: "my-sa@test-project.iam.gserviceaccount.com",
  displayName: "My SA",
  description: "test account",
  disabled: false,
  oauth2ClientId: "998877665544",
};

interface MockServerState {
  requests: Array<{ method: string; path: string; body?: unknown }>;
}

function createMockIamServer(
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
    state.requests.push({ method: req.method, path: url.pathname, body });
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
      modelType: "@swamp/gcp/iam/serviceaccounts",
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
  name: "manage_account: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name: "manage_account: create-new — GET 404, POST 200",
  sanitizeResources: false,
  async fn() {
    const server = createMockIamServer((req) => {
      const url = new URL(req.url);
      if (req.method === "GET" && url.pathname.includes("serviceAccounts/")) {
        return new Response(JSON.stringify({ error: { code: 404 } }), {
          status: 404,
        });
      }
      if (req.method === "POST" && url.pathname.includes("serviceAccounts")) {
        return new Response(JSON.stringify(SA_RESPONSE), { status: 200 });
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
        accountId: "my-sa",
      });

      const result = await model.methods.manage_account.execute({}, context);
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get(
            "projects_test-project_serviceAccounts_my-sa@test-project.iam.gserviceaccount.com",
          )!,
        ),
      );
      assertEquals(stored.uniqueId, "112233445566778899");
      assertEquals(stored.email, SA_RESPONSE.email);

      assertEquals(server.state.requests.length, 2);
      assertEquals(server.state.requests[0].method, "GET");
      assertEquals(server.state.requests[1].method, "POST");
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
  name: "manage_account: adopt-existing — GET 200",
  sanitizeResources: false,
  async fn() {
    const server = createMockIamServer((req) => {
      if (req.method === "GET") {
        return new Response(JSON.stringify(SA_RESPONSE), { status: 200 });
      }
      return new Response("unexpected — should not create", { status: 500 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
        accountId: "my-sa",
      });

      const result = await model.methods.manage_account.execute({}, context);
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get(
            "projects_test-project_serviceAccounts_my-sa@test-project.iam.gserviceaccount.com",
          )!,
        ),
      );
      assertEquals(stored.uniqueId, "112233445566778899");

      assertEquals(server.state.requests.length, 1);
      assertEquals(server.state.requests[0].method, "GET");
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
  name: "manage_account: 409-recovery — GET 404, POST 409, re-GET 200",
  sanitizeResources: false,
  async fn() {
    let getCount = 0;
    const server = createMockIamServer((req) => {
      const url = new URL(req.url);
      if (req.method === "GET" && url.pathname.includes("serviceAccounts/")) {
        getCount++;
        if (getCount === 1) {
          return new Response(JSON.stringify({ error: { code: 404 } }), {
            status: 404,
          });
        }
        return new Response(JSON.stringify(SA_RESPONSE), { status: 200 });
      }
      if (req.method === "POST") {
        return new Response(
          JSON.stringify({ error: { code: 409, message: "already exists" } }),
          { status: 409 },
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
        accountId: "my-sa",
      });

      const result = await model.methods.manage_account.execute({}, context);
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get(
            "projects_test-project_serviceAccounts_my-sa@test-project.iam.gserviceaccount.com",
          )!,
        ),
      );
      assertEquals(stored.uniqueId, "112233445566778899");

      assertEquals(server.state.requests.length, 3);
      assertEquals(server.state.requests[0].method, "GET");
      assertEquals(server.state.requests[1].method, "POST");
      assertEquals(server.state.requests[2].method, "GET");
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
    "manage_account: 403-rejection — permission denied not treated as absence",
  sanitizeResources: false,
  async fn() {
    const server = createMockIamServer(() => {
      return new Response(
        "Access denied: caller does not have iam.serviceAccounts.get",
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
        accountId: "my-sa",
      });

      const err = await assertRejects(
        () => model.methods.manage_account.execute({}, context),
        Error,
      );
      assertEquals(err.message.includes("Permission denied"), true);
      assertEquals(err.message.includes("NOT a 'not found'"), true);

      assertEquals(server.state.requests.length, 1);
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
    "manage_account: 403 with non-JSON body — still throws permission error",
  sanitizeResources: false,
  async fn() {
    const server = createMockIamServer(() => {
      return new Response(
        "<html><body>403 Forbidden</body></html>",
        { status: 403, headers: { "content-type": "text/html" } },
      );
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
        accountId: "my-sa",
      });

      const err = await assertRejects(
        () => model.methods.manage_account.execute({}, context),
        Error,
      );
      assertEquals(err.message.includes("Permission denied"), true);
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
  name: "manage_account: missing accountId — throws clear error",
  sanitizeResources: false,
  async fn() {
    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context } = createMockContext({});

      const err = await assertRejects(
        () => model.methods.manage_account.execute({}, context),
        Error,
      );
      assertEquals(err.message.includes("accountId is required"), true);
    } finally {
      if (origToken !== undefined) Deno.env.set("GCP_ACCESS_TOKEN", origToken);
      else Deno.env.delete("GCP_ACCESS_TOKEN");
      if (origProject !== undefined) Deno.env.set("GCP_PROJECT", origProject);
      else Deno.env.delete("GCP_PROJECT");
    }
  },
});
