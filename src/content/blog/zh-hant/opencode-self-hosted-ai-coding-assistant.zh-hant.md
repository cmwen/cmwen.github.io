---
lang: "zh-hant"
translatedFrom: "opencode-self-hosted-ai-coding-assistant"
baseSlug: "opencode-self-hosted-ai-coding-assistant"
title: "OpenCode：從任何地方編寫代碼，使用您的個人 AI 開發伺服器"
description: "OpenCode 的伺服器模式如何改變了我的工作流程 — 在桌面上啟動長期運行的任務，並從您的手機、平板電腦或網絡上的任何位置檢查進度。"
author: "Min Wen"
pubDatetime: 2026-01-18T00:00:00Z
tags: ["ai", "coding", "tools", "developer-experience", "remote-development"]
featured: true
draft: false
llmKeyIdeas: ["遠程 AI 編程", "伺服器-客戶端架構", "後台運行任務", "個人開發伺服器", "靈活工作流程"]
---

## 目錄

## 問題：被困在開發機器上

以下是我經常遇到的一個場景：我正在進行一項複雜的代碼重構。AI 正在幫助我逐個文件地工作，更新函數簽名、修復類型錯誤、更新測試。進展順利，但需要時間 — 可能需要 20-30 分鐘才能完成。

我的筆記本電池只有 15%。我需要在 5 分鐘內參加一個會議。我應該：
- 停止工作並失去動力？
- 在會議期間保持筆記本打開，希望電池能堅持？
- 急著尋找電源插座？

或者更糟的是 — 你在下班前開始了一個全面的測試套件重寫。你想在吃晚餐時檢查它是否完成，但你無法做到，因為 AI 助手被綁定在你的工作機器上。

**這是傳統 AI 編程工具的隱形摩擦。** 它們功能強大，但會讓你被束縛在一台設備、一個位置、一個特定時刻。在一個我們可以在任何地方檢查電子郵件、在手機上查看文檔、跨時區異步協作的時代，為什麼 AI 輔助編程應該有所不同呢？

## 「頓悟時刻」：OpenCode 的伺服器模式

