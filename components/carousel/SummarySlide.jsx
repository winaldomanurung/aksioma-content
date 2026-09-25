import SlideShell from "./SlideShell";

export default function SummarySlide({ slide, title, items = [] }) {
  return (
    <SlideShell slide={slide} eyebrow="Ringkasannya" dark>
      <div className="my-auto">
        <h2 className="font-display max-w-[850px] text-[58px] font-bold leading-[1.07] tracking-[-0.035em]">
          {title}
        </h2>
        <div className="mt-13 grid grid-cols-2 gap-6">
          {items.map((item, index) => (
            <div
              key={item}
              className="min-h-[174px] rounded-[30px] border border-white/10 bg-white/[0.05] p-7"
            >
              <span className="font-display text-[18px] font-semibold text-red-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-6 text-[25px] font-medium leading-[1.38] text-zinc-200">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
