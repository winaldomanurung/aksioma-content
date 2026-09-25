# Aksioma Content Studio

Aksioma Content Studio adalah project Next.js untuk membuat konten carousel dari satu source JSX lalu mengekspornya untuk Instagram dan TikTok. Preview browser dan JPEG menggunakan DOM serta komponen yang sama.

## Output platform

| Platform | Ukuran | Rasio |
| --- | ---: | ---: |
| Instagram carousel | 1080 × 1350 px | 4:5 |
| TikTok | 1080 × 1920 px | 9:16 |

TikTok memakai composition khusus dengan ruang aman lebih besar di kanan, atas, dan bawah agar headline, body, logo, dan footer tidak terlalu dekat dengan area UI TikTok.

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

TikTok dengan safe-area guide:

```text
http://localhost:3000/carousel/demo?platform=tiktok&safe=1
```

Safe-area guide hanya alat bantu preview. Overlay merah/hijau tersebut tidak muncul pada export normal.

## Export JPEG

Biarkan development server berjalan:

```bash
npm run dev
```

Di terminal kedua, export Instagram:

```bash
npm run carousel:export -- /carousel/demo --platform=instagram
```

Export TikTok:

```bash
npm run carousel:export -- /carousel/demo --platform=tiktok
```

Hasil:

```text
output/
└── demo/
    ├── instagram/
    │   ├── 01.jpg
    │   ├── ...
    │   └── 10.jpg
    └── tiktok/
        ├── 01.jpg
        ├── ...
        └── 10.jpg
```

Quality default adalah 95:

```bash
npm run carousel:export -- /carousel/demo --platform=tiktok --quality=90
```

## Satu konten, dua platform

Materi tidak perlu diduplikasi. Route yang sama dirender berdasarkan query `platform`.

Setiap carousel baru cukup dibuat di:

```text
app/carousel/nama-konten/page.jsx
```

Page menerima `searchParams`, lalu meneruskan platform ke wrapper:

```jsx
export default async function Page({ searchParams }) {
  const params = await searchParams;
  const platform = params?.platform === "tiktok" ? "tiktok" : "instagram";
  const safeArea = platform === "tiktok" && params?.safe === "1";

  return (
    <main
      className="carousel-stage"
      data-platform={platform}
      data-safe-area={safeArea ? "true" : "false"}
    >
      {/* slide yang sama untuk kedua platform */}
    </main>
  );
}
```

## Safe area TikTok

Safe area di project ini bersifat konservatif dan sengaja memberi ruang tambahan untuk UI.

Pada TikTok, `.slide-frame` memakai:

```css
padding: 150px 178px 270px 92px;
```

Artinya elemen penting ditahan dari:
- area atas;
- tombol interaksi di kanan;
- caption/navigation di bawah.

Background, gradient, shape, dan dekorasi boleh tetap full bleed 1080 × 1920.

Gunakan mode `safe=1` untuk memeriksa apakah teks, diagram, footer, dan logo tetap berada di area hijau. Safe area nyata dapat berbeda antar perangkat dan tampilan UI, jadi anggap guide ini sebagai batas kerja konservatif, bukan koordinat resmi yang absolut.

## Branding dan footer

Semua slide menggunakan footer konsisten melalui `SlideFooter`.

- background terang → logo gelap;
- background gelap → logo terang;
- posisi footer mengikuti safe content region masing-masing platform;
- nomor halaman berada pada alignment yang sama.

Font mengikuti Aksioma Trader:
- **Inter** untuk body;
- **Lexend** untuk display/heading.

## Struktur utama

```text
app/
└── carousel/
    └── demo/
        └── page.jsx

components/
└── carousel/
    ├── BrandLogo.jsx
    ├── CarouselCanvas.jsx
    ├── PlatformSwitcher.jsx
    ├── SlideFooter.jsx
    ├── SlideShell.jsx
    ├── HeroSlide.jsx
    ├── StatementSlide.jsx
    ├── BulletSlide.jsx
    ├── CompareSlide.jsx
    ├── CauseEffectSlide.jsx
    ├── FrameworkSlide.jsx
    ├── SummarySlide.jsx
    └── CTASlide.jsx

scripts/
└── export-carousel.mjs

output/
└── <slug>/
    ├── instagram/
    └── tiktok/
```

## Prinsip desain

- JSX adalah source of truth.
- Jangan membuat copy materi terpisah hanya untuk TikTok.
- Background/dekorasi boleh full bleed.
- Informasi penting harus mengikuti safe content region.
- Preview dan JPEG harus berasal dari komponen yang sama.
- Hindari randomness, animasi, dan layout shift pada slide export.
