// Asset Registry: only committed local SVG files are renderable in Studio.
// Add new names here only after checking source rights and export behavior.
export const iconSets = Object.freeze({
  lucide: Object.freeze([
    "brain","lightbulb","shield-check","target",
    "network","scale","message-circle","sparkles",
  ]),
  phosphor: Object.freeze([
    "brain","lightbulb","shield-check","target",
    "scales","chat-circle-text","check-circle","sparkle",
  ]),
});
export const shapeNames = Object.freeze([
  "wave-red","orbital-rings","soft-blobs","editorial-grid",
]);
export const iconSizes = Object.freeze({sm:52,md:88,lg:132});
export const tones = Object.freeze(["ink","accent","light"]);
export const shapePositions = Object.freeze(["full","topRight","bottomRight","bottomLeft"]);
export const shapeOpacity = Object.freeze(["subtle","soft","bold"]);
export function iconPath(set,name){
  if(!Object.prototype.hasOwnProperty.call(iconSets,set) || !iconSets[set].includes(name))return null;
  return "/assets/icons/"+set+"/"+name+".svg";
}
export function shapePath(name){
  return shapeNames.includes(name)?"/assets/decorative/"+name+".svg":null;
}
export const assetCatalog = Object.freeze([
  ...Object.entries(iconSets).flatMap(([set,names])=>names.map(name=>({
    type:"assetIcon",set,name,src:iconPath(set,name),category:"icon",
  }))),
  ...shapeNames.map(name=>({
    type:"assetShape",name,src:shapePath(name),category:"shape",
  })),
]);
