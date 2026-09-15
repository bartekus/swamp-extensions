# Swamp Extensions

Official extensions for [swamp](https://github.com/systeminit/swamp).

## Vault Extensions

| Extension                              | Description                               | Dependencies                                 |
| -------------------------------------- | ----------------------------------------- | -------------------------------------------- |
| [`@swamp/1password`](vault/1password/) | 1Password vault provider via the `op` CLI | None (shells out to `op`)                    |
| [`@swamp/aws-sm`](vault/aws-sm/)       | AWS Secrets Manager vault provider        | `@aws-sdk/client-secrets-manager`            |
| [`@swamp/azure-kv`](vault/azure-kv/)   | Azure Key Vault vault provider            | `@azure/identity`, `@azure/keyvault-secrets` |

## Datastore Extensions

| Extension                                | Description                                                                  | Dependencies                         |
| ---------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------ |
| [`@swamp/s3-datastore`](datastore/s3/)   | Amazon S3 datastore with local cache sync and distributed locking            | `@aws-sdk/client-s3`                 |
| [`@swamp/gcs-datastore`](datastore/gcs/) | Google Cloud Storage datastore with local cache sync and distributed locking | None (GCS JSON REST API via `fetch`) |

## Workflow Extensions

| Extension                                                                    | Description                                                                                     | Dependencies                                                             |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [`@swamp/s3-datastore-bootstrap`](workflows/s3-bootstrap/)   | One-shot bootstrap that provisions an S3 bucket + least-privilege IAM policy and flips the current repo to `@swamp/s3-datastore`. | `@aws-sdk/client-s3`, `@aws-sdk/client-iam`, `@aws-sdk/client-sts` |
| [`@swamp/gcs-datastore-bootstrap`](workflows/gcs-bootstrap/) | One-shot bootstrap that provisions a GCS bucket + least-privilege custom IAM role and flips the current repo to `@swamp/gcs-datastore`. | None (GCS + IAM JSON REST APIs via `fetch`) |

Workflow extensions bundle a workflow YAML with one or more helper models so
a multi-step operation (like bootstrapping another extension) can be executed
end-to-end with a single `swamp workflow run`.

## CVE Extensions

| Extension                                        | Description                                                                                              | Dependencies |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------ |
| [`@swamp/cve/dirtyfrag`](cve/dirtyfrag/) | Detects and mitigates the Dirty Frag Linux privilege escalation (CVE-2026-43284 + CVE-2026-43500) | None (POSIX utilities + procfs/sysfs) |
| [`@swamp/cve/mini-shai-hulud`](cve/mini-shai-hulud/) | Scans deno.lock and package-lock.json for npm packages compromised in the May 2026 "Mini Shai-Hulud" supply chain attack (317 packages) | None |

## Container Image Extension

| Extension                                              | Description                                                                                                                                                                | Dependencies |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [`@swamp/container-image`](container-image/) | Build, run, and push container images via Docker, Podman, or Apple Containers. Supports OCI output format and multi-platform builds with digest capture. | None (shells out to `docker`/`podman`/`container`) |

## SSH Extension

| Extension                    | Description                                                                                                                                                          | Dependencies |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| [`@swamp/ssh`](ssh/) | Run commands, copy files, and open port forwards across a declared set of hosts over SSH. Supports OpenSSH ControlMaster and Tailscale transports with CEL-based host selectors. | None (shells out to `ssh`, `scp`) |

## Kubernetes Extension

| Extension                                    | Description                                                                                                   | Dependencies              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------- |
| [`@swamp/kubernetes`](kubernetes/) | Kubernetes operational toolkit — 15 model types covering pods, deployments, services, RBAC, storage, networking, autoscaling, batch jobs, and more. Includes 14 ready-to-run workflows for namespace debugging, security audits, RBAC analysis, cluster health, and operational diagnostics. | `@kubernetes/client-node` |

## AI Extensions

| Extension                                  | Description                                                                                                                                                  | Dependencies                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| [`@swamp/typesafe-ai`](typesafe-ai/) | Ask TypeSafe System One models (Jev) typed Noul, Choice, and Score questions and branch workflows on the calibrated answers stored as swamp resources. | None (TypeSafe REST API via `fetch`) |

## Model Extensions (Auto-Generated)

| Extension                                      | Description                         |
| ---------------------------------------------- | ----------------------------------- |
| [`@swamp/aws/*`](model/aws/)                   | AWS infrastructure models           |
| [`@swamp/cloudflare/*`](model/cloudflare/)     | Cloudflare infrastructure models    |
| [`@swamp/gcp/*`](model/gcp/)                   | Google Cloud infrastructure models  |
| [`@swamp/hetzner-cloud`](model/hetzner-cloud/) | Hetzner Cloud infrastructure models |
| [`@swamp/digitalocean`](model/digitalocean/)   | DigitalOcean infrastructure models  |

AWS, Cloudflare, and GCP models are published per-service (e.g.,
`@swamp/aws/ec2`, `@swamp/cloudflare/dns`, `@swamp/gcp/compute`). All model
extensions are auto-generated from provider schemas. See
[Code Generation](#code-generation) for how to regenerate them.

## Installation

Extensions are installed automatically when referenced in a swamp repository
(via [auto-resolution](https://github.com/systeminit/swamp/pull/725)), or
manually with:

```bash
# Vault extensions
swamp extension pull @swamp/1password
swamp extension pull @swamp/aws-sm
swamp extension pull @swamp/azure-kv

# Datastore extensions
swamp extension pull @swamp/s3-datastore
swamp extension pull @swamp/gcs-datastore

# Workflow extensions
swamp extension pull @swamp/s3-datastore-bootstrap
swamp extension pull @swamp/gcs-datastore-bootstrap

# CVE extensions
swamp extension pull @swamp/cve/dirtyfrag
swamp extension pull @swamp/cve/mini-shai-hulud

# SSH
swamp extension pull @swamp/ssh

# Kubernetes
swamp extension pull @swamp/kubernetes

# AI
swamp extension pull @swamp/typesafe-ai

# Model extensions
swamp extension pull @swamp/hetzner-cloud
swamp extension pull @swamp/digitalocean
swamp extension pull @swamp/aws/ec2
swamp extension pull @swamp/aws/s3
swamp extension pull @swamp/aws/lambda
# ... and ~249 other AWS services
swamp extension pull @swamp/cloudflare/dns
swamp extension pull @swamp/cloudflare/workers
swamp extension pull @swamp/cloudflare/r2
# ... and ~66 other Cloudflare services
```

## Usage

### Vault extensions

Create a vault using an extension type:

```bash
# 1Password
swamp vault create @swamp/1password my-vault --config '{"op_vault":"Private"}'

# AWS Secrets Manager
swamp vault create @swamp/aws-sm my-vault --config '{"region":"us-east-1"}'

# Azure Key Vault
swamp vault create @swamp/azure-kv my-vault --config '{"vault_url":"https://myvault.vault.azure.net/"}'
```

### Datastore extensions

Configure a datastore in `.swamp.yaml`:

```yaml
# Amazon S3
datastore:
  type: "@swamp/s3-datastore"
  config:
    bucket: my-bucket
    prefix: swamp-data
    region: us-east-1

# Google Cloud Storage
datastore:
  type: "@swamp/gcs-datastore"
  config:
    bucket: my-bucket
    prefix: swamp-data
```

Or set up interactively:

```bash
# S3
swamp datastore setup @swamp/s3-datastore \
  --config '{"bucket":"my-bucket","prefix":"swamp-data","region":"us-east-1"}'

# GCS
swamp datastore setup @swamp/gcs-datastore \
  --config '{"bucket":"my-bucket","prefix":"swamp-data"}'
```

### Workflow extensions

Run a packaged workflow by name. For the S3 datastore bootstrap:

```bash
swamp workflow run bootstrap-s3-datastore \
  --input bucket_name=my-swamp-state \
  --input region=us-east-1
```

The workflow's own README describes its inputs, prerequisites, and what it
provisions (e.g. [`workflows/s3-bootstrap/README.md`](workflows/s3-bootstrap/README.md)).

### Contributing

Swamp Extensions uses an **issue-driven contribution model**. We don't accept pull requests
from external contributors. This isn't about
gatekeeping; it's about supply chain security in the age of AI-generated code.
When AI agents can produce large, plausible-looking changes, the only way to
maintain quality and security is to tightly control the inputs to the
development process.

**Here's how it works:**

1. **You file an issue** —
   [bug reports and feature requests](https://github.com/systeminit/swamp-extensions/issues)
   are very welcome. Be as detailed as you like.
2. **We triage it** — A maintainer will start the triage workflow on the issue and Claude
   analyzes the report, confirms bugs by tracing through the codebase, and
   generates a detailed implementation plan right in the issue thread.
3. **We build it** — System Initiative engineers (with AI agents under our
   direct control) implement the plan, with full test coverage and code review.
4. **You get credit** — We're happy to include you as a co-author on any PR
   generated from your request.

This means you get the feature you asked for, maintained over time, without
having to worry about keeping a fork in sync. See
[CONTRIBUTING.md](CONTRIBUTING.md) for the full details.

## Development

Each extension is a standalone Deno package with its own `deno.json`, `deno.lock`,
`manifest.yaml`, and source under `extensions/`. All npm dependencies are pinned
to exact versions.

### Extension Patterns

**Vault extensions** live in `vault/<name>/extensions/vaults/<name>.ts` and
export a `vault` object with `configSchema`, `createProvider(name, config)` that
returns `{ get, put, list, getName }`. See `vault/aws-sm/` for the canonical
example.

**Datastore extensions** live in `datastore/<name>/extensions/datastores/<name>.ts`
with shared library code in `_lib/`. They export a `datastore` object with
`configSchema`, `createProvider(config)` that returns lock, verifier, and sync
service factories. See `datastore/s3/` for the canonical example.

**Model extensions** under `model/` are auto-generated — never edit by hand.
AWS models are structured as `model/aws/<service>/` (one directory per service,
~249 services). Cloudflare uses the same per-service layout (~69 services).
Hetzner and DigitalOcean each have a single directory.

**Workflow extensions** live in `workflows/<name>/` and list a workflow YAML
under `extensions/workflows/` plus any helper models under `extensions/models/`
in the manifest's `workflows:` and `models:` fields. Models referenced by the
workflow are auto-packaged at publish time. See `workflows/s3-bootstrap/` for
the canonical example.

### Running Checks

```bash
# From any extension directory:
cd vault/aws-sm  # or datastore/s3, workflows/s3-bootstrap, model/hetzner-cloud, etc.
deno check extensions/<type>/*.ts
deno lint extensions/<type>/
deno fmt extensions/<type>/
deno test <flags> extensions/<type>/
deno install --frozen
```

### Code Generation

Model extensions are regenerated from provider schemas:

```bash
cd codegen
deno task fetch-schema:aws
deno task fetch-schema:cloudflare
deno task fetch-schema:gcp
deno task fetch-schema:hetzner
deno task fetch-schema:digitalocean
deno task generate:aws
deno task generate:cloudflare
deno task generate:gcp
deno task generate:hetzner
deno task generate:digitalocean
```

AWS, Cloudflare, and GCP support service filtering:
`deno task generate:aws ec2 s3 lambda`
`deno task generate:cloudflare dns workers r2`

Generation is idempotent — versions only bump when content changes.

Design documents explain how each provider's schema is mapped to swamp models:
- [AWS](codegen/designs/aws.md)
- [Cloudflare](codegen/designs/cloudflare.md)
- [GCP](codegen/designs/gcp.md)
- [Hetzner Cloud](codegen/designs/hetzner.md)
- [DigitalOcean](codegen/designs/digitalocean.md)

## Publishing

```bash
cd vault/aws-sm     # or datastore/s3
swamp extension push manifest.yaml
```

CI auto-publishes when `manifest.yaml` changes on main and the version is new.

## License

Copyright (C) 2026 System Initiative, Inc.

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU Affero General Public License version 3 as published by
the Free Software Foundation, with the Swamp Extension and Definition Exception
(found in [COPYING-EXCEPTION](COPYING-EXCEPTION)).

See [COPYING](COPYING) for the full license text.
