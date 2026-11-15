// Reference carousel (also the sample inside the AI prompt). It models a stock
// report turned into a carousel: one idea per slide, each slide using the
// component that matches its information (metrics -> statSnapshot, indicators ->
// signalGrid, periods -> returnBars, contrast -> compare, plan -> priceLevels,
// closing view -> verdictCard). The numbers are an illustrative SCHD snapshot;
// replace them with figures from your own source before publishing.
export const exampleCarousel = {
  version: 1,
  meta: {
    account: "trader",
    title: "SCHD naik 29% dalam setahun: masih layak dibeli?",
    objective: "Save + Share",
    contentPillar: "Analisis Saham",
    hook: "Naik 29% dalam setahun, tapi jangan beli sekaligus.",
    instagramCaption: "Snapshot SCHD per penutupan 16 Okt 2026: angka kunci, sinyal teknikal, perbandingan return, dan level risiko.\n\nIni edukasi, bukan ajakan membeli atau menjual. Cek ulang data sebelum bertindak.",
    tiktokCaption: "SCHD naik 29% setahun. Layak dikejar di puncak? Ini datanya.",
    cta: "Simpan untuk referensi dan kirim ke temanmu yang memantau SCHD.",
    hashtags: ["SCHD", "Saham", "AnalisisSaham", "Dividen"],
    keywords: ["SCHD", "dividen", "teknikal", "cut loss"],
    notes: "Angka adalah ilustrasi dari snapshot 16 Okt 2026. Verifikasi harga, yield, dan level di sumber resmi sebelum dipublikasikan."
  },
  slides: [
    { type: "hero", eyebrow: "SCHD • Snapshot 16 Okt 2026", title: "SCHD naik 29%. Masih layak dibeli?", subtitle: "Angka kunci, sinyal teknikal, dan rencana risiko dalam satu carousel.", accent: "Analisis, bukan ajakan transaksi.", density: "bold" },

    { type: "freeform", theme: "navy", eyebrow: "Snapshot", density: "balanced", vertical: "spread", sources: ["Equibles, penutupan 16 Okt 2026"],
      nodes: [
        { type: "slideHeading", title: "Angka kunci per penutupan." },
        { type: "statSnapshot", items: [
          { label: "Harga", value: "$34,35", sub: "+0,73% hari ini", tone: "up" },
          { label: "Yield TTM", value: "3,09%", sub: "$1,06, kuartalan" },
          { label: "YTD", value: "+25,2%", sub: "Total return +28,3%", tone: "up" },
          { label: "Jarak dari high", value: "−2,7%", sub: "52-week high $35,31", tone: "down" },
          { label: "Expense ratio", value: "0,06%", sub: "Biaya tahunan" },
          { label: "AUM", value: "$94,9 M", sub: "Laporan SEC terakhir" }
        ] }
      ] },

    { type: "freeform", theme: "ice", eyebrow: "Teknikal", density: "balanced", vertical: "spread",
      nodes: [
        { type: "slideHeading", title: "Sinyal teknikal: 4 dari 6 bullish.", body: "Uptrend masih utuh, tapi momentum mulai melemah." },
        { type: "signalGrid", items: [
          { name: "Harga vs EMA", reading: "+2,8% EMA50 · +8,8% EMA200", signal: "up" },
          { name: "ADX mingguan", reading: "44,6, turun dari 55,0", signal: "up" },
          { name: "RSI harian", reading: "67,2, belum overbought", signal: "up" },
          { name: "Return vs SPY 1 th", reading: "SCHD +29,3% vs SPY +15,5%", signal: "up" },
          { name: "Bollinger harian", reading: "Di atas upper band (%B 1,09)", signal: "down" },
          { name: "Stochastic harian", reading: "%K 94,3, overbought", signal: "down" }
        ] }
      ] },

    { type: "freeform", theme: "paper", eyebrow: "Kinerja", density: "balanced", vertical: "spread", sources: ["Equibles, total return per 16 Okt 2026"],
      nodes: [
        { type: "slideHeading", title: "Satu tahun unggul. Tiga tahun tertinggal.", body: "Lonjakan 1 tahun adalah rotasi ke value, bukan rekor jangka panjang." },
        { type: "returnBars", unit: "%", signed: true, groups: [
          { label: "1 tahun", bars: [{ name: "SCHD", value: 29.3, highlight: true }, { name: "QQQ", value: 18.3 }, { name: "SPY", value: 15.5 }] },
          { label: "3 tahun", bars: [{ name: "SCHD", value: 44.8, highlight: true }, { name: "SPY", value: 75.0 }, { name: "QQQ", value: 92.1 }] }
        ] }
      ] },

    { type: "freeform", theme: "sand", eyebrow: "12 bulan", density: "balanced", vertical: "center", sources: ["Equibles, dividen dan harga 12 bulan"],
      nodes: [
        { type: "slideHeading", title: "Naiknya dari harga, bukan dividen." },
        { type: "compareCards", delta: "VS",
          left: { label: "Dividen", heading: "+2%", points: ["$1,04 menjadi $1,06", "Hampir tidak bergerak"] },
          right: { label: "Harga", heading: "+29%", points: ["Yield turun 3,9% ke 3,1%", "Pemicu utama kenaikan"] } },
        { type: "callout", label: "Intinya", text: "Yield turun karena harga naik lebih cepat dari dividen, bukan karena dividen dipotong." }
      ] },

    { type: "freeform", theme: "graphite", eyebrow: "Pro dan kontra", density: "bold", vertical: "center", sources: ["Equibles, data per 16 Okt 2026"],
      nodes: [
        { type: "slideHeading", title: "Dua sisi yang perlu ditimbang." },
        { type: "prosCons", proLabel: "Pro", conLabel: "Kontra",
          pros: ["Uptrend terkonfirmasi di atas EMA50 dan EMA200", "Yield 3,09% dengan biaya hanya 0,06%", "Isinya perusahaan besar yang profitable", "Unggul dari SPY dan QQQ dalam 1 tahun"],
          cons: ["Harga overextended: di atas Bollinger, Stochastic overbought", "Top-10 memegang 43,6% portofolio", "Bila growth memimpin lagi, SCHD tertinggal", "Tertinggal dari SPY dan QQQ dalam 3 tahun"] },
        { type: "callout", label: "Intinya", text: "Tren kuat mendukung, tapi harga yang sudah naik jauh sebaiknya dicicil." }
      ] },

    { type: "freeform", theme: "midnight", eyebrow: "Level risiko", density: "balanced", vertical: "spread", sources: ["Fibonacci swing low $31,61 ke high $35,31"],
      nodes: [
        { type: "slideHeading", title: "Rencana level, dari atas ke bawah." },
        { type: "priceLevels", dark: true, items: [
          { kind: "target", value: "$36,32", label: "Target 2" },
          { kind: "resistance", value: "$35,31", label: "High 52 minggu" },
          { kind: "entry", value: "$34,35", current: true },
          { kind: "entry", value: "$33,90", label: "Zona EMA50 ≈ $33,41" },
          { kind: "support", value: "$33,02", label: "Entry kedua" },
          { kind: "stop", value: "$31,57", label: "Cut loss: close < EMA200" }
        ] }
      ] },

    { type: "freeform", theme: "ivory", eyebrow: "Kesimpulan", density: "balanced", vertical: "center",
      nodes: [
        { type: "slideHeading", title: "Pandangan akhir." },
        { type: "verdictCard", verdict: "accumulate", title: "Layak dicicil, jangan dikejar sekaligus.", text: "Uptrend utuh, tapi harga dekat 52-week high dan momentum mulai melemah.",
          reasons: ["Cicil bertahap di zona pullback", "Konfirmasi dengan close mingguan", "Patuhi level cut loss"],
          caution: "Ilustrasi analisis, bukan nasihat investasi. Sesuaikan dengan profil risikomu." }
      ] },

    { type: "cta", title: "Simpan dan bagikan.", body: "Cek ulang EMA dan level cut loss sebelum bertindak.", cta: "Kirim ke temanmu yang lagi memantau SCHD." }
  ]
};
