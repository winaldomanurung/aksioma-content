/*
===============================================================================
AKSIOMA CAROUSEL — AI AUTHORING CONTRACT
===============================================================================

PURPOSE
This file is intentionally self-documenting. If this entire page.jsx is pasted
into an AI together with a topic/request, the AI should be able to return ONE
complete replacement page.jsx that is ready to paste into this repo and export.

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
- TikTok: 1080×1920 (9:16)
- The SAME JSX content renders both platforms.
- TikTok layout/safe area are handled by the design system.
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
1) HeroSlide
   HeroSlide({
     slide, eyebrow, title, subtitle,
     accent?, density?
   })
   USE FOR: opening hook / cover.

2) StatementSlide
   StatementSlide({
     slide, eyebrow?, lead, highlight, note?,
     density?, keywords?
   })
   USE FOR: one provocative idea, reframe, misconception, principle.

3) BulletSlide
   BulletSlide({
     slide, eyebrow?, title,
     items: [{ title, text }],
     density?
   })
   USE FOR: 3–5 parallel points that genuinely belong in a list.

4) CompareSlide
   CompareSlide({
     slide, eyebrow?, title,
     left: { label, heading, points: [] },
     right: { label, heading, points: [] },
     density?
   })
   USE FOR: true contrast, before/after, wrong/right, A/B.

5) CauseEffectSlide
   CauseEffectSlide({
     slide, causeTitle, causeText,
     effectTitle, effectText,
     density?
   })
   USE FOR: one clear causal relationship.

6) FrameworkSlide
   FrameworkSlide({
     slide, eyebrow?, title,
     steps: [{ title, text }],
     density?
   })
   USE FOR: named framework, checklist-like method, ordered questions.

7) SummarySlide
   SummarySlide({
     slide, title, items: [], density?
   })
   USE FOR: synthesis near the end, not as a generic list replacement.

8) CTASlide
   CTASlide({
     slide, title, body, cta?, density?
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

LAYOUT NOTE
TwoColumn, ThreeColumn and multi-column ContentGrid automatically collapse to
one column in TikTok mode. Prefer these over hand-written fixed grids when
content is important.

INFORMATION -> VISUAL MAPPING
- Opening promise / tension             -> HeroSlide
- One sharp idea / reframe              -> StatementSlide
- Parallel list                         -> BulletSlide
- Two-sided contrast                    -> CompareSlide
- Cause -> consequence                  -> CauseEffectSlide
- Ordered method/questions              -> FrameworkSlide or Timeline
- Quantitative insight                  -> FreeformSlide + BigNumber/StatCard
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
  BulletSlide,
  Callout,
  CauseEffectSlide,
  Checklist,
  CompareSlide,
  CTASlide,
  FrameworkSlide,
  FreeformSlide,
  HeroSlide,
  InfoCard,
  PlatformSwitcher,
  PostMetaPanel,
  SlideHeading,
  StatementSlide,
  SummarySlide,
  TwoColumn,
} from "@/components/carousel";

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
  cta:
    "Simpan framework-nya dan pakai saat membaca berita, rapat, mengambil keputusan, atau berdebat.",
  hashtags: [
    "CriticalThinking",
    "BerpikirKritis",
    "SelfDevelopment",
    "Aksioma",
  ],
  keywords: [
    "critical thinking",
    "logic",
    "bias",
    "decision making",
    "argument",
  ],
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

      <PlatformSwitcher
        route="/carousel/demo"
        platform={platform}
        safeArea={safeArea}
      />

      <HeroSlide
        slide={1}
        eyebrow="Critical Thinking"
        title="Pendapat yang terdengar yakin belum tentu benar."
        subtitle="Masalahnya sering bukan kurang informasi, tetapi kita berhenti menguji begitu sebuah penjelasan terasa masuk akal."
        density="bold"
      />

      <StatementSlide
        slide={2}
        eyebrow="Masalah awal"
        lead="Otak menyukai jawaban cepat. Karena itu kita sering menganggap sesuatu"
        highlight="benar hanya karena terasa masuk akal."
        note="Rasa yakin adalah pengalaman psikologis. Ia bukan bukti bahwa kesimpulan kita sudah melewati pengujian."
        density="bold"
        keywords={["rasa yakin", "intuisi", "bukti"]}
      />

      <BulletSlide
        slide={3}
        eyebrow="Pisahkan dulu"
        title="Satu klaim biasanya berisi tiga lapisan yang berbeda."
        density="balanced"
        items={[
          {
            title: "Fakta",
            text: "Apa yang benar-benar dapat diamati, diukur, atau diverifikasi.",
          },
          {
            title: "Interpretasi",
            text: "Makna yang kita berikan terhadap fakta tersebut.",
          },
          {
            title: "Kesimpulan",
            text: "Keputusan akhir yang kita tarik dari interpretasi itu.",
          },
        ]}
      />

      <CompareSlide
        slide={4}
        title="Berpikir cepat dan berpikir kritis bukan hal yang sama."
        density="balanced"
        left={{
          label: "Refleks",
          heading: "Langsung percaya",
          points: [
            "Cocok dengan intuisi saya.",
            "Banyak orang mengatakannya.",
            "Penjelasannya terdengar sederhana.",
          ],
        }}
        right={{
          label: "Uji",
          heading: "Tahan kesimpulan",
          points: [
            "Apa bukti yang mendukung klaim ini?",
            "Asumsi apa yang sedang saya pakai?",
            "Apa penjelasan alternatifnya?",
          ],
        }}
      />

      <CauseEffectSlide
        slide={5}
        causeTitle="Kesimpulan datang terlalu awal"
        causeText="Begitu menemukan cerita yang terasa koheren, kita berhenti mencari informasi yang bisa membantahnya."
        effectTitle="Keyakinan menjadi lebih kuat daripada bukti"
        effectText="Kita lalu membela kesimpulan awal, bukan lagi mencoba memahami apa yang sebenarnya terjadi."
        density="balanced"
      />

      <StatementSlide
        slide={6}
        eyebrow="Reframe"
        lead="Tujuan critical thinking bukan menjadi orang yang selalu skeptis. Tujuannya adalah"
        highlight="memberi tingkat keyakinan sesuai kualitas bukti."
        note="Kita tetap boleh mengambil keputusan, tetapi dengan sadar membedakan apa yang kita tahu, duga, dan belum tahu."
        density="bold"
        keywords={["confidence", "evidence", "revision"]}
      />

      <FrameworkSlide
        slide={7}
        title="Gunakan lima pertanyaan sebelum menerima sebuah klaim."
        density="compact"
        steps={[
          { title: "Claim", text: "Apa tepatnya yang sedang dinyatakan?" },
          {
            title: "Evidence",
            text: "Bukti apa yang benar-benar mendukungnya?",
          },
          {
            title: "Assumption",
            text: "Apa yang harus dianggap benar agar argumen ini bekerja?",
          },
          {
            title: "Alternative",
            text: "Adakah penjelasan lain yang juga cocok dengan fakta?",
          },
          {
            title: "Test",
            text: "Informasi apa yang dapat membedakan penjelasan-penjelasan itu?",
          },
        ]}
      />

      <FreeformSlide
        slide={8}
        eyebrow="Praktik"
        density="balanced"
        backgroundWord="TEST"
        cornerLabel="Debate / Practice"
      >
        <SlideHeading
          title="Ubah tujuan debat: bukan menang, tetapi menguji."
          body="Tiga kebiasaan ini membuat diskusi lebih tajam tanpa membuatmu sekadar terdengar keras."
        />

        <TwoColumn className="mt-10 items-start">
          <InfoCard eyebrow="Sebelum berargumen" title="Pastikan definisinya sama" variant="accent">
            Banyak debat sebenarnya hanya dua orang memakai kata yang sama untuk makna yang berbeda.
          </InfoCard>

          <div className="rounded-[32px] border border-black/10 bg-white/45 p-8">
            <Checklist
              items={[
                "Minta definisi istilah yang ambigu.",
                "Cari bukti yang bisa mengubah kesimpulan.",
                "Nyatakan tingkat keyakinan, bukan sekadar keyakinan.",
              ]}
            />
          </div>
        </TwoColumn>

        <Callout label="Mindset" className="mt-9">
          Argumen yang baik harus punya kondisi yang membuat kita bersedia merevisinya.
        </Callout>
      </FreeformSlide>

      <SummarySlide
        slide={9}
        title="Empat kebiasaan yang membuat pikiran lebih sulit dibohongi."
        density="balanced"
        items={[
          "Pisahkan fakta dari interpretasi.",
          "Cari asumsi yang tersembunyi.",
          "Bangun penjelasan alternatif.",
          "Sesuaikan keyakinan dengan bukti.",
        ]}
      />

      <CTASlide
        slide={10}
        title="Jangan buru-buru yakin."
        body="Pendapat yang kuat bukan pendapat yang paling keras, tetapi pendapat yang tahu mengapa ia layak dipercaya dan kapan ia harus direvisi."
        cta="Simpan framework ini. Pakai lagi saat membaca berita, rapat, mengambil keputusan, atau berdebat."
        density="bold"
      />
    </main>
  );
}
