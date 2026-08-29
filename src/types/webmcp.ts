export type WebMCPContentKind =
  | "post"
  | "notebook"
  | "mindmap"
  | "tool"
  | "agent";

export type WebMCPContentLanguage = "en" | "zh-hant";

export type WebMCPAlternates = Partial<Record<WebMCPContentLanguage, string>>;

export interface WebMCPSearchIndexItem {
  id: string;
  kind: WebMCPContentKind;
  title: string;
  description: string;
  url: string;
  lang: WebMCPContentLanguage;
  tags: string[];
  publishedAt?: string;
  updatedAt?: string;
  keyIdeas?: string[];
  alternates?: WebMCPAlternates;
  searchTerms?: string[];
}

export interface WebMCPSearchIndex {
  version: 1;
  items: WebMCPSearchIndexItem[];
}

export interface WebMCPContentPageContext {
  kind: "post" | "notebook";
  title: string;
  description: string;
  author: string;
  lang: WebMCPContentLanguage;
  canonicalUrl: string;
  alternates?: WebMCPAlternates;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  keyIdeas?: string[];
}

export interface WebMCPMindMapRef {
  targetId: string;
  label?: string;
}

export interface WebMCPMindMapNode {
  id: string;
  label: string;
  notes?: string;
  annotation?: string;
  refs?: WebMCPMindMapRef[];
  children?: WebMCPMindMapNode[];
}

export interface WebMCPMindMapPageContext {
  kind: "mindmap";
  title: string;
  description: string;
  lang: WebMCPContentLanguage;
  canonicalUrl: string;
  alternates?: WebMCPAlternates;
  tags: string[];
  root: WebMCPMindMapNode;
}

export type WebMCPPageContext =
  | WebMCPContentPageContext
  | WebMCPMindMapPageContext;
