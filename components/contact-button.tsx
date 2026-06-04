"use client";

import { CtaButtons } from "@/components/cta-buttons";
import { profile } from "@/lib/data";

// Contact tile CTA — mirrors the Hero exactly via the shared CtaButtons group:
// primary "Let's talk" (email) + smaller Résumé(download) / GitHub / LinkedIn.
// Correct lucide icons (Mail / Download / Github / Linkedin) live in CtaButtons.
export function ContactButtons() {
  return <CtaButtons className="max-w-sm" />;
}

// Status indicator: a glowing green dot linking to LinkedIn that expands to
// reveal "open to roles" on hover.
export function OpenToRoles() {
  return (
    <a
      href={profile.links.linkedin}
      target="_blank"
      rel="noreferrer"
      aria-label="Open to roles"
      title="Open to roles"
      className="group absolute right-2 top-2 z-20 flex items-center rounded-full border border-emerald-400/20 bg-background/70 p-2 backdrop-blur transition-colors duration-300 ease-out hover:border-emerald-400/40"
    >
      {/* Glowing green dot — a soft radar ping plus a steady glow. */}
      <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.65)]" />
      </span>
      {/* Label stays collapsed to just the dot, then expands smoothly on hover. */}
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium text-neutral-600 opacity-0 transition-all duration-300 ease-out group-hover:ml-2 group-hover:max-w-[140px] group-hover:opacity-100 dark:text-neutral-200">
        open to roles
      </span>
    </a>
  );
}
