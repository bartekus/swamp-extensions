import { trace } from "npm:@opentelemetry/api@1.9.0";

const TRACER_NAME = "@swamp/gcs-datastore";

export function getTracer() {
  return trace.getTracer(TRACER_NAME);
}

export const Attr = {
  RPC_SYSTEM: "rpc.system",
  RPC_SERVICE: "rpc.service",
  RPC_METHOD: "rpc.method",
  GCP_GCS_BUCKET: "gcp.gcs.bucket",
  GCP_GCS_KEY: "gcp.gcs.key",
  GCP_UPLOAD_ID: "gcp.upload_id",
  HTTP_RESPONSE_STATUS_CODE: "http.response.status_code",
  HTTP_RESPONSE_BODY_SIZE: "http.response.body.size",
  ERROR_TYPE: "error.type",
  LOCK_KEY: "lock.key",
  LOCK_TIMEOUT_MS: "lock.timeout_ms",
  LOCK_TTL_MS: "lock.ttl_ms",
  LOCK_WAIT_DURATION_MS: "lock.wait_duration_ms",
  LOCK_CONTENDED: "lock.contended",
  LOCK_HOLDER: "lock.holder",
  DATASTORE_NAMESPACE: "datastore.namespace",
  DATASTORE_FILES_PULLED: "datastore.files_pulled",
  DATASTORE_FILES_PUSHED: "datastore.files_pushed",
  DATASTORE_FILES_DELETED: "datastore.files_deleted",
  DATASTORE_FAST_PATH_HIT: "datastore.fast_path_hit",
  DATASTORE_FILE: "datastore.file",
  DATASTORE_ENTRIES: "datastore.entries",
  DATASTORE_SHARDS: "datastore.shards",
  DATASTORE_SHARDS_WRITTEN: "datastore.shards_written",
  DATASTORE_CAS_RETRIES: "datastore.cas_retries",
  DATASTORE_ROWS: "datastore.rows",
  DATASTORE_NAMESPACES: "datastore.namespaces",
  DATASTORE_DRY_RUN: "datastore.dry_run",
  DATASTORE_FOREIGN_OBJECTS: "datastore.foreign_objects",
} as const;
