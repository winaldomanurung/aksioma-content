import KeywordCluster from "./KeywordCluster";
import SlideShell from "./SlideShell";

function CompareCard({ label, heading, points, muted = false }) {
  return (
    <div className={["compare-card", muted ? "compare-card--muted" : "compare-card--accent"].join(" ")}>
      <p className={["compare-label", muted ? "text-zinc-500" : "text-red-600"].join(" ")}>
        {label}
      </p>
      <h3 className="compare-heading">{heading}</h3>
      <div className="compare-points">
        {points.map((point) => (
          <div key={point} className="flex gap-4 text-[24px] leading-[1.42] text-zinc-700">
            <span className={muted ? "mt-3 h-2.5 w-2.5 flex-none rounded-full bg-zinc-400" : "mt-3 h-2.5 w-2.5 flex-none rounded-full bg-red-500"} />
            <p>{point}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CompareSlide({
  slide,
  title,
  left,
  right,
  eyebrow = "Bandingkan",
  density = "balanced",
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow={eyebrow}
      type="compare"
      density={density}
      backgroundWord="VS"
      cornerLabel="Contrast"
    >
      <h2 className="compare-title">{title}</h2>

      <KeywordCluster
        items={["intuisi", "bukti", "uji"]}
        className="mt-7"
      />

      <div className="compare-grid">
        <CompareCard {...left} muted />
        <CompareCard {...right} />
      </div>
    </SlideShell>
  );
}
