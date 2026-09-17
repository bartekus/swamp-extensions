import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "recommender.recommenders.recommendations",
  npmImports: {},
  sourceFile: new URL(
    "./recommender-recommendations.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "recommenderInventoryMethods",
};
