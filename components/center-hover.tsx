"use client";

import { useEffect } from "react";

/**
 * Touch devices can't hover, so the bento tiles never reach their lift/glow
 * state. This mounts once and, on coarse-pointer devices only, adds `.is-active`
 * (which mirrors `:hover` in globals.css) to whichever tile is currently nearest
 * the vertical center of the viewport — so the active tile tracks the page as
 * you scroll. No-ops entirely on devices that can actually hover.
 */
export function CenterHover() {
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    // Only emulate hover where the device genuinely can't hover.
    if (!window.matchMedia("(hover: none)").matches) return;

    let raf = 0;
    let current: HTMLElement | null = null;

    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let bestDist = Infinity;

      // for...of (not forEach) so TS tracks the `best` assignment in scope.
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>(".tile-surface")
      )) {
        if (el.id === "ask") continue; // the chat tile is interactive — leave it
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) continue; // offscreen
        const dist = Math.abs(r.top + r.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = el;
        }
      }

      if (best !== current) {
        current?.classList.remove("is-active");
        best?.classList.add("is-active");
        current = best;
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      current?.classList.remove("is-active");
    };
  }, []);

  return null;
}

export default CenterHover;
