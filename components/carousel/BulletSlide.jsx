import SlideShell from "./SlideShell";

export default function BulletSlide({
  slide,
  eyebrow = "Breakdown",
  title,
  items = [],
}) {
  return (
    <SlideShell slide={slide} eyebrow={eyebrow} dark>
      <div className="mt-20">
        <h2 className="max-w-[850px] text-[62px] font-bold leading-[1.05] tracking-[-0.04em]">
          {title}
        </h2>

        <div className="mt-16 space-y-7">
          {items.map((item, index) => (
            <div
              key={item.title}
              className="grid grid-cols-[72px_1fr] gap-6 rounded-[30px] border border-white/10 bg-white/[0.045] p-7"
            >
              <div className="flex h-[58px] w-[58px] items-center justify-center rounded-full border border-red-400/40 bg-red-500/10 font-mono text-[22px] font-bold text-red-400">
                {String(index + 1).padStart(2, "0")}
              </div>
              <div>
                <h3 className="text-[31px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[25px] leading-[1.4] text-zinc-400">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
