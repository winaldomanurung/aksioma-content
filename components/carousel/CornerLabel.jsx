export default function CornerLabel({
  children,
  dark = false,
  className = "",
  style,
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        "corner-label",
        dark ? "text-white/25" : "text-zinc-950/20",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </span>
  );
}
