// Shared limits keep the browser payload and the public API in agreement.
export const MAX_BODY_BYTES = 48_000;
export const MAX_MESSAGES = 24;
export const HISTORY_LIMIT = 12;
export const MAX_INPUT_CHARS = 2000;
export const MAX_TOTAL_CHARS = 8000;
export const CHAT_UNAVAILABLE = "The assistant is unavailable. Please try again later or email themichaellock@gmail.com.";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  parts: Array<{ type: "text"; text: string }>;
};

export class ChatInputError extends Error {
  constructor(public status = 400) { super("Invalid chat request"); }
}

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Never forward client-supplied roles, attachments, tool calls, or metadata.
export function validateMessages(body: unknown): ChatMessage[] {
  if (!record(body) || !Array.isArray(body.messages) || !body.messages.length || body.messages.length > MAX_MESSAGES) throw new ChatInputError();
  let total = 0;
  const messages = body.messages.map((message): ChatMessage => {
    if (!record(message) || (message.role !== "user" && message.role !== "assistant") || typeof message.id !== "string" || !message.id.length || message.id.length > 128 || /[\u0000-\u001f\u007f]/.test(message.id) || !Array.isArray(message.parts) || !message.parts.length || message.parts.length > 16) throw new ChatInputError();
    const parts = message.parts.map((part) => {
      if (!record(part) || part.type !== "text" || typeof part.text !== "string") throw new ChatInputError();
      return { type: "text" as const, text: part.text };
    });
    const text = parts.map((part) => part.text).join("");
    total += text.length;
    if (!text.trim() || text.length > (message.role === "user" ? MAX_INPUT_CHARS : 4000) || total > MAX_TOTAL_CHARS) throw new ChatInputError();
    return { id: message.id, role: message.role, parts };
  });
  if (messages[messages.length - 1].role !== "user") throw new ChatInputError();
  return messages;
}

export function conversationId(body: unknown, fallback: string): string {
  if (!record(body) || body.conversationId === undefined) return fallback;
  if (typeof body.conversationId !== "string" || !body.conversationId.length || body.conversationId.length > 128 || /[\u0000-\u001f\u007f]/.test(body.conversationId)) throw new ChatInputError();
  return body.conversationId;
}

// Enforce the byte limit even for chunked bodies with no Content-Length.
export async function readChatBody(req: Request): Promise<unknown> {
  const length = req.headers.get("content-length");
  if (length && (!/^\d+$/.test(length) || Number(length) > MAX_BODY_BYTES)) throw new ChatInputError(413);
  if (!req.body) throw new ChatInputError();
  const reader = req.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let size = 0;
  let body = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        throw new ChatInputError(413);
      }
      body += decoder.decode(value, { stream: true });
    }
    body += decoder.decode();
    return JSON.parse(body);
  } finally {
    reader.releaseLock();
  }
}

export function originAllowed(req: Request, env: { NODE_ENV?: string; VERCEL_URL?: string }): boolean {
  const origin = req.headers.get("origin");
  // This is a public endpoint. An Origin check is browser protection, not auth.
  if (!origin) return true;
  const allowed = new Set(["https://michael-lock.com", "https://www.michael-lock.com"]);
  if (env.VERCEL_URL) allowed.add(`https://${env.VERCEL_URL}`);
  if (allowed.has(origin)) return true;
  if (env.NODE_ENV !== "development") return false;
  try {
    const url = new URL(origin);
    return url.origin === origin && (url.protocol === "http:" || url.protocol === "https:") && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  } catch { return false; }
}

export function clientIp(req: Request, onVercel: boolean): string {
  // Vercel overwrites this header. Generic forwarding headers are not trusted.
  return onVercel ? (req.headers.get("x-vercel-forwarded-for")?.split(",")[0].trim().slice(0, 64) || "unknown") : "unknown";
}

