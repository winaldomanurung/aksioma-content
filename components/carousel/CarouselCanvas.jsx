export default function CarouselCanvas({
  children,
  className = "",
  slide,
  label,
}) {
  return (
    <section
      data-carousel-slide
      data-slide={slide}
      aria-label={label || "Carousel slide " + slide}
      className={["carousel-slide", className].join(" ")}
    >
      {children}
      <div className="tiktok-safe-overlay" aria-hidden="true" />
    </section>
  );
}
