import {exampleCarousel} from "./example";
import {capacityPromptSection} from "./component-specs";
import {iconSets,shapeNames,backgroundThemes,assetUses,shapeUses} from "./assets";

const COMPONENT_GUIDE = `
SISTEM AKSIOMA CAROUSEL STUDIO — JSON v1

OUTPUT MUTLAK:
- Tampilkan seluruh JSON dalam satu code block berbahasa json agar bisa disalin langsung menggunakan tombol Copy code. Jangan gunakan komponen referensi konten ChatGPT.
- Kembalikan HANYA satu objek JSON valid di dalam satu code block json (tanpa teks pembuka/penutup,
  import, export default, JSX, komentar, trailing comma atau nilai undefined).
- Objek root: {"version":1,"meta":{...},"slides":[...]}.
- Semua nama properti wajib dalam kutip ganda. Gunakan teks Indonesia natural.
- Semua content harus orisinal sesuai topik, JANGAN menyalin copy dari contoh.
- Susun alur: hook -> masalah -> penjelasan -> contoh -> aksi -> rangkuman -> CTA.
- Jumlah slide mengikuti kebutuhan materi, bukan angka tetap (lihat JUMLAH SLIDE). Hero pembuka dan CTA penutup.
- Jangan menambahkan komponen, prop, className, style, HTML, URL gambar, atau
  JavaScript yang tidak didukung daftar di bawah.

METADATA:
meta: account ("journey"|"trader"), title, objective, contentPillar, hook, instagramCaption, tiktokCaption,
cta, hashtags:[string], keywords:[string], notes.
Kedua caption berbeda dan layak posting. CTA terkait tujuan konten.
- Tulis caption TikTok dengan pemisah paragraf yang disengaja memakai \\n\\n pada nilai string JSON.
  Jangan mengandalkan teks yang hanya membungkus secara visual di Studio; enter harus benar-benar ada.
- Untuk TikTok, gunakan paragraf singkat: hook, penjelasan, dan CTA. Jangan menulis
  caption sebagai satu paragraf panjang. Hindari spasi manual untuk mengatur baris.

PRESET:
hero: eyebrow, title, subtitle, accent?, density?
statement: eyebrow?, lead, highlight, note?, density?, vertical?, extras?, theme?, decorations?, backgroundWord?, cornerLabel?
bullet: eyebrow?, title, items:[{title,text}], density?, vertical?, extras?, theme?, decorations?, backgroundWord?, cornerLabel?
compare: eyebrow?, title, left:{label,heading,points:[string]},
         right:{label,heading,points:[string]}, density?, vertical?, extras?, theme?, decorations?, backgroundWord?, cornerLabel?, keywords?:[string]
causeEffect: causeTitle,causeText,effectTitle,effectText,
             chainLabel?,chainCaption?,chain?:[{title,note}],density?,vertical?,extras?,theme?,decorations?,backgroundWord?,cornerLabel?
framework: eyebrow?,title,steps:[{title,text}],density?, vertical?, extras?, theme?, decorations?,backgroundWord?,cornerLabel?,keywords?:[string]
summary: title,items:[string],density?, vertical?, extras?, theme?, decorations?,backgroundWord?,cornerLabel?,keywords?:[string]
cta: title,body,cta,density?
- backgroundWord, cornerLabel dan keywords bersifat opsional dan TIDAK muncul bila dihilangkan.
  Isi hanya bila relevan dengan topik ini (kata latar singkat, label sudut, chip kata kunci
  maksimal 8); jangan menyalin dari contoh.
freeform: eyebrow?,dark?,theme?,backgroundWord?,cornerLabel?,density?,vertical?,extras?,decorations?,sources?,nodes:[primitive]
- sources?: [string] (maks 3, tiap maks 80 karakter) pada slide mana pun selain hero/cta; tampil otomatis sebagai catatan "Sumber" di bawah slide. WAJIB diisi bila slide memuat angka, tanggal, atau klaim faktual dari berita/riset; tulis nama sumber nyata, bukan karangan.

PRIMITIVES HANYA DI DALAM freeform.nodes:
slideHeading: title,body?,eyebrow?,align? ("left"|"center")
infoCard: eyebrow?,title,text,variant? ("soft"|"outline"|"accent"|"dark"|"glass")
statCard: value,label,note?,variant? ("light"|"dark")
bigNumber: value,label?,dark?
quoteCard: quote,source?,dark?
diagramNode: title,body?,accent?,dark?
connector: direction? ("down"|"right"),label?,dark?
timeline: items:[{title,text}],dark?
checklist: items:[string],dark?
callout: label?,text,dark?
pill: text,dark?
keywordCluster: items:[string],dark? (HANYA untuk taksonomi/kategori yang benar-benar perlu dibedakan; bukan pengulangan kata dari paragraf)
miniDiagram: items:[string],dark?
barChart: unit?,max?,items:[{label,value (ANGKA, bukan teks),note?}],dark? (HANYA data yang diberikan/terverifikasi)
matrix2x2: xAxis?:{low,high},yAxis?:{low,high},quadrants:[4 x {title,text?}] (urutan kiri-atas, kanan-atas, kiri-bawah, kanan-bawah),dark?
table: columns:[2-4 teks],rows:[{cells:[teks per kolom]}],dark?
mythFact: mythLabel?,factLabel?,items:[{myth,fact}],dark?
prosCons: proLabel?,conLabel?,pros:[string],cons:[string],dark?
beforeAfter: slot? ("md"|"lg", ruang kosong untuk gambar pengguna),before:{label?,title?,text?},after:{label?,title?,text?},dark?
funnel: shape? ("funnel"|"pyramid"),items:[{label,note?}],dark?
ladder: items:[{label,value?,note?,current? (boolean)}],dark? (level atas ke bawah)
qaCard: items:[{q,a}],dark?
pollCard: question,options:[2-4 string],cta?,dark? (untuk mengajak komentar)
swipeHint: text? (maks 16),align? ("left"|"center"|"right"),dark?
sourceNote: text,label?,dark? (sumber/disclaimer kecil; jangan mengarang sumber)
textBlock: text,label?,size? ("md"|"lg"),dark? (paragraf penjelas tanpa kartu)
flow: items:[{label,note?,via?}] (2–5 langkah), direction? ("row"|"column"), fork?:[{label,note?,via?},{...}] (tepat 2 hasil percabangan setelah langkah terakhir), dark?
glossary: items:[{term,meaning}],dark?
footnote: items:[string] (catatan kaki bernomor),dark?
progressRing: value (ANGKA 0-100),label?,note?,dark?
photoHero: size? ("sm"|"md"|"lg"),shape? ("square"|"rounded"|"circle"),fit?,overlay? (boolean),title?,text?,dark? (JANGAN isi image)
phoneMockup: size? ("sm"|"md"),align?,caption?,dark? (JANGAN isi image)
collage: size? ("md"|"lg"),shape? ("square"|"rounded"),items:[2-4 x {caption?}],dark? (JANGAN isi image)
avatarQuote: quote,name?,role?,dark? (JANGAN isi avatar; hanya kutipan nyata yang diberikan pengguna)
divider: dark?
assetIcon: set ("lucide"|"phosphor"), name (dari registry), size? ("sm"|"md"|"lg"),
           tone? ("ink"|"accent"|"light"), label? (teks opsional)
assetShape: name (dari registry), position? ("full"|"topRight"|"bottomRight"|"bottomLeft"),
            opacity? ("subtle"|"soft"|"bold")
twoColumn,threeColumn,contentGrid,stack: children:[primitive]
contentGrid: columns? (1|2|3). Layout container dapat ditumpuk sampai 7 tingkat.

ASSET LIBRARY, SEMUANYA FILE SVG LOKAL (tanpa URL eksternal):
- Lucide: ${iconSets.lucide.join(", ")}.
- Phosphor duotone: ${iconSets.phosphor.join(", ")}.
- Dekorasi geometris Aksioma: ${shapeNames.join(", ")}.
- Ikon berguna untuk makna; dekorasi ditempatkan sebagai layer latar,
  bukan di atas teks. Pilih icon tone "light" untuk slide gelap.
- assetIcon hanya di dalam freeform.nodes. Dekorasi pada slide MANA PUN (kecuali hero/cta) dipasang lewat properti slide decorations:[{name,position?,opacity?}] (maks 2), bukan sebagai node; assetShape sebagai node hanya untuk freeform.
- Jangan karang nama asset. Semua nama wajib persis dari registry.
- PERUNTUKAN IKON: ${Object.entries(assetUses).map(([k,v])=>k+"="+v).join("; ")}.
- PERUNTUKAN DEKORASI: ${Object.entries(shapeUses).map(([k,v])=>k+"="+v).join("; ")}.
- PALET BACKGROUND FREEFORM: ${Object.entries(backgroundThemes).map(([k,v])=>k+" ("+(v.dark?"gelap":"terang")+", "+v.use+")").join("; ")}.
- Pilih tema selaras makna; palet mengatur warna teks otomatis.
- Jangan menempatkan dekorasi di atas teks; gunakan opacity subtle untuk konten padat.\n- Label section di atas slide adalah area terpisah: jangan susun ikon atau node yang mengganggu label.\n- Untuk freeform, perhitungkan tinggi seluruh konten termasuk ikon dan jarak; bila padat, kurangi node/teks atau gunakan density compact.\n- Jangan memakai ikon besar di awal freeform bila sekadar mengulang judul atau memaksa teks turun.
- Jangan pilih dark/light atau kartu putih berdasarkan estetika saja: prioritaskan kontras.

DENSITY: "airy"|"balanced"|"compact"|"bold".
Semua slide Instagram/TikTok Photo: 1080×1350. TikTok punya content margin
lebih konservatif; jangan membuat copy terlalu panjang. Gunakan batas ideal:
judul maksimal sekitar 10 kata, kartu maksimal 2 kalimat, CTA singkat.
Ini pedoman, bukan pengganti preview yang harus diperiksa.

SEMANTIC VISUAL MAPPING:
- Hook -> hero. Gagasan tunggal/reframe -> statement.
- Daftar sejajar -> bullet. Perbandingan -> compare.
- Sebab-akibat -> causeEffect. Langkah berurutan -> framework/timeline.
- Statistik -> freeform + statCard/bigNumber (JANGAN karang angka). Perbandingan banyak nilai -> barChart; kriteria x opsi -> table.
- Pemetaan dua sumbu -> matrix2x2. Meluruskan kesalahpahaman -> mythFact. Proses/keputusan jika-maka -> flow (fork); jargon -> glossary; konteks naratif -> textBlock; sumber -> sources atau footnote. Menimbang satu pilihan -> prosCons. Transformasi -> beforeAfter. Hierarki/penyaringan -> funnel; level berurutan -> ladder; FAQ -> qaCard; ajakan komentar -> pollCard.
- Relasi konsep -> freeform + diagramNode/connector.
- Praktik -> freeform + checklist/callout.
- Kesimpulan -> summary; tindakan akhir -> cta.

TINGGI SLIDE, vertical DAN extras (berlaku untuk statement, bullet, compare, causeEffect, framework, summary, freeform; bukan hero/cta):
- vertical: "center" (default; isi di tengah antara label dan footer), "top", "spread" (isi di atas, extras menempel di bawah), "stretch" (komponen melebar mengisi sisa tinggi).
- Slide TIDAK BOLEH terasa kosong di bawah. Target: isi (termasuk extras) memenuhi minimal sekitar 65% tinggi area konten. Bila isi utama pendek, tambahkan extras atau pakai density "bold"/"airy"; jangan biarkan sepertiga bawah kosong.
- extras: 1–3 blok pendukung di bawah isi utama, dari: callout, sourceNote, miniDiagram (maks 4), statCard, quoteCard, infoCard, keywordCluster (maks 6), checklist (maks 3), diagramNode, connector, pill, divider, swipeHint, progressRing, textBlock, flow (maks 4), glossary (maks 2), footnote (maks 3). Dengan extras, biarkan vertical "center" (blok isi + extras tampil seimbang) atau pakai "stretch" untuk slide berbasis kartu (bullet, summary, causeEffect, compare) agar kartu mengisi tinggi. Pakai "spread" hanya untuk catatan kaki/sumber yang memang harus di dasar slide.
- extras HARUS menambah informasi baru: implikasi/"jadi apa", contoh, definisi istilah, sumber/catatan kaki, batasan, atau langkah lanjut. DILARANG mengulang isi utama atau menjadi pengisi kosong. Bila tidak ada informasi tambahan yang benar, jangan isi extras.
- Pasangan yang dianjurkan: compare -> callout kesimpulan; mythFact/qaCard -> sourceNote; checklist -> miniDiagram "mulai dari mana"; causeEffect/framework -> callout implikasi; statistik -> sourceNote + catatan pembanding; summary -> callout langkah lanjut.
- Bila extras dipakai, kurangi isi utama ke jumlah "rekomendasi" (bukan maksimal) agar muat. Jangan memakai extras di setiap slide: variasikan, sisakan beberapa slide lega.

UKURAN TEKS SESUAI KOMPONEN DAN KANVAS (1080×1350):
- Tulis teks supaya MENGISI ruang komponen, bukan sekadar muat. Target panjang tiap field: sekitar 70–100% dari angka "rekomendasi" karakter pada bagian KAPASITAS TERUKUR, dan tidak pernah melewati "maks". Kartu besar berisi 3–4 kata terlihat kosong; kartu berisi kalimat penuh terlihat seimbang.
- Jumlah item: pakai angka rekomendasi untuk komponen yang menjadi isi utama slide (misalnya 4 bullet, 3 mitos/fakta, 5 langkah). Satu atau dua item saja hanya untuk slide yang sengaja lega (statement, kutipan, satu angka besar).
- Samakan panjang antar item sejajar (kartu kiri-kanan, baris tabel, poin compare) dalam selisih sekitar 30% agar kolom terlihat rata dan tidak ada kartu yang separuh kosong.
- Judul slide 4–9 kata, satu sampai dua baris. Teks pendukung 1–2 kalimat penuh (sekitar 90–160 karakter) pada kartu, bukan frasa pendek.
- Bila hasil bagian atas terlihat penuh tetapi bawah kosong, tambah extras berinformasi baru; jangan memanjangkan teks dengan kalimat pengisi.

RENCANA ASET (WAJIB DIPAKAI, jangan hanya menyebut di prompt):
- theme (background) berlaku untuk statement, bullet, compare, causeEffect, framework, summary, dan freeform (bukan hero/cta). Preset GELAP (bullet, causeEffect, summary) hanya menerima tema gelap: graphite, midnight, navy, forest, plum, wine, ember, cobalt, teal. Preset TERANG (statement, compare, framework) hanya menerima tema terang: paper, ivory, sand, blush, peach, lemon, mint, ice, lilac. Freeform menerima semua.
- Pakai MINIMAL 4 tema berbeda di antara slide isi, bergantian terang/gelap, dipilih dari kolom "use" tiap tema agar selaras makna (mis. wine untuk konflik, mint untuk pertumbuhan, navy untuk strategi). Slide tanpa theme memakai warna bawaan preset.
- Pasang decorations pada 4–6 slide isi (bukan semua), dipilih dari PERUNTUKAN DEKORASI. position: topRight/bottomRight/bottomLeft untuk menjaga teks; "full" hanya untuk slide lega. opacity "subtle" untuk slide padat (isi >70% tinggi), "soft" untuk slide lega, "bold" hanya untuk statement. Jangan memakai dekorasi yang sama dua slide berturut-turut.
- Pakai assetIcon (dalam freeform.nodes) pada 2–4 slide ketika ikon memperjelas makna sesuai PERUNTUKAN IKON; maksimal 1–2 ikon per slide dan tone "light" di slide gelap. Jangan memakai ikon sebagai hiasan.
- hero dan cta memakai identitas akun otomatis: jangan beri theme atau decorations.

HINDARI TEMPLATE:
- Jangan mengulang layout sama >2 slide berurutan.
- Variasikan density, dark/light, diagram, tipografi, dan ruang kosong.
- Hindari ikon dekoratif tanpa fungsi; cukup 1–2 aset utama per slide.
- Gunakan assetShape hanya apabila ruang kosong memadai dan tetap tidak mengganggu keterbacaan.
- Pakai freeform bila preset memaksa struktur gagasan.
- Panah hanya untuk relasi yang nyata; hubungan kiri-ke-kanan memakai "right".
- Jangan buat deretan keyword/pill hanya sebagai dekorasi atau mengulang kata dari paragraf.\n- Jika sebuah elemen dihapus tanpa kehilangan informasi, hapus elemen tersebut.\n- Label panjang harus tetap terbaca; lebih baik pakai teks atau kartu definisi daripada chip yang sesak.\n- Kualitas argumen, kejelasan, dan keterbacaan lebih penting dari dekorasi.
- Jangan menyalin langkah 'Kesimpulan cepat' di causeEffect jika tidak relevan.
- Tanpa klaim angka/riset/kutipan spesifik yang tak terverifikasi.

CONTOH DI BAWAH ADALAH REFERENSI STRUKTUR, BUKAN TOPIK ATAU COPY
YANG HARUS DIGUNAKAN KEMBALI.
`.trim();

