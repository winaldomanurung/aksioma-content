// Pure (server-safe) model for user supplied images placed on a slide.
//
// JSON never contains image bytes. A slide holds
//   "images": [{"id":"foto-1","x":120,"y":300,"width":420,"height":420,"shape":"circle"}]
// and the bytes live in this browser's IndexedDB under the same id.
// Coordinates are canvas pixels on the fixed 1080×1350 slide.

export const CANVAS = {width: 1080, height: 1350};
export const IMAGE_SHAPES = ["square", "rounded", "circle"];
export const IMAGE_FITS = ["cover", "contain"];
export const SHAPE_LABELS = {square: "Kotak", rounded: "Rounded corner", circle: "Lingkaran"};
export const MAX_IMAGES_PER_SLIDE = 6;
export const MIN_IMAGE_SIZE = 48;
export const ID_PATTERN = /^[A-Za-z0-9_-]{1,40}$/;

const isObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const num = (v) => typeof v === "number" && Number.isFinite(v);

export function roundedRadius(image) {
  return Math.round(Math.min(image.width, image.height) * 0.14);
}

export function imageRadius(image) {
  if (image.shape === "circle") return "50%";
  if (image.shape === "rounded") return roundedRadius(image) + "px";
  return "0";
}

// Keep a circle perfectly round and everything inside a sane range.
export function normalizeImage(image) {
  const next = {...image};
  next.width = Math.max(MIN_IMAGE_SIZE, Math.min(CANVAS.width * 1.5, Math.round(next.width)));
  next.height = Math.max(MIN_IMAGE_SIZE, Math.min(CANVAS.height * 1.5, Math.round(next.height)));
  if (next.shape === "circle") {
    const side = Math.round((next.width + next.height) / 2);
    next.width = side;
    next.height = side;
  }
  next.x = Math.round(Math.max(-next.width + 24, Math.min(CANVAS.width - 24, next.x)));
  next.y = Math.round(Math.max(-next.height + 24, Math.min(CANVAS.height - 24, next.y)));
  return next;
}

// Ids are global per browser (they key IndexedDB), so they are random, not 1..n.
export function newImageId(existing = []) {
  const taken = new Set(existing);
  for (let i = 0; i < 50; i += 1) {
    const id = "foto-" + Math.random().toString(36).slice(2, 8);
    if (!taken.has(id)) return id;
  }
  return "foto-" + Date.now().toString(36);
}

// Initial placement: centred, longest side 560 px, aspect ratio preserved.
export function placeNewImage(id, naturalWidth, naturalHeight, count = 0) {
  const longest = 560;
  const ratio = naturalWidth / naturalHeight;
  const width = ratio >= 1 ? longest : Math.round(longest * ratio);
  const height = ratio >= 1 ? Math.round(longest / ratio) : longest;
  const offset = (count % 5) * 36;
  return normalizeImage({id, x: Math.round((CANVAS.width - width) / 2) + offset, y: Math.round((CANVAS.height - height) / 2) + offset, width, height, shape: "rounded", fit: "cover"});
}

export function validateImages(images, where) {
  const fail = (m) => { throw new Error(where + ": " + m); };
  if (!Array.isArray(images) || images.length > MAX_IMAGES_PER_SLIDE) fail("images harus berupa daftar maksimal " + MAX_IMAGES_PER_SLIDE + " gambar.");
  const seen = new Set();
  images.forEach((image, i) => {
    const at = "images[" + i + "]";
    if (!isObject(image)) fail(at + " harus berupa object.");
    if (typeof image.id !== "string" || !ID_PATTERN.test(image.id)) fail(at + ".id harus 1–40 karakter huruf, angka, - atau _.");
    if (seen.has(image.id)) fail(at + ".id duplikat: " + image.id + ".");
    seen.add(image.id);
    for (const key of ["x", "y", "width", "height"]) if (!num(image[key])) fail(at + "." + key + " harus berupa angka.");
    if (image.width < MIN_IMAGE_SIZE || image.height < MIN_IMAGE_SIZE) fail(at + " minimal " + MIN_IMAGE_SIZE + "×" + MIN_IMAGE_SIZE + " px.");
    if (image.width > CANVAS.width * 1.5 || image.height > CANVAS.height * 1.5) fail(at + " terlalu besar untuk kanvas.");
    if (image.x < -image.width || image.x > CANVAS.width || image.y < -image.height || image.y > CANVAS.height) fail(at + " berada sepenuhnya di luar kanvas.");
    if (!IMAGE_SHAPES.includes(image.shape)) fail(at + ".shape harus salah satu dari " + IMAGE_SHAPES.join(", ") + ".");
    if (image.fit !== undefined && !IMAGE_FITS.includes(image.fit)) fail(at + ".fit harus cover atau contain.");
    if (image.alt !== undefined && (typeof image.alt !== "string" || image.alt.length > 160)) fail(at + ".alt harus teks maksimal 160 karakter.");
  });
}

// ---- image slots inside primitives (photoHero, phoneMockup, collage, avatarQuote) ----
// A "slot" is a string field holding an image id. These helpers find, list and
// assign them without knowing each component.
const SLOT_KEYS = new Set(["image", "avatar"]);
const isObj = (v) => v !== null && typeof v === "object";

export function listImageSlots(slide) {
  const slots = [];
  const walk = (value, path, label) => {
    if (Array.isArray(value)) { value.forEach((item, i) => walk(item, [...path, i], label)); return; }
    if (!isObj(value)) return;
    for (const [key, child] of Object.entries(value)) {
      if (SLOT_KEYS.has(key) && (typeof child === "string" || child === undefined)) {
        slots.push({path: [...path, key], id: child || "", label: (value.type || label || "gambar") + (SLOT_KEYS.has(key) && key !== "image" ? " (" + key + ")" : "")});
      } else if (isObj(child)) {
        walk(child, [...path, key], value.type || label);
      }
    }
    if (value.type === "collage" && Array.isArray(value.items)) {
      value.items.forEach((item, i) => {
        if (isObj(item) && !("image" in item)) slots.push({path: [...path, "items", i, "image"], id: "", label: "collage " + (i + 1)});
      });
    }
    // Component types that own an image slot even when the key is still absent.
    if (value.type && SLOT_OWNERS.has(value.type) && !("image" in value) && !("avatar" in value)) {
      slots.push({path: [...path, value.type === "avatarQuote" ? "avatar" : "image"], id: "", label: value.type});
    }
  };
  walk(slide, [], "");
  return slots;
}
const SLOT_OWNERS = new Set(["photoHero", "phoneMockup", "avatarQuote"]);

export function setAtPath(root, path, value) {
  if (!path.length) return value;
  const [head, ...rest] = path;
  const copy = Array.isArray(root) ? [...root] : {...root};
  copy[head] = setAtPath(root ? root[head] : undefined, rest, value);
  if (value === "" && rest.length === 0 && !Array.isArray(copy)) delete copy[head];
  return copy;
}

export function collectImageIds(slide) {
  const ids = new Set();
  (slide?.images || []).forEach((image) => image?.id && ids.add(image.id));
  listImageSlots(slide).forEach((slot) => slot.id && ids.add(slot.id));
  return [...ids];
}

export function validateImageRef(value, where, key = "image") {
  if (value === undefined || value === "") return;
  if (typeof value !== "string" || !ID_PATTERN.test(value)) throw new Error(where + ": " + key + " harus berupa id gambar (1–40 karakter huruf, angka, - atau _) atau dikosongkan.");
}
