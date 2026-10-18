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

export function canShareFiles(files) {
  try { return typeof navigator !== "undefined" && typeof navigator.canShare === "function" && navigator.canShare({files}); }
  catch { return false; }
}

// Opens the native share sheet with the JPEG files and the caption, so the
// person can pick Instagram or TikTok. Resolves "shared" | "cancelled".
export async function shareCarousel({files, title, text}) {
  if (!canShareFiles(files)) throw new Error("Perangkat ini tidak mendukung berbagi file langsung. Simpan gambar, lalu unggah manual dari aplikasi.");
  try { await navigator.share({files, title, text}); return "shared"; }
  catch (error) {
    if (error && error.name === "AbortError") return "cancelled";
    throw error;
  }
}
