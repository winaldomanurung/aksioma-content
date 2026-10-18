"use client";
import {createContext} from "react";

// The font preset (see lib/studio/fonts.js) of the slide currently being
// rendered. CarouselCanvas, which every slide uses, reads it and writes it to
// the exported [data-carousel-slide] element as `data-font`, so the font is
// part of the same DOM that preview and export both render.
export const SlideFontContext = createContext(null);
