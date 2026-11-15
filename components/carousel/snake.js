// Snake (boustrophedon) placement for step chains that wrap onto several lines.
//
// Line 1 runs left → right, line 2 right → left, line 3 left → right, and so on.
// The step after a turn always sits directly below the step before it, so the
// connector between lines is a short ↓ under that column instead of a long
// diagonal jump back to the left edge. A short last line on a reversed row is
// right-aligned for the same reason.
//
// Grid model: card columns sit at odd grid columns (1, 3, 5 …) with a connector
// column between each pair; card lines sit at odd grid rows with a connector row
// between each pair of lines.

export function snakeLayout(count, cols) {
  const perLine = Math.max(1, Math.min(cols, count || 1));
  const cells = [];
  for (let i = 0; i < count; i++) {
    const line = Math.floor(i / perLine);
    const k = i % perLine;
    const reversed = line % 2 === 1;
    const col = reversed ? perLine - 1 - k : k;
    cells.push({ index: i, line, col, gridColumn: col * 2 + 1, gridRow: line * 2 + 1 });
  }

  // Connector from step i to step i+1.
  const connectors = [];
  for (let i = 0; i < count - 1; i++) {
    const a = cells[i];
    const b = cells[i + 1];
    if (a.line === b.line) {
      const left = Math.min(a.col, b.col);
      connectors.push({ from: i, kind: b.col > a.col ? "right" : "left", gridColumn: left * 2 + 2, gridRow: a.gridRow });
    } else {
      connectors.push({ from: i, kind: "down", gridColumn: a.gridColumn, gridRow: a.gridRow + 1 });
    }
  }

  const lines = count ? cells[count - 1].line + 1 : 0;
  return { perLine, lines, cells, connectors };
}

// grid-template-columns: `card gap card gap card`, connector width given.
export function snakeColumns(perLine, connector = "44px") {
  const parts = [];
  for (let c = 0; c < perLine; c++) {
    if (c > 0) parts.push(connector);
    parts.push("minmax(0, 1fr)");
  }
  return parts.join(" ");
}

export const ARROW = { right: "→", left: "←", down: "↓" };
