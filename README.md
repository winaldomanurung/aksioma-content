# Aksioma Content Studio

Aksioma Content Studio adalah project Next.js untuk membuat konten carousel berbasis JSX lalu mengekspor setiap slide menjadi JPEG. Preview browser dan JPEG menggunakan DOM serta komponen yang sama.

## Prinsip utama

- Source of truth: JSX.
- Canvas Instagram: **1080 × 1350 px**.
- Setiap slide menggunakan `CarouselCanvas`.
- Exporter hanya screenshot elemen `[data-carousel-slide]`.
- Hasil JPEG masuk ke `output/` dan tidak disimpan ke Git.

## Setup

```bash
npm install
npm run setup:browser
npm run dev
```

Buka `http://localhost:3000/carousel/demo`.

## Export menjadi JPEG

Biarkan development server tetap berjalan pada terminal pertama:

```bash
npm run dev
```

Di terminal kedua:

```bash
npm run carousel:export -- /carousel/demo
```

Hasil akan dibuat sebagai `output/demo/01.jpg` sampai `10.jpg`.

Quality default adalah 95:

```bash
npm run carousel:export -- /carousel/demo --quality=90
```

Jika server memakai port lain:

```bash
npm run carousel:export -- /carousel/demo --base-url=http://127.0.0.1:3001
```

## Membuat carousel baru

Buat route baru:

```text
app/carousel/nama-konten/page.jsx
```

Contoh minimal:

```jsx
import {
  HeroSlide,
  StatementSlide,
  FrameworkSlide,
  CTASlide,
} from "@/components/carousel";

export default function Page() {
  return (
    <main className="carousel-stage">
      <HeroSlide
        slide={1}
        eyebrow="Mindset"
        title="Judul carousel"
        subtitle="Subjudul singkat yang menjelaskan hook."
      />

      <StatementSlide
        slide={2}
        lead="Kalimat pembuka"
        highlight="bagian yang ingin ditekankan."
        note="Penjelasan pendukung."
      />

      <FrameworkSlide
        slide={3}
        title="Framework sederhana"
        steps={[
          { title: "Langkah satu", text: "Penjelasan." },
          { title: "Langkah dua", text: "Penjelasan." },
        ]}
      />

      <CTASlide
        slide={4}
        title="Penutup."
        body="Ringkas gagasan utama."
      />
    </main>
  );
}
```

Export:

```bash
npm run carousel:export -- /carousel/nama-konten
```

## Komponen awal

Komponen reusable tersedia di `components/carousel/`:

- `HeroSlide` — cover/hook.
- `StatementSlide` — satu gagasan besar dengan highlight.
- `BulletSlide` — daftar penjelasan terstruktur.
- `CompareSlide` — perbandingan dua konsep.
- `CauseEffectSlide` — hubungan sebab dan akibat dengan garis penghubung.
- `FrameworkSlide` — langkah/framework vertikal.
- `SummarySlide` — ringkasan poin.
- `CTASlide` — penutup dan call-to-action.
- `SlideShell` — struktur visual dasar.
- `CarouselCanvas` — canvas wajib 1080 × 1350.

## Mengubah styling

Global styling ada di `app/globals.css`. Styling per tipe slide ada di `components/carousel/`.

Preview dan exporter menggunakan komponen yang sama. Karena itu perubahan pada komponen akan otomatis menjadi perubahan pada JPEG berikutnya.

Ukuran canvas dikunci di `.carousel-slide` pada `app/globals.css`:

```css
width: 1080px;
height: 1350px;
```

Exporter memvalidasi ukuran sebelum screenshot agar slide yang tidak sengaja berubah ukuran tidak ikut diekspor.

## Aturan konten untuk AI

- satu gagasan utama per slide;
- judul idealnya 4–12 kata;
- hindari paragraf sangat panjang;
- maksimal sekitar 3–5 poin pada slide daftar;
- pilih tipe slide berdasarkan fungsi informasi;
- jangan memakai animasi, randomness, atau konten yang bergeser setelah render.

## Struktur

```text
app/
├── carousel/
│   └── demo/
│       └── page.jsx
├── globals.css
├── layout.js
└── page.js

components/
└── carousel/
    ├── BulletSlide.jsx
    ├── CarouselCanvas.jsx
    ├── CauseEffectSlide.jsx
    ├── CompareSlide.jsx
    ├── CTASlide.jsx
    ├── FrameworkSlide.jsx
    ├── HeroSlide.jsx
    ├── SlideShell.jsx
    ├── StatementSlide.jsx
    ├── SummarySlide.jsx
    └── index.js

scripts/
└── export-carousel.mjs

output/ # generated, gitignored
```
