# GCP Provider Design

## 1. Purpose

Clover's GCP provider reads Google Cloud Discovery Documents and generates a set
of swamp extension models — one per GCP resource type. Each model is a
self-contained TypeScript file that exports a `model` object with Zod schemas,
CRUD methods, and action methods. A shared `_lib/gcp.ts` file provides the HTTP
client, authentication, URL construction, LRO polling, and readiness polling.

Unlike the AWS provider (which uses the unified CloudControl API), the GCP
provider generates direct REST API calls using path templates from the Discovery
Documents. Unlike the Hetzner and DigitalOcean providers (which are single
packages), GCP uses per-service packaging like AWS due to the scale of the API
surface (~260 services, ~2010 resources).

**Output**: `outputs/gcp/{service}/` — one directory per GCP API service,
containing:

- `extensions/models/*.ts` — one file per resource type (e.g., `instances.ts`,
  `firewalls.ts`)
- `extensions/models/_lib/gcp.ts` — shared HTTP client and helpers
- `manifest.yaml` — extension package manifest

**How to run**:

```sh
deno task fetch-schema:gcp    # download Discovery Documents
deno task generate:gcp        # generate models from the local schemas
```

The pipeline is orchestrated by `src/commands/generateModels.ts`, which calls
`generateGcpModels()` from the pipeline, writes all files per service, runs
`deno fmt`, and reports changes.

---

## 2. Schema Source

GCP uses its own Discovery Document format (not OpenAPI). Each API has a
separate document fetched from Google's Discovery API directory.

### Fetch process

1. Fetch the directory listing from
   `https://www.googleapis.com/discovery/v1/apis`
2. Group APIs by name, selecting the best version per API:
   - Prefer versions marked with `preferred: true`
   - Otherwise: stable versions over alpha/beta, highest version number wins
3. For each selected API, fetch its discovery document via `discoveryRestUrl`
4. Save each as `{name}.json` in `schemas/gcp/` with sorted keys for
   deterministic output
5. Retry with exponential backoff (250ms base, 3 retries, 30s timeout)
6. Auto-discover additional stable versions: for every API with more than one
   stable (non-alpha/non-beta) version, fetch each non-preferred version and
   save as `{name}-{version}.json` (e.g. `iam-v1.json`, `cloudbuild-v1.json`)

### Cross-version resource merging

Many GCP APIs expose different resource sets across versions. For example, IAM
v2 (preferred) only has Deny Policies, while v1 has roles, serviceAccounts,
keys, workforcePools, workloadIdentityPools, oauthClients, and ~14 total
resources. The pipeline automatically discovers and merges resources from all
stable versions of each API.

**Merge semantics**: Schema files are processed in deterministic order —
preferred versions (`{name}.json`) before additional versions
(`{name}-{version}.json`), both sorted alphabetically. A cross-version
deduplication step tracks seen resource keys (`service.resourcePath`). The
preferred version always wins: resources from additional versions are only
included when no resource with the same key exists from the preferred version.

Within-document scope deduplication (`deduplicateScopedResources`) still runs
first, merging projects/organizations/folders variants into a single model
before cross-version dedup applies.

### Skipped APIs

| API                  | Reason                                    |
| -------------------- | ----------------------------------------- |
| `area120tables`      | Shutdown — discovery endpoint returns 404 |
| `developerknowledge` | Internal API — returns 400                |
| `poly`               | Shutdown — returns 502                    |

### Discovery Document format

GCP Discovery Documents are **not** OpenAPI. Key differences:

- `resources` — nested tree of API resources with methods
- `schemas` — type definitions referenced by `$ref` (simple name lookups, not
  JSON Pointer paths)
- `methods` — HTTP method definitions with path templates, parameter orders, and
  request/response schema references
- No `paths` object — resources are nested, not flat

### $ref dereferencing

GCP uses a simpler `$ref` system than OpenAPI — references are schema name
lookups within the same document:

```
{ "$ref": "Instance" } → doc.schemas["Instance"]
```

Circular references are replaced with
`{ type: "object", description: "Circular reference to ..." }`. Dereferencing is
recursive through properties, items, additionalProperties, and composed schemas
(allOf, oneOf, anyOf).

---

## 3. Resource Discovery

### Recursive resource collection

Resources are discovered by recursively walking the `resources` tree in each
Discovery Document. Unlike OpenAPI path-based discovery, GCP resources are
explicitly nested:

```json
{
  "resources": {
    "instances": {
      "methods": { "get": {...}, "insert": {...}, "delete": {...}, "start": {...} },
      "resources": {
        "networkInterfaces": { "methods": {...} }
      }
    }
  }
}
```

A resource is included if it has at least a `get`, `list`, or `insert` method.

### Method extraction

Methods are mapped from Discovery Document names to CRUD operations:

| Discovery method name               | Operation         |
| ----------------------------------- | ----------------- |
| `get`                               | Read              |
| `list`, `aggregatedList`, `listAll` | List              |
| `insert`, `create`                  | Create            |
| `update`                            | Update            |
| `patch`                             | Patch             |
| `delete`                            | Delete            |
| `deleteXxx`, `removeXxx`            | Delete (fallback) |
| Everything else                     | Action method     |

Operations resources (matching `/[Oo]perations?$/`) are skipped — these are
internal GCP async tracking resources.

### Scope deduplication

Many GCP resources exist at multiple scopes — `projects`, `organizations`,
`folders`, `billingAccounts`. For example, IAM policies may appear under both
`projects.iamPolicies` and `organizations.iamPolicies`. Since these share the
same API surface, they are deduplicated into a single model with
`availableScopes` tracking which scopes are supported.

Path segments are stripped during deduplication:

- **Scope prefixes**: `projects`, `organizations`, `folders`, `billingAccounts`
- **Non-meaningful segments**: `locations`, `zones`, `regions` (handled by
  location parameters)

### Global-only detection

Resources that only support `location: "global"` are detected by pattern
matching against method descriptions:

- `"only supported value for location is \`global\`"`
- `"Only global location is supported"`

When detected, a `location` property is auto-added with `default: "global"`.

### Per-service grouping

Resources are grouped by the Discovery Document's `name` field:

