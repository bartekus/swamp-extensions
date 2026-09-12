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

// Auto-generated extension model for @swamp/aws/bedrock/data-source
// Do not edit manually. Re-generate with: deno task generate:aws

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Bedrock DataSource (AWS::Bedrock::DataSource).
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

const S3DataSourceConfigurationSchema = z.object({
  BucketArn: z.string().min(1).max(2048).regex(
    new RegExp(
      "^arn:aws(-cn|-us-gov|-eusc|-iso(-[b-f])?)?:s3:::[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$",
    ),
  ).describe("The ARN of the bucket that contains the data source."),
  InclusionPrefixes: z.array(z.string().min(1).max(300)).describe(
    "A list of S3 prefixes that define the object containing the data sources.",
  ).optional(),
  BucketOwnerAccountId: z.string().min(12).max(12).regex(
    new RegExp("^[0-9]{12}$"),
  ).describe("The account ID for the owner of the S3 bucket.").optional(),
});

const ConfluenceSourceConfigurationSchema = z.object({
  HostUrl: z.string().min(1).max(2048).regex(
    new RegExp("^https://[A-Za-z0-9][^\\s]*$"),
  ).describe("The Confluence host URL or instance URL."),
  HostType: z.enum(["SAAS"]).describe(
    "The supported host type, whether online/cloud or server/on-premises.",
  ),
  AuthType: z.enum(["BASIC", "OAUTH2_CLIENT_CREDENTIALS"]).describe(
    "The supported authentication type to authenticate and connect to your Confluence instance.",
  ),
  CredentialsSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe(
    "The Amazon Resource Name of an AWS Secrets Manager secret that stores your authentication credentials for your Confluence instance URL. For more information on the key-value pairs that must be included in your secret, depending on your authentication type, see Confluence connection configuration.",
  ),
});

const PatternObjectFilterSchema = z.object({
  ObjectType: z.string().min(1).max(50).describe(
    "The supported object type or content type of the data source.",
  ),
  InclusionFilters: z.array(z.string().max(1000)).describe(
    "A set of regular expression filter patterns for a type of object.",
  ).optional(),
  ExclusionFilters: z.array(z.string().max(1000)).describe(
    "A set of regular expression filter patterns for a type of object.",
  ).optional(),
});

const PatternObjectFilterConfigurationSchema = z.object({
  Filters: z.array(PatternObjectFilterSchema).describe("Contains information"),
});

const CrawlFilterConfigurationSchema = z.object({
  Type: z.enum(["PATTERN"]).describe("The crawl filter type."),
  PatternObjectFilter: PatternObjectFilterConfigurationSchema.describe(
    "The configuration of specific filters applied to your data source content. You can filter out or include certain content.",
  ).optional(),
});

const ConfluenceCrawlerConfigurationSchema = z.object({
  FilterConfiguration: CrawlFilterConfigurationSchema.describe(
    "The type of filtering that you want to apply to certain objects or content of the data source. For example, the PATTERN type is regular expression patterns you can apply to filter your content.",
  ).optional(),
});

const ConfluenceDataSourceConfigurationSchema = z.object({
  SourceConfiguration: ConfluenceSourceConfigurationSchema.describe(
    "The endpoint information to connect to your Confluence data source.",
  ),
  CrawlerConfiguration: ConfluenceCrawlerConfigurationSchema.describe(
    "The configuration of the Confluence content. For example, configuring specific types of Confluence content.",
  ).optional(),
});

const SalesforceSourceConfigurationSchema = z.object({
  HostUrl: z.string().min(1).max(2048).regex(
    new RegExp("^https://[A-Za-z0-9][^\\s]*$"),
  ).describe("The Salesforce host URL or instance URL."),
  AuthType: z.enum(["OAUTH2_CLIENT_CREDENTIALS"]).describe(
    "The supported authentication type to authenticate and connect to your Salesforce instance.",
  ),
  CredentialsSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe(
    "The Amazon Resource Name of an AWS Secrets Manager secret that stores your authentication credentials for your Salesforce instance URL. For more information on the key-value pairs that must be included in your secret, depending on your authentication type, see Salesforce connection configuration.",
  ),
});

