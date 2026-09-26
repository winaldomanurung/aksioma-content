import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/studio/SiteNav";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata = {
  title: "Aksioma Content Studio",
  description: "React-based carousel studio and JPEG exporter for Aksioma.",
};

export default function RootLayout({ children }) {
  const rootClass = [inter.variable, lexend.variable, "h-full antialiased"].join(" ");

  return (
    <html lang="id" className={rootClass}>
      <body className="min-h-full"><SiteNav/>{children}</body>
    </html>
  );
}
