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
 * Swamp vault provider backed by AWS Secrets Manager.
 *
 * Reads and writes secrets through the AWS SDK v3, using the default AWS
 * credential chain — or a named profile from `~/.aws/config` when the vault
 * config supplies one. Use this entrypoint when a swamp deployment should
 * store its secrets in AWS Secrets Manager rather than the local vault.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  CreateSecretCommand,
  DeleteSecretCommand,
  DescribeSecretCommand,
  GetSecretValueCommand,
  ListSecretsCommand,
  PutSecretValueCommand,
  SecretsManagerClient,
  TagResourceCommand,
  UntagResourceCommand,
  UpdateSecretCommand,
} from "npm:@aws-sdk/client-secrets-manager@3.1127.0";
// Fully-qualified specifier, like every other import here: deno.json is not
// published with the extension (manifest.yaml ships aws_sm.ts plus README and
// LICENSE only), so a bare import-map name would resolve locally and fail for
// every installed copy.
import { fromIni } from "npm:@aws-sdk/credential-providers@3.1127.0";
import { SpanStatusCode } from "npm:@opentelemetry/api@1.9.0";
import { AwsSmOperationError, wrapAwsSmError } from "./aws_sm_errors.ts";
import { Attr, getTracer } from "./_lib/tracing.ts";

/**
 * Minimal contract implemented by swamp vault providers. Exported so that
 * downstream consumers and tests can type-check against a public interface
 * rather than an inferred shape.
 */
export interface VaultPutOptions {
  tags?: Record<string, string>;
}

export interface VaultProvider {
  /** Fetches the current value of the given secret. */
  get(secretKey: string): Promise<string>;
  /** Writes a new value for the given secret, creating it if it does not exist. */
  put(
    secretKey: string,
    secretValue: string,
    options?: VaultPutOptions,
  ): Promise<void>;
  /** Lists all secret keys visible to the vault. */
  list(): Promise<string[]>;
  /** Returns the swamp-assigned name of this vault instance. */
  getName(): string;
}

/**
 * Opt-in interface for vault providers that support secret deletion.
 */
export interface VaultDeleteProvider {
  delete(secretKey: string): Promise<void>;
}

export interface VaultAnnotationData {
  url?: string;
  notes?: string;
  labels?: Record<string, string>;
  updatedAt: string;
}

export interface VaultAnnotation {
  readonly url: string | undefined;
  readonly notes: string | undefined;
  readonly labels: Readonly<Record<string, string>>;
  readonly updatedAt: Date;
  toData(): VaultAnnotationData;
  merge(updates: {
    url?: string;
    notes?: string;
    labels?: Record<string, string>;
  }): VaultAnnotation;
  isEmpty(): boolean;
}

export function createVaultAnnotation(fields: {
  url?: string;
  notes?: string;
  labels?: Record<string, string>;
  updatedAt?: Date;
}): VaultAnnotation {
  const url = fields.url;
  const notes = fields.notes;
  const labels = Object.freeze({ ...fields.labels });
  const updatedAt = fields.updatedAt ?? new Date();
  return {
    url,
    notes,
    labels,
    updatedAt,
    toData(): VaultAnnotationData {
      const data: VaultAnnotationData = {
        updatedAt: updatedAt.toISOString(),
      };
      if (url !== undefined) data.url = url;
      if (notes !== undefined) data.notes = notes;
      if (Object.keys(labels).length > 0) {
        data.labels = { ...labels };
      }
      return data;
    },
    merge(updates: {
      url?: string;
      notes?: string;
      labels?: Record<string, string>;
    }): VaultAnnotation {
      return createVaultAnnotation({
        url: updates.url !== undefined ? updates.url : url,
        notes: updates.notes !== undefined ? updates.notes : notes,
        labels: updates.labels !== undefined
          ? { ...labels, ...updates.labels }
          : { ...labels },
      });
    },
    isEmpty(): boolean {
      return url === undefined &&
        notes === undefined &&
        Object.keys(labels).length === 0;
    },
  };
}

export interface VaultAnnotationProvider {
  getAnnotation(secretKey: string): Promise<VaultAnnotation | null>;
  putAnnotation(
    secretKey: string,
    annotation: VaultAnnotation,
  ): Promise<void>;
  deleteAnnotation(secretKey: string): Promise<void>;
  listAnnotations(): Promise<Map<string, VaultAnnotation>>;
}

