# @swamp/typesafe-ai

Use [TypeSafe](https://typesafe.ai) System One models from swamp. TypeSafe's
flagship model, Jev, does not generate text. It takes application state plus
typed questions and returns calibrated answers: a probability for a yes/no
question (Noul), a selected option with a full distribution (Choice), or a
weighted position along an ordered rubric (Score). This extension wraps the
`POST /v1/systemone` endpoint as a swamp model so workflows can ask those
questions and branch on the stored answers with CEL.

## Installation

```sh
swamp extension pull @swamp/typesafe-ai
```

## Credentials

Store your API key in a vault and reference it from the definition. Never paste
the key into a definition file or a shell command line.

```sh
swamp vault create local_encryption typesafe --json
echo "$TYPESAFE_API_KEY" | swamp vault put typesafe TYPESAFE_API_KEY --json

swamp model create @swamp/typesafe-ai jev \
  --global-arg 'apiKey=${{ vault.get("typesafe", "TYPESAFE_API_KEY") }}'
```

If `apiKey` is omitted the model falls back to the `TYPESAFE_API_KEY`
environment variable, which is convenient for local experiments.

## Usage

Ask one yes/no question and store the probability of yes:

```sh
swamp model method run jev noul \
  --input state="Help! My payouts have been failing for 3 days." \
  --input instructions="Does this convey urgency?" \
  --input yes="Explicitly time-sensitive" \
  --input no="No urgency expressed" \
  --input name=urgency
```

Pick one option from a set. Structured inputs take the `:json` suffix, or
`@path` to read a JSON file:

```sh
swamp model method run jev choice \
  --input state="Help! My payouts have been failing for 3 days." \
  --input instructions="Which team should handle this?" \
  --input 'criteria:json={"billing":"Payments, invoicing, refunds","technical":"Bugs, outages","sales":null}'
```

Rate along an ordered rubric:

```sh
swamp model method run jev score \
  --input state="Help! My payouts have been failing for 3 days." \
  --input instructions="How frustrated is the customer?" \
  --input 'criteria:json=["Calm","Frustrated","Very angry"]'
```

Ask several independent questions about one state in a single request. This is
the cheapest and fastest way to use TypeSafe; questions run in parallel and
cannot see each other's answers.

```sh
swamp model method run jev ask \
  --input 'state:json={"ticket":{"subject":"Duplicate charge","body":"I was charged twice for order A-104."}}' \
  --input questions=@questions.json
```

where `questions.json` is:

```json
{
  "is_refund_request": {
    "type": "noul",
    "instructions": "Is the customer asking for a refund?"
  },
  "department": {
    "type": "choice",
    "instructions": "Which team should handle this?",
    "criteria": {
      "billing": "Payments and refunds",
      "technical": "Bugs and outages"
    }
  },
  "frustration": {
    "type": "score",
    "instructions": "How frustrated is the customer?",
    "criteria": ["Calm", "Frustrated", "Very angry"]
  }
}
```

List the models available to your account:

```sh
swamp model method run jev models
```

## Stored data and CEL

Each method writes one resource. The instance name is the spec name plus the
`name` argument (default `latest`), so several evaluations can live side by
side.

| Method   | Spec         | Instance            | Key attributes                                   |
| -------- | ------------ | ------------------- | ------------------------------------------------ |
| `noul`   | `noul`       | `noul-<name>`       | `noul` (0 to 1)                                  |
| `choice` | `choice`     | `choice-<name>`     | `choice`, `probabilities`, `confidence`          |
| `score`  | `score`      | `score-<name>`      | `score`, `legend`, `probabilities`, `confidence` |
| `ask`    | `evaluation` | `evaluation-<name>` | `answers.<id>.*` for every question              |
| `models` | `models`     | `models`            | `models[]`, `count`                              |

Every evaluation resource also records `model`, `state`, `usage`, and
`evaluatedAt`. Reference answers from a workflow guard or a later step:

```yaml
- name: escalate
  guard: ${{ data.latest("jev", "noul-urgency").attributes.noul > 0.8 }}
```

```yaml
- name: route
  guard: ${{ data.latest("jev", "evaluation-latest").attributes.answers.department.choice == "billing" }}
```

## Global arguments

| Argument     | Default                   | Purpose                                                 |
| ------------ | ------------------------- | ------------------------------------------------------- |
| `apiKey`     | `$TYPESAFE_API_KEY`       | Bearer token; use a vault reference                     |
| `model`      | `jev-latest`              | Model for every call; methods accept a `model` override |
| `baseUrl`    | `https://api.typesafe.ai` | API root, for proxies or test servers                   |
| `timeoutMs`  | `30000`                   | Per-attempt HTTP timeout                                |
| `maxRetries` | `2`                       | Retries on 408/429/5xx/529 and connection errors        |

## How it works

The model calls the TypeSafe HTTP API directly with `fetch`; no SDK is bundled.
Failed requests throw before any data is written, so a workflow step fails
cleanly. Retries use exponential backoff and honour `Retry-After`. The
`api-key-configured` pre-flight check (label `policy`) verifies a key is
available before any evaluation runs.

For guidance on writing good questions, see the
[TypeSafe primitives docs](https://docs.typesafe.ai/primitives) and the
[question design guidance](https://docs.typesafe.ai/concepts/how-to-build-with-system-one).

## License

This extension is part of swamp-extensions and is licensed under the GNU
Affero General Public License v3 with the Swamp Extension and Definition
Exception. See `LICENSE.txt`.
