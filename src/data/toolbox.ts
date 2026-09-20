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
        why: "Previously my primary AI-native browser; I moved to Chrome for its Gemini integration and Codex browser control.",
        links: [{ label: "Website", href: "https://atlas.openai.com/" }],
        tags: ["browser", "ai", "automation"],
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
        why: "My current browser. The Gemini subscription makes Chrome a natural fit, and the Codex extension can drive the browser for computer-use workflows.",
        links: [{ label: "Website", href: "https://www.google.com/chrome/" }],
        tags: ["browser", "gemini", "computer-use"],
        current: true,
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
        why: "Still used for work and personal editing, with GitHub Copilot mainly serving my work workflow now.",
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
        name: "OpenAI Codex",
        why: "My primary personal coding agent nowadays. I use the Codex app heavily for building and maintaining software.",
        links: [{ label: "Website", href: "https://openai.com/codex/" }],
        tags: ["coding-agent", "openai", "personal"],
        current: true,
      },
      {
        name: "GitHub Copilot CLI",
        why: "Still useful as a coding agent at work, but I rarely use it as my personal coding agent now.",
        links: [
          { label: "Website", href: "https://github.com/features/copilot" },
          {
            label: "CLI documentation",
            href: "https://docs.github.com/en/copilot/how-tos/use-ai-models/use-copilot-agents/use-copilot-cli",
          },
        ],
        tags: ["coding-agent", "cli", "work"],
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
  {
    id: "ai-coding-models",
    title: "AI Coding & Models",
    tools: [
      {
        name: "T3 Code",
        why: "A unified interface for running and switching between different coding agents, including remote access from web and mobile clients.",
        links: [
          { label: "Website", href: "https://t3.codes/" },
          { label: "GitHub", href: "https://github.com/pingdotgg/t3code" },
        ],
        tags: ["coding-agent", "multi-agent", "remote"],
        current: true,
      },
      {
        name: "OpenCode",
        why: "An open-source coding agent I use with open-weight models and different model providers.",
        links: [
          { label: "Website", href: "https://opencode.ai/" },
          { label: "GitHub", href: "https://github.com/anomalyco/opencode" },
        ],
        tags: ["coding-agent", "open-source", "open-models"],
        current: true,
      },
      {
        name: "OpenRouter",
        why: "The model gateway I use to access open-weight models from different providers.",
        links: [{ label: "Website", href: "https://openrouter.ai/" }],
        tags: ["models", "open-models", "api"],
        current: true,
      },
    ],
  },
  // Automation Tools
  {
    id: "automation-tools",
    title: "Automation Tools",
    tools: [
      {
        name: "Temporal",
        why: "My current workflow orchestration platform, replacing n8n for durable and reliable long-running workflows.",
        links: [
          { label: "Website", href: "https://temporal.io/" },
          { label: "Docs", href: "https://docs.temporal.io/" },
          { label: "GitHub", href: "https://github.com/temporalio/temporal" },
        ],
        tags: [
          "automation",
          "workflow-orchestration",
          "durable-execution",
          "distributed-systems",
        ],
        current: true,
      },
    ],
  },
  // New: Toolbars section - curated resources and references
  {
    id: "toolbars",
    title: "Toolbars",
    tools: [
      {
        name: "Skills",
        why: "Modern web guidance and best practices for building web applications.",
        links: [
          {
            label: "Chrome Modern Web Guidance",
            href: "https://developer.chrome.com/docs/modern-web-guidance",
          },
        ],
        tags: ["resources", "web-development", "best-practices"],
      },
      {
        name: "LLM Reference",
        why: "Curated references for exploring and comparing language models.",
        links: [
          {
            label: "Artificial Analysis",
            href: "https://artificialanalysis.ai/",
          },
          {
            label: "Arena AI Leaderboard",
            href: "https://arena.ai/leaderboard/",
          },
          { label: "Models.dev", href: "https://models.dev/" },
          {
            label: "Token Calculator",
            href: "https://tokencalculator.com",
          },
        ],
        tags: ["resources", "llm", "ai-models", "comparison"],
      },
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructure",
    tools: [
      {
        name: "Pocket ID",
        why: "My internal identity provider. Passkey-based sign-in gives me a secure system without memorizing every username and password.",
        links: [{ label: "Website", href: "https://pocket-id.org/" }],
        tags: ["identity", "oidc", "passkeys", "self-hosted"],
        current: true,
      },
      {
        name: "OpenObserve",
        why: "My OpenTelemetry server for basic tracing and logging across my internal systems.",
        links: [{ label: "Website", href: "https://openobserve.ai/" }],
        tags: ["observability", "opentelemetry", "logging", "tracing"],
        current: true,
      },
      {
        name: "Tailscale",
        why: "The private network layer I use to connect and access internal services securely.",
        links: [{ label: "Website", href: "https://tailscale.com/" }],
        tags: ["networking", "vpn", "self-hosted"],
        current: true,
      },
      {
        name: "Caddy",
        why: "My reverse proxy for exposing internal services with simple configuration and automatic HTTPS.",
        links: [{ label: "Website", href: "https://caddyserver.com/" }],
        tags: ["reverse-proxy", "https", "self-hosted"],
        current: true,
      },
    ],
  },
];
