---
stableId: 'dev-site-testing'
slug: 'development/site-testing'
title: '靜態網站的分層驗證'
description: '用單元、建置產物與瀏覽器操作三層測試，檢查常見錯誤。'
category: 'development'
subcategory: 'web'
type: 'tutorial'
tags: ['web', 'typescript']
publishedAt: '2026-10-18'
draft: false
---

## 單元測試

先測試不依賴瀏覽器的路徑、日期與排序函式。

## 產物檢查

建置後檢查所有站內連結、草稿字串與 base path，確保靜態檔可直接託管。

## 瀏覽器測試

用真實瀏覽器檢查深層 URL 刷新、鍵盤操作和手機寬度。
