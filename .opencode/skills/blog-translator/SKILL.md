---
name: blog-translator
description: Translates English blog posts to Traditional Chinese while preserving Markdown format and frontmatter structure
license: MIT
compatibility: opencode
metadata:
  audience: blog-contributors
  workflow: content-localization
---

# Blog Translator Skill

Use this skill when translating English blog posts to Traditional Chinese (zh-hant) or creating Chinese versions of existing content.

## What I Do

- Translate English blog posts to idiomatic Traditional Chinese
- Preserve Markdown format, code blocks, and technical terms
- Update frontmatter for cross-locale linking with `baseSlug`
- Maintain technical accuracy and consistency
- Ensure generated files pass content schema validation

## When to Use Me

Use this skill when you need to:
- Create Chinese versions of English blog posts
- Translate technical content while preserving accuracy
- Maintain multilingual blog consistency
- Handle frontmatter transformation for localized content
- Ensure proper cross-locale linking and navigation

## Key Features

- **Frontmatter transformation**: Automatically sets `lang: "zh-hant"`, `baseSlug`, and `translatedFrom`
- **Code preservation**: All code blocks, commands, and technical content remain unchanged
- **Smart term handling**: Keeps technical terms in English with Chinese context where appropriate
- **Structure preservation**: Maintains all Markdown formatting and structure
- **Validation ready**: Output passes Astro schema validation

## Workflow

1. **Identify source post**: English post in `src/content/blog/[slug].md`
2. **Create translation**: Traditional Chinese version in `src/content/blog/zh-hant/[slug].zh-hant.md`
3. **Update frontmatter**: Set language and linking fields
4. **Translate content**: Convert prose while preserving code and technical terms
5. **Validate output**: Ensure file passes schema and renders correctly

## Output Structure

```
src/content/blog/
├── original-post.md                        # English version
└── zh-hant/
    └── original-post.zh-hant.md           # Chinese version
```

## Quick Example

**English frontmatter**:
```yaml
lang: "en"
title: "Understanding Vector Databases"
slug: "understanding-vector-databases"
```

**Chinese frontmatter**:
```yaml
lang: "zh-hant"
translatedFrom: "en"
baseSlug: "understanding-vector-databases"
title: "了解向量資料庫"
```

## Quality Standards

- ✅ Idiomatic Traditional Chinese (not Simplified)
- ✅ All code blocks unchanged
- ✅ Technical terms in English when appropriate
- ✅ Markdown structure fully preserved
- ✅ No YAML syntax errors
- ✅ Cross-locale linking works correctly

## Common Patterns

- Product names: Keep in English (GitHub, VS Code, React)
- Package names: Keep in English (npm, TypeScript, next.js)
- Technical concepts: English + Chinese explanation when needed
- File paths and URLs: Unchanged in translation
