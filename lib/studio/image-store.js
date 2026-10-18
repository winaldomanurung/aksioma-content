"use client";

import {useEffect,useSyncExternalStore} from "react";

// Browser-only storage for images the user uploads. Bytes live in IndexedDB;
// slide JSON references them by id (see lib/studio/images.js).

const DB_NAME = "aksioma-studio-images";
const STORE = "images";
const MAX_SIDE = 2400;
const MAX_BYTES = 12 * 1024 * 1024;

let dbPromise = null;
function openDb() {
  if (typeof indexedDB === "undefined") return Promise.reject(new Error("Penyimpanan gambar tidak tersedia di browser ini."));
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => request.result.createObjectStore(STORE);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error("IndexedDB gagal dibuka."));
    }).catch((error) => { dbPromise = null; throw error; });
  }
  return dbPromise;
}
function run(mode, action) {
  return openDb().then((db) => new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const request = action(tx.objectStore(STORE));
    tx.oncomplete = () => resolve(request?.result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error || new Error("Transaksi dibatalkan."));
  }));
}

// ---- object URL cache + subscriptions ----
const urls = new Map();      // id -> object URL | null (known missing)
const loading = new Map();   // id -> Promise
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn());
export function subscribeImages(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export function peekImageUrl(id) { return urls.get(id); }

export function loadImageUrl(id) {
  if (urls.has(id) && urls.get(id)) return Promise.resolve(urls.get(id));
  if (loading.has(id)) return loading.get(id);
  const task = run("readonly", (store) => store.get(id)).then((record) => {
    const url = record?.blob ? URL.createObjectURL(record.blob) : null;
    urls.set(id, url);
    loading.delete(id);
    emit();
    return url;
  }).catch(() => { urls.set(id, null); loading.delete(id); emit(); return null; });
  loading.set(id, task);
  return task;
}

export async function putImage(id, blob, meta = {}) {
  await run("readwrite", (store) => store.put({blob, name: meta.name || id, width: meta.width, height: meta.height, savedAt: Date.now()}, id));
  const old = urls.get(id);
  if (old) URL.revokeObjectURL(old);
  urls.set(id, URL.createObjectURL(blob));
  emit();
  refreshImageList();
}

export async function deleteImage(id) {
  await run("readwrite", (store) => store.delete(id));
  const old = urls.get(id);
  if (old) URL.revokeObjectURL(old);
  urls.delete(id);
  emit();
  refreshImageList();
}

export async function hasImage(id) {
  const record = await run("readonly", (store) => store.get(id));
  return Boolean(record?.blob);
}

// Reads natural size so a new image keeps its aspect ratio.
export async function readNaturalSize(blob) {
  const url = URL.createObjectURL(blob);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = () => reject(new Error("File bukan gambar yang bisa dibaca.")); img.src = url; });
    return {width: img.naturalWidth, height: img.naturalHeight, element: img};
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Validates and downsizes an upload (keeps transparency for PNG/WebP/GIF).
export async function prepareUpload(file) {
  if (!file || !/^image\//.test(file.type)) throw new Error("Pilih file gambar (JPG, PNG, WebP, atau GIF).");
  if (file.size > MAX_BYTES) throw new Error("Gambar terlalu besar (maksimal 12 MB).");
  if (file.type === "image/svg+xml") throw new Error("SVG tidak didukung untuk upload. Gunakan PNG/JPG/WebP.");
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    await new Promise((resolve, reject) => { img.onload = resolve; img.onerror = () => reject(new Error("Gambar tidak bisa dibaca.")); img.src = url; });
    const {naturalWidth: w, naturalHeight: h} = img;
    if (!w || !h) throw new Error("Gambar kosong.");
    if (Math.max(w, h) <= MAX_SIDE) return {blob: file, width: w, height: h, name: file.name};
    const ratio = MAX_SIDE / Math.max(w, h);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(w * ratio);
    canvas.height = Math.round(h * ratio);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    const alpha = /png|webp|gif/.test(file.type);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, alpha ? "image/png" : "image/jpeg", 0.92));
    if (!blob) return {blob: file, width: w, height: h, name: file.name};
    return {blob, width: canvas.width, height: canvas.height, name: file.name};
  } finally {
    URL.revokeObjectURL(url);
  }
}

// ---- library listing (for pickers) ----
let listSnapshot = {rows: [], loaded: false};
let listLoaded = false;
export function getImageList() { return listSnapshot; }
export async function refreshImageList() {
  try {
    const db = await openDb();
    const rows = await new Promise((resolve, reject) => {
      const out = [];
      const tx = db.transaction(STORE, "readonly");
      const request = tx.objectStore(STORE).openCursor();
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) { out.push({id: cursor.key, name: cursor.value?.name || cursor.key, width: cursor.value?.width, height: cursor.value?.height, savedAt: cursor.value?.savedAt || 0}); cursor.continue(); }
        else resolve(out);
      };
      request.onerror = () => reject(request.error);
    });
    rows.sort((a, b) => b.savedAt - a.savedAt);
    listSnapshot = {rows, loaded: true};
  } catch { listSnapshot = {rows: [], loaded: true}; }
  listLoaded = true;
  emit();
}
const SERVER_SNAPSHOT = {rows: [], loaded: false};
// {rows:[{id,name,width,height}], loaded:boolean}
export function useImageLibrary() {
  const snapshot = useSyncExternalStore(subscribeImages, getImageList, () => SERVER_SNAPSHOT);
  useEffect(() => { if (!listLoaded) refreshImageList(); }, []);
  return snapshot;
}
export function useImageUrl(id) {
  const url = useSyncExternalStore(subscribeImages, () => (id ? peekImageUrl(id) : null), () => undefined);
  useEffect(() => { if (id) loadImageUrl(id); }, [id]);
  return url;
}

// Validate, downsize, and store one uploaded file. Returns its new id and size.
export async function saveUpload(file, newId) {
  const prepared = await prepareUpload(file);
  const id = newId();
  await putImage(id, prepared.blob, {name: prepared.name, width: prepared.width, height: prepared.height});
  await refreshImageList();
  return {id, width: prepared.width, height: prepared.height, name: prepared.name};
}