// Legacy tag key: the annotation URL used to be stored as this tag. We no
// longer WRITE it — AWS tag values reject URL characters like `?` and `&`, so
// query-string URLs failed (issue #495). The URL now lives in the secret
// Description (see composeDescription). This key is retained read-only so
// annotations created before the change keep their URL.
const LEGACY_SWAMP_URL_TAG_KEY = "swamp:url";

// Sentinel prefix for the URL trailer line appended to the secret Description.
const URL_TRAILER_PREFIX = "swamp:url=";

const SWAMP_TAG_PREFIX = "swamp:";

/**
 * Serialize `notes` and `url` into a single secret Description string. The URL
 * is appended as a trailing `swamp:url=<url>` line so it stays human-readable
 * in the AWS console — unlike a tag value, the Description accepts any
 * character. Returns `undefined` when there is nothing to store.
 */
function composeDescription(
  notes: string | undefined,
  url: string | undefined,
): string | undefined {
  const trailer = url !== undefined ? `${URL_TRAILER_PREFIX}${url}` : undefined;
  if (notes !== undefined && trailer !== undefined) {
    return `${notes}\n\n${trailer}`;
  }
  if (trailer !== undefined) return trailer;
  return notes;
}

/**
 * Inverse of {@link composeDescription}. Recovers `{ notes, url }` from a
 * Description. The URL is taken from a trailing `swamp:url=<url>` line when
 * present; everything before it (minus the single `\n\n` separator that
 * composeDescription inserts) is returned verbatim as `notes`, so the
 * round-trip is lossless.
 *
 * Known limitation: a note whose final line is literally `swamp:url=<x>` is
 * misread as the URL. The in-band sentinel cannot avoid this without an
 * out-of-band store; the probability is vanishingly low.
 */
function parseDescription(
  description: string | undefined,
): { notes: string | undefined; url: string | undefined } {
  if (description === undefined || description === "") {
    return { notes: undefined, url: undefined };
  }
  const lastNewline = description.lastIndexOf("\n");
  const lastLine = description.slice(lastNewline + 1);
  if (!lastLine.startsWith(URL_TRAILER_PREFIX)) {
    return { notes: description, url: undefined };
  }
  const url = lastLine.slice(URL_TRAILER_PREFIX.length);
  if (lastNewline === -1) {
    // Description is exactly the trailer: URL only, no notes.
    return { notes: undefined, url };
  }
  // Strip the single `\n\n` separator composeDescription inserted: `lastNewline`
  // is its second `\n`; drop the first too when present.
  const notesEnd = description[lastNewline - 1] === "\n"
    ? lastNewline - 1
    : lastNewline;
  const notes = description.slice(0, notesEnd);
  return { notes: notes === "" ? undefined : notes, url };
}

/**
 * Derive annotation fields from a secret's Description and Tags. Centralizes
 * the read path so getAnnotation, listAnnotations, and putAnnotation's
 * read-modify-write stay consistent. The URL comes from the Description; if
 * absent there, it falls back to the legacy `swamp:url` tag (Description wins
 * when both are present). Non-`aws:` / non-legacy tags become labels.
 */
function readAnnotationFields(
  description: string | undefined,
  tags: { Key?: string; Value?: string | null }[],
): {
  notes: string | undefined;
  url: string | undefined;
  labels: Record<string, string>;
} {
  const { notes, url: descriptionUrl } = parseDescription(description);
  let url = descriptionUrl;
  const prefixed: Record<string, string> = {};
  const bare: Record<string, string> = {};
  for (const tag of tags) {
    if (!tag.Key) continue;
    if (tag.Key === LEGACY_SWAMP_URL_TAG_KEY) {
      if (url === undefined) url = tag.Value ?? undefined;
    } else if (tag.Key.startsWith(SWAMP_TAG_PREFIX)) {
      prefixed[tag.Key.slice(SWAMP_TAG_PREFIX.length)] = tag.Value ?? "";
    } else if (!tag.Key.startsWith("aws:")) {
      bare[tag.Key] = tag.Value ?? "";
    }
  }
  // Prefixed labels win; bare tags are back-compat for labels written before
  // the swamp: prefix was introduced.
  const labels = Object.keys(prefixed).length > 0 ? prefixed : bare;
  return { notes, url, labels };
}

