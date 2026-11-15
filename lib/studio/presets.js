// Content-type presets. A preset fixes the SKELETON (slide order, which component each
// slide uses, item counts, height budget) so the AI only fills data and writes the
// interpretation. Presets are shortcuts, not mandatory templates: the AI may swap a
// slide when the data demands it (see AGENTS.md). Each preset has a golden example
// that passes the layout checker; it is also the JSON sample embedded in the prompt.

import {exampleCarousel} from "./example";
import {exampleNvdaAmd} from "./example-nvda-amd";
import {exampleSwing} from "./example-swing";
import {exampleEdukasi} from "./example-edukasi";
import {exampleBroker} from "./example-broker";

export const CONTENT_PRESETS = {
  bebas: {
    label: "Bebas",
    summary: "AI memilih struktur sendiri sesuai materi.",
  },
  perbandingan: {
    label: "Perbandingan 2 saham",
    summary: "Ukuran bisnis, valuasi, kontras, guidance, syarat, kesimpulan.",
    data: [
      "Dua kode saham dan tanggal data",
      "Market cap dan revenue TTM keduanya",
      "Multiple valuasi keduanya (P/E, EV/Revenue, EV/EBIT) dan operating margin",
      "Harga dan perubahan harian, median peer bila ada",
      "Guidance atau target manajemen salah satu pihak (opsional)",
    ],
    example: exampleNvdaAmd,
    skeleton: [
      "1. hero: judul pertanyaan perbandingan (\"A vs B: siapa yang ...?\").",
      "2. freeform \"Ukuran bisnis\": slideHeading + statSnapshot 4 item (market cap dan revenue kedua saham) + sources.",
      "3. freeform \"Valuasi\": slideHeading + stockCompare 4 baris (P/E, EV/Revenue, EV/EBIT, operating margin; better diisi) + sources. Jangan isi signal pada left/right bila itu terkesan rekomendasi.",
      "4. freeform \"Harga hari ini\": slideHeading + compareCards (heading = multiple (mis. \"P/E 27×\"), 2 poin per sisi, delta = selisih kelipatan) + signalGrid 3 baris + sources. Dengan sources, pakai maksimal 2 poin per sisi.",
      "5. freeform \"Guidance / syarat\": slideHeading + signalGrid 4 baris (guidance) + callout, ATAU statSnapshot 4 item (syarat agar valuasi masuk akal) + callout.",
      "6. freeform \"Pro dan kontra\": slideHeading + prosCons (3 + 3) + callout, untuk saham yang valuasinya lebih mahal.",
      "7. freeform \"Kesimpulan\": slideHeading + verdictCard.",
      "8. cta.",
    ],
    rules: [
      "Angka turunan (selisih, rasio) boleh dihitung dari data pengguna, tetapi beri catatan \"hitungan turunan\" di sources atau meta.notes.",
      "Selalu bandingkan periode dan tanggal yang sama; sebutkan bila periode laporan keduanya berbeda.",
      "Jangan menyebut satu saham \"lebih baik\"; sebut \"lebih murah\" atau \"lebih mahal\" disertai angkanya.",
    ],
  },
  swing: {
    label: "Swing Trade Plan",
    summary: "Kondisi tren, level kunci, skenario, hitungan risiko, syarat entry, kesimpulan.",
    data: [
      "Kode saham, tanggal data, dan harga penutupan",
      "EMA 20 dan EMA 50, RSI 14, ATR 14 (dari data pengguna atau hitungan atas harga harian)",
      "Support dan resistance (low/high terdekat atau level yang disebut pengguna)",
      "Zona entry, stop loss, dan target (ilustrasi bila pengguna tidak menyebutnya; tandai sebagai ilustrasi)",
    ],
    example: exampleSwing,
    skeleton: [
      "1. hero: judul pertanyaan kondisi tren (\"X di bawah EMA20: kamu tunggu atau masuk?\").",
      "2. freeform \"Kondisi tren\": slideHeading + statSnapshot 4 item (harga, EMA 20, EMA 50, RSI 14) + sources.",
      "3. freeform \"Level kunci\": slideHeading + priceLevels 5 baris (target, resistance, entry, support, stop), urut dari harga tertinggi ke terendah + sources.",
      "4. freeform \"Skenario\": slideHeading + tradePlan 3 skenario (bull, base, bear) dengan risk.",
      "5. freeform \"Hitungan risiko\": slideHeading + statSnapshot 4 item (risiko per saham, potensi per saham, R:R, ATR) + callout ukuran posisi.",
      "6. freeform \"Syarat entry\": slideHeading + checklist 4–5 syarat.",
      "7. freeform \"Kesimpulan\": slideHeading + verdictCard (verdict watch atau hold bila syarat belum terpenuhi).",
      "8. cta.",
    ],
    rules: [
      "Rencana bersyarat (jika-maka), bukan prediksi. Jangan memakai kata \"pasti\" atau \"harus beli\".",
      "Entry, stop, dan target tanpa sumber dari pengguna wajib ditandai ilustrasi di sources atau meta.notes; tunjukkan cara hitungnya (mis. support dikurangi 1 ATR).",
      "R:R dan ukuran posisi dihitung dari angka yang tampil di slide; periksa ulang aritmetikanya.",
    ],
  },
  edukasi: {
    label: "Edukasi Istilah",
    summary: "Definisi, contoh hitungan, cara kerja, mitos dan fakta, kesalahan umum, istilah terkait.",
    data: [
      "Satu istilah atau konsep (mis. stop loss, PER, dividen, average down)",
      "Contoh hitungan sederhana dengan angka rekaan yang diberi label \"contoh\"",
      "Salah paham yang umum dan kesalahan yang sering terjadi (opsional)",
    ],
    example: exampleEdukasi,
    skeleton: [
      "1. hero: judul pertanyaan (\"X: apa itu dan kenapa penting?\").",
      "2. freeform \"Definisi\": slideHeading (definisi satu kalimat) + textBlock + callout analogi.",
      "3. freeform \"Contoh hitungan\": slideHeading + statSnapshot 4 item (angka rekaan yang konsisten) + sources \"Contoh hitungan, bukan data pasar\".",
      "4. freeform \"Cara kerja\": slideHeading + flow 3–4 langkah.",
      "5. freeform \"Mitos dan fakta\": slideHeading + mythFact 3 pasang.",
      "6. freeform \"Kesalahan umum\": slideHeading + checklist 4–5 item.",
      "7. freeform \"Istilah terkait\": slideHeading + glossary 3 istilah.",
      "8. cta.",
    ],
    rules: [
      "Bahasa awam: satu istilah teknis baru per kalimat, lalu jelaskan.",
      "Angka contoh harus saling konsisten dan dapat diperiksa dengan aritmetika sederhana; jangan menyebutnya data pasar.",
      "Jangan menyebut saham nyata sebagai rekomendasi; contoh memakai angka rekaan.",
    ],
  },
  broker: {
    label: "Broker Summary",
    summary: "Ringkasan, top pembeli, top penjual, bacaan akumulasi/distribusi, cara membaca, kesimpulan.",
    data: [
      "Kode saham, tanggal, dan total nilai transaksi",
      "Top 5 broker beli dan top 5 broker jual (kode broker dan nilai)",
      "Net asing (net buy atau net sell) dan perubahan harga hari itu",
      "Data beberapa hari terakhir bila ada (untuk menilai konsistensi)",
    ],
    example: exampleBroker,
    skeleton: [
      "1. hero: judul pertanyaan (\"X: siapa yang mengumpulkan, siapa yang melepas?\").",
      "2. freeform \"Ringkasan\": slideHeading + statSnapshot 4 item (nilai transaksi, porsi top 5 beli, porsi top 5 jual, net asing) + sources.",
      "3. freeform \"Top pembeli\": slideHeading + marketRank 5 baris (tone \"up\" pada node; ticker = kode broker, value = nilai, change = porsi %, bar relatif terhadap yang terbesar).",
      "4. freeform \"Top penjual\": slideHeading + marketRank 5 baris dengan tone \"down\" pada node marketRank.",
      "5. freeform \"Bacaan\": slideHeading + signalGrid 4 baris (konsentrasi beli, konsentrasi jual, asing, harga) + callout.",
      "6. freeform \"Cara membaca\": slideHeading + checklist 4–5 item.",
      "7. freeform \"Kesimpulan\": slideHeading + verdictCard.",
      "8. cta.",
    ],
    rules: [
      "Kode broker dan nilai persis seperti data pengguna; jangan mengarang. Tanpa data, pakai kerangka dengan angka berlabel \"contoh\".",
      "Gunakan kata \"condong akumulasi\" atau \"condong distribusi\"; satu hari data bukan kesimpulan pasti.",
      "Jangan menyebut nama pelaku atau menuduh manipulasi; bicara tentang kode broker dan angkanya saja.",
    ],
  },
  scorecard: {
    label: "Scorecard satu saham",
    summary: "Angka kunci, teknikal, kinerja, kontras, pro dan kontra, level, kesimpulan.",
    data: [
      "Kode saham atau ETF dan tanggal data",
      "4–6 metrik kunci (harga, yield, YTD, jarak dari high, biaya, aset)",
      "4–6 indikator teknikal atau fundamental dengan bacaan",
      "Kinerja 1 dan 3 tahun terhadap pembanding",
      "Level harga: entry, target, cut loss, support, resistance (opsional)",
    ],
    example: exampleCarousel,
    skeleton: [
      "1. hero: judul berisi temuan terbesar (angka) dan pertanyaan.",
      "2. freeform \"Snapshot\": slideHeading + statSnapshot 4–6 item + sources.",
      "3. freeform \"Teknikal\": slideHeading (hitung berapa indikator bullish) + signalGrid 4–6 baris.",
      "4. freeform \"Kinerja\": slideHeading + returnBars 2 kelompok × 3 batang + sources.",
      "5. freeform \"Kontras\": slideHeading + compareCards (2 poin per sisi) + callout. Dipakai bila ada dua sisi yang bertolak belakang (harga vs dividen, 1 vs 3 tahun).",
      "6. freeform \"Pro dan kontra\": slideHeading + prosCons (3–4 + 3–4) + callout.",
      "7. freeform \"Level risiko\": slideHeading + priceLevels 4–6 baris, urut dari harga tertinggi ke terendah (satu baris current).",
      "8. freeform \"Kesimpulan\": slideHeading + verdictCard.",
      "9. cta.",
    ],
    rules: [
      "Lewati slide yang datanya tidak ada (mis. tanpa level harga, lewati slide 7); jangan mengarang angka.",
      "Bacaan indikator harus persis seperti data pengguna; arah (up/down/flat) mengikuti bacaan itu, bukan opini.",
      "Judul slide teknikal menghitung indikator secara jujur (\"4 dari 6 bullish\").",
    ],
  },
};

