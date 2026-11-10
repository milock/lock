"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { AnimatedBeamMultipleOutputs } from "@/components/animated-beam-multiple-outputs";
import {
  BentoCard,
  BentoGrid,
  DisclosureButton,
  tileHeadingClass,
} from "@/components/magicui/bento-grid";

import { FadeIn } from "@/components/magicui/fade-in";
import Hero from "@/components/hero";
import Technologies from "@/components/technologies";
import ThemeToggle from "@/components/theme-toggle";
import RetroGrid from "@/components/magicui/retro-grid";
import { cn } from "@/lib/utils";
import {
  experience,
  focusAreas,
  profile,
  projects,
  type ProjectType,
  type Role,
} from "@/lib/data";
import {
  ArrowUpRight,
  Figma,
  Github,
  Linkedin,
  Target,
  Tags,
  Swords,
  Bot,
  Megaphone,
  Layers,
  type LucideIcon,
} from "lucide-react";
import GitHubStars from "@/components/github-stars";
import { ContactButtons } from "@/components/contact-button";
import { PageActionsCompact } from "@/components/page-actions";
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

// Small square logo for a timeline row. Tries a remote favicon-style mark when
// a domain is given; falls back to a styled monogram on error or when no domain
// exists. Plain <img> keeps us off next/image remote-domain config.
function CompanyLogo({
  company,
  domain,
}: {
  company: string;
  domain?: string;
}) {
  const [broken, setBroken] = useState(!domain);

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

// "2026 to now", "2023 to 2025", or just the start year when the end is not
// confirmed in the résumé source.
function formatYears(role: Role): string {
  if (role.end === "now") return `${role.start} to now`;
  if (role.end === null) return `${role.start}`;
  return `${role.start} to ${role.end}`;
}

const quietChip =
  "inline-flex items-center whitespace-nowrap rounded-[5px] px-1.5 py-[3px] text-[10.5px] font-medium leading-none ring-1 ring-inset bg-black/[0.03] text-neutral-600 ring-black/[0.07] dark:bg-white/[0.05] dark:text-neutral-300 dark:ring-white/[0.1]";

// How many roles a phone shows before "Show earlier roles".
const ROLES_PREVIEW = 4;

function ExperienceTimeline() {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  return (
    <div className="px-5 sm:px-6">
      <ol
        id={listId}
        aria-label="Roles, most recent first"
        className="divide-y divide-black/[0.05] dark:divide-white/[0.06]"
      >
        {experience.map((role, idx) => (
          <li
            key={role.company}
            className={cn(
              "grid grid-cols-[22px_minmax(0,1fr)] gap-x-3 py-3 first:pt-0 last:pb-1",
              idx >= ROLES_PREVIEW && !expanded && "max-sm:hidden"
            )}
          >
            <span className="mt-px">
              <CompanyLogo company={role.company} domain={role.logoDomain || undefined} />
            </span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-3">
                <p className="flex min-w-0 flex-1 flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm leading-snug">
                  {role.url ? (
                    <a
                      href={role.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-neutral-950 underline decoration-neutral-950/0 underline-offset-[3px] transition-colors hover:decoration-neutral-950/40 dark:text-white dark:decoration-white/0 dark:hover:decoration-white/50"
                    >
                      {role.company}
                    </a>
                  ) : (
                    <span className="font-semibold text-neutral-950 dark:text-white">
                      {role.company}
                    </span>
                  )}
                  <span className="text-neutral-600 dark:text-neutral-400">{role.title}</span>
                </p>
                <span className="shrink-0 text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                  {formatYears(role)}
                </span>
              </div>
              <p className="mt-1 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
                {role.metric}
                {role.badges.map((badge) => (
                  <span key={badge} className={cn(quietChip, "ml-1.5 align-[1px]")}>
                    {badge}
                  </span>
                ))}
              </p>
            </div>
          </li>
        ))}
      </ol>
      <DisclosureButton
        controls={listId}
        expanded={expanded}
        onToggle={() => setExpanded((v) => !v)}
        moreLabel="Show earlier roles"
        lessLabel="Show fewer roles"
        className="mt-2"
      />
    </div>
  );
}

// Small pill that labels each project card as marketing/brand work or a
// vibe-coded build, so the mixed grid reads at a glance.
function ProjectBadge({ type }: { type: ProjectType }) {
  const isMarketing = type === "marketing";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-[3px] text-[10px] font-medium leading-none ring-1 ring-inset",
        isMarketing
          ? "bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300"
          : "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300"
      )}
    >
      {isMarketing ? "Marketing" : "Vibe-coded"}
    </span>
  );
}

