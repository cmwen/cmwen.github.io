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
  },
};
