// Term + meaning pairs for jargon the slide depends on.
export default function Glossary({ items = [], dark = false, className = "" }) {
  const card = dark ? "border-white/10 bg-white/[0.06]" : "border-black/10 bg-white/60";
  return (
    <div className={["grid gap-4", className].join(" ")}>
      {items.map((item, index) => (
        <div key={index} className={["rounded-[24px] border px-6 py-5", card].join(" ")}>
          <p className={["font-display text-[24px] font-bold", dark ? "text-red-300" : "text-red-700"].join(" ")}>{item.term}</p>
          <p className={["mt-1 text-[21px] leading-[1.45]", dark ? "text-zinc-300" : "text-zinc-700"].join(" ")}>{item.meaning}</p>
        </div>
      ))}
    </div>
  );
}
