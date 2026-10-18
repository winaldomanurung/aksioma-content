// Measures how much content every slide type and primitive can hold on a
// 1080x1350 canvas, using real layout in a real browser, and writes the result
// to lib/studio/capacity-data.js. That file feeds the validator limits, the AI
// prompt, and the component pages, so the numbers always come from measurement.
//
//   npm run dev                       (in another terminal)
//   npm run measure:capacity
//
// Options:
//   --base-url=http://127.0.0.1:3000
//   --out=lib/studio/capacity-data.js
//   --font-dir=<dir containing inter/files and lexend/files from @fontsource>
//       Use local font files when the dev server cannot reach Google Fonts.
//   AKSIOMA_CHROMIUM=<path>  use an existing Chromium binary.
//
// A slide "fits" when no text leaves the content area and nothing inside it is
// clipped. .slide-content uses overflow:hidden, so overflow is otherwise silent.

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {chromium} from "playwright";

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const found = args.find((arg) => arg.startsWith("--" + name + "="));
  return found ? found.split("=").slice(1).join("=") : fallback;
};
const baseUrl = opt("base-url", "http://127.0.0.1:3000").replace(/\/$/, "");
const outFile = opt("out", "lib/studio/capacity-data.js");
const fontDir = opt("font-dir", null);

const PLATFORMS = ["instagram", "tiktok"];
const DENSITIES = ["airy", "balanced", "compact", "bold"];

// Three realistic text lengths (characters) per kind of field.
const CLASSES = {
  S: { title: 16, text: 48, point: 40, chip: 10, node: 16 },
  M: { title: 24, text: 90, point: 64, chip: 16, node: 24 },
  L: { title: 32, text: 140, point: 100, chip: 24, node: 32 },
};

const WORDS = ("pikiran keputusan bukti asumsi sudut pandang kebiasaan belajar fokus proses hasil langkah " +
  "kecil konsisten ruang evaluasi pola data cerita risiko peluang waktu energi tujuan prioritas dampak " +
  "sumber alternatif uji kesimpulan perhatian rutinitas pilihan disiplin gagasan konteks pengalaman " +
  "umpan balik perubahan batas ukuran target kualitas nilai arah tindakan").split(" ");

// Indonesian-looking text of at most `length` characters, ending on a word.
function text(length, seed = 0) {
  if (length <= 0) return "";
  const parts = [];
  let index = seed * 7;
  for (let guard = 0; guard < 400; guard += 1) {
    const word = WORDS[index % WORDS.length];
    index += 3;
    const next = (parts.length ? parts.join(" ") + " " : "") + word;
    if (next.length > length) break;
    parts.push(word);
  }
  const value = parts.join(" ") || WORDS[seed % WORDS.length].slice(0, length);
  return value.charAt(0).toUpperCase() + value.slice(1);
}
const range = (count) => Array.from({ length: count }, (_, i) => i);

// ---------- what to measure ----------

const freeform = (nodes, { heading = false, density } = {}) => ({
  type: "freeform",
  eyebrow: "Contoh",
  ...(density ? { density } : {}),
  nodes: heading
    ? [{ type: "slideHeading", title: text(46), body: text(100, 3) }, ...nodes]
    : nodes,
});

const childBuilders = {
  infoCard: (i, c) => ({ type: "infoCard", title: text(c.title, i), text: text(c.text, i + 1) }),
  statCard: (i, c) => ({ type: "statCard", value: String(10 + i * 7) + "%", label: text(c.title, i), note: text(c.node, i + 2) }),
  callout: (i, c) => ({ type: "callout", label: text(c.chip, i), text: text(c.text, i + 1) }),
};

