// Numbered footnotes ("catatan kaki") for sources, caveats and definitions.
export default function Footnote({ items = [], dark = false, className = "" }) {
  return (
    <ol className={["grid gap-2", className].join(" ")}>
      {items.map((item, index) => (
        <li key={index} className={["flex items-start gap-3 text-[17px] leading-[1.5]", dark ? "text-zinc-300" : "text-zinc-500"].join(" ")}>
          <span className={["font-display mt-[3px] flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full text-[12px] font-bold", dark ? "bg-white/15 text-white" : "bg-zinc-200 text-zinc-700"].join(" ")}>{index + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  );
}
