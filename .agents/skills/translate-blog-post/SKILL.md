---
name: translate-blog-post
description: Rewrite or update English blog posts in this repository as natural Traditional Chinese editions for readers in Taiwan while preserving the source thesis, facts, code, assets, authorial intent, and cross-locale frontmatter. Use when asked to translate, localize, adapt, rewrite, or synchronize one or more blog posts for a Taiwanese audience.
---

# Rewrite a blog post for Taiwan

Create a standalone Taiwanese edition, not a sentence-by-sentence translation. Preserve what
the source means and what it can support, while rewriting it so it reads as if it were originally
written for technically literate readers in Taiwan.

## Prepare the pair

1. Read the complete English source post and its frontmatter.
2. Determine the canonical slug from `baseSlug` when present; otherwise use the normalized
   source filename.
3. Write the translation to
   `src/content/blog/zh-hant/<source-filename>.zh-hant.md`. Update an existing translation
   in place when one exists; never modify the English source unless explicitly requested.

## Transform frontmatter

- Set `lang: "zh-hant"`.
- Set both `baseSlug` and `translatedFrom` to the canonical source slug.
- Translate `title`, `description`, and `llmKeyIdeas`.
- Preserve `author`, `pubDatetime`, `modDatetime`, `tags`, `featured`, `draft`, `ogImage`,
  and `canonicalURL` unless the request requires a change.
- Remove the legacy `slug` field from the translation.
- Keep valid YAML and do not add absent optional fields without a reason.

## Rewrite the body

- Use natural Taiwanese Mandarin and Traditional Chinese; never output Simplified Chinese or
  Mainland China-specific phrasing when a familiar Taiwan usage exists. Prefer terms such as
  `軟體`, `程式碼`, `資料`, `資訊`, `伺服器`, `使用者`, `預設`, `影片`, `網路`, and `雲端`
  when they fit the context.
- Preserve the source thesis, factual claims, uncertainty, reasoning, and authorial voice, but
  do not preserve its sentence or paragraph structure by default.
- Rewrite introductions, transitions, headings, explanations, metaphors, and conclusions for
  clarity and flow. Reorder, combine, split, or trim sections when that makes the Taiwanese
  edition more coherent.
- Adapt generic examples and cultural references when a Taiwan-familiar framing communicates
  the same point better. Do not invent personal experiences, local statistics, quotes, product
  behavior, or other new factual claims.
- Preserve fenced code, inline code, commands, flags, identifiers, package/product names,
  file paths, URLs, embedded HTML, and Mermaid syntax exactly.
- Rewrite headings, prose, table text, link labels, and image alt text while keeping destinations
  and asset paths unchanged.
- Use the mix of Chinese and English common in Taiwan's software community. Keep product names,
  APIs, commands, and widely used technical terms in English; add a Chinese explanation only
  when it genuinely helps. Avoid mechanical bilingual parentheses.
- Use Taiwanese punctuation and an approachable professional tone. Avoid translation artifacts,
  inflated formality, four-character idiom stacking, and repeated subjects copied from English.

## Check the result

Compare the two editions for thesis, major arguments, factual claims, technical details, and
conclusion rather than sentence-level alignment. Check for accidental omissions that change the
meaning, altered code, broken links, frontmatter drift, unnatural Taiwan usage, and unsupported
additions. Run `pnpm build` and report the source path, rewritten path, validation result, and any
deliberate structural or terminology choices.