// Components whose item count matters. `probe` is the largest count tried.
const listCases = {
  bullet: { probe: 12, defaultDensity: "balanced", build: (n, c) => ({ type: "bullet", eyebrow: "Contoh", title: text(55), items: range(n).map((i) => ({ title: text(c.title, i), text: text(c.text, i + 1) })) }) },
  compare: { probe: 10, defaultDensity: "balanced", build: (n, c) => ({ type: "compare", eyebrow: "Contoh", title: text(50), left: { label: "Refleks", heading: text(c.title), points: range(n).map((i) => text(c.point, i)) }, right: { label: "Uji", heading: text(c.title, 1), points: range(n).map((i) => text(c.point, i + 5)) } }) },
  "compare+keywords": { probe: 10, defaultDensity: "balanced", build: (n, c) => ({ ...listCases.compare.build(n, c), keywords: ["intuisi", "bukti", "uji"] }) },
  causeEffect: { probe: 8, defaultDensity: "balanced", build: (n, c) => ({ type: "causeEffect", causeTitle: text(30), causeText: text(90, 1), effectTitle: text(30, 2), effectText: text(90, 3), chainLabel: "Pola", chain: range(n).map((i) => ({ title: text(c.title, i), note: text(c.text, i + 1) })) }) },
  framework: { probe: 12, defaultDensity: "compact", build: (n, c) => ({ type: "framework", eyebrow: "Contoh", title: text(50), steps: range(n).map((i) => ({ title: text(c.title, i), text: text(c.text, i + 1) })) }) },
  "framework+keywords": { probe: 12, defaultDensity: "compact", build: (n, c) => ({ ...listCases.framework.build(n, c), keywords: ["claim", "evidence", "assumption", "alternative", "test"] }) },
  summary: { probe: 12, defaultDensity: "balanced", build: (n, c) => ({ type: "summary", title: text(50), items: range(n).map((i) => text(c.point, i)) }) },
  "summary+keywords": { probe: 12, defaultDensity: "balanced", build: (n, c) => ({ ...listCases.summary.build(n, c), keywords: ["fact", "assumption", "alternative", "confidence"] }) },
};

// Freeform primitives, measured alone and under a standard heading.
const primitiveLists = {
  timeline: { probe: 12, node: (n, c) => ({ type: "timeline", items: range(n).map((i) => ({ title: text(c.title, i), text: text(c.text, i + 1) })) }) },
  checklist: { probe: 14, node: (n, c) => ({ type: "checklist", items: range(n).map((i) => text(c.point, i)) }) },
  keywordCluster: { probe: 40, node: (n, c) => ({ type: "keywordCluster", items: range(n).map((i) => text(c.chip, i)) }) },
  miniDiagram: { probe: 12, node: (n, c) => ({ type: "miniDiagram", items: range(n).map((i) => text(c.node, i)) }) },
};
// New data/structure primitives (Batch 1).
primitiveLists.barChart = { probe: 12, node: (n, c) => ({ type: "barChart", unit: "%", items: range(n).map((i) => ({ label: text(c.title, i), value: 20 + ((i * 13) % 70), note: i % 2 ? text(c.node, i + 1) : undefined })) }) };
primitiveLists.mythFact = { probe: 8, node: (n, c) => ({ type: "mythFact", items: range(n).map((i) => ({ myth: text(c.point, i), fact: text(c.point, i + 3) })) }) };
primitiveLists.prosCons = { probe: 10, node: (n, c) => ({ type: "prosCons", pros: range(n).map((i) => text(c.point, i)), cons: range(n).map((i) => text(c.point, i + 5)) }) };
// Batch 2 primitives.
primitiveLists.funnel = { probe: 8, node: (n, c) => ({ type: "funnel", items: range(n).map((i) => ({ label: text(c.title, i), note: text(c.node, i + 1) })) }) };
primitiveLists.ladder = { probe: 10, node: (n, c) => ({ type: "ladder", items: range(n).map((i) => ({ label: text(c.title, i), value: "Rp " + (1000 + i * 150), note: text(c.node, i + 1), current: i === 1 })) }) };
primitiveLists.qaCard = { probe: 8, node: (n, c) => ({ type: "qaCard", items: range(n).map((i) => ({ q: text(c.point, i), a: text(c.text, i + 1) })) }) };
primitiveLists.pollCard = { probe: 6, node: (n, c) => ({ type: "pollCard", question: text(70), cta: "Komentar jawabanmu", options: range(n).map((i) => text(c.point, i)) }) };
// Batch 4 primitives.
primitiveLists.footnote = { probe: 10, node: (n, c) => ({ type: "footnote", items: range(n).map((i) => text(c.text, i)) }) };
primitiveLists.glossary = { probe: 8, node: (n, c) => ({ type: "glossary", items: range(n).map((i) => ({ term: text(c.chip, i), meaning: text(c.text, i + 1) })) }) };
primitiveLists.flow = { probe: 9, node: (n, c) => ({ type: "flow", items: range(n).map((i) => ({ label: text(c.node, i), note: text(c.node, i + 1), via: i % 2 ? "jika ya" : undefined })) }) };
primitiveLists["flow:column"] = { probe: 9, node: (n, c) => ({ type: "flow", direction: "column", items: range(n).map((i) => ({ label: text(c.node, i), note: text(c.node, i + 1) })) }) };
for (const cols of [2, 3, 4]) {
  const kind = cols === 2 ? "point" : "node";
  primitiveLists["table:" + cols] = { probe: 14, node: (n, c) => ({ type: "table", columns: range(cols).map((i) => text(c.chip, i)), rows: range(n).map((r) => ({ cells: range(cols).map((i) => text(c[kind], r + i)) })) }) };
}
for (const container of ["stack", "contentGrid", "twoColumn", "threeColumn"]) {
  for (const child of Object.keys(childBuilders)) {
    primitiveLists[container + ":" + child] = {
      probe: 12,
      node: (n, c) => ({ type: container, ...(container === "contentGrid" ? { columns: 2 } : {}), children: range(n).map((i) => childBuilders[child](i, c)) }),
    };
  }
}
for (const [name, def] of Object.entries(primitiveLists)) {
  listCases[name] = { probe: def.probe, defaultDensity: "balanced", build: (n, c) => freeform([def.node(n, c)]) };
  listCases[name + "@heading"] = { probe: def.probe, defaultDensity: "balanced", build: (n, c) => freeform([def.node(n, c)], { heading: true }) };
}

