import { assertEquals, assertRejects } from "@std/assert";
import { putEvents } from "./methods.ts";
import type { AwsCredentials } from "../../../../model/aws/events/extensions/models/_lib/aws.ts";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/x-amz-json-1.1" },
  });
}

function errorResponse(
  type: string,
  message: string,
  status = 400,
): Response {
  return new Response(JSON.stringify({ __type: type, message }), {
    status,
    headers: { "content-type": "application/x-amz-json-1.1" },
  });
}

function createMockServer(
  handler: (req: Request) => Response | Promise<Response>,
): { server: Deno.HttpServer; url: string; port: number } {
  const server = Deno.serve({ port: 0, onListen: () => {} }, handler);
  const addr = server.addr as Deno.NetAddr;
  return {
    server,
    url: `http://127.0.0.1:${addr.port}`,
    port: addr.port,
  };
}

const TEST_CREDENTIALS: AwsCredentials = {
  accessKeyId: "AKIAIOSFODNN7EXAMPLE",
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  region: "us-east-1",
};

// @aws-sdk/client-eventbridge leaks connection pool resources
Deno.test({
  name: "putEvents returns successful results for all entries",
  sanitizeResources: false,
  fn: async () => {
    const { server, url } = createMockServer((_req) => {
      return jsonResponse({
        FailedEntryCount: 0,
        Entries: [
          { EventId: "evt-aaa-111" },
          { EventId: "evt-bbb-222" },
        ],
      });
    });

    const saved = Deno.env.get("AWS_ENDPOINT_URL");
    try {
      Deno.env.set("AWS_ENDPOINT_URL", url);
      const result = await putEvents(
        {
          entries: [
            {
              Source: "my.app",
              DetailType: "OrderCreated",
              Detail: JSON.stringify({ orderId: "123" }),
            },
            {
              Source: "my.app",
              DetailType: "OrderShipped",
              Detail: JSON.stringify({ orderId: "456" }),
            },
          ],
        },
        TEST_CREDENTIALS,
      );

      assertEquals(result.FailedEntryCount, 0);
      const entries = result.Entries as Record<string, unknown>[];
      assertEquals(entries.length, 2);
      assertEquals(entries[0].EventId, "evt-aaa-111");
      assertEquals(entries[1].EventId, "evt-bbb-222");
    } finally {
      if (saved !== undefined) Deno.env.set("AWS_ENDPOINT_URL", saved);
      else Deno.env.delete("AWS_ENDPOINT_URL");
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "putEvents returns partial failure with error details",
  sanitizeResources: false,
  fn: async () => {
    const { server, url } = createMockServer((_req) => {
      return jsonResponse({
        FailedEntryCount: 1,
        Entries: [
          { EventId: "evt-aaa-111" },
          {
            ErrorCode: "InternalFailure",
            ErrorMessage: "Internal service failure",
          },
        ],
      });
    });

    const saved = Deno.env.get("AWS_ENDPOINT_URL");
    try {
      Deno.env.set("AWS_ENDPOINT_URL", url);
      const result = await putEvents(
        {
          entries: [
            {
              Source: "my.app",
              DetailType: "OrderCreated",
              Detail: JSON.stringify({ orderId: "123" }),
            },
            {
              Source: "my.app",
              DetailType: "OrderFailed",
              Detail: JSON.stringify({ orderId: "456" }),
            },
          ],
        },
        TEST_CREDENTIALS,
      );

      assertEquals(result.FailedEntryCount, 1);
      const entries = result.Entries as Record<string, unknown>[];
      assertEquals(entries.length, 2);
      assertEquals(entries[0].EventId, "evt-aaa-111");
      assertEquals(entries[0].ErrorCode, undefined);
      assertEquals(entries[1].ErrorCode, "InternalFailure");
      assertEquals(entries[1].ErrorMessage, "Internal service failure");
    } finally {
      if (saved !== undefined) Deno.env.set("AWS_ENDPOINT_URL", saved);
      else Deno.env.delete("AWS_ENDPOINT_URL");
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "putEvents returns all entries failed",
  sanitizeResources: false,
  fn: async () => {
    const { server, url } = createMockServer((_req) => {
      return jsonResponse({
        FailedEntryCount: 2,
        Entries: [
          {
            ErrorCode: "ThrottlingException",
            ErrorMessage: "Rate exceeded",
          },
          {
            ErrorCode: "ThrottlingException",
            ErrorMessage: "Rate exceeded",
          },
        ],
      });
    });

    const saved = Deno.env.get("AWS_ENDPOINT_URL");
    try {
      Deno.env.set("AWS_ENDPOINT_URL", url);
      const result = await putEvents(
        {
          entries: [
            {
              Source: "my.app",
              DetailType: "Event1",
              Detail: "{}",
            },
            {
              Source: "my.app",
              DetailType: "Event2",
              Detail: "{}",
            },
          ],
        },
        TEST_CREDENTIALS,
      );

      assertEquals(result.FailedEntryCount, 2);
      const entries = result.Entries as Record<string, unknown>[];
      assertEquals(entries.length, 2);
      assertEquals(entries[0].ErrorCode, "ThrottlingException");
      assertEquals(entries[1].ErrorCode, "ThrottlingException");
    } finally {
      if (saved !== undefined) Deno.env.set("AWS_ENDPOINT_URL", saved);
      else Deno.env.delete("AWS_ENDPOINT_URL");
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "putEvents throws on AccessDeniedException",
  sanitizeResources: false,
  fn: async () => {
    const { server, url } = createMockServer((_req) => {
      return errorResponse(
        "AccessDeniedException",
        "User is not authorized to perform events:PutEvents",
        403,
      );
    });

    const saved = Deno.env.get("AWS_ENDPOINT_URL");
    try {
      Deno.env.set("AWS_ENDPOINT_URL", url);
      await assertRejects(
        () =>
          putEvents(
            {
              entries: [
                {
                  Source: "my.app",
                  DetailType: "Test",
                  Detail: "{}",
                },
              ],
            },
            TEST_CREDENTIALS,
          ),
        Error,
        "Access denied",
      );
    } finally {
      if (saved !== undefined) Deno.env.set("AWS_ENDPOINT_URL", saved);
      else Deno.env.delete("AWS_ENDPOINT_URL");
      await server.shutdown();
    }
  },
});

Deno.test({
  name: "putEvents throws on ValidationException",
  sanitizeResources: false,
  fn: async () => {
    const { server, url } = createMockServer((_req) => {
      return errorResponse(
        "ValidationException",
        "1 validation error: entries must not be empty",
        400,
      );
    });

    const saved = Deno.env.get("AWS_ENDPOINT_URL");
    try {
      Deno.env.set("AWS_ENDPOINT_URL", url);
      await assertRejects(
        () =>
          putEvents(
            {
              entries: [],
            },
            TEST_CREDENTIALS,
          ),
        Error,
        "Invalid request",
      );
    } finally {
      if (saved !== undefined) Deno.env.set("AWS_ENDPOINT_URL", saved);
      else Deno.env.delete("AWS_ENDPOINT_URL");
      await server.shutdown();
    }
  },
});
