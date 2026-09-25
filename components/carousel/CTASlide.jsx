import AccentLine from "./AccentLine";
import BackgroundWord from "./BackgroundWord";
import CarouselCanvas from "./CarouselCanvas";
import CornerLabel from "./CornerLabel";
import KeywordCluster from "./KeywordCluster";
import SlideFooter from "./SlideFooter";

export default function CTASlide({
  slide = 10,
  title,
  body,
  cta = "Simpan post ini untuk dipakai saat kamu membutuhkannya.",
  density = "bold",
}) {
  return (
    <CarouselCanvas
      slide={slide}
      label={title}
      type="cta"
      density={density}
      className="bg-red-500 text-white"
    >
      <div className="absolute -right-48 -top-52 h-[620px] w-[620px] rounded-full border-[2px] border-white/25" />
      <div className="absolute -bottom-36 -left-36 h-[520px] w-[520px] rounded-full bg-zinc-950/10" />
      <div className="absolute right-[80px] top-[240px] h-[260px] w-[260px] rotate-45 rounded-[50px] border border-white/25" />

      <BackgroundWord dark className="bottom-[230px] right-[-50px] rotate-[-8deg]">
        SAVE
      </BackgroundWord>
      <AccentLine dark className="left-[78px] top-[210px]" />
      <CornerLabel dark className="right-[78px] top-[78px]">
        Takeaway
      </CornerLabel>

      <div className="slide-frame">
        <div className="slide-content flex min-h-0 flex-col">
          <div className="cta-copy">
            <p className="font-display text-[22px] font-semibold uppercase tracking-[0.17em] text-white/70">
              Take it with you
            </p>
            <h2 className="cta-title">{title}</h2>
            <p className="mt-10 max-w-[760px] text-[31px] leading-[1.42] text-white/85">
              {body}
            </p>

            <KeywordCluster
              dark
              items={["save", "apply", "review"]}
              className="mt-9"
            />
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
