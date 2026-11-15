/*
STOCK ANALYSIS STUDIO — PORTABLE PAGE TEMPLATE

AI: Return a complete replacement for this page.jsx. Modify ONLY the JSON
between AKSIOMA_STUDIO_JSON_START and AKSIOMA_STUDIO_JSON_END, unless the user
specifically asks to change rendering code. Keep valid strict JSON: quoted
property names, double-quoted strings, no comments or trailing commas inside.
Choose the slide count from the content (about 5–20) with metadata and varied structure. It is safe to
paste the COMPLETE page.jsx into /studio: the app extracts the JSON block,
never compiles or executes pasted JavaScript/JSX.

Slide types:
hero {eyebrow,title,subtitle,accent,density}
statement {eyebrow,lead,highlight,note,density,backgroundWord?,cornerLabel?}
bullet {eyebrow,title,items:[{title,text}],density,backgroundWord?,cornerLabel?}
compare {title,left:{label,heading,points:[]},right:{label,heading,points:[]},
         backgroundWord?,cornerLabel?,keywords?:[string]}
causeEffect {causeTitle,causeText,effectTitle,effectText,
             chainLabel?,chainCaption?,chain?:[{title,note}],
             backgroundWord?,cornerLabel?}
framework {title,steps:[{title,text}],backgroundWord?,cornerLabel?,keywords?:[string]}
summary {title,items:[string],backgroundWord?,cornerLabel?,keywords?:[string]}
cta {title,body,cta}
freeform {eyebrow,dark?,theme?,density,backgroundWord,cornerLabel,nodes:[...]}

Freeform node types:
slideHeading {title,body?,eyebrow?}
infoCard {eyebrow?,title,text,variant:"soft"|"accent"|"outline"|"dark"|"glass"}
statCard {value,label,note?,variant:"light"|"dark"}
bigNumber {value,label?,dark?}
quoteCard {quote,source?,dark?}
diagramNode {title,body?,accent?,dark?}
connector {direction:"down"|"right",label?,dark?}
timeline {items:[{title,text}],dark?}
checklist {items:[string],dark?}
callout {label?,text,dark?}
pill {text,dark?}
keywordCluster {items:[string],dark?} // only for meaningful categorization, not decorative repetition
miniDiagram {items:[string],dark?}
Stock nodes (use ALONE under a slideHeading; numbers only from the user's source):
statSnapshot {items:[{label,value,sub?,tone?:"up"|"down"|"neutral"}] 1-6,dark?}
signalGrid {items:[{name,reading,signal:"up"|"down"|"flat"}] 1-6,dark?}
priceLevels {items:[{kind:"entry"|"target"|"stop"|"support"|"resistance",value,label?,current?}] 2-6,dark?}
returnBars {groups:[{label,bars:[{name,value:number,highlight?}] 1-4}] 1-3 groups, <=10 bars total,unit?,signed?,dark?}
verdictCard {verdict:"buy"|"accumulate"|"hold"|"watch"|"sell",title,text?,reasons?:[string<=3],caution?,dark?}
stockList | stockCompare | priceChart | tradePlan | eventCalendar | marketRank: see /studio/components
twoColumn | threeColumn | contentGrid | stack {children:[nodes],columns?}
divider {dark?}
assetIcon {set:"lucide"|"phosphor",name,size?:"sm"|"md"|"lg",
           tone?:"ink"|"accent"|"light",label?}
assetShape {name,position?:"full"|"topRight"|"bottomRight"|"bottomLeft",
            opacity?:"subtle"|"soft"|"bold"}
See /studio/assets for exact allowlisted names and usage rationale:
48 icons, 14 decorative shapes, 18 background themes. AI prompt /studio/template
includes complete names and suggested uses. NEVER invent asset names.
Freeform background theme is a slide-level field, NOT a node.
Theme automatically determines whether text/cards need light or dark foreground.

All assets are local SVGs; never use arbitrary URL/image paths or unknown
names. Freeform nodes flow BELOW the section eyebrow; never overlap the section label.\nKeep the combined height of icons, heading, cards, and gaps within the slide.\nReduce redundant icons or shorten copy if a composition becomes crowded.\nDecorative shapes must stay behind text, and meaningful icons stay
inside the safe content area. Browse /studio/assets for copyable examples.

Never add decorative keyword pills below a statement. The statement itself\nshould carry the message; use a diagram or comparison only when it adds meaning.\nDesign according to meaning, not mechanical slide rotation; use Freeform
for editorial composition. Avoid dense text and repeated card grids. A TikTok
photo carousel is 1080×1350 with extra content margins. Meta requires a
working title, captions for both platforms, objective, pillar, hook, CTA,
hashtags, keywords, and notes. Browser export may not perfectly reproduce
fonts/filters; inspect JPEG output before publishing.
*/

