"use client";

import { Button } from "@/components/ui/button";
import { SimpleTooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Mail, Linkedin, Github, Download, Figma } from "lucide-react";
import { profile } from "@/lib/data";

export function CtaButtons({ className, row = false }: { className?: string; row?: boolean }) {
  const socialLinks = [
    { label: "GitHub", href: profile.links.github, Icon: Github },
    { label: "LinkedIn", href: profile.links.linkedin, Icon: Linkedin },
    { label: "Figma portfolio", href: profile.links.portfolio, Icon: Figma },
  ];
  const resume = (
    <Button asChild variant="outline" className={cn("h-12 gap-2", !row && "min-w-0 flex-1 px-2")}>
      <a href={profile.links.resume} download><Download className="h-4 w-4" /><span>Résumé</span></a>
    </Button>
  );
  const socials = socialLinks.map(({ label, href, Icon }) => (
    <SimpleTooltip key={label} label={label}>
      <Button asChild variant="outline" size="icon" className="h-11 w-11 shrink-0">
        <a href={href} target="_blank" rel="noreferrer" aria-label={label}><Icon className="h-4 w-4" /></a>
      </Button>
    </SimpleTooltip>
  ));
  return (
    <div className={cn(row ? "flex flex-wrap items-center gap-2" : "flex w-full flex-col gap-3", className)}>
      <Button asChild size="lg" className={cn("h-12 gap-2 text-base font-semibold", row ? "px-5" : "w-full")}>
        <a href={profile.links.email}><Mail className="h-5 w-5" /><span>Email</span></a>
      </Button>
      {row ? <>{resume}<div className="flex items-center gap-2">{socials}</div></> : <div className="flex items-center gap-1">{resume}{socials}</div>}
    </div>
  );
}
