import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  GitHubLogoIcon,
  ArrowTopRightIcon,
} from "@radix-ui/react-icons";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getProjectBySlug } from "@/lib/projects";
import { mdxOptions } from "@/lib/mdx-options";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProjectBySlug(params.slug);
  if (!project) return {};

  return {
    title: `${project.title} - Michael Lock`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
    },
  };
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProjectBySlug(params.slug);
  if (!project) notFound();

  const hasLiveSite =
    project.url && project.url !== project.repo && !project.url.includes("github.com");

  return (
    <div className="relative min-h-screen bg-background">
      {/* Atmospheric top wash - subtle, on-theme with the bento grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[420px] overflow-hidden"
      >
        <div className="absolute left-1/2 top-[-120px] h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-foreground/[0.06] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.4)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.4)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,#000_20%,transparent_80%)]" />
      </div>

      <main className="relative mx-auto w-full max-w-3xl px-5 py-12 md:py-16">
        <Link
          href="/"
          className="group mb-10 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back
        </Link>

        <header className="mb-12">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            {project.language ? `Project · ${project.language}` : "Project"}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          {project.stack.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-secondary-foreground"
                >
                  {tool}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 flex flex-wrap gap-3">
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                <GitHubLogoIcon className="h-4 w-4" />
                View repo
              </a>
            )}
            {hasLiveSite && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-border bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Live site
                <ArrowTopRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
          </div>
        </header>

        <div className="h-px w-full bg-border/60" />

        <article className="prose prose-neutral mt-12 max-w-none dark:prose-invert prose-headings:tracking-tight prose-h2:text-xl prose-h2:font-semibold prose-a:font-medium prose-a:underline-offset-4">
          <MDXRemote source={project.content} options={mdxOptions} />
        </article>

        <div className="mt-16 border-t border-border/60 pt-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
