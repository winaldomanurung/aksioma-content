import {CHART_LIMITS, LEVEL_KINDS, fmtPrice} from "@/lib/studio/market";

// Line or candlestick chart from user-supplied numbers, with optional horizontal
// levels (entry / target / cut loss / support / resistance). Pure SVG, fixed size.
const W = 960;
const H = 500;
const PAD = {l: 16, r: 168, t: 22, b: 44};

export default function PriceChart({
  candles, points, levels = [], title, caption, from, to, dark = false, className = "",
}) {
  const isCandle = Array.isArray(candles) && candles.length > 0;
  const series = isCandle ? candles : Array.isArray(points) ? points : [];
  const n = series.length;
  const lv = (levels || [])
    .map((l) => ({...l, value: typeof l?.value === "string" ? Number(l.value.replace(",", ".")) : l?.value}))
    .filter((l) => Number.isFinite(l.value));
  const values = isCandle ? candles.flatMap((c) => [c.h, c.l]) : points || [];
  const all = [...values, ...lv.map((l) => l.value)].filter(Number.isFinite);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const min = lo - span * 0.06;
  const max = hi + span * 0.06;
  const pw = W - PAD.l - PAD.r;
  const ph = H - PAD.t - PAD.b;
  const x = (i) => PAD.l + (n <= 1 ? pw / 2 : (i + 0.5) * (pw / n));
  const y = (v) => PAD.t + ph - ((v - min) / (max - min)) * ph;
  const step = pw / Math.max(n, 1);
  const ticks = [0, 1, 2, 3, 4].map((k) => { const v = min + ((max - min) * k) / 4; return max - min >= 20 ? Math.round(v) : v; });

  const linePath = !isCandle ? points.map((v, i) => (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1)).join(" ") : "";
  const areaPath = !isCandle && n ? linePath + " L" + x(n - 1).toFixed(1) + " " + (PAD.t + ph) + " L" + x(0).toFixed(1) + " " + (PAD.t + ph) + " Z" : "";

  return (
    <figure className={["mkt mkt-chart", className].join(" ")} data-dark={dark ? "true" : "false"}>
      {title ? <figcaption className="mkt-chart-title">{title}</figcaption> : null}
      <svg viewBox={"0 0 " + W + " " + H} width="100%" role="img" aria-label={title || "Grafik harga"} className="mkt-chart-svg">
        {ticks.map((t, k) => (
          <g key={k}>
            <line className="mkt-grid" x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
            <text className="mkt-axis" x={W - PAD.r + 10} y={y(t) + 5}>{fmtPrice(t)}</text>
          </g>
        ))}
        {!isCandle && n ? <path className="mkt-area" d={areaPath} /> : null}
        {!isCandle && n ? <path className="mkt-line" d={linePath} /> : null}
        {isCandle
          ? candles.map((c, i) => {
              const up = c.c >= c.o;
              const bw = Math.max(3, Math.min(26, step * 0.62));
              const top = y(Math.max(c.o, c.c));
              const bh = Math.max(2, Math.abs(y(c.o) - y(c.c)));
              return (
                <g key={i} className={up ? "mkt-candle mkt-up" : "mkt-candle mkt-down"}>
                  <line x1={x(i)} x2={x(i)} y1={y(c.h)} y2={y(c.l)} />
                  <rect x={x(i) - bw / 2} y={top} width={bw} height={bh} rx="2" />
                </g>
              );
            })
          : null}
        {lv.map((l, i) => {
          const kind = LEVEL_KINDS[l.kind] ? l.kind : "support";
          const label = l.label || LEVEL_KINDS[kind];
          return (
            <g key={i} className={"mkt-level mkt-level-" + kind}>
              <line x1={PAD.l} x2={W - PAD.r + 4} y1={y(l.value)} y2={y(l.value)} />
              <rect x={W - PAD.r + 8} y={y(l.value) - 15} width={PAD.r - 12} height="30" rx="8" />
              <text x={W - PAD.r + 16} y={y(l.value) + 5}>{label + " " + fmtPrice(l.value)}</text>
            </g>
          );
        })}
        {from ? <text className="mkt-axis" x={PAD.l} y={H - 10}>{from}</text> : null}
        {to ? <text className="mkt-axis" x={W - PAD.r} y={H - 10} textAnchor="end">{to}</text> : null}
      </svg>
      {caption ? <p className="mkt-chart-caption">{caption}</p> : null}
    </figure>
  );
}
