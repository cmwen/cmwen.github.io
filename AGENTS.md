# Repository guide

## Goal

Maintain `cmwen.github.io`, a bilingual AstroPaper-based personal site. Prefer small,
coherent changes that preserve static generation, accessibility, SEO, and minimal
client-side JavaScript.

## Stack and layout

- Runtime: Node.js 22+, pnpm 11 (see `package.json`).
- Framework: Astro 7, React 19 for interactive islands, TypeScript strict mode,
  and Tailwind CSS 4.
- Site configuration: `astro.config.ts` and `src/config.ts`.
- Content schema: `src/content.config.ts` is authoritative.
- Blog posts: `src/content/blog/`; Traditional Chinese translations:
  `src/content/blog/zh-hant/`.
- Notebooks: `src/content/notebooks/*.mdx`.
- Mind maps: `src/content/mindmaps/*.json`.
- Static pages and routes: `src/pages/`; reusable UI: `src/components/` and
  `src/layouts/`; helpers: `src/utils/`.
- Tests: `tests/*.spec.ts`; deployment: `.github/workflows/main.yaml`.

Use the aliases in `tsconfig.json` (`@components/*`, `@utils/*`, `@layouts/*`,
`@i18n/*`, and others) instead of inventing new import styles.

## Commands

Use pnpm throughout.

- Install: `pnpm install`
- Develop: `pnpm dev`
- Type-check and build: `pnpm build`
- Lint: `pnpm lint`
- Check formatting: `pnpm format:check`
- Format: `pnpm format`
- End-to-end tests: `pnpm test`

Run the narrowest relevant checks while iterating. Before completing code or content
schema changes, run `pnpm build`. Run `pnpm lint` for TypeScript, JavaScript, Astro,
or configuration changes. Run focused Playwright tests for affected user flows; the
Playwright configuration builds and starts a preview server automatically.

## Implementation conventions

- Prefer Astro components for static or SEO-critical content. Use React only when
  client-side state or interaction is required, and hydrate as late as practical.
- Keep React's initial render deterministic. Read URLs, local storage, and browser-only
  state after mount to avoid hydration mismatches.
- Preserve semantic HTML, keyboard access, visible focus, heading order, and useful alt
  text.
- Avoid `any`; follow existing types and nearby patterns before adding abstractions.
- Do not add a dependency when the existing stack or a small local helper is sufficient.

## Content conventions

Treat `src/content.config.ts` as the source of truth rather than copying legacy
frontmatter from an old post.

- Blog posts require `title`, `description`, and `pubDatetime`. `lang` defaults to
  `en`, `author` defaults to `Min Wen`, and `tags` defaults to `["others"]`.
- Use valid YAML and ISO 8601 UTC timestamps. A future `pubDatetime` is intentionally
  hidden until it passes `SITE.scheduledPostMargin`.
- Derive the route from the filename or `baseSlug`; do not add the legacy `slug` field
  to new posts.
- Use `baseSlug` as the stable cross-locale route. A Chinese translation belongs at
  `src/content/blog/zh-hant/<source-file>.zh-hant.md`, uses `lang: "zh-hant"`, and sets
  both `baseSlug` and `translatedFrom` to the source post's canonical slug.
- Keep `llmKeyIdeas`, when present, as a short list of concrete discovery or follow-up
  topics.
- Notebooks are concise MDX references and are separate from the blog and RSS feed.
- Mind-map JSON must satisfy the `mindmaps` collection schema. Keep every node ID unique
  and every `refs[].targetId` valid within the same map.

The reusable workflows for researching, drafting, checking, translating, and publishing
content live under `.agents/skills/` and should be loaded only when relevant.

## Internationalization and routing

- English routes are unprefixed; Traditional Chinese routes use `/zh-hant/`.
- Use `getPostSlug` from `src/utils/contentEntry.ts` for post routes rather than
  duplicating slug normalization.
- When adding a localized page, preserve canonical URLs and language alternates.
- Do not assume every English post already has a translation.

## Podcast boundary

This repository only renders podcast audio through `PODCAST_BASE_URL`. Audio files,
feeds, transcripts, and generation belong to the separate `cmwen/podcasts` repository.
Do not generate or repair podcast assets here.

## Git and deployment

- Preserve unrelated working-tree changes.
- Use conventional commit messages when asked to commit.
- Pushing `main` triggers the GitHub Pages workflow. Do not force-push, rewrite history,
  or publish unless the user explicitly requests it.
