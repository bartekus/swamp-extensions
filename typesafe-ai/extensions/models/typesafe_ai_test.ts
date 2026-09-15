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

import {
  assertEquals,
  assertRejects,
  assertStringIncludes,
} from "jsr:@std/assert@1.0.19";
import {
  createModelTestContext,
  withMockedFetch,
} from "@swamp-club/swamp-testing";
import { type EvalContext, model, resolveApiKey } from "./typesafe_ai.ts";
import { TypeSafeApiError } from "./_lib/client.ts";

const globalArgs = {
  apiKey: "test-key",
  model: "jev-latest",
  baseUrl: "https://api.example.com",
  timeoutMs: 1_000,
  maxRetries: 0,
};

function okResponse(answers: Record<string, unknown>): Response {
  return Response.json({
    model: "jev-latest",
    answers,
    usage: { input_tokens: 12, output_tokens: 3 },
  });
}

/** Test context with `globalArgs` narrowed to this model's schema. */
function makeContext(methodName: string) {
  const result = createModelTestContext({ globalArgs, methodName });
  return { ...result, context: result.context as unknown as EvalContext };
}

Deno.test("ask writes an evaluation resource with all answers", async () => {
  const { context, getWrittenResources, getLogsByLevel } = makeContext("ask");
  const questions = {
    urgent: { type: "noul" as const, instructions: "Urgent?" },
    team: {
      type: "choice" as const,
      instructions: "Which team?",
      criteria: { billing: null, tech: null },
    },
  };
  const { calls } = await withMockedFetch(
    [okResponse({
      urgent: { type: "noul", noul: 0.9 },
      team: {
        type: "choice",
        choice: "tech",
        probabilities: { billing: 0.2, tech: 0.8 },
        confidence: 0.7,
      },
    })],
    () =>
      model.methods.ask.execute(
        { state: { ticket: "Payouts failing" }, questions, name: "latest" },
        context,
      ),
  );
  assertEquals(calls.length, 1);
  assertEquals(calls[0].url, "https://api.example.com/v1/systemone");
  assertEquals(calls[0].headers["authorization"], "Bearer test-key");
  const body = JSON.parse(calls[0].body ?? "{}");
  assertEquals(body.model, "jev-latest");
  assertEquals(body.state, { ticket: "Payouts failing" });

  const written = getWrittenResources();
  assertEquals(written.length, 1);
  assertEquals(written[0].specName, "evaluation");
  assertEquals(written[0].name, "evaluation-latest");
  const answers = written[0].data.answers as Record<string, unknown>;
  assertEquals(answers.urgent, { type: "noul", noul: 0.9 });
  assertEquals(written[0].data.questions, questions);
  assertEquals(written[0].data.usage, { input_tokens: 12, output_tokens: 3 });
  assertEquals(getLogsByLevel("info").length, 2);
});

Deno.test("ask honours a per-call model override", async () => {
  const { context } = makeContext("ask");
  const { calls } = await withMockedFetch(
    [okResponse({ a: { type: "noul", noul: 0.1 } })],
    () =>
      model.methods.ask.execute(
        {
          state: "x",
          questions: { a: { type: "noul", instructions: "?" } },
          model: "jev-2",
          name: "latest",
        },
        context,
      ),
  );
  assertEquals(JSON.parse(calls[0].body ?? "{}").model, "jev-2");
});

Deno.test("noul builds criteria only when provided and stores the probability", async () => {
  const { context, getWrittenResources } = makeContext("noul");
  const { calls } = await withMockedFetch(
    [okResponse({ answer: { type: "noul", noul: 0.42 } })],
    () =>
      model.methods.noul.execute(
        {
          state: "Help! Payouts down for 3 days.",
          instructions: "Does this convey urgency?",
          yes: "Explicitly time-sensitive",
          name: "urgency",
        },
        context,
      ),
  );
  const body = JSON.parse(calls[0].body ?? "{}");
  assertEquals(body.questions.answer.criteria, {
    true: "Explicitly time-sensitive",
  });
  const [written] = getWrittenResources();
  assertEquals(written.specName, "noul");
  assertEquals(written.name, "noul-urgency");
  assertEquals(written.data.noul, 0.42);
  assertEquals(written.data.criteria, { true: "Explicitly time-sensitive" });
});

