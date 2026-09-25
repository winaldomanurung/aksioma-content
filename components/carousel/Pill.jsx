export default function Pill({ children, dark = false, className = "" }) {
  return (
    <span className={["inline-flex w-fit items-center rounded-full border px-4 py-2 text-[16px] font-semibold", dark ? "border-white/10 bg-white/[0.05] text-zinc-300" : "border-black/10 bg-white/60 text-zinc-700", className].join(" ")}>
      {children}
    </span>
  );
}
