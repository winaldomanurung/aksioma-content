import "./globals.css";
import {fontVariableClasses} from "./fonts";
import SiteNav from "@/components/studio/SiteNav";

export const metadata = {
  title: "Aksioma Content",
  description: "Studio carousel Aksioma untuk akun Trader dan Journey: dari data, artikel, atau topik menjadi slide siap posting.",
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
