// Schematic diagrams for the Personal Memory System project page. Server
// components, no client JS - pure divs/SVG driven by the site's HSL tokens so
// they adapt to light/dark automatically. Registered in the project page's
// mdxComponents and used from content/projects/memory-system.mdx.

import type { ReactNode } from "react";

// ── Shared primitives ────────────────────────────────────────────────────────

function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="not-prose my-8">
      <div className="rounded-[var(--tile-radius)] border border-border bg-card/40 px-4 py-6 sm:px-8">
        {children}
      </div>
      <figcaption className="mt-2.5 text-center font-mono text-[11px] tracking-wide text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

function Node({
  title,
  sub,
  live,
  children,
}: {
  title: string;
  sub?: string;
  live?: boolean;
  children?: ReactNode;
}) {
  return (
    <div className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center shadow-sm">
      <div className="flex items-center justify-center gap-2">
        {live && (
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 motion-safe:animate-ping" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </span>
        )}
        <span className="text-sm font-semibold tracking-tight text-foreground">{title}</span>
      </div>
      {sub && (
        <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {sub}
        </div>
      )}
      {children}
    </div>
  );
}

function Chip({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-border px-2 py-1 font-mono text-[10.5px] leading-none tracking-wide ${
        dim ? "bg-muted/40 text-muted-foreground" : "bg-muted/60 text-foreground/80"
      }`}
    >
      {children}
    </span>
  );
}

// Vertical connector with arrowhead and an optional label beside it.
function Arrow({ label, up }: { label?: string; up?: boolean }) {
  return (
    <div className="relative mx-auto flex h-9 w-full items-center justify-center">
      <div className="flex h-full flex-col items-center">
        {up && (
          <svg width="9" height="6" viewBox="0 0 9 6" className="-mb-px text-muted-foreground/70">
            <path d="M4.5 0L9 6H0L4.5 0Z" fill="currentColor" />
          </svg>
        )}
        <div className="w-px flex-1 bg-border" />
        {!up && (
          <svg width="9" height="6" viewBox="0 0 9 6" className="-mt-px text-muted-foreground/70">
            <path d="M4.5 6L0 0H9L4.5 6Z" fill="currentColor" />
          </svg>
        )}
      </div>
      {label && (
        <span className="absolute left-1/2 ml-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

function GroupBox({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex-1 rounded-lg border border-dashed border-border/80 px-3 pb-3 pt-2">
      <div className="mb-2 text-center font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">{children}</div>
    </div>
  );
}

// ── 1. System architecture ──────────────────────────────────────────────────

export function MemoryArchitectureDiagram() {
  return (
    <Frame caption="The full loop: seven sources in, two consumers out.">
      <div className="mx-auto max-w-md">
        <div className="flex flex-col gap-2 sm:flex-row">
          <GroupBox label="Episodic · what happened">
            <Chip>Gmail</Chip>
            <Chip>Slack</Chip>
            <Chip>Fathom</Chip>
            <Chip>Granola</Chip>
          </GroupBox>
          <GroupBox label="Semantic · what was learned">
            <Chip>Expert notes</Chip>
            <Chip>Newsletter</Chip>
            <Chip>Blog</Chip>
          </GroupBox>
        </div>

        <Arrow label="every 3 hrs, weekdays" />

        <Node title="Sync pipeline" sub="Trigger.dev · dedupe → embed → upsert" live />

        <Arrow />

        <Node title="Vector store" sub="Qdrant · dense + keyword per memory" />

        <Arrow up label="hybrid search" />

        <Node title="MCP server" sub="Vercel · OAuth · 8 tools" />

        <Arrow up />

        <div className="flex gap-2">
          <div className="flex-1">
            <Node title="Assistant" sub="interactive sessions" />
          </div>
          <div className="flex-1">
            <Node title="Cloud agents" sub="scheduled runs" />
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ── 2. Ingest path (idempotency) ─────────────────────────────────────────────

export function IngestFlowDiagram() {
  return (
    <Frame caption="Every item, every sync: unchanged content never gets re-embedded.">
      <div className="mx-auto max-w-md">
        <Node title="Incoming item" sub="email · message · meeting · note" />
        <Arrow />
        <Node title="Deterministic ID" sub="md5(source + id) · same item, same point" />
        <Arrow />
        <Node title="Content hash" sub="compare against last synced version" />

        {/* Branch */}
        <div className="mx-auto flex h-9 w-3/4 items-end justify-between">
          <div className="flex h-full w-1/2 flex-col">
            <div className="ml-[50%] h-1/2 w-1/2 rounded-bl-md border-b border-l border-border" />
            <div className="ml-[calc(50%-4.5px)] -mt-px">
              <svg width="9" height="6" viewBox="0 0 9 6" className="text-muted-foreground/70">
                <path d="M4.5 6L0 0H9L4.5 6Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="flex h-full w-1/2 flex-col">
            <div className="mr-[50%] h-1/2 w-1/2 self-end rounded-br-md border-b border-r border-border" />
            <div className="mr-[calc(50%-4.5px)] -mt-px self-end">
              <svg width="9" height="6" viewBox="0 0 9 6" className="text-muted-foreground/70">
                <path d="M4.5 6L0 0H9L4.5 6Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 rounded-lg border border-border bg-muted/30 px-3 py-3 text-center">
            <div className="text-sm font-semibold tracking-tight text-muted-foreground">
              Unchanged → skip
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
              no embedding cost
            </div>
          </div>
          <div className="flex-1 rounded-lg border border-border bg-background px-3 py-3 text-center shadow-sm">
            <div className="text-sm font-semibold tracking-tight text-foreground">
              Changed → embed
            </div>
            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              then upsert in batches
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

// ── 3. Retrieval path (hybrid search) ────────────────────────────────────────

export function RetrievalFlowDiagram() {
  return (
    <Frame caption="One query, two searches, fused and re-ranked by recency.">
      <div className="mx-auto max-w-md">
        <Node title="Query" sub="“what did we discuss with…”" />

        {/* Split into two lanes */}
        <div className="mx-auto flex h-9 w-3/4 items-end justify-between">
          <div className="flex h-full w-1/2 flex-col">
            <div className="ml-[50%] h-1/2 w-1/2 rounded-bl-md border-b border-l border-border" />
            <div className="ml-[calc(50%-4.5px)] -mt-px">
              <svg width="9" height="6" viewBox="0 0 9 6" className="text-muted-foreground/70">
                <path d="M4.5 6L0 0H9L4.5 6Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <div className="flex h-full w-1/2 flex-col">
            <div className="mr-[50%] h-1/2 w-1/2 self-end rounded-br-md border-b border-r border-border" />
            <div className="mr-[calc(50%-4.5px)] -mt-px self-end">
              <svg width="9" height="6" viewBox="0 0 9 6" className="text-muted-foreground/70">
                <path d="M4.5 6L0 0H9L4.5 6Z" fill="currentColor" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <Node title="Dense vector" sub="meaning · catches paraphrase" />
          </div>
          <div className="flex-1">
            <Node title="Sparse keyword" sub="exact terms · catches names" />
          </div>
        </div>

        {/* Merge back */}
        <div className="relative mx-auto flex h-9 w-3/4 items-start justify-between">
          <div className="flex h-full w-1/2 flex-col">
            <div className="ml-[50%] h-1/2 w-1/2 rounded-tl-md border-l border-t border-border" />
          </div>
          <div className="flex h-full w-1/2 flex-col">
            <div className="mr-[50%] h-1/2 w-1/2 self-end rounded-tr-md border-r border-t border-border" />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 self-end">
            <svg width="9" height="6" viewBox="0 0 9 6" className="text-muted-foreground/70">
              <path d="M4.5 6L0 0H9L4.5 6Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        <Node title="Rank fusion" sub="reciprocal rank fusion · best of both" />
        <Arrow />
        <Node title="Recency boost" sub="older memories decay · up to −30% past a year" />
        <Arrow />
        <Node title="Results" sub="scored · thresholded · source-attributed" />
      </div>
    </Frame>
  );
}
