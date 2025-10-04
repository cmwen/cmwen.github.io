# AGENTS.md: Instructions for AI Coding Agents

This document provides comprehensive guidance for AI agents working on the cmwen.github.io AstroPaper blog project. It combines technical architecture, development practices, and project-specific conventions.

## 1. Project Overview

**cmwen.github.io** is a content-driven blog built on the AstroPaper theme with modern web technologies:

- **Framework**: Astro with React components
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Content**: Markdown with frontmatter validation
- **Deployment**: GitHub Pages via GitHub Actions
- **Package Manager**: pnpm

### Core Features
- ✅ **Bilingual support**: English (`en`) and Traditional Chinese (`zh-hant`)
- ✅ **SEO optimization**: Auto-generated OG images, sitemap, RSS feeds
- ✅ **Content management**: Astro Collections with schema validation
- ✅ **Interactive components**: React-based agents directory, search functionality
- ✅ **Podcast generation**: Python-based TTS system with multi-language support
- ✅ **Developer experience**: Hot reload, TypeScript, ESLint, Prettier, conventional commits

## 2. Architecture Overview

### Frontend Stack
```
Astro (SSG) 
├── React (Interactive components)
├── TypeScript (Type safety)
├── Tailwind CSS (Styling)
└── Vite (Build tool)
```

### Content System
```
src/content/blog/
├── *.md (English posts)
└── zh-hant/
    └── *.zh-hant.md (Chinese posts)
```

### Routing Strategy
- **Static generation**: Routes auto-generated from `src/pages/`
- **Dynamic pages**: `[slug]` patterns with `getStaticPaths()`
- **Internationalization**: `/zh-hant/` prefix for Chinese content
- **SEO**: Canonical URLs and alternates for language switching

## 3. Development Environment

### Prerequisites
- **Node.js**: v18+ (specified in `.nvmrc`)
- **Package Manager**: pnpm (lockfile: `pnpm-lock.yaml`)
- **Python**: 3.8+ for podcast generation (managed via `uv`)
- **Optional**: Docker via `.devcontainer/` for consistent environment

### Setup Commands
```bash
# Frontend development
pnpm install          # Install dependencies
pnpm dev              # Start dev server (http://localhost:4321)
pnpm build            # Build for production
pnpm preview          # Preview production build

# Python podcast system
uv sync               # Install Python dependencies
uv run podcast-generate --help  # See podcast CLI options

# Code quality
pnpm lint             # ESLint
pnpm format           # Prettier
pnpm test             # Playwright tests
pnpm cz               # Conventional commits
```

## 4. Content Management

### Blog Post Schema
All posts must include frontmatter validated by `src/content/config.ts`:

```yaml
---
title: "Your Post Title"
description: "SEO description"
lang: "en" | "zh-hant"
author: "Min Wen"  # Defaults to SITE.author
pubDatetime: 2025-01-01T00:00:00Z
modDatetime: 2025-01-02T00:00:00Z  # Optional, used for sorting
tags: ["ai", "coding"]  # Defaults to ["others"]
featured: false
draft: false
ogImage: "/path/to/image.jpg"  # Optional, auto-generated if omitted
canonicalURL: "https://example.com"  # Optional
baseSlug: "shared-slug"  # For linking translations
translatedFrom: "original-base-slug"  # If this is a translation
llmKeyIdeas: ["key-concept-1", "key-concept-2"]  # For AI/chat UIs
---

Your markdown content here...
```

### Multilingual Content
- **English posts**: `src/content/blog/post-name.md`
- **Chinese posts**: `src/content/blog/zh-hant/post-name.zh-hant.md`
- **Linking translations**: Use `baseSlug` and `translatedFrom` fields
- **URL structure**: English at `/posts/slug/`, Chinese at `/zh-hant/posts/slug/`

### Content Processing
- **Scheduled publishing**: `SITE.scheduledPostMargin` hides future posts
- **Draft filtering**: `draft: true` posts excluded from production
- **Sorting**: By `modDatetime` then `pubDatetime` (newest first)
- **SEO**: Auto-generated OG images via Satori + Resvg if `ogImage` omitted

## 5. Component Architecture

### File Organization
```
src/
├── components/
│   ├── *.astro          # Astro components (SSG)
│   ├── *.tsx            # React components (interactive)
│   └── agents/          # Agents mini-app components
├── layouts/             # Page layouts
├── pages/               # Route definitions
├── utils/               # Utility functions
└── i18n/               # Internationalization
```

### Key Components
- **`Card.tsx`**: Blog post preview cards with i18n support
- **`Search.tsx`**: Fuse.js-powered search with baseSlug awareness
- **`agents/AgentsApp.tsx`**: Client-side React app for AI agents directory
- **`Header.astro`**: Navigation with language switching
- **OG templates**: `src/utils/og-templates/` for auto-generated images

### Component Guidelines
- **Astro components**: For static content, layouts, SEO-critical elements
- **React components**: For interactivity, state management, real-time features
- **Hydration**: Use `client:load` sparingly, prefer `client:idle` or `client:visible`
- **TypeScript**: All components must be typed, use `src/types.ts` for shared types

## 6. Podcast Generation System

### Architecture
Pure Python system for converting blog posts to podcasts:

```
podcast_generator/
├── main.py           # CLI interface (Click + Rich)
├── blog_parser.py    # Markdown → structured data
├── tts_engine.py     # Kokoro TTS integration
├── feed_generator.py # RSS feed generation
└── __init__.py       # Package exports
```

### Multi-Language TTS
- **English**: Kokoro v1.0 model, `af_sarah` voice, direct text input
- **Chinese**: Kokoro v1.1-zh model, `zf_001` voice, misaki phonemization
- **Auto-switching**: TTS engine reinitializes for language changes
- **Voice options**: 90+ Chinese voices available (`zf_001`-`zf_099`, `zm_009`-`zm_100`)

