---
lang: zh-hant
translatedFrom: en
baseSlug: using-vscode-copilot-fetch-for-rag
title: "在 VS Code 用 Copilot Fetch 做 RAG：輕量、在地、可迭代"
pubDatetime: 2024-06-12T00:00:00.000Z
author: Min Wen
description: "示範如何在 VS Code 內用 Copilot Fetch 做文件檢索增強生成（RAG），從最小可行流程到可重複的查找與回覆。"
tags:
  - RAG
  - VS Code
  - AI 工具
featured: false
---

這篇示範在 VS Code 內以 Copilot Fetch 完成輕量 RAG 流程：

1. 指定本地文件夾或倉庫作為語料。
2. 用查詢檢索片段（chunks）。
3. 讓 Copilot 根據片段作答並附來源。

重點是把流程「在地化、可迭代、可記錄」：把查詢、片段與回覆一併存檔，後續可重放或比較不同提示的效果。

實務建議：

- 先做最小可行（1–2 個資料夾）；再擴充資料集與向量化策略。
- 用固定提示模板，輸出包含來源引用與置信度。
- 設置小型 smoke test：隨機抽 3 個問題，驗證能回到正確片段。
