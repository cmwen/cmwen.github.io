---
title: "I Built Min Connect with ChatGPT Sites to Publish from a Conversation"
description: "A hands-on experiment connecting ChatGPT Sites, MCP, LinkedIn, and an Astro GitHub Pages blog, including the engineering trade-offs and bilingual drafting workflow."
author: "Min Wen"
pubDatetime: 2026-10-18T06:24:25.323Z
lang: "en"
draft: false
tags: ["MCP","ChatGPT","AI Agents","Developer Tools","GitHub Pages"]
baseSlug: "building-min-connect-chatgpt-sites-mcp-publishing"
---

A surprisingly large part of my writing starts as a conversation with ChatGPT. I might challenge an assumption about developer tools, explore a new architecture, or work through a trade-off. Sometimes I want to share the result, but the publishing workflow breaks the flow: copy the text, open LinkedIn or my blog, paste, reformat, and publish.

That led to a question: **if the idea was developed in ChatGPT, why can't I publish it from the same conversation?**

## From a conversation to a connector

My first two destinations were straightforward: LinkedIn for shorter discussions and my personal Astro blog, hosted on GitHub Pages, for longer technical writing. I wanted ChatGPT to work with both, without managing two separate copy-and-paste workflows.

I experimented with **ChatGPT Sites** to build a small app called **Min Connect**. The idea was to let the site manage connections to publishing platforms and expose actions back to ChatGPT through MCP (Model Context Protocol).

The architecture is simple:

```text
ChatGPT conversation
        |
        v
Min Connect (MCP tools + connected accounts)
        |
        +----> LinkedIn
        |
        +----> GitHub blog repository
                    |
                    v
                GitHub Pages
```

This separation matters. ChatGPT helps develop and format an idea. Min Connect handles the platform integration. I remain responsible for reviewing the content and deciding whether to publish.

## What I actually tested

I connected Min Connect to my LinkedIn profile and the GitHub repository behind my blog, `cmwen/cmwen.github.io`.

The available MCP tools cover a small but useful publishing lifecycle:

- `list_connections`: inspect connected destinations.
- `create_draft`: save content without publishing it.
- `get_draft`: retrieve saved content for review.
- `publish_draft`: publish after explicit confirmation.

For the first real test, I returned to a topic I had been thinking about: **Do AI coding agents still need a full IDE?**

I wanted a post with my own argument first, an AI perspective second, and a question to the audience at the end. This format lets me keep my thinking visible instead of pretending the LLM supplied all the insight.

I published that LinkedIn post through Min Connect, and the connector reported a successful publication. [Here is the published post](https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7517454463574495232/).

I then used the same connector to save a longer article about the experiment as a GitHub blog draft. That is a useful distinction: **the LinkedIn publishing path has been exercised; a saved blog draft is not the same as a verified public blog deployment**.

## Why not just call the APIs?

Underneath, this is still a conventional integration problem. LinkedIn and GitHub each have authentication, permissions, API contracts, and failure modes. MCP does not remove those concerns.

What MCP changes is the interface. I can ask an assistant to turn a discussion into a LinkedIn post or a technical article, and the assistant can invoke a common set of publishing tools. I do not need a separate content-production UI for every destination.

The most important design choice, to me, is keeping **draft** and **publish** as separate operations. A language model is useful for generating and revising prose, but public publishing is a consequential action. I want to inspect the result before it becomes visible to anyone else.

## A bilingual blog needs more than translation

My blog also has an English and Taiwanese Traditional Chinese publishing workflow. That adds more than a second language field.

A paired article needs a shared canonical slug and consistent metadata. In my Astro repository, the English article belongs under `src/content/blog/` and the localized edition under `src/content/blog/zh-hant/`. The Chinese edition uses `lang: "zh-hant"`, with `baseSlug` and `translatedFrom` linking it to the English source.

The content itself should not be a mechanical sentence-by-sentence translation. I want the Chinese version to read naturally for developers in Taiwan, while preserving the technical details, reasoning, and uncertainty of the original.

For now, creating two related drafts is part of the workflow I am testing. I do not want to confuse that with a fully proven, atomic bilingual publishing operation.

## The parts I'm still questioning

The experiment also raised some engineering questions.

**Portability.** Building a hosted app quickly is appealing, but what happens if I want to move the app elsewhere? Owning my domain doesn't imply that I can export its source, infrastructure, or stored data without friction.

**Reusable clients.** Ideally, the same MCP endpoint could work with local assistants such as Codex, not only ChatGPT. That still needs client, transport, and authentication testing.

**Security.** A connector that can publish on my behalf needs well-scoped credentials, deliberate approval, and clear recovery from failed or partial operations.

**Content lifecycle.** Drafts and publication are only the beginning. Previews, revision history, updates, and bilingual synchronization would make this far more useful.

## The bigger experiment

I started with a small annoyance: publishing breaks the flow of thinking. I ended up testing a more interesting idea.

Maybe some of my personal apps don't need to be full destinations that I open, navigate, and operate manually. Maybe they can be **capabilities exposed to an assistant**, while their own interfaces focus on connection management, review, and control.

That doesn't make the engineering disappear. It shifts the engineering from building yet another frontend toward creating trustworthy actions.

This article is part of that experiment: developed in a ChatGPT conversation and saved as a draft through the connector it describes.

Would you trust an AI assistant to prepare your content but keep publishing behind an explicit approval step? And where would you draw the line between a conversational interface and a dedicated app?