我在尋找重型 IDE 集成的替代品時發現了 [OpenCode](https://github.com/anomalyco/opencode)。它擁有 **77,700+ GitHub 星標** 並持續增長，是最受歡迎的 AI 編程助手之一。但吸引我注意力的是：**OpenCode 具有內置遠程訪問的客戶端/伺服器架構**。

我讀到伺服器模式的那一刻，一切都豁然開朗。如果我可以：
- 在我的桌面或家庭伺服器上運行 OpenCode
- 從本地網絡上的任何位置訪問它
- 啟動一項長期的重構任務並關閉我的筆記本
- 在咖啡休息時從手機檢查進度
- 在晚上從平板電腦上繼續工作

這不僅僅是一項技術功能 — **這是一種根本不同的工作方式**。與其需要保持連接的同步、會話綁定編程不同，你可以進行異步、後台運行的任務執行。即使你走開，伺服器也會繼續運行。

讓我向你展示這在實踐中的樣子。

## 我的新工作流程：沒有邊界的編程

### 早上：啟動伺服器

我啟動我的桌面機器（一台強大的工作站，整天都保持開啟），並以伺服器模式啟動 OpenCode：

```bash
# 在我的桌面上
opencode serve --port 8080 --hostname 0.0.0.0
```

那個 `--hostname 0.0.0.0` 標誌至關重要 — 它使伺服器可以從本地網絡上的其他設備訪問，而不僅僅是 localhost。伺服器啟動，我看到：

```
OpenCode server running on:
  http://192.168.1.100:8080
  http://desktop.local:8080
```

現在 OpenCode 運行在我的桌面上，準備接受來自我家庭網絡上任何設備的連接。

### 從我的筆記本：遠程連接

在我的筆記本上，我連接到遠程伺服器：

```bash
opencode attach http://192.168.1.100:8080
```

或者如果我更喜歡網絡界面（在平板電腦和手機上效果很好）：

```bash
# 在伺服器上
opencode web --port 8080 --mdns

# 然後在瀏覽器中打開：
# http://desktop.local:8080
```

mDNS 支持非常出色 — 無需記住 IP 地址。你的桌面使用友好的主機名在網絡上進行自我宣布。

### 神奇之處：後台運行任務

這就是工作流程轉變發生的地方。我正在進行一個大型代碼庫遷移 — 在 50+ 個文件中從 JavaScript 遷移到 TypeScript。通過 OpenCode 終端用戶界面 (TUI)，我描述了任務：

> "Convert all JavaScript files in src/ to TypeScript. Add proper type annotations, update imports, and ensure strict type checking passes."

OpenCode 開始逐個文件地工作。我可以實時看到進度。但這就是關鍵：**我不需要注視它**。

- 我關閉筆記本去開會
- OpenCode 伺服器在我的桌面上繼續運行
- 重構在後台繼續進行
- 當我開完會後，我拿出我的手機

### 從我的手機檢查進度

我在 iPhone 上打開 Safari，導航到 `http://desktop.local:8080`。網絡界面加載，顯示我：
- 當前任務進度（50 個文件中的 32 個已轉換）
- 最近做出的更改
- 需要注意的任何錯誤或問題

我甚至可以與它互動 — 批准建議的更改、提出澄清問題或調整方法 — 所有這一切都可以在我走回辦公桌時從手機上完成。

### 晚上：從停下的地方繼續

那天晚上，我在沙發上用平板電腦。我打開相同的網絡界面，看到遷移已完成。我查看更改、運行測試套件（也是通過 OpenCode），然後合並拉取請求。

**我從未回到我的桌面。** 工作發生在那裡，但我保持移動和靈活。

## 工作原理：技術基礎

### 客戶端/伺服器架構

與作為本地進程運行的傳統 IDE 擴展不同，OpenCode 分離了關注點：

```
桌面/伺服器（始終運行）
├── OpenCode 伺服器進程
├── 文件系統訪問
├── 項目上下文
├── AI 提供者連接
└── 長期運行任務

客戶端（自由連接/斷開）
├── 終端 (opencode attach)
├── 網絡瀏覽器 (opencode web)
├── IDE 集成 (via MCP)
└── 移動設備
```

伺服器維護狀態，因此你可以斷開連接並重新連接而不會丟失上下文。在筆記本上啟動任務，在手機上檢查進度，在平板電腦上完成 — 一切都正常運行。

### mDNS：零配置發現

`--mdns` 標誌啟用多播 DNS，這意味著網絡上的設備可以自動發現伺服器。無需手動 IP 配置，無需 DNS 伺服器 — 只需 `desktop.local:8080` 或你命名的任何機器。

```bash
# 伺服器宣布自己
opencode web --port 8080 --mdns

# 客戶端可以自動發現它
# 或只需使用：http://[hostname].local:8080
```

當你有多台機器時，這特別優雅。你的筆記本可以發現你的桌面的 OpenCode 伺服器，而無需任何手動配置。

### 安全考慮

**重要提示：** 我展示的命令是 **僅限本地網絡使用**。`0.0.0.0` 綁定使伺服器可以從你的局域網訪問，而不是互聯網。這完美適用於：
- 家庭網絡
- 辦公室網絡
- VPN 連接

如果你需要互聯網級別的訪問，你需要添加適當的身份驗證並使用 HTTPS（OpenCode 通過反向代理配置支持）。

## 真實用例：這如何改變了我的工作

### 會議期間的長期重構

**場景：** 我有 2 小時的會議，但我也有一項全面的重構任務。

**使用 OpenCode 伺服器模式之前：**
- 等到會議後再開始
- 或啟動它並希望我的筆記本電池能堅持
- 或回到暫停/失敗的會話

**使用 OpenCode 伺服器模式：**
- 在第一個會議前開始重構
- 關閉我的筆記本，參加會議
- 在會議之間從手機檢查進度
- 查看最後一個會議後的完成工作

**節省的時間：** 2 小時的生產力本來會因上下文切換而損失。

### 週末附帶項目，無需坐在桌前

**場景：** 我想在週末進行我的附帶項目，但我不想被困在辦公桌前。

**之前：**
- 坐在我的開發機器的辦公桌前
- 或隨身攜帶重型筆記本
- 或跳過附帶項目

**使用 OpenCode 伺服器模式：**
- 伺服器 24/7 運行在桌面上
- 在沙發上用平板電腦工作
- 在休息期間快速從手機檢查
- 無縫切換設備

**獲得的自由：** 在我家的任何地方編程，不僅僅是我的桌子。

### 測試和 CI/CD 集成

**場景：** 我更新了測試 fixture，想要重新生成所有測試快照 — 一個需要 10+ 分鐘的過程。

**之前：**
- 啟動進程並等待
- 或啟動它並冒著忘記它的風險
- 或手動編寫腳本（額外的工作）

**使用 OpenCode 伺服器模式：**
- 通過 TUI 要求 OpenCode 重新生成測試
- 走開，做其他事情
- 從任何設備檢查完成狀態
- 在方便時查看更改

**減少的心理開銷：** 無需上下文切換或觀看長期運行的任務。

### 午餐時間進行代碼審查

**場景：** 我想進行同事 PR 的徹底代碼審查，但我在遠離辦公桌吃午餐。

**之前：**
- 等到回到辦公桌
- 或在 GitHub 移動上進行膚淺的審查
- 或縮短午餐

**使用 OpenCode 伺服器模式：**
- 在手機/平板電腦上訪問 OpenCode 網絡界面
- 要求對 PR 進行全面分析
- 帶著完整上下文查看 AI 見解
- 留下詳細反饋

**獲得的靈活性：** 根據我自己的時間表進行富有成效的代碼審查，而不是被束縛在辦公桌上。

## 逐步設置指南

### 先決條件

你需要：
- 一台可以保持運行的桌面或伺服器（或在工作時間可以保持運行）
- 同一本地網絡上的其他設備（筆記本、手機、平板電腦）
- 基本的命令行熟悉度

### 安裝

**選項 1：直接安裝（推薦）**
```bash
# macOS/Linux
curl -fsSL https://opencode.ai/install.sh | sh

# 驗證安裝
opencode --version
```

**選項 2：Docker**
```bash
# 拉取官方映像
docker run -it --rm ghcr.io/anomalyco/opencode

# 用於持久伺服器：
docker run -d \
  --name opencode-server \
  -p 8080:8080 \
  -v $(pwd):/workspace \
  ghcr.io/anomalyco/opencode:latest \
  serve --port 8080 --hostname 0.0.0.0
```

**選項 3：Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'
services:
  opencode:
    image: ghcr.io/anomalyco/opencode:latest
    ports:
      - "8080:8080"
    volumes:
      - ./workspace:/workspace
      - ./config:/root/.config/opencode
    command: serve --port 8080 --hostname 0.0.0.0
    restart: unless-stopped
```

```bash
docker-compose up -d
```

### 設置你的訂閱

這是殺手級功能：**OpenCode 可以與你現有的 AI 訂閱集成**。無需為每個工具購買單獨的許可證。

```bash
# 在 OpenCode 的 TUI 中，運行 /connect 並使用你現有的訂閱進行身份驗證：

# 使用你的 GitHub Copilot Pro �訂閱
/connect → Search "GitHub Copilot" → Browser opens to github.com/login/device (follow prompts)

# 使用你的 Claude Pro 訂閱
/connect → Search "Anthropic" → Select "Claude Pro/Max" → Browser opens for authentication

# 使用你的 ChatGPT Plus/Pro 訂閱
/connect → Search "OpenAI" → Select "ChatGPT Plus/Pro" → Browser opens for authentication

# 或者如果你願意，可以使用直接 API 密鑰
/connect → Select "Manually enter API Key" → Paste your API key

# 或試試 OpenCode Zen（按使用付費，無月費）
/connect → Search "OpenCode Zen" → Sign up and get API key
```

這的妙處在於：**你為所有訂閱使用相同的 TUI/CLI 界面**。無需為不同工具的不同提供者之間進行上下文切換。

你也可以使用環境變量或配置文件：

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
export GITHUB_TOKEN=ghp_...

opencode  # 自動獲取憑證
```

### 啟動伺服器

```bash
# 本地網絡上的基本伺服器
opencode serve --port 8080 --hostname 0.0.0.0

# 使用網絡界面和 mDNS
opencode web --port 8080 --mdns

# 使用特定提供者
ANTHROPIC_API_KEY=sk-ant-... opencode serve --port 8080 --hostname 0.0.0.0
```

**查找你的伺服器地址：**

```bash
# 獲取你的本地 IP
# 在 macOS/Linux 上：
ifconfig | grep "inet " | grep -v 127.0.0.1

# 你會看到類似的內容：
# inet 192.168.1.100 netmask 0xffffff00 broadcast 192.168.1.255
```

你的 OpenCode 伺服器將在 `http://192.168.1.100:8080` 可訪問（用你的實際 IP 替換）。

### 從其他設備連接

**從終端（筆記本/桌面）：**
```bash
opencode attach http://192.168.1.100:8080
# 或
opencode attach http://desktop.local:8080
```

**從網絡瀏覽器（任何設備）：**
在任何網絡瀏覽器中打開 `http://192.168.1.100:8080` 或 `http://desktop.local:8080`。

**專業提示：** 在手機/平板電腦上為快速訪問添加書籤。

## 統一層：所有訂閱的一個界面

這是我使用它一段時間後沒有完全欣賞的東西：**OpenCode 充當所有 AI 訂閱的統一界面**。

想想看：
- 你有 GitHub Copilot Pro 用於代碼完成
- 你有 Claude Pro 用於複雜推理任務
- 你有 ChatGPT Plus 用於常見問題
- 你可能有專門的模型，如 DeepSeek 或 Groq

通常，你會在不同的工具之間切換 — 編輯器中的 Copilot、Claude 網站、另一個標籤中的 ChatGPT。上下文碎片化，工作流程被打斷。

使用 OpenCode，你通過 TUI 中的 `/connect` 身份驗證所有訂閱：

```bash
/connect
# Select "GitHub Copilot" → Authenticate
# Select "Anthropic" (Claude Pro) → Authenticate
# Select "OpenAI" (ChatGPT Plus) → Authenticate
```

現在，無論你在桌面、手機還是平板電腦上，你都可以從相同的界面 **要求 AI 代理為工作選擇最佳工具**。需要快速迭代代碼結構？使用 Copilot。需要深度架構分析？切換到 Claude。需要集思廣益？使用 ChatGPT。

這讓人想起了 GitHub Copilot 的遠程代理功能 — 但 **開放、靈活且自托管**。你沒有被鎖定在特定的提供者。當你已經有多個 AI 服務時，你不需要為另一個訂閱付費。

這更像是擁有一個可以訪問多個 AI 工具並知道何時為每種情況使用哪個的遠程編程合作夥伴。

## 超越遠程訪問：其他 OpenCode 功能

雖然遠程訪問是改變我工作流程的原因，但 OpenCode 還有其他值得一提的引人入勝的功能。

### 模型上下文協議 (MCP) 支持

OpenCode 對 MCP（Anthropic 連接 AI 到外部工具和數據源的標準）的支持非常好。這意味著你可以使用以下功能擴展 OpenCode：

- **文件系統訪問**用於深度代碼庫理解
- **數據庫連接**用於查詢生成和分析
- **GitHub 集成**用於 PR 審查和問題管理
- **自定義工具**特定於你的工作流程

示例配置：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/project"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    }
  }
}
```

### 代理系統

OpenCode 在內部使用基於代理的架構。雖然你通過 TUI 進行交互而不是針對每個操作的特定 CLI 命令，但理解代理系統有助於你獲得更好的結果：

- **上下文感知推理** - 代理理解你的項目結構
- **多步驟規劃** - 將複雜任務分解為可管理的步驟
- **工具使用** - 代理可以編輯文件、運行命令、搜索代碼庫
- **驗證** - 內置的變更測試和驗證

### 提供者靈活性

OpenCode 支持 75+ 個 LLM 提供者，包括：
- **主要提供者：** OpenAI、Anthropic、Google Gemini
- **開源模型：** 通過 Ollama、LM Studio
- **專門提供者：** Groq、Together AI、Perplexity
- **本地模型：** 完全離線開發

根據任務要求切換提供者：
- Claude 用於複雜推理
- GPT-4 用於廣泛知識
- DeepSeek 用於代碼特定任務
- 本地 Llama 用於隱私敏感工作

### GitHub Actions 集成

你可以在 CI/CD 管道中運行 OpenCode：

```yaml
name: AI Code Review
on: [pull_request]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: anomalyco/opencode/github@latest
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

