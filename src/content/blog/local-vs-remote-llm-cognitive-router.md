---
title: "Local or Remote LLM? Build a Cognitive Router, Not a Rule of Thumb"
description: "A practical framework for deciding when to use local LLMs, when to use remote frontier models, and how to route tasks by risk, privacy, context, cost, and verification."
lang: "en"
author: "Min Wen"
pubDatetime: 2026-07-02T10:00:00Z
tags:
  ["ai", "llm", "local-first", "automation", "agent-orchestration", "privacy"]
featured: true
draft: false
baseSlug: "local-vs-remote-llm-cognitive-router"
llmKeyIdeas:
  [
    "local vs remote LLM decision framework",
    "cognitive router for hybrid AI systems",
    "privacy-aware LLM routing",
    "remote plan local execute workflow",
    "local draft remote review workflow",
    "LLM task risk scoring",
    "tool permission gateway for AI agents",
  ]
---

The question "Should this task use a local LLM or a remote LLM?" sounds simple, but it is the wrong level of abstraction.

A better question is: **what kind of thinking does this task need, what kind of data does it touch, and what kind of mistake would be acceptable?**

Local models are not just cheap replacements for frontier models. Remote models are not just "smarter defaults." In a serious workflow, they should play different roles inside a small cognitive operating system. I think of this layer as a **Cognitive Router**: a decision layer that routes work by risk, cost, privacy, context, reversibility, and uncertainty.

The goal is not to avoid remote models. The goal is to spend remote intelligence where it matters.

## Local and remote models should have different jobs

Most local-versus-remote discussions collapse the decision into a single axis: small model versus big model. That misses the point. The useful distinction is role.

### What local LLMs are good at

A local model is close to your environment. It can read local files, inspect logs, run commands, and touch sensitive context without sending it outside your machine.

I would use local models as:

- **Scouts**: quickly inspect a task, file tree, error message, or log and classify what kind of problem it is.
- **Compressors**: turn a large repository, email thread, or log file into a compact summary a remote model can reason over.
- **Redactors**: remove secrets, tokens, internal hostnames, customer data, and personal information before anything leaves the machine.
- **Executors**: apply a plan, edit files, run tests, retry, and produce a patch.
- **Cache brains**: handle known, repeated, low-risk, template-like work.
- **First-draft generators**: produce a rough draft that a stronger model can review.

This makes local models valuable even when they are weaker. They can reduce the amount of raw context that needs to reach a remote model.

### What remote LLMs are good at

Remote frontier models should not be wasted on tiny changes. They are more valuable when the task needs judgment.

I would use remote models as:

- **Architects**: reason across files, systems, product constraints, and long-term maintenance trade-offs.
- **Judges**: review local output for quality, hidden risk, and logical gaps.
- **Planners**: turn vague goals into concrete steps, validation criteria, and rollback strategies.
- **Conflict resolvers**: decide what to do when tests, docs, local model output, and user intent disagree.
- **Novelty handlers**: handle unfamiliar frameworks, messy technical debt, ambiguous requirements, or creative design work.

In other words: **local handles volume; remote handles judgment.**

## Routing is not binary

The most practical system has several routing modes, not just "local" and "remote."

### Mode 1: Local Only

Use this for low-risk, clear, reversible, repetitive tasks.

Good examples:

- Edit a JSON or YAML config.
- Update a small section of a README.
- Generate boilerplate from an existing template.
- Refactor one file with obvious tests.
- Format structured data.
- Draft a simple workflow from a known pattern.

The rule of thumb: if the task is clear, the context is small, the failure cost is low, and the result can be tested quickly, local is enough.

### Mode 2: Remote Only

Use this when the work is abstract, high-risk, or full of uncertainty.

Good examples:

- System architecture design.
- Security review.
- Migration strategy.
- Agent workflow design.
- Cross-repository technical debt planning.
- Large refactor planning.
- New technology selection.

These tasks are not about editing text. They require deep reasoning and trade-off analysis.

### Mode 3: Local First, Remote Escalation

This is the best default for everyday work.

The flow looks like this:

