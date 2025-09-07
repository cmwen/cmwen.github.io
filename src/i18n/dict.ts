import type { Locale } from "./config";

type Dict = {
  nav: {
    posts: string;
    tags: string;
    agents: string;
    profolio: string;
    toolbox: string;
    about: string;
    searchAria: string;
  };
  common: {
    skipToContent: string;
    featured: string;
    recentPosts: string;
    allPosts: string;
    searchPlaceholder: string;
  };
  toolbox: {
    sections: {
      browsers: string;
      "mobile-browsers": string;
      "knowledge-media": string;
      "development-tools": string;
      "automation-tools": string;
    };
    common: {
      techStack: string;
      source: string;
    };
  };
  profolio: {
    sections: {
      pwa: string;
      cli: string;
      mcp: string;
    };
    projects: {
      japaneseLearningSuffix: string;
      japaneseDescription: string;
      podcastWipSuffix: string;
      podcastDescription: string;
      todoMultimode: string;
      todoDescription: string;
      minKbSuffix: string;
      minKbDescription: string;
      minN8nSuffix: string;
      minN8nDescription: string;
    };
    tech: {
      pwaPwa: string;
      pwaNpmGlobal: string;
      typescriptMonorepo: string;
      sqliteWebsocket: string;
      nextjsMcp: string;
      cliOrchestrator: string;
      typescriptNodejs: string;
      sqliteWasm: string;
      mcpServer: string;
      httpClientInfra: string;
      mcpServerMode: string;
    };
  };
};

