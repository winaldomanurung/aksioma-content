import {FULL_BUDGET, rowFit, gaugeCols} from "@/lib/studio/market";

// Ring gauges for scores or percentages the author supplies (0-100).
// items: [{label, value:0-100, display?: string (centre text, default "72%"), note?, tone?}]
export default function Gauge({items = [], budget = FULL_BUDGET, dark = false, className = ""}) {
  const n = items.length;
  const cols = gaugeCols(n);
  const rows = Math.ceil(n / cols);
  const style = rowFit(rows, budget, {base: 280, gap: 12, min: 0.85, max: 1.6});
  const rowH = parseInt(style["--row-h"], 10);
  const ring = Math.max(110, Math.min(rowH - 130, n === 1 ? 300 : n === 4 ? 220 : 250));
  return (
    <div className={["mkt mkt-gauge", className].join(" ")} data-dark={dark ? "true" : "false"} style={{...style, "--cols": cols, "--ring": ring + "px"}}>
      {items.map((it, i) => {
        const pct = Math.max(0, Math.min(100, Number(it.value) || 0));
        return (
          <div key={i} className="mkt-gauge-card" data-tone={it.tone || "info"}>
            <div className="mkt-gauge-ring">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle className="mkt-gauge-track" cx="50" cy="50" r="42" pathLength="100" />
                <circle className="mkt-gauge-arc" cx="50" cy="50" r="42" pathLength="100" strokeDasharray={pct + " " + (100 - pct)} transform="rotate(-90 50 50)" />
              </svg>
              <span className="mkt-gauge-value">{it.display || Math.round(pct) + "%"}</span>
            </div>
            <p className="mkt-gauge-label">{it.label}</p>
            {it.note ? <p className="mkt-gauge-note">{it.note}</p> : null}
          </div>
        );
      })}
    </div>
  );
}
