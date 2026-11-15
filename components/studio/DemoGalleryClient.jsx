"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import {StudioSlide} from "./StudioSlide";
import {CONTENT_PRESETS,PRESET_PAGES} from "@/lib/studio/presets";
import {LOOK_IDS,LOOK_PRESETS} from "@/lib/studio/looks";
import {fontOf} from "@/lib/studio/fonts";
import {useBrand} from "@/lib/studio/brand";

const DRAFT_KEY="aksioma-studio-draft-v1";
const ORDER=["scorecard","perbandingan","swing","broker","edukasi"];

// Slide 1080x1350 yang diperkecil dengan skala CSS; DOM dan gaya sama dengan preview dan export.
function Scaled({data,number,total,look,font,width}){
  return (
    <div style={{width,height:width*1350/1080,position:"relative",overflow:"hidden"}}>
      <div style={{width:1080,height:1350,transformOrigin:"top left",transform:"scale("+width/1080+")"}}>
        <StudioSlide data={data} number={number} total={total} font={font} look={look}/>
      </div>
    </div>
  );
}

function Lightbox({item,onClose}){
  const ref=useRef(null);
  const [w,setW]=useState(640);
  useEffect(()=>{
    const fit=()=>setW(Math.max(280,Math.min(720,window.innerWidth-32,(window.innerHeight-90)*1080/1350)));
    fit();window.addEventListener("resize",fit);
    const key=e=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",key);
    ref.current?.focus();
    return()=>{window.removeEventListener("resize",fit);window.removeEventListener("keydown",key);};
  },[onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Slide diperbesar" onClick={onClose} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div onClick={e=>e.stopPropagation()} className="relative">
        <button ref={ref} type="button" onClick={onClose} className="absolute -top-12 right-0 min-h-11 rounded-full bg-white px-5 py-2 text-sm font-bold text-zinc-900">Tutup</button>
        <Scaled {...item} width={w}/>
      </div>
    </div>
  );
}

export default function DemoGalleryClient(){
  const router=useRouter();
  const brand=useBrand();
  const [look,setLook]=useState(null);
  const [open,setOpen]=useState(null);
  const activeLook=look??brand.look;
  const font=fontOf(brand.font);
  const closeBox=()=>setOpen(null);

  function openInStudio(example){
    try{
      const json=JSON.stringify({...example,meta:{...example.meta,...(activeLook==="classic"?{}:{look:activeLook})}},null,2);
      localStorage.setItem(DRAFT_KEY,json);
    }catch{}
    router.push("/studio");
  }

  return (
    <main className="min-h-screen bg-[#eae6df] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Hasil jadi tiap jenis konten.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Contoh nyata dari setiap preset, dirender dengan komponen yang sama seperti preview dan export. Ganti tampilan, ketuk slide untuk memperbesar, atau buka di Studio untuk diubah.</p>
          </div>
          <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Kembali ke Studio</Link>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Tampilan contoh" data-demo-looks="true">
          <span className="mr-1 text-sm font-semibold">Tampilan:</span>
          {LOOK_IDS.map(id=><button key={id} type="button" aria-pressed={activeLook===id} onClick={()=>setLook(id)}
            className={["min-h-11 rounded-full px-5 py-2 text-sm font-bold",activeLook===id?"bg-zinc-950 text-white":"bg-white text-zinc-700"].join(" ")}>{LOOK_PRESETS[id].label}</button>)}
        </div>

        {ORDER.map(id=>{
          const preset=CONTENT_PRESETS[id];
          const page=PRESET_PAGES[id];
          const ex=preset.example;
          const total=ex.slides.length;
          return (
            <section key={id} className="mt-10 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-7" data-demo={id}>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold">{preset.label}</h2>
                  <p className="mt-1 text-sm text-zinc-600">{preset.summary} {total} slide.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={()=>openInStudio(ex)} className="min-h-11 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800">Buka di Studio</button>
                  <Link href={page.href} className="inline-flex min-h-11 items-center rounded-full border border-black/15 bg-white px-5 py-2.5 text-sm font-bold hover:bg-zinc-50">Buat dengan AI</Link>
                </div>
              </div>
              <div className="mt-5 flex gap-4 overflow-x-auto pb-3" tabIndex={0} aria-label={"Slide contoh "+preset.label}>
                {ex.slides.map((s,i)=>(
                  <button key={i} type="button" onClick={()=>setOpen({data:s,number:i+1,total,look:activeLook==="classic"?null:activeLook,font})}
                    aria-label={"Perbesar slide "+(i+1)} className="flex-none rounded-xl border border-black/10 shadow-sm">
                    <Scaled data={s} number={i+1} total={total} look={activeLook==="classic"?null:activeLook} font={font} width={280}/>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      {open?<Lightbox item={open} onClose={closeBox}/>:null}
    </main>
  );
}
