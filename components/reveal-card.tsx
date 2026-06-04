"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared scroll-reveal wrapper for bento tiles.
 *
 * Tiles rise + fade (+ a touch of blur) the first time they enter the
 * viewport, with a small per-tile stagger so the grid resolves in a
 * wave rather than all at once. Quick and refined: ~0.55s, soft ease.
 *
 * Honors prefers-reduced-motion — reduced-motion users get the final
 * state immediately with no transform or blur.
 */
export function RevealCard({
  children,
  index = 0,
  className,
  // Most tiles stretch to fill their grid cell (h-full). The Ask tile sizes to
  // its own content (it animates open), so it opts out with fill={false}.
  fill = true,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
  fill?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  // Stagger caps out so a long grid never feels slow to settle.
  const delay = Math.min(index * 0.07, 0.42);

  if (reduceMotion) {
    return <div className={cn(fill && "h-full", className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(fill && "h-full", className)}
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -8% 0px" }}
      transition={{
        duration: 0.55,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export default RevealCard;
