// deno-lint-ignore-file no-explicit-any no-import-prefix

import { z } from "npm:zod@4.3.6";

interface CuratedFinding {
  name: string;
  category: string;
  severity: string;
  state: string;
  mute: string;
  findingClass: string;
  eventTime: string;
  createTime: string;
  canonicalName: string;
  resourceName: string;
  resourceType: string;
  resourceProject: string;
  resourceLocation: string;
  resourceCloudProvider: string;
}

interface FindingsSnapshot {
  findings: CuratedFinding[];
  totalFetched: number;
  truncated: boolean;
  snapshotTimestamp: string;
}

// Curates a raw SCC finding into selected metadata fields.
// Explicitly excludes sourceProperties, secret, and other raw payload fields.
// Keep in sync with securitycenter-sources-findings.helpers.ts
function _curateSccFinding(raw: any): CuratedFinding {
  const resource = raw.resource ?? {};
  return {
    name: raw.name ?? "",
    category: raw.category ?? "",
    severity: raw.severity ?? "",
    state: raw.state ?? "",
    mute: raw.mute ?? "",
    findingClass: raw.findingClass ?? "",
    eventTime: raw.eventTime ?? "",
    createTime: raw.createTime ?? "",
    canonicalName: raw.canonicalName ?? "",
    resourceName: resource.name ?? "",
    resourceType: resource.type ?? "",
    resourceProject: resource.projectDisplayName ?? "",
    resourceLocation: resource.location ?? "",
    resourceCloudProvider: resource.cloudProvider ?? "",
  };
}

// Fetches one page of findings from the SCC v2 location-scoped endpoint.
// Rejects 403 immediately as a permission error.
// Keep in sync with securitycenter-sources-findings.helpers.ts
async function _fetchSccFindingsPage(
  baseUrl: string,
  parent: string,
  filter: string | undefined,
  pageSize: number,
  pageToken: string | undefined,
  requestFn: (
    method: string,
    url: string,
    body?: Record<string, unknown>,
    creds?: any,
  ) => Promise<Response>,
  credentials?: any,
): Promise<{ findings: any[]; nextPageToken: string | undefined }> {
  const params: string[] = [`pageSize=${pageSize}`];
  if (filter) params.push(`filter=${encodeURIComponent(filter)}`);
  if (pageToken) params.push(`pageToken=${encodeURIComponent(pageToken)}`);
  const qs = `?${params.join("&")}`;

  // SCC v2 uses location-scoped endpoints: v2/{parent}/findings
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const url = `${base}v2/${parent}/findings${qs}`;
  const resp = await requestFn("GET", url, undefined, credentials);

  if (resp.status === 403) {
    const body = await resp.text();
    throw new Error(
      `Permission denied listing findings for ${parent}: ${resp.status} ${body}. ` +
        `Check that the caller has securitycenter.findings.list permission.`,
    );
  }
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`List findings failed (${resp.status}): ${body}`);
  }

  const data = await resp.json();
  const findings = data.listFindingsResults ?? [];
  const rawFindings = findings.map((r: any) => r.finding ?? r);
  return {
    findings: rawFindings,
    nextPageToken: data.nextPageToken ?? undefined,
  };
}

// Orchestrates paginated fetching and curation of SCC findings.
// Enforces maxFindings cap. Returns a snapshot with curated metadata only.
// Keep in sync with securitycenter-sources-findings.helpers.ts
async function _snapshotSccFindings(
  baseUrl: string,
  parent: string,
  filter: string | undefined,
  pageSize: number,
  maxFindings: number,
  requestFn: (
    method: string,
    url: string,
    body?: Record<string, unknown>,
    creds?: any,
  ) => Promise<Response>,
  credentials?: any,
): Promise<FindingsSnapshot> {
  const curated: CuratedFinding[] = [];
  let pageToken: string | undefined;
  let totalFetched = 0;
  let truncated = false;

  do {
    const page = await _fetchSccFindingsPage(
      baseUrl,
      parent,
      filter,
      pageSize,
      pageToken,
      requestFn,
      credentials,
    );

    for (const raw of page.findings) {
      if (curated.length >= maxFindings) {
        truncated = true;
        break;
      }
      curated.push(_curateSccFinding(raw));
      totalFetched++;
    }

    if (truncated) break;
    pageToken = page.nextPageToken;
  } while (pageToken);

  return {
    findings: curated,
    totalFetched,
    truncated,
    snapshotTimestamp: new Date().toISOString(),
  };
}

export const inventoryFindingsMethods = {
  // This method uses SCC v2 (location-scoped) while the generated model's
  // other methods use SCC v1. The v2 endpoint adds location scoping:
  //   v2/organizations/{org}/sources/{source}/locations/{location}/findings
  // vs v1's unscoped parent path. Both share the same base URL and auth.
  inventory_findings: {
    description:
      "Snapshot SCC v2 findings for a location-scoped source, returning curated metadata without raw payloads",
    arguments: z.object({
      organisation: z.string().describe(
        "GCP organisation ID (numeric), e.g. '123456789'",
      ),
      source: z.string().describe(
        "SCC source ID (numeric) or '-' for all sources",
      ),
      location: z.string().describe(
        "GCP location, e.g. 'global', 'us-central1'",
      ),
      filter: z.string().describe(
        'SCC filter expression, e.g. \'state="ACTIVE" AND severity="HIGH"\'',
      ).optional(),
      pageSize: z.number().int().min(1).max(1000).describe(
        "Findings per API page (default 1000)",
      ).optional(),
      maxFindings: z.number().int().min(1).describe(
        "Maximum findings to persist in the snapshot (default 10000)",
      ).optional(),
    }),
    execute: async (args: Record<string, unknown>, context: any) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);

      const organisation = args["organisation"] as string;
      const source = args["source"] as string;
      const location = args["location"] as string;
      const filter = args["filter"] as string | undefined;
      const pageSize = (args["pageSize"] as number | undefined) ?? 1000;
      const maxFindings = (args["maxFindings"] as number | undefined) ?? 10000;

      const parent =
        `organizations/${organisation}/sources/${source}/locations/${location}`;

      const snapshot = await _snapshotSccFindings(
        baseUrl,
        parent,
        filter,
        pageSize,
        maxFindings,
        request,
        credentials,
      );

      return { result: snapshot };
    },
  },
};
