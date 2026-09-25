import KeywordCluster from "./KeywordCluster";
import SlideShell from "./SlideShell";

export default function StatementSlide({
  slide,
  eyebrow = "Core idea",
  lead,
  highlight,
  note,
  density = "bold",
  keywords = ["belief", "evidence", "assumption"],
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow={eyebrow}
      type="statement"
      density={density}
      backgroundWord="THINK"
      cornerLabel="Pause / Test"
    >
      <div className="statement-layout">
        <div className="statement-copy">
          <p className="statement-title">
            {lead}{" "}
            <span className="relative inline">
              <span className="relative z-10">{highlight}</span>
              <span className="absolute bottom-[2px] left-0 h-[18px] w-full bg-red-300/70" />
            </span>
          </p>

          {note ? (
            <p className="statement-note text-zinc-600">{note}</p>
          ) : null}

          <KeywordCluster items={keywords} className="mt-8" />
        </div>

        <div className="statement-visual" aria-hidden="true">
          <div className="statement-orbit" />
          <span className="statement-mark">?</span>
        </div>
      </div>
    </SlideShell>
  );
}
