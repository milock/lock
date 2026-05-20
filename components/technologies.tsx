"use client";

import React from "react";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { stack } from "@/lib/data";

// Map each stack entry to a Simple Icons slug. Entries without a brand icon
// (MCP, Firecrawl) are rendered as text badges in the fallback list below.
const slugMap: Record<string, string> = {
  Claude: "anthropic",
  Python: "python",
  "Next.js": "nextdotjs",
  TypeScript: "typescript",
  "Tailwind CSS": "tailwindcss",
  HubSpot: "hubspot",
  Webflow: "webflow",
  beehiiv: "beehiiv",
  Vercel: "vercel",
  Perplexity: "perplexity",
};

export default function Technologies() {
  const images = stack
    .map((name) => slugMap[name])
    .filter(Boolean)
    .map((slug) => `https://cdn.simpleicons.org/${slug}`);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <IconCloud images={images} />
    </div>
  );
}
