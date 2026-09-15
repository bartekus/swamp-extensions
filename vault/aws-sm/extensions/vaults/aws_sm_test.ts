// Swamp, an Automation Framework
// Copyright (C) 2026 Elder Swamp Club, Inc.
//
// This file is part of Swamp.
//
// Swamp is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License version 3
// as published by the Free Software Foundation, with the Swamp
// Extension and Definition Exception (found in the "COPYING-EXCEPTION"
// file).
//
// Swamp is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with Swamp.  If not, see <https://www.gnu.org/licenses/>.

import {
  assert,
  assertEquals,
  assertExists,
  assertRejects,
  assertThrows,
} from "jsr:@std/assert@1.0.19";
import {
  assertVaultConformance,
  assertVaultExportConformance,
} from "@systeminit/swamp-testing";
import {
  createVaultAnnotation,
  vault,
  type VaultAnnotationProvider,
  type VaultDeleteProvider,
} from "./aws_sm.ts";
import { AwsSmOperationError } from "./aws_sm_errors.ts";

Deno.test("vault export conforms to VaultProvider contract", () => {
  assertVaultExportConformance(vault, {
    validConfigs: [
      { region: "us-east-1" },
      { region: "eu-west-1" },
      { region: "us-east-1", profile: "my-profile" },
    ],
    invalidConfigs: [
      {},
      { region: "" },
      // An empty profile is rejected rather than silently falling back to the
      // default chain — same treatment `region` gets.
      { region: "us-east-1", profile: "" },
    ],
  });
});

Deno.test("createProvider throws on invalid config", () => {
  assertThrows(
    () => vault.createProvider("bad-vault", {}),
    Error,
  );
});

// Guards the #2095 fix: unknown config keys must error rather than being
// silently stripped. This used to use `profile` as its unknown key; `profile`
// became a recognized key in #2099, so the guard moved to a key that is still
// genuinely unknown. Deleting the test instead would have dropped the guard.
Deno.test("configSchema rejects unknown keys", () => {
  assertThrows(
    () =>
      vault.configSchema.parse({
        region: "us-east-1",
        bogusKey: "some-value",
      }),
    Error,
    "Unrecognized key",
  );
});

Deno.test("configSchema accepts an optional profile", () => {
  const parsed = vault.configSchema.parse({
    region: "us-east-1",
    profile: "Developer-xero-ps-sre-test",
  });
  assertEquals(parsed.profile, "Developer-xero-ps-sre-test");
});

Deno.test("configSchema leaves profile undefined when omitted", () => {
  const parsed = vault.configSchema.parse({ region: "us-east-1" });
  assertEquals(parsed.profile, undefined);
});

Deno.test("configSchema rejects an empty profile", () => {
  assertThrows(
    () => vault.configSchema.parse({ region: "us-east-1", profile: "" }),
    Error,
  );
});

// --- Behavioral tests using a local mock AWS server ---

/**
 * Per-target override response for the mock AWS server. When set for a
 * given operation (GetSecretValue, PutSecretValue, etc.), the override
 * takes precedence over the default secrets-Map behaviour. Tests use
 * this to inject error bodies — including malformed bodies without the
 * expected `__type` field — without rebuilding the mock server.
 */
interface MockResponse {
  status: number;
  body: BodyInit | null;
  contentType?: string;
}

interface MockOverrides {
  GetSecretValue?: MockResponse;
  PutSecretValue?: MockResponse;
  CreateSecret?: MockResponse;
  DeleteSecret?: MockResponse;
  ListSecrets?: MockResponse;
  DescribeSecret?: MockResponse;
  UpdateSecret?: MockResponse;
  TagResource?: MockResponse;
  UntagResource?: MockResponse;
}

function mockResponse(r: MockResponse): Response {
  return new Response(r.body, {
    status: r.status,
    headers: {
      "content-type": r.contentType ?? "application/x-amz-json-1.1",
    },
  });
}

interface SecretMetadata {
  description: string;
  tags: Map<string, string>;
}

// AWS Secrets Manager tag values are restricted to this charset (letters,
// separators, numbers, and `_ . : / = + - @`). `?`, `&`, and `%` are NOT
// allowed — see issue #495.
const AWS_TAG_VALUE_PATTERN = /^[\p{L}\p{Z}\p{N}_.:/=+\-@]*$/u;

