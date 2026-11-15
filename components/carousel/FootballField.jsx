import {FULL_BUDGET, rowFit, fmtNum, decimalsOf} from "@/lib/studio/market";

// Valuation "football field": each row is a low-high fair-value range from one
// method, all on one shared axis, with a vertical line for the current price.
// items: [{label, low, high}], current: number, unit? prefix, currentLabel? (default "Harga")
export default function FootballField({items = [], current, unit = "", currentLabel = "Harga", budget = FULL_BUDGET, dark = false, className = ""}) {
  const style = rowFit(items.length, budget - 44, {base: 84, gap: 8, min: 0.9});
  const all = [...items.flatMap((it) => [it.low, it.high]), current];
  const lo = Math.min(...all), hi = Math.max(...all), pad = (hi - lo) * 0.08 || 1;
  const a = lo - pad, b = hi + pad;
  const at = (v) => (((v - a) / (b - a)) * 100).toFixed(2) + "%";
  const dec = decimalsOf(...all);
  return (
    <div className={["mkt mkt-ff", className].join(" ")} data-dark={dark ? "true" : "false"} style={style}>
      <div className="mkt-ff-body">
        <div className="mkt-ff-plot" aria-hidden="true">
          <span className="mkt-ff-line" style={{left: at(current)}} />
          <span className="mkt-ff-tag" style={{left: at(current)}}>{currentLabel} {unit}{fmtNum(current, dec)}</span>
        </div>
        {items.map((it, i) => (
          <div key={i} className="mkt-ff-row">
            <div className="mkt-ff-id">
              <p className="mkt-ff-name">{it.label}</p>
              <p className="mkt-ff-range">{unit}{fmtNum(it.low, dec)} – {unit}{fmtNum(it.high, dec)}</p>
            </div>
            <div className="mkt-ff-track"><span className="mkt-ff-bar" style={{left: at(it.low), width: ((it.high - it.low) / (b - a) * 100).toFixed(2) + "%"}} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
