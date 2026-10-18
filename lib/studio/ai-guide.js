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
- Buat jumlah slide sesuai permintaan, biasanya 10. Hero pembuka dan CTA penutup.
- Jangan menambahkan komponen, prop, className, style, HTML, URL gambar, atau
  JavaScript yang tidak didukung daftar di bawah.

METADATA:
meta: account ("journey"|"trader"), title, objective, contentPillar, hook, instagramCaption, tiktokCaption,
cta, hashtags:[string], keywords:[string], notes.
Kedua caption berbeda dan layak posting. CTA terkait tujuan konten.
- Tulis caption TikTok dengan pemisah paragraf yang disengaja memakai \n\n pada nilai string JSON.
  Jangan mengandalkan teks yang hanya membungkus secara visual di Studio; enter harus benar-benar ada.
- Untuk TikTok, gunakan paragraf singkat: hook, penjelasan, dan CTA. Jangan menulis
  caption sebagai satu paragraf panjang. Hindari spasi manual untuk mengatur baris.

PRESET:
hero: eyebrow, title, subtitle, accent?, density?
statement: eyebrow?, lead, highlight, note?, density?, backgroundWord?, cornerLabel?
bullet: eyebrow?, title, items:[{title,text}], density?, backgroundWord?, cornerLabel?
compare: eyebrow?, title, left:{label,heading,points:[string]},
         right:{label,heading,points:[string]}, density?, backgroundWord?, cornerLabel?, keywords?:[string]
causeEffect: causeTitle,causeText,effectTitle,effectText,
             chainLabel?,chainCaption?,chain?:[{title,note}],density?,backgroundWord?,cornerLabel?
framework: eyebrow?,title,steps:[{title,text}],density?,backgroundWord?,cornerLabel?,keywords?:[string]
summary: title,items:[string],density?,backgroundWord?,cornerLabel?,keywords?:[string]
cta: title,body,cta,density?
- backgroundWord, cornerLabel dan keywords bersifat opsional dan TIDAK muncul bila dihilangkan.
  Isi hanya bila relevan dengan topik ini (kata latar singkat, label sudut, chip kata kunci
  maksimal 8); jangan menyalin dari contoh.
freeform: eyebrow?,dark?,theme?,backgroundWord?,cornerLabel?,density?,nodes:[primitive]

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
- Gunakan assetIcon/assetShape hanya di dalam freeform.nodes.
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
- Pemetaan dua sumbu -> matrix2x2. Meluruskan kesalahpahaman -> mythFact. Menimbang satu pilihan -> prosCons. Transformasi -> beforeAfter. Hierarki/penyaringan -> funnel; level berurutan -> ladder; FAQ -> qaCard; ajakan komentar -> pollCard.
- Relasi konsep -> freeform + diagramNode/connector.
- Praktik -> freeform + checklist/callout.
- Kesimpulan -> summary; tindakan akhir -> cta.

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

export function makeAiPrompt({topic="",audience="Young professionals",objective="Save, share dan follow",slides=10,account="journey"}={}) {
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
JUMLAH SLIDE: ${slides}

${COMPONENT_GUIDE}

${capacityPromptSection()}

GAMBAR: jangan membuat properti "images" dan jangan mengisi properti image/avatar pada photoHero, phoneMockup, collage, avatarQuote (biarkan kosong; pengguna menempatkan foto dari Perpustakaan Gambar di Studio). Slot kosong tampil sebagai blok netral. Foto/gambar diunggah dan ditempatkan manual oleh pengguna di Studio; tinggalkan ruang kosong yang wajar bila topik membutuhkan foto.

CONTOH JSON VALID (ganti SELURUH isi sesuai topik; ini hanya contoh struktur):
${JSON.stringify(seed,null,2)}

KEMBALIKAN HANYA SATU CODE BLOCK json BERISI OBJEK JSON VALID VERSI 1. Jangan gunakan komponen referensi konten ChatGPT atau teks di luar code block.`;
}

export const starterJson=JSON.stringify(exampleCarousel,null,2);
