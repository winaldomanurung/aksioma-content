"use client";

import {useMemo,useState} from "react";
import {ALL_SPECS,fitWarnings} from "@/lib/studio/component-specs";
import {validateCarousel} from "@/lib/studio/schema";
import {carouselFor,clone,isSlideSpec,nodeFor,previewPosition,previewSlideFor} from "@/lib/studio/builder";
import SpecForm from "./SpecForm";
import ScaledSlide from "./ScaledSlide";
import JsonOutput from "./JsonOutput";
import SaveImageButton from "./SaveImageButton";

export default function ComponentBuilder({name}){
  const spec=ALL_SPECS[name];
  const [data,setData]=useState(()=>clone(spec.sample));
  const [platform,setPlatform]=useState("instagram");
  const [account,setAccount]=useState("journey");
  const [safe,setSafe]=useState(false);
  const slideKind=isSlideSpec(name);

  const result=useMemo(()=>{
    const slide=previewSlideFor(name,data);
    const carousel=carouselFor(slide,"Komponen "+spec.label);
    let error="";
    try{validateCarousel(carousel);}catch(e){error=e.message;}
    return {slide,carousel,error,warnings:error?[]:fitWarnings(slide),node:slideKind?null:nodeFor(name,data)};
  },[name,data,spec.label,slideKind]);

  const pos=previewPosition(name);
  const tabs=[
    {id:"carousel",label:"Carousel 1 slide",hint:"Siap tempel: ganti seluruh isi Carousel Source dengan JSON ini lalu klik Render.",json:JSON.stringify(result.carousel,null,2)},
    {id:"slide",label:slideKind?"Slide saja":"Slide freeform",hint:"Satu objek slide. Tambahkan ke dalam array \"slides\" di Carousel Source (pisahkan dengan koma).",json:JSON.stringify(result.slide,null,2)},
  ];
  if(result.node)tabs.push({id:"node",label:"Primitive saja",hint:"Satu objek primitive. Tambahkan ke dalam array \"nodes\" pada slide freeform.",json:JSON.stringify(result.node,null,2)});

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,460px)_minmax(0,1fr)]">
      <section className="rounded-[24px] border border-black/10 bg-white p-4 sm:p-5" aria-label="Form komponen">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Form {spec.label}</h2>
          <button type="button" onClick={()=>setData(clone(spec.sample))} className="rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold">Reset contoh</button>
        </div>
        <p className="mt-1 text-xs text-zinc-500">Kolom bertanda <span className="text-red-600">*</span> wajib. Angka ideal/maks berasal dari pengukuran layout nyata.</p>
        <div className="mt-4"><SpecForm fields={spec.fields} value={data} onChange={setData}/></div>
      </section>
      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {["instagram","tiktok"].map(p=><button key={p} type="button" aria-pressed={platform===p} onClick={()=>setPlatform(p)}
            className={"rounded-full px-4 py-2 text-xs font-bold "+(platform===p?"bg-zinc-950 text-white":"bg-white text-zinc-700")}>{p==="tiktok"?"TikTok photo":"Instagram"}</button>)}
          {["journey","trader"].map(a=><button key={a} type="button" aria-pressed={account===a} onClick={()=>setAccount(a)}
            className={"rounded-full px-4 py-2 text-xs font-bold "+(account===a?"bg-red-500 text-white":"bg-white text-zinc-700")}>{a==="trader"?"Trader":"Journey"}</button>)}
          <button type="button" disabled={platform!=="tiktok"} aria-pressed={safe} onClick={()=>setSafe(v=>!v)} className="rounded-full border border-black/10 bg-white px-4 py-2 text-xs font-bold disabled:opacity-40">Safe area {safe?"ON":"OFF"}</button>
        </div>
        {result.error
          ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-800"><p className="font-bold">Belum valid</p><p>{result.error}</p></div>
          : <ScaledSlide data={result.slide} number={pos.number} total={pos.total} account={account} platform={platform} safe={safe}/>}
        {!result.error?<SaveImageButton data={result.slide} number={pos.number} total={pos.total} account={account} platform={platform} name={name}/>:null}
        {result.warnings.length?<div role="status" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-xs leading-5 text-amber-900">
          <p className="font-bold">Perkiraan terlalu padat</p><ul className="list-disc pl-5">{result.warnings.map((w,i)=><li key={i}>{w}</li>)}</ul></div>:null}
        <JsonOutput tabs={tabs}/>
      </div>
    </div>
  );
}
