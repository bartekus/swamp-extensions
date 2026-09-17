import { assertEquals, assertRejects } from "@std/assert";
import {
  type CuratedFinding,
  curateSccFinding,
  fetchSccFindingsPage,
  type RequestFn,
  snapshotSccFindings,
} from "./securitycenter-sources-findings.helpers.ts";

function makeRawFinding(
  overrides: Record<string, unknown> = {},
): Record<string, unknown> {
  return {
    name: "organizations/123/sources/456/locations/global/findings/f1",
    category: "OPEN_FIREWALL",
    severity: "HIGH",
    state: "ACTIVE",
    mute: "UNMUTED",
    findingClass: "VULNERABILITY",
    eventTime: "2026-09-01T00:00:00Z",
    createTime: "2026-08-15T00:00:00Z",
    canonicalName:
      "projects/my-project/sources/456/locations/global/findings/f1",
    resource: {
      name:
        "//compute.googleapis.com/projects/my-project/zones/us-central1-a/instances/vm-1",
      type: "google.compute.Instance",
      projectDisplayName: "my-project",
      location: "us-central1-a",
      cloudProvider: "GOOGLE_CLOUD_PLATFORM",
    },
    ...overrides,
  };
}

Deno.test("curateSccFinding extracts curated fields", () => {
  const raw = makeRawFinding();
  const curated = curateSccFinding(raw);
  assertEquals(
    curated.name,
    "organizations/123/sources/456/locations/global/findings/f1",
  );
  assertEquals(curated.category, "OPEN_FIREWALL");
  assertEquals(curated.severity, "HIGH");
  assertEquals(curated.state, "ACTIVE");
  assertEquals(curated.mute, "UNMUTED");
  assertEquals(curated.findingClass, "VULNERABILITY");
  assertEquals(curated.eventTime, "2026-09-01T00:00:00Z");
  assertEquals(curated.createTime, "2026-08-15T00:00:00Z");
  assertEquals(
    curated.resourceName,
    "//compute.googleapis.com/projects/my-project/zones/us-central1-a/instances/vm-1",
  );
  assertEquals(curated.resourceType, "google.compute.Instance");
  assertEquals(curated.resourceProject, "my-project");
  assertEquals(curated.resourceLocation, "us-central1-a");
  assertEquals(curated.resourceCloudProvider, "GOOGLE_CLOUD_PLATFORM");
});

Deno.test("curateSccFinding excludes sourceProperties and secret", () => {
  const raw = makeRawFinding({
    sourceProperties: { "scanner_id": "scanner-1", "token": "secret-val" },
    secret: {
      type: "API_KEY",
      environmentVariable: { key: "MY_SECRET" },
      filePath: { path: "/etc/secrets/key" },
      status: { validity: "SECRET_VALIDITY_VALID" },
    },
    externalSystems: { "jira": { status: "open" } },
    indicator: { domains: ["evil.com"], ipAddresses: ["1.2.3.4"] },
  });
  const curated: CuratedFinding = curateSccFinding(raw);
  const keys = Object.keys(curated);
  assertEquals(
    keys.includes("sourceProperties" as keyof CuratedFinding),
    false,
  );
  assertEquals(keys.includes("secret" as keyof CuratedFinding), false);
  assertEquals(keys.includes("externalSystems" as keyof CuratedFinding), false);
  assertEquals(keys.includes("indicator" as keyof CuratedFinding), false);
});

Deno.test("curateSccFinding handles missing optional fields", () => {
  const raw = { name: "f1" };
  const curated = curateSccFinding(raw);
  assertEquals(curated.name, "f1");
  assertEquals(curated.category, "");
  assertEquals(curated.severity, "");
  assertEquals(curated.resourceName, "");
  assertEquals(curated.resourceCloudProvider, "");
});

Deno.test("fetchSccFindingsPage constructs correct URL and returns findings", async () => {
  let capturedUrl = "";
  const mockRequest: RequestFn = (_method, url) => {
    capturedUrl = url;
    assertEquals(_method, "GET");
    return Promise.resolve(
      new Response(
        JSON.stringify({
          listFindingsResults: [
            { finding: makeRawFinding() },
            { finding: makeRawFinding({ name: "f2" }) },
          ],
          nextPageToken: "token-2",
        }),
        { status: 200 },
      ),
    );
  };

  const result = await fetchSccFindingsPage(
    "https://securitycenter.googleapis.com/",
    "organizations/123/sources/-/locations/global",
    'state="ACTIVE"',
    100,
    undefined,
    mockRequest,
  );

  assertEquals(result.findings.length, 2);
  assertEquals(result.nextPageToken, "token-2");
  assertEquals(
    capturedUrl.startsWith(
      "https://securitycenter.googleapis.com/v2/organizations/123/sources/-/locations/global/findings",
    ),
    true,
  );
  assertEquals(capturedUrl.includes("pageSize=100"), true);
  assertEquals(
    capturedUrl.includes(`filter=${encodeURIComponent('state="ACTIVE"')}`),
    true,
  );
});

