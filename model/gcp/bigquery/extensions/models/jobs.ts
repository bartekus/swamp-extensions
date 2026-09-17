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

// Auto-generated extension model for @swamp/gcp/bigquery/jobs
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud BigQuery Jobs.
 *
 * Returns information about a specific job. Job information is available for a six month period after creation. Requires that you're the person who ran the job, or have the Is Owner project role. # IAM Permissions Requires the `bigquery.jobs.get` permission on the job resource. If the user matches the creator of the job, the `bigquery.jobs.create` permission on the project is required instead.
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
  request,
} from "./_lib/gcp.ts";

const BASE_URL = "https://bigquery.googleapis.com/bigquery/v2/";

const GET_CONFIG = {
  "id": "bigquery.jobs.get",
  "path": "projects/{+projectId}/jobs/{+jobId}",
  "httpMethod": "GET",
  "parameterOrder": [
    "projectId",
    "jobId",
  ],
  "parameters": {
    "jobId": {
      "location": "path",
      "required": true,
    },
    "location": {
      "location": "query",
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "bigquery.jobs.insert",
  "path": "projects/{+projectId}/jobs",
  "httpMethod": "POST",
  "parameterOrder": [
    "projectId",
  ],
  "parameters": {
    "projectId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "bigquery.jobs.delete",
  "path": "projects/{+projectId}/jobs/{+jobId}/delete",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "projectId",
    "jobId",
  ],
  "parameters": {
    "jobId": {
      "location": "path",
      "required": true,
    },
    "location": {
      "location": "query",
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "bigquery.jobs.list",
  "path": "projects/{+projectId}/jobs",
  "httpMethod": "GET",
  "parameterOrder": [
    "projectId",
  ],
  "parameters": {
    "allUsers": {
      "location": "query",
    },
    "maxCreationTime": {
      "location": "query",
    },
    "maxResults": {
      "location": "query",
    },
    "minCreationTime": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "parentJobId": {
      "location": "query",
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "projection": {
      "location": "query",
    },
    "stateFilter": {
      "location": "query",
    },
  },
} as const;

const GlobalArgsSchema = z.object({
  name: z.string().describe(
    "Instance name for this resource (used as the unique identifier in the factory pattern)",
  ),
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
  configuration: z.object({
    copy: z.object({
      createDisposition: z.string().describe(
        "Optional. Specifies whether the job is allowed to create new tables. The following values are supported: * CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. * CREATE_NEVER: The table must already exist. If it does not, a 'notFound' error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string().describe(
          "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
        ).optional(),
      }).describe("Custom encryption configuration (e.g., Cloud KMS keys).")
        .optional(),
      destinationExpirationTime: z.string().describe(
        "Optional. The time when the destination table expires. Expired tables will be deleted and their storage reclaimed.",
      ).optional(),
      destinationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("[Required] The destination table.").optional(),
      operationType: z.enum([
        "OPERATION_TYPE_UNSPECIFIED",
        "COPY",
        "SNAPSHOT",
        "RESTORE",
        "CLONE",
      ]).describe("Optional. Supported operation types in table copy job.")
        .optional(),
      sourceTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("[Pick one] Source table to copy.").optional(),
      sourceTables: z.array(z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      })).describe("[Pick one] Source tables to copy.").optional(),
      writeDisposition: z.string().describe(
        "Optional. Specifies the action that occurs if the destination table already exists. The following values are supported: * WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data and uses the schema and table constraints from the source table. * WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. * WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result. The default value is WRITE_EMPTY. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
    }).describe("[Pick one] Copies a table.").optional(),
    dryRun: z.boolean().describe(
      "Optional. If set, don't actually run this job. A valid query will return a mostly empty response with some processing statistics, while an invalid query will return the same error it would if it wasn't a dry run. Behavior of non-query jobs is undefined.",
    ).optional(),
    extract: z.object({
      compression: z.string().describe(
        "Optional. The compression type to use for exported files. Possible values include DEFLATE, GZIP, NONE, SNAPPY, and ZSTD. The default value is NONE. Not all compression formats are support for all file formats. DEFLATE is only supported for Avro. ZSTD is only supported for Parquet. Not applicable when extracting models.",
      ).optional(),
      destinationFormat: z.string().describe(
        "Optional. The exported file format. Possible values include CSV, NEWLINE_DELIMITED_JSON, PARQUET, or AVRO for tables and ML_TF_SAVED_MODEL or ML_XGBOOST_BOOSTER for models. The default value for tables is CSV. Tables with nested or repeated fields cannot be exported as CSV. The default value for models is ML_TF_SAVED_MODEL.",
      ).optional(),
      destinationUri: z.string().describe(
        "[Pick one] DEPRECATED: Use destinationUris instead, passing only one URI as necessary. The fully-qualified Google Cloud Storage URI where the extracted table should be written.",
      ).optional(),
      destinationUris: z.array(z.string()).describe(
        "[Pick one] A list of fully-qualified Google Cloud Storage URIs where the extracted table should be written.",
      ).optional(),
      fieldDelimiter: z.string().describe(
        "Optional. When extracting data in CSV format, this defines the delimiter to use between fields in the exported data. Default is ','. Not applicable when extracting models.",
      ).optional(),
      modelExtractOptions: z.object({
        trialId: z.string().describe(
          "The 1-based ID of the trial to be exported from a hyperparameter tuning model. If not specified, the trial with id = [Model](https://cloud.google.com/bigquery/docs/reference/rest/v2/models#resource:-model).defaultTrialId is exported. This field is ignored for models not trained with hyperparameter tuning.",
        ).optional(),
      }).describe(
        "Optional. Model extract options only applicable when extracting models.",
      ).optional(),
      printHeader: z.boolean().describe(
        "Optional. Whether to print out a header row in the results. Default is true. Not applicable when extracting models.",
      ).optional(),
      sourceModel: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this model.",
        ).optional(),
        modelId: z.string().describe(
          "Required. The ID of the model. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this model.",
        ).optional(),
      }).describe("A reference to the model being exported.").optional(),
      sourceTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("A reference to the table being exported.").optional(),
      useAvroLogicalTypes: z.boolean().describe(
        "Whether to use logical types when extracting to AVRO format. Not applicable when extracting models.",
      ).optional(),
    }).describe("[Pick one] Configures an extract job.").optional(),
    jobTimeoutMs: z.string().describe(
      "Optional. Job timeout in milliseconds relative to the job creation time. If this time limit is exceeded, BigQuery attempts to stop the job, but might not always succeed in canceling it before the job completes. For example, a job that takes more than 60 seconds to complete has a better chance of being stopped than a job that takes 10 seconds to complete.",
    ).optional(),
    jobType: z.string().describe(
      "Output only. The type of the job. Can be QUERY, LOAD, EXTRACT, COPY or UNKNOWN.",
    ).optional(),
    labels: z.record(z.string(), z.string()).describe(
      "The labels associated with this job. You can use these to organize and group your jobs. Label keys and values can be no longer than 63 characters, can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter and each label in the list must have a different key.",
    ).optional(),
    load: z.object({
      allowJaggedRows: z.boolean().describe(
        "Optional. Accept rows that are missing trailing optional columns. The missing values are treated as nulls. If false, records with missing trailing columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. Only applicable to CSV, ignored for other formats.",
      ).optional(),
      allowQuotedNewlines: z.boolean().describe(
        "Indicates if BigQuery should allow quoted data sections that contain newline characters in a CSV file. The default value is false.",
      ).optional(),
      autodetect: z.boolean().describe(
        "Optional. Indicates if we should automatically infer the options and schema for CSV and JSON sources.",
      ).optional(),
      clustering: z.object({
        fields: z.array(z.string()).describe(
          "One or more fields on which data should be clustered. Only top-level, non-repeated, simple-type fields are supported. The ordering of the clustering fields should be prioritized from most to least important for filtering purposes. For additional information, see [Introduction to clustered tables](https://cloud.google.com/bigquery/docs/clustered-tables#limitations).",
        ).optional(),
      }).describe("Clustering specification for the destination table.")
        .optional(),
      columnNameCharacterMap: z.enum([
        "COLUMN_NAME_CHARACTER_MAP_UNSPECIFIED",
        "STRICT",
        "V1",
        "V2",
      ]).describe(
        "Optional. Character map supported for column names in CSV/Parquet loads. Defaults to STRICT and can be overridden by Project Config Service. Using this option with unsupporting load formats will result in an error.",
      ).optional(),
      connectionProperties: z.array(z.object({
        key: z.string().describe("The key of the property to set.").optional(),
        value: z.string().describe("The value of the property to set.")
          .optional(),
      })).describe(
        "Optional. Connection properties which can modify the load job behavior. Currently, only the 'session_id' connection property is supported, and is used to resolve _SESSION appearing as the dataset id.",
      ).optional(),
      copyFilesOnly: z.boolean().describe(
        "Optional. [Experimental] Configures the load job to copy files directly to the destination BigLake managed table, bypassing file content reading and rewriting. Copying files only is supported when all the following are true: * `source_uris` are located in the same Cloud Storage location as the destination table's `storage_uri` location. * `source_format` is `PARQUET`. * `destination_table` is an existing BigLake managed table. The table's schema does not have flexible column names. The table's columns do not have type parameters other than precision and scale. * No options other than the above are specified.",
      ).optional(),
      createDisposition: z.string().describe(
        "Optional. Specifies whether the job is allowed to create new tables. The following values are supported: * CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. * CREATE_NEVER: The table must already exist. If it does not, a 'notFound' error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      createSession: z.boolean().describe(
        "Optional. If this property is true, the job creates a new session using a randomly generated session_id. To continue using a created session with subsequent queries, pass the existing session identifier as a `ConnectionProperty` value. The session identifier is returned as part of the `SessionInfo` message within the query statistics. The new session's location will be set to `Job.JobReference.location` if it is present, otherwise it's set to the default location based on existing routing logic.",
      ).optional(),
      dateFormat: z.string().describe(
        "Optional. Date format used for parsing DATE values.",
      ).optional(),
      datetimeFormat: z.string().describe(
        "Optional. Date format used for parsing DATETIME values.",
      ).optional(),
      decimalTargetTypes: z.array(
        z.enum([
          "DECIMAL_TARGET_TYPE_UNSPECIFIED",
          "NUMERIC",
          "BIGNUMERIC",
          "STRING",
        ]),
      ).describe(
        'Defines the list of possible SQL data types to which the source decimal values are converted. This list and the precision and the scale parameters of the decimal field determine the target type. In the order of NUMERIC, BIGNUMERIC, and STRING, a type is picked if it is in the specified list and if it supports the precision and the scale. STRING supports all precision and scale values. If none of the listed types supports the precision and the scale, the type supporting the widest range in the specified list is picked, and if a value exceeds the supported range when reading the data, an error will be thrown. Example: Suppose the value of this field is ["NUMERIC", "BIGNUMERIC"]. If (precision,scale) is: * (38,9) -> NUMERIC; * (39,9) -> BIGNUMERIC (NUMERIC cannot hold 30 integer digits); * (38,10) -> BIGNUMERIC (NUMERIC cannot hold 10 fractional digits); * (76,38) -> BIGNUMERIC; * (77,38) -> BIGNUMERIC (error if value exceeds supported range). This field cannot contain duplicate types. The order of the types in this field is ignored. For example, ["BIGNUMERIC", "NUMERIC"] is the same as ["NUMERIC", "BIGNUMERIC"] and NUMERIC always takes precedence over BIGNUMERIC. Defaults to ["NUMERIC", "STRING"] for ORC and ["NUMERIC"] for the other file formats.',
      ).optional(),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string().describe(
          "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
        ).optional(),
      }).describe("Custom encryption configuration (e.g., Cloud KMS keys)")
        .optional(),
      destinationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("[Required] The destination table to load the data into.")
        .optional(),
      destinationTableProperties: z.object({
        description: z.string().describe(
          "Optional. The description for the destination table. This will only be used if the destination table is newly created. If the table already exists and a value different than the current description is provided, the job will fail.",
        ).optional(),
        expirationTime: z.string().describe("Internal use only.").optional(),
        friendlyName: z.string().describe(
          "Optional. Friendly name for the destination table. If the table already exists, it should be same as the existing friendly name.",
        ).optional(),
        labels: z.record(z.string(), z.string()).describe(
          "Optional. The labels associated with this table. You can use these to organize and group your tables. This will only be used if the destination table is newly created. If the table already exists and labels are different than the current labels are provided, the job will fail.",
        ).optional(),
      }).describe(
        "Optional. [Experimental] Properties with which to create the destination table if it is new.",
      ).optional(),
      encoding: z.string().describe(
        "Optional. The character encoding of the data. The supported values are UTF-8, ISO-8859-1, UTF-16BE, UTF-16LE, UTF-32BE, and UTF-32LE. The default value is UTF-8. BigQuery decodes the data after the raw, binary data has been split using the values of the `quote` and `fieldDelimiter` properties. If you don't specify an encoding, or if you specify a UTF-8 encoding when the CSV file is not UTF-8 encoded, BigQuery attempts to convert the data to UTF-8. Generally, your data loads successfully, but it may not match byte-for-byte what you expect. To avoid this, specify the correct encoding by using the `--encoding` flag. If BigQuery can't convert a character other than the ASCII `0` character, BigQuery converts the character to the standard Unicode replacement character: �.",
      ).optional(),
      fieldDelimiter: z.string().describe(
        'Optional. The separator character for fields in a CSV file. The separator is interpreted as a single byte. For files encoded in ISO-8859-1, any single character can be used as a separator. For files encoded in UTF-8, characters represented in decimal range 1-127 (U+0001-U+007F) can be used without any modification. UTF-8 characters encoded with multiple bytes (i.e. U+0080 and above) will have only the first byte used for separating fields. The remaining bytes will be treated as a part of the field. BigQuery also supports the escape sequence "\\t" (U+0009) to specify a tab separator. The default value is comma (",", U+002C).',
      ).optional(),
      fileSetSpecType: z.enum([
        "FILE_SET_SPEC_TYPE_FILE_SYSTEM_MATCH",
        "FILE_SET_SPEC_TYPE_NEW_LINE_DELIMITED_MANIFEST",
      ]).describe(
        "Optional. Specifies how source URIs are interpreted for constructing the file set to load. By default, source URIs are expanded against the underlying storage. You can also specify manifest files to control how the file set is constructed. This option is only applicable to object storage systems.",
      ).optional(),
      hivePartitioningOptions: z.object({
        fields: z.array(z.string()).describe(
          "Output only. For permanent external tables, this field is populated with the hive partition keys in the order they were inferred. The types of the partition keys can be deduced by checking the table schema (which will include the partition keys). Not every API will populate this field in the output. For example, Tables.Get will populate it, but Tables.List will not contain this field.",
        ).optional(),
        mode: z.string().describe(
          "Optional. When set, what mode of hive partitioning to use when reading data. The following modes are supported: * AUTO: automatically infer partition key name(s) and type(s). * STRINGS: automatically infer partition key name(s). All types are strings. * CUSTOM: partition key schema is encoded in the source URI prefix. Not all storage formats support hive partitioning. Requesting hive partitioning on an unsupported format will lead to an error. Currently supported formats are: JSON, CSV, ORC, Avro and Parquet.",
        ).optional(),
        requirePartitionFilter: z.boolean().describe(
          "Optional. If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. Note that this field should only be true when creating a permanent external table or querying a temporary external table. Hive-partitioned loads with require_partition_filter explicitly set to true will fail.",
        ).optional(),
        sourceUriPrefix: z.string().describe(
          "Optional. When hive partition detection is requested, a common prefix for all source uris must be required. The prefix must end immediately before the partition key encoding begins. For example, consider files following this data layout: gs://bucket/path_to_table/dt=2019-06-01/country=USA/id=7/file.avro gs://bucket/path_to_table/dt=2019-05-31/country=CA/id=3/file.avro When hive partitioning is requested with either AUTO or STRINGS detection, the common prefix can be either of gs://bucket/path_to_table or gs://bucket/path_to_table/. CUSTOM detection requires encoding the partitioning schema immediately after the common prefix. For CUSTOM, any of * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:STRING}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:STRING} would all be valid source URI prefixes.",
        ).optional(),
      }).describe(
        "Optional. When set, configures hive partitioning support. Not all storage formats support hive partitioning -- requesting hive partitioning on an unsupported format will lead to an error, as will providing an invalid specification.",
      ).optional(),
      ignoreUnknownValues: z.boolean().describe(
        "Optional. Indicates if BigQuery should allow extra values that are not represented in the table schema. If true, the extra values are ignored. If false, records with extra columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. The sourceFormat property determines what BigQuery treats as an extra value: CSV: Trailing columns JSON: Named values that don't match any column names in the table schema Avro, Parquet, ORC: Fields in the file schema that don't exist in the table schema.",
      ).optional(),
      jsonExtension: z.enum(["JSON_EXTENSION_UNSPECIFIED", "GEOJSON"]).describe(
        "Optional. Load option to be used together with source_format newline-delimited JSON to indicate that a variant of JSON is being loaded. To load newline-delimited GeoJSON, specify GEOJSON (and source_format must be set to NEWLINE_DELIMITED_JSON).",
      ).optional(),
      maxBadRecords: z.number().int().describe(
        "Optional. The maximum number of bad records that BigQuery can ignore when running the job. If the number of bad records exceeds this value, an invalid error is returned in the job result. The default value is 0, which requires that all records are valid. This is only supported for CSV and NEWLINE_DELIMITED_JSON file formats.",
      ).optional(),
      nullMarker: z.string().describe(
        'Optional. Specifies a string that represents a null value in a CSV file. For example, if you specify "\\N", BigQuery interprets "\\N" as a null value when loading a CSV file. The default value is the empty string. If you set this property to a custom value, BigQuery throws an error if an empty string is present for all data types except for STRING and BYTE. For STRING and BYTE columns, BigQuery interprets the empty string as an empty value.',
      ).optional(),
      nullMarkers: z.array(z.string()).describe(
        "Optional. A list of strings represented as SQL NULL value in a CSV file. null_marker and null_markers can't be set at the same time. If null_marker is set, null_markers has to be not set. If null_markers is set, null_marker has to be not set. If both null_marker and null_markers are set at the same time, a user error would be thrown. Any strings listed in null_markers, including empty string would be interpreted as SQL NULL. This applies to all column types.",
      ).optional(),
      parquetOptions: z.object({
        enableListInference: z.boolean().describe(
          "Optional. Indicates whether to use schema inference specifically for Parquet LIST logical type.",
        ).optional(),
        enumAsString: z.boolean().describe(
          "Optional. Indicates whether to infer Parquet ENUM logical type as STRING instead of BYTES by default.",
        ).optional(),
        mapTargetType: z.enum([
          "MAP_TARGET_TYPE_UNSPECIFIED",
          "ARRAY_OF_STRUCT",
        ]).describe(
          "Optional. Indicates how to represent a Parquet map if present.",
        ).optional(),
      }).describe(
        "Optional. Additional properties to set if sourceFormat is set to PARQUET.",
      ).optional(),
      preserveAsciiControlCharacters: z.boolean().describe(
        "Optional. When sourceFormat is set to \"CSV\", this indicates whether the embedded ASCII control characters (the first 32 characters in the ASCII-table, from '\\x00' to '\\x1F') are preserved.",
      ).optional(),
      projectionFields: z.array(z.string()).describe(
        'If sourceFormat is set to "DATASTORE_BACKUP", indicates which entity properties to load into BigQuery from a Cloud Datastore backup. Property names are case sensitive and must be top-level properties. If no properties are specified, BigQuery loads all properties. If any named property isn\'t found in the Cloud Datastore backup, an invalid error is returned in the job result.',
      ).optional(),
      quote: z.string().regex(new RegExp(".?")).describe(
        "Optional. The value that is used to quote data sections in a CSV file. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. The default value is a double-quote ('\"'). If your data does not contain quoted sections, set the property value to an empty string. If your data contains quoted newline characters, you must also set the allowQuotedNewlines property to true. To include the specific quote character within a quoted value, precede it with an additional matching quote character. For example, if you want to escape the default character ' \" ', use ' \"\" '. @default \"",
      ).optional(),
      rangePartitioning: z.object({
        field: z.string().describe(
          "Required. The name of the column to partition the table on. It must be a top-level, INT64 column whose mode is NULLABLE or REQUIRED.",
        ).optional(),
        range: z.object({
          end: z.string().describe(
            "[Experimental] The end of range partitioning, exclusive.",
          ).optional(),
          interval: z.string().describe(
            "[Experimental] The width of each interval.",
          ).optional(),
          start: z.string().describe(
            "[Experimental] The start of range partitioning, inclusive.",
          ).optional(),
        }).describe("[Experimental] Defines the ranges for range partitioning.")
          .optional(),
      }).describe(
        "Range partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      referenceFileSchemaUri: z.string().describe(
        "Optional. The user can provide a reference file with the reader schema. This file is only loaded if it is part of source URIs, but is not loaded otherwise. It is enabled for the following formats: AVRO, PARQUET, ORC.",
      ).optional(),
      schema: z.object({
        fields: z.array(z.object({
          categories: z.unknown().describe("Deprecated.").optional(),
          collation: z.unknown().describe(
            "Optional. Field collation can be set only when the type of field is STRING. The following values are supported: * 'und:ci': undetermined locale, case insensitive. * '': empty string. Default to case-sensitive behavior.",
          ).optional(),
          dataGovernanceTagsInfo: z.unknown().describe(
            "Optional. Specifies the data governance tags on this field. This field works with other column-level security fields as follows: * **Precedence**: If a data governance tag is attached to a column, it takes precedence over the policy tag attached to the column. However, if a data policy is attached to a column, it takes precedence over the data governance tag. * **Patching behavior**: Describes how this field behaves during a `Table.patch` schema update: * **Unset**: If the `data_governance_tags_info` field is omitted from the update request, the existing tags on the column are preserved. * **Empty Field**: To clear data governance tags from a column, send the `data_governance_tags_info` field as an empty object. This removes all tags from the column. * **Updating tags**: To replace an existing tag, send the field with the new tag.",
          ).optional(),
          dataPolicies: z.unknown().describe(
            "Optional. Data policies attached to this field, used for field-level access control.",
          ).optional(),
          dataPolicyList: z.unknown().describe(
            "Optional. Specifies data policies attached to this field, used for field-level access control. When set, this will be the source of truth for data policy information.",
          ).optional(),
          defaultValueExpression: z.unknown().describe(
            "Optional. A SQL expression to specify the [default value] (https://cloud.google.com/bigquery/docs/default-values) for this field.",
          ).optional(),
          description: z.unknown().describe(
            "Optional. The field description. The maximum length is 1,024 characters.",
          ).optional(),
          fields: z.unknown().describe(
            "Optional. Describes the nested schema fields if the type property is set to RECORD.",
          ).optional(),
          foreignTypeDefinition: z.unknown().describe(
            "Optional. Definition of the foreign data type. Only valid for top-level schema fields (not nested fields). If the type is FOREIGN, this field is required.",
          ).optional(),
          generatedColumn: z.unknown().describe(
            "Optional. Definition of how values are generated for the field. Only valid for top-level schema fields (not nested fields).",
          ).optional(),
          maxLength: z.unknown().describe(
            'Optional. Maximum length of values of this field for STRINGS or BYTES. If max_length is not specified, no maximum length constraint is imposed on this field. If type = "STRING", then max_length represents the maximum UTF-8 length of strings in this field. If type = "BYTES", then max_length represents the maximum number of bytes in this field. It is invalid to set this field if type ≠ "STRING" and ≠ "BYTES".',
          ).optional(),
          mode: z.unknown().describe(
            "Optional. The field mode. Possible values include NULLABLE, REQUIRED and REPEATED. The default value is NULLABLE.",
          ).optional(),
          name: z.unknown().describe(
            "Required. The field name. The name must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_), and must start with a letter or underscore. The maximum length is 300 characters.",
          ).optional(),
          policyTags: z.unknown().describe(
            "Optional. The policy tags attached to this field, used for field-level access control. If not set, defaults to empty policy_tags.",
          ).optional(),
          precision: z.unknown().describe(
            'Optional. Precision (maximum number of total digits in base 10) and scale (maximum number of digits in the fractional part in base 10) constraints for values of this field for NUMERIC or BIGNUMERIC. It is invalid to set precision or scale if type ≠ "NUMERIC" and ≠ "BIGNUMERIC". If precision and scale are not specified, no value range constraint is imposed on this field insofar as values are permitted by the type. Values of this NUMERIC or BIGNUMERIC field must be in this range when: * Precision (P) and scale (S) are specified: [-10P-S + 10-S, 10P-S - 10-S] * Precision (P) is specified but not scale (and thus scale is interpreted to be equal to zero): [-10P + 1, 10P - 1]. Acceptable values for precision and scale if both are specified: * If type = "NUMERIC": 1 ≤ precision - scale ≤ 29 and 0 ≤ scale ≤ 9. * If type = "BIGNUMERIC": 1 ≤ precision - scale ≤ 38 and 0 ≤ scale ≤ 38. Acceptable values for precision if only precision is specified but not scale (and thus scale is interpreted to be equal to zero): * If type = "NUMERIC": 1 ≤ precision ≤ 29. * If type = "BIGNUMERIC": 1 ≤ precision ≤ 38. If scale is specified but not precision, then it is invalid.',
          ).optional(),
          rangeElementType: z.unknown().describe(
            "Represents the type of a field element.",
          ).optional(),
          roundingMode: z.unknown().describe(
            "Optional. Specifies the rounding mode to be used when storing values of NUMERIC and BIGNUMERIC type.",
          ).optional(),
          scale: z.unknown().describe(
            "Optional. See documentation for precision.",
          ).optional(),
          timestampPrecision: z.unknown().describe(
            "Optional. Precision (maximum number of total digits in base 10) for seconds of TIMESTAMP type. Possible values include: * 6 (Default, for TIMESTAMP type with microsecond precision) * 12 (For TIMESTAMP type with picosecond precision)",
          ).optional(),
          type: z.unknown().describe(
            "Required. The field data type. Possible values include: * STRING * BYTES * INTEGER (or INT64) * FLOAT (or FLOAT64) * BOOLEAN (or BOOL) * TIMESTAMP * DATE * TIME * DATETIME * GEOGRAPHY * NUMERIC * BIGNUMERIC * JSON * RECORD (or STRUCT) * RANGE Use of RECORD/STRUCT indicates that the field contains a nested schema.",
          ).optional(),
        })).describe("Describes the fields in a table.").optional(),
        foreignTypeInfo: z.object({
          typeSystem: z.enum(["TYPE_SYSTEM_UNSPECIFIED", "HIVE"]).describe(
            "Required. Specifies the system which defines the foreign data type.",
          ).optional(),
        }).describe(
          "Optional. Specifies metadata of the foreign data type definition in field schema (TableFieldSchema.foreign_type_definition).",
        ).optional(),
      }).describe(
        "Optional. The schema for the destination table. The schema can be omitted if the destination table already exists, or if you're loading data from Google Cloud Datastore.",
      ).optional(),
      schemaInline: z.string().describe(
        '[Deprecated] The inline schema. For CSV schemas, specify as "Field1:Type1[,Field2:Type2]*". For example, "foo:STRING, bar:INTEGER, baz:FLOAT".',
      ).optional(),
      schemaInlineFormat: z.string().describe(
        "[Deprecated] The format of the schemaInline property.",
      ).optional(),
      schemaUpdateOptions: z.array(z.string()).describe(
        "Allows the schema of the destination table to be updated as a side effect of the load job if a schema is autodetected or supplied in the job configuration. Schema update options are supported in three cases: when writeDisposition is WRITE_APPEND; when writeDisposition is WRITE_TRUNCATE_DATA; when writeDisposition is WRITE_TRUNCATE and the destination table is a partition of a table, specified by partition decorators. For normal tables, WRITE_TRUNCATE will always overwrite the schema. One or more of the following values are specified: * ALLOW_FIELD_ADDITION: allow adding a nullable field to the schema. * ALLOW_FIELD_RELAXATION: allow relaxing a required field in the original schema to nullable.",
      ).optional(),
      skipLeadingRows: z.number().int().describe(
        "Optional. The number of rows at the top of a CSV file that BigQuery will skip when loading the data. The default value is 0. This property is useful if you have header rows in the file that should be skipped. When autodetect is on, the behavior is the following: * skipLeadingRows unspecified - Autodetect tries to detect headers in the first row. If they are not detected, the row is read as data. Otherwise data is read starting from the second row. * skipLeadingRows is 0 - Instructs autodetect that there are no headers and data should be read starting from the first row. * skipLeadingRows = N > 0 - Autodetect skips N-1 rows and tries to detect headers in row N. If headers are not detected, row N is just skipped. Otherwise row N is used to extract column names for the detected schema.",
      ).optional(),
      sourceColumnMatch: z.enum([
        "SOURCE_COLUMN_MATCH_UNSPECIFIED",
        "POSITION",
        "NAME",
      ]).describe(
        "Optional. Controls the strategy used to match loaded columns to the schema. If not set, a sensible default is chosen based on how the schema is provided. If autodetect is used, then columns are matched by name. Otherwise, columns are matched by position. This is done to keep the behavior backward-compatible.",
      ).optional(),
      sourceFormat: z.string().describe(
        'Optional. The format of the data files. For CSV files, specify "CSV". For datastore backups, specify "DATASTORE_BACKUP". For newline-delimited JSON, specify "NEWLINE_DELIMITED_JSON". For Avro, specify "AVRO". For parquet, specify "PARQUET". For orc, specify "ORC". The default value is CSV.',
      ).optional(),
      sourceUris: z.array(z.string()).describe(
        "[Required] The fully-qualified URIs that point to your data in Google Cloud. For Google Cloud Storage URIs: Each URI can contain one '*' wildcard character and it must come after the 'bucket' name. Size limits related to load jobs apply to external data sources. For Google Cloud Bigtable URIs: Exactly one URI can be specified and it has be a fully specified and valid HTTPS URL for a Google Cloud Bigtable table. For Google Cloud Datastore backups: Exactly one URI can be specified. Also, the '*' wildcard character is not allowed.",
      ).optional(),
      timeFormat: z.string().describe(
        "Optional. Date format used for parsing TIME values.",
      ).optional(),
      timePartitioning: z.object({
        expirationMs: z.string().describe(
          "Optional. Number of milliseconds for which to keep the storage for a partition. A wrapper is used here because 0 is an invalid value.",
        ).optional(),
        field: z.string().describe(
          "Optional. If not set, the table is partitioned by pseudo column '_PARTITIONTIME'; if set, the table is partitioned by this field. The field must be a top-level TIMESTAMP or DATE field. Its mode must be NULLABLE or REQUIRED. A wrapper is used here because an empty string is an invalid value.",
        ).optional(),
        requirePartitionFilter: z.boolean().describe(
          "If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. This field is deprecated; please set the field with the same name on the table itself instead. This field needs a wrapper because we want to output the default value, false, if the user explicitly set it.",
        ).optional(),
        type: z.string().describe(
          "Required. The supported types are DAY, HOUR, MONTH, and YEAR, which will generate one partition per day, hour, month, and year, respectively.",
        ).optional(),
      }).describe(
        "Time-based partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      timeZone: z.string().describe(
        "Optional. Default time zone that will apply when parsing timestamp values that have no specific time zone.",
      ).optional(),
      timestampFormat: z.string().describe(
        "Optional. Date format used for parsing TIMESTAMP values.",
      ).optional(),
      timestampTargetPrecision: z.array(z.number().int()).describe(
        "Precisions (maximum number of total digits in base 10) for seconds of TIMESTAMP types that are allowed to the destination table for autodetection mode. Available for the formats: CSV, PARQUET, AVRO, and Iceberg External Table. Possible values include: Not Specified, [], or [6]: timestamp(6) for all auto detected TIMESTAMP columns [6, 12]: timestamp(6) for all auto detected TIMESTAMP columns that have less than 6 digits of subseconds. timestamp(12) for all auto detected TIMESTAMP columns that have more than 6 digits of subseconds. [12]: timestamp(12) for all auto detected TIMESTAMP columns. The order of the elements in this array is ignored. Inputs that have higher precision than the highest target precision in this array will be truncated.",
      ).optional(),
      useAvroLogicalTypes: z.boolean().describe(
        'Optional. If sourceFormat is set to "AVRO", indicates whether to interpret logical types as the corresponding BigQuery data type (for example, TIMESTAMP), instead of using the raw type (for example, INTEGER).',
      ).optional(),
      writeDisposition: z.string().describe(
        "Optional. Specifies the action that occurs if the destination table already exists. The following values are supported: * WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the data, removes the constraints and uses the schema from the load job. * WRITE_TRUNCATE_DATA: If the table already exists, BigQuery overwrites the data, but keeps the constraints and schema of the existing table. * WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. * WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result. The default value is WRITE_APPEND. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
    }).describe("[Pick one] Configures a load job.").optional(),
    maxSlots: z.number().int().describe(
      "Optional. A target limit on the rate of slot consumption by this job. If set to a value > 0, BigQuery will attempt to limit the rate of slot consumption by this job to keep it below the configured limit, even if the job is eligible for more slots based on fair scheduling. The unused slots will be available for other jobs and queries to use. Note: This feature is not yet generally available.",
    ).optional(),
    query: z.object({
      allowLargeResults: z.boolean().describe(
        "Optional. If true and query uses legacy SQL dialect, allows the query to produce arbitrarily large result tables at a slight cost in performance. Requires destinationTable to be set. For GoogleSQL queries, this flag is ignored and large results are always allowed. However, you must still set destinationTable when result size exceeds the allowed maximum response size.",
      ).optional(),
      clustering: z.object({
        fields: z.array(z.string()).describe(
          "One or more fields on which data should be clustered. Only top-level, non-repeated, simple-type fields are supported. The ordering of the clustering fields should be prioritized from most to least important for filtering purposes. For additional information, see [Introduction to clustered tables](https://cloud.google.com/bigquery/docs/clustered-tables#limitations).",
        ).optional(),
      }).describe("Clustering specification for the destination table.")
        .optional(),
      connectionProperties: z.array(z.object({
        key: z.string().describe("The key of the property to set.").optional(),
        value: z.string().describe("The value of the property to set.")
          .optional(),
      })).describe("Connection properties which can modify the query behavior.")
        .optional(),
      continuous: z.boolean().describe(
        "[Optional] Specifies whether the query should be executed as a continuous query. The default value is false.",
      ).optional(),
      createDisposition: z.string().describe(
        "Optional. Specifies whether the job is allowed to create new tables. The following values are supported: * CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. * CREATE_NEVER: The table must already exist. If it does not, a 'notFound' error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      createSession: z.boolean().describe(
        "If this property is true, the job creates a new session using a randomly generated session_id. To continue using a created session with subsequent queries, pass the existing session identifier as a `ConnectionProperty` value. The session identifier is returned as part of the `SessionInfo` message within the query statistics. The new session's location will be set to `Job.JobReference.location` if it is present, otherwise it's set to the default location based on existing routing logic.",
      ).optional(),
      defaultDataset: z.object({
        datasetId: z.string().describe(
          "Required. A unique ID for this dataset, without the project name. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.",
        ).optional(),
        projectId: z.string().describe(
          "Optional. The ID of the project containing this dataset.",
        ).optional(),
      }).describe(
        "Optional. Specifies the default dataset to use for unqualified table names in the query. This setting does not alter behavior of unqualified dataset names. Setting the system variable `@@dataset_id` achieves the same behavior. See https://cloud.google.com/bigquery/docs/reference/system-variables for more information on system variables.",
      ).optional(),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string().describe(
          "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
        ).optional(),
      }).describe("Custom encryption configuration (e.g., Cloud KMS keys)")
        .optional(),
      destinationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe(
        "Optional. Describes the table where the query results should be stored. This property must be set for large results that exceed the maximum response size. For queries that produce anonymous (cached) results, this field will be populated by BigQuery.",
      ).optional(),
      flattenResults: z.boolean().describe(
        "Optional. If true and query uses legacy SQL dialect, flattens all nested and repeated fields in the query results. allowLargeResults must be true if this is set to false. For GoogleSQL queries, this flag is ignored and results are never flattened.",
      ).optional(),
      maximumBillingTier: z.number().int().describe(
        "Optional. [Deprecated] Maximum billing tier allowed for this query. The billing tier controls the amount of compute resources allotted to the query, and multiplies the on-demand cost of the query accordingly. A query that runs within its allotted resources will succeed and indicate its billing tier in statistics.query.billingTier, but if the query exceeds its allotted resources, it will fail with billingTierLimitExceeded. WARNING: The billed byte amount can be multiplied by an amount up to this number! Most users should not need to alter this setting, and we recommend that you avoid introducing new uses of it.",
      ).optional(),
      maximumBytesBilled: z.string().describe(
        "Limits the bytes billed for this job. Queries that will have bytes billed beyond this limit will fail (without incurring a charge). If unspecified, this will be set to your project default.",
      ).optional(),
      parameterMode: z.string().describe(
        "GoogleSQL only. Set to POSITIONAL to use positional (?) query parameters or to NAMED to use named (@myparam) query parameters in this query.",
      ).optional(),
      preserveNulls: z.boolean().describe(
        "[Deprecated] This property is deprecated.",
      ).optional(),
      priority: z.string().describe(
        "Optional. Specifies a priority for the query. Possible values include INTERACTIVE and BATCH. The default value is INTERACTIVE.",
      ).optional(),
      query: z.string().describe(
        "[Required] SQL query text to execute. The useLegacySql field can be used to indicate whether the query uses legacy SQL or GoogleSQL.",
      ).optional(),
      queryParameters: z.array(z.object({
        name: z.string().describe(
          "Optional. If unset, this is a positional parameter. Otherwise, should be unique within a query.",
        ).optional(),
        parameterType: z.object({
          arrayType: z.unknown().describe(
            "Circular reference to QueryParameterType",
          ).optional(),
          rangeElementType: z.unknown().describe(
            "Circular reference to QueryParameterType",
          ).optional(),
          structTypes: z.unknown().describe(
            "Optional. The types of the fields of this struct, in order, if this is a struct.",
          ).optional(),
          timestampPrecision: z.unknown().describe(
            "Optional. Precision (maximum number of total digits in base 10) for seconds of TIMESTAMP type. Possible values include: * 6 (Default, for TIMESTAMP type with microsecond precision) * 12 (For TIMESTAMP type with picosecond precision)",
          ).optional(),
          type: z.unknown().describe(
            "Required. The top level type of this field.",
          ).optional(),
        }).describe("Required. The type of this parameter.").optional(),
        parameterValue: z.object({
          arrayValues: z.unknown().describe(
            "Optional. The array values, if this is an array type.",
          ).optional(),
          rangeValue: z.unknown().describe(
            "Optional. The range value, if this is a range type.",
          ).optional(),
          structValues: z.unknown().describe("The struct field values.")
            .optional(),
          value: z.unknown().describe(
            "Optional. The value of this value, if a simple scalar type.",
          ).optional(),
        }).describe("Required. The value of this parameter.").optional(),
      })).describe("Query parameters for GoogleSQL queries.").optional(),
      rangePartitioning: z.object({
        field: z.string().describe(
          "Required. The name of the column to partition the table on. It must be a top-level, INT64 column whose mode is NULLABLE or REQUIRED.",
        ).optional(),
        range: z.object({
          end: z.string().describe(
            "[Experimental] The end of range partitioning, exclusive.",
          ).optional(),
          interval: z.string().describe(
            "[Experimental] The width of each interval.",
          ).optional(),
          start: z.string().describe(
            "[Experimental] The start of range partitioning, inclusive.",
          ).optional(),
        }).describe("[Experimental] Defines the ranges for range partitioning.")
          .optional(),
      }).describe(
        "Range partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      schemaUpdateOptions: z.array(z.string()).describe(
        "Allows the schema of the destination table to be updated as a side effect of the query job. Schema update options are supported in three cases: when writeDisposition is WRITE_APPEND; when writeDisposition is WRITE_TRUNCATE_DATA; when writeDisposition is WRITE_TRUNCATE and the destination table is a partition of a table, specified by partition decorators. For normal tables, WRITE_TRUNCATE will always overwrite the schema. One or more of the following values are specified: * ALLOW_FIELD_ADDITION: allow adding a nullable field to the schema. * ALLOW_FIELD_RELAXATION: allow relaxing a required field in the original schema to nullable.",
      ).optional(),
      scriptOptions: z.object({
        keyResultStatement: z.enum([
          "KEY_RESULT_STATEMENT_KIND_UNSPECIFIED",
          "LAST",
          "FIRST_SELECT",
        ]).describe(
          'Determines which statement in the script represents the "key result", used to populate the schema and query results of the script job. Default is LAST.',
        ).optional(),
        statementByteBudget: z.string().describe(
          "Limit on the number of bytes billed per statement. Exceeding this budget results in an error.",
        ).optional(),
        statementTimeoutMs: z.string().describe(
          "Timeout period for each statement in a script.",
        ).optional(),
      }).describe("Options controlling the execution of scripts.").optional(),
      systemVariables: z.object({
        types: z.record(
          z.string(),
          z.object({
            arrayElementType: z.unknown().describe(
              "Circular reference to StandardSqlDataType",
            ).optional(),
            rangeElementType: z.unknown().describe(
              "Circular reference to StandardSqlDataType",
            ).optional(),
            structType: z.unknown().describe(
              'The fields of this struct, in order, if type_kind = "STRUCT".',
            ).optional(),
            typeKind: z.unknown().describe(
              'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
            ).optional(),
          }),
        ).describe("Output only. Data type for each system variable.")
          .optional(),
        values: z.record(z.string(), z.string()).describe(
          "Output only. Value for each system variable.",
        ).optional(),
      }).describe(
        'Output only. System variables for GoogleSQL queries. A system variable is output if the variable is settable and its value differs from the system default. "@@" prefix is not included in the name of the System variables.',
      ).optional(),
      tableDefinitions: z.record(
        z.string(),
        z.object({
          autodetect: z.boolean().describe(
            "Try to detect schema and format options automatically. Any option specified explicitly will be honored.",
          ).optional(),
          avroOptions: z.object({
            useAvroLogicalTypes: z.unknown().describe(
              'Optional. If sourceFormat is set to "AVRO", indicates whether to interpret logical types as the corresponding BigQuery data type (for example, TIMESTAMP), instead of using the raw type (for example, INTEGER).',
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to AVRO.",
          ).optional(),
          bigtableOptions: z.object({
            columnFamilies: z.unknown().describe(
              "Optional. List of column families to expose in the table schema along with their types. This list restricts the column families that can be referenced in queries and specifies their value types. You can use this list to do type conversions - see the 'type' field for more details. If you leave this list empty, all column families are present in the table schema and their values are read as BYTES. During a query only the column families referenced in that query are read from Bigtable.",
            ).optional(),
            ignoreUnspecifiedColumnFamilies: z.unknown().describe(
              "Optional. If field is true, then the column families that are not specified in columnFamilies list are not exposed in the table schema. Otherwise, they are read with BYTES type values. The default value is false.",
            ).optional(),
            outputColumnFamiliesAsJson: z.unknown().describe(
              "Optional. If field is true, then each column family will be read as a single JSON column. Otherwise they are read as a repeated cell structure containing timestamp/value tuples. The default value is false.",
            ).optional(),
            readRowkeyAsString: z.unknown().describe(
              "Optional. If field is true, then the rowkey column families will be read and converted to string. Otherwise they are read with BYTES type values and users need to manually cast them with CAST if necessary. The default value is false.",
            ).optional(),
          }).describe(
            "Optional. Additional options if sourceFormat is set to BIGTABLE.",
          ).optional(),
          compression: z.string().describe(
            "Optional. The compression type of the data source. Possible values include GZIP and NONE. The default value is NONE. This setting is ignored for Google Cloud Bigtable, Google Cloud Datastore backups, Avro, ORC and Parquet formats. An empty string is an invalid value.",
          ).optional(),
          connectionId: z.string().describe(
            "Optional. The connection specifying the credentials to be used to read external storage, such as Azure Blob, Cloud Storage, or S3. The connection_id can have the form `{project_id}.{location_id};{connection_id}` or `projects/{project_id}/locations/{location_id}/connections/{connection_id}`.",
          ).optional(),
          csvOptions: z.object({
            allowJaggedRows: z.unknown().describe(
              "Optional. Indicates if BigQuery should accept rows that are missing trailing optional columns. If true, BigQuery treats missing trailing columns as null values. If false, records with missing trailing columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false.",
            ).optional(),
            allowQuotedNewlines: z.unknown().describe(
              "Optional. Indicates if BigQuery should allow quoted data sections that contain newline characters in a CSV file. The default value is false.",
            ).optional(),
            encoding: z.unknown().describe(
              "Optional. The character encoding of the data. The supported values are UTF-8, ISO-8859-1, UTF-16BE, UTF-16LE, UTF-32BE, and UTF-32LE. The default value is UTF-8. BigQuery decodes the data after the raw, binary data has been split using the values of the quote and fieldDelimiter properties.",
            ).optional(),
            fieldDelimiter: z.unknown().describe(
              'Optional. The separator character for fields in a CSV file. The separator is interpreted as a single byte. For files encoded in ISO-8859-1, any single character can be used as a separator. For files encoded in UTF-8, characters represented in decimal range 1-127 (U+0001-U+007F) can be used without any modification. UTF-8 characters encoded with multiple bytes (i.e. U+0080 and above) will have only the first byte used for separating fields. The remaining bytes will be treated as a part of the field. BigQuery also supports the escape sequence "\\t" (U+0009) to specify a tab separator. The default value is comma (",", U+002C).',
            ).optional(),
            nullMarker: z.unknown().describe(
              'Optional. Specifies a string that represents a null value in a CSV file. For example, if you specify "\\N", BigQuery interprets "\\N" as a null value when querying a CSV file. The default value is the empty string. If you set this property to a custom value, BigQuery throws an error if an empty string is present for all data types except for STRING and BYTE. For STRING and BYTE columns, BigQuery interprets the empty string as an empty value.',
            ).optional(),
            nullMarkers: z.unknown().describe(
              "Optional. A list of strings represented as SQL NULL value in a CSV file. null_marker and null_markers can't be set at the same time. If null_marker is set, null_markers has to be not set. If null_markers is set, null_marker has to be not set. If both null_marker and null_markers are set at the same time, a user error would be thrown. Any strings listed in null_markers, including empty string would be interpreted as SQL NULL. This applies to all column types.",
            ).optional(),
            preserveAsciiControlCharacters: z.unknown().describe(
              "Optional. Indicates if the embedded ASCII control characters (the first 32 characters in the ASCII-table, from '\\x00' to '\\x1F') are preserved.",
            ).optional(),
            quote: z.unknown().describe(
              "Optional. The value that is used to quote data sections in a CSV file. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. The default value is a double-quote (\"). If your data does not contain quoted sections, set the property value to an empty string. If your data contains quoted newline characters, you must also set the allowQuotedNewlines property to true. To include the specific quote character within a quoted value, precede it with an additional matching quote character. For example, if you want to escape the default character ' \" ', use ' \"\" '.",
            ).optional(),
            skipLeadingRows: z.unknown().describe(
              "Optional. The number of rows at the top of a CSV file that BigQuery will skip when reading the data. The default value is 0. This property is useful if you have header rows in the file that should be skipped. When autodetect is on, the behavior is the following: * skipLeadingRows unspecified - Autodetect tries to detect headers in the first row. If they are not detected, the row is read as data. Otherwise data is read starting from the second row. * skipLeadingRows is 0 - Instructs autodetect that there are no headers and data should be read starting from the first row. * skipLeadingRows = N > 0 - Autodetect skips N-1 rows and tries to detect headers in row N. If headers are not detected, row N is just skipped. Otherwise row N is used to extract column names for the detected schema.",
            ).optional(),
            sourceColumnMatch: z.unknown().describe(
              "Optional. Controls the strategy used to match loaded columns to the schema. If not set, a sensible default is chosen based on how the schema is provided. If autodetect is used, then columns are matched by name. Otherwise, columns are matched by position. This is done to keep the behavior backward-compatible. Acceptable values are: POSITION - matches by position. This assumes that the columns are ordered the same way as the schema. NAME - matches by name. This reads the header row as column names and reorders columns to match the field names in the schema.",
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to CSV.",
          ).optional(),
          dateFormat: z.string().describe(
            "Optional. Format used to parse DATE values. Supports C-style and SQL-style values.",
          ).optional(),
          datetimeFormat: z.string().describe(
            "Optional. Format used to parse DATETIME values. Supports C-style and SQL-style values.",
          ).optional(),
          decimalTargetTypes: z.array(z.unknown()).describe(
            'Defines the list of possible SQL data types to which the source decimal values are converted. This list and the precision and the scale parameters of the decimal field determine the target type. In the order of NUMERIC, BIGNUMERIC, and STRING, a type is picked if it is in the specified list and if it supports the precision and the scale. STRING supports all precision and scale values. If none of the listed types supports the precision and the scale, the type supporting the widest range in the specified list is picked, and if a value exceeds the supported range when reading the data, an error will be thrown. Example: Suppose the value of this field is ["NUMERIC", "BIGNUMERIC"]. If (precision,scale) is: * (38,9) -> NUMERIC; * (39,9) -> BIGNUMERIC (NUMERIC cannot hold 30 integer digits); * (38,10) -> BIGNUMERIC (NUMERIC cannot hold 10 fractional digits); * (76,38) -> BIGNUMERIC; * (77,38) -> BIGNUMERIC (error if value exceeds supported range). This field cannot contain duplicate types. The order of the types in this field is ignored. For example, ["BIGNUMERIC", "NUMERIC"] is the same as ["NUMERIC", "BIGNUMERIC"] and NUMERIC always takes precedence over BIGNUMERIC. Defaults to ["NUMERIC", "STRING"] for ORC and ["NUMERIC"] for the other file formats.',
          ).optional(),
          fileSetSpecType: z.enum([
            "FILE_SET_SPEC_TYPE_FILE_SYSTEM_MATCH",
            "FILE_SET_SPEC_TYPE_NEW_LINE_DELIMITED_MANIFEST",
          ]).describe(
            "Optional. Specifies how source URIs are interpreted for constructing the file set to load. By default source URIs are expanded against the underlying storage. Other options include specifying manifest files. Only applicable to object storage systems.",
          ).optional(),
          googleSheetsOptions: z.object({
            range: z.unknown().describe(
              "Optional. Range of a sheet to query from. Only used when non-empty. Typical format: sheet_name!top_left_cell_id:bottom_right_cell_id For example: sheet1!A1:B20",
            ).optional(),
            skipLeadingRows: z.unknown().describe(
              "Optional. The number of rows at the top of a sheet that BigQuery will skip when reading the data. The default value is 0. This property is useful if you have header rows that should be skipped. When autodetect is on, the behavior is the following: * skipLeadingRows unspecified - Autodetect tries to detect headers in the first row. If they are not detected, the row is read as data. Otherwise data is read starting from the second row. * skipLeadingRows is 0 - Instructs autodetect that there are no headers and data should be read starting from the first row. * skipLeadingRows = N > 0 - Autodetect skips N-1 rows and tries to detect headers in row N. If headers are not detected, row N is just skipped. Otherwise row N is used to extract column names for the detected schema.",
            ).optional(),
          }).describe(
            "Optional. Additional options if sourceFormat is set to GOOGLE_SHEETS.",
          ).optional(),
          hivePartitioningOptions: z.object({
            fields: z.unknown().describe(
              "Output only. For permanent external tables, this field is populated with the hive partition keys in the order they were inferred. The types of the partition keys can be deduced by checking the table schema (which will include the partition keys). Not every API will populate this field in the output. For example, Tables.Get will populate it, but Tables.List will not contain this field.",
            ).optional(),
            mode: z.unknown().describe(
              "Optional. When set, what mode of hive partitioning to use when reading data. The following modes are supported: * AUTO: automatically infer partition key name(s) and type(s). * STRINGS: automatically infer partition key name(s). All types are strings. * CUSTOM: partition key schema is encoded in the source URI prefix. Not all storage formats support hive partitioning. Requesting hive partitioning on an unsupported format will lead to an error. Currently supported formats are: JSON, CSV, ORC, Avro and Parquet.",
            ).optional(),
            requirePartitionFilter: z.unknown().describe(
              "Optional. If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. Note that this field should only be true when creating a permanent external table or querying a temporary external table. Hive-partitioned loads with require_partition_filter explicitly set to true will fail.",
            ).optional(),
            sourceUriPrefix: z.unknown().describe(
              "Optional. When hive partition detection is requested, a common prefix for all source uris must be required. The prefix must end immediately before the partition key encoding begins. For example, consider files following this data layout: gs://bucket/path_to_table/dt=2019-06-01/country=USA/id=7/file.avro gs://bucket/path_to_table/dt=2019-05-31/country=CA/id=3/file.avro When hive partitioning is requested with either AUTO or STRINGS detection, the common prefix can be either of gs://bucket/path_to_table or gs://bucket/path_to_table/. CUSTOM detection requires encoding the partitioning schema immediately after the common prefix. For CUSTOM, any of * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:STRING}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:STRING} would all be valid source URI prefixes.",
            ).optional(),
          }).describe(
            "Optional. When set, configures hive partitioning support. Not all storage formats support hive partitioning -- requesting hive partitioning on an unsupported format will lead to an error, as will providing an invalid specification.",
          ).optional(),
          ignoreUnknownValues: z.boolean().describe(
            "Optional. Indicates if BigQuery should allow extra values that are not represented in the table schema. If true, the extra values are ignored. If false, records with extra columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. The sourceFormat property determines what BigQuery treats as an extra value: CSV: Trailing columns JSON: Named values that don't match any column names Google Cloud Bigtable: This setting is ignored. Google Cloud Datastore backups: This setting is ignored. Avro: This setting is ignored. ORC: This setting is ignored. Parquet: This setting is ignored.",
          ).optional(),
          jsonExtension: z.enum(["JSON_EXTENSION_UNSPECIFIED", "GEOJSON"])
            .describe(
              "Optional. Load option to be used together with source_format newline-delimited JSON to indicate that a variant of JSON is being loaded. To load newline-delimited GeoJSON, specify GEOJSON (and source_format must be set to NEWLINE_DELIMITED_JSON).",
            ).optional(),
          jsonOptions: z.object({
            encoding: z.unknown().describe(
              "Optional. The character encoding of the data. The supported values are UTF-8, UTF-16BE, UTF-16LE, UTF-32BE, and UTF-32LE. The default value is UTF-8.",
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to JSON.",
          ).optional(),
          maxBadRecords: z.number().int().describe(
            "Optional. The maximum number of bad records that BigQuery can ignore when reading data. If the number of bad records exceeds this value, an invalid error is returned in the job result. The default value is 0, which requires that all records are valid. This setting is ignored for Google Cloud Bigtable, Google Cloud Datastore backups, Avro, ORC and Parquet formats.",
          ).optional(),
          metadataCacheMode: z.enum([
            "METADATA_CACHE_MODE_UNSPECIFIED",
            "AUTOMATIC",
            "MANUAL",
          ]).describe(
            "Optional. Metadata Cache Mode for the table. Set this to enable caching of metadata from external data source.",
          ).optional(),
          objectMetadata: z.enum([
            "OBJECT_METADATA_UNSPECIFIED",
            "DIRECTORY",
            "SIMPLE",
          ]).describe(
            "Optional. ObjectMetadata is used to create Object Tables. Object Tables contain a listing of objects (with their metadata) found at the source_uris. If ObjectMetadata is set, source_format should be omitted. Currently SIMPLE is the only supported Object Metadata type.",
          ).optional(),
          parquetOptions: z.object({
            enableListInference: z.unknown().describe(
              "Optional. Indicates whether to use schema inference specifically for Parquet LIST logical type.",
            ).optional(),
            enumAsString: z.unknown().describe(
              "Optional. Indicates whether to infer Parquet ENUM logical type as STRING instead of BYTES by default.",
            ).optional(),
            mapTargetType: z.unknown().describe(
              "Optional. Indicates how to represent a Parquet map if present.",
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to PARQUET.",
          ).optional(),
          referenceFileSchemaUri: z.string().describe(
            "Optional. When creating an external table, the user can provide a reference file with the table schema. This is enabled for the following formats: AVRO, PARQUET, ORC.",
          ).optional(),
          schema: z.object({
            fields: z.unknown().describe("Describes the fields in a table.")
              .optional(),
            foreignTypeInfo: z.unknown().describe(
              "Optional. Specifies metadata of the foreign data type definition in field schema (TableFieldSchema.foreign_type_definition).",
            ).optional(),
          }).describe(
            "Optional. The schema for the data. Schema is required for CSV and JSON formats if autodetect is not on. Schema is disallowed for Google Cloud Bigtable, Cloud Datastore backups, Avro, ORC and Parquet formats.",
          ).optional(),
          sourceFormat: z.string().describe(
            '[Required] The data format. For CSV files, specify "CSV". For Google sheets, specify "GOOGLE_SHEETS". For newline-delimited JSON, specify "NEWLINE_DELIMITED_JSON". For Avro files, specify "AVRO". For Google Cloud Datastore backups, specify "DATASTORE_BACKUP". For Apache Iceberg tables, specify "ICEBERG". For ORC files, specify "ORC". For Parquet files, specify "PARQUET". [Beta] For Google Cloud Bigtable, specify "BIGTABLE".',
          ).optional(),
          sourceUris: z.array(z.unknown()).describe(
            "[Required] The fully-qualified URIs that point to your data in Google Cloud. For Google Cloud Storage URIs: Each URI can contain one '*' wildcard character and it must come after the 'bucket' name. Size limits related to load jobs apply to external data sources. For Google Cloud Bigtable URIs: Exactly one URI can be specified and it has be a fully specified and valid HTTPS URL for a Google Cloud Bigtable table. For Google Cloud Datastore backups, exactly one URI can be specified. Also, the '*' wildcard character is not allowed.",
          ).optional(),
          timeFormat: z.string().describe(
            "Optional. Format used to parse TIME values. Supports C-style and SQL-style values.",
          ).optional(),
          timeZone: z.string().describe(
            "Optional. Time zone used when parsing timestamp values that do not have specific time zone information (e.g. 2024-04-20 12:34:56). The expected format is a IANA timezone string (e.g. America/Los_Angeles).",
          ).optional(),
          timestampFormat: z.string().describe(
            "Optional. Format used to parse TIMESTAMP values. Supports C-style and SQL-style values.",
          ).optional(),
          timestampTargetPrecision: z.array(z.unknown()).describe(
            "Precisions (maximum number of total digits in base 10) for seconds of TIMESTAMP types that are allowed to the destination table for autodetection mode. Available for the formats: CSV, PARQUET, AVRO, and Iceberg External Table. Possible values include: Not Specified, [], or [6]: timestamp(6) for all auto detected TIMESTAMP columns [6, 12]: timestamp(6) for all auto detected TIMESTAMP columns that have less than 6 digits of subseconds. timestamp(12) for all auto detected TIMESTAMP columns that have more than 6 digits of subseconds. [12]: timestamp(12) for all auto detected TIMESTAMP columns. The order of the elements in this array is ignored. Inputs that have higher precision than the highest target precision in this array will be truncated.",
          ).optional(),
        }),
      ).describe(
        "Optional. You can specify external table definitions, which operate as ephemeral tables that can be queried. These definitions are configured using a JSON map, where the string key represents the table identifier, and the value is the corresponding external data configuration object.",
      ).optional(),
      timePartitioning: z.object({
        expirationMs: z.string().describe(
          "Optional. Number of milliseconds for which to keep the storage for a partition. A wrapper is used here because 0 is an invalid value.",
        ).optional(),
        field: z.string().describe(
          "Optional. If not set, the table is partitioned by pseudo column '_PARTITIONTIME'; if set, the table is partitioned by this field. The field must be a top-level TIMESTAMP or DATE field. Its mode must be NULLABLE or REQUIRED. A wrapper is used here because an empty string is an invalid value.",
        ).optional(),
        requirePartitionFilter: z.boolean().describe(
          "If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. This field is deprecated; please set the field with the same name on the table itself instead. This field needs a wrapper because we want to output the default value, false, if the user explicitly set it.",
        ).optional(),
        type: z.string().describe(
          "Required. The supported types are DAY, HOUR, MONTH, and YEAR, which will generate one partition per day, hour, month, and year, respectively.",
        ).optional(),
      }).describe(
        "Time-based partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      useLegacySql: z.boolean().describe(
        "Optional. Specifies whether to use BigQuery's legacy SQL dialect for this query. The default value is true. If set to false, the query uses BigQuery's [GoogleSQL](https://docs.cloud.google.com/bigquery/docs/introduction-sql). When useLegacySql is set to false, the value of flattenResults is ignored; query will be run as if flattenResults is false.",
      ).optional(),
      useQueryCache: z.boolean().describe(
        "Optional. Whether to look for the result in the query cache. The query cache is a best-effort cache that will be flushed whenever tables in the query are modified. Moreover, the query cache is only available when a query does not have a destination table specified. The default value is true.",
      ).optional(),
      userDefinedFunctionResources: z.array(z.object({
        inlineCode: z.string().describe(
          "[Pick one] An inline resource that contains code for a user-defined function (UDF). Providing a inline code resource is equivalent to providing a URI for a file containing the same code.",
        ).optional(),
        resourceUri: z.string().describe(
          "[Pick one] A code resource to load from a Google Cloud Storage URI (gs://bucket/path).",
        ).optional(),
      })).describe(
        "Describes user-defined function resources used in the query.",
      ).optional(),
      writeDisposition: z.string().describe(
        "Optional. Specifies the action that occurs if the destination table already exists. The following values are supported: * WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the data, removes the constraints, and uses the schema from the query result. * WRITE_TRUNCATE_DATA: If the table already exists, BigQuery overwrites the data, but keeps the constraints and schema of the existing table. * WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. * WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result. The default value is WRITE_EMPTY. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      writeIncrementalResults: z.boolean().describe(
        "Optional. This is only supported for a SELECT query using a temporary table. If set, the query is allowed to write results incrementally to the temporary result table. This may incur a performance penalty. This option cannot be used with Legacy SQL. This feature is not yet available.",
      ).optional(),
    }).describe("[Pick one] Configures a query job.").optional(),
    reservation: z.string().describe(
      "Optional. The reservation that job would use. User can specify a reservation to execute the job. If reservation is not set, reservation is determined based on the rules defined by the reservation assignments. The expected format is `projects/{project}/locations/{location}/reservations/{reservation}`. Forces the query to use on-demand billing when set to `none`, which requires the project or organization to have `reservation_override_mode` set to `ALLOW_ANY_OVERRIDE`.",
    ).optional(),
  }).describe("Required. Describes the job configuration.").optional(),
  jobReference: z.object({
    jobId: z.string().describe(
      "Required. The ID of the job. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-). The maximum length is 1,024 characters.",
    ).optional(),
    location: z.string().describe(
      "Optional. The geographic location of the job. The default value is US. For more information about BigQuery locations, see: https://cloud.google.com/bigquery/docs/locations",
    ).optional(),
    projectId: z.string().describe(
      "Required. The ID of the project containing this job.",
    ).optional(),
  }).describe(
    "Optional. Reference describing the unique-per-user name of the job.",
  ).optional(),
});

const bigqueryQueryMethods = {
  run_query: {
    description:
      "submit a query job, poll until completion, paginate and persist all result rows with job provenance — fails on maxResults breach rather than silently truncating",
    arguments: z.object({
      query: z.string().describe("Standard SQL query string"),
      location: z.string().describe(
        "BigQuery location for the job, e.g. US, EU, us-central1",
      ).optional(),
      maximumBytesBilled: z.string().describe(
        "Limit on bytes billed — query fails if exceeded (string to avoid precision loss)",
      ).optional(),
      useLegacySql: z.boolean().describe(
        "Use legacy SQL dialect (default false)",
      ).optional(),
      queryParameters: z.array(z.record(z.string(), z.unknown())).describe(
        "Named or positional query parameters",
      ).optional(),
      maxResults: z.number().describe(
        "Maximum total rows to retrieve before failing with an explicit truncation error (default 100000)",
      ).optional(),
    }),
    execute: async (
      args: Record<string, unknown>,
      context: {
        globalArgs: Record<string, unknown>;
        writeResource: (
          type: string,
          name: string,
          data: unknown,
        ) => Promise<unknown>;
      },
    ) => {
      const g = context.globalArgs;
      const baseUrl = g["apiEndpoint"]?.toString() ??
        Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
      const credentials = _buildGcpCredentials(g);
      const projectId = await getProjectId(credentials);

      const queryText = args.query as string;
      const location = args.location as string | undefined;
      const maximumBytesBilled = args.maximumBytesBilled as string | undefined;
      const useLegacySql = (args.useLegacySql as boolean | undefined) ?? false;
      const queryParameters = args.queryParameters as
        | Record<string, unknown>[]
        | undefined;
      const maxResults = (args.maxResults as number | undefined) ?? 100000;

      const queryConfig: Record<string, unknown> = {
        query: queryText,
        useLegacySql,
      };
      if (maximumBytesBilled !== undefined) {
        queryConfig.maximumBytesBilled = maximumBytesBilled;
      }
      if (queryParameters !== undefined) {
        queryConfig.queryParameters = queryParameters;
      }

      const jobBody: Record<string, unknown> = {
        configuration: { query: queryConfig },
      };
      if (location) {
        jobBody.jobReference = { projectId, location };
      }

      const createResp = await request(
        "POST",
        `${baseUrl}projects/${projectId}/jobs`,
        jobBody,
        credentials,
      );
      if (!createResp.ok) {
        const body = await createResp.text();
        throw new Error(
          `Failed to create query job (${createResp.status}): ${body}`,
        );
      }

      let job = await createResp.json() as {
        jobReference: { projectId: string; jobId: string; location?: string };
        status: {
          state: string;
          errorResult?: { reason: string; message: string };
        };
      };

      const jobId = job.jobReference.jobId;
      const jobLocation = job.jobReference.location ?? location;

      let pollCount = 0;
      const maxPolls = 60;
      while (job.status.state !== "DONE") {
        pollCount++;
        if (pollCount > maxPolls) {
          throw new Error(
            `Query job ${jobId} did not complete after ${maxPolls} polls`,
          );
        }
        await new Promise((r) => setTimeout(r, 2000));

        let pollUrl = `${baseUrl}projects/${projectId}/jobs/${jobId}`;
        if (jobLocation) {
          pollUrl += `?location=${encodeURIComponent(jobLocation)}`;
        }

        const pollResp = await request("GET", pollUrl, undefined, credentials);
        if (!pollResp.ok) {
          const body = await pollResp.text();
          throw new Error(
            `Failed to poll query job ${jobId} (${pollResp.status}): ${body}`,
          );
        }
        job = await pollResp.json();
      }

      if (job.status.errorResult) {
        throw new Error(
          `Query job ${jobId} failed: ${job.status.errorResult.reason} — ${job.status.errorResult.message}`,
        );
      }

      const allRows: unknown[] = [];
      let pageToken: string | undefined;
      let schema: unknown = undefined;
      let totalRows: string | undefined;
      const resultsPageSize = 10000;

      do {
        let resultsUrl =
          `${baseUrl}projects/${projectId}/queries/${jobId}?maxResults=${resultsPageSize}`;
        if (jobLocation) {
          resultsUrl += `&location=${encodeURIComponent(jobLocation)}`;
        }
        if (pageToken) {
          resultsUrl += `&pageToken=${encodeURIComponent(pageToken)}`;
        }

        const resultsResp = await request(
          "GET",
          resultsUrl,
          undefined,
          credentials,
        );
        if (!resultsResp.ok) {
          const body = await resultsResp.text();
          throw new Error(
            `Failed to get query results for ${jobId} (${resultsResp.status}): ${body}`,
          );
        }

        const data = await resultsResp.json() as {
          schema?: unknown;
          rows?: unknown[];
          totalRows?: string;
          pageToken?: string;
        };

        if (data.schema && !schema) {
          schema = data.schema;
        }
        if (data.totalRows) {
          totalRows = data.totalRows;
        }
        if (data.rows) {
          allRows.push(...data.rows);
        }

        if (allRows.length > maxResults) {
          throw new Error(
            `Query result row count (${allRows.length}) exceeds maxResults limit (${maxResults}) for job ${jobId}. ` +
              `Total rows reported: ${totalRows ?? "unknown"}. ` +
              "Increase maxResults or add a LIMIT clause. The snapshot was NOT persisted.",
          );
        }

        pageToken = data.pageToken;
      } while (pageToken);

      const snapshot = {
        jobId,
        location: jobLocation,
        query: queryText,
        totalRows: totalRows ? Number(totalRows) : allRows.length,
        schema,
        rows: allRows,
        fetchedAt: new Date().toISOString(),
      };

      const instanceName = `query_result_${jobId}`
        .replace(/[\/\\]/g, "_")
        .replace(/\.\./g, "_")
        .replace(/\0/g, "");
      const handle = await context.writeResource(
        "state",
        instanceName,
        snapshot,
      );
      return { dataHandles: [handle] };
    },
  },
};

const StateSchema = z.object({
  configuration: z.object({
    copy: z.object({
      createDisposition: z.string(),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string(),
      }),
      destinationExpirationTime: z.string(),
      destinationTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      operationType: z.string(),
      sourceTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      sourceTables: z.array(z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      })),
      writeDisposition: z.string(),
    }),
    dryRun: z.boolean(),
    extract: z.object({
      compression: z.string(),
      destinationFormat: z.string(),
      destinationUri: z.string(),
      destinationUris: z.array(z.string()),
      fieldDelimiter: z.string(),
      modelExtractOptions: z.object({
        trialId: z.string(),
      }),
      printHeader: z.boolean(),
      sourceModel: z.object({
        datasetId: z.string(),
        modelId: z.string(),
        projectId: z.string(),
      }),
      sourceTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      useAvroLogicalTypes: z.boolean(),
    }),
    jobTimeoutMs: z.string(),
    jobType: z.string(),
    labels: z.record(z.string(), z.unknown()),
    load: z.object({
      allowJaggedRows: z.boolean(),
      allowQuotedNewlines: z.boolean(),
      autodetect: z.boolean(),
      clustering: z.object({
        fields: z.array(z.string()),
      }),
      columnNameCharacterMap: z.string(),
      connectionProperties: z.array(z.object({
        key: z.string(),
        value: z.string(),
      })),
      copyFilesOnly: z.boolean(),
      createDisposition: z.string(),
      createSession: z.boolean(),
      dateFormat: z.string(),
      datetimeFormat: z.string(),
      decimalTargetTypes: z.array(z.string()),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string(),
      }),
      destinationTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      destinationTableProperties: z.object({
        description: z.string(),
        expirationTime: z.string(),
        friendlyName: z.string(),
        labels: z.record(z.string(), z.unknown()),
      }),
      encoding: z.string(),
      fieldDelimiter: z.string(),
      fileSetSpecType: z.string(),
      hivePartitioningOptions: z.object({
        fields: z.array(z.string()),
        mode: z.string(),
        requirePartitionFilter: z.boolean(),
        sourceUriPrefix: z.string(),
      }),
      ignoreUnknownValues: z.boolean(),
      jsonExtension: z.string(),
      maxBadRecords: z.number(),
      nullMarker: z.string(),
      nullMarkers: z.array(z.string()),
      parquetOptions: z.object({
        enableListInference: z.boolean(),
        enumAsString: z.boolean(),
        mapTargetType: z.string(),
      }),
      preserveAsciiControlCharacters: z.boolean(),
      projectionFields: z.array(z.string()),
      quote: z.string(),
      rangePartitioning: z.object({
        field: z.string(),
        range: z.object({
          end: z.string(),
          interval: z.string(),
          start: z.string(),
        }),
      }),
      referenceFileSchemaUri: z.string(),
      schema: z.object({
        fields: z.array(z.object({
          categories: z.unknown(),
          collation: z.unknown(),
          dataGovernanceTagsInfo: z.unknown(),
          dataPolicies: z.unknown(),
          dataPolicyList: z.unknown(),
          defaultValueExpression: z.unknown(),
          description: z.unknown(),
          fields: z.unknown(),
          foreignTypeDefinition: z.unknown(),
          generatedColumn: z.unknown(),
          maxLength: z.unknown(),
          mode: z.unknown(),
          name: z.unknown(),
          policyTags: z.unknown(),
          precision: z.unknown(),
          rangeElementType: z.unknown(),
          roundingMode: z.unknown(),
          scale: z.unknown(),
          timestampPrecision: z.unknown(),
          type: z.unknown(),
        })),
        foreignTypeInfo: z.object({
          typeSystem: z.string(),
        }),
      }),
      schemaInline: z.string(),
      schemaInlineFormat: z.string(),
      schemaUpdateOptions: z.array(z.string()),
      skipLeadingRows: z.number(),
      sourceColumnMatch: z.string(),
      sourceFormat: z.string(),
      sourceUris: z.array(z.string()),
      timeFormat: z.string(),
      timePartitioning: z.object({
        expirationMs: z.string(),
        field: z.string(),
        requirePartitionFilter: z.boolean(),
        type: z.string(),
      }),
      timeZone: z.string(),
      timestampFormat: z.string(),
      timestampTargetPrecision: z.array(z.number()),
      useAvroLogicalTypes: z.boolean(),
      writeDisposition: z.string(),
    }),
    maxSlots: z.number(),
    query: z.object({
      allowLargeResults: z.boolean(),
      clustering: z.object({
        fields: z.array(z.string()),
      }),
      connectionProperties: z.array(z.object({
        key: z.string(),
        value: z.string(),
      })),
      continuous: z.boolean(),
      createDisposition: z.string(),
      createSession: z.boolean(),
      defaultDataset: z.object({
        datasetId: z.string(),
        projectId: z.string(),
      }),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string(),
      }),
      destinationTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      flattenResults: z.boolean(),
      maximumBillingTier: z.number(),
      maximumBytesBilled: z.string(),
      parameterMode: z.string(),
      preserveNulls: z.boolean(),
      priority: z.string(),
      query: z.string(),
      queryParameters: z.array(z.object({
        name: z.string(),
        parameterType: z.object({
          arrayType: z.unknown(),
          rangeElementType: z.unknown(),
          structTypes: z.unknown(),
          timestampPrecision: z.unknown(),
          type: z.unknown(),
        }),
        parameterValue: z.object({
          arrayValues: z.unknown(),
          rangeValue: z.unknown(),
          structValues: z.unknown(),
          value: z.unknown(),
        }),
      })),
      rangePartitioning: z.object({
        field: z.string(),
        range: z.object({
          end: z.string(),
          interval: z.string(),
          start: z.string(),
        }),
      }),
      schemaUpdateOptions: z.array(z.string()),
      scriptOptions: z.object({
        keyResultStatement: z.string(),
        statementByteBudget: z.string(),
        statementTimeoutMs: z.string(),
      }),
      systemVariables: z.object({
        types: z.record(z.string(), z.unknown()),
        values: z.record(z.string(), z.unknown()),
      }),
      tableDefinitions: z.record(z.string(), z.unknown()),
      timePartitioning: z.object({
        expirationMs: z.string(),
        field: z.string(),
        requirePartitionFilter: z.boolean(),
        type: z.string(),
      }),
      useLegacySql: z.boolean(),
      useQueryCache: z.boolean(),
      userDefinedFunctionResources: z.array(z.object({
        inlineCode: z.string(),
        resourceUri: z.string(),
      })),
      writeDisposition: z.string(),
      writeIncrementalResults: z.boolean(),
    }),
    reservation: z.string(),
  }).optional(),
  etag: z.string().optional(),
  id: z.string().optional(),
  jobCreationReason: z.object({
    code: z.string(),
  }).optional(),
  jobReference: z.object({
    jobId: z.string(),
    location: z.string(),
    projectId: z.string(),
  }).optional(),
  kind: z.string().optional(),
  principal_subject: z.string().optional(),
  selfLink: z.string().optional(),
  statistics: z.object({
    completionRatio: z.number(),
    copy: z.object({
      copiedLogicalBytes: z.string(),
      copiedRows: z.string(),
      remoteDestinationRegion: z.string(),
    }),
    creationTime: z.string(),
    dataMaskingStatistics: z.object({
      dataMaskingApplied: z.boolean(),
    }),
    edition: z.string(),
    endTime: z.string(),
    extract: z.object({
      destinationUriFileCounts: z.array(z.string()),
      inputBytes: z.string(),
      timeline: z.array(z.object({
        activeUnits: z.string(),
        completedUnits: z.string(),
        elapsedMs: z.string(),
        estimatedRunnableUnits: z.string(),
        pendingUnits: z.string(),
        shuffleRamUsageRatio: z.number(),
        totalSlotMs: z.string(),
      })),
    }),
    finalExecutionDurationMs: z.string(),
    globalQueryRemoteRegions: z.array(z.string()),
    load: z.object({
      badRecords: z.string(),
      inputFileBytes: z.string(),
      inputFiles: z.string(),
      outputBytes: z.string(),
      outputRows: z.string(),
      timeline: z.array(z.object({
        activeUnits: z.string(),
        completedUnits: z.string(),
        elapsedMs: z.string(),
        estimatedRunnableUnits: z.string(),
        pendingUnits: z.string(),
        shuffleRamUsageRatio: z.number(),
        totalSlotMs: z.string(),
      })),
    }),
    numChildJobs: z.string(),
    parentGlobalQueryJob: z.object({
      jobId: z.string(),
      location: z.string(),
      projectId: z.string(),
    }),
    parentJobId: z.string(),
    query: z.object({
      biEngineStatistics: z.object({
        accelerationMode: z.string(),
        biEngineMode: z.string(),
        biEngineReasons: z.array(z.object({
          code: z.unknown(),
          message: z.unknown(),
        })),
      }),
      billingTier: z.number(),
      cacheHit: z.boolean(),
      dclTargetDataset: z.object({
        datasetId: z.string(),
        projectId: z.string(),
      }),
      dclTargetTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      dclTargetView: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      ddlAffectedRowAccessPolicyCount: z.string(),
      ddlDestinationTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      ddlOperationPerformed: z.string(),
      ddlTargetDataset: z.object({
        datasetId: z.string(),
        projectId: z.string(),
      }),
      ddlTargetRoutine: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        routineId: z.string(),
      }),
      ddlTargetRowAccessPolicy: z.object({
        datasetId: z.string(),
        policyId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      ddlTargetTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      dmlStats: z.object({
        deletedRowCount: z.string(),
        dmlMode: z.string(),
        fineGrainedDmlUnusedReason: z.string(),
        insertedRowCount: z.string(),
        updatedRowCount: z.string(),
      }),
      estimatedBytesProcessed: z.string(),
      exportDataStatistics: z.object({
        fileCount: z.string(),
        rowCount: z.string(),
      }),
      externalServiceCosts: z.array(z.object({
        billingMethod: z.string(),
        bytesBilled: z.string(),
        bytesProcessed: z.string(),
        externalService: z.string(),
        reservedSlotCount: z.string(),
        slotMs: z.string(),
      })),
      genAiStats: z.object({
        errorStats: z.object({
          errors: z.array(z.unknown()),
        }),
        functionStats: z.array(z.object({
          cacheStats: z.unknown(),
          costOptimizationStats: z.unknown(),
          errorStats: z.unknown(),
          functionName: z.unknown(),
          numProcessedRows: z.unknown(),
          prompt: z.unknown(),
        })),
      }),
      incrementalResultStats: z.object({
        disabledReason: z.string(),
        disabledReasonDetails: z.string(),
        firstIncrementalRowTime: z.string(),
        incrementalRowCount: z.string(),
        lastIncrementalRowTime: z.string(),
        resultSetLastModifyTime: z.string(),
        resultSetLastReplaceTime: z.string(),
      }),
      loadQueryStatistics: z.object({
        badRecords: z.string(),
        bytesTransferred: z.string(),
        inputFileBytes: z.string(),
        inputFiles: z.string(),
        outputBytes: z.string(),
        outputRows: z.string(),
      }),
      materializedViewStatistics: z.object({
        materializedView: z.array(z.object({
          chosen: z.unknown(),
          estimatedBytesSaved: z.unknown(),
          rejectedReason: z.unknown(),
          tableReference: z.unknown(),
        })),
      }),
      metadataCacheStatistics: z.object({
        tableMetadataCacheUsage: z.array(z.object({
          explanation: z.unknown(),
          pruningStats: z.unknown(),
          staleness: z.unknown(),
          tableReference: z.unknown(),
          tableType: z.unknown(),
          unusedReason: z.unknown(),
        })),
      }),
      mlStatistics: z.object({
        hparamTrials: z.array(z.object({
          endTimeMs: z.unknown(),
          errorMessage: z.unknown(),
          evalLoss: z.unknown(),
          evaluationMetrics: z.unknown(),
          hparamTuningEvaluationMetrics: z.unknown(),
          hparams: z.unknown(),
          startTimeMs: z.unknown(),
          status: z.unknown(),
          trainingLoss: z.unknown(),
          trialId: z.unknown(),
        })),
        iterationResults: z.array(z.object({
          arimaResult: z.unknown(),
          clusterInfos: z.unknown(),
          durationMs: z.unknown(),
          evalLoss: z.unknown(),
          index: z.unknown(),
          learnRate: z.unknown(),
          principalComponentInfos: z.unknown(),
          trainingLoss: z.unknown(),
        })),
        maxIterations: z.string(),
        modelType: z.string(),
        trainingType: z.string(),
      }),
      modelTraining: z.object({
        currentIteration: z.number(),
        expectedTotalIterations: z.string(),
      }),
      modelTrainingCurrentIteration: z.number(),
      modelTrainingExpectedTotalIteration: z.string(),
      numDmlAffectedRows: z.string(),
      objectStorageStats: z.array(z.object({
        cacheBytesRead: z.string(),
        cloudProvider: z.string(),
        objectStorageBytesRead: z.string(),
      })),
      performanceInsights: z.object({
        avgPreviousExecutionMs: z.string(),
        stagePerformanceChangeInsights: z.array(z.object({
          inputDataChange: z.unknown(),
          stageId: z.unknown(),
        })),
        stagePerformanceStandaloneInsights: z.array(z.object({
          biEngineReasons: z.unknown(),
          highCardinalityJoins: z.unknown(),
          insufficientShuffleQuota: z.unknown(),
          partitionSkew: z.unknown(),
          slotContention: z.unknown(),
          stageId: z.unknown(),
        })),
        tableChangeInsights: z.array(z.object({
          metadataCacheNotUsedButUsedPreviously: z.unknown(),
          metadataCacheStalenessInsight: z.unknown(),
          tableReference: z.unknown(),
        })),
      }),
      queryInfo: z.object({
        optimizationDetails: z.record(z.string(), z.unknown()),
      }),
      queryPlan: z.array(z.object({
        completedParallelInputs: z.string(),
        computeMode: z.string(),
        computeMsAvg: z.string(),
        computeMsMax: z.string(),
        computeRatioAvg: z.number(),
        computeRatioMax: z.number(),
        endMs: z.string(),
        id: z.string(),
        inputStages: z.array(z.unknown()),
        name: z.string(),
        parallelInputs: z.string(),
        readMsAvg: z.string(),
        readMsMax: z.string(),
        readRatioAvg: z.number(),
        readRatioMax: z.number(),
        recordsRead: z.string(),
        recordsWritten: z.string(),
        shuffleOutputBytes: z.string(),
        shuffleOutputBytesSpilled: z.string(),
        slotMs: z.string(),
        startMs: z.string(),
        status: z.string(),
        steps: z.array(z.unknown()),
        waitMsAvg: z.string(),
        waitMsMax: z.string(),
        waitRatioAvg: z.number(),
        waitRatioMax: z.number(),
        writeMsAvg: z.string(),
        writeMsMax: z.string(),
        writeRatioAvg: z.number(),
        writeRatioMax: z.number(),
      })),
      referencedPropertyGraphs: z.array(z.object({
        datasetId: z.string(),
        projectId: z.string(),
        propertyGraphId: z.string(),
      })),
      referencedRoutines: z.array(z.object({
        datasetId: z.string(),
        projectId: z.string(),
        routineId: z.string(),
      })),
      referencedTables: z.array(z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      })),
      reservationUsage: z.array(z.object({
        name: z.string(),
        slotMs: z.string(),
      })),
      schema: z.object({
        fields: z.array(z.object({
          categories: z.unknown(),
          collation: z.unknown(),
          dataGovernanceTagsInfo: z.unknown(),
          dataPolicies: z.unknown(),
          dataPolicyList: z.unknown(),
          defaultValueExpression: z.unknown(),
          description: z.unknown(),
          fields: z.unknown(),
          foreignTypeDefinition: z.unknown(),
          generatedColumn: z.unknown(),
          maxLength: z.unknown(),
          mode: z.unknown(),
          name: z.unknown(),
          policyTags: z.unknown(),
          precision: z.unknown(),
          rangeElementType: z.unknown(),
          roundingMode: z.unknown(),
          scale: z.unknown(),
          timestampPrecision: z.unknown(),
          type: z.unknown(),
        })),
        foreignTypeInfo: z.object({
          typeSystem: z.string(),
        }),
      }),
      searchStatistics: z.object({
        indexPruningStats: z.array(z.object({
          baseTable: z.unknown(),
          indexId: z.unknown(),
          postIndexPruningParallelInputCount: z.unknown(),
          preIndexPruningParallelInputCount: z.unknown(),
        })),
        indexUnusedReasons: z.array(z.object({
          baseTable: z.unknown(),
          code: z.unknown(),
          indexName: z.unknown(),
          message: z.unknown(),
        })),
        indexUsageMode: z.string(),
      }),
      sparkStatistics: z.object({
        endpoints: z.record(z.string(), z.unknown()),
        gcsStagingBucket: z.string(),
        kmsKeyName: z.string(),
        loggingInfo: z.object({
          projectId: z.string(),
          resourceType: z.string(),
        }),
        sparkJobId: z.string(),
        sparkJobLocation: z.string(),
      }),
      statementType: z.string(),
      timeline: z.array(z.object({
        activeUnits: z.string(),
        completedUnits: z.string(),
        elapsedMs: z.string(),
        estimatedRunnableUnits: z.string(),
        pendingUnits: z.string(),
        shuffleRamUsageRatio: z.number(),
        totalSlotMs: z.string(),
      })),
      totalBytesBilled: z.string(),
      totalBytesProcessed: z.string(),
      totalBytesProcessedAccuracy: z.string(),
      totalPartitionsProcessed: z.string(),
      totalServicesSkuSlotMs: z.string(),
      totalSlotMs: z.string(),
      transferredBytes: z.string(),
      undeclaredQueryParameters: z.array(z.object({
        name: z.string(),
        parameterType: z.object({
          arrayType: z.unknown(),
          rangeElementType: z.unknown(),
          structTypes: z.unknown(),
          timestampPrecision: z.unknown(),
          type: z.unknown(),
        }),
        parameterValue: z.object({
          arrayValues: z.unknown(),
          rangeValue: z.unknown(),
          structValues: z.unknown(),
          value: z.unknown(),
        }),
      })),
      vectorSearchStatistics: z.object({
        indexUnusedReasons: z.array(z.object({
          baseTable: z.unknown(),
          code: z.unknown(),
          indexName: z.unknown(),
          message: z.unknown(),
        })),
        indexUsageMode: z.string(),
        storedColumnsUsages: z.array(z.object({
          baseTable: z.unknown(),
          isQueryAccelerated: z.unknown(),
          storedColumnsUnusedReasons: z.unknown(),
        })),
      }),
    }),
    quotaDeferments: z.array(z.string()),
    reservationGroupPath: z.array(z.string()),
    reservationUsage: z.array(z.object({
      name: z.string(),
      slotMs: z.string(),
    })),
    reservation_id: z.string(),
    rowLevelSecurityStatistics: z.object({
      rowLevelSecurityApplied: z.boolean(),
    }),
    scriptStatistics: z.object({
      evaluationKind: z.string(),
      stackFrames: z.array(z.object({
        endColumn: z.number(),
        endLine: z.number(),
        procedureId: z.string(),
        startColumn: z.number(),
        startLine: z.number(),
        text: z.string(),
      })),
    }),
    sessionInfo: z.object({
      sessionId: z.string(),
    }),
    startTime: z.string(),
    totalBytesProcessed: z.string(),
    totalSlotMs: z.string(),
    transactionInfo: z.object({
      transactionId: z.string(),
    }),
  }).optional(),
  status: z.object({
    errorResult: z.object({
      debugInfo: z.string(),
      location: z.string(),
      message: z.string(),
      reason: z.string(),
    }),
    errors: z.array(z.object({
      debugInfo: z.string(),
      location: z.string(),
      message: z.string(),
      reason: z.string(),
    })),
    state: z.string(),
  }).optional(),
  user_email: z.string().optional(),
}).passthrough();

