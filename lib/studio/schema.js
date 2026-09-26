import {iconPath,shapePath,iconSizes,tones,shapePositions,shapeOpacity,backgroundThemes} from "./assets";
const TYPES = new Set(["hero","statement","bullet","compare","causeEffect","framework","summary","cta","freeform"]);
const NODE_TYPES = new Set(["slideHeading","infoCard","statCard","bigNumber","quoteCard","diagramNode","connector","timeline","checklist","callout","pill","keywordCluster","miniDiagram","twoColumn","threeColumn","contentGrid","stack","divider","assetIcon","assetShape"]);
const DENSITIES = new Set(["airy","balanced","compact","bold"]);
const object = value => value !== null && typeof value === "object" && !Array.isArray(value);
const str = value => typeof value === "string" && value.trim().length > 0;
const arr = value => Array.isArray(value);
function fail(message) { throw new Error(message); }
function validateNode(node, where, depth=0) {
  if(depth>7) fail(where+": pohon layout terlalu dalam (maksimal 7).");
  if(!object(node) || !NODE_TYPES.has(node.type)) fail(where+": tipe primitive tidak dikenal.");
  if(["twoColumn","threeColumn","contentGrid","stack"].includes(node.type)) {
    if(!arr(node.children) || !node.children.length || node.children.length>12) fail(where+": children harus berisi 1–12 primitive.");
    node.children.forEach((child,i)=>validateNode(child,where+".children["+i+"]",depth+1));
  }
  if(["slideHeading","infoCard","diagramNode"].includes(node.type) && !str(node.title) && !str(node.text)) fail(where+": title/text wajib diisi.");
  if(["statCard","bigNumber"].includes(node.type) && !str(String(node.value??""))) fail(where+": value wajib diisi.");
  if(node.type==="assetIcon") {
    if(!iconPath(node.set||"lucide",node.name)) fail(where+": ikon tidak ada di Asset Library.");
    if(node.size!==undefined && !Object.prototype.hasOwnProperty.call(iconSizes,node.size)) fail(where+": ukuran ikon tidak dikenal.");
    if(node.tone!==undefined && !tones.includes(node.tone)) fail(where+": tone ikon tidak dikenal.");
    if(node.label!==undefined && typeof node.label!=="string") fail(where+": label ikon harus teks.");
  }
  if(node.type==="assetShape") {
    if(!shapePath(node.name)) fail(where+": dekorasi tidak ada di Asset Library.");
    if(node.position!==undefined && !shapePositions.includes(node.position)) fail(where+": posisi dekorasi tidak dikenal.");
    if(node.opacity!==undefined && !shapeOpacity.includes(node.opacity)) fail(where+": opacity dekorasi tidak dikenal.");
  }
  if(node.type==="quoteCard" && !str(node.quote)) fail(where+": quote wajib diisi.");
  if(["timeline","checklist","keywordCluster","miniDiagram"].includes(node.type) && (!arr(node.items)||!node.items.length||node.items.length>8)) fail(where+": items harus berisi 1–8 entri.");
}
export function validateCarousel(value) {
  if(!object(value)||value.version!==1) fail("Gunakan object dengan version: 1.");
  if(!object(value.meta)||!str(value.meta.title)) fail("meta.title wajib diisi.");
  if(value.meta.account!==undefined&&!["journey","trader"].includes(value.meta.account)) fail("meta.account harus journey atau trader.");
  if(!arr(value.slides)||value.slides.length<1||value.slides.length>20) fail("slides harus berisi 1–20 slide.");
  value.slides.forEach((s,i)=>{
    const where="Slide "+String(i+1).padStart(2,"0");
    if(!object(s)||!TYPES.has(s.type)) fail(where+": type tidak dikenal.");
    if(s.density!==undefined&&!DENSITIES.has(s.density)) fail(where+": density tidak valid.");
    if(s.theme!==undefined&&(s.type!=="freeform"||!Object.prototype.hasOwnProperty.call(backgroundThemes,s.theme))) fail(where+": theme hanya tersedia untuk freeform dan harus dari palet Studio.");
    if(["hero","statement","bullet","compare","framework","summary","cta"].includes(s.type) && !str(s.title||s.lead)) fail(where+": title/lead wajib diisi.");
    if(s.type==="hero"&&!str(s.subtitle)) fail(where+": subtitle wajib diisi.");
    if(s.type==="statement"&&!str(s.highlight)) fail(where+": highlight wajib diisi.");
    if(s.type==="causeEffect"&&(!str(s.causeTitle)||!str(s.effectTitle))) fail(where+": causeTitle dan effectTitle wajib diisi.");
    if(s.type==="compare"&&(!object(s.left)||!object(s.right)||!arr(s.left.points)||!arr(s.right.points))) fail(where+": left/right.points wajib array.");
    if(["bullet","framework","summary"].includes(s.type)&&(!arr(s.items||s.steps)||!(s.items||s.steps).length)) fail(where+": items/steps wajib diisi.");
    if(s.type==="freeform"){
      if(!arr(s.nodes)||!s.nodes.length||s.nodes.length>18) fail(where+": nodes harus berisi 1–18 primitive.");
      s.nodes.forEach((n,j)=>validateNode(n,where+".nodes["+j+"]"));
    }
  });
  const bytes=new TextEncoder().encode(JSON.stringify(value)).length;
  if(bytes>180000) fail("Definisi terlalu besar (maksimal 180 KB).");
  return value;
}
export function parseCarouselSource(source) {
  if(typeof source!=="string"||source.length>240000) fail("Input terlalu besar (maksimal 240.000 karakter).");
  let value=source.trim();
  // A complete page.jsx is supported ONLY if it contains an explicit JSON
  // data island. No eval, Function, JSX compilation, or JavaScript execution.
  const start="/* AKSIOMA_STUDIO_JSON_START */";
  const end="/* AKSIOMA_STUDIO_JSON_END */";
  if(value.includes(start)){
    const a=value.indexOf(start)+start.length, b=value.indexOf(end,a);
    if(b<0) fail("Penanda AKSIOMA_STUDIO_JSON_END tidak ditemukan.");
    value=value.slice(a,b).trim();
  } else if(!value.startsWith("{")) {
    fail("JSX lama tidak dapat dijalankan di Studio. Paste JSON atau page.jsx dengan blok AKSIOMA_STUDIO_JSON_START/END.");
  }
  let result;
  try { result=JSON.parse(value); }
  catch { fail("Format JSON tidak valid. Gunakan kutip ganda, tanpa komentar atau trailing comma di dalam blok JSON."); }
  return validateCarousel(result);
}
