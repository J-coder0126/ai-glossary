/*
 * AI 名詞小百科 — 資料登錄檔（唯一資料來源）
 * 規則見 CLAUDE.md 第 6 節：
 *  - 陣列順序 = 閱讀順序；新名詞插在同分類最後一筆之後
 *  - related 必須雙向
 *  - slug 必須等於 terms/<slug>.html 的檔名
 */

window.CATEGORIES = {
  basics: { label: "基礎概念", desc: "理解生成式 AI 前必須先知道的積木" },
  text:   { label: "文字生成", desc: "大型語言模型背後的核心技術" },
  image:  { label: "影像生成", desc: "從雜訊、潛在空間到一張圖" }
};

window.TERMS = [
  /* ---------- basics ---------- */
  {
    slug: "tokenization",
    zh: "Token 化（斷詞）",
    en: "Tokenization",
    abbr: "",
    category: "basics",
    level: 1,
    summary: "把文字切成模型能處理的最小單位 token，再轉成整數編號。",
    related: ["embedding", "transformer"],
    updated: "2026-11-13"
  },
  {
    slug: "embedding",
    zh: "向量嵌入",
    en: "Embedding",
    abbr: "",
    category: "basics",
    level: 1,
    summary: "把 token、圖片等資料轉成一串數字向量，意思相近的東西位置也相近。",
    related: ["tokenization", "attention", "transformer", "vae"],
    updated: "2026-11-13"
  },

  /* ---------- text ---------- */
  {
    slug: "attention",
    zh: "注意力機制",
    en: "Attention Mechanism",
    abbr: "",
    category: "text",
    level: 2,
    summary: "讓模型計算每個位置該「關注」其他位置多少，再加權彙整資訊。",
    related: ["transformer", "embedding", "diffusion-model"],
    updated: "2026-11-13"
  },
  {
    slug: "transformer",
    zh: "Transformer 架構",
    en: "Transformer",
    abbr: "",
    category: "text",
    level: 2,
    summary: "以自注意力為核心、能平行處理整段序列的神經網路架構，是 LLM 的基礎。",
    related: ["attention", "tokenization", "embedding"],
    updated: "2026-11-13"
  },

  /* ---------- image ---------- */
  {
    slug: "gan",
    zh: "生成對抗網路",
    en: "Generative Adversarial Network",
    abbr: "GAN",
    category: "image",
    level: 2,
    summary: "生成器負責造假、判別器負責抓假，兩者互相競爭直到假圖以假亂真。",
    related: ["vae", "diffusion-model"],
    updated: "2026-11-13"
  },
  {
    slug: "vae",
    zh: "變分自編碼器",
    en: "Variational Autoencoder",
    abbr: "VAE",
    category: "image",
    level: 3,
    summary: "把資料壓縮成有規律的機率潛在空間，再從中取樣解碼出新資料。",
    related: ["gan", "diffusion-model", "embedding"],
    updated: "2026-11-13"
  },
  {
    slug: "diffusion-model",
    zh: "擴散模型",
    en: "Diffusion Model",
    abbr: "",
    category: "image",
    level: 3,
    summary: "學會一步步把雜訊去除，從純雜訊中還原出一張全新的圖片。",
    related: ["vae", "gan", "attention"],
    updated: "2026-11-13"
  }
];
