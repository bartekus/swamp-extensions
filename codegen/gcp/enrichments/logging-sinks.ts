import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "logging.sinks",
  npmImports: {},
  sourceFile: new URL(
    "./logging-sinks.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "loggingSinkMethods",
};
