// Site content for michaellock - sourced from resume + LinkedIn.

export const profile = {
  name: "Michael Lock",
  headline: "Product Marketing & Marketing Leader · AI-Native GTM Operator",
  tagline:
    "I build the marketing function, the product launch, and the AI system that runs both.",
  location: "San Diego, CA",
  email: "themichaellock@gmail.com",
  avatar: "/images/headshot.jpg", // placeholder until headshot is added; fallback github.com/milock.png
  links: {
    linkedin: "https://linkedin.com/in/lockmichael",
    github: "https://github.com/milock",
    blog: "/blog",
    resume: "/michael-lock-resume.pdf",
    email: "mailto:themichaellock@gmail.com",
  },
};

// Short, first-person bio (condensed from LinkedIn About).
export const about =
  "I build the thing from nothing: the marketing function, the product launch, and now the AI system that runs the work. I've stood up product marketing from zero at three companies, led two 0→1 launches to $8M+ combined ARR, and I run a marketing function on a self-built multi-agent system, with two of the tools open-sourced. Deep healthcare and vertical SaaS.";

export const experience = [
  {
    company: "Clarity RCM",
    title: "Head of Marketing",
    period: "2025–Present",
    badges: ["Founding marketer", "$20M ARR"],
    logoDomain: "clarityrcm.com",
    metric:
      "First marketing hire at a $20M ARR healthcare RCM company; built the function 0→1.",
  },
  {
    company: "Elation Health",
    title: "Principal PMM",
    period: "2023–2025",
    badges: ["Series D", "$50M ARR"],
    logoDomain: "elationhealth.com",
    metric: "Led two 0→1 launches (AI Scribe, Billing) to $8M+ combined ARR.",
  },
  {
    company: "360training",
    title: "PMM Lead, Healthcare",
    period: "2022–2023",
    badges: ["PE-backed", "$36M→$72M"],
    logoDomain: "360training.com",
    metric:
      "Built PMM 0→4; scaled an acquired line to $10M ARR; helped 2x the business $36M→$72M.",
  },
  {
    company: "ExSite",
    title: "Founder, Fractional PMM",
    period: "2018–2022",
    badges: ["Founder", "$2M raised"],
    logoDomain: "",
    metric: "15+ early-stage clients; directed a $2M Kickstarter (top 1% that year).",
  },
  {
    company: "Meta",
    title: "Product Ops, Platform",
    period: "2016–2018",
    badges: ["NASDAQ: META", "0→500K MAU"],
    logoDomain: "meta.com",
    metric: "Scaled Facebook Gaming 0→500K MAU.",
  },
];

export const projects = [
  {
    name: "humanizer",
    description:
      "Open-source Claude skill that scrubs AI-writing tells across the content workflow - 6-step pipeline, 16 structural patterns, 3-tier vocab system.",
    repo: "milock/humanizer",
    url: "https://github.com/milock/humanizer",
    language: "Python",
  },
  {
    name: "polysearch",
    description:
      "Modular, multi-source research pipeline with citation-tier classification - plug-and-play package + Claude skill + agent template.",
    repo: "milock/polysearch",
    url: "https://github.com/milock/polysearch",
    language: "Python",
  },
  {
    name: "lock",
    description:
      "This site - a Next.js bento built and shipped solo. Open source.",
    repo: "milock/lock",
    url: "https://github.com/milock/lock",
    language: "TypeScript",
  },
];

// Used by the number-ticker metrics tile.
export const metrics = [
  { value: 1000, prefix: "", suffix: "+", label: "newsletter subscribers, from zero" },
  { value: 8, prefix: "$", suffix: "M+", label: "ARR launched 0→1" },
  { value: 3, prefix: "", suffix: "", label: "PMM functions built 0→1" },
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
  { name: "Go-to-Market", body: "0→1 launches, positioning, and category strategy." },
  { name: "Pricing & Packaging", body: "Good-better-best architecture; attach-rate and ARPA lift." },
  { name: "Competitive Intel", body: "Teardowns, battlecards, and win/loss that move win rates." },
  { name: "AI-Native Ops", body: "Multi-agent workflows that deliver a team's output, solo." },
  { name: "Demand & Content", body: "A weekly newsletter grown from zero to ~1,000 subscribers." },
  { name: "Product", body: "A self-built prototype that became a funded roadmap product." },
];

// Back-compat shape for any component still importing defaultDomains (marquee tile).
export const defaultDomains = focusAreas.map((f) => ({
  name: f.name,
  body: f.body,
  slug: f.name.toLowerCase().replace(/[^a-z]+/g, "-"),
  image: "",
}));
