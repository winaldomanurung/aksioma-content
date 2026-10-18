"use client";

import {useEffect,useState} from "react";
import {StudioSlide} from "@/components/studio/StudioSlide";

// Developer tool for scripts/measure-capacity.mjs. It renders exactly one slide
// on demand through window.__showSlide(job), using the same StudioSlide the
// Studio uses, so measurements match what is exported.
export default function MeasurePage(){
  const [job,setJob]=useState(null);
  useEffect(()=>{
    window.__showSlide=next=>setJob(next);
    window.__measureReady=true;
    return()=>{delete window.__showSlide;delete window.__measureReady;};
  },[]);
  return (
    <main className="carousel-stage" data-platform={job?.platform||"instagram"} data-safe-area="false"
      style={{minHeight:0,padding:0,gap:0,display:"block"}}>
      {job?<StudioSlide data={job.slide} number={job.number||2} total={job.total||10} account={job.account||"journey"}/>:null}
    </main>
  );
}
