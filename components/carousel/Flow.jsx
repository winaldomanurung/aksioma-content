import { ARROW, snakeColumns, snakeLayout } from "./snake";

// Labelled flow: 2–5 steps with optional labels on the arrows, and an optional
// two-way fork after the last step.
//
// Layout is wrap-safe: a "row" flow never squeezes more than 3 steps into one
// line. 4 steps become 2 + 2 and 5 steps become 3 + 2, so long labels get a
// readable card width instead of colliding with the arrow labels. Lines snake:
// the second line runs right-to-left so the ↓ between lines sits directly under
// the step where the flow turns (see ./snake.js). The ↓ carries that step's `via`.
// direction "column" keeps one step per line.

const MAX_PER_LINE = 3;

// 1–3 → one line, 4 → 2+2, 5 → 3+2 (balanced lines).
function perLineFor(n) {
  if (n <= MAX_PER_LINE) return n;
  return Math.ceil(n / 2);
}

export default function Flow({ items = [], direction = "row", fork = [], dark = false, className = "" }) {
  const row = direction !== "column";
  const node = dark ? "border-white/12 bg-white/[0.07] text-white" : "border-black/10 bg-white/70 text-zinc-900";
  const arrow = dark ? "text-red-400" : "text-red-500";
  const muted = dark ? "text-zinc-400" : "text-zinc-500";
  const layout = snakeLayout(items.length, row ? perLineFor(items.length) : 1);
  const hasVia = items.some((item) => item && item.via);

  const card = (item, cell) => (
    <div
      key={"c" + cell.index}
      style={{ gridColumn: cell.gridColumn, gridRow: cell.gridRow }}
      className={["lk-card studio-fill-card flex min-w-0 flex-col justify-center rounded-[22px] border px-4 py-4 text-center [overflow-wrap:anywhere]", node].join(" ")}
    >
      <p className="font-display text-[21px] font-semibold leading-[1.2]">{item.label}</p>
      {item.note ? <p className={["mt-1 text-[16px] leading-[1.35]", muted].join(" ")}>{item.note}</p> : null}
    </div>
  );

  // Arrow between two steps, placed in its own grid cell.
  const connector = (conn) => {
    const via = items[conn.from] && items[conn.from].via;
    const down = conn.kind === "down";
    return (
      <div
        key={"a" + conn.from}
        style={{ gridColumn: conn.gridColumn, gridRow: conn.gridRow }}
        className={["flex items-center justify-center", down ? "flex-row gap-2 py-1" : "flex-col px-1"].join(" ")}
      >
        {via ? (
          <span className={["text-center text-[12px] font-semibold uppercase leading-[1.15] tracking-[0.06em]", down ? "whitespace-nowrap" : "max-w-[110px]", muted].join(" ")}>{via}</span>
        ) : null}
        <span className={["font-display text-[24px] leading-none", arrow].join(" ")}>{ARROW[conn.kind]}</span>
      </div>
    );
  };

  return (
    <div className={["grid gap-5", className].join(" ")}>
      <div
        className="grid items-stretch gap-x-1.5 gap-y-1"
        style={{ gridTemplateColumns: snakeColumns(layout.perLine, hasVia ? "minmax(44px, auto)" : "44px") }}
      >
        {layout.cells.map((cell) => card(items[cell.index], cell))}
        {layout.connectors.map(connector)}
      </div>
      {fork.length ? (
        <div className="grid grid-cols-2 gap-4">
          {fork.map((item, index) => (
            <div key={index} className={["lk-card studio-fill-card rounded-[22px] border px-5 py-4 [overflow-wrap:anywhere]", node, index === 0 ? "border-red-400/50" : ""].join(" ")}>
              {item.via ? <p className={["mb-1 text-[13px] font-semibold uppercase tracking-[0.1em]", arrow].join(" ")}>{"↳ " + item.via}</p> : null}
              <p className="font-display text-[21px] font-semibold leading-[1.2]">{item.label}</p>
              {item.note ? <p className={["mt-1 text-[16px] leading-[1.35]", muted].join(" ")}>{item.note}</p> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
