// Asset Registry: only committed local SVG files are renderable in Studio.
// Add new names here only after checking source rights and export behavior.
export const iconSets = Object.freeze({
  lucide: Object.freeze([
    "brain","lightbulb","shield-check","target",
    "network","scale","message-circle","sparkles",
    "book-open","chart-no-axes-combined","compass","eye","flag",
    "handshake","layers","lock-keyhole","puzzle","rocket","search",
    "users","workflow","zap","presentation","trophy",
  ]),
  phosphor: Object.freeze([
    "brain","lightbulb","shield-check","target",
    "scales","chat-circle-text","check-circle","sparkle",
    "book-open","chart-line-up","compass","eye","flag",
    "handshake","stack","lock-key","puzzle-piece","rocket",
    "magnifying-glass","users","flow-arrow","lightning","presentation-chart","trophy",
  ]),
});
export const shapeNames = Object.freeze([
  "wave-red","orbital-rings","soft-blobs","editorial-grid",
  "contour-lines","sunburst","diagonal-stripes","dotted-field","arc-ribbon",
  "topographic","window-frames","orbit-dots","gradient-orbs","angular-path",
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

// Semantic suggestions are editorial guidance, not compulsory decorations.
export const assetUses = Object.freeze({
  "brain":"proses berpikir / bias",
  "lightbulb":"ide baru / insight",
  "shield-check":"perlindungan / verifikasi",
  "target":"fokus / tujuan",
  "network":"hubungan / sistem",
  "scale":"menimbang keputusan",
  "message-circle":"komunikasi / diskusi",
  "sparkles":"terobosan / perubahan",
  "book-open":"belajar / sumber",
  "chart-no-axes-combined":"tren / pertumbuhan (tanpa klaim angka)",
  "compass":"arah / prioritas",
  "eye":"observasi / perspektif",
  "flag":"milestone / tujuan",
  "handshake":"kolaborasi / kesepakatan",
  "layers":"lapisan / prioritas",
  "lock-keyhole":"privasi / keamanan",
  "puzzle":"memecahkan masalah",
  "rocket":"peluncuran / aksi",
  "search":"memeriksa bukti",
  "users":"kelompok / audiens",
  "workflow":"alur / proses",
  "zap":"momentum / energi",
  "presentation":"presentasi / komunikasi",
  "trophy":"pencapaian",
  "scales":"membandingkan keputusan",
  "chat-circle-text":"dialog / berpendapat",
  "check-circle":"langkah selesai",
  "sparkle":"ide / pengungkapan",
  "chart-line-up":"tren / perubahan",
  "stack":"lapisan sistem",
  "lock-key":"privasi",
  "puzzle-piece":"memecahkan masalah",
  "magnifying-glass":"riset / investigasi",
  "flow-arrow":"alur / perpindahan",
  "lightning":"aksi / energi",
  "presentation-chart":"presentasi data",
});
export const shapeUses = Object.freeze({
  "wave-red":"transisi lembut / konten reflektif",
  "orbital-rings":"fokus / perspektif / tema ilmu",
  "soft-blobs":"narasi personal / human-centric",
  "editorial-grid":"kerangka / data / struktur",
  "contour-lines":"pemikiran bertingkat / eksplorasi",
  "sunburst":"ide baru / terobosan",
  "diagonal-stripes":"kontras / momentum",
  "dotted-field":"proses / distribusi",
  "arc-ribbon":"perjalanan / progress",
  "topographic":"kedalaman / pemetaan ide",
  "window-frames":"pilihan / sudut pandang",
  "orbit-dots":"hubungan / sistem",
  "gradient-orbs":"narasi personal / mood lembut",
  "angular-path":"keputusan / perubahan arah"
});
// Palette determines foreground readability; auto/theme pair is resolved by renderer.
export const backgroundThemes = Object.freeze({
  paper:{dark:false,label:"Paper",use:"artikel / penjelasan panjang"},
  ivory:{dark:false,label:"Ivory",use:"refleksi / minimalisme"},
  sand:{dark:false,label:"Sand",use:"narasi hangat"},
  blush:{dark:false,label:"Blush",use:"emosi / relasi"},
  peach:{dark:false,label:"Peach",use:"ide / kreativitas"},
  lemon:{dark:false,label:"Lemon",use:"poin positif / harapan"},
  mint:{dark:false,label:"Mint",use:"pertumbuhan / kebiasaan"},
  ice:{dark:false,label:"Ice",use:"analisis / data"},
  lilac:{dark:false,label:"Lilac",use:"sudut pandang / refleksi"},
  graphite:{dark:true,label:"Graphite",use:"kontras / rumusan"},
  midnight:{dark:true,label:"Midnight",use:"analisis serius"},
  navy:{dark:true,label:"Navy",use:"teknis / strategi"},
  forest:{dark:true,label:"Forest",use:"kemajuan / pertumbuhan"},
  plum:{dark:true,label:"Plum",use:"introspeksi / psikologi"},
  wine:{dark:true,label:"Wine",use:"ketegasan / konflik"},
  ember:{dark:true,label:"Ember",use:"urgensi / aksi"},
  cobalt:{dark:true,label:"Cobalt",use:"teknologi / kejelasan"},
  teal:{dark:true,label:"Teal",use:"sistem / metode"}
});
export const backgroundNames = Object.freeze(Object.keys(backgroundThemes));
