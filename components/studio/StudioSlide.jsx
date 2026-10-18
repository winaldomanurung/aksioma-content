"use client";

import {backgroundThemes} from "@/lib/studio/assets";
import {
  HeroSlide, StatementSlide, BulletSlide, CompareSlide, CauseEffectSlide,
  FrameworkSlide, SummarySlide, CTASlide, FreeformSlide, SlideHeading,
  InfoCard, StatCard, BigNumber, QuoteCard, DiagramNode, Connector,
  Timeline, Checklist, Callout, Pill, KeywordCluster, MiniDiagram,
  TwoColumn, ThreeColumn, ContentGrid, Stack, Divider,
  BarChart, Matrix2x2, DataTable, MythFact, ProsCons, BeforeAfter,
  Funnel, Ladder, QACard, PollCard, SwipeHint, SourceNote, ProgressRing
} from "@/components/carousel";
import {AssetIcon,AssetShape} from "./AssetPrimitives";
import AccountBookend from "./AccountBookend";
import {SlideImagesContext} from "./slide-images-context";

function Primitive({ node, dark = false }) {
  const children=node.children?.map((child,i)=><Primitive key={i} node={child} dark={dark}/>);
  switch(node.type) {
    case "slideHeading": return <SlideHeading title={node.title} eyebrow={node.eyebrow} body={node.body} align={node.align} dark={dark}/>;
    case "infoCard": return <InfoCard title={node.title} eyebrow={node.eyebrow} variant={dark ? (node.variant==="glass"?"glass":"dark") : (["dark","glass"].includes(node.variant)?"soft":node.variant)}><>{node.text}</></InfoCard>;
    case "statCard": return <StatCard value={node.value} label={node.label} note={node.note} variant={dark?"dark":"light"}/>;
    case "bigNumber": return <BigNumber value={node.value} label={node.label} dark={dark}/>;
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
    case "barChart": return <BarChart items={node.items} unit={node.unit} max={node.max} dark={dark||node.dark}/>;
    case "matrix2x2": return <Matrix2x2 xAxis={node.xAxis} yAxis={node.yAxis} quadrants={node.quadrants} dark={dark||node.dark}/>;
    case "table": return <DataTable columns={node.columns} rows={node.rows} dark={dark||node.dark}/>;
    case "mythFact": return <MythFact items={node.items} mythLabel={node.mythLabel} factLabel={node.factLabel} dark={dark||node.dark}/>;
    case "prosCons": return <ProsCons pros={node.pros} cons={node.cons} proLabel={node.proLabel} conLabel={node.conLabel} dark={dark||node.dark}/>;
    case "beforeAfter": return <BeforeAfter before={node.before} after={node.after} slot={node.slot} dark={dark||node.dark}/>;
    case "funnel": return <Funnel items={node.items} shape={node.shape} dark={dark||node.dark}/>;
    case "ladder": return <Ladder items={node.items} dark={dark||node.dark}/>;
    case "qaCard": return <QACard items={node.items} dark={dark||node.dark}/>;
    case "pollCard": return <PollCard question={node.question} options={node.options} cta={node.cta} dark={dark||node.dark}/>;
    case "swipeHint": return <SwipeHint text={node.text} align={node.align} dark={dark||node.dark}/>;
    case "sourceNote": return <SourceNote text={node.text} label={node.label} dark={dark||node.dark}/>;
    case "progressRing": return <ProgressRing value={node.value} label={node.label} note={node.note} dark={dark||node.dark}/>;
    case "assetIcon": return <AssetIcon set={node.set} name={node.name} size={node.size} tone={node.tone|| (dark?"light":"ink")} label={node.label}/>;
    case "assetShape": return <AssetShape name={node.name} position={node.position} opacity={node.opacity}/>;
    default: return null;
  }
}
export function StudioSlide({data,number,account="journey",total=10}){
  return <SlideImagesContext.Provider value={data?.images||null}><StudioSlideBody data={data} number={number} account={account} total={total}/></SlideImagesContext.Provider>;
}
function StudioSlideBody({data,number,account="journey",total=10}){
  const slide=number;
  const s=data;
  switch(s.type){
    case "hero": return number===1 ? <AccountBookend kind="hero" account={account} data={s} number={number}/> : <HeroSlide {...s} slide={slide}/>;
    case "statement": return <StatementSlide {...s} slide={slide}/>;
    case "bullet": return <BulletSlide {...s} slide={slide}/>;
    case "compare": return <CompareSlide {...s} slide={slide}/>;
    case "causeEffect": return <CauseEffectSlide {...s} slide={slide}/>;
    case "framework": return <FrameworkSlide {...s} slide={slide}/>;
    case "summary": return <SummarySlide {...s} slide={slide}/>;
    case "cta": return number===total ? <AccountBookend kind="cta" account={account} data={s} number={number}/> : <CTASlide {...s} slide={slide}/>;
    case "freeform": {
      const dark=s.theme ? (backgroundThemes[s.theme]?.dark ?? !!s.dark) : !!s.dark;
      return (
      <FreeformSlide slide={slide} eyebrow={s.eyebrow} dark={dark} theme={s.theme} density={s.density}
        backgroundWord={s.backgroundWord} cornerLabel={s.cornerLabel}>
        <div className="studio-freeform-body">
          {s.nodes.map((n,i)=><Primitive key={i} node={n} dark={dark}/>)}
        </div>
      </FreeformSlide>
    );
    }
    default: return null;
  }
}
