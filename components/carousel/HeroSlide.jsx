import CarouselCanvas from "./CarouselCanvas";
import SlideFooter from "./SlideFooter";

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
      <div className="absolute left-[78px] top-[220px] h-[2px] w-[180px] bg-gradient-to-r from-red-500 to-transparent" />

      <div className="slide-frame">
        <div className="slide-content flex min-h-0 flex-col">
          <div className="flex items-center justify-between">
            <p className="font-display text-[22px] font-semibold uppercase tracking-[0.18em] text-red-400">
              {eyebrow}
            </p>
          </div>

          <div className="my-auto max-w-[900px]">
            <p className="mb-9 text-[27px] font-semibold text-zinc-400">{accent}</p>
            <h1 className="font-display text-[86px] font-bold leading-[0.98] tracking-[-0.05em]">
              {title}
            </h1>
            <p className="mt-10 max-w-[800px] text-[32px] leading-[1.4] text-zinc-300">
              {subtitle}
            </p>
          </div>
        </div>

        <SlideFooter slide={slide} dark />
      </div>
    </CarouselCanvas>
  );
}
