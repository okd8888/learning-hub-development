# 架構與路由

## 執行模型

Astro 於建置時從 `src/content/` 載入 Markdown 集合，經 `src/content.config.ts` 驗證後產生靜態 HTML。`src/lib/content.ts` 集中管理發布日期過濾、排序、分類計數與相關文章；前端不查詢伺服器。Vue islands 用於需要瀏覽器狀態的搜尋、閱讀中心、分類篩選、資源篩選與知識圖。

Pagefind 在 Astro 建置後索引 `dist/`。`src/lib/urls.ts` 將站內根相對路徑轉成 base-aware URL；`SITE_URL` 與 `SITE_BASE` 可分別設定 origin 與部署路徑。CI 以 `/` 和 `/learning-hub/` 兩種 base 建置，避免 project site 路徑被漏掉。

## 重要目錄

- `src/pages/`：首頁、文章、分類、標籤、類型、搜尋及 P1/P2 功能路由。
- `src/components/`：Astro 展示元件及 Vue 互動 islands。
- `src/content/`：唯一正式文章、路徑與資源來源。
- `src/config/`：站點、taxonomy、瀏覽器工具設定。
- `src/scripts/site.ts`：搜尋對話框、閱讀狀態、文章輔助互動與延遲流程圖渲染。
- `scripts/`：內容安全門檻、建置產物檢查、文章模板與外部連結檢查。
- `tests/`：Vitest 單元測試、Playwright 瀏覽器測試及不公開 fixtures。
- `.github/workflows/`：雙 base CI、Pages 建置／部署、排程連結檢查。

## 路由與索引

文章網址由 frontmatter `slug` 決定；分類、標籤與類型分頁每頁 12 篇，文章頁與 `/downloads/` 靜態端點依內容生成。搜尋、閱讀中心與知識圖不進 sitemap。Pagefind 搜尋結果限已發布文章正文；相關內容、導航與重複目錄不納入正文索引。

## 本機資料與隱私

讀者狀態使用 `learninghub:<site-id>:reader:v1` 儲存在瀏覽器。只保存 stable ID、時間、進度與檢視偏好；匯出／匯入限 1 MiB，匯入資料驗證 schema，保留未知 ID，歷史最多 200 筆。資料不會同步或上傳。

## 發布邊界

GitHub Actions 有 Pages 發布工作流程，但遠端 repository、Pages 網域、作者資訊、Giscus 及授權尚未配置／核准。部署工作流程目前是待未來遠端啟用的設定，非已部署服務。
