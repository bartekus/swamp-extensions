# AWS Provider Design

## 1. Purpose

Clover's AWS provider reads the CloudFormation Resource Provider schemas and
generates a set of swamp extension models — one per CloudFormation resource
type. Each model is a self-contained TypeScript file that exports a `model`
object with Zod schemas and CRUD methods. A shared `_lib/aws.ts` file provides
the CloudControl API client, retry logic, polling, and CRUD helpers.

Unlike the Hetzner and DigitalOcean providers (which use REST APIs with
provider-specific HTTP clients), the AWS provider uses the
[CloudControl API](https://docs.aws.amazon.com/cloudcontrolapi/latest/userguide/what-is-cloudcontrolapi.html)
— a single unified API that provides CRUD operations for all CloudFormation
resource types. This means one helper library works for all 1300+ resource
types.

**Output**: `outputs/aws/{service}/` — one directory per AWS service,
containing:

- `extensions/models/*.ts` — one file per resource type (e.g., `instance.ts`,
  `vpc.ts`)
- `extensions/models/_lib/aws.ts` — shared CloudControl helpers
- `manifest.yaml` — extension package manifest

**How to run**:

```sh
deno task fetch-schema:aws    # download CloudFormation schemas
deno task generate:aws        # generate models from the local schemas
```

The pipeline is orchestrated by `src/commands/generateModels.ts`, which calls
`generateAwsModels()` from the pipeline, writes all files per service, runs
`deno fmt`, and reports changes.

---

## 2. Schema Source

The schemas are fetched from the CloudFormation schema registry:

```
https://schema.cloudformation.us-east-1.amazonaws.com/CloudformationSchema.zip
```

The zip contains one JSON file per resource type (e.g.,
`aws-ec2-instance.json`). The pipeline extracts all `aws-*` files, applies
fixes, and consolidates them into `schemas/cf-schema.json`.

### Schema pre-processing

1. **Reference fix**: CloudFormation schemas use `resource-schema.json#` as a
   base URI for `$ref` pointers. This is replaced with `#` to make pointers
   self-referential within each schema.

2. **Special-case patch**: The EC2 VerifiedAccessTrustProvider schema has a
   problematic `SseSpecification` definition that causes dereferencing issues.
   It is removed during extraction.

3. **Sorting**: Schemas are sorted by `typeName` for deterministic output.

### $ref dereferencing

After loading `cf-schema.json`, each schema is dereferenced using
`@apidevtools/json-schema-ref-parser`. During dereferencing, the `onDereference`
callback stamps each resolved reference with a `title` derived from its
definition name. This title is used later by the Zod generator to create named
extracted schemas (e.g., `TagSchema`, `BlockDeviceMappingSchema`).

Circular references are handled by the parser's `circular: "ignore"` option.

### What gets skipped

| Schema                                 | Reason                             |
| -------------------------------------- | ---------------------------------- |
| `AWS::DynamoDB::Table`                 | `oneOf` array without title        |
| `AWS::KinesisAnalyticsV2::Application` | Unsupported string regexp pattern  |
| `AWS::SMSVOICE::PhoneNumber`           | Unsupported string regexp pattern  |
| `AWS::SMSVOICE::Pool`                  | Unsupported string regexp pattern  |
| `AWS::MediaConnect::Flow`              | Unsupported number format: `int32` |
| Non-`AWS::` / non-`Alexa::` schemas    | Not AWS resources                  |
| Schemas without a `read` handler       | CF-only resources with no read API |

The `read` handler requirement ensures every generated model can retrieve
current state after creation. Without it, the CRUD pattern is incomplete.
Approximately 201 schemas are skipped for lacking a read handler.

---

## 3. Resource Discovery

### CloudFormation handler-based discovery

Unlike the Hetzner and DigitalOcean providers (which discover resources from
OpenAPI path analysis), the AWS provider discovers resources from the
CloudFormation schema's `handlers` field. Each CF schema declares which CRUD
handlers the resource supports:

```json
{
  "handlers": {
    "create": { "permissions": ["ec2:RunInstances", ...] },
    "read": { "permissions": ["ec2:DescribeInstances", ...] },
    "update": { "permissions": ["ec2:ModifyInstanceAttribute", ...] },
    "delete": { "permissions": ["ec2:TerminateInstances", ...] },
    "list": { "permissions": ["ec2:DescribeInstances", ...] }
  }
}
```

A resource is included if it has at least a `read` handler. The generated model
includes only the methods for which handlers exist:

| Handler  | Generated method |
| -------- | ---------------- |
| `create` | `create`         |
| `read`   | `get`            |
| `update` | `update`         |
| `delete` | `delete`         |
| `list`   | `list`           |

### Per-service grouping

Resources are grouped by the second segment of the CloudFormation type name:

| Type name                 | Service  | Resource file       | Model slug       |
| ------------------------- | -------- | ------------------- | ---------------- |
| `AWS::EC2::Instance`      | `ec2`    | `instance.ts`       | `instance`       |
| `AWS::EC2::SecurityGroup` | `ec2`    | `security_group.ts` | `security-group` |
| `AWS::S3::Bucket`         | `s3`     | `bucket.ts`         | `bucket`         |
| `AWS::Lambda::Function`   | `lambda` | `function.ts`       | `function`       |

Each service produces an independent publishable extension package:
`@swamp/aws/ec2`, `@swamp/aws/s3`, `@swamp/aws/lambda`, etc.

### Why per-service splitting

A single `@swamp/aws` package with 1300+ models would be impractical:

- Users typically work with a handful of services, not all of AWS
- Individual service packages can be versioned independently
- Smaller packages are faster to install and load
- Aligns with how AWS itself organizes services

### What AWS doesn't need

Unlike the Hetzner and DigitalOcean providers, there is no:

- **Path-based resource discovery** — resources come from CF schemas, not URLs
- **Action methods** — CloudControl handles all operations uniformly
- **Sub-resource methods** — each CF type is a standalone resource
- **Response envelope unwrapping** — CloudControl returns JSON properties
  directly
- **HTTP method precedence** — all operations go through CloudControl commands

---

## 4. Property Splitting

### Domain vs resource properties

The pipeline splits each CF schema's properties into two sets:

**Domain properties** (writable): Properties the user provides when creating or
updating a resource. Read-only properties are excluded. These become the
`GlobalArgsSchema`.

**Resource properties** (all): Every property the API returns, including
read-only fields like `Arn`, `VpcId`, etc. These become the `StateSchema`.

```typescript
function splitAwsProperties(schema, onlyProperties) {
  domainProperties = pruneProperties(schema.properties, readOnlySet);
  resourceValueProperties = schema.properties; // ALL properties
  return { domainProperties, resourceValueProperties };
}
```

### Why resource schema includes everything

AWS CloudControl's `GetResource` returns all properties — both writable inputs
and read-only outputs. The resource schema must accept all of them. If it only
included writable properties, read-only fields like `InstanceId` or `Arn` would
be silently dropped during parsing.

### Property classification from CF schema

CloudFormation schemas declare property classifications using JSON Pointer
arrays:

| CF schema field        | Meaning                                       |
| ---------------------- | --------------------------------------------- |
| `readOnlyProperties`   | Set by AWS after creation (e.g., `Arn`, `Id`) |
| `createOnlyProperties` | Can only be set at creation (e.g., `ImageId`) |
| `writeOnlyProperties`  | Not returned in read (e.g., `Password`)       |
| `primaryIdentifier`    | Fields that uniquely identify the resource    |

These JSON Pointer paths (e.g., `/properties/InstanceId`) are normalized to
simple field names (`InstanceId`) by `normalizeOnlyProperties()`.

### Create-only property handling

Properties in `createOnlyProperties` can be set during creation but not changed
via update. The update method passes these to `updateResource()` which filters
them from the JSON patch:

```typescript
const rawPatch = jsonpatch.compare(currentState, desiredState);
const patch = rawPatch.filter((op) => {
  const topLevelProp = op.path.split("/")[1];
  return !createOnlySet.has(topLevelProp);
});
```

This prevents CloudControl from rejecting update requests that attempt to modify
immutable properties.

---

## 5. Identifying Field Resolution

### Primary identifier from CF schema

Every CloudFormation schema declares a `primaryIdentifier` — one or more JSON
Pointer paths that uniquely identify the resource:

```json
{ "primaryIdentifier": ["/properties/BucketName"] }
{ "primaryIdentifier": ["/properties/VpcId"] }
{ "primaryIdentifier": ["/properties/RouteTableId", "/properties/CidrBlock"] }
```

### Single vs composite identifiers

Most resources have a single primary identifier field. Some have composite
identifiers — multiple fields that together form the unique key. The
CloudControl API requires composite identifiers to be joined with `|`:

```
RouteTableId|CidrBlock → "rtb-123|0.0.0.0/0"
PublicIp|AllocationId → "1.2.3.4|eipalloc-abc"
```

The update method handles this by extracting all identifier fields from existing
state and joining them:

```typescript
const idParts = [
  existing.RouteTableId?.toString(),
  existing.CidrBlock?.toString(),
];
const identifier = idParts.join("|");
```

### Identifier types are always strings

Unlike DigitalOcean (which uses numeric IDs, UUIDs, names, and IPs), the
CloudControl API always accepts and returns identifiers as strings. The `get`
and `delete` methods always take `identifier: z.string()`.

### Why no identifier map is needed

CloudFormation schemas explicitly declare primary identifiers — no guessing or
mapping is required. This eliminates the need for DigitalOcean's
`IDENTIFIER_MAP`, `ENDPOINT_IDENTIFIER_OVERRIDES`, and fallback logic.

---

## 6. Factory Pattern and Instance Naming

Every model uses a **factory pattern**: a single model definition can manage
multiple instances of the same resource type. Each instance is identified by a
name, enabling CEL expressions like:

```
data.latest("prod-vpc", "prod-vpc").attributes.VpcId
```

### `resolveNamingField`: preference order

1. **Writable primary identifier** — if the primary identifier field is writable
   (not read-only) and exists in the schema properties, use it directly.
   Example: `BucketName` for S3 Bucket, `KeyPairName` for EC2 KeyPair.
2. **Synthetic `name`** — if the primary identifier is read-only (e.g.,
   `InstanceId`, `VpcId`) or composite, inject a synthetic `name` field into
   GlobalArgs.

### Why most AWS resources use synthetic names

Unlike Hetzner and DigitalOcean (where most resources have a `name` field), most
AWS resources use read-only identifiers assigned by AWS (e.g., `i-0abc123`,
`vpc-0def456`). The user doesn't choose these values — AWS generates them.
Consequently, most AWS models use synthetic names.

Examples:

| Resource          | Primary ID    | Read-only? | Naming field |
| ----------------- | ------------- | ---------- | ------------ |
| EC2 Instance      | `InstanceId`  | Yes        | Synthetic    |
| EC2 VPC           | `VpcId`       | Yes        | Synthetic    |
| EC2 KeyPair       | `KeyPairName` | No         | Natural      |
| S3 Bucket         | `BucketName`  | No         | Natural      |
| EC2 SecurityGroup | `GroupId`     | Yes        | Synthetic    |
| EC2 EIP           | Composite     | —          | Synthetic    |

### How instance names flow through methods

| Method   | Instance name source                                                                        |
| -------- | ------------------------------------------------------------------------------------------- |
| `create` | Natural: `result.{field} ?? g.{field}`, Synthetic: `g.name ?? "current"`                    |
| `get`    | Natural: `result.{field} ?? globalArgs.{field}`, Synthetic: `globalArgs.name ?? identifier` |
| `update` | Natural: `g.{field} ?? "current"`, Synthetic: `g.name ?? "current"`                         |
| `delete` | `args.identifier` (uses the identifier as the instance name for the deletion record)        |

### Synthetic name exclusion from API calls

When a synthetic `name` field is used, it is excluded from the `desiredState`
sent to the CloudControl API:

```typescript
for (const [key, value] of Object.entries(g)) {
  if (key === "name") continue; // synthetic — not an AWS property
  if (value !== undefined) desiredState[key] = value;
}
```

This prevents sending an unknown `name` property that would cause the API to
reject the request.

---

## 7. CloudControl API Interaction

### Why CloudControl instead of service-specific APIs

The CloudControl API is a single unified API that provides CRUD for all
CloudFormation resource types. This means one helper library (`_lib/aws.ts`)
works for all 1300+ resource types, instead of generating service-specific HTTP
clients with custom request/response handling for each service.

### Operation flow

**Create**: `CreateResourceCommand` with serialized desired state → poll
`GetResourceRequestStatus` until terminal → `GetResourceCommand` to read the
created resource's properties.

**Read**: `GetResourceCommand` with type name and identifier → parse the
`Properties` JSON string from the response.

**Update**: `GetResourceCommand` to read current state → compute JSON patch
between current and desired state → filter create-only properties from the patch
→ `UpdateResourceCommand` with the patch document → poll until terminal →
`GetResourceCommand` to read the updated resource.

**Delete**: `DeleteResourceCommand` with type name and identifier → poll until
terminal → return `{ existed: true }`. If the resource is already gone, return
`{ existed: false }`.

### JSON patch for updates

CloudControl updates use
[RFC 6902 JSON Patch](https://datatracker.ietf.org/doc/html/rfc6902) rather than
full state replacement. The pipeline uses `fast-json-patch` to compute the diff
between current and desired state:

```typescript
const rawPatch = jsonpatch.compare(currentState, desiredState);
```

Create-only properties are filtered from the patch before sending. If no patch
operations remain after filtering, the update is skipped and current state is
returned.

### Retry and polling

**Retry**: All CloudControl commands are wrapped in `withRetry()` which retries
on throttling errors with exponential backoff + jitter. Up to 20 attempts with
delays from 1s to 90s.

**Polling**: Async operations (create, update, delete) return a request token.
`pollOperationStatus()` polls `GetResourceRequestStatus` up to 60 times with
exponential backoff until the operation reaches a terminal state (`SUCCESS`,
`FAILED`, or `CANCEL_COMPLETE`).

### Error handling

| Error type          | Detection                                  | Behavior                    |
| ------------------- | ------------------------------------------ | --------------------------- |
| Throttling          | `Throttling`, `TooManyRequests` in message | Retry with backoff          |
| Not found (read)    | `was not found`, `does not exist`          | Throw error                 |
| Not found (delete)  | Same patterns                              | Return `{ existed: false }` |
| Operation failed    | `FAILED` status from poll                  | Throw with status message   |
| Operation cancelled | `CANCEL_COMPLETE` from poll                | Throw with message          |

### Client configuration

The CloudControl client resolves the AWS region in priority order: explicit
`region` global argument, `AWS_REGION` environment variable,
`AWS_DEFAULT_REGION` environment variable, the active AWS profile's `region`
from `~/.aws/config` (respecting `AWS_PROFILE` and `AWS_CONFIG_FILE`), then
`us-east-1` as a final fallback. AWS credentials are resolved by the SDK's
default credential chain (environment variables, shared credentials file,
instance profiles, etc.).

---

## 8. Sync Method

Every generated model includes a `sync` method for drift detection. Unlike `get`
(which requires the resource identifier as an argument), `sync` reads the
identifier from stored state, making it zero-arg and suitable for automated
workflows.

### How sync works

1. Read the instance name from `globalArgs` (same as `update`)
2. Load existing state via `context.dataRepository.getContent()`
3. Extract the identifier from existing state (handles composite IDs by joining
   with `|`, same as `update`)
4. Call `readResource(typeName, identifier)` in a try/catch
5. On success: write refreshed state to `"state"` resource
6. On `isResourceNotFoundError`: write a `not_found` marker instead of throwing

### Not-found marker

When the resource no longer exists in AWS, sync writes:

```typescript
{
  identifier: "vpc-0abc123",
  status: "not_found",
  syncedAt: "2026-03-08T12:00:00.000Z",
}
```

This allows workflows to detect drift without catching exceptions.

### Exported `isResourceNotFoundError`

The `_lib/aws.ts` helper exports `isResourceNotFoundError()` so that sync
methods can catch 404-equivalent errors from CloudControl. The function detects
`ResourceNotFoundException`, `"was not found"`, and `"does not exist"` patterns.

### Composite identifier handling

Sync handles composite identifiers the same way as `update` — extracting all
primary identifier fields from existing state and joining with `|`:

```typescript
const idParts = [
  existing.RouteTableId?.toString(),
  existing.CidrBlock?.toString(),
];
const identifier = idParts.join("|");
```

---

## 8½. List Method

Every generated model with a `list` handler in its CloudFormation schema
includes a `list` method backed by CloudControl's `ListResourcesCommand`. This
enables resource discovery without knowing identifiers upfront — the `list` +
`get` combination provides the import workflow: `list` discovers what exists,
`get` fetches full state for each resource.

### How list works

1. Call `listResources()` from `_lib/aws.ts` with the resource's type name
2. Paginate via `NextToken` up to `maxPages` (default 10, user-configurable)
3. Deduplicate results by `Identifier` (handles parent-scoped listing that may
   return duplicates across parent resources)
4. Parse `Properties` JSON when present in the response
5. Write each result as a `"state"` resource keyed by the primary identifier
   (sanitized: slashes, `..`, null bytes replaced)
6. Include `_identifier` in each state record so it can be passed directly to
   `get` for full-state import
7. Return `{ dataHandles, result: { count, nextPageToken } }`

### Arguments

| Argument        | Type              | Description                                                 |
| --------------- | ----------------- | ----------------------------------------------------------- |
| `maxPages`      | `number` optional | Pagination ceiling (default 10). Prevents cardinality traps |
| `resourceModel` | `string` optional | JSON resource model for parent-scoped listing               |

### Sparse list results

CloudControl `ListResources` often returns only the primary identifier — no
properties beyond the ID. This differs from GCP, where list responses include
full resource properties. For AWS, the state written by `list` may be sparse;
callers should follow up with `get` for full state when needed.

### Parent-scoped resources

Some resources require a parent identifier to list. For example:

- `AWS::EC2::Route` needs `ResourceModel: {"RouteTableId": "rtb-123"}`
- `AWS::ECS::Service` needs `ResourceModel: {"Cluster": "arn:..."}`
- `AWS::EKS::Nodegroup` needs `ResourceModel: {"ClusterName": "my-cluster"}`

The `resourceModel` argument accepts a JSON string with the parent identifier.
The generated method does not auto-discover parent values — that requires
cross-model orchestration beyond the single-model scope.

### Unsupported list handlers

Some resource types declare a `list` handler in the CF schema but CloudControl
raises `UnsupportedActionException` at runtime. The `listResources()` helper
catches this and throws a clear error:
`"<TypeName> does not support listing via
CloudControl. The resource type has no LIST handler."`.

### Truncation reporting

When the pagination ceiling is reached before all results are fetched, the
return value includes `nextPageToken` (the CloudControl `NextToken`). This
provides honest truncation reporting — a capped listing that includes
`nextPageToken` tells the caller more data exists. A listing without
`nextPageToken` is complete.

### Throttling

`listResources()` uses the same `withRetry()` wrapper as all CRUD operations.
The throttling detection includes `"Rate exceeded"` — a bare-message throttling
pattern that CloudControl uses in addition to standard `ThrottlingException`.

### Enrichment override

When an enrichment provides a `listMethod` for a resource (e.g., RDS DBCluster
uses the native `DescribeDBClusters` SDK call for richer list results), the
enrichment list method takes priority over the generated CloudControl-based one.
The generator checks `input.listMethod` before emitting the generated list
block.

### Import workflow

The `list` + `get` combination replaces the need for a separate `adopt` method
(as Hetzner provides). The workflow is:

1. Call `list` to discover resource identifiers in a region
2. Call `get` with each identifier to fetch full state and import under
   management
3. The resource is now tracked — `sync`, `update`, and `delete` work on it

This matches GCP's pattern, where `list` + `get` provides the same capability.

---

## 8a. Native SDK Enrichment

CloudControl returns a unified property set for every resource type, but some
resources have runtime data that CloudControl/CloudFormation omits by design.
The enrichment mechanism lets the pipeline inject native SDK, CLI, or HTTP fetch
calls into specific models to supplement the CloudControl state.

### How it works

Each enrichment is a folder containing a config file and source files:

```
codegen/aws/enrichments/
├── types.ts                        # AwsEnrichment interface
├── index.ts                        # Registry: getEnrichment() + helpers
├── parser.ts                       # Thin wrapper over shared sourceParser
├── rds-dbcluster/
│   ├── config.ts                   # Metadata: cfTypeName, npmImports, stateFields
│   ├── enrich.ts                   # enrichState function + schemas
│   └── list.enrich.ts              # list method function
└── cfn-stackset/
    ├── config.ts                   # Metadata: cfTypeName, npmImports, customMethods
    ├── methods.ts                  # Custom method functions
    └── methods_test.ts             # Tests
```

Source files are real, type-checkable TypeScript — `deno check` validates them
independently. They export Zod schemas and functions.

The config file (`config.ts`) exports an `AwsEnrichment` object with:

- `cfTypeName` — the CloudFormation type to enrich
- `npmImports` — additional deno.json entries for the service
- `sourceFile` — path to the `.enrich.ts` source file
- `functionExport` — name of the enrichState function export
- `stateFields` — extra fields added inside StateSchema

At generation time, `parseEnrichmentSource()` reads the `.enrich.ts` file,
extracts SDK imports and the body (with `export` keywords stripped), and the
generator inlines everything into the model file. The output is self-contained —
no extra directories or imports beyond the standard `_lib/aws.ts`.

### Graceful degradation

Every `enrichState()` function wraps its work in a try/catch that returns
unmodified state on failure. This means:

- Missing IAM permissions for the native API → CloudControl state still works
- Throttled enrichment calls → CloudControl state still works
- The enrichment fields are optional in StateSchema

### Strategies

The interface is strategy-agnostic. Three patterns are supported:

| Strategy | When to use                                | Example                                               |
| -------- | ------------------------------------------ | ----------------------------------------------------- |
| SDK      | Service has an `@aws-sdk/client-*` package | RDS DBCluster members via `DescribeDBClustersCommand` |
| CLI      | Data only available via `aws` CLI          | `Deno.Command("aws", ...)`                            |
| Fetch    | Data available via HTTP endpoint           | `fetch("http://...")`                                 |

### Adding a new enrichment

1. Create `codegen/aws/enrichments/<resource>/` directory
2. Create `config.ts` — export an `AwsEnrichment` object with `cfTypeName`,
   `npmImports`, and whichever capabilities apply
   (`sourceFile`/`functionExport`/ `stateFields` for enrichState, `listMethod`,
   `customMethods`)
3. Create source files (`enrich.ts`, `list.enrich.ts`, `methods.ts`) as needed
4. Add the import to `codegen/aws/enrichments/index.ts`
5. Run `deno check` on the source files to verify they type-check
6. Run `deno task generate:aws <service>` and verify the output
7. Run a second time to confirm idempotency

### Current enrichments

| Resource              | Strategy | Data added                                                |
| --------------------- | -------- | --------------------------------------------------------- |
| `AWS::RDS::DBCluster` | SDK      | `DBClusterMembers` with instance class, AZ, writer status |

### List method enrichment

State enrichments augment the output of `get`/`sync`. A **list method
enrichment** adds a `list` method to the generated model, enabling resource
discovery without knowing identifiers upfront.

Unlike GCP (which has a uniform Discovery API with consistent pagination), AWS
services each have their own SDK clients and pagination schemes. List methods
therefore live entirely in the enrichment source file — there is no shared
pagination helper in `_lib/aws.ts`.

#### Interface

The `AwsEnrichment` type accepts an optional `listMethod` field:

```typescript
listMethod?: {
  sourceFile: string;       // Path to list .enrich.ts file
  functionExport: string;   // Name of the list function
  argumentFields: string[]; // Zod field lines for method arguments
  description: string;      // Method description
}
```

#### Source file requirements

1. Must `deno check` independently (same as state enrichments)
2. Owns all pagination logic (Marker-based, NextToken-based, etc.)
3. Transforms SDK responses to CloudFormation property names (PascalCase) so
   list results are compatible with StateSchema and subsequent `sync` calls
4. Returns `Record<string, unknown>[]` — one entry per discovered resource

#### How it's emitted

The generator:

1. Skips list method imports when the package is already imported by the state
   enrichment (avoids duplicate identifiers)
2. Inlines the list function body after the state enrichment body
3. Emits a `list` method that calls the function, iterates results, and writes
   each as a `"state"` resource handle keyed by the primary identifier

#### Adding a new list enrichment

1. Create `codegen/aws/enrichments/<resource>/list.enrich.ts`
2. Add `listMethod` to the resource's `config.ts` (or create a new
   `AwsEnrichment` entry if no enrichment exists for this resource)
3. Run `deno check` on the source file
4. Run `deno task generate:aws <service>` and verify output
5. Run a second time to confirm idempotency

#### Current list enrichments

| Resource              | SDK command          | Pagination | Data returned                             |
| --------------------- | -------------------- | ---------- | ----------------------------------------- |
| `AWS::RDS::DBCluster` | `DescribeDBClusters` | Marker     | Cluster ID, engine, status, members, tags |

---

## 8b. Custom Methods (Standalone Native-SDK Methods)

While `enrichState` (section 8a) augments the state returned by `get`/`sync`,
**custom methods** add entirely new standalone methods to a generated model.
They are backed by native AWS SDKs (not CloudControl) and operate independently
of the CRUD lifecycle.

Custom methods are part of the enrichment system — configured via the optional
`customMethods` field on `AwsEnrichment`. An enrichment config can provide
`enrichState`, `listMethod`, `customMethods`, or any combination.

### Architecture

```
codegen/shared/sourceParser.ts              — shared source parser
codegen/aws/enrichments/
  types.ts                                  — AwsEnrichment (includes customMethods)
  index.ts                                  — registry (getEnrichment)
  parser.ts                                 — thin wrapper over sourceParser
  rds-dbcluster/                            — enrichState + listMethod
    config.ts, enrich.ts, list.enrich.ts
  cfn-stackset/                             — customMethods only
    config.ts, methods.ts, methods_test.ts
```

### How custom methods differ from enrichState

| Aspect             | enrichState                          | customMethods                            |
| ------------------ | ------------------------------------ | ---------------------------------------- |
| Purpose            | Augment state on `get`/`sync`        | Add standalone methods                   |
| Credential access  | Env vars / default chain             | Explicit `(args, credentials)` signature |
| Source files       | One per function                     | Single file, multiple exports            |
| Generator location | Wraps `readResource` in `get`/`sync` | New method blocks after `list`           |

### Function signature convention

Every custom method function receives two arguments:

```typescript
async function listInstances(
  args: Record<string, unknown>,  // method args merged with globalArgs
  credentials: AwsCredentials,     // from _buildCredentials(context.globalArgs)
): Promise<Record<string, unknown>[]> { ... }
```

The generator emits `const mergedArgs = { ...context.globalArgs, ...args }` so
method functions can read both resource-level context (e.g. `StackSetName` from
globalArgs) and method-specific arguments (e.g. `operationId`).

### Adding custom methods to an enrichment

1. Create `codegen/aws/enrichments/<resource>/config.ts` with the
   `AwsEnrichment` config — set `customMethods.sourceFile` and
   `customMethods.methods`
2. Create `codegen/aws/enrichments/<resource>/methods.ts` with all function
   exports
3. Register in `codegen/aws/enrichments/index.ts`
4. Run `deno task generate:aws <service>` to regenerate

### Current custom methods

| Resource                        | Methods                                                               | SDK                                     |
| ------------------------------- | --------------------------------------------------------------------- | --------------------------------------- |
| `AWS::CloudFormation::StackSet` | `listInstances`, `listOperations`, `describeOperation`, `detectDrift` | `@aws-sdk/client-cloudformation`        |
| `AWS::Bedrock::KnowledgeBase`   | `retrieve`                                                            | `@aws-sdk/client-bedrock-agent-runtime` |
| `AWS::Events::EventBus`         | `put_events`                                                          | `@aws-sdk/client-eventbridge`           |

---

## 9. Zod Schema Generation

Each generated model contains three Zod schemas. The Zod generation is shared
with Hetzner and DigitalOcean via `codegen/shared/zodGenerator.ts`.

### GlobalArgsSchema — full fidelity input validation

Used for create/update arguments. Preserves all CloudFormation constraints:

- String enums → `z.enum(["a", "b"])`
- `minLength`/`maxLength` → `z.string().min(n).max(n)`
- `pattern` → `z.string().regex(new RegExp(...))`
- Integer enums → `z.union([z.literal(1), z.literal(2)])`
- `minimum`/`maximum` → `z.number().min(n).max(n)`
- `integer` → `z.number().int()`
- Nested objects with typed properties and per-field optionality

Required fields (from `cfSchema.required`) are non-optional; everything else
gets `.optional()`.

### StateSchema — simplified response parsing

Used to parse CloudControl API responses. **No constraints, `.passthrough()`**:

- All types are bare: `z.string()`, `z.number()`, `z.boolean()`
- No enums, no min/max, no patterns
- Primary identifier fields are non-optional; everything else is `.optional()`
- `.passthrough()` on the object to allow unknown fields

### Why the distinction

**Input schemas validate user-provided data** — strict constraints prevent bad
API calls. **State schemas parse API responses** — the API may return data that
doesn't match creation constraints (e.g., a deprecated enum value, a field
widened server-side). Applying creation-time constraints to response parsing
would cause false rejections.

