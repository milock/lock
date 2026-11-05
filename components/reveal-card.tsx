import { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Content is visible in server HTML and remains visible without motion or JS.
// A stable wrapper keeps the tile hover target from moving under the pointer.
export function RevealCard({ children, className, fill = true }: {
  children: ReactNode; index?: number; className?: string; fill?: boolean;
}) {
  return <div className={cn("group/tile", fill && "h-full", className)}>{children}</div>;
}
export default RevealCard;
