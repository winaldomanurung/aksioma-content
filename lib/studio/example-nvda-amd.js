// Third reference carousel: NVDA vs AMD valuation. Built with the slide height
// budget in the AI prompt (content area ~590 px per slide). Figures come from
// Equibles (valuation multiples, guidance) and Alpha Vantage (quote, 16 Okt 2026).
// "Derived" figures (margins, 5,1x, 26,4x) are arithmetic on those numbers.
export const exampleNvdaAmd = {
  version: 1,
  meta: {
    account: "trader",
    title: "NVIDIA vs AMD: siapa yang valuasinya lebih masuk akal?",
    objective: "Save + Share",
    contentPillar: "Analisis Saham",
    hook: "P/E AMD 136x. NVIDIA cuma 27x.",
    instagramCaption: "NVIDIA vs AMD: market cap, valuasi, guidance AMD, dan syarat agar harga AMD masuk akal.\n\nIni edukasi, bukan ajakan membeli atau menjual. Cek ulang data sebelum bertindak.",
    tiktokCaption: "P/E AMD 136x, NVIDIA 27x. Apa yang harus terjadi supaya harga AMD masuk akal?",
    cta: "Simpan untuk referensi dan kirim ke temanmu yang memantau chip AI.",
    hashtags: ["NVDA", "AMD", "Saham", "AnalisisSaham"],
    keywords: ["NVDA", "AMD", "valuasi", "P/E"],
    notes: "Sumber: Equibles (multiple valuasi dan guidance) serta Alpha Vantage (harga penutupan 16 Okt 2026). Operating margin, 5,1x, dan 26,4x adalah hitungan turunan dari angka tersebut."
  },
  slides: [
    { type: "hero", eyebrow: "NVDA vs AMD • Data 16 Okt 2026", title: "NVIDIA vs AMD: valuasi siapa yang masuk akal?", subtitle: "Market cap, P/E, guidance, dan syarat agar harga AMD masuk akal.", accent: "Analisis, bukan ajakan transaksi.", density: "bold" },

    { type: "freeform", theme: "navy", eyebrow: "Ukuran bisnis", density: "balanced", vertical: "center", sources: ["Equibles, laporan TTM"],
      nodes: [
        { type: "slideHeading", title: "Market cap NVIDIA 6x lebih besar dari AMD." },
        { type: "statSnapshot", items: [
          { label: "Market cap NVDA", value: "$5,16 T", sub: "Per penutupan terakhir" },
          { label: "Market cap AMD", value: "$863 M", sub: "Per penutupan terakhir" },
          { label: "Revenue NVDA", value: "$303,0 M", sub: "TTM s/d 26 Jul 2026" },
          { label: "Revenue AMD", value: "$41,3 M", sub: "TTM s/d 27 Jun 2026" }
        ] }
      ] },

    { type: "freeform", theme: "paper", eyebrow: "Valuasi", density: "balanced", vertical: "center", sources: ["Equibles, multiple valuasi TTM"],
      nodes: [
        { type: "slideHeading", title: "Di semua metrik valuasi, AMD lebih mahal.", body: "NVIDIA juga unggul di operating margin." },
        { type: "stockCompare", left: { ticker: "NVDA", name: "NVIDIA" }, right: { ticker: "AMD", name: "Advanced Micro" }, rows: [
          { label: "P/E (TTM)", left: "27,1×", right: "135,9×", better: "left" },
          { label: "EV / Revenue", left: "17,0×", right: "20,7×", better: "left" },
          { label: "EV / EBIT", left: "26,0×", right: "131,5×", better: "left" },
          { label: "Operating margin", left: "65,2%", right: "15,7%", better: "left" }
        ] }
      ] },

    { type: "freeform", theme: "sand", eyebrow: "Harga hari ini", density: "balanced", vertical: "center", sources: ["Equibles (P/E, EPS) dan Alpha Vantage (harga 16 Okt 2026)"],
      nodes: [
        { type: "slideHeading", title: "Harga hari ini, dua cerita." },
        { type: "compareCards", delta: "5×",
          left: { label: "NVIDIA", heading: "P/E 27×", points: ["Di bawah median peer 41,9×", "EPS TTM $7,91"] },
          right: { label: "AMD", heading: "P/E 136×", points: ["Hampir 3× median peer 42,0×", "EPS TTM $3,89"] } },
        { type: "signalGrid", items: [
          { name: "Harga NVDA", reading: "$214,13, turun 1,43% pada 16 Okt", signal: "down" },
          { name: "Harga AMD", reading: "$528,75, turun 5,95% pada 16 Okt", signal: "down" },
          { name: "Selisih P/E", reading: "P/E AMD sekitar 5× milik NVIDIA", signal: "flat" }
        ] }
      ] },

    { type: "freeform", theme: "ice", eyebrow: "Guidance AMD", density: "balanced", vertical: "center", sources: ["Equibles, guidance AMD (laporan 4 Agu 2026)"],
      nodes: [
        { type: "slideHeading", title: "Guidance AMD: apa yang dijanjikan?", body: "Track record: 7 dari 8 guidance terakhir tercapai atau terlampaui." },
        { type: "signalGrid", items: [
          { name: "Gross margin Q3", reading: "56% non-GAAP, dipertahankan", signal: "flat" },
          { name: "Opex Q3", reading: "$3,65 miliar non-GAAP", signal: "flat" },
          { name: "Tax rate non-GAAP", reading: "13%, tidak berubah", signal: "flat" },
          { name: "Server 2H 2026", reading: "Growth 80% YoY", signal: "up" }
        ] },
        { type: "callout", label: "Intinya", text: "Guidance jangka pendek stabil. Yang menggerakkan harga adalah target jangka panjangnya." }
      ] },

    { type: "freeform", theme: "midnight", eyebrow: "Syarat valuasi", density: "balanced", vertical: "center", sources: ["Equibles dan Alpha Vantage; 5,1× dan 26,4× adalah hitungan turunan"],
      nodes: [
        { type: "slideHeading", title: "EPS AMD harus naik sekitar 5x.", body: "Manajemen menargetkan EPS tahunan minimal $20." },
        { type: "statSnapshot", dark: true, items: [
          { label: "EPS TTM", value: "$3,89", sub: "Sampai 27 Jun 2026" },
          { label: "Target EPS", value: "≥ $20", sub: "Target jangka panjang" },
          { label: "EPS harus naik", value: "5,1×", sub: "$20 dibagi $3,89", tone: "up" },
          { label: "P/E jika tercapai", value: "26,4×", sub: "Harga $528,75 tetap" }
        ] },
        { type: "callout", label: "Intinya", text: "Harga sekarang sudah mengantisipasi target itu. Kalau meleset, P/E 136× sulit bertahan." }
      ] },

    { type: "freeform", theme: "graphite", eyebrow: "Pro dan kontra", density: "bold", vertical: "center", sources: ["Equibles, data per 16 Okt 2026"],
      nodes: [
        { type: "slideHeading", title: "AMD: dua sisi yang perlu ditimbang." },
        { type: "prosCons", proLabel: "Pro", conLabel: "Kontra",
          pros: ["Guidance tercapai atau terlampaui 7 dari 8 kali", "Target growth data center minimal 100% di 2027", "Server CPU ditargetkan tumbuh minimal 70% di 2027"],
          cons: ["P/E 136× jauh di atas median peer 42×", "Operating margin 15,7% vs 65,2% milik NVIDIA", "Turun 5,95% dalam sehari pada 16 Okt"] },
        { type: "callout", label: "Intinya", text: "Cerita growth AMD kuat, tapi harganya mengasumsikan hampir semuanya berjalan sesuai rencana." }
      ] },

    { type: "freeform", theme: "ivory", eyebrow: "Kesimpulan", density: "balanced", vertical: "center",
      nodes: [
        { type: "slideHeading", title: "Pandangan akhir." },
        { type: "verdictCard", verdict: "watch", title: "NVIDIA lebih murah, AMD perlu bukti.", text: "NVIDIA unggul di margin dan valuasi. Harga AMD baru masuk akal kalau EPS mendekati target $20.",
          reasons: ["Pantau EPS AMD tiap kuartal", "Bandingkan gross margin AMD dengan guidance 56%", "Tunggu harga yang lebih aman sebelum entry"],
          caution: "Ilustrasi analisis, bukan nasihat investasi. Sesuaikan dengan profil risikomu." }
      ] },

    { type: "cta", title: "Simpan dan bagikan.", body: "Cek laporan resmi kedua perusahaan sebelum ambil keputusan.", cta: "Kirim ke temanmu yang memantau chip AI." }
  ]
};
