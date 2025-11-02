export type ToolLink = {
  label: string;
  href: string;
};

export type Tool = {
  name: string;
  why: string;
  links?: ToolLink[];
  tags?: string[];
  current?: boolean;
};

export type ToolboxSection = {
  id: string; // slug/id
  title: string;
  tools: Tool[];
};

// Initial toolbox content based on user's notes
export const TOOLBOX: ToolboxSection[] = [
  {
    id: "browsers",
    title: "Browsers",
    tools: [
      {
        name: "Zen",
        why: "Reinvented Firefox. User friendly. Switched away due to limited AI integration.",
        links: [
          { label: "Website", href: "https://www.zen-browser.app/" },
          {
            label: "Mozilla Firefox",
            href: "https://www.mozilla.org/firefox/",
          },
        ],
        tags: ["browser", "firefox", "productivity"],
      },
      {
        name: "OpenAI Atlas",
        why: "Current AI-native browser I rely on daily; blends browsing with GPT-5 agents, tab memory, and automation.",
        links: [{ label: "Website", href: "https://atlas.openai.com/" }],
        tags: ["browser", "ai", "automation"],
        current: true,
      },
      {
        name: "Dia",
        why: "AI-first browser: chat with the current page, summarize YouTube, skills (predefined prompts), access multiple tabs. Paused use after switching to Atlas.",
        links: [{ label: "Website", href: "https://www.diabrowser.com/" }],
        tags: ["browser", "ai", "youtube", "prompts"],
      },
      {
        name: "Comet",
        why: "AI-powered browser from Perplexity. Similar to Dia plus UI automation that can take over to do tasks. On hold while Atlas is my primary.",
        links: [
          { label: "Website", href: "https://www.perplexity.ai/comet" },
          { label: "Perplexity", href: "https://www.perplexity.ai/" },
        ],
        tags: ["browser", "ai", "automation"],
      },
      {
        name: "Edge",
        why: "Microsoft Edge with Copilot. Used at work. GPT-5 Copilot with Edge is great.",
        links: [
          { label: "Website", href: "https://www.microsoft.com/edge" },
          { label: "Copilot", href: "https://copilot.microsoft.com/" },
        ],
        tags: ["browser", "copilot", "work"],
      },
      {
        name: "Chrome",
        why: "Primarily for web development now.",
        links: [{ label: "Website", href: "https://www.google.com/chrome/" }],
        tags: ["browser", "dev"],
      },
    ],
  },
  {
    id: "mobile-browsers",
    title: "Mobile Browser",
    tools: [
      {
        name: "Edge (Mobile)",
        why: "Current choice. Copilot integration is easy to use.",
        links: [
          {
            label: "iOS",
            href: "https://apps.apple.com/app/microsoft-edge-web-browser/id1288723196",
          },
          {
            label: "Android",
            href: "https://play.google.com/store/apps/details?id=com.microsoft.emmx",
          },
        ],
        tags: ["mobile", "browser", "copilot"],
        current: true,
      },
      {
        name: "Firefox (Mobile)",
        why: "Sometimes. Still like Firefox—less mainstream, potentially fewer scams; customizable, fast, and cloud sync.",
        links: [
          {
            label: "iOS",
            href: "https://apps.apple.com/app/firefox-private-safe-browser/id989804926",
          },
          {
            label: "Android",
            href: "https://play.google.com/store/apps/details?id=org.mozilla.firefox",
          },
        ],
        tags: ["mobile", "browser", "privacy", "sync"],
      },
    ],
  },
  // Group knowledge- and media-related singletons into one section
  {
    id: "knowledge-media",
    title: "Knowledge & Media",
    tools: [
      {
        name: "AntennaPod",
        why: "Open-source and ad-free podcast app.",
        links: [
          { label: "Website", href: "https://antennapod.org/" },
          {
            label: "Android",
            href: "https://play.google.com/store/apps/details?id=de.danoeh.antennapod",
          },
          {
            label: "F-Droid",
            href: "https://f-droid.org/en/packages/de.danoeh.antennapod/",
          },
        ],
        tags: ["podcasts", "open-source", "ad-free"],
      },
      {
        name: "Raindrop.io",
        why: "Not used much; mainly consume news from podcasts.",
        links: [
          { label: "Website", href: "https://raindrop.io/" },
          { label: "Apps", href: "https://help.raindrop.io/apps" },
        ],
        tags: ["bookmarks", "read-it-later"],
      },
      {
        name: "Logseq",
        why: "Markdown-based journaling. Simple, indentation matches how I think; pretty free form.",
        links: [
          { label: "Website", href: "https://logseq.com/" },
          { label: "GitHub", href: "https://github.com/logseq/logseq" },
        ],
        tags: ["knowledge-base", "journal", "markdown"],
      },
    ],
  },
  // Merge IDE and Editors into Development Tools
  {
    id: "development-tools",
    title: "Development Tools",
    tools: [
      {
        name: "VS Code",
        why: "Used for work and personal. Copilot Pro license.",
        links: [
          { label: "Website", href: "https://code.visualstudio.com/" },
          {
            label: "GitHub Copilot",
            href: "https://github.com/features/copilot",
          },
        ],
        tags: ["ide", "copilot", "work", "personal"],
      },
      {
        name: "Zed",
        why: "High-performance text editor with AI integration. Used occasionally for simple text edits.",
        links: [{ label: "Website", href: "https://zed.dev/" }],
        tags: ["editor", "ai"],
      },
      {
        name: "Vim",
        why: "When in CLI or for quick edits. Sometimes used.",
        links: [{ label: "Website", href: "https://www.vim.org/" }],
        tags: ["editor", "cli"],
      },
    ],
  },
  // New: Automation Tools section (n8n)
  {
    id: "automation-tools",
    title: "Automation Tools",
    tools: [
      {
        name: "n8n",
        why: "Low-code automation platform to build workflows. Supports schedule triggers, webhooks, and even a chatbot interface.",
        links: [
          { label: "Website", href: "https://n8n.io/" },
          { label: "Docs", href: "https://docs.n8n.io/" },
          { label: "GitHub", href: "https://github.com/n8n-io/n8n" },
        ],
        tags: [
          "automation",
          "low-code",
          "workflows",
          "webhook",
          "scheduler",
          "chatbot",
        ],
        // current will be auto-marked since this section has a single tool
      },
    ],
  },
];
