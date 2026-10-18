// Font presets a carousel can choose for its slide content.
//
// A preset only re-points the two CSS variables every slide already uses
// (`--font-lexend` = display/headings, `--font-inter` = body), via a
// `data-font` attribute on the slide. The matching rules live in
// app/globals.css; the font files are registered in app/fonts.js.
//
// Brand elements (the cover/CTA wordmark) always keep the Aksioma pair.
//
// Fit note: capacity limits were measured with the default pair. A wider
// font can push a dense slide past the edge, so the Studio's quality check
// (and the export preflight) re-measure the real layout with the chosen font.

export const DEFAULT_FONT = "aksioma";

export const FONT_PRESETS = {
  aksioma: {
    label: "Aksioma",
    display: "Lexend",
    body: "Inter",
    hint: "Identitas default: geometris dan lapang.",
  },
  jakarta: {
    label: "Modern",
    display: "Plus Jakarta Sans",
    body: "Plus Jakarta Sans",
    hint: "Hangat dan ramah; cocok untuk mindset dan edukasi.",
  },
  editorial: {
    label: "Editorial",
    display: "Playfair Display",
    body: "Inter",
    hint: "Judul serif elegan; cocok untuk refleksi, kutipan, dan cerita.",
  },
  grotesk: {
    label: "Teknis",
    display: "Space Grotesk",
    body: "Inter",
    hint: "Tegas dan teknis; cocok untuk data, saham, dan analisis.",
  },
};

export const FONT_IDS = Object.keys(FONT_PRESETS);

export const isFontId = (value) =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(FONT_PRESETS, value);

// Any unknown value falls back to the default instead of throwing.
export const fontOf = (value) => (isFontId(value) ? value : DEFAULT_FONT);
