// "KONTRAK FIELD" section of the AI prompt, generated from the same constants
// the validator (schema.js) uses. Every enum value and hard character limit
// the AI sees here is exactly what the Studio accepts, so the prompt cannot
// drift from the validator. Edit the constants, never this text by hand.

import {SCHEMA_RULES, PRESET_TEXT_FIELDS} from "./schema";
import {charLimit, allowedSizes} from "./component-specs";
import {iconSets, iconSizes, tones, shapeNames, shapePositions, shapeOpacity, backgroundThemes} from "./assets";
import {FONT_IDS} from "./fonts";
import {LOOK_IDS} from "./looks";
import {
  LEVEL_KINDS, CHART_LIMITS, COMPARE_LIMITS, COMPARE_BETTER, PLAN_KINDS, PLAN_LIMITS, CALENDAR_LIMITS,
  RANK_LIMITS, RANK_TONES, TONES, SNAPSHOT_LIMITS, SIGNAL_DIRS, SIGNAL_LIMITS, LEVELS_LIMITS, BARS_LIMITS,
  VERDICT_LIMITS, CARDS_LIMITS, SPARK_LIMITS, GAUGE_LIMITS, RANGE_LIMITS, HEAT_LIMITS, FIELD_LIMITS,
} from "./market";
import {STOCK_SIGNALS, STOCK_LIMITS, STOCK_NOTE_LIMIT} from "./stock";

const q = (v) => (typeof v === "string" ? '"' + v + '"' : String(v));
const one = (list) => [...list].map(q).join(" | ");
const hard = (key) => charLimit(key)?.hard;
const lim = (pairs) => pairs.filter(([, n]) => n).map(([k, n]) => k + " ≤" + n).join(", ");

function enumLines() {
  const R = SCHEMA_RULES;
  const light = Object.keys(backgroundThemes).filter((k) => !backgroundThemes[k].dark);
  const dark = Object.keys(backgroundThemes).filter((k) => backgroundThemes[k].dark);
  const darkPresets = [...R.DARK_PRESET_TYPES];
  const lightPresets = [...R.VERTICAL_TYPES].filter((t) => t !== "freeform" && !R.DARK_PRESET_TYPES.has(t));
  const signals = Object.keys(STOCK_SIGNALS);
  return [
    "- slides[].type: " + one(R.TYPES) + ". Slide pertama \"hero\", slide terakhir \"cta\".",
    "- type di dalam freeform.nodes / children: " + one(R.NODE_TYPES) + ".",
    "- extras[].type (hanya ini): " + one(R.EXTRA_TYPES) + ".",
    "- density: " + one(R.DENSITIES) + " (airy = lega, balanced = standar, compact = padat, bold = teks besar). TIDAK ADA \"medium\", \"normal\", \"standard\", \"dense\", \"tight\", \"loose\", \"regular\". Ragu? hilangkan density.",
    "- vertical: " + one(R.VERTICALS) + "; hanya pada " + [...R.VERTICAL_TYPES].join(", ") + ". Ragu? hilangkan vertical.",
    "- theme: terang " + one(light) + "; gelap " + one(dark) + ".",
    "  Preset " + darkPresets.join("/") + " WAJIB tema gelap; preset " + lightPresets.join("/") + " WAJIB tema terang; freeform boleh keduanya; hero dan cta TANPA theme.",
    "- decorations: \"none\" ATAU 1–2 object {name, position?, opacity?}; name: " + one(shapeNames) + "; position: " + one(shapePositions) + "; opacity: " + one(shapeOpacity) + ". Tidak untuk hero/cta.",
    "- meta.font: " + one(FONT_IDS) + ". meta.look: " + one(LOOK_IDS) + ". meta.account: \"trader\" | \"journey\" (ikuti §1).",
    "- slideHeading.align: " + one(R.ALIGNS) + ". connector.direction: " + one(R.DIRECTIONS) + ". contentGrid.columns: " + [...R.COLUMNS].join(" | ") + " (ANGKA tanpa kutip).",
    "- infoCard.variant: " + one(R.INFO_VARIANTS) + ". statCard.variant: " + one(R.STAT_VARIANTS) + ".",
    "- flow.direction: \"row\" | \"column\". funnel.shape: \"funnel\" | \"pyramid\". beforeAfter.slot: \"md\" | \"lg\". textBlock.size: \"md\" | \"lg\". swipeHint.align: \"left\" | \"center\" | \"right\".",
    "- photoHero.size: " + one(allowedSizes("photoHero")) + ", shape: \"square\" | \"rounded\" | \"circle\", fit: \"cover\" | \"contain\". phoneMockup.size: " + one(allowedSizes("phoneMockup")) + ", align: \"left\" | \"center\" | \"right\". collage.size: " + one(allowedSizes("collage")) + ", shape: \"square\" | \"rounded\".",
    "- signal (stockList.items, stockCompare.left/right) dan verdictCard.verdict: " + one(signals) + ".",
    "- signalGrid.items[].signal: " + one(Object.keys(SIGNAL_DIRS)) + " (bukan \"bullish\"/\"neutral\").",
    "- tone pada statSnapshot/sparkCards: " + one(TONES) + "; marketRank.tone: " + one(RANK_TONES) + "; gauge.items[].tone: " + one([...TONES, "info"]) + ".",
    "- kind pada priceLevels.items dan priceChart.levels: " + one(Object.keys(LEVEL_KINDS)) + " (\"stop\", bukan \"stoploss\"/\"cut loss\").",
    "- tradePlan.scenarios[].kind: " + one(Object.keys(PLAN_KINDS)) + ". stockCompare.rows[].better: " + one(COMPARE_BETTER) + ".",
    "- assetIcon.set: " + one(Object.keys(iconSets)) + "; size: " + one(Object.keys(iconSizes)) + "; tone: " + one(tones) + "; name persis dari daftar ikon set tersebut (§4 ASSET LIBRARY).",
    "- Boolean (dark, numbered, disclaimer, current, highlight, signed, overlay): true / false TANPA kutip.",
  ];
}

