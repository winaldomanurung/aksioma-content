// Horizontal bars for values the author supplies (never invented by the system).
export default function BarChart({ items = [], unit = "", max, dark = false, className = "" }) {
  const values = items.map((item) => Number(item.value)).filter((v) => Number.isFinite(v));
  const ceiling = Number(max) > 0 ? Number(max) : unit === "%" ? 100 : Math.max(1, ...values);
  return (
    <div className={["grid gap-6", className].join(" ")}>
      {items.map((item, index) => {
        const value = Number(item.value);
        const pct = Number.isFinite(value) ? Math.max(0, Math.min(100, (value / ceiling) * 100)) : 0;
        return (
          <div key={index}>
            <div className="flex items-baseline justify-between gap-6">
              <p className={["font-display text-[24px] font-semibold leading-[1.2]", dark ? "text-white" : "text-zinc-900"].join(" ")}>{item.label}</p>
              <p className={["font-display flex-none text-[28px] font-bold leading-none", dark ? "text-red-400" : "text-red-500"].join(" ")}>{item.value}{unit}</p>
            </div>
            <div className={["mt-3 h-[22px] w-full overflow-hidden rounded-full", dark ? "bg-white/15" : "bg-black/10"].join(" ")}>
              <div className={["h-full rounded-full", dark ? "bg-red-400" : "bg-red-500"].join(" ")} style={{ width: pct + "%" }} />
            </div>
            {item.note ? <p className={["mt-2 text-[18px] leading-[1.4]", dark ? "text-zinc-300" : "text-zinc-600"].join(" ")}>{item.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
