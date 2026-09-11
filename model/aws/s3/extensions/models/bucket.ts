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

// Auto-generated extension model for @swamp/aws/s3/bucket
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for S3 Bucket (AWS::S3::Bucket).
 *
 * Wraps the CloudFormation resource type as a swamp model so create,
 * get, update, delete, sync, and list can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  createResource,
  deleteResource,
  isResourceNotFoundError,
  listResources,
  readResource,
  updateResource,
} from "./_lib/aws.ts";
import type { AwsCredentials } from "./_lib/aws.ts";

const DestinationSchema = z.object({
  BucketArn: z.string().describe(
    "The Amazon Resource Name (ARN) of the bucket to which data is exported.",
  ),
  Format: z.enum(["CSV", "ORC", "Parquet"]).describe(
    "Specifies the file format used when exporting data to Amazon S3. *Allowed values*: CSV | ORC | Parquet",
  ),
  BucketAccountId: z.string().describe(
    "The account ID that owns the destination S3 bucket. If no account ID is provided, the owner is not validated before exporting data. Although this value is optional, we strongly recommend that you set it to help prevent problems if the destination bucket ownership changes.",
  ).optional(),
  Prefix: z.string().describe(
    "The prefix to use when exporting data. The prefix is prepended to all results.",
  ).optional(),
});

const InventoryConfigurationSchema = z.object({
  Destination: DestinationSchema.describe(
    "Contains information about where to publish the inventory results.",
  ),
  OptionalFields: z.array(
    z.enum([
      "Size",
      "LastModifiedDate",
      "StorageClass",
      "ETag",
      "IsMultipartUploaded",
      "ReplicationStatus",
      "EncryptionStatus",
      "ObjectLockRetainUntilDate",
      "ObjectLockMode",
      "ObjectLockLegalHoldStatus",
      "ObjectLockEventHoldStatus",
      "ObjectLockEventHoldDuration",
      "IntelligentTieringAccessTier",
      "BucketKeyStatus",
      "ChecksumAlgorithm",
      "ObjectAccessControlList",
      "ObjectOwner",
      "LifecycleExpirationDate",
    ]),
  ).describe(
    "Contains the optional fields that are included in the inventory results.",
  ).optional(),
  IncludedObjectVersions: z.enum(["All", "Current"]).describe(
    "Object versions to include in the inventory list. If set to All, the list includes all the object versions, which adds the version-related fields VersionId, IsLatest, and DeleteMarker to the list. If set to Current, the list does not contain these version-related fields.",
  ),
  Enabled: z.boolean().describe(
    "Specifies whether the inventory is enabled or disabled. If set to True, an inventory list is generated. If set to False, no inventory list is generated.",
  ),
  Id: z.string().describe(
    "The ID used to identify the inventory configuration.",
  ),
  Prefix: z.string().describe("Specifies the inventory filter prefix.")
    .optional(),
  ScheduleFrequency: z.enum(["Daily", "Weekly"]).describe(
    "Specifies the schedule for generating inventory results.",
  ),
});

const RedirectAllRequestsToSchema = z.object({
  Protocol: z.enum(["http", "https"]).describe(
    "Protocol to use when redirecting requests. The default is the protocol that is used in the original request.",
  ).optional(),
  HostName: z.string().describe(
    "Name of the host where requests are redirected.",
  ),
});

const RedirectRuleSchema = z.object({
  ReplaceKeyWith: z.string().describe(
    "The specific object key to use in the redirect request. For example, redirect request to error.html. Not required if one of the siblings is present. Can be present only if ReplaceKeyPrefixWith is not provided. Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints).",
  ).optional(),
  HttpRedirectCode: z.string().describe(
    "The HTTP redirect code to use on the response. Not required if one of the siblings is present.",
  ).optional(),
  Protocol: z.enum(["http", "https"]).describe(
    "Protocol to use when redirecting requests. The default is the protocol that is used in the original request.",
  ).optional(),
  HostName: z.string().describe("The host name to use in the redirect request.")
    .optional(),
  ReplaceKeyPrefixWith: z.string().describe(
    "The object key prefix to use in the redirect request. For example, to redirect requests for all pages with prefix docs/ (objects in the docs/ folder) to documents/, you can set a condition block with KeyPrefixEquals set to docs/ and in the Redirect set ReplaceKeyPrefixWith to /documents. Not required if one of the siblings is present. Can be present only if ReplaceKeyWith is not provided. Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints).",
  ).optional(),
});

const RoutingRuleConditionSchema = z.object({
  KeyPrefixEquals: z.string().describe(
    "The object key name prefix when the redirect is applied. For example, to redirect requests for ExamplePage.html, the key prefix will be ExamplePage.html. To redirect request for all pages with the prefix docs/, the key prefix will be docs/, which identifies all objects in the docs/ folder. Required when the parent element Condition is specified and sibling HttpErrorCodeReturnedEquals is not specified. If both conditions are specified, both must be true for the redirect to be applied.",
  ).optional(),
  HttpErrorCodeReturnedEquals: z.string().describe(
    "The HTTP error code when the redirect is applied. In the event of an error, if the error code equals this value, then the specified redirect is applied. Required when parent element Condition is specified and sibling KeyPrefixEquals is not specified. If both are specified, then both must be true for the redirect to be applied.",
  ).optional(),
});

const RoutingRuleSchema = z.object({
  RedirectRule: RedirectRuleSchema.describe(
    "Container for redirect information. You can redirect requests to another host, to another page, or with another protocol. In the event of an error, you can specify a different error code to return.",
  ),
  RoutingRuleCondition: RoutingRuleConditionSchema.describe(
    "A container for describing a condition that must be met for the specified redirect to apply. For example, 1. If request is for pages in the /docs folder, redirect to the /documents folder. 2. If request results in HTTP error 4xx, redirect request to another host where you might process the error.",
  ).optional(),
});

const S3TablesDestinationSchema = z.object({
  TableBucketArn: z.string().describe(
    "The Amazon Resource Name (ARN) for the table bucket that's specified as the destination in the metadata table configuration. The destination table bucket must be in the same Region and AWS-account as the general purpose bucket.",
  ),
});

const DataExportSchema = z.object({
  Destination: DestinationSchema.describe(
    "The place to store the data for an analysis.",
  ),
  OutputSchemaVersion: z.string().describe(
    "The version of the output schema to use when exporting data. Must be V_1.",
  ),
});

const StorageClassAnalysisSchema = z.object({
  DataExport: DataExportSchema.describe(
    "Specifies how data related to the storage class analysis for an Amazon S3 bucket should be exported.",
  ).optional(),
});

const TagFilterSchema = z.object({
  Value: z.string().describe("The tag value."),
  Key: z.string().describe("The tag key."),
});

const AnalyticsConfigurationSchema = z.object({
  StorageClassAnalysis: StorageClassAnalysisSchema.describe(
    "Contains data related to access patterns to be collected and made available to analyze the tradeoffs between different storage classes.",
  ),
  TagFilters: z.array(TagFilterSchema).describe(
    "The tags to use when evaluating an analytics filter. The analytics only includes objects that meet the filter's criteria. If no filter is specified, all of the contents of the bucket are included in the analysis.",
  ).optional(),
  Id: z.string().describe(
    "The ID that identifies the analytics configuration.",
  ),
  Prefix: z.string().describe(
    "The prefix that an object must have to be included in the analytics results.",
  ).optional(),
});

const OwnershipControlsRuleSchema = z.object({
  ObjectOwnership: z.enum([
    "ObjectWriter",
    "BucketOwnerPreferred",
    "BucketOwnerEnforced",
  ]).describe("Specifies an object ownership rule.").optional(),
});

const DefaultEventHoldSchema = z.object({
  Years: z.number().int().optional(),
  Days: z.number().int().optional(),
});

const DefaultRetentionSchema = z.object({
  Years: z.number().int().describe(
    "The number of years that you want to specify for the default retention period. If Object Lock is turned on, you must specify Mode and specify either Days or Years.",
  ).optional(),
  Days: z.number().int().describe(
    "The number of days that you want to specify for the default retention period. If Object Lock is turned on, you must specify Mode and specify either Days or Years.",
  ).optional(),
  Mode: z.enum(["COMPLIANCE", "GOVERNANCE"]).describe(
    "The default Object Lock retention mode you want to apply to new objects placed in the specified bucket. If Object Lock is turned on, you must specify Mode and specify either Days or Years.",
  ).optional(),
  DefaultEventHold: DefaultEventHoldSchema.optional(),
});

const ObjectLockRuleSchema = z.object({
  DefaultRetention: DefaultRetentionSchema.describe(
    "The default Object Lock retention mode and period that you want to apply to new objects placed in the specified bucket. If Object Lock is turned on, bucket settings require both Mode and a period of either Days or Years. You cannot specify Days and Years at the same time. For more information about allowable values for mode and period, see [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html).",
  ).optional(),
});

const MetadataDestinationSchema = z.object({
  TableBucketArn: z.string().describe(
    "The Amazon Resource Name (ARN) of the table bucket where the metadata configuration is stored.",
  ).optional(),
  TableBucketType: z.enum(["aws", "customer"]).describe(
    "The type of the table bucket where the metadata configuration is stored. The aws value indicates an AWS managed table bucket, and the customer value indicates a customer-managed table bucket. V2 metadata configurations are stored in AWS managed table buckets, and V1 metadata configurations are stored in customer-managed table buckets.",
  ),
});

