---
name: blog-translator
description: Translates English blog posts to Traditional Chinese while preserving Markdown format and frontmatter structure. Use this when asked to translate posts to zh-hant or create Chinese versions.
---

# Blog Translator Skill (English to Traditional Chinese)

You are an automated translator assistant for this AstroPaper blog repository. This skill guides translation of English blog posts (Markdown) to Traditional Chinese (zh-hant) while preserving the exact file format and maintaining cross-locale linking.

## Task

Translate an English blog post (Markdown) to Traditional Chinese and save the translated post in `src/content/blog/zh-hant/` using the original slug with a `.zh-hant.md` filename suffix.

**Example**: `src/content/blog/zh-hant/<slug>.zh-hant.md`

It is acceptable to overwrite an existing translated file in that folder when updating.

## Guidelines

### File Structure

- Keep the file format (Markdown + YAML frontmatter) exactly the same.
- Do NOT change the original English file. Create a new file in `src/content/blog/zh-hant/` using the original slug plus the `.zh-hant.md` suffix.
- Do not move or rename any images or asset paths referenced in the post.

### Frontmatter Rules

- Set `lang` to `"zh-hant"`.
- Add `translatedFrom` (string) set to the original language code of the source post (for English use `"en"`).
- Add `baseSlug` with the original post's canonical slug so cross-locale linking works.
- Preserve `author`, `pubDatetime`, `tags`, `ogImage`, `canonicalURL`, and `draft` unless explicitly instructed to change them.
- Do NOT preserve `slug`.
- Keep `pubDatetime` unchanged. Do not set `pubDatetime` to now. You may add or update `modDatetime` if necessary but prefer leaving it unchanged unless asked.

### Frontmatter Example (Transform)

**Original frontmatter (English):**

```yaml
---
lang: "en"
title: "Why X is useful"
description: "A short summary"
slug: "why-x-is-useful"
author: "Alice"
pubDatetime: 2024-06-01
tags: ["tools", "howto"]
---
```

**Translated frontmatter (ZH):**

```yaml
---
lang: "zh-hant"
translatedFrom: "en"
baseSlug: "why-x-is-useful"
title: "為什麼 X 有用"
description: "簡短摘要"
author: "Alice"
pubDatetime: 2024-06-01
tags: ["tools", "howto"]
ogImage: <preserve or keep empty to allow auto-generation>
---
```

## Translation Rules

### Prose Translation

- Translate all natural-language content (title, description, and body) into idiomatic Traditional Chinese (zh-hant).
- Use Traditional Chinese characters and phrasing suitable for a technical blog audience.

### Code & Technical Content

- Preserve code blocks, inline code, terminal commands, and fenced blocks **exactly as-is**. Do not translate code, flags, commands, or examples that are meant to be executed.
- Keep technical identifiers, package names, library names, and quoted code unchanged.

### Markdown Structure

- Preserve markdown structure: headings, lists, blockquotes, frontmatter keys, tables, links, images, and embedded HTML should keep their formatting.
- Translate link text and image alt text; do not change URLs.

### Technology Terms

- Keep technology terms (package names, libraries, product names, protocol names, technical concepts) in English.
- If a Chinese translation would be unclear, uncommon, or could change the technical meaning, include the original English term in curly braces immediately after the Chinese phrase.
- **Format**: `中文術語（English Term{English Term})` or `事件驅動架構（event-driven architecture{event-driven architecture})`.
- This ensures clarity while keeping Chinese prose natural.

## Acceptance Criteria

✅ New file created at `src/content/blog/zh-hant/<slug>.zh-hant.md` next to the original English post.
✅ `lang` is `"zh-hant"` and `translatedFrom` (language code) + `baseSlug` are present.
✅ All visible prose is translated to Traditional Chinese; code blocks and commands are unchanged.
✅ Markdown structure and asset links are preserved and valid.
✅ Technical terms are in English with proper Chinese context when needed.

## Notes

- If the original post omits certain optional frontmatter keys (for example `ogImage`), you can leave them omitted — the site will auto-generate OG images when needed.
- If a phrase is ambiguous, translate to natural Traditional Chinese and keep technical terms in English if they are proper nouns or package names.
- If you encounter abbreviations or slang, translate them to commonly used equivalents in Traditional Chinese for clarity.
- For multiple translations, run this procedure per file and save each translation next to the original using the `.zh-hant.md` filename suffix.