| Service name   | Resource path | Model file     | Model slug  |
| -------------- | ------------- | -------------- | ----------- |
| `compute`      | `instances`   | `instances.ts` | `instances` |
| `compute`      | `firewalls`   | `firewalls.ts` | `firewalls` |
| `container`    | `clusters`    | `clusters.ts`  | `clusters`  |
| `serviceusage` | `services`    | `services.ts`  | `services`  |

Each service produces an independent publishable extension package:
`@swamp/gcp/compute`, `@swamp/gcp/container`, `@swamp/gcp/serviceusage`, etc.

### Why per-service splitting

With ~260 services and ~2010 resources, a single `@swamp/gcp` package would be
impractical. Per-service packaging matches the AWS pattern and allows
independent versioning, faster installs, and alignment with how GCP organizes
its APIs.

---

## 4. Property Classification

### Domain vs resource properties

The pipeline builds two property sets from distinct schema sources:

**Domain properties** (writable): Union of properties from insert, update, and
patch request schemas. Path parameters from all CRUD methods' `parameterOrder`
and required query parameters from insert are also added — the pipeline scans
insert, get, list, update, patch, and delete method configs. For get, update,
patch, and delete, the last parameter (the resource identifier, resolved from
`args.identifier` or existing state at runtime) is skipped. For list, all
parameters are included because the list execute function resolves every
parameter from `globalArgs`. This ensures subresource models whose parent path
parameter (e.g., `spreadsheetId`) only appears in non-insert methods still
declare it in `GlobalArgsSchema`. Read-only, output-only, and deprecated
properties are removed.

**Resource properties** (all): Properties from the GET response schema (or list
response item schema for listOnly resources).

### Property provenance tracking

Domain properties are the **union** of insert, update, and patch schemas, but
the create and update methods need to send only the properties valid for their
specific endpoint. The pipeline tracks provenance:

- `insertProperties: Set<string>` — properties from the insert request schema
- `updateProperties: Set<string>` — properties from update/patch request schemas

The create method body only includes `insertProperties`. The update method body
only includes `updateProperties`. `GlobalArgsSchema` includes the full union so
users configure all properties in one place.

### Why provenance tracking matters

GKE clusters illustrate the problem: the insert request uses
`{ cluster: {...} }` while the update request uses
`{ name: "...", update: {...} }`. Without provenance tracking, the `name` field
from the update schema would leak into the create body, causing "Unknown name"
API rejections.

### Output-only detection

GCP doesn't consistently mark output-only fields with `readOnly: true`. The
pipeline pattern-matches descriptions:

- `[Output Only]` — explicit Compute API marker
- `Output only.` at start of description
- `read only property`, `output only` anywhere

Well-known output-only fields (`kind`, `etag`, `selfLink`) are always excluded.

### Create-only detection

Immutable properties are detected by description patterns:

- `immutable`
- `set only at/on/during resource creation`
- `specified only at/on/during resource creation`
- `cannot be changed/modified/updated`

A property is NOT create-only if the description also contains "and updated" or
"and changed".

### Deprecated detection

Properties with `deprecated: true` in the schema are excluded from domain
properties.

### Property name sanitization

GCP Discovery Documents sometimes contain property names invalid as bare
JavaScript identifiers:

- **Dotted names**: `header.bypassBillingFilter`,
  `encryptionConfig.encryptionType`
- **Hyphenated names**: `end-date`, `max-results`, `bulk-export-group`

These are sanitized by replacing dots, hyphens, and slashes with underscores
before entering the Zod generator. Sanitization applies to all property names
across domain properties, resource properties, required lists, and create-only
lists.

### GCP → CfProperty normalization

GCP Discovery properties are normalized to `CfProperty` format (from
`src/schema/types.ts`) to reuse the shared `zodGenerator.ts`:

- `type: "any"` → `type: "string"` (most permissive supported type)
- Integer formats (`int32`, `int64`, `uint32`, `uint64`) → format removed (GCP
  uses string type with these formats to avoid JS precision issues)
- Number formats (`float`, `double`, `decimal`) → `double`
- String formats: `google-datetime` → `date-time`, `uri`/`url` → `uri`
- Unsupported formats removed: `uuid`, `email`, `duration`, `google-duration`,
  `google-fieldmask`, `byte`, `binary`, `password`
- `minimum`/`maximum` parsed from strings (GCP sometimes has string-typed
  min/max values)

---

## 5. Two URL Patterns: Individual Params vs Full Resource Name

GCP APIs use two fundamentally different URL patterns, and the generated models
must handle both.

### Individual path parameters (505 resources)

Older APIs (primarily Compute) use separate path parameters for each segment:

```
projects/{project}/zones/{zone}/instances/{instance}
```

Each parameter (`project`, `zone`, `instance`) is resolved independently from
globalArgs or existing state. The generated code uses bracket notation for all
dynamic property access:

```typescript
params["zone"] = String(g["zone"]);
params["instance"] = args.identifier;
```

### Full resource name via `{+name}` (1533 resources)

Newer APIs use a single `{+name}` parameter containing the fully-qualified
resource path:

```
v1/{+name}          → v1/projects/my-project/services/compute.googleapis.com
v1/{+parent}/services → v1/projects/my-project/services
```

The relationship is: `name = parent + "/" + resourceSegment + "/" + shortName`.

### Detection

The pipeline detects the `{+name}` pattern when:

- The GET path contains `{+name}` with just `"name"` in `parameterOrder`
- The list/create path reveals the resource segment (e.g., `"services"` from
  `v1/{+parent}/services`)

### buildResourceName helper

For `{+name}` resources, the generated model includes a helper function:

```typescript
function buildResourceName(parent: string, shortName: string): string {
  return `${parent}/services/${shortName}`;
}
```

This is used by create (for post-LRO read-back), get, update, delete, sync, and
action methods to construct the fully-qualified name.

### Parent resolution: project-only vs multi-scope vs nested

The `parent` argument to `buildResourceName` is resolved differently depending
on the resource's scope and nesting depth:

- **Top-level project-only resources** (`availableScopes: ["projects"]`,
  `resourcePath.length === 1`): the parent is constructed from `projectId` and
  `location` globalArgs:
  `` `projects/${projectId}/locations/${g["location"]}` ``. The `parent` field
  is not exposed in `GlobalArgsSchema` — users set `location` instead, and the
  generated code derives the parent path.

  **Global endpoint detection:** Some GCP APIs define resources under both
  `projects.{resource}` (global) and `projects.locations.{resource}` (regional)
  in the Discovery Document. During scope deduplication, the pipeline detects
  when both paths contribute to the same merged resource and sets
  `hasGlobalEndpoint: true`. For these resources, the generated parent
  expression is conditional: when `location` is `"global"` or unset, the parent
  omits the `locations` segment (`projects/${projectId}`); otherwise it includes
  it (`projects/${projectId}/locations/${location}`). This handles APIs like
  Secret Manager, Cloud Build, and Dialogflow where the global API rejects
  `locations/global` as an invalid parent.

