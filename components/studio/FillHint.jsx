"use client";

import {useEffect,useState} from "react";

// Measures how much of the content area the selected slide actually uses (real
// layout, after fonts load) and explains how to fix a half-empty slide.
// setState only happens inside an animation-frame callback.
const LAYOUT_TYPES=new Set(["bullet","compare","causeEffect","framework","summary","freeform"]);

export default function FillHint({containerRef,slide,watch}){
  const [fill,setFill]=useState(null);
  useEffect(()=>{
    let frame=0,cancelled=false;
    const run=()=>{
      if(cancelled)return;
      const root=containerRef.current?.querySelector("[data-carousel-slide]");
      const content=root?.querySelector(".slide-content");
      const body=content?.querySelector(".slide-body");
      if(!content||!body){setFill(null);return;}
      const eyebrow=content.firstElementChild!==body?content.firstElementChild.getBoundingClientRect().height:0;
      const main=content.querySelector(".slide-main")?.getBoundingClientRect().height||0;
      const extras=content.querySelector(".slide-extras")?.getBoundingClientRect().height||0;
      const total=content.getBoundingClientRect().height;
      setFill(total>0?Math.min(1,(eyebrow+main+extras)/total):null);
    };
    const start=()=>{frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(run);});};
    if(document.fonts?.ready)document.fonts.ready.then(start);else start();
    return()=>{cancelled=true;cancelAnimationFrame(frame);};
  },[containerRef,watch]);
  if(!slide||!LAYOUT_TYPES.has(slide.type)||slide.vertical==="stretch"||fill===null||fill>=0.6)return null;
  const percent=Math.round(fill*100);
  return (
    <div role="status" data-fill-hint className="mt-3 rounded-xl border border-sky-300 bg-sky-50 p-3 text-xs leading-5 text-sky-900">
      <p className="font-bold">Slide ini baru terisi sekitar {percent}% tinggi area konten</p>
      <p className="mt-1">Tambahkan <code>extras</code> (callout, sourceNote, miniDiagram, statCard) atau tambah isi utama. Atau set <code>{'"vertical": "stretch"'}</code> agar komponen mengisi sisa tinggi, atau <code>{'"spread"'}</code> agar extras menempel di bawah.</p>
    </div>
  );
}
