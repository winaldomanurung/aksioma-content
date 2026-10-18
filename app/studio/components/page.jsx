import Link from "next/link";
import {ALL_SPECS,IMAGE_SPEC,SPEC_ORDER,specCapacityLines} from "@/lib/studio/component-specs";

export const metadata={
  title:"Komponen | Aksioma Studio",
  description:"Preview, spesifikasi kapasitas terukur, dan form JSON untuk setiap komponen carousel."
};

function Card({href,title,summary,use,lines}){
  return (
    <Link href={href} className="block rounded-[22px] border border-black/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300">
      <p className="font-display text-base font-bold">{title}</p>
      <p className="mt-1 text-sm leading-6 text-zinc-600">{summary}</p>
      <p className="mt-2 text-xs leading-5 text-zinc-500">Cocok untuk: {use}</p>
      {lines.length?<ul className="mt-3 flex flex-wrap gap-1.5">
        {lines.slice(0,3).map(line=><li key={line.path} className="rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold text-zinc-700">
          {line.path}: {line.chars?"maks "+line.chars.hard+" kar.":"ideal "+line.recommended+" · maks "+line.hard}
        </li>)}
      </ul>:null}
    </Link>
  );
}

function Section({title,names}){
  return (
    <section className="mt-9">
      <h2 className="font-display text-xl font-bold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {names.map(name=>{
          const spec=ALL_SPECS[name];
          return <Card key={name} href={"/studio/components/"+name} title={spec.label} summary={spec.summary} use={spec.use} lines={specCapacityLines(name)}/>;
        })}
      </div>
    </section>
  );
}

export default function ComponentsPage(){
  return (
    <main className="min-h-screen bg-[#ebe8e1] px-4 py-8 text-zinc-900 sm:px-7 lg:py-12">
      <div className="mx-auto max-w-[1300px]">
        <p className="font-display text-sm font-semibold uppercase tracking-[.2em] text-red-600">Aksioma Content Studio</p>
        <h1 className="font-display mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Komponen carousel</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">Pilih satu komponen untuk melihat preview, batas jumlah item dan karakter yang diukur dari layout nyata, cara membuatnya, dan form yang menghasilkan JSON siap tempel ke Carousel Source.</p>
        <Section title="Slide preset" names={SPEC_ORDER.slides}/>
        <Section title="Primitive untuk freeform" names={SPEC_ORDER.primitives}/>
        <section className="mt-9">
          <h2 className="font-display text-xl font-bold">Gambar</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Card href="/studio/components/image" title={IMAGE_SPEC.label} summary={IMAGE_SPEC.summary} use={IMAGE_SPEC.use} lines={[]}/>
          </div>
        </section>
      </div>
    </main>
  );
}
