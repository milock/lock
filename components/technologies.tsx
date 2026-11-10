"use client";

import React, { useId, useState } from "react";
import { stack, type StackGroup, type StackTool } from "@/lib/data";
import { cn } from "@/lib/utils";
import { DisclosureButton } from "@/components/magicui/bento-grid";

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
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] text-[7.5px] font-semibold tracking-tight ring-1 ring-inset bg-black/[0.05] text-neutral-600 ring-black/10 dark:bg-white/[0.1] dark:text-neutral-200 dark:ring-white/15"
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
    <span
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium",
        "border border-black/[0.07] bg-black/[0.025] text-neutral-800",
        "dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-neutral-200"
      )}
    >
      {broken ? (
        <Monogram name={tool.name} />
      ) : (
        // Two monochrome marks toggled by theme so the icon is always legible.
        // Plain <img> keeps us off next/image remote-domain config; an error
        // on either variant swaps the chip to the monogram fallback.
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${tool.slug}/525252`}
            alt=""
            aria-hidden
            width={16}
            height={16}
            loading="lazy"
            onError={() => setBroken(true)}
            className="h-4 w-4 shrink-0 dark:hidden"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://cdn.simpleicons.org/${tool.slug}/white`}
            alt=""
            aria-hidden
            width={16}
            height={16}
            loading="lazy"
            className="hidden h-4 w-4 shrink-0 opacity-85 dark:block"
            onError={() => setBroken(true)}
          />
        </>
      )}
      <span className="whitespace-nowrap">{tool.name}</span>
    </span>
  );
}

const GROUPS: { id: StackGroup; label: string }[] = [
  { id: "build", label: "AI and build" },
  { id: "gtm", label: "Go-to-market" },
];

// How many chips of the first group show on a phone before "Show all": about
// three rows at 390px.
const MOBILE_PREVIEW = 10;

export default function Technologies() {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  return (
    <div className="px-5 sm:px-6">
      <div id={listId} className="flex flex-col gap-5">
        {GROUPS.map((group, groupIdx) => {
          const tools = stack.filter((t) => t.group === group.id);
          return (
            <section
              key={group.id}
              aria-labelledby={`${listId}-${group.id}`}
              className={cn(groupIdx > 0 && !expanded && "max-sm:hidden")}
            >
              <h3
                id={`${listId}-${group.id}`}
                className="mb-2.5 text-[13px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {tools.map((tool, i) => (
                  <li
                    key={tool.name}
                    className={cn(
                      groupIdx === 0 &&
                        i >= MOBILE_PREVIEW &&
                        !expanded &&
                        "max-sm:hidden"
                    )}
                  >
                    <ToolChip tool={tool} />
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <DisclosureButton
        controls={listId}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        moreLabel={`Show all ${stack.length} tools`}
        lessLabel="Show fewer tools"
        className="mt-3"
      />
    </div>
  );
}
