import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "orgpolicy.policies",
  npmImports: {},
  sourceFile: new URL(
    "./orgpolicy-policies.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "orgPolicyAuditMethods",
};