function limitLines() {
  const F = SCHEMA_RULES.FIXED;
  const preset = Object.entries(PRESET_TEXT_FIELDS)
    .map(([type, keys]) => {
      const s = lim(keys.map((k) => [k, hard(type + "." + k)]));
      return s ? type + ": " + s : "";
    })
    .filter(Boolean);
  return [
    "- Semua slide: " + lim([["backgroundWord", F.backgroundWord], ["cornerLabel", F.cornerLabel]]) + "; sources maks " + F.sourcesCount + " teks × ≤" + F.source + ".",
    "- Preset — " + preset.join("; ") + ".",
    "- stockList: " + lim([["ticker", STOCK_LIMITS.ticker], ["name", STOCK_LIMITS.name], ["action", STOCK_LIMITS.action], ["entry", STOCK_LIMITS.entry], ["target", STOCK_LIMITS.target], ["stop", STOCK_LIMITS.stop], ["disclaimerText", STOCK_LIMITS.disclaimerText]]) +
      "; note ≤" + STOCK_NOTE_LIMIT.full + " (1–3 saham), ≤" + STOCK_NOTE_LIMIT.medium + " (4–5 saham), DILARANG ada note bila 6–8 saham.",
    "- stockCompare: " + lim([["ticker", COMPARE_LIMITS.ticker], ["name", COMPARE_LIMITS.name], ["rows.label", COMPARE_LIMITS.label], ["rows.left/right", COMPARE_LIMITS.value]]) + ".",
    "- tradePlan: " + lim([["ticker", PLAN_LIMITS.ticker], ["trigger", PLAN_LIMITS.trigger], ["target", PLAN_LIMITS.target], ["note", PLAN_LIMITS.note], ["risk", PLAN_LIMITS.risk]]) + ".",
    "- eventCalendar: " + lim([["date", CALENDAR_LIMITS.date], ["title", CALENDAR_LIMITS.title], ["tag", CALENDAR_LIMITS.tag], ["note", CALENDAR_LIMITS.note]]) + ".",
    "- marketRank: " + lim([["ticker", RANK_LIMITS.ticker], ["value", RANK_LIMITS.value], ["change", RANK_LIMITS.change]]) + ".",
    "- statSnapshot: " + lim([["label", SNAPSHOT_LIMITS.label], ["value", SNAPSHOT_LIMITS.value], ["sub", SNAPSHOT_LIMITS.sub]]) + ". signalGrid: " + lim([["name", SIGNAL_LIMITS.name], ["reading", SIGNAL_LIMITS.reading]]) + ". priceLevels: " + lim([["value", LEVELS_LIMITS.value], ["label", LEVELS_LIMITS.label]]) + ".",
    "- returnBars: " + lim([["groups.label", BARS_LIMITS.label], ["bars.name", BARS_LIMITS.name], ["unit", BARS_LIMITS.unit]]) + ". verdictCard: " + lim([["title", VERDICT_LIMITS.title], ["text", VERDICT_LIMITS.text], ["reasons[]", VERDICT_LIMITS.reason], ["caution", VERDICT_LIMITS.caution]]) + ".",
    "- compareCards: " + lim([["label", CARDS_LIMITS.label], ["heading", CARDS_LIMITS.heading], ["points[]", CARDS_LIMITS.point], ["delta", CARDS_LIMITS.delta]]) + ". sparkCards: " + lim([["label", SPARK_LIMITS.label], ["value", SPARK_LIMITS.value], ["sub", SPARK_LIMITS.sub]]) + ".",
    "- gauge: " + lim([["label", GAUGE_LIMITS.label], ["display", GAUGE_LIMITS.display], ["note", GAUGE_LIMITS.note]]) + ". rangeBars: " + lim([["label", RANGE_LIMITS.label], ["unit", RANGE_LIMITS.unit]]) + ". heatmap: " + lim([["name", HEAT_LIMITS.name], ["sub", HEAT_LIMITS.sub]]) + ". footballField: " + lim([["label", FIELD_LIMITS.label], ["unit", FIELD_LIMITS.unit], ["currentLabel", FIELD_LIMITS.tag]]) + ".",
    "- priceChart: " + lim([["title", CHART_LIMITS.title], ["caption", CHART_LIMITS.caption], ["from/to", CHART_LIMITS.label], ["levels.label", CHART_LIMITS.levelLabel]]) + ".",
    "- flow: " + lim([["label", hard("flow.label")], ["note", hard("flow.note")], ["via", F.flowVia]]) + " (juga untuk fork). glossary: " + lim([["term", F.glossaryTerm], ["meaning", hard("glossary.meaning")]]) + ".",
    "- mythFact: " + lim([["myth", hard("mythFact.myth")], ["fact", hard("mythFact.fact")], ["mythLabel/factLabel", F.mythLabel]]) + ". prosCons: " + lim([["proLabel/conLabel", F.proLabel]]) + ".",
    "- matrix2x2: " + lim([["title", hard("matrix2x2.title")], ["text", hard("matrix2x2.text")], ["xAxis/yAxis low/high", F.matrixAxis]]) + ". beforeAfter: " + lim([["label", F.beforeAfterLabel], ["title", hard("beforeAfter.title")], ["text", hard("beforeAfter.text")]]) + ".",
    "- textBlock: " + lim([["text", hard("textBlock.text")], ["label", F.textBlockLabel]]) + ". sourceNote: " + lim([["text", hard("sourceNote.text")], ["label", F.sourceNoteLabel]]) + ". swipeHint.text ≤" + F.swipeHint + ". ladder.value ≤" + F.ladderValue + ".",
    "- barChart: " + lim([["unit", F.barUnit], ["label", hard("barChart.label")]]) + ". progressRing: " + lim([["label", hard("progressRing.label")], ["note", hard("progressRing.note")]]) + ". photoHero: " + lim([["title", hard("photoHero.title")], ["text", hard("photoHero.text")]]) + ". phoneMockup.caption ≤" + hard("phoneMockup.caption") + ".",
  ];
}

