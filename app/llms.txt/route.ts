import { llmsIndex } from "@/lib/llms";

export const dynamic = "force-static";

// Served at /llms.txt — the index file for LLM crawlers (llmstxt.org).
export function GET() {
  return new Response(llmsIndex(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600, must-revalidate",
    },
  });
}
