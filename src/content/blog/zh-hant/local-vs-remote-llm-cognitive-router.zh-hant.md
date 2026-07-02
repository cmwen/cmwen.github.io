---
title: "本地還是遠端 LLM？不要只靠直覺，打造認知路由器"
description: "一套實用框架，從風險、隱私、上下文、成本、可驗證性與可逆性，判斷任務該交給本地 LLM、遠端模型，還是混合編排。"
lang: "zh-hant"
author: "Min Wen"
pubDatetime: 2026-07-02T10:00:00Z
tags:
  ["ai", "llm", "local-first", "automation", "agent-orchestration", "privacy"]
featured: true
draft: false
baseSlug: "local-vs-remote-llm-cognitive-router"
translatedFrom: "local-vs-remote-llm-cognitive-router"
llmKeyIdeas:
  [
    "本地與遠端 LLM 決策框架",
    "混合 AI 系統的認知路由器",
    "隱私感知的 LLM 路由",
    "遠端規劃本地執行",
    "本地初稿遠端審查",
    "LLM 任務風險評分",
    "AI agent 工具權限閘道",
  ]
---

「這個任務應該用本地 LLM 還是遠端 LLM？」這個問題看似簡單，但其實問錯了層級。

更好的問題是：**這個任務需要哪一種思考？它會碰到什麼資料？如果模型做錯，錯誤是否可以接受？**

本地模型不只是便宜版的前沿模型。遠端模型也不應該只是「比較聰明的預設選項」。在真正可長期運作的工作流裡，它們應該扮演不同角色，並由一層小型的大腦作業系統協調。我會把這一層稱為 **Cognitive Router，認知路由器**：它根據風險、成本、隱私、上下文、可逆性與不確定性來分派工作。

目標不是盡量不用遠端模型，而是把遠端模型的高級注意力用在最值得的地方。

## 本地與遠端模型應該有不同職責

很多本地與遠端模型的討論，最後都變成「小模型 vs 大模型」。這會錯過重點。真正有用的區分是角色。

### 本地 LLM 適合做什麼

本地模型更靠近你的環境。它可以讀本地檔案、檢查 log、執行命令，也可以接觸敏感上下文，而不必把資料送出機器。

我會讓本地模型扮演這些角色：

- **偵察兵**：快速檢查任務、檔案樹、錯誤訊息或 log，判斷問題類型。
- **壓縮器**：把大型 repo、email thread 或 log 壓縮成遠端模型真正需要看的精簡摘要。
- **隱私清洗器**：在任何資料送出機器前，移除 secret、token、內部 hostname、客戶資料與個人資訊。
- **執行工人**：套用計畫、修改檔案、跑測試、重試，並產生 patch。
- **快取大腦**：處理已知、重複、低風險、模板化任務。
- **初稿生成器**：先產生粗略版本，再交給更強的模型審查。

這代表即使本地模型推理能力較弱，它仍然很有價值。它可以大幅減少遠端模型需要看到的原始上下文。

### 遠端 LLM 適合做什麼

遠端前沿模型不應該被浪費在小改動上。它更適合需要判斷的任務。

我會讓遠端模型扮演這些角色：

- **架構師**：跨檔案、跨系統、跨產品限制與長期維護成本做判斷。
- **審查者**：審查本地輸出，找出品質問題、隱藏風險與邏輯漏洞。
- **規劃者**：把模糊目標拆成具體步驟、驗收條件與回滾策略。
- **衝突仲裁者**：當測試、文件、本地模型輸出與使用者意圖互相衝突時，判斷下一步。
- **新問題處理者**：處理不熟悉的框架、混亂的技術債、模糊需求或需要創造力的設計工作。

簡單說：**本地處理量，遠端處理判斷。**

## 路由不是二選一

實用的系統不應該只有「本地」和「遠端」兩種選項，而應該有多種路由模式。

### 模式一：Local Only

適合低風險、明確、可逆、重複性高的任務。

例如：

- 修改 JSON 或 YAML config。
- 更新 README 的一小段文字。
- 根據既有模板產生 boilerplate。
- 對單一檔案做明確 refactor。
- 格式化結構化資料。
- 依照已知模式產生簡單 workflow 草稿。

判斷標準很簡單：任務清楚、上下文少、失敗成本低，而且可以快速測試，本地就足夠。

### 模式二：Remote Only

適合高抽象度、高風險或高度不確定的任務。

例如：

- 系統架構設計。
- 安全性審查。
- Migration strategy。
- Agent workflow 設計。
- 跨 repo 技術債整理。
- 大型 refactor 前的規劃。
- 新技術選型。

