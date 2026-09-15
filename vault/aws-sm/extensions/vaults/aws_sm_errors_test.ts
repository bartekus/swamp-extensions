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

import { assert, assertEquals } from "jsr:@std/assert@1.0.19";
import {
  AwsSmOperationError,
  classifyAwsCredentialError,
  deriveAwsErrorCode,
  formatAwsCredentialHint,
  wrapAwsSmError,
} from "./aws_sm_errors.ts";

// --- classifyAwsCredentialError ---

Deno.test("classifyAwsCredentialError: CredentialsProviderError → session-expired", () => {
  assertEquals(
    classifyAwsCredentialError("CredentialsProviderError", undefined),
    "session-expired",
  );
});

Deno.test("classifyAwsCredentialError: ExpiredTokenException → session-expired", () => {
  assertEquals(
    classifyAwsCredentialError("ExpiredTokenException", undefined),
    "session-expired",
  );
});

Deno.test("classifyAwsCredentialError: InvalidAccessKeyId → credentials-rejected", () => {
  assertEquals(
    classifyAwsCredentialError("InvalidAccessKeyId", 403),
    "credentials-rejected",
  );
});

Deno.test("classifyAwsCredentialError: SignatureDoesNotMatch → credentials-rejected", () => {
  assertEquals(
    classifyAwsCredentialError("SignatureDoesNotMatch", 403),
    "credentials-rejected",
  );
});

Deno.test("classifyAwsCredentialError: AccessDenied + 403 → credentials-rejected", () => {
  assertEquals(
    classifyAwsCredentialError("AccessDenied", 403),
    "credentials-rejected",
  );
});

Deno.test("classifyAwsCredentialError: AccessDenied + 401 → other (status guard)", () => {
  assertEquals(
    classifyAwsCredentialError("AccessDenied", 401),
    "other",
  );
});

// Same-shape regression case: a 403 with a non-credential code must NOT
// be misclassified as credentials-rejected. Mirrors the s3 case where
// BucketRegionMismatch + 403 surfaces as a non-credential auth failure.
Deno.test("classifyAwsCredentialError: BucketRegionMismatch + 403 → other", () => {
  assertEquals(
    classifyAwsCredentialError("BucketRegionMismatch", 403),
    "other",
  );
});

Deno.test("classifyAwsCredentialError: undefined code + 403 → other", () => {
  assertEquals(
    classifyAwsCredentialError(undefined, 403),
    "other",
  );
});

// --- formatAwsCredentialHint ---

Deno.test("formatAwsCredentialHint: session-expired with profile renders quoted --profile flag", () => {
  const hint = formatAwsCredentialHint("session-expired", "demo", "Vault");
  assert(hint !== undefined);
  // Profile is double-quoted so spaces in profile names don't break the
  // copy-pasted shell command.
  assert(hint.includes(`aws sso login --profile "demo"`));
  assert(hint.startsWith("Vault session expired:"));
});

Deno.test("formatAwsCredentialHint: session-expired with multi-word profile stays valid shell", () => {
  const hint = formatAwsCredentialHint(
    "session-expired",
    "my dev profile",
    "Vault",
  );
  assert(hint !== undefined);
  assert(hint.includes(`aws sso login --profile "my dev profile"`));
});

Deno.test("formatAwsCredentialHint: session-expired without profile renders generic command", () => {
  const hint = formatAwsCredentialHint("session-expired", undefined, "Vault");
  assert(hint !== undefined);
  assert(hint.includes("aws sso login"));
  assert(!hint.includes("--profile"));
  assert(hint.startsWith("Vault session expired:"));
});

Deno.test("formatAwsCredentialHint: credentials-rejected with profile names it", () => {
  const hint = formatAwsCredentialHint("credentials-rejected", "demo", "Vault");
  assert(hint !== undefined);
  assert(hint.includes("'demo'"));
  assert(hint.startsWith("Vault credentials rejected by AWS:"));
});

