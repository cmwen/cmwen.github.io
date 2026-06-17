---
title: "OpenAI Codex and the Build-vs-Buy Question for Coding Agents"
description: "After building my own Copilot CLI control plane with tmux, Tailscale, and a PWA, Codex made me rethink what developers should build themselves and what they should adopt from an opinionated platform."
lang: "en"
author: "Min Wen"
pubDatetime: 2026-06-17T00:00:00Z
modDatetime: 2026-06-17T00:00:00Z
tags: ["ai", "codex", "copilot", "developer-experience", "coding-agents"]
featured: true
draft: false
slug: openai-codex-build-vs-buy-coding-agents
baseSlug: openai-codex-build-vs-buy-coding-agents
llmKeyIdeas:
  [
    "OpenAI Codex",
    "build versus buy for coding agents",
    "personal agent control plane",
    "remote coding workflow",
    "developer ecosystem lock-in",
  ]
---

I had an odd feeling today.

For the last few months I have been building my own control plane around GitHub Copilot CLI. The architecture is simple: run the agent in a `tmux` session, keep it alive on a machine I trust, expose a small PWA over Tailscale, and use the browser as the remote interface. It has made me genuinely happy because it changes the ergonomics of coding work. I can open a browser from another device, give the agent instructions, check progress, and step back in only when a decision is needed.

That system was not just a toy. It solved a real problem for me: how to make coding agents feel reachable without keeping myself physically attached to the terminal.

Then I installed OpenAI Codex on my laptop, inside my WSL setup, and the question became uncomfortable very quickly.

Codex already does much of what I was trying to build.

It can run as a local coding agent, work with the project filesystem, keep sessions and approvals visible, connect to remote hosts, expose a remote-control workflow, and, with the app surfaces and computer-use features, reach beyond the terminal into desktop workflows. OpenAI's [Codex overview](https://developers.openai.com/codex/overview) frames Codex as a coding agent for writing, understanding, reviewing, debugging, and automating development tasks. The [CLI docs](https://developers.openai.com/codex/cli/features) describe interactive sessions, resumable conversations, remote app-server connections, approval modes, and scripting. The [remote connection docs](https://developers.openai.com/codex/remote-connections) describe using Codex from another device while the connected host provides the projects, files, shell, plugins, browser setup, and local tools.

In other words, the thing I was building as a personal control plane is becoming a product surface.

## Table of contents

## The system I built was teaching me a requirement

My Copilot control plane started from a practical frustration. I did not want every agent task to require me to sit in front of the same machine.

The workflow I wanted was:

1. Start a coding task from anywhere.
2. Let the work run on a trusted desktop or dev machine.
3. Keep the terminal session alive even if my browser disconnects.
4. Review output, intervene, and continue later.
5. Avoid exposing a public service just to control my own tools.

`tmux` solved session persistence. Tailscale solved private access. A PWA solved the user interface. Copilot CLI did the actual coding work.

Looking back, the important part was not the implementation. The important part was the requirement I discovered: I do not want a coding assistant that only lives in the foreground terminal. I want an agent runtime that can stay close to my development environment while I move between devices.

That requirement is now obvious, but it was not obvious until I built it.

## Why Codex felt like a shock

Codex changes the question because it does not only offer a model. It offers an opinionated operating surface for agentic development.

That surface includes a few things that are painful to maintain alone:

- session transcripts and resumability
- repository-aware edits and command execution
- approval modes and sandbox boundaries
- remote control from another device
- app, CLI, IDE, cloud, browser, and computer-use surfaces
- plugin and MCP integration points
- a security model that is at least designed as a first-class product concern

Any one of these is buildable. The hard part is making all of them coherent.

My own system can keep a `tmux` session alive and stream a terminal through a browser. That is useful. But a product like Codex is trying to own the whole loop: prompt, plan, edit, run commands, ask for approval, use tools, summarize progress, preserve context, and let me continue from another device.

That is a larger ambition than my PWA.

