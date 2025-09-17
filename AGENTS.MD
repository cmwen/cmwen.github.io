# AGENTS.MD: Instructions for AI Coding Agents

This document provides a comprehensive guide for AI agents working on the AstroPaper project. It combines information from the original `AGENTS.MD` and `.github/copilot-instructions.md`.

## 1. Project Overview

AstroPaper is a content-driven blog built on the AstroPaper theme. It uses Astro, React, TypeScript, and Tailwind CSS. The site supports two locales, `en` and `zh-hant`, with content stored in Markdown files.

- **Core Idea**: A fast, modern blog with i18n support.
- **Key Features**: Markdown-based content, automatic OG image generation, a mini-app for "AI Agents", and a clean, minimalist design.

## 2. Key Technologies

- **Framework**: Astro
- **UI Components**: React (for interactive parts)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Package Manager**: pnpm
- **Testing**: Playwright
- **Search**: Fuse.js
- **Deployment**: GitHub Pages

## 3. Project Structure

The project follows a standard Astro project structure. Here are some of the key directories:

-   `src/`: Contains most of the source code.
-   `src/pages/`: Contains the pages of the website. Routes are generated automatically from files here.
-   `src/layouts/`: Contains layout components for pages.
-   `src/components/`: Contains reusable components (Astro, React, TSX).
-   `src/content/blog/`: Stores blog posts as Markdown files, validated by Astro Collections.
-   `src/i18n/`: Contains internationalization configuration (`config.ts`, `dict.ts`).
-   `src/utils/`: Contains utility functions for core logic (post filtering, pagination, tags).
-   `public/`: Contains static assets like images and fonts.
-   `tests/`: Contains Playwright tests.
-   `tsconfig.json`: Defines path aliases like `@config`, `@components/*`, etc.

## 4. Content and Schema

### Adding a New Blog Post

1.  Create a new Markdown file in `src/content/blog/`. The filename becomes the slug (e.g., `my-new-post.md`).
2.  Add the frontmatter at the top of the file, following the schema defined in `src/content/config.ts`.
3.  To auto-generate the Open Graph (OG) image, omit the `ogImage` property in the frontmatter.

### Frontmatter Schema

-   `lang`: `"en"` or `"zh-hant"`.
-   `baseSlug`: A shared canonical slug to link translated posts.
-   `translatedFrom`: The `baseSlug` of the original post if it's a translation.
-   `title`, `description`, `author`.
-   `pubDatetime`: The publication date.
-   `modDatetime`: The modification date (used for sorting).
-   `tags`: An array of strings (defaults to `["others"]`).
-   `featured`: A boolean to mark a post as featured.
-   `draft`: A boolean to mark a post as a draft.
-   `llmKeyIdeas`: An array of short phrases (3-8 items) for downstream LLMs (e.g., as suggested questions).
-   `ogImage`: A URL to an OG image (>=1200x630). If omitted, it's auto-generated.
-   `canonicalURL`: A URL for the canonical version of the post.

**Scheduled Publishing**: The `postFilter` utility hides drafts and posts with future dates until `SITE.scheduledPostMargin` is passed.

## 5. Routing and Data Flow

- **Post Listing & Pagination**: `src/pages/posts/[slug]/index.astro` uses `getStaticPaths` to generate paths for both individual posts (by `baseSlug` or `slug`) and paginated index pages.
- **Tags**: `src/pages/tags/[tag]/index.astro` generates paths from `getUniqueTags()`.
- **i18n**: The `zh-hant` homepage is at `src/pages/zh-hant/index.astro`. Links across locales should use `baseSlug` and the `alternates` property in layouts for canonical/locale URLs.

## 6. OG Image Generation

-   **Site OG Image**: `src/pages/og.png.ts` generates the main site's OG image.
-   **Per-Post OG Image**: `src/pages/posts/[slug]/index.png.ts` pre-renders a PNG for each post that doesn't have an `ogImage` in its frontmatter. This uses Satori and Resvg, with templates in `src/utils/og-templates/`.

## 7. Agents Mini-App

-   A React-based UI is available at `/agents/`.
-   **Code**: `src/pages/agents/index.astro` (the page) and `src/components/agents/*` (the React components). It's a client-side only app (`client:only="react"`).
-   **Data**: Providers and agents are defined in `src/data/agents.ts`.
-   **Logic**: `src/utils/agents.ts` contains helpers for persisting the selected provider in `localStorage`, building deep links, and handling long prompts.

## 8. Development Environment

### Devcontainer (Recommended)

This project includes a devcontainer setup. If you have Docker and the VS Code "Remote - Containers" extension, you'll be prompted to reopen the project in a container, which has all dependencies pre-installed.

### Manual Setup

1.  Install Node.js v18.
2.  Install pnpm globally: `npm install -g pnpm`
3.  Install dependencies: `pnpm install`

## 9. Build, Test, and CI

### Commands

-   `pnpm dev`: Start the development server at `http://localhost:4321`.
-   `pnpm build`: Build the project for production (output to `dist/`).
-   `pnpm preview`: Preview the production build locally.
-   `pnpm test` or `pnpm playwright test`: Run Playwright tests.
-   `pnpm lint`: Run the linter (ESLint).
-   `pnpm format`: Format the code (Prettier).
-   `pnpm cz`: Use Commitizen for conventional commits.

### CI/CD

-   The `.github/workflows/main.yaml` workflow builds the project with Node 22 and pnpm 9, and deploys it to GitHub Pages.
-   Playwright tests run in a separate workflow. `smoke.spec.ts` runs against production, while others assume a local `baseURL`.

## 10. Configuration Touchpoints

-   `astro.config.ts`: Main Astro configuration, including integrations (Tailwind, React, Sitemap), Markdown settings (Shiki theme, remark plugins), and Vite options (React dedupe, excluding `@resvg/resvg-js` from `optimizeDeps`).
-   `src/config.ts`: Site-wide constants like `SITE` (title, author, posts per page), `LOCALE`, and `SOCIALS`.
