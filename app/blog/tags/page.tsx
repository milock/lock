import type { Metadata } from "next";
import Link from "next/link";
import { getAllTags, getPostsByTag } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Tags - Michael Lock",
  description: "Browse writing by topic.",
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Tags
        </h1>
        <p className="mt-3 text-muted-foreground">Browse writing by topic.</p>
      </div>

      {tags.length === 0 ? (
        <p className="text-muted-foreground">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => {
            const count = getPostsByTag(tag).length;
            return (
              <Link
                key={tag}
                href={`/blog/tags/${encodeURIComponent(tag)}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3.5 py-1.5 text-sm text-secondary-foreground transition-colors hover:bg-accent"
              >
                {tag}
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
