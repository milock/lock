"use client";

import Image from "next/image";
import { profile } from "@/lib/data";
import BlurIn from "@/components/magicui/blur-in";
import { cn } from "@/lib/utils";

// The avatar is black line-art on a transparent background, so it is invisible
// on the dark tile unless it sits on a light surface. We render it inside a
// warm off-white disc (cream in both themes) so the illustrated portrait reads
// as an intentional personal-brand mark rather than a pasted cutout. A soft
// ring + drop shadow lift the disc off the tile; a faint radial wash inside the
// disc gives the flat line-art a touch of depth.
export function AvatarDisc({ className }: { className?: string }) {
  return (
    <BlurIn duration={0.5} className={cn("inline-block", className)}>
      <div
        className={cn(
          "group/disc relative grid place-items-center overflow-hidden rounded-full",
          "h-32 w-32 sm:h-36 sm:w-36",
          // Carbon/charcoal disc to sit closer to the site's dark surface.
          "bg-[radial-gradient(120%_120%_at_30%_20%,#363638_0%,#242426_55%,#161618_100%)]",
          // Clean neutral ring. A warm-neutral inset hairline (neutral-200, not
          // pure white) keeps the rim from reading cool/blue against the navy-ish
          // dark page, and a soft outer neutral ring lifts the disc off the tile.
          "ring-1 ring-neutral-200/20 ring-inset",
          "shadow-[0_0_0_1px_rgba(255,255,255,.04),0_1px_2px_rgba(0,0,0,.08),0_12px_28px_-8px_rgba(0,0,0,.45)]",
          "transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.03]"
        )}
      >
        {/* Inner top sheen for a subtle dimensional, premium feel. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(80%_55%_at_50%_8%,rgba(255,255,255,.10),transparent_60%)]"
        />
        <Image
          src={profile.avatar}
          alt="Illustrated portrait of Michael Lock"
          width={144}
          height={144}
          priority
          quality={90}
          className="relative h-[108%] w-[108%] object-contain object-center"
        />
      </div>
    </BlurIn>
  );
}
