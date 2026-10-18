import {iconPath,shapePath,iconSizes,tones,shapePositions,shapeOpacity,backgroundThemes} from "./assets";
import {hardCount,charLimit,containerLimits,layoutOf,tableKey,allowedSizes} from "./component-specs";
import {validateImages,validateImageRef} from "./images";
import {FONT_IDS,isFontId} from "./fonts";
import {STOCK_MAX_ITEMS,STOCK_SIGNALS,STOCK_NOTE_LIMIT,STOCK_LIMITS,stockTier} from "./stock";

const TYPES = new Set(["hero","statement","bullet","compare","causeEffect","framework","summary","cta","freeform"]);
const NODE_TYPES = new Set(["slideHeading","infoCard","statCard","bigNumber","quoteCard","diagramNode","connector","timeline","checklist","callout","pill","keywordCluster","miniDiagram","twoColumn","threeColumn","contentGrid","stack","divider","assetIcon","assetShape","barChart","matrix2x2","table","mythFact","prosCons","beforeAfter","funnel","ladder","qaCard","pollCard","swipeHint","sourceNote","progressRing","photoHero","phoneMockup","collage","avatarQuote","textBlock","footnote","glossary","flow","stockList"]);
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
const META_TEXT = ["objective","contentPillar","hook","instagramCaption","tiktokCaption","cta","notes"];

const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const str = value => typeof value === "string" && value.trim().length > 0;
const arr = value => Array.isArray(value);
const scalar = value => str(value) || (typeof value === "number" && Number.isFinite(value));
function fail(message) { throw new Error(message); }

function optText(obj, key, where, maxLength) {
  const value = obj[key];
  if(value === undefined) return;
  if(typeof value !== "string") fail(where+": "+key+" harus berupa teks.");
  if(maxLength && value.length > maxLength) fail(where+": "+key+" terlalu panjang (maksimal "+maxLength+" karakter).");
}
function optBool(obj, key, where) {
  if(obj[key] !== undefined && typeof obj[key] !== "boolean") fail(where+": "+key+" harus true atau false.");
}
function optEnum(obj, key, allowed, where) {
  if(obj[key] !== undefined && !allowed.has(obj[key])) fail(where+": "+key+" harus salah satu dari "+[...allowed].join(", ")+".");
}
// ["teks", ...]
function textList(value, where, label, {min=1, max=8}={}) {
  if(!arr(value) || value.length < min || value.length > max) fail(where+": "+label+" harus berisi "+min+"–"+max+" teks.");
  value.forEach((item, i) => {
    if(!str(item)) fail(where+": "+label+"["+i+"] harus berupa teks tidak kosong.");
  });
}
// [{title, <textKey>?}, ...]
function titledList(value, where, label, textKey, {min=1, max=8}={}) {
  if(!arr(value) || value.length < min || value.length > max) fail(where+": "+label+" harus berisi "+min+"–"+max+" entri.");
  value.forEach((item, i) => {
    const at = where+": "+label+"["+i+"]";
    if(!object(item) || !str(item.title)) fail(at+" harus berupa object dengan title.");
    optText(item, textKey, at);
  });
}

