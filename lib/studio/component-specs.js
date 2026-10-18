// Single source of truth for what every Studio component can hold.
//
// All numbers come from lib/studio/capacity-data.js, which is MEASURED in a real
// browser by `npm run measure:capacity` (1080x1350 canvas, real fonts, both
// Instagram and TikTok Photo, all four densities). Nothing here is hand-tuned
// except the editorial "recommended" caps, which keep slides readable even when
// more would technically fit.
//
// Terminology used everywhere (prompt, validator, component pages):
//   hard        most items that can ever fit, with SHORT text. Validator limit.
//   recommended comfortable count with MEDIUM text. What the AI should aim for.
//   long        count that still fits when every item uses LONG text.

import {capacityData} from "./capacity-data";

const PLATFORMS = ["instagram", "tiktok"];
const DENSITIES = ["airy", "balanced", "compact", "bold"];
const TIERS = ["S", "M", "L"];

export const TIER_LENGTHS = capacityData.classes;

// Editorial ceilings for the recommended count (readability, not fit).
const EDITORIAL = {
  bullet: 4, compare: 4, "compare+keywords": 4, causeEffect: 4, framework: 5, "framework+keywords": 5,
  summary: 5, "summary+keywords": 5, timeline: 5, checklist: 5, keywordCluster: 8, miniDiagram: 5,
  funnel: 5, ladder: 5, glossary: 2, stockList: 5, "stockList@heading": 5, stockCompare: 5, "stockCompare@heading": 5, eventCalendar: 5, "eventCalendar@heading": 5, footnote: 3, flow: 4, "flow:column": 4, qaCard: 3, pollCard: 4, barChart: 5, mythFact: 3, prosCons: 4, "table:2": 5, "table:3": 5, "table:4": 5,
};
const EDITORIAL_DEFAULT = 6;
// Layout never limits these, so a ceiling keeps the validator meaningful.
const HARD_CEILING = {keywordCluster: 20, funnel: 6, ladder: 7, pollCard: 4, glossary: 3, footnote: 3, flow: 5, "flow:column": 5};

// stockList has fixed row heights (see lib/studio/stock.js), so its capacity is
// known by construction and is not part of the generated capacity-data.js.
const STATIC_TIERS = {
  stockList: {probe: 0, S: 8, M: 5, L: 3},
  "stockList@heading": {probe: 0, S: 8, M: 5, L: 3},
  stockCompare: {probe: 0, S: 6, M: 5, L: 4},
  "stockCompare@heading": {probe: 0, S: 6, M: 5, L: 4},
  eventCalendar: {probe: 0, S: 6, M: 5, L: 4},
  "eventCalendar@heading": {probe: 0, S: 6, M: 5, L: 4},
};

const cache = new Map();
function tiers(key) {
  if (cache.has(key)) return cache.get(key);
  if (STATIC_TIERS[key]) return STATIC_TIERS[key];
  const entry = capacityData.lists[key];
  if (!entry) throw new Error("Data kapasitas tidak ada untuk " + key + ". Jalankan npm run measure:capacity.");
  const out = {probe: entry.probe};
  for (const tier of TIERS) {
    let min = Infinity;
    for (const p of PLATFORMS) for (const d of DENSITIES) min = Math.min(min, entry.results[p][d][tier]);
    out[tier] = min;
  }
  cache.set(key, out);
  return out;
}

// {hard, recommended, long} for one measured case. `withHeading` uses the
// "@heading" case: the same primitive under a slideHeading in a freeform slide.
export function countLimits(key, {withHeading = false} = {}) {
  const t = tiers(withHeading ? key + "@heading" : key);
  const ceiling = EDITORIAL[key] ?? EDITORIAL_DEFAULT;
  const hard = Math.min(t.S, HARD_CEILING[key] ?? Infinity);
  return {hard, recommended: Math.max(1, Math.min(t.M, ceiling)), long: t.L, medium: t.M, probe: t.probe};
}

// Which measured case sizes each list-like thing. `alone` is the case used for
// validator limits, `heading` for the hint "with a heading above it".
export const CAPACITY_KEYS = {
  bullet: "bullet",
  compare: "compare",
  "compare+keywords": "compare+keywords",
  causeEffect: "causeEffect",
  framework: "framework",
  "framework+keywords": "framework+keywords",
  summary: "summary",
  "summary+keywords": "summary+keywords",
  timeline: "timeline",
  checklist: "checklist",
  keywordCluster: "keywordCluster",
  miniDiagram: "miniDiagram",
};

const CONTAINERS = ["twoColumn", "threeColumn", "contentGrid", "stack"];
export const CONTAINER_CHILDREN = ["infoCard", "statCard", "callout"];
// Which measured layout a container uses. contentGrid was measured with 2
// columns; 1 column behaves like stack and 3 like threeColumn.
export function layoutOf(node) {
  if (node && node.type === "contentGrid") return node.columns === 1 ? "stack" : node.columns === 3 ? "threeColumn" : "contentGrid";
  return node && node.type;
}
export function containerLimits(container, {withHeading = false} = {}) {
  const per = {};
  for (const child of CONTAINER_CHILDREN) per[child] = countLimits(container + ":" + child, {withHeading});
  const best = Object.values(per).reduce((a, b) => (b.hard > a.hard ? b : a));
  return {perChild: per, hard: best.hard};
}

// Measured table cases are per column count (2–4).
export const tableKey = (columns) => "table:" + Math.min(4, Math.max(2, columns || 3));

// Hard validator cap for list lengths.
export function hardCount(name, extra = {}) {
  if (name === "children") return containerLimits(extra.container || "twoColumn").hard;
  return countLimits(CAPACITY_KEYS[name] || name).hard;
}

// ---------- single-text character limits ----------

// Readability ceilings for fields where layout alone would allow absurd lengths.
const CHAR_CEILING = {
  "matrix2x2.title": 48, "matrix2x2.text": 140, "beforeAfter.title": 60, "beforeAfter.text": 200,
  "barChart.label": 60, "avatarQuote.quote": 200, "avatarQuote.role": 60, "photoHero.title": 80, "photoHero.text": 200, "phoneMockup.caption": 140, "pollCard.question": 120, "sourceNote.text": 200, "progressRing.label": 40, "progressRing.note": 100, "mythFact.myth": 140, "mythFact.fact": 160,
  "textBlock.text": 320, "glossary.meaning": 150, "flow.label": 24, "flow.note": 44,
};
const charCache = {};
export function charLimit(key) {
  if (charCache[key]) return charCache[key];
  const entry = capacityData.chars[key];
  if (!entry) return null;
  const max = Math.min(...PLATFORMS.map((p) => entry[p]));
  // 700 is the probe ceiling: it means "never the bottleneck".
  const unbounded = max >= 700;
  const hard = Math.min(unbounded ? 400 : max, CHAR_CEILING[key] ?? Infinity);
  const recommended = Math.max(10, Math.floor((hard * 0.65) / 5) * 5);
  return (charCache[key] = {hard, recommended, measured: max, unbounded});
}

// ---------- fit warnings (soft, per slide) ----------

const len = (v) => (typeof v === "string" ? v.length : 0);
function lengthClass(value, kind) {
  const n = len(value);
  for (const tier of TIERS) if (n <= TIER_LENGTHS[tier][kind]) return tier;
  return "X"; // longer than the longest measured class
}
function worstClass(classes) {
  let rank = 0;
  for (const c of classes) rank = Math.max(rank, c === "X" ? 4 : TIERS.indexOf(c) + 1);
  return rank === 4 ? "X" : TIERS[Math.max(0, rank - 1)];
}
const TIER_NAME = {S: "pendek", M: "sedang", L: "panjang", X: "sangat panjang"};

function check(list, key, label, classOfItem, out, {withHeading = false} = {}) {
  if (!Array.isArray(list) || !list.length) return;
  const cls = worstClass(list.map(classOfItem));
  const lim = countLimits(key, {withHeading});
  const allowed = cls === "X" ? lim.long - 1 : lim[{S: "hard", M: "medium", L: "long"}[cls]];
  if (list.length > allowed) {
    out.push(label + ": " + list.length + " item dengan teks " + TIER_NAME[cls] + " melewati batas terukur (" + Math.max(allowed, 1) + "). Kurangi item atau persingkat teks.");
  }
}