Deno.test("formatAwsCredentialHint: credentials-rejected without profile uses generic phrasing", () => {
  const hint = formatAwsCredentialHint(
    "credentials-rejected",
    undefined,
    "Vault",
  );
  assert(hint !== undefined);
  assert(hint.includes("your AWS profile"));
});

Deno.test("formatAwsCredentialHint: other → undefined (caller falls through)", () => {
  assertEquals(
    formatAwsCredentialHint("other", "demo", "Vault"),
    undefined,
  );
});

// --- deriveAwsErrorCode ---

Deno.test("deriveAwsErrorCode: prefers e.Code", () => {
  assertEquals(
    deriveAwsErrorCode({
      Code: "InvalidAccessKeyId",
      name: "Error",
    }),
    "InvalidAccessKeyId",
  );
});

Deno.test("deriveAwsErrorCode: falls back to e.name when set", () => {
  assertEquals(
    deriveAwsErrorCode({ name: "CredentialsProviderError" }),
    "CredentialsProviderError",
  );
});

Deno.test("deriveAwsErrorCode: ignores generic 'Error' name", () => {
  assertEquals(deriveAwsErrorCode({ name: "Error" }), undefined);
});

// Defensive coverage for minified SDK builds where the real class name
// appears as `_CredentialsProviderError` on the cause.
Deno.test("deriveAwsErrorCode: walks cause chain and strips leading underscore", () => {
  const inner = new Error("Token is expired");
  inner.name = "_CredentialsProviderError";
  assertEquals(
    deriveAwsErrorCode({ name: "Error", cause: inner }),
    "CredentialsProviderError",
  );
});

Deno.test("deriveAwsErrorCode: strips multiple leading underscores", () => {
  const inner = new Error("");
  inner.name = "__ExpiredTokenException";
  assertEquals(
    deriveAwsErrorCode({ name: "Error", cause: inner }),
    "ExpiredTokenException",
  );
});

// --- wrapAwsSmError direct tests ---

// The behavioural tests in aws_sm_test.ts only exercise error shapes the
// mock HTTP server can produce. Pre-flight credential failures (where the
// SDK's resolver fails before any HTTP request) cannot be reproduced
// against a mock — the SDK throws before reaching the server. These
// direct wrapAwsSmError tests cover the canonical pre-flight shapes so
// the wrapper is bound to the helpers, not just the helpers in isolation.

// Scrub AWS_PROFILE so a developer's shell env doesn't poison the
// generic-no-profile assertions below. Restored in finally for each
// test that touches it.
function withoutAwsProfile<T>(fn: () => T): T {
  const prev = Deno.env.get("AWS_PROFILE");
  Deno.env.delete("AWS_PROFILE");
  try {
    return fn();
  } finally {
    if (prev !== undefined) Deno.env.set("AWS_PROFILE", prev);
  }
}

// Empirically verified at @aws-sdk/client-secrets-manager@3.1024.0
// (probe 2026-05-06): a pre-flight credential resolution failure
// surfaces as `name === "CredentialsProviderError"` directly on the
// outer error, no cause chain.
Deno.test("wrapAwsSmError: direct CredentialsProviderError → 'Vault session expired:' prefix", () => {
  withoutAwsProfile(() => {
    const original = new Error("Could not load credentials from any providers");
    original.name = "CredentialsProviderError";

    const wrapped = wrapAwsSmError("GetSecretValue", original);

    assert(wrapped instanceof AwsSmOperationError);
    assert(
      wrapped.message.startsWith("Vault session expired:"),
      `expected prefix "Vault session expired:", got: ${wrapped.message}`,
    );
    assertEquals(wrapped.cause, original);
    assertEquals(wrapped.name, "CredentialsProviderError");
    assertEquals(wrapped.code, "CredentialsProviderError");
  });
});