const MetadataTableEncryptionConfigurationSchema = z.object({
  KmsKeyArn: z.string().describe(
    "If server-side encryption with KMSlong (KMS) keys (SSE-KMS) is specified, you must also specify the KMS key Amazon Resource Name (ARN). You must specify a customer-managed KMS key that's located in the same Region as the general purpose bucket that corresponds to the metadata table configuration.",
  ).optional(),
  SseAlgorithm: z.enum(["aws:kms", "AES256"]).describe(
    "The encryption type specified for a metadata table. To specify server-side encryption with KMSlong (KMS) keys (SSE-KMS), use the aws:kms value. To specify server-side encryption with Amazon S3 managed keys (SSE-S3), use the AES256 value.",
  ),
});

const RecordExpirationSchema = z.object({
  Days: z.number().int().describe(
    "If you enable journal table record expiration, you can set the number of days to retain your journal table records. Journal table records must be retained for a minimum of 7 days. To set this value, specify any whole number from 7 to 2147483647. For example, to retain your journal table records for one year, set this value to 365.",
  ).optional(),
  Expiration: z.enum(["ENABLED", "DISABLED"]).describe(
    "Specifies whether journal table record expiration is enabled or disabled.",
  ),
});

const JournalTableConfigurationSchema = z.object({
  EncryptionConfiguration: MetadataTableEncryptionConfigurationSchema.describe(
    "The encryption configuration for the journal table.",
  ).optional(),
  RecordExpiration: RecordExpirationSchema.describe(
    "The journal table record expiration settings for the journal table.",
  ),
});

const InventoryTableConfigurationSchema = z.object({
  ConfigurationState: z.enum(["ENABLED", "DISABLED"]).describe(
    "The configuration state of the inventory table, indicating whether the inventory table is enabled or disabled.",
  ),
  EncryptionConfiguration: MetadataTableEncryptionConfigurationSchema.describe(
    "The encryption configuration for the inventory table.",
  ).optional(),
});

const AnnotationTableConfigurationSchema = z.object({
  Role: z.string().describe(
    "The ARN of the IAM role that grants Amazon S3 Metadata permission to read annotations from your bucket.",
  ).optional(),
  ConfigurationState: z.enum(["ENABLED", "DISABLED"]).describe(
    "Specifies whether the annotation table configuration is enabled or disabled.",
  ),
  EncryptionConfiguration: MetadataTableEncryptionConfigurationSchema.describe(
    "The encryption configuration for the annotation table. To encrypt your annotation table with server-side encryption using AWS Key Management Service (AWS KMS) keys (SSE-KMS), set SseAlgorithm to aws:kms. You must also set KmsKeyArn to the ARN of a customer managed KMS key in the same Region where your general purpose bucket is located.",
  ).optional(),
});

const AccessControlTranslationSchema = z.object({
  Owner: z.string().describe(
    "Specifies the replica ownership. For default and valid values, see [PUT bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) in the *Amazon S3 API Reference*.",
  ),
});

const ReplicationTimeValueSchema = z.object({
  Minutes: z.number().int().describe(
    "Contains an integer specifying time in minutes. Valid value: 15",
  ),
});

const MetricsSchema = z.object({
  Status: z.enum(["Disabled", "Enabled"]).describe(
    "Specifies whether the replication metrics are enabled.",
  ),
  EventThreshold: ReplicationTimeValueSchema.describe(
    "A container specifying the time threshold for emitting the s3:Replication:OperationMissedThreshold event.",
  ).optional(),
});

const EncryptionConfigurationSchema = z.object({
  ReplicaKmsKeyID: z.string().describe(
    "Specifies the ID (Key ARN or Alias ARN) of the customer managed AWS KMS key stored in AWS Key Management Service (KMS) for the destination bucket. Amazon S3 uses this key to encrypt replica objects. Amazon S3 only supports symmetric encryption KMS keys. For more information, see [Asymmetric keys in KMS](https://docs.aws.amazon.com//kms/latest/developerguide/symmetric-asymmetric.html) in the *Key Management Service Developer Guide*.",
  ),
});

const ReplicationTimeSchema = z.object({
  Status: z.enum(["Disabled", "Enabled"]).describe(
    "Specifies whether the replication time is enabled.",
  ),
  Time: ReplicationTimeValueSchema.describe(
    "A container specifying the time by which replication should be complete for all objects and operations on objects.",
  ),
});

const ReplicationDestinationSchema = z.object({
  AccessControlTranslation: AccessControlTranslationSchema.describe(
    "Specify this only in a cross-account scenario (where source and destination bucket owners are not the same), and you want to change replica ownership to the AWS-account that owns the destination bucket. If this is not specified in the replication configuration, the replicas are owned by same AWS-account that owns the source object.",
  ).optional(),
  Account: z.string().describe(
    "Destination bucket owner account ID. In a cross-account scenario, if you direct Amazon S3 to change replica ownership to the AWS-account that owns the destination bucket by specifying the AccessControlTranslation property, this is the account ID of the destination bucket owner. For more information, see [Cross-Region Replication Additional Configuration: Change Replica Owner](https://docs.aws.amazon.com/AmazonS3/latest/dev/crr-change-owner.html) in the *Amazon S3 User Guide*. If you specify the AccessControlTranslation property, the Account property is required.",
  ).optional(),
  Metrics: MetricsSchema.describe(
    "A container specifying replication metrics-related settings enabling replication metrics and events.",
  ).optional(),
  Bucket: z.string().describe(
    "The Amazon Resource Name (ARN) of the bucket where you want Amazon S3 to store the results.",
  ),
  EncryptionConfiguration: EncryptionConfigurationSchema.describe(
    "Specifies encryption-related information.",
  ).optional(),
  StorageClass: z.enum([
    "DEEP_ARCHIVE",
    "GLACIER",
    "GLACIER_IR",
    "INTELLIGENT_TIERING",
    "ONEZONE_IA",
    "REDUCED_REDUNDANCY",
    "STANDARD",
    "STANDARD_IA",
  ]).describe(
    "The storage class to use when replicating objects, such as S3 Standard or reduced redundancy. By default, Amazon S3 uses the storage class of the source object to create the object replica. For valid values, see the StorageClass element of the [PUT Bucket replication](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTreplication.html) action in the *Amazon S3 API Reference*. FSX_OPENZFS is not an accepted value when replicating objects.",
  ).optional(),
  ReplicationTime: ReplicationTimeSchema.describe(
    "A container specifying S3 Replication Time Control (S3 RTC), including whether S3 RTC is enabled and the time when all objects and operations on objects must be replicated. Must be specified together with a Metrics block.",
  ).optional(),
});

const ReplicationRuleAndOperatorSchema = z.object({
  TagFilters: z.array(TagFilterSchema).describe(
    "An array of tags containing key and value pairs.",
  ).optional(),
  Prefix: z.string().describe(
    "An object key name prefix that identifies the subset of objects to which the rule applies.",
  ).optional(),
});

const ReplicationRuleFilterSchema = z.object({
  And: ReplicationRuleAndOperatorSchema.describe(
    "A container for specifying rule filters. The filters determine the subset of objects to which the rule applies. This element is required only if you specify more than one filter. For example: If you specify both a Prefix and a TagFilter, wrap these filters in an And tag. If you specify a filter based on multiple tags, wrap the TagFilter elements in an And tag.",
  ).optional(),
  TagFilter: TagFilterSchema.describe(
    "A container for specifying a tag key and value. The rule applies only to objects that have the tag in their tag set.",
  ).optional(),
  Prefix: z.string().describe(
    "An object key name prefix that identifies the subset of objects to which the rule applies. Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints).",
  ).optional(),
});

const ReplicaModificationsSchema = z.object({
  Status: z.enum(["Enabled", "Disabled"]).describe(
    "Specifies whether Amazon S3 replicates modifications on replicas. *Allowed values*: Enabled | Disabled",
  ),
});

const SseKmsEncryptedObjectsSchema = z.object({
  Status: z.enum(["Disabled", "Enabled"]).describe(
    "Specifies whether Amazon S3 replicates objects created with server-side encryption using an AWS KMS key stored in AWS Key Management Service.",
  ),
});

const SourceSelectionCriteriaSchema = z.object({
  ReplicaModifications: ReplicaModificationsSchema.describe(
    "A filter that you can specify for selection for modifications on replicas.",
  ).optional(),
  SseKmsEncryptedObjects: SseKmsEncryptedObjectsSchema.describe(
    "A container for filter information for the selection of Amazon S3 objects encrypted with AWS KMS.",
  ).optional(),
});

const DeleteMarkerReplicationSchema = z.object({
  Status: z.enum(["Disabled", "Enabled"]).describe(
    "Indicates whether to replicate delete markers.",
  ).optional(),
});

