import {exampleCarousel} from "./example";
import {exampleJourney} from "./example-journey";
import {ACCOUNTS,accountOf,ACCOUNT_IDS} from "./accounts";
import {capacityPromptSection} from "./component-specs";
import {FULL_BUDGET,heightGuideLines} from "./market";
import {presetPrompt,presetExample} from "./presets";
import {LOOK_PRESETS,DEFAULT_LOOK,LOOK_IDS} from "./looks";
import {FONT_PRESETS,DEFAULT_FONT,FONT_IDS} from "./fonts";
import {iconSets,shapeNames,backgroundThemes,assetUses,shapeUses} from "./assets";
import {fieldContractSection,FINAL_CHECKLIST} from "./prompt-contract";

// The prompt is split into numbered sections (§0–§8) with an explicit
// precedence order, so a model never has to guess which rule wins.
const OUTPUT_RULES = `
§0 FORMAT JAWABAN (MUTLAK, prioritas tertinggi)
- Jawab dengan TEPAT SATU code block berbahasa json berisi satu objek JSON valid. Tanpa kalimat pembuka/penutup, tanpa penjelasan, tanpa komponen referensi/kutipan sumber ChatGPT.
- Di dalam code block: tanpa import/export, JSX, komentar, trailing comma, undefined, atau null.
- Root: {"version":1,"meta":{...},"slides":[...]}. Semua nama properti dan teks memakai kutip ganda lurus (").
- Bila jawaban terancam terpotong karena terlalu panjang, KURANGI jumlah slide; jangan pernah mengirim JSON yang terpotong.
`.trim();