### InputsSchema

Mirrors GlobalArgsSchema but with all fields `.optional()`. Used for the swamp
inputs mechanism where partial overrides are provided separately from
globalArgs.

### Extracted schemas

The Zod generator extracts nested object types into top-level named schemas when
they have a `title` from the CF schema. This avoids deep inline nesting and
allows reuse:

```typescript
export const TagSchema = z.object({
  Key: z.string(),
  Value: z.string(),
});

const GlobalArgsSchema = z.object({
  Tags: z.array(TagSchema).optional(),
});
```

### Schema name collision avoidance

The internal state schema is named `StateSchema` rather than `ResourceSchema` to
avoid collisions with extracted schemas. Some CloudFormation types have nested
objects titled "Resource" which would produce an extracted `ResourceSchema`. If
an extracted schema named `StateSchema` exists, the internal schema is renamed
to `_StateSchema`.

### PCRE to JavaScript regex conversion

CloudFormation schemas use PCRE patterns. The `pcreToRegexp()` utility converts
these to JavaScript-compatible `RegExp` patterns, handling PCRE flags (`(?i)`,
`(?m)`, `(?s)`), non-capturing groups, and other PCRE-specific syntax.

Some schemas produce regex patterns containing control character escapes (e.g.,
`\x00`). The generator detects these and adds `no-control-regex` to the
file-level lint ignore directive. Detection strips `.describe()` strings first
to avoid false positives from documentation text that mentions control character
ranges.

