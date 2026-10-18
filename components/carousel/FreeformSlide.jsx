import SlideShell from "./SlideShell";

export default function FreeformSlide({
  children,
  slide,
  eyebrow,
  dark = false,
  density = "balanced",
  backgroundWord,
  theme,
  cornerLabel,
  vertical,
  extras,
  decorations,
  className = "",
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow={eyebrow}
      dark={dark}
      theme={theme}
      type="freeform"
      density={density}
      backgroundWord={backgroundWord}
      cornerLabel={cornerLabel}
      vertical={vertical}
      extras={extras}
      decorations={decorations}
      className={className}
    >
      {children}
    </SlideShell>
  );
}
