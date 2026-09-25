import {
  BulletSlide,
  CauseEffectSlide,
  CompareSlide,
  CTASlide,
  FrameworkSlide,
  HeroSlide,
  PlatformSwitcher,
  PostMetaPanel,
  StatementSlide,
  SummarySlide,
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
  cta: "Simpan framework-nya dan pakai saat membaca berita, rapat, mengambil keputusan, atau berdebat.",
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
          { title: "Fakta", text: "Apa yang benar-benar dapat diamati, diukur, atau diverifikasi." },
          { title: "Interpretasi", text: "Makna yang kita berikan terhadap fakta tersebut." },
          { title: "Kesimpulan", text: "Keputusan akhir yang kita tarik dari interpretasi itu." },
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
          { title: "Evidence", text: "Bukti apa yang benar-benar mendukungnya?" },
          { title: "Assumption", text: "Apa yang harus dianggap benar agar argumen ini bekerja?" },
          { title: "Alternative", text: "Adakah penjelasan lain yang juga cocok dengan fakta?" },
          { title: "Test", text: "Informasi apa yang dapat membedakan penjelasan-penjelasan itu?" },
        ]}
      />

      <BulletSlide
        slide={8}
        eyebrow="Praktik"
        title="Saat berdebat, ubah fokus dari memenangkan argumen menjadi menguji argumen."
        density="balanced"
        items={[
          { title: "Minta definisi", text: "Pastikan kalian membicarakan hal yang sama sebelum berdebat panjang." },
          { title: "Cari titik bukti", text: "Tanyakan data apa yang jika berubah akan mengubah kesimpulan." },
          { title: "Nyatakan confidence", text: "Bedakan 'saya yakin' dari 'bukti yang tersedia cukup kuat'." },
        ]}
      />

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
