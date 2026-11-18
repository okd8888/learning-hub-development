---
stableId: 'infra-site-base-path'
slug: 'infrastructure/site-base-path'
title: 'Project site 的 base path 注意事項'
description: '說明根目錄網站與 GitHub Pages 專案網站在資產路徑上的差異。'
category: 'infrastructure'
subcategory: 'linux'
type: 'note'
tags: ['git', 'web']
publishedAt: '2026-10-16'
draft: false
---

## 兩種路徑

個人站通常部署在網域根目錄；專案站則會有 repository 名稱作為路徑前綴。

## 驗證

使用共用 URL helper，分別以 `/` 和 `/learning-hub/` 建置，檢查深層文章與搜尋索引。
