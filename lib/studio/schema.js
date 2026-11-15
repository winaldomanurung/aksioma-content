import {iconPath,shapePath,iconSizes,tones,shapePositions,shapeOpacity,backgroundThemes} from "./assets";
import {hardCount,charLimit,containerLimits,layoutOf,tableKey,allowedSizes} from "./component-specs";
import {validateImages,validateImageRef} from "./images";
import {ACCOUNT_IDS,isAccountId} from "./accounts";
import {FONT_IDS,isFontId} from "./fonts";
import {LOOK_IDS,isLookId} from "./looks";
import {LEVEL_KINDS,CHART_LIMITS,COMPARE_LIMITS,COMPARE_BETTER,PLAN_KINDS,PLAN_LIMITS,CALENDAR_LIMITS,RANK_LIMITS,RANK_TONES,TONES,SNAPSHOT_LIMITS,SIGNAL_DIRS,SIGNAL_LIMITS,LEVELS_LIMITS,BARS_LIMITS,VERDICT_LIMITS, CARDS_LIMITS, SPARK_LIMITS, GAUGE_LIMITS, RANGE_LIMITS, HEAT_LIMITS, FIELD_LIMITS} from "./market";
import {STOCK_MAX_ITEMS,STOCK_SIGNALS,STOCK_NOTE_LIMIT,STOCK_LIMITS,stockTier} from "./stock";

const TYPES = new Set(["hero","statement","bullet","compare","causeEffect","framework","summary","cta","freeform"]);
const NODE_TYPES = new Set(["slideHeading","infoCard","statCard","bigNumber","quoteCard","diagramNode","connector","timeline","checklist","callout","pill","keywordCluster","miniDiagram","twoColumn","threeColumn","contentGrid","stack","divider","assetIcon","assetShape","barChart","matrix2x2","table","mythFact","prosCons","beforeAfter","funnel","ladder","qaCard","pollCard","swipeHint","sourceNote","progressRing","photoHero","phoneMockup","collage","avatarQuote","textBlock","footnote","glossary","flow","stockList","priceChart","stockCompare","tradePlan","eventCalendar","marketRank","statSnapshot","signalGrid","priceLevels","returnBars","verdictCard","compareCards","sparkCards","gauge","rangeBars","heatmap","footballField"]);
// Vertical distribution of a slide's body between header and footer.
const VERTICALS = new Set(["top","center","spread","stretch"]);
const DARK_PRESET_TYPES = new Set(["bullet","causeEffect","summary"]);
const VERTICAL_TYPES = new Set(["statement","bullet","compare","causeEffect","framework","summary","freeform"]);
// Light supporting blocks that may sit below the main content ("extras").
const EXTRA_TYPES = new Set(["callout","sourceNote","miniDiagram","statCard","quoteCard","infoCard","keywordCluster","checklist","diagramNode","connector","pill","divider","swipeHint","progressRing","textBlock","footnote","glossary","flow"]);
const EXTRA_MAX_NODES = 3;
const EXTRA_LIST_MAX = {checklist:3, miniDiagram:4, keywordCluster:6, glossary:2, footnote:3, flow:4};
const CONTAINERS = new Set(["twoColumn","threeColumn","contentGrid","stack"]);
const DENSITIES = new Set(["airy","balanced","compact","bold"]);
const INFO_VARIANTS = new Set(["soft","outline","accent","dark","glass"]);
const STAT_VARIANTS = new Set(["light","dark"]);
const ALIGNS = new Set(["left","center"]);
const DIRECTIONS = new Set(["down","right"]);
const COLUMNS = new Set([1,2,3]);
// Fixed character/count limits that are not measured (see component-specs for measured ones).
const FIXED = Object.freeze({pollCta:60, collageCaption:40, avatarName:40, backgroundWord:24, cornerLabel:40, source:80, sourcesCount:3, barUnit:6, matrixAxis:24, mythLabel:12, proLabel:16, beforeAfterLabel:16, ladderValue:16, swipeHint:16, sourceNoteLabel:16, textBlockLabel:24, glossaryTerm:40, flowVia:14, nodes:18});
// Read-only view of the rules above for the AI prompt contract (lib/studio/prompt-contract.js),
// so the prompt can never drift from what the validator accepts.
export const SCHEMA_RULES = Object.freeze({TYPES, NODE_TYPES, VERTICALS, DARK_PRESET_TYPES, VERTICAL_TYPES, EXTRA_TYPES, EXTRA_MAX_NODES, EXTRA_LIST_MAX, DENSITIES, INFO_VARIANTS, STAT_VARIANTS, ALIGNS, DIRECTIONS, COLUMNS, FIXED});

// Text props each preset renders. A non-string here would crash the renderer
// (an object is not a valid React child), so they are checked up front.
const PRESET_TEXT = {
  hero: ["eyebrow","title","subtitle","accent"],
  statement: ["eyebrow","lead","highlight","note"],
  bullet: ["eyebrow","title"],
  compare: ["eyebrow","title"],
  causeEffect: ["causeTitle","causeText","effectTitle","effectText","chainLabel","chainCaption"],
  framework: ["eyebrow","title"],
  summary: ["title"],
  cta: ["title","body","cta"],
  freeform: ["eyebrow"],
};
export const PRESET_TEXT_FIELDS = PRESET_TEXT;
const META_TEXT = ["objective","contentPillar","hook","instagramCaption","tiktokCaption","cta","notes"];

const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const str = value => typeof value === "string" && value.trim().length > 0;
const arr = value => Array.isArray(value);
const scalar = value => str(value) || (typeof value === "number" && Number.isFinite(value));
function fail(message) { throw new Error(message); }

// Validation collects every problem it can find instead of stopping at the
// first one. `fail` aborts the current unit (a slide-level check, one node,
// one list item); `soft` records a problem that does not affect the shape of
// the data (a too-long text, an unknown enum value) and keeps checking.
let sink = null;
function soft(message) { if(sink) sink.push(message); else fail(message); }
function guard(fn) {
  if(!sink) return fn();
  try { fn(); } catch(e) { sink.push(e?.message || String(e)); }
}
const shown = value => {
  const text = typeof value === "string" ? JSON.stringify(value) : JSON.stringify(value) ?? String(value);
  return text.length > 40 ? text.slice(0, 37)+"…" : text;
};

// Thrown by validateCarousel / parseCarouselSource. `message` lists every
// problem (one per line) for callers that only show text; `issues` carries the
// location of each problem so the Studio can jump to it.
export class CarouselValidationError extends Error {
  constructor(issues) {
    super(issues.map(i => i.message).join("\n"));
    this.name = "CarouselValidationError";
    this.issues = issues;
  }
}