// Returns human readable warnings for one slide JSON object. Never throws.
export function fitWarnings(slide) {
  const out = [];
  try {
    if (!slide || typeof slide !== "object") return out;
    const kw = Array.isArray(slide.keywords) && slide.keywords.length ? "+keywords" : "";
    switch (slide.type) {
      case "bullet":
        check(slide.items, "bullet", "Daftar bullet", (i) => worstClass([lengthClass(i.title, "title"), lengthClass(i.text, "text")]), out);
        break;
      case "compare":
        for (const side of ["left", "right"]) check(slide[side]?.points, "compare" + kw, "Compare (" + side + ")", (p) => lengthClass(p, "point"), out);
        break;
      case "causeEffect":
        check(slide.chain, "causeEffect", "Rantai sebab-akibat", (i) => worstClass([lengthClass(i.title, "title"), lengthClass(i.note, "text")]), out);
        break;
      case "framework":
        check(slide.steps, "framework" + kw, "Framework", (i) => worstClass([lengthClass(i.title, "title"), lengthClass(i.text, "text")]), out);
        break;
      case "summary":
        check(slide.items, "summary" + kw, "Ringkasan", (p) => lengthClass(p, "point"), out);
        break;
      case "freeform": {
        const hasHeading = (slide.nodes || []).some((n) => n && n.type === "slideHeading");
        const walk = (nodes) => (nodes || []).forEach((n) => {
          if (!n || typeof n !== "object") return;
          if (n.type === "timeline") check(n.items, "timeline", "Timeline", (i) => worstClass([lengthClass(i.title, "title"), lengthClass(i.text, "text")]), out, {withHeading: hasHeading});
          if (n.type === "checklist") check(n.items, "checklist", "Checklist", (p) => lengthClass(p, "point"), out, {withHeading: hasHeading});
          if (n.type === "keywordCluster") check(n.items, "keywordCluster", "Keyword cluster", (p) => lengthClass(p, "chip"), out, {withHeading: hasHeading});
          if (n.type === "miniDiagram") check(n.items, "miniDiagram", "Mini diagram", (p) => lengthClass(p, "node"), out, {withHeading: hasHeading});
          if (n.type === "barChart") check(n.items, "barChart", "Bar chart", (i) => worstClass([lengthClass(i.label, "title"), lengthClass(i.note, "node")]), out, {withHeading: hasHeading});
          if (n.type === "funnel") check(n.items, "funnel", "Funnel", (i) => worstClass([lengthClass(i.label, "title"), lengthClass(i.note, "node")]), out, {withHeading: hasHeading});
          if (n.type === "ladder") check(n.items, "ladder", "Ladder", (i) => worstClass([lengthClass(i.label, "title"), lengthClass(i.note, "node")]), out, {withHeading: hasHeading});
          if (n.type === "footnote") check(n.items, "footnote", "Footnote", (p) => lengthClass(p, "text"), out, {withHeading: hasHeading});
          if (n.type === "stockList" && (n.items?.length || 0) > 5 && out.length < 8) out.push("Daftar saham " + n.items.length + " item memakai baris ringkas tanpa catatan; untuk catatan per saham, pakai maksimal 5 item.");
          if (n.type === "glossary") check(n.items, "glossary", "Glosarium", (i) => worstClass([lengthClass(i.term, "chip"), lengthClass(i.meaning, "text")]), out, {withHeading: hasHeading});
          if (n.type === "flow") check(n.items, n.direction === "column" ? "flow:column" : "flow", "Flow", (i) => worstClass([lengthClass(i.label, "node"), lengthClass(i.note, "node")]), out, {withHeading: hasHeading});
          if (n.type === "qaCard") check(n.items, "qaCard", "Q&A", (i) => worstClass([lengthClass(i.q, "point"), lengthClass(i.a, "text")]), out, {withHeading: hasHeading});
          if (n.type === "pollCard") check(n.options, "pollCard", "Poll", (o) => lengthClass(o, "point"), out, {withHeading: hasHeading});
          if (n.type === "mythFact") check(n.items, "mythFact", "Mitos & fakta", (i) => worstClass([lengthClass(i.myth, "point"), lengthClass(i.fact, "point")]), out, {withHeading: hasHeading});
          if (n.type === "prosCons") {
            for (const side of ["pros", "cons"]) check(n[side], "prosCons", "Pros/cons (" + side + ")", (p) => lengthClass(p, "point"), out, {withHeading: hasHeading});
          }
          if (n.type === "table" && Array.isArray(n.columns)) {
            const kind = n.columns.length === 2 ? "point" : "node";
            check(n.rows, tableKey(n.columns.length), "Tabel", (r) => worstClass((r.cells || []).map((c) => lengthClass(c, kind))), out, {withHeading: hasHeading});
          }
          if (CONTAINERS.includes(n.type) && Array.isArray(n.children)) {
            const kinds = [...new Set(n.children.map((c) => c && c.type))];
            const kind = kinds.length === 1 && CONTAINER_CHILDREN.includes(kinds[0]) ? kinds[0] : "infoCard";
            const classOf = (c) => worstClass([lengthClass(c.title || c.label || c.value, "title"), lengthClass(c.text || c.note, "text")]);
            check(n.children, layoutOf(n) + ":" + kind, n.type + " (" + kind + ")", classOf, out, {withHeading: hasHeading});
          }
          if (Array.isArray(n.children)) walk(n.children);
        });
        walk(slide.nodes);
        break;
      }
      default:
    }
    // Extras take height from the main content: keep it within the editorial
    // (recommended) counts so nothing is clipped at the bottom.
    if (Array.isArray(slide.extras) && slide.extras.length) {
      const mains = {
        bullet: [["bullet", slide.items, "Daftar bullet"]],
        compare: ["left", "right"].map((side) => ["compare" + kw, slide[side]?.points, "Compare (" + side + ")"]),
        causeEffect: [["causeEffect", slide.chain, "Rantai sebab-akibat"]],
        framework: [["framework" + kw, slide.steps, "Framework"]],
        summary: [["summary" + kw, slide.items, "Ringkasan"]],
      }[slide.type] || [];
      for (const [key, list, label] of mains) {
        const rec = countLimits(key).recommended;
        if (Array.isArray(list) && list.length > rec) out.push(label + ": " + list.length + " item + extras kemungkinan terpotong di bawah. Kurangi ke " + rec + " item atau hapus extras.");
      }
      if (slide.type === "freeform" && slide.extras.length + (slide.nodes || []).length > 7) out.push("Freeform: nodes + extras terlalu banyak (" + ((slide.nodes || []).length + slide.extras.length) + "). Kurangi agar tidak terpotong di bawah.");
    }
  } catch {
    // warnings are advisory only
  }
  return out;
}

// ---------- prompt text ----------

function range(l) {
  return "maks " + l.hard + " (teks pendek) · rekomendasi " + l.recommended + " · bila teks panjang maks " + l.long;
}

