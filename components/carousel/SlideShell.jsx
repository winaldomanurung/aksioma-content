import CarouselCanvas from "./CarouselCanvas";
import SlideFooter from "./SlideFooter";

export default function SlideShell({
  children,
  slide,
  eyebrow,
  className = "",
  dark = false,
}) {
  const canvasClass = [
    dark ? "bg-zinc-950 text-white" : "bg-[#f5f1e8] text-zinc-950",
    className,
  ].join(" ");

  const eyebrowClass = [
    "font-display text-[22px] font-semibold uppercase tracking-[0.16em]",
    dark ? "text-red-400" : "text-red-600",
  ].join(" ");

  return (
    <CarouselCanvas slide={slide} className={canvasClass}>
      <div className="slide-frame">
        <div className="slide-content flex min-h-0 flex-col">
          {eyebrow ? (
            <div className="flex items-center gap-5">
              <span className={dark ? "h-[3px] w-14 bg-red-400" : "h-[3px] w-14 bg-red-500"} />
              <p className={eyebrowClass}>{eyebrow}</p>
            </div>
          ) : null}

          {children}
        </div>

        <SlideFooter slide={slide} dark={dark} />
      </div>
    </CarouselCanvas>
  );
}
