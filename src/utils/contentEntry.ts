import type { CollectionEntry } from "astro:content";

const CONTENT_EXTENSION_RE = /\.(?:md|mdx)$/;
const ZH_HANT_PREFIX_RE = /^zh-hant\//;
const ZH_HANT_SUFFIX_RE = /\.zh-hant$/;

const normalizeEntryId = (id: string) =>
  id.replace(CONTENT_EXTENSION_RE, "").replace(/\/index$/, "");

export const getContentEntrySlug = <T extends "blog" | "notebooks">(
  entry: CollectionEntry<T>
) => normalizeEntryId(entry.id);

export const getPostSlug = (post: CollectionEntry<"blog">) =>
  post.data.baseSlug ??
  getContentEntrySlug(post)
    .replace(ZH_HANT_PREFIX_RE, "")
    .replace(ZH_HANT_SUFFIX_RE, "");

export const getNotebookSlug = (notebook: CollectionEntry<"notebooks">) =>
  getContentEntrySlug(notebook);
