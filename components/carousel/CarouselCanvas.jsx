"use client";

import {useContext} from "react";
import SlideImageLayer from "@/components/studio/SlideImageLayer";
import {SlideFontContext} from "@/components/studio/slide-font-context";

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
  // Font preset chosen by the Studio (null elsewhere = the default Aksioma pair).
  const font = useContext(SlideFontContext);

  return (
    <section
      data-carousel-slide
      data-slide={slide}
      data-slide-type={type}
      data-density={density}
      data-theme={theme || undefined}
      data-font={font || undefined}
      data-studio-dark={isDark ? "true" : "false"}
      aria-label={label || "Carousel slide " + slide}
      className={["carousel-slide", className].join(" ")}
    >
      {children}
      <SlideImageLayer />
      <div className="tiktok-safe-overlay" aria-hidden="true" />
    </section>
  );
}
