// Easter egg: the Chrome offline T-Rex game (ripped from wayou/t-rex-runner),
// self-hosted under public/t-rex/ and embedded in an isolated iframe so its
// canvas/keyboard handling never touches React's hydration. Click the game, then
// press space (or tap on touch). In dark mode the iframe is inverted so the
// classic dark-on-light dino reads as light-on-dark.
export function TrexRunner() {
  return (
    <section aria-label="Chrome T-Rex runner — a little easter egg" className="w-full">
      {/* Matches the bento tiles: bg-white (light) / bg-background carbon (dark).
          The game self-themes via prefers-color-scheme — opaque bg in those same
          colors, and it inverts only its own canvas (the dino), not the bg. */}
      <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm dark:bg-background">
        <iframe
          src="/t-rex/index.html"
          title="Chrome T-Rex runner game"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          className="block h-[200px] w-full border-0"
        />
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        You made it to the bottom. Click the strip and hit space. 🦖
      </p>
    </section>
  );
}

export default TrexRunner;
