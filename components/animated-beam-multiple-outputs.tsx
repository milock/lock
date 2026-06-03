"use client";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { MotionConfig } from "framer-motion";
import React, { forwardRef, useRef } from "react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        // Node chip. Sizes scale down on small screens so the whole constellation
        // fits inside the tile at 390px without clipping the right-most nodes.
        "z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white p-2 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] sm:h-12 sm:w-12 sm:p-3",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";
export function AnimatedBeamMultipleOutputs({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);
  const div8Ref = useRef<HTMLDivElement>(null);

  return (
    // reducedMotion="user" makes every descendant framer-motion animation (the
    // infinitely-sweeping beam gradients) honor the OS prefers-reduced-motion
    // setting: the beams render as static, unanimated paths for those users.
    <MotionConfig reducedMotion="user">
    <div
      className={cn(
        // w-full + max-w-[600px] keeps the graphic inside the tile on mobile while
        // preserving the intended 600px scale on desktop. Tighter padding/gap on
        // small screens pulls the node columns in so nothing clips at 390px.
        "relative mx-auto flex w-full max-w-[600px] items-center justify-center overflow-hidden rounded-lg border bg-background p-4 sm:p-10 md:shadow-xl",
        className
      )}
      ref={containerRef}
    >
      <div className="flex h-full w-full flex-row items-stretch justify-between gap-4 sm:gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <Icons.user className="text-black" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="h-12 w-12 sm:h-16 sm:w-16">
            <Icons.anthropic className="h-5 w-5 sm:h-6 sm:w-6" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-1.5 sm:gap-2">
          <Circle ref={div1Ref}>
            <Icons.perplexity className="h-5 w-5 sm:h-6 sm:w-6" />
          </Circle>
          <Circle ref={div2Ref}>
            <Icons.python className="h-5 w-5 sm:h-6 sm:w-6" />
          </Circle>
          <Circle ref={div3Ref}>
            <Icons.github className="h-5 w-5 sm:h-6 sm:w-6" />
          </Circle>
          <Circle ref={div4Ref}>
            <Icons.notion className="h-5 w-5 sm:h-6 sm:w-6" />
          </Circle>
          <Circle ref={div5Ref}>
            <Icons.linear className="h-5 w-5 sm:h-6 sm:w-6" />
          </Circle>
          <Circle ref={div8Ref}>
            <Icons.n8n className="h-5 w-5 sm:h-6 sm:w-6" />
          </Circle>
        </div>
      </div>

      {/* AnimatedBeams */}

      {/* div1 to div6 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
        duration={3}
        delay={1}
        reverse
      />

      {/* div2 to div6 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
        duration={3}
        delay={0.75}
        reverse
      />

      {/* div3 to div6 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
        duration={3}
        delay={1.25}
        reverse
      />

      {/* div4 to div6 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
        duration={3}
        delay={1}
        reverse
      />

      {/* div5 to div6 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
        duration={3}
        delay={1.5}
        reverse
      />

      {/* div8 to div6 */}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div6Ref}
        duration={3}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div8Ref}
        toRef={div6Ref}
        duration={3}
        delay={0.5}
        reverse
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
        duration={3}
        curvature={-20}
      />

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div6Ref}
        duration={3}
        reverse
        curvature={20}
        delay={1.5}
      />
    </div>
    </MotionConfig>
  );
}

// Surrounding nodes are Michael's actual stack — the real tools his self-built
// multi-agent system orchestrates (research, code, source, knowledge, planning,
// automation). The center node is Claude/Anthropic, the orchestrator. All marks
// load from the Simple Icons CDN via a config-free <img> (same pattern as the
// favicon chips elsewhere), so we avoid next/image remote-domain config and a
// logo can never render as a broken inline SVG. Each slug below was HEAD-checked
// against https://cdn.simpleicons.org. (slack/openai are intentionally absent —
// Simple Icons no longer ships those marks.)
function cdnIcon(slug: string, alt: string) {
  return function CdnIcon({ className }: IconProps) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`https://cdn.simpleicons.org/${slug}`}
        alt={alt}
        width={24}
        height={24}
        loading="lazy"
        className={cn("object-contain", className)}
      />
    );
  };
}

const Icons = {
  // Center AI node = Claude / Anthropic (the orchestrator). White-backed center
  // Circle keeps the default-dark Anthropic mark legible.
  anthropic: cdnIcon("anthropic", "Anthropic Claude"),
  perplexity: cdnIcon("perplexity", "Perplexity"),
  python: cdnIcon("python", "Python"),
  github: cdnIcon("github", "GitHub"),
  notion: cdnIcon("notion", "Notion"),
  linear: cdnIcon("linear", "Linear"),
  n8n: cdnIcon("n8n", "n8n"),
  user: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-user"
      {...props}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};
