---
name: manage-blog-content
description: Research, plan, draft, revise, or fact-check English blog posts for this repository. Use for blog-topic research, idea generation, outlines, new posts, editorial revisions, claim verification, and publication-readiness reviews; do not use for Traditional Chinese translation.
---

# Manage blog content

Match the requested mode. Do not automatically turn research into a draft, edit a post
during a review-only request, or translate content unless the user asks.

## Gather context

1. Read `AGENTS.md` and `src/content.config.ts`.
2. Inspect a few recent related posts for voice, structure, and possible duplication.
3. For current or externally verifiable claims, retrieve authoritative sources. Prefer
   primary documentation for technical facts, record publication/version dates, and
   distinguish sourced facts from inference or opinion.

## Research, ideas, and outlines

- Organize findings around the reader's decision or learning goal, not around the search
  process.
- Include source links beside supported claims and call out conflicts or missing evidence.
- Make proposed articles meaningfully different from existing posts.
- Give outlines a clear thesis, audience, progression, concrete examples, and intended
  takeaway. Avoid prescribing a word count unless requested.

## Draft or revise a post

1. Choose a URL-safe kebab-case filename under `src/content/blog/`.
2. Create valid frontmatter from the current schema. For a new English post, normally use:

   ```yaml
   ---
   title: "Post title"
   description: "A concise, specific summary."
   lang: "en"
   author: "Min Wen"
   pubDatetime: 2026-01-01T00:00:00Z
   tags: ["tag-one", "tag-two"]
   featured: false
   draft: false
   baseSlug: "post-filename"
   llmKeyIdeas: ["concrete follow-up topic", "another key idea"]
   ---
   ```

   Use the intended publication time, not a hard-coded example. Do not add the legacy
   `slug` field. Omit optional fields that add no value.
3. Lead with the post's actual observation, problem, or thesis. Prefer concrete experience,
   evidence, trade-offs, and examples over generic introductions and exhaustive lists.
4. Preserve Min Wen's reflective, practical engineering voice when editing existing work.
   Do not invent personal experiences, metrics, quotes, or product behavior.
5. Keep code, commands, diagrams, and links accurate and necessary. Add Mermaid only when
   it clarifies a relationship or sequence.

## Fact-check

- Inventory material claims: dates, statistics, versions, API behavior, compatibility,
  commands, links, and attributed statements.
- Test local code or commands when safe and useful. Verify time-sensitive claims against
  current authoritative sources.
- Report each issue with location, severity (`critical`, `major`, or `minor`), evidence,
  and a concrete correction. Separate verified facts from unverified or interpretive text.
- End with publication readiness and the smallest required corrections. Apply corrections
  only when the user asked for edits.

## Validate

Run `pnpm build` after creating or changing a post. Also run relevant formatting or link
checks when they materially increase confidence. Report skipped checks and why.
