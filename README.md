# Aksioma Content

Satu studio carousel untuk dua akun Aksioma:

- **Trader**: finance, saham, dan pasar. Punya komponen saham, kerangka baku (perbandingan, scorecard, swing, broker summary, edukasi istilah), Laporan Pasar, dan Impor Saham.
- **Journey**: topik umum seperti AI dan pengembangan diri. Slide isi mendapat dekorasi otomatis, cover dan penutup memakai identitas Journey.

Ganti akun lewat tombol Trader / Journey di bar atas. Akun sebuah carousel tersimpan di `meta.account`.

Repo ini adalah gabungan `stock-analysis` (basis kode) dan `aksioma-content` lama. Semua fitur keduanya ada di sini; bila ada yang bertabrakan, versi `stock-analysis` yang dipakai. Tiga komponen yang dulu hanya ada di `aksioma-content` (`pollCard`, `collage`, `avatarQuote`) sudah dipindahkan.

Studio membuat carousel dari satu source JSON/JSX lalu mengekspornya menjadi JPEG untuk Instagram dan TikTok.


## Fitur utama

| Halaman | Fungsi |
| --- | --- |
| `/studio` | Paste JSON carousel (atau `page.jsx` dengan blok JSON), pilih akun, font, platform, lalu render, cek kualitas, dan unduh JPEG/ZIP. Semua berjalan di browser. |
| `/studio/template` | Isi topik, salin prompt lengkap ke ChatGPT/Claude, paste JSON hasilnya ke Studio. |
| `/studio/remix` | **Adaptasi konten**: tempel konten orang lain, pilih kemasan baru (mitos vs fakta, FAQ, checklist, Top N, dll.) dan detail tambahan, lalu salin prompt adaptasi. |
| `/studio/stocks` | **Impor saham**: tempel tabel dari Excel/Google Sheets/CSV (Kode, Nama, Sinyal, Entry, Target, Cut loss, Catatan), langsung jadi carousel `stockList` yang dibagi otomatis per slide, lalu buka di Studio. |
| `/studio/report` | **Laporan Pasar** (Aksioma Trader): tempel laporan harian "Market & Foreign Flow" (Top Foreign Buy, Top Local Buy, Top Gainer, Top Loser). Otomatis jadi 7 slide: cover, ringkasan, 4 daftar peringkat, penutup. |
| `/studio/components` | Katalog komponen dan batas kapasitasnya. |
| `/studio/assets` | Ikon, bentuk dekorasi, dan tema latar. |
| `/carousel/demo` | Demo JSX dan kontrak penulisan AI (AI AUTHORING CONTRACT). |

### Alur Studio (JSON v1)

1. Buat konten lewat `/studio/template` atau `/studio/remix`, atau tulis sendiri.
2. Paste JSON (`{"version":1,"meta":{...},"slides":[...]}`) di `/studio`, tekan **Render carousel**.
3. Jalankan **Cek kualitas** (menandai slide yang tidak muat), lalu unduh.

### Editor Carousel source dan daftar masalah

