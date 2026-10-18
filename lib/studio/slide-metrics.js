// Real-layout checks on rendered 1080×1350 slides (browser only).
// `.slide-content` clips overflow silently, so these measure what actually
// leaves the content area and how much of it is used.

const TOLERANCE = 2;

const snippet = (el) => {
  const t = (el.textContent || "").replace(/\s+/g, " ").trim();
  return t.length > 38 ? t.slice(0, 36) + "…" : t;
};

// Text elements whose boxes intersect even though neither contains the other.
function findCollisions(slideEl) {
  const frame = slideEl.querySelector(".slide-frame") || slideEl;
  const leaves = [];
  for (const el of frame.querySelectorAll("*")) {
    if (el.closest("svg")) continue;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim());
    if (!own) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 4 || r.height < 4) continue;
    if (getComputedStyle(el).visibility === "hidden") continue;
    leaves.push({el, r});
  }
  const found = [];
  for (let i = 0; i < leaves.length; i++) {
    for (let j = i + 1; j < leaves.length; j++) {
      const a = leaves[i], b = leaves[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const w = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left) - 4;
      const h = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top) - 4;
      if (w > 4 && h > 4) found.push({a: snippet(a.el), b: snippet(b.el), w: Math.round(w), h: Math.round(h)});
    }
  }
  return found.slice(0, 6);
}

export function measureSlideElement(slideEl) {
  const content = slideEl.querySelector(".slide-content");
  const body = content?.querySelector(".slide-body");
  if (!content || !body) return {kind: "bookend", fill: null, overflow: 0, overflowX: 0, collisions: findCollisions(slideEl)};
  const box = content.getBoundingClientRect();
  let overflow = Math.max(0, content.scrollHeight - content.clientHeight);
  let overflowX = Math.max(0, content.scrollWidth - content.clientWidth);
  for (const el of content.querySelectorAll(".slide-main *, .slide-extras *")) {
    const r = el.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    overflow = Math.max(overflow, r.bottom - box.bottom);
    overflowX = Math.max(overflowX, r.right - box.right);
  }
  for (const el of content.querySelectorAll("*")) {
    const style = getComputedStyle(el);
    if (style.overflowY !== "visible" && el.scrollHeight - el.clientHeight > TOLERANCE) overflow = Math.max(overflow, el.scrollHeight - el.clientHeight);
  }
  // The main block taller than its box means its content spills over the extras below.
  const mainEl = content.querySelector(".slide-main");
  const squeeze = mainEl ? mainEl.scrollHeight - mainEl.clientHeight : 0;
  const collisions = findCollisions(slideEl);
  const first = content.firstElementChild;
  const eyebrow = first && first !== body ? first.getBoundingClientRect().height : 0;
  const main = content.querySelector(".slide-main")?.getBoundingClientRect().height || 0;
  const extras = content.querySelector(".slide-extras")?.getBoundingClientRect().height || 0;
  const fill = box.height > 0 ? Math.min(1, (eyebrow + main + extras) / box.height) : null;
  return {kind: "content", fill, overflow: overflow > TOLERANCE ? Math.round(overflow) : 0, overflowX: overflowX > TOLERANCE ? Math.round(overflowX) : 0, squeeze: squeeze > TOLERANCE ? Math.round(squeeze) : 0, collisions};
}

export function measureSlides(container) {
  const nodes = container ? [...container.querySelectorAll("[data-carousel-slide]")] : [];
  return nodes.map((el, index) => ({index, ...measureSlideElement(el)}));
}

export const EMPTY_BELOW = 0.6;

// issues: [{index, type, severity: "overflow"|"empty", message}]
export function buildIssues(slides, metrics, platform) {
  const issues = [];
  metrics.forEach((m) => {
    const slide = slides[m.index];
    if (!slide) return;
    const label = "Slide " + String(m.index + 1).padStart(2, "0") + " (" + slide.type + ")";
    const hit = m.collisions?.length ? m.collisions : null;
    if (hit || m.squeeze) {
      const pairs = hit ? hit.slice(0, 3).map((c) => "\"" + c.a + "\" menimpa \"" + c.b + "\"").join("; ") : "isi utama menimpa blok di bawahnya (~" + m.squeeze + " px)";
      issues.push({index: m.index, severity: "overflow", message: label + ": teks bertabrakan — " + pairs + ". Persingkat teks, kurangi item, atau hapus extras."});
    } else if (m.overflow || m.overflowX) {
      issues.push({index: m.index, severity: "overflow", message: label + ": isi terpotong sekitar " + (m.overflow || m.overflowX) + " px di " + platform + ". Kurangi jumlah item, persingkat teks, atau hapus extras."});
    } else if (m.fill !== null && m.fill < EMPTY_BELOW && slide.vertical !== "stretch" && slide.type !== "statement") {
      issues.push({index: m.index, severity: "empty", message: label + ": baru terisi " + Math.round(m.fill * 100) + "% tinggi konten. Tambahkan extras yang berisi informasi baru atau perpanjang isi utama mendekati angka rekomendasi."});
    }
  });
  return issues;
}

// Text the user pastes back to the AI so it fixes only the flagged slides.
export function buildRepairReport(title, issues) {
  if (!issues.length) return "";
  return [
    "LAPORAN LAYOUT STUDIO untuk carousel \"" + title + "\".",
    "Perbaiki HANYA slide berikut, pertahankan slide lain persis sama, lalu kembalikan SELURUH JSON versi 1 dalam satu code block json:",
    ...issues.map((i) => "- " + i.message),
    "Aturan: jangan mengarang angka, patuhi batas kapasitas pada prompt awal, dan tambahan extras harus berisi informasi baru.",
  ].join("\n");
}
