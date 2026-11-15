import {STOCK_SIGNALS} from "@/lib/studio/stock";
import {FULL_BUDGET, rowFit} from "@/lib/studio/market";

// Two stocks side by side. rows: [{label, left, right, better?: "left"|"right"}].
export default function StockCompare({left = {}, right = {}, rows = [], disclaimer = true, budget = FULL_BUDGET, dark = false, className = ""}) {
  // heads (124) + gap (14) + optional disclaimer (about 50) are fixed; rows take the rest.
  const rowBudget = budget - 138 - (disclaimer ? 50 : 0);
  const head = (side, data) => (
    <div className="mkt-cmp-head" data-side={side} data-signal={STOCK_SIGNALS[data.signal] ? data.signal : "none"}>
      <span className="mkt-cmp-ticker">{data.ticker}</span>
      {data.name ? <span className="mkt-cmp-name">{data.name}</span> : null}
      {STOCK_SIGNALS[data.signal] ? <span className="mkt-pill">{STOCK_SIGNALS[data.signal]}</span> : null}
    </div>
  );
  return (
    <div className={["mkt mkt-cmp", className].join(" ")} data-dark={dark ? "true" : "false"} style={rowFit(rows.length, rowBudget, {base: 68, gap: 8, max: 1.7})}>
      <div className="mkt-cmp-heads">
        {head("left", left)}
        <span className="mkt-cmp-vs">VS</span>
        {head("right", right)}
      </div>
      <div className="mkt-cmp-rows">
        {rows.map((row, i) => (
          <div key={i} className="mkt-cmp-row">
            <span className="mkt-cmp-val" data-better={row.better === "left" ? "yes" : "no"}>{String(row.left)}</span>
            <span className="mkt-cmp-label">{row.label}</span>
            <span className="mkt-cmp-val" data-better={row.better === "right" ? "yes" : "no"}>{String(row.right)}</span>
          </div>
        ))}
      </div>
      {disclaimer ? <p className="mkt-note">Perbandingan berdasarkan data yang diinput, bukan ajakan membeli atau menjual.</p> : null}
    </div>
  );
}