Deno.test("noul omits criteria entirely when neither side is given", async () => {
  const { context, getWrittenResources } = makeContext("noul");
  const { calls } = await withMockedFetch(
    [okResponse({ answer: { type: "noul", noul: 0.5 } })],
    () =>
      model.methods.noul.execute(
        { state: "x", instructions: "?", name: "latest" },
        context,
      ),
  );
  const body = JSON.parse(calls[0].body ?? "{}");
  assertEquals("criteria" in body.questions.answer, false);
  assertEquals("criteria" in getWrittenResources()[0].data, false);
});

Deno.test("choice stores choice, probabilities, and confidence", async () => {
  const { context, getWrittenResources } = makeContext("choice");
  await withMockedFetch(
    [okResponse({
      answer: {
        type: "choice",
        choice: "technical",
        probabilities: { billing: 0.1, technical: 0.9 },
        confidence: 0.85,
      },
    })],
    () =>
      model.methods.choice.execute(
        {
          state: "x",
          instructions: "Which team?",
          criteria: { billing: "Payments", technical: "Bugs" },
          name: "latest",
        },
        context,
      ),
  );
  const [written] = getWrittenResources();
  assertEquals(written.specName, "choice");
  assertEquals(written.name, "choice-latest");
  assertEquals(written.data.choice, "technical");
  assertEquals(written.data.confidence, 0.85);
  assertEquals(written.data.criteria, {
    billing: "Payments",
    technical: "Bugs",
  });
});

Deno.test("score stores score, legend, probabilities, and confidence", async () => {
  const { context, getWrittenResources } = makeContext("score");
  await withMockedFetch(
    [okResponse({
      answer: {
        type: "score",
        score: 1.6,
        legend: { "0": "Calm", "1": "Frustrated", "2": "Angry" },
        probabilities: { "0": 0.05, "1": 0.3, "2": 0.65 },
        confidence: 0.78,
      },
    })],
    () =>
      model.methods.score.execute(
        {
          state: "x",
          instructions: "How frustrated?",
          criteria: ["Calm", "Frustrated", "Angry"],
          name: "latest",
        },
        context,
      ),
  );
  const [written] = getWrittenResources();
  assertEquals(written.specName, "score");
  assertEquals(written.name, "score-latest");
  assertEquals(written.data.score, 1.6);
  assertEquals(written.data.legend, {
    "0": "Calm",
    "1": "Frustrated",
    "2": "Angry",
  });
});

Deno.test("single-question methods reject an answer of the wrong type", async () => {
  const { context, getWrittenResources } = makeContext("noul");
  await assertRejects(
    () =>
      withMockedFetch(
        [okResponse({
          answer: {
            type: "choice",
            choice: "a",
            probabilities: { a: 1 },
            confidence: 1,
          },
        })],
        () =>
          model.methods.noul.execute(
            { state: "x", instructions: "?", name: "latest" },
            context,
          ),
      ),
    Error,
    "a noul was expected",
  );
  assertEquals(getWrittenResources().length, 0);
});

Deno.test("API errors propagate and nothing is written", async () => {
  const { context, getWrittenResources } = makeContext("choice");
  const err = await assertRejects(
    () =>
      withMockedFetch(
        [
          new Response(JSON.stringify({ detail: "invalid criteria" }), {
            status: 422,
          }),
        ],
        () =>
          model.methods.choice.execute(
            {
              state: "x",
              instructions: "?",
              criteria: { a: null, b: null },
              name: "latest",
            },
            context,
          ),
      ),
    TypeSafeApiError,
    "HTTP 422",
  );
  assertStringIncludes(err.message, "invalid criteria");
  assertEquals(getWrittenResources().length, 0);
});

