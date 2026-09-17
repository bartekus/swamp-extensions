// Standalone testable helpers for the SCC findings enrichment.
// The enrichment file (securitycenter-sources-findings.enrich.ts) inlines
// identical copies of these functions — keep both in sync when editing.

export interface CuratedFinding {
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

export interface FindingsSnapshot {
  findings: CuratedFinding[];
  totalFetched: number;
  truncated: boolean;
  snapshotTimestamp: string;
}

export type RequestFn = (
  method: string,
  url: string,
  body?: Record<string, unknown>,
  creds?: unknown,
) => Promise<Response>;

export function curateSccFinding(
  raw: Record<string, unknown>,
): CuratedFinding {
  const resource = (raw.resource as Record<string, unknown> | undefined) ?? {};
  return {
    name: (raw.name as string | undefined) ?? "",
    category: (raw.category as string | undefined) ?? "",
    severity: (raw.severity as string | undefined) ?? "",
    state: (raw.state as string | undefined) ?? "",
    mute: (raw.mute as string | undefined) ?? "",
    findingClass: (raw.findingClass as string | undefined) ?? "",
    eventTime: (raw.eventTime as string | undefined) ?? "",
    createTime: (raw.createTime as string | undefined) ?? "",
    canonicalName: (raw.canonicalName as string | undefined) ?? "",
    resourceName: (resource.name as string | undefined) ?? "",
    resourceType: (resource.type as string | undefined) ?? "",
    resourceProject: (resource.projectDisplayName as string | undefined) ?? "",
    resourceLocation: (resource.location as string | undefined) ?? "",
    resourceCloudProvider: (resource.cloudProvider as string | undefined) ?? "",
  };
}

export async function fetchSccFindingsPage(
  baseUrl: string,
  parent: string,
  filter: string | undefined,
  pageSize: number,
  pageToken: string | undefined,
  requestFn: RequestFn,
  credentials?: unknown,
): Promise<{
  findings: Record<string, unknown>[];
  nextPageToken: string | undefined;
}> {
  const params: string[] = [`pageSize=${pageSize}`];
  if (filter) params.push(`filter=${encodeURIComponent(filter)}`);
  if (pageToken) params.push(`pageToken=${encodeURIComponent(pageToken)}`);
  const qs = `?${params.join("&")}`;

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
  const findings =
    (data.listFindingsResults as Record<string, unknown>[] | undefined) ?? [];
  const rawFindings = findings.map((r) =>
    (r.finding as Record<string, unknown> | undefined) ?? r
  );
  return {
    findings: rawFindings,
    nextPageToken: (data.nextPageToken as string | undefined) ?? undefined,
  };
}

export async function snapshotSccFindings(
  baseUrl: string,
  parent: string,
  filter: string | undefined,
  pageSize: number,
  maxFindings: number,
  requestFn: RequestFn,
  credentials?: unknown,
): Promise<FindingsSnapshot> {
  const curated: CuratedFinding[] = [];
  let pageToken: string | undefined;
  let totalFetched = 0;
  let truncated = false;

  do {
    const page = await fetchSccFindingsPage(
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
      curated.push(curateSccFinding(raw));
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
