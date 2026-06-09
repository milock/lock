// Site content for michaellock - sourced from resume + LinkedIn.

export const profile = {
  name: "Michael Lock",
  headline:
    "Health-tech product marketing leader · Storytelling, positioning & 0-to-1 launches · AI-native operator",
  tagline:
    "I build the function, the launch, and the AI system that runs both.",
  location: "San Diego, CA",
  locationLong: "San Diego, California",
  email: "themichaellock@gmail.com",
  avatar: "/images/notion-face.png",
  links: {
    linkedin: "https://www.linkedin.com/in/michael--lock/",
    github: "https://github.com/milock",
    portfolio:
      "https://www.figma.com/design/SYgmqCRoefFFdwums5367F/Michael-s-Portfolio?t=KmZ5JjplH7FqLfwL-1",
    // Blog removed; repointed to GitHub so legacy consumers never 404.
    blog: "https://github.com/milock",
    resume: "/michael-lock-resume.pdf",
    email: "mailto:themichaellock@gmail.com",
  },
};

// Short, first-person bio (condensed from LinkedIn About).
export const about =
  "I build the thing from nothing: the marketing function, the product launch, and now the AI system that runs the work. I've stood up product marketing from zero at three companies, led two 0-to-1 launches to $8M+ combined ARR, and I run a marketing function on a self-built multi-agent system, with two of the tools open-sourced. Deep healthcare and vertical SaaS.";

export const experience = [
  {
    company: "Clarity RCM",
    title: "Head of Marketing (Founding Marketer)",
    period: "2025-Present",
    badges: ["Founding marketer", "$20M ARR"],
    logoDomain: "clarityrcm.com",
    url: "https://clarityrcm.com",
    metric:
      "Built the marketing function on top of founder-led sales: 300% more qualified inbound, $7M closed-won ARR (up 35% YoY).",
  },
  {
    company: "Elation Health",
    title: "Principal Product Marketing Manager",
    period: "2023-2025",
    badges: ["Series D", "$50M ARR"],
    logoDomain: "elationhealth.com",
    url: "https://www.elationhealth.com",
    metric:
      "Led 0-to-1 GTM for a clinical AI scribe ($3M ARR yr 1) and a new billing product ($5M ARR).",
  },
  {
    company: "360training",
    title: "Product Marketing Lead, Healthcare",
    period: "2022-2023",
    badges: ["PE-backed", "$36M→$72M"],
    logoDomain: "360training.com",
    url: "https://www.360training.com",
    metric:
      "Built PMM 0-to-4; took an acquired HIPAA product line to $10M ARR; helped 2x the business $36M to $72M.",
  },
  {
    company: "ExSite",
    title: "Founder, Fractional PMM",
    period: "2018-2022",
    badges: ["Founder", "$2M raised"],
    logoDomain: "",
    url: "",
    metric:
      "Fractional PMM for 30+ clients; reusable launch frameworks adopted as their internal standards.",
  },
  {
    company: "Meta",
    title: "Product Ops, Platform",
    period: "2016-2018",
    badges: ["NASDAQ: META", "0→500K MAU"],
    logoDomain: "meta.com",
    url: "https://about.meta.com",
    metric: "Scaled Facebook Gaming 0 to 500K MAU.",
  },
  {
    company: "Accenture",
    title: "Financial Operations Analyst",
    period: "2015-2016",
    badges: ["Consulting"],
    logoDomain: "accenture.com",
    url: "https://www.accenture.com",
    metric:
      "Financial operations on the Meta finance BPO; converted into a full-time role at Meta.",
  },
];

// `type` drives the card badge: "marketing" = go-to-market / brand / creative
// work; "build" = something I designed and shipped in code (vibe-coded, mostly
// on GitHub). `figma` surfaces a portfolio link on design-led projects.
export type ProjectType = "marketing" | "build";

export type Project = {
  name: string;
  slug: string;
  description: string;
  language: string;
  href: string;
  type: ProjectType;
  url?: string;
  repo?: string;
  figma?: boolean;
};

