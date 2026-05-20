"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import Meteors from "@/components/magicui/meteors";
import WordPullUp from "@/components/magicui/word-pull-up";
import { FadeIn } from "@/components/magicui/fade-in";
import BlurIn from "@/components/magicui/blur-in";
import { CtaButtons } from "@/components/cta-buttons";
import { profile } from "@/lib/data";

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
      <div className="flex flex-col items-start justify-center h-full overflow-hidden p-6 z-50">
        {/* Big, declarative H1. The positioning line drops to a subhead so the
            hero still says who he is without competing with the headline. */}
        <WordPullUp
          words="Let's cook"
          className="text-left text-6xl leading-[1.05] md:text-7xl lg:text-7xl"
        />

        <FadeIn direction="down">
          <p className="mt-2 text-base font-medium tracking-tight text-neutral-700 dark:text-neutral-200 sm:text-lg">
            {profile.headline}
          </p>
        </FadeIn>

        <div className="mt-3 text-lg text-neutral-500 dark:text-neutral-400 lg:px-1 w-full">
          <BlurIn className="w-3/4 sm:w-2/3">{profile.tagline}</BlurIn>

          <FadeIn direction="down">
            <div className="mt-6 w-full max-w-sm">
              <CtaButtons />
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
