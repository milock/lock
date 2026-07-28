// Responsive self-hosted video embed for MDX project pages. Server component
// wrapping a native <video> in an aspect-ratio box so it stays responsive on
// mobile. preload="metadata" keeps the page light - the file only streams when
// the visitor hits play.

interface VideoEmbedProps {
  /** Path to the video file under /public, e.g. "/videos/demo.mp4". */
  src: string;
  /** Optional poster image shown before playback starts. */
  poster?: string;
  /** Accessible label for the video. */
  title?: string;
  /** CSS aspect-ratio value matching the source file. Defaults to 16:9. */
  aspectRatio?: string;
}

export function VideoEmbed({
  src,
  poster,
  title = "Video",
  aspectRatio = "16 / 9",
}: VideoEmbedProps) {
  return (
    <div
      className="relative my-8 w-full overflow-hidden rounded-xl border border-border"
      style={{ aspectRatio }}
    >
      <video
        className="absolute inset-0 h-full w-full"
        src={src}
        poster={poster}
        title={title}
        controls
        playsInline
        preload="metadata"
      />
    </div>
  );
}
