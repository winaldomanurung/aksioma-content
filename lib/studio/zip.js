// ZIP (stored entries) implementation; no dependencies or server required.
// CRC-32 + local headers + central directory, sufficient for JPEG files.
const table=new Uint32Array(256);
for(let i=0;i<256;i++){let c=i;for(let j=0;j<8;j++)c=c&1?0xedb88320^(c>>>1):c>>>1;table[i]=c>>>0;}
const enc=new TextEncoder();
function crc32(bytes){let c=0xffffffff;for(const byte of bytes)c=table[(c^byte)&255]^(c>>>8);return(c^0xffffffff)>>>0;}
function write16(v,o,n){v.setUint16(o,n,true);}
function write32(v,o,n){v.setUint32(o,n>>>0,true);}
export async function makeZip(files){
  const parts=[],central=[];
  let offset=0;
  for(const file of files){
    const name=enc.encode(file.name);
    if(name.length>65535)throw Error("Nama file terlalu panjang.");
    const bytes=new Uint8Array(await file.blob.arrayBuffer());
    const crc=crc32(bytes);
    const local=new Uint8Array(30+name.length);
    const a=new DataView(local.buffer);
    write32(a,0,0x04034b50);write16(a,4,20);write16(a,6,0);write16(a,8,0);
    write16(a,10,0);write16(a,12,33);write32(a,14,crc);
    write32(a,18,bytes.length);write32(a,22,bytes.length);
    write16(a,26,name.length);write16(a,28,0);local.set(name,30);
    parts.push(local,bytes);
    const record=new Uint8Array(46+name.length),v=new DataView(record.buffer);
    write32(v,0,0x02014b50);write16(v,4,20);write16(v,6,20);
    write16(v,8,0);write16(v,10,0);write16(v,12,0);write16(v,14,33);
    write32(v,16,crc);write32(v,20,bytes.length);write32(v,24,bytes.length);
    write16(v,28,name.length);write16(v,30,0);write16(v,32,0);
    write16(v,34,0);write16(v,36,0);write32(v,38,0);write32(v,42,offset);
    record.set(name,46);central.push(record);offset+=local.length+bytes.length;
  }
  const centralLength=central.reduce((n,p)=>n+p.length,0);
  const end=new Uint8Array(22),v=new DataView(end.buffer);
  write32(v,0,0x06054b50);write16(v,4,0);write16(v,6,0);
  write16(v,8,files.length);write16(v,10,files.length);
  write32(v,12,centralLength);write32(v,16,offset);write16(v,20,0);
  return new Blob([...parts,...central,end],{type:"application/zip"});
}
