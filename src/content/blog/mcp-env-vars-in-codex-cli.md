---
title: "Codex CLI MCP Environment Variables: Lessons from the Sandbox"
description: "Why Codex CLI MCP servers need explicit environment variable configuration and how sandboxed runtimes differ from your local shell."
pubDatetime: 2025-10-14T00:00:00.000Z
slug: mcp-env-vars-in-codex-cli
baseSlug: mcp-env-vars-in-codex-cli
featured: false
tags:
  - OpenAI Codex
  - MCP
  - Developer Experience
  - CLI
llmKeyIdeas:
  - "Sandboxed MCP servers ignore shell environment variables"
  - "Codex CLI and Codex CLI MCP setup best practices"
  - "Explicit configuration beats implicit shell inheritance"
---

# Codex CLI MCP Environment Variables: Lessons from the Sandbox

I ran straight into a gotcha while wiring Codex CLI to a local MCP knowledge base: the server spun up perfectly, but every request failed because the credentials I exported in my shell session were invisible to the MCP runtime. It turns out Codex CLI can launch MCP servers from a completely different sandbox than your terminal—exactly like the Codex CLI harness you are reading this in. If the server expects environment variables for secrets or configuration, you must pass them explicitly.

## The Sandbox Surprise

- The Codex CLI process that accepts your prompts is not always the same process that launches the MCP binary. When you toggle approval modes or run inside managed agents, Codex spawns workers in isolated sandboxes with a minimal environment.
- Those workers inherit only a tight allowlist of variables (think `PATH`, `HOME`, or tool-specific tokens). Anything you exported in `.zshrc` or a one-off `export` never makes it across the boundary.
- Because the MCP protocol starts quickly and fails silently on missing config, it is easy to blame the server instead of the environment handoff.

## How Codex CLI Boots MCP Servers

Codex CLI reads `mcpServers` entries from its configuration file and launches each server according to that spec. In danger-full-access mode it may call the binary directly; in more restricted modes it can wrap the command inside a sandbox. Either way, Codex builds a fresh environment for the child process. Unless you tell it otherwise, the only variables available are the ones Codex injects.

That behavior is deliberate: it keeps remote agents reproducible, avoids leaking host machine secrets, and makes approval policies enforceable. The trade-off is that implicit shell state disappears.

## Make Environment Variables Explicit

Treat the MCP entry as the single source of truth for configuration:

```jsonc
{
  "mcpServers": {
    "kb": {
      "command": "npx",
      "args": ["@cmwen/min-kb-mcp", "serve"],
      "env": {
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}",
        "MCP_LOG_LEVEL": "debug",
        "WORKSPACE_ROOT": "/Users/cmwen/dev/cmwen.github.io",
      },
    },
  },
}
```

- `env` is a plain key→value map that Codex injects into the server process.
- `${env:VAR_NAME}` pulls from the host environment when available, making it easy to reuse secrets without hardcoding.
- Falling back to literal strings keeps defaults predictable across machines.

## Workflow Tips

- **Document the contract.** List every required variable in your MCP README so future you (or collaborators) know exactly what to set.
- **Check from inside the server.** Add a diagnostic command or log statement that prints `process.env` keys on startup; verify the values are arriving before debugging business logic.
- **Keep secrets in the setup step.** If you provision Codex agents through automation, feed the variables during that setup instead of assuming the agent inherits them later.
- **Mirror production.** The GitHub MCP bridge and Codex Remote Agents behave the same way. If it works locally with explicit env mappings, it will work in the cloud.

## Key Takeaways

- Sandboxed MCP servers ignore ad-hoc shell exports—configuration must live in the Codex setup.
- Explicit `env` blocks prevent “works on my machine” bugs when switching approval policies or remote agents.
- Verifying environment variables early saves hours of chasing phantom failures in otherwise healthy MCP servers.