Deno.test("models lists available models", async () => {
  const { context, getWrittenResources } = makeContext("models");
  const { calls } = await withMockedFetch(
    [Response.json({
      models: [
        {
          name: "jev-latest",
          description: "Flagship",
          release_date: "2026-01-01",
        },
      ],
    })],
    () => model.methods.models.execute({}, context),
  );
  assertEquals(calls[0].url, "https://api.example.com/v1/models");
  assertEquals(calls[0].method, "GET");
  const [written] = getWrittenResources();
  assertEquals(written.specName, "models");
  assertEquals(written.name, "models");
  assertEquals(written.data.count, 1);
  assertEquals(
    (written.data.models as { name: string }[])[0].name,
    "jev-latest",
  );
});

Deno.test("resolveApiKey falls back to the environment", () => {
  const previous = Deno.env.get("TYPESAFE_API_KEY");
  try {
    Deno.env.set("TYPESAFE_API_KEY", "env-key");
    assertEquals(resolveApiKey({}), "env-key");
    assertEquals(resolveApiKey({ apiKey: "arg-key" }), "arg-key");
    Deno.env.delete("TYPESAFE_API_KEY");
    let message = "";
    try {
      resolveApiKey({});
    } catch (err) {
      message = (err as Error).message;
    }
    assertStringIncludes(message, "No TypeSafe API key configured");
  } finally {
    if (previous === undefined) Deno.env.delete("TYPESAFE_API_KEY");
    else Deno.env.set("TYPESAFE_API_KEY", previous);
  }
});

Deno.test("api-key-configured check fails without a key", async () => {
  const previous = Deno.env.get("TYPESAFE_API_KEY");
  try {
    Deno.env.delete("TYPESAFE_API_KEY");
    const failing = await model.checks["api-key-configured"].execute({
      globalArgs: {
        model: "jev-latest",
        baseUrl: "https://api.example.com",
        timeoutMs: 1,
        maxRetries: 0,
      },
    });
    assertEquals(failing.pass, false);
    const passing = await model.checks["api-key-configured"].execute({
      globalArgs: { ...globalArgs },
    });
    assertEquals(passing.pass, true);
  } finally {
    if (previous !== undefined) Deno.env.set("TYPESAFE_API_KEY", previous);
  }
});

Deno.test("argument schemas reject degenerate criteria", () => {
  const choice = model.methods.choice.arguments.safeParse({
    state: "x",
    instructions: "?",
    criteria: { only: null },
  });
  assertEquals(choice.success, false);
  const score = model.methods.score.arguments.safeParse({
    state: "x",
    instructions: "?",
    criteria: ["one"],
  });
  assertEquals(score.success, false);
  const ask = model.methods.ask.arguments.safeParse({
    state: "x",
    questions: {},
  });
  assertEquals(ask.success, false);
  const defaults = model.methods.noul.arguments.parse({
    state: "x",
    instructions: "?",
  });
  assertEquals(defaults.name, "latest");
});

Deno.test("structured arguments accept JSON strings from @file inputs", () => {
  const ask = model.methods.ask.arguments.parse({
    state: "x",
    questions: '{"a":{"type":"noul","instructions":"?"}}',
  });
  assertEquals(ask.questions.a.type, "noul");
  const choice = model.methods.choice.arguments.parse({
    state: "x",
    instructions: "?",
    criteria: '{"a":null,"b":"desc"}',
  });
  assertEquals(choice.criteria, { a: null, b: "desc" });
  const score = model.methods.score.arguments.parse({
    state: "x",
    instructions: "?",
    criteria: '["low","high"]',
  });
  assertEquals(score.criteria, ["low", "high"]);
  const bad = model.methods.ask.arguments.safeParse({
    state: "x",
    questions: "not json",
  });
  assertEquals(bad.success, false);
});
