// Two panels. `slot` reserves a blank tinted area above the text where the
// author can place an uploaded image (slide-level "images").
const SLOT = { md: 230, lg: 340 };
export default function BeforeAfter({ before = {}, after = {}, slot, dark = false, className = "" }) {
  const height = SLOT[slot] || 0;
  const panel = (data, isAfter) => (
    <div className={["rounded-[28px] border p-6", dark ? "border-white/10 bg-white/[0.06] text-white" : "border-black/10 bg-white/60 text-zinc-900", isAfter ? (dark ? "!border-red-400" : "!border-red-400") : ""].join(" ")}>
      {height ? <div className={["mb-5 rounded-[20px]", dark ? "bg-white/10" : "bg-black/[0.06]"].join(" ")} style={{ height }} /> : null}
      <span className={["font-display inline-block rounded-full px-3 py-1 text-[14px] font-bold tracking-[0.12em]", isAfter ? (dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white") : (dark ? "bg-white/20 text-white" : "bg-zinc-200 text-zinc-700")].join(" ")}>{data.label || (isAfter ? "SESUDAH" : "SEBELUM")}</span>
      {data.title ? <h3 className="font-display mt-4 text-[28px] font-bold leading-[1.15]">{data.title}</h3> : null}
      {data.text ? <p className="mt-3 text-[21px] leading-[1.45] opacity-80">{data.text}</p> : null}
    </div>
  );
  return <div className={["primitive-two-column", className].join(" ")}>{panel(before, false)}{panel(after, true)}</div>;
}