// Single text fields: the longest value that still fits (other fields medium).
const charCases = [];
// Fixed-size blocks: does each size fit under a standard heading?
const fitCases = [];
for (const size of ["sm", "md", "lg"]) {
  fitCases.push({ key: "photoHero:" + size, build: () => freeform([{ type: "photoHero", size, title: text(30), text: text(90, 1) }], { heading: true }) });
  fitCases.push({ key: "photoHero:" + size + ":overlay", build: () => freeform([{ type: "photoHero", size, overlay: true, title: text(30), text: text(90, 1) }], { heading: true }) });
}
for (const size of ["sm", "md", "lg"]) {
  fitCases.push({ key: "phoneMockup:" + size, build: () => freeform([{ type: "phoneMockup", size, caption: text(80) }], { heading: true }) });
  for (const n of [2, 3, 4]) fitCases.push({ key: "collage:" + size + ":" + n, build: () => freeform([{ type: "collage", size, items: range(n).map((i) => ({ caption: text(20, i) })) }], { heading: true }) });
}
const addChar = (key, build, extra = {}) => charCases.push({ key, build, ...extra });
addChar("hero.title", (n) => ({ type: "hero", eyebrow: text(20), title: text(n), subtitle: text(110, 2) }), { number: 1, accounts: ["journey", "trader"] });
addChar("hero.subtitle", (n) => ({ type: "hero", eyebrow: text(20), title: text(40), subtitle: text(n, 2) }), { number: 1, accounts: ["journey", "trader"] });
addChar("statement.lead", (n) => ({ type: "statement", lead: text(n), highlight: text(30, 2), note: text(110, 3) }));
addChar("statement.highlight", (n) => ({ type: "statement", lead: text(60), highlight: text(n, 2), note: text(110, 3) }));
addChar("statement.note", (n) => ({ type: "statement", lead: text(60), highlight: text(30, 2), note: text(n, 3) }));
addChar("cta.title", (n) => ({ type: "cta", title: text(n), body: text(110, 1), cta: text(80, 2) }), { number: 10, accounts: ["journey", "trader"] });
addChar("cta.body", (n) => ({ type: "cta", title: text(30), body: text(n, 1), cta: text(80, 2) }), { number: 10, accounts: ["journey", "trader"] });
addChar("cta.cta", (n) => ({ type: "cta", title: text(30), body: text(110, 1), cta: text(n, 2) }), { number: 10, accounts: ["journey", "trader"] });
for (const field of ["causeTitle", "causeText", "effectTitle", "effectText"]) {
  addChar("causeEffect." + field, (n) => ({
    type: "causeEffect", causeTitle: text(30), causeText: text(90, 1), effectTitle: text(30, 2), effectText: text(90, 3),
    [field]: text(n, 4),
  }));
}
const ffSingle = (key, node) => addChar(key, (n) => freeform([node(n)]));
ffSingle("slideHeading.title", (n) => ({ type: "slideHeading", title: text(n), body: text(90, 1) }));
ffSingle("slideHeading.body", (n) => ({ type: "slideHeading", title: text(40), body: text(n, 1) }));
ffSingle("infoCard.title", (n) => ({ type: "infoCard", eyebrow: text(14), title: text(n), text: text(90, 1) }));
ffSingle("infoCard.text", (n) => ({ type: "infoCard", eyebrow: text(14), title: text(30), text: text(n, 1) }));
ffSingle("quoteCard.quote", (n) => ({ type: "quoteCard", quote: text(n), source: text(24, 1) }));
ffSingle("callout.text", (n) => ({ type: "callout", label: text(14), text: text(n, 1) }));
ffSingle("diagramNode.title", (n) => ({ type: "diagramNode", title: text(n), body: text(80, 1) }));
ffSingle("diagramNode.body", (n) => ({ type: "diagramNode", title: text(24), body: text(n, 1) }));
ffSingle("statCard.label", (n) => ({ type: "statCard", value: "80%", label: text(n), note: text(60, 1) }));
ffSingle("statCard.note", (n) => ({ type: "statCard", value: "80%", label: text(30), note: text(n, 1) }));
ffSingle("bigNumber.label", (n) => ({ type: "bigNumber", value: "80%", label: text(n) }));
for (const field of ["title", "text"]) {
  addChar("matrix2x2." + field, (n) => freeform([{ type: "matrix2x2", xAxis: { low: "Rendah", high: "Tinggi" }, yAxis: { low: "Rendah", high: "Tinggi" },
    quadrants: range(4).map((i) => ({ title: field === "title" ? text(n, i) : text(18, i), text: field === "text" ? text(n, i + 1) : text(60, i + 1) })) }]));
}
for (const field of ["title", "text"]) {
  addChar("beforeAfter." + field, (n) => freeform([{ type: "beforeAfter", slot: "lg",
    before: { label: "SEBELUM", title: field === "title" ? text(n) : text(24), text: field === "text" ? text(n, 1) : text(90, 1) },
    after: { label: "SESUDAH", title: field === "title" ? text(n, 2) : text(24, 2), text: field === "text" ? text(n, 3) : text(90, 3) } }]));
}
ffSingle("barChart.label", (n) => ({ type: "barChart", unit: "%", items: [{ label: text(n), value: 70 }, { label: text(20, 1), value: 40 }] }));
ffSingle("mythFact.myth", (n) => ({ type: "mythFact", items: [{ myth: text(n), fact: text(60, 1) }] }));
ffSingle("mythFact.fact", (n) => ({ type: "mythFact", items: [{ myth: text(60), fact: text(n, 1) }] }));
ffSingle("pollCard.question", (n) => ({ type: "pollCard", question: text(n), options: [text(30), text(30, 1), text(30, 2)], cta: text(30, 3) }));
ffSingle("sourceNote.text", (n) => ({ type: "sourceNote", text: text(n) }));
ffSingle("progressRing.label", (n) => ({ type: "progressRing", value: 64, label: text(n), note: text(60, 1) }));
ffSingle("progressRing.note", (n) => ({ type: "progressRing", value: 64, label: text(24), note: text(n, 1) }));
ffSingle("avatarQuote.quote", (n) => ({ type: "avatarQuote", quote: text(n), name: text(24, 1), role: text(40, 2) }));
ffSingle("avatarQuote.role", (n) => ({ type: "avatarQuote", quote: text(90), name: text(24, 1), role: text(n, 2) }));
for (const field of ["title", "text"]) {
  addChar("photoHero." + field, (n) => freeform([{ type: "photoHero", size: "sm", title: field === "title" ? text(n) : text(30), text: field === "text" ? text(n, 1) : text(80, 1) }]));
}
ffSingle("phoneMockup.caption", (n) => ({ type: "phoneMockup", size: "md", caption: text(n) }));
ffSingle("textBlock.text", (n) => ({ type: "textBlock", label: text(14), text: text(n, 1) }));
ffSingle("glossary.meaning", (n) => ({ type: "glossary", items: [{ term: text(20), meaning: text(n, 1) }] }));
ffSingle("flow.label", (n) => ({ type: "flow", items: [{ label: text(n), note: text(24, 1) }, { label: text(20, 2) }] }));
ffSingle("flow.note", (n) => ({ type: "flow", items: [{ label: text(16), note: text(n, 1) }, { label: text(16, 2) }] }));
ffSingle("pill.text", (n) => ({ type: "pill", text: text(n) }));