export const STYLE_PRESETS={
  seimbang:{label:"Seimbang",text:""},
  edukatif:{label:"Edukatif padat",text:"GAYA HASIL: EDUKATIF PADAT. Slide terisi penuh dan terstruktur: utamakan framework, mythFact, table, checklist, flow, glossary. Isi extras (callout implikasi, glossary istilah, footnote sumber) pada sedikitnya 5 slide. density \"balanced\" atau \"compact\"; teks mengisi 80–100% angka rekomendasi; vertical \"center\" atau \"stretch\"."},
  reflektif:{label:"Reflektif lega",text:"GAYA HASIL: REFLEKTIF LEGA. Satu gagasan per slide dan ruang napas yang disengaja: utamakan statement, quoteCard, textBlock besar, compare sederhana. density \"airy\" atau \"bold\"; teks lebih ringkas (50–70% angka rekomendasi); extras hanya pada maksimal 3 slide dan harus bermakna (satu callout atau textBlock); vertical \"center\"."},
  data:{label:"Data-driven",text:"GAYA HASIL: DATA-DRIVEN. Tema dominan navy/cobalt/teal/ice dengan dekorasi editorial-grid atau dotted-field. Utamakan statCard, barChart, table, progressRing, ladder, funnel dan flow. Setiap slide yang memuat angka wajib punya sources (maks 3 teks sumber) dan/atau sourceNote atau footnote. Jangan menampilkan angka tanpa sumber; bila tidak ada data terverifikasi, pakai penjelasan kualitatif. Gunakan tema gelap/terang bergantian; vertical \"stretch\" atau \"center\"."},
};