function validateNode(node, where, depth=0) {
  if(depth > 7) fail(where+": pohon layout terlalu dalam (maksimal 7).");
  if(!object(node) || !NODE_TYPES.has(node.type)) fail(where+": tipe primitive tidak dikenal.");
  const {type} = node;
  optBool(node, "dark", where);

  if(CONTAINERS.has(type)) {
    const childMax = containerLimits(layoutOf(node)).hard;
    if(!arr(node.children) || !node.children.length || node.children.length > childMax) fail(where+": children harus berisi 1–"+childMax+" primitive.");
    node.children.forEach((child, i) => validateNode(child, where+".children["+i+"]", depth+1));
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
    optText(node, "unit", where, 6);
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
        optText(node[axis], "low", where+"."+axis, 24);
        optText(node[axis], "high", where+"."+axis, 24);
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
    optText(node, "mythLabel", where, 12);
    optText(node, "factLabel", where, 12);
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
    optText(node, "proLabel", where, 16);
    optText(node, "conLabel", where, 16);
    textList(node.pros, where, "pros", {max:hardCount("prosCons")});
    textList(node.cons, where, "cons", {max:hardCount("prosCons")});
  }
  if(type === "beforeAfter") {
    optEnum(node, "slot", new Set(["md","lg"]), where);
    for(const side of ["before","after"]) {
      const value = node[side];
      if(!object(value) || (!str(value.title) && !str(value.text))) fail(where+": "+side+" wajib berupa object dengan title atau text.");
      optText(value, "label", where+"."+side, 16);
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
      if(type === "ladder") { optText(item, "value", at, 16); optBool(item, "current", at); }
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
    optText(node, "cta", where, 60);
    textList(node.options, where, "options", {min:2, max:hardCount("pollCard")});
  }
  if(type === "swipeHint") {
    optText(node, "text", where, 16);
    optEnum(node, "align", new Set(["left","center","right"]), where);
  }
  if(type === "sourceNote") {
    if(!str(node.text)) fail(where+": text wajib diisi.");
    optText(node, "text", where, charLimit("sourceNote.text")?.hard);
    optText(node, "label", where, 16);
  }
  if(type === "progressRing") {
    if(typeof node.value !== "number" || !Number.isFinite(node.value) || node.value < 0 || node.value > 100) fail(where+": value harus angka 0–100.");
    optText(node, "label", where, charLimit("progressRing.label")?.hard);
    optText(node, "note", where, charLimit("progressRing.note")?.hard);
  }

  if(type === "textBlock") {
    if(!str(node.text)) fail(where+": text wajib diisi.");
    optText(node, "text", where, charLimit("textBlock.text")?.hard);
    optText(node, "label", where, 24);
    optEnum(node, "size", new Set(["md","lg"]), where);
  }
  if(type === "footnote") textList(node.items, where, "items", {max:hardCount("footnote")});
  if(type === "glossary") {
    const limit = hardCount("glossary");
    if(!arr(node.items) || !node.items.length || node.items.length > limit) fail(where+": items harus berisi 1–"+limit+" pasangan istilah/arti.");
    node.items.forEach((item, i) => {
      const at = where+".items["+i+"]";
      if(!object(item) || !str(item.term) || !str(item.meaning)) fail(at+" harus berupa object dengan term dan meaning.");
      optText(item, "term", at, 40);
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
      optText(item, "via", at, 14);
    });
    if(node.fork !== undefined) {
      if(!arr(node.fork) || node.fork.length !== 2) fail(where+": fork harus berisi tepat 2 hasil percabangan.");
      node.fork.forEach((item, i) => {
        const at = where+".fork["+i+"]";
        if(!object(item) || !str(item.label)) fail(at+" harus berupa object dengan label.");
        optText(item, "label", at, charLimit("flow.label")?.hard);
        optText(item, "note", at, charLimit("flow.note")?.hard);
        optText(item, "via", at, 14);
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
      optText(item, "caption", at, 40);
    });
  }
  if(type === "avatarQuote") {
    if(!str(node.quote)) fail(where+": quote wajib diisi.");
    validateImageRef(node.avatar, where, "avatar");
    optText(node, "quote", where, charLimit("avatarQuote.quote")?.hard);
    optText(node, "name", where, 40);
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

  if(type === "assetIcon") {
    if(!iconPath(node.set||"lucide", node.name)) fail(where+": ikon tidak ada di Asset Library.");
    if(node.size !== undefined && !Object.prototype.hasOwnProperty.call(iconSizes, node.size)) fail(where+": ukuran ikon tidak dikenal.");
    if(node.tone !== undefined && !tones.includes(node.tone)) fail(where+": tone ikon tidak dikenal.");
    if(node.label !== undefined && typeof node.label !== "string") fail(where+": label ikon harus teks.");
  }
  if(type === "assetShape") {
    if(!shapePath(node.name)) fail(where+": dekorasi tidak ada di Asset Library.");
    if(node.position !== undefined && !shapePositions.includes(node.position)) fail(where+": posisi dekorasi tidak dikenal.");
    if(node.opacity !== undefined && !shapeOpacity.includes(node.opacity)) fail(where+": opacity dekorasi tidak dikenal.");
  }
}

function validateSlide(s, where) {
  if(!object(s) || !TYPES.has(s.type)) fail(where+": type tidak dikenal.");
  if(s.density !== undefined && !DENSITIES.has(s.density)) fail(where+": density tidak valid.");
  if(s.font !== undefined && !isFontId(s.font)) fail(where+": font harus salah satu dari "+FONT_IDS.join(", ")+".");
  if(s.theme !== undefined) {
    if(!VERTICAL_TYPES.has(s.type) || !Object.prototype.hasOwnProperty.call(backgroundThemes, s.theme)) fail(where+": theme harus dari palet Studio dan tidak tersedia untuk hero/cta.");
    if(s.type !== "freeform") {
      const wantsDark = DARK_PRESET_TYPES.has(s.type);
      if(backgroundThemes[s.theme].dark !== wantsDark) fail(where+": slide "+s.type+" memakai tema "+(wantsDark?"gelap":"terang")+" ("+Object.keys(backgroundThemes).filter(k => backgroundThemes[k].dark === wantsDark).join(", ")+").");
    }
  }
  if(s.decorations !== undefined) {
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": decorations tidak tersedia untuk slide "+s.type+".");
    if(s.decorations === "none") { /* explicit opt-out of the automatic decoration */ }
    else if(!arr(s.decorations) || s.decorations.length < 1 || s.decorations.length > 2) fail(where+": decorations harus berisi 1–2 dekorasi atau \"none\".");
    if(arr(s.decorations)) s.decorations.forEach((d, i) => {
      const at = where+".decorations["+i+"]";
      if(!object(d) || !shapePath(d.name)) fail(at+": name harus dari registry dekorasi Asset Library.");
      if(d.position !== undefined && !shapePositions.includes(d.position)) fail(at+": position harus salah satu dari "+shapePositions.join(", ")+".");
      if(d.opacity !== undefined && !shapeOpacity.includes(d.opacity)) fail(at+": opacity harus salah satu dari "+shapeOpacity.join(", ")+".");
    });
  }

  PRESET_TEXT[s.type].forEach(key => optText(s, key, where, charLimit(s.type+"."+key)?.hard));
  optText(s, "backgroundWord", where, 24);
  optText(s, "cornerLabel", where, 40);
  if(s.keywords !== undefined) textList(s.keywords, where, "keywords", {min:0, max:8});

  if(["hero","statement","bullet","compare","framework","summary","cta"].includes(s.type) && !str(s.title||s.lead)) fail(where+": title/lead wajib diisi.");
  if(s.type === "hero" && !str(s.subtitle)) fail(where+": subtitle wajib diisi.");
  if(s.type === "statement" && !str(s.highlight)) fail(where+": highlight wajib diisi.");
  if(s.type === "causeEffect") {
    if(!str(s.causeTitle) || !str(s.effectTitle)) fail(where+": causeTitle dan effectTitle wajib diisi.");
    if(s.chain !== undefined) titledList(s.chain, where, "chain", "note", {min:0, max:hardCount("causeEffect")});
  }
  if(s.type === "compare") {
    for(const side of ["left","right"]) {
      const value = s[side];
      if(!object(value)) fail(where+": "+side+" wajib berupa object.");
      optText(value, "label", where+"."+side);
      optText(value, "heading", where+"."+side);
      textList(value.points, where+"."+side, "points", {max:hardCount(s.keywords && s.keywords.length ? "compare+keywords" : "compare")});
    }
  }
  if(s.type === "bullet") titledList(s.items, where, "items", "text", {max:hardCount("bullet")});
  if(s.type === "framework") titledList(s.steps, where, "steps", "text", {max:hardCount(s.keywords && s.keywords.length ? "framework+keywords" : "framework")});
  if(s.type === "summary") textList(s.items, where, "items", {max:hardCount(s.keywords && s.keywords.length ? "summary+keywords" : "summary")});
  if(s.vertical !== undefined) {
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": vertical tidak tersedia untuk slide "+s.type+".");
    optEnum(s, "vertical", VERTICALS, where);
  }
  if(s.extras !== undefined) {
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": extras tidak tersedia untuk slide "+s.type+".");
    if(!arr(s.extras) || s.extras.length < 1 || s.extras.length > EXTRA_MAX_NODES) fail(where+": extras harus berisi 1–"+EXTRA_MAX_NODES+" blok pendukung.");
    s.extras.forEach((n, j) => {
      const at = where+".extras["+j+"]";
      if(!object(n) || !EXTRA_TYPES.has(n.type)) fail(at+": tipe extras harus salah satu dari "+[...EXTRA_TYPES].join(", ")+".");
      validateNode(n, at);
      const cap = EXTRA_LIST_MAX[n.type];
      if(cap && n.items.length > cap) fail(at+": "+n.type+" di extras maksimal "+cap+" item.");
    });
  }
  if(s.sources !== undefined) {
    if(!VERTICAL_TYPES.has(s.type)) fail(where+": sources tidak tersedia untuk slide "+s.type+".");
    textList(s.sources, where, "sources", {min:1, max:3});
    s.sources.forEach((item, i) => { if(item.length > 80) fail(where+": sources["+i+"] terlalu panjang (maksimal 80 karakter)."); });
  }
  if(s.images !== undefined) validateImages(s.images, where);
  if(s.type === "freeform") {
    optBool(s, "dark", where);
    if(!arr(s.nodes) || !s.nodes.length || s.nodes.length > 18) fail(where+": nodes harus berisi 1–18 primitive.");
    s.nodes.forEach((n, j) => validateNode(n, where+".nodes["+j+"]"));
  }
}

