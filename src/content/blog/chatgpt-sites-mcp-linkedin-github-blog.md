---
title: "I Built My Own MCP Connector with ChatGPT Sites — and Used It to Publish to LinkedIn"
description: "How I built Min Connect with ChatGPT Sites to connect LinkedIn and my Astro GitHub Pages blog through MCP, and published my first LinkedIn post directly from a ChatGPT conversation."
author: "Min Wen"
pubDatetime: 2026-10-18T05:25:27.446Z
lang: "en"
draft: false
tags: ["MCP","ChatGPT","AI Agents","Developer Tools","Automation","GitHub Pages"]
---

# I Built My Own MCP Connector with ChatGPT Sites — and Used It to Publish to LinkedIn

*What started as an experiment with ChatGPT Sites turned into a personal publishing workflow connecting ChatGPT, LinkedIn, and my GitHub-hosted blog.*

## The problem: AI can write content, but publishing is still disconnected

A lot of my ideas already start as conversations with AI. I might be discussing software architecture, challenging an assumption about AI coding agents, or exploring a technology. Sometimes these conversations become worth sharing.

The traditional workflow is to ask ChatGPT to write, copy the text, open LinkedIn or a blog CMS, paste, reformat, and publish.

**Why should I leave the conversation to publish something created inside it?**

## The idea: ChatGPT as my publishing interface

I have two publishing destinations: LinkedIn for shorter professional discussions and my Astro blog hosted on GitHub Pages for longer articles.

I wanted one connector: **ChatGPT → MCP Connector → LinkedIn / GitHub Blog**.

The connector would handle platform-specific details while ChatGPT remained the conversational interface. I also wanted a way to manage credentials without pasting them into prompts.

## Building Min Connect with ChatGPT Sites

I used ChatGPT Sites to build **Min Connect**, an application that connects my LinkedIn profile and GitHub blog repository, provides connection management, and exposes draft and publication operations through MCP.

Rather than manually creating another standalone publishing UI, I described the integration I needed.

**I wanted to build a tool inside ChatGPT that I could use from ChatGPT itself.**

## How the architecture works

There are three layers.

**ChatGPT — conversation and content.** This is where I think through an idea, challenge assumptions, and ask the AI to shape the result into an article or post.

**Min Connect — MCP tools.** The connector exposes four operations:

- `list_connections`: see available publishing destinations.
- `create_draft`: save a LinkedIn or Astro blog draft.
- `get_draft`: retrieve a draft for review.
- `publish_draft`: publish an approved draft.

Drafting and publishing are intentionally separate. Generating content should not automatically make it public.

**Publishing providers — LinkedIn and GitHub.** LinkedIn is the destination for short posts. For the blog, the connector can commit an Astro article to `cmwen/cmwen.github.io`, with the existing GitHub Pages workflow hosting the content.

## My first real test: a LinkedIn post

I tested the connector with an idea I was already exploring: **Do AI coding agents still need a full IDE?**

I wanted the post to begin with a question, present my own human reasoning, bring in an AI perspective that might challenge me, and end by inviting other developers to respond.

I didn't want AI to replace my thinking. I wanted it to help articulate, challenge, and share my thinking.

The post was successfully published through Min Connect.

[Read the published LinkedIn post](https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7517454463574495232/).

That turned an architectural experiment into something concrete: content originating in a ChatGPT conversation reached LinkedIn through an MCP connector built with ChatGPT Sites.

## Why MCP matters

This is still an API integration underneath. LinkedIn and GitHub have their own authentication and publication requirements.

What MCP changes is the interface for using these capabilities. Instead of building another custom interaction for each provider, I can expose tools that an MCP-capable assistant can invoke.

The requests can remain conversational: “Turn this discussion into a LinkedIn post” or “Make this a longer article for my blog.”

**The LLM helps decide what to write. The connector handles where and how to send it. I decide when it becomes public.**

## What I'd improve next

**Portability.** If I build with an AI-assisted hosted platform, can I export the code, data, and configuration and migrate to a different host? Owning a domain doesn't automatically mean owning an easily portable implementation.

**Local agents.** I want to explore using the same connector from Codex or other MCP-compatible local clients. That depends on endpoint accessibility and compatible authentication and transport.

**Publishing lifecycle.** Draft previews, revisions, history, and editing already published posts would make the workflow more complete.

**More providers.** LinkedIn and GitHub are first. I want to keep the architecture extensible.

**Security.** A connector that publishes on my behalf needs protected credentials, scoped permissions, and deliberate approval before publication.

## ChatGPT as a personal application platform

The most interesting part isn't LinkedIn itself. It's the possibility of building small, personal capabilities that AI assistants can compose through conversation.

The conversational UI already exists. I can focus more on what my tools do rather than building yet another interface for each one.

This doesn't remove real engineering concerns: authentication, hosting, portability, security, and reliability still matter.

But it changes where I spend my effort.

And this article is another test of the idea: I discussed it with ChatGPT, asked for the blog post, and saved it through my own connector.

## What do you think?

Will MCP connectors become a common way to integrate personal services with AI assistants?

Would you rather build a dedicated interface for each tool, or expose those capabilities to your AI agent?

---

*Built with ChatGPT Sites, MCP, LinkedIn, GitHub, and Astro.*
