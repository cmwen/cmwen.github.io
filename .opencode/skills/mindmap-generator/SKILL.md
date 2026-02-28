---
name: mindmap-generator
description: Generates mind map data files for the toolbox mind maps collection
license: MIT
compatibility: opencode
metadata:
  audience: blog-contributors
  workflow: content-creation
---

# Mind Map Generator Skill

Use this skill when creating new mind maps or updating existing ones for the toolbox mind maps collection at `/toolbox/mindmaps/`.

## What I Do

- Generate mind map JSON files in `src/content/mindmaps/`
- Follow the `MindMap` / `MindMapNode` data model
- Produce AI-friendly, hierarchical tree structures with notes
- Ensure every node has a unique `id`, a human-readable `label`, and optional `notes`

## When to Use Me

Use this skill when you need to:
- Create a new mind map on a technical topic
- Add nodes or branches to an existing mind map
- Reorganise or restructure an existing mind map
- Write detailed notes for mind map nodes
- Review mind map data for completeness

## Architecture: One File Per Mind Map

Each mind map lives in its own JSON file:

```
src/content/mindmaps/<slug>.json
```

The filename (without `.json`) becomes the URL slug. For example:
- `src/content/mindmaps/ci-cd-pipelines.json` → `/toolbox/mindmaps/ci-cd-pipelines/`

The Astro content collection (`type: "data"`) picks up all files automatically — no registration needed. The `[slug]` dynamic route generates one page per JSON file.

## Data Model Reference

### MindMapNode

```typescript
interface MindMapNode {
  /** Unique id (kebab-case, e.g. "k8s-pods"). */
  id: string;
  /** Display label shown on the node. */
  label: string;
  /** Optional CSS color for this branch (hex string). */
  color?: string;
  /** Optional detailed notes (plain text, Markdown-friendly). */
  notes?: string;
  /** Child nodes. Leaf nodes omit or use []. */
  children?: MindMapNode[];
}
```

### JSON file schema (validated by Zod in `src/content.config.ts`)

```json
{
  "title": "Human-readable title",
  "description": "Short description for cards and SEO.",
  "tags": ["lowercase", "tags"],
  "createdAt": "2026-01-01T00:00:00Z",
  "updatedAt": "2026-01-01T00:00:00Z",
  "root": {
    "id": "root",
    "label": "Root Label",
    "notes": "Optional notes on the root.",
    "children": []
  }
}
```

Note: The `slug` field is **not** included in the JSON — it is derived from the filename by Astro.

## Workflow

1. **Plan the tree**: Outline the hierarchy (root → branches → leaves) before writing JSON. Aim for 2–4 levels of depth.
2. **Create the file**: Write `src/content/mindmaps/<slug>.json` following the schema above.
3. **Validate**: Run `pnpm build` to confirm no schema or TypeScript errors.
4. **Preview**: Run `pnpm dev` and navigate to `/toolbox/mindmaps/` to verify the card appears and the detail page renders.

## Node Authoring Guidelines

### IDs
- Use **kebab-case** derived from the label (e.g. `"terraform-modules"`).
- Prefix with the parent topic when useful for uniqueness (e.g. `"k8s-pods"`, `"helm-charts"`).
- IDs must be **unique across the entire mind map**.

### Labels
- Keep labels **short** (1–4 words). Detail goes in `notes`.
- Use the official product/tool name casing (e.g. "Kubernetes", "Terraform", "gRPC").

### Notes
- Write 1–3 sentences of **plain text**.
- Explain *what* the concept is and *why* it matters.
- Include practical context: when to use it, key trade-offs, related tools.
- Avoid markdown formatting — keep it as readable prose.
- Notes are displayed in a panel below the mind map canvas.

### Colors
- Assign a `color` (hex string) to **first-level children** of the root for branch distinction.
- Use the tool/brand colour when available (e.g. `"#326CE5"` for Kubernetes blue).
- Deeper nodes inherit colour from their branch; no need to set `color` on every node.

### Tree Structure
- **Root node**: The overarching topic. Always `id: "root"`.
- **Level 1**: Major subtopics or tools (3–6 recommended).
- **Level 2**: Categories within each subtopic (2–5 per branch).
- **Level 3+**: Individual concepts (2–6 per category). Avoid going deeper than level 4.

## Example: Adding a New Mind Map

Create `src/content/mindmaps/ci-cd-pipelines.json`:

```json
{
  "title": "CI/CD Pipelines",
  "description": "Continuous Integration and Delivery concepts, tools, and best practices.",
  "tags": ["devops", "ci-cd", "automation"],
  "createdAt": "2026-03-01T00:00:00Z",
  "updatedAt": "2026-03-01T00:00:00Z",
  "root": {
    "id": "root",
    "label": "CI/CD Pipelines",
    "notes": "Automating build, test, and deployment workflows for faster, safer releases.",
    "children": [
      {
        "id": "ci",
        "label": "Continuous Integration",
        "color": "#2563EB",
        "notes": "Merging code frequently with automated builds and tests.",
        "children": [
          { "id": "ci-build", "label": "Build Automation", "notes": "..." },
          { "id": "ci-testing", "label": "Automated Testing", "notes": "..." }
        ]
      },
      {
        "id": "cd",
        "label": "Continuous Delivery",
        "color": "#16A34A",
        "notes": "Keeping code in a deployable state at all times.",
        "children": [
          { "id": "cd-staging", "label": "Staging Environments", "notes": "..." },
          { "id": "cd-rollbacks", "label": "Rollback Strategies", "notes": "..." }
        ]
      }
    ]
  }
}
```

This automatically generates:
- A card on `/toolbox/mindmaps/`
- A detail page at `/toolbox/mindmaps/ci-cd-pipelines/`
- The same pages under `/zh-hant/toolbox/mindmaps/`

## Quality Checklist

Before finalising a mind map, verify:

- [ ] All `id` values are unique within the mind map
- [ ] Every branch node (with children) has at least 2 children
- [ ] Root node `id` is `"root"`
- [ ] First-level children have a `color` set
- [ ] Filename is URL-safe kebab-case (matches intended slug)
- [ ] `tags` are lowercase
- [ ] `createdAt` and `updatedAt` are valid ISO 8601
- [ ] `notes` are present on all nodes with non-obvious labels
- [ ] `pnpm build` succeeds with 0 errors

## Verification

```bash
# Type-check and build
pnpm build

# Preview
pnpm dev
# Open http://localhost:4321/toolbox/mindmaps/
```

## File Locations

| Purpose | Path |
|---|---|
| Mind map data files | `src/content/mindmaps/<slug>.json` |
| Collection schema | `src/content.config.ts` |
| TypeScript interfaces | `src/data/mindmaps.ts` |
| React components | `src/components/mindmaps/` |
| English index page | `src/pages/toolbox/mindmaps/index.astro` |
| English detail page | `src/pages/toolbox/mindmaps/[slug]/index.astro` |
| Chinese index page | `src/pages/zh-hant/toolbox/mindmaps/index.astro` |
| Chinese detail page | `src/pages/zh-hant/toolbox/mindmaps/[slug]/index.astro` |
| This skill | `.opencode/skills/mindmap-generator/SKILL.md` |
