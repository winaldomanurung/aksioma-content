import {exampleCarousel} from "./example";
import {iconSets,shapeNames,backgroundThemes,assetUses,shapeUses} from "./assets";

const COMPONENT_GUIDE = `
SISTEM AKSIOMA CAROUSEL STUDIO — JSON v1

OUTPUT MUTLAK:
- Kembalikan HANYA satu objek JSON valid (tanpa markdown fence, teks pembuka,
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

PRESET:
hero: eyebrow, title, subtitle, accent?, density?
statement: eyebrow?, lead, highlight, note?, keywords?:[string], density?
bullet: eyebrow?, title, items:[{title,text}], density?
compare: eyebrow?, title, left:{label,heading,points:[string]},
         right:{label,heading,points:[string]}, density?
causeEffect: causeTitle,causeText,effectTitle,effectText,
             chainLabel?,chainCaption?,chain?:[{title,note}],density?
framework: eyebrow?,title,steps:[{title,text}],density?
summary: title,items:[string],density?
cta: title,body,cta,density?
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
keywordCluster: items:[string],dark?
miniDiagram: items:[string],dark?
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
- Jangan menempatkan dekorasi di atas teks; gunakan opacity subtle untuk konten padat.
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
- Statistik -> freeform + statCard/bigNumber (JANGAN karang angka).
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
- Kualitas argumen, kejelasan, dan keterbacaan lebih penting dari dekorasi.
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

CONTOH JSON VALID (ganti SELURUH isi sesuai topik; ini hanya contoh struktur):
${JSON.stringify(seed,null,2)}

KEMBALIKAN HANYA JSON VALID VERSI 1.`;
}

export const starterJson=JSON.stringify(exampleCarousel,null,2);
