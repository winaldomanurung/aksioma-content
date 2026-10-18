"use client";

import {useRef,useState} from "react";
import {copyText} from "@/lib/studio/clipboard";
import {buildRepairReport} from "@/lib/studio/slide-metrics";

// Result of a real-layout check of every slide, with a one-tap repair report
// the person can paste back into the AI.
export default function QualityPanel({result,checking,onCheck,onSelect,title}){
  const [message,setMessage]=useState("");
  const area=useRef(null);
  const issues=result?.issues||[];
  const report=buildRepairReport(title,issues);
  async function copy(){
    try{await copyText(report,area.current);setMessage("Laporan disalin. Paste ke AI agar hanya slide bermasalah yang diperbaiki.");}
    catch(e){setMessage(e.message);}
  }
  return (
    <section aria-label="Pemeriksa layout" className="mt-4 rounded-[20px] border border-black/10 bg-white p-4" data-quality-panel="true">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold">Periksa layout semua slide</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Mengukur tata letak nyata: slide yang terpotong atau terlalu kosong.</p>
        </div>
        <button type="button" onClick={onCheck} disabled={checking} className="min-h-11 rounded-full bg-zinc-950 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 disabled:opacity-50">{checking?"Memeriksa…":"Periksa sekarang"}</button>
      </div>
      {result?(issues.length?<div className="mt-3">
        <ul className="space-y-2">
          {issues.map((issue,i)=><li key={i} className={["rounded-xl border p-3 text-xs leading-5",issue.severity==="overflow"?"border-red-200 bg-red-50 text-red-900":"border-sky-200 bg-sky-50 text-sky-900"].join(" ")}>
            <button type="button" onClick={()=>onSelect(issue.index)} className="mr-2 rounded-full bg-white/80 px-2 py-1 font-bold underline">Buka</button>{issue.message}
          </li>)}
        </ul>
        <textarea ref={area} readOnly aria-label="Laporan perbaikan untuk AI" value={report} className="mt-3 h-28 w-full resize-y rounded-xl border border-black/15 bg-zinc-950 p-3 font-mono text-[11px] leading-5 text-zinc-100"/>
        <button type="button" onClick={copy} className="mt-2 min-h-11 rounded-full bg-red-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-red-600">Salin laporan perbaikan untuk AI</button>
        {message?<p role="status" className="mt-2 text-xs text-emerald-800">{message}</p>:null}
      </div>:<p role="status" className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">Semua slide muat dan terisi baik di {result.platform==="tiktok"?"TikTok Photo":"Instagram"}.</p>):null}
    </section>
  );
}
