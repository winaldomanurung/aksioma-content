"use client";
import Link from "next/link";
import {ACCOUNTS} from "@/lib/studio/accounts";
import {useAccount} from "@/lib/studio/account-store";
import {navFor} from "./SiteNav";
import Icon from "./Icon";

// Beranda adalah titik berangkat kerja, bukan halaman promosi: satu aksi utama
// (Studio) dan daftar cara membuat konten untuk akun yang sedang aktif.
const LEAD={
  trader:"Dari data, laporan, atau artikel pasar menjadi carousel 1080 × 1350 siap posting. Komponen saham, kerangka baku, dan pemeriksaan angka sudah tersedia.",
  journey:"Dari topik, catatan, atau artikel menjadi carousel 1080 × 1350 siap posting: AI, pengembangan diri, dan topik umum lainnya.",
};

function Row({item}){
  return (
    <li>
      <Link href={item.href} className="group flex min-h-14 items-center justify-between gap-4 border-b border-black/10 py-3 hover:border-zinc-900">
        <span className="min-w-0">
          <span className="block text-base font-semibold text-zinc-900">{item.label}</span>
          {item.hint?<span className="block text-sm text-zinc-600">{item.hint}</span>:null}
        </span>
        <Icon name="arrow-right" className="text-zinc-400 transition-transform duration-150 group-hover:translate-x-1 group-hover:text-zinc-900"/>
      </Link>
    </li>
  );
}

export default function HomeClient(){
  const account=useAccount();
  const groups=navFor(account).filter(item=>item.children);
  return (
    <main className="min-h-screen bg-[#ebe8e1] px-4 py-8 text-zinc-900 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-display max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">Studio carousel {ACCOUNTS[account].name}</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg sm:leading-8">{LEAD[account]}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/studio" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-zinc-950 px-6 text-base font-semibold text-white hover:bg-zinc-800">Buka Studio<Icon name="arrow-right"/></Link>
          <Link href="/studio/template" className="inline-flex min-h-12 items-center rounded-full border border-black/20 bg-white px-6 text-base font-semibold hover:bg-zinc-50">Mulai dari Template AI</Link>
        </div>
        <p className="mt-4 text-sm text-zinc-600">Akun aktif: <strong className="text-zinc-900">{ACCOUNTS[account].label}</strong> ({ACCOUNTS[account].summary}). Ganti lewat tombol Trader / Journey di bar atas.</p>

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {groups.map(group=>(
            <section key={group.key} aria-labelledby={"home-"+group.key}>
              <h2 id={"home-"+group.key} className="font-display text-lg font-bold">{group.label}</h2>
              <ul className="mt-2">{group.children.map(item=><Row key={item.href} item={item}/>)}</ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
