"use client";

import Link from "next/link";
import {useRef,useState} from "react";
import {makeAiPrompt,starterJsonFor,STYLE_PRESETS} from "@/lib/studio/ai-guide";
import {ACCOUNTS} from "@/lib/studio/accounts";
import {useAccount} from "@/lib/studio/account-store";
import {CONTENT_PRESETS,PRESET_PAGES} from "@/lib/studio/presets";
import {LOOK_PRESETS,LOOK_IDS,DEFAULT_LOOK} from "@/lib/studio/looks";
import {useBrand} from "@/lib/studio/brand";
import {copyText} from "@/lib/studio/clipboard";

// `preset` mengunci jenis konten (halaman khusus di menu bar); "bebas" = Template AI umum.
export default function AITemplateClient({preset="bebas"}){
  const page=PRESET_PAGES[preset]||null;
  const [topicText,setTopic]=useState("");
  const [fields,setFields]=useState({});
  const [notes,setNotes]=useState("");
  const topic=page?(page.topic(fields)+(notes.trim()?"\n"+notes.trim():"")):topicText;
  // Kerangka baku (halaman khusus) semuanya untuk konten saham, jadi selalu akun Trader.
  const active=useAccount();
  const account=page?"trader":active;
  const [audiencePick,setAudience]=useState(null);
  const audience=audiencePick??ACCOUNTS[account].audience;
  const [objective,setObjective]=useState("Save, share dan follow");
  const [slides,setSlides]=useState("auto");
  const [style,setStyle]=useState("seimbang");
  const brand=useBrand(account);
  const [lookPick,setLook]=useState(null);
  const look=lookPick??brand.look;
  const [feedback,setFeedback]=useState("");
  const [tab,setTab]=useState("prompt");
  const textRef=useRef(null);
  const prompt=makeAiPrompt({topic,audience,objective,slides,account,style,preset,look});
  const content=tab==="prompt"?prompt:starterJsonFor(account);

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
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-5xl">{page?page.title:"Sekali copy, langsung buat konten."}</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">{page?page.lead:"Isi topik, salin prompt lengkap, lalu paste ke ChatGPT. Semua aturan komponen, struktur JSON, dan contoh sudah tergabung otomatis."}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/studio/assets" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Asset Library</Link>
            <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">Kembali ke Studio</Link>
          </div>
        </header>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <span className="font-display flex h-10 w-10 items-center justify-center rounded-xl bg-red-600 font-bold text-white">01</span>
            <div><h2 className="font-display text-lg font-bold">Brief konten</h2><p className="text-sm text-zinc-500">Cukup isi topik; lainnya bisa dibiarkan.</p></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {page?(
              <>
                {page.fields.map(f=>(
                  <label key={f.key}>
                    <span className="text-sm font-semibold">{f.label}</span>
                    <input value={fields[f.key]||""} onChange={event=>setFields(prev=>({...prev,[f.key]:event.target.value}))} placeholder={f.placeholder} autoCapitalize="characters" className="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base uppercase outline-none placeholder:normal-case focus:border-red-400"/>
                  </label>
                ))}
                <label className="sm:col-span-2">
                  <span className="text-sm font-semibold">Catatan atau sumber data (opsional)</span>
                  <textarea value={notes} onChange={event=>setNotes(event.target.value)} rows={3} placeholder="Contoh: pakai data penutupan 16 Okt 2026 dari laporan kuartalan; fokus ke valuasi." className="mt-2 w-full resize-y rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400"/>
                </label>
                <div className="sm:col-span-2 rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                  <p className="font-semibold text-zinc-800">Kerangka baku: {CONTENT_PRESETS[preset].summary}</p>
                  {CONTENT_PRESETS[preset].data?<p className="mt-1 text-xs leading-5">Data yang perlu disiapkan: {CONTENT_PRESETS[preset].data.join("; ")}.</p>:null}
                </div>
              </>
            ):(
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold">Topik carousel</span>
              <input value={topicText} onChange={event=>setTopic(event.target.value)} placeholder={account==="journey"?"Contoh: Seni mengatakan tidak tanpa rasa bersalah":"Contoh: Apakah SCHD masih layak dibeli di harga puncak?"} className="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400"/>
            </label>
            )}
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
              <select value={slides} onChange={event=>setSlides(event.target.value==='auto'?'auto':Number(event.target.value))} className="mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400">
                <option value="auto">Otomatis (AI menyesuaikan materi)</option>
                {Array.from({length:18},(_,i)=>i+3).map(count=><option key={count} value={count}>{count} slide</option>)}
              </select>
            </label>
            <div className="sm:col-span-2" role="group" aria-label="Tampilan">
              <span className="text-sm font-semibold">Tampilan</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {LOOK_IDS.map(id=><button key={id} type="button" aria-pressed={look===id} onClick={()=>setLook(id)} className={["min-h-11 rounded-full px-4 py-2 text-sm font-semibold",look===id?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>{LOOK_PRESETS[id].label}</button>)}
              </div>
              <span className="mt-2 block text-xs text-zinc-500">{LOOK_PRESETS[look].hint} Ditulis AI ke <code>meta.look</code>; bisa diganti lagi di Studio.</span>
            </div>
            <label className="sm:col-span-2">
              <span className="text-sm font-semibold">Gaya hasil</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.entries(STYLE_PRESETS).map(([key,preset])=><button key={key} type="button" aria-pressed={style===key} onClick={()=>setStyle(key)} className={["min-h-11 rounded-full px-4 py-2 text-sm font-semibold",style===key?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700"].join(" ")}>{preset.label}</button>)}
              </div>
              <span className="mt-2 block text-xs text-zinc-500">Mengatur kepadatan, jumlah extras, dan jenis komponen yang diutamakan AI.</span>
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
            <button type="button" onClick={()=>copy(content)} className="rounded-full bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">{tab==="prompt"?"Copy prompt lengkap":"Copy contoh JSON"}</button>
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
            <a href="https://chatgpt.com/" target="_blank" rel="noreferrer" className="inline-flex rounded-full border border-black/20 bg-white px-6 py-3 text-sm font-bold text-zinc-900 hover:bg-zinc-50">Buka ChatGPT</a>
            <Link href="/studio" className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">Buka Studio</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
