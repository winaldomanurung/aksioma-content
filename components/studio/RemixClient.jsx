"use client";

import Link from "next/link";
import {useRef, useState} from "react";
import {STYLE_PRESETS} from "@/lib/studio/ai-guide";
import {FONT_PRESETS, FONT_IDS} from "@/lib/studio/fonts";
import {copyText} from "@/lib/studio/clipboard";
import {makeRemixPrompt, PACKAGINGS, DETAILS, TONES, REMIX_MAX_CHARS} from "@/lib/studio/remix-prompt";

const field = "mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400";
const chip = (on) => ["min-h-11 rounded-full px-4 py-2 text-sm font-semibold", on ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700"].join(" ");

export default function RemixClient() {
  const [source, setSource] = useState("");
  const [sourceName, setSourceName] = useState("");
  const [account, setAccount] = useState("journey");
  const [packaging, setPackaging] = useState("edukasi");
  const [tone, setTone] = useState("hangat");
  const [details, setDetails] = useState(["contoh", "kesalahan"]);
  const [audience, setAudience] = useState("Young professionals");
  const [objective, setObjective] = useState("Save, share dan follow");
  const [slides, setSlides] = useState("auto");
  const [style, setStyle] = useState("seimbang");
  const [font, setFont] = useState("aksioma");
  const [extraNotes, setExtraNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const textRef = useRef(null);

  const prompt = makeRemixPrompt({source, sourceName, packaging, details, tone, audience, objective, slides, account, style, font, extraNotes});
  const toggle = (key) => setDetails((list) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]));

  async function copy() {
    if (!source.trim()) { setFeedback("Tempel konten sumber dulu."); return; }
    try {
      await copyText(prompt, textRef.current);
      setFeedback("Berhasil disalin. Paste ke ChatGPT atau Claude, lalu bawa JSON hasilnya ke Studio.");
    } catch (error) {
      setFeedback(error.message);
      textRef.current?.focus();
      textRef.current?.select();
    }
  }

  return (
    <main className="min-h-screen bg-[#eae6df] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1080px]">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[.22em] text-red-600">Aksioma / Adaptasi</p>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Kemas ulang konten jadi milikmu.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Tempel artikel, thread, atau transkrip. Pilih kemasan baru dan detail tambahan, lalu salin prompt ke AI. Hasilnya ditulis ulang, bukan disalin.</p>
          </div>
          <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">← Studio</Link>
        </header>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">1. Konten sumber</h2>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Tempel konten</span>
            <textarea value={source} maxLength={REMIX_MAX_CHARS} onChange={(e) => setSource(e.target.value)} placeholder="Tempel teks artikel, thread, atau transkrip di sini…" className={field + " h-56 resize-y"} />
            <span className="mt-1 block text-xs text-zinc-500">{source.length.toLocaleString("id-ID")} / {REMIX_MAX_CHARS.toLocaleString("id-ID")} karakter</span>
          </label>
          <label className="mt-4 block">
            <span className="text-sm font-semibold">Nama/penulis sumber (opsional, untuk atribusi)</span>
            <input value={sourceName} onChange={(e) => setSourceName(e.target.value)} placeholder="Contoh: Artikel Kompas oleh Budi" className={field} />
          </label>
          <p className="mt-3 rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-900">Gunakan konten yang kamu punya hak memakainya atau yang boleh diadaptasi. Prompt meminta AI menulis ulang dengan struktur dan kata-kata baru serta mencantumkan atribusi, tetapi tanggung jawab hak cipta tetap di kamu.</p>
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">2. Kemasan baru</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {["journey", "trader"].map((v) => <button key={v} type="button" aria-pressed={account === v} onClick={() => setAccount(v)} className={chip(account === v)}>Aksioma {v === "trader" ? "Trader" : "Journey"}</button>)}
          </div>
          <p className="mt-5 text-sm font-semibold">Gaya kemasan</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(PACKAGINGS).map(([k, p]) => <button key={k} type="button" aria-pressed={packaging === k} onClick={() => setPackaging(k)} className={chip(packaging === k)}>{p.label}</button>)}
          </div>
          <p className="mt-5 text-sm font-semibold">Nada</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.keys(TONES).map((k) => <button key={k} type="button" aria-pressed={tone === k} onClick={() => setTone(k)} className={chip(tone === k)}>{k[0].toUpperCase() + k.slice(1)}</button>)}
          </div>
          <p className="mt-5 text-sm font-semibold">Detail tambahan</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(DETAILS).map(([k, label]) => <button key={k} type="button" aria-pressed={details.includes(k)} onClick={() => toggle(k)} className={chip(details.includes(k))}>{details.includes(k) ? "✓ " : "+ "}{label.split(" (")[0]}</button>)}
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label><span className="text-sm font-semibold">Audiens</span><input value={audience} onChange={(e) => setAudience(e.target.value)} className={field} /></label>
            <label><span className="text-sm font-semibold">Tujuan post</span><input value={objective} onChange={(e) => setObjective(e.target.value)} className={field} /></label>
            <label><span className="text-sm font-semibold">Jumlah slide</span>
              <select value={slides} onChange={(e) => setSlides(e.target.value === "auto" ? "auto" : Number(e.target.value))} className={field}>
                <option value="auto">Otomatis</option>
                {Array.from({length: 18}, (_, i) => i + 3).map((n) => <option key={n} value={n}>{n} slide</option>)}
              </select>
            </label>
            <label><span className="text-sm font-semibold">Font konten</span>
              <select value={font} onChange={(e) => setFont(e.target.value)} className={field}>
                {FONT_IDS.map((id) => <option key={id} value={id}>{FONT_PRESETS[id].label}</option>)}
              </select>
            </label>
          </div>
          <p className="mt-5 text-sm font-semibold">Gaya hasil</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(STYLE_PRESETS).map(([k, p]) => <button key={k} type="button" aria-pressed={style === k} onClick={() => setStyle(k)} className={chip(style === k)}>{p.label}</button>)}
          </div>
          <label className="mt-5 block"><span className="text-sm font-semibold">Catatan tambahan (opsional)</span>
            <textarea value={extraNotes} maxLength={600} onChange={(e) => setExtraNotes(e.target.value)} placeholder="Contoh: fokus ke pemula, hindari istilah teknis." className={field + " h-24"} />
          </label>
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">3. Salin prompt</h2>
          <textarea ref={textRef} aria-label="Prompt adaptasi" readOnly value={prompt} onFocus={(e) => e.target.select()} className="mt-4 h-[310px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100" />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={copy} className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600">Copy prompt adaptasi</button>
            <Link href="/studio" className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">Buka Studio →</Link>
          </div>
          {feedback ? <p role="status" className="mt-3 rounded-xl bg-zinc-100 p-3 text-sm text-zinc-700">{feedback}</p> : null}
          <p className="mt-3 text-xs text-zinc-500">Setelah AI menjawab, salin JSON-nya, paste di kolom Carousel source Studio, lalu Render carousel.</p>
        </section>
      </div>
    </main>
  );
}
