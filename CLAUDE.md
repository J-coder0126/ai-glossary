# CLAUDE.md — AI 名詞小百科

> 這份文件是給 AI（Claude Code、Codex、Cursor 等）與協作者看的「專案規則書」。
> 任何新增、修改頁面的工作，**動手前請先讀完本文件**，並嚴格依照規則執行。
> `AGENTS.md` 只是指向本文件的入口，規則以本文件為準。

---

## 1. 專案目的

「AI 名詞小百科」是一個 **生成式 AI 名詞解釋網站**（LLM Wiki 風格）。

- **讀者**：剛接觸生成式 AI 的大學生，有基本程式概念，但不熟數學推導。
- **目標**：每個名詞一頁，讀者 3 分鐘內能回答「這是什麼、怎麼運作、用在哪」。
- **範圍**：以「文字生成」與「影像生成」相關名詞為主，外加必要的基礎概念。
- **擴充方式**：網站內容由「一份資料登錄檔 + 一份頁面樣板」驅動，新增名詞只需要
  ①複製樣板寫一頁、②在資料檔加一筆，首頁、分類、搜尋、相關名詞、上下頁都會自動更新。

## 2. 技術限制（不可違反）

- **純靜態網站**：只用 HTML + CSS + 原生 JavaScript，**不使用**任何框架、建置工具、npm 套件或 CDN。
- 必須能直接部署在 **GitHub Pages**，也必須能 **直接雙擊 `index.html` 用瀏覽器開啟**（因此資料用 `<script>` 載入，不可用 `fetch`）。
- 所有路徑一律用**相對路徑**，不可用 `/` 開頭的絕對路徑（GitHub Pages 專案網址有子路徑）。
- 語言：介面與內文使用 **繁體中文（台灣用語）**，`<html lang="zh-Hant">`。專有名詞第一次出現時附英文原文。

## 3. 檔案結構

```
ai-glossary/
├── CLAUDE.md              ← 專案規則（本文件）
├── AGENTS.md              ← 指向 CLAUDE.md 的入口
├── README.md              ← 給人看的專案介紹與部署方式
├── index.html             ← 首頁：搜尋 + 分類篩選 + 名詞卡片（由 JS 依資料檔產生）
├── about.html             ← 關於本站與編寫規範的公開說明
├── .nojekyll              ← 讓 GitHub Pages 不經 Jekyll 處理
├── data/
│   └── terms.js           ← ★ 唯一的資料登錄檔（分類 + 所有名詞的 metadata）
├── terms/
│   └── <slug>.html        ← 每個名詞一頁
├── templates/
│   └── term-template.html ← ★ 新增名詞時複製這份
├── assets/
│   ├── style.css          ← 全站唯一樣式表
│   └── main.js            ← 全站唯一腳本（頁首、頁尾、卡片、相關名詞、上下頁）
└── scripts/
    └── check-terms.js     ← 一致性檢查（Node.js，可選）
```

### 命名規則

| 項目 | 規則 | 範例 |
|---|---|---|
| slug | 英文小寫、單字以 `-` 連接、不含空白與中文 | `diffusion-model`、`gan` |
| 名詞頁檔名 | `terms/<slug>.html`，必須和資料檔 `slug` 完全一致 | `terms/diffusion-model.html` |
| 縮寫 | slug 用縮寫小寫；全名放 `en` 欄位 | slug `vae`，en `Variational Autoencoder` |
| 圖片（若有） | `assets/img/<slug>-<說明>.svg/png`，需有 `alt` | `assets/img/gan-architecture.svg` |

## 4. 網頁整體風格

- **定位**：乾淨、像教科書的百科頁，不花俏。重點是好讀。
- **配色**：所有顏色都定義在 `assets/style.css` 的 `:root` 變數中，並支援深色模式。
  **不得在 HTML 中寫 inline style 或新增色碼**；需要新顏色時先在 `:root` 與深色區塊同時新增變數。
- **分類色**：每個分類一個代表色（`--cat-basics`、`--cat-text`、`--cat-image`），用於卡片左邊框與標籤。
- **字體**：系統字體堆疊（Noto Sans TC / 微軟正黑體），內文 17px、行高 1.75。
- **版面**：內容最大寬度 760px；手機寬度（375px）下不可出現水平捲動。
- **難度標示**：`●○○` 入門、`●●○` 進階、`●●●` 深入。

## 5. 頁面結構

### 5.1 共用部分（由 `main.js` 自動產生，不要手寫）

- `<div id="site-header"></div>`：網站標題與導覽列
- `<div id="site-footer"></div>`：頁尾
- 名詞頁的 `#term-meta`（分類、難度、更新日期）、`#related-list`（相關名詞卡片）、`#pager`（上一個／下一個）

要改導覽列或頁尾，只改 `assets/main.js` 一處即可。

### 5.2 名詞頁固定章節（順序不可調換）

