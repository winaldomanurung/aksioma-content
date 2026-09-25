# Aksioma Content Studio

Aksioma Content Studio membuat carousel dari satu source JSX lalu mengekspornya menjadi JPEG untuk Instagram dan TikTok.

## Ukuran output

- Instagram: **1080 × 1350 px (4:5)**
- TikTok: **1080 × 1920 px (9:16)**

Exporter sekarang memaksa mode platform langsung pada DOM sebelum screenshot dan memvalidasi ukuran setiap slide. Jika TikTok tidak benar-benar 1080×1920, export akan berhenti dengan error.

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
Rendered canvas: 1080x1920
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

Mode TikTok memakai composition 9:16 dengan ruang ekstra di atas, kanan, dan bawah untuk mengurangi risiko headline, body, logo, dan footer tertutup UI TikTok.

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
