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

/**
 * Swamp model for the TypeSafe System One API.
 *
 * Sends application state plus typed questions (Noul, Choice, Score) to a
 * System One model such as Jev and stores the calibrated answers as swamp
 * resources, so workflows can branch on them with CEL expressions like
 * `data.latest("<model>", "noul-latest").attributes.noul > 0.8`.
 *
 * @module
 */

import { z } from "npm:zod@4.3.6";
import {
  AnswerSchema,
  API_KEY_ENV,
  ChoiceCriteriaSchema,
  type ClientConfig,
  DEFAULT_BASE_URL,
  DEFAULT_MODEL,
  DescriptionSchema,
  type Entry,
  EntrySchema,
  listModels,
  ModelCardSchema,
  type Question,
  QuestionsSchema,
  ScoreCriteriaSchema,
  systemOne,
  type SystemOneResponse,
  UsageSchema,
} from "./_lib/client.ts";

// ---------------------------------------------------------------------------
// Global arguments
// ---------------------------------------------------------------------------

/** Connection settings shared by every method on a definition. */
export const GlobalArgsSchema = z.object({
  apiKey: z.string().min(1).meta({ sensitive: true }).optional().describe(
    'TypeSafe API key. Prefer a vault reference: ${{ vault.get("<vault>", "TYPESAFE_API_KEY") }}. ' +
      `Falls back to the ${API_KEY_ENV} environment variable when omitted.`,
  ),
  model: z.string().min(1).default(DEFAULT_MODEL).describe(
    "System One model that answers questions. Methods may override per call.",
  ),
  baseUrl: z.string().url().default(DEFAULT_BASE_URL).describe(
    "API root. Change only for a proxy or test server.",
  ),
  timeoutMs: z.number().int().positive().default(30_000).describe(
    "Per-attempt HTTP timeout in milliseconds.",
  ),
  maxRetries: z.number().int().min(0).max(10).default(2).describe(
    "Retries after the first attempt on 408/429/5xx/529 or connection errors.",
  ),
});

/** Resolved type of {@link GlobalArgsSchema}. */
export type GlobalArgs = z.infer<typeof GlobalArgsSchema>;

// ---------------------------------------------------------------------------
// Shared argument pieces
// ---------------------------------------------------------------------------

const InstanceNameSchema = z.string().regex(/^[a-z0-9][a-z0-9_-]{0,62}$/, {
  message: "name must be lowercase alphanumeric with hyphens or underscores",
}).default("latest").describe(
  "Suffix for the stored resource instance, so several evaluations can coexist. Defaults to 'latest'.",
);

const StateArg = EntrySchema.describe(
  "Content to evaluate: a string, or a JSON object/array of named fields. Pass JSON with --input state:json='{...}'.",
);

const InstructionsArg = EntrySchema.describe(
  "The judgment to make, as text or JSON structure.",
);

const ModelOverrideArg = z.string().min(1).optional().describe(
  "Override the definition's model for this call.",
);

/**
 * Parse a JSON string into a value so structured arguments can arrive as
 * `--input key=@file.json` or a plain string; non-strings pass through.
 */
