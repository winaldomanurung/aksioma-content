function MetaBlock({ label, children, className = "" }) {
  return (
    <section className={["rounded-2xl border border-black/10 bg-white p-5", className].join(" ")}>
      <p className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </p>
      <div className="mt-3 whitespace-pre-wrap text-[15px] leading-6 text-zinc-800">
        {children}
      </div>
    </section>
  );
}

export default function PostMetaPanel({
  title,
  objective,
  contentPillar,
  hook,
  instagramCaption,
  tiktokCaption,
  cta,
  hashtags = [],
  keywords = [],
  notes,
}) {
  return (
    <aside className="studio-only w-[1080px] overflow-hidden rounded-[28px] border border-black/10 bg-[#f7f5f0] shadow-sm">
      <div className="border-b border-black/10 bg-zinc-950 px-7 py-6 text-white">
        <div className="flex items-center justify-between gap-8">
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-red-400">
              Publishing Brief
            </p>
            <h2 className="font-display mt-2 text-2xl font-semibold">
              {title}
            </h2>
          </div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-300">
            Not exported
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 p-6">
        <MetaBlock label="Objective" className="col-span-4">
          {objective}
        </MetaBlock>

        <MetaBlock label="Content pillar" className="col-span-4">
          {contentPillar}
        </MetaBlock>

        <MetaBlock label="Primary hook" className="col-span-4">
          {hook}
        </MetaBlock>

        <MetaBlock label="Instagram caption" className="col-span-6">
          {instagramCaption}
        </MetaBlock>

        <MetaBlock label="TikTok caption" className="col-span-6">
          {tiktokCaption}
        </MetaBlock>

        <MetaBlock label="CTA" className="col-span-5">
          {cta}
        </MetaBlock>

        <MetaBlock label="Keywords" className="col-span-3">
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700"
              >
                {keyword}
              </span>
            ))}
          </div>
        </MetaBlock>

        <MetaBlock label="Hashtags" className="col-span-4">
          <div className="flex flex-wrap gap-2">
            {hashtags.map((hashtag) => (
              <span
                key={hashtag}
                className="rounded-full bg-red-50 px-3 py-1 text-sm text-red-700"
              >
                {hashtag.startsWith("#") ? hashtag : "#" + hashtag}
              </span>
            ))}
          </div>
        </MetaBlock>

        {notes ? (
          <MetaBlock label="Posting notes" className="col-span-12">
            {notes}
          </MetaBlock>
        ) : null}
      </div>
    </aside>
  );
}
