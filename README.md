# Michael Lock — Personal Site

> A dark, animated bento landing page for a health-tech product marketing leader and AI-native operator. Designed, built, and shipped solo.

[![Live](https://img.shields.io/badge/Live-michael--lock.com-000000?logo=vercel&logoColor=white)](https://michael-lock.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-0055FF?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![MDX](https://img.shields.io/badge/MDX-1B1F24?logo=mdx&logoColor=white)](https://mdxjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#license)

---

My personal site, live at **[michael-lock.com](https://michael-lock.com)**. The home page is a single-page bento grid: who I am, the work I've shipped, the AI-native and go-to-market stack I build on, and how to reach me. Every project links to its own write-up rendered from MDX, and there's an "ask me anything" console — a chatbot grounded only in my resume and project write-ups (Anthropic Claude), with streaming replies and a rate-limited server endpoint.

Built with Next.js 14 (App Router). It leans on scroll-reveal animation, server components, and a single source of content in `lib/data.ts`.

## Features

- **Bento landing page** — a responsive grid of tiles (hero, about, experience, projects, stack, GitHub stars, AI-native ops, focus areas, contact) with scroll-reveal and entrance animations.
- **MDX project pages** — each project lives as an `.mdx` file in `content/projects/` and renders at `/projects/<slug>` with its own metadata and repo / live / Figma links.
- **"Ask me anything" chatbot** — a conversational way to explore the site, grounded **only** in the resume + project content (Anthropic Claude Haiku). Replies **stream in character-by-character** (typewriter reveal) and can link out to the relevant project pages. The thread **persists in `sessionStorage`**, so leaving for a project page and coming back keeps the conversation. It runs behind a rate-limited, origin-checked server endpoint with input caps, and renders model output safely (only `http(s)` / internal links are ever clickable). No personal data beyond what's already on the page.
- **`llms.txt` + Markdown for every page** — `/llms.txt`, `/llms-full.txt`, and a `.md` version of the home page and each project, for LLM crawlers.
- **Live GitHub stars** — pulled at request time across my open-source repos.
- **AI-native ops beam** — an animated diagram of the multi-agent stack the marketing function runs on.
- **Tooltips + microinteractions** — Radix tooltips on every icon-only button, with press/hover micro-animations; project-card arrows are real links with a slide nudge.
- **Touch-aware hover** — on touch devices (which can't hover), the tile nearest the center of the viewport takes the hover/lift state as you scroll.
- **Scroll-restored navigation** — browser back/forward returns you to roughly where you left off instead of the top of the page.
- **Syntax-highlighted code** — rehype-pretty-code + Shiki, GitHub light/dark themes.
- **Generated OG image and favicon** — built at the edge from `app/opengraph-image.tsx` and `app/icon.tsx`, so social cards and the icon stay in sync with no static assets to maintain.
- **Light / dark / system** — via next-themes, defaulting to the visitor's system preference, with a toggle.
- **Fully responsive** — tuned from 320px through wide desktop, with swipeable marquees and zero horizontal overflow, plus a readability scrim behind tile headers.
- **End-to-end tested** — a Playwright suite (chromium + mobile) covers the landing page, every project page, the chat API + UI, links, and overflow.
- **Privacy-light analytics** — Vercel Web Analytics, no cookies.

## Tech

| Area | Choice |
|------|--------|
| Framework | Next.js 14 (App Router), React 18 |
| Language | TypeScript |
| Styling | Tailwind CSS 3, shadcn/ui, magic-ui |
| Animation | Framer Motion |
| Content | MDX (`next-mdx-remote`, gray-matter, rehype-pretty-code / Shiki) |
| AI chat | Vercel AI SDK + Anthropic Claude Haiku (streaming) |
| Testing | Playwright |
| Hosting / analytics | Vercel + Vercel Web Analytics |

## Project structure

```
app/                  App Router routes, layout, OG image, sitemap, robots
  projects/[slug]/    Dynamic MDX-rendered project pages
  api/chat/           Grounded, rate-limited chatbot endpoint (streaming)
  api/fetch-github-stars/  Sums public repo stars
  md/[...path]/       Markdown of each page (backs the .md routes)
  llms.txt/ llms-full.txt/  llms.txt index + concatenated full text
components/            Bento tiles, hero, ask-tile chat, magic-ui primitives
content/projects/     One .mdx file per project (the source of each page)
lib/data.ts           Single source of profile, experience, projects, stack
lib/knowledge/        System prompt assembled from resume + voice + projects
lib/llms.ts           Markdown / llms.txt generators
tests/e2e/            Playwright end-to-end specs (landing, projects, chat)
```

## Develop

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm start        # serve the production build
pnpm test:e2e     # run the Playwright suite
```

## Content

All site content lives in `lib/data.ts` (profile, experience, projects, stack, focus areas). Each project's long-form write-up is an `.mdx` file in `content/projects/`; adding a file there creates its page and adds it to the sitemap automatically. The chatbot's knowledge is assembled from the same resume + project files in `lib/knowledge/`.

## Configuration

Copy `.env.example` to `.env.local` and fill it in. `.env.local` is gitignored — never commit real keys.

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | for the chatbot | Server-only key for `app/api/chat`. Without it, the chat returns a friendly offline notice. |
| `NEXT_PUBLIC_BASE_URL` | no | Canonical/sitemap/OG/llms base URL. Defaults to the production domain. |
| `GITHUB_USERNAME` | no | Whose public repo stars feed the GitHub Stars tile. |
| `GITHUB_TOKEN` | no | Read-only, no-scope token that only raises the GitHub API rate limit. |

**If you fork this and enable the chatbot, set a monthly spend limit on the Anthropic key** (console.anthropic.com). The endpoint is a public, billable surface; the in-app rate limit is a soft per-instance layer, and the spend cap is the hard backstop.

## License

MIT — see [`LICENSE`](LICENSE). The content and personal branding are mine; the code is free to learn from.
