"use client";

import {useRef,useState} from "react";
import {StudioSlide} from "@/components/studio/StudioSlide";
import PreviewBoundary from "@/components/studio/PreviewBoundary";
import {slideToJpeg} from "@/lib/studio/export-browser";

// Renders the same slide offscreen at 1080×1350 and saves it as a JPEG.
export default function SaveImageButton({data,number=2,total=10,account="journey",platform="instagram",name="komponen"}){
  const stage=useRef(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [result,setResult]=useState(null);
  async function save(){
    if(busy)return;
    setBusy(true);setError("");
    try{
      await document.fonts.ready;
      const el=stage.current?.querySelector("[data-carousel-slide]");
      if(!el)throw new Error("Slide belum dirender.");
      const blob=await slideToJpeg(el);
      if(result?.url)URL.revokeObjectURL(result.url);
      const url=URL.createObjectURL(blob);
      const filename="aksioma-"+name+"-"+platform+".jpg";
      setResult({url,filename});
      const link=document.createElement("a");link.href=url;link.download=filename;document.body.appendChild(link);link.click();link.remove();
    }catch(e){setError(e?.message||String(e));}
    finally{setBusy(false);}
  }
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={busy} className="min-h-11 rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50">{busy?"Membuat gambar…":"Simpan sebagai gambar (JPEG)"}</button>
        {result?<a href={result.url} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-4 py-2 text-xs font-semibold">Buka gambar ↗</a>:null}
      </div>
      {error?<p role="alert" className="mt-2 text-xs text-red-800">{error}</p>:null}
      <PreviewBoundary resetKey={data} fallback={null}>
        <div ref={stage} className="carousel-stage" data-platform={platform} data-safe-area="false" aria-hidden="true"
          style={{position:"fixed",left:"-100000px",top:0,width:1080,display:"flex",gap:0,padding:0,pointerEvents:"none"}}>
          <StudioSlide data={data} number={number} total={total} account={account}/>
        </div>
      </PreviewBoundary>
    </div>
  );
}
