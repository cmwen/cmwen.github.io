---
lang: "en"
title: "The 2025 Field Guide to Customizing Copilot in VS Code"
author: "Min Wen"
description: "A practical decision framework for when to use instructions, prompt files, custom agents, agent skills, and MCP servers—so Copilot stays consistent, safe, and useful across your day job."
pubDatetime: 2025-12-22T10:01:24.000Z
slug: the-2025-field-guide-to-customizing-copilot-in-vs-code
tags:
  [
    "GitHub Copilot",
    "VS Code",
    "Coding Agents",
    "MCP",
    "Developer Productivity",
  ]
featured: true
draft: false
llmKeyIdeas:
  [
    "instructions vs prompts choice",
    "repo vs profile scope",
    "agent tool boundaries",
    "MCP trust checklist",
    "reduce configuration drift",
    "day job recipes",
  ]
---

# The 2025 Field Guide to Customizing Copilot in VS Code

If you’ve been using GitHub Copilot for a while, you’ve probably felt the _configuration explosion_.

There’s more than one way to “teach Copilot” now:

- Repo instructions (project conventions)
- Path-scoped rules (different rules for different folders)
- Prompt files (reusable “commands” you run on demand)
- Custom agents (roles with boundaries and handoffs)
- Agent skills (capability packs for specialized work)
- MCP servers (tools that let the agent do things, not just say things)

That’s great—until it isn’t.

If your team doesn’t pick a mental model, you get:

- Agents that behave differently per repo
- Prompt sprawl (dozens of prompts, none discoverable)
- Conflicting guidance (“follow the style guide” vs “ignore style guides”)
- Tool sprawl (MCP servers everywhere, unclear trust boundary)

This post is a pragmatic field guide: a decision framework, a few recipes, and anti-patterns to avoid.

## The one-sentence mental model

Use the _smallest_ customization surface that matches the **scope** (me vs team), **lifetime** (one-off vs durable), and **risk** (read-only vs write/deploy).

In practice:

- **Instructions** set the _rules of the road_.
- **Prompt files** are _repeatable moves_ you trigger.
- **Custom agents** are _roles with boundaries_.
- **Skills** are _domain capability modules_.
- **MCP servers** are _the hands_.

## The five customization surfaces (what they’re really for)

### 1) Instructions: guardrails and shared context

**Use when** you want consistency across many interactions.

Examples of what belongs here:

- How to build, test, and lint the repo
- Architecture constraints (e.g., “keep React components client-only unless necessary”)
- Style conventions (naming, file layout, preferred patterns)
- Safety rules (no secret printing, don’t change unrelated code)

Most teams benefit from keeping instructions _boring and stable_.

In a modern Copilot setup, you’ll usually see a combination of:

- A repo-wide instruction file (team-wide defaults)
- Path-scoped instruction files (folder-level rules)
- An agent-oriented instruction file (how agents should operate in this repo)

Key principle: **instructions should not be your workflow**. They’re the constraints and context, not the playbook.

### 2) Prompt files: reusable “commands” for your day job

**Use when** you do the same thing repeatedly and you want a consistent output format.

Prompt files are great for:

- Writing a PR description from a diff
- Generating a test plan from a feature spec
- Drafting a migration checklist
- Summarizing a bug investigation

A good prompt file has:

- A crisp input contract (what you paste in)
- A crisp output contract (what the assistant must produce)
- Minimal reliance on hidden context

Think of prompt files as the equivalent of a shell alias: fast, repeatable, and intentionally narrow.

### 3) Custom agents: roles with boundaries, tools, and handoffs

**Use when** the task benefits from a _persona with constraints_.

Examples:

- A **researcher** that only fetches and summarizes (no code edits)
- A **reviewer** that critiques diffs and looks for edge cases
- A **test writer** that focuses on coverage and failure modes
- A **release helper** that follows a repeatable checklist

The biggest win from custom agents isn’t “better prompts”—it’s **boundary-setting**.

If your agent can do everything, it will.

If your agent can only do a few things, it becomes predictable.

### 4) Agent skills: portable capability packs

**Use when** you need specialized rules _sometimes_, and you don’t want them always loaded into every chat.

Skills shine for:

- Translation rules (tone, glossary, frontmatter transformations)
- Podcast generation steps (transcript preference, CLI commands, output validation)
- Security reviews (threat modeling checklist)

A good skill is:

- Domain-specific
- Reusable across repos
- Easy to invoke when needed

If prompt files are “commands” and agents are “roles,” skills are closer to **modules**.

### 5) MCP servers: tools that turn words into actions

**Use when** you want the assistant to _do things_:

- Query a service
- Search external systems
- Interact with a browser automation surface
- Read resources beyond the repo

MCP (Model Context Protocol) is powerful because it makes tools composable.

But that power comes with a simple trade-off:

