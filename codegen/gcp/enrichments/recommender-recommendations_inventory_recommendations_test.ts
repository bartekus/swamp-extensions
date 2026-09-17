import { assertEquals, assertRejects } from "@std/assert";

const modelPath = new URL(
  "../../../model/gcp/recommender/extensions/models/recommenders_recommendations.ts",
  import.meta.url,
).href;

// deno-lint-ignore no-explicit-any
let model: any;

const REC_A = {
  name:
    "projects/123/locations/us-central1/recommenders/google.compute.instance.MachineTypeRecommender/recommendations/rec-a",
  description: "Resize instance-1 from e2-standard-4 to e2-standard-2",
  recommenderSubtype: "CHANGE_MACHINE_TYPE",
  stateInfo: { state: "ACTIVE" },
  primaryImpact: {
    category: "COST",
    costProjection: {
      cost: { currencyCode: "USD", units: "-50", nanos: 0 },
      duration: "2592000s",
    },
  },
  content: {
    operationGroups: [
      {
        operations: [
          {
            action: "test",
            resourceType: "compute.googleapis.com/Instance",
            resource:
              "//compute.googleapis.com/projects/123/zones/us-central1-a/instances/instance-1",
          },
        ],
      },
    ],
  },
};

const REC_B = {
  name:
    "projects/123/locations/us-central1/recommenders/google.compute.instance.MachineTypeRecommender/recommendations/rec-b",
  description: "Resize instance-2 from e2-standard-8 to e2-standard-4",
  recommenderSubtype: "CHANGE_MACHINE_TYPE",
  stateInfo: { state: "ACTIVE" },
  primaryImpact: {
    category: "COST",
    costProjection: {
      cost: { currencyCode: "USD", units: "-100", nanos: 0 },
      duration: "2592000s",
    },
  },
};

const REC_C = {
  name:
    "projects/456/locations/us-east1/recommenders/google.compute.instance.IdleResourceRecommender/recommendations/rec-c",
  description: "Delete idle instance-3",
  recommenderSubtype: "DELETE_RESOURCE",
  stateInfo: { state: "ACTIVE" },
  primaryImpact: {
    category: "COST",
    costProjection: {
      cost: { currencyCode: "USD", units: "-200", nanos: 0 },
      duration: "2592000s",
    },
  },
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
      modelType: "@swamp/gcp/recommender/recommenders-recommendations",
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
  name: "inventory_recommendations: setup - dynamic import",
  sanitizeResources: false,
  async fn() {
    const mod = await import(`${modelPath}?v=${crypto.randomUUID()}`);
    model = mod.model;
  },
});

Deno.test({
  name:
    "inventory_recommendations: multi-parent pagination — 2 parents, first has 2 pages",
  sanitizeResources: false,
  async fn() {
    const parent1 =
      "projects/123/locations/us-central1/recommenders/google.compute.instance.MachineTypeRecommender";
    const parent2 =
      "projects/456/locations/us-east1/recommenders/google.compute.instance.IdleResourceRecommender";

    const server = createMockServer((req) => {
      const url = new URL(req.url);
      const pageToken = url.searchParams.get("pageToken");

      if (url.pathname.includes("MachineTypeRecommender") && !pageToken) {
        return new Response(
          JSON.stringify({
            recommendations: [REC_A],
            nextPageToken: "page2",
          }),
          { status: 200 },
        );
      }
      if (
        url.pathname.includes("MachineTypeRecommender") && pageToken === "page2"
      ) {
        return new Response(
          JSON.stringify({ recommendations: [REC_B] }),
          { status: 200 },
        );
      }
      if (url.pathname.includes("IdleResourceRecommender")) {
        return new Response(
          JSON.stringify({ recommendations: [REC_C] }),
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

      const result = await model.methods.inventory_recommendations.execute(
        { parents: [parent1, parent2] },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          [...artifacts.values()].find((v) =>
            JSON.parse(new TextDecoder().decode(v)).recommendations !==
              undefined
          )!,
        ),
      );
      assertEquals(stored.count, 3);
      assertEquals(stored.recommendations.length, 3);
      assertEquals(stored.perParentCounts[parent1], 2);
      assertEquals(stored.perParentCounts[parent2], 1);
      assertEquals(typeof stored.fetchedAt, "string");

      // Verify monetary projections preserved
      assertEquals(
        stored.recommendations[0].primaryImpact.costProjection.cost
          .currencyCode,
        "USD",
      );
      assertEquals(
        stored.recommendations[0].primaryImpact.costProjection.duration,
        "2592000s",
      );

      assertEquals(server.state.requests.length, 3);
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
  name: "inventory_recommendations: maxItems exceeded — throws explicit error",
  sanitizeResources: false,
  async fn() {
    const parent =
      "projects/123/locations/us-central1/recommenders/google.compute.instance.MachineTypeRecommender";

    const server = createMockServer(() => {
      return new Response(
        JSON.stringify({ recommendations: [REC_A, REC_B] }),
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
          model.methods.inventory_recommendations.execute(
            { parents: [parent], maxItems: 1 },
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
  name: "inventory_recommendations: empty scope — persists zero-count snapshot",
  sanitizeResources: false,
  async fn() {
    const parent =
      "projects/123/locations/us-central1/recommenders/google.compute.instance.MachineTypeRecommender";

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

      const result = await model.methods.inventory_recommendations.execute(
        { parents: [parent] },
        context,
      );
      assertEquals(result.dataHandles.length, 1);

      const stored = JSON.parse(
        new TextDecoder().decode(
          [...artifacts.values()].find((v) =>
            JSON.parse(new TextDecoder().decode(v)).recommendations !==
              undefined
          )!,
        ),
      );
      assertEquals(stored.count, 0);
      assertEquals(stored.recommendations.length, 0);
      assertEquals(stored.perParentCounts[parent], 0);
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
  name: "inventory_recommendations: API error — throws",
  sanitizeResources: false,
  async fn() {
    const parent =
      "projects/123/locations/us-central1/recommenders/google.compute.instance.MachineTypeRecommender";

    const server = createMockServer(() => {
      return new Response(
        JSON.stringify({
          error: { code: 403, message: "Permission denied" },
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
          model.methods.inventory_recommendations.execute(
            { parents: [parent] },
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
