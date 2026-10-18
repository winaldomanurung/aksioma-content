"use client";

import {useImageUrl} from "@/lib/studio/image-store";

// An image that fills its parent, read from the browser image library by id.
// Without an id (or when the image is missing in this browser) it renders a
// neutral block, so layouts stay identical and exports never show a broken icon.
export default function StoredImageBox({id,fit="cover",alt="",radius,className="",style,dark=false}){
  const url=useImageUrl(id);
  const base={position:"relative",width:"100%",height:"100%",overflow:"hidden",borderRadius:radius,
    background:dark?"rgba(255,255,255,.1)":"rgba(0,0,0,.07)",...style};
  return (
    <div className={className} style={base} data-image-slot={id||"empty"}>
      {url?(
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} draggable={false} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:fit,display:"block"}}/>
      ):null}
    </div>
  );
}
