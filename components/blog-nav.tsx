import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";
import { profile } from "@/lib/data";

export function BlogNav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-3xl items-center justify-between px-4">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground transition-colors hover:text-foreground/70"
        >
          {profile.name}
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            href="/blog"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Blog
          </Link>
          <Link
            href="/blog/tags"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Tags
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
