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

// Auto-generated extension model for @swamp/aws/bedrock/knowledge-base
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Bedrock KnowledgeBase (AWS::Bedrock::KnowledgeBase).
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
import {
  BedrockAgentRuntimeClient,
  type KnowledgeBaseRetrievalResult,
  type RetrievalFilter,
  RetrieveCommand,
} from "npm:@aws-sdk/client-bedrock-agent-runtime@3.1127.0";
import { NodeHttpHandler } from "npm:@smithy/node-http-handler@4.9.7";

const AudioSegmentationConfigurationSchema = z.object({
  FixedLengthDuration: z.number().int().min(1).max(30).describe(
    "Duration in seconds to segment the multi modal media",
  ),
});

const AudioConfigurationSchema = z.object({
  SegmentationConfiguration: AudioSegmentationConfigurationSchema.describe(
    "Configure the audio segmentation configuration for multi modal ingestion.",
  ),
});

const VideoSegmentationConfigurationSchema = z.object({
  FixedLengthDuration: z.number().int().min(1).max(30).describe(
    "Duration in seconds to segment the multi modal media",
  ),
});

const VideoConfigurationSchema = z.object({
  SegmentationConfiguration: VideoSegmentationConfigurationSchema.describe(
    "Configure the video segmentation configuration for multi modal ingestion.",
  ),
});

const BedrockEmbeddingModelConfigurationSchema = z.object({
  Dimensions: z.number().int().min(0).max(4096).describe(
    "The dimensions details for the vector configuration used on the Bedrock embeddings model.",
  ).optional(),
  EmbeddingDataType: z.enum(["FLOAT32", "BINARY"]).describe(
    "The data type for the vectors when using a model to convert text into vector embeddings.",
  ).optional(),
  Audio: z.array(AudioConfigurationSchema).describe(
    "List of audio configurations for multi modal ingestion.",
  ).optional(),
  Video: z.array(VideoConfigurationSchema).describe(
    "List of video configurations for multi modal ingestion.",
  ).optional(),
  ModelConfiguration: z.record(z.string(), z.unknown()).describe(
    "Model-specific configuration for the embedding model.",
  ).optional(),
});

const EmbeddingModelConfigurationSchema = z.object({
  BedrockEmbeddingModelConfiguration: BedrockEmbeddingModelConfigurationSchema
    .describe(
      "The vector configuration details for the Bedrock embeddings model.",
    ).optional(),
});

const S3LocationSchema = z.object({
  URI: z.string().min(1).max(2048).regex(new RegExp("^s3://.{1,128}$"))
    .describe("The location's URI"),
});

const SupplementalDataStorageLocationSchema = z.object({
  SupplementalDataStorageLocationType: z.enum(["S3"]).describe(
    "Supplemental data storage location type.",
  ),
  S3Location: S3LocationSchema.describe("An Amazon S3 location.").optional(),
});

const SupplementalDataStorageConfigurationSchema = z.object({
  SupplementalDataStorageLocations: z.array(
    SupplementalDataStorageLocationSchema,
  ).describe("List of supplemental data storage locations."),
});

const VectorKnowledgeBaseConfigurationSchema = z.object({
  EmbeddingModelArn: z.string().min(20).max(2048).regex(
    new RegExp(
      "^(arn:aws(-[^:]+)?:[a-z0-9-]+:[a-z0-9-]{1,20}:[0-9]{0,12}:[a-zA-Z0-9-:/._+]+)$",
    ),
  ).describe(
    "The ARN of the model used to create vector embeddings for the knowledge base.",
  ),
  EmbeddingModelConfiguration: EmbeddingModelConfigurationSchema.describe(
    "The embeddings model configuration details for the vector model used in Knowledge Base.",
  ).optional(),
  SupplementalDataStorageConfiguration:
    SupplementalDataStorageConfigurationSchema.describe(
      "Configurations for supplemental data storage.",
    ).optional(),
});

const KendraKnowledgeBaseConfigurationSchema = z.object({
  KendraIndexArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):kendra:[a-z0-9-]{1,20}:([0-9]{12}|):index/([a-zA-Z0-9][a-zA-Z0-9-]{35}|[a-zA-Z0-9][a-zA-Z0-9-]{35}-[a-zA-Z0-9][a-zA-Z0-9-]{35})$",
    ),
  ).describe("Arn of a Kendra index"),
});

const RedshiftQueryEngineAwsDataCatalogStorageConfigurationSchema = z.object({
  TableNames: z.array(z.string().min(1).max(200).regex(new RegExp("^.*\\.*$")))
    .describe(
      "List of table names in AWS Data Catalog. Must follow two part notation",
    ),
});

