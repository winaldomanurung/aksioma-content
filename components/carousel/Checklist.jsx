export default function Checklist({ items = [], dark = false, className = "" }) {
  return (
    <div className={["grid gap-4", className].join(" ")}>
      {items.map((item) => (
        <div key={item} className="flex items-start gap-4">
          <span className={["font-display mt-1 flex h-7 w-7 flex-none items-center justify-center rounded-full text-[14px] font-bold", dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white"].join(" ")}>✓</span>
          <p className={["text-[22px] leading-[1.45]", dark ? "text-zinc-300" : "text-zinc-700"].join(" ")}>{item}</p>
        </div>
      ))}
    </div>
  );
}
