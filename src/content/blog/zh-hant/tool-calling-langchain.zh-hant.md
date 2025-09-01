---
lang: zh-hant
translatedFrom: en
baseSlug: llm-tool-calling-langchain
title: "看懂 LangChain 的 Tool Calling：一步步流程與時序圖"
description: 以簡單步驟與時序圖說明 LLM 如何決定是否呼叫工具、回傳參數、取得結果並產生最終回應。
author: cmwen
pubDatetime: 2025-05-03T11:12:11.572Z
tags:
  - LangChain
  - AI 工具
  - LLM 整合
  - 時序圖
featured: true
---

流程重點：

1. 接收使用者輸入；
2. 提供可用工具與參數 schema 給 LLM；
3. LLM 判斷是否需要工具，若需要則回傳工具名稱與參數；
4. 應用程式執行工具並把結果回饋 LLM；
5. LLM 基於工具結果產生最終回應。

這種設計讓 LLM 能動態擴充能力、連結外部系統，形成可維護與可觀測的智慧流程。
