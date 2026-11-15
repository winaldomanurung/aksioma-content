"use client";

import {useEffect,useRef,useState} from "react";
import {StudioSlide} from "@/components/studio/StudioSlide";
import {parseCarouselSource} from "@/lib/studio/schema";
import {decodePayload,payloadFrom} from "@/lib/studio/link-codec";
import {measureSlides,buildIssues} from "@/lib/studio/slide-metrics";
import {fontOf} from "@/lib/studio/fonts";
import {lookOf} from "@/lib/studio/looks";
import {accountOf} from "@/lib/studio/accounts";

// Headless layout check used by /api/check (layout mode). Opened by a server-side
// Chromium as /studio/layout-check#c=<payload>. It renders the carousel in the
// same stage as the Studio's export DOM, measures it with the same code as
// "Periksa sekarang" for Instagram, then TikTok, and publishes the result on
// window.__layout = {done, error?, platforms:{instagram:[issue], tiktok:[issue]}}.
const PLATFORMS=["instagram","tiktok"];
const frame=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

export default function LayoutCheckPage(){
  const [carousel,setCarousel]=useState(null);
  const [step,setStep]=useState(0);
  const stage=useRef(null);
  const results=useRef({});

  useEffect(()=>{
    window.__layout={done:false};
    (async()=>{
      try{
        const payload=payloadFrom(window.location.hash);
        if(!payload)throw new Error("Payload #c= tidak ada.");
        setCarousel(parseCarouselSource(await decodePayload(payload)));
      }catch(e){
        window.__layout={done:true,error:e?.message||String(e)};
      }
    })();
  },[]);

  useEffect(()=>{
    if(!carousel||step>=PLATFORMS.length)return;
    let cancelled=false;
    (async()=>{
      try{await document.fonts?.ready;}catch{/* fonts API unavailable */}
      await frame();
      // AutoFit refits after fonts load; give it a moment to settle like the Studio does after render.
      await new Promise(resolve=>setTimeout(resolve,250));
      await frame();
      if(cancelled)return;
      const platform=PLATFORMS[step];
      results.current[platform]=buildIssues(carousel.slides,measureSlides(stage.current),platform);
      if(step+1<PLATFORMS.length)setStep(step+1);
      else window.__layout={done:true,platforms:results.current};
    })();
    return()=>{cancelled=true;};
  },[carousel,step]);

  if(!carousel)return null;
  const font=fontOf(carousel.meta.font);
  const look=lookOf(carousel.meta.look);
  return (
    <main ref={stage} className="carousel-stage" data-platform={PLATFORMS[Math.min(step,PLATFORMS.length-1)]} data-safe-area="false"
      style={{width:1080,display:"flex",gap:0,padding:0}}>
      {carousel.slides.map((s,i)=><StudioSlide key={i} data={s} number={i+1} account={accountOf(carousel.meta.account)} total={carousel.slides.length} font={font} look={look}/>)}
    </main>
  );
}
