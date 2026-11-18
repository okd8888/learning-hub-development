---
stableId: 'ai-context-001'
slug: 'ai/llm-context'
title: '整理大型語言模型的上下文'
description: '示範如何把目標、限制、資料與輸出格式分層，讓提示更容易檢查。'
category: 'ai'
subcategory: 'llm'
type: 'reference'
tags: ['ai', 'learning']
publishedAt: '2026-11-06'
draft: false
---

## 四個區塊

一份可檢查的提示可以包含任務目標、可信資料、限制條件，以及預期輸出格式。

## 簡短範例

```text
目標：將下列合成資料整理成三點摘要。
限制：只使用提供內容，不推測缺漏資訊。
格式：繁體中文條列。
```

## 檢查方式

逐項比對輸出是否符合限制，再用一個反例檢查答案是否過度延伸。

## 期望值示意

離散隨機變數的期望值可寫為 $E[X] = \sum_x xP(X=x)$，這是公式排版的合成範例。
