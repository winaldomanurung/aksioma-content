import "./globals.css";
import {fontVariableClasses} from "./fonts";
import SiteNav from "@/components/studio/SiteNav";

export const metadata = {
  title: "Aksioma Content Studio",
  description: "React-based carousel studio and JPEG exporter for Aksioma.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  const rootClass = [fontVariableClasses, "h-full antialiased"].join(" ");

  return (
    <html lang="id" className={rootClass}>
      <body className="min-h-full"><SiteNav/>{children}</body>
    </html>
  );
}
