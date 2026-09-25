import CarouselCanvas from "./CarouselCanvas";

export default function SlideShell({
  children,
  slide,
  eyebrow,
  className = "",
  dark = false,
  footer = "AKSIOMA",
}) {
  const canvasClass = [
    dark ? "bg-zinc-950 text-white" : "bg-[#f5f1e8] text-zinc-950",
    className,
  ].join(" ");

  const eyebrowClass = [
    "text-[24px] font-bold uppercase tracking-[0.18em]",
    dark ? "text-red-400" : "text-red-600",
  ].join(" ");

  const footerClass = [
    "mt-auto flex items-center justify-between border-t pt-7 text-[22px] font-semibold tracking-[0.08em]",
    dark ? "border-white/15 text-zinc-400" : "border-black/15 text-zinc-600",
  ].join(" ");

  return (
    <CarouselCanvas slide={slide} className={canvasClass}>
      <div className="relative z-10 flex h-full flex-col p-[84px]">
        {eyebrow ? (
          <div className="flex items-center gap-5">
            <span className={dark ? "h-[3px] w-16 bg-red-400" : "h-[3px] w-16 bg-red-500"} />
            <p className={eyebrowClass}>{eyebrow}</p>
          </div>
        ) : null}

        {children}

        <footer className={footerClass}>
          <span>{footer}</span>
          <span>{String(slide).padStart(2, "0")}</span>
        </footer>
      </div>
    </CarouselCanvas>
  );
}