export function parseJsonString(value: unknown): unknown {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

/** Arguments for the `ask` method. */
export const AskArgsSchema = z.object({
  state: StateArg,
  questions: z.preprocess(parseJsonString, QuestionsSchema).describe(
    "Map of question id to {type, instructions, criteria}. Pass with --input questions:json='{...}' or --input questions=@file.json.",
  ),
  model: ModelOverrideArg,
  name: InstanceNameSchema,
});

/** Arguments for the `noul` method. */
export const NoulArgsSchema = z.object({
  state: StateArg,
  instructions: InstructionsArg,
  yes: DescriptionSchema.optional().describe(
    "What a yes (value near 1) means.",
  ),
  no: DescriptionSchema.optional().describe("What a no (value near 0) means."),
  model: ModelOverrideArg,
  name: InstanceNameSchema,
});

/** Arguments for the `choice` method. */
export const ChoiceArgsSchema = z.object({
  state: StateArg,
  instructions: InstructionsArg,
  criteria: z.preprocess(parseJsonString, ChoiceCriteriaSchema).describe(
    'Options mapped to descriptions (null for none). Pass with --input criteria:json=\'{"a":"...","b":null}\' or --input criteria=@file.json.',
  ),
  model: ModelOverrideArg,
  name: InstanceNameSchema,
});

/** Arguments for the `score` method. */
export const ScoreArgsSchema = z.object({
  state: StateArg,
  instructions: InstructionsArg,
  criteria: z.preprocess(parseJsonString, ScoreCriteriaSchema).describe(
    'Ordered level descriptions, lowest first. Pass with --input criteria:json=\'["Calm","Frustrated","Angry"]\' or --input criteria=@file.json.',
  ),
  model: ModelOverrideArg,
  name: InstanceNameSchema,
});

// ---------------------------------------------------------------------------
// Resource schemas
// ---------------------------------------------------------------------------

const EvaluationBase = {
  model: z.string().describe("Model that produced the answer."),
  state: EntrySchema.describe("The state that was evaluated."),
  usage: UsageSchema,
  evaluatedAt: z.iso.datetime(),
};

/** Stored output of `ask`: every question and its answer. */
export const EvaluationSchema = z.object({
  ...EvaluationBase,
  questions: QuestionsSchema,
  answers: z.record(z.string(), AnswerSchema),
});

/** Stored output of `noul`. */
export const NoulResultSchema = z.object({
  ...EvaluationBase,
  instructions: EntrySchema,
  criteria: z.object({
    true: DescriptionSchema.optional(),
    false: DescriptionSchema.optional(),
  }).optional(),
  noul: z.number().describe("Probability of yes, from 0 to 1."),
});

/** Stored output of `choice`. */
export const ChoiceResultSchema = z.object({
  ...EvaluationBase,
  instructions: EntrySchema,
  criteria: z.record(z.string(), DescriptionSchema),
  choice: z.string().describe("The highest-probability option."),
  probabilities: z.record(z.string(), z.number()),
  confidence: z.number(),
});

/** Stored output of `score`. */
export const ScoreResultSchema = z.object({
  ...EvaluationBase,
  instructions: EntrySchema,
  criteria: z.array(DescriptionSchema),
  score: z.number().describe(
    "Probability-weighted level; may fall between levels.",
  ),
  legend: z.record(z.string(), DescriptionSchema),
  probabilities: z.record(z.string(), z.number()),
  confidence: z.number(),
});

/** Stored output of `models`. */
export const ModelListSchema = z.object({
  models: z.array(ModelCardSchema),
  count: z.number().int().nonnegative(),
  fetchedAt: z.iso.datetime(),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal logger shape used by this model (LogTape-compatible). */
export interface ModelLogger {
  debug(message: string, properties?: Record<string, unknown>): void;
  info(message: string, properties?: Record<string, unknown>): void;
  warning(message: string, properties?: Record<string, unknown>): void;
}

/** Context fields used by the evaluation methods. */
export interface EvalContext {
  globalArgs: GlobalArgs;
  logger: ModelLogger;
  signal?: AbortSignal;
  writeResource: (
    specName: string,
    name: string,
    data: Record<string, unknown>,
  ) => Promise<{ name: string }>;
}

/** Read an environment variable, returning undefined when unset or not permitted. */
function readEnv(name: string): string | undefined {
  try {
    const value = Deno.env.get(name);
    return value && value.trim().length > 0 ? value : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Resolve the API key from global arguments or the environment.
 *
 * @throws When neither source provides a key.
 */
export function resolveApiKey(globalArgs: Pick<GlobalArgs, "apiKey">): string {
  const key = globalArgs.apiKey ?? readEnv(API_KEY_ENV);
  if (!key) {
    throw new Error(
      `No TypeSafe API key configured. Set the apiKey global argument ` +
        `(ideally \${{ vault.get("<vault>", "TYPESAFE_API_KEY") }}) or export ${API_KEY_ENV}.`,
    );
  }
  return key;
}

/** Build a client configuration from global arguments and the method context. */
export function buildClientConfig(
  globalArgs: GlobalArgs,
  logger?: ModelLogger,
  signal?: AbortSignal,
): ClientConfig {
  return {
    apiKey: resolveApiKey(globalArgs),
    baseUrl: globalArgs.baseUrl ?? DEFAULT_BASE_URL,
    timeoutMs: globalArgs.timeoutMs ?? 30_000,
    maxRetries: globalArgs.maxRetries ?? 2,
    logger,
    signal,
  };
}

/** Run one evaluation and log its outcome. Throws before any data is written. */
async function evaluate(
  context: EvalContext,
  methodName: string,
  state: Entry,
  questions: Record<string, Question>,
  modelOverride: string | undefined,
): Promise<SystemOneResponse> {
  const model = modelOverride ?? context.globalArgs.model ?? DEFAULT_MODEL;
  const ids = Object.keys(questions);
  context.logger.info(
    "Evaluating {count} question(s) with {model} via {method}",
    { count: ids.length, model, method: methodName },
  );
  const config = buildClientConfig(
    context.globalArgs,
    context.logger,
    context.signal,
  );
  const response = await systemOne(config, { state, model, questions });
  context.logger.info(
    "Evaluation complete: {inputTokens} input / {outputTokens} output tokens",
    {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  );
  return response;
}

/** Pull one typed answer out of a response, failing loudly on a type mismatch. */
function answerOfType<T extends z.infer<typeof AnswerSchema>["type"]>(
  response: SystemOneResponse,
  id: string,
  type: T,
): Extract<z.infer<typeof AnswerSchema>, { type: T }> {
  const answer = response.answers[id];
  if (answer.type !== type) {
    throw new Error(
      `TypeSafe returned a ${answer.type} answer for question "${id}" but a ${type} was expected`,
    );
  }
  return answer as Extract<z.infer<typeof AnswerSchema>, { type: T }>;
}

// ---------------------------------------------------------------------------
// Model
// ---------------------------------------------------------------------------

/** Swamp model definition for TypeSafe System One evaluations. */
export const model = {
  type: "@swamp/typesafe-ai",
  version: "2026.09.15.1",
  globalArguments: GlobalArgsSchema,
  resources: {
    evaluation: {
      description: "Answers to a batch of questions from the `ask` method",
      schema: EvaluationSchema,
      lifetime: "infinite",
      garbageCollection: 20,
    },
    noul: {
      description: "Yes/no probability from the `noul` method",
      schema: NoulResultSchema,
      lifetime: "infinite",
      garbageCollection: 20,
    },
    choice: {
      description: "Selected option and distribution from the `choice` method",
      schema: ChoiceResultSchema,
      lifetime: "infinite",
      garbageCollection: 20,
    },
    score: {
      description: "Weighted score and distribution from the `score` method",
      schema: ScoreResultSchema,
      lifetime: "infinite",
      garbageCollection: 20,
    },
    models: {
      description: "Models available to the account",
      schema: ModelListSchema,
      lifetime: "infinite",
      garbageCollection: 5,
    },
  },
  checks: {
    "api-key-configured": {
      description:
        "Ensure a TypeSafe API key is available from the definition or environment",
      labels: ["policy"],
      execute: async (context: { globalArgs: GlobalArgs }) => {
        try {
          resolveApiKey(context.globalArgs);
          return await Promise.resolve({ pass: true });
        } catch (err) {
          return { pass: false, errors: [(err as Error).message] };
        }
      },
    },
  },
  methods: {
    ask: {
      description:
        "Evaluate state against a map of typed questions in one request",
      kind: "action",
      arguments: AskArgsSchema,
      execute: async (
        args: z.infer<typeof AskArgsSchema>,
        context: EvalContext,
      ) => {
        const response = await evaluate(
          context,
          "ask",
          args.state,
          args.questions,
          args.model,
        );
        const handle = await context.writeResource(
          "evaluation",
          `evaluation-${args.name}`,
          {
            model: response.model,
            state: args.state,
            questions: args.questions,
            answers: response.answers,
            usage: response.usage,
            evaluatedAt: new Date().toISOString(),
          },
        );
        return { dataHandles: [handle] };
      },
    },
    noul: {
      description: "Ask one yes/no question; stores the probability of yes",
      kind: "action",
      arguments: NoulArgsSchema,
      execute: async (
        args: z.infer<typeof NoulArgsSchema>,
        context: EvalContext,
      ) => {
        const criteria = args.yes !== undefined || args.no !== undefined
          ? {
            ...(args.yes !== undefined ? { true: args.yes } : {}),
            ...(args.no !== undefined ? { false: args.no } : {}),
          }
          : undefined;
        const question: Question = {
          type: "noul",
          instructions: args.instructions,
          ...(criteria ? { criteria } : {}),
        };
        const response = await evaluate(
          context,
          "noul",
          args.state,
          { answer: question },
          args.model,
        );
        const answer = answerOfType(response, "answer", "noul");
        const handle = await context.writeResource(
          "noul",
          `noul-${args.name}`,
          {
            model: response.model,
            state: args.state,
            instructions: args.instructions,
            ...(criteria ? { criteria } : {}),
            noul: answer.noul,
            usage: response.usage,
            evaluatedAt: new Date().toISOString(),
          },
        );
        return { dataHandles: [handle] };
      },
    },
    choice: {
      description:
        "Pick one option from a defined set; stores the choice, probabilities, and confidence",
      kind: "action",
      arguments: ChoiceArgsSchema,
      execute: async (
        args: z.infer<typeof ChoiceArgsSchema>,
        context: EvalContext,
      ) => {
        const question: Question = {
          type: "choice",
          instructions: args.instructions,
          criteria: args.criteria,
        };
        const response = await evaluate(
          context,
          "choice",
          args.state,
          { answer: question },
          args.model,
        );
        const answer = answerOfType(response, "answer", "choice");
        const handle = await context.writeResource(
          "choice",
          `choice-${args.name}`,
          {
            model: response.model,
            state: args.state,
            instructions: args.instructions,
            criteria: args.criteria,
            choice: answer.choice,
            probabilities: answer.probabilities,
            confidence: answer.confidence,
            usage: response.usage,
            evaluatedAt: new Date().toISOString(),
          },
        );
        return { dataHandles: [handle] };
      },
    },
    score: {
      description:
        "Rate state along ordered levels; stores the weighted score, legend, probabilities, and confidence",
      kind: "action",
      arguments: ScoreArgsSchema,
      execute: async (
        args: z.infer<typeof ScoreArgsSchema>,
        context: EvalContext,
      ) => {
        const question: Question = {
          type: "score",
          instructions: args.instructions,
          criteria: args.criteria,
        };
        const response = await evaluate(
          context,
          "score",
          args.state,
          { answer: question },
          args.model,
        );
        const answer = answerOfType(response, "answer", "score");
        const handle = await context.writeResource(
          "score",
          `score-${args.name}`,
          {
            model: response.model,
            state: args.state,
            instructions: args.instructions,
            criteria: args.criteria,
            score: answer.score,
            legend: answer.legend,
            probabilities: answer.probabilities,
            confidence: answer.confidence,
            usage: response.usage,
            evaluatedAt: new Date().toISOString(),
          },
        );
        return { dataHandles: [handle] };
      },
    },
    models: {
      description: "List the System One models available to the account",
      kind: "list",
      arguments: z.object({}),
      execute: async (
        _args: Record<string, never>,
        context: EvalContext,
      ) => {
        context.logger.info("Listing TypeSafe models from {baseUrl}", {
          baseUrl: context.globalArgs.baseUrl ?? DEFAULT_BASE_URL,
        });
        const config = buildClientConfig(
          context.globalArgs,
          context.logger,
          context.signal,
        );
        const models = await listModels(config);
        context.logger.info("Found {count} model(s)", { count: models.length });
        const handle = await context.writeResource("models", "models", {
          models,
          count: models.length,
          fetchedAt: new Date().toISOString(),
        });
        return { dataHandles: [handle] };
      },
    },
  },
};
