---
title: "在 Coding Agents 時代，PR Review 應該從 Intent 開始"
description: "當 Coding Agent 寫出愈來愈多實作內容時，真正該審查的對象不只是 diff，而是這次變更是否仍然符合使用者意圖、限制條件與專案目標。"
lang: "zh-hant"
translatedFrom: "en"
baseSlug: "pr-review-should-start-with-intent"
author: "Min Wen"
pubDatetime: 2026-05-07T21:54:13.772Z
modDatetime: 2026-05-07T21:54:13.772Z
tags: ["ai", "code-review", "pull-requests", "software-engineering", "agents"]
featured: false
draft: false
llmKeyIdeas:
  [
    "意圖優先審查",
    "why how what 框架",
    "審查代理輸出",
    "代理交接脈絡",
    "Jira 可追溯性",
  ]
---

PR review 正在改變。

在傳統工作流程裡，審查者通常會看著一個 diff，然後提出幾個熟悉的問題：程式碼正確嗎？可讀嗎？符合架構嗎？會不會引入風險？這些問題依然重要。但當愈來愈多實作是由 coding agent 產生時，它們已經不再是全部工作內容。

審查最困難的部分，往往不是變更的語法本身，而是這次變更是否仍然反映原始的使用者意圖。

這正是我一直反覆想到的轉變。模型品質很重要，任務難度也很重要。模型愈弱，或任務愈難，你就愈需要仔細檢查程式碼本身。但無論模型品質如何，你真正要審查的，其實是是否對齊：

1. **Why**：為什麼會提出這個變更？
2. **How**：原本打算如何解決這個問題？
3. **What**：哪些內容是刻意改動的，哪些內容是刻意保持不變的？

如果這三件事不清楚，coding agent 完全可能交出一個看起來很乾淨的 PR，卻依然偏離重點。

## 為什麼在 coding agents 時代，intent 更重要

Coding agents 很擅長產出「看起來合理」的實作。也正因如此，審查才更需要脈絡，而不是更少。

Agent 可以讀取整個 repository、找到既有模式，然後產生一份通過 lint 和 build 的成果。它甚至可能看起來比匆忙提交的人類 commit 更工整。但「看起來對」不等於「對這個需求來說是對的」。

落差通常出現在一些對需求提出者而言很明確、卻沒有真正進入 diff 的限制條件：

- 不要新增新的 service
- 保持現有使用者流程不變
- 避免儲存個人資料
- 不要超出內部政策或合規邊界
- 因為這只是實驗，所以要優先考慮可逆性

這些都是 intent 層級的要求。除非有人先把它們寫下來，否則它們很少會在逐檔案審查時清楚浮現。

這也是為什麼我認為，在 agent 時代的 PR review，應該先從 intent 開始，而不是先從程式碼開始。程式碼是證據，intent 才是契約。

## 但有沒有反例？

這裡其實有一個很合理的反駁。

有些情況下，審查者確實**應該**從程式碼開始。

如果一個變更碰到 concurrency、cryptography、access control、data migration、parser、billing path，或是 safety-critical workflow，那麼實作細節本身就可能是主要風險來源。在這些情況下，光說一句「intent 看起來不錯」是不夠的。審查者需要深入檢查邏輯，有時甚至要逐行閱讀。

我認為這是對我論點最好的反例，而且確實很有說服力。

但即便如此，我仍然不會放棄 intent-first review，我會選擇把它說得更精確。

Intent-first review **不**等於 intent-only review。它的意思是：你先建立好這次變更的契約，知道實作應該優先優化什麼、哪些限制最重要、哪些區域需要更深入地檢查。對高風險變更來說，intent 會告訴審查者該對哪裡保持懷疑。它不會取代 code review，而是幫助你排序審查優先順序。

換句話說：

- 對低風險變更來說，intent 可能會在你花很多時間看 diff 之前，就先揭露這個 PR 根本方向錯了。
- 對高風險變更來說，intent 會告訴你 diff 裡哪些部分值得最深入的檢查。

這仍然比你對著一個技術上很工整、卻完全不知道它原本要解決什麼問題的 PR 來得更好。

