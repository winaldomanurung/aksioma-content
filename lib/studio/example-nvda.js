// Second reference carousel: NVIDIA "janji vs hasil". Uses only figures pulled from
// Equibles (guidance table) and Alpha Vantage (EPS actual vs estimate, quote).
// Realised revenue / margin vs guidance were NOT available in the sources, so the
// deck says so instead of inventing them.
export const exampleNvda = {
  version: 1,
  meta: {
    account: "trader",
    title: "Guidance vs hasil NVIDIA: apa yang terbukti?",
    objective: "Save + Share",
    contentPillar: "Analisis Saham",
    hook: "15 kuartal beruntun NVIDIA mengalahkan konsensus EPS.",
    instagramCaption: "Review NVIDIA: EPS aktual vs konsensus lima kuartal terakhir, guidance terbaru, dan apa yang belum bisa diverifikasi.\n\nIni edukasi, bukan ajakan membeli atau menjual. Cek ulang data sebelum bertindak.",
    tiktokCaption: "NVIDIA mengalahkan konsensus EPS 15 kuartal berturut-turut. Tapi guidance margin-nya?",
    cta: "Simpan untuk referensi dan kirim ke temanmu yang memantau NVDA.",
    hashtags: ["NVDA", "NVIDIA", "Saham", "AnalisisSaham"],
    keywords: ["NVDA", "earnings", "guidance", "EPS"],
    notes: "Sumber: Alpha Vantage (EPS, harga 16 Okt 2026) dan Equibles (guidance, laporan 26 Agu 2026). Realisasi revenue dan margin terhadap guidance belum tersedia di sumber; verifikasi di laporan resmi NVIDIA sebelum dipublikasikan."
  },
  slides: [
    { type: "hero", eyebrow: "NVDA • Data 16 Okt 2026", title: "NVIDIA: guidance vs hasil, apa yang terbukti?", subtitle: "EPS aktual vs konsensus, guidance terbaru, dan apa yang belum terverifikasi.", accent: "Analisis, bukan ajakan transaksi.", density: "bold" },

    { type: "freeform", theme: "navy", eyebrow: "Snapshot", density: "bold", vertical: "stretch", sources: ["Alpha Vantage, EPS kuartal 31 Jul 2026 dan harga 16 Okt 2026"],
      nodes: [
        { type: "slideHeading", title: "Hasil kuartal terakhir dalam angka." },
        { type: "statSnapshot", items: [
          { label: "Harga", value: "$214,13", sub: "−1,43% hari ini", tone: "down" },
          { label: "EPS aktual", value: "$2,22", sub: "Lapor 26 Agu 2026" },
          { label: "Konsensus EPS", value: "$2,09", sub: "Ekspektasi analis" },
          { label: "EPS surprise", value: "+6,2%", sub: "Di atas konsensus", tone: "up" },
          { label: "EPS setahun lalu", value: "$1,05", sub: "Kuartal 31 Jul 2025" },
          { label: "Growth EPS", value: "+111%", sub: "YoY", tone: "up" }
        ] }
      ] },

    { type: "freeform", theme: "paper", eyebrow: "Rekam jejak", density: "bold", vertical: "stretch", sources: ["Alpha Vantage, kejutan EPS per kuartal"],
      nodes: [
        { type: "slideHeading", title: "Selalu di atas konsensus, kuartal demi kuartal.", body: "EPS surprise bertahan di kisaran 3% sampai 8% selama tujuh laporan terakhir." },
        { type: "returnBars", unit: "%", signed: true, groups: [
          { label: "Laporan 2025", bars: [
            { name: "Feb 25", value: 4.7 },
            { name: "Mei 25", value: 8.0 },
            { name: "Agu 25", value: 4.0 },
            { name: "Nov 25", value: 3.2 }
          ] },
          { label: "Laporan 2026", bars: [
            { name: "Feb 26", value: 5.2 },
            { name: "Mei 26", value: 5.6 },
            { name: "Agu 26", value: 6.2, highlight: true }
          ] }
        ] }
      ] },

    { type: "compare", theme: "sand", title: "Ekspektasi vs aktual.", backgroundWord: "VS", cornerLabel: "Agu 2026", vertical: "stretch",
      left: { label: "Konsensus", heading: "$2,09", points: ["EPS yang diharapkan analis", "Jadi patokan pasar sebelum laporan 26 Agu"] },
      right: { label: "Aktual", heading: "$2,22", points: ["Beat 6,2% atau $0,13 per saham", "Kuartal ke-15 beruntun di atas konsensus"] } },

    { type: "freeform", theme: "ice", eyebrow: "Guidance", density: "bold", vertical: "stretch", sources: ["Equibles (guidance, laporan 26 Agu 2026), Alpha Vantage (EPS, harga)"],
      nodes: [
        { type: "slideHeading", title: "Guidance terbaru yang harus dibuktikan.", body: "Guidance bukan hasil. Realisasinya baru terlihat di laporan berikutnya." },
        { type: "signalGrid", items: [
          { name: "Revenue Q3 FY27", reading: "Guidance sekitar $108 miliar", signal: "flat" },
          { name: "Gross margin", reading: "Guidance 74%", signal: "flat" },
          { name: "Opex", reading: "GAAP $9,2 M · non-GAAP $9,0 M", signal: "flat" },
          { name: "Tarif pajak FY2027", reading: "16–18%, turun dari 17–19%", signal: "up" },
          { name: "Rekam jejak EPS", reading: "Di atas konsensus 15 kuartal beruntun", signal: "up" },
          { name: "Harga hari ini", reading: "$214,13, turun 1,43%", signal: "down" }
        ] }
      ] },

    { type: "freeform", theme: "graphite", eyebrow: "Pro dan kontra", density: "bold", vertical: "center", sources: ["Alpha Vantage dan Equibles, data per 16 Okt 2026"],
      nodes: [
        { type: "slideHeading", title: "Dua sisi yang perlu ditimbang." },
        { type: "prosCons", proLabel: "Sudah terbukti", conLabel: "Perlu dicek",
          pros: ["EPS di atas konsensus 15 kuartal beruntun", "EPS kuartal terakhir naik 111% dari tahun lalu", "Guidance pajak diturunkan ke 16–18%"],
          cons: ["Realisasi revenue dan margin belum ada di sumber", "Beat 3–6% sekarang lebih kecil dari 2023 (hingga 30%)", "Terakhir meleset: Nov 2022, −18,3%"] },
        { type: "callout", label: "Intinya", text: "Rekam jejak EPS kuat, tetapi guidance margin baru teruji di laporan berikutnya." }
      ] },

    { type: "freeform", theme: "ivory", eyebrow: "Kesimpulan", density: "balanced", vertical: "center",
      nodes: [
        { type: "slideHeading", title: "Pandangan akhir." },
        { type: "verdictCard", verdict: "watch", title: "Rekam jejak kuat, tunggu bukti guidance.", text: "EPS konsisten mengalahkan konsensus, tetapi margin dan revenue belum diverifikasi terhadap guidance.",
          reasons: ["Pantau laporan kuartal berikutnya", "Bandingkan margin aktual dengan 74%", "Cek revisi estimate sebelum bertindak"],
          caution: "Ilustrasi analisis, bukan nasihat investasi. Sesuaikan dengan profil risikomu." }
      ] },

    { type: "cta", title: "Simpan dan bagikan.", body: "Cek laporan resmi NVIDIA sebelum bertindak.", cta: "Kirim ke temanmu yang lagi memantau NVDA." }
  ]
};
