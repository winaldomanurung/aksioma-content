import SlideShell from "./SlideShell";

function CompareCard({ label, heading, points, muted = false }) {
  return (
    <div
      className={[
        "flex min-h-[570px] flex-col rounded-[36px] border p-9",
        muted
          ? "border-black/10 bg-white/45"
          : "border-red-300 bg-gradient-to-br from-red-50 to-orange-50",
      ].join(" ")}
    >
      <p className={[
        "font-display text-[18px] font-semibold uppercase tracking-[0.15em]",
        muted ? "text-zinc-500" : "text-red-600",
      ].join(" ")}>
        {label}
      </p>
      <h3 className="font-display mt-7 text-[38px] font-bold leading-[1.1]">{heading}</h3>
      <div className="mt-9 space-y-5">
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

export default function CompareSlide({ slide, title, left, right, eyebrow = "Bandingkan" }) {
  return (
    <SlideShell slide={slide} eyebrow={eyebrow}>
      <h2 className="font-display mt-14 max-w-[860px] text-[53px] font-bold leading-[1.08] tracking-[-0.035em]">
        {title}
      </h2>
      <div className="mt-12 grid grid-cols-2 gap-6">
        <CompareCard {...left} muted />
        <CompareCard {...right} />
      </div>
    </SlideShell>
  );
}
