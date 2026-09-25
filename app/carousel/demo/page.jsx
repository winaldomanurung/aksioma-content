import {
  BulletSlide,
  CauseEffectSlide,
  CompareSlide,
  CTASlide,
  FrameworkSlide,
  HeroSlide,
  StatementSlide,
  SummarySlide,
} from "@/components/carousel";

export const metadata = {
  title: "Demo Carousel | Aksioma Content Studio",
};

export default function DemoCarouselPage() {
  return (
    <main className="carousel-stage">
      <div className="studio-only w-[1080px] rounded-3xl border border-black/10 bg-white/70 p-6 text-zinc-700 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">Preview mode</p>
        <p className="mt-2 text-lg">
          Semua slide di bawah adalah canvas asli 1080 × 1350 px. Exporter mengambil
          elemen yang sama, bukan membuat desain ulang.
        </p>
      </div>

      <HeroSlide
        slide={1}
        eyebrow="Critical Thinking"
        title="Pendapat yang terdengar yakin belum tentu benar."
        subtitle="Masalahnya sering bukan kurang informasi, tetapi kita berhenti menguji begitu sebuah penjelasan terasa masuk akal."
      />

      <StatementSlide
        slide={2}
        eyebrow="Masalah awal"
        lead="Otak menyukai jawaban cepat. Karena itu kita sering menganggap sesuatu"
        highlight="benar hanya karena terasa masuk akal."
        note="Rasa yakin adalah pengalaman psikologis. Ia bukan bukti bahwa kesimpulan kita sudah melewati pengujian."
      />

      <BulletSlide
        slide={3}
        eyebrow="Pisahkan dulu"
        title="Satu klaim biasanya berisi tiga lapisan yang berbeda."
        items={[
          { title: "Fakta", text: "Apa yang benar-benar dapat diamati, diukur, atau diverifikasi." },
          { title: "Interpretasi", text: "Makna yang kita berikan terhadap fakta tersebut." },
          { title: "Kesimpulan", text: "Keputusan akhir yang kita tarik dari interpretasi itu." },
        ]}
      />

      <CompareSlide
        slide={4}
        title="Berpikir cepat dan berpikir kritis bukan hal yang sama."
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
      />

      <CauseEffectSlide
        slide={5}
        causeTitle="Kesimpulan datang terlalu awal"
        causeText="Begitu menemukan cerita yang terasa koheren, kita berhenti mencari informasi yang bisa membantahnya."
        effectTitle="Keyakinan menjadi lebih kuat daripada bukti"
        effectText="Kita lalu membela kesimpulan awal, bukan lagi mencoba memahami apa yang sebenarnya terjadi."
      />

      <StatementSlide
        slide={6}
        eyebrow="Reframe"
        lead="Tujuan critical thinking bukan menjadi orang yang selalu skeptis. Tujuannya adalah"
        highlight="memberi tingkat keyakinan sesuai kualitas bukti."
        note="Kita tetap boleh mengambil keputusan, tetapi dengan sadar membedakan apa yang kita tahu, duga, dan belum tahu."
      />

      <FrameworkSlide
        slide={7}
        title="Gunakan lima pertanyaan sebelum menerima sebuah klaim."
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
        items={[
          { title: "Minta definisi", text: "Pastikan kalian membicarakan hal yang sama sebelum berdebat panjang." },
          { title: "Cari titik bukti", text: "Tanyakan data apa yang jika berubah akan mengubah kesimpulan." },
          { title: "Nyatakan confidence", text: "Bedakan 'saya yakin' dari 'bukti yang tersedia cukup kuat'." },
        ]}
      />

      <SummarySlide
        slide={9}
        title="Empat kebiasaan yang membuat pikiran lebih sulit dibohongi."
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
      />
    </main>
  );
}
