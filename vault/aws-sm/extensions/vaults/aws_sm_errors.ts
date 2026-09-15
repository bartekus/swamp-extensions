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

/**
 * Error wrapper for the aws-sm vault. Credential classification and hint
 * formatting come from the shared aws_credentials module; this file adds
 * the vault-specific error class and wrapping logic.
 *
 * @module
 */

import {
  classifyAwsCredentialError,
  deriveAwsErrorCode,
  formatAwsCredentialHint,
} from "./_lib/aws_credentials.ts";

export {
  type AwsCredentialErrorKind,
  classifyAwsCredentialError,
  deriveAwsErrorCode,
  formatAwsCredentialHint,
} from "./_lib/aws_credentials.ts";

/**
 * Error thrown by the aws-sm vault for SDK failures. Preserves the
 * original SDK error's `name` (so existing checks like
 * `error.name === "ResourceNotFoundException"` keep working), sets `cause`
 * to the original, and exposes HTTP-level detail.
 */
export class AwsSmOperationError extends Error {
  override readonly name: string;
  readonly httpStatusCode: number | undefined;
  readonly code: string | undefined;
  readonly requestId: string | undefined;

  constructor(
    message: string,
    opts: {
      name: string;
      cause: unknown;
      httpStatusCode: number | undefined;
      code: string | undefined;
      requestId: string | undefined;
    },
  ) {
    super(message, { cause: opts.cause });
    this.name = opts.name;
    this.httpStatusCode = opts.httpStatusCode;
    this.code = opts.code;
    this.requestId = opts.requestId;
  }
}

/**
 * Message shapes the AWS SDK uses when a named profile cannot be resolved from
 * the shared config/credentials files. Matched narrowly and only when a profile
 * is actually configured; anything else falls through to the shared
 * classification untouched.
 */
// Verified against @aws-sdk/credential-providers@3.1127.0, which produces:
//   "Could not resolve credentials using profile: [name] in
//    configuration/credentials file(s)."
// The other alternatives cover wordings used elsewhere in the SDK's ini and
// SSO paths. Kept narrow on purpose: a non-match falls through to the shared
// classification rather than being swallowed, and the unit tests below pin
// both directions so an SDK rewording fails loudly instead of silently
// restoring the misleading SSO hint.
const PROFILE_NOT_FOUND_RE =
  /could not resolve credentials using profile|could not be found|not defined in shared configuration|profile .* was not found/i;

/**
 * Hint for the failure mode the `profile` config option introduces: the profile
 * itself is missing or unresolvable.
 *
 * Without this, such failures are reported as an expired SSO session.
 * `classifyAwsCredentialError` maps `CredentialsProviderError` to
 * `session-expired`, so a typo'd or absent profile produces "your AWS profile's
 * SSO session is no longer valid. Run 'aws sso login --profile X'" — advice for
 * a profile that may not exist and may never have been SSO-based. The
 * classifier lives in the generated `_lib/aws_credentials.ts` (canonical source
 * `codegen/shared/awsCredentials.ts`, shared with datastore/s3), so the
 * disambiguation is done here at the vault boundary instead of widening this
 * change into codegen.
 */
function formatProfileNotFoundHint(
  profile: string | undefined,
  err: Error,
): string | undefined {
  if (profile === undefined) return undefined;
  if (!PROFILE_NOT_FOUND_RE.test(err.message)) return undefined;
  return (
    "Vault AWS profile '" + profile + "' was not found in ~/.aws/config or " +
    "~/.aws/credentials: check the profile name in the vault config, or run " +
    "'aws configure list-profiles' to see the profiles available."
  );
}

/**
 * Wrap an SDK error from a Secrets Manager command as an
 * `AwsSmOperationError` with status, code, requestId, and a
 * credential-remediation hint when applicable.
 *
 * `profile` is the vault's configured AWS profile, when it has one. It takes
 * precedence over `AWS_PROFILE` for hint purposes, because a vault pinned to a
 * profile is not using whatever the environment names.
 *
 * The Unknown/UnknownError suppression is empirically required: at
 * @aws-sdk/client-secrets-manager@3.1024.0, an HTTP 400 response with
 * a body lacking `__type` produces `err.name === "Unknown"` and
 * `err.message === "UnknownError"`. Without these filters the wrapped
 * message would read e.g. "AWS Secrets Manager get failed HTTP 400
 * Unknown — UnknownError" — noisy, with no useful signal.
 */
export function wrapAwsSmError(
  op: string,
  err: unknown,
  profile?: string,
): Error {
  if (!(err instanceof Error)) return new Error(String(err));
  const e = err as Error & {
    $metadata?: { httpStatusCode?: number; requestId?: string };
    Code?: string;
  };
  const status = e.$metadata?.httpStatusCode;
  const requestId = e.$metadata?.requestId;
  const code = deriveAwsErrorCode(e);

  const credentialKind = classifyAwsCredentialError(code, status);
  // A configured profile wins over AWS_PROFILE: the vault is pinned to it, so
  // any remediation command must name it and not whatever the shell exports.
  const hintProfile = profile ?? Deno.env.get("AWS_PROFILE");
  const credentialHint = formatProfileNotFoundHint(profile, e) ??
    formatAwsCredentialHint(credentialKind, hintProfile, "Vault");

  const parts: string[] = [];
  if (credentialHint) parts.push(credentialHint);
  parts.push(`AWS Secrets Manager ${op} failed`);
  if (status != null) parts.push(`HTTP ${status}`);
  if (code && code !== "Unknown") parts.push(code);
  const rawMsg = e.message && e.message !== "UnknownError" ? e.message : "";
  if (rawMsg) parts.push(`— ${rawMsg}`);
  if ((status === 401 || status === 403) && credentialKind === "other") {
    // A 403 whose body the SDK could not parse lands here. Name the vault's
    // configured profile when it has one: the generic wording sends the reader
    // to check "profile, env vars, or credential provider" when a pinned vault
    // is using exactly one of those and the others are irrelevant.
    parts.push(
      hintProfile
        ? "(check AWS credentials for profile '" + hintProfile +
          "', then retry)"
        : "(check AWS credentials — profile, env vars, or credential provider — then retry)",
    );
  }
  if (requestId) parts.push(`[requestId=${requestId}]`);

  return new AwsSmOperationError(parts.join(" "), {
    name: e.name,
    cause: e,
    httpStatusCode: status,
    code,
    requestId,
  });
}