const SalesforceCrawlerConfigurationSchema = z.object({
  FilterConfiguration: CrawlFilterConfigurationSchema.describe(
    "The type of filtering that you want to apply to certain objects or content of the data source. For example, the PATTERN type is regular expression patterns you can apply to filter your content.",
  ).optional(),
});

const SalesforceDataSourceConfigurationSchema = z.object({
  SourceConfiguration: SalesforceSourceConfigurationSchema.describe(
    "The endpoint information to connect to your Salesforce data source.",
  ),
  CrawlerConfiguration: SalesforceCrawlerConfigurationSchema.describe(
    "The configuration of filtering the Salesforce content. For example, configuring regular expression patterns to include or exclude certain content.",
  ).optional(),
});

const SharePointSourceConfigurationSchema = z.object({
  SiteUrls: z.array(
    z.string().regex(new RegExp("^https://[A-Za-z0-9][^\\s]*$")),
  ).describe("A list of one or more SharePoint site URLs."),
  HostType: z.enum(["ONLINE"]).describe(
    "The supported host type, whether online/cloud or server/on-premises.",
  ),
  AuthType: z.enum([
    "OAUTH2_CLIENT_CREDENTIALS",
    "OAUTH2_SHAREPOINT_APP_ONLY_CLIENT_CREDENTIALS",
  ]).describe(
    "The supported authentication type to authenticate and connect to your SharePoint site/sites.",
  ),
  CredentialsSecretArn: z.string().regex(
    new RegExp(
      "^arn:aws(|-cn|-us-gov):secretsmanager:[a-z0-9-]{1,20}:([0-9]{12}|):secret:[a-zA-Z0-9!/_+=.@-]{1,512}$",
    ),
  ).describe(
    "The Amazon Resource Name of an AWS Secrets Manager secret that stores your authentication credentials for your SharePoint site/sites. For more information on the key-value pairs that must be included in your secret, depending on your authentication type, see SharePoint connection configuration.",
  ),
  TenantId: z.string().regex(
    new RegExp(
      "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
    ),
  ).describe("The identifier of your Microsoft 365 tenant.").optional(),
  Domain: z.string().min(1).max(50).describe(
    "The domain of your SharePoint instance or site URL/URLs.",
  ),
});

const SharePointCrawlerConfigurationSchema = z.object({
  FilterConfiguration: CrawlFilterConfigurationSchema.describe(
    "The type of filtering that you want to apply to certain objects or content of the data source. For example, the PATTERN type is regular expression patterns you can apply to filter your content.",
  ).optional(),
});

const SharePointDataSourceConfigurationSchema = z.object({
  SourceConfiguration: SharePointSourceConfigurationSchema.describe(
    "The endpoint information to connect to your SharePoint data source.",
  ),
  CrawlerConfiguration: SharePointCrawlerConfigurationSchema.describe(
    "The configuration of the SharePoint content. For example, configuring specific types of SharePoint content.",
  ).optional(),
});

const SeedUrlSchema = z.object({
  Url: z.string().regex(new RegExp("^https?://[A-Za-z0-9][^\\s]*$")).describe(
    "A web url.",
  ),
});

const UrlConfigurationSchema = z.object({
  SeedUrls: z.array(SeedUrlSchema).describe("A list of web urls."),
});

const WebSourceConfigurationSchema = z.object({
  UrlConfiguration: UrlConfigurationSchema.describe("A url configuration."),
});

const WebCrawlerLimitsSchema = z.object({
  RateLimit: z.number().int().min(1).max(300).describe(
    "Rate of web URLs retrieved per minute.",
  ).optional(),
  MaxPages: z.number().int().min(1).describe(
    "Maximum number of pages the crawler can crawl.",
  ).optional(),
});

const WebCrawlerConfigurationSchema = z.object({
  CrawlerLimits: WebCrawlerLimitsSchema.describe(
    "Limit settings for the web crawler.",
  ).optional(),
  InclusionFilters: z.array(z.string().max(1000)).describe(
    "A set of regular expression filter patterns for a type of object.",
  ).optional(),
  ExclusionFilters: z.array(z.string().max(1000)).describe(
    "A set of regular expression filter patterns for a type of object.",
  ).optional(),
  Scope: z.enum(["HOST_ONLY", "SUBDOMAINS"]).describe(
    "The scope that a web crawl job will be restricted to.",
  ).optional(),
  UserAgent: z.string().min(15).max(40).describe(
    "The suffix that will be included in the user agent header.",
  ).optional(),
});

