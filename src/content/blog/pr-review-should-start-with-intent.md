---
title: "PR Review in the Age of Coding Agents Should Start with Intent"
description: "When coding agents write much of the implementation, the real review target is not just the diff. It is whether the change still matches the user's intent, constraints, and project goals."
lang: "en"
author: "Min Wen"
pubDatetime: 2026-05-07T21:54:13.772Z
modDatetime: 2026-05-07T21:54:13.772Z
tags: ["ai", "code-review", "pull-requests", "software-engineering", "agents"]
featured: false
draft: false
slug: pr-review-should-start-with-intent
llmKeyIdeas:
  [
    "intent-first PR review",
    "why how what commits",
    "reviewing agent output",
    "agent reviewer handoff",
    "jira traceability",
  ]
---

PR review is changing.

In a traditional workflow, a reviewer usually looked at a diff and asked familiar questions: Is the code correct? Is it readable? Does it fit the architecture? Does it introduce risk? Those questions still matter. But when more of the implementation is produced by a coding agent, they are no longer the whole job.

The hard part of review is often not the syntax of the change. It is whether the change still reflects the original user intent.

That is the shift I keep coming back to. Model quality matters. Task hardness matters. The weaker the model or the harder the task, the more carefully you inspect the code itself. But regardless of model quality, what you are actually reviewing is alignment:

1. **Why** was this change requested?
2. **How** was it supposed to solve the problem?
3. **What** was intentionally changed, and what was intentionally left alone?

If those three things are unclear, a coding agent can produce a clean-looking PR that still misses the point.

## Why intent matters more with coding agents

Coding agents are very good at producing plausible implementation. That is exactly why review needs more context, not less.

An agent can read the repository, find a pattern, and produce something that passes lint and build. It may even look more polished than a rushed human commit. But "looks right" is not the same as "is right for this request."

The gap usually appears in constraints that were obvious to the requester but never made it into the diff:

- Do not add a new service
- Keep the current user flow unchanged
- Avoid storing personal data
- Stay within an internal policy or compliance boundary
- Optimize for reversibility because this is an experiment

These are intent-level requirements. They rarely show up clearly in a file-by-file review unless someone writes them down.

That is why I think PR review in the agent era should start from intent, not from code. The code is evidence. The intent is the contract.

## But what is the counterexample?

There is a reasonable pushback here.

Sometimes the reviewer really **should** start from code.

If a change touches concurrency, cryptography, access control, a data migration, a parser, a billing path, or a safety-critical workflow, the implementation details may be the primary source of risk. In those cases, it is not enough to say "the intent looks good." The reviewer needs to inspect the logic deeply, sometimes line by line.

I think that is the best counterexample to my argument, and it is a good one.

But I still would not abandon intent-first review. I would refine it.

Intent-first review does **not** mean intent-only review. It means you establish the contract first so you know what the implementation is supposed to optimize for, what constraints matter, and where a deep code dive is required. For high-risk changes, intent tells the reviewer where to be skeptical. It does not replace code review. It prioritizes it.

In other words:

- For low-risk changes, intent may reveal that the PR is wrong before you spend much time on the diff.
- For high-risk changes, intent tells you which parts of the diff deserve the deepest scrutiny.

That is still better than reviewing a technically polished PR with no idea what problem it was actually meant to solve.

## Why tooling makes this even more true

This shift becomes clearer when you combine coding agents with modern engineering guardrails.

Linting, type checking, code formatting, and standard test automation are all still useful. In fact, they become more useful because they offload the most mechanical parts of review. A good coding agent will usually get formatting right, satisfy the type checker, and follow common repository patterns. That does not make the human reviewer unnecessary. It changes what the human should focus on.

If the machine and the tooling can already catch a large share of syntax issues, style drift, and obvious mistakes, then the scarce human review time should go toward harder questions:

- Did we solve the right problem?
- Did we stay within scope?
- Did we respect product, security, and operational constraints?
- Did the implementation introduce hidden coupling or long-term cost?

That is why I see intent as a force multiplier for review. It helps humans spend their attention where automation is weakest.

## The problem with many commit messages

Most commit messages still optimize for a world where a human wrote every line and the reviewer can reconstruct the rest.

Even good commit styles often focus on the change summary:

```text
feat(auth): add login throttling
```

That is useful. Conventional Commits gives us a clear type, an optional scope, a short description, and optional body and footers. It is great for changelogs and automation. But by itself, it still mostly tells me **what kind of change happened**, not the full intent behind it.

Git already has a built-in concept of structured trailers in commit messages as well. That means teams do not need a completely new invention here. They can extend existing commit conventions with a small amount of structured context.

In other words: keep the summary line, but make the intent explicit.

## A better default: require Why, How, and What

If a repository uses coding agents regularly, I think every non-trivial agent-produced change should carry a compact intent block, either in the commit message, PR description, or both.

For example:

