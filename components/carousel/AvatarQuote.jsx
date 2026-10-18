import StoredImageBox from "@/components/studio/StoredImageBox";

// Quote with a circular avatar. Without an avatar it shows the name's initials.
export default function AvatarQuote({ avatar, quote, name, role, dark = false, className = "" }) {
  const initials = (name || "").split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
  return (
    <div className={["rounded-[30px] border p-8", dark ? "border-white/10 bg-white/[0.06] text-white" : "border-black/10 bg-white/60 text-zinc-900", className].join(" ")}>
      <p className="font-display text-[34px] font-semibold leading-[1.3]">“{quote}”</p>
      <div className="mt-6 flex items-center gap-5">
        <div className="relative h-[88px] w-[88px] flex-none">
          {avatar ? <StoredImageBox id={avatar} radius="50%" dark={dark} /> : (
            <div className={["font-display flex h-full w-full items-center justify-center rounded-full text-[32px] font-bold", dark ? "bg-red-400 text-zinc-950" : "bg-red-500 text-white"].join(" ")}>{initials || "•"}</div>
          )}
        </div>
        <div className="min-w-0">
          {name ? <p className="font-display text-[26px] font-bold leading-[1.2]">{name}</p> : null}
          {role ? <p className="mt-1 text-[20px] leading-[1.35] opacity-70">{role}</p> : null}
        </div>
      </div>
    </div>
  );
}
