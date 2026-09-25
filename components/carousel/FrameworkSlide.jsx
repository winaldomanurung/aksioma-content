import SlideShell from "./SlideShell";

export default function FrameworkSlide({
  slide,
  title,
  steps = [],
  eyebrow = "Framework",
}) {
  return (
    <SlideShell slide={slide} eyebrow={eyebrow}>
      <h2 className="font-display mt-12 max-w-[820px] text-[50px] font-bold leading-[1.07] tracking-[-0.035em]">
        {title}
      </h2>

      <div className="relative mt-10">
        <div className="absolute bottom-5 left-[27px] top-5 w-[2px] bg-gradient-to-b from-red-500 via-orange-400 to-zinc-300" />
        <div className="space-y-5">
          {steps.map((step, index) => (
            <div key={step.title} className="relative grid grid-cols-[58px_1fr] gap-6">
              <div className="font-display relative z-10 flex h-[58px] w-[58px] items-center justify-center rounded-full bg-zinc-950 text-[18px] font-semibold text-white">
                {index + 1}
              </div>
              <div className="rounded-[26px] border border-black/10 bg-white/55 px-7 py-5">
                <h3 className="font-display text-[27px] font-bold">{step.title}</h3>
                <p className="mt-1.5 text-[21px] leading-[1.4] text-zinc-600">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
