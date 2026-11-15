import AITemplateClient from "@/components/studio/AITemplateClient";

export const metadata={
  title:"Perbandingan Saham | Aksioma Content",
  description:"Prompt AI dengan kerangka baku untuk perbandingan saham."
};

export default function Page(){
  return <AITemplateClient preset="perbandingan"/>;
}
