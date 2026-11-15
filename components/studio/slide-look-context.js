"use client";
import {createContext} from "react";

// Look (lib/studio/looks.js) dari slide yang sedang dirender. CarouselCanvas
// menulisnya sebagai `data-look` pada elemen [data-carousel-slide], sehingga
// preview dan export memakai DOM dan CSS yang sama.
export const SlideLookContext = createContext(null);
