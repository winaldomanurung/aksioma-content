"use client";
// Brand kit: pengaturan akun yang disimpan di browser ini (localStorage) dan dipakai
// cover/CTA, caption, serta tampilan/font bawaan. Sengaja tidak ada di JSON carousel:
// JSON tetap portabel, kit milik pemakai. Tanpa kit tersimpan, semua nilai bawaan.
import {useSyncExternalStore} from "react";
import {isLookId, DEFAULT_LOOK} from "./looks";
import {isFontId, DEFAULT_FONT} from "./fonts";

import {DEFAULT_ACCOUNT, ACCOUNTS, accountOf} from "./accounts";
import {readAccount, useAccount} from "./account-store";

// Kit disimpan per akun. Kunci Trader sengaja tidak berubah supaya kit lama tetap terbaca.
export const BRAND_KEY = "aksioma-brand-kit-v1";
const BRAND_KEYS = {trader: BRAND_KEY, journey: "aksioma-brand-kit-journey-v1"};
const keyOf = (account) => BRAND_KEYS[accountOf(account)];
const EVENT = "aksioma-brand-change";

export const DEFAULT_DISCLAIMER = "Konten edukasi, bukan ajakan membeli atau menjual.";
export const DEFAULT_BRAND = Object.freeze({
  handle: ACCOUNTS.trader.handle,
  website: ACCOUNTS.trader.website,
  disclaimer: DEFAULT_DISCLAIMER,
  disclaimerOnCta: true,
  disclaimerInCaption: true,
  sourcesInCaption: true,
  hashtags: [],
  look: DEFAULT_LOOK,
  font: DEFAULT_FONT,
});
// Journey membahas topik umum, jadi disclaimer investasi mati secara bawaan.
const DEFAULT_BRANDS = Object.freeze({
  trader: DEFAULT_BRAND,
  journey: Object.freeze({...DEFAULT_BRAND, handle: ACCOUNTS.journey.handle, website: ACCOUNTS.journey.website, disclaimer: "", disclaimerOnCta: false, disclaimerInCaption: false}),
});
export const defaultBrand = (account = DEFAULT_ACCOUNT) => DEFAULT_BRANDS[accountOf(account)];

const clip = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");

// Cleans anything read from storage or an imported file into a complete kit.
export function normalizeBrand(raw, account = DEFAULT_ACCOUNT) {
  const r = raw && typeof raw === "object" ? raw : {};
  const d = defaultBrand(account);
  let handle = clip(r.handle, 40) || d.handle;
  if (!handle.startsWith("@")) handle = "@" + handle;
  const tags = Array.isArray(r.hashtags) ? r.hashtags : typeof r.hashtags === "string" ? r.hashtags.split(/[\s,]+/) : d.hashtags;
  const hashtags = [...new Set(tags.map((t) => String(t).replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "")).filter(Boolean))].slice(0, 12);
  return {
    handle,
    website: clip(r.website, 60) || d.website,
    disclaimer: typeof r.disclaimer === "string" ? clip(r.disclaimer, 140) : d.disclaimer,
    disclaimerOnCta: r.disclaimerOnCta === undefined ? d.disclaimerOnCta : r.disclaimerOnCta !== false,
    disclaimerInCaption: r.disclaimerInCaption === undefined ? d.disclaimerInCaption : r.disclaimerInCaption !== false,
    sourcesInCaption: r.sourcesInCaption !== false,
    hashtags,
    look: isLookId(r.look) ? r.look : d.look,
    font: isFontId(r.font) ? r.font : d.font,
  };
}

// One cached snapshot per account so useSyncExternalStore gets a stable value.
const cache = {};
function snapshot(account) {
  const id = accountOf(account);
  let raw = null;
  try { raw = window.localStorage.getItem(keyOf(id)); } catch {}
  const hit = cache[id];
  if (hit && hit.raw === raw) return hit.value;
  let value = defaultBrand(id);
  try { if (raw) value = normalizeBrand(JSON.parse(raw), id); } catch { value = defaultBrand(id); }
  cache[id] = {raw, value};
  return value;
}
function subscribe(cb) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("storage", cb); window.removeEventListener(EVENT, cb); };
}
// `account` omitted = the account currently active in the navigation.
export function useBrand(account) {
  const active = useAccount();
  const id = accountOf(account, active);
  return useSyncExternalStore(subscribe, () => snapshot(id), () => defaultBrand(id));
}
export function readBrand(account) {
  const id = accountOf(account, readAccount());
  return typeof window === "undefined" ? defaultBrand(id) : snapshot(id);
}
export function saveBrand(value, account) {
  const id = accountOf(account, readAccount());
  const next = normalizeBrand(value, id);
  try { window.localStorage.setItem(keyOf(id), JSON.stringify(next)); } catch { throw new Error("Browser menolak menyimpan kit (penyimpanan penuh atau diblokir)."); }
  window.dispatchEvent(new Event(EVENT));
  return next;
}
export function resetBrand(account) {
  const id = accountOf(account, readAccount());
  try { window.localStorage.removeItem(keyOf(id)); } catch {}
  window.dispatchEvent(new Event(EVENT));
}
