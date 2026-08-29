---
name: publish-site-changes
description: Validate, commit, push, deploy, or monitor this GitHub Pages site when the user explicitly asks to publish or perform those Git/GitHub actions. Use for release preparation, conventional commits, pushes, GitHub Actions monitoring, deployment verification, and diagnosing a failed publication; never invoke implicitly for ordinary editing.
---

# Publish site changes

Treat publishing as an explicit external-write workflow. Do not commit, push, rerun a workflow,
or change remote state unless the user requested that action.

## Prepare

1. Inspect the working tree and preserve unrelated user changes.
2. Review the intended diff for secrets, generated artifacts, accidental files, stale dates,
   invalid content, and scope creep.
3. Run the checks appropriate to the change. Normally run `pnpm build`; add `pnpm lint`,
   `pnpm format:check`, or focused Playwright tests when relevant.
4. Stop and report a blocker when validation fails for unrelated work or when the intended
   publication set is ambiguous.

## Commit and push

- Stage only the intended files and re-check the staged diff.
- Use a concise conventional commit message that describes the outcome.
- Push the current branch normally. Never force-push or rewrite history unless the user
  separately and explicitly requests it after the risk is clear.
- Do not amend or replace an existing commit merely to make history tidier unless asked.

## Monitor and verify

After a requested push, inspect the relevant GitHub Actions run when tooling and access are
available. If it fails, identify the failing job and root cause before editing. Fix only failures
within the requested scope, validate locally, and publish another commit only when authorized.

For a successful deployment, verify the relevant public page or asset when practical. Report the
commit, branch, checks run, workflow/deployment status, and any remaining caveat.
