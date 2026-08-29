---
name: create-mind-map
description: Create, expand, reorganize, or review JSON mind maps for the site's toolbox collection. Use for requests involving `src/content/mindmaps`, mind-map topics, branches, nodes, annotations, colors, notes, cross-references, or mind-map schema validation.
---

# Create a mind map

Read `src/content.config.ts`, `src/data/mindmaps.ts`, and one recent map before editing.

## Design the map

- Store one map per URL-safe file at `src/content/mindmaps/<slug>.json`.
- Provide `title`, `description`, lowercase `tags`, ISO 8601 `createdAt` and `updatedAt`,
  optional `initialDepth`, and a `root` node.
- Give every node a unique kebab-case `id`, short `label`, and useful `notes`. The root ID
  may describe the topic; do not force it to be `root` when nearby maps use another pattern.
- Use 3–6 meaningful first-level branches and usually 2–4 levels. Prefer a coherent learning
  or decision hierarchy over exhaustive taxonomy.
- Give first-level branches distinct accessible hex colors. Use annotations sparingly for
  short signals such as `start here`, `gotcha`, or `key concept`.
- Use `refs` only for important cross-branch relationships. Every `targetId` must resolve to
  exactly one node in the same file.
- Keep notes factual, self-contained, and concise. Verify current product or standards claims
  when the requested map depends on them.

## Preserve integrity

When updating a map, retain stable IDs unless changing them is necessary. If an ID changes,
update every reference to it. Check for duplicate IDs, dangling references, empty branches,
invalid colors, inconsistent timestamps, and accidental loss of existing content.

Run `pnpm build` after changes. For visual changes, preview `/toolbox/mindmaps/<slug>/` when
practical and report any validation not performed.
