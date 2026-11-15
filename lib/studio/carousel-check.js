// Server-side check used by /api/check: the same parser/validator the Studio
// runs on Render, plus the Studio's non-blocking fit and number warnings.
// Layout measuring (fill %, overflow) needs a browser and stays in the Studio.

import {parseCarouselSource} from "./schema";
import {fitWarnings} from "./component-specs";
import {checkNumbers} from "./number-check";

const pad = (n) => String(n + 1).padStart(2, "0");

// Only unwraps a ```json fence (or a BOM) around the object. Nothing inside the
// JSON is rewritten, so what passes here is exactly what the Studio renders.
function stripWrapper(text) {
  const src = String(text ?? "").replace(/^\uFEFF/, "").trim();
  const fence = /```(?:json)?\s*\n([\s\S]*?)\n?```/.exec(src);
  if (fence) return fence[1].trim();
  return src;
}

// → {ok, errors:[string], warnings:[string], slides, title, json}
export function checkCarouselText(text) {
  const source = stripWrapper(text);
  let value;
  try {
    value = parseCarouselSource(source);
  } catch (e) {
    const issues = Array.isArray(e?.issues) ? e.issues : [{message: e?.message || String(e)}];
    return {ok: false, errors: [...new Set(issues.map((i) => i.message))], warnings: [], slides: 0, title: "", json: null};
  }

  const warnings = [];
  const slides = value.slides;
  slides.forEach((slide, i) => fitWarnings(slide).forEach((w) => warnings.push("Slide " + pad(i) + ": " + w)));
  checkNumbers(value).forEach((issue) => warnings.push((Number.isInteger(issue.index) && !/^meta\./.test(issue.message) ? "Slide " + pad(issue.index) + ": " : "") + issue.message));

  // Structure the Studio expects but the validator tolerates.
  if (slides[0]?.type !== "hero") warnings.push("Slide 01: slide pertama sebaiknya type \"hero\".");
  if (slides.length > 1 && slides[slides.length - 1]?.type !== "cta") warnings.push("Slide " + pad(slides.length - 1) + ": slide terakhir sebaiknya type \"cta\".");
  if (slides.length > 20) warnings.push("Carousel berisi " + slides.length + " slide: Instagram maksimal 20 (TikTok 35).");

  return {ok: true, errors: [], warnings: [...new Set(warnings)], slides: slides.length, title: String(value.meta?.title || ""), json: JSON.stringify(value)};
}
