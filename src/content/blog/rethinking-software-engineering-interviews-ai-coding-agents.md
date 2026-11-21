---
title: "Rethinking Software Engineering Interviews in the Age of AI Coding Agents"
description: "A personal reflection on AI coding interviews, ambiguous requirements, controlled agent environments, model choice and engineering judgment."
author: "Min Wen"
pubDatetime: 2026-11-21T03:33:26.704Z
lang: "en"
draft: false
tags: ["AI Agents","Software Engineering","Interviews","Developer Tools"]
baseSlug: "rethinking-software-engineering-interviews-ai-coding-agents"
---

*What a recent interview taught me about evaluating AI-native engineers.*

I recently participated in a software engineering interview where using an AI coding agent was part of the exercise. It made me realise how much development workflows have changed—and how interviews might need to catch up.

**If AI is changing how software engineers work, shouldn't it also change how we evaluate them?**

## The Problem with Unclear Requirements

The interview began with a coding task whose requirements weren't entirely clear. Naturally, I asked questions about goals, constraints, expected behaviour, and scope.

Requirement clarification is an important engineering skill. But something felt awkward. In many coding interviews, the interviewer already has a problem and expected solution in mind. The candidate spends time discovering what the interviewer is thinking.

That's not quite the same as real requirement discovery. Stakeholders often don't know exactly what they want. Engineers need to challenge assumptions, propose alternatives and sometimes redefine the problem.

**Discovering what a problem should be is different from guessing what someone else has already decided.** The latter can use up an interview without revealing much about engineering ability.

## When the Third Participant Is an AI Agent

Once I had clarified the requirements, I started working with the coding agent. The exercise now had three participants: the interviewer defining and evaluating work; the candidate making decisions; and an AI agent implementing part of the solution.

They don't work at the same speed. An agent needs time to explore a repository, change code, run tests and report back. Meanwhile, should the interviewer wait? Should the candidate narrate everything? Could we discuss architecture or another task?

In my experience, clarification and agent execution consumed much of the time available to demonstrate a working result. I found myself explaining my normal AI workflow while the implementation was still running.

**The problem isn't necessarily that agents are slow. It's that the interview assumes coding is a continuous, synchronous activity performed by one person.** AI-native development isn't always like that.

## What Are We Actually Trying to Evaluate?

An engineer still needs architecture, security, testing, maintainability and programming knowledge. But AI-assisted development also requires decisions about:

- Breaking problems into delegable tasks.
- Choosing agents, models and tools.
- Clarifying uncertainty versus making sensible assumptions.
- Identifying parallel work and managing dependencies.
- Knowing when to intervene.
- Verifying generated code.
- Managing time, cost and risk.

Watching whether an agent finishes a feature in a fixed time doesn't tell us enough. And mandating one model for everyone removes a meaningful tool-selection decision. Engineers ought to explain why one model fits a task better than another—and when a simpler approach is enough.

## Start with a Realistic Engineering Environment

What if we gave candidates a small, pre-designed repository resembling a real application? It could contain working features, tests, documentation, known problems and opportunities for improvement.

Instead of spending the first part of the interview setting up a project or extracting a hidden specification, candidates could explore the system and choose meaningful work.

The available tasks might include a clearly scoped feature, a bug fix, security or maintainability review, a small architecture proposal, and an open-ended proof of concept.

They wouldn't need to finish everything. **Choosing what to work on—and what to leave alone—would itself be part of the assessment.**

Someone might prioritise a security flaw. Another might delegate a simple implementation to an agent while exploring an architectural issue. One candidate might use several agents; another might use only one to avoid coordination overhead. These can all be reasonable decisions. The interesting question is why.

## Keep Some Problems Open-Ended

Not every task needs a complete specification. Consider:

*"Our pull requests spend too much time waiting for review. Build a small proof of concept to improve one part of that process."*

A candidate could choose PR summaries, risk analysis, reviewer assistance or something unexpected. They would define the problem, make assumptions, choose an approach and deliver something useful.

But the scope must be manageable. If the problem is too broad, the interview becomes a requirements workshop and never reaches implementation.

**An open-ended task should create room for engineering judgment, not unlimited ambiguity.**

## Multiple Tasks, Multiple Ways to Demonstrate Ability

