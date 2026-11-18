# LearningHub

以 Markdown 為正式來源的繁體中文個人學習知識庫。網站使用 Astro 靜態產生頁面，Vue 只負責搜尋、閱讀篩選、收藏等互動；文章與訪客資料不需要後端或帳號。

## 本機開始

需求：Node.js 24（見 `.nvmrc`）及 npm。

```sh
npm ci
npm run dev
```

常用檢查：

```sh
npm run validate:content
npm run check:public-content
npm run check
npm run lint
npm test
npm run build
npm run check:dist
npm run test:e2e
```

`npm run build` 會先產生靜態網站，再以 Pagefind Extended 建立繁體中文搜尋索引。預設 project-site base 為 `/learning-hub/`；測根目錄部署可設定 `SITE_BASE=/`。`SITE_URL` 設為網站 origin，例如 `https://example.github.io`。正式 Pages 網域、Repository、作者資訊與 Giscus 尚待維護者配置。

## 內容與功能

- 文章放在 `src/content/articles/<分類>/<slug>/index.md`；學習路徑和資源分別放在 `src/content/learning-paths/`、`src/content/resources/`。
- `npm run new:article -- --destination <私人工作區>` 可建立不寫入公開內容目錄的草稿模板。
- 發布前先使用合成資料，審核機密、個資、著作權、圖片 EXIF 和來源，再將核准稿放入文章集合。
- `npm run check:external-links` 檢查來源連結並輸出檢查報告；外部網站暫時拒絕連線時只警告，不阻斷本機建置。
- 收藏、已讀、閱讀進度及瀏覽歷史只存在使用者瀏覽器，沒有跨裝置同步。

## 發布與授權狀態

GitHub Actions 已包含 CI、GitHub Pages workflow 與排程外部連結檢查。目前僅有本機 Git repository；尚未建立遠端、推送或部署。正式部署前需設定 GitHub Pages 權限、`SITE_URL`，並完成公開內容審查。

程式碼及文章授權尚未核准，請見 [LICENSE_PENDING.md](LICENSE_PENDING.md) 與 [CONTENT-LICENSE_PENDING.md](CONTENT-LICENSE_PENDING.md)。未核准前，這兩份標記不授予 MIT 或 CC BY 4.0 使用權；第三方素材依其原授權處理。

## 專案文件

- [作者指南](docs/author-guide.md)
- [架構與路由](docs/architecture.md)
- [變更紀錄](docs/change-log.md)
- [開發規格 v1.0](文件/LearningHub_Development_Spec_v1.0.md)
- [安全政策](SECURITY.md)
- [AI 開發規範](AGENTS.md)