// Indonesian block pasted into the AI prompt. Generated from the measurements.
export function capacityPromptSection() {
  const c = (k) => charLimit(k);
  const L = TIER_LENGTHS;
  const lines = [];
  lines.push("KAPASITAS TERUKUR (kanvas 1080×1350, Instagram dan TikTok Photo, semua density; hasil pengukuran layout nyata, bukan perkiraan):");
  lines.push("Panjang teks acuan per item — pendek: judul ≤" + L.S.title + ", kalimat ≤" + L.S.text + ", poin ≤" + L.S.point +
    " karakter; sedang: judul ≤" + L.M.title + ", kalimat ≤" + L.M.text + ", poin ≤" + L.M.point +
    "; panjang: judul ≤" + L.L.title + ", kalimat ≤" + L.L.text + ", poin ≤" + L.L.point + ".");
  lines.push("Aturan: semakin panjang teks per item, semakin sedikit item yang muat. TARGETKAN jumlah \"rekomendasi\" dengan teks sedang; jangan melebihi \"maks\". Validator Studio menolak jumlah di atas maks dan memberi peringatan bila teks terlalu panjang untuk jumlahnya.");
  lines.push("");
  lines.push("JUMLAH ITEM PER PRESET:");
  lines.push("- bullet.items: " + range(countLimits("bullet")));
  lines.push("- compare.left.points dan right.points (masing-masing): " + range(countLimits("compare")) + "; bila memakai keywords: maks " + countLimits("compare+keywords").hard);
  lines.push("- causeEffect.chain: " + range(countLimits("causeEffect")));
  lines.push("- framework.steps: " + range(countLimits("framework")));
  lines.push("- summary.items: " + range(countLimits("summary")) + "; bila memakai keywords: maks " + countLimits("summary+keywords").hard);
  lines.push("- keywords (opsional, semua preset): maks 8");
  lines.push("");
  lines.push("JUMLAH ITEM PRIMITIVE DALAM freeform (angka kedua = bila ada slideHeading di atasnya):");
  const prim = (name, key) => {
    const a = countLimits(key), b = countLimits(key, {withHeading: true});
    return "- " + name + ".items: maks " + a.hard + " / " + b.hard + " · rekomendasi " + Math.min(a.recommended, b.recommended) + " · teks panjang maks " + b.long;
  };
  lines.push(prim("timeline", "timeline"));
  lines.push(prim("checklist", "checklist"));
  lines.push(prim("keywordCluster", "keywordCluster") + " (chip pendek)");
  lines.push(prim("miniDiagram", "miniDiagram"));
  lines.push(prim("barChart", "barChart") + " (item = batang)");
  lines.push("- photoHero: size " + allowedSizes("photoHero").join("/") + " (muat di bawah heading); title maks " + charLimit("photoHero.title").hard + ", text maks " + charLimit("photoHero.text").hard + ". phoneMockup: size " + allowedSizes("phoneMockup").join("/") + "; caption maks " + charLimit("phoneMockup.caption").hard + ". collage: 2–4 item, size " + allowedSizes("collage").join("/") + ", caption ≤40. avatarQuote: quote maks " + charLimit("avatarQuote.quote").hard + ", role maks " + charLimit("avatarQuote.role").hard + ".");
  lines.push(prim("funnel", "funnel") + " (item = tahap; shape \"funnel\" menyempit ke bawah, \"pyramid\" melebar)");
  lines.push(prim("ladder", "ladder") + " (item = level berurutan; satu item boleh current:true)");
  lines.push(prim("qaCard", "qaCard") + " (item = pasangan tanya/jawab)");
  lines.push(prim("pollCard", "pollCard").replace(".items:", ".options:") + "; question maks " + charLimit("pollCard.question").hard + "/ideal " + charLimit("pollCard.question").recommended);
  lines.push("- progressRing: value 0–100 (angka dari pengguna), label maks " + charLimit("progressRing.label").hard + ", note maks " + charLimit("progressRing.note").hard + ". sourceNote.text maks " + charLimit("sourceNote.text").hard + " karakter. swipeHint.text maks 16.");
  lines.push(prim("flow", "flow") + " (alur 2–" + countLimits("flow").hard + " langkah; baris \"row\" otomatis turun (maks 3 langkah per baris), label ≤" + charLimit("flow.label").hard + " dan note ≤" + charLimit("flow.note").hard + " karakter; direction \"column\" maks " + countLimits("flow:column").hard + "; via = label pendek (≤14) pada panah; fork = tepat 2 hasil percabangan)");
  lines.push(prim("glossary", "glossary") + " (item = istilah + arti; arti maks " + charLimit("glossary.meaning").hard + ")");
  lines.push("- stockList: 1–8 saham (rekomendasi ideal ≤5). 1–3 saham = kartu besar (note ≤90), 4–5 = kartu sedang (note ≤56), 6–8 = baris ringkas TANPA note. ticker ≤8 (wajib), name ≤28, action ≤14, signal buy/accumulate/hold/watch/sell, entry ≤16, target ≤12, stop ≤12. Taruh sendirian di bawah slideHeading; disclaimer tetap aktif.");
  lines.push("- priceChart: candles:[{o,h,l,c}] ATAU points:[angka] (5–60 data, semuanya dari pengguna), levels?:[{kind: entry|target|stop|support|resistance, value, label?}] maks 4, title ≤40, caption ≤80, from/to ≤12 (label sumbu x). Sendirian di bawah slideHeading; jangan mengarang data harga.");
  lines.push("- stockCompare: left/right:{ticker,name?,signal?}, rows:[{label ≤22,left,right ≤18,better?}] 1–6 (ideal ≤5). tradePlan: ticker?, scenarios:[{kind: bull|base|bear, trigger ≤80, target? ≤24, note? ≤80}] 1–3, risk? ≤100. eventCalendar: items:[{date ≤10 mis. \"21 Okt\", title ≤36, tag? ≤12, note? ≤64}] 1–6 (ideal ≤5). Ketiganya sendirian di bawah slideHeading; hanya data dari pengguna.");
  lines.push(prim("footnote", "footnote") + " (item = satu catatan kaki bernomor)");
  lines.push("- textBlock: paragraf biasa tanpa kartu, text maks " + charLimit("textBlock.text").hard + "/ideal " + charLimit("textBlock.text").recommended + ", size md/lg.");
  lines.push(prim("mythFact", "mythFact") + " (item = pasangan mitos/fakta)");
  lines.push(prim("prosCons", "prosCons").replace(".items:", ".pros dan .cons (masing-masing):"));
  {
    const parts = [2, 3, 4].map((cols) => cols + " kolom maks " + countLimits(tableKey(cols)).hard + "/" + countLimits(tableKey(cols), {withHeading: true}).hard + " (rekomendasi " + Math.min(countLimits(tableKey(cols)).recommended, countLimits(tableKey(cols), {withHeading: true}).recommended) + ")");
    lines.push("- table.rows: " + parts.join("; ") + "; sel pendek (≤" + L.M.node + " karakter bila 3–4 kolom)");
  }
  lines.push("- matrix2x2: tepat 4 kuadran; title maks " + charLimit("matrix2x2.title").hard + "/ideal " + charLimit("matrix2x2.title").recommended + ", text maks " + charLimit("matrix2x2.text").hard + "/ideal " + charLimit("matrix2x2.text").recommended + ".");
  lines.push("- beforeAfter: title maks " + charLimit("beforeAfter.title").hard + "/ideal " + charLimit("beforeAfter.title").recommended + ", text maks " + charLimit("beforeAfter.text").hard + "/ideal " + charLimit("beforeAfter.text").recommended + " (dengan slot lg).");
  for (const container of CONTAINERS) {
    const parts = CONTAINER_CHILDREN.map((child) => {
      const a = countLimits(container + ":" + child), b = countLimits(container + ":" + child, {withHeading: true});
      return child + " maks " + a.hard + "/" + b.hard + " (rekomendasi " + Math.min(a.recommended, b.recommended) + ")";
    });
    lines.push("- " + container + ".children: " + parts.join("; "));
  }
  lines.push("- contentGrid diukur dengan columns:2; columns:1 mengikuti angka stack dan columns:3 mengikuti threeColumn. Di TikTok Photo kolom otomatis menjadi 1, angka di atas sudah memakai nilai terketat dari kedua platform.");
  lines.push("- freeform.nodes: kombinasi total harus muat satu kanvas. Jangan menumpuk beberapa daftar penuh pada satu slide; jumlah item di atas berlaku untuk SATU primitive, bukan untuk seluruh slide.");
  lines.push("");
  lines.push("BATAS KARAKTER TEKS TUNGGAL (maks / rekomendasi):");
  const ch = (label, k) => {
    const v = c(k);
    return v ? label + " " + v.hard + "/" + v.recommended : null;
  };
  lines.push("- " + [ch("hero.title", "hero.title"), ch("hero.subtitle", "hero.subtitle"), ch("statement.lead", "statement.lead"),
    ch("statement.highlight", "statement.highlight"), ch("statement.note", "statement.note"), ch("cta.title", "cta.title"),
    ch("cta.body", "cta.body"), ch("causeEffect.causeTitle/effectTitle", "causeEffect.causeTitle"),
    ch("causeEffect.causeText/effectText", "causeEffect.causeText"), ch("slideHeading.title", "slideHeading.title")].filter(Boolean).join("; ") + ".");
  lines.push("- backgroundWord maks 24, cornerLabel maks 40 karakter.");
  lines.push("- Teks di dalam kartu (infoCard, callout, quoteCard, diagramNode, statCard) dibatasi tinggi kartu: pakai ≤" + L.M.text + " karakter per teks kartu.");
  return lines.join("\n");
}

// ---------- component registry (gallery, forms, how-to) ----------

const t = (key, label, o = {}) => ({key, label, type: "text", ...o});
const ta = (key, label, o = {}) => ({key, label, type: "textarea", ...o});
const sel = (key, label, options, o = {}) => ({key, label, type: "select", options, ...o});
const bool = (key, label, o = {}) => ({key, label, type: "bool", ...o});
const strings = (key, label, o = {}) => ({key, label, type: "list", item: "string", ...o});
const items = (key, label, fields, o = {}) => ({key, label, type: "list", item: fields, ...o});
const group = (key, label, fields, o = {}) => ({key, label, type: "group", fields, ...o});

const DENSITY = sel("density", "Density", ["airy", "balanced", "compact", "bold"]);
const BG = t("backgroundWord", "Kata latar (opsional)", {max: 24, placeholder: "mis. FOKUS"});
const CORNER = t("cornerLabel", "Label sudut (opsional)", {max: 40});
const KEYWORDS = strings("keywords", "Keywords (opsional)", {max: 8, itemMax: 24, hint: "Chip kata kunci di slide. Hilangkan bila tidak relevan."});
const DARK = bool("dark", "Mode gelap");
const image = (key, label, o = {}) => ({key, label, type: "image", ...o});

