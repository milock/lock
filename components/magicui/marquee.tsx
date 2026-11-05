import { cn } from "@/lib/utils";

interface MarqueeProps {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  // When true, the track auto-scrolls but the user can also swipe/scroll
  // through it with a trackpad or touch (native overflow scrolling on-axis,
  // scrollbar hidden). Pairs well with pauseOnHover so the animation yields
  // while the user is interacting.
  scrollable?: boolean;
  [key: string]: any;
}

export default function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  scrollable = false,
  ...props
}: MarqueeProps) {
  return (
    <div
      tabIndex={scrollable ? 0 : undefined}
      role={scrollable ? "region" : undefined}
      {...props}
      className={cn(
        "group flex p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        scrollable
          ? vertical
            ? "overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-width:thin]"
            : "overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin]"
          : "overflow-hidden",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
    >
      {Array(scrollable ? 1 : repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            aria-hidden={i > 0 ? true : undefined}
            inert={i > 0 ? true : undefined}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]", {
              "flex-row": !vertical,
              "animate-marquee": !vertical && !scrollable,
              "flex-col": vertical,
              "animate-marquee-vertical": vertical && !scrollable,
              "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]": pauseOnHover,
              "[animation-direction:reverse]": reverse,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}