Imagine an hour with a prepared repository and several task types. A candidate explores the code, clarifies an important requirement, then delegates a feature to an agent. While it runs, they review another component or discuss a design decision with the interviewer. They return to inspect changes, run tests and choose whether to accept or revise the work.

This is closer to day-to-day AI-assisted engineering. We can observe prioritisation, delegation, judgment, adaptation and delivery within one session.

Instead of several disconnected tests, the interview becomes a small engineering simulation.

## Should Everyone Use the Same AI Agent?

Using identical tools seems fairer because it reduces variables. But for an AI-native role, choosing appropriate models is part of the job. Candidates should be able to explain model capabilities, latency, cost and reliability, and choose accordingly.

However, **choosing tools is not the same as bringing an entire pre-built development system into an interview.**

## The Hidden Advantage of Personal Agent Environments

Engineers who regularly use coding agents develop their own setups: custom instructions, reusable agent skills, MCP servers, specialised tools, templates, automated testing or complete multi-agent environments.

That can represent months of valuable engineering work. But imagine two candidates: one starts with a standard agent, while another imports a highly optimised environment full of reusable skills. Perhaps they built it; perhaps they copied it from someone else.

The second person may deliver much more. Yet do they understand that setup? Can they explain it or adapt it to a changed requirement? Or are we largely measuring an existing automation system?

Reusing other people's tools isn't wrong—software engineering depends on libraries and frameworks. **The issue is attribution: how much of the result reflects the candidate's ability, and how much reflects previously assembled automation?**

I think a short interview needs some boundaries.

## Control the Environment, Not Every Decision

I'd provide a controlled development environment with a prepared repository, reproducible setup, a selection of approved coding agents and models, comparable credentials and resources, clear time limits, and a shared usage budget.

Candidates could still choose models, divide work, run agents in parallel, and create small task-specific instructions or skills during the exercise.

But I'd generally restrict importing large, unexamined personal agent environments and private skill libraries. If designing agent infrastructure is a job requirement, assess that separately—through an architecture discussion, a walkthrough of previous work, or a dedicated tooling exercise.

There is a trade-off. A controlled environment won't fully capture someone's long-term workflow expertise, and unfamiliar tools may disadvantage some candidates. So the setup should be documented ahead of time, approachable and flexible enough for different reasonable strategies.

**Standardise the starting point and constraints. Preserve freedom in engineering decisions.**

## Is Fairness Really About Identical Processes?

Traditional interviews are already subjective. Interviewers prefer different architectures, code styles and ways of communicating. That isn't always bad, but there is a difference between evaluating engineering judgment and rewarding candidates who think like the interviewer.

One person may use a sophisticated multi-agent workflow, while another reaches the same outcome with one capable model. More agents don't automatically mean better engineering; simplicity may be the smarter choice.

**Fairness shouldn't eliminate different approaches. It should evaluate them against capabilities the job actually requires.**

## Evaluate the Engineer, Not Just the Agent

What if a candidate makes sound design and testing decisions but their agent doesn't finish? What if someone else finishes quickly yet doesn't understand or verify the generated code?

Delivery matters. But so do scope management, assumptions, validation, technical judgment and risk ownership.

An incomplete feature isn't automatically a success because the explanation was good. Equally, a working demo doesn't guarantee sound engineering.

The goal is to understand the engineer's contribution, not merely measure agent output.

## What I Would Change

I'd start with these principles:

1. **Provide a realistic repository** with something concrete to explore and change.
2. **Offer different task types**, including implementation, debugging, review, design and a small open-ended POC.
3. **Control the development environment while preserving choice** in model selection, task division and workflow.
4. **Support asynchronous work**, so agent execution isn't treated as dead time.
5. **Evaluate decisions alongside outcomes**, including verification and clear trade-offs.
6. **Don't hide the expected answer in the interviewer's head.** If a task is open-ended, say so, and allow sensible assumptions.

## Final Thoughts

There is no single perfect interview. But simply allowing AI agents in a traditional coding interview may not be enough. We may need to redesign the process itself.

Can a candidate take a real engineering problem, choose tools thoughtfully, manage uncertainty and deliver something valuable? And can we tell which part of that outcome came from the candidate's decisions rather than their tooling?

That's what I would want to understand about an AI-native engineer.

---

*Maybe the next generation of software engineering interviews should look less like solving a coding puzzle and more like spending an hour doing real engineering work.*