const WebDataSourceConfigurationSchema = z.object({
  SourceConfiguration: WebSourceConfigurationSchema.describe(
    "A web source configuration.",
  ),
  CrawlerConfiguration: WebCrawlerConfigurationSchema.describe(
    "Configuration for the web crawler.",
  ).optional(),
});

const DeletionProtectionConfigurationSchema = z.object({
  DeletionProtectionStatus: z.enum(["ENABLED", "DISABLED"]).describe(
    "Indicates whether a feature is enabled or disabled.",
  ),
  DeletionProtectionThreshold: z.number().int().min(0).max(100).describe(
    "Threshold for deletion protection.",
  ).optional(),
});

const ImageExtractionConfigurationSchema = z.object({
  ImageExtractionStatus: z.enum(["ENABLED", "DISABLED"]).describe(
    "Indicates whether a feature is enabled or disabled.",
  ),
});

const AudioExtractionConfigurationSchema = z.object({
  AudioExtractionStatus: z.enum(["ENABLED", "DISABLED"]).describe(
    "Indicates whether a feature is enabled or disabled.",
  ),
});

const VideoExtractionConfigurationSchema = z.object({
  VideoExtractionStatus: z.enum(["ENABLED", "DISABLED"]).describe(
    "Indicates whether a feature is enabled or disabled.",
  ),
});

const MediaExtractionConfigurationSchema = z.object({
  ImageExtractionConfiguration: ImageExtractionConfigurationSchema.describe(
    "Configuration for image extraction.",
  ).optional(),
  AudioExtractionConfiguration: AudioExtractionConfigurationSchema.describe(
    "Configuration for audio extraction.",
  ).optional(),
  VideoExtractionConfiguration: VideoExtractionConfigurationSchema.describe(
    "Configuration for video extraction.",
  ).optional(),
});

const ManagedKnowledgeBaseConnectorConfigurationSchema = z.object({
  DeletionProtectionConfiguration: DeletionProtectionConfigurationSchema
    .describe("Configuration for deletion protection.").optional(),
  MediaExtractionConfiguration: MediaExtractionConfigurationSchema.describe(
    "Configuration for media extraction settings.",
  ).optional(),
  ConnectorParameters: z.record(z.string(), z.unknown()).describe(
    "Connector-specific parameters.",
  ).optional(),
});

const FixedSizeChunkingConfigurationSchema = z.object({
  MaxTokens: z.number().int().min(1).describe(
    "The maximum number of tokens to include in a chunk.",
  ),
  OverlapPercentage: z.number().int().min(1).max(99).describe(
    "The percentage of overlap between adjacent chunks of a data source.",
  ),
});

const HierarchicalChunkingLevelConfigurationSchema = z.object({
  MaxTokens: z.number().int().min(1).max(8192).describe(
    "The maximum number of tokens that a chunk can contain in this layer.",
  ),
});

const HierarchicalChunkingConfigurationSchema = z.object({
  LevelConfigurations: z.array(HierarchicalChunkingLevelConfigurationSchema)
    .describe("Token settings for each layer."),
  OverlapTokens: z.number().int().min(1).describe(
    "The number of tokens to repeat across chunks in the same layer.",
  ),
});

const SemanticChunkingConfigurationSchema = z.object({
  BreakpointPercentileThreshold: z.number().int().min(50).max(99).describe(
    "The dissimilarity threshold for splitting chunks.",
  ),
  BufferSize: z.number().int().min(0).max(1).describe("The buffer size."),
  MaxTokens: z.number().int().min(1).describe(
    "The maximum number of tokens that a chunk can contain.",
  ),
});

