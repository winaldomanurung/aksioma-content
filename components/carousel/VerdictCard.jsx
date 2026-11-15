import {STOCK_SIGNALS} from "@/lib/studio/stock";
import {FULL_BUDGET, textFit} from "@/lib/studio/market";

// Closing assessment: signal pill, headline, short reasoning, up to 3 reasons, one caution.
// verdict: buy|accumulate|hold|watch|sell. This is a view, not a recommendation to trade.
export default function VerdictCard({verdict = "watch", title, text, reasons = [], caution, budget = FULL_BUDGET, dark = false, className = ""}) {
  const v = STOCK_SIGNALS[verdict] ? verdict : "watch";
  return (
    <div className={["mkt mkt-verdict", className].join(" ")} data-dark={dark ? "true" : "false"} data-verdict={v} style={textFit(budget)}>
      <span className="mkt-verdict-pill">{STOCK_SIGNALS[v]}</span>
      <p className="mkt-verdict-title">{title}</p>
      {text ? <p className="mkt-verdict-text">{text}</p> : null}
      {reasons.length ? (
        <ul className="mkt-verdict-reasons">
          {reasons.map((r, i) => <li key={i}>{r}</li>)}
        </ul>
      ) : null}
      {caution ? <p className="mkt-verdict-caution"><strong>Waspada</strong>{caution}</p> : null}
    </div>
  );
}