const ReplicationRuleSchema = z.object({
  Status: z.enum(["Disabled", "Enabled"]).describe(
    "Specifies whether the rule is enabled.",
  ),
  Destination: ReplicationDestinationSchema.describe(
    "A container for information about the replication destination and its configurations including enabling the S3 Replication Time Control (S3 RTC).",
  ),
  Filter: ReplicationRuleFilterSchema.describe(
    "A filter that identifies the subset of objects to which the replication rule applies. A Filter must specify exactly one Prefix, TagFilter, or an And child element. The use of the filter field indicates that this is a V2 replication configuration. This field isn't supported in a V1 replication configuration. V1 replication configuration only supports filtering by key prefix. To filter using a V1 replication configuration, add the Prefix directly as a child element of the Rule element.",
  ).optional(),
  Priority: z.number().int().describe(
    "The priority indicates which rule has precedence whenever two or more replication rules conflict. Amazon S3 will attempt to replicate objects according to all replication rules. However, if there are two or more rules with the same destination bucket, then objects will be replicated according to the rule with the highest priority. The higher the number, the higher the priority. For more information, see [Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  SourceSelectionCriteria: SourceSelectionCriteriaSchema.describe(
    "A container that describes additional filters for identifying the source objects that you want to replicate. You can choose to enable or disable the replication of these objects.",
  ).optional(),
  Id: z.string().max(255).describe(
    'A unique identifier for the rule. The maximum value is 255 characters. If you don\'t specify a value, AWS CloudFormation generates a random ID. When using a V2 replication configuration this property is capitalized as "ID".',
  ).optional(),
  Prefix: z.string().max(1024).describe(
    "An object key name prefix that identifies the object or objects to which the rule applies. The maximum prefix length is 1,024 characters. To include all objects in a bucket, specify an empty string. To filter using a V1 replication configuration, add the Prefix directly as a child element of the Rule element. Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints).",
  ).optional(),
  DeleteMarkerReplication: DeleteMarkerReplicationSchema.describe(
    "Specifies whether Amazon S3 replicates delete markers. If you specify a Filter in your replication configuration, you must also include a DeleteMarkerReplication element. If your Filter includes a Tag element, the DeleteMarkerReplication Status must be set to Disabled, because Amazon S3 does not support replicating delete markers for tag-based rules. For an example configuration, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-config-min-rule-config). For more information about delete marker replication, see [Basic Rule Configuration](https://docs.aws.amazon.com/AmazonS3/latest/dev/delete-marker-replication.html). If you are using an earlier version of the replication configuration, Amazon S3 handles replication of delete markers differently. For more information, see [Backward Compatibility](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-add-config.html#replication-backward-compat-considerations).",
  ).optional(),
});

const TagSchema = z.object({
  Value: z.string().max(256).describe("Value of the tag."),
  Key: z.string().min(1).max(128).describe("Name of the object key."),
});

const BlockedEncryptionTypesSchema = z.object({
  EncryptionType: z.array(z.enum(["NONE", "SSE-C"])).describe(
    "The object encryption type that you want to block or unblock for an Amazon S3 general purpose bucket. Currently, this parameter only supports blocking or unblocking server side encryption with customer-provided keys (SSE-C). For more information about SSE-C, see [Using server-side encryption with customer-provided keys (SSE-C)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html).",
  ).optional(),
});

const ServerSideEncryptionByDefaultSchema = z.object({
  SSEAlgorithm: z.enum(["aws:kms", "AES256", "aws:kms:dsse"]).describe(
    "Server-side encryption algorithm to use for the default encryption. For directory buckets, there are only two supported values for server-side encryption: AES256 and aws:kms.",
  ),
  KMSMasterKeyID: z.string().describe(
    "AWS Key Management Service (KMS) customer managed key ID to use for the default encryption. *General purpose buckets* - This parameter is allowed if and only if SSEAlgorithm is set to aws:kms or aws:kms:dsse. *Directory buckets* - This parameter is allowed if and only if SSEAlgorithm is set to aws:kms. You can specify the key ID, key alias, or the Amazon Resource Name (ARN) of the KMS key. Key ID: 1234abcd-12ab-34cd-56ef-1234567890ab Key ARN: arn:aws:kms:us-east-2:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab Key Alias: alias/alias-name If you are using encryption with cross-account or AWS service operations, you must use a fully qualified KMS key ARN. For more information, see [Using encryption for cross-account operations](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html#bucket-encryption-update-bucket-policy). *General purpose buckets* - If you're specifying a customer managed KMS key, we recommend using a fully qualified KMS key ARN. If you use a KMS key alias instead, then KMS resolves the key within the requester’s account. This behavior can result in data that's encrypted with a KMS key that belongs to the requester, and not the bucket owner. Also, if you use a key ID, you can run into a LogDestination undeliverable error when creating a VPC flow log. *Directory buckets* - When you specify an [customer managed key](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html#customer-cmk) for encryption in your directory bucket, only use the key ID or key ARN. The key alias format of the KMS key isn't supported. Amazon S3 only supports symmetric encryption KMS keys. For more information, see [Asymmetric keys in KMS](https://docs.aws.amazon.com//kms/latest/developerguide/symmetric-asymmetric.html) in the *Key Management Service Developer Guide*.",
  ).optional(),
});

const ServerSideEncryptionRuleSchema = z.object({
  BucketKeyEnabled: z.boolean().describe(
    "Specifies whether Amazon S3 should use an S3 Bucket Key with server-side encryption using KMS (SSE-KMS) for new objects in the bucket. Existing objects are not affected. Setting the BucketKeyEnabled element to true causes Amazon S3 to use an S3 Bucket Key. By default, S3 Bucket Key is not enabled. For more information, see [Amazon S3 Bucket Keys](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-key.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  BlockedEncryptionTypes: BlockedEncryptionTypesSchema.describe(
    "A bucket-level setting for Amazon S3 general purpose buckets used to prevent the upload of new objects encrypted with the specified server-side encryption type. For example, blocking an encryption type will block PutObject, CopyObject, PostObject, multipart upload, and replication requests to the bucket for objects with the specified encryption type. However, you can continue to read and list any pre-existing objects already encrypted with the specified encryption type. For more information, see [Blocking or unblocking SSE-C for a general purpose bucket](https://docs.aws.amazon.com/AmazonS3/latest/userguide/blocking-unblocking-s3-c-encryption-gpb.html). Currently, this parameter only supports blocking or unblocking server-side encryption with customer-provided keys (SSE-C). For more information about SSE-C, see [Using server-side encryption with customer-provided keys (SSE-C)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html).",
  ).optional(),
  ServerSideEncryptionByDefault: ServerSideEncryptionByDefaultSchema.describe(
    "Specifies the default server-side encryption to apply to new objects in the bucket. If a PUT Object request doesn't specify any server-side encryption, this default encryption will be applied.",
  ).optional(),
});

const FilterRuleSchema = z.object({
  Value: z.string().describe(
    "The value that the filter searches for in object key names.",
  ),
  Name: z.string().max(1024).describe(
    "The object key name prefix or suffix identifying one or more objects to which the filtering rule applies. The maximum length is 1,024 characters. Overlapping prefixes and suffixes are not supported. For more information, see [Configuring Event Notifications](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide*.",
  ),
});

const S3KeyFilterSchema = z.object({
  Rules: z.array(FilterRuleSchema).describe(
    "A list of containers for the key-value pair that defines the criteria for the filter rule.",
  ),
});

const NotificationFilterSchema = z.object({
  S3Key: S3KeyFilterSchema.describe(
    "A container for object key name prefix and suffix filtering rules.",
  ),
});

const TopicConfigurationSchema = z.object({
  Filter: NotificationFilterSchema.describe(
    "The filtering rules that determine for which objects to send notifications. For example, you can create a filter so that Amazon S3 sends notifications only when image files with a.jpg extension are added to the bucket.",
  ).optional(),
  Event: z.string().describe(
    "The Amazon S3 bucket event about which to send notifications. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide*.",
  ),
  Topic: z.string().describe(
    "The Amazon Resource Name (ARN) of the Amazon SNS topic to which Amazon S3 publishes a message when it detects events of the specified type.",
  ),
});

const QueueConfigurationSchema = z.object({
  Filter: NotificationFilterSchema.describe(
    "The filtering rules that determine which objects trigger notifications. For example, you can create a filter so that Amazon S3 sends notifications only when image files with a.jpg extension are added to the bucket. For more information, see [Configuring event notifications using object key name filtering](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/notification-how-to-filtering.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  Event: z.string().describe(
    "The Amazon S3 bucket event about which you want to publish messages to Amazon SQS. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide*.",
  ),
  Queue: z.string().describe(
    "The Amazon Resource Name (ARN) of the Amazon SQS queue to which Amazon S3 publishes a message when it detects events of the specified type. FIFO queues are not allowed when enabling an SQS queue as the event notification destination.",
  ),
});

const LambdaConfigurationSchema = z.object({
  Function: z.string().describe(
    "The Amazon Resource Name (ARN) of the LAMlong function that Amazon S3 invokes when the specified event type occurs.",
  ),
  Filter: NotificationFilterSchema.describe(
    "The filtering rules that determine which objects invoke the AWS Lambda function. For example, you can create a filter so that only image files with a.jpg extension invoke the function when they are added to the Amazon S3 bucket.",
  ).optional(),
  Event: z.string().describe(
    "The Amazon S3 bucket event for which to invoke the LAMlong function. For more information, see [Supported Event Types](https://docs.aws.amazon.com/AmazonS3/latest/dev/NotificationHowTo.html) in the *Amazon S3 User Guide*.",
  ),
});