const RedshiftQueryEngineRedshiftStorageConfigurationSchema = z.object({
  DatabaseName: z.string().min(1).max(200).describe("Redshift database name"),
});

const RedshiftQueryEngineStorageConfigurationSchema = z.object({
  Type: z.enum(["REDSHIFT", "AWS_DATA_CATALOG"]).describe(
    "Redshift query engine storage type",
  ),
  AwsDataCatalogConfiguration:
    RedshiftQueryEngineAwsDataCatalogStorageConfigurationSchema.describe(
      "Configurations for Redshift query engine AWS Data Catalog backed storage",
    ).optional(),
  RedshiftConfiguration: RedshiftQueryEngineRedshiftStorageConfigurationSchema
    .describe(
      "Configurations for Redshift query engine Redshift backed storage",
    ).optional(),
});

const RedshiftServerlessAuthConfigurationSchema = z.object({
  Type: z.enum(["IAM", "USERNAME_PASSWORD"]).describe(
    "Serverless Redshift auth type",
  ),
  UsernamePasswordSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe("Arn of a SecretsManager Secret").optional(),
});

const RedshiftServerlessConfigurationSchema = z.object({
  WorkgroupArn: z.string().regex(
    new RegExp(
      "^(arn:(aws(-[a-z]+)*):redshift-serverless:[a-z]{2}(-gov)?-[a-z]+-\\d{1}:\\d{12}:workgroup/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$",
    ),
  ).describe("Workgroup arn"),
  AuthConfiguration: RedshiftServerlessAuthConfigurationSchema.describe(
    "Configurations for Redshift query engine serverless auth setup",
  ),
});

const RedshiftProvisionedAuthConfigurationSchema = z.object({
  Type: z.enum(["IAM", "USERNAME_PASSWORD", "USERNAME"]).describe(
    "Provisioned Redshift auth type",
  ),
  DatabaseUser: z.string().describe("Redshift database user").optional(),
  UsernamePasswordSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe("Arn of a SecretsManager Secret").optional(),
});

const RedshiftProvisionedConfigurationSchema = z.object({
  ClusterIdentifier: z.string().min(1).max(63).describe(
    "Redshift cluster identifier",
  ),
  AuthConfiguration: RedshiftProvisionedAuthConfigurationSchema.describe(
    "Configurations for Redshift query engine provisioned auth setup",
  ),
});

const RedshiftQueryEngineConfigurationSchema = z.object({
  Type: z.enum(["SERVERLESS", "PROVISIONED"]).describe(
    "Redshift query engine type",
  ),
  ServerlessConfiguration: RedshiftServerlessConfigurationSchema.describe(
    "Configurations for serverless Redshift query engine",
  ).optional(),
  ProvisionedConfiguration: RedshiftProvisionedConfigurationSchema.describe(
    "Configurations for provisioned Redshift query engine",
  ).optional(),
});

const QueryGenerationColumnSchema = z.object({
  Name: z.string().min(1).max(127).describe("Query generation column name")
    .optional(),
  Description: z.string().min(1).max(200).describe(
    "Description for the attached entity",
  ).optional(),
  Inclusion: z.enum(["INCLUDE", "EXCLUDE"]).describe(
    "Include or Exclude status for an entity",
  ).optional(),
});

const QueryGenerationTableSchema = z.object({
  Name: z.string().regex(new RegExp("^.*\\..*\\..*$")).describe(
    "Query generation table name. Must follow three-part notation",
  ),
  Description: z.string().min(1).max(200).describe(
    "Description for the attached entity",
  ).optional(),
  Inclusion: z.enum(["INCLUDE", "EXCLUDE"]).describe(
    "Include or Exclude status for an entity",
  ).optional(),
  Columns: z.array(QueryGenerationColumnSchema).describe(
    "List of Redshift query generation columns",
  ).optional(),
});

const CuratedQuerySchema = z.object({
  NaturalLanguage: z.string().min(1).max(1000).describe(
    "Question for the curated query",
  ),
  Sql: z.string().min(1).max(1000).describe("Answer for the curated query"),
});

const QueryGenerationContextSchema = z.object({
  Tables: z.array(QueryGenerationTableSchema).describe(
    "List of tables used for Redshift query generation context",
  ).optional(),
  CuratedQueries: z.array(CuratedQuerySchema).describe(
    "List of example queries and results",
  ).optional(),
});

const QueryGenerationConfigurationSchema = z.object({
  ExecutionTimeoutSeconds: z.number().int().min(1).max(200).describe(
    "Max query execution timeout",
  ).optional(),
  GenerationContext: QueryGenerationContextSchema.describe(
    "Context used to improve query generation",
  ).optional(),
});

