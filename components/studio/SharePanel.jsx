"use client";

import {useState} from "react";
import {copyText} from "@/lib/studio/clipboard";
import {MAX_SHARE_FILES,canShareFiles,captionFor,shareCarousel,shareEnvironment} from "@/lib/studio/post-kit";
import {downloadBlob} from "@/lib/studio/export-browser";

// Hands the exported JPEGs and caption to the phone's share sheet (pick
// Instagram or TikTok there), or lets the person copy the caption and upload
// manually. Direct API posting needs each platform's app review, so it is not
// attempted from the browser.
export default function SharePanel({files,meta,platform,working=false,onPrepare}){
  const [message,setMessage]=useState("");
  const caption=captionFor(meta,platform);
  const asFiles=(files||[]).map(f=>new File([f.blob],f.name.split("/").pop(),{type:"image/jpeg"}));
  const tooMany=asFiles.length>MAX_SHARE_FILES;
  const shareable=!tooMany&&canShareFiles(asFiles);
  async function saveAll(){
    setDetail("");
    try{
      for(const file of asFiles){downloadBlob(file,file.name);await new Promise(resolve=>setTimeout(resolve,450));}
      setMessage(asFiles.length+" gambar diunduh. Izinkan unduhan berganda bila peramban bertanya, lalu pilih gambar dari galeri/berkas saat membuat postingan.");
    }catch(e){setMessage(e?.message||"Gagal menyimpan gambar.");}
  }
  const [detail,setDetail]=useState("");
  async function share(list=asFiles){
    try{
      setDetail("");
      const outcome=await shareCarousel({files:list,title:meta.title,text:caption});
      setMessage(outcome==="shared"?"Dibagikan. Bila caption tidak ikut terisi, tempel dari tombol Salin caption.":"Dibatalkan.");
    }catch(e){
      setMessage(e.message);
      const env=shareEnvironment();
      const hints=[];
      if(env.iframe)hints.push("halaman dibuka di dalam frame/preview");
      if(env.inApp)hints.push("sepertinya di browser dalam aplikasi (webview)");
      if(env.secure===false)hints.push("bukan koneksi HTTPS");
      setDetail((hints.length?"Kemungkinan penyebab: "+hints.join(", ")+". Buka alamat situs ini langsung di Chrome (Android) atau Safari (iPhone). ":"")+"Kode: "+(e?.name||"Error")+".");
    }
  }
  async function copy(){
    try{await copyText(caption);setMessage("Caption "+(platform==="tiktok"?"TikTok":"Instagram")+" disalin.");}
    catch(e){setMessage(e.message);}
  }
  return (
    <section aria-label="Bagikan" className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4" data-share-panel="true">
      <p className="font-display text-sm font-bold text-emerald-900">Posting ke {platform==="tiktok"?"TikTok":"Instagram"}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-5 text-zinc-700">
        <li>{tooMany?"Simpan semua gambar ke ponsel, lalu pilih dari galeri di aplikasi.":"Bagikan "+(files?files.length:"semua")+" gambar langsung ke aplikasi (di ponsel), atau simpan lalu unggah manual."}</li>
        <li>Salin caption dan hashtag, lalu tempel saat membuat postingan.</li>
        <li>{platform==="tiktok"?"Di TikTok pilih Photo Mode, lalu cek safe area sebelum publish.":"Di Instagram pilih Postingan → Pilih banyak, urutkan sesuai nomor slide."}</li>
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        {!files?<button type="button" onClick={onPrepare} disabled={working} className="min-h-11 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 disabled:opacity-50">{working?"Menyiapkan…":"1. Siapkan gambar"}</button>:null}
        <button type="button" onClick={()=>share()} disabled={!shareable||!files} className="min-h-11 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-40">{files?"Bagikan ke aplikasi":"2. Bagikan ke aplikasi"}</button>
        {files&&tooMany?<button type="button" onClick={saveAll} className="min-h-11 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800">Simpan semua gambar ↓</button>:null}
        <button type="button" onClick={copy} className="min-h-11 rounded-full border border-emerald-700 px-5 py-2.5 text-sm font-semibold text-emerald-900">Salin caption</button>
        <a href={platform==="tiktok"?"https://www.tiktok.com/upload":"https://www.instagram.com/"} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-zinc-800">Buka {platform==="tiktok"?"TikTok":"Instagram"} ↗</a>
      </div>
      {!files?<p className="mt-2 text-xs leading-5 text-zinc-500">Tekan “Siapkan gambar” dulu; setelah selesai tombol Bagikan aktif.</p>:null}
      {files&&tooMany?<p className="mt-2 text-xs leading-5 text-amber-800">Menu bagikan peramban membatasi {MAX_SHARE_FILES} file sekali kirim, sedangkan carousel ini {asFiles.length} gambar. Tekan “Simpan semua gambar”, lalu di {platform==="tiktok"?"TikTok":"Instagram"} pilih semua gambar dari galeri sesuai urutan. Atau kurangi menjadi {MAX_SHARE_FILES} slide agar bisa dibagikan langsung.</p>:null}
      {files&&!tooMany&&!shareable?<p className="mt-2 text-xs leading-5 text-zinc-500">Peramban ini belum bisa membagikan file langsung (umum di desktop). Gunakan Simpan file lalu unggah dari aplikasi.</p>:null}
      {files&&files.length>1&&!tooMany&&shareable?<div className="mt-3"><p className="text-xs font-semibold text-zinc-700">Atau bagikan satu per satu:</p><div className="mt-2 flex flex-wrap gap-2">{asFiles.map((file,i)=><button key={file.name} type="button" onClick={()=>share([file])} className="min-h-11 min-w-11 rounded-full border border-emerald-700 px-3 text-xs font-bold text-emerald-900">{i+1}</button>)}</div></div>:null}
      {message?<p role="status" className="mt-2 text-xs text-emerald-900">{message}</p>:null}
      {detail?<p className="mt-1 text-xs leading-5 text-zinc-600">{detail}</p>:null}
    </section>
  );
}
