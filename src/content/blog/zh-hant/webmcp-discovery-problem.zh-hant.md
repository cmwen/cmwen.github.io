---
lang: "zh-hant"
translatedFrom: "en"
baseSlug: "webmcp-discovery-problem"
title: "發現問題：AI 代理如何找到你的 WebMCP 工具？"
description: "WebMCP 最大的未解決挑戰是工具發現——代理與網頁互動的未來取決於解決 AI 代理如何在不需要昂貴導航的情況下找到你網站的結構化工具。"
author: "Min Wen"
pubDatetime: 2025-11-21T00:00:00.000Z
featured: true
tags: ["webmcp", "discovery", "agents", "web-standards", "ai"]
llmKeyIdeas:
  [
    "工具發現挑戰",
    "聲明式清單",
    "PWA service workers",
    "代理 SEO 未來",
    "目錄協議",
  ]
---

你已經建立了完美的 WebMCP 實作。你的電商網站公開了優雅的工具，如 `searchProducts(query)`、`addToCart(productId)` 和 `checkout()`。AI 代理可以在幾毫秒內完成購買，而不是使用昂貴的視覺模型笨拙地操作你的 UI。

只有一個問題：**舊金山的代理如何知道你的工具存在？**

這是 WebMCP 最大的未解決挑戰，並在[官方提案](https://github.com/webmachinelearning/webmcp)中明確承認。雖然協議定義了代理*如何*與網頁工具互動，但它並沒有解決代理*如何*首先發現這些工具。沒有發現機制，即使是最高效的工具介面也會閒置不用。

## 目錄

## 現況：需要導航

今天，WebMCP 的發現機制是這樣運作的：

1. 代理決定訪問你的網站（不知怎麼的）
2. 瀏覽器導航到你的頁面
3. JavaScript 執行並透過 `navigator.modelContext.provideContext()` 註冊工具
4. 代理發現可用的工具
5. 代理現在可以呼叫工具

第 1 步中的「不知怎麼的」就是問題所在。代理必須已經知道要訪問你的網站，才能發現你的工具。這是一個雞生蛋、蛋生雞的問題，使得 WebMCP 的發現機制與後端替代方案相比根本上效率低下。

### 為什麼會失效

考慮一個使用者向他們的代理詢問：_「幫我找一件 200 美元以下的紅色洋裝，適合夏季婚禮穿。」_

使用後端 MCP 伺服器，代理可能會：

- 查詢目錄服務：「哪些電商網站有服裝搜尋 API？」
- 獲取具有相關功能的 MCP 伺服器列表
- 直接連接到伺服器並呼叫 `searchProducts()` 工具
- 呈現結果，而無需打開瀏覽器

使用 WebMCP，代理必須：

- 導航到每個潛在的電商網站（Nordstrom、Wildebloom、Lulus 等）
- 等待每個網站的頁面載入和 JavaScript 執行
- 發現每個網站提供什麼工具
- 在相關網站上呼叫工具
- 在不提供有用工具的無關網站上浪費 token 和時間

**每次導航都很昂貴**：頁面載入時間、DOM 解析、JavaScript 執行，最關鍵的是，在可能甚至不支援 WebMCP 的網站上燒掉的 token 預算。

WebMCP 提案坦率地表示：_「沒有內建機制讓客戶端應用程式在不訪問或直接查詢網站的情況下發現哪些網站提供可呼叫的工具。」_

## 解決方案 1：聲明式清單方法

最明顯的解決方案是讓網站在代理導航到它們*之前*聲明它們的工具。這類似於網頁應用程式已經透過 Web App Manifest、`robots.txt` 和 OpenGraph meta 標籤宣傳其功能的方式。

### 它可能如何運作

Web App Manifest 中的新欄位（或單獨的 `.well-known/webmcp.json` 檔案）可以聲明可用的工具：

```json
{
  "name": "Wildebloom Clothing",
  "short_name": "Wildebloom",
  "webmcp_tools": [
    {
      "name": "searchProducts",
      "description": "Search for clothing items by category, color, size, and style attributes",
      "category": "commerce",
      "inputSchema": {
        "type": "object",
        "properties": {
          "query": { "type": "string" },
          "category": {
            "type": "string",
            "enum": ["dresses", "tops", "bottoms"]
          },
          "size": { "type": "number", "minimum": 2, "maximum": 14 }
        }
      }
    },
    {
      "name": "addToCart",
      "description": "Add a product to the shopping cart",
      "category": "commerce",
      "requiresAuth": true
    }
  ]
}
```

代理可以透過簡單的 HTTP GET 請求獲取此清單——無需 JavaScript 執行、無需頁面載入，只需結構化的元資料。爬蟲可以索引這些清單，建立支援 WebMCP 的網站的可搜尋目錄。

### 限制

靜態清單解決了發現問題，但產生了新問題：

**1. 依賴狀態的工具**

許多工具應該只在特定情境下可用。考慮一個設計工具，它公開：

- `undo()` - 只有在進行了編輯後才可用
- `exportDesign()` - 只有在載入了設計後才可用
- `shareWithUser(userId)` - 只有在身份驗證後才可用

靜態清單無法表達「這個工具只在使用者有活動編輯會話時存在」。你需要動態清單更新，這會違背效率目的。

**2. 隱私問題**

每個網站都應該公開宣傳其所有功能嗎？考慮企業工具、個人化功能或根據使用者訂閱層級而變化的功能。靜態清單會將你的整個 API 表面暴露給競爭對手和爬蟲。

**3. 維護負擔**

開發人員現在需要在兩個地方維護工具定義：清單和實際實作。這些不可避免地會不同步，導致代理嘗試呼叫實際上不存在或已更改簽名的工具。

### 混合折衷方案

WebMCP 提案建議採用混合方法：

> 「此功能的未來迭代可以引入放置在應用程式清單中的聲明式工具定義，這樣代理只需要透過簡單的 HTTP GET 請求獲取清單。當然，代理仍然需要導航到網站才能實際使用其工具，但清單使發現這些工具並推理它們與使用者任務的相關性的成本大大降低。」

這在保持發現效率的同時，要求導航才能呼叫。代理可以預先過濾無關的網站，只導航到那些有用工具的網站。

## 解決方案 2：漸進式網頁應用程式 + Service Workers

Service workers 透過將工具與可見的瀏覽器視窗分離，提供了更複雜的方法。

### 架構

當使用者安裝 PWA 時，其 service worker 可以註冊 WebMCP 工具，即使在瀏覽器視窗關閉後也能持續存在：

```javascript
// In service worker scope
self.addEventListener("activate", () => {
  self.agent.provideContext({
    tools: [
      {
        name: "addToCalendar",
        description: "Add event to user's calendar",
        execute: async ({ title, date, duration }) => {
          // Call backend API, update local storage, etc.
          await fetch("/api/calendar/add", {
            method: "POST",
            body: JSON.stringify({ title, date, duration }),
          });
          return { content: [{ type: "text", text: `Added: ${title}` }] };
        },
      },
    ],
  });
});
```

現在，即使日曆網頁應用程式未開啟，該工具也可在系統範圍內使用。代理可以直接呼叫它：

```
使用者：「明天中午與 Sarah 新增午餐會議」
代理：[透過已安裝的 PWA 發現 calendar.example.com 有 addToCalendar 工具]
代理：[在不開啟瀏覽器視窗的情況下呼叫工具]
代理：「完成！已新增到你的日曆。」
```

### 使用者體驗

此模型反映了原生應用程式的功能：

1. 使用者安裝 PWA（明確的信任信號）
2. PWA 在 service worker 中註冊工具
3. 工具在系統範圍內可供授權的代理使用
4. 背景執行，不會中斷 UI
5. 每個代理首次使用時才出現安全提示

Service workers 可以在需要時開啟視窗（例如，用於付款確認），同時保持簡單操作的無頭執行。

### 發現挑戰仍然存在

這解決了*持久性*問題，但沒有解決*初始發現*問題。代理如何知道 `calendar.example.com` 有一個有用的 PWA 可以首先安裝？我們又回到需要某種形式的目錄或搜尋機制。

## 解決方案 3：目錄和搜尋 API

如果網站無法有效地單獨宣傳其工具，也許集中式（或聯邦式）目錄可以填補這一空白。

### 集中式模型

類似於瀏覽器擴充套件市場或應用程式商店：

**Google WebMCP Registry**

- 開發人員提交其網站以進行索引
- Google 爬取 `webmcp.json` 清單或 `<meta>` 標籤
- 代理查詢：`GET https://webmcp.google.com/api/search?q=e-commerce+clothing+search`
- 返回具有相關工具的網站排名列表

**優點：**

- 單一權威來源
- 品質控制和審查
- 豐富的元資料和分類
- 建立在現有基礎設施上（Google 已經爬取網頁）

**缺點：**

- 集中化風險（一家公司控制代理-網頁介面）
- 付費遊戲問題（精選列表、推廣工具）
- 更新速度慢於即時網頁變化
- 不符合開放網頁的理念

### 去中心化模型

或者，類似於 RSS 或 ActivityPub 的分散式協議：

**WebMCP Discovery Protocol**

- 網站發布 `/.well-known/webmcp.json` 端點
- 發現節點爬取和聚合（任何人都可以運行一個）
- 代理查詢多個發現節點，去重結果
- 網站控制自己的元資料，無需守門人

這可以像 Fediverse 一樣運作：聯邦實例共享知識，同時網站保留對其資料的主權。

### 搜尋引擎轉向

搜尋引擎已經透過結構化資料（Schema.org、OpenGraph、JSON-LD）索引網站功能。它們可以擴展到 WebMCP：

```html
<meta property="webmcp:tool" content="searchProducts" />
<meta property="webmcp:category" content="e-commerce" />
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    "name": "Wildebloom Product Search",
    "description": "Search for sustainable clothing",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "webmcp://wildebloom.example/searchProducts?query={query}"
    }
  }
</script>
```

搜尋引擎已經理解結構化資料。將其擴展到描述代理可訪問的工具是自然演進。

## 解決方案 4：AI 原生發現

也許解決方案不是技術性的，而是情境性的。現代 LLM 在龐大的網頁語料庫上訓練，可以有機地學習哪些網站提供哪些功能。

### 它如何運作

在訓練基礎模型時，將 WebMCP 工具架構納入網頁內容：

- 模型學習「Wildebloom 有服裝搜尋工具」
- 模型學習「Gerrit 有程式碼審查自動化工具」
- 模型學習「Figma 有設計編輯工具」

在推理時，代理使用這些學習的知識直接導航到相關網站：

```
使用者：「幫我找一件婚禮穿的洋裝」
代理推理：[我知道 Wildebloom 和 Nordstrom 有 WebMCP 服裝搜尋工具]
代理：[導航到 Wildebloom]
代理：[發現並呼叫 searchProducts()]
```

### 訓練挑戰

這需要：

1. WebMCP 採用達到臨界質量
2. 訓練資料包括工具架構（在清單、文件或 meta 標籤中）
3. 模型重新訓練以納入這些知識
4. 隨著網站更新工具，知識保持最新

它還繼承了 LLM 知識截止問題——代理不會知道訓練後新推出的網站或新增的工具。

## 開發人員今天應該做什麼

當 WebMCP 社群辯論發現機制時，開發人員可以為最終的可發現性定位他們的網站：

### 1. 新增語義元資料

即使沒有標準化的 WebMCP 清單，你也可以發出功能信號：

```html
<!-- OpenGraph 提示 -->
<meta property="og:type" content="website.ecommerce" />
<meta property="og:capabilities" content="search,cart,checkout" />

<!-- Schema.org 結構化資料 -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Store",
    "name": "Wildebloom",
    "potentialAction": [
      {
        "@type": "SearchAction",
        "target": "https://wildebloom.example/search?q={query}",
        "query-input": "required name=query"
      }
    ]
  }
</script>
```

### 2. 顯著地記錄你的工具

建立一個 `/agents` 或 `/api-docs` 頁面，以人類可讀的格式描述你的 WebMCP 工具。在網頁內容上訓練的代理將從這些描述中學習：

```markdown
## Agent Integration

Wildebloom 支援 WebMCP 以供 AI 代理存取：

**searchProducts(query, category, size, color)**

- 使用自然語言或結構化篩選器搜尋我們的目錄
- 返回包含圖片、價格和可用性的產品列表

**addToCart(productId, quantity)**

- 將商品新增到購物車
- 需要使用者驗證

**checkout()**

- 啟動安全結帳流程
- 開啟付款視窗以供使用者確認
```

### 3. 嘗試 `.well-known` 端點

即使沒有標準化，你也可以建立自己的：

```
https://yoursite.com/.well-known/webmcp.json
```

這遵循網頁慣例，如果使用這種模式出現標準，你的位置會很好。

### 4. 加入對話

WebMCP 提案在 [GitHub 上有 31 個未解決的問題](https://github.com/webmachinelearning/webmcp/issues)。發現在多個討論串中被討論。為這個討論做出貢獻有助於塑造最終的解決方案。

## 未來：代理 SEO

在接下來的 2-3 年內，我預測將出現一個新的專業類別：**代理 SEO 專家**。

就像傳統 SEO 為搜尋引擎爬蟲優化一樣，代理 SEO 將為 AI 代理發現進行優化：

- 製作 LLM 理解的工具描述
- 為代理消費構建元資料
- 監控代理流量和工具呼叫分析
- 對工具名稱和描述進行 A/B 測試以提高代理理解
- 管理代理目錄中的聲譽

隨著代理成為某些任務的主要網頁介面，這個領域的先行者將獲得顯著的競爭優勢。

## 結論：最後一哩問題

WebMCP 已經解決了效率問題——結構化工具在數量級上擊敗了基於視覺的 UI 自動化。但發現仍然是阻止大規模採用的「最後一哩」挑戰。

解決方案可能是**混合的**：

- 用於基本工具宣傳的靜態清單
- 用於持久性、已安裝應用程式體驗的 service workers
- 用於搜尋的目錄服務（集中式或聯邦式）
- 納入工具知識的 LLM 訓練以實現情境感知

這些解決方案並不互斥。網頁在分層方法中蓬勃發展——想想今天網站是如何透過搜尋引擎、社群媒體、直接連結、書籤和建議網站被發現的。

WebMCP 發現將以類似方式演變：代理根據情境、使用者信任和效率權衡選擇的多個重疊機制。

競賽已經開始。今天實作 WebMCP 工具的網站將被索引、了解並被明天的代理生態系統推薦。問題不在於是否要為代理發現做準備——而在於你多早開始。

---

## 延伸閱讀

- [WebMCP 官方提案](https://github.com/webmachinelearning/webmcp) - 規範和說明文件
- [Model Context Protocol](https://modelcontextprotocol.io/) - 後端 MCP 以供比較
- [Web App Manifest 規範](https://www.w3.org/TR/appmanifest/) - 現有的功能聲明
- [Service Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - 背景執行情境
- [Schema.org Actions](https://schema.org/Action) - 網頁功能的結構化資料