const RedshiftConfigurationSchema = z.object({
  StorageConfigurations: z.array(RedshiftQueryEngineStorageConfigurationSchema)
    .describe(
      "List of configurations for available Redshift query engine storage types",
    ),
  QueryEngineConfiguration: RedshiftQueryEngineConfigurationSchema.describe(
    "Configurations for Redshift query engine",
  ),
  QueryGenerationConfiguration: QueryGenerationConfigurationSchema.describe(
    "Configurations for generating Redshift engine queries",
  ).optional(),
});

const SqlKnowledgeBaseConfigurationSchema = z.object({
  Type: z.enum(["REDSHIFT"]).describe("SQL query engine type"),
  RedshiftConfiguration: RedshiftConfigurationSchema.describe(
    "Configurations for a Redshift knowledge base",
  ).optional(),
});

const ManagedKnowledgeBaseServerSideEncryptionConfigurationSchema = z.object({
  KmsKeyArn: z.string().min(1).max(2048).regex(
    new RegExp(
      "^arn:aws(-cn|-us-gov|-eusc|-iso(-[b-f])?)?:kms:[a-zA-Z0-9-]*:[0-9]{12}:key/[a-zA-Z0-9-]{36}$",
    ),
  ).describe(
    "The ARN of the AWS KMS key used to encrypt the managed knowledge base.",
  ).optional(),
});

const ManagedKnowledgeBaseConfigurationSchema = z.object({
  EmbeddingModelArn: z.string().min(20).max(2048).regex(
    new RegExp(
      "^(arn:aws(-[^:]+)?:[a-z0-9-]+:[a-z0-9-]{1,20}:[0-9]{0,12}:[a-zA-Z0-9-:/._+]+)$",
    ),
  ).describe(
    "The ARN of the model used to create vector embeddings for the knowledge base.",
  ).optional(),
  EmbeddingModelType: z.enum(["CUSTOM", "MANAGED"]).describe(
    "The type of embedding model to use for the managed knowledge base.",
  ).optional(),
  EmbeddingModelConfiguration: EmbeddingModelConfigurationSchema.describe(
    "The embeddings model configuration details for the vector model used in Knowledge Base.",
  ).optional(),
  SupplementalDataStorageConfiguration:
    SupplementalDataStorageConfigurationSchema.describe(
      "Configurations for supplemental data storage.",
    ).optional(),
  ServerSideEncryptionConfiguration:
    ManagedKnowledgeBaseServerSideEncryptionConfigurationSchema.describe(
      "Contains details about the server-side encryption for the managed knowledge base.",
    ).optional(),
});

const OpenSearchServerlessFieldMappingSchema = z.object({
  VectorField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the vector embeddings for your data sources.",
  ),
  TextField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the raw text from your data. The text is split according to the chunking strategy you choose.",
  ),
  MetadataField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores metadata about the vector store.",
  ),
});

const OpenSearchServerlessConfigurationSchema = z.object({
  CollectionArn: z.string().max(2048).regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov|-iso):aoss:[a-z]{2}(-gov)?-[a-z]+-\\d{1}:\\d{12}:collection/[a-z0-9-]{3,32}$",
    ),
  ).describe("The ARN of the OpenSearch Service vector store."),
  VectorIndexName: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the vector store.",
  ),
  FieldMapping: OpenSearchServerlessFieldMappingSchema.describe(
    "A mapping of Bedrock Knowledge Base fields to OpenSearch Serverless field names",
  ),
});

const PineconeFieldMappingSchema = z.object({
  TextField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the raw text from your data. The text is split according to the chunking strategy you choose.",
  ),
  MetadataField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores metadata about the vector store.",
  ),
});

const PineconeConfigurationSchema = z.object({
  ConnectionString: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The endpoint URL for your index management page.",
  ),
  CredentialsSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe(
    "The ARN of the secret that you created in AWS Secrets Manager that is linked to your Pinecone API key.",
  ),
  Namespace: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The namespace to be used to write new data to your database.",
  ).optional(),
  FieldMapping: PineconeFieldMappingSchema.describe(
    "Contains the names of the fields to which to map information about the vector store.",
  ),
});

const RdsFieldMappingSchema = z.object({
  PrimaryKeyField: z.string().max(63).regex(new RegExp("^[a-zA-Z0-9_\\-]+$"))
    .describe(
      "The name of the field in which Amazon Bedrock stores the ID for each entry.",
    ),
  VectorField: z.string().max(63).regex(new RegExp("^[a-zA-Z0-9_\\-]+$"))
    .describe(
      "The name of the field in which Amazon Bedrock stores the vector embeddings for your data sources.",
    ),
  TextField: z.string().max(63).regex(new RegExp("^[a-zA-Z0-9_\\-]+$"))
    .describe(
      "The name of the field in which Amazon Bedrock stores the raw text from your data. The text is split according to the chunking strategy you choose.",
    ),
  MetadataField: z.string().max(63).regex(new RegExp("^[a-zA-Z0-9_\\-]+$"))
    .describe(
      "The name of the field in which Amazon Bedrock stores metadata about the vector store.",
    ),
  CustomMetadataField: z.string().max(63).regex(
    new RegExp("^[a-zA-Z0-9_\\-]+$"),
  ).describe(
    "The name of the field in which Amazon Bedrock stores custom metadata about the vector store.",
  ).optional(),
});

