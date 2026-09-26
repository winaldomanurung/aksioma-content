"use client";

import {useEffect,useRef,useState} from "react";
import {exampleCarousel} from "@/lib/studio/example";
import {parseCarouselSource} from "@/lib/studio/schema";
import {slideToJpeg,downloadBlob} from "@/lib/studio/export-browser";
import {makeZip} from "@/lib/studio/zip";
import {StudioSlide} from "./StudioSlide";
import PostMetaPanel from "@/components/carousel/PostMetaPanel";

const INITIAL=JSON.stringify(exampleCarousel,null,2);
const DRAFT_KEY="aksioma-studio-draft-v1";
const slugify=s=>String(s||"carousel").normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60)||"carousel";

function SlidePreview({data,number,platform}){
  const wrap=useRef(null);
  const [scale,setScale]=useState(1);
  useEffect(()=>{
    const node=wrap.current;if(!node)return;
    const update=()=>setScale(Math.min(1,Math.max(.1,node.clientWidth/1080)));
    update();
    const observer=new ResizeObserver(update);observer.observe(node);
    return()=>observer.disconnect();
  },[]);
  return(
    <div ref={wrap} className="w-full" style={{height:1350*scale}}>
      <div style={{width:1080,height:1350,transformOrigin:"top left",transform:"scale("+scale+")"}}>
        <StudioSlide data={data} number={number}/>
      </div>
    </div>
  );
}

