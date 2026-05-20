"use client";

import MeteorShower from "@/components/magicui/meteors";
import WordPullUp from "@/components/magicui/word-pull-up";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/magicui/fade-in";
import { Mail, FileText } from "lucide-react";
import BlurIn from "@/components/magicui/blur-in";
import { profile } from "@/lib/data";

export default function Hero() {
  return (
    <div className="relative flex h-full w-full mx-auto items-center justify-center overflow-hidden rounded-lg border bg-background md:shadow-xl">
      <div className="flex flex-col items-start justify-center h-full overflow-hidden p-6 z-50">
        <WordPullUp words={profile.headline} />

        <div className="text-lg text-neutral-500 dark:text-neutral-400 lg:px-1 w-full ">
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
      <MeteorShower />
    </div>
  );
}