這些任務不是單純改字或補程式碼，而是需要深度推理與取捨。

### 模式三：Local First, Remote Escalation

這是日常工作最實用的預設模式。

流程像這樣：

```text
User task
  -> 本地 LLM 檢查並產生初稿
  -> 本地 LLM 評估 confidence、risk、missing context
  -> 低風險：本地完成
  -> 高風險或不確定：升級遠端
```

本地模型不能只回答，它應該輸出路由評估：

```json
{
  "confidence": 0.72,
  "risk": "medium",
  "missing_context": ["package manager", "test command"],
  "should_escalate": true,
  "reason": "The change touches cross-file dependencies"
}
```

模型自己的信心不一定可靠，但結構化自評可以讓 router 跟外部訊號一起判斷。

### 模式四：Remote Plan, Local Execute

這是控制隱私與成本最重要的模式。

遠端模型負責：

- 分析。
- 設計。
- 拆解步驟。
- 定義驗收標準。
- 指出風險。
- 設計回滾策略。

本地模型負責：

- 讀檔。
- 改檔。
- 跑測試。
- 產生 patch。
- 根據錯誤局部重試。

例如要把 Node 14 專案升級到 Node 22，遠端模型不需要看到整個 repository。它可以先產生一份檢查清單：

```text
檢查以下風險：
1. Babel
2. Jest
3. ESLint
4. peerDependencies
5. node-sass
6. ESM versus CommonJS
7. CI image versions
```

然後由本地模型掃描 repo，把清單對應到實際檔案與 findings。

### 模式五：Local Draft, Remote Review

這是品質與成本很平衡的模式。

本地模型先產生 patch、草稿或 script。遠端模型只看 diff、summary 和 test result，扮演 reviewer，而不是從零開始寫。

適合：

- PR review。
- Code patch。
- Prompt 改寫。
- Technical writing。
- Migration script。
- Shell script。
- GitHub Actions workflow。

遠端模型不一定要再寫一份答案。很多時候，它最有價值的角色是反對者。

### 模式六：Shadow Parallelism

對高價值決策，可以本地與遠端並行。

```text
同一任務
  -> 本地模型給快速答案
  -> 遠端模型給深度答案
  -> Router 或 judge 比較一致性、衝突、證據與風險
```

這很適合架構選型、長時間卡住的 debugging、AI agent workflow 設計，以及不能亂猜的初步分析。

價值不在於哪個模型永遠比較聰明，而是不同模型的錯誤型態不同。本地模型可能太快下結論，遠端模型可能過度設計或忽略本地限制。把兩者並排比較，反而能看見雙方盲點。

## 十個真正重要的路由指標

認知路由器需要可觀察的輸入。我會從以下十個維度評估每個任務。

### 1. Task entropy，任務熵

低熵任務有明確輸入、固定輸出格式，而且語意模糊少。這類任務通常可以用規則、模板或本地模型完成。

高熵任務則有不完整意圖、多種可能解法與重要取捨，可能牽涉架構、商業風險、安全或長期維護。這類任務應該偏向遠端。

### 2. Blast radius，爆炸半徑

問自己：如果模型做錯，影響範圍多大？

低 blast radius：

- 修改一個 Markdown 檔。
- 改 UI copy。
- 產生草稿。
- 修改非核心 config。

高 blast radius：

- 改 auth。
- 改 payment。
- 改 database migration。
- 改 deployment pipeline。
- 刪檔。
- 碰 production secret。
- 大範圍 refactor。

高 blast radius 應該觸發遠端審查，甚至 human approval。

### 3. Reversibility，可逆性

可逆任務可以透過 git diff、草稿刪除或暫時 branch 回滾。

不可逆任務包括寄 email、deploy、merge PR、刪資料、改 production config 或公開發布。

不可逆操作不應該讓本地模型單獨決定。

### 4. Context spread，上下文分散度

如果答案只依賴一個檔案，本地通常可以處理。如果需要理解 dependency、CI、runtime log、production behavior、舊 issue、PR history 和設計文件，就應該升級到遠端規劃或遠端審查。

### 5. Privacy sensitivity，隱私敏感度

我會這樣分類資料：

```text
P0 Public: public repositories and public documents
P1 Internal: private notes and non-sensitive private repositories
P2 Sensitive: email, calendar, financial data, customer data
P3 Secret: API keys, tokens, passwords, private certificates
```

路由策略：

