import type {
  WebMCPContentKind,
  WebMCPContentPageContext,
  WebMCPMindMapNode,
  WebMCPMindMapPageContext,
  WebMCPPageContext,
  WebMCPSearchIndex,
  WebMCPSearchIndexItem,
} from "../types/webmcp";

type ToolArguments = Record<string, unknown>;

type WebMCPTool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: {
    readOnlyHint: boolean;
    untrustedContentHint: boolean;
  };
  execute: (
    input: unknown,
    options?: { signal?: AbortSignal }
  ) => string | Promise<string>;
};

type ModelContext = {
  registerTool: (
    tool: WebMCPTool,
    options?: { signal?: AbortSignal }
  ) => Promise<undefined>;
};

type WebMCPDocument = Document & { modelContext?: ModelContext };

const CONTENT_KINDS: WebMCPContentKind[] = [
  "post",
  "notebook",
  "mindmap",
  "tool",
  "agent",
];
const OUTPUT_BUDGET = 1500;
const PAGE_CONTEXT_ID = "webmcp-page-context";

let activeRegistration: AbortController | undefined;
let lastRegistrationKey = "";

const isRecord = (value: unknown): value is ToolArguments =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const truncate = (value: string, maxLength: number) =>
  value.length > maxLength
    ? `${value.slice(0, maxLength - 1).trimEnd()}…`
    : value;

const normalizedText = (value: string) => value.replace(/\s+/g, " ").trim();

const parsePageContext = (): WebMCPPageContext | undefined => {
  const element = document.getElementById(PAGE_CONTEXT_ID);
  if (!element?.textContent) return undefined;

  try {
    const context = JSON.parse(element.textContent) as WebMCPPageContext;
    if (
      context.kind === "post" ||
      context.kind === "notebook" ||
      context.kind === "mindmap"
    ) {
      return context;
    }
  } catch {
    // Invalid page context should not affect the human-facing site.
  }

  return undefined;
};

const getInteger = (
  value: unknown,
  fallback: number,
  minimum: number,
  maximum: number
) => {
  if (value === undefined) return fallback;
  if (!Number.isInteger(value)) {
    throw new TypeError("Expected an integer value.");
  }
  return Math.min(maximum, Math.max(minimum, value as number));
};

const budgetSearchResults = (
  query: string,
  matches: WebMCPSearchIndexItem[],
  limit: number
) => {
  const results: Array<Record<string, unknown>> = [];
  let truncatedResults = false;

  for (const match of matches.slice(0, limit)) {
    const result = {
      id: match.id,
      kind: match.kind,
      title: match.title,
      description: truncate(match.description, 180),
      url: match.url,
      lang: match.lang,
      tags: match.tags.slice(0, 5),
      alternates: match.alternates,
    };
    results.push(result);

    if (
      JSON.stringify({ query, totalMatches: matches.length, results }).length >
      OUTPUT_BUDGET
    ) {
      results.pop();
      truncatedResults = true;
      break;
    }
  }

  return JSON.stringify({
    query,
    totalMatches: matches.length,
    returnedMatches: results.length,
    truncated: truncatedResults || matches.length > results.length,
    results,
  });
};

