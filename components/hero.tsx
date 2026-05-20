"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";
import Particles from "@/components/magicui/particles";
import WordPullUp from "@/components/magicui/word-pull-up";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/magicui/fade-in";
import { Mail, FileText } from "lucide-react";
import BlurIn from "@/components/magicui/blur-in";
import { profile } from "@/lib/data";

export default function Hero() {
  // Theme-aware particle tint: cool near-white over the dark grid,
  // ink over the light grid. Mounted-gate avoids a hydration mismatch.
  const { resolvedTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const particleColor = resolvedTheme === "light" ? "#404040" : "#dbe4ff";
  // Skip the rAF particle loop entirely for reduced-motion users.
  const showParticles = mounted && !reduceMotion;

  return (
    <div className="relative flex h-full w-full mx-auto items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      {/* Restrained ambient field — drifting data points behind the
          positioning. Low quantity + low opacity so it never competes
          with the headline. Decorative only (aria-hidden in component).
          Not mounted at all for reduced-motion users (showParticles),
          so the rAF loop never runs and the hero stays fully static. */}
      {showParticles && (
        <Particles
          className="pointer-events-none absolute inset-0 z-0 opacity-60 dark:opacity-50"
          quantity={56}
          ease={70}
          staticity={45}
          size={0.5}
          color={particleColor}
          refresh={false}
        />
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

        <div className="mt-3 text-lg text-neutral-500 dark:text-neutral-400 lg:px-1 w-full ">
          <BlurIn className="w-3/4 sm:w-2/3">{profile.tagline}</BlurIn>

          <FadeIn direction="down">
            <div className="flex items-center gap-2 w-full lg:w-2/3 mt-6">
              <a href={profile.links.resume} className="flex-1">
                <Button
                  variant="default"
                  size="lg"
                  className="flex items-center gap-2 w-full group/Resume"
                >
                  <div>Résumé</div>
                  <FileText className="h-5 w-5 lg:group-hover/Resume:translate-x-1 transition-all duration-300" />
                </Button>
              </a>

              <a href={profile.links.email} className="flex-1">
                <Button
                  variant="default"
                  size="lg"
                  className="flex items-center gap-2 w-full group/Mail"
                >
                  <div>Email Me</div>
                  <Mail className="h-5 w-5 lg:group-hover/Mail:translate-x-1 transition-all duration-300" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
