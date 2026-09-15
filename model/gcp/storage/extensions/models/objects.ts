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

// Auto-generated extension model for @swamp/gcp/storage/objects
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud Storage JSON Objects.
 *
 * An object.
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  deleteResource,
  type ExplicitGcpCredentials,
  getProjectId,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/gcp.ts";

const BASE_URL = "https://storage.googleapis.com/storage/v1/";

const GET_CONFIG = {
  "id": "storage.objects.get",
  "path": "b/{bucket}/o/{object}",
  "httpMethod": "GET",
  "parameterOrder": [
    "bucket",
    "object",
  ],
  "parameters": {
    "bucket": {
      "location": "path",
      "required": true,
    },
    "generation": {
      "location": "query",
    },
    "ifGenerationMatch": {
      "location": "query",
    },
    "ifGenerationNotMatch": {
      "location": "query",
    },
    "ifMetagenerationMatch": {
      "location": "query",
    },
    "ifMetagenerationNotMatch": {
      "location": "query",
    },
    "object": {
      "location": "path",
      "required": true,
    },
    "projection": {
      "location": "query",
    },
    "restoreToken": {
      "location": "query",
    },
    "softDeleted": {
      "location": "query",
    },
    "userProject": {
      "location": "query",
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "storage.objects.insert",
  "path": "b/{bucket}/o",
  "httpMethod": "POST",
  "parameterOrder": [
    "bucket",
  ],
  "parameters": {
    "bucket": {
      "location": "path",
      "required": true,
    },
    "contentEncoding": {
      "location": "query",
    },
    "ifGenerationMatch": {
      "location": "query",
    },
    "ifGenerationNotMatch": {
      "location": "query",
    },
    "ifMetagenerationMatch": {
      "location": "query",
    },
    "ifMetagenerationNotMatch": {
      "location": "query",
    },
    "kmsKeyName": {
      "location": "query",
    },
    "name": {
      "location": "query",
    },
    "predefinedAcl": {
      "location": "query",
    },
    "projection": {
      "location": "query",
    },
    "userProject": {
      "location": "query",
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "storage.objects.update",
  "path": "b/{bucket}/o/{object}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "bucket",
    "object",
  ],
  "parameters": {
    "bucket": {
      "location": "path",
      "required": true,
    },
    "generation": {
      "location": "query",
    },
    "ifGenerationMatch": {
      "location": "query",
    },
    "ifGenerationNotMatch": {
      "location": "query",
    },
    "ifMetagenerationMatch": {
      "location": "query",
    },
    "ifMetagenerationNotMatch": {
      "location": "query",
    },
    "object": {
      "location": "path",
      "required": true,
    },
    "overrideUnlockedRetention": {
      "location": "query",
    },
    "predefinedAcl": {
      "location": "query",
    },
    "projection": {
      "location": "query",
    },
    "userProject": {
      "location": "query",
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "storage.objects.delete",
  "path": "b/{bucket}/o/{object}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "bucket",
    "object",
  ],
  "parameters": {
    "bucket": {
      "location": "path",
      "required": true,
    },
    "generation": {
      "location": "query",
    },
    "ifGenerationMatch": {
      "location": "query",
    },
    "ifGenerationNotMatch": {
      "location": "query",
    },
    "ifMetagenerationMatch": {
      "location": "query",
    },
    "ifMetagenerationNotMatch": {
      "location": "query",
    },
    "object": {
      "location": "path",
      "required": true,
    },
    "userProject": {
      "location": "query",
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "storage.objects.list",
  "path": "b/{bucket}/o",
  "httpMethod": "GET",
  "parameterOrder": [
    "bucket",
  ],
  "parameters": {
    "bucket": {
      "location": "path",
      "required": true,
    },
    "delimiter": {
      "location": "query",
    },
    "endOffset": {
      "location": "query",
    },
    "filter": {
      "location": "query",
    },
    "includeFoldersAsPrefixes": {
      "location": "query",
    },
    "includeTrailingDelimiter": {
      "location": "query",
    },
    "matchGlob": {
      "location": "query",
    },
    "maxResults": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "prefix": {
      "location": "query",
    },
    "projection": {
      "location": "query",
    },
    "softDeleted": {
      "location": "query",
    },
    "startOffset": {
      "location": "query",
    },
    "userProject": {
      "location": "query",
    },
    "versions": {
      "location": "query",
    },
  },
} as const;

const GlobalArgsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).describe(
    "GCP OAuth2 access token; overrides GCP_ACCESS_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).describe(
    "GCP service account JSON credentials; overrides GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  project: z.string().describe(
    "GCP project ID; overrides GCP_PROJECT / GOOGLE_CLOUD_PROJECT environment variables.",
  ).optional(),
  scopes: z.string().describe(
    "Comma-separated OAuth scopes to request when minting access tokens via gcloud. Defaults to the API's Discovery Document scopes.",
  ).optional(),
  quotaProject: z.string().describe(
    "GCP project ID for quota and billing attribution; sets the x-goog-user-project header. Overrides GOOGLE_CLOUD_QUOTA_PROJECT environment variable. Required for APIs like Cloud Identity when using user credentials.",
  ).optional(),
  apiEndpoint: z.string().describe(
    "Custom API endpoint for emulators; overrides GCP_API_ENDPOINT environment variable. Defaults to the service's production URL.",
  ).optional(),
  acl: z.array(z.object({
    bucket: z.string().describe("The name of the bucket.").optional(),
    domain: z.string().describe(
      "The domain associated with the entity, if any.",
    ).optional(),
    email: z.string().describe(
      "The email address associated with the entity, if any.",
    ).optional(),
    entity: z.string().describe(
      "The entity holding the permission, in one of the following forms: - user-userId - user-email - group-groupId - group-email - domain-domain - project-team-projectId - allUsers - allAuthenticatedUsers Examples: - The user liz@example.com would be user-liz@example.com. - The group example@googlegroups.com would be group-example@googlegroups.com. - To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.",
    ).optional(),
    entityId: z.string().describe("The ID for the entity, if any.").optional(),
    etag: z.string().describe(
      "HTTP 1.1 Entity tag for the access-control entry.",
    ).optional(),
    generation: z.string().describe(
      "The content generation of the object, if applied to an object.",
    ).optional(),
    id: z.string().describe("The ID of the access-control entry.").optional(),
    kind: z.string().describe(
      "The kind of item this is. For object access control entries, this is always storage#objectAccessControl.",
    ).optional(),
    object: z.string().describe(
      "The name of the object, if applied to an object.",
    ).optional(),
    projectTeam: z.object({
      projectNumber: z.string().describe("The project number.").optional(),
      team: z.string().describe("The team.").optional(),
    }).describe("The project team associated with the entity, if any.")
      .optional(),
    role: z.string().describe("The access permission for the entity.")
      .optional(),
    selfLink: z.string().describe("The link to this access-control entry.")
      .optional(),
  })).describe("Access controls on the object.").optional(),
  bucket: z.string().describe("The name of the bucket containing this object.")
    .optional(),
  cacheControl: z.string().describe(
    "Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600.",
  ).optional(),
  componentCount: z.number().int().describe(
    "Number of underlying components that make up this object. Components are accumulated by compose operations.",
  ).optional(),
  contentDisposition: z.string().describe(
    "Content-Disposition of the object data.",
  ).optional(),
  contentEncoding: z.string().describe("Content-Encoding of the object data.")
    .optional(),
  contentLanguage: z.string().describe("Content-Language of the object data.")
    .optional(),
  contentType: z.string().describe(
    "Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream.",
  ).optional(),
  contexts: z.object({
    custom: z.record(
      z.string(),
      z.object({
        createTime: z.string().describe(
          "The time at which the object context was created in RFC 3339 format.",
        ).optional(),
        extendedDataTypeUrl: z.string().describe(
          "The type URL of the object context's extended data.",
        ).optional(),
        updateTime: z.string().describe(
          "The time at which the object context was last updated in RFC 3339 format.",
        ).optional(),
        value: z.string().describe("The value of the object context.")
          .optional(),
      }),
    ).describe("User-defined object contexts.").optional(),
  }).describe(
    "User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata.",
  ).optional(),
  crc32c: z.string().describe(
    "CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation).",
  ).optional(),
  customTime: z.string().describe(
    "A timestamp in RFC 3339 format specified by the user for an object.",
  ).optional(),
  customerEncryption: z.object({
    encryptionAlgorithm: z.string().describe("The encryption algorithm.")
      .optional(),
    keySha256: z.string().describe("SHA256 hash value of the encryption key.")
      .optional(),
  }).describe(
    "Metadata of customer-supplied encryption key, if the object is encrypted by such a key.",
  ).optional(),
  eventBasedHold: z.boolean().describe(
    "Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). One sample use case of this flag is for banks to hold loan documents for at least 3 years after loan is paid in full. Here, bucket-level retention is 3 years and the event is the loan being paid in full. In this example, these objects will be held intact for any number of years until the event has occurred (event-based hold on the object is released) and then 3 more years after that. That means retention duration of the objects begins from the moment event-based hold transitioned from true to false.",
  ).optional(),
  generation: z.string().describe(
    "The content generation of this object. Used for object versioning.",
  ).optional(),
  hardDeleteTime: z.string().describe(
    "This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket.",
  ).optional(),
  id: z.string().describe(
    "The ID of the object, including the bucket name, object name, and generation number.",
  ).optional(),
  kmsKeyName: z.string().describe(
    "Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request.",
  ).optional(),
  md5Hash: z.string().describe(
    "MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation).",
  ).optional(),
  mediaLink: z.string().describe("Media download link.").optional(),
  metadata: z.record(z.string(), z.string()).describe(
    "User-provided metadata, in key/value pairs.",
  ).optional(),
  metageneration: z.string().describe(
    "The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object.",
  ).optional(),
  name: z.string().describe(
    "The name of the object. Required if not specified by URL parameter.",
  ).optional(),
  owner: z.object({
    entity: z.string().describe("The entity, in the form user-userId.")
      .optional(),
    entityId: z.string().describe("The ID for the entity.").optional(),
  }).describe(
    "The owner of the object. This will always be the uploader of the object.",
  ).optional(),
  restoreToken: z.string().describe(
    "Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets.",
  ).optional(),
  retention: z.object({
    mode: z.string().describe(
      "The bucket's object retention mode, can only be Unlocked or Locked.",
    ).optional(),
    retainUntilTime: z.string().describe(
      "A time in RFC 3339 format until which object retention protects this object.",
    ).optional(),
  }).describe("A collection of object level retention parameters.").optional(),
  retentionExpirationTime: z.string().describe(
    "A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. Note 2: This value can be provided even when temporary hold is set (so that the user can reason about policy without having to first unset the temporary hold).",
  ).optional(),
  size: z.string().describe("Content-Length of the data in bytes.").optional(),
  softDeleteTime: z.string().describe(
    "The time at which the object became soft-deleted in RFC 3339 format.",
  ).optional(),
  storageClass: z.string().describe("Storage class of the object.").optional(),
  temporaryHold: z.boolean().describe(
    "Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. Note that unlike event-based hold, temporary hold does not impact retention expiration time of an object.",
  ).optional(),
  timeCreated: z.string().describe(
    "The creation time of the object in RFC 3339 format.",
  ).optional(),
  timeDeleted: z.string().describe(
    "The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted.",
  ).optional(),
  timeFinalized: z.string().describe("The time when the object was finalized.")
    .optional(),
  timeStorageClassUpdated: z.string().describe(
    "The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated.",
  ).optional(),
  updated: z.string().describe(
    "The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. This includes changes made by a requester, such as modifying custom metadata, as well as changes made by Cloud Storage on behalf of a requester, such as changing the storage class based on an Object Lifecycle Configuration.",
  ).optional(),
  ifGenerationMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object.",
  ).optional(),
  ifGenerationNotMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object.",
  ).optional(),
  ifMetagenerationMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current metageneration matches the given value.",
  ).optional(),
  ifMetagenerationNotMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current metageneration does not match the given value.",
  ).optional(),
  predefinedAcl: z.string().describe(
    "Apply a predefined set of access controls to this object.",
  ).optional(),
  projection: z.string().describe(
    "Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.",
  ).optional(),
  userProject: z.string().describe(
    "The project to be billed for this request. Required for Requester Pays buckets.",
  ).optional(),
  overrideUnlockedRetention: z.string().describe(
    "Must be true to remove the retention configuration, reduce its unlocked retention period, or change its mode from unlocked to locked.",
  ).optional(),
});

