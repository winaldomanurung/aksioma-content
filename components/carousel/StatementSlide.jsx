import SlideShell from "./SlideShell";

export default function StatementSlide({
  slide,
  eyebrow = "Core idea",
  lead,
  highlight,
  note,
}) {
  return (
    <SlideShell slide={slide} eyebrow={eyebrow}>
      <div className="my-auto max-w-[860px]">
        <p className="font-display text-[57px] font-semibold leading-[1.1] tracking-[-0.035em]">
          {lead}{" "}
          <span className="relative inline">
            <span className="relative z-10">{highlight}</span>
            <span className="absolute bottom-[2px] left-0 h-[18px] w-full bg-red-300/70" />
          </span>
        </p>
        {note ? (
          <p className="mt-12 max-w-[790px] text-[29px] leading-[1.48] text-zinc-600">
            {note}
          </p>
        ) : null}
      </div>
    </SlideShell>
  );
}
