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

// Same idea for the carousel-level `meta` object (for example meta.font).
// A patch value of undefined removes the key.
export function updateMetaInSource(source, patch) {
  const {head, json, tail, wrapped} = split(source);
  const data = JSON.parse(json);
  if (!data || typeof data !== "object" || !data.meta || typeof data.meta !== "object") throw new Error("meta tidak ditemukan di source.");
  const meta = {...data.meta};
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined) delete meta[key];
    else meta[key] = value;
  }
  data.meta = meta;
  const out = JSON.stringify(data, null, 2);
  return wrapped ? head + "\n" + out + "\n" + tail : out;
}

// Walks the JSON text of the Carousel Source once and records where every
// value sits. Tolerant: on malformed JSON it returns whatever it reached.
// Each entry: {start, end, keyStart, kind, raw} with offsets into `source`
// (strings: start/end are inside the quotes).
export function scanSource(source) {
  const map = new Map();
  let parts;
  try {
    parts = split(source);
  } catch {
    return map;
  }
  const text = parts.json;
  const offset = parts.head.length;
  let i = 0;
  const ws = () => { while (i < text.length && /\s/.test(text[i])) i++; };
  const str = () => {
    const start = i + 1;
    i++;
    while (i < text.length && text[i] !== '"') i += text[i] === "\\" ? 2 : 1;
    const end = i;
    i++;
    return {start, end, raw: text.slice(start, end)};
  };
  const record = (cur, entry) => map.set(cur.join("\u0000"), {...entry, start: offset + entry.start, end: offset + entry.end, keyStart: entry.keyStart === undefined ? undefined : offset + entry.keyStart});
  const value = (cur, keyStart) => {
    ws();
    const c = text[i];
    if (c === '"') {
      const s = str();
      record(cur, {start: s.start, end: s.end, keyStart, kind: "string", raw: s.raw});
    } else if (c === "{") {
      const start = i;
      i++; ws();
      if (text[i] === "}") { i++; record(cur, {start, end: i, keyStart, kind: "object"}); return; }
      for (;;) {
        ws();
        if (text[i] !== '"') break; // malformed key: stop
        const ks = i;
        const k = JSON.parse(`"${str().raw}"`);
        ws(); i++; // colon
        value([...cur, k], ks);
        ws();
        if (text[i] === ",") { i++; continue; }
        i++; break;
      }
      record(cur, {start, end: i, keyStart, kind: "object"});
    } else if (c === "[") {
      const start = i;
      i++; ws();
      if (text[i] === "]") { i++; record(cur, {start, end: i, keyStart, kind: "array"}); return; }
      for (let n = 0; ; n++) {
        const before = i;
        value([...cur, String(n)]);
        ws();
        if (text[i] === ",") { i++; continue; }
        if (i === before) break;
        i++; break;
      }
      record(cur, {start, end: i, keyStart, kind: "array"});
    } else {
      const start = i;
      while (i < text.length && !/[,\]}\s]/.test(text[i])) i++;
      if (i > start) record(cur, {start, end: i, keyStart, kind: "scalar", raw: text.slice(start, i)});
    }
  };
  try {
    value([]);
  } catch {
    /* partial map is still useful */
  }
  return map;
}

const keyOf = (path) => path.map(String).join("\u0000");

// Range of the value at `path` (any JSON type), or null.
export function locateValue(source, path, map = scanSource(source)) {
  return map.get(keyOf(path)) || null;
}

// Finds the character range (inside the string quotes) of the JSON string value
// at `path` (e.g. ["slides", 2, "title"]) in the Carousel Source text.
// Returns {start, end} offsets into `source`, or null if not found / invalid JSON.
export function locateInSource(source, path) {
  const hit = locateValue(source, path);
  return hit && hit.kind === "string" ? {start: hit.start, end: hit.end} : null;
}

const decode = (entry) => {
  if (!entry || entry.kind !== "string") return "";
  try { return JSON.parse(`"${entry.raw}"`); } catch { return entry.raw; }
};

// One entry per slide: where it starts/ends in the source plus a short label.
export function slideOutline(source, map = scanSource(source)) {
  const out = [];
  for (let n = 0; ; n++) {
    const hit = map.get(keyOf(["slides", n]));
    if (!hit) break;
    const get = (...p) => decode(map.get(keyOf(["slides", n, ...p])));
    const type = get("type");
    const title = get("title") || get("lead") || get("causeTitle") || get("nodes", 0, "title") || get("nodes", 0, "quote") || get("eyebrow") || get("nodes", 0, "text");
    out.push({index: n, start: hit.start, end: hit.end, type, title});
  }
  return out;
}