- **Nested project-only resources** (`availableScopes: ["projects"]`,
  `resourcePath.length > 1`): the parent is read from `globalArgs.parent`, which
  includes the full ancestor chain. For example,
  `workloadIdentityPools.providers` requires
  `parent: "projects/my-project/locations/global/workloadIdentityPools/my-pool"`.
  Auto-constructing the parent from just `projectId` and `location` would omit
  the intermediate resource segments.

- **Multi-scope resources** (organizations, folders, billing accounts): the
  parent is read directly from `globalArgs.parent`, which is declared in
  `GlobalArgsSchema`. Users provide the full parent path (e.g.,
  `organizations/123/locations/us-central1`).

### Query parameter routing

Some GCP APIs declare parameters with `location: "query"` on the create method
(e.g., `workloadIdentityPoolId`, `workloadIdentityPoolProviderId`). These must
be sent as URL query parameters, not in the request body. The code generator
checks `insertConfig.parameters[propName].location === "query"` and routes
matching properties to the `params` map (where `buildUrl` appends them as query
strings) instead of the `body` object.

For update/patch methods, the same routing applies: properties declared with
`location: "query"` in `updateConfig.parameters` are sent as URL query
parameters, not in the request body. When the property also exists in the stored
state, the generator emits a fallback from `existing[propName]` so that query
params like `name` (used by `sqladmin/users` to identify the target user) are
always present on the URL even when the caller doesn't re-supply them. The
pipeline collects query parameters from update/patch method configs into
`domainProperties` and `updatePropertyNames`, mirroring the insert query-param
collection pass, so they appear in `GlobalArgsSchema` and the CRUD update
codegen routes them automatically.

Additionally, `updateMask` is auto-computed when the method config declares it
as a query parameter (`location: "query"`). The mask is set to the comma-joined
keys of the request body _before_ fingerprint/etag carry-forward, so it contains
only user-supplied field names. This follows the protobuf FieldMask JSON
encoding convention (camelCase field paths).

For action methods (non-CRUD methods like `append`, `batch_get`, `start`),
query-location parameters from `action.config.parameters` are added to the
action's `arguments` schema and routed to the `params` map in the execute body.
This ensures that API-required query parameters (e.g., `valueInputOption` on
Sheets `values.append`) are reachable by the caller and sent as URL query
strings rather than in the request body.

---

## 6. Identifying Field Resolution

### Primary identifier from path parameters

The primary identifier is determined from the last parameter in the GET (or
list/insert) method's `parameterOrder`:

```typescript
const identifierMap: Record<string, string> = {
  name: "name",
  resourceId: "id",
  id: "id",
  instanceId: "id",
  diskId: "id",
  networkId: "id",
};
```

Default: `["name"]` — most GCP resources use `name`.

### Required properties from annotations

GCP uses `annotations.required` on properties to list which methods require
them, plus a schema-level `required` array (rarely populated). Path-only
parameters are always required.

---

## 7. Factory Pattern and Instance Naming

Every model uses a **factory pattern** identical to the AWS and DigitalOcean
providers.

### `resolveGcpNamingField`: preference order

1. **Primary identifier in domain properties** — if the primary identifier field
   (typically `name`) exists in domain properties, use it directly
2. **`name` in domain properties** — fallback if primary ID is something else
   but `name` is writable
3. **Synthetic `name`** — injected when neither is available

### Synthetic name exclusion from API calls

When synthetic, `name` is excluded from both the create and update request
bodies. It is only used for:

1. Factory-pattern instance naming (`writeResource("state", instanceName, ...)`)
2. Building the full resource name (`buildResourceName(parent, name)`)

### How instance names flow through methods

All methods prefer `g.name` (the user-supplied globalArg) as the primary state
key. This ensures consistency — `get` and `create` store under the same key that
`update` and `sync` use for lookup.

| Method   | Instance name source                                                |
| -------- | ------------------------------------------------------------------- |
| `create` | Natural: `g.name ?? result.name`, Synthetic: `g.name ?? "current"`  |
| `get`    | Natural: `g.name ?? result.name`, Synthetic: `g.name ?? identifier` |
| `update` | `g.name ?? identifier ?? "current"` (identifier is optional)        |
| `delete` | `g.name ?? identifier`                                              |
| `sync`   | `g.name ?? identifier ?? "current"` (identifier is optional)        |

---

## 8. Authentication

The `_lib/gcp.ts` helper supports the full GCP credential chain, with optional
vault-expression credentials taking highest precedence.

### Credential resolution order

1. **Explicit credentials** (from `globalArgs`) — `accessToken` or
   `credentialsJson` fields wired via `vault.get(...)` expressions. These take
   absolute precedence over all environment variables.
2. **`GCP_ACCESS_TOKEN`** — pre-obtained OAuth2 access token (convenient for
   vault-stored tokens; does **not** require `gcloud` CLI). Requires
   `GCP_PROJECT` or `GOOGLE_CLOUD_PROJECT` to be set.
3. **`GOOGLE_APPLICATION_CREDENTIALS_JSON`** — inline service account JSON
   (convenient for swamp vaults)
4. **`GOOGLE_APPLICATION_CREDENTIALS`** — file path to a service account JSON
   file (standard Google SDK env var)
5. **Application Default Credentials** — `gcloud auth application-default login`
   or GCE/Cloud Run metadata server

Options 3–5 require the `gcloud` CLI to be installed.

### Vault expression credential fields

Every generated GCP model includes optional global arguments for credentials:

| Field             | Sensitive | Description                                                                                         |
| ----------------- | --------- | --------------------------------------------------------------------------------------------------- |
| `accessToken`     | yes       | GCP OAuth2 access token; overrides `GCP_ACCESS_TOKEN`                                               |
| `credentialsJson` | yes       | Service account JSON; overrides `GOOGLE_APPLICATION_CREDENTIALS_JSON`                               |
| `project`         | no        | GCP project ID; overrides `GCP_PROJECT` / `GOOGLE_CLOUD_PROJECT`                                    |
| `scopes`          | no        | Comma-separated OAuth scopes; overrides the API's default scopes                                    |
| `quotaProject`    | no        | Quota/billing project ID; sets `x-goog-user-project` header; overrides `GOOGLE_CLOUD_QUOTA_PROJECT` |

