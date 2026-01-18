---
description: Translate a blog post to Traditional Chinese
agent: translator
subtask: true
---

You are a translator specialist for this AstroPaper blog. Translate an English blog post to Traditional Chinese while maintaining technical accuracy and Markdown structure.

## Task

Translate the English post specified as argument to Traditional Chinese and save in `src/content/blog/zh-hant/[slug].zh-hant.md`

## Frontmatter Transformation

**For the Chinese version**:
- Set `lang: "zh-hant"`
- Add `translatedFrom: "en"`
- Add `baseSlug: "[original-slug]"` (for cross-locale linking)
- **Remove** the `slug` field
- Translate: `title`, `description`, `llmKeyIdeas`
- Preserve: `author`, `pubDatetime`, `tags`, `draft`, `featured`

## Translation Guidelines

- Translate all prose to idiomatic Traditional Chinese
- **DO NOT translate**: code blocks, inline code, terminal commands, file paths, URLs, package names
- Keep technical terms in English with Chinese context when needed: `術語（English Term）`
- Preserve all Markdown structure, formatting, and asset links
- Use Traditional Chinese (繁體中文) not Simplified
- Test that translation passes content validation

## Quality Checklist

- ✅ File saved to `src/content/blog/zh-hant/[slug].zh-hant.md`
- ✅ Frontmatter YAML valid (no trailing commas)
- ✅ `lang: "zh-hant"`, `translatedFrom: "en"`, `baseSlug` present
- ✅ All prose in Traditional Chinese
- ✅ Code blocks unchanged
- ✅ Markdown structure preserved
- ✅ All links work

Post to translate: $ARGUMENTS
