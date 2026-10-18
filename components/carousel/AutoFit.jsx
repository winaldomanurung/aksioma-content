"use client";

import { useLayoutEffect, useRef } from "react";

// Safety net for slides whose content is taller than the content area.
// Instead of letting text overlap the eyebrow, the extras or the footer, the whole
// `.slide-body` is zoomed down in small steps until it fits, down to MIN_ZOOM.
// If it still does not fit at MIN_ZOOM the overflow stays visible to the Studio
// validator, which asks the author to shorten the copy.
//
// - Runs synchronously in a layout effect (before paint) and again once fonts are loaded,
//   so preview and JPEG export see the same final layout. No animation, no randomness.
// - Slides that already fit are never touched (zoom stays 1).
// - Capacity measurement opts out with data-autofit="off" on `.carousel-stage`.
const MIN_ZOOM = 0.84;
const STEP = 0.02;
const TOLERANCE = 1;

export function fitSlide(slide) {
  const stage = slide.closest("[data-autofit]");
  if (stage && stage.getAttribute("data-autofit") === "off") return 1;
  const body = slide.querySelector(".slide-body");
  const content = slide.querySelector(".slide-content");
  if (!body || !content) return 1;

  const overflows = () => {
    const limit = content.getBoundingClientRect().bottom + TOLERANCE;
    for (const part of body.querySelectorAll(":scope > .slide-main, :scope > .slide-extras")) {
      if (part.getBoundingClientRect().bottom > limit) return true;
    }
    return false;
  };

  body.style.zoom = "";
  let zoom = 1;
  while (overflows() && zoom - STEP >= MIN_ZOOM - 1e-9) {
    zoom = Math.round((zoom - STEP) * 100) / 100;
    body.style.zoom = String(zoom);
  }
  if (zoom === 1) {
    delete slide.dataset.fit;
  } else {
    slide.dataset.fit = String(zoom);
  }
  return zoom;
}

export default function AutoFit() {
  const probe = useRef(null);
  useLayoutEffect(() => {
    const slide = probe.current?.closest("[data-carousel-slide]");
    if (!slide) return undefined;
    fitSlide(slide);
    let alive = true;
    const refit = () => { if (alive) fitSlide(slide); };
    if (document.fonts?.ready) document.fonts.ready.then(refit);
    document.fonts?.addEventListener?.("loadingdone", refit);
    return () => {
      alive = false;
      document.fonts?.removeEventListener?.("loadingdone", refit);
    };
  });

  return <i ref={probe} aria-hidden="true" style={{ display: "none" }} />;
}
