import AccentLine from "./AccentLine";
import BackgroundWord from "./BackgroundWord";
import CarouselCanvas from "./CarouselCanvas";
import CornerLabel from "./CornerLabel";
import SlideFooter from "./SlideFooter";

export default function HeroSlide({
  slide = 1,
  eyebrow,
  title,
  subtitle,
  accent = "Berpikir lebih jernih.",
  density = "bold",
}) {
  return (
    <CarouselCanvas
      slide={slide}
      label={title}
      type="hero"
      density={density}
      className="bg-zinc-950 text-white"
    >
      <div className="absolute -right-44 -top-28 h-[600px] w-[600px] rounded-full bg-red-500/25 blur-[8px]" />
      <div className="absolute right-[-110px] top-[120px] h-[510px] w-[510px] rounded-full border-[2px] border-red-400/35" />
      <div className="absolute bottom-[220px] left-[-130px] h-[420px] w-[420px] rotate-12 rounded-[90px] border border-white/10" />

      <BackgroundWord dark className="bottom-[220px] right-[-30px] rotate-[-8deg]">
        THINK
      </BackgroundWord>
      <AccentLine dark className="left-[78px] top-[220px]" />
      <CornerLabel dark className="right-[78px] top-[78px]">
        IDEA / 01
      </CornerLabel>

      <div className="slide-frame">
        <div className="slide-content flex min-h-0 flex-col">
          <p className="font-display text-[22px] font-semibold uppercase tracking-[0.18em] text-red-400">
            {eyebrow}
          </p>

          <div className="hero-copy">
            <p className="mb-9 text-[27px] font-semibold text-zinc-400">{accent}</p>
            <h1 className="hero-title">{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
          </div>
        </div>

        <SlideFooter slide={slide} dark />
      </div>
    </CarouselCanvas>
  );
}
