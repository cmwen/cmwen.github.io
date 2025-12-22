---
lang: "zh-hant"
translatedFrom: "en"
baseSlug: "the-2025-field-guide-to-customizing-copilot-in-vs-code"
title: "2025 年 VS Code Copilot 自訂設定完全指南"
author: "Min Wen"
description: "實用的決策框架，幫助你了解何時使用 instructions、prompt files、custom agents、agent skills 和 MCP servers，讓 Copilot 在日常工作中保持一致、安全且實用。"
pubDatetime: 2025-12-22T10:01:24.000Z
tags:
  [
    "GitHub Copilot",
    "VS Code",
    "Coding Agents",
    "MCP",
    "Developer Productivity",
  ]
featured: true
draft: false
llmKeyIdeas:
  [
    "instructions vs prompts 選擇",
    "repo vs profile 範疇",
    "agent 工具邊界",
    "MCP 信任檢查表",
    "減少設定漂移",
    "日常工作食譜",
  ]
---

# 2025 年 VS Code Copilot 自訂設定完全指南

如果你已經使用 GitHub Copilot 一段時間，你可能已經感受到*設定爆炸*。

現在有不止一種方式來「教導 Copilot」：

- Repo instructions（專案慣例）
- Path-scoped rules（不同資料夾適用不同規則）
- Prompt files（可重複使用的「指令」，按需觸發）
- Custom agents（具有邊界和交接的角色）
- Agent skills（專門工作的能力包）
- MCP servers（讓代理執行操作而非僅談論的工具）

這很好—直到不好為止。

如果你的團隊沒有選定心理模型，你會遇到：

- Agent 在不同 repo 中表現不同
- Prompt 泛濫（數十個 prompt，沒人能找到）
- 衝突的指引（「遵循風格指南」vs「忽略風格指南」）
- Tool 泛濫（MCP server 遍地都是，信任邊界不清）

本文是一份實用指南：決策框架、幾個食譜和應該避免的反模式。

## 一句話的心理模型

選擇與**範疇**（個人 vs 團隊）、**生命週期**（一次性 vs 持久）和**風險**（唯讀 vs 寫入/部署）相匹配的*最小*自訂化表面。

實際上：

- **Instructions** 設定*遊戲規則*。
- **Prompt files** 是你觸發的*可重複操作*。
- **Custom agents** 是*具有邊界的角色*。
- **Skills** 是*域能力模組*。
- **MCP servers** 是*執行工具*。

## 五種自訂化表面（它們的真正用途）

### 1) Instructions：護欄和共享上下文

**何時使用**：你想要在許多互動中保持一致性。

屬於這裡的例子：

- 如何建置、測試和 lint repo
- 架構約束（例如「保持 React 元件僅客戶端，除非必要」）
- 風格慣例（命名、檔案佈局、偏好模式）
- 安全規則（不列印祕密、不更改無關程式碼）

大多數團隊受益於保持 instructions _單調且穩定_。

在現代 Copilot 設定中，你通常會看到以下組合：

- 一個 repo 範圍內的 instruction 檔案（團隊範圍內的預設值）
- Path-scoped instruction 檔案（資料夾級規則）
- 一個面向代理的 instruction 檔案（代理應如何在此 repo 中運作）

關鍵原則：**instructions 不應是你的工作流程**。它們是約束和背景，而不是劇本。

### 2) Prompt files：日常工作的可重複「指令」

**何時使用**：你重複執行同樣的事情，且希望輸出格式一致。

Prompt files 適合：

- 從 diff 撰寫 PR 描述
- 從功能規格生成測試計畫
- 草擬遷移檢查表
- 總結 bug 調查

一個好的 prompt file 應有：

- 清晰的輸入約定（你貼上的內容）
- 清晰的輸出約定（助手必須產生的內容）
- 最少依賴隱藏上下文

把 prompt files 當作 shell alias 的等價物：快速、可重複且刻意狹窄。

### 3) Custom agents：具有邊界、工具和交接的角色

**何時使用**：任務受益於*具有約束的角色*。

例子：

- 一個**研究人員** agent，只擷取和總結（不編輯程式碼）
- 一個**審查者** agent，批評 diff 並尋找邊界情況
- 一個**測試撰寫者** agent，專注於覆蓋率和失敗模式
- 一個**發行助手** agent，遵循可重複的檢查表

custom agents 的最大好處不是「更好的 prompt」—而是**邊界設定**。

如果你的 agent 能做所有事情，它就會做。

如果你的 agent 只能做幾件事，它就變得可預測。

### 4) Agent skills：可攜帶的能力包

**何時使用**：你有時需要專門規則，且不想在每次聊天中都載入它們。

Skills 適合：

- 翻譯規則（音調、詞彙表、frontmatter 轉換）
- 播客生成步驟（文字稿偏好、CLI 指令、輸出驗證）
- 安全審查（威脅建模檢查表）

一個好的 skill 應是：

- 特定於域
- 跨 repo 可重複使用
- 易於按需叫用

如果 prompt files 是「指令」且 agents 是「角色」，skills 就更像**模組**。

### 5) MCP servers：將言語轉化為行動的工具

**何時使用**：你想讓助手*執行操作*：

- 查詢服務
- 搜尋外部系統
- 與瀏覽器自動化表面互動
- 讀取 repo 外的資源

MCP（Model Context Protocol）很強大，因為它讓工具可組合。

但這種力量伴隨著簡單的權衡：

- 更多工具 = 更多槓桿
- 更多工具 = 更多風險

