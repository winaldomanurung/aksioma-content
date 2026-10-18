import StoredImageBox from "@/components/studio/StoredImageBox";

const HEIGHT = { sm: 440, md: 560, lg: 720 };

// Phone frame around a screenshot. The screen keeps a 9:19.5 portrait ratio.
export default function PhoneMockup({ image, size = "md", align = "center", caption, dark = false, className = "" }) {
  const height = HEIGHT[size] || HEIGHT.md;
  const width = Math.round((height * 9) / 19.5);
  const justify = align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";
  return (
    <div className={["flex flex-col", align === "left" ? "items-start" : align === "right" ? "items-end" : "items-center", className].join(" ")}>
      <div className={["flex", justify].join(" ")}>
        <div style={{ width: width + 28, height: height + 28, padding: 14, borderRadius: 54, background: "#17171c", boxShadow: "0 24px 50px rgba(0,0,0,.28)", position: "relative" }}>
          <div style={{ width, height, borderRadius: 40, overflow: "hidden", position: "relative" }}>
            <StoredImageBox id={image} dark />
            <div style={{ position: "absolute", top: 10, left: "50%", marginLeft: -42, width: 84, height: 22, borderRadius: 14, background: "#17171c" }} />
          </div>
        </div>
      </div>
      {caption ? <p className={["mt-5 text-center text-[20px] leading-[1.4]", dark ? "text-zinc-300" : "text-zinc-600"].join(" ")} style={{ maxWidth: width + 200 }}>{caption}</p> : null}
    </div>
  );
}
