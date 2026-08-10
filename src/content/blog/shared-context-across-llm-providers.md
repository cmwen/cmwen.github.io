---
title: "A Shared Context Layer for Multiple LLM Providers"
description: "Use plugins and a shared file store to carry deliberate context between LLM providers—and between cloud chats and local coding agents."
lang: "en"
author: "Min Wen"
pubDatetime: 2026-08-11T00:00:00+10:00
featured: false
draft: false
baseSlug: "shared-context-across-llm-providers"
tags: ["ai", "llm", "plugins", "knowledge-management", "coding-agents"]
llmKeyIdeas:
  [
    "plugins can connect different LLM providers to a shared context store",
    "a concise Markdown handoff is more portable than a raw chat transcript",
    "explicit save and pickup prompts preserve user control",
    "the same pattern works for local coding agents and cloud-synced folders",
    "shared context needs provenance permissions and deliberate cleanup",
  ]
---

I regularly move between LLM providers. I might start an idea in ChatGPT, continue it in Gemini, and return to ChatGPT later. Sometimes the reason is practical: I have used up one provider's credits, or another provider has a better model or a more useful plugin for the task.

The awkward part is the handover. Each provider has its own conversation history, memory, tools, and context window. Copying an entire transcript is noisy, expensive, and often impossible. The useful information is usually much smaller: what we are trying to do, what we already decided, what remains uncertain, and what should happen next.

## Make the file store the bridge

Plugins make this possible without requiring every provider to speak directly to every other provider. If two LLM clients can access the same storage service, that service becomes a neutral handoff layer. Google Drive is one example, but the same pattern could use Dropbox, OneDrive, a Git repository, a shared database, or a local folder synchronised to the cloud.

The workflow is simple:

1. Ask the first LLM to summarise the conversation into a small Markdown handoff file.
2. Save that file in a predictable shared folder through its storage plugin.
3. Open the second LLM and ask it to read the latest handoff file before continuing.
4. Let the second LLM update the file when it makes new decisions or changes the plan.

For example, I might ask:

> Summarise this conversation into `ai-handoffs/project-name.md`. Include the goal, decisions, open questions, relevant files or links, constraints, and the next recommended action. Do not include secrets or the full transcript.

Then, in another provider:

> Read the latest `ai-handoffs/project-name.md` from the shared drive. Treat it as working context, identify anything stale, and continue from the next action. Update the file if the plan changes.

The result is not a magical universal memory. It is a deliberate, inspectable contract between two assistants. That is a feature. I can open the file, correct it, delete it, or keep separate handoffs for separate projects.

## Why Markdown works well

Markdown is portable, readable, diffable, and supported by almost every coding and writing tool. A useful handoff does not need to be complicated:

```markdown
# Project handoff

Updated: 2026-08-11
Status: exploring

## Goal

Describe the outcome we are trying to achieve.

## Decisions

- Record choices that should not be reconsidered without new evidence.

## Open questions

- Record uncertainties and who or what can resolve them.

## Useful context

- Links, filenames, constraints, and relevant source material.

## Next action

The smallest useful step for the next assistant or human.
```

The important property is compression with meaning. A handoff should preserve intent and state, not every conversational turn. It should also include provenance where it matters: which document, repository, or decision supports a claim, and when the information was last checked.

## Keep the knowledge yours

A shared context layer does not need to live permanently inside a vendor's workspace. It can be part of your personal knowledge base: a notes folder, a Markdown vault, a Git repository, or a storage system you control. A cloud-drive plugin can be the transport and synchronisation layer, but it should not be the only place where your knowledge exists.

Before choosing a storage service, ask whether you can export the original Markdown and its metadata, move it to another provider, read it without the plugin, and restore it from a backup. Who controls access, retention, and deletion? A convenient integration is useful; an open, portable source of truth is what protects you from vendor lock-in.

## The same pattern works for coding agents

This is not only a workaround for switching between ChatGPT and Gemini. Local coding agents can use the same shared folder. A coding harness can write `handoff.md`, `decisions.md`, `current-state.md`, or a short task brief into a directory that is synchronised to the cloud. Another agent—or another machine—can pick up the work from those files.

That creates a lightweight continuity layer across terminals, editors, cloud assistants, and local models. The agent still needs to be told to read the relevant file; the file does not automatically become part of its context. But the prompt becomes small and repeatable: “Read the current project handoff, inspect the repository, and continue from the stated next action.”

This is especially useful when a long-running task outlives one session. The conversation can end while the project state remains available. A new agent does not need to reconstruct the entire history before making progress.

## A few boundaries matter

Shared context should be treated as a working document, not an unfiltered memory dump. Avoid credentials, private keys, personal data, and anything the next provider should not see. Use a predictable naming scheme, include update times, and distinguish confirmed facts from guesses. For collaborative work, keep a record of which assistant or person made an important change.

Most importantly, make the handoff explicit. The user should decide what is worth carrying forward. Plugins provide the connection, but a small shared file provides the boundary. That boundary reduces the “hangover” of switching tools while keeping context portable, inspectable, and useful across providers.
