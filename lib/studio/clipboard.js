"use client";

// First try the modern clipboard API. Browsers embedded in social apps, iOS,
// or non-secure contexts may reject it even for a direct button click.
// execCommand works as a fallback and also leaves the content selectable.
export async function copyText(value, fallbackElement) {
  const text = String(value ?? "");
  if (!text) throw new Error("Tidak ada teks untuk disalin.");
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return "clipboard";
    } catch { /* Fall back to selection-based copying. */ }
  }
  const input = fallbackElement || document.createElement("textarea");
  const temporary = !fallbackElement;
  if (temporary) {
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.cssText =
      "position:fixed;top:0;left:0;opacity:0;z-index:-1;width:1px;height:1px;";
    document.body.appendChild(input);
  }
  const previous = document.activeElement;
  input.focus();
  input.select();
  input.setSelectionRange(0, input.value.length);
  const copied = typeof document.execCommand === "function" &&
    document.execCommand("copy");
  if (temporary) input.remove();
  if (previous?.focus) previous.focus();
  if (!copied) {
    if (fallbackElement) {
      fallbackElement.focus();
      fallbackElement.select();
    }
    throw new Error("Browser memblokir clipboard. Pilih teks di kotak, lalu gunakan Salin/Copy.");
  }
  return "fallback";
}
