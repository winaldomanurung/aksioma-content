export default function MythFact({ items = [], mythLabel = "MITOS", factLabel = "FAKTA", dark = false, className = "" }) {
  const card = dark ? "border-white/10 bg-white/[0.06] text-white" : "border-black/10 bg-white/60 text-zinc-900";
  const chip = (tone) => ["font-display flex-none rounded-full px-3 py-1 text-[14px] font-bold tracking-[0.12em]",
    tone === "myth" ? (dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white") : (dark ? "bg-emerald-300 text-zinc-950" : "bg-emerald-700 text-white")].join(" ");
  return (
    <div className={["grid gap-4", className].join(" ")}>
      {items.map((item, index) => (
        <div key={index} className={["rounded-[26px] border p-6", card].join(" ")}>
          <div className="flex items-start gap-4">
            <span className={chip("myth")}>{mythLabel}</span>
            <p className="text-[22px] leading-[1.35] opacity-70 line-through decoration-red-400/70">{item.myth}</p>
          </div>
          <div className="mt-4 flex items-start gap-4">
            <span className={chip("fact")}>{factLabel}</span>
            <p className="text-[22px] font-semibold leading-[1.35]">{item.fact}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
