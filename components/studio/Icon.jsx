// Satu set ikon garis (24px, stroke 2) untuk seluruh UI Studio, supaya tidak
// ada glyph Unicode yang dipakai sebagai ikon. Hanya dekoratif: beri teks atau
// aria-label pada tombolnya.
const PATHS={
  "arrow-up-right":"M7 17 17 7M8 7h9v9",
  "arrow-left":"M19 12H5m6-6-6 6 6 6",
  "arrow-right":"M5 12h14m-6-6 6 6-6 6",
  "chevron-left":"m15 18-6-6 6-6",
  "chevron-right":"m9 18 6-6-6-6",
  "chevron-down":"m6 9 6 6 6-6",
  close:"M18 6 6 18M6 6l12 12",
  menu:"M4 6h16M4 12h16M4 18h16",
  download:"M12 3v12m-5-5 5 5 5-5M5 21h14",
  pencil:"M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z",
  alert:"M12 9v4m0 4h.01M10.3 3.9 2.4 17.5A2 2 0 0 0 4.1 20.5h15.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z",
  check:"m5 12 5 5L20 7",
  eye:"M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  code:"m16 18 6-6-6-6M8 6l-6 6 6 6",
  share:"M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4m4-4v13",
  grid:"M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  sliders:"M4 6h10m4 0h2M4 12h4m4 0h8M4 18h12m4 0h0M16 4v4M10 10v4M18 16v4",
};
export default function Icon({name,size=18,className=""}){
  const d=PATHS[name];
  if(!d)return null;
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"flex-none "+className}><path d={d}/></svg>;
}
