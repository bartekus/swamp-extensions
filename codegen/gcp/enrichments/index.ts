import type { GcpEnrichment } from "./types.ts";
export { parseEnrichmentSource } from "./parser.ts";
import { enrichment as cloudidentityGroupsMemberships } from "./cloudidentity-groups-memberships.ts";
import { enrichment as cloudresourcemanagerProjects } from "./cloudresourcemanager-projects.ts";
import { enrichment as serviceaccounts } from "./serviceaccounts.ts";
import { enrichment as securitycenterSourcesFindings } from "./securitycenter-sources-findings.ts";
import { enrichment as storageBuckets } from "./storage-buckets.ts";

export type { GcpEnrichment };

const ENRICHMENTS: GcpEnrichment[] = [
  cloudidentityGroupsMemberships,
  cloudresourcemanagerProjects,
  securitycenterSourcesFindings,
  serviceaccounts,
  storageBuckets,
];

export function getEnrichment(
  resourceId: string,
): GcpEnrichment | undefined {
  return ENRICHMENTS.find((e) => e.resourceId === resourceId);
}

export function getServiceEnrichmentImports(
  resources: Array<{ resourceId: string }>,
): Record<string, string> {
  const imports: Record<string, string> = {};
  for (const r of resources) {
    const e = getEnrichment(r.resourceId);
    if (e) Object.assign(imports, e.npmImports);
  }
  return imports;
}