const ChunkingConfigurationSchema = z.object({
  ChunkingStrategy: z.enum(["FIXED_SIZE", "NONE", "HIERARCHICAL", "SEMANTIC"])
    .describe(
      "Knowledge base can split your source data into chunks. A chunk refers to an excerpt from a data source that is returned when the knowledge base that it belongs to is queried. You have the following options for chunking your data. If you opt for NONE, then you may want to pre-process your files by splitting them up such that each file corresponds to a chunk.",
    ),
  FixedSizeChunkingConfiguration: FixedSizeChunkingConfigurationSchema.describe(
    "Configurations for when you choose fixed-size chunking. If you set the chunkingStrategy as NONE, exclude this field.",
  ).optional(),
  HierarchicalChunkingConfiguration: HierarchicalChunkingConfigurationSchema
    .describe(
      "Configurations for when you choose hierarchical chunking. If you set the chunkingStrategy as NONE, exclude this field.",
    ).optional(),
  SemanticChunkingConfiguration: SemanticChunkingConfigurationSchema.describe(
    "Configurations for when you choose semantic chunking. If you set the chunkingStrategy as NONE, exclude this field.",
  ).optional(),
});

const S3LocationSchema = z.object({
  URI: z.string().min(1).max(2048).regex(new RegExp("^s3://.{1,128}$"))
    .describe("The location's URI"),
});

const IntermediateStorageSchema = z.object({
  S3Location: S3LocationSchema.describe("An Amazon S3 location."),
});

const TransformationLambdaConfigurationSchema = z.object({
  LambdaArn: z.string().min(0).max(2048).regex(
    new RegExp(
      "^arn:(aws[a-zA-Z-]*)?:lambda:[a-z]{2}(-gov)?-[a-z]+-\\d{1}:\\d{12}:function:[a-zA-Z0-9-_\\.]+(:(\\$LATEST|[a-zA-Z0-9-_]+))?$",
    ),
  ).describe("The function's ARN identifier."),
});

const TransformationFunctionSchema = z.object({
  TransformationLambdaConfiguration: TransformationLambdaConfigurationSchema
    .describe("A Lambda function that processes documents."),
});

const TransformationSchema = z.object({
  StepToApply: z.enum(["POST_CHUNKING"]).describe(
    "When the service applies the transformation.",
  ),
  TransformationFunction: TransformationFunctionSchema.describe(
    "A Lambda function that processes documents.",
  ),
});

const CustomTransformationConfigurationSchema = z.object({
  IntermediateStorage: IntermediateStorageSchema.describe(
    "A location for storing content from data sources temporarily as it is processed by custom components in the ingestion pipeline.",
  ),
  Transformations: z.array(TransformationSchema).describe(
    "A list of Lambda functions that process documents.",
  ),
});

const ParsingPromptSchema = z.object({
  ParsingPromptText: z.string().min(1).max(10000).describe(
    "Instructions for interpreting the contents of a document.",
  ),
});

const BedrockFoundationModelConfigurationSchema = z.object({
  ModelArn: z.string().min(1).max(2048).regex(
    new RegExp(
      "^(arn:aws(-cn|-us-gov|-eusc|-iso(-[b-f])?)?:(bedrock):[a-z0-9-]{1,20}:([0-9]{12})?:([a-z-]+/)?)?([a-zA-Z0-9.-]{1,63}){0,2}(([:][a-z0-9-]{1,63}){0,2})?(/[a-z0-9]{1,12})?$",
    ),
  ).describe("The model's ARN."),
  ParsingPrompt: ParsingPromptSchema.describe(
    "Instructions for interpreting the contents of a document.",
  ).optional(),
  ParsingModality: z.enum(["MULTIMODAL"]).describe(
    "Determine how will parsed content be stored.",
  ).optional(),
});

const BedrockDataAutomationConfigurationSchema = z.object({
  ParsingModality: z.enum(["MULTIMODAL"]).describe(
    "Determine how will parsed content be stored.",
  ).optional(),
});

const ParsingConfigurationSchema = z.object({
  ParsingStrategy: z.enum([
    "BEDROCK_FOUNDATION_MODEL",
    "BEDROCK_DATA_AUTOMATION",
    "SMART_PARSING",
    "MULTI_MODAL_EMBEDDINGS",
  ]).describe("The parsing strategy for the data source."),
  BedrockFoundationModelConfiguration: BedrockFoundationModelConfigurationSchema
    .describe(
      "Settings for a foundation model used to parse documents for a data source.",
    ).optional(),
  BedrockDataAutomationConfiguration: BedrockDataAutomationConfigurationSchema
    .describe(
      "Settings for a Bedrock Data Automation used to parse documents for a data source.",
    ).optional(),
});