function typeLines() {
  return [
    "- ANGKA (number JSON, tanpa kutip, titik desimal): barChart.items.value, progressRing.value, priceChart candles/points/levels.value, returnBars.bars.value, sparkCards.points, gauge.value, rangeBars low/high/current, heatmap.change, footballField current/low/high, marketRank.bar. Contoh benar: 12.5 dan -3.2. Salah: \"12,5\" atau \"12%\".",
    "- TEKS ATAU ANGKA (tampil apa adanya, format Indonesia boleh): statCard.value, bigNumber.value, statSnapshot.value, sparkCards.value, priceLevels.value, stockList entry/target/stop, stockCompare left/right, marketRank value/change, compareCards.heading.",
    "- Daftar wajib array JSON [...] walau isinya satu. Teks tidak boleh kosong (\"\").",
  ];
}

export function fieldContractSection() {
  const F = SCHEMA_RULES.FIXED;
  return [
    "§3 KONTRAK FIELD — dibuat otomatis dari validator Studio (sumber kebenaran tunggal).",
    "Satu pelanggaran saja membuat Studio menolak carousel. Bagian ini MENANG atas contoh JSON, gaya, preset, dan aturan lain.",
    "",
    "ATURAN EMAS:",
    "1. Nama field dan nilai enum ditulis PERSIS seperti di bawah (huruf kecil/besar sama, dalam kutip ganda). Jangan menerjemahkan, menyingkat, atau memakai sinonim.",
    "2. Field OPSIONAL yang nilainya tidak kamu yakini: HILANGKAN. Field yang dihilangkan selalu valid dan memakai bawaan Studio.",
    "3. Batas karakter adalah batas KERAS, dihitung termasuk spasi, tanda baca, dan emoji. Target aman ≤90% batas. Hitung, jangan menebak.",
    "4. Jangan menambah field yang tidak tercantum di §4. Jangan mengisi field dengan null.",
    "5. Maks " + F.nodes + " node per freeform, maks " + SCHEMA_RULES.EXTRA_MAX_NODES + " blok extras per slide, maks 35 slide (20 bila untuk Instagram).",
    "",
    "A. NILAI ENUM YANG DITERIMA:",
    ...enumLines(),
    "",
    "B. BATAS KARAKTER KERAS (≤n = paling banyak n karakter):",
    ...limitLines(),
    "",
    "C. TIPE DATA:",
    ...typeLines(),
    "",
    "D. FIELD YANG TIDAK BOLEH / TIDAK PERLU DIISI:",
    "- stockList.disclaimerText: HILANGKAN. Disclaimer bawaan tampil otomatis. Bila memang wajib diisi, satu kalimat ≤" + STOCK_LIMITS.disclaimerText + " karakter.",
    "- images, photoHero.image, phoneMockup.image, collage.items[].image, avatarQuote.avatar: jangan diisi (pengguna menempatkan foto sendiri).",
    "- font/look per slide: jangan; pakai meta.font/meta.look saja bila diminta di §1.",
    "- theme dan decorations pada hero/cta: jangan.",
  ].join("\n");
}

