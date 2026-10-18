// Engagement prompt: a question with lettered options (A, B, C…).
export default function PollCard({ question, options = [], cta, dark = false, className = "" }) {
  return (
    <div className={["rounded-[30px] border p-7", dark ? "border-white/10 bg-white/[0.06] text-white" : "border-black/10 bg-white/60 text-zinc-900", className].join(" ")}>
      <h3 className="font-display text-[34px] font-bold leading-[1.18]">{question}</h3>
      <div className="mt-6 grid gap-3">
        {options.map((option, index) => (
          <div key={index} className={["flex items-center gap-4 rounded-full border px-5 py-3", dark ? "border-white/20" : "border-black/15"].join(" ")}>
            <span className={["font-display flex h-9 w-9 flex-none items-center justify-center rounded-full text-[18px] font-bold", dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white"].join(" ")}>{String.fromCharCode(65 + index)}</span>
            <span className="text-[23px] font-semibold leading-[1.3]">{option}</span>
          </div>
        ))}
      </div>
      {cta ? <p className={["mt-5 text-[20px] font-semibold", dark ? "text-red-300" : "text-red-600"].join(" ")}>{cta}</p> : null}
    </div>
  );
}