const EventBridgeConfigurationSchema = z.object({
  EventBridgeEnabled: z.boolean().describe(
    "Enables delivery of events to Amazon EventBridge.",
  ),
});

const TransitionSchema = z.object({
  TransitionDate: z.string().regex(
    new RegExp(
      "^(\\d{4})-(0[0-9]|1[0-2])-([0-2]\\d|3[01])T([01]\\d|2[0-4]):([0-5]\\d):([0-6]\\d)((\\.\\d{3})?)Z$",
    ),
  ).describe(
    "Indicates when objects are transitioned to the specified storage class. The date value must be in ISO 8601 format. The time is always midnight UTC.",
  ).optional(),
  StorageClass: z.enum([
    "DEEP_ARCHIVE",
    "GLACIER",
    "Glacier",
    "GLACIER_IR",
    "INTELLIGENT_TIERING",
    "ONEZONE_IA",
    "STANDARD_IA",
  ]).describe("The storage class to which you want the object to transition."),
  TransitionInDays: z.number().int().describe(
    "Indicates the number of days after creation when objects are transitioned to the specified storage class. The value can be 0 or any positive integer. Be aware that some storage classes have a minimum storage duration and that you're charged for transitioning objects before their minimum storage duration. For more information, see [Constraints and considerations for transitions](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-transition-general-considerations.html#lifecycle-configuration-constraints) in the *Amazon S3 User Guide*.",
  ).optional(),
});

const NoncurrentVersionTransitionSchema = z.object({
  StorageClass: z.enum([
    "DEEP_ARCHIVE",
    "GLACIER",
    "Glacier",
    "GLACIER_IR",
    "INTELLIGENT_TIERING",
    "ONEZONE_IA",
    "STANDARD_IA",
  ]).describe("The class of storage used to store the object."),
  TransitionInDays: z.number().int().describe(
    "Specifies the number of days an object is noncurrent before Amazon S3 can perform the associated action. For information about the noncurrent days calculations, see [How Amazon S3 Calculates How Long an Object Has Been Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide*.",
  ),
  NewerNoncurrentVersions: z.number().int().describe(
    "Specifies how many noncurrent versions S3 will retain. If there are this many more recent noncurrent versions, S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide*.",
  ).optional(),
});

const NoncurrentVersionExpirationSchema = z.object({
  NoncurrentDays: z.number().int().describe(
    "Specifies the number of days an object is noncurrent before S3 can perform the associated action. For information about the noncurrent days calculations, see [How Amazon S3 Calculates When an Object Became Noncurrent](https://docs.aws.amazon.com/AmazonS3/latest/dev/intro-lifecycle-rules.html#non-current-days-calculations) in the *Amazon S3 User Guide*.",
  ),
  NewerNoncurrentVersions: z.number().int().describe(
    "Specifies how many noncurrent versions S3 will retain. If there are this many more recent noncurrent versions, S3 will take the associated action. For more information about noncurrent versions, see [Lifecycle configuration elements](https://docs.aws.amazon.com/AmazonS3/latest/userguide/intro-lifecycle-rules.html) in the *Amazon S3 User Guide*.",
  ).optional(),
});

const AbortIncompleteMultipartUploadSchema = z.object({
  DaysAfterInitiation: z.number().int().min(0).describe(
    "Specifies the number of days after which Amazon S3 stops an incomplete multipart upload.",
  ),
});

const RuleSchema = z.object({
  Status: z.enum(["Enabled", "Disabled"]).describe(
    "If Enabled, the rule is currently being applied. If Disabled, the rule is not currently being applied.",
  ),
  ExpiredObjectDeleteMarker: z.boolean().describe(
    "Indicates whether Amazon S3 will remove a delete marker without any noncurrent versions. If set to true, the delete marker will be removed if there are no noncurrent versions. This cannot be specified with ExpirationInDays, ExpirationDate, or TagFilters.",
  ).optional(),
  NoncurrentVersionExpirationInDays: z.number().int().describe(
    "(Deprecated.) For buckets with versioning enabled (or suspended), specifies the time, in days, between when a new version of the object is uploaded to the bucket and when old versions of the object expire. When object versions expire, Amazon S3 permanently deletes them. If you specify a transition and expiration time, the expiration time must be later than the transition time.",
  ).optional(),
  Transitions: z.array(TransitionSchema).describe(
    "One or more transition rules that specify when an object transitions to a specified storage class. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the Transition property.",
  ).optional(),
  ObjectSizeGreaterThan: z.string().max(20).regex(new RegExp("[0-9]+"))
    .describe(
      "Specifies the minimum object size in bytes for this rule to apply to. Objects must be larger than this value in bytes. For more information about size based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide*.",
    ).optional(),
  TagFilters: z.array(TagFilterSchema).describe(
    "Tags to use to identify a subset of objects to which the lifecycle rule applies.",
  ).optional(),
  NoncurrentVersionTransitions: z.array(NoncurrentVersionTransitionSchema)
    .describe(
      "For buckets with versioning enabled (or suspended), one or more transition rules that specify when non-current objects transition to a specified storage class. If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the NoncurrentVersionTransition property.",
    ).optional(),
  Prefix: z.string().describe(
    "Object key prefix that identifies one or more objects to which this rule applies. Replacement must be made for object keys containing special characters (such as carriage returns) when using XML requests. For more information, see [XML related object key constraints](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html#object-key-xml-related-constraints).",
  ).optional(),
  ObjectSizeLessThan: z.string().max(20).regex(new RegExp("[0-9]+")).describe(
    "Specifies the maximum object size in bytes for this rule to apply to. Objects must be smaller than this value in bytes. For more information about sized based rules, see [Lifecycle configuration using size-based rules](https://docs.aws.amazon.com/AmazonS3/latest/userguide/lifecycle-configuration-examples.html#lc-size-rules) in the *Amazon S3 User Guide*.",
  ).optional(),
  NoncurrentVersionTransition: NoncurrentVersionTransitionSchema.describe(
    "(Deprecated.) For buckets with versioning enabled (or suspended), specifies when non-current objects transition to a specified storage class. If you specify a transition and expiration time, the expiration time must be later than the transition time. If you specify this property, don't specify the NoncurrentVersionTransitions property.",
  ).optional(),
  ExpirationDate: z.string().regex(
    new RegExp(
      "^(\\d{4})-(0[0-9]|1[0-2])-([0-2]\\d|3[01])T([01]\\d|2[0-4]):([0-5]\\d):([0-6]\\d)((\\.\\d{3})?)Z$",
    ),
  ).describe(
    "Indicates when objects are deleted from Amazon S3 and Amazon S3 Glacier. The date value must be in ISO 8601 format. The time is always midnight UTC. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.",
  ).optional(),
  NoncurrentVersionExpiration: NoncurrentVersionExpirationSchema.describe(
    "Specifies when noncurrent object versions expire. Upon expiration, S3 permanently deletes the noncurrent object versions. You set this lifecycle configuration action on a bucket that has versioning enabled (or suspended) to request that S3 delete noncurrent object versions at a specific period in the object's lifetime.",
  ).optional(),
  ExpirationInDays: z.number().int().describe(
    "Indicates the number of days after creation when objects are deleted from Amazon S3 and Amazon S3 Glacier. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time.",
  ).optional(),
  Transition: TransitionSchema.describe(
    "(Deprecated.) Specifies when an object transitions to a specified storage class. If you specify an expiration and transition time, you must use the same time unit for both properties (either in days or by date). The expiration time must also be later than the transition time. If you specify this property, don't specify the Transitions property.",
  ).optional(),
  Id: z.string().max(255).describe(
    "Unique identifier for the rule. The value can't be longer than 255 characters.",
  ).optional(),
  AbortIncompleteMultipartUpload: AbortIncompleteMultipartUploadSchema.describe(
    "Specifies a lifecycle rule that stops incomplete multipart uploads to an Amazon S3 bucket.",
  ).optional(),
});

const MetricsConfigurationSchema = z.object({
  AccessPointArn: z.string().describe(
    "The access point that was used while performing operations on the object. The metrics configuration only includes objects that meet the filter's criteria.",
  ).optional(),
  TagFilters: z.array(TagFilterSchema).describe(
    "Specifies a list of tag filters to use as a metrics configuration filter. The metrics configuration includes only objects that meet the filter's criteria.",
  ).optional(),
  Id: z.string().describe(
    "The ID used to identify the metrics configuration. This can be any value you choose that helps you identify your metrics configuration.",
  ),
  Prefix: z.string().describe(
    "The prefix that an object must have to be included in the metrics results.",
  ).optional(),
});

const TieringSchema = z.object({
  AccessTier: z.enum(["ARCHIVE_ACCESS", "DEEP_ARCHIVE_ACCESS"]).describe(
    "S3 Intelligent-Tiering access tier. See [Storage class for automatically optimizing frequently and infrequently accessed objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/storage-class-intro.html#sc-dynamic-data-access) for a list of access tiers in the S3 Intelligent-Tiering storage class.",
  ),
  Days: z.number().int().describe(
    "The number of consecutive days of no access after which an object will be eligible to be transitioned to the corresponding tier. The minimum number of days specified for Archive Access tier must be at least 90 days and Deep Archive Access tier must be at least 180 days. The maximum can be up to 2 years (730 days).",
  ),
});

