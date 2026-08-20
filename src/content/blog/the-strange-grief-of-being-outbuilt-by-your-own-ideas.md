---
title: "The Strange Grief of Being Outbuilt by Your Own Ideas"
description: "I built a remote coding-agent harness, a browser terminal, and a token-usage dashboard. Then Codex and T3 Code made me question what was worth owning."
lang: "en"
author: "Min Wen"
pubDatetime: 2026-08-20T00:00:00Z
modDatetime: 2026-08-20T00:00:00Z
tags:
  [
    "ai",
    "coding-agents",
    "codex",
    "t3-code",
    "open-source",
    "developer-experience",
  ]
featured: false
draft: false
slug: "the-strange-grief-of-being-outbuilt-by-your-own-ideas"
baseSlug: "the-strange-grief-of-being-outbuilt-by-your-own-ideas"
llmKeyIdeas:
  [
    "building a personal coding-agent harness",
    "remote coding with tmux and a browser",
    "browser-based terminal workflows",
    "tracking coding-agent token usage",
    "Codex and T3 Code",
    "the emotions of build versus buy",
  ]
---

I have been trying to name a feeling.

It is partly satisfaction. It is partly frustration. There is some pride in it, a little sadness, and a strange kind of relief.

Over the last few months, I built several small systems around coding agents. Each one started from a real annoyance in my workflow. I wanted to control a coding agent from my phone. I wanted to access my terminal from a browser. I wanted to understand how many tokens each task consumed.

I built those things because the tools I was using did not quite fit the way I wanted to work.

