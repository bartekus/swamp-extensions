# @swamp/aws-sm

Swamp vault provider backed by
[AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/). Stores,
retrieves, deletes, and lists secrets through the AWS SDK v3, using the default
AWS credential chain for authentication.

## Installation

```sh
swamp extension pull @swamp/aws-sm
```

## Configuration

| Key       | Required | Description                                                    |
| --------- | -------- | -------------------------------------------------------------- |
| `region`  | yes      | AWS region holding the secrets, e.g. `us-east-1`                |
| `profile` | no       | Named AWS profile from `~/.aws/config` or `~/.aws/credentials`  |

Credentials are never stored in config. With no `profile`, they are resolved via
the standard AWS credential chain:

- Environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`
- AWS profile: `~/.aws/credentials`
- IAM role attached to the instance, task, or pod

### Pinning a vault to a named profile

Set `profile` when the default chain would resolve the wrong account — for
example when engineers on a team use different profile names locally:

```bash
swamp vault create @swamp/aws-sm my-aws-sm \
  --config '{"region": "us-east-1", "profile": "Developer-xero-ps-sre-test"}' --json
```

A configured `profile` **takes precedence over environment-variable
credentials**: the vault reads that profile from the shared config files and
does not consult `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` or `AWS_PROFILE`
at all. That is the point of the option — a pinned vault should not change
identity because of an exported variable. Without `profile`, nothing changes:
the default chain applies exactly as before.

The profile is resolved on the first vault operation, not at creation time, so a
misspelled profile name surfaces when the vault is first used:

```
Vault AWS profile 'typo-profile' was not found in ~/.aws/config or
~/.aws/credentials: check the profile name in the vault config, or run
'aws configure list-profiles' to see the profiles available.
```

Profiles that assume a role (`source_profile` + `role_arn`) and SSO profiles are
supported. Profiles using `credential_process` may not work — that path shells
out to an external command, which is unreliable under Deno's npm compatibility
layer.

The calling principal must have the following IAM permissions on the target
secrets:

- `secretsmanager:GetSecretValue`
- `secretsmanager:PutSecretValue`
- `secretsmanager:CreateSecret`
- `secretsmanager:ListSecrets`
- `secretsmanager:DescribeSecret`
- `secretsmanager:UpdateSecret`
- `secretsmanager:TagResource`
- `secretsmanager:DeleteSecret`
- `secretsmanager:UntagResource`

## Usage

Create a vault bound to a specific region:

```bash
swamp vault create @swamp/aws-sm my-aws-sm \
  --config '{"region": "us-east-1"}' --json
```

Read, write, delete, and list secrets:

```bash
swamp vault get my-aws-sm my/secret/name --json
swamp vault put my-aws-sm my/secret/name "s3cr3t" --json
swamp vault delete my-aws-sm my/secret/name --json
swamp vault list-keys my-aws-sm --json
```

## Deletion

`swamp vault delete` schedules the secret for deletion using the default 30-day
recovery window. The secret can be restored via the AWS console or CLI within
that period. The secret name cannot be reused until the recovery window expires.

## Annotations

Attach metadata to secrets via `swamp vault annotate` and inspect it with
`swamp vault inspect`. Annotation fields map to native AWS primitives:

| Field    | AWS primitive                                          |
| -------- | ------------------------------------------------------ |
| `notes`  | Secret `Description` field                             |
| `labels` | Resource tags (key-value pairs)                        |
| `url`    | Secret `Description` field (trailing `swamp:url=` line) |

The `url` is stored in the `Description` rather than a tag because AWS tag
values reject characters such as `?` and `&`, which are common in URLs with
query strings. Annotations created before this change kept the `url` in a
`swamp:url` tag; that tag is still read for backwards compatibility.

```bash
swamp vault annotate my-aws-sm API_KEY \
  --url https://console.aws.amazon.com/iam \
  --note "Production API key" \
  --label env=prod --label team=infra

swamp vault inspect my-aws-sm API_KEY --json
```

## Observability

The extension emits [OpenTelemetry](https://opentelemetry.io/) spans for vault
operations (get, put, list, delete, and annotation CRUD). Spans are no-ops when
no `TracerProvider` is configured in the host process. When swamp is running with
OTel enabled, vault activity appears in traces with attributes following OTel
semantic conventions (secret key, vault name, RPC method).

## Tag-on-create

When `swamp vault put` passes tags, they are included in the
`CreateSecretCommand` as native AWS resource tags. This allows secrets to be
created in accounts with strict IAM tag-on-create policies
(`aws:RequestTag` condition keys) that would otherwise deny tagless
`CreateSecret` calls.

Tags are only applied during secret creation. If the secret already exists,
the `put` updates the value via `PutSecretValue` and the tags parameter is
ignored. To tag an existing secret, use `swamp vault annotate --label`.

## Secret key format

Secret keys map directly to AWS Secrets Manager secret names, including
path-style names such as `myapp/production/db-password`. A `put` against a
non-existent secret will create it on demand.

## License

AGPLv3 — see [LICENSE.txt](./LICENSE.txt) for details.
