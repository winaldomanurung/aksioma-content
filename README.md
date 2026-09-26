# Aksioma Content Studio

Aksioma Content Studio membuat carousel dari satu source JSX lalu mengekspornya menjadi JPEG untuk Instagram dan TikTok.

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

Font mengikuti Aksioma Trader:
- Inter untuk body;
- Lexend untuk heading/display.

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
  contentPillar: "Critical Thinking",
  hook: "Hook utama yang menjadi alasan orang berhenti scroll.",
  instagramCaption: "Caption Instagram...",
  tiktokCaption: "Caption TikTok...",
  cta: "Ajakan tindakan utama.",
  hashtags: ["Aksioma", "CriticalThinking"],
  keywords: ["critical thinking", "logic"],
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
