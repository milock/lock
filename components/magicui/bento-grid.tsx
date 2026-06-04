import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { RevealCard } from "@/components/reveal-card";

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        // Tighter rows trim the dead band between a tile's top content and its
        // bottom-anchored heading (the marquee/Stack tiles fill their height, so
        // they stay full while the rest get less white space).
        "grid w-full auto-rows-[17rem] grid-cols-3 gap-2 sm:auto-rows-[18rem] md:auto-rows-[19rem] lg:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  href2,
  cta2,
  ctaCenter,
  index = 0,
}: {
  name?: string;
  className?: string;
  background?: ReactNode;
  Icon?: any;
  description?: string;
  href?: string;
  cta?: string;
  // Optional second CTA, rendered beside the first (e.g. GitHub + Figma).
  href2?: string;
  cta2?: string;
  // Center the CTA row instead of left-aligning it (used by the About tile).
  ctaCenter?: boolean;
  index?: number;
}) => (
  <RevealCard
    index={index}
    className={cn("col-span-3", className)}
  >
    <div
      className={cn(
        "tile-surface group relative flex h-full flex-col justify-between overflow-hidden",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
    <div>{background}</div>
    <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <div className="flex flex-col gap-2">
        <div>
          {Icon !== "" ? (
            <Icon className="h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75" />
          ) : (
            ""
          )}
        </div>

        <div className="text-3xl font-semibold text-neutral-700 [text-shadow:0_1px_2px_hsl(var(--background)),0_0_14px_hsl(var(--background))] dark:text-neutral-300">
          {name}
        </div>
      </div>
      <p className="w-full text-neutral-500 [text-shadow:0_1px_2px_hsl(var(--background)),0_0_12px_hsl(var(--background))] dark:text-neutral-400">
        {description}
      </p>
    </div>

    <div
      className={cn(
        "pointer-events-none absolute bottom-0 flex w-full translate-y-10 transform-gpu flex-row items-center gap-1 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100",
        ctaCenter && "justify-center"
      )}
    >
      {href !== "" ? (
        <Button
          variant="ghost"
          asChild
          size="sm"
          className="pointer-events-auto group/Arrow"
        >
          <a href={href}>
            {cta}
            <ArrowRightIcon className="ml-2 h-4 w-4 lg:group-hover/Arrow:translate-x-1 transition-transform duration-300" />
          </a>
        </Button>
      ) : (
        ""
      )}
      {cta2 && href2 ? (
        <Button
          variant="ghost"
          asChild
          size="sm"
          className="pointer-events-auto group/Arrow2"
        >
          <a href={href2} target="_blank" rel="noreferrer">
            {cta2}
            <ArrowRightIcon className="ml-2 h-4 w-4 lg:group-hover/Arrow2:translate-x-1 transition-transform duration-300" />
          </a>
        </Button>
      ) : null}
    </div>
    {/* Hover wash is dark-mode only: on the light theme a darkening overlay
        made the black tile text harder to read, so light tiles stay bright on
        hover and lean on the shared .tile-surface lift/glow instead. */}
    <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:dark:bg-neutral-800/10" />
    </div>
  </RevealCard>
);

export { BentoCard, BentoGrid };
