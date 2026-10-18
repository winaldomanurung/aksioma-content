export default function ProsCons({ pros = [], cons = [], proLabel = "Untung", conLabel = "Rugi", dark = false, className = "" }) {
  const card = dark ? "border-white/10 bg-white/[0.06] text-white" : "border-black/10 bg-white/60 text-zinc-900";
  const side = (label, list, plus) => (
    <div className={["rounded-[28px] border p-6", card].join(" ")}>
      <p className={["font-display text-[22px] font-bold uppercase tracking-[0.1em]", plus ? (dark ? "text-emerald-300" : "text-emerald-700") : (dark ? "text-red-300" : "text-red-600")].join(" ")}>{label}</p>
      <ul className="mt-4 grid gap-3">
        {list.map((text, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className={["font-display mt-[3px] flex h-6 w-6 flex-none items-center justify-center rounded-full text-[15px] font-bold leading-none",
              plus ? (dark ? "bg-emerald-300 text-zinc-950" : "bg-emerald-700 text-white") : (dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white")].join(" ")}>{plus ? "+" : "−"}</span>
            <span className="text-[21px] leading-[1.4]">{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
  return <div className={["primitive-two-column", className].join(" ")}>{side(proLabel, pros, true)}{side(conLabel, cons, false)}</div>;
}