const createSearchTool = (): WebMCPTool => ({
  name: "search_site",
  title: "Search Min Wen's site",
  description:
    "Search this site for relevant posts, notebooks, mind maps, tools, and AI prompt agents. Returns concise metadata and canonical URLs.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        minLength: 2,
        maxLength: 200,
        description: "Natural-language topic or keyword query.",
      },
      kinds: {
        type: "array",
        items: { type: "string", enum: CONTENT_KINDS },
        maxItems: CONTENT_KINDS.length,
        uniqueItems: true,
        description: "Optional content types to include.",
      },
      language: {
        type: "string",
        enum: ["any", "en", "zh-hant"],
        description: "Optional content language filter.",
      },
      tags: {
        type: "array",
        items: { type: "string", maxLength: 50 },
        maxItems: 8,
        uniqueItems: true,
        description: "Optional tags that every result must contain.",
      },
      limit: {
        type: "integer",
        minimum: 1,
        maximum: 8,
        description: "Maximum results to return. Defaults to 5.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: true,
    untrustedContentHint: true,
  },
  execute: async (input, options) => {
    if (!isRecord(input)) throw new TypeError("Expected an argument object.");

    const query = typeof input.query === "string" ? input.query.trim() : "";
    if (query.length < 2 || query.length > 200) {
      throw new RangeError("query must contain between 2 and 200 characters.");
    }

    const language = input.language ?? "any";
    if (!(["any", "en", "zh-hant"] as unknown[]).includes(language)) {
      throw new TypeError("language must be any, en, or zh-hant.");
    }

    const rawKinds = input.kinds ?? [];
    if (
      !Array.isArray(rawKinds) ||
      rawKinds.length > CONTENT_KINDS.length ||
      rawKinds.some(kind => !CONTENT_KINDS.includes(kind)) ||
      new Set(rawKinds).size !== rawKinds.length
    ) {
      throw new TypeError(
        "kinds must contain unique, supported content types."
      );
    }
    const kinds = rawKinds as WebMCPContentKind[];

    const rawTags = input.tags ?? [];
    if (
      !Array.isArray(rawTags) ||
      rawTags.length > 8 ||
      rawTags.some(
        tag => typeof tag !== "string" || tag.length === 0 || tag.length > 50
      ) ||
      new Set(rawTags).size !== rawTags.length
    ) {
      throw new TypeError(
        "tags must contain at most 8 unique strings of 1 to 50 characters."
      );
    }
    const tags = rawTags.map(tag => tag.toLowerCase());
    const limit = getInteger(input.limit, 5, 1, 8);

    const basePath = import.meta.env.BASE_URL.replace(/\/?$/, "/");
    const indexUrl = new URL(
      `${basePath}webmcp/content-index.json`,
      location.origin
    );
    const response = await fetch(indexUrl, {
      cache: "force-cache",
      signal: options?.signal,
    });
    if (!response.ok) {
      throw new Error(`Site search index returned HTTP ${response.status}.`);
    }
    const index = (await response.json()) as WebMCPSearchIndex;

    const filteredItems = index.items.filter(item => {
      const includesKind = kinds.length === 0 || kinds.includes(item.kind);
      const includesLanguage = language === "any" || item.lang === language;
      const itemTags = item.tags.map(tag => tag.toLowerCase());
      const includesTags = tags.every(tag => itemTags.includes(tag));
      return includesKind && includesLanguage && includesTags;
    });

    const { default: Fuse } = await import("fuse.js");
    const fuse = new Fuse(filteredItems, {
      keys: [
        { name: "title", weight: 0.4 },
        { name: "description", weight: 0.25 },
        { name: "tags", weight: 0.2 },
        { name: "keyIdeas", weight: 0.1 },
        { name: "searchTerms", weight: 0.05 },
      ],
      ignoreLocation: true,
      threshold: 0.4,
    });

    return budgetSearchResults(
      query,
      fuse.search(query).map(result => result.item),
      limit
    );
  },
});

const getHeadingText = (heading: Element) => {
  const copy = heading.cloneNode(true) as Element;
  copy.querySelectorAll(".heading-link").forEach(link => link.remove());
  return normalizedText(copy.textContent ?? "");
};

const articleHeadings = () =>
  Array.from(
    document.querySelectorAll(
      "#article h2, #article h3, #article h4, #article h5, #article h6"
    )
  );

const contentMetadata = (context: WebMCPContentPageContext) => ({
  kind: context.kind,
  title: context.title,
  description: truncate(context.description, 300),
  author: context.author,
  language: context.lang,
  canonicalUrl: context.canonicalUrl,
  alternates: context.alternates,
  publishedAt: context.publishedAt,
  updatedAt: context.updatedAt,
  tags: context.tags.slice(0, 10),
  keyIdeas: context.keyIdeas?.slice(0, 8),
});

const readIntroduction = () => {
  const article = document.getElementById("article");
  const parts: string[] = [];
  let element = article?.firstElementChild ?? null;

  while (element && !element.matches("h2, h3, h4, h5, h6")) {
    const text = normalizedText(element.textContent ?? "");
    if (text) parts.push(text);
    element = element.nextElementSibling;
  }

  return parts.join("\n\n");
};

