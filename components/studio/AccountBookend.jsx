import CarouselCanvas from "@/components/carousel/CarouselCanvas";
import BrandLogo from "@/components/carousel/BrandLogo";

// Account-specific editorial covers. All decoration is native CSS/SVG-free DOM,
// so the existing browser JPEG exporter captures it without remote assets.
export default function AccountBookend({kind,account="journey",data,number}){
  const trader=account==="trader";
  const cover=kind==="hero";
  const handle=trader?"@aksioma.trader":"@aksioma.journey";
  const website=trader?"aksioma-trader.com":"aksioma-journey.com";
  return (
    <CarouselCanvas slide={number} type={kind} isDark={trader||cover} label={data.title}
      className={"account-bookend "+(trader?"account-bookend--trader":"account-bookend--journey")+" "+(cover?"account-bookend--cover":"account-bookend--end")}>
      <div className="account-bookend-orb account-bookend-orb--one" aria-hidden="true"/>
      <div className="account-bookend-orb account-bookend-orb--two" aria-hidden="true"/>
      <div className="account-bookend-grid" aria-hidden="true"/>
      <div className="account-bookend-inner">
        <header className="account-bookend-header">
          <BrandLogo variant={trader||cover?"light":"dark"} className="account-bookend-original-logo"/>
          <span className="account-bookend-edition">{cover?"THE EDITORIAL / 01":"KEEP GROWING / "+String(number).padStart(2,"0")}</span>
        </header>
        {cover ? (
          <div className="account-bookend-main">
            <div className="account-bookend-kicker"><span className="account-bookend-kicker-mark"/>{data.eyebrow|| (trader?"MARKET INTELLIGENCE":"A BETTER WAY TO THINK")}</div>
            <div className="account-bookend-display">
              <p>{trader?"READ THE MARKET.":"THINK DEEPER."}</p>
              <h1>{data.title}</h1>
            </div>
            <div className="account-bookend-cover-foot">
              <p>{data.subtitle}</p>
              <div className="account-bookend-number">{String(number).padStart(2,"0")}<span>/ SERIES</span></div>
            </div>
          </div>
        ) : (
          <div className="account-bookend-main account-bookend-main--end">
            <div className="account-bookend-kicker"><span className="account-bookend-kicker-mark"/>{trader?"MARKET NOTES":"PERSONAL GROWTH"}</div>
            <p className="account-bookend-end-overline">{trader?"YOUR NEXT MOVE STARTS WITH A BETTER QUESTION":"SMALL STEPS. REAL GROWTH."}</p>
            <h2 className="account-bookend-end-title">{data.title}</h2>
            <p className="account-bookend-end-body">{data.body||data.subtitle}</p>
            <div className="account-bookend-action">
              <div className="account-bookend-action-icon" aria-hidden="true">{trader?"↗":"✦"}</div>
              <div>
                <span>{trader?"BUILD YOUR MARKET PERSPECTIVE":"GROW WITH INTENTION"}</span>
                <strong>{data.cta||"Simpan dan bagikan insight ini."}</strong>
              </div>
              <span className="account-bookend-action-arrow" aria-hidden="true">↗</span>
            </div>
          </div>
        )}
        <footer className="account-bookend-footer">
          <span>{handle}</span>
          <span>{website}</span>
          <span>{String(number).padStart(2,"0")}</span>
        </footer>
      </div>
    </CarouselCanvas>
  );
}
