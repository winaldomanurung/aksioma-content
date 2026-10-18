"use client";

import {useId,useState} from "react";
import {newImageId} from "@/lib/studio/images";
import {deleteImage,saveUpload,useImageLibrary} from "@/lib/studio/image-store";
import {copyText} from "@/lib/studio/clipboard";
import StoredImageBox from "./StoredImageBox";

// All images saved in this browser. Used to fill image slots by id.
export default function ImageLibrary(){
  const {rows,loaded}=useImageLibrary();
  const inputId=useId();
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  async function upload(event){
    const files=[...(event.target.files||[])];
    event.target.value="";
    setBusy(true);setMessage("");
    try{
      let ids=rows.map(r=>r.id);
      for(const file of files){const saved=await saveUpload(file,()=>newImageId(ids));ids=[...ids,saved.id];}
      setMessage(files.length+" gambar disimpan.");
    }catch(e){setMessage(e?.message||String(e));}
    finally{setBusy(false);}
  }
  return (
    <section aria-label="Perpustakaan gambar" className="rounded-[20px] border border-black/10 bg-white p-4" data-image-library="true">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold">Perpustakaan gambar</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Tersimpan di browser ini. Pakai id-nya pada slot gambar (photoHero, phoneMockup, collage, avatarQuote).</p>
        </div>
        <label htmlFor={inputId} className={"cursor-pointer rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white"+(busy?" pointer-events-none opacity-50":"")}>{busy?"Memproses…":"+ Upload"}</label>
        <input id={inputId} type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" onChange={upload}/>
      </div>
      {message?<p role="status" className="mt-2 text-xs text-zinc-700">{message}</p>:null}
      {loaded&&!rows.length?<p className="mt-3 text-xs text-zinc-500">Belum ada gambar.</p>:null}
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {rows.map(row=>(
          <li key={row.id} className="rounded-xl border border-black/10 p-2">
            <div style={{height:90}}><StoredImageBox id={row.id} radius="10px"/></div>
            <p className="mt-2 truncate text-[11px] font-semibold" title={row.name}>{row.name}</p>
            <p className="truncate font-mono text-[10px] text-zinc-500">{row.id}</p>
            <div className="mt-1 flex gap-1">
              <button type="button" onClick={()=>copyText(row.id).then(()=>setMessage("Id "+row.id+" disalin.")).catch(e=>setMessage(e.message))} className="rounded-full border border-black/15 px-2 py-1 text-[10px] font-semibold">Salin id</button>
              <button type="button" onClick={()=>deleteImage(row.id)} className="rounded-full border border-red-200 px-2 py-1 text-[10px] font-semibold text-red-700">Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
