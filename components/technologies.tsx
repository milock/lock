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
      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/[0.08] text-[10px] font-semibold tracking-tight text-neutral-200 ring-1 ring-inset ring-white/15"
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
        "border border-white/[0.08] bg-white/[0.04]",
        "text-xs font-medium text-neutral-300",
        "transition-colors duration-200 ease-out",
        "hover:border-white/20 hover:bg-white/[0.08] hover:text-white",
      ].join(" ")}
    >
      {broken ? (
        <Monogram name={tool.name} />
      ) : (
        // Plain <img> (not next/image) so we avoid remote-domain config and
        // can swap to a monogram on error. The /white variant keeps every
        // mark monochrome and legible on the dark surface.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${tool.slug}/white`}
          alt=""
          aria-hidden
          width={20}
          height={20}
          loading="lazy"
          className="h-5 w-5 shrink-0 opacity-80 transition-opacity duration-200 group-hover/chip:opacity-100"
          onError={() => setBroken(true)}
        />
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
