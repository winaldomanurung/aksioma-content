// Reference carousel. It doubles as the sample inside the AI prompt, so it is
// written to model good practice: 12 slides (the count follows the content),
// one idea per slide, 5+ themes, decorations on a few slides, extras and
// sources only where they add NEW information, varied compositions, and no
// repeated card grids back to back.
export const exampleCarousel = {
  version: 1,
  meta: {
    account: "journey",
    title: "Berpikir jernih saat pendapat terdengar meyakinkan",
    objective: "Save + Share",
    contentPillar: "Critical Thinking",
    hook: "Terdengar yakin bukan berarti benar.",
    instagramCaption: "Rasa yakin itu perasaan, bukan bukti. Carousel ini memberi lima pertanyaan sederhana untuk menguji sebuah klaim sebelum kamu mempercayainya atau membagikannya.\n\nSimpan untuk dipakai saat membaca berita, rapat, atau berdiskusi.",
    tiktokCaption: "Yakin ≠ benar. Simpan 5 pertanyaan ini sebelum menarik kesimpulan.",
    cta: "Simpan dan kirim ke teman diskusimu.",
    hashtags: ["Aksioma", "BerpikirKritis", "CriticalThinking", "PolaPikir"],
    keywords: ["critical thinking", "bukti", "asumsi", "bias konfirmasi"],
    notes: "Periksa mode TikTok + safe area sebelum posting. Angka pada slide 6 adalah ilustrasi: ganti dengan data yang bisa diverifikasi sebelum dipublikasikan."
  },
  slides: [
    { type: "hero", eyebrow: "Critical Thinking", title: "Terdengar yakin belum tentu benar.", subtitle: "Lima pertanyaan sederhana untuk menguji sebuah pendapat sebelum kamu mempercayainya.", accent: "Belajar berpikir lebih jernih.", density: "bold" },

    { type: "statement", theme: "ivory", eyebrow: "Inti masalah", lead: "Kita sering menyamakan rasa yakin dengan", highlight: "kebenaran.", note: "Keyakinan adalah perasaan. Kebenaran harus diuji.", density: "bold", backgroundWord: "THINK", cornerLabel: "Pause / Test", vertical: "center",
      decorations: [{ name: "orbital-rings", position: "topRight", opacity: "subtle" }],
      sources: ["Kahneman, Thinking, Fast and Slow (2011)"] },

    { type: "bullet", theme: "midnight", eyebrow: "Pisahkan dulu", title: "Satu klaim berisi tiga lapisan berbeda.", density: "balanced", backgroundWord: "BREAK", cornerLabel: "3 layers", vertical: "spread",
      items: [
        { title: "Fakta", text: "Apa yang benar-benar bisa diamati atau diukur?" },
        { title: "Interpretasi", text: "Makna apa yang kita berikan pada fakta itu?" },
        { title: "Kesimpulan", text: "Keputusan apa yang kita tarik darinya?" }
      ],
      decorations: [{ name: "contour-lines", position: "bottomRight", opacity: "subtle" }],
      extras: [{ type: "callout", label: "Cek cepat", text: "Tanyakan pada tiap kalimat: ini fakta, tafsiran, atau keputusan?" }] },

    { type: "compare", theme: "sand", title: "Dua cara menanggapi klaim.", backgroundWord: "VS", cornerLabel: "Contrast", vertical: "stretch", keywords: ["intuisi", "bukti", "uji"],
      left: { label: "Reaksi", heading: "Langsung percaya", points: ["Terasa masuk akal", "Sesuai pendapat sendiri", "Banyak yang setuju"] },
      right: { label: "Refleksi", heading: "Uji dulu", points: ["Periksa sumbernya", "Cari asumsi tersembunyi", "Bandingkan penjelasan lain"] },
      extras: [{ type: "miniDiagram", items: ["Klaim", "Bukti", "Uji", "Putusan"] }] },

    { type: "causeEffect", theme: "navy", causeTitle: "Kesimpulan terlalu cepat", causeText: "Begitu menemukan cerita yang terasa cocok, kita berhenti mencari bukti lain.", effectTitle: "Keyakinan makin kuat", effectText: "Informasi yang bertentangan mulai terasa tidak penting.", chainLabel: "Mekanisme", backgroundWord: "WHY", cornerLabel: "Mechanism", vertical: "stretch",
      chain: [
        { title: "Kesimpulan cepat", note: "Penjelasan pertama terasa cukup." },
        { title: "Cari konfirmasi", note: "Hanya mencari yang sejalan dengan dugaan." },
        { title: "Keyakinan mengeras", note: "Bantahan terasa mengganggu." }
      ],
      extras: [{ type: "footnote", items: ["Pola ini dikenal sebagai bias konfirmasi."] }] },

    { type: "freeform", theme: "ice", eyebrow: "Contoh angka", density: "balanced", backgroundWord: "DATA", vertical: "spread",
      decorations: [{ name: "editorial-grid", position: "topRight", opacity: "subtle" }],
      sources: ["Ilustrasi penulis; ganti dengan data terverifikasi"],
      nodes: [
        { type: "slideHeading", title: "Angka besar belum tentu menjelaskan semuanya.", body: "Tanyakan: dari siapa, dibanding apa, dalam periode berapa?" },
        { type: "barChart", unit: "%", items: [
          { label: "Yakin dan benar", value: 48 },
          { label: "Yakin tetapi keliru", value: 32 },
          { label: "Ragu dan benar", value: 20 }
        ] },
        { type: "callout", label: "Prinsip", text: "Statistik tanpa konteks mudah disalahartikan." }
      ] },

    { type: "framework", theme: "paper", title: "Lima pertanyaan sebelum percaya.", density: "compact", vertical: "stretch", backgroundWord: "TEST", cornerLabel: "5 questions", keywords: ["claim", "evidence", "assumption", "alternative", "test"],
      steps: [
        { title: "Claim", text: "Apa tepatnya yang diklaim?" },
        { title: "Evidence", text: "Bukti apa yang mendukungnya?" },
        { title: "Assumption", text: "Asumsi apa yang tersembunyi?" },
        { title: "Alternative", text: "Adakah penjelasan lain?" },
        { title: "Test", text: "Apa yang bisa mengubah kesimpulan?" }
      ] },

    { type: "freeform", theme: "mint", eyebrow: "Prioritas", density: "balanced", backgroundWord: "2×2", vertical: "center", nodes: [
      { type: "slideHeading", title: "Tidak semua klaim perlu diuji sama dalamnya." },
      { type: "matrix2x2", xAxis: { low: "Mudah dicek", high: "Sulit dicek" }, yAxis: { low: "Dampak kecil", high: "Dampak besar" },
        quadrants: [
          { title: "Uji dulu", text: "Dampak besar, mudah dicek." },
          { title: "Rencanakan", text: "Dampak besar, butuh riset." },
          { title: "Cek sekilas", text: "Dampak kecil, mudah dicek." },
          { title: "Lewati", text: "Dampak kecil, mahal dicek." }
        ] },
      { type: "textBlock", label: "Aturan praktis", size: "md", text: "Makin besar taruhannya dan makin murah mengeceknya, makin wajib kamu mengujinya." }
    ] },

    { type: "freeform", theme: "lilac", eyebrow: "Salah kaprah", density: "balanced", backgroundWord: "MYTH", vertical: "center",
      decorations: [{ name: "soft-blobs", position: "bottomRight", opacity: "subtle" }],
      extras: [{ type: "textBlock", label: "Intinya", size: "md", text: "Skeptis yang sehat bukan menolak segalanya, melainkan mau mengubah pikiran ketika buktinya berubah." }],
      nodes: [
        { type: "slideHeading", title: "Tiga mitos tentang berpikir kritis." },
        { type: "mythFact", items: [
          { myth: "Berpikir kritis berarti curiga pada semua hal.", fact: "Artinya menakar keyakinan sesuai bukti." },
          { myth: "Orang pintar kebal terhadap bias.", fact: "Kecerdasan justru bisa memperkuat pembenaran." },
          { myth: "Cukup membaca lebih banyak.", fact: "Tanpa kriteria uji, bacaan hanya menambah konfirmasi." }
        ] }
      ] },

    { type: "freeform", theme: "graphite", eyebrow: "Latihan", density: "balanced", backgroundWord: "FLOW", vertical: "center",
      decorations: [{ name: "dotted-field", position: "bottomRight", opacity: "subtle" }],
      extras: [{ type: "callout", label: "Latihan hari ini", text: "Pilih satu klaim yang kamu percaya, lalu cari satu bukti yang bisa membantahnya." }],
      nodes: [
        { type: "slideHeading", title: "Dari berita ke keputusan: di mana kamu bisa berhenti?" },
        { type: "flow", items: [{ label: "Baca klaim", via: "lalu" }, { label: "Tahan reaksi", via: "tanya" }, { label: "Uji dulu" }],
          fork: [{ via: "Bukti kuat", label: "Percaya, tetap terbuka" }, { via: "Bukti lemah", label: "Tunda kesimpulan" }] },
        { type: "glossary", items: [
          { term: "Bias konfirmasi", meaning: "Kecenderungan mencari bukti yang mendukung dugaan awal." },
          { term: "Asumsi", meaning: "Anggapan yang dipakai tanpa dibuktikan." }
        ] }
      ] },

    { type: "summary", theme: "midnight", title: "Empat kebiasaan yang layak disimpan.", backgroundWord: "KEEP", cornerLabel: "Takeaway", vertical: "stretch", keywords: ["fact", "assumption", "alternative", "confidence"],
      items: ["Bedakan fakta dari interpretasi.", "Pertanyakan asumsi.", "Cari penjelasan alternatif.", "Ubah keyakinan saat bukti berubah."] },

    { type: "cta", title: "Jangan buru-buru yakin.", body: "Pendapat yang kuat justru terbuka untuk diuji dan direvisi.", cta: "Simpan lima pertanyaan ini untuk diskusi berikutnya." }
  ]
};
