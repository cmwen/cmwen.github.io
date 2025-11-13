# Quick Reference: Custom Agents

Quick commands and prompts for the blog generation agentic system.

## 🚀 Quick Start

```
1. Open VS Code Chat (Cmd+Shift+I / Ctrl+Shift+I)
2. Click agent dropdown at top
3. Select agent (e.g., "Researcher")
4. Type your prompt
5. Click handoff buttons to proceed
```

## 📋 Agent Quick Reference

| Agent               | Trigger            | Example Prompt                                                                   |
| ------------------- | ------------------ | -------------------------------------------------------------------------------- |
| **Researcher**      | `@Researcher`      | `@Researcher research latest VS Code extension APIs with focus on custom agents` |
| **Ideas Generator** | `@ideas-generator` | `@ideas-generator create blog ideas about agentic workflows`                     |
| **Blog Writer**     | `@blog-writer`     | `@blog-writer write a post about [topic] targeting developers`                   |
| **Fact Checker**    | `@fact-checker`    | `@fact-checker verify the technical claims in this post`                         |
| **Translator**      | `@translator`      | `@translator translate this post to Traditional Chinese`                         |

## 🎯 Common Workflows

### Create New Post (Full Pipeline)

```
1. @Researcher research [topic]
2. Click "Generate Ideas"
3. Review ideas, click "Write Blog Post"
4. Click "Fact Check Content"
5. Click "Translate to Chinese"
6. Click "Generate Podcast"
```

### Quick Opinion Post

```
1. @blog-writer write opinion post about [topic]
2. Review and edit
3. @translator translate this post
4. Run: uv run podcast-generate --posts "slug"
```

### Research & Ideate (No Writing Yet)

```
1. @Researcher research [topic]
2. Click "Generate Ideas"
3. Save ideas for later
```

## 💡 Sample Prompts

### Researcher

```
@Researcher research the following:
- Topic: GitHub Copilot custom agents
- Focus: Handoffs, tools, real-world examples
- Include: Code samples, documentation links
- Target: Technical blog post for developers
```

### Ideas Generator

```
@ideas-generator Based on the research above:
- Generate 5 blog post ideas
- Target audience: intermediate developers
- Mix of tutorial and opinion formats
- Include SEO-friendly titles
```

### Blog Writer

```
@blog-writer Write a blog post:
- Title: [your title]
- Outline: [paste outline]
- Length: 1000-1500 words
- Include code examples
- Target: developers familiar with VS Code
```

### Fact Checker

```
@fact-checker Please verify:
- All API methods and parameters
- Version numbers and compatibility
- External links validity
- Code example accuracy
- Statistical claims
```

### Translator

```
@translator Translate this post:
- From: English (src/content/blog/post-slug.md)
- To: Traditional Chinese
- Keep technical terms in English
- Maintain code blocks unchanged
```

## 🛠️ Terminal Commands

### Podcast Generation

```bash
# Generate for specific post
uv run podcast-generate --posts "post-slug"

# Generate for all posts
uv run podcast-generate --all

# Force regenerate existing
uv run podcast-generate --posts "post-slug" --force

# Wrapper script (via pnpm)
pnpm podcast:generate
```

### Python Environment

```bash
# Setup Python dependencies
uv sync

# Check Python version
python --version

# Test podcast system
uv run podcast-generate --help
```

### Blog Development

```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview build
pnpm preview

# Run tests
pnpm test
```

## 📝 Frontmatter Quick Reference

### Required Fields

```yaml
---
title: "Your Post Title"
description: "SEO description (under 160 chars)"
lang: "en" # or "zh-hant"
author: "Min Wen"
pubDatetime: 2025-01-15T00:00:00Z
tags: ["ai", "coding"]
---
```

### Optional Fields

```yaml
featured: true
draft: false
ogImage: "/path/to/image.jpg"
modDatetime: 2025-01-16T00:00:00Z
canonicalURL: "https://example.com"
llmKeyIdeas: ["key concept", "another idea", "third point"]
```

### Translation Fields (Chinese posts only)

```yaml
lang: "zh-hant"
translatedFrom: "en"
baseSlug: "original-post-slug"
# Note: Do NOT include 'slug' field in translations
```

## 🎨 Handoff Buttons

After each agent completes, you'll see handoff buttons:

