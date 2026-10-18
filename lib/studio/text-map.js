// Maps text rendered in a slide's DOM back to the string field in the slide JSON
// that produced it, so the preview can be edited in place and linked to the source.

const SKIP_KEYS = new Set(["type", "theme", "vertical", "decorations", "images", "id", "icon", "font"]);

export const normText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

// Every string leaf of a slide as {path, value}, in document (key) order.
export function collectStrings(value, path = [], out = []) {
  if (typeof value === "string") {
    if (normText(value)) out.push({path, value});
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => collectStrings(item, [...path, i], out));
  } else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (path.length === 0 && SKIP_KEYS.has(key)) continue;
      collectStrings(item, [...path, key], out);
    }
  }
  return out;
}

// Returns Map<Element, path>. Matching is by normalized text, deepest element
// first, consuming duplicate strings in order. Unmatched text stays read-only.
export function buildTextMap(root, slide) {
  const map = new Map();
  if (!root || !slide) return map;
  const pending = new Map();
  for (const leaf of collectStrings(slide)) {
    const key = normText(leaf.value);
    if (!pending.has(key)) pending.set(key, []);
    pending.get(key).push(leaf.path);
  }
  for (const el of root.querySelectorAll("*")) {
    if (el.closest("svg")) continue;
    const text = normText(el.textContent);
    if (!text || !pending.has(text)) continue;
    const childSame = Array.from(el.children).some((c) => normText(c.textContent) === text);
    if (childSame) continue;
    const paths = pending.get(text);
    if (!paths.length) continue;
    map.set(el, paths.shift());
  }
  return map;
}
