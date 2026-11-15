import AITemplateClient from "@/components/studio/AITemplateClient";

export const metadata={
  title:"Swing Trade Plan | Aksioma Content",
  description:"Prompt AI dengan kerangka baku untuk swing trade plan."
};

export default function Page(){
  return <AITemplateClient preset="swing"/>;
}
