// Four quadrants in order: top-left, top-right, bottom-left, bottom-right.
// Top = yAxis.high, right = xAxis.high.
export default function Matrix2x2({ xAxis = {}, yAxis = {}, quadrants = [], dark = false, className = "" }) {
  const label = ["text-[17px] font-semibold uppercase tracking-[0.12em]", dark ? "text-zinc-300" : "text-zinc-500"].join(" ");
  const card = ["rounded-[26px] border p-6", dark ? "border-white/10 bg-white/[0.06] text-white" : "border-black/10 bg-white/60 text-zinc-900"].join(" ");
  const accent = ["border-red-300", dark ? "bg-red-400/15" : "bg-red-50"].join(" ");
  return (
    <div className={["grid gap-4", className].join(" ")} style={{ gridTemplateColumns: "44px minmax(0,1fr) minmax(0,1fr)" }}>
      <div />
      <p className={label + " text-left"}>{xAxis.low ? "← " + xAxis.low : ""}</p>
      <p className={label + " text-right"}>{xAxis.high ? xAxis.high + " →" : ""}</p>
      <p className={label + " flex items-center justify-center"} style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{yAxis.high ? yAxis.high + " →" : ""}</p>
      {[0, 1].map((i) => <Cell key={i} q={quadrants[i]} card={card} accent={i === 1 ? accent : ""} />)}
      <p className={label + " flex items-center justify-center"} style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>{yAxis.low ? yAxis.low + " →" : ""}</p>
      {[2, 3].map((i) => <Cell key={i} q={quadrants[i]} card={card} accent="" />)}
    </div>
  );
}

function Cell({ q = {}, card, accent }) {
  return (
    <div className={[card, accent].join(" ")}>
      <h3 className="font-display text-[28px] font-bold leading-[1.15]">{q.title}</h3>
      {q.text ? <p className="mt-3 text-[20px] leading-[1.45] opacity-80">{q.text}</p> : null}
    </div>
  );
}