- **P0** 可以送遠端。
- **P1** 可以摘要後送遠端。
- **P2** 應該本地優先，必要時先 redaction 再遠端推理。
- **P3** 永遠不該送遠端。

這就是本地 **Privacy Compiler** 有價值的地方：

```text
Raw data -> local scan -> secret removal -> compressed summary -> remote reasoning
```

遠端模型拿到的是抽象後的問題，不是原始敏感資料。

### 6. Cost budget，成本預算

不要用單次呼叫來決定成本。要把遠端注意力當成預算管理。

例如：

```yaml
daily_budget:
  remote_tokens: 500000
  remote_calls: 100

task_budget:
  small_fix: local_only
  debugging: max_3_remote_calls
  architecture: allow_remote_deep_reasoning
  personal_docs: local_first
```

Production incident 可以合理消耗很多遠端呼叫；config typo 不應該消耗任何一次。

### 7. Confidence calibration，信心校準

本地模型應該回報信心，但 router 不應該盲信。

更好的 confidence 需要混合模型自評與外部訊號：

```text
confidence =
  model_self_score
  + tests_passed
  + schema_valid
  + lint_passed
  + diff_small
  - touched_critical_files
  - ambiguous_user_goal
  - missing_context
```

「我很有信心」不夠。測試通過、diff 小、schema valid、沒有碰高風險路徑，才更有意義。

### 8. Verification availability，可驗證性

如果任務可以快速驗證，本地模型就可以做更多。

好的驗證訊號包括：

- TypeScript compile。
- Unit test。
- JSON schema validation。
- Markdown lint。
- Snapshot test。
- Dry run。
- AST parsing。
- ShellCheck。

如果任務很難驗證，例如架構判斷、產品策略、長期維護成本，那更強的遠端推理就更有價值。

### 9. Novelty，新穎度

有些任務是熟悉路徑，有些是陌生地形。

熟悉：

- 你常維護的 Astro site。
- 固定的 GitHub Pages deployment。
- 已知 React 或 Node stack。
- 常見 n8n workflow pattern。

陌生：

- 新框架。
- 新安全模型。
- 新 agent protocol。
- 新法規。
- 不熟悉的 infra。

新穎度高時，應該偏向遠端規劃，至少也要遠端審查。

### 10. Time criticality，時間壓力

有些任務需要快，有些需要對。

```text
Fast autocomplete -> local
Production incident triage -> local scan plus remote parallel reasoning
Architecture decision -> remote
Simple shell command -> local
Dangerous shell command -> remote review or human confirmation
```

時間壓力不一定代表用最快的模型。有時候代表本地先收集證據，同時讓遠端並行推理。

## 一個簡單的路由分數

可以先用 scoring function 起步：

```text
remote_score =
  ambiguity * 2
  + blast_radius * 3
  + context_spread * 2
  + privacy_safe_for_remote * 1
  + novelty * 2
  + irreversible_action * 3
  + user_requested_quality * 2
  - local_verifiability * 2
  - repetition * 2
  - cost_pressure * 1
```

然後對應到路由：

```text
0-3:   Local Only
4-7:   Local First, Remote Review if needed
8-12:  Remote Plan, Local Execute
13+:   Remote Deep Reasoning + Human Approval
```

這不需要第一天就很精準。重點是建立一個可觀察、可調整的決策基準。

## 工具權限比模型選擇更重要

真正危險的不只是模型是否答對，而是模型被允許做什麼。

我會這樣切分工具權限：

```text
Level 0: Read only
Level 1: Suggest changes
Level 2: Write local files
Level 3: Run tests and commands
Level 4: Git commit
Level 5: Push branch
Level 6: Create PR
Level 7: Merge, deploy, send, or delete
```

本地模型可以有較高的本地讀寫權限，但外部權限較低。遠端模型可以有高推理權限，但不一定有直接執行權。

比較安全的分工是：

```text
Remote: decides and reviews
Local: executes and touches sensitive environment
Human: approves irreversible actions
```

這比讓遠端模型直接控制所有工具安全很多。

## 建立 Context Capsule，而不是直接傾倒上下文

遠端模型應該收到高密度上下文，而不是原始雜訊。

不要把 5000 行 log 全部送給遠端。先讓本地模型聚類錯誤、抽出最相關的 30 行、建立 timeline、移除 secret，再請遠端模型推理 root cause。

對 coding work，本地模型可以產生 **Context Capsule**：

