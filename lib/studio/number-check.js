// "Cek angka": pemeriksaan konsistensi angka lintas slide, tanpa layout. Hanya
// menandai hal yang hampir pasti janggal; tidak memperbaiki dan tidak memeriksa
// kebenaran data terhadap sumber (itu tugas pengguna).

// "$1.050,5" / "5,1×" / "+Rp9,4 M" / "62%" -> number | null. Format Indonesia:
// titik = ribuan, koma = desimal. Satu titik diikuti tepat 3 digit dianggap ribuan.
export function parseNum(text) {
  const m = String(text ?? "").match(/[-+−]?\d[\d.,]*/);
  if (!m) return null;
  let s = m[0].replace("−", "-");
  const sign = s.startsWith("-") ? -1 : 1;
  s = s.replace(/^[-+]/, "");
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  s = s.replace(/[.,]+$/, "");
  const n = parseFloat(s);
  return Number.isFinite(n) ? sign * n : null;
}

const num = (text) => { const n = parseNum(text); return n === null ? null : n; };
const round = (n) => Math.round(n * 1000) / 1000;

function allNodes(slide) {
  return [...(Array.isArray(slide.nodes) ? slide.nodes : []), ...(Array.isArray(slide.extras) ? slide.extras : [])];
}

function slideTexts(slide) {
  const out = [];
  const walk = (v) => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(slide);
  return out;
}

export function checkNumbers(carousel) {
  const issues = [];
  const slides = Array.isArray(carousel?.slides) ? carousel.slides : [];
  const add = (index, message) => issues.push({index, message});

  // 1. Angka di hook/judul/caption harus muncul di slide.
  const pool = new Set();
  slides.forEach((s) => slideTexts(s).forEach((t) => (t.match(/\d[\d.,]*/g) || []).forEach((tok) => { const n = parseNum(tok); if (n !== null) pool.add(round(Math.abs(n))); })));
  const meta = carousel?.meta || {};
  [["hook", meta.hook], ["title", meta.title]].forEach(([name, text]) => {
    (String(text || "").match(/\d[\d.,]*\s?(?:%|×|x|M|T|B|rb|jt)?/g) || []).forEach((tok) => {
      const n = parseNum(tok);
      if (n === null || n < 10 && !/[%×]/.test(tok)) return; // abaikan angka kecil tanpa satuan ("5 langkah")
      if (!pool.has(round(Math.abs(n)))) add(0, "meta." + name + " menyebut \"" + tok.trim() + "\" tetapi angka itu tidak muncul di slide mana pun. Samakan dengan isi slide.");
    });
  });

  // 2. Label sama dengan nilai berbeda di slide berbeda.
  const seen = new Map();
  slides.forEach((s, i) => allNodes(s).forEach((n) => {
    if (n.type !== "statSnapshot" && n.type !== "signalGrid") return;
    (n.items || []).forEach((it) => {
      const label = String(it.label ?? it.name ?? "").trim().toLowerCase();
      const value = String(it.value ?? it.reading ?? "").trim();
      if (!label || !value) return;
      const prev = seen.get(label);
      if (prev && prev.value !== value && num(prev.value) !== null && num(value) !== null && num(prev.value) !== num(value)) add(i, "\"" + (it.label ?? it.name) + "\" bernilai " + value + " di sini tetapi " + prev.value + " di slide " + String(prev.index + 1).padStart(2, "0") + ".");
      else if (!prev) seen.set(label, {value, index: i});
    });
  }));

  slides.forEach((s, i) => allNodes(s).forEach((n) => {
    // 3. Tone berlawanan dengan tanda angka.
    if (n.type === "statSnapshot") (n.items || []).forEach((it) => {
      const v = String(it.value ?? "").trim();
      if (it.tone === "up" && /^[-−]/.test(v)) add(i, "\"" + it.label + "\" bernilai " + v + " tetapi bertanda naik (tone up).");
      if (it.tone === "down" && /^\+/.test(v)) add(i, "\"" + it.label + "\" bernilai " + v + " tetapi bertanda turun (tone down).");
    });
    // 4. priceLevels: urutan harga dan stop/target terhadap entry.
    if (n.type === "priceLevels") {
      const vals = (n.items || []).map((it) => ({kind: it.kind, v: num(it.value), raw: it.value}));
      for (let k = 1; k < vals.length; k++) if (vals[k].v !== null && vals[k - 1].v !== null && vals[k].v > vals[k - 1].v) { add(i, "priceLevels harus urut dari harga tertinggi ke terendah: " + vals[k - 1].raw + " lalu " + vals[k].raw + "."); break; }
      const entry = vals.find((x) => x.kind === "entry" && x.v !== null);
      const stop = vals.find((x) => x.kind === "stop" && x.v !== null);
      const target = vals.find((x) => x.kind === "target" && x.v !== null);
      if (entry && stop && stop.v >= entry.v) add(i, "Stop (" + stop.raw + ") tidak di bawah entry (" + entry.raw + "). Untuk posisi beli, stop harus lebih rendah.");
      if (entry && target && target.v <= entry.v) add(i, "Target (" + target.raw + ") tidak di atas entry (" + entry.raw + ").");
    }
    // 5. Rentang terbalik / harga di luar rentang tanpa penanda.
    if (n.type === "rangeBars" || n.type === "footballField") (n.items || []).forEach((it) => {
      const lo = num(it.low), hi = num(it.high);
      if (lo !== null && hi !== null && lo > hi) add(i, "\"" + it.label + "\": low " + it.low + " lebih besar dari high " + it.high + ".");
    });
    // 6. "X dari N" di judul harus cocok dengan signalGrid di slide yang sama.
    if (n.type === "slideHeading") {
      const m = String(n.title || "").match(/(\d+)\s+dari\s+(\d+)/i);
      const grid = allNodes(s).find((x) => x.type === "signalGrid");
      if (m && grid) {
        const total = (grid.items || []).length;
        const ups = (grid.items || []).filter((x) => x.signal === "up").length;
        const downs = (grid.items || []).filter((x) => x.signal === "down").length;
        if (Number(m[2]) !== total) add(i, "Judul menyebut \"" + m[0] + "\" tetapi signalGrid berisi " + total + " baris.");
        else if (Number(m[1]) !== ups && Number(m[1]) !== downs) add(i, "Judul menyebut \"" + m[0] + "\" tetapi signalGrid memuat " + ups + " sinyal naik dan " + downs + " turun.");
      }
    }
  }));

  return issues;
}
