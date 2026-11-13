# AGENTS.md

本專案的完整規則寫在 **[CLAUDE.md](CLAUDE.md)**，所有 AI 代理（Codex、Cursor、Claude Code 等）請先閱讀該文件。

最重要的三件事：

1. 新增名詞 = 複製 `templates/term-template.html` 到 `terms/<slug>.html` + 在 `data/terms.js` 加一筆資料。
2. 頁首、頁尾、相關名詞、上下頁都由 `assets/main.js` 產生，**不要手寫**。
3. 完成後執行 `node scripts/check-terms.js`，必須全部通過。
