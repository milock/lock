import { homeMarkdown, projectMarkdown } from "@/lib/llms";
import { getAllSlugs } from "@/lib/projects";

export const dynamic = "force-static";

// Backs the `.md` URLs via rewrites in next.config.mjs:
//   /index.md            -> /md/home
//   /projects/<slug>.md  -> /md/projects/<slug>
// Pre-rendered at build for the home page and every project.
export function generateStaticParams() {
  return [
    { path: ["home"] },
    ...getAllSlugs().map((slug) => ({ path: ["projects", slug] })),
  ];
}

export function GET(
  _req: Request,
  { params }: { params: { path?: string[] } }
) {
  const segs = params.path ?? [];

  let body: string | null = null;
  if (segs.length === 1 && segs[0] === "home") {
    body = homeMarkdown();
  } else if (segs.length === 2 && segs[0] === "projects") {
    body = projectMarkdown(segs[1]);
  }

  if (body == null) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600, must-revalidate",
    },
  });
}
