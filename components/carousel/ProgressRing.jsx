// Circular percentage. value is 0–100 and supplied by the author.
export default function ProgressRing({ value = 0, label, note, dark = false, className = "" }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = 78;
  const circumference = 2 * Math.PI * radius;
  return (
    <div className={["flex items-center gap-8", className].join(" ")}>
      <div className="relative h-[190px] w-[190px] flex-none">
        <svg width="190" height="190" viewBox="0 0 190 190" aria-hidden="true">
          <circle cx="95" cy="95" r={radius} fill="none" strokeWidth="18" stroke={dark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.1)"} />
          <circle cx="95" cy="95" r={radius} fill="none" strokeWidth="18" strokeLinecap="round" stroke={dark ? "#f87171" : "#ef4444"}
            strokeDasharray={(circumference * pct) / 100 + " " + circumference} transform="rotate(-90 95 95)" />
        </svg>
        <p className={["font-display absolute inset-0 flex items-center justify-center text-[52px] font-bold tracking-[-0.04em]", dark ? "text-white" : "text-zinc-950"].join(" ")}>{pct}%</p>
      </div>
      <div className={["min-w-0", dark ? "text-white" : "text-zinc-900"].join(" ")}>
        {label ? <p className="font-display text-[30px] font-bold leading-[1.2]">{label}</p> : null}
        {note ? <p className="mt-2 text-[21px] leading-[1.45] opacity-75">{note}</p> : null}
      </div>
    </div>
  );
}
