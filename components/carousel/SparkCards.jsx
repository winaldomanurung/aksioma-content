import {FULL_BUDGET, rowFit} from "@/lib/studio/market";

// Metric cards with a small trend line (sparkline) under the value.
// items: [{label, value, sub?, points:[numbers], tone?: "up"|"down"|"neutral"}]
// Tone defaults to the direction of the line (last point vs first point).
function Spark({points}) {
  const min = Math.min(...points), max = Math.max(...points), span = max - min || 1;
  const xy = points.map((p, i) => [(i / (points.length - 1)) * 240, 4 + (1 - (p - min) / span) * 56]);
  const line = xy.map(([x, y], i) => (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1)).join(" ");
  const last = xy[xy.length - 1];
  return (
    <div className="mkt-spk-plot">
      <svg className="mkt-spk-svg" viewBox="0 0 240 64" preserveAspectRatio="none" aria-hidden="true">
        <path className="mkt-spk-area" d={line + " L240 64 L0 64 Z"} />
        <path className="mkt-spk-line" d={line} />
      </svg>
      <span className="mkt-spk-dot" style={{left: "100%", top: ((last[1] / 64) * 100).toFixed(1) + "%"}} />
    </div>
  );
}

export default function SparkCards({items = [], budget = FULL_BUDGET, dark = false, className = ""}) {
  const style = rowFit(Math.ceil(items.length / 2), budget, {base: 200, gap: 12, min: 0.85});
  return (
    <div className={["mkt mkt-spk", className].join(" ")} data-dark={dark ? "true" : "false"} data-single={items.length === 1 ? "yes" : "no"} style={style}>
      {items.map((it, i) => {
        const pts = it.points || [];
        const tone = it.tone || (pts.length > 1 && pts[pts.length - 1] < pts[0] ? "down" : "up");
        return (
          <div key={i} className="mkt-spk-card" data-tone={tone}>
            <p className="mkt-spk-label">{it.label}</p>
            <p className="mkt-spk-value">{it.value}</p>
            {it.sub ? <p className="mkt-spk-sub">{it.sub}</p> : null}
            {pts.length > 1 ? <Spark points={pts} /> : null}
          </div>
        );
      })}
    </div>
  );
}