const RdsConfigurationSchema = z.object({
  ResourceArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):rds:[a-zA-Z0-9-]*:[0-9]{12}:cluster:[a-zA-Z0-9-]{1,63}$",
    ),
  ).describe("The ARN of the vector store."),
  CredentialsSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe(
    "The ARN of the secret that you created in AWS Secrets Manager that is linked to your Amazon RDS database.",
  ),
  DatabaseName: z.string().max(63).regex(new RegExp("^[a-zA-Z0-9_\\-]+$"))
    .describe("The name of your Amazon RDS database."),
  TableName: z.string().max(63).regex(new RegExp("^[a-zA-Z0-9_\\.\\-]+$"))
    .describe("The name of the table in the database."),
  FieldMapping: RdsFieldMappingSchema.describe(
    "Contains the names of the fields to which to map information about the vector store.",
  ),
});

const MongoDbAtlasFieldMappingSchema = z.object({
  VectorField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the vector embeddings for your data sources.",
  ),
  TextField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the raw text from your data. The text is split according to the chunking strategy you choose.",
  ),
  MetadataField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores metadata about the vector store.",
  ),
});

const MongoDbAtlasConfigurationSchema = z.object({
  Endpoint: z.string().max(2048).regex(
    new RegExp("^[a-zA-Z0-9_-]+\\.[a-zA-Z0-9_-]+\\.mongodb\\.net$"),
  ).describe("MongoDB Atlas endpoint."),
  CredentialsSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe(
    "The ARN of the secret that you created in AWS Secrets Manager that is linked to your Amazon Mongo database.",
  ),
  DatabaseName: z.string().max(63).regex(new RegExp("^.*$")).describe(
    "Name of the database within MongoDB Atlas.",
  ),
  CollectionName: z.string().max(63).regex(new RegExp("^.*$")).describe(
    "Name of the collection within MongoDB Atlas.",
  ),
  VectorIndexName: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "Name of a MongoDB Atlas index.",
  ),
  TextIndexName: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "Name of a MongoDB Atlas text index.",
  ).optional(),
  EndpointServiceName: z.string().max(255).regex(
    new RegExp(
      "^(?:arn:aws(?:-us-gov|-cn|-iso|-iso-[a-z])*:.+:.*:\\d+:.+/.+$|[a-zA-Z0-9*]+[a-zA-Z0-9._-]*)$",
    ),
  ).describe("MongoDB Atlas endpoint service name.").optional(),
  FieldMapping: MongoDbAtlasFieldMappingSchema.describe(
    "Contains the names of the fields to which to map information about the vector store.",
  ),
});

const NeptuneAnalyticsFieldMappingSchema = z.object({
  TextField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the raw text from your data. The text is split according to the chunking strategy you choose.",
  ),
  MetadataField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores metadata about the vector store.",
  ),
});

const NeptuneAnalyticsConfigurationSchema = z.object({
  GraphArn: z.string().min(1).max(255).regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):neptune-graph:[a-zA-Z0-9-]*:[0-9]{12}:graph\\/g-[a-zA-Z0-9]{10}$",
    ),
  ).describe("ARN for Neptune Analytics graph database."),
  FieldMapping: NeptuneAnalyticsFieldMappingSchema.describe(
    "A mapping of Bedrock Knowledge Base fields to Neptune Analytics fields.",
  ),
});

const S3VectorsConfigurationSchema = z.object({
  VectorBucketArn: z.string().describe(
    "The Amazon Resource Name (ARN) of the S3 bucket where vector embeddings are stored. This bucket contains the vector data used by the knowledge base.",
  ).optional(),
  IndexArn: z.string().describe(
    "The Amazon Resource Name (ARN) of the vector index used for the knowledge base. This ARN identifies the specific vector index resource within Amazon Bedrock.",
  ).optional(),
  IndexName: z.string().min(3).max(63).describe(
    "The name of the vector index used for the knowledge base. This name identifies the vector index within the Amazon Bedrock service.",
  ).optional(),
});