export function validateCarousel(value) {
  if(!object(value) || value.version !== 1) fail("Gunakan object dengan version: 1.");
  if(!object(value.meta) || !str(value.meta.title)) fail("meta.title wajib diisi.");
  if(value.meta.account !== undefined && !["journey","trader"].includes(value.meta.account)) fail("meta.account harus journey atau trader.");
  if(value.meta.font !== undefined && !isFontId(value.meta.font)) fail("meta.font harus salah satu dari "+FONT_IDS.join(", ")+".");
  META_TEXT.forEach(key => optText(value.meta, key, "meta"));
  ["hashtags","keywords"].forEach(key => {
    if(value.meta[key] !== undefined) textList(value.meta[key], "meta", key, {min:0, max:30});
  });
  if(!arr(value.slides) || value.slides.length < 1 || value.slides.length > 35) fail("slides harus berisi 1–35 slide (Instagram maks 20, TikTok maks 35).");
  value.slides.forEach((s, i) => validateSlide(s, "Slide "+String(i+1).padStart(2, "0")));
  const bytes = new TextEncoder().encode(JSON.stringify(value)).length;
  if(bytes > 180000) fail("Definisi terlalu besar (maksimal 180 KB).");
  return value;
}

export function parseCarouselSource(source) {
  if(typeof source !== "string" || source.length > 240000) fail("Input terlalu besar (maksimal 240.000 karakter).");
  let value = source.trim();
  // A complete page.jsx is supported ONLY if it contains an explicit JSON
  // data island. No eval, Function, JSX compilation, or JavaScript execution.
  const start = "/* AKSIOMA_STUDIO_JSON_START */";
  const end = "/* AKSIOMA_STUDIO_JSON_END */";
  if(value.includes(start)) {
    const a = value.indexOf(start) + start.length, b = value.indexOf(end, a);
    if(b < 0) fail("Penanda AKSIOMA_STUDIO_JSON_END tidak ditemukan.");
    value = value.slice(a, b).trim();
  } else if(!value.startsWith("{")) {
    fail("JSX lama tidak dapat dijalankan di Studio. Paste JSON atau page.jsx dengan blok AKSIOMA_STUDIO_JSON_START/END.");
  }
  let result;
  try { result = JSON.parse(value); }
  catch { fail("Format JSON tidak valid. Gunakan kutip ganda, tanpa komentar atau trailing comma di dalam blok JSON."); }
  return validateCarousel(result);
}
