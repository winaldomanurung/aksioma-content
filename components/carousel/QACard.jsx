export default function QACard({ items = [], dark = false, className = "" }) {
  const card = dark ? "border-white/10 bg-white/[0.06] text-white" : "border-black/10 bg-white/60 text-zinc-900";
  return (
    <div className={["grid gap-4", className].join(" ")}>
      {items.map((item, index) => (
        <div key={index} className={["rounded-[26px] border p-6", card].join(" ")}>
          <div className="flex items-start gap-4">
            <span className={["font-display flex h-9 w-9 flex-none items-center justify-center rounded-full text-[18px] font-bold", dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white"].join(" ")}>?</span>
            <p className="font-display text-[26px] font-bold leading-[1.25]">{item.q}</p>
          </div>
          <p className="mt-3 pl-[52px] text-[21px] leading-[1.5] opacity-80">{item.a}</p>
        </div>
      ))}
    </div>
  );
}