// Defensive coverage for minified SDK builds and the older #226
// stack-trace pattern: outer error with cause.name ===
// "_CredentialsProviderError".
Deno.test("wrapAwsSmError: cause-chain _CredentialsProviderError → 'Vault session expired:' prefix", () => {
  withoutAwsProfile(() => {
    const inner = new Error("Token is expired");
    inner.name = "_CredentialsProviderError";
    const outer = new Error("aggregated") as Error & { cause?: unknown };
    outer.cause = inner;

    const wrapped = wrapAwsSmError("GetSecretValue", outer);

    assert(wrapped instanceof AwsSmOperationError);
    assert(
      wrapped.message.startsWith("Vault session expired:"),
      `expected prefix "Vault session expired:", got: ${wrapped.message}`,
    );
    assertEquals(wrapped.cause, outer);
    // Outer error's name is "Error" — wrapper preserves it as-is.
    assertEquals(wrapped.name, "Error");
    assertEquals(wrapped.code, "CredentialsProviderError");
  });
});

// Locks in both noise filters from wrapAwsSmError. Empirically required
// (probe 2026-05-06): an HTTP 400 with body `{}` produces err.name=
// "Unknown" and err.message="UnknownError" at @3.1024.0. Without the
// filters the wrapped message would leak both strings.
Deno.test("wrapAwsSmError: Unknown/UnknownError noise filters strip both from output", () => {
  withoutAwsProfile(() => {
    const original = new Error("UnknownError") as Error & {
      $metadata?: { httpStatusCode?: number };
    };
    original.name = "Unknown";
    original.$metadata = { httpStatusCode: 400 };

    const wrapped = wrapAwsSmError("GetSecretValue", original);

    assert(wrapped instanceof AwsSmOperationError);
    assertEquals(wrapped.httpStatusCode, 400);
    assert(
      wrapped.message.includes("AWS Secrets Manager GetSecretValue failed"),
    );
    assert(wrapped.message.includes("HTTP 400"));
    assert(
      !wrapped.message.includes("Unknown"),
      `expected wrapped message to NOT contain "Unknown", got: ${wrapped.message}`,
    );
    assert(
      !wrapped.message.includes("UnknownError"),
      `expected wrapped message to NOT contain "UnknownError", got: ${wrapped.message}`,
    );
  });
});

// AWS_PROFILE is read at wrap time. When set, the session-expired hint
// should embed the profile name in the suggested command.
Deno.test("wrapAwsSmError: reads AWS_PROFILE and embeds it in the hint", () => {
  const prev = Deno.env.get("AWS_PROFILE");
  Deno.env.set("AWS_PROFILE", "demo");
  try {
    const original = new Error("Could not load credentials from any providers");
    original.name = "CredentialsProviderError";

    const wrapped = wrapAwsSmError("GetSecretValue", original);

    assert(wrapped.message.includes(`aws sso login --profile "demo"`));
  } finally {
    if (prev !== undefined) Deno.env.set("AWS_PROFILE", prev);
    else Deno.env.delete("AWS_PROFILE");
  }
});

Deno.test("wrapAwsSmError: non-Error throw becomes a plain Error wrapper", () => {
  const wrapped = wrapAwsSmError("GetSecretValue", "not an Error instance");
  assert(wrapped instanceof Error);
  assert(!(wrapped instanceof AwsSmOperationError));
  assertEquals(wrapped.message, "not an Error instance");
});

// --- `profile` argument (issue #2099) ---

// The configured profile outranks AWS_PROFILE. A vault pinned to a profile is
// not using whatever the shell exports, so remediation advice must name the
// configured one or it sends the reader to the wrong place.
Deno.test("wrapAwsSmError: configured profile beats a conflicting AWS_PROFILE", () => {
  const prev = Deno.env.get("AWS_PROFILE");
  Deno.env.set("AWS_PROFILE", "env-profile");
  try {
    const original = new Error("Could not load credentials from any providers");
    original.name = "CredentialsProviderError";

    const wrapped = wrapAwsSmError(
      "GetSecretValue",
      original,
      "config-profile",
    );

    assert(
      wrapped.message.includes(`aws sso login --profile "config-profile"`),
      `expected the configured profile in the hint, got: ${wrapped.message}`,
    );
    assert(
      !wrapped.message.includes("env-profile"),
      `expected AWS_PROFILE not to win, got: ${wrapped.message}`,
    );
  } finally {
    if (prev !== undefined) Deno.env.set("AWS_PROFILE", prev);
    else Deno.env.delete("AWS_PROFILE");
  }
});

