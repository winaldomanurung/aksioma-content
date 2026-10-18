/*
===============================================================================
AKSIOMA CAROUSEL — AI AUTHORING CONTRACT
===============================================================================

PURPOSE
This file is intentionally self-documenting. If this entire page.jsx is pasted
into an AI together with a topic/request, the AI should be able to return ONE
complete replacement page.jsx that is ready to paste into this repo and export.

CAPACITY (MEASURED)
Item counts and text lengths per component are measured in a real browser by
`npm run measure:capacity` (lib/studio/capacity-data.js) and summarised in
lib/studio/component-specs.js. Browse them at /studio/components. Recommended
counts: bullet 4, compare 4/side, causeEffect chain 4, framework 5, summary 5,
timeline 5, checklist 5, miniDiagram 5, keywordCluster 8,
barChart 5, mythFact 3, prosCons 4, table 5 rows. All data and new primitives
(BarChart, DataTable, Matrix2x2, MythFact, ProsCons, BeforeAfter, Funnel, Ladder, QACard,
PollCard, SwipeHint, SourceNote, ProgressRing, TextBlock, Footnote, Glossary, Flow) are
exported and usable in JSX. Measured: flow row 5 / column 8 items (hard ceiling 5),
glossary 3, footnote 10 (editorial 3), textBlock ~280 chars. Re-measure after any CSS or
component change. Image slots (PhotoHero, PhoneMockup, Collage, AvatarQuote, BeforeAfter
slot) render a neutral block in JSX; images are attached only in Studio JSON (`images`).

THEME + DECORATIONS (ASSET LIBRARY)
Every preset except Hero/CTA and FreeformSlide accepts `theme` (a palette key) and
`decorations` (a ReactNode of <AssetShape/>, max 2). Palette keys — light: paper, ivory,
sand, blush, peach, lemon, mint, ice, lilac; dark: graphite, midnight, navy.
BulletSlide, CauseEffectSlide and SummarySlide are dark presets: give them a DARK theme;
the other presets take a LIGHT theme. Use at least 4 different themes in a carousel.
Import { AssetIcon, AssetShape } from "@/components/studio/AssetPrimitives".
AssetShape({ name, position: full|topRight|bottomRight|bottomLeft, opacity: subtle|soft|bold })
  names: wave-red, orbital-rings, soft-blobs, editorial-grid, contour-lines, sunburst,
  diagonal-stripes, dotted-field, arc-ribbon, topographic, window-frames, orbit-dots,
  gradient-orbs, angular-path
AssetIcon({ set: lucide|phosphor, name, size: sm|md|lg, tone: ink|accent|light, label? })
  lucide: brain lightbulb shield-check target network scale message-circle sparkles
  book-open chart-no-axes-combined compass eye flag handshake layers lock-keyhole puzzle
  rocket search users workflow zap presentation trophy
  phosphor: brain lightbulb shield-check target scales chat-circle-text check-circle sparkle
  book-open chart-line-up compass eye flag handshake stack lock-key puzzle-piece rocket
  magnifying-glass users flow-arrow lightning presentation-chart trophy
Plan: decorations on 4–6 slides, icons on 2–4 slides, none on Hero/CTA. Never place
important text on top of a decoration.

VERTICAL + EXTRAS
SlideShell, FreeformSlide and every preset (except Hero/CTA) accept `vertical` ("top" default in
JSX, "center", "spread", "stretch") and `extras` (a ReactNode rendered below the
main content, in layout flow). Use extras for NEW supporting information (a
Callout, SourceNote, MiniDiagram), never to repeat the main content. In Studio JSON
the same fields exist as slide.vertical (default "center") and slide.extras.

EXPECTED AI OUTPUT
- Return a complete valid page.jsx, not fragments.
- Keep the platform/searchParams plumbing intact.
- Fill postMeta completely.
- Default to 10 slides unless the user requests another count.
- Usually use HeroSlide for slide 1 and CTASlide for the final slide.
- Choose slide structures from the MEANING of the content, not by rotating
  templates mechanically.
- Presets are shortcuts, NOT mandatory layouts.
- Use FreeformSlide + primitives whenever a custom composition communicates
  the idea more clearly.
- Do not invent imports/components that are not listed in this contract unless
  the user explicitly asks to extend the design system.

PLATFORMS
- Instagram: 1080×1350 (4:5)
- TikTok Photo Carousel: 1080×1350 (4:5)
- The SAME JSX content renders both platforms.
- TikTok photo-carousel safe margins are handled by the design system.
- Avoid critical text in custom absolute-positioned elements near canvas edges.
- Decorative full-bleed elements are fine; important information should stay
  inside normal slide content flow.

DENSITY
Every preset/FreeformSlide can use:
- density="airy"      -> sparse, contemplative, more breathing room
- density="balanced"  -> normal default
- density="compact"   -> dense framework/list content
- density="bold"      -> large visual hierarchy / strong statement

PUBLISHING METADATA
PostMetaPanel accepts:
{
  title,              // internal working title
  objective,          // e.g. Save + share / Comment / Follow / Conversion
  contentPillar,      // topic family
  hook,               // primary scroll-stopping angle
  instagramCaption,
  tiktokCaption,
  cta,
  hashtags: [],
  keywords: [],
  notes
}

PRESET SLIDES
Decoration props: StatementSlide, BulletSlide, CompareSlide, CauseEffectSlide,
FrameworkSlide, SummarySlide and CTASlide accept optional backgroundWord and
cornerLabel. CompareSlide, FrameworkSlide, SummarySlide and CTASlide also accept
optional keywords: [string]. Nothing is added when they are omitted, so write them
for THIS topic only (a keyword chip row must carry real information).
Presets (except Hero/CTA) also accept vertical, extras, theme and decorations — see
VERTICAL + EXTRAS and THEME + DECORATIONS above. FreeformSlide additionally takes `theme`.

1) HeroSlide
   HeroSlide({
     slide, eyebrow, title, subtitle,
     accent?, density?
   })
   USE FOR: opening hook / cover.

2) StatementSlide
   StatementSlide({
     slide, eyebrow?, lead, highlight, note?,
     density?, backgroundWord?, cornerLabel?
   })
   USE FOR: one provocative idea, reframe, misconception, principle.

3) BulletSlide
   BulletSlide({
     slide, eyebrow?, title,
     items: [{ title, text }],
     density?, backgroundWord?, cornerLabel?
   })
   USE FOR: 3–5 parallel points that genuinely belong in a list.

4) CompareSlide
   CompareSlide({
     slide, eyebrow?, title,
     left: { label, heading, points: [] },
     right: { label, heading, points: [] },
     density?, backgroundWord?, cornerLabel?, keywords?
   })
   USE FOR: true contrast, before/after, wrong/right, A/B.

5) CauseEffectSlide
   CauseEffectSlide({
     slide, causeTitle, causeText,
     effectTitle, effectText,
     density?, backgroundWord?, cornerLabel?
   })
   USE FOR: one clear causal relationship.

6) FrameworkSlide
   FrameworkSlide({
     slide, eyebrow?, title,
     steps: [{ title, text }],
     density?, backgroundWord?, cornerLabel?, keywords?
   })
   USE FOR: named framework, checklist-like method, ordered questions.

7) SummarySlide
   SummarySlide({
     slide, title, items: [], density?,
     backgroundWord?, cornerLabel?, keywords?
   })
   USE FOR: synthesis near the end, not as a generic list replacement.

8) CTASlide
   CTASlide({
     slide, title, body, cta?, density?,
     backgroundWord?, cornerLabel?, keywords?
   })
   USE FOR: closing takeaway + desired action.

ESCAPE HATCH
9) FreeformSlide
   FreeformSlide({
     slide, eyebrow?, dark?, density?,
     backgroundWord?, cornerLabel?, className?,
     children
   })
   USE FOR: any composition that presets would make feel forced or repetitive.

VISUAL / CONTENT PRIMITIVES
These are intended primarily inside FreeformSlide:

SlideHeading({ eyebrow?, title, body?, align?, className? })
InfoCard({ eyebrow?, title?, variant?, className?, children })
  variants: soft | outline | accent | dark | glass
StatCard({ value, label, note?, variant?, className? })
  variants: light | dark
BigNumber({ value, label?, dark?, className? })
QuoteCard({ quote, source?, dark?, className? })
DiagramNode({ title, body?, accent?, dark?, className? })
Connector({ direction?, dark?, label?, className? })
  direction: down | right
Timeline({ items: [{ title, text }], dark?, className? })
Checklist({ items: [], dark?, className? })
Callout({ label?, dark?, className?, children })
Pill({ dark?, className?, children })
KeywordCluster({ items: [], dark?, className? })
MiniDiagram({ items: [], dark?, className? })
BackgroundWord({ dark?, className?, style?, children })
AccentLine({ dark?, className?, style? })
CornerLabel({ dark?, className?, style?, children })
TwoColumn({ children, className? })
ThreeColumn({ children, className? })
ContentGrid({ columns?, children, className? })
Stack({ gap?, children, className? })
Divider({ dark?, className? })

DATA PRIMITIVES
BarChart({ items: [{ label, value, note? }], unit?, max?, dark? })
Matrix2x2({ xAxis: { low, high }, yAxis: { low, high }, quadrants: [4 × { title, text }], dark? })
  order: top-left, top-right, bottom-left, bottom-right
DataTable({ columns: [], rows: [{ cells: [] }], dark? })
MythFact({ items: [{ myth, fact }], mythLabel?, factLabel?, dark? })
ProsCons({ pros: [], cons: [], proLabel?, conLabel?, dark? })
BeforeAfter({ before: { label?, title, text }, after: { label?, title, text }, slot?: md|lg, dark? })
Funnel({ items: [{ label, note? }], shape?: funnel|pyramid, dark? })
Ladder({ items: [{ label, note?, value?, current? }], dark? })
QACard({ items: [{ q, a }], dark? })
PollCard({ question, options: [], cta?, dark? })
SwipeHint({ text?, align?: left|center|right, dark? })
SourceNote({ text, label?, dark? })
ProgressRing({ value: 0-100, label, note?, dark? })

TEXT PRIMITIVES (new)
TextBlock({ text, label?, size?: sm|md|lg, dark? })       // short explanatory paragraph
Footnote({ items: [string], dark? })                       // notes; keep to 1–3
Glossary({ items: [{ term, meaning }], dark? })            // 2–3 terms
Flow({ items: [{ label, note?, via? }], direction?: row|column,
       fork?: [{ via?, label }, { via?, label }], dark? })  // labelled flow, optional 2-way fork

IMAGE PRIMITIVES (slots stay empty in JSX; images are attached in Studio)
PhotoHero({ image?, size?, shape?, fit?, title?, text?, overlay?, dark? })
PhoneMockup({ image?, size?, align?, caption?, dark? })
Collage({ items: [{ image?, caption? }] (2–4), size?, shape?, dark? })
AvatarQuote({ avatar?, quote, name, role?, dark? })

LAYOUT NOTE
TwoColumn, ThreeColumn and ContentGrid remain available in TikTok photo mode
because the canvas is also 4:5. Keep critical content inside normal layout flow
and avoid placing important text against the outer edges.

INFORMATION -> VISUAL MAPPING
- Opening promise / tension             -> HeroSlide
- One sharp idea / reframe              -> StatementSlide
- Parallel list                         -> BulletSlide
- Two-sided contrast                    -> CompareSlide
- Cause -> consequence                  -> CauseEffectSlide
- Ordered method/questions              -> FrameworkSlide or Timeline
- Quantitative insight                  -> FreeformSlide + BigNumber/StatCard/BarChart/ProgressRing
- Prioritisation / two axes             -> FreeformSlide + Matrix2x2
- Facts vs misconceptions               -> FreeformSlide + MythFact
- Trade-offs                            -> FreeformSlide + ProsCons / DataTable
- Change over time / levels             -> FreeformSlide + BeforeAfter / Ladder / Funnel
- Terms, notes, sources                 -> Glossary / Footnote / SourceNote (usually as extras)
- Branching decision                    -> FreeformSlide + Flow with fork
- Audience interaction                  -> QACard / PollCard / SwipeHint
- Quote / mental model                  -> FreeformSlide + QuoteCard
- Process over time                     -> FreeformSlide + Timeline
- Conceptual relationship / mechanism   -> FreeformSlide + DiagramNode/Connector
- Practical actions                     -> FreeformSlide + Checklist/Callout
- Mixed editorial composition           -> FreeformSlide
- Final synthesis                       -> SummarySlide
- Closing action                        -> CTASlide

ANTI-TEMPLATE RULES
- Do NOT use the same preset for more than 2 slides unless unavoidable.
- Do NOT make more than 2 consecutive slides dominated by identical card grids.
- Do NOT force every idea into numbered circles/cards.
- Vary density intentionally across the carousel.
- Vary composition: statement, contrast, process, diagram, freeform, summary.
- Do not append keyword chips to statements merely to repeat the text.
- Background words / lines / shapes must support hierarchy or meaning; avoid
  arbitrary decoration.
- Prefer one strong idea per slide over adding text merely to fill space.
- If a slide feels empty, improve hierarchy/composition before adding copy.
- If content is dense, reduce text or choose compact density instead of
  overflowing the footer/safe area.
- Keep visual rhythm coherent: some slides may breathe, others may be dense.
- Use connectors only when they communicate a real relationship.
- For cause/effect or vertical sequences, prefer a downward arrow.

COPY RULES
- Natural Indonesian unless the user asks otherwise.
- Headline should be concise enough to read quickly.
- Avoid captions that simply repeat every slide.
- CTA should match the publishing objective.
- Hashtags/keywords should be relevant rather than padded with generic terms.

REQUIRED PAGE STRUCTURE
<main className="carousel-stage" data-platform={platform} ...>
  <PostMetaPanel {...postMeta} />
  <PlatformSwitcher ... />
  ...exportable slides...
</main>

IMPORTANT
PostMetaPanel and PlatformSwitcher are studio UI and are NOT exported as JPEG.
Only components ultimately rendered through CarouselCanvas carry
data-carousel-slide and are exported.
===============================================================================
*/

