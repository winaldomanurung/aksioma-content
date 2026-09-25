export default function DiagramNode({ title, body, accent = false, dark = false, className = "" }) {
  return (
    <div className={[
      "rounded-[28px] border p-6",
      accent
        ? dark ? "border-red-400/30 bg-red-500/10 text-white" : "border-red-200 bg-red-50 text-zinc-900"
        : dark ? "border-white/10 bg-white/[0.05] text-white" : "border-black/10 bg-white/60 text-zinc-900",
      className,
    ].join(" ")}>
      <h3 className="font-display text-[26px] font-bold">{title}</h3>
      {body ? <p className="mt-3 text-[20px] leading-[1.42] opacity-70">{body}</p> : null}
    </div>
  );
}
