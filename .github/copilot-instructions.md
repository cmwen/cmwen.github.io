# Copilot Instructions for cmwen.github.io (AstroPaper Blog)

## Project Architecture

This is an **AstroPaper theme** blog built with Astro, TypeScript, React, and TailwindCSS. Key architectural patterns:

- **Content-driven**: Blog posts live in `src/content/blog/` as Markdown with frontmatter schema validation via `src/content/config.ts`
- **File-based routing**: Pages in `src/pages/` generate routes automatically (`.astro`, `.md`, `.tsx`)
- **Layout composition**: Multiple layouts (`Layout.astro`, `Main.astro`, `PostDetails.astro`, `Posts.astro`, `TagPosts.astro`) compose for different page types
- **Utility-first**: Helper functions in `src/utils/` handle common operations (sorting, pagination, slugification)

## Critical Development Workflows

**Development**: `pnpm run dev` (localhost:4321) | **Build**: `pnpm run build` | **Preview**: `pnpm run preview`
**Package manager**: Use `pnpm` for all install/build/test commands (CI uses pnpm, see `.github/workflows/main.yaml`)
**Commits**: `pnpm run cz` (Commitizen with conventional commits - enforced)
**Formatting**: `pnpm run format` (Prettier) | **Linting**: `pnpm run lint` (ESLint)
**Testing**: Playwright smoke tests in `tests/smoke.spec.ts` run via GitHub Actions after deployment

## Project-Specific Conventions

**Blog post schema** (required frontmatter):

```yaml
---
title: string
description: string
pubDatetime: Date
author: string (defaults to SITE.author)
tags: string[] (defaults to ["others"])
featured: boolean (optional - shows in Featured section)
draft: boolean (optional - excludes from build)
ogImage: image | string (optional - must be 1200x630+)
---
```

**Routing patterns**:

- `/posts/[slug]/` - Individual posts via `getStaticPaths()` in `src/pages/posts/[slug]/index.astro`
- `/posts/[page]/` - Paginated post lists
- `/tags/[tag]/[page]/` - Tag-filtered posts with pagination
- Dynamic OG images generated at `/posts/[slug].png` via `src/utils/generateOgImages.tsx`

**Configuration**: Central config in `src/config.ts` exports `SITE`, `LOCALE`, `SOCIALS` used throughout

## Integration Points

**Astro Collections**: `getCollection("blog")` is the primary data fetching pattern
**Search**: Client-side fuzzy search via FuseJS in `src/components/Search.tsx`
**RSS/Sitemap**: Auto-generated via `@astrojs/rss` and `@astrojs/sitemap`
**Deployment**: GitHub Actions deploys to `gh-pages` branch, triggers Playwright smoke tests
**Markdown**: Enhanced with `remark-toc` and `remark-collapse` plugins

## Key Files/Patterns

- `src/content/config.ts` - Blog schema validation
- `src/utils/getSortedPosts.ts` - Primary post filtering/sorting logic
- `src/pages/posts/[slug]/index.astro` - Dynamic route handling for posts and pagination
- `src/layouts/PostDetails.astro` - Individual post layout with OG image generation
- `src/components/Card.tsx` - Reusable post preview component
- `.github/workflows/` - CI/CD with automated testing