### Property normalization: multi-type arrays (`json` type)

CloudFormation schemas sometimes declare properties with multiple types, e.g.
`type: ["string", "object"]` for policy documents that accept JSON strings on
write but are returned as parsed objects on read. The normalizer
(`codegen/shared/schema/normalize.ts`) collapses these to a single internal
type:

- `["string", "object"]` → `json`
- `["string", "boolean"]` → `boolean`
- `["string", "integer"]` → `integer`
- `["string", "number"]` → `number`
- `["string", "array"]` → `array`

The `json` type is then emitted differently depending on the schema context:

- **InputsSchema / GlobalArgsSchema** (write side): `z.string()` — users supply
  JSON as a string when creating or updating resources.
- **StateSchema** (read side):
  `z.union([z.string(), z.record(z.string(), z.unknown())])` — AWS CloudControl
  returns these properties as already-deserialized objects.

This affects services like S3 (BucketPolicy), IAM (Role), SQS (Queue), SNS
(Subscription), KMS, SSM, and others with JSON policy document fields.

### Property normalization: `oneOf`/`anyOf` handling

CloudFormation schemas use `oneOf` and `anyOf` for polymorphic properties. The
normalizer handles these by:

1. **`oneOf` with objects**: Merge all branch properties into a single object
   (union of fields)
