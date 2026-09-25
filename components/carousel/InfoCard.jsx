export default function InfoCard({ eyebrow, title, children, variant = "soft", className = "" }) {
  const variants = {
    soft: "border-black/10 bg-white/60 text-zinc-900",
    outline: "border-black/15 bg-transparent text-zinc-900",
    accent: "border-red-200 bg-gradient-to-br from-red-50 to-orange-50 text-zinc-900",
    dark: "border-white/10 bg-white/[0.05] text-white",
    glass: "border-white/15 bg-white/10 text-white backdrop-blur-sm",
  };

  return (
    <div className={["rounded-[30px] border p-7", variants[variant] || variants.soft, className].join(" ")}>
      {eyebrow ? <p className="font-display text-[16px] font-semibold uppercase tracking-[0.14em] opacity-60">{eyebrow}</p> : null}
      {title ? <h3 className="font-display mt-3 text-[30px] font-bold leading-[1.12]">{title}</h3> : null}
      <div className="mt-4 text-[22px] leading-[1.45] opacity-80">{children}</div>
    </div>
  );
}