/** Start a local HTTP server that simulates AWS Secrets Manager. */
function startMockAwsServer(overrides: MockOverrides = {}): {
  url: string;
  server: Deno.HttpServer;
  secrets: Map<string, string>;
  metadata: Map<string, SecretMetadata>;
} {
  const secrets = new Map<string, string>();
  const metadata = new Map<string, SecretMetadata>();

  function ensureMetadata(secretId: string): SecretMetadata {
    let meta = metadata.get(secretId);
    if (!meta) {
      meta = { description: "", tags: new Map() };
      metadata.set(secretId, meta);
    }
    return meta;
  }

  function tagsToArray(
    tags: Map<string, string>,
  ): { Key: string; Value: string }[] {
    return [...tags.entries()].map(([Key, Value]) => ({ Key, Value }));
  }

  const server = Deno.serve({ port: 0, onListen() {} }, async (req) => {
    const target = req.headers.get("x-amz-target") ?? "";
    const body = await req.json();

    if (target.includes("GetSecretValue")) {
      if (overrides.GetSecretValue) {
        return mockResponse(overrides.GetSecretValue);
      }
      const val = secrets.get(body.SecretId);
      if (!val) {
        return Response.json({
          __type: "ResourceNotFoundException",
          Message: `Secret ${body.SecretId} not found`,
        }, { status: 400 });
      }
      return Response.json({ SecretString: val });
    }

    if (target.includes("PutSecretValue")) {
      if (overrides.PutSecretValue) {
        return mockResponse(overrides.PutSecretValue);
      }
      secrets.set(body.SecretId, body.SecretString);
      return Response.json({});
    }

    if (target.includes("CreateSecret")) {
      if (overrides.CreateSecret) return mockResponse(overrides.CreateSecret);
      secrets.set(body.Name, body.SecretString);
      const meta = ensureMetadata(body.Name);
      if (body.Tags) {
        for (const tag of body.Tags) {
          meta.tags.set(tag.Key, tag.Value);
        }
      }
      return Response.json({ Name: body.Name });
    }

    if (target.includes("DeleteSecret")) {
      if (overrides.DeleteSecret) return mockResponse(overrides.DeleteSecret);
      if (!secrets.has(body.SecretId)) {
        return Response.json({
          __type: "ResourceNotFoundException",
          Message: `Secret ${body.SecretId} not found`,
        }, { status: 400 });
      }
      secrets.delete(body.SecretId);
      metadata.delete(body.SecretId);
      return Response.json({ Name: body.SecretId });
    }

    if (target.includes("DescribeSecret")) {
      if (overrides.DescribeSecret) {
        return mockResponse(overrides.DescribeSecret);
      }
      if (!secrets.has(body.SecretId)) {
        return Response.json({
          __type: "ResourceNotFoundException",
          Message: `Secret ${body.SecretId} not found`,
        }, { status: 400 });
      }
      const meta = ensureMetadata(body.SecretId);
      return Response.json({
        Name: body.SecretId,
        Description: meta.description,
        Tags: tagsToArray(meta.tags),
        LastChangedDate: Date.now() / 1000,
      });
    }

    if (target.includes("UpdateSecret")) {
      if (overrides.UpdateSecret) {
        return mockResponse(overrides.UpdateSecret);
      }
      if (!secrets.has(body.SecretId)) {
        return Response.json({
          __type: "ResourceNotFoundException",
          Message: `Secret ${body.SecretId} not found`,
        }, { status: 400 });
      }
      const meta = ensureMetadata(body.SecretId);
      if (body.Description !== undefined) {
        meta.description = body.Description;
      }
      return Response.json({ Name: body.SecretId });
    }

    if (target.includes("TagResource")) {
      if (overrides.TagResource) return mockResponse(overrides.TagResource);
      const meta = ensureMetadata(body.SecretId);
      for (const tag of body.Tags ?? []) {
        // Mirror AWS's documented tag-value charset. Values containing
        // characters outside this set — e.g. the `?` and `&` of a URL query
        // string — are rejected by the real TagResource API. This is the
        // regression guard for issue #495: if the URL is ever routed back
        // through a tag, these tests fail loudly.
        if (!AWS_TAG_VALUE_PATTERN.test(tag.Value)) {
          return Response.json({
            __type: "InvalidRequestException",
            Message: "Request rejected by the downstream tagging service",
          }, { status: 400 });
        }
        meta.tags.set(tag.Key, tag.Value);
      }
      return Response.json({});
    }

    if (target.includes("UntagResource")) {
      if (overrides.UntagResource) return mockResponse(overrides.UntagResource);
      const meta = ensureMetadata(body.SecretId);
      for (const key of body.TagKeys ?? []) {
        meta.tags.delete(key);
      }
      return Response.json({});
    }

    if (target.includes("ListSecrets")) {
      if (overrides.ListSecrets) return mockResponse(overrides.ListSecrets);
      return Response.json({
        SecretList: [...secrets.keys()].map((n) => {
          const meta = metadata.get(n);
          return {
            Name: n,
            Description: meta?.description ?? "",
            Tags: meta ? tagsToArray(meta.tags) : [],
            LastChangedDate: Date.now() / 1000,
          };
        }),
      });
    }

    return Response.json({ __type: "UnknownOperationException" }, {
      status: 400,
    });
  });

  const addr = server.addr as Deno.NetAddr;
  return { url: `http://localhost:${addr.port}`, server, secrets, metadata };
}

/**
 * Run a test with a mock AWS server, setting AWS_ENDPOINT_URL and fake
 * credentials. AWS_PROFILE is scrubbed for the duration of the test so
 * a developer's shell env doesn't poison hint assertions (which read
 * AWS_PROFILE at wrap time and embed it in the suggested SSO command).
 */
interface MockAwsOptions {
  overrides?: MockOverrides;
  /**
   * Named profiles to write into a temporary shared config/credentials pair.
   *
   * Required for any test exercising the `profile` config option: that path
   * routes through `fromIni`, which reads the ini files and ignores the
   * AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY this harness exports. Without a
   * temp ini, such a test would silently resolve against the developer's real
   * ~/.aws — environment-dependent, and a false pass on a machine that happens
   * to have a matching profile.
   *
   * Deliberately writes NO `[default]` section, so a provider configured with
   * no profile (or a profile absent from this map) fails to resolve credentials
   * rather than falling through to a default that would mask which provider
   * actually supplied them.
   */
  profiles?: Record<string, { accessKeyId: string; secretAccessKey: string }>;
}