## 為什麼工具鏈會讓這件事更加明顯

當你把 coding agents 與現代工程防護欄（guardrails）結合時，這個轉變會更清楚。

Linting、type checking、code formatting，以及標準化測試自動化依然都很有價值。事實上，它們會變得更有價值，因為它們把審查中最機械化的部分先處理掉了。優秀的 coding agent 通常能把格式弄對、滿足 type checker，也遵循常見的 repository 慣例。這不代表人類審查者變得不重要，而是代表人類應該把注意力放在別的地方。

如果機器和工具鏈已經能抓住大部分語法錯誤、風格漂移，以及明顯失誤，那麼稀缺的人類審查時間，就應該投注在更困難的問題上：

- 我們是否真的解決了對的問題？
- 我們是否仍然在原本範圍內？
- 我們是否遵守了產品、安全與營運限制？
- 這個實作是否引入了隱藏耦合或長期成本？

這就是為什麼我把 intent 視為審查的放大器。它能幫助人類把注意力放在自動化最不擅長的地方。

## 很多 commit message 的問題

多數 commit message 仍然是在一個「每一行程式碼都由人類親手寫出、審查者也能自行還原脈絡」的世界裡被最佳化的。

即使是不錯的 commit 風格，很多時候也只是在摘要變更：

```text
feat(auth): add login throttling
```

這當然有用。Conventional Commits 提供了清楚的 type、可選 scope、簡短 description，以及可選 body 和 footers。這對 changelog 和自動化都很方便。但光靠這一行，它依然主要只是在告訴我**發生了哪一類變更**，而不是完整說明這次變更背後的 intent。

Git 本身其實也已經內建了 commit message 結構化 trailers 的概念。這代表團隊不需要重新發明一套全新做法，只需要在既有 commit 慣例上，額外加入少量結構化脈絡即可。

換句話說：保留摘要行，但把 intent 明確寫出來。

## 一個更好的預設：要求 Why、How 與 What

如果一個 repository 經常使用 coding agents，我認為每一個非 trivial、由 agent 產生的變更，都應該帶上一段精簡的 intent 區塊，放在 commit message、PR description，或兩者都有。

例如：

```text
feat(auth): add login throttling for repeated failures

Why: reduce credential-stuffing risk on the public login form
How: use the existing edge KV store for per-IP and per-account counters
What: add throttling middleware, Retry-After header, and security audit events
Constraints: no new stateful service, no change to the SSO flow
Out-of-scope: captcha, MFA redesign, admin lockout UI
```

這不是官僚化，而是把審查需要的脈絡壓縮成一種人類和工具都能使用的格式。

這樣一來，審查者就能提出更好的問題：

- 這個實作真的有使用既有基礎設施嗎？
- Agent 是否其實還是改動了 SSO 路徑？
- 這些 audit events 是否符合內部 logging policy？
- out-of-scope 的項目是否真的被遵守？

如果沒有這些脈絡，審查者很可能把時間花在檢查風格細節上，卻錯過真正的失敗模式。

## 一個具體例子

想像某位產品經理提出一個小型安全改善需求：讓公開登入頁面在連續登入失敗後變慢。這個 intent 很聚焦：降低濫用風險、不要增加太多營運負擔、也不要改變正常使用者的 happy path。

Coding agent 可能會產出一個技術上很扎實的 PR，引入 Redis-based rate limiting、新的部署設定、一個背景清理工作，以及更積極的 lockout 畫面。從表面看，這些都可能顯得很厲害。程式碼也可能結構良好，測試全部通過。

但它仍然可能是錯的變更。

為什麼？

因為原始 intent 並不是「請打造你能想到最具擴充性的 throttling system」，而是「在既有的產品與營運限制內降低濫用」。

審查者需要足夠的脈絡，才能明確指出：

- 新增 Redis 依賴違反了「不要新增 service」的限制
- lockout UI 改動超出了原本要求的使用者體驗範圍
- 這個實作可能會讓合法使用者更常需要聯繫客服
- 相比原始需求，這個方案更難回滾

這樣的審查，比起爭論函式命名，要有價值得多。

## 這對人類審查為什麼重要