const COMPONENT_GUIDE = `
§4 SKEMA KOMPONEN (hanya field yang tercantum di sini yang boleh dipakai; nilai enum dan batas karakter mengikuti §3)

ATURAN ISI:
- Tulis dengan bahasa Indonesia santai-profesional yang terdengar alami (lihat §2).
- Semua konten orisinal sesuai topik; JANGAN menyalin copy dari contoh §7.
- Susun alur: hook -> masalah -> penjelasan -> contoh -> aksi -> rangkuman -> CTA.
- Jumlah slide mengikuti §1. Hero pembuka dan CTA penutup.
- Jangan menambahkan komponen, prop, className, style, HTML, URL gambar, atau JavaScript yang tidak ada di daftar ini.

METADATA:
meta: account (${ACCOUNT_IDS.map(id=>'"'+id+'"').join("|")}; ikuti §1), title, objective, contentPillar, hook, instagramCaption, tiktokCaption,
cta, hashtags:[string], keywords:[string], notes, font? (${FONT_IDS.join("|")}; hilangkan untuk font bawaan), look? (${LOOK_IDS.join("|")}; hilangkan untuk tampilan bawaan).
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
- sources?: [string] (maks 3, tiap maks 80 karakter) pada slide mana pun selain hero/cta; tampil otomatis sebagai catatan "Sumber" di bawah slide. WAJIB diisi bila slide memuat angka, tanggal, atau klaim faktual dari berita/riset; tulis nama sumber nyata, bukan karangan. Mulai dengan nama penyedia data ("Equibles, harga harian"): nama sebelum koma otomatis masuk ke daftar sumber di caption.

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
flow: items:[{label,note?,via?}] (2–5 langkah; direction "row" otomatis turun baris: maks 3 langkah per baris, 4 langkah = 2+2, 5 langkah = 3+2), direction? ("row"|"column"), fork?:[{label,note?,via?},{...}] (tepat 2 hasil percabangan setelah langkah terakhir), dark?
glossary: items:[{term,meaning}],dark?
stockList: items:[{ticker,name?,signal? ("buy"|"accumulate"|"hold"|"watch"|"sell"),action?,entry?,target?,stop?,note?}] (1–8 saham sesuai jumlah dari pengguna; 1–3 kartu besar, 4–5 sedang, 6–8 baris ringkas TANPA note), numbered?,disclaimer? (default true; biarkan),dark?. JANGAN menulis disclaimerText (disclaimer bawaan otomatis). HANYA pakai saham dan angka dari pengguna; jangan mengarang harga/target. Lihat aturan KOMPONEN DATA SAHAM di bawah.
footnote: items:[string] (catatan kaki bernomor),dark?
priceChart: candles:[{o,h,l,c}] ATAU points:[angka] (5–60 data dari pengguna; jangan mengarang harga), levels?:[{kind ("entry"|"target"|"stop"|"support"|"resistance"),value,label?}] (maks 4), title?,caption?,from?,to?,dark?
stockCompare: left:{ticker,name?,signal?},right:{...},rows:[{label,left,right,better? ("left"|"right")}] (1–6),disclaimer?,dark?
tradePlan: ticker?,scenarios:[{kind ("bull"|"base"|"bear"),trigger,target?,note?}] (1–3),risk?,dark? (rencana bersyarat jika-maka, bukan prediksi pasti)
marketRank: items:[{ticker,value?,change?,bar? (0-100)}] (1–6 baris peringkat: top foreign buy/gainer/loser; value dan change persis seperti data pengguna),tone? ("up"|"down"|"neutral"),dark?
eventCalendar: items:[{date (mis. "21 Okt"),title,tag?,note?}] (1–6),dark?
compareCards: left:{label,heading,points?:[1–3 teks]},right:{...},delta? (lencana tengah, default "VS"),dark? — dua kartu kontras setinggi isinya (±300–460 px); WAJIB dipasangkan dengan satu komponen lain di bawahnya (signalGrid/statSnapshot 2–4 item atau callout). Heading ≤12 karakter (angka/kata besar), poin ≤44. Bersama komponen data lain + sources, pakai maksimal 2 poin per sisi.
sparkCards: items:[{label,value,sub?,points:[4–30 ANGKA urut waktu dari pengguna],tone?}] (1–6, ideal 4; kartu metrik dengan garis tren),dark?
gauge: items:[{label,value (ANGKA 0–100),display? (teks tengah),note?,tone? ("up"|"down"|"neutral"|"info")}] (1–4, ideal 3; cincin skor/persentase),dark?
rangeBars: items:[{label,low,high,current}] (1–5, ideal 3; ANGKA dengan low < current ≤ high; mis. 52 minggu, hari ini),unit? (awalan "$"/"Rp"),dark?
heatmap: items:[{name ≤10,change (ANGKA persen),sub?}] (4–12, ideal 6 atau 9; sektor/saham berwarna menurut perubahan),dark?
footballField: current (ANGKA harga sekarang),unit?,currentLabel?,items:[{label,low,high}] (2–5, ideal 3–4; rentang nilai wajar per metode; asal tiap rentang wajib ada di sources),dark?
statSnapshot: items:[{label,value,sub?,tone? ("up"|"down"|"neutral")}] (1–6 metrik kunci: yield, expense ratio, AUM, PER; value ≤12 karakter, persis seperti data pengguna),dark?
signalGrid: items:[{name,reading,signal ("up"|"down"|"flat")}] (1–6 bacaan indikator),dark?
priceLevels: items:[{kind ("entry"|"target"|"stop"|"support"|"resistance"),value,label?,current? (boolean)}] (2–6, urut dari harga tertinggi ke terendah; satu item boleh current:true),dark?
returnBars: groups:[{label,bars:[{name,value (ANGKA, boleh negatif),highlight? (boolean)}] (1–4)}] (1–3 kelompok, total batang ≤10),unit? (mis. "%"),signed? (boolean, default true),dark?
verdictCard: verdict ("buy"|"accumulate"|"hold"|"watch"|"sell"),title,text?,reasons?:[string] (maks 3),caution?,dark? (pandangan analisis, bukan ajakan transaksi)
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
- Dekorasi geometris: ${shapeNames.join(", ")}.
- Ikon berguna untuk makna; dekorasi ditempatkan sebagai layer latar,
  bukan di atas teks. Pilih icon tone "light" untuk slide gelap.
- assetIcon hanya di dalam freeform.nodes. Dekorasi pada slide MANA PUN (kecuali hero/cta) dipasang lewat properti slide decorations:[{name,position?,opacity?}] (maks 2). Bila decorations dihilangkan, slide tampil POLOS (tidak ada dekorasi otomatis). assetShape sebagai node hanya untuk freeform.
- Jangan karang nama asset. Semua nama wajib persis dari registry.
- PERUNTUKAN IKON: ${Object.entries(assetUses).map(([k,v])=>k+"="+v).join("; ")}.
- PERUNTUKAN DEKORASI: ${Object.entries(shapeUses).map(([k,v])=>k+"="+v).join("; ")}.
- PALET BACKGROUND FREEFORM: ${Object.entries(backgroundThemes).map(([k,v])=>k+" ("+(v.dark?"gelap":"terang")+", "+v.use+")").join("; ")}.
- Pilih tema selaras makna; palet mengatur warna teks otomatis.
- Jangan menempatkan dekorasi di atas teks; gunakan opacity subtle untuk konten padat.\n- Label section di atas slide adalah area terpisah: jangan susun ikon atau node yang mengganggu label.\n- Untuk freeform, perhitungkan tinggi seluruh konten termasuk ikon dan jarak; bila padat, kurangi node/teks atau gunakan density compact.\n- Jangan memakai ikon besar di awal freeform bila sekadar mengulang judul atau memaksa teks turun.
- Jangan pilih dark/light atau kartu putih berdasarkan estetika saja: prioritaskan kontras.

DENSITY (nilai persis di §3A): "airy" untuk slide lega, "balanced" standar, "compact" untuk slide padat, "bold" untuk satu gagasan bertulisan besar. Tidak ada nilai lain.
Semua slide Instagram/TikTok Photo: 1080×1350. TikTok punya content margin
lebih konservatif; jangan membuat copy terlalu panjang. Gunakan batas ideal:
judul maksimal sekitar 10 kata, kartu maksimal 2 kalimat, CTA singkat.
Ini pedoman, bukan pengganti preview yang harus diperiksa.

SEMANTIC VISUAL MAPPING:
- Hook -> hero. Gagasan tunggal/reframe -> statement.
- Daftar sejajar -> bullet. Kontras dua pihak -> compareCards di slide freeform + komponen pendamping di bawahnya (jangan slide compare yang kartunya terlalu tinggi untuk isi sedikit); perbandingan banyak angka -> stockCompare.
- Sebab-akibat -> causeEffect. Langkah berurutan -> framework/timeline.
- Statistik -> freeform + statCard/bigNumber (JANGAN karang angka). Perbandingan banyak nilai -> barChart; kriteria x opsi -> table.
- Pemetaan dua sumbu -> matrix2x2. Meluruskan kesalahpahaman -> mythFact. Proses/keputusan jika-maka -> flow (fork); jargon -> glossary; konteks naratif -> textBlock; sumber -> sources atau footnote. Menimbang satu pilihan -> prosCons. Transformasi -> beforeAfter. Hierarki/penyaringan -> funnel; level berurutan -> ladder; FAQ -> qaCard.
- Relasi konsep -> freeform + diagramNode/connector.
- Praktik -> freeform + checklist/callout.
- Kesimpulan -> summary; tindakan akhir -> cta.

TINGGI SLIDE, vertical DAN extras (berlaku untuk statement, bullet, compare, causeEffect, framework, summary, freeform; bukan hero/cta):
- vertical: "center" (default; isi di tengah antara label dan footer), "top", "spread" (isi di atas, extras menempel di bawah), "stretch" (komponen melebar mengisi sisa tinggi).
- Slide TIDAK BOLEH terasa kosong di bawah. Target: isi (termasuk extras) memenuhi minimal sekitar 65% tinggi area konten. Bila isi utama pendek, tambahkan extras atau pakai density "bold"/"airy"; jangan biarkan sepertiga bawah kosong.
- extras: 1–3 blok pendukung di bawah isi utama, dari: callout, sourceNote, miniDiagram (maks 4), statCard, quoteCard, infoCard, keywordCluster (maks 6), checklist (maks 3), diagramNode, connector, pill, divider, swipeHint, progressRing, textBlock, flow (maks 4), glossary (maks 2), footnote (maks 3). Dengan extras, biarkan vertical "center" (blok isi + extras tampil seimbang) atau pakai "stretch" untuk slide berbasis kartu (bullet, summary, causeEffect) agar kartu mengisi tinggi. Pakai "spread" hanya untuk catatan kaki/sumber yang memang harus di dasar slide.
- extras HARUS menambah informasi baru: implikasi/"jadi apa", contoh, definisi istilah, sumber/catatan kaki, batasan, atau langkah lanjut. DILARANG mengulang isi utama atau menjadi pengisi kosong. Bila tidak ada informasi tambahan yang benar, jangan isi extras.
- Pasangan yang dianjurkan: compare -> callout kesimpulan (jangan stretch; slide compare dengan <3 poin per sisi sebaiknya diganti compareCards + komponen pendamping); mythFact/qaCard -> sourceNote; checklist -> miniDiagram "mulai dari mana"; causeEffect/framework -> callout implikasi; statistik -> sourceNote + catatan pembanding; summary -> callout langkah lanjut.
- KOMPONEN DATA SAHAM (statSnapshot, signalGrid, priceLevels, returnBars, verdictCard, stockCompare, tradePlan, marketRank, eventCalendar): tinggi baris otomatis menyesuaikan jumlah item dan pendamping, jadi slide tidak melompong asal aturan ini diikuti.
  1) Sendirian di bawah slideHeading: isi item sebanyak data dari sumber (minimal 3; statSnapshot minimal 4; returnBars minimal 2 kelompok). Komponen akan melebar mengisi slide.
  2) Berpasangan dengan SATU extras (callout "Intinya" atau textBlock berisi interpretasi BARU dari sumber): pakai maksimal 4 item (statSnapshot maks 4, returnBars total maks 6 batang, priceLevels maks 4, verdictCard tanpa extras tambahan). sources juga memakan ruang: dengan sources, jangan menambah extras lain.
  3) Jangan menaruh dua komponen data di satu slide kecuali masing-masing ≤3 item. Jangan menambah extras bila sumber tidak punya informasi baru; lebih baik tambah item yang memang ada di sumber.
- ANGGARAN TINGGI SLIDE (hitung SEBELUM menulis tiap slide freeform):
  ${heightGuideLines().map((l) => "  " + l).join("\n")}
  Langkah: (a) pilih komponen utama sesuai makna datanya; (b) jumlahkan tinggi normalnya dengan pendamping/extras/sources; (c) target total 80–110% dari ${FULL_BUDGET} px. Kurang dari 80% (slide akan lega di bawah): tambahkan SATU komponen pengisi dari sumber, dengan urutan prioritas: item data tambahan pada komponen yang sama, signalGrid/priceLevels 2–3 item, statSnapshot 4 item (hanya bila sisa ≥ 300 px), callout "Intinya". Lebih dari 110%: kurangi item atau buang pendamping. Maksimal 3 blok per slide dan tidak ada dua komponen bertipe sama. Pengisi HARUS berisi informasi nyata dari sumber; bila sumber tidak punya lagi, biarkan slide ringkas dan jangan mengarang.
- Bila extras dipakai, kurangi isi utama ke jumlah "rekomendasi" (bukan maksimal) agar muat. Jangan memakai extras di setiap slide: variasikan, sisakan beberapa slide lega.

UKURAN TEKS SESUAI KOMPONEN DAN KANVAS (1080×1350):
- Tulis teks supaya MENGISI ruang komponen, bukan sekadar muat. Target panjang tiap field: sekitar 70–100% dari angka "rekomendasi" karakter pada bagian KAPASITAS TERUKUR, dan tidak pernah melewati "maks". Kartu besar berisi 3–4 kata terlihat kosong; kartu berisi kalimat penuh terlihat seimbang.
- Jumlah item: pakai angka rekomendasi untuk komponen yang menjadi isi utama slide (misalnya 4 bullet, 3 mitos/fakta, 5 langkah). Satu atau dua item saja hanya untuk slide yang sengaja lega (statement, kutipan, satu angka besar).
- Samakan panjang antar item sejajar (kartu kiri-kanan, baris tabel, poin compare) dalam selisih sekitar 30% agar kolom terlihat rata dan tidak ada kartu yang separuh kosong.
- Judul slide 4–9 kata, satu sampai dua baris. Teks pendukung 1–2 kalimat penuh (sekitar 90–160 karakter) pada kartu, bukan frasa pendek.
- Bila hasil bagian atas terlihat penuh tetapi bawah kosong, tambah extras berinformasi baru; jangan memanjangkan teks dengan kalimat pengisi.

PRIORITAS DAN ANTI-TABRAKAN (WAJIB; tabrakan teks adalah error terbesar di Studio):
- Urutan prioritas bila saling bertentangan: (1) tidak ada teks bertabrakan atau terpotong, (2) fakta benar dan bersumber, (3) slide tidak terasa kosong. Slide agak lega selalu lebih baik daripada slide yang bertabrakan.
- Kapasitas "rekomendasi" berlaku untuk SATU komponen yang berdiri sendiri. Begitu ada extras, sources, assetIcon, fork, atau komponen kedua, turunkan: teks maksimal 70% angka rekomendasi dan jumlah item dikurangi 1 dari rekomendasi.
- Sumber ("sources") memakai tinggi slide sendiri di dasar: anggap tiap sources membutuhkan setara satu baris ekstra.
- Freeform: maksimal 3 blok utama (slideHeading + 2 primitive) ATAU 2 blok utama + 1 extras. Jangan menumpuk slideHeading + assetIcon + flow (dengan fork) + checklist pada satu slide: pilih dua yang paling penting.
- Judul slide pada bullet, causeEffect, summary, dan freeform (slideHeading) yang memakai extras: maksimal 32 karakter agar tetap satu baris dan tidak naik menimpa label di atas slide. Tanpa extras: maksimal 48 karakter.
- Preset bullet/summary/causeEffect + extras: gunakan vertical "center" dan density "compact", bukan "stretch", kecuali isi utama hanya 3 item dengan teks pendek.
- Flow: label ≤20, note ≤36, via ≤10 karakter, fork.label ≤22, fork.via ≤12 (di bawah batas keras agar tidak terpotong). Lebih dari 3 langkah akan otomatis dipecah ke dua baris, jadi jangan menambah isi lain di bawahnya.
- Teks dalam kartu: satu kalimat penuh (≤70 karakter) lebih aman daripada dua kalimat. Hitung karakter setiap field sebelum menulis; jangan mengira-ngira.
- Jangan memakai kata sangat panjang (≥18 huruf) pada judul, label, atau chip.
- Cek mandiri sebelum menjawab: untuk setiap slide yang punya extras atau sources, hitung jumlah blok dan ulangi aturan di atas; bila ragu, hapus extras atau satu item.

RENCANA ASET (WAJIB DIPAKAI, jangan hanya menyebut di prompt):
- theme (background) berlaku untuk statement, bullet, compare, causeEffect, framework, summary, dan freeform (bukan hero/cta). Preset GELAP (bullet, causeEffect, summary) hanya menerima tema gelap: graphite, midnight, navy, forest, plum, wine, ember, cobalt, teal. Preset TERANG (statement, compare, framework) hanya menerima tema terang: paper, ivory, sand, blush, peach, lemon, mint, ice, lilac. Freeform menerima semua.
- Pakai MINIMAL 4 tema berbeda di antara slide isi, bergantian terang/gelap, dipilih dari kolom "use" tiap tema agar selaras makna (mis. wine untuk konflik, mint untuk pertumbuhan, navy untuk strategi). Slide tanpa theme memakai warna bawaan preset.
- Slide TIDAK mendapat dekorasi otomatis; slide data saham sebaiknya polos (jangan beri dekorasi di belakang kartu angka). Bila memang perlu, pilih lewat decorations:[{name,position?,opacity?}] (maks 2) dari PERUNTUKAN DEKORASI agar sesuai makna. Isi decorations:"none" hanya bila slide memang harus polos (mis. slide yang sangat padat). position: topRight/bottomRight/bottomLeft untuk menjaga teks; "full" hanya untuk slide lega. opacity "subtle" untuk slide padat (isi >70% tinggi), "soft" untuk slide lega, "bold" hanya untuk statement. Jangan memakai dekorasi yang sama dua slide berturut-turut.
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

`.trim();

