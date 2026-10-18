"use client";

import {useContext} from "react";
import {SlideImagesContext} from "./slide-images-context";
import {imageRadius} from "@/lib/studio/images";
import {useImageUrl} from "@/lib/studio/image-store";

function StoredImage({image}){
  const url=useImageUrl(image.id);
  // Missing image: render nothing (never a broken icon in an export).
  if(!url)return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={image.alt||""} draggable={false} data-studio-image={image.id}
      style={{position:"absolute",left:image.x,top:image.y,width:image.width,height:image.height,
        objectFit:image.fit||"cover",borderRadius:imageRadius(image),display:"block",pointerEvents:"none",userSelect:"none"}}/>
  );
}

// Rendered inside CarouselCanvas. Exportable: plain absolutely positioned <img>.
export default function SlideImageLayer(){
  const images=useContext(SlideImagesContext);
  if(!images||!images.length)return null;
  return (
    <div className="studio-image-layer" style={{position:"absolute",inset:0,zIndex:30,pointerEvents:"none",overflow:"hidden"}}>
      {images.map(image=><StoredImage key={image.id} image={image}/>)}
    </div>
  );
}
