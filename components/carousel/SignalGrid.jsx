import {SIGNAL_DIRS, FULL_BUDGET, rowFit} from "@/lib/studio/market";

// Indicator read-out (RSI, MACD, MA, volume...): direction badge, name, short reading.
// items: [{name, reading, signal: up|down|flat}]
export default function SignalGrid({items = [], budget = FULL_BUDGET, dark = false, className = ""}) {
  return (
    <div className={["mkt mkt-sig", className].join(" ")} data-dark={dark ? "true" : "false"} style={rowFit(items.length, budget, {base: 92})}>
      {items.map((it, i) => {
        const signal = SIGNAL_DIRS[it.signal] ? it.signal : "flat";
        return (
          <div key={i} className="mkt-sig-row" data-signal={signal}>
            <span className="mkt-sig-badge">{SIGNAL_DIRS[signal]}</span>
            <span className="mkt-sig-name">{it.name}</span>
            <span className="mkt-sig-read">{it.reading}</span>
          </div>
        );
      })}
    </div>
  );
}
