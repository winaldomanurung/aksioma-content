import SlideShell from "./SlideShell";

export default function FrameworkSlide({
  slide,
  title,
  steps = [],
  eyebrow = "Framework",
}) {
  return (
    <SlideShell slide={slide} eyebrow={eyebrow}>
      <h2 className="mt-16 max-w-[820px] text-[61px] font-bold leading-[1.04] tracking-[-0.04em]">
        {title}
      </h2>

      <div className="relative mt-16">
        <div className="absolute bottom-6 left-[31px] top-6 w-[3px] bg-gradient-to-b from-red-500 via-orange-400 to-zinc-300" />
        <div className="space-y-7">
          {steps.map((step, index) => (
            <div key={step.title} className="relative grid grid-cols-[66px_1fr] gap-7">
              <div className="relative z-10 flex h-[66px] w-[66px] items-center justify-center rounded-full bg-zinc-950 font-mono text-[20px] font-bold text-white">
                {index + 1}
              </div>
              <div className="rounded-[30px] border border-black/10 bg-white/55 px-8 py-7">
                <h3 className="text-[31px] font-bold">{step.title}</h3>
                <p className="mt-2 text-[24px] leading-[1.45] text-zinc-600">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideShell>
  );
}
