"use client";

import {backgroundThemes} from "@/lib/studio/assets";
import {
  HeroSlide, StatementSlide, BulletSlide, CompareSlide, CauseEffectSlide,
  FrameworkSlide, SummarySlide, CTASlide, FreeformSlide, SlideHeading,
  InfoCard, StatCard, BigNumber, QuoteCard, DiagramNode, Connector,
  Timeline, Checklist, Callout, Pill, KeywordCluster, MiniDiagram,
  TwoColumn, ThreeColumn, ContentGrid, Stack, Divider,
  BarChart, Matrix2x2, DataTable, MythFact, ProsCons, BeforeAfter,
  Funnel, Ladder, QACard, PollCard, SwipeHint, SourceNote, ProgressRing,
  PhotoHero, PhoneMockup, Collage, AvatarQuote,
  TextBlock, Footnote, Glossary, Flow, StockList, PriceChart, StockCompare, TradePlan, EventCalendar
} from "@/components/carousel";
import {AssetIcon,AssetShape} from "./AssetPrimitives";
import AccountBookend from "./AccountBookend";
import {SlideImagesContext} from "./slide-images-context";
import {SlideFontContext} from "./slide-font-context";
import {isFontId} from "@/lib/studio/fonts";

function Primitive({ node, dark = false }) {
  const children=node.children?.map((child,i)=><Primitive key={i} node={child} dark={dark}/>);
  switch(node.type) {
    case "slideHeading": return <SlideHeading title={node.title} eyebrow={node.eyebrow} body={node.body} align={node.align} dark={dark}/>;
    case "infoCard": return <InfoCard title={node.title} eyebrow={node.eyebrow} variant={dark ? (node.variant==="glass"?"glass":"dark") : (["dark","glass"].includes(node.variant)?"soft":node.variant)}><>{node.text}</></InfoCard>;
    case "statCard": return <StatCard value={node.value} label={node.label} note={node.note} variant={dark?"dark":"light"}/>;
    case "bigNumber": return <BigNumber value={node.value} label={node.label} dark={dark}/>;
    case "quoteCard": return <QuoteCard quote={node.quote} source={node.source} dark={dark||node.dark}/>;
    case "diagramNode": return <DiagramNode title={node.title} body={node.body} accent={node.accent} dark={dark||node.dark}/>;
    case "connector": return <Connector direction={node.direction} label={node.label} dark={dark||node.dark}/>;
    case "timeline": return <Timeline items={node.items} dark={dark||node.dark}/>;
    case "checklist": return <Checklist items={node.items} dark={dark||node.dark}/>;
    case "callout": return <Callout label={node.label} dark={dark||node.dark}>{node.text}</Callout>;
    case "pill": return <Pill dark={dark||node.dark}>{node.text}</Pill>;
    case "keywordCluster": return <KeywordCluster items={node.items} dark={dark||node.dark}/>;
    case "miniDiagram": return <MiniDiagram items={node.items} dark={dark||node.dark}/>;
    case "twoColumn": return <TwoColumn>{children}</TwoColumn>;
    case "threeColumn": return <ThreeColumn>{children}</ThreeColumn>;
    case "contentGrid": return <ContentGrid columns={node.columns}>{children}</ContentGrid>;
    case "stack": return <Stack>{children}</Stack>;
    case "divider": return <Divider dark={dark||node.dark}/>;
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
    case "photoHero": return <PhotoHero image={node.image} size={node.size} shape={node.shape} fit={node.fit} title={node.title} text={node.text} overlay={node.overlay} dark={dark||node.dark}/>;
    case "phoneMockup": return <PhoneMockup image={node.image} size={node.size} align={node.align} caption={node.caption} dark={dark||node.dark}/>;
    case "collage": return <Collage items={node.items} size={node.size} shape={node.shape} dark={dark||node.dark}/>;
    case "avatarQuote": return <AvatarQuote avatar={node.avatar} quote={node.quote} name={node.name} role={node.role} dark={dark||node.dark}/>;
    case "textBlock": return <TextBlock text={node.text} label={node.label} size={node.size} dark={dark||node.dark}/>;
    case "footnote": return <Footnote items={node.items} dark={dark||node.dark}/>;
    case "glossary": return <Glossary items={node.items} dark={dark||node.dark}/>;
    case "flow": return <Flow items={node.items} direction={node.direction} fork={node.fork} dark={dark||node.dark}/>;
    case "stockList": return <StockList items={node.items} numbered={node.numbered} disclaimer={node.disclaimer} disclaimerText={node.disclaimerText} dark={dark||node.dark}/>;
    case "priceChart": return <PriceChart candles={node.candles} points={node.points} levels={node.levels} title={node.title} caption={node.caption} from={node.from} to={node.to} dark={dark||node.dark}/>;
    case "stockCompare": return <StockCompare left={node.left} right={node.right} rows={node.rows} disclaimer={node.disclaimer} dark={dark||node.dark}/>;
    case "tradePlan": return <TradePlan ticker={node.ticker} scenarios={node.scenarios} risk={node.risk} dark={dark||node.dark}/>;
    case "eventCalendar": return <EventCalendar items={node.items} dark={dark||node.dark}/>;
    case "assetIcon": return <AssetIcon set={node.set} name={node.name} size={node.size} tone={node.tone|| (dark?"light":"ink")} label={node.label}/>;
    case "assetShape": return <AssetShape name={node.name} position={node.position} opacity={node.opacity}/>;
    default: return null;
  }
}
// `font` is the carousel-wide preset (meta.font); a slide's own `font` wins.
export function StudioSlide({data,number,account="journey",total=10,font}){
  const preset=isFontId(data?.font)?data.font:(isFontId(font)?font:null);
  return (
    <SlideFontContext.Provider value={preset}>
      <SlideImagesContext.Provider value={data?.images||null}><StudioSlideBody data={data} number={number} account={account} total={total}/></SlideImagesContext.Provider>
    </SlideFontContext.Provider>
  );
}
function extrasNodes(s,dark){
  const nodes=Array.isArray(s.extras)?s.extras.map((n,i)=><Primitive key={i} node={n} dark={dark}/>):[];
  if(Array.isArray(s.sources)&&s.sources.length)nodes.push(<SourceNote key="sources" label="Sumber" text={s.sources.join("; ")} dark={dark}/>);
  return nodes.length?nodes:undefined;
}
// Every content slide gets a decoration. Omit `decorations` for an automatic one
// (varied by slide number so neighbours never repeat), pass your own list, or
// pass "none" to switch it off. A freeform slide that already has an assetShape
// node keeps only that one.
const AUTO_SHAPES=["editorial-grid","orbital-rings","dotted-field","contour-lines","soft-blobs","arc-ribbon","topographic","orbit-dots","window-frames","angular-path","gradient-orbs","sunburst","diagonal-stripes","wave-red"];
const AUTO_POSITIONS=["topRight","bottomRight","bottomLeft"];
export function autoDecoration(number){
  const n=Math.max(1,Number(number)||1);
  return {name:AUTO_SHAPES[(n*5)%AUTO_SHAPES.length],position:AUTO_POSITIONS[n%AUTO_POSITIONS.length],opacity:"soft"};
}
function decorationNodes(s,number){
  if(s.decorations==="none")return undefined;
  if(Array.isArray(s.decorations)&&s.decorations.length)return s.decorations.map((d,i)=><AssetShape key={i} name={d.name} position={d.position} opacity={d.opacity}/>);
  if(s.type==="freeform"&&Array.isArray(s.nodes)&&s.nodes.some(n=>n?.type==="assetShape"))return undefined;
  const d=autoDecoration(number);
  return [<AssetShape key="auto" name={d.name} position={d.position} opacity={d.opacity}/>];
}
const DARK_PRESETS=new Set(["bullet","causeEffect","summary"]);
function StudioSlideBody({data,number,account="journey",total=10}){
  const slide=number;
  const s=data;
  const dark=s.type==="freeform" ? (s.theme ? (backgroundThemes[s.theme]?.dark ?? !!s.dark) : !!s.dark) : (s.theme ? !!backgroundThemes[s.theme]?.dark : DARK_PRESETS.has(s.type));
  const layout={
    vertical: s.vertical || "center",
    extras: extrasNodes(s,dark),
    decorations: decorationNodes(s,number),
    theme: s.theme,
  };
  switch(s.type){
    case "hero": return number===1 ? <AccountBookend kind="hero" account={account} data={s} number={number}/> : <HeroSlide {...s} slide={slide}/>;
    case "statement": return <StatementSlide {...s} {...layout} slide={slide}/>;
    case "bullet": return <BulletSlide {...s} {...layout} slide={slide}/>;
    case "compare": return <CompareSlide {...s} {...layout} slide={slide}/>;
    case "causeEffect": return <CauseEffectSlide {...s} {...layout} slide={slide}/>;
    case "framework": return <FrameworkSlide {...s} {...layout} slide={slide}/>;
    case "summary": return <SummarySlide {...s} {...layout} slide={slide}/>;
    case "cta": return number===total ? <AccountBookend kind="cta" account={account} data={s} number={number}/> : <CTASlide {...s} slide={slide}/>;
    case "freeform": {
      return (
      <FreeformSlide slide={slide} eyebrow={s.eyebrow} dark={dark} theme={s.theme} density={s.density}
        backgroundWord={s.backgroundWord} cornerLabel={s.cornerLabel} {...layout}>
        <div className="studio-freeform-body">
          {s.nodes.map((n,i)=><Primitive key={i} node={n} dark={dark}/>)}
        </div>
      </FreeformSlide>
    );
    }
    default: return null;
  }
}
