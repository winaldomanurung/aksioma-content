// Labelled flow: 2–5 steps with optional labels on the arrows, and an optional
// two-way fork after the last step.
//
// Layout is wrap-safe: a "row" flow never squeezes more than 3 steps into one
// line. 4 steps become 2 + 2 and 5 steps become 3 + 2, so long labels get a
// readable card width instead of colliding with the arrow labels. Between lines
// a down-arrow carries the `via` label of the step that ends the line above.
// direction "column" keeps one step per line.

const MAX_PER_LINE = 3;

// 1–3 → one line, 4 → 2+2, 5 → 3+2 (balanced lines, left-to-right reading order).
function chunkRow(items) {
  const n = items.length;
  if (n <= MAX_PER_LINE) return [items];
  const first = Math.ceil(n / 2);
  return [items.slice(0, first), items.slice(first)];
}

export default function Flow({ items = [], direction = "row", fork = [], dark = false, className = "" }) {
  const row = direction !== "column";
  const node = dark ? "border-white/12 bg-white/[0.07] text-white" : "border-black/10 bg-white/70 text-zinc-900";
  const arrow = dark ? "text-red-400" : "text-red-500";
  const muted = dark ? "text-zinc-400" : "text-zinc-500";
  const lines = row ? chunkRow(items) : items.map((item) => [item]);

  const card = (item) => (
    <div className={["min-w-0 flex-1 rounded-[22px] border px-4 py-4 text-center [overflow-wrap:anywhere]", node].join(" ")}>
      <p className="font-display text-[21px] font-semibold leading-[1.2]">{item.label}</p>
      {item.note ? <p className={["mt-1 text-[16px] leading-[1.35]", muted].join(" ")}>{item.note}</p> : null}
    </div>
  );

  // Arrow between two steps. `down` is used between lines and in column mode.
  const connector = (via, down) => (
    <div className={["flex flex-none items-center justify-center self-center", down ? "flex-row gap-2 py-0" : "mx-1.5 min-w-[44px] flex-col"].join(" ")}>
      {via ? (
        <span className={["whitespace-nowrap text-center text-[12px] font-semibold uppercase leading-[1.15] tracking-[0.06em]", muted].join(" ")}>{via}</span>
      ) : null}
      <span className={["font-display text-[24px] leading-none", arrow].join(" ")}>{down ? "↓" : "→"}</span>
    </div>
  );

  return (
    <div className={["grid gap-5", className].join(" ")}>
      <div className="grid gap-2">
        {lines.map((line, lineIndex) => {
          const lastOfLine = line[line.length - 1];
          const isLastLine = lineIndex === lines.length - 1;
          return (
            <div key={lineIndex} className="grid gap-2">
              <div className="flex items-stretch">
                {line.map((item, index) => (
                  <div key={index} className="flex min-w-0 flex-1 items-stretch">
                    {card(item)}
                    {index < line.length - 1 ? connector(item.via, false) : null}
                  </div>
                ))}
              </div>
              {!isLastLine ? connector(lastOfLine.via, true) : null}
            </div>
          );
        })}
      </div>
      {fork.length ? (
        <div className="grid grid-cols-2 gap-4">
          {fork.map((item, index) => (
            <div key={index} className={["rounded-[22px] border px-5 py-4 [overflow-wrap:anywhere]", node, index === 0 ? "border-red-400/50" : ""].join(" ")}>
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
