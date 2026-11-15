import {FULL_BUDGET, cardsFit} from "@/lib/studio/market";

// Two contrast cards whose height FOLLOWS their content (no full-slide stretch),
// meant to sit above another component (signalGrid, statSnapshot, callout...).
// left/right: {label, heading, points?: string[]}; delta = short badge between the cards (default "VS").
function Card({label, heading, points = [], muted}) {
  return (
    <div className={["mkt-cc-card", muted ? "is-muted" : "is-accent"].join(" ")}>
      <p className="mkt-cc-label">{label}</p>
      <p className="mkt-cc-heading">{heading}</p>
      {points.length ? (
        <ul className="mkt-cc-points">
          {points.map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      ) : null}
    </div>
  );
}

export default function CompareCards({left = {}, right = {}, delta = "VS", budget = FULL_BUDGET, dark = false, className = ""}) {
  const maxPoints = Math.max(left.points?.length || 0, right.points?.length || 0);
  return (
    <div className={["mkt mkt-cc", className].join(" ")} data-dark={dark ? "true" : "false"} style={cardsFit(maxPoints, budget)}>
      <Card {...left} muted />
      <Card {...right} />
      <span className="mkt-cc-delta">{delta}</span>
    </div>
  );
}
