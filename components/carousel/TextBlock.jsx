// Plain explanatory paragraph (no card), optionally with a small label.
export default function TextBlock({ text, label, size = "md", dark = false, className = "" }) {
  const body = size === "lg" ? "text-[31px] leading-[1.5]" : "text-[25px] leading-[1.55]";
  return (
    <div className={[dark ? "text-zinc-200" : "text-zinc-700", className].join(" ")}>
      {label ? <p className={["font-display mb-3 text-[16px] font-semibold uppercase tracking-[0.14em]", dark ? "text-red-400" : "text-red-600"].join(" ")}>{label}</p> : null}
      <p className={body}>{text}</p>
    </div>
  );
}
