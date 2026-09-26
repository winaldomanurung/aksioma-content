"use client";

import Link from "next/link";
import {useRef,useState} from "react";
import {makeAiPrompt,starterJson} from "@/lib/studio/ai-guide";
import {copyText} from "@/lib/studio/clipboard";

export default function AITemplateClient(){
  const [topic,setTopic]=useState("");
  const [account,setAccount]=useState("journey");
  const [audience,setAudience]=useState("Young professionals");
  const [objective,setObjective]=useState("Save, share dan follow");
  const [slides,setSlides]=useState(10);
  const [feedback,setFeedback]=useState("");
  const [tab,setTab]=useState("prompt");
  const textRef=useRef(null);
  const prompt=makeAiPrompt({topic,audience,objective,slides,account});
  const content=tab==="prompt"?prompt:JSON.stringify({...JSON.parse(starterJson),meta:{...JSON.parse(starterJson).meta,account}},null,2);

  async function copy(value){
    try{
      await copyText(value,textRef.current && value===content?textRef.current:null);
      setFeedback("Berhasil disalin. Paste langsung ke ChatGPT.");
    }catch(error){
      setFeedback(error.message);
      if(value===content){
        textRef.current?.focus();
        textRef.current?.select();
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#eae6df] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1080px]">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[.22em] text-red-600">Aksioma / AI Template</p>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Sekali copy, langsung buat konten.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Isi topik, salin prompt lengkap, lalu paste ke ChatGPT. Semua aturan komponen, struktur JSON, dan contoh sudah tergabung otomatis.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/studio/assets" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Asset Library ↗</Link>
            <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">← Kembali ke Studio</Link>
          </div>
        </header>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 font-bold text-white">01</span>
            <div><h2 className="font-display text-lg font-bold">Brief konten</h2><p className="text-sm text-zinc-500">Cukup isi topik; lainnya bisa dibiarkan.</p></div>
          </div>
          <div className="mb-5 flex flex-wrap gap-2">
            {["journey","trader"].map(value=><button key={value} type="button" aria-pressed={account===value} onClick={()=>setAccount(value)}
              className={["rounded-full px-5 py-3 text-sm font-bold",account===value?(value==="trader"?"bg-blue-800 text-white":"bg-red-500 text-white"):"bg-zinc-100 text-zinc-700"].join(" ")}>
              Aksioma {value==="trader"?"Trader":"Journey"}
            </button>)}
          </div>
          <p className="mb-5 text-xs text-zinc-600">Prompt dan identitas cover/CTA mengikuti akun yang dipilih. Pilihan akun juga dapat diubah di Studio.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold">Topik carousel</span>
              <input value={topic} onChange={event=>setTopic(event.target.value)} placeholder="Contoh: Seni mengatakan tidak tanpa rasa bersalah" className="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400"/>
            </label>
            <label>
              <span className="text-sm font-semibold">Audiens</span>
              <input value={audience} onChange={event=>setAudience(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400"/>
            </label>
            <label>
              <span className="text-sm font-semibold">Tujuan post</span>
              <input value={objective} onChange={event=>setObjective(event.target.value)} className="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400"/>
            </label>
            <label>
              <span className="text-sm font-semibold">Jumlah slide</span>
              <select value={slides} onChange={event=>setSlides(Number(event.target.value))} className="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400">
                {[6,7,8,9,10,11,12].map(count=><option key={count} value={count}>{count} slide</option>)}
              </select>
            </label>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-950 font-bold text-white">02</span>
            <div><h2 className="font-display text-lg font-bold">Copy untuk ChatGPT</h2><p className="text-sm text-zinc-500">Tidak perlu membuka GitHub atau menyalin page.jsx manual.</p></div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={()=>setTab("prompt")} aria-pressed={tab==="prompt"} className={["rounded-full px-4 py-2 text-sm font-semibold",tab==="prompt"?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-600"].join(" ")}>Prompt + aturan AI</button>
            <button type="button" onClick={()=>setTab("json")} aria-pressed={tab==="json"} className={["rounded-full px-4 py-2 text-sm font-semibold",tab==="json"?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-600"].join(" ")}>Contoh JSON</button>
          </div>

          <textarea ref={textRef} aria-label="Template siap disalin" readOnly value={content} onFocus={event=>event.target.select()} className="mt-4 h-[310px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs leading-5 text-zinc-200 outline-none focus:border-red-400 sm:h-[420px]"/>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={()=>copy(content)} className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600">{tab==="prompt"?"Copy prompt lengkap":"Copy contoh JSON"}</button>
            <button type="button" onClick={()=>{textRef.current?.focus();textRef.current?.select();setFeedback("Teks dipilih. Tekan Copy/Salin melalui browser jika tombol salin diblokir.");}} className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold hover:bg-zinc-50">Pilih semua teks</button>
          </div>
          {feedback?<p role="status" className="mt-3 rounded-xl bg-zinc-100 p-3 text-sm text-zinc-700">{feedback}</p>:null}
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-[#f5f1e8] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="font-display flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-zinc-950 font-bold text-white">03</span>
            <h2 className="font-display text-lg font-bold">Paste hasil AI ke Studio</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-zinc-600">Kirim prompt yang disalin ke ChatGPT, lalu copy JSON jawaban AI. Buka Studio, paste di kolom Carousel source, pilih Render carousel, lalu unduh JPEG/ZIP.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-black/20 bg-white px-6 py-3 text-sm font-bold text-zinc-900 hover:bg-zinc-50">Buka ChatGPT ↗</a>
            <Link href="/studio" className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">Buka Carousel Studio →</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
