export default function BackgroundWord({
  children,
  dark = false,
  className = "",
  style,
}) {
  return (
    <p
      aria-hidden="true"
      className={[
        "background-word",
        dark ? "background-word--dark" : "background-word--light",
        className,
      ].join(" ")}
      style={style}
    >
      {children}
    </p>
  );
}
