/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure the project MDX write-ups are bundled into the chat route's
  // serverless function so buildSystemPrompt() can read them at runtime.
  outputFileTracingIncludes: {
    "/api/chat": ["./content/projects/**/*"],
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