export const messages: Record<Locale, Dict> = {
  en: {
    nav: {
      posts: "Posts",
      tags: "Tags",
      agents: "Agents",
      profolio: "Profolio",
      toolbox: "Toolbox",
      about: "About",
      searchAria: "Search",
    },
    common: {
      skipToContent: "Skip to content",
      featured: "Featured",
      recentPosts: "Recent Posts",
      allPosts: "All Posts",
      searchPlaceholder: "Search for anything...",
    },
    toolbox: {
      sections: {
        browsers: "Browsers",
        "mobile-browsers": "Mobile Browser",
        "knowledge-media": "Knowledge & Media",
        "development-tools": "Development Tools",
        "automation-tools": "Automation Tools",
      },
      common: {
        techStack: "Tech stack:",
        source: "Source:",
      },
    },
    profolio: {
      sections: {
        pwa: "PWA",
        cli: "CLI Applications",
        mcp: "MCP Servers",
      },
      projects: {
        japaneseLearningSuffix: "Japanese Learning (Kanji-Go)",
        japaneseDescription:
          "A Progressive Web App for learning basic Japanese (Hiragana, Katakana, and essential vocabulary) with offline-first experience and flashcards.",
        podcastWipSuffix: "Podcast Lister App (WIP)",
        podcastDescription:
          "A lightweight installable PWA for subscribing to podcasts via RSS, managing playlists, and listening offline.",
        todoMultimode: "@cmwen/todo-app — Multi-mode TODO Application",
        todoDescription:
          "A comprehensive TODO app CLI with three modes: traditional CLI interface, modern web UI with real-time updates, and MCP server for AI agent integration. Single executable orchestrating multiple interfaces.",
        minKbSuffix: "@cmwen/min-kb-mcp — Minimalist Knowledge Base MCP",
        minKbDescription:
          "A minimalist, file‑based knowledge base server for AI agents via the Model Context Protocol. Uses Markdown files and a WASM SQLite index with optional FTS5.",
        minN8nSuffix: "@cmwen/min-n8n-mcp — n8n MCP Server",
        minN8nDescription:
          "A TypeScript-based MCP server that exposes n8n workflow management as tools for AI agents. Provides STDIO and HTTP modes with robust error handling and typed schemas.",
      },
      tech: {
        pwaPwa: "PWA/offline-first; GitHub Pages deployment",
        pwaNpmGlobal: "PWA/offline-first; GitHub Pages deployment",
        typescriptMonorepo: "TypeScript monorepo with shared types",
        sqliteWebsocket: "SQLite database, WebSocket real-time updates",
        nextjsMcp: "Next.js frontend, MCP stdio server",
        cliOrchestrator: "CLI orchestrator with global npm installation",
        typescriptNodejs: "TypeScript, Node.js",
        sqliteWasm: "sql.js (WASM SQLite), optional FTS5",
        mcpServer: "MCP server (stdio/HTTP dev), Zod schemas",
        httpClientInfra: "HTTP client infra, retries/timeouts, caching",
        mcpServerMode: "MCP server (stdio/HTTP), MCP Inspector compatible",
      },
    },
  },
  "zh-hant": {
    nav: {
      posts: "文章",
      tags: "標籤",
      agents: "代理",
      profolio: "作品集",
      toolbox: "工具箱",
      about: "關於",
      searchAria: "搜尋",
    },
    common: {
      skipToContent: "跳至內容",
      featured: "精選",
      recentPosts: "最新文章",
      allPosts: "所有文章",
      searchPlaceholder: "搜尋內容…",
    },
    toolbox: {
      sections: {
        browsers: "瀏覽器",
        "mobile-browsers": "行動瀏覽器",
        "knowledge-media": "知識與媒體",
        "development-tools": "開發工具",
        "automation-tools": "自動化工具",
      },
      common: {
        techStack: "技術堆疊：",
        source: "原始碼：",
      },
    },
    profolio: {
      sections: {
        pwa: "PWA 應用",
        cli: "CLI 應用程式",
        mcp: "MCP 伺服器",
      },
      projects: {
        japaneseLearningSuffix: "日語學習 (Kanji-Go)",
        japaneseDescription:
          "一個用於學習基礎日語（平假名、片假名和必備詞彙）的漸進式網頁應用，具有離線優先體驗和卡片學習功能。",
        podcastWipSuffix: "Podcast 播放器應用（開發中）",
        podcastDescription:
          "一個輕量級可安裝的 PWA，用於透過 RSS 訂閱播客、管理播放清單和離線收聽。",
        todoMultimode: "@cmwen/todo-app — 多模式待辦事項應用",
        todoDescription:
          "一個全面的待辦事項 CLI 應用，具有三種模式：傳統命令列介面、具備即時更新的現代網頁 UI，以及用於 AI 代理程式整合的 MCP 伺服器。單一執行檔編排多種介面。",
        minKbSuffix: "@cmwen/min-kb-mcp — 極簡知識庫 MCP",
        minKbDescription:
          "一個基於檔案的極簡知識庫伺服器，透過模型上下文協定為 AI 代理程式提供服務。使用 Markdown 檔案和 WASM SQLite 索引，可選 FTS5。",
        minN8nSuffix: "@cmwen/min-n8n-mcp — n8n MCP 伺服器",
        minN8nDescription:
          "一個基於 TypeScript 的 MCP 伺服器，將 n8n 工作流程管理作為工具提供給 AI 代理程式。提供 STDIO 和 HTTP 模式，具備強健的錯誤處理和型別結構描述。",
      },
      tech: {
        pwaPwa: "PWA/離線優先；GitHub Pages 部署",
        pwaNpmGlobal: "PWA/離線優先；GitHub Pages 部署",
        typescriptMonorepo: "TypeScript monorepo 具備共享型別",
        sqliteWebsocket: "SQLite 資料庫、WebSocket 即時更新",
        nextjsMcp: "Next.js 前端、MCP stdio 伺服器",
        cliOrchestrator: "CLI 編排器支援全域 npm 安裝",
        typescriptNodejs: "TypeScript, Node.js",
        sqliteWasm: "sql.js (WASM SQLite)，可選 FTS5",
        mcpServer: "MCP 伺服器 (stdio/HTTP 開發)，Zod 結構描述",
        httpClientInfra: "HTTP 客戶端基礎架構、重試/逾時、快取",
        mcpServerMode: "MCP 伺服器 (stdio/HTTP)，MCP Inspector 相容",
      },
    },
  },
};
