---
title: "Sign in with ChatGPT and the Open-Source AI Billing Gap"
description: "Sign in with ChatGPT explores a different answer to a familiar open-source problem: letting people use an AI app with a subscription they already have, without managing API keys."
lang: "en"
author: "Min Wen"
pubDatetime: 2026-10-08T00:00:00Z
tags: ["ai", "open-source", "oauth", "developer-experience"]
featured: false
draft: true
baseSlug: "sign-in-with-chatgpt-and-the-open-source-ai-billing-gap"
llmKeyIdeas:
  [
    "Sign in with ChatGPT can authorize eligible open-source apps to use a user's ChatGPT plan for inference",
    "Open-source AI apps often make users supply and manage their own API keys",
    "The dynamic registration flow uses OAuth Authorization Code with PKCE and a 127.0.0.1 loopback callback",
    "Hosted websites use a separate pre-registered client flow rather than the open-source loopback flow",
  ]
---

## The awkward question behind an open-source AI app

I keep coming back to one practical question when I try an open-source AI app: **who is going to pay for the model calls?**

Many projects answer with an API key. The app is free to download, but the user has to create an account with an AI provider, enable billing, create a key, find somewhere to paste it, and keep it safe. That is a reasonable setup for developers. For everyone else, it is a surprisingly tall first step.

It gets more confusing when someone already pays for a ChatGPT plan. They may reasonably ask: “I have a subscription already. Can this app use it?” Traditionally, the answer has often been no: ChatGPT and the API platform have separate billing systems, and an app asking for an API key sends the user down the API billing path. ([OpenAI billing guide](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform))

[Sign in with ChatGPT](https://developers.openai.com/siwc/token-sharing-open-source) caught my attention because it offers another path for eligible open-source and locally hosted apps. According to the current quickstart, eligible ChatGPT Plus and Pro users can sign in, explicitly grant permission for plan usage, and authorize eligible Responses API requests to use their ChatGPT plan. The app still needs to integrate the flow, and the feature has its own eligibility, limits, and scopes. But the important product idea is clear: **the user can bring an existing relationship with the model provider instead of first learning how to provision API credentials.**

That could make open-source AI software approachable to a much wider group of people.

## API keys are a product problem, too

API keys are not inherently bad. They are a familiar and flexible way to let software call a service. But requiring users to supply one transfers several jobs to them:

- They need to understand that the API platform and consumer chat product may have separate billing.
- They need to create and manage credentials.
- They have to decide whether an unfamiliar app deserves access to those credentials.
- They need to think about usage, spending, and revocation.

For a technically confident user, these steps may be routine. For a non-technical person who just wants to try a local assistant, they can end the journey before the first prompt.

Sign in with ChatGPT changes the onboarding model. Instead of “bring an API key,” the app can present a familiar sign-in and permission flow. The user chooses an account and decides whether to grant the requested capabilities. Identity and plan usage are separate permissions; signing in by itself does not silently authorize inference. The app must check the granted scopes before using the plan. The documentation also says plan usage does not provide access to the user’s ChatGPT conversations or other account context.

This is more than replacing one credential field with a button. It moves the setup burden from each user to the app developer, who integrates the authorization flow once and then gives users a clearer consent experience.

## OAuth underneath, with a local-app boundary

The flow uses familiar building blocks: OAuth Authorization Code, PKCE, and OpenID Connect. The novel part, to me, is how OpenAI adapts the registration and callback rules for an open-source app that runs on the user’s machine.

At a high level, the local app prepares a stable host identifier, generates the usual `state`, `nonce`, and PKCE verifier, and starts a callback listener. It opens the user’s browser for sign-in and consent. After authorization, the browser returns a code to the local listener, and the app exchanges that code using the PKCE verifier. On first use, the flow also creates a client registration and returns an issued client ID for the app to save.

The open-source callback is constrained to an HTTP loopback URL such as:

```text
http://127.0.0.1:1455/auth/callback
```

The exact scheme, host, and path matter. The port can vary on a later sign-in, but the documentation says to use `127.0.0.1` rather than `localhost`, and to send the same full callback URI in the authorization request and code exchange. The app is a public client, so it does not ship a client secret; PKCE lets it prove possession of the verifier from that specific authorization attempt when exchanging the code. ([Registration and sign-in docs](https://developers.openai.com/siwc/token-sharing-open-source/sign-in))

I find the boundary interesting. A public SaaS callback normally points to a server on the internet, for example `https://app.example.com/callback`. That is not the user’s `127.0.0.1`, so a hosted service cannot just reuse the open-source dynamic-registration callback. OpenAI documents a separate website flow: a hosted app uses a pre-registered client ID and exact HTTPS callback, and the current documentation describes that website sign-in as available to selected commercial partners through a limited trial. ([Website sign-in docs](https://developers.openai.com/siwc/website))

So the rule is not “a company can never use Sign in with ChatGPT.” The distinction in the docs is between the open-source/local flow and a separately registered hosted website flow. A project’s legal structure is not the callback address. What matters is which integration path it qualifies for.

## PKCE is not the new part

PKCE itself is a standard OAuth protection for public clients. The local app creates a secret verifier, sends only a derived challenge through the browser authorization request, and later proves possession of the verifier when exchanging the code. `state` binds the callback to the authorization attempt; OpenID Connect’s `nonce` helps validate the returned identity token.

The interesting design choice is the policy layered around those standard mechanisms: the open-source app uses a loopback callback, and first-time authorization can also bootstrap an app registration. That gives a desktop or locally hosted tool a way to get started without asking every user to paste a developer-issued API key or client secret.

This is not a general OAuth trick that automatically makes any web service eligible. The callback requirement is part of this particular product flow. Hosted products have their own registration path and operational model.

## What this could change

Open-source software has always had a distribution advantage: anyone can download it, inspect it, modify it, and run it. AI adds a recurring service cost that complicates that promise. Someone still pays for inference. If every user has to bring a separately billed API key, “free and open source” can feel incomplete to people who already pay for a model subscription.

Sign in with ChatGPT points to a different arrangement. The developer supplies the application; the user authorizes eligible usage through an account and plan they already have. The developer does not need to operate a proxy that pays for everyone’s requests, and the user does not have to learn the API dashboard just to try the software.

There are meaningful constraints. Plan usage is an optional permission, not a blanket entitlement. The feature applies to eligible requests and has documented limits and requirements. The open-source flow is for apps that run locally or are self-hosted, while hosted commercial services follow a separate client-registration path. Those details will shape which projects can adopt it and what happens when a user reaches a plan limit.

Still, I think this is a useful product direction. It treats authentication, billing, and onboarding as connected parts of the same problem. The local callback rule is a particularly interesting way to express that boundary in the protocol: the user’s machine receives the authorization response, while an internet-hosted service must go through a distinct registered flow.

For people who want to use open-source AI tools without becoming part-time credential administrators, that is a promising step. The broader question is whether more AI platforms will let users authorize third-party software through plans they already pay for, while keeping the consent and usage boundaries clear.

## References

- [Sign in with ChatGPT: open-source overview](https://developers.openai.com/siwc/token-sharing-open-source)
- [Registration and sign-in for open-source apps](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
- [Sign in with ChatGPT on your website](https://developers.openai.com/siwc/website)
- [How ChatGPT and API billing work](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform)
- [Sign in with ChatGPT quickstart](https://developers.openai.com/siwc/quickstart)