These fields use `z.meta({ sensitive: true })` where applicable, so swamp-core
redacts them from run logs, reports, and data storage.

Wire them in model YAML with vault expressions:

```yaml
globalArguments:
  credentialsJson: "{{ vault.get('gcp-sa-key', 'json') }}"
  project: "my-project-id"
```

**Collision guard:** If a GCP resource already has a domain property named
`accessToken`, `credentialsJson`, `project`, `scopes`, or `quotaProject`, that
credential field is not injected as a separate `GlobalArgsSchema` entry for that
specific service — it already exists in the schema as a domain property. The
collision guard mirrors the AWS pattern. The colliding field is still forwarded
in `_buildGcpCredentials` so it reaches credential resolution (e.g. `project` as
a domain property carries the same GCP project ID that the credential chain
needs). When `scopes` collides, the user-overridable global arg is skipped but
the `_defaultOAuthScopes` constant still applies — the API's default scopes are
always used.

### OAuth scopes

Each generated model includes a `_defaultOAuthScopes` constant populated from
the API's Discovery Document (`doc.auth.oauth2.scopes`). When minting access
tokens via `gcloud auth print-access-token` or
`gcloud auth application-default print-access-token`, these scopes are passed
via `--scopes=<comma-separated>`. This ensures APIs that require specific OAuth
scopes (e.g., Calendar API needs `https://www.googleapis.com/auth/calendar`
rather than the generic `cloud-platform` scope) work out of the box with
service-account and ADC authentication.

Users can override the default scopes via the `scopes` global argument
(comma-separated string). When no scopes are declared in the Discovery Document,
`_defaultOAuthScopes` is an empty array and no `--scopes` flag is passed,
preserving the previous gcloud default behavior.

### Service account activation

For options 3 and 4, the service account is activated via:

```sh
gcloud auth activate-service-account {email} --key-file {tmpfile}
gcloud auth print-access-token {email} --scopes={scopes}
```

The `--scopes` flag is included when scopes are available (from
`_defaultOAuthScopes` or the user-provided `scopes` global arg). The access
token is cached for the duration of the process.

### Project ID resolution

The project ID is resolved in order: explicit `project` global arg → service
account JSON's `project_id` field → `GCP_PROJECT` / `GOOGLE_CLOUD_PROJECT` env
vars → `gcloud config get-value project` (ADC only). When using
`GCP_ACCESS_TOKEN` without an explicit `project` arg, the project ID must be
provided via `GCP_PROJECT` or `GOOGLE_CLOUD_PROJECT`.

### Quota project header

The `x-goog-user-project` header is only sent when a quota project is explicitly
configured — it is never derived from the resource project ID. This matches
gcloud CLI semantics, where the quota project is an opt-in override separate
from the project that owns the resources being accessed.

The quota project is resolved from two sources, in order:

1. Explicit `quotaProject` global arg (injected as a credential field on every
   GCP model, forwarded via `_buildGcpCredentials` to `ExplicitGcpCredentials`)
2. `GOOGLE_CLOUD_QUOTA_PROJECT` environment variable (the standard Google
   mechanism)

When neither source provides a value, the header is omitted entirely. For
service account credentials, the SA's own project is used automatically by the
GCP API gateway as the default quota project — the header is unnecessary and
would require the `serviceUsageConsumer` role without adding function.

### gcloud CLI check

On first credential request (for options 3–5), the helper verifies
`gcloud --version` succeeds. If not installed, a clear error with the install
link is thrown.

### Emulator / custom endpoint support

Every generated GCP model includes an optional `apiEndpoint` global argument
(and `InputsSchema` entry) that overrides the service's hardcoded `BASE_URL`.
This lets users point models at local emulators (e.g., floci-gcp) or custom API
endpoints for testing.

At the start of each method execution, the generated code resolves the base URL
with a three-level cascade: explicit global arg → environment variable →
hardcoded default:

```typescript
const baseUrl = g["apiEndpoint"]?.toString() ??
  Deno.env.get("GCP_API_ENDPOINT")?.trim() ??
  BASE_URL;
```

The `GCP_API_ENDPOINT` environment variable follows the `GCP_` prefix convention
used by `GCP_ACCESS_TOKEN` and `GCP_PROJECT`. It applies to all GCP models
uniformly, unlike the per-service `*_EMULATOR_HOST` variables used by
`gcloud beta emulators`.

The resolved `baseUrl` is passed to all `_lib/gcp.ts` helper calls
(`createResource`, `readResource`, `updateResource`, `deleteResource`,
`listResources`, `readViaList`). The original `const BASE_URL = "..."` remains
as the default.

`apiEndpoint` is included in the `_credentialKeys` set so it is excluded from
request bodies (alongside `accessToken`, `credentialsJson`, `project`, `scopes`,
and `quotaProject`). It is a configuration-only field — it is never sent to the
GCP API.

Example usage with a local emulator:

```yaml
globalArguments:
  apiEndpoint: "http://localhost:4588/"
  project: "floci-local"
```

See `vault/gcp-sm/extensions/vaults/gcp_sm.ts` for the hand-written reference
implementation (`api_endpoint` config field) and
`vault/gcp-sm/extensions/vaults/gcp_sm_test.ts` for the floci integration test
pattern (gated by `FLOCI_ENABLED=1`).

---

## 9. Long Running Operations (LRO)

Most GCP mutating operations (create, update, delete, action methods) return an
operation object that must be polled for completion.

### Three LRO patterns

| Pattern | Detection                                                                   | Example services                                         |
| ------- | --------------------------------------------------------------------------- | -------------------------------------------------------- |
| Compute | `response.kind` contains `#operation`                                       | Compute Engine                                           |
| Generic | `response.name` contains `operations/`                                      | Most services (serviceusage, cloudresourcemanager, etc.) |
| GKE     | `response.operationType` exists AND `response.name` starts with `operation` | Container (GKE), some AI Platform                        |

