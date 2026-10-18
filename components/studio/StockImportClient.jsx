"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useMemo, useRef, useState} from "react";
import {copyText} from "@/lib/studio/clipboard";
import {parseStockTable, buildStockCarousel, SAMPLE_TABLE} from "@/lib/studio/stock-import";
import {STOCK_SIGNALS} from "@/lib/studio/stock";

const DRAFT_KEY = "aksioma-studio-draft-v1";
const field = "mt-2 w-full rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 text-base outline-none focus:border-red-400";
const chip = (on) => ["min-h-11 rounded-full px-4 py-2 text-sm font-semibold", on ? "bg-zinc-950 text-white" : "bg-zinc-100 text-zinc-700"].join(" ");

export default function StockImportClient() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Saham pilihan minggu ini");
  const [account, setAccount] = useState("trader");
  const [perSlide, setPerSlide] = useState(5);
  const [dark, setDark] = useState(false);
  const [feedback, setFeedback] = useState("");
  const outRef = useRef(null);
  const router = useRouter();

  const {items, warnings} = useMemo(() => parseStockTable(text), [text]);
  const json = useMemo(() => (items.length ? JSON.stringify(buildStockCarousel(items, {title, account, perSlide, dark}), null, 2) : ""), [items, title, account, perSlide, dark]);

  async function copy() {
    try { await copyText(json, outRef.current); setFeedback("JSON disalin. Paste ke kolom Carousel source di Studio."); }
    catch (error) { setFeedback(error.message); outRef.current?.select(); }
  }
  function openInStudio() {
    try { localStorage.setItem(DRAFT_KEY, json); router.push("/studio"); }
    catch { setFeedback("Browser menolak menyimpan draft. Salin JSON lalu paste manual di Studio."); }
  }

  return (
    <main className="min-h-screen bg-[#eae6df] px-4 py-8 text-zinc-900 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[1080px]">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[.22em] text-red-600">Aksioma / Impor Saham</p>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Dari spreadsheet jadi carousel.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Salin baris dari Excel, Google Sheets, atau CSV, lalu tempel di sini. Jumlah slide menyesuaikan jumlah saham. Semua diproses di browser.</p>
          </div>
          <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">← Studio</Link>
        </header>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">1. Tempel tabel</h2>
          <p className="mt-2 text-sm text-zinc-600">Baris pertama = judul kolom: Kode, Nama, Sinyal, Entry, Target, Cut loss, Catatan (hanya Kode yang wajib). Pemisah tab, titik koma, atau koma.</p>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={SAMPLE_TABLE} aria-label="Tabel saham" className={field + " h-48 resize-y font-mono text-sm"} />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setText(SAMPLE_TABLE)} className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-zinc-50">Pakai contoh</button>
            <button type="button" onClick={() => setText("")} disabled={!text} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-40">Bersihkan</button>
          </div>
          {warnings.length ? <ul role="status" className="mt-4 list-disc space-y-1 rounded-xl bg-amber-50 p-4 pl-8 text-sm text-amber-900">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul> : null}
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">2. Pratinjau dan pengaturan</h2>
          {items.length ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead><tr className="border-b border-black/10 text-xs uppercase tracking-wide text-zinc-500"><th className="py-2 pr-3">Kode</th><th className="pr-3">Nama</th><th className="pr-3">Sinyal</th><th className="pr-3">Entry</th><th className="pr-3">Target</th><th>Cut loss</th></tr></thead>
                <tbody>{items.map((it, i) => <tr key={i} className="border-b border-black/5"><td className="py-2 pr-3 font-bold">{it.ticker}</td><td className="pr-3">{it.name || "–"}</td><td className="pr-3">{STOCK_SIGNALS[it.signal] || it.action || "–"}</td><td className="pr-3">{it.entry || "–"}</td><td className="pr-3">{it.target || "–"}</td><td>{it.stop || "–"}</td></tr>)}</tbody>
              </table>
            </div>
          ) : <p className="mt-4 text-sm text-zinc-500">Belum ada saham terbaca.</p>}
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="sm:col-span-2"><span className="text-sm font-semibold">Judul carousel</span><input value={title} onChange={(e) => setTitle(e.target.value)} className={field} /></label>
          </div>
          <p className="mt-5 text-sm font-semibold">Saham per slide</p>
          <div className="mt-2 flex flex-wrap gap-2">{[1, 2, 3, 4, 5, 6, 8].map((n) => <button key={n} type="button" aria-pressed={perSlide === n} onClick={() => setPerSlide(n)} className={chip(perSlide === n)}>{n}</button>)}</div>
          <p className="mt-2 text-xs text-zinc-500">1–5 per slide menampilkan catatan; 6–8 memakai baris ringkas tanpa catatan.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["journey", "trader"].map((v) => <button key={v} type="button" aria-pressed={account === v} onClick={() => setAccount(v)} className={chip(account === v)}>Aksioma {v === "trader" ? "Trader" : "Journey"}</button>)}
            <button type="button" aria-pressed={dark} onClick={() => setDark((v) => !v)} className={chip(dark)}>Slide gelap</button>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">3. Hasil</h2>
          <textarea ref={outRef} readOnly aria-label="JSON carousel" value={json} placeholder="JSON akan muncul setelah ada saham terbaca." onFocus={(e) => e.target.select()} className="mt-4 h-[260px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100" />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" disabled={!json} onClick={openInStudio} className="rounded-full bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-40">Buka di Studio →</button>
            <button type="button" disabled={!json} onClick={copy} className="rounded-full border border-black/15 px-6 py-3 font-semibold hover:bg-zinc-50 disabled:opacity-40">Copy JSON</button>
          </div>
          {feedback ? <p role="status" className="mt-3 rounded-xl bg-zinc-100 p-3 text-sm text-zinc-700">{feedback}</p> : null}
          <p className="mt-3 text-xs text-zinc-500">&ldquo;Buka di Studio&rdquo; menyimpan hasil sebagai draft browser (menimpa draft lama), lalu tekan Render carousel.</p>
        </section>
      </div>
    </main>
  );
}
