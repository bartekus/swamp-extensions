import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "cloudresourcemanager.organizations",
  npmImports: {},
  sourceFile: new URL(
    "./cloudresourcemanager-organizations.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "orgHierarchyMethods",
};