```text
User task
  -> Local LLM inspects and drafts
  -> Local LLM estimates confidence, risk, and missing context
  -> Low risk: finish locally
  -> High risk or uncertainty: escalate to remote
```

The local model should not just answer. It should produce a routing assessment:

```json
{
  "confidence": 0.72,
  "risk": "medium",
  "missing_context": ["package manager", "test command"],
  "should_escalate": true,
  "reason": "The change touches cross-file dependencies"
}
```

Model confidence alone is not reliable, but structured self-assessment gives the router something to combine with external signals.

### Mode 4: Remote Plan, Local Execute

This is the most important pattern for privacy and cost control.

The remote model does:

- Analysis.
- Design.
- Step-by-step planning.
- Acceptance criteria.
- Risk identification.
- Rollback strategy.

The local model does:

- File reading.
- File editing.
- Test execution.
- Patch generation.
- Local retry based on errors.

For example, if you are migrating a Node 14 project to Node 22, the remote model does not need the entire repository. It can first produce a checklist:

```text
Check these risk areas:
1. Babel
2. Jest
3. ESLint
4. peerDependencies
5. node-sass
6. ESM versus CommonJS
7. CI image versions
```

Then the local model scans the repo, maps the checklist to actual files, and produces findings.

### Mode 5: Local Draft, Remote Review

This gives a strong quality-to-cost ratio.

The local model creates the initial patch, draft, or script. The remote model only sees the diff, summary, and test results. It acts as a reviewer, not the primary author.

This works well for:

- PR review.
- Code patches.
- Prompt rewrites.
- Technical writing.
- Migration scripts.
- Shell scripts.
- GitHub Actions workflows.

The remote model should not always generate a second answer from scratch. Often the highest-value role is skeptic.

### Mode 6: Shadow Parallelism

For high-value decisions, run both.

```text
Same task
  -> Local model gives a fast answer
  -> Remote model gives a deeper answer
  -> Router or judge compares agreement, conflict, evidence, and risk
```

This is useful for architecture choices, long debugging sessions, AI agent workflow design, and early analysis in domains where guessing is expensive.

The value is not that one model is always better. The value is that different models fail differently. Local models may jump too quickly because they have less reasoning depth. Remote models may over-engineer or ignore local constraints. Comparing them can expose both failure modes.

## The ten routing factors that matter

A cognitive router needs observable inputs. I would score every task along these dimensions.

### 1. Task entropy

Low-entropy tasks have clear inputs, fixed output formats, and little semantic ambiguity. They can often be handled by rules, templates, or local models.

High-entropy tasks have incomplete intent, multiple valid solutions, and meaningful trade-offs. They may involve architecture, business risk, security, or long-term maintenance. These should lean remote.

### 2. Blast radius

Ask: if the model is wrong, how far does the damage spread?

Low blast radius:

- Edit one Markdown file.
- Change UI copy.
- Produce a draft.
- Modify non-critical config.

High blast radius:

- Change auth.
- Change payments.
- Change database migrations.
- Change deployment pipelines.
- Delete files.
- Touch production secrets.
- Perform broad refactors.

High blast radius should trigger remote review or human approval.

### 3. Reversibility

Reversible work can be rolled back through a git diff, deleted draft, or throwaway branch.

Irreversible work includes sending email, deploying, merging a PR, deleting data, changing production config, or publishing publicly.

Irreversible actions should not be decided by a local model alone.

### 4. Context spread

If the answer depends on one file, local is usually fine. If it requires understanding dependencies, CI, runtime logs, production behavior, old issues, PR history, and design docs, the task should escalate to remote planning or remote review.

### 5. Privacy sensitivity

I would classify data like this:

```text
P0 Public: public repositories and public documents
P1 Internal: private notes and non-sensitive private repositories
P2 Sensitive: email, calendar, financial data, customer data
P3 Secret: API keys, tokens, passwords, private certificates
```

Routing policy:

- **P0** can go remote.
- **P1** can go remote after summarization.
- **P2** should be local-first, with redaction if remote reasoning is needed.
- **P3** should never go remote.

