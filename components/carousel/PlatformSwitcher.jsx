import Link from "next/link";

export default function PlatformSwitcher({
  route,
  platform,
  safeArea = false,
}) {
  const items = [
    {
      label: "Instagram 4:5",
      href: route + "?platform=instagram",
      active: platform === "instagram",
    },
    {
      label: "TikTok 9:16",
      href: route + "?platform=tiktok",
      active: platform === "tiktok" && !safeArea,
    },
    {
      label: "TikTok + Safe Area",
      href: route + "?platform=tiktok&safe=1",
      active: platform === "tiktok" && safeArea,
    },
  ];

  return (
    <div className="studio-only platform-switcher rounded-3xl border border-black/10 bg-white/80 p-6 text-zinc-700 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-red-600">
            Preview platform
          </p>
          <p className="mt-2 text-lg">
            Satu source JSX, dua komposisi output.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "rounded-full border px-5 py-3 text-sm font-semibold",
                item.active
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-black/10 bg-white text-zinc-700 hover:bg-zinc-100",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-5 text-sm leading-6 text-zinc-500">
        Instagram: 1080×1350. TikTok: 1080×1920. Safe-area overlay hanya untuk preview dan tidak ikut pada export normal.
      </p>
    </div>
  );
}