這為你提供自動化代碼審查、測試生成、文檔更新以及更多功能 — 全部集成到你現有的工作流程中。

## OpenCode 是什麼（以及不是什麼）

### OpenCode 是：
- ✅ 一個具有伺服器/客戶端架構的靈活 AI 編程助手
- ✅ 提供者不可知（支持 75+ 個 LLM 提供者）
- ✅ **與現有 AI 訂閱集成**（GitHub Copilot Pro、Claude Pro、ChatGPT Plus/Pro 通過 OAuth）
- ✅ 自托管，對基礎設施有完全控制
- ✅ 可從網絡上多個設備訪問
- ✅ 對異步、長期運行的編程任務效果很好
- ✅ 可通過 MCP 和自定義集成進行擴展
- ✅ 開源，擁有 77,700+ GitHub 星標

### OpenCode 不是：
- ❌ 一個 IDE（它是一個與任何編輯器集成的編程助手）
- ❌ 限於 CLI 命令 — 大多數交互發生在 TUI 中
- ❌ 專注於實時自動完成（這不是它的優勢）
- ❌ 代碼理解的替代品（它是一個增強工具）

## 按照自己的方式編程的自由

我最喜歡 OpenCode 伺服器模式的不僅僅是技術能力 — 它是 **它能夠實現的心態轉變**。

