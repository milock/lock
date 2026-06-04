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
import { Figma } from "lucide-react";
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

// Small pill that labels each project card as marketing/brand work or a
// vibe-coded build, so the mixed Projects row reads at a glance.
function ProjectBadge({ type }: { type: "marketing" | "build" }) {
  const isMarketing = type === "marketing";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-[3px] text-[10px] font-medium leading-none ring-1 ring-inset",
        isMarketing
          ? "bg-violet-500/10 text-violet-600 ring-violet-500/20 dark:text-violet-300"
          : "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300"
      )}
    >
      {isMarketing ? "Marketing" : "Vibe-coded"}
    </span>
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

  // About - centered profile composition: avatar → name → one-liner, vertically
  // and horizontally centered so the tile reads as an intentional, premium
  // profile card with no dead gap (name/description are blanked on the BentoCard
  // so they don't render bottom-anchored; the whole stack lives in `background`).
  {
    Icon: "",
    name: "",
    description: "",
    className: "col-span-3 md:col-span-1",
    href: profile.links.linkedin,
    cta: "Connect on LinkedIn",
    background: (
      <div className="absolute inset-0">
        {/* Illustrated avatar (black line-art on transparent) on a charcoal disc
            so it pops against the dark tile - the personal-brand moment. The
            avatar, name and one-liner form one centered group filling the tile. */}
        <div className="flex h-full w-full flex-col items-center justify-center gap-5 px-6 text-center transition-all duration-300 ease-out group-hover:-translate-y-2">
          <div className="transition-transform duration-300 ease-out group-hover:scale-[1.03]">
            <AvatarDisc />
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="text-3xl font-semibold leading-tight text-neutral-700 dark:text-neutral-200">
              {profile.name}
            </div>
            <p className="text-base text-neutral-500 dark:text-neutral-400">
              I build the thing from nothing.
            </p>
          </div>
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
          className="absolute inset-x-0 top-0 h-full [--duration:36s] [--gap:0.75rem] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_7%,#000_52%,transparent_82%)] w-full px-1"
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
                {role.url ? (
                  <a
                    href={role.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-w-0 flex-1 truncate text-sm font-bold leading-tight text-neutral-800 underline decoration-transparent underline-offset-2 transition-colors hover:decoration-current dark:text-white"
                  >
                    {role.company}
                  </a>
                ) : (
                  <span className="min-w-0 flex-1 truncate text-sm font-bold leading-tight text-neutral-800 dark:text-white">
                    {role.company}
                  </span>
                )}
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

  // Projects - its own full-width row so the cards have room to breathe and the
  // marquee can drift slowly. Each card uses a stretched link (the title's
  // ::after covers the card) so the whole card navigates to /projects/<slug>,
  // while a separate Figma link can still sit on top for design-led work.
  {
    Icon: "",
    name: "Projects",
    description: "Work I've shipped, from go-to-market to vibe-coded tools.",
    className: "col-span-3",
    href: profile.links.github,
    cta: "All projects on GitHub",
    background: (
      <div className="absolute h-full w-full left-0 top-0 origin-top rounded-md transition-all duration-300 ease-out group-hover:scale-[101%]">
        <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,#000_6%,#000_50%,transparent_80%)]">
          <Marquee
            className="absolute inset-x-0 top-0 h-full [--duration:64s] w-full items-start pt-5"
            pauseOnHover
          >
            {projects.map((project, idx) => (
              <div
                key={idx}
                className={cn(
                  "group/proj relative w-72 overflow-hidden rounded-xl border p-4 motion-safe:hover:-translate-y-1",
                  "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] hover:border-gray-950/[.2]",
                  "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15] dark:hover:border-gray-50/[.2]",
                  "transform-gpu transition-all duration-300 ease-out"
                )}
              >
                <div className="flex items-baseline justify-between gap-2">
                  {/* Stretched link: ::after covers the whole card, so the
                      entire tile is clickable while staying valid HTML. */}
                  <a
                    href={project.href}
                    className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wide text-neutral-800 after:absolute after:inset-0 dark:text-white"
                  >
                    {project.name}
                    <span
                      aria-hidden
                      className="translate-x-[-3px] text-neutral-400 opacity-0 transition-all duration-300 group-hover/proj:translate-x-0 group-hover/proj:opacity-100 dark:text-neutral-300"
                    >
                      →
                    </span>
                  </a>
                  <span className="shrink-0 text-[10px] text-neutral-500 dark:text-neutral-400">
                    {project.language}
                  </span>
                </div>

                <div className="mt-2.5 flex items-center gap-1.5">
                  <ProjectBadge type={project.type} />
                  {project.figma && (
                    // Sits above the stretched link (relative z-10) so it stays
                    // independently clickable.
                    <a
                      href={profile.links.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      className="relative z-10 inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-medium leading-none ring-1 ring-inset bg-black/[0.04] text-neutral-600 ring-black/10 transition-colors hover:bg-black/[0.08] dark:bg-white/[0.08] dark:text-neutral-200 dark:ring-white/15 dark:hover:bg-white/[0.14]"
                    >
                      <Figma className="h-3 w-3" />
                      Figma
                    </a>
                  )}
                </div>

                <blockquote className="mt-2.5 text-xs text-neutral-500 dark:text-neutral-400">
                  {project.description}
                </blockquote>
              </div>
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
    description: "Not a lot, but I'm proud of every single one.",
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
    href: profile.links.github,
    cta: "See some of the tools",
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
        <AnimatedBeamMultipleOutputs className="absolute inset-x-0 top-3 mx-auto h-[260px] w-full max-w-[600px] border-none transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_8%,#000_100%)] md:[mask-image:linear-gradient(to_top,transparent_0%,#000_100%)] motion-safe:group-hover:scale-105 sm:h-[300px]" />
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
          className="absolute inset-x-0 top-0 h-full items-start pt-5 [--duration:40s] [mask-image:linear-gradient(to_bottom,transparent_0%,#000_7%,#000_50%,transparent_80%)] w-full"
          pauseOnHover
        >
          {defaultDomains.map((f, idx) => (
            <div
              key={idx}
              className={cn(
                "relative w-44 cursor-default overflow-hidden rounded-xl border p-4 motion-safe:hover:-translate-y-1",
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
    className: "col-span-3 md:col-span-2",
    href: "/projects/lock",
    cta: "How I built it",
    background: (
      <div className="absolute h-full w-full left-0 top-0 origin-top rounded-md transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_8%,#000_36%)] group-hover:scale-[101%]">
        <div className="flex h-full w-full items-center justify-center p-4 pb-16 sm:items-center">
          <Terminal className="h-auto w-full max-w-md">
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

// Explicit visual order over the `features` array (indices below), with the
// interactive Ask tile spliced in right after About so the chatbot sits high on
// the page where Projects used to be. Projects then gets its own full row.
//   0 Hero · 1 About · 2 Experience · 3 Projects · 4 Stack
//   5 GitHub Stars · 6 AI-Native Ops · 7 Focus · 8 Contact · 9 Vibe-coded
// Rows (3 cols): [Hero2+About1] · [Ask3] · [Exp1+Stack2] · [Projects3]
//   · [Stars1+Focus2] · [AIOps3] · [Vibe2+Contact1]
const BEFORE_ASK = [0, 1];
const AFTER_ASK = [2, 4, 3, 5, 7, 6, 9, 8];

export function Bento() {
  return (
    <>
      <BentoGrid>
        {BEFORE_ASK.map((featureIdx, i) => (
          <BentoCard key={featureIdx} index={i} {...features[featureIdx]} />
        ))}

        {/* Featured "Ask this site anything" tile — full-width band that proves
            the AI-native positioning. Interactive, so it lives outside BentoCard
            (whose overlay is pointer-events-none). col-span-3 = full grid width. */}
        <RevealCard index={BEFORE_ASK.length} className="col-span-3 row-span-1">
          <AskTile />
        </RevealCard>

        {AFTER_ASK.map((featureIdx, i) => (
          <BentoCard
            key={featureIdx}
            index={BEFORE_ASK.length + 1 + i}
            {...features[featureIdx]}
          />
        ))}
      </BentoGrid>
    </>
  );
}
