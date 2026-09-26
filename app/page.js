import Link from "next/link";

export default function Home() {
  const cards = [
    ["01", "Compose", "Susun carousel dari komponen reusable di page.jsx."],
    ["02", "Preview", "Lihat hasil browser pada canvas asli 1080 × 1350."],
    ["03", "Export", "Playwright menyimpan setiap slide menjadi JPEG."],
  ];

  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-red-400">
          Aksioma Content Studio
        </p>
        <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">
          Tulis sekali di JSX. Preview dan export menjadi carousel JPEG.
        </h1>
        <p className="mt-8 max-w-2xl text-xl leading-8 text-zinc-400">
          Canvas utama dikunci pada 1080 × 1350 px. Exporter mengambil DOM yang
          sama dengan preview sehingga komponen, warna, tipografi, garis, dan
          dekorasi tetap konsisten.
        </p>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link
            href="/studio"
            className="rounded-full bg-red-500 px-7 py-4 font-semibold text-white transition hover:bg-red-400"
          >
            Buka Carousel Studio
          </Link>
          <Link
            href="/studio/template"
            className="rounded-full border border-red-500/40 bg-red-500/10 px-7 py-4 font-semibold text-red-200 transition hover:bg-red-500/20"
          >
            Template AI siap copy
          </Link>
          <Link
            href="/carousel/demo"
            className="rounded-full border border-white/15 px-7 py-4 font-semibold text-zinc-200 transition hover:bg-white/10"
          >
            Buka demo 10 slide
          </Link>
          <a
            href="https://github.com/winaldomanurung/aksioma-content"
            className="rounded-full border border-white/15 px-7 py-4 font-semibold text-zinc-200 transition hover:bg-white/10"
          >
            Repository
          </a>
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-3">
          {cards.map(([number, title, copy]) => (
            <div key={number} className="rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <span className="font-mono text-sm text-red-400">{number}</span>
              <h2 className="mt-8 text-2xl font-semibold">{title}</h2>
              <p className="mt-3 leading-7 text-zinc-400">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
