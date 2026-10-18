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
