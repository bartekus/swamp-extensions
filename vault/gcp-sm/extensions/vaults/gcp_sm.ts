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

/** @module Swamp vault provider backed by GCP Secret Manager. */

import { z } from "npm:zod@4.3.6";
import { SpanStatusCode } from "npm:@opentelemetry/api@1.9.0";
import { wrapGcpSmError } from "./gcp_sm_errors.ts";
import { Attr, getTracer } from "./_lib/tracing.ts";
import { authenticatedFetch, resolveProjectId } from "./_lib/gcp_auth.ts";

export interface VaultPutOptions {
  tags?: Record<string, string>;
}

export interface VaultProvider {
  get(secretKey: string): Promise<string>;
  put(
    secretKey: string,
    secretValue: string,
    options?: VaultPutOptions,
  ): Promise<void>;
  list(): Promise<string[]>;
  getName(): string;
}

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

export interface HygieneVersionMetadata {
  name: string;
  state: string;
  createTime: string | undefined;
  destroyTime: string | undefined;
  scheduledDestroyTime: string | undefined;
}

export interface HygieneSecretMetadata {
  name: string;
  createTime: string | undefined;
  labels: Record<string, string>;
  annotations: Record<string, string>;
  rotation: {
    nextRotationTime: string | undefined;
    rotationPeriod: string | undefined;
  } | undefined;
  expireTime: string | undefined;
  versionDestroyTtl: string | undefined;
  versions: HygieneVersionMetadata[];
}

export interface HygieneProjectSnapshot {
  projectId: string;
  secrets: HygieneSecretMetadata[];
}

export interface HygieneMetadataSnapshot {
  projects: HygieneProjectSnapshot[];
  snapshotTimestamp: string;
  extensionVersion: string;
}