- Editor memakai CodeMirror 6: highlight JSON, nomor baris, lipat/buka blok, cari (Ctrl/Cmd+F), undo.
- Setiap slide diberi **header** (`SLIDE 03 · freeform · judul`) dan pita warna kiri yang berganti merah/biru, jadi batas slide 1, 2, 3 dst. langsung terlihat. Klik header untuk melipat slide itu; tombol **Lipat semua** menampilkan source sebagai daftar slide. Baris **Lompat ke slide** di atas editor membawa kursor dan preview ke slide yang dipilih; memindah kursor di source juga memindah preview.
- Validasi berjalan otomatis saat mengetik (dan saat **Render carousel**). Semua masalah ditampilkan sekaligus, bukan satu per satu: digaris bawah di editor, ditandai di gutter, dihitung di header slide dan chip slide (⚠), dan didaftar di bawah tombol. **Klik masalah** untuk memilih teks yang salah di source dan membuka slide terkait di preview.
- Pesan menyebut nilai yang diizinkan dan nilai sekarang (mis. `density harus salah satu dari "airy", "balanced", "compact", "bold" (sekarang "medium")`, `disclaimerText terlalu panjang (maksimal 90 karakter, sekarang 111)`). JSON rusak ditunjukkan barisnya beserta sebab umum (trailing comma, kutip tunggal/miring, komentar, pembungkus ```json).
- Kode: `lib/studio/source-lint.js` (validasi → lokasi), `scanSource`/`slideOutline` di `lib/studio/source-edit.js`, `components/studio/SourceEditor.jsx`.

### Prompt AI baku

Semua prompt (Template AI, preset Scorecard/Perbandingan/Swing/Broker/Edukasi, Adaptasi) dibuat oleh `makeAiPrompt` dengan bagian bernomor §0–§8 dan urutan prioritas eksplisit (§0 format > §3 kontrak field > §4 skema > §5 kapasitas > tugas/bahasa > contoh). **§3 KONTRAK FIELD dibuat otomatis** oleh `lib/studio/prompt-contract.js` dari konstanta yang sama dengan validator (`SCHEMA_RULES`, `*_LIMITS`, `charLimit`), jadi daftar enum dan batas karakter di prompt tidak bisa berbeda dari yang diterima Studio. Saat menambah field, enum, atau batas baru: ubah konstantanya (bukan teks prompt) dan tambahkan barisnya di `prompt-contract.js` bila field itu baru.

### Dari chat Claude langsung ke Studio (tanpa copy-paste)

Skill Claude `jadikan-carousel-stock` mengubah materi di chat menjadi carousel lalu membalas dengan link `Buka di Studio`.

- `GET /api/prompt?delivery=link[&preset=..&style=..&slides=..&look=..&font=..]` mengembalikan prompt Studio terbaru (dibuat dari konstanta yang sama dengan tombol Salin prompt) ditambah §9 cara mengirim lewat link. `GET /api/prompt?options=1` menampilkan nilai yang tersedia.
- `POST /api/check` (body JSON carousel) menjalankan validator Render, peringatan kapasitas/angka, dan pemeriksa layout "Periksa sekarang" untuk Instagram dan TikTok di headless Chromium (`@sparticuz/chromium` di Vercel, lewat halaman `/studio/layout-check`). Respons: `ok`, `errors` (skema, teks terpotong/bertabrakan), `layoutIssues` (slide kosong/diperkecil), `warnings`, `link`. `?layout=0` melewati cek layout. `GET /api/check?c=<payload>` memberi hasil yang sama dalam teks biasa.
- Link Studio: `/studio#c=<payload>`, dengan `payload = base64url(deflate-raw(JSON))` tanpa `=` (lihat `lib/studio/link-codec.js`). Data ada setelah `#`, jadi tidak terkirim ke server. Studio membuka link, merender, menyimpannya sebagai draft, lalu menjalankan cek layout otomatis.
- Agar Claude bisa memanggil `/api/check` dari code execution, tambahkan domain deployment ke allowed domains code execution di Settings Claude. Tanpa itu skill memakai web fetch, lalu link langsung sebagai cadangan.

### Font lokal dan pilihan font

Font dimuat lokal lewat `next/font/local` (`app/fonts.js`, berkas di `app/fonts/*.woff2`), tanpa permintaan ke Google Fonts sehingga build dan export berjalan offline. Lisensi (SIL OFL) ada di `app/fonts/LICENSES.md`, yang juga menjelaskan cara menambah font.

Preset font konten ada di `lib/studio/fonts.js`, dipilih di Studio dan disimpan di `meta.font` (atau `font` per slide):

| id | Nama | Heading / body |
| --- | --- | --- |
| `aksioma` (default) | Aksioma | Lexend / Inter |
| `jakarta` | Modern | Plus Jakarta Sans |
| `editorial` | Editorial | Playfair Display / Inter |
| `grotesk` | Teknis | Space Grotesk / Inter |

Logo cover/CTA tetap memakai font Aksioma. Font yang lebih lebar bisa memotong slide padat, jadi jalankan **Cek kualitas** setelah mengganti font.

## Brand Kit, disclaimer, sumber otomatis, dan Cek angka

- **Brand Kit** (`/studio/brand`, menu Pustaka): handle, situs, disclaimer, hashtag tetap, serta tampilan dan font bawaan. Disimpan di `localStorage` browser ini (`aksioma-brand-kit-v1`), bukan di JSON carousel, jadi JSON tetap portabel. Ekspor/impor JSON untuk pindah perangkat. Logo cover/CTA tetap logo Aksioma.
- Cover dan CTA memakai handle dan situs dari kit. Slide CTA akhir menampilkan disclaimer (bisa dimatikan di kit).
- `meta.look` dan `meta.font` pada carousel menang atas bawaan kit; bila tidak ada, kit yang berlaku.
- **Caption** (tombol Salin caption, panel Bagikan, dan `captions.txt` di ZIP) otomatis memuat: isi caption, disclaimer (bila caption belum memuat kalimat sejenis), `Sumber:` dari `sources` semua slide (nama penyedia sebelum koma, tanpa duplikat), lalu hashtag carousel + hashtag kit tanpa duplikat. Tiap bagian bisa dimatikan di kit.
- **Cek angka** (panel Periksa layout, otomatis): angka di `meta.hook`/`meta.title` yang tidak muncul di slide, label yang sama dengan nilai berbeda antarslide, `tone` yang berlawanan dengan tanda angka, urutan `priceLevels` dan posisi stop/target terhadap entry, rentang terbalik, serta "X dari N" di judul yang tidak cocok dengan `signalGrid`. Tidak memeriksa kebenaran data terhadap sumber.

## Tampilan (look)

Gaya visual alternatif untuk komponen yang sama. Didefinisikan di `lib/studio/looks.js`, dipilih di Studio (panel "Pilih tampilan konten") atau Template AI, dan disimpan di `meta.look`. `CarouselCanvas` menulisnya sebagai `data-look`, jadi preview dan export memakai DOM dan CSS yang sama.

| id | Nama | Ciri |
| --- | --- | --- |
| `classic` (default) | Classic | Tampilan Aksioma saat ini |
| `glass` | Glass Neon | Latar mesh gradient, kartu kaca semi-transparan, aksen neon (cocok untuk tema gelap) |
| `brutal` | Neo-brutal | Warna solid + pola titik, border tegas, shadow keras (cocok untuk tema terang) |
| `terminal` | Terminal | Grid tipis, sudut kecil, aksen hijau fosfor dan amber, cocok untuk data dan sinyal; padukan dengan font Teknis bila mau |

Aturan menambah look baru: hanya ubah warna, latar, `border-color`, `box-shadow`, dan radius di blok "Looks" `app/globals.css`. Jangan ubah width/height/padding/font-size/border-width, karena anggaran tinggi komponen dihitung dari ukuran classic. Setelah mengubah CSS look, ekspor contoh preset dan pastikan preflight tetap bersih.

### Stock List (daftar saham)

Komponen `stockList` menampilkan 1–8 saham sesuai input: ticker, nama, sinyal (`buy`/`accumulate`/`hold`/`watch`/`sell` atau `action` sendiri), `entry`, `target`, `stop`, dan `note`. Tampilan menyesuaikan jumlah: 1–3 kartu besar (catatan ≤90 karakter), 4–5 kartu sedang (catatan ≤56), 6–8 baris ringkas tanpa catatan. Disclaimer tampil secara default. Gunakan hanya data dari sumber atau analisis sendiri.

```json
{"type":"freeform","nodes":[
  {"type":"slideHeading","title":"Saham pilihan minggu ini"},
  {"type":"stockList","items":[{"ticker":"ABCD","name":"Contoh Bank Tbk","signal":"accumulate","entry":"1.000","target":"1.250","stop":"950"}]}
]}
```

### Komponen pasar

Semua berukuran tetap sehingga muat satu slide di bawah `slideHeading`, dan hanya memakai data dari input (tidak ada data pasar otomatis).

| Komponen | Isi |
| --- | --- |
| `priceChart` | Grafik garis (`points`) atau candlestick (`candles: [{o,h,l,c}]`), 5–60 data, plus maks 4 garis level (`entry`, `target`, `stop`, `support`, `resistance`). |
| `stockCompare` | Dua saham berdampingan, 1–6 baris metrik, penanda sisi yang lebih unggul (`better`). |
| `tradePlan` | 1–3 skenario `bull`/`base`/`bear` dengan pemicu, target, catatan, dan satu baris risiko. |
| `marketRank` | 1–6 baris peringkat (kode, bar proporsional, nilai, perubahan %), nada warna `up`/`down`/`neutral`. Dipakai oleh Laporan Pasar. |
| `eventCalendar` | 1–6 agenda dengan tanggal, judul, label, dan catatan. |
| `statSnapshot` | 1–6 metrik kunci (yield, expense ratio, AUM, PER) dengan angka besar, keterangan, dan warna `up`/`down`. 1–4 kartu tampil lebih tinggi. |
| `signalGrid` | 1–6 bacaan indikator dengan lencana arah `up`/`down`/`flat`, nama, dan bacaan singkat. |
| `priceLevels` | 2–6 level harga (`entry`, `target`, `stop`, `support`, `resistance`) dari tertinggi ke terendah; satu item bisa `current: true`. |
| `returnBars` | 1–3 kelompok batang horizontal (maks 4 per kelompok, 10 total) dengan nilai bertanda; negatif otomatis merah. |
| `compareCards` | Dua kartu kontras setinggi isinya (label, angka besar, 1–3 poin, lencana tengah `delta`). Tidak melebar; pasangkan dengan `signalGrid`/`statSnapshot`/callout di bawahnya. |
| `sparkCards` | Kartu metrik dengan angka besar dan garis tren kecil (`points` 4–30 angka nyata; warna mengikuti arah garis). 1–6 kartu. |
| `gauge` | Cincin skor/persentase 0–100 dengan teks tengah, label, dan catatan. 1–4 gauge. |
| `rangeBars` | Posisi nilai sekarang di antara low dan high (rentang 52 minggu, harian). 1–5 baris; `low < current ≤ high`. |
| `heatmap` | Kotak berwarna menurut persentase perubahan (sektor atau saham). 4–12 kotak. |
| `footballField` | Rentang nilai wajar per metode pada satu sumbu dengan garis harga sekarang. 2–5 metode; asal tiap rentang wajib ada di `sources`. |
| `verdictCard` | Kesimpulan: sinyal (`buy`/`accumulate`/`hold`/`watch`/`sell`), judul, penjelasan, maks 3 alasan, satu peringatan. |

**Ukuran adaptif.** Tinggi baris komponen di atas menyesuaikan jumlah item dan ada tidaknya blok pendamping (callout, textBlock, extras, sumber), jadi 3 baris pun mengisi slide. Aturan praktis: sendirian isi minimal 3 item (`statSnapshot` minimal 4, `returnBars` minimal 4 batang); berpasangan dengan satu callout/textBlock pakai maksimal 4 item (`returnBars` maksimal 6 batang). Pemeriksa kualitas memberi peringatan bila aturan ini dilanggar.

Batas karakter lengkap ada di `lib/studio/market.js` dan `lib/studio/stock.js`; kontrak untuk AI ada di `app/carousel/demo/page.jsx`.

### Format Laporan Pasar

```text
Market Report akhir sesi

IHSG mengalami kenaikan 5.65% yang dimotori oleh pembelian investor lokal sebesar 2.13 Triliun Rupiah.

Berikut report penutupan sesi kedua:

Top Foreign Buy
TLKM, 255M
Top Gainer
TRUK, 25%
```

Judul diawali `Market ... Report`; laporan tidak perlu memuat tanggal. Tanggal otomatis diisi hari ini (WIB) dan bisa diubah lewat kolom "Tanggal laporan" di halaman. Judul lama dengan `| 16 Oct 2026` tetap terbaca (tanggal dari judul dipakai bila tanggal tidak diubah manual). Keterangan sumber di judul (`by www...`) dibuang otomatis dan tidak muncul di carousel. Nama sesi diambil dari kalimat "Berikut report ...". Setiap bagian `Top ...` berisi baris `KODE, nilai / persen` atau `KODE, persen` (maks 6 baris per daftar). Angka ditampilkan persis seperti data (format Indonesia: `1.234,5`). Nilai negatif pada Local Buy ditampilkan apa adanya dengan peringatan. Logika ada di `lib/studio/market-report.js`.

### Preset template

Di `/studio/remix` tersedia preset bawaan (Top 5 saham mingguan, Mitos vs fakta, Edukasi pemula, Checklist trading). Pengaturan saat ini bisa disimpan sebagai preset sendiri; preset tersimpan di localStorage browser dan tidak ikut ke repo.

### Skrip

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run lint` | ESLint |
| `npm run carousel:export -- /carousel/demo --platform=all` | Export JPEG lewat Playwright |
| `npm run measure:capacity` | Ukur ulang kapasitas komponen (menghasilkan `lib/studio/capacity-data.js`, jangan diedit manual) |
| `npm run setup:browser` | Pasang Chromium untuk Playwright |

Jalankan `measure:capacity` setelah mengubah CSS komponen yang memengaruhi tinggi slide. `stockList` tidak termasuk karena tinggi barisnya tetap.

## Ukuran output

- Instagram: **1080 × 1350 px (4:5)**
- TikTok Photo Carousel: **1080 × 1350 px (4:5)**

Exporter sekarang memaksa mode platform langsung pada DOM sebelum screenshot dan memvalidasi ukuran setiap slide. Jika canvas tidak sesuai 1080×1350, export akan berhenti dengan error.

## Setup awal

```bash
npm install
npm run setup:browser
npm run dev
```

## Preview

Instagram:

```text
http://localhost:3000/carousel/demo?platform=instagram
```

TikTok:

```text
http://localhost:3000/carousel/demo?platform=tiktok
```

TikTok safe-area preview:

```text
http://localhost:3000/carousel/demo?platform=tiktok&safe=1
```

## Export

Dengan development server tetap berjalan:

Instagram:

```bash
npm run carousel:export -- /carousel/demo --platform=instagram
```

TikTok:

```bash
npm run carousel:export -- /carousel/demo --platform=tiktok
```

Keduanya sekaligus:

```bash
npm run carousel:export -- /carousel/demo --platform=all
```

Atau gunakan shortcut:

```bash
npm run carousel:export:instagram -- /carousel/demo
npm run carousel:export:tiktok -- /carousel/demo
npm run carousel:export:all -- /carousel/demo
```

Saat export, terminal akan menampilkan ukuran aktual, misalnya:

```text
Requested platform: instagram
Rendered canvas: 1080x1350

Requested platform: tiktok
Rendered canvas: 1080x1350
```

Hasil:

```text
output/
└── demo/
    ├── instagram/
    │   ├── 01.jpg
    │   └── ...
    └── tiktok/
        ├── 01.jpg
        └── ...
```

## Safe area TikTok

Mode TikTok Photo menggunakan canvas 4:5 dengan margin konten lebih konservatif agar informasi penting tidak dekat dengan batas gambar.

Safe-area overlay hanya tampil saat URL memakai `safe=1`; overlay tersebut tidak ikut diekspor.

## Source of truth

Konten tetap satu. Jangan membuat versi copy terpisah untuk Instagram dan TikTok. Platform hanya mengubah canvas dan composition.

Font bawaan mengikuti Aksioma Trader (Inter untuk body, Lexend untuk heading/display) dan dapat diganti per konten, lihat "Font lokal dan pilihan font".

Branding dan footer memakai komponen bersama agar alignment konsisten.


## Catatan PowerShell / npm

Pada sebagian setup Windows, npm dapat menyerap `--platform=...` sebagai npm config sehingga flag tidak terlihat pada baris `node ...`. Exporter sudah menangani kasus ini melalui `npm_config_platform`.

Command berikut tetap didukung:

```powershell
npm run carousel:export -- /carousel/demo --platform=TikTok
```

Platform bersifat case-insensitive, jadi `TikTok`, `tiktok`, dan `TIKTOK` sama.

Jika ingin menghindari parsing flag npm sepenuhnya, gunakan bentuk positional:

```powershell
npm run carousel:export -- /carousel/demo tiktok
```

Atau shortcut yang paling sederhana:

```powershell
npm run carousel:export:tiktok -- /carousel/demo
npm run carousel:export:instagram -- /carousel/demo
npm run carousel:export:all -- /carousel/demo
```


## Publishing brief sebelum slide 01

Setiap carousel sebaiknya memiliki satu object metadata publikasi pada `page.jsx`. Metadata ini ditampilkan melalui `PostMetaPanel` sebelum preview slide pertama dan **tidak ikut diekspor ke JPEG**.

Contoh:

```jsx
const postMeta = {
  title: "Judul internal konten",
  objective: "Save + share",
  contentPillar: "Analisis Saham",
  hook: "Hook utama yang menjadi alasan orang berhenti scroll.",
  instagramCaption: "Caption Instagram...",
  tiktokCaption: "Caption TikTok...",
  cta: "Ajakan tindakan utama.",
  hashtags: ["Saham", "AnalisisSaham"],
  keywords: ["saham", "teknikal"],
  notes: "Catatan posting atau eksperimen yang ingin diuji.",
};

<PostMetaPanel {...postMeta} />
```

Field yang disarankan:
- **title** — nama kerja konten agar mudah dicari di repo;
- **objective** — tujuan post, misalnya save, share, comment, follower, atau conversion;
- **contentPillar** — kategori/pilar konten;
- **hook** — angle utama;
- **instagramCaption** — copy publikasi Instagram;
- **tiktokCaption** — copy publikasi TikTok;
- **cta** — tindakan yang diharapkan;
- **hashtags** — hashtag publikasi;
- **keywords** — kata kunci topik untuk membantu konsistensi copy dan discovery;
- **notes** — catatan eksperimen, timing, atau hal yang perlu diperiksa sebelum posting.

Dengan pola ini, satu `page.jsx` menjadi paket lengkap: **publishing brief + source carousel + output Instagram/TikTok**.


## AI-native authoring workflow

`app/carousel/demo/page.jsx` sekarang berfungsi sebagai **portable specification**. File tersebut memiliki blok `AKSIOMA CAROUSEL — AI AUTHORING CONTRACT` yang menjelaskan:

- output yang harus dibuat AI;
- seluruh preset slide;
- seluruh primitive yang boleh dipakai;
- props utama;
- mapping jenis informasi ke visual;
- density modes;
- aturan anti-template;
- aturan Instagram/TikTok;
- struktur publishing metadata.

Workflow yang dituju:

```text
1. Copy seluruh app/carousel/demo/page.jsx
2. Paste ke AI
3. Tambahkan instruksi/topik baru
4. AI mengembalikan satu page.jsx lengkap
5. Replace page lokal
6. Preview Instagram/TikTok
7. Export JPEG
```

### Preset versus Freeform

Preset tersedia untuk struktur umum:

- HeroSlide
- StatementSlide
- BulletSlide
- CompareSlide
- CauseEffectSlide
- FrameworkSlide
- SummarySlide
- CTASlide

Untuk menghindari hasil yang terlalu template, gunakan `FreeformSlide` dengan primitive:

- SlideHeading
- InfoCard
- StatCard
- BigNumber
- QuoteCard
- DiagramNode
- Connector
- Timeline
- Checklist
- Callout
- Pill
- KeywordCluster
- MiniDiagram
- BackgroundWord
- AccentLine
- CornerLabel
- TwoColumn
- ThreeColumn
- ContentGrid
- Stack
- Divider

Pada TikTok Photo 4:5, primitive kolom tetap bisa digunakan; periksa kepadatan dan safe area pada preview sebelum export.

### Prinsip pemilihan layout

AI harus memilih komponen berdasarkan struktur informasi, bukan sekadar bergiliran memakai template.

Contoh:

```text
single provocative idea  -> StatementSlide
contrast                 -> CompareSlide
cause/effect             -> CauseEffectSlide
ordered method           -> FrameworkSlide / Timeline
number/statistic         -> FreeformSlide + BigNumber/StatCard
conceptual mechanism     -> FreeformSlide + DiagramNode/Connector
practical actions        -> FreeformSlide + Checklist/Callout
mixed editorial layout   -> FreeformSlide
```

Demo slide 08 sengaja menggunakan `FreeformSlide` sebagai contoh composition custom.


## TikTok Photo Carousel: keputusan format

Berdasarkan referensi post yang sudah terbukti tampil aman pada workflow TikTok pengguna, mode `tiktok` memakai **1080×1350 (4:5)**, bukan 1080×1920.

Ini sengaja dibedakan dari format full-screen video 9:16. Untuk project ini, `--platform=tiktok` berarti **TikTok Photo Carousel**.

Safe-area preview memakai margin konservatif pada canvas 4:5:
- left: 70px
- right: 70px
- top: 48px
- bottom: 70px
- plus internal buffer 20px

Background/dekorasi boleh full bleed. Teks, card, logo, footer, page number, dan informasi utama harus tetap berada di dalam content frame.


### Template page.jsx yang kompatibel dengan Studio

Buka `app/carousel/studio-template/page.jsx` di GitHub. Ini adalah contoh **page.jsx valid** yang menyimpan definisi carousel di template literal dengan marker `AKSIOMA_STUDIO_JSON_START/END`. Kamu bisa copy seluruh file itu ke AI untuk meminta versi baru, lalu paste seluruh hasilnya ke `/studio`. Studio hanya mengambil bagian JSON di antara marker; kode JSX tidak dieksekusi. File itu juga dapat ditempatkan di repo sebagai route biasa jika memang ingin meng-commit hasilnya.

Versi `app/carousel/demo/page.jsx` menggunakan JSX langsung dan **tidak** dapat ditempel mentah ke Studio. Untuk input Studio, pilih format declarative dari `studio-template/page.jsx`.


## Template AI dan ekspor langsung dari HP

Halaman `/studio/template` menyediakan form topik, audiens, tujuan, dan jumlah slide.
Tombol **Copy prompt lengkap** menyalin sekaligus brief, dokumentasi komponen
(termasuk freeform primitives), aturan desain, dan contoh JSON. Pengguna tidak
perlu membuka GitHub atau menyalin source `page.jsx` untuk membuat konten baru.

Alur: `/studio/template` → salin prompt → ChatGPT → salin JSON hasilnya →
`/studio` → paste → Render carousel → pilih platform → Generate JPEG/ZIP.

Tombol Generate sekarang mempersiapkan file di browser, lalu memunculkan
**Simpan file** sebagai anchor asli yang harus diketuk. Ini mengurangi kegagalan
unduhan akibat pemblokiran klik otomatis setelah proses asynchronous. Di iOS,
opsi 'Buka gambar' membantu menyimpan JPEG melalui UI browser.

Clipboard punya fallback berbasis seleksi teks bila Clipboard API ditolak.
Browser tetap dapat melarang clipboard sepenuhnya, sehingga tersedia tombol
**Pilih semua teks** untuk salin manual.

Ekspor menggunakan SVG foreignObject → Canvas di browser. Tidak semua
browser/versi iOS mendukung semua fitur SVG, font, dan CSS. Gunakan
exporter Playwright lokal bila hasil masih gagal atau tidak setara preview.


## Local Asset Library (icons and decorative SVG)

Buka `/studio/assets`. Katalog ini berisi 8 ikon Lucide, 8 ikon Phosphor
duotone, dan 4 SVG dekoratif orisinal Aksioma. Tombol **Copy JSON**
menghasilkan primitive `assetIcon` atau `assetShape` yang bisa dimasukkan
ke dalam `freeform.nodes`. Asset yang tidak ada di registry ditolak
validator, sehingga input tidak dapat memuat URL gambar sembarangan.

Contoh:
```json
{"type":"assetIcon","set":"phosphor","name":"brain","size":"lg","tone":"accent"}
```

```json
{"type":"assetShape","name":"orbital-rings","position":"topRight","opacity":"subtle"}
```

`/studio/template` sekarang mencantumkan seluruh daftar asset yang bisa
dipilih AI. SVG berasal dari folder `public/assets`, bukan CDN. Lisensi
ikon Lucide (ISC) dan Phosphor (MIT) disimpan di
`public/assets/licenses`. Bentuk dekoratif dibuat khusus untuk Aksioma,
terinspirasi estetika SVG generatif; bukan ekspor resmi Haikei.

**Perhatian:** Browser JPEG exporter belum dijamin identik dengan
Playwright pada semua browser. Cek hasil JPEG setelah render ikon dan
dekorasi, terutama di Safari. Semua gambar disimpan sebagai SVG lokal,
namun hasil akhir tetap bergantung pada kemampuan browser mengekspor
`foreignObject`.

## Asset Library expanded + contrast-safe themes + site navigation

/studio/assets provides 48 locally bundled icons (24 Lucide, 24 Phosphor),
14 original decorative shapes, and 18 contrast-paired themes.
Every asset card explains its semantic use and provides copyable JSON.
Background themes are restricted to freeform and automatically select
light or dark foreground/card styles; legacy presets remain unchanged.

The persistent top menu links Home, Studio, Template Bebas, Perbandingan Saham, Scorecard Saham, Asset Library,
and Demo JSX. It is outside the slide canvas, so JPEG excludes the menu.

Download first attempts locally bundled dom-to-image. If that fails,
the existing SVG/Canvas exporter runs as fallback. Both error messages
are reported if neither succeeds. Upstream MIT license is stored at
public/vendor/dom-to-image-LICENSE.txt.

Browser support varies, especially Safari foreignObject. A successful
Vercel build alone cannot verify JPEG export on every device.
Use Playwright export locally if both browser methods fail.

## Preset jenis konten

Tiap jenis konten punya halaman sendiri di menu bar, sehingga tidak perlu memilih jenis dan tidak bisa salah pilih:

| Menu | Rute | Isi |
| --- | --- | --- |
| Template Bebas | `/studio/template` | AI memilih struktur sendiri sesuai topik |
| Perbandingan Saham | `/studio/compare` | Preset 2 saham: isi dua kode saham, kerangka baku |
| Scorecard Saham | `/studio/scorecard` | Preset 1 saham: isi satu kode saham, kerangka baku |
| Contoh Hasil | `/studio/demo` | Galeri hasil jadi tiap preset (ganti tampilan, perbesar slide, buka di Studio) |
| Swing Trade Plan | `/studio/swing` | Preset 1 saham: tren, level kunci, skenario, hitungan risiko, syarat entry |
| Broker Summary | `/studio/broker` | Preset 1 saham: top beli, top jual, bacaan akumulasi/distribusi (tempel data broker di catatan) |
| Edukasi Istilah | `/studio/edukasi` | Preset satu istilah: definisi, contoh hitungan, cara kerja, mitos dan fakta |
| Laporan Pasar | `/studio/report` | Ringkasan pasar harian (top gainer, loser, foreign flow) tanpa AI |

Preset mengunci kerangka (urutan slide, komponen, jumlah item, anggaran tinggi) sehingga AI hanya mengisi data dan interpretasi. Definisi dan rute halaman ada di `lib/studio/presets.js` (`CONTENT_PRESETS`, `PRESET_PAGES`); setiap preset punya contoh emas yang lolos pemeriksa layout (`example-nvda-amd.js`, `example.js`). Preset adalah jalan pintas, bukan template wajib.