// Secondary link chip on a project card. Visually the same height as the type
// badge; the ::before expands the hit area to 44px tall without changing layout.
const projectLinkChip =
  "relative z-10 inline-flex items-center gap-1 rounded-full px-2 py-[3px] text-[10px] font-medium leading-none ring-1 ring-inset bg-black/[0.04] text-neutral-700 ring-black/10 transition-colors hover:bg-black/[0.08] hover:text-neutral-950 dark:bg-white/[0.08] dark:text-neutral-200 dark:ring-white/15 dark:hover:bg-white/[0.14] dark:hover:text-white before:absolute before:-inset-x-1 before:-inset-y-3.5 before:content-['']";

type Filter = "all" | ProjectType;
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "marketing", label: "Marketing" },
  { id: "build", label: "Vibe-coded" },
];
const PROJECTS_PREVIEW = 6;

function ProjectsGrid() {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const reduceMotion = useReducedMotion();
  const listId = useId();
  const visible = projects.filter((p) => filter === "all" || p.type === filter);
  const count = (f: Filter) =>
    f === "all" ? projects.length : projects.filter((p) => p.type === f).length;
  // Lead card widens so the last row of the grid is always full: at 3 columns
  // (lg) and at 2 columns (sm), whatever the filter leaves visible.
  const n = visible.length;
  const leadSpan = cn(
    n % 2 === 1 && "sm:col-span-2",
    n % 3 === 0 ? "lg:col-span-1" : n % 3 === 2 ? "lg:col-span-2" : "lg:col-span-3"
  );
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div className="px-5 sm:px-6">
      <div
        role="group"
        aria-label="Filter projects"
        className="mb-4 inline-flex rounded-full bg-black/[0.04] p-1 ring-1 ring-inset ring-black/[0.06] dark:bg-white/[0.05] dark:ring-white/[0.08]"
      >
        {FILTERS.map((f) => {
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setFilter(f.id);
                setExpanded(false);
              }}
              className={cn(
                "inline-flex min-h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium transition-colors sm:min-h-8",
                active
                  ? "bg-white text-neutral-950 shadow-[0_1px_2px_rgba(0,0,0,.08)] dark:bg-white/[0.14] dark:text-white dark:shadow-none"
                  : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white"
              )}
            >
              {f.label}
              <span
                className={cn(
                  "tabular-nums",
                  active ? "text-neutral-500 dark:text-neutral-300" : "text-neutral-400 dark:text-neutral-500"
                )}
              >
                {count(f.id)}
              </span>
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        <motion.ul
          id={listId}
          layout={!reduceMotion}
          transition={transition}
          className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-3"
        >
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((project, idx) => (
              <motion.li
                key={project.slug}
                layout={!reduceMotion}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, scale: 0.98 }}
                transition={transition}
                className={cn(
                  "group/proj relative flex h-full flex-col rounded-xl p-4 transition-colors duration-200",
                  "bg-neutral-50 ring-1 ring-inset ring-black/[0.06] hover:bg-neutral-100 hover:ring-black/[0.1]",
                  "dark:bg-white/[0.04] dark:ring-white/[0.08] dark:hover:bg-white/[0.07] dark:hover:ring-white/[0.14]",
                  idx === 0 && leadSpan,
                  idx >= PROJECTS_PREVIEW && !expanded && "max-sm:hidden"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    {/* Stretched link: ::after covers the whole card, so the
                        entire tile is clickable while staying valid HTML. The
                        focus ring draws on that ::after, around the card. */}
                    <a
                      href={project.href}
                      className="text-[15px] font-semibold leading-snug text-neutral-950 outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring dark:text-white"
                    >
                      {project.name}
                    </a>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                      {project.language}
                    </p>
                  </div>
                  <ArrowUpRight
                    aria-hidden
                    className="pointer-events-none mt-0.5 h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 group-hover/proj:text-neutral-700 motion-safe:group-hover/proj:-translate-y-0.5 motion-safe:group-hover/proj:translate-x-0.5 dark:text-neutral-500 dark:group-hover/proj:text-neutral-200"
                  />
                </div>

                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {project.description}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <ProjectBadge type={project.type} />
                  {project.figma && (
                    <a
                      href={profile.links.portfolio}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} in the Figma portfolio`}
                      className={projectLinkChip}
                    >
                      <Figma aria-hidden className="h-3 w-3" />
                      Figma
                    </a>
                  )}
                  {project.repo && (
                    <a
                      href={project.repo}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} on GitHub`}
                      className={projectLinkChip}
                    >
                      <Github aria-hidden className="h-3 w-3" />
                      GitHub
                    </a>
                  )}
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>

      {visible.length > PROJECTS_PREVIEW ? (
        <DisclosureButton
          controls={listId}
          expanded={expanded}
          onToggle={() => setExpanded((v) => !v)}
          moreLabel={`Show all ${visible.length} projects`}
          lessLabel="Show fewer projects"
          className="mt-3"
        />
      ) : null}
    </div>
  );
}

