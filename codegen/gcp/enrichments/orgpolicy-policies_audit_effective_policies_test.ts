import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/orgpolicy/extensions/models/policies.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const BOOLEAN_POLICY = {
  name: "projects/123/policies/constraints/compute.disableSerialPortAccess",
  spec: {
    etag: "abc123",
    rules: [{ enforce: true }],
  },
};

const LIST_POLICY = {
  name: "organizations/456/policies/constraints/compute.trustedImageProjects",
  spec: {
    etag: "def456",
    rules: [
      {
        values: {
          allowedValues: ["projects/trusted-images"],
          deniedValues: [],
        },
      },
    ],
  },
};

const CONDITIONAL_POLICY = {
  name: "folders/789/policies/constraints/iam.allowedPolicyMemberDomains",
  spec: {
    etag: "ghi789",
    rules: [
      {
        condition: {
          expression: "resource.matchTag('env', 'prod')",
          title: "prod-only",
        },
        values: { allowedValues: ["C0000000"] },
      },
      {
        values: { allowedValues: ["C0000000", "C1111111"] },
      },
    ],
  },
};

interface MockServerState {
  requests: Array<{ method: string; path: string }>;
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
    state.requests.push({ method: req.method, path: url.pathname });
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
      modelType: "@swamp/gcp/orgpolicy/policies",
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
  name: "audit_effective_policies: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name: "audit_effective_policies: mixed success and 404",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      if (url.pathname.includes("disableSerialPortAccess")) {
        return new Response(JSON.stringify(BOOLEAN_POLICY), { status: 200 });
      }
      if (url.pathname.includes("nonExistentConstraint")) {
        return new Response(
          JSON.stringify({ error: { code: 404, message: "Not found" } }),
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

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const result = await model.methods.audit_effective_policies.execute(
        {
          checks: [
            {
              resource: "projects/123",
              constraint: "constraints/compute.disableSerialPortAccess",
            },
            {
              resource: "projects/123",
              constraint: "constraints/nonExistentConstraint",
            },
          ],
        },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          [...artifacts.values()].find((v) =>
            JSON.parse(new TextDecoder().decode(v)).results !== undefined
          )!,
        ),
      );
      assertEquals(stored.count, 2);
      assertEquals(stored.results[0].status, "ok");
      assertEquals(stored.results[0].policy.spec.rules[0].enforce, true);
      assertEquals(stored.results[1].status, "no_policy");
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
  name:
    "audit_effective_policies: 403 rejection — permission denied not treated as absence",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer(() => {
      return new Response(
        JSON.stringify({
          error: {
            code: 403,
            message: "Permission denied on resource",
          },
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

      const err = await assertRejects(
        () =>
          model.methods.audit_effective_policies.execute(
            {
              checks: [
                {
                  resource: "projects/123",
                  constraint: "constraints/compute.disableSerialPortAccess",
                },
              ],
            },
            context,
          ),
        Error,
      );
      assertEquals(err.message.includes("Permission denied"), true);
      assertEquals(err.message.includes("permission error"), true);
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
    "audit_effective_policies: full PolicySpec preservation — conditional, boolean, list rules",
  sanitizeResources: false,
  async fn() {
    let callCount = 0;
    const server = createMockServer(() => {
      callCount++;
      if (callCount === 1) {
        return new Response(JSON.stringify(BOOLEAN_POLICY), { status: 200 });
      }
      if (callCount === 2) {
        return new Response(JSON.stringify(LIST_POLICY), { status: 200 });
      }
      return new Response(JSON.stringify(CONDITIONAL_POLICY), { status: 200 });
    });

    const origToken = Deno.env.get("GCP_ACCESS_TOKEN");
    const origProject = Deno.env.get("GCP_PROJECT");
    try {
      Deno.env.set("GCP_ACCESS_TOKEN", "test-token");
      Deno.env.set("GCP_PROJECT", "test-project");

      const { context, artifacts } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      await model.methods.audit_effective_policies.execute(
        {
          checks: [
            {
              resource: "projects/123",
              constraint: "constraints/compute.disableSerialPortAccess",
            },
            {
              resource: "organizations/456",
              constraint: "constraints/compute.trustedImageProjects",
            },
            {
              resource: "folders/789",
              constraint: "constraints/iam.allowedPolicyMemberDomains",
            },
          ],
        },
        context,
      );

      const stored = JSON.parse(
        new TextDecoder().decode(
          [...artifacts.values()].find((v) =>
            JSON.parse(new TextDecoder().decode(v)).results !== undefined
          )!,
        ),
      );

      assertEquals(stored.count, 3);

      // Boolean rule preserved
      assertEquals(stored.results[0].policy.spec.rules[0].enforce, true);
      assertEquals(stored.results[0].policy.spec.etag, "abc123");

      // List rule preserved
      assertEquals(
        stored.results[1].policy.spec.rules[0].values.allowedValues[0],
        "projects/trusted-images",
      );

      // Conditional rule preserved with condition expression
      assertEquals(stored.results[2].policy.spec.rules.length, 2);
      assertEquals(
        stored.results[2].policy.spec.rules[0].condition.expression,
        "resource.matchTag('env', 'prod')",
      );
      assertEquals(
        stored.results[2].policy.spec.rules[0].condition.title,
        "prod-only",
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
