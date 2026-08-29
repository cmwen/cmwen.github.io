---
name: write-notebook
description: Create, revise, or review concise MDX notebooks and cheatsheets in this repository. Use for quick references, command guides, technical notes, or other requests involving `src/content/notebooks` and the toolbox notebook pages.
---

# Write a notebook

1. Read `src/content.config.ts` and a nearby notebook.
2. Create or update `src/content/notebooks/<slug>.mdx` with schema-valid frontmatter:
   `title`, `description`, `pubDatetime`, optional `modDatetime`, `tags`, and `draft`.
3. Optimize for scanning: use descriptive headings, compact explanations, copyable commands,
   and small examples. Keep the notebook focused on one practical topic.
4. Use MDX or React components only when interaction materially improves the reference.
   Follow existing import aliases and preserve static rendering where plain Markdown works.
5. Keep commands safe and explicit about destructive effects or prerequisites.

Notebooks live under `/toolbox/notebooks/`, are separate from blog posts, and do not belong in
the RSS workflow. Run `pnpm build` after changes.