The generic pattern does not require a `done` field — v3 APIs (e.g.,
cloudresourcemanager folders) return
`{ "name": "operations/...", "metadata": {...} }` with no `done` field in the
initial response. The `done` field appears after polling.

### Already-done operations

Some APIs return operations that are already complete (e.g., `done: true` or
`status: "DONE"` in the response). The LRO handler checks `isOperationDone()`
before polling to avoid unnecessary requests.

### Post-LRO resource name extraction

v3 LROs include the created resource in `operation.response` when the operation
completes successfully. `createResource` extracts `operation.response.name` into
the path params so the post-LRO GET read-back can construct the correct URL.
This handles resources like folders where the resource name (e.g.,
`folders/981118018507`) is only known after the operation completes.

### Operation URL construction

The poll URL is derived from the operation response:

1. `response.selfLink` — used directly if present (GKE pattern)
2. `response.name` starting with `http` — used directly
3. `response.name` as a path — prepended with `baseUrl` + API version prefix

The API version prefix (e.g., `v1`) is extracted from the original request path
to ensure the poll URL is correct:
`https://serviceusage.googleapis.com/v1/operations/noop.DONE_OPERATION`

### Polling parameters

- Max attempts: 20
- Base delay: 2 seconds, exponential backoff
- Max delay: 30 seconds
- Checks for errors after completion and throws if found

---

## 10. Readiness Polling

Some GCP resources report LRO completion while still in an intermediate state
(e.g., GKE clusters go through `PROVISIONING` → `RUNNING`). The pipeline
auto-detects this and adds readiness polling after LRO completion.

### Detection

The pipeline scans the resource's GET response schema for `status`, `state`, or
`lifecycleState` enum fields. If found, it classifies enum values:

**Ready values**: `ACTIVE`, `RUNNING`, `READY`, `ENABLED`, `SUCCEEDED`, `DONE`,
`COMPLETED`, `AVAILABLE`, `RUNNABLE`, `SERVING`, `UP`, `ONLINE`, `RECONCILING`

**Failed values**: `FAILED`, `ERROR`, `DEGRADED`, `STOPPED`, `TERMINATED`,
`BROKEN`, `UNRECOVERABLE`

### Polling behavior

After LRO + read-back, `createResource` and `updateResource` poll the GET
endpoint every 10 seconds for up to 10 minutes until the status field reaches a
ready or failed value. If a failed value is reached, an error is thrown.

### Opt-out

Resources with readiness config get a `waitForReady` argument on create and
update methods:

- **Default** (`waitForReady: true` or omitted): polls until ready
- **`waitForReady: false`**: skips readiness polling, returns after LRO + GET

Resources without detectable status enums have no readiness polling and no
`waitForReady` argument.

---

## 10a. Idempotent Create

`createResource` supports an optional `IdempotencyConfig` that enables
already-exists fallback. When a create fails with HTTP 409 or an LRO-level
"already exists" error (e.g., GCP's "display name uniqueness within the parent"
for folders), the function falls back to listing resources and matching by a
specified field.

### Config shape

```typescript
interface IdempotencyConfig {
  listConfig: GcpMethodConfig; // LIST endpoint config
  listParams: Record<string, string>; // params for the list call (e.g., parent)
  matchField: string; // field to match on (e.g., "displayName")
  matchValue: string; // value to match
}
```

### Match field selection

The generator selects the match field via `resolveGcpMatchField()`, a cascade
that picks the best user-facing unique identifier. The cascade differs based on
whether the naming field is synthetic (server-assigned) or user-settable:

**When `isSyntheticName` is true** (server-assigned `name`):

1. Scan `insertProperties` for a nested identity field — an object-typed
   property with an `id` sub-property where neither the parent nor the `id` is
   described as output-only, AND the property passes the identity signal check:
   its name ends in `Key` or `Id` (case-sensitive, matching camelCase
   conventions like `groupKey`, `universalAdId`), OR the `id` sub-property's
   description contains "uniquely identify" or "unique identifier" (matching
   cases like `resource.id` on youtubeAnalytics/groupitems). Properties like
   `timeZone` that carry an `id` sub-property but lack any identity signal are
   intentionally excluded. If exactly one candidate is found, return its dotted
   path (e.g., `groupKey.id`, `preferredMemberKey.id`). Multiple candidates →
   ambiguous, skip.
2. If `displayName` exists in `insertProperties`: match by `displayName`
3. If `shortName` exists in `insertProperties`: match by `shortName`
4. Otherwise: return `undefined` (no viable match field)

**When `isSyntheticName` is false** (user-settable naming field):

1. If `displayName` exists in `insertProperties`: match by `displayName` (covers
   folders, projects, and other resources where `name` is auto-generated)
2. If `shortName` exists in `insertProperties`: match by `shortName` (covers
   tagKeys, tagValues, and firewall/security policies where `name` is
   auto-generated or not part of the insert body)
3. Match by the naming field (user-settable, so always viable)

When `resolveGcpMatchField` returns `undefined`, the generator omits the
`IdempotencyConfig` entirely. The resource gets a clean 409 error on duplicate
create instead of the misleading "Idempotency fallback also found no match via
list" message that occurred when matching on a server-assigned `name`.

### Nested identity field fallback

When the match field is a dotted path (e.g., `preferredMemberKey.id`), the
`IdempotencyConfig` approach cannot be used because `tryReadViaList` only
supports flat field access. Instead, the generator emits an inline try/catch:

```typescript
let result: StateData;
try {
  result = await createResource(..., undefined, credentials) as StateData;
} catch (createErr) {
  if (!isAlreadyExistsError(createErr)) throw createErr;
  const matchValue = String(g["preferredMemberKey"]?.id ?? "");
  const { items } = await listResources(
    BASE_URL, LIST_CONFIG, listParams, arrayField, 100, credentials,
  );
  const existing = items.find((item: any) =>
    item?.preferredMemberKey?.id === matchValue
  );
  if (existing) result = existing as StateData;
  else throw createErr;
}
```

This pattern adds `isAlreadyExistsError` and `listResources` to the model's
imports. The `listResponseArrayField` must be available for the resource;
resources without it fall back to `undefined` (no fallback).

### Segment-ID fallback for wrapper create requests

Some GCP APIs use a wrapper request schema (e.g., `CreateRoleRequest`) where
`name` must NOT be set on create — instead, a short identifier like `roleId` is
passed in the body. The full resource name in the response is
`{parent}/{segment}/{roleId}`.