const StateSchema = z.object({
  acl: z.array(z.object({
    bucket: z.string(),
    domain: z.string(),
    email: z.string(),
    entity: z.string(),
    entityId: z.string(),
    etag: z.string(),
    generation: z.string(),
    id: z.string(),
    kind: z.string(),
    object: z.string(),
    projectTeam: z.object({
      projectNumber: z.string(),
      team: z.string(),
    }),
    role: z.string(),
    selfLink: z.string(),
  })).optional(),
  bucket: z.string().optional(),
  cacheControl: z.string().optional(),
  componentCount: z.number().optional(),
  contentDisposition: z.string().optional(),
  contentEncoding: z.string().optional(),
  contentLanguage: z.string().optional(),
  contentType: z.string().optional(),
  contexts: z.object({
    custom: z.record(z.string(), z.unknown()),
  }).optional(),
  crc32c: z.string().optional(),
  customTime: z.string().optional(),
  customerEncryption: z.object({
    encryptionAlgorithm: z.string(),
    keySha256: z.string(),
  }).optional(),
  etag: z.string().optional(),
  eventBasedHold: z.boolean().optional(),
  generation: z.string().optional(),
  hardDeleteTime: z.string().optional(),
  id: z.string().optional(),
  kind: z.string().optional(),
  kmsKeyName: z.string().optional(),
  md5Hash: z.string().optional(),
  mediaLink: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  metageneration: z.string().optional(),
  name: z.string(),
  owner: z.object({
    entity: z.string(),
    entityId: z.string(),
  }).optional(),
  restoreToken: z.string().optional(),
  retention: z.object({
    mode: z.string(),
    retainUntilTime: z.string(),
  }).optional(),
  retentionExpirationTime: z.string().optional(),
  selfLink: z.string().optional(),
  size: z.string().optional(),
  softDeleteTime: z.string().optional(),
  storageClass: z.string().optional(),
  temporaryHold: z.boolean().optional(),
  timeCreated: z.string().optional(),
  timeDeleted: z.string().optional(),
  timeFinalized: z.string().optional(),
  timeStorageClassUpdated: z.string().optional(),
  updated: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  acl: z.array(z.object({
    bucket: z.string().describe("The name of the bucket.").optional(),
    domain: z.string().describe(
      "The domain associated with the entity, if any.",
    ).optional(),
    email: z.string().describe(
      "The email address associated with the entity, if any.",
    ).optional(),
    entity: z.string().describe(
      "The entity holding the permission, in one of the following forms: - user-userId - user-email - group-groupId - group-email - domain-domain - project-team-projectId - allUsers - allAuthenticatedUsers Examples: - The user liz@example.com would be user-liz@example.com. - The group example@googlegroups.com would be group-example@googlegroups.com. - To refer to all members of the Google Apps for Business domain example.com, the entity would be domain-example.com.",
    ).optional(),
    entityId: z.string().describe("The ID for the entity, if any.").optional(),
    etag: z.string().describe(
      "HTTP 1.1 Entity tag for the access-control entry.",
    ).optional(),
    generation: z.string().describe(
      "The content generation of the object, if applied to an object.",
    ).optional(),
    id: z.string().describe("The ID of the access-control entry.").optional(),
    kind: z.string().describe(
      "The kind of item this is. For object access control entries, this is always storage#objectAccessControl.",
    ).optional(),
    object: z.string().describe(
      "The name of the object, if applied to an object.",
    ).optional(),
    projectTeam: z.object({
      projectNumber: z.string().describe("The project number.").optional(),
      team: z.string().describe("The team.").optional(),
    }).describe("The project team associated with the entity, if any.")
      .optional(),
    role: z.string().describe("The access permission for the entity.")
      .optional(),
    selfLink: z.string().describe("The link to this access-control entry.")
      .optional(),
  })).describe("Access controls on the object.").optional(),
  bucket: z.string().describe("The name of the bucket containing this object.")
    .optional(),
  cacheControl: z.string().describe(
    "Cache-Control directive for the object data. If omitted, and the object is accessible to all anonymous users, the default will be public, max-age=3600.",
  ).optional(),
  componentCount: z.number().int().describe(
    "Number of underlying components that make up this object. Components are accumulated by compose operations.",
  ).optional(),
  contentDisposition: z.string().describe(
    "Content-Disposition of the object data.",
  ).optional(),
  contentEncoding: z.string().describe("Content-Encoding of the object data.")
    .optional(),
  contentLanguage: z.string().describe("Content-Language of the object data.")
    .optional(),
  contentType: z.string().describe(
    "Content-Type of the object data. If an object is stored without a Content-Type, it is served as application/octet-stream.",
  ).optional(),
  contexts: z.object({
    custom: z.record(
      z.string(),
      z.object({
        createTime: z.string().describe(
          "The time at which the object context was created in RFC 3339 format.",
        ).optional(),
        extendedDataTypeUrl: z.string().describe(
          "The type URL of the object context's extended data.",
        ).optional(),
        updateTime: z.string().describe(
          "The time at which the object context was last updated in RFC 3339 format.",
        ).optional(),
        value: z.string().describe("The value of the object context.")
          .optional(),
      }),
    ).describe("User-defined object contexts.").optional(),
  }).describe(
    "User-defined or system-defined object contexts. Each object context is a key-payload pair, where the key provides the identification and the payload holds the associated value and additional metadata.",
  ).optional(),
  crc32c: z.string().describe(
    "CRC32c checksum, as described in RFC 4960, Appendix B; encoded using base64 in big-endian byte order. For more information about using the CRC32c checksum, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation).",
  ).optional(),
  customTime: z.string().describe(
    "A timestamp in RFC 3339 format specified by the user for an object.",
  ).optional(),
  customerEncryption: z.object({
    encryptionAlgorithm: z.string().describe("The encryption algorithm.")
      .optional(),
    keySha256: z.string().describe("SHA256 hash value of the encryption key.")
      .optional(),
  }).describe(
    "Metadata of customer-supplied encryption key, if the object is encrypted by such a key.",
  ).optional(),
  eventBasedHold: z.boolean().describe(
    "Whether an object is under event-based hold. Event-based hold is a way to retain objects until an event occurs, which is signified by the hold's release (i.e. this value is set to false). After being released (set to false), such objects will be subject to bucket-level retention (if any). One sample use case of this flag is for banks to hold loan documents for at least 3 years after loan is paid in full. Here, bucket-level retention is 3 years and the event is the loan being paid in full. In this example, these objects will be held intact for any number of years until the event has occurred (event-based hold on the object is released) and then 3 more years after that. That means retention duration of the objects begins from the moment event-based hold transitioned from true to false.",
  ).optional(),
  generation: z.string().describe(
    "The content generation of this object. Used for object versioning.",
  ).optional(),
  hardDeleteTime: z.string().describe(
    "This is the time (in the future) when the soft-deleted object will no longer be restorable. It is equal to the soft delete time plus the current soft delete retention duration of the bucket.",
  ).optional(),
  id: z.string().describe(
    "The ID of the object, including the bucket name, object name, and generation number.",
  ).optional(),
  kmsKeyName: z.string().describe(
    "Not currently supported. Specifying the parameter causes the request to fail with status code 400 - Bad Request.",
  ).optional(),
  md5Hash: z.string().describe(
    "MD5 hash of the data; encoded using base64. For more information about using the MD5 hash, see [Data Validation and Change Detection](https://cloud.google.com/storage/docs/data-validation).",
  ).optional(),
  mediaLink: z.string().describe("Media download link.").optional(),
  metadata: z.record(z.string(), z.string()).describe(
    "User-provided metadata, in key/value pairs.",
  ).optional(),
  metageneration: z.string().describe(
    "The version of the metadata for this object at this generation. Used for preconditions and for detecting changes in metadata. A metageneration number is only meaningful in the context of a particular generation of a particular object.",
  ).optional(),
  name: z.string().describe(
    "The name of the object. Required if not specified by URL parameter.",
  ).optional(),
  owner: z.object({
    entity: z.string().describe("The entity, in the form user-userId.")
      .optional(),
    entityId: z.string().describe("The ID for the entity.").optional(),
  }).describe(
    "The owner of the object. This will always be the uploader of the object.",
  ).optional(),
  restoreToken: z.string().describe(
    "Restore token used to differentiate deleted objects with the same name and generation. This field is only returned for deleted objects in hierarchical namespace buckets.",
  ).optional(),
  retention: z.object({
    mode: z.string().describe(
      "The bucket's object retention mode, can only be Unlocked or Locked.",
    ).optional(),
    retainUntilTime: z.string().describe(
      "A time in RFC 3339 format until which object retention protects this object.",
    ).optional(),
  }).describe("A collection of object level retention parameters.").optional(),
  retentionExpirationTime: z.string().describe(
    "A server-determined value that specifies the earliest time that the object's retention period expires. This value is in RFC 3339 format. Note 1: This field is not provided for objects with an active event-based hold, since retention expiration is unknown until the hold is removed. Note 2: This value can be provided even when temporary hold is set (so that the user can reason about policy without having to first unset the temporary hold).",
  ).optional(),
  size: z.string().describe("Content-Length of the data in bytes.").optional(),
  softDeleteTime: z.string().describe(
    "The time at which the object became soft-deleted in RFC 3339 format.",
  ).optional(),
  storageClass: z.string().describe("Storage class of the object.").optional(),
  temporaryHold: z.boolean().describe(
    "Whether an object is under temporary hold. While this flag is set to true, the object is protected against deletion and overwrites. A common use case of this flag is regulatory investigations where objects need to be retained while the investigation is ongoing. Note that unlike event-based hold, temporary hold does not impact retention expiration time of an object.",
  ).optional(),
  timeCreated: z.string().describe(
    "The creation time of the object in RFC 3339 format.",
  ).optional(),
  timeDeleted: z.string().describe(
    "The time at which the object became noncurrent in RFC 3339 format. Will be returned if and only if this version of the object has been deleted.",
  ).optional(),
  timeFinalized: z.string().describe("The time when the object was finalized.")
    .optional(),
  timeStorageClassUpdated: z.string().describe(
    "The time at which the object's storage class was last changed. When the object is initially created, it will be set to timeCreated.",
  ).optional(),
  updated: z.string().describe(
    "The modification time of the object metadata in RFC 3339 format. Set initially to object creation time and then updated whenever any metadata of the object changes. This includes changes made by a requester, such as modifying custom metadata, as well as changes made by Cloud Storage on behalf of a requester, such as changing the storage class based on an Object Lifecycle Configuration.",
  ).optional(),
  ifGenerationMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current generation matches the given value. Setting to 0 makes the operation succeed only if there are no live versions of the object.",
  ).optional(),
  ifGenerationNotMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current generation does not match the given value. If no live object exists, the precondition fails. Setting to 0 makes the operation succeed only if there is a live version of the object.",
  ).optional(),
  ifMetagenerationMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current metageneration matches the given value.",
  ).optional(),
  ifMetagenerationNotMatch: z.string().describe(
    "Makes the operation conditional on whether the object's current metageneration does not match the given value.",
  ).optional(),
  predefinedAcl: z.string().describe(
    "Apply a predefined set of access controls to this object.",
  ).optional(),
  projection: z.string().describe(
    "Set of properties to return. Defaults to noAcl, unless the object resource specifies the acl property, when it defaults to full.",
  ).optional(),
  userProject: z.string().describe(
    "The project to be billed for this request. Required for Requester Pays buckets.",
  ).optional(),
  overrideUnlockedRetention: z.string().describe(
    "Must be true to remove the retention configuration, reduce its unlocked retention period, or change its mode from unlocked to locked.",
  ).optional(),
});