// Halaman khusus per jenis konten (menu bar). Tiap halaman mengunci satu preset,
// jadi pengguna tidak perlu memilih jenis konten dan tidak bisa salah pilih.
// "Ringkasan pasar" memakai halaman Laporan Pasar (/studio/report), bukan prompt AI.
const upper = (v, fallback) => (v && v.trim() ? v.trim().toUpperCase() : fallback);
export const PRESET_PAGES = {
  perbandingan: {
    href: "/studio/compare",
    nav: "Perbandingan Saham",
    eyebrow: "Perbandingan 2 Saham",
    title: "Dua saham, satu carousel yang adil.",
    lead: "Isi dua kode saham, salin prompt, lalu paste ke ChatGPT. Kerangkanya sudah baku: ukuran bisnis, valuasi, kontras, guidance, syarat, dan kesimpulan.",
    fields: [
      {key: "a", label: "Saham pertama", placeholder: "NVDA"},
      {key: "b", label: "Saham kedua", placeholder: "AMD"},
    ],
    topic: (v) => "Perbandingan saham " + upper(v.a, "[KODE SAHAM A]") + " vs " + upper(v.b, "[KODE SAHAM B]"),
  },
  swing: {
    href: "/studio/swing",
    nav: "Swing Trade Plan",
    eyebrow: "Swing Trade Plan",
    title: "Rencana swing yang bersyarat, bukan tebakan.",
    lead: "Isi satu kode saham, salin prompt, lalu paste ke ChatGPT. Kerangkanya baku: kondisi tren, level kunci, skenario, hitungan risiko, dan syarat entry.",
    fields: [{key: "a", label: "Kode saham", placeholder: "NVDA"}],
    topic: (v) => "Swing trade plan saham " + upper(v.a, "[KODE SAHAM]"),
  },
  edukasi: {
    href: "/studio/edukasi",
    nav: "Edukasi Istilah",
    eyebrow: "Edukasi Istilah",
    title: "Satu istilah saham, dijelaskan sampai paham.",
    lead: "Isi satu istilah, salin prompt, lalu paste ke ChatGPT. Kerangkanya baku: definisi, contoh hitungan, cara kerja, mitos dan fakta, serta kesalahan umum.",
    fields: [{key: "a", label: "Istilah atau konsep", placeholder: "Stop loss"}],
    topic: (v) => "Edukasi istilah saham: " + (v.a && v.a.trim() ? v.a.trim() : "[ISTILAH]"),
  },
  broker: {
    href: "/studio/broker",
    nav: "Broker Summary",
    eyebrow: "Broker Summary",
    title: "Siapa yang mengumpulkan, siapa yang melepas.",
    lead: "Isi kode saham dan tempel data broker summary di catatan. Kerangkanya baku: ringkasan, top pembeli, top penjual, bacaan, dan cara membaca.",
    fields: [{key: "a", label: "Kode saham", placeholder: "BBCA"}],
    topic: (v) => "Broker summary saham " + upper(v.a, "[KODE SAHAM]"),
  },
  scorecard: {
    href: "/studio/scorecard",
    nav: "Scorecard Saham",
    eyebrow: "Scorecard Saham",
    title: "Satu saham, rapor lengkap dalam carousel.",
    lead: "Isi satu kode saham, salin prompt, lalu paste ke ChatGPT. Kerangkanya sudah baku: angka kunci, sinyal teknikal, kinerja, dividen, pro dan kontra, serta rencana risiko.",
    fields: [{key: "a", label: "Kode saham", placeholder: "SCHD"}],
    topic: (v) => "Scorecard saham " + upper(v.a, "[KODE SAHAM]"),
  },
};

