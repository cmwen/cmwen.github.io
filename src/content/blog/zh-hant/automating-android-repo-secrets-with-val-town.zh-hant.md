---
lang: zh-hant
translatedFrom: en
baseSlug: automating-android-repo-secrets-with-val-town
title: "用 Val Town + GitHub App 自動填滿 Android Repo Secrets"
description: "分享如何把 Val Town 當作密鑰保險箱，讓 GitHub App 在建立新 Android 專案時自動灌入 keystore 與 Action secrets，首發就能跑 release workflow。"
pubDatetime: 2025-11-08T06:45:09.000Z
featured: false
tags:
  - Android
  - GitHub Actions
  - 自動化
  - Val Town
  - 開發體驗
llmKeyIdeas:
  - "Val Town GitHub App 自動開通"
  - "Android keystore 集中管理"
  - "新 repo secrets 模板化"
  - "Release workflow 即開即用"
  - "獨立開發者的 DevOps 簡化"
---

# 用 Val Town + GitHub App 自動填滿 Android Repo Secrets

我維護了一套私用的 Android 模板很多年，程式碼早就 ready，但繁瑣的部分一直卡我：每開一個新 repo 就要手動貼 keystore、Gradle 簽章設定和 GitHub Actions secrets。半夜複製貼上不只浪費時間，也很容易漏掉欄位。這次我把一直在用的兩個工具—Val Town 和 GitHub App—串起來，終於把流程自動化。

## 必須被淘汰的手動流程

原來的 checklist 長這樣：

- 先用 template 建一個新 repo。
- 找出或重建 keystore、轉 base64、貼到 `ANDROID_KEYSTORE_B64`。
- 同步 alias、store password、Play 上傳所需的 service account JSON。
- 回到 workflow 設定頁把變數調一遍，避免首 run 就失敗。

這些動作都不難，但只要在手機上或精神不濟時操作就會出錯，最後還讓 secrets 在不同 repo 之間失去一致性。其實模板早就知道需要哪些 secrets，那為什麼不在 repo 建好的瞬間就灌進去？

## 為什麼選 Val Town 配 GitHub App

Val Town 提供有狀態的 serverless 執行環境又能存放 secrets；GitHub App 則提供 webhook 與細緻權限控管。整體 wiring 如下：

1. 建立一個 GitHub App，給 `repository` read、`actions:write` 權限，訂閱 `repository` 及 `installation_repositories` webhook。
2. 把 webhook 指到某個 Val（server-side 函式），只要有新安裝或新 repo 加入就觸發。
3. 把 keystore base64、alias、password、Play service account JSON 通通存成 Val Town secrets，集中治理。

這樣我只需要在一個地方維護憑證，再用一小段 TypeScript 讓它進入任何新 repo。

## Val 端自動灌入 secrets 的程式

核心程式碼長這樣，跑在 Val Town 裡並透過 Octokit 呼叫 GitHub API：

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

幾個重點：

- keystore 以 base64 blob 的形式放在 Val Town，workflow 再把它還原成 `release.jks`。
- GitHub App 只拿 Actions secrets 的寫入權，不會碰到程式碼或 issue 權限。
- 需要換 keystore 時只要改 Val Town 的 env，往後建立的 repo 都會得到新版憑證。

## Day 1 就能跑的 GitHub Actions

Android 模板自帶的 `release.yml` workflow 會 build、簽章、上傳 GitHub Releases。有了 secrets 之後第一次 push 就可直接成功：

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

現在我可以 fork 模板、推第一個 commit、打 `v0.1.0` tag，幾分鐘後就有已簽名的 Release artifacts，完全符合當初設計模板的初衷。

## 心得與下一步

- **所有機敏資訊集中管理**：Val Town 成為唯一的保險箱，GitHub App 則以最小權限投遞。
- **捨棄 PAT，擁抱 GitHub App**：安裝 token 具時效、權限細緻，安全性高。
- **模板 + secrets + workflow = 產品**：所有 boilerplate 打包後就能被無限重用。

接下來還想自動加上 Obtainium source、甚至標記 issue labels，但核心流程已經完成。新的 Android repo？點一次 “Use this template”，GitHub App 自動塞好 secrets，release workflow 立刻 ready，這才是我想要的開發體驗。
