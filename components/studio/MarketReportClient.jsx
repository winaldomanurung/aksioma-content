"use client";

import Link from "next/link";
import {useRouter} from "next/navigation";
import {useMemo, useRef, useState} from "react";
import {copyText} from "@/lib/studio/clipboard";
import {parseMarketReport, buildReportCarousel, SAMPLE_REPORT} from "@/lib/studio/market-report";

const DRAFT_KEY = "aksioma-studio-draft-v1";

export default function MarketReportClient() {
  const [text, setText] = useState("");
  const [feedback, setFeedback] = useState("");
  const outRef = useRef(null);
  const router = useRouter();

  const {report, warnings} = useMemo(() => parseMarketReport(text), [text]);
  const ready = report.sections.length > 0;
  const json = useMemo(() => (ready ? JSON.stringify(buildReportCarousel(report), null, 2) : ""), [ready, report]);

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
            <p className="font-display text-xs font-bold uppercase tracking-[.22em] text-blue-800">Aksioma Trader / Laporan Pasar</p>
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight sm:text-5xl">Laporan harian jadi 7 slide.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-600">Tempel laporan Market &amp; Foreign Flow. Cover, ringkasan, Top Foreign Buy, Top Local Buy, Top Gainer, Top Loser, dan penutup langsung tersusun. Semua diproses di browser.</p>
          </div>
          <Link href="/studio" className="rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-bold hover:bg-zinc-50">← Studio</Link>
        </header>

        <section className="mt-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">1. Tempel laporan</h2>
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={SAMPLE_REPORT} aria-label="Laporan pasar" className="mt-4 h-72 w-full resize-y rounded-xl border border-black/15 bg-[#f9f7f3] px-4 py-3 font-mono text-sm outline-none focus:border-blue-500" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setText(SAMPLE_REPORT)} className="rounded-full border border-black/15 px-4 py-2 text-sm font-semibold hover:bg-zinc-50">Pakai contoh</button>
            <button type="button" onClick={() => setText("")} disabled={!text} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 disabled:opacity-40">Bersihkan</button>
          </div>
          {text.trim() && warnings.length ? <ul role="status" className="mt-4 list-disc space-y-1 rounded-xl bg-amber-50 p-4 pl-8 text-sm text-amber-900">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul> : null}
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">2. Terbaca</h2>
          {ready ? (
            <div className="mt-3 text-sm text-zinc-700">
              <p><strong>{report.session || "Penutupan"}</strong>{report.date ? " · " + report.date.weekday + ", " + report.date.label : ""}</p>
              {report.summary ? <p className="mt-2 text-zinc-600">{report.summary}</p> : null}
              <ul className="mt-3 flex flex-wrap gap-2">{report.sections.map((s, i) => <li key={i} className="rounded-full bg-zinc-100 px-4 py-2 font-semibold">{s.name} · {s.rows.length}</li>)}</ul>
              <p className="mt-3 text-xs text-zinc-500">Slide: cover, ringkasan, {report.sections.length} daftar, penutup ({report.sections.length + 3} slide). Akun otomatis Aksioma Trader.</p>
            </div>
          ) : <p className="mt-3 text-sm text-zinc-500">Belum ada daftar &ldquo;Top …&rdquo; yang terbaca.</p>}
        </section>

        <section className="mt-5 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm sm:p-8">
          <h2 className="font-display text-lg font-bold">3. Hasil</h2>
          <textarea ref={outRef} readOnly aria-label="JSON carousel" value={json} placeholder="JSON akan muncul setelah laporan terbaca." onFocus={(e) => e.target.select()} className="mt-4 h-[220px] w-full resize-y rounded-2xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100" />
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" disabled={!ready} onClick={openInStudio} className="rounded-full bg-blue-800 px-6 py-3 font-semibold text-white hover:bg-blue-900 disabled:opacity-40">Buka di Studio →</button>
            <button type="button" disabled={!ready} onClick={copy} className="rounded-full border border-black/15 px-6 py-3 font-semibold hover:bg-zinc-50 disabled:opacity-40">Copy JSON</button>
          </div>
          {feedback ? <p role="status" className="mt-3 rounded-xl bg-zinc-100 p-3 text-sm text-zinc-700">{feedback}</p> : null}
          <p className="mt-3 text-xs text-zinc-500">&ldquo;Buka di Studio&rdquo; menyimpan hasil sebagai draft browser (menimpa draft lama); pratinjau langsung tampil di Studio.</p>
        </section>
      </div>
    </main>
  );
}
