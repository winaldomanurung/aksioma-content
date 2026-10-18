"use client";

import {useEffect, useRef} from "react";

// Textarea with a mirrored backdrop so a character range can be highlighted
// (the native selection is invisible while the textarea is unfocused).
const MIRROR = {whiteSpace: "pre-wrap", overflowWrap: "break-word", wordBreak: "normal", tabSize: 2};

export default function SourceEditor({id, value, onChange, highlight, placeholder, className = ""}) {
  const area = useRef(null);
  const back = useRef(null);
  const mark = useRef(null);
  const range = highlight && highlight.start <= highlight.end && highlight.end <= value.length ? highlight : null;

  useEffect(() => {
    const ta = area.current;
    const m = mark.current;
    if (!ta || !m || !range) return;
    const top = m.offsetTop;
    const bottom = top + m.offsetHeight;
    if (top < ta.scrollTop + 8 || bottom > ta.scrollTop + ta.clientHeight - 24) {
      ta.scrollTop = Math.max(0, top - ta.clientHeight / 3);
      if (back.current) back.current.scrollTop = ta.scrollTop;
    }
  }, [range?.start, range?.end]);

  const font = "p-4 font-mono text-[12px] leading-5";
  return (
    <div className="relative mt-2 rounded-xl bg-zinc-950">
      <div ref={back} aria-hidden="true" data-source-backdrop="true"
        className={"pointer-events-none absolute inset-0 overflow-y-scroll rounded-xl border border-transparent text-transparent " + font}
        style={MIRROR}>
        {range ? <>{value.slice(0, range.start)}<mark ref={mark} data-source-highlight="true" className="rounded-sm bg-amber-300/70 text-transparent">{value.slice(range.start, range.end) || " "}</mark>{value.slice(range.end)}</> : value}
        {"\n"}
      </div>
      <textarea ref={area} id={id} spellCheck={false} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onScroll={(e) => { if (back.current) back.current.scrollTop = e.currentTarget.scrollTop; }}
        className={"relative block w-full resize-y overflow-y-scroll rounded-xl border border-black/15 bg-transparent text-zinc-100 outline-none focus:border-red-400 " + font + " " + className}
        style={MIRROR} />
    </div>
  );
}