async function withMockAws<T>(
  fn: (
    secrets: Map<string, string>,
    metadata: Map<string, SecretMetadata>,
  ) => Promise<T>,
  options: MockOverrides | MockAwsOptions = {},
): Promise<T> {
  // Back-compat: existing call sites pass a bare MockOverrides object.
  const opts: MockAwsOptions = "overrides" in options || "profiles" in options
    ? options as MockAwsOptions
    : { overrides: options as MockOverrides };
  const { url, server, secrets, metadata } = startMockAwsServer(
    opts.overrides ?? {},
  );
  const originalEndpoint = Deno.env.get("AWS_ENDPOINT_URL");
  const originalKey = Deno.env.get("AWS_ACCESS_KEY_ID");
  const originalSecret = Deno.env.get("AWS_SECRET_ACCESS_KEY");
  const originalProfile = Deno.env.get("AWS_PROFILE");
  const originalConfigFile = Deno.env.get("AWS_CONFIG_FILE");
  const originalCredentialsFile = Deno.env.get("AWS_SHARED_CREDENTIALS_FILE");

  Deno.env.set("AWS_ENDPOINT_URL", url);
  // SDK needs credentials even for a mock endpoint
  Deno.env.set("AWS_ACCESS_KEY_ID", "test");
  Deno.env.set("AWS_SECRET_ACCESS_KEY", "test");
  Deno.env.delete("AWS_PROFILE");

  // Point the ini sources at a temp dir for every test, not just those passing
  // `profiles`. An empty ini is what makes "no usable profile" a reliable
  // outcome; leaving the vars unset would let a real ~/.aws leak in.
  const tempDir = await Deno.makeTempDir({ prefix: "aws-sm-test-" });
  const configPath = `${tempDir}/config`;
  const credentialsPath = `${tempDir}/credentials`;
  let config = "";
  let credentials = "";
  for (const [name, creds] of Object.entries(opts.profiles ?? {})) {
    config += `[profile ${name}]\nregion = us-east-1\n\n`;
    credentials += `[${name}]\naws_access_key_id = ${creds.accessKeyId}\n` +
      `aws_secret_access_key = ${creds.secretAccessKey}\n\n`;
  }
  await Deno.writeTextFile(configPath, config);
  await Deno.writeTextFile(credentialsPath, credentials);
  Deno.env.set("AWS_CONFIG_FILE", configPath);
  Deno.env.set("AWS_SHARED_CREDENTIALS_FILE", credentialsPath);

  try {
    return await fn(secrets, metadata);
  } finally {
    if (originalConfigFile !== undefined) {
      Deno.env.set("AWS_CONFIG_FILE", originalConfigFile);
    } else {
      Deno.env.delete("AWS_CONFIG_FILE");
    }
    if (originalCredentialsFile !== undefined) {
      Deno.env.set("AWS_SHARED_CREDENTIALS_FILE", originalCredentialsFile);
    } else {
      Deno.env.delete("AWS_SHARED_CREDENTIALS_FILE");
    }
    await Deno.remove(tempDir, { recursive: true });
    if (originalEndpoint) {
      Deno.env.set("AWS_ENDPOINT_URL", originalEndpoint);
    } else {
      Deno.env.delete("AWS_ENDPOINT_URL");
    }
    if (originalKey) {
      Deno.env.set("AWS_ACCESS_KEY_ID", originalKey);
    } else {
      Deno.env.delete("AWS_ACCESS_KEY_ID");
    }
    if (originalSecret) {
      Deno.env.set("AWS_SECRET_ACCESS_KEY", originalSecret);
    } else {
      Deno.env.delete("AWS_SECRET_ACCESS_KEY");
    }
    if (originalProfile !== undefined) {
      Deno.env.set("AWS_PROFILE", originalProfile);
    } else {
      Deno.env.delete("AWS_PROFILE");
    }
    await server.shutdown();
  }
}

// AWS SDK keeps TCP connections alive (connection pooling), which triggers
// Deno's resource leak detection. sanitizeResources: false is safe here
// because the connections are cleaned up when the SDK client is garbage collected.

// AWS SDK keeps TCP connections alive (connection pooling), which triggers
// Deno's resource leak detection. sanitizeResources: false is needed for
// tests that create SDK clients against the mock server.

Deno.test({
  name: "aws-sm vault: get returns stored secret",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("my-key", "my-value");
      const result = await provider.get("my-key");
      assertEquals(result, "my-value");
    });
  },
});

Deno.test({
  name: "aws-sm vault: get rejects for missing secret",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await assertRejects(() => provider.get("nonexistent"));
    });
  },
});

Deno.test({
  name: "aws-sm vault: list returns stored keys",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("key-a", "val-a");
      await provider.put("key-b", "val-b");
      const keys = await provider.list();
      assertEquals(keys.includes("key-a"), true);
      assertEquals(keys.includes("key-b"), true);
    });
  },
});

