import { neon } from "@neondatabase/serverless";
import { createHmac } from "crypto";

// Lazily resolve the SQL client so the app builds/runs fine without a DB
// configured — logging just no-ops when DATABASE_URL is absent.
function sql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}

export type LoggedMessage = { role: string; text: string };

/**
 * Fire-and-forget conversation logging. Stores one snapshot per turn keyed by
 * the conversation's first message id; the admin view keeps the latest
 * snapshot per key. The visitor IP is hashed (never stored raw). Any failure is
 * swallowed — logging must never affect the chat response.
 */
export async function logConversation(opts: {
  convKey: string | null;
  ip: string;
  userAgent: string | null;
  messages: LoggedMessage[];
}): Promise<void> {
  try {
    const db = sql();
    if (!db) return;
    const ipHash =
      opts.ip && opts.ip !== "unknown" && process.env.CHAT_IP_HASH_SECRET
        ? createHmac("sha256", process.env.CHAT_IP_HASH_SECRET).update(opts.ip).digest("hex").slice(0, 16)
        : null;
    await db`
      INSERT INTO chat_logs (conv_key, ip_hash, user_agent, turns, messages)
      VALUES (${opts.convKey}, ${ipHash}, ${opts.userAgent}, ${opts.messages.length},
              ${JSON.stringify(opts.messages)})
    `;
  } catch {
    // never let logging break the chat
  }
}

export type Conversation = {
  created_at: string;
  conv_key: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  turns: number;
  messages: LoggedMessage[];
};

/** Latest snapshot per conversation, newest first. */
export async function readConversations(limit = 300): Promise<Conversation[]> {
  const db = sql();
  if (!db) return [];
  const rows = (await db`
    SELECT * FROM (
      SELECT DISTINCT ON (COALESCE(conv_key, id::text))
        created_at, conv_key, ip_hash, user_agent, turns, messages
      FROM chat_logs
      ORDER BY COALESCE(conv_key, id::text), created_at DESC, turns DESC
    ) latest
    ORDER BY created_at DESC
    LIMIT ${Math.max(1, Math.min(300, Math.floor(limit) || 300))}
  `) as unknown as Conversation[];
  rows.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  return rows.slice(0, limit);
}
