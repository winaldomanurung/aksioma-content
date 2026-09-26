// Browser-side export. Uses SVG foreignObject and native Canvas; no server,
// arbitrary code execution, or external package. Chromium browsers support
// this best. Safari may refuse foreignObject or embedded fonts.
function dataUrl(blob){
  return new Promise((resolve,reject)=>{
    const r=new FileReader();r.onload=()=>resolve(r.result);
    r.onerror=()=>reject(new Error("Gagal membaca asset"));r.readAsDataURL(blob);
  });
}
const assetCache=new Map();
async function inlineUrl(url){
  if(!url||url.startsWith("data:"))return url;
  if(assetCache.has(url))return assetCache.get(url);
  const task=(async()=>{
    const response=await fetch(url,{credentials:"same-origin"});
    if(!response.ok)throw new Error("Asset tidak tersedia: "+url);
    return dataUrl(await response.blob());
  })();
  assetCache.set(url,task);
  return task;
}
async function embedUrls(value){
  const matches=[...value.matchAll(/url\(\s*(['"]?)([^)'"]+)\1\s*\)/g)];
  let next=value;
  for(const match of matches){
    try{
      const embedded=await inlineUrl(new URL(match[2],document.baseURI).href);
      next=next.replace(match[0],'url("'+embedded+'")');
    }catch{ /* If asset fails, keep original; canvas may reject cross origin. */ }
  }
  return next;
}
async function embedFonts(){
  const fontRules=[];
  for(const sheet of document.styleSheets){
    let rules;try{rules=sheet.cssRules;}catch{continue;}
    for(const rule of rules){
      if(rule.type===CSSRule.FONT_FACE_RULE){
        const css=await embedUrls(rule.cssText);
        fontRules.push(css);
      }
    }
  }
  return fontRules.join("\n");
}
async function copyComputedStyles(source,target){
  const computed=getComputedStyle(source);
  let css="";
  for(const prop of computed){
    let value=computed.getPropertyValue(prop);
    if(value.includes("url("))value=await embedUrls(value);
    css+=prop+":"+value+";";
  }
  target.setAttribute("style",css);
  if(source instanceof HTMLImageElement){
    try{target.setAttribute("src",await inlineUrl(source.currentSrc||source.src));}
    catch{/* Asset unavailable; the eventual canvas error will be reported. */}
  }
  if(source instanceof HTMLCanvasElement){
    try{
      const image=document.createElement("img");
      image.src=source.toDataURL("image/png");
      image.setAttribute("style",css);
      target.replaceWith(image);
      return;
    }catch{/* Tainted source canvas cannot be cloned. */}
  }
  // Recurse FIRST while source and clone have matching child indexes.
  const from=Array.from(source.children);
  const to=Array.from(target.children);
  for(let i=0;i<from.length;i++){
    await copyComputedStyles(from[i],to[i]);
  }
  // Then re-create CSS pseudo-elements (rails, markers, decorative lines).
  const pseudo=async(which)=>{
    const p=getComputedStyle(source,which);
    if(!p||p.content==="none"||p.content==="normal"||p.content==="")return;
    const span=document.createElement("span");
    let styles="";
    for(const prop of p){
      if(prop==="content")continue;
      let value=p.getPropertyValue(prop);
      if(value.includes("url("))value=await embedUrls(value);
      styles+=prop+":"+value+";";
    }
    const raw=p.content;
    span.textContent=/^['"]/.test(raw)?raw.slice(1,-1):"";
    span.setAttribute("style",styles+"pointer-events:none;");
    if(which==="::before")target.prepend(span);else target.append(span);
  };
  await pseudo("::before");
  await pseudo("::after");
}
export async function slideToJpeg(element,{quality=.95}={}){
  if(!element)throw new Error("Slide tidak ditemukan.");
  await document.fonts.ready;
  const width=1080,height=1350;
  if(Math.round(element.offsetWidth)!==width||Math.round(element.offsetHeight)!==height){
    throw new Error("Canvas harus 1080×1350 sebelum export.");
  }
  const clone=element.cloneNode(true);
  // Safe area is a preview guide only, never export it.
  // Match all source descendants before removing preview-only decorations.
  await copyComputedStyles(element,clone);
  clone.querySelectorAll(".tiktok-safe-overlay").forEach(node=>node.remove());
  clone.style.transform="none";clone.style.margin="0";
  clone.style.width=width+"px";clone.style.height=height+"px";
  const fontCSS=await embedFonts();
  const serializer=new XMLSerializer();
  const serialized=serializer.serializeToString(clone);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml"><style>'+fontCSS.replace(/<\/style/gi,"<\\/style")+'</style>'+serialized+'</div></foreignObject></svg>';
  const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
  const objectURL=URL.createObjectURL(blob);
  try{
    const image=new Image();
    await new Promise((resolve,reject)=>{
      image.onload=resolve;image.onerror=()=>reject(new Error("Browser tidak dapat merender slide ke JPEG. Coba Chrome/Edge desktop atau exporter Playwright."));
      image.src=objectURL;
    });
    const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
    const context=canvas.getContext("2d");
    if(!context)throw new Error("Canvas tidak tersedia di browser ini.");
    context.drawImage(image,0,0,width,height);
    return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Konversi JPEG gagal: browser mungkin memblokir asset/font SVG.")),"image/jpeg",quality));
  } finally {URL.revokeObjectURL(objectURL);}
}
export function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");link.href=url;link.download=name;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}