export const SLIDE_SPECS = {
  hero: {
    label: "Hero (cover)", kind: "slide",
    summary: "Slide pembuka. Judul besar, subjudul, dan identitas akun otomatis.",
    use: "Hook utama di slide 1. Satu gagasan, tanpa daftar.",
    fields: [t("eyebrow", "Eyebrow", {max: 40}), t("title", "Judul", {required: true, limit: "hero.title"}), ta("subtitle", "Subjudul", {required: true, limit: "hero.subtitle"}), t("accent", "Aksen (opsional)", {max: 60}), DENSITY],
    sample: {type: "hero", eyebrow: "BERPIKIR KRITIS", title: "Berhenti Percaya Semua Pikiranmu", subtitle: "Cara memisahkan fakta, asumsi, dan perasaan sebelum mengambil keputusan penting."},
    notes: ["Hanya muncul sebagai hero bila ada di posisi slide pertama; di posisi lain tampil sebagai slide biasa.", "Judul panjang mengecilkan ruang subjudul."],
  },
  statement: {
    label: "Statement", kind: "slide",
    summary: "Satu pernyataan kuat dengan kata sorot.",
    use: "Reframe, kutipan sikap, atau jeda napas antar slide padat.",
    fields: [t("eyebrow", "Eyebrow", {max: 40}), t("lead", "Kalimat utama", {required: true, limit: "statement.lead"}), t("highlight", "Kata sorot", {required: true, limit: "statement.highlight"}), ta("note", "Catatan", {limit: "statement.note"}), BG, CORNER, DENSITY],
    sample: {type: "statement", eyebrow: "REFRAME", lead: "Bukan soal seberapa cepat kamu memutuskan,", highlight: "tapi seberapa jernih dasarnya.", note: "Keputusan cepat tanpa dasar hanyalah kebiasaan yang terasa meyakinkan."},
  },
  bullet: {
    label: "Bullet", kind: "slide",
    summary: "Daftar sejajar bernomor, tiap item punya judul dan penjelasan.",
    use: "Beberapa poin setara tanpa urutan wajib.",
    fields: [t("eyebrow", "Eyebrow", {max: 40}), t("title", "Judul", {required: true, max: 120}), items("items", "Item", [t("title", "Judul item", {required: true, itemKind: "title"}), ta("text", "Penjelasan", {itemKind: "text"})], {capacity: "bullet", required: true}), BG, CORNER, DENSITY],
    sample: {type: "bullet", eyebrow: "BREAKDOWN", title: "Tiga lapis dalam satu keputusan", items: [{title: "Fakta", text: "Hal yang bisa diverifikasi orang lain."}, {title: "Asumsi", text: "Hal yang kamu anggap benar tanpa bukti."}, {title: "Perasaan", text: "Dorongan yang memengaruhi cara membaca fakta."}]},
  },
  compare: {
    label: "Compare", kind: "slide",
    summary: "Dua sisi berlawanan dengan jumlah poin di tiap sisi.",
    use: "Kontras: sebelum/sesudah, mitos/fakta, refleks/uji.",
    fields: [t("eyebrow", "Eyebrow", {max: 40}), t("title", "Judul", {required: true, max: 120}),
      group("left", "Sisi kiri", [t("label", "Label"), t("heading", "Judul sisi"), strings("points", "Poin", {capacity: "compare", required: true, itemKind: "point"})]),
      group("right", "Sisi kanan", [t("label", "Label"), t("heading", "Judul sisi"), strings("points", "Poin", {capacity: "compare", required: true, itemKind: "point"})]),
      KEYWORDS, BG, CORNER, DENSITY],
    sample: {type: "compare", eyebrow: "KONTRAS", title: "Refleks vs uji", left: {label: "REFLEKS", heading: "Reaksi spontan", points: ["Mengandalkan firasat", "Cepat, tetapi sering bias", "Sulit dijelaskan ulang"]}, right: {label: "UJI", heading: "Pemeriksaan sadar", points: ["Mencari bukti pembanding", "Lebih lambat, lebih jernih", "Bisa diulang oleh orang lain"]}},
  },
  causeEffect: {
    label: "Cause & Effect", kind: "slide",
    summary: "Sebab dan akibat, dengan rantai langkah opsional di antaranya.",
    use: "Menjelaskan mekanisme: A menyebabkan B melalui langkah tertentu.",
    fields: [t("causeTitle", "Judul sebab", {required: true, limit: "causeEffect.causeTitle"}), ta("causeText", "Teks sebab", {limit: "causeEffect.causeText"}), t("effectTitle", "Judul akibat", {required: true, limit: "causeEffect.effectTitle"}), ta("effectText", "Teks akibat", {limit: "causeEffect.effectText"}), t("chainLabel", "Label rantai", {max: 40}), t("chainCaption", "Keterangan rantai", {max: 120}),
      items("chain", "Rantai (opsional)", [t("title", "Judul langkah", {required: true, itemKind: "title"}), ta("note", "Catatan", {itemKind: "text"})], {capacity: "causeEffect", min: 0}), BG, CORNER, DENSITY],
    sample: {type: "causeEffect", causeTitle: "Terlalu banyak opsi", causeText: "Otak kewalahan membandingkan semua kemungkinan.", effectTitle: "Keputusan tertunda", effectText: "Kamu menunda sampai ada tekanan dari luar.", chainLabel: "POLA", chain: [{title: "Bandingkan", note: "Tanpa kriteria jelas"}, {title: "Ragu", note: "Takut salah pilih"}, {title: "Tunda", note: "Menunggu kepastian"}]},
  },
  framework: {
    label: "Framework", kind: "slide",
    summary: "Langkah berurutan bernomor.",
    use: "Proses, metode, atau pertanyaan yang dijawab berurutan.",
    fields: [t("eyebrow", "Eyebrow", {max: 40}), t("title", "Judul", {required: true, max: 120}), items("steps", "Langkah", [t("title", "Judul langkah", {required: true, itemKind: "title"}), ta("text", "Penjelasan", {itemKind: "text"})], {capacity: "framework", required: true}), KEYWORDS, BG, CORNER, DENSITY],
    sample: {type: "framework", eyebrow: "FRAMEWORK", title: "Lima pertanyaan sebelum memutuskan", steps: [{title: "Apa klaimnya?", text: "Tulis dalam satu kalimat."}, {title: "Apa buktinya?", text: "Pisahkan data dari opini."}, {title: "Apa asumsinya?", text: "Yang belum kamu uji."}, {title: "Apa alternatifnya?", text: "Setidaknya satu."}, {title: "Apa ujinya?", text: "Cara termurah untuk salah."}]},
  },
  summary: {
    label: "Summary", kind: "slide",
    summary: "Rangkuman poin-poin kunci.",
    use: "Penutup sebelum CTA. Poin pendek dan bisa disimpan.",
    fields: [t("title", "Judul", {required: true, max: 120}), strings("items", "Poin", {capacity: "summary", required: true, itemKind: "point"}), KEYWORDS, BG, CORNER, DENSITY],
    sample: {type: "summary", title: "Yang perlu kamu ingat", items: ["Pisahkan fakta dari asumsi.", "Cari satu bukti yang bertentangan.", "Uji dengan langkah kecil.", "Putuskan, lalu evaluasi."]},
  },
  cta: {
    label: "CTA (penutup)", kind: "slide",
    summary: "Ajakan bertindak penutup. Identitas akun otomatis.",
    use: "Slide terakhir: simpan, bagikan, ikuti, atau komentar.",
    fields: [t("title", "Judul", {required: true, limit: "cta.title"}), ta("body", "Isi", {limit: "cta.body"}), t("cta", "Teks tombol/aksi", {max: 80}), DENSITY],
    sample: {type: "cta", title: "Simpan untuk keputusan berikutnya", body: "Bagikan ke satu teman yang sedang menimbang pilihan penting.", cta: "Simpan dan bagikan"},
    notes: ["Tampil sebagai penutup hanya di slide terakhir."],
  },
  freeform: {
    label: "Freeform", kind: "slide",
    summary: "Kanvas bebas: susun primitive sesuai makna informasi.",
    use: "Bila preset terasa memaksa. Gabungkan heading, kartu, diagram, dan daftar.",
    fields: [t("eyebrow", "Eyebrow", {max: 40}), sel("theme", "Tema latar", null, {dynamic: "themes"}), DARK, BG, CORNER, DENSITY, {key: "nodes", label: "Primitive", type: "nodes", required: true, max: 18}],
    sample: {type: "freeform", eyebrow: "CONTOH", density: "balanced", nodes: [{type: "slideHeading", title: "Satu ide, satu kanvas", body: "Susun komponen sesuai makna, bukan sesuai template."}, {type: "checklist", items: ["Tulis klaim", "Cari bukti", "Uji hasilnya"]}]},
  },
};

