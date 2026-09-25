import CarouselCanvas from "./CarouselCanvas";
import SlideFooter from "./SlideFooter";

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

      <div className="slide-frame">
        <div className="slide-content flex min-h-0 flex-col">
          <div className="my-auto max-w-[850px]">
            <p className="font-display text-[22px] font-semibold uppercase tracking-[0.17em] text-white/70">
              Take it with you
            </p>
            <h2 className="font-display mt-8 text-[76px] font-bold leading-[1] tracking-[-0.045em]">
              {title}
            </h2>
            <p className="mt-10 max-w-[760px] text-[31px] leading-[1.42] text-white/85">{body}</p>
          </div>

          <div className="mb-8 rounded-[30px] border border-white/25 bg-white/10 p-7 backdrop-blur-sm">
            <p className="text-[26px] font-semibold leading-[1.38]">{cta}</p>
          </div>
        </div>

        <SlideFooter slide={slide} dark />
      </div>
    </CarouselCanvas>
  );
}