// ---------- browser side ----------

// Returns how many px the slide content exceeds its area (0 = fits).
function measureOverflow() {
  const slide = document.querySelector("[data-carousel-slide]");
  if (!slide) return { error: "slide tidak ditemukan" };
  // Hero/CTA bookends centre their copy between a header and a footer, so
  // overflow shows up as the copy running into those, not as clipping.
  const bookendMain = slide.querySelector(".account-bookend-main");
  if (bookendMain) {
    const header = slide.querySelector(".account-bookend-header").getBoundingClientRect();
    const footer = slide.querySelector(".account-bookend-footer").getBoundingClientRect();
    const inner = slide.querySelector(".account-bookend-inner").getBoundingClientRect();
    const gap = 24;
    let top = Infinity;
    let bottom = -Infinity;
    let right = -Infinity;
    for (const el of bookendMain.querySelectorAll("*")) {
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own && !el.matches(".account-bookend-action")) continue;
      const r = el.getBoundingClientRect();
      top = Math.min(top, r.top);
      bottom = Math.max(bottom, r.bottom);
      right = Math.max(right, r.right);
    }
    const worstY = Math.max(header.bottom + gap - top, bottom - (footer.top - gap));
    const worstX = right - (inner.right - 40);
    return { overflow: Math.max(0, Math.round(Math.max(worstY, worstX) * 10) / 10), area: { width: Math.round(inner.width), height: Math.round(inner.height) } };
  }
  const content = slide.querySelector(".slide-content");
  if (!content) return { error: "area konten tidak ditemukan" };
  const area = content.getBoundingClientRect();
  const tolerance = 1.5;
  let worst = 0;
  const decorative = (el) => {
    for (let node = el; node && node !== content; node = node.parentElement) {
      if (getComputedStyle(node).position === "absolute" || node.getAttribute("aria-hidden") === "true") return true;
    }
    return false;
  };
  const consider = (value) => { if (value > worst) worst = value; };
  consider(content.scrollHeight - content.clientHeight);
  consider(content.scrollWidth - content.clientWidth);
  for (const el of content.querySelectorAll("*")) {
    if (decorative(el)) continue;
    const style = getComputedStyle(el);
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasText) {
      const r = el.getBoundingClientRect();
      consider(r.bottom - area.bottom);
      consider(r.right - area.right);
      consider(area.left - r.left);
    }
    if (style.overflowY !== "visible" && el.scrollHeight - el.clientHeight > tolerance) consider(el.scrollHeight - el.clientHeight);
    if (style.overflowX !== "visible" && el.scrollWidth - el.clientWidth > tolerance) consider(el.scrollWidth - el.clientWidth);
  }
  return { overflow: Math.max(0, Math.round(worst * 10) / 10), area: { width: Math.round(area.width), height: Math.round(area.height) } };
}

