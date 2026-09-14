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

// Auto-generated extension model for @swamp/gcp/bigquery/routines
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud BigQuery Routines.
 *
 * A user-defined function or a stored procedure.
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

const BASE_URL = "https://bigquery.googleapis.com/bigquery/v2/";

const GET_CONFIG = {
  "id": "bigquery.routines.get",
  "path": "projects/{+projectId}/datasets/{+datasetId}/routines/{+routineId}",
  "httpMethod": "GET",
  "parameterOrder": [
    "projectId",
    "datasetId",
    "routineId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "readMask": {
      "location": "query",
    },
    "routineId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const INSERT_CONFIG = {
  "id": "bigquery.routines.insert",
  "path": "projects/{+projectId}/datasets/{+datasetId}/routines",
  "httpMethod": "POST",
  "parameterOrder": [
    "projectId",
    "datasetId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const UPDATE_CONFIG = {
  "id": "bigquery.routines.update",
  "path": "projects/{+projectId}/datasets/{+datasetId}/routines/{+routineId}",
  "httpMethod": "PUT",
  "parameterOrder": [
    "projectId",
    "datasetId",
    "routineId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "routineId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "bigquery.routines.delete",
  "path": "projects/{+projectId}/datasets/{+datasetId}/routines/{+routineId}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "projectId",
    "datasetId",
    "routineId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "routineId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "bigquery.routines.list",
  "path": "projects/{+projectId}/datasets/{+datasetId}/routines",
  "httpMethod": "GET",
  "parameterOrder": [
    "projectId",
    "datasetId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "filter": {
      "location": "query",
    },
    "maxResults": {
      "location": "query",
    },
    "pageToken": {
      "location": "query",
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
    "readMask": {
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
  arguments: z.array(z.object({
    argumentKind: z.enum([
      "ARGUMENT_KIND_UNSPECIFIED",
      "FIXED_TYPE",
      "ANY_TYPE",
      "FIXED_TABLE",
      "ANY_TABLE",
    ]).describe("Optional. Defaults to FIXED_TYPE.").optional(),
    dataType: z.object({
      arrayElementType: z.record(z.string(), z.unknown()).describe(
        "Circular reference to StandardSqlDataType",
      ).optional(),
      rangeElementType: z.record(z.string(), z.unknown()).describe(
        "Circular reference to StandardSqlDataType",
      ).optional(),
      structType: z.object({
        fields: z.array(z.unknown()).describe("Fields within the struct.")
          .optional(),
      }).describe(
        'The fields of this struct, in order, if type_kind = "STRUCT".',
      ).optional(),
      typeKind: z.enum([
        "TYPE_KIND_UNSPECIFIED",
        "INT64",
        "BOOL",
        "FLOAT64",
        "STRING",
        "BYTES",
        "TIMESTAMP",
        "DATE",
        "TIME",
        "DATETIME",
        "INTERVAL",
        "GEOGRAPHY",
        "NUMERIC",
        "BIGNUMERIC",
        "JSON",
        "ARRAY",
        "STRUCT",
        "RANGE",
        "UUID",
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe("Set if argument_kind == FIXED_TYPE.").optional(),
    isAggregate: z.boolean().describe(
      'Optional. Whether the argument is an aggregate function parameter. Must be Unset for routine types other than AGGREGATE_FUNCTION. For AGGREGATE_FUNCTION, if set to false, it is equivalent to adding "NOT AGGREGATE" clause in DDL; Otherwise, it is equivalent to omitting "NOT AGGREGATE" clause in DDL.',
    ).optional(),
    mode: z.enum(["MODE_UNSPECIFIED", "IN", "OUT", "INOUT"]).describe(
      "Optional. Specifies whether the argument is input or output. Can be set for procedures only.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of this argument. Can be absent for function return argument.",
    ).optional(),
    tableType: z.object({
      columns: z.array(z.object({
        name: z.unknown().describe(
          "Optional. The name of this field. Can be absent for struct fields.",
        ).optional(),
        type: z.unknown().describe(
          'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
        ).optional(),
      })).describe("The columns in this table type").optional(),
    }).describe("Optional. Set if argument_kind == FIXED_TABLE.").optional(),
  })).describe("Optional.").optional(),
  dataGovernanceType: z.enum([
    "DATA_GOVERNANCE_TYPE_UNSPECIFIED",
    "DATA_MASKING",
  ]).describe(
    "Optional. If set to `DATA_MASKING`, the function is validated and made available as a masking function. For more information, see [Create custom masking routines](https://cloud.google.com/bigquery/docs/user-defined-functions#custom-mask).",
  ).optional(),
  definitionBody: z.string().describe(
    'Required. The body of the routine. For functions, this is the expression in the AS clause. If `language = "SQL"`, it is the substring inside (but excluding) the parentheses. For example, for the function created with the following statement: `CREATE FUNCTION JoinLines(x string, y string) as (concat(x, "\\n", y))` The definition_body is `concat(x, "\\n", y)` (\\n is not replaced with linebreak). If `language="JAVASCRIPT"`, it is the evaluated string in the AS clause. For example, for the function created with the following statement: `CREATE FUNCTION f() RETURNS STRING LANGUAGE js AS \'return "\\n";\\n\'` The definition_body is `return "\\n";\\n` Note that both \\n are replaced with linebreaks. If `definition_body` references another routine, then that routine must be fully qualified with its project ID.',
  ).optional(),
  description: z.string().describe(
    "Optional. The description of the routine, if defined.",
  ).optional(),
  determinismLevel: z.enum([
    "DETERMINISM_LEVEL_UNSPECIFIED",
    "DETERMINISTIC",
    "NOT_DETERMINISTIC",
  ]).describe(
    "Optional. The determinism level of the JavaScript UDF, if defined.",
  ).optional(),
  externalRuntimeOptions: z.object({
    containerCpu: z.number().describe(
      "Optional. Amount of CPU provisioned for a Python UDF container instance. For more information, see [Configure container limits for Python UDFs](https://cloud.google.com/bigquery/docs/user-defined-functions-python#configure-container-limits)",
    ).optional(),
    containerMemory: z.string().describe(
      'Optional. Amount of memory provisioned for a Python UDF container instance. Format: {number}{unit} where unit is one of "M", "G", "Mi" and "Gi" (e.g. 1G, 512Mi). If not specified, the default value is 512Mi. For more information, see [Configure container limits for Python UDFs](https://cloud.google.com/bigquery/docs/user-defined-functions-python#configure-container-limits)',
    ).optional(),
    containerRequestConcurrency: z.string().describe(
      "Optional. Maximum number of requests that a Python UDF instance can handle concurrently. If absent or if `0`, the default concurrency value is used. For more information, see [Configure container limits for Python UDFs](https://cloud.google.com/bigquery/docs/user-defined-functions-python#configure-container-limits).",
    ).optional(),
    maxBatchingRows: z.string().describe(
      "Optional. Maximum number of rows in each batch sent to the external runtime. If absent or if 0, BigQuery dynamically decides the number of rows in a batch.",
    ).optional(),
    runtimeConnection: z.string().describe(
      'Optional. Fully qualified name of the connection whose service account will be used to execute the code in the container. Format: ` "projects/{project_id}/locations/{location_id}/connections/{connection_id}" `',
    ).optional(),
    runtimeVersion: z.string().describe(
      "Optional. Language runtime version. Example: `python-3.11`.",
    ).optional(),
    volumeMounts: z.array(z.object({
      mountPath: z.string().describe(
        "Optional. The absolute path within the container where the volume should be mounted.",
      ).optional(),
      sourcePath: z.string().describe(
        "Optional. The absolute path of the source to be mounted, only support Google Cloud Storage bucket or folder now. Eg: gs://bucket-xxx for Google Cloud Storage bucket, gs://bucket-xxx/folder1/folder2 for Google Cloud Storage folder.",
      ).optional(),
    })).describe(
      "Optional. List of volume mounts for the Python UDF container that executes the managed function.",
    ).optional(),
  }).describe(
    "Optional. Options for the runtime of the external system executing the routine. This field is only applicable for Python UDFs. [Preview](https://cloud.google.com/products/#product-launch-stages)",
  ).optional(),
  importedLibraries: z.array(z.string()).describe(
    'Optional. If language = "JAVASCRIPT", this field stores the path of the imported JAVASCRIPT libraries.',
  ).optional(),
  language: z.enum([
    "LANGUAGE_UNSPECIFIED",
    "SQL",
    "JAVASCRIPT",
    "PYTHON",
    "JAVA",
    "SCALA",
  ]).describe(
    'Optional. Defaults to "SQL" if remote_function_options field is absent, not set otherwise.',
  ).optional(),
  pythonOptions: z.object({
    entryPoint: z.string().describe(
      "Required. The name of the function defined in Python code as the entry point when the Python UDF is invoked.",
    ).optional(),
    packages: z.array(z.string()).describe(
      'Optional. A list of Python package names along with versions to be installed. Example: ["pandas>=2.1", "google-cloud-translate==3.11"]. For more information, see [Use third-party packages](https://cloud.google.com/bigquery/docs/user-defined-functions-python#third-party-packages).',
    ).optional(),
  }).describe(
    "Optional. Options for the Python UDF. [Preview](https://cloud.google.com/products/#product-launch-stages)",
  ).optional(),
  remoteFunctionOptions: z.object({
    connection: z.string().describe(
      'Fully qualified name of the user-provided connection object which holds the authentication information to send requests to the remote service. Format: ` "projects/{projectId}/locations/{locationId}/connections/{connectionId}" `',
    ).optional(),
    endpoint: z.string().describe(
      "Endpoint of the user-provided remote service, e.g. ` https://us-east1-my_gcf_project.cloudfunctions.net/remote_add `",
    ).optional(),
    maxBatchingRows: z.string().describe(
      "Max number of rows in each batch sent to the remote service. If absent or if 0, BigQuery dynamically decides the number of rows in a batch.",
    ).optional(),
    userDefinedContext: z.record(z.string(), z.string()).describe(
      "User-defined context as a set of key/value pairs, which will be sent as function invocation context together with batched arguments in the requests to the remote service. The total number of bytes of keys and values must be less than 8KB.",
    ).optional(),
  }).describe("Optional. Remote function specific options.").optional(),
  returnTableType: z.object({
    columns: z.array(z.object({
      name: z.string().describe(
        "Optional. The name of this field. Can be absent for struct fields.",
      ).optional(),
      type: z.object({
        arrayElementType: z.record(z.string(), z.unknown()).describe(
          "Circular reference to StandardSqlDataType",
        ).optional(),
        rangeElementType: z.record(z.string(), z.unknown()).describe(
          "Circular reference to StandardSqlDataType",
        ).optional(),
        structType: z.object({
          fields: z.unknown().describe("Fields within the struct.").optional(),
        }).describe(
          'The fields of this struct, in order, if type_kind = "STRUCT".',
        ).optional(),
        typeKind: z.enum([
          "TYPE_KIND_UNSPECIFIED",
          "INT64",
          "BOOL",
          "FLOAT64",
          "STRING",
          "BYTES",
          "TIMESTAMP",
          "DATE",
          "TIME",
          "DATETIME",
          "INTERVAL",
          "GEOGRAPHY",
          "NUMERIC",
          "BIGNUMERIC",
          "JSON",
          "ARRAY",
          "STRUCT",
          "RANGE",
          "UUID",
        ]).describe(
          'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
        ).optional(),
      }).describe(
        'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
      ).optional(),
    })).describe("The columns in this table type").optional(),
  }).describe(
    'Optional. Can be set only if routine_type = "TABLE_VALUED_FUNCTION". If absent, the return table type is inferred from definition_body at query time in each query that references this routine. If present, then the columns in the evaluated table result will be cast to match the column types specified in return table type, at query time.',
  ).optional(),
  returnType: z.object({
    arrayElementType: z.record(z.string(), z.unknown()).describe(
      "Circular reference to StandardSqlDataType",
    ).optional(),
    rangeElementType: z.record(z.string(), z.unknown()).describe(
      "Circular reference to StandardSqlDataType",
    ).optional(),
    structType: z.object({
      fields: z.array(z.object({
        name: z.string().describe(
          "Optional. The name of this field. Can be absent for struct fields.",
        ).optional(),
        type: z.record(z.string(), z.unknown()).describe(
          "Circular reference to StandardSqlDataType",
        ).optional(),
      })).describe("Fields within the struct.").optional(),
    }).describe('The fields of this struct, in order, if type_kind = "STRUCT".')
      .optional(),
    typeKind: z.enum([
      "TYPE_KIND_UNSPECIFIED",
      "INT64",
      "BOOL",
      "FLOAT64",
      "STRING",
      "BYTES",
      "TIMESTAMP",
      "DATE",
      "TIME",
      "DATETIME",
      "INTERVAL",
      "GEOGRAPHY",
      "NUMERIC",
      "BIGNUMERIC",
      "JSON",
      "ARRAY",
      "STRUCT",
      "RANGE",
      "UUID",
    ]).describe(
      'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
    ).optional(),
  }).describe(
    'Optional if language = "SQL"; required otherwise. Cannot be set if routine_type = "TABLE_VALUED_FUNCTION". If absent, the return type is inferred from definition_body at query time in each query that references this routine. If present, then the evaluated result will be cast to the specified returned type at query time. For example, for the functions created with the following statements: * `CREATE FUNCTION Add(x FLOAT64, y FLOAT64) RETURNS FLOAT64 AS (x + y);` * `CREATE FUNCTION Increment(x FLOAT64) AS (Add(x, 1));` * `CREATE FUNCTION Decrement(x FLOAT64) RETURNS FLOAT64 AS (Add(x, -1));` The return_type is `{type_kind: "FLOAT64"}` for `Add` and `Decrement`, and is absent for `Increment` (inferred as FLOAT64 at query time). Suppose the function `Add` is replaced by `CREATE OR REPLACE FUNCTION Add(x INT64, y INT64) AS (x + y);` Then the inferred return type of `Increment` is automatically changed to INT64 at query time, while the return type of `Decrement` remains FLOAT64.',
  ).optional(),
  routineReference: z.object({
    datasetId: z.string().describe(
      "Required. The ID of the dataset containing this routine.",
    ).optional(),
    projectId: z.string().describe(
      "Required. The ID of the project containing this routine.",
    ).optional(),
    routineId: z.string().describe(
      "Required. The ID of the routine. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 256 characters.",
    ).optional(),
  }).describe("Required. Reference describing the ID of this routine.")
    .optional(),
  routineType: z.enum([
    "ROUTINE_TYPE_UNSPECIFIED",
    "SCALAR_FUNCTION",
    "PROCEDURE",
    "TABLE_VALUED_FUNCTION",
    "AGGREGATE_FUNCTION",
  ]).describe("Required. The type of routine.").optional(),
  securityMode: z.enum(["SECURITY_MODE_UNSPECIFIED", "DEFINER", "INVOKER"])
    .describe(
      "Optional. The security mode of the routine, if defined. If not defined, the security mode is automatically determined from the routine's configuration.",
    ).optional(),
  sparkOptions: z.object({
    archiveUris: z.array(z.string()).describe(
      "Archive files to be extracted into the working directory of each executor. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    connection: z.string().describe(
      'Fully qualified name of the user-provided Spark connection object. Format: ` "projects/{project_id}/locations/{location_id}/connections/{connection_id}" `',
    ).optional(),
    containerImage: z.string().describe(
      "Custom container image for the runtime environment.",
    ).optional(),
    fileUris: z.array(z.string()).describe(
      "Files to be placed in the working directory of each executor. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    jarUris: z.array(z.string()).describe(
      "JARs to include on the driver and executor CLASSPATH. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    mainClass: z.string().describe(
      "The fully qualified name of a class in jar_uris, for example, com.example.wordcount. Exactly one of main_class and main_jar_uri field should be set for Java/Scala language type.",
    ).optional(),
    mainFileUri: z.string().describe(
      "The main file/jar URI of the Spark application. Exactly one of the definition_body field and the main_file_uri field must be set for Python. Exactly one of main_class and main_file_uri field should be set for Java/Scala language type.",
    ).optional(),
    properties: z.record(z.string(), z.string()).describe(
      "Configuration properties as a set of key/value pairs, which will be passed on to the Spark application. For more information, see [Apache Spark](https://spark.apache.org/docs/latest/index.html) and the [procedure option list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#procedure_option_list).",
    ).optional(),
    pyFileUris: z.array(z.string()).describe(
      "Python files to be placed on the PYTHONPATH for PySpark application. Supported file types: `.py`, `.egg`, and `.zip`. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    runtimeVersion: z.string().describe(
      "Runtime version. If not specified, the default runtime version is used.",
    ).optional(),
  }).describe("Optional. Spark specific options.").optional(),
  strictMode: z.boolean().describe(
    "Optional. Use this option to catch many common errors. Error checking is not exhaustive, and successfully creating a procedure doesn't guarantee that the procedure will successfully execute at runtime. If `strictMode` is set to `TRUE`, the procedure body is further checked for errors such as non-existent tables or columns. The `CREATE PROCEDURE` statement fails if the body fails any of these checks. If `strictMode` is set to `FALSE`, the procedure body is checked only for syntax. For procedures that invoke themselves recursively, specify `strictMode=FALSE` to avoid non-existent procedure errors during validation. Default value is `TRUE`.",
  ).optional(),
  datasetId: z.string().describe("Required. Dataset ID of the new routine"),
});

const StateSchema = z.object({
  arguments: z.array(z.object({
    argumentKind: z.string(),
    dataType: z.object({
      arrayElementType: z.record(z.string(), z.unknown()),
      rangeElementType: z.record(z.string(), z.unknown()),
      structType: z.object({
        fields: z.array(z.unknown()),
      }),
      typeKind: z.string(),
    }),
    isAggregate: z.boolean(),
    mode: z.string(),
    name: z.string(),
    tableType: z.object({
      columns: z.array(z.object({
        name: z.unknown(),
        type: z.unknown(),
      })),
    }),
  })).optional(),
  buildStatus: z.object({
    buildDuration: z.string(),
    buildState: z.string(),
    buildStateUpdateTime: z.string(),
    errorResult: z.object({
      debugInfo: z.string(),
      location: z.string(),
      message: z.string(),
      reason: z.string(),
    }),
    imageSizeBytes: z.string(),
  }).optional(),
  creationTime: z.string().optional(),
  dataGovernanceType: z.string().optional(),
  definitionBody: z.string().optional(),
  description: z.string().optional(),
  determinismLevel: z.string().optional(),
  etag: z.string().optional(),
  externalRuntimeOptions: z.object({
    containerCpu: z.number(),
    containerMemory: z.string(),
    containerRequestConcurrency: z.string(),
    maxBatchingRows: z.string(),
    runtimeConnection: z.string(),
    runtimeVersion: z.string(),
    volumeMounts: z.array(z.object({
      mountPath: z.string(),
      sourcePath: z.string(),
    })),
  }).optional(),
  importedLibraries: z.array(z.string()).optional(),
  language: z.string().optional(),
  lastModifiedTime: z.string().optional(),
  pythonOptions: z.object({
    entryPoint: z.string(),
    packages: z.array(z.string()),
  }).optional(),
  remoteFunctionOptions: z.object({
    connection: z.string(),
    endpoint: z.string(),
    maxBatchingRows: z.string(),
    userDefinedContext: z.record(z.string(), z.unknown()),
  }).optional(),
  returnTableType: z.object({
    columns: z.array(z.object({
      name: z.string(),
      type: z.object({
        arrayElementType: z.record(z.string(), z.unknown()),
        rangeElementType: z.record(z.string(), z.unknown()),
        structType: z.object({
          fields: z.unknown(),
        }),
        typeKind: z.string(),
      }),
    })),
  }).optional(),
  returnType: z.object({
    arrayElementType: z.record(z.string(), z.unknown()),
    rangeElementType: z.record(z.string(), z.unknown()),
    structType: z.object({
      fields: z.array(z.object({
        name: z.string(),
        type: z.record(z.string(), z.unknown()),
      })),
    }),
    typeKind: z.string(),
  }).optional(),
  routineReference: z.object({
    datasetId: z.string(),
    projectId: z.string(),
    routineId: z.string(),
  }).optional(),
  routineType: z.string().optional(),
  securityMode: z.string().optional(),
  sparkOptions: z.object({
    archiveUris: z.array(z.string()),
    connection: z.string(),
    containerImage: z.string(),
    fileUris: z.array(z.string()),
    jarUris: z.array(z.string()),
    mainClass: z.string(),
    mainFileUri: z.string(),
    properties: z.record(z.string(), z.unknown()),
    pyFileUris: z.array(z.string()),
    runtimeVersion: z.string(),
  }).optional(),
  strictMode: z.boolean().optional(),
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
  arguments: z.array(z.object({
    argumentKind: z.enum([
      "ARGUMENT_KIND_UNSPECIFIED",
      "FIXED_TYPE",
      "ANY_TYPE",
      "FIXED_TABLE",
      "ANY_TABLE",
    ]).describe("Optional. Defaults to FIXED_TYPE.").optional(),
    dataType: z.object({
      arrayElementType: z.record(z.string(), z.unknown()).describe(
        "Circular reference to StandardSqlDataType",
      ).optional(),
      rangeElementType: z.record(z.string(), z.unknown()).describe(
        "Circular reference to StandardSqlDataType",
      ).optional(),
      structType: z.object({
        fields: z.array(z.unknown()).describe("Fields within the struct.")
          .optional(),
      }).describe(
        'The fields of this struct, in order, if type_kind = "STRUCT".',
      ).optional(),
      typeKind: z.enum([
        "TYPE_KIND_UNSPECIFIED",
        "INT64",
        "BOOL",
        "FLOAT64",
        "STRING",
        "BYTES",
        "TIMESTAMP",
        "DATE",
        "TIME",
        "DATETIME",
        "INTERVAL",
        "GEOGRAPHY",
        "NUMERIC",
        "BIGNUMERIC",
        "JSON",
        "ARRAY",
        "STRUCT",
        "RANGE",
        "UUID",
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe("Set if argument_kind == FIXED_TYPE.").optional(),
    isAggregate: z.boolean().describe(
      'Optional. Whether the argument is an aggregate function parameter. Must be Unset for routine types other than AGGREGATE_FUNCTION. For AGGREGATE_FUNCTION, if set to false, it is equivalent to adding "NOT AGGREGATE" clause in DDL; Otherwise, it is equivalent to omitting "NOT AGGREGATE" clause in DDL.',
    ).optional(),
    mode: z.enum(["MODE_UNSPECIFIED", "IN", "OUT", "INOUT"]).describe(
      "Optional. Specifies whether the argument is input or output. Can be set for procedures only.",
    ).optional(),
    name: z.string().describe(
      "Optional. The name of this argument. Can be absent for function return argument.",
    ).optional(),
    tableType: z.object({
      columns: z.array(z.object({
        name: z.unknown().describe(
          "Optional. The name of this field. Can be absent for struct fields.",
        ).optional(),
        type: z.unknown().describe(
          'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
        ).optional(),
      })).describe("The columns in this table type").optional(),
    }).describe("Optional. Set if argument_kind == FIXED_TABLE.").optional(),
  })).describe("Optional.").optional(),
  dataGovernanceType: z.enum([
    "DATA_GOVERNANCE_TYPE_UNSPECIFIED",
    "DATA_MASKING",
  ]).describe(
    "Optional. If set to `DATA_MASKING`, the function is validated and made available as a masking function. For more information, see [Create custom masking routines](https://cloud.google.com/bigquery/docs/user-defined-functions#custom-mask).",
  ).optional(),
  definitionBody: z.string().describe(
    'Required. The body of the routine. For functions, this is the expression in the AS clause. If `language = "SQL"`, it is the substring inside (but excluding) the parentheses. For example, for the function created with the following statement: `CREATE FUNCTION JoinLines(x string, y string) as (concat(x, "\\n", y))` The definition_body is `concat(x, "\\n", y)` (\\n is not replaced with linebreak). If `language="JAVASCRIPT"`, it is the evaluated string in the AS clause. For example, for the function created with the following statement: `CREATE FUNCTION f() RETURNS STRING LANGUAGE js AS \'return "\\n";\\n\'` The definition_body is `return "\\n";\\n` Note that both \\n are replaced with linebreaks. If `definition_body` references another routine, then that routine must be fully qualified with its project ID.',
  ).optional(),
  description: z.string().describe(
    "Optional. The description of the routine, if defined.",
  ).optional(),
  determinismLevel: z.enum([
    "DETERMINISM_LEVEL_UNSPECIFIED",
    "DETERMINISTIC",
    "NOT_DETERMINISTIC",
  ]).describe(
    "Optional. The determinism level of the JavaScript UDF, if defined.",
  ).optional(),
  externalRuntimeOptions: z.object({
    containerCpu: z.number().describe(
      "Optional. Amount of CPU provisioned for a Python UDF container instance. For more information, see [Configure container limits for Python UDFs](https://cloud.google.com/bigquery/docs/user-defined-functions-python#configure-container-limits)",
    ).optional(),
    containerMemory: z.string().describe(
      'Optional. Amount of memory provisioned for a Python UDF container instance. Format: {number}{unit} where unit is one of "M", "G", "Mi" and "Gi" (e.g. 1G, 512Mi). If not specified, the default value is 512Mi. For more information, see [Configure container limits for Python UDFs](https://cloud.google.com/bigquery/docs/user-defined-functions-python#configure-container-limits)',
    ).optional(),
    containerRequestConcurrency: z.string().describe(
      "Optional. Maximum number of requests that a Python UDF instance can handle concurrently. If absent or if `0`, the default concurrency value is used. For more information, see [Configure container limits for Python UDFs](https://cloud.google.com/bigquery/docs/user-defined-functions-python#configure-container-limits).",
    ).optional(),
    maxBatchingRows: z.string().describe(
      "Optional. Maximum number of rows in each batch sent to the external runtime. If absent or if 0, BigQuery dynamically decides the number of rows in a batch.",
    ).optional(),
    runtimeConnection: z.string().describe(
      'Optional. Fully qualified name of the connection whose service account will be used to execute the code in the container. Format: ` "projects/{project_id}/locations/{location_id}/connections/{connection_id}" `',
    ).optional(),
    runtimeVersion: z.string().describe(
      "Optional. Language runtime version. Example: `python-3.11`.",
    ).optional(),
    volumeMounts: z.array(z.object({
      mountPath: z.string().describe(
        "Optional. The absolute path within the container where the volume should be mounted.",
      ).optional(),
      sourcePath: z.string().describe(
        "Optional. The absolute path of the source to be mounted, only support Google Cloud Storage bucket or folder now. Eg: gs://bucket-xxx for Google Cloud Storage bucket, gs://bucket-xxx/folder1/folder2 for Google Cloud Storage folder.",
      ).optional(),
    })).describe(
      "Optional. List of volume mounts for the Python UDF container that executes the managed function.",
    ).optional(),
  }).describe(
    "Optional. Options for the runtime of the external system executing the routine. This field is only applicable for Python UDFs. [Preview](https://cloud.google.com/products/#product-launch-stages)",
  ).optional(),
  importedLibraries: z.array(z.string()).describe(
    'Optional. If language = "JAVASCRIPT", this field stores the path of the imported JAVASCRIPT libraries.',
  ).optional(),
  language: z.enum([
    "LANGUAGE_UNSPECIFIED",
    "SQL",
    "JAVASCRIPT",
    "PYTHON",
    "JAVA",
    "SCALA",
  ]).describe(
    'Optional. Defaults to "SQL" if remote_function_options field is absent, not set otherwise.',
  ).optional(),
  pythonOptions: z.object({
    entryPoint: z.string().describe(
      "Required. The name of the function defined in Python code as the entry point when the Python UDF is invoked.",
    ).optional(),
    packages: z.array(z.string()).describe(
      'Optional. A list of Python package names along with versions to be installed. Example: ["pandas>=2.1", "google-cloud-translate==3.11"]. For more information, see [Use third-party packages](https://cloud.google.com/bigquery/docs/user-defined-functions-python#third-party-packages).',
    ).optional(),
  }).describe(
    "Optional. Options for the Python UDF. [Preview](https://cloud.google.com/products/#product-launch-stages)",
  ).optional(),
  remoteFunctionOptions: z.object({
    connection: z.string().describe(
      'Fully qualified name of the user-provided connection object which holds the authentication information to send requests to the remote service. Format: ` "projects/{projectId}/locations/{locationId}/connections/{connectionId}" `',
    ).optional(),
    endpoint: z.string().describe(
      "Endpoint of the user-provided remote service, e.g. ` https://us-east1-my_gcf_project.cloudfunctions.net/remote_add `",
    ).optional(),
    maxBatchingRows: z.string().describe(
      "Max number of rows in each batch sent to the remote service. If absent or if 0, BigQuery dynamically decides the number of rows in a batch.",
    ).optional(),
    userDefinedContext: z.record(z.string(), z.string()).describe(
      "User-defined context as a set of key/value pairs, which will be sent as function invocation context together with batched arguments in the requests to the remote service. The total number of bytes of keys and values must be less than 8KB.",
    ).optional(),
  }).describe("Optional. Remote function specific options.").optional(),
  returnTableType: z.object({
    columns: z.array(z.object({
      name: z.string().describe(
        "Optional. The name of this field. Can be absent for struct fields.",
      ).optional(),
      type: z.object({
        arrayElementType: z.record(z.string(), z.unknown()).describe(
          "Circular reference to StandardSqlDataType",
        ).optional(),
        rangeElementType: z.record(z.string(), z.unknown()).describe(
          "Circular reference to StandardSqlDataType",
        ).optional(),
        structType: z.object({
          fields: z.unknown().describe("Fields within the struct.").optional(),
        }).describe(
          'The fields of this struct, in order, if type_kind = "STRUCT".',
        ).optional(),
        typeKind: z.enum([
          "TYPE_KIND_UNSPECIFIED",
          "INT64",
          "BOOL",
          "FLOAT64",
          "STRING",
          "BYTES",
          "TIMESTAMP",
          "DATE",
          "TIME",
          "DATETIME",
          "INTERVAL",
          "GEOGRAPHY",
          "NUMERIC",
          "BIGNUMERIC",
          "JSON",
          "ARRAY",
          "STRUCT",
          "RANGE",
          "UUID",
        ]).describe(
          'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
        ).optional(),
      }).describe(
        'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
      ).optional(),
    })).describe("The columns in this table type").optional(),
  }).describe(
    'Optional. Can be set only if routine_type = "TABLE_VALUED_FUNCTION". If absent, the return table type is inferred from definition_body at query time in each query that references this routine. If present, then the columns in the evaluated table result will be cast to match the column types specified in return table type, at query time.',
  ).optional(),
  returnType: z.object({
    arrayElementType: z.record(z.string(), z.unknown()).describe(
      "Circular reference to StandardSqlDataType",
    ).optional(),
    rangeElementType: z.record(z.string(), z.unknown()).describe(
      "Circular reference to StandardSqlDataType",
    ).optional(),
    structType: z.object({
      fields: z.array(z.object({
        name: z.string().describe(
          "Optional. The name of this field. Can be absent for struct fields.",
        ).optional(),
        type: z.record(z.string(), z.unknown()).describe(
          "Circular reference to StandardSqlDataType",
        ).optional(),
      })).describe("Fields within the struct.").optional(),
    }).describe('The fields of this struct, in order, if type_kind = "STRUCT".')
      .optional(),
    typeKind: z.enum([
      "TYPE_KIND_UNSPECIFIED",
      "INT64",
      "BOOL",
      "FLOAT64",
      "STRING",
      "BYTES",
      "TIMESTAMP",
      "DATE",
      "TIME",
      "DATETIME",
      "INTERVAL",
      "GEOGRAPHY",
      "NUMERIC",
      "BIGNUMERIC",
      "JSON",
      "ARRAY",
      "STRUCT",
      "RANGE",
      "UUID",
    ]).describe(
      'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
    ).optional(),
  }).describe(
    'Optional if language = "SQL"; required otherwise. Cannot be set if routine_type = "TABLE_VALUED_FUNCTION". If absent, the return type is inferred from definition_body at query time in each query that references this routine. If present, then the evaluated result will be cast to the specified returned type at query time. For example, for the functions created with the following statements: * `CREATE FUNCTION Add(x FLOAT64, y FLOAT64) RETURNS FLOAT64 AS (x + y);` * `CREATE FUNCTION Increment(x FLOAT64) AS (Add(x, 1));` * `CREATE FUNCTION Decrement(x FLOAT64) RETURNS FLOAT64 AS (Add(x, -1));` The return_type is `{type_kind: "FLOAT64"}` for `Add` and `Decrement`, and is absent for `Increment` (inferred as FLOAT64 at query time). Suppose the function `Add` is replaced by `CREATE OR REPLACE FUNCTION Add(x INT64, y INT64) AS (x + y);` Then the inferred return type of `Increment` is automatically changed to INT64 at query time, while the return type of `Decrement` remains FLOAT64.',
  ).optional(),
  routineReference: z.object({
    datasetId: z.string().describe(
      "Required. The ID of the dataset containing this routine.",
    ).optional(),
    projectId: z.string().describe(
      "Required. The ID of the project containing this routine.",
    ).optional(),
    routineId: z.string().describe(
      "Required. The ID of the routine. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 256 characters.",
    ).optional(),
  }).describe("Required. Reference describing the ID of this routine.")
    .optional(),
  routineType: z.enum([
    "ROUTINE_TYPE_UNSPECIFIED",
    "SCALAR_FUNCTION",
    "PROCEDURE",
    "TABLE_VALUED_FUNCTION",
    "AGGREGATE_FUNCTION",
  ]).describe("Required. The type of routine.").optional(),
  securityMode: z.enum(["SECURITY_MODE_UNSPECIFIED", "DEFINER", "INVOKER"])
    .describe(
      "Optional. The security mode of the routine, if defined. If not defined, the security mode is automatically determined from the routine's configuration.",
    ).optional(),
  sparkOptions: z.object({
    archiveUris: z.array(z.string()).describe(
      "Archive files to be extracted into the working directory of each executor. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    connection: z.string().describe(
      'Fully qualified name of the user-provided Spark connection object. Format: ` "projects/{project_id}/locations/{location_id}/connections/{connection_id}" `',
    ).optional(),
    containerImage: z.string().describe(
      "Custom container image for the runtime environment.",
    ).optional(),
    fileUris: z.array(z.string()).describe(
      "Files to be placed in the working directory of each executor. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    jarUris: z.array(z.string()).describe(
      "JARs to include on the driver and executor CLASSPATH. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    mainClass: z.string().describe(
      "The fully qualified name of a class in jar_uris, for example, com.example.wordcount. Exactly one of main_class and main_jar_uri field should be set for Java/Scala language type.",
    ).optional(),
    mainFileUri: z.string().describe(
      "The main file/jar URI of the Spark application. Exactly one of the definition_body field and the main_file_uri field must be set for Python. Exactly one of main_class and main_file_uri field should be set for Java/Scala language type.",
    ).optional(),
    properties: z.record(z.string(), z.string()).describe(
      "Configuration properties as a set of key/value pairs, which will be passed on to the Spark application. For more information, see [Apache Spark](https://spark.apache.org/docs/latest/index.html) and the [procedure option list](https://cloud.google.com/bigquery/docs/reference/standard-sql/data-definition-language#procedure_option_list).",
    ).optional(),
    pyFileUris: z.array(z.string()).describe(
      "Python files to be placed on the PYTHONPATH for PySpark application. Supported file types: `.py`, `.egg`, and `.zip`. For more information about Apache Spark, see [Apache Spark](https://spark.apache.org/docs/latest/index.html).",
    ).optional(),
    runtimeVersion: z.string().describe(
      "Runtime version. If not specified, the default runtime version is used.",
    ).optional(),
  }).describe("Optional. Spark specific options.").optional(),
  strictMode: z.boolean().describe(
    "Optional. Use this option to catch many common errors. Error checking is not exhaustive, and successfully creating a procedure doesn't guarantee that the procedure will successfully execute at runtime. If `strictMode` is set to `TRUE`, the procedure body is further checked for errors such as non-existent tables or columns. The `CREATE PROCEDURE` statement fails if the body fails any of these checks. If `strictMode` is set to `FALSE`, the procedure body is checked only for syntax. For procedures that invoke themselves recursively, specify `strictMode=FALSE` to avoid non-existent procedure errors during validation. Default value is `TRUE`.",
  ).optional(),
  datasetId: z.string().describe("Required. Dataset ID of the new routine")
    .optional(),
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

/** Swamp extension model for Google Cloud BigQuery Routines. Registered at `@swamp/gcp/bigquery/routines`. */
export const model = {
  type: "@swamp/gcp/bigquery/routines",
  version: "2026.09.14.1",
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
      toVersion: "2026.05.26.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.05.27.1",
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
      toVersion: "2026.06.27.1",
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
      description: "Removed: buildStatus",
      upgradeAttributes: (old: Record<string, unknown>) => {
        const { buildStatus: _buildStatus, ...rest } = old;
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
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.14.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
  ],
  globalArguments: GlobalArgsSchema,
  inputsSchema: InputsSchema,
  resources: {
    state: {
      description: "A user-defined function or a stored procedure.",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: {
      description: "Create a routines",
      arguments: z.object({}),
      execute: async (_args: Record<string, never>, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["datasetId"] !== undefined) {
          params["datasetId"] = String(g["datasetId"]);
        }
        const body: Record<string, unknown> = {};
        if (g["arguments"] !== undefined) body["arguments"] = g["arguments"];
        if (g["dataGovernanceType"] !== undefined) {
          body["dataGovernanceType"] = g["dataGovernanceType"];
        }
        if (g["definitionBody"] !== undefined) {
          body["definitionBody"] = g["definitionBody"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["determinismLevel"] !== undefined) {
          body["determinismLevel"] = g["determinismLevel"];
        }
        if (g["externalRuntimeOptions"] !== undefined) {
          body["externalRuntimeOptions"] = g["externalRuntimeOptions"];
        }
        if (g["importedLibraries"] !== undefined) {
          body["importedLibraries"] = g["importedLibraries"];
        }
        if (g["language"] !== undefined) body["language"] = g["language"];
        if (g["pythonOptions"] !== undefined) {
          body["pythonOptions"] = g["pythonOptions"];
        }
        if (g["remoteFunctionOptions"] !== undefined) {
          body["remoteFunctionOptions"] = g["remoteFunctionOptions"];
        }
        if (g["returnTableType"] !== undefined) {
          body["returnTableType"] = g["returnTableType"];
        }
        if (g["returnType"] !== undefined) body["returnType"] = g["returnType"];
        if (g["routineReference"] !== undefined) {
          body["routineReference"] = g["routineReference"];
        }
        if (g["routineType"] !== undefined) {
          body["routineType"] = g["routineType"];
        }
        if (g["securityMode"] !== undefined) {
          body["securityMode"] = g["securityMode"];
        }
        if (g["sparkOptions"] !== undefined) {
          body["sparkOptions"] = g["sparkOptions"];
        }
        if (g["strictMode"] !== undefined) body["strictMode"] = g["strictMode"];
        if (g["name"] !== undefined) params["routineId"] = String(g["name"]);
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
      description: "Get a routines",
      arguments: z.object({
        identifier: z.string().describe("The name of the routines"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["datasetId"] !== undefined) {
          params["datasetId"] = String(g["datasetId"]);
        }
        params["routineId"] = args.identifier;
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
    update: {
      description: "Update routines attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific routines by name (e.g. one discovered by list)",
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
        const params: Record<string, string> = { projectId: projectId };
        if (g["datasetId"] !== undefined) {
          params["datasetId"] = String(g["datasetId"]);
        } else if (existing["datasetId"]) {
          params["datasetId"] = String(existing["datasetId"]);
        }
        params["routineId"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["arguments"] !== undefined) body["arguments"] = g["arguments"];
        if (g["dataGovernanceType"] !== undefined) {
          body["dataGovernanceType"] = g["dataGovernanceType"];
        }
        if (g["definitionBody"] !== undefined) {
          body["definitionBody"] = g["definitionBody"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["determinismLevel"] !== undefined) {
          body["determinismLevel"] = g["determinismLevel"];
        }
        if (g["externalRuntimeOptions"] !== undefined) {
          body["externalRuntimeOptions"] = g["externalRuntimeOptions"];
        }
        if (g["importedLibraries"] !== undefined) {
          body["importedLibraries"] = g["importedLibraries"];
        }
        if (g["language"] !== undefined) body["language"] = g["language"];
        if (g["pythonOptions"] !== undefined) {
          body["pythonOptions"] = g["pythonOptions"];
        }
        if (g["remoteFunctionOptions"] !== undefined) {
          body["remoteFunctionOptions"] = g["remoteFunctionOptions"];
        }
        if (g["returnTableType"] !== undefined) {
          body["returnTableType"] = g["returnTableType"];
        }
        if (g["returnType"] !== undefined) body["returnType"] = g["returnType"];
        if (g["routineReference"] !== undefined) {
          body["routineReference"] = g["routineReference"];
        }
        if (g["routineType"] !== undefined) {
          body["routineType"] = g["routineType"];
        }
        if (g["securityMode"] !== undefined) {
          body["securityMode"] = g["securityMode"];
        }
        if (g["sparkOptions"] !== undefined) {
          body["sparkOptions"] = g["sparkOptions"];
        }
        if (g["strictMode"] !== undefined) body["strictMode"] = g["strictMode"];
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
      description: "Delete the routines",
      arguments: z.object({
        identifier: z.string().describe("The name of the routines"),
      }),
      execute: async (args: { identifier: string }, context: any) => {
        const g = context.globalArgs;
        const baseUrl = g["apiEndpoint"]?.toString() ??
          Deno.env.get("GCP_API_ENDPOINT")?.trim() ?? BASE_URL;
        const credentials = _buildGcpCredentials(g);
        const projectId = await getProjectId(credentials);
        const params: Record<string, string> = { projectId: projectId };
        if (g["datasetId"] !== undefined) {
          params["datasetId"] = String(g["datasetId"]);
        }
        params["routineId"] = args.identifier;
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
      description: "Sync routines state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific routines by name (e.g. one discovered by list)",
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
          if (g["datasetId"] !== undefined) {
            params["datasetId"] = String(g["datasetId"]);
          } else if (existing["datasetId"]) {
            params["datasetId"] = String(existing["datasetId"]);
          }
          const identifier = existing.name?.toString() ?? g["name"]?.toString();
          if (!identifier) {
            throw new Error(
              "No identifier found in existing state or globalArgs",
            );
          }
          params["routineId"] = identifier;
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
      description: "List routines resources",
      arguments: z.object({
        filter: z.string().describe(
          "If set, then only the Routines matching this filter are returned. The supported format is `routineType:{RoutineType}`, where `{RoutineType}` is a RoutineType enum. For example: `routineType:SCALAR_FUNCTION`.",
        ).optional(),
        maxResults: z.number().describe(
          "The maximum number of results to return in a single response page. Leverage the page tokens to iterate through the entire collection.",
        ).optional(),
        readMask: z.string().describe(
          "If set, then only the Routine fields in the field mask, as well as project_id, dataset_id and routine_id, are returned in the response. If unset, then the following Routine fields are returned: etag, project_id, dataset_id, routine_id, routine_type, creation_time, last_modified_time, and language.",
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
        const params: Record<string, string> = { projectId: projectId };
        if (g["datasetId"] !== undefined) {
          params["datasetId"] = String(g["datasetId"]);
        }
        if (args["filter"] !== undefined) {
          params["filter"] = String(args["filter"]);
        }
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        if (args["readMask"] !== undefined) {
          params["readMask"] = String(args["readMask"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "routines",
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
    get_iam_policy: {
      description: "get iam policy",
      arguments: z.object({
        options: z.any().optional(),
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
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["options"] !== undefined) body["options"] = args["options"];
        const result = await createResource(
          baseUrl,
          {
            "id": "bigquery.routines.getIamPolicy",
            "path": "{+resource}:getIamPolicy",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "resource": { "location": "path", "required": true },
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
        policy: z.any().optional(),
        updateMask: z.any().optional(),
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
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["policy"] !== undefined) body["policy"] = args["policy"];
        if (args["updateMask"] !== undefined) {
          body["updateMask"] = args["updateMask"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "bigquery.routines.setIamPolicy",
            "path": "{+resource}:setIamPolicy",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "resource": { "location": "path", "required": true },
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
        permissions: z.any().optional(),
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
        params["resource"] = existing["name"]?.toString() ??
          g["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (args["permissions"] !== undefined) {
          body["permissions"] = args["permissions"];
        }
        const result = await createResource(
          baseUrl,
          {
            "id": "bigquery.routines.testIamPermissions",
            "path": "{+resource}:testIamPermissions",
            "httpMethod": "POST",
            "parameterOrder": ["resource"],
            "parameters": {
              "resource": { "location": "path", "required": true },
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
  },
};
