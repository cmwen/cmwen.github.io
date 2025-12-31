---
lang: "zh-hant"
translatedFrom: "2025-year-in-review"
baseSlug: "2025-year-in-review"
title: "2025：AI 驅動開發與個人成長的一年"
author: Min Wen
description: "對 27 篇部落格文章的全面回顧，追溯我在 AI 編碼代理、開發工具、個人實驗以及 2025 年軟體開發演進中的旅程。"
pubDatetime: 2025-12-31T12:00:00.000Z
tags: ["yearly-review", "ai", "coding-agents", "reflection"]
featured: true
llmKeyIdeas:
  [
    "AI 編碼演進",
    "工具調用模式",
    "代理式開發流程",
    "個人工作流",
    "開發者生產力",
    "持續 AI 採用",
    "學習實驗",
    "年度回顧",
  ]
---

# 2025：AI 驅動開發與個人成長的一年

當我坐下來回顧 2025 年時，我深刻感受到變化之大——不僅是我使用的技術，更是我對軟體開發本身的思考方式。這一年產出了 27 篇部落格文章，每一篇都是學習、實驗，有時是意外發現的快照。回首過去，我看到一個清晰的敘事正在浮現：**2025 年是 AI 編碼代理從新奇事物轉變為必需品的一年，而我學會了將它們視為夥伴而非工具**。

但這還不是全部的故事。這一年也是關於走出舒適圈——進入影片製作、自架系統，甚至用 LLM 生成客製化書籍章節。這是關於在混亂中找到模式，建立真正有效的心智模型。

讓我帶你走過這段旅程。

---

## 第一部分：基礎——理解 LLM 的真正運作方式（五月）

這一年從深入基礎開始。我需要理解的不僅是 LLM _能做什麼_，更是它們_如何做到_。五月的三篇文章奠定了基礎：

### **工具調用與 RAG 革命**

