import {RANK_LIMITS} from "./market";

// Parses a daily "Market & Foreign Flow Report" pasted as plain text and builds
// a 7-slide Aksioma Trader carousel: cover, summary, one slide per "Top ..."
// list, and a closing slide.

const MONTHS = {jan: 0, january: 0, januari: 0, feb: 1, february: 1, februari: 1, mar: 2, march: 2, maret: 2, apr: 3, april: 3, may: 4, mei: 4, jun: 5, june: 5, juni: 5, jul: 6, july: 6, juli: 6, aug: 7, august: 7, agu: 7, agt: 7, agustus: 7, sep: 8, sept: 8, september: 8, oct: 9, october: 9, okt: 9, oktober: 9, nov: 10, november: 10, dec: 11, december: 11, des: 11, desember: 11};
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const num = (text) => {
  const n = Number(String(text).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
};
// Indonesian number format keeping the decimals the source used: 1.234,5
const fmtDec = (n, decimals) => {
  const fixed = Math.abs(n).toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (n < 0 && Number(fixed) !== 0 ? "-" : "") + grouped + (dec ? "," + dec : "");
};
const decimalsOf = (text) => (/[.,](\d+)\s*$/.exec(String(text).replace(/[A-Za-z%\s]+$/, "")) || [, ""])[1].length;
const pctText = (n, decimals) => (n > 0 ? "+" : "") + fmtDec(n, decimals) + "%";
const idNumber = (n, decimals = 1) => fmtDec(n, decimals);
const commaDecimals = (t) => String(t).replace(/(\d)\.(\d)/g, "$1,$2");

function parseDate(text) {
  const m = /(\d{1,2})\s+([A-Za-z]+)\.?\s+(\d{4})/.exec(text || "");
  if (!m) return null;
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) return null;
  const d = new Date(Date.UTC(Number(m[3]), month, Number(m[1])));
  return {day: Number(m[1]), month, year: Number(m[3]), weekday: DAYS[d.getUTCDay()], label: Number(m[1]) + " " + MONTH_SHORT[month] + " " + m[3], short: Number(m[1]) + " " + MONTH_SHORT[month]};
}

const SECTION_INFO = {
  "foreign buy": {eyebrow: "Aliran dana asing", tone: "neutral", theme: "ice", note: "Nilai = net beli asing. Persentase = perubahan harga."},
  "foreign sell": {eyebrow: "Aliran dana asing", tone: "neutral", theme: "ice", note: "Nilai = net jual asing. Persentase = perubahan harga."},
  "local buy": {eyebrow: "Aliran dana lokal", tone: "neutral", theme: "lilac", note: "Nilai = net beli investor lokal sesuai data laporan. Persentase = perubahan harga."},
  "local sell": {eyebrow: "Aliran dana lokal", tone: "neutral", theme: "lilac", note: "Nilai = net jual investor lokal. Persentase = perubahan harga."},
  gainer: {eyebrow: "Kenaikan harga", tone: "up", theme: "mint", note: "Persentase = perubahan harga saat penutupan."},
  loser: {eyebrow: "Penurunan harga", tone: "down", theme: "blush", note: "Persentase = perubahan harga saat penutupan."},
};

function sectionKey(title) {
  const t = title.toLowerCase().replace(/^top\s+/, "").trim();
  return SECTION_INFO[t] ? t : null;
}

const ROW = /^\s*\$?([A-Za-z0-9.\-]{1,8})\s*[,;:\t]\s*(.+?)\s*$/;
const VALUE = /^([-+−]?\d[\d.,]*)\s*([KkMmBbTt])?$/;

function parseRow(line) {
  const m = ROW.exec(line);
  if (!m) return null;
  const ticker = m[1].toUpperCase();
  const parts = m[2].split("/").map((p) => p.trim());
  let value, valueNum, unit = "", change, changeNum;
  for (const part of parts) {
    if (part.endsWith("%")) {
      const raw = part.replace("%", "").replace("−", "-").replace("+", "").trim();
      const n = num(raw);
      if (n !== null) { changeNum = n; change = pctText(n, decimalsOf(raw)); }
    } else {
      const v = VALUE.exec(part.replace("−", "-"));
      if (v) { valueNum = num(v[1].replace("+", "")); unit = (v[2] || "").toUpperCase(); if (valueNum !== null) value = idNumber(valueNum, decimalsOf(v[1])) + (unit ? " " + unit : ""); }
    }
  }
  if (value === undefined && change === undefined) return null;
  return {ticker, value, valueNum, change, changeNum};
}