const readSection = (requestedSection: string) => {
  const headings = articleHeadings();
  const target = requestedSection.toLowerCase();
  const heading =
    headings.find(candidate => candidate.id.toLowerCase() === target) ??
    headings.find(
      candidate => getHeadingText(candidate).toLowerCase() === target
    ) ??
    headings.find(candidate =>
      getHeadingText(candidate).toLowerCase().includes(target)
    );

  if (!heading) return undefined;

  const headingLevel = Number(heading.tagName.slice(1));
  const parts: string[] = [];
  let element = heading.nextElementSibling;

  while (element) {
    if (/^H[2-6]$/.test(element.tagName)) {
      const level = Number(element.tagName.slice(1));
      if (level <= headingLevel) break;
    }
    const text = normalizedText(element.textContent ?? "");
    if (text) parts.push(text);
    element = element.nextElementSibling;
  }

  return {
    id: heading.id,
    heading: getHeadingText(heading),
    content: parts.join("\n\n"),
  };
};

const createReadContentTool = (
  context: WebMCPContentPageContext
): WebMCPTool => ({
  name: "read_content",
  title: "Read the current content",
  description:
    "Read reliable metadata, the heading outline, or one section from the post or notebook currently open in this tab.",
  inputSchema: {
    type: "object",
    properties: {
      view: {
        type: "string",
        enum: ["metadata", "outline", "section"],
        description: "The part of the current content to return.",
      },
      section: {
        type: "string",
        maxLength: 120,
        description:
          "Heading text or ID for section view. Use introduction for text before the first heading.",
      },
      maxChars: {
        type: "integer",
        minimum: 200,
        maximum: 1000,
        description: "Maximum section text characters. Defaults to 900.",
      },
    },
    required: ["view"],
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: true,
    untrustedContentHint: true,
  },
  execute: input => {
    if (!isRecord(input)) throw new TypeError("Expected an argument object.");
    const view = input.view;

    if (view === "metadata") {
      return JSON.stringify(contentMetadata(context));
    }

    if (view === "outline") {
      const outline: Array<{ level: number; id: string; heading: string }> = [];
      let truncatedOutline = false;
      for (const heading of articleHeadings()) {
        outline.push({
          level: Number(heading.tagName.slice(1)),
          id: heading.id,
          heading: getHeadingText(heading),
        });
        if (
          JSON.stringify({ title: context.title, outline }).length >
          OUTPUT_BUDGET
        ) {
          outline.pop();
          truncatedOutline = true;
          break;
        }
      }
      return JSON.stringify({
        title: context.title,
        truncated: truncatedOutline,
        outline,
      });
    }

    if (view !== "section") {
      throw new TypeError("view must be metadata, outline, or section.");
    }

    const section =
      typeof input.section === "string" ? input.section.trim() : "";
    if (!section) throw new TypeError("section is required for section view.");
    const maxChars = getInteger(input.maxChars, 900, 200, 1000);

    if (section.toLowerCase() === "introduction") {
      const content = readIntroduction();
      return JSON.stringify({
        title: context.title,
        section: "Introduction",
        truncated: content.length > maxChars,
        content: truncate(content, maxChars),
      });
    }

    const result = readSection(section);
    if (!result) {
      return JSON.stringify({
        error: `No section matched "${truncate(section, 80)}".`,
        availableSections: articleHeadings()
          .slice(0, 20)
          .map(heading => ({
            id: heading.id,
            heading: getHeadingText(heading),
          })),
      });
    }

    return JSON.stringify({
      title: context.title,
      section: result.heading,
      sectionId: result.id,
      truncated: result.content.length > maxChars,
      content: truncate(result.content, maxChars),
    });
  },
});

type FlatMindMapNode = {
  node: WebMCPMindMapNode;
  path: string[];
};

const flattenMindMap = (
  node: WebMCPMindMapNode,
  path: string[] = []
): FlatMindMapNode[] => {
  const currentPath = [...path, node.label];
  return [
    { node, path: currentPath },
    ...(node.children?.flatMap(child => flattenMindMap(child, currentPath)) ??
      []),
  ];
};

const mindMapScore = (entry: FlatMindMapNode, query: string) => {
  const id = entry.node.id.toLowerCase();
  const label = entry.node.label.toLowerCase();
  const notes = entry.node.notes?.toLowerCase() ?? "";
  const words = query.split(/\s+/).filter(Boolean);
  if (id === query || label === query) return 100;
  if (label.startsWith(query)) return 90;
  if (label.includes(query)) return 80;
  if (words.every(word => `${label} ${notes}`.includes(word))) return 60;
  if (notes.includes(query)) return 40;
  return 0;
};

