import SlideShell from "./SlideShell";

export default function BulletSlide({
  slide,
  eyebrow = "Breakdown",
  title,
  items = [],
}) {
  return (
    <SlideShell slide={slide} eyebrow={eyebrow} dark>
      <div className="mt-16">
        <h2 className="font-display max-w-[850px] text-[56px] font-bold leading-[1.07] tracking-[-0.035em]">
          {title}
        </h2>

        <div className="mt-12 space-y-6">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="grid grid-cols-[64px_1fr] gap-5 rounded-[28px] border border-white/10 bg-white/[0.045] p-6"
            >
              <div className="font-display flex h-[54px] w-[54px] items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 text-[19px] font-semibold text-red-400">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="font-display text-[29px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[23px] leading-[1.42] text-zinc-400">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
