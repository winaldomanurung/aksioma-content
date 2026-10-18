"use client";
import {createContext} from "react";

// The images of the slide currently being rendered. CarouselCanvas (which every
// slide uses) reads it through SlideImageLayer, so images sit inside the exported
// [data-carousel-slide] element without threading a prop through every slide.
export const SlideImagesContext = createContext(null);
