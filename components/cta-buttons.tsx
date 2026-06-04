"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Linkedin, Github, Download, Figma } from "lucide-react";
import { profile } from "@/lib/data";

// One compact row: the prominent primary "Let's talk" (email) followed by the
// secondary actions to its right (Résumé / GitHub / LinkedIn / Figma), all the
// same height so the row reads as one unit and keeps the hero card vertically
// tight. Wraps gracefully on very narrow widths.
export function CtaButtons({ className }: { className?: string }) {
  return (
    <div className={cn("flex w-full flex-wrap items-center gap-2", className)}>
      {/* Primary CTA — the single clear main action. */}
      <a href={profile.links.email}>
        <Button
          size="lg"
          variant="default"
          className="group/talk h-12 gap-2 px-5 text-base font-semibold shadow-sm"
        >
          <Mail className="h-5 w-5 transition-transform duration-300 group-hover/talk:-translate-y-px" />
          <span>Let&apos;s talk</span>
        </Button>
      </a>

      <a href={profile.links.resume} download>
        <Button
          variant="outline"
          size="lg"
          className="group/resume h-12 gap-2"
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
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="GitHub"
          className="group/gh h-12 w-12"
        >
          <Github className="h-4 w-4 transition-transform duration-300 group-hover/gh:-translate-y-px" />
        </Button>
      </a>

      <a
        href={profile.links.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="LinkedIn"
          className="group/li h-12 w-12"
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
      >
        <Button
          variant="outline"
          size="icon"
          aria-label="Portfolio"
          title="Portfolio"
          className="group/pf h-12 w-12"
        >
          <Figma className="h-4 w-4 transition-transform duration-300 group-hover/pf:-translate-y-px" />
        </Button>
      </a>
    </div>
  );
}
