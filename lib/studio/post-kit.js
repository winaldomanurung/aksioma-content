// Caption text and share helpers for finished carousels.

export function captionFor(meta, platform) {
  const body = platform === "tiktok" ? meta.tiktokCaption : meta.instagramCaption;
  const tags = Array.isArray(meta.hashtags) ? meta.hashtags.map((t) => "#" + String(t).replace(/^#/, "")).join(" ") : "";
  return [body || "", tags].filter(Boolean).join("\n\n");
}

export function captionsFile(meta) {
  return [
    "== INSTAGRAM ==", captionFor(meta, "instagram"), "",
    "== TIKTOK ==", captionFor(meta, "tiktok"), "",
    meta.cta ? "CTA: " + meta.cta : "",
    Array.isArray(meta.keywords) && meta.keywords.length ? "Kata kunci: " + meta.keywords.join(", ") : "",
    meta.notes ? "Catatan: " + meta.notes : "",
  ].filter((line, i, all) => line !== "" || (all[i - 1] !== "" && i > 0)).join("\n").trim() + "\n";
}

// Chromium rejects a share with more than this many files (PERMISSION_DENIED,
// "Share too large"), which surfaces as NotAllowedError "Permission denied".
export const MAX_SHARE_FILES = 10;

export function canShareFiles(files) {
  try { return typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({files}); }
  catch { return false; }
}

// Opens the native share sheet with the JPEG files and the caption, so the
// person can pick Instagram or TikTok. Resolves "shared" | "cancelled".
export async function shareCarousel({files, title, text}) {
  if (files.length > MAX_SHARE_FILES) throw new Error("Menu bagikan di peramban dibatasi " + MAX_SHARE_FILES + " file sekali kirim; carousel ini " + files.length + " gambar. Gunakan Simpan semua gambar, lalu pilih dari galeri.");
  if (!canShareFiles(files)) throw new Error("Perangkat ini tidak mendukung berbagi file langsung. Simpan gambar, lalu unggah manual dari aplikasi.");
  // Files only, first. On iOS a share that mixes files with text/title is typed
  // as "image + text", which hides apps whose share extension accepts images only
  // (TikTok), and some Chromium builds refuse it outright (NotAllowedError).
  // The caption is copied to the clipboard separately instead. Text/title is a
  // last-resort fallback.
  const attempts = [{files}, {files, title, text}];
  let last;
  for (const data of attempts) {
    try { await navigator.share(data); return "shared"; }
    catch (error) {
      if (error && error.name === "AbortError") return "cancelled";
      last = error;
      if (!(error && (error.name === "NotAllowedError" || error.name === "TypeError"))) break;
    }
  }
  const reason = last && last.name === "NotAllowedError"
    ? "Peramban menolak membuka menu bagikan untuk file ini (izin ditolak). Coba kurangi jumlah slide, atau gunakan Simpan file lalu unggah manual dari galeri."
    : (last && last.message) || "Gagal membagikan.";
  throw new Error(reason);
}

// Why a share may be refused: embedded frames and in-app webviews usually block it.
export function shareEnvironment() {
  if (typeof window === "undefined") return {};
  let iframe = false;
  try { iframe = window.self !== window.top; } catch { iframe = true; }
  const ua = navigator.userAgent || "";
  return {
    secure: window.isSecureContext === true,
    iframe,
    inApp: /; wv\)|\bwv\b|Instagram|FBAN|FBAV|Line\/|TikTok|musical_ly|Claude/i.test(ua),
    hasShare: typeof navigator.share === "function",
  };
}
