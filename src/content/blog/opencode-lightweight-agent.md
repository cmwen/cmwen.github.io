---
title: "From Heavy IDEs to Lightweight Agents: My Journey with OpenCode"
description: "How I ditched VS Code bloat and built a privacy-first AI coding setup using OpenCode as a unified agent across terminal, desktop, and any editor that supports ACP."
lang: "en"
author: "Min Wen"
pubDatetime: 2026-01-18T00:00:00Z
tags: ["ai", "coding", "opencode", "tools", "productivity"]
featured: true
draft: false
---

## The Problem: When Your IDE Becomes an Anchor

A few months ago, I realized VS Code had become unbearably slow on my machine. Not from bugs or crashes—just from the sheer weight of it. Extensions stacked on top of extensions. Electron chewing through RAM. Every keystroke felt like it was swimming through molasses.

The real kicker? I was using it primarily for one thing: integrating with AI coding assistants. Whether it was Copilot, Claude extension, or ChatGPT, I was basically paying the VS Code tax to get these agents running locally.

I thought, "There has to be a better way."

## The Discovery: OpenCode

I stumbled upon OpenCode while browsing GitHub—70K stars, 500+ contributors, and a promise that caught my attention: *"open source AI coding agent"*. But what really intrigued me was how it positioned itself: not locked into any one editor, not dependent on any single provider, and fundamentally designed around the idea of giving developers control.

I decided to give it a shot. What I found was something I didn't even know I needed.

## Why OpenCode Clicked (And Why You Might Like It Too)

### 1. **Bring Your Own Model (BYOM)**

This is huge. With OpenCode, you're not locked into GitHub's Copilot or Anthropic's hosted endpoint. You can use:

- **Claude Pro or Max** - if you already have an Anthropic subscription
- **ChatGPT Plus/Pro** - if you're an OpenAI subscriber
- **Any of 75+ LLM providers** - via Models.dev (including local models)
- **OpenCode Zen** - a curated list of models tested specifically for coding tasks

I use Claude Pro, and being able to tap directly into my existing subscription without paying for a *separate* coding agent service felt liberating. No double billing. No vendor lock-in.

```bash
# Configure your provider once, use it everywhere
opencode /connect
# Select your provider (Anthropic, OpenAI, or 75+ others)
# Paste your API key
# Done
```

### 2. **One Agent, Everywhere: The Unified Interface**

Here's where OpenCode's architecture really shines. It's not just a CLI tool. It's available as:

- **Terminal UI (TUI)** - Rich terminal interface with hotkeys and themes
- **Desktop App** - macOS, Windows, Linux (currently in beta)
- **ACP-compatible editors** - Zed, JetBrains IDEs, Neovim (via Avante.nvim or CodeCompanion.nvim)
- **Web Interface** - Because it's client/server architecture

This was transformative for me. I could start a session in my terminal, switch to an editor when I needed to, and everything was synchronized. My configuration, my agents, my rules—all unified in one place.

### 3. **Self-Hosted, Privacy-First Architecture**

OpenCode operates on a client/server model. This means:

- You can run it as a **remote coding agent** without relying on GitHub or Anthropic to run agents for you
- Your code and context data **never** leaves your system unless you explicitly send it to your LLM provider
- You have **full control** over where your agent runs—local machine, remote server, wherever

I used to worry about code snippets being logged somewhere. With OpenCode, that anxiety is gone.

## The Features That Actually Matter

### Agents: Specialized AI Assistants

OpenCode comes with built-in agents:

- **Build Agent** - Full development work with all tools enabled (default)
- **Plan Agent** - Analysis and planning without making changes (perfect for reviewing suggestions)
- **Custom Agents** - You can create specialized agents for specific workflows

I created a "code-reviewer" agent that only reads code and suggests improvements without making changes. It's perfect for that "do a review pass" moment without worrying about accidental modifications.

```markdown
# ~/.config/opencode/agents/review.md
---
description: Reviews code for quality and best practices
mode: subagent
temperature: 0.1
tools:
  write: false
  edit: false
  bash: false
---

You are in code review mode. Focus on:
- Code quality and best practices
- Potential bugs and edge cases
- Performance implications
- Security considerations
```

### Skills: Reusable Instructions

Skills are reusable behavior definitions that agents can load on-demand. I created a "git-release" skill for handling release workflows:

```markdown
# .opencode/skills/git-release/SKILL.md
---
name: git-release
description: Create consistent releases and changelogs
---

## What I do
- Draft release notes from git history
- Suggest version bumps
- Provide copy-pasteable git commands

## When to use me
Use this when preparing a tagged release.
```

Then I can just ask: *"use the git-release skill to prepare our next release"*, and OpenCode loads those instructions into context.

### MCP Servers: Extend With External Tools

Model Context Protocol (MCP) lets you plug in external tools and services. OpenCode supports both local and remote MCP servers with OAuth support.

