import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "serviceusage.services",
  npmImports: {},
  sourceFile: new URL(
    "./serviceusage-services.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "serviceInventoryMethods",
};