當人類審查者與 coding agents 一起工作時，他的角色已經不只是檢查程式碼品質，而是作為最後一道驗證者，確認機器生成的實作仍然對齊人類目標。

那個目標可能是使用者價值。
可能是架構方向。
可能是安全政策。
可能是成本控制。
也可能是法律或合規邊界。

這就是為什麼 intent 應該貼近變更本身。審查者不應該被迫從 chat log、ticket 留言和猜測中重建這些資訊。

這也是為什麼「why、how、what」這個模式很有力量。它為審查者提供了一個簡短而穩定的框架：

- **Why**：檢查商業與政策是否對齊
- **How**：檢查設計選擇與限制條件
- **What**：檢查實作範圍

無論 diff 是由 junior engineer、senior engineer，還是 LLM-based coding agent 產生，這個框架都適用。

## 一個讓自動化與人類都更清楚的端到端流程

我看過最有用的模式，是在每一次交接點都把 machine-readable intent 明確寫出來。

下面是一個簡單例子：

1. 產品或工程 ticket 定義目標、限制條件與 acceptance criteria。如果團隊使用 Jira 或其他類似系統，ticket ID 就會成為可追溯鏈的一部分。
2. 開發者要求 coding agent 實作變更，並明確提供 intent 區塊：`Why`、`How`、`What`、`Constraints` 與 `Out-of-scope`。
3. Coding agent 依照這個結構產生 branch、commit message 與 PR description。commit 也可以帶上 ticket 參照，讓下游工具把程式碼與原始需求連結起來。
4. Review agent 檢查 diff、commit message 與 PR description，是否仍然對齊已宣告的 intent 與 ticket。它也可以順便驗證這次變更是否通過 repository 既有的自動化流程，例如 linting、type checking、formatting 與 tests。
5. 最後由人類審查者對取捨、例外，以及這個結果是否仍然是團隊真正想要的 outcome 做出判斷。

重點在於，每一個參與者都有不同的職責。

- Coding agent 主要優化的是實作。
- Review agent 主要優化的是對齊程度與政策檢查。
- 人類主要優化的是判斷。

這種分工很重要。它讓 AI 自動化保持有用，但不會假裝生成式程式碼可以自己解釋自己的目的。

它也讓失敗更容易提早被發現。如果 commit message 參照了 `PROJ-123`，明確寫著這次變更不能新增基礎設施，但 PR 卻還是引入了新的 managed service，那麼 review agent 就更有機會在人類投入細節之前先把不一致之處標出來。

## 團隊在實務上可以怎麼落地

我會讓這件事保持輕量。

對很 trivial 的 commit，正常的摘要行就夠了。

對非 trivial 的變更，尤其是 agent-assisted 的工作，我會要求以下其中一種：

1. 使用包含 `Why`、`How`、`What` 的 commit template
2. 在 PR description 中加入 `Intent`、`Constraints`、`Out-of-scope` 欄位
3. 用 commit-msg 或 PR lint rule，要求被標示為 agent-generated 的工作必須有這些欄位

關鍵不在於格式要多完美，而在於讓 intent 可以被審查。

如果你已經在用 Conventional Commits，這非常自然。subject line 仍然對工具有用，而 body 或 trailers 則承載給審查者與未來自動化使用的結構化 intent。

## 更深層的轉變

我認為這反映的是現代 SDLC 裡一個更大的變化。

當 coding agents 變得更強，瓶頸就會往上移。輸入實作的成本變少了，而定義目標、限制條件、acceptance criteria 與政策邊界的成本變高了。換句話說，軟體開發會變得更加以 intent 為中心。

這不會讓 review 變得不重要，反而會讓 review 更偏向語意層。

審查者愈來愈少問的是：「如果逐行來看，人類能不能把這段寫得更好？」

而愈來愈常問的是：「這個實作，是否忠實執行了那個本來就應該被批准的 intent？」

這才是我希望團隊優化的 review loop。

不只是程式碼能不能運作。
不只是 agent 聰不聰明。

而是這次變更是否仍然回答了正確的 **why**、遵循了正確的 **how**，並且把自己限制在正確的 **what**。
