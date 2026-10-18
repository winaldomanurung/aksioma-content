import MarketReportClient from "@/components/studio/MarketReportClient";

export const metadata = {
  title: "Laporan Pasar | Aksioma Studio",
  description: "Tempel laporan harian Market & Foreign Flow, langsung jadi 7 slide Aksioma Trader.",
};

export default function ReportPage() {
  return <MarketReportClient />;
}
