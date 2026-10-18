"use client";

import {useEffect,useMemo,useRef,useState,useSyncExternalStore} from "react";
import {exampleCarousel} from "@/lib/studio/example";
import {parseCarouselSource} from "@/lib/studio/schema";
import {slideToJpeg} from "@/lib/studio/export-browser";
import {makeZip} from "@/lib/studio/zip";
import {StudioSlide} from "./StudioSlide";
import PreviewBoundary from "./PreviewBoundary";
import ImageEditorOverlay from "./ImageEditorOverlay";
import ImageToolbar from "./ImageToolbar";
import ImageLibrary from "./ImageLibrary";
import ImagePicker from "./ImagePicker";
import {collectImageIds,listImageSlots,setAtPath} from "@/lib/studio/images";
import {useImageLibrary} from "@/lib/studio/image-store";
import {updateSlideInSource,locateInSource} from "@/lib/studio/source-edit";
import {buildTextMap} from "@/lib/studio/text-map";
import SourceEditor from "@/components/studio/SourceEditor";
import {fitWarnings} from "@/lib/studio/component-specs";
import FillHint from "./FillHint";
import QualityPanel from "./QualityPanel";
import SharePanel from "./SharePanel";
import {measureSlides,buildIssues} from "@/lib/studio/slide-metrics";
import {captionsFile} from "@/lib/studio/post-kit";
import PostMetaPanel from "@/components/carousel/PostMetaPanel";
import Link from "next/link";

const INITIAL=JSON.stringify(exampleCarousel,null,2);
const DRAFT_KEY="aksioma-studio-draft-v1";
const slugify=s=>String(s||"carousel").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"carousel";

// The saved draft lives in localStorage, an external store. It is read with
// useSyncExternalStore so the server render and first client render agree and
// the saved draft appears after hydration without setState inside an effect.
const draftListeners=new Set();
const readDraft=()=>{try{return localStorage.getItem(DRAFT_KEY);}catch{return null;}};
const subscribeDraft=callback=>{
  draftListeners.add(callback);
  window.addEventListener("storage",callback);
  return()=>{draftListeners.delete(callback);window.removeEventListener("storage",callback);};
};
const notifyDraft=()=>draftListeners.forEach(callback=>callback());

