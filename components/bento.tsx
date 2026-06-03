"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatedBeamMultipleOutputs } from "@/components/animated-beam-multiple-outputs";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import BlurIn from "@/components/magicui/blur-in";
import { FadeIn } from "@/components/magicui/fade-in";
import Hero from "@/components/hero";
import Marquee from "@/components/magicui/marquee";
import Technologies from "@/components/technologies";
import ThemeToggle from "@/components/theme-toggle";
import RetroGrid from "@/components/magicui/retro-grid";
import { cn } from "@/lib/utils";
import {
  defaultDomains,
  experience,
  profile,
  projects,
} from "@/lib/data";
import { motion } from "framer-motion";
import GitHubStars from "@/components/github-stars";
import { ContactButtons, OpenToRoles } from "@/components/contact-button";
import { AvatarDisc } from "@/components/avatar-disc";
import { AskTile } from "@/components/ask-tile";
import { RevealCard } from "@/components/reveal-card";
import {
  Terminal,
  TypingAnimation,
  AnimatedSpan,
} from "@/components/magicui/terminal";

// Company monogram: 1–2 letters from the company name, used both as the
// no-domain fallback (ExSite) and as the onError swap so a logo can never
// render broken.
function companyMonogram(name: string): string {
  const words = name.replace(/[^A-Za-z0-9 ]/g, "").trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return (words[0] ?? name).slice(0, 2).toUpperCase();
}

// Small square logo for an experience card. Tries a remote favicon-style mark
// when a domain is given; falls back to a styled monogram on error or when no
// domain exists. Plain <img> keeps us off next/image remote-domain config.
function CompanyLogo({
  company,
  domain,
}: {
  company: string;
  domain?: string;
}) {
  const [broken, setBroken] = useState(!domain);

  // Consistent ~22px square mark with a soft ring so the logo and the monogram
  // fallback occupy identical space and align cleanly across all five cards.
  const monogramTile = (
    <span
      aria-hidden
      className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-md bg-neutral-100 text-[9px] font-semibold tracking-tight text-neutral-600 ring-1 ring-inset ring-black/[0.06] dark:bg-white/[0.08] dark:text-neutral-200 dark:ring-white/15"
    >
      {companyMonogram(company)}
    </span>
  );

  if (broken) return monogramTile;

  return (
    // Plain <img> (not next/image) so we avoid remote-domain config and can
    // swap to a monogram on error. Google's favicon service is a reliable,
    // config-free logo source; the monogram fallback guarantees no broken mark.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      aria-hidden
      width={22}
      height={22}
      loading="lazy"
      className="h-[22px] w-[22px] shrink-0 rounded-md bg-white object-contain p-px ring-1 ring-inset ring-black/[0.06] dark:ring-white/10"
      onError={() => setBroken(true)}
    />
  );
}

