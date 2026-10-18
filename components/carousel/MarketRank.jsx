// Ranked market list: rank, ticker, proportional bar, optional value and % change.
// items: [{ticker, value?, change?, bar?(0-100)}]. tone: up | down | neutral.
const signOf = (text) => {
  const s = String(text ?? "").trim();
  if (!s) return "none";
  if (/^[-−–]/.test(s)) return "down";
  const n = parseFloat(s.replace(/[^0-9.,]/g, "").replace(",", "."));
  if (Number.isFinite(n) && n === 0) return "flat";
  return "up";
};

export default function MarketRank({items = [], tone = "neutral", dark = false, className = ""}) {
  return (
    <div className={["mkt mkt-rank", className].join(" ")} data-dark={dark ? "true" : "false"} data-tone={tone}>
      {items.map((item, i) => {
        const hasValue = item.value !== undefined && item.value !== "";
        const changeSign = signOf(item.change);
        const barSign = tone === "neutral" ? (hasValue ? signOf(item.value) : changeSign) : tone;
        const bar = Number.isFinite(item.bar) ? Math.max(0, Math.min(100, item.bar)) : null;
        return (
          <div key={i} className="mkt-rank-row" data-value={hasValue ? "yes" : "no"}>
            <span className="mkt-rank-no">{i + 1}</span>
            <span className="mkt-rank-ticker">{item.ticker}</span>
            <span className="mkt-rank-track" data-sign={barSign}>
              {bar !== null ? <span className="mkt-rank-fill" style={{width: Math.max(bar, 3) + "%"}} /> : null}
            </span>
            {hasValue ? <span className="mkt-rank-value" data-sign={signOf(item.value)}>{item.value}</span> : null}
            {item.change ? <span className="mkt-rank-change" data-sign={changeSign}>{item.change}</span> : null}
          </div>
        );
      })}
    </div>
  );
}