const EnrichmentStrategyConfigurationSchema = z.object({
  Method: z.enum(["CHUNK_ENTITY_EXTRACTION"]).describe(
    "Enrichment Strategy method.",
  ),
});

const BedrockFoundationModelContextEnrichmentConfigurationSchema = z.object({
  EnrichmentStrategyConfiguration: EnrichmentStrategyConfigurationSchema
    .describe(
      "Strategy to be used when using Bedrock Foundation Model for Context Enrichment.",
    ),
  ModelArn: z.string().min(1).max(2048).regex(
    new RegExp(
      "^(arn:aws(-cn|-us-gov|-eusc|-iso(-[b-f])?)?:(bedrock):[a-z0-9-]{1,20}:([0-9]{12})?:([a-z-]+/)?)?([a-zA-Z0-9.-]{1,63}){0,2}(([:][a-z0-9-]{1,63}){0,2})?(/[a-z0-9]{1,12})?$",
    ),
  ).describe("The model's ARN."),
});

const ContextEnrichmentConfigurationSchema = z.object({
  Type: z.enum(["BEDROCK_FOUNDATION_MODEL"]).describe(
    "Enrichment type to be used for the vector database.",
  ),
  BedrockFoundationModelConfiguration:
    BedrockFoundationModelContextEnrichmentConfigurationSchema.describe(
      "Bedrock Foundation Model configuration to be used for Context Enrichment.",
    ).optional(),
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
  DataSourceConfiguration: z.object({
    Type: z.enum([
      "S3",
      "CONFLUENCE",
      "SALESFORCE",
      "SHAREPOINT",
      "WEB",
      "CUSTOM",
      "REDSHIFT_METADATA",
      "MANAGED_KNOWLEDGE_BASE_CONNECTOR",
    ]).describe("The type of the data source location."),
    S3Configuration: S3DataSourceConfigurationSchema.describe(
      "The configuration information to connect to Amazon S3 as your data source.",
    ).optional(),
    ConfluenceConfiguration: ConfluenceDataSourceConfigurationSchema.describe(
      "The configuration information to connect to Confluence as your data source.",
    ).optional(),
    SalesforceConfiguration: SalesforceDataSourceConfigurationSchema.describe(
      "The configuration information to connect to Salesforce as your data source.",
    ).optional(),
    SharePointConfiguration: SharePointDataSourceConfigurationSchema.describe(
      "The configuration information to connect to SharePoint as your data source.",
    ).optional(),
    WebConfiguration: WebDataSourceConfigurationSchema.describe(
      "Configures a web data source location.",
    ).optional(),
    ManagedKnowledgeBaseConnectorConfiguration:
      ManagedKnowledgeBaseConnectorConfigurationSchema.describe(
        "Configuration for managed knowledge base connector data sources.",
      ).optional(),
  }).describe("Specifies a raw data source location to ingest."),
  Description: z.string().min(1).max(200).describe(
    "Description of the Resource.",
  ).optional(),
  KnowledgeBaseId: z.string().regex(new RegExp("^[0-9a-zA-Z]{10}$")).describe(
    "The unique identifier of the knowledge base to which to add the data source.",
  ),
  Name: z.string().regex(new RegExp("^([0-9a-zA-Z][_-]?){1,100}$")).describe(
    "The name of the data source.",
  ),
  ServerSideEncryptionConfiguration: z.object({
    KmsKeyArn: z.string().min(1).max(2048).regex(
      new RegExp(
        "^arn:aws(-cn|-us-gov|-eusc|-iso(-[b-f])?)?:kms:[a-zA-Z0-9-]*:[0-9]{12}:key/[a-zA-Z0-9-]{36}$",
      ),
    ).describe("The ARN of the AWS KMS key used to encrypt the resource.")
      .optional(),
  }).describe(
    "Contains details about the server-side encryption for the data source.",
  ).optional(),
  VectorIngestionConfiguration: z.object({
    ChunkingConfiguration: ChunkingConfigurationSchema.describe(
      "Details about how to chunk the documents in the data source. A chunk refers to an excerpt from a data source that is returned when the knowledge base that it belongs to is queried.",
    ).optional(),
    CustomTransformationConfiguration: CustomTransformationConfigurationSchema
      .describe(
        "Settings for customizing steps in the data source content ingestion pipeline.",
      ).optional(),
    ParsingConfiguration: ParsingConfigurationSchema.describe(
      "Settings for parsing document contents",
    ).optional(),
    ContextEnrichmentConfiguration: ContextEnrichmentConfigurationSchema
      .describe(
        "Additional Enrichment Configuration for example when using GraphRag.",
      ).optional(),
  }).describe(
    "Details about how to chunk the documents in the data source. A chunk refers to an excerpt from a data source that is returned when the knowledge base that it belongs to is queried.",
  ).optional(),
  DataDeletionPolicy: z.enum(["RETAIN", "DELETE"]).describe(
    "The deletion policy for the data source.",
  ).optional(),
});

