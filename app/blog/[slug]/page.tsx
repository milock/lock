import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { mdxOptions } from "@/lib/mdx-options";
import { formatDate } from "@/lib/utils";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} - Michael Lock`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <article>
      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back
      </Link>

      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>&middot;</span>
          <span>{post.readingTime}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
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
      </header>

      <div className="prose prose-neutral dark:prose-invert">
        <MDXRemote source={post.content} options={mdxOptions} />
      </div>
    </article>
  );
}
