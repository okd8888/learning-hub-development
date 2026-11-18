# 專案開發準則

完整產品規格見 [LearningHub_Development_Spec_v1.0.md](文件/LearningHub_Development_Spec_v1.0.md)。本檔集中維護 AI 協作規範；`CLAUDE.md` 引用本檔，避免規則分歧。

## 工作方式

1. 修改前先確認規格、目前內容與工作樹；若需求有會改變資料、安全或發布結果的歧義，先詢問。
2. 一次完成一個工作包：列出修改範圍與可驗收結果，再實作並執行相關檢查。
3. 只修改需求涉及的部分，不做無關重構或臆測性功能。
4. 使用繁體中文溝通及撰寫程式碼註解；程式識別字使用英文。

## 技術與內容邊界

- 使用 Astro 靜態輸出、內容集合及 Vue islands；禁止將部署依賴常駐 API、資料庫、登入或 Docker。
- Markdown 是正式內容來源。透過既有 schema、URL helper 與發布過濾邏輯管理內容，不複製規則。
- 範例只用合成資料；不加入真實客戶、病患、內網、憑證或未授權素材。
- 草稿不能因為 `draft: true` 而放進公開 repository。只在私人工作區撰寫未核准內容。
- 不繞過內容檢查、秘密掃描、XSS 清理或 CI 權限限制來讓工作流程通過。
- 不得建立遠端 repository、推送、部署或發布內容，除非使用者另行明確要求。
- MIT 程式碼授權與 CC BY 4.0 文章授權仍待作者核准，不得新增實際授權授予。

## 驗收

依變更執行 `npm run validate:content`、`npm run check:public-content`、`npm run check`、`npm run lint`、`npm test`、`npm run build`、`npm run check:dist` 及適用的 Playwright 測試。回報實際命令和結果；未執行不得宣稱通過。公開部署前須完成人工內容／授權審查及匿名 smoke test。