When `matchField` is `name` and `name` is not in `insertProperties` (wrapper
request pattern), `detectSegmentIdField()` looks for an insert property matching
`singularize(resourceSegment) + "Id"` (e.g., segment `roles` → `roleId`). If
found, the match value falls back to constructing the full resource name via
`buildResourceName(parent, g[segmentIdField])` when `g["name"]` is unset.

This covers 18 GCP resources including IAM roles (`roleId`), Spanner instances
(`instanceId`), Bigtable tables (`tableId`), and others where the create body
uses a wrapper pattern.

### List params

The generator populates list params from:

1. Path parameters in `listConfig.parameterOrder` (e.g., `project`)
2. `parent` if it appears as a query parameter in `listConfig.parameters`

For project-only resources, parent is constructed from
`projects/${projectId}/locations/${location}`. For multi-scope resources, parent
is read from the create body or globalArgs.

---

## 11. Concurrency Control

Many GCP APIs use optimistic concurrency — update requests must include a
`fingerprint` or `etag` field from the most recently read state.

### Affected fields

- `fingerprint`, `labelFingerprint` — Compute Engine
- `etag` — IAM, Cloud Resource Manager, Cloud DNS
- Any field ending in `Fingerprint` — various Compute resources

### Implementation

The update method reads existing state, builds the update body from globalArgs,
then injects concurrency control fields from existing state:

```typescript
for (const key of Object.keys(existing)) {
  if (
    key === "fingerprint" || key === "labelFingerprint" ||
    key === "etag" || key.endsWith("Fingerprint")
  ) {
    body[key] = existing[key];
  }
}
```

This is generic across all GCP resources — no per-service configuration needed.

---

## 12. Action Methods

Action methods are non-CRUD operations exposed in Discovery Documents (e.g.,
`start`, `stop`, `reboot`, `reset`, `resize`, `attachDisk`, `setMachineType`,
`enable`, `disable`).

### Collection

All methods not matching CRUD patterns are collected as action methods. This
includes IAM policy methods (`getIamPolicy`, `setIamPolicy`,
`testIamPermissions`) which are generated as `get_iam_policy`, `set_iam_policy`,
and `test_iam_permissions` action methods on every resource that exposes them
(~64 GCP services).

### Path parameter resolution

Action method path parameters are resolved from globalArgs when possible. Only
parameters not available in globalArgs fall back to reading from existing state.
This prevents action methods from requiring a prior `create` or `get` when all
needed information is already in globalArgs.

For the resource identifier (last path parameter), the code maps to the primary
identifier field (e.g., `name`) rather than the raw path parameter name (e.g.,
`instance`), and falls back to globalArgs.

### Naming

Discovery method names are converted to snake_case for the generated method
name: `setMachineType` → `set_machine_type`. Hyphens are also converted:
`bulk-export-group` → `bulk_export_group`. Collisions with CRUD method names are
prefixed with `action_`.

### Request body

Action methods with request body schemas generate typed arguments from the
request properties. Methods without request bodies generate empty arguments.

---

## 13. Sync Method

Every generated model includes a `sync` method for drift detection, following
the same pattern as AWS and DigitalOcean.

### Identifier fallback

The sync method extracts the resource identifier from existing state with a
fallback to globalArgs:

```typescript
const identifier = existing.name?.toString() ?? g["name"]?.toString();
```

This handles the post-delete case where stored state is
`{ identifier: "...", status: "deleted" }` without a `name` field.

### Full resource name in sync

For `{+name}` resources, sync constructs the full name using
`buildResourceName()` from parent and short name, following the same pattern as
get and delete.

### Not-found marker

When the resource no longer exists, sync writes:

```typescript
{
  status: "not_found",
  syncedAt: "2026-03-08T12:00:00.000Z",
}
```

---

## 13a. List Factory Method

Resources with a `list` (or `aggregatedList` / `listAll`) method in the
Discovery Document gain a `list` factory method that paginates through the list
endpoint and writes one data artifact per returned item.

### When the list method is generated

A resource gets a `list` method when **both** conditions are met:

1. `methodConfigs.list` exists (the Discovery Document has a list-like method)
2. `listResponseArrayField` is set (the list response schema has a top-level
   array property whose items are objects, not primitives)

Resources where the list endpoint is `aggregatedList` with a nested-map response
(e.g., Compute `networkEdgeSecurityServices`) do not get a list method because
the response array field detection finds no top-level object array.

### List metadata extraction

During `buildGcpParsedResource()`, two additional fields are populated:

- **`listQueryParams`** — query parameters from the list method (excluding
  pagination internals like `pageToken`, deprecated parameters, and API-wide
  params like `alt`, `key`, `fields`). Each entry has `name`, `type`,
  `description`, and `required`.
- **`listResponseArrayField`** — the property name in the list response that
  contains the resource array (e.g., `"files"` for Drive, `"items"` for
  Compute). Only arrays whose items have `type: "object"` or `properties` are
  considered — this filters out primitive arrays like `unreachables`. When
  multiple candidate arrays exist, a priority-based heuristic selects the field:
  (1) the property whose name matches the resource path's last segment
  (case-insensitive), (2) `"items"` as a common convention, (3) the first
  candidate encountered.

### Generated method shape

```typescript
list: {
  description: "List <resource> resources",
  arguments: z.object({
    // One optional argument per list query param (filter, q, pageSize, etc.)
    filter: z.string().describe("...").optional(),
    maxResults: z.number().describe("...").optional(),
    // Control pagination depth
    maxPages: z.number().describe("Maximum number of pages to fetch (default: 10)").optional(),
  }),
  execute: async (args, context) => {
    // 1. Build params from globalArgs (project, parent/zone) + method args
    // 2. Call listResources(BASE_URL, LIST_CONFIG, params, arrayField, maxPages)
    // 3. Write each item as a separate data artifact named by primary identifier
    // 4. Return { dataHandles: [...], result: { count, nextPageToken } }
  },
}
```

### Runtime helper

The `listResources()` function in `_lib/gcp.ts` paginates through the list
endpoint and collects all items:

```typescript
listResources(baseUrl, config, params, arrayField, maxPages?)
  → { items: any[], nextPageToken?: string }
```

Unlike `readViaList()` (which searches for a single item by filter),
`listResources()` returns the full collection. It appends `fields=*` only when
the caller hasn't supplied their own `fields` parameter.

