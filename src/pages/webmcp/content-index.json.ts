import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { SITE } from "@config";
import { agents } from "@data/agents";
import { TOOLBOX } from "@data/toolbox";
import type {
  WebMCPAlternates,
  WebMCPMindMapNode,
  WebMCPSearchIndex,
  WebMCPSearchIndexItem,
} from "../../types/webmcp";
import { getNotebookSlug, getPostSlug } from "@utils/contentEntry";
import getSortedNotebooks from "@utils/getSortedNotebooks";
import getSortedPosts from "@utils/getSortedPosts";
import { slugifyStr } from "@utils/slugify";

const absoluteUrl = (pathname: string) =>
  new URL(pathname.replace(/^\/+/, ""), SITE.website).href;

const collectMindMapTerms = (node: WebMCPMindMapNode): string[] => [
  node.label,
  ...(node.annotation ? [node.annotation] : []),
  ...(node.notes ? [node.notes.slice(0, 500)] : []),
  ...(node.children?.flatMap(collectMindMapTerms) ?? []),
];

export const GET: APIRoute = async () => {
  const [posts, notebooks, mindmaps] = await Promise.all([
    getCollection("blog"),
    getCollection("notebooks"),
    getCollection("mindmaps"),
  ]);

  const postAlternates = new Map<string, WebMCPAlternates>();
  for (const post of getSortedPosts(posts)) {
    const slug = getPostSlug(post);
    const alternates = postAlternates.get(slug) ?? {};
    alternates[post.data.lang] = absoluteUrl(
      post.data.lang === "zh-hant"
        ? `/zh-hant/posts/${slug}/`
        : `/posts/${slug}/`
    );
    postAlternates.set(slug, alternates);
  }

  const postItems: WebMCPSearchIndexItem[] = getSortedPosts(posts).map(post => {
    const slug = getPostSlug(post);
    const url =
      post.data.lang === "zh-hant"
        ? `/zh-hant/posts/${slug}/`
        : `/posts/${slug}/`;

    return {
      id: `post:${post.data.lang}:${slug}`,
      kind: "post",
      title: post.data.title,
      description: post.data.description,
      url: absoluteUrl(url),
      lang: post.data.lang,
      tags: post.data.tags,
      publishedAt: post.data.pubDatetime.toISOString(),
      updatedAt: post.data.modDatetime?.toISOString(),
      keyIdeas: post.data.llmKeyIdeas,
      alternates: postAlternates.get(slug),
    };
  });

  const notebookItems: WebMCPSearchIndexItem[] = getSortedNotebooks(
    notebooks
  ).map(notebook => {
    const slug = getNotebookSlug(notebook);
    return {
      id: `notebook:${slug}`,
      kind: "notebook",
      title: notebook.data.title,
      description: notebook.data.description,
      url: absoluteUrl(`/toolbox/notebooks/${slug}/`),
      lang: "en",
      tags: notebook.data.tags,
      publishedAt: notebook.data.pubDatetime.toISOString(),
      updatedAt: notebook.data.modDatetime?.toISOString(),
      alternates: {
        en: absoluteUrl(`/toolbox/notebooks/${slug}/`),
        "zh-hant": absoluteUrl(`/zh-hant/toolbox/notebooks/${slug}/`),
      },
    };
  });

  const mindMapItems: WebMCPSearchIndexItem[] = mindmaps.map(entry => ({
    id: `mindmap:${entry.id}`,
    kind: "mindmap",
    title: entry.data.title,
    description: entry.data.description,
    url: absoluteUrl(`/toolbox/mindmaps/${entry.id}/`),
    lang: "en",
    tags: entry.data.tags,
    updatedAt: entry.data.updatedAt,
    alternates: {
      en: absoluteUrl(`/toolbox/mindmaps/${entry.id}/`),
      "zh-hant": absoluteUrl(`/zh-hant/toolbox/mindmaps/${entry.id}/`),
    },
    searchTerms: collectMindMapTerms(entry.data.root),
  }));

  const toolItems: WebMCPSearchIndexItem[] = TOOLBOX.flatMap(section =>
    section.tools.map(tool => ({
      id: `tool:${section.id}:${slugifyStr(tool.name)}`,
      kind: "tool" as const,
      title: tool.name,
      description: tool.why,
      url: absoluteUrl(`/toolbox/#${section.id}`),
      lang: "en" as const,
      tags: tool.tags ?? [],
      searchTerms: [
        section.title,
        ...(tool.links?.map(link => link.label) ?? []),
      ],
      alternates: {
        en: absoluteUrl(`/toolbox/#${section.id}`),
        "zh-hant": absoluteUrl(`/zh-hant/toolbox/#${section.id}`),
      },
    }))
  );

  const agentItems: WebMCPSearchIndexItem[] = agents.map(agent => ({
    id: `agent:${agent.id}`,
    kind: "agent",
    title: agent.name,
    description: agent.description,
    url: absoluteUrl("/toolbox/agents/"),
    lang: "en",
    tags: agent.tags,
    alternates: {
      en: absoluteUrl("/toolbox/agents/"),
      "zh-hant": absoluteUrl("/zh-hant/toolbox/agents/"),
    },
  }));

  const index: WebMCPSearchIndex = {
    version: 1,
    items: [
      ...postItems,
      ...notebookItems,
      ...mindMapItems,
      ...toolItems,
      ...agentItems,
    ],
  };

  return new Response(JSON.stringify(index), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
