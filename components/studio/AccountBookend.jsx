import CarouselCanvas from "@/components/carousel/CarouselCanvas";
import BrandLogo from "@/components/carousel/BrandLogo";
import {useBrand} from "@/lib/studio/brand";
import {accountOf} from "@/lib/studio/accounts";

// Cover dan penutup per akun. Semua dekorasi berupa DOM/CSS biasa, jadi exporter
// JPEG di browser menangkapnya tanpa asset dari luar. Handle, situs, dan disclaimer
// diambil dari Brand Kit akun yang bersangkutan.
const COPY={
  trader:{coverEdition:"STOCK ANALYSIS / 01",endEdition:"MARKET NOTES / ",kicker:"MARKET INTELLIGENCE",display:"READ THE MARKET.",endKicker:"MARKET NOTES",overline:"YOUR NEXT MOVE STARTS WITH A BETTER QUESTION",action:"LANJUTKAN BELAJAR DI"},
  journey:{coverEdition:"THE EDITORIAL / 01",endEdition:"KEEP GROWING / ",kicker:"A BETTER WAY TO THINK",display:"THINK DEEPER.",endKicker:"PERSONAL GROWTH",overline:"SMALL STEPS. REAL GROWTH.",action:"TEMUKAN MATERI LAINNYA DI"},
};
export default function AccountBookend({kind,account,data,number}){
  const id=accountOf(account);
  const trader=id==="trader";
  const cover=kind==="hero";
  const copy=COPY[id];
  const brand=useBrand(id);
  const disclaimer=!cover&&brand.disclaimerOnCta&&brand.disclaimer?brand.disclaimer:"";
  return (
    <CarouselCanvas slide={number} type={kind} isDark={trader||cover} label={data.title}
      className={"account-bookend account-bookend--"+id+" "+(cover?"account-bookend--cover":"account-bookend--end")}>
      <div className="account-bookend-orb account-bookend-orb--one" aria-hidden="true"/>
      <div className="account-bookend-orb account-bookend-orb--two" aria-hidden="true"/>
      <div className="account-bookend-grid" aria-hidden="true"/>
      <div className="account-bookend-inner">
        <header className="account-bookend-header">
          <BrandLogo variant={trader||cover?"light":"dark"} className="account-bookend-original-logo"/>
          <span className="account-bookend-edition">{cover?copy.coverEdition:copy.endEdition+String(number).padStart(2,"0")}</span>
        </header>
        {cover ? (
          <div className="account-bookend-main">
            <div className="account-bookend-kicker"><span className="account-bookend-kicker-mark"/>{data.eyebrow||copy.kicker}</div>
            <div className="account-bookend-display">
              <p>{copy.display}</p>
              <h1>{data.title}</h1>
            </div>
            <div className="account-bookend-cover-foot">
              <p>{data.subtitle}</p>
              {trader?null:<div className="account-bookend-number">{String(number).padStart(2,"0")}<span>/ SERIES</span></div>}
            </div>
          </div>
        ) : (
          <div className="account-bookend-main account-bookend-main--end">
            <div className="account-bookend-kicker"><span className="account-bookend-kicker-mark"/>{copy.endKicker}</div>
            <p className="account-bookend-end-overline">{copy.overline}</p>
            <h2 className="account-bookend-end-title">{data.title}</h2>
            <p className="account-bookend-end-body">{data.body||data.subtitle}</p>
            <div className="account-bookend-action">
              <div className="account-bookend-action-copy">
                <span className="account-bookend-action-eyebrow">{copy.action}</span>
                <strong className="account-bookend-action-website">{brand.website}</strong>
                <span className="account-bookend-action-cta">{data.cta||"Simpan dan bagikan insight ini."}</span>
              </div>
              <span className="account-bookend-action-arrow" aria-hidden="true">↗</span>
            </div>
            {disclaimer?<p className="account-bookend-disclaimer">{disclaimer}</p>:null}
          </div>
        )}
        <footer className="account-bookend-footer">
          <span className="account-bookend-footer-handle">{brand.handle}</span>
          <span className="account-bookend-footer-page">{String(number).padStart(2,"0")}</span>
        </footer>
      </div>
    </CarouselCanvas>
  );
}
