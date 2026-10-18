import SlideShell from "./SlideShell";

export default function BulletSlide({
  slide,
  eyebrow = "Breakdown",
  title,
  items = [],
  density = "balanced",
  backgroundWord,
  cornerLabel,
  vertical,
  extras,
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow={eyebrow}
      dark
      type="bullet"
      density={density}
      backgroundWord={backgroundWord}
      cornerLabel={cornerLabel}
      vertical={vertical}
      extras={extras}
    >
      <div className="bullet-wrap">
        <h2 className="bullet-title">{title}</h2>

        <div className="bullet-grid">
          {items.map((item, index) => (
            <div key={index} className="bullet-card">
              <div className="bullet-number">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="bullet-item-title">{item.title}</h3>
                <p className="bullet-item-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
