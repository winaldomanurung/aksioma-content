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
    </section>
  );
}