const features = [
  // Hero - headline + tagline + theme toggle
  {
    Icon: "",
    name: "",
    description: "",
    href: "",
    cta: "",
    className: "col-span-3 md:col-span-2",
    background: (
      <>
        <div
          id="hero"
          className="absolute right-0 top-0 h-full w-full border-none transition-all duration-300 ease-out"
        >
          <Hero />
        </div>

        <div className="absolute right-0 top-0 z-50">
          <FadeIn direction="down">
            <ThemeToggle />
          </FadeIn>
        </div>
      </>
    ),
  },

  // About - name + headshot + one-line statement (links live in the Hero and Contact tiles)
  {
    Icon: "",
    name: profile.name,
    description: "I build the thing from nothing.",
    className: "col-span-3 md:col-span-1",
    href: profile.links.linkedin,
    cta: "Connect on LinkedIn",
    background: (
      <div>
        {/* Illustrated avatar (black line-art on transparent) on a warm cream
            disc so it pops against the dark tile - the personal-brand moment.
            Sits upper-right; the name + one-liner are rendered by BentoCard
            below it, so the composition reads as a clean profile card. */}
        <div className="absolute right-6 top-7 transition-all duration-300 ease-out group-hover:scale-[1.02]">
          <AvatarDisc />
        </div>

        <FadeIn
          direction="right"
          framerProps={{
            show: { transition: { delay: 1.5 } },
          }}
        >
          <OpenToRoles />
        </FadeIn>
      </div>
    ),
  },

  // Experience - Clarity → Meta
  {
    Icon: "",
    name: "Experience",
    description: "Where I've built and what it returned.",
    href: profile.links.linkedin,
    cta: "Full history on LinkedIn",
    className: "col-span-3 md:col-span-1",
    background: (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <Marquee
          vertical
          className="absolute h-3/4 top-6 [--duration:36s] [--gap:0.75rem] [mask-image:linear-gradient(to_top,transparent_5%,#000_60%)] w-full px-1"
          pauseOnHover
        >
          {experience.map((role, idx) => (
            <div
              key={idx}
              className={cn(
                "group/exp relative w-full cursor-default overflow-hidden rounded-xl border px-3.5 py-3",
                "border-gray-950/[.08] bg-white",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.06]",
                "transform-gpu transition-all duration-300 ease-out",
                "hover:border-gray-950/[.16] hover:bg-gray-950/[.02]",
                "dark:hover:border-gray-50/[.2] dark:hover:bg-gray-50/[.1]"
              )}
            >
              {/* Top row: logo + bold company name (no years, per design). */}
              <div className="flex items-center gap-2">
                <CompanyLogo
                  company={role.company}
                  domain={role.logoDomain || undefined}
                />
                <span className="min-w-0 flex-1 truncate text-sm font-bold leading-tight text-neutral-800 dark:text-white">
                  {role.company}
                </span>
              </div>

              {/* One-line role title — clearly secondary to the company. */}
              <div className="mt-1 truncate whitespace-nowrap text-xs font-medium text-neutral-500 dark:text-neutral-400">
                {role.title}
              </div>

              {/* Refined trust badges — consistent padding, subtle fill/border,
                  no-wrap so the row never breaks awkwardly. */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-hidden">
                {role.badges.map((badge) => (
                  <span
                    key={badge}
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2 py-[3px] text-[10px] font-medium leading-none whitespace-nowrap",
                      "border border-gray-950/[.07] bg-gray-950/[.025] text-neutral-600",
                      "dark:border-gray-50/[.12] dark:bg-gray-50/[.06] dark:text-neutral-300"
                    )}
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Hairline divider, then the metric as quiet supporting text. */}
              <div className="mt-2.5 border-t border-gray-950/[.06] pt-2 dark:border-gray-50/[.08]">
                <p className="text-[11px] leading-snug text-neutral-500 dark:text-neutral-400">
                  {role.metric}
                </p>
              </div>
            </div>
          ))}
        </Marquee>
      </motion.div>
    ),
  },

  // Projects - moved into the prominent col-span-2 slot right after Experience.
  // Cards link INTERNALLY to each project's own page (/projects/<slug>) with a
  // subtle "→" hover affordance. Pairs with Experience (1 + 2 = 3).
  {
    Icon: "",
    name: "Projects",
    description: "Open-source tools I built for the way I work.",
    className: "col-span-3 md:col-span-2",
    href: profile.links.github,
    cta: "All projects on GitHub",
    background: (
      <div className="absolute h-full w-full left-0 top-0 origin-top rounded-md transition-all duration-300 ease-out group-hover:scale-[102%]">
        <div className="absolute h-full w-full [mask-image:linear-gradient(to_top,transparent_20%,#000_70%)]">
          <Marquee
            className="absolute h-2/3 top-8 [--duration:30s] w-full"
            pauseOnHover
          >
            {projects.map((project, idx) => (
              <a
                key={idx}
                href={project.href}
                className={cn(
                  "group/proj relative w-72 cursor-pointer overflow-hidden rounded-xl border p-4 motion-safe:hover:-translate-y-1",
                  "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] hover:border-gray-950/[.2]",
                  "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] dark:hover:border-gray-50/[.2]",
                  "transform-gpu transition-all duration-300 ease-out"
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <figcaption className="flex items-center gap-1.5 text-base font-bold dark:text-white">
                    {project.name}
                    {/* Subtle internal-nav affordance: arrow slides in on hover. */}
                    <span
                      aria-hidden
                      className="translate-x-[-3px] text-neutral-400 opacity-0 transition-all duration-300 group-hover/proj:translate-x-0 group-hover/proj:opacity-100 dark:text-neutral-300"
                    >
                      →
                    </span>
                  </figcaption>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400">
                    {project.language}
                  </span>
                </div>
                <blockquote className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                  {project.description}
                </blockquote>
              </a>
            ))}
          </Marquee>
        </div>
      </div>
    ),
  },

  // Stack - AI/GTM icon cloud. Relocated to pair with GitHub Stars (2 + 1 = 3).
  {
    Icon: "",
    name: "Stack",
    description:
      "The AI-native and go-to-market tools I build the function on.",
    href: profile.links.github,
    cta: "See the open-source tools",
    className: "col-span-3 md:col-span-2",
    background: (
      <div className="absolute inset-x-0 top-0 h-[78%] origin-top px-6 pt-6 transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_8%,#000_45%)] group-hover:scale-[1.02]">
        <FadeIn
          direction="up"
          className="flex h-full w-full items-start justify-center"
        >
          <Technologies />
        </FadeIn>
      </div>
    ),
  },

  // GitHub Stars - live, points at humanizer. Pairs with Stack (2 + 1 = 3).
  {
    Icon: "",
    name: "GitHub Stars",
    description: "Live across my open-source repos.",
    className: "col-span-3 md:col-span-1",
    href: `${process.env.GITHUB_URL || "https://github.com/milock"}/${
      process.env.REPO_NAME || "humanizer"
    }`,
    cta: "Star the repo",
    background: (
      <div className="absolute h-full w-full left-0 top-0 origin-top rounded-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_70%)] group-hover:scale-105 group-hover:-translate-y-4">
        <div className="text-7xl font-semibold w-full flex justify-center items-center h-2/3 group-hover:-translate-y-2 transition-all duration-300">
          <a
            href={`${process.env.GITHUB_URL || "https://github.com/milock"}/${
              process.env.REPO_NAME || "humanizer"
            }`}
            className="flex items-center gap-2 border shadow-xl p-5 rounded-lg border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
          >
            <GitHubStars />
            <Image
              src="/images/githubstar.webp"
              alt="GitHub star"
              className="h-14 w-14 drop-shadow"
              width={56}
              height={56}
              priority
            />
          </a>
        </div>
      </div>
    ),
  },

  // AI-native ops - animated beam. Full-width band (col-span-3) so the wide beam
  // graphic reads at its intended scale and the row tiles cleanly on its own.
  {
    Icon: "",
    name: "AI-Native Ops",
    description:
      "A self-built multi-agent system that delivers a team's output, solo.",
    href: "/projects/humanizer",
    cta: "See the tools",
    className: "col-span-3",
    background: (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        {/* w-full + max-w-[600px] (instead of a fixed w-[600px]) lets the beam
            shrink to fit the tile on mobile so the right-most nodes never clip;
            it still renders at full 600px scale on wider screens. */}
        <AnimatedBeamMultipleOutputs className="absolute inset-x-0 top-4 mx-auto h-[280px] w-full max-w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] md:[mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] motion-safe:group-hover:scale-105 sm:h-[300px]" />
      </motion.div>
    ),
  },

  // Focus areas - marquee over focusAreas/defaultDomains
  {
    Icon: "",
    name: "Focus areas",
    description: "Where I spend my time.",
    href: profile.links.linkedin,
    cta: "More on LinkedIn",
    className: "col-span-3 md:col-span-2",
    background: (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: 0.15 }}
      >
        <Marquee
          className="absolute h-2/3 top-10 [--duration:40s] [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] w-full"
          pauseOnHover
        >
          {defaultDomains.map((f, idx) => (
            <div
              key={idx}
              className={cn(
                "relative w-44 h-full cursor-default overflow-hidden rounded-xl border p-4 motion-safe:hover:-translate-y-1",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] hover:border-gray-950/[.2]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] dark:hover:border-gray-50/[.2]",
                "transform-gpu transition-all duration-300 ease-out"
              )}
            >
              <figcaption className="text-lg font-bold dark:text-white">
                {f.name}
              </figcaption>
              <blockquote className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                {f.body}
              </blockquote>
            </div>
          ))}
        </Marquee>
      </motion.div>
    ),
  },

  // Contact - email / LinkedIn / GitHub / résumé buttons (pairs with Focus, 2 + 1)
  {
    Icon: "",
    name: "",
    description: "",
    className: "col-span-3 md:col-span-1",
    href: "",
    cta: "",
    background: (
      <div
        id="contact"
        className="absolute h-full w-full left-0 top-0 origin-top rounded-md transition-all duration-300 ease-out"
      >
        <div className="absolute inset-0 z-50 flex flex-col justify-center items-start gap-4 p-6">
          <div className="text-4xl md:text-5xl font-semibold text-neutral-700 dark:text-neutral-300">
            <BlurIn duration={0.5}>Get in touch.</BlurIn>
          </div>
          <ContactButtons />
        </div>
        <RetroGrid />
      </div>
    ),
  },

  // Vibe-coded - full-width band that closes the grid above the Ask tile.
  // Celebrates that Michael built this site himself, with AI as the pair.
  // Full width keeps every row evenly tiled. Links to the site's own project page.
  {
    Icon: "",
    name: "Vibe-coded by me",
    description: "No template, no agency. I built this site myself, with AI.",
    className: "col-span-3",
    href: "/projects/lock",
    cta: "How I built it",
    background: (
      <div className="absolute h-full w-full left-0 top-0 origin-top rounded-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_30%,#000_70%)] group-hover:scale-[101%]">
        <div className="flex items-center justify-center h-full w-full p-4">
          <Terminal className="w-full max-w-md">
            <TypingAnimation>$ git log --oneline this-site</TypingAnimation>
            <AnimatedSpan>✔ Next.js + TypeScript + Tailwind</AnimatedSpan>
            <AnimatedSpan>✔ Designed, built and shipped solo</AnimatedSpan>
            <AnimatedSpan>✔ AI as the pair, me on the wheel</AnimatedSpan>
            <AnimatedSpan className="flex items-center gap-2 text-green-500">
              ✓ Vibe-coded. Live.
              {/* Small Notion-face signature on a cream disc - a quiet "made by me" mark. */}
              <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-[#faf3e6] ring-1 ring-inset ring-black/10">
                <Image
                  src={profile.avatar}
                  alt=""
                  aria-hidden
                  width={28}
                  height={28}
                  className="h-[120%] w-[120%] translate-y-[10%] object-contain object-bottom"
                />
              </span>
            </AnimatedSpan>
          </Terminal>
        </div>
      </div>
    ),
  },
];

export function Bento() {
  return (
    <>
      <BentoGrid>
        {features.map((feature, idx) => (
          <BentoCard key={idx} index={idx} {...feature} />
        ))}

        {/* Featured "Ask this site anything" tile — full-width band that proves
            the AI-native positioning. Interactive, so it lives outside BentoCard
            (whose overlay is pointer-events-none). col-span-3 = full grid width.
            Reveals last in the stagger sequence. */}
        <RevealCard index={features.length} className="col-span-3 row-span-1">
          <AskTile />
        </RevealCard>
      </BentoGrid>
    </>
  );
}
