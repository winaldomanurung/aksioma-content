"use client";

import {useDeferredValue,useEffect,useMemo,useRef,useState,useSyncExternalStore} from "react";
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
import {updateSlideInSource,updateMetaInSource,locateInSource,slideOutline} from "@/lib/studio/source-edit";
import {lintSource} from "@/lib/studio/source-lint";
import {decodePayload,payloadFrom} from "@/lib/studio/link-codec";
import {FONT_PRESETS,FONT_IDS,DEFAULT_FONT,fontOf} from "@/lib/studio/fonts";
import {LOOK_PRESETS,LOOK_IDS,DEFAULT_LOOK,lookOf} from "@/lib/studio/looks";
import {buildTextMap} from "@/lib/studio/text-map";
import SourceEditor from "@/components/studio/SourceEditor";
import {fitWarnings} from "@/lib/studio/component-specs";
import FillHint from "./FillHint";
import QualityPanel from "./QualityPanel";
import SharePanel from "./SharePanel";
import {measureSlides,buildIssues} from "@/lib/studio/slide-metrics";
import {captionsFile} from "@/lib/studio/post-kit";
import {useBrand} from "@/lib/studio/brand";
import {ACCOUNTS,accountOf,isAccountId} from "@/lib/studio/accounts";
import {useAccount,setAccount,readAccount,ACCOUNT_EVENT} from "@/lib/studio/account-store";
import {checkNumbers} from "@/lib/studio/number-check";
import PostMetaPanel from "@/components/carousel/PostMetaPanel";
import Link from "next/link";
import Icon from "./Icon";

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

