// Reference carousel: broker summary. The ticker ABCD and every figure are
// fictitious sample numbers ("contoh angka"); the broker codes are generic.
export const exampleBroker = {
  version: 1,
  meta: {
    account: "trader",
    title: "ABCD: siapa yang mengumpulkan dan siapa yang melepas?",
    objective: "Save + Share",
    contentPillar: "Bandarmologi",
    hook: "Lima broker beli menguasai 62% nilai beli ABCD hari ini.",
    instagramCaption: "Broker summary ABCD: net asing, top pembeli, top penjual, dan cara membacanya.\n\nContoh angka untuk edukasi. Ini bukan ajakan membeli atau menjual.",
    tiktokCaption: "Lima broker beli menguasai 62% nilai beli. Apa artinya?",
    cta: "Simpan dan bagikan ke temanmu yang aktif di saham Indonesia.",
    hashtags: ["BrokerSummary", "SahamIndonesia", "IHSG", "Bandarmologi"],
    keywords: ["broker summary", "net asing", "akumulasi", "distribusi"],
    notes: "Contoh angka fiktif untuk saham ABCD. Ganti seluruhnya dengan data broker summary dari sumber pengguna (mis. RTI, Stockbit, atau IDX)."
  },
  slides: [
    { type: "hero", eyebrow: "ABCD • Broker Summary • Contoh angka", title: "ABCD: siapa yang mengumpulkan, siapa yang melepas?", subtitle: "Net asing, top pembeli, top penjual, dan cara membacanya.", accent: "Contoh angka, bukan ajakan transaksi.", density: "bold" },

    { type: "freeform", theme: "navy", eyebrow: "Ringkasan", density: "balanced", vertical: "center", sources: ["Contoh angka fiktif"],
      nodes: [
        { type: "slideHeading", title: "Pembeli besar lebih dominan dari penjual.", body: "Selisih nilai top 5 beli dan top 5 jual positif." },
        { type: "statSnapshot", items: [
          { label: "Nilai transaksi", value: "Rp182 M", sub: "Total hari ini" },
          { label: "Top 5 beli", value: "62%", sub: "Dari nilai beli", tone: "up" },
          { label: "Top 5 jual", value: "48%", sub: "Dari nilai jual", tone: "down" },
          { label: "Net asing", value: "+Rp9,4 M", sub: "Net buy", tone: "up" }
        ] }
      ] },

    { type: "freeform", theme: "paper", eyebrow: "Top pembeli", density: "balanced", vertical: "center", sources: ["Contoh angka fiktif"],
      nodes: [
        { type: "slideHeading", title: "Lima broker yang paling banyak membeli." },
        { type: "marketRank", tone: "up", items: [
          { ticker: "YP", value: "Rp31,2 M", change: "17%", bar: 100 },
          { ticker: "KZ", value: "Rp24,6 M", change: "14%", bar: 79 },
          { ticker: "CC", value: "Rp21,0 M", change: "12%", bar: 67 },
          { ticker: "NI", value: "Rp18,3 M", change: "10%", bar: 59 },
          { ticker: "OD", value: "Rp15,9 M", change: "9%", bar: 51 }
        ] }
      ] },

    { type: "freeform", theme: "sand", eyebrow: "Top penjual", density: "balanced", vertical: "center", sources: ["Contoh angka fiktif"],
      nodes: [
        { type: "slideHeading", title: "Lima broker yang paling banyak menjual." },
        { type: "marketRank", tone: "down", items: [
          { ticker: "PD", value: "Rp22,8 M", change: "13%", bar: 100 },
          { ticker: "XL", value: "Rp19,4 M", change: "11%", bar: 85 },
          { ticker: "DR", value: "Rp17,1 M", change: "9%", bar: 75 },
          { ticker: "AK", value: "Rp14,7 M", change: "8%", bar: 64 },
          { ticker: "BK", value: "Rp12,5 M", change: "7%", bar: 55 }
        ] }
      ] },

    { type: "freeform", theme: "midnight", eyebrow: "Bacaan", density: "balanced", vertical: "center", sources: ["Contoh angka fiktif"],
      nodes: [
        { type: "slideHeading", title: "Dua sisi, satu bacaan." },
        { type: "signalGrid", items: [
          { name: "Konsentrasi beli", reading: "62% di 5 broker, lebih terpusat", signal: "up" },
          { name: "Konsentrasi jual", reading: "48% di 5 broker, lebih tersebar", signal: "flat" },
          { name: "Asing", reading: "Net buy Rp9,4 M", signal: "up" },
          { name: "Harga", reading: "Naik 1,8% dalam sehari", signal: "up" }
        ] },
        { type: "callout", label: "Intinya", text: "Beli terpusat dan jual tersebar condong ke akumulasi, tetapi satu hari belum cukup untuk menyimpulkan." }
      ] },

    { type: "freeform", theme: "ice", eyebrow: "Cara membaca", density: "bold", vertical: "stretch",
      nodes: [
        { type: "slideHeading", title: "Jangan baca satu hari saja." },
        { type: "checklist", items: ["Bandingkan 3 sampai 5 hari terakhir", "Lihat apakah broker yang sama terus membeli", "Cocokkan dengan pergerakan harga dan volume", "Hati-hati bila pembeli dan penjual satu grup", "Broker summary adalah petunjuk, bukan kepastian"] },
        { type: "callout", label: "Ingat", text: "Pola yang berulang beberapa hari lebih berarti daripada lonjakan satu hari." }
      ] },

    { type: "freeform", theme: "ivory", eyebrow: "Kesimpulan", density: "balanced", vertical: "center",
      nodes: [
        { type: "slideHeading", title: "Pandangan akhir." },
        { type: "verdictCard", verdict: "watch", title: "Condong akumulasi, tunggu bukti.", text: "Beli terpusat dan net asing positif. Konfirmasi dengan data beberapa hari ke depan.",
          reasons: ["Top 5 beli menguasai 62% nilai beli", "Net asing positif Rp9,4 M", "Harga naik 1,8% tanpa distribusi jelas"],
          caution: "Contoh angka untuk edukasi, bukan nasihat investasi. Ganti dengan data resmi." }
      ] },

    { type: "cta", title: "Simpan dan bagikan.", body: "Cek data broker summary resmi sebelum mengambil keputusan.", cta: "Kirim ke temanmu yang aktif di saham Indonesia." }
  ]
};
