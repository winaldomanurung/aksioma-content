// Reference carousel: swing trade plan for NVDA. Prices and ATR come from Equibles
// (daily prices to 16 Okt 2026, ATR 14 = 5,97). EMA20/EMA50/RSI14 are computed from
// those daily closes; the entry, stop, and R:R figures are illustrative arithmetic.
export const exampleSwing = {
  version: 1,
  meta: {
    account: "trader",
    title: "NVDA: rencana swing, tunggu konfirmasi dulu",
    objective: "Save + Share",
    contentPillar: "Swing Trade",
    hook: "NVDA di bawah EMA20 dan EMA50. Ini rencana kalau mau menunggu.",
    instagramCaption: "Rencana swing NVDA: kondisi tren, level kunci, skenario, dan hitungan risiko.\n\nIni edukasi, bukan ajakan membeli atau menjual. Cek ulang data sebelum bertindak.",
    tiktokCaption: "NVDA di bawah EMA20 dan EMA50. Level mana yang perlu ditunggu? Ini hitungannya.",
    cta: "Simpan rencananya dan tulis jawabanmu di komentar: kamu tunggu konfirmasi atau sudah masuk?",
    hashtags: ["NVDA", "SwingTrade", "AnalisisTeknikal", "Saham"],
    keywords: ["NVDA", "swing trade", "support", "resistance", "ATR"],
    notes: "Sumber: Equibles (harga harian s/d 16 Okt 2026, ATR 14). EMA20, EMA50, RSI 14, level entry, stop, dan R:R adalah hitungan turunan dari data tersebut; zona entry dan stop adalah ilustrasi."
  },
  slides: [
    { type: "hero", eyebrow: "NVDA • Swing Plan • Data 16 Okt 2026", title: "NVDA turun di bawah EMA20: kamu tunggu atau masuk?", subtitle: "Kondisi tren, level kunci, skenario, dan hitungan risiko.", accent: "Rencana bersyarat, bukan ajakan transaksi.", density: "bold" },

    { type: "freeform", theme: "navy", eyebrow: "Kondisi tren", density: "balanced", vertical: "center", sources: ["Equibles, harga harian; EMA dan RSI adalah hitungan turunan"],
      nodes: [
        { type: "slideHeading", title: "Harga di bawah EMA20 dan EMA50.", body: "Momentum jangka pendek melemah." },
        { type: "statSnapshot", items: [
          { label: "Harga", value: "$214,13", sub: "Penutupan 16 Okt", tone: "down" },
          { label: "EMA 20", value: "$225,57", sub: "Harga 5,1% di bawahnya", tone: "down" },
          { label: "EMA 50", value: "$222,42", sub: "Harga 3,7% di bawahnya", tone: "down" },
          { label: "RSI 14", value: "37,5", sub: "Lemah, belum jenuh jual", tone: "neutral" }
        ] }
      ] },

    { type: "freeform", theme: "paper", eyebrow: "Level kunci", density: "balanced", vertical: "center", sources: ["Equibles, harga harian; zona entry dan stop adalah ilustrasi"],
      nodes: [
        { type: "slideHeading", title: "Dua level yang menentukan arah.", body: "Support $208,93 dan EMA20 $225,57." },
        { type: "priceLevels", items: [
          { kind: "target", value: "$225,57", label: "EMA20, target pertama" },
          { kind: "resistance", value: "$218,68", label: "High 16 Okt" },
          { kind: "entry", value: "$209,50", label: "Zona uji ulang support" },
          { kind: "support", value: "$208,93", label: "Low 14 Sep" },
          { kind: "stop", value: "$203,00", label: "Support dikurangi 1 ATR" }
        ] }
      ] },

    { type: "freeform", theme: "sand", eyebrow: "Skenario", density: "balanced", vertical: "center", sources: ["Hitungan turunan dari harga harian Equibles"],
      nodes: [
        { type: "slideHeading", title: "Tiga kemungkinan, tiga respons." },
        { type: "tradePlan", ticker: "NVDA", scenarios: [
          { kind: "bull", trigger: "Tutup di atas $218,68 dengan volume naik", target: "$225,57", note: "Konfirmasi rebound, EMA20 jadi target." },
          { kind: "base", trigger: "Bergerak $209–$218 tanpa arah", note: "Belum ada sinyal. Tunggu, jangan paksakan." },
          { kind: "bear", trigger: "Tutup di bawah $208,93", target: "Stop $203,00", note: "Support gagal, rencana dibatalkan." }
        ], risk: "Ilustrasi; sesuaikan dengan toleransi risikomu." }
      ] },

    { type: "freeform", theme: "midnight", eyebrow: "Hitungan risiko", density: "balanced", vertical: "center", sources: ["Hitungan turunan: ATR 14 dari Equibles, entry dan stop ilustrasi"],
      nodes: [
        { type: "slideHeading", title: "Risiko $6,50, potensi $16,07.", body: "Rasio reward terhadap risiko sekitar 2,5 banding 1." },
        { type: "statSnapshot", dark: true, items: [
          { label: "Risiko per saham", value: "$6,50", sub: "$209,50 ke $203,00", tone: "down" },
          { label: "Potensi per saham", value: "$16,07", sub: "$209,50 ke $225,57", tone: "up" },
          { label: "Rasio R:R", value: "2,5×", sub: "$16,07 dibagi $6,50", tone: "up" },
          { label: "ATR 14", value: "$5,97", sub: "Gerak harian rata-rata", tone: "neutral" }
        ] },
        { type: "callout", label: "Ukuran posisi", text: "Risiko 1% modal: jumlah saham = 1% modal dibagi $6,50. Modal $10.000 berarti sekitar 15 saham." }
      ] },

    { type: "freeform", theme: "ice", eyebrow: "Syarat entry", density: "bold", vertical: "stretch",
      nodes: [
        { type: "slideHeading", title: "Entry hanya bila semua syarat terpenuhi." },
        { type: "checklist", items: ["Harga menguji support $208,93 dan bertahan", "Muncul candle penutupan yang naik", "Volume lebih besar dari hari sebelumnya", "R:R minimal 2 banding 1", "Stop loss sudah ditulis sebelum masuk"] },
        { type: "callout", label: "Catatan", text: "Bila satu syarat belum terpenuhi, rencana ini belum berlaku. Menunggu juga keputusan." }
      ] },

    { type: "freeform", theme: "ivory", eyebrow: "Kesimpulan", density: "balanced", vertical: "center",
      nodes: [
        { type: "slideHeading", title: "Pandangan akhir." },
        { type: "verdictCard", verdict: "watch", title: "Pantau, jangan kejar.", text: "Tren pendek masih turun. Rencana baru valid bila support bertahan atau harga menembus $218,68.",
          reasons: ["Harga di bawah EMA20 dan EMA50", "RSI 37,5 belum jenuh jual", "R:R 2,5 baru berlaku dari zona $209,50"],
          caution: "Ilustrasi analisis, bukan nasihat investasi. Tentukan stop sebelum masuk." }
      ] },

    { type: "cta", title: "Simpan rencananya.", body: "Cek ulang harga dan volume sebelum bertindak.", cta: "Kirim ke temanmu yang sedang memantau NVDA." }
  ]
};
