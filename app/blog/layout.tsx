import { BlogNav } from "@/components/blog-nav";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <BlogNav />
      <main className="mx-auto w-full max-w-3xl px-4 py-12 md:py-16">
        {children}
      </main>
      <footer className="mx-auto w-full max-w-3xl px-4 pb-12 pt-4 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-6">
          <span>&copy; {new Date().getFullYear()} Michael Lock</span>
          <a
            href="/blog/rss.xml"
            className="transition-colors hover:text-foreground"
          >
            RSS
          </a>
        </div>
      </footer>
    </div>
  );
}