const IntelligentTieringConfigurationSchema = z.object({
  Status: z.enum(["Disabled", "Enabled"]).describe(
    "Specifies the status of the configuration.",
  ),
  Tierings: z.array(TieringSchema).describe(
    "Specifies a list of S3 Intelligent-Tiering storage class tiers in the configuration. At least one tier must be defined in the list. At most, you can specify two tiers in the list, one for each available AccessTier: ARCHIVE_ACCESS and DEEP_ARCHIVE_ACCESS. You only need Intelligent Tiering Configuration enabled on a bucket if you want to automatically move objects stored in the Intelligent-Tiering storage class to Archive Access or Deep Archive Access tiers.",
  ),
  TagFilters: z.array(TagFilterSchema).describe(
    "A container for a key-value pair.",
  ).optional(),
  Id: z.string().describe(
    "The ID used to identify the S3 Intelligent-Tiering configuration.",
  ),
  Prefix: z.string().describe(
    "An object key name prefix that identifies the subset of objects to which the rule applies.",
  ).optional(),
});

const CorsRuleSchema = z.object({
  ExposedHeaders: z.array(z.string()).describe(
    "One or more headers in the response that you want customers to be able to access from their applications (for example, from a JavaScript XMLHttpRequest object).",
  ).optional(),
  AllowedMethods: z.array(z.enum(["GET", "PUT", "HEAD", "POST", "DELETE"]))
    .describe(
      "An HTTP method that you allow the origin to run. *Allowed values*: GET | PUT | HEAD | POST | DELETE",
    ),
  AllowedOrigins: z.array(z.string()).describe(
    "One or more origins you want customers to be able to access the bucket from.",
  ),
  AllowedHeaders: z.array(z.string()).describe(
    "Headers that are specified in the Access-Control-Request-Headers header. These headers are allowed in a preflight OPTIONS request. In response to any preflight OPTIONS request, Amazon S3 returns any requested headers that are allowed.",
  ).optional(),
  MaxAge: z.number().int().min(0).describe(
    "The time in seconds that your browser is to cache the preflight response for the specified resource.",
  ).optional(),
  Id: z.string().max(255).describe(
    "A unique identifier for this rule. The value must be no more than 255 characters.",
  ).optional(),
});

const GlobalArgsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).describe(
    "AWS access key ID; overrides AWS_ACCESS_KEY_ID environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).describe(
    "AWS secret access key; overrides AWS_SECRET_ACCESS_KEY environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  sessionToken: z.string().meta({ sensitive: true }).describe(
    "AWS session token for temporary credentials; overrides AWS_SESSION_TOKEN environment variable. Wire with a vault.get(...) expression to source it from a vault.",
  ).optional(),
  region: z.string().describe(
    "AWS region; overrides AWS_REGION / AWS_DEFAULT_REGION environment variables and ~/.aws/config profile region. Defaults to us-east-1.",
  ).optional(),
  BucketNamespace: z.enum(["global", "account-regional"]).optional(),
  InventoryConfigurations: z.array(InventoryConfigurationSchema).describe(
    "Specifies the S3 Inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference*.",
  ).optional(),
  BucketNamePrefix: z.string().optional(),
  WebsiteConfiguration: z.object({
    IndexDocument: z.string().describe(
      "The name of the index document for the website.",
    ).optional(),
    RedirectAllRequestsTo: RedirectAllRequestsToSchema.describe(
      "The redirect behavior for every request to this bucket's website endpoint. If you specify this property, you can't specify any other property.",
    ).optional(),
    RoutingRules: z.array(RoutingRuleSchema).describe(
      "Rules that define when a redirect is applied and the redirect behavior.",
    ).optional(),
    ErrorDocument: z.string().describe(
      "The name of the error document for the website.",
    ).optional(),
  }).describe(
    "Information used to configure the bucket as a static website. For more information, see [Hosting Websites on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).",
  ).optional(),
  AccessControl: z.enum([
    "AuthenticatedRead",
    "AwsExecRead",
    "BucketOwnerFullControl",
    "BucketOwnerRead",
    "LogDeliveryWrite",
    "Private",
    "PublicRead",
    "PublicReadWrite",
  ]).describe(
    "This is a legacy property, and it is not recommended for most use cases. A majority of modern use cases in Amazon S3 no longer require the use of ACLs, and we recommend that you keep ACLs disabled. For more information, see [Controlling object ownership](https://docs.aws.amazon.com//AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide*. A canned access control list (ACL) that grants predefined permissions to the bucket. For more information about canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 User Guide*. S3 buckets are created with ACLs disabled by default. Therefore, unless you explicitly set the [AWS::S3::OwnershipControls](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html) property to enable ACLs, your resource will fail to deploy with any value other than Private. Use cases requiring ACLs are uncommon. The majority of access control configurations can be successfully and more easily achieved with bucket policies. For more information, see [AWS::S3::BucketPolicy](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html). For examples of common policy configurations, including S3 Server Access Logs buckets and more, see [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  MetadataTableConfiguration: z.object({
    S3TablesDestination: S3TablesDestinationSchema.describe(
      "The destination information for the metadata table configuration. The destination table bucket must be in the same Region and AWS-account as the general purpose bucket. The specified metadata table name must be unique within the aws_s3_metadata namespace in the destination table bucket.",
    ),
  }).describe(
    "The metadata table configuration of an S3 general purpose bucket.",
  ).optional(),
  AnalyticsConfigurations: z.array(AnalyticsConfigurationSchema).describe(
    "Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.",
  ).optional(),
  AbacStatus: z.enum(["Enabled", "Disabled"]).describe(
    "The ABAC status of the general purpose bucket. When ABAC is enabled for the general purpose bucket, you can use tags to manage access to the general purpose buckets as well as for cost tracking purposes. When ABAC is disabled for the general purpose buckets, you can only use tags for cost tracking purposes. For more information, see [Using tags with S3 general purpose buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/buckets-tagging.html).",
  ).optional(),
  AccelerateConfiguration: z.object({
    AccelerationStatus: z.enum(["Enabled", "Suspended"]).describe(
      "Specifies the transfer acceleration status of the bucket.",
    ),
  }).describe(
    "Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  PublicAccessBlockConfiguration: z.object({
    RestrictPublicBuckets: z.boolean().describe(
      "Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to TRUE restricts access to this bucket to only AWS-service principals and authorized users within this account if the bucket has a public policy. Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.",
    ).optional(),
    BlockPublicPolicy: z.boolean().describe(
      "Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to TRUE causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access. Enabling this setting doesn't affect existing bucket policies.",
    ).optional(),
    BlockPublicAcls: z.boolean().describe(
      "Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to TRUE causes the following behavior: PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public. PUT Object calls fail if the request includes a public ACL. PUT Bucket calls fail if the request includes a public ACL. Enabling this setting doesn't affect existing policies or ACLs.",
    ).optional(),
    IgnorePublicAcls: z.boolean().describe(
      "Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to TRUE causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket. Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.",
    ).optional(),
  }).describe("Configuration that defines how Amazon S3 handles public access.")
    .optional(),
  BucketName: z.string().describe(
    "A name for the bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html). For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) in the *Amazon S3 User Guide*. If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.",
  ).optional(),
  OwnershipControls: z.object({
    Rules: z.array(OwnershipControlsRuleSchema).describe(
      "Specifies the container element for Object Ownership rules.",
    ),
  }).describe(
    "Configuration that defines how Amazon S3 handles Object Ownership rules.",
  ).optional(),
  ObjectLockConfiguration: z.object({
    ObjectLockEnabled: z.string().describe(
      "Indicates whether this bucket has an Object Lock configuration enabled. Enable ObjectLockEnabled when you apply ObjectLockConfiguration to a bucket.",
    ).optional(),
    Rule: ObjectLockRuleSchema.describe(
      "Specifies the Object Lock rule for the specified object. Enable this rule when you apply ObjectLockConfiguration to a bucket. If Object Lock is turned on, bucket settings require both Mode and a period of either Days or Years. You cannot specify Days and Years at the same time. For more information, see [ObjectLockRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html) and [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html).",
    ).optional(),
  }).describe(
    "This operation is not supported for directory buckets. Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html). The DefaultRetention settings require both a mode and a period. The DefaultRetention period can be either Days or Years but you must select one. You cannot specify Days and Years at the same time. You can enable Object Lock for new or existing buckets. For more information, see [Configuring Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-configure.html). You must URL encode any signed header values that contain spaces. For example, if your header value is my file.txt, containing two spaces after my, you must URL encode this value to my%20%20file.txt.",
  ).optional(),
  ObjectLockEnabled: z.boolean().describe(
    "Indicates whether this bucket has an Object Lock configuration enabled. Enable ObjectLockEnabled when you apply ObjectLockConfiguration to a bucket.",
  ).optional(),
  LoggingConfiguration: z.object({
    TargetObjectKeyFormat: z.record(z.string(), z.unknown()).describe(
      "Amazon S3 key format for log objects. Only one format, either PartitionedPrefix or SimplePrefix, is allowed.",
    ).optional(),
    LogFilePrefix: z.string().describe(
      "A prefix for all log object keys. If you store log files from multiple Amazon S3 buckets in a single bucket, you can use a prefix to distinguish which log files came from which bucket.",
    ).optional(),
    DestinationBucketName: z.string().describe(
      "The name of the bucket where Amazon S3 should store server access log files. You can store log files in any bucket that you own. By default, logs are stored in the bucket where the LoggingConfiguration property is defined.",
    ).optional(),
  }).describe("Settings that define where logs are stored.").optional(),
  MetadataConfiguration: z.object({
    Destination: MetadataDestinationSchema.describe(
      "The destination information for the S3 Metadata configuration.",
    ).optional(),
    JournalTableConfiguration: JournalTableConfigurationSchema.describe(
      "The journal table configuration for a metadata configuration.",
    ),
    InventoryTableConfiguration: InventoryTableConfigurationSchema.describe(
      "The inventory table configuration for a metadata configuration.",
    ).optional(),
    AnnotationTableConfiguration: AnnotationTableConfigurationSchema.describe(
      "The annotation table configuration for a metadata configuration.",
    ).optional(),
  }).describe("The S3 Metadata configuration for a general purpose bucket.")
    .optional(),
  ReplicationConfiguration: z.object({
    Role: z.string().describe(
      "The Amazon Resource Name (ARN) of the IAMlong (IAM) role that Amazon S3 assumes when replicating objects. For more information, see [How to Set Up Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-how-setup.html) in the *Amazon S3 User Guide*.",
    ),
    Rules: z.array(ReplicationRuleSchema).describe(
      "A container for one or more replication rules. A replication configuration must have at least one rule and can contain a maximum of 1,000 rules.",
    ),
  }).describe(
    "Configuration for replicating objects in an S3 bucket. To enable replication, you must also enable versioning by using the VersioningConfiguration property. Amazon S3 can store replicated objects in a single destination bucket or multiple destination buckets. The destination bucket or buckets must already exist.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An arbitrary set of tags (key-value pairs) for this S3 bucket.",
  ).optional(),
  BucketEncryption: z.object({
    ServerSideEncryptionConfiguration: z.array(ServerSideEncryptionRuleSchema)
      .describe("Specifies the default server-side-encryption configuration."),
  }).describe(
    "Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3), AWS KMS-managed keys (SSE-KMS), or dual-layer server-side encryption with KMS-managed keys (DSSE-KMS). For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  NotificationConfiguration: z.object({
    TopicConfigurations: z.array(TopicConfigurationSchema).describe(
      "The topic to which notifications are sent and the events for which notifications are generated.",
    ).optional(),
    QueueConfigurations: z.array(QueueConfigurationSchema).describe(
      "The Amazon Simple Queue Service queues to publish messages to and the events for which to publish messages.",
    ).optional(),
    LambdaConfigurations: z.array(LambdaConfigurationSchema).describe(
      "Describes the LAMlong functions to invoke and the events for which to invoke them.",
    ).optional(),
    EventBridgeConfiguration: EventBridgeConfigurationSchema.describe(
      "Enables delivery of events to Amazon EventBridge.",
    ).optional(),
  }).describe(
    "Configuration that defines how Amazon S3 handles bucket notifications.",
  ).optional(),
  LifecycleConfiguration: z.object({
    TransitionDefaultMinimumObjectSize: z.enum([
      "varies_by_storage_class",
      "all_storage_classes_128K",
    ]).describe(
      "Indicates which default minimum object size behavior is applied to the lifecycle configuration. This parameter applies to general purpose buckets only. It isn't supported for directory bucket lifecycle configurations. all_storage_classes_128K - Objects smaller than 128 KB will not transition to any storage class by default. varies_by_storage_class - Objects smaller than 128 KB will transition to Glacier Flexible Retrieval or Glacier Deep Archive storage classes. By default, all other storage classes will prevent transitions smaller than 128 KB. To customize the minimum object size for any transition you can add a filter that specifies a custom ObjectSizeGreaterThan or ObjectSizeLessThan in the body of your transition rule. Custom filters always take precedence over the default transition behavior.",
    ).optional(),
    Rules: z.array(RuleSchema).describe(
      "A lifecycle rule for individual objects in an Amazon S3 bucket.",
    ),
  }).describe(
    "Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  VersioningConfiguration: z.object({
    Status: z.enum(["Enabled", "Suspended"]).describe(
      "The versioning state of the bucket.",
    ),
  }).describe(
    "Enables multiple versions of all objects in this bucket. You might enable versioning to prevent objects from being deleted or overwritten by mistake or to archive objects so that you can retrieve previous versions of them. When you enable versioning on a bucket for the first time, it might take a short amount of time for the change to be fully propagated. We recommend that you wait for 15 minutes after enabling versioning before issuing write operations ( PUT or DELETE) on objects in the bucket.",
  ).optional(),
  MetricsConfigurations: z.array(MetricsConfigurationSchema).describe(
    "Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For more information, see [PutBucketMetricsConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html).",
  ).optional(),
  IntelligentTieringConfigurations: z.array(
    IntelligentTieringConfigurationSchema,
  ).describe("Defines how Amazon S3 handles Intelligent-Tiering storage.")
    .optional(),
  CorsConfiguration: z.object({
    CorsRules: z.array(CorsRuleSchema).describe(
      "A set of origins and methods (cross-origin access that you want to allow). You can add up to 100 rules to the configuration.",
    ),
  }).describe(
    "Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide*.",
  ).optional(),
});

