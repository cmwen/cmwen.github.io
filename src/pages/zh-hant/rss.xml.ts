import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { SITE } from "@config";

export async function GET() {
  const posts = await getCollection(
    "blog",
    (entry: CollectionEntry<"blog">) => entry.data.lang === "zh-hant"
  );
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: `${SITE.title} (中文)`,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(({ data, slug }) => ({
      // Use baseSlug (our cross-locale canonical key) when available
      link: `zh-hant/posts/${data.baseSlug ?? slug}/`,
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
    })),
  });
}
