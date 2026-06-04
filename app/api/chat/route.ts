import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { buildSystemPrompt } from "@/lib/knowledge";

// Node runtime so the system prompt can read the project MDX files at startup.
export const runtime = "nodejs";
export const maxDuration = 30;

// Guardrails for a public, billable endpoint.
const MAX_MESSAGES = 24; // total turns accepted in one request
const MAX_INPUT_CHARS = 2000; // cap a single question
const HISTORY_LIMIT = 12; // how much history we actually send to the model

// Built once per server instance (the knowledge is static).
let cachedSystem: string | null = null;
function systemPrompt(): string {
  if (cachedSystem === null) cachedSystem = buildSystemPrompt();
  return cachedSystem;
}

function textOf(message: UIMessage): string {
  return (message.parts ?? [])
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");
}

export async function POST(req: Request) {
  // No key -> respond 503 so the client can show a friendly offline notice
  // instead of erroring out.
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("assistant offline", { status: 503 });
  }

  let body: { messages?: UIMessage[] };
  try {
    body = await req.json();
  } catch {
    return new Response("bad request", { status: 400 });
  }

  const messages = body.messages;
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES
  ) {
    return new Response("bad request", { status: 400 });
  }

  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || textOf(last).length > MAX_INPUT_CHARS) {
    return new Response("bad request", { status: 400 });
  }

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: systemPrompt(),
    messages: await convertToModelMessages(messages.slice(-HISTORY_LIMIT)),
    temperature: 0.4,
    maxOutputTokens: 600,
  });

  return result.toUIMessageStreamResponse();
}
