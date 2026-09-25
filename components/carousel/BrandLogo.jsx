export default function BrandLogo({ variant = "dark", className = "" }) {
  const isLight = variant === "light";

  return (
    <img
      src={isLight ? "/brand/aksioma-light.png" : "/brand/aksioma-dark.png"}
      alt="Aksioma."
      draggable="false"
      className={[
        "slide-footer-logo select-none",
        isLight ? "slide-footer-logo-light" : "",
        className,
      ].join(" ")}
    />
  );
}
