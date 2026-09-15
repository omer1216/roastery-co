import { NextResponse } from "next/server";
import { getMenuItems } from "@/lib/menu";
import { CHAT_TOOLS } from "@/lib/chat/tools";
import { validateToolCall } from "@/lib/chat/validate";
import { buildSystemPrompt } from "@/lib/chat/prompt";

export const runtime = "nodejs";

const ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/interactions";
const MODEL = "gemini-3.5-flash-lite";
const MAX_TOOL_ROUNDS = 3;
const MAX_HISTORY_STEPS = 40;
const MAX_CALLS_PER_ROUND = 6;

async function callGemini(body) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      data?.error?.message || `Gemini returned ${response.status}`
    );
    error.fromGemini = true;
    throw error;
  }

  return data;
}

// Only ever cut the history at a user_input. Slicing anywhere else can
// orphan a function_result from its function_call, which Gemini rejects.
function trimHistory(steps, max) {
  const clean = steps.filter(
    (step) => step && typeof step === "object" && typeof step.type === "string"
  );

  if (clean.length <= max) {
    return clean[0]?.type === "user_input" ? clean : dropToFirstUserInput(clean);
  }

  let start = clean.length - max;
  while (start < clean.length && clean[start].type !== "user_input") {
    start++;
  }

  return start >= clean.length ? [] : clean.slice(start);
}

function dropToFirstUserInput(steps) {
  const index = steps.findIndex((step) => step.type === "user_input");
  return index === -1 ? [] : steps.slice(index);
}

function textFromSteps(steps) {
  return steps
    .filter((step) => step.type === "model_output")
    .flatMap((step) =>
      Array.isArray(step.content)
        ? step.content.filter((part) => part.type === "text").map((p) => p.text)
        : []
    )
    .join("\n")
    .trim();
}

async function runConversation({ systemPrompt, startingInput, menuItems, cartLines }) {
  let input = startingInput;
  const actions = [];
  let pending = null;
  let interaction = null;

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    interaction = await callGemini({
      model: MODEL,
      store: false,
      input,
      tools: CHAT_TOOLS,
      system_instruction: systemPrompt,
    });

    const steps = Array.isArray(interaction.steps) ? interaction.steps : [];
    input = [...input, ...steps];

    const calls = steps.filter((step) => step.type === "function_call");

    if (interaction.status !== "requires_action" || calls.length === 0) break;
    if (round === MAX_TOOL_ROUNDS) break;

    // Every call must get a result back, including the ones we refuse.
    calls.forEach((call, index) => {
      let outcome;

      if (index >= MAX_CALLS_PER_ROUND) {
        outcome = {
          ok: false,
          error:
            "That's too many items at once. Ask the customer to pick a few.",
        };
      } else {
        outcome = validateToolCall({
          name: call.name,
          args: call.arguments ?? {},
          menuItems,
          cartLines,
        });
      }

      if (outcome.ok) actions.push(outcome.action);

      // First item still waiting on the customer to choose options.
      // Only one picker is shown at a time, so later ones are dropped.
      if (outcome.pending && !pending) pending = outcome.pending;

      input.push({
        type: "function_result",
        name: call.name,
        call_id: call.id,
        result: [
          {
            type: "text",
            text: JSON.stringify(
              outcome.ok
                ? { success: true, ...outcome.result }
                : { success: false, error: outcome.error }
            ),
          },
        ],
      });
    });
  }

  return { interaction, actions, pending, input };
}

export async function POST(request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Chat isn't configured right now." },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const message = String(body.message ?? "").trim();
    const rawHistory = Array.isArray(body.history) ? body.history : [];
    const cartLines = Array.isArray(body.cart) ? body.cart : [];

    if (!message) {
      return NextResponse.json({ error: "Say something first." }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json({ error: "That's too long." }, { status: 400 });
    }

    const menuItems = await getMenuItems();
    const systemPrompt = buildSystemPrompt(menuItems, cartLines);

    const userStep = { type: "user_input", content: message };

    let result;

    try {
      result = await runConversation({
        systemPrompt,
        startingInput: [...trimHistory(rawHistory, MAX_HISTORY_STEPS), userStep],
        menuItems,
        cartLines,
      });
    } catch (error) {
      if (!error.fromGemini) throw error;

      // History was malformed. Start clean rather than trapping the
      // customer in a conversation that can never recover.
      console.warn("[chat] retrying without history:", error.message);
      result = await runConversation({
        systemPrompt,
        startingInput: [userStep],
        menuItems,
        cartLines,
      });
    }

    const steps = Array.isArray(result.interaction?.steps)
      ? result.interaction.steps
      : [];

    return NextResponse.json({
      reply: textFromSteps(steps) || "Sorry, didn't catch that.",
      actions: result.actions,
      pending: result.pending ?? null,
      history: trimHistory(result.input, MAX_HISTORY_STEPS),
    });
  } catch (error) {
    console.error("[chat]", error);
    return NextResponse.json(
      { error: "The bar's a bit busy. Try again in a second.", history: [] },
      { status: 500 }
    );
  }
}