This is where a local **Privacy Compiler** becomes useful:

```text
Raw data -> local scan -> secret removal -> compressed summary -> remote reasoning
```

The remote model receives the abstract problem, not the raw sensitive data.

### 6. Cost budget

Do not decide cost one call at a time. Treat remote attention as a budget.

For example:

```yaml
daily_budget:
  remote_tokens: 500000
  remote_calls: 100

task_budget:
  small_fix: local_only
  debugging: max_3_remote_calls
  architecture: allow_remote_deep_reasoning
  personal_docs: local_first
```

A production incident can justify many remote calls. A config typo should justify none.

### 7. Confidence calibration

The local model should report confidence, but the router should not trust it blindly.

A better confidence calculation mixes model self-score with external signals:

```text
confidence =
  model_self_score
  + tests_passed
  + schema_valid
  + lint_passed
  + diff_small
  - touched_critical_files
  - ambiguous_user_goal
  - missing_context
```

The phrase "I am confident" is not enough. Passing tests, small diffs, schema validation, and low-risk paths matter more.

### 8. Verification availability

If the task can be verified quickly, local models can do more.

Good verification signals:

- TypeScript compile.
- Unit tests.
- JSON schema validation.
- Markdown lint.
- Snapshot tests.
- Dry runs.
- AST parsing.
- ShellCheck.

If the task is hard to verify, such as architecture, product strategy, or long-term maintainability, stronger remote reasoning becomes more valuable.

### 9. Novelty

Some tasks are familiar paths. Others are unfamiliar terrain.

Familiar:

- Your usual Astro site.
- A recurring GitHub Pages deployment.
- A known React or Node stack.
- A common n8n workflow pattern.

Unfamiliar:

- A new framework.
- A new security model.
- A new agent protocol.
- A new regulation.
- Unknown infrastructure.

High novelty should bias toward remote planning or at least remote review.

### 10. Time criticality

Some tasks need speed. Some need correctness.

```text
Fast autocomplete -> local
Production incident triage -> local scan plus remote parallel reasoning
Architecture decision -> remote
Simple shell command -> local
Dangerous shell command -> remote review or human confirmation
```

Time pressure does not always mean "use the fastest model." Sometimes it means "use local to collect evidence while remote reasons in parallel."

## A simple routing score

You can start with a scoring function:

```text
remote_score =
  ambiguity * 2
  + blast_radius * 3
  + context_spread * 2
  + privacy_safe_for_remote * 1
  + novelty * 2
  + irreversible_action * 3
  + user_requested_quality * 2
  - local_verifiability * 2
  - repetition * 2
  - cost_pressure * 1
```

Then map the score:

```text
0-3:   Local Only
4-7:   Local First, Remote Review if needed
8-12:  Remote Plan, Local Execute
13+:   Remote Deep Reasoning + Human Approval
```

This does not need to be perfect on day one. The point is to create a decision baseline that can be observed and tuned.

## Tool permission matters more than model choice

The dangerous part is not only whether a model is right. It is what the model is allowed to do.

I would separate tool permissions like this:

```text
Level 0: Read only
Level 1: Suggest changes
Level 2: Write local files
Level 3: Run tests and commands
Level 4: Git commit
Level 5: Push branch
Level 6: Create PR
Level 7: Merge, deploy, send, or delete
```

Local models can have high local read/write access but lower external authority. Remote models can have high reasoning authority without direct execution authority.

A safer split:

```text
Remote: decides and reviews
Local: executes and touches sensitive environment
Human: approves irreversible actions
```

This is much safer than letting a remote model control every tool directly.

## Build context capsules, not context dumps

Remote models should receive high-density context, not raw noise.

Instead of sending 5,000 lines of logs, let the local model cluster errors, extract the 30 relevant lines, build a timeline, remove secrets, and ask the remote model to reason over the root cause.

For coding work, the local model can produce a **Context Capsule**:

