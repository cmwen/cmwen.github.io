---
lang: "en"
title: "Building a Copilot Control Plane with Tmux and Tailscale"
description: "How I wrapped Copilot CLI in a small desktop-hosted web app so I can delegate coding tasks from my phone without giving up control."
author: "Min Wen"
pubDatetime: 2026-03-21T20:32:32Z
tags: ["ai", "copilot", "tmux", "tailscale", "developer-experience"]
featured: false
draft: false
slug: "building-a-copilot-control-plane-with-tmux-and-tailscale"
baseSlug: "building-a-copilot-control-plane-with-tmux-and-tailscale"
llmKeyIdeas:
  [
    "Copilot control plane",
    "tmux session persistence",
    "Tailscale private access",
    "mobile task delegation",
    "human-in-the-loop coding",
  ]
---

I have been experimenting with a simple idea that feels surprisingly powerful: keep Copilot CLI doing the actual work, but move the control surface somewhere else.

Instead of sitting in front of my laptop and babysitting every task, I run the agent on my desktop inside `tmux`, wrap that in a small web app, and connect to it over Tailscale. The result is not a fully autonomous coding system, and it is not a traditional local terminal workflow either. It is something in between: a personal control plane for coding tasks.

That middle ground is what I wanted.

## Table of contents

## Why I Built It

My day-to-day workflow has a pattern. I often know exactly what needs to happen, but I do not want to stay glued to the machine while it happens. A refactor may take 15 minutes. A test fix may take 20. A documentation sweep may take even longer if I want the agent to inspect multiple files.

The old workflow looked like this:

1. Open the laptop.
2. Start the CLI.
3. Wait.
4. Monitor progress.
5. Repeat.

That works, but it keeps me tethered to one device and one location. It also creates a false sense that I need to be present for every minute of the task.

What I really wanted was:

1. Queue a task from anywhere.
2. Let the agent run on my desktop.
3. Check progress from my phone or tablet.
4. Step back in only when a decision is needed.

That is the reason I built the web app.

## The Architecture in Plain English

The setup is intentionally boring:

- `tmux` keeps terminal sessions alive even if I disconnect.
- My desktop runs the agent and the supporting shell environment.
- A small web app acts as the task manager.
- Tailscale gives me private network access without exposing the machine directly to the public internet.

Conceptually, it looks like this:

```text
Phone / Tablet / Laptop
        |
     Tailscale
        |
   Desktop Web App
        |
      tmux
        |
   Copilot CLI session
```

The desktop does the heavy lifting. The browser is just the control panel.

That separation matters. When the agent is tied to the same terminal window I am using, I end up treating it like an interactive chat. When it runs behind a small dashboard, it starts to feel more like a job queue.

## Why tmux Is the Unsung Hero

`tmux` is not flashy, but it solves a real problem: terminal sessions die when the connection dies. If I close a shell or lose my SSH session, I do not want the task to vanish with it.

With `tmux`, I can detach from a session, walk away, and come back later. That makes it a natural fit for long-running coding work:

- running tests that take time
- applying a multi-file refactor
- inspecting logs or command output
- waiting for the agent to finish a sequence of edits

`tmux` also gives me a clean boundary. Each task gets its own session, so I can keep one refactor isolated from another. That has been more useful than I expected. It reduces accidental interference and makes it easier to review what happened after the fact.

## Why Tailscale Makes the Whole Thing Feel Safe

I did not want to expose the web app directly to the open internet. That would add more security work than I wanted for a personal project.

Tailscale gives me a simpler model: the app is reachable only within my private network. That means I can open the dashboard on my phone while I am away from my desk, but I am not publishing a public service just to drive my own coding workflow.

For a personal control plane, that is the sweet spot.

It is also psychologically useful. I know the app is reachable only by my devices, which makes me more comfortable using it for real tasks instead of treating it like a toy.

## The Balance I Was Looking For

I keep thinking about this as a balance between two extremes.

On one end is the fully manual Copilot CLI workflow: I sit at the machine, issue a command, and stay close while the task runs. That gives me maximum control, but it also demands my attention.

On the other end is the fully autonomous agent vision: I hand over a goal and expect the system to run with very little supervision. That is exciting, but it can be too much autonomy for tasks where I want to steer the direction as things unfold.

My control plane sits in the middle.

It lets me delegate without disappearing. I can check progress, interrupt when something looks off, and continue later from another device. I still need to think, review, and make decisions. But I no longer need to physically remain at the keyboard for every minute of the process.

That feels like the right amount of abstraction for where these tools are today.

## What Changed in My Workflow

The biggest change is not speed. It is distance.

I am farther away from the mechanics of the task, but closer to the workflow as a whole. I spend less time staring at a terminal and more time deciding what should happen next.

That shift shows up in small ways:

- I start work from my desk, then continue from my phone.
- I let the agent process routine edits while I handle something else.
- I come back to a session with enough context to review, not enough noise to get lost.
- I think in terms of tasks and outcomes instead of shell windows.

This is the part that surprised me most. Once the control plane exists, the laptop stops feeling like the center of the universe. It becomes just one client among several.

## Why This Feels Like a Good Direction

I do not think every developer needs to build their own agent dashboard. Some people will be perfectly happy living inside a terminal, and others will prefer a fully managed product with much stronger automation.

But for people who like to tinker, this middle layer is compelling. It is lightweight, personal, and easy to evolve. I can add queues, task labels, session history, better summaries, or more structured prompts as I learn what actually helps.

That is the part I like most: the system is already useful, but it is still open-ended.

I am not trying to replace the human in the loop. I am trying to make the loop easier to live with.

And so far, that has been enough to make the project genuinely fun.
