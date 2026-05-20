"use client";

import { Button } from "@/components/ui/button";
import { Mail, Linkedin, Github, FileText } from "lucide-react";
import { profile } from "@/lib/data";

export function ContactButtons() {
  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <div className="flex flex-wrap items-center gap-2">
        <a href={profile.links.email} className="flex-1 min-w-[8rem]">
          <Button
            variant="default"
            size="lg"
            className="flex items-center gap-2 w-full group/Mail"
          >
            <Mail className="h-5 w-5 lg:group-hover/Mail:translate-x-1 transition-all duration-300" />
            <span>Email</span>
          </Button>
        </a>

        <a
          href={profile.links.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex-1 min-w-[8rem]"
        >
          <Button
            variant="default"
            size="lg"
            className="flex items-center gap-2 w-full group/LinkedIn"
          >
            <Linkedin className="h-5 w-5 lg:group-hover/LinkedIn:translate-x-1 transition-all duration-300" />
            <span>LinkedIn</span>
          </Button>
        </a>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <a
          href={profile.links.github}
          target="_blank"
          rel="noreferrer"
          className="flex-1 min-w-[8rem]"
        >
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 w-full group/Github"
          >
            <Github className="h-5 w-5 lg:group-hover/Github:translate-x-1 transition-all duration-300" />
            <span>GitHub</span>
          </Button>
        </a>

        <a href={profile.links.resume} className="flex-1 min-w-[8rem]">
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2 w-full group/Resume"
          >
            <FileText className="h-5 w-5 lg:group-hover/Resume:translate-x-1 transition-all duration-300" />
            <span>Résumé</span>
          </Button>
        </a>
      </div>
    </div>
  );
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