export const STYLE_PRESETS={
  seimbang:{label:"Seimbang",text:""},
  edukatif:{label:"Edukatif padat",text:"GAYA HASIL: EDUKATIF PADAT. Slide terisi penuh dan terstruktur: utamakan framework, mythFact, table, checklist, flow, glossary. Isi extras (callout implikasi, glossary istilah, footnote sumber) pada sedikitnya 5 slide. density \"balanced\" atau \"compact\"; teks mengisi 60–80% angka rekomendasi (maksimal 70% pada slide yang memakai extras atau sources); vertical \"center\" (pakai \"stretch\" hanya bila tanpa extras). Prioritas: tidak bertabrakan lebih penting daripada slide penuh."},
  ringkas:{label:"Ringkas lega",text:"GAYA HASIL: RINGKAS LEGA. Satu gagasan per slide dan ruang napas yang disengaja: utamakan statement, bigNumber/statSnapshot 2–4 metrik, verdictCard, compare sederhana. density \"airy\" atau \"bold\"; teks lebih ringkas (50–70% angka rekomendasi); extras hanya pada maksimal 3 slide dan harus bermakna (satu callout atau textBlock); vertical \"center\"."},
  reflektif:{label:"Reflektif lega",text:"GAYA HASIL: REFLEKTIF LEGA. Satu gagasan per slide dan ruang napas yang disengaja: utamakan statement, quoteCard, textBlock besar, compare sederhana. density \"airy\" atau \"bold\"; teks lebih ringkas (50–70% angka rekomendasi); extras hanya pada maksimal 3 slide dan harus bermakna (satu callout atau textBlock); vertical \"center\"."},
  data:{label:"Data-driven",text:"GAYA HASIL: DATA-DRIVEN. Tema dominan navy/cobalt/teal/ice dengan dekorasi editorial-grid atau dotted-field. Utamakan statSnapshot, returnBars, signalGrid, priceLevels, priceChart, stockCompare, marketRank, table dan statCard. Setiap slide yang memuat angka wajib punya sources (maks 3 teks sumber) dan/atau sourceNote atau footnote. Jangan menampilkan angka tanpa sumber; bila tidak ada data terverifikasi, pakai penjelasan kualitatif. Gunakan tema gelap/terang bergantian; vertical \"stretch\" atau \"center\"."},
};

