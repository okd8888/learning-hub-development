---
stableId: 'ai-agent-basics'
slug: 'ai/agent-basics'
title: 'Agent 系統的最小組成'
description: '用規劃、工具、狀態與評估四個角度拆解一個小型 Agent。'
category: 'ai'
subcategory: 'agent'
type: 'note'
tags: ['ai', 'agent', 'learning']
publishedAt: '2026-11-08'
draft: false
related: ['ai-mcp-001']
---

## 概念

Agent 可以視為在限制內反覆觀察、選擇動作並檢查結果的軟體流程。把流程拆成清楚步驟，有助於定位錯誤。

## 最小循環

1. 接收任務與可用上下文。
2. 產生下一個步驟或工具呼叫。
3. 驗證輸出後回覆或繼續。

## 何時停止

設定明確的停止條件與操作上限，避免把無限重試當作可靠性。
