"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {ACCOUNTS,ACCOUNT_IDS} from "@/lib/studio/accounts";
import {useAccount,setAccount} from "@/lib/studio/account-store";
import Icon from "./Icon";

// Menu dikelompokkan supaya bar tidak melebar: dua tautan langsung dan dua grup
// dengan submenu. Di layar kecil semua grup tampil terbuka di dalam satu panel.
// `only` menandai halaman khusus satu akun; halaman tanpa `only` tampil di keduanya.
const items=[
  {href:"/",label:"Beranda"},
  {href:"/studio",label:"Studio"},
  {key:"buat",label:"Buat Konten",children:[
    {href:"/studio/template",label:"Template Bebas",hint:"AI memilih struktur sendiri"},
    {href:"/studio/remix",label:"Adaptasi Konten",hint:"Kemas ulang konten orang lain"},
    {href:"/studio/compare",label:"Perbandingan Saham",hint:"Dua saham, kerangka baku",only:"trader"},
    {href:"/studio/scorecard",label:"Scorecard Saham",hint:"Satu saham, rapor lengkap",only:"trader"},
    {href:"/studio/swing",label:"Swing Trade Plan",hint:"Level, skenario, hitungan risiko",only:"trader"},
    {href:"/studio/broker",label:"Broker Summary",hint:"Top beli, top jual, bacaan",only:"trader"},
    {href:"/studio/edukasi",label:"Edukasi Istilah",hint:"Satu istilah pasar, dijelaskan jelas",only:"trader"},
    {href:"/studio/report",label:"Laporan Pasar",hint:"Ringkasan harian tanpa AI",only:"trader"},
    {href:"/studio/stocks",label:"Impor Saham",hint:"Dari spreadsheet ke carousel",only:"trader"},
  ]},
  {key:"pustaka",label:"Pustaka",children:[
    {href:"/studio/demo",label:"Contoh Hasil",hint:"Hasil jadi tiap jenis konten",only:"trader"},
    {href:"/studio/components",label:"Komponen",hint:"Katalog komponen carousel"},
    {href:"/studio/brand",label:"Brand Kit",hint:"Handle, disclaimer, hashtag, tampilan"},
    {href:"/studio/assets",label:"Asset Library",hint:"Ikon, bentuk, dan gambar"},
    {href:"/carousel/demo",label:"Demo JSX",hint:"Spesifikasi untuk AI"},
  ]},
];
// Daftar menu untuk satu akun; dipakai juga oleh Beranda.
export function navFor(account){
  const keep=item=>!item.only||item.only===account;
  return items.map(item=>item.children?{...item,children:item.children.filter(keep)}:item);
}
const flat=items.flatMap(item=>item.children||[item]);

function AccountSwitch({account,onPick}){
  return (
    <div className="studio-account" role="group" aria-label="Akun konten">
      {ACCOUNT_IDS.map(id=><button key={id} type="button" aria-pressed={account===id} data-account={id} title={ACCOUNTS[id].name+": "+ACCOUNTS[id].summary}
        onClick={()=>onPick(id)} className="studio-account-btn">{ACCOUNTS[id].label}</button>)}
    </div>
  );
}

export default function SiteNav(){
  const pathname=usePathname();
  const account=useAccount();
  const [open,setOpen]=useState(false);
  const [group,setGroup]=useState(null);
  const root=useRef(null);
  const menu=navFor(account);
  const current=flat.find(item=>item.href===pathname)||flat.find(item=>item.href!=="/"&&pathname?.startsWith(item.href));
  const close=()=>{setOpen(false);setGroup(null);};
  // Close on outside tap or Escape (state is only set inside event callbacks).
  useEffect(()=>{
    if(!open&&!group)return undefined;
    const onDown=event=>{if(root.current&&!root.current.contains(event.target)){setOpen(false);setGroup(null);}};
    const onKey=event=>{if(event.key==="Escape"){setOpen(false);setGroup(null);}};
    document.addEventListener("pointerdown",onDown);
    document.addEventListener("keydown",onKey);
    return ()=>{document.removeEventListener("pointerdown",onDown);document.removeEventListener("keydown",onKey);};
  },[open,group]);
  const link=(item,extra="")=>{
    const active=pathname===item.href;
    return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} onClick={close}
      className={"studio-nav-link"+extra+(active?" studio-nav-link--active":"")}>
      <span>{item.label}</span>{item.hint?<small className="studio-nav-hint">{item.hint}</small>:null}
    </Link>;
  };
  return (
    <nav aria-label="Navigasi Aksioma" className="studio-site-nav studio-only" data-account={account} ref={root}>
      <div className="studio-site-nav-inner">
        <Link href="/" className="studio-nav-brand" onClick={close}>AKSIOMA<span>.</span> <small>CONTENT</small></Link>
        <div className="studio-nav-right">
          <AccountSwitch account={account} onPick={setAccount}/>
          <button type="button" className="studio-nav-toggle" aria-expanded={open} aria-controls="studio-nav-menu" onClick={()=>{setOpen(value=>!value);setGroup(null);}}>
            <span className="studio-nav-toggle-label">{current?.label||"Menu"}</span>
            <Icon name="chevron-down" size={16} className={open?"studio-nav-chevron studio-nav-chevron--open":"studio-nav-chevron"}/>
          </button>
          <div id="studio-nav-menu" className="studio-nav-links" data-open={open?"true":"false"}>
            {menu.map(item=>{
              if(!item.children)return link(item);
              const isOpen=group===item.key;
              const hasActive=item.children.some(child=>child.href===pathname);
              return (
                <div key={item.key} className="studio-nav-group" data-open={isOpen?"true":"false"}>
                  <button type="button" aria-expanded={isOpen} aria-haspopup="true" onClick={()=>setGroup(isOpen?null:item.key)}
                    className={"studio-nav-link studio-nav-group-btn"+(hasActive?" studio-nav-link--active":"")}>
                    <span>{item.label}</span>
                    <Icon name="chevron-down" size={14} className={isOpen?"studio-nav-chevron studio-nav-chevron--open":"studio-nav-chevron"}/>
                  </button>
                  <div className="studio-nav-panel" role="group" aria-label={item.label}>
                    {item.children.map(child=>link(child," studio-nav-sublink"))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