export const FINAL_CHECKLIST = `§8 CEK AKHIR SEBELUM MENJAWAB (jalankan untuk SETIAP slide, perbaiki diam-diam, jangan tulis hasil cek):
[ ] JSON valid: kutip ganda, tanpa komentar, tanpa koma sebelum } atau ], tanpa teks di luar code block.
[ ] Root {"version":1,"meta":{...},"slides":[...]}; slide pertama hero, terakhir cta.
[ ] Setiap type, density, vertical, theme, variant, signal, verdict, kind, tone, position, opacity, align, size ada PERSIS di §3A. Yang meragukan: hapus field-nya (kecuali type/kind/signal wajib).
[ ] Tema preset gelap/terang sesuai §3A; hero/cta tanpa theme/decorations.
[ ] Setiap teks yang tercantum di §3B dihitung karakternya dan ≤ batas. Yang melebihi: tulis ulang lebih pendek, jangan dipotong di tengah kata.
[ ] stockList tanpa disclaimerText; tanpa note bila 6–8 saham.
[ ] Field ANGKA (§3C) berupa number tanpa kutip; priceLevels urut tertinggi ke terendah; rangeBars dan footballField low < high, rangeBars low ≤ current ≤ high.
[ ] Jumlah item tiap komponen ≤ maks di §5; extras ≤3 dan hanya tipe yang diizinkan.
[ ] Tidak ada field di luar §4, tidak ada null, tidak ada teks kosong.`;
