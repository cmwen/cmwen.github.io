import rss from "@astrojs/rss";
import { getCollection, type CollectionEntry } from "astro:content";
import getSortedPosts from "@utils/getSortedPosts";
import { getPostSlug } from "@utils/contentEntry";
import { SITE } from "@config";

export async function GET() {
  // Only include English posts in the default (EN) feed
  const posts = await getCollection(
    "blog",
    (entry: CollectionEntry<"blog">) => entry.data.lang === "en"
  );
  const sortedPosts = getSortedPosts(posts);
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: sortedPosts.map(post => ({
      link: `posts/${getPostSlug(post)}/`,
      title: post.data.title,
      description: post.data.description,
      pubDate: new Date(post.data.modDatetime ?? post.data.pubDatetime),
    })),
  });
}