function optText(obj, key, where, maxLength) {
  const value = obj[key];
  if(value === undefined) return;
  if(typeof value !== "string") return soft(where+": "+key+" harus berupa teks (sekarang "+shown(value)+").");
  if(maxLength && value.length > maxLength) soft(where+": "+key+" terlalu panjang (maksimal "+maxLength+" karakter, sekarang "+value.length+").");
}
function optBool(obj, key, where) {
  if(obj[key] !== undefined && typeof obj[key] !== "boolean") soft(where+": "+key+" harus true atau false tanpa kutip (sekarang "+shown(obj[key])+").");
}
function optEnum(obj, key, allowed, where) {
  if(obj[key] !== undefined && !allowed.has(obj[key])) soft(where+": "+key+" harus salah satu dari "+[...allowed].map(v => typeof v === "string" ? "\""+v+"\"" : v).join(", ")+" (sekarang "+shown(obj[key])+").");
}
// ["teks", ...]
function textList(value, where, label, {min=1, max=8}={}) {
  if(!arr(value) || value.length < min || value.length > max) fail(where+": "+label+" harus berisi "+min+"–"+max+" teks.");
  value.forEach((item, i) => {
    if(!str(item)) soft(where+"."+label+"["+i+"]: harus berupa teks tidak kosong.");
  });
}
// [{title, <textKey>?}, ...]
function titledList(value, where, label, textKey, {min=1, max=8}={}) {
  if(!arr(value) || value.length < min || value.length > max) fail(where+": "+label+" harus berisi "+min+"–"+max+" entri.");
  value.forEach((item, i) => {
    const at = where+"."+label+"["+i+"]";
    if(!object(item) || !str(item.title)) return soft(at+": harus berupa object dengan title.");
    optText(item, textKey, at);
  });
}

