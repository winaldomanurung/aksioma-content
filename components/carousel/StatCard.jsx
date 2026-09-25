export default function StatCard({ value, label, note, variant = "light", className = "" }) {
  const dark = variant === "dark";
  return (
    <div className={["rounded-[32px] border p-8", dark ? "border-white/10 bg-white/[0.05] text-white" : "border-black/10 bg-white/60 text-zinc-950", className].join(" ")}>
      <p className={["font-display text-[72px] font-bold leading-none tracking-[-0.05em]", dark ? "text-red-400" : "text-red-500"].join(" ")}>{value}</p>
      <p className="font-display mt-5 text-[24px] font-semibold">{label}</p>
      {note ? <p className="mt-3 text-[19px] leading-[1.45] opacity-65">{note}</p> : null}
    </div>
  );
}
