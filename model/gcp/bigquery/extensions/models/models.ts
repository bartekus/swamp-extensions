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

// Auto-generated extension model for @swamp/gcp/bigquery/models
// Do not edit manually. Re-generate with: deno task generate:gcp

// deno-lint-ignore-file no-explicit-any

/**
 * Swamp extension model for Google Cloud BigQuery Models.
 *
 * Gets the specified model resource by model ID. # IAM Permissions Requires the `bigquery.models.getMetadata` permission on the model.
 *
 * Wraps the GCP resource as a swamp model so create, get, update,
 * delete, and sync can be driven through `swamp model`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
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
  "id": "bigquery.models.get",
  "path": "projects/{+projectId}/datasets/{+datasetId}/models/{+modelId}",
  "httpMethod": "GET",
  "parameterOrder": [
    "projectId",
    "datasetId",
    "modelId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "modelId": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const PATCH_CONFIG = {
  "id": "bigquery.models.patch",
  "path": "projects/{+projectId}/datasets/{+datasetId}/models/{+modelId}",
  "httpMethod": "PATCH",
  "parameterOrder": [
    "projectId",
    "datasetId",
    "modelId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "modelId": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const DELETE_CONFIG = {
  "id": "bigquery.models.delete",
  "path": "projects/{+projectId}/datasets/{+datasetId}/models/{+modelId}",
  "httpMethod": "DELETE",
  "parameterOrder": [
    "projectId",
    "datasetId",
    "modelId",
  ],
  "parameters": {
    "datasetId": {
      "location": "path",
      "required": true,
    },
    "modelId": {
      "location": "path",
      "required": true,
    },
    "projectId": {
      "location": "path",
      "required": true,
    },
  },
} as const;

const LIST_CONFIG = {
  "id": "bigquery.models.list",
  "path": "projects/{+projectId}/datasets/{+datasetId}/models",
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
  creationTime: z.string().describe(
    "Output only. The time when this model was created, in millisecs since the epoch.",
  ).optional(),
  defaultTrialId: z.string().describe(
    "Output only. The default trial_id to use in TVFs when the trial_id is not passed in. For single-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, this is the best trial ID. For multi-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, this is the smallest trial ID among all Pareto optimal trials.",
  ).optional(),
  description: z.string().describe(
    "Optional. A user-friendly description of this model.",
  ).optional(),
  encryptionConfiguration: z.object({
    kmsKeyName: z.string().describe(
      "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
    ).optional(),
  }).describe(
    "Custom encryption configuration (e.g., Cloud KMS keys). This shows the encryption configuration of the model data while stored in BigQuery storage. This field can be used with PatchModel to update encryption key for an already encrypted model.",
  ).optional(),
  etag: z.string().describe("Output only. A hash of this resource.").optional(),
  expirationTime: z.string().describe(
    "Optional. The time when this model expires, in milliseconds since the epoch. If not present, the model will persist indefinitely. Expired models will be deleted and their storage reclaimed. The defaultTableExpirationMs property of the encapsulating dataset can be used to set a default expirationTime on newly created models.",
  ).optional(),
  featureColumns: z.array(z.object({
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
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe(
      'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
    ).optional(),
  })).describe(
    "Output only. Input feature columns for the model inference. If the model is trained with TRANSFORM clause, these are the input of the TRANSFORM clause.",
  ).optional(),
  friendlyName: z.string().describe(
    "Optional. A descriptive name for this model.",
  ).optional(),
  hparamSearchSpaces: z.object({
    activationFn: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Activation functions of neural network models.").optional(),
    batchSize: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Mini batch sample size.").optional(),
    boosterType: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Booster type for boosted tree models.").optional(),
    colsampleBylevel: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample ratio of columns for each level for boosted tree models.",
    ).optional(),
    colsampleBynode: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample ratio of columns for each node(split) for boosted tree models.",
    ).optional(),
    colsampleBytree: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample ratio of columns when constructing each tree for boosted tree models.",
    ).optional(),
    dartNormalizeType: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Dart normalization type for boosted tree models.").optional(),
    dropout: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Dropout probability for dnn model training and boosted tree models using dart booster.",
    ).optional(),
    hiddenUnits: z.object({
      candidates: z.array(z.object({
        elements: z.array(z.unknown()).describe("Elements in the int array.")
          .optional(),
      })).describe("Candidates for the int array parameter.").optional(),
    }).describe("Hidden units for neural network models.").optional(),
    l1Reg: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("L1 regularization coefficient.").optional(),
    l2Reg: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("L2 regularization coefficient.").optional(),
    learnRate: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("Learning rate of training jobs.").optional(),
    maxTreeDepth: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Maximum depth of a tree for boosted tree models.").optional(),
    minSplitLoss: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("Minimum split loss for boosted tree models.").optional(),
    minTreeChildWeight: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe(
      "Minimum sum of instance weight needed in a child for boosted tree models.",
    ).optional(),
    numClusters: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Number of clusters for k-means.").optional(),
    numFactors: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Number of latent factors to train on.").optional(),
    numParallelTree: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Number of parallel trees for boosted tree models.").optional(),
    optimizer: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Optimizer of TF models.").optional(),
    subsample: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample the training data to grow tree to prevent overfitting for boosted tree models.",
    ).optional(),
    treeMethod: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Tree construction algorithm for boosted tree models.")
      .optional(),
    walsAlpha: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Hyperparameter for matrix factoration when implicit feedback type is specified.",
    ).optional(),
  }).describe("Output only. All hyperparameter search spaces in this model.")
    .optional(),
  hparamTrials: z.array(z.object({
    endTimeMs: z.string().describe("Ending time of the trial.").optional(),
    errorMessage: z.string().describe(
      "Error message for FAILED and INFEASIBLE trial.",
    ).optional(),
    evalLoss: z.number().describe(
      "Loss computed on the eval data at the end of trial.",
    ).optional(),
    evaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()).describe(
          "Arima model fitting metrics.",
        ).optional(),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()).describe(
          "Repeated as there can be many metric sets (one for each model) in auto-arima and the large-scale case.",
        ).optional(),
        hasDrift: z.array(z.unknown()).describe(
          "Whether Arima model fitted with drift or not. It is always false when d is not 1.",
        ).optional(),
        nonSeasonalOrder: z.array(z.unknown()).describe("Non-seasonal order.")
          .optional(),
        seasonalPeriods: z.array(z.unknown()).describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
        timeSeriesId: z.array(z.unknown()).describe(
          "Id to differentiate different time series for the large-scale case.",
        ).optional(),
      }).describe("Populated for ARIMA models.").optional(),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        binaryConfusionMatrixList: z.array(z.unknown()).describe(
          "Binary confusion matrix at multiple thresholds.",
        ).optional(),
        negativeLabel: z.string().describe(
          "Label representing the negative class.",
        ).optional(),
        positiveLabel: z.string().describe(
          "Label representing the positive class.",
        ).optional(),
      }).describe("Populated for binary classification/classifier models.")
        .optional(),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()).describe("Information for all clusters.")
          .optional(),
        daviesBouldinIndex: z.number().describe("Davies-Bouldin index.")
          .optional(),
        meanSquaredDistance: z.number().describe(
          "Mean of squared distances between each sample to its cluster centroid.",
        ).optional(),
      }).describe("Populated for clustering models.").optional(),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number().describe(
          "Total percentage of variance explained by the selected principal components.",
        ).optional(),
      }).describe(
        "Evaluation metrics when the model is a dimensionality reduction model, which currently includes PCA.",
      ).optional(),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        confusionMatrixList: z.array(z.unknown()).describe(
          "Confusion matrix at different thresholds.",
        ).optional(),
      }).describe("Populated for multi-class classification/classifier models.")
        .optional(),
      rankingMetrics: z.object({
        averageRank: z.number().describe(
          "Determines the goodness of a ranking by computing the percentile rank from the predicted confidence and dividing it by the original rank.",
        ).optional(),
        meanAveragePrecision: z.number().describe(
          "Calculates a precision per user for all the items by ranking them and then averages all the precisions across all the users.",
        ).optional(),
        meanSquaredError: z.number().describe(
          "Similar to the mean squared error computed in regression and explicit recommendation models except instead of computing the rating directly, the output from evaluate is computed against a preference which is 1 or 0 depending on if the rating exists or not.",
        ).optional(),
        normalizedDiscountedCumulativeGain: z.number().describe(
          "A metric to determine the goodness of a ranking calculated from the predicted confidence by comparing it to an ideal rank measured by the original ratings.",
        ).optional(),
      }).describe(
        "Populated for implicit feedback type matrix factorization models.",
      ).optional(),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number().describe("Mean absolute error.")
          .optional(),
        meanSquaredError: z.number().describe("Mean squared error.").optional(),
        meanSquaredLogError: z.number().describe("Mean squared log error.")
          .optional(),
        medianAbsoluteError: z.number().describe("Median absolute error.")
          .optional(),
        rSquared: z.number().describe(
          "R^2 score. This corresponds to r2_score in ML.EVALUATE.",
        ).optional(),
      }).describe(
        "Populated for regression models and explicit feedback type matrix factorization models.",
      ).optional(),
    }).describe(
      "Evaluation metrics of this trial calculated on the test data. Empty in Job API.",
    ).optional(),
    hparamTuningEvaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()).describe(
          "Arima model fitting metrics.",
        ).optional(),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()).describe(
          "Repeated as there can be many metric sets (one for each model) in auto-arima and the large-scale case.",
        ).optional(),
        hasDrift: z.array(z.unknown()).describe(
          "Whether Arima model fitted with drift or not. It is always false when d is not 1.",
        ).optional(),
        nonSeasonalOrder: z.array(z.unknown()).describe("Non-seasonal order.")
          .optional(),
        seasonalPeriods: z.array(z.unknown()).describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
        timeSeriesId: z.array(z.unknown()).describe(
          "Id to differentiate different time series for the large-scale case.",
        ).optional(),
      }).describe("Populated for ARIMA models.").optional(),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        binaryConfusionMatrixList: z.array(z.unknown()).describe(
          "Binary confusion matrix at multiple thresholds.",
        ).optional(),
        negativeLabel: z.string().describe(
          "Label representing the negative class.",
        ).optional(),
        positiveLabel: z.string().describe(
          "Label representing the positive class.",
        ).optional(),
      }).describe("Populated for binary classification/classifier models.")
        .optional(),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()).describe("Information for all clusters.")
          .optional(),
        daviesBouldinIndex: z.number().describe("Davies-Bouldin index.")
          .optional(),
        meanSquaredDistance: z.number().describe(
          "Mean of squared distances between each sample to its cluster centroid.",
        ).optional(),
      }).describe("Populated for clustering models.").optional(),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number().describe(
          "Total percentage of variance explained by the selected principal components.",
        ).optional(),
      }).describe(
        "Evaluation metrics when the model is a dimensionality reduction model, which currently includes PCA.",
      ).optional(),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        confusionMatrixList: z.array(z.unknown()).describe(
          "Confusion matrix at different thresholds.",
        ).optional(),
      }).describe("Populated for multi-class classification/classifier models.")
        .optional(),
      rankingMetrics: z.object({
        averageRank: z.number().describe(
          "Determines the goodness of a ranking by computing the percentile rank from the predicted confidence and dividing it by the original rank.",
        ).optional(),
        meanAveragePrecision: z.number().describe(
          "Calculates a precision per user for all the items by ranking them and then averages all the precisions across all the users.",
        ).optional(),
        meanSquaredError: z.number().describe(
          "Similar to the mean squared error computed in regression and explicit recommendation models except instead of computing the rating directly, the output from evaluate is computed against a preference which is 1 or 0 depending on if the rating exists or not.",
        ).optional(),
        normalizedDiscountedCumulativeGain: z.number().describe(
          "A metric to determine the goodness of a ranking calculated from the predicted confidence by comparing it to an ideal rank measured by the original ratings.",
        ).optional(),
      }).describe(
        "Populated for implicit feedback type matrix factorization models.",
      ).optional(),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number().describe("Mean absolute error.")
          .optional(),
        meanSquaredError: z.number().describe("Mean squared error.").optional(),
        meanSquaredLogError: z.number().describe("Mean squared log error.")
          .optional(),
        medianAbsoluteError: z.number().describe("Median absolute error.")
          .optional(),
        rSquared: z.number().describe(
          "R^2 score. This corresponds to r2_score in ML.EVALUATE.",
        ).optional(),
      }).describe(
        "Populated for regression models and explicit feedback type matrix factorization models.",
      ).optional(),
    }).describe(
      "Hyperparameter tuning evaluation metrics of this trial calculated on the eval data. Unlike evaluation_metrics, only the fields corresponding to the hparam_tuning_objectives are set.",
    ).optional(),
    hparams: z.object({
      activationFn: z.string().describe(
        "Activation function of the neural nets.",
      ).optional(),
      adjustStepChanges: z.boolean().describe(
        "If true, detect step changes and make data adjustment in the input time series.",
      ).optional(),
      approxGlobalFeatureContrib: z.boolean().describe(
        "Whether to use approximate feature contribution method in XGBoost model explanation for global explain.",
      ).optional(),
      autoArima: z.boolean().describe("Whether to enable auto ARIMA or not.")
        .optional(),
      autoArimaMaxOrder: z.string().describe(
        "The max value of the sum of non-seasonal p and q.",
      ).optional(),
      autoArimaMinOrder: z.string().describe(
        "The min value of the sum of non-seasonal p and q.",
      ).optional(),
      autoClassWeights: z.boolean().describe(
        "Whether to calculate class weights automatically based on the popularity of each label.",
      ).optional(),
      batchSize: z.string().describe("Batch size for dnn models.").optional(),
      boosterType: z.enum(["BOOSTER_TYPE_UNSPECIFIED", "GBTREE", "DART"])
        .describe("Booster type for boosted tree models.").optional(),
      budgetHours: z.number().describe("Budget in hours for AutoML training.")
        .optional(),
      calculatePValues: z.boolean().describe(
        "Whether or not p-value test should be computed for this model. Only available for linear and logistic regression models.",
      ).optional(),
      categoryEncodingMethod: z.enum([
        "ENCODING_METHOD_UNSPECIFIED",
        "ONE_HOT_ENCODING",
        "LABEL_ENCODING",
        "DUMMY_ENCODING",
      ]).describe("Categorical feature encoding method.").optional(),
      cleanSpikesAndDips: z.boolean().describe(
        "If true, clean spikes and dips in the input time series.",
      ).optional(),
      colorSpace: z.enum([
        "COLOR_SPACE_UNSPECIFIED",
        "RGB",
        "HSV",
        "YIQ",
        "YUV",
        "GRAYSCALE",
      ]).describe(
        "Enums for color space, used for processing images in Object Table. See more details at https://www.tensorflow.org/io/tutorials/colorspace.",
      ).optional(),
      colsampleBylevel: z.number().describe(
        "Subsample ratio of columns for each level for boosted tree models.",
      ).optional(),
      colsampleBynode: z.number().describe(
        "Subsample ratio of columns for each node(split) for boosted tree models.",
      ).optional(),
      colsampleBytree: z.number().describe(
        "Subsample ratio of columns when constructing each tree for boosted tree models.",
      ).optional(),
      contributionMetric: z.string().describe(
        "The contribution metric. Applies to contribution analysis models. Allowed formats supported are for summable and summable ratio contribution metrics. These include expressions such as `SUM(x)` or `SUM(x)/SUM(y)`, where x and y are column names from the base table.",
      ).optional(),
      dartNormalizeType: z.enum([
        "DART_NORMALIZE_TYPE_UNSPECIFIED",
        "TREE",
        "FOREST",
      ]).describe(
        "Type of normalization algorithm for boosted tree models using dart booster.",
      ).optional(),
      dataFrequency: z.enum([
        "DATA_FREQUENCY_UNSPECIFIED",
        "AUTO_FREQUENCY",
        "YEARLY",
        "QUARTERLY",
        "MONTHLY",
        "WEEKLY",
        "DAILY",
        "HOURLY",
        "PER_MINUTE",
      ]).describe("The data frequency of a time series.").optional(),
      dataSplitColumn: z.string().describe(
        "The column to split data with. This column won't be used as a feature. 1. When data_split_method is CUSTOM, the corresponding column should be boolean. The rows with true value tag are eval data, and the false are training data. 2. When data_split_method is SEQ, the first DATA_SPLIT_EVAL_FRACTION rows (from smallest to largest) in the corresponding column are used as training data, and the rest are eval data. It respects the order in Orderable data types: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#data_type_properties",
      ).optional(),
      dataSplitEvalFraction: z.number().describe(
        "The fraction of evaluation data over the whole input data. The rest of data will be used as training data. The format should be double. Accurate to two decimal places. Default value is 0.2.",
      ).optional(),
      dataSplitMethod: z.enum([
        "DATA_SPLIT_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "SEQUENTIAL",
        "NO_SPLIT",
        "AUTO_SPLIT",
      ]).describe(
        "The data split type for training and evaluation, e.g. RANDOM.",
      ).optional(),
      decomposeTimeSeries: z.boolean().describe(
        "If true, perform decompose time series and save the results.",
      ).optional(),
      dimensionIdColumns: z.array(z.string()).describe(
        "Optional. Names of the columns to slice on. Applies to contribution analysis models.",
      ).optional(),
      distanceType: z.enum(["DISTANCE_TYPE_UNSPECIFIED", "EUCLIDEAN", "COSINE"])
        .describe("Distance type for clustering models.").optional(),
      dropout: z.number().describe("Dropout probability for dnn models.")
        .optional(),
      earlyStop: z.boolean().describe(
        "Whether to stop early when the loss doesn't improve significantly any more (compared to min_relative_progress). Used only for iterative training algorithms.",
      ).optional(),
      enableGlobalExplain: z.boolean().describe(
        "If true, enable global explanation during training.",
      ).optional(),
      endpointIdleTtl: z.string().describe(
        "The idle TTL of the endpoint before the resources get destroyed. The default value is 6.5 hours.",
      ).optional(),
      feedbackType: z.enum([
        "FEEDBACK_TYPE_UNSPECIFIED",
        "IMPLICIT",
        "EXPLICIT",
      ]).describe(
        "Feedback type that specifies which algorithm to run for matrix factorization.",
      ).optional(),
      fitIntercept: z.boolean().describe(
        "Whether the model should include intercept during model training.",
      ).optional(),
      forecastLimitLowerBound: z.number().describe(
        "The forecast limit lower bound that was used during ARIMA model training with limits. To see more details of the algorithm: https://otexts.com/fpp2/limits.html",
      ).optional(),
      forecastLimitUpperBound: z.number().describe(
        "The forecast limit upper bound that was used during ARIMA model training with limits.",
      ).optional(),
      hiddenUnits: z.array(z.string()).describe("Hidden units for dnn models.")
        .optional(),
      holidayRegion: z.enum([
        "HOLIDAY_REGION_UNSPECIFIED",
        "GLOBAL",
        "NA",
        "JAPAC",
        "EMEA",
        "LAC",
        "AE",
        "AR",
        "AT",
        "AU",
        "BE",
        "BR",
        "CA",
        "CH",
        "CL",
        "CN",
        "CO",
        "CS",
        "CZ",
        "DE",
        "DK",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ES",
        "FI",
        "FR",
        "GB",
        "GR",
        "HK",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IR",
        "IT",
        "JP",
        "KR",
        "LV",
        "MA",
        "MX",
        "MY",
        "NG",
        "NL",
        "NO",
        "NZ",
        "PE",
        "PH",
        "PK",
        "PL",
        "PT",
        "RO",
        "RS",
        "RU",
        "SA",
        "SE",
        "SG",
        "SI",
        "SK",
        "TH",
        "TR",
        "TW",
        "UA",
        "US",
        "VE",
        "VN",
        "ZA",
      ]).describe(
        "The geographical region based on which the holidays are considered in time series modeling. If a valid value is specified, then holiday effects modeling is enabled.",
      ).optional(),
      holidayRegions: z.array(
        z.enum([
          "HOLIDAY_REGION_UNSPECIFIED",
          "GLOBAL",
          "NA",
          "JAPAC",
          "EMEA",
          "LAC",
          "AE",
          "AR",
          "AT",
          "AU",
          "BE",
          "BR",
          "CA",
          "CH",
          "CL",
          "CN",
          "CO",
          "CS",
          "CZ",
          "DE",
          "DK",
          "DZ",
          "EC",
          "EE",
          "EG",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "HK",
          "HU",
          "ID",
          "IE",
          "IL",
          "IN",
          "IR",
          "IT",
          "JP",
          "KR",
          "LV",
          "MA",
          "MX",
          "MY",
          "NG",
          "NL",
          "NO",
          "NZ",
          "PE",
          "PH",
          "PK",
          "PL",
          "PT",
          "RO",
          "RS",
          "RU",
          "SA",
          "SE",
          "SG",
          "SI",
          "SK",
          "TH",
          "TR",
          "TW",
          "UA",
          "US",
          "VE",
          "VN",
          "ZA",
        ]),
      ).describe(
        "A list of geographical regions that are used for time series modeling.",
      ).optional(),
      horizon: z.string().describe(
        "The number of periods ahead that need to be forecasted.",
      ).optional(),
      hparamTuningObjectives: z.array(
        z.enum([
          "HPARAM_TUNING_OBJECTIVE_UNSPECIFIED",
          "MEAN_ABSOLUTE_ERROR",
          "MEAN_SQUARED_ERROR",
          "MEAN_SQUARED_LOG_ERROR",
          "MEDIAN_ABSOLUTE_ERROR",
          "R_SQUARED",
          "EXPLAINED_VARIANCE",
          "PRECISION",
          "RECALL",
          "ACCURACY",
          "F1_SCORE",
          "LOG_LOSS",
          "ROC_AUC",
          "DAVIES_BOULDIN_INDEX",
          "MEAN_AVERAGE_PRECISION",
          "NORMALIZED_DISCOUNTED_CUMULATIVE_GAIN",
          "AVERAGE_RANK",
        ]),
      ).describe(
        "The target evaluation metrics to optimize the hyperparameters for.",
      ).optional(),
      huggingFaceModelId: z.string().describe(
        "The id of a Hugging Face model. For example, `google/gemma-2-2b-it`.",
      ).optional(),
      includeDrift: z.boolean().describe(
        "Include drift when fitting an ARIMA model.",
      ).optional(),
      initialLearnRate: z.number().describe(
        "Specifies the initial learning rate for the line search learn rate strategy.",
      ).optional(),
      inputLabelColumns: z.array(z.string()).describe(
        "Name of input label columns in training data.",
      ).optional(),
      instanceWeightColumn: z.string().describe(
        "Name of the instance weight column for training data. This column isn't be used as a feature.",
      ).optional(),
      integratedGradientsNumSteps: z.string().describe(
        "Number of integral steps for the integrated gradients explain method.",
      ).optional(),
      isTestColumn: z.string().describe(
        "Name of the column used to determine the rows corresponding to control and test. Applies to contribution analysis models.",
      ).optional(),
      itemColumn: z.string().describe(
        "Item column specified for matrix factorization models.",
      ).optional(),
      kmeansInitializationColumn: z.string().describe(
        "The column used to provide the initial centroids for kmeans algorithm when kmeans_initialization_method is CUSTOM.",
      ).optional(),
      kmeansInitializationMethod: z.enum([
        "KMEANS_INITIALIZATION_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "KMEANS_PLUS_PLUS",
      ]).describe(
        "The method used to initialize the centroids for kmeans algorithm.",
      ).optional(),
      l1RegActivation: z.number().describe(
        "L1 regularization coefficient to activations.",
      ).optional(),
      l1Regularization: z.number().describe("L1 regularization coefficient.")
        .optional(),
      l2Regularization: z.number().describe("L2 regularization coefficient.")
        .optional(),
      labelClassWeights: z.record(z.string(), z.number()).describe(
        "Weights associated with each label class, for rebalancing the training data. Only applicable for classification models.",
      ).optional(),
      learnRate: z.number().describe(
        "Learning rate in training. Used only for iterative training algorithms.",
      ).optional(),
      learnRateStrategy: z.enum([
        "LEARN_RATE_STRATEGY_UNSPECIFIED",
        "LINE_SEARCH",
        "CONSTANT",
      ]).describe(
        "The strategy to determine learn rate for the current iteration.",
      ).optional(),
      lossType: z.enum([
        "LOSS_TYPE_UNSPECIFIED",
        "MEAN_SQUARED_LOSS",
        "MEAN_LOG_LOSS",
      ]).describe("Type of loss function used during training run.").optional(),
      machineType: z.string().describe(
        "The type of the machine used to deploy and serve the model.",
      ).optional(),
      maxIterations: z.string().describe(
        "The maximum number of iterations in training. Used only for iterative training algorithms.",
      ).optional(),
      maxParallelTrials: z.string().describe(
        "Maximum number of trials to run in parallel.",
      ).optional(),
      maxReplicaCount: z.string().describe(
        "The maximum number of machine replicas that will be deployed on an endpoint. The default value is equal to min_replica_count.",
      ).optional(),
      maxTimeSeriesLength: z.string().describe(
        "The maximum number of time points in a time series that can be used in modeling the trend component of the time series. Don't use this option with the `timeSeriesLengthFraction` or `minTimeSeriesLength` options.",
      ).optional(),
      maxTreeDepth: z.string().describe(
        "Maximum depth of a tree for boosted tree models.",
      ).optional(),
      minAprioriSupport: z.number().describe(
        "The apriori support minimum. Applies to contribution analysis models.",
      ).optional(),
      minRelativeProgress: z.number().describe(
        "When early_stop is true, stops training when accuracy improvement is less than 'min_relative_progress'. Used only for iterative training algorithms.",
      ).optional(),
      minReplicaCount: z.string().describe(
        "The minimum number of machine replicas that will be always deployed on an endpoint. This value must be greater than or equal to 1. The default value is 1.",
      ).optional(),
      minSplitLoss: z.number().describe(
        "Minimum split loss for boosted tree models.",
      ).optional(),
      minTimeSeriesLength: z.string().describe(
        "The minimum number of time points in a time series that are used in modeling the trend component of the time series. If you use this option you must also set the `timeSeriesLengthFraction` option. This training option ensures that enough time points are available when you use `timeSeriesLengthFraction` in trend modeling. This is particularly important when forecasting multiple time series in a single query using `timeSeriesIdColumn`. If the total number of time points is less than the `minTimeSeriesLength` value, then the query uses all available time points.",
      ).optional(),
      minTreeChildWeight: z.string().describe(
        "Minimum sum of instance weight needed in a child for boosted tree models.",
      ).optional(),
      modelGardenModelName: z.string().describe(
        "The name of a Vertex model garden publisher model. Format is `publishers/{publisher}/models/{model}@{optional_version_id}`.",
      ).optional(),
      modelRegistry: z.enum(["MODEL_REGISTRY_UNSPECIFIED", "VERTEX_AI"])
        .describe("The model registry.").optional(),
      modelUri: z.string().describe(
        "Google Cloud Storage URI from which the model was imported. Only applicable for imported models.",
      ).optional(),
      nonSeasonalOrder: z.object({
        d: z.string().describe("Order of the differencing part.").optional(),
        p: z.string().describe("Order of the autoregressive part.").optional(),
        q: z.string().describe("Order of the moving-average part.").optional(),
      }).describe(
        "A specification of the non-seasonal part of the ARIMA model: the three components (p, d, q) are the AR order, the degree of differencing, and the MA order.",
      ).optional(),
      numClusters: z.string().describe(
        "Number of clusters for clustering models.",
      ).optional(),
      numFactors: z.string().describe(
        "Num factors specified for matrix factorization models.",
      ).optional(),
      numParallelTree: z.string().describe(
        "Number of parallel trees constructed during each iteration for boosted tree models.",
      ).optional(),
      numPrincipalComponents: z.string().describe(
        "Number of principal components to keep in the PCA model. Must be <= the number of features.",
      ).optional(),
      numTrials: z.string().describe(
        "Number of trials to run this hyperparameter tuning job.",
      ).optional(),
      optimizationStrategy: z.enum([
        "OPTIMIZATION_STRATEGY_UNSPECIFIED",
        "BATCH_GRADIENT_DESCENT",
        "NORMAL_EQUATION",
      ]).describe(
        "Optimization strategy for training linear regression models.",
      ).optional(),
      optimizer: z.string().describe(
        "Optimizer used for training the neural nets.",
      ).optional(),
      pcaExplainedVarianceRatio: z.number().describe(
        "The minimum ratio of cumulative explained variance that needs to be given by the PCA model.",
      ).optional(),
      pcaSolver: z.enum(["UNSPECIFIED", "FULL", "RANDOMIZED", "AUTO"]).describe(
        "The solver for PCA.",
      ).optional(),
      reservationAffinityKey: z.string().describe(
        "Corresponds to the label key of a reservation resource used by Vertex AI. To target a SPECIFIC_RESERVATION by name, use `compute.googleapis.com/reservation-name` as the key and specify the name of your reservation as its value.",
      ).optional(),
      reservationAffinityType: z.enum([
        "RESERVATION_AFFINITY_TYPE_UNSPECIFIED",
        "NO_RESERVATION",
        "ANY_RESERVATION",
        "SPECIFIC_RESERVATION",
      ]).describe(
        "Specifies the reservation affinity type used to configure a Vertex AI resource. The default value is `NO_RESERVATION`.",
      ).optional(),
      reservationAffinityValues: z.array(z.string()).describe(
        "Corresponds to the label values of a reservation resource used by Vertex AI. This must be the full resource name of the reservation or reservation block.",
      ).optional(),
      sampledShapleyNumPaths: z.string().describe(
        "Number of paths for the sampled Shapley explain method.",
      ).optional(),
      scaleFeatures: z.boolean().describe(
        "If true, scale the feature values by dividing the feature standard deviation. Currently only apply to PCA.",
      ).optional(),
      standardizeFeatures: z.boolean().describe(
        "Whether to standardize numerical features. Default to true.",
      ).optional(),
      subsample: z.number().describe(
        "Subsample fraction of the training data to grow tree to prevent overfitting for boosted tree models.",
      ).optional(),
      tfVersion: z.string().describe(
        "Based on the selected TF version, the corresponding docker image is used to train external models.",
      ).optional(),
      timeSeriesDataColumn: z.string().describe(
        "Column to be designated as time series data for ARIMA model.",
      ).optional(),
      timeSeriesIdColumn: z.string().describe(
        "The time series id column that was used during ARIMA model training.",
      ).optional(),
      timeSeriesIdColumns: z.array(z.string()).describe(
        "The time series id columns that were used during ARIMA model training.",
      ).optional(),
      timeSeriesLengthFraction: z.number().describe(
        "The fraction of the interpolated length of the time series that's used to model the time series trend component. All of the time points of the time series are used to model the non-trend component. This training option accelerates modeling training without sacrificing much forecasting accuracy. You can use this option with `minTimeSeriesLength` but not with `maxTimeSeriesLength`.",
      ).optional(),
      timeSeriesTimestampColumn: z.string().describe(
        "Column to be designated as time series timestamp for ARIMA model.",
      ).optional(),
      treeMethod: z.enum([
        "TREE_METHOD_UNSPECIFIED",
        "AUTO",
        "EXACT",
        "APPROX",
        "HIST",
      ]).describe("Tree construction algorithm for boosted tree models.")
        .optional(),
      trendSmoothingWindowSize: z.string().describe(
        "Smoothing window size for the trend component. When a positive value is specified, a center moving average smoothing is applied on the history trend. When the smoothing window is out of the boundary at the beginning or the end of the trend, the first element or the last element is padded to fill the smoothing window before the average is applied.",
      ).optional(),
      userColumn: z.string().describe(
        "User column specified for matrix factorization models.",
      ).optional(),
      vertexAiModelVersionAliases: z.array(z.string()).describe(
        "The version aliases to apply in Vertex AI model registry. Always overwrite if the version aliases exists in a existing model.",
      ).optional(),
      walsAlpha: z.number().describe(
        "Hyperparameter for matrix factoration when implicit feedback type is specified.",
      ).optional(),
      warmStart: z.boolean().describe(
        "Whether to train a model from the last checkpoint.",
      ).optional(),
      xgboostVersion: z.string().describe(
        "User-selected XGBoost versions for training of XGBoost models.",
      ).optional(),
    }).describe("The hyperprameters selected for this trial.").optional(),
    startTimeMs: z.string().describe("Starting time of the trial.").optional(),
    status: z.enum([
      "TRIAL_STATUS_UNSPECIFIED",
      "NOT_STARTED",
      "RUNNING",
      "SUCCEEDED",
      "FAILED",
      "INFEASIBLE",
      "STOPPED_EARLY",
    ]).describe("The status of the trial.").optional(),
    trainingLoss: z.number().describe(
      "Loss computed on the training data at the end of trial.",
    ).optional(),
    trialId: z.string().describe("1-based index of the trial.").optional(),
  })).describe(
    "Output only. Trials of a [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) model sorted by trial_id.",
  ).optional(),
  labelColumns: z.array(z.object({
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
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe(
      'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
    ).optional(),
  })).describe(
    'Output only. Label columns that were used to train this model. The output of the model will have a "predicted_" prefix to these columns.',
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "The labels associated with this model. You can use these to organize and group your models. Label keys and values can be no longer than 63 characters, can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter and each label in the list must have a different key.",
  ).optional(),
  lastModifiedTime: z.string().describe(
    "Output only. The time when this model was last modified, in millisecs since the epoch.",
  ).optional(),
  location: z.string().describe(
    "Output only. The geographic location where the model resides. This value is inherited from the dataset.",
  ).optional(),
  modelReference: z.object({
    datasetId: z.string().describe(
      "Required. The ID of the dataset containing this model.",
    ).optional(),
    modelId: z.string().describe(
      "Required. The ID of the model. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.",
    ).optional(),
    projectId: z.string().describe(
      "Required. The ID of the project containing this model.",
    ).optional(),
  }).describe("Required. Unique identifier for this model.").optional(),
  modelType: z.enum([
    "MODEL_TYPE_UNSPECIFIED",
    "LINEAR_REGRESSION",
    "LOGISTIC_REGRESSION",
    "KMEANS",
    "MATRIX_FACTORIZATION",
    "DNN_CLASSIFIER",
    "TENSORFLOW",
    "DNN_REGRESSOR",
    "XGBOOST",
    "BOOSTED_TREE_REGRESSOR",
    "BOOSTED_TREE_CLASSIFIER",
    "ARIMA",
    "AUTOML_REGRESSOR",
    "AUTOML_CLASSIFIER",
    "PCA",
    "DNN_LINEAR_COMBINED_CLASSIFIER",
    "DNN_LINEAR_COMBINED_REGRESSOR",
    "AUTOENCODER",
    "ARIMA_PLUS",
    "ARIMA_PLUS_XREG",
    "RANDOM_FOREST_REGRESSOR",
    "RANDOM_FOREST_CLASSIFIER",
    "TENSORFLOW_LITE",
    "ONNX",
    "TRANSFORM_ONLY",
    "CONTRIBUTION_ANALYSIS",
  ]).describe("Output only. Type of the model resource.").optional(),
  optimalTrialIds: z.array(z.string()).describe(
    "Output only. For single-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, it only contains the best trial. For multi-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, it contains all Pareto optimal trials sorted by trial_id.",
  ).optional(),
  remoteModelInfo: z.object({
    connection: z.string().describe(
      'Output only. Fully qualified name of the user-provided connection object of the remote model. Format: ` "projects/{project_id}/locations/{location_id}/connections/{connection_id}" `',
    ).optional(),
    endpoint: z.string().describe("Output only. The endpoint for remote model.")
      .optional(),
    maxBatchingRows: z.string().describe(
      "Output only. Max number of rows in each batch sent to the remote service. If unset, the number of rows in each batch is set dynamically.",
    ).optional(),
    remoteModelVersion: z.string().describe(
      "Output only. The model version for LLM.",
    ).optional(),
    remoteServiceType: z.enum([
      "REMOTE_SERVICE_TYPE_UNSPECIFIED",
      "CLOUD_AI_TRANSLATE_V3",
      "CLOUD_AI_VISION_V1",
      "CLOUD_AI_NATURAL_LANGUAGE_V1",
      "CLOUD_AI_SPEECH_TO_TEXT_V2",
    ]).describe("Output only. The remote service type for remote model.")
      .optional(),
    speechRecognizer: z.string().describe(
      "Output only. The name of the speech recognizer to use for speech recognition. The expected format is `projects/{project}/locations/{location}/recognizers/{recognizer}`. Customers can specify this field at model creation. If not specified, a default recognizer `projects/{model project}/locations/global/recognizers/_` will be used. See more details at [recognizers](https://cloud.google.com/speech-to-text/v2/docs/reference/rest/v2/projects.locations.recognizers)",
    ).optional(),
  }).describe("Output only. Remote model info").optional(),
  trainingRuns: z.array(z.object({
    classLevelGlobalExplanations: z.array(z.object({
      classLabel: z.string().describe(
        "Class label for this set of global explanations. Will be empty/null for binary logistic and linear regression models. Sorted alphabetically in descending order.",
      ).optional(),
      explanations: z.array(z.unknown()).describe(
        "A list of the top global explanations. Sorted by absolute value of attribution in descending order.",
      ).optional(),
    })).describe(
      "Output only. Global explanation contains the explanation of top features on the class level. Applies to classification models only.",
    ).optional(),
    dataSplitResult: z.object({
      evaluationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("Table reference of the evaluation data after split.")
        .optional(),
      testTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("Table reference of the test data after split.").optional(),
      trainingTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("Table reference of the training data after split.")
        .optional(),
    }).describe(
      "Output only. Data split result of the training run. Only set when the input data is actually split.",
    ).optional(),
    evaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()).describe(
          "Arima model fitting metrics.",
        ).optional(),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()).describe(
          "Repeated as there can be many metric sets (one for each model) in auto-arima and the large-scale case.",
        ).optional(),
        hasDrift: z.array(z.unknown()).describe(
          "Whether Arima model fitted with drift or not. It is always false when d is not 1.",
        ).optional(),
        nonSeasonalOrder: z.array(z.unknown()).describe("Non-seasonal order.")
          .optional(),
        seasonalPeriods: z.array(z.unknown()).describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
        timeSeriesId: z.array(z.unknown()).describe(
          "Id to differentiate different time series for the large-scale case.",
        ).optional(),
      }).describe("Populated for ARIMA models.").optional(),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        binaryConfusionMatrixList: z.array(z.unknown()).describe(
          "Binary confusion matrix at multiple thresholds.",
        ).optional(),
        negativeLabel: z.string().describe(
          "Label representing the negative class.",
        ).optional(),
        positiveLabel: z.string().describe(
          "Label representing the positive class.",
        ).optional(),
      }).describe("Populated for binary classification/classifier models.")
        .optional(),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()).describe("Information for all clusters.")
          .optional(),
        daviesBouldinIndex: z.number().describe("Davies-Bouldin index.")
          .optional(),
        meanSquaredDistance: z.number().describe(
          "Mean of squared distances between each sample to its cluster centroid.",
        ).optional(),
      }).describe("Populated for clustering models.").optional(),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number().describe(
          "Total percentage of variance explained by the selected principal components.",
        ).optional(),
      }).describe(
        "Evaluation metrics when the model is a dimensionality reduction model, which currently includes PCA.",
      ).optional(),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        confusionMatrixList: z.array(z.unknown()).describe(
          "Confusion matrix at different thresholds.",
        ).optional(),
      }).describe("Populated for multi-class classification/classifier models.")
        .optional(),
      rankingMetrics: z.object({
        averageRank: z.number().describe(
          "Determines the goodness of a ranking by computing the percentile rank from the predicted confidence and dividing it by the original rank.",
        ).optional(),
        meanAveragePrecision: z.number().describe(
          "Calculates a precision per user for all the items by ranking them and then averages all the precisions across all the users.",
        ).optional(),
        meanSquaredError: z.number().describe(
          "Similar to the mean squared error computed in regression and explicit recommendation models except instead of computing the rating directly, the output from evaluate is computed against a preference which is 1 or 0 depending on if the rating exists or not.",
        ).optional(),
        normalizedDiscountedCumulativeGain: z.number().describe(
          "A metric to determine the goodness of a ranking calculated from the predicted confidence by comparing it to an ideal rank measured by the original ratings.",
        ).optional(),
      }).describe(
        "Populated for implicit feedback type matrix factorization models.",
      ).optional(),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number().describe("Mean absolute error.")
          .optional(),
        meanSquaredError: z.number().describe("Mean squared error.").optional(),
        meanSquaredLogError: z.number().describe("Mean squared log error.")
          .optional(),
        medianAbsoluteError: z.number().describe("Median absolute error.")
          .optional(),
        rSquared: z.number().describe(
          "R^2 score. This corresponds to r2_score in ML.EVALUATE.",
        ).optional(),
      }).describe(
        "Populated for regression models and explicit feedback type matrix factorization models.",
      ).optional(),
    }).describe(
      "Output only. The evaluation metrics over training/eval data that were computed at the end of training.",
    ).optional(),
    modelLevelGlobalExplanation: z.object({
      classLabel: z.string().describe(
        "Class label for this set of global explanations. Will be empty/null for binary logistic and linear regression models. Sorted alphabetically in descending order.",
      ).optional(),
      explanations: z.array(z.object({
        attribution: z.unknown().describe("Attribution of feature.").optional(),
        featureName: z.unknown().describe(
          "The full feature name. For non-numerical features, will be formatted like `.`. Overall size of feature name will always be truncated to first 120 characters.",
        ).optional(),
      })).describe(
        "A list of the top global explanations. Sorted by absolute value of attribution in descending order.",
      ).optional(),
    }).describe(
      "Output only. Global explanation contains the explanation of top features on the model level. Applies to both regression and classification models.",
    ).optional(),
    results: z.array(z.object({
      arimaResult: z.object({
        arimaModelInfo: z.unknown().describe(
          "This message is repeated because there are multiple arima models fitted in auto-arima. For non-auto-arima model, its size is one.",
        ).optional(),
        seasonalPeriods: z.unknown().describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
      }).describe("Arima result.").optional(),
      clusterInfos: z.array(z.unknown()).describe(
        "Information about top clusters for clustering models.",
      ).optional(),
      durationMs: z.string().describe(
        "Time taken to run the iteration in milliseconds.",
      ).optional(),
      evalLoss: z.number().describe(
        "Loss computed on the eval data at the end of iteration.",
      ).optional(),
      index: z.number().int().describe("Index of the iteration, 0 based.")
        .optional(),
      learnRate: z.number().describe("Learn rate used for this iteration.")
        .optional(),
      principalComponentInfos: z.array(z.unknown()).describe(
        "The information of the principal components.",
      ).optional(),
      trainingLoss: z.number().describe(
        "Loss computed on the training data at the end of iteration.",
      ).optional(),
    })).describe(
      "Output only. Output of each iteration run, results.size() <= max_iterations.",
    ).optional(),
    startTime: z.string().describe(
      "Output only. The start time of this training run.",
    ).optional(),
    trainingOptions: z.object({
      activationFn: z.string().describe(
        "Activation function of the neural nets.",
      ).optional(),
      adjustStepChanges: z.boolean().describe(
        "If true, detect step changes and make data adjustment in the input time series.",
      ).optional(),
      approxGlobalFeatureContrib: z.boolean().describe(
        "Whether to use approximate feature contribution method in XGBoost model explanation for global explain.",
      ).optional(),
      autoArima: z.boolean().describe("Whether to enable auto ARIMA or not.")
        .optional(),
      autoArimaMaxOrder: z.string().describe(
        "The max value of the sum of non-seasonal p and q.",
      ).optional(),
      autoArimaMinOrder: z.string().describe(
        "The min value of the sum of non-seasonal p and q.",
      ).optional(),
      autoClassWeights: z.boolean().describe(
        "Whether to calculate class weights automatically based on the popularity of each label.",
      ).optional(),
      batchSize: z.string().describe("Batch size for dnn models.").optional(),
      boosterType: z.enum(["BOOSTER_TYPE_UNSPECIFIED", "GBTREE", "DART"])
        .describe("Booster type for boosted tree models.").optional(),
      budgetHours: z.number().describe("Budget in hours for AutoML training.")
        .optional(),
      calculatePValues: z.boolean().describe(
        "Whether or not p-value test should be computed for this model. Only available for linear and logistic regression models.",
      ).optional(),
      categoryEncodingMethod: z.enum([
        "ENCODING_METHOD_UNSPECIFIED",
        "ONE_HOT_ENCODING",
        "LABEL_ENCODING",
        "DUMMY_ENCODING",
      ]).describe("Categorical feature encoding method.").optional(),
      cleanSpikesAndDips: z.boolean().describe(
        "If true, clean spikes and dips in the input time series.",
      ).optional(),
      colorSpace: z.enum([
        "COLOR_SPACE_UNSPECIFIED",
        "RGB",
        "HSV",
        "YIQ",
        "YUV",
        "GRAYSCALE",
      ]).describe(
        "Enums for color space, used for processing images in Object Table. See more details at https://www.tensorflow.org/io/tutorials/colorspace.",
      ).optional(),
      colsampleBylevel: z.number().describe(
        "Subsample ratio of columns for each level for boosted tree models.",
      ).optional(),
      colsampleBynode: z.number().describe(
        "Subsample ratio of columns for each node(split) for boosted tree models.",
      ).optional(),
      colsampleBytree: z.number().describe(
        "Subsample ratio of columns when constructing each tree for boosted tree models.",
      ).optional(),
      contributionMetric: z.string().describe(
        "The contribution metric. Applies to contribution analysis models. Allowed formats supported are for summable and summable ratio contribution metrics. These include expressions such as `SUM(x)` or `SUM(x)/SUM(y)`, where x and y are column names from the base table.",
      ).optional(),
      dartNormalizeType: z.enum([
        "DART_NORMALIZE_TYPE_UNSPECIFIED",
        "TREE",
        "FOREST",
      ]).describe(
        "Type of normalization algorithm for boosted tree models using dart booster.",
      ).optional(),
      dataFrequency: z.enum([
        "DATA_FREQUENCY_UNSPECIFIED",
        "AUTO_FREQUENCY",
        "YEARLY",
        "QUARTERLY",
        "MONTHLY",
        "WEEKLY",
        "DAILY",
        "HOURLY",
        "PER_MINUTE",
      ]).describe("The data frequency of a time series.").optional(),
      dataSplitColumn: z.string().describe(
        "The column to split data with. This column won't be used as a feature. 1. When data_split_method is CUSTOM, the corresponding column should be boolean. The rows with true value tag are eval data, and the false are training data. 2. When data_split_method is SEQ, the first DATA_SPLIT_EVAL_FRACTION rows (from smallest to largest) in the corresponding column are used as training data, and the rest are eval data. It respects the order in Orderable data types: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#data_type_properties",
      ).optional(),
      dataSplitEvalFraction: z.number().describe(
        "The fraction of evaluation data over the whole input data. The rest of data will be used as training data. The format should be double. Accurate to two decimal places. Default value is 0.2.",
      ).optional(),
      dataSplitMethod: z.enum([
        "DATA_SPLIT_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "SEQUENTIAL",
        "NO_SPLIT",
        "AUTO_SPLIT",
      ]).describe(
        "The data split type for training and evaluation, e.g. RANDOM.",
      ).optional(),
      decomposeTimeSeries: z.boolean().describe(
        "If true, perform decompose time series and save the results.",
      ).optional(),
      dimensionIdColumns: z.array(z.string()).describe(
        "Optional. Names of the columns to slice on. Applies to contribution analysis models.",
      ).optional(),
      distanceType: z.enum(["DISTANCE_TYPE_UNSPECIFIED", "EUCLIDEAN", "COSINE"])
        .describe("Distance type for clustering models.").optional(),
      dropout: z.number().describe("Dropout probability for dnn models.")
        .optional(),
      earlyStop: z.boolean().describe(
        "Whether to stop early when the loss doesn't improve significantly any more (compared to min_relative_progress). Used only for iterative training algorithms.",
      ).optional(),
      enableGlobalExplain: z.boolean().describe(
        "If true, enable global explanation during training.",
      ).optional(),
      endpointIdleTtl: z.string().describe(
        "The idle TTL of the endpoint before the resources get destroyed. The default value is 6.5 hours.",
      ).optional(),
      feedbackType: z.enum([
        "FEEDBACK_TYPE_UNSPECIFIED",
        "IMPLICIT",
        "EXPLICIT",
      ]).describe(
        "Feedback type that specifies which algorithm to run for matrix factorization.",
      ).optional(),
      fitIntercept: z.boolean().describe(
        "Whether the model should include intercept during model training.",
      ).optional(),
      forecastLimitLowerBound: z.number().describe(
        "The forecast limit lower bound that was used during ARIMA model training with limits. To see more details of the algorithm: https://otexts.com/fpp2/limits.html",
      ).optional(),
      forecastLimitUpperBound: z.number().describe(
        "The forecast limit upper bound that was used during ARIMA model training with limits.",
      ).optional(),
      hiddenUnits: z.array(z.string()).describe("Hidden units for dnn models.")
        .optional(),
      holidayRegion: z.enum([
        "HOLIDAY_REGION_UNSPECIFIED",
        "GLOBAL",
        "NA",
        "JAPAC",
        "EMEA",
        "LAC",
        "AE",
        "AR",
        "AT",
        "AU",
        "BE",
        "BR",
        "CA",
        "CH",
        "CL",
        "CN",
        "CO",
        "CS",
        "CZ",
        "DE",
        "DK",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ES",
        "FI",
        "FR",
        "GB",
        "GR",
        "HK",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IR",
        "IT",
        "JP",
        "KR",
        "LV",
        "MA",
        "MX",
        "MY",
        "NG",
        "NL",
        "NO",
        "NZ",
        "PE",
        "PH",
        "PK",
        "PL",
        "PT",
        "RO",
        "RS",
        "RU",
        "SA",
        "SE",
        "SG",
        "SI",
        "SK",
        "TH",
        "TR",
        "TW",
        "UA",
        "US",
        "VE",
        "VN",
        "ZA",
      ]).describe(
        "The geographical region based on which the holidays are considered in time series modeling. If a valid value is specified, then holiday effects modeling is enabled.",
      ).optional(),
      holidayRegions: z.array(
        z.enum([
          "HOLIDAY_REGION_UNSPECIFIED",
          "GLOBAL",
          "NA",
          "JAPAC",
          "EMEA",
          "LAC",
          "AE",
          "AR",
          "AT",
          "AU",
          "BE",
          "BR",
          "CA",
          "CH",
          "CL",
          "CN",
          "CO",
          "CS",
          "CZ",
          "DE",
          "DK",
          "DZ",
          "EC",
          "EE",
          "EG",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "HK",
          "HU",
          "ID",
          "IE",
          "IL",
          "IN",
          "IR",
          "IT",
          "JP",
          "KR",
          "LV",
          "MA",
          "MX",
          "MY",
          "NG",
          "NL",
          "NO",
          "NZ",
          "PE",
          "PH",
          "PK",
          "PL",
          "PT",
          "RO",
          "RS",
          "RU",
          "SA",
          "SE",
          "SG",
          "SI",
          "SK",
          "TH",
          "TR",
          "TW",
          "UA",
          "US",
          "VE",
          "VN",
          "ZA",
        ]),
      ).describe(
        "A list of geographical regions that are used for time series modeling.",
      ).optional(),
      horizon: z.string().describe(
        "The number of periods ahead that need to be forecasted.",
      ).optional(),
      hparamTuningObjectives: z.array(
        z.enum([
          "HPARAM_TUNING_OBJECTIVE_UNSPECIFIED",
          "MEAN_ABSOLUTE_ERROR",
          "MEAN_SQUARED_ERROR",
          "MEAN_SQUARED_LOG_ERROR",
          "MEDIAN_ABSOLUTE_ERROR",
          "R_SQUARED",
          "EXPLAINED_VARIANCE",
          "PRECISION",
          "RECALL",
          "ACCURACY",
          "F1_SCORE",
          "LOG_LOSS",
          "ROC_AUC",
          "DAVIES_BOULDIN_INDEX",
          "MEAN_AVERAGE_PRECISION",
          "NORMALIZED_DISCOUNTED_CUMULATIVE_GAIN",
          "AVERAGE_RANK",
        ]),
      ).describe(
        "The target evaluation metrics to optimize the hyperparameters for.",
      ).optional(),
      huggingFaceModelId: z.string().describe(
        "The id of a Hugging Face model. For example, `google/gemma-2-2b-it`.",
      ).optional(),
      includeDrift: z.boolean().describe(
        "Include drift when fitting an ARIMA model.",
      ).optional(),
      initialLearnRate: z.number().describe(
        "Specifies the initial learning rate for the line search learn rate strategy.",
      ).optional(),
      inputLabelColumns: z.array(z.string()).describe(
        "Name of input label columns in training data.",
      ).optional(),
      instanceWeightColumn: z.string().describe(
        "Name of the instance weight column for training data. This column isn't be used as a feature.",
      ).optional(),
      integratedGradientsNumSteps: z.string().describe(
        "Number of integral steps for the integrated gradients explain method.",
      ).optional(),
      isTestColumn: z.string().describe(
        "Name of the column used to determine the rows corresponding to control and test. Applies to contribution analysis models.",
      ).optional(),
      itemColumn: z.string().describe(
        "Item column specified for matrix factorization models.",
      ).optional(),
      kmeansInitializationColumn: z.string().describe(
        "The column used to provide the initial centroids for kmeans algorithm when kmeans_initialization_method is CUSTOM.",
      ).optional(),
      kmeansInitializationMethod: z.enum([
        "KMEANS_INITIALIZATION_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "KMEANS_PLUS_PLUS",
      ]).describe(
        "The method used to initialize the centroids for kmeans algorithm.",
      ).optional(),
      l1RegActivation: z.number().describe(
        "L1 regularization coefficient to activations.",
      ).optional(),
      l1Regularization: z.number().describe("L1 regularization coefficient.")
        .optional(),
      l2Regularization: z.number().describe("L2 regularization coefficient.")
        .optional(),
      labelClassWeights: z.record(z.string(), z.number()).describe(
        "Weights associated with each label class, for rebalancing the training data. Only applicable for classification models.",
      ).optional(),
      learnRate: z.number().describe(
        "Learning rate in training. Used only for iterative training algorithms.",
      ).optional(),
      learnRateStrategy: z.enum([
        "LEARN_RATE_STRATEGY_UNSPECIFIED",
        "LINE_SEARCH",
        "CONSTANT",
      ]).describe(
        "The strategy to determine learn rate for the current iteration.",
      ).optional(),
      lossType: z.enum([
        "LOSS_TYPE_UNSPECIFIED",
        "MEAN_SQUARED_LOSS",
        "MEAN_LOG_LOSS",
      ]).describe("Type of loss function used during training run.").optional(),
      machineType: z.string().describe(
        "The type of the machine used to deploy and serve the model.",
      ).optional(),
      maxIterations: z.string().describe(
        "The maximum number of iterations in training. Used only for iterative training algorithms.",
      ).optional(),
      maxParallelTrials: z.string().describe(
        "Maximum number of trials to run in parallel.",
      ).optional(),
      maxReplicaCount: z.string().describe(
        "The maximum number of machine replicas that will be deployed on an endpoint. The default value is equal to min_replica_count.",
      ).optional(),
      maxTimeSeriesLength: z.string().describe(
        "The maximum number of time points in a time series that can be used in modeling the trend component of the time series. Don't use this option with the `timeSeriesLengthFraction` or `minTimeSeriesLength` options.",
      ).optional(),
      maxTreeDepth: z.string().describe(
        "Maximum depth of a tree for boosted tree models.",
      ).optional(),
      minAprioriSupport: z.number().describe(
        "The apriori support minimum. Applies to contribution analysis models.",
      ).optional(),
      minRelativeProgress: z.number().describe(
        "When early_stop is true, stops training when accuracy improvement is less than 'min_relative_progress'. Used only for iterative training algorithms.",
      ).optional(),
      minReplicaCount: z.string().describe(
        "The minimum number of machine replicas that will be always deployed on an endpoint. This value must be greater than or equal to 1. The default value is 1.",
      ).optional(),
      minSplitLoss: z.number().describe(
        "Minimum split loss for boosted tree models.",
      ).optional(),
      minTimeSeriesLength: z.string().describe(
        "The minimum number of time points in a time series that are used in modeling the trend component of the time series. If you use this option you must also set the `timeSeriesLengthFraction` option. This training option ensures that enough time points are available when you use `timeSeriesLengthFraction` in trend modeling. This is particularly important when forecasting multiple time series in a single query using `timeSeriesIdColumn`. If the total number of time points is less than the `minTimeSeriesLength` value, then the query uses all available time points.",
      ).optional(),
      minTreeChildWeight: z.string().describe(
        "Minimum sum of instance weight needed in a child for boosted tree models.",
      ).optional(),
      modelGardenModelName: z.string().describe(
        "The name of a Vertex model garden publisher model. Format is `publishers/{publisher}/models/{model}@{optional_version_id}`.",
      ).optional(),
      modelRegistry: z.enum(["MODEL_REGISTRY_UNSPECIFIED", "VERTEX_AI"])
        .describe("The model registry.").optional(),
      modelUri: z.string().describe(
        "Google Cloud Storage URI from which the model was imported. Only applicable for imported models.",
      ).optional(),
      nonSeasonalOrder: z.object({
        d: z.string().describe("Order of the differencing part.").optional(),
        p: z.string().describe("Order of the autoregressive part.").optional(),
        q: z.string().describe("Order of the moving-average part.").optional(),
      }).describe(
        "A specification of the non-seasonal part of the ARIMA model: the three components (p, d, q) are the AR order, the degree of differencing, and the MA order.",
      ).optional(),
      numClusters: z.string().describe(
        "Number of clusters for clustering models.",
      ).optional(),
      numFactors: z.string().describe(
        "Num factors specified for matrix factorization models.",
      ).optional(),
      numParallelTree: z.string().describe(
        "Number of parallel trees constructed during each iteration for boosted tree models.",
      ).optional(),
      numPrincipalComponents: z.string().describe(
        "Number of principal components to keep in the PCA model. Must be <= the number of features.",
      ).optional(),
      numTrials: z.string().describe(
        "Number of trials to run this hyperparameter tuning job.",
      ).optional(),
      optimizationStrategy: z.enum([
        "OPTIMIZATION_STRATEGY_UNSPECIFIED",
        "BATCH_GRADIENT_DESCENT",
        "NORMAL_EQUATION",
      ]).describe(
        "Optimization strategy for training linear regression models.",
      ).optional(),
      optimizer: z.string().describe(
        "Optimizer used for training the neural nets.",
      ).optional(),
      pcaExplainedVarianceRatio: z.number().describe(
        "The minimum ratio of cumulative explained variance that needs to be given by the PCA model.",
      ).optional(),
      pcaSolver: z.enum(["UNSPECIFIED", "FULL", "RANDOMIZED", "AUTO"]).describe(
        "The solver for PCA.",
      ).optional(),
      reservationAffinityKey: z.string().describe(
        "Corresponds to the label key of a reservation resource used by Vertex AI. To target a SPECIFIC_RESERVATION by name, use `compute.googleapis.com/reservation-name` as the key and specify the name of your reservation as its value.",
      ).optional(),
      reservationAffinityType: z.enum([
        "RESERVATION_AFFINITY_TYPE_UNSPECIFIED",
        "NO_RESERVATION",
        "ANY_RESERVATION",
        "SPECIFIC_RESERVATION",
      ]).describe(
        "Specifies the reservation affinity type used to configure a Vertex AI resource. The default value is `NO_RESERVATION`.",
      ).optional(),
      reservationAffinityValues: z.array(z.string()).describe(
        "Corresponds to the label values of a reservation resource used by Vertex AI. This must be the full resource name of the reservation or reservation block.",
      ).optional(),
      sampledShapleyNumPaths: z.string().describe(
        "Number of paths for the sampled Shapley explain method.",
      ).optional(),
      scaleFeatures: z.boolean().describe(
        "If true, scale the feature values by dividing the feature standard deviation. Currently only apply to PCA.",
      ).optional(),
      standardizeFeatures: z.boolean().describe(
        "Whether to standardize numerical features. Default to true.",
      ).optional(),
      subsample: z.number().describe(
        "Subsample fraction of the training data to grow tree to prevent overfitting for boosted tree models.",
      ).optional(),
      tfVersion: z.string().describe(
        "Based on the selected TF version, the corresponding docker image is used to train external models.",
      ).optional(),
      timeSeriesDataColumn: z.string().describe(
        "Column to be designated as time series data for ARIMA model.",
      ).optional(),
      timeSeriesIdColumn: z.string().describe(
        "The time series id column that was used during ARIMA model training.",
      ).optional(),
      timeSeriesIdColumns: z.array(z.string()).describe(
        "The time series id columns that were used during ARIMA model training.",
      ).optional(),
      timeSeriesLengthFraction: z.number().describe(
        "The fraction of the interpolated length of the time series that's used to model the time series trend component. All of the time points of the time series are used to model the non-trend component. This training option accelerates modeling training without sacrificing much forecasting accuracy. You can use this option with `minTimeSeriesLength` but not with `maxTimeSeriesLength`.",
      ).optional(),
      timeSeriesTimestampColumn: z.string().describe(
        "Column to be designated as time series timestamp for ARIMA model.",
      ).optional(),
      treeMethod: z.enum([
        "TREE_METHOD_UNSPECIFIED",
        "AUTO",
        "EXACT",
        "APPROX",
        "HIST",
      ]).describe("Tree construction algorithm for boosted tree models.")
        .optional(),
      trendSmoothingWindowSize: z.string().describe(
        "Smoothing window size for the trend component. When a positive value is specified, a center moving average smoothing is applied on the history trend. When the smoothing window is out of the boundary at the beginning or the end of the trend, the first element or the last element is padded to fill the smoothing window before the average is applied.",
      ).optional(),
      userColumn: z.string().describe(
        "User column specified for matrix factorization models.",
      ).optional(),
      vertexAiModelVersionAliases: z.array(z.string()).describe(
        "The version aliases to apply in Vertex AI model registry. Always overwrite if the version aliases exists in a existing model.",
      ).optional(),
      walsAlpha: z.number().describe(
        "Hyperparameter for matrix factoration when implicit feedback type is specified.",
      ).optional(),
      warmStart: z.boolean().describe(
        "Whether to train a model from the last checkpoint.",
      ).optional(),
      xgboostVersion: z.string().describe(
        "User-selected XGBoost versions for training of XGBoost models.",
      ).optional(),
    }).describe(
      "Output only. Options that were used for this training run, includes user specified and default options that were used.",
    ).optional(),
    trainingStartTime: z.string().describe(
      "Output only. The start time of this training run, in milliseconds since epoch.",
    ).optional(),
    vertexAiModelId: z.string().describe(
      "The model id in the [Vertex AI Model Registry](https://cloud.google.com/vertex-ai/docs/model-registry/introduction) for this training run.",
    ).optional(),
    vertexAiModelVersion: z.string().describe(
      "Output only. The model version in the [Vertex AI Model Registry](https://cloud.google.com/vertex-ai/docs/model-registry/introduction) for this training run.",
    ).optional(),
  })).describe(
    "Information for all training runs in increasing order of start_time.",
  ).optional(),
  transformColumns: z.array(z.object({
    name: z.string().describe("Output only. Name of the column.").optional(),
    transformSql: z.string().describe(
      "Output only. The SQL expression used in the column transform.",
    ).optional(),
    type: z.object({
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
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe("Output only. Data type of the column after the transform.")
      .optional(),
  })).describe(
    "Output only. This field will be populated if a TRANSFORM clause was used to train a model. TRANSFORM clause (if used) takes feature_columns as input and outputs transform_columns. transform_columns then are used to train the model.",
  ).optional(),
  datasetId: z.string().describe(
    "Required. Dataset ID of the requested model.",
  ),
});

const StateSchema = z.object({
  bestTrialId: z.string().optional(),
  creationTime: z.string().optional(),
  defaultTrialId: z.string().optional(),
  description: z.string().optional(),
  encryptionConfiguration: z.object({
    kmsKeyName: z.string(),
  }).optional(),
  etag: z.string().optional(),
  expirationTime: z.string().optional(),
  featureColumns: z.array(z.object({
    name: z.string(),
    type: z.object({
      arrayElementType: z.record(z.string(), z.unknown()),
      rangeElementType: z.record(z.string(), z.unknown()),
      structType: z.object({
        fields: z.array(z.unknown()),
      }),
      typeKind: z.string(),
    }),
  })).optional(),
  friendlyName: z.string().optional(),
  hparamSearchSpaces: z.object({
    activationFn: z.object({
      candidates: z.array(z.string()),
    }),
    batchSize: z.object({
      candidates: z.object({
        candidates: z.array(z.string()),
      }),
      range: z.object({
        max: z.string(),
        min: z.string(),
      }),
    }),
    boosterType: z.object({
      candidates: z.array(z.string()),
    }),
    colsampleBylevel: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    colsampleBynode: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    colsampleBytree: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    dartNormalizeType: z.object({
      candidates: z.array(z.string()),
    }),
    dropout: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    hiddenUnits: z.object({
      candidates: z.array(z.object({
        elements: z.array(z.unknown()),
      })),
    }),
    l1Reg: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    l2Reg: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    learnRate: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    maxTreeDepth: z.object({
      candidates: z.object({
        candidates: z.array(z.string()),
      }),
      range: z.object({
        max: z.string(),
        min: z.string(),
      }),
    }),
    minSplitLoss: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    minTreeChildWeight: z.object({
      candidates: z.object({
        candidates: z.array(z.string()),
      }),
      range: z.object({
        max: z.string(),
        min: z.string(),
      }),
    }),
    numClusters: z.object({
      candidates: z.object({
        candidates: z.array(z.string()),
      }),
      range: z.object({
        max: z.string(),
        min: z.string(),
      }),
    }),
    numFactors: z.object({
      candidates: z.object({
        candidates: z.array(z.string()),
      }),
      range: z.object({
        max: z.string(),
        min: z.string(),
      }),
    }),
    numParallelTree: z.object({
      candidates: z.object({
        candidates: z.array(z.string()),
      }),
      range: z.object({
        max: z.string(),
        min: z.string(),
      }),
    }),
    optimizer: z.object({
      candidates: z.array(z.string()),
    }),
    subsample: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
    treeMethod: z.object({
      candidates: z.array(z.string()),
    }),
    walsAlpha: z.object({
      candidates: z.object({
        candidates: z.array(z.number()),
      }),
      range: z.object({
        max: z.number(),
        min: z.number(),
      }),
    }),
  }).optional(),
  hparamTrials: z.array(z.object({
    endTimeMs: z.string(),
    errorMessage: z.string(),
    evalLoss: z.number(),
    evaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()),
        hasDrift: z.array(z.unknown()),
        nonSeasonalOrder: z.array(z.unknown()),
        seasonalPeriods: z.array(z.unknown()),
        timeSeriesId: z.array(z.unknown()),
      }),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown(),
          f1Score: z.unknown(),
          logLoss: z.unknown(),
          precision: z.unknown(),
          recall: z.unknown(),
          rocAuc: z.unknown(),
          threshold: z.unknown(),
        }),
        binaryConfusionMatrixList: z.array(z.unknown()),
        negativeLabel: z.string(),
        positiveLabel: z.string(),
      }),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()),
        daviesBouldinIndex: z.number(),
        meanSquaredDistance: z.number(),
      }),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number(),
      }),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown(),
          f1Score: z.unknown(),
          logLoss: z.unknown(),
          precision: z.unknown(),
          recall: z.unknown(),
          rocAuc: z.unknown(),
          threshold: z.unknown(),
        }),
        confusionMatrixList: z.array(z.unknown()),
      }),
      rankingMetrics: z.object({
        averageRank: z.number(),
        meanAveragePrecision: z.number(),
        meanSquaredError: z.number(),
        normalizedDiscountedCumulativeGain: z.number(),
      }),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number(),
        meanSquaredError: z.number(),
        meanSquaredLogError: z.number(),
        medianAbsoluteError: z.number(),
        rSquared: z.number(),
      }),
    }),
    hparamTuningEvaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()),
        hasDrift: z.array(z.unknown()),
        nonSeasonalOrder: z.array(z.unknown()),
        seasonalPeriods: z.array(z.unknown()),
        timeSeriesId: z.array(z.unknown()),
      }),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown(),
          f1Score: z.unknown(),
          logLoss: z.unknown(),
          precision: z.unknown(),
          recall: z.unknown(),
          rocAuc: z.unknown(),
          threshold: z.unknown(),
        }),
        binaryConfusionMatrixList: z.array(z.unknown()),
        negativeLabel: z.string(),
        positiveLabel: z.string(),
      }),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()),
        daviesBouldinIndex: z.number(),
        meanSquaredDistance: z.number(),
      }),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number(),
      }),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown(),
          f1Score: z.unknown(),
          logLoss: z.unknown(),
          precision: z.unknown(),
          recall: z.unknown(),
          rocAuc: z.unknown(),
          threshold: z.unknown(),
        }),
        confusionMatrixList: z.array(z.unknown()),
      }),
      rankingMetrics: z.object({
        averageRank: z.number(),
        meanAveragePrecision: z.number(),
        meanSquaredError: z.number(),
        normalizedDiscountedCumulativeGain: z.number(),
      }),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number(),
        meanSquaredError: z.number(),
        meanSquaredLogError: z.number(),
        medianAbsoluteError: z.number(),
        rSquared: z.number(),
      }),
    }),
    hparams: z.object({
      activationFn: z.string(),
      adjustStepChanges: z.boolean(),
      approxGlobalFeatureContrib: z.boolean(),
      autoArima: z.boolean(),
      autoArimaMaxOrder: z.string(),
      autoArimaMinOrder: z.string(),
      autoClassWeights: z.boolean(),
      batchSize: z.string(),
      boosterType: z.string(),
      budgetHours: z.number(),
      calculatePValues: z.boolean(),
      categoryEncodingMethod: z.string(),
      cleanSpikesAndDips: z.boolean(),
      colorSpace: z.string(),
      colsampleBylevel: z.number(),
      colsampleBynode: z.number(),
      colsampleBytree: z.number(),
      contributionMetric: z.string(),
      dartNormalizeType: z.string(),
      dataFrequency: z.string(),
      dataSplitColumn: z.string(),
      dataSplitEvalFraction: z.number(),
      dataSplitMethod: z.string(),
      decomposeTimeSeries: z.boolean(),
      dimensionIdColumns: z.array(z.string()),
      distanceType: z.string(),
      dropout: z.number(),
      earlyStop: z.boolean(),
      enableGlobalExplain: z.boolean(),
      endpointIdleTtl: z.string(),
      feedbackType: z.string(),
      fitIntercept: z.boolean(),
      forecastLimitLowerBound: z.number(),
      forecastLimitUpperBound: z.number(),
      hiddenUnits: z.array(z.string()),
      holidayRegion: z.string(),
      holidayRegions: z.array(z.string()),
      horizon: z.string(),
      hparamTuningObjectives: z.array(z.string()),
      huggingFaceModelId: z.string(),
      includeDrift: z.boolean(),
      initialLearnRate: z.number(),
      inputLabelColumns: z.array(z.string()),
      instanceWeightColumn: z.string(),
      integratedGradientsNumSteps: z.string(),
      isTestColumn: z.string(),
      itemColumn: z.string(),
      kmeansInitializationColumn: z.string(),
      kmeansInitializationMethod: z.string(),
      l1RegActivation: z.number(),
      l1Regularization: z.number(),
      l2Regularization: z.number(),
      labelClassWeights: z.record(z.string(), z.unknown()),
      learnRate: z.number(),
      learnRateStrategy: z.string(),
      lossType: z.string(),
      machineType: z.string(),
      maxIterations: z.string(),
      maxParallelTrials: z.string(),
      maxReplicaCount: z.string(),
      maxTimeSeriesLength: z.string(),
      maxTreeDepth: z.string(),
      minAprioriSupport: z.number(),
      minRelativeProgress: z.number(),
      minReplicaCount: z.string(),
      minSplitLoss: z.number(),
      minTimeSeriesLength: z.string(),
      minTreeChildWeight: z.string(),
      modelGardenModelName: z.string(),
      modelRegistry: z.string(),
      modelUri: z.string(),
      nonSeasonalOrder: z.object({
        d: z.string(),
        p: z.string(),
        q: z.string(),
      }),
      numClusters: z.string(),
      numFactors: z.string(),
      numParallelTree: z.string(),
      numPrincipalComponents: z.string(),
      numTrials: z.string(),
      optimizationStrategy: z.string(),
      optimizer: z.string(),
      pcaExplainedVarianceRatio: z.number(),
      pcaSolver: z.string(),
      reservationAffinityKey: z.string(),
      reservationAffinityType: z.string(),
      reservationAffinityValues: z.array(z.string()),
      sampledShapleyNumPaths: z.string(),
      scaleFeatures: z.boolean(),
      standardizeFeatures: z.boolean(),
      subsample: z.number(),
      tfVersion: z.string(),
      timeSeriesDataColumn: z.string(),
      timeSeriesIdColumn: z.string(),
      timeSeriesIdColumns: z.array(z.string()),
      timeSeriesLengthFraction: z.number(),
      timeSeriesTimestampColumn: z.string(),
      treeMethod: z.string(),
      trendSmoothingWindowSize: z.string(),
      userColumn: z.string(),
      vertexAiModelVersionAliases: z.array(z.string()),
      walsAlpha: z.number(),
      warmStart: z.boolean(),
      xgboostVersion: z.string(),
    }),
    startTimeMs: z.string(),
    status: z.string(),
    trainingLoss: z.number(),
    trialId: z.string(),
  })).optional(),
  labelColumns: z.array(z.object({
    name: z.string(),
    type: z.object({
      arrayElementType: z.record(z.string(), z.unknown()),
      rangeElementType: z.record(z.string(), z.unknown()),
      structType: z.object({
        fields: z.array(z.unknown()),
      }),
      typeKind: z.string(),
    }),
  })).optional(),
  labels: z.record(z.string(), z.unknown()).optional(),
  lastModifiedTime: z.string().optional(),
  location: z.string().optional(),
  modelReference: z.object({
    datasetId: z.string(),
    modelId: z.string(),
    projectId: z.string(),
  }).optional(),
  modelType: z.string().optional(),
  optimalTrialIds: z.array(z.string()).optional(),
  remoteModelInfo: z.object({
    connection: z.string(),
    endpoint: z.string(),
    maxBatchingRows: z.string(),
    remoteModelVersion: z.string(),
    remoteServiceType: z.string(),
    speechRecognizer: z.string(),
  }).optional(),
  trainingRuns: z.array(z.object({
    classLevelGlobalExplanations: z.array(z.object({
      classLabel: z.string(),
      explanations: z.array(z.unknown()),
    })),
    dataSplitResult: z.object({
      evaluationTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      testTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
      trainingTable: z.object({
        datasetId: z.string(),
        projectId: z.string(),
        tableId: z.string(),
      }),
    }),
    evaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()),
        hasDrift: z.array(z.unknown()),
        nonSeasonalOrder: z.array(z.unknown()),
        seasonalPeriods: z.array(z.unknown()),
        timeSeriesId: z.array(z.unknown()),
      }),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown(),
          f1Score: z.unknown(),
          logLoss: z.unknown(),
          precision: z.unknown(),
          recall: z.unknown(),
          rocAuc: z.unknown(),
          threshold: z.unknown(),
        }),
        binaryConfusionMatrixList: z.array(z.unknown()),
        negativeLabel: z.string(),
        positiveLabel: z.string(),
      }),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()),
        daviesBouldinIndex: z.number(),
        meanSquaredDistance: z.number(),
      }),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number(),
      }),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown(),
          f1Score: z.unknown(),
          logLoss: z.unknown(),
          precision: z.unknown(),
          recall: z.unknown(),
          rocAuc: z.unknown(),
          threshold: z.unknown(),
        }),
        confusionMatrixList: z.array(z.unknown()),
      }),
      rankingMetrics: z.object({
        averageRank: z.number(),
        meanAveragePrecision: z.number(),
        meanSquaredError: z.number(),
        normalizedDiscountedCumulativeGain: z.number(),
      }),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number(),
        meanSquaredError: z.number(),
        meanSquaredLogError: z.number(),
        medianAbsoluteError: z.number(),
        rSquared: z.number(),
      }),
    }),
    modelLevelGlobalExplanation: z.object({
      classLabel: z.string(),
      explanations: z.array(z.object({
        attribution: z.unknown(),
        featureName: z.unknown(),
      })),
    }),
    results: z.array(z.object({
      arimaResult: z.object({
        arimaModelInfo: z.unknown(),
        seasonalPeriods: z.unknown(),
      }),
      clusterInfos: z.array(z.unknown()),
      durationMs: z.string(),
      evalLoss: z.number(),
      index: z.number(),
      learnRate: z.number(),
      principalComponentInfos: z.array(z.unknown()),
      trainingLoss: z.number(),
    })),
    startTime: z.string(),
    trainingOptions: z.object({
      activationFn: z.string(),
      adjustStepChanges: z.boolean(),
      approxGlobalFeatureContrib: z.boolean(),
      autoArima: z.boolean(),
      autoArimaMaxOrder: z.string(),
      autoArimaMinOrder: z.string(),
      autoClassWeights: z.boolean(),
      batchSize: z.string(),
      boosterType: z.string(),
      budgetHours: z.number(),
      calculatePValues: z.boolean(),
      categoryEncodingMethod: z.string(),
      cleanSpikesAndDips: z.boolean(),
      colorSpace: z.string(),
      colsampleBylevel: z.number(),
      colsampleBynode: z.number(),
      colsampleBytree: z.number(),
      contributionMetric: z.string(),
      dartNormalizeType: z.string(),
      dataFrequency: z.string(),
      dataSplitColumn: z.string(),
      dataSplitEvalFraction: z.number(),
      dataSplitMethod: z.string(),
      decomposeTimeSeries: z.boolean(),
      dimensionIdColumns: z.array(z.string()),
      distanceType: z.string(),
      dropout: z.number(),
      earlyStop: z.boolean(),
      enableGlobalExplain: z.boolean(),
      endpointIdleTtl: z.string(),
      feedbackType: z.string(),
      fitIntercept: z.boolean(),
      forecastLimitLowerBound: z.number(),
      forecastLimitUpperBound: z.number(),
      hiddenUnits: z.array(z.string()),
      holidayRegion: z.string(),
      holidayRegions: z.array(z.string()),
      horizon: z.string(),
      hparamTuningObjectives: z.array(z.string()),
      huggingFaceModelId: z.string(),
      includeDrift: z.boolean(),
      initialLearnRate: z.number(),
      inputLabelColumns: z.array(z.string()),
      instanceWeightColumn: z.string(),
      integratedGradientsNumSteps: z.string(),
      isTestColumn: z.string(),
      itemColumn: z.string(),
      kmeansInitializationColumn: z.string(),
      kmeansInitializationMethod: z.string(),
      l1RegActivation: z.number(),
      l1Regularization: z.number(),
      l2Regularization: z.number(),
      labelClassWeights: z.record(z.string(), z.unknown()),
      learnRate: z.number(),
      learnRateStrategy: z.string(),
      lossType: z.string(),
      machineType: z.string(),
      maxIterations: z.string(),
      maxParallelTrials: z.string(),
      maxReplicaCount: z.string(),
      maxTimeSeriesLength: z.string(),
      maxTreeDepth: z.string(),
      minAprioriSupport: z.number(),
      minRelativeProgress: z.number(),
      minReplicaCount: z.string(),
      minSplitLoss: z.number(),
      minTimeSeriesLength: z.string(),
      minTreeChildWeight: z.string(),
      modelGardenModelName: z.string(),
      modelRegistry: z.string(),
      modelUri: z.string(),
      nonSeasonalOrder: z.object({
        d: z.string(),
        p: z.string(),
        q: z.string(),
      }),
      numClusters: z.string(),
      numFactors: z.string(),
      numParallelTree: z.string(),
      numPrincipalComponents: z.string(),
      numTrials: z.string(),
      optimizationStrategy: z.string(),
      optimizer: z.string(),
      pcaExplainedVarianceRatio: z.number(),
      pcaSolver: z.string(),
      reservationAffinityKey: z.string(),
      reservationAffinityType: z.string(),
      reservationAffinityValues: z.array(z.string()),
      sampledShapleyNumPaths: z.string(),
      scaleFeatures: z.boolean(),
      standardizeFeatures: z.boolean(),
      subsample: z.number(),
      tfVersion: z.string(),
      timeSeriesDataColumn: z.string(),
      timeSeriesIdColumn: z.string(),
      timeSeriesIdColumns: z.array(z.string()),
      timeSeriesLengthFraction: z.number(),
      timeSeriesTimestampColumn: z.string(),
      treeMethod: z.string(),
      trendSmoothingWindowSize: z.string(),
      userColumn: z.string(),
      vertexAiModelVersionAliases: z.array(z.string()),
      walsAlpha: z.number(),
      warmStart: z.boolean(),
      xgboostVersion: z.string(),
    }),
    trainingStartTime: z.string(),
    vertexAiModelId: z.string(),
    vertexAiModelVersion: z.string(),
  })).optional(),
  transformColumns: z.array(z.object({
    name: z.string(),
    transformSql: z.string(),
    type: z.object({
      arrayElementType: z.record(z.string(), z.unknown()),
      rangeElementType: z.record(z.string(), z.unknown()),
      structType: z.object({
        fields: z.array(z.unknown()),
      }),
      typeKind: z.string(),
    }),
  })).optional(),
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
  creationTime: z.string().describe(
    "Output only. The time when this model was created, in millisecs since the epoch.",
  ).optional(),
  defaultTrialId: z.string().describe(
    "Output only. The default trial_id to use in TVFs when the trial_id is not passed in. For single-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, this is the best trial ID. For multi-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, this is the smallest trial ID among all Pareto optimal trials.",
  ).optional(),
  description: z.string().describe(
    "Optional. A user-friendly description of this model.",
  ).optional(),
  encryptionConfiguration: z.object({
    kmsKeyName: z.string().describe(
      "Optional. Describes the Cloud KMS encryption key that will be used to protect destination BigQuery table. The BigQuery Service Account associated with your project requires access to this encryption key.",
    ).optional(),
  }).describe(
    "Custom encryption configuration (e.g., Cloud KMS keys). This shows the encryption configuration of the model data while stored in BigQuery storage. This field can be used with PatchModel to update encryption key for an already encrypted model.",
  ).optional(),
  etag: z.string().describe("Output only. A hash of this resource.").optional(),
  expirationTime: z.string().describe(
    "Optional. The time when this model expires, in milliseconds since the epoch. If not present, the model will persist indefinitely. Expired models will be deleted and their storage reclaimed. The defaultTableExpirationMs property of the encapsulating dataset can be used to set a default expirationTime on newly created models.",
  ).optional(),
  featureColumns: z.array(z.object({
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
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe(
      'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
    ).optional(),
  })).describe(
    "Output only. Input feature columns for the model inference. If the model is trained with TRANSFORM clause, these are the input of the TRANSFORM clause.",
  ).optional(),
  friendlyName: z.string().describe(
    "Optional. A descriptive name for this model.",
  ).optional(),
  hparamSearchSpaces: z.object({
    activationFn: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Activation functions of neural network models.").optional(),
    batchSize: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Mini batch sample size.").optional(),
    boosterType: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Booster type for boosted tree models.").optional(),
    colsampleBylevel: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample ratio of columns for each level for boosted tree models.",
    ).optional(),
    colsampleBynode: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample ratio of columns for each node(split) for boosted tree models.",
    ).optional(),
    colsampleBytree: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample ratio of columns when constructing each tree for boosted tree models.",
    ).optional(),
    dartNormalizeType: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Dart normalization type for boosted tree models.").optional(),
    dropout: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Dropout probability for dnn model training and boosted tree models using dart booster.",
    ).optional(),
    hiddenUnits: z.object({
      candidates: z.array(z.object({
        elements: z.array(z.unknown()).describe("Elements in the int array.")
          .optional(),
      })).describe("Candidates for the int array parameter.").optional(),
    }).describe("Hidden units for neural network models.").optional(),
    l1Reg: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("L1 regularization coefficient.").optional(),
    l2Reg: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("L2 regularization coefficient.").optional(),
    learnRate: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("Learning rate of training jobs.").optional(),
    maxTreeDepth: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Maximum depth of a tree for boosted tree models.").optional(),
    minSplitLoss: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe("Minimum split loss for boosted tree models.").optional(),
    minTreeChildWeight: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe(
      "Minimum sum of instance weight needed in a child for boosted tree models.",
    ).optional(),
    numClusters: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Number of clusters for k-means.").optional(),
    numFactors: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Number of latent factors to train on.").optional(),
    numParallelTree: z.object({
      candidates: z.object({
        candidates: z.array(z.string()).describe(
          "Candidates for the int parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the int hyperparameter.").optional(),
      range: z.object({
        max: z.string().describe("Max value of the int parameter.").optional(),
        min: z.string().describe("Min value of the int parameter.").optional(),
      }).describe("Range of the int hyperparameter.").optional(),
    }).describe("Number of parallel trees for boosted tree models.").optional(),
    optimizer: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Optimizer of TF models.").optional(),
    subsample: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Subsample the training data to grow tree to prevent overfitting for boosted tree models.",
    ).optional(),
    treeMethod: z.object({
      candidates: z.array(z.string()).describe(
        "Canididates for the string or enum parameter in lower case.",
      ).optional(),
    }).describe("Tree construction algorithm for boosted tree models.")
      .optional(),
    walsAlpha: z.object({
      candidates: z.object({
        candidates: z.array(z.number()).describe(
          "Candidates for the double parameter in increasing order.",
        ).optional(),
      }).describe("Candidates of the double hyperparameter.").optional(),
      range: z.object({
        max: z.number().describe("Max value of the double parameter.")
          .optional(),
        min: z.number().describe("Min value of the double parameter.")
          .optional(),
      }).describe("Range of the double hyperparameter.").optional(),
    }).describe(
      "Hyperparameter for matrix factoration when implicit feedback type is specified.",
    ).optional(),
  }).describe("Output only. All hyperparameter search spaces in this model.")
    .optional(),
  hparamTrials: z.array(z.object({
    endTimeMs: z.string().describe("Ending time of the trial.").optional(),
    errorMessage: z.string().describe(
      "Error message for FAILED and INFEASIBLE trial.",
    ).optional(),
    evalLoss: z.number().describe(
      "Loss computed on the eval data at the end of trial.",
    ).optional(),
    evaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()).describe(
          "Arima model fitting metrics.",
        ).optional(),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()).describe(
          "Repeated as there can be many metric sets (one for each model) in auto-arima and the large-scale case.",
        ).optional(),
        hasDrift: z.array(z.unknown()).describe(
          "Whether Arima model fitted with drift or not. It is always false when d is not 1.",
        ).optional(),
        nonSeasonalOrder: z.array(z.unknown()).describe("Non-seasonal order.")
          .optional(),
        seasonalPeriods: z.array(z.unknown()).describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
        timeSeriesId: z.array(z.unknown()).describe(
          "Id to differentiate different time series for the large-scale case.",
        ).optional(),
      }).describe("Populated for ARIMA models.").optional(),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        binaryConfusionMatrixList: z.array(z.unknown()).describe(
          "Binary confusion matrix at multiple thresholds.",
        ).optional(),
        negativeLabel: z.string().describe(
          "Label representing the negative class.",
        ).optional(),
        positiveLabel: z.string().describe(
          "Label representing the positive class.",
        ).optional(),
      }).describe("Populated for binary classification/classifier models.")
        .optional(),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()).describe("Information for all clusters.")
          .optional(),
        daviesBouldinIndex: z.number().describe("Davies-Bouldin index.")
          .optional(),
        meanSquaredDistance: z.number().describe(
          "Mean of squared distances between each sample to its cluster centroid.",
        ).optional(),
      }).describe("Populated for clustering models.").optional(),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number().describe(
          "Total percentage of variance explained by the selected principal components.",
        ).optional(),
      }).describe(
        "Evaluation metrics when the model is a dimensionality reduction model, which currently includes PCA.",
      ).optional(),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        confusionMatrixList: z.array(z.unknown()).describe(
          "Confusion matrix at different thresholds.",
        ).optional(),
      }).describe("Populated for multi-class classification/classifier models.")
        .optional(),
      rankingMetrics: z.object({
        averageRank: z.number().describe(
          "Determines the goodness of a ranking by computing the percentile rank from the predicted confidence and dividing it by the original rank.",
        ).optional(),
        meanAveragePrecision: z.number().describe(
          "Calculates a precision per user for all the items by ranking them and then averages all the precisions across all the users.",
        ).optional(),
        meanSquaredError: z.number().describe(
          "Similar to the mean squared error computed in regression and explicit recommendation models except instead of computing the rating directly, the output from evaluate is computed against a preference which is 1 or 0 depending on if the rating exists or not.",
        ).optional(),
        normalizedDiscountedCumulativeGain: z.number().describe(
          "A metric to determine the goodness of a ranking calculated from the predicted confidence by comparing it to an ideal rank measured by the original ratings.",
        ).optional(),
      }).describe(
        "Populated for implicit feedback type matrix factorization models.",
      ).optional(),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number().describe("Mean absolute error.")
          .optional(),
        meanSquaredError: z.number().describe("Mean squared error.").optional(),
        meanSquaredLogError: z.number().describe("Mean squared log error.")
          .optional(),
        medianAbsoluteError: z.number().describe("Median absolute error.")
          .optional(),
        rSquared: z.number().describe(
          "R^2 score. This corresponds to r2_score in ML.EVALUATE.",
        ).optional(),
      }).describe(
        "Populated for regression models and explicit feedback type matrix factorization models.",
      ).optional(),
    }).describe(
      "Evaluation metrics of this trial calculated on the test data. Empty in Job API.",
    ).optional(),
    hparamTuningEvaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()).describe(
          "Arima model fitting metrics.",
        ).optional(),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()).describe(
          "Repeated as there can be many metric sets (one for each model) in auto-arima and the large-scale case.",
        ).optional(),
        hasDrift: z.array(z.unknown()).describe(
          "Whether Arima model fitted with drift or not. It is always false when d is not 1.",
        ).optional(),
        nonSeasonalOrder: z.array(z.unknown()).describe("Non-seasonal order.")
          .optional(),
        seasonalPeriods: z.array(z.unknown()).describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
        timeSeriesId: z.array(z.unknown()).describe(
          "Id to differentiate different time series for the large-scale case.",
        ).optional(),
      }).describe("Populated for ARIMA models.").optional(),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        binaryConfusionMatrixList: z.array(z.unknown()).describe(
          "Binary confusion matrix at multiple thresholds.",
        ).optional(),
        negativeLabel: z.string().describe(
          "Label representing the negative class.",
        ).optional(),
        positiveLabel: z.string().describe(
          "Label representing the positive class.",
        ).optional(),
      }).describe("Populated for binary classification/classifier models.")
        .optional(),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()).describe("Information for all clusters.")
          .optional(),
        daviesBouldinIndex: z.number().describe("Davies-Bouldin index.")
          .optional(),
        meanSquaredDistance: z.number().describe(
          "Mean of squared distances between each sample to its cluster centroid.",
        ).optional(),
      }).describe("Populated for clustering models.").optional(),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number().describe(
          "Total percentage of variance explained by the selected principal components.",
        ).optional(),
      }).describe(
        "Evaluation metrics when the model is a dimensionality reduction model, which currently includes PCA.",
      ).optional(),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        confusionMatrixList: z.array(z.unknown()).describe(
          "Confusion matrix at different thresholds.",
        ).optional(),
      }).describe("Populated for multi-class classification/classifier models.")
        .optional(),
      rankingMetrics: z.object({
        averageRank: z.number().describe(
          "Determines the goodness of a ranking by computing the percentile rank from the predicted confidence and dividing it by the original rank.",
        ).optional(),
        meanAveragePrecision: z.number().describe(
          "Calculates a precision per user for all the items by ranking them and then averages all the precisions across all the users.",
        ).optional(),
        meanSquaredError: z.number().describe(
          "Similar to the mean squared error computed in regression and explicit recommendation models except instead of computing the rating directly, the output from evaluate is computed against a preference which is 1 or 0 depending on if the rating exists or not.",
        ).optional(),
        normalizedDiscountedCumulativeGain: z.number().describe(
          "A metric to determine the goodness of a ranking calculated from the predicted confidence by comparing it to an ideal rank measured by the original ratings.",
        ).optional(),
      }).describe(
        "Populated for implicit feedback type matrix factorization models.",
      ).optional(),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number().describe("Mean absolute error.")
          .optional(),
        meanSquaredError: z.number().describe("Mean squared error.").optional(),
        meanSquaredLogError: z.number().describe("Mean squared log error.")
          .optional(),
        medianAbsoluteError: z.number().describe("Median absolute error.")
          .optional(),
        rSquared: z.number().describe(
          "R^2 score. This corresponds to r2_score in ML.EVALUATE.",
        ).optional(),
      }).describe(
        "Populated for regression models and explicit feedback type matrix factorization models.",
      ).optional(),
    }).describe(
      "Hyperparameter tuning evaluation metrics of this trial calculated on the eval data. Unlike evaluation_metrics, only the fields corresponding to the hparam_tuning_objectives are set.",
    ).optional(),
    hparams: z.object({
      activationFn: z.string().describe(
        "Activation function of the neural nets.",
      ).optional(),
      adjustStepChanges: z.boolean().describe(
        "If true, detect step changes and make data adjustment in the input time series.",
      ).optional(),
      approxGlobalFeatureContrib: z.boolean().describe(
        "Whether to use approximate feature contribution method in XGBoost model explanation for global explain.",
      ).optional(),
      autoArima: z.boolean().describe("Whether to enable auto ARIMA or not.")
        .optional(),
      autoArimaMaxOrder: z.string().describe(
        "The max value of the sum of non-seasonal p and q.",
      ).optional(),
      autoArimaMinOrder: z.string().describe(
        "The min value of the sum of non-seasonal p and q.",
      ).optional(),
      autoClassWeights: z.boolean().describe(
        "Whether to calculate class weights automatically based on the popularity of each label.",
      ).optional(),
      batchSize: z.string().describe("Batch size for dnn models.").optional(),
      boosterType: z.enum(["BOOSTER_TYPE_UNSPECIFIED", "GBTREE", "DART"])
        .describe("Booster type for boosted tree models.").optional(),
      budgetHours: z.number().describe("Budget in hours for AutoML training.")
        .optional(),
      calculatePValues: z.boolean().describe(
        "Whether or not p-value test should be computed for this model. Only available for linear and logistic regression models.",
      ).optional(),
      categoryEncodingMethod: z.enum([
        "ENCODING_METHOD_UNSPECIFIED",
        "ONE_HOT_ENCODING",
        "LABEL_ENCODING",
        "DUMMY_ENCODING",
      ]).describe("Categorical feature encoding method.").optional(),
      cleanSpikesAndDips: z.boolean().describe(
        "If true, clean spikes and dips in the input time series.",
      ).optional(),
      colorSpace: z.enum([
        "COLOR_SPACE_UNSPECIFIED",
        "RGB",
        "HSV",
        "YIQ",
        "YUV",
        "GRAYSCALE",
      ]).describe(
        "Enums for color space, used for processing images in Object Table. See more details at https://www.tensorflow.org/io/tutorials/colorspace.",
      ).optional(),
      colsampleBylevel: z.number().describe(
        "Subsample ratio of columns for each level for boosted tree models.",
      ).optional(),
      colsampleBynode: z.number().describe(
        "Subsample ratio of columns for each node(split) for boosted tree models.",
      ).optional(),
      colsampleBytree: z.number().describe(
        "Subsample ratio of columns when constructing each tree for boosted tree models.",
      ).optional(),
      contributionMetric: z.string().describe(
        "The contribution metric. Applies to contribution analysis models. Allowed formats supported are for summable and summable ratio contribution metrics. These include expressions such as `SUM(x)` or `SUM(x)/SUM(y)`, where x and y are column names from the base table.",
      ).optional(),
      dartNormalizeType: z.enum([
        "DART_NORMALIZE_TYPE_UNSPECIFIED",
        "TREE",
        "FOREST",
      ]).describe(
        "Type of normalization algorithm for boosted tree models using dart booster.",
      ).optional(),
      dataFrequency: z.enum([
        "DATA_FREQUENCY_UNSPECIFIED",
        "AUTO_FREQUENCY",
        "YEARLY",
        "QUARTERLY",
        "MONTHLY",
        "WEEKLY",
        "DAILY",
        "HOURLY",
        "PER_MINUTE",
      ]).describe("The data frequency of a time series.").optional(),
      dataSplitColumn: z.string().describe(
        "The column to split data with. This column won't be used as a feature. 1. When data_split_method is CUSTOM, the corresponding column should be boolean. The rows with true value tag are eval data, and the false are training data. 2. When data_split_method is SEQ, the first DATA_SPLIT_EVAL_FRACTION rows (from smallest to largest) in the corresponding column are used as training data, and the rest are eval data. It respects the order in Orderable data types: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#data_type_properties",
      ).optional(),
      dataSplitEvalFraction: z.number().describe(
        "The fraction of evaluation data over the whole input data. The rest of data will be used as training data. The format should be double. Accurate to two decimal places. Default value is 0.2.",
      ).optional(),
      dataSplitMethod: z.enum([
        "DATA_SPLIT_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "SEQUENTIAL",
        "NO_SPLIT",
        "AUTO_SPLIT",
      ]).describe(
        "The data split type for training and evaluation, e.g. RANDOM.",
      ).optional(),
      decomposeTimeSeries: z.boolean().describe(
        "If true, perform decompose time series and save the results.",
      ).optional(),
      dimensionIdColumns: z.array(z.string()).describe(
        "Optional. Names of the columns to slice on. Applies to contribution analysis models.",
      ).optional(),
      distanceType: z.enum(["DISTANCE_TYPE_UNSPECIFIED", "EUCLIDEAN", "COSINE"])
        .describe("Distance type for clustering models.").optional(),
      dropout: z.number().describe("Dropout probability for dnn models.")
        .optional(),
      earlyStop: z.boolean().describe(
        "Whether to stop early when the loss doesn't improve significantly any more (compared to min_relative_progress). Used only for iterative training algorithms.",
      ).optional(),
      enableGlobalExplain: z.boolean().describe(
        "If true, enable global explanation during training.",
      ).optional(),
      endpointIdleTtl: z.string().describe(
        "The idle TTL of the endpoint before the resources get destroyed. The default value is 6.5 hours.",
      ).optional(),
      feedbackType: z.enum([
        "FEEDBACK_TYPE_UNSPECIFIED",
        "IMPLICIT",
        "EXPLICIT",
      ]).describe(
        "Feedback type that specifies which algorithm to run for matrix factorization.",
      ).optional(),
      fitIntercept: z.boolean().describe(
        "Whether the model should include intercept during model training.",
      ).optional(),
      forecastLimitLowerBound: z.number().describe(
        "The forecast limit lower bound that was used during ARIMA model training with limits. To see more details of the algorithm: https://otexts.com/fpp2/limits.html",
      ).optional(),
      forecastLimitUpperBound: z.number().describe(
        "The forecast limit upper bound that was used during ARIMA model training with limits.",
      ).optional(),
      hiddenUnits: z.array(z.string()).describe("Hidden units for dnn models.")
        .optional(),
      holidayRegion: z.enum([
        "HOLIDAY_REGION_UNSPECIFIED",
        "GLOBAL",
        "NA",
        "JAPAC",
        "EMEA",
        "LAC",
        "AE",
        "AR",
        "AT",
        "AU",
        "BE",
        "BR",
        "CA",
        "CH",
        "CL",
        "CN",
        "CO",
        "CS",
        "CZ",
        "DE",
        "DK",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ES",
        "FI",
        "FR",
        "GB",
        "GR",
        "HK",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IR",
        "IT",
        "JP",
        "KR",
        "LV",
        "MA",
        "MX",
        "MY",
        "NG",
        "NL",
        "NO",
        "NZ",
        "PE",
        "PH",
        "PK",
        "PL",
        "PT",
        "RO",
        "RS",
        "RU",
        "SA",
        "SE",
        "SG",
        "SI",
        "SK",
        "TH",
        "TR",
        "TW",
        "UA",
        "US",
        "VE",
        "VN",
        "ZA",
      ]).describe(
        "The geographical region based on which the holidays are considered in time series modeling. If a valid value is specified, then holiday effects modeling is enabled.",
      ).optional(),
      holidayRegions: z.array(
        z.enum([
          "HOLIDAY_REGION_UNSPECIFIED",
          "GLOBAL",
          "NA",
          "JAPAC",
          "EMEA",
          "LAC",
          "AE",
          "AR",
          "AT",
          "AU",
          "BE",
          "BR",
          "CA",
          "CH",
          "CL",
          "CN",
          "CO",
          "CS",
          "CZ",
          "DE",
          "DK",
          "DZ",
          "EC",
          "EE",
          "EG",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "HK",
          "HU",
          "ID",
          "IE",
          "IL",
          "IN",
          "IR",
          "IT",
          "JP",
          "KR",
          "LV",
          "MA",
          "MX",
          "MY",
          "NG",
          "NL",
          "NO",
          "NZ",
          "PE",
          "PH",
          "PK",
          "PL",
          "PT",
          "RO",
          "RS",
          "RU",
          "SA",
          "SE",
          "SG",
          "SI",
          "SK",
          "TH",
          "TR",
          "TW",
          "UA",
          "US",
          "VE",
          "VN",
          "ZA",
        ]),
      ).describe(
        "A list of geographical regions that are used for time series modeling.",
      ).optional(),
      horizon: z.string().describe(
        "The number of periods ahead that need to be forecasted.",
      ).optional(),
      hparamTuningObjectives: z.array(
        z.enum([
          "HPARAM_TUNING_OBJECTIVE_UNSPECIFIED",
          "MEAN_ABSOLUTE_ERROR",
          "MEAN_SQUARED_ERROR",
          "MEAN_SQUARED_LOG_ERROR",
          "MEDIAN_ABSOLUTE_ERROR",
          "R_SQUARED",
          "EXPLAINED_VARIANCE",
          "PRECISION",
          "RECALL",
          "ACCURACY",
          "F1_SCORE",
          "LOG_LOSS",
          "ROC_AUC",
          "DAVIES_BOULDIN_INDEX",
          "MEAN_AVERAGE_PRECISION",
          "NORMALIZED_DISCOUNTED_CUMULATIVE_GAIN",
          "AVERAGE_RANK",
        ]),
      ).describe(
        "The target evaluation metrics to optimize the hyperparameters for.",
      ).optional(),
      huggingFaceModelId: z.string().describe(
        "The id of a Hugging Face model. For example, `google/gemma-2-2b-it`.",
      ).optional(),
      includeDrift: z.boolean().describe(
        "Include drift when fitting an ARIMA model.",
      ).optional(),
      initialLearnRate: z.number().describe(
        "Specifies the initial learning rate for the line search learn rate strategy.",
      ).optional(),
      inputLabelColumns: z.array(z.string()).describe(
        "Name of input label columns in training data.",
      ).optional(),
      instanceWeightColumn: z.string().describe(
        "Name of the instance weight column for training data. This column isn't be used as a feature.",
      ).optional(),
      integratedGradientsNumSteps: z.string().describe(
        "Number of integral steps for the integrated gradients explain method.",
      ).optional(),
      isTestColumn: z.string().describe(
        "Name of the column used to determine the rows corresponding to control and test. Applies to contribution analysis models.",
      ).optional(),
      itemColumn: z.string().describe(
        "Item column specified for matrix factorization models.",
      ).optional(),
      kmeansInitializationColumn: z.string().describe(
        "The column used to provide the initial centroids for kmeans algorithm when kmeans_initialization_method is CUSTOM.",
      ).optional(),
      kmeansInitializationMethod: z.enum([
        "KMEANS_INITIALIZATION_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "KMEANS_PLUS_PLUS",
      ]).describe(
        "The method used to initialize the centroids for kmeans algorithm.",
      ).optional(),
      l1RegActivation: z.number().describe(
        "L1 regularization coefficient to activations.",
      ).optional(),
      l1Regularization: z.number().describe("L1 regularization coefficient.")
        .optional(),
      l2Regularization: z.number().describe("L2 regularization coefficient.")
        .optional(),
      labelClassWeights: z.record(z.string(), z.number()).describe(
        "Weights associated with each label class, for rebalancing the training data. Only applicable for classification models.",
      ).optional(),
      learnRate: z.number().describe(
        "Learning rate in training. Used only for iterative training algorithms.",
      ).optional(),
      learnRateStrategy: z.enum([
        "LEARN_RATE_STRATEGY_UNSPECIFIED",
        "LINE_SEARCH",
        "CONSTANT",
      ]).describe(
        "The strategy to determine learn rate for the current iteration.",
      ).optional(),
      lossType: z.enum([
        "LOSS_TYPE_UNSPECIFIED",
        "MEAN_SQUARED_LOSS",
        "MEAN_LOG_LOSS",
      ]).describe("Type of loss function used during training run.").optional(),
      machineType: z.string().describe(
        "The type of the machine used to deploy and serve the model.",
      ).optional(),
      maxIterations: z.string().describe(
        "The maximum number of iterations in training. Used only for iterative training algorithms.",
      ).optional(),
      maxParallelTrials: z.string().describe(
        "Maximum number of trials to run in parallel.",
      ).optional(),
      maxReplicaCount: z.string().describe(
        "The maximum number of machine replicas that will be deployed on an endpoint. The default value is equal to min_replica_count.",
      ).optional(),
      maxTimeSeriesLength: z.string().describe(
        "The maximum number of time points in a time series that can be used in modeling the trend component of the time series. Don't use this option with the `timeSeriesLengthFraction` or `minTimeSeriesLength` options.",
      ).optional(),
      maxTreeDepth: z.string().describe(
        "Maximum depth of a tree for boosted tree models.",
      ).optional(),
      minAprioriSupport: z.number().describe(
        "The apriori support minimum. Applies to contribution analysis models.",
      ).optional(),
      minRelativeProgress: z.number().describe(
        "When early_stop is true, stops training when accuracy improvement is less than 'min_relative_progress'. Used only for iterative training algorithms.",
      ).optional(),
      minReplicaCount: z.string().describe(
        "The minimum number of machine replicas that will be always deployed on an endpoint. This value must be greater than or equal to 1. The default value is 1.",
      ).optional(),
      minSplitLoss: z.number().describe(
        "Minimum split loss for boosted tree models.",
      ).optional(),
      minTimeSeriesLength: z.string().describe(
        "The minimum number of time points in a time series that are used in modeling the trend component of the time series. If you use this option you must also set the `timeSeriesLengthFraction` option. This training option ensures that enough time points are available when you use `timeSeriesLengthFraction` in trend modeling. This is particularly important when forecasting multiple time series in a single query using `timeSeriesIdColumn`. If the total number of time points is less than the `minTimeSeriesLength` value, then the query uses all available time points.",
      ).optional(),
      minTreeChildWeight: z.string().describe(
        "Minimum sum of instance weight needed in a child for boosted tree models.",
      ).optional(),
      modelGardenModelName: z.string().describe(
        "The name of a Vertex model garden publisher model. Format is `publishers/{publisher}/models/{model}@{optional_version_id}`.",
      ).optional(),
      modelRegistry: z.enum(["MODEL_REGISTRY_UNSPECIFIED", "VERTEX_AI"])
        .describe("The model registry.").optional(),
      modelUri: z.string().describe(
        "Google Cloud Storage URI from which the model was imported. Only applicable for imported models.",
      ).optional(),
      nonSeasonalOrder: z.object({
        d: z.string().describe("Order of the differencing part.").optional(),
        p: z.string().describe("Order of the autoregressive part.").optional(),
        q: z.string().describe("Order of the moving-average part.").optional(),
      }).describe(
        "A specification of the non-seasonal part of the ARIMA model: the three components (p, d, q) are the AR order, the degree of differencing, and the MA order.",
      ).optional(),
      numClusters: z.string().describe(
        "Number of clusters for clustering models.",
      ).optional(),
      numFactors: z.string().describe(
        "Num factors specified for matrix factorization models.",
      ).optional(),
      numParallelTree: z.string().describe(
        "Number of parallel trees constructed during each iteration for boosted tree models.",
      ).optional(),
      numPrincipalComponents: z.string().describe(
        "Number of principal components to keep in the PCA model. Must be <= the number of features.",
      ).optional(),
      numTrials: z.string().describe(
        "Number of trials to run this hyperparameter tuning job.",
      ).optional(),
      optimizationStrategy: z.enum([
        "OPTIMIZATION_STRATEGY_UNSPECIFIED",
        "BATCH_GRADIENT_DESCENT",
        "NORMAL_EQUATION",
      ]).describe(
        "Optimization strategy for training linear regression models.",
      ).optional(),
      optimizer: z.string().describe(
        "Optimizer used for training the neural nets.",
      ).optional(),
      pcaExplainedVarianceRatio: z.number().describe(
        "The minimum ratio of cumulative explained variance that needs to be given by the PCA model.",
      ).optional(),
      pcaSolver: z.enum(["UNSPECIFIED", "FULL", "RANDOMIZED", "AUTO"]).describe(
        "The solver for PCA.",
      ).optional(),
      reservationAffinityKey: z.string().describe(
        "Corresponds to the label key of a reservation resource used by Vertex AI. To target a SPECIFIC_RESERVATION by name, use `compute.googleapis.com/reservation-name` as the key and specify the name of your reservation as its value.",
      ).optional(),
      reservationAffinityType: z.enum([
        "RESERVATION_AFFINITY_TYPE_UNSPECIFIED",
        "NO_RESERVATION",
        "ANY_RESERVATION",
        "SPECIFIC_RESERVATION",
      ]).describe(
        "Specifies the reservation affinity type used to configure a Vertex AI resource. The default value is `NO_RESERVATION`.",
      ).optional(),
      reservationAffinityValues: z.array(z.string()).describe(
        "Corresponds to the label values of a reservation resource used by Vertex AI. This must be the full resource name of the reservation or reservation block.",
      ).optional(),
      sampledShapleyNumPaths: z.string().describe(
        "Number of paths for the sampled Shapley explain method.",
      ).optional(),
      scaleFeatures: z.boolean().describe(
        "If true, scale the feature values by dividing the feature standard deviation. Currently only apply to PCA.",
      ).optional(),
      standardizeFeatures: z.boolean().describe(
        "Whether to standardize numerical features. Default to true.",
      ).optional(),
      subsample: z.number().describe(
        "Subsample fraction of the training data to grow tree to prevent overfitting for boosted tree models.",
      ).optional(),
      tfVersion: z.string().describe(
        "Based on the selected TF version, the corresponding docker image is used to train external models.",
      ).optional(),
      timeSeriesDataColumn: z.string().describe(
        "Column to be designated as time series data for ARIMA model.",
      ).optional(),
      timeSeriesIdColumn: z.string().describe(
        "The time series id column that was used during ARIMA model training.",
      ).optional(),
      timeSeriesIdColumns: z.array(z.string()).describe(
        "The time series id columns that were used during ARIMA model training.",
      ).optional(),
      timeSeriesLengthFraction: z.number().describe(
        "The fraction of the interpolated length of the time series that's used to model the time series trend component. All of the time points of the time series are used to model the non-trend component. This training option accelerates modeling training without sacrificing much forecasting accuracy. You can use this option with `minTimeSeriesLength` but not with `maxTimeSeriesLength`.",
      ).optional(),
      timeSeriesTimestampColumn: z.string().describe(
        "Column to be designated as time series timestamp for ARIMA model.",
      ).optional(),
      treeMethod: z.enum([
        "TREE_METHOD_UNSPECIFIED",
        "AUTO",
        "EXACT",
        "APPROX",
        "HIST",
      ]).describe("Tree construction algorithm for boosted tree models.")
        .optional(),
      trendSmoothingWindowSize: z.string().describe(
        "Smoothing window size for the trend component. When a positive value is specified, a center moving average smoothing is applied on the history trend. When the smoothing window is out of the boundary at the beginning or the end of the trend, the first element or the last element is padded to fill the smoothing window before the average is applied.",
      ).optional(),
      userColumn: z.string().describe(
        "User column specified for matrix factorization models.",
      ).optional(),
      vertexAiModelVersionAliases: z.array(z.string()).describe(
        "The version aliases to apply in Vertex AI model registry. Always overwrite if the version aliases exists in a existing model.",
      ).optional(),
      walsAlpha: z.number().describe(
        "Hyperparameter for matrix factoration when implicit feedback type is specified.",
      ).optional(),
      warmStart: z.boolean().describe(
        "Whether to train a model from the last checkpoint.",
      ).optional(),
      xgboostVersion: z.string().describe(
        "User-selected XGBoost versions for training of XGBoost models.",
      ).optional(),
    }).describe("The hyperprameters selected for this trial.").optional(),
    startTimeMs: z.string().describe("Starting time of the trial.").optional(),
    status: z.enum([
      "TRIAL_STATUS_UNSPECIFIED",
      "NOT_STARTED",
      "RUNNING",
      "SUCCEEDED",
      "FAILED",
      "INFEASIBLE",
      "STOPPED_EARLY",
    ]).describe("The status of the trial.").optional(),
    trainingLoss: z.number().describe(
      "Loss computed on the training data at the end of trial.",
    ).optional(),
    trialId: z.string().describe("1-based index of the trial.").optional(),
  })).describe(
    "Output only. Trials of a [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) model sorted by trial_id.",
  ).optional(),
  labelColumns: z.array(z.object({
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
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe(
      'Optional. The type of this parameter. Absent if not explicitly specified (e.g., CREATE FUNCTION statement can omit the return type; in this case the output parameter does not have this "type" field).',
    ).optional(),
  })).describe(
    'Output only. Label columns that were used to train this model. The output of the model will have a "predicted_" prefix to these columns.',
  ).optional(),
  labels: z.record(z.string(), z.string()).describe(
    "The labels associated with this model. You can use these to organize and group your models. Label keys and values can be no longer than 63 characters, can only contain lowercase letters, numeric characters, underscores and dashes. International characters are allowed. Label values are optional. Label keys must start with a letter and each label in the list must have a different key.",
  ).optional(),
  lastModifiedTime: z.string().describe(
    "Output only. The time when this model was last modified, in millisecs since the epoch.",
  ).optional(),
  location: z.string().describe(
    "Output only. The geographic location where the model resides. This value is inherited from the dataset.",
  ).optional(),
  modelReference: z.object({
    datasetId: z.string().describe(
      "Required. The ID of the dataset containing this model.",
    ).optional(),
    modelId: z.string().describe(
      "Required. The ID of the model. The ID must contain only letters (a-z, A-Z), numbers (0-9), or underscores (_). The maximum length is 1,024 characters.",
    ).optional(),
    projectId: z.string().describe(
      "Required. The ID of the project containing this model.",
    ).optional(),
  }).describe("Required. Unique identifier for this model.").optional(),
  modelType: z.enum([
    "MODEL_TYPE_UNSPECIFIED",
    "LINEAR_REGRESSION",
    "LOGISTIC_REGRESSION",
    "KMEANS",
    "MATRIX_FACTORIZATION",
    "DNN_CLASSIFIER",
    "TENSORFLOW",
    "DNN_REGRESSOR",
    "XGBOOST",
    "BOOSTED_TREE_REGRESSOR",
    "BOOSTED_TREE_CLASSIFIER",
    "ARIMA",
    "AUTOML_REGRESSOR",
    "AUTOML_CLASSIFIER",
    "PCA",
    "DNN_LINEAR_COMBINED_CLASSIFIER",
    "DNN_LINEAR_COMBINED_REGRESSOR",
    "AUTOENCODER",
    "ARIMA_PLUS",
    "ARIMA_PLUS_XREG",
    "RANDOM_FOREST_REGRESSOR",
    "RANDOM_FOREST_CLASSIFIER",
    "TENSORFLOW_LITE",
    "ONNX",
    "TRANSFORM_ONLY",
    "CONTRIBUTION_ANALYSIS",
  ]).describe("Output only. Type of the model resource.").optional(),
  optimalTrialIds: z.array(z.string()).describe(
    "Output only. For single-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, it only contains the best trial. For multi-objective [hyperparameter tuning](https://cloud.google.com/bigquery-ml/docs/reference/standard-sql/bigqueryml-syntax-hp-tuning-overview) models, it contains all Pareto optimal trials sorted by trial_id.",
  ).optional(),
  remoteModelInfo: z.object({
    connection: z.string().describe(
      'Output only. Fully qualified name of the user-provided connection object of the remote model. Format: ` "projects/{project_id}/locations/{location_id}/connections/{connection_id}" `',
    ).optional(),
    endpoint: z.string().describe("Output only. The endpoint for remote model.")
      .optional(),
    maxBatchingRows: z.string().describe(
      "Output only. Max number of rows in each batch sent to the remote service. If unset, the number of rows in each batch is set dynamically.",
    ).optional(),
    remoteModelVersion: z.string().describe(
      "Output only. The model version for LLM.",
    ).optional(),
    remoteServiceType: z.enum([
      "REMOTE_SERVICE_TYPE_UNSPECIFIED",
      "CLOUD_AI_TRANSLATE_V3",
      "CLOUD_AI_VISION_V1",
      "CLOUD_AI_NATURAL_LANGUAGE_V1",
      "CLOUD_AI_SPEECH_TO_TEXT_V2",
    ]).describe("Output only. The remote service type for remote model.")
      .optional(),
    speechRecognizer: z.string().describe(
      "Output only. The name of the speech recognizer to use for speech recognition. The expected format is `projects/{project}/locations/{location}/recognizers/{recognizer}`. Customers can specify this field at model creation. If not specified, a default recognizer `projects/{model project}/locations/global/recognizers/_` will be used. See more details at [recognizers](https://cloud.google.com/speech-to-text/v2/docs/reference/rest/v2/projects.locations.recognizers)",
    ).optional(),
  }).describe("Output only. Remote model info").optional(),
  trainingRuns: z.array(z.object({
    classLevelGlobalExplanations: z.array(z.object({
      classLabel: z.string().describe(
        "Class label for this set of global explanations. Will be empty/null for binary logistic and linear regression models. Sorted alphabetically in descending order.",
      ).optional(),
      explanations: z.array(z.unknown()).describe(
        "A list of the top global explanations. Sorted by absolute value of attribution in descending order.",
      ).optional(),
    })).describe(
      "Output only. Global explanation contains the explanation of top features on the class level. Applies to classification models only.",
    ).optional(),
    dataSplitResult: z.object({
      evaluationTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("Table reference of the evaluation data after split.")
        .optional(),
      testTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("Table reference of the test data after split.").optional(),
      trainingTable: z.object({
        datasetId: z.string().describe(
          "Required. The ID of the dataset containing this table.",
        ).optional(),
        projectId: z.string().describe(
          "Required. The ID of the project containing this table.",
        ).optional(),
        tableId: z.string().describe(
          "Required. The ID of the table. The ID can contain Unicode characters in category L (letter), M (mark), N (number), Pc (connector, including underscore), Pd (dash), and Zs (space). For more information, see [General Category](https://wikipedia.org/wiki/Unicode_character_property#General_Category). The maximum length is 1,024 characters. Certain operations allow suffixing of the table ID with a partition decorator, such as `sample_table$20190123`.",
        ).optional(),
      }).describe("Table reference of the training data after split.")
        .optional(),
    }).describe(
      "Output only. Data split result of the training run. Only set when the input data is actually split.",
    ).optional(),
    evaluationMetrics: z.object({
      arimaForecastingMetrics: z.object({
        arimaFittingMetrics: z.array(z.unknown()).describe(
          "Arima model fitting metrics.",
        ).optional(),
        arimaSingleModelForecastingMetrics: z.array(z.unknown()).describe(
          "Repeated as there can be many metric sets (one for each model) in auto-arima and the large-scale case.",
        ).optional(),
        hasDrift: z.array(z.unknown()).describe(
          "Whether Arima model fitted with drift or not. It is always false when d is not 1.",
        ).optional(),
        nonSeasonalOrder: z.array(z.unknown()).describe("Non-seasonal order.")
          .optional(),
        seasonalPeriods: z.array(z.unknown()).describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
        timeSeriesId: z.array(z.unknown()).describe(
          "Id to differentiate different time series for the large-scale case.",
        ).optional(),
      }).describe("Populated for ARIMA models.").optional(),
      binaryClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        binaryConfusionMatrixList: z.array(z.unknown()).describe(
          "Binary confusion matrix at multiple thresholds.",
        ).optional(),
        negativeLabel: z.string().describe(
          "Label representing the negative class.",
        ).optional(),
        positiveLabel: z.string().describe(
          "Label representing the positive class.",
        ).optional(),
      }).describe("Populated for binary classification/classifier models.")
        .optional(),
      clusteringMetrics: z.object({
        clusters: z.array(z.unknown()).describe("Information for all clusters.")
          .optional(),
        daviesBouldinIndex: z.number().describe("Davies-Bouldin index.")
          .optional(),
        meanSquaredDistance: z.number().describe(
          "Mean of squared distances between each sample to its cluster centroid.",
        ).optional(),
      }).describe("Populated for clustering models.").optional(),
      dimensionalityReductionMetrics: z.object({
        totalExplainedVarianceRatio: z.number().describe(
          "Total percentage of variance explained by the selected principal components.",
        ).optional(),
      }).describe(
        "Evaluation metrics when the model is a dimensionality reduction model, which currently includes PCA.",
      ).optional(),
      multiClassClassificationMetrics: z.object({
        aggregateClassificationMetrics: z.object({
          accuracy: z.unknown().describe(
            "Accuracy is the fraction of predictions given the correct label. For multiclass this is a micro-averaged metric.",
          ).optional(),
          f1Score: z.unknown().describe(
            "The F1 score is an average of recall and precision. For multiclass this is a macro-averaged metric.",
          ).optional(),
          logLoss: z.unknown().describe(
            "Logarithmic Loss. For multiclass this is a macro-averaged metric.",
          ).optional(),
          precision: z.unknown().describe(
            "Precision is the fraction of actual positive predictions that had positive actual labels. For multiclass this is a macro-averaged metric treating each class as a binary classifier.",
          ).optional(),
          recall: z.unknown().describe(
            "Recall is the fraction of actual positive labels that were given a positive prediction. For multiclass this is a macro-averaged metric.",
          ).optional(),
          rocAuc: z.unknown().describe(
            "Area Under a ROC Curve. For multiclass this is a macro-averaged metric.",
          ).optional(),
          threshold: z.unknown().describe(
            "Threshold at which the metrics are computed. For binary classification models this is the positive class threshold. For multi-class classification models this is the confidence threshold.",
          ).optional(),
        }).describe("Aggregate classification metrics.").optional(),
        confusionMatrixList: z.array(z.unknown()).describe(
          "Confusion matrix at different thresholds.",
        ).optional(),
      }).describe("Populated for multi-class classification/classifier models.")
        .optional(),
      rankingMetrics: z.object({
        averageRank: z.number().describe(
          "Determines the goodness of a ranking by computing the percentile rank from the predicted confidence and dividing it by the original rank.",
        ).optional(),
        meanAveragePrecision: z.number().describe(
          "Calculates a precision per user for all the items by ranking them and then averages all the precisions across all the users.",
        ).optional(),
        meanSquaredError: z.number().describe(
          "Similar to the mean squared error computed in regression and explicit recommendation models except instead of computing the rating directly, the output from evaluate is computed against a preference which is 1 or 0 depending on if the rating exists or not.",
        ).optional(),
        normalizedDiscountedCumulativeGain: z.number().describe(
          "A metric to determine the goodness of a ranking calculated from the predicted confidence by comparing it to an ideal rank measured by the original ratings.",
        ).optional(),
      }).describe(
        "Populated for implicit feedback type matrix factorization models.",
      ).optional(),
      regressionMetrics: z.object({
        meanAbsoluteError: z.number().describe("Mean absolute error.")
          .optional(),
        meanSquaredError: z.number().describe("Mean squared error.").optional(),
        meanSquaredLogError: z.number().describe("Mean squared log error.")
          .optional(),
        medianAbsoluteError: z.number().describe("Median absolute error.")
          .optional(),
        rSquared: z.number().describe(
          "R^2 score. This corresponds to r2_score in ML.EVALUATE.",
        ).optional(),
      }).describe(
        "Populated for regression models and explicit feedback type matrix factorization models.",
      ).optional(),
    }).describe(
      "Output only. The evaluation metrics over training/eval data that were computed at the end of training.",
    ).optional(),
    modelLevelGlobalExplanation: z.object({
      classLabel: z.string().describe(
        "Class label for this set of global explanations. Will be empty/null for binary logistic and linear regression models. Sorted alphabetically in descending order.",
      ).optional(),
      explanations: z.array(z.object({
        attribution: z.unknown().describe("Attribution of feature.").optional(),
        featureName: z.unknown().describe(
          "The full feature name. For non-numerical features, will be formatted like `.`. Overall size of feature name will always be truncated to first 120 characters.",
        ).optional(),
      })).describe(
        "A list of the top global explanations. Sorted by absolute value of attribution in descending order.",
      ).optional(),
    }).describe(
      "Output only. Global explanation contains the explanation of top features on the model level. Applies to both regression and classification models.",
    ).optional(),
    results: z.array(z.object({
      arimaResult: z.object({
        arimaModelInfo: z.unknown().describe(
          "This message is repeated because there are multiple arima models fitted in auto-arima. For non-auto-arima model, its size is one.",
        ).optional(),
        seasonalPeriods: z.unknown().describe(
          "Seasonal periods. Repeated because multiple periods are supported for one time series.",
        ).optional(),
      }).describe("Arima result.").optional(),
      clusterInfos: z.array(z.unknown()).describe(
        "Information about top clusters for clustering models.",
      ).optional(),
      durationMs: z.string().describe(
        "Time taken to run the iteration in milliseconds.",
      ).optional(),
      evalLoss: z.number().describe(
        "Loss computed on the eval data at the end of iteration.",
      ).optional(),
      index: z.number().int().describe("Index of the iteration, 0 based.")
        .optional(),
      learnRate: z.number().describe("Learn rate used for this iteration.")
        .optional(),
      principalComponentInfos: z.array(z.unknown()).describe(
        "The information of the principal components.",
      ).optional(),
      trainingLoss: z.number().describe(
        "Loss computed on the training data at the end of iteration.",
      ).optional(),
    })).describe(
      "Output only. Output of each iteration run, results.size() <= max_iterations.",
    ).optional(),
    startTime: z.string().describe(
      "Output only. The start time of this training run.",
    ).optional(),
    trainingOptions: z.object({
      activationFn: z.string().describe(
        "Activation function of the neural nets.",
      ).optional(),
      adjustStepChanges: z.boolean().describe(
        "If true, detect step changes and make data adjustment in the input time series.",
      ).optional(),
      approxGlobalFeatureContrib: z.boolean().describe(
        "Whether to use approximate feature contribution method in XGBoost model explanation for global explain.",
      ).optional(),
      autoArima: z.boolean().describe("Whether to enable auto ARIMA or not.")
        .optional(),
      autoArimaMaxOrder: z.string().describe(
        "The max value of the sum of non-seasonal p and q.",
      ).optional(),
      autoArimaMinOrder: z.string().describe(
        "The min value of the sum of non-seasonal p and q.",
      ).optional(),
      autoClassWeights: z.boolean().describe(
        "Whether to calculate class weights automatically based on the popularity of each label.",
      ).optional(),
      batchSize: z.string().describe("Batch size for dnn models.").optional(),
      boosterType: z.enum(["BOOSTER_TYPE_UNSPECIFIED", "GBTREE", "DART"])
        .describe("Booster type for boosted tree models.").optional(),
      budgetHours: z.number().describe("Budget in hours for AutoML training.")
        .optional(),
      calculatePValues: z.boolean().describe(
        "Whether or not p-value test should be computed for this model. Only available for linear and logistic regression models.",
      ).optional(),
      categoryEncodingMethod: z.enum([
        "ENCODING_METHOD_UNSPECIFIED",
        "ONE_HOT_ENCODING",
        "LABEL_ENCODING",
        "DUMMY_ENCODING",
      ]).describe("Categorical feature encoding method.").optional(),
      cleanSpikesAndDips: z.boolean().describe(
        "If true, clean spikes and dips in the input time series.",
      ).optional(),
      colorSpace: z.enum([
        "COLOR_SPACE_UNSPECIFIED",
        "RGB",
        "HSV",
        "YIQ",
        "YUV",
        "GRAYSCALE",
      ]).describe(
        "Enums for color space, used for processing images in Object Table. See more details at https://www.tensorflow.org/io/tutorials/colorspace.",
      ).optional(),
      colsampleBylevel: z.number().describe(
        "Subsample ratio of columns for each level for boosted tree models.",
      ).optional(),
      colsampleBynode: z.number().describe(
        "Subsample ratio of columns for each node(split) for boosted tree models.",
      ).optional(),
      colsampleBytree: z.number().describe(
        "Subsample ratio of columns when constructing each tree for boosted tree models.",
      ).optional(),
      contributionMetric: z.string().describe(
        "The contribution metric. Applies to contribution analysis models. Allowed formats supported are for summable and summable ratio contribution metrics. These include expressions such as `SUM(x)` or `SUM(x)/SUM(y)`, where x and y are column names from the base table.",
      ).optional(),
      dartNormalizeType: z.enum([
        "DART_NORMALIZE_TYPE_UNSPECIFIED",
        "TREE",
        "FOREST",
      ]).describe(
        "Type of normalization algorithm for boosted tree models using dart booster.",
      ).optional(),
      dataFrequency: z.enum([
        "DATA_FREQUENCY_UNSPECIFIED",
        "AUTO_FREQUENCY",
        "YEARLY",
        "QUARTERLY",
        "MONTHLY",
        "WEEKLY",
        "DAILY",
        "HOURLY",
        "PER_MINUTE",
      ]).describe("The data frequency of a time series.").optional(),
      dataSplitColumn: z.string().describe(
        "The column to split data with. This column won't be used as a feature. 1. When data_split_method is CUSTOM, the corresponding column should be boolean. The rows with true value tag are eval data, and the false are training data. 2. When data_split_method is SEQ, the first DATA_SPLIT_EVAL_FRACTION rows (from smallest to largest) in the corresponding column are used as training data, and the rest are eval data. It respects the order in Orderable data types: https://cloud.google.com/bigquery/docs/reference/standard-sql/data-types#data_type_properties",
      ).optional(),
      dataSplitEvalFraction: z.number().describe(
        "The fraction of evaluation data over the whole input data. The rest of data will be used as training data. The format should be double. Accurate to two decimal places. Default value is 0.2.",
      ).optional(),
      dataSplitMethod: z.enum([
        "DATA_SPLIT_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "SEQUENTIAL",
        "NO_SPLIT",
        "AUTO_SPLIT",
      ]).describe(
        "The data split type for training and evaluation, e.g. RANDOM.",
      ).optional(),
      decomposeTimeSeries: z.boolean().describe(
        "If true, perform decompose time series and save the results.",
      ).optional(),
      dimensionIdColumns: z.array(z.string()).describe(
        "Optional. Names of the columns to slice on. Applies to contribution analysis models.",
      ).optional(),
      distanceType: z.enum(["DISTANCE_TYPE_UNSPECIFIED", "EUCLIDEAN", "COSINE"])
        .describe("Distance type for clustering models.").optional(),
      dropout: z.number().describe("Dropout probability for dnn models.")
        .optional(),
      earlyStop: z.boolean().describe(
        "Whether to stop early when the loss doesn't improve significantly any more (compared to min_relative_progress). Used only for iterative training algorithms.",
      ).optional(),
      enableGlobalExplain: z.boolean().describe(
        "If true, enable global explanation during training.",
      ).optional(),
      endpointIdleTtl: z.string().describe(
        "The idle TTL of the endpoint before the resources get destroyed. The default value is 6.5 hours.",
      ).optional(),
      feedbackType: z.enum([
        "FEEDBACK_TYPE_UNSPECIFIED",
        "IMPLICIT",
        "EXPLICIT",
      ]).describe(
        "Feedback type that specifies which algorithm to run for matrix factorization.",
      ).optional(),
      fitIntercept: z.boolean().describe(
        "Whether the model should include intercept during model training.",
      ).optional(),
      forecastLimitLowerBound: z.number().describe(
        "The forecast limit lower bound that was used during ARIMA model training with limits. To see more details of the algorithm: https://otexts.com/fpp2/limits.html",
      ).optional(),
      forecastLimitUpperBound: z.number().describe(
        "The forecast limit upper bound that was used during ARIMA model training with limits.",
      ).optional(),
      hiddenUnits: z.array(z.string()).describe("Hidden units for dnn models.")
        .optional(),
      holidayRegion: z.enum([
        "HOLIDAY_REGION_UNSPECIFIED",
        "GLOBAL",
        "NA",
        "JAPAC",
        "EMEA",
        "LAC",
        "AE",
        "AR",
        "AT",
        "AU",
        "BE",
        "BR",
        "CA",
        "CH",
        "CL",
        "CN",
        "CO",
        "CS",
        "CZ",
        "DE",
        "DK",
        "DZ",
        "EC",
        "EE",
        "EG",
        "ES",
        "FI",
        "FR",
        "GB",
        "GR",
        "HK",
        "HU",
        "ID",
        "IE",
        "IL",
        "IN",
        "IR",
        "IT",
        "JP",
        "KR",
        "LV",
        "MA",
        "MX",
        "MY",
        "NG",
        "NL",
        "NO",
        "NZ",
        "PE",
        "PH",
        "PK",
        "PL",
        "PT",
        "RO",
        "RS",
        "RU",
        "SA",
        "SE",
        "SG",
        "SI",
        "SK",
        "TH",
        "TR",
        "TW",
        "UA",
        "US",
        "VE",
        "VN",
        "ZA",
      ]).describe(
        "The geographical region based on which the holidays are considered in time series modeling. If a valid value is specified, then holiday effects modeling is enabled.",
      ).optional(),
      holidayRegions: z.array(
        z.enum([
          "HOLIDAY_REGION_UNSPECIFIED",
          "GLOBAL",
          "NA",
          "JAPAC",
          "EMEA",
          "LAC",
          "AE",
          "AR",
          "AT",
          "AU",
          "BE",
          "BR",
          "CA",
          "CH",
          "CL",
          "CN",
          "CO",
          "CS",
          "CZ",
          "DE",
          "DK",
          "DZ",
          "EC",
          "EE",
          "EG",
          "ES",
          "FI",
          "FR",
          "GB",
          "GR",
          "HK",
          "HU",
          "ID",
          "IE",
          "IL",
          "IN",
          "IR",
          "IT",
          "JP",
          "KR",
          "LV",
          "MA",
          "MX",
          "MY",
          "NG",
          "NL",
          "NO",
          "NZ",
          "PE",
          "PH",
          "PK",
          "PL",
          "PT",
          "RO",
          "RS",
          "RU",
          "SA",
          "SE",
          "SG",
          "SI",
          "SK",
          "TH",
          "TR",
          "TW",
          "UA",
          "US",
          "VE",
          "VN",
          "ZA",
        ]),
      ).describe(
        "A list of geographical regions that are used for time series modeling.",
      ).optional(),
      horizon: z.string().describe(
        "The number of periods ahead that need to be forecasted.",
      ).optional(),
      hparamTuningObjectives: z.array(
        z.enum([
          "HPARAM_TUNING_OBJECTIVE_UNSPECIFIED",
          "MEAN_ABSOLUTE_ERROR",
          "MEAN_SQUARED_ERROR",
          "MEAN_SQUARED_LOG_ERROR",
          "MEDIAN_ABSOLUTE_ERROR",
          "R_SQUARED",
          "EXPLAINED_VARIANCE",
          "PRECISION",
          "RECALL",
          "ACCURACY",
          "F1_SCORE",
          "LOG_LOSS",
          "ROC_AUC",
          "DAVIES_BOULDIN_INDEX",
          "MEAN_AVERAGE_PRECISION",
          "NORMALIZED_DISCOUNTED_CUMULATIVE_GAIN",
          "AVERAGE_RANK",
        ]),
      ).describe(
        "The target evaluation metrics to optimize the hyperparameters for.",
      ).optional(),
      huggingFaceModelId: z.string().describe(
        "The id of a Hugging Face model. For example, `google/gemma-2-2b-it`.",
      ).optional(),
      includeDrift: z.boolean().describe(
        "Include drift when fitting an ARIMA model.",
      ).optional(),
      initialLearnRate: z.number().describe(
        "Specifies the initial learning rate for the line search learn rate strategy.",
      ).optional(),
      inputLabelColumns: z.array(z.string()).describe(
        "Name of input label columns in training data.",
      ).optional(),
      instanceWeightColumn: z.string().describe(
        "Name of the instance weight column for training data. This column isn't be used as a feature.",
      ).optional(),
      integratedGradientsNumSteps: z.string().describe(
        "Number of integral steps for the integrated gradients explain method.",
      ).optional(),
      isTestColumn: z.string().describe(
        "Name of the column used to determine the rows corresponding to control and test. Applies to contribution analysis models.",
      ).optional(),
      itemColumn: z.string().describe(
        "Item column specified for matrix factorization models.",
      ).optional(),
      kmeansInitializationColumn: z.string().describe(
        "The column used to provide the initial centroids for kmeans algorithm when kmeans_initialization_method is CUSTOM.",
      ).optional(),
      kmeansInitializationMethod: z.enum([
        "KMEANS_INITIALIZATION_METHOD_UNSPECIFIED",
        "RANDOM",
        "CUSTOM",
        "KMEANS_PLUS_PLUS",
      ]).describe(
        "The method used to initialize the centroids for kmeans algorithm.",
      ).optional(),
      l1RegActivation: z.number().describe(
        "L1 regularization coefficient to activations.",
      ).optional(),
      l1Regularization: z.number().describe("L1 regularization coefficient.")
        .optional(),
      l2Regularization: z.number().describe("L2 regularization coefficient.")
        .optional(),
      labelClassWeights: z.record(z.string(), z.number()).describe(
        "Weights associated with each label class, for rebalancing the training data. Only applicable for classification models.",
      ).optional(),
      learnRate: z.number().describe(
        "Learning rate in training. Used only for iterative training algorithms.",
      ).optional(),
      learnRateStrategy: z.enum([
        "LEARN_RATE_STRATEGY_UNSPECIFIED",
        "LINE_SEARCH",
        "CONSTANT",
      ]).describe(
        "The strategy to determine learn rate for the current iteration.",
      ).optional(),
      lossType: z.enum([
        "LOSS_TYPE_UNSPECIFIED",
        "MEAN_SQUARED_LOSS",
        "MEAN_LOG_LOSS",
      ]).describe("Type of loss function used during training run.").optional(),
      machineType: z.string().describe(
        "The type of the machine used to deploy and serve the model.",
      ).optional(),
      maxIterations: z.string().describe(
        "The maximum number of iterations in training. Used only for iterative training algorithms.",
      ).optional(),
      maxParallelTrials: z.string().describe(
        "Maximum number of trials to run in parallel.",
      ).optional(),
      maxReplicaCount: z.string().describe(
        "The maximum number of machine replicas that will be deployed on an endpoint. The default value is equal to min_replica_count.",
      ).optional(),
      maxTimeSeriesLength: z.string().describe(
        "The maximum number of time points in a time series that can be used in modeling the trend component of the time series. Don't use this option with the `timeSeriesLengthFraction` or `minTimeSeriesLength` options.",
      ).optional(),
      maxTreeDepth: z.string().describe(
        "Maximum depth of a tree for boosted tree models.",
      ).optional(),
      minAprioriSupport: z.number().describe(
        "The apriori support minimum. Applies to contribution analysis models.",
      ).optional(),
      minRelativeProgress: z.number().describe(
        "When early_stop is true, stops training when accuracy improvement is less than 'min_relative_progress'. Used only for iterative training algorithms.",
      ).optional(),
      minReplicaCount: z.string().describe(
        "The minimum number of machine replicas that will be always deployed on an endpoint. This value must be greater than or equal to 1. The default value is 1.",
      ).optional(),
      minSplitLoss: z.number().describe(
        "Minimum split loss for boosted tree models.",
      ).optional(),
      minTimeSeriesLength: z.string().describe(
        "The minimum number of time points in a time series that are used in modeling the trend component of the time series. If you use this option you must also set the `timeSeriesLengthFraction` option. This training option ensures that enough time points are available when you use `timeSeriesLengthFraction` in trend modeling. This is particularly important when forecasting multiple time series in a single query using `timeSeriesIdColumn`. If the total number of time points is less than the `minTimeSeriesLength` value, then the query uses all available time points.",
      ).optional(),
      minTreeChildWeight: z.string().describe(
        "Minimum sum of instance weight needed in a child for boosted tree models.",
      ).optional(),
      modelGardenModelName: z.string().describe(
        "The name of a Vertex model garden publisher model. Format is `publishers/{publisher}/models/{model}@{optional_version_id}`.",
      ).optional(),
      modelRegistry: z.enum(["MODEL_REGISTRY_UNSPECIFIED", "VERTEX_AI"])
        .describe("The model registry.").optional(),
      modelUri: z.string().describe(
        "Google Cloud Storage URI from which the model was imported. Only applicable for imported models.",
      ).optional(),
      nonSeasonalOrder: z.object({
        d: z.string().describe("Order of the differencing part.").optional(),
        p: z.string().describe("Order of the autoregressive part.").optional(),
        q: z.string().describe("Order of the moving-average part.").optional(),
      }).describe(
        "A specification of the non-seasonal part of the ARIMA model: the three components (p, d, q) are the AR order, the degree of differencing, and the MA order.",
      ).optional(),
      numClusters: z.string().describe(
        "Number of clusters for clustering models.",
      ).optional(),
      numFactors: z.string().describe(
        "Num factors specified for matrix factorization models.",
      ).optional(),
      numParallelTree: z.string().describe(
        "Number of parallel trees constructed during each iteration for boosted tree models.",
      ).optional(),
      numPrincipalComponents: z.string().describe(
        "Number of principal components to keep in the PCA model. Must be <= the number of features.",
      ).optional(),
      numTrials: z.string().describe(
        "Number of trials to run this hyperparameter tuning job.",
      ).optional(),
      optimizationStrategy: z.enum([
        "OPTIMIZATION_STRATEGY_UNSPECIFIED",
        "BATCH_GRADIENT_DESCENT",
        "NORMAL_EQUATION",
      ]).describe(
        "Optimization strategy for training linear regression models.",
      ).optional(),
      optimizer: z.string().describe(
        "Optimizer used for training the neural nets.",
      ).optional(),
      pcaExplainedVarianceRatio: z.number().describe(
        "The minimum ratio of cumulative explained variance that needs to be given by the PCA model.",
      ).optional(),
      pcaSolver: z.enum(["UNSPECIFIED", "FULL", "RANDOMIZED", "AUTO"]).describe(
        "The solver for PCA.",
      ).optional(),
      reservationAffinityKey: z.string().describe(
        "Corresponds to the label key of a reservation resource used by Vertex AI. To target a SPECIFIC_RESERVATION by name, use `compute.googleapis.com/reservation-name` as the key and specify the name of your reservation as its value.",
      ).optional(),
      reservationAffinityType: z.enum([
        "RESERVATION_AFFINITY_TYPE_UNSPECIFIED",
        "NO_RESERVATION",
        "ANY_RESERVATION",
        "SPECIFIC_RESERVATION",
      ]).describe(
        "Specifies the reservation affinity type used to configure a Vertex AI resource. The default value is `NO_RESERVATION`.",
      ).optional(),
      reservationAffinityValues: z.array(z.string()).describe(
        "Corresponds to the label values of a reservation resource used by Vertex AI. This must be the full resource name of the reservation or reservation block.",
      ).optional(),
      sampledShapleyNumPaths: z.string().describe(
        "Number of paths for the sampled Shapley explain method.",
      ).optional(),
      scaleFeatures: z.boolean().describe(
        "If true, scale the feature values by dividing the feature standard deviation. Currently only apply to PCA.",
      ).optional(),
      standardizeFeatures: z.boolean().describe(
        "Whether to standardize numerical features. Default to true.",
      ).optional(),
      subsample: z.number().describe(
        "Subsample fraction of the training data to grow tree to prevent overfitting for boosted tree models.",
      ).optional(),
      tfVersion: z.string().describe(
        "Based on the selected TF version, the corresponding docker image is used to train external models.",
      ).optional(),
      timeSeriesDataColumn: z.string().describe(
        "Column to be designated as time series data for ARIMA model.",
      ).optional(),
      timeSeriesIdColumn: z.string().describe(
        "The time series id column that was used during ARIMA model training.",
      ).optional(),
      timeSeriesIdColumns: z.array(z.string()).describe(
        "The time series id columns that were used during ARIMA model training.",
      ).optional(),
      timeSeriesLengthFraction: z.number().describe(
        "The fraction of the interpolated length of the time series that's used to model the time series trend component. All of the time points of the time series are used to model the non-trend component. This training option accelerates modeling training without sacrificing much forecasting accuracy. You can use this option with `minTimeSeriesLength` but not with `maxTimeSeriesLength`.",
      ).optional(),
      timeSeriesTimestampColumn: z.string().describe(
        "Column to be designated as time series timestamp for ARIMA model.",
      ).optional(),
      treeMethod: z.enum([
        "TREE_METHOD_UNSPECIFIED",
        "AUTO",
        "EXACT",
        "APPROX",
        "HIST",
      ]).describe("Tree construction algorithm for boosted tree models.")
        .optional(),
      trendSmoothingWindowSize: z.string().describe(
        "Smoothing window size for the trend component. When a positive value is specified, a center moving average smoothing is applied on the history trend. When the smoothing window is out of the boundary at the beginning or the end of the trend, the first element or the last element is padded to fill the smoothing window before the average is applied.",
      ).optional(),
      userColumn: z.string().describe(
        "User column specified for matrix factorization models.",
      ).optional(),
      vertexAiModelVersionAliases: z.array(z.string()).describe(
        "The version aliases to apply in Vertex AI model registry. Always overwrite if the version aliases exists in a existing model.",
      ).optional(),
      walsAlpha: z.number().describe(
        "Hyperparameter for matrix factoration when implicit feedback type is specified.",
      ).optional(),
      warmStart: z.boolean().describe(
        "Whether to train a model from the last checkpoint.",
      ).optional(),
      xgboostVersion: z.string().describe(
        "User-selected XGBoost versions for training of XGBoost models.",
      ).optional(),
    }).describe(
      "Output only. Options that were used for this training run, includes user specified and default options that were used.",
    ).optional(),
    trainingStartTime: z.string().describe(
      "Output only. The start time of this training run, in milliseconds since epoch.",
    ).optional(),
    vertexAiModelId: z.string().describe(
      "The model id in the [Vertex AI Model Registry](https://cloud.google.com/vertex-ai/docs/model-registry/introduction) for this training run.",
    ).optional(),
    vertexAiModelVersion: z.string().describe(
      "Output only. The model version in the [Vertex AI Model Registry](https://cloud.google.com/vertex-ai/docs/model-registry/introduction) for this training run.",
    ).optional(),
  })).describe(
    "Information for all training runs in increasing order of start_time.",
  ).optional(),
  transformColumns: z.array(z.object({
    name: z.string().describe("Output only. Name of the column.").optional(),
    transformSql: z.string().describe(
      "Output only. The SQL expression used in the column transform.",
    ).optional(),
    type: z.object({
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
      ]).describe(
        'Required. The top level type of this field. Can be any GoogleSQL data type (e.g., "INT64", "DATE", "ARRAY").',
      ).optional(),
    }).describe("Output only. Data type of the column after the transform.")
      .optional(),
  })).describe(
    "Output only. This field will be populated if a TRANSFORM clause was used to train a model. TRANSFORM clause (if used) takes feature_columns as input and outputs transform_columns. transform_columns then are used to train the model.",
  ).optional(),
  datasetId: z.string().describe("Required. Dataset ID of the requested model.")
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

/** Swamp extension model for Google Cloud BigQuery Models. Registered at `@swamp/gcp/bigquery/models`. */
export const model = {
  type: "@swamp/gcp/bigquery/models",
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
      toVersion: "2026.07.19.2",
      description: "Added: datasetId",
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
      toVersion: "2026.08.25.1",
      description: "No schema changes",
      upgradeAttributes: (old: Record<string, unknown>) => old,
    },
    {
      toVersion: "2026.09.14.1",
      description: "No schema changes",
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
      description:
        "Gets the specified model resource by model ID. # IAM Permissions Requires the...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    get: {
      description: "Get a models",
      arguments: z.object({
        identifier: z.string().describe("The name of the models"),
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
        params["modelId"] = args.identifier;
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
      description: "Update models attributes",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific models by name (e.g. one discovered by list)",
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
        params["modelId"] = existing["name"]?.toString() ?? "";
        const body: Record<string, unknown> = {};
        if (g["creationTime"] !== undefined) {
          body["creationTime"] = g["creationTime"];
        }
        if (g["defaultTrialId"] !== undefined) {
          body["defaultTrialId"] = g["defaultTrialId"];
        }
        if (g["description"] !== undefined) {
          body["description"] = g["description"];
        }
        if (g["encryptionConfiguration"] !== undefined) {
          body["encryptionConfiguration"] = g["encryptionConfiguration"];
        }
        if (g["etag"] !== undefined) body["etag"] = g["etag"];
        if (g["expirationTime"] !== undefined) {
          body["expirationTime"] = g["expirationTime"];
        }
        if (g["featureColumns"] !== undefined) {
          body["featureColumns"] = g["featureColumns"];
        }
        if (g["friendlyName"] !== undefined) {
          body["friendlyName"] = g["friendlyName"];
        }
        if (g["hparamSearchSpaces"] !== undefined) {
          body["hparamSearchSpaces"] = g["hparamSearchSpaces"];
        }
        if (g["hparamTrials"] !== undefined) {
          body["hparamTrials"] = g["hparamTrials"];
        }
        if (g["labelColumns"] !== undefined) {
          body["labelColumns"] = g["labelColumns"];
        }
        if (g["labels"] !== undefined) body["labels"] = g["labels"];
        if (g["lastModifiedTime"] !== undefined) {
          body["lastModifiedTime"] = g["lastModifiedTime"];
        }
        if (g["location"] !== undefined) body["location"] = g["location"];
        if (g["modelReference"] !== undefined) {
          body["modelReference"] = g["modelReference"];
        }
        if (g["modelType"] !== undefined) body["modelType"] = g["modelType"];
        if (g["optimalTrialIds"] !== undefined) {
          body["optimalTrialIds"] = g["optimalTrialIds"];
        }
        if (g["remoteModelInfo"] !== undefined) {
          body["remoteModelInfo"] = g["remoteModelInfo"];
        }
        if (g["trainingRuns"] !== undefined) {
          body["trainingRuns"] = g["trainingRuns"];
        }
        if (g["transformColumns"] !== undefined) {
          body["transformColumns"] = g["transformColumns"];
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
          PATCH_CONFIG,
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
      description: "Delete the models",
      arguments: z.object({
        identifier: z.string().describe("The name of the models"),
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
        params["modelId"] = args.identifier;
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
      description: "Sync models state from GCP",
      arguments: z.object({
        identifier: z.string().describe(
          "Target a specific models by name (e.g. one discovered by list)",
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
          params["modelId"] = identifier;
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
      description: "List models resources",
      arguments: z.object({
        maxResults: z.number().describe(
          "The maximum number of results to return in a single response page. Leverage the page tokens to iterate through the entire collection.",
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
        if (args["maxResults"] !== undefined) {
          params["maxResults"] = String(args["maxResults"]);
        }
        const { items, nextPageToken } = await listResources(
          baseUrl,
          LIST_CONFIG,
          params,
          "models",
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
  },
};