export default function StudioClient(){
  const [source,setSource]=useState(INITIAL);
  const [carousel,setCarousel]=useState(exampleCarousel);
  const [platform,setPlatform]=useState("instagram");
  const [safe,setSafe]=useState(false);
  const [error,setError]=useState("");
  const [status,setStatus]=useState("");
  const [working,setWorking]=useState(false);
  const [selected,setSelected]=useState(0);
  const [allVisible,setAllVisible]=useState(false);
   const exportStage=useRef(null);

  useEffect(()=>{
    try{const saved=localStorage.getItem(DRAFT_KEY);if(saved)setSource(saved);}
    catch{/* private browsing */}
  },[]);

  function render(){
    try{
      const value=parseCarouselSource(source);
      setCarousel(value);setSelected(0);setError("");
      setStatus(value.slides.length+" slide valid. Preview diperbarui.");
    }catch(e){setError(e.message);setStatus("");}
  }

  function saveDraft(){
    try{localStorage.setItem(DRAFT_KEY,source);setStatus("Draft tersimpan di browser perangkat ini.");setError("");}
    catch{setError("Penyimpanan browser tidak tersedia. Salin source ke tempat lain.");}
  }

  async function exportImages(all=false){
    if(working)return;
    setWorking(true);setError("");setStatus("Menyiapkan font dan asset…");
    try{
      // Snapshot is always rendered in a real offscreen 1080x1350 frame.
      const nodes=exportStage.current?.querySelectorAll("[data-carousel-slide]");
      if(!nodes?.length)throw Error("Preview belum dirender.");
      const indexes=all?Array.from({length:nodes.length},(_,i)=>i):[Math.min(selected,nodes.length-1)];
      const files=[];
      for(const i of indexes){
        setStatus("Export slide "+(i+1)+"/"+nodes.length+"…");
        const blob=await slideToJpeg(nodes[i]);
        const name=String(i+1).padStart(2,"0")+".jpg";
        if(!all)downloadBlob(blob,slugify(carousel.meta.title)+"-"+platform+"-"+name);
        else files.push({name:platform+"/"+name,blob});
      }
      if(all){
        const zip=await makeZip(files);
        downloadBlob(zip,slugify(carousel.meta.title)+"-"+platform+".zip");
      }
      setStatus(all?"ZIP "+files.length+" JPEG siap diunduh.":"JPEG berhasil dibuat.");
    }catch(e){setError(e.message+" Jika gambar berbeda dari preview, gunakan Playwright desktop.");setStatus("");}
    finally{setWorking(false);}
  }

  const current=carousel.slides[selected]||carousel.slides[0];
  return (
    <main className="min-h-screen bg-[#ebe8e1] px-4 py-8 text-zinc-900 sm:px-7 lg:py-12">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[.2em] text-red-600">Aksioma Content Studio</p>
            <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Paste. Render. Export.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600">Buat konten tanpa commit GitHub. Editor ini menerima JSON deklaratif atau page.jsx dengan blok JSON Studio, bukan JSX bebas.</p>
          </div>
          <a className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold hover:bg-white" href="/carousel/demo">Lihat demo JSX ↗</a>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(320px,500px)_minmax(0,1fr)]">
          <section className="min-w-0 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-display text-lg font-bold">Carousel source</h2>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">JSON v1</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-zinc-500">AI dapat mengembalikan satu JSON dengan <code>meta</code> dan <code>slides</code>. Source tidak dikirim ke server.</p>
            <label className="mt-5 block text-xs font-semibold uppercase tracking-wider text-zinc-500" htmlFor="studio-source">Paste definisi carousel</label>
            <textarea id="studio-source" spellCheck={false} value={source} onChange={e=>setSource(e.target.value)}
              className="mt-2 h-[360px] w-full resize-y rounded-xl border border-black/15 bg-zinc-950 p-4 font-mono text-[12px] leading-5 text-zinc-100 outline-none focus:border-red-400 sm:h-[480px]"
              placeholder={'{"version":1,"meta":{"title":"..."},"slides":[...]}'}/>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={render} disabled={working} className="rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50">Render carousel</button>
              <button type="button" onClick={saveDraft} className="rounded-full border border-black/15 px-4 py-3 text-sm font-semibold hover:bg-zinc-50">Save draft</button>
              <button type="button" onClick={()=>{setSource(INITIAL);setStatus("Contoh dimuat. Tekan Render carousel.");setError("");}} className="rounded-full border border-black/15 px-4 py-3 text-sm font-semibold hover:bg-zinc-50">Load contoh</button>
            </div>
            {error&&<div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm leading-6 text-red-800">{error}</div>}
            {status&&<div role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">{status}</div>}
            <div className="mt-6 rounded-2xl bg-[#f5f1e8] p-4 text-sm leading-6 text-zinc-700">
              <p className="font-display font-bold">Prompt untuk AI</p>
              <p className="mt-2">“Buat carousel Aksioma 10 slide tentang [topik]. Kembalikan JSON v1 yang kompatibel dengan Studio. Gunakan tipe hero, statement, bullet, compare, causeEffect, framework, summary, cta, atau freeform dengan nodes. Sertakan metadata Instagram/TikTok.”</p>
              <button type="button" className="mt-3 font-semibold text-red-700 underline" onClick={async()=>{try{await navigator.clipboard.writeText("Buat carousel Aksioma 10 slide tentang [TOPIK]. Return hanya JSON valid versi 1 dengan meta lengkap (title, objective, contentPillar, hook, instagramCaption, tiktokCaption, cta, hashtags, keywords, notes) dan slides. Tipe slide: hero (eyebrow,title,subtitle,accent), statement (lead,highlight,note,keywords), bullet (title,items:[{title,text}]), compare (title,left/right:{label,heading,points}), causeEffect (causeTitle,causeText,effectTitle,effectText), framework (title,steps:[{title,text}]), summary (title,items), cta (title,body,cta), freeform (eyebrow,dark,backgroundWord,nodes). Tipe primitive freeform: slideHeading, infoCard, statCard, bigNumber, quoteCard, diagramNode, connector, timeline, checklist, callout, pill, keywordCluster, miniDiagram, twoColumn, threeColumn, contentGrid, stack, divider. Primitive container memakai children dan primitive konten memakai title/text/items sesuai semantik. Gunakan satu ide jelas per slide; hindari layout repetitif. Kanvas 1080x1350 untuk Instagram dan TikTok photo; safe area ditangani renderer. Jangan kirim JSX, import, markdown fence, komentar, className, atau kode JavaScript.");setStatus("Prompt disalin.");}catch{setError("Browser tidak mengizinkan clipboard.");}}}>Copy prompt</button>
            </div>
          </section>

          <section className="min-w-0">
            <div className="mb-4 rounded-[24px] border border-black/10 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-bold">{carousel.meta.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{carousel.slides.length} slide · 1080×1350 · {platform==="tiktok"?"TikTok Photo":"Instagram"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" aria-pressed={platform==="instagram"} onClick={()=>{setPlatform("instagram");setSafe(false);}} className={["rounded-full px-4 py-2 text-xs font-bold",platform==="instagram"?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>Instagram</button>
                  <button type="button" aria-pressed={platform==="tiktok"} onClick={()=>setPlatform("tiktok")} className={["rounded-full px-4 py-2 text-xs font-bold",platform==="tiktok"?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>TikTok photo</button>
                  <button type="button" disabled={platform!=="tiktok"} aria-pressed={safe} onClick={()=>setSafe(v=>!v)} className="rounded-full border border-black/10 px-4 py-2 text-xs font-bold disabled:opacity-40">Safe area {safe?"ON":"OFF"}</button>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-black/10 pt-4">
                <button type="button" disabled={working} onClick={()=>exportImages(false)} className="rounded-full border border-zinc-300 px-4 py-2.5 text-xs font-semibold hover:bg-zinc-50 disabled:opacity-50">Download current JPEG</button>
                <button type="button" disabled={working} onClick={()=>exportImages(true)} className="rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 disabled:opacity-50">{working?"Generating…":"Download all ZIP"}</button>
                <button type="button" onClick={()=>setAllVisible(v=>!v)} className="rounded-full border border-zinc-300 px-4 py-2.5 text-xs font-semibold hover:bg-zinc-50">{allVisible?"Single slide":"Show all slides"}</button>
              </div>
            </div>
            <div className="mb-4 overflow-x-auto pb-2">
              <div className="flex gap-2">
                {carousel.slides.map((slide,i)=><button key={i} type="button" onClick={()=>{setSelected(i);setAllVisible(false);}} className={["min-w-10 rounded-xl px-3 py-3 text-xs font-bold",selected===i?"bg-red-500 text-white":"bg-white text-zinc-600"].join(" ")}>{String(i+1).padStart(2,"0")}</button>)}
              </div>
            </div>
            <div className="rounded-[26px] bg-zinc-200 p-2 sm:p-5">
              <div className="w-full" data-platform={platform} data-safe-area={safe&&platform==="tiktok"?"true":"false"}>
                <div className="carousel-stage !min-h-0 !gap-0 !p-0" data-platform={platform} data-safe-area={safe&&platform==="tiktok"?"true":"false"} style={{display:"block",overflow:"visible"}}>
                  {allVisible?carousel.slides.map((s,i)=><div className="mb-5" key={i}><SlidePreview data={s} number={i+1}/></div>):<SlidePreview data={current} number={selected+1}/>}
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-zinc-500">Safe area adalah panduan konservatif. Sebelum posting, periksa hasil di TikTok. Export browser mungkin berbeda sedikit dari Playwright untuk font/efek tertentu.</p>
          </section>
        </div>
        <div className="mt-8 max-w-[1080px] overflow-x-auto rounded-[28px]">
          <PostMetaPanel {...carousel.meta}/>
        </div>
      </div>

      {/* Export source uses unscaled, offscreen DOM. Never hide with display:none. */}
      <div ref={exportStage} className="carousel-stage" data-platform={platform} data-safe-area="false" aria-hidden="true"
        style={{position:"fixed",left:"-100000px",top:0,width:1080,display:"flex",gap:0,padding:0,pointerEvents:"none"}}>
        {carousel.slides.map((s,i)=><StudioSlide key={i} data={s} number={i+1}/>)}
      </div>
    </main>
  );
}