async function launch() {
  const browser = await chromium.launch({
    executablePath: process.env.AKSIOMA_CHROMIUM || undefined,
    args: process.env.AKSIOMA_CHROMIUM ? ["--no-sandbox", "--disable-gpu"] : [],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1500 }, deviceScaleFactor: 1 });
  page.on("pageerror", (error) => console.warn("pageerror:", error.message));
  await page.goto(baseUrl + "/studio/measure", { waitUntil: "load", timeout: 180000 });
  await page.waitForFunction(() => window.__measureReady === true, null, { timeout: 180000 });

  if (fontDir) {
    const faces = [];
    for (const [family, folder] of [["MeasureInter", "inter"], ["MeasureLexend", "lexend"]]) {
      for (const weight of [400, 500, 600, 700, 800]) {
        const file = path.join(fontDir, folder, "files", folder + "-latin-" + weight + "-normal.woff2");
        const data = (await fs.readFile(file)).toString("base64");
        faces.push("@font-face{font-family:'" + family + "';font-weight:" + weight + ";src:url(data:font/woff2;base64," + data + ") format('woff2');}");
      }
    }
    await page.addStyleTag({ content: faces.join("\n") + "html{--font-inter:'MeasureInter' !important;--font-lexend:'MeasureLexend' !important;}" });
    await page.evaluate(async () => {
      await Promise.all([400, 500, 600, 700, 800].flatMap((w) => ["MeasureInter", "MeasureLexend"].map((f) => document.fonts.load(w + " 20px " + f))));
    });
  }
  return { browser, page };
}

