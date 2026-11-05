"use client";

import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { ArrowUp, Loader2 } from "lucide-react";
import { MAX_INPUT_CHARS } from "@/lib/chat-security";
import { cn } from "@/lib/utils";

interface PromptInputBoxProps {
  onSend?: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

const MAX_TEXTAREA_HEIGHT = 200; // px — grows to here, then scrolls

/**
 * PromptInputBox — a dark "AI console" prompt input.
 *
 * Design-only: it surfaces the message to `onSend` and renders a loading state,
 * but performs no network calls itself. SSR-safe by construction: no module-level
 * access to `document` or `window`.
 */
export function PromptInputBox({
  onSend,
  isLoading = false,
  placeholder = "Ask me anything…",
  className,
}: PromptInputBoxProps) {
  const [value, setValue] = React.useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  // Auto-resize the textarea up to MAX_TEXTAREA_HEIGHT, then let it scroll.
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const next = Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT);
    el.style.height = `${next}px`;
    el.style.overflowY =
      el.scrollHeight > MAX_TEXTAREA_HEIGHT ? "auto" : "hidden";
  }, [value]);

  const canSend = value.trim().length > 0 && !isLoading;

  const submit = React.useCallback(() => {
    const message = value.trim();
    if (!message || isLoading) return;
    onSend?.(message);
    setValue("");
  }, [value, isLoading, onSend]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends; Shift+Enter inserts a newline.
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div
      className={cn(
        "group/prompt relative w-full rounded-2xl border border-border bg-secondary/40",
        "shadow-sm ring-1 ring-black/[.02] dark:ring-white/[.04]",
        "transition-colors duration-200",
        "focus-within:border-foreground/20 focus-within:ring-foreground/10",
        className
      )}
    >
      <label htmlFor="ai-prompt-input" className="sr-only">
        {placeholder}
      </label>
      <textarea
        id="ai-prompt-input"
        ref={textareaRef}
        rows={1}
        maxLength={MAX_INPUT_CHARS}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className={cn(
          "block w-full resize-none bg-transparent px-4 pt-4 pb-2 text-base leading-relaxed",
          "text-foreground placeholder:text-muted-foreground",
          "focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        )}
      />

      <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1">
        <span className="text-xs text-muted-foreground">Enter to send · Shift + Enter for a new line</span>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={submit}
                disabled={!canSend}
                aria-label="Send message"
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
                  "bg-primary text-primary-foreground",
                  "transition-[transform,opacity,background-color] duration-200",
                  "motion-safe:hover:scale-105 motion-safe:active:scale-95",
                  "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              sideOffset={6}
              className={cn(
                "z-50 rounded-md border border-border bg-popover px-2 py-1",
                "text-xs text-popover-foreground shadow-md"
              )}
            >
              Send
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default PromptInputBox;
