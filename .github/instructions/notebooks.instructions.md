# Instructions for creating/editing notebooks

Notebooks are quick reference cheatsheets stored in MDX format for easy AI updates.

## File Location

- Store notebook files in: `src/content/notebooks/`
- Use `.mdx` extension (supports both Markdown and JSX components)

## Front Matter

Use the following front matter structure:

```yaml
---
title: "Notebook Title"
description: "Brief description of the notebook content"
pubDatetime: 2025-01-27T00:00:00Z
modDatetime: 2025-01-28T00:00:00Z # Optional, update when content changes
tags: ["tag1", "tag2"] # Optional, defaults to ["notes"]
draft: false # Optional, set to true to hide from listing
---
```

## Content Guidelines

- Use standard Markdown syntax
- Add code blocks with syntax highlighting
- Use headings to organize sections
- Can import and use React components (MDX feature)
- Keep content focused and scannable
- Update frequently as needed

## Key Features

- **Not included in RSS feeds** - Notebooks are separate from blog posts
- **Easy to remove** - Simply delete the file or set `draft: true`
- **AI-friendly** - Simple MDX format is easy for AI tools to update
- **Supports components** - Can use React components for interactive elements

## Example Structure

````mdx
---
title: "Git Commands Cheatsheet"
description: "Quick reference for common Git commands"
pubDatetime: 2025-01-27T00:00:00Z
tags: ["git", "cheatsheet"]
---

# Git Commands Cheatsheet

## Basic Commands

```bash
git status
git add .
git commit -m "message"
```
````

## Advanced Usage

...

```

## Navigation
- Notebooks appear in the main navigation menu
- Listing page: `/notebooks/`
- Individual notebook: `/notebooks/[slug]/`
```
