"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Linkedin, Github, Download, Figma } from "lucide-react";
import { profile } from "@/lib/data";

// Shared CTA hierarchy used by BOTH the Hero and the Contact tile so they stay
// visually identical: one prominent primary "Let's talk" (email), then a row of
// smaller secondary icon-forward buttons (Résumé / GitHub / LinkedIn). The icons
// are correct lucide marks — Mail, Download, Github, Linkedin.
export function CtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {/* Primary CTA — larger, full-width, the single clear main action. */}
      <a href={profile.links.email} className="block">
        <Button
          size="lg"
          variant="default"
          className="group/talk h-12 w-full gap-2 text-base font-semibold shadow-sm"
        >
          <Mail className="h-5 w-5 transition-transform duration-300 group-hover/talk:-translate-y-px" />
          <span>Let&apos;s talk</span>
        </Button>
      </a>

      {/* Secondary row — smaller, subordinate, icon-forward. */}
      <div className="flex items-center gap-2">
        <a href={profile.links.resume} download className="flex-1">
          <Button
            variant="outline"
            size="default"
            className="group/resume w-full gap-2"
          >
            <Download className="h-4 w-4 transition-transform duration-300 group-hover/resume:translate-y-px" />
            <span>Résumé</span>
          </Button>
        </a>

        <a
          href={profile.links.github}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
          className="shrink-0"
        >
          <Button
            variant="outline"
            size="icon"
            aria-label="GitHub"
            className="group/gh"
          >
            <Github className="h-4 w-4 transition-transform duration-300 group-hover/gh:-translate-y-px" />
          </Button>
        </a>

        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label="LinkedIn"
          className="shrink-0"
        >
          <Button
            variant="outline"
            size="icon"
            aria-label="LinkedIn"
            className="group/li"
          >
            <Linkedin className="h-4 w-4 transition-transform duration-300 group-hover/li:-translate-y-px" />
          </Button>
        </a>

        <a
          href={profile.links.portfolio}
          target="_blank"
          rel="noreferrer"
          aria-label="Portfolio"
          title="Portfolio"
          className="shrink-0"
        >
          <Button
            variant="outline"
            size="icon"
            aria-label="Portfolio"
            title="Portfolio"
            className="group/pf"
          >
            <Figma className="h-4 w-4 transition-transform duration-300 group-hover/pf:-translate-y-px" />
          </Button>
        </a>
      </div>
    </div>
  );
}
