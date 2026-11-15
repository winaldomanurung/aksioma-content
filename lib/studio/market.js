// Shared constants for the market primitives: priceChart, stockCompare,
// tradePlan, eventCalendar and marketRank (report primitives are at the bottom). Heights are fixed in globals.css (.mkt-*), so
// capacity is known by construction; these limits keep every text on its line.

export const LEVEL_KINDS = {entry: "Entry", target: "Target", stop: "Cut loss", support: "Support", resistance: "Resistance"};
export const CHART_LIMITS = {minPoints: 5, maxPoints: 60, levels: 4, title: 40, caption: 80, label: 12, levelLabel: 14};

export const COMPARE_LIMITS = {rows: 6, ticker: 8, name: 24, label: 22, value: 18};
export const COMPARE_BETTER = ["left", "right"];

export const PLAN_KINDS = {bull: "Skenario naik", base: "Skenario dasar", bear: "Skenario turun"};
export const PLAN_LIMITS = {scenarios: 3, ticker: 8, title: 40, trigger: 80, target: 24, note: 80, risk: 100};

export const CALENDAR_LIMITS = {items: 6, date: 10, title: 36, tag: 12, note: 64};

// 1.250 / 1.250,5 style (Indonesian). Done by hand so server and browser agree.
export function fmtPrice(n) {
  if (!Number.isFinite(n)) return "";
  const abs = Math.abs(n);
  const fixed = Number.isInteger(n) || abs >= 100 ? String(Math.round(n * 100) / 100) : (Math.round(n * 100) / 100).toFixed(2);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return dec ? grouped + "," + dec : grouped;
}

export const RANK_LIMITS = {items: 6, ticker: 8, value: 16, change: 9};
export const RANK_TONES = ["up", "down", "neutral"];

// ---- Report primitives: statSnapshot, signalGrid, priceLevels, returnBars, verdictCard ----
export const TONES = ["up", "down", "neutral"];

export const SNAPSHOT_LIMITS = {items: 6, label: 18, value: 12, sub: 28};

export const SIGNAL_DIRS = {up: "↑", down: "↓", flat: "→"};
export const SIGNAL_LIMITS = {items: 6, name: 20, reading: 44};

export const LEVELS_LIMITS = {items: 6, value: 12, label: 28};

export const BARS_LIMITS = {groups: 3, bars: 4, totalBars: 10, label: 24, name: 14, unit: 4};

export const CARDS_LIMITS = {points: 3, label: 16, heading: 12, point: 44, delta: 8};
// ---- Visual primitives: sparkCards, gauge, rangeBars, heatmap, footballField ----
export const SPARK_LIMITS = {items: 6, label: 18, value: 12, sub: 24, pointsMin: 4, pointsMax: 30};
export const GAUGE_LIMITS = {items: 4, label: 18, display: 8, note: 28};
export const RANGE_LIMITS = {items: 5, label: 16, unit: 3};
export const HEAT_LIMITS = {items: 12, min: 4, name: 10, sub: 16};
export const FIELD_LIMITS = {items: 5, min: 2, label: 16, unit: 3, tag: 14};

// Indonesian number format: 1.234,5 (decimal comma, thousands dot); negative uses a real minus.
export function fmtNum(v, decimals = 0) {
  const [i, f] = Math.abs(v).toFixed(decimals).split(".");
  return (v < 0 ? "−" : "") + i.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + (f ? "," + f : "");
}
export const decimalsOf = (...vals) => Math.max(0, ...vals.map((v) => (String(v).split(".")[1] || "").length));
export const heatCols = (n) => (n <= 4 ? 2 : n <= 9 ? 3 : 4);
export const gaugeCols = (n) => (n === 4 ? 2 : Math.max(1, n));

export const VERDICT_LIMITS = {title: 40, text: 150, reasons: 3, reason: 60, caution: 100};

// Same decimals on every bar (75.0 must not render as 75); sign is explicit when `signed`.
export function fmtBarValue(v, decimals, signed) {
  const base = decimals ? Math.abs(v).toFixed(decimals).replace(".", ",") : String(Math.abs(v));
  if (v < 0) return "−" + base;
  return (signed && v > 0 ? "+" : "") + base;
}
export function barDecimals(groups) {
  let d = 0;
  for (const g of groups) for (const b of g.bars) d = Math.max(d, (String(b.value).split(".")[1] || "").length);
  return d;
}

// ---- Adaptive sizing ----
// The market primitives have a fixed row height for the worst case (6 rows).
// With fewer rows they would leave the slide mostly empty, so every row grows
// to use the height the slide can offer (`budget`, in px). The budget shrinks
// when the slide also carries a companion block (callout, textBlock, extras,
// sources) so the pair still fits the 1080x1350 canvas on both platforms.

