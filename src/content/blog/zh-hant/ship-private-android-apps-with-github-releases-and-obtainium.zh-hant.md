---
lang: zh-hant
translatedFrom: en
baseSlug: ship-private-android-apps-with-github-releases-and-obtainium
title: "使用 GitHub Releases 搭配 Obtainium 私密發佈 Android App"
description: "了解如何自簽 Android APK、透過 GitHub Actions 自動釋出，並以 Obtainium 在手機上安裝與更新不走 Play 商店的自製 App。"
pubDatetime: 2025-10-26T09:33:44.000Z
featured: false
tags:
  - Android
  - DevOps
  - GitHub Actions
  - 自架發佈
  - 行動開發
llmKeyIdeas:
  - "自簽 APK 流程"
  - "GitHub Actions 釋出"
  - "Obtainium 安裝體驗"
  - "私密 Android 發佈"
  - "獨立開發流程"
---

# 使用 GitHub Releases 搭配 Obtainium 私密發佈 Android App

我一直喜歡客製 Android App，卻很少想把作品丟上 Play 商店：要準備商店素材、對應各種政策，對於只有幾位使用者或內部團隊的專案來說成本遠大於價值。這段時間終於把理想的流程串起來：自己簽 APK、用 GitHub Actions 接管建置與釋出，再交給 [Obtainium](https://github.com/ImranR98/Obtainium) 讓手機自動偵測更新。整個鏈路輕量、可驗證，也完全掌握在自己手上。

## 為什麼仍需要非 Play Store 的管道？

Play 商店確實提供付費、曝光與漸進式上架等功能，但當你只想分送內部工具、個人實驗或開源分支時，反而會被流程絆住腳：

- **零審核等待**：打 tag 立刻產生新版本，不再被「metadata 不符」擋下。
- **完全掌控更新節奏**：每個 git tag 都對應已簽名的二進位檔，方便回溯與差異比對。
- **更自由的 fork**：可以快速測試上游專案的 patch，甚至維護自己版本的長期支援。
- **離線友善**：GitHub CDN 或任何物件儲存都能備份，少了商店封存的風險。

Android 唯一硬性要求就是「同一 App 必須持續使用相同的簽章」。一旦滿足這點，發佈管道就完全可以自己決定。

## 簽章流程：簡單但務必安全

第一步是建立 keystore，並把它當成密碼一樣保存：

```bash
keytool -genkey -v -keystore indieapps.jks -alias release \
  -keyalg RSA -keysize 4096 -validity 10000
```

把 `.jks` 用密碼管理器或加密儲存保管，再以 `base64` 編碼後放進 GitHub Secrets，例如 `ANDROID_KEYSTORE_B64`。同時記錄 alias 與密碼，因為只要遺失其中一項，就再也無法產出被系統接受的更新。建議訂個年度提醒，定期驗證 keystore 是否可讀，避免真正要發版時才發現檔案損毀。

## 用 GitHub Actions 自動化建置與釋出

整個 CI 僅需一個 workflow：收到版本 tag → 建置 release APK → 還原 keystore → 簽名 → 上傳至 GitHub Releases。核心片段如下：

```yaml
- uses: actions/checkout@v4
- run: ./gradlew assembleRelease
- run: echo \"$ANDROID_KEYSTORE_B64\" | base64 --decode > release.jks
- uses: r0adkll/sign-android-release@v1
  with:
    releaseDirectory: app/build/outputs/apk/release
    signingKeyPath: release.jks
    alias: ${{ secrets.ANDROID_KEY_ALIAS }}
- uses: softprops/action-gh-release@v2
  with:
    files: app/build/outputs/apk/release/*.apk
```

可以改成 Bazel、Buck 或 Nix，只要維持三件事：全新建置、不在本機簽名、以及自動附上變更說明。我也會鎖定 Java 21、pnpm 等版本，避免本機與 CI 產生差異。

## GitHub Releases + Obtainium 就是 DIY OTA

GitHub Releases 提供版本歷史、檔案雜湊與預發版本，非常適合作為「可公開下載但仍由我控管」的 CDN。Obtainium 則把這份 feed 變成手機直接安裝的入口：

1. 在手機安裝 Obtainium。
2. 點 _Add App → GitHub_。
3. 貼上 repo URL，若需要夜間版就勾選 _Prereleases_。
4. 授權儲存空間讓它能下載並觸發安裝。

之後只要你在 GitHub 打新 tag，Obtainium 就會偵測到、下載 APK、確認簽章，最後跳出安裝提示。整體體驗就像擁有客製 OTA 伺服器，卻完全不需要維護任何後端。

## 營運小技巧，讓流程更順

- **提早規畫 keystore 輪替**：在到期前一年設定提醒，留時間處理重新簽署。
- **好好寫 release notes**：Obtainium 會顯示 GitHub release 內文，可以在裡面註記破壞性變更或回報連結。
- **分開穩定與測試通道**：用 `v1.4.0-beta.1`、`v1.3.2` 等標記，讓使用者自由選擇追蹤哪個頻道。
- **每版實際 sideload 一次**：確認 APK 能在 Obtainium 外正常安裝，避免簽章或壓縮有問題。
- **備份整個 feed**：可同步到 GitHub Packages 或 S3，預防未來 repo 改為私有造成舊版遺失。

這套流程不會取代真正需要商店付費或大規模曝光的情境，但對獨立開發者、企業內部工具或注重隱私的 fork 來說再適合不過。GitHub Actions 負責簽章、GitHub Releases 保存可驗證的二進位檔，而 Obtainium 則把所有更新送到你的手機。整合起來後，我終於能把心力放在打造 App，而不是面對商店後台的繁瑣審核。
