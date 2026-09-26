export const exampleCarousel = {
  version: 1,
  meta: {
    account: "journey",
    title: "Berpikir jernih saat pendapat terdengar meyakinkan",
    objective: "Save + Share",
    contentPillar: "Critical Thinking",
    hook: "Terdengar yakin bukan berarti benar.",
    instagramCaption: "Sebelum percaya pada sebuah pendapat, periksa klaim, bukti, dan asumsi di baliknya.\n\nSimpan carousel ini untuk dipakai saat berdiskusi.",
    tiktokCaption: "Yakin ≠ benar. Simpan 5 pertanyaan ini sebelum menarik kesimpulan.",
    cta: "Simpan dan bagikan ke teman diskusimu.",
    hashtags: ["Aksioma", "BerpikirKritis", "CriticalThinking"],
    keywords: ["critical thinking", "bukti", "asumsi"],
    notes: "Periksa mode TikTok + safe area sebelum posting."
  },
  slides: [
    { type: "hero", eyebrow: "Critical Thinking", title: "Terdengar yakin belum tentu benar.", subtitle: "Gunakan lima pertanyaan sederhana untuk menguji sebuah pendapat.", accent: "Belajar berpikir lebih jernih.", density: "bold" },
    { type: "statement", eyebrow: "Inti masalah", lead: "Kita sering menyamakan rasa yakin dengan", highlight: "kebenaran.", note: "Padahal keyakinan adalah perasaan, sementara kebenaran perlu diuji.", keywords: ["keyakinan", "bukti", "pengujian"], density: "balanced" },
    { type: "bullet", eyebrow: "Pisahkan", title: "Sebelum setuju, bedakan tiga hal ini.", items: [
      { title: "Fakta", text: "Apa yang benar-benar bisa diamati?" },
      { title: "Interpretasi", text: "Makna apa yang kita berikan pada fakta itu?" },
      { title: "Kesimpulan", text: "Apa yang akhirnya kita percayai?" }
    ] },
    { type: "compare", title: "Dua cara menanggapi klaim.", left: { label: "Reaksi", heading: "Langsung percaya", points: ["Terasa masuk akal", "Sesuai pendapat sendiri", "Banyak yang setuju"] }, right: { label: "Refleksi", heading: "Uji dulu", points: ["Periksa sumber", "Cari asumsi", "Pertimbangkan alternatif"] } },
    { type: "causeEffect", causeTitle: "Kesimpulan terlalu cepat", causeText: "Kita berhenti mencari bukti setelah menemukan cerita yang terasa cocok.", effectTitle: "Keyakinan makin kuat", effectText: "Kita mulai mengabaikan informasi yang bertentangan.", chainLabel: "Mekanisme", chain: [{title:"Kesimpulan cepat",note:"Penjelasan pertama terasa cukup."},{title:"Cari konfirmasi",note:"Mencari yang sejalan dengan dugaan."},{title:"Keyakinan mengeras",note:"Sulit menerima bantahan."}] },
    { type: "freeform", eyebrow: "Contoh nyata", theme: "ice", backgroundWord: "DATA", density: "balanced", nodes: [
      { type: "assetShape", name: "orbital-rings", position: "topRight", opacity: "subtle" },
      { type: "slideHeading", title: "Angka besar belum tentu menjelaskan semuanya.", body: "Sebuah statistik perlu konteks: periode, pembanding, dan cara pengukuran." },
      { type: "twoColumn", children: [
        { type: "statCard", value: "80%", label: "Contoh angka tanpa konteks", note: "Angka ini ilustrasi, bukan data penelitian." },
        { type: "infoCard", variant: "accent", eyebrow: "Tanyakan", title: "80% dari siapa?", text: "Berapa sampelnya? Dibanding apa? Dalam periode berapa lama?" }
      ] },
      { type: "assetIcon", set: "phosphor", name: "lightbulb", size: "sm", tone: "accent", label: "Periksa konteks" },
      { type: "callout", label: "Prinsip", text: "Statistik tanpa konteks mudah disalahartikan." }
    ] },
    { type: "framework", title: "Lima pertanyaan sebelum percaya.", density: "compact", steps: [
      { title: "Claim", text: "Apa tepatnya yang diklaim?" },
      { title: "Evidence", text: "Bukti apa yang mendukung?" },
      { title: "Assumption", text: "Asumsi apa yang tersembunyi?" },
      { title: "Alternative", text: "Adakah penjelasan lain?" },
      { title: "Test", text: "Apa yang bisa mengubah kesimpulan?" }
    ] },
    { type: "freeform", eyebrow: "Latihan", theme: "navy", density: "balanced", backgroundWord: "TEST", nodes: [
      { type: "slideHeading", title: "Jadikan diskusi sebagai proses pengujian." },
      { type: "timeline", dark: true, items: [
        { title: "Definisikan", text: "Pastikan kalian memakai istilah dengan makna yang sama." },
        { title: "Cari bukti", text: "Tanyakan data apa yang relevan." },
        { title: "Perbarui", text: "Revisi kesimpulan bila bukti baru muncul." }
      ] },
      { type: "callout", dark: true, label: "Mindset", text: "Tujuan berpikir kritis bukan selalu menang debat." }
    ] },
    { type: "summary", title: "Empat kebiasaan yang layak disimpan.", items: ["Bedakan fakta dari interpretasi.", "Pertanyakan asumsi.", "Cari penjelasan alternatif.", "Ubah keyakinan saat bukti berubah."] },
    { type: "cta", title: "Jangan buru-buru yakin.", body: "Pendapat yang kuat justru terbuka untuk diuji dan direvisi.", cta: "Simpan lima pertanyaan ini untuk diskusi berikutnya." }
  ]
};
