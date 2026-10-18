import StoredImageBox from "@/components/studio/StoredImageBox";

const HEIGHT = { sm: 340, md: 480, lg: 640 };
const RADIUS = { square: "0px", rounded: "36px", circle: "50%" };

// Large photo with a title/text caption, either below it or overlaid at the bottom.
export default function PhotoHero({ image, size = "md", shape = "rounded", fit = "cover", title, text, overlay = false, dark = false, className = "" }) {
  const height = HEIGHT[size] || HEIGHT.md;
  const hasCaption = Boolean(title || text);
  return (
    <figure className={["m-0", className].join(" ")}>
      <div className="relative" style={{ height }}>
        <StoredImageBox id={image} fit={fit} radius={RADIUS[shape] || RADIUS.rounded} dark={dark} />
        {overlay && hasCaption ? (
          <div className="absolute inset-x-0 bottom-0 p-7" style={{ borderRadius: "0 0 " + (RADIUS[shape] === "50%" ? "0" : "36px") + " " + (RADIUS[shape] === "50%" ? "0" : "36px"), background: "linear-gradient(to top, rgba(0,0,0,.78), rgba(0,0,0,0))" }}>
            {title ? <p className="font-display text-[34px] font-bold leading-[1.15] text-white">{title}</p> : null}
            {text ? <p className="mt-2 text-[21px] leading-[1.4] text-white/85">{text}</p> : null}
          </div>
        ) : null}
      </div>
      {!overlay && hasCaption ? (
        <figcaption className={["mt-5", dark ? "text-white" : "text-zinc-900"].join(" ")}>
          {title ? <p className="font-display text-[32px] font-bold leading-[1.15]">{title}</p> : null}
          {text ? <p className="mt-2 text-[21px] leading-[1.45] opacity-80">{text}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
