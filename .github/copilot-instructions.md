# Copilot Instructions for cmwen.github.io (AstroPaper Blog)

## Big picture

- Astro + React + TypeScript + Tailwind on top of AstroPaper. Content-driven blog; routes under `src/pages/` render `.astro/.md/.tsx` automatically.
- Two locales: `en` and `zh-hant` (`src/i18n/config.ts`). Use `alternates` in page layouts (see `src/pages/agents/index.astro`). ZH pages live under `/zh-hant/`.
- Posts are Markdown in `src/content/blog/` validated by `src/content/config.ts` via Astro Collections.
- Utilities in `src/utils/` wire core flows: filter/sort (`postFilter`, `getSortedPosts`), pagination (`getPagination`, `getPageNumbers`), tags (`getUniqueTags`).

## Conventions and schema

- Frontmatter (see `src/content/config.ts`):
  - lang: "en" | "zh-hant"; translatedFrom?: string; baseSlug?: string (shared canonical slug across locales)
  - author (defaults to `SITE.author`), title, description, tags (default ["others"]), featured?, draft?
  - llmKeyIdeas?: array of short phrases (3–8 items). Purpose: short, discoverable topics that downstream LLMs or chat UIs can use as suggested follow-up questions, search keywords, or conversation starters.
  - pubDatetime: Date; modDatetime?: Date (sorting prefers modDatetime)
  - ogImage?: image|string (>=1200x630), canonicalURL?: string
- Scheduled publishing: `postFilter` hides drafts and future posts until `SITE.scheduledPostMargin` is passed.
- Path aliases (TS/Vite): `@config`, `@components/*`, `@utils/*`, `@layouts/*`, `@i18n/*`, etc. (see `tsconfig.json`).

## Routing and data flow

- Posts listing/pagination: `src/pages/posts/[slug]/index.astro`
  - `getStaticPaths()` returns both post slugs (using `baseSlug ?? post.slug`) and numeric page paths.
  - At runtime: if a `post` prop exists render `PostDetails`, else render `Posts` with pagination from `getPagination`.
- Tags: `src/pages/tags/[tag]/index.astro` builds paths from `getUniqueTags()` (slugified).
- i18n home: `src/pages/zh-hant/index.astro` shows featured/recent using the same utils and respects `baseSlug` for links.

## OG image generation

- Site OG: `src/pages/og.png.ts` → `generateOgImageForSite()`.
- Per-post OG: `src/pages/posts/[slug]/index.png.ts` pre-renders PNG for posts without `ogImage` using `generateOgImages.tsx` (Satori + Resvg) and templates in `src/utils/og-templates/`.
- Fonts: prefers vendored OTFs under `src/assets/fonts/`; otherwise fetches. Vite config excludes `@resvg/resvg-js` from optimizeDeps.

## Agents mini-app

- React UI at `/agents/` (`src/components/agents/*`, page in `src/pages/agents/index.astro`). Client-rendered (`client:only="react"`).
- Providers/agents in `src/data/agents.ts`; UX helpers in `src/utils/agents.ts` (persist provider in localStorage, deep-link or copy-to-clipboard, URL length guard).
- Keep initial state deterministic on first render to avoid hydration mismatch (see `AgentsApp.tsx` useEffect note).

## Podcast generation system

- Pure Python system using Kokoro TTS for multi-language audio generation (`podcast_generator/`).
- Multi-language support: English (Kokoro v1.0), Chinese (Kokoro v1.1-zh) with automatic model switching.
- Blog post conversion: Markdown → cleaned text → phonemized speech → MP3 with FFmpeg.
- Package management: `uv` for Python dependencies (`pyproject.toml`), automatic model download to `~/.cache/kokoro-onnx/`.
- Chinese TTS: Uses misaki[zh] for G2P phonemization, 90+ voice options (`zf_001`-`zf_099` female, `zm_009`-`zm_100` male).
- RSS feed generation: Language-specific feeds for podcast apps (`public/podcasts/{lang}/feed.xml`).
- Commands: `uv run podcast-generate --posts "slug" --force` or `pnpm podcast:generate` (wrapper).
- Output: MP3 files in `public/podcasts/`, automatic chunking for long content, timezone-aware publication dates.

## Build, test, CI

- Commands: dev `pnpm dev`, build `pnpm build`, preview `pnpm preview`, lint `pnpm lint`, format `pnpm format`, commits `pnpm cz`.
- Markdown search: FuseJS in `src/components/Search.tsx` (links use `(data as any).baseSlug ?? slug`).
- CI: `.github/workflows/main.yaml` builds with Node 22 + pnpm 9 and deploys to `gh-pages`. Playwright runs separately (`tests/*.spec.ts`); `tests/smoke.spec.ts` hits production; others assume local baseURL.

## Config touchpoints

- `astro.config.ts`: Tailwind (no base styles), React, Sitemap, Shiki theme, remark plugins (TOC + collapsible), React dedupe, exclude `@resvg/resvg-js` from optimizeDeps.
- `src/config.ts`: `SITE` (title, website, postPerPage, scheduledPostMargin), `LOCALE`, `SOCIALS`.

Examples to follow

- Use `baseSlug` when linking across locales (e.g., Card hrefs, RSS items) and add `alternates` for canonical/locale URLs.
- To add a new post: put `.md` under `src/content/blog/` with the schema above; omit `ogImage` to auto-generate per-post PNG.
