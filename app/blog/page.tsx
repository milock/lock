import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing - Michael Lock",
  description:
    "Notes on go-to-market, product marketing, and building with AI as an operator.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div>
      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Writing
        </h1>
        <p className="mt-3 text-muted-foreground">
          Notes on go-to-market, product marketing, and building with AI as an
          operator.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Check back soon.</p>
      ) : (
        <ul className="flex flex-col gap-10">
          {posts.map((post) => (
            <li key={post.slug}>
              <article className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex items-baseline justify-between gap-4">
                    <h2 className="text-xl font-medium text-foreground transition-colors group-hover:text-foreground/70 md:text-2xl">
                      {post.title}
                    </h2>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                    <time dateTime={post.date}>{formatDate(post.date)}</time>
                    <span aria-hidden>&middot;</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <p className="mt-3 text-muted-foreground">
                    {post.description}
                  </p>
                </Link>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tags/${encodeURIComponent(tag)}`}
                        className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs text-secondary-foreground transition-colors hover:bg-accent"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                )}
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