## The lock-in question is real

The uncomfortable part is ecosystem lock-in.

If I move my workflow fully into Codex, I am not only choosing a better interface. I am choosing a set of assumptions:

- how sessions are stored
- how approvals are modeled
- how tools and plugins are exposed
- how remote control is authenticated
- how computer use is allowed or denied
- how much workflow state lives inside OpenAI's ecosystem
- how future features are prioritized

That may be a good trade. It may even be the right trade for most developers. But it is still a trade.

The risk is not just "vendor lock-in" in the abstract. The real risk is that my personal development workflow becomes shaped by the product's defaults. The product will improve quickly, but it will improve in the direction that makes sense for the platform. My own rough local system improves only when I care enough to change it, but it can move in exactly the direction I want.

That is the tension.

## The build-vs-buy line has moved

I used to think the useful middle layer was the personal orchestrator: a small web app, a durable terminal session, and a private network.

Now I think that layer is being commoditized.

Remote control, session persistence, approval prompts, command execution, diffs, browser access, and desktop automation are becoming expected features of serious coding-agent products. Building those from scratch is still fun, but it is less obviously the highest-value place to spend time.

The build-vs-buy line has moved upward.

I should probably not compete with OpenAI on the generic agent runtime. That is a hard long-term race: security, UX, integrations, platform support, model routing, app distribution, admin controls, and documentation all compound. A personal project can move fast, but a product platform can make the default experience dramatically better over time.

But that does not mean my system should die.

It means I should change what it is for.

## What I would still build myself

There are parts of the workflow that are still worth owning.

I would still build local tools for:

- encoding my own task templates and review habits
- keeping vendor-neutral logs of important decisions
- bridging between Copilot, Codex, shell scripts, and internal tools
- experimenting with queueing, labels, priorities, and task dashboards
- creating a fallback path when a platform feature is unavailable
- shaping prompts and handoff formats around my own engineering process

That is a different mission from "rebuild Codex."

The local system becomes a lab and an adapter. It does not need to own every terminal interaction. It can sit above or beside the agent products and preserve the workflow logic I care about.

In practice, that might mean Codex becomes the default execution surface, while my own PWA becomes the place where I design tasks, track outcomes, compare agents, and store reusable patterns. The agent product does the heavy lifting. My system keeps the workflow portable.

## My current answer

If I had to decide today, I would not choose only one side.

I would use Codex for the agent runtime and remote-control experience where it is already strong. It is too useful to ignore, and the product is clearly moving toward the same future I was trying to approximate with `tmux`, Tailscale, and a browser.

But I would keep my local system alive in a narrower role.

The right question is not "Should I use Codex or my own orchestrator?" The better question is "Which layer should I own?"

I do not need to own the commodity parts forever. I do want to own the parts that encode my working style:

- how I describe tasks
- how I decide whether work is done
- how I preserve context across tools
- how I review agent output
- how I avoid getting trapped in one product's mental model

That is the layer where a personal system still matters.

## The broader developer lesson

This is going to become a common problem for developers.

The first instinct of a builder is to build the missing thing. That instinct is good. It teaches you the domain. It reveals real requirements. It gives you taste. But once a platform absorbs the same capability, the responsible move is to reassess.

Not every custom system deserves to become infrastructure.

Sometimes the prototype should become a product.
Sometimes it should become a plugin.
Sometimes it should become a workflow convention.
Sometimes it should simply become experience.

For coding agents, I think the durable skill is not knowing how to wrap a CLI in a web app. The durable skill is knowing where human judgment, local context, and platform automation should meet.

Codex makes that question sharper. It gives me a stronger default than I had yesterday. It also reminds me that owning the whole stack is not the same as owning the most important part of the workflow.

For now, my answer is simple: adopt the product where it is better, keep the local system where it preserves leverage, and keep moving the boundary as the tools improve.

That feels like a healthier response than either clinging to my own system out of pride or handing over the whole workflow without thinking.
