// Writes changes made in the visual editor back into the Carousel Source text,
// keeping the user's page.jsx wrapper (if any) intact. Throws when the source
// cannot be parsed, so callers can fall back to leaving the text untouched.

const START = "/* AKSIOMA_STUDIO_JSON_START */";
const END = "/* AKSIOMA_STUDIO_JSON_END */";

function split(source) {
  const text = String(source ?? "");
  const a = text.indexOf(START);
  if (a >= 0) {
    const from = a + START.length;
    const b = text.indexOf(END, from);
    if (b < 0) throw new Error("Penanda AKSIOMA_STUDIO_JSON_END tidak ditemukan.");
    return {head: text.slice(0, from), json: text.slice(from, b), tail: text.slice(b), wrapped: true};
  }
  return {head: "", json: text, tail: "", wrapped: false};
}

export function updateSlideInSource(source, slideIndex, patch) {
  const {head, json, tail, wrapped} = split(source);
  const data = JSON.parse(json);
  if (!data || !Array.isArray(data.slides) || !data.slides[slideIndex]) throw new Error("Slide tidak ditemukan di source.");
  const slide = {...data.slides[slideIndex]};
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || (Array.isArray(value) && value.length === 0)) delete slide[key];
    else slide[key] = value;
  }
  data.slides[slideIndex] = slide;
  const out = JSON.stringify(data, null, 2);
  return wrapped ? head + "\n" + out + "\n" + tail : out;
}

// Finds the character range (inside the string quotes) of the JSON string value
// at `path` (e.g. ["slides", 2, "title"]) in the Carousel Source text.
// Returns {start, end} offsets into `source`, or null if not found / invalid JSON.
export function locateInSource(source, path) {
  let parts;
  try {
    parts = split(source);
  } catch {
    return null;
  }
  const text = parts.json;
  const offset = parts.head.length;
  let i = 0;
  let found = null;
  const target = path.map(String);
  const ws = () => { while (i < text.length && /\s/.test(text[i])) i++; };
  const str = () => {
    const start = i + 1;
    i++;
    while (i < text.length && text[i] !== '"') i += text[i] === "\\" ? 2 : 1;
    const end = i;
    i++;
    return {start, end, raw: text.slice(start, end)};
  };
  const value = (cur) => {
    ws();
    const c = text[i];
    const match = cur.length === target.length && cur.every((k, n) => k === target[n]);
    if (c === '"') {
      const s = str();
      if (match) found = {start: offset + s.start, end: offset + s.end};
    } else if (c === "{") {
      i++; ws();
      if (text[i] === "}") { i++; return; }
      for (;;) {
        ws();
        const k = JSON.parse(`"${str().raw}"`);
        ws(); i++; // colon
        value([...cur, k]);
        ws();
        if (text[i] === ",") { i++; continue; }
        i++; break;
      }
    } else if (c === "[") {
      i++; ws();
      if (text[i] === "]") { i++; return; }
      for (let n = 0; ; n++) {
        value([...cur, String(n)]);
        ws();
        if (text[i] === ",") { i++; continue; }
        i++; break;
      }
    } else {
      while (i < text.length && !/[,\]}\s]/.test(text[i])) i++;
    }
  };
  try {
    value([]);
  } catch {
    return null;
  }
  return found;
}
