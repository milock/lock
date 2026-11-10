import type { MDXRemoteProps } from "next-mdx-remote/rsc";
import type { Options as PrettyCodeOptions } from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";

const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark",
  },
  keepBackground: false,
};

/** Shared MDX serialize options for next-mdx-remote/rsc. */
export const mdxOptions: MDXRemoteProps["options"] = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypePrettyCode, prettyCodeOptions],
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
          properties: {
            // Styled in the project-page block at the end of app/globals.css.
            // Tailwind utilities here would never be generated, since lib/ is
            // outside the content globs, which is why headings rendered as
            // underlined links before.
            className: ["heading-anchor"],
          },
        },
      ],
    ],
  },
};
