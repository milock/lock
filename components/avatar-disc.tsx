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
          "h-24 w-24 sm:h-28 sm:w-28",
          // Warm near-white disc so the black line-art portrait reads clearly;
          // matches the cream signature disc used elsewhere in the bento.
          "bg-[radial-gradient(120%_120%_at_30%_20%,#ffffff_0%,#faf3e6_55%,#f1e8d7_100%)]",
          // Soft dark hairline keeps the light disc from bleeding into light
          // tiles; the drop shadow lifts it off dark ones.
          "ring-1 ring-black/10 ring-inset",
          "shadow-[0_1px_2px_rgba(0,0,0,.08),0_12px_28px_-8px_rgba(0,0,0,.35)]",
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
