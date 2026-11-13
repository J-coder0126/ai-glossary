#!/usr/bin/env node
/*
 * 一致性檢查（CLAUDE.md 第 7、10 節）
 * 用法：在專案根目錄執行  node scripts/check-terms.js
 * 檢查：資料欄位、slug 與檔案對應、related 存在且雙向、名詞頁章節順序與 body 屬性、樣板佔位符殘留。
 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const errors = [];
const err = (m) => errors.push(m);

// 載入 data/terms.js（它寫入 window.*）
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "data/terms.js"), "utf8"), sandbox);
const { TERMS = [], CATEGORIES = {} } = sandbox.window;

const REQUIRED = ["slug", "zh", "en", "category", "level", "summary", "related", "updated"];
const SECTIONS = ["definition", "analogy", "how-it-works", "formula", "examples", "misconceptions", "related", "references"];
const OPTIONAL = ["formula"];
const slugs = new Set();

for (const t of TERMS) {
  const id = t.slug || "(缺 slug)";
  for (const k of REQUIRED) if (t[k] === undefined || t[k] === "") err(`[${id}] 缺少欄位 ${k}`);
  if (slugs.has(t.slug)) err(`[${id}] slug 重複`);
  slugs.add(t.slug);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug || "")) err(`[${id}] slug 格式錯誤（只能小寫英數與 -）`);
  if (!CATEGORIES[t.category]) err(`[${id}] category "${t.category}" 不在 CATEGORIES 中`);
  if (![1, 2, 3].includes(t.level)) err(`[${id}] level 必須是 1、2、3`);
  if ((t.summary || "").length > 40) err(`[${id}] summary 超過 40 字（${t.summary.length}）`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(t.updated || "")) err(`[${id}] updated 必須是 YYYY-MM-DD`);
  if (!Array.isArray(t.related) || t.related.length < 2 || t.related.length > 4) err(`[${id}] related 需要 2–4 個`);
}

const bySlug = Object.fromEntries(TERMS.map((t) => [t.slug, t]));
for (const t of TERMS) {
  for (const r of t.related || []) {
    if (!bySlug[r]) err(`[${t.slug}] related 指向不存在的 "${r}"`);
    else if (!bySlug[r].related.includes(t.slug)) err(`[${t.slug}] related 不是雙向："${r}" 沒有列出 "${t.slug}"`);
  }

  const file = path.join(ROOT, "terms", `${t.slug}.html`);
  if (!fs.existsSync(file)) { err(`[${t.slug}] 找不到檔案 terms/${t.slug}.html`); continue; }
  const html = fs.readFileSync(file, "utf8");

  if (!html.includes(`data-slug="${t.slug}"`)) err(`[${t.slug}] <body> 的 data-slug 與檔名不一致`);
  if (!html.includes('data-page="term"') || !html.includes('data-root=".."')) err(`[${t.slug}] <body> 缺少 data-page="term" 或 data-root=".."`);
  if (/\{\{.*?\}\}/.test(html)) err(`[${t.slug}] 還有未取代的 {{佔位符}}`);
  if (/style="/.test(html)) err(`[${t.slug}] 不可使用 inline style`);

  const found = [...html.matchAll(/<section id="([^"]+)"/g)].map((m) => m[1]);
  const expected = SECTIONS.filter((s) => found.includes(s) || !OPTIONAL.includes(s));
  if (found.join() !== expected.join()) err(`[${t.slug}] 章節順序或缺漏不符：實際 [${found}]，應為 [${expected}]`);
}

// 反向檢查：terms/ 底下有檔案但資料檔沒登錄
for (const f of fs.readdirSync(path.join(ROOT, "terms"))) {
  if (f.endsWith(".html") && !slugs.has(f.replace(/\.html$/, ""))) err(`terms/${f} 沒有在 data/terms.js 登錄`);
}

if (errors.length) {
  console.error(`✗ 發現 ${errors.length} 個問題：`);
  errors.forEach((e) => console.error("  - " + e));
  process.exit(1);
}
console.log(`✓ 全部通過：${TERMS.length} 個名詞、${Object.keys(CATEGORIES).length} 個分類`);
