export default function SourceNote({ text, label = "Sumber", dark = false, className = "" }) {
  return (
    <p className={["text-[17px] leading-[1.5]", dark ? "text-zinc-300" : "text-zinc-500", className].join(" ")}>
      <span className="font-semibold uppercase tracking-[0.12em]">{label}: </span>{text}
    </p>
  );
}