// Curated order (Michael's call, June 2026). Descriptions are kept to a
// uniform ~65-72 characters so every card wraps to the same two lines.
export const projects: Project[] = [
  {
    name: "Clarity Website Refresh",
    slug: "clarity-website",
    description:
      "Rebuilt Clarity's marketing site positioning-first, 13 to 25 pages, solo.",
    url: "https://clarityrcm.com",
    language: "Messaging & Brand",
    href: "/projects/clarity-website",
    type: "marketing",
    figma: true,
  },
  {
    name: "ClarityOS Teaser Video",
    slug: "clarityos-teaser",
    description:
      "4-act product teaser for the ClarityOS launch. I wrote and directed it.",
    url: "https://www.youtube.com/watch?v=blr2TJk_XO8",
    language: "Product Marketing",
    href: "/projects/clarityos-teaser",
    type: "marketing",
  },
  {
    name: "Personal Memory System",
    slug: "memory-system",
    description:
      "Long-term memory for my AI assistant: sync pipeline in, MCP server out.",
    language: "TypeScript",
    href: "/projects/memory-system",
    type: "build",
  },
  {
    name: "Elation AI Scribe Launch",
    slug: "elation-scribe",
    description:
      "0-to-1 GTM for the first AI scribe built inside the EMR. $3M ARR year one.",
    language: "Product Marketing",
    href: "/projects/elation-scribe",
    type: "marketing",
  },
  {
    name: "Thriftly",
    slug: "thriftly",
    description:
      "Ranks every US Goodwill 0-100 on donation quality, from Census data.",
    repo: "https://github.com/milock/thriftly",
    url: "https://thriftly.xyz",
    language: "TypeScript",
    href: "/projects/thriftly",
    type: "build",
  },
  {
    name: "Client Proposal",
    slug: "client-proposal",
    description:
      "The proposal built as the bilingual, interactive site it was pitching.",
    language: "Web",
    href: "/projects/client-proposal",
    type: "build",
    figma: false,
  },
  {
    name: "Polysearch",
    slug: "polysearch",
    description:
      "Pip-installable multi-source research pipeline that verifies its own citations.",
    repo: "https://github.com/milock/polysearch",
    url: "https://github.com/milock/polysearch",
    language: "Python",
    href: "/projects/polysearch",
    type: "build",
  },
  {
    name: "AAD 2026 Sizzle Reel",
    slug: "sizzle-reel",
    description:
      "Silent, stats-led brand reel for the AAD booth. I wrote and directed it.",
    url: "https://www.youtube.com/watch?v=zdlme_KTkIQ",
    language: "Event Marketing",
    href: "/projects/sizzle-reel",
    type: "marketing",
    figma: true,
  },
  {
    name: "Lock",
    slug: "lock",
    description:
      "This site: range as proof, not pitch. Designed, written, and shipped solo.",
    repo: "https://github.com/milock/lock",
    url: "https://michael-lock.com",
    language: "TypeScript",
    href: "/projects/lock",
    type: "build",
  },
  {
    name: "Clarity Ad Landing Pages",
    slug: "clarity-landing-pages",
    description:
      "The Next.js ad-landing platform our paid search runs on. 52 to 90 on mobile.",
    url: "https://get.clarityrcm.com",
    language: "Web / Growth",
    href: "/projects/clarity-landing-pages",
    type: "build",
  },
  {
    name: "Humanizer",
    slug: "humanizer",
    description:
      "A rules-based scrub that protects your voice and facts while clearing AI tells. OSS.",
    repo: "https://github.com/milock/humanizer",
    url: "https://github.com/milock/humanizer",
    language: "Markdown",
    href: "/projects/humanizer",
    type: "build",
  },
];

// Used by the number-ticker metrics tile.
export const metrics = [
  { value: 5000, prefix: "", suffix: "+", label: "newsletter subscribers, from zero" },
  { value: 8, prefix: "$", suffix: "M+", label: "ARR launched 0-to-1" },
  { value: 3, prefix: "", suffix: "", label: "PMM functions built 0-to-1" },
  { value: 2, prefix: "", suffix: "", label: "open-source AI tools shipped" },
];

// AI-native + GTM stack rendered as a logo grid in the Stack tile.
//
// `slug` is a verified Simple Icons slug (https://cdn.simpleicons.org/{slug}).
// Tools with no Simple Icons brand mark use `slug: null` and fall back to a
// styled monogram chip rendered in-DOM, so a logo can never break. Every slug
// below was HEAD-checked against the Simple Icons CDN.
export type StackTool = { name: string; slug: string | null };

export const stack: StackTool[] = [
  // AI / build
  { name: "Claude", slug: "anthropic" },
  { name: "OpenAI", slug: null },
  { name: "Cursor", slug: "cursor" },
  { name: "Python", slug: "python" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Next.js", slug: "nextdotjs" },
  { name: "React", slug: "react" },
  { name: "Tailwind", slug: "tailwindcss" },
  { name: "Vercel", slug: "vercel" },
  { name: "GitHub", slug: "github" },
  { name: "n8n", slug: "n8n" },
  { name: "Zapier", slug: "zapier" },
  { name: "Hugging Face", slug: "huggingface" },
  { name: "Perplexity", slug: "perplexity" },
  { name: "Notion", slug: "notion" },
  { name: "Linear", slug: "linear" },
  { name: "Figma", slug: "figma" },
  { name: "Slack", slug: null },
  // GTM / marketing / sales
  { name: "HubSpot", slug: "hubspot" },
  { name: "Salesforce", slug: null },
  { name: "Apollo", slug: null },
  { name: "Gong", slug: null },
  { name: "Navattic", slug: null },
  { name: "Semrush", slug: "semrush" },
  { name: "GA4", slug: "googleanalytics" },
  { name: "Google Ads", slug: "googleads" },
  { name: "Webflow", slug: "webflow" },
  { name: "beehiiv", slug: null },
  { name: "Intercom", slug: "intercom" },
  { name: "Segment", slug: null },
  { name: "Canva", slug: null },
];

// Michael's focus areas (rendered in the focus-areas marquee tile).
export const focusAreas = [
  { name: "Go-to-Market", body: "0-to-1 launches, positioning, and category strategy." },
  { name: "Pricing & Packaging", body: "Good-better-best architecture; attach-rate and ARPA lift." },
  { name: "Competitive Intel", body: "Teardowns, battlecards, and win/loss that move win rates." },
  { name: "AI-Native Ops", body: "Multi-agent workflows that deliver a team's output, solo." },
  { name: "Demand & Content", body: "A weekly newsletter grown from zero to 5,000+ subscribers." },
  { name: "Product", body: "A self-built prototype that became a funded roadmap product." },
];

// Back-compat shape for any component still importing defaultDomains (marquee tile).
export const defaultDomains = focusAreas.map((f) => ({
  name: f.name,
  body: f.body,
  slug: f.name.toLowerCase().replace(/[^a-z]+/g, "-"),
  image: "",
}));
