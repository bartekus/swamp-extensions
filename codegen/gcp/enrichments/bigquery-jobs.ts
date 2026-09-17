import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "bigquery.jobs",
  npmImports: {},
  sourceFile: new URL(
    "./bigquery-jobs.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "bigqueryQueryMethods",
};
