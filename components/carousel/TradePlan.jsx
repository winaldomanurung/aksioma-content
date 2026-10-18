import {PLAN_KINDS} from "@/lib/studio/market";

// Scenario plan: up / base / down cases with a trigger, optional target, and a risk line.
export default function TradePlan({ticker, scenarios = [], risk, dark = false, className = ""}) {
  return (
    <div className={["mkt mkt-plan", className].join(" ")} data-dark={dark ? "true" : "false"}>
      {ticker ? <p className="mkt-plan-ticker">{ticker}</p> : null}
      {scenarios.map((s, i) => {
        const kind = PLAN_KINDS[s.kind] ? s.kind : "base";
        return (
          <div key={i} className="mkt-plan-card" data-kind={kind}>
            <div className="mkt-plan-top">
              <span className="mkt-plan-kind">{PLAN_KINDS[kind]}</span>
              {s.target ? <span className="mkt-plan-target">{s.target}</span> : null}
            </div>
            <p className="mkt-plan-trigger">{s.trigger}</p>
            {s.note ? <p className="mkt-plan-note">{s.note}</p> : null}
          </div>
        );
      })}
      {risk ? <p className="mkt-plan-risk"><strong>Risiko</strong>{risk}</p> : null}
    </div>
  );
}
