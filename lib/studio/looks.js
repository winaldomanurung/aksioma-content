// Tampilan (look) carousel: lapisan gaya di atas komponen yang sama.
//
// Sebuah look hanya mengubah warna, kartu, bayangan, dan latar lewat atribut
// `data-look` pada slide (ditulis CarouselCanvas). Struktur, data, dan tinggi
// komponen tidak berubah, jadi preview dan export tetap memakai DOM yang sama.
// Aturan CSS-nya ada di app/globals.css (bagian "Looks"). Disimpan di `meta.look`.
//
// Look tidak mengubah ukuran elemen; hanya border, shadow, warna, dan latar.
// Font dipilih terpisah lewat meta.font.

export const DEFAULT_LOOK = "classic";

export const LOOK_PRESETS = {
  classic: {
    label: "Classic",
    hint: "Tampilan default Aksioma: bersih, lapang, kartu tipis.",
    text: "",
  },
  glass: {
    label: "Glass Neon",
    hint: "Modern: latar mesh gradient, kartu kaca semi-transparan, aksen neon. Paling cocok untuk slide gelap dan data.",
    text: "Tampilan Glass Neon dipasang otomatis dari meta.look. Utamakan tema gelap (midnight, navy, graphite, plum, cobalt, teal) untuk slide data; tema terang tetap boleh untuk variasi.",
  },
  brutal: {
    label: "Neo-brutal",
    hint: "Berani: border tebal, shadow keras, warna solid kontras. Mencolok di feed dan mudah dibaca.",
    text: "Tampilan Neo-brutal dipasang otomatis dari meta.look. Utamakan tema terang atau solid (paper, lemon, peach, mint, ice) dan sisakan satu-dua slide gelap untuk kontras.",
  },
  terminal: {
    label: "Terminal",
    hint: "Teknis: grid tipis, sudut kecil, aksen hijau fosfor dan amber. Cocok untuk data dan sinyal; padukan dengan font Teknis bila mau.",
    text: "Tampilan Terminal dipasang otomatis dari meta.look (font tidak berubah). Utamakan tema gelap (graphite, midnight, forest, teal) untuk slide data.",
  },
};

export const LOOK_IDS = Object.keys(LOOK_PRESETS);

export const isLookId = (value) =>
  typeof value === "string" && Object.prototype.hasOwnProperty.call(LOOK_PRESETS, value);

// Nilai tak dikenal jatuh ke default, tidak melempar error.
export const lookOf = (value) => (isLookId(value) ? value : DEFAULT_LOOK);
