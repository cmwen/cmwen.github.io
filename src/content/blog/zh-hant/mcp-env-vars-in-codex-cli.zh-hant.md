---
lang: zh-hant
translatedFrom: en
baseSlug: mcp-env-vars-in-codex-cli
title: "Codex CLI MCP 環境變數：沙盒環境的教訓"
description: "Codex CLI 啟動 MCP 伺服器時不會自動繼承終端機的環境變數，了解沙盒差異並把設定寫進 MCP 配置裡。"
pubDatetime: 2025-10-14T00:00:00.000Z
featured: false
tags:
  - OpenAI Codex
  - MCP
  - CLI
  - 開發者體驗
llmKeyIdeas:
  - "沙盒化 MCP 伺服器不會繼承 shell 變數"
  - "Codex CLI MCP 設定最佳實務"
  - "環境變數需要明確配置"
---

# Codex CLI MCP 環境變數：沙盒環境的教訓

我在把 Codex CLI 接上本機 MCP 知識庫時遇到一個陷阱：伺服器啟動看似正常，但每個請求全部報錯。原因是我在 shell 裡設定的憑證對 MCP 執行緒完全不可見。Codex CLI 可能會在與你終端機不同的沙盒中啟動 MCP——正如你現在看到的 Codex CLI harness。一旦伺服器需要環境變數來讀取密鑰或配置，若沒在 MCP 設定中明確傳入，就會失敗。

## 沙盒環境的意外

- 接收你指令的 Codex CLI 行程，與啟動 MCP 二進位檔的行程不一定相同。當你切換審核模式或使用受管理代理時，Codex 會在隔離沙盒裡面產生新的工作流程。
- 這些工作流程只會繼承極少數變數（例如 `PATH`、`HOME` 或工具需要的 token）。你在 `.zshrc` 裡 export 的值，或是臨時輸入的 `export`，都不會穿越沙盒邊界。
- MCP 啟動速度快，但少了變數通常不會立即報明確錯誤，因此很容易誤以為是伺服器本身壞掉。

## Codex CLI 如何啟動 MCP 伺服器

Codex CLI 會讀取設定檔中的 `mcpServers` 區塊，依照裡面的命令啟動每個伺服器。在 danger-full-access 模式可能直接呼叫程式；在更嚴格的模式下則可能包在沙盒內。不管是哪一種，Codex 都會替子行程建立全新環境。除非你自己指定，預設只有 Codex 主動注入的變數會存在。

這個行為是刻意設計的：它讓遠端代理可重現、避免洩露主機密鑰，也能確保審核政策可執行。代價就是你不能再依賴隱含的 shell 狀態。

## 明確傳入環境變數

把 MCP 設定視為配置的唯一來源：

```jsonc
{
  "mcpServers": {
    "kb": {
      "command": "npx",
      "args": ["@cmwen/min-kb-mcp", "serve"],
      "env": {
        "OPENAI_API_KEY": "${env:OPENAI_API_KEY}",
        "MCP_LOG_LEVEL": "debug",
        "WORKSPACE_ROOT": "/Users/cmwen/dev/cmwen.github.io",
      },
    },
  },
}
```

- `env` 是單純的 key→value 映射，Codex 會在伺服器程序啟動時注入。
- `${env:VAR_NAME}` 會在主機有對應變數時讀取，讓你可以重複利用既有的密鑰而不必硬編進檔案。
- 直接填字串則能提供機器間一致的預設值。

## 工作流程小撇步

- **寫下需求契約。** 在 MCP README 清楚列出所有必填變數，未來你或其他人才能快速補齊。
- **從伺服器內部檢查。** 啟動時加上一個列出 `process.env` 的診斷或紀錄，先確認值有進來，再排查業務邏輯。
- **把密鑰納入安裝流程。** 若透過自動化佈署 Codex 代理，請在佈署階段就輸入所需變數，而不是指望代理之後自己繼承。
- **模擬生產環境。** GitHub MCP bridge 與 Codex Remote Agents 的行為相同。只要在本機明確設定 `env`，部署到雲端也會正常。

## 重點整理

- 沙盒化的 MCP 伺服器不會吃到隨意 export 的 shell 變數，設定要寫在 Codex 配置裡。
- 明確的 `env` 區塊可避免在不同審核模式或代理間切換時出現「只在我這台能跑」的問題。
- 盡早確認環境變數是否就位，可以省下花在排查健康 MCP 伺服器的冤枉工時。