2. **`oneOf` with arrays**: Extract the array variant
3. **`oneOf` with empty objects**: Fall back to `z.string()` (normalized as
   `json` type)
4. **`anyOf` with titled objects**: Create named properties from each branch
5. **`anyOf` with non-objects**: Fall back to `z.string()`

---

## 10. Versioning and Change Detection

The AWS pipeline uses the same shared CalVer versioning system as Hetzner and
DigitalOcean (see `codegen/shared/version.ts`).

### CalVer format

Versions use calendar versioning: `YYYY.MM.DD.micro` (e.g., `2026.03.08.2`).

- The date prefix is computed from the current date
- The micro version starts at 1 for new files
- If the date matches the existing version's date, micro is incremented
- If the date is different, micro resets to 1

### Content normalization for comparison

Before comparing, the pipeline:

1. Formats the candidate code with `deno fmt` (ensures whitespace differences
   don't cause false changes)
2. Replaces the version string in both existing and candidate with a placeholder
3. Compares the normalized strings

### Per-service manifest versioning

Each service's manifest versions independently. A manifest is only written when
at least one model in that service has changed. Release notes list which models
were added or updated.

### Idempotency

Running the pipeline twice with no spec changes produces identical output — no
git diff. The version is content-based: same content → same version regardless
of when the pipeline runs.

---

## 11. Generated Output Structure

```
outputs/aws/
├── ec2/
│   ├── manifest.yaml
│   └── extensions/
│       └── models/
│           ├── _lib/
│           │   └── aws.ts
│           ├── instance.ts
│           ├── vpc.ts
│           ├── security_group.ts
│           ├── subnet.ts
│           └── ...
├── s3/
│   ├── manifest.yaml
│   └── extensions/
│       └── models/
│           ├── _lib/
│           │   └── aws.ts
│           └── bucket.ts
├── lambda/
│   ├── manifest.yaml
│   └── extensions/
│       └── models/
│           ├── _lib/
│           │   └── aws.ts
│           └── function.ts
└── ...  (244 services total)
```

### Model export shape

Every model file exports `const model = { ... }` with:

```typescript
export const model = {
  type: "@swamp/aws/ec2/instance",       // unique type identifier
  version: "2026.03.08.2",               // CalVer
  globalArguments: GlobalArgsSchema,      // Zod: create/update args
  inputsSchema: InputsSchema,            // Zod: optional overrides
  resources: {
    state: {
      description: "EC2 Instance resource state",
      schema: StateSchema,
      lifetime: "infinite",
      garbageCollection: 10,              // minutes
    },
  },
  methods: {
    create: { ... },                      // if create handler exists
    get: { ... },                         // if read handler exists
    update: { ... },                      // if update handler exists
    delete: { ... },                      // if delete handler exists
    sync: { ... },                        // always present
    list: { ... },                        // if list handler exists
  },
};
```

### Shared lib (`_lib/aws.ts`)

Exports: `createResource`, `readResource`, `updateResource`, `deleteResource`,
`listResources`

Key behaviors:

- CloudControl client accepts optional explicit credentials; falls back to the
  AWS SDK default credential chain. Region resolved via: explicit global arg >
  `AWS_REGION` > `AWS_DEFAULT_REGION` > `~/.aws/config` profile region >
  `us-east-1`
- All commands use exponential backoff + jitter retry on throttling
- Async operations (create, update, delete) poll until terminal state
- Update computes JSON patch internally, filtering create-only properties
- Delete returns `{ existed: false }` for already-deleted resources
- No response envelope unwrapping needed (CloudControl returns JSON properties)

The same `_lib/aws.ts` file is written into every service directory. The content
is identical across services — it's a static helper, not service-specific.

### Authentication and credential global arguments

Every generated model includes four optional credential global arguments
injected by `extensionModelGenerator.ts`:

| Field             | Sensitive | Overrides env var                                     | Description                             |
| ----------------- | --------- | ----------------------------------------------------- | --------------------------------------- |
| `accessKeyId`     | yes       | `AWS_ACCESS_KEY_ID`                                   | AWS access key ID                       |
| `secretAccessKey` | yes       | `AWS_SECRET_ACCESS_KEY`                               | AWS secret access key                   |
| `sessionToken`    | yes       | `AWS_SESSION_TOKEN`                                   | Session token for temporary credentials |
| `region`          | no        | `AWS_REGION` / `AWS_DEFAULT_REGION` / `~/.aws/config` | AWS region (defaults to `us-east-1`)    |

**Precedence**: explicit global argument > `AWS_REGION` > `AWS_DEFAULT_REGION` >
`~/.aws/config` profile region > `us-east-1` fallback. Credentials follow the
SDK default chain. Users can wire these with `vault.get(...)` expressions in
their model YAML:

```yaml
globalArgs:
  accessKeyId: ${{ vault.get(my-vault, aws-access-key) }}
  secretAccessKey: ${{ vault.get(my-vault, aws-secret-key) }}
  region: us-west-2
```

**Sensitive handling**: `accessKeyId`, `secretAccessKey`, and `sessionToken` are
emitted with `z.meta({ sensitive: true })` in both `GlobalArgsSchema` and
`InputsSchema`. Swamp core auto-redacts sensitive fields in run logs, reports,
and data storage. `region` is not sensitive — it's a plain region name.

**Collision guard**: if a CloudFormation resource has a domain property whose
name collides with a credential field name, the credential field is not injected
for that resource. This mirrors the Hetzner provider's `hasTokenProp` guard.
Collisions are extremely unlikely since CF properties use PascalCase (e.g.,
`AccessKeyId`) while the credential fields are camelCase.

**Credential filtering**: the `create` and `update` methods iterate over
`globalArgs` to build the `desiredState` sent to CloudControl. Credential keys
are filtered out of this loop via a `_credentialKeys` set — they are auth
config, not resource properties. A `_buildCredentials` helper extracts the
credential fields into an `AwsCredentials` object that is passed to each lib
CRUD function.

**No credential validation**: unlike Hetzner (which validates the token by
hitting `GET /locations`), the AWS provider does not pre-validate credentials.
The AWS SDK already throws clear errors for bad credentials, and an STS
`GetCallerIdentity` call would add latency and an extra SDK dependency.

**Upgrade diffing**: the credential field names are added to `newFieldNames` in
`pipeline.ts` so the upgrade differ sees them. Without this, a regeneration
after the fields appear in committed models would emit spurious "Removed"
upgrade entries.

**Known limitation**: hand-written list method enrichments (e.g.,
`codegen/aws/enrichments/rds-dbcluster-list.enrich.ts`) create their own SDK
clients and do not receive vault-expression credentials. This is tracked
separately from the credential injection feature.

### Naming conventions

| Aspect      | Convention                           | Example                         |
| ----------- | ------------------------------------ | ------------------------------- |
| File name   | PascalCase → snake_case from CF type | `security_group.ts`             |
| Model slug  | PascalCase → kebab-case from CF type | `security-group`                |
| Type string | `@swamp/aws/{service}/{slug}`        | `@swamp/aws/ec2/security-group` |
| Description | `{Service} {ResourceName}`           | `EC2 SecurityGroup`             |

### Manifest

```yaml
manifestVersion: 1
name: "@swamp/aws/ec2"
version: "2026.03.08.2"
description: "AWS EC2 infrastructure models"
labels:
  - aws
  - ec2
  - cloud
  - infrastructure
releaseNotes: |
  - Added: instance, vpc, security_group, ...
models:
  - instance.ts
  - vpc.ts
  - security_group.ts
  - ...
```

---

## 12. Lint Handling

### `no-explicit-any`

All generated models use `any` for the execute function's context parameter (the
swamp execution context type is not available as an import). Every file includes
`// deno-lint-ignore-file no-explicit-any`.

