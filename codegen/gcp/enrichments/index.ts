import type { GcpEnrichment } from "./types.ts";
export { parseEnrichmentSource } from "./parser.ts";
import { enrichment as bigqueryJobs } from "./bigquery-jobs.ts";
import { enrichment as billingbudgetsBudgets } from "./billingbudgets-budgets.ts";
import { enrichment as cloudidentityGroupsMemberships } from "./cloudidentity-groups-memberships.ts";
import { enrichment as cloudresourcemanagerOrganizations } from "./cloudresourcemanager-organizations.ts";
import { enrichment as cloudresourcemanagerProjects } from "./cloudresourcemanager-projects.ts";
import { enrichment as loggingSinks } from "./logging-sinks.ts";
import { enrichment as orgpolicyPolicies } from "./orgpolicy-policies.ts";
import { enrichment as recommenderRecommendations } from "./recommender-recommendations.ts";
import { enrichment as serviceaccounts } from "./serviceaccounts.ts";
import { enrichment as securitycenterSourcesFindings } from "./securitycenter-sources-findings.ts";
import { enrichment as serviceusageServices } from "./serviceusage-services.ts";
import { enrichment as storageBuckets } from "./storage-buckets.ts";

export type { GcpEnrichment };

const ENRICHMENTS: GcpEnrichment[] = [
  bigqueryJobs,
  billingbudgetsBudgets,
  cloudidentityGroupsMemberships,
  cloudresourcemanagerOrganizations,
  cloudresourcemanagerProjects,
  loggingSinks,
  orgpolicyPolicies,
  recommenderRecommendations,
  securitycenterSourcesFindings,
  serviceaccounts,
  serviceusageServices,
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