以前，我的開發工作流程受以下因素限制：
- 物理位置（我的辦公桌）
- 單一設備（我的筆記本）
- 持續注意力（保持連接或失去進度）

現在，我的工作流程是：
- **不受位置限制** - 從我網絡上的任何地方工作
- **設備靈活** - 手機、平板電腦、筆記本 — 無論什麼都有意義
- **異步生產力** - 啟動任務並在準備好時返回

這對以下人群特別有價值：
- **父母**需要經常步開
- **遠程工作者**要處理多項責任
- **附帶項目愛好者**在零散時刻編程
- **任何人**重視靈活性而不是僵化

## 今天開始使用

如果你對這個工作流程感興趣，以下是開始的方法：

1. **安裝 OpenCode** 在可以保持運行的機器上
2. **啟動伺服器**，使用 `opencode serve --port 8080 --hostname 0.0.0.0`
3. **從另一台設備連接**並嘗試一項簡單任務
4. **體驗異步編程的自由**

你不必完全承諾。在你想要這個工作流程時運行伺服器，在你不需要時使用本地 OpenCode。它被設計為融入你現有的流程，而不是完全替代它。

## 結論：靈活開發的未來

AI 編程助手很強大，但大多數仍然是圍繞傳統假設設計的：你在你的辦公桌上，在一台機器上，完全專注。OpenCode 質疑這些假設。

