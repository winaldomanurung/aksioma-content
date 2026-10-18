export default function SwipeHint({ text = "Geser", align = "right", dark = false, className = "" }) {
  const justify = align === "left" ? "justify-start" : align === "center" ? "justify-center" : "justify-end";
  return (
    <div className={["flex", justify, className].join(" ")}>
      <span className={["font-display inline-flex items-center gap-3 rounded-full border px-5 py-2 text-[18px] font-semibold uppercase tracking-[0.14em]", dark ? "border-white/30 text-white" : "border-black/20 text-zinc-700"].join(" ")}>
        {text}<span aria-hidden="true" className="text-[22px] leading-none">→</span>
      </span>
    </div>
  );
}
