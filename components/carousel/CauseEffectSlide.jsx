import SlideShell from "./SlideShell";

export default function CauseEffectSlide({
  slide,
  causeTitle,
  causeText,
  effectTitle,
  effectText,
}) {
  return (
    <SlideShell slide={slide} eyebrow="Cause → Effect" dark>
      <div className="my-auto grid grid-cols-[1fr_92px_1fr] items-stretch">
        <div className="rounded-[38px] border border-white/10 bg-white/[0.045] p-9">
          <p className="font-display text-[18px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
            Penyebab
          </p>
          <h2 className="font-display mt-6 text-[41px] font-bold leading-[1.1]">{causeTitle}</h2>
          <p className="mt-7 text-[25px] leading-[1.46] text-zinc-400">{causeText}</p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-red-500 to-transparent" />
          <div className="relative z-10 flex h-[64px] w-[64px] items-center justify-center rounded-full border border-red-400/50 bg-zinc-950 text-[30px] text-red-400">
            →
          </div>
        </div>

        <div className="rounded-[38px] border border-red-400/25 bg-gradient-to-br from-red-500/15 to-orange-400/5 p-9">
          <p className="font-display text-[18px] font-semibold uppercase tracking-[0.15em] text-red-400">
            Dampak
          </p>
          <h2 className="font-display mt-6 text-[41px] font-bold leading-[1.1]">{effectTitle}</h2>
          <p className="mt-7 text-[25px] leading-[1.46] text-zinc-300">{effectText}</p>
        </div>
      </div>
    </SlideShell>
  );
}
