"use client";

import {useState} from "react";
import {copyText} from "@/lib/studio/clipboard";
import {canShareFiles,captionFor,shareCarousel} from "@/lib/studio/post-kit";

// Hands the exported JPEGs and caption to the phone's share sheet (pick
// Instagram or TikTok there), or lets the person copy the caption and upload
// manually. Direct API posting needs each platform's app review, so it is not
// attempted from the browser.
export default function SharePanel({files,meta,platform,working=false,onPrepare}){
  const [message,setMessage]=useState("");
  const caption=captionFor(meta,platform);
  const asFiles=(files||[]).map(f=>new File([f.blob],f.name.split("/").pop(),{type:"image/jpeg"}));
  const shareable=canShareFiles(asFiles);
  async function share(){
    try{
      const outcome=await shareCarousel({files:asFiles,title:meta.title,text:caption});
      setMessage(outcome==="shared"?"Dibagikan. Bila caption tidak ikut terisi, tempel dari tombol Salin caption.":"Dibatalkan.");
    }catch(e){setMessage(e.message);}
  }
  async function copy(){
    try{await copyText(caption);setMessage("Caption "+(platform==="tiktok"?"TikTok":"Instagram")+" disalin.");}
    catch(e){setMessage(e.message);}
  }
  return (
    <section aria-label="Bagikan" className="mt-4 rounded-2xl border border-emerald-200 bg-white p-4" data-share-panel="true">
      <p className="font-display text-sm font-bold text-emerald-900">Posting ke {platform==="tiktok"?"TikTok":"Instagram"}</p>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-5 text-zinc-700">
        <li>Bagikan {files?files.length:"semua"} gambar langsung ke aplikasi (di ponsel), atau simpan lalu unggah manual.</li>
        <li>Salin caption dan hashtag, lalu tempel saat membuat postingan.</li>
        <li>{platform==="tiktok"?"Di TikTok pilih Photo Mode, lalu cek safe area sebelum publish.":"Di Instagram pilih Postingan → Pilih banyak, urutkan sesuai nomor slide."}</li>
      </ol>
      <div className="mt-3 flex flex-wrap gap-2">
        {!files?<button type="button" onClick={onPrepare} disabled={working} className="min-h-11 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-bold text-white hover:bg-zinc-800 disabled:opacity-50">{working?"Menyiapkan…":"1. Siapkan gambar"}</button>:null}
        <button type="button" onClick={share} disabled={!shareable||!files} className="min-h-11 rounded-full bg-emerald-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-40">{files?"Bagikan ke aplikasi":"2. Bagikan ke aplikasi"}</button>
        <button type="button" onClick={copy} className="min-h-11 rounded-full border border-emerald-700 px-5 py-2.5 text-sm font-semibold text-emerald-900">Salin caption</button>
        <a href={platform==="tiktok"?"https://www.tiktok.com/upload":"https://www.instagram.com/"} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-zinc-800">Buka {platform==="tiktok"?"TikTok":"Instagram"} ↗</a>
      </div>
      {!files?<p className="mt-2 text-xs leading-5 text-zinc-500">Tekan “Siapkan gambar” dulu; setelah selesai tombol Bagikan aktif.</p>:null}
      {files&&!shareable?<p className="mt-2 text-xs leading-5 text-zinc-500">Peramban ini belum bisa membagikan file langsung (umum di desktop). Gunakan Simpan file lalu unggah dari aplikasi.</p>:null}
      {message?<p role="status" className="mt-2 text-xs text-emerald-900">{message}</p>:null}
    </section>
  );
}
