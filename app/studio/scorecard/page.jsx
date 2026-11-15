import AITemplateClient from "@/components/studio/AITemplateClient";

export const metadata={
  title:"Scorecard Saham | Aksioma Content",
  description:"Prompt AI dengan kerangka baku untuk scorecard saham."
};

export default function Page(){
  return <AITemplateClient preset="scorecard"/>;
}
