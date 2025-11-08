---
title: "Automating Android Repo Secrets with Val Town and GitHub Apps"
description: "How I stopped hand-wiring Android template repos by letting a Val Town GitHub App inject keystores and GitHub Action secrets the moment a repository is created."
author: Min Wen
pubDatetime: 2025-11-08T06:45:09.000Z
modDatetime: 2025-11-08T06:45:09.000Z
lang: en
slug: automating-android-repo-secrets-with-val-town
baseSlug: automating-android-repo-secrets-with-val-town
featured: false
draft: false
tags:
  - Android
  - GitHub Actions
  - Automation
  - Val Town
  - Developer Experience
llmKeyIdeas:
  - "Val Town GitHub App bootstrap"
  - "Android keystore distribution"
  - "Secrets templating for new repos"
  - "GitHub Actions release readiness"
  - "Lightweight DevOps for solo builders"
---

# Automating Android Repo Secrets with Val Town and GitHub Apps

I’ve maintained a private Android template repo for years. The code is ready to ship, but the boring part—the keystore, Gradle signing configs, and GitHub Actions secrets—always slowed me down. Every new project meant finding the base64-encoded `.jks`, pasting secrets into Settings → Actions, and double-checking workflow inputs before I could tag the first release. After one too many late-night copy/paste sessions, I finally fixed it with two tools I already loved: Val Town and GitHub Apps.

## The manual steps that had to die

My original checklist looked like this:

- Duplicate the Android template repository.
- Generate or retrieve a keystore, base64 it, and upload it as `ANDROID_KEYSTORE_B64`.
- Sync the alias, store password, and service account JSON for Play uploads.
- Toggle the release workflow inputs so it wouldn’t fail on the first run.

None of those tasks are hard, but they are incredibly error-prone when you do them half-asleep or on your phone. Secrets also inevitably drifted between repos because I stored variants in different password managers. The aha moment: the template already defines which secrets it needs, so why not provision them automatically the moment a repo exists?

## Why Val Town plus a GitHub App

Val Town gives me a serverless runtime with persistent storage and scheduled jobs. GitHub Apps bring scoped credentials and webhooks. I wired them together like this:

1. Create a GitHub App with `repository` read access, `actions:write`, and webhook delivery for `repository` + `installation_repositories` events.
2. Point the webhook URL to a Val (a server-side function) so new installations and repo creations trigger my code.
3. Store sensitive material—keystore (base64), alias, passwords, service account JSON—in Val Town secrets instead of in each repo.

The result is a single place to rotate credentials and a small piece of TypeScript that knows how to hydrate a repository.

## The Val that hydrates secrets

Here’s the heart of the automation. It runs inside Val Town using the official SDK and Octokit:

```ts
import { githubApp } from "npm:@valtown/sdk";

export const handleRepo = githubApp({
  appId: Deno.env.get("GITHUB_APP_ID"),
  privateKey: Deno.env.get("GITHUB_APP_PRIVATE_KEY"),
  async installation(event, octokit) {
    if (event.action !== "created") return;
    for (const repo of event.repositories_added) {
      await seedSecrets(octokit, repo);
    }
  },
});

async function seedSecrets(octokit, repo) {
  const secrets = {
    ANDROID_KEYSTORE_B64: Deno.env.get("androidKeystoreB64"),
    ANDROID_KEY_ALIAS: Deno.env.get("androidKeyAlias"),
    ANDROID_KEY_PASSWORD: Deno.env.get("androidKeyPassword"),
    PLAY_SERVICE_ACCOUNT_JSON: Deno.env.get("playServiceAccount"),
  };

  for (const [name, value] of Object.entries(secrets)) {
    await octokit.actions.createOrUpdateRepoSecret({
      owner: repo.owner.login,
      repo: repo.name,
      secret_name: name,
      encrypted_value: value!,
    });
  }
}
```

A few implementation notes:

- I keep the keystore in Val Town as a base64 blob. When the Android workflow runs, it decodes the blob back into `release.jks`.
- The GitHub App only needs permission to write Actions secrets, so it cannot accidentally push code or manage issues.
- If I ever rotate the keystore, I update one environment variable in Val Town and every future repo bootstraps with the new secret.

## GitHub Actions that are ready on day one

My Android template already includes a `release.yml` workflow that assembles, signs, and uploads artifacts to GitHub Releases. With the secrets present, the workflow runs flawlessly on the very first push:

```yaml
- name: Decode keystore
  run: echo "${{ secrets.ANDROID_KEYSTORE_B64 }}" | base64 --decode > release.jks
- name: Sign APK
  uses: r0adkll/sign-android-release@v1
  with:
    releaseDirectory: app/build/outputs/apk/release
    signingKeyPath: release.jks
    alias: ${{ secrets.ANDROID_KEY_ALIAS }}
    keyStorePassword: ${{ secrets.ANDROID_KEY_PASSWORD }}
```

No more pausing to paste credentials. I can fork the template, push the first commit, tag `v0.1.0`, and the workflow publishes a signed build minutes later. That’s the exact experience I wanted when I first sketched the template.

## What I learned

- **Centralize anything secret**. Val Town becomes my single vault, and GitHub Apps give it precise scope.
- **Prefer GitHub Apps over PATs**. Installation tokens expire quickly and follow least privilege by default.
- **Bootstrap once, reuse forever**. The template, secrets, and release workflow now act as one productized unit.

There’s room to grow—maybe auto-label issues or kick off Obtainium feed updates—but the core loop is solved. New Android repo? Click “Use this template,” wait for the GitHub App to populate secrets, and ship a release immediately. I’m not just saving time; I’m finally confident the boring parts are correct every single time.