所以 MCP 不是你的起點。它是當你已經了解你的工作流程時才添加的。

## 快速決策矩陣

將此表用作預設選擇。不確定時，選擇較小的表面。

| 你想要…                           | 最佳工具                 | 原因                     |
| --------------------------------- | ------------------------ | ------------------------ |
| 讓 Copilot 遵循 repo 慣例         | Instructions             | 適用於所有地方的耐久護欄 |
| 對 `/docs` vs `/src` 套用不同規則 | Path-scoped instructions | 局部規則，衝突更少       |
| 每週以相同格式重複任務            | Prompt file              | 可預測的輸入/輸出約定    |
| 建立「僅研究」幫手                | Custom agent             | 角色邊界 + 工具限制      |
| 建立多步驟工作流程，帶檢查點      | Custom agent + handoffs  | 明確轉換，人工閘門       |
| 有時載入專門域規則                | Skill                    | 按需特化                 |
| 讓 Copilot 操作外部工具           | MCP server               | 超越文本的工具執行       |

## 「雙範疇」規則：repo vs profile

減少混亂最簡單的方式之一是分離**團隊共享**和**個人**。

### 將團隊規則放在 repo 中

如果它應該對*每個*在 repo 上工作的開發者都適用，它就屬於該 repo：

- 如何執行測試和建置
- 設計約束
- 命名慣例
- 「完成」的含義

如果你的 repo 是開源或被許多貢獻者使用，repo 級別的 instructions 也充當**文件**。

### 將個人加速器放在你的 profile 中

如果它關乎*你如何工作*而不是 repo 如何工作，就把它放在個人中：

- 你偏好的「除錯檢查表」prompt
- 你的筆記或摘要風格
- 你的個人 agents（橡皮鴨、解釋者）

這讓你的團隊 repo 保持乾淨，更容易協作。

## 日常工作食譜

這些是人們過度建置的常見場景。這是簡單的預設方法。

### 食譜 1：「Copilot 總是忘記專案結構」

- 新增（或完善）repo instructions，包括：
  - 建置/測試指令
  - 關鍵資料夾及其用途
  - 風格慣例
- 只有在不同資料夾*確實*需要不同行為時，才添加 path-scoped 規則。

避免：撰寫包含你能想到的每個慣例的龐大 prompt。

### 食譜 2：「我每個衝刺都做相同的重構」

- 建立一個 prompt file，其中：
  - 要求你提供的確切輸入（diff、檔案清單或函式）
  - 輸出檢查表和建議的修補計畫

避免：如果工作是單一重複操作，就建立 custom agent。

### 食譜 3：「我想要更安全的審查」

- 建立一個審查者 agent，其中：
  - 專注於風險、測試、邊界情況
  - 限制為唯讀工具（或無工具）
  - 產生一致的審查格式

避免：在同一 agent 中混合審查者和實施者。

### 食譜 4：「我想要 agent 接觸外部系統」

- 只有在你定義了以下內容後才添加 MCP：
  - 哪些系統在範圍內
  - 什麼讀/寫邊界存在
  - 哪些行動需要明確批准

避免：啟用所有內容並希望批准 prompt 能救你。

## 反模式（看似有幫助但製造痛苦的事物）

### 1) 將 instructions 當作垃圾桶

如果 instructions 包含*太多工作流程*，它們會變得無法維護。

Instructions 應該是：

- 穩定
- 一致
- 低熵

將可重複的程序移到 prompt files 或 agent 工作流程中。

### 2) 為每項任務建立 agent

如果你建立 15 個 agents，沒人會記得用哪一個。

從以下開始：

- 1–2 個耐久 agents（例如，審查者、研究人員）
- 最常重複動作的一小組 prompt files

### 3) 各層之間的衝突規則

如果 repo instructions 說一件事，而個人 profile 說另一件事，你的輸出就會變得不可預測。

經驗法則：**一個關注點，一個真實來源**。

### 4) 無信任模型的 MCP tool 泛濫

工具就是力量。

如果你沒有定義 tool 信任邊界，你會遇到：

- 「批准疲勞」（點擊批准而不閱讀）
- 意外寫入錯誤環境
- 令人困惑的失敗和不清楚的責任

## MCP 輕量級安全檢查表

如果你正在新增 MCP servers，保持簡單：

- **最小權限**：預設偏好唯讀工具
- **按風險分類**：研究工具 vs 寫入/部署工具
- **人工檢查點**：要求對破壞性操作進行明確批准
- **可審查的成品**：偏好產生 diffs、日誌或摘要的工作流程

你不需要一個重量級安全程式—只需要一些能夠擴展的習慣。

## 快速入門套件（我會先設定的內容）

如果你想要實用的預設值：

1. **Repo instructions**：簡短、穩定，專注於建置/測試和慣例。
2. **一個審查者 agent**：一致的審查格式，最少工具。
3. **三個 prompt files**：
   - 「總結變更 + 風險 + 測試」
   - 「草擬 PR 描述」
   - 「撰寫測試計畫」
4. **MCP 最後**：只有當它解鎖可重複工作流程時才添加。

## 結尾思想：設定現在是工程的一部分

2025 年最大的轉變不是 Copilot 能寫更多程式碼。

而是*我們*現在透過 instructions、prompts、角色和工具的各層來形成助手的行為。

如果你像對待生產程式碼一樣對待這些層（清晰的所有權、小範圍、無衝突），Copilot 就不再感覺隨意，而是感覺像一個可靠的隊友。