### Usage Patterns
```bash
# Generate specific posts
uv run podcast-generate --posts "post-slug"

# Generate all posts
uv run podcast-generate --all

# Force regeneration
uv run podcast-generate --posts "slug" --force

# Test Chinese voices
python test_chinese_voices.py  # If testing script exists
```

### Output Structure
```
public/podcasts/
├── feed.xml              # Main RSS feed
├── post-slug.mp3         # English podcasts
├── post-slug.zh-hant.mp3 # Chinese podcasts
├── en/
│   └── feed.xml          # English-specific feed
└── zh-hant/
    └── feed.xml          # Chinese-specific feed
```

## 7. Build and Deployment

### CI/CD Pipeline
GitHub Actions workflow (`.github/workflows/main.yaml`):

1. **Environment**: Node.js 22, pnpm 9
2. **Dependencies**: Install and cache
3. **Build**: `pnpm build` → `dist/`
4. **Deploy**: Push to `gh-pages` branch
5. **Testing**: Playwright (separate workflow)

### Build Optimizations
- **Image optimization**: Astro's built-in image processing
- **Code splitting**: Automatic via Vite
- **Static generation**: All routes pre-rendered
- **Asset optimization**: CSS purging, JS minification

### Performance Targets
- **Lighthouse scores**: >90 on all metrics
- **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
- **Bundle size**: Minimal JavaScript for static content

## 8. Development Practices

### Code Quality
- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Astro + TypeScript configuration
- **Prettier**: Consistent formatting
- **Husky**: Pre-commit hooks for linting

### Git Workflow
- **Conventional commits**: Use `pnpm cz` for structured messages
- **Branch strategy**: Direct to `main` for single developer
- **Deployment**: Automatic on push to `main`

### Testing Strategy
- **E2E testing**: Playwright (`tests/*.spec.ts`)
- **Smoke tests**: Production validation (`tests/smoke.spec.ts`)
- **Component testing**: Manual for now, consider Vitest for unit tests

## 9. Configuration Reference

### Key Config Files
- **`astro.config.ts`**: Framework configuration, integrations, build settings
- **`src/config.ts`**: Site constants, metadata, feature flags
- **`tsconfig.json`**: TypeScript + path aliases (`@components/*`, `@utils/*`)
- **`pyproject.toml`**: Python dependencies and package configuration
- **`package.json`**: Node.js dependencies and npm scripts

### Path Aliases
```typescript
// Available in all TypeScript files
import { SITE } from '@config';
import Card from '@components/Card.tsx';
import { slugify } from '@utils/slugify';
import Layout from '@layouts/Layout.astro';
import { dict } from '@i18n/dict';
```

### Environment Variables
- **Development**: `.env.example` shows available options
- **Production**: Set in GitHub repository settings
- **Build-time**: Prefix with `PUBLIC_` for client-side access

## 10. Troubleshooting

### Common Issues

1. **Build failures**: Check TypeScript errors, missing imports
2. **Hydration mismatches**: Ensure deterministic initial state in React components
3. **Missing translations**: Verify `baseSlug` and file naming conventions
4. **Podcast generation**: Check Python environment, model downloads in `~/.cache/kokoro-onnx/`
5. **OG image generation**: Verify fonts in `src/assets/fonts/`

### Debug Commands
```bash
# Check for issues
pnpm build --verbose       # Detailed build output
pnpm dev --host            # Debug on other devices
pnpm test --debug          # Playwright debugging
uv run podcast-generate --dry-run  # Test without generation
```

### Performance Debugging
- **Bundle analyzer**: Add `vite-bundle-analyzer` for bundle inspection
- **Lighthouse CI**: Run locally with `lhci autorun`
- **Network tab**: Check for oversized assets, failed requests

## 11. AI Agent Guidelines

### When Working on This Project

1. **Content creation**: Follow frontmatter schema, use proper file naming
2. **Component development**: Prefer Astro for static, React for interactive
3. **Internationalization**: Always consider both languages, use `baseSlug` for linking
4. **Performance**: Minimize client-side JavaScript, optimize images
5. **SEO**: Maintain meta tags, structured data, OG images
6. **Accessibility**: Use semantic HTML, proper heading hierarchy, alt texts

### Code Generation Best Practices
- **Type safety**: Generate TypeScript, avoid `any`
- **Consistency**: Follow existing patterns in codebase
- **Documentation**: Include JSDoc for complex functions
- **Testing**: Consider test implications for new features
- **Dependencies**: Minimize new dependencies, check bundle impact

### Podcast System Best Practices
- **Voice selection**: Test Chinese voices for user preferences
- **Content preparation**: Clean markdown properly for TTS
- **Error handling**: Graceful failures for TTS generation
- **Model management**: Respect cache directory structure
- **RSS compliance**: Ensure podcast feeds validate

## 12. Future Considerations

### Potential Enhancements
- **Search improvements**: Consider Algolia or local search index
- **Analytics**: Privacy-friendly analytics integration
- **Comments**: GitHub Discussions or Giscus integration
- **Newsletter**: Email subscription system
- **PWA**: Service worker for offline reading
- **API**: Headless CMS integration for dynamic content

### Scalability
- **CDN**: CloudFlare or similar for global distribution
- **Images**: External image optimization service
- **Search**: Dedicated search service for large content volumes
- **Podcasts**: Separate storage for audio files (S3, etc.)

---

This document serves as the authoritative guide for AI agents working on this project. Keep it updated as the project evolves, and refer to it when making architectural decisions or onboarding new contributors.