const StateSchema = z.object({
  BucketNamespace: z.string().optional(),
  InventoryConfigurations: z.array(InventoryConfigurationSchema).optional(),
  BucketNamePrefix: z.string().optional(),
  WebsiteConfiguration: z.object({
    IndexDocument: z.string(),
    RedirectAllRequestsTo: RedirectAllRequestsToSchema,
    RoutingRules: z.array(RoutingRuleSchema),
    ErrorDocument: z.string(),
  }).optional(),
  DualStackDomainName: z.string().optional(),
  AccessControl: z.string().optional(),
  MetadataTableConfiguration: z.object({
    S3TablesDestination: S3TablesDestinationSchema,
  }).optional(),
  AnalyticsConfigurations: z.array(AnalyticsConfigurationSchema).optional(),
  AbacStatus: z.string().optional(),
  AccelerateConfiguration: z.object({
    AccelerationStatus: z.string(),
  }).optional(),
  PublicAccessBlockConfiguration: z.object({
    RestrictPublicBuckets: z.boolean(),
    BlockPublicPolicy: z.boolean(),
    BlockPublicAcls: z.boolean(),
    IgnorePublicAcls: z.boolean(),
  }).optional(),
  BucketName: z.string(),
  RegionalDomainName: z.string().optional(),
  OwnershipControls: z.object({
    Rules: z.array(OwnershipControlsRuleSchema),
  }).optional(),
  ObjectLockConfiguration: z.object({
    ObjectLockEnabled: z.string(),
    Rule: ObjectLockRuleSchema,
  }).optional(),
  ObjectLockEnabled: z.boolean().optional(),
  LoggingConfiguration: z.object({
    TargetObjectKeyFormat: z.record(z.string(), z.unknown()),
    LogFilePrefix: z.string(),
    DestinationBucketName: z.string(),
  }).optional(),
  MetadataConfiguration: z.object({
    Destination: MetadataDestinationSchema,
    JournalTableConfiguration: JournalTableConfigurationSchema,
    InventoryTableConfiguration: InventoryTableConfigurationSchema,
    AnnotationTableConfiguration: AnnotationTableConfigurationSchema,
  }).optional(),
  ReplicationConfiguration: z.object({
    Role: z.string(),
    Rules: z.array(ReplicationRuleSchema),
  }).optional(),
  Tags: z.array(TagSchema).optional(),
  DomainName: z.string().optional(),
  BucketEncryption: z.object({
    ServerSideEncryptionConfiguration: z.array(ServerSideEncryptionRuleSchema),
  }).optional(),
  WebsiteURL: z.string().optional(),
  NotificationConfiguration: z.object({
    TopicConfigurations: z.array(TopicConfigurationSchema),
    QueueConfigurations: z.array(QueueConfigurationSchema),
    LambdaConfigurations: z.array(LambdaConfigurationSchema),
    EventBridgeConfiguration: EventBridgeConfigurationSchema,
  }).optional(),
  LifecycleConfiguration: z.object({
    TransitionDefaultMinimumObjectSize: z.string(),
    Rules: z.array(RuleSchema),
  }).optional(),
  VersioningConfiguration: z.object({
    Status: z.string(),
  }).optional(),
  MetricsConfigurations: z.array(MetricsConfigurationSchema).optional(),
  IntelligentTieringConfigurations: z.array(
    IntelligentTieringConfigurationSchema,
  ).optional(),
  CorsConfiguration: z.object({
    CorsRules: z.array(CorsRuleSchema),
  }).optional(),
  Arn: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  BucketNamespace: z.enum(["global", "account-regional"]).optional(),
  InventoryConfigurations: z.array(InventoryConfigurationSchema).describe(
    "Specifies the S3 Inventory configuration for an Amazon S3 bucket. For more information, see [GET Bucket inventory](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketGETInventoryConfig.html) in the *Amazon S3 API Reference*.",
  ).optional(),
  BucketNamePrefix: z.string().optional(),
  WebsiteConfiguration: z.object({
    IndexDocument: z.string().describe(
      "The name of the index document for the website.",
    ).optional(),
    RedirectAllRequestsTo: RedirectAllRequestsToSchema.describe(
      "The redirect behavior for every request to this bucket's website endpoint. If you specify this property, you can't specify any other property.",
    ).optional(),
    RoutingRules: z.array(RoutingRuleSchema).describe(
      "Rules that define when a redirect is applied and the redirect behavior.",
    ).optional(),
    ErrorDocument: z.string().describe(
      "The name of the error document for the website.",
    ).optional(),
  }).describe(
    "Information used to configure the bucket as a static website. For more information, see [Hosting Websites on Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html).",
  ).optional(),
  AccessControl: z.enum([
    "AuthenticatedRead",
    "AwsExecRead",
    "BucketOwnerFullControl",
    "BucketOwnerRead",
    "LogDeliveryWrite",
    "Private",
    "PublicRead",
    "PublicReadWrite",
  ]).describe(
    "This is a legacy property, and it is not recommended for most use cases. A majority of modern use cases in Amazon S3 no longer require the use of ACLs, and we recommend that you keep ACLs disabled. For more information, see [Controlling object ownership](https://docs.aws.amazon.com//AmazonS3/latest/userguide/about-object-ownership.html) in the *Amazon S3 User Guide*. A canned access control list (ACL) that grants predefined permissions to the bucket. For more information about canned ACLs, see [Canned ACL](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl) in the *Amazon S3 User Guide*. S3 buckets are created with ACLs disabled by default. Therefore, unless you explicitly set the [AWS::S3::OwnershipControls](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-ownershipcontrols.html) property to enable ACLs, your resource will fail to deploy with any value other than Private. Use cases requiring ACLs are uncommon. The majority of access control configurations can be successfully and more easily achieved with bucket policies. For more information, see [AWS::S3::BucketPolicy](https://docs.aws.amazon.com//AWSCloudFormation/latest/UserGuide/aws-properties-s3-policy.html). For examples of common policy configurations, including S3 Server Access Logs buckets and more, see [Bucket policy examples](https://docs.aws.amazon.com/AmazonS3/latest/userguide/example-bucket-policies.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  MetadataTableConfiguration: z.object({
    S3TablesDestination: S3TablesDestinationSchema.describe(
      "The destination information for the metadata table configuration. The destination table bucket must be in the same Region and AWS-account as the general purpose bucket. The specified metadata table name must be unique within the aws_s3_metadata namespace in the destination table bucket.",
    ).optional(),
  }).describe(
    "The metadata table configuration of an S3 general purpose bucket.",
  ).optional(),
  AnalyticsConfigurations: z.array(AnalyticsConfigurationSchema).describe(
    "Specifies the configuration and any analyses for the analytics filter of an Amazon S3 bucket.",
  ).optional(),
  AbacStatus: z.enum(["Enabled", "Disabled"]).describe(
    "The ABAC status of the general purpose bucket. When ABAC is enabled for the general purpose bucket, you can use tags to manage access to the general purpose buckets as well as for cost tracking purposes. When ABAC is disabled for the general purpose buckets, you can only use tags for cost tracking purposes. For more information, see [Using tags with S3 general purpose buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/buckets-tagging.html).",
  ).optional(),
  AccelerateConfiguration: z.object({
    AccelerationStatus: z.enum(["Enabled", "Suspended"]).describe(
      "Specifies the transfer acceleration status of the bucket.",
    ).optional(),
  }).describe(
    "Configures the transfer acceleration state for an Amazon S3 bucket. For more information, see [Amazon S3 Transfer Acceleration](https://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  PublicAccessBlockConfiguration: z.object({
    RestrictPublicBuckets: z.boolean().describe(
      "Specifies whether Amazon S3 should restrict public bucket policies for this bucket. Setting this element to TRUE restricts access to this bucket to only AWS-service principals and authorized users within this account if the bucket has a public policy. Enabling this setting doesn't affect previously stored bucket policies, except that public and cross-account access within any public bucket policy, including non-public delegation to specific accounts, is blocked.",
    ).optional(),
    BlockPublicPolicy: z.boolean().describe(
      "Specifies whether Amazon S3 should block public bucket policies for this bucket. Setting this element to TRUE causes Amazon S3 to reject calls to PUT Bucket policy if the specified bucket policy allows public access. Enabling this setting doesn't affect existing bucket policies.",
    ).optional(),
    BlockPublicAcls: z.boolean().describe(
      "Specifies whether Amazon S3 should block public access control lists (ACLs) for this bucket and objects in this bucket. Setting this element to TRUE causes the following behavior: PUT Bucket ACL and PUT Object ACL calls fail if the specified ACL is public. PUT Object calls fail if the request includes a public ACL. PUT Bucket calls fail if the request includes a public ACL. Enabling this setting doesn't affect existing policies or ACLs.",
    ).optional(),
    IgnorePublicAcls: z.boolean().describe(
      "Specifies whether Amazon S3 should ignore public ACLs for this bucket and objects in this bucket. Setting this element to TRUE causes Amazon S3 to ignore all public ACLs on this bucket and objects in this bucket. Enabling this setting doesn't affect the persistence of any existing ACLs and doesn't prevent new public ACLs from being set.",
    ).optional(),
  }).describe("Configuration that defines how Amazon S3 handles public access.")
    .optional(),
  BucketName: z.string().describe(
    "A name for the bucket. If you don't specify a name, AWS CloudFormation generates a unique ID and uses that ID for the bucket name. The bucket name must contain only lowercase letters, numbers, periods (.), and dashes (-) and must follow [Amazon S3 bucket restrictions and limitations](https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html). For more information, see [Rules for naming Amazon S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucketnamingrules.html) in the *Amazon S3 User Guide*. If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you need to replace the resource, specify a new name.",
  ).optional(),
  OwnershipControls: z.object({
    Rules: z.array(OwnershipControlsRuleSchema).describe(
      "Specifies the container element for Object Ownership rules.",
    ).optional(),
  }).describe(
    "Configuration that defines how Amazon S3 handles Object Ownership rules.",
  ).optional(),
  ObjectLockConfiguration: z.object({
    ObjectLockEnabled: z.string().describe(
      "Indicates whether this bucket has an Object Lock configuration enabled. Enable ObjectLockEnabled when you apply ObjectLockConfiguration to a bucket.",
    ).optional(),
    Rule: ObjectLockRuleSchema.describe(
      "Specifies the Object Lock rule for the specified object. Enable this rule when you apply ObjectLockConfiguration to a bucket. If Object Lock is turned on, bucket settings require both Mode and a period of either Days or Years. You cannot specify Days and Years at the same time. For more information, see [ObjectLockRule](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-objectlockrule.html) and [DefaultRetention](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-s3-bucket-defaultretention.html).",
    ).optional(),
  }).describe(
    "This operation is not supported for directory buckets. Places an Object Lock configuration on the specified bucket. The rule specified in the Object Lock configuration will be applied by default to every new object placed in the specified bucket. For more information, see [Locking Objects](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lock.html). The DefaultRetention settings require both a mode and a period. The DefaultRetention period can be either Days or Years but you must select one. You cannot specify Days and Years at the same time. You can enable Object Lock for new or existing buckets. For more information, see [Configuring Object Lock](https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock-configure.html). You must URL encode any signed header values that contain spaces. For example, if your header value is my file.txt, containing two spaces after my, you must URL encode this value to my%20%20file.txt.",
  ).optional(),
  ObjectLockEnabled: z.boolean().describe(
    "Indicates whether this bucket has an Object Lock configuration enabled. Enable ObjectLockEnabled when you apply ObjectLockConfiguration to a bucket.",
  ).optional(),
  LoggingConfiguration: z.object({
    TargetObjectKeyFormat: z.record(z.string(), z.unknown()).describe(
      "Amazon S3 key format for log objects. Only one format, either PartitionedPrefix or SimplePrefix, is allowed.",
    ).optional(),
    LogFilePrefix: z.string().describe(
      "A prefix for all log object keys. If you store log files from multiple Amazon S3 buckets in a single bucket, you can use a prefix to distinguish which log files came from which bucket.",
    ).optional(),
    DestinationBucketName: z.string().describe(
      "The name of the bucket where Amazon S3 should store server access log files. You can store log files in any bucket that you own. By default, logs are stored in the bucket where the LoggingConfiguration property is defined.",
    ).optional(),
  }).describe("Settings that define where logs are stored.").optional(),
  MetadataConfiguration: z.object({
    Destination: MetadataDestinationSchema.describe(
      "The destination information for the S3 Metadata configuration.",
    ).optional(),
    JournalTableConfiguration: JournalTableConfigurationSchema.describe(
      "The journal table configuration for a metadata configuration.",
    ).optional(),
    InventoryTableConfiguration: InventoryTableConfigurationSchema.describe(
      "The inventory table configuration for a metadata configuration.",
    ).optional(),
    AnnotationTableConfiguration: AnnotationTableConfigurationSchema.describe(
      "The annotation table configuration for a metadata configuration.",
    ).optional(),
  }).describe("The S3 Metadata configuration for a general purpose bucket.")
    .optional(),
  ReplicationConfiguration: z.object({
    Role: z.string().describe(
      "The Amazon Resource Name (ARN) of the IAMlong (IAM) role that Amazon S3 assumes when replicating objects. For more information, see [How to Set Up Replication](https://docs.aws.amazon.com/AmazonS3/latest/dev/replication-how-setup.html) in the *Amazon S3 User Guide*.",
    ).optional(),
    Rules: z.array(ReplicationRuleSchema).describe(
      "A container for one or more replication rules. A replication configuration must have at least one rule and can contain a maximum of 1,000 rules.",
    ).optional(),
  }).describe(
    "Configuration for replicating objects in an S3 bucket. To enable replication, you must also enable versioning by using the VersioningConfiguration property. Amazon S3 can store replicated objects in a single destination bucket or multiple destination buckets. The destination bucket or buckets must already exist.",
  ).optional(),
  Tags: z.array(TagSchema).describe(
    "An arbitrary set of tags (key-value pairs) for this S3 bucket.",
  ).optional(),
  BucketEncryption: z.object({
    ServerSideEncryptionConfiguration: z.array(ServerSideEncryptionRuleSchema)
      .describe("Specifies the default server-side-encryption configuration.")
      .optional(),
  }).describe(
    "Specifies default encryption for a bucket using server-side encryption with Amazon S3-managed keys (SSE-S3), AWS KMS-managed keys (SSE-KMS), or dual-layer server-side encryption with KMS-managed keys (DSSE-KMS). For information about the Amazon S3 default encryption feature, see [Amazon S3 Default Encryption for S3 Buckets](https://docs.aws.amazon.com/AmazonS3/latest/dev/bucket-encryption.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  NotificationConfiguration: z.object({
    TopicConfigurations: z.array(TopicConfigurationSchema).describe(
      "The topic to which notifications are sent and the events for which notifications are generated.",
    ).optional(),
    QueueConfigurations: z.array(QueueConfigurationSchema).describe(
      "The Amazon Simple Queue Service queues to publish messages to and the events for which to publish messages.",
    ).optional(),
    LambdaConfigurations: z.array(LambdaConfigurationSchema).describe(
      "Describes the LAMlong functions to invoke and the events for which to invoke them.",
    ).optional(),
    EventBridgeConfiguration: EventBridgeConfigurationSchema.describe(
      "Enables delivery of events to Amazon EventBridge.",
    ).optional(),
  }).describe(
    "Configuration that defines how Amazon S3 handles bucket notifications.",
  ).optional(),
  LifecycleConfiguration: z.object({
    TransitionDefaultMinimumObjectSize: z.enum([
      "varies_by_storage_class",
      "all_storage_classes_128K",
    ]).describe(
      "Indicates which default minimum object size behavior is applied to the lifecycle configuration. This parameter applies to general purpose buckets only. It isn't supported for directory bucket lifecycle configurations. all_storage_classes_128K - Objects smaller than 128 KB will not transition to any storage class by default. varies_by_storage_class - Objects smaller than 128 KB will transition to Glacier Flexible Retrieval or Glacier Deep Archive storage classes. By default, all other storage classes will prevent transitions smaller than 128 KB. To customize the minimum object size for any transition you can add a filter that specifies a custom ObjectSizeGreaterThan or ObjectSizeLessThan in the body of your transition rule. Custom filters always take precedence over the default transition behavior.",
    ).optional(),
    Rules: z.array(RuleSchema).describe(
      "A lifecycle rule for individual objects in an Amazon S3 bucket.",
    ).optional(),
  }).describe(
    "Specifies the lifecycle configuration for objects in an Amazon S3 bucket. For more information, see [Object Lifecycle Management](https://docs.aws.amazon.com/AmazonS3/latest/dev/object-lifecycle-mgmt.html) in the *Amazon S3 User Guide*.",
  ).optional(),
  VersioningConfiguration: z.object({
    Status: z.enum(["Enabled", "Suspended"]).describe(
      "The versioning state of the bucket.",
    ).optional(),
  }).describe(
    "Enables multiple versions of all objects in this bucket. You might enable versioning to prevent objects from being deleted or overwritten by mistake or to archive objects so that you can retrieve previous versions of them. When you enable versioning on a bucket for the first time, it might take a short amount of time for the change to be fully propagated. We recommend that you wait for 15 minutes after enabling versioning before issuing write operations ( PUT or DELETE) on objects in the bucket.",
  ).optional(),
  MetricsConfigurations: z.array(MetricsConfigurationSchema).describe(
    "Specifies a metrics configuration for the CloudWatch request metrics (specified by the metrics configuration ID) from an Amazon S3 bucket. If you're updating an existing metrics configuration, note that this is a full replacement of the existing metrics configuration. If you don't include the elements you want to keep, they are erased. For more information, see [PutBucketMetricsConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/RESTBucketPUTMetricConfiguration.html).",
  ).optional(),
  IntelligentTieringConfigurations: z.array(
    IntelligentTieringConfigurationSchema,
  ).describe("Defines how Amazon S3 handles Intelligent-Tiering storage.")
    .optional(),
  CorsConfiguration: z.object({
    CorsRules: z.array(CorsRuleSchema).describe(
      "A set of origins and methods (cross-origin access that you want to allow). You can add up to 100 rules to the configuration.",
    ).optional(),
  }).describe(
    "Describes the cross-origin access configuration for objects in an Amazon S3 bucket. For more information, see [Enabling Cross-Origin Resource Sharing](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html) in the *Amazon S3 User Guide*.",
  ).optional(),
});