```json
{
  "task": "Upgrade Node 14 project to Node 22",
  "repo_type": "React + Redux + Jest + Babel",
  "critical_files": [
    "package.json",
    "babel.config.js",
    "jest.config.js",
    ".github/workflows/ci.yml"
  ],
  "detected_risks": [
    "node-sass present",
    "old babel-jest",
    "enzyme dependency",
    "CommonJS config files"
  ],
  "test_status": "currently failing",
  "error_summary": "...",
  "secrets_removed": true,
  "request_to_remote": "Generate migration strategy and risk-prioritized steps"
}
```

這能讓遠端模型基於壓縮後的證據推理，而不是直接吃整個 repo。

## 讓每次模型呼叫都有契約

每次模型呼叫都應該有 contract。

本地模型應該回傳結構化路由資料：

```json
{
  "task_type": "code_change",
  "risk_level": "medium",
  "requires_remote": true,
  "required_files": [],
  "proposed_action": [],
  "verification_plan": [],
  "uncertainties": []
}
```

遠端模型也應該被限制：

```json
{
  "plan": [],
  "risk_assessment": [],
  "commands_to_run": [],
  "expected_outputs": [],
  "rollback_plan": [],
  "do_not_do": []
}
```

沒有 contract，routing 就會變成靠感覺。有 contract，router 才能機械式決策。

## 加入升級與降級觸發器

遇到這些情況，應該從本地升級遠端：

- 測試連續失敗兩次。
- 修改超過 N 個檔案。
- 任務碰到 auth、payment、security、deployment 或 database migration。
- 需要刪除資料。
- 錯誤不熟悉。
- 使用者目標不清楚。
- 本地 confidence 低於 0.7。
- Diff 超過 200 行。
- 找不到相關文件。
- 模型產生互相矛盾的假設。

遇到這些情況，可以降級到本地：

- 任務完全匹配既有 template。
- 有明確 schema。
- 只涉及單一檔案。
- Dry run 成功。
- 測試快速通過。
- 沒有敏感資料。
- 系統以前成功處理過類似任務。

## 記憶會讓路由越來越好

Router 應該記錄每次決策與結果：

```json
{
  "task": "modify github action",
  "route": "local_first_remote_review",
  "local_model": "qwen-7b",
  "remote_model": "flagship",
  "cost": 0.13,
  "time": "45s",
  "tests_passed": true,
  "human_correction": false,
  "final_outcome": "success"
}
```

長期下來，它可以學到：

- 哪些任務本地模型常做錯。
- 哪些任務其實不需要遠端審查。
- 哪些 prompt pattern 成本太高。
- 哪些工具最常失敗。
- 哪些 repo 區域需要更強推理。

這會讓 router 從 rule-based script 慢慢變成 adaptive system。

## 一個可落地的 MVP

不要一開始就做巨大平台。先從一個小的 `llm-router.yaml` 開始：

```yaml
models:
  local_fast:
    provider: ollama
    role: scout_executor
    privacy: high
    cost: zero

  remote_smart:
    provider: remote
    role: architect_reviewer
    privacy: medium
    cost: high

privacy:
  never_send_remote:
    - ".env"
    - "*.pem"
    - "secrets/**"
    - "private/**"

critical_paths:
  - "auth/**"
  - "payment/**"
  - "database/migrations/**"
  - ".github/workflows/**"
  - "infra/**"

routes:
  local_only:
    conditions:
      - files_touched <= 1
      - risk <= low
      - reversible == true

  local_first:
    conditions:
      - risk <= medium
      - context_spread <= medium

  remote_plan_local_execute:
    conditions:
      - context_spread == high
      - ambiguity == high

  remote_review_required:
    conditions:
      - touches_critical_path == true
      - irreversible == true

escalation:
  - test_failed_count >= 2
  - files_touched > 5
  - confidence < 0.7
  - security_keywords_detected == true
```

這已經足以讓 routing 顯性化，也能強迫每次升級都有理由。

## 最後的原則

未來不是「便宜任務用本地模型，困難任務用遠端模型」。這太粗糙了。

更好的架構是一套 hybrid cognitive system：

```text
Local model  = fast, private, cheap, close to the environment
Remote model = deep, abstract, judgment-oriented, good at review
Router       = decision center
Tool layer   = reality check
Human        = high-risk approver
```

最有價值的設計模式是：

**遠端模型產生高品質規則、計畫、審查與判斷；本地模型把這些東西變成可重複、可執行、可驗證的日常流程。**

這樣你就不需要每次都糾結「到底該用本地還是遠端 LLM」。真正的答案是：先設計一個會判斷的 router。
