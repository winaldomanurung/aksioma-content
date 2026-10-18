"use client";

import {useId,useState} from "react";
import {IMAGE_SHAPES,MAX_IMAGES_PER_SLIDE,SHAPE_LABELS,newImageId,normalizeImage,placeNewImage} from "@/lib/studio/images";
import {deleteImage,prepareUpload,putImage} from "@/lib/studio/image-store";

// Upload + shape controls for the images of one slide. Positions are edited
// by dragging on the preview (ImageEditorOverlay); numbers can be typed here too.
export default function ImageToolbar({images,selectedId,onSelect,onChange}){
  const inputId=useId();
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const selected=images.find(image=>image.id===selectedId)||null;

  async function upload(event){
    const files=[...(event.target.files||[])];
    event.target.value="";
    if(!files.length)return;
    setBusy(true);setError("");
    try{
      let list=images;
      for(const file of files){
        if(list.length>=MAX_IMAGES_PER_SLIDE)throw new Error("Maksimal "+MAX_IMAGES_PER_SLIDE+" gambar per slide.");
        const prepared=await prepareUpload(file);
        const id=newImageId(list.map(image=>image.id));
        await putImage(id,prepared.blob,{name:prepared.name,width:prepared.width,height:prepared.height});
        list=[...list,placeNewImage(id,prepared.width,prepared.height,list.length)];
        onSelect(id);
      }
      onChange(list);
    }catch(e){setError(e?.message||String(e));}
    finally{setBusy(false);}
  }

  function patch(id,changes){
    onChange(images.map(image=>image.id===id?normalizeImage({...image,...changes}):image));
  }
  function remove(id,alsoFromBrowser){
    onChange(images.filter(image=>image.id!==id));
    if(alsoFromBrowser)deleteImage(id).catch(()=>{});
    if(selectedId===id)onSelect(null);
  }
  function reorder(id,direction){
    const index=images.findIndex(image=>image.id===id);
    const target=index+direction;
    if(index<0||target<0||target>=images.length)return;
    const list=[...images];
    [list[index],list[target]]=[list[target],list[index]];
    onChange(list);
  }
  const number=(key,label)=>(
    <label className="text-xs font-semibold text-zinc-600">{label}
      <input type="number" value={selected?selected[key]:""} disabled={!selected}
        onChange={event=>{const value=Number(event.target.value);if(Number.isFinite(value))patch(selected.id,{[key]:value});}}
        className="mt-1 block w-full rounded-lg border border-black/15 px-2 py-1.5 text-sm font-normal"/>
    </label>
  );

  return (
    <section aria-label="Gambar pada slide" className="rounded-[20px] border border-black/10 bg-white p-4" data-image-toolbar="true">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-sm font-bold">Gambar sendiri</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">Upload, lalu geser gambar di preview. Tarik titik sudut untuk resize (Shift = bebas rasio).</p>
        </div>
        <label htmlFor={inputId} className={"inline-flex cursor-pointer rounded-full bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800"+(busy||images.length>=MAX_IMAGES_PER_SLIDE?" pointer-events-none opacity-50":"")}>
          {busy?"Memproses…":"+ Upload gambar"}
        </label>
        <input id={inputId} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple className="sr-only" onChange={upload}/>
      </div>
      {error?<p role="alert" className="mt-3 rounded-lg bg-red-50 p-2 text-xs text-red-800">{error}</p>:null}
      {images.length===0?<p className="mt-3 text-xs text-zinc-500">Belum ada gambar di slide ini.</p>:(
        <ul className="mt-3 flex flex-wrap gap-2">
          {images.map((image,i)=>(
            <li key={image.id}>
              <button type="button" onClick={()=>onSelect(image.id)} aria-pressed={image.id===selectedId}
                className={"rounded-full px-3 py-1.5 text-xs font-semibold "+(image.id===selectedId?"bg-red-500 text-white":"bg-zinc-100 text-zinc-700")}>
                Gambar {i+1}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected?(
        <div className="mt-4 space-y-3 border-t border-black/10 pt-4">
          <div role="radiogroup" aria-label="Bentuk gambar" className="flex flex-wrap gap-2">
            {IMAGE_SHAPES.map(shape=>(
              <button key={shape} type="button" role="radio" aria-checked={selected.shape===shape} onClick={()=>patch(selected.id,{shape})}
                className={"rounded-full px-4 py-2 text-xs font-bold "+(selected.shape===shape?"bg-zinc-950 text-white":"border border-black/15 text-zinc-700")}>
                {SHAPE_LABELS[shape]}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-600">Isi bingkai:</span>
            {["cover","contain"].map(fit=>(
              <button key={fit} type="button" onClick={()=>patch(selected.id,{fit})}
                className={"rounded-full px-3 py-1.5 font-semibold "+((selected.fit||"cover")===fit?"bg-zinc-950 text-white":"border border-black/15 text-zinc-700")}>
                {fit==="cover"?"Penuh (crop)":"Utuh"}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">{number("x","X")}{number("y","Y")}{number("width","Lebar")}{number("height","Tinggi")}</div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button type="button" onClick={()=>reorder(selected.id,-1)} className="rounded-full border border-black/15 px-3 py-1.5 font-semibold">Mundur</button>
            <button type="button" onClick={()=>reorder(selected.id,1)} className="rounded-full border border-black/15 px-3 py-1.5 font-semibold">Maju</button>
            <button type="button" onClick={()=>remove(selected.id,false)} className="rounded-full border border-red-200 px-3 py-1.5 font-semibold text-red-700">Lepas dari slide</button>
            <button type="button" onClick={()=>remove(selected.id,true)} className="rounded-full border border-red-200 px-3 py-1.5 font-semibold text-red-700">Hapus dari browser</button>
          </div>
        </div>
      ):null}
      <p className="mt-3 text-[11px] leading-4 text-zinc-500">Gambar disimpan di browser ini saja; JSON hanya berisi id, posisi, ukuran, dan bentuk. Nilai dalam piksel kanvas 1080×1350.</p>
    </section>
  );
}
