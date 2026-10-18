import localFont from "next/font/local";

// Self-hosted variable fonts (latin subset). No request to Google Fonts at
// build or run time, so `next build`, the dev server and the exporters work
// offline and render identically everywhere. Licenses: ./fonts/LICENSES.md.
//
// Inter and Lexend are the Aksioma brand pair (--font-inter body, --font-lexend
// display). The other three are optional content fonts chosen per carousel
// (see lib/studio/fonts.js and the data-font rules in globals.css). They are
// not preloaded; the browser fetches one only when a slide actually uses it.

const inter = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

const lexend = localFont({
  src: "./fonts/lexend-latin-wght-normal.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-lexend",
});

const jakarta = localFont({
  src: "./fonts/plus-jakarta-sans-latin-wght-normal.woff2",
  weight: "200 800",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-jakarta",
});

const playfair = localFont({
  src: "./fonts/playfair-display-latin-wght-normal.woff2",
  weight: "400 900",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-playfair",
});

const grotesk = localFont({
  src: "./fonts/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  style: "normal",
  display: "swap",
  preload: false,
  variable: "--font-grotesk",
});

export const fontVariableClasses = [inter, lexend, jakarta, playfair, grotesk]
  .map((font) => font.variable)
  .join(" ");