import {StudioSlide} from "@/components/studio/StudioSlide";
import {PostMetaPanel,PlatformSwitcher} from "@/components/carousel";

// Keep the markers inside this template literal, so this is valid page.jsx.
// Studio extracts the JSON ONLY, without evaluating the pasted file.
const carouselSource = String.raw`
/* AKSIOMA_STUDIO_JSON_START */
{
  "version": 1,
  "meta": {
    "account": "trader",
    "title": "SCHD naik 29% dalam setahun: masih layak dibeli?",
    "objective": "Save + Share",
    "contentPillar": "Analisis Saham",
    "hook": "Naik 29% dalam setahun, tapi jangan beli sekaligus.",
    "instagramCaption": "Snapshot SCHD per penutupan 16 Okt 2026: angka kunci, sinyal teknikal, perbandingan return, dan level risiko.\n\nIni edukasi, bukan ajakan membeli atau menjual. Cek ulang data sebelum bertindak.",
    "tiktokCaption": "SCHD naik 29% setahun. Layak dikejar di puncak? Ini datanya.",
    "cta": "Simpan untuk referensi dan kirim ke temanmu yang memantau SCHD.",
    "hashtags": [
      "SCHD",
      "Saham",
      "AnalisisSaham",
      "Dividen"
    ],
    "keywords": [
      "SCHD",
      "dividen",
      "teknikal",
      "cut loss"
    ],
    "notes": "Angka adalah ilustrasi dari snapshot 16 Okt 2026. Verifikasi harga, yield, dan level di sumber resmi sebelum dipublikasikan."
  },
  "slides": [
    {"type":"hero","eyebrow":"SCHD • Snapshot 16 Okt 2026","title":"SCHD naik 29%. Masih layak dibeli?","subtitle":"Angka kunci, sinyal teknikal, dan rencana risiko dalam satu carousel.","accent":"Analisis, bukan ajakan transaksi.","density":"bold"},
    {"type":"freeform","theme":"navy","eyebrow":"Snapshot","density":"balanced","vertical":"spread","sources":["Equibles, penutupan 16 Okt 2026"],"nodes":[{"type":"slideHeading","title":"Angka kunci per penutupan."},{"type":"statSnapshot","items":[{"label":"Harga","value":"$34,35","sub":"+0,73% hari ini","tone":"up"},{"label":"Yield TTM","value":"3,09%","sub":"$1,06, kuartalan"},{"label":"YTD","value":"+25,2%","sub":"Total return +28,3%","tone":"up"},{"label":"Jarak dari high","value":"−2,7%","sub":"52-week high $35,31","tone":"down"},{"label":"Expense ratio","value":"0,06%","sub":"Biaya tahunan"},{"label":"AUM","value":"$94,9 M","sub":"Laporan SEC terakhir"}]}]},
    {"type":"freeform","theme":"ice","eyebrow":"Teknikal","density":"balanced","vertical":"spread","nodes":[{"type":"slideHeading","title":"Sinyal teknikal: 4 dari 6 bullish.","body":"Uptrend masih utuh, tapi momentum mulai melemah."},{"type":"signalGrid","items":[{"name":"Harga vs EMA","reading":"+2,8% EMA50 · +8,8% EMA200","signal":"up"},{"name":"ADX mingguan","reading":"44,6, turun dari 55,0","signal":"up"},{"name":"RSI harian","reading":"67,2, belum overbought","signal":"up"},{"name":"Return vs SPY 1 th","reading":"SCHD +29,3% vs SPY +15,5%","signal":"up"},{"name":"Bollinger harian","reading":"Di atas upper band (%B 1,09)","signal":"down"},{"name":"Stochastic harian","reading":"%K 94,3, overbought","signal":"down"}]}]},
    {"type":"freeform","theme":"paper","eyebrow":"Kinerja","density":"balanced","vertical":"spread","sources":["Equibles, total return per 16 Okt 2026"],"nodes":[{"type":"slideHeading","title":"Satu tahun unggul. Tiga tahun tertinggal.","body":"Lonjakan 1 tahun adalah rotasi ke value, bukan rekor jangka panjang."},{"type":"returnBars","unit":"%","signed":true,"groups":[{"label":"1 tahun","bars":[{"name":"SCHD","value":29.3,"highlight":true},{"name":"QQQ","value":18.3},{"name":"SPY","value":15.5}]},{"label":"3 tahun","bars":[{"name":"SCHD","value":44.8,"highlight":true},{"name":"SPY","value":75},{"name":"QQQ","value":92.1}]}]}]},
    {"type":"freeform","theme":"sand","eyebrow":"12 bulan","density":"balanced","vertical":"center","sources":["Equibles, dividen dan harga 12 bulan"],"nodes":[{"type":"slideHeading","title":"Naiknya dari harga, bukan dividen."},{"type":"compareCards","delta":"VS","left":{"label":"Dividen","heading":"+2%","points":["$1,04 menjadi $1,06","Hampir tidak bergerak"]},"right":{"label":"Harga","heading":"+29%","points":["Yield turun 3,9% ke 3,1%","Pemicu utama kenaikan"]}},{"type":"callout","label":"Intinya","text":"Yield turun karena harga naik lebih cepat dari dividen, bukan karena dividen dipotong."}]},
    {"type":"freeform","theme":"graphite","eyebrow":"Pro dan kontra","density":"bold","vertical":"center","sources":["Equibles, data per 16 Okt 2026"],"nodes":[{"type":"slideHeading","title":"Dua sisi yang perlu ditimbang."},{"type":"prosCons","proLabel":"Pro","conLabel":"Kontra","pros":["Uptrend terkonfirmasi di atas EMA50 dan EMA200","Yield 3,09% dengan biaya hanya 0,06%","Isinya perusahaan besar yang profitable","Unggul dari SPY dan QQQ dalam 1 tahun"],"cons":["Harga overextended: di atas Bollinger, Stochastic overbought","Top-10 memegang 43,6% portofolio","Bila growth memimpin lagi, SCHD tertinggal","Tertinggal dari SPY dan QQQ dalam 3 tahun"]},{"type":"callout","label":"Intinya","text":"Tren kuat mendukung, tapi harga yang sudah naik jauh sebaiknya dicicil."}]},
    {"type":"freeform","theme":"midnight","eyebrow":"Level risiko","density":"balanced","vertical":"spread","sources":["Fibonacci swing low $31,61 ke high $35,31"],"nodes":[{"type":"slideHeading","title":"Rencana level, dari atas ke bawah."},{"type":"priceLevels","dark":true,"items":[{"kind":"target","value":"$36,32","label":"Target 2"},{"kind":"resistance","value":"$35,31","label":"High 52 minggu"},{"kind":"entry","value":"$34,35","current":true},{"kind":"entry","value":"$33,90","label":"Zona EMA50 ≈ $33,41"},{"kind":"support","value":"$33,02","label":"Entry kedua"},{"kind":"stop","value":"$31,57","label":"Cut loss: close < EMA200"}]}]},
    {"type":"freeform","theme":"ivory","eyebrow":"Kesimpulan","density":"balanced","vertical":"center","nodes":[{"type":"slideHeading","title":"Pandangan akhir."},{"type":"verdictCard","verdict":"accumulate","title":"Layak dicicil, jangan dikejar sekaligus.","text":"Uptrend utuh, tapi harga dekat 52-week high dan momentum mulai melemah.","reasons":["Cicil bertahap di zona pullback","Konfirmasi dengan close mingguan","Patuhi level cut loss"],"caution":"Ilustrasi analisis, bukan nasihat investasi. Sesuaikan dengan profil risikomu."}]},
    {"type":"cta","title":"Simpan dan bagikan.","body":"Cek ulang EMA dan level cut loss sebelum bertindak.","cta":"Kirim ke temanmu yang lagi memantau SCHD."}
  ]
}
/* AKSIOMA_STUDIO_JSON_END */
`;

const start = "/* AKSIOMA_STUDIO_JSON_START */";
const end = "/* AKSIOMA_STUDIO_JSON_END */";
const data = JSON.parse(carouselSource.split(start)[1].split(end)[0]);

export const metadata = {title:"Studio Template | Aksioma Content"};

export default async function Page({searchParams}){
  const params=await searchParams;
  const platform=params?.platform==="tiktok"?"tiktok":"instagram";
  const safeArea=platform==="tiktok"&&params?.safe==="1";
  // Same inputs as /studio, so the Playwright export matches the Studio preview.
  const account="trader";
  return (
    <main className="carousel-stage" data-platform={platform}
      data-safe-area={safeArea?"true":"false"}>
      <PostMetaPanel {...data.meta}/>
      <PlatformSwitcher route="/carousel/studio-template" platform={platform} safeArea={safeArea}/>
      {data.slides.map((slide,index)=><StudioSlide key={index} data={slide} number={index+1} account={account} total={data.slides.length}/>)}
    </main>
  );
}