export function parseMarketReport(text) {
  const warnings = [];
  const lines = String(text || "").replace(/\r/g, "").split("\n").map((l) => l.trim()).filter((l) => l && !/^[-_=•*\s]{3,}$/.test(l));
  const report = {title: "Market & Foreign Flow Report", session: "", date: null, summary: "", sections: []};
  if (!lines.length) return {report, warnings};

  const head = lines.find((l) => /report/i.test(l) && /\|/.test(l));
  if (head) {
    const [left, right] = head.split("|");
    report.session = left.replace(/.*report\s*/i, "").trim();
    report.date = parseDate(right);
    if (!report.date) warnings.push("Tanggal pada judul tidak terbaca (contoh format: 16 Oct 2026).");
  } else warnings.push("Judul laporan (\"... Report ... | tanggal\") tidak ditemukan.");

  let current = null;
  for (const line of lines) {
    if (line === head) continue;
    if (/^top\s+/i.test(line) && !ROW.test(line)) {
      current = {name: line.replace(/[:：]\s*$/, ""), key: sectionKey(line.replace(/[:：]\s*$/, "")), rows: []};
      report.sections.push(current);
      continue;
    }
    if (current) {
      const row = parseRow(line);
      if (row) current.rows.push(row);
      continue;
    }
    if (/IHSG|indeks/i.test(line) && !report.summary) report.summary = line;
  }
  for (const s of report.sections) {
    if (s.rows.length > RANK_LIMITS.items) { warnings.push(s.name + ": " + s.rows.length + " baris, hanya " + RANK_LIMITS.items + " teratas dipakai."); s.rows = s.rows.slice(0, RANK_LIMITS.items); }
    if (!s.rows.length) warnings.push(s.name + ": tidak ada baris data terbaca.");
    if (/local buy/i.test(s.name) && s.rows.some((r) => (r.valueNum ?? 0) < 0)) warnings.push(s.name + ": ada nilai negatif (net jual). Ditampilkan apa adanya sesuai data; cek ulang sumbernya.");
  }
  report.sections = report.sections.filter((s) => s.rows.length);
  if (!report.sections.length) warnings.push("Tidak ada daftar \"Top ...\" yang terbaca.");
  if (!report.summary) warnings.push("Kalimat ringkasan IHSG tidak ditemukan; slide ringkasan hanya memuat angka dari daftar.");
  return {report, warnings};
}

function parseSummary(sentence) {
  const out = {};
  const pct = /(\d+(?:[.,]\d+)?)\s*%/.exec(sentence || "");
  if (pct) { out.pct = Number(pct[1].replace(",", ".")); out.pctDecimals = decimalsOf(pct[1]); }
  if (/penurunan|turun|melemah|terkoreksi|anjlok/i.test(sentence || "")) out.dir = "down";
  else if (/kenaikan|naik|menguat|melonjak/i.test(sentence || "")) out.dir = "up";
  const driver = /dimotori oleh\s+(.+?)(?:\.(?!\d)|$)/i.exec(sentence || "");
  if (driver) out.driver = commaDecimals(driver[1]).replace(/\s+/g, " ").trim();
  const amount = /sebesar\s+([\d.,]+)\s*(Triliun|Miliar|Juta)/i.exec(sentence || "");
  if (amount) out.amount = idNumber(Number(amount[1].replace(",", ".")), decimalsOf(amount[1])) + " " + amount[2][0].toUpperCase() + amount[2].slice(1).toLowerCase();
  return out;
}

const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

function titleFor(name) {
  return cut(name.replace(/^top\s+/i, "Top "), 32);
}

