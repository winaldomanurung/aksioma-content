import StoredImageBox from "@/components/studio/StoredImageBox";

const HEIGHT = { sm: 300, md: 420, lg: 600 };
const RADIUS = { square: "0px", rounded: "28px" };

// 2 images side by side, 3 as one large + two small, 4 as a 2×2 grid.
export default function Collage({ items = [], size = "md", shape = "rounded", dark = false, className = "" }) {
  const height = HEIGHT[size] || HEIGHT.md;
  const radius = RADIUS[shape] || RADIUS.rounded;
  const n = Math.min(4, Math.max(2, items.length));
  const list = items.slice(0, n);
  const cell = (item, i, style) => (
    <div key={i} style={{ position: "relative", minWidth: 0, minHeight: 0, ...style }}>
      <StoredImageBox id={item.image} radius={radius} dark={dark} />
      {item.caption ? (
        <p className="absolute bottom-3 left-3 right-3 rounded-full px-4 py-1.5 text-[17px] font-semibold leading-[1.3]" style={{ background: "rgba(0,0,0,.62)", color: "#fff", width: "fit-content", maxWidth: "calc(100% - 24px)" }}>{item.caption}</p>
      ) : null}
    </div>
  );
  let areas;
  let columns;
  let rows;
  if (n === 2) { columns = "1fr 1fr"; rows = "1fr"; areas = [{}, {}]; }
  else if (n === 3) { columns = "1.3fr 1fr"; rows = "1fr 1fr"; areas = [{ gridRow: "1 / span 2" }, {}, {}]; }
  else { columns = "1fr 1fr"; rows = "1fr 1fr"; areas = [{}, {}, {}, {}]; }
  return (
    <div className={className} style={{ display: "grid", gap: 16, height, gridTemplateColumns: columns, gridTemplateRows: rows }}>
      {list.map((item, i) => cell(item, i, areas[i]))}
    </div>
  );
}
