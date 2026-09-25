export default function MiniDiagram({
  items = [],
  dark = false,
  className = "",
}) {
  return (
    <div className={["mini-diagram", className].join(" ")}>
      {items.map((item, index) => (
        <div key={item}>
          <div
            className={[
              "mini-diagram-node",
              dark
                ? "border-white/10 bg-white/[0.05] text-zinc-200"
                : "border-black/10 bg-white/60 text-zinc-800",
            ].join(" ")}
          >
            <span className="font-display text-[20px] font-semibold">{item}</span>
          </div>
          {index < items.length - 1 ? (
            <div className={["mini-diagram-arrow", dark ? "text-red-400" : "text-red-500"].join(" ")}>
              ↓
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
