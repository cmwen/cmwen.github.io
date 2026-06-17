---
title: "OpenAI Codex 與 Coding Agent 的自建或採用抉擇"
description: "在我用 tmux、Tailscale 與 PWA 打造自己的 Copilot CLI 控制平面之後，Codex 讓我重新思考開發者應該自己打造什麼，又該採用平台已經做好的什麼。"
lang: "zh-hant"
author: "Min Wen"
pubDatetime: 2026-06-17T00:00:00Z
modDatetime: 2026-06-17T00:00:00Z
tags: ["ai", "codex", "copilot", "developer-experience", "coding-agents"]
featured: true
draft: false
translatedFrom: "openai-codex-build-vs-buy-coding-agents"
baseSlug: openai-codex-build-vs-buy-coding-agents
llmKeyIdeas:
  [
    "OpenAI Codex",
    "coding agent 的自建與採用",
    "個人 agent 控制平面",
    "遠端 coding 工作流程",
    "開發者生態系鎖定",
  ]
---

今天我有一種很微妙的感覺。

過去幾個月，我一直在 GitHub Copilot CLI 外面打造自己的控制平面。架構很簡單：讓 agent 跑在我信任機器上的 `tmux` 工作階段裡，用 Tailscale 提供私有連線，再包一個小型 PWA，讓瀏覽器成為遠端操作介面。這個系統真的讓我很開心，因為它改變了 coding 工作的手感。我可以從另一台裝置打開瀏覽器，交代 agent 要做什麼，查看進度，只有在需要決策時才重新介入。

這套系統不是玩具。它真的解決了我的問題：如何讓 coding agent 隨時可被觸及，而不必把我綁在某個 terminal 前面。

然後我在筆電的 WSL 環境裡安裝了 OpenAI Codex，問題突然變得有點尷尬。

Codex 已經做到很多我原本想做的事。

