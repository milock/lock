// Markdown / llms.txt generators. These render the site's content as clean
// Markdown for LLM crawlers: a root llms.txt index, a concatenated full-text
// file, and a .md version of every page (home + each project).
import { profile, about, experience } from "@/lib/data";
import { getAllProjects, getProjectBySlug } from "@/lib/projects";

const BASE = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://michael-lock.com"
).replace(/\/$/, "");

// Strip JSX/HTML tags (e.g. <YouTubeEmbed>) and collapse blank runs so the
// model sees clean prose.
function stripJsx(s: string): string {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** A single project rendered as a standalone Markdown page. */
export function projectMarkdown(slug: string): string | null {
  const p = getProjectBySlug(slug);
  if (!p) return null;

  const links = [
    p.url && p.url !== p.repo ? `- Live: ${p.url}` : "",
    p.repo ? `- Repo: ${p.repo}` : "",
    p.figma ? `- Figma: ${p.figma}` : "",
    `- Page: ${BASE}/projects/${p.slug}`,
  ].filter(Boolean);

  return [
    `# ${p.title}`,
    ``,
    p.description,
    ``,
    p.stack.length ? `Stack: ${p.stack.join(", ")}` : "",
    p.language ? `Discipline: ${p.language}` : "",
    ``,
    links.join("\n"),
    ``,
    `---`,
    ``,
    stripJsx(p.content),
    ``,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

/** The home page rendered as Markdown: bio, experience, work, contact. */
export function homeMarkdown(): string {
  const exp = experience
    .map((e) => `- **${e.company}** — ${e.title} (${e.period}). ${e.metric}`)
    .join("\n");

  const work = getAllProjects()
    .map(
      (p) => `- [${p.title}](${BASE}/projects/${p.slug}.md) — ${p.description}`
    )
    .join("\n");

  return [
    `# ${profile.name}`,
    ``,
    `> ${profile.headline}`,
    ``,
    profile.tagline,
    ``,
    `Location: ${profile.locationLong}`,
    ``,
    `## About`,
    ``,
    about,
    ``,
    `## Experience`,
    ``,
    exp,
    ``,
    `## Selected work`,
    ``,
    work,
    ``,
    `## Contact`,
    ``,
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- GitHub: ${profile.links.github}`,
    `- Portfolio (Figma): ${profile.links.portfolio}`,
    ``,
  ].join("\n");
}

/** The root llms.txt: the home page's content plus an index of every
 *  Markdown page, so one fetch gives a model both the resume and the map. */
export function llmsIndex(): string {
  const exp = experience
    .map((e) => `- **${e.company}** — ${e.title} (${e.period}). ${e.metric}`)
    .join("\n");

  const projects = getAllProjects()
    .map(
      (p) => `- [${p.title}](${BASE}/projects/${p.slug}.md): ${p.description}`
    )
    .join("\n");

  return [
    `# ${profile.name}`,
    ``,
    `> ${profile.tagline}`,
    ``,
    `${profile.headline}. Based in ${profile.locationLong}. This is the llms.txt for ${BASE} — the home page's content plus a Markdown version of every page, linked under Pages below.`,
    ``,
    `## About`,
    ``,
    about,
    ``,
    `## Experience`,
    ``,
    exp,
    ``,
    `## Pages`,
    ``,
    `- [Home — resume, experience, and selected work](${BASE}/index.md)`,
    ``,
    `### Projects`,
    ``,
    projects,
    ``,
    `## Optional`,
    ``,
    `- [Full text — every page concatenated](${BASE}/llms-full.txt)`,
    ``,
    `## Contact`,
    ``,
    `- Email: ${profile.email}`,
    `- LinkedIn: ${profile.links.linkedin}`,
    `- GitHub: ${profile.links.github}`,
    ``,
  ].join("\n");
}

/** Everything in one file: home plus every project, separated by rules. */
export function llmsFull(): string {
  const parts = [homeMarkdown()];
  for (const p of getAllProjects()) {
    const md = projectMarkdown(p.slug);
    if (md) parts.push(md);
  }
  return parts.join("\n\n---\n\n");
}