Deno.test({
  name: "aws-sm vault: put overwrites existing secret",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("my-key", "original");
      await provider.put("my-key", "updated");
      const result = await provider.get("my-key");
      assertEquals(result, "updated");
    });
  },
});

// --- `profile` config option (issue #2099) ---

Deno.test({
  name: "aws-sm vault: profile-configured provider round-trips a secret",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", {
        region: "us-east-1",
        profile: "swamp-test",
      });
      await provider.put("my-key", "my-value");
      assertEquals(await provider.get("my-key"), "my-value");
      assertEquals((await provider.list()).includes("my-key"), true);
    }, {
      profiles: {
        "swamp-test": {
          accessKeyId: "ini-key",
          secretAccessKey: "ini-secret",
        },
      },
    });
  },
});

// THE DISCRIMINATOR. The harness exports a complete, usable
// AWS_ACCESS_KEY_ID/AWS_SECRET_ACCESS_KEY pair, and the temp ini has no
// [default] section. So if credentials came from the environment this passes
// regardless of the profile, and if they came from the ini it passes only
// because the named profile resolved. To tell those apart, the profile named
// here is absent from the ini: the operation MUST fail. A pass would mean the
// env provider served the request and `profile` was ignored — the silent
// wrong-credentials bug this option exists to prevent.
Deno.test({
  name:
    "aws-sm vault: configured profile outranks environment credentials (missing profile fails despite valid env)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      assertEquals(Deno.env.get("AWS_ACCESS_KEY_ID"), "test");
      assertEquals(Deno.env.get("AWS_SECRET_ACCESS_KEY"), "test");
      const provider = vault.createProvider("test", {
        region: "us-east-1",
        profile: "absent-from-ini",
      });
      await assertRejects(() => provider.get("my-key"));
    }, {
      profiles: {
        "some-other-profile": {
          accessKeyId: "ini-key",
          secretAccessKey: "ini-secret",
        },
      },
    });
  },
});

// The control for the test above: same harness, same env credentials, no
// profile configured. This one MUST succeed. Without it, the failure above
// could be caused by anything (a broken mock, a bad region) rather than by
// credential resolution going to the ini.
Deno.test({
  name:
    "aws-sm vault: control — no profile configured still uses environment credentials",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("my-key", "my-value");
      assertEquals(await provider.get("my-key"), "my-value");
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: missing profile reports profile-not-found, not an expired SSO session",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", {
        region: "us-east-1",
        profile: "no-such-profile",
      });
      const err = await assertRejects(() => provider.get("my-key"));
      assert(err instanceof AwsSmOperationError);
      assert(
        err.message.includes("no-such-profile"),
        `expected the hint to name the profile, got: ${err.message}`,
      );
      assert(
        err.message.includes("was not found in ~/.aws/config"),
        `expected a profile-not-found hint, got: ${err.message}`,
      );
      // The misdiagnosis this replaces: CredentialsProviderError classifies as
      // 'session-expired', which would tell the user to refresh an SSO session
      // for a profile that does not exist and may never have been SSO-based.
      assert(
        !err.message.includes("aws sso login"),
        `expected no SSO-refresh advice, got: ${err.message}`,
      );
      // Credential resolution fails before any HTTP request, so there is no
      // $metadata to carry status or request id.
      assertEquals(err.httpStatusCode, undefined);
      assertEquals(err.requestId, undefined);
    }, {
      profiles: {
        "some-other-profile": {
          accessKeyId: "ini-key",
          secretAccessKey: "ini-secret",
        },
      },
    });
  },
});

// SDK-wrap defense: a malformed error body (non-JSON, no `__type`) while a
// profile is configured must still produce a wrapped error whose credential
// hint names the configured profile rather than AWS_PROFILE.
Deno.test({
  name:
    "aws-sm vault: malformed 403 with a configured profile names that profile in the hint",
  sanitizeResources: false,
  fn: async () => {
    const originalProfile = Deno.env.get("AWS_PROFILE");
    try {
      await withMockAws(async () => {
        // A conflicting env profile: the hint must name the configured one.
        Deno.env.set("AWS_PROFILE", "env-profile");
        const provider = vault.createProvider("test", {
          region: "us-east-1",
          profile: "swamp-test",
        });
        const err = await assertRejects(() => provider.get("my-key"));
        assert(err instanceof AwsSmOperationError);
        assert(
          err.message.includes("swamp-test"),
          `expected the configured profile in the hint, got: ${err.message}`,
        );
        assert(
          !err.message.includes("env-profile"),
          `expected AWS_PROFILE not to win, got: ${err.message}`,
        );
      }, {
        overrides: {
          GetSecretValue: {
            status: 403,
            body: "<html>403 Forbidden</html>",
            contentType: "text/html",
          },
        },
        profiles: {
          "swamp-test": {
            accessKeyId: "ini-key",
            secretAccessKey: "ini-secret",
          },
        },
      });
    } finally {
      if (originalProfile !== undefined) {
        Deno.env.set("AWS_PROFILE", originalProfile);
      } else {
        Deno.env.delete("AWS_PROFILE");
      }
    }
  },
});