export const PRIMITIVE_SPECS = {
  slideHeading: {label: "Slide Heading", summary: "Judul dan pengantar singkat di atas freeform.", use: "Judul slide freeform.",
    fields: [t("title", "Judul", {required: true, limit: "slideHeading.title"}), ta("body", "Pengantar", {limit: "slideHeading.body"}), t("eyebrow", "Eyebrow"), sel("align", "Rata", ["left", "center"])],
    sample: {type: "slideHeading", title: "Cara menguji sebuah klaim", body: "Tiga pemeriksaan singkat sebelum kamu percaya."}},
  infoCard: {label: "Info Card", summary: "Kartu berisi judul dan teks.", use: "Definisi, penjelasan konsep, satu poin utuh.",
    fields: [t("eyebrow", "Eyebrow", {max: 30}), t("title", "Judul", {required: true, itemKind: "title"}), ta("text", "Teks", {itemKind: "text"}), sel("variant", "Varian", ["soft", "outline", "accent", "dark", "glass"])],
    sample: {type: "infoCard", eyebrow: "DEFINISI", title: "Asumsi", text: "Keyakinan yang kamu pakai sebagai dasar tanpa pernah diperiksa."}},
  statCard: {label: "Stat Card", summary: "Angka besar dengan label dan catatan.", use: "Satu statistik. Jangan mengarang angka.",
    fields: [t("value", "Nilai", {required: true, max: 12}), t("label", "Label", {itemKind: "title"}), t("note", "Catatan", {itemKind: "text"}), sel("variant", "Varian", ["light", "dark"])],
    sample: {type: "statCard", value: "3x", label: "Lebih mudah diingat", note: "Contoh angka sendiri; ganti dengan data yang terverifikasi."}},
  bigNumber: {label: "Big Number", summary: "Angka sangat besar sebagai sorotan.", use: "Satu angka yang menjadi inti slide.",
    fields: [t("value", "Nilai", {required: true, max: 12}), t("label", "Label", {max: 120}), DARK],
    sample: {type: "bigNumber", value: "5", label: "pertanyaan sebelum memutuskan"}},
  quoteCard: {label: "Quote Card", summary: "Kutipan atau model mental.", use: "Prinsip, kutipan yang bisa dipertanggungjawabkan, atau model mental.",
    fields: [ta("quote", "Kutipan", {required: true, max: 220}), t("source", "Sumber", {max: 60}), DARK],
    sample: {type: "quoteCard", quote: "Pertanyaan yang baik lebih berguna daripada jawaban yang cepat.", source: "Prinsip Aksioma"}},
  diagramNode: {label: "Diagram Node", summary: "Satu simpul konsep; susun dengan connector.", use: "Relasi antar konsep.",
    fields: [t("title", "Judul", {required: true, max: 40}), ta("body", "Isi", {max: 120}), DARK],
    sample: {type: "diagramNode", title: "Asumsi", body: "Diuji sebelum dipakai."}},
  connector: {label: "Connector", summary: "Panah antar simpul.", use: "HANYA bila ada relasi nyata.",
    fields: [sel("direction", "Arah", ["down", "right"]), t("label", "Label", {max: 24}), DARK],
    sample: {type: "connector", direction: "down", label: "menghasilkan"}},
  timeline: {label: "Timeline", summary: "Urutan kejadian atau tahap.", use: "Proses berurutan dengan judul + penjelasan.",
    fields: [items("items", "Tahap", [t("title", "Judul", {required: true, itemKind: "title"}), ta("text", "Penjelasan", {itemKind: "text"})], {capacity: "timeline", required: true}), DARK],
    sample: {type: "timeline", items: [{title: "Tulis klaim", text: "Satu kalimat."}, {title: "Cari bukti", text: "Dua sumber berbeda."}, {title: "Uji", text: "Dalam skala kecil."}]}},
  checklist: {label: "Checklist", summary: "Daftar tindakan bercentang.", use: "Langkah praktis yang bisa langsung dilakukan.",
    fields: [strings("items", "Item", {capacity: "checklist", required: true, itemKind: "point"}), DARK],
    sample: {type: "checklist", items: ["Tulis klaimnya", "Cari satu bukti tandingan", "Uji dalam skala kecil"]}},
  callout: {label: "Callout", summary: "Sorotan penting dengan label.", use: "Peringatan, tips, atau kesimpulan cepat.",
    fields: [t("label", "Label", {max: 20}), ta("text", "Teks", {required: true, itemKind: "text"}), DARK],
    sample: {type: "callout", label: "CATATAN", text: "Satu bukti tidak cukup; cari pola, bukan kebetulan."}},
  pill: {label: "Pill", summary: "Label kecil berbentuk kapsul.", use: "Tag tunggal yang punya makna.",
    fields: [t("text", "Teks", {required: true, max: 40}), DARK],
    sample: {type: "pill", text: "Berpikir kritis"}},
  keywordCluster: {label: "Keyword Cluster", summary: "Kumpulan chip kategori.", use: "Taksonomi nyata, bukan pengulangan kata.",
    fields: [strings("items", "Kata kunci", {capacity: "keywordCluster", required: true, itemKind: "chip", itemMax: 24}), DARK],
    sample: {type: "keywordCluster", items: ["Fakta", "Asumsi", "Opini", "Bukti"]}},
  miniDiagram: {label: "Mini Diagram", summary: "Alur singkat berupa simpul berurutan.", use: "Alur sederhana A → B → C.",
    fields: [strings("items", "Simpul", {capacity: "miniDiagram", required: true, itemKind: "node"}), DARK],
    sample: {type: "miniDiagram", items: ["Klaim", "Bukti", "Uji", "Putusan"]}},
  divider: {label: "Divider", summary: "Garis pemisah.", use: "Memisahkan dua kelompok informasi.",
    fields: [DARK], sample: {type: "divider"}},
  twoColumn: {label: "Two Column", summary: "Dua kolom (satu kolom di TikTok).", use: "Perbandingan sejajar atau pasangan kartu.",
    fields: [{key: "children", label: "Isi kolom", type: "children", container: "twoColumn", required: true}],
    sample: {type: "twoColumn", children: [{type: "infoCard", title: "Fakta", text: "Dapat diverifikasi."}, {type: "infoCard", title: "Asumsi", text: "Perlu diuji."}]}},
  threeColumn: {label: "Three Column", summary: "Tiga kolom (satu kolom di TikTok).", use: "Tiga kartu pendek bersisian.",
    fields: [{key: "children", label: "Isi kolom", type: "children", container: "threeColumn", required: true}],
    sample: {type: "threeColumn", children: [{type: "statCard", value: "1", label: "Klaim"}, {type: "statCard", value: "2", label: "Bukti"}, {type: "statCard", value: "3", label: "Uji"}]}},
  contentGrid: {label: "Content Grid", summary: "Grid 1–3 kolom.", use: "Kartu seragam dalam grid.",
    fields: [sel("columns", "Kolom", [1, 2, 3], {valueType: "number"}), {key: "children", label: "Isi grid", type: "children", container: "contentGrid", required: true}],
    sample: {type: "contentGrid", columns: 2, children: [{type: "callout", label: "TIPS", text: "Mulai dari yang kecil."}, {type: "callout", label: "CEK", text: "Ulangi minggu depan."}]}},
  stack: {label: "Stack", summary: "Susunan vertikal.", use: "Mengelompokkan beberapa primitive.",
    fields: [{key: "children", label: "Isi", type: "children", container: "stack", required: true}],
    sample: {type: "stack", children: [{type: "pill", text: "Langkah 1"}, {type: "callout", text: "Mulai dari klaim."}]}},
  barChart: {label: "Bar Chart", summary: "Batang horizontal dari angka yang Anda isi.", use: "Perbandingan nilai. Gunakan data terverifikasi; jangan mengarang angka.",
    fields: [t("unit", "Satuan (opsional)", {max: 6, placeholder: "%"}), {key: "max", label: "Nilai maksimum batang (opsional)", type: "text", numeric: true, hint: "Kosong = otomatis (100 bila satuan %)."}, DARK,
      items("items", "Batang", [t("label", "Label", {required: true, limit: "barChart.label"}), t("value", "Nilai (angka)", {required: true, numeric: true, max: 12}), t("note", "Catatan", {itemKind: "node"})], {capacity: "barChart", required: true})],
    sample: {type: "barChart", unit: "%", items: [{label: "Disiplin menyimpan", value: 72}, {label: "Rutin mengevaluasi", value: 48}, {label: "Mencatat keputusan", value: 31, note: "Contoh angka; ganti data sendiri."}]}},
  matrix2x2: {label: "Matrix 2×2", summary: "Empat kuadran dengan dua sumbu.", use: "Memetakan pilihan: penting/mendesak, risiko/imbal hasil.",
    fields: [group("xAxis", "Sumbu horizontal", [t("low", "Ujung kiri", {max: 24}), t("high", "Ujung kanan", {max: 24})]), group("yAxis", "Sumbu vertikal", [t("low", "Bawah", {max: 24}), t("high", "Atas", {max: 24})]),
      items("quadrants", "Kuadran (urutan: kiri-atas, kanan-atas, kiri-bawah, kanan-bawah)", [t("title", "Judul", {required: true, limit: "matrix2x2.title"}), ta("text", "Teks", {limit: "matrix2x2.text"})], {fixed: 4, required: true}), DARK],
    sample: {type: "matrix2x2", xAxis: {low: "Mudah", high: "Sulit"}, yAxis: {low: "Dampak kecil", high: "Dampak besar"}, quadrants: [{title: "Kerjakan dulu", text: "Dampak besar, mudah."}, {title: "Rencanakan", text: "Dampak besar, sulit."}, {title: "Selipkan", text: "Dampak kecil, mudah."}, {title: "Abaikan", text: "Dampak kecil, sulit."}]}},
  table: {label: "Tabel", summary: "Tabel perbandingan 2–4 kolom.", use: "Membandingkan beberapa opsi pada beberapa kriteria.",
    fields: [strings("columns", "Kolom (judul)", {min: 2, max: 4, required: true, itemMax: 24, hint: "2–4 kolom. Kolom pertama menjadi label baris."}),
      items("rows", "Baris", [strings("cells", "Sel (satu per kolom)", {max: 4, itemMax: 60})], {capacity: "table", required: true}), DARK],
    sample: {type: "table", columns: ["Aspek", "Refleks", "Uji"], rows: [{cells: ["Kecepatan", "Cepat", "Lebih lambat"]}, {cells: ["Dasar", "Firasat", "Bukti"]}, {cells: ["Risiko bias", "Tinggi", "Lebih rendah"]}]}},
  mythFact: {label: "Mitos & Fakta", summary: "Pasangan mitos yang dicoret dan fakta yang benar.", use: "Meluruskan kesalahpahaman; sangat baik untuk engagement.",
    fields: [t("mythLabel", "Label mitos", {max: 12}), t("factLabel", "Label fakta", {max: 12}), items("items", "Pasangan", [t("myth", "Mitos", {required: true, limit: "mythFact.myth"}), t("fact", "Fakta", {required: true, limit: "mythFact.fact"})], {capacity: "mythFact", required: true}), DARK],
    sample: {type: "mythFact", items: [{myth: "Keputusan cepat selalu berarti intuisi tajam.", fact: "Cepat sering hanya berarti terbiasa, bukan benar."}, {myth: "Lebih banyak data pasti lebih baik.", fact: "Data tanpa kriteria justru menunda keputusan."}]}},
  prosCons: {label: "Pros & Cons", summary: "Dua kolom untung dan rugi dengan penanda + dan −.", use: "Menimbang satu pilihan dari dua sisi.",
    fields: [t("proLabel", "Label untung", {max: 16}), t("conLabel", "Label rugi", {max: 16}), strings("pros", "Untung", {capacity: "prosCons", required: true, itemKind: "point"}), strings("cons", "Rugi", {capacity: "prosCons", required: true, itemKind: "point"}), DARK],
    sample: {type: "prosCons", proLabel: "Untung", conLabel: "Rugi", pros: ["Keputusan lebih terdokumentasi", "Mudah dievaluasi ulang"], cons: ["Butuh waktu ekstra", "Tidak cocok untuk hal sepele"]}},
  beforeAfter: {label: "Before & After", summary: "Dua panel sebelum/sesudah, dengan slot kosong untuk gambar unggahan.", use: "Transformasi, perbaikan, perbandingan hasil.",
    fields: [sel("slot", "Slot gambar", ["md", "lg"], {hint: "Menyisakan area kosong di atas teks untuk gambar yang Anda unggah dan letakkan di atasnya."}),
      group("before", "Sebelum", [t("label", "Label", {max: 16}), t("title", "Judul", {limit: "beforeAfter.title"}), ta("text", "Teks", {limit: "beforeAfter.text"})]),
      group("after", "Sesudah", [t("label", "Label", {max: 16}), t("title", "Judul", {limit: "beforeAfter.title"}), ta("text", "Teks", {limit: "beforeAfter.text"})]), DARK],
    sample: {type: "beforeAfter", before: {label: "SEBELUM", title: "Catatan acak", text: "Keputusan tersebar di banyak tempat."}, after: {label: "SESUDAH", title: "Satu jurnal", text: "Setiap keputusan punya alasan tertulis."}}},
  funnel: {label: "Funnel / Pyramid", summary: "Tahap bertingkat yang menyempit (funnel) atau melebar (pyramid).", use: "Hierarki, penyaringan, level kebutuhan.",
    fields: [sel("shape", "Bentuk", ["funnel", "pyramid"]), items("items", "Tahap", [t("label", "Judul tahap", {required: true, itemKind: "title"}), t("note", "Catatan", {itemKind: "node"})], {capacity: "funnel", required: true}), DARK],
    sample: {type: "funnel", shape: "funnel", items: [{label: "Banyak ide", note: "Semua ditampung"}, {label: "Disaring", note: "Pakai kriteria"}, {label: "Dipilih", note: "Satu yang diuji"}]}},
  ladder: {label: "Ladder (level)", summary: "Level vertikal berurutan dengan penanda posisi saat ini.", use: "Level harga (support/resistance), tahapan naik, skala kematangan.",
    fields: [items("items", "Level (atas ke bawah)", [t("label", "Nama level", {required: true, itemKind: "title"}), t("value", "Nilai (opsional)", {max: 16}), t("note", "Catatan", {itemKind: "node"}), bool("current", "Posisi saat ini")], {capacity: "ladder", required: true}), DARK],
    sample: {type: "ladder", items: [{label: "Mahir", note: "Konsisten tanpa diingatkan"}, {label: "Berkembang", note: "Mulai punya sistem", current: true}, {label: "Pemula", note: "Masih mencoba-coba"}]}},
  qaCard: {label: "Q&A Card", summary: "Pertanyaan tebal dengan jawaban di bawahnya.", use: "FAQ, jawaban atas keberatan umum.",
    fields: [items("items", "Tanya jawab", [t("q", "Pertanyaan", {required: true, itemKind: "point"}), ta("a", "Jawaban", {required: true, itemKind: "text"})], {capacity: "qaCard", required: true}), DARK],
    sample: {type: "qaCard", items: [{q: "Apakah harus menunggu data lengkap?", a: "Tidak. Tentukan batas minimum bukti, lalu putuskan."}, {q: "Bagaimana kalau salah?", a: "Catat alasannya, evaluasi, dan perbaiki langkah berikutnya."}]}},
  pollCard: {label: "Poll Card", summary: "Pertanyaan dengan pilihan A/B/C untuk memancing komentar.", use: "Slide penutup yang mengajak audiens menjawab.",
    fields: [t("question", "Pertanyaan", {required: true, limit: "pollCard.question"}), strings("options", "Pilihan", {min: 2, capacity: "pollCard", required: true, itemKind: "point"}), t("cta", "Ajakan (opsional)", {max: 60}), DARK],
    sample: {type: "pollCard", question: "Kamu paling sering memutuskan dengan…", options: ["Firasat", "Data", "Saran orang lain"], cta: "Komentar A, B, atau C"}},
  swipeHint: {label: "Swipe Hint", summary: "Pil kecil \"Geser →\".", use: "Ajakan geser di slide pembuka atau tengah.",
    fields: [t("text", "Teks", {max: 16, placeholder: "Geser"}), sel("align", "Posisi", ["left", "center", "right"]), DARK],
    sample: {type: "swipeHint", text: "Geser", align: "right"}},
  sourceNote: {label: "Source Note", summary: "Catatan sumber atau disclaimer kecil.", use: "Mencantumkan sumber data atau peringatan.",
    fields: [t("label", "Label", {max: 16, placeholder: "Sumber"}), ta("text", "Teks", {required: true, limit: "sourceNote.text"}), DARK],
    sample: {type: "sourceNote", label: "Sumber", text: "Pengamatan penulis; bukan hasil riset formal."}},
  textBlock: {label: "Text Block", summary: "Paragraf penjelas biasa tanpa kartu, dengan label kecil opsional.", use: "Konteks 2–4 kalimat, penjelasan, transisi antar gagasan.",
    fields: [t("label", "Label (opsional)", {max: 24}), ta("text", "Teks", {required: true, limit: "textBlock.text"}), sel("size", "Ukuran", ["md", "lg"]), DARK],
    sample: {type: "textBlock", label: "Konteks", text: "Pasar bereaksi pada risiko status dan arus dana, bukan pada kinerja satu perusahaan. Memahami pemicunya membantu kita tidak ikut panik.", size: "md"}},
  flow: {label: "Flow", summary: "Alur 2–5 langkah dengan label di panah dan percabangan dua hasil opsional.", use: "Proses, sebab-akibat singkat, dan keputusan jika-maka.",
    fields: [sel("direction", "Arah", ["row", "column"]), items("items", "Langkah", [t("label", "Langkah", {required: true, limit: "flow.label"}), t("note", "Catatan", {limit: "flow.note"}), t("via", "Label panah", {max: 14})], {capacity: "flow", min: 2, required: true}), items("fork", "Percabangan (opsional, tepat 2)", [t("via", "Kondisi", {max: 14}), t("label", "Hasil", {limit: "flow.label"}), t("note", "Catatan", {limit: "flow.note"})], {fixedRange: [2, 2]}), DARK],
    sample: {type: "flow", items: [{label: "Berita", via: "memicu"}, {label: "Panik", via: "lalu"}, {label: "Jual massal"}], fork: [{via: "Jika reaktif", label: "Kunci rugi"}, {via: "Jika terukur", label: "Tinjau rencana"}]}},
  glossary: {label: "Glossary", summary: "Pasangan istilah dan arti singkat.", use: "Menjelaskan jargon yang dipakai slide.",
    fields: [items("items", "Istilah", [t("term", "Istilah", {required: true, max: 40}), ta("meaning", "Arti", {required: true, limit: "glossary.meaning"})], {capacity: "glossary", required: true}), DARK],
    sample: {type: "glossary", items: [{term: "Trading halt", meaning: "Penghentian sementara perdagangan saat pergerakan harga ekstrem."}, {term: "Standalone Market", meaning: "Klasifikasi pasar yang tidak masuk indeks regional utama."}]}},
  stockList: {label: "Stock List", summary: "Daftar saham rekomendasi (1–8) dengan sinyal, entry, target, dan cut loss.", use: "Daftar saham pilihan/rekomendasi sesuai jumlah yang diinput. Hanya pakai data dari pengguna.",
    fields: [bool("numbered", "Beri nomor urut"), bool("disclaimer", "Tampilkan disclaimer"), t("disclaimerText", "Teks disclaimer (opsional)", {max: 90}), items("items", "Saham", [t("ticker", "Kode", {required: true, max: 8}), t("name", "Nama emiten", {max: 28}), sel("signal", "Sinyal", ["buy", "accumulate", "hold", "watch", "sell"]), t("action", "Label sinyal sendiri", {max: 14}), t("entry", "Entry", {max: 16}), t("target", "Target", {max: 12}), t("stop", "Cut loss", {max: 12}), t("note", "Catatan (maks 5 saham)", {max: 90})], {capacity: "stockList", required: true}), DARK],
    sample: {type: "stockList", disclaimerText: "Contoh angka; ganti dengan analisis sendiri.", items: [{ticker: "ABCD", name: "Contoh Bank Tbk", signal: "accumulate", entry: "1.000–1.050", target: "1.250", stop: "950", note: "Contoh catatan alasan singkat."}, {ticker: "WXYZ", name: "Contoh Energi Tbk", signal: "watch", entry: "2.400", target: "2.800", stop: "2.250", note: "Tunggu konfirmasi volume."}, {ticker: "EFGH", name: "Contoh Retail Tbk", signal: "hold", entry: "500", target: "600", stop: "470", note: "Pertahankan selama tren utuh."}]}},
  priceChart: {label: "Price Chart", summary: "Grafik garis atau candlestick dari data yang kamu input, dengan garis entry/target/cut loss.", use: "Menunjukkan pergerakan harga dan level penting. Hanya pakai data dari pengguna.",
    fields: [t("title", "Judul (opsional)", {max: 40}), t("caption", "Keterangan (opsional)", {max: 80}), t("from", "Label kiri (opsional)", {max: 12}), t("to", "Label kanan (opsional)", {max: 12}), items("levels", "Level (maks 4)", [sel("kind", "Jenis", ["entry", "target", "stop", "support", "resistance"]), t("value", "Nilai", {required: true, max: 12}), t("label", "Label (opsional)", {max: 14})], {max: 4}), DARK],
    sample: {type: "priceChart", title: "Contoh pergerakan (data ilustrasi)", points: [1000, 1020, 1010, 1045, 1060, 1040, 1085, 1110, 1095, 1140], levels: [{kind: "entry", value: 1040}, {kind: "target", value: 1200}, {kind: "stop", value: 980}], from: "Minggu 1", to: "Minggu 10", caption: "Data ilustrasi; ganti dengan data sendiri."}},
  stockCompare: {label: "Stock Compare", summary: "Dua saham berdampingan dengan baris pembanding dan penanda yang lebih unggul.", use: "Membandingkan dua saham pada beberapa metrik dari data pengguna.",
    fields: [bool("disclaimer", "Tampilkan disclaimer"), group("left", "Saham kiri", [t("ticker", "Kode", {required: true, max: 8}), t("name", "Nama", {max: 24}), sel("signal", "Sinyal", ["buy", "accumulate", "hold", "watch", "sell"])]), group("right", "Saham kanan", [t("ticker", "Kode", {required: true, max: 8}), t("name", "Nama", {max: 24}), sel("signal", "Sinyal", ["buy", "accumulate", "hold", "watch", "sell"])]), items("rows", "Baris pembanding", [t("label", "Metrik", {required: true, max: 22}), t("left", "Nilai kiri", {required: true, max: 18}), t("right", "Nilai kanan", {required: true, max: 18}), sel("better", "Lebih unggul", ["left", "right"])], {capacity: "stockCompare", required: true}), DARK],
    sample: {type: "stockCompare", left: {ticker: "ABCD", name: "Contoh Bank Tbk"}, right: {ticker: "WXYZ", name: "Contoh Energi Tbk"}, rows: [{label: "PER", left: "9,5x", right: "12,1x", better: "left"}, {label: "ROE", left: "14%", right: "18%", better: "right"}, {label: "Dividen", left: "4,2%", right: "3,1%", better: "left"}]}},
  tradePlan: {label: "Trade Plan", summary: "Rencana skenario naik, dasar, dan turun dengan pemicu, target, dan risiko.", use: "Menjelaskan rencana bersyarat (jika-maka), bukan prediksi pasti.",
    fields: [t("ticker", "Kode (opsional)", {max: 8}), t("risk", "Risiko utama (opsional)", {max: 100}), items("scenarios", "Skenario", [sel("kind", "Jenis", ["bull", "base", "bear"]), t("trigger", "Pemicu / kondisi", {required: true, max: 80}), t("target", "Target (opsional)", {max: 24}), t("note", "Catatan (opsional)", {max: 80})], {max: 3, required: true}), DARK],
    sample: {type: "tradePlan", ticker: "ABCD", scenarios: [{kind: "bull", trigger: "Tembus 1.050 dengan volume naik", target: "1.250"}, {kind: "base", trigger: "Bergerak 980–1.050, tunggu konfirmasi", note: "Belum ada sinyal jelas"}, {kind: "bear", trigger: "Tutup di bawah 950", target: "Cut loss"}], risk: "Contoh angka; sesuaikan dengan analisis dan toleransi risikomu."}},
  eventCalendar: {label: "Event Calendar", summary: "Agenda singkat dengan blok tanggal, judul, catatan, dan label.", use: "Jadwal rilis laporan keuangan, dividen, RUPS, atau momen penting lain.",
    fields: [items("items", "Agenda", [t("date", "Tanggal", {required: true, max: 10}), t("title", "Judul", {required: true, max: 36}), t("tag", "Label (opsional)", {max: 12}), t("note", "Catatan (opsional)", {max: 64})], {capacity: "eventCalendar", required: true}), DARK],
    sample: {type: "eventCalendar", items: [{date: "21 Okt", title: "Rilis laporan keuangan Q3", tag: "Laporan", note: "Contoh agenda"}, {date: "28 Okt", title: "Cum date dividen", tag: "Dividen"}, {date: "05 Nov", title: "RUPS tahunan", tag: "RUPS"}]}},
  footnote: {label: "Footnote", summary: "Catatan kaki bernomor kecil.", use: "Sumber, batasan, dan catatan metodologi.",
    fields: [strings("items", "Catatan", {capacity: "footnote", required: true, itemKind: "text"}), DARK],
    sample: {type: "footnote", items: ["Angka penutupan dari Kontan, 16 Okt 2026.", "Estimasi arus dana berasal dari analis, bukan MSCI."]}},
  progressRing: {label: "Progress Ring", summary: "Lingkaran persentase dengan label.", use: "Satu persentase yang menjadi sorotan. Jangan mengarang angka.",
    fields: [t("value", "Nilai 0–100", {required: true, numeric: true, max: 5}), t("label", "Label", {limit: "progressRing.label"}), ta("note", "Catatan", {limit: "progressRing.note"}), DARK],
    sample: {type: "progressRing", value: 64, label: "Selesai tepat waktu", note: "Contoh angka; ganti data sendiri."}},
  photoHero: {label: "Photo Hero", summary: "Foto besar dengan judul dan teks di bawah atau di atas foto.", use: "Slide yang digerakkan oleh satu foto.",
    fields: [image("image", "Gambar"), sel("size", "Tinggi", allowedSizes("photoHero")), sel("shape", "Bentuk", ["square", "rounded", "circle"]), sel("fit", "Isi bingkai", ["cover", "contain"]), bool("overlay", "Teks di atas foto"), t("title", "Judul", {limit: "photoHero.title"}), ta("text", "Teks", {limit: "photoHero.text"}), DARK],
    sample: {type: "photoHero", size: "md", shape: "rounded", title: "Suasana kerja nyata", text: "Foto menguatkan cerita, bukan sekadar hiasan."}},
  phoneMockup: {label: "Phone Mockup", summary: "Tangkapan layar dalam bingkai ponsel.", use: "Demo aplikasi, chat, atau tampilan dashboard.",
    fields: [image("image", "Tangkapan layar"), sel("size", "Ukuran", allowedSizes("phoneMockup")), sel("align", "Posisi", ["left", "center", "right"]), t("caption", "Keterangan", {limit: "phoneMockup.caption"}), DARK],
    sample: {type: "phoneMockup", size: "md", align: "center", caption: "Contoh tampilan hasil akhir."}},
  collage: {label: "Collage", summary: "2–4 gambar dalam satu grid: 2 berdampingan, 3 satu besar dua kecil, 4 grid 2×2.", use: "Beberapa foto pendukung dalam satu slide.",
    fields: [sel("size", "Tinggi", allowedSizes("collage")), sel("shape", "Bentuk", ["square", "rounded"]), items("items", "Gambar", [image("image", "Gambar"), t("caption", "Keterangan", {max: 40})], {min: 2, fixedRange: [2, 4], capacity: "collage", required: true}), DARK],
    sample: {type: "collage", size: "md", shape: "rounded", items: [{caption: "Sebelum"}, {caption: "Proses"}, {caption: "Sesudah"}]}},
  avatarQuote: {label: "Avatar Quote", summary: "Kutipan dengan foto profil bulat, nama, dan peran.", use: "Testimoni, kutipan tokoh, atau suara pembaca. Gunakan hanya kutipan yang nyata.",
    fields: [image("avatar", "Foto profil"), ta("quote", "Kutipan", {required: true, limit: "avatarQuote.quote"}), t("name", "Nama", {max: 40}), t("role", "Peran", {limit: "avatarQuote.role"}), DARK],
    sample: {type: "avatarQuote", quote: "Menulis alasan keputusan membuatku lebih tenang.", name: "Nama Pembaca", role: "Peserta kelas"}},
  assetIcon: {label: "Asset Icon", summary: "Ikon dari Asset Library.", use: "Ikon bermakna; bukan hiasan.",
    fields: [sel("set", "Set", ["lucide", "phosphor"]), t("name", "Nama ikon", {required: true}), sel("size", "Ukuran", ["sm", "md", "lg"]), sel("tone", "Tone", ["ink", "accent", "light"]), t("label", "Label", {max: 30})],
    sample: {type: "assetIcon", set: "lucide", name: "brain", size: "md", tone: "accent"}},
  assetShape: {label: "Asset Shape", summary: "Dekorasi geometris latar.", use: "Layer latar di ruang kosong.",
    fields: [t("name", "Nama dekorasi", {required: true}), sel("position", "Posisi", ["full", "topRight", "bottomRight", "bottomLeft"]), sel("opacity", "Opacity", ["subtle", "soft", "bold"])],
    sample: {type: "assetShape", name: "orbital-rings", position: "topRight", opacity: "subtle"}},
};