function SlidePreview({data,number,account,total,editor,textMode,index,onTextHover,onTextCommit}){
  const wrap=useRef(null);
  const root=useRef(null);
  const map=useRef(new Map());
  const hoverEl=useRef(null);
  const editing=useRef(null);
  const [scale,setScale]=useState(1);
  const [rev,setRev]=useState(0);
  const [box,setBox]=useState(null);
  const textOn=Boolean(textMode);
  useEffect(()=>{
    const node=wrap.current;if(!node)return;
    const update=()=>setScale(Math.min(1,Math.max(.1,node.clientWidth/1080)));
    update();
    const observer=new ResizeObserver(update);observer.observe(node);
    return()=>observer.disconnect();
  },[]);
  useEffect(()=>{
    map.current=textOn?buildTextMap(root.current?.querySelector("[data-carousel-slide]"),data):new Map();
    hoverEl.current=null;
  },[data,textOn,rev]);

  const findMapped=target=>{
    for(let node=target;node&&node!==root.current;node=node.parentElement){if(map.current.has(node))return node;}
    return null;
  };
  const rectOf=el=>{
    const a=el.getBoundingClientRect(),b=root.current.getBoundingClientRect(),k=scale||1;
    return {x:(a.left-b.left)/k,y:(a.top-b.top)/k,w:a.width/k,h:a.height/k};
  };
  function hover(e){
    if(!textOn||editing.current)return;
    const el=findMapped(e.target);
    if(el===hoverEl.current)return;
    hoverEl.current=el;
    if(el){setBox({...rectOf(el),editing:false});onTextHover(index,map.current.get(el));}
    else{setBox(null);onTextHover(index,null);}
  }
  function leave(){
    if(editing.current)return;
    hoverEl.current=null;setBox(null);if(textOn)onTextHover(index,null);
  }
  function start(e){
    if(!textOn||editing.current)return;
    const el=findMapped(e.target);if(!el)return;
    e.preventDefault();e.stopPropagation();
    const path=map.current.get(el),original=el.textContent;
    editing.current=el;hoverEl.current=el;
    onTextHover(index,path);
    setBox({...rectOf(el),editing:true});
    el.contentEditable="plaintext-only";
    if(el.contentEditable!=="plaintext-only")el.contentEditable="true";
    el.style.outline="none";el.style.cursor="text";
    el.focus();
    const selection=window.getSelection();
    if(selection){const range=document.createRange();range.selectNodeContents(el);selection.removeAllRanges();selection.addRange(range);}
    let done=false;
    const finish=save=>{
      if(done)return;done=true;
      el.removeEventListener("blur",onBlur);el.removeEventListener("keydown",onKey);
      const next=el.textContent.replace(/\s*\n+\s*/g," ").trim();
      editing.current=null;hoverEl.current=null;setBox(null);onTextHover(index,null);
      el.contentEditable="false";
      setRev(r=>r+1); // remount the slide so React owns the DOM again
      if(save&&next&&next!==original.trim())onTextCommit(index,path,next);
    };
    const onBlur=()=>finish(true);
    const onKey=ev=>{
      if(ev.key==="Enter"){ev.preventDefault();finish(true);}
      else if(ev.key==="Escape"){ev.preventDefault();finish(false);}
    };
    el.addEventListener("blur",onBlur);el.addEventListener("keydown",onKey);
  }
  return(
    <div ref={wrap} className="w-full" style={{height:1350*scale}}>
      <div style={{width:1080,height:1350,transformOrigin:"top left",transform:"scale("+scale+")"}}>
        <div ref={root} data-text-edit={textOn?"on":"off"} style={{position:"relative",width:1080,height:1350,cursor:textOn?"pointer":undefined}}
          onPointerMove={textOn?hover:undefined} onPointerLeave={textOn?leave:undefined} onClick={textOn?start:undefined}>
          <StudioSlide key={rev} data={data} number={number} account={account} total={total}/>
          {box?<div data-text-highlight={box.editing?"editing":"hover"} style={{position:"absolute",left:box.x-6,top:box.y-4,width:box.w+12,height:box.h+8,borderRadius:8,pointerEvents:"none",zIndex:60,
            outline:(box.editing?"4px solid #ef4444":"3px dashed #ef4444"),background:box.editing?"rgba(239,68,68,.10)":"rgba(239,68,68,.14)"}}/>:null}
          {editor&&data.images?.length?<ImageEditorOverlay images={data.images} scale={scale} selectedId={editor.selectedId}
            onSelect={editor.onSelect} onLive={editor.onLive} onCommit={editor.onCommit}/>:null}
        </div>
      </div>
    </div>
  );
}

