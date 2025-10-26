---
title: "Ship Private Android Apps with GitHub Releases and Obtainium"
description: "How to self-sign Android APKs, automate GitHub Actions releases, and use Obtainium to install custom builds without the Play Store."
author: Min Wen
pubDatetime: 2025-10-26T09:33:44.000Z
modDatetime: 2025-10-26T09:33:44.000Z
lang: en
slug: ship-private-android-apps-with-github-releases-and-obtainium
baseSlug: ship-private-android-apps-with-github-releases-and-obtainium
featured: false
draft: false
tags: ["Android", "DevOps", "GitHub Actions", "Self-hosting", "Mobile"]
llmKeyIdeas:
  - "Self-signed APK pipeline"
  - "GitHub Actions release flow"
  - "Obtainium app updates"
  - "Private Android distribution"
  - "Indie mobile DevOps"
---

# Ship Private Android Apps with GitHub Releases and Obtainium

I love tinkering with Android apps, but sharing them through the Play Store has always felt like overkill for small teams, internal tools, or personal forks of open source projects. This month I finally connected all the dots: sign the APK yourself, publish each build to GitHub Releases, and let [Obtainium](https://github.com/ImranR98/Obtainium) keep your phone up to date. The trio forms a lightweight distribution channel that is private, auditable, and completely under your control.

## Why a Play-Store-Free pipeline still matters

Google Play solves payments, discovery, and staged rollouts, yet it also forces you into policy reviews, storefront copy, and regional compliance. When you only need to share a binary with coworkers or friends:

- **Zero gatekeeping** – no submission queue, no “Rejected for metadata” emails.
- **Predictable updates** – every tag in git maps to a signed artifact you own.
- **Better forks** – experiment with upstream projects, then ship your variant without waiting for maintainers.
- **Offline-friendly** – releases live on GitHub’s CDN, so you can script downloads or archive them long term.

The only hard requirement from Android’s side is that the APK is signed consistently. Once you own that step, everything else becomes a packaging decision.

## Keep the signing key simple and safe

Generate a keystore once, store it like any other credential, and never check it into git:

```bash
keytool -genkey -v -keystore indieapps.jks -alias release \
  -keyalg RSA -keysize 4096 -validity 10000
```

Drop the `.jks` in your password manager or an encrypted storage bucket, then base64-encode it for CI (`base64 indieapps.jks | pbcopy`). GitHub secrets such as `ANDROID_KEYSTORE_B64`, `ANDROID_KEY_ALIAS`, and `ANDROID_KEY_PASSWORD` keep workflows deterministic. If you lose the keystore you lose upgrade paths, so schedule a periodic integrity check and consider a printed recovery sheet stored offline.

## Automate the release loop in GitHub Actions

My entire pipeline fits in a single workflow: tag a release, build the APK, sign it, and upload the artifact. The key lines are:

```yaml
- uses: actions/checkout@v4
- run: ./gradlew assembleRelease
- run: echo "$ANDROID_KEYSTORE_B64" | base64 --decode > release.jks
- uses: r0adkll/sign-android-release@v1
  with:
    releaseDirectory: app/build/outputs/apk/release
    signingKeyPath: release.jks
    alias: ${{ secrets.ANDROID_KEY_ALIAS }}
- uses: softprops/action-gh-release@v2
  with:
    files: app/build/outputs/apk/release/*.apk
```

Swap in Bazel, Buck, or even a Nix derivation if you prefer, but keep three invariants: the APK is built fresh, signed within CI (not locally), and published alongside release notes. I also pin Java 21 and pnpm versions to avoid drift between laptops and the build runner.

## GitHub Releases plus Obtainium = DIY OTA

GitHub Releases act as a friendly CDN with version history, checksums, and optional prereleases. Obtainium consumes that feed effortlessly:

1. Install Obtainium on your Android device.
2. Tap **Add App → GitHub**.
3. Paste the repository URL and toggle prereleases if you want nightlies.
4. Grant storage permission so Obtainium can stage APKs for installation.

From there, Obtainium watches the release RSS feed, downloads the latest APK when a new tag appears, verifies signatures, and launches the installer intent. It feels like a bespoke OTA server without any backend code.

## Operational tips that keep the loop tight

- **Document key rotation** – drop a calendar reminder a year before the keystore expires so you can roll it without panic.
- **Annotate releases** – Obtainium shows the GitHub release body, so call out required migrations or feature flags.
- **Segment channels** – push betas as `v1.4.0-beta.1` and stable builds as `v1.3.2`; Obtainium users can subscribe to whichever channel they trust.
- **Smoke-test each artifact** – download the GitHub-hosted APK once per release to confirm signing and install success outside Obtainium.
- **Backup the feed** – mirror Releases to GitHub Packages or S3 so you have disaster recovery if a repo ever goes private.

None of this replaces the Play Store when you need billing or mass-market reach, but for hobby projects, enterprise tools, or privacy-first forks it is liberating. GitHub Actions does the signing, GitHub Releases keeps an immutable audit trail, and Obtainium handles discovery plus installation. That combination lets me focus on building instead of wrestling with app-store bureaucracy, and it makes my Android side projects feel just as polished as anything living behind Google’s storefront.