const SWAMP_ANNOTATION_PREFIX = "swamp-";
const SWAMP_NOTES_KEY = "swamp-notes";
const SWAMP_URL_KEY = "swamp-url";
const SWAMP_UPDATED_AT_KEY = "swamp-updated-at";
const SWAMP_LABEL_PREFIX = "swamp-";
const DEFAULT_API_BASE = "https://secretmanager.googleapis.com";

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToUtf8(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function toGcpSecretId(key: string): string {
  return key.replace(/\//g, "-");
}

interface SecretMetadata {
  annotations?: Record<string, string>;
  labels?: Record<string, string>;
}

interface SecretListEntry extends SecretMetadata {
  name?: string;
  createTime?: string;
  rotation?: {
    nextRotationTime?: string;
    rotationPeriod?: string;
  };
  expireTime?: string;
  versionDestroyTtl?: string;
}

interface VersionListEntry {
  name?: string;
  state?: string;
  createTime?: string;
  destroyTime?: string;
  scheduledDestroyTime?: string;
}

function readSwampAnnotation(secret: SecretMetadata): {
  notes: string | undefined;
  url: string | undefined;
  updatedAt: Date | undefined;
  swampLabels: Record<string, string>;
} {
  const ann: Record<string, string> = secret.annotations ?? {};
  const lbl: Record<string, string> = secret.labels ?? {};

  const notes = ann[SWAMP_NOTES_KEY];
  const url = ann[SWAMP_URL_KEY];
  const updatedAtStr = ann[SWAMP_UPDATED_AT_KEY];
  const updatedAt = updatedAtStr ? new Date(updatedAtStr) : undefined;

  const swampLabels: Record<string, string> = {};
  for (const [key, value] of Object.entries(lbl)) {
    if (key.startsWith(SWAMP_LABEL_PREFIX)) {
      swampLabels[key.slice(SWAMP_LABEL_PREFIX.length)] = value;
    }
  }

  return { notes, url, updatedAt, swampLabels };
}

function hasSwampAnnotation(secret: SecretMetadata): boolean {
  const { notes, url, swampLabels } = readSwampAnnotation(secret);
  return notes !== undefined ||
    url !== undefined ||
    Object.keys(swampLabels).length > 0;
}

interface GcpSmConfig {
  project_id?: string;
  secret_prefix?: string;
  api_endpoint?: string;
}

type FetchFn = (
  url: string,
  opts: { method: string; body?: unknown; projectIdOverride?: string },
) => Promise<Response>;

const emulatorFetch: FetchFn = async (url, opts) => {
  return await fetch(url, {
    method: opts.method,
    headers: { "Content-Type": "application/json" },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
};

export class GcpSmVaultProvider
  implements VaultProvider, VaultDeleteProvider, VaultAnnotationProvider {
  private readonly vaultName: string;
  private projectId: string;
  private projectIdResolved: boolean;
  private readonly prefix: string | undefined;
  private readonly apiBase: string;
  private readonly fetchFn: FetchFn;
  private readonly configProjectId: string | undefined;

  constructor(
    name: string,
    config: GcpSmConfig,
    projectId: string,
    fetchFn?: FetchFn,
  ) {
    this.vaultName = name;
    this.projectId = projectId;
    this.projectIdResolved = projectId !== "";
    this.prefix = config.secret_prefix;
    this.apiBase = config.api_endpoint
      ? config.api_endpoint.replace(/\/$/, "")
      : DEFAULT_API_BASE;
    this.configProjectId = config.project_id;
    if (fetchFn) {
      this.fetchFn = fetchFn;
    } else if (config.api_endpoint) {
      this.fetchFn = emulatorFetch;
    } else {
      this.fetchFn = authenticatedFetch;
    }
  }

  private async ensureProjectId(): Promise<void> {
    if (this.projectIdResolved) return;
    this.projectId = await resolveProjectId(this.configProjectId);
    this.projectIdResolved = true;
  }

  private secretId(key: string): string {
    const id = toGcpSecretId(key);
    return this.prefix ? `${this.prefix}${id}` : id;
  }

  private encodedSecretId(key: string): string {
    return encodeURIComponent(this.secretId(key));
  }

  private stripPrefix(secretId: string): string {
    if (this.prefix && secretId.startsWith(this.prefix)) {
      return secretId.slice(this.prefix.length);
    }
    return secretId;
  }

  private async apiCall(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<Response> {
    const url = `${this.apiBase}/v1/${path}`;
    return await this.fetchFn(url, {
      method,
      body,
      projectIdOverride: this.projectId,
    });
  }

  private async apiCallJson(
    method: string,
    path: string,
    body?: unknown,
    op?: string,
  ): Promise<unknown> {
    const resp = await this.apiCall(method, path, body);
    if (!resp.ok) {
      let data: Record<string, unknown> | null = null;
      try {
        data = await resp.json();
      } catch {
        data = null;
      }
      const errorObj = data?.error as Record<string, unknown> | undefined;
      const code = errorObj?.code ?? resp.status;
      const message = (errorObj?.message as string) ?? resp.statusText;
      const err = Object.assign(new Error(message), { code });
      throw wrapGcpSmError(op ?? method, err);
    }
    return await resp.json();
  }

  async get(secretKey: string): Promise<string> {
    return await getTracer().startActiveSpan("gcp-sm get", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "gcp",
        [Attr.RPC_SERVICE]: "SecretManager",
        [Attr.RPC_METHOD]: "accessSecretVersion",
        [Attr.VAULT_NAME]: this.vaultName,
        [Attr.VAULT_SECRET_KEY]: secretKey,
      });
      try {
        await this.ensureProjectId();
        const sid = this.encodedSecretId(secretKey);
        const data = await this.apiCallJson(
          "GET",
          `projects/${this.projectId}/secrets/${sid}/versions/latest:access`,
          undefined,
          "accessSecretVersion",
        ) as { payload?: { data?: string } };
        if (data?.payload?.data == null) {
          throw new Error(`Secret '${secretKey}' not found or has no value`);
        }
        return base64ToUtf8(data.payload.data);
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
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
    return await getTracer().startActiveSpan("gcp-sm put", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "gcp",
        [Attr.RPC_SERVICE]: "SecretManager",
        [Attr.RPC_METHOD]: "createSecret+addSecretVersion",
        [Attr.VAULT_NAME]: this.vaultName,
        [Attr.VAULT_SECRET_KEY]: secretKey,
      });
      try {
        await this.ensureProjectId();
        const sid = this.encodedSecretId(secretKey);

        const createResp = await this.apiCall(
          "POST",
          `projects/${this.projectId}/secrets?secretId=${sid}`,
          {
            replication: { automatic: {} },
            ...(options?.tags ? { labels: options.tags } : {}),
          },
        );
        if (!createResp.ok) {
          let createData: Record<string, unknown> | null = null;
          try {
            createData = await createResp.json();
          } catch {
            createData = null;
          }
          const errorObj = createData?.error as
            | Record<string, unknown>
            | undefined;
          const status = errorObj?.status;
          if (status !== "ALREADY_EXISTS") {
            const code = errorObj?.code ?? createResp.status;
            const message = (errorObj?.message as string) ??
              createResp.statusText;
            const err = Object.assign(new Error(message), { code });
            throw wrapGcpSmError("createSecret", err);
          }
        } else {
          await createResp.text();
        }

        await this.apiCallJson(
          "POST",
          `projects/${this.projectId}/secrets/${sid}:addVersion`,
          { payload: { data: utf8ToBase64(secretValue) } },
          "addSecretVersion",
        );
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
        }
        throw err;
      } finally {
        span.end();
      }
    });
  }

  async list(): Promise<string[]> {
    return await getTracer().startActiveSpan("gcp-sm list", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "gcp",
        [Attr.RPC_SERVICE]: "SecretManager",
        [Attr.RPC_METHOD]: "listSecrets",
        [Attr.VAULT_NAME]: this.vaultName,
      });
      try {
        await this.ensureProjectId();
        const names: string[] = [];
        let pageToken: string | undefined;

        do {
          const params: string[] = [];
          if (pageToken) {
            params.push(`pageToken=${encodeURIComponent(pageToken)}`);
          }
          if (this.prefix) {
            params.push(`filter=${encodeURIComponent(`name:${this.prefix}*`)}`);
          }
          const qs = params.length > 0 ? `?${params.join("&")}` : "";
          const data = await this.apiCallJson(
            "GET",
            `projects/${this.projectId}/secrets${qs}`,
            undefined,
            "listSecrets",
          ) as {
            secrets?: Array<{ name?: string } & SecretMetadata>;
            nextPageToken?: string;
          };
          for (const secret of data.secrets ?? []) {
            const name: string = secret.name ?? "";
            const id = name.split("/").pop();
            if (!id) continue;
            if (this.prefix) {
              if (!id.startsWith(this.prefix)) continue;
              names.push(this.stripPrefix(id));
            } else {
              names.push(id);
            }
          }
          pageToken = data.nextPageToken;
        } while (pageToken);

        return names.sort();
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
        }
        throw err;
      } finally {
        span.end();
      }
    });
  }

  async inventoryHygieneMetadata(
    projects: string[],
  ): Promise<HygieneMetadataSnapshot> {
    return await getTracer().startActiveSpan(
      "gcp-sm inventoryHygieneMetadata",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "gcp",
          [Attr.RPC_SERVICE]: "SecretManager",
          [Attr.RPC_METHOD]: "inventoryHygieneMetadata",
          [Attr.VAULT_NAME]: this.vaultName,
        });
        try {
          const projectSnapshots: HygieneProjectSnapshot[] = [];

          for (const projectId of projects) {
            const secrets = await this.listSecretsMetadata(projectId);
            const hygieneSecrets: HygieneSecretMetadata[] = [];

            for (const secret of secrets) {
              const secretName = secret.name ?? "";
              const shortId = secretName.split("/").pop() ?? "";

              if (this.prefix && !shortId.startsWith(this.prefix)) continue;

              const versions = await this.listVersionsMetadata(
                secretName,
              );

              hygieneSecrets.push({
                name: secretName,
                createTime: secret.createTime,
                labels: secret.labels ?? {},
                annotations: secret.annotations ?? {},
                rotation: secret.rotation
                  ? {
                    nextRotationTime: secret.rotation.nextRotationTime,
                    rotationPeriod: secret.rotation.rotationPeriod,
                  }
                  : undefined,
                expireTime: secret.expireTime,
                versionDestroyTtl: secret.versionDestroyTtl,
                versions,
              });
            }

            projectSnapshots.push({
              projectId,
              secrets: hygieneSecrets,
            });
          }

          return {
            projects: projectSnapshots,
            snapshotTimestamp: new Date().toISOString(),
            extensionVersion: vault.type,
          };
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

  private async listSecretsMetadata(
    projectId: string,
  ): Promise<SecretListEntry[]> {
    const secrets: SecretListEntry[] = [];
    let pageToken: string | undefined;

    do {
      const params: string[] = [];
      if (pageToken) {
        params.push(`pageToken=${encodeURIComponent(pageToken)}`);
      }
      if (this.prefix) {
        params.push(`filter=${encodeURIComponent(`name:${this.prefix}*`)}`);
      }
      const qs = params.length > 0 ? `?${params.join("&")}` : "";
      const data = await this.apiCallJson(
        "GET",
        `projects/${projectId}/secrets${qs}`,
        undefined,
        "listSecrets",
      ) as {
        secrets?: SecretListEntry[];
        nextPageToken?: string;
      };
      for (const secret of data.secrets ?? []) {
        secrets.push(secret);
      }
      pageToken = data.nextPageToken;
    } while (pageToken);

    return secrets;
  }

  private async listVersionsMetadata(
    secretResourceName: string,
  ): Promise<HygieneVersionMetadata[]> {
    const versions: HygieneVersionMetadata[] = [];
    let pageToken: string | undefined;

    do {
      const params: string[] = [];
      if (pageToken) {
        params.push(`pageToken=${encodeURIComponent(pageToken)}`);
      }
      const qs = params.length > 0 ? `?${params.join("&")}` : "";
      const data = await this.apiCallJson(
        "GET",
        `${secretResourceName}/versions${qs}`,
        undefined,
        "listSecretVersions",
      ) as {
        versions?: VersionListEntry[];
        nextPageToken?: string;
      };
      for (const v of data.versions ?? []) {
        versions.push({
          name: v.name ?? "",
          state: v.state ?? "STATE_UNSPECIFIED",
          createTime: v.createTime,
          destroyTime: v.destroyTime,
          scheduledDestroyTime: v.scheduledDestroyTime,
        });
      }
      pageToken = data.nextPageToken;
    } while (pageToken);

    return versions;
  }

  async delete(secretKey: string): Promise<void> {
    return await getTracer().startActiveSpan("gcp-sm delete", async (span) => {
      span.setAttributes({
        [Attr.RPC_SYSTEM]: "gcp",
        [Attr.RPC_SERVICE]: "SecretManager",
        [Attr.RPC_METHOD]: "deleteSecret",
        [Attr.VAULT_NAME]: this.vaultName,
        [Attr.VAULT_SECRET_KEY]: secretKey,
      });
      try {
        await this.ensureProjectId();
        const sid = this.encodedSecretId(secretKey);
        await this.apiCallJson(
          "DELETE",
          `projects/${this.projectId}/secrets/${sid}`,
          undefined,
          "deleteSecret",
        );
      } catch (err) {
        if (err instanceof Error) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
          span.recordException(err);
          span.setAttribute(Attr.ERROR_TYPE, err.name);
        }
        throw err;
      } finally {
        span.end();
      }
    });
  }

  getName(): string {
    return this.vaultName;
  }

  async getAnnotation(secretKey: string): Promise<VaultAnnotation | null> {
    return await getTracer().startActiveSpan(
      "gcp-sm getAnnotation",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "gcp",
          [Attr.RPC_SERVICE]: "SecretManager",
          [Attr.RPC_METHOD]: "getSecret",
          [Attr.VAULT_NAME]: this.vaultName,
          [Attr.VAULT_SECRET_KEY]: secretKey,
        });
        try {
          await this.ensureProjectId();
          const sid = this.encodedSecretId(secretKey);
          const secret = await this.apiCallJson(
            "GET",
            `projects/${this.projectId}/secrets/${sid}`,
            undefined,
            "getSecret",
          ) as SecretMetadata;

          if (!hasSwampAnnotation(secret)) return null;

          const { notes, url, updatedAt, swampLabels } = readSwampAnnotation(
            secret,
          );
          return createVaultAnnotation({
            url,
            notes,
            labels: Object.keys(swampLabels).length > 0
              ? swampLabels
              : undefined,
            updatedAt,
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
          throw err;
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
      "gcp-sm putAnnotation",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "gcp",
          [Attr.RPC_SERVICE]: "SecretManager",
          [Attr.RPC_METHOD]: "updateSecret",
          [Attr.VAULT_NAME]: this.vaultName,
          [Attr.VAULT_SECRET_KEY]: secretKey,
        });
        try {
          await this.ensureProjectId();
          const sid = this.encodedSecretId(secretKey);
          const path = `projects/${this.projectId}/secrets/${sid}`;
          const existing = await this.apiCallJson(
            "GET",
            path,
            undefined,
            "getSecret",
          ) as SecretMetadata;

          const current = readSwampAnnotation(existing);
          const mergedLabels = annotation.labels
            ? { ...current.swampLabels, ...annotation.labels }
            : current.swampLabels;

          const swampAnnotations: Record<string, string> = {};
          const mergedNotes = annotation.notes ?? current.notes;
          const mergedUrl = annotation.url ?? current.url;
          if (mergedNotes !== undefined) {
            swampAnnotations[SWAMP_NOTES_KEY] = mergedNotes;
          }
          if (mergedUrl !== undefined) {
            swampAnnotations[SWAMP_URL_KEY] = mergedUrl;
          }
          swampAnnotations[SWAMP_UPDATED_AT_KEY] = annotation.updatedAt
            .toISOString();

          const swampLabelEntries: Record<string, string> = {};
          for (const [key, value] of Object.entries(mergedLabels)) {
            swampLabelEntries[`${SWAMP_LABEL_PREFIX}${key}`] = value;
          }

          // Preserve non-swamp entries
          const finalAnnotations: Record<string, string> = {};
          for (
            const [k, v] of Object.entries(
              (existing.annotations ?? {}) as Record<string, string>,
            )
          ) {
            if (!k.startsWith(SWAMP_ANNOTATION_PREFIX)) finalAnnotations[k] = v;
          }
          Object.assign(finalAnnotations, swampAnnotations);

          const finalLabels: Record<string, string> = {};
          for (
            const [k, v] of Object.entries(
              (existing.labels ?? {}) as Record<string, string>,
            )
          ) {
            if (!k.startsWith(SWAMP_LABEL_PREFIX)) finalLabels[k] = v;
          }
          Object.assign(finalLabels, swampLabelEntries);

          await this.apiCallJson(
            "PATCH",
            `${path}?updateMask=annotations,labels`,
            {
              annotations: finalAnnotations,
              labels: finalLabels,
            },
            "updateSecret",
          );
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
      "gcp-sm deleteAnnotation",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "gcp",
          [Attr.RPC_SERVICE]: "SecretManager",
          [Attr.RPC_METHOD]: "updateSecret",
          [Attr.VAULT_NAME]: this.vaultName,
          [Attr.VAULT_SECRET_KEY]: secretKey,
        });
        try {
          await this.ensureProjectId();
          const sid = this.encodedSecretId(secretKey);
          const path = `projects/${this.projectId}/secrets/${sid}`;
          const existing = await this.apiCallJson(
            "GET",
            path,
            undefined,
            "getSecret",
          ) as SecretMetadata;

          const cleanedAnnotations: Record<string, string> = {};
          for (
            const [k, v] of Object.entries(
              (existing.annotations ?? {}) as Record<string, string>,
            )
          ) {
            if (!k.startsWith(SWAMP_ANNOTATION_PREFIX)) {
              cleanedAnnotations[k] = v;
            }
          }

          const cleanedLabels: Record<string, string> = {};
          for (
            const [k, v] of Object.entries(
              (existing.labels ?? {}) as Record<string, string>,
            )
          ) {
            if (!k.startsWith(SWAMP_LABEL_PREFIX)) cleanedLabels[k] = v;
          }

          await this.apiCallJson(
            "PATCH",
            `${path}?updateMask=annotations,labels`,
            {
              annotations: cleanedAnnotations,
              labels: cleanedLabels,
            },
            "updateSecret",
          );
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
      "gcp-sm listAnnotations",
      async (span) => {
        span.setAttributes({
          [Attr.RPC_SYSTEM]: "gcp",
          [Attr.RPC_SERVICE]: "SecretManager",
          [Attr.RPC_METHOD]: "listSecrets",
          [Attr.VAULT_NAME]: this.vaultName,
        });
        try {
          await this.ensureProjectId();
          const annotations = new Map<string, VaultAnnotation>();
          let pageToken: string | undefined;

          do {
            const params: string[] = [];
            if (pageToken) {
              params.push(`pageToken=${encodeURIComponent(pageToken)}`);
            }
            if (this.prefix) {
              params.push(
                `filter=${encodeURIComponent(`name:${this.prefix}*`)}`,
              );
            }
            const qs = params.length > 0 ? `?${params.join("&")}` : "";
            const data = await this.apiCallJson(
              "GET",
              `projects/${this.projectId}/secrets${qs}`,
              undefined,
              "listSecrets",
            ) as {
              secrets?: Array<{ name?: string } & SecretMetadata>;
              nextPageToken?: string;
            };
            for (const secret of data.secrets ?? []) {
              const name: string = secret.name ?? "";
              const id = name.split("/").pop();
              if (!id) continue;
              if (this.prefix && !id.startsWith(this.prefix)) continue;
              const key = this.prefix ? this.stripPrefix(id) : id;

              if (!hasSwampAnnotation(secret)) continue;
              const { notes, url, updatedAt, swampLabels } =
                readSwampAnnotation(secret);
              annotations.set(
                key,
                createVaultAnnotation({
                  url,
                  notes,
                  labels: Object.keys(swampLabels).length > 0
                    ? swampLabels
                    : undefined,
                  updatedAt,
                }),
              );
            }
            pageToken = data.nextPageToken;
          } while (pageToken);

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
          throw err;
        } finally {
          span.end();
        }
      },
    );
  }
}

