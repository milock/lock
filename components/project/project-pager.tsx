import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { projects } from "@/lib/data";

// Previous / next project navigation for the foot of a project page. Order
// follows the curated `projects` list in lib/data.ts (read-only here) and wraps
// at the ends, so every page offers somewhere to go next.
export function ProjectPager({ slug }: { slug: string }) {
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1 || projects.length < 2) return null;

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <nav aria-label="More projects" className="mt-20 border-t border-border/70 pt-10">
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={prev.href} className="project-pager__link group">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <ArrowLeftIcon
              aria-hidden
              className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            />
            Previous
          </span>
          <span className="mt-2 block text-base font-medium text-foreground">
            {prev.name}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {prev.description}
          </span>
        </Link>
        <Link href={next.href} className="project-pager__link group sm:text-right">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground sm:justify-end">
            Next
            <ArrowRightIcon
              aria-hidden
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>
          <span className="mt-2 block text-base font-medium text-foreground">
            {next.name}
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
            {next.description}
          </span>
        </Link>
      </div>

      <div className="mt-8 flex justify-center">
        <Link
          href="/#projects"
          className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          All projects
        </Link>
      </div>
    </nav>
  );
}