const _credentialKeys = new Set([
  "accessToken",
  "credentialsJson",
  "project",
  "scopes",
  "quotaProject",
  "apiEndpoint",
]);

function _buildGcpCredentials(
  g: Record<string, unknown>,
): ExplicitGcpCredentials {
  return {
    accessToken: g.accessToken as string | undefined,
    credentialsJson: g.credentialsJson as string | undefined,
    project: g.project as string | undefined,
    scopes: typeof g.scopes === "string"
      ? g.scopes.split(",").map((s: string) => s.trim())
      : undefined,
    quotaProject: g.quotaProject as string | undefined,
  };
}

/** Swamp extension model for Google Cloud Storage JSON Objects. Registered at `@swamp/gcp/storage/objects`. */
export const model = {
  type: "@swamp/gcp/storage/objects",
  version: "2026.09.15.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.02.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.03.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.19.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.21.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.22.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.07.1",
      description: "Added: accessToken, credentialsJson, project",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.30.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.1",
      description: "Added: scopes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.18.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.19.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.20.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.21.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.29.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.13.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "Added: overrideUnlockedRetention",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "An object.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a objects",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        const body: Record<string, unknown> = {};
        if (g["acl"] !== undefined) body["acl"] = g["acl"];
        if (g["cacheControl"] !== undefined) {
          body["cacheControl"] = g["cacheControl"];
        }
        if (g["componentCount"] !== undefined) {
          body["componentCount"] = g["componentCount"];
        }
        if (g["contentDisposition"] !== undefined) {
          body["contentDisposition"] = g["contentDisposition"];
        }
        if (g["contentEncoding"] !== undefined) {
          params["contentEncoding"] = String(g["contentEncoding"]);
        }
        if (g["contentLanguage"] !== undefined) {
          body["contentLanguage"] = g["contentLanguage"];
        }
        if (g["contentType"] !== undefined) {
          body["contentType"] = g["contentType"];
        }
        if (g["contexts"] !== undefined) body["contexts"] = g["contexts"];
        if (g["crc32c"] !== undefined) body["crc32c"] = g["crc32c"];
        if (g["customTime"] !== undefined) body["customTime"] = g["customTime"];
        if (g["customerEncryption"] !== undefined) {
          body["customerEncryption"] = g["customerEncryption"];
        }
        if (g["eventBasedHold"] !== undefined) {
          body["eventBasedHold"] = g["eventBasedHold"];
        }
        if (g["generation"] !== undefined) body["generation"] = g["generation"];
        if (g["hardDeleteTime"] !== undefined) {
          body["hardDeleteTime"] = g["hardDeleteTime"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["kmsKeyName"] !== undefined) {
          params["kmsKeyName"] = String(g["kmsKeyName"]);
        }
        if (g["md5Hash"] !== undefined) body["md5Hash"] = g["md5Hash"];
        if (g["mediaLink"] !== undefined) body["mediaLink"] = g["mediaLink"];
        if (g["metadata"] !== undefined) body["metadata"] = g["metadata"];
        if (g["metageneration"] !== undefined) {
          body["metageneration"] = g["metageneration"];
        }
        if (g["name"] !== undefined) params["name"] = String(g["name"]);
        if (g["owner"] !== undefined) body["owner"] = g["owner"];
        if (g["restoreToken"] !== undefined) {
          body["restoreToken"] = g["restoreToken"];
        }
        if (g["retention"] !== undefined) body["retention"] = g["retention"];
        if (g["retentionExpirationTime"] !== undefined) {
          body["retentionExpirationTime"] = g["retentionExpirationTime"];
        }
        if (g["size"] !== undefined) body["size"] = g["size"];
        if (g["softDeleteTime"] !== undefined) {
          body["softDeleteTime"] = g["softDeleteTime"];
        }
        if (g["storageClass"] !== undefined) {
          body["storageClass"] = g["storageClass"];
        }
        if (g["temporaryHold"] !== undefined) {
          body["temporaryHold"] = g["temporaryHold"];
        }
        if (g["timeCreated"] !== undefined) {
          body["timeCreated"] = g["timeCreated"];
        }
        if (g["timeDeleted"] !== undefined) {
          body["timeDeleted"] = g["timeDeleted"];
        }
        if (g["timeFinalized"] !== undefined) {
          body["timeFinalized"] = g["timeFinalized"];
        }
        if (g["timeStorageClassUpdated"] !== undefined) {
          body["timeStorageClassUpdated"] = g["timeStorageClassUpdated"];
        }
        if (g["updated"] !== undefined) body["updated"] = g["updated"];
        if (g["ifGenerationMatch"] !== undefined) {
          params["ifGenerationMatch"] = String(g["ifGenerationMatch"]);
        }
        if (g["ifGenerationNotMatch"] !== undefined) {
          params["ifGenerationNotMatch"] = String(g["ifGenerationNotMatch"]);
        }
        if (g["ifMetagenerationMatch"] !== undefined) {
          params["ifMetagenerationMatch"] = String(g["ifMetagenerationMatch"]);
        }
        if (g["ifMetagenerationNotMatch"] !== undefined) {
          params["ifMetagenerationNotMatch"] = String(
            g["ifMetagenerationNotMatch"],
          );
        }
        if (g["predefinedAcl"] !== undefined) {
          params["predefinedAcl"] = String(g["predefinedAcl"]);
        }
        if (g["projection"] !== undefined) {
          params["projection"] = String(g["projection"]);
        }
        if (g["userProject"] !== undefined) {
          params["userProject"] = String(g["userProject"]);
        }
        if (g["name"] !== undefined) params["object"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          {
            listConfig: LIST_CONFIG,
            listParams: { "bucket": String(g["bucket"] ?? "") },
            matchField: "name",
            matchValue: String(g["name"] ?? ""),
          },
          credentials,
        ) as StateData;
        const instanceName = ((g.name ?? result.name)?.toString() ?? "current")
          .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    get: {
      description: "Get a objects",
      arguments: z.object({
        identifier: z.string().describe("The name of the objects"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        params["object"] = args.identifier;
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName =
          ((g.name ?? result.name)?.toString() ?? args.identifier).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update objects attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific objects by name (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const instanceName =
          (g.name?.toString() ?? args.identifier ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error(
            "No existing state found - run create, get, or list first",
          );
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        else if (existing["bucket"]) {
          params["bucket"] = String(existing["bucket"]);
        }
        params["object"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["acl"] !== undefined) body["acl"] = g["acl"];
        if (g["cacheControl"] !== undefined) {
          body["cacheControl"] = g["cacheControl"];
        }
        if (g["componentCount"] !== undefined) {
          body["componentCount"] = g["componentCount"];
        }
        if (g["contentDisposition"] !== undefined) {
          body["contentDisposition"] = g["contentDisposition"];
        }
        if (g["contentEncoding"] !== undefined) {
          body["contentEncoding"] = g["contentEncoding"];
        }
        if (g["contentLanguage"] !== undefined) {
          body["contentLanguage"] = g["contentLanguage"];
        }
        if (g["contentType"] !== undefined) {
          body["contentType"] = g["contentType"];
        }
        if (g["contexts"] !== undefined) body["contexts"] = g["contexts"];
        if (g["crc32c"] !== undefined) body["crc32c"] = g["crc32c"];
        if (g["customTime"] !== undefined) body["customTime"] = g["customTime"];
        if (g["customerEncryption"] !== undefined) {
          body["customerEncryption"] = g["customerEncryption"];
        }
        if (g["eventBasedHold"] !== undefined) {
          body["eventBasedHold"] = g["eventBasedHold"];
        }
        if (g["generation"] !== undefined) {
          params["generation"] = String(g["generation"]);
        } else if (existing["generation"] !== undefined) {
          params["generation"] = String(existing["generation"]);
        }
        if (g["hardDeleteTime"] !== undefined) {
          body["hardDeleteTime"] = g["hardDeleteTime"];
        }
        if (g["id"] !== undefined) body["id"] = g["id"];
        if (g["kmsKeyName"] !== undefined) body["kmsKeyName"] = g["kmsKeyName"];
        if (g["md5Hash"] !== undefined) body["md5Hash"] = g["md5Hash"];
        if (g["mediaLink"] !== undefined) body["mediaLink"] = g["mediaLink"];
        if (g["metadata"] !== undefined) body["metadata"] = g["metadata"];
        if (g["metageneration"] !== undefined) {
          body["metageneration"] = g["metageneration"];
        }
        if (g["name"] !== undefined) body["name"] = g["name"];
        if (g["owner"] !== undefined) body["owner"] = g["owner"];
        if (g["restoreToken"] !== undefined) {
          body["restoreToken"] = g["restoreToken"];
        }
        if (g["retention"] !== undefined) body["retention"] = g["retention"];
        if (g["retentionExpirationTime"] !== undefined) {
          body["retentionExpirationTime"] = g["retentionExpirationTime"];
        }
        if (g["size"] !== undefined) body["size"] = g["size"];
        if (g["softDeleteTime"] !== undefined) {
          body["softDeleteTime"] = g["softDeleteTime"];
        }
        if (g["storageClass"] !== undefined) {
          body["storageClass"] = g["storageClass"];
        }
        if (g["temporaryHold"] !== undefined) {
          body["temporaryHold"] = g["temporaryHold"];
        }
        if (g["timeCreated"] !== undefined) {
          body["timeCreated"] = g["timeCreated"];
        }
        if (g["timeDeleted"] !== undefined) {
          body["timeDeleted"] = g["timeDeleted"];
        }
        if (g["timeFinalized"] !== undefined) {
          body["timeFinalized"] = g["timeFinalized"];
        }
        if (g["timeStorageClassUpdated"] !== undefined) {
          body["timeStorageClassUpdated"] = g["timeStorageClassUpdated"];
        }
        if (g["updated"] !== undefined) body["updated"] = g["updated"];
        if (g["overrideUnlockedRetention"] !== undefined) {
          params["overrideUnlockedRetention"] = String(
            g["overrideUnlockedRetention"],
          );
        } else if (existing["overrideUnlockedRetention"] !== undefined) {
          params["overrideUnlockedRetention"] = String(
            existing["overrideUnlockedRetention"],
          );
        }
        for (const key of Object.keys(existing)) {
          if (
            key === "fingerprint" || key === "labelFingerprint" ||
            key === "etag" || key.endsWith("Fingerprint")
          ) {
            body[key] = existing[key];
          }
        }
        const result = await updateResource(
          baseUrl,
          UPDATE_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          credentials,
        ) as StateData;
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete the objects",
      arguments: z.object({
        identifier: z.string().describe("The name of the objects"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        params["object"] = args.identifier;
        const { existed } = await deleteResource(
          baseUrl,
          DELETE_CONFIG,
          params,
          credentials,
        );
        const instanceName = (g.name?.toString() ?? args.identifier).replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource("state", instanceName, {
          identifier: args.identifier,
          existed,
          status: existed ? "deleted" : "not_found",
          deletedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
    sync: {
      description: "Sync objects state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific objects by name (e.g. one discovered by list)",
        ).optional(),
      }),
      execute: async (args: { identifier?: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const instanceName =
          (g.name?.toString() ?? args.identifier ?? "current").replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error(
            "No existing state found - run create, get, or list first",
          );
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        try {
          const params: Record<string, string> = { project: projectId };
          if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
          else if (existing["bucket"]) {
            params["bucket"] = String(existing["bucket"]);
          }
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["object"] = identifier;
          const result = await readResource(
            baseUrl,
            GET_CONFIG,
            params,
            credentials,
          ) as StateData;
          const handle = await context.writeResource(
            "state",
            instanceName,
            result,
          );
          return { dataHandles: [handle] };
        } catch (error: unknown) {
          if (isResourceNotFoundError(error)) {
            const handle = await context.writeResource("state", instanceName, {
              status: "not_found",
              syncedAt: new Date().toISOString(),
            });
            return { dataHandles: [handle] };
          }
          throw error;
        }
      },
    },
    list: {
      description: "List objects resources",
      arguments: z.object({
        delimiter: z.string().describe(
          "Returns results in a directory-like mode. items will contain only objects whose names, aside from the prefix, do not contain delimiter. Objects whose names, aside from the prefix, contain delimiter will have their name, truncated after the delimiter, returned in prefixes. Duplicate prefixes are omitted.",
        ).optional(),
        endOffset: z.string().describe(
          "Filter results to objects whose names are lexicographically before endOffset. If startOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive).",
        ).optional(),
        filter: z.string().describe(
          "Filter the returned objects. Currently only supported for the contexts field. If delimiter is set, the returned prefixes are exempt from this filter.",
        ).optional(),
        includeFoldersAsPrefixes: z.boolean().describe(
          "Only applicable if delimiter is set to '/'. If true, will also include folders and managed folders (besides objects) in the returned prefixes.",
        ).optional(),
        includeTrailingDelimiter: z.boolean().describe(
          "If true, objects that end in exactly one instance of delimiter will have their metadata included in items in addition to prefixes.",
        ).optional(),
        matchGlob: z.string().describe(
          "Filter results to objects and prefixes that match this glob pattern.",
        ).optional(),
        maxResults: z.number().describe(
          "Maximum number of items plus prefixes to return in a single page of responses. As duplicate prefixes are omitted, fewer total results may be returned than requested. The service will use this parameter or 1,000 items, whichever is smaller.",
        ).optional(),
        prefix: z.string().describe(
          "Filter results to objects whose names begin with this prefix.",
        ).optional(),
        projection: z.string().describe(
          "Set of properties to return. Defaults to noAcl.",
        ).optional(),
        softDeleted: z.boolean().describe(
          "If true, only soft-deleted object versions will be listed. The default is false. For more information, see [Soft Delete](https://cloud.google.com/storage/docs/soft-delete).",
        ).optional(),
        startOffset: z.string().describe(
          "Filter results to objects whose names are lexicographically equal to or after startOffset. If endOffset is also set, the objects listed will have names between startOffset (inclusive) and endOffset (exclusive).",
        ).optional(),
        userProject: z.string().describe(
          "The project to be billed for this request. Required for Requester Pays buckets.",
        ).optional(),
        versions: z.boolean().describe(
          "If true, lists all versions of an object as distinct results. The default is false. For more information, see [Object Versioning](https://cloud.google.com/storage/docs/object-versioning).",
        ).optional(),
        maxPages: z.number().describe(
          "Maximum number of pages to fetch (default: 10)",
        ).optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        if (args["delimiter"] !== undefined) {
          params["delimiter"] = String(args["delimiter"]);
        }
        if (args["endOffset"] !== undefined) {
          params["endOffset"] = String(args["endOffset"]);
        }
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["includeFoldersAsPrefixes"] !== undefined) {
          params["includeFoldersAsPrefixes"] = String(
            args["includeFoldersAsPrefixes"],
          );
        }
        if (args["includeTrailingDelimiter"] !== undefined) {
          params["includeTrailingDelimiter"] = String(
            args["includeTrailingDelimiter"],
          );
        }
        if (args["matchGlob"] !== undefined) {
          params["matchGlob"] = String(args["matchGlob"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["prefix"] !== undefined) {
          params["prefix"] = String(args["prefix"]);
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["softDeleted"] !== undefined) {
          params["softDeleted"] = String(args["softDeleted"]);
        }
        if (args["startOffset"] !== undefined) {
          params["startOffset"] = String(args["startOffset"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        if (args["versions"] !== undefined) {
          params["versions"] = String(args["versions"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "items",
          (args.maxPages as number | undefined) ?? 10,
          credentials,
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i] as StateData;
          const instanceName = (item.name?.toString() ?? String(i)).replace(
            /[\/\\]/g,
            "_",
          ).replace(/\.\./g, "_").replace(/\0/g, "");
          const handle = await context.writeResource(
            "state",
            instanceName,
            item,
          );
          dataHandles.push(handle);
        }
        return { dataHandles, result: { count: items.length, nextPageToken } };
      },
    },
    bulk_restore: {
      description: "bulk restore",
      arguments: z.object({
        allowOverwrite: z.any().optional(),
        copySourceAcl: z.any().optional(),
        createdAfterTime: z.any().optional(),
        createdBeforeTime: z.any().optional(),
        matchGlobs: z.any().optional(),
        softDeletedAfterTime: z.any().optional(),
        softDeletedBeforeTime: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        const body: Record<string, unknown> = {};
        if (args["allowOverwrite"] !== undefined) {
          body["allowOverwrite"] = args["allowOverwrite"];
        }
        if (args["copySourceAcl"] !== undefined) {
          body["copySourceAcl"] = args["copySourceAcl"];
        }
        if (args["createdAfterTime"] !== undefined) {
          body["createdAfterTime"] = args["createdAfterTime"];
        }
        if (args["createdBeforeTime"] !== undefined) {
          body["createdBeforeTime"] = args["createdBeforeTime"];
        }
        if (args["matchGlobs"] !== undefined) {
          body["matchGlobs"] = args["matchGlobs"];
        }
        if (args["softDeletedAfterTime"] !== undefined) {
          body["softDeletedAfterTime"] = args["softDeletedAfterTime"];
        }
        if (args["softDeletedBeforeTime"] !== undefined) {
          body["softDeletedBeforeTime"] = args["softDeletedBeforeTime"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.bulkRestore",
            "path": "b/{bucket}/o/bulkRestore",
            "httpMethod": "POST",
            "parameterOrder": ["bucket"],
            "parameters": {
              "bucket": { "location": "path", "required": true },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    compose: {
      description: "compose",
      arguments: z.object({
        deleteSourceObjects: z.any().optional(),
        destination: z.any().optional(),
        kind: z.any().optional(),
        sourceObjects: z.any().optional(),
        destinationPredefinedAcl: z.any().optional(),
        dropContextGroups: z.any().optional(),
        ifGenerationMatch: z.any().optional(),
        ifMetagenerationMatch: z.any().optional(),
        kmsKeyName: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["destinationBucket"] =
          existing["destinationBucket"]?.toString() ??
            g["destinationBucket"]?.toString() ?? "";
        params["destinationObject"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["destinationPredefinedAcl"] !== undefined) {
          params["destinationPredefinedAcl"] = String(
            args["destinationPredefinedAcl"],
          );
        }
        if (args["dropContextGroups"] !== undefined) {
          params["dropContextGroups"] = String(args["dropContextGroups"]);
        }
        if (args["ifGenerationMatch"] !== undefined) {
          params["ifGenerationMatch"] = String(args["ifGenerationMatch"]);
        }
        if (args["ifMetagenerationMatch"] !== undefined) {
          params["ifMetagenerationMatch"] = String(
            args["ifMetagenerationMatch"],
          );
        }
        if (args["kmsKeyName"] !== undefined) {
          params["kmsKeyName"] = String(args["kmsKeyName"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const body: Record<string, unknown> = {};
        if (args["deleteSourceObjects"] !== undefined) {
          body["deleteSourceObjects"] = args["deleteSourceObjects"];
        }
        if (args["destination"] !== undefined) {
          body["destination"] = args["destination"];
        }
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["sourceObjects"] !== undefined) {
          body["sourceObjects"] = args["sourceObjects"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.compose",
            "path": "b/{destinationBucket}/o/{destinationObject}/compose",
            "httpMethod": "POST",
            "parameterOrder": ["destinationBucket", "destinationObject"],
            "parameters": {
              "destinationBucket": { "location": "path", "required": true },
              "destinationObject": { "location": "path", "required": true },
              "destinationPredefinedAcl": { "location": "query" },
              "dropContextGroups": { "location": "query" },
              "ifGenerationMatch": { "location": "query" },
              "ifMetagenerationMatch": { "location": "query" },
              "kmsKeyName": { "location": "query" },
              "userProject": { "location": "query" },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    copy: {
      description: "copy",
      arguments: z.object({
        acl: z.any().optional(),
        bucket: z.any().optional(),
        cacheControl: z.any().optional(),
        componentCount: z.any().optional(),
        contentDisposition: z.any().optional(),
        contentEncoding: z.any().optional(),
        contentLanguage: z.any().optional(),
        contentType: z.any().optional(),
        contexts: z.any().optional(),
        crc32c: z.any().optional(),
        customTime: z.any().optional(),
        customerEncryption: z.any().optional(),
        etag: z.any().optional(),
        eventBasedHold: z.any().optional(),
        generation: z.any().optional(),
        hardDeleteTime: z.any().optional(),
        id: z.any().optional(),
        kind: z.any().optional(),
        kmsKeyName: z.any().optional(),
        md5Hash: z.any().optional(),
        mediaLink: z.any().optional(),
        metadata: z.any().optional(),
        metageneration: z.any().optional(),
        name: z.any().optional(),
        owner: z.any().optional(),
        restoreToken: z.any().optional(),
        retention: z.any().optional(),
        retentionExpirationTime: z.any().optional(),
        selfLink: z.any().optional(),
        size: z.any().optional(),
        softDeleteTime: z.any().optional(),
        storageClass: z.any().optional(),
        temporaryHold: z.any().optional(),
        timeCreated: z.any().optional(),
        timeDeleted: z.any().optional(),
        timeFinalized: z.any().optional(),
        timeStorageClassUpdated: z.any().optional(),
        updated: z.any().optional(),
        destinationKmsKeyName: z.any().optional(),
        destinationPredefinedAcl: z.any().optional(),
        ifGenerationMatch: z.any().optional(),
        ifGenerationNotMatch: z.any().optional(),
        ifMetagenerationMatch: z.any().optional(),
        ifMetagenerationNotMatch: z.any().optional(),
        ifSourceGenerationMatch: z.any().optional(),
        ifSourceGenerationNotMatch: z.any().optional(),
        ifSourceMetagenerationMatch: z.any().optional(),
        ifSourceMetagenerationNotMatch: z.any().optional(),
        projection: z.any().optional(),
        sourceGeneration: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["sourceBucket"] = existing["sourceBucket"]?.toString() ??
          g["sourceBucket"]?.toString() ?? "";
        params["sourceObject"] = existing["sourceObject"]?.toString() ??
          g["sourceObject"]?.toString() ?? "";
        params["destinationBucket"] =
          existing["destinationBucket"]?.toString() ??
            g["destinationBucket"]?.toString() ?? "";
        params["destinationObject"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["destinationKmsKeyName"] !== undefined) {
          params["destinationKmsKeyName"] = String(
            args["destinationKmsKeyName"],
          );
        }
        if (args["destinationPredefinedAcl"] !== undefined) {
          params["destinationPredefinedAcl"] = String(
            args["destinationPredefinedAcl"],
          );
        }
        if (args["ifGenerationMatch"] !== undefined) {
          params["ifGenerationMatch"] = String(args["ifGenerationMatch"]);
        }
        if (args["ifGenerationNotMatch"] !== undefined) {
          params["ifGenerationNotMatch"] = String(args["ifGenerationNotMatch"]);
        }
        if (args["ifMetagenerationMatch"] !== undefined) {
          params["ifMetagenerationMatch"] = String(
            args["ifMetagenerationMatch"],
          );
        }
        if (args["ifMetagenerationNotMatch"] !== undefined) {
          params["ifMetagenerationNotMatch"] = String(
            args["ifMetagenerationNotMatch"],
          );
        }
        if (args["ifSourceGenerationMatch"] !== undefined) {
          params["ifSourceGenerationMatch"] = String(
            args["ifSourceGenerationMatch"],
          );
        }
        if (args["ifSourceGenerationNotMatch"] !== undefined) {
          params["ifSourceGenerationNotMatch"] = String(
            args["ifSourceGenerationNotMatch"],
          );
        }
        if (args["ifSourceMetagenerationMatch"] !== undefined) {
          params["ifSourceMetagenerationMatch"] = String(
            args["ifSourceMetagenerationMatch"],
          );
        }
        if (args["ifSourceMetagenerationNotMatch"] !== undefined) {
          params["ifSourceMetagenerationNotMatch"] = String(
            args["ifSourceMetagenerationNotMatch"],
          );
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["sourceGeneration"] !== undefined) {
          params["sourceGeneration"] = String(args["sourceGeneration"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const body: Record<string, unknown> = {};
        if (args["acl"] !== undefined) body["acl"] = args["acl"];
        if (args["bucket"] !== undefined) body["bucket"] = args["bucket"];
        if (args["cacheControl"] !== undefined) {
          body["cacheControl"] = args["cacheControl"];
        }
        if (args["componentCount"] !== undefined) {
          body["componentCount"] = args["componentCount"];
        }
        if (args["contentDisposition"] !== undefined) {
          body["contentDisposition"] = args["contentDisposition"];
        }
        if (args["contentEncoding"] !== undefined) {
          body["contentEncoding"] = args["contentEncoding"];
        }
        if (args["contentLanguage"] !== undefined) {
          body["contentLanguage"] = args["contentLanguage"];
        }
        if (args["contentType"] !== undefined) {
          body["contentType"] = args["contentType"];
        }
        if (args["contexts"] !== undefined) body["contexts"] = args["contexts"];
        if (args["crc32c"] !== undefined) body["crc32c"] = args["crc32c"];
        if (args["customTime"] !== undefined) {
          body["customTime"] = args["customTime"];
        }
        if (args["customerEncryption"] !== undefined) {
          body["customerEncryption"] = args["customerEncryption"];
        }
        if (args["etag"] !== undefined) body["etag"] = args["etag"];
        if (args["eventBasedHold"] !== undefined) {
          body["eventBasedHold"] = args["eventBasedHold"];
        }
        if (args["generation"] !== undefined) {
          body["generation"] = args["generation"];
        }
        if (args["hardDeleteTime"] !== undefined) {
          body["hardDeleteTime"] = args["hardDeleteTime"];
        }
        if (args["id"] !== undefined) body["id"] = args["id"];
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["kmsKeyName"] !== undefined) {
          body["kmsKeyName"] = args["kmsKeyName"];
        }
        if (args["md5Hash"] !== undefined) body["md5Hash"] = args["md5Hash"];
        if (args["mediaLink"] !== undefined) {
          body["mediaLink"] = args["mediaLink"];
        }
        if (args["metadata"] !== undefined) body["metadata"] = args["metadata"];
        if (args["metageneration"] !== undefined) {
          body["metageneration"] = args["metageneration"];
        }
        if (args["name"] !== undefined) body["name"] = args["name"];
        if (args["owner"] !== undefined) body["owner"] = args["owner"];
        if (args["restoreToken"] !== undefined) {
          body["restoreToken"] = args["restoreToken"];
        }
        if (args["retention"] !== undefined) {
          body["retention"] = args["retention"];
        }
        if (args["retentionExpirationTime"] !== undefined) {
          body["retentionExpirationTime"] = args["retentionExpirationTime"];
        }
        if (args["selfLink"] !== undefined) body["selfLink"] = args["selfLink"];
        if (args["size"] !== undefined) body["size"] = args["size"];
        if (args["softDeleteTime"] !== undefined) {
          body["softDeleteTime"] = args["softDeleteTime"];
        }
        if (args["storageClass"] !== undefined) {
          body["storageClass"] = args["storageClass"];
        }
        if (args["temporaryHold"] !== undefined) {
          body["temporaryHold"] = args["temporaryHold"];
        }
        if (args["timeCreated"] !== undefined) {
          body["timeCreated"] = args["timeCreated"];
        }
        if (args["timeDeleted"] !== undefined) {
          body["timeDeleted"] = args["timeDeleted"];
        }
        if (args["timeFinalized"] !== undefined) {
          body["timeFinalized"] = args["timeFinalized"];
        }
        if (args["timeStorageClassUpdated"] !== undefined) {
          body["timeStorageClassUpdated"] = args["timeStorageClassUpdated"];
        }
        if (args["updated"] !== undefined) body["updated"] = args["updated"];
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.copy",
            "path":
              "b/{sourceBucket}/o/{sourceObject}/copyTo/b/{destinationBucket}/o/{destinationObject}",
            "httpMethod": "POST",
            "parameterOrder": [
              "sourceBucket",
              "sourceObject",
              "destinationBucket",
              "destinationObject",
            ],
            "parameters": {
              "destinationBucket": { "location": "path", "required": true },
              "destinationKmsKeyName": { "location": "query" },
              "destinationObject": { "location": "path", "required": true },
              "destinationPredefinedAcl": { "location": "query" },
              "ifGenerationMatch": { "location": "query" },
              "ifGenerationNotMatch": { "location": "query" },
              "ifMetagenerationMatch": { "location": "query" },
              "ifMetagenerationNotMatch": { "location": "query" },
              "ifSourceGenerationMatch": { "location": "query" },
              "ifSourceGenerationNotMatch": { "location": "query" },
              "ifSourceMetagenerationMatch": { "location": "query" },
              "ifSourceMetagenerationNotMatch": { "location": "query" },
              "projection": { "location": "query" },
              "sourceBucket": { "location": "path", "required": true },
              "sourceGeneration": { "location": "query" },
              "sourceObject": { "location": "path", "required": true },
              "userProject": { "location": "query" },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    get_iam_policy: {
      description: "get iam policy",
      arguments: z.object({
        generation: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["object"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["generation"] !== undefined) {
          params["generation"] = String(args["generation"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.getIamPolicy",
            "path": "b/{bucket}/o/{object}/iam",
            "httpMethod": "GET",
            "parameterOrder": ["bucket", "object"],
            "parameters": {
              "bucket": { "location": "path", "required": true },
              "generation": { "location": "query" },
              "object": { "location": "path", "required": true },
              "userProject": { "location": "query" },
            },
          },
          params,
          undefined,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    move: {
      description: "move",
      arguments: z.object({
        ifGenerationMatch: z.any().optional(),
        ifGenerationNotMatch: z.any().optional(),
        ifMetagenerationMatch: z.any().optional(),
        ifMetagenerationNotMatch: z.any().optional(),
        ifSourceGenerationMatch: z.any().optional(),
        ifSourceGenerationNotMatch: z.any().optional(),
        ifSourceMetagenerationMatch: z.any().optional(),
        ifSourceMetagenerationNotMatch: z.any().optional(),
        projection: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["sourceObject"] = existing["sourceObject"]?.toString() ??
          g["sourceObject"]?.toString() ?? "";
        params["destinationObject"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["ifGenerationMatch"] !== undefined) {
          params["ifGenerationMatch"] = String(args["ifGenerationMatch"]);
        }
        if (args["ifGenerationNotMatch"] !== undefined) {
          params["ifGenerationNotMatch"] = String(args["ifGenerationNotMatch"]);
        }
        if (args["ifMetagenerationMatch"] !== undefined) {
          params["ifMetagenerationMatch"] = String(
            args["ifMetagenerationMatch"],
          );
        }
        if (args["ifMetagenerationNotMatch"] !== undefined) {
          params["ifMetagenerationNotMatch"] = String(
            args["ifMetagenerationNotMatch"],
          );
        }
        if (args["ifSourceGenerationMatch"] !== undefined) {
          params["ifSourceGenerationMatch"] = String(
            args["ifSourceGenerationMatch"],
          );
        }
        if (args["ifSourceGenerationNotMatch"] !== undefined) {
          params["ifSourceGenerationNotMatch"] = String(
            args["ifSourceGenerationNotMatch"],
          );
        }
        if (args["ifSourceMetagenerationMatch"] !== undefined) {
          params["ifSourceMetagenerationMatch"] = String(
            args["ifSourceMetagenerationMatch"],
          );
        }
        if (args["ifSourceMetagenerationNotMatch"] !== undefined) {
          params["ifSourceMetagenerationNotMatch"] = String(
            args["ifSourceMetagenerationNotMatch"],
          );
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.move",
            "path": "b/{bucket}/o/{sourceObject}/moveTo/o/{destinationObject}",
            "httpMethod": "POST",
            "parameterOrder": ["bucket", "sourceObject", "destinationObject"],
            "parameters": {
              "bucket": { "location": "path", "required": true },
              "destinationObject": { "location": "path", "required": true },
              "ifGenerationMatch": { "location": "query" },
              "ifGenerationNotMatch": { "location": "query" },
              "ifMetagenerationMatch": { "location": "query" },
              "ifMetagenerationNotMatch": { "location": "query" },
              "ifSourceGenerationMatch": { "location": "query" },
              "ifSourceGenerationNotMatch": { "location": "query" },
              "ifSourceMetagenerationMatch": { "location": "query" },
              "ifSourceMetagenerationNotMatch": { "location": "query" },
              "projection": { "location": "query" },
              "sourceObject": { "location": "path", "required": true },
              "userProject": { "location": "query" },
            },
          },
          params,
          {},
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    restore: {
      description: "restore",
      arguments: z.object({
        copySourceAcl: z.any().optional(),
        ifGenerationMatch: z.any().optional(),
        ifGenerationNotMatch: z.any().optional(),
        ifMetagenerationMatch: z.any().optional(),
        ifMetagenerationNotMatch: z.any().optional(),
        projection: z.any().optional(),
        restoreToken: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        if (g["generation"] !== undefined) {
          params["generation"] = String(g["generation"]);
        }
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["object"] = existing["object"]?.toString() ??
          g["object"]?.toString() ?? "";
        if (args["copySourceAcl"] !== undefined) {
          params["copySourceAcl"] = String(args["copySourceAcl"]);
        }
        if (args["ifGenerationMatch"] !== undefined) {
          params["ifGenerationMatch"] = String(args["ifGenerationMatch"]);
        }
        if (args["ifGenerationNotMatch"] !== undefined) {
          params["ifGenerationNotMatch"] = String(args["ifGenerationNotMatch"]);
        }
        if (args["ifMetagenerationMatch"] !== undefined) {
          params["ifMetagenerationMatch"] = String(
            args["ifMetagenerationMatch"],
          );
        }
        if (args["ifMetagenerationNotMatch"] !== undefined) {
          params["ifMetagenerationNotMatch"] = String(
            args["ifMetagenerationNotMatch"],
          );
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["restoreToken"] !== undefined) {
          params["restoreToken"] = String(args["restoreToken"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.restore",
            "path": "b/{bucket}/o/{object}/restore",
            "httpMethod": "POST",
            "parameterOrder": ["bucket", "object", "generation"],
            "parameters": {
              "bucket": { "location": "path", "required": true },
              "copySourceAcl": { "location": "query" },
              "generation": { "location": "query", "required": true },
              "ifGenerationMatch": { "location": "query" },
              "ifGenerationNotMatch": { "location": "query" },
              "ifMetagenerationMatch": { "location": "query" },
              "ifMetagenerationNotMatch": { "location": "query" },
              "object": { "location": "path", "required": true },
              "projection": { "location": "query" },
              "restoreToken": { "location": "query" },
              "userProject": { "location": "query" },
            },
          },
          params,
          {},
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    rewrite: {
      description: "rewrite",
      arguments: z.object({
        acl: z.any().optional(),
        bucket: z.any().optional(),
        cacheControl: z.any().optional(),
        componentCount: z.any().optional(),
        contentDisposition: z.any().optional(),
        contentEncoding: z.any().optional(),
        contentLanguage: z.any().optional(),
        contentType: z.any().optional(),
        contexts: z.any().optional(),
        crc32c: z.any().optional(),
        customTime: z.any().optional(),
        customerEncryption: z.any().optional(),
        etag: z.any().optional(),
        eventBasedHold: z.any().optional(),
        generation: z.any().optional(),
        hardDeleteTime: z.any().optional(),
        id: z.any().optional(),
        kind: z.any().optional(),
        kmsKeyName: z.any().optional(),
        md5Hash: z.any().optional(),
        mediaLink: z.any().optional(),
        metadata: z.any().optional(),
        metageneration: z.any().optional(),
        name: z.any().optional(),
        owner: z.any().optional(),
        restoreToken: z.any().optional(),
        retention: z.any().optional(),
        retentionExpirationTime: z.any().optional(),
        selfLink: z.any().optional(),
        size: z.any().optional(),
        softDeleteTime: z.any().optional(),
        storageClass: z.any().optional(),
        temporaryHold: z.any().optional(),
        timeCreated: z.any().optional(),
        timeDeleted: z.any().optional(),
        timeFinalized: z.any().optional(),
        timeStorageClassUpdated: z.any().optional(),
        updated: z.any().optional(),
        destinationKmsKeyName: z.any().optional(),
        destinationPredefinedAcl: z.any().optional(),
        dropContextGroups: z.any().optional(),
        ifGenerationMatch: z.any().optional(),
        ifGenerationNotMatch: z.any().optional(),
        ifMetagenerationMatch: z.any().optional(),
        ifMetagenerationNotMatch: z.any().optional(),
        ifSourceGenerationMatch: z.any().optional(),
        ifSourceGenerationNotMatch: z.any().optional(),
        ifSourceMetagenerationMatch: z.any().optional(),
        ifSourceMetagenerationNotMatch: z.any().optional(),
        maxBytesRewrittenPerCall: z.any().optional(),
        projection: z.any().optional(),
        rewriteToken: z.any().optional(),
        sourceGeneration: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["sourceBucket"] = existing["sourceBucket"]?.toString() ??
          g["sourceBucket"]?.toString() ?? "";
        params["sourceObject"] = existing["sourceObject"]?.toString() ??
          g["sourceObject"]?.toString() ?? "";
        params["destinationBucket"] =
          existing["destinationBucket"]?.toString() ??
            g["destinationBucket"]?.toString() ?? "";
        params["destinationObject"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["destinationKmsKeyName"] !== undefined) {
          params["destinationKmsKeyName"] = String(
            args["destinationKmsKeyName"],
          );
        }
        if (args["destinationPredefinedAcl"] !== undefined) {
          params["destinationPredefinedAcl"] = String(
            args["destinationPredefinedAcl"],
          );
        }
        if (args["dropContextGroups"] !== undefined) {
          params["dropContextGroups"] = String(args["dropContextGroups"]);
        }
        if (args["ifGenerationMatch"] !== undefined) {
          params["ifGenerationMatch"] = String(args["ifGenerationMatch"]);
        }
        if (args["ifGenerationNotMatch"] !== undefined) {
          params["ifGenerationNotMatch"] = String(args["ifGenerationNotMatch"]);
        }
        if (args["ifMetagenerationMatch"] !== undefined) {
          params["ifMetagenerationMatch"] = String(
            args["ifMetagenerationMatch"],
          );
        }
        if (args["ifMetagenerationNotMatch"] !== undefined) {
          params["ifMetagenerationNotMatch"] = String(
            args["ifMetagenerationNotMatch"],
          );
        }
        if (args["ifSourceGenerationMatch"] !== undefined) {
          params["ifSourceGenerationMatch"] = String(
            args["ifSourceGenerationMatch"],
          );
        }
        if (args["ifSourceGenerationNotMatch"] !== undefined) {
          params["ifSourceGenerationNotMatch"] = String(
            args["ifSourceGenerationNotMatch"],
          );
        }
        if (args["ifSourceMetagenerationMatch"] !== undefined) {
          params["ifSourceMetagenerationMatch"] = String(
            args["ifSourceMetagenerationMatch"],
          );
        }
        if (args["ifSourceMetagenerationNotMatch"] !== undefined) {
          params["ifSourceMetagenerationNotMatch"] = String(
            args["ifSourceMetagenerationNotMatch"],
          );
        }
        if (args["maxBytesRewrittenPerCall"] !== undefined) {
          params["maxBytesRewrittenPerCall"] = String(
            args["maxBytesRewrittenPerCall"],
          );
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["rewriteToken"] !== undefined) {
          params["rewriteToken"] = String(args["rewriteToken"]);
        }
        if (args["sourceGeneration"] !== undefined) {
          params["sourceGeneration"] = String(args["sourceGeneration"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const body: Record<string, unknown> = {};
        if (args["acl"] !== undefined) body["acl"] = args["acl"];
        if (args["bucket"] !== undefined) body["bucket"] = args["bucket"];
        if (args["cacheControl"] !== undefined) {
          body["cacheControl"] = args["cacheControl"];
        }
        if (args["componentCount"] !== undefined) {
          body["componentCount"] = args["componentCount"];
        }
        if (args["contentDisposition"] !== undefined) {
          body["contentDisposition"] = args["contentDisposition"];
        }
        if (args["contentEncoding"] !== undefined) {
          body["contentEncoding"] = args["contentEncoding"];
        }
        if (args["contentLanguage"] !== undefined) {
          body["contentLanguage"] = args["contentLanguage"];
        }
        if (args["contentType"] !== undefined) {
          body["contentType"] = args["contentType"];
        }
        if (args["contexts"] !== undefined) body["contexts"] = args["contexts"];
        if (args["crc32c"] !== undefined) body["crc32c"] = args["crc32c"];
        if (args["customTime"] !== undefined) {
          body["customTime"] = args["customTime"];
        }
        if (args["customerEncryption"] !== undefined) {
          body["customerEncryption"] = args["customerEncryption"];
        }
        if (args["etag"] !== undefined) body["etag"] = args["etag"];
        if (args["eventBasedHold"] !== undefined) {
          body["eventBasedHold"] = args["eventBasedHold"];
        }
        if (args["generation"] !== undefined) {
          body["generation"] = args["generation"];
        }
        if (args["hardDeleteTime"] !== undefined) {
          body["hardDeleteTime"] = args["hardDeleteTime"];
        }
        if (args["id"] !== undefined) body["id"] = args["id"];
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["kmsKeyName"] !== undefined) {
          body["kmsKeyName"] = args["kmsKeyName"];
        }
        if (args["md5Hash"] !== undefined) body["md5Hash"] = args["md5Hash"];
        if (args["mediaLink"] !== undefined) {
          body["mediaLink"] = args["mediaLink"];
        }
        if (args["metadata"] !== undefined) body["metadata"] = args["metadata"];
        if (args["metageneration"] !== undefined) {
          body["metageneration"] = args["metageneration"];
        }
        if (args["name"] !== undefined) body["name"] = args["name"];
        if (args["owner"] !== undefined) body["owner"] = args["owner"];
        if (args["restoreToken"] !== undefined) {
          body["restoreToken"] = args["restoreToken"];
        }
        if (args["retention"] !== undefined) {
          body["retention"] = args["retention"];
        }
        if (args["retentionExpirationTime"] !== undefined) {
          body["retentionExpirationTime"] = args["retentionExpirationTime"];
        }
        if (args["selfLink"] !== undefined) body["selfLink"] = args["selfLink"];
        if (args["size"] !== undefined) body["size"] = args["size"];
        if (args["softDeleteTime"] !== undefined) {
          body["softDeleteTime"] = args["softDeleteTime"];
        }
        if (args["storageClass"] !== undefined) {
          body["storageClass"] = args["storageClass"];
        }
        if (args["temporaryHold"] !== undefined) {
          body["temporaryHold"] = args["temporaryHold"];
        }
        if (args["timeCreated"] !== undefined) {
          body["timeCreated"] = args["timeCreated"];
        }
        if (args["timeDeleted"] !== undefined) {
          body["timeDeleted"] = args["timeDeleted"];
        }
        if (args["timeFinalized"] !== undefined) {
          body["timeFinalized"] = args["timeFinalized"];
        }
        if (args["timeStorageClassUpdated"] !== undefined) {
          body["timeStorageClassUpdated"] = args["timeStorageClassUpdated"];
        }
        if (args["updated"] !== undefined) body["updated"] = args["updated"];
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.rewrite",
            "path":
              "b/{sourceBucket}/o/{sourceObject}/rewriteTo/b/{destinationBucket}/o/{destinationObject}",
            "httpMethod": "POST",
            "parameterOrder": [
              "sourceBucket",
              "sourceObject",
              "destinationBucket",
              "destinationObject",
            ],
            "parameters": {
              "destinationBucket": { "location": "path", "required": true },
              "destinationKmsKeyName": { "location": "query" },
              "destinationObject": { "location": "path", "required": true },
              "destinationPredefinedAcl": { "location": "query" },
              "dropContextGroups": { "location": "query" },
              "ifGenerationMatch": { "location": "query" },
              "ifGenerationNotMatch": { "location": "query" },
              "ifMetagenerationMatch": { "location": "query" },
              "ifMetagenerationNotMatch": { "location": "query" },
              "ifSourceGenerationMatch": { "location": "query" },
              "ifSourceGenerationNotMatch": { "location": "query" },
              "ifSourceMetagenerationMatch": { "location": "query" },
              "ifSourceMetagenerationNotMatch": { "location": "query" },
              "maxBytesRewrittenPerCall": { "location": "query" },
              "projection": { "location": "query" },
              "rewriteToken": { "location": "query" },
              "sourceBucket": { "location": "path", "required": true },
              "sourceGeneration": { "location": "query" },
              "sourceObject": { "location": "path", "required": true },
              "userProject": { "location": "query" },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    set_iam_policy: {
      description: "set iam policy",
      arguments: z.object({
        bindings: z.any().optional(),
        etag: z.any().optional(),
        kind: z.any().optional(),
        resourceId: z.any().optional(),
        version: z.any().optional(),
        generation: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["object"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["generation"] !== undefined) {
          params["generation"] = String(args["generation"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const body: Record<string, unknown> = {};
        if (args["bindings"] !== undefined) body["bindings"] = args["bindings"];
        if (args["etag"] !== undefined) body["etag"] = args["etag"];
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["resourceId"] !== undefined) {
          body["resourceId"] = args["resourceId"];
        }
        if (args["version"] !== undefined) body["version"] = args["version"];
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.setIamPolicy",
            "path": "b/{bucket}/o/{object}/iam",
            "httpMethod": "PUT",
            "parameterOrder": ["bucket", "object"],
            "parameters": {
              "bucket": { "location": "path", "required": true },
              "generation": { "location": "query" },
              "object": { "location": "path", "required": true },
              "userProject": { "location": "query" },
            },
          },
          params,
          body,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
    test_iam_permissions: {
      description: "test iam permissions",
      arguments: z.object({
        generation: z.any().optional(),
        userProject: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { project: projectId };
        if (g["bucket"] !== undefined) params["bucket"] = String(g["bucket"]);
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          (g.name?.toString() ?? "current").replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, ""),
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        params["object"] = existing["object"]?.toString() ??
          g["object"]?.toString() ?? "";
        params["permissions"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["generation"] !== undefined) {
          params["generation"] = String(args["generation"]);
        }
        if (args["userProject"] !== undefined) {
          params["userProject"] = String(args["userProject"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "storage.objects.testIamPermissions",
            "path": "b/{bucket}/o/{object}/iam/testPermissions",
            "httpMethod": "GET",
            "parameterOrder": ["bucket", "object", "permissions"],
            "parameters": {
              "bucket": { "location": "path", "required": true },
              "generation": { "location": "query" },
              "object": { "location": "path", "required": true },
              "permissions": { "location": "query", "required": true },
              "userProject": { "location": "query" },
            },
          },
          params,
          undefined,
          undefined,
          undefined,
          undefined,
          credentials,
        );
        return { result };
      },
    },
  },
};
