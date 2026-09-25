export default function Callout({ label, children, dark = false, className = "" }) {
  return (
    <div className={["border-l-[5px] py-3 pl-6", dark ? "border-red-400 text-zinc-300" : "border-red-500 text-zinc-700", className].join(" ")}>
      {label ? <p className="font-display mb-2 text-[16px] font-semibold uppercase tracking-[0.14em] text-red-500">{label}</p> : null}
      <div className="text-[23px] leading-[1.5]">{children}</div>
    </div>
  );
}