const OpenSearchManagedClusterFieldMappingSchema = z.object({
  VectorField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the vector embeddings for your data sources.",
  ),
  TextField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores the raw text from your data. The text is split according to the chunking strategy you choose.",
  ),
  MetadataField: z.string().max(2048).regex(new RegExp("^.*$")).describe(
    "The name of the field in which Amazon Bedrock stores metadata about the vector store.",
  ),
});

const OpenSearchManagedClusterConfigurationSchema = z.object({
  DomainArn: z.string().max(2048).regex(
    new RegExp(
      "^arn:aws(-cn|-us-gov|-eusc|-iso(-[b-f])?)?:es:([a-z]{2,}-){2,}\\d:\\d{12}:domain/[a-z][a-z0-9-]{3,28}$",
    ),
  ).describe("The Amazon Resource Name (ARN) of the OpenSearch domain."),
  DomainEndpoint: z.string().max(2048).regex(new RegExp("^https://.*$"))
    .describe("The endpoint URL the OpenSearch domain."),
  VectorIndexName: z.string().min(1).max(2048).regex(
    new RegExp("^(?![\\-_+.])[a-z0-9][a-z0-9\\-_\\.]*$"),
  ).describe("The name of the vector store."),
  FieldMapping: OpenSearchManagedClusterFieldMappingSchema.describe(
    "A mapping of Bedrock Knowledge Base fields to OpenSearch Managed Cluster field names",
  ),
});

const GlobalArgsSchema = z.object({
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
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
  Description: z.string().min(1).max(200).describe(
    "Description of the Resource.",
  ).optional(),
  KnowledgeBaseConfiguration: z.object({
    Type: z.enum(["VECTOR", "KENDRA", "SQL", "MANAGED"]).describe(
      "The type of a knowledge base.",
    ),
    VectorKnowledgeBaseConfiguration: VectorKnowledgeBaseConfigurationSchema
      .describe(
        "Contains details about the model used to create vector embeddings for the knowledge base.",
      ).optional(),
    KendraKnowledgeBaseConfiguration: KendraKnowledgeBaseConfigurationSchema
      .describe("Configurations for a Kendra knowledge base").optional(),
    SqlKnowledgeBaseConfiguration: SqlKnowledgeBaseConfigurationSchema.describe(
      "Configurations for a SQL knowledge base",
    ).optional(),
    ManagedKnowledgeBaseConfiguration: ManagedKnowledgeBaseConfigurationSchema
      .describe(
        "Contains details about the model used to create vector embeddings for a managed knowledge base.",
      ).optional(),
  }).describe(
    "Contains details about the embeddings model used for the knowledge base.",
  ),
  Name: z.string().regex(new RegExp("^([0-9a-zA-Z][_-]?){1,100}$")).describe(
    "The name of the knowledge base.",
  ),
  RoleArn: z.string().max(2048).regex(
    new RegExp("^arn:aws(-[^:]+)?:iam::([0-9]{12})?:role/.+$"),
  ).describe(
    "The ARN of the IAM role with permissions to invoke API operations on the knowledge base. The ARN must begin with AmazonBedrockExecutionRoleForKnowledgeBase_",
  ),
  StorageConfiguration: z.object({
    Type: z.enum([
      "OPENSEARCH_SERVERLESS",
      "PINECONE",
      "RDS",
      "MONGO_DB_ATLAS",
      "NEPTUNE_ANALYTICS",
      "S3_VECTORS",
      "OPENSEARCH_MANAGED_CLUSTER",
    ]).describe("The storage type of a knowledge base."),
    OpensearchServerlessConfiguration: OpenSearchServerlessConfigurationSchema
      .describe(
        "Contains the storage configuration of the knowledge base in Amazon OpenSearch Service.",
      ).optional(),
    PineconeConfiguration: PineconeConfigurationSchema.describe(
      "Contains the storage configuration of the knowledge base in Pinecone.",
    ).optional(),
    RdsConfiguration: RdsConfigurationSchema.describe(
      "Contains details about the storage configuration of the knowledge base in Amazon RDS. For more information, see Create a vector index in Amazon RDS.",
    ).optional(),
    MongoDbAtlasConfiguration: MongoDbAtlasConfigurationSchema.describe(
      "Contains the storage configuration of the knowledge base in MongoDb Atlas Cloud.",
    ).optional(),
    NeptuneAnalyticsConfiguration: NeptuneAnalyticsConfigurationSchema.describe(
      "Contains the configurations to use Neptune Analytics as Vector Store.",
    ).optional(),
    S3VectorsConfiguration: S3VectorsConfigurationSchema.describe(
      "Contains the storage configuration of the knowledge base for S3 vectors.",
    ).optional(),
    OpensearchManagedClusterConfiguration:
      OpenSearchManagedClusterConfigurationSchema.describe(
        "Contains the storage configuration of the knowledge base in Amazon OpenSearch Service.",
      ).optional(),
  }).describe("The vector store service in which the knowledge base is stored.")
    .optional(),
  Tags: z.record(
    z.string(),
    z.string().min(0).max(256).regex(new RegExp("^[a-zA-Z0-9\\s._:/=+@-]*$")),
  ).describe("A map of tag keys and values").optional(),
});

