import KeywordCluster from "./KeywordCluster";
import SlideShell from "./SlideShell";

export default function FrameworkSlide({
  slide,
  title,
  steps = [],
  eyebrow = "Framework",
  density = "compact",
  backgroundWord,
  cornerLabel,
  keywords = [],
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow={eyebrow}
      type="framework"
      density={density}
      backgroundWord={backgroundWord}
      cornerLabel={cornerLabel}
    >
      <h2 className="framework-title">{title}</h2>

      {keywords.length > 0 ? (
        <KeywordCluster items={keywords} className="mt-7" />
      ) : null}

      <div className="framework-list">
        <div className="framework-items">
          {steps.map((step, index) => (
            <div key={index} className="framework-item">
              <div className="framework-number">{index + 1}</div>
              <div className="framework-card">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
