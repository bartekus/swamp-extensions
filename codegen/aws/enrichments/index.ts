import type { AwsEnrichment } from "./types.ts";
export { parseEnrichmentSource } from "./parser.ts";
import { enrichment as rdsDbcluster } from "./rds-dbcluster/config.ts";
import { enrichment as cfnStackset } from "./cfn-stackset/config.ts";
import { enrichment as bedrockKnowledgebase } from "./bedrock-knowledgebase/config.ts";
import { enrichment as eventsEventbus } from "./events-eventbus/config.ts";

export type { AwsEnrichment };

const ENRICHMENTS: AwsEnrichment[] = [
  rdsDbcluster,
  cfnStackset,
  bedrockKnowledgebase,
  eventsEventbus,
];

export function getEnrichment(
  cfTypeName: string,
): AwsEnrichment | undefined {
  return ENRICHMENTS.find((e) => e.cfTypeName === cfTypeName);
}

export function getServiceEnrichmentImports(
  resources: Array<{ typeName: string }>,
): Record<string, string> {
  const imports: Record<string, string> = {};
  for (const r of resources) {
    const e = getEnrichment(r.typeName);
    if (e) Object.assign(imports, e.npmImports);
  }
  return imports;
}
