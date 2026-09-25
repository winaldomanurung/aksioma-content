import SlideShell from "./SlideShell";

export default function SummarySlide({ slide, title, items = [] }) {
  return (
    <SlideShell slide={slide} eyebrow="Ringkasannya" dark>
      <div className="my-auto">
        <h2 className="max-w-[850px] text-[65px] font-bold leading-[1.05] tracking-[-0.04em]">
          {title}
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-6">
          {items.map((item, index) => (
            <div
              key={item}
              className="min-h-[190px] rounded-[34px] border border-white/10 bg-white/[0.05] p-8"
            >
              <span className="font-mono text-[20px] text-red-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-7 text-[28px] font-medium leading-[1.35] text-zinc-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
