import AITemplateClient from "@/components/studio/AITemplateClient";

export const metadata={
  title:"Broker Summary | Aksioma Content",
  description:"Prompt AI dengan kerangka baku untuk broker summary."
};

export default function Page(){
  return <AITemplateClient preset="broker"/>;
}
