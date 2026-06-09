"use client";

import { useState } from "react";
import {
  CheckIcon,
  ChevronDownIcon,
  CopyIcon,
  ArrowTopRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useHoverMenu } from "@/components/use-hover-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// "Copy page" actions: copy the page's markdown, view it raw, or open it in
// ChatGPT / Claude. Two forms:
//   - default: split button (label copies, chevron opens the menu) — project pages
//   - compact: icon-only button styled like the theme toggle that opens the
//     menu on hover — home page (where mdPath is /llms.txt)
// `mdPath` is the page's markdown route, served by app/md via rewrite.

function OpenAIMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
    </svg>
  );
}

function ClaudeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={className} aria-hidden>
      <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
  );
}

function useCopyMarkdown(mdPath: string) {
  const [copied, setCopied] = useState(false);

  async function copyMarkdown() {
    try {
      const res = await fetch(mdPath);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can fail (permissions, http); fall back to opening the md.
      window.open(mdPath, "_blank");
    }
  }

  return { copied, copyMarkdown };
}

function aiUrl(base: string, mdPath: string) {
  const mdUrl = `${window.location.origin}${mdPath}`;
  const q = encodeURIComponent(`Read ${mdUrl} and answer questions about the content.`);
  return `${base}?q=${q}`;
}

function MenuItems({
  mdPath,
  copied,
  copyMarkdown,
}: {
  mdPath: string;
  copied: boolean;
  copyMarkdown: () => void;
}) {
  return (
    <>
      <DropdownMenuItem onClick={copyMarkdown} className="gap-3 py-2.5">
        {copied ? (
          <CheckIcon className="h-4 w-4 shrink-0 text-emerald-500" />
        ) : (
          <CopyIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
        )}
        <span className="flex flex-col">
          <span>{copied ? "Copied" : "Copy page"}</span>
          <span className="text-xs text-muted-foreground">
            Copy page as Markdown for LLMs
          </span>
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem asChild className="gap-3 py-2.5">
        <a href={mdPath} target="_blank" rel="noreferrer">
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border border-muted-foreground/60 font-mono text-[8px] font-bold leading-none text-muted-foreground">
            M↓
          </span>
          <span className="flex flex-col">
            <span className="inline-flex items-center gap-1">
              View as Markdown
              <ArrowTopRightIcon className="h-3 w-3 text-muted-foreground" />
            </span>
            <span className="text-xs text-muted-foreground">
              View this page as plain text
            </span>
          </span>
        </a>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="gap-3 py-2.5"
        onClick={() => window.open(aiUrl("https://chat.openai.com/", mdPath), "_blank")}
      >
        <OpenAIMark className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex flex-col">
          <span className="inline-flex items-center gap-1">
            Open in ChatGPT
            <ArrowTopRightIcon className="h-3 w-3 text-muted-foreground" />
          </span>
          <span className="text-xs text-muted-foreground">
            Ask ChatGPT about this page
          </span>
        </span>
      </DropdownMenuItem>
      <DropdownMenuItem
        className="gap-3 py-2.5"
        onClick={() => window.open(aiUrl("https://claude.ai/new", mdPath), "_blank")}
      >
        <ClaudeMark className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="flex flex-col">
          <span className="inline-flex items-center gap-1">
            Open in Claude
            <ArrowTopRightIcon className="h-3 w-3 text-muted-foreground" />
          </span>
          <span className="text-xs text-muted-foreground">
            Ask Claude about this page
          </span>
        </span>
      </DropdownMenuItem>
    </>
  );
}

/** Icon-only form that matches the theme toggle and opens on hover. */
export function PageActionsCompact({ mdPath }: { mdPath: string }) {
  const { copied, copyMarkdown } = useCopyMarkdown(mdPath);
  const { open, setOpen, enter, leave, pointerDown } = useHoverMenu();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        onPointerEnter={enter}
        onPointerLeave={leave}
        onPointerDown={pointerDown}
        onClick={(e) => {
          // Mouse: the menu is already open from hover, so a click on the
          // copy icon copies. Touch (no hover) keeps tap = toggle menu.
          const pt = (e.nativeEvent as PointerEvent).pointerType;
          if (pt === "mouse" || pt === undefined) copyMarkdown();
        }}
      >
        <Button variant="none" size="icon" aria-label="Copy page / open in AI">
          {copied ? (
            <CheckIcon className="h-[1.1rem] w-[1.1rem] text-emerald-500" />
          ) : (
            <CopyIcon className="h-[1.1rem] w-[1.1rem]" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64"
        onPointerEnter={enter}
        onPointerLeave={leave}
      >
        <MenuItems mdPath={mdPath} copied={copied} copyMarkdown={copyMarkdown} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Split-button form used on project pages. */
export function PageActions({
  mdPath,
  className = "",
}: {
  mdPath: string;
  className?: string;
}) {
  const { copied, copyMarkdown } = useCopyMarkdown(mdPath);

  return (
    <div
      className={`inline-flex items-stretch rounded-lg border border-foreground/15 bg-background/70 text-sm font-medium text-foreground shadow-sm backdrop-blur ${className}`}
    >
      <button
        type="button"
        onClick={copyMarkdown}
        className="inline-flex items-center gap-1.5 rounded-l-lg px-3 py-1.5 transition-colors hover:bg-accent"
        aria-label="Copy page as Markdown"
      >
        {copied ? (
          <CheckIcon className="h-3.5 w-3.5 text-emerald-500" />
        ) : (
          <CopyIcon className="h-3.5 w-3.5" />
        )}
        {copied ? "Copied" : "Copy page"}
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="inline-flex items-center rounded-r-lg border-l border-foreground/15 px-1.5 transition-colors hover:bg-accent data-[state=open]:bg-accent"
          aria-label="Page actions"
        >
          <ChevronDownIcon className="h-3.5 w-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <MenuItems mdPath={mdPath} copied={copied} copyMarkdown={copyMarkdown} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
