---
title: "AGENTS.md: A New Standard for Unified Coding Agent Instructions"
description: "Learn about AGENTS.md, the new open standard for providing instructions to coding agents, and how it can help you streamline your development workflow."
pubDatetime: 2025-09-13T19:28:00.000Z
author: "Min Wen"
llmKeyIdeas:
  - "What is AGENTS.md?"
  - "Problems with multiple agent instruction files"
  - "Benefits of a unified standard"
  - "How to use AGENTS.md"
  - "Which companies support AGENTS.md"
tags:
  - agents
  - ai
  - standards
  - development
slug: agents-md-a-new-standard-for-unified-coding-agent-instructions
featured: true
---

If you're a developer who uses multiple AI coding assistants, you've likely encountered a common frustration: managing a growing collection of instruction files. Each agent, from GitHub Copilot to Claude, often requires its own specific configuration file, leading to a cluttered project root and a maintenance headache.

Files like `.github/copilot-instructions.md`, `claude.md`, `gemini.md`, and `.cursor/rules` all serve a similar purpose—to guide the behavior of AI agents—but their different names and locations create unnecessary complexity.

## The Rise of a Unified Standard: AGENTS.md

To address this fragmentation, a new open standard has emerged: [`AGENTS.md`](https://agents.md/). Spearheaded by a collaboration of industry leaders including Google, OpenAI, and Sourcegraph, `AGENTS.md` aims to provide a single, unified file for instructing coding agents.

Think of it as a `README.md` for AI. While `README.md` is for humans, providing project overviews and setup instructions, `AGENTS.md` is for agents, offering detailed guidance on:

- **Development Environment:** Specific commands for setting up and running the project.
- **Build and Test Procedures:** Instructions on how to build the software and run tests.
- **Code Style and Conventions:** Guidelines to ensure generated code aligns with the project's standards.
- **Security Considerations:** Important security protocols and practices to follow.

## Who Supports AGENTS.md?

The `AGENTS.md` standard is supported by a growing ecosystem of AI coding agents and tools, including:

- Aider
- Amp
- Cursor
- Devin
- Factory
- Gemini CLI
- GitHub Copilot
- Jules
- Kilo Code
- Ona
- OpenAI Codex
- opencode
- Phoenix
- RooCode
- Semgrep
- VS Code
- Warp
- Zed

## Why Adopt AGENTS.md?

Adopting `AGENTS.md` offers several key benefits:

- **Simplicity:** A single, standardized file reduces clutter and simplifies project configuration.
- **Consistency:** Ensures that all coding agents receive the same instructions, leading to more consistent and predictable behavior.
- **Portability:** Makes it easier to switch between different coding assistants without having to rewrite or duplicate instruction files.
- **Collaboration:** A shared standard makes it easier for teams to collaborate on agent instructions.

## How to Get Started

Getting started with `AGENTS.md` is straightforward. Simply create an `AGENTS.md` file in the root of your project and populate it with the necessary instructions. If you already have existing instruction files, you can consolidate them into your new `AGENTS.md` file and remove the old ones.

By adopting `AGENTS.md`, you can spend less time managing configuration files and more time building great software.