export const PRESET_IDS = Object.keys(CONTENT_PRESETS);
export const DEFAULT_PRESET = "bebas";

// Prompt section for one preset ("" for bebas / unknown).
export function presetPrompt(id) {
  const p = CONTENT_PRESETS[id];
  if (!p || !p.skeleton) return "";
  return [
    "JENIS KONTEN: " + p.label.toUpperCase() + " (kerangka baku; ini shortcut, bukan template wajib: ganti satu slide hanya bila datanya memang butuh).",
    "DATA YANG DIBUTUHKAN (hanya dari sumber pengguna; bila ada yang tidak tersedia, lewati slide yang bergantung padanya):",
    ...p.data.map((d) => "- " + d),
    "KERANGKA SLIDE (urutan tetap; hitung anggaran tinggi tiap slide memakai bagian ANGGARAN TINGGI SLIDE):",
    ...p.skeleton,
    "ATURAN KHUSUS JENIS INI:",
    ...p.rules.map((r) => "- " + r),
    "JSON contoh di bawah mengikuti kerangka ini; ganti SELURUH isinya sesuai sumber pengguna dan pertahankan struktur komponennya.",
  ].join("\n");
}

export function presetExample(id) {
  return CONTENT_PRESETS[id]?.example || exampleCarousel;
}
