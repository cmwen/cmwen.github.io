---
lang: zh-hant
translatedFrom: en
baseSlug: exporting-diffs-for-llm-codemods
title: "把差異檔變成可重複的重構：輸出 git diff，教會 LLM 產生 codemod 與測試"
description: 以 git diff 承載「人類意圖」，讓 LLM 學會重構模式，進而產生可驗證的 codemod 與測試資料，用於跨 repo 套用。
pubDatetime: 2025-08-26T11:12:11.572Z
author: Min Wen
tags:
  - 開發者工具
  - codemod
  - LLM
  - 自動化
featured: true
---

這篇分享一個實驗：將代表「重構意圖」的 diff 匯出，交給 LLM 解析出轉換模式，之後要嘛直接請 LLM 套用到目標 repo；要嘛請它產生一個 codemod 加上對應的測試治具（fixtures），讓轉換可被驗證、可被重複執行。

為什麼要這樣做？很多老專案的橫切變更（安全、相依更新、API 介面調整、內部 API 統一）常靠人工、且不易歸納。如果能把「意圖」濃縮在 diff 裡教會模型，就能在其他專案快速複用。

重點步驟摘要：

1. 產生乾淨且具代表性的 diff（小步提交、訊息清楚）。
2. 請 LLM 從 diff 萃取轉換摘要與 3–5 條「契約」。
3. 二選一：
   - 互動式：用摘要 + 範例提示，請 LLM 在新 repo 套用。
   - codemod：請 LLM 產生 codemod + 測試治具與簡易執行器。

測試很關鍵：把 diff 中的典型、變體、邊界、負例都設計進去，才能降低大規模程式改寫的風險。