const StateSchema = z.object({
  DataSourceConfiguration: z.object({
    Type: z.string(),
    S3Configuration: S3DataSourceConfigurationSchema,
    ConfluenceConfiguration: ConfluenceDataSourceConfigurationSchema,
    SalesforceConfiguration: SalesforceDataSourceConfigurationSchema,
    SharePointConfiguration: SharePointDataSourceConfigurationSchema,
    WebConfiguration: WebDataSourceConfigurationSchema,
    ManagedKnowledgeBaseConnectorConfiguration:
      ManagedKnowledgeBaseConnectorConfigurationSchema,
  }).optional(),
  DataSourceId: z.string(),
  Description: z.string().optional(),
  KnowledgeBaseId: z.string(),
  DataSourceStatus: z.string().optional(),
  Name: z.string().optional(),
  ServerSideEncryptionConfiguration: z.object({
    KmsKeyArn: z.string(),
  }).optional(),
  VectorIngestionConfiguration: z.object({
    ChunkingConfiguration: ChunkingConfigurationSchema,
    CustomTransformationConfiguration: CustomTransformationConfigurationSchema,
    ParsingConfiguration: ParsingConfigurationSchema,
    ContextEnrichmentConfiguration: ContextEnrichmentConfigurationSchema,
  }).optional(),
  DataDeletionPolicy: z.string().optional(),
  CreatedAt: z.string().optional(),
  UpdatedAt: z.string().optional(),
  FailureReasons: z.array(z.string()).optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessKeyId: z.string().meta({ sensitive: true }).optional(),
  secretAccessKey: z.string().meta({ sensitive: true }).optional(),
  sessionToken: z.string().meta({ sensitive: true }).optional(),
  region: z.string().optional(),
  DataSourceConfiguration: z.object({
    Type: z.enum([
      "S3",
      "CONFLUENCE",
      "SALESFORCE",
      "SHAREPOINT",
      "WEB",
      "CUSTOM",
      "REDSHIFT_METADATA",
      "MANAGED_KNOWLEDGE_BASE_CONNECTOR",
    ]).describe("The type of the data source location.").optional(),
    S3Configuration: S3DataSourceConfigurationSchema.describe(
      "The configuration information to connect to Amazon S3 as your data source.",
    ).optional(),
    ConfluenceConfiguration: ConfluenceDataSourceConfigurationSchema.describe(
      "The configuration information to connect to Confluence as your data source.",
    ).optional(),
    SalesforceConfiguration: SalesforceDataSourceConfigurationSchema.describe(
      "The configuration information to connect to Salesforce as your data source.",
    ).optional(),
    SharePointConfiguration: SharePointDataSourceConfigurationSchema.describe(
      "The configuration information to connect to SharePoint as your data source.",
    ).optional(),
    WebConfiguration: WebDataSourceConfigurationSchema.describe(
      "Configures a web data source location.",
    ).optional(),
    ManagedKnowledgeBaseConnectorConfiguration:
      ManagedKnowledgeBaseConnectorConfigurationSchema.describe(
        "Configuration for managed knowledge base connector data sources.",
      ).optional(),
  }).describe("Specifies a raw data source location to ingest.").optional(),
  Description: z.string().min(1).max(200).describe(
    "Description of the Resource.",
  ).optional(),
  KnowledgeBaseId: z.string().regex(new RegExp("^[0-9a-zA-Z]{10}$")).describe(
    "The unique identifier of the knowledge base to which to add the data source.",
  ).optional(),
  Name: z.string().regex(new RegExp("^([0-9a-zA-Z][_-]?){1,100}$")).describe(
    "The name of the data source.",
  ).optional(),
  ServerSideEncryptionConfiguration: z.object({
    KmsKeyArn: z.string().min(1).max(2048).regex(
      new RegExp(
        "^arn:aws(-cn|-us-gov|-eusc|-iso(-[b-f])?)?:kms:[a-zA-Z0-9-]*:[0-9]{12}:key/[a-zA-Z0-9-]{36}$",
      ),
    ).describe("The ARN of the AWS KMS key used to encrypt the resource.")
      .optional(),
  }).describe(
    "Contains details about the server-side encryption for the data source.",
  ).optional(),
  VectorIngestionConfiguration: z.object({
    ChunkingConfiguration: ChunkingConfigurationSchema.describe(
      "Details about how to chunk the documents in the data source. A chunk refers to an excerpt from a data source that is returned when the knowledge base that it belongs to is queried.",
    ).optional(),
    CustomTransformationConfiguration: CustomTransformationConfigurationSchema
      .describe(
        "Settings for customizing steps in the data source content ingestion pipeline.",
      ).optional(),
    ParsingConfiguration: ParsingConfigurationSchema.describe(
      "Settings for parsing document contents",
    ).optional(),
    ContextEnrichmentConfiguration: ContextEnrichmentConfigurationSchema
      .describe(
        "Additional Enrichment Configuration for example when using GraphRag.",
      ).optional(),
  }).describe(
    "Details about how to chunk the documents in the data source. A chunk refers to an excerpt from a data source that is returned when the knowledge base that it belongs to is queried.",
  ).optional(),
  DataDeletionPolicy: z.enum(["RETAIN", "DELETE"]).describe(
    "The deletion policy for the data source.",
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

/** Swamp extension model for Bedrock DataSource. Registered at `@swamp/aws/bedrock/data-source`. */
export const model = {
  type: "@swamp/aws/bedrock/data-source",
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
      toVersion: "2026.09.12.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "Bedrock DataSource resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a Bedrock DataSource",
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
          "AWS::Bedrock::DataSource",
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
      description: "Get a Bedrock DataSource",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Bedrock DataSource",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const result = await readResource(
          "AWS::Bedrock::DataSource",
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
      description: "Update a Bedrock DataSource",
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
        const idParts = [
          existing.KnowledgeBaseId?.toString(),
          existing.DataSourceId?.toString(),
        ];
        if (idParts.some((p) => !p)) {
          throw new Error(
            "Missing primary identifier fields in existing state",
          );
        }
        const identifier = idParts.join("|");
        const currentState = await readResource(
          "AWS::Bedrock::DataSource",
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
          "AWS::Bedrock::DataSource",
          identifier,
          currentState,
          desiredState,
          [
            "KnowledgeBaseId",
            "ChunkingConfiguration",
            "ParsingConfiguration",
            "Type",
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
      description: "Delete a Bedrock DataSource",
      arguments: z.object({
        identifier: z.string().describe(
          "The primary identifier of the Bedrock DataSource",
        ),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const credentials = _buildCredentials(context.globalArgs);
        const { existed } = await deleteResource(
          "AWS::Bedrock::DataSource",
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
      description: "Sync Bedrock DataSource state from AWS",
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
        const idParts = [
          existing.KnowledgeBaseId?.toString(),
          existing.DataSourceId?.toString(),
        ];
        if (idParts.some((p) => !p)) {
          throw new Error(
            "Missing primary identifier fields in existing state",
          );
        }
        const identifier = idParts.join("|");
        try {
          const result = await readResource(
            "AWS::Bedrock::DataSource",
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
      description: "List Bedrock DataSource resources",
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
          "AWS::Bedrock::DataSource",
          {
            resourceModel: args.resourceModel,
            maxPages: args.maxPages,
            credentials,
          },
        );
        const dataHandles = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const instanceName = item.identifier.replace(/[\/\\]/g, "_").replace(
            /\.\./g,
            "_",
          ).replace(/\0/g, "");
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
