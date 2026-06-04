import fs from "fs";
import path from "path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export interface ProjectFrontmatter {
  title: string;
  slug: string;
  description: string;
  repo: string;
  url: string;
  stack: string[];
  language: string;
  // Optional Figma portfolio link, surfaced as a button on design-led projects.
  figma: string;
}

export interface ProjectMeta extends ProjectFrontmatter {}

export interface Project extends ProjectMeta {
  content: string;
}

function getProjectFiles(): string[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR).filter((file) => file.endsWith(".mdx"));
}

function readProject(slug: string): Project | null {
  const fullPath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);

  const frontmatter: ProjectFrontmatter = {
    title: String(data.title ?? slug),
    slug: String(data.slug ?? slug),
    description: String(data.description ?? ""),
    repo: String(data.repo ?? ""),
    url: String(data.url ?? ""),
    stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
    language: String(data.language ?? ""),
    figma: String(data.figma ?? ""),
  };

  return { ...frontmatter, content };
}

/** All projects (alphabetical by slug). */
export function getAllProjects(): ProjectMeta[] {
  return getProjectFiles()
    .map((file) => readProject(file.replace(/\.mdx$/, "")))
    .filter((project): project is Project => project !== null)
    .sort((a, b) => a.slug.localeCompare(b.slug))
    .map(({ content: _content, ...meta }) => meta);
}

/** A single project by slug, including its raw MDX content. */
export function getProjectBySlug(slug: string): Project | null {
  return readProject(slug);
}

/** All slugs eligible for static generation. */
export function getAllSlugs(): string[] {
  return getProjectFiles().map((file) => file.replace(/\.mdx$/, ""));
}
