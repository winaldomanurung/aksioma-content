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
      <div className="my-auto">
        <p className="max-w-[850px] text-[62px] font-semibold leading-[1.08] tracking-[-0.035em]">
          {lead}{" "}
          <span className="relative inline">
            <span className="relative z-10">{highlight}</span>
            <span className="absolute bottom-[3px] left-0 h-[20px] w-full bg-red-300/70" />
          </span>
        </p>
        {note ? (
          <p className="mt-14 max-w-[780px] text-[31px] leading-[1.5] text-zinc-600">
            {note}
          </p>
        ) : null}
      </div>
    </SlideShell>
  );
}
