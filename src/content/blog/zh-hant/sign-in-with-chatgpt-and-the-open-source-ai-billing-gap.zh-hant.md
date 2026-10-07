---
lang: "zh-hant"
translatedFrom: "sign-in-with-chatgpt-and-the-open-source-ai-billing-gap"
baseSlug: "sign-in-with-chatgpt-and-the-open-source-ai-billing-gap"
title: "Sign in with ChatGPT：補上開源 AI 應用的付費缺口"
description: "Sign in with ChatGPT 提供一種不同的做法，讓符合資格的開源 AI 應用使用者透過既有的 ChatGPT 方案授權推論，不必自行管理 API key。"
author: "Min Wen"
pubDatetime: 2026-10-08T00:00:00Z
tags: ["ai", "open-source", "oauth", "developer-experience"]
featured: false
draft: true
llmKeyIdeas:
  [
    "Sign in with ChatGPT 可授權符合資格的開源應用，使用使用者的 ChatGPT 方案進行推論",
    "許多開源 AI 應用要求使用者自行提供與管理 API key",
    "動態註冊流程使用 OAuth Authorization Code with PKCE，並以 127.0.0.1 作為 loopback callback",
    "託管網站使用預先註冊的 client 流程，不能直接套用開源應用的 loopback 流程",
  ]
---

## 開源 AI 應用背後那個現實問題

每次試用開源 AI 應用時，我總會想到一個很實際的問題：**模型呼叫的費用最後由誰來付？**

很多專案的答案是 API key。應用程式可以免費下載，但使用者得先向 AI 服務商註冊、開通帳單、建立金鑰，再找地方貼上並妥善保管。對開發者來說，這套流程很熟悉；對其他人來說，卻可能是開始使用前就得跨過的一道門檻。

如果使用者已經訂閱 ChatGPT，情況就更令人困惑了。他們自然會問：「我已經付費訂閱了，這個應用能不能用我的方案？」過去通常不行，因為 ChatGPT 與 API 平台使用不同的帳單系統；應用若要求 API key，使用者就會進入 API 平台的計費流程。([OpenAI 帳單說明](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform))