// Deno's node:http2 compat layer is incomplete — force HTTP/1.1
function createClient(
  credentials: AwsCredentials,
): BedrockAgentRuntimeClient {
  // disableImdsIfOffEc2 inlined — enrichments run at codegen time, not extension runtime
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

  return new BedrockAgentRuntimeClient(config);
}

function formatResult(
  r: KnowledgeBaseRetrievalResult,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (r.content) {
    result.contentText = r.content.text;
    result.contentType = r.content.type;
  }

  if (r.score !== undefined) {
    result.score = r.score;
  }

  if (r.location) {
    result.locationType = r.location.type;
    switch (r.location.type) {
      case "S3":
        result.locationUri = r.location.s3Location?.uri;
        break;
      case "WEB":
        result.locationUrl = r.location.webLocation?.url;
        break;
      case "CONFLUENCE":
        result.locationUrl = r.location.confluenceLocation?.url;
        break;
      case "SALESFORCE":
        result.locationUrl = r.location.salesforceLocation?.url;
        break;
      case "SHAREPOINT":
        result.locationUrl = r.location.sharePointLocation?.url;
        break;
      case "ONEDRIVE":
        result.locationUrl = r.location.oneDriveLocation?.url;
        break;
      case "GOOGLEDRIVE":
        result.locationUrl = r.location.googleDriveLocation?.url;
        break;
      case "SQL":
        result.locationQuery = r.location.sqlLocation?.query;
        break;
      case "CUSTOM":
        result.locationId = r.location.customDocumentLocation?.id;
        break;
    }
  }

  if (r.metadata) {
    result.metadata = r.metadata;
  }

  return result;
}

async function retrieve(
  args: Record<string, unknown>,
  credentials: AwsCredentials,
): Promise<Record<string, unknown>> {
  const client = createClient(credentials);
  const knowledgeBaseId = args.knowledgeBaseId as string;
  const query = args.query as string;
  const numberOfResults = args.numberOfResults as number | undefined;
  const searchType = args.searchType as "SEMANTIC" | "HYBRID" | undefined;
  const filter = args.filter as Record<string, unknown> | undefined;
  const nextToken = args.nextToken as string | undefined;

  const command = new RetrieveCommand({
    knowledgeBaseId,
    retrievalQuery: { text: query },
    ...(numberOfResults || searchType || filter
      ? {
        retrievalConfiguration: {
          vectorSearchConfiguration: {
            ...(numberOfResults ? { numberOfResults } : {}),
            ...(searchType ? { overrideSearchType: searchType } : {}),
            ...(filter ? { filter: filter as unknown as RetrievalFilter } : {}),
          },
        },
      }
      : {}),
    ...(nextToken ? { nextToken } : {}),
  });

  try {
    const response = await client.send(command);
    const results: Record<string, unknown>[] = [];

    for (const r of response.retrievalResults ?? []) {
      results.push(formatResult(r));
    }

    const output: Record<string, unknown> = {
      results,
      resultCount: results.length,
    };

    if (response.nextToken) {
      output.nextToken = response.nextToken;
    }

    return output;
  } catch (err: unknown) {
    const error = err as Error & { name: string };
    switch (error.name) {
      case "AccessDeniedException":
        throw new Error(
          `Access denied: ensure the caller has bedrock:Retrieve permission on knowledge base ${knowledgeBaseId}. ${error.message}`,
        );
      case "ResourceNotFoundException":
        throw new Error(
          `Knowledge base not found: ${knowledgeBaseId}. Verify the ID and region are correct. ${error.message}`,
        );
      case "ValidationException":
        throw new Error(
          `Invalid request: ${error.message}`,
        );
      default:
        throw error;
    }
  }
}

