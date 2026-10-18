import Link from "next/link";
import {notFound} from "next/navigation";
import {ALL_SPECS,IMAGE_SPEC,specCapacityLines} from "@/lib/studio/component-specs";
import ComponentBuilder from "@/components/studio/builder/ComponentBuilder";
import ImageBuilder from "@/components/studio/builder/ImageBuilder";

export const dynamicParams=false;
export function generateStaticParams(){
  return [...Object.keys(ALL_SPECS),"image"].map(type=>({type}));
}
export async function generateMetadata({params}){
  const {type}=await params;
  const spec=type==="image"?IMAGE_SPEC:ALL_SPECS[type];
  return {title:(spec?spec.label:"Komponen")+" | Aksioma Studio"};
}

function Capacity({name}){
  const lines=specCapacityLines(name);
  if(!lines.length)return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-black/10 bg-white">
      <table className="w-full text-left text-xs">
        <caption className="sr-only">Kapasitas terukur</caption>
        <thead className="bg-zinc-50 text-zinc-500"><tr><th className="p-3">Properti</th><th className="p-3">Ideal</th><th className="p-3">Maks</th><th className="p-3">Teks panjang</th></tr></thead>
        <tbody>
          {lines.map(line=>(
            <tr key={line.path} className="border-t border-black/5">
              <td className="p-3 font-mono">{line.path}</td>
              {line.chars
                ? <><td className="p-3">{line.chars.recommended} karakter</td><td className="p-3">{line.chars.hard} karakter</td><td className="p-3">-</td></>
                : <><td className="p-3">{line.recommended} item</td><td className="p-3">{line.hard} item</td><td className="p-3">{line.long} item</td></>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default async function ComponentPage({params}){
  const {type}=await params;
  const isImage=type==="image";
  const spec=isImage?IMAGE_SPEC:ALL_SPECS[type];
  if(!spec)notFound();
  const slideKind=!isImage&&spec.kind==="slide";
  return (
    <main className="min-h-screen bg-[#ebe8e1] px-4 py-8 text-zinc-900 sm:px-7 lg:py-12">
      <div className="mx-auto max-w-[1400px]">
        <Link href="/studio/components" className="text-xs font-semibold text-red-700 hover:underline">← Semua komponen</Link>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{spec.label}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{spec.summary} <span className="text-zinc-500">Cocok untuk: {spec.use}</span></p>

        <section className="mt-6 grid gap-4 lg:grid-cols-2" aria-label="Cara membuat">
          <div className="rounded-2xl border border-black/10 bg-white p-4">
            <h2 className="font-display text-sm font-bold">Cara membuat</h2>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-zinc-700">
              {isImage?<>
                <li>Klik <b>Upload gambar</b>, pilih foto (JPG/PNG/WebP/GIF, maks 12 MB).</li>
                <li>Seret gambar di preview untuk memindah. Tarik titik sudut untuk resize (tahan Shift untuk bebas rasio).</li>
                <li>Pilih bentuk: Kotak, Rounded corner, atau Lingkaran.</li>
                <li>Salin JSON dan tempel ke slide di Carousel Source, lalu Render di browser yang sama.</li>
              </>:<>
                <li>Isi form di sebelah kiri; perhatikan lencana jumlah item (hijau = nyaman, kuning = padat, merah = melewati batas).</li>
                <li>Periksa preview Instagram dan TikTok. Peringatan kuning berarti isi diperkirakan terlalu padat.</li>
                <li>Salin JSON dari tab yang sesuai.</li>
                <li>{slideKind?"Tempel sebagai item baru di array \"slides\", atau ganti seluruh Carousel Source dengan tab \"Carousel 1 slide\".":"Tempel sebagai item di array \"nodes\" pada slide bertipe freeform, atau pakai tab \"Slide freeform\"."}</li>
              </>}
            </ol>
            {spec.notes?.length?<ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-zinc-500">{spec.notes.map((n,i)=><li key={i}>{n}</li>)}</ul>:null}
          </div>
          <div>
            {isImage?<div className="rounded-2xl border border-black/10 bg-white p-4 text-sm leading-6 text-zinc-700">
              <h2 className="font-display text-sm font-bold">Properti JSON</h2>
              <p className="mt-2 font-mono text-xs">images[]: id, x, y, width, height, shape (square | rounded | circle), fit? (cover | contain), alt?</p>
              <p className="mt-2 text-xs text-zinc-500">Maksimal 6 gambar per slide. Posisi dalam piksel kanvas 1080×1350. Lingkaran selalu dibuat bulat (lebar = tinggi).</p>
            </div>:<Capacity name={type}/>}
          </div>
        </section>

        <div className="mt-6">{isImage?<ImageBuilder/>:<ComponentBuilder name={type}/>}</div>
      </div>
    </main>
  );
}