| # | `<section id>` | 標題 | 必填 | 寫作要求 |
|---|---|---|---|---|
| 1 | `definition` | 一句話定義 | ✅ | **一句話**、40 字以內，不出現公式 |
| 2 | `analogy` | 白話比喻 | ✅ | 用生活例子比喻，1 段 |
| 3 | `how-it-works` | 運作原理 | ✅ | 用 `<ol class="steps">` 寫 3–5 步 |
| 4 | `formula` | 關鍵公式 | ⬜ 選填 | 用 `<pre class="formula">` 純文字公式，下方附一句白話解釋；沒有公式就整段刪除 |
| 5 | `examples` | 代表模型與應用 | ✅ | `<ul>`，2–5 項，格式「**名稱**（年份）：一句說明」 |
| 6 | `misconceptions` | 常見誤解 | ✅ | `<ul class="myths">`，1–3 項，「誤解／其實」成對 |
| 7 | `related` | 相關名詞 | ✅ | **內容留空**，由 JS 依資料檔 `related` 產生 |
| 8 | `references` | 延伸閱讀 | ✅ | 1–3 篇原始論文或官方文件，格式「作者（年份）．〈標題〉」並附連結 |

此外 `<body>` 必須帶三個屬性：`data-page="term" data-slug="<slug>" data-root=".."`。

## 6. 資料登錄檔格式（`data/terms.js`）

每個名詞一筆物件，欄位如下：

```js
{
  slug: "diffusion-model",        // 必填，等於檔名
  zh: "擴散模型",                  // 必填，中文名稱
  en: "Diffusion Model",          // 必填，英文名稱
  abbr: "",                       // 選填，常見縮寫（如 "GAN"）
  category: "image",              // 必填，只能是 CATEGORIES 中的 key：basics / text / image
  level: 2,                       // 必填，1 入門、2 進階、3 深入
  summary: "……",                  // 必填，卡片上的一句話摘要，與頁面「一句話定義」意思一致，40 字以內
  related: ["vae", "gan"],        // 必填，2–4 個已存在的 slug
  updated: "2026-11-13"           // 必填，YYYY-MM-DD
}
```

- **陣列順序 = 閱讀順序**（首頁顯示順序、上一個／下一個）。新名詞插在**同分類的最後一筆之後**。
- **相關名詞必須雙向**：A 的 `related` 有 B，B 的 `related` 也要有 A。
- 新增分類時：在 `CATEGORIES` 加一筆，並在 `style.css` 新增對應的 `--cat-<key>` 顏色（亮色與深色都要）。

## 7. 新增一個名詞的標準流程（AI 請照做）

1. 確認 slug 尚未存在於 `data/terms.js`。
2. 複製 `templates/term-template.html` → `terms/<slug>.html`。
3. 取代樣板中所有 `{{...}}` 佔位符，依第 5.2 節寫完每個章節；刪除樣板中的註解。
4. 在 `data/terms.js` 的對應分類末尾新增一筆資料。
5. 更新相關名詞：把新 slug 加進它所列出的每個相關名詞的 `related`（維持雙向），並更新那些名詞的 `updated` 日期。
6. 執行檢查（有 Node.js 時）：`node scripts/check-terms.js`，必須顯示全部通過。
7. 用瀏覽器開 `index.html` 確認：卡片出現、搜尋得到、名詞頁的相關名詞與上下頁正確。

## 8. AI 修改內容時必須遵守的規則

- ✅ **只做被要求的範圍**；不要順手重寫其他名詞頁的內文。
- ✅ 內容必須正確；年份、論文名稱、模型名稱不確定時寧可不寫，**不可捏造引用或數據**。
- ✅ 優先用比喻與步驟解釋，公式是輔助；每段不超過 4 句。
- ✅ 修改共用樣式或腳本後，要確認首頁與至少兩個名詞頁仍正常。
- ❌ 不可在名詞頁手寫相關名詞清單、頁首、頁尾、上下頁（會和資料檔不同步）。
- ❌ 不可新增外部依賴（CDN、字型、追蹤碼、框架）。
- ❌ 不可使用 inline style、不可新增 `style.css` 以外的樣式表。
- ❌ 不可改變第 5.2 節的章節順序與 `id`（`check-terms.js` 與 CSS 依賴它們）。
- ❌ 不可刪除名詞頁而不刪除資料檔中的對應資料（反之亦然）。

## 9. 修改既有名詞

- 修正內文 → 直接改 `terms/<slug>.html`，並更新資料檔該筆的 `updated`。
- 改名詞名稱或摘要 → 頁面 `<h1>`、`<title>`、`<meta description>` 與資料檔要一起改。
- 改 slug → 重新命名檔案，並更新所有 `related` 中的引用，最後跑檢查腳本。

## 10. 完成條件（Definition of Done）

- [ ] `node scripts/check-terms.js` 全部通過（或手動確認第 5、6 節規則）
- [ ] 首頁可搜尋到新名詞（中文、英文、縮寫都要搜得到）
- [ ] 名詞頁八個章節齊全（formula 可省略），相關名詞與上下頁正確
- [ ] 手機寬度下版面正常
