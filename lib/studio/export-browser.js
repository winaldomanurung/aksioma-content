// Prefer a locally bundled browser rasterizer. No runtime CDN or npm install.
// The legacy SVG exporter below remains a fallback for differing browser engines.
let rasterizerPromise=null;
function loadRasterizer(){
  if(typeof window==="undefined")return Promise.reject(new Error("Exporter hanya tersedia di browser."));
  if(window.domtoimage?.toJpeg)return Promise.resolve(window.domtoimage);
  if(!rasterizerPromise){
    rasterizerPromise=new Promise((resolve,reject)=>{
      const tag=document.createElement("script");
      tag.src="/vendor/dom-to-image.min.js";
      tag.async=true;
      tag.onload=()=>window.domtoimage?.toJpeg
        ?resolve(window.domtoimage)
        :reject(new Error("Library JPEG tidak dimuat."));
      tag.onerror=()=>reject(new Error("File exporter lokal gagal dimuat."));
      document.head.appendChild(tag);
    }).catch(e=>{rasterizerPromise=null;throw e;});
  }
  return rasterizerPromise;
}
async function imageToJpegWithLibrary(element,quality){
  const domtoimage=await loadRasterizer();
  const jpeg=await domtoimage.toJpeg(element,{
    quality,
    width:1080,
    height:1350,
    bgcolor:"#ffffff",
    filter(node){return !node.classList?.contains("tiktok-safe-overlay");}
  });
  if(typeof jpeg!=="string"||!jpeg.startsWith("data:image/jpeg"))throw Error("Hasil exporter tidak valid.");
  const blob=await (await fetch(jpeg)).blob();
  if(blob.size<2500)throw Error("JPEG kosong atau berukuran terlalu kecil.");
  return blob;
}
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
  // Next/font can put @font-face inside @layer or @media; traverse groups.
  async function collect(rules){
    for(const rule of rules){
      if(rule.type===CSSRule.FONT_FACE_RULE){
        fontRules.push(await embedUrls(rule.cssText));
      }else if(rule.cssRules){
        try{await collect(rule.cssRules);}catch{/* Cross-origin stylesheet. */}
      }
    }
  }
  for(const sheet of document.styleSheets){
    try{await collect(sheet.cssRules);}catch{/* Cross-origin stylesheet. */}
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
async function slideToJpegSvgFallback(element,{quality=.95}={}){
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
  // XMLSerializer escapes font declarations safely. Avoid raw <style>
  // concatenation, which could produce malformed SVG on CSS edge cases.
  const serializer=new XMLSerializer();
  const html=document.createElement("div");
  html.setAttribute("xmlns","http://www.w3.org/1999/xhtml");
  html.style.width=width+"px";
  html.style.height=height+"px";
  html.style.margin="0";
  const style=document.createElement("style");
  style.textContent=fontCSS;
  html.appendChild(style);
  html.appendChild(clone);
  const serialized=serializer.serializeToString(html);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+width+'" height="'+height+'" viewBox="0 0 '+width+' '+height+'"><foreignObject width="100%" height="100%">'+serialized+'</foreignObject></svg>';
  const blob=new Blob([svg],{type:"image/svg+xml;charset=utf-8"});
  const objectURL=URL.createObjectURL(blob);
  try{
    const image=new Image();
    await new Promise((resolve,reject)=>{
      image.onload=resolve;image.onerror=()=>reject(new Error("Browser tidak dapat merender SVG ke JPEG. Coba Chrome/Edge terbaru, atau gunakan exporter Playwright lokal."));
      image.src=objectURL;
    });
    const canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;
    const context=canvas.getContext("2d");
    if(!context)throw new Error("Canvas tidak tersedia di browser ini.");
    context.drawImage(image,0,0,width,height);
    // Empty SVG/foreignObject rasterizations should not be offered as JPEGs.
    const pixel=context.getImageData(Math.floor(width/2),Math.floor(height/2),1,1).data;
    if(pixel[3]===0)throw new Error("Render gambar kosong. Browser ini tidak mendukung metode export DOM yang digunakan.");
    return await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("Konversi JPEG gagal: browser mungkin memblokir asset/font SVG.")),"image/jpeg",quality));
  } finally {URL.revokeObjectURL(objectURL);}
}
export function downloadBlob(blob,name){
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");link.href=url;link.download=name;
  document.body.appendChild(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),30000);
}

export async function slideToJpeg(element,{quality=.95}={}){
  if(!element)throw new Error("Slide tidak ditemukan.");
  await document.fonts.ready;
  if(Math.round(element.offsetWidth)!==1080||Math.round(element.offsetHeight)!==1350){
    throw new Error("Ukuran slide harus tepat 1080×1350.");
  }
  // Preload all local images before serializing the DOM.
  await Promise.all([...element.querySelectorAll("img")].map(async img=>{
    if(!img.complete)await new Promise(resolve=>{
      img.addEventListener("load",resolve,{once:true});
      img.addEventListener("error",resolve,{once:true});
    });
    if(img.complete&&img.naturalWidth===0)throw new Error("Asset gambar tidak ditemukan: "+img.src);
  }));
  let firstError;
  try{return await imageToJpegWithLibrary(element,quality);}
  catch(error){firstError=error;}
  try{return await slideToJpegSvgFallback(element,{quality});}
  catch(error){
    throw new Error(
      "Dua metode export gagal. Primary: "+(firstError?.message||firstError)+
      ". Fallback: "+(error?.message||error)+
      ". Gunakan Chrome/Edge terbaru; Safari dapat memblokir SVG foreignObject."
    );
  }
}