通過採用伺服器/客戶端架構，OpenCode 實現了更靈活、異步、多設備工作流程。在筆記本上啟動重構，在手機上檢查進度，在平板電腦上完成。AI 伺服器在你享受生活時保持運行。

這不僅僅是關於遠程訪問 — 它是關於 **將自己從同步、會話綁定開發的約束中解放出來**。這是關於讓 AI 協助適應你的時間表、你的設備、你的生活。

如果你厭倦了被困在開發機器上，如果你想按照自己的方式編程，那就試試 OpenCode。個人遠程開發工作流程可能只是改變你對編程的看法。

## 資源

- **GitHub 存儲庫**：[github.com/anomalyco/opencode](https://github.com/anomalyco/opencode)（77,700+ 星標）
- **官方文檔**：[opencode.ai/docs](https://opencode.ai/docs)
- **安裝指南**：[opencode.ai/docs/installation](https://opencode.ai/docs/installation)
- **伺服器模式文檔**：[opencode.ai/docs/server](https://opencode.ai/docs/server)
- **MCP 集成**：[modelcontextprotocol.io](https://modelcontextprotocol.io)

---

*你試過遠程 AI 編程工作流程嗎？什麼阻止你脫離開發機器？我很想聽聽你對靈活開發設置的看法。*
