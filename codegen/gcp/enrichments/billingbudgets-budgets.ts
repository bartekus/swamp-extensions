import type { GcpEnrichment } from "./types.ts";

export const enrichment: GcpEnrichment = {
  resourceId: "billingbudgets.budgets",
  npmImports: {},
  sourceFile: new URL(
    "./billingbudgets-budgets.enrich.ts",
    import.meta.url,
  ).pathname,
  methodsExport: "budgetEnsureMethods",
};