// One relevant icon per focus area, keyed by name.
const FOCUS_ICONS: Record<string, LucideIcon> = {
  "Go-to-Market": Target,
  "Pricing & Packaging": Tags,
  "Competitive Intel": Swords,
  "AI-Native Ops": Bot,
  "Demand & Content": Megaphone,
  Product: Layers,
};

function FocusList() {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 px-5 min-[360px]:grid-cols-2 sm:px-6 lg:grid-cols-3">
      {focusAreas.map((f) => {
        const Icon = FOCUS_ICONS[f.name];
        return (
          <div key={f.name} className="border-t border-black/[0.06] pt-3 dark:border-white/[0.08]">
            <dt className="flex items-center gap-1.5 text-sm font-semibold text-neutral-950 dark:text-white">
              {Icon ? (
                <Icon aria-hidden className="h-3.5 w-3.5 shrink-0 text-neutral-500 dark:text-neutral-400" />
              ) : null}
              {f.name}
            </dt>
            <dd className="mt-1 text-[13px] leading-relaxed text-neutral-600 dark:text-neutral-400">
              {f.body}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

const features = {
  // Hero: headline, pills, CTAs, theme toggle.
  hero: {
    className: "col-span-3 md:col-span-2",
    background: (
      <>
        <div id="hero" className="relative w-full flex-1">
          <Hero />
        </div>

        <div className="absolute right-0 top-0 z-50">
          <FadeIn direction="down">
            <div className="flex items-center">
              <PageActionsCompact mdPath="/llms.txt" />
              <ThemeToggle />
            </div>
          </FadeIn>
        </div>
      </>
    ),
  },

  // About: avatar, name and role as one centered group. order-first pulls it
  // above the hero on phones; md resets to DOM order so desktop keeps hero-left.
  about: {
    className: "col-span-3 md:col-span-1 order-first md:order-none min-h-[19rem] md:min-h-0",
    href: profile.links.linkedin,
    cta: "Connect on LinkedIn",
    ctaIcon: <Linkedin className="mr-2 h-4 w-4" />,
    ctaCenter: true,
    background: (
      <div className="absolute inset-0">
        <div className="flex h-full w-full -translate-y-5 flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]">
            <AvatarDisc />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <p className="text-[1.75rem] font-semibold leading-tight tracking-[-0.02em] text-neutral-950 dark:text-white">
              {profile.name}
            </p>
            <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
              Principal Product Marketer <br />at Super Green
            </p>
          </div>
        </div>
      </div>
    ),
  },

  experience: {
    name: "Experience",
    description: "Current role and the work that led here.",
    href: profile.links.linkedin,
    cta: "Full history on LinkedIn",
    ctaIcon: <Linkedin className="mr-2 h-4 w-4" />,
    className: "col-span-3 lg:col-span-2",
    content: <ExperienceTimeline />,
  },

  stack: {
    name: "Stack",
    description: "The tools I use for research, writing, design, and building.",
    href: profile.links.github,
    cta: "See the open-source tools",
    ctaIcon: <Github className="mr-2 h-4 w-4" />,
    className: "col-span-3 lg:col-span-1",
    content: <Technologies />,
  },

  // Projects: filterable grid. Whole card links to /projects/<slug>; Figma and
  // GitHub chips sit above the stretched link.
  projects: {
    name: "Projects",
    id: "projects",
    description: "Work I've shipped, from go-to-market to vibe-coded tools.",
    className: "col-span-3",
    href: profile.links.github,
    cta: "GitHub",
    ctaIcon: <Github className="mr-2 h-4 w-4" />,
    href2: profile.links.portfolio,
    cta2: "Figma portfolio",
    cta2Icon: <Figma className="mr-2 h-4 w-4" />,
    content: <ProjectsGrid />,
  },

  // GitHub Stars: the number is the content, set at display size beside the
  // heading copy instead of floating in a framed box.
  stars: {
    name: "GitHub Stars",
    description: "Not a lot, but I'm proud of every single one.",
    className: "col-span-3 lg:col-span-1",
    href: profile.links.github,
    cta: "View my GitHub",
    ctaIcon: <Github className="mr-2 h-4 w-4" />,
    content: (
      <div className="flex h-full items-center px-5 pb-2 sm:px-6">
        <p className="flex items-center gap-3 text-6xl font-semibold tracking-[-0.03em] text-neutral-950 dark:text-white">
          <span className="sr-only">Total GitHub stars: </span>
          <GitHubStars />
          <Image
            src="/images/githubstar.webp"
            alt=""
            aria-hidden
            className="h-11 w-11 transition-transform duration-300 ease-out motion-safe:group-hover:rotate-12"
            width={44}
            height={44}
          />
        </p>
      </div>
    ),
  },

  focus: {
    name: "Focus areas",
    description: "Where I spend my time.",
    href: profile.links.linkedin,
    cta: "More on LinkedIn",
    ctaIcon: <Linkedin className="mr-2 h-4 w-4" />,
    className: "col-span-3 lg:col-span-2",
    content: <FocusList />,
  },

  // AI-native ops: full-width band, copy on the left and the beam on the right
  // at lg so the graphic no longer leaves a dead band above the heading.
  aiOps: {
    name: "AI-Native Ops",
    description: "AI workflows for research, writing, and keeping track of the work.",
    href: profile.links.github,
    cta: "See some of the tools",
    ctaIcon: <Github className="mr-2 h-4 w-4" />,
    className: "col-span-3",
    layout: "split" as const,
    content: (
      <div className="w-full px-3 pb-2 sm:px-6 lg:py-6 lg:pl-0">
        <AnimatedBeamMultipleOutputs className="h-[240px] max-w-[560px] border-none bg-transparent md:shadow-none sm:h-[330px]" />
      </div>
    ),
  },

  vibe: {
    name: "Vibe-coded by me",
    description: "Like it? It's open source.",
    className: "col-span-3 lg:col-span-2",
    href: "/projects/lock",
    cta: "How I built it",
    content: (
      <div className="px-5 sm:px-6">
        <Terminal className="h-auto w-full max-w-lg">
          <TypingAnimation>$ git log --oneline this-site</TypingAnimation>
          <AnimatedSpan>✔ Next.js + TypeScript + Tailwind</AnimatedSpan>
          <AnimatedSpan>✔ Designed, built and shipped solo</AnimatedSpan>
          <AnimatedSpan>✔ AI as the pair, me on the wheel</AnimatedSpan>
          <AnimatedSpan className="flex items-center gap-2 text-green-700 dark:text-green-400">
            ✓ Vibe-coded. Live.
            {/* Small Notion-face signature on a cream disc, a quiet "made by me" mark. */}
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
    ),
  },

  // Contact: statement heading and the shared CTA stack over the retro grid.
  contact: {
    className: "col-span-3 lg:col-span-1",
    background: (
      <div id="contact" className="relative flex h-full flex-1 flex-col">
        <div className="relative z-10 flex flex-1 flex-col justify-center gap-5 p-5 sm:p-6">
          <h2 className={cn(tileHeadingClass, "text-4xl sm:text-[2.5rem] sm:leading-[1.05]")}>
            Get in touch.
          </h2>
          <ContactButtons />
        </div>
        <RetroGrid />
      </div>
    ),
  },
};

// Rows at lg (3 columns):
//   [Hero 2 + About 1] · [Ask 3] · [Experience 2 + Stack 1] · [Projects 3]
//   · [Stars 1 + Focus 2] · [AI-Native Ops 3] · [Vibe 2 + Contact 1]
const BEFORE_ASK = [features.hero, features.about];
const AFTER_ASK = [
  features.experience,
  features.stack,
  features.projects,
  features.stars,
  features.focus,
  features.aiOps,
  features.vibe,
  features.contact,
];

export function Bento() {
  return (
    // Three blocks: the Ask tile sits between two grids so it can hug its own
    // content and grow on the first question without stretching a grid row.
    <div className="flex w-full flex-col gap-2 lg:gap-4">
      <BentoGrid>
        {BEFORE_ASK.map((feature, i) => (
          <BentoCard key={i} index={i} {...feature} />
        ))}
      </BentoGrid>

      <RevealCard index={BEFORE_ASK.length} fill={false} className="w-full">
        <AskTile />
      </RevealCard>

      <BentoGrid>
        {AFTER_ASK.map((feature, i) => (
          <BentoCard key={i} index={BEFORE_ASK.length + 1 + i} {...feature} />
        ))}
      </BentoGrid>
    </div>
  );
}
