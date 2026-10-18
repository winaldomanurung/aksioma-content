import {
  STOCK_DISCLAIMER,
  STOCK_LABELS,
  STOCK_SIGNALS,
  stockTier,
} from "@/lib/studio/stock";

// Recommended-stock list: one row per stock, as many rows as `items` has (1-8).
// Layout, sizes and colors live in globals.css (.stock-list). The tier is picked
// from the item count so every count fits one slide (see lib/studio/stock.js).
export default function StockList({
  items = [],
  numbered = true,
  disclaimer = true,
  disclaimerText,
  dark = false,
  className = "",
}) {
  const tier = stockTier(items.length);

  return (
    <div
      className={["stock-list", className].join(" ")}
      data-tier={tier}
      data-numbered={numbered ? "true" : "false"}
      data-dark={dark ? "true" : "false"}
    >
      {items.map((item, index) => {
        const signal = STOCK_SIGNALS[item.signal] ? item.signal : null;
        const action = item.action || (signal ? STOCK_SIGNALS[signal] : "");
        const levels = ["entry", "target", "stop"].filter(
          (key) => item[key] !== undefined && item[key] !== null && String(item[key]).trim() !== ""
        );
        const note = tier === "compact" ? "" : item.note;

        return (
          <div
            key={index}
            className="stock-row"
            data-signal={signal || (action ? "custom" : "none")}
            data-levels={levels.length ? "yes" : "no"}
            data-note={note ? "yes" : "no"}
          >
            {numbered ? <span className="stock-rank">{index + 1}</span> : null}
            <div className="stock-id">
              <span className="stock-ticker">{item.ticker}</span>
              {item.name ? <span className="stock-name">{item.name}</span> : null}
            </div>
            {action ? <span className="stock-signal">{action}</span> : null}
            {levels.length ? (
              <dl className="stock-levels">
                {levels.map((key) => (
                  <div key={key} className="stock-level" data-level={key}>
                    <dt>{STOCK_LABELS[key]}</dt>
                    <dd>{String(item[key])}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {note ? <p className="stock-note">{note}</p> : null}
          </div>
        );
      })}
      {disclaimer ? <p className="stock-disclaimer">{disclaimerText || STOCK_DISCLAIMER}</p> : null}
    </div>
  );
}
