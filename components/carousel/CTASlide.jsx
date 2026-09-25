import CarouselCanvas from "./CarouselCanvas";

export default function CTASlide({
  slide = 10,
  title,
  body,
  cta = "Simpan post ini untuk dipakai saat kamu membutuhkannya.",
}) {
  return (
    <CarouselCanvas slide={slide} label={title} className="bg-red-500 text-white">
      <div className="absolute -right-48 -top-52 h-[620px] w-[620px] rounded-full border-[2px] border-white/25" />
      <div className="absolute -bottom-36 -left-36 h-[520px] w-[520px] rounded-full bg-zinc-950/10" />
      <div className="absolute right-[80px] top-[240px] h-[260px] w-[260px] rotate-45 rounded-[50px] border border-white/25" />

      <div className="relative z-10 flex h-full flex-col p-[84px]">
        <div className="flex items-center justify-between">
          <span className="text-[23px] font-bold tracking-[0.18em]">AKSIOMA</span>
          <span className="font-mono text-[22px] text-white/70">{String(slide).padStart(2, "0")}</span>
        </div>

        <div className="my-auto max-w-[850px]">
          <p className="text-[24px] font-bold uppercase tracking-[0.18em] text-white/70">Take it with you</p>
          <h2 className="mt-9 text-[82px] font-bold leading-[0.98] tracking-[-0.05em]">{title}</h2>
          <p className="mt-11 max-w-[760px] text-[33px] leading-[1.4] text-white/85">{body}</p>
        </div>

        <div className="rounded-[34px] border border-white/25 bg-white/10 p-8 backdrop-blur-sm">
          <p className="text-[28px] font-semibold leading-[1.35]">{cta}</p>
        </div>
      </div>
    </CarouselCanvas>
  );
}