export default function StudioClient(){
  const savedDraft=useSyncExternalStore(subscribeDraft,readDraft,()=>null);
  const [edited,setEdited]=useState(null);       // null until the editor is touched
  const [rendered,setRendered]=useState(null);   // null until a carousel is rendered
  const [accountChoice,setAccountChoice]=useState(null); // null = follow meta.account
  const [platform,setPlatform]=useState("tiktok");
  const [safe,setSafe]=useState(false);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");
  const [working,setWorking]=useState(false);
  const [selected,setSelected]=useState(0);
  const [allVisible,setAllVisible]=useState(false);
  const [selectedImage,setSelectedImage]=useState(null);
  const [textMode,setTextMode]=useState(false);
  const [hl,setHl]=useState(null); // {index,path} of the preview text under the pointer
  const [liveImages,setLiveImages]=useState(null);
  const [download,setDownload]=useState(null);
  const [check,setCheck]=useState(null);
  const [checking,setChecking]=useState(false);
  const [preflight,setPreflight]=useState(null);
  const [exported,setExported]=useState(null);
  const downloadUrl=useRef(null);
  const exportStage=useRef(null);

  const source=edited??savedDraft??INITIAL;
  // Until something is rendered, the preview shows the saved draft (so editor
  // and preview agree after a reload), falling back to the bundled example.
  const draftPreview=useMemo(()=>{
    if(!savedDraft)return exampleCarousel;
    try{return parseCarouselSource(savedDraft);}catch{return exampleCarousel;}
  },[savedDraft]);
  const carousel=rendered??draftPreview;
  const account=accountChoice??(carousel.meta.account==="trader"?"trader":"journey");

  useEffect(()=>()=>{if(downloadUrl.current)URL.revokeObjectURL(downloadUrl.current);},[]);

  // Edit the source without the preview jumping to a different carousel:
  // pin whatever is currently shown the first time the text changes.
  function editSource(value){
    if(rendered===null)setRendered(carousel);
    setEdited(value);
  }

  function clearDownload(){
    if(downloadUrl.current)URL.revokeObjectURL(downloadUrl.current);
    downloadUrl.current=null;
    setDownload(null);
    setExported(null);
    setPreflight(null);
  }

  function render(){
    try{
      const value=parseCarouselSource(source);
      setRendered(value);setSelected(0);setError("");clearDownload();setCheck(null);
      if(value.meta.account==="journey"||value.meta.account==="trader")setAccountChoice(null);
      setStatus(value.slides.length+" slide valid. Preview diperbarui untuk Aksioma "+(value.meta.account==="trader"?"Trader":"Journey")+".");
    }catch(e){setError(e.message);setStatus("");}
  }

  function saveDraft(){
    try{localStorage.setItem(DRAFT_KEY,source);notifyDraft();setStatus("Draft tersimpan di browser perangkat ini.");setError("");}
    catch{setError("Penyimpanan browser tidak tersedia. Salin source ke tempat lain.");}
  }

  function clearContent(){
    if(working||!source.trim())return;
    try{localStorage.removeItem(DRAFT_KEY);notifyDraft();}
    catch{/* private browsing */}
    editSource("");
    setError("");
    clearDownload();
    setStatus("Editor dikosongkan. Preview terakhir tetap terlihat sampai carousel baru dirender.");
  }

  async function runCheck(){
    try{await document.fonts?.ready;}catch{/* fonts API unavailable */}
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const metrics=measureSlides(exportStage.current);
    return {issues:buildIssues(carousel.slides,metrics,platform),metrics,platform};
  }
  async function checkNow(){
    setChecking(true);
    try{setCheck(await runCheck());}finally{setChecking(false);}
  }
  function openSlide(index){setSelected(index);setAllVisible(false);setSelectedImage(null);setLiveImages(null);}

  async function exportImages(all=false,force=false,only=null){
    if(working)return;
    setWorking(true);setError("");setStatus("Menyiapkan font dan asset…");clearDownload();
    try{
      // Snapshot is always rendered in a real offscreen 1080x1350 frame.
      const nodes=exportStage.current?.querySelectorAll("[data-carousel-slide]");
      if(!nodes?.length)throw Error("Preview belum dirender.");
      const indexes=only!==null?[Math.min(only,nodes.length-1)]:all?Array.from({length:nodes.length},(_,i)=>i):[Math.min(selected,nodes.length-1)];
      if(!force){
        // Preflight: stop when content would be clipped in the exported image.
        const result=await runCheck();
        setCheck(result);
        const blocking=result.issues.filter(i=>i.severity==="overflow"&&indexes.includes(i.index));
        if(blocking.length){setPreflight({all,only,issues:blocking});setStatus("");return;}
      }
      setPreflight(null);
      const files=[];
      for(const i of indexes){
        setStatus("Export slide "+(i+1)+"/"+nodes.length+"…");
        const blob=await slideToJpeg(nodes[i]);
        const name=String(i+1).padStart(2,"0")+".jpg";
        files.push({name:platform+"/"+name,blob});
      }
      const output=all?await makeZip([...files,{name:"captions.txt",blob:new Blob([captionsFile(carousel.meta)],{type:"text/plain;charset=utf-8"})}]):files[0].blob;
      const filename="aksioma-"+account+"-"+slugify(carousel.meta.title)+"-"+platform+(all?".zip":"-"+files[0].name.split("/").pop());
      const url=URL.createObjectURL(output);
      downloadUrl.current=url;
      setDownload({url,filename,kind:all?"zip":"jpeg",size:output.size});
      setExported({files,platform});
      setStatus(all?"ZIP "+files.length+" JPEG selesai. Ketuk Simpan file di bawah.":"JPEG selesai. Ketuk Simpan file di bawah.");
    }catch(e){setError((e?.message || String(e))+" Jika export browser gagal, coba Chrome/Edge desktop atau gunakan Playwright lokal.");setStatus("");}
    finally{setWorking(false);}
  }

  const previewBox=useRef(null);
  const library=useImageLibrary();
  const baseSlide=carousel.slides[selected]||carousel.slides[0];
  const currentImages=baseSlide.images||[];
  const current=liveImages?{...baseSlide,images:liveImages}:baseSlide;
  const warnings=fitWarnings(baseSlide);

  // Commit a change to one slide (image overlay edit, slot assignment): update
  // the preview AND the source text.
  function applySlidePatch(patch,at=selected){
    setLiveImages(null);
    const index=Math.min(at,carousel.slides.length-1);
    const nextCarousel={...carousel,slides:carousel.slides.map((slide,i)=>{
      if(i!==index)return slide;
      const next={...slide};
      for(const [key,value] of Object.entries(patch)){
        if(value===undefined||(Array.isArray(value)&&!value.length))delete next[key];else next[key]=value;
      }
      return next;
    })};
    setRendered(nextCarousel);
    clearDownload();
    try{setEdited(updateSlideInSource(source,index,patch));}
    catch(e){setError("Perubahan tampil di preview, tetapi source tidak bisa diperbarui otomatis: "+(e?.message||e));}
  }
  const applyImages=list=>applySlidePatch({images:list});
  function assignSlot(path,id){
    const next=setAtPath(baseSlide,path,id);
    applySlidePatch({[path[0]]:next[path[0]]});
  }
  function commitText(index,path,text){
    const slide=carousel.slides[index];if(!slide)return;
    applySlidePatch({[path[0]]:setAtPath(slide,path,text)[path[0]]},index);
    setStatus("Teks diperbarui di preview dan Carousel source.");
  }
  const hoverText=(index,path)=>setHl(path?{index,path}:null);
  const highlight=useMemo(()=>hl?locateInSource(source,["slides",hl.index,...hl.path]):null,[hl,source]);
  const slots=listImageSlots(baseSlide);
  const missing=library.loaded?collectImageIds(baseSlide).filter(id=>!library.rows.some(r=>r.id===id)):[];

  return (
    <main className="min-h-screen bg-[#ebe8e1] px-4 py-6 text-zinc-900 sm:px-7 lg:py-12">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[.2em] text-red-600">Aksioma Content Studio</p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Paste. Render. Export.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Buat konten tanpa commit GitHub. Editor ini menerima JSON deklaratif atau page.jsx dengan blok JSON Studio, bukan JSX bebas.</p>
          </div>
          <a className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold hover:bg-white" href="/carousel/demo">Lihat demo JSX ↗</a>
        </header>

        <section className="mb-6 rounded-[24px] border border-black/10 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div><p className="font-display text-sm font-bold">Pilih akun konten</p><p className="mt-1 text-xs text-zinc-500">Satu editor, dua identitas visual. Slide pembuka dan penutup mengikuti akun yang dipilih.</p></div>
            <div className="flex flex-wrap gap-2">
              {["journey","trader"].map(value=><button key={value} type="button" aria-pressed={account===value}
                onClick={()=>{setAccountChoice(value);clearDownload();}}
                className={["rounded-full px-5 py-3 text-sm font-bold",account===value?(value==="trader"?"bg-blue-800 text-white":"bg-red-500 text-white"):"bg-zinc-100 text-zinc-700"].join(" ")}>
                Aksioma {value==="trader"?"Trader":"Journey"}
              </button>)}
            </div>
          </div>
        </section>
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(320px,500px)_minmax(0,1fr)]">
          <section className="min-w-0 rounded-[28px] border border-black/10 bg-white p-4 shadow-sm sm:p-6" data-panel="source">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">Carousel source</h2>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">JSON v1</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">AI dapat mengembalikan satu JSON dengan <code>meta</code> dan <code>slides</code>. Source tidak dikirim ke server.</p>
            <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="studio-source">Paste definisi carousel</label>
            <SourceEditor id="studio-source" value={source} onChange={editSource} highlight={highlight}
              className="h-[46vh] min-h-[260px] sm:h-[480px]"
              placeholder={'{"version":1,"meta":{"title":"..."},"slides":[...]}'}/>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={render} disabled={working} className="rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50">Render carousel</button>
              <button type="button" onClick={saveDraft} className="rounded-full border border-black/15 px-4 py-3 text-sm font-semibold hover:bg-zinc-50">Save draft</button>
              <button type="button" onClick={()=>{editSource(INITIAL);setStatus("Contoh dimuat. Tekan Render carousel.");setError("");}} className="rounded-full border border-black/15 px-4 py-3 text-sm font-semibold hover:bg-zinc-50">Load contoh</button>
              <button type="button" onClick={clearContent} disabled={working||!source.trim()} className="rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40">Hapus konten</button>
            </div>
            {error&&<div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</div>}
            {status&&<div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{status}</div>}
            <div className="mt-6 rounded-2xl bg-[#f5f1e8] p-4 text-sm text-zinc-700">
              <p className="font-display font-bold">Buat konten baru dengan AI</p>
              <p className="mt-2 leading-6">Tak perlu copy source dari GitHub. Isi topik di halaman Template AI, lalu salin prompt lengkap dengan satu tombol.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link href="/studio/template" className="inline-flex rounded-full bg-zinc-950 px-5 py-3 font-semibold text-white hover:bg-zinc-800">Buka Template AI →</Link>
                <Link href="/studio/assets" className="inline-flex rounded-full border border-black/15 bg-white px-5 py-3 font-semibold text-zinc-900 hover:bg-zinc-50">Lihat Asset Library ↗</Link>
              </div>
            </div>
          </section>

          <section className="min-w-0" data-panel="result">
            <div className="mb-4 rounded-[24px] border border-black/10 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold">{carousel.meta.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{carousel.slides.length} slide · Aksioma {account==="trader"?"Trader":"Journey"} · 1080×1350 · {platform==="tiktok"?"TikTok Photo":"Instagram"}</p>
                  {platform==="instagram"&&carousel.slides.length>20?<p role="alert" className="mt-1 text-xs font-semibold text-amber-800">Instagram membatasi carousel maksimal 20 slide. Kurangi slide atau pilih TikTok (maks 35).</p>:null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" aria-pressed={platform==="instagram"} onClick={()=>{setPlatform("instagram");setSafe(false);clearDownload();}} className={["min-h-11 rounded-full px-4 py-2 text-xs font-bold",platform==="instagram"?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>Instagram</button>
                  <button type="button" aria-pressed={platform==="tiktok"} onClick={()=>{setPlatform("tiktok");clearDownload();}} className={["min-h-11 rounded-full px-4 py-2 text-xs font-bold",platform==="tiktok"?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>TikTok photo</button>
                  <button type="button" disabled={platform!=="tiktok"} aria-pressed={safe} onClick={()=>setSafe(v=>!v)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold disabled:opacity-40">Safe area {safe?"ON":"OFF"}</button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
                <button type="button" disabled={working} aria-busy={working} onClick={()=>exportImages(false)} className="min-h-11 rounded-full border border-zinc-300 px-4 py-2.5 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-50">Generate JPEG</button>
                <button type="button" disabled={working} aria-busy={working} onClick={()=>exportImages(true)} className="min-h-11 rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50">{working?"Generating…":"Generate all ZIP"}</button>
                <button type="button" onClick={()=>setAllVisible(v=>!v)} className="min-h-11 rounded-full border border-zinc-300 px-4 py-2.5 text-xs font-semibold hover:bg-zinc-50">{allVisible?"Single slide":"Show all slides"}</button>
              </div>
            </div>
            <div className="mb-4" data-panel="export">
            {preflight?<div role="alert" className="mt-4 rounded-[24px] border border-amber-300 bg-amber-50 p-4" data-preflight="true">
              <p className="font-display text-sm font-bold text-amber-900">Export ditahan: {preflight.issues.length} slide terpotong</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-5 text-amber-900">{preflight.issues.map((issue,i)=><li key={i}>{issue.message}</li>)}</ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={()=>openSlide(preflight.issues[0].index)} className="min-h-11 rounded-full bg-amber-700 px-5 py-2.5 text-xs font-bold text-white">Perbaiki dulu</button>
                <button type="button" onClick={()=>exportImages(preflight.all,true,preflight.only)} className="min-h-11 rounded-full border border-amber-700 px-5 py-2.5 text-xs font-semibold text-amber-900">Tetap export</button>
              </div>
            </div>:null}
            {download ? (
              <div role="status" className="mt-4 rounded-[24px] border border-emerald-300 bg-emerald-50 p-4">
                <p className="font-display text-sm font-bold text-emerald-900">File sudah selesai dibuat</p>
                <p className="mt-1 break-all text-xs text-emerald-800">{download.filename} · {(download.size/1024/1024).toFixed(1)} MB</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={download.url} download={download.filename}
                    className="inline-flex rounded-full bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">Simpan file ↓</a>
                  {download.kind==="jpeg" ? (
                    <a href={download.url} target="_blank" rel="noreferrer"
                      className="inline-flex rounded-full border border-emerald-700 px-5 py-3 text-sm font-semibold text-emerald-900">Buka gambar ↗</a>
                  ) : null}
                </div>
                <p className="mt-3 text-xs leading-5 text-emerald-900">Di iPhone, bila gambar terbuka alih-alih terunduh, tahan gambar lalu pilih Simpan ke Foto. Untuk ZIP, gunakan menu Bagikan → Simpan ke File. ZIP juga berisi captions.txt.</p>
              </div>
            ) : null}
            <SharePanel files={exported?.files||null} meta={carousel.meta} platform={exported?.platform||platform} working={working} onPrepare={()=>exportImages(true)}/>
            <QualityPanel result={check} checking={checking} onCheck={checkNow} onSelect={openSlide} title={carousel.meta.title}/>
            </div>
            <div data-panel="preview">
            <div className="mb-4 flex items-center gap-2">
              <button type="button" aria-label="Slide sebelumnya" disabled={selected<=0} onClick={()=>openSlide(Math.max(0,selected-1))} className="min-h-11 min-w-11 flex-none rounded-full bg-white text-lg font-bold text-zinc-700 disabled:opacity-30">‹</button>
              <div className="min-w-0 flex-1 overflow-x-auto pb-1">
                <div className="flex snap-x gap-2">
                  {carousel.slides.map((slide,i)=><button key={i} type="button" aria-label={"Slide "+(i+1)} aria-current={selected===i} onClick={()=>{openSlide(i);clearDownload();}} className={["min-h-11 min-w-11 snap-start rounded-xl px-3 py-3 text-xs font-bold",selected===i?"bg-red-500 text-white":"bg-white text-zinc-600"].join(" ")}>{String(i+1).padStart(2,"0")}</button>)}
                </div>
              </div>
              <button type="button" aria-label="Slide berikutnya" disabled={selected>=carousel.slides.length-1} onClick={()=>openSlide(Math.min(carousel.slides.length-1,selected+1))} className="min-h-11 min-w-11 flex-none rounded-full bg-white text-lg font-bold text-zinc-700 disabled:opacity-30">›</button>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <button type="button" aria-pressed={textMode} onClick={()=>{setTextMode(v=>!v);setHl(null);}}
                className={["min-h-11 rounded-full px-4 py-2 text-xs font-bold",textMode?"bg-red-500 text-white":"bg-white text-zinc-700"].join(" ")}>✎ Edit teks di preview: {textMode?"aktif":"mati"}</button>
              {textMode?<p className="min-w-0 flex-1 text-xs leading-5 text-zinc-600">Arahkan atau ketuk teks untuk menyorotnya di Carousel source. Klik untuk mengedit, Enter menyimpan, Esc membatalkan.</p>:null}
            </div>
            <PreviewBoundary resetKey={carousel}>
            <div ref={previewBox} className="rounded-[26px] bg-zinc-200 p-2 sm:p-5">
              <div className="w-full" data-platform={platform} data-safe-area={safe&&platform==="tiktok"?"true":"false"}>
                <div className="carousel-stage !min-h-0 !gap-0 !p-0" data-platform={platform} data-safe-area={safe&&platform==="tiktok"?"true":"false"} style={{display:"block",overflow:"visible"}}>
                  {allVisible?carousel.slides.map((s,i)=><div className="mb-5" key={i}><div className="mb-2 flex items-center justify-between gap-2"><span className="text-xs font-bold text-zinc-600">Slide {String(i+1).padStart(2,"0")}</span><button type="button" disabled={working} onClick={()=>exportImages(false,false,i)} className="min-h-11 rounded-full bg-white px-4 py-2 text-xs font-semibold text-zinc-800 disabled:opacity-50">Simpan gambar slide ini</button></div><SlidePreview data={s} number={i+1} account={account} total={carousel.slides.length} textMode={textMode} index={i} onTextHover={hoverText} onTextCommit={commitText}/></div>):<SlidePreview data={current} number={selected+1} account={account} total={carousel.slides.length} textMode={textMode} index={selected} onTextHover={hoverText} onTextCommit={commitText}
                    editor={{selectedId:selectedImage,onSelect:setSelectedImage,onLive:setLiveImages,onCommit:applyImages}}/>}
                </div>
              </div>
            </div>
            </PreviewBoundary>
            {!allVisible?<FillHint containerRef={previewBox} slide={baseSlide} watch={JSON.stringify(baseSlide)+platform+safe+selected}/>:null}
            {warnings.length?<div role="status" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <p className="font-bold">Perkiraan konten terlalu padat (berdasarkan pengukuran layout)</p>
              <ul className="mt-1 list-disc pl-5">{warnings.map((w,i)=><li key={i}>{w}</li>)}</ul>
            </div>:null}
            {missing.length?<div role="status" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              <p className="font-bold">Gambar tidak ditemukan di browser ini</p>
              <p>Id: {missing.join(", ")}. Unggah ulang di Perpustakaan Gambar dan pilih pada slot, atau hapus dari JSON.</p>
            </div>:null}
            {!allVisible&&slots.length?<section aria-label="Slot gambar" className="mt-4 rounded-[20px] border border-black/10 bg-white p-4" data-slot-panel="true">
              <p className="font-display text-sm font-bold">Slot gambar di slide ini</p>
              <ul className="mt-3 space-y-3">
                {slots.map((slot,i)=><li key={slot.path.join(".")+i} className="grid gap-1 sm:grid-cols-[140px_1fr] sm:items-center">
                  <span className="text-xs font-semibold text-zinc-600">{slot.label}</span>
                  <ImagePicker label={"Gambar untuk "+slot.label} value={slot.id} onChange={id=>assignSlot(slot.path,id)}/>
                </li>)}
              </ul>
            </section>:null}
            {!allVisible?<div className="mt-4"><ImageToolbar images={currentImages} selectedId={selectedImage} onSelect={setSelectedImage} onChange={applyImages}/></div>:null}
            {!allVisible?<div className="mt-4"><ImageLibrary/></div>:null}
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-500">Safe area adalah panduan konservatif. Sebelum posting, periksa hasil di TikTok. Export browser mungkin berbeda sedikit dari Playwright untuk font/efek tertentu.</p>
          </section>
        </div>
        <div className="mx-auto mt-8 w-full max-w-[1080px]">
          <PostMetaPanel {...carousel.meta}/>
        </div>
      </div>

      {/* Export source uses unscaled, offscreen DOM. Never hide with display:none. */}
      <PreviewBoundary resetKey={carousel} fallback={null}>
      <div ref={exportStage} className="carousel-stage" data-platform={platform} data-safe-area="false" aria-hidden="true"
        style={{position:"fixed",left:"-100000px",top:0,width:1080,display:"flex",gap:0,padding:0,pointerEvents:"none"}}>
        {carousel.slides.map((s,i)=><StudioSlide key={i} data={s} number={i+1} account={account} total={carousel.slides.length}/>)}
      </div>
      </PreviewBoundary>
    </main>
  );
}
