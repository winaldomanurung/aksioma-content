import {FULL_BUDGET, rowFit, heatCols, fmtNum, decimalsOf} from "@/lib/studio/market";

// Tile heatmap (sector or stock moves). Colour strength follows |change|.
// items: [{name, change:number (%), sub?}]
export default function Heatmap({items = [], budget = FULL_BUDGET, dark = false, className = ""}) {
  const cols = heatCols(items.length);
  const rows = Math.ceil(items.length / cols);
  const style = rowFit(rows, budget, {base: 130, gap: 10, min: 0.85});
  const maxAbs = Math.max(...items.map((it) => Math.abs(it.change)), 0.0001);
  const dec = decimalsOf(...items.map((it) => it.change));
  return (
    <div className={["mkt mkt-heat", className].join(" ")} data-dark={dark ? "true" : "false"} style={{...style, "--cols": cols}}>
      {items.map((it, i) => (
        <div key={i} className="mkt-heat-tile" data-sign={it.change < 0 ? "down" : it.change > 0 ? "up" : "flat"} style={{"--i": (Math.abs(it.change) / maxAbs).toFixed(3)}}>
          <p className="mkt-heat-name">{it.name}</p>
          <p className="mkt-heat-change">{it.change > 0 ? "+" : ""}{fmtNum(it.change, dec)}%</p>
          {it.sub ? <p className="mkt-heat-sub">{it.sub}</p> : null}
        </div>
      ))}
    </div>
  );
}
