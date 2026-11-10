import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { RevealCard } from "@/components/reveal-card";

// Tiles size to their content on phones; from md up a shared minimum row height
// keeps side-by-side tiles level without forcing dead space into short ones.
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
        "grid w-full auto-rows-auto grid-cols-3 gap-2 md:auto-rows-[minmax(20rem,auto)] lg:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

// One heading treatment for every tile: full-ink, tight tracking, a clear step
// above the description. Exported so bespoke tiles (Contact) share the scale.
export const tileHeadingClass =
  "text-2xl font-semibold tracking-[-0.02em] text-neutral-950 sm:text-[1.75rem] sm:leading-tight dark:text-white";

type BentoCardProps = {
  id?: string;
  name?: string;
  className?: string;
  // Bespoke tiles (Hero, About, Contact) render everything themselves here.
  background?: ReactNode;
  // Standard tiles: heading + description on top, content, then the CTA row.
  content?: ReactNode;
  // "split" puts heading and CTAs in a left column beside the content at lg.
  layout?: "stack" | "split";
  description?: string;
  href?: string;
  cta?: string;
  href2?: string;
  cta2?: string;
  ctaIcon?: ReactNode;
  cta2Icon?: ReactNode;
  ctaCenter?: boolean;
  index?: number;
};

// Phone-only "Show all" control for long tile lists. The hidden items stay in
// the DOM (and server HTML) and are revealed with CSS, so nothing scrolls inside
// a tile and the content is still crawlable. Renders nothing from sm up, where
// every list shows in full.
export function DisclosureButton({
  controls,
  expanded,
  onToggle,
  moreLabel,
  lessLabel,
  className,
}: {
  controls: string;
  expanded: boolean;
  onToggle: () => void;
  moreLabel: string;
  lessLabel: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-controls={controls}
      onClick={onToggle}
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-colors sm:hidden",
        "border-black/[0.08] bg-black/[0.02] text-neutral-800 hover:bg-black/[0.05] active:bg-black/[0.07]",
        "dark:border-white/[0.1] dark:bg-white/[0.03] dark:text-neutral-200 dark:hover:bg-white/[0.07] dark:active:bg-white/[0.09]",
        className
      )}
    >
      {expanded ? lessLabel : moreLabel}
      <ChevronDownIcon
        aria-hidden
        className={cn("h-4 w-4 transition-transform duration-200", expanded && "rotate-180")}
      />
    </button>
  );
}

function CtaLink({
  href,
  label,
  icon,
  external,
}: {
  href: string;
  label: string;
  icon?: ReactNode;
  external?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      asChild
      size="sm"
      className="pointer-events-auto group/Arrow h-auto min-h-11 max-w-full whitespace-normal px-3 py-2 text-left text-neutral-800 hover:text-neutral-950 dark:text-neutral-200 dark:hover:text-white [&_svg]:shrink-0"
    >
      <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
        {icon}
        {label}
        <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform duration-300 lg:group-hover/Arrow:translate-x-1" />
      </a>
    </Button>
  );
}

const BentoCard = ({
  id,
  name,
  className,
  background,
  content,
  layout = "stack",
  description,
  href,
  cta,
  href2,
  cta2,
  ctaIcon,
  cta2Icon,
  ctaCenter,
  index = 0,
}: BentoCardProps) => {
  const hasCtas = Boolean((href && cta) || (href2 && cta2));
  // CTA text aligns with the tile copy: row padding + the button's own px-3
  // equals the header's px-5 / sm:px-6.
  const ctaRow = hasCtas ? (
    <div
      className={cn(
        "pointer-events-none z-20 flex w-full flex-row flex-wrap items-center gap-x-1 px-2 pb-3 sm:px-3",
        content ? "relative pt-2" : "absolute bottom-0",
        ctaCenter && "justify-center",
        layout === "split" && "lg:col-start-1 lg:row-start-2 lg:self-end"
      )}
    >
      {href && cta ? <CtaLink href={href} label={cta} icon={ctaIcon} /> : null}
      {href2 && cta2 ? (
        <CtaLink href={href2} label={cta2} icon={cta2Icon} external />
      ) : null}
    </div>
  ) : null;

  const header = name ? (
    <div
      className={cn(
        "px-5 pb-4 pt-5 sm:px-6 sm:pt-6",
        layout === "split" && "lg:col-start-1 lg:row-start-1 lg:pb-2"
      )}
    >
      <h2 className={tileHeadingClass}>{name}</h2>
      {description ? (
        <p className="mt-1.5 max-w-[60ch] text-[0.95rem] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      ) : null}
    </div>
  ) : null;

  return (
    <RevealCard index={index} className={cn("col-span-3", className)}>
      <div
        id={id}
        className={cn(
          "tile-surface group relative h-full overflow-hidden",
          layout === "split"
            ? "grid grid-cols-1 grid-rows-[auto_1fr_auto] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:grid-rows-[1fr_auto]"
            : "flex flex-col justify-between",
          "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.04),0_2px_4px_rgba(0,0,0,.04),0_12px_24px_rgba(0,0,0,.04)]",
          "dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)]"
        )}
      >
        {content ? (
          <>
            {header}
            <div
              className={cn(
                "min-w-0 flex-1",
                layout === "split" &&
                  "lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:flex lg:items-center"
              )}
            >
              {content}
            </div>
          </>
        ) : (
          <div className="relative flex min-h-0 flex-1 flex-col">{background}</div>
        )}
        {ctaRow}
        {/* Hover wash is dark-mode only; light tiles lean on the shared
            .tile-surface lift instead so dark text keeps its contrast. */}
        <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:dark:bg-neutral-800/10" />
      </div>
    </RevealCard>
  );
};

export { BentoCard, BentoGrid };
