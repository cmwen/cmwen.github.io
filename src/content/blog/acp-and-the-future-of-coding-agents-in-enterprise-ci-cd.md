---
lang: "en"
title: "ACP and the Future of Coding Agents in Enterprise CI/CD"
author: "Min Wen"
description: "Why the Agent Client Protocol could become the standard way enterprise pipelines talk to coding agents, and why the CLI still makes architectural sense."
pubDatetime: 2026-03-20T22:42:37.181Z
slug: acp-and-the-future-of-coding-agents-in-enterprise-ci-cd
featured: true
draft: false
tags:
  [
    "Agent Client Protocol",
    "coding agents",
    "CI/CD",
    "enterprise automation",
    "CLI",
  ]
llmKeyIdeas:
  [
    "agent client protocol",
    "coding agent architecture",
    "cli control plane",
    "ci review pipeline",
    "protocol interoperability",
    "enterprise tool safety",
  ]
---

# ACP and the Future of Coding Agents in Enterprise CI/CD

The more I watch coding agents mature, the more I think the real bottleneck is no longer the model itself. It is the interface around the model.

That is why the Agent Client Protocol, or ACP, caught my attention. According to the official overview, ACP standardizes communication between code editors and coding agents, works for both local and remote scenarios, and borrows ideas from protocols like LSP and MCP where it can. That combination sounds small on paper, but it is the kind of plumbing that can quietly reshape an ecosystem.

If ACP succeeds, it may become to coding agents what LSP became to language tooling: a boring, interoperable layer that lets many different products work together without every integration being a one-off.

## What a coding agent really is

People sometimes talk about coding agents as if they are magical new software categories. In practice, they are more ordinary than that.

A coding agent is basically a wrapper around an LLM with guardrails, tools, and a workflow that helps the model understand context more efficiently. It is not just a chat box. It is the layer that decides what files the model can see, what tools it can call, what it should ignore, and when it should stop and ask for help.

That wrapper might include:

- repository-aware context gathering
- agent skills or task-specific prompts
- tool access through MCP servers or similar integrations
- safety checks, approval gates, and output shaping

All of those pieces make the agent better at code, but they do not change the core idea. The core is still a bridge from code to model.

That is also why the CLI makes sense.

## Why the CLI is the natural home for agents

The terminal is not glamorous, but it is an excellent control plane for software work. It already sits close to the code, the build system, the test runner, and the deployment scripts. A CLI agent can inspect files, run commands, and return structured output without needing a heavy UI layer in the middle.

For the agent itself, that is a huge advantage. The CLI is easy to script, easy to automate, and easy to compose with existing developer workflows. It is the shortest path between the codebase and the model.

That is why so many coding agents feel like terminal-first products. The interface is not the point; the agent loop is.

At the same time, the CLI is not the best experience for humans when the job is visual, collaborative, or stateful. Reviewers want diffs, timelines, explanations, and controls. Engineers want to see what happened, not just what the model said. That is where ACP becomes interesting. It gives the agent a standard protocol, while letting different clients decide how to present the experience.

## Why ACP matters more in enterprise than in hobby projects

The enterprise case is where ACP starts to look genuinely strategic.

Enterprise CI/CD pipelines are full of repetitive, policy-heavy decisions. A build passes or fails. A diff touches risky files. A dependency changes behavior. A release needs a second set of eyes. Today, teams often solve those problems with custom scripts, custom bots, and custom glue code for each agent vendor.

That works until it does not.

The moment you want to swap one agent for another, or let an IDE client and a CI client share the same backend, all of that glue becomes technical debt. A standard protocol changes the shape of the problem. Instead of integrating with a vendor-specific API, your pipeline can speak to an ACP-compatible agent through a known contract.

That matters for three reasons:

1. **Interoperability**: teams can choose the editor or agent they prefer without rewriting the workflow.
2. **Governance**: the client can own the environment, permissions, and policy boundary.
3. **Portability**: the same agent logic can show up in a terminal, an IDE, or a machine-driven workflow.

The official ACP docs already frame clients as the interface between users and agents, with clients managing the environment, user interactions, and access to resources. That separation is exactly what enterprises need. You want the runtime to be powerful, but you also want the policy layer to remain visible and controllable.

## A CI/CD example: automated code review for the build

Imagine a pipeline that runs after a pull request build.

The pipeline does not just compile and test. It also asks an ACP-compatible coding agent to review the diff, inspect the test results, and summarize risk in a structured way. The agent can point out suspicious changes, missing tests, or migration concerns. It can return a review artifact, a checklist, or a recommendation to block merge.

That workflow is attractive because it does not require the pipeline to know the internals of the agent. It only needs to know the protocol.

In a mature setup, you could imagine different clients for different tasks:

- an IDE client for interactive development
- a review client for pull requests
- a CI client for automated checks
- an ops client for incident response or rollbacks

If those clients all speak ACP, the organization can standardize the agent contract while still allowing different interfaces for different humans and different machines.

That is the real promise here. Not “AI everywhere,” but “one protocol, many surfaces.”

## The enterprise upside: less integration chaos

Enterprise software often fails at the seams, not the core logic.

The model may be strong. The prompt may be clever. The problem is usually that every toolchain has its own assumptions about context, permissions, logging, and output shape. ACP is compelling because it tries to define those seams.

The official documentation also notes that ACP reuses JSON representations from MCP where possible, while adding custom types for agentic coding UX such as diffs. That is a good sign. It suggests the protocol is trying to be practical rather than theoretical. It is not inventing a new universe; it is making the existing one easier to connect.

For enterprise teams, that can translate into:

- fewer vendor-specific integrations
- more consistent policy enforcement
- easier replacement of agent backends
- cleaner audit trails for automated reviews

And yes, it also means less time spent building brittle wrappers around model endpoints.

## Why not just build your own coding agent?

You absolutely can.

In fact, many teams probably will. But building a coding agent is not just about calling an LLM. It is about tuning the tool loop, the guardrails, the context strategy, the output format, and the cost model. That is a lot of product work.

General-purpose terminal agents can be a useful proof of concept, but they also show the trade-offs. OpenCode is a good example of the terminal-first shape of the category, although its repository is now archived. That does not make the idea obsolete; it makes the lesson clearer. The agent implementation may change, but the need for a stable interface remains.

That is also where my one caution comes in. If you depend on a vendor-backed coding agent, you should pay close attention to billing behavior and model policy changes. Enterprise automation magnifies cost. A workflow that feels cheap in an interactive chat can become expensive if it runs on every build, every retry, and every pull request.

Protocols help with interoperability, but they do not magically solve pricing, quota, or governance. You still need budgeting, rate limits, and sensible defaults.

## The bigger idea

ACP feels important because it reframes the problem correctly.

The point is not that the CLI is bad. The point is that the CLI is good at being the bridge between code and the model, while the IDE and the machine are good at being clients. A protocol gives each layer a clear job.

If that sounds familiar, it is because software history keeps rewarding this pattern. Separate the contract from the implementation. Let tools specialize. Let clients innovate on UX. Let agents specialize on reasoning and code manipulation.

That is why I think ACP has a real shot at becoming the standard way we talk to coding agents programmatically, especially in enterprise CI/CD. If the protocol matures, it could do for agents what good infrastructure layers always do: make the exciting part possible by making the boring part dependable.

## References

- [Agent Client Protocol overview](https://agentclientprotocol.com/protocol/overview)
- [Agent Client Protocol introduction](https://agentclientprotocol.com/protocol/introduction)
- [OpenCode repository](https://github.com/opencode-ai/opencode)
