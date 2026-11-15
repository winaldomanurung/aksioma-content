import {FULL_BUDGET, rowFit, fmtNum, decimalsOf} from "@/lib/studio/market";

// Where a value sits between a low and a high (52-week range, day range...).
// items: [{label, low, high, current}] numbers; unit? = prefix such as "$" or "Rp".
export default function RangeBars({items = [], unit = "", budget = FULL_BUDGET, dark = false, className = ""}) {
  const style = rowFit(items.length, budget, {base: 108, gap: 10, min: 0.9});
  return (
    <div className={["mkt mkt-rb", className].join(" ")} data-dark={dark ? "true" : "false"} style={style}>
      {items.map((it, i) => {
        const dec = decimalsOf(it.low, it.high, it.current);
        const pos = Math.max(0, Math.min(1, (it.current - it.low) / (it.high - it.low))) * 100;
        return (
          <div key={i} className="mkt-rb-row">
            <div className="mkt-rb-head">
              <span className="mkt-rb-label">{it.label}</span>
              <span className="mkt-rb-cur">{unit}{fmtNum(it.current, dec)}</span>
            </div>
            <div className="mkt-rb-track">
              <span className="mkt-rb-fill" style={{width: pos.toFixed(1) + "%"}} />
              <span className="mkt-rb-dot" style={{left: pos.toFixed(1) + "%"}} />
            </div>
            <div className="mkt-rb-ends"><span>{unit}{fmtNum(it.low, dec)}</span><span>{unit}{fmtNum(it.high, dec)}</span></div>
          </div>
        );
      })}
    </div>
  );
}