export const FULL_BUDGET = 590;

export const STOCK_NODE_TYPES = new Set([
  "stockList", "priceChart", "stockCompare", "tradePlan", "eventCalendar", "marketRank",
  "statSnapshot", "signalGrid", "priceLevels", "returnBars", "verdictCard", "compareCards",
  "sparkCards", "gauge", "rangeBars", "heatmap", "footballField",
]);
const NON_BLOCK_TYPES = new Set(["slideHeading", "assetShape", "assetIcon", "divider", "connector"]);
const COMPANION_PX = 160; // a callout (<=3 lines) / textBlock / infoCard plus the gap above it; measured ~80-135 px, rest is safety
const EXTRA_PX = 170;
const SOURCE_PX = 64;
const MIN_BUDGET = 300;

// Height one market node may use on this slide.
export function nodeBudget(slide, node) {
  if (!slide || !Array.isArray(slide.nodes)) return FULL_BUDGET;
  let companions = 0;
  const stockNodes = [];
  for (const n of slide.nodes) {
    if (!n || typeof n !== "object") continue;
    if (STOCK_NODE_TYPES.has(n.type)) stockNodes.push(n);
    else if (!NON_BLOCK_TYPES.has(n.type)) companions += 1;
  }
  const extras = Array.isArray(slide.extras) ? slide.extras.length : 0;
  const sources = Array.isArray(slide.sources) && slide.sources.length ? 1 : 0;
  const free = FULL_BUDGET - companions * COMPANION_PX - extras * EXTRA_PX - sources * SOURCE_PX;
  // Several data nodes share the space in proportion to their natural height.
  const total = stockNodes.reduce((t, n) => t + naturalHeight(n), 0);
  const mine = naturalHeight(node);
  const share = stockNodes.length > 1 && total > 0 && mine > 0 ? mine / total : 1 / Math.max(1, stockNodes.length);
  return Math.max(MIN_BUDGET, Math.round(free * share));
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Row height for `count` rows that should fill `budget`. Rows never grow past
// `max` x base, and shrink to at most `min` x base when the slide is crowded.
// `--f` scales the type a little (half as fast as the row) so text stays in its row.
export function rowFit(count, budget, {base, gap = 10, min = 0.74, max = 1.9} = {}) {
  const n = Math.max(1, count);
  const raw = Math.floor((budget - gap * (n - 1)) / n);
  const h = clamp(raw, Math.round(base * min), Math.round(base * max));
  const k = h / base;
  const f = clamp(1 + (k - 1) * 0.5, 0.86, 1.25);
  return {"--row-h": h + "px", "--f": f.toFixed(3)};
}

// Same idea for returnBars, whose height is a sum of label and bar rows.
export function barsFit(groups, budget) {
  const g = groups.length;
  const b = groups.reduce((s, x) => s + x.bars.length, 0);
  const base = g * 32 + b * 42 + (b - g) * 6 + (g - 1) * 16;
  const k = clamp(budget / Math.max(base, 1), 0.78, 2.0);
  const f = clamp(1 + (k - 1) * 0.5, 0.88, 1.25);
  return {"--row-h": Math.round(42 * k) + "px", "--f": f.toFixed(3)};
}

// Free-form text blocks (verdictCard) only need a type scale.
export function textFit(budget) {
  const f = budget >= 560 ? 1.12 : budget >= 440 ? 1.02 : 0.94;
  return {"--f": String(f)};
}

// ---------------------------------------------------------------------------
// Height budget shown to the AI. The numbers come from the same constants the
// components size themselves with, so the prompt and the layout cannot drift.
// Content area under slideHeading is FULL_BUDGET px (1080x1350 canvas).

// compareCards: card height follows content: label + big heading + padding + ~80 px per point.
const cardsNatural = (points) => 220 + 80 * points;
const gapSum = (n, gap) => Math.max(0, n - 1) * gap;
const natural = (count, base, gap = 10) => count * base + gapSum(count, gap);

// Natural (1.0x) height of one stock node. Rows can grow up to ~1.9x and shrink to ~0.74x.
export function naturalHeight(node) {
  if (!node || typeof node !== "object") return 0;
  const n = Array.isArray(node.items) ? node.items.length : 0;
  switch (node.type) {
    case "statSnapshot": return natural(Math.ceil(n / 2), 180);
    case "signalGrid": return natural(n, 92);
    case "priceLevels": return natural(n, 88);
    case "marketRank": case "eventCalendar": return natural(n, 92);
    case "stockCompare": return natural(Array.isArray(node.rows) ? node.rows.length : n, 68, 8);
    case "tradePlan": return natural(Array.isArray(node.scenarios) ? node.scenarios.length : 0, 172, 14);
    case "returnBars": {
      const g = Array.isArray(node.groups) ? node.groups : [];
      const b = g.reduce((t, x) => t + (x?.bars?.length || 0), 0);
      return g.length * 32 + b * 42 + Math.max(0, b - g.length) * 6 + gapSum(g.length, 16);
    }
    case "sparkCards": return natural(Math.ceil(n / 2), 200, 12);
    case "gauge": return natural(n === 4 ? 2 : 1, 280, 12);
    case "rangeBars": return natural(n, 108);
    case "heatmap": return natural(Math.ceil(n / heatCols(n)), 130);
    case "footballField": return 44 + natural(n, 84, 8);
    case "verdictCard": return 440;
    case "compareCards": return cardsNatural(Math.max(node.left?.points?.length || 0, node.right?.points?.length || 0));
    default: return 0;
  }
}

// Estimated fill of a freeform slide made of stock nodes + companions, as a share of FULL_BUDGET.
// `max` assumes every stock node grows to its limit, `min` that every one shrinks to its limit.
export function estimateFill(slide) {
  if (!slide || slide.type !== "freeform" || !Array.isArray(slide.nodes)) return null;
  let stockNat = 0, stockMax = 0, other = 0, stock = 0;
  for (const n of slide.nodes) {
    if (!n || typeof n !== "object" || NON_BLOCK_TYPES.has(n.type)) continue;
    if (STOCK_NODE_TYPES.has(n.type)) {
      const h = naturalHeight(n);
      if (!h) return null; // stockList / priceChart etc. are not modelled
      stockNat += h; stockMax += h * (MAX_GROW[n.type] || 1.9); stock += 1;
    } else other += COMPANION_PX;
  }
  if (!stock) return null;
  other += (Array.isArray(slide.extras) ? slide.extras.length : 0) * EXTRA_PX;
  other += Array.isArray(slide.sources) && slide.sources.length ? SOURCE_PX : 0;
  const verdictOnly = slide.nodes.every((n) => !n || n.type === "verdictCard" || NON_BLOCK_TYPES.has(n.type));
  if (verdictOnly) return null; // a lone verdict card is deliberately airy
  return {
    min: Math.round((stockNat * 0.74 + other) / FULL_BUDGET * 100) / 100,
    natural: Math.round((stockNat + other) / FULL_BUDGET * 100) / 100,
    max: Math.round((stockMax + other) / FULL_BUDGET * 100) / 100,
  };
}

// Plain-language list the prompt embeds.
export function heightGuideLines() {
  return [
    "Area isi di bawah slideHeading = ±" + FULL_BUDGET + " px. Komponen data melebar sampai ±1,9x tinggi normalnya dan menyempit sampai ±0,74x.",
    "Tinggi normal (px): statSnapshot " + natural(1, 180) + " per 2 item (4 item = " + natural(2, 180) + ", 6 item = " + natural(3, 180) + "); signalGrid 92 per item (4 = " + natural(4, 92) + ", 6 = " + natural(6, 92) + "); priceLevels 88 per item; marketRank/eventCalendar 92 per item; stockCompare 68 per baris; tradePlan 172 per skenario; returnBars 32 per kelompok + 42 per batang; verdictCard ±440; compareCards 220 + 80 per poin terpanjang (2 poin = 380, 3 poin = 460) dan TIDAK melebar, jadi selalu butuh pendamping.",
    "Komponen visual (px, tinggi normal): sparkCards 200 per 2 kartu (4 kartu = " + natural(2, 200, 12) + "); gauge " + natural(1, 280, 12) + " (1–3 gauge sebaris, 4 gauge = " + natural(2, 280, 12) + "); rangeBars 108 per rentang (3 = " + natural(3, 108) + "); heatmap 130 per baris kotak (6 kotak = " + natural(2, 130) + ", 9 = " + natural(3, 130) + "); footballField 44 + 84 per metode (3 = " + (44 + natural(3, 84, 8)) + ").",
    "Pendamping (px): callout/textBlock/infoCard ±" + COMPANION_PX + "; tiap extras ±" + EXTRA_PX + "; sources ±" + SOURCE_PX + "; slideHeading tidak dihitung.",
  ];
}

// compareCards keeps its height tied to content: the budget only scales the type a little.
export function cardsFit(points, budget) {
  const k = clamp(budget / Math.max(cardsNatural(points), 1), 0.86, 1.4);
  return {"--f": clamp(1 + (k - 1) * 0.6, 0.92, 1.22).toFixed(3)};
}
const MAX_GROW = {compareCards: 1.25, gauge: 1.6};