```text
feat(auth): add login throttling for repeated failures

Why: reduce credential-stuffing risk on the public login form
How: use the existing edge KV store for per-IP and per-account counters
What: add throttling middleware, Retry-After header, and security audit events
Constraints: no new stateful service, no change to the SSO flow
Out-of-scope: captcha, MFA redesign, admin lockout UI
```

This is not bureaucracy. This is review context compressed into a form that both humans and tools can use.

Now a reviewer can ask much better questions:

- Does the implementation really use existing infrastructure?
- Did the agent accidentally change the SSO path anyway?
- Are the audit events compliant with internal logging policy?
- Is the out-of-scope line still respected?

Without that context, the reviewer may waste time checking style details while missing the real failure mode.

## A concrete example

Imagine a product manager asks for a small security improvement: slow down repeated failed logins on the public sign-in page. The intent is narrow. Reduce abuse. Do not create more operational burden. Do not change the happy path for normal users.

A coding agent might produce a technically solid PR that introduces Redis-based rate limiting, new deployment configuration, a background cleanup job, and a more aggressive lockout screen. On paper, that can look impressive. The code may be well-structured. Tests may pass.

But it can still be the wrong change.

Why?

Because the original intent was not "build the most scalable throttling system you can imagine." The original intent was "reduce abuse inside existing operational and product constraints."

The reviewer needs enough context to say:

- The new Redis dependency violates the "no new service" constraint
- The lockout UI changes the user experience more than requested
- The implementation may increase support tickets for legitimate users
- The solution is harder to roll back than the original request justified

That is a much higher-value review than arguing about function names.

## Why this matters for human review

When a human reviewer works with coding agents, the reviewer is not only checking code quality. The reviewer is acting as the last verifier that machine-generated implementation still aligns with human goals.

That goal might be user value.
It might be architecture direction.
It might be security policy.
It might be cost control.
It might be legal or compliance boundaries.

This is why intent belongs close to the change. A reviewer should not have to reconstruct it from chat logs, ticket comments, and guessed assumptions.

And this is also why the "why, how, what" pattern is powerful. It gives the reviewer a short, stable frame:

- **Why** checks business and policy alignment
- **How** checks design choices and constraints
- **What** checks implementation scope

That frame works whether the diff was produced by a junior engineer, a senior engineer, or an LLM-based coding agent.

## An end-to-end workflow that keeps automation and humans clear

The most useful pattern I have seen is to make the machine-readable intent explicit at every handoff.

Here is a simple example:

1. A product or engineering ticket defines the goal, constraints, and acceptance criteria. If the team uses Jira or a similar system, the ticket ID becomes part of the traceability chain.
2. The developer asks a coding agent to implement the change and explicitly includes the intent block: `Why`, `How`, `What`, `Constraints`, and `Out-of-scope`.
3. The coding agent produces the branch, commit message, and PR description using that structure. The commit can include the ticket reference so downstream tooling can connect code back to the originating request.
4. A review agent checks whether the diff, commit message, and PR description still align with the stated intent and ticket. It can also verify that the change passed the repository's normal automation such as linting, type checking, formatting, and tests.
5. The human reviewer makes the final judgment on trade-offs, exceptions, and whether the requested outcome is still the right one.

The important point is that each participant has a different job.

- The coding agent is optimizing for implementation.
- The review agent is optimizing for alignment and policy checking.
- The human is optimizing for judgment.

That separation matters. It keeps AI automation useful without pretending that generated code can explain its own purpose.

It also makes failures easier to catch early. If the commit message references `PROJ-123`, says the change must not add infrastructure, and the PR introduces a new managed service anyway, a review agent has a much better chance of flagging the mismatch before a human spends time on the details.

## What teams can enforce in practice

I would keep this lightweight.

For trivial commits, a normal summary line is enough.

For non-trivial changes, especially agent-assisted ones, I would enforce one of these:

1. A commit template with `Why`, `How`, and `What`
2. PR description fields for `Intent`, `Constraints`, and `Out-of-scope`
3. A commit-msg or PR lint rule that checks the fields exist for labeled agent-generated work

The key is not perfect formatting. The key is making intent reviewable.

If you already use Conventional Commits, this fits naturally. The subject line stays useful for tooling. The body or trailers carry structured intent for reviewers and future automation.

## The deeper shift

I think this points to a broader change in modern SDLC.

As coding agents get better, the bottleneck moves upward. Less effort is spent typing implementation, and more effort is spent specifying goals, constraints, acceptance criteria, and policy boundaries. In other words, software development becomes more intent-heavy.

That does not make review less important. It makes review more semantic.

The reviewer is asking less often, "Could a human have written this better line by line?"

And more often, "Does this implementation faithfully execute the intent we should have approved in the first place?"

That is the review loop I want teams to optimize for.

Not just whether the code works.
Not just whether the agent was clever.

But whether the change still answers the right **why**, follows the right **how**, and limits itself to the right **what**.
