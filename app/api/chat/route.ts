import { providerErrorFields } from "@/lib/chat-security";
import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages, APICallError } from "ai";
import { buildSystemPrompt } from "@/lib/knowledge";
import { logConversation } from "@/lib/db";
import { CHAT_UNAVAILABLE, ChatInputError, ChatRateLimiter, HISTORY_LIMIT, clientIp, conversationId, originAllowed, readChatBody, validateMessages, providerDiagnostic } from "@/lib/chat-security";

export const runtime = "nodejs";
export const maxDuration = 30;

// Per-instance defense only. A platform-wide rate limit and provider spend cap
// are still required to control costs across serverless instances.
const limiter = new ChatRateLimiter();
let cachedSystem: string | null = null;
function systemPrompt(): string {
  if (cachedSystem === null) cachedSystem = buildSystemPrompt();
  return cachedSystem;
}

export async function POST(req: Request) {
  if (!originAllowed(req, process.env)) return new Response("forbidden", { status: 403 });
  const ip = clientIp(req, process.env.VERCEL === "1");
  const rl = limiter.check(ip);
  if (!rl.ok) return new Response("too many requests", { status: 429, headers: { "retry-after": String(rl.retryAfter) } });

  let messages;
  let convKey;
  try {
    const body = await readChatBody(req);
    messages = validateMessages(body);
    convKey = conversationId(body, messages[0].id);
  } catch (error) {
    return new Response("bad request", { status: error instanceof ChatInputError ? error.status : 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) return new Response(CHAT_UNAVAILABLE, { status: 503 });

  const priorMessages = messages.map((message) => ({ role: message.role, text: message.parts.map((part) => part.text).join("") }));
  try {
    const result = streamText({
      model: anthropic("claude-haiku-4-5"),
      headers: process.env.ANTHROPIC_WORKSPACE_ID
        ? { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID }
        : undefined,
      system: systemPrompt(),
      messages: await convertToModelMessages(messages.slice(-HISTORY_LIMIT)),
      temperature: 0.3,
      maxOutputTokens: 600,
      maxRetries: 1,
      abortSignal: AbortSignal.timeout(25_000),
      // Avoid dumping provider error objects (headers/request data) to logs.
      onError: ({ error }) => {
        console.error("Chat provider request failed", providerDiagnostic(APICallError.isInstance(error) ? error : undefined), providerErrorFields(APICallError.isInstance(error) ? error : undefined));
      },
      onFinish: async ({ text }) => {
        await logConversation({
          convKey,
          ip,
          userAgent: req.headers.get("user-agent")?.slice(0, 512) ?? null,
          messages: [...priorMessages, { role: "assistant", text }],
        });
      },
    });
    return result.toUIMessageStreamResponse({ onError: () => CHAT_UNAVAILABLE });
  } catch (error) {
    console.error("Chat request failed", providerDiagnostic(APICallError.isInstance(error) ? error : undefined), providerErrorFields(APICallError.isInstance(error) ? error : undefined));
    return new Response(CHAT_UNAVAILABLE, { status: 503 });
  }
}