// Kinds that appear in the gallery (slide presets, primitives, and the image tool).
export const IMAGE_SPEC = {
  label: "Gambar sendiri", kind: "image",
  summary: "Upload foto/gambar sendiri, geser untuk memindah, tarik sudut untuk resize, dan pilih bentuk.",
  use: "Foto produk, tangkapan layar, logo mitra, atau ilustrasi pribadi di atas slide mana pun.",
  sample: {type: "statement", lead: "Contoh slide dengan gambar", highlight: "di atas desain.", images: [{id: "img-contoh", x: 640, y: 820, width: 360, height: 360, shape: "circle"}]},
  notes: [
    "Gambar disimpan di browser ini (IndexedDB), bukan di JSON. JSON hanya menyimpan id, posisi, ukuran, dan bentuk.",
    "Pindahkan JSON ke browser lain: unggah ulang gambar yang sama dan beri id yang sama, atau pakai fitur ekspor.",
    "Posisi dan ukuran memakai piksel kanvas 1080×1350.",
  ],
};

export const ALL_SPECS = {...SLIDE_SPECS, ...PRIMITIVE_SPECS};
export const SPEC_ORDER = {
  slides: Object.keys(SLIDE_SPECS),
  primitives: Object.keys(PRIMITIVE_SPECS),
};

