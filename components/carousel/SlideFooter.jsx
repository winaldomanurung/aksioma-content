import BrandLogo from "./BrandLogo";

export default function SlideFooter({ slide, dark = false }) {
  return (
    <footer
      className={[
        "slide-footer",
        dark ? "border-white/15 text-zinc-400" : "border-black/15 text-zinc-600",
      ].join(" ")}
    >
      <BrandLogo variant={dark ? "light" : "dark"} />
      <span className="font-display text-[20px] font-semibold tracking-[0.08em]">
        {String(slide).padStart(2, "0")}
      </span>
    </footer>
  );
}