class AwsSmVaultProvider
  implements VaultProvider, VaultDeleteProvider, VaultAnnotationProvider {
  private readonly client: SecretsManagerClient;
  private readonly name: string;
  private readonly profile: string | undefined;

  constructor(name: string, config: { region: string; profile?: string }) {
    this.name = name;
    this.profile = config.profile;
    // No profile configured: pass no `credentials` at all, so resolution stays
    // byte-for-byte the default AWS credential chain it has always been.
    //
    // Profile configured: fromIni, deliberately not fromNodeProviderChain({
    // profile }). The node chain consults the env-var provider first and that
    // provider ignores the profile argument, so AWS_ACCESS_KEY_ID in the
    // environment would silently outrank the profile the user pinned — the
    // exact silent-wrong-credentials failure this option exists to prevent.
    this.client = new SecretsManagerClient({
      region: config.region,
      ...(config.profile
        ? { credentials: fromIni({ profile: config.profile }) }
        : {}),
    });
  }

  async get(secretKey: string): Promise<string> {
    return await getTracer().startActiveSpan("aws-sm get", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "aws-api",
        [Attr.RPC_SERVICE]: "SecretsManager",
        [Attr.RPC_METHOD]: "GetSecretValue",
        [Attr.VAULT_NAME]: this.name,
        [Attr.VAULT_SECRET_KEY]: secretKey,
      });
      try {
        const command = new GetSecretValueCommand({ SecretId: secretKey });
        const response = await this.client.send(command);

        const secretValue = response.SecretString ||
          (response.SecretBinary
            ? new TextDecoder().decode(response.SecretBinary)
            : "");

        if (!secretValue) {
          throw new Error(`Secret '${secretKey}' not found or has no value`);
        }

        return secretValue;
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
        }
        if (
          !(err instanceof Error) ||
          !err.message.startsWith("Secret '")
        ) {
          throw wrapAwsSmError("GetSecretValue", err, this.profile);
        }
        throw err;
      } finally {
        span.end();
      }
    });
  }

  async put(
    secretKey: string,
    secretValue: string,
    options?: VaultPutOptions,
  ): Promise<void> {
    return await getTracer().startActiveSpan("aws-sm put", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "aws-api",
        [Attr.RPC_SERVICE]: "SecretsManager",
        [Attr.RPC_METHOD]: "PutSecretValue",
        [Attr.VAULT_NAME]: this.name,
        [Attr.VAULT_SECRET_KEY]: secretKey,
      });
      try {
        const putCommand = new PutSecretValueCommand({
          SecretId: secretKey,
          SecretString: secretValue,
        });
        await this.client.send(putCommand);
      } catch (error) {
        const wrapped = wrapAwsSmError("PutSecretValue", error, this.profile);
        if (
          wrapped instanceof AwsSmOperationError &&
          wrapped.name === "ResourceNotFoundException"
        ) {
          try {
            const tags = options?.tags;
            const awsTags = tags
              ? Object.entries(tags).map(([Key, Value]) => ({ Key, Value }))
              : undefined;
            const createCommand = new CreateSecretCommand({
              Name: secretKey,
              SecretString: secretValue,
              ...(awsTags && { Tags: awsTags }),
            });
            await this.client.send(createCommand);
          } catch (createError) {
            const createWrapped = wrapAwsSmError(
              "CreateSecret",
              createError,
              this.profile,
            );
            if (createWrapped instanceof Error) {
              span.setStatus({
                code: SpanStatusCode.ERROR,
                message: createWrapped.message,
              });
              span.recordException(createWrapped);
              span.setAttribute(Attr.ERROR_TYPE, createWrapped.name);
            }
            throw createWrapped;
          }
        } else {
          if (wrapped instanceof Error) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: wrapped.message,
            });
            span.recordException(wrapped);
            span.setAttribute(Attr.ERROR_TYPE, wrapped.name);
          }
          throw wrapped;
        }
      } finally {
        span.end();
      }
    });
  }

  async list(): Promise<string[]> {
    return await getTracer().startActiveSpan("aws-sm list", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "aws-api",
        [Attr.RPC_SERVICE]: "SecretsManager",
        [Attr.RPC_METHOD]: "ListSecrets",
        [Attr.VAULT_NAME]: this.name,
      });
      try {
        const secretNames: string[] = [];
        let nextToken: string | undefined;

        do {
          const command = new ListSecretsCommand({ NextToken: nextToken });
          const response = await this.client.send(command);

          if (response.SecretList) {
            for (const secret of response.SecretList) {
              if (secret.Name) {
                secretNames.push(secret.Name);
              }
            }
          }

          nextToken = response.NextToken;
        } while (nextToken);

        return secretNames.sort();
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
        }
        throw wrapAwsSmError("ListSecrets", err, this.profile);
      } finally {
        span.end();
      }
    });
  }

  async delete(secretKey: string): Promise<void> {
    return await getTracer().startActiveSpan("aws-sm delete", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "aws-api",
        [Attr.RPC_SERVICE]: "SecretsManager",
        [Attr.RPC_METHOD]: "DeleteSecret",
        [Attr.VAULT_NAME]: this.name,
        [Attr.VAULT_SECRET_KEY]: secretKey,
      });
      try {
        await this.client.send(
          new DeleteSecretCommand({ SecretId: secretKey }),
        );
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
        }
        throw wrapAwsSmError("DeleteSecret", err, this.profile);
      } finally {
        span.end();
      }
    });
  }

  getName(): string {
    return this.name;
  }

  async getAnnotation(secretKey: string): Promise<VaultAnnotation | null> {
    return await getTracer().startActiveSpan(
      "aws-sm getAnnotation",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "aws-api",
          [Attr.RPC_SERVICE]: "SecretsManager",
          [Attr.RPC_METHOD]: "DescribeSecret",
          [Attr.VAULT_NAME]: this.name,
          [Attr.VAULT_SECRET_KEY]: secretKey,
        });
        try {
          const response = await this.client.send(
            new DescribeSecretCommand({ SecretId: secretKey }),
          );

          const { notes, url, labels } = readAnnotationFields(
            response.Description || undefined,
            response.Tags ?? [],
          );

          const hasAnnotation = notes !== undefined ||
            url !== undefined ||
            Object.keys(labels).length > 0;
          if (!hasAnnotation) return null;

          return createVaultAnnotation({
            url,
            notes,
            labels: Object.keys(labels).length > 0 ? labels : undefined,
            updatedAt: response.LastChangedDate ?? undefined,
          });
        } catch (err) {
          if (err instanceof Error) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            });
            span.recordException(err);
            span.setAttribute(Attr.ERROR_TYPE, err.name);
          }
          throw wrapAwsSmError("DescribeSecret", err, this.profile);
        } finally {
          span.end();
        }
      },
    );
  }

  async putAnnotation(
    secretKey: string,
    annotation: VaultAnnotation,
  ): Promise<void> {
    return await getTracer().startActiveSpan(
      "aws-sm putAnnotation",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "aws-api",
          [Attr.RPC_SERVICE]: "SecretsManager",
          [Attr.RPC_METHOD]: "putAnnotation",
          [Attr.VAULT_NAME]: this.name,
          [Attr.VAULT_SECRET_KEY]: secretKey,
        });
        try {
          let existing;
          try {
            existing = await this.client.send(
              new DescribeSecretCommand({ SecretId: secretKey }),
            );
          } catch (error) {
            throw wrapAwsSmError("DescribeSecret", error, this.profile);
          }
          const current = readAnnotationFields(
            existing.Description || undefined,
            existing.Tags ?? [],
          );

          const notes = annotation.notes !== undefined
            ? annotation.notes
            : current.notes;
          const url = annotation.url !== undefined
            ? annotation.url
            : current.url;
          const description = composeDescription(notes, url) ?? "";

          if (description !== (existing.Description ?? "")) {
            try {
              await this.client.send(
                new UpdateSecretCommand({
                  SecretId: secretKey,
                  Description: description,
                }),
              );
            } catch (error) {
              throw wrapAwsSmError("UpdateSecret", error, this.profile);
            }
          }

          const tagsToSet: { Key: string; Value: string }[] = [];
          if (annotation.labels) {
            for (const [key, value] of Object.entries(annotation.labels)) {
              tagsToSet.push({
                Key: `${SWAMP_TAG_PREFIX}${key}`,
                Value: value,
              });
            }
          }

          if (tagsToSet.length > 0) {
            try {
              await this.client.send(
                new TagResourceCommand({
                  SecretId: secretKey,
                  Tags: tagsToSet,
                }),
              );
            } catch (error) {
              throw wrapAwsSmError("TagResource", error, this.profile);
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            });
            span.recordException(err);
            span.setAttribute(Attr.ERROR_TYPE, err.name);
          }
          throw err;
        } finally {
          span.end();
        }
      },
    );
  }

  async deleteAnnotation(secretKey: string): Promise<void> {
    return await getTracer().startActiveSpan(
      "aws-sm deleteAnnotation",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "aws-api",
          [Attr.RPC_SERVICE]: "SecretsManager",
          [Attr.RPC_METHOD]: "deleteAnnotation",
          [Attr.VAULT_NAME]: this.name,
          [Attr.VAULT_SECRET_KEY]: secretKey,
        });
        try {
          try {
            await this.client.send(
              new UpdateSecretCommand({
                SecretId: secretKey,
                Description: "",
              }),
            );
          } catch (error) {
            throw wrapAwsSmError("UpdateSecret", error, this.profile);
          }

          let response;
          try {
            response = await this.client.send(
              new DescribeSecretCommand({ SecretId: secretKey }),
            );
          } catch (error) {
            throw wrapAwsSmError("DescribeSecret", error, this.profile);
          }

          const tagKeysToRemove: string[] = [];
          for (const tag of response.Tags ?? []) {
            if (!tag.Key) continue;
            if (tag.Key.startsWith("swamp:")) {
              tagKeysToRemove.push(tag.Key);
            }
          }

          if (tagKeysToRemove.length > 0) {
            try {
              await this.client.send(
                new UntagResourceCommand({
                  SecretId: secretKey,
                  TagKeys: tagKeysToRemove,
                }),
              );
            } catch (error) {
              throw wrapAwsSmError("UntagResource", error, this.profile);
            }
          }
        } catch (err) {
          if (err instanceof Error) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            });
            span.recordException(err);
            span.setAttribute(Attr.ERROR_TYPE, err.name);
          }
          throw err;
        } finally {
          span.end();
        }
      },
    );
  }

  async listAnnotations(): Promise<Map<string, VaultAnnotation>> {
    return await getTracer().startActiveSpan(
      "aws-sm listAnnotations",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "aws-api",
          [Attr.RPC_SERVICE]: "SecretsManager",
          [Attr.RPC_METHOD]: "ListSecrets",
          [Attr.VAULT_NAME]: this.name,
        });
        try {
          const annotations = new Map<string, VaultAnnotation>();
          let nextToken: string | undefined;

          do {
            const response = await this.client.send(
              new ListSecretsCommand({ NextToken: nextToken }),
            );

            for (const secret of response.SecretList ?? []) {
              if (!secret.Name) continue;

              const { notes, url, labels } = readAnnotationFields(
                secret.Description || undefined,
                secret.Tags ?? [],
              );

              const hasAnnotation = notes !== undefined ||
                url !== undefined ||
                Object.keys(labels).length > 0;
              if (hasAnnotation) {
                annotations.set(
                  secret.Name,
                  createVaultAnnotation({
                    url,
                    notes,
                    labels: Object.keys(labels).length > 0 ? labels : undefined,
                    updatedAt: secret.LastChangedDate ?? undefined,
                  }),
                );
              }
            }

            nextToken = response.NextToken;
          } while (nextToken);

          return annotations;
        } catch (err) {
          if (err instanceof Error) {
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: err.message,
            });
            span.recordException(err);
            span.setAttribute(Attr.ERROR_TYPE, err.name);
          }
          throw wrapAwsSmError("ListSecrets", err, this.profile);
        } finally {
          span.end();
        }
      },
    );
  }
}

/**
 * Extension entrypoint registered with swamp. Declares the vault type, its
 * configuration schema, and the factory used to instantiate a provider.
 */
export const vault = {
  type: "@swamp/aws-sm",
  name: "AWS Secrets Manager",
  description:
    "AWS Secrets Manager vault provider. Authenticates via the default AWS credential chain, or a named profile when one is configured.",
  configSchema: z.object({
    // deno-fmt-ignore
    region: z.string().min(1).describe("AWS region where the Secrets Manager secrets are stored e.g. us-east-1"),
    // deno-fmt-ignore
    profile: z.string().min(1).optional().describe("Named AWS profile from ~/.aws/config or ~/.aws/credentials. When omitted, the default AWS credential chain is used. A configured profile takes precedence over environment-variable credentials."),
  }).strict(),
  createProvider(
    name: string,
    config: Record<string, unknown>,
  ): VaultProvider & VaultDeleteProvider {
    const parsed = vault.configSchema.parse(config);
    return new AwsSmVaultProvider(name, parsed);
  },
};
