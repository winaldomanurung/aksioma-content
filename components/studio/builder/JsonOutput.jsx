"use client";

import {useRef,useState} from "react";
import {copyText} from "@/lib/studio/clipboard";

// Read-only JSON with a Copy button. `tabs`: [{id,label,hint,json}]
export default function JsonOutput({tabs}){
  const [active,setActive]=useState(tabs[0].id);
  const [message,setMessage]=useState("");
  const area=useRef(null);
  const tab=tabs.find(t=>t.id===active)||tabs[0];
  async function copy(){
    try{await copyText(tab.json,area.current);setMessage("JSON disalin. Tempel di Carousel Source.");}
    catch(e){setMessage(e.message);}
  }
  return (
    <section aria-label="Hasil JSON" className="rounded-[20px] border border-black/10 bg-white p-4">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map(t=><button key={t.id} type="button" aria-pressed={t.id===tab.id} onClick={()=>{setActive(t.id);setMessage("");}}
          className={"rounded-full px-3 py-1.5 text-xs font-bold "+(t.id===tab.id?"bg-zinc-950 text-white":"bg-zinc-100 text-zinc-700")}>{t.label}</button>)}
        <button type="button" onClick={copy} className="ml-auto rounded-full bg-red-500 px-4 py-2 text-xs font-bold text-white hover:bg-red-600">Salin JSON</button>
      </div>
      <p className="mt-2 text-xs leading-5 text-zinc-500">{tab.hint}</p>
      <textarea ref={area} readOnly spellCheck={false} value={tab.json} aria-label={"JSON "+tab.label}
        className="mt-2 h-64 w-full resize-y rounded-xl border border-black/15 bg-zinc-950 p-3 font-mono text-[12px] leading-5 text-zinc-100"/>
      {message?<p role="status" className="mt-2 text-xs text-emerald-800">{message}</p>:null}
    </section>
  );
}
