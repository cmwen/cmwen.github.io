# Blog Generation Agentic System

This directory contains custom agents that form an agentic workflow for generating blog posts from research to publication. The system is designed to guide you through the entire content creation pipeline with specialized AI agents at each stage.

## 🎯 Overview

The agentic system consists of **5 specialized agents** that work together through **handoffs** to create high-quality, fact-checked, bilingual blog posts with podcast audio:

```
┌─────────────┐
│ Researcher  │ Gathers information and sources
└──────┬──────┘
       │ handoff
       ▼
┌─────────────┐
│   Ideas     │ Generates post ideas and outlines
│  Generator  │
└──────┬──────┘
       │ handoff
       ▼
┌─────────────┐
│    Blog     │ Writes complete blog post
│   Writer    │
└──────┬──────┘
       │ handoff (optional)
       ▼
┌─────────────┐
│    Fact     │ Verifies accuracy and technical details
│   Checker   │
└──────┬──────┘
       │ handoff (optional)
       ▼
┌─────────────┐
│ Translator  │ Creates Traditional Chinese version
└─────────────┘
```

## 🤖 Agent Descriptions

### 1. Researcher (`researcher.agent.md`)

**Purpose**: Gather comprehensive, accurate information on topics for blog posts.

**Tools**: `fetch`, `githubRepo`, `search`

**What it does**:

- Researches topics deeply using web fetch and code search
- Organizes findings into structured reports
- Identifies key concepts, technical details, and use cases
- Cites sources for verification
- Notes areas needing further investigation

**When to use**:

- Starting research on a new topic
- Need background information and context
- Want to explore related concepts
- Gathering examples and real-world applications

**Handoff**: To **Ideas Generator** with research findings

### 2. Ideas Generator (`ideas.agent.md`)

**Purpose**: Transform research into compelling blog post concepts and detailed outlines.

**Tools**: `search`

**What it does**:

- Reviews research findings
- Generates 3-5 distinct blog post ideas
- Creates detailed outlines for each idea
- Suggests appropriate tags and frontmatter
- Considers target audience and content format
- Checks for duplicate topics in existing posts

**When to use**:

- After completing research
- Need creative angles on a topic
- Want multiple options to choose from
- Need structured outlines for writing

**Handoff**: To **Blog Writer** with selected idea and outline

### 3. Blog Writer (`blog-writer.agent.md`)

**Purpose**: Write complete, engaging blog posts following the outline.

**Tools**: `runCommands`, `edit`, `search`, `problems`

**What it does**:

- Writes full blog post in Markdown
- Creates proper frontmatter with all required fields
- Ensures AstroPaper schema compliance
- Generates engaging, informative content
- Produces podcast audio using TTS system
- Maintains professional tone and quality

**When to use**:

- Ready to write from outline
- Creating new blog post
- Need properly formatted Markdown
- Want automatic podcast generation

**Handoffs**:

- To **Fact Checker** for verification (optional)
- To **Translator** for Chinese version (optional)

### 4. Fact Checker (`fact-checker.agent.md`)

**Purpose**: Verify factual accuracy and technical correctness of blog posts.

**Tools**: `fetch`, `githubRepo`, `search`

**What it does**:

- Verifies all factual claims and statistics
- Validates code examples and technical details
- Tests external links for validity
- Checks API documentation and version numbers
- Provides detailed correction reports
- Rates severity of issues found

**When to use**:

- Before publishing technical content
- After writing code-heavy posts
- When claims need verification
- Quality assurance step

**Handoffs**:

- Back to **Blog Writer** to fix issues (if found)
- To **Translator** if content is verified accurate

### 5. Translator (`translator.agent.md`)

**Purpose**: Translate English blog posts to Traditional Chinese (zh-hant).

**Tools**: `edit`, `search`, `problems`

**What it does**:

- Translates prose to idiomatic Traditional Chinese
- Preserves code blocks and technical content
- Updates frontmatter with proper localization fields
- Maintains markdown structure
- Handles technical terms appropriately
- Saves to `src/content/blog/zh-hant/` directory

**When to use**:

- After English post is complete and verified
- Want bilingual content
- Reaching Chinese-speaking audience

**Handoff**: Back to **Blog Writer** for podcast generation (both languages)

## 📋 Workflow Examples

### Full Pipeline Workflow

**Goal**: Create a new blog post from scratch with research, fact-checking, and translation.

1. **Switch to Researcher agent** → "@Researcher research the topic: [your topic]"
2. **Review research** → Click "Generate Ideas" handoff button
3. **Review ideas** → Select your favorite, click "Write Blog Post" handoff
4. **Review draft** → Click "Fact Check Content" handoff
5. **Review fact-check** → If issues found, go back to writer; if clean, click "Translate to Chinese"
6. **Review translation** → Click "Generate Podcast" to create audio for both versions
7. **Done!** Both English and Chinese posts published with podcasts