const StateSchema = z.object({
  Description: z.string().optional(),
  KnowledgeBaseConfiguration: z.object({
    Type: z.string(),
    VectorKnowledgeBaseConfiguration: VectorKnowledgeBaseConfigurationSchema,
    KendraKnowledgeBaseConfiguration: KendraKnowledgeBaseConfigurationSchema,
    SqlKnowledgeBaseConfiguration: SqlKnowledgeBaseConfigurationSchema,
    ManagedKnowledgeBaseConfiguration: ManagedKnowledgeBaseConfigurationSchema,
  }).optional(),
  KnowledgeBaseId: z.string(),
  KnowledgeBaseArn: z.string().optional(),
  Name: z.string().optional(),
  Status: z.string().optional(),
  RoleArn: z.string().optional(),
  CreatedAt: z.string().optional(),
  FailureReasons: z.array(z.string()).optional(),
  UpdatedAt: z.string().optional(),
  StorageConfiguration: z.object({
    Type: z.string(),
    OpensearchServerlessConfiguration: OpenSearchServerlessConfigurationSchema,
    PineconeConfiguration: PineconeConfigurationSchema,
    RdsConfiguration: RdsConfigurationSchema,
    MongoDbAtlasConfiguration: MongoDbAtlasConfigurationSchema,
    NeptuneAnalyticsConfiguration: NeptuneAnalyticsConfigurationSchema,
    S3VectorsConfiguration: S3VectorsConfigurationSchema,
    OpensearchManagedClusterConfiguration:
      OpenSearchManagedClusterConfigurationSchema,
  }).optional(),
  Tags: z.record(z.string(), z.unknown()).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  Description: z.string().min(1).max(200).describe(
    "Description of the Resource.",
  ).optional(),
  KnowledgeBaseConfiguration: z.object({
    Type: z.enum(["VECTOR", "KENDRA", "SQL", "MANAGED"]).describe(
      "The type of a knowledge base.",
    ).optional(),
    VectorKnowledgeBaseConfiguration: VectorKnowledgeBaseConfigurationSchema
      .describe(
        "Contains details about the model used to create vector embeddings for the knowledge base.",
      ).optional(),
    KendraKnowledgeBaseConfiguration: KendraKnowledgeBaseConfigurationSchema
      .describe("Configurations for a Kendra knowledge base").optional(),
    SqlKnowledgeBaseConfiguration: SqlKnowledgeBaseConfigurationSchema.describe(
      "Configurations for a SQL knowledge base",
    ).optional(),
    ManagedKnowledgeBaseConfiguration: ManagedKnowledgeBaseConfigurationSchema
      .describe(
        "Contains details about the model used to create vector embeddings for a managed knowledge base.",
      ).optional(),
  }).describe(
    "Contains details about the embeddings model used for the knowledge base.",
  ).optional(),
  Name: z.string().regex(new RegExp("^([0-9a-zA-Z][_-]?){1,100}$")).describe(
    "The name of the knowledge base.",
  ).optional(),
  RoleArn: z.string().max(2048).regex(
    new RegExp("^arn:aws(-[^:]+)?:iam::([0-9]{12})?:role/.+$"),
  ).describe(
    "The ARN of the IAM role with permissions to invoke API operations on the knowledge base. The ARN must begin with AmazonBedrockExecutionRoleForKnowledgeBase_",
  ).optional(),
  StorageConfiguration: z.object({
    Type: z.enum([
      "OPENSEARCH_SERVERLESS",
      "PINECONE",
      "RDS",
      "MONGO_DB_ATLAS",
      "NEPTUNE_ANALYTICS",
      "S3_VECTORS",
      "OPENSEARCH_MANAGED_CLUSTER",
    ]).describe("The storage type of a knowledge base.").optional(),
    OpensearchServerlessConfiguration: OpenSearchServerlessConfigurationSchema
      .describe(
        "Contains the storage configuration of the knowledge base in Amazon OpenSearch Service.",
      ).optional(),
    PineconeConfiguration: PineconeConfigurationSchema.describe(
      "Contains the storage configuration of the knowledge base in Pinecone.",
    ).optional(),
    RdsConfiguration: RdsConfigurationSchema.describe(
      "Contains details about the storage configuration of the knowledge base in Amazon RDS. For more information, see Create a vector index in Amazon RDS.",
    ).optional(),
    MongoDbAtlasConfiguration: MongoDbAtlasConfigurationSchema.describe(
      "Contains the storage configuration of the knowledge base in MongoDb Atlas Cloud.",
    ).optional(),
    NeptuneAnalyticsConfiguration: NeptuneAnalyticsConfigurationSchema.describe(
      "Contains the configurations to use Neptune Analytics as Vector Store.",
    ).optional(),
    S3VectorsConfiguration: S3VectorsConfigurationSchema.describe(
      "Contains the storage configuration of the knowledge base for S3 vectors.",
    ).optional(),
    OpensearchManagedClusterConfiguration:
      OpenSearchManagedClusterConfigurationSchema.describe(
        "Contains the storage configuration of the knowledge base in Amazon OpenSearch Service.",
      ).optional(),
  }).describe("The vector store service in which the knowledge base is stored.")
    .optional(),
  Tags: z.record(
    z.string(),
    z.string().min(0).max(256).regex(new RegExp("^[a-zA-Z0-9\\s._:/=+@-]*$")),
  ).describe("A map of tag keys and values").optional(),
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

/** Swamp extension model for Bedrock KnowledgeBase. Registered at `@swamp/aws/bedrock/knowledge-base`. */
export const model = {
  type: "@swamp/aws/bedrock/knowledge-base",
  version: "2026.09.12.1",
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
      toVersion: "2026.06.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.03.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.4",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.5",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.12.6",
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
      toVersion: "2026.08.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.06.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Bedrock KnowledgeBase resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Bedrock KnowledgeBase",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const desiredState: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(g)) {
          if (key === "name") continue;
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await createResource(
          "AWS::Bedrock::KnowledgeBase",
          desiredState,
          credentials,
        ) as StateData;
        const instanceName = (g.name?.toString() ?? "current").replace(
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
    get: {
      description: "Get a Bedrock KnowledgeBase",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Bedrock KnowledgeBase",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Bedrock::KnowledgeBase",
          args.identifier,
          credentials,
        ) as StateData;
        const instanceName =
          (context.globalArgs.name?.toString() ?? args.identifier).replace(
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
      description: "Update a Bedrock KnowledgeBase",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.name?.toString() ?? "current").replace(
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
        const identifier = existing.KnowledgeBaseId?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        const currentState = await readResource(
          "AWS::Bedrock::KnowledgeBase",
          identifier,
          credentials,
        ) as StateData;
        const desiredState: Record<string, unknown> = { ...currentState };
        for (const [key, value] of Object.entries(g)) {
          if (key === "name") continue;
          if (_credentialKeys.has(key)) continue;
          if (value !== undefined) desiredState[key] = value;
        }
        const result = await updateResource(
          "AWS::Bedrock::KnowledgeBase",
          identifier,
          currentState,
          desiredState,
          [
            "StorageConfiguration",
            "Type",
            "VectorKnowledgeBaseConfiguration",
            "KendraKnowledgeBaseConfiguration",
            "ManagedKnowledgeBaseConfiguration",
            "Type",
            "StorageConfigurations",
            "QueryEngineConfiguration",
          ],
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
      description: "Delete a Bedrock KnowledgeBase",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Bedrock KnowledgeBase",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Bedrock::KnowledgeBase",
          args.identifier,
          credentials,
        );
        const instanceName =
          (context.globalArgs.name?.toString() ?? args.identifier).replace(
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
      description: "Sync Bedrock KnowledgeBase state from AWS",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const credentials = _buildCredentials(g);
        const instanceName = (g.name?.toString() ?? "current").replace(
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
        const identifier = existing.KnowledgeBaseId?.toString();
        if (!identifier) {
          throw new Error("No identifier found in existing state");
        }
        try {
          const result = await readResource(
            "AWS::Bedrock::KnowledgeBase",
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
      description: "List Bedrock KnowledgeBase resources",
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
        const { items, nextToken } = await listResources(
          "AWS::Bedrock::KnowledgeBase",
          {
            resourceModel: args.resourceModel,
            maxPages: args.maxPages,
            credentials,
          },
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const instanceName =
            (item.properties?.KnowledgeBaseId?.toString() ?? item.identifier)
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
    retrieve: {
      description:
        "Retrieve relevant chunks from a Bedrock Knowledge Base using semantic or hybrid search",
      arguments: z.object({
        knowledgeBaseId: z.string().describe(
          "The unique identifier of the Knowledge Base to query",
        ),
        query: z.string().describe(
          "The natural-language query to retrieve relevant chunks for",
        ),
        numberOfResults: z.number().int().min(1).max(100).describe(
          "Maximum number of retrieval results to return (default: 5)",
        ).optional(),
        searchType: z.enum(["SEMANTIC", "HYBRID"]).describe(
          "Search type — SEMANTIC (vector similarity) or HYBRID (vector + keyword)",
        ).optional(),
        filter: z.record(z.string(), z.unknown()).describe(
          "Retrieval filter configuration to narrow results by metadata attributes",
        ).optional(),
        nextToken: z.string().describe(
          "Pagination token from a previous retrieve call",
        ).optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const mergedArgs = { ...context.globalArgs, ...args };
        const result = await retrieve(mergedArgs, credentials);
        const argKeys = Object.keys(args).filter((k) => args[k] !== undefined);
        const suffix = argKeys.length > 0
          ? "-" + argKeys.map((k) => String(args[k])).join("-")
          : "";
        const instanceName = ("retrieve" + suffix).replace(/[\/\\]/g, "_")
          .replace(/\.\./g, "_").replace(/\0/g, "");
        const handle = await context.writeResource(
          "state",
          instanceName,
          result,
        );
        return { dataHandles: [handle] };
      },
    },
  },
};
