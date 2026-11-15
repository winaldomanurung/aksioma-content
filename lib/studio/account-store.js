"use client";
// Akun aktif di perangkat ini (localStorage). Dipakai navigasi, Studio, Template AI,
// dan halaman lain yang perlu tahu sedang bekerja untuk akun mana.
import {useSyncExternalStore} from "react";
import {DEFAULT_ACCOUNT, accountOf} from "./accounts";

export const ACCOUNT_KEY = "aksioma-account-v1";
export const ACCOUNT_EVENT = "aksioma-account-change";
const EVENT = ACCOUNT_EVENT;

function snapshot() {
  try { return accountOf(window.localStorage.getItem(ACCOUNT_KEY)); } catch { return DEFAULT_ACCOUNT; }
}
function subscribe(cb) {
  window.addEventListener("storage", cb);
  window.addEventListener(EVENT, cb);
  return () => { window.removeEventListener("storage", cb); window.removeEventListener(EVENT, cb); };
}
// Akun aktif di perangkat ini. Server dan render pertama selalu memakai default.
export function useAccount() {
  return useSyncExternalStore(subscribe, snapshot, () => DEFAULT_ACCOUNT);
}
export function readAccount() {
  return typeof window === "undefined" ? DEFAULT_ACCOUNT : snapshot();
}
export function setAccount(value) {
  const next = accountOf(value);
  try { window.localStorage.setItem(ACCOUNT_KEY, next); } catch { /* private browsing: pilihan hanya berlaku sampai halaman dimuat ulang */ }
  window.dispatchEvent(new Event(EVENT));
  return next;
}