### Quick Writing Workflow

**Goal**: Write a post quickly from an idea you already have.

1. **Switch to Blog Writer agent** → "@blog-writer write a post about [topic]"
2. Provide outline or key points
3. **Review draft** → Make any manual edits
4. **Optional**: Use fact-checker for verification
5. **Optional**: Translate to Chinese
6. Run podcast generation: `uv run podcast-generate --posts "slug"`

### Research-Only Workflow

**Goal**: Explore a topic without committing to a full post yet.

1. **Switch to Researcher agent** → "@Researcher research [topic] focusing on [aspects]"
2. **Review findings** → Save research report for later
3. **Optional**: Click "Generate Ideas" to see potential blog angles
4. Use research for future content planning

## 🎨 Customization Tips

### Modifying Agents

Each agent is defined in a `.agent.md` file with:

```yaml
---
name: agent-name
description: Brief description shown in UI
tools: ["tool1", "tool2"] # Available tools for this agent
handoffs: # Suggested next steps
  - label: Button Text
    agent: next-agent
    prompt: Suggested prompt text
    send: false # Auto-send (true) or pre-fill (false)
---
```

### Creating New Agents

To add a new agent:

1. Create `your-agent.agent.md` in `.github/agents/`
2. Add YAML frontmatter with name, description, tools
3. Write detailed instructions in the body
4. Define handoffs to connect with existing agents
5. Restart VS Code or reload window

### Customizing Workflows

You can customize handoffs to create different workflows:

- **Skip steps**: Remove handoffs you don't need
- **Add alternatives**: Add multiple handoff options
- **Change order**: Rearrange agent sequence
- **Auto-send**: Set `send: true` for fully automated flows

## 🛠️ Technical Details

### Available Tools

Common tools you can use in agents:

- `fetch` - Fetch web pages and documentation
- `githubRepo` - Search GitHub repositories
- `search` - Search workspace files
- `edit` - Edit files
- `runCommands` - Execute terminal commands
- `problems` - Check for errors

### Handoff Mechanics

Handoffs enable guided transitions between agents:

- Appear as buttons after agent completes
- Pre-fill or auto-send prompts to next agent
- Transfer context automatically
- User maintains control at each step

### File Naming Conventions

- Agents: `agent-name.agent.md` (use hyphens, lowercase)
- Names in YAML: Use same format (`name: agent-name`)
- Location: `.github/agents/` directory
- VS Code auto-detects all `.agent.md` files

## 📚 Best Practices

### For Researchers

- Be thorough, don't stop at surface information
- Always cite sources with URLs
- Note what you couldn't find
- Think about what a writer would need

### For Ideas Generators

- Generate multiple diverse options
- Make outlines detailed and specific
- Check for duplicate topics
- Consider SEO and audience

### For Writers

- Follow the outline structure
- Use proper frontmatter schema
- Test code examples
- Generate podcasts after writing

### For Fact Checkers

- Verify every factual claim
- Test all links and code
- Document evidence thoroughly
- Provide constructive corrections

### For Translators

- Use idiomatic Chinese
- Keep technical terms in English
- Preserve code blocks exactly
- Validate YAML syntax

## 🚀 Getting Started

### First Time Setup

1. **Open VS Code** in this workspace
2. **Enable GitHub Copilot** (if not already enabled)
3. **Open Chat panel** (Ctrl+Shift+I / Cmd+Shift+I)
4. **Click agent dropdown** (top of chat panel)
5. **Select an agent** to start (e.g., "Researcher")

### Sample First Prompt

```
@Researcher Research the latest developments in VS Code custom agents,
focusing on handoffs, tools, and practical use cases for agentic workflows.
Include code examples and community best practices.
```

Then follow the handoff buttons to move through the pipeline!

## 📖 Learn More

- **Custom Agents Documentation**: https://code.visualstudio.com/docs/copilot/customization/custom-agents
- **Prompt Files**: https://code.visualstudio.com/docs/copilot/customization/prompt-files
- **AstroPaper Blog**: See `AGENTS.MD` in root directory for project-specific details
- **Podcast System**: See `podcast_generator/` for TTS implementation

## 🤝 Contributing

To improve these agents:

1. Edit the `.agent.md` files in this directory
2. Test workflows thoroughly
3. Update this README with new patterns
4. Share improvements with the team

## 📝 Notes

- Agents are in **preview** as of VS Code 1.106
- Some tools may not be available depending on your setup
- Handoffs require both agents to exist
- Agent names must use hyphens (no spaces)
- Reload window after creating new agents

---

**Ready to create amazing blog content?** Switch to the **Researcher** agent and start exploring! 🚀
