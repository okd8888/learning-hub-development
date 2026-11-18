---
stableId: 'data-sql-indexes'
slug: 'data/sql-indexes'
title: '資料表索引的讀取與寫入取捨'
description: '透過概念範例說明索引如何協助查詢，也如何增加寫入維護成本。'
category: 'data'
subcategory: 'sql'
type: 'reference'
tags: ['data', 'learning']
publishedAt: '2026-10-28'
draft: false
---

## 查詢方向

索引可減少某些查詢需要檢查的資料列，但實際收益要看資料分布與查詢計畫。

## 代價

每次新增或修改資料時，相關索引也需要更新。先量測常見查詢，再決定是否新增索引。
