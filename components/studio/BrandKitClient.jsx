"use client";

import Link from "next/link";
import {useEffect,useRef,useState} from "react";
import {DEFAULT_BRAND,normalizeBrand,resetBrand,saveBrand,useBrand} from "@/lib/studio/brand";
import {LOOK_IDS,LOOK_PRESETS} from "@/lib/studio/looks";
import {FONT_IDS,FONT_PRESETS} from "@/lib/studio/fonts";
import {downloadBlob} from "@/lib/studio/export-browser";

// Brand Kit: satu tempat untuk identitas akun. Disimpan di browser ini, dipakai oleh
// cover/CTA, caption, dan tampilan/font bawaan. Ekspor/impor JSON untuk pindah perangkat.
export default function BrandKitClient(){
  const saved=useBrand();
  const [form,setForm]=useState(saved);
  const [tags,setTags]=useState(saved.hashtags.join(" "));
  const [message,setMessage]=useState("");
  const loaded=useRef(false);
  useEffect(()=>{
    // Isi form dari penyimpanan sekali setelah hidrasi (nilai awal server = bawaan).
    if(loaded.current)return;
    loaded.current=true;
    setForm(saved);setTags(saved.hashtags.join(" "));
  },[saved]);
  const set=(patch)=>setForm(prev=>({...prev,...patch}));
  const draft=normalizeBrand({...form,hashtags:tags});
  const input="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400";

  function save(){
    try{saveBrand(draft);setMessage("Brand Kit disimpan di browser ini. Berlaku untuk semua carousel baru dan preview.");}
    catch(e){setMessage(e.message);}
  }
  function reset(){resetBrand();setForm(DEFAULT_BRAND);setTags("");setMessage("Kembali ke pengaturan bawaan.");}
  function exportKit(){downloadBlob(new Blob([JSON.stringify(draft,null,2)],{type:"application/json"}),"brand-kit.json");}
  async function importKit(event){
    const file=event.target.files?.[0];
    event.target.value="";
    if(!file)return;
    try{
      const next=normalizeBrand(JSON.parse(await file.text()));
      setForm(next);setTags(next.hashtags.join(" "));
      setMessage("Kit dimuat dari file. Tekan Simpan untuk memakainya.");
    }catch{setMessage("File bukan Brand Kit yang valid.");}
  }

  return (
    <main className="min-h-screen bg-[#eae6df] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1080px]">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">Satu kit, semua carousel konsisten.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Atur identitas akun sekali. Kit tersimpan di browser ini dan dipakai otomatis oleh cover, slide CTA, caption, serta tampilan dan font bawaan.</p>
          </div>
          <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Kembali ke Studio</Link>
        </header>

        <section className="mt-8 grid gap-6 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-8" data-panel="brand">
          <label><span className="text-sm font-semibold">Handle akun</span>
            <input value={form.handle} onChange={e=>set({handle:e.target.value})} maxLength={40} className={input} placeholder="@aksioma.trader"/></label>
          <label><span className="text-sm font-semibold">Situs</span>
            <input value={form.website} onChange={e=>set({website:e.target.value})} maxLength={60} className={input} placeholder="aksioma-trader.com"/></label>
          <label className="sm:col-span-2"><span className="text-sm font-semibold">Disclaimer</span>
            <input value={form.disclaimer} onChange={e=>set({disclaimer:e.target.value})} maxLength={140} className={input} placeholder={DEFAULT_BRAND.disclaimer}/>
            <span className="mt-1 block text-xs text-zinc-500">Maksimal 140 karakter. Tampil di slide CTA akhir dan ditambahkan ke caption bila caption belum memuat kalimat sejenis.</span></label>
          <div className="sm:col-span-2 grid gap-2 text-sm">
            {[["disclaimerOnCta","Tampilkan disclaimer di slide CTA akhir"],["disclaimerInCaption","Tambahkan disclaimer ke caption"],["sourcesInCaption","Tambahkan daftar sumber otomatis ke caption (dari sources tiap slide)"]].map(([key,label])=>
              <label key={key} className="flex min-h-11 items-center gap-3"><input type="checkbox" checked={form[key]!==false} onChange={e=>set({[key]:e.target.checked})} className="h-5 w-5"/>{label}</label>)}
          </div>
          <label className="sm:col-span-2"><span className="text-sm font-semibold">Hashtag tetap</span>
            <input value={tags} onChange={e=>setTags(e.target.value)} className={input} placeholder="aksioma saham investasi"/>
            <span className="mt-1 block text-xs text-zinc-500">Dipisah spasi atau koma, maksimal 12. Digabung dengan hashtag carousel tanpa duplikat.</span></label>

          <div><span className="text-sm font-semibold">Tampilan bawaan</span>
            <div className="mt-2 flex flex-wrap gap-2">{LOOK_IDS.map(id=><button key={id} type="button" aria-pressed={form.look===id} onClick={()=>set({look:id})} className={["min-h-11 rounded-full px-4 py-2 text-sm font-semibold",form.look===id?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>{LOOK_PRESETS[id].label}</button>)}</div>
            <span className="mt-2 block text-xs text-zinc-500">Dipakai bila carousel tidak menyebut <code>meta.look</code>.</span></div>
          <div><span className="text-sm font-semibold">Font bawaan</span>
            <div className="mt-2 flex flex-wrap gap-2">{FONT_IDS.map(id=><button key={id} type="button" aria-pressed={form.font===id} onClick={()=>set({font:id})} className={["min-h-11 rounded-full px-4 py-2 text-sm font-semibold",form.font===id?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>{FONT_PRESETS[id].label}</button>)}</div>
            <span className="mt-2 block text-xs text-zinc-500">Dipakai bila carousel tidak menyebut <code>meta.font</code>. Logo cover/CTA tetap memakai logo Aksioma.</span></div>

          <div className="sm:col-span-2 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-700" data-brand-preview="true">
            <p className="font-semibold">Pratinjau teks</p>
            <p className="mt-2">{draft.handle} • {draft.website}</p>
            {draft.disclaimer?<p className="mt-1 text-zinc-500">{draft.disclaimer}</p>:null}
            <p className="mt-1 text-xs text-zinc-500">{draft.hashtags.length?draft.hashtags.map(t=>"#"+t).join(" "):"Tanpa hashtag tetap."}</p>
          </div>

          <div className="sm:col-span-2 flex flex-wrap gap-2">
            <button type="button" onClick={save} className="min-h-11 rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">Simpan Brand Kit</button>
            <button type="button" onClick={exportKit} className="min-h-11 rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Ekspor JSON</button>
            <label className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Impor JSON<input type="file" accept="application/json,.json" onChange={importKit} className="sr-only"/></label>
            <button type="button" onClick={reset} className="min-h-11 rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50">Kembalikan bawaan</button>
          </div>
          {message?<p role="status" className="sm:col-span-2 text-sm text-emerald-800">{message}</p>:null}
        </section>
      </div>
    </main>
  );
}
