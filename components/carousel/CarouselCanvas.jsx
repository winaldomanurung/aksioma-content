export default function CarouselCanvas({
  children,
  className = "",
  slide,
  label,
  type = "generic",
  density = "balanced",
  theme,
  isDark,
}) {
  return (
    <section
      data-carousel-slide
      data-slide={slide}
      data-slide-type={type}
      data-density={density}
      data-theme={theme || undefined}
      data-studio-dark={isDark ? "true" : "false"}
      aria-label={label || "Carousel slide " + slide}
      className={["carousel-slide", className].join(" ")}
    >
      {children}
      <div className="tiktok-safe-overlay" aria-hidden="true" />
    </section>
  );
}
