import SlideShell from "./SlideShell";

export default function CauseEffectSlide({
  slide,
  causeTitle,
  causeText,
  effectTitle,
  effectText,
  density = "balanced",
}) {
  const chain = [
    {
      index: "01",
      title: "Kesimpulan cepat",
      note: "Cerita terasa masuk akal, lalu dianggap cukup.",
    },
    {
      index: "02",
      title: "Cari konfirmasi",
      note: "Fokus bergeser ke informasi yang mendukung keyakinan awal.",
    },
    {
      index: "03",
      title: "Keyakinan mengeras",
      note: "Kesimpulan awal semakin sulit direvisi.",
    },
  ];

  return (
    <SlideShell
      slide={slide}
      eyebrow="Cause → Effect"
      dark
      type="cause-effect"
      density={density}
      backgroundWord="WHY"
      cornerLabel="Mechanism"
    >
      <div className="cause-effect-wrap">
        <div className="cause-effect-card border-white/10 bg-white/[0.045]">
          <p className="font-display text-[18px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Penyebab
          </p>
          <h2>{causeTitle}</h2>
          <p className="text-zinc-400">{causeText}</p>
        </div>

        <div className="cause-effect-rail" aria-hidden="true">
          <span className="cause-effect-arrow">→</span>
        </div>

        <div className="cause-effect-card border-red-400/25 bg-gradient-to-br from-red-500/15 to-orange-400/5">
          <p className="font-display text-[18px] font-semibold uppercase tracking-[0.15em] text-red-400">
            Dampak
          </p>
          <h2>{effectTitle}</h2>
          <p className="text-zinc-300">{effectText}</p>
        </div>
      </div>

      <div className="cause-effect-chain">
        <div className="cause-effect-chain-head">
          <p className="cause-effect-chain-label">Pola yang terjadi</p>
          <span className="cause-effect-chain-caption">dari asumsi → menjadi keyakinan</span>
        </div>

        <div className="cause-effect-chain-grid">
          {chain.map((item, index) => (
            <div key={item.index} className="cause-effect-step">
              <div className="cause-effect-step-top">
                <span className="cause-effect-step-index">{item.index}</span>
                <span className="cause-effect-step-dot" aria-hidden="true" />
              </div>
              <h3 className="cause-effect-step-title">{item.title}</h3>
              <p className="cause-effect-step-note">{item.note}</p>

              {index < chain.length - 1 ? (
                <span className="cause-effect-step-connector" aria-hidden="true">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
