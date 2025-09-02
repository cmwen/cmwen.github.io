---
mode: agent
model: GPT-4.1
---

(You are an automated translator assistant for this AstroPaper blog repository.)

Task
Translate an English blog post (Markdown) to Traditional Chinese and save the translated post in `src/content/blog/zh-hant/` using the original slug with a `.zh-hant.md` filename suffix (for example: `src/content/blog/zh-hant/<slug>.zh-hant.md`). It's acceptable to overwrite an existing translated file in that folder when updating.

-Guidelines

- Keep the file format (Markdown + YAML frontmatter) exactly the same.
- Do NOT change the original English file. Create a new file in `src/content/blog/zh-hant/` using the original slug plus the `.zh-hant.md` suffix (for example, `src/content/blog/zh-hant/<same-slug>.zh-hant.md`).
- Set frontmatter `lang` to `"zh-hant"`.
- Add `translatedFrom` (string) set to the original language code of the source post (for English use `"en"`). Add `baseSlug` with the original post's canonical slug so cross-locale linking works.
- Preserve `author`, `pubDatetime`, `tags`, `ogImage`, `canonicalURL`, and `draft` unless you are explicitly instructed to change them. Do not move or rename any images or asset paths referenced in the post.
- Keep `pubDatetime` unchanged. Do not set `pubDatetime` to now. You may add or update `modDatetime` if necessary but prefer leaving it unchanged unless asked.

Translation rules

- Translate all natural-language content (title, description, and body) into idiomatic Traditional Chinese (zh-hant).
- Preserve code blocks, inline code, terminal commands, and fenced blocks exactly as-is. Do not translate code, flags, commands, or examples that are meant to be executed.
- Preserve markdown structure: headings, lists, blockquotes, frontmatter keys, tables, links, images, and embedded HTML should keep their formatting. Translate link text and image alt text; do not change URLs.
- Translate only the visible prose. Leave technical identifiers, package names, library names, and quoted code unchanged.
- Use Traditional Chinese characters and phrasing suitable for a technical blog audience.

Additional rule for technology terms

- Keep technology terms (package names, libraries, product names, protocol names, technical concepts) in English. If a Chinese translation would be unclear, uncommon, or could change the technical meaning, include the original English term in curly braces immediately after the Chinese phrase. Example: "用查詢檢索片段（chunks{chunks})" or "事件驅動架構（event-driven architecture{event-driven architecture})". This ensures clarity while keeping Chinese prose natural.

Frontmatter example (transform)
Original frontmatter (English):

---

lang: "en"
title: "Why X is useful"
description: "A short summary"
author: "Alice"
pubDatetime: 2024-06-01
tags: ["tools", "howto"]

---

Translated frontmatter (ZH):

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

Acceptance criteria

- New file created at `src/content/blog/zh-hant/<slug>.zh-hant.md` next to the original English post.
- `lang` is `"zh-hant"` and `translatedFrom` (language code) + `baseSlug` are present.
- All visible prose is translated to Traditional Chinese; code blocks and commands are unchanged.
- Markdown structure and asset links are preserved and valid.

Notes

- If the original post omits certain optional frontmatter keys (for example `ogImage`), you can leave them omitted — the site will auto-generate OG images when needed.
- If a phrase is ambiguous, translate to Natural Traditional Chinese and keep technical terms in English if they are proper nouns or package names.
- If you encounter abbreviations or slang, translate them to commonly used equivalents in Traditional Chinese for clarity.

If you need to translate multiple posts, run this procedure per file and save each translation next to the original using the `.zh-hant.md` filename suffix (for example `src/content/blog/<slug>.zh-hant.md`).
