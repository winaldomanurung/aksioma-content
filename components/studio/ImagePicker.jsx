"use client";

import {useId,useState} from "react";
import {newImageId} from "@/lib/studio/images";
import {saveUpload,useImageLibrary} from "@/lib/studio/image-store";

// Choose an image from the browser library for a slot, or upload a new one.
export default function ImagePicker({value,onChange,label="Gambar"}){
  const {rows}=useImageLibrary();
  const inputId=useId();
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  async function upload(event){
    const file=event.target.files?.[0];
    event.target.value="";
    if(!file)return;
    setBusy(true);setError("");
    try{const saved=await saveUpload(file,()=>newImageId(rows.map(r=>r.id)));onChange(saved.id);}
    catch(e){setError(e?.message||String(e));}
    finally{setBusy(false);}
  }
  const known=rows.some(r=>r.id===value);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <select aria-label={label} value={value||""} onChange={e=>onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-black/15 bg-white px-3 py-2 text-sm">
          <option value="">(kosong, blok netral)</option>
          {value&&!known?<option value={value}>{value} (tidak ada di browser ini)</option>:null}
          {rows.map(r=><option key={r.id} value={r.id}>{r.name} · {r.id}</option>)}
        </select>
        <label htmlFor={inputId} className={"cursor-pointer rounded-full bg-zinc-950 px-3 py-2 text-xs font-semibold text-white"+(busy?" pointer-events-none opacity-50":"")}>{busy?"Memproses…":"Upload"}</label>
        <input id={inputId} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={upload}/>
      </div>
      {error?<p role="alert" className="mt-1 text-xs text-red-700">{error}</p>:null}
    </div>
  );
}
