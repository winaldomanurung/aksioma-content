// Vertical levels (top = first item) joined by a rail. `current` marks "you are here".
export default function Ladder({ items = [], dark = false, className = "" }) {
  return (
    <div className={["relative grid gap-4", className].join(" ")}>
      {items.map((item, index) => (
        <div key={index} className="flex items-stretch gap-5">
          <div className="flex w-8 flex-none flex-col items-center">
            <div className={["w-[3px] flex-1", index === 0 ? "opacity-0" : "", dark ? "bg-white/25" : "bg-black/15"].join(" ")} />
            <span className={["my-1 block h-6 w-6 flex-none rounded-full border-[3px]",
              item.current ? (dark ? "border-red-400 bg-red-400" : "border-red-500 bg-red-500") : (dark ? "border-white/60 bg-transparent" : "border-zinc-400 bg-transparent")].join(" ")} />
            <div className={["w-[3px] flex-1", index === items.length - 1 ? "opacity-0" : "", dark ? "bg-white/25" : "bg-black/15"].join(" ")} />
          </div>
          <div className={["flex-1 rounded-[22px] border px-6 py-4", item.current ? (dark ? "border-red-400 bg-red-400/15" : "border-red-300 bg-red-50") : (dark ? "border-white/10 bg-white/[0.06]" : "border-black/10 bg-white/60"), dark ? "text-white" : "text-zinc-900"].join(" ")}>
            <div className="flex items-baseline justify-between gap-5">
              <p className="font-display text-[25px] font-bold leading-[1.2]">{item.label}</p>
              {item.value ? <p className={["font-display flex-none text-[25px] font-bold", dark ? "text-red-300" : "text-red-600"].join(" ")}>{item.value}</p> : null}
            </div>
            {item.note ? <p className="mt-1 text-[19px] leading-[1.4] opacity-75">{item.note}</p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}
