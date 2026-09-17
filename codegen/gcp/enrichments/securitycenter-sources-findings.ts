import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "securitycenter.sources.findings",
  npmImports: {},
  sourceFile: new URL(
    "./securitycenter-sources-findings.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "inventoryFindingsMethods",
};
