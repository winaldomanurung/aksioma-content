"use client";

import {useRef,useState} from "react";
import {CANVAS,MIN_IMAGE_SIZE,normalizeImage} from "@/lib/studio/images";

// Drag/resize handles for the images of ONE slide. It is rendered next to the
// slide (never inside [data-carousel-slide]), in the same 1080×1350 coordinate
// space as the slide, so it can never appear in an export. `scale` is the
// preview scale (CSS px per canvas px); pointer deltas are divided by it.
//
// Corner drag resizes from the opposite corner. Aspect ratio is kept (Shift
// toggles free resize); circles always stay round.

const HANDLES=[
  {key:"nw",x:0,y:0,cursor:"nwse-resize"},
  {key:"ne",x:1,y:0,cursor:"nesw-resize"},
  {key:"sw",x:0,y:1,cursor:"nesw-resize"},
  {key:"se",x:1,y:1,cursor:"nwse-resize"},
];

export default function ImageEditorOverlay({images,scale,selectedId,onSelect,onLive,onCommit}){
  const gesture=useRef(null);
  const [live,setLive]=useState(null); // images while a gesture is in progress
  const shown=live||images;
  const handleSize=Math.max(22,Math.round(22/Math.max(scale,.1)));

  function begin(event,image,mode,handle){
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    onSelect(image.id);
    gesture.current={mode,handle,id:image.id,startX:event.clientX,startY:event.clientY,origin:{...image},list:images,moved:false};
  }

  function move(event){
    const g=gesture.current;
    if(!g)return;
    const dx=(event.clientX-g.startX)/scale;
    const dy=(event.clientY-g.startY)/scale;
    if(Math.abs(dx)+Math.abs(dy)>1)g.moved=true;
    const o=g.origin;
    let next;
    if(g.mode==="move"){
      next={...o,x:o.x+dx,y:o.y+dy};
    }else{
      const h=g.handle;
      const lock=o.shape==="circle"||!event.shiftKey;
      // Anchor = the corner opposite the handle being dragged.
      const ax=h.x?o.x:o.x+o.width, ay=h.y?o.y:o.y+o.height;
      let w=Math.max(MIN_IMAGE_SIZE,(h.x?o.width+dx:o.width-dx));
      let hh=Math.max(MIN_IMAGE_SIZE,(h.y?o.height+dy:o.height-dy));
      if(lock){
        const ratio=o.width/o.height;
        // Follow whichever axis the pointer moved further along.
        if(Math.abs(w-o.width)/o.width>=Math.abs(hh-o.height)/o.height)hh=w/ratio; else w=hh*ratio;
        if(w<MIN_IMAGE_SIZE){w=MIN_IMAGE_SIZE;hh=w/ratio;}
        if(hh<MIN_IMAGE_SIZE){hh=MIN_IMAGE_SIZE;w=hh*ratio;}
      }
      next={...o,width:w,height:hh,x:h.x?ax:ax-w,y:h.y?ay:ay-hh};
    }
    const fixed=normalizeImage(next);
    const list=g.list.map(item=>item.id===g.id?fixed:item);
    g.latest=list;
    setLive(list);
    onLive?.(list);
  }

  function end(){
    const g=gesture.current;
    gesture.current=null;
    if(!g)return;
    const list=g.latest;
    setLive(null);
    if(list&&g.moved)onCommit(list);
    else onLive?.(null);
  }

  return (
    <div data-image-editor="true" style={{position:"absolute",inset:0,zIndex:50,pointerEvents:"none",width:CANVAS.width,height:CANVAS.height}}
      onPointerMove={move} onPointerUp={end} onPointerCancel={end}>
      {shown.map(image=>{
        const active=image.id===selectedId;
        return (
          <div key={image.id} data-image-box={image.id} onPointerDown={event=>begin(event,image,"move")}
            style={{position:"absolute",left:image.x,top:image.y,width:image.width,height:image.height,
              pointerEvents:"auto",cursor:"grab",touchAction:"none",boxSizing:"border-box",
              outline:(active?3:2)/Math.max(scale,.1)+"px "+(active?"solid":"dashed")+" "+(active?"#ef4444":"rgba(239,68,68,.55)"),
              borderRadius:image.shape==="circle"?"50%":image.shape==="rounded"?Math.round(Math.min(image.width,image.height)*.14):0}}>
            {active?HANDLES.map(h=>(
              <div key={h.key} data-handle={h.key} onPointerDown={event=>begin(event,image,"resize",h)}
                style={{position:"absolute",left:h.x?"100%":0,top:h.y?"100%":0,width:handleSize,height:handleSize,
                  marginLeft:-handleSize/2,marginTop:-handleSize/2,background:"#fff",border:(2/Math.max(scale,.1))+"px solid #ef4444",
                  borderRadius:"50%",cursor:h.cursor,touchAction:"none",boxSizing:"border-box"}}/>
            )):null}
          </div>
        );
      })}
    </div>
  );
}