function validateNode(node, where, depth=0) {
  if(depth > 7) fail(where+": pohon layout terlalu dalam (maksimal 7).");
  if(!object(node)) fail(where+": primitive harus berupa object {\"type\":...}.");
  if(!NODE_TYPES.has(node.type)) fail(where+": type primitive tidak dikenal (sekarang "+shown(node.type)+"). Pakai salah satu nama primitive dari daftar.");
  const {type} = node;
  optBool(node, "dark", where);

  if(CONTAINERS.has(type)) {
    const childMax = containerLimits(layoutOf(node)).hard;
    if(!arr(node.children) || !node.children.length || node.children.length > childMax) fail(where+": children harus berisi 1–"+childMax+" primitive.");
    node.children.forEach((child, i) => guard(() => validateNode(child, where+".children["+i+"]", depth+1)));
    if(type === "contentGrid" && node.columns !== undefined && !COLUMNS.has(node.columns)) fail(where+": columns harus 1, 2, atau 3.");
  }

  if(["slideHeading","infoCard","diagramNode"].includes(type)) {
    if(!str(node.title) && !str(node.text)) fail(where+": title/text wajib diisi.");
    ["title","text","body","eyebrow"].forEach(key => optText(node, key, where));
  }
  if(type === "slideHeading") optEnum(node, "align", ALIGNS, where);
  if(type === "infoCard") optEnum(node, "variant", INFO_VARIANTS, where);

  if(["statCard","bigNumber"].includes(type)) {
    if(!scalar(node.value)) fail(where+": value wajib diisi (teks atau angka).");
    optText(node, "label", where);
    optText(node, "note", where);
  }
  if(type === "statCard") optEnum(node, "variant", STAT_VARIANTS, where);

  if(type === "quoteCard") {
    if(!str(node.quote)) fail(where+": quote wajib diisi.");
    optText(node, "source", where);
  }
  if(type === "connector") {
    optEnum(node, "direction", DIRECTIONS, where);
    optText(node, "label", where);
  }
  if(type === "callout") {
    if(!str(node.text)) fail(where+": text wajib diisi.");
    optText(node, "label", where);
  }
  if(type === "pill" && !str(node.text)) fail(where+": text wajib diisi.");

  if(type === "timeline") titledList(node.items, where, "items", "text", {max:hardCount("timeline")});
  if(["checklist","keywordCluster","miniDiagram"].includes(type)) textList(node.items, where, "items", {max:hardCount(type)});

  if(type === "barChart") {
    optText(node, "unit", where, FIXED.barUnit);
    if(node.max !== undefined && !(typeof node.max === "number" && node.max > 0)) fail(where+": max harus angka lebih besar dari 0.");
    if(!arr(node.items) || !node.items.length || node.items.length > hardCount("barChart")) fail(where+": items harus berisi 1–"+hardCount("barChart")+" batang.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.label)) fail(at+" harus berupa object dengan label.");
      if(typeof item.value !== "number" || !Number.isFinite(item.value) || item.value < 0) fail(at+".value harus berupa angka (bukan teks), minimal 0.");
      optText(item, "note", at);
      optText(item, "label", at, charLimit("barChart.label")?.hard);
    });
  }
  if(type === "matrix2x2") {
    for(const axis of ["xAxis","yAxis"]) {
      if(node[axis] !== undefined) {
        if(!object(node[axis])) fail(where+": "+axis+" harus berupa object.");
        optText(node[axis], "low", where+"."+axis, FIXED.matrixAxis);
        optText(node[axis], "high", where+"."+axis, FIXED.matrixAxis);
      }
    }
    if(!arr(node.quadrants) || node.quadrants.length !== 4) fail(where+": quadrants harus berisi tepat 4 kuadran (kiri-atas, kanan-atas, kiri-bawah, kanan-bawah).");
    node.quadrants.forEach((q, i) => {
      const at = where+".quadrants["+i+"]";
      if(!object(q) || !str(q.title)) fail(at+" harus berupa object dengan title.");
      optText(q, "title", at, charLimit("matrix2x2.title")?.hard);
      optText(q, "text", at, charLimit("matrix2x2.text")?.hard);
    });
  }
  if(type === "table") {
    textList(node.columns, where, "columns", {min:2, max:4});
    const limit = hardCount(tableKey(node.columns.length));
    if(!arr(node.rows) || !node.rows.length || node.rows.length > limit) fail(where+": rows harus berisi 1–"+limit+" baris untuk "+node.columns.length+" kolom.");
    node.rows.forEach((row, i) => {
      const at = where+".rows["+i+"]";
      if(!object(row) || !arr(row.cells) || row.cells.length < 1 || row.cells.length > node.columns.length) fail(at+".cells harus berisi 1–"+node.columns.length+" teks (satu per kolom).");
      row.cells.forEach((cell, j) => { if(typeof cell !== "string") fail(at+".cells["+j+"] harus berupa teks."); });
    });
  }
  if(type === "mythFact") {
    optText(node, "mythLabel", where, FIXED.mythLabel);
    optText(node, "factLabel", where, FIXED.mythLabel);
    const limit = hardCount("mythFact");
    if(!arr(node.items) || !node.items.length || node.items.length > limit) fail(where+": items harus berisi 1–"+limit+" pasangan mitos/fakta.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.myth) || !str(item.fact)) fail(at+" harus berupa object dengan myth dan fact.");
      optText(item, "myth", at, charLimit("mythFact.myth")?.hard);
      optText(item, "fact", at, charLimit("mythFact.fact")?.hard);
    });
  }
  if(type === "prosCons") {
    optText(node, "proLabel", where, FIXED.proLabel);
    optText(node, "conLabel", where, FIXED.proLabel);
    textList(node.pros, where, "pros", {max:hardCount("prosCons")});
    textList(node.cons, where, "cons", {max:hardCount("prosCons")});
  }
  if(type === "beforeAfter") {
    optEnum(node, "slot", new Set(["md","lg"]), where);
    for(const side of ["before","after"]) {
      const value = node[side];
      if(!object(value) || (!str(value.title) && !str(value.text))) fail(where+": "+side+" wajib berupa object dengan title atau text.");
      optText(value, "label", where+"."+side, FIXED.beforeAfterLabel);
      optText(value, "title", where+"."+side, charLimit("beforeAfter.title")?.hard);
      optText(value, "text", where+"."+side, charLimit("beforeAfter.text")?.hard);
    }
  }

  if(type === "funnel" || type === "ladder") {
    if(type === "funnel") optEnum(node, "shape", new Set(["funnel","pyramid"]), where);
    const limit = hardCount(type);
    if(!arr(node.items) || !node.items.length || node.items.length > limit) fail(where+": items harus berisi 1–"+limit+" entri.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.label)) fail(at+" harus berupa object dengan label.");
      optText(item, "note", at);
      if(type === "ladder") { optText(item, "value", at, FIXED.ladderValue); optBool(item, "current", at); }
    });
  }
  if(type === "qaCard") {
    const limit = hardCount("qaCard");
    if(!arr(node.items) || !node.items.length || node.items.length > limit) fail(where+": items harus berisi 1–"+limit+" pasangan tanya/jawab.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.q) || !str(item.a)) fail(at+" harus berupa object dengan q dan a.");
    });
  }
  if(type === "pollCard") {
    if(!str(node.question)) fail(where+": question wajib diisi.");
    optText(node, "question", where, charLimit("pollCard.question")?.hard);
    optText(node, "cta", where, FIXED.pollCta);
    textList(node.options, where, "options", {min:2, max:hardCount("pollCard")});
  }
  if(type === "swipeHint") {
    optText(node, "text", where, FIXED.swipeHint);
    optEnum(node, "align", new Set(["left","center","right"]), where);
  }
  if(type === "sourceNote") {
    if(!str(node.text)) fail(where+": text wajib diisi.");
    optText(node, "text", where, charLimit("sourceNote.text")?.hard);
    optText(node, "label", where, FIXED.sourceNoteLabel);
  }
  if(type === "progressRing") {
    if(typeof node.value !== "number" || !Number.isFinite(node.value) || node.value < 0 || node.value > 100) fail(where+": value harus angka 0–100.");
    optText(node, "label", where, charLimit("progressRing.label")?.hard);
    optText(node, "note", where, charLimit("progressRing.note")?.hard);
  }

  if(type === "textBlock") {
    if(!str(node.text)) fail(where+": text wajib diisi.");
    optText(node, "text", where, charLimit("textBlock.text")?.hard);
    optText(node, "label", where, FIXED.textBlockLabel);
    optEnum(node, "size", new Set(["md","lg"]), where);
  }
  if(type === "footnote") textList(node.items, where, "items", {max:hardCount("footnote")});
  if(type === "glossary") {
    const limit = hardCount("glossary");
    if(!arr(node.items) || !node.items.length || node.items.length > limit) fail(where+": items harus berisi 1–"+limit+" pasangan istilah/arti.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.term) || !str(item.meaning)) fail(at+" harus berupa object dengan term dan meaning.");
      optText(item, "term", at, FIXED.glossaryTerm);
      optText(item, "meaning", at, charLimit("glossary.meaning")?.hard);
    });
  }
  if(type === "flow") {
    optEnum(node, "direction", new Set(["row","column"]), where);
    const dir = node.direction === "column" ? "flow:column" : "flow";
    const limit = hardCount(dir);
    if(!arr(node.items) || node.items.length < 2 || node.items.length > limit) fail(where+": items harus berisi 2–"+limit+" langkah.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.label)) fail(at+" harus berupa object dengan label.");
      optText(item, "label", at, charLimit("flow.label")?.hard);
      optText(item, "note", at, charLimit("flow.note")?.hard);
      optText(item, "via", at, FIXED.flowVia);
    });
    if(node.fork !== undefined) {
      if(!arr(node.fork) || node.fork.length !== 2) fail(where+": fork harus berisi tepat 2 hasil percabangan.");
      node.fork.forEach((item, i) => {
        const at = where+".fork["+i+"]";
        if(!object(item) || !str(item.label)) fail(at+" harus berupa object dengan label.");
        optText(item, "label", at, charLimit("flow.label")?.hard);
        optText(item, "note", at, charLimit("flow.note")?.hard);
        optText(item, "via", at, FIXED.flowVia);
      });
    }
  }

  if(type === "photoHero") {
    validateImageRef(node.image, where);
    optEnum(node, "size", new Set(allowedSizes("photoHero")), where);
    optEnum(node, "shape", new Set(["square","rounded","circle"]), where);
    optEnum(node, "fit", new Set(["cover","contain"]), where);
    optBool(node, "overlay", where);
    optText(node, "title", where, charLimit("photoHero.title")?.hard);
    optText(node, "text", where, charLimit("photoHero.text")?.hard);
    if(!str(node.image) && !str(node.title) && !str(node.text)) fail(where+": isi image, title, atau text.");
  }
  if(type === "phoneMockup") {
    validateImageRef(node.image, where);
    optEnum(node, "size", new Set(allowedSizes("phoneMockup")), where);
    optEnum(node, "align", new Set(["left","center","right"]), where);
    optText(node, "caption", where, charLimit("phoneMockup.caption")?.hard);
  }
  if(type === "collage") {
    optEnum(node, "size", new Set(allowedSizes("collage")), where);
    optEnum(node, "shape", new Set(["square","rounded"]), where);
    if(!arr(node.items) || node.items.length < 2 || node.items.length > 4) fail(where+": items harus berisi 2–4 gambar.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item)) fail(at+" harus berupa object.");
      validateImageRef(item.image, at);
      optText(item, "caption", at, FIXED.collageCaption);
    });
  }
  if(type === "avatarQuote") {
    if(!str(node.quote)) fail(where+": quote wajib diisi.");
    validateImageRef(node.avatar, where, "avatar");
    optText(node, "quote", where, charLimit("avatarQuote.quote")?.hard);
    optText(node, "name", where, FIXED.avatarName);
    optText(node, "role", where, charLimit("avatarQuote.role")?.hard);
  }

  if(type === "stockList") {
    optBool(node, "numbered", where);
    optBool(node, "disclaimer", where);
    optText(node, "disclaimerText", where, STOCK_LIMITS.disclaimerText);
    if(!arr(node.items) || !node.items.length || node.items.length > STOCK_MAX_ITEMS) fail(where+": items harus berisi 1–"+STOCK_MAX_ITEMS+" saham.");
    const tier = stockTier(node.items.length);
    const noteMax = STOCK_NOTE_LIMIT[tier];
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.ticker)) fail(at+" harus berupa object dengan ticker.");
      if(!/^[A-Za-z0-9.\-]+$/.test(item.ticker) || item.ticker.length > STOCK_LIMITS.ticker) fail(at+": ticker maksimal "+STOCK_LIMITS.ticker+" karakter (huruf, angka, titik, atau strip).");
      optText(item, "name", at, STOCK_LIMITS.name);
      optText(item, "action", at, STOCK_LIMITS.action);
      if(item.signal !== undefined && !Object.prototype.hasOwnProperty.call(STOCK_SIGNALS, item.signal)) fail(at+": signal harus salah satu dari "+Object.keys(STOCK_SIGNALS).join(", ")+".");
      for(const key of ["entry","target","stop"]) {
        const value = item[key];
        if(value === undefined) continue;
        if(!scalar(value)) fail(at+": "+key+" harus berupa teks atau angka.");
        if(String(value).length > STOCK_LIMITS[key]) fail(at+": "+key+" terlalu panjang (maksimal "+STOCK_LIMITS[key]+" karakter).");
      }
      if(item.note !== undefined) {
        if(!noteMax) fail(at+": note tidak ditampilkan untuk "+node.items.length+" saham (6–"+STOCK_MAX_ITEMS+" memakai baris ringkas). Hapus note atau kurangi daftar menjadi maksimal 5 saham.");
        optText(item, "note", at, noteMax);
      }
    });
  }

  if(type === "priceChart") {
    const hasC = node.candles !== undefined, hasP = node.points !== undefined;
    if(hasC === hasP) fail(where+": isi tepat salah satu: candles atau points.");
    const series = hasC ? node.candles : node.points;
    if(!arr(series) || series.length < CHART_LIMITS.minPoints || series.length > CHART_LIMITS.maxPoints) fail(where+": "+(hasC?"candles":"points")+" harus berisi "+CHART_LIMITS.minPoints+"–"+CHART_LIMITS.maxPoints+" data.");
    const num = v => typeof v === "number" && Number.isFinite(v);
    series.forEach((p, i) => {
      const at = where+"."+(hasC?"candles":"points")+"["+i+"]";
      if(hasC) {
        if(!object(p) || ![p.o,p.h,p.l,p.c].every(num)) fail(at+" harus {o,h,l,c} berisi angka.");
        if(p.h < Math.max(p.o,p.c) || p.l > Math.min(p.o,p.c)) fail(at+": h harus ≥ open/close dan l harus ≤ open/close.");
      } else if(!num(p)) fail(at+" harus berupa angka.");
    });
    if(node.levels !== undefined) {
      if(!arr(node.levels) || node.levels.length > CHART_LIMITS.levels) fail(where+": levels maksimal "+CHART_LIMITS.levels+" garis.");
      node.levels.forEach((l, i) => {
        const at = where+".levels["+i+"]";
        if(!object(l) || !(num(l.value) || (str(l.value) && Number.isFinite(Number(String(l.value).replace(",","."))))) ) fail(at+" harus {kind,value} dengan value berupa angka.");
        if(!Object.prototype.hasOwnProperty.call(LEVEL_KINDS, l.kind)) fail(at+": kind harus salah satu dari "+Object.keys(LEVEL_KINDS).join(", ")+".");
        optText(l, "label", at, CHART_LIMITS.levelLabel);
      });
    }
    optText(node, "title", where, CHART_LIMITS.title);
    optText(node, "caption", where, CHART_LIMITS.caption);
    optText(node, "from", where, CHART_LIMITS.label);
    optText(node, "to", where, CHART_LIMITS.label);
  }
  if(type === "stockCompare") {
    optBool(node, "disclaimer", where);
    for(const side of ["left","right"]) {
      const s = node[side], at = where+"."+side;
      if(!object(s) || !str(s.ticker)) fail(at+" harus {ticker,...}.");
      if(!/^[A-Za-z0-9.\-]+$/.test(s.ticker) || s.ticker.length > COMPARE_LIMITS.ticker) fail(at+": ticker maksimal "+COMPARE_LIMITS.ticker+" karakter.");
      optText(s, "name", at, COMPARE_LIMITS.name);
      if(s.signal !== undefined && !Object.prototype.hasOwnProperty.call(STOCK_SIGNALS, s.signal)) fail(at+": signal harus salah satu dari "+Object.keys(STOCK_SIGNALS).join(", ")+".");
    }
    if(!arr(node.rows) || !node.rows.length || node.rows.length > COMPARE_LIMITS.rows) fail(where+": rows harus berisi 1–"+COMPARE_LIMITS.rows+" baris.");
    node.rows.forEach((r, i) => {
      const at = where+".rows["+i+"]";
      if(!object(r) || !str(r.label) || !scalar(r.left) || !scalar(r.right)) fail(at+" harus {label,left,right}.");
      if(r.label.length > COMPARE_LIMITS.label) fail(at+": label maksimal "+COMPARE_LIMITS.label+" karakter.");
      if(String(r.left).length > COMPARE_LIMITS.value || String(r.right).length > COMPARE_LIMITS.value) fail(at+": left/right maksimal "+COMPARE_LIMITS.value+" karakter.");
      if(r.better !== undefined && !COMPARE_BETTER.includes(r.better)) fail(at+": better harus left atau right.");
    });
  }
  if(type === "tradePlan") {
    optText(node, "ticker", where, PLAN_LIMITS.ticker);
    optText(node, "risk", where, PLAN_LIMITS.risk);
    if(!arr(node.scenarios) || node.scenarios.length < 1 || node.scenarios.length > PLAN_LIMITS.scenarios) fail(where+": scenarios harus berisi 1–"+PLAN_LIMITS.scenarios+" skenario.");
    node.scenarios.forEach((sc, i) => {
      const at = where+".scenarios["+i+"]";
      if(!object(sc) || !str(sc.trigger)) fail(at+" harus {kind,trigger}.");
      if(!Object.prototype.hasOwnProperty.call(PLAN_KINDS, sc.kind)) fail(at+": kind harus salah satu dari "+Object.keys(PLAN_KINDS).join(", ")+".");
      optText(sc, "trigger", at, PLAN_LIMITS.trigger);
      optText(sc, "target", at, PLAN_LIMITS.target);
      optText(sc, "note", at, PLAN_LIMITS.note);
    });
  }
  if(type === "eventCalendar") {
    if(!arr(node.items) || !node.items.length || node.items.length > CALENDAR_LIMITS.items) fail(where+": items harus berisi 1–"+CALENDAR_LIMITS.items+" agenda.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.date) || !str(it.title)) fail(at+" harus {date,title}.");
      optText(it, "date", at, CALENDAR_LIMITS.date);
      optText(it, "title", at, CALENDAR_LIMITS.title);
      optText(it, "tag", at, CALENDAR_LIMITS.tag);
      optText(it, "note", at, CALENDAR_LIMITS.note);
    });
  }

  if(type === "marketRank") {
    optEnum(node, "tone", new Set(RANK_TONES), where);
    if(!arr(node.items) || !node.items.length || node.items.length > RANK_LIMITS.items) fail(where+": items harus berisi 1–"+RANK_LIMITS.items+" baris.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.ticker)) fail(at+" harus {ticker,...}.");
      if(!/^[A-Za-z0-9.\-]+$/.test(it.ticker) || it.ticker.length > RANK_LIMITS.ticker) fail(at+": ticker maksimal "+RANK_LIMITS.ticker+" karakter.");
      for(const key of ["value","change"]) {
        if(it[key] === undefined) continue;
        if(!scalar(it[key])) fail(at+": "+key+" harus teks atau angka.");
        if(String(it[key]).length > RANK_LIMITS[key]) fail(at+": "+key+" maksimal "+RANK_LIMITS[key]+" karakter.");
      }
      if(it.bar !== undefined && !(typeof it.bar === "number" && it.bar >= 0 && it.bar <= 100)) fail(at+": bar harus angka 0–100.");
    });
  }
  if(type === "statSnapshot") {
    if(!arr(node.items) || !node.items.length || node.items.length > SNAPSHOT_LIMITS.items) fail(where+": items harus berisi 1–"+SNAPSHOT_LIMITS.items+" metrik.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.label) || !scalar(it.value)) fail(at+" harus {label,value}.");
      optText(it, "label", at, SNAPSHOT_LIMITS.label);
      if(String(it.value).length > SNAPSHOT_LIMITS.value) fail(at+": value maksimal "+SNAPSHOT_LIMITS.value+" karakter.");
      optText(it, "sub", at, SNAPSHOT_LIMITS.sub);
      optEnum(it, "tone", new Set(TONES), at);
    });
  }
  if(type === "signalGrid") {
    if(!arr(node.items) || !node.items.length || node.items.length > SIGNAL_LIMITS.items) fail(where+": items harus berisi 1–"+SIGNAL_LIMITS.items+" indikator.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.name) || !str(it.reading)) fail(at+" harus {name,reading,signal}.");
      if(!Object.prototype.hasOwnProperty.call(SIGNAL_DIRS, it.signal)) fail(at+": signal harus salah satu dari "+Object.keys(SIGNAL_DIRS).join(", ")+".");
      optText(it, "name", at, SIGNAL_LIMITS.name);
      optText(it, "reading", at, SIGNAL_LIMITS.reading);
    });
  }
  if(type === "priceLevels") {
    if(!arr(node.items) || node.items.length < 2 || node.items.length > LEVELS_LIMITS.items) fail(where+": items harus berisi 2–"+LEVELS_LIMITS.items+" level.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !scalar(it.value)) fail(at+" harus {kind,value}.");
      if(!Object.prototype.hasOwnProperty.call(LEVEL_KINDS, it.kind)) fail(at+": kind harus salah satu dari "+Object.keys(LEVEL_KINDS).join(", ")+".");
      if(String(it.value).length > LEVELS_LIMITS.value) fail(at+": value maksimal "+LEVELS_LIMITS.value+" karakter.");
      optText(it, "label", at, LEVELS_LIMITS.label);
      if(it.current !== undefined && typeof it.current !== "boolean") fail(at+": current harus true/false.");
    });
  }
  if(type === "returnBars") {
    optText(node, "unit", where, BARS_LIMITS.unit);
    if(node.signed !== undefined && typeof node.signed !== "boolean") fail(where+": signed harus true/false.");
    if(!arr(node.groups) || !node.groups.length || node.groups.length > BARS_LIMITS.groups) fail(where+": groups harus berisi 1–"+BARS_LIMITS.groups+" kelompok.");
    let total = 0;
    node.groups.forEach((g, gi) => {
      const at = where+".groups["+gi+"]";
      if(!object(g) || !str(g.label)) fail(at+" harus {label,bars}.");
      optText(g, "label", at, BARS_LIMITS.label);
      if(!arr(g.bars) || !g.bars.length || g.bars.length > BARS_LIMITS.bars) fail(at+": bars harus berisi 1–"+BARS_LIMITS.bars+" batang.");
      total += g.bars.length;
      g.bars.forEach((b, bi) => {
        const bt = at+".bars["+bi+"]";
        if(!object(b) || !str(b.name) || typeof b.value !== "number" || !Number.isFinite(b.value)) fail(bt+" harus {name,value:angka}.");
        optText(b, "name", bt, BARS_LIMITS.name);
        if(b.highlight !== undefined && typeof b.highlight !== "boolean") fail(bt+": highlight harus true/false.");
      });
    });
    if(total > BARS_LIMITS.totalBars) fail(where+": total batang maksimal "+BARS_LIMITS.totalBars+" (sekarang "+total+").");
  }
  if(type === "verdictCard") {
    if(!str(node.title)) fail(where+": title wajib diisi.");
    if(!Object.prototype.hasOwnProperty.call(STOCK_SIGNALS, node.verdict)) fail(where+": verdict harus salah satu dari "+Object.keys(STOCK_SIGNALS).join(", ")+".");
    optText(node, "title", where, VERDICT_LIMITS.title);
    optText(node, "text", where, VERDICT_LIMITS.text);
    optText(node, "caution", where, VERDICT_LIMITS.caution);
    if(node.reasons !== undefined) {
      if(!arr(node.reasons) || node.reasons.length > VERDICT_LIMITS.reasons) fail(where+": reasons maksimal "+VERDICT_LIMITS.reasons+" poin.");
      node.reasons.forEach((r, i) => { if(!str(r) || r.length > VERDICT_LIMITS.reason) fail(where+".reasons["+i+"] harus teks maksimal "+VERDICT_LIMITS.reason+" karakter."); });
    }
  }
  if(type === "compareCards") {
    optText(node, "delta", where, CARDS_LIMITS.delta);
    for(const side of ["left","right"]) {
      const c = node[side], at = where+"."+side;
      if(!object(c) || !str(c.label) || !scalar(c.heading)) fail(at+" harus {label,heading,points?}.");
      optText(c, "label", at, CARDS_LIMITS.label);
      if(String(c.heading).length > CARDS_LIMITS.heading) fail(at+": heading maksimal "+CARDS_LIMITS.heading+" karakter.");
      if(c.points !== undefined) {
        if(!arr(c.points) || c.points.length > CARDS_LIMITS.points) fail(at+": points maksimal "+CARDS_LIMITS.points+" poin.");
        c.points.forEach((pt, i) => { if(!str(pt) || pt.length > CARDS_LIMITS.point) fail(at+".points["+i+"] harus teks maksimal "+CARDS_LIMITS.point+" karakter."); });
      }
    }
  }
  const num = v => typeof v === "number" && Number.isFinite(v);
  if(type === "sparkCards") {
    if(!arr(node.items) || !node.items.length || node.items.length > SPARK_LIMITS.items) fail(where+": items harus berisi 1–"+SPARK_LIMITS.items+" kartu.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.label) || !scalar(it.value)) fail(at+" harus {label,value,points}.");
      optText(it, "label", at, SPARK_LIMITS.label);
      if(String(it.value).length > SPARK_LIMITS.value) fail(at+": value maksimal "+SPARK_LIMITS.value+" karakter.");
      optText(it, "sub", at, SPARK_LIMITS.sub);
      optEnum(it, "tone", new Set(TONES), at);
      if(!arr(it.points) || it.points.length < SPARK_LIMITS.pointsMin || it.points.length > SPARK_LIMITS.pointsMax || !it.points.every(num)) fail(at+": points harus berisi "+SPARK_LIMITS.pointsMin+"–"+SPARK_LIMITS.pointsMax+" angka.");
    });
  }
  if(type === "gauge") {
    if(!arr(node.items) || !node.items.length || node.items.length > GAUGE_LIMITS.items) fail(where+": items harus berisi 1–"+GAUGE_LIMITS.items+" gauge.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.label) || !num(it.value) || it.value < 0 || it.value > 100) fail(at+" harus {label,value:angka 0–100}.");
      optText(it, "label", at, GAUGE_LIMITS.label);
      optText(it, "display", at, GAUGE_LIMITS.display);
      optText(it, "note", at, GAUGE_LIMITS.note);
      optEnum(it, "tone", new Set(["up","down","neutral","info"]), at);
    });
  }
  if(type === "rangeBars") {
    optText(node, "unit", where, RANGE_LIMITS.unit);
    if(!arr(node.items) || !node.items.length || node.items.length > RANGE_LIMITS.items) fail(where+": items harus berisi 1–"+RANGE_LIMITS.items+" rentang.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.label) || !num(it.low) || !num(it.high) || !num(it.current)) fail(at+" harus {label,low,high,current} (angka).");
      optText(it, "label", at, RANGE_LIMITS.label);
      if(it.low >= it.high) fail(at+": low harus lebih kecil dari high.");
      if(it.current < it.low || it.current > it.high) fail(at+": current harus berada di antara low dan high.");
    });
  }
  if(type === "heatmap") {
    if(!arr(node.items) || node.items.length < HEAT_LIMITS.min || node.items.length > HEAT_LIMITS.items) fail(where+": items harus berisi "+HEAT_LIMITS.min+"–"+HEAT_LIMITS.items+" kotak.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.name) || !num(it.change)) fail(at+" harus {name,change:angka persen}.");
      optText(it, "name", at, HEAT_LIMITS.name);
      optText(it, "sub", at, HEAT_LIMITS.sub);
    });
  }
  if(type === "footballField") {
    optText(node, "unit", where, FIELD_LIMITS.unit);
    optText(node, "currentLabel", where, FIELD_LIMITS.tag);
    if(!num(node.current)) fail(where+": current (harga sekarang) harus angka.");
    if(!arr(node.items) || node.items.length < FIELD_LIMITS.min || node.items.length > FIELD_LIMITS.items) fail(where+": items harus berisi "+FIELD_LIMITS.min+"–"+FIELD_LIMITS.items+" rentang.");
    node.items.forEach((it, i) => {
      const at = where+".items["+i+"]";
      if(!object(it) || !str(it.label) || !num(it.low) || !num(it.high)) fail(at+" harus {label,low,high} (angka).");
      optText(it, "label", at, FIELD_LIMITS.label);
      if(it.low >= it.high) fail(at+": low harus lebih kecil dari high.");
    });
  }
  if(type === "assetIcon") {
    if(!iconPath(node.set||"lucide", node.name)) soft(where+": name ikon tidak ada di Asset Library set "+shown(node.set||"lucide")+" (sekarang "+shown(node.name)+").");
    if(node.size !== undefined && !Object.prototype.hasOwnProperty.call(iconSizes, node.size)) soft(where+": size harus salah satu dari "+Object.keys(iconSizes).join(", ")+" (sekarang "+shown(node.size)+").");
    if(node.tone !== undefined && !tones.includes(node.tone)) soft(where+": tone harus salah satu dari "+tones.join(", ")+" (sekarang "+shown(node.tone)+").");
    if(node.label !== undefined && typeof node.label !== "string") fail(where+": label ikon harus teks.");
  }
  if(type === "assetShape") {
    if(!shapePath(node.name)) soft(where+": name dekorasi tidak ada di Asset Library (sekarang "+shown(node.name)+").");
    if(node.position !== undefined && !shapePositions.includes(node.position)) soft(where+": position harus salah satu dari "+shapePositions.join(", ")+" (sekarang "+shown(node.position)+").");
    if(node.opacity !== undefined && !shapeOpacity.includes(node.opacity)) soft(where+": opacity harus salah satu dari "+shapeOpacity.join(", ")+" (sekarang "+shown(node.opacity)+").");
  }
}