function SlidePreview({data,number,account,total,font,look,editor,textMode,index,onTextHover,onTextCommit}){
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
          <StudioSlide key={rev} data={data} number={number} account={account} total={total} font={font} look={look}/>
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
  const [platform,setPlatform]=useState("tiktok");
  const [safe,setSafe]=useState(false);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");
  const [working,setWorking]=useState(false);
  const [selected,setSelected]=useState(0);
  const [pane,setPane]=useState("preview"); // ponsel: satu panel per tab; laptop: semua panel tampil
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
  const [lint,setLint]=useState(null); // {forDoc,issues} from the last validation of the source
  const [autoCheck,setAutoCheck]=useState(false); // run the layout check once a link-imported carousel is on screen
  const quietAccount=useRef(false);
  // Carousel yang dimuat menentukan akun aktif di navigasi, tanpa menulis ulang source.
  function syncAccount(id){
    if(!isAccountId(id))return;
    quietAccount.current=true;
    try{setAccount(id);}finally{quietAccount.current=false;}
  }
  const downloadUrl=useRef(null);
  const exportStage=useRef(null);
  const editorApi=useRef(null);

  const source=edited??savedDraft??INITIAL;
  // Until something is rendered, the preview shows the saved draft (so editor
  // and preview agree after a reload), falling back to the bundled example.
  const draftPreview=useMemo(()=>{
    if(!savedDraft)return exampleCarousel;
    try{return parseCarouselSource(savedDraft);}catch{return exampleCarousel;}
  },[savedDraft]);
  const carousel=rendered??draftPreview;
  // meta.account menang; tanpa itu carousel mengikuti akun aktif di navigasi.
  const activeAccount=useAccount();
  const account=accountOf(carousel.meta.account,activeAccount);
  const brand=useBrand(account);
  // Tampilan dan font bawaan dari Brand Kit berlaku bila carousel tidak menyebut meta.look/meta.font.
  const font=fontOf(carousel.meta.font??brand.font);
  const look=lookOf(carousel.meta.look??brand.look);
  const numberIssues=useMemo(()=>checkNumbers(carousel),[carousel]);

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
    const result=lintSource(source);
    setLint({forDoc:source,issues:result.issues});
    if(result.value){
      const value=result.value;
      setRendered(value);setSelected(0);setError("");clearDownload();setCheck(null);
      syncAccount(value.meta.account);
      setStatus(value.slides.length+" slide valid. Preview diperbarui.");
      setPane("preview");
    }else{
      setError("Carousel belum bisa dirender: "+result.issues.length+" masalah ditemukan. Ketuk tiap masalah di bawah untuk melompat ke lokasinya di Carousel source.");
      setPane("source");
      setStatus("");
    }
  }

  // Live validation while typing (debounced) so problems are underlined in the
  // editor before Render is pressed.
  useEffect(()=>{
    const timer=setTimeout(()=>{const r=lintSource(source);setLint({forDoc:source,issues:r.issues});},400);
    return()=>clearTimeout(timer);
  },[source]);
  // Studio link (/studio#c=...) made by the Claude skill or /api/check: decode
  // it, put it in the editor, render it and save it as the draft, then drop
  // the hash so a reload keeps later edits instead of re-importing the link.
  useEffect(()=>{
    let cancelled=false;
    async function openLink(){
      const payload=payloadFrom(window.location.hash);
      if(!payload)return;
      try{
        const text=await decodePayload(payload);
        if(cancelled)return;
        let pretty=text;
        try{pretty=JSON.stringify(JSON.parse(text),null,2);}catch{/* invalid JSON: keep as-is so the editor marks the spot */}
        const result=lintSource(pretty);
        setEdited(pretty);
        setLint({forDoc:pretty,issues:result.issues});
        try{localStorage.setItem(DRAFT_KEY,pretty);notifyDraft();}catch{/* private browsing */}
        if(downloadUrl.current)URL.revokeObjectURL(downloadUrl.current);
        downloadUrl.current=null;setDownload(null);setExported(null);setPreflight(null);setCheck(null);
        if(result.value){
          setRendered(result.value);setSelected(0);setAllVisible(false);setError("");setAutoCheck(true);
          syncAccount(result.value.meta.account);
          setStatus("Carousel dari link dimuat: "+result.value.slides.length+" slide, tersimpan sebagai draft. Layout diperiksa otomatis.");
        }else{
          setPane("source");
          setError("Carousel dari link dimuat ke editor, tapi "+result.issues.length+" masalah perlu diperbaiki sebelum dirender. Ketuk tiap masalah untuk melompat ke lokasinya.");
          setStatus("");
        }
      }catch(e){
        if(!cancelled)setError(e?.message||"Link carousel tidak bisa dibuka.");
      }
      if(!cancelled)window.history.replaceState(null,"",window.location.pathname+window.location.search);
    }
    openLink();
    window.addEventListener("hashchange",openLink);
    return()=>{cancelled=true;window.removeEventListener("hashchange",openLink);};
  },[]);
  const issues=useMemo(()=>lint?.issues||[],[lint]);
  const diagnostics=useMemo(()=>lint?{forDoc:lint.forDoc,items:lint.issues}:null,[lint]);
  const deferredSource=useDeferredValue(source);
  const outline=useMemo(()=>slideOutline(deferredSource),[deferredSource]);
  const issuesBySlide=useMemo(()=>{const m={};for(const i of issues)if(i.slide!==null)m[i.slide]=(m[i.slide]||0)+1;return m;},[issues]);
  function gotoIssue(issue){
    setPane("source");
    editorApi.current?.reveal(issue.from,issue.to);
    document.querySelector("[data-source-editor]")?.scrollIntoView({block:"nearest",behavior:"smooth"});
    if(issue.slide!==null&&issue.slide<carousel.slides.length)openSlide(issue.slide);
  }
  function gotoSlide(index){
    editorApi.current?.revealSlide(index);
    if(index<carousel.slides.length)openSlide(index);
  }
  function cursorSlide(index){
    if(!allVisible&&index<carousel.slides.length&&index!==selected){setSelected(index);setSelectedImage(null);setLiveImages(null);}
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
  // After a link import, measure the layout once the new carousel is rendered so
  // any cut-off or empty slide shows up without pressing "Periksa sekarang".
  useEffect(()=>{
    if(!autoCheck)return;
    let cancelled=false;
    (async()=>{
      const result=await runCheck();
      if(cancelled)return;
      setAutoCheck(false);
      setCheck(result);
    })();
    return()=>{cancelled=true;};
  // eslint-disable-next-line react-hooks/exhaustive-deps -- runCheck reads the current render through refs
  },[autoCheck,carousel,platform]);
  function openSlide(index){setSelected(index);setAllVisible(false);setSelectedImage(null);setLiveImages(null);setPane("preview");}

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
        if(blocking.length){setPreflight({all,only,issues:blocking});setStatus("");setPane("export");return;}
      }
      setPreflight(null);
      const files=[];
      for(const i of indexes){
        setStatus("Export slide "+(i+1)+"/"+nodes.length+"…");
        const blob=await slideToJpeg(nodes[i]);
        const name=String(i+1).padStart(2,"0")+".jpg";
        files.push({name:platform+"/"+name,blob});
      }
      const output=all?await makeZip([...files,{name:"captions.txt",blob:new Blob([captionsFile(carousel.meta,carousel.slides,brand)],{type:"text/plain;charset=utf-8"})}]):files[0].blob;
      const filename="aksioma-"+account+"-"+slugify(carousel.meta.title)+"-"+platform+(all?".zip":"-"+files[0].name.split("/").pop());
      const url=URL.createObjectURL(output);
      downloadUrl.current=url;
      setDownload({url,filename,kind:all?"zip":"jpeg",size:output.size});
      setExported({files,platform});
      setPane("export");
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

  // Change carousel-level meta (for example the font) in the preview AND the
  // source text, the same way applySlidePatch does for one slide.
  function applyMeta(patch){
    setRendered({...carousel,meta:{...carousel.meta,...patch}});
    clearDownload();setCheck(null);
    try{setEdited(updateMetaInSource(source,patch));}
    catch(e){setError("Perubahan tampil di preview, tetapi source tidak bisa diperbarui otomatis: "+(e?.message||e));}
  }

  // Tombol Trader / Journey di navigasi juga mengganti akun carousel yang sedang
  // dibuka: meta.account ditulis ulang supaya source, preview, dan ekspor sepakat.
  function followNavAccount(id){
    if(!isAccountId(carousel.meta.account)||carousel.meta.account===id)return;
    applyMeta({account:id});
    setStatus("Akun carousel diganti ke "+ACCOUNTS[id].name+". Cover dan penutup mengikuti identitas akun ini.");
  }
  const navAccount=useRef(null);
  useEffect(()=>{navAccount.current=followNavAccount;});
  useEffect(()=>{
    const onChange=()=>{if(!quietAccount.current)navAccount.current?.(readAccount());};
    window.addEventListener(ACCOUNT_EVENT,onChange);
    // Draft tersimpan menentukan akun aktif saat Studio dibuka.
    try{const saved=JSON.parse(readDraft()||"null");if(isAccountId(saved?.meta?.account))syncAccount(saved.meta.account);}catch{/* draft bukan JSON murni */}
    return()=>window.removeEventListener(ACCOUNT_EVENT,onChange);
  },[]);

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

  const issueCount=issues.length;
  const primary="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 bg-zinc-950 text-white hover:bg-zinc-800";
  const accent="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 bg-red-600 text-white hover:bg-red-700";
  const ghost="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 border border-black/15 bg-white text-zinc-900 hover:bg-zinc-50";
  const metaLine=carousel.slides.length+" slide · "+ACCOUNTS[account].name+" · "+(platform==="tiktok"?"TikTok Photo":"Instagram")+" · 1080×1350";

  return (
    <main className="studio-main min-h-screen bg-[#ebe8e1] px-3 py-4 text-zinc-900 sm:px-6 lg:py-6">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <div className="min-w-0">
            <h1 className="font-display truncate text-xl font-bold tracking-tight sm:text-2xl">{carousel.meta.title}</h1>
            <p className="mt-1 text-sm text-zinc-600">{metaLine}</p>
            {platform==="instagram"&&carousel.slides.length>20?<p role="alert" className="mt-1 text-sm font-semibold text-amber-800">Instagram membatasi carousel maksimal 20 slide. Kurangi slide atau pilih TikTok (maks 35).</p>:null}
          </div>
          <div className="hidden gap-2 lg:flex">
            <button type="button" disabled={working} aria-busy={working} onClick={()=>exportImages(false)} className={ghost}><Icon name="download" size={16}/>Slide ini (JPEG)</button>
            <button type="button" disabled={working} aria-busy={working} onClick={()=>exportImages(true)} className={primary}><Icon name="download" size={16}/>{working?"Menyiapkan…":"Semua slide (ZIP)"}</button>
          </div>
        </header>

        <div className="studio-tabs mb-4" role="tablist" aria-label="Panel Studio">
          {[["preview","Preview","eye"],["source","Source","code"],["export","Ekspor","share"]].map(([id,label,icon])=>
            <button key={id} type="button" role="tab" id={"studio-tab-"+id} aria-selected={pane===id} aria-controls={"studio-pane-"+id} onClick={()=>setPane(id)} className="studio-tab">
              <Icon name={icon} size={16}/>{label}{id==="source"&&issueCount?<span className="studio-tab-badge" aria-label={issueCount+" masalah"}>{issueCount}</span>:null}
            </button>)}
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(360px,460px)_minmax(0,1fr)]">
          <section id="studio-pane-source" role="tabpanel" aria-labelledby="studio-tab-source" data-active={pane==="source"} className="studio-pane min-w-0 rounded-2xl border border-black/10 bg-white p-4 sm:p-5" data-panel="source">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-base font-bold">Carousel source</h2>
              <span className="text-xs font-medium text-zinc-500">JSON v1 · tidak dikirim ke server</span>
            </div>
            {outline.length?<div className="mt-3" data-slide-nav="true">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-semibold text-zinc-600" htmlFor="studio-source">Lompat ke slide</label>
                <div className="flex gap-1">
                  <button type="button" onClick={()=>editorApi.current?.foldSlides()} className="min-h-9 rounded-lg px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">Lipat semua</button>
                  <button type="button" onClick={()=>editorApi.current?.unfoldSlides()} className="min-h-9 rounded-lg px-3 text-xs font-semibold text-zinc-700 hover:bg-zinc-100">Buka semua</button>
                </div>
              </div>
              <div className="mt-1 flex gap-1.5 overflow-x-auto pb-1">
                {outline.map(s=>{const n=issuesBySlide[s.index]||0;return <button key={s.index} type="button" onClick={()=>gotoSlide(s.index)}
                  title={(s.type||"?")+(s.title?" · "+s.title:"")+(n?" · "+n+" masalah":"")} data-slide-chip={s.index}
                  className={["inline-flex min-h-10 flex-none items-center gap-1 rounded-lg border px-2.5 text-left text-xs",n?"border-red-300 bg-red-50 text-red-800":selected===s.index?"border-zinc-900 bg-zinc-900 text-white":"border-black/10 bg-zinc-50 text-zinc-700 hover:bg-white"].join(" ")}>
                  <span className="font-bold tabular-nums">{String(s.index+1).padStart(2,"0")}</span> <span className="opacity-75">{s.type||"?"}</span>{n?<><Icon name="alert" size={12}/><span className="font-bold">{n}</span></>:null}
                </button>;})}
              </div>
            </div>:null}
            <SourceEditor id="studio-source" value={source} onChange={editSource} highlight={highlight}
              diagnostics={diagnostics} onCursorSlide={cursorSlide} apiRef={editorApi}
              className="h-[52dvh] min-h-[260px] resize-y lg:h-[calc(100dvh-330px)]"
              placeholder={'{"version":1,"meta":{"title":"..."},"slides":[...]}'}/>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={render} disabled={working} className={accent+" hidden lg:inline-flex"}>Render carousel</button>
              <button type="button" onClick={saveDraft} className={ghost}>Simpan draft</button>
              <button type="button" onClick={()=>{editSource(INITIAL);setStatus("Contoh dimuat. Tekan Render carousel.");setError("");}} className={ghost}>Muat contoh</button>
              <button type="button" onClick={clearContent} disabled={working||!source.trim()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 border border-red-200 bg-white text-red-700 hover:bg-red-50">Kosongkan</button>
            </div>
            {error&&<div role="alert" className="mt-3 whitespace-pre-line rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</div>}
            {issues.length?<div className="mt-3 rounded-xl border border-red-200 bg-white" data-issue-list="true">
              <p className="border-b border-red-100 px-3 py-2 text-xs font-bold text-red-800">{issues.length} masalah di Carousel source{lint?.forDoc!==source?" (memeriksa…)":""} · ketuk untuk melompat</p>
              <ul className="max-h-72 divide-y divide-red-100 overflow-y-auto">
                {issues.map((issue,i)=><li key={i}>
                  <button type="button" onClick={()=>gotoIssue(issue)} data-issue={i} className="block min-h-11 w-full px-3 py-2 text-left hover:bg-red-50 focus:bg-red-50">
                    <span className="flex flex-wrap items-baseline justify-between gap-x-2">
                      <span className="text-xs font-bold text-zinc-900">{issue.label}</span>
                      <span className="text-xs text-zinc-600">baris {issue.line}</span>
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-red-800">{issue.message.replace(/^(Slide \d+|meta)[^:]*: /,"")}</span>
                  </button>
                </li>)}
              </ul>
            </div>:null}
            <p className="mt-4 text-sm leading-6 text-zinc-600">Belum punya JSON? Buat lewat <Link href="/studio/template" className="font-semibold text-zinc-900 underline underline-offset-4">Template AI</Link> atau <Link href="/studio/remix" className="font-semibold text-zinc-900 underline underline-offset-4">Adaptasi Konten</Link>, lalu tempel hasilnya di sini.</p>
          </section>

          <div className="min-w-0" data-panel="result">
            {status?<div role="status" className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm leading-6 text-emerald-900">{status}</div>:null}
            <section id="studio-pane-preview" role="tabpanel" aria-labelledby="studio-tab-preview" data-active={pane==="preview"} className="studio-pane" data-panel="preview">
              <div className={"studio-preview-grid"+(allVisible?" studio-preview-grid--all":"")}>
              <div className="min-w-0">
              <div className="mb-3 flex items-center gap-2">
                <button type="button" aria-label="Slide sebelumnya" disabled={allVisible||selected<=0} onClick={()=>openSlide(Math.max(0,selected-1))} className="inline-flex min-h-11 min-w-11 flex-none items-center justify-center rounded-xl bg-white text-zinc-800 disabled:opacity-30"><Icon name="chevron-left"/></button>
                <div className="min-w-0 flex-1 overflow-x-auto pb-1">
                  <div className="flex snap-x gap-1.5">
                    {carousel.slides.map((slide,i)=><button key={i} type="button" aria-label={"Slide "+(i+1)} aria-current={!allVisible&&selected===i} onClick={()=>{openSlide(i);clearDownload();}} className={["min-h-11 min-w-11 snap-start rounded-xl px-3 text-sm font-bold tabular-nums",!allVisible&&selected===i?"bg-zinc-950 text-white":"bg-white text-zinc-700 hover:bg-zinc-50"].join(" ")}>{String(i+1).padStart(2,"0")}</button>)}
                  </div>
                </div>
                <button type="button" aria-label="Slide berikutnya" disabled={allVisible||selected>=carousel.slides.length-1} onClick={()=>openSlide(Math.min(carousel.slides.length-1,selected+1))} className="inline-flex min-h-11 min-w-11 flex-none items-center justify-center rounded-xl bg-white text-zinc-800 disabled:opacity-30"><Icon name="chevron-right"/></button>
                <button type="button" onClick={()=>setAllVisible(v=>!v)} aria-pressed={allVisible} aria-label="Tampilkan semua slide" title="Tampilkan semua slide" className={["inline-flex min-h-11 min-w-11 flex-none items-center justify-center rounded-xl",allVisible?"bg-zinc-950 text-white":"bg-white text-zinc-800"].join(" ")}><Icon name="grid"/></button>
              </div>
              <PreviewBoundary resetKey={carousel}>
              <div ref={previewBox} className={"mx-auto rounded-2xl bg-zinc-300/70 p-2 sm:p-3"+(allVisible?"":" studio-preview-fit")}>
                <div className="w-full" data-platform={platform} data-safe-area={safe&&platform==="tiktok"?"true":"false"}>
                  <div className="carousel-stage !min-h-0 !gap-0 !p-0" data-platform={platform} data-safe-area={safe&&platform==="tiktok"?"true":"false"} style={{display:"block",overflow:"visible"}}>
                    {allVisible?<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{carousel.slides.map((s,i)=><div key={i} className="min-w-0"><div className="mb-2 flex items-center justify-between gap-2"><span className="text-sm font-bold tabular-nums text-zinc-700">Slide {String(i+1).padStart(2,"0")}</span><button type="button" disabled={working} onClick={()=>exportImages(false,false,i)} aria-label={"Unduh slide "+(i+1)+" sebagai JPEG"} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-zinc-900 disabled:opacity-50"><Icon name="download" size={16}/>JPEG</button></div><SlidePreview data={s} number={i+1} account={account} total={carousel.slides.length} font={font} look={look} textMode={textMode} index={i} onTextHover={hoverText} onTextCommit={commitText}/></div>)}</div>:<SlidePreview data={current} number={selected+1} account={account} total={carousel.slides.length} font={font} look={look} textMode={textMode} index={selected} onTextHover={hoverText} onTextCommit={commitText}
                      editor={{selectedId:selectedImage,onSelect:setSelectedImage,onLive:setLiveImages,onCommit:applyImages}}/>}
                  </div>
                </div>
              </div>
              </PreviewBoundary>
              {!allVisible?<FillHint containerRef={previewBox} slide={baseSlide} watch={JSON.stringify(baseSlide)+platform+safe+selected}/>:null}
              </div>
              <aside className="studio-controls" aria-label="Pengaturan tampilan" data-panel="look">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="studio-seg" role="group" aria-label="Platform">
                    <button type="button" aria-pressed={platform==="instagram"} onClick={()=>{setPlatform("instagram");setSafe(false);clearDownload();}}>Instagram</button>
                    <button type="button" aria-pressed={platform==="tiktok"} onClick={()=>{setPlatform("tiktok");clearDownload();}}>TikTok</button>
                  </div>
                  {platform==="tiktok"?<label className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-zinc-800"><input type="checkbox" checked={safe} onChange={e=>setSafe(e.target.checked)} className="h-5 w-5 accent-zinc-900"/>Safe area</label>:null}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 xl:grid-cols-1 2xl:grid-cols-2">
                  <label><span className="sr-only">Font konten</span>
                    <select data-panel="font" className="studio-select w-full" value={font} title={FONT_PRESETS[font].hint} onChange={e=>applyMeta({font:e.target.value===brand.font?undefined:e.target.value})}>
                      {FONT_IDS.map(id=><option key={id} value={id}>Font: {FONT_PRESETS[id].label}</option>)}
                    </select></label>
                  <label><span className="sr-only">Tampilan konten</span>
                    <select className="studio-select w-full" value={look} title={LOOK_PRESETS[look].hint} onChange={e=>applyMeta({look:e.target.value===brand.look?undefined:e.target.value})}>
                      {LOOK_IDS.map(id=><option key={id} value={id}>Tampilan: {LOOK_PRESETS[id].label}</option>)}
                    </select></label>
                </div>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{LOOK_PRESETS[look].hint}</p>
                <div className="mt-3">
                  <button type="button" aria-pressed={textMode} onClick={()=>{setTextMode(v=>!v);setHl(null);}} className={textMode?accent:ghost}><Icon name="pencil" size={16}/>{textMode?"Edit teks aktif":"Edit teks di slide"}</button>
                  {textMode?<p className="mt-2 text-sm leading-6 text-zinc-700">Ketuk teks di slide untuk mengubahnya. Enter menyimpan, Esc membatalkan. Carousel source ikut diperbarui.</p>:null}
                </div>
              {warnings.length?<div role="status" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                <p className="font-bold">Perkiraan konten terlalu padat (berdasarkan pengukuran layout)</p>
                <ul className="mt-1 list-disc pl-5">{warnings.map((w,i)=><li key={i}>{w}</li>)}</ul>
              </div>:null}
              {missing.length?<div role="status" className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                <p className="font-bold">Gambar tidak ditemukan di browser ini</p>
                <p>Id: {missing.join(", ")}. Unggah ulang di Perpustakaan Gambar dan pilih pada slot, atau hapus dari JSON.</p>
              </div>:null}
              {!allVisible&&slots.length?<section aria-label="Slot gambar" className="mt-4 rounded-2xl border border-black/10 bg-white p-4" data-slot-panel="true">
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
              {platform==="tiktok"?<p className="mt-3 text-sm leading-6 text-zinc-600">Safe area adalah panduan konservatif. Sebelum posting, periksa hasilnya di TikTok.</p>:null}
              </aside>
              </div>
            </section>

          </div>
            <section id="studio-pane-export" role="tabpanel" aria-labelledby="studio-tab-export" data-active={pane==="export"} className="studio-pane min-w-0 lg:col-span-2 lg:border-t lg:border-black/10 lg:pt-5" data-panel="export">
            <h2 className="font-display mb-3 hidden text-base font-bold lg:block">Ekspor dan posting</h2>
            <div className="studio-export-grid">
            {preflight?<div role="alert" className="mb-4 rounded-2xl border border-amber-300 bg-amber-50 p-4" data-preflight="true">
              <p className="font-display text-sm font-bold text-amber-900">Ekspor ditahan: {preflight.issues.length} slide terpotong</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-amber-900">{preflight.issues.map((issue,i)=><li key={i}>{issue.message}</li>)}</ul>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={()=>openSlide(preflight.issues[0].index)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 bg-amber-700 text-white">Perbaiki dulu</button>
                <button type="button" onClick={()=>exportImages(preflight.all,true,preflight.only)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 border border-amber-700 text-amber-900">Tetap ekspor</button>
              </div>
            </div>:null}
            {download ? (
              <div role="status" className="mb-4 rounded-2xl border border-emerald-300 bg-emerald-50 p-4">
                <p className="font-display text-sm font-bold text-emerald-900">File sudah selesai dibuat</p>
                <p className="mt-1 break-all text-sm text-emerald-800">{download.filename} · {(download.size/1024/1024).toFixed(1)} MB</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href={download.url} download={download.filename} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 bg-emerald-700 text-white hover:bg-emerald-800"><Icon name="download" size={16}/>Simpan file</a>
                  {download.kind==="jpeg" ? (
                    <a href={download.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 border border-emerald-700 text-emerald-900">Buka gambar<Icon name="arrow-up-right" size={16}/></a>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-emerald-900">Di iPhone, bila gambar terbuka alih-alih terunduh, tahan gambar lalu pilih Simpan ke Foto. Untuk ZIP, gunakan menu Bagikan lalu Simpan ke File. ZIP juga berisi captions.txt.</p>
              </div>
            ) : (
              <div className="mb-4 flex flex-wrap items-center gap-2 lg:hidden">
                <button type="button" disabled={working} aria-busy={working} onClick={()=>exportImages(false)} className={ghost}><Icon name="download" size={16}/>Slide {selected+1} saja (JPEG)</button>
              </div>
            )}
            <SharePanel files={exported?.files||null} meta={carousel.meta} slides={carousel.slides} platform={exported?.platform||platform} working={working} onPrepare={()=>exportImages(true)}/>
            <QualityPanel result={check} checking={checking} onCheck={checkNow} onSelect={openSlide} title={carousel.meta.title} numberIssues={numberIssues}/>
            <div><PostMetaPanel {...carousel.meta}/></div>
            </div>
            </section>
        </div>
      </div>

      {/* Ponsel: satu aksi utama per panel, selalu dalam jangkauan ibu jari. */}
      <div className="studio-actionbar">
        {pane==="source"
          ?<button type="button" onClick={render} disabled={working} className={accent}>Render carousel</button>
          :<button type="button" disabled={working} aria-busy={working} onClick={()=>exportImages(true)} className={primary}><Icon name="download" size={16}/>{working?"Menyiapkan…":"Unduh semua slide (ZIP)"}</button>}
      </div>

      {/* Export source uses unscaled, offscreen DOM. Never hide with display:none. */}
      <PreviewBoundary resetKey={carousel} fallback={null}>
      <div ref={exportStage} className="carousel-stage" data-platform={platform} data-safe-area="false" aria-hidden="true"
        style={{position:"fixed",left:"-100000px",top:0,width:1080,display:"flex",gap:0,padding:0,pointerEvents:"none"}}>
        {carousel.slides.map((s,i)=><StudioSlide key={i} data={s} number={i+1} account={account} total={carousel.slides.length} font={font} look={look}/>)}
      </div>
      </PreviewBoundary>
    </main>
  );
}
