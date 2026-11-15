// Logo Aksioma Content: ikon lucide "gallery-horizontal-end" (slide carousel)
// di atas ubin merah Aksioma. Gambarnya sama dengan app/icon.svg (favicon).
const ICON='<g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.1"><path d="M2 7v10M6 5v14"/><rect width="12" height="18" x="10" y="3" rx="2"/></g>';
export default function Logo({size=32,className=""}){
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} className={className} aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#dc2626"/>
      <g transform="translate(5 5) scale(.9166)" dangerouslySetInnerHTML={{__html:ICON}}/>
    </svg>
  );
}
