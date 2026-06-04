"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { HeartPulse, Rocket, Sparkles, MapPin } from "lucide-react";
import Meteors from "@/components/magicui/meteors";
import WordPullUp from "@/components/magicui/word-pull-up";
import { FadeIn } from "@/components/magicui/fade-in";
import { CtaButtons } from "@/components/cta-buttons";
import { profile } from "@/lib/data";

// The positioning line, broken into individual pills each with its own icon, so
// the hero reads as scannable identity tags instead of one long subhead. The
// location rounds out the set.
const HERO_PILLS = [
  { label: "Health-tech product marketing leader", Icon: HeartPulse },
  { label: "Storytelling, positioning & 0-to-1 launches", Icon: Rocket },
  { label: "AI-native operator", Icon: Sparkles },
  { label: profile.locationLong, Icon: MapPin },
];

export default function Hero() {
  // Mounted-gate avoids a hydration mismatch (Meteors reads window on mount and
  // randomizes per-meteor styles). Reduced-motion users never mount the
  // animation, so the streaking-meteor loop never runs and the hero stays static.
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const showMeteors = mounted && !reduceMotion;

  return (
    <div className="relative flex h-full w-full mx-auto items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      {/* Restored template ambient field — meteors streak diagonally behind the
          positioning. Absolute background layer (z-0); the text block stays z-50
          so it always sits on top. Decorative only (pointer-events-none on each
          meteor in the component). Not mounted for reduced-motion users. */}
      {showMeteors && (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-70 dark:opacity-60">
          <Meteors number={32} />
        </div>
      )}
      <div className="flex flex-col items-start justify-center h-full overflow-hidden p-8 sm:p-10 z-50">
        {/* Big, declarative H1. The positioning line drops to a subhead so the
            hero still says who he is without competing with the headline. */}
        <WordPullUp
          words="Let's cook"
          className="text-left text-6xl leading-[1.05] md:text-7xl lg:text-7xl"
        />

        <FadeIn direction="down">
          <div className="mt-4 flex max-w-xl flex-wrap gap-1.5">
            {HERO_PILLS.map(({ label, Icon }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none border border-black/[0.08] bg-black/[0.03] text-neutral-700 dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-neutral-200"
              >
                <Icon className="h-3 w-3 shrink-0 text-neutral-500 dark:text-neutral-400" />
                {label}
              </span>
            ))}
          </div>
        </FadeIn>

        <FadeIn direction="down">
          <div className="mt-6 w-full max-w-sm">
            <CtaButtons />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
