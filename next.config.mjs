/** @type {import('next').NextConfig} */
const nextConfig = {
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