- More tools = more leverage
- More tools = more risk

So MCP isn’t where you start. It’s what you add when you already know your workflow.

## A quick decision matrix

Use this table as a default choice. When in doubt, pick the smaller surface.

| You want to…                                  | Best tool                | Why                                      |
| --------------------------------------------- | ------------------------ | ---------------------------------------- |
| Make Copilot follow repo conventions          | Instructions             | Durable guardrails that apply everywhere |
| Apply different rules to `/docs` vs `/src`    | Path-scoped instructions | Local rules, less conflict               |
| Repeat a task weekly with the same format     | Prompt file              | Predictable input/output contract        |
| Create a “research-only” helper               | Custom agent             | Role boundaries + tool restrictions      |
| Create a multi-step workflow with checkpoints | Custom agent + handoffs  | Explicit transitions, human gates        |
| Load specialized domain rules sometimes       | Skill                    | On-demand specialization                 |
| Let Copilot operate external tools            | MCP server               | Tool execution beyond text               |

## The “two scopes” rule: repo vs profile

One of the easiest ways to reduce chaos is to separate **team-shared** from **personal**.

### Put team rules in the repo

If it should be true for _every_ developer working on the repo, it belongs in the repository:

- How to run tests and build
- Design constraints
- Naming conventions
- What “done” means

If your repo is open source or used by many contributors, repo-level instructions also act as **documentation**.

### Put personal accelerators in your profile

If it’s about _how you work_ rather than how the repo works, keep it personal:

- Your preferred “debug checklist” prompt
- Your note-taking or summarization style
- Your personal agents (rubber duck, explainer)

This keeps your team’s repo clean and makes it easier to collaborate.

## Day-job recipes

These are common scenarios where people overbuild. Here’s a simple default approach.

### Recipe 1: “Copilot keeps forgetting project structure”

- Add (or refine) repo instructions to include:
  - Build/test commands
  - Key folders and their intent
  - Style conventions
- Add path-scoped rules only if different folders _genuinely_ require different behavior.

Avoid: writing a massive prompt with every convention you can think of.

### Recipe 2: “I do the same refactor every sprint”

- Create a prompt file that:
  - asks for the exact input you provide (diff, file list, or function)
  - outputs a checklist and a proposed patch plan

Avoid: creating a custom agent if the work is a single repeated move.

### Recipe 3: “I want safer reviews”

- Create a reviewer agent that:
  - focuses on risk, tests, edge cases
  - is constrained to read-only tools (or no tools)
  - produces a consistent review format

Avoid: mixing reviewer and implementer in the same agent.

### Recipe 4: “I want the agent to touch external systems”

- Add MCP only after you’ve defined:
  - which systems are in scope
  - what read/write boundaries exist
  - what actions require explicit approval

Avoid: enabling everything and hoping the approval prompts save you.

## Anti-patterns (things that look helpful but create pain)

### 1) Treating instructions as a dumping ground

If instructions contain _too much workflow_, they become unmaintainable.

Instructions should be:

- Stable
- Consistent
- Low entropy

Move repeatable procedures into prompt files or agent workflows.

### 2) Creating an agent for every task

If you create 15 agents, no one remembers which one to use.

Start with:

- 1–2 durable agents (e.g., reviewer, researcher)
- a small set of prompt files for the most repeated actions

### 3) Conflicting rules across layers

If repo instructions say one thing and a personal profile says another, your output becomes unpredictable.

Rule of thumb: **one concern, one source of truth**.

### 4) MCP tool sprawl without a trust model

Tools are power.

If you don’t define tool trust boundaries, you end up with:

- “approve fatigue” (clicking approve without reading)
- accidental writes to the wrong environment
- confusing failures and unclear ownership

## A lightweight safety checklist for MCP

If you’re adding MCP servers, keep it simple:

- **Least privilege**: prefer read-only tools by default
- **Separate by risk**: research tools vs write/deploy tools
- **Human checkpoints**: require explicit approval for destructive actions
- **Reviewable artifacts**: prefer workflows that produce diffs, logs, or summaries

You don’t need a heavyweight security program—just a few habits that scale.

## A quick starting kit (what I’d actually set up first)

If you want a practical default:

1. **Repo instructions**: short, stable, focused on build/test and conventions.
2. **One reviewer agent**: consistent review format, minimal tools.
3. **Three prompt files**:
   - “summarize changes + risks + tests”
   - “draft PR description”
   - “write test plan”
4. **MCP last**: add only when it unlocks a repeatable workflow.

## Closing thought: configuration is part of engineering now

The biggest shift in 2025 isn’t that Copilot can write more code.

It’s that _we_ now shape how the assistant behaves—through layers of instructions, prompts, roles, and tools.

If you treat those layers like production code (clear ownership, small scope, no conflicts), Copilot stops feeling random and starts feeling like a reliable teammate.
