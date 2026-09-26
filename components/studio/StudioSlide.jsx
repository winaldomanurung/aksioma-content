import {
  HeroSlide, StatementSlide, BulletSlide, CompareSlide, CauseEffectSlide,
  FrameworkSlide, SummarySlide, CTASlide, FreeformSlide, SlideHeading,
  InfoCard, StatCard, BigNumber, QuoteCard, DiagramNode, Connector,
  Timeline, Checklist, Callout, Pill, KeywordCluster, MiniDiagram,
  TwoColumn, ThreeColumn, ContentGrid, Stack, Divider
} from "@/components/carousel";
import {AssetIcon,AssetShape} from "./AssetPrimitives";

function Primitive({ node }) {
  const children=node.children?.map((child,i)=><Primitive key={i} node={child}/>);
  switch(node.type) {
    case "slideHeading": return <SlideHeading title={node.title} eyebrow={node.eyebrow} body={node.body} align={node.align}/>;
    case "infoCard": return <InfoCard title={node.title} eyebrow={node.eyebrow} variant={node.variant}><>{node.text}</></InfoCard>;
    case "statCard": return <StatCard value={node.value} label={node.label} note={node.note} variant={node.variant}/>;
    case "bigNumber": return <BigNumber value={node.value} label={node.label} dark={node.dark}/>;
    case "quoteCard": return <QuoteCard quote={node.quote} source={node.source} dark={node.dark}/>;
    case "diagramNode": return <DiagramNode title={node.title} body={node.body} accent={node.accent} dark={node.dark}/>;
    case "connector": return <Connector direction={node.direction} label={node.label} dark={node.dark}/>;
    case "timeline": return <Timeline items={node.items} dark={node.dark}/>;
    case "checklist": return <Checklist items={node.items} dark={node.dark}/>;
    case "callout": return <Callout label={node.label} dark={node.dark}>{node.text}</Callout>;
    case "pill": return <Pill dark={node.dark}>{node.text}</Pill>;
    case "keywordCluster": return <KeywordCluster items={node.items} dark={node.dark}/>;
    case "miniDiagram": return <MiniDiagram items={node.items} dark={node.dark}/>;
    case "twoColumn": return <TwoColumn>{children}</TwoColumn>;
    case "threeColumn": return <ThreeColumn>{children}</ThreeColumn>;
    case "contentGrid": return <ContentGrid columns={node.columns}>{children}</ContentGrid>;
    case "stack": return <Stack>{children}</Stack>;
    case "divider": return <Divider dark={node.dark}/>;
    case "assetIcon": return <AssetIcon set={node.set} name={node.name} size={node.size} tone={node.tone} label={node.label}/>;
    case "assetShape": return <AssetShape name={node.name} position={node.position} opacity={node.opacity}/>;
    default: return null;
  }
}
export function StudioSlide({data,number}){
  const slide=number;
  const s=data;
  switch(s.type){
    case "hero": return <HeroSlide {...s} slide={slide}/>;
    case "statement": return <StatementSlide {...s} slide={slide}/>;
    case "bullet": return <BulletSlide {...s} slide={slide}/>;
    case "compare": return <CompareSlide {...s} slide={slide}/>;
    case "causeEffect": return <CauseEffectSlide {...s} slide={slide}/>;
    case "framework": return <FrameworkSlide {...s} slide={slide}/>;
    case "summary": return <SummarySlide {...s} slide={slide}/>;
    case "cta": return <CTASlide {...s} slide={slide}/>;
    case "freeform": return (
      <FreeformSlide slide={slide} eyebrow={s.eyebrow} dark={s.dark} density={s.density}
        backgroundWord={s.backgroundWord} cornerLabel={s.cornerLabel}>
        <div className="studio-freeform-body">
          {s.nodes.map((n,i)=><Primitive key={i} node={n}/>)}
        </div>
      </FreeformSlide>
    );
    default: return null;
  }
}
