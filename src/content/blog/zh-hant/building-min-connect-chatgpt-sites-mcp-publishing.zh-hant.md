---
title: "我用 ChatGPT Sites 打造 Min Connect：讓對話直接連到 LinkedIn 與部落格"
description: "從 ChatGPT 對話到 MCP 發布工具：實際串接 LinkedIn 與 GitHub Pages 部落格，並探索雙語文章、安全性與可攜性的工程取捨。"
author: "Min Wen"
pubDatetime: 2026-10-18T06:24:27.617Z
lang: "zh-hant"
draft: false
tags: ["MCP","ChatGPT","AI Agents","Developer Tools","GitHub Pages"]
baseSlug: "building-min-connect-chatgpt-sites-mcp-publishing"
translatedFrom: "building-min-connect-chatgpt-sites-mcp-publishing"
---

我不少想法，其實都是從跟 ChatGPT 討論開始的。可能是在思考 AI coding agent 是否還需要完整的 IDE，也可能是研究某個架構的取捨。聊到一半，常常會覺得：「這個觀點應該可以整理成一篇文章。」

但接下來的流程就很不順：請 AI 整理內容、複製文字、打開 LinkedIn 或部落格、貼上、調整格式，最後才發布。

我開始想：**既然想法是在 ChatGPT 裡慢慢形成的，為什麼不能直接從這段對話完成發布？**

## 把發布功能接回 ChatGPT

我目前主要有兩個發表管道。LinkedIn 適合分享比較短的技術觀點；個人部落格則使用 Astro 與 GitHub Pages，放需要更多脈絡的文章。

我的目標不是再做一套完整的 CMS，而是讓這兩個管道共用一個連接器。於是我用 **ChatGPT Sites** 做了一個叫 **Min Connect** 的小工具，讓它管理帳號連線，再透過 MCP（Model Context Protocol）把操作能力提供給 ChatGPT。

整體概念並不複雜：

```text
ChatGPT conversation
        |
        v
Min Connect (MCP tools + connected accounts)
        |
        +----> LinkedIn
        |
        +----> GitHub blog repository
                    |
                    v
                GitHub Pages
```

這樣分工很符合我想要的方式：ChatGPT 協助討論、整理與改寫；Min Connect 負責跟平台溝通；而內容要不要正式發出去，仍由我決定。

## 第一次實際驗證

我把 LinkedIn 帳號，以及部落格使用的 GitHub repository `cmwen/cmwen.github.io` 連上 Min Connect。

目前這個 MCP 提供幾個基本操作：

- `list_connections`：確認有哪些平台已連線。
- `create_draft`：建立草稿，不直接公開。
- `get_draft`：讀回草稿，方便檢查。
- `publish_draft`：確認後再發布。

我用來測試的第一篇 LinkedIn 貼文，主題是：**AI coding agent 還需要完整的 IDE 嗎？**

這是我最近真的在思考的問題。我希望貼文先講自己的觀察，再加入 AI 的不同角度，最後把問題丟給其他開發者。

我不想讓 AI 代替我思考，而是希望它幫我把想法表達清楚，也提醒我有哪些地方值得重新檢視。

最後，我透過 Min Connect 成功發布了這篇 LinkedIn 貼文：[查看實際貼文](https://www.linkedin.com/feed/update/urn%3Ali%3Ashare%3A7517454463574495232/)。

接著，我也用同一個連接器，把這次實驗整理成 GitHub 部落格草稿。不過這裡要分清楚：**LinkedIn 的發布流程已經實際跑通；部落格草稿儲存成功，不代表我已驗證完整的公開部署流程。**

## MCP 的價值，不是省掉 API

從工程角度看，這當然還是 API 整合。LinkedIn 和 GitHub 都有各自的授權、權限與錯誤處理問題，MCP 不會神奇地把這些事情消除。

真正改變的是操作介面。

我可以直接在對話裡說：「把剛剛的討論整理成 LinkedIn 貼文」，或是「延伸成一篇技術文章」。對 AI 來說，背後是一組可以呼叫的工具；對我來說，卻不用每次切換到另一套編輯介面。

其中我最在意的設計，就是**建立草稿與正式發布必須分開**。LLM 很適合協助寫作，但公開發文是另一回事。內容公開之前，我還是希望能親自檢查。

## 中英文配對，不只是多做一次翻譯

我的部落格也支援英文和台灣繁體中文。這讓發布流程多了一個有趣的需求：兩篇文章必須能被視為同一篇內容的不同語言版本。

在 Astro repository 裡，英文文章放在 `src/content/blog/`，繁中版本則放在 `src/content/blog/zh-hant/`。繁中 frontmatter 使用 `lang: "zh-hant"`，並透過 `baseSlug` 和 `translatedFrom` 對應到英文原文。

但我覺得更重要的是內容本身。台灣繁中版本不該只是逐句翻譯，而是要用台灣開發者熟悉的語氣重新組織，保留原文的技術細節、判斷與不確定性。

目前我正在測試以兩份關聯草稿處理這件事；這跟已經完成「一次操作、原子性發布雙語文章」還有一段距離。

## 還沒解決的幾個問題

這次實驗跑通後，我反而更想弄清楚幾件事。

**可攜性。** 用託管式 AI 建站服務很快，但如果有一天想換平台，原始碼、部署設定和資料能不能順利搬走？擁有自己的網域，不等於完全掌握應用程式的可遷移性。

**其他 Agent 能不能共用。** 理想上，我希望 Codex 等本機工具也能使用同一個 MCP 端點。不過傳輸協定、身分驗證和實際用戶端相容性，都還需要測試。

**安全與權限。** 能替我公開發文的工具，必須有適當的權限範圍、明確的發布確認，以及失敗後可以查清楚狀態的機制。

**文章生命週期。** 建草稿、發布只是起點。未來還會需要預覽、修改紀錄、更新已發布文章，以及同步雙語版本。

## 我真正想測試的是什麼？

一開始只是覺得：為什麼想法已經在 ChatGPT 裡整理好了，還得自己複製貼上？

但做完這個小工具，我開始看到另一種可能。

也許未來有些個人工具，不一定都要做成一個需要我反覆打開、操作的完整應用程式。它們可以先把能力提供給 AI agent，自己的介面則專注在帳號管理、檢查結果和權限控制。

這不代表工程問題消失了，而是工程工作的重心改變了：少做一些重複的操作介面，多花心力把真正會改變外部狀態的動作設計好。

而這篇文章本身，也是實驗的一部分：我在 ChatGPT 裡整理想法，再透過自己做的 Min Connect 把它存成草稿。

如果是你，你會願意讓 AI 幫忙準備內容，但把最後的發布決定留給自己嗎？又有哪些操作，你會堅持一定要有獨立的 App 介面？