import {
  AccentLine, AvatarQuote, BarChart, BeforeAfter, BigNumber, BulletSlide, Callout,
  CauseEffectSlide, Checklist, Collage, CompareSlide, Connector, ContentGrid, CTASlide,
  DataTable, DiagramNode, Divider, Flow, Footnote, FrameworkSlide, FreeformSlide, Funnel,
  Glossary, HeroSlide, InfoCard, KeywordCluster, Ladder, Matrix2x2, MiniDiagram, MythFact,
  PhoneMockup, PhotoHero, Pill, PlatformSwitcher, PollCard, PostMetaPanel, ProgressRing,
  ProsCons, QACard, QuoteCard, SlideHeading, SourceNote, Stack, StatCard, StatementSlide,
  SummarySlide, SwipeHint, TextBlock, ThreeColumn, Timeline, TwoColumn,
} from "@/components/carousel";
import { AssetIcon, AssetShape } from "@/components/studio/AssetPrimitives";

export const metadata = {
  title: "Demo Carousel | Aksioma Content Studio",
};

const postMeta = {
  title: "Critical Thinking — Jangan Buru-buru Yakin",
  objective: "Save + share",
  contentPillar: "Critical Thinking",
  hook: "Pendapat yang terdengar yakin belum tentu benar.",
  instagramCaption:
    "Kita sering merasa sebuah pendapat benar hanya karena penjelasannya terdengar masuk akal. Padahal rasa yakin bukan bukti.\n\nCarousel ini membedah cara sederhana untuk memisahkan fakta, interpretasi, asumsi, dan kesimpulan agar kita tidak terlalu cepat percaya pada pikiran sendiri.",
  tiktokCaption:
    "Merasa yakin ≠ sudah benar. Coba 5 pertanyaan ini sebelum menerima sebuah klaim.",
  cta: "Simpan framework-nya dan pakai saat membaca berita, rapat, mengambil keputusan, atau berdebat.",
  hashtags: ["CriticalThinking", "BerpikirKritis", "SelfDevelopment", "Aksioma"],
  keywords: ["critical thinking", "logic", "bias", "decision making", "argument"],
  notes:
    "Prioritaskan cover dengan hook kuat. Untuk TikTok, cek mode safe area sebelum posting. Hindari caption yang hanya mengulang seluruh isi carousel.",
};

