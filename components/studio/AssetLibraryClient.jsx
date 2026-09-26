"use client";
import Link from "next/link";
import {useState} from "react";
import {assetCatalog,backgroundThemes,iconSets,shapeNames,assetUses,shapeUses} from "@/lib/studio/assets";
import {AssetIcon,AssetShape} from "@/components/studio/AssetPrimitives";
import {copyText} from "@/lib/studio/clipboard";

const swatches={
  paper:["#f5f1e8","#e7dcca"],ivory:["#fffdf7","#f2eee3"],
  sand:["#f8ebd8","#eedbc1"],blush:["#fff1ee","#f8dcd9"],
  peach:["#fff3df","#f9d5bf"],lemon:["#fff9cf","#f1e7ae"],
  mint:["#ecf9ed","#d6eee1"],ice:["#effbfe","#dceff6"],
  lilac:["#f8f2ff","#e9e0f9"],graphite:["#111115","#28242d"],
  midnight:["#090a10","#201d32"],navy:["#101e33","#203650"],
  forest:["#10291f","#254634"],plum:["#23172b","#43304e"],
  wine:["#361723","#63283a"],ember:["#451c13","#80371d"],
  cobalt:["#10254e","#24469a"],teal:["#0c3439","#1c5760"]
};
const backgrounds=Object.entries(backgroundThemes).map(([name,details])=>({
  type:"background",category:"background",name,...details,
  src:"theme:"+name
}));
const all=[...assetCatalog,...backgrounds];

function snippetFor(asset){
  if(asset.category==="icon")
    return {type:"assetIcon",set:asset.set,name:asset.name,size:"md",tone:"accent"};
  if(asset.category==="shape")
    return {type:"assetShape",name:asset.name,position:"topRight",opacity:"subtle"};
  return {type:"freeform",theme:asset.name,eyebrow:"Topik",nodes:[{type:"slideHeading",title:"Judul slide",body:"Isi penjelasan."}]};
}
export default function AssetLibraryClient(){
  const [filter,setFilter]=useState("all");
  const [notification,setNotification]=useState("");
  const shown=all.filter(a=>filter==="all"||a.category===filter||a.set===filter);
  async function copySnippet(asset){
    try{
      await copyText(JSON.stringify(snippetFor(asset),null,2));
      setNotification("JSON "+asset.name+" berhasil disalin.");
    }catch(error){setNotification(error.message+" Pilih potongan kode di kartu untuk salin manual.");}
  }
  return (
    <main className="min-h-screen bg-[#ece7df] px-4 py-10 text-zinc-950 sm:px-7">
      <div className="mx-auto max-w-[1280px]">
        <header className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[.2em] text-red-700">Aksioma / Asset Library</p>
            <h1 className="font-display mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Visual yang membantu bercerita.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">
              {assetCatalog.length} SVG lokal dan {backgrounds.length} background. Setiap aset memiliki saran pemakaian:
              visual memperjelas gagasan, bukan sekadar memenuhi ruang kosong.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/studio/template" className="rounded-full bg-red-600 px-5 py-3 text-sm font-bold text-white hover:bg-red-700">Buat dengan AI ↗</Link>
            <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Buka Studio ↗</Link>
          </div>
        </header>
        <div className="mt-7 flex flex-wrap items-center gap-2">
          {[
            {id:"all",label:"Semua"},
            {id:"lucide",label:"Lucide · "+iconSets.lucide.length},
            {id:"phosphor",label:"Phosphor · "+iconSets.phosphor.length},
            {id:"shape",label:"Dekorasi · "+shapeNames.length},
            {id:"background",label:"Background · "+backgrounds.length}
          ].map(item=><button key={item.id} type="button" onClick={()=>setFilter(item.id)}
            aria-pressed={filter===item.id} className={["rounded-full px-5 py-2.5 text-sm font-semibold transition",
              filter===item.id?"bg-zinc-950 text-white":"border border-black/10 bg-white text-zinc-900 hover:bg-zinc-100"].join(" ")}>{item.label}</button>)}
        </div>
        {notification?<p role="status" className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-zinc-700">{notification}</p>:null}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {shown.map(asset=>{
            const dark=asset.category==="background"&&asset.dark;
            const color=dark?"#fff":"#191919";
            const swatch=swatches[asset.name]||["#f5f1e8","#ece1d9"];
            const snippet=JSON.stringify(snippetFor(asset),null,2);
            const usage=asset.category==="background"?asset.use:
              asset.category==="shape"?shapeUses[asset.name]:assetUses[asset.name];
            return (
              <article key={asset.src} className="min-w-0 overflow-hidden rounded-[26px] border border-black/10 bg-white p-4 shadow-sm">
                <div className="relative flex h-[190px] items-center justify-center overflow-hidden rounded-[20px]"
                  style={{background:asset.category==="background"
                    ?"linear-gradient(140deg,"+swatch[0]+","+swatch[1]+")":"#f5f1e8",color}}>
                  {asset.category==="background"?
                    <div className="px-5 text-center"><span className="font-display text-3xl font-bold">{asset.label}</span>
                      <p className="mt-2 text-xs font-semibold" style={{opacity:.85}}>{dark?"Teks terang":"Teks gelap"}</p></div>
                    :asset.category==="shape"?
                    <><div className="absolute inset-0"><AssetShape name={asset.name} position="full" opacity="bold"/></div>
                      <span className="relative z-10 rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-zinc-800">SVG dekoratif</span></>
                    :<AssetIcon set={asset.set} name={asset.name} size="lg" tone="accent"/>}
                </div>
                <div className="mt-4">
                  <p className="font-display break-all text-lg font-bold text-zinc-950">{asset.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-zinc-600">
                    {asset.set|| (asset.category==="background"?"Palet kontras":"Bentuk Aksioma")}
                  </p>
                  <p className="mt-3 min-h-[44px] text-sm leading-6 text-zinc-700">
                    <strong>Gunakan untuk:</strong> {usage||"gagasan yang relevan"}
                  </p>
                </div>
                <textarea readOnly aria-label={"JSON "+asset.name}
                  value={snippet} onFocus={e=>e.target.select()}
                  className="mt-3 h-[122px] w-full resize-none rounded-xl border border-black/10 bg-[#f8f7f4] p-3 font-mono text-xs leading-5 text-zinc-800 outline-none"/>
                <button type="button" onClick={()=>copySnippet(asset)}
                  className="mt-3 w-full rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white hover:bg-zinc-800">Copy JSON</button>
              </article>
            );
          })}
        </div>
        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-6">
          <h2 className="font-display text-xl font-bold">Panduan penggunaan</h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-zinc-700">
            Ikon menyampaikan makna, dekorasi membangun suasana, dan tema menentukan kontras.
            Ikon/dekorasi ditempatkan pada <code>freeform.nodes</code>; properti
            <code> theme</code> diletakkan langsung pada slide bertipe <code>freeform</code>.
            Tema otomatis memilih warna teks terang atau gelap. Hindari menaruh dekorasi
            kuat di belakang kalimat panjang. Semua file SVG tersedia lokal, bukan dari CDN.
          </p>
          <p className="mt-3 text-xs leading-6 text-zinc-600">
            Lucide ISC · Phosphor MIT · dekorasi SVG orisinal Aksioma. Hasil JPEG tetap perlu diperiksa
            pada browser yang digunakan sebelum dipublikasikan.
          </p>
        </section>
      </div>
    </main>
  );
}
