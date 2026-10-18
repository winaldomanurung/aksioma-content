"use client";

import {backgroundThemes} from "@/lib/studio/assets";
import {ALL_SPECS,TIER_LENGTHS,charLimit,fieldCountLimits} from "@/lib/studio/component-specs";
import {CHILD_TYPES,clone} from "@/lib/studio/builder";

const inputClass="mt-1 w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-red-400";
const NODE_CHOICES=Object.keys(ALL_SPECS).filter(name=>ALL_SPECS[name].kind!=="slide");

function counterFor(field,value){
  const length=typeof value==="string"?value.length:0;
  let rec=null,hard=null;
  if(field.limit){const c=charLimit(field.limit);if(c){rec=c.recommended;hard=c.hard;}}
  else if(field.max){hard=field.max;rec=Math.floor(field.max*.7);}
  else if(field.itemKind&&TIER_LENGTHS.M[field.itemKind]){rec=TIER_LENGTHS.M[field.itemKind];hard=TIER_LENGTHS.L[field.itemKind];}
  if(hard===null)return null;
  const tone=length>hard?"text-red-700":length>rec?"text-amber-700":"text-zinc-500";
  return <span className={"text-[11px] "+tone}>{length} / ideal {rec} · maks {hard}</span>;
}

function CountBadge({count,limits}){
  const tone=count>limits.hard?"bg-red-100 text-red-800":count>limits.recommended?"bg-amber-100 text-amber-900":"bg-emerald-100 text-emerald-900";
  return <span className={"rounded-full px-2.5 py-1 text-[11px] font-semibold "+tone}>{count} item · rekomendasi {limits.recommended} · maks {limits.hard}</span>;
}

function blankFor(fields){
  const out={};
  for(const f of fields){
    if(f.type==="list")out[f.key]=[];
    else if(f.type==="group")out[f.key]=blankFor(f.fields);
    else if(f.type==="bool")out[f.key]=false;
    else out[f.key]="";
  }
  return out;
}

function Field({field,value,onChange,ctx}){
  const id="f-"+field.key+"-"+(ctx.path||"");
  const label=<span className="text-xs font-semibold text-zinc-700">{field.label}{field.required?<span className="text-red-600"> *</span>:null}</span>;
  switch(field.type){
    case "text":
      return <label className="block" htmlFor={id}>{label}
        <input id={id} className={inputClass} value={value??""} placeholder={field.placeholder} onChange={e=>onChange(e.target.value)}/>
        <div className="mt-1">{counterFor(field,value)}</div></label>;
    case "textarea":
      return <label className="block" htmlFor={id}>{label}
        <textarea id={id} rows={3} className={inputClass} value={value??""} onChange={e=>onChange(e.target.value)}/>
        <div className="mt-1">{counterFor(field,value)}</div></label>;
    case "select": {
      const options=field.dynamic==="themes"?Object.keys(backgroundThemes):field.options;
      return <label className="block" htmlFor={id}>{label}
        <select id={id} className={inputClass} value={value??""} onChange={e=>onChange(e.target.value)}>
          <option value="">(bawaan)</option>
          {options.map(option=><option key={option} value={option}>{String(option)}</option>)}
        </select></label>;
    }
    case "bool":
      return <label className="flex items-center gap-2 text-sm" htmlFor={id}>
        <input id={id} type="checkbox" checked={value===true} onChange={e=>onChange(e.target.checked)}/>{field.label}</label>;
    case "group":
      return <fieldset className="rounded-xl border border-black/10 p-3">
        <legend className="px-1 text-xs font-bold text-zinc-700">{field.label}</legend>
        <Fields fields={field.fields} value={value||{}} onChange={onChange} ctx={{...ctx,path:(ctx.path||"")+field.key+"."}}/>
      </fieldset>;
    case "list":
      return <ListField field={field} value={value} onChange={onChange} ctx={ctx} label={label}/>;
    case "nodes":
    case "children":
      return <NodeList field={field} value={value} onChange={onChange} ctx={ctx} label={label}/>;
    default:
      return null;
  }
}