export function buildReportCarousel(report) {
  const dateLabel = report.date ? report.date.weekday + ", " + report.date.label : "";
  const shortDate = report.date ? report.date.short : "";
  const sum = parseSummary(report.summary);
  const signed = sum.pct !== undefined && sum.dir ? (sum.dir === "down" ? "-" : "+") + fmtDec(sum.pct, sum.pctDecimals ?? 1) + "%" : "";
  const session = report.session || "Penutupan";
  const listSlides = report.sections.map((s) => {
    const info = (s.key && SECTION_INFO[s.key]) || {eyebrow: "Market report", tone: "neutral", theme: "sand", note: ""};
    const maxBase = Math.max(...s.rows.map((r) => Math.abs(r.valueNum ?? r.changeNum ?? 0)), 0);
    const items = s.rows.map((r) => {
      const base = Math.abs(r.valueNum ?? r.changeNum ?? 0);
      return {ticker: r.ticker, ...(r.value ? {value: r.value} : {}), ...(r.change ? {change: r.change} : {}), bar: maxBase ? Math.round((base / maxBase) * 100) : 0};
    });
    return {
      type: "freeform", theme: info.theme,
      nodes: [
        {type: "slideHeading", eyebrow: info.eyebrow + (shortDate ? " · " + shortDate : ""), title: titleFor(s.name)},
        {type: "marketRank", tone: info.tone, items},
        {type: "sourceNote", label: "Catatan", text: cut((info.note ? info.note + " " : "") + "Bukan ajakan beli/jual.", 160)},
      ],
    };
  });

  // Summary: headline figure + sentence + top item of each list.
  const picks = report.sections.map((s) => {
    const r = s.rows[0];
    return {label: titleFor(s.name), value: r.ticker, note: [r.value, r.change].filter(Boolean).join(" · ")};
  }).slice(0, 4);
  const summaryNodes = [
    {type: "slideHeading", eyebrow: "Ringkasan" + (shortDate ? " · " + shortDate : ""), title: signed ? "IHSG " + signed : "Ringkasan " + session.toLowerCase()},
  ];
  if (report.summary) summaryNodes.push({type: "textBlock", text: cut(commaDecimals(report.summary), 300), size: "lg"});
  if (picks.length) summaryNodes.push({type: "contentGrid", columns: 2, children: picks.map((p) => ({type: "statCard", value: p.value, label: p.label, ...(p.note ? {note: cut(p.note, 40)} : {})}))});

  const headline = sum.dir === "down" ? "IHSG turun" : sum.dir === "up" ? "IHSG naik" : "IHSG";
  const heroSub = [dateLabel, signed ? headline + " " + signed.replace(/^[+-]/, "") : ""].filter(Boolean).join(" · ");
  const driverShort = sum.driver ? cut(sum.driver.replace(/^pembelian\s+/i, "pembelian ").replace(/\s+/g, " "), 80) : "";

  const names = report.sections.flatMap((s) => s.rows.slice(0, 2).map((r) => r.ticker)).slice(0, 6).join(", ");
  const title = "Market & Foreign Flow Report";
  return {
    version: 1,
    meta: {
      account: "trader",
      title: title + " " + session + (shortDate ? " " + shortDate : ""),
      objective: "Save + Share",
      contentPillar: "Market Report",
      hook: signed ? headline + " " + signed.replace(/^[+-]/, "") + " saat penutupan" + (shortDate ? " " + shortDate : "") + "." : title,
      instagramCaption: (report.summary || title) + "\n\nTop foreign buy, top local buy, top gainer, dan top loser" + (shortDate ? " " + shortDate : "") + " ada di slide berikutnya.\n\nBukan ajakan beli atau jual; lakukan riset sendiri.",
      tiktokCaption: (signed ? headline + " " + signed.replace(/^[+-]/, "") + ". " : "") + "Swipe untuk top foreign buy, local buy, gainer, dan loser. Bukan ajakan beli/jual.",
      cta: "Simpan untuk rekap harian dan ikuti Aksioma Trader.",
      hashtags: ["IHSG", "Saham", "ForeignFlow", "MarketReport", "AksiomaTrader"],
      keywords: ["IHSG", "foreign flow", "top gainer", "top loser"],
      notes: "Cek ulang angka dengan sumber data sebelum posting." + (names ? " Saham yang muncul: " + names + "." : ""),
    },
    slides: [
      {type: "hero", eyebrow: session, title, subtitle: cut(heroSub || "Rekap pasar harian", 120), accent: "Aksioma Trader", density: "bold"},
      {type: "freeform", theme: "navy", nodes: summaryNodes},
      ...listSlides,
      {type: "cta", title: "Pasar bergerak, rencana tetap.", body: driverShort ? "Penutupan dimotori " + driverShort + ". Tetap disiplin pada batas risiko." : "Ikuti data, bukan emosi. Tetap disiplin pada batas risiko.", cta: "Simpan dan ikuti Aksioma Trader untuk rekap setiap hari bursa."},
    ],
  };
}

export const SAMPLE_REPORT = `Market & Foreign Flow Report Penutupan Sesi Kedua | 16 Oct 2026

IHSG mengalami penurunan 11.57% dimotori oleh pembelian Investor Lokal sebesar 3.39 Triliun Rupiah.

Berikut report penutupan sesi kedua :

Top Foreign Buy
GOTO, 291.5M / -7.4%
INDF, 75.1M / -4.7%
AADI, 59.8M / -12.4%
BRPT, 58.0M / -14.8%
EMAS, 57.3M / -8.4%

Top Local Buy
BBCA, -2463.1M / -14.8%
BBRI, -1149.0M / -14.8%
BMRI, -862.1M / -14.8%
ANTM, -138.2M / -14.7%
TLKM, -92.8M / -14.8%

Top Gainer
TRUK, 24.8%
PTSP, 6.9%
BYAN, 0.5%
MSJA, 0.0%
PEGE, 0.0%

Top Loser
BBKP, -15.0%
BELI, -15.0%
BFIN, -15.0%
ESIP, -15.0%
ESSA, -15.0%`;
