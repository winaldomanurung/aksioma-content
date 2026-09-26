"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
const sections=[
  {href:"/",label:"Beranda"},
  {href:"/studio",label:"Carousel Studio"},
  {href:"/studio/template",label:"Template AI"},
  {href:"/studio/assets",label:"Asset Library"},
  {href:"/carousel/demo",label:"Demo JSX"},
];
export default function SiteNav(){
  const pathname=usePathname();
  return (
    <nav aria-label="Navigasi Aksioma" className="studio-site-nav studio-only">
      <div className="studio-site-nav-inner">
        <Link href="/" className="studio-nav-brand">AKSIOMA<span>.</span> <small>CONTENT</small></Link>
        <div className="studio-nav-links">
          {sections.map(item=>{
            const active=pathname===item.href;
            return <Link key={item.href} href={item.href} aria-current={active?"page":undefined}
              className={"studio-nav-link"+(active?" studio-nav-link--active":"")}>{item.label}</Link>;
          })}
        </div>
      </div>
    </nav>
  );
}
