import StockImportClient from "@/components/studio/StockImportClient";

export const metadata = {
  title: "Impor Saham | Aksioma Studio",
  description: "Tempel tabel saham dari spreadsheet atau CSV, langsung jadi carousel.",
};

export default function StocksPage() {
  return <StockImportClient />;
}
