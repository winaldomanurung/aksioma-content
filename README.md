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