async function main() {
  const { browser, page } = await launch();
  let renders = 0;

  async function fits(slide, { platform, number = 2, total = 10, account = "journey" }) {
    await page.evaluate((job) => window.__showSlide(job), { slide, platform, number, total, account });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.evaluate(() => document.fonts.ready);
    renders += 1;
    const result = await page.evaluate(measureOverflow);
    if (result.error) throw new Error(result.error + " untuk " + JSON.stringify(slide).slice(0, 120));
    return { ok: result.overflow <= 1.5, ...result };
  }

  // Fonts must really be the brand fonts, otherwise the numbers are wrong.
  await fits({ type: "statement", lead: "Uji font", highlight: "ini" }, { platform: "instagram" });
  const loaded = await page.evaluate(() => [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family));
  const hasInter = loaded.some((f) => /inter/i.test(f));
  const hasLexend = loaded.some((f) => /lexend/i.test(f));
  if (!hasInter || !hasLexend) {
    await browser.close();
    throw new Error("Font Inter/Lexend belum termuat (" + (loaded.join(", ") || "tidak ada") + "). Hasil ukur tidak akurat. Pastikan dev server dapat mengunduh Google Fonts, atau pakai --font-dir.");
  }

  // Largest value in [0, limit] for which `test(value)` holds (assumes monotonic).
  async function largest(limit, test) {
    let low = 0;
    let high = limit;
    while (low < high) {
      const mid = Math.ceil((low + high) / 2);
      if (await test(mid)) low = mid; else high = mid - 1;
    }
    return low;
  }

  const data = {
    generatedAt: new Date().toISOString(),
    canvas: { width: 1080, height: 1350 },
    classes: CLASSES,
    lists: {},
    chars: {},
    fits: {},
  };

  const listNames = Object.keys(listCases);
  for (const [position, name] of listNames.entries()) {
    const def = listCases[name];
    data.lists[name] = { probe: def.probe, defaultDensity: def.defaultDensity, results: {} };
    for (const platform of PLATFORMS) {
      data.lists[name].results[platform] = {};
      for (const density of DENSITIES) {
        const row = {};
        for (const [label, lengths] of Object.entries(CLASSES)) {
          row[label] = await largest(def.probe, async (count) => {
            const slide = def.build(count, lengths);
            slide.density = density;
            return (await fits(slide, { platform })).ok;
          });
        }
        data.lists[name].results[platform][density] = row;
      }
    }
    const r = data.lists[name].results;
    console.log("[" + (position + 1) + "/" + listNames.length + "] " + name.padEnd(28) +
      " tiktok/" + def.defaultDensity + " S/M/L = " + ["S", "M", "L"].map((k) => r.tiktok[def.defaultDensity][k]).join("/") +
      "   instagram = " + ["S", "M", "L"].map((k) => r.instagram[def.defaultDensity][k]).join("/"));
  }

  for (const entry of charCases) {
    data.chars[entry.key] = {};
    for (const platform of PLATFORMS) {
      let best = Infinity;
      for (const account of entry.accounts || ["journey"]) {
        const total = entry.number ? 10 : 10;
        const value = await largest(700, async (length) => (await fits(entry.build(length), { platform, number: entry.number || 2, total, account })).ok);
        best = Math.min(best, value);
      }
      data.chars[entry.key][platform] = best;
    }
    console.log("chars " + entry.key.padEnd(28) + " instagram=" + data.chars[entry.key].instagram + "  tiktok=" + data.chars[entry.key].tiktok);
  }

  for (const entry of fitCases) {
    data.fits[entry.key] = {};
    for (const platform of PLATFORMS) {
      data.fits[entry.key][platform] = (await fits(entry.build(), { platform })).ok;
    }
    console.log("fit " + entry.key.padEnd(24) + " instagram=" + data.fits[entry.key].instagram + " tiktok=" + data.fits[entry.key].tiktok);
  }

  await browser.close();
  const header = "// GENERATED by scripts/measure-capacity.mjs. Do not edit by hand.\n" +
    "// Re-run after changing slide CSS or components:  npm run measure:capacity\n";
  const target = path.resolve(process.cwd(), outFile);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, header + "export const capacityData = " + JSON.stringify(data) + ";\n");
  console.log("\n" + renders + " render diukur. Ditulis ke " + path.relative(process.cwd(), target));
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
