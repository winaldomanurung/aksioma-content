import KeywordCluster from "./KeywordCluster";
import SlideShell from "./SlideShell";

export default function SummarySlide({
  slide,
  title,
  items = [],
  density = "balanced",
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow="Ringkasannya"
      dark
      type="summary"
      density={density}
      backgroundWord="KEEP"
      cornerLabel="Takeaway"
    >
      <div className="summary-wrap">
        <h2 className="summary-title">{title}</h2>

        <KeywordCluster
          dark
          items={["fact", "assumption", "alternative", "confidence"]}
          className="mt-8"
        />

        <div className="summary-grid">
          {items.map((item, index) => (
            <div key={item} className="summary-card">
              <span className="font-display text-[18px] font-semibold text-red-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-6 text-[25px] font-medium leading-[1.38] text-zinc-200">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
