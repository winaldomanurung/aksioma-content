import AccentLine from "./AccentLine";
import BackgroundWord from "./BackgroundWord";
import CarouselCanvas from "./CarouselCanvas";
import CornerLabel from "./CornerLabel";
import SlideFooter from "./SlideFooter";
import {backgroundThemes} from "@/lib/studio/assets";

export default function SlideShell({
  children,
  slide,
  eyebrow,
  className = "",
  dark = false,
  type = "generic",
  density = "balanced",
  backgroundWord,
  cornerLabel,
  theme,
}) {
  const resolvedDark = theme ? (backgroundThemes[theme]?.dark ?? dark) : dark;
  const canvasClass = [
    resolvedDark ? "bg-zinc-950 text-white" : "bg-[#f5f1e8] text-zinc-950",
    className,
  ].join(" ");

  const eyebrowClass = [
    "font-display text-[22px] font-semibold uppercase tracking-[0.16em]",
    resolvedDark ? "text-red-400" : "text-red-700",
  ].join(" ");

  return (
    <CarouselCanvas
      slide={slide}
      type={type}
      density={density}
      theme={theme}
      isDark={resolvedDark}
      className={canvasClass}
    >
      {backgroundWord ? (
        <BackgroundWord
          dark={resolvedDark}
          className="bottom-[170px] right-[-28px] rotate-[-7deg]"
        >
          {backgroundWord}
        </BackgroundWord>
      ) : null}

      <AccentLine
        dark={resolvedDark}
        className="right-[76px] top-[120px] rotate-[-18deg] opacity-70"
      />

      {cornerLabel ? (
        <CornerLabel
          dark={resolvedDark}
          className="right-[76px] top-[78px]"
        >
          {cornerLabel}
        </CornerLabel>
      ) : null}

      <div className="slide-frame">
        <div className="slide-content flex min-h-0 flex-col">
          {eyebrow ? (
            <div className="flex items-center gap-5">
              <span className={resolvedDark ? "h-[3px] w-14 bg-red-400" : "h-[3px] w-14 bg-red-600"} />
              <p className={eyebrowClass}>{eyebrow}</p>
            </div>
          ) : null}

          {children}
        </div>

        <SlideFooter slide={slide} dark={resolvedDark} />
      </div>
    </CarouselCanvas>
  );
}
