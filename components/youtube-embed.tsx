// Responsive 16:9 YouTube embed for MDX project pages. No client JS needed -
// it's a plain server component wrapping a privacy-mode iframe in an
// aspect-ratio box, so it stays responsive on mobile with no fixed pixel width.

interface YouTubeEmbedProps {
  /** The YouTube video id, e.g. "zdlme_KTkIQ". */
  id: string;
  /** Accessible title for the iframe. */
  title?: string;
}

export function YouTubeEmbed({ id, title = "YouTube video" }: YouTubeEmbedProps) {
  return (
    <div className="relative my-8 aspect-video w-full overflow-hidden rounded-xl border border-border">
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
