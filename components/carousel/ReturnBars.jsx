import {fmtBarValue, barDecimals, barsFit, FULL_BUDGET} from "@/lib/studio/market";

// Grouped horizontal bars with signed values (returns by period, yield by fund...).
// groups: [{label, bars: [{name, value:number, highlight?}]}], unit?: "%", signed?: boolean
export default function ReturnBars({groups = [], unit = "", signed = true, budget = FULL_BUDGET, dark = false, className = ""}) {
  const max = Math.max(...groups.flatMap((g) => g.bars.map((b) => Math.abs(b.value))), 1);
  const dec = barDecimals(groups);
  return (
    <div className={["mkt mkt-bars", className].join(" ")} data-dark={dark ? "true" : "false"} style={barsFit(groups, budget)}>
      {groups.map((g, gi) => (
        <div key={gi} className="mkt-bars-group">
          <p className="mkt-bars-label">{g.label}</p>
          {g.bars.map((b, bi) => (
            <div key={bi} className="mkt-bars-row" data-sign={b.value < 0 ? "down" : "up"} data-hi={b.highlight ? "yes" : "no"}>
              <span className="mkt-bars-name">{b.name}</span>
              <span className="mkt-bars-track"><span className="mkt-bars-fill" style={{width: Math.max((Math.abs(b.value) / max) * 100, 2).toFixed(1) + "%"}} /></span>
              <span className="mkt-bars-val">{fmtBarValue(b.value, dec, signed)}{unit}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
