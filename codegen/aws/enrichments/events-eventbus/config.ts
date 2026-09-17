import type { AwsEnrichment } from "../types.ts";

export const enrichment: AwsEnrichment = {
  cfTypeName: "AWS::Events::EventBus",
  npmImports: {
    "@aws-sdk/client-eventbridge": "npm:@aws-sdk/client-eventbridge@3.1127.0",
    "@smithy/node-http-handler": "npm:@smithy/node-http-handler@4.9.7",
  },
  customMethods: {
    sourceFile: new URL("./methods.ts", import.meta.url).pathname,
    methods: [
      {
        methodName: "put_events",
        description:
          "Send custom events to this EventBridge event bus via the PutEvents API",
        argumentFields: [
          `    entries: z.array(z.object({ Source: z.string().describe("The source of the event"), DetailType: z.string().describe("Free-form string used to decide what fields to expect in the event detail"), Detail: z.string().describe("A valid JSON object (as a string) containing the event payload"), EventBusName: z.string().describe("The name or ARN of the event bus to receive the event — defaults to the bus this model manages").optional(), Resources: z.array(z.string()).describe("AWS resources involved in the event").optional(), Time: z.string().describe("The timestamp of the event (ISO 8601)").optional(), TraceHeader: z.string().describe("An X-Ray trace header for event tracing").optional() })).describe("The event entries to send (max 10 per call)"),`,
        ],
        functionExport: "putEvents",
        returnsArray: false,
      },
    ],
  },
};
