import {iconPath,iconSizes,shapePath} from "@/lib/studio/assets";

export function AssetIcon({set="lucide",name,size="md",tone="ink",label=""}){
  const src=iconPath(set,name);
  if(!src)return null;
  return (
    <div className={"studio-asset-icon studio-asset-icon--"+tone} aria-label={label||name}
      title={label||name} role="img">
      <div className="studio-asset-icon-image">
        {/* Explicit local SVG paths; no arbitrary image URLs are accepted. */}
        <img src={src} width={iconSizes[size]||88} height={iconSizes[size]||88} alt="" draggable="false"/>
      </div>
      {label?<p className="studio-asset-icon-label">{label}</p>:null}
    </div>
  );
}

export function AssetShape({name,position="full",opacity="soft"}){
  const src=shapePath(name);
  if(!src)return null;
  return (
    <div aria-hidden="true"
      className={"studio-asset-decoration studio-asset-decoration--"+position+" studio-asset-decoration--"+opacity}>
      <img src={src} alt="" draggable="false"/>
    </div>
  );
}
