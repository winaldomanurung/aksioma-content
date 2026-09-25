export default function Timeline({ items = [], dark = false, className = "" }) {
  return (
    <div className={["relative", className].join(" ")}>
      <div className={["absolute bottom-7 left-[22px] top-7 w-[2px]", dark ? "bg-gradient-to-b from-red-400 via-orange-400 to-white/10" : "bg-gradient-to-b from-red-500 via-orange-400 to-black/10"].join(" ")} />
      <div className="space-y-6">
        {items.map((item, index) => (
          <div key={item.title || index} className="relative grid grid-cols-[46px_1fr] items-center gap-6">
            <div className={["font-display relative z-10 flex h-[46px] w-[46px] items-center justify-center rounded-full text-[16px] font-bold", dark ? "bg-white text-zinc-950" : "bg-zinc-950 text-white"].join(" ")}>{index + 1}</div>
            <div>
              <h3 className="font-display text-[27px] font-bold">{item.title}</h3>
              {item.text ? <p className={["mt-2 text-[20px] leading-[1.4]", dark ? "text-zinc-400" : "text-zinc-600"].join(" ")}>{item.text}</p> : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
