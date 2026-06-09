"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

// Shared hover-open behavior for the corner dropdown buttons (copy-page,
// theme toggle): open on pointer enter, close shortly after pointer leaves,
// with a grace period so the cursor can travel from trigger to menu. Click
// still toggles via radix's controlled open state.
//
// Handlers are gated to real mouse pointers: on touch devices the tap fires
// synthetic enter/leave events that would otherwise start the close timer
// and snap the menu shut right after it opens.
export function useHoverMenu(closeDelayMs = 150) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function enter(e: ReactPointerEvent) {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function leave(e: ReactPointerEvent) {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelayMs);
  }

  // With a mouse, hover owns open/close - radix's pointerdown toggle would
  // otherwise snap the hover-opened menu shut on click. Touch keeps the
  // default tap-to-toggle (radix skips its handler when default is prevented).
  function pointerDown(e: ReactPointerEvent) {
    if (e.pointerType === "mouse") e.preventDefault();
  }

  return { open, setOpen, enter, leave, pointerDown };
}
