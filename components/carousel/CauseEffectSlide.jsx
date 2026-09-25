import MiniDiagram from "./MiniDiagram";
import SlideShell from "./SlideShell";

export default function CauseEffectSlide({
  slide,
  causeTitle,
  causeText,
  effectTitle,
  effectText,
  density = "balanced",
}) {
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

        <div className="cause-effect-rail">
          <div className="relative z-10 flex h-[64px] w-[64px] items-center justify-center rounded-full border border-red-400/50 bg-zinc-950 text-[30px] text-red-400">
            ↓
          </div>
        </div>

        <div className="cause-effect-card border-red-400/25 bg-gradient-to-br from-red-500/15 to-orange-400/5">
          <p className="font-display text-[18px] font-semibold uppercase tracking-[0.15em] text-red-400">
            Dampak
          </p>
          <h2>{effectTitle}</h2>
          <p className="text-zinc-300">{effectText}</p>
        </div>
      </div>

      <MiniDiagram
        dark
        items={["Kesimpulan cepat", "Cari konfirmasi", "Keyakinan mengeras"]}
        className="mt-8 hidden"
      />
    </SlideShell>
  );
}