function validateSlide(s, where) {
  if(!object(s)) fail(where+": slide harus berupa object {\"type\":...}.");
  if(!TYPES.has(s.type)) fail(where+": type slide harus salah satu dari "+[...TYPES].join(", ")+" (sekarang "+shown(s.type)+").");
  optEnum(s, "density", DENSITIES, where);
  if(s.font !== undefined && !isFontId(s.font)) soft(where+": font harus salah satu dari "+FONT_IDS.join(", ")+" (sekarang "+shown(s.font)+").");
  guard(() => {
    if(s.theme === undefined) return;
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": theme tidak tersedia untuk slide "+s.type+"; hapus field theme.");
    if(!Object.prototype.hasOwnProperty.call(backgroundThemes, s.theme)) fail(where+": theme harus salah satu dari "+Object.keys(backgroundThemes).join(", ")+" (sekarang "+shown(s.theme)+").");
    if(s.type !== "freeform") {
      const wantsDark = DARK_PRESET_TYPES.has(s.type);
      if(backgroundThemes[s.theme].dark !== wantsDark) fail(where+": theme slide "+s.type+" harus tema "+(wantsDark?"gelap":"terang")+": "+Object.keys(backgroundThemes).filter(k => backgroundThemes[k].dark === wantsDark).join(", ")+" (sekarang "+shown(s.theme)+").");
    }
  });
  guard(() => {
    if(s.decorations === undefined) return;
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": decorations tidak tersedia untuk slide "+s.type+"; hapus field decorations.");
    if(s.decorations === "none") return; /* explicit opt-out */
    if(!arr(s.decorations) || s.decorations.length < 1 || s.decorations.length > 2) fail(where+": decorations harus berisi 1–2 dekorasi atau \"none\".");
    s.decorations.forEach((d, i) => {
      const at = where+".decorations["+i+"]";
      if(!object(d) || !shapePath(d.name)) return soft(at+": name harus dari registry dekorasi Asset Library (sekarang "+shown(object(d)?d.name:d)+").");
      if(d.position !== undefined && !shapePositions.includes(d.position)) soft(at+": position harus salah satu dari "+shapePositions.join(", ")+" (sekarang "+shown(d.position)+").");
      if(d.opacity !== undefined && !shapeOpacity.includes(d.opacity)) soft(at+": opacity harus salah satu dari "+shapeOpacity.join(", ")+" (sekarang "+shown(d.opacity)+").");
    });
  });

  PRESET_TEXT[s.type].forEach(key => optText(s, key, where, charLimit(s.type+"."+key)?.hard));
  optText(s, "backgroundWord", where, FIXED.backgroundWord);
  optText(s, "cornerLabel", where, FIXED.cornerLabel);
  if(s.keywords !== undefined) guard(() => textList(s.keywords, where, "keywords", {min:0, max:8}));

  if(["hero","statement","bullet","compare","framework","summary","cta"].includes(s.type) && !str(s.title||s.lead)) soft(where+": "+(s.type==="statement"?"lead":"title")+" wajib diisi.");
  if(s.type === "hero" && !str(s.subtitle)) soft(where+": subtitle wajib diisi.");
  if(s.type === "statement" && !str(s.highlight)) soft(where+": highlight wajib diisi.");
  if(s.type === "causeEffect") {
    if(!str(s.causeTitle)) soft(where+": causeTitle wajib diisi.");
    if(!str(s.effectTitle)) soft(where+": effectTitle wajib diisi.");
    if(s.chain !== undefined) guard(() => titledList(s.chain, where, "chain", "note", {min:0, max:hardCount("causeEffect")}));
  }
  if(s.type === "compare") {
    for(const side of ["left","right"]) guard(() => {
      const value = s[side];
      if(!object(value)) fail(where+": "+side+" wajib berupa object {label,heading,points}.");
      optText(value, "label", where+"."+side);
      optText(value, "heading", where+"."+side);
      textList(value.points, where+"."+side, "points", {max:hardCount(s.keywords && s.keywords.length ? "compare+keywords" : "compare")});
    });
  }
  if(s.type === "bullet") guard(() => titledList(s.items, where, "items", "text", {max:hardCount("bullet")}));
  if(s.type === "framework") guard(() => titledList(s.steps, where, "steps", "text", {max:hardCount(s.keywords && s.keywords.length ? "framework+keywords" : "framework")}));
  if(s.type === "summary") guard(() => textList(s.items, where, "items", {max:hardCount(s.keywords && s.keywords.length ? "summary+keywords" : "summary")}));
  if(s.vertical !== undefined) {
    if(!VERTICAL_TYPES.has(s.type)) soft(where+": vertical tidak tersedia untuk slide "+s.type+"; hapus field vertical.");
    else optEnum(s, "vertical", VERTICALS, where);
  }
  if(s.extras !== undefined) guard(() => {
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": extras tidak tersedia untuk slide "+s.type+"; hapus field extras.");
    if(!arr(s.extras) || s.extras.length < 1 || s.extras.length > EXTRA_MAX_NODES) fail(where+": extras harus berisi 1–"+EXTRA_MAX_NODES+" blok pendukung.");
    s.extras.forEach((n, j) => guard(() => {
      const at = where+".extras["+j+"]";
      if(!object(n) || !EXTRA_TYPES.has(n.type)) fail(at+": type extras harus salah satu dari "+[...EXTRA_TYPES].join(", ")+" (sekarang "+shown(object(n)?n.type:n)+").");
      validateNode(n, at);
      const cap = EXTRA_LIST_MAX[n.type];
      if(cap && arr(n.items) && n.items.length > cap) fail(at+": items "+n.type+" di extras maksimal "+cap+" (sekarang "+n.items.length+").");
    }));
  });
  if(s.sources !== undefined) guard(() => {
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": sources tidak tersedia untuk slide "+s.type+"; hapus field sources.");
    textList(s.sources, where, "sources", {min:1, max:FIXED.sourcesCount});
    s.sources.forEach((item, i) => { if(typeof item === "string" && item.length > FIXED.source) soft(where+".sources["+i+"]: terlalu panjang (maksimal "+FIXED.source+" karakter, sekarang "+item.length+")."); });
  });
  if(s.images !== undefined) guard(() => validateImages(s.images, where));
  if(s.type === "freeform") {
    optBool(s, "dark", where);
    if(!arr(s.nodes) || !s.nodes.length || s.nodes.length > FIXED.nodes) fail(where+": nodes harus berisi 1–"+FIXED.nodes+" primitive.");
    s.nodes.forEach((n, j) => guard(() => validateNode(n, where+".nodes["+j+"]")));
  }
}

