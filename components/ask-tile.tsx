"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { cn } from "@/lib/utils";

// Starter prompts to seed the conversation. Clicking one sends it like any
// typed message. Shown only before a thread exists.
const STARTERS = [
  "What have you shipped 0-to-1?",
  "How do you use AI to run a marketing team?",
  "Why health-tech?",
];

// Shown if the request fails (no key, rate limit, network). Keeps the tile
// friendly instead of surfacing a raw error.
const FALLBACK =
  "I'm having trouble responding right now. Email me at themichaellock@gmail.com and I'll get right back to you.";

// Pull the raw text out of a UI message's parts.
function rawText(message: { parts: Array<{ type: string; text?: string }> }) {
  return message.parts
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
}

const LINK_CLASS =
  "font-medium text-foreground underline decoration-foreground/30 underline-offset-2 transition-colors hover:decoration-foreground";

// Matches a markdown link, a bare http(s) URL, or an internal /projects/<slug>
// path so the assistant can point visitors to a page to read more.
const LINK_RE =
  /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s<)]+)|(\/projects\/[a-z0-9-]+)/g;

// Render an assistant message: strip stray markdown markers (the model is asked
// for plain text but occasionally slips), then turn any links it includes into
// real, clickable anchors — internal paths use Next's client-side Link.
function renderAssistant(raw: string): React.ReactNode {
  const clean = raw
    .replace(/\*\*/g, "") // bold markers
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headers
    .replace(/^\s*[-*]\s+/gm, "• "); // normalize bullets to a dot

  const out: React.ReactNode[] = [];
  let last = 0;
  let i = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(clean)) !== null) {
    if (m.index > last) out.push(clean.slice(last, m.index));

    let href: string;
    let label: string;
    let tail = "";
    if (m[1] !== undefined) {
      label = m[1];
      href = m[2];
    } else {
      const matched = (m[3] ?? m[4]) as string;
      // Don't swallow trailing sentence punctuation into the href.
      const trimmed = matched.replace(/[.,;:!?)]+$/, "");
      tail = matched.slice(trimmed.length);
      href = trimmed;
      label = trimmed;
    }

    // Only ever render http(s) or internal "/" links. Anything else (e.g. a
    // javascript: or data: URL the model could be coaxed into emitting) is
    // shown as plain text, never as a clickable href.
    const internal = href.startsWith("/");
    const safe = internal || /^https?:\/\//i.test(href);
    if (!safe) {
      out.push(m[0]);
    } else {
      out.push(
        internal ? (
          <Link key={`lnk-${i}`} href={href} className={LINK_CLASS}>
            {label}
          </Link>
        ) : (
          <a
            key={`lnk-${i}`}
            href={href}
            target="_blank"
            rel="noreferrer"
            className={LINK_CLASS}
          >
            {label}
          </a>
        )
      );
      if (tail) out.push(tail);
    }

    last = m.index + m[0].length;
    i += 1;
  }
  if (last < clean.length) out.push(clean.slice(last));
  return out;
}

export function AskTile() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";
  const threadRef = React.useRef<HTMLDivElement | null>(null);

  const send = React.useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      sendMessage({ text: trimmed });
    },
    [isLoading, sendMessage]
  );

  // Keep the newest message in view.
  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, status]);

  const hasThread = messages.length > 0;
  // The assistant is "thinking" once a question is in but no reply text yet.
  const awaitingReply =
    status === "submitted" ||
    (status === "streaming" &&
      messages[messages.length - 1]?.role === "user");

  const reduceMotion = useReducedMotion();
  // Idle, the card hugs its header + prompts (no empty void). Once a thread (or
  // error) exists it unfolds to a fixed, internally-scrolling height — capped
  // near the old tile size so it never dominates the page. The cap is
  // responsive and measured on the client so the unfold reads naturally on any
  // viewport. Animating real height (not a transform) means the grid below
  // glides down with it instead of jumping.
  const expanded = hasThread || Boolean(error);
  const [cap, setCap] = React.useState(608);
  React.useEffect(() => {
    const measure = () => {
      const w = window.innerWidth;
      setCap(w >= 768 ? 608 : w >= 640 ? 576 : 544); // 38 / 36 / 34rem
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <motion.div
      id="ask"
      initial={false}
      animate={{ height: expanded ? cap : "auto" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
      }
      className={cn(
        "tile-surface group relative flex flex-col overflow-hidden p-6",
        // light styles — mirrors BentoCard
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles — mirrors BentoCard
        "dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-neutral-700 dark:text-neutral-300">
          Ask me anything
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          Curious how I work or what I&apos;ve shipped? Type a question.
        </p>
      </div>

      {/* The thread fills all the space between the header and the input and
          scrolls internally, so a taller card means more visible answer. When
          empty it just holds the space, keeping the input pinned to the bottom. */}
      <div
        ref={threadRef}
        className={cn(
          "min-h-0 flex-1 space-y-3 overflow-y-auto pr-1",
          // Only claim vertical space once there's something to show, so the
          // idle card hugs tight to the header.
          (hasThread || error) && "mt-5"
        )}
      >
        {(hasThread || error) && (
          <>
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.role === "user"
                  ? rawText(message)
                  : renderAssistant(rawText(message))}
              </div>
            </div>
          ))}

          {awaitingReply && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-3.5 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-pulse [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          )}

          {error && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl bg-secondary px-3.5 py-2 text-sm leading-relaxed text-secondary-foreground">
                {FALLBACK}
              </div>
            </div>
          )}
          </>
        )}
      </div>

      {/* Starter prompts hug the input directly above it (grouped in the same
          bottom block) instead of floating in the middle of the tile. */}
      <div className="mt-5">
        {!hasThread && !error && (
          <div className="mb-2.5 flex flex-wrap gap-2">
            {STARTERS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => send(prompt)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  "border border-black/[0.08] bg-black/[0.03] text-neutral-600",
                  "hover:border-black/20 hover:bg-black/[0.06] hover:text-neutral-900",
                  "dark:border-white/[0.1] dark:bg-white/[0.05] dark:text-neutral-300",
                  "dark:hover:border-white/20 dark:hover:bg-white/[0.1] dark:hover:text-white"
                )}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        <PromptInputBox onSend={send} isLoading={isLoading} />
      </div>
    </motion.div>
  );
}

export default AskTile;