I connected Context7 (for searching through documentation) and Sentry (for error investigation):

```json
{
  "mcp": {
    "context7": {
      "type": "remote",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "{env:CONTEXT7_API_KEY}"
      }
    },
    "sentry": {
      "type": "remote",
      "url": "https://mcp.sentry.dev/mcp",
      "oauth": {}
    }
  }
}
```

Now when I'm investigating a bug, I can ask OpenCode to check Sentry for recent errors. No context switching. No manual API hunting.

### Commands: Automate Your Workflow

Custom commands let you automate repetitive prompts. Instead of typing the same thing every time, you define it once.

## The Lightweight Setup: Zed + OpenCode

Here's my current setup that finally freed me from VS Code:

**Editor: Zed** - A lightweight, modern editor written in Rust. Fast, responsive, and beautiful. Way lighter than VS Code.

**Agent: OpenCode** - Running via ACP protocol in Zed. I configured it in `~/.config/zed/settings.json`:

```json
{
  "agent_servers": {
    "OpenCode": {
      "command": "opencode",
      "args": ["acp"]
    }
  }
}
```

Now I press `Cmd+Alt+O` (my custom keybind) to open an OpenCode agent thread right in Zed. I can ask questions, make changes, review code—all without leaving the editor.

For terminal work? I just run `opencode` in my project directory and get the full TUI experience.

## A Day in the Life: Real Workflow

Here's what a typical day looks like:

**Morning: Code Review**
```
opencode
<TAB>  # Switch to Plan agent
@review Check the authentication flow in src/auth/index.ts for security issues
```

The Plan agent analyzes without making changes. Perfect for that first pass.

**Mid-morning: Feature Development**
```
I need to add a rate limiter to the API endpoints. 
Look at how it's done in the middleware and apply the same pattern.
```

The Build agent creates a plan, I review it, then tell it to implement.

**Afternoon: Debugging**
```
Use sentry to check for 500 errors from the past 24 hours
```

OpenCode queries Sentry (via MCP), shows me the issues, suggests fixes.

**Late afternoon: Switching to Zed**
```
Cmd+Alt+O  # Opens OpenCode in Zed
Show me any type errors in this file and fix them
```

Same agent, same context, different interface.

## What Changed for Me

**Before OpenCode:**
- Slow VS Code with extensions
- Multiple subscription services (GitHub Copilot + paid LLM provider)
- Locked into one tool/interface
- Privacy concerns about where code was being logged
- No control over the infrastructure

**After OpenCode:**
- Lightweight setup (Zed + CLI agent)
- One subscription to Claude Pro, used everywhere
- Consistent experience across terminal, desktop, and editor
- Full control and visibility
- Self-hosted agent infrastructure if I ever need it

## The Open Source Difference

OpenCode being open source with 500+ contributors isn't just a bragging point. It means:

- **No rug pulls** - The code is there. Community has oversight.
- **No sudden changes** - Breaking changes follow semantic versioning and community discussion.
- **Extensibility** - You can fork it, modify it, run your own version if you need to.
- **Community-driven features** - Skills, agents, and tools are shared by the community.

## Not a Perfect Fit For Everyone

To be fair, OpenCode won't solve all problems:

- If you're deeply invested in VS Code's ecosystem, migration takes time
- Some VS Code extensions won't have direct equivalents
- The desktop app is still in beta (though working well for me)
- Custom MCP servers mean you need to understand them or find community ones

But if you're like me—frustrated with IDE bloat, wanting more control, and looking for a privacy-first solution—OpenCode is absolutely worth exploring.

## Getting Started

If you want to try it:

```bash
# Install (or use npm, Homebrew, etc.)
curl -fsSL https://opencode.ai/install | bash

# Navigate to a project
cd /path/to/your/project

# Start the agent
opencode

# Initialize the project (creates AGENTS.md)
/init

# Start asking questions
How is authentication handled in src/auth?
```

The whole experience is remarkably smooth. Within 15 minutes, I had it configured and working.

## Final Thoughts

The transition from "heavy IDE + multiple AI subscriptions" to "lightweight editor + unified AI agent" has been one of the best developer experience improvements I've made in recent years.

OpenCode proved that you don't need to be locked into a single vendor's ecosystem. You don't need to pay multiple subscription services. And you don't need to sacrifice privacy or control.

If you're interested in a more autonomous, privacy-conscious, and flexible approach to AI-assisted development, I genuinely recommend giving OpenCode a try.

Have you tried OpenCode? Or are you thinking about making the switch? I'd love to hear about your experience. Feel free to reach out.

---

**Resources:**
- [OpenCode Official Docs](https://opencode.ai/docs)
- [GitHub Repository](https://github.com/anomalyco/opencode)
- [Discord Community](https://opencode.ai/discord)
- [Zed Editor](https://zed.dev)
