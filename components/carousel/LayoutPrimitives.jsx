export function Stack({ children, gap = "gap-6", className = "" }) {
  return <div className={["flex flex-col", gap, className].join(" ")}>{children}</div>;
}

export function TwoColumn({ children, className = "" }) {
  return <div className={["primitive-two-column", className].join(" ")}>{children}</div>;
}

export function ThreeColumn({ children, className = "" }) {
  return <div className={["primitive-three-column", className].join(" ")}>{children}</div>;
}

export function ContentGrid({ children, columns = 2, className = "" }) {
  return (
    <div
      data-columns={columns}
      className={["primitive-content-grid", className].join(" ")}
    >
      {children}
    </div>
  );
}

export function Divider({ dark = false, className = "" }) {
  return <div className={["h-px w-full", dark ? "bg-white/10" : "bg-black/10", className].join(" ")} />;
}