// Turns a validator message ("Slide 08.nodes[1]: disclaimerText terlalu …")
// into a location: path into the carousel object plus the slide index.
const WHERE = /^(Slide (\d+)|meta)((?:\.[A-Za-z_$][\w$]*|\[\d+\])*)/;
function locateIssue(message, data) {
  const m = WHERE.exec(message);
  if(!m) return {message, path: /^slides\b/.test(message) ? ["slides"] : [], slide: null};
  const path = m[2] ? ["slides", Number(m[2]) - 1] : ["meta"];
  for(const t of m[3].match(/\.[A-Za-z_$][\w$]*|\[\d+\]/g) || []) path.push(t[0] === "[" ? Number(t.slice(1, -1)) : t.slice(1));
  let target = data;
  for(const k of path) target = target == null ? undefined : target[k];
  const rest = message.slice(m[0].length);
  const field = /^: ([A-Za-z_$][\w$]*)\b/.exec(rest)?.[1];
  if(field && object(target) && Object.prototype.hasOwnProperty.call(target, field)) path.push(field);
  return {message, path, slide: m[2] ? Number(m[2]) - 1 : null};
}

export function validateCarousel(value) {
  if(!object(value) || value.version !== 1) fail("Gunakan object dengan \"version\": 1 di root.");
  const outer = sink;
  sink = [];
  try {
    guard(() => {
      if(!object(value.meta)) fail("meta wajib berupa object.");
      if(!str(value.meta.title)) soft("meta.title wajib diisi.");
      if(value.meta.account !== undefined && !isAccountId(value.meta.account)) soft("meta: account harus salah satu dari "+ACCOUNT_IDS.map(id => "\""+id+"\"").join(", ")+" atau dihilangkan (sekarang "+shown(value.meta.account)+").");
      if(value.meta.font !== undefined && !isFontId(value.meta.font)) soft("meta: font harus salah satu dari "+FONT_IDS.join(", ")+" (sekarang "+shown(value.meta.font)+").");
      if(value.meta.look !== undefined && !isLookId(value.meta.look)) soft("meta: look harus salah satu dari "+LOOK_IDS.join(", ")+" (sekarang "+shown(value.meta.look)+").");
      META_TEXT.forEach(key => optText(value.meta, key, "meta"));
      ["hashtags","keywords"].forEach(key => {
        if(value.meta[key] !== undefined) guard(() => textList(value.meta[key], "meta", key, {min:0, max:30}));
      });
    });
    guard(() => {
      if(!arr(value.slides) || value.slides.length < 1 || value.slides.length > 35) fail("slides harus berisi 1–35 slide (Instagram maks 20, TikTok maks 35).");
      value.slides.forEach((s, i) => guard(() => validateSlide(s, "Slide "+String(i+1).padStart(2, "0"))));
    });
    const bytes = new TextEncoder().encode(JSON.stringify(value)).length;
    if(bytes > 180000) soft("Definisi terlalu besar (maksimal 180 KB).");
    if(sink.length) throw new CarouselValidationError([...new Set(sink)].map(msg => locateIssue(msg, value)));
  } finally {
    sink = outer;
  }
  return value;
}

