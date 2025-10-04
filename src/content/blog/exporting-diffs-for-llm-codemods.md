---
title: "Exporting Diffs for LLM Analysis and Codemod Generation"
description: "A practical workflow for exporting git diffs, teaching LLMs the refactor patterns, and generating codemods with test data to apply across repositories."
pubDatetime: 2025-08-26T11:12:11.572Z
author: "Min Wen"
tags:
  - developer-tools
  - codemods
  - lLM
  - automation
slug: exporting-diffs-for-llm-codemods
featured: true
---

This post explores a practical experiment: exporting git diffs that capture intentional refactor or pattern changes, feeding them to a large language model (LLM) to learn the domain knowledge behind those edits, and then either prompting the LLM to apply the same transformation to another repository or asking it to generate a codemod plus test data to validate the transformation.

Why do this? Brownfield projects evolve organically. Some useful cross-cutting tasks — security hardening, dependency updates, API shape changes, or internal API unification — are often performed manually, inconsistently, or in a way that’s hard to generalize. If you can capture the developer intent as a concise diff and teach an LLM that intent, you can accelerate applying the same pattern elsewhere.

This workflow has two complementary approaches:

- Prompt-driven application: feed the diff to an LLM, ask it to summarize the intent and produce a transformation prompt that can be used on a second repo interactively.
- Codemod-driven application: ask the LLM to generate a codemod script and synthetic test fixtures so you can run, test, and validate the change programmatically.

High-level steps

1. Produce a clean diff that represents the pattern you want to capture
   - Make commits that isolate the pattern. Use a focused branch and write small commits with clear messages.
   - Prefer unified diffs from git: git format-patch or git diff --binary between two commits or tags. The diff should contain enough context (surrounding lines) so the LLM can infer structural intent.

2. Ask the LLM to analyze the diff and extract the pattern
   - Provide the diff as the evidence artifact. If the diff is large, chunk it and label each chunk (e.g., "Change group A: API rename", "Change group B: helper extraction").
   - Request a concise summary of the transformation: what was added, removed, renamed, or restructured, and why (if not obvious from commit messages).
   - Ask for a 3–5 bullet "contract" describing inputs (file types, AST nodes, typical code shapes), outputs, and error modes.

3. Choose the application path: prompt or codemod

Prompt-driven: generate a reusable prompt

- Have the LLM produce a canonical instruction set that other LLM calls (or Copilot for-file suggestions) can follow for a target repo.
- Include examples converted from the diff (before/after snippets) and a short checklist the LLM must follow when transforming files.

Codemod-driven: generate a codemod + tests

- Ask the LLM to produce a codemod in a tool you trust (jscodeshift, ts-morph, recast, Python lib2to3/LibCST, or scalafix depending on the language).
- Crucially, request the LLM to generate synthetic test fixtures and a small harness: sample input files, expected output files, and a runner script that applies the codemod and asserts equality.

Why tests matter

When moving from human edits to automated rewrites, the risk is high: blind codemods can break behavior, formatting, or subtle edge cases. Tests let you measure coverage of the transformation and provide concrete evidence that the codemod worked for representative cases.

Designing test data from a diff

Good test fixtures should exercise common, borderline, and pathological cases. Use the diff to infer canonical shapes and then expand:

- Happy path(s): the exact examples shown in the diff (converted into minimal files).
- Variants: same pattern but with different whitespace, comment placements, or minor API differences.
- Edge cases: files missing expected imports, files with multiple occurrences in the same file, nested or concatenated patterns.
- Negative tests: files that look similar but should not change.

Ask the LLM to generate a short test matrix and concrete fixtures. Example output to request from the LLM:

- A set of 6–10 minimal input files (language-appropriate) showing the different variants.
- Corresponding expected output files after the codemod.
- A small shell script or Node/Python test runner that runs the codemod against the inputs and diffs the results against the expected outputs, exiting nonzero on mismatch.

Practical tips and limitations

- Chunk diffs sensibly. If you have thousands of changed files, split by change type and summarize uninteresting or repetitive hunks.
- Keep commits small and descriptive. The commit metadata often helps the LLM infer intent.
- Validate AST-level correctness. For languages with reliable parsers (TS/JS, Python, Go, Java), prefer AST-based codemods over regexes.
- Be skeptical: LLMs may hallucinate the rationale. Always cross-check their summary with the actual code.
- Performance: asking an LLM to apply changes across a huge monorepo one-file-at-a-time can be slow. Codemods scale better when they are accurate.

Example prompt (short)

"You are an expert in code transformations. Given the following git unified diff (or excerpt), summarize the transformation pattern in 3 bullets, produce a 4-line transformation contract (input shapes, output changes, error modes), and generate a jscodeshift codemod plus 6 input/output test fixtures and a runner script. Use AST operations and avoid fragile regex matching."

Next steps and experiment checklist

1. Try the prompt-driven approach on a small target repo to see if the LLM can correctly apply the pattern interactively.
2. Iteratively ask the LLM to refine the codemod and tests until the harness passes.
3. Once confident, run the codemod in a dry-run mode across the larger repo, inspect diffs, and land the change in small batches.

Closing thoughts

Exporting diffs into LLM-readable artifacts and using those artifacts as the seed for reusable prompts or codemods is a promising pattern for scaling manual, high-value developer work. The combination of human-authored diffs, LLM summarization, codemod generation, and programmatic test harnesses creates a feedback loop that preserves intent, provides measurable safety, and scales well when you need to apply consistent changes across many repositories.
