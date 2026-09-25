export default function Connector({ direction = "down", dark = false, label, className = "" }) {
  const symbol = direction === "right" ? "→" : "↓";
  return (
    <div className={["flex items-center justify-center gap-3", direction === "right" ? "flex-row" : "flex-col", className].join(" ")}>
      {label ? <span className="font-display text-[15px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</span> : null}
      <span className={["font-display flex h-12 w-12 items-center justify-center rounded-full border text-[25px]", dark ? "border-red-400/30 text-red-400" : "border-red-300 text-red-500"].join(" ")}>{symbol}</span>
    </div>
  );
}
