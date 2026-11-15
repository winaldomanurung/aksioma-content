import {LEVEL_KINDS, FULL_BUDGET, rowFit} from "@/lib/studio/market";

// Price ladder written top (highest) to bottom, as the author orders it.
// items: [{kind: entry|target|stop|support|resistance, value, label?, current?}]
export default function PriceLevels({items = [], budget = FULL_BUDGET, dark = false, className = ""}) {
  return (
    <div className={["mkt mkt-lvl", className].join(" ")} data-dark={dark ? "true" : "false"} style={rowFit(items.length, budget, {base: 88})}>
      {items.map((it, i) => {
        const kind = LEVEL_KINDS[it.kind] ? it.kind : "support";
        return (
          <div key={i} className="mkt-lvl-row" data-kind={kind} data-current={it.current ? "yes" : "no"}>
            <span className="mkt-lvl-kind">{LEVEL_KINDS[kind]}</span>
            <span className="mkt-lvl-label">{it.current ? "Harga sekarang" : it.label}</span>
            <span className="mkt-lvl-value">{it.value}</span>
          </div>
        );
      })}
    </div>
  );
}