type Hit = { minStart: number; minCount: number; hrStart: number; hrCount: number };
export class ChatRateLimiter {
  private hits = new Map<string, Hit>();
  constructor(private maxBuckets = 5000) {}
  check(ip: string, now = Date.now()): { ok: boolean; retryAfter: number } {
    let hit = this.hits.get(ip);
    if (!hit) {
      if (this.hits.size >= this.maxBuckets) {
        for (const [key, value] of Array.from(this.hits)) if (now - value.hrStart >= 3_600_000) this.hits.delete(key);
      }
      // Fail closed instead of allowing attacker-controlled memory growth.
      if (this.hits.size >= this.maxBuckets) return { ok: false, retryAfter: 60 };
      hit = { minStart: now, minCount: 0, hrStart: now, hrCount: 0 };
      this.hits.set(ip, hit);
    }
    if (now - hit.minStart >= 60_000) { hit.minStart = now; hit.minCount = 0; }
    if (now - hit.hrStart >= 3_600_000) { hit.hrStart = now; hit.hrCount = 0; }
    if (hit.minCount >= 10) return { ok: false, retryAfter: Math.ceil((60_000 - (now - hit.minStart)) / 1000) };
    if (hit.hrCount >= 80) return { ok: false, retryAfter: Math.ceil((3_600_000 - (now - hit.hrStart)) / 1000) };
    hit.minCount++; hit.hrCount++;
    return { ok: true, retryAfter: 0 };
  }
}

export function safeInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//") && !/[\\\u0000-\u0020\u007f]/.test(href);
}

// Preserve the displayed thread while sending only bounded, text-only history.
export function requestHistory(messages: Array<{ id: string; role: string; parts: Array<{ type: string; text?: string }> }>): ChatMessage[] {
  const kept: ChatMessage[] = [];
  let total = 0;
  for (const message of messages.slice(-HISTORY_LIMIT).reverse()) {
    if (message.role !== "user" && message.role !== "assistant") continue;
    const text = message.parts.filter((part) => part.type === "text").map((part) => part.text ?? "").join("");
    // Failed streams can leave an assistant placeholder with no text.
    // Do not send it back: it is not a completed turn.
    if (message.role === "assistant" && !text.trim()) continue;
    if (kept.length && total + text.length > MAX_TOTAL_CHARS) break;
    total += text.length;
    kept.unshift({ id: message.id, role: message.role, parts: [{ type: "text", text }] });
  }
  return kept;
}

// Call only with APICallError fields. The returned object contains no provider
// text, URLs, headers, prompts, or credentials, even if those occur in the input.
export function providerDiagnostic(error?: { statusCode?: number; responseBody?: string; message?: string }): {
  statusCode: number | null;
  category: "workspace_required" | "authentication" | "billing" | "forbidden" | "rate_limit" | "model_unavailable" | "overloaded" | "unknown";
} {
  const statusCode = typeof error?.statusCode === "number" && Number.isInteger(error.statusCode) && error.statusCode >= 100 && error.statusCode <= 599 ? error.statusCode : null;
  const detail = `${typeof error?.message === "string" ? error.message.slice(0, 16_000) : ""} ${typeof error?.responseBody === "string" ? error.responseBody.slice(0, 16_000) : ""}`.toLowerCase();
  let category: ReturnType<typeof providerDiagnostic>["category"] = "unknown";
  if (statusCode === 400 && detail.includes("workspace") && detail.includes("header")) category = "workspace_required";
  else if (statusCode === 401 || detail.includes("invalid x-api-key") || detail.includes("authentication_error")) category = "authentication";
  else if (detail.includes("credit balance") || detail.includes("billing") || detail.includes("insufficient credits")) category = "billing";
  else if (statusCode === 403) category = "forbidden";
  else if (statusCode === 429) category = "rate_limit";
  else if (statusCode === 404) category = "model_unavailable";
  else if (statusCode === 529) category = "overloaded";
  return { statusCode, category };
}

// A small vocabulary for diagnosing rejected provider parameters. Never emit
// arbitrary provider text: errors can contain request values or credentials.
export function providerErrorFields(error?: { responseBody?: string; message?: string }): string[] {
  const detail = `${error?.message ?? ""} ${error?.responseBody ?? ""}`.toLowerCase();
  const vocabulary = ["model", "temperature", "max_tokens", "thinking", "budget_tokens", "messages", "content", "role", "credit", "credits", "billing", "balance", "api key", "workspace", "organization", "permission", "access", "disabled", "enabled", "deprecated", "retired", "not found", "not supported", "not available", "invalid_request_error", "authentication_error", "permission_error", "overloaded_error", "anthropic-version", "anthropic-beta", "country", "region", "validation", "required", "header", "quota", "spending", "subscription"];
  return vocabulary.filter((word) => detail.includes(word));
}
