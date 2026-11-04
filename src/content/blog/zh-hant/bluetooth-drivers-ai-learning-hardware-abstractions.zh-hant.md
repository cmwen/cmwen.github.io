---
title: "從 Bluetooth 到 AI：硬體開發門檻如何逐漸降低"
description: "從 BLE GATT、HID 與裝置驅動程式，反思技術抽象化與 AI 如何改變工程師學習新領域的方式。"
author: "Min Wen"
pubDatetime: 2026-11-04T21:44:28.166Z
lang: "zh-hant"
draft: false
tags: ["Bluetooth","BLE","Software Engineering","AI","Learning"]
baseSlug: "bluetooth-drivers-ai-learning-hardware-abstractions"
translatedFrom: "bluetooth-drivers-ai-learning-hardware-abstractions"
---

最近我花了一些時間研究 Bluetooth Low Energy（BLE）。不是因為準備做什麼硬體，而是單純好奇：如果我做了一個自訂裝置，要怎麼讓筆電辨識它？需要寫 Driver 嗎？需要自己定義 Bluetooth Profile 嗎？

最後讓我印象最深刻的，不只是 BLE 本身，而是**技術抽象化的累積，加上 AI 輔助學習，讓探索硬體的門檻變低了**。

## 從 Driver 到裝置 API

BLE Peripheral 可以提供 GATT Service，底下的 Characteristic 可以讓應用程式讀取、寫入或訂閱通知。作業系統已經提供 Bluetooth Stack，以及像 macOS Core Bluetooth 這樣的 API。

我的應用程式需要理解裝置傳來的資料，但通常不需要自己實作 Bluetooth，也不需要安裝自訂的核心驅動程式。

```text
自訂裝置 → BLE GATT → 作業系統 Bluetooth Stack → 我的 App
```

這讓我想到 REST API。我們呼叫 Web API，不會自己重寫 TCP/IP；同樣地，讀取 GATT Characteristic 也不需要自己寫無線傳輸的 Driver。

當然 BLE 不是 REST。它有不同的連線模型、封包大小、安全性和效能限制。不過抽象概念很接近：**底層用共同的標準通訊，上層自行定義資料的意義**。

## GATT 這麼自由，為什麼還需要 HID？

接著我很好奇：既然 GATT 可以自訂，為什麼還需要 HID？

後來我理解，兩者在解決不同的問題。

GATT 定義如何存取資料；HID 則讓作業系統知道輸入資料代表什麼。

標準 Bluetooth 鍵盤接上 Mac，不必另外寫 App，因為作業系統知道如何解讀 HID over GATT。但如果我的 Custom GATT 傳來 `button_pressed`，macOS 不會自動把它當成鍵盤按鍵，除非有應用程式懂得解讀。

這也解釋了為什麼有些滑鼠已經能正常使用，還是需要原廠的設定工具。一般滑鼠操作走標準 HID；進階設定可能使用廠商自己的通訊協定。甚至 HID 本身也允許 Vendor-defined Reports。

**標準和客製化不是對立的。**標準讓裝置具備基本相容性，專屬協定則讓它有更多功能。

## 一個 BLE 裝置可以同時連多台電腦？

另一個讓我意外的發現：BLE Peripheral 在硬體和 Bluetooth Stack 支援的前提下，可以同時連接多個 Central。

例如 ESP32 可以讓 Mac 和手機讀取感測器資料、訂閱 Notification，同時接受設定指令。

不過這不是開箱即用的保證。第一個裝置連線後，可能需要重新開始 Advertising；硬體有連線數限制；而多個 Client 同時修改設定，也會碰到熟悉的分散式系統問題：誰擁有控制權？衝突怎麼處理？

裝置甚至可能同時提供標準 HID 與 Custom GATT Service。但不同作業系統、不同 HID Host 是否能同時存取，仍然需要實測。

## Android 平板也能當 BLE 裝置

還有一個有趣的可能性：原生 Android App 可以在硬體支援 BLE Peripheral 模式時，建立 GATT Server 並對外 Advertising。

支援 Web Bluetooth 的瀏覽器可以找到這個 Service，再透過 GATT 發送指令。這樣不一定需要安裝桌面版的自訂 Driver。

但這不代表 PWA 自己就能任意扮演 BLE Peripheral，也不保證每台 Android 平板都能同時服務多個 Central。瀏覽器支援、權限、硬體能力和安全機制都需要確認。

目前這是我研究的設計可能性，還不是已經完成的實作。

## 更大的收穫：AI 改變了我的學習方式

這次我沒有從頭翻 Bluetooth Specification，而是從一個簡單問題開始：

*自己做 BLE 裝置，需要建立新的 Profile 嗎？*

然後一路問到 Pairing 和 Connection 的差別、HID 和 Custom GATT 的關係、USB HID 與 BLE HID 的共通點，以及 Multi-Central。

每一個回答都幫我建立 Mental Model，再用下一個問題挑戰自己的理解。

以前要接觸不熟悉的底層技術，可能先得讀一大堆規格和文件。現在可以先沿著好奇心探索，了解整體架構，再去確認關鍵細節。

這是我覺得 AI 作為學習夥伴最有價值的地方：**降低繼續追問的成本**。

當然，AI 可能講錯。真正要做硬體產品之前，還是需要查 Bluetooth SIG 規範、平台官方文件，並在真實裝置上驗證。但「帶著問題查規格」和「還不知道自己要找什麼就開始讀規格」，是非常不同的學習體驗。

## 昨天的複雜度，成為今天的基礎能力

我看到兩種趨勢正在互相加速。

一方面，數十年的軟體與硬體工程，把低階問題包裝成標準、通用 Stack 和 API。另一方面，AI 讓我們更容易發現這些能力、理解它們的邊界。

工程工作沒有消失，而是問題重心改變了：應該由 OS 還是 App 理解裝置？需要什麼安全機制？多個 Client 如何協調？抽象層在哪裡會失效？

**好的技術，會把昨天的複雜問題變成今天的基礎元件；AI 則讓我們更容易理解和使用這些元件。**

這次探索還沒有產出新的 BLE 硬體，但我已經更清楚有哪些可能性，以及真的開始動手時，需要先驗證哪些假設。
