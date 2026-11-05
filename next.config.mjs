/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'none'" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ] }, {
      // Only the self-hosted game may be embedded, and only by this origin.
      source: "/t-rex/index.html", headers: [
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Content-Security-Policy", value: "object-src 'none'; base-uri 'self'; frame-ancestors 'self'" },
      ],
    }];
  },
  // Restore scroll position on browser back/forward instead of jumping to the
  // top — so returning from a project page lands roughly where you left off.
  experimental: {
    scrollRestoration: true,
  },
  // Ensure the project MDX write-ups are bundled into the routes that read them
  // at runtime (chat system prompt + the .md / llms.txt generators).
  outputFileTracingIncludes: {
    "/api/chat": ["./content/projects/**/*"],
    "/md/[...path]": ["./content/projects/**/*"],
    "/llms.txt": ["./content/projects/**/*"],
    "/llms-full.txt": ["./content/projects/**/*"],
  },
  // Pretty .md URLs for every page, backed by the /md/[...path] route handler.
  async rewrites() {
    return [
      { source: "/index.md", destination: "/md/home" },
      { source: "/projects/:slug.md", destination: "/md/projects/:slug" },
    ];
  },
  // The proposal project was renamed (slug change); keep old links working.
  async redirects() {
    return [
      {
        source: "/projects/alejandro-proposal",
        destination: "/projects/client-proposal",
        permanent: true,
      },
      {
        source: "/projects/alejandro-proposal.md",
        destination: "/projects/client-proposal.md",
        permanent: true,
      },
    ];
  },
	images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
    ],
  },
};

export default nextConfig;
