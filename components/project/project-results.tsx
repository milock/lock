import type { ProjectResult } from "@/lib/projects";

// Key-results band under a project header. Figures are set large in tabular
// numerals with a short label beneath, separated by space rather than boxed in
// cards, so a skimmer gets the outcome before reading a paragraph. Rendered
// only when the project's frontmatter carries `results`.
export function ProjectResults({ results }: { results: ProjectResult[] }) {
  if (results.length === 0) return null;

  const cols =
    results.length >= 4
      ? "sm:grid-cols-4"
      : results.length === 3
        ? "sm:grid-cols-3"
        : results.length === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-1";

  return (
    <section aria-labelledby="key-results" className="project-results">
      <h2 id="key-results" className="sr-only">
        Key results
      </h2>
      <dl
        className={`grid gap-x-8 gap-y-7 ${
          results.length === 1 ? "grid-cols-1" : "grid-cols-2"
        } ${cols}`}
      >
        {results.map((r) => (
          <div key={r.value + r.label} className="flex flex-col gap-2">
            <dt className="max-w-[22ch] text-sm leading-snug text-muted-foreground">
              {r.label}
            </dt>
            <dd className="project-results__value order-first text-4xl font-semibold text-foreground md:text-5xl">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
