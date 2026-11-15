import AITemplateClient from "@/components/studio/AITemplateClient";

export const metadata={
  title:"Edukasi Istilah | Aksioma Content",
  description:"Prompt AI dengan kerangka baku untuk edukasi istilah saham."
};

export default function Page(){
  return <AITemplateClient preset="edukasi"/>;
}
