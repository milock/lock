import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Native overflow keeps horizontal browsing and vertical page gestures independent.
// Do not add drag handlers, touch-action: pan-x, or vertical scroll containment.
export function HorizontalRail({ label, children, className }: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div>
      <p className="mb-2 px-5 text-xs text-muted-foreground sm:px-6">Swipe or scroll to browse</p>
      <div
        role="region"
        aria-label={label}
        tabIndex={0}
        className={cn("horizontal-rail grid auto-cols-[min(18rem,calc(100%-2rem))] grid-flow-col items-stretch gap-3 px-4 pb-3 pt-1", className)}
      >{children}</div>
    </div>
  );
}