// Count limits for a list field: {hard, recommended, long, min}.
export function fieldCountLimits(field, ctx = {}) {
  if (field.fixedRange) return {hard: field.fixedRange[1], recommended: 3, long: field.fixedRange[1], min: field.fixedRange[0]};
  if (field.fixed) return {hard: field.fixed, recommended: field.fixed, long: field.fixed, min: field.fixed};
  if (field.type === "nodes") return {hard: field.max || 18, recommended: 4, long: 4, min: 1};
  if (field.type === "children") {
    const l = containerLimits(field.container || "twoColumn");
    return {hard: l.hard, recommended: 4, long: 4, min: 1};
  }
  if (!field.capacity) return {hard: field.max || 8, recommended: Math.min(field.max || 8, 5), long: field.max || 8, min: field.min ?? 0};
  const key = field.capacity === "compare" && ctx.keywords ? "compare+keywords" : field.capacity === "table" ? tableKey(ctx.columns) : field.capacity;
  const l = countLimits(CAPACITY_KEYS[key] || key);
  return {...l, min: field.min ?? 1};
}

// Sizes of fixed-height image blocks that fit under a heading on BOTH platforms.
export function allowedSizes(name, order = ["sm", "md", "lg"]) {
  const fits = capacityData.fits || {};
  return order.filter((size) => {
    const keys = Object.keys(fits).filter((k) => k === name + ":" + size || k.startsWith(name + ":" + size + ":"));
    return keys.length ? keys.every((k) => fits[k].instagram && fits[k].tiktok) : false;
  });
}

// Markdown-ish description used by the prompt and component pages.
export function specCapacityLines(name) {
  const spec = ALL_SPECS[name];
  if (!spec) return [];
  const lines = [];
  const walk = (fields, prefix = "") => fields.forEach((f) => {
    if (f.type === "group") return walk(f.fields, prefix + f.key + ".");
    if (f.type === "list" || f.type === "children" || f.type === "nodes") {
      const l = fieldCountLimits(f);
      lines.push({path: prefix + f.key, label: f.label, ...l});
    } else if (f.limit && charLimit(f.limit)) {
      const c = charLimit(f.limit);
      lines.push({path: prefix + f.key, label: f.label, chars: c});
    } else if (f.max) {
      lines.push({path: prefix + f.key, label: f.label, chars: {hard: f.max, recommended: Math.floor(f.max * 0.7)}});
    }
  });
  walk(spec.fields || []);
  return lines;
}
