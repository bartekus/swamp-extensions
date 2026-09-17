import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/billingbudgets/extensions/models/budgets.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const BUDGET_RESPONSE = {
  name: "billingAccounts/012345-6789AB-CDEF01/budgets/abc-123",
  displayName: "Monthly Infra Budget",
  etag: "etag-v1",
  amount: {
    specifiedAmount: { units: "1000", currencyCode: "USD" },
  },
  thresholdRules: [
    { thresholdPercent: 0.5, spendBasis: "CURRENT_SPEND" },
    { thresholdPercent: 0.9, spendBasis: "CURRENT_SPEND" },
  ],
  calendarPeriod: "MONTH",
};

const BUDGET_B = {
  ...BUDGET_RESPONSE,
  name: "billingAccounts/012345-6789AB-CDEF01/budgets/def-456",
};

interface MockServerState {
  requests: Array<{ method: string; path: string; body?: unknown }>;
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
    if (
      req.method === "POST" || req.method === "PATCH" || req.method === "PUT"
    ) {
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
      modelType: "@swamp/gcp/billingbudgets/budgets",
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

const DEFAULT_ARGS = {
  billingAccount: "billingAccounts/012345-6789AB-CDEF01",
  displayName: "Monthly Infra Budget",
  amount: { units: "1000", currencyCode: "USD" },
  thresholdRules: [
    { thresholdPercent: 0.5, spendBasis: "CURRENT_SPEND" },
    { thresholdPercent: 0.9, spendBasis: "CURRENT_SPEND" },
  ],
};

// sanitizeResources: false because the gcp.ts module caches credentials
// and Deno.serve keeps a connection pool.
Deno.test({
  name: "ensure_budget: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name: "ensure_budget: create-new — no existing budget found",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      if (
        req.method === "GET" && url.pathname.includes("/budgets") &&
        !url.pathname.includes("/budgets/")
      ) {
        return new Response(JSON.stringify({}), { status: 200 });
      }
      if (req.method === "POST") {
        return new Response(JSON.stringify(BUDGET_RESPONSE), { status: 200 });
      }
      if (req.method === "GET") {
        return new Response(JSON.stringify(BUDGET_RESPONSE), { status: 200 });
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

      const result = await model.methods.ensure_budget.execute(
        DEFAULT_ARGS,
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          artifacts.get(
            "billingAccounts_012345-6789AB-CDEF01_budgets_abc-123",
          )!,
        ),
      );
      assertEquals(stored.displayName, "Monthly Infra Budget");

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
  name: "ensure_budget: adopt-by-name — list returns 1 match",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      if (
        req.method === "GET" && url.pathname.includes("/budgets") &&
        !url.pathname.includes("/budgets/")
      ) {
        return new Response(
          JSON.stringify({ budgets: [BUDGET_RESPONSE] }),
          { status: 200 },
        );
      }
      if (req.method === "PATCH") {
        return new Response(
          JSON.stringify({ ...BUDGET_RESPONSE, etag: "etag-v2" }),
          { status: 200 },
        );
      }
      if (req.method === "GET") {
        return new Response(
          JSON.stringify({ ...BUDGET_RESPONSE, etag: "etag-v2" }),
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

      const result = await model.methods.ensure_budget.execute(
        DEFAULT_ARGS,
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      assertEquals(server.state.requests.length, 3);
      assertEquals(server.state.requests[0].method, "GET");
      assertEquals(server.state.requests[1].method, "PATCH");
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
  name: "ensure_budget: ambiguous-name rejection — list returns 2 matches",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      if (req.method === "GET" && url.pathname.includes("/budgets")) {
        return new Response(
          JSON.stringify({ budgets: [BUDGET_RESPONSE, BUDGET_B] }),
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
        () => model.methods.ensure_budget.execute(DEFAULT_ARGS, context),
        Error,
      );
      assertEquals(err.message.includes("Ambiguous"), true);
      assertEquals(err.message.includes("2 budgets"), true);
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
  name: "ensure_budget: etag conflict — 409 on PATCH throws clear error",
  sanitizeResources: false,
  async fn() {
    const server = createMockServer((req) => {
      const url = new URL(req.url);
      if (
        req.method === "GET" && url.pathname.includes("/budgets") &&
        !url.pathname.includes("/budgets/")
      ) {
        return new Response(
          JSON.stringify({ budgets: [BUDGET_RESPONSE] }),
          { status: 200 },
        );
      }
      if (req.method === "PATCH") {
        return new Response(
          JSON.stringify({ error: { code: 409, message: "etag mismatch" } }),
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

      const { context } = createMockContext({
        apiEndpoint: `http://localhost:${server.port}/`,
      });

      const err = await assertRejects(
        () => model.methods.ensure_budget.execute(DEFAULT_ARGS, context),
        Error,
      );
      assertEquals(err.message.includes("Etag conflict"), true);
      assertEquals(err.message.includes("concurrently"), true);
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
  name: "ensure_budget: create with notifications — pubsub and channels",
  sanitizeResources: false,
  async fn() {
    let capturedCreateBody: Record<string, unknown> | undefined;
    const budgetWithNotifications = {
      ...BUDGET_RESPONSE,
      notificationsRule: {
        pubsubTopic: "projects/my-proj/topics/budget-alerts",
        monitoringNotificationChannels: [
          "projects/my-proj/notificationChannels/123",
        ],
      },
    };

    const server = createMockServer((req, state) => {
      const url = new URL(req.url);
      if (
        req.method === "GET" && url.pathname.includes("/budgets") &&
        !url.pathname.includes("/budgets/")
      ) {
        return new Response(JSON.stringify({}), { status: 200 });
      }
      if (req.method === "POST") {
        capturedCreateBody = state.requests[state.requests.length - 1]
          .body as Record<string, unknown>;
        return new Response(
          JSON.stringify(budgetWithNotifications),
          { status: 200 },
        );
      }
      if (req.method === "GET") {
        return new Response(
          JSON.stringify(budgetWithNotifications),
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

      const result = await model.methods.ensure_budget.execute(
        {
          ...DEFAULT_ARGS,
          notificationsRule: {
            pubsubTopic: "projects/my-proj/topics/budget-alerts",
            monitoringNotificationChannels: [
              "projects/my-proj/notificationChannels/123",
            ],
          },
        },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      assertEquals(
        (capturedCreateBody?.notificationsRule as Record<string, unknown>)
          ?.pubsubTopic,
        "projects/my-proj/topics/budget-alerts",
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
