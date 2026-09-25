export default function KeywordCluster({
  items = [],
  dark = false,
  className = "",
}) {
  return (
    <div className={["keyword-cluster", className].join(" ")}>
      {items.map((item) => (
        <span
          key={item}
          className={[
            "keyword-chip",
            dark
              ? "border-white/10 bg-white/[0.05] text-zinc-300"
              : "border-black/10 bg-white/55 text-zinc-700",
          ].join(" ")}
        >
          {item}
        </span>
      ))}
    </div>
  );
}
