import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Aksioma Content Studio",
  description: "React-based carousel studio and JPEG exporter for Aksioma.",
};

export default function RootLayout({ children }) {
  const rootClass = [geistSans.variable, geistMono.variable, "h-full antialiased"].join(" ");

  return (
    <html lang="id" className={rootClass}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