const LANGUAGE_GUIDE=`BAHASA DAN ISTILAH (WAJIB; hasil harus terdengar seperti analis atau trader Indonesia yang menulis caption, bukan terjemahan kaku):
1) Istilah teknis pasar TETAP BAHASA INGGRIS, jangan diterjemahkan: market cap, revenue, earnings, EPS, P/E, EV/EBIT, EV/Revenue, gross margin, operating margin, net margin, guidance, capex, cash flow, free cash flow, ARR, run rate, EBITDA, dividend yield, payout ratio, buyback, float, TTM, YoY, QoQ, peer, benchmark, track record, beat/miss (terhadap konsensus), upside, downside, outlook, watchlist, trade plan; support, resistance, entry, target price, stop loss / cut loss, breakout, breakdown, pullback, rally, sell-off, uptrend, downtrend, sideways, bullish, bearish, overbought, oversold, momentum, volume, 52-week high / low, all-time high, moving average, EMA, RSI, MACD; top gainer, top loser, net buy, net sell, broker summary, foreign flow, risk-on, risk-off, leverage.
2) Kata Indonesia hanya bila memang dipakai sehari-hari: harga, saham, laba bersih, rugi, naik, turun, kenaikan, penurunan, valuasi, kinerja, pasar, sektor, risiko, tren, kuartal, tahun, bulan, tercapai, terlampaui.
3) Jangan pakai terjemahan yang tidak natural. Ganti: kapitalisasi pasar -> market cap; pendapatan perusahaan -> revenue; laba per saham -> EPS; kelipatan valuasi / kelipatan harga -> valuasi atau multiple; margin operasi -> operating margin; margin kotor -> gross margin; panduan / arahan manajemen / janji manajemen -> guidance; belanja modal -> capex; rekam jejak -> track record; garis dukungan / hambatan -> support / resistance; titik masuk -> entry; potong rugi -> cut loss; pendukung / penahan -> pro / kontra; pembelian bersih -> net buy; puncak 52 minggu -> 52-week high; aliran dana asing -> foreign flow; menuntut bukti / harga terbayar / memberi ruang meleset -> tulis ulang dengan kalimat biasa (mis. "harga sudah mengantisipasi target", "tunggu konfirmasi", "tunggu harga yang lebih aman").
4) Gaya kalimat: pendek, lisan, aktif. Hindari kata baku kaku (dikarenakan, merupakan, terkait, terhadap, tersebut, sehubungan dengan) dan hindari terjemahan harfiah dari frasa Inggris. Campur Indonesia-Inggris dalam satu kalimat BOLEH bila mengalir, mis. "Market cap NVIDIA 7x lebih besar dari AMD." atau "Guidance revenue 2026 naik sekitar 6x."
5) Bila ragu apakah sebuah terjemahan terdengar natural, pakai istilah Inggrisnya saja.
6) Angka memakai format Indonesia (koma desimal: 3,09%). Satuan singkat: jt (juta), M (miliar), T (triliun); rasio ditulis 27x atau 27×.
`;
const SLIDE_COUNT_AUTO="TENTUKAN SENDIRI sesuai kebutuhan materi. Satu gagasan utama per slide; jangan menambah slide hanya demi mencapai angka tertentu dan jangan memadatkan materi penting ke satu slide. Panduan: topik ringkas 5–7 slide, standar 8–12 slide, mendalam/tutorial 13–20 slide. Batas keras 20 untuk Instagram dan 35 untuk TikTok; bila ragu pilih maksimal 20 agar aman di kedua platform. Hero di slide pertama dan CTA di slide terakhir selalu ada.";
// §9 for delivery "link": the model (Claude with code execution, via the
// jadikan-carousel-stock skill) builds the JSON, has /api/check validate it and
// answers with a Studio link instead of a pasted code block.
function linkDeliverySection(origin){
  const host=String(origin||"").replace(/\/$/,"")||"https://stock-analysis-tau-ten.vercel.app";
  const domain=host.replace(/^https?:\/\//,"");
  return `§9 PENGIRIMAN LEWAT LINK (mode Claude; menggantikan cara jawab di §0, semua aturan isi §0–§8 tetap berlaku)
JSON tidak ditampilkan ke pengguna. Kerjakan langkah ini dengan code execution (Python):
1. Tulis teks JSON ke file carousel.json (UTF-8), lalu json.loads untuk memastikan valid. Jangan menyusunnya sebagai dict Python (True/None akan salah).
2. Cek ke server Studio. Server menjalankan validator Render DAN pemeriksa layout "Periksa sekarang" (Instagram + TikTok) di browser sungguhan, jadi butuh ±10–30 detik:
   import json, urllib.request
   data = open("carousel.json", encoding="utf-8").read().encode("utf-8")
   req = urllib.request.Request("${host}/api/check", data=data, headers={"Content-Type": "application/json"})
   res = json.load(urllib.request.urlopen(req, timeout=90))
   Respons: ok (bool), errors (wajib diperbaiki: skema atau teks terpotong/bertabrakan), layoutIssues (slide terlalu kosong atau teks diperkecil), warnings (teks panjang, angka tidak konsisten), layout.status ("ok" atau "skipped" + reason), link.
3. Perbaiki lalu ulangi langkah 2 sampai errors DAN layoutIssues kosong, maksimal 4 putaran:
   - errors skema: ikuti pesannya persis (diawali lokasi "Slide 05: ..." atau "meta: ..."), lihat §3.
   - "terpotong"/"bertabrakan": persingkat teks, kurangi item, atau hapus extras pada slide itu.
   - "baru terisi N%": tambah item data atau satu extras berisi informasi BARU dari materi (lihat ANGGARAN TINGGI SLIDE di §4); bila materi tidak punya lagi, pakai density "bold"/"airy" atau gabungkan dengan slide lain. Jangan mengarang angka.
   - "diperkecil otomatis": persingkat teks slide itu.
   Ubah HANYA slide yang disebut; slide lain biarkan persis sama.
4. Jawab pengguna dengan [Buka di Studio](link) (salin "link" persis dan utuh dari respons terakhir), judul carousel, dan jumlah slide, dalam 1–3 baris. Bila setelah 4 putaran masih ada errors atau layoutIssues, tetap kirim link-nya (selama ada "link") dan sebutkan slide yang masih perlu dicek. Bila layout.status "skipped", sebutkan bahwa layout belum diperiksa server dan Studio akan memeriksanya otomatis saat link dibuka. Jangan menampilkan JSON kecuali diminta.
5. Bila langkah 2 gagal karena jaringan code execution diblokir (URLError, 403, "host not allowed"): buat payload sendiri lalu cek lewat web fetch:
   import zlib, base64
   z = zlib.compressobj(9, zlib.DEFLATED, -15)
   payload = base64.urlsafe_b64encode(z.compress(data) + z.flush()).decode().rstrip("=")
   Web fetch: ${host}/api/check?c=<payload> (respons teks: STATUS OK/GAGAL, MASALAH, LAYOUT, PERINGATAN, LINK STUDIO). Perbaiki seperti langkah 3.
   Bila web fetch juga ditolak: kirim [Buka di Studio](${host}/studio#c=<payload>); Studio memvalidasi dan memeriksa layout otomatis saat dibuka. Sarankan pengguna menambahkan ${domain} ke allowed domains code execution di Settings agar pemeriksaan berjalan otomatis.
6. Bila code execution tidak tersedia sama sekali: kirim JSON dalam satu code block json (sesuai §0) dan minta pengguna menempelkannya ke ${host}/studio.`;
}

// Journey membahas topik umum, jadi panduan bahasanya tidak memuat daftar istilah pasar.
const LANGUAGE_GUIDE_JOURNEY=`BAHASA DAN ISTILAH (WAJIB; hasil harus terdengar seperti orang Indonesia yang menulis caption, bukan terjemahan kaku):
1) Istilah teknis dan frasa yang sudah mapan TETAP dalam bahasa aslinya, jangan diterjemahkan: AI, prompt, tools, mindset, growth mindset, deep work, burnout, deadline, feedback, framework, habit, journaling, self-awareness, personal branding, networking, upskilling, side project, to-do list, dan istilah sejenis di bidang yang dibahas.
2) Kata Indonesia dipakai bila memang lazim sehari-hari: kebiasaan, tujuan, keputusan, fokus, waktu, energi, belajar, kerja, tim, atasan, rekan, hasil, proses.
3) Jangan pakai terjemahan yang tidak natural. Ganti: pola pikir bertumbuh -> growth mindset; umpan balik -> feedback; tenggat waktu -> deadline; kecerdasan buatan -> AI; kelelahan kerja -> burnout; kerangka kerja -> framework.
4) Gaya kalimat: pendek, lisan, aktif, hangat. Hindari kata baku kaku (dikarenakan, merupakan, terkait, terhadap, tersebut, sehubungan dengan) dan hindari terjemahan harfiah dari frasa Inggris. Campur Indonesia-Inggris dalam satu kalimat BOLEH bila mengalir.
5) Bila ragu apakah sebuah terjemahan terdengar natural, pakai istilah aslinya saja.
6) Angka memakai format Indonesia (koma desimal: 3,5 jam). Tanpa klaim angka, riset, atau kutipan tokoh yang tidak diberikan pengguna.
`;

const ACCOUNT_GUIDE={
  trader:"FOKUS: ANALISIS SAHAM. Ubah laporan atau data pengguna menjadi alur yang jelas: gambaran umum -> angka kunci -> sinyal/indikator -> perbandingan -> skenario dan level risiko -> kesimpulan. Gaya editorial tegas berbasis data; angka HANYA dari sumber yang diberikan pengguna, tanpa klaim return pasti, tanpa ajakan membeli/menjual personal. Pilih komponen saham (statSnapshot, signalGrid, priceLevels, returnBars, verdictCard, stockCompare, priceChart, tradePlan, marketRank, eventCalendar) sesuai jenis informasinya, bukan satu pola yang diulang. Cover dan CTA penutup otomatis memakai identitas Aksioma Trader.",
  journey:"AKUN: AKSIOMA JOURNEY. Fokus topik umum: AI, mindset, personal development, berpikir kritis, dan keterampilan hidup maupun kerja. Gaya hangat, reflektif, dan aplikatif. JANGAN memakai komponen saham (stockList, priceChart, stockCompare, tradePlan, marketRank, eventCalendar, statSnapshot, signalGrid, priceLevels, returnBars, verdictCard, compareCards, sparkCards, gauge, rangeBars, heatmap, footballField) kecuali topiknya memang tentang uang atau pasar. Cover dan CTA penutup otomatis memakai identitas gelap/merah hangat serta emas-krem Aksioma Journey; slide isi otomatis mendapat satu dekorasi bila decorations dihilangkan.",
};
// Angka dan teks default per akun; nilai dari pemanggil selalu menang.
const TASK_COPY={
  trader:{subject:"[TULIS TOPIK / LAPORAN SAHAM DI SINI]",kind:"carousel analisis saham"},
  journey:{subject:"[TULIS TOPIK KONTEN DI SINI]",kind:"carousel Aksioma Journey"},
};

export function makeAiPrompt({topic="",audience,objective="Save, share dan follow",slides="auto",account="trader",style="seimbang",preset="bebas",font=DEFAULT_FONT,look=DEFAULT_LOOK,extra="",delivery="paste",origin=""}={}) {
  const viaLink=delivery==="link";
  const id=accountOf(account);
  const journey=id==="journey";
  const copy=TASK_COPY[id];
  const subject=topic.trim()||copy.subject;
  const defaultAudience=ACCOUNTS[id].audience;
  const accountGuide=ACCOUNT_GUIDE[id];
  const fontLine=font&&font!==DEFAULT_FONT&&FONT_PRESETS[font]?`FONT KONTEN: tulis "font":"${font}" di dalam meta (preset ${FONT_PRESETS[font].label}). Jangan membuat font per slide.\n`:"";
  const lookLine=look&&look!==DEFAULT_LOOK&&LOOK_PRESETS[look]?`TAMPILAN: tulis "look":"${look}" di dalam meta (preset ${LOOK_PRESETS[look].label}). ${LOOK_PRESETS[look].text} Jangan membuat look per slide dan jangan menambah dekorasi sendiri; tampilan sudah mengatur latar, kartu, dan warna.\n`:"";
  // Kerangka baku (preset) semuanya untuk konten saham, jadi Journey selalu "bebas".
  const presetId=journey?"bebas":preset;
  const base=journey?exampleJourney:presetExample(presetId);
  const seed={...base,meta:{...base.meta,account:id,...(lookLine?{look}:{})}};
  const presetText=presetPrompt(presetId);
  const count=slides==='auto'||!slides?SLIDE_COUNT_AUTO:slides+" slide (tepat; hero pembuka dan CTA penutup ikut dihitung)";
  const task=[
    "§1 TUGAS",
    viaLink?"Buat "+copy.kind+" lalu kirim sebagai link Studio (lihat §9).":"Buat "+copy.kind+" yang siap ditempel ke /studio.",
    "AKUN: tulis \"account\":\""+id+"\" di dalam meta.",
    "TOPIK / SUMBER: "+subject,
    "AUDIENS: "+((audience||"").trim()||defaultAudience),
    "TUJUAN: "+(objective.trim()||"Save, share dan follow"),
    "JUMLAH SLIDE: "+count,
    accountGuide,
    presetText,
    STYLE_PRESETS[style]?.text||"",
    fontLine.trim(),
    lookLine.trim(),
    extra?"INSTRUKSI TAMBAHAN PENGGUNA (berlaku selama tidak melanggar §0 dan §3):\n"+extra.trim():"",
  ].filter(Boolean).join("\n");
  return [
    "PROMPT AKSIOMA CONTENT STUDIO — JSON v1 ("+ACCOUNTS[id].name+")",
    (viaLink?"Cara membaca: kerjakan §0–§9 berurutan. §9 hanya mengganti CARA MENGIRIM jawaban (link Studio, bukan code block); bentuk dan isi JSON tetap tunduk pada §0.":"Cara membaca: kerjakan §0–§8 berurutan.")+" Bila dua aturan bertentangan, pakai urutan prioritas: §0 FORMAT > §3 KONTRAK FIELD > §4 SKEMA > §5 KAPASITAS > §1 TUGAS > §2 BAHASA > §7 CONTOH. Contoh hanya menunjukkan struktur, tidak pernah mengalahkan §3.",
    OUTPUT_RULES,
    task,
    "§2 "+(journey?LANGUAGE_GUIDE_JOURNEY:LANGUAGE_GUIDE).trim(),
    fieldContractSection(),
    COMPONENT_GUIDE,
    "§5 "+capacityPromptSection(),
    "§6 GAMBAR: jangan membuat properti \"images\" dan jangan mengisi properti image/avatar pada photoHero, phoneMockup, collage, dan avatarQuote (biarkan kosong; pengguna menempatkan foto dari Perpustakaan Gambar di Studio). Slot kosong tampil sebagai blok netral. Tinggalkan ruang yang wajar bila topik membutuhkan foto.",
    "§7 CONTOH JSON VALID (referensi STRUKTUR saja; ganti SELURUH isi sesuai topik, jangan salin teks atau angkanya):\n"+JSON.stringify(seed,null,2),
    FINAL_CHECKLIST,
    ...(viaLink?[linkDeliverySection(origin),"Sekarang susun JSON sesuai §0–§8, lalu kerjakan §9. Jawaban akhir ke pengguna berisi link, bukan JSON."]:["Sekarang kembalikan HANYA satu code block json sesuai §0."]),
  ].join("\n\n");
}

// Contoh JSON untuk tab "Contoh JSON" di Template AI.
export const starterJsonFor=account=>JSON.stringify(accountOf(account)==="journey"?exampleJourney:exampleCarousel,null,2);
export const starterJson=JSON.stringify(exampleCarousel,null,2);
