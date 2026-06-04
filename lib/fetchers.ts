// Data fetchers for the site.

// Floor used if the stars endpoint is unreachable, so the tile never shows NaN.
const FALLBACK_STARS = 5;

export const fetchStars = async (): Promise<number> => {
  try {
    const baseUrl =
      typeof window !== "undefined" ? "" : process.env.NEXT_PUBLIC_BASE_URL;
    const res = await fetch(`${baseUrl}/api/fetch-github-stars`);
    if (!res.ok) return FALLBACK_STARS;
    const data = await res.json();
    const n = Number(data?.totalStars);
    return Number.isFinite(n) ? n : FALLBACK_STARS;
  } catch {
    return FALLBACK_STARS;
  }
};