它可以作為本機 coding agent 運作，讀寫專案檔案系統，讓 session 與 approval 流程可見，連到遠端主機，提供 remote control 工作流程，而且透過 app surface 與 computer-use 能力，還能把觸角從 terminal 延伸到桌面工作流程。OpenAI 的 [Codex overview](https://developers.openai.com/codex/overview) 把 Codex 定位為能協助撰寫、理解、審查、除錯與自動化開發任務的 coding agent。[CLI docs](https://developers.openai.com/codex/cli/features) 描述了互動式 session、可恢復對話、遠端 app-server 連線、approval mode 與 scripting。[remote connection docs](https://developers.openai.com/codex/remote-connections) 則描述了如何從另一台裝置使用 Codex，而實際的專案、檔案、shell、plugin、browser setup 與本機工具都由被連線的 host 提供。

換句話說，我原本作為個人控制平面打造的東西，正在變成產品的一部分。

## Table of contents

## 我做的系統其實是在教我需求

我的 Copilot 控制平面來自一個很實際的煩惱：我不希望每一個 agent 任務都要求我坐在同一台機器前面。

我想要的工作流程是：

1. 從任何地方啟動 coding task。
2. 讓工作在我信任的桌機或開發機器上執行。
3. 即使瀏覽器斷線，terminal session 也要繼續活著。
4. 能查看輸出、介入、稍後再繼續。
5. 不需要為了控制自己的工具，就把服務暴露到公開網際網路。

`tmux` 解決了 session persistence。Tailscale 解決了 private access。PWA 解決了操作介面。Copilot CLI 負責實際寫程式。

回頭看，真正重要的不是實作方式，而是我在過程中發現的需求：我不想要只活在前景 terminal 裡的 coding assistant。我想要一個 agent runtime，它可以貼近我的開發環境，但也允許我在不同裝置之間移動。

這個需求現在看起來很明顯，但在我親手做出來之前，它其實沒有那麼明顯。

## 為什麼 Codex 讓我有點震撼

Codex 改變問題的原因在於，它不只是提供一個模型，而是提供一套帶有主張的 agentic development 操作介面。

這個介面包含一些自己維護起來很痛苦的能力：

- session transcript 與可恢復性
- 理解 repository 的編輯與指令執行
- approval mode 與 sandbox 邊界
- 從另一台裝置 remote control
- app、CLI、IDE、cloud、browser 與 computer-use surface
- plugin 與 MCP 整合點
- 以產品等級設計的安全模型

單看每一項，都不是不能做。難的是讓它們全部一致地運作。

我自己的系統可以讓 `tmux` session 活著，並透過瀏覽器串流 terminal。這很有用。但像 Codex 這樣的產品，試圖掌握的是整個迴圈：prompt、plan、edit、run commands、ask for approval、use tools、summarize progress，然後讓我從另一台裝置繼續。

這個企圖心比我的 PWA 大很多。

## 鎖定生態系的問題是真的

尷尬的地方在於 ecosystem lock-in。

如果我把工作流程完全搬進 Codex，我選的不只是一個更好的介面。我也在選一整組假設：

- session 如何儲存
- approval 如何建模
- tool 與 plugin 如何被暴露
- remote control 如何驗證身分
- computer use 如何被允許或拒絕
- 有多少 workflow state 會留在 OpenAI 生態系裡
- 未來功能會朝哪個方向被優先開發

這可能是很好的取捨。對大多數開發者來說，它甚至可能就是正確取捨。但它仍然是一個取捨。

風險不只是抽象的「vendor lock-in」。真正的風險是，我的個人開發工作流程會被產品預設值塑形。產品會進步得很快，但它會朝平台認為合理的方向進步。我的粗糙本機系統只有在我願意投入時才會進步，但它可以精準往我想要的方向移動。

這就是張力所在。

## 自建與採用的界線已經上移

我以前以為有價值的中間層，是個人 orchestrator：一個小型 web app、一個持久 terminal session、一個私有網路。

現在我覺得這一層正在被商品化。

Remote control、session persistence、approval prompt、command execution、diff、browser access、desktop automation，正在變成嚴肅 coding-agent 產品的標準功能。從零開始打造它們依然很有趣，但不再明顯是最值得投入時間的地方。

自建與採用的界線已經往上移了。

我大概不應該在通用 agent runtime 這件事上跟 OpenAI 競爭。那是一場長期很難打的仗：security、UX、integration、platform support、model routing、app distribution、admin control 與 documentation 都會累積優勢。個人專案可以跑得很快，但產品平台可以持續把預設體驗做得更好。

但這不代表我的系統應該死掉。

它代表我應該改變這套系統的用途。

## 我仍然會自己打造什麼

工作流程裡仍然有一些部分值得自己掌握。

我仍然會為這些事情打造本機工具：

- 編碼我自己的 task template 與 review 習慣
- 保存重要決策的 vendor-neutral log
- 在 Copilot、Codex、shell script 與內部工具之間建立橋接
- 實驗 queue、label、priority 與 task dashboard
- 在平台功能不可用時保留 fallback path
- 依照自己的工程流程塑造 prompt 與 handoff format

這和「重做一個 Codex」是完全不同的任務。

本機系統變成一個實驗室，也變成一個 adapter。它不需要掌握每一次 terminal 互動。它可以站在 agent 產品之上或旁邊，保留我真正重視的 workflow logic。

實務上，這可能代表 Codex 變成預設的執行介面，而我自己的 PWA 則變成設計任務、追蹤結果、比較 agent、保存 reusable pattern 的地方。Agent 產品負責重活。我的系統負責讓工作流程保持可攜。

## 我現在的答案

如果今天一定要做決定，我不會只選其中一邊。

在 agent runtime 與 remote-control experience 已經很強的地方，我會使用 Codex。它太有用了，不能忽略，而且這個產品很明顯正在往我原本用 `tmux`、Tailscale 與瀏覽器嘗試逼近的未來移動。

但我也會讓自己的本機系統以更窄的角色繼續存在。

真正的問題不是「我應該用 Codex，還是用自己的 orchestrator？」更好的問題是：「哪一層應該由我自己掌握？」

我不需要永遠掌握那些逐漸商品化的部分。但我確實想掌握那些編碼我工作方式的部分：

- 我如何描述任務
- 我如何判斷工作是否完成
- 我如何讓 context 在不同工具之間延續
- 我如何審查 agent output
- 我如何避免被單一產品的心智模型困住

這一層，個人系統仍然有存在價值。

## 更廣泛的開發者課題

這會成為許多開發者都會遇到的問題。

Builder 的第一個本能，是把缺的東西做出來。這個本能很好。它會教你理解領域，揭露真實需求，建立品味。但當平台吸收了相同能力之後，負責任的做法是重新評估。

不是每一個 custom system 都應該變成 infrastructure。

有時候 prototype 應該變成產品。
有時候它應該變成 plugin。
有時候它應該變成 workflow convention。
有時候它只需要變成經驗。

對 coding agent 來說，長期有價值的能力，不是知道怎麼把 CLI 包成 web app，而是知道 human judgment、local context 與 platform automation 應該在哪裡交會。

Codex 讓這個問題變得更銳利。它給了我一個比昨天更強的預設選項。它也提醒我，掌握整個 stack 不等於掌握工作流程裡最重要的部分。

目前我的答案很簡單：產品已經更好的地方就採用產品；本機系統能保留槓桿的地方就繼續保留；隨著工具進步，持續移動這條界線。

這比因為自尊而死守自己的系統，或是不假思索地把整個工作流程交出去，都更健康。
