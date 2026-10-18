import {STOCK_LIMITS, STOCK_MAX_ITEMS, STOCK_NOTE_LIMIT, STOCK_SIGNALS, STOCK_DISCLAIMER, stockTier} from "./stock";

// Turns pasted CSV / TSV / spreadsheet rows into stockList data and a ready carousel.

const COLUMN_ALIASES = {
  ticker: ["ticker", "kode", "code", "saham", "symbol", "emiten"],
  name: ["name", "nama", "perusahaan", "company"],
  signal: ["signal", "sinyal", "aksi", "action", "rekomendasi", "rating"],
  entry: ["entry", "buy", "beli", "area", "harga", "price"],
  target: ["target", "tp", "takeprofit", "take profit"],
  stop: ["stop", "sl", "cutloss", "cut loss", "stoploss", "stop loss", "cl"],
  note: ["note", "catatan", "alasan", "keterangan", "notes", "reason"],
};
const POSITIONAL = ["ticker", "name", "signal", "entry", "target", "stop", "note"];

const SIGNAL_WORDS = {
  beli: "buy", buy: "buy", "strong buy": "buy", akumulasi: "accumulate", accumulate: "accumulate", acc: "accumulate", "buy on weakness": "accumulate",
  tahan: "hold", hold: "hold", pantau: "watch", watch: "watch", wait: "watch", tunggu: "watch", jual: "sell", sell: "sell",
};

function splitLine(line, delim) {
  const out = [];
  let cur = "", quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { if (quoted && line[i + 1] === '"') { cur += '"'; i++; } else quoted = !quoted; }
    else if (ch === delim && !quoted) { out.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function detectDelimiter(lines) {
  const first = lines.slice(0, 3).join("\n");
  if (first.includes("\t")) return "\t";
  if (first.includes(";")) return ";";
  return ",";
}

const norm = (s) => String(s || "").toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ").trim();
function columnFor(header) {
  const h = norm(header);
  for (const [key, names] of Object.entries(COLUMN_ALIASES)) if (names.some((n) => norm(n) === h)) return key;
  return null;
}

const TICKER = /^[A-Za-z0-9.\-]{1,8}$/;

export function parseStockTable(text) {
  const warnings = [];
  const lines = String(text || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return {items: [], warnings};
  const delim = detectDelimiter(lines);
  let rows = lines.map((l) => splitLine(l, delim));
  let cols = rows[0].map(columnFor);
  let body = rows;
  if (cols.includes("ticker")) {
    body = rows.slice(1);
  } else if (rows[0].length === 1 || TICKER.test(rows[0][0])) {
    cols = rows[0].map((_, i) => POSITIONAL[i] || null);
    if (rows[0].length > 1) warnings.push("Tidak ada baris judul kolom; kolom dibaca berurutan: kode, nama, sinyal, entry, target, cut loss, catatan.");
  } else {
    warnings.push("Baris judul tidak dikenali. Pakai judul seperti: Kode, Nama, Sinyal, Entry, Target, Cut loss, Catatan.");
    return {items: [], warnings};
  }

  const items = [];
  body.forEach((cells, r) => {
    const rec = {};
    cols.forEach((key, i) => { if (key && cells[i] !== undefined && cells[i] !== "") rec[key] = cells[i]; });
    const at = "Baris " + (r + 1) + ": ";
    const ticker = (rec.ticker || "").replace(/^\$/, "").toUpperCase();
    if (!ticker) return;
    if (!TICKER.test(ticker)) { warnings.push(at + "kode \"" + ticker + "\" dilewati (maks 8 karakter huruf/angka)."); return; }
    const item = {ticker};
    const cut = (key, value, max) => {
      if (value.length > max) { warnings.push(at + key + " dipotong menjadi " + max + " karakter."); return value.slice(0, max - 1).trimEnd() + "…"; }
      return value;
    };
    if (rec.name) item.name = cut("nama", rec.name, STOCK_LIMITS.name);
    if (rec.signal) {
      const sig = SIGNAL_WORDS[rec.signal.toLowerCase()];
      if (sig) item.signal = sig; else item.action = cut("sinyal", rec.signal, STOCK_LIMITS.action);
    }
    for (const key of ["entry", "target", "stop"]) if (rec[key]) item[key] = cut(key, rec[key], STOCK_LIMITS[key]);
    if (rec.note) item.note = rec.note;
    items.push(item);
  });

  if (items.length > STOCK_MAX_ITEMS) warnings.push(items.length + " saham dibagi ke beberapa slide (maks " + STOCK_MAX_ITEMS + " per slide).");
  return {items, warnings};
}

// Splits into slides of `perSlide` (1-8) stocks. Notes are trimmed to the tier limit.
export function buildStockSlides(items, {perSlide = 5, title = "Saham pilihan", eyebrow = "Watchlist", dark = false, disclaimerText} = {}) {
  const size = Math.min(Math.max(1, perSlide), STOCK_MAX_ITEMS);
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks.map((chunk, index) => {
    const tier = stockTier(chunk.length);
    const noteMax = STOCK_NOTE_LIMIT[tier];
    const list = chunk.map((it) => {
      const copy = {...it};
      if (!noteMax) delete copy.note;
      else if (copy.note && copy.note.length > noteMax) copy.note = copy.note.slice(0, noteMax - 1).trimEnd() + "…";
      return copy;
    });
    return {
      type: "freeform",
      theme: dark ? "midnight" : "ivory",
      dark,
      nodes: [
        {type: "slideHeading", eyebrow, title: chunks.length > 1 ? title + " (" + (index + 1) + "/" + chunks.length + ")" : title},
        {type: "stockList", items: list, ...(disclaimerText ? {disclaimerText} : {})},
      ],
    };
  });
}

export function buildStockCarousel(items, opts = {}) {
  const {title = "Saham pilihan", account = "trader", hook = "", cta = "Simpan dan bagikan ke teman trading-mu."} = opts;
  const slides = buildStockSlides(items, opts);
  const names = items.slice(0, 5).map((i) => i.ticker).join(", ");
  return {
    version: 1,
    meta: {
      account,
      title,
      objective: "Save + Share",
      contentPillar: "Watchlist",
      hook: hook || title,
      instagramCaption: title + ": " + names + (items.length > 5 ? " dan lainnya" : "") + ".\n\n" + STOCK_DISCLAIMER,
      tiktokCaption: title + " — " + names + ". Bukan ajakan beli/jual.",
      cta,
      hashtags: ["Saham", "IHSG", "Watchlist", "Aksioma"],
      keywords: ["saham", "watchlist"],
      notes: "Periksa ulang semua angka sebelum dipublikasikan.",
    },
    slides: [
      {type: "hero", eyebrow: "Watchlist", title, subtitle: items.length + " saham untuk dipantau. Cek level entry, target, dan batas risikonya.", accent: "Bukan ajakan beli atau jual.", density: "bold"},
      ...slides,
      {type: "cta", title: "Disiplin pada rencana.", body: "Tentukan batas risiko sebelum masuk posisi.", cta},
    ],
  };
}

export const SAMPLE_TABLE = "Kode\tNama\tSinyal\tEntry\tTarget\tCut loss\tCatatan\nABCD\tContoh Bank Tbk\tAkumulasi\t1.000-1.050\t1.250\t950\tContoh catatan alasan singkat\nWXYZ\tContoh Energi Tbk\tPantau\t2.400\t2.800\t2.250\tTunggu konfirmasi volume\nEFGH\tContoh Retail Tbk\tTahan\t500\t600\t470\tPertahankan selama tren utuh";