Deno.test("fetchSccFindingsPage forwards pageToken", async () => {
  let capturedUrl = "";
  const mockRequest: RequestFn = (_method, url) => {
    capturedUrl = url;
    return Promise.resolve(
      new Response(JSON.stringify({ listFindingsResults: [] }), {
        status: 200,
      }),
    );
  };

  await fetchSccFindingsPage(
    "https://securitycenter.googleapis.com/",
    "organizations/123/sources/-/locations/global",
    undefined,
    50,
    "page-token-xyz",
    mockRequest,
  );

  assertEquals(
    capturedUrl.includes(`pageToken=${encodeURIComponent("page-token-xyz")}`),
    true,
  );
});

Deno.test("fetchSccFindingsPage rejects 403 with permission error", async () => {
  const mockRequest: RequestFn = () => {
    return Promise.resolve(
      new Response("Forbidden: caller lacks permission", { status: 403 }),
    );
  };

  await assertRejects(
    () =>
      fetchSccFindingsPage(
        "https://securitycenter.googleapis.com/",
        "organizations/123/sources/-/locations/global",
        undefined,
        100,
        undefined,
        mockRequest,
      ),
    Error,
    "Permission denied",
  );
});

Deno.test("fetchSccFindingsPage rejects non-ok responses", async () => {
  const mockRequest: RequestFn = () => {
    return Promise.resolve(new Response("Internal error", { status: 500 }));
  };

  await assertRejects(
    () =>
      fetchSccFindingsPage(
        "https://securitycenter.googleapis.com/",
        "organizations/123/sources/-/locations/global",
        undefined,
        100,
        undefined,
        mockRequest,
      ),
    Error,
    "List findings failed (500)",
  );
});

Deno.test("snapshotSccFindings paginates across multiple pages", async () => {
  let callCount = 0;
  const mockRequest: RequestFn = () => {
    callCount++;
    if (callCount === 1) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            listFindingsResults: [
              { finding: makeRawFinding({ name: "f1" }) },
              { finding: makeRawFinding({ name: "f2" }) },
            ],
            nextPageToken: "page2",
          }),
          { status: 200 },
        ),
      );
    }
    if (callCount === 2) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            listFindingsResults: [
              { finding: makeRawFinding({ name: "f3" }) },
            ],
          }),
          { status: 200 },
        ),
      );
    }
    return Promise.resolve(
      new Response(JSON.stringify({ listFindingsResults: [] }), {
        status: 200,
      }),
    );
  };

  const snapshot = await snapshotSccFindings(
    "https://securitycenter.googleapis.com/",
    "organizations/123/sources/-/locations/global",
    undefined,
    100,
    10000,
    mockRequest,
  );

  assertEquals(snapshot.findings.length, 3);
  assertEquals(snapshot.totalFetched, 3);
  assertEquals(snapshot.truncated, false);
  assertEquals(snapshot.findings[0].name, "f1");
  assertEquals(snapshot.findings[2].name, "f3");
  assertEquals(callCount, 2);
});

Deno.test("snapshotSccFindings enforces maxFindings cap", async () => {
  const mockRequest: RequestFn = () => {
    return Promise.resolve(
      new Response(
        JSON.stringify({
          listFindingsResults: [
            { finding: makeRawFinding({ name: "f1" }) },
            { finding: makeRawFinding({ name: "f2" }) },
            { finding: makeRawFinding({ name: "f3" }) },
            { finding: makeRawFinding({ name: "f4" }) },
            { finding: makeRawFinding({ name: "f5" }) },
          ],
          nextPageToken: "more",
        }),
        { status: 200 },
      ),
    );
  };

  const snapshot = await snapshotSccFindings(
    "https://securitycenter.googleapis.com/",
    "organizations/123/sources/-/locations/global",
    undefined,
    100,
    3,
    mockRequest,
  );

  assertEquals(snapshot.findings.length, 3);
  assertEquals(snapshot.truncated, true);
  assertEquals(snapshot.totalFetched, 3);
});

Deno.test("snapshotSccFindings handles empty results", async () => {
  const mockRequest: RequestFn = () => {
    return Promise.resolve(
      new Response(JSON.stringify({ listFindingsResults: [] }), {
        status: 200,
      }),
    );
  };

  const snapshot = await snapshotSccFindings(
    "https://securitycenter.googleapis.com/",
    "organizations/123/sources/-/locations/global",
    undefined,
    100,
    10000,
    mockRequest,
  );

  assertEquals(snapshot.findings.length, 0);
  assertEquals(snapshot.totalFetched, 0);
  assertEquals(snapshot.truncated, false);
});

Deno.test("snapshotSccFindings propagates permission errors", async () => {
  const mockRequest: RequestFn = () => {
    return Promise.resolve(new Response("Forbidden", { status: 403 }));
  };

  await assertRejects(
    () =>
      snapshotSccFindings(
        "https://securitycenter.googleapis.com/",
        "organizations/123/sources/-/locations/global",
        undefined,
        100,
        10000,
        mockRequest,
      ),
    Error,
    "Permission denied",
  );
});