### Data artifact naming

Each returned item becomes a data artifact named by its primary identifier field
(e.g., `id` for Drive files, `name` for Compute instances). Names are sanitized
with `wrapWithSanitize()` to comply with the data artifact naming contract.
Items without a primary identifier fall back to their array index.

### Fan-out pattern

The list method enables the swamp fan-out pattern: list resources, then
reference individual results via CEL:

```bash
swamp model method run my-drive list --input q='"FOLDER_ID" in parents'
# Each file becomes a data artifact accessible via:
# data.latest("my-drive", "<file-name>").attributes.modifiedTime
```

### Factory-aware CRUD methods

The `update` and `sync` methods accept an optional `identifier` argument that
targets a specific data artifact by name — typically one discovered by `list`.
When `identifier` is omitted, the methods fall back to `g.name ?? "current"`
(the original behavior). When provided, instance name resolution becomes
`g.name ?? identifier ?? "current"`, allowing in-place management of
list-discovered resources without creating separate model instances.

This completes the fan-out lifecycle: list → discover → manage in-place:

```bash
# 1. Discover resources
swamp model method run my-instances list

# 2. Update a specific discovered instance
swamp model method run my-instances update --input identifier="instance-2"

# 3. Sync a specific discovered instance
swamp model method run my-instances sync --input identifier="instance-2"

# 4. Delete a specific discovered instance (identifier was already required)
swamp model method run my-instances delete --input identifier="instance-2"
```

The `delete` method already required an `identifier` argument and used it for
both the API call and artifact naming (`g.name ?? identifier`), so no change was
needed there.

---

## 14. Zod Schema Generation

Each generated model contains three Zod schemas. The Zod generation reuses the
shared `src/codegen/zodGenerator.ts` — GCP properties are normalized to
`CfProperty` format before being passed to the generator.

### GlobalArgsSchema — full fidelity input validation

Preserves all Discovery Document constraints:

- String enums → `z.enum(["a", "b"])`
- `minLength`/`maxLength` → `z.string().min(n).max(n)`
- `pattern` → `z.string().regex(new RegExp(...))`
- `minimum`/`maximum` → `z.number().min(n).max(n)`
- `integer` → `z.number().int()`
- Nested objects extracted to top-level named schemas (from `title` field)

Required fields are non-optional; everything else gets `.optional()`.

### StateSchema — simplified response parsing

No constraints, `.passthrough()`. Primary identifier fields are non-optional;
everything else is `.optional()`.

### InputsSchema

Mirrors GlobalArgsSchema but with all fields `.optional()`.

### Schema name collision avoidance

Same as AWS: the internal state schema is named `StateSchema`. If an extracted
schema collides with that name, it's renamed to `_StateSchema`.

### Lint directives

- `no-explicit-any` — always added (context parameter)
- `no-control-regex` — conditionally added when regex patterns contain control
  character escapes (same detection as AWS)

---

## 15. Post-Create Read-Back

After a create operation (which returns an LRO), the generated code does a GET
to read the actual resource state. This requires the GET path parameters, which
may differ from the INSERT path parameters.

### Extra parameter population

The generator compares GET's `parameterOrder` against INSERT's. Any parameter in
GET but not INSERT is pre-populated before calling `createResource`:

- Last GET parameter (resource identifier): set from `globalArgs.name` or via
  `buildResourceName` for `{+name}` resources
- Other GET parameters: set from globalArgs

Example — Compute firewalls:

- INSERT needs: `[project]`
- GET needs: `[project, firewall]`
- Generated: `params["firewall"] = String(g["name"])`

---

## 16. Versioning and Change Detection

Uses the same shared CalVer system as AWS, Hetzner, and DigitalOcean (see
`src/pipeline/version.ts`). Per-service manifest versioning matches the AWS
pattern.

### Idempotency

Running the pipeline twice with no schema changes produces `0 changed` models.

---

## 17. Generated Output Structure

```
outputs/gcp/
├── compute/
│   ├── manifest.yaml
│   └── extensions/
│       └── models/
│           ├── _lib/
│           │   └── gcp.ts
│           ├── instances.ts
│           ├── firewalls.ts
│           ├── networks.ts
│           └── ...
├── container/
│   ├── manifest.yaml
│   └── extensions/
│       └── models/
│           ├── _lib/
│           │   └── gcp.ts
│           └── clusters.ts
├── serviceusage/
│   ├── manifest.yaml
│   └── extensions/
│       └── models/
│           ├── _lib/
│           │   └── gcp.ts
│           └── services.ts
└── ...  (260 services total)
```

### Model export shape

```typescript
export const model = {
  type: "@swamp/gcp/compute/instances",  // unique type identifier
  version: "2026.03.27.1",              // CalVer
  globalArguments: GlobalArgsSchema,     // Zod: create/update args
  inputsSchema: InputsSchema,           // Zod: optional overrides
  resources: {
    state: {
      description: "...",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,
    },
  },
  methods: {
    create: { ... },                     // if insert handler exists; waitForReady arg if readiness detected
    get: { ... },                        // if read handler exists
    update: { ... },                     // if update/patch handler exists; waitForReady arg if readiness detected
    delete: { ... },                     // if delete handler exists
    sync: { ... },                       // always present
    // Action methods (if non-CRUD methods exist)
    start: { ... },
    stop: { ... },
    set_machine_type: { ... },
  },
};
```

### Shared lib (`_lib/gcp.ts`)

Exports: `createResource`, `readResource`, `readViaList`, `tryReadResource`,
`updateResource`, `deleteResource`, `isResourceNotFoundError`, `getProjectId`

Key behaviors:

- Full credential chain (inline JSON, file path, ADC)
- gcloud CLI presence check on first use
- URL construction from Discovery path templates
- Automatic `fields=*` on all read operations (see below)
- Three LRO detection patterns (Compute, generic, GKE)
- Optional readiness polling after create/update
- Concurrency control field injection in updates
- `tryReadResource` returns null on 404/403

### Automatic `fields=*` on read operations

GCP Discovery Documents define `fields` as a global query parameter (at
`doc.parameters`, not per-method) that controls partial responses. Many GCP APIs
— notably Drive, Gmail, Calendar, Sheets, and other Workspace APIs — return only
a minimal set of fields by default. Without `fields=*`, the response contains a
tiny subset of the resource, creating a mismatch with the full `StateSchema`
declared by the generated model.

