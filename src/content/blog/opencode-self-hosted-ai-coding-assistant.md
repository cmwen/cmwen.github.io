---
lang: "en"
title: "OpenCode: Code From Anywhere with Your Personal AI Development Server"
description: "How OpenCode's server mode changed my workflow - start long-running tasks on your desktop and check progress from your phone, tablet, or anywhere on your network."
author: "Min Wen"
pubDatetime: 2026-01-18T00:00:00Z
tags: ["ai", "coding", "tools", "developer-experience", "remote-development"]
featured: true
draft: false
slug: "opencode-self-hosted-ai-coding-assistant"
llmKeyIdeas: ["remote AI coding", "server-client architecture", "fire-and-forget tasks", "personal development server", "flexible workflow"]
---

## Table of Contents

## The Problem: Chained to Your Development Machine

Here's a scenario that happens to me all the time: I'm deep in the middle of a complex refactoring. The AI is helping me methodically work through a dozen files, updating function signatures, fixing type errors, updating tests. It's going well, but it's taking time—maybe 20-30 minutes for the full job.

My laptop battery is at 15%. I need to head to a meeting in 5 minutes. Do I:
- Stop the work and lose momentum?
- Keep my laptop open during the meeting, hoping the battery holds?
- Frantically try to find a power outlet?

Or worse—you start a comprehensive test suite rewrite before leaving work. You want to check if it's done while you're having dinner, but you can't because the AI assistant is tied to your work machine.

**This is the invisible friction of traditional AI coding tools.** They're powerful, but they keep you tethered to a single device, a single location, a single moment in time. In an era where we can check our email from anywhere, review documents on our phones, and collaborate asynchronously across time zones, why should AI-assisted coding be any different?

## The "Aha Moment": OpenCode's Server Mode

