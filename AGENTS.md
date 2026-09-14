# Project: swamp-extensions

First-party and generated extensions for swamp — cloud provider models, vault
backends, and datastore backends.

## Workflows

In this repository the word "workflow" — including "create/run/execute/validate/
debug workflow", "automate", "orchestrate", and "automated/nightly job" — refers
to a swamp workflow: a declarative YAML DAG of model-method steps authored via
`swamp workflow create`. This is swamp's own first-class concept, and it is the
default meaning here. Do NOT interpret workflow requests as agent orchestration
tasks (task lists, worktrees, cron/scheduled agents, subagents, etc.). Only use
your agent harness's native task or orchestration tools when the user explicitly
names that mechanism (e.g. "task list", "subagent", "worktree", "cron",
"remote agent") or explicitly asks you to do the work yourself step by step
rather than author a swamp workflow.

## Rules

- **Never hand-edit files under `model/`.** They are auto-generated. Fix the
  codegen pipeline in `codegen/<provider>/` and regenerate instead.
- Only touch what's necessary — don't refactor adjacent code.
- TypeScript strict mode, no `any` types in hand-written code (generated code
  may use `any`).
- Named exports only, no default exports.
- Pin all npm dependencies to exact versions (no ranges).
- `deno.lock` is committed — run `deno install --frozen` to verify.

## Testing Rules

- Never rely on live cloud services in tests.
- Use local HTTP servers (`Deno.serve({ port: 0 })`) or in-memory mock clients.
- Restore all env vars in a `finally` block.
- Tests that create SDK clients with connection pooling need
  `sanitizeResources: false` with a comment explaining why.
- Use `@systeminit/swamp-testing` conformance helpers
  (`assertVaultExportConformance`, `assertDatastoreExportConformance`, etc.).
- Canonical test example: `vault/aws-sm/extensions/vaults/aws_sm_test.ts`

## Commands

### Vault / Datastore extensions (run from extension directory)

```bash
cd vault/aws-sm  # or datastore/s3, etc.
deno check extensions/<type>/*.ts
deno lint extensions/<type>/
deno fmt extensions/<type>/
deno test <flags> extensions/<type>/
deno install --frozen
```

### Code generation (run from codegen/)

```bash
cd codegen
deno task fetch-schema:aws
deno task fetch-schema:gcp
deno task fetch-schema:hetzner
deno task fetch-schema:digitalocean
deno task generate:aws
deno task generate:gcp
deno task generate:hetzner
deno task generate:digitalocean
```

AWS and GCP support service filtering: `deno task generate:aws ec2 s3 lambda`

```bash
deno task generate:aws-credentials
```

Generates shared AWS credential utilities (IMDS skip, error classification,
preflight check) into hand-written extension directories from the canonical
source at `codegen/shared/awsCredentials.ts`. Generated files are
auto-generated — do not hand-edit.

**Note:** AWS and GCP models live under `model/aws/<service>/` and
`model/gcp/<service>/` (one directory per service, ~249 AWS / ~260 GCP).
Hetzner and DigitalOcean each have a single directory. Each service directory
has its own `deno.json`, `deno.lock`, and `manifest.yaml`.

### Benchmarks (run from datastore/benchmarks/)

```bash
cd datastore/benchmarks
deno task benchmark:s3    # S3 benchmarks against MinIO
deno task benchmark:gcs   # GCS benchmarks against fake-gcs-server
deno task benchmark:compare  # Cross-version comparison (defaults to S3)
```

Requires Docker for emulators, or set `BENCHMARK_S3_ENDPOINT` and
`BENCHMARK_GCS_ENDPOINT` to use pre-running instances.

### Codegen verification (run from codegen/)

```bash
deno check main.ts
deno lint
deno fmt
```

After regenerating, review the diffs in `model/` to confirm only the intended
changes appear. Run generation a second time to verify idempotency — there
should be zero new diffs on the second run.

### Codegen architecture

Each provider has a pipeline in `codegen/<provider>/` with:

- `pipeline.ts` — schema fetching and model generation orchestration
- `extensionModelGenerator.ts` — TypeScript model file generation
- `libGenerator.ts` — shared library file generation

Shared code in `codegen/shared/` handles:

- `schema/` — schema loading, normalization, property splitting, and types
- `zodGenerator.ts` — CfProperty → Zod schema code generation
- `denoConfigGenerator.ts` — generated `deno.json` files
- `manifestGenerator.ts` — generated `manifest.yaml` files
- `version.ts` — CalVer versioning with content-based change detection
- `awsCredentials.ts` — canonical AWS credential utilities (IMDS skip, error
  classification, preflight check); generated into hand-written extensions via
  `generate:aws-credentials` and inlined into generated models via
  `libGenerator.ts`

Design documents explain each provider's schema-to-model mapping decisions:

- [AWS](codegen/designs/aws.md) — CloudFormation schema → CloudControl models
- [GCP](codegen/designs/gcp.md) — Cloud Asset Inventory schema → GCP models
- [Hetzner Cloud](codegen/designs/hetzner.md) — OpenAPI → Hetzner models
- [DigitalOcean](codegen/designs/digitalocean.md) — OpenAPI → DigitalOcean models

**Read the relevant design doc before modifying a provider's codegen pipeline.**

## Pull Requests

This repo is hosted on Forgejo at `git.swamp-club.com`. Use the `fgj` CLI
(not `gh`) for all PR operations:

```bash
fgj pr create -R swamp-club/swamp-extensions -B main -H <branch> -t "title" -b "body"
```

Do not use `gh` — it targets GitHub, which is not the upstream for this repo.

## Publishing

CI auto-publishes when `manifest.yaml` changes on main and the version is newer
than what's in the registry. Manual: `swamp extension push manifest.yaml` from
the extension directory.
