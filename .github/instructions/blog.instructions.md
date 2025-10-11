---
applyTo: "content/blog/**/*.md"
---

# Instructions for writing a blog post

- Use front matter to define the metadata of the blog post.
- Use the following keys in the front matter:
  - `title`: The title of the blog post.
  - `author`: The author of the blog post.
  - `description`: A short description of the blog post.
  - `featuredImage`: The path to the featured image. Optional.
  - `slug`: The slug for the blog post URL. Optional.
  - `featured`: A boolean indicating if the post is featured or not. Optional.
  - `tags`: An array of tags related to the blog post. Optional.
  - `pubDatetime`: The publication date and time of the blog post. Use today's date and time in UTC format.

- Use the `---` syntax to separate the front matter from the content of the blog post.
- Use Markdown syntax for the content of the blog post.

Additional guidance and best practices

- YAML/arrays: Use valid YAML arrays for `tags` and `llmKeyIdeas`. Prefer single-line arrays for simple lists, e.g.:

  ```yaml
  tags: ["ai", "video"]
  llmKeyIdeas: ["low-friction sharing", "template remix"]
  ```

  Avoid trailing commas and non-standard multi-line array syntax that may fail schema validation.

- `pubDatetime` and scheduled posts: Set `pubDatetime` to the intended publication time in UTC. The site filters out future-dated posts (scheduled posts) when building the site. During development, the dev server will include scheduled posts, but to avoid surprises set `pubDatetime` to the current UTC time when you want a post to appear immediately.

- i18n and slugs: For translated posts, prefer using `baseSlug` + `translatedFrom` instead of manually setting identical `slug` values across locale files. Example:

  ```yaml
  # src/content/blog/post-name.md (English)
  slug: "my-post"
  lang: "en"

  # src/content/blog/zh-hant/post-name.zh-hant.md (Traditional Chinese)
  lang: "zh-hant"
  baseSlug: "my-post"
  translatedFrom: "my-post"
  ```

  This avoids slug collisions and lets the site generate locale-specific paths reliably.

- `llmKeyIdeas`: When present, `llmKeyIdeas` should be an array of short phrases (3–5 words each) used for downstream LLM suggestions and quick follow-up topics.

- Validation: The content collection schema validates frontmatter (see `src/content/config.ts`). If a post is not showing up, check for: missing required fields, invalid types (e.g., non-date `pubDatetime`), malformed YAML, or trailing commas in arrays.

- Quick troubleshooting checklist:
  1. Ensure `pubDatetime` is not in the future (or use dev server to preview).
  2. Check `lang` is either `en` or `zh-hant` and matches filename location.
  3. Use `baseSlug` for translations instead of reusing `slug`.
  4. Use single-line YAML arrays for `tags` and `llmKeyIdeas` to avoid parser issues.
  5. Restart dev server and remove `.astro` cache if changes are not visible: `rm -rf .astro && pnpm dev`.

These guidelines will reduce common content pipeline errors and help ensure posts appear as expected in the site build.