const summarizeMindMapNode = (
  node: WebMCPMindMapNode,
  depth: number,
  level = 0
): Record<string, unknown> => ({
  id: node.id,
  label: node.label,
  ...(node.annotation ? { annotation: node.annotation } : {}),
  ...(node.notes
    ? { notes: truncate(node.notes, level === 0 ? 450 : 140) }
    : {}),
  ...(node.refs?.length ? { refs: node.refs.slice(0, 6) } : {}),
  ...(depth > 0 && node.children?.length
    ? {
        children: node.children
          .slice(0, 8)
          .map(child => summarizeMindMapNode(child, depth - 1, level + 1)),
        childrenTruncated: node.children.length > 8,
      }
    : node.children?.length
      ? {
          children: node.children.slice(0, 10).map(child => ({
            id: child.id,
            label: child.label,
          })),
          childrenTruncated: node.children.length > 10,
        }
      : {}),
});

const createExploreMindMapTool = (
  context: WebMCPMindMapPageContext
): WebMCPTool => ({
  name: "explore_mindmap",
  title: "Explore the current mind map",
  description:
    "Find a concept in the current mind map and return its notes, references, path, and a bounded child branch.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        minLength: 1,
        maxLength: 120,
        description: "Concept label, node ID, or natural-language topic.",
      },
      depth: {
        type: "integer",
        minimum: 0,
        maximum: 2,
        description: "Child depth to return. Defaults to 1.",
      },
    },
    required: ["query"],
    additionalProperties: false,
  },
  annotations: {
    readOnlyHint: true,
    untrustedContentHint: true,
  },
  execute: input => {
    if (!isRecord(input)) throw new TypeError("Expected an argument object.");
    const query = typeof input.query === "string" ? input.query.trim() : "";
    if (!query || query.length > 120) {
      throw new RangeError("query must contain between 1 and 120 characters.");
    }
    const depth = getInteger(input.depth, 1, 0, 2);
    const normalizedQuery = query.toLowerCase();
    const matches = flattenMindMap(context.root)
      .map(entry => ({ ...entry, score: mindMapScore(entry, normalizedQuery) }))
      .filter(entry => entry.score > 0)
      .sort(
        (a, b) => b.score - a.score || a.node.label.localeCompare(b.node.label)
      );

    if (matches.length === 0) {
      return JSON.stringify({
        error: `No mind-map concept matched "${truncate(query, 80)}".`,
        topLevelConcepts: context.root.children?.map(child => ({
          id: child.id,
          label: child.label,
        })),
      });
    }

    const best = matches[0];
    const alternatives = matches.slice(1, 5).map(match => ({
      id: match.node.id,
      label: match.node.label,
      path: match.path,
    }));
    let branch = summarizeMindMapNode(best.node, depth);
    let payload = {
      mindMap: context.title,
      query,
      path: best.path,
      branch,
      alternatives,
    };

    if (JSON.stringify(payload).length > OUTPUT_BUDGET) {
      branch = summarizeMindMapNode(best.node, 0);
      payload = { ...payload, branch };
    }

    return JSON.stringify(payload);
  },
});

const registerTools = async () => {
  const contextElement = document.getElementById(PAGE_CONTEXT_ID);
  const registrationKey = `${location.href}\n${contextElement?.textContent ?? ""}`;
  if (registrationKey === lastRegistrationKey && activeRegistration) return;

  activeRegistration?.abort();
  activeRegistration = undefined;
  lastRegistrationKey = registrationKey;

  const modelContext = (document as WebMCPDocument).modelContext;
  if (!modelContext) return;

  const controller = new AbortController();
  activeRegistration = controller;
  const context = parsePageContext();
  const tools: WebMCPTool[] = [createSearchTool()];

  if (context?.kind === "post" || context?.kind === "notebook") {
    tools.push(createReadContentTool(context));
  } else if (context?.kind === "mindmap") {
    tools.push(createExploreMindMapTool(context));
  }

  try {
    for (const tool of tools) {
      await modelContext.registerTool(tool, { signal: controller.signal });
    }
  } catch (error) {
    const wasAborted = controller.signal.aborted;
    controller.abort();
    if (activeRegistration === controller) activeRegistration = undefined;
    if (!wasAborted) {
      console.warn("WebMCP tool registration failed.", error);
    }
  }
};

void registerTools();
document.addEventListener("astro:page-load", () => void registerTools());