Deno.test({
  name: "aws-sm vault: passes full VaultProvider conformance",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await assertVaultConformance(provider);
    });
  },
});

// --- Error-wrapping behavioural tests ---

Deno.test({
  name:
    "aws-sm vault: get on ExpiredTokenException → 'Vault session expired:' prefix",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const err = await assertRejects(() => provider.get("anything"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.name, "ExpiredTokenException");
      assert(
        err.message.startsWith("Vault session expired:"),
        `expected "Vault session expired:" prefix, got: ${err.message}`,
      );
    }, {
      GetSecretValue: {
        status: 400,
        body: JSON.stringify({
          __type: "ExpiredTokenException",
          Message: "The security token included in the request is expired",
        }),
      },
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: get on 403 AccessDenied → 'Vault credentials rejected by AWS:' prefix",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const err = await assertRejects(() => provider.get("anything"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.httpStatusCode, 403);
      assert(
        err.message.startsWith("Vault credentials rejected by AWS:"),
        `expected "Vault credentials rejected by AWS:" prefix, got: ${err.message}`,
      );
    }, {
      GetSecretValue: {
        status: 403,
        body: JSON.stringify({
          __type: "AccessDenied",
          Message: "Access denied",
        }),
      },
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: list propagates the wrapper on credential error (covers all four ops)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const err = await assertRejects(() => provider.list());
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.name, "ExpiredTokenException");
      assert(err.message.startsWith("Vault session expired:"));
    }, {
      ListSecrets: {
        status: 400,
        body: JSON.stringify({
          __type: "ExpiredTokenException",
          Message: "The security token included in the request is expired",
        }),
      },
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: put initial PutSecretValue propagates the wrapper on credential error",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const err = await assertRejects(() => provider.put("k", "v"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.name, "ExpiredTokenException");
      assert(err.message.startsWith("Vault session expired:"));
    }, {
      PutSecretValue: {
        status: 400,
        body: JSON.stringify({
          __type: "ExpiredTokenException",
          Message: "The security token included in the request is expired",
        }),
      },
    });
  },
});

// Regression guard for the instanceof → name migration in put(): the
// previous implementation used `error instanceof ResourceNotFoundException`
// against the raw SDK error class. After wrapping, the thrown error is
// AwsSmOperationError, so the check became `error.name === ...`. If that
// migration regresses, this test fails because the secret never gets
// created (PutSecretValue rethrows AwsSmOperationError instead of falling
// through to CreateSecret).
Deno.test({
  name:
    "aws-sm vault: put fallback to CreateSecret still works after wrapper migration",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      // No override on CreateSecret → mock writes to secrets Map.
      await provider.put("brand-new-key", "the-value");
      assertEquals(secrets.get("brand-new-key"), "the-value");
    }, {
      PutSecretValue: {
        status: 400,
        body: JSON.stringify({
          __type: "ResourceNotFoundException",
          Message: "Secret not found",
        }),
      },
    });
  },
});

Deno.test({
  name: "aws-sm vault: put with tags passes Tags to CreateSecretCommand",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("tagged-secret", "my-value", {
        tags: { environment: "production", team: "platform" },
      });
      assertEquals(secrets.get("tagged-secret"), "my-value");
      const meta = metadata.get("tagged-secret");
      assertExists(meta);
      assertEquals(meta.tags.get("environment"), "production");
      assertEquals(meta.tags.get("team"), "platform");
    }, {
      PutSecretValue: {
        status: 400,
        body: JSON.stringify({
          __type: "ResourceNotFoundException",
          Message: "Secret not found",
        }),
      },
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: put with tags on existing secret ignores tags (update path)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("existing-key", "first-value");
      await provider.put("existing-key", "second-value", {
        tags: { environment: "staging" },
      });
      assertEquals(secrets.get("existing-key"), "second-value");
      const meta = metadata.get("existing-key");
      assertEquals(meta?.tags.size ?? 0, 0);
    });
  },
});

Deno.test({
  name: "aws-sm vault: put without tags still works (backward compat)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("no-tags-key", "value");
      assertEquals(secrets.get("no-tags-key"), "value");
      const meta = metadata.get("no-tags-key");
      assertEquals(meta?.tags.size ?? 0, 0);
    }, {
      PutSecretValue: {
        status: 400,
        body: JSON.stringify({
          __type: "ResourceNotFoundException",
          Message: "Secret not found",
        }),
      },
    });
  },
});

// SDK Wrap Defense: a malformed error response (no __type, no Message)
// must still surface as an AwsSmOperationError with HTTP status, and
// the wrapper's noise filters must strip the SDK's "Unknown" /
// "UnknownError" defaults. Empirically verified at
// @aws-sdk/client-secrets-manager@3.1024.0 (probe 2026-05-06): an HTTP
// 400 with body "{}" produces err.name="Unknown" and
// err.message="UnknownError".
Deno.test({
  name:
    "aws-sm vault: malformed error body without __type still surfaces a clean message",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const err = await assertRejects(() => provider.get("anything"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.httpStatusCode, 400);
      assert(err.message.includes("AWS Secrets Manager GetSecretValue failed"));
      assert(err.message.includes("HTTP 400"));
      assert(
        !err.message.includes("Unknown"),
        `expected wrapped message to NOT contain "Unknown", got: ${err.message}`,
      );
      assert(
        !err.message.includes("UnknownError"),
        `expected wrapped message to NOT contain "UnknownError", got: ${err.message}`,
      );
    }, {
      GetSecretValue: { status: 400, body: "{}" },
    });
  },
});

