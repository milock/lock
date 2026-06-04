"use client";

import * as React from "react";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

// Design-preview reply. Kept friendly and plain - no marketing copy.
const CANNED_REPLY =
  "Thanks for asking! This is a design preview - the live assistant (grounded in my résumé and writing) is coming soon.";

// Starter prompts to seed the conversation. Clicking one sends it like any
// typed message. Shown only before a thread exists.
const STARTERS = [
  "What has Michael shipped 0-to-1?",
  "How does he use AI to run a marketing team?",
  "Why health-tech?",
];

export function AskTile() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const idRef = React.useRef(0);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const threadRef = React.useRef<HTMLDivElement | null>(null);

  // Clear any pending canned-reply timer on unmount.
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Keep the newest message in view.
  React.useEffect(() => {
    const el = threadRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = (message: string) => {
    const userMessage: ChatMessage = {
      id: (idRef.current += 1),
      role: "user",
      content: message,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Brief shimmer before the canned reply. NO fetch/network here.
    // TODO: wire to /app/api/chat/route.ts (Vercel AI SDK 'ai' + Claude),
    // system-prompted on résumé/about content. Replace the canned reply below.
    timerRef.current = setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (idRef.current += 1),
        role: "assistant",
        content: CANNED_REPLY,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 900);
  };

  const hasThread = messages.length > 0 || isLoading;

  return (
    <div
      id="ask"
      className={cn(
        "tile-surface group relative flex h-full flex-col justify-between overflow-hidden p-6",
        // light styles — mirrors BentoCard
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles — mirrors BentoCard
        "dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)]"
      )}
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-semibold text-neutral-700 dark:text-neutral-300">
          Ask this site anything
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          Curious how I work or what I&apos;ve shipped? Type a question.
        </p>
      </div>

      {hasThread && (
        <div
          ref={threadRef}
          className="mt-5 max-h-48 space-y-3 overflow-y-auto pr-1"
        >
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
                  "max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1.5 rounded-2xl bg-secondary px-3.5 py-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-pulse [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60 motion-safe:animate-pulse [animation-delay:300ms]" />
              </div>
            </div>
          )}
        </div>
      )}

      {!hasThread && (
        <div className="mt-5 flex flex-wrap gap-2">
          {STARTERS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleSend(prompt)}
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

      <div className="mt-5">
        <PromptInputBox onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default AskTile;