Then Codex became much better at the exact remote-development workflow I had been assembling. After that, I found [T3 Code](https://github.com/pingdotgg/t3code), an open-source agent harness control surface that brought together many of the same ideas.

My first reaction was: this is great.

My second reaction was: wait, I built all of that.

## I did not want to sit in front of my desk

The original problem was simple. I wanted to give a coding agent a task without being physically attached to my development machine.

The first version of my solution was a small web application built around the coding agent I was using at the time. It created and managed `tmux` sessions, ran the agent inside those sessions, and exposed a browser interface so I could control the work remotely.

The workflow looked roughly like this:

1. Open the web application from another device.
2. Create a new `tmux` session.
3. Start a coding-agent task on my development machine.
4. Send the initial prompt from my phone or browser.
5. Let the agent work while I walked away from the desk.

It worked surprisingly well.

The design was intentionally narrow. I was thinking of it as a one-off tool for a personal workflow, so I optimized for the first prompt and the handoff. Once I submitted the task, the agent could continue working in the background, and I could come back later to inspect the result.

The weakness was obvious in retrospect: interacting with the coding engine after the first prompt was difficult. If the agent asked a question, took a wrong turn, or needed a follow-up instruction, the web application did not give me a natural conversation surface. It was better at “start this job” than “work with me through this task.”

But that was okay for a while. It served its purpose. I could start a task from my phone, let it run on my machine, and return when I had time to review the changes.

I liked it more than I expected.

## Then I built a terminal for the browser

The first project taught me that remote control was useful, but it also exposed the deeper problem: the terminal itself was still the most flexible interface.

So I built another web service. This time, instead of wrapping a particular coding agent, I connected the browser directly to a terminal using `xterm.js` and a server-side shell process.

That changed the experience completely.

Once I could open a browser and interact with my actual terminal, I was no longer limited by the assumptions of the first web application. I could run commands, inspect files, start a new agent, attach to an existing `tmux` session, and use the same shell environment I used at my desk.

It also made the system feel more like my own computer. I could add aliases, shell shortcuts, custom commands, and little scripts. I could make the environment fit my habits instead of waiting for a product team to decide which actions deserved a button.

This was the part I found genuinely exciting. A browser terminal sounds like a small technical project, but it opens up a lot of possibilities. I could build my own shortcuts and control surfaces around it. I could create task launchers, custom status views, and commands for the odd little workflows that only make sense to me.

The terminal was no longer just a place where I typed commands. It became a programmable interface to my entire development environment.

## I also wanted to know what the work cost

There was another question behind all of this: usage.

Coding-agent subscriptions make the economics feel abstract. I have a subscription, a pool of credits or included usage, and a collection of tasks that may consume very different amounts of context and model time.

I wanted to understand my own behavior.

How much usage did a particular task consume? Which projects were expensive? Was a long planning session more costly than a focused implementation? Was I spending my allowance on useful work or on repeatedly re-explaining the same context?

So I built a small usage-monitoring application. It collected local usage information and presented it by task, with charts that helped me see where the tokens were going.

This was not only about saving money. It was about developing a mental model. Once coding agents become part of daily work, token usage starts to feel a little like electricity: invisible while the system is running, but worth measuring if you want to understand the shape of your consumption.

By this point, I had three separate systems:

- a remote coding-agent launcher
- a browser-based terminal
- a task-oriented token-usage dashboard

Each one was useful. None of them formed a coherent product.

## Then Codex arrived with the whole experience

When Codex became part of my workflow, I felt a jolt of recognition.

It gave me a polished interface for working with coding agents. I could control an agent on my development machine, use a terminal, connect from another device, and continue working from my phone. The experience was not exactly the same as my custom applications, but the direction was unmistakably familiar.

It was the workflow I had been trying to assemble:

- keep the agent close to the filesystem and development tools
- let the work continue on a machine at home
- connect through a better interface when I was away from the desk
- move between terminal, browser, and mobile surfaces
- preserve enough context to return later

Codex did not make my projects useless. It made them look smaller.

That distinction matters. The projects were never intended to compete with a major product. They were personal tools, built to answer questions about my own workflow. Still, it is emotionally difficult to spend time building a thing and then watch a polished product make the same problem look obvious.

There is also a practical tension. Codex is a proprietary product, and it can feel heavier than I need for some tasks. It is part of the OpenAI ecosystem, which brings integration and polish but also means accepting someone else’s decisions about the product’s direction. I like the features, but I do not always like the feeling of depending on a large platform for the shape of my development environment.

Sometimes it also feels like too much. The features keep expanding, the product keeps getting bigger, and the memory footprint can be noticeable on a project where I only wanted a straightforward coding session.

So I was happy to have it, while still wanting something smaller, more transparent, and more customizable.

## T3 Code made the feeling even stranger

That is where [T3 Code](https://github.com/pingdotgg/t3code) entered the picture.

T3 Code is not a new coding model. It is a control surface for coding-agent CLIs already installed on your machine. Its repository describes it as an open-source, remote-ready interface that can work with tools such as Codex, Claude Code, Cursor, Grok Build, and OpenCode.

That description immediately resonated with me because it was so close to the direction of my own experiments.

It had the terminal relationship I wanted. It could control agents using the subscriptions I already had. It had a web and desktop interface, mobile access, and a much more complete session model than my first application. It also had the open-source quality I was missing from Codex: if I dislike a behavior, at least there is a possibility of inspecting it, forking it, or changing it.

And it brought together ideas that I had left scattered across multiple projects.

This was the point where the emotion became difficult to describe.

I was not angry that someone had built a better tool. I was genuinely pleased. T3 Code was solving the problem in a way that made sense to me, and it was doing so with a level of integration I had not reached.

But I also felt frustrated. I had spent time building a remote launcher, a browser terminal, and a usage monitor. I had thought through the session model, the remote connection, the browser interaction, and the relationship between a task and its token cost.

Now a better integrated solution existed, and I might eventually stop using the things I had built.

It felt a little like writing a long essay about a product idea and then discovering that someone else had already shipped the product while you were still editing the introduction.

## What exactly am I mourning?

The obvious answer is time. I spent time building systems that may no longer be necessary.

But that is not quite right. The time was not wasted. I learned what I actually wanted by building the wrong-sized versions of it.

The first application taught me that remote work needs session persistence and a way to recover from disconnection. It also taught me that a one-shot prompt is not enough for every task.

The browser terminal taught me that the terminal is still a powerful abstraction. A graphical interface does not have to replace it; it can make it reachable and programmable from more places.

The usage dashboard taught me that observability is part of the user experience. If I cannot understand the cost of a task, I cannot make good decisions about how I use the tools.

Those lessons are more valuable to me than the code itself.

What I am really mourning is the idea that I might have been building something unique. It is humbling to realize that the core of my project was not a product category waiting for me to define it. It was a workflow that other people were also beginning to understand.

That is not failure. It is evidence that the problem was real.

## The part I still want to own

I do not think the answer is to keep rebuilding every feature just to protect my pride.

If T3 Code gives me a better agent-control experience, I should use it. If Codex is the best tool for a particular task, I should use that too. The goal is to get useful work done, not to preserve every line of infrastructure I have ever written.

But I also do not want to give up the parts of the workflow that are genuinely mine.

I still want to own:

- the way I define and queue tasks
- the conventions I use for prompts and handoffs
- the way I review agent output
- the metadata I keep about a task
- the usage history that helps me understand my habits
- the fallback paths between different agents and local tools

Those are not generic interface features. They are part of my working style.

The lesson may be that I should own the workflow layer rather than the whole agent runtime. Let the established tools handle sessions, permissions, terminals, and model integrations. Build around them where my own preferences create leverage.

That is a much smaller ambition, but it may be a more durable one.

## Building the thing was still the right decision

It is easy to look backward and think I should have waited. If I had known that Codex or T3 Code would eventually cover these use cases, I might have saved myself some effort.

But I would also have missed the most important part: understanding why I wanted these features in the first place.

Building my own harness forced me to answer practical questions:

- What does “remote coding” actually mean in daily use?
- When should a task be fire-and-forget, and when does it need a conversation?
- What should survive when a browser disconnects?
- Which terminal operations deserve a dedicated shortcut?
- How much usage visibility is enough to change behavior?

A product can give me answers to those questions, but building gave me intuition. It let me feel the rough edges instead of reading about them in a feature list.

That experience will stay useful even if I delete the applications later.

## A better definition of success

I used to measure the success of a personal project by whether I kept using the exact software I built.

I am starting to think that is too narrow.

Sometimes a project succeeds by becoming a daily tool. Sometimes it succeeds by revealing a requirement. Sometimes it succeeds by teaching you enough about a problem to recognize a good solution when it appears.

My projects did all three, at least for a while.

They let me work from my phone. They gave me a browser terminal that I genuinely enjoyed using. They made token consumption visible. And they prepared me to recognize why Codex and T3 Code felt so compelling when I encountered them.

The fact that I may eventually replace some of my code does not erase what it gave me.

## The feeling is still complicated

I am happy that better tools exist. I am grateful that someone else did the hard work of integrating the pieces. I am excited that T3 Code is open source and can be adapted if its defaults do not fit me.

I am also a little sad.

There is a particular kind of attachment that comes from building a tool for yourself. Even a rough tool contains your decisions, your frustrations, and the memory of the problem that made you start. Replacing it can feel less like upgrading software and more like admitting that a chapter is over.

Maybe that is why the feeling is so mixed. I am not mourning an unsuccessful project. I am mourning a successful experiment whose lessons have been absorbed by better products.

And perhaps that is a good ending for it.

I built these systems because I wanted coding agents to be available wherever I was. Now I have more choices than when I started: a proprietary product with deep integration, an open-source control surface, and the ability to keep building the pieces that still matter to me.

The goal was never to own every layer.

The goal was to make the work feel more accessible.

In that sense, the projects worked. Even if I eventually stop running them, they moved me closer to the workflow I wanted—and taught me how to let go when somebody else builds a better version.
