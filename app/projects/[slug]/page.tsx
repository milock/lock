import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeftIcon,
  GitHubLogoIcon,
  ArrowTopRightIcon,
  FigmaLogoIcon,
} from "@radix-ui/react-icons";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getProjectBySlug } from "@/lib/projects";
import { mdxOptions } from "@/lib/mdx-options";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { VideoEmbed } from "@/components/video-embed";
import { PageActions } from "@/components/page-actions";
import { ProjectResults } from "@/components/project/project-results";
import { ProjectPager } from "@/components/project/project-pager";
import {
  MemoryArchitectureDiagram,
  IngestFlowDiagram,
  RetrievalFlowDiagram,
} from "@/components/memory-diagrams";

// Custom components available to MDX project bodies (e.g. responsive video
// embeds, schematic diagrams).
const mdxComponents = {
  YouTubeEmbed,
  VideoEmbed,
  MemoryArchitectureDiagram,
  IngestFlowDiagram,
  RetrievalFlowDiagram,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    // Bare project name only. The root layout's title template (`%s · Michael
    // Lock`) appends the name, producing e.g. "thriftly · Michael Lock". Including
    // "- Michael Lock" here too would double it.
    title: project.title,
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

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const hasLiveSite =
    project.url && project.url !== project.repo && !project.url.includes("github.com");
  // Label the external link by what it actually is - YouTube urls get a
  // video-appropriate label instead of "Live site".
  const liveLabel = project.url?.includes("youtube.com")
    ? "Watch the video"
    : "Live site";

  // Quiet sentence-case meta line: the discipline or language from
  // frontmatter, folded into the tag row. Replaces the old mono eyebrow.
  // Skipped when it only repeats a stack tag (e.g. "TypeScript").
  const meta = project.stack.some(
    (t) => t.toLowerCase() === project.language.toLowerCase(),
  )
    ? ""
    : project.language;

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

      <main
        id="main-content"
        className="project-page relative mx-auto w-full max-w-[44rem] px-4 pb-16 pt-6 sm:px-5 md:pb-20 md:pt-12"
      >
        <div className="mb-10 flex items-center justify-between gap-3 md:mb-14">
          <Link
            href="/#projects"
            className="group -ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-md px-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeftIcon className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            All projects
          </Link>
          <PageActions mdPath={`/projects/${slug}.md`} />
        </div>

        <header className="project-header">
          <h1 className="project-title text-[2.5rem] font-semibold leading-[1.05] text-foreground sm:text-5xl md:text-[3.5rem]">
            {project.title}
          </h1>
          <p className="project-lede mt-5 max-w-[38rem] text-lg leading-relaxed text-foreground/80 md:text-xl md:leading-relaxed">
            {project.description}
          </p>

          {(meta || project.stack.length > 0) && (
            <div className="project-meta mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
              {meta && project.stack.length > 0 && (
                <span aria-hidden className="h-4 w-px bg-border" />
              )}
              {project.stack.length > 0 && (
                <ul aria-label="Skills and stack" className="flex flex-wrap gap-1.5">
                  {project.stack.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-border/80 px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {(project.repo || hasLiveSite || project.figma) && (
            <div className="project-actions mt-8 flex flex-wrap gap-3">
              {hasLiveSite && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
                >
                  {liveLabel}
                  <ArrowTopRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              )}
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    hasLiveSite
                      ? "border border-border text-foreground hover:bg-accent"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  <GitHubLogoIcon className="h-4 w-4" />
                  View repo
                </a>
              )}
              {project.figma && (
                <a
                  href={project.figma}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <FigmaLogoIcon className="h-4 w-4" />
                  View in Figma
                </a>
              )}
            </div>
          )}
        </header>

        {project.results.length > 0 ? (
          <div className="mt-12 border-y border-border/70 py-8 md:mt-14 md:py-10">
            <ProjectResults results={project.results} />
          </div>
        ) : (
          <div className="mt-12 h-px w-full bg-border/70 md:mt-14" />
        )}

        <article className="project-prose prose prose-neutral mt-12 max-w-none dark:prose-invert md:mt-14">
          <MDXRemote
            source={project.content}
            options={mdxOptions}
            components={mdxComponents}
          />
        </article>

        <ProjectPager slug={slug} />
      </main>
    </div>
  );
}