type StateData = z.infer<typeof StateSchema>;

const InputsSchema = z.object({
  name: z.string().optional(),
  accessToken: z.string().meta({ sensitive: true }).optional(),
  credentialsJson: z.string().meta({ sensitive: true }).optional(),
  project: z.string().optional(),
  scopes: z.string().optional(),
  quotaProject: z.string().optional(),
  apiEndpoint: z.string().optional(),
  configuration: z.object({
    copy: z.object({
      createDisposition: z.string().describe(
        "Optional. Specifies whether the job is allowed to create new tables. The following values are supported: * CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. * CREATE_NEVER: The table must already exist. If it does not, a 'notFound' error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string().describe(
          "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
        ).optional(),
      }).describe("Custom encryption configuration (e.g., Cloud KMS keys).")
        .optional(),
      destinationExpirationTime: z.string().describe(
        "Optional. The time when the destination table expires. Expired tables will be deleted and their storage reclaimed.",
      ).optional(),
      destinationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("[Required] The destination table.").optional(),
      operationType: z.enum([
        "OPERATION_TYPE_UNSPECIFIED",
        "COPY",
        "SNAPSHOT",
        "RESTORE",
        "CLONE",
      ]).describe("Optional. Supported operation types in table copy job.")
        .optional(),
      sourceTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("[Pick one] Source table to copy.").optional(),
      sourceTables: z.array(z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      })).describe("[Pick one] Source tables to copy.").optional(),
      writeDisposition: z.string().describe(
        "Optional. Specifies the action that occurs if the destination table already exists. The following values are supported: * WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the table data and uses the schema and table constraints from the source table. * WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. * WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result. The default value is WRITE_EMPTY. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
    }).describe("[Pick one] Copies a table.").optional(),
    dryRun: z.boolean().describe(
      "Optional. If set, don't actually run this job. A valid query will return a mostly empty response with some processing statistics, while an invalid query will return the same error it would if it wasn't a dry run. Behavior of non-query jobs is undefined.",
    ).optional(),
    extract: z.object({
      compression: z.string().describe(
        "Optional. The compression type to use for exported files. Possible values include DEFLATE, GZIP, NONE, SNAPPY, and ZSTD. The default value is NONE. Not all compression formats are support for all file formats. DEFLATE is only supported for Avro. ZSTD is only supported for Parquet. Not applicable when extracting models.",
      ).optional(),
      destinationFormat: z.string().describe(
        "Optional. The exported file format. Possible values include CSV, NEWLINE_DELIMITED_JSON, PARQUET, or AVRO for tables and ML_TF_SAVED_MODEL or ML_XGBOOST_BOOSTER for models. The default value for tables is CSV. Tables with nested or repeated fields cannot be exported as CSV. The default value for models is ML_TF_SAVED_MODEL.",
      ).optional(),
      destinationUri: z.string().describe(
        "[Pick one] DEPRECATED: Use destinationUris instead, passing only one URI as necessary. The fully-qualified Google Cloud Storage URI where the extracted table should be written.",
      ).optional(),
      destinationUris: z.array(z.string()).describe(
        "[Pick one] A list of fully-qualified Google Cloud Storage URIs where the extracted table should be written.",
      ).optional(),
      fieldDelimiter: z.string().describe(
        "Optional. When extracting data in CSV format, this defines the delimiter to use between fields in the exported data. Default is ','. Not applicable when extracting models.",
      ).optional(),
      modelExtractOptions: z.object({
        trialId: z.string().describe(
          "The 1-based ID of the trial to be exported from a hyperparameter tuning model. If not specified, the trial with id = [Model](https://cloud.google.com/bigquery/docs/reference/rest/v2/models#resource:-model).defaultTrialId is exported. This field is ignored for models not trained with hyperparameter tuning.",
        ).optional(),
      }).describe(
        "Optional. Model extract options only applicable when extracting models.",
      ).optional(),
      printHeader: z.boolean().describe(
        "Optional. Whether to print out a header row in the results. Default is true. Not applicable when extracting models.",
      ).optional(),
      sourceModel: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this model.",
        ).optional(),
        modelId: z.string().describe(
          "Required. The ID of the model. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this model.",
        ).optional(),
      }).describe("A reference to the model being exported.").optional(),
      sourceTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("A reference to the table being exported.").optional(),
      useAvroLogicalTypes: z.boolean().describe(
        "Whether to use logical types when extracting to AVRO format. Not applicable when extracting models.",
      ).optional(),
    }).describe("[Pick one] Configures an extract job.").optional(),
    jobTimeoutMs: z.string().describe(
      "Optional. Job timeout in milliseconds relative to the job creation time. If this time limit is exceeded, BigQuery attempts to stop the job, but might not always succeed in canceling it before the job completes. For example, a job that takes more than 60 seconds to complete has a better chance of being stopped than a job that takes 10 seconds to complete.",
    ).optional(),
    jobType: z.string().describe(
      "Output only. The type of the job. Can be QUERY, LOAD, EXTRACT, COPY or UNKNOWN.",
    ).optional(),
    labels: z.record(z.string(), z.string()).describe(
      "The labels associated with this job. You can use these to organize and group your jobs. Label keys and values can be no longer than 63 characters, can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter and each label in the list must have a different key.",
    ).optional(),
    load: z.object({
      allowJaggedRows: z.boolean().describe(
        "Optional. Accept rows that are missing trailing optional columns. The missing values are treated as nulls. If false, records with missing trailing columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. Only applicable to CSV, ignored for other formats.",
      ).optional(),
      allowQuotedNewlines: z.boolean().describe(
        "Indicates if BigQuery should allow quoted data sections that contain newline characters in a CSV file. The default value is false.",
      ).optional(),
      autodetect: z.boolean().describe(
        "Optional. Indicates if we should automatically infer the options and schema for CSV and JSON sources.",
      ).optional(),
      clustering: z.object({
        fields: z.array(z.string()).describe(
          "One or more fields on which data should be clustered. Only top-level, non-repeated, simple-type fields are supported. The ordering of the clustering fields should be prioritized from most to least important for filtering purposes. For additional information, see [Introduction to clustered tables](https://cloud.google.com/bigquery/docs/clustered-tables#limitations).",
        ).optional(),
      }).describe("Clustering specification for the destination table.")
        .optional(),
      columnNameCharacterMap: z.enum([
        "COLUMN_NAME_CHARACTER_MAP_UNSPECIFIED",
        "STRICT",
        "V1",
        "V2",
      ]).describe(
        "Optional. Character map supported for column names in CSV/Parquet loads. Defaults to STRICT and can be overridden by Project Config Service. Using this option with unsupporting load formats will result in an error.",
      ).optional(),
      connectionProperties: z.array(z.object({
        key: z.string().describe("The key of the property to set.").optional(),
        value: z.string().describe("The value of the property to set.")
          .optional(),
      })).describe(
        "Optional. Connection properties which can modify the load job behavior. Currently, only the 'session_id' connection property is supported, and is used to resolve _SESSION appearing as the dataset id.",
      ).optional(),
      copyFilesOnly: z.boolean().describe(
        "Optional. [Experimental] Configures the load job to copy files directly to the destination BigLake managed table, bypassing file content reading and rewriting. Copying files only is supported when all the following are true: * `source_uris` are located in the same Cloud Storage location as the destination table's `storage_uri` location. * `source_format` is `PARQUET`. * `destination_table` is an existing BigLake managed table. The table's schema does not have flexible column names. The table's columns do not have type parameters other than precision and scale. * No options other than the above are specified.",
      ).optional(),
      createDisposition: z.string().describe(
        "Optional. Specifies whether the job is allowed to create new tables. The following values are supported: * CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. * CREATE_NEVER: The table must already exist. If it does not, a 'notFound' error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      createSession: z.boolean().describe(
        "Optional. If this property is true, the job creates a new session using a randomly generated session_id. To continue using a created session with subsequent queries, pass the existing session identifier as a `ConnectionProperty` value. The session identifier is returned as part of the `SessionInfo` message within the query statistics. The new session's location will be set to `Job.JobReference.location` if it is present, otherwise it's set to the default location based on existing routing logic.",
      ).optional(),
      dateFormat: z.string().describe(
        "Optional. Date format used for parsing DATE values.",
      ).optional(),
      datetimeFormat: z.string().describe(
        "Optional. Date format used for parsing DATETIME values.",
      ).optional(),
      decimalTargetTypes: z.array(
        z.enum([
          "DECIMAL_TARGET_TYPE_UNSPECIFIED",
          "NUMERIC",
          "BIGNUMERIC",
          "STRING",
        ]),
      ).describe(
        'Defines the list of possible SQL data types to which the source decimal values are converted. This list and the precision and the scale parameters of the decimal field determine the target type. In the order of NUMERIC, BIGNUMERIC, and STRING, a type is picked if it is in the specified list and if it supports the precision and the scale. STRING supports all precision and scale values. If none of the listed types supports the precision and the scale, the type supporting the widest range in the specified list is picked, and if a value exceeds the supported range when reading the data, an error will be thrown. Example: Suppose the value of this field is ["NUMERIC", "BIGNUMERIC"]. If (precision,scale) is: * (38,9) -> NUMERIC; * (39,9) -> BIGNUMERIC (NUMERIC cannot hold 30 integer digits); * (38,10) -> BIGNUMERIC (NUMERIC cannot hold 10 fractional digits); * (76,38) -> BIGNUMERIC; * (77,38) -> BIGNUMERIC (error if value exceeds supported range). This field cannot contain duplicate types. The order of the types in this field is ignored. For example, ["BIGNUMERIC", "NUMERIC"] is the same as ["NUMERIC", "BIGNUMERIC"] and NUMERIC always takes precedence over BIGNUMERIC. Defaults to ["NUMERIC", "STRING"] for ORC and ["NUMERIC"] for the other file formats.',
      ).optional(),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string().describe(
          "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
        ).optional(),
      }).describe("Custom encryption configuration (e.g., Cloud KMS keys)")
        .optional(),
      destinationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("[Required] The destination table to load the data into.")
        .optional(),
      destinationTableProperties: z.object({
        description: z.string().describe(
          "Optional. The description for the destination table. This will only be used if the destination table is newly created. If the table already exists and a value different than the current description is provided, the job will fail.",
        ).optional(),
        expirationTime: z.string().describe("Internal use only.").optional(),
        friendlyName: z.string().describe(
          "Optional. Friendly name for the destination table. If the table already exists, it should be same as the existing friendly name.",
        ).optional(),
        labels: z.record(z.string(), z.string()).describe(
          "Optional. The labels associated with this table. You can use these to organize and group your tables. This will only be used if the destination table is newly created. If the table already exists and labels are different than the current labels are provided, the job will fail.",
        ).optional(),
      }).describe(
        "Optional. [Experimental] Properties with which to create the destination table if it is new.",
      ).optional(),
      encoding: z.string().describe(
        "Optional. The character encoding of the data. The supported values are UTF-8, ISO-8859-1, UTF-16BE, UTF-16LE, UTF-32BE, and UTF-32LE. The default value is UTF-8. BigQuery decodes the data after the raw, binary data has been split using the values of the `quote` and `fieldDelimiter` properties. If you don't specify an encoding, or if you specify a UTF-8 encoding when the CSV file is not UTF-8 encoded, BigQuery attempts to convert the data to UTF-8. Generally, your data loads successfully, but it may not match byte-for-byte what you expect. To avoid this, specify the correct encoding by using the `--encoding` flag. If BigQuery can't convert a character other than the ASCII `0` character, BigQuery converts the character to the standard Unicode replacement character: �.",
      ).optional(),
      fieldDelimiter: z.string().describe(
        'Optional. The separator character for fields in a CSV file. The separator is interpreted as a single byte. For files encoded in ISO-8859-1, any single character can be used as a separator. For files encoded in UTF-8, characters represented in decimal range 1-127 (U+0001-U+007F) can be used without any modification. UTF-8 characters encoded with multiple bytes (i.e. U+0080 and above) will have only the first byte used for separating fields. The remaining bytes will be treated as a part of the field. BigQuery also supports the escape sequence "\\t" (U+0009) to specify a tab separator. The default value is comma (",", U+002C).',
      ).optional(),
      fileSetSpecType: z.enum([
        "FILE_SET_SPEC_TYPE_FILE_SYSTEM_MATCH",
        "FILE_SET_SPEC_TYPE_NEW_LINE_DELIMITED_MANIFEST",
      ]).describe(
        "Optional. Specifies how source URIs are interpreted for constructing the file set to load. By default, source URIs are expanded against the underlying storage. You can also specify manifest files to control how the file set is constructed. This option is only applicable to object storage systems.",
      ).optional(),
      hivePartitioningOptions: z.object({
        fields: z.array(z.string()).describe(
          "Output only. For permanent external tables, this field is populated with the hive partition keys in the order they were inferred. The types of the partition keys can be deduced by checking the table schema (which will include the partition keys). Not every API will populate this field in the output. For example, Tables.Get will populate it, but Tables.List will not contain this field.",
        ).optional(),
        mode: z.string().describe(
          "Optional. When set, what mode of hive partitioning to use when reading data. The following modes are supported: * AUTO: automatically infer partition key name(s) and type(s). * STRINGS: automatically infer partition key name(s). All types are strings. * CUSTOM: partition key schema is encoded in the source URI prefix. Not all storage formats support hive partitioning. Requesting hive partitioning on an unsupported format will lead to an error. Currently supported formats are: JSON, CSV, ORC, Avro and Parquet.",
        ).optional(),
        requirePartitionFilter: z.boolean().describe(
          "Optional. If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. Note that this field should only be true when creating a permanent external table or querying a temporary external table. Hive-partitioned loads with require_partition_filter explicitly set to true will fail.",
        ).optional(),
        sourceUriPrefix: z.string().describe(
          "Optional. When hive partition detection is requested, a common prefix for all source uris must be required. The prefix must end immediately before the partition key encoding begins. For example, consider files following this data layout: gs://bucket/path_to_table/dt=2019-06-01/country=USA/id=7/file.avro gs://bucket/path_to_table/dt=2019-05-31/country=CA/id=3/file.avro When hive partitioning is requested with either AUTO or STRINGS detection, the common prefix can be either of gs://bucket/path_to_table or gs://bucket/path_to_table/. CUSTOM detection requires encoding the partitioning schema immediately after the common prefix. For CUSTOM, any of * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:STRING}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:STRING} would all be valid source URI prefixes.",
        ).optional(),
      }).describe(
        "Optional. When set, configures hive partitioning support. Not all storage formats support hive partitioning -- requesting hive partitioning on an unsupported format will lead to an error, as will providing an invalid specification.",
      ).optional(),
      ignoreUnknownValues: z.boolean().describe(
        "Optional. Indicates if BigQuery should allow extra values that are not represented in the table schema. If true, the extra values are ignored. If false, records with extra columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. The sourceFormat property determines what BigQuery treats as an extra value: CSV: Trailing columns JSON: Named values that don't match any column names in the table schema Avro, Parquet, ORC: Fields in the file schema that don't exist in the table schema.",
      ).optional(),
      jsonExtension: z.enum(["JSON_EXTENSION_UNSPECIFIED", "GEOJSON"]).describe(
        "Optional. Load option to be used together with source_format newline-delimited JSON to indicate that a variant of JSON is being loaded. To load newline-delimited GeoJSON, specify GEOJSON (and source_format must be set to NEWLINE_DELIMITED_JSON).",
      ).optional(),
      maxBadRecords: z.number().int().describe(
        "Optional. The maximum number of bad records that BigQuery can ignore when running the job. If the number of bad records exceeds this value, an invalid error is returned in the job result. The default value is 0, which requires that all records are valid. This is only supported for CSV and NEWLINE_DELIMITED_JSON file formats.",
      ).optional(),
      nullMarker: z.string().describe(
        'Optional. Specifies a string that represents a null value in a CSV file. For example, if you specify "\\N", BigQuery interprets "\\N" as a null value when loading a CSV file. The default value is the empty string. If you set this property to a custom value, BigQuery throws an error if an empty string is present for all data types except for STRING and BYTE. For STRING and BYTE columns, BigQuery interprets the empty string as an empty value.',
      ).optional(),
      nullMarkers: z.array(z.string()).describe(
        "Optional. A list of strings represented as SQL NULL value in a CSV file. null_marker and null_markers can't be set at the same time. If null_marker is set, null_markers has to be not set. If null_markers is set, null_marker has to be not set. If both null_marker and null_markers are set at the same time, a user error would be thrown. Any strings listed in null_markers, including empty string would be interpreted as SQL NULL. This applies to all column types.",
      ).optional(),
      parquetOptions: z.object({
        enableListInference: z.boolean().describe(
          "Optional. Indicates whether to use schema inference specifically for Parquet LIST logical type.",
        ).optional(),
        enumAsString: z.boolean().describe(
          "Optional. Indicates whether to infer Parquet ENUM logical type as STRING instead of BYTES by default.",
        ).optional(),
        mapTargetType: z.enum([
          "MAP_TARGET_TYPE_UNSPECIFIED",
          "ARRAY_OF_STRUCT",
        ]).describe(
          "Optional. Indicates how to represent a Parquet map if present.",
        ).optional(),
      }).describe(
        "Optional. Additional properties to set if sourceFormat is set to PARQUET.",
      ).optional(),
      preserveAsciiControlCharacters: z.boolean().describe(
        "Optional. When sourceFormat is set to \"CSV\", this indicates whether the embedded ASCII control characters (the first 32 characters in the ASCII-table, from '\\x00' to '\\x1F') are preserved.",
      ).optional(),
      projectionFields: z.array(z.string()).describe(
        'If sourceFormat is set to "DATASTORE_BACKUP", indicates which entity properties to load into BigQuery from a Cloud Datastore backup. Property names are case sensitive and must be top-level properties. If no properties are specified, BigQuery loads all properties. If any named property isn\'t found in the Cloud Datastore backup, an invalid error is returned in the job result.',
      ).optional(),
      quote: z.string().regex(new RegExp(".?")).describe(
        "Optional. The value that is used to quote data sections in a CSV file. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. The default value is a double-quote ('\"'). If your data does not contain quoted sections, set the property value to an empty string. If your data contains quoted newline characters, you must also set the allowQuotedNewlines property to true. To include the specific quote character within a quoted value, precede it with an additional matching quote character. For example, if you want to escape the default character ' \" ', use ' \"\" '. @default \"",
      ).optional(),
      rangePartitioning: z.object({
        field: z.string().describe(
          "Required. The name of the column to partition the table on. It must be a top-level, INT64 column whose mode is NULLABLE or REQUIRED.",
        ).optional(),
        range: z.object({
          end: z.string().describe(
            "[Experimental] The end of range partitioning, exclusive.",
          ).optional(),
          interval: z.string().describe(
            "[Experimental] The width of each interval.",
          ).optional(),
          start: z.string().describe(
            "[Experimental] The start of range partitioning, inclusive.",
          ).optional(),
        }).describe("[Experimental] Defines the ranges for range partitioning.")
          .optional(),
      }).describe(
        "Range partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      referenceFileSchemaUri: z.string().describe(
        "Optional. The user can provide a reference file with the reader schema. This file is only loaded if it is part of source URIs, but is not loaded otherwise. It is enabled for the following formats: AVRO, PARQUET, ORC.",
      ).optional(),
      schema: z.object({
        fields: z.array(z.object({
          categories: z.unknown().describe("Deprecated.").optional(),
          collation: z.unknown().describe(
            "Optional. Field collation can be set only when the type of field is STRING. The following values are supported: * 'und:ci': undetermined locale, case insensitive. * '': empty string. Default to case-sensitive behavior.",
          ).optional(),
          dataGovernanceTagsInfo: z.unknown().describe(
            "Optional. Specifies the data governance tags on this field. This field works with other column-level security fields as follows: * **Precedence**: If a data governance tag is attached to a column, it takes precedence over the policy tag attached to the column. However, if a data policy is attached to a column, it takes precedence over the data governance tag. * **Patching behavior**: Describes how this field behaves during a `Table.patch` schema update: * **Unset**: If the `data_governance_tags_info` field is omitted from the update request, the existing tags on the column are preserved. * **Empty Field**: To clear data governance tags from a column, send the `data_governance_tags_info` field as an empty object. This removes all tags from the column. * **Updating tags**: To replace an existing tag, send the field with the new tag.",
          ).optional(),
          dataPolicies: z.unknown().describe(
            "Optional. Data policies attached to this field, used for field-level access control.",
          ).optional(),
          dataPolicyList: z.unknown().describe(
            "Optional. Specifies data policies attached to this field, used for field-level access control. When set, this will be the source of truth for data policy information.",
          ).optional(),
          defaultValueExpression: z.unknown().describe(
            "Optional. A SQL expression to specify the [default value] (https://cloud.google.com/bigquery/docs/default-values) for this field.",
          ).optional(),
          description: z.unknown().describe(
            "Optional. The field description. The maximum length is 1,024 characters.",
          ).optional(),
          fields: z.unknown().describe(
            "Optional. Describes the nested schema fields if the type property is set to RECORD.",
          ).optional(),
          foreignTypeDefinition: z.unknown().describe(
            "Optional. Definition of the foreign data type. Only valid for top-level schema fields (not nested fields). If the type is FOREIGN, this field is required.",
          ).optional(),
          generatedColumn: z.unknown().describe(
            "Optional. Definition of how values are generated for the field. Only valid for top-level schema fields (not nested fields).",
          ).optional(),
          maxLength: z.unknown().describe(
            'Optional. Maximum length of values of this field for STRINGS or BYTES. If max_length is not specified, no maximum length constraint is imposed on this field. If type = "STRING", then max_length represents the maximum UTF-8 length of strings in this field. If type = "BYTES", then max_length represents the maximum number of bytes in this field. It is invalid to set this field if type ≠ "STRING" and ≠ "BYTES".',
          ).optional(),
          mode: z.unknown().describe(
            "Optional. The field mode. Possible values include NULLABLE, REQUIRED and REPEATED. The default value is NULLABLE.",
          ).optional(),
          name: z.unknown().describe(
            "Required. The field name. The name must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_), and must start with a letter or underscore. The maximum length is 300 characters.",
          ).optional(),
          policyTags: z.unknown().describe(
            "Optional. The policy tags attached to this field, used for field-level access control. If not set, defaults to empty policy_tags.",
          ).optional(),
          precision: z.unknown().describe(
            'Optional. Precision (maximum number of total digits in base 10) and scale (maximum number of digits in the fractional part in base 10) constraints for values of this field for NUMERIC or BIGNUMERIC. It is invalid to set precision or scale if type ≠ "NUMERIC" and ≠ "BIGNUMERIC". If precision and scale are not specified, no value range constraint is imposed on this field insofar as values are permitted by the type. Values of this NUMERIC or BIGNUMERIC field must be in this range when: * Precision (P) and scale (S) are specified: [-10P-S + 10-S, 10P-S - 10-S] * Precision (P) is specified but not scale (and thus scale is interpreted to be equal to zero): [-10P + 1, 10P - 1]. Acceptable values for precision and scale if both are specified: * If type = "NUMERIC": 1 ≤ precision - scale ≤ 29 and 0 ≤ scale ≤ 9. * If type = "BIGNUMERIC": 1 ≤ precision - scale ≤ 38 and 0 ≤ scale ≤ 38. Acceptable values for precision if only precision is specified but not scale (and thus scale is interpreted to be equal to zero): * If type = "NUMERIC": 1 ≤ precision ≤ 29. * If type = "BIGNUMERIC": 1 ≤ precision ≤ 38. If scale is specified but not precision, then it is invalid.',
          ).optional(),
          rangeElementType: z.unknown().describe(
            "Represents the type of a field element.",
          ).optional(),
          roundingMode: z.unknown().describe(
            "Optional. Specifies the rounding mode to be used when storing values of NUMERIC and BIGNUMERIC type.",
          ).optional(),
          scale: z.unknown().describe(
            "Optional. See documentation for precision.",
          ).optional(),
          timestampPrecision: z.unknown().describe(
            "Optional. Precision (maximum number of total digits in base 10) for seconds of TIMESTAMP type. Possible values include: * 6 (Default, for TIMESTAMP type with microsecond precision) * 12 (For TIMESTAMP type with picosecond precision)",
          ).optional(),
          type: z.unknown().describe(
            "Required. The field data type. Possible values include: * STRING * BYTES * INTEGER (or INT64) * FLOAT (or FLOAT64) * BOOLEAN (or BOOL) * TIMESTAMP * DATE * TIME * DATETIME * GEOGRAPHY * NUMERIC * BIGNUMERIC * JSON * RECORD (or STRUCT) * RANGE Use of RECORD/STRUCT indicates that the field contains a nested schema.",
          ).optional(),
        })).describe("Describes the fields in a table.").optional(),
        foreignTypeInfo: z.object({
          typeSystem: z.enum(["TYPE_SYSTEM_UNSPECIFIED", "HIVE"]).describe(
            "Required. Specifies the system which defines the foreign data type.",
          ).optional(),
        }).describe(
          "Optional. Specifies metadata of the foreign data type definition in field schema (TableFieldSchema.foreign_type_definition).",
        ).optional(),
      }).describe(
        "Optional. The schema for the destination table. The schema can be omitted if the destination table already exists, or if you're loading data from Google Cloud Datastore.",
      ).optional(),
      schemaInline: z.string().describe(
        '[Deprecated] The inline schema. For CSV schemas, specify as "Field1:Type1[,Field2:Type2]*". For example, "foo:STRING, bar:INTEGER, baz:FLOAT".',
      ).optional(),
      schemaInlineFormat: z.string().describe(
        "[Deprecated] The format of the schemaInline property.",
      ).optional(),
      schemaUpdateOptions: z.array(z.string()).describe(
        "Allows the schema of the destination table to be updated as a side effect of the load job if a schema is autodetected or supplied in the job configuration. Schema update options are supported in three cases: when writeDisposition is WRITE_APPEND; when writeDisposition is WRITE_TRUNCATE_DATA; when writeDisposition is WRITE_TRUNCATE and the destination table is a partition of a table, specified by partition decorators. For normal tables, WRITE_TRUNCATE will always overwrite the schema. One or more of the following values are specified: * ALLOW_FIELD_ADDITION: allow adding a nullable field to the schema. * ALLOW_FIELD_RELAXATION: allow relaxing a required field in the original schema to nullable.",
      ).optional(),
      skipLeadingRows: z.number().int().describe(
        "Optional. The number of rows at the top of a CSV file that BigQuery will skip when loading the data. The default value is 0. This property is useful if you have header rows in the file that should be skipped. When autodetect is on, the behavior is the following: * skipLeadingRows unspecified - Autodetect tries to detect headers in the first row. If they are not detected, the row is read as data. Otherwise data is read starting from the second row. * skipLeadingRows is 0 - Instructs autodetect that there are no headers and data should be read starting from the first row. * skipLeadingRows = N > 0 - Autodetect skips N-1 rows and tries to detect headers in row N. If headers are not detected, row N is just skipped. Otherwise row N is used to extract column names for the detected schema.",
      ).optional(),
      sourceColumnMatch: z.enum([
        "SOURCE_COLUMN_MATCH_UNSPECIFIED",
        "POSITION",
        "NAME",
      ]).describe(
        "Optional. Controls the strategy used to match loaded columns to the schema. If not set, a sensible default is chosen based on how the schema is provided. If autodetect is used, then columns are matched by name. Otherwise, columns are matched by position. This is done to keep the behavior backward-compatible.",
      ).optional(),
      sourceFormat: z.string().describe(
        'Optional. The format of the data files. For CSV files, specify "CSV". For datastore backups, specify "DATASTORE_BACKUP". For newline-delimited JSON, specify "NEWLINE_DELIMITED_JSON". For Avro, specify "AVRO". For parquet, specify "PARQUET". For orc, specify "ORC". The default value is CSV.',
      ).optional(),
      sourceUris: z.array(z.string()).describe(
        "[Required] The fully-qualified URIs that point to your data in Google Cloud. For Google Cloud Storage URIs: Each URI can contain one '*' wildcard character and it must come after the 'bucket' name. Size limits related to load jobs apply to external data sources. For Google Cloud Bigtable URIs: Exactly one URI can be specified and it has be a fully specified and valid HTTPS URL for a Google Cloud Bigtable table. For Google Cloud Datastore backups: Exactly one URI can be specified. Also, the '*' wildcard character is not allowed.",
      ).optional(),
      timeFormat: z.string().describe(
        "Optional. Date format used for parsing TIME values.",
      ).optional(),
      timePartitioning: z.object({
        expirationMs: z.string().describe(
          "Optional. Number of milliseconds for which to keep the storage for a partition. A wrapper is used here because 0 is an invalid value.",
        ).optional(),
        field: z.string().describe(
          "Optional. If not set, the table is partitioned by pseudo column '_PARTITIONTIME'; if set, the table is partitioned by this field. The field must be a top-level TIMESTAMP or DATE field. Its mode must be NULLABLE or REQUIRED. A wrapper is used here because an empty string is an invalid value.",
        ).optional(),
        requirePartitionFilter: z.boolean().describe(
          "If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. This field is deprecated; please set the field with the same name on the table itself instead. This field needs a wrapper because we want to output the default value, false, if the user explicitly set it.",
        ).optional(),
        type: z.string().describe(
          "Required. The supported types are DAY, HOUR, MONTH, and YEAR, which will generate one partition per day, hour, month, and year, respectively.",
        ).optional(),
      }).describe(
        "Time-based partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      timeZone: z.string().describe(
        "Optional. Default time zone that will apply when parsing timestamp values that have no specific time zone.",
      ).optional(),
      timestampFormat: z.string().describe(
        "Optional. Date format used for parsing TIMESTAMP values.",
      ).optional(),
      timestampTargetPrecision: z.array(z.number().int()).describe(
        "Precisions (maximum number of total digits in base 10) for seconds of TIMESTAMP types that are allowed to the destination table for autodetection mode. Available for the formats: CSV, PARQUET, AVRO, and Iceberg External Table. Possible values include: Not Specified, [], or [6]: timestamp(6) for all auto detected TIMESTAMP columns [6, 12]: timestamp(6) for all auto detected TIMESTAMP columns that have less than 6 digits of subseconds. timestamp(12) for all auto detected TIMESTAMP columns that have more than 6 digits of subseconds. [12]: timestamp(12) for all auto detected TIMESTAMP columns. The order of the elements in this array is ignored. Inputs that have higher precision than the highest target precision in this array will be truncated.",
      ).optional(),
      useAvroLogicalTypes: z.boolean().describe(
        'Optional. If sourceFormat is set to "AVRO", indicates whether to interpret logical types as the corresponding BigQuery data type (for example, TIMESTAMP), instead of using the raw type (for example, INTEGER).',
      ).optional(),
      writeDisposition: z.string().describe(
        "Optional. Specifies the action that occurs if the destination table already exists. The following values are supported: * WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the data, removes the constraints and uses the schema from the load job. * WRITE_TRUNCATE_DATA: If the table already exists, BigQuery overwrites the data, but keeps the constraints and schema of the existing table. * WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. * WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result. The default value is WRITE_APPEND. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
    }).describe("[Pick one] Configures a load job.").optional(),
    maxSlots: z.number().int().describe(
      "Optional. A target limit on the rate of slot consumption by this job. If set to a value > 0, BigQuery will attempt to limit the rate of slot consumption by this job to keep it below the configured limit, even if the job is eligible for more slots based on fair scheduling. The unused slots will be available for other jobs and queries to use. Note: This feature is not yet generally available.",
    ).optional(),
    query: z.object({
      allowLargeResults: z.boolean().describe(
        "Optional. If true and query uses legacy SQL dialect, allows the query to produce arbitrarily large result tables at a slight cost in performance. Requires destinationTable to be set. For GoogleSQL queries, this flag is ignored and large results are always allowed. However, you must still set destinationTable when result size exceeds the allowed maximum response size.",
      ).optional(),
      clustering: z.object({
        fields: z.array(z.string()).describe(
          "One or more fields on which data should be clustered. Only top-level, non-repeated, simple-type fields are supported. The ordering of the clustering fields should be prioritized from most to least important for filtering purposes. For additional information, see [Introduction to clustered tables](https://cloud.google.com/bigquery/docs/clustered-tables#limitations).",
        ).optional(),
      }).describe("Clustering specification for the destination table.")
        .optional(),
      connectionProperties: z.array(z.object({
        key: z.string().describe("The key of the property to set.").optional(),
        value: z.string().describe("The value of the property to set.")
          .optional(),
      })).describe("Connection properties which can modify the query behavior.")
        .optional(),
      continuous: z.boolean().describe(
        "[Optional] Specifies whether the query should be executed as a continuous query. The default value is false.",
      ).optional(),
      createDisposition: z.string().describe(
        "Optional. Specifies whether the job is allowed to create new tables. The following values are supported: * CREATE_IF_NEEDED: If the table does not exist, BigQuery creates the table. * CREATE_NEVER: The table must already exist. If it does not, a 'notFound' error is returned in the job result. The default value is CREATE_IF_NEEDED. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      createSession: z.boolean().describe(
        "If this property is true, the job creates a new session using a randomly generated session_id. To continue using a created session with subsequent queries, pass the existing session identifier as a `ConnectionProperty` value. The session identifier is returned as part of the `SessionInfo` message within the query statistics. The new session's location will be set to `Job.JobReference.location` if it is present, otherwise it's set to the default location based on existing routing logic.",
      ).optional(),
      defaultDataset: z.object({
        datasetId: z.string().describe(
          "Required. A unique ID for this dataset, without the project name. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.",
        ).optional(),
        projectId: z.string().describe(
          "Optional. The ID of the project containing this dataset.",
        ).optional(),
      }).describe(
        "Optional. Specifies the default dataset to use for unqualified table names in the query. This setting does not alter behavior of unqualified dataset names. Setting the system variable `@@dataset_id` achieves the same behavior. See https://cloud.google.com/bigquery/docs/reference/system-variables for more information on system variables.",
      ).optional(),
      destinationEncryptionConfiguration: z.object({
        kmsKeyName: z.string().describe(
          "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
        ).optional(),
      }).describe("Custom encryption configuration (e.g., Cloud KMS keys)")
        .optional(),
      destinationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe(
        "Optional. Describes the table where the query results should be stored. This property must be set for large results that exceed the maximum response size. For queries that produce anonymous (cached) results, this field will be populated by BigQuery.",
      ).optional(),
      flattenResults: z.boolean().describe(
        "Optional. If true and query uses legacy SQL dialect, flattens all nested and repeated fields in the query results. allowLargeResults must be true if this is set to false. For GoogleSQL queries, this flag is ignored and results are never flattened.",
      ).optional(),
      maximumBillingTier: z.number().int().describe(
        "Optional. [Deprecated] Maximum billing tier allowed for this query. The billing tier controls the amount of compute resources allotted to the query, and multiplies the on-demand cost of the query accordingly. A query that runs within its allotted resources will succeed and indicate its billing tier in statistics.query.billingTier, but if the query exceeds its allotted resources, it will fail with billingTierLimitExceeded. WARNING: The billed byte amount can be multiplied by an amount up to this number! Most users should not need to alter this setting, and we recommend that you avoid introducing new uses of it.",
      ).optional(),
      maximumBytesBilled: z.string().describe(
        "Limits the bytes billed for this job. Queries that will have bytes billed beyond this limit will fail (without incurring a charge). If unspecified, this will be set to your project default.",
      ).optional(),
      parameterMode: z.string().describe(
        "GoogleSQL only. Set to POSITIONAL to use positional (?) query parameters or to NAMED to use named (@myparam) query parameters in this query.",
      ).optional(),
      preserveNulls: z.boolean().describe(
        "[Deprecated] This property is deprecated.",
      ).optional(),
      priority: z.string().describe(
        "Optional. Specifies a priority for the query. Possible values include INTERACTIVE and BATCH. The default value is INTERACTIVE.",
      ).optional(),
      query: z.string().describe(
        "[Required] SQL query text to execute. The useLegacySql field can be used to indicate whether the query uses legacy SQL or GoogleSQL.",
      ).optional(),
      queryParameters: z.array(z.object({
        name: z.string().describe(
          "Optional. If unset, this is a positional parameter. Otherwise, should be unique within a query.",
        ).optional(),
        parameterType: z.object({
          arrayType: z.unknown().describe(
            "Circular reference to QueryParameterType",
          ).optional(),
          rangeElementType: z.unknown().describe(
            "Circular reference to QueryParameterType",
          ).optional(),
          structTypes: z.unknown().describe(
            "Optional. The types of the fields of this struct, in order, if this is a struct.",
          ).optional(),
          timestampPrecision: z.unknown().describe(
            "Optional. Precision (maximum number of total digits in base 10) for seconds of TIMESTAMP type. Possible values include: * 6 (Default, for TIMESTAMP type with microsecond precision) * 12 (For TIMESTAMP type with picosecond precision)",
          ).optional(),
          type: z.unknown().describe(
            "Required. The top level type of this field.",
          ).optional(),
        }).describe("Required. The type of this parameter.").optional(),
        parameterValue: z.object({
          arrayValues: z.unknown().describe(
            "Optional. The array values, if this is an array type.",
          ).optional(),
          rangeValue: z.unknown().describe(
            "Optional. The range value, if this is a range type.",
          ).optional(),
          structValues: z.unknown().describe("The struct field values.")
            .optional(),
          value: z.unknown().describe(
            "Optional. The value of this value, if a simple scalar type.",
          ).optional(),
        }).describe("Required. The value of this parameter.").optional(),
      })).describe("Query parameters for GoogleSQL queries.").optional(),
      rangePartitioning: z.object({
        field: z.string().describe(
          "Required. The name of the column to partition the table on. It must be a top-level, INT64 column whose mode is NULLABLE or REQUIRED.",
        ).optional(),
        range: z.object({
          end: z.string().describe(
            "[Experimental] The end of range partitioning, exclusive.",
          ).optional(),
          interval: z.string().describe(
            "[Experimental] The width of each interval.",
          ).optional(),
          start: z.string().describe(
            "[Experimental] The start of range partitioning, inclusive.",
          ).optional(),
        }).describe("[Experimental] Defines the ranges for range partitioning.")
          .optional(),
      }).describe(
        "Range partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      schemaUpdateOptions: z.array(z.string()).describe(
        "Allows the schema of the destination table to be updated as a side effect of the query job. Schema update options are supported in three cases: when writeDisposition is WRITE_APPEND; when writeDisposition is WRITE_TRUNCATE_DATA; when writeDisposition is WRITE_TRUNCATE and the destination table is a partition of a table, specified by partition decorators. For normal tables, WRITE_TRUNCATE will always overwrite the schema. One or more of the following values are specified: * ALLOW_FIELD_ADDITION: allow adding a nullable field to the schema. * ALLOW_FIELD_RELAXATION: allow relaxing a required field in the original schema to nullable.",
      ).optional(),
      scriptOptions: z.object({
        keyResultStatement: z.enum([
          "KEY_RESULT_STATEMENT_KIND_UNSPECIFIED",
          "LAST",
          "FIRST_SELECT",
        ]).describe(
          'Determines which statement in the script represents the "key result", used to populate the schema and query results of the script job. Default is LAST.',
        ).optional(),
        statementByteBudget: z.string().describe(
          "Limit on the number of bytes billed per statement. Exceeding this budget results in an error.",
        ).optional(),
        statementTimeoutMs: z.string().describe(
          "Timeout period for each statement in a script.",
        ).optional(),
      }).describe("Options controlling the execution of scripts.").optional(),
      systemVariables: z.object({
        types: z.record(
          z.string(),
          z.object({
            arrayElementType: z.unknown().describe(
              "Circular reference to StandardSqlDataType",
            ).optional(),
            rangeElementType: z.unknown().describe(
              "Circular reference to StandardSqlDataType",
            ).optional(),
            structType: z.unknown().describe(
              'The fields of this struct, in order, if type_kind = "STRUCT".',
            ).optional(),
            typeKind: z.unknown().describe(
              'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
            ).optional(),
          }),
        ).describe("Output only. Data type for each system variable.")
          .optional(),
        values: z.record(z.string(), z.string()).describe(
          "Output only. Value for each system variable.",
        ).optional(),
      }).describe(
        'Output only. System variables for GoogleSQL queries. A system variable is output if the variable is settable and its value differs from the system default. "@@" prefix is not included in the name of the System variables.',
      ).optional(),
      tableDefinitions: z.record(
        z.string(),
        z.object({
          autodetect: z.boolean().describe(
            "Try to detect schema and format options automatically. Any option specified explicitly will be honored.",
          ).optional(),
          avroOptions: z.object({
            useAvroLogicalTypes: z.unknown().describe(
              'Optional. If sourceFormat is set to "AVRO", indicates whether to interpret logical types as the corresponding BigQuery data type (for example, TIMESTAMP), instead of using the raw type (for example, INTEGER).',
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to AVRO.",
          ).optional(),
          bigtableOptions: z.object({
            columnFamilies: z.unknown().describe(
              "Optional. List of column families to expose in the table schema along with their types. This list restricts the column families that can be referenced in queries and specifies their value types. You can use this list to do type conversions - see the 'type' field for more details. If you leave this list empty, all column families are present in the table schema and their values are read as BYTES. During a query only the column families referenced in that query are read from Bigtable.",
            ).optional(),
            ignoreUnspecifiedColumnFamilies: z.unknown().describe(
              "Optional. If field is true, then the column families that are not specified in columnFamilies list are not exposed in the table schema. Otherwise, they are read with BYTES type values. The default value is false.",
            ).optional(),
            outputColumnFamiliesAsJson: z.unknown().describe(
              "Optional. If field is true, then each column family will be read as a single JSON column. Otherwise they are read as a repeated cell structure containing timestamp/value tuples. The default value is false.",
            ).optional(),
            readRowkeyAsString: z.unknown().describe(
              "Optional. If field is true, then the rowkey column families will be read and converted to string. Otherwise they are read with BYTES type values and users need to manually cast them with CAST if necessary. The default value is false.",
            ).optional(),
          }).describe(
            "Optional. Additional options if sourceFormat is set to BIGTABLE.",
          ).optional(),
          compression: z.string().describe(
            "Optional. The compression type of the data source. Possible values include GZIP and NONE. The default value is NONE. This setting is ignored for Google Cloud Bigtable, Google Cloud Datastore backups, Avro, ORC and Parquet formats. An empty string is an invalid value.",
          ).optional(),
          connectionId: z.string().describe(
            "Optional. The connection specifying the credentials to be used to read external storage, such as Azure Blob, Cloud Storage, or S3. The connection_id can have the form `{project_id}.{location_id};{connection_id}` or `projects/{project_id}/locations/{location_id}/connections/{connection_id}`.",
          ).optional(),
          csvOptions: z.object({
            allowJaggedRows: z.unknown().describe(
              "Optional. Indicates if BigQuery should accept rows that are missing trailing optional columns. If true, BigQuery treats missing trailing columns as null values. If false, records with missing trailing columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false.",
            ).optional(),
            allowQuotedNewlines: z.unknown().describe(
              "Optional. Indicates if BigQuery should allow quoted data sections that contain newline characters in a CSV file. The default value is false.",
            ).optional(),
            encoding: z.unknown().describe(
              "Optional. The character encoding of the data. The supported values are UTF-8, ISO-8859-1, UTF-16BE, UTF-16LE, UTF-32BE, and UTF-32LE. The default value is UTF-8. BigQuery decodes the data after the raw, binary data has been split using the values of the quote and fieldDelimiter properties.",
            ).optional(),
            fieldDelimiter: z.unknown().describe(
              'Optional. The separator character for fields in a CSV file. The separator is interpreted as a single byte. For files encoded in ISO-8859-1, any single character can be used as a separator. For files encoded in UTF-8, characters represented in decimal range 1-127 (U+0001-U+007F) can be used without any modification. UTF-8 characters encoded with multiple bytes (i.e. U+0080 and above) will have only the first byte used for separating fields. The remaining bytes will be treated as a part of the field. BigQuery also supports the escape sequence "\\t" (U+0009) to specify a tab separator. The default value is comma (",", U+002C).',
            ).optional(),
            nullMarker: z.unknown().describe(
              'Optional. Specifies a string that represents a null value in a CSV file. For example, if you specify "\\N", BigQuery interprets "\\N" as a null value when querying a CSV file. The default value is the empty string. If you set this property to a custom value, BigQuery throws an error if an empty string is present for all data types except for STRING and BYTE. For STRING and BYTE columns, BigQuery interprets the empty string as an empty value.',
            ).optional(),
            nullMarkers: z.unknown().describe(
              "Optional. A list of strings represented as SQL NULL value in a CSV file. null_marker and null_markers can't be set at the same time. If null_marker is set, null_markers has to be not set. If null_markers is set, null_marker has to be not set. If both null_marker and null_markers are set at the same time, a user error would be thrown. Any strings listed in null_markers, including empty string would be interpreted as SQL NULL. This applies to all column types.",
            ).optional(),
            preserveAsciiControlCharacters: z.unknown().describe(
              "Optional. Indicates if the embedded ASCII control characters (the first 32 characters in the ASCII-table, from '\\x00' to '\\x1F') are preserved.",
            ).optional(),
            quote: z.unknown().describe(
              "Optional. The value that is used to quote data sections in a CSV file. BigQuery converts the string to ISO-8859-1 encoding, and then uses the first byte of the encoded string to split the data in its raw, binary state. The default value is a double-quote (\"). If your data does not contain quoted sections, set the property value to an empty string. If your data contains quoted newline characters, you must also set the allowQuotedNewlines property to true. To include the specific quote character within a quoted value, precede it with an additional matching quote character. For example, if you want to escape the default character ' \" ', use ' \"\" '.",
            ).optional(),
            skipLeadingRows: z.unknown().describe(
              "Optional. The number of rows at the top of a CSV file that BigQuery will skip when reading the data. The default value is 0. This property is useful if you have header rows in the file that should be skipped. When autodetect is on, the behavior is the following: * skipLeadingRows unspecified - Autodetect tries to detect headers in the first row. If they are not detected, the row is read as data. Otherwise data is read starting from the second row. * skipLeadingRows is 0 - Instructs autodetect that there are no headers and data should be read starting from the first row. * skipLeadingRows = N > 0 - Autodetect skips N-1 rows and tries to detect headers in row N. If headers are not detected, row N is just skipped. Otherwise row N is used to extract column names for the detected schema.",
            ).optional(),
            sourceColumnMatch: z.unknown().describe(
              "Optional. Controls the strategy used to match loaded columns to the schema. If not set, a sensible default is chosen based on how the schema is provided. If autodetect is used, then columns are matched by name. Otherwise, columns are matched by position. This is done to keep the behavior backward-compatible. Acceptable values are: POSITION - matches by position. This assumes that the columns are ordered the same way as the schema. NAME - matches by name. This reads the header row as column names and reorders columns to match the field names in the schema.",
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to CSV.",
          ).optional(),
          dateFormat: z.string().describe(
            "Optional. Format used to parse DATE values. Supports C-style and SQL-style values.",
          ).optional(),
          datetimeFormat: z.string().describe(
            "Optional. Format used to parse DATETIME values. Supports C-style and SQL-style values.",
          ).optional(),
          decimalTargetTypes: z.array(z.unknown()).describe(
            'Defines the list of possible SQL data types to which the source decimal values are converted. This list and the precision and the scale parameters of the decimal field determine the target type. In the order of NUMERIC, BIGNUMERIC, and STRING, a type is picked if it is in the specified list and if it supports the precision and the scale. STRING supports all precision and scale values. If none of the listed types supports the precision and the scale, the type supporting the widest range in the specified list is picked, and if a value exceeds the supported range when reading the data, an error will be thrown. Example: Suppose the value of this field is ["NUMERIC", "BIGNUMERIC"]. If (precision,scale) is: * (38,9) -> NUMERIC; * (39,9) -> BIGNUMERIC (NUMERIC cannot hold 30 integer digits); * (38,10) -> BIGNUMERIC (NUMERIC cannot hold 10 fractional digits); * (76,38) -> BIGNUMERIC; * (77,38) -> BIGNUMERIC (error if value exceeds supported range). This field cannot contain duplicate types. The order of the types in this field is ignored. For example, ["BIGNUMERIC", "NUMERIC"] is the same as ["NUMERIC", "BIGNUMERIC"] and NUMERIC always takes precedence over BIGNUMERIC. Defaults to ["NUMERIC", "STRING"] for ORC and ["NUMERIC"] for the other file formats.',
          ).optional(),
          fileSetSpecType: z.enum([
            "FILE_SET_SPEC_TYPE_FILE_SYSTEM_MATCH",
            "FILE_SET_SPEC_TYPE_NEW_LINE_DELIMITED_MANIFEST",
          ]).describe(
            "Optional. Specifies how source URIs are interpreted for constructing the file set to load. By default source URIs are expanded against the underlying storage. Other options include specifying manifest files. Only applicable to object storage systems.",
          ).optional(),
          googleSheetsOptions: z.object({
            range: z.unknown().describe(
              "Optional. Range of a sheet to query from. Only used when non-empty. Typical format: sheet_name!top_left_cell_id:bottom_right_cell_id For example: sheet1!A1:B20",
            ).optional(),
            skipLeadingRows: z.unknown().describe(
              "Optional. The number of rows at the top of a sheet that BigQuery will skip when reading the data. The default value is 0. This property is useful if you have header rows that should be skipped. When autodetect is on, the behavior is the following: * skipLeadingRows unspecified - Autodetect tries to detect headers in the first row. If they are not detected, the row is read as data. Otherwise data is read starting from the second row. * skipLeadingRows is 0 - Instructs autodetect that there are no headers and data should be read starting from the first row. * skipLeadingRows = N > 0 - Autodetect skips N-1 rows and tries to detect headers in row N. If headers are not detected, row N is just skipped. Otherwise row N is used to extract column names for the detected schema.",
            ).optional(),
          }).describe(
            "Optional. Additional options if sourceFormat is set to GOOGLE_SHEETS.",
          ).optional(),
          hivePartitioningOptions: z.object({
            fields: z.unknown().describe(
              "Output only. For permanent external tables, this field is populated with the hive partition keys in the order they were inferred. The types of the partition keys can be deduced by checking the table schema (which will include the partition keys). Not every API will populate this field in the output. For example, Tables.Get will populate it, but Tables.List will not contain this field.",
            ).optional(),
            mode: z.unknown().describe(
              "Optional. When set, what mode of hive partitioning to use when reading data. The following modes are supported: * AUTO: automatically infer partition key name(s) and type(s). * STRINGS: automatically infer partition key name(s). All types are strings. * CUSTOM: partition key schema is encoded in the source URI prefix. Not all storage formats support hive partitioning. Requesting hive partitioning on an unsupported format will lead to an error. Currently supported formats are: JSON, CSV, ORC, Avro and Parquet.",
            ).optional(),
            requirePartitionFilter: z.unknown().describe(
              "Optional. If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. Note that this field should only be true when creating a permanent external table or querying a temporary external table. Hive-partitioned loads with require_partition_filter explicitly set to true will fail.",
            ).optional(),
            sourceUriPrefix: z.unknown().describe(
              "Optional. When hive partition detection is requested, a common prefix for all source uris must be required. The prefix must end immediately before the partition key encoding begins. For example, consider files following this data layout: gs://bucket/path_to_table/dt=2019-06-01/country=USA/id=7/file.avro gs://bucket/path_to_table/dt=2019-05-31/country=CA/id=3/file.avro When hive partitioning is requested with either AUTO or STRINGS detection, the common prefix can be either of gs://bucket/path_to_table or gs://bucket/path_to_table/. CUSTOM detection requires encoding the partitioning schema immediately after the common prefix. For CUSTOM, any of * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:STRING}/{country:STRING}/{id:INTEGER} * gs://bucket/path_to_table/{dt:DATE}/{country:STRING}/{id:STRING} would all be valid source URI prefixes.",
            ).optional(),
          }).describe(
            "Optional. When set, configures hive partitioning support. Not all storage formats support hive partitioning -- requesting hive partitioning on an unsupported format will lead to an error, as will providing an invalid specification.",
          ).optional(),
          ignoreUnknownValues: z.boolean().describe(
            "Optional. Indicates if BigQuery should allow extra values that are not represented in the table schema. If true, the extra values are ignored. If false, records with extra columns are treated as bad records, and if there are too many bad records, an invalid error is returned in the job result. The default value is false. The sourceFormat property determines what BigQuery treats as an extra value: CSV: Trailing columns JSON: Named values that don't match any column names Google Cloud Bigtable: This setting is ignored. Google Cloud Datastore backups: This setting is ignored. Avro: This setting is ignored. ORC: This setting is ignored. Parquet: This setting is ignored.",
          ).optional(),
          jsonExtension: z.enum(["JSON_EXTENSION_UNSPECIFIED", "GEOJSON"])
            .describe(
              "Optional. Load option to be used together with source_format newline-delimited JSON to indicate that a variant of JSON is being loaded. To load newline-delimited GeoJSON, specify GEOJSON (and source_format must be set to NEWLINE_DELIMITED_JSON).",
            ).optional(),
          jsonOptions: z.object({
            encoding: z.unknown().describe(
              "Optional. The character encoding of the data. The supported values are UTF-8, UTF-16BE, UTF-16LE, UTF-32BE, and UTF-32LE. The default value is UTF-8.",
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to JSON.",
          ).optional(),
          maxBadRecords: z.number().int().describe(
            "Optional. The maximum number of bad records that BigQuery can ignore when reading data. If the number of bad records exceeds this value, an invalid error is returned in the job result. The default value is 0, which requires that all records are valid. This setting is ignored for Google Cloud Bigtable, Google Cloud Datastore backups, Avro, ORC and Parquet formats.",
          ).optional(),
          metadataCacheMode: z.enum([
            "METADATA_CACHE_MODE_UNSPECIFIED",
            "AUTOMATIC",
            "MANUAL",
          ]).describe(
            "Optional. Metadata Cache Mode for the table. Set this to enable caching of metadata from external data source.",
          ).optional(),
          objectMetadata: z.enum([
            "OBJECT_METADATA_UNSPECIFIED",
            "DIRECTORY",
            "SIMPLE",
          ]).describe(
            "Optional. ObjectMetadata is used to create Object Tables. Object Tables contain a listing of objects (with their metadata) found at the source_uris. If ObjectMetadata is set, source_format should be omitted. Currently SIMPLE is the only supported Object Metadata type.",
          ).optional(),
          parquetOptions: z.object({
            enableListInference: z.unknown().describe(
              "Optional. Indicates whether to use schema inference specifically for Parquet LIST logical type.",
            ).optional(),
            enumAsString: z.unknown().describe(
              "Optional. Indicates whether to infer Parquet ENUM logical type as STRING instead of BYTES by default.",
            ).optional(),
            mapTargetType: z.unknown().describe(
              "Optional. Indicates how to represent a Parquet map if present.",
            ).optional(),
          }).describe(
            "Optional. Additional properties to set if sourceFormat is set to PARQUET.",
          ).optional(),
          referenceFileSchemaUri: z.string().describe(
            "Optional. When creating an external table, the user can provide a reference file with the table schema. This is enabled for the following formats: AVRO, PARQUET, ORC.",
          ).optional(),
          schema: z.object({
            fields: z.unknown().describe("Describes the fields in a table.")
              .optional(),
            foreignTypeInfo: z.unknown().describe(
              "Optional. Specifies metadata of the foreign data type definition in field schema (TableFieldSchema.foreign_type_definition).",
            ).optional(),
          }).describe(
            "Optional. The schema for the data. Schema is required for CSV and JSON formats if autodetect is not on. Schema is disallowed for Google Cloud Bigtable, Cloud Datastore backups, Avro, ORC and Parquet formats.",
          ).optional(),
          sourceFormat: z.string().describe(
            '[Required] The data format. For CSV files, specify "CSV". For Google sheets, specify "GOOGLE_SHEETS". For newline-delimited JSON, specify "NEWLINE_DELIMITED_JSON". For Avro files, specify "AVRO". For Google Cloud Datastore backups, specify "DATASTORE_BACKUP". For Apache Iceberg tables, specify "ICEBERG". For ORC files, specify "ORC". For Parquet files, specify "PARQUET". [Beta] For Google Cloud Bigtable, specify "BIGTABLE".',
          ).optional(),
          sourceUris: z.array(z.unknown()).describe(
            "[Required] The fully-qualified URIs that point to your data in Google Cloud. For Google Cloud Storage URIs: Each URI can contain one '*' wildcard character and it must come after the 'bucket' name. Size limits related to load jobs apply to external data sources. For Google Cloud Bigtable URIs: Exactly one URI can be specified and it has be a fully specified and valid HTTPS URL for a Google Cloud Bigtable table. For Google Cloud Datastore backups, exactly one URI can be specified. Also, the '*' wildcard character is not allowed.",
          ).optional(),
          timeFormat: z.string().describe(
            "Optional. Format used to parse TIME values. Supports C-style and SQL-style values.",
          ).optional(),
          timeZone: z.string().describe(
            "Optional. Time zone used when parsing timestamp values that do not have specific time zone information (e.g. 2024-04-20 12:34:56). The expected format is a IANA timezone string (e.g. America/Los_Angeles).",
          ).optional(),
          timestampFormat: z.string().describe(
            "Optional. Format used to parse TIMESTAMP values. Supports C-style and SQL-style values.",
          ).optional(),
          timestampTargetPrecision: z.array(z.unknown()).describe(
            "Precisions (maximum number of total digits in base 10) for seconds of TIMESTAMP types that are allowed to the destination table for autodetection mode. Available for the formats: CSV, PARQUET, AVRO, and Iceberg External Table. Possible values include: Not Specified, [], or [6]: timestamp(6) for all auto detected TIMESTAMP columns [6, 12]: timestamp(6) for all auto detected TIMESTAMP columns that have less than 6 digits of subseconds. timestamp(12) for all auto detected TIMESTAMP columns that have more than 6 digits of subseconds. [12]: timestamp(12) for all auto detected TIMESTAMP columns. The order of the elements in this array is ignored. Inputs that have higher precision than the highest target precision in this array will be truncated.",
          ).optional(),
        }),
      ).describe(
        "Optional. You can specify external table definitions, which operate as ephemeral tables that can be queried. These definitions are configured using a JSON map, where the string key represents the table identifier, and the value is the corresponding external data configuration object.",
      ).optional(),
      timePartitioning: z.object({
        expirationMs: z.string().describe(
          "Optional. Number of milliseconds for which to keep the storage for a partition. A wrapper is used here because 0 is an invalid value.",
        ).optional(),
        field: z.string().describe(
          "Optional. If not set, the table is partitioned by pseudo column '_PARTITIONTIME'; if set, the table is partitioned by this field. The field must be a top-level TIMESTAMP or DATE field. Its mode must be NULLABLE or REQUIRED. A wrapper is used here because an empty string is an invalid value.",
        ).optional(),
        requirePartitionFilter: z.boolean().describe(
          "If set to true, queries over this table require a partition filter that can be used for partition elimination to be specified. This field is deprecated; please set the field with the same name on the table itself instead. This field needs a wrapper because we want to output the default value, false, if the user explicitly set it.",
        ).optional(),
        type: z.string().describe(
          "Required. The supported types are DAY, HOUR, MONTH, and YEAR, which will generate one partition per day, hour, month, and year, respectively.",
        ).optional(),
      }).describe(
        "Time-based partitioning specification for the destination table. Only one of timePartitioning and rangePartitioning should be specified.",
      ).optional(),
      useLegacySql: z.boolean().describe(
        "Optional. Specifies whether to use BigQuery's legacy SQL dialect for this query. The default value is true. If set to false, the query uses BigQuery's [GoogleSQL](https://docs.cloud.google.com/bigquery/docs/introduction-sql). When useLegacySql is set to false, the value of flattenResults is ignored; query will be run as if flattenResults is false.",
      ).optional(),
      useQueryCache: z.boolean().describe(
        "Optional. Whether to look for the result in the query cache. The query cache is a best-effort cache that will be flushed whenever tables in the query are modified. Moreover, the query cache is only available when a query does not have a destination table specified. The default value is true.",
      ).optional(),
      userDefinedFunctionResources: z.array(z.object({
        inlineCode: z.string().describe(
          "[Pick one] An inline resource that contains code for a user-defined function (UDF). Providing a inline code resource is equivalent to providing a URI for a file containing the same code.",
        ).optional(),
        resourceUri: z.string().describe(
          "[Pick one] A code resource to load from a Google Cloud Storage URI (gs://bucket/path).",
        ).optional(),
      })).describe(
        "Describes user-defined function resources used in the query.",
      ).optional(),
      writeDisposition: z.string().describe(
        "Optional. Specifies the action that occurs if the destination table already exists. The following values are supported: * WRITE_TRUNCATE: If the table already exists, BigQuery overwrites the data, removes the constraints, and uses the schema from the query result. * WRITE_TRUNCATE_DATA: If the table already exists, BigQuery overwrites the data, but keeps the constraints and schema of the existing table. * WRITE_APPEND: If the table already exists, BigQuery appends the data to the table. * WRITE_EMPTY: If the table already exists and contains data, a 'duplicate' error is returned in the job result. The default value is WRITE_EMPTY. Each action is atomic and only occurs if BigQuery is able to complete the job successfully. Creation, truncation and append actions occur as one atomic update upon job completion.",
      ).optional(),
      writeIncrementalResults: z.boolean().describe(
        "Optional. This is only supported for a SELECT query using a temporary table. If set, the query is allowed to write results incrementally to the temporary result table. This may incur a performance penalty. This option cannot be used with Legacy SQL. This feature is not yet available.",
      ).optional(),
    }).describe("[Pick one] Configures a query job.").optional(),
    reservation: z.string().describe(
      "Optional. The reservation that job would use. User can specify a reservation to execute the job. If reservation is not set, reservation is determined based on the rules defined by the reservation assignments. The expected format is `projects/{project}/locations/{location}/reservations/{reservation}`. Forces the query to use on-demand billing when set to `none`, which requires the project or organization to have `reservation_override_mode` set to `ALLOW_ANY_OVERRIDE`.",
    ).optional(),
  }).describe("Required. Describes the job configuration.").optional(),
  jobReference: z.object({
    jobId: z.string().describe(
      "Required. The ID of the job. The ID must contain only letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-). The maximum length is 1,024 characters.",
    ).optional(),
    location: z.string().describe(
      "Optional. The geographic location of the job. The default value is US. For more information about BigQuery locations, see: https://cloud.google.com/bigquery/docs/locations",
    ).optional(),
    projectId: z.string().describe(
      "Required. The ID of the project containing this job.",
    ).optional(),
  }).describe(
    "Optional. Reference describing the unique-per-user name of the job.",
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

/** Swamp extension model for Google Cloud BigQuery Jobs. Registered at `@swamp/gcp/bigquery/jobs`. */
export const model = {
  type: "@swamp/gcp/bigquery/jobs",
  version: "2026.09.17.3",
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
      toVersion: "2026.04.04.1",
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
      toVersion: "2026.05.19.3",
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
      toVersion: "2026.05.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.25.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.26.1",
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
      toVersion: "2026.06.16.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.06.24.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.02.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.07.17.1",
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
      description: "Removed: jobCreationReason, statistics, status",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          jobCreationReason: _jobCreationReason,
          statistics: _statistics,
          status: _status,
          ...rest
        } = old;
        return rest;
      },
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
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.07.2",
      description:
        "Removed: copy, createDisposition, destinationEncryptionConfiguration, kmsKeyName, destinationExpirationTime, destinationTable, datasetId, projectId, tableId, operationType, sourceTable, datasetId, projectId, tableId, sourceTables, datasetId, projectId, tableId, writeDisposition, dryRun, extract, compression, destinationFormat, destinationUri, destinationUris, fieldDelimiter, modelExtractOptions, trialId, printHeader, sourceModel, datasetId, modelId, projectId, sourceTable, datasetId, projectId, tableId, useAvroLogicalTypes, jobTimeoutMs, jobType, labels, load, allowJaggedRows, allowQuotedNewlines, autodetect, clustering, fields, columnNameCharacterMap, connectionProperties, key, value, copyFilesOnly, createDisposition, createSession, dateFormat, datetimeFormat, decimalTargetTypes, destinationEncryptionConfiguration, kmsKeyName, destinationTable, datasetId, projectId, tableId, destinationTableProperties, description, expirationTime, friendlyName, labels, encoding, fieldDelimiter, fileSetSpecType, hivePartitioningOptions, fields, mode, requirePartitionFilter, sourceUriPrefix, ignoreUnknownValues, jsonExtension, maxBadRecords, nullMarker, nullMarkers, parquetOptions, enableListInference, enumAsString, mapTargetType, preserveAsciiControlCharacters, projectionFields, quote, rangePartitioning, field, range, end, interval, start, referenceFileSchemaUri, schema, fields, categories, collation, dataGovernanceTagsInfo, dataPolicies, dataPolicyList, defaultValueExpression, description, fields, foreignTypeDefinition, generatedColumn, maxLength, mode, policyTags, precision, rangeElementType, roundingMode, scale, timestampPrecision, type, foreignTypeInfo, typeSystem, schemaInline, schemaInlineFormat, schemaUpdateOptions, skipLeadingRows, sourceColumnMatch, sourceFormat, sourceUris, timeFormat, timePartitioning, expirationMs, field, requirePartitionFilter, type, timeZone, timestampFormat, timestampTargetPrecision, useAvroLogicalTypes, writeDisposition, maxSlots, query, allowLargeResults, clustering, fields, connectionProperties, key, value, continuous, createDisposition, createSession, defaultDataset, datasetId, projectId, destinationEncryptionConfiguration, kmsKeyName, destinationTable, datasetId, projectId, tableId, flattenResults, maximumBillingTier, maximumBytesBilled, parameterMode, preserveNulls, priority, query, queryParameters, parameterType, arrayType, rangeElementType, structTypes, timestampPrecision, type, parameterValue, arrayValues, rangeValue, structValues, value, rangePartitioning, field, range, end, interval, start, schemaUpdateOptions, scriptOptions, keyResultStatement, statementByteBudget, statementTimeoutMs, systemVariables, types, arrayElementType, rangeElementType, structType, typeKind, values, tableDefinitions, autodetect, avroOptions, useAvroLogicalTypes, bigtableOptions, columnFamilies, ignoreUnspecifiedColumnFamilies, outputColumnFamiliesAsJson, readRowkeyAsString, compression, connectionId, csvOptions, allowJaggedRows, allowQuotedNewlines, encoding, fieldDelimiter, nullMarker, nullMarkers, preserveAsciiControlCharacters, quote, skipLeadingRows, sourceColumnMatch, dateFormat, datetimeFormat, decimalTargetTypes, fileSetSpecType, googleSheetsOptions, range, skipLeadingRows, hivePartitioningOptions, fields, mode, requirePartitionFilter, sourceUriPrefix, ignoreUnknownValues, jsonExtension, jsonOptions, encoding, maxBadRecords, metadataCacheMode, objectMetadata, parquetOptions, enableListInference, enumAsString, mapTargetType, referenceFileSchemaUri, schema, fields, foreignTypeInfo, sourceFormat, sourceUris, timeFormat, timeZone, timestampFormat, timestampTargetPrecision, timePartitioning, expirationMs, field, requirePartitionFilter, type, useLegacySql, useQueryCache, userDefinedFunctionResources, inlineCode, resourceUri, writeDisposition, writeIncrementalResults, reservation, jobId, location, projectId",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const {
          copy: _copy,
          createDisposition: _createDisposition,
          destinationEncryptionConfiguration:
            _destinationEncryptionConfiguration,
          kmsKeyName: _kmsKeyName,
          destinationExpirationTime: _destinationExpirationTime,
          destinationTable: _destinationTable,
          datasetId: _datasetId,
          projectId: _projectId,
          tableId: _tableId,
          operationType: _operationType,
          sourceTable: _sourceTable,
          sourceTables: _sourceTables,
          writeDisposition: _writeDisposition,
          dryRun: _dryRun,
          extract: _extract,
          compression: _compression,
          destinationFormat: _destinationFormat,
          destinationUri: _destinationUri,
          destinationUris: _destinationUris,
          fieldDelimiter: _fieldDelimiter,
          modelExtractOptions: _modelExtractOptions,
          trialId: _trialId,
          printHeader: _printHeader,
          sourceModel: _sourceModel,
          modelId: _modelId,
          useAvroLogicalTypes: _useAvroLogicalTypes,
          jobTimeoutMs: _jobTimeoutMs,
          jobType: _jobType,
          labels: _labels,
          load: _load,
          allowJaggedRows: _allowJaggedRows,
          allowQuotedNewlines: _allowQuotedNewlines,
          autodetect: _autodetect,
          clustering: _clustering,
          fields: _fields,
          columnNameCharacterMap: _columnNameCharacterMap,
          connectionProperties: _connectionProperties,
          key: _key,
          value: _value,
          copyFilesOnly: _copyFilesOnly,
          createSession: _createSession,
          dateFormat: _dateFormat,
          datetimeFormat: _datetimeFormat,
          decimalTargetTypes: _decimalTargetTypes,
          destinationTableProperties: _destinationTableProperties,
          description: _description,
          expirationTime: _expirationTime,
          friendlyName: _friendlyName,
          encoding: _encoding,
          fileSetSpecType: _fileSetSpecType,
          hivePartitioningOptions: _hivePartitioningOptions,
          mode: _mode,
          requirePartitionFilter: _requirePartitionFilter,
          sourceUriPrefix: _sourceUriPrefix,
          ignoreUnknownValues: _ignoreUnknownValues,
          jsonExtension: _jsonExtension,
          maxBadRecords: _maxBadRecords,
          nullMarker: _nullMarker,
          nullMarkers: _nullMarkers,
          parquetOptions: _parquetOptions,
          enableListInference: _enableListInference,
          enumAsString: _enumAsString,
          mapTargetType: _mapTargetType,
          preserveAsciiControlCharacters: _preserveAsciiControlCharacters,
          projectionFields: _projectionFields,
          quote: _quote,
          rangePartitioning: _rangePartitioning,
          field: _field,
          range: _range,
          end: _end,
          interval: _interval,
          start: _start,
          referenceFileSchemaUri: _referenceFileSchemaUri,
          schema: _schema,
          categories: _categories,
          collation: _collation,
          dataGovernanceTagsInfo: _dataGovernanceTagsInfo,
          dataPolicies: _dataPolicies,
          dataPolicyList: _dataPolicyList,
          defaultValueExpression: _defaultValueExpression,
          foreignTypeDefinition: _foreignTypeDefinition,
          generatedColumn: _generatedColumn,
          maxLength: _maxLength,
          policyTags: _policyTags,
          precision: _precision,
          rangeElementType: _rangeElementType,
          roundingMode: _roundingMode,
          scale: _scale,
          timestampPrecision: _timestampPrecision,
          type: _type,
          foreignTypeInfo: _foreignTypeInfo,
          typeSystem: _typeSystem,
          schemaInline: _schemaInline,
          schemaInlineFormat: _schemaInlineFormat,
          schemaUpdateOptions: _schemaUpdateOptions,
          skipLeadingRows: _skipLeadingRows,
          sourceColumnMatch: _sourceColumnMatch,
          sourceFormat: _sourceFormat,
          sourceUris: _sourceUris,
          timeFormat: _timeFormat,
          timePartitioning: _timePartitioning,
          expirationMs: _expirationMs,
          timeZone: _timeZone,
          timestampFormat: _timestampFormat,
          timestampTargetPrecision: _timestampTargetPrecision,
          maxSlots: _maxSlots,
          query: _query,
          allowLargeResults: _allowLargeResults,
          continuous: _continuous,
          defaultDataset: _defaultDataset,
          flattenResults: _flattenResults,
          maximumBillingTier: _maximumBillingTier,
          maximumBytesBilled: _maximumBytesBilled,
          parameterMode: _parameterMode,
          preserveNulls: _preserveNulls,
          priority: _priority,
          queryParameters: _queryParameters,
          parameterType: _parameterType,
          arrayType: _arrayType,
          structTypes: _structTypes,
          parameterValue: _parameterValue,
          arrayValues: _arrayValues,
          rangeValue: _rangeValue,
          structValues: _structValues,
          scriptOptions: _scriptOptions,
          keyResultStatement: _keyResultStatement,
          statementByteBudget: _statementByteBudget,
          statementTimeoutMs: _statementTimeoutMs,
          systemVariables: _systemVariables,
          types: _types,
          arrayElementType: _arrayElementType,
          structType: _structType,
          typeKind: _typeKind,
          values: _values,
          tableDefinitions: _tableDefinitions,
          avroOptions: _avroOptions,
          bigtableOptions: _bigtableOptions,
          columnFamilies: _columnFamilies,
          ignoreUnspecifiedColumnFamilies: _ignoreUnspecifiedColumnFamilies,
          outputColumnFamiliesAsJson: _outputColumnFamiliesAsJson,
          readRowkeyAsString: _readRowkeyAsString,
          connectionId: _connectionId,
          csvOptions: _csvOptions,
          googleSheetsOptions: _googleSheetsOptions,
          jsonOptions: _jsonOptions,
          metadataCacheMode: _metadataCacheMode,
          objectMetadata: _objectMetadata,
          useLegacySql: _useLegacySql,
          useQueryCache: _useQueryCache,
          userDefinedFunctionResources: _userDefinedFunctionResources,
          inlineCode: _inlineCode,
          resourceUri: _resourceUri,
          writeIncrementalResults: _writeIncrementalResults,
          reservation: _reservation,
          jobId: _jobId,
          location: _location,
          ...rest
        } = old;
        return rest;
      },
    },
    {
      toVersion: "2026.09.17.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.2",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.17.3",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description:
        "Returns information about a specific job. Job information is available for a ...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a jobs",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        const body: Record<string, unknown> = {};
        if (g["configuration"] !== undefined) {
          body["configuration"] = g["configuration"];
        }
        if (g["jobReference"] !== undefined) {
          body["jobReference"] = g["jobReference"];
        }
        if (g["name"] !== undefined) params["jobId"] = String(g["name"]);
        const result = await createResource(
          baseUrl,
          INSERT_CONFIG,
          params,
          body,
          GET_CONFIG,
          undefined,
          undefined,
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
      description: "Get a jobs",
      arguments: z.object({
        identifier: z.string().describe("The name of the jobs"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        params["jobId"] = args.identifier;
        const result = await readResource(
          baseUrl,
          GET_CONFIG,
          params,
          credentials,
        ) as StateData;
        const instanceName = (g.name?.toString() ?? args.identifier).replace(
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
    delete: {
      description: "Delete the jobs",
      arguments: z.object({
        identifier: z.string().describe("The name of the jobs"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        params["jobId"] = args.identifier;
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
      description: "Sync jobs state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific jobs by name (e.g. one discovered by list)",
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
          const params: Record<string, string> = { projectId: projectId };
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["jobId"] = identifier;
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
      description: "List jobs resources",
      arguments: z.object({
        allUsers: z.boolean().describe(
          "Whether to display jobs owned by all users in the project. Default False.",
        ).optional(),
        maxCreationTime: z.string().describe(
          "Max value for job creation time, in milliseconds since the POSIX epoch. If set, only jobs created before or at this timestamp are returned.",
        ).optional(),
        maxResults: z.number().describe(
          "The maximum number of results to return in a single response page. Leverage the page tokens to iterate through the entire collection.",
        ).optional(),
        minCreationTime: z.string().describe(
          "Min value for job creation time, in milliseconds since the POSIX epoch. If set, only jobs created after or at this timestamp are returned.",
        ).optional(),
        parentJobId: z.string().describe(
          "If set, show only child jobs of the specified parent. Otherwise, show all top-level jobs.",
        ).optional(),
        projection: z.string().describe(
          "Restrict information returned to a set of selected fields",
        ).optional(),
        stateFilter: z.string().describe("Filter for job state").optional(),
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
        const params: Record<string, string> = { projectId: projectId };
        if (args["allUsers"] !== undefined) {
          params["allUsers"] = String(args["allUsers"]);
        }
        if (args["maxCreationTime"] !== undefined) {
          params["maxCreationTime"] = String(args["maxCreationTime"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["minCreationTime"] !== undefined) {
          params["minCreationTime"] = String(args["minCreationTime"]);
        }
        if (args["parentJobId"] !== undefined) {
          params["parentJobId"] = String(args["parentJobId"]);
        }
        if (args["projection"] !== undefined) {
          params["projection"] = String(args["projection"]);
        }
        if (args["stateFilter"] !== undefined) {
          params["stateFilter"] = String(args["stateFilter"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "jobs",
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
    cancel: {
      description: "cancel",
      arguments: z.object({
        location: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
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
        params["jobId"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "bigquery.jobs.cancel",
            "path": "projects/{+projectId}/jobs/{+jobId}/cancel",
            "httpMethod": "POST",
            "parameterOrder": ["projectId", "jobId"],
            "parameters": {
              "jobId": { "location": "path", "required": true },
              "location": { "location": "query" },
              "projectId": { "location": "path", "required": true },
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
    get_query_results: {
      description: "get query results",
      arguments: z.object({
        formatOptions_timestampOutputFormat: z.any().optional(),
        formatOptions_useInt64Timestamp: z.any().optional(),
        location: z.any().optional(),
        maxResults: z.any().optional(),
        pageToken: z.any().optional(),
        startIndex: z.any().optional(),
        timeoutMs: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
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
        params["jobId"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        if (args["formatOptions_timestampOutputFormat"] !== undefined) {
          params["formatOptions.timestampOutputFormat"] = String(
            args["formatOptions_timestampOutputFormat"],
          );
        }
        if (args["formatOptions_useInt64Timestamp"] !== undefined) {
          params["formatOptions.useInt64Timestamp"] = String(
            args["formatOptions_useInt64Timestamp"],
          );
        }
        if (args["location"] !== undefined) {
          params["location"] = String(args["location"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["pageToken"] !== undefined) {
          params["pageToken"] = String(args["pageToken"]);
        }
        if (args["startIndex"] !== undefined) {
          params["startIndex"] = String(args["startIndex"]);
        }
        if (args["timeoutMs"] !== undefined) {
          params["timeoutMs"] = String(args["timeoutMs"]);
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "bigquery.jobs.getQueryResults",
            "path": "projects/{+projectId}/queries/{+jobId}",
            "httpMethod": "GET",
            "parameterOrder": ["projectId", "jobId"],
            "parameters": {
              "formatOptions.timestampOutputFormat": { "location": "query" },
              "formatOptions.useInt64Timestamp": { "location": "query" },
              "jobId": { "location": "path", "required": true },
              "location": { "location": "query" },
              "maxResults": { "location": "query" },
              "pageToken": { "location": "query" },
              "projectId": { "location": "path", "required": true },
              "startIndex": { "location": "query" },
              "timeoutMs": { "location": "query" },
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
    query: {
      description: "query",
      arguments: z.object({
        arrowSerializationOptions: z.any().optional(),
        connectionProperties: z.any().optional(),
        continuous: z.any().optional(),
        createSession: z.any().optional(),
        defaultDataset: z.any().optional(),
        destinationEncryptionConfiguration: z.any().optional(),
        dryRun: z.any().optional(),
        formatOptions: z.any().optional(),
        jobCreationMode: z.any().optional(),
        jobTimeoutMs: z.any().optional(),
        kind: z.any().optional(),
        labels: z.any().optional(),
        location: z.any().optional(),
        maxResults: z.any().optional(),
        maxSlots: z.any().optional(),
        maximumBytesBilled: z.any().optional(),
        parameterMode: z.any().optional(),
        preserveNulls: z.any().optional(),
        query: z.any().optional(),
        queryParameters: z.any().optional(),
        queryResultsFormat: z.any().optional(),
        requestId: z.any().optional(),
        reservation: z.any().optional(),
        timeoutMs: z.any().optional(),
        useLegacySql: z.any().optional(),
        useQueryCache: z.any().optional(),
        writeIncrementalResults: z.any().optional(),
      }),
      execute: async (args: Record<string, unknown>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        const body: Record<string, unknown> = {};
        if (args["arrowSerializationOptions"] !== undefined) {
          body["arrowSerializationOptions"] = args["arrowSerializationOptions"];
        }
        if (args["connectionProperties"] !== undefined) {
          body["connectionProperties"] = args["connectionProperties"];
        }
        if (args["continuous"] !== undefined) {
          body["continuous"] = args["continuous"];
        }
        if (args["createSession"] !== undefined) {
          body["createSession"] = args["createSession"];
        }
        if (args["defaultDataset"] !== undefined) {
          body["defaultDataset"] = args["defaultDataset"];
        }
        if (args["destinationEncryptionConfiguration"] !== undefined) {
          body["destinationEncryptionConfiguration"] =
            args["destinationEncryptionConfiguration"];
        }
        if (args["dryRun"] !== undefined) body["dryRun"] = args["dryRun"];
        if (args["formatOptions"] !== undefined) {
          body["formatOptions"] = args["formatOptions"];
        }
        if (args["jobCreationMode"] !== undefined) {
          body["jobCreationMode"] = args["jobCreationMode"];
        }
        if (args["jobTimeoutMs"] !== undefined) {
          body["jobTimeoutMs"] = args["jobTimeoutMs"];
        }
        if (args["kind"] !== undefined) body["kind"] = args["kind"];
        if (args["labels"] !== undefined) body["labels"] = args["labels"];
        if (args["location"] !== undefined) body["location"] = args["location"];
        if (args["maxResults"] !== undefined) {
          body["maxResults"] = args["maxResults"];
        }
        if (args["maxSlots"] !== undefined) body["maxSlots"] = args["maxSlots"];
        if (args["maximumBytesBilled"] !== undefined) {
          body["maximumBytesBilled"] = args["maximumBytesBilled"];
        }
        if (args["parameterMode"] !== undefined) {
          body["parameterMode"] = args["parameterMode"];
        }
        if (args["preserveNulls"] !== undefined) {
          body["preserveNulls"] = args["preserveNulls"];
        }
        if (args["query"] !== undefined) body["query"] = args["query"];
        if (args["queryParameters"] !== undefined) {
          body["queryParameters"] = args["queryParameters"];
        }
        if (args["queryResultsFormat"] !== undefined) {
          body["queryResultsFormat"] = args["queryResultsFormat"];
        }
        if (args["requestId"] !== undefined) {
          body["requestId"] = args["requestId"];
        }
        if (args["reservation"] !== undefined) {
          body["reservation"] = args["reservation"];
        }
        if (args["timeoutMs"] !== undefined) {
          body["timeoutMs"] = args["timeoutMs"];
        }
        if (args["useLegacySql"] !== undefined) {
          body["useLegacySql"] = args["useLegacySql"];
        }
        if (args["useQueryCache"] !== undefined) {
          body["useQueryCache"] = args["useQueryCache"];
        }
        if (args["writeIncrementalResults"] !== undefined) {
          body["writeIncrementalResults"] = args["writeIncrementalResults"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "bigquery.jobs.query",
            "path": "projects/{+projectId}/queries",
            "httpMethod": "POST",
            "parameterOrder": ["projectId"],
            "parameters": {
              "projectId": { "location": "path", "required": true },
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
    ...bigqueryQueryMethods,
  },
};
