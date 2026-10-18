"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";
const sections=[
  {href:"/",label:"Beranda"},
  {href:"/studio",label:"Carousel Studio"},
  {href:"/studio/template",label:"Template AI"},
  {href:"/studio/remix",label:"Adaptasi Konten"},
  {href:"/studio/stocks",label:"Impor Saham"},
  {href:"/studio/components",label:"Komponen"},
  {href:"/studio/assets",label:"Asset Library"},
  {href:"/carousel/demo",label:"Demo JSX"},
];
export default function SiteNav(){
  const pathname=usePathname();
  const [open,setOpen]=useState(false);
  const root=useRef(null);
  const current=sections.find(item=>item.href===pathname)||sections.find(item=>item.href!=="/"&&pathname?.startsWith(item.href));
  // Close on outside tap or Escape (state is only set inside event callbacks).
  useEffect(()=>{
    if(!open)return undefined;
    const onDown=event=>{if(root.current&&!root.current.contains(event.target))setOpen(false);};
    const onKey=event=>{if(event.key==="Escape")setOpen(false);};
    document.addEventListener("pointerdown",onDown);
    document.addEventListener("keydown",onKey);
    return ()=>{document.removeEventListener("pointerdown",onDown);document.removeEventListener("keydown",onKey);};
  },[open]);
  return (
    <nav aria-label="Navigasi Aksioma" className="studio-site-nav studio-only" ref={root}>
      <div className="studio-site-nav-inner">
        <Link href="/" className="studio-nav-brand" onClick={()=>setOpen(false)}>AKSIOMA<span>.</span> <small>CONTENT</small></Link>
        <button type="button" className="studio-nav-toggle" aria-expanded={open} aria-controls="studio-nav-menu" onClick={()=>setOpen(value=>!value)}>
          <span className="studio-nav-toggle-label">{current?.label||"Menu"}</span>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={open?"studio-nav-chevron studio-nav-chevron--open":"studio-nav-chevron"}><path d="M3 6l5 5 5-5"/></svg>
        </button>
        <div id="studio-nav-menu" className="studio-nav-links" data-open={open?"true":"false"}>
          {sections.map(item=>{
            const active=pathname===item.href;
            return <Link key={item.href} href={item.href} aria-current={active?"page":undefined} onClick={()=>setOpen(false)}
              className={"studio-nav-link"+(active?" studio-nav-link--active":"")}>{item.label}</Link>;
          })}
        </div>
      </div>
    </nav>
  );
}