// --- VaultAnnotationProvider behavioral tests ---

function asAnnotationProvider(
  provider: ReturnType<typeof vault.createProvider>,
): VaultAnnotationProvider {
  return provider as unknown as VaultAnnotationProvider;
}

Deno.test({
  name: "aws-sm vault: putAnnotation/getAnnotation roundtrip",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("annotated-secret", "secret-value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "annotated-secret",
        createVaultAnnotation({
          url: "https://console.aws.amazon.com/secretsmanager",
          notes: "Production API key",
          labels: { env: "prod", team: "infra" },
        }),
      );

      const annotation = await ap.getAnnotation("annotated-secret");
      assert(annotation !== null);
      assertEquals(
        annotation.url,
        "https://console.aws.amazon.com/secretsmanager",
      );
      assertEquals(annotation.notes, "Production API key");
      assertEquals(annotation.labels?.env, "prod");
      assertEquals(annotation.labels?.team, "infra");
      assert(annotation.updatedAt !== undefined);
    });
  },
});

Deno.test({
  name: "aws-sm vault: getAnnotation returns null for unannotated secret",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("bare-secret", "value");

      const ap = asAnnotationProvider(provider);
      const annotation = await ap.getAnnotation("bare-secret");
      assertEquals(annotation, null);
    });
  },
});

Deno.test({
  name: "aws-sm vault: putAnnotation with only notes",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("notes-only", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "notes-only",
        createVaultAnnotation({ notes: "Just a note" }),
      );

      const annotation = await ap.getAnnotation("notes-only");
      assert(annotation !== null);
      assertEquals(annotation.notes, "Just a note");
      assertEquals(annotation.url, undefined);
      assertEquals(Object.keys(annotation.labels).length, 0);
    });
  },
});

Deno.test({
  name: "aws-sm vault: putAnnotation with only url",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("url-only", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "url-only",
        createVaultAnnotation({ url: "https://example.com" }),
      );

      const annotation = await ap.getAnnotation("url-only");
      assert(annotation !== null);
      assertEquals(annotation.url, "https://example.com");
      assertEquals(annotation.notes, undefined);
      assertEquals(Object.keys(annotation.labels).length, 0);
    });
  },
});

Deno.test({
  name: "aws-sm vault: putAnnotation with only labels",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("labels-only", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "labels-only",
        createVaultAnnotation({ labels: { env: "staging" } }),
      );

      const annotation = await ap.getAnnotation("labels-only");
      assert(annotation !== null);
      assertEquals(annotation.url, undefined);
      assertEquals(annotation.notes, undefined);
      assertEquals(annotation.labels?.env, "staging");
    });
  },
});

Deno.test({
  name: "aws-sm vault: deleteAnnotation clears notes and url",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("to-delete", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "to-delete",
        createVaultAnnotation({
          url: "https://example.com",
          notes: "Will be deleted",
        }),
      );

      const before = await ap.getAnnotation("to-delete");
      assert(before !== null);

      await ap.deleteAnnotation("to-delete");

      const after = await ap.getAnnotation("to-delete");
      assertEquals(after, null);
    });
  },
});

Deno.test({
  name: "aws-sm vault: deleteAnnotation preserves non-swamp tags (issue #1406)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      secrets.set("tagged-secret", "value");
      metadata.set("tagged-secret", {
        description: "Some notes\n\nswamp:url=https://example.com",
        tags: new Map([
          ["env", "prod"],
          ["team", "infra"],
          ["swamp:url", "https://old.example.com"],
          ["swamp:managed", "true"],
        ]),
      });

      const ap = asAnnotationProvider(provider);
      await ap.deleteAnnotation("tagged-secret");

      const after = metadata.get("tagged-secret")!;
      assertEquals(after.description, "");
      assertEquals(after.tags.has("swamp:url"), false);
      assertEquals(after.tags.has("swamp:managed"), false);
      assertEquals(after.tags.get("env"), "prod");
      assertEquals(after.tags.get("team"), "infra");
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: deleteAnnotation removes labels written by putAnnotation",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("labeled-secret", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "labeled-secret",
        createVaultAnnotation({
          url: "https://example.com",
          notes: "Some notes",
          labels: { env: "prod" },
        }),
      );

      await ap.deleteAnnotation("labeled-secret");

      const after = await ap.getAnnotation("labeled-secret");
      assertEquals(after, null);
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: putAnnotation writes labels with swamp: prefix and reads them back",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (_secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("prefixed", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "prefixed",
        createVaultAnnotation({ labels: { env: "prod", team: "infra" } }),
      );

      const meta = metadata.get("prefixed")!;
      assertEquals(meta.tags.has("swamp:env"), true);
      assertEquals(meta.tags.has("swamp:team"), true);
      assertEquals(meta.tags.has("env"), false);

      const annotation = await ap.getAnnotation("prefixed");
      assert(annotation !== null);
      assertEquals(annotation.labels.env, "prod");
      assertEquals(annotation.labels.team, "infra");
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: readAnnotationFields reads bare tags as labels (back-compat)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      secrets.set("legacy-labels", "value");
      metadata.set("legacy-labels", {
        description: "",
        tags: new Map([
          ["env", "staging"],
          ["team", "platform"],
        ]),
      });

      const ap = asAnnotationProvider(provider);
      const annotation = await ap.getAnnotation("legacy-labels");
      assert(annotation !== null);
      assertEquals(annotation.labels.env, "staging");
      assertEquals(annotation.labels.team, "platform");
    });
  },
});

