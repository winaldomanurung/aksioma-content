"use client";

import {useState} from "react";
import {IMAGE_SPEC} from "@/lib/studio/component-specs";
import {carouselFor,clone} from "@/lib/studio/builder";
import ImageToolbar from "@/components/studio/ImageToolbar";
import ImageLibrary from "@/components/studio/ImageLibrary";
import ScaledSlide from "./ScaledSlide";
import SaveImageButton from "./SaveImageButton";
import JsonOutput from "./JsonOutput";

// Playground for the image tool: upload, drag, resize, pick a shape, copy JSON.
const BASE={type:"statement",eyebrow:"GAMBAR SENDIRI",lead:"Letakkan fotomu di atas desain,",highlight:"geser dan atur ukurannya.",note:"Gambar tersimpan di browser ini dan ikut ter-export ke JPEG."};

export default function ImageBuilder(){
  const [images,setImages]=useState([]);
  const [selectedId,setSelectedId]=useState(null);
  const [live,setLive]=useState(null);
  const [platform,setPlatform]=useState("instagram");
  const shown=live||images;
  const slide={...clone(BASE),...(shown.length?{images:shown}:{})};
  const output=images.length?{...clone(BASE),images}:{...clone(BASE),images:IMAGE_SPEC.sample.images};
  const commit=list=>{setImages(list);setLive(null);};
  const tabs=[
    {id:"images",label:"images saja",hint:"Tambahkan properti \"images\" ke slide mana pun di Carousel Source. Id harus sama dengan gambar yang diunggah di browser ini.",json:JSON.stringify({images:output.images},null,2)},
    {id:"slide",label:"Contoh slide",hint:"Slide statement lengkap dengan images.",json:JSON.stringify(output,null,2)},
    {id:"carousel",label:"Carousel 1 slide",hint:"Siap tempel di Carousel Source.",json:JSON.stringify(carouselFor(output,"Contoh gambar sendiri"),null,2)},
  ];
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(300px,460px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <ImageToolbar images={images} selectedId={selectedId} onSelect={setSelectedId} onChange={commit}/>
        <ImageLibrary/>
        <div className="rounded-[20px] border border-black/10 bg-white p-4 text-xs leading-5 text-zinc-600">
          <p className="font-bold text-zinc-800">Cara pakai di Carousel Source</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Upload gambar dan atur di sini, atau langsung di halaman Studio (toolbar di bawah preview).</li>
            <li>Salin JSON <code>images</code> ke slide yang diinginkan.</li>
            <li>Render di Studio pada browser yang sama agar gambar ditemukan.</li>
          </ol>
        </div>
      </div>
      <div className="min-w-0 space-y-4">
        <div className="flex gap-2">
          {["instagram","tiktok"].map(p=><button key={p} type="button" aria-pressed={platform===p} onClick={()=>setPlatform(p)}
            className={"rounded-full px-4 py-2 text-xs font-bold "+(platform===p?"bg-zinc-950 text-white":"bg-white text-zinc-700")}>{p==="tiktok"?"TikTok photo":"Instagram"}</button>)}
        </div>
        <ScaledSlide data={slide} number={2} total={10} account="journey" platform={platform}
          editor={{selectedId,onSelect:setSelectedId,onLive:setLive,onCommit:commit}}/>
        <SaveImageButton data={slide} number={2} total={10} account="journey" platform={platform} name="gambar-pengguna"/>
        <JsonOutput tabs={tabs}/>
      </div>
    </div>
  );
}
