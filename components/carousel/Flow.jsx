// Labelled flow: 2–5 steps left-to-right (or top-down) with optional labels on
// the arrows, and an optional two-way fork after the last step.
export default function Flow({ items = [], direction = "row", fork = [], dark = false, className = "" }) {
  const row = direction !== "column";
  const node = dark ? "border-white/12 bg-white/[0.07] text-white" : "border-black/10 bg-white/70 text-zinc-900";
  const arrow = dark ? "text-red-400" : "text-red-500";
  const muted = dark ? "text-zinc-400" : "text-zinc-500";
  return (
    <div className={["grid gap-5", className].join(" ")}>
      <div className={row ? "flex items-stretch" : "grid gap-2"}>
        {items.map((item, index) => (
          <div key={index} className={row ? "flex min-w-0 flex-1 items-center" : "grid gap-2"}>
            <div className={["min-w-0 flex-1 rounded-[22px] border px-4 py-4 text-center", node].join(" ")}>
              <p className="font-display text-[21px] font-semibold leading-[1.2]">{item.label}</p>
              {item.note ? <p className={["mt-1 text-[16px] leading-[1.35]", muted].join(" ")}>{item.note}</p> : null}
            </div>
            {index < items.length - 1 ? (
              <div className={["flex flex-none flex-col items-center", row ? "mx-2" : "py-0"].join(" ")}>
                {item.via ? <span className={["text-[13px] font-semibold uppercase tracking-[0.08em]", muted].join(" ")}>{item.via}</span> : null}
                <span className={["font-display text-[24px] leading-none", arrow].join(" ")}>{row ? "→" : "↓"}</span>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      {fork.length ? (
        <div className="grid grid-cols-2 gap-4">
          {fork.map((item, index) => (
            <div key={index} className={["rounded-[22px] border px-5 py-4", node, index === 0 ? "border-red-400/50" : ""].join(" ")}>
              {item.via ? <p className={["mb-1 text-[13px] font-semibold uppercase tracking-[0.1em]", arrow].join(" ")}>{"↳ " + item.via}</p> : null}
              <p className="font-display text-[21px] font-semibold leading-[1.2]">{item.label}</p>
              {item.note ? <p className={["mt-1 text-[16px] leading-[1.35]", muted].join(" ")}>{item.note}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
