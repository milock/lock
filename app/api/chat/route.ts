import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { buildSystemPrompt } from "@/lib/knowledge";
import { logConversation } from "@/lib/db";

// Node runtime so the system prompt can read the project MDX files at startup.
export const runtime = "nodejs";
export const maxDuration = 30;

// ── Guardrails for a public, billable endpoint ──────────────────────────────
const MAX_MESSAGES = 24; // turns accepted in one request
const MAX_INPUT_CHARS = 2000; // cap a single question
const MAX_TOTAL_CHARS = 8000; // cap the whole sent slice (input-token ceiling)
const HISTORY_LIMIT = 12; // how much history we actually send to the model

// Per-IP rate limit. In-memory, so it is per server instance and resets on a
// cold start — a soft first layer that stops casual hammering and runaway
// scripts from a single source. The real backstop is a hard spend cap on the
// Anthropic key (set in the Anthropic console). For a distributed limit across
// all serverless instances, swap this block for @upstash/ratelimit + Redis.
const RL_WINDOW_MS = 60_000;
const RL_MAX_PER_MIN = 10;
const RL_HOUR_MS = 3_600_000;
const RL_MAX_PER_HOUR = 80;

type Hit = { minStart: number; minCount: number; hrStart: number; hrCount: number };
const hits = new Map<string, Hit>();

function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  let h = hits.get(ip);
  if (!h) {
    h = { minStart: now, minCount: 0, hrStart: now, hrCount: 0 };
    hits.set(ip, h);
  }
  if (now - h.minStart >= RL_WINDOW_MS) {
    h.minStart = now;
    h.minCount = 0;
  }
  if (now - h.hrStart >= RL_HOUR_MS) {
    h.hrStart = now;
    h.hrCount = 0;
  }
  if (h.minCount >= RL_MAX_PER_MIN) {
    return { ok: false, retryAfter: Math.ceil((RL_WINDOW_MS - (now - h.minStart)) / 1000) };
  }
  if (h.hrCount >= RL_MAX_PER_HOUR) {
    return { ok: false, retryAfter: Math.ceil((RL_HOUR_MS - (now - h.hrStart)) / 1000) };
  }
  h.minCount += 1;
  h.hrCount += 1;
  // Bound memory: drop stale buckets if the map grows large.
  if (hits.size > 5000) {
    for (const [k, v] of Array.from(hits)) {
      if (now - v.hrStart >= RL_HOUR_MS) hits.delete(k);
    }
  }
  return { ok: true, retryAfter: 0 };
}

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// Block other websites from embedding/using the endpoint. Browser requests from
// another origin carry that origin; same-origin (and non-browser, header-less)
// requests pass and are still rate-limited.
function originAllowed(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).host;
    return (
      host === "michael-lock.com" ||
      host === "www.michael-lock.com" ||
      host.endsWith(".vercel.app") ||
      host.startsWith("localhost")
    );
  } catch {
    return false;
  }
}

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

  if (!originAllowed(req)) {
    return new Response("forbidden", { status: 403 });
  }

  const rl = rateLimit(clientIp(req));
  if (!rl.ok) {
    return new Response("too many requests", {
      status: 429,
      headers: { "retry-after": String(rl.retryAfter || 60) },
    });
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

  // Only send a bounded recent slice, and cap its total size so a crafted
  // history can't balloon the input-token bill.
  const slice = messages.slice(-HISTORY_LIMIT);
  const totalChars = slice.reduce((n, m) => n + textOf(m).length, 0);
  if (totalChars > MAX_TOTAL_CHARS) {
    return new Response("bad request", { status: 400 });
  }

  // Captured for logging once the reply finishes. convKey is the first
  // message's id, which the client resends every turn, so snapshots of the same
  // conversation share a key.
  const convKey = messages[0]?.id ?? null;
  const ip = clientIp(req);
  const userAgent = req.headers.get("user-agent");
  const priorMessages = messages.map((m) => ({
    role: m.role,
    text: textOf(m),
  }));

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: systemPrompt(),
    messages: await convertToModelMessages(slice),
    temperature: 0.3,
    maxOutputTokens: 600,
    onFinish: async ({ text }) => {
      await logConversation({
        convKey,
        ip,
        userAgent,
        messages: [...priorMessages, { role: "assistant", text }],
      });
    },
  });

  return result.toUIMessageStreamResponse();
}