I discovered [OpenCode](https://github.com/anomalyco/opencode) while looking for alternatives to heavy IDE integrations. With **77,700+ GitHub stars** and growing, it's one of the most popular AI coding assistants available. But here's what caught my attention: **OpenCode has a client/server architecture with built-in remote access**.

The moment I read about server mode, everything clicked. What if I could:
- Run OpenCode on my desktop or home server
- Access it from anywhere on my local network
- Start a long-running refactoring task and close my laptop
- Check progress from my phone during a coffee break
- Pick up where I left off on my tablet in the evening

This isn't just a technical feature—**it's a fundamentally different way of working**. Instead of synchronous, session-bound coding where you need to stay connected, you get asynchronous, fire-and-forget task execution. The server keeps working even when you walk away.

Let me show you what this looks like in practice.

## My New Workflow: Coding Without Boundaries

### Morning: Starting the Server

I boot up my desktop machine (a beefy workstation that stays on most of the day) and start OpenCode in server mode:

```bash
# On my desktop
opencode serve --port 8080 --hostname 0.0.0.0
```

That `--hostname 0.0.0.0` flag is crucial—it makes the server accessible from other devices on my local network, not just localhost. The server starts up, and I see:

```
OpenCode server running on:
  http://192.168.1.100:8080
  http://desktop.local:8080
```

Now OpenCode is running on my desktop, ready to accept connections from any device on my home network.

### From My Laptop: Remote Connection

On my laptop, I attach to the remote server:

```bash
opencode attach http://192.168.1.100:8080
```

Or if I prefer a web interface (which is fantastic on tablets and phones):

```bash
# On the server
opencode web --port 8080 --mdns

# Then open browser to:
# http://desktop.local:8080
```

The mDNS support is brilliant—no need to remember IP addresses. Your desktop announces itself on the network with a friendly hostname.

### The Magic: Fire and Forget

Here's where the workflow transformation happens. I'm working on a large codebase migration—moving from JavaScript to TypeScript across 50+ files. Through the OpenCode TUI (terminal user interface), I describe the task:

> "Convert all JavaScript files in src/ to TypeScript. Add proper type annotations, update imports, and ensure strict type checking passes."

OpenCode starts working through the files. I can see progress in real-time. But here's the thing: **I don't need to watch it**.

- I close my laptop and head to a meeting
- The OpenCode server keeps running on my desktop
- The refactoring continues in the background
- When I'm done with my meeting, I pull out my phone

### Checking Progress from My Phone

I open Safari on my iPhone and navigate to `http://desktop.local:8080`. The web interface loads, showing me:
- Current task progress (32 of 50 files converted)
- Recent changes made
- Any errors or questions that need attention

I can even interact with it—approve suggested changes, ask clarifying questions, or adjust the approach—all from my phone while walking back to my desk.

### Evening: Picking Up Where I Left Off

Later that evening, I'm on my tablet on the couch. I open the same web interface and see the migration is complete. I review the changes, run the test suite (also through OpenCode), and merge the pull request.

**I never went back to my desktop.** The work happened there, but I stayed mobile and flexible.

## How It Works: The Technical Foundation

### Client/Server Architecture

Unlike traditional IDE extensions that run as local processes, OpenCode separates concerns:

```
Desktop/Server (Always Running)
├── OpenCode Server Process
├── File System Access
├── Project Context
├── AI Provider Connections
└── Long-Running Tasks

Clients (Connect/Disconnect Freely)
├── Terminal (opencode attach)
├── Web Browser (opencode web)
├── IDE Integrations (via MCP)
└── Mobile Devices
```

The server maintains state, so you can disconnect and reconnect without losing context. Start a task on your laptop, check progress on your phone, finish up on your tablet—it all just works.

### mDNS: Zero-Configuration Discovery

The `--mdns` flag enables multicast DNS, which means devices on your network can discover the server automatically. No manual IP configuration, no DNS servers—just `desktop.local:8080` or whatever you named your machine.

```bash
# Server announces itself
opencode web --port 8080 --mdns

# Clients can discover it automatically
# Or just use: http://[hostname].local:8080
```

This is especially elegant when you have multiple machines. Your laptop can discover your desktop's OpenCode server without any manual configuration.

### Security Considerations

**Important:** The commands I've shown are for **local network use only**. The `0.0.0.0` binding makes the server accessible from your LAN, not the internet. This is perfect for:
- Home networks
- Office networks
- VPN connections

If you need internet-wide access, you'll want to add proper authentication and use HTTPS (which OpenCode supports via reverse proxy configurations).

## Real Use Cases: How This Changed My Work

### Long-Running Refactoring During Meetings

**Scenario:** I have a 2-hour block of meetings, but I also have a comprehensive refactoring task.

**Before OpenCode Server Mode:**
- Wait until after meetings to start
- Or start it and hope my laptop battery survives
- Or come back to a paused/failed session

**With OpenCode Server Mode:**
- Start the refactoring before the first meeting
- Close my laptop, attend meetings
- Check progress between meetings on my phone
- Review completed work after the last meeting

**Time saved:** 2 hours of productivity that would have been lost to context switching.

### Weekend Side Projects Without the Desk Setup

**Scenario:** I want to work on my side project over the weekend, but I don't want to be stuck at my desk.

**Before:**
- Sit at desk with my development machine
- Or carry heavy laptop everywhere
- Or skip the side project

**With OpenCode Server Mode:**
- Server running on desktop 24/7
- Work from couch on tablet
- Quickly check from phone during breaks
- Switch between devices seamlessly

**Freedom gained:** Code from anywhere in my home, not just my desk.

### Testing and CI/CD Integration

**Scenario:** I've updated test fixtures and want to regenerate all test snapshots—a process that takes 10+ minutes.

**Before:**
- Start the process and wait
- Or start it and risk forgetting about it
- Or script it manually (extra work)

**With OpenCode Server Mode:**
- Ask OpenCode to regenerate tests through the TUI
- Walk away, do something else
- Check completion status from any device
- Review changes when convenient

**Mental overhead reduced:** No need to context-switch or babysit long-running tasks.

### Code Reviews During Lunch

**Scenario:** I want to do a thorough code review of a teammate's PR, but I'm having lunch away from my desk.

**Before:**
- Wait until back at desk
- Or do a superficial review on GitHub mobile
- Or cut lunch short

**With OpenCode Server Mode:**
- Access OpenCode web interface on phone/tablet
- Ask for comprehensive analysis of the PR
- Review AI insights with full context
- Leave detailed feedback

**Flexibility gained:** Productive code reviews on my own schedule, not tied to my desk.

## Step-by-Step Setup Guide

### Prerequisites

You'll need:
- A desktop or server that stays running (or can stay running during work hours)
- Other devices on the same local network (laptop, phone, tablet)
- Basic command-line familiarity

### Installation

**Option 1: Direct Installation (Recommended)**
```bash
# macOS/Linux
curl -fsSL https://opencode.ai/install.sh | sh

# Verify installation
opencode --version
```

**Option 2: Docker**
```bash
# Pull the official image
docker run -it --rm ghcr.io/anomalyco/opencode

# For persistent server:
docker run -d \
  --name opencode-server \
  -p 8080:8080 \
  -v $(pwd):/workspace \
  ghcr.io/anomalyco/opencode:latest \
  serve --port 8080 --hostname 0.0.0.0
```

**Option 3: Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'
services:
  opencode:
    image: ghcr.io/anomalyco/opencode:latest
    ports:
      - "8080:8080"
    volumes:
      - ./workspace:/workspace
      - ./config:/root/.config/opencode
    command: serve --port 8080 --hostname 0.0.0.0
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### Setting Up Your Subscriptions

This is the killer feature: **OpenCode can integrate with your existing AI subscriptions**. No need to buy separate licenses for each tool.

```bash
# In OpenCode's TUI, run /connect and authenticate with your existing subscriptions:

# Use your GitHub Copilot Pro subscription
/connect → Search "GitHub Copilot" → Browser opens to github.com/login/device (follow prompts)

# Use your Claude Pro subscription
/connect → Search "Anthropic" → Select "Claude Pro/Max" → Browser opens for authentication

# Use your ChatGPT Plus/Pro subscription
/connect → Search "OpenAI" → Select "ChatGPT Plus/Pro" → Browser opens for authentication

# Or use direct API keys if you prefer
/connect → Select "Manually enter API Key" → Paste your API key

# Or try OpenCode Zen (pay-as-you-go, no monthly fees)
/connect → Search "OpenCode Zen" → Sign up and get API key
```

The beauty of this: **You use the same TUI/CLI interface for all your subscriptions**. No more context switching between different tools for different providers.

You can also use environment variables or config files:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
export GITHUB_TOKEN=ghp_...

opencode  # Automatically picks up credentials
```

### Starting the Server

```bash
# Basic server on local network
opencode serve --port 8080 --hostname 0.0.0.0

# With web interface and mDNS
opencode web --port 8080 --mdns

# With specific provider
ANTHROPIC_API_KEY=sk-ant-... opencode serve --port 8080 --hostname 0.0.0.0
```

**Finding Your Server's Address:**

```bash
# Get your local IP
# On macOS/Linux:
ifconfig | grep "inet " | grep -v 127.0.0.1

# You'll see something like:
# inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

Your OpenCode server will be accessible at `http://192.168.1.100:8080` (replace with your actual IP).

### Connecting from Other Devices

**From Terminal (laptop/desktop):**
```bash
opencode attach http://192.168.1.100:8080
# or
opencode attach http://desktop.local:8080
```

**From Web Browser (any device):**
Just open `http://192.168.1.100:8080` or `http://desktop.local:8080` in any web browser.

**Pro tip:** Bookmark the URL on your phone/tablet for quick access.

## The Unification Layer: One Interface for All Your Subscriptions

Here's something I didn't fully appreciate until I'd been using it for a while: **OpenCode acts as a unified interface for all your AI subscriptions**.

Think about it:
- You have GitHub Copilot Pro for code completion
- You have Claude Pro for complex reasoning tasks
- You have ChatGPT Plus for general questions
- You might have specialized models like DeepSeek or Groq

Normally, you'd switch between different tools—Copilot in your editor, Claude's website, ChatGPT in another tab. Context fragmented, workflows interrupted.

With OpenCode, you authenticate all your subscriptions via `/connect` in the TUI:

```bash
/connect
# Select "GitHub Copilot" → Authenticate
# Select "Anthropic" (Claude Pro) → Authenticate
# Select "OpenAI" (ChatGPT Plus) → Authenticate
```

Now, from the same interface—whether you're on your desktop, phone, or tablet—you can **ask the AI agent to use the best tool for the job**. Need fast iteration on code structure? Use Copilot. Need deep architectural analysis? Switch to Claude. Need to brainstorm? Use ChatGPT.

This is what reminds you of GitHub Copilot's remote agent capabilities—but **open, flexible, and self-hostable**. You're not locked into a specific provider. You're not paying for yet another subscription when you already have multiple AI services.

It's closer to how you'd imagine having a remote coding partner who has access to multiple AI tools and knows which one to use for each situation.

## Beyond Remote Access: Other OpenCode Features

While remote access is what changed my workflow, OpenCode has other compelling features worth mentioning.

### Model Context Protocol (MCP) Support

OpenCode has excellent support for MCP, Anthropic's standard for connecting AI to external tools and data sources. This means you can extend OpenCode with:

- **File system access** for deep codebase understanding
- **Database connections** for query generation and analysis
- **GitHub integration** for PR reviews and issue management
- **Custom tools** specific to your workflow

Example configuration:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### Agent System

OpenCode uses an agent-based architecture internally. While you interact through the TUI rather than specific CLI commands for each action, understanding the agent system helps you get better results:

- **Context-aware reasoning** - Agents understand your project structure
- **Multi-step planning** - Break complex tasks into manageable steps
- **Tool use** - Agents can edit files, run commands, search codebases
- **Verification** - Built-in testing and validation of changes

### Provider Flexibility

OpenCode supports 75+ LLM providers, including:
- **Major providers:** OpenAI, Anthropic, Google Gemini
- **Open-source models:** via Ollama, LM Studio
- **Specialized providers:** Groq, Together AI, Perplexity
- **Local models:** Complete offline development

Switch providers based on task requirements:
- Claude for complex reasoning
- GPT-4 for broad knowledge
- DeepSeek for code-specific tasks
- Local Llama for privacy-sensitive work

### GitHub Actions Integration

You can run OpenCode in CI/CD pipelines:

```yaml
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

This gives you automated code reviews, test generation, documentation updates, and more—all integrated into your existing workflow.

## What OpenCode Is (and Isn't)

### OpenCode IS:
- ✅ A flexible AI coding assistant with server/client architecture
- ✅ Provider-agnostic (supports 75+ LLM providers)
- ✅ **Integrates with existing AI subscriptions** (GitHub Copilot Pro, Claude Pro, ChatGPT Plus/Pro via OAuth)
- ✅ Self-hostable with full control over infrastructure
- ✅ Accessible from multiple devices on your network
- ✅ Excellent for asynchronous, long-running coding tasks
- ✅ Extensible via MCP and custom integrations
- ✅ Open source with 77,700+ GitHub stars

### OpenCode IS NOT:
- ❌ An IDE (it's a coding assistant that integrates with any editor)
- ❌ Limited to CLI commands—most interaction happens in the TUI
- ❌ Focused on real-time autocomplete (that's not its strength)
- ❌ A replacement for understanding code (it's an augmentation tool)

## The Freedom to Code on Your Terms

What I love most about OpenCode's server mode isn't just the technical capability—it's the **mental shift** it enables.

Before, my development workflow was bound by:
- Physical location (my desk)
- Single device (my laptop)
- Continuous attention (stay connected or lose progress)

Now, my workflow is:
- **Location-independent** - Work from anywhere on my network
- **Device-flexible** - Phone, tablet, laptop—whatever makes sense
- **Asynchronously productive** - Start tasks and come back when ready

This is especially valuable for:
- **Parents** who need to step away frequently
- **Remote workers** juggling multiple responsibilities
- **Side project enthusiasts** who code in spare moments
- **Anyone** who values flexibility over rigidity

## Getting Started Today

If you're intrigued by this workflow, here's how to start:

1. **Install OpenCode** on a machine that can stay running
2. **Start the server** with `opencode serve --port 8080 --hostname 0.0.0.0`
3. **Connect from another device** and try a simple task
4. **Experience the freedom** of asynchronous coding

You don't have to commit fully. Run the server when you want this workflow, use local OpenCode when you don't. It's designed to fit into your existing process, not replace it entirely.

## Conclusion: The Future of Flexible Development

AI coding assistants are powerful, but most are still designed around traditional assumptions: you're at your desk, on one machine, fully attentive. OpenCode questions those assumptions.

By embracing a server/client architecture, OpenCode enables a more flexible, asynchronous, multi-device workflow. Start a refactoring on your laptop, check progress on your phone, finish on your tablet. The AI server keeps working while you live your life.

This isn't just about remote access—it's about **freeing yourself from the constraints of synchronous, session-bound development**. It's about making AI assistance work for your schedule, your devices, your life.

If you're tired of being chained to your development machine, if you want to code on your own terms, give OpenCode a try. The personal remote development workflow might just change how you think about coding.

## Resources

- **GitHub Repository**: [github.com/anomalyco/opencode](https://github.com/anomalyco/opencode) (77,700+ stars)
- **Official Documentation**: [opencode.ai/docs](https://opencode.ai/docs)
- **Installation Guide**: [opencode.ai/docs/installation](https://opencode.ai/docs/installation)
- **Server Mode Docs**: [opencode.ai/docs/server](https://opencode.ai/docs/server)
- **MCP Integration**: [modelcontextprotocol.io](https://modelcontextprotocol.io)

---

*Have you tried remote AI coding workflows? What's holding you back from untethering from your desk? I'd love to hear your thoughts on flexible development setups.*
