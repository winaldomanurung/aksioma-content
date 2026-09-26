/*
AKSIOMA STUDIO — PORTABLE PAGE TEMPLATE

AI: Return a complete replacement for this page.jsx. Modify ONLY the JSON
between AKSIOMA_STUDIO_JSON_START and AKSIOMA_STUDIO_JSON_END, unless the user
specifically asks to change rendering code. Keep valid strict JSON: quoted
property names, double-quoted strings, no comments or trailing commas inside.
Usually write 10 slides with metadata and varied structure. It is safe to
paste the COMPLETE page.jsx into /studio: the app extracts the JSON block,
never compiles or executes pasted JavaScript/JSX.

Slide types:
hero {eyebrow,title,subtitle,accent,density}
statement {eyebrow,lead,highlight,note,keywords,density}
bullet {eyebrow,title,items:[{title,text}],density}
compare {title,left:{label,heading,points:[]},right:{label,heading,points:[]}}
causeEffect {causeTitle,causeText,effectTitle,effectText,
             chainLabel?,chainCaption?,chain?:[{title,note}]}
framework {title,steps:[{title,text}]}
summary {title,items:[string]}
cta {title,body,cta}
freeform {eyebrow,dark,density,backgroundWord,cornerLabel,nodes:[...]}

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
keywordCluster {items:[string],dark?}
miniDiagram {items:[string],dark?}
twoColumn | threeColumn | contentGrid | stack {children:[nodes],columns?}
divider {dark?}
assetIcon {set:"lucide"|"phosphor",name,size?:"sm"|"md"|"lg",
           tone?:"ink"|"accent"|"light",label?}
  Lucide names: brain, lightbulb, shield-check, target, network,
  scale, message-circle, sparkles.
  Phosphor names: brain, lightbulb, shield-check, target, scales,
  chat-circle-text, check-circle, sparkle.
assetShape {name,position?:"full"|"topRight"|"bottomRight"|"bottomLeft",
            opacity?:"subtle"|"soft"|"bold"}
  Shape names: wave-red, orbital-rings, soft-blobs, editorial-grid.

All assets are local SVGs; never use arbitrary URL/image paths or unknown
names. Decorative shapes must stay behind text, and meaningful icons stay
inside the safe content area. Browse /studio/assets for copyable examples.

Design according to meaning, not mechanical slide rotation; use Freeform
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
    "title": "Seni menguji pendapat",
    "objective": "Save + share",
    "contentPillar": "Critical Thinking",
    "hook": "Yakin belum tentu benar.",
    "instagramCaption": "Jangan hanya percaya pada pendapat yang terdengar yakin. Coba periksa klaim, bukti, dan asumsinya.",
    "tiktokCaption": "Yakin ≠ benar. Simpan kerangka berpikir ini.",
    "cta": "Simpan dan gunakan ketika berdiskusi.",
    "hashtags": ["Aksioma", "BerpikirKritis"],
    "keywords": ["critical thinking", "bukti", "asumsi"],
    "notes": "Cek preview TikTok + safe area sebelum posting."
  },
  "slides": [
    {"type":"hero","eyebrow":"Critical Thinking","title":"Yakin belum tentu benar.","subtitle":"Belajar menguji sebuah pendapat sebelum mempercayainya.","density":"bold"},
    {"type":"statement","lead":"Perasaan yakin tidak sama dengan","highlight":"kualitas bukti.","note":"Keyakinan perlu disesuaikan dengan informasi yang tersedia."},
    {"type":"bullet","title":"Tiga lapisan dalam sebuah pendapat.","items":[{"title":"Fakta","text":"Apa yang benar-benar terjadi?"},{"title":"Interpretasi","text":"Makna yang kita berikan."},{"title":"Kesimpulan","text":"Hal yang kita putuskan untuk percaya."}]},
    {"type":"compare","title":"Reaksi cepat versus pengujian.","left":{"label":"Refleks","heading":"Langsung percaya","points":["Terasa masuk akal","Sesuai intuisi"]},"right":{"label":"Refleksi","heading":"Tahan kesimpulan","points":["Periksa sumber","Cari alternatif"]}},
    {"type":"causeEffect","causeTitle":"Kesimpulan terlalu awal","causeText":"Kita berhenti mencari bukti.","effectTitle":"Keyakinan mengeras","effectText":"Informasi yang bertentangan mulai diabaikan.","chainLabel":"Pola yang terjadi","chain":[{"title":"Duga","note":"Penjelasan pertama terasa cocok."},{"title":"Cari dukungan","note":"Kita memilih bukti yang sejalan."},{"title":"Yakin","note":"Sudut pandang semakin sulit berubah."}]},
    {"type":"freeform","eyebrow":"Cara berpikir","dark":false,"backgroundWord":"TEST","nodes":[{"type":"slideHeading","title":"Bangun cara berpikir yang bisa diuji.","body":"Gunakan hubungan antargagasan, bukan sekadar daftar."},{"type":"twoColumn","children":[{"type":"infoCard","variant":"accent","title":"Bukti","text":"Apa yang mendukung klaim?"},{"type":"infoCard","variant":"soft","title":"Alternatif","text":"Adakah penjelasan lain?"}]},{"type":"callout","label":"Inti","text":"Setiap kesimpulan punya syarat untuk direvisi."}]},
    {"type":"framework","title":"Lima pertanyaan untuk berpikir kritis.","density":"compact","steps":[{"title":"Claim","text":"Apa klaimnya?"},{"title":"Evidence","text":"Apa buktinya?"},{"title":"Assumption","text":"Apa asumsinya?"},{"title":"Alternative","text":"Apa alternatifnya?"},{"title":"Test","text":"Apa yang bisa menguji?"}]},
    {"type":"freeform","eyebrow":"Latihan","dark":true,"nodes":[{"type":"slideHeading","title":"Jadikan debat proses belajar."},{"type":"timeline","dark":true,"items":[{"title":"Definisikan","text":"Pastikan makna istilah sama."},{"title":"Periksa","text":"Cari bukti yang relevan."},{"title":"Perbarui","text":"Revisi jika informasi berubah."}]}]},
    {"type":"summary","title":"Empat kebiasaan sederhana.","items":["Pisahkan fakta dan interpretasi.","Periksa asumsi.","Cari alternatif.","Sesuaikan keyakinan dengan bukti."]},
    {"type":"cta","title":"Jangan buru-buru yakin.","body":"Pikiran yang kuat terbuka untuk diuji.","cta":"Simpan lima pertanyaan ini untuk diskusi berikutnya."}
  ]
}
/* AKSIOMA_STUDIO_JSON_END */
`;

const start = "/* AKSIOMA_STUDIO_JSON_START */";
const end = "/* AKSIOMA_STUDIO_JSON_END */";
const data = JSON.parse(carouselSource.split(start)[1].split(end)[0]);

export const metadata = {title:"Studio Template | Aksioma"};

export default async function Page({searchParams}){
  const params=await searchParams;
  const platform=params?.platform==="tiktok"?"tiktok":"instagram";
  const safeArea=platform==="tiktok"&&params?.safe==="1";
  return (
    <main className="carousel-stage" data-platform={platform}
      data-safe-area={safeArea?"true":"false"}>
      <PostMetaPanel {...data.meta}/>
      <PlatformSwitcher route="/carousel/studio-template" platform={platform} safeArea={safeArea}/>
      {data.slides.map((slide,index)=><StudioSlide key={index} data={slide} number={index+1}/>)}
    </main>
  );
}
