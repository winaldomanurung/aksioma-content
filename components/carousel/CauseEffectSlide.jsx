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
      <div className="my-auto">
        <div className="grid grid-cols-[1fr_110px_1fr] items-stretch">
          <div className="rounded-[42px] border border-white/10 bg-white/[0.045] p-10">
            <p className="text-[20px] font-bold uppercase tracking-[0.16em] text-zinc-500">Penyebab</p>
            <h2 className="mt-7 text-[45px] font-bold leading-[1.08]">{causeTitle}</h2>
            <p className="mt-8 text-[27px] leading-[1.5] text-zinc-400">{causeText}</p>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-red-500 to-transparent" />
            <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full border border-red-400/50 bg-zinc-950 text-[34px] text-red-400">→</div>
          </div>

          <div className="rounded-[42px] border border-red-400/25 bg-gradient-to-br from-red-500/15 to-orange-400/5 p-10">
            <p className="text-[20px] font-bold uppercase tracking-[0.16em] text-red-400">Dampak</p>
            <h2 className="mt-7 text-[45px] font-bold leading-[1.08]">{effectTitle}</h2>
            <p className="mt-8 text-[27px] leading-[1.5] text-zinc-300">{effectText}</p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
