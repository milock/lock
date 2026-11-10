// GitHubStars.tsx

"use client";

import { useState, useEffect } from "react";
import { fetchStars } from "@/lib/fetchers";
import { formatLargeNumber } from "@/lib/utils";

const GitHubStars = () => {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    const getStars = async () => {
      const totalStars = await fetchStars();
      setStars(totalStars);
    };

    getStars();
  }, []);

  // Inline element: this renders inside a paragraph in the Stars tile.
  if (stars === null) {
    return <span className="tabular-nums">0</span>;
  }

  // Belt-and-suspenders: never let a non-finite value reach the ticker.
  const value = Number.isFinite(stars) ? stars : 5;
  // A count-up on a single-digit total reads as a glitch (and the ticker
  // starts empty until in view), so the settled number renders directly.
  return <span className="tabular-nums">{formatLargeNumber(value)}</span>;
};

export default GitHubStars;