// Common reasons an AI answer is not valid JSON, checked around the parser's
// error position so the message says what to fix.
function jsonHint(text, pos) {
  const before = text.slice(Math.max(0, pos - 40), pos), at = text.slice(pos, pos + 2);
  if(/,\s*$/.test(before) && /^[\]}]/.test(at)) return "Ada koma berlebih sebelum } atau ] (trailing comma). Hapus komanya.";
  if(/^\/[/*]/.test(at)) return "Komentar // atau /* */ tidak boleh ada di JSON.";
  if(/^['‘’]/.test(at)) return "Teks dan nama properti wajib memakai kutip ganda \", bukan kutip tunggal.";
  if(/^[“”]/.test(at)) return "Ada kutip miring “ ” (smart quote). Ganti dengan kutip ganda biasa \".";
  if(/^[A-Za-z_]/.test(at)) return "Nama properti wajib diapit kutip ganda, mis. \"title\".";
  if(/["\]}0-9el]\s*$/.test(before) && /^["{[]/.test(at)) return "Kurang koma di antara dua nilai atau properti.";
  return "Periksa koma, kutip ganda, dan pasangan { } [ ] di sekitar lokasi ini.";
}

export function parseCarouselSource(source) {
  if(typeof source !== "string" || source.length > 240000) fail("Input terlalu besar (maksimal 240.000 karakter).");
  // A complete page.jsx is supported ONLY if it contains an explicit JSON
  // data island. No eval, Function, JSX compilation, or JavaScript execution.
  const start = "/* AKSIOMA_STUDIO_JSON_START */";
  const end = "/* AKSIOMA_STUDIO_JSON_END */";
  let from = 0, to = source.length;
  if(source.includes(start)) {
    from = source.indexOf(start) + start.length;
    to = source.indexOf(end, from);
    if(to < 0) fail("Penanda AKSIOMA_STUDIO_JSON_END tidak ditemukan.");
  }
  while(from < to && /\s/.test(source[from])) from++;
  while(to > from && /\s/.test(source[to - 1])) to--;
  const value = source.slice(from, to);
  if(!source.includes(start) && !value.startsWith("{")) {
    const fence = /```(?:json)?\s*\n/.exec(source);
    if(fence) throw new CarouselValidationError([{message: "Hapus pembungkus ```json … ``` dan teks di luar JSON; paste hanya isi code block.", path: [], slide: null, offset: fence.index}]);
    fail("JSX lama tidak dapat dijalankan di Studio. Paste JSON atau page.jsx dengan blok AKSIOMA_STUDIO_JSON_START/END.");
  }
  let result;
  try { result = JSON.parse(value); }
  catch(e) {
    const detail = String(e?.message || "");
    const pos = Number(/position (\d+)/.exec(detail)?.[1] ?? (/end of (JSON|data)/i.test(detail) ? value.length : NaN));
    const offset = Number.isFinite(pos) ? from + Math.min(pos, value.length) : null;
    const line = offset === null ? null : source.slice(0, offset).split("\n").length;
    const hint = offset === null ? "Gunakan kutip ganda, tanpa komentar atau trailing comma." : jsonHint(value, pos);
    throw new CarouselValidationError([{message: "Format JSON tidak valid"+(line ? " (baris "+line+")" : "")+": "+hint, path: [], slide: null, offset, json: true}]);
  }
  return validateCarousel(result);
}
