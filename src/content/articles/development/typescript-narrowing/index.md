---
stableId: 'dev-ts-narrowing'
slug: 'development/typescript-narrowing'
title: 'TypeScript 型別縮小的幾種方式'
description: '以小型範例比較 typeof、in 與判別聯集，讓分支中的型別更明確。'
category: 'development'
subcategory: 'typescript'
type: 'tutorial'
tags: ['typescript', 'web']
publishedAt: '2026-11-04'
draft: false
---

## 判別聯集

使用固定欄位作為判別值，分支中即可取得對應欄位型別。

```ts
type Result = { kind: 'ok'; value: string } | { kind: 'error'; message: string };

function describe(result: Result) {
  if (result.kind === 'ok') return result.value;
  return result.message;
}
```

## 小結

當物件有多種形狀時，明確判別欄位比型別斷言更容易維護。
