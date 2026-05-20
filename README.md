# Michael Lock - Personal Site

My personal website: a single-page bento landing that covers what I do, the
work I've shipped, the AI-native and go-to-market stack I build on, and how to
reach me. The blog lives at `/blog`.

## Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS 3
- shadcn/ui + magic-ui components
- next-themes (dark / light)

All content is sourced from a single file, `lib/data.ts`.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

## Build

```bash
pnpm build
pnpm start    # serve the production build
```

## Environment

Copy `.env.example` to `.env.local` and fill in the values. The GitHub stars
tile works unauthenticated; a read-only `GITHUB_TOKEN` only raises the API rate
limit.