### `no-control-regex`

Some CloudFormation schemas define regex patterns containing control character
escapes (e.g., `\x00`, `\u0009`). The generator detects these by:

1. Joining all generated schema body content
2. Stripping `.describe("...")` strings (which may mention control characters in
   documentation text without actually using them in regex)
3. Checking for `\\x0N`, `\\x1N`, `\\u000N`, `\\u001N` patterns
   (double-backslash escapes that the RegExp engine interprets as control
   characters)

Only files with actual control character regex patterns get the
`no-control-regex` lint ignore. Files where these patterns appear only in
description strings do not get the ignore.

---

## 13. Differences from Hetzner and DigitalOcean

| Aspect                 | AWS                                               | Hetzner                            | DigitalOcean                                      |
| ---------------------- | ------------------------------------------------- | ---------------------------------- | ------------------------------------------------- |
| Schema source          | CloudFormation zip (JSON per resource type)       | Single OpenAPI JSON spec           | Single OpenAPI YAML spec (dereferenced)           |
| API style              | CloudControl (unified CRUD for all types)         | REST (per-resource HTTP endpoints) | REST (per-resource HTTP endpoints)                |
| Resource discovery     | CF schema `handlers` field                        | OpenAPI path noun grouping         | OpenAPI path grouping + multi-pass matching       |
| Output structure       | Per-service directories (244 packages)            | Single package                     | Single package                                    |
| Identifier type        | Always string                                     | Always numeric `id`                | `id`, `name`, `uuid`, `ip`                        |
| Primary identifier     | Declared in CF schema                             | Always `id`                        | Mapped via `IDENTIFIER_MAP`                       |
| Composite identifiers  | Supported (joined with `\|`)                      | Not applicable                     | Not applicable                                    |
| Update mechanism       | JSON Patch (RFC 6902)                             | Full PUT                           | PATCH preferred, PUT fallback                     |
| Create-only properties | Tracked and filtered from patches                 | Not tracked                        | Tracked and excluded from update body             |
| Naming field           | Writable primary ID or synthetic                  | `name` or `label` or synthetic     | `name` or `label` or synthetic                    |
| Action methods         | Not applicable                                    | Not applicable                     | Discriminator-based discovery                     |
| Sub-resource methods   | Not applicable                                    | Not applicable                     | Heuristic-based detection                         |
| List method            | CloudControl `ListResources` (handler-gated)      | `listAll()` helper (all resources) | Not generated                                     |
| Discovery methods      | Not applicable                                    | Not applicable                     | `/options` endpoint matching                      |
| Response handling      | Parse JSON from `Properties` string               | HTTP response + envelope unwrap    | HTTP response + envelope unwrap                   |
| Async operations       | Poll `GetResourceRequestStatus` until terminal    | Synchronous (API handles it)       | Synchronous (API handles it)                      |
| Retry logic            | Exponential backoff + jitter on throttling        | Not needed                         | Not needed                                        |
| Property normalization | `$ref` dereferencing + `oneOf`/`anyOf` merging    | Inline `$ref` + `allOf` merging    | `$ref` dereferencing + `oneOf`/`anyOf` flattening |
| Manual overrides       | `IGNORE_SCHEMAS` (5 entries)                      | None                               | 5 override tables                                 |
| Lint directives        | Conditional `no-control-regex`                    | Not needed                         | Not needed                                        |
| State schema name      | `StateSchema` (avoids extracted schema collision) | `ResourceSchema`                   | `ResourceSchema`                                  |