export default async function DemoCarouselPage({ searchParams }) {
  const params = await searchParams;
  const platform = params?.platform === "tiktok" ? "tiktok" : "instagram";
  const safeArea = platform === "tiktok" && params?.safe === "1";

  return (
    <main
      className="carousel-stage"
      data-platform={platform}
      data-safe-area={safeArea ? "true" : "false"}
    >
      <PostMetaPanel {...postMeta} />

      <PlatformSwitcher route="/carousel/demo" platform={platform} safeArea={safeArea} />

      {/* 1. Cover — tanpa theme/decorations/extras. */}
      <HeroSlide
        slide={1}
        eyebrow="Critical Thinking"
        title="Pendapat yang terdengar yakin belum tentu benar."
        subtitle="Masalahnya sering bukan kurang informasi, tetapi kita berhenti menguji begitu sebuah penjelasan terasa masuk akal."
        density="bold"
      />

      {/* 2. Statement: tema terang + dekorasi + extras berisi info BARU. */}
      <StatementSlide
        slide={2}
        eyebrow="Masalah awal"
        lead="Otak menyukai jawaban cepat. Karena itu kita sering menganggap sesuatu"
        highlight="benar hanya karena terasa masuk akal."
        note="Rasa yakin adalah pengalaman psikologis. Ia bukan bukti bahwa kesimpulan kita sudah melewati pengujian."
        density="bold"
        theme="ivory"
        vertical="center"
        backgroundWord="THINK"
        cornerLabel="Pause / Test"
        decorations={<AssetShape name="orbital-rings" position="topRight" opacity="subtle" />}
        extras={<SourceNote label="Sumber" text="Kahneman, Thinking, Fast and Slow (2011)." />}
      />

      {/* 3. Bullet: tema gelap (wajib untuk bullet/causeEffect/summary) + Callout. */}
      <BulletSlide
        slide={3}
        eyebrow="Pisahkan dulu"
        title="Satu klaim biasanya berisi tiga lapisan yang berbeda."
        density="balanced"
        theme="midnight"
        vertical="spread"
        backgroundWord="BREAK"
        cornerLabel="3 layers"
        decorations={<AssetShape name="contour-lines" position="bottomRight" opacity="subtle" />}
        items={[
          { title: "Fakta", text: "Apa yang benar-benar dapat diamati, diukur, atau diverifikasi." },
          { title: "Interpretasi", text: "Makna yang kita berikan terhadap fakta tersebut." },
          { title: "Kesimpulan", text: "Keputusan akhir yang kita tarik dari interpretasi itu." },
        ]}
        extras={
          <Callout label="Cek cepat" dark>
            Tanyakan pada tiap kalimat: ini fakta, tafsiran, atau keputusan?
          </Callout>
        }
      />

      {/* 4. Compare: keywords + extras MiniDiagram (alur baru, bukan pengulangan). */}
      <CompareSlide
        slide={4}
        title="Berpikir cepat dan berpikir kritis bukan hal yang sama."
        density="balanced"
        theme="sand"
        vertical="stretch"
        backgroundWord="VS"
        cornerLabel="Contrast"
        keywords={["intuisi", "bukti", "uji"]}
        left={{
          label: "Refleks",
          heading: "Langsung percaya",
          points: ["Cocok dengan intuisi saya.", "Banyak orang mengatakannya.", "Penjelasannya terdengar sederhana."],
        }}
        right={{
          label: "Uji",
          heading: "Tahan kesimpulan",
          points: ["Apa bukti yang mendukung klaim ini?", "Asumsi apa yang sedang saya pakai?", "Apa penjelasan alternatifnya?"],
        }}
        extras={<MiniDiagram items={["Klaim", "Bukti", "Uji", "Putusan"]} />}
      />

      {/* 5. CauseEffect (gelap) + Footnote sebagai catatan metodologi. */}
      <CauseEffectSlide
        slide={5}
        causeTitle="Kesimpulan datang terlalu awal"
        causeText="Begitu menemukan cerita yang terasa koheren, kita berhenti mencari informasi yang bisa membantahnya."
        effectTitle="Keyakinan menjadi lebih kuat daripada bukti"
        effectText="Kita lalu membela kesimpulan awal, bukan lagi mencoba memahami apa yang sebenarnya terjadi."
        chainLabel="Pola yang terjadi"
        chainCaption="dari asumsi → menjadi keyakinan"
        chain={[
          { title: "Kesimpulan cepat", note: "Cerita terasa masuk akal, lalu dianggap cukup." },
          { title: "Cari konfirmasi", note: "Fokus bergeser ke informasi yang mendukung keyakinan awal." },
          { title: "Keyakinan mengeras", note: "Kesimpulan awal semakin sulit direvisi." },
        ]}
        density="balanced"
        theme="navy"
        vertical="center"
        backgroundWord="WHY"
        cornerLabel="Mechanism"
        extras={<Footnote dark items={["Pola ini dikenal sebagai confirmation bias."]} />}
      />

      {/* 6. Statement kedua: tema gelap lewat FreeformSlide-nya preset tidak perlu; pakai graphite? Statement tetap terang. */}
      <StatementSlide
        slide={6}
        eyebrow="Reframe"
        lead="Tujuan critical thinking bukan menjadi orang yang selalu skeptis. Tujuannya adalah"
        highlight="memberi tingkat keyakinan sesuai kualitas bukti."
        note="Kita tetap boleh mengambil keputusan, tetapi dengan sadar membedakan apa yang kita tahu, duga, dan belum tahu."
        density="bold"
        theme="lemon"
        backgroundWord="PROOF"
        cornerLabel="Reframe"
        decorations={<AssetShape name="sunburst" position="bottomLeft" opacity="subtle" />}
      />

      {/* 7. Framework compact + extras Glossary (istilah yang belum dijelaskan). */}
      <FrameworkSlide
        slide={7}
        title="Gunakan lima pertanyaan sebelum menerima sebuah klaim."
        density="compact"
        theme="paper"
        vertical="top"
        backgroundWord="TEST"
        cornerLabel="5 questions"
        keywords={["claim", "evidence", "assumption", "alternative", "test"]}
        steps={[
          { title: "Claim", text: "Apa tepatnya yang sedang dinyatakan?" },
          { title: "Evidence", text: "Bukti apa yang benar-benar mendukungnya?" },
          { title: "Assumption", text: "Apa yang harus dianggap benar agar argumen ini bekerja?" },
          { title: "Alternative", text: "Adakah penjelasan lain yang juga cocok dengan fakta?" },
          { title: "Test", text: "Informasi apa yang dapat membedakan penjelasan-penjelasan itu?" },
        ]}
      />

      {/* 8. Angka: BigNumber + StatCard + ProgressRing + BarChart (data primitives). */}
      <FreeformSlide slide={8} eyebrow="Data" theme="ice" density="balanced" backgroundWord="DATA" cornerLabel="Contoh angka" vertical="center">
        <SlideHeading title="Rasa yakin sering melampaui ketelitian." body="Angka di bawah hanyalah contoh ilustrasi; ganti dengan data yang bisa diverifikasi." />
        <TwoColumn className="mt-8 items-center">
          <BigNumber value="72%" label="merasa yakin" />
          <ProgressRing value={48} label="benar-benar akurat" note="Contoh angka" />
        </TwoColumn>
        <BarChart
          className="mt-8"
          unit="%"
          items={[
            { label: "Yakin & benar", value: 48 },
            { label: "Yakin tapi salah", value: 24 },
            { label: "Ragu & benar", value: 18 },
          ]}
        />
        <StatCard className="mt-6" value="2,4×" label="lebih sering keliru saat terlalu yakin" note="Ilustrasi; bukan hasil riset." />
      </FreeformSlide>

      {/* 9. Matriks 2×2 + TextBlock. */}
      <FreeformSlide slide={9} eyebrow="Prioritas" theme="mint" density="balanced" backgroundWord="2×2" vertical="center">
        <SlideHeading title="Tidak semua klaim layak diuji sama dalamnya." />
        <Matrix2x2
          className="mt-8"
          xAxis={{ low: "Mudah diuji", high: "Sulit diuji" }}
          yAxis={{ low: "Dampak kecil", high: "Dampak besar" }}
          quadrants={[
            { title: "Uji dulu", text: "Dampak besar, mudah dicek." },
            { title: "Rencanakan", text: "Dampak besar, butuh riset." },
            { title: "Cek sekilas", text: "Dampak kecil, mudah dicek." },
            { title: "Lewati", text: "Dampak kecil, mahal dicek." },
          ]}
        />
        <TextBlock className="mt-8" label="Aturan praktis" text="Makin besar taruhannya dan makin murah mengeceknya, makin wajib kamu mengujinya." size="md" />
      </FreeformSlide>

      {/* 10. Tabel + MythFact. */}
      <FreeformSlide slide={10} eyebrow="Bandingkan" theme="lilac" density="compact" backgroundWord="MYTH" vertical="top">
        <SlideHeading title="Tiga mitos tentang berpikir kritis." />
        <MythFact
          className="mt-7"
          items={[
            { myth: "Berpikir kritis berarti curiga pada semua hal.", fact: "Ia berarti menakar keyakinan sesuai bukti." },
            { myth: "Orang pintar pasti terhindar dari bias.", fact: "Kecerdasan justru bisa memperkuat pembenaran." },
            { myth: "Cukup baca lebih banyak.", fact: "Tanpa kriteria uji, bacaan hanya menambah konfirmasi." },
          ]}
        />
        <DataTable
          className="mt-7"
          columns={["Aspek", "Refleks", "Uji"]}
          rows={[
            { cells: ["Kecepatan", "Cepat", "Lebih lambat"] },
            { cells: ["Dasar", "Firasat", "Bukti"] },
            { cells: ["Risiko bias", "Tinggi", "Lebih rendah"] },
          ]}
        />
      </FreeformSlide>

      {/* 11. Untung-rugi + sebelum-sesudah. */}
      <FreeformSlide slide={11} eyebrow="Kebiasaan" theme="peach" density="balanced" backgroundWord="LOG" vertical="center">
        <SlideHeading title="Mencatat keputusan: sedikit repot, banyak manfaat." />
        <ProsCons
          className="mt-8"
          proLabel="Untung"
          conLabel="Rugi"
          pros={["Keputusan lebih terdokumentasi", "Mudah dievaluasi ulang"]}
          cons={["Butuh waktu ekstra", "Tidak cocok untuk hal sepele"]}
        />
        <BeforeAfter
          className="mt-8"
          before={{ label: "SEBELUM", title: "Catatan acak", text: "Keputusan tersebar di banyak tempat." }}
          after={{ label: "SESUDAH", title: "Satu jurnal", text: "Setiap keputusan punya alasan tertulis." }}
        />
      </FreeformSlide>

      {/* 12. Corong + tangga (tema gelap). */}
      <FreeformSlide slide={12} eyebrow="Proses" theme="graphite" density="balanced" backgroundWord="FILTER" vertical="spread"
        decorations={<AssetShape name="dotted-field" position="bottomRight" opacity="subtle" />}>
        <SlideHeading dark title="Dari banyak ide menjadi satu yang diuji." />
        <Funnel
          dark
          className="mt-8"
          items={[
            { label: "Banyak ide", note: "Semua ditampung" },
            { label: "Disaring", note: "Pakai kriteria" },
            { label: "Dipilih", note: "Satu yang diuji" },
          ]}
        />
        <Ladder
          dark
          className="mt-8"
          items={[
            { label: "Mahir", note: "Konsisten tanpa diingatkan" },
            { label: "Berkembang", note: "Mulai punya sistem", current: true },
            { label: "Pemula", note: "Masih mencoba-coba" },
          ]}
        />
      </FreeformSlide>

      {/* 13. Alur berlabel + glosarium + catatan kaki. */}
      <FreeformSlide slide={13} eyebrow="Mekanisme" theme="paper" density="balanced" backgroundWord="FLOW" vertical="center">
        <SlideHeading title="Dari berita ke keputusan: di mana kamu bisa berhenti?" />
        <Flow
          className="mt-8"
          items={[{ label: "Berita", via: "memicu" }, { label: "Panik", via: "lalu" }, { label: "Reaksi" }]}
          fork={[{ via: "Jika reaktif", label: "Kunci rugi" }, { via: "Jika terukur", label: "Tinjau rencana" }]}
        />
        <Glossary
          className="mt-8"
          items={[
            { term: "Bias konfirmasi", meaning: "Kecenderungan mencari bukti yang mendukung keyakinan awal." },
            { term: "Asumsi", meaning: "Anggapan yang dipakai tanpa dibuktikan." },
          ]}
        />
        <Footnote className="mt-6" items={["Istilah disederhanakan untuk pembaca awam."]} />
      </FreeformSlide>

      {/* 14. Kutipan, avatar, timeline, diagram + konektor. */}
      <FreeformSlide slide={14} eyebrow="Cerita" theme="blush" density="balanced" backgroundWord="STORY" vertical="center">
        <QuoteCard quote="Masalahnya bukan apa yang tidak kita tahu, melainkan apa yang kita yakin padahal keliru." source="Sering dikaitkan dengan Mark Twain" />
        <Timeline
          className="mt-6"
          items={[
            { title: "Hari 1", text: "Catat klaim yang kamu percaya." },
            { title: "Hari 3", text: "Cari satu bukti yang membantahnya." },
            { title: "Hari 7", text: "Revisi tingkat keyakinanmu." },
          ]}
        />
        <Stack className="mt-6" gap="gap-3">
          <DiagramNode title="Klaim awal" body="Apa yang kamu yakini." />
          <Connector direction="down" label="diuji" />
          <DiagramNode title="Keyakinan baru" body="Sesuai bukti." accent />
        </Stack>
      </FreeformSlide>

      {/* 15. Visual dengan slot gambar (kosong di JSX; di Studio diisi lewat `images`). */}
      <FreeformSlide slide={15} eyebrow="Visual" theme="paper" density="balanced" backgroundWord="LOOK" vertical="center">
        <PhotoHero size="sm" shape="rounded" title="Judul foto" text="Caption singkat." />
        <ThreeColumn className="mt-6 items-start">
          <PhoneMockup size="sm" caption="Layar A" />
          <Collage size="sm" items={[{ caption: "A" }, { caption: "B" }]} />
          <InfoCard variant="outline" title="Slot">Isi gambar lewat Studio.</InfoCard>
        </ThreeColumn>
      </FreeformSlide>

      {/* 16. Ikon, pill, kluster kata kunci, pembagi, grid. */}
      <FreeformSlide slide={16} eyebrow="Ringkas" theme="ivory" density="airy" backgroundWord="ICONS" vertical="center"
        decorations={<AssetShape name="editorial-grid" position="full" opacity="subtle" />}>
        <SlideHeading title="Tiga alat sederhana yang bisa dipakai hari ini." />
        <ContentGrid columns={3} className="mt-8">
          <AssetIcon set="lucide" name="search" size="md" label="Cari bukti" />
          <AssetIcon set="lucide" name="scale" size="md" label="Timbang" />
          <AssetIcon set="phosphor" name="check-circle" size="md" tone="accent" label="Putuskan" />
        </ContentGrid>
        <Divider className="my-8" />
        <Pill>Mulai dari yang kecil</Pill>
        <KeywordCluster className="mt-6" items={["bukti", "asumsi", "alternatif", "uji", "revisi"]} />
        <Checklist className="mt-6" items={["Tulis klaimnya.", "Cari satu bantahan.", "Putuskan dengan sadar."]} />
        <AccentLine className="mt-6" />
      </FreeformSlide>

      {/* 17. Tanya-jawab + polling + petunjuk geser. */}
      <FreeformSlide slide={17} eyebrow="Interaksi" theme="sand" density="balanced" backgroundWord="ASK" vertical="spread">
        <QACard
          items={[
            { q: "Apakah harus menunggu data lengkap?", a: "Tidak. Tentukan batas minimum bukti, lalu putuskan." },
            { q: "Bagaimana kalau salah?", a: "Catat alasannya, evaluasi, dan perbaiki langkah berikutnya." },
          ]}
        />
        <PollCard className="mt-8" question="Kamu paling sering memutuskan dengan…" options={["Firasat", "Data", "Saran orang lain"]} cta="Komentar A, B, atau C" />
        <AvatarQuote className="mt-8" quote="Saya baru sadar saya membela kesimpulan, bukan menguji." name="Rina" role="Analis" />
        <SwipeHint className="mt-6" text="Geser" align="right" />
      </FreeformSlide>

      {/* 18. Rangkuman (gelap). */}
      <SummarySlide
        slide={18}
        title="Empat kebiasaan yang membuat pikiran lebih sulit dibohongi."
        density="balanced"
        theme="graphite"
        backgroundWord="KEEP"
        cornerLabel="Takeaway"
        keywords={["fact", "assumption", "alternative", "confidence"]}
        items={[
          "Pisahkan fakta dari interpretasi.",
          "Cari asumsi yang tersembunyi.",
          "Bangun penjelasan alternatif.",
          "Sesuaikan keyakinan dengan bukti.",
        ]}
      />

      {/* 19. Penutup — tanpa theme/decorations/extras. */}
      <CTASlide
        slide={19}
        title="Jangan buru-buru yakin."
        body="Pendapat yang kuat bukan pendapat yang paling keras, tetapi pendapat yang tahu mengapa ia layak dipercaya dan kapan ia harus direvisi."
        cta="Simpan framework ini. Pakai lagi saat membaca berita, rapat, mengambil keputusan, atau berdebat."
        density="bold"
        backgroundWord="SAVE"
        cornerLabel="Takeaway"
        keywords={["save", "apply", "review"]}
      />
    </main>
  );
}
