import KeywordCluster from "./KeywordCluster";
import SlideShell from "./SlideShell";

export default function FrameworkSlide({
  slide,
  title,
  steps = [],
  eyebrow = "Framework",
  density = "compact",
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow={eyebrow}
      type="framework"
      density={density}
      backgroundWord="TEST"
      cornerLabel="5 questions"
    >
      <h2 className="framework-title">{title}</h2>

      <KeywordCluster
        items={["claim", "evidence", "assumption", "alternative", "test"]}
        className="mt-7"
      />

      <div className="framework-list">
        <div className="framework-items">
          {steps.map((step, index) => (
            <div key={step.title} className="framework-item">
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
