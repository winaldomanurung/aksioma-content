import SlideShell from "./SlideShell";

export default function FreeformSlide({
  children,
  slide,
  eyebrow,
  dark = false,
  density = "balanced",
  backgroundWord,
  cornerLabel,
  className = "",
}) {
  return (
    <SlideShell
      slide={slide}
      eyebrow={eyebrow}
      dark={dark}
      type="freeform"
      density={density}
      backgroundWord={backgroundWord}
      cornerLabel={cornerLabel}
      className={className}
    >
      {children}
    </SlideShell>
  );
}
