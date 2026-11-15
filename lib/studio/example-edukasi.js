// Reference carousel: education on one term (Stop Loss). The numbers are an
// explicit worked example (contoh hitungan), not market data.
export const exampleEdukasi = {
  version: 1,
  meta: {
    account: "trader",
    title: "Stop loss: cara membatasi kerugian sebelum terjadi",
    objective: "Save + Share",
    contentPillar: "Edukasi",
    hook: "Rugi 50% butuh untung 100% untuk kembali. Ini alasan stop loss ada.",
    instagramCaption: "Apa itu stop loss, cara menghitungnya, dan tiga kesalahan yang paling sering terjadi.\n\nIni edukasi, bukan ajakan membeli atau menjual.",
    tiktokCaption: "Rugi 50% butuh untung 100%. Ini cara stop loss membantumu.",
    cta: "Simpan dan kirim ke temanmu yang baru mulai trading.",
    hashtags: ["StopLoss", "EdukasiSaham", "ManajemenRisiko", "Saham"],
    keywords: ["stop loss", "risiko", "manajemen risiko"],
    notes: "Semua angka adalah contoh hitungan untuk edukasi, bukan data pasar."
  },
  slides: [
    { type: "hero", eyebrow: "Edukasi • Manajemen Risiko", title: "Stop loss: apa itu dan kenapa penting?", subtitle: "Definisi, contoh hitungan, cara kerja, dan kesalahan umum.", accent: "Edukasi, bukan ajakan transaksi.", density: "bold" },

    { type: "freeform", theme: "navy", eyebrow: "Definisi", density: "bold", vertical: "stretch",
      nodes: [
        { type: "slideHeading", title: "Stop loss adalah batas rugi yang ditentukan di awal." },
        { type: "textBlock", label: "Singkatnya", text: "Kamu menulis harga keluar sebelum membeli. Bila harga menyentuhnya, posisi ditutup dan kerugian berhenti di angka yang sudah kamu terima sejak awal.", size: "lg" },
        { type: "callout", label: "Analogi", text: "Seperti sabuk pengaman: tidak membuat perjalanan lebih cepat, tetapi membatasi akibat saat terjadi benturan." }
      ] },

    { type: "freeform", theme: "paper", eyebrow: "Contoh hitungan", density: "bold", vertical: "stretch", sources: ["Contoh hitungan, bukan data pasar"],
      nodes: [
        { type: "slideHeading", title: "Satu contoh, empat angka.", body: "Modal Rp10 juta, risiko 2% per transaksi." },
        { type: "statSnapshot", items: [
          { label: "Harga beli", value: "Rp1.000", sub: "Contoh angka" },
          { label: "Stop loss", value: "Rp950", sub: "5% di bawah harga beli", tone: "down" },
          { label: "Risiko maksimal", value: "Rp200 rb", sub: "2% dari Rp10 juta", tone: "down" },
          { label: "Jumlah saham", value: "4.000", sub: "Rp200 rb dibagi Rp50", tone: "neutral" }
        ] },
        { type: "callout", label: "Hasilnya", text: "Bila stop tersentuh, rugi sekitar Rp200 ribu atau 2% modal. Tanpa stop, angkanya tidak punya batas." }
      ] },

    { type: "freeform", theme: "sand", eyebrow: "Cara kerja", density: "bold", vertical: "stretch",
      nodes: [
        { type: "slideHeading", title: "Empat langkah sebelum klik beli." },
        { type: "flow", items: [
          { label: "Tentukan risiko", note: "Mis. 2% modal" },
          { label: "Cari level stop", note: "Di bawah support" },
          { label: "Hitung jumlah saham", note: "Risiko dibagi jarak" },
          { label: "Pasang order", note: "Sebelum harga bergerak" }
        ] },
        { type: "callout", label: "Urutan", text: "Stop dihitung lebih dulu, baru jumlah saham. Bukan sebaliknya." }
      ] },

    { type: "freeform", theme: "midnight", eyebrow: "Mitos dan fakta", density: "bold", vertical: "stretch",
      nodes: [
        { type: "slideHeading", title: "Tiga salah paham tentang stop loss." },
        { type: "mythFact", dark: true, items: [
          { myth: "Stop loss membuatku pasti rugi.", fact: "Ia membatasi rugi. Tanpanya kerugian bisa jauh lebih besar." },
          { myth: "Stop dekat selalu lebih aman.", fact: "Stop terlalu dekat mudah tersentuh fluktuasi biasa." },
          { myth: "Cukup digeser kalau hampir kena.", fact: "Menggeser stop menjauh sama dengan menghapus rencana." }
        ] }
      ] },

    { type: "freeform", theme: "ice", eyebrow: "Kesalahan umum", density: "bold", vertical: "stretch",
      nodes: [
        { type: "slideHeading", title: "Cek sebelum memasang stop." },
        { type: "checklist", items: ["Stop ditulis sebelum entry, bukan sesudahnya", "Jarak stop mengikuti level teknikal atau ATR", "Ukuran posisi dihitung dari jarak stop", "Tidak menggeser stop menjauh dari harga", "Risiko per transaksi tetap, mis. 1–2% modal"] },
        { type: "callout", label: "Ingat", text: "Rugi 50% butuh untung 100% untuk kembali ke modal awal. Stop loss mencegah lubang sedalam itu." }
      ] },

    { type: "freeform", theme: "ivory", eyebrow: "Istilah terkait", density: "bold", vertical: "stretch",
      nodes: [
        { type: "slideHeading", title: "Tiga istilah yang sering muncul bersama." },
        { type: "glossary", items: [
          { term: "Take profit", meaning: "Harga target untuk menutup posisi saat sudah untung." },
          { term: "Risk reward", meaning: "Perbandingan potensi untung dengan risiko rugi pada satu transaksi." },
          { term: "ATR", meaning: "Rata-rata gerak harian harga; dipakai untuk menentukan jarak stop." }
        ] },
        { type: "callout", label: "Langkah berikut", text: "Pelajari risk reward dulu: ia menentukan apakah satu transaksi layak diambil." }
      ] },

    { type: "cta", title: "Simpan untuk referensi.", body: "Tulis stop lossmu sebelum membeli, bukan sesudahnya.", cta: "Kirim ke temanmu yang baru mulai trading." }
  ]
};