The shared lib appends `fields=*` to every read operation URL (`readResource`,
`readViaList`, `tryReadResource`, and all post-LRO/readiness-polling read-backs
in `createResource` and `updateResource`). This ensures the API returns the
complete resource, matching the model's declared schema. The `pollOperation`
function is excluded — LRO status endpoints do not accept the `fields`
parameter.

If the URL already contains a `fields=` parameter (e.g., set explicitly by the
caller), the automatic injection is skipped, preserving user-specified
projections.

### Naming conventions

| Aspect      | Convention                                           | Example                          |
| ----------- | ---------------------------------------------------- | -------------------------------- |
| File name   | Resource path joined with `_`, lowercased            | `instances.ts`, `global_hubs.ts` |
| Model slug  | Resource path joined with `-`, lowercased            | `instances`, `global-hubs`       |
| Type string | `@swamp/gcp/{service}/{slug}`                        | `@swamp/gcp/compute/instances`   |
| Description | From Discovery Document schema or method description | "An Instance resource..."        |

---

## 18. Enrichments

Enrichments add non-schema-derived capabilities to generated models. The
enrichment source is real, type-checkable TypeScript (`.enrich.ts` files) that
is parsed and inlined at generation time. This keeps the codegen pipeline
schema-faithful while allowing per-resource extensions.

See the [AWS design doc](aws.md) for the original enrichment pattern (read-path
enrichment via `enrichState`). GCP extends this pattern with a method injection
insertion point for adding new action methods.

### File structure

```
codegen/gcp/enrichments/
├── types.ts                                        # GcpEnrichment interface
├── parser.ts                                       # parseEnrichmentSource()
├── parser_test.ts                                  # Parser tests
├── index.ts                                        # Registry: getEnrichment(), getServiceEnrichmentImports()
├── cloudidentity-groups-memberships.ts             # Metadata
├── cloudidentity-groups-memberships.enrich.ts      # Real TypeScript source
├── cloudresourcemanager-projects.ts                # Metadata
├── cloudresourcemanager-projects.enrich.ts         # Real TypeScript source
├── serviceaccounts.ts                              # Metadata
├── serviceaccounts.enrich.ts                       # Real TypeScript source
├── storage-buckets.ts                              # Metadata
└── storage-buckets.enrich.ts                       # Real TypeScript source
```

### Insertion points

The GCP extension model generator has four insertion points for enrichment:

1. **Imports** — SDK imports from the `.enrich.ts` file, added after helper
   imports. The `request()` function is also imported from `_lib/gcp.ts` when
   enrichment is present.
2. **Body** — schemas and helper code, inlined between `GlobalArgsSchema` and
   `StateSchema`.
3. **StateSchema fields** — extra Zod fields inside the `StateSchema` object
   (not used by the current enrichment).
4. **Methods** — additional method definitions spread into the model's `methods`
   object after the action method loop: `...iamBindingMethods,`.

### Creating a new enrichment

1. Create `<resource>.enrich.ts` with exported schemas/functions and a methods
   object.
2. Create `<resource>.ts` metadata file registering the `GcpEnrichment`.
3. Import and add to the `ENRICHMENTS` array in `index.ts`.
4. Regenerate the affected service.

### Current enrichments

| Resource                           | Methods                                                   | Description                                                                                                                                                          |
| ---------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `cloudidentity.groups.memberships` | `set_members`                                             | Authoritative group membership reconciliation — add missing, remove strays                                                                                           |
| `iam.serviceAccounts`              | `add_iam_binding`, `remove_iam_binding`, `manage_account` | Granular IAM binding management on service accounts via read-modify-write with etag; deterministic create-or-adopt lifecycle by email with safe 404/409/403 handling |
| `storage.buckets`                  | `add_iam_binding`, `remove_iam_binding`                   | Granular IAM binding management via read-modify-write with etag concurrency                                                                                          |

---

## 19. Differences from AWS, Hetzner, and DigitalOcean

| Aspect              | GCP                                                 | AWS                                                     | Hetzner / DigitalOcean        |
| ------------------- | --------------------------------------------------- | ------------------------------------------------------- | ----------------------------- |
| Schema source       | Discovery Documents (~300 JSON files)               | CloudFormation zip (JSON per resource type)             | Single OpenAPI spec           |
| API style           | Direct REST with Discovery path templates           | CloudControl (unified CRUD)                             | REST (per-resource endpoints) |
| $ref resolution     | Simple name lookups within same document            | JSON Pointer with `@apidevtools/json-schema-ref-parser` | OpenAPI `$ref` paths          |
| Resource discovery  | Recursive resource tree walk                        | CF schema handlers field                                | OpenAPI path grouping         |
| Output structure    | Per-service directories (260 packages)              | Per-service directories (244 packages)                  | Single package                |
| URL patterns        | `{+name}` (1533) + individual params (505)          | CloudControl handles all                                | Simple REST paths             |
| Identifier type     | Usually `name` (string)                             | Always string                                           | `id`, `name`, `uuid`, `ip`    |
| LRO handling        | 3 patterns (Compute, generic, GKE)                  | Poll `GetResourceRequestStatus`                         | Not applicable                |
| Readiness polling   | Auto-detected from status enums                     | Not applicable                                          | Not applicable                |
| Concurrency control | fingerprint/etag auto-carried in updates            | Not applicable (JSON Patch)                             | Not applicable                |
| Action methods      | Auto-collected from non-CRUD Discovery methods      | Not applicable                                          | Discriminator-based (DO)      |
| Enrichments         | Per-resource `.enrich.ts` files (see §18)           | Per-resource `.enrich.ts` files (see AWS design doc)    | Not applicable                |
| Update mechanism    | PUT/PATCH with body from update-specific properties | JSON Patch (RFC 6902)                                   | PUT (Hetzner) / PATCH (DO)    |
| Property provenance | Tracked (insert vs update properties)               | Not needed (single property set)                        | Create-only tracked (DO)      |
| Auth                | Service account JSON, file path, or ADC             | SDK default credential chain                            | API token env var             |
| Manual overrides    | `SKIP_APIS` (3 entries)                             | `IGNORE_SCHEMAS` (5 entries)                            | 5 override tables (DO)        |
| Scope deduplication | projects/orgs/folders → single model                | Not applicable                                          | Not applicable                |
