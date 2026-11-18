# 作者指南

## 新增文章

1. 在私人工作區撰寫草稿。文章路徑採 `src/content/articles/<category>/<slug>/index.md`；slug 使用英文小寫、數字及連字號，可使用子路徑。
2. 可執行 `npm run new:article -- --destination <私人工作區>` 產生模板；不指定私人目的地時，工具會拒絕寫入。
3. 填寫模板 frontmatter，分類、子分類、類型及標籤 ID 必須存在於 `src/config/taxonomy.json`。日期用 `YYYY-MM-DD`，發布稿設定 `draft: false`。
4. 以繁體中文為主，文章 H1 由頁面標題產生，正文從 H2 開始。用 fenced code block、Markdown 表格、`$...$`／`$$...$$` 數學式及 Mermaid fenced block。
5. 使用明確且可追溯的參考連結。只放授權允許公開的素材；移除圖片 EXIF，確認替代文字與來源。
6. 以合成資料測試，執行內容驗證、型別檢查、單元測試、靜態建置、產物檢查和搜尋 smoke test。
7. 發布前再人工檢查秘密、個資、病患資料、內網資料、著作權、附件大小與圖片 metadata。只有核准稿可以複製到公開內容目錄並提交。

## 前置檢查

```sh
npm run validate:content
npm run check:public-content
npm run check
npm test
npm run build
npm run check:dist
```

`check:public-content` 會拒絕仍是草稿或日期在未來的公開集合內容。測試 fixtures 放在 `tests/fixtures/`，不屬於 Astro 集合。

## 本機預覽與部署路徑

預設 base 為 `/learning-hub/`。以根網域測試時使用 PowerShell `$env:SITE_BASE='/'`；Linux/macOS 可用 `SITE_BASE=/ npm run build`。切換環境後請重新 build，再以 `npm run preview` 預覽。部署前確認 `SITE_URL` 為真實站點 origin；CI 會拒絕範例占位站點。

## 草稿模板

```yaml
---
stableId: 'unique-id'
slug: 'category/example'
title: '文章標題'
description: '一段精簡摘要。'
category: 'development'
subcategory: 'web'
type: 'note'
tags: ['learning']
publishedAt: '2026-11-17'
draft: true
related: []
aliases: []
sourceLinks: []
---

## 學習目的

## 環境與版本

## 核心概念

## 實作步驟

## 測試結果與問題排除

## 學習心得

## 參考資料
```

模板中的日期與資料只是格式示意；發布時使用真實日期，不填入未執行的測試結果。內容授權尚待作者核准，請勿自行宣稱文章採 CC BY 4.0。
