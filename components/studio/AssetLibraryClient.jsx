"use client";

import Link from "next/link";
import {useState} from "react";
import {assetCatalog,iconSets,shapeNames} from "@/lib/studio/assets";
import {AssetIcon,AssetShape} from "@/components/studio/AssetPrimitives";
import {copyText} from "@/lib/studio/clipboard";

const snippetFor=asset=>asset.category==="icon"
  ? {type:"assetIcon",set:asset.set,name:asset.name,size:"md",tone:"accent",label:""}
  : {type:"assetShape",name:asset.name,position:"topRight",opacity:"subtle"};

export default function AssetLibraryClient(){
  const [filter,setFilter]=useState("all");
  const [notification,setNotification]=useState("");
  const shown=assetCatalog.filter(a=>filter==="all"||a.category===filter||a.set===filter);
  async function copySnippet(asset){
    try{
      await copyText(JSON.stringify(snippetFor(asset),null,2));
      setNotification("JSON "+asset.name+" berhasil disalin.");
    }catch(error){
      setNotification(error.message+" Pilih potongan kode di kartu untuk menyalin manual.");
    }
  }
  return (
    <main className="min-h-screen bg-[#ece7df] px-4 py-10 text-zinc-950 sm:px-7">
      <div className="mx-auto max-w-[1200px]">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[.2em] text-red-600">Aksioma / Asset Library</p>
            <h1 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Visual assets, siap pakai.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-600">
              {assetCatalog.length} SVG lokal: Lucide outline, Phosphor duotone, dan dekorasi geometris khas Aksioma.
              Setiap aset sudah terdaftar di validator Studio; AI cukup memakai nama yang ada di katalog.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/studio/template" className="rounded-full bg-red-500 px-5 py-3 text-sm font-bold text-white hover:bg-red-600">Buat dengan AI ↗</Link>
            <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Buka Studio ↗</Link>
          </div>
        </header>

        <div className="mt-7 flex flex-wrap items-center gap-2">
          {[
            {id:"all",label:"Semua"},
            {id:"lucide",label:"Lucide · "+iconSets.lucide.length},
            {id:"phosphor",label:"Phosphor · "+iconSets.phosphor.length},
            {id:"shape",label:"Dekorasi · "+shapeNames.length},
          ].map(item=>(
            <button key={item.id} type="button" onClick={()=>setFilter(item.id)} aria-pressed={filter===item.id}
              className={["rounded-full px-5 py-2.5 text-sm font-semibold transition",
              filter===item.id?"bg-zinc-950 text-white":"border border-black/10 bg-white hover:bg-zinc-100"].join(" ")}>
              {item.label}
            </button>
          ))}
        </div>
        {notification?<p className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-zinc-700" role="status">{notification}</p>:null}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(asset=>(
            <article key={asset.src} className="min-w-0 overflow-hidden rounded-[28px] border border-black/10 bg-white p-4 shadow-sm">
              <div className="relative flex h-[230px] items-center justify-center overflow-hidden rounded-[22px] bg-[#f5f1e8]">
                {asset.category==="shape"
                  ? <><div className="absolute inset-0 scale-105"><AssetShape name={asset.name} position="full" opacity="bold"/></div><div className="relative z-10 rounded-full bg-white/85 px-4 py-2 text-xs font-bold text-zinc-700">SVG dekoratif</div></>
                  : <AssetIcon set={asset.set} name={asset.name} size="lg" tone="accent"/>}
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display break-all text-lg font-bold">{asset.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{asset.set||"Aksioma Shapes"}</p>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">{asset.category==="icon"?"Ikon":"Dekorasi"}</span>
              </div>
              <div className="mt-4 rounded-xl border border-black/10 bg-[#f8f7f4] p-3">
                <textarea readOnly aria-label={"JSON "+asset.name}
                  value={JSON.stringify(snippetFor(asset),null,2)}
                  onFocus={event=>event.target.select()}
                  className="h-[145px] w-full resize-none bg-transparent font-mono text-xs leading-5 text-zinc-700 outline-none"/>
              </div>
              <button type="button" onClick={()=>copySnippet(asset)}
                className="mt-4 w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800">Copy JSON</button>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Cara menggunakan</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
            Aset ditempatkan sebagai primitive di dalam <code>freeform.nodes</code>.
            Gunakan <code>assetIcon</code> untuk simbol informatif dan <code>assetShape</code>
            untuk dekorasi yang tidak menghalangi judul atau body. Semua file disimpan
            di folder publik repo agar preview dan export tidak bergantung pada CDN.
            Contoh dan pilihan aset juga otomatis disertakan dalam prompt di halaman Template AI.
          </p>
          <p className="mt-3 text-xs leading-6 text-zinc-500">
            Ikon Lucide: lisensi ISC. Ikon Phosphor: MIT. Dekorasi SVG: komposisi orisinal Aksioma, bergaya bentuk generatif; bukan file yang diekspor dari Haikei.
          </p>
        </section>
      </div>
    </main>
  );
}