Deno.test({
  name: "aws-sm vault: listAnnotations returns only annotated secrets",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("annotated", "value1");
      await provider.put("bare", "value2");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "annotated",
        createVaultAnnotation({ notes: "Has annotation" }),
      );

      const all = await ap.listAnnotations();
      assertEquals(all.size, 1);
      assert(all.has("annotated"));
      assertEquals(all.get("annotated")?.notes, "Has annotation");
      assert(!all.has("bare"));
    });
  },
});

Deno.test({
  name: "aws-sm vault: listAnnotations returns empty map when none annotated",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("bare1", "value1");
      await provider.put("bare2", "value2");

      const ap = asAnnotationProvider(provider);
      const all = await ap.listAnnotations();
      assertEquals(all.size, 0);
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: DescribeSecret credential error → 'Vault session expired:' prefix",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("target", "value");

      const ap = asAnnotationProvider(provider);
      const err = await assertRejects(() => ap.getAnnotation("target"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.name, "ExpiredTokenException");
      assert(
        err.message.startsWith("Vault session expired:"),
        `expected "Vault session expired:" prefix, got: ${err.message}`,
      );
    }, {
      DescribeSecret: {
        status: 400,
        body: JSON.stringify({
          __type: "ExpiredTokenException",
          Message: "The security token included in the request is expired",
        }),
      },
    });
  },
});

Deno.test({
  name: "aws-sm vault: malformed DescribeSecret response wraps cleanly",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("target", "value");

      const ap = asAnnotationProvider(provider);
      const err = await assertRejects(() => ap.getAnnotation("target"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.httpStatusCode, 500);
      assert(
        err.message.includes("AWS Secrets Manager DescribeSecret failed"),
      );
    }, {
      DescribeSecret: { status: 500, body: "{}" },
    });
  },
});

Deno.test({
  name: "aws-sm vault: TagResource error surfaces actionable message",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("tag-fail", "value");

      const ap = asAnnotationProvider(provider);
      const err = await assertRejects(() =>
        ap.putAnnotation(
          "tag-fail",
          createVaultAnnotation({ labels: { env: "prod" } }),
        )
      );
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.httpStatusCode, 400);
      assert(err.message.includes("AWS Secrets Manager TagResource failed"));
    }, {
      TagResource: {
        status: 400,
        body: JSON.stringify({
          __type: "InvalidParameterException",
          Message: "Too many tags",
        }),
      },
    });
  },
});

// --- issue #495: query-param URLs must not be routed through AWS tags ---

Deno.test({
  name: "aws-sm vault: URL with query params round-trips (issue #495)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (_secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("query-url", "value");

      const ap = asAnnotationProvider(provider);
      const url =
        "https://console.aws.amazon.com/secretsmanager/secret?name=foo&region=us-east-1";
      // Before the fix this rejected with InvalidRequestException because the
      // URL was stored as a tag value (the mock TagResource enforces AWS's
      // charset). It must now succeed by living in the Description instead.
      await ap.putAnnotation("query-url", createVaultAnnotation({ url }));

      const annotation = await ap.getAnnotation("query-url");
      assert(annotation !== null);
      assertEquals(annotation.url, url);
      // The URL must NOT have been written as a tag.
      assertEquals(metadata.get("query-url")?.tags.has("swamp:url"), false);
    });
  },
});

Deno.test({
  name: "aws-sm vault: url-only update preserves existing notes",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("partial", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "partial",
        createVaultAnnotation({ notes: "Existing note" }),
      );
      // Update only the url — notes must survive.
      await ap.putAnnotation(
        "partial",
        createVaultAnnotation({ url: "https://example.com/x?a=1&b=2" }),
      );

      const annotation = await ap.getAnnotation("partial");
      assert(annotation !== null);
      assertEquals(annotation.notes, "Existing note");
      assertEquals(annotation.url, "https://example.com/x?a=1&b=2");
    });
  },
});

