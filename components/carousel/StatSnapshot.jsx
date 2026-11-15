import {TONES, FULL_BUDGET, rowFit} from "@/lib/studio/market";

// Key metrics at a glance: 2-column grid of big numbers (yield, expense ratio, AUM, PER...).
// items: [{label, value, sub?, tone?: up|down|neutral}]
export default function StatSnapshot({items = [], budget = FULL_BUDGET, dark = false, className = ""}) {
  return (
    <div className={["mkt mkt-snap", className].join(" ")} data-dark={dark ? "true" : "false"} style={rowFit(Math.ceil(items.length / 2), budget, {base: 180, gap: 12})}>
      {items.map((it, i) => (
        <div key={i} className="mkt-snap-card" data-tone={TONES.includes(it.tone) ? it.tone : "neutral"}>
          <p className="mkt-snap-label">{it.label}</p>
          <p className="mkt-snap-value">{it.value}</p>
          {it.sub ? <p className="mkt-snap-sub">{it.sub}</p> : null}
        </div>
      ))}
    </div>
  );
}
