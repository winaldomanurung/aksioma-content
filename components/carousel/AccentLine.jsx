export default function AccentLine({
  dark = false,
  className = "",
  style,
}) {
  return (
    <span
      aria-hidden="true"
      className={[
        "accent-line",
        dark
          ? "bg-gradient-to-r from-red-400/80 to-transparent"
          : "bg-gradient-to-r from-red-500/80 to-transparent",
        className,
      ].join(" ")}
      style={style}
    />
  );
}
