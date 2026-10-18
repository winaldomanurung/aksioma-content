import {iconPath,shapePath,iconSizes,tones,shapePositions,shapeOpacity,backgroundThemes} from "./assets";
import {hardCount,charLimit,containerLimits,layoutOf} from "./component-specs";
import {validateImages} from "./images";

const TYPES = new Set(["hero","statement","bullet","compare","causeEffect","framework","summary","cta","freeform"]);
const NODE_TYPES = new Set(["slideHeading","infoCard","statCard","bigNumber","quoteCard","diagramNode","connector","timeline","checklist","callout","pill","keywordCluster","miniDiagram","twoColumn","threeColumn","contentGrid","stack","divider","assetIcon","assetShape"]);
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
  if(s.theme !== undefined && (s.type !== "freeform" || !Object.prototype.hasOwnProperty.call(backgroundThemes, s.theme))) fail(where+": theme hanya tersedia untuk freeform dan harus dari palet Studio.");

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
  META_TEXT.forEach(key => optText(value.meta, key, "meta"));
  ["hashtags","keywords"].forEach(key => {
    if(value.meta[key] !== undefined) textList(value.meta[key], "meta", key, {min:0, max:30});
  });
  if(!arr(value.slides) || value.slides.length < 1 || value.slides.length > 20) fail("slides harus berisi 1–20 slide.");
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
