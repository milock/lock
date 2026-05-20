"use client";

import { CtaButtons } from "@/components/cta-buttons";
import { profile } from "@/lib/data";

// Contact tile CTA — mirrors the Hero exactly via the shared CtaButtons group:
// primary "Let's talk" (email) + smaller Résumé(download) / GitHub / LinkedIn.
// Correct lucide icons (Mail / Download / Github / Linkedin) live in CtaButtons.
export function ContactButtons() {
  return <CtaButtons className="max-w-sm" />;
}

// Subtle status pill: "open to roles" linking to LinkedIn (replaces the old
// availability indicator).
export function OpenToRoles() {
  return (
    <a
      href={profile.links.linkedin}
      target="_blank"
      rel="noreferrer"
      className="absolute top-2 right-2 bg-background rounded-lg px-4 py-2 text-xs text-neutral-500 dark:text-neutral-300 max-w-3/4 w-fit"
    >
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full animate-pulse bg-emerald-400"></div>
        <div>open to roles</div>
      </div>
    </a>
  );
}