function ListField({field,value,onChange,ctx,label}){
  const list=Array.isArray(value)?value:[];
  const limits=fieldCountLimits(field,{keywords:ctx.keywords});
  const filled=list.length;
  const update=(i,item)=>onChange(list.map((x,j)=>j===i?item:x));
  const remove=i=>onChange(list.filter((_,j)=>j!==i));
  const add=()=>onChange([...list,field.item==="string"?"":blankFor(field.item)]);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">{label}<CountBadge count={filled} limits={limits}/></div>
      {field.hint?<p className="mt-1 text-[11px] text-zinc-500">{field.hint}</p>:null}
      <ul className="mt-2 space-y-2">
        {list.map((item,i)=>(
          <li key={i} className="rounded-xl border border-black/10 bg-zinc-50 p-2">
            <div className="flex items-start gap-2">
              <span className="mt-2 w-5 text-center text-[11px] font-bold text-zinc-400">{i+1}</span>
              <div className="min-w-0 flex-1">
                {field.item==="string"
                  ? <div><input aria-label={field.label+" "+(i+1)} className={inputClass} value={item??""} onChange={e=>update(i,e.target.value)}/>
                      <div className="mt-1">{counterFor(field,item)}</div></div>
                  : <Fields fields={field.item} value={item||{}} onChange={v=>update(i,v)} ctx={{...ctx,path:(ctx.path||"")+field.key+i+"."}}/>}
              </div>
              <button type="button" onClick={()=>remove(i)} aria-label={"Hapus item "+(i+1)} className="rounded-full px-2 py-1 text-xs text-red-700 hover:bg-red-50">✕</button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={add} disabled={list.length>=limits.hard} className="mt-2 rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold disabled:opacity-40">+ Tambah item</button>
      {list.length>=limits.hard?<span className="ml-2 text-[11px] text-red-700">Batas maksimum terukur tercapai.</span>:null}
    </div>
  );
}

function NodeList({field,value,onChange,ctx,label}){
  const list=Array.isArray(value)?value:[];
  const limits=fieldCountLimits(field,ctx);
  const choices=field.type==="children"?CHILD_TYPES:NODE_CHOICES;
  const update=(i,item)=>onChange(list.map((x,j)=>j===i?item:x));
  const remove=i=>onChange(list.filter((_,j)=>j!==i));
  const move=(i,d)=>{const j=i+d;if(j<0||j>=list.length)return;const next=[...list];[next[i],next[j]]=[next[j],next[i]];onChange(next);};
  const add=type=>onChange([...list,clone(ALL_SPECS[type].sample)]);
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">{label}<CountBadge count={list.length} limits={limits}/></div>
      <ul className="mt-2 space-y-3">
        {list.map((node,i)=>{
          const spec=ALL_SPECS[node.type];
          return (
            <li key={i} className="rounded-xl border border-black/10 bg-zinc-50 p-3">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <select aria-label={"Tipe item "+(i+1)} className="rounded-lg border border-black/15 bg-white px-2 py-1 text-xs font-semibold" value={node.type}
                  onChange={e=>update(i,clone(ALL_SPECS[e.target.value].sample))}>
                  {choices.map(type=><option key={type} value={type}>{ALL_SPECS[type].label}</option>)}
                </select>
                <span className="ml-auto flex gap-1">
                  <button type="button" onClick={()=>move(i,-1)} aria-label="Naik" className="rounded-full px-2 py-1 text-xs hover:bg-white">↑</button>
                  <button type="button" onClick={()=>move(i,1)} aria-label="Turun" className="rounded-full px-2 py-1 text-xs hover:bg-white">↓</button>
                  <button type="button" onClick={()=>remove(i)} aria-label="Hapus" className="rounded-full px-2 py-1 text-xs text-red-700 hover:bg-red-50">✕</button>
                </span>
              </div>
              {spec?<Fields fields={spec.fields.filter(f=>f.type!=="nodes"&&!(field.type==="children"&&f.type==="children"))} value={node} onChange={v=>update(i,{...v,type:node.type})} ctx={{...ctx,path:(ctx.path||"")+field.key+i+"."}}/>:null}
            </li>
          );
        })}
      </ul>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-zinc-500">Tambah:</span>
        {choices.map(type=><button key={type} type="button" disabled={list.length>=limits.hard} onClick={()=>add(type)}
          className="rounded-full border border-black/15 px-2.5 py-1 text-[11px] font-semibold hover:bg-zinc-50 disabled:opacity-40">{ALL_SPECS[type].label}</button>)}
      </div>
    </div>
  );
}

export function Fields({fields,value,onChange,ctx={}}){
  const hasKeywords=Array.isArray(value?.keywords)&&value.keywords.some(k=>String(k).trim());
  const columns=ctx.columns??(Array.isArray(value?.columns)?value.columns.filter(c=>String(c).trim()).length||undefined:undefined);
  const context={...ctx,keywords:ctx.keywords??hasKeywords,columns};
  return (
    <div className="space-y-3">
      {fields.map(field=>(
        <Field key={field.key} field={field} value={value?.[field.key]} ctx={context}
          onChange={next=>onChange({...value,[field.key]:next})}/>
      ))}
    </div>
  );
}

export default function SpecForm({fields,value,onChange}){
  return <Fields fields={fields} value={value} onChange={onChange}/>;
}