| From Agent      | Button           | Goes To         | Purpose                |
| --------------- | ---------------- | --------------- | ---------------------- |
| Researcher      | Generate Ideas   | Ideas Generator | Create post concepts   |
| Ideas Generator | Write Blog Post  | Blog Writer     | Start writing          |
| Blog Writer     | Fact Check       | Fact Checker    | Verify accuracy        |
| Blog Writer     | Translate        | Translator      | Create Chinese version |
| Fact Checker    | Back to Writer   | Blog Writer     | Make corrections       |
| Fact Checker    | Translate        | Translator      | Continue if verified   |
| Translator      | Generate Podcast | Blog Writer     | Create audio           |

## ⚠️ Common Issues

### Agent not found

```
Error: Unknown agent 'agent-name'
Solution: Check spelling, use hyphens not spaces
         Reload VS Code window (Cmd+R / Ctrl+R)
```

### Tool not available

```
Error: Unknown tool 'tool-name'
Solution: Remove from tools list in agent frontmatter
         Use only: fetch, githubRepo, search, edit,
                  runCommands, problems
```

### Podcast generation fails

```
Error: Post not found or invalid frontmatter
Solution: 1. Run `uv sync` to setup Python env
         2. Check post frontmatter is valid YAML
         3. Verify post slug matches file
         4. Check `pnpm dev` shows the post
```

### Translation file collision

```
Error: Slug collision between locales
Solution: In Chinese file:
         - Remove 'slug' field entirely
         - Add 'baseSlug' + 'translatedFrom'
         - File name: original-slug.zh-hant.md
```

## 🔧 Troubleshooting

### Reset Agent State

```
1. Close chat panel
2. Reload window (Cmd+R / Ctrl+R)
3. Open chat panel again
4. Select agent from dropdown
```

### Clear Agent Cache

```
1. Open Command Palette (Cmd+Shift+P)
2. Type "Reload Window"
3. Press Enter
```

### Verify Agent Files

```bash
# List all agents
ls -la .github/agents/*.agent.md

# Check for syntax errors
cat .github/agents/researcher.agent.md
```

## 📚 File Locations

```
.github/agents/
├── README.md              # Main documentation
├── WORKFLOW.md            # Visual workflow guide
├── QUICK_REFERENCE.md     # This file
├── researcher.agent.md    # Research agent
├── ideas.agent.md         # Ideas generator
├── blog-writer.agent.md   # Writer agent
├── fact-checker.agent.md  # Fact checker
└── translator.agent.md    # Translator

src/content/blog/
├── *.md                   # English posts
└── zh-hant/
    └── *.zh-hant.md       # Chinese posts

public/podcasts/
├── *.mp3                  # Audio files
├── feed.xml               # Main RSS feed
├── en/feed.xml            # English feed
└── zh-hant/feed.xml       # Chinese feed
```

## 🎓 Learning Path

### Day 1: Basics

1. Read `README.md` for overview
2. Try `@Researcher` with simple topic
3. Use handoff button to move to ideas
4. Review without writing

### Day 2: Writing

1. Use full pipeline with simple post
2. Practice fact-checking
3. Generate podcast
4. Review published output

### Day 3: Translation

1. Write English post
2. Use translator agent
3. Verify both versions
4. Generate bilingual podcasts

### Day 4: Optimization

1. Try different workflows
2. Customize agent prompts
3. Add your own agents
4. Create custom shortcuts

## 🚀 Pro Tips

✅ **Use handoffs**: They transfer context automatically
✅ **Review each step**: Don't blindly accept output
✅ **Fact-check technical posts**: Always verify code
✅ **Keep tools minimal**: Only add what you need
✅ **Name agents consistently**: Use hyphens, lowercase
✅ **Test podcasts locally**: Run before committing
✅ **Save research reports**: Reuse for multiple posts
✅ **Batch translations**: Do multiple at once

## 📞 Need Help?

- **Documentation**: See `README.md` and `WORKFLOW.md`
- **VS Code Docs**: https://code.visualstudio.com/docs/copilot/customization/custom-agents
- **Project Docs**: See `/AGENTS.MD` in repo root
- **Podcast System**: See `podcast_generator/` directory

---

**Quick Start Command**: `@Researcher research [your topic]` and follow the handoffs! 🎯
