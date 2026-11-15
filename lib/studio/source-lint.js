// Validates the Carousel Source text and places every problem at an exact
// character range, so the Studio can underline it and jump to it.

import {parseCarouselSource} from "./schema";
import {scanSource} from "./source-edit";

const keyOf = (path) => path.map(String).join("\u0000");
const pad = (n) => String(n + 1).padStart(2, "0");

function lineOf(source, offset) {
  let line = 1;
  for (let i = 0; i < offset && i < source.length; i++) if (source.charCodeAt(i) === 10) line++;
  return line;
}

// Human label for a path: "Slide 08 · stockList › disclaimerText".
function labelFor(path, slides) {
  if (!path.length) return "Umum";
  if (path[0] === "meta") return ["meta", ...path.slice(1)].join(" › ");
  if (path[0] !== "slides" || path.length < 2) return "slides";
  const slide = slides?.[path[1]];
  const parts = ["Slide " + pad(path[1]) + (slide?.type ? " · " + slide.type : "")];
  let target = slide;
  for (let i = 2; i < path.length; i++) {
    const k = path[i];
    target = target == null ? undefined : target[k];
    if (typeof k === "number") {
      const prev = parts.pop();
      parts.push(prev + "[" + k + "]" + (target && typeof target === "object" && typeof target.type === "string" ? " " + target.type : ""));
    } else parts.push(k);
  }
  return parts.join(" › ");
}

function rangeFor(source, map, issue) {
  if (typeof issue.offset === "number") {
    const from = Math.max(0, Math.min(issue.offset, source.length));
    let to = from;
    while (to < source.length && source[to] !== "\n" && to - from < 1) to++;
    return {from, to: Math.max(to, from)};
  }
  // Walk up the path until something is found in the text.
  for (let n = issue.path.length; n > 0; n--) {
    const hit = map.get(keyOf(issue.path.slice(0, n)));
    if (!hit) continue;
    const from = hit.keyStart ?? hit.start;
    if (hit.kind === "object" || hit.kind === "array") return {from, to: hit.start + 1};
    return {from, to: hit.kind === "string" ? hit.end + 1 : hit.end};
  }
  return {from: 0, to: 0};
}

// → {value, issues}. `value` is the validated carousel or null.
// Each issue: {message, label, slide, path, from, to, line}.
export function lintSource(source) {
  try {
    return {value: parseCarouselSource(source), issues: []};
  } catch (e) {
    const raw = Array.isArray(e?.issues) ? e.issues : [{message: e?.message || String(e), path: [], slide: null}];
    const map = scanSource(source);
    let slides = null;
    if (!raw.some((i) => i.json)) {
      // JSON is well-formed: borrow it for readable labels (component types).
      const outline = map.get(keyOf(["slides"]));
      if (outline) {
        try { slides = JSON.parse(source.slice(outline.start, outline.end)); } catch { slides = null; }
      }
    }
    const issues = raw.map((issue) => {
      const {from, to} = rangeFor(source, map, issue);
      return {
        message: issue.message,
        label: issue.json ? "JSON" : labelFor(issue.path || [], slides),
        slide: issue.slide ?? null,
        path: issue.path || [],
        from,
        to,
        line: lineOf(source, from),
      };
    });
    return {value: null, issues};
  }
}
