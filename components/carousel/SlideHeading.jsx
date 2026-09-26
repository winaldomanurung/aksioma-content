export default function SlideHeading({
  eyebrow,
  title,
  body,
  dark = false,
  align = "left",
  className = "",
}) {
  const alignClass = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={["flex flex-col", alignClass, className].join(" ")}>
      {eyebrow ? (
        <p className="font-display text-[18px] font-semibold uppercase tracking-[0.16em] text-red-500">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={"font-display mt-4 max-w-[860px] text-[54px] font-bold leading-[1.06] tracking-[-0.04em] "+(dark?"text-white":"text-zinc-950") }>
        {title}
      </h2>
      {body ? (
        <p className={"mt-6 max-w-[800px] text-[25px] leading-[1.48] "+(dark?"text-zinc-200":"text-zinc-700") }>{body}</p>
      ) : null}
    </div>
  );
}
