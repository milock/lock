// Sums public repo stars for the GitHub Stars tile. Cached/revalidated hourly so
// we don't hammer GitHub's unauthenticated rate limit (60/hr per IP) on every
// page view — which was 403ing and rendering "NaN".
export const revalidate = 3600;

interface Repo {
  stargazers_count: number;
}

// Shown when GitHub is unreachable / rate-limited so the tile never renders NaN.
// Set GITHUB_TOKEN (read-only, no scope) in Vercel to lift the rate limit.
const FALLBACK_STARS = 5;

export async function GET(): Promise<Response> {
  const username = process.env.GITHUB_USERNAME || "milock";
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) headers.Authorization = `token ${token}`;

  const ok = (totalStars: number, fallback = false) =>
    new Response(JSON.stringify({ totalStars, fallback }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  try {
    let totalStars = 0;
    let nextUrl: string | null = `https://api.github.com/users/${username}/repos?per_page=100`;

    while (nextUrl) {
      const response: Response = await fetch(nextUrl, {
        headers,
        next: { revalidate: 3600 },
      });
      if (!response.ok) {
        // Rate-limited or unavailable — serve the fallback instead of erroring
        // (which previously produced NaN downstream).
        return ok(FALLBACK_STARS, true);
      }

      const repos: Repo[] = await response.json();
      if (!Array.isArray(repos)) return ok(FALLBACK_STARS, true);
      for (const repo of repos) {
        totalStars += Number(repo?.stargazers_count) || 0;
      }

      // Follow GitHub's pagination Link header.
      const linkHeader = response.headers.get("link");
      const next = linkHeader
        ?.split(",")
        .find((s) => s.includes('rel="next"'))
        ?.match(/<([^>]+)>/);
      nextUrl = next ? next[1] : null;
    }

    return ok(totalStars);
  } catch {
    return ok(FALLBACK_STARS, true);
  }
}
