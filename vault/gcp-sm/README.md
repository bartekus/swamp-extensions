# @swamp/gcp-sm

Swamp vault provider backed by
[Google Cloud Secret Manager](https://cloud.google.com/secret-manager). Stores,
retrieves, deletes, and lists secrets through the Secret Manager v1 REST API,
using Application Default Credentials (ADC) for authentication.

## Installation

```sh
swamp extension pull @swamp/gcp-sm
```

## Configuration

Credentials are resolved via the standard GCP credential chain — no credentials
in config. Provide them via one of:

- `GCP_ACCESS_TOKEN` environment variable (pre-obtained OAuth2 access token)
- `GOOGLE_APPLICATION_CREDENTIALS_JSON` environment variable (inline service
  account JSON)
- `GOOGLE_APPLICATION_CREDENTIALS` environment variable (path to service account
  JSON file)
- Application Default Credentials: `gcloud auth application-default login`
- GCE/GKE metadata server (when running on Google Cloud infrastructure)

The calling principal must have the following IAM permissions on the target
project:

- `secretmanager.secrets.create`
- `secretmanager.secrets.get`
- `secretmanager.secrets.list`
- `secretmanager.secrets.update`
- `secretmanager.secrets.delete`
- `secretmanager.versions.add`
- `secretmanager.versions.access`
- `secretmanager.versions.list` (for hygiene inventory)

## Usage

Create a vault bound to a specific project:

```bash
swamp vault create @swamp/gcp-sm my-gcp-sm \
  --config '{"project_id": "my-project"}' --json
```

The `project_id` is optional — when omitted, it's resolved from the
`GOOGLE_CLOUD_PROJECT` environment variable or `gcloud config`.

Read, write, delete, and list secrets:

```bash
swamp vault read-secret my-gcp-sm my-secret --json
swamp vault put my-gcp-sm my-secret "s3cr3t" --json
swamp vault delete my-gcp-sm my-secret --json
swamp vault list-keys my-gcp-sm --json
```

## Deletion

`swamp vault delete` permanently removes the secret and all its versions.
Unlike AWS Secrets Manager, GCP Secret Manager has no recovery window — deletion
is immediate and irreversible.

## Annotations

Attach metadata to secrets via `swamp vault annotate` and inspect it with
`swamp vault inspect`. Annotation fields map to native GCP primitives:

| Field    | GCP primitive                                       |
| -------- | --------------------------------------------------- |
| `notes`  | Secret `annotations` map (`swamp-notes` key)        |
| `url`    | Secret `annotations` map (`swamp-url` key)          |
| `labels` | Secret `labels` map (`swamp-` prefixed keys)        |

GCP's `annotations` field allows arbitrary text values (up to 1024 bytes),
so URLs with query parameters work without the encoding workarounds that
AWS requires.

```bash
swamp vault annotate my-gcp-sm API_KEY \
  --url https://console.cloud.google.com/security/secret-manager \
  --note "Production API key" \
  --label env=prod --label team=infra

swamp vault inspect my-gcp-sm API_KEY --json
```

## Hygiene Inventory

The `inventoryHygieneMetadata` method produces a metadata-only snapshot of all
secrets and their versions across one or more GCP projects. It collects rotation
schedules, version state, creation times, labels, and annotations without ever
calling `versions.access` or persisting payload fields.

The snapshot supports reporting rotation-notification gaps and
latest-enabled-version age without touching actual secret payloads. It follows
all pagination pages and fails immediately on permission or rate-limit errors.

```typescript
const snapshot = await provider.inventoryHygieneMetadata([
  "project-a",
  "project-b",
]);
// snapshot.projects[0].secrets[0].rotation?.nextRotationTime
// snapshot.projects[0].secrets[0].versions[0].state  // "ENABLED"
```

## Emulator Support

For local development and testing without a GCP account, set `api_endpoint`
to point at a Secret Manager emulator such as
[floci-gcp](https://floci.io/gcp/). Authentication is skipped when a custom
endpoint is configured.

```bash
docker run --rm -p 4588:4588 floci/floci-gcp:latest

swamp vault create @swamp/gcp-sm my-local-sm \
  --config '{"project_id": "floci-local", "api_endpoint": "http://localhost:4588"}' --json
```

## Prefix Namespacing

The optional `secret_prefix` config scopes all operations to secrets whose
names start with the given prefix, stripping it from returned names. This lets
multiple swamp workspaces share a single GCP project without collision.

```bash
swamp vault create @swamp/gcp-sm dev-vault \
  --config '{"project_id": "my-project", "secret_prefix": "dev-"}' --json
```

## Observability

The extension emits [OpenTelemetry](https://opentelemetry.io/) spans for vault
operations (get, put, list, delete, and annotation CRUD). Spans are no-ops when
no `TracerProvider` is configured in the host process.

## Secret Key Format

Secret keys are mapped to GCP Secret Manager secret IDs. Slashes in key names
are replaced with hyphens (`/` → `-`) since GCP secret IDs only allow
`[a-zA-Z0-9_-]`.

## License

AGPLv3 — see [LICENSE.txt](./LICENSE.txt) for details.
