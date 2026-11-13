/* AI 名詞小百科 — 全站唯一腳本
 * 依 data/terms.js 產生：頁首、頁尾、首頁卡片/搜尋/篩選、名詞頁 meta/相關名詞/上下頁。
 * <body> 屬性：data-page="home|term|about"、data-root="." 或 ".."、data-slug（名詞頁）。 */
(function () {
  "use strict";

  var body = document.body;
  var ROOT = body.dataset.root || ".";
  var PAGE = body.dataset.page || "";
  var SLUG = body.dataset.slug || "";
  var TERMS = window.TERMS || [];
  var CATS = window.CATEGORIES || {};
  var LEVELS = { 1: "入門", 2: "進階", 3: "深入" };

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function termUrl(slug) { return ROOT + "/terms/" + slug + ".html"; }
  function bySlug(slug) { for (var i = 0; i < TERMS.length; i++) if (TERMS[i].slug === slug) return TERMS[i]; return null; }
  function catLabel(key) { return CATS[key] ? CATS[key].label : key; }
  function levelHtml(n) {
    return '<span class="level" title="難度：' + LEVELS[n] + '">' +
      "●".repeat(n) + "○".repeat(3 - n) + "</span>";
  }

  /* ---------- 共用：頁首、頁尾 ---------- */
  function renderChrome() {
    var h = document.getElementById("site-header");
    if (h) {
      h.outerHTML =
        '<header class="site-header"><div class="container wide">' +
        '<a class="brand" href="' + ROOT + '/index.html"><span class="brand-mark">AI</span>AI 名詞小百科</a>' +
        '<nav class="site-nav">' +
        '<a href="' + ROOT + '/index.html"' + (PAGE === "home" ? ' aria-current="page"' : "") + ">全部名詞</a>" +
        '<a href="' + ROOT + '/about.html"' + (PAGE === "about" ? ' aria-current="page"' : "") + ">關於本站</a>" +
        "</nav></div></header>";
    }
    var f = document.getElementById("site-footer");
    if (f) {
      f.outerHTML =
        '<footer class="site-footer"><div class="container wide">' +
        "AI 名詞小百科 · 共收錄 " + TERMS.length + " 個名詞 · 依 CLAUDE.md 規則以 AI 協作維護" +
        "</div></footer>";
    }
  }

  /* ---------- 卡片 ---------- */
  function cardHtml(t) {
    return '<a class="card cat-' + esc(t.category) + '" href="' + termUrl(t.slug) + '">' +
      "<h3>" + esc(t.zh) + "</h3>" +
      '<div class="en">' + esc(t.en) + (t.abbr ? "（" + esc(t.abbr) + "）" : "") + "</div>" +
      "<p>" + esc(t.summary) + "</p>" +
      '<div class="card-meta"><span class="badge">' + esc(catLabel(t.category)) + "</span>" + levelHtml(t.level) + "</div>" +
      "</a>";
  }

  /* ---------- 首頁 ---------- */
  function renderHome() {
    var grid = document.getElementById("term-grid");
    var chips = document.getElementById("category-chips");
    var search = document.getElementById("search");
    var count = document.getElementById("result-count");
    if (!grid) return;

    var state = { cat: "all", q: "" };

    var chipDefs = [{ key: "all", label: "全部" }];
    Object.keys(CATS).forEach(function (k) { chipDefs.push({ key: k, label: CATS[k].label }); });
    chips.innerHTML = chipDefs.map(function (c) {
      return '<button type="button" class="chip" data-cat="' + c.key + '" aria-pressed="' + (c.key === "all") + '">' + esc(c.label) + "</button>";
    }).join("");
    chips.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      state.cat = btn.dataset.cat;
      chips.querySelectorAll(".chip").forEach(function (b) { b.setAttribute("aria-pressed", b === btn); });
      draw();
    });
    search.addEventListener("input", function () { state.q = search.value.trim().toLowerCase(); draw(); });

    function match(t) {
      if (state.cat !== "all" && t.category !== state.cat) return false;
      if (!state.q) return true;
      return [t.zh, t.en, t.abbr, t.slug, t.summary].join(" ").toLowerCase().indexOf(state.q) !== -1;
    }
    function draw() {
      var list = TERMS.filter(match);
      grid.innerHTML = list.map(cardHtml).join("");
      count.textContent = "顯示 " + list.length + " / " + TERMS.length + " 個名詞";
      if (!list.length) grid.innerHTML = '<div class="empty">找不到符合的名詞，換個關鍵字試試？</div>';
    }
    draw();
  }

  /* ---------- 名詞頁 ---------- */
  function renderTerm() {
    var t = bySlug(SLUG);
    if (!t) { console.warn("[AI 名詞小百科] data/terms.js 找不到 slug：" + SLUG); return; }

    var meta = document.getElementById("term-meta");
    if (meta) {
      meta.className = "term-meta cat-" + t.category;
      meta.innerHTML = '<span class="badge">' + esc(catLabel(t.category)) + "</span>" +
        "<span>難度 " + levelHtml(t.level) + " " + LEVELS[t.level] + "</span>" +
        "<span>更新於 " + esc(t.updated) + "</span>";
    }

    var rel = document.getElementById("related-list");
    if (rel) {
      rel.innerHTML = (t.related || []).map(function (s) {
        var r = bySlug(s);
        if (!r) { console.warn("[AI 名詞小百科] related 指向不存在的 slug：" + s); return ""; }
        if ((r.related || []).indexOf(t.slug) === -1) console.warn("[AI 名詞小百科] related 不是雙向：" + s + " 沒有列出 " + t.slug);
        return cardHtml(r);
      }).join("");
    }

    var pager = document.getElementById("pager");
    if (pager) {
      var i = TERMS.indexOf(t), prev = TERMS[i - 1], next = TERMS[i + 1], html = "";
      if (prev) html += '<a class="prev" href="' + termUrl(prev.slug) + '"><small>← 上一個</small>' + esc(prev.zh) + "</a>";
      if (next) html += '<a class="next" href="' + termUrl(next.slug) + '"><small>下一個 →</small>' + esc(next.zh) + "</a>";
      pager.innerHTML = html;
    }
  }

  renderChrome();
  if (PAGE === "home") renderHome();
  if (PAGE === "term") renderTerm();
})();
