import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
  readingTime: string;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  content: string;
}

const isProd = process.env.NODE_ENV === "production";

function getPostFiles(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith(".mdx"));
}

function readPost(slug: string): Post | null {
  const fullPath = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(raw);
  const stats = readingTime(content);

  const frontmatter: PostFrontmatter = {
    title: String(data.title ?? slug),
    description: String(data.description ?? ""),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft ?? false),
  };

  return {
    slug,
    ...frontmatter,
    content,
    readingTime: stats.text,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
  };
}

/** All posts, newest first. Drafts are excluded in production. */
export function getAllPosts(): PostMeta[] {
  const posts = getPostFiles()
    .map((file) => readPost(file.replace(/\.mdx$/, "")))
    .filter((post): post is Post => post !== null)
    .filter((post) => (isProd ? !post.draft : true))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts.map(({ content: _content, ...meta }) => meta);
}

/** A single post by slug, including its raw MDX content. Returns null if missing or draft-in-prod. */
export function getPostBySlug(slug: string): Post | null {
  const post = readPost(slug);
  if (!post) return null;
  if (isProd && post.draft) return null;
  return post;
}

/** All slugs eligible for static generation. */
export function getAllSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

/** Every unique tag across published posts, alphabetically sorted. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

/** Published posts that carry a given tag, newest first. */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}
