export default function QuoteCard({ quote, source, dark = false, className = "" }) {
  return (
    <div className={["relative rounded-[36px] border p-9", dark ? "border-white/10 bg-white/[0.05]" : "border-black/10 bg-white/60", className].join(" ")}>
      <span className={["font-display absolute -top-4 left-7 text-[88px] leading-none", dark ? "text-red-400/40" : "text-red-500/30"].join(" ")}>“</span>
      <p className={["font-display relative pt-8 text-[35px] font-semibold leading-[1.25]", dark ? "text-white" : "text-zinc-900"].join(" ")}>{quote}</p>
      {source ? <p className="mt-7 text-[18px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{source}</p> : null}
    </div>
  );
}
