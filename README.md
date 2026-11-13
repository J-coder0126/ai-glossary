# AI 名詞小百科

一個用 **CLAUDE.md 規則驅動** 的生成式 AI 名詞解釋網站（LLM Wiki 風格）。
每個名詞一頁、固定八個章節，新增內容只需「複製樣板 + 登錄一筆資料」。

- 網站：`https://<你的帳號>.github.io/<repo 名稱>/`
- 規則：[CLAUDE.md](CLAUDE.md)（AI 代理入口：[AGENTS.md](AGENTS.md)）

## 目前收錄

| 分類 | 名詞 |
|---|---|
| 基礎概念 | Token 化、向量嵌入 |
| 文字生成 | 注意力機制、Transformer |
| 影像生成 | GAN、VAE、擴散模型 |

## 本機預覽

不需要安裝任何東西，直接用瀏覽器開啟 `index.html` 即可。

## 新增名詞

對 AI 說：「請依照 CLAUDE.md 新增一個名詞：<名詞>」。AI 會：

1. 複製 `templates/term-template.html` → `terms/<slug>.html` 並填寫內容
2. 在 `data/terms.js` 登錄資料、更新雙向相關名詞
3. 執行 `node scripts/check-terms.js` 確認通過

## 部署到 GitHub Pages

1. 把整個資料夾推到 GitHub 的公開 repo。
2. Repo → **Settings → Pages** → Source 選 **Deploy from a branch**，Branch 選 `main`、資料夾選 `/ (root)` → Save。
3. 約 1 分鐘後即可在 `https://<帳號>.github.io/<repo>/` 瀏覽。
