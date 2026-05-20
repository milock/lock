# Michael Lock - Personal Site

> A dark, animated bento landing page and native MDX blog for an AI-native product and marketing leader.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![MDX](https://img.shields.io/badge/MDX-1B1F24?logo=mdx&logoColor=white)](https://mdxjs.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

---

This is my personal site and blog. The home page is a single-page bento grid that covers what I do, the work I've shipped, the AI-native and go-to-market stack I build on, and how to reach me. The blog at `/blog` is written in MDX, with tags, an RSS feed, and a sitemap. There's also an "ask this site" console - a design preview for now, with the wiring still ahead of it.

Built with Next.js 14 (App Router), it leans on scroll-reveal animation, server components, and a single source of content in `lib/data.ts`.

## Features

- **Bento landing page** - a responsive grid of tiles (hero, experience, stack, metrics, focus areas, projects, contact) with scroll-reveal and entrance animations.
- **Native MDX blog** - posts live as `.mdx` files in the repo, with tags, per-tag pages, reading-time estimates, an RSS feed at `/blog/rss.xml`, and a generated sitemap.
- **Syntax-highlighted code** - powered by rehype-pretty-code + Shiki, with GitHub light/dark themes.
- **Generated OG image and favicon** - built at the edge from `app/opengraph-image.tsx` and `app/icon.tsx`, so social cards and the site icon stay in sync with no static assets to maintain.
- **AI "ask" console** - a design preview of a conversational way to explore the site (UI-only for now).
- **Dark mode** - via next-themes, with a toggle.
- **Fully responsive** - tuned from mobile through wide desktop.
- **Lighthouse-strong** - static rendering, minimal client JS, and edge-generated images keep it fast.

## Tech stack

| Area | What I use |
| --- | --- |
| Framework | Next.js 14.2 (App Router, RSC) |
| UI runtime | React 18 + TypeScript 5 |
| Styling | Tailwind CSS 3.4 + `@tailwindcss/typography`, `tailwindcss-animate` |
| Components | shadcn/ui (Radix primitives), magic-ui |
| Animation | Framer Motion 11, GSAP, react-spring, cobe |
| Content | MDX via `next-mdx-remote` 6, `gray-matter`, `reading-time` |
| Markdown pipeline | `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code` 0.14 + Shiki 4 |
| Hosting | Vercel |

## Getting started

### Prerequisites

- Node.js 18 or newer
- [pnpm](https://pnpm.io/)

### Install and run

```bash
pnpm install
pnpm dev        # start the dev server at http://localhost:3000
```

### Other scripts

```bash
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # run ESLint (next lint)
```

### Environment

Copy the example file and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BASE_URL` | yes | Canonical site URL, used for metadata, OG images, RSS, and the sitemap |
| `GITHUB_USERNAME` | yes | GitHub handle used by the repo / stars tiles |
| `GITHUB_TOKEN` | optional | Read-only token that only raises the GitHub API rate limit; the tiles work unauthenticated |

`.env.example` also ships `GITHUB_URL`, `REPO_NAME`, `AVATAR_URL`, and `NEXT_PUBLIC_PORTFOLIO_URL` as convenience defaults for the contact and project tiles. No secrets are required to run locally.

## Project structure

```text
.
├── app/                      # Next.js App Router
│   ├── api/route.ts          # lightweight health/info endpoint
│   ├── blog/                 # MDX blog
│   │   ├── page.tsx          # post index
│   │   ├── [slug]/           # individual post pages
│   │   ├── tags/             # tag index + per-tag pages
│   │   └── rss.xml/          # RSS feed route
│   ├── icon.tsx              # generated favicon
│   ├── opengraph-image.tsx   # generated OG image
│   ├── robots.ts             # robots.txt
│   ├── sitemap.ts            # sitemap
│   ├── layout.tsx            # root layout
│   └── page.tsx              # bento landing page
├── components/               # site components (hero, bento, ask-tile, etc.)
│   └── magicui/              # animation + visual primitives
├── content/blog/             # blog posts as .mdx files
├── lib/                      # data, blog loader, MDX options, helpers
│   ├── data.ts               # single source for all site content
│   ├── blog.ts               # MDX reading + frontmatter parsing
│   └── mdx-options.ts        # remark/rehype pipeline config
└── public/                   # static assets (images, etc.)
```

All landing-page content - profile, experience, projects, metrics, stack, focus areas - lives in `lib/data.ts`, so editing the site rarely means touching a component.

## Writing a blog post

Drop a new `.mdx` file into `content/blog/`. The filename becomes the slug (`content/blog/my-post.mdx` -> `/blog/my-post`). Start with frontmatter:

```mdx
---
title: "Your post title"
description: "A one-line summary used for previews and metadata."
date: "2026-05-20"
tags: ["ai-native", "go-to-market"]
draft: false
---

Your post body in MDX. GitHub-flavored Markdown, fenced code blocks
with syntax highlighting, and React components are all supported.
```

Frontmatter fields: `title`, `description`, `date` (`YYYY-MM-DD`), `tags` (array), and `draft`. Posts with `draft: true` are hidden in production but visible in development, so you can preview before publishing. Reading time is calculated automatically.

## Deployment

The site is built for Vercel - connect the repo and every push to the default branch deploys. To ship from the CLI:

```bash
vercel --prod
```

Set the same environment variables in your Vercel project settings, with `NEXT_PUBLIC_BASE_URL` pointed at the production domain.

## License

MIT.

---

Built by Michael Lock.