const _credentialKeys = new Set([
  "accessKeyId",
  "secretAccessKey",
  "sessionToken",
  "region",
]);

function _buildCredentials(g: Record<string, unknown>): AwsCredentials {
  return {
    accessKeyId: g.accessKeyId as string | undefined,
    secretAccessKey: g.secretAccessKey as string | undefined,
    sessionToken: g.sessionToken as string | undefined,
    region: g.region as string | undefined,
  };
}

/** Swamp extension model for S3 Bucket. Registered at `@swamp/aws/s3/bucket`. */
export const model = {
  type: "@swamp/aws/s3/bucket",
  version: "2026.09.11.1",
  upgrades: [
    {
      toVersion: "2026.04.01.1",
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
      toVersion: "2026.04.23.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.04.23.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.27.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.06.1",
      description: "Added: accessKeyId, secretAccessKey, sessionToken, region",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.08.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.15.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.18.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.13.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.29.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.11.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "S3 Bucket resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a S3 Bucket",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const desiredState: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await createResource(
          "AWS::S3::Bucket",
          desiredState,
          credentials,
        ) as StateData;
        const instanceName =
          ((result.BucketName ?? g.BucketName)?.toString() ?? "current")
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
      description: "Get a S3 Bucket",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the S3 Bucket",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::S3::Bucket",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName =
          ((result.BucketName ?? context.globalArgs.BucketName)?.toString() ??
            args.identifier).replace(/[\/\\]/g, "_").replace(/\.\./g, "_")
            .replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    update: {
      description: "Update a S3 Bucket",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.BucketName?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.BucketName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::S3::Bucket",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::S3::Bucket",
          identifier,
          currentState,
          desiredState,
          ["BucketName", "BucketNamePrefix", "BucketNamespace"],
          credentials,
        );
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
    delete: {
      description: "Delete a S3 Bucket",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the S3 Bucket",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::S3::Bucket",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.BucketName?.toString() ?? args.identifier)
            .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
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
      description: "Sync S3 Bucket state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.BucketName?.toString() ?? "current").replace(
          /[\/\\]/g,
          "_",
        ).replace(/\.\./g, "_").replace(/\0/g, "");
        const content = await context.dataRepository.getContent(
          context.modelType,
          context.modelId,
          instanceName,
        );
        if (!content) {
          throw new Error("No existing state found - run create or get first");
        }
        const existing = JSON.parse(new TextDecoder().decode(content));
        const identifier = existing.BucketName?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::S3::Bucket",
            identifier,
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
              identifier,
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
      description: "List S3 Bucket resources",
      arguments: z.object({
        maxPages: z.number().describe(
          "Maximum number of pages to fetch (default: 10)",
        ).optional(),
        resourceModel: z.string().describe(
          "JSON resource model for parent-scoped listing (e.g. parent identifier)",
        ).optional(),
      }),
      execute: async (
        args: { maxPages?: number; resourceModel?: string },
        context: any,
      ) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { items, nextToken } = await listResources("AWS::S3::Bucket", {
          resourceModel: args.resourceModel,
          maxPages: args.maxPages,
          credentials,
        });
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const instanceName =
            (item.properties?.BucketName?.toString() ?? item.identifier)
              .replace(/[\/\\]/g, "_").replace(/\.\./g, "_").replace(/\0/g, "");
          const handle = await context.writeResource("state", instanceName, {
            ...item.properties,
            _identifier: item.identifier,
          });
          dataHandles.push(handle);
        }
        return {
          dataHandles,
          result: { count: items.length, nextPageToken: nextToken },
        };
      },
    },
  },
};
