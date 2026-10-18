// Comparison table. rows: [{cells:[...]}]; first column is the row label.
export default function DataTable({ columns = [], rows = [], dark = false, className = "" }) {
  const template = { gridTemplateColumns: "repeat(" + columns.length + ", minmax(0, 1fr))" };
  const border = dark ? "border-white/10" : "border-black/10";
  return (
    <div className={["overflow-hidden rounded-[26px] border", border, dark ? "text-white" : "text-zinc-900", className].join(" ")}>
      <div className={["grid", dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white"].join(" ")} style={template}>
        {columns.map((column, i) => (
          <p key={i} className="font-display px-5 py-4 text-[20px] font-bold leading-[1.2]">{column}</p>
        ))}
      </div>
      {rows.map((row, r) => (
        <div key={r} className={["grid border-t", border, r % 2 ? (dark ? "bg-white/[0.04]" : "bg-black/[0.03]") : ""].join(" ")} style={template}>
          {columns.map((_, c) => (
            <p key={c} className={["px-5 py-4 text-[20px] leading-[1.35]", c === 0 ? "font-semibold" : "opacity-85"].join(" ")}>{row.cells?.[c] ?? ""}</p>
          ))}
        </div>
      ))}
    </div>
  );
}