const SLIDE_COUNT_AUTO="TENTUKAN SENDIRI sesuai kebutuhan materi. Satu gagasan utama per slide; jangan menambah slide hanya demi mencapai angka tertentu dan jangan memadatkan materi penting ke satu slide. Panduan: topik ringkas 5–7 slide, standar 8–12 slide, mendalam/tutorial 13–20 slide. Batas keras 20 untuk Instagram dan 35 untuk TikTok; bila ragu pilih maksimal 20 agar aman di kedua platform. Hero di slide pertama dan CTA di slide terakhir selalu ada.";
export function makeAiPrompt({topic="",audience="Young professionals",objective="Save, share dan follow",slides="auto",account="journey",style="seimbang"}={}) {
  const subject=topic.trim()||"[TULIS TOPIK KONTEN DI SINI]";
  const trader=account==="trader";
  const accountGuide=trader
    ? "AKUN: AKSIOMA TRADER. Fokus literasi pasar, saham, risiko, probabilitas dan disiplin. Gaya editorial tegas, berbasis data; hindari klaim return pasti, rekomendasi beli/jual personal, atau angka tanpa sumber. Cover dan CTA penutup otomatis memakai identitas navy-biru/teal Aksioma Trader."
    : "AKUN: AKSIOMA JOURNEY. Fokus mindset, personal development, berpikir kritis dan keterampilan hidup. Gaya hangat, reflektif dan aplikatif. Cover dan CTA penutup otomatis memakai identitas gelap/merah hangat serta emas-krem Aksioma Journey.";
  const seed={...exampleCarousel,meta:{...exampleCarousel.meta,account:trader?"trader":"journey"}};
  return `Buat carousel Aksioma yang siap ditempel ke /studio.

AKUN: ${trader?"aksioma-trader":"aksioma-journey"}\n${accountGuide}\n\nTOPIK: ${subject}
AUDIENS: ${audience.trim()||"Young professionals"}
TUJUAN: ${objective.trim()||"Save, share dan follow"}
JUMLAH SLIDE: ${slides==='auto'||!slides?SLIDE_COUNT_AUTO:slides+" slide (tepat; Hero pembuka dan CTA penutup termasuk dihitung)"}
${STYLE_PRESETS[style]?.text?STYLE_PRESETS[style].text+"\n":""}
${COMPONENT_GUIDE}

${capacityPromptSection()}

GAMBAR: jangan membuat properti "images" dan jangan mengisi properti image/avatar pada photoHero, phoneMockup, collage, avatarQuote (biarkan kosong; pengguna menempatkan foto dari Perpustakaan Gambar di Studio). Slot kosong tampil sebagai blok netral. Foto/gambar diunggah dan ditempatkan manual oleh pengguna di Studio; tinggalkan ruang kosong yang wajar bila topik membutuhkan foto.

CONTOH JSON VALID (ganti SELURUH isi sesuai topik; ini hanya contoh struktur):
${JSON.stringify(seed,null,2)}

KEMBALIKAN HANYA SATU CODE BLOCK json BERISI OBJEK JSON VALID VERSI 1. Jangan gunakan komponen referensi konten ChatGPT atau teks di luar code block.`;
}

export const starterJson=JSON.stringify(exampleCarousel,null,2);
