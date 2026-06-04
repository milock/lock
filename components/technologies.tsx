"use client";

import React, { useState } from "react";
import { stack, type StackTool } from "@/lib/data";

// Derive a 1–2 character monogram from a tool name ("Hugging Face" → "HF",
// "beehiiv" → "be", "n8n" → "n8"). Used both as the no-logo fallback and as
// the onError swap so a chip can never show a broken image.
function monogram(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, "").trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  const w = words[0] ?? name;
  return w.slice(0, 2);
}

function Monogram({ name }: { name: string }) {
  return (
    <span
      aria-hidden
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-semibold tracking-tight ring-1 ring-inset bg-black/[0.04] text-neutral-600 ring-black/10 dark:bg-white/[0.08] dark:text-neutral-200 dark:ring-white/15"
    >
      {monogram(name)}
    </span>
  );
}

function ToolChip({ tool }: { tool: StackTool }) {
  // Start in "broken" state when there is no slug at all, so we render the
  // monogram immediately with no network request and no flicker.
  const [broken, setBroken] = useState(tool.slug === null);

  return (
    <div
      className={[
        "group/chip flex items-center gap-2 rounded-full px-3 py-1.5",
        "text-xs font-medium transition-colors duration-200 ease-out",
        // Light: dark text on a faint dark wash so chips read on white.
        "border border-black/[0.08] bg-black/[0.03] text-neutral-700",
        "hover:border-black/20 hover:bg-black/[0.06] hover:text-neutral-900",
        // Dark: light text on a faint light wash.
        "dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-300",
        "dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white",
      ].join(" ")}
    >
      {broken ? (
        <Monogram name={tool.name} />
      ) : (
        // Two monochrome marks toggled by theme so the icon is always legible:
        // a dark-gray glyph on the white surface, a white glyph on the dark
        // surface. Plain <img> keeps us off next/image remote-domain config;
        // an error on the dark variant swaps both to the monogram fallback.
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${tool.slug}/525252`}
            alt=""
            aria-hidden
            width={20}
            height={20}
            loading="lazy"
            className="h-5 w-5 shrink-0 opacity-90 transition-opacity duration-200 group-hover/chip:opacity-100 dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${tool.slug}/white`}
            alt=""
            aria-hidden
            width={20}
            height={20}
            loading="lazy"
            className="hidden h-5 w-5 shrink-0 opacity-80 transition-opacity duration-200 group-hover/chip:opacity-100 dark:block"
            onError={() => setBroken(true)}
          />
        </>
      )}
      <span className="whitespace-nowrap">{tool.name}</span>
    </div>
  );
}

export default function Technologies() {
  return (
    <div className="flex h-full w-full items-start justify-center">
      <div
        className="flex max-w-2xl flex-wrap content-start justify-center gap-2 px-2 py-1"
        role="list"
        aria-label="AI-native and go-to-market tool stack"
      >
        {stack.map((tool) => (
          <div role="listitem" key={tool.name}>
            <ToolChip tool={tool} />
          </div>
        ))}
      </div>
    </div>
  );
}
