import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { getAllTags, getPostsByTag } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { tag: string };
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const tag = decodeURIComponent(params.tag);
  return {
    title: `Posts tagged "${tag}" - Michael Lock`,
    description: `Writing tagged ${tag}.`,
  };
}

export default function TagPage({ params }: PageProps) {
  const tag = decodeURIComponent(params.tag);
  const posts = getPostsByTag(tag);

  if (posts.length === 0) notFound();

  return (
    <div>
      <Link
        href="/blog/tags"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        All tags
      </Link>

      <div className="mb-12">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {tag}
        </h1>
        <p className="mt-3 text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"} tagged{" "}
          <span className="text-foreground">{tag}</span>.
        </p>
      </div>

      <ul className="flex flex-col gap-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <h2 className="text-xl font-medium text-foreground transition-colors group-hover:text-foreground/70 md:text-2xl">
                  {post.title}
                </h2>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  <span aria-hidden>&middot;</span>
                  <span>{post.readingTime}</span>
                </div>
                <p className="mt-3 text-muted-foreground">
                  {post.description}
                </p>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
