// Stacked stages. shape "funnel" narrows downward, "pyramid" widens downward.
export default function Funnel({ items = [], shape = "funnel", dark = false, className = "" }) {
  const count = Math.max(1, items.length);
  return (
    <div className={["grid justify-items-center gap-3", className].join(" ")}>
      {items.map((item, index) => {
        const step = count === 1 ? 0 : index / (count - 1);
        const width = shape === "pyramid" ? 52 + step * 48 : 100 - step * 42;
        const strong = shape === "pyramid" ? index === 0 : index === count - 1;
        return (
          <div key={index} className={["rounded-[22px] border px-6 py-5 text-center",
            strong ? (dark ? "border-red-400 bg-red-400/20" : "border-red-300 bg-red-50") : (dark ? "border-white/10 bg-white/[0.06]" : "border-black/10 bg-white/60"),
            dark ? "text-white" : "text-zinc-900"].join(" ")} style={{ width: width + "%" }}>
            <p className="font-display text-[26px] font-bold leading-[1.2]">{item.label}</p>
            {item.note ? <p className="mt-2 text-[19px] leading-[1.4] opacity-75">{item.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
