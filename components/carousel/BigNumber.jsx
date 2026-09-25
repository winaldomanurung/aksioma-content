export default function BigNumber({ value, label, dark = false, className = "" }) {
  return (
    <div className={className}>
      <div className={["font-display text-[132px] font-bold leading-[0.82] tracking-[-0.08em]", dark ? "text-red-400" : "text-red-500"].join(" ")}>{value}</div>
      {label ? <p className={["mt-7 max-w-[520px] text-[28px] font-medium leading-[1.35]", dark ? "text-zinc-300" : "text-zinc-700"].join(" ")}>{label}</p> : null}
    </div>
  );
}
