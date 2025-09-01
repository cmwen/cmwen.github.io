---
lang: zh-hant
translatedFrom: en
baseSlug: rdb-vs-vector-db-in-llm-financial-app
title: "LLM 金融應用中的 RDB 與向量資料庫：怎麼選、何時雙軌"
pubDatetime: 2025-05-10T10:00:00.000Z
author: Min Wen
description: 比較關聯式資料庫與向量資料庫在金融應用中的定位：統計查詢用 RDB、語意搜尋用向量庫，混合才是王道。
featuredImage: rdb-vector-db-llm-finance.png
featured: true
tags:
  - 資料庫
  - LLM
  - 金融
---

重點：

- 統計與報表：RDB 擅長彙整、聚合與一致性；
- 語意相似與自然語言查詢：向量庫更合適；
- 向量庫不擅長高頻更新，適合較靜態資料；
- 最佳實務：RDB 做交易與統計，向量庫做檢索與語意強化，最後再由 LLM 組合輸出。