// Falls back to AWS_PROFILE when the vault has no configured profile, so the
// pre-#2099 behaviour is unchanged for vaults that do not set one.
Deno.test("wrapAwsSmError: falls back to AWS_PROFILE when no profile is configured", () => {
  const prev = Deno.env.get("AWS_PROFILE");
  Deno.env.set("AWS_PROFILE", "env-profile");
  try {
    const original = new Error("Could not load credentials from any providers");
    original.name = "CredentialsProviderError";

    const wrapped = wrapAwsSmError("GetSecretValue", original);

    assert(
      wrapped.message.includes(`aws sso login --profile "env-profile"`),
      `expected AWS_PROFILE in the hint, got: ${wrapped.message}`,
    );
  } finally {
    if (prev !== undefined) Deno.env.set("AWS_PROFILE", prev);
    else Deno.env.delete("AWS_PROFILE");
  }
});

// A profile that cannot be resolved is reported as such, NOT as an expired SSO
// session. This is the misdiagnosis #2099 introduces if left unhandled: the
// shared classifier maps CredentialsProviderError to 'session-expired', which
// would advise refreshing an SSO session for a profile that does not exist.
// The message text is the SDK's own, verified against
// @aws-sdk/credential-providers@3.1127.0.
Deno.test("wrapAwsSmError: unresolvable profile reports profile-not-found", () => {
  const original = new Error(
    "Could not resolve credentials using profile: [missing-profile] in configuration/credentials file(s).",
  );
  original.name = "CredentialsProviderError";

  const wrapped = wrapAwsSmError("GetSecretValue", original, "missing-profile");

  assert(
    wrapped.message.includes("was not found in ~/.aws/config"),
    `expected a profile-not-found hint, got: ${wrapped.message}`,
  );
  assert(
    wrapped.message.includes("missing-profile"),
    `expected the hint to name the profile, got: ${wrapped.message}`,
  );
  assert(
    !wrapped.message.includes("aws sso login"),
    `expected no SSO-refresh advice, got: ${wrapped.message}`,
  );
});

// The other direction: a credential error that is NOT about profile resolution
// must still fall through to the shared classification. Guards against the
// narrow pattern widening into a catch-all that swallows real SSO expiry.
Deno.test("wrapAwsSmError: non-matching credential error still classifies as session-expired", () => {
  const original = new Error("Could not load credentials from any providers");
  original.name = "CredentialsProviderError";

  const wrapped = wrapAwsSmError("GetSecretValue", original, "some-profile");

  assert(
    wrapped.message.includes("session expired"),
    `expected the shared session-expired classification, got: ${wrapped.message}`,
  );
  assert(
    !wrapped.message.includes("was not found in ~/.aws/config"),
    `expected no profile-not-found hint, got: ${wrapped.message}`,
  );
});

// Without a configured profile the profile-not-found path is inert, even if an
// error happens to carry a matching message.
Deno.test("wrapAwsSmError: profile-not-found hint requires a configured profile", () => {
  const prev = Deno.env.get("AWS_PROFILE");
  Deno.env.delete("AWS_PROFILE");
  try {
    const original = new Error(
      "Could not resolve credentials using profile: [x] in configuration/credentials file(s).",
    );
    original.name = "CredentialsProviderError";

    const wrapped = wrapAwsSmError("GetSecretValue", original);

    assert(
      !wrapped.message.includes("was not found in ~/.aws/config"),
      `expected no profile-not-found hint, got: ${wrapped.message}`,
    );
  } finally {
    if (prev !== undefined) Deno.env.set("AWS_PROFILE", prev);
    else Deno.env.delete("AWS_PROFILE");
  }
});