在 ["Understanding LLM Tool Calling in LangChain"](https://cmwen.com/posts/llm-tool-calling-langchain/)（5 月 3 日）中，我拆解了 LLM 如何從生成文字轉變為實際_做事_的機制。工具調用並非魔法——它是一種結構化的方式，讓 LLM 能夠調用函式、獲取資料並與系統互動。這個看似技術性的主題成為之後一切的基礎。

僅僅幾天後，["Unlocking the Power of VS Code Copilot: Using #fetch for RAG"](https://cmwen.com/posts/using-vscode-copilot-fetch-for-rag/)（5 月 14 日）展示了這些概念如何應用於我的日常工作。VS Code Copilot 中的 `#fetch` 工具讓我能夠引入外部上下文——文件、API 規格、程式碼範例——將 Copilot 從程式碼補全器轉變為研究助理。這是我第一次實際體驗**檢索增強生成（Retrieval-Augmented Generation, RAG）**，它改變了我處理複雜編碼任務的方式。

### **AI 時代的資料庫**

接下來是持久化的問題。在 ["RDB vs Vector DB in LLM Financial App"](https://cmwen.com/posts/rdb-vs-vector-db-in-llm-financial-app/)（5 月 10 日）中，我比較了關聯式資料庫與向量資料庫在 LLM 驅動應用中的應用。答案並不簡單——這取決於你需要結構化交易還是語義相似性搜尋。

然後是 ["Why Modern PostgreSQL is a Game-Changer for AI Agents"](https://cmwen.com/posts/postgresql-ai-agents/)（5 月 22 日），揭示了 PostgreSQL 已經超越了其傳統角色。有了 pgvector、全文搜尋和 JSON 支援，它可以同時處理關聯式和向量工作負載。這是一個啟示：**你不總是需要採用最前沿的資料庫來建構 AI 驅動系統**。有時候，老牌技術的適應速度比我們預期的還快。

### **學習的新方式**

["Idea: Learn a Book Before Reading It"](https://cmwen.com/posts/idea-learn-a-book-before-reading-it/)（5 月 11 日）記錄了一個主動學習的實驗。我不再被動地從頭到尾閱讀書籍，而是使用 LLM 在深入閱讀_之前_生成摘要、提取關鍵概念並制定問題。這顛覆了傳統的學習模式——從被動吸收轉向主動探索。

回顧這些五月的文章，它們都是關於**建立心智模型**。我正在學習 AI 輔助開發的語法：工具調用、RAG、向量搜尋和主動工作流。這些不僅僅是技術——它們是新工作方式的基石。

---

## 第二部分：Copilot 編年史——駕馭高級功能與權衡（八月至十月）

到了年中，GitHub Copilot 已成為我工作流程的核心。但格局正在快速變化。新功能、新定價模式和新的心智模型都需要關注。

### **升級與適應**

["Reflections on Upgrading to GitHub Copilot Pro"](https://cmwen.com/posts/reflections-on-upgrading-to-github-copilot-pro/)（8 月 10 日）標誌著一個轉折點。從企業版 Copilot 切換到 Copilot Pro 迫使我重新思考資源管理。突然間，我有了**進階請求（premium requests）**需要管理——每月配額需要策略性思考。我學會將進階請求留給高價值任務，如程式碼審查和複雜設計工作，同時使用標準模型進行例行實作。

後續文章 ["Copilot Pro Tips: Monthly Premium Reset and a Model Bakeoff"](https://cmwen.com/posts/copilot-pro-monthly-reset-and-model-bakeoff/)（8 月 31 日）分享了實用策略：追蹤進階重置、執行模型比較，以及使用 IndexedDB 離線儲存偏好設定。這不僅僅是使用工具——而是在面對實際限制時**優化工作流程**。

### **CLI 爭論**

CLI 工具成為熱門話題。在 ["GitHub Copilot CLI: Why the Pricing Model Matters"](https://cmwen.com/posts/copilot-cli-pricing-model-comparison/)（10 月 5 日）中，我檢視了 GitHub 將 Copilot CLI 設為僅限進階版本的決定。這不僅是定價決策——更是 GitHub 如何看待價值和採用障礙的信號。

一週後，["Copilot CLI vs Codex CLI: Terminal AI Assistants Compared"](https://cmwen.com/posts/copilot-cli-vs-codex-cli/)（10 月 12 日）將兩個終端助理進行正面比較。雖然 Copilot CLI 有企業支持，Codex CLI 提供了 MCP 伺服器支援和更大的靈活性。這個比較突顯了一個更廣泛的真理：**沒有一種適用所有情況的 AI 編碼工具**。情境很重要。

### **配置複雜性**

["Codex CLI MCP Environment Variables: Lessons from the Sandbox"](https://cmwen.com/posts/mcp-env-vars-in-codex-cli/)（10 月 14 日）記錄了一個令人沮喪但重要的教訓：MCP 伺服器需要明確的環境變數配置。看似錯誤的東西實際上是設計決策——這迫使我對工具設定更加謹慎。

到了十二月，我累積了足夠的經驗來撰寫 ["The 2025 Field Guide to Customizing Copilot in VS Code"](https://cmwen.com/posts/the-2025-field-guide-to-customizing-copilot-in-vs-code/)（12 月 22 日）。這篇文章將數月的實驗綜合成一個實用框架：何時使用指令 vs. 提示檔案 vs. 自訂代理 vs. MCP 伺服器。關鍵洞察？**減少配置漂移**，建立清晰的邊界和慣例。

Copilot 系列文章不僅僅是產品評論——它們是對**如何思考 AI 輔助開發**的探索。它們迫使我面對權衡、管理資源，並建立超越個別功能的心智模型。

---

## 第三部分：代理式 SDLC——重新思考軟體開發（八月至十一月）

2025 年最具轉型意義的主題是**代理式軟體開發生命週期（agentic SDLC）**的出現。這不是要取代人類開發者——而是用能夠承擔明確任務的 AI 代理來增強工作流程，同時讓人類保持在循環中。

### **人在迴路中的操作手冊**

["Agentic SDLC: Human-in-the-Loop Playbook"](https://cmwen.com/posts/agentic-sdlc-human-in-the-loop-playbook/)（8 月 25 日）提出了一個實用框架。核心原則：**代理應該自動化重複性工作，人類應該處理創造性工作**。這意味著定義清晰的交接點、建立防護機制，以及建構讓代理能快速迭代而人類提供方向和驗證的工作流程。

這個操作手冊成為我這一年剩餘時間的參考點。它影響了我處理程式碼審查、差異分析，甚至文件的方式。

### **Codemod 與差異工作流程**

["Exporting Diffs for LLM Analysis and Codemod Generation"](https://cmwen.com/posts/exporting-diffs-for-llm-codemods/)（8 月 26 日）解決了一個特定問題：如何利用 LLM 進行大規模程式碼轉換。透過匯出 git 差異並輸入給 LLM，我可以生成能在整個程式碼庫中應用一致性變更的 codemod。這是**代理式重構**——讓 AI 處理機械性工作，而我專注於邏輯。

### **從研究到工程**

["From Research to Engineering: Understanding the Critical Transition"](https://cmwen.com/posts/from-research-to-engineering/)（9 月 2 日）探討了一個微妙但關鍵的區別。研究是關於探索可能性；工程是關於優化已證實的解決方案。AI 編碼代理在後者表現出色——接受定義明確的問題並高效實施解決方案。但它們在前者遇到困難，那裡創造力和直覺占主導地位。

這篇文章幫助我理解**代理在開發過程中的定位**。它們不是通用問題解決器——它們是執行的專門工具。

### **標準化代理指令**

["AGENTS.md: A New Standard for Unified Coding Agent Instructions"](https://cmwen.com/posts/agents-md-a-new-standard-for-unified-coding-agent-instructions/)（9 月 13 日）介紹了我立即採用的慣例：將代理指令儲存在標準化的 `AGENTS.md` 檔案中。這使得引入新代理、共享配置和維持專案間一致性變得更容易。

後續文章 ["The Rise of Personal Forks: Customizing Open Source with AI Coding Agents"](https://cmwen.com/posts/personalizing-open-source-with-coding-agents/)（9 月 14 日）探討了一個引人入勝的後果：**AI 代理讓個人分支變得可行**。開發者不再需要向維護者請求功能，而是可以使用代理來為自己的需求客製化開源專案。這使客製化民主化，但也引發了關於分散化和可維護性的問題。

### **多代理模式**

到了十一月，一個模式正在浮現。["Multi-Agent Systems Beyond VSCode: A Pattern Emerges"](https://cmwen.com/posts/multi-agent-pattern-vscode-autogen-sdlc/)（11 月 13 日）串連了 VS Code 自訂代理、AutoGen 和代理式 SDLC 之間的點。這些系統都共享一個共同架構：**具有明確角色的專門代理，由監督者協調**。這不僅僅是技術模式——它是思考 AI 協作的心智模型。

### **選擇正確的模式**

["Choosing the Right AI Coding Agent: Remote, CLI, or IDE Mode?"](https://cmwen.com/posts/choosing-the-right-ai-coding-agent/)（11 月 30 日）將這些洞察綜合成一個實用指南。何時應該使用遠端編碼代理如 GitHub Copilot Workspace？何時 CLI 模式更好？何時應該留在 IDE 中？答案取決於任務複雜性、迭代速度以及對人類監督的需求。

代理式 SDLC 系列文章是關於**重新設計工作流程**。它們挑戰了關於軟體如何建構的假設，迫使我批判性地思考 AI 在哪裡增加價值——以及在哪裡不能。

---

## 第四部分：超越程式碼——個人實驗與支線任務（九月至十二月）

2025 年並非全都是關於 AI 編碼。一些最有收穫的文章來自與軟體開發無關的個人實驗——或者至少不是直接相關。

### **自架與隱私**

["Continuous E-book Reading Across Devices with KOReader and Syncthing"](https://cmwen.com/posts/koreader-syncthing-ebook-sync/)（9 月 20 日）記錄了我建構完全離線、自架電子書同步解決方案的旅程。沒有雲端依賴，沒有追蹤——只有 KOReader 和 Syncthing 和諧運作。這是關於**奪回數位生活的控制權**。

同樣地，["Ship Private Android Apps with GitHub Releases and Obtainium"](https://cmwen.com/posts/ship-private-android-apps-with-github-releases-and-obtainium/)（10 月 26 日）展示了如何自簽 Android APK 並透過 GitHub Releases 分發。後續文章 ["Automating Android Repo Secrets with Val Town and GitHub Apps"](https://cmwen.com/posts/automating-android-repo-secrets-with-val-town/)（11 月 8 日）用 Val Town GitHub App 自動化了繁瑣的部分。這些文章是關於**建構個人基礎設施**——小型、可靠的系統，為你服務而不是與你對抗。

### **踏入影片領域**

["From Code to Camera: My Journey into Video Production"](https://cmwen.com/posts/venturing-into-video-editing)（9 月 23 日）記錄了我初次涉足影片錄製和剪輯。作為軟體開發者，我以處理程式碼的相同心態來處理影片：快速迭代、從錯誤中學習，並建構可重複使用的範本。結果？對故事敘述有了新的欣賞，以及分享想法的新媒介。

### **AI 增強學習**

["AI-Enhanced Reading: Generating Custom Book Chapters with LLMs"](https://cmwen.com/posts/ai-enhanced-reading-custom-chapters/)（12 月 20 日）重新審視了五月的主動學習主題。我不僅是總結書籍，而是使用 LLM 來_延伸_它們——生成客製化章節，透過經典想法的鏡頭探索當代主題。例如，我要求 LLM 為 David Epstein 的《Range》撰寫一章「AI 時代的範圍」。結果是研究基礎洞察與現代情境的發人深省融合。

這個實驗突顯了一個更廣泛的真理：**LLM 可以以傳統媒體無法做到的方式個人化學習**。它們不取代作者——它們將作者的想法延伸到作者可能未涵蓋的領域。

這些個人實驗是關於**探索**。它們提醒我，當技術服務於人類好奇心而不僅僅是生產力時，它最有價值。

---

## 第五部分：產業趨勢與大賭注（十月至十一月）

雖然 2025 年的大部分時間都在進行實際實驗，但我也花時間思考更廣泛的產業趨勢。幾篇文章捕捉了這些反思：

### **持續 AI 與 GitHub 的願景**

["Why GitHub is Betting on 'Continuous AI' (And What It Means for You)"](https://cmwen.com/posts/why-github-is-betting-on-continuous-ai/)（11 月 19 日）探討了 GitHub 朝向**持續 AI（Continuous AI）**的戰略轉向——CI/CD 之後的下一個演進。正如 CI/CD 自動化測試和部署一樣，持續 AI 旨在自動化程式碼審查、重構，甚至功能實作。這不僅僅是產品公告——它是關於軟體開發未來的信號。

### **發現問題**

["The Discovery Problem: How Will Agents Find Your WebMCP Tools?"](https://cmwen.com/posts/webmcp-discovery-problem/)（11 月 21 日）解決了 WebMCP 最大的未解挑戰：工具發現。如果每個組織都發布 MCP 工具，代理如何找到並信任它們？這篇文章探討了潛在解決方案——註冊表、信任網路和語義搜尋——但得出結論：**尚未出現明確的贏家**。發現仍然是一個開放問題。

### **Sora 2 vs Suno**

["Sora 2 vs Suno: Why Sora 2 Might — or Might Not — Become Mainstream"](https://cmwen.com/posts/sora-2-vs-suno-why-sora2-might-or-might-not-become-mainstream/)（10 月 11 日）比較了兩個 AI 音樂生成工具。除了技術差異，這篇文章探討了**社交機制**：網路效應、社群參與以及主流採用的障礙。最好的技術並不總是獲勝——有時候，擁有最佳社群的工具才會勝出。

這些文章是關於**拉遠視角**。它們迫使我超越眼前的專案，思考更廣泛的趨勢如何塑造未來。

---

## 主題與教訓：我在 2025 年學到的

縱觀這 27 篇文章，幾個主題浮現出來：

### **1. AI 編碼代理是真實的——但情境很重要**

代理不是靈丹妙藥。它們在定義明確、限制清晰的任務（codemod、程式碼審查、例行實作）中表現出色。它們在開放式創造性和模糊需求中遇到困難。關鍵是知道_何時_使用它們。

### **2. 心智模型比工具更重要**

無論是理解 LangChain 中的工具調用，還是管理 Copilot Pro 中的進階請求，成功都取決於擁有正確的心智模型。工具變化迅速；心智模型長存。

### **3. 個人分支與客製化是未來**

AI 代理使分支和客製化開源專案供個人使用在經濟上變得可行。這將權力從維護者轉移到使用者——但也引發了關於分散化和長期維護的問題。

### **4. 最佳工作流程是混合式的**

代理式 SDLC 在人類和代理各自發揮優勢時效果最好。代理自動化重複性工作；人類提供創造力、判斷力和監督。兩者單獨都無法良好運作。

### **5. 自架與隱私值得投入努力**

從電子書同步到 Android 應用分發，自架解決方案提供了雲端服務無法匹敵的控制權和隱私。設定成本是真實的，但長期效益是值得的。

### **6. 學習是主動的，而非被動的**

主動學習——使用 LLM 生成摘要、客製化章節和針對性問題——勝過被動閱讀。學習的最佳方式是主動參與想法，而不僅僅是消費它們。

---

## 展望未來：2026 年及之後

隨著 2025 年的結束，我對即將到來的未來感到樂觀。對 2026 年的一些預測和意圖：

### **預測**

- **代理式 SDLC 將成為主流**：更多團隊將採用代理增強工作流程，但成功的將是那些投資於人在迴路中流程的團隊。
- **MCP 將成熟**：工具發現、信任模型和標準化將改善，使 MCP 伺服器對企業使用更加實用。
- **個人分支將激增**：隨著代理在程式碼客製化方面變得更好，我們將看到更多開發者維護開源專案的個人分支。
- **影片與多媒體內容將與程式碼融合**：開發者將越來越多地使用影片、圖表和互動式教學與傳統文件並行。

### **意圖**

- **深化對多代理系統的理解**：我想探索 AutoGen、LangGraph 和其他用於協調代理團隊的框架。
- **實驗 AI 生成的多媒體**：LLM 能否幫助製作影片腳本、圖表，甚至播客大綱？我想找出答案。
- **建構更多個人基礎設施**：自架一直很有收穫。我想將此擴展到數位生活的其他部分。
- **更多地分享過程**：我最好的文章來自在實驗進行時記錄它們，而不是事後。我想在 2026 年做更多這樣的事。

---

## 結語

2025 年是快速學習、頻繁實驗和偶爾驚喜的一年。我寫了 27 篇部落格文章，每一篇都是從懷疑的觀察者到熱情的 AI 輔助開發實踐者旅程的標記。

但更重要的是，2025 年教會我**擁抱混合工作流程**——與 AI _共同_工作，而不是被它取代或完全忽視它。最好的結果來自我將人類創造力與代理執行、個人判斷與自動化工作流程，以及策略思考與戰術效率相結合的時候。

當我展望 2026 年時，我對各種可能性感到興奮。工具正在變得更好，心智模型正在變得更清晰，社群正在變得更加成熟。我們還沒有走到這段旅程的終點——我們才剛剛開始。

感謝你的關注。祝願又一個學習、建構和分享的年份。

---

_如果你想更深入探討這些主題，請查看這篇回顧中連結的個別文章。如果你正在實驗 AI 編碼代理、代理式工作流程或個人基礎設施專案，我很樂意聽到你的想法。隨時聯繫。_
