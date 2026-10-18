"use client";

import {useEffect,useRef,useState} from "react";
import {StudioSlide} from "@/components/studio/StudioSlide";
import PreviewBoundary from "@/components/studio/PreviewBoundary";
import ImageEditorOverlay from "@/components/studio/ImageEditorOverlay";

// One slide scaled to the available width, using the same renderer as the
// Studio. `editor` (optional) enables drag/resize of the slide's images.
export default function ScaledSlide({data,number,total,account,platform,safe=false,editor}){
  const wrap=useRef(null);
  const [scale,setScale]=useState(.4);
  useEffect(()=>{
    const node=wrap.current;if(!node)return;
    const update=()=>setScale(Math.min(1,Math.max(.1,node.clientWidth/1080)));
    update();
    const observer=new ResizeObserver(update);observer.observe(node);
    return()=>observer.disconnect();
  },[]);
  return (
    <PreviewBoundary resetKey={data}>
      <div className="rounded-[22px] bg-zinc-200 p-2 sm:p-4">
        <div ref={wrap} className="w-full" style={{height:1350*scale}}>
          <div className="carousel-stage !min-h-0 !gap-0 !p-0" data-platform={platform} data-safe-area={safe&&platform==="tiktok"?"true":"false"}
            style={{display:"block",overflow:"visible",width:1080,height:1350,transformOrigin:"top left",transform:"scale("+scale+")"}}>
            <div style={{position:"relative",width:1080,height:1350}}>
              <StudioSlide data={data} number={number} total={total} account={account}/>
              {editor&&data.images?.length?<ImageEditorOverlay images={data.images} scale={scale} selectedId={editor.selectedId}
                onSelect={editor.onSelect} onLive={editor.onLive} onCommit={editor.onCommit}/>:null}
            </div>
          </div>
        </div>
      </div>
    </PreviewBoundary>
  );
}
