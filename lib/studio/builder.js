// Pure helpers for the per-component form builder (no React, no browser APIs).
import {ALL_SPECS, SLIDE_SPECS, PRIMITIVE_SPECS} from "./component-specs";

export const CHILD_TYPES = ["infoCard", "statCard", "callout", "pill", "bigNumber", "quoteCard", "diagramNode"];
export const NODE_TYPES = Object.keys(PRIMITIVE_SPECS).filter((n) => !["twoColumn", "threeColumn", "contentGrid", "stack"].includes(n) || true);

export const clone = (value) => JSON.parse(JSON.stringify(value));

const isEmpty = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length) ||
  (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length);

// Turns raw form state into clean JSON: trims, drops empty optional values,
// converts numeric selects, and recurses into groups, lists and child nodes.
export function cleanValue(data, fields) {
  const out = {};
  if (data && data.type) out.type = data.type;
  for (const f of fields) {
    const raw = data ? data[f.key] : undefined;
    let value;
    switch (f.type) {
      case "text":
      case "textarea":
        value = typeof raw === "string" ? raw.trim() : undefined;
        break;
      case "select":
        value = raw === "" || raw === undefined || raw === null ? undefined : (f.valueType === "number" ? Number(raw) : raw);
        break;
      case "bool":
        value = raw === true ? true : undefined;
        break;
      case "group":
        value = cleanValue(raw || {}, f.fields);
        break;
      case "list":
        if (f.item === "string") value = (Array.isArray(raw) ? raw : []).map((x) => String(x ?? "").trim()).filter(Boolean);
        else value = (Array.isArray(raw) ? raw : []).map((item) => cleanValue(item || {}, f.item)).filter((item) => Object.keys(item).length);
        break;
      case "nodes":
      case "children":
        value = (Array.isArray(raw) ? raw : []).map((node) => cleanNode(node)).filter(Boolean);
        break;
      default:
        value = undefined;
    }
    if (value === undefined || (typeof value === "string" && !value)) continue;
    if (Array.isArray(value) && !value.length && !f.required) continue;
    if (!Array.isArray(value) && typeof value === "object" && !Object.keys(value).length) continue;
    out[f.key] = value;
  }
  return out;
}

export function cleanNode(node) {
  const spec = node && ALL_SPECS[node.type];
  if (!spec) return null;
  return {...cleanValue(node, spec.fields), type: node.type};
}

export function previewSlideFor(name, data) {
  if (SLIDE_SPECS[name]) return {...cleanValue(data, SLIDE_SPECS[name].fields), type: name};
  const node = cleanNode({...data, type: name});
  return {type: "freeform", eyebrow: "Contoh", nodes: [node]};
}

export function nodeFor(name, data) {
  return cleanNode({...data, type: name});
}

export function carouselFor(slide, title) {
  return {version: 1, meta: {title: title || "Contoh komponen", account: "journey"}, slides: [slide]};
}

export function previewPosition(name) {
  if (name === "hero") return {number: 1, total: 10};
  if (name === "cta") return {number: 10, total: 10};
  return {number: 2, total: 10};
}

export const isSlideSpec = (name) => Boolean(SLIDE_SPECS[name]);
export const hasValue = (v) => !isEmpty(v);
