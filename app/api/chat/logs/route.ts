import { readConversations } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function esc(s: string): string {
  return s.replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!
  );
}

// Private, token-gated view of visitor conversations:
//   /api/chat/logs?key=YOUR_LOGS_TOKEN
export async function GET(req: Request) {
  const token = process.env.LOGS_TOKEN;
  const key = new URL(req.url).searchParams.get("key") || "";
  if (!token || key !== token) {
    return new Response("unauthorized", { status: 401 });
  }

  let convos;
  try {
    convos = await readConversations(300);
  } catch {
    return new Response("logs unavailable (is DATABASE_URL set?)", {
      status: 500,
    });
  }

  const sections = convos
    .map((c) => {
      const when = new Date(c.created_at).toLocaleString();
      const meta = `${when} · ${c.turns} msg · ${c.ip_hash ?? "—"}`;
      const msgs = c.messages
        .map(
          (m) =>
            `<div class="m ${esc(m.role)}"><b>${esc(m.role)}</b><span>${esc(
              m.text
            )}</span></div>`
        )
        .join("");
      return `<section><h3>${esc(meta)}</h3>${msgs}</section>`;
    })
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chat logs</title>
<style>
  :root{color-scheme:dark}
  body{font:14px/1.6 ui-sans-serif,system-ui,-apple-system,sans-serif;margin:0;background:#0b0b0b;color:#e8e8e8}
  main{max-width:780px;margin:0 auto;padding:28px 20px}
  h1{font-size:18px;margin:0 0 4px}
  .sub{color:#777;font-size:12px;margin:0 0 20px}
  section{border:1px solid #232323;border-radius:12px;padding:12px 16px;margin:14px 0;background:#141414}
  h3{font-size:11px;letter-spacing:.02em;color:#7a7a7a;font-weight:600;margin:0 0 10px}
  .m{display:flex;gap:10px;margin:7px 0;white-space:pre-wrap;word-break:break-word}
  .m b{flex:0 0 64px;color:#5f5f5f;font-size:10px;text-transform:uppercase;padding-top:2px}
  .m.user span{color:#9ec9e8}
  .m.assistant span{color:#c9e8c9}
</style></head><body><main>
  <h1>Chat conversations</h1>
  <p class="sub">${convos.length} conversation(s), newest first. IPs are hashed.</p>
  ${sections || "<p class='sub'>No conversations logged yet.</p>"}
</main></body></html>`;

  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