Deno.test({
  name: "aws-sm vault: notes-only update preserves existing url",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("partial2", "value");

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "partial2",
        createVaultAnnotation({ url: "https://example.com/y?q=1" }),
      );
      // Update only the notes — url must survive.
      await ap.putAnnotation(
        "partial2",
        createVaultAnnotation({ notes: "Added later" }),
      );

      const annotation = await ap.getAnnotation("partial2");
      assert(annotation !== null);
      assertEquals(annotation.url, "https://example.com/y?q=1");
      assertEquals(annotation.notes, "Added later");
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: notes-only update preserves a LEGACY swamp:url tag (ADV-1)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets, metadata) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("legacy", "value");
      // Seed a pre-#495 secret: url lives in the swamp:url tag, not Description.
      secrets.set("legacy", "value");
      metadata.set("legacy", {
        description: "",
        tags: new Map([["swamp:url", "https://old.example.com/dash"]]),
      });

      const ap = asAnnotationProvider(provider);
      await ap.putAnnotation(
        "legacy",
        createVaultAnnotation({ notes: "New note" }),
      );

      const annotation = await ap.getAnnotation("legacy");
      assert(annotation !== null);
      // The legacy url must not be dropped by a notes-only update.
      assertEquals(annotation.url, "https://old.example.com/dash");
      assertEquals(annotation.notes, "New note");
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: getAnnotation reads a legacy swamp:url tag (back-compat)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets, metadata) => {
      vault.createProvider("test", { region: "us-east-1" });
      secrets.set("legacy-read", "value");
      metadata.set("legacy-read", {
        description: "Some notes",
        tags: new Map([["swamp:url", "https://legacy.example.com"]]),
      });

      const provider = vault.createProvider("test", { region: "us-east-1" });
      const ap = asAnnotationProvider(provider);
      const annotation = await ap.getAnnotation("legacy-read");
      assert(annotation !== null);
      assertEquals(annotation.url, "https://legacy.example.com");
      assertEquals(annotation.notes, "Some notes");

      const all = await ap.listAnnotations();
      assertEquals(all.get("legacy-read")?.url, "https://legacy.example.com");
    });
  },
});

Deno.test({
  name: "aws-sm vault: multi-line notes + url round-trip losslessly (ADV-4)",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("multiline", "value");

      const ap = asAnnotationProvider(provider);
      // Interior blank line and trailing whitespace must survive the round-trip.
      const notes = "Line one\n\nLine three   ";
      await ap.putAnnotation(
        "multiline",
        createVaultAnnotation({ notes, url: "https://example.com/z?p=1&q=2" }),
      );

      const annotation = await ap.getAnnotation("multiline");
      assert(annotation !== null);
      assertEquals(annotation.notes, notes);
      assertEquals(annotation.url, "https://example.com/z?p=1&q=2");
    });
  },
});

Deno.test({
  name: "aws-sm vault: annotating a missing secret fails via DescribeSecret",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const ap = asAnnotationProvider(provider);
      const err = await assertRejects(() =>
        ap.putAnnotation(
          "does-not-exist",
          createVaultAnnotation({ url: "https://example.com" }),
        )
      );
      assert(err instanceof AwsSmOperationError);
      assert(
        err.message.includes("AWS Secrets Manager DescribeSecret failed"),
        `expected a wrapped DescribeSecret error, got: ${err.message}`,
      );
    });
  },
});

// --- VaultDeleteProvider behavioral tests ---

function asDeleteProvider(
  provider: ReturnType<typeof vault.createProvider>,
): VaultDeleteProvider {
  return provider as unknown as VaultDeleteProvider;
}

Deno.test({
  name: "aws-sm vault: createProvider returns a VaultDeleteProvider",
  fn: () => {
    const provider = vault.createProvider("test", { region: "us-east-1" });
    assertEquals(
      typeof (provider as unknown as VaultDeleteProvider).delete,
      "function",
    );
  },
});

Deno.test({
  name: "aws-sm vault: delete removes an existing secret",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async (secrets) => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      await provider.put("to-delete", "secret-value");
      assertEquals(secrets.has("to-delete"), true);

      const dp = asDeleteProvider(provider);
      await dp.delete("to-delete");

      assertEquals(secrets.has("to-delete"), false);
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: delete non-existent secret throws ResourceNotFoundException",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const dp = asDeleteProvider(provider);
      const err = await assertRejects(() => dp.delete("nonexistent"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.name, "ResourceNotFoundException");
      assert(
        err.message.includes("AWS Secrets Manager DeleteSecret failed"),
        `expected DeleteSecret failure message, got: ${err.message}`,
      );
    });
  },
});

Deno.test({
  name:
    "aws-sm vault: delete on ExpiredTokenException → 'Vault session expired:' prefix",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const dp = asDeleteProvider(provider);
      const err = await assertRejects(() => dp.delete("anything"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.name, "ExpiredTokenException");
      assert(
        err.message.startsWith("Vault session expired:"),
        `expected "Vault session expired:" prefix, got: ${err.message}`,
      );
    }, {
      DeleteSecret: {
        status: 400,
        body: JSON.stringify({
          __type: "ExpiredTokenException",
          Message: "The security token included in the request is expired",
        }),
      },
    });
  },
});

Deno.test({
  name: "aws-sm vault: malformed DeleteSecret response wraps cleanly",
  sanitizeResources: false,
  fn: async () => {
    await withMockAws(async () => {
      const provider = vault.createProvider("test", { region: "us-east-1" });
      const dp = asDeleteProvider(provider);
      const err = await assertRejects(() => dp.delete("anything"));
      assert(err instanceof AwsSmOperationError);
      assertEquals(err.httpStatusCode, 400);
      assert(
        err.message.includes("AWS Secrets Manager DeleteSecret failed"),
      );
      assert(
        !err.message.includes("Unknown"),
        `expected wrapped message to NOT contain "Unknown", got: ${err.message}`,
      );
    }, {
      DeleteSecret: { status: 400, body: "{}" },
    });
  },
});
