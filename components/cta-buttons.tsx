"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Mail, Linkedin, Github, Download, Figma } from "lucide-react";
import { profile } from "@/lib/data";

// Primary "Let's talk" (email) plus secondary actions (Résumé / GitHub /
// LinkedIn / Figma). Two layouts:
//   - row:   one compact wrapping row (used by the WIDE hero card).
//   - stack: "Let's talk" full-width on top, the rest in a row below (used by
//            the NARROW Contact tile, where a single row would wrap awkwardly).
export function CtaButtons({
  className,
  row = false,
}: {
  className?: string;
  row?: boolean;
}) {
  const github = (
    <a
      href={profile.links.github}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub"
      className={row ? undefined : "shrink-0"}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="GitHub"
        className={cn("group/gh", row && "h-12 w-12")}
      >
        <Github className="h-4 w-4 transition-transform duration-300 group-hover/gh:-translate-y-px" />
      </Button>
    </a>
  );

  const linkedin = (
    <a
      href={profile.links.linkedin}
      target="_blank"
      rel="noreferrer"
      aria-label="LinkedIn"
      className={row ? undefined : "shrink-0"}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="LinkedIn"
        className={cn("group/li", row && "h-12 w-12")}
      >
        <Linkedin className="h-4 w-4 transition-transform duration-300 group-hover/li:-translate-y-px" />
      </Button>
    </a>
  );

  const figma = (
    <a
      href={profile.links.portfolio}
      target="_blank"
      rel="noreferrer"
      aria-label="Portfolio"
      title="Portfolio"
      className={row ? undefined : "shrink-0"}
    >
      <Button
        variant="outline"
        size="icon"
        aria-label="Portfolio"
        title="Portfolio"
        className={cn("group/pf", row && "h-12 w-12")}
      >
        <Figma className="h-4 w-4 transition-transform duration-300 group-hover/pf:-translate-y-px" />
      </Button>
    </a>
  );

  const letsTalk = (
    <a href={profile.links.email} className={row ? undefined : "block"}>
      <Button
        size="lg"
        variant="default"
        className={cn(
          "group/talk h-12 gap-2 text-base font-semibold shadow-sm",
          row ? "px-5" : "w-full"
        )}
      >
        <Mail className="h-5 w-5 transition-transform duration-300 group-hover/talk:-translate-y-px" />
        <span>Email</span>
      </Button>
    </a>
  );

  if (row) {
    return (
      <div className={cn("flex w-full flex-wrap items-center gap-2", className)}>
        {letsTalk}
        <a href={profile.links.resume} download>
          <Button variant="outline" size="lg" className="group/resume h-12 gap-2">
            <Download className="h-4 w-4 transition-transform duration-300 group-hover/resume:translate-y-px" />
            <span>Résumé</span>
          </Button>
        </a>
        {github}
        {linkedin}
        {figma}
      </div>
    );
  }

  // Stacked (narrow) layout.
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      {letsTalk}
      <div className="flex items-center gap-2">
        <a href={profile.links.resume} download className="flex-1">
          <Button variant="outline" size="default" className="group/resume w-full gap-2">
            <Download className="h-4 w-4 transition-transform duration-300 group-hover/resume:translate-y-px" />
            <span>Résumé</span>
          </Button>
        </a>
        {github}
        {linkedin}
        {figma}
      </div>
    </div>
  );
}
