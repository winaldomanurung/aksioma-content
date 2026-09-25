import SlideShell from "./SlideShell";

function CompareCard({ label, heading, points, muted = false }) {
  const cardClass = [
    "flex min-h-[620px] flex-col rounded-[40px] border p-10",
    muted
      ? "border-black/10 bg-white/45"
      : "border-red-300 bg-gradient-to-br from-red-50 to-orange-50",
  ].join(" ");

  return (
    <div className={cardClass}>
      <p className={muted ? "text-[20px] font-bold uppercase tracking-[0.16em] text-zinc-500" : "text-[20px] font-bold uppercase tracking-[0.16em] text-red-600"}>
        {label}
      </p>
      <h3 className="mt-8 text-[42px] font-bold leading-[1.08]">{heading}</h3>
      <div className="mt-10 space-y-6">
        {points.map((point) => (
          <div key={point} className="flex gap-4 text-[26px] leading-[1.4] text-zinc-700">
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
      <h2 className="mt-16 max-w-[860px] text-[58px] font-bold leading-[1.06] tracking-[-0.04em]">
        {title}
      </h2>
      <div className="mt-14 grid grid-cols-2 gap-6">
        <CompareCard {...left} muted />
        <CompareCard {...right} />
      </div>
    </SlideShell>
  );
}
