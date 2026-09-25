export default function CarouselCanvas({
  children,
  className = "",
  slide,
  label,
  type = "generic",
  density = "balanced",
}) {
  return (
    <section
      data-carousel-slide
      data-slide={slide}
      data-slide-type={type}
      data-density={density}
      aria-label={label || "Carousel slide " + slide}
      className={["carousel-slide", className].join(" ")}
    >
      {children}
      <div className="tiktok-safe-overlay" aria-hidden="true" />
    </section>
  );
}
