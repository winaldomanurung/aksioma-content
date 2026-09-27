"use client";

import {useState} from "react";
import {copyText} from "@/lib/studio/clipboard";

// Display and clipboard must use the very same plain-text caption.
function normalizeCaption(value) {
  return String(value ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(/\\r\\n|\\n|\\r/g, "\n")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n");
}

function MetaBlock({label, value, children, className = ""}) {
  const [copyState,setCopyState]=useState("");
  const content=String(value ?? "");
  async function handleCopy(){
    try {
      await copyText(content);
      setCopyState("Tersalin");
    } catch(e) {
      setCopyState(e?.message || "Gagal menyalin");
    }
  }
  return (
    <section className={["min-w-0 rounded-2xl border border-black/10 bg-white p-5",className].join(" ")}>
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">{label}</p>
        <button type="button" onClick={handleCopy} disabled={!content}
          aria-label={"Salin "+label} title={"Salin "+label}
          className="studio-only shrink-0 rounded-full border border-black/15 bg-zinc-50 px-3 py-1.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 disabled:opacity-40">
          {copyState==="Tersalin"?"✓ Tersalin":"Copy"}
        </button>
      </div>
      <div className="mt-3 whitespace-pre-wrap break-words text-[15px] leading-6 text-zinc-800">
        {children ?? content}
      </div>
      {copyState && copyState!=="Tersalin" ? <p role="alert" className="mt-2 text-xs text-red-700">{copyState}</p> : null}
    </section>
  );
}

export default function PostMetaPanel({
  title,objective,contentPillar,hook,instagramCaption,tiktokCaption,cta,
  hashtags = [],keywords = [],notes,
}) {
  const instagramText=normalizeCaption(instagramCaption);
  const tiktokText=normalizeCaption(tiktokCaption);
  const hashtagsText=hashtags.map(tag=>String(tag).startsWith("#")?String(tag):"#"+tag).join(" ");
  const keywordText=keywords.join(", ");
  return (
    <aside className="studio-only w-[1080px] overflow-hidden rounded-[28px] border border-black/10 bg-[#f7f5f0] shadow-sm">
      <div className="border-b border-black/10 bg-zinc-950 px-7 py-6 text-white">
        <div className="flex items-center justify-between gap-8">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-red-400">Publishing Brief</p>
            <h2 className="font-display mt-2 text-2xl font-semibold">{title}</h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300">Not exported</span>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-4 p-6">
        <MetaBlock label="Objective" value={objective} className="col-span-4"/>
        <MetaBlock label="Content pillar" value={contentPillar} className="col-span-4"/>
        <MetaBlock label="Primary hook" value={hook} className="col-span-4"/>
        <MetaBlock label="Instagram caption" value={instagramText} className="col-span-6"/>
        <MetaBlock label="TikTok caption" value={tiktokText} className="col-span-6" preserveLines/>
        <MetaBlock label="CTA" value={cta} className="col-span-5"/>
        <MetaBlock label="Keywords" value={keywordText} className="col-span-3">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword,i)=><span key={i} className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700">{keyword}</span>)}
          </div>
        </MetaBlock>
        <MetaBlock label="Hashtags" value={hashtagsText} className="col-span-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag,i)=><span key={i} className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700">{String(hashtag).startsWith("#")?hashtag:"#"+hashtag}</span>)}
          </div>
        </MetaBlock>
        {notes ? <MetaBlock label="Posting notes" value={notes} className="col-span-12"/> : null}
      </div>
    </aside>
  );
}