```json
{
  "task": "Upgrade Node 14 project to Node 22",
  "repo_type": "React + Redux + Jest + Babel",
  "critical_files": [
    "package.json",
    "babel.config.js",
    "jest.config.js",
    ".github/workflows/ci.yml"
  ],
  "detected_risks": [
    "node-sass present",
    "old babel-jest",
    "enzyme dependency",
    "CommonJS config files"
  ],
  "test_status": "currently failing",
  "error_summary": "...",
  "secrets_removed": true,
  "request_to_remote": "Generate migration strategy and risk-prioritized steps"
}
```

This lets the remote model reason from compressed evidence instead of raw repository state.

## Make model calls contractual

Every model call should have a contract.

The local model should return structured routing data:

```json
{
  "task_type": "code_change",
  "risk_level": "medium",
  "requires_remote": true,
  "required_files": [],
  "proposed_action": [],
  "verification_plan": [],
  "uncertainties": []
}
```

The remote model should also be constrained:

```json
{
  "plan": [],
  "risk_assessment": [],
  "commands_to_run": [],
  "expected_outputs": [],
  "rollback_plan": [],
  "do_not_do": []
}
```

Without contracts, routing becomes vibes. With contracts, the router can make mechanical decisions.

## Add escalation and downgrade triggers

Escalate from local to remote when:

- Tests fail twice.
- More than N files are touched.
- The task touches auth, payments, security, deployment, or database migrations.
- Data deletion is required.
- The error is unfamiliar.
- The user goal is ambiguous.
- Local confidence is below 0.7.
- The diff exceeds 200 lines.
- Relevant documentation cannot be found.
- The model produces contradictory assumptions.

Downgrade to local when:

- The task matches an existing template.
- There is a clear schema.
- Only one file is involved.
- Dry-run succeeds.
- Tests pass quickly.
- No sensitive data is involved.
- The system has handled similar tasks successfully before.

## Memory makes routing better

The router should record decisions and outcomes:

```json
{
  "task": "modify github action",
  "route": "local_first_remote_review",
  "local_model": "qwen-7b",
  "remote_model": "flagship",
  "cost": 0.13,
  "time": "45s",
  "tests_passed": true,
  "human_correction": false,
  "final_outcome": "success"
}
```

Over time it can learn:

- Which tasks local models often get wrong.
- Which tasks never need remote review.
- Which prompt patterns are too expensive.
- Which tools fail most often.
- Which areas of a repository need stronger reasoning.

This turns the router from a rule-based script into an adaptive system.

## A practical MVP

Do not start with a giant platform. Start with a small `llm-router.yaml`:

```yaml
models:
  local_fast:
    provider: ollama
    role: scout_executor
    privacy: high
    cost: zero

  remote_smart:
    provider: remote
    role: architect_reviewer
    privacy: medium
    cost: high

privacy:
  never_send_remote:
    - ".env"
    - "*.pem"
    - "secrets/**"
    - "private/**"

critical_paths:
  - "auth/**"
  - "payment/**"
  - "database/migrations/**"
  - ".github/workflows/**"
  - "infra/**"

routes:
  local_only:
    conditions:
      - files_touched <= 1
      - risk <= low
      - reversible == true

  local_first:
    conditions:
      - risk <= medium
      - context_spread <= medium

  remote_plan_local_execute:
    conditions:
      - context_spread == high
      - ambiguity == high

  remote_review_required:
    conditions:
      - touches_critical_path == true
      - irreversible == true

escalation:
  - test_failed_count >= 2
  - files_touched > 5
  - confidence < 0.7
  - security_keywords_detected == true
```

This is enough to make routing explicit. It also forces every escalation to have a reason.

## The principle

The future is not "local models for cheap tasks and remote models for hard tasks." That is too shallow.

The better architecture is a hybrid cognitive system:

```text
Local model  = fast, private, cheap, close to the environment
Remote model = deep, abstract, judgment-oriented, good at review
Router       = decision center
Tool layer   = reality check
Human        = high-risk approver
```

The most valuable design pattern is this:

**Remote models should produce high-quality rules, plans, reviews, and judgments. Local models should turn them into repeatable, executable, verifiable workflows.**

That is how you choose between local and remote LLMs without turning every task into a model-selection debate.