export const vault = {
  type: "@swamp/gcp-sm",
  name: "GCP Secret Manager",
  description:
    "Google Cloud Secret Manager vault provider. Uses Application Default Credentials (ADC) for authentication.",
  configSchema: z.object({
    project_id: z.string().min(1).optional().describe(
      "GCP project ID (falls back to GOOGLE_CLOUD_PROJECT env var or ADC default)",
    ),
    secret_prefix: z.string().regex(/^[a-zA-Z0-9_-]*$/).optional().describe(
      "Prefix to namespace secrets within the project",
    ),
    api_endpoint: z.string().optional().describe(
      "Custom API endpoint for emulators (e.g. http://localhost:4588 for floci-gcp)",
    ),
  }).strict(),
  createProvider(
    name: string,
    config: Record<string, unknown>,
  ): VaultProvider & VaultDeleteProvider & VaultAnnotationProvider {
    const parsed = vault.configSchema.parse(config);
    return new GcpSmVaultProvider(
      name,
      parsed,
      parsed.project_id ?? "",
    );
  },
};

export function _createTestProvider(
  name: string,
  config: GcpSmConfig,
  projectId: string,
  fetchFn?: FetchFn,
): GcpSmVaultProvider {
  return new GcpSmVaultProvider(name, config, projectId, fetchFn);
}
