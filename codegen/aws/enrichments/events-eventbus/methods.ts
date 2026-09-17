// deno-lint-ignore-file no-import-prefix

import {
  EventBridgeClient,
  PutEventsCommand,
  type PutEventsRequestEntry,
} from "npm:@aws-sdk/client-eventbridge@3.1127.0";
import { NodeHttpHandler } from "npm:@smithy/node-http-handler@4.9.7";
import type { AwsCredentials } from "../../../../model/aws/events/extensions/models/_lib/aws.ts";

function createClient(
  credentials: AwsCredentials,
): EventBridgeClient {
  if (
    !Deno.env.get("AWS_EC2_METADATA_DISABLED") &&
    !Deno.env.get("AWS_CONTAINER_CREDENTIALS_RELATIVE_URI") &&
    !Deno.env.get("AWS_CONTAINER_CREDENTIALS_FULL_URI")
  ) {
    Deno.env.set("AWS_EC2_METADATA_DISABLED", "true");
  }

  const region = credentials.region ??
    Deno.env.get("AWS_REGION") ??
    Deno.env.get("AWS_DEFAULT_REGION") ??
    "us-east-1";

  const config: Record<string, unknown> = {
    region,
    requestHandler: new NodeHttpHandler(),
  };

  if (credentials.accessKeyId && credentials.secretAccessKey) {
    config.credentials = {
      accessKeyId: credentials.accessKeyId,
      secretAccessKey: credentials.secretAccessKey,
      ...(credentials.sessionToken
        ? { sessionToken: credentials.sessionToken }
        : {}),
    };
  }

  return new EventBridgeClient(config);
}

export async function putEvents(
  args: Record<string, unknown>,
  credentials: AwsCredentials,
): Promise<Record<string, unknown>> {
  const client = createClient(credentials);
  const entries = args.entries as Array<Record<string, unknown>>;

  const sdkEntries: PutEventsRequestEntry[] = entries.map((entry) => ({
    Source: entry.Source as string,
    DetailType: entry.DetailType as string,
    Detail: entry.Detail as string,
    ...(entry.EventBusName
      ? { EventBusName: entry.EventBusName as string }
      : {}),
    ...(entry.Resources ? { Resources: entry.Resources as string[] } : {}),
    ...(entry.Time ? { Time: new Date(entry.Time as string) } : {}),
    ...(entry.TraceHeader ? { TraceHeader: entry.TraceHeader as string } : {}),
  }));

  const command = new PutEventsCommand({
    Entries: sdkEntries,
  });

  try {
    const response = await client.send(command);

    const resultEntries: Record<string, unknown>[] = [];
    for (const entry of response.Entries ?? []) {
      resultEntries.push({
        EventId: entry.EventId,
        ...(entry.ErrorCode ? { ErrorCode: entry.ErrorCode } : {}),
        ...(entry.ErrorMessage ? { ErrorMessage: entry.ErrorMessage } : {}),
      });
    }

    return {
      FailedEntryCount: response.FailedEntryCount ?? 0,
      Entries: resultEntries,
    };
  } catch (err: unknown) {
    const error = err as Error & { name: string };
    switch (error.name) {
      case "AccessDeniedException":
        throw new Error(
          `Access denied: ensure the caller has events:PutEvents permission. ${error.message}`,
        );
      case "ValidationException":
        throw new Error(
          `Invalid request: ${error.message}`,
        );
      case "InternalException":
        throw new Error(
          `EventBridge internal error: ${error.message}`,
        );
      default:
        throw error;
    }
  }
}
