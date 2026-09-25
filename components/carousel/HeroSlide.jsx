import CarouselCanvas from "./CarouselCanvas";

export default function HeroSlide({
  slide = 1,
  eyebrow,
  title,
  subtitle,
  accent = "Berpikir lebih jernih.",
}) {
  return (
    <CarouselCanvas slide={slide} label={title} className="bg-zinc-950 text-white">
      <div className="absolute -right-44 -top-28 h-[600px] w-[600px] rounded-full bg-red-500/25 blur-[8px]" />
      <div className="absolute right-[-110px] top-[120px] h-[510px] w-[510px] rounded-full border-[2px] border-red-400/35" />
      <div className="absolute bottom-[220px] left-[-130px] h-[420px] w-[420px] rotate-12 rounded-[90px] border border-white/10" />
      <div className="absolute left-[84px] top-[220px] h-[2px] w-[180px] bg-gradient-to-r from-red-500 to-transparent" />

      <div className="relative z-10 flex h-full flex-col p-[84px]">
        <div className="flex items-center justify-between">
          <p className="text-[24px] font-bold uppercase tracking-[0.2em] text-red-400">
            {eyebrow}
          </p>
          <p className="font-mono text-[22px] text-zinc-500">
            {String(slide).padStart(2, "0")}
          </p>
        </div>

        <div className="my-auto max-w-[900px]">
          <p className="mb-10 text-[28px] font-semibold text-zinc-400">{accent}</p>
          <h1 className="text-[92px] font-bold leading-[0.96] tracking-[-0.055em]">
            {title}
          </h1>
          <p className="mt-12 max-w-[800px] text-[35px] leading-[1.35] text-zinc-300">
            {subtitle}
          </p>
        </div>

        <div className="flex items-end justify-between border-t border-white/15 pt-7">
          <span className="text-[23px] font-bold tracking-[0.16em]">AKSIOMA</span>
          <span className="max-w-[420px] text-right text-[20px] leading-7 text-zinc-500">
            Swipe untuk membedah idenya →
          </span>
        </div>
      </div>
    </CarouselCanvas>
  );
}