[Sign in with ChatGPT](https://developers.openai.com/siwc/token-sharing-open-source) 讓符合資格的開源與本機託管應用多了一條路。根據目前的快速入門文件，符合資格的 ChatGPT Plus 和 Pro 使用者可以登入、明確同意使用方案額度，並授權符合資格的 Responses API 請求使用自己的 ChatGPT 方案。應用仍須自行整合這套流程，而且功能有資格條件、用量限制與授權範圍。不過，它提出的產品概念很清楚：**使用者可以沿用自己與模型服務商既有的關係，不必先學會如何申請 API 憑證。**

這有機會讓更多人願意嘗試開源 AI 軟體。

## API key 也是產品體驗的一部分

API key 本身沒有問題。它是軟體呼叫服務時常見又彈性的方式。但如果每位使用者都得自行準備一組，等於把好幾件事交給使用者處理：

- 搞懂 API 平台和一般聊天產品可能分開計費。
- 建立並管理憑證。
- 判斷是否要把憑證交給一個還不熟悉的應用。
- 留意用量、花費，以及如何撤銷權限。

對熟悉技術的人來說，這些步驟或許很平常。但對只是想試用本機 AI 助理的人來說，可能還沒送出第一個 prompt 就放棄了。

Sign in with ChatGPT 改變了初次使用的流程。應用可以提供熟悉的登入與授權畫面，讓使用者選擇帳號，並決定是否授予應用所需的權限。登入身分與使用方案額度是不同的授權；光是登入，不代表應用就能使用方案進行推論。應用必須檢查實際取得的 scope。文件也說明，方案用量授權不會讓應用取得使用者的 ChatGPT 對話或其他帳戶脈絡。

這不只是把憑證欄位換成一個按鈕。它把設定流程從每位使用者身上移到應用開發者：開發者整合一次授權流程，使用者就能透過更清楚的同意畫面開始使用。

## OAuth 的基礎，以及本機應用的界線

這套流程使用熟悉的技術：OAuth Authorization Code、PKCE 和 OpenID Connect。令我感興趣的是，OpenAI 如何為在使用者裝置上執行的開源應用，調整註冊與 callback 規則。

簡化來看，本機應用會先準備穩定的 host 識別碼，產生一般 OAuth 流程會用到的 `state`、`nonce` 和 PKCE verifier，並啟動 callback listener。接著開啟使用者的瀏覽器，進行登入與授權。完成後，瀏覽器會把授權碼送回本機 listener；應用再使用 PKCE verifier 交換授權碼。第一次使用時，流程也會建立 client 註冊，並回傳一組應用需要保存的 client ID。

開源流程的 callback 必須使用 HTTP loopback 網址，例如：

```text
http://127.0.0.1:1455/auth/callback
```

scheme、host 和 path 都必須符合規定。之後重新登入時，port 可以變更；但文件要求使用 `127.0.0.1`，不能改成 `localhost`，而且授權請求與交換授權碼時必須使用完全相同的 callback URI。這類應用屬於 public client，因此不會內嵌 client secret；PKCE 讓應用在交換授權碼時，證明自己持有該次授權流程產生的 verifier。([註冊與登入文件](https://developers.openai.com/siwc/token-sharing-open-source/sign-in))

這裡的界線很有意思。一般 SaaS 網站的 callback 通常指向網路上的伺服器，例如 `https://app.example.com/callback`。它不是使用者裝置上的 `127.0.0.1`，因此託管服務不能直接沿用開源動態註冊流程的 callback。OpenAI 為網站提供另一套流程：託管應用使用預先註冊的 client ID 和精確登記的 HTTPS callback；目前文件指出，網站登入仍透過有限試用提供給部分商業合作夥伴。([網站登入文件](https://developers.openai.com/siwc/website))

所以規則並不是「公司不能使用 Sign in with ChatGPT」。文件區分的是開源／本機流程，以及另外註冊的託管網站流程。專案的法律身分不會改變 callback 位址；真正重要的是它符合哪一種整合方式。

## 新的不是 PKCE

PKCE 本身是 public client 使用的標準 OAuth 保護機制。本機應用會建立一組 verifier，只把衍生出的 challenge 放進瀏覽器授權請求；交換授權碼時，再提供 verifier 證明兩者屬於同一個授權流程。`state` 用來確認 callback 對應到原本的授權請求；OpenID Connect 的 `nonce` 則協助驗證回傳的身分識別 token。

更特別的是疊加在標準機制之上的產品規則：開源應用使用 loopback callback，而首次授權也能同時建立應用註冊。這讓桌面或自行託管的工具不必要求每位使用者貼上開發者提供的 API key 或 client secret，就能開始使用。

這不是一種套用後就能讓任何網站符合資格的通用 OAuth 技巧。callback 限制屬於這項產品流程的一部分；託管服務要走自己的註冊方式與營運流程。

## 這可能帶來什麼改變

開源軟體一直有容易散布的優勢：任何人都能下載、檢視、修改並執行。AI 帶來持續發生的服務成本，讓這個承諾變得複雜。推論終究需要有人付費。如果每位使用者都得自行準備一組另外計費的 API key，那麼對已經訂閱模型服務的人來說，「免費且開源」似乎還不完整。

Sign in with ChatGPT 提出另一種安排：開發者提供應用，使用者則授權應用透過自己已有的帳號與方案使用符合資格的功能。開發者不必架設一個代替所有人付費的 proxy，使用者也不必為了試用軟體先研究 API 控制台。

當然還是有不少限制。使用 ChatGPT 方案是一項選擇性的授權，不代表所有使用者和所有請求都能使用。這項功能只適用於符合資格的請求，也有文件列出的用量限制與技術要求。開源流程面向在本機執行或自行託管的應用；託管商業服務則走另一套 client 註冊流程。這些條件會影響哪些專案能採用，以及使用者用完方案額度後該怎麼辦。

即便如此，我仍認為這是值得關注的產品方向。它把身分驗證、計費與初次使用體驗放在同一個問題裡思考。本機 callback 規則尤其有意思：授權回應會送到使用者自己的裝置；如果服務部署在網路上的伺服器，就得走另一套註冊流程。

對不想兼任憑證管理員、只想使用開源 AI 工具的人來說，這是很有希望的一步。接下來值得觀察的是，其他 AI 平台是否也會讓使用者透過既有方案授權第三方軟體，同時把同意內容與用量界線說清楚。

## 參考資料

- [Sign in with ChatGPT：開源應用概覽](https://developers.openai.com/siwc/token-sharing-open-source)
- [開源應用的註冊與登入](https://developers.openai.com/siwc/token-sharing-open-source/sign-in)
- [在網站上使用 Sign in with ChatGPT](https://developers.openai.com/siwc/website)
- [ChatGPT 與 API 平台的帳單說明](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform)
- [Sign in with ChatGPT 快速入門](https://developers.openai.com/siwc/quickstart)
