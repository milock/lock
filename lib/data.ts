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
    metric:
      "First marketing hire at a $20M ARR healthcare RCM company; built the function 0→1.",
  },
  {
    company: "Elation Health",
    title: "Principal Product Marketing Manager",
    period: "2023–2025",
    metric: "Led two 0→1 launches (AI Scribe, Billing) to $8M+ combined ARR.",
  },
  {
    company: "360training",
    title: "Product Marketing Lead, Healthcare",
    period: "2022–2023",
    metric:
      "Built PMM 0→4; scaled an acquired line to $10M ARR; helped 2x the business $36M→$72M.",
  },
  {
    company: "ExSite",
    title: "Founder, Fractional PMM Practice",
    period: "2018–2022",
    metric: "15+ early-stage clients; directed a $2M Kickstarter (top 1% that year).",
  },
  {
    company: "Meta",
    title: "Product Operations Analyst, Platform",
    period: "2016–2018",
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
];

// Used by the number-ticker metrics tile.
export const metrics = [
  { value: 1000, prefix: "", suffix: "+", label: "newsletter subscribers, from zero" },
  { value: 8, prefix: "$", suffix: "M+", label: "ARR launched 0→1" },
  { value: 3, prefix: "", suffix: "", label: "PMM functions built 0→1" },
  { value: 2, prefix: "", suffix: "", label: "open-source AI tools shipped" },
];

// AI-native + GTM stack (reframes the dev icon-cloud).
export const stack = [
  "Claude",
  "MCP",
  "Python",
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "HubSpot",
  "Webflow",
  "beehiiv",
  "Vercel",
  "Perplexity",
  "Firecrawl",
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